const mongoose = require("mongoose");
const seedAdmin = require("../adminSeeder");

exports.connectDatabase = async (URI) => {
  await mongoose.connect(URI);
  console.log("Database connected succesfully!");

  // ADMIN seeding
  seedAdmin();
};
