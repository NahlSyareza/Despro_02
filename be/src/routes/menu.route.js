const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const c = require("../controllers/menu.controller");

// Route standar
router.get("/recommendations", auth,     c.getMenuRecommendations);
router.post("/save", auth, c.saveWeeklyPlan);

// Route BARU untuk ambil data per range tanggal
router.get("/:vendor_id/week", auth, c.getWeeklyMenu);

// Legacy
//router.get("/:vendor_id/active", c.getActiveMenu);

router.get("/smart-fill/:vendor_id", auth, c.getSmartRecommendation);

module.exports = router;