const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel");
// Telling node to use DOTENV file
require("dotenv").config();

// to parse the incoming jason values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);
// testing api
app.get("/", (req, res) => {
  res.status(200).json({
    message: "I am alive.",
  });
});

// POST API to create a user in the database
app.post("/register", async (req, res) => {
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
});

// POST api to login to the app
app.post("/login", async (req, res) => {
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
    res.status(200).json({
      message: "User logged in succesfully!",
    });
  } else {
    res.status(400).json({
      message: "Invalid password!",
    });
  }
});

// listening to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
