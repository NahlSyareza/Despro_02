const db = require("../models/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // <--- WAJIB ADA: Ini yang sebelumnya hilang
const logger = require("../utils/logger");

// Gunakan secret yang sama dengan middleware auth Anda
const JWT_SECRET = process.env.JWT_SECRET || "rahasia_negara_api_123";

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) return res.status(400).json({msg: "Field incompletes"});

    const check = await db.query("SELECT * FROM vendor WHERE username = $1", [username]);
    if (check.rows.length > 0) {
      logger.warn(`[Register] Failed: Username '${username}' already exists`);
      return res.status(400).json({ msg: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      "INSERT INTO vendor (username, password) VALUES ($1, $2) RETURNING vendor_id, username",
      [username, hashedPassword]
    );

    const vendor = newUser.rows[0];

    // Buat Token untuk user baru
    const token = jwt.sign(
      { vendor_id: vendor.vendor_id, username: vendor.username }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    logger.info(`[Register] Success: New vendor '${username}' created`);
    
    // Kirim token di response
    res.status(201).json({ msg: "Vendor registered!", token, data: vendor });

  } catch (e) {
    logger.error(`[Register] Error: ${e.message}`);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.query("SELECT * FROM vendor WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      logger.warn(`[Login] Failed: User '${username}' not found`);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      logger.warn(`[Login] Failed: Wrong password for '${username}'`);
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const vendor = user.rows[0];

    // Buat Token saat login
    const token = jwt.sign(
      { vendor_id: vendor.vendor_id, username: vendor.username }, 
      JWT_SECRET, 
      { expiresIn: "24h" }
    );

    logger.info(`[Login] Success: '${username}' logged in`);
    
    // Kirim token ke frontend
    res.json({
      msg: "Login Success",
      token: token,
      vendor_id: vendor.vendor_id,
      username: vendor.username
    });
  } catch (e) {
    logger.error(`[Login] Error: ${e.message}`);
    res.status(500).send("Server error");
  }
};

// GET /vendor/:id/stats
const getDashboardStats = async (req, res) => {
  const { id } = req.params;
  try {
    const trayStats = await db.query(
      `SELECT COUNT(*) as total_meals, AVG(compliance_score) as avg_compliance 
       FROM tray WHERE vendor_id = $1`, [id]
    );

    const reviewStats = await db.query(
      `SELECT COUNT(*) as total_feedback, AVG(rating) as avg_rating 
       FROM review WHERE vendor_id = $1`, [id]
    );

    res.json({
      meals_analyzed: parseInt(trayStats.rows[0].total_meals) || 0,
      nutrition_compliance: parseFloat(trayStats.rows[0].avg_compliance || 0).toFixed(1),
      total_feedback: parseInt(reviewStats.rows[0].total_feedback) || 0,
      average_rating: parseFloat(reviewStats.rows[0].avg_rating || 0).toFixed(1)
    });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

module.exports = { register, login, getDashboardStats };