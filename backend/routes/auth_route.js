const express = require('express'); 
const router = express.Router(); 
const usermodel = require('../models/user');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const passport=require('passport');
const User=require('../models/user');
const path=require('path');
const upload=require('../middleware/upload');
const Emergency = require('../models/Emergency');
const RescueTeam = require("../models/RescueTeam");
const Shelter=require('../models/Shelter');
const opencage = require("opencage-api-client");
const puppeteer =require('puppeteer')





router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(cookieParser());
router.use(express.static(path.join(__dirname,'public')));


router.get('/login', (req, res) => {
    res.render('login');
});


router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/report', upload.array('images', 5), async (req, res) => {
    try {
        console.log("Received Body:", req.body);
        console.log("Received Files:", req.files);

        const { latitude, longitude, description } = req.body;

        // Convert latitude and longitude to numbers and validate
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: "Latitude and longitude must be valid numbers" });
        }

        // Ensure description is always a string
        const safeDescription = description ? String(description) : "No additional details provided";

        // Extract image URLs from uploaded files
        const images = req.files?.length > 0 ? req.files.map(file => file.path) : [];

        // Get the state from the emergency coordinates
        const state = await getStateFromCoordinates(lat, lon);
        if (!state) return res.status(400).json({ message: "State not found" });

        // Fetch all rescue teams & shelters
        const allRescueTeams = await RescueTeam.find();
        const allShelters = await Shelter.find();

        // Filter rescue teams by matching state
        const rescueTeams = [];
        for (const team of allRescueTeams) {
            const teamState = await getStateFromCoordinates(team.lat, team.lon);
            if (teamState === state) {
                rescueTeams.push(team);
                if (rescueTeams.length >= 3) break; // Limit to 3 results
            }
        }

        // Filter shelters by matching state
        const shelters = [];
        for (const shelter of allShelters) {
            const shelterState = await getStateFromCoordinates(shelter.lat, shelter.lon);
            if (shelterState === state) {
                shelters.push(shelter);
                if (shelters.length >= 3) break; // Limit to 3 results
            }
        }

        console.log(rescueTeams);
        console.log(shelters);

        // Create new emergency report
        const emergency = new Emergency({
            latitude: lat,
            longitude: lon,
            description: safeDescription,
            images,
            state,
            timestamp: new Date().toISOString(),
        });

        await emergency.save();

        res.status(201).json({ 
            message: "Emergency reported successfully", 
            emergency: {
                id: emergency._id,
                latitude: emergency.latitude,
                longitude: emergency.longitude,
                description: emergency.description,
                images: emergency.images,  
                state: emergency.state,
                timestamp: emergency.timestamp,
            },
            rescueTeams,
            shelters
        });

    } catch (error) {
        console.error("Error processing emergency report:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


const getStateFromCoordinates = async (latitude, longitude) => {
    try {
        const data = await opencage.geocode({ q: `${latitude},${longitude}`, language: "en" });

        console.log("OpenCage API Response:", JSON.stringify(data, null, 2));

        if (data.status.code === 200 && data.results.length > 0) {
            const components = data.results[0].components;

            // Extract state
            const state = components.state || null;

            if (!state) {
                console.warn("State not found in response components:", components);
                return null;
            }

            console.log("Extracted State:", state);
            return state;
        } else {
            console.warn("No valid results from OpenCage API.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching state:", error.message);
        return null;
    }
};



router.post("/rescueteam", async (req, res) => {
    try {
      const { name, contactNumber, distance, eta, type, lat, lon } = req.body;
      
      const newRescueTeam = new RescueTeam({
        name,
        contactNumber,
        distance,
        eta,
        type,
        lat,
        lon
      });
  
      await newRescueTeam.save();
      res.status(201).json({ message: "Rescue team added successfully", newRescueTeam });
    } catch (error) {
      res.status(500).json({ message: "Error adding rescue team", error });
    }
  });


  router.post("/shelter", async (req, res) => {
    try {
      const { name, address, capacity, distance, facilities, lat, lon } = req.body;
  
      const newShelter = new Shelter({
        name,
        address,
        capacity,
        distance,
        facilities,
        lat,
        lon
      });
  
      await newShelter.save();
      res.status(201).json({ message: "Shelter added successfully", newShelter });
    } catch (error) {
      res.status(500).json({ message: "Error adding shelter", error });
    }
  });





router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, phone_number, userType } = req.body;

        
        let user = await usermodel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

       
        user = await usermodel.findOne({ phone: phone_number });
        if (user) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = await usermodel.create({
            name: username,
            phone: phone_number,
            email,
            password: hashedPassword,
            role: userType, 
        });

        // Generate JWT Token
        const token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                userId: user._id,
                role: user.role, 
            },
            process.env.JWT_SECRET || "shhxcvjhu",  
            { expiresIn: "24h" }
        );

        // Set cookie with JWT
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, 
        });

        
        res.status(200).json({ message: "Signup successful", token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


router.post('/login', async (req, res) => {
    let { email, password, userType } = req.body;  // Include userType
    try {
        let user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found, please sign up" });
        }

        if (user.role !== userType) { // Ensure correct userType
            return res.status(403).json({ message: "Invalid user type" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token including userType
        let token = jwt.sign({
            email: email,
            userId: user._id,
            name: user.name,
            role: user.role,  // Send userType in token
        }, "shhxcvjhu", { expiresIn: "24h" });

        // Set cookie with token
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "Lax", maxAge: 24 * 60 * 60 * 1000 });

        res.status(200).json({ message: "Login successful", token, userType: user.role });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});





router.get('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.redirect('/auth/login');        
});





router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' 
}));


