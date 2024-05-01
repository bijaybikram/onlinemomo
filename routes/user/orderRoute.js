const {
  getMyOrders,
  createMyOrder,
  updateMyOrder,
  cancelMyOrder,
  deleteMyOrder,
} = require("../../controller/user/order/orderController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .get(isAuthenticated, restrictTo("customer"), catchAsync(getMyOrders))
  .post(isAuthenticated, restrictTo("customer"), catchAsync(createMyOrder));

router
  .route("/cancel")
  .patch(isAuthenticated, restrictTo("customer"), catchAsync(cancelMyOrder));

router
  .route("/:id")
  .patch(isAuthenticated, restrictTo("customer"), catchAsync(updateMyOrder))
  .delete(isAuthenticated, restrictTo("customer"), catchAsync(deleteMyOrder));

module.exports = router;
