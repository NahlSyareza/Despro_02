const express = require("express");
const db = require("./models/database");
require("dotenv").config();

const app = express();

const PORT = 6060;

app.use(express.json());
app.use(express.urlencoded());

console.log(process.env.PGUSER);

app.get("/vendor", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM vendor");
    return res.status(200).json(rows);
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
});

app.post("/review/submit", async (req, res) => {
  const { rating, review, review_code } = req.body;

  try {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");

    const fmtDate = `${year}-${month}-${day}`;

    const sel = await db.query(
      "SELECT * FROM review WHERE review_code=$1 AND added=$2",
      [review_code, fmtDate]
    );

    if (sel.rows.length > 0) {
      return res.status(200).json({
        msg: "Entry for this day is already submitted!",
        payload: [],
      });
    }

    console.log(sel.rows.length);

    const ins = await db.query(
      "INSERT INTO review(vendor_id, rating, review, added, review_code) VALUES ('cdb3721a-853b-4ee4-8faf-800478190879', $1, $2, $3, $4)",
      [rating, review, fmtDate, review_code]
    );

    return res
      .status(200)
      .json({ msg: "Submitted new entry for today!", payload: ins.rows });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
