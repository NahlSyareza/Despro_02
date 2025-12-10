const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const c = require("../controllers/tray.controller");
const multer = require("multer");
const path = require("path");

// --- Konfigurasi Multer (Storage) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Pastikan folder ini match dengan index.js
  },
  filename: function (req, file, cb) {
    // Namai file: tray-[timestamp]-[random].jpg
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "tray-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// --- Routes ---

// GET Log
router.get("/log/:vendor_id", auth, c.log);
router.get("/events", auth, c.eventsHandler);

// POST Upload (Digunakan oleh IoT Raspi)
// 'image' adalah key yang kita set di script python IoT (files = {'image': f})
router.post("/upload", upload.single("image"), c.uploadAndAnalyze);

module.exports = router;