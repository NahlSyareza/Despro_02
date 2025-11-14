const db = require("../models/database");

const getAll = async (req, res) => {
  try {
    const query = await db.query("SELECT * FROM review");

    return res.status(200).json({
      msg: "Ale ale ale",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const submit = async (req, res) => {
  const { rating, review } = req.body;
  const { nis } = req.params;

  try {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const fmtDate = `${year}-${month}-${day}`;

    const sel = await db.query(
      "SELECT * FROM review WHERE nis=$1 AND date=$2",
      [nis, fmtDate]
    );

    if (sel.rows.length > 0) {
      return res.status(200).json({
        msg: "Entry for this day is already submitted!",
        payload: [],
      });
    }

    console.log(sel.rows.length);

    const ins = await db.query(
      "INSERT INTO review(vendor_id, rating, review, date, nis) VALUES ('cdb3721a-853b-4ee4-8faf-800478190879', $1, $2, $3, $4) RETURNING *",
      [rating, review, fmtDate, nis]
    );

    return res
      .status(200)
      .json({ msg: "Submitted new entry for today!", payload: ins.rows });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  submit,
  getAll,
};
