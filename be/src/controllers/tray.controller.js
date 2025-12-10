const db = require("../models/database");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const logger = require("../utils/logger"); // Import Logger

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;
// --- TAMBAHAN UNTUK SSE ---
let clients = []; // Menyimpan koneksi klien yang aktif

const sendEventToVendor = (targetVendorId, data) => {
  clients.forEach(client => {
    if (client.vendorId === targetVendorId) {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });
};

const eventsHandler = (req, res) => {
  // KOREKSI: Ambil dari req.user
  if (!req.user || !req.user.vendor_id) {
    logger.error("[SSE] Error: req.user is undefined. Middleware auth mungkin belum terpasang.");
    return res.status(401).json({ msg: "Unauthorized connection" });
  }
  
  const authenticatedVendorId = req.user.vendor_id; 

  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
    vendorId: authenticatedVendorId // Simpan ID untuk filtering nanti
  };

  clients.push(newClient);
  logger.info(`[SSE] Vendor ${authenticatedVendorId} connected. Client ID: ${clientId}`);

  req.on('close', () => {
    logger.info(`[SSE] Client disconnected: ${clientId}`);
    clients = clients.filter(client => client.id !== clientId);
  });
};

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
      if (aiError.response) {
         logger.error(`[AI] Error Response: ${aiError.response.status} - ${JSON.stringify(aiError.response.data)}`);
      } else if (aiError.request) {
         // Request terkirim tapi tidak ada jawaban (Network Error)
         logger.error(`[AI] No Response (Network Error): ${aiError.message}`);
         if (aiError.code) logger.error(`[AI] Error Code: ${aiError.code}`); // Log ECONNREFUSED dll
      } else {
         logger.error(`[AI] Request Setup Error: ${aiError.message}`);
      }
      
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      
      // Kirim pesan error yang lebih detail ke frontend
      return res.status(502).json({ 
        message: "AI Service Unavailable", 
        error: aiError.code || aiError.message // Tampilkan kode error (misal ECONNREFUSED)
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
    const newTray = {
        tray_id: rows[0].tray_id,
        date: rows[0].date,
        compliance_score: aiResponse.compliance_score,
        ai_analysis: aiResponse,
        image: dbImagePath
    };
    
    logger.info(`[Tray] Saved to DB. New ID: ${rows[0].tray_id}`);

    if (aiResponse.compliance_score < 60) {
        // Gunakan vendorId yang didapat dari req.body (milik IoT) untuk mencari Client SSE yang cocok
        sendEventToVendor(vendorId, { 
            type: 'WARNING',
            message: 'Kualitas Gizi Rendah Terdeteksi!',
            data: newTray
        });
    } else {
        sendEventToVendor(vendorId, {
            type: 'UPDATE',
            message: 'Nampan baru berhasil diproses',
            data: newTray
        });
    }

    res.status(201).json({
      message: "Tray processed",
      data: newTray,
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

module.exports = { log, uploadAndAnalyze, eventsHandler };