const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");

const { Server } = require("socket.io");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const promisify = require("util").promisify;

// use DOTENV file

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
const paymentRoute = require("./routes/user/paymentRoute");
const dataServiceRoute = require("./routes/admin/dataServiceRoute");
const User = require("./model/userModel");

app.use(
  cors({
    origin: "*",
  })
);
// Tell Node to use dotenv
require("dotenv").config();

app.set("view engine", "ejs");

app.get("/chat", (req, res) => {
  res.render("home");
});
// parse JSON values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);

// calling ROUTES here
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", userRoute);
app.use("/api/admin", dataServiceRoute);
app.use("/api/reviews", userReviewRoute);
app.use("/api/profile", profileRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", userOrderRoute);
app.use("/api/admin/orders", adminOrderRoute);
app.use("/api/payment", paymentRoute);
// app.use("/api/admin/", userOrderRoute);

// Landing page of server
app.get("/", (req, res) => {
  res.json({
    message: "Hey I am alive!",
  });
});
// listening to the port
const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:5173"],
    methods: ["*"], // Define allowed methods
    credentials: true, // Allow credentials (if needed)
  },
});

let onlineUsers = [];

const addToOnlineUsers = (socketId, userId, role) => {
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
  onlineUsers.push({ socketId, userId, role });
  console.log("online Users:", onlineUsers);
};

io.on("connection", async (socket) => {
  const { token } = socket.handshake.auth;
  if (token) {
    try {
      const decryptedResult = await promisify(jwt.verify)(
        token,
        process.env.SECRET_KEY
      );

      //   check is that user exist on the field or not
      const userExist = await User.findById(decryptedResult.id);

      if (userExist) {
        addToOnlineUsers(socket.id, userExist.id, userExist.userRole);
      }
    } catch (error) {
      console.log("Token Verification Failed", error);
    }
  }

  socket.on("updateOrderStatus", ({ status, orderId, userId }) => {
    const foundUser = onlineUsers.find((user) => user.userId == userId);
    io.to(foundUser.socketId).emit("statusUpdated", { status, orderId });
  });
});
