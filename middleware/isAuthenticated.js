const User = require("../model/userModel");
const decodeToken = require("../services/decodeToken");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({
      message: "Please login first!",
    });
  }
  //   pathayo vane k garney
  //   check if the token is legit or not
  try {
    const decryptedResult = await decodeToken(token, process.env.SECRET_KEY);

    //   check is that user exist on the field or not
    const userExist = await User.findById(decryptedResult.id);

    if (!userExist) {
      return res.status(403).json({
        message: "User with that token doesnot exist in the table!",
      });
    }
    req.user = userExist;

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = isAuthenticated;
