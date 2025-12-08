const db = require("../models/database");
const logger = require("../utils/logger"); 

// GET /review/issues
const getFoodIssues = async (req, res) => {
  try {
    const result = await db.query("SELECT issue_id, issue_name FROM food_issue");
    res.json(result.rows);
  } catch (e) {
    res.status(500).send("Error fetching issues");
  }
};

const submitReview = async (req, res) => {
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

    // 2. Lookup UUID
    let issueIdArray = []; 

    if (issue_types && Array.isArray(issue_types) && issue_types.length > 0) {
        const issueRes = await db.query(
            "SELECT issue_id FROM food_issue WHERE issue_name = ANY($1::text[])", 
            [issue_types]
        );

        if (issueRes.rows.length > 0) {
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
    // --- PERBAIKAN QUERY DI SINI ---
    // Kita tambahkan subquery untuk mengambil array 'issue_names' berdasarkan 'issue_id'
    let queryText = `
      SELECT r.*, 
      (
        SELECT COALESCE(array_agg(fi.issue_name), '{}')
        FROM food_issue fi
        WHERE fi.issue_id::text = ANY(r.issue_id)
      ) as issue_names
      FROM review r 
      WHERE r.vendor_id = $1
    `;
    
    const queryParams = [vendor_id];

    if (days && days !== 'all') {
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        // Perhatikan index parameter $2 karena $1 sudah dipakai vendor_id
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

// GET /review/stats/issues/:vendor_id
const getIssueStatistics = async (req, res) => {
  const { vendor_id } = req.params;
  try {
    const query = `
      SELECT fi.issue_name, COUNT(*) as count
      FROM review r
      CROSS JOIN unnest(r.issue_id) as unnested_id
      JOIN food_issue fi ON fi.issue_id::text = unnested_id
      WHERE r.vendor_id = $1
      GROUP BY fi.issue_name
    `;
    
    const result = await db.query(query, [vendor_id]);
    
    const formattedData = result.rows.map(row => ({
        name: row.issue_name,
        value: parseInt(row.count)
    }));

    res.json(formattedData);

  } catch (e) {
    logger.error(`[Review Stats Error]: ${e.message}`);
    res.status(500).send("Server error");
  }
};

module.exports = { getFoodIssues, submitReview, getVendorReviews, getIssueStatistics };