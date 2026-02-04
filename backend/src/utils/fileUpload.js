const multer = require("multer");
const path = require("path");

// Use memory storage for Vercel (ephemeral filesystem)
// For production, upload to cloud storage (S3, etc.)
const storage = multer.memoryStorage();

const audioFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Only audio files allowed"), false);
  }
};

const uploadAudio = multer({
  storage,
  fileFilter: audioFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

module.exports = uploadAudio;
