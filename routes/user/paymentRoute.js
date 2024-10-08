const {
  initiateKhaltiPayment,
  verifyPidx,
} = require("../../controller/user/payment/paymentController");
const isAuthenticated = require("../../middleware/isAuthenticated");
const restrictTo = require("../../middleware/restrictTo");
const catchAsync = require("../../services/catchAsync");

const router = require("express").Router();

router
  .route("/")
  .post(
    isAuthenticated,
    restrictTo("customer"),
    catchAsync(initiateKhaltiPayment)
  );
router.route("/verifypidx").post(isAuthenticated, catchAsync(verifyPidx));

module.exports = router;
