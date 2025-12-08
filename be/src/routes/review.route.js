const express = require("express");
const router = express.Router();
const c = require("../controllers/review.controller");

router.get("/issues", c.getFoodIssues); // Endpoint baru: GET /review/issues
router.get("/vendor/:vendor_id", c.getVendorReviews);
router.get("/stats/issues/:vendor_id", c.getIssueStatistics); 

router.post("/submit", c.submitReview);

module.exports = router;