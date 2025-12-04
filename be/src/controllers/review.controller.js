const db = require("../models/database");
const logger = require("../utils/logger"); // Import Logger

const getFoodIssues = async (req, res) => {
  try {
    const result = await db.query("SELECT issue_type FROM food_issue");
    // Mengembalikan array string sederhana: ["Rasa Hambar", "Dingin", ...]
    const issues = result.rows.map(row => row.issue_type);
    res.json(issues);
  } catch (e) {
    logger.error(`[Issues] Error: ${e.message}`);
    res.status(500).send("Server Error");
  }
};

const submitReview = async (req, res) => {
  // Ubah issue_type jadi issue_types (plural, array)
  const { vendor_id, nis, rating, message, issue_types } = req.body;

  try {
    if (!vendor_id || !nis || !rating) {
      return res.status(400).json({ msg: "Data tidak lengkap" });
    }

    // 1. Cek Duplikat
    const duplicateCheck = await db.query(
      `SELECT review_id FROM review 
       WHERE vendor_id = $1 AND nis = $2 AND date::date = CURRENT_DATE`, 
      [vendor_id, nis]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(403).json({ msg: "Anda sudah memberikan review hari ini." });
    }

    // 2. Lookup UUID untuk BANYAK issue sekaligus
    let issueIdArray = null;

    if (issue_types && Array.isArray(issue_types) && issue_types.length > 0) {
        // Query menggunakan ANY untuk mencocokkan array string
        const issueRes = await db.query(
            "SELECT issue_id FROM food_issues WHERE issue_type = ANY($1::text[])", 
            [issue_types]
        );

        if (issueRes.rows.length > 0) {
            // Ambil semua UUID yang ditemukan
            issueIdArray = issueRes.rows.map(row => row.issue_id);
        }
    }

    // 3. Simpan
    await db.query(
      `INSERT INTO review (vendor_id, nis, rating, message, issue_id, date)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [vendor_id, nis, rating, message, issueIdArray]
    );

    logger.info(`[Review] Success: NIS ${nis}`);
    res.status(201).json({ msg: "Review berhasil dikirim! Terima kasih." });

  } catch (e) {
    logger.error(`[Review Error]: ${e.message}`);
    res.status(500).send("Server Error");
  }
};

const getVendorReviews = async (req, res) => {
  const { vendor_id } = req.params;
  const { days } = req.query;

  try {
    let queryText = "SELECT * FROM review WHERE vendor_id = $1";
    const queryParams = [vendor_id];

    if (days && days !== 'all') {
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        queryText += ` AND date >= CURRENT_DATE - INTERVAL '${daysInt} days'`;
      }
    }

    queryText += " ORDER BY date DESC";

    const query = await db.query(queryText, queryParams);
    
    return res.status(200).json({
      msg: "Reviews retrieved",
      payload: query.rows,
    });
  } catch (e) {
    logger.error(`[Review Log] Error: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

module.exports = { getFoodIssues, submitReview, getVendorReviews };