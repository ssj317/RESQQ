const mongoose = require('mongoose');

const EmergencySchema = new mongoose.Schema({
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    details: {
        type: String,
        required: false
    },
    images: {
        type: [String],  // Array of image URLs
        required: false
    },
    reportedAt: {
        type: Date,
        default: Date.now
    }
});

const Emergency = mongoose.model('Emergency', EmergencySchema);
module.exports = Emergency;
