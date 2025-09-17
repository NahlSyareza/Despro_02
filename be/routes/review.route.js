const express = require("express");
const router = express.Router();
const c = require("../controllers/review.controller");

router.post("/fill/:idtr", c.fill);

module.exports = router;
