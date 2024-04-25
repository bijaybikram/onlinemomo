const {
  getMyOrders,
  createMyOrder,
} = require("../../controller/user/order/orderController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .get(isAuthenticated, restrictTo("customer"), catchAsync(getMyOrders))
  .post(isAuthenticated, catchAsync(createMyOrder));

module.exports = router;
