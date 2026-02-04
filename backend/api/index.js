
'use strict';

const dotenv = require("dotenv");
dotenv.config();

const serverless = require('serverless-http');
const { connectDB } = require("../src/config/db");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const AuthRoute = require("../src/routes/auth.routes");

const app = express();

// Create application/x-www-form-urlencoded parser
bodyParser.urlencoded({ extended: false });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));

const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://nao-medicals-interview-assessment.vercel.app'
    ];

console.log("allowedOrigins: ", allowedOrigins);

// Define CORS options
const corsOptions = {
    origin: function (origin, callback) {
    	console.log('origin ', origin);
        // Allow requests with no origin (serverless, mobile apps)
        if (!origin || allowedOrigins.indexOf(origin) > -1) {
          console.log('CORS allowed');
            callback(null, true);
        } else {
          console.log('Not allowed by CORS');
            callback(null, true); // Fallback: allow for Vercel compatibility
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-Data', 'x-session-data'],
    exposedHeaders: ['Content-Length', 'Content-Type', 'X-Session-Data', 'x-session-data'],
    credentials: false,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const connectDBFilter = async (req, res, next) => {
	try {
    console.log("Connecting to DB...");
		await connectDB();
    console.log("DB connected, proceeding to next middleware...");
        next();
	} catch (error) {
		console.error(error);
		res.status(500).send({ errorMessage: 'Error while connecting DB' });
	}
};

app.post('/api/auth/login', connectDBFilter, AuthRoute.login);

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => { console.log('Server ready on port 5000.'); });
}

// Export serverless handler for Vercel
module.exports = serverless(app);
