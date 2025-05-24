import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import login from "../../assets/login.jpg";
import Navbar from "../Navbar/Navbar";

const Login = () => {
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    userType: "" 
  });
  const [error, setError] = useState(""); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://resqq-backend.onrender.com/auth/login", 
        formData,
        { withCredentials: true }  
      );

      console.log("Login successful:", response.data);
      alert("Login successful!");

      // ✅ Redirect to home page after login
      window.location.href = "/DashboardIndividual";
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  // ✅ Correct Google Login Flow
  const handleGoogleLogin = () => {
    window.location.href = "https://resqq-backend.onrender.com/auth/google"; // Redirect to backend
  };

  const isFormValid = formData.email && formData.password && formData.userType;

  return (
    <div
      className="relative flex flex-col min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${login})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-white opacity-5"></div>
      <div className="z-50"><Navbar /></div>

      <div className="flex-grow flex items-center justify-center">
        <div className="flex flex-col items-center gap-8 px-4 text-center">
          <div className="z-50">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-200 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.3)] shadow-black">
              Welcome Back!
            </h1>
            <p className="mt-2 text-lg md:text-xl text-gray-300">
              Log in to access your personalized dashboard.
            </p>
          </div>

          <motion.div
            className="relative bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <h2 className="text-3xl font-semibold text-white mb-6">Login</h2>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-white/80 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <motion.input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-white/80 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="userType" className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                <motion.select
                  id="userType"
                  name="userType"
                  value={formData.userType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 text-gray-800 bg-white/80 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
                  whileFocus={{ scale: 1.02 }}
                >
                  <option value="">Select Account Type</option>
                  <option value="user">User</option>
                  <option value="ngo">NGO</option>
                </motion.select>
              </div>
              <motion.button
                type="submit"
                className={`w-full py-3 px-4 rounded-lg font-medium shadow-md transition-all ${
                  isFormValid
                    ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-blue-500 hover:to-indigo-500"
                    : "bg-gray-400 text-gray-300 cursor-not-allowed"
                }`}
                whileHover={isFormValid ? { scale: 1.03 } : {}}
                whileTap={isFormValid ? { scale: 0.97 } : {}}
                disabled={!isFormValid}
              >
                Login
              </motion.button>
            </form>

            <div className="mt-6">
              <button 
                onClick={handleGoogleLogin} // Corrected Google Login flow
                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg font-medium shadow-md hover:bg-red-600 transition-all"
              >
                Sign in with Google
              </button>
            </div>

            <p className="text-center text-sm text-gray-400 mt-6">
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-400 hover:text-indigo-300 transition duration-200">
                Sign Up
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
