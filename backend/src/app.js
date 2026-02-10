const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


app.use(express.urlencoded({ extended: false, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/conversations", require("./routes/conversation.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/summary", require("./routes/summary.routes"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Serve static files from frontend build (when running in containerized environment)
app.use(express.static(path.join(__dirname, "../public")));

// SPA fallback - serve index.html for all non-API routes
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "../public/index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({ message: "Not found" });
    }
  });
});

module.exports = app;
