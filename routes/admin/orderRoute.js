const {
  getAllOrders,
} = require("../../controller/admin/order/orderController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router
  .route("/orders")
  .get(isAuthenticated, restrictTo("admin"), catchAsync(getAllOrders));

module.exports = router;
