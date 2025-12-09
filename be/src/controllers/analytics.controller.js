const db = require("../models/database");
const logger = require("../utils/logger");

const getChartData = async (req, res) => {
  const { vendor_id } = req.params;
  const { days } = req.query; // Ambil parameter days

  try {
    // Helper: Buat Filter Tanggal SQL
    let dateFilter = "";
    if (days && days !== 'all') {
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        dateFilter = `AND date >= CURRENT_DATE - INTERVAL '${daysInt} days'`;
      }
    }

    // 1. DATA RATING DISTRIBUTION (Bar Chart)
    const ratingDistQuery = `
      SELECT rating, COUNT(*) as count 
      FROM review 
      WHERE vendor_id = $1 ${dateFilter}
      GROUP BY rating 
      ORDER BY rating ASC
    `;
    const ratingRes = await db.query(ratingDistQuery, [vendor_id]);
    const distribution = [1, 2, 3, 4, 5].map(star => {
      const found = ratingRes.rows.find(r => parseInt(r.rating) === star);
      return { star: star, count: found ? parseInt(found.count) : 0 };
    });

    // 2. DATA NUTRITION QUALITY TREND (Grafik Hijau - Tray)
    const nutritionTrendQuery = `
      SELECT TO_CHAR(date, 'Dy') as day_name, TO_CHAR(date, 'YYYY-MM-DD') as full_date, AVG(compliance_score) as avg_score
      FROM tray 
      WHERE vendor_id = $1 ${dateFilter}
      GROUP BY date
      ORDER BY date ASC
    `;
    const nutritionRes = await db.query(nutritionTrendQuery, [vendor_id]);

    const nutritionTrend = nutritionRes.rows.map(row => ({
      date: row.day_name.trim(), 
      thisWeek: parseFloat(row.avg_score).toFixed(1),
      previousWeek: 0 
    }));

    // 3. DATA OVERALL RATING TREND (Grafik Ungu - Review)
    const ratingTrendQuery = `
      SELECT TO_CHAR(date, 'Dy') as day_name, TO_CHAR(date, 'YYYY-MM-DD') as full_date, AVG(rating) as avg_rating
      FROM review 
      WHERE vendor_id = $1 ${dateFilter}
      GROUP BY date
      ORDER BY date ASC
    `;
    const ratingTrendRes = await db.query(ratingTrendQuery, [vendor_id]);

    const ratingTrend = ratingTrendRes.rows.map(row => ({
      date: row.day_name.trim(),
      thisWeek: parseFloat(row.avg_rating).toFixed(1),
      previousWeek: 0
    }));

    // 4. DATA QUALITY DISTRIBUTION (Donut Chart)
    const qualityQuery = `
      SELECT 
        CASE 
          WHEN compliance_score >= 80 THEN 'Good'
          WHEN compliance_score >= 50 THEN 'Fair'
          ELSE 'Poor'
        END as category,
        COUNT(*) as count
      FROM tray
      WHERE vendor_id = $1 ${dateFilter}
      GROUP BY category
    `;
    const qualityRes = await db.query(qualityQuery, [vendor_id]);
    
    const qualityDistribution = qualityRes.rows.map(row => ({
        name: row.category,
        value: parseInt(row.count)
    }));

    res.json({
      rating_distribution: distribution,
      nutrition_trend: nutritionTrend,
      rating_trend: ratingTrend,
      quality_distribution: qualityDistribution
    });

  } catch (e) {
    logger.error(`[Analytics Error]: ${e.message}`);
    res.status(500).send("Server Error");
  }
};

module.exports = { getChartData };