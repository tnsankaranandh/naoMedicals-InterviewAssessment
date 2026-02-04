const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// CORS configuration for Vercel
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length']
}));

// Reduce limits for Vercel (5MB function limit)
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));

// Fix content-length header issues
app.use((req, res, next) => {
  if (req.headers['content-length']) {
    const contentLength = parseInt(req.headers['content-length'], 10);
    if (contentLength > 1024 * 1024) {
      return res.status(413).json({ error: "Payload too large. Max 1MB." });
    }
  }
  next();
});

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/summary", require("./routes/summary.routes"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


module.exports = app;
