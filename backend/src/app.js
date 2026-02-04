const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS configuration for Vercel
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://nao-medicals-interview-assessment.vercel.app'
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback: allow all for Vercel compatibility
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  credentials: false // Set to false when using wildcard or multiple origins
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Reduce limits for Vercel (5MB function limit)
app.use(express.urlencoded({ extended: false, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }));

// Fix content-length header issues
app.use((req, res, next) => {
  if (req.headers['content-length']) {
    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength > 1024 * 102400) {
      return res.status(413).json({ error: "Payload too large. Max 100MB." });
    }
  }
  next();
});

// app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/summary", require("./routes/summary.routes"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


module.exports = app;
