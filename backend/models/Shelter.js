const mongoose = require("mongoose");

const ShelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: String, required: true }, 
  distance: { type: String, required: true }, 
  facilities: { type: [String], required: true }, 
  lat: { type: Number, required: true },  // Latitude
  lon: { type: Number, required: true }   // Longitude
});

const Shelter = mongoose.model("Shelter", ShelterSchema);
module.exports = Shelter;
