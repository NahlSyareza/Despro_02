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
  const { rating, review, vendor_id, issue_id } = req.body;
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
      "INSERT INTO review(vendor_id, rating, review, date, nis) VALUES ($5, $1, $2, $3, $4) RETURNING *",
      [rating, review, fmtDate, nis, vendor_id]
    );

    return res
      .status(200)
      .json({ msg: "Submitted new entry for today!", payload: ins.rows });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const mockingbird = async (req, res) => {
  const { rating, review, vendor_id, date } = req.body;
  const { nis } = req.params;

  try {
    const sel = await db.query(
      "SELECT * FROM review WHERE nis=$1 AND date=$2",
      [nis, date]
    );

    if (sel.rows.length > 0) {
      return res.status(200).json({
        msg: "Entry for this day is already submitted!",
        payload: [],
      });
    }

    console.log(sel.rows.length);

    const ins = await db.query(
      "INSERT INTO review(vendor_id, rating, review, date, nis) VALUES ($5, $1, $2, $3, $4) RETURNING *",
      [rating, review, date, nis, vendor_id]
    );

    return res
      .status(200)
      .json({ msg: "Submitted new entry for today!", payload: ins.rows });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const getAllRating = async (req, res) => {
  try {
    const query = await db.query(
      "SELECT date, AVG(rating) FROM review GROUP BY date;"
    );

    return res.status(200).json({
      msg: "Retrieved all ratings per date",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const averageRating = async (req, res) => {
  const { date } = req.params;

  try {
    const query = await db.query(
      "SELECT date, AVG(rating) FROM review WHERE date=$1 GROUP BY date",
      [date]
    );

    return res.status(200).json({
      msg: "Retrieved ratings for today",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const getDailyRatingDetail = async (req, res) => {
  const { date } = req.param;

  try {
    const query = await db.query(
      "SELECT COUNT(rating), ROUND(rating) AS reting FROM review WHERE date=$1 GROUP BY reting ORDER BY reting ASC",
      [date]
    );

    return res.status(200).json({
      msg: "Retrieved raiting detail for today",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

const getRecent = async (req, res) => {
  try {
    const query = await db.query(
      "SELECT * FROM review ORDER BY date DESC LIMIT 5;"
    );

    return res.status(200).json({
      msg: "Retrieved 5 recent entries!",
      payload: query.rows,
    });
  } catch (e) {
    console.error(e.message);
    return res.status(500).send("Server error");
  }
};

module.exports = {
  submit,
  getAll,
  getRecent,
  mockingbird,
  getAllRating,
  averageRating,
};
