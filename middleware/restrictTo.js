// const User = require("../model/userModel");

const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.userRole;
    console.log(userRole);
    if (!roles.includes(userRole)) {
      res.status(403).json({
        message: "You are not authorized to perform this action!",
      });
    } else {
      next();
    }
  };
};

module.exports = restrictTo;
