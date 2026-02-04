'use strict';

const dotenv = require("dotenv");
dotenv.config();

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

    console.log("allowedOrgins: ", allowedOrigins);
// Define CORS options
const corsOptions = {
    origin: function (origin, callback) {
    	console.log('origin ', origin);
        // Check if the requesting origin is in the allowedOrigins array
        // or if the origin is undefined (e.g., for direct server requests or Postman)
        if (allowedOrigins.indexOf(origin) > -1) {
          console.log('allowedOrigins includes origin');
            callback(null, true); // Allow the request
        } else {
          console.log('Not allowed by CORS');
            callback(new Error('Not allowed by CORS')); // Deny the request
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['X-Session-Data', 'x-session-data'], // Define allowed request headers
    exposedHeaders: ['X-Session-Data', 'x-session-data'], // Define headers exposed to the client
    credentials: true, // Allow sending cookies/credentials
    optionsSuccessStatus: 200 // Some legacy browsers require 200 for OPTIONS
};
app.use(cors(corsOptions));

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

app.post('/auth/login', connectDBFilter, AuthRoute.login);

// app.all('*', (req, res) => res.redirect('/'));

// app.use(function(error, request, response, next) {
// 	console.error(error);
//   response.status(500).send(error.message || 'Internal Server Error');
// });

app.listen(5000, () => { console.log('Server ready on port 5000.')} );

module.exports = app;