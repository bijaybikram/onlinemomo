const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
// use DOTENV file
require("dotenv").config();

//node js lai file access garna dey vaneko
app.use(express.static("public"));
app.use(express.static("uploads/"));

// importing ROUTES HERE
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/adminUserRoute");
const userReviewRoute = require("./routes/userReviewRoute");

// parse JSON values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);

// calling ROUTES here
app.use("/api", authRoute);
app.use("/api", productRoute);
app.use("/api", userRoute);
app.use("/api", userReviewRoute);

// listening to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
