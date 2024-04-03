const mongoose = require("mongoose");

exports.connectDatabase = async (URI) => {
  await mongoose.connect(URI);
  console.log("Database connected succesfully!");
};
// password: J1WJpGZatIBYmVJx
