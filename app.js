const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
// use DOTENV file
require("dotenv").config();

//node js lai file access garna dey vaneko
app.use(express.static("public"));
app.use(express.static("uploads/"));

// importing ROUTES HERE
const authRoute = require("./routes/auth/authRoute");
const productRoute = require("./routes/admin/productRoute");
const userRoute = require("./routes/admin/adminUserRoute");
const userReviewRoute = require("./routes/user/userReviewRoute");
const profileRoute = require("./routes/user/profileRoute");
const cartRoute = require("./routes/user/cartRoute");
const userOrderRoute = require("./routes/user/orderRoute");
const adminOrderRoute = require("./routes/admin/orderRoute");

// parse JSON values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);

// calling ROUTES here
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", userRoute, adminOrderRoute);
app.use("/api/reviews", userReviewRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", userOrderRoute);
// app.use("/api/admin/", userOrderRoute);

// listening to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
