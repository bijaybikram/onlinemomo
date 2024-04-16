const User = require("../../../model/userModel");
const decodeToken = require("../../../services/decodeToken");

exports.getUsers = async (req, res) => {
  // const users = await User.find().select("+userName, -userPassword"); // validate selection as you require
  const { authorization } = req.headers;
  // console.log(authorization);
  const decryptedUser = await decodeToken(
    authorization,
    process.env.SECRET_KEY
  );
  console.log(decryptedUser.id);
  const users = (await User.find().select(["-__v"])).filter(
    (user) => user._id.toString() !== decryptedUser.id
  );
  if (users.length > 1) {
    res.status(200).json({
      message: "Users fetched succesfully!",
      data: users,
    });
  } else {
    res.status(404).json({
      message: "User collection has no user!",
      data: [],
    });
  }
};
