const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");

// Route standar
router.get("/recommendations", c.getMenuRecommendations);
router.post("/save", c.saveWeeklyPlan);

// Route BARU untuk ambil data per range tanggal
router.get("/:vendor_id/week", c.getWeeklyMenu);

// Legacy
router.get("/:vendor_id/active", c.getActiveMenu);

module.exports = router;