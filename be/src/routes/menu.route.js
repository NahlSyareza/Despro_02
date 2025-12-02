const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");

router.get("/create_menu", c.createMenu);
router.post("/select_menu", c.saveSelectedMenu);

module.exports = router;
