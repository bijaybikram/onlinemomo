const mongoose = require("mongoose");
const User = require("./userModel");
const Schema = mongoose.Schema;

//  UserID, ProductID, rating(stars), feedback message
const nextReviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, "A review must belong to user."],
  },
  rating: {
    type: Number,
    required: true,
    default: 3,
  },
  feedback: {
    type: String,
    required: true,
  },
});

const NextReview = mongoose.model("NextReview", nextReviewSchema);
module.exports = {
  NextReview,
  nextReviewSchema,
};
