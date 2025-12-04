const express = require("express");
const router = express.Router();
const c = require("../controllers/menu.controller");

router.get("/create_menu", c.createMenu);
router.post("/select_menu", c.saveSelectedMenu);
router.get("/get_menu/:vendor_id", c.getMenuByVendor);
router.put("/update_menu", c.updateMenu);

module.exports = router;
