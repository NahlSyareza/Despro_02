const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan"); // Import Morgan
const logger = require("./src/utils/logger"); // Import Logger kita

require("dotenv").config();

// ... imports routes ...
const review = require("./src/routes/review.route");
const vendor = require("./src/routes/vendor.route");
const tray = require("./src/routes/tray.route");
const menu = require("./src/routes/menu.route");

const app = express();
const PORT = process.env.PORT || 2001;

// Setup Folder Logs (Otomatis buat folder logs jika belum ada)
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Setup Folder Uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.use(helmet()); 
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- PASANG LOGGER HTTP ---
// Mencatat setiap request ke winston
app.use(morgan("combined", { stream: logger.stream })); 

app.use('/uploads', express.static(uploadDir));

app.use("/review", review);
app.use("/vendor", vendor);
app.use("/tray", tray);
app.use("/menu", menu);

app.listen(PORT, () => {
  // Ganti console.log biasa dengan logger
  logger.info(`Server running on http://127.0.0.1:${PORT}`);
});