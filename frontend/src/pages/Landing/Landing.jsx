import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  MapPin,
  Users,
  Warehouse,
  AlertTriangle,
  HeartHandshake,
  Languages,
} from "lucide-react";
import bg from "../../assets/avalanche.jpeg";
import bg9 from "../../assets/cyclone-2.jpg";
import bg6 from "../../assets/volcano.jpg";
import bg3 from "../../assets/cyclone-4.jpg";
import bg4 from "../../assets/cyclone.jpg";
import bg5 from "../../assets/earthquake.jpg";
import bg2 from "../../assets/flood.jpg";
import bg7 from "../../assets/landslides.jpg";
import bg8 from "../../assets/thunderstorm.jpg";
import bg1 from "../../assets/wildfire.jpg";
import Navbar from "../../components/Navbar/Navbar";
import EmergencyModal from "../../components/EmergencyModal/EmergencyModal.jsx"; // Import the modal component

const Landing = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [isEmergencyModalOpen, setEmergencyModalOpen] = useState(false); // State to manage modal visibility

  const images = [bg, bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Advanced machine learning models analyze patterns to predict and alert communities about potential disasters",
      color: "text-blue-400",
    },
    {
      icon: Warehouse,
      title: "Smart Resource Management",
      description:
        "Real-time inventory tracking system for efficient resource allocation and distribution.",
      color: "text-green-400",
    },
    {
      icon: MapPin,
      title: "Real-Time Mapping",
      description:
        "Live geospatial dashboard showing disaster zones, resources, and optimal relief routes",
      color: "text-red-400",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description:
        "Crowdsourced reporting system enabling communities to mark risks and request assistance",
      color: "text-purple-400",
    },
    {
      icon: HeartHandshake,
      title: "Volunteer Coordination",
      description:
        "Smart matching system connecting skilled volunteers with critical tasks",
      color: "text-yellow-400",
    },
    {
      icon: Languages,
      title: "Multi-Language Support",
      description:
        "AI-powered translation ensuring critical information reaches all communities",
      color: "text-pink-400",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFadeOut(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Hero Section with Animated Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image with Smooth Transition */}
        <div className="absolute inset-0 z-0">
          <img
            src={images[currentImageIndex]}
            alt="Disaster Response Scenarios"
            className={`w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${fadeOut ? "opacity-0" : "opacity-50"
              }`}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/50 to-black opacity-60"></div>
        </div>

        {/* Navbar - Positioned Correctly */}
        <div className="relative z-50">
          <Navbar />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center -mt-16">
          <div className="mb-6">
            <AlertTriangle className="w-20 h-20 text-red-500 animate-pulse drop-shadow-xl" />
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl">
            ResQ Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl drop-shadow-lg">
            AI-Powered Disaster Response & Management System
          </p>
          <div className="space-x-4">
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-xl"
            >
              Report Emergency
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-4 bg-blue-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center mb-12">
            Intelligent Disaster Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white/70 backdrop-blur-xl p-8 rounded-xl text-center shadow-lg hover:transform hover:scale-105 transition-transform duration-300 hover:bg-blue-100"
              >
                <feature.icon className={`w-16 h-16 ${feature.color} mx-auto mb-4`} />

                <h3 className="text-xl font-bold text-blue-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-4 bg-white backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6">
            Join the ResQ Network
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Be part of our AI-powered disaster response ecosystem. Register as a
            volunteer, organization, or emergency responder.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/Signup")}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              Register Now
            </button>
            <button
              onClick={() => navigate("/SurvivalGuidance")}
              className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold hover:text-slate-900 transition-all shadow-lg"
            >
              Survival Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-5 bg-blue-900">
        <div className="text-white flex flex-col justify-center items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ResQ Platform.</p>
          <p className="text-xs">All rights reserved.</p>
        </div>
      </div>

      {/* Emergency Modal */}
      {isEmergencyModalOpen && (
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Landing;