router.get(
    '/google/callback', 
    passport.authenticate('google', { session: false }), 
    async (req, res) => {
        try {
            const email = req.user.emails[0].value;
            let user = await usermodel.findOne({ email });

            // If user does not exist, create a new user
            if (!user) {
                user = new usermodel({
                    name: req.user.displayName,
                    email: email,
                    password: null,  // No password since it's a Google account
                    role: "user"  // Default role (can be changed based on your logic)
                });

                await user.save();
            }

            // Generate JWT token including userType
            const token = jwt.sign(
                { id: user._id, email: user.email, role: user.role },
                process.env.JWT_SECRET || "shhxcvjhu",
                { expiresIn: '1d' }
            );

            // Set cookie with token
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Lax",
                maxAge: 24 * 60 * 60 * 1000,
            });

            // Redirect to the frontend/dashboard after successful login
            res.redirect('http://localhost:3000/');  // Change this based on your frontend route

        } catch (error) {
            console.error('Google login error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

router.get('/api/disaster-data', async (req, res) => {
  let browser;
  try {
    console.log('Scraping disaster data...');
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    await page.goto('https://sachet.ndma.gov.in/', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.FooterLogo_cardMAP__pjpUv.FooterLogo_cardMAP2__2u9zC', { timeout: 10000 });

    const cards = await page.$$eval('.FooterLogo_cardMAP__pjpUv.FooterLogo_cardMAP2__2u9zC', (elements) => {
      if (!elements.length) return [];

      return elements.map((card) => {
        const style = card.getAttribute('style');
        const match = style?.match(/background-color:\s*([^;]+)/);
        const backgroundColor = match ? match[1].trim() : null;

        let severity = 'Low';
        if (backgroundColor?.includes('rgb(176, 0, 0)')) {
          severity = 'High';
        } else if (backgroundColor?.includes('orange')) {
          severity = 'Moderate';
        }

        const divs = card.querySelectorAll('div');
        const disaster = divs[0]?.textContent?.trim() || 'Unknown';
        const location = divs[1]?.textContent?.trim() || 'Unknown Location';

        return {
          name: location,
          address: `${location}, India`,
          severity,
          disasterType: disaster,
        };
      });
    });

    console.log(`Scraped ${cards.length} zones`);
    res.json(Array.isArray(cards) ? cards : []);
  } catch (error) {
    console.error('Error scraping disaster data:', error);
    res.status(500).json({ error: 'Failed to scrape disaster data' });
  } finally {
    if (browser) await browser.close();
  }
});




function isloggedin(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        console.log("No token found.");
        req.user = null;
        res.redirect('/auth/login');
    }

    try {
        const data = jwt.verify(token, 'shhxcvjhu'); 
        req.user = data;
        console.log("Token verified. User:", req.user);
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        req.user = null;
        next(); 
    }
}



module.exports = router;
