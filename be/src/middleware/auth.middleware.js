const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_api_123";

const verifyToken = (req, res, next) => {
  // 1. Coba ambil dari Header
  let token = req.header("Authorization");

  // 2. Jika tidak ada di header, coba ambil dari Query Param (Khusus SSE)
  if (!token && req.query.token) {
    token = req.query.token;
  } else if (token && token.startsWith("Bearer ")) {
    // Bersihkan prefix Bearer jika dari header
    token = token.split(" ")[1];
  }

  if (!token) {
    logger.warn("[Auth] Access Denied: No Token Provided");
    return res.status(401).json({ msg: "Akses ditolak. Silakan login terlebih dahulu." });
  }

  try {
    // 2. Verifikasi Token menggunakan Secret Key
    // Pastikan process.env.JWT_SECRET ada di file .env Anda
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Simpan data user yang terdekripsi ke dalam object request
    // Agar controller selanjutnya bisa tahu siapa yang login
    req.user = decoded; 
    
    next(); // Lanjut ke Controller
  } catch (err) {
    logger.error(`[Auth] Invalid Token: ${err.message}`);
    return res.status(403).json({ msg: "Token tidak valid atau kadaluarsa." });
  }
};

module.exports = verifyToken;