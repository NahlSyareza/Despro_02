const express = require("express");
const mongoose = require("mongoose");

const app = express();

const review = require("./routes/review.route");

const CONNECTION_STRING =
  "mongodb://admin:FullAutoWHEELDRIVERS%24%24%24%25%25%25@100.117.82.121:27017/mbg?authSource=admin";

const PORT = 6060;

mongoose.connect(CONNECTION_STRING);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded());

app.use("/review", review);

app.get("/", async (req, res) => {
  return res.send("Doushite MBG?");
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
