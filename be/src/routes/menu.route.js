const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");
const auth = require("../middleware/auth.middleware");

// GET: Generate opsi menu otomatis dari DB
router.get("/recommendations", auth, c.getMenuRecommendations);
router.get("/:vendor_id/active", auth, c.getActiveMenu);

// POST: Simpan menu yang sudah dipilih user
router.post("/save", auth, c.saveWeeklyPlan);

module.exports = router;