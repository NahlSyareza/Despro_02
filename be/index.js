const express = require("express");
const cors = require("cors");
require("dotenv").config();

const review = require("./routes/review.route");
const vendor = require("./routes/vendor.route");
const tray = require("./routes/tray.route");
const menu = require("./routes/menu.route");

const app = express();

const PORT = 6060;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use("/review", review);
app.use("/vendor", vendor);
app.use("/tray", tray);
app.use("/menu", menu);

console.log(process.env.PGUSER);

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
