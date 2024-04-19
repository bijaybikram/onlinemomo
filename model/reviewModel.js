const mongoose = require("mongoose");
const User = require("./userModel");
const Product = require("./productModel");
const Schema = mongoose.Schema;

//  UserID, ProductID, rating(stars), feedback message
const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: [true, "A review must belong to user."],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: Product,
    required: [true, "A review must be of Product."],
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

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
