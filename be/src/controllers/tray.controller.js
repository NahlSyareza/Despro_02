const db = require("../models/database");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const logger = require("../utils/logger"); // Import Logger

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

const uploadAndAnalyze = async (req, res) => {
  try {
    // Validasi URL AI
    if (!AI_SERVICE_URL) {
      logger.error("[Config] AI_SERVICE_URL belum diset di .env!");
      return res.status(500).json({ message: "Server Configuration Error" });
    }

    if (!req.file) {
        logger.warn("[Upload] Gagal: Tidak ada file gambar yang diupload");
        return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = req.file.path;
    const dbImagePath = `/uploads/${req.file.filename}`;
    const vendorId = req.body.vendor_id;

    logger.info(`[Tray] Processing image from Vendor: ${vendorId}`);

    // 1. Kirim ke AI
    const formData = new FormData();
    formData.append("file", fs.createReadStream(imagePath));

    let aiResponse;
    try {
      logger.info(`[Tray] Sending to AI: ${AI_SERVICE_URL}`);
      const response = await axios.post(AI_SERVICE_URL, formData, {
        headers: { ...formData.getHeaders() },
        timeout: 10000 
      });
      aiResponse = response.data;
      logger.info(`[AI] Success: ${JSON.stringify(aiResponse)}`);
    } catch (aiError) {
      logger.error(`[AI] Failed: ${aiError.message}`);
      
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      
      return res.status(502).json({ 
        message: "AI Service Unavailable", 
        error: aiError.message 
      });
    }

    // 2. Simpan ke Database
    const insertQuery = `
      INSERT INTO tray (vendor_id, calories, fat, protein, carbohydrate, image, compliance_score, date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING tray_id
    `;
    
    const values = [
      vendorId,
      aiResponse.calories,
      aiResponse.fat,
      aiResponse.protein,
      aiResponse.carbohydrate,
      dbImagePath,
      aiResponse.compliance_score
    ];

    const { rows } = await db.query(insertQuery, values);

    logger.info(`[Tray] Saved to DB. New ID: ${rows[0].tray_id}`);

    res.status(201).json({
      message: "Tray processed",
      data: {
        tray_id: rows[0].tray_id,
        ai_analysis: aiResponse
      },
    });

  } catch (error) {
    logger.error(`[Tray Controller] Critical Error: ${error.message}`);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const log = async (req, res) => {
  const { vendor_id } = req.params;
  const { days } = req.query;

  try {
    let queryText = "SELECT * FROM tray WHERE vendor_id=$1";
    const queryParams = [vendor_id];

    if (days && days !== 'all') {
      const daysInt = parseInt(days);
      if (!isNaN(daysInt)) {
        queryText += ` AND date >= CURRENT_DATE - INTERVAL '${daysInt} days'`;
      }
    }

    queryText += " ORDER BY date DESC";

    const query = await db.query(queryText, queryParams);
    return res.status(200).json({ msg: "Tray log retrieved!", payload: query.rows });
  } catch (e) {
    logger.error(`[Tray Log] Error: ${e.message}`);
    return res.status(500).send("Server error");
  }
};

module.exports = { log, uploadAndAnalyze };