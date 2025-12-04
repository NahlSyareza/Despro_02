const express = require("express");
const router = express.Router();
const c = require("../controllers/review.controller");

router.get("/issues", c.getFoodIssues); // Endpoint baru: GET /review/issues
router.post("/submit", c.submitReview);
router.get("/vendor/:vendor_id", c.getVendorReviews);

module.exports = router;