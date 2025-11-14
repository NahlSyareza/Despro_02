const express = require("express");
const router = express.Router();
const c = require("../controllers/vendor.controller");

router.get("/login", c.login);
router.post("/register", c.register);

module.exports = router;
