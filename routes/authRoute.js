const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controller/authController");

const router = require("express").Router();

// route to register and login
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotpassword").post(forgotPassword);

module.exports = router;
