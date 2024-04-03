const { registerUser, loginUser } = require("../controller/authController");

const router = require("express").Router();

// route to register and login
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
