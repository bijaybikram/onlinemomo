const User = require("./model/userModel");
const bcrypt = require("bcrypt");

const seedAdmin = async () => {
  // Check if admin exist or not
  const isAdminExist = await User.findOne({
    userEmail: "admin@gmail.com",
  });

  if (!isAdminExist) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: bcrypt.hashSync("admin", 10),
      userName: "Admin",
      userPhonenumber: "9834276722",
      userRole: "admin",
    });
    console.log("Admin seeded succesfully!");
  } else {
    console.log("Admin already seeded!");
  }
};

module.exports = seedAdmin;
