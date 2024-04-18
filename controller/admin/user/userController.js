const User = require("../../../model/userModel");
const decodeToken = require("../../../services/decodeToken");

exports.getUsers = async (req, res) => {
  // const { authorization } = req.headers;
  // const decryptedUser = await decodeToken(
  //   authorization,
  //   process.env.SECRET_KEY
  // );
  const { id } = req.user; // this is sent with the userExist value from isAuthenticated after the function invoke completes
  // console.log(req.user);
  const users = await User.find({ _id: { $ne: id } }).select(["-__v"]);
  // OR an Easy alternative but longer one
  // const users = (await User.find().select(["-__v"])).filter(
  //   (user) => user._id.toString() !== id
  // );
  if (users.length == 0) {
    res.status(404).json({
      message: "User collection has no user!",
      data: [],
    });
  } else {
    res.status(200).json({
      message: "Users fetched succesfully!",
      data: users,
    });
  }
};

// Delete User API
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).json({
      message: "Please provide user ID",
    });
  }

  // If the userid is given check if it exist in the database or not
  const userExist = await User.findById(userId);
  if (!userExist) {
    res.status(404).json({
      message: "User with that ID doesnot exist!",
    });
  } else {
    await User.findByIdAndDelete(userId);
    res.status(200).json({
      message: "User deleted succesfully!",
    });
  }
};
