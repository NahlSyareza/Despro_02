const db = require("../models/database");
const crypto = require("crypto");

const register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");

    const query = await db.query(
      "INSERT INTO vendor(username, password) VALUES ($1,$2) RETURNING *;",
      [username, hashedPassword]
    );

    return res.status(200).json({
      msg: "Registered new vendor!",
      payload: query.rows,
    });

    return res.status();
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");

    const slct = await db.query("SELECT * FROM vendor WHERE password=$1", [
      hashedPassword,
    ]);

    if (slct.rows.length < 1) {
      return res.status(200).json({
        msg: "Username or password wrong!",
        payload: [],
      });
    }

    return res.status(200).json({
      msg: "Successfully logged in!",
      payload: slct.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  login,
  register,
};
