const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpgenerator = require("otp-generator");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");
require("dotenv").config();

// Register the user ------------------>
exports.registerUser = async (req, res) => {
  //   console.log(req.body);
  const { email, phoneNumber, password, userName, role } = req.body;
  if (!email || !phoneNumber || !password || !userName) {
    return res.status(400).json({
      message: "You need to fill up all the field",
    });
  }

  const userFound = await User.find({
    userEmail: email,
  });
  if (userFound.length > 0) {
    res.status(400).json({
      message: "User with that email is already registered!",
    });
  }
  const userData = await User.create({
    userEmail: email,
    userName: userName,
    userPhonenumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 10),
    userRole: role,
  });
  res.status(201).json({
    message: "User succesfully registered!",
    data: userData,
  });
};

// Login the user -------------------->
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "Please provide both the email and password for login!",
    });
  }
  // check if user exist or not
  const userFound = await User.find({
    userEmail: email,
  }).select(["+userPassword"]);
  if (userFound.length == 0) {
    return res.status(401).json({
      message: "User with that email is not registered!",
    });
  }
  // Check if the passwords match
  const isMatched = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatched) {
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "User logged in succesfully!",
      data: token,
    });
  } else {
    res.status(400).json({
      message: "Invalid password!",
    });
  }
};

// Forgot password -------------------->
exports.forgotPassword = async (req, res) => {
  const { email, subject } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "please provide email!",
    });
  }

  // Check if that user exist or not
  const userExist = await User.find({
    userEmail: email,
  });
  if (userExist.length == 0) {
    res.status(404).json({
      message: "User with that email is not registered!",
    });
  }

  // generate OTP using otp-generator module
  const generatedOtp = await otpgenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  userExist[0].otp = generatedOtp;
  userExist[0].otpGeneratedTime = Date.now();
  userExist[0].save();

  await sendEmail({
    email: email,
    subject: "This is your OTP. Please keep it secure.",
    otp: generatedOtp,
  });
  res.status(200).json({
    message: "OTP sent succesfully!",
  });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide both the email and otp!",
    });
  }

  // double verify the otp and email relation
  const userExist = await User.find({
    userEmail: email,
  });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered.",
    });
  }

  if (userExist[0].otp !== otp) {
    res.status(400).json({
      message: "Invalid OTP",
    });
  } else {
    const currentTime = Date.now();
    if (currentTime - userExist[0].otpGeneratedTime <= 120000) {
      res.status(200).json({
        message: "OTP verified!",
      });
      userExist[0].otp = null;
      userExist[0].otpGeneratedTime = null;
      userExist[0].isOtpVerified = true;
      userExist[0].save();
    } else {
      res.status(400).json({
        message: "OTP timed out!",
      });
    }
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmNewPassword } = req.body;
  if (!email || !newPassword || !confirmNewPassword) {
    return req.status(400).json({
      message: "Please provide email, newpassword & confirmnewpassword.",
    });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      message: "newpassword and confirmnewpassword donot match!",
    });
  }

  // check if the User exists or not
  const userExist = await User.find({
    userEmail: email,
  });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "Email is not registered!",
    });
  }

  if (userExist[0].isOtpVerified !== true) {
    return res.status(400).json({
      message: "Password already changed!",
    });
  }
  userExist[0].userPassword = bcrypt.hashSync(newPassword, 10);
  userExist[0].isOtpVerified = false;
  userExist[0].save();
  res.status(200).json({
    message: "Password changed succesfully!",
  });
};
