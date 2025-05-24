ResQ
ResQ is an all-in-one emergency reporting and disaster management web application designed to empower users during crises by enabling quick reporting, real-time communication, and access to critical disaster information and resources. It leverages live data, geolocation, and community collaboration to enhance disaster response and rescue efforts across India.

Table of Contents
Overview

Features

Technologies Used

Installation

Configuration

Usage

Project Structure

Contributing

License

Contact

Overview
ResQ provides a platform for users to report emergencies with detailed information and location data, view real-time disaster hotspots on an interactive map, and connect with a community of responders and other affected individuals via chat. The system integrates with external APIs and scraping tools to collect and display accurate disaster data from trusted sources like the National Disaster Response Centre (NDRC).

Key highlights include:

Accurate geolocation with user-friendly location names using OpenCage API.

Live updates of disaster events across India via data scraping.

Secure user authentication with email/password and Google OAuth.

Intuitive and animated UI for seamless user experience.

Features
Emergency Reporting
Capture and submit emergency reports with:

Location coordinates (latitude and longitude).

Description of the incident.

Image uploads to provide visual context.

Location is automatically obtained via the browser’s Geolocation API.

Coordinates are translated into human-readable addresses with the OpenCage API for clarity.

Live Disaster Map
Interactive map displaying real-time disaster hotspots across India.

Data sourced through automated web scraping of the National Disaster Response Centre (NDRC) website.

Visual markers indicate the type and severity of incidents.

Enables users and responders to stay informed of ongoing disasters geographically.

Community Chat
Real-time chat interface for communication among users, rescue teams, and volunteers.

Features include message likes, typing indicators, and smooth animations for engagement.

Built with Socket.IO for real-time, low-latency messaging.

User Authentication
Secure login and registration system.

Email/password authentication with password hashing.

Google OAuth integration for easy sign-in.

Role-based user types (e.g., general users, rescue teams).

Confirmation and Coordination
After submitting a report, users receive a confirmation modal.

Details include nearest rescue teams and shelter locations.

Helps coordinate timely assistance and resource allocation.

Responsive and Accessible UI
Built with React and Tailwind CSS for fast, responsive layouts.

Framer Motion powers smooth animations enhancing user experience.

Clean, intuitive interface accessible on desktop and mobile devices.

Technologies Used
Layer	Technologies & Tools
Frontend	React, Tailwind CSS, Framer Motion, lucide-react icons
Backend	Node.js, Express, MongoDB, Mongoose, Socket.IO
Mapping & APIs	OpenCage API (Geocoding), Google Maps / Leaflet (Map visualization)
Data Sources	Puppeteer (Web scraping), National Disaster Response Centre (NDRC)
Authentication	Google OAuth, JWT, bcrypt
Others	Geolocation API, Puppeteer for scraping disaster data

Installation
Prerequisites
Node.js (v14 or above)

npm or yarn

MongoDB instance (local or cloud such as MongoDB Atlas)

OpenCage API key

Google OAuth credentials

Steps
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/resq.git
cd resq
Install dependencies:

bash
Copy
Edit
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
Configuration
Create a .env file inside the server folder with the following variables:

env
Copy
Edit
MONGODB_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
OPENCAGE_API_KEY=your_opencage_api_key
Replace the placeholders with your actual credentials.

Make sure your MongoDB database is accessible and Google OAuth credentials are set up correctly.

Usage
Start backend server:

bash
Copy
Edit
cd server
npm start
Start frontend development server:

bash
Copy
Edit
cd ../client
npm start
Open your browser and navigate to:


Copy
Edit
http://localhost:3000
How to use:

Register or log in using email/password or Google account.

Allow location access when prompted.

Report emergencies with descriptions and photos.

View live disaster hotspots on the interactive map.

Use the community chat to communicate with others.

After submitting an emergency report, view confirmation details and nearby resources.

Project Structure (High-level)
graphql
Copy
Edit
resq/
├── client/            # React frontend code
│   ├── components/    # React components (Login, EmergencyModal, MapView, Chat, etc.)
│   ├── styles/        # Tailwind CSS configurations
│   └── ...
├── server/            # Backend API and server code
│   ├── controllers/   # API logic
│   ├── models/        # MongoDB schemas
│   ├── routes/        # Express routes
│   ├── utils/         # Helper functions (e.g., scraping, geocoding)
│   └── ...
├── README.md          # Project documentation
└── ...
