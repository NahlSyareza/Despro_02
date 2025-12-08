const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyToken = (req, res, next) => {
  // 1. Ambil token dari Header request
  // Format standard: "Authorization: Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Ambil bagian tokennya saja

  if (!token) {
    logger.warn("[Auth] Access Denied: No Token Provided");
    return res.status(401).json({ msg: "Akses ditolak. Silakan login terlebih dahulu." });
  }

  try {
    // 2. Verifikasi Token menggunakan Secret Key
    // Pastikan process.env.JWT_SECRET ada di file .env Anda
    const secret = process.env.JWT_SECRET || "rahasia_negara_api_123"; 
    
    const decoded = jwt.verify(token, secret);
    
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