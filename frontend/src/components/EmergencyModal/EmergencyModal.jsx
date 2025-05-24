import React, { useState } from "react";
import {
  X,
  Ambulance,
  Hospital,
  CheckCircle,
  AlertTriangle,
  Upload,
  MapPin,
} from "lucide-react";
import axios from "axios"; // Import axios for API calls

const EmergencyConfirmationModal = ({
  isOpen,
  onClose,
  rescueTeam,
  shelters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="text-green-600" size={32} />
          <h2 className="text-2xl font-bold text-gray-900">
            Emergency Reported
          </h2>
        </div>

        {/* Rescue Team Section */}
        <div className="bg-red-50 border border-red-300 rounded-lg p-5 mb-6 shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-red-700 flex items-center mb-3">
            <Ambulance className="mr-2 text-red-600" size={24} />
            Nearest Rescue Team
          </h3>
          <div className="space-y-2 text-sm text-gray-800">
            <p>
              <strong>Team Name:</strong> {rescueTeam?.name || "N/A"}
            </p>
            <p>
              <strong>Type:</strong> {rescueTeam?.type || "N/A"}
            </p>
            <p>
              <strong>Contact:</strong> {rescueTeam?.contactNumber || "N/A"}
            </p>
            <p>
              <strong>Distance:</strong> {rescueTeam?.distance || "N/A"}
            </p>
            <p>
              <strong>ETA:</strong> {rescueTeam?.eta || "N/A"}
            </p>
          </div>
        </div>

        {/* Shelter Section */}
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-5 shadow-md hover:shadow-lg transition">
          <h3 className="text-lg font-semibold text-blue-700 flex items-center mb-3">
            <Hospital className="mr-2 text-blue-600" size={24} />
            Nearby Shelters
          </h3>
          {shelters?.length > 0 ? (
            shelters.map((shelter) => (
              <div
                key={shelter.id}
                className="mb-4 pb-4 border-b last:border-b-0"
              >
                <p className="text-base font-medium text-gray-900">
                  {shelter.name}
                </p>
                <p className="text-sm text-gray-600">{shelter.address}</p>
                <p className="text-sm">
                  <strong>Capacity:</strong> {shelter.capacity}
                </p>
                <p className="text-sm">
                  <strong>Distance:</strong> {shelter.distance}
                </p>
                <p className="text-sm">
                  <strong>Facilities:</strong> {shelter.facilities?.join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No shelters found nearby.</p>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Main Emergency Modal Component
const EmergencyModal = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rescueTeam, setRescueTeam] = useState(null);
  const [shelters, setShelters] = useState([]);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImageURLs((prevURLs) => [...prevURLs, ...urls]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImageURLs((prevURLs) => {
      URL.revokeObjectURL(prevURLs[index]);
      return prevURLs.filter((_, i) => i !== index);
    });
  };

  const handleGetLocation = () => {
    setLocationError(false);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setLocationError(true);
        }
      );
    } else {
      setLocationError(true);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      alert("Please capture your location before reporting an emergency.");
      return;
    }

    console.log("Submitting emergency report...");

    const formData = new FormData();
    formData.append(
      "description",
      description || "No additional details provided"
    );
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("timestamp", new Date().toISOString());
    images.forEach((image) => {
      formData.append("images", image); // Use the same field name for all images
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/report", 
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response received:", response);

      if (response.status === 201) {
        const { rescueTeams, shelters } = response.data;
        console.log("Rescue Teams:", rescueTeams);
        console.log("Shelters:", shelters);
        setRescueTeam(rescueTeams?.[0] || null);
        setShelters(shelters || []);
        setShowConfirmation(true);
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Failed to report the emergency. Please try again.");
      }
    } catch (error) {
      console.error("Error reporting emergency:", error);
      alert("Failed to report the emergency. Please try again.");
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onClose(); // Close the main modal as well
    // Optionally reset state here if needed
    setLocation(null);
    setDescription("");
    setImages([]);
    setImageURLs([]);
    setLocationError(false);
    setRescueTeam(null);
    setShelters([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      {!showConfirmation ? (
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fadeIn">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="text-red-600" size={28} />
            <h2 className="text-2xl font-bold text-red-600">
              Report Emergency
            </h2>
          </div>

          <div className="space-y-6">
            {/* Optional Description */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide any additional information about the emergency (optional)"
                className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all resize-none"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Images (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group"
                >
                  <Upload
                    className="text-gray-400 group-hover:text-blue-500 mr-2"
                    size={20}
                  />
                  <span className="text-gray-600 group-hover:text-blue-500">
                    Choose files
                  </span>
                </label>
              </div>

              {imageURLs.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {imageURLs.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location Capture (Compulsory) */}
            <div>
              <button
                onClick={handleGetLocation}
                className={`flex items-center justify-center w-full px-4 py-3 ${
                  location
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                } text-white font-medium rounded-lg transition-colors`}
              >
                <MapPin className="mr-2" size={20} />
                {location ? "Location Captured" : "Share Location (Required)"}
              </button>

              {locationError && (
                <p className="mt-2 text-sm text-red-500">
                  Unable to capture location. Please try again or check your
                  device settings.
                </p>
              )}

              {location && (
                <p className="mt-2 text-sm text-gray-500">
                  Latitude: {location.latitude.toFixed(6)}, Longitude:{" "}
                  {location.longitude.toFixed(6)}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={!location}
                className={`flex-1 px-4 py-3 text-white font-medium rounded-lg transition-colors ${
                  location
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Report Emergency
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <EmergencyConfirmationModal
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
          rescueTeam={rescueTeam}
          shelters={shelters}
        />
      )}
    </div>
  );
};

export default EmergencyModal;