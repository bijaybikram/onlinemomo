const {
  createReview,
  deleteReview,
  getProductReview,
  addProductReview,
} = require("../controller/user/userController");
const isAuthenticated = require("../middleware/isAuthenticated");
const restrictTo = require("../middleware/restrictTo");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/reviews/:id")
  .post(isAuthenticated, restrictTo("customer"), catchAsync(createReview))
  .get(catchAsync(getProductReview))
  .delete(isAuthenticated, restrictTo("customer"), catchAsync(deleteReview));

module.exports = router;
