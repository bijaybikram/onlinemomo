const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userEmail: {
    type: String,
    required: [true, "Email must be provided!"],
  },
  userName: {
    type: String,
    required: [true, "username must be provided!"],
  },
  userPhonenumber: {
    type: Number,
    required: [true, "Phone number must be provided"],
  },
  userPassword: {
    type: String,
    required: [true, "Password must be provided!"],
  },
  userRole: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  otp: {
    type: String,
  },
  otpGeneratedTime: {
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
