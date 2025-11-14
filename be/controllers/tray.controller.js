const db = require("../models/database");

const log = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const query = await db.query("SELECT * FROM tray WHERE vendor_id=$1", [
      vendor_id,
    ]);

    if (query.rows.length < 1) {
      return res.status(200).json({
        msg: "Tray not found!",
        payload: [],
      });
    }

    return res.status(200).json({
      msg: "Tray log retrieved!",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  log,
};
