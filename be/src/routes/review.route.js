const express = require("express");
const router = express.Router();
const c = require("../controllers/review.controller");

router.post("/submit/:nis", c.submit);
router.get("/", c.getAll);
router.get("/get_recent", c.getRecent);
router.post("/mockingbird/:nis", c.mockingbird);
router.get("/get_all_rating", c.getAllRating);
router.get("/average_rating/:date", c.averageRating);
router.get("/overall_rating_dy/:date/:vendor_id", c.overallRatingDy);
router.get("/average_rating_dy/:date/:vendor_id", c.averageRatingDy);

module.exports = router;
