const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  idtr: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

ReviewSchema.index({ idtr: 1, date: 1 }, { unique: true });

const Review = mongoose.model("review", ReviewSchema);

module.exports = Review;
