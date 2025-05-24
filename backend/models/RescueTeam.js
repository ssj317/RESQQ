const mongoose = require("mongoose");

const RescueTeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  distance: { type: String, required: true }, 
  eta: { type: String, required: true }, 
  type: { type: String, required: true }, 
  lat: { type: Number, required: true },  // Latitude
  lon: { type: Number, required: true }   // Longitude
});

const RescueTeam = mongoose.model("RescueTeam", RescueTeamSchema);
module.exports = RescueTeam;
