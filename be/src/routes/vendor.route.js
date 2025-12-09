const express = require("express");
const router = express.Router();
const c = require("../controllers/vendor.controller");
const analyticsController = require("../controllers/analytics.controller");
const auth = require("../middleware/auth.middleware"); // Import Middleware

router.post("/login", c.login);
router.post("/register", c.register);

router.get("/:vendor_id/charts", auth, analyticsController.getChartData);
router.post("/:id/stats", auth, c.getDashboardStats);

module.exports = router;
