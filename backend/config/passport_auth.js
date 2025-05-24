const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');  // your User mongoose model

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:5000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this googleId
      let existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // User exists, pass it to done()
        return done(null, existingUser);
      }

      // If not found, create a new user
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails && profile.emails[0].value, // may be undefined sometimes
        photo: profile.photos && profile.photos[0].value,
        // password and phone not set here, user signs up via Google OAuth
      });

      await newUser.save();
      done(null, newUser);
    } catch (error) {
      done(error, null);
    }
  }
));

// Serialize user to save in session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from session by ID
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
