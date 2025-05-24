const express = require("express");
const routes = require("./routes/auth_route");
const app = express();
const path = require("path");
const passportsetup = require("./config/passport_auth");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Message = require("./models/message");
const cors = require("cors");

// HTTP Server
const server = require("http").createServer(app);

// Integrating Socket.IO with the HTTP Server
const io = require("socket.io")(server, {
    cors: {
        origin: "*", // Allow any origin for testing; restrict in production
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));
app.options("*", cors()); // Handle preflight requests globally



app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' data:;");
    next();
  });
  

// View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/auth", routes);

let socketsConnected = new Set();

// MongoDB Connection
mongoose
    .connect("mongodb://localhost:27017/RESQ")
    .then(() => {
        console.log("MongoDB successfully connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });




// mongoose
//     .connect(process.env.MONGO_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     })
//     .then(() => {
//         console.log("✅ MongoDB Atlas connected successfully");
//     })
//     .catch((err) => {
//         console.error("❌ MongoDB connection error:", err);
//     });

// Socket.IO Connection Handling
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socketsConnected.add(socket.id);

    // Emit the number of connected clients
    io.emit("client-number", socketsConnected.size);

    // Send all previous messages to the newly connected client
    Message.find({})
        .then((messages) => {
            socket.emit("chat-message", messages);
        })
        .catch((err) => {
            console.error("Error fetching messages:", err);
        });

    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        socketsConnected.delete(socket.id);
        io.emit("client-number", socketsConnected.size);
    });

    // Listen for new messages from clients
    socket.on("message", async (data) => {
        console.log("Message received:", data);
    
        // Ensure message contains valid data
        if (!data.text || !data.sender) {
            console.error("Invalid message data received:", data);
            return;
        }
    
        // Save the message to the database
        const newMessage = new Message({
            sender: data.sender,
            text: data.text,
            dateTime: new Date(data.dateTime), // Explicitly parse the date
        });
    
        try {
            await newMessage.save();
            io.emit("chat-message", newMessage);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    // Handle typing feedback
    socket.on("feedback", (data) => {
        if (data && data.feedback) {
            socket.broadcast.emit("feedback", data);
        }
    });
});

// Home Route
app.get("/", (req, res) => {
    res.render("home");
});

// Chat Route with Authentication Middleware
app.get("/chat", isloggedin, async (req, res) => {
    try {
        const messages = await Message.find({});
        res.render("chat", { username: req.user.name, messages });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.render("chat", { username: req.user.name, messages: [] });
    }
});

// Authentication Middleware
function isloggedin(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        req.user = null;
        return res.redirect("/auth/login");
    }

    try {
        const data = jwt.verify(token, "shhxcvjhu");
        req.user = data;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        req.user = null;
        next();
    }
}

// Start Server
server.listen(5000, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});
