const express = require("express");
const router = express.Router();
const c = require("../controllers/review.controller");

router.post("/submit/:nis", c.submit);
router.get("/", c.getAll);

module.exports = router;
