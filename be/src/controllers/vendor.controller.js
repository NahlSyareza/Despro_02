const db = require("../models/database");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger"); // Import Logger

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

    logger.info(`[Register] Success: New vendor '${username}' created`);
    res.status(201).json({ msg: "Vendor registered!", data: newUser.rows[0] });
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

    logger.info(`[Login] Success: '${username}' logged in`);
    res.json({
      msg: "Login Success",
      vendor_id: user.rows[0].vendor_id,
      username: user.rows[0].username
    });
  } catch (e) {
    logger.error(`[Login] Error: ${e.message}`);
    res.status(500).send("Server error");
  }
};

module.exports = { register, login };