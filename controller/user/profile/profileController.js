const User = require("../../../model/userModel");
const bcrypt = require("bcrypt");

// get my profile
exports.getMyProfile = async (req, res) => {
  const userId = req.user.id;
  const myProfile = await User.findById(userId).select(["-userPassword"]);
  res.status(200).json({
    message: "User Profile fetched succesfully.",
    data: myProfile,
  });
};

// update my profile
exports.updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { userName, userEmail, UserPhonenumber } = req.body;
  const updatedData = await User.findByIdAndUpdate(
    userId,
    {
      userName,
      userEmail,
      UserPhonenumber,
    },
    { runValidators: true }
  );
  res.status(200).json({
    message: "Profile updated succesfully!",
    data: updatedData,
  });
};

// delete my profile
exports.deleteMyProfile = async (req, res) => {
  const userId = req.user.id;
  await User.findByIdAndDelete(userId);
  res.status(200).json({
    message: "Profile deleted succesfully!",
    data: null,
  });
};

// Update my password
exports.updateMyPassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  if (!oldPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({
      message:
        "Please provide oldPassword, newPassword and confirmNewPassword.",
    });
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({
      message: "newPassword and confirmNewPassword donot match!",
    });
  }

  //   fetch the old hashed password
  const userData = await User.findById(userId);
  const hashedOldPassword = userData.userPassword;

  //   Check if the old password is correct or not
  const isPasswordMatch = bcrypt.compareSync(oldPassword, hashedOldPassword);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "The oldPassword donot match with your current password.",
    });
  }

  //Passwords match vayo vane
  userData.userPassword = bcrypt.hashSync(newPassword, 10);
  await userData.save();
  res.status(200).json({
    message: "Password changed succesfully!",
  });
};
