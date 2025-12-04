const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");

// GET: Generate opsi menu otomatis dari DB
router.get("/recommendations", c.getMenuRecommendations);

// POST: Simpan menu yang sudah dipilih user
router.post("/save", c.saveWeeklyPlan);

module.exports = router;