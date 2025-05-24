ResQ
ResQ is a comprehensive emergency reporting and disaster management web application designed to help users report emergencies quickly, communicate in real-time, and access critical resources during disasters. It integrates location tracking, live disaster data mapping, image uploads, community chat, and rescue coordination to facilitate faster response and better resource management.

Features
Emergency Reporting: Users can report emergencies by capturing their current location, adding descriptions, and uploading images.

Real-Time Location & Geocoding: Automatically captures user latitude and longitude and translates it into a readable address using the OpenCage API.

Live Disaster Map: Interactive map displaying real-time disasters across India, powered by data scraped from the National Disaster Response Centre (NDRC).

Community Chat: Real-time chat feature to communicate with other users and rescue teams.

Confirmation Modals: After reporting, users receive confirmation with nearby rescue teams and shelters.

User Authentication: Secure login with email/password and Google OAuth.

Responsive UI: Smooth animations and responsive design powered by React, Tailwind CSS, and Framer Motion.

Backend API: Node.js and Express server with MongoDB for data persistence and Socket.IO for real-time communication.

Technologies Used
Frontend: React, Tailwind CSS, Framer Motion, Google OAuth

Backend: Node.js, Express, MongoDB, Mongoose, Socket.IO

Mapping & Geocoding: OpenCage API (lat/lon to location), Map integration to display disaster hotspots

Data Sources: Web scraping from National Disaster Response Centre (NDRC) for live disaster data

Others: lucide-react icons, Puppeteer (for web scraping)

Installation
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/resq.git
cd resq
Install dependencies for the frontend and backend:

bash
Copy
Edit
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
Set up environment variables:

Create a .env file in the server directory with:

ini
Copy
Edit
MONGODB_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
OPENCAGE_API_KEY=your_opencage_api_key
Run the development servers:

bash
Copy
Edit
# Backend
cd server
npm start

# Frontend
cd ../client
npm start
Usage
Register or log in using email or Google OAuth.

Report an emergency by providing description and uploading images.

Allow location access; your coordinates are converted to your city/locality using OpenCage API.

View the live disaster map to see ongoing disaster hotspots across India.

Use the community chat to coordinate and communicate with other users and rescue teams.

Receive confirmation details with nearby rescue teams and shelters after reporting.

