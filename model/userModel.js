const mongoose = require("mongoose");
const Product = require("./productModel");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: [true, "Email must be provided!"],
      unique: true,
      lowercase: true,
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
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
