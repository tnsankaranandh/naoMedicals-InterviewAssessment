🏥 Healthcare Doctor–Patient Translation Web Application

A near-production full-stack web application that enables secure, real-time communication between doctors and patients, including text chat, voice messages, search, and AI-generated summaries.

✨ Features
User & Security

Doctor and Patient registration

JWT-based authentication

Role-based access control

Password hashing with bcrypt

Secure environment variables using .env

Chat & Communication

Real-time messaging using Socket.IO

Text messages

Voice/audio messages

Doctor notifications on new patient messages

Doctors can manage multiple patient conversations

Chat history persistence

Data & Search

MongoDB storage for all messages

Timestamped message logging

Full-text search across chat messages

Highlighted keyword search results (frontend)

AI Capabilities

AI-generated chat summaries

Summaries highlight:

Symptoms

Diagnosis

Medications

Follow-up actions

Build & Deployment

React + Material UI frontend

Node.js + Express backend

MongoDB Atlas database

Code minification using Grunt

Ready for deployment on Vercel / Render

🧱 Tech Stack
Frontend

React.js

Material UI (MUI)

Socket.IO Client

Axios

Backend

Node.js

Express.js

Socket.IO

MongoDB + Mongoose

Multer (audio uploads)

OpenAI API (AI summaries)

DevOps

Grunt (minification)

MongoDB Atlas

Vercel (frontend)

Render / Railway (backend)

📁 Project Structure
healthcare-chat-app/
 ├── backend/
 │   ├── src/
 │   │   ├── config/
 │   │   ├── models/
 │   │   ├── routes/
 │   │   ├── middleware/
 │   │   ├── sockets/
 │   │   ├── utils/
 │   │   ├── app.js
 │   │   └── server.js
 │   ├── uploads/audio
 │   ├── gruntfile.js
 │   ├── package.json
 │   └── .env.example
 ├── frontend/
 │   ├── src/
 │   ├── public/
 │   ├── gruntfile.js
 │   └── package.json
 └── README.md

⚙️ Prerequisites

Node.js ≥ 18

npm ≥ 9

MongoDB Atlas account

OpenAI API key

🚀 Local Setup Instructions
1️⃣ Clone the Repository
git clone <your-repo-url>
cd healthcare-chat-app

2️⃣ Backend Setup
cd backend
npm install


Create .env file:

cp .env.example .env


Update .env:

PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/healthcare
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_api_key


Create uploads directory:

mkdir -p uploads/audio


Run backend:

npm run dev


Backend will run at:

http://localhost:5000

3️⃣ Frontend Setup
cd ../frontend
npm install
npm start


Frontend will run at:

http://localhost:3000

🔄 How the App Works

User registers as Doctor or Patient

User logs in and receives JWT session

Chat screen opens by default

Patient selects a doctor

Real-time chat begins (text or audio)

Messages are stored in MongoDB

Doctor receives notifications

Users can search chat history

AI summary can be generated per chat

🔍 Search Functionality

Uses MongoDB text indexes

Searches across all messages in a conversation

Frontend highlights matched keywords similar to WhatsApp

🤖 AI Summary Feature

Uses OpenAI GPT model

Generates structured summaries

Stored in database for reuse

🛠 Build & Minification (Grunt)
Backend
cd backend
npm run build

Frontend
cd frontend
npm run build


This produces minified, non-readable code.

🌍 Deployment Guide
MongoDB

Use MongoDB Atlas (Free Tier)

Backend (Render / Railway)

Create Node service

Add environment variables

Set start command:

npm start

Frontend (Vercel)

Import frontend folder

Build command:

npm run build


Output directory:

build

🔐 Security Best Practices

Passwords hashed using bcrypt

JWT authentication

Role-based route protection

.env for secrets

No hardcoded credentials

Separate constants file

📌 Future Enhancements

Message translation (language conversion)

Push notifications

Video calls

Doctor availability scheduling

Prescription uploads

EHR integration

🧑‍💻 Author

Built as a near-production full-stack healthcare communication system using modern web technologies.