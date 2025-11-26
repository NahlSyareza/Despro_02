const express = require("express");
const router = express.Router();
const c = require("../controllers/tray.controller");

router.get("/log/:vendor_id", c.log);

module.exports = router;
