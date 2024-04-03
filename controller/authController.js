const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
require("dotenv").config();

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
  } else {
    await User.create({
      userEmail: email,
      userName: userName,
      userPhonenumber: phoneNumber,
      userPassowrd: bcrypt.hashSync(password, 10),
      userRole: role,
    });
    res.status(201).json({
      message: "User succesfully registered!",
    });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      message: "Please provide both the email and password for login!",
    });
  }
  //   check if user exist or not
  const userFound = await User.find({
    userEmail: email,
  });
  if (userFound.length == 0) {
    return res.status(401).json({
      message: "User with that email is not registered!",
    });
  }
  //   Password check
  const isMatched = bcrypt.compareSync(password, userFound[0].userPassowrd);
  if (isMatched) {
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "User logged in succesfully!",
      token,
    });
  } else {
    res.status(400).json({
      message: "Invalid password!",
    });
  }
};
