const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        // Not required anymore, because OAuth users won't have password
    },
    phone: {
        type: Number,
        unique: true,
        sparse: true, // allow multiple null values (non-required)
    },
    role: {
        type: String,
        enum: ['user', 'volunteer'], 
        default: 'user', 
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,  // allow users without googleId
    },
   
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
