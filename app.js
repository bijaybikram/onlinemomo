const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
// use DOTENV file
require("dotenv").config();

// importing ROUTES HERE
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

// parse JSON values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);

// calling ROUTES here
app.use("/api", authRoute);
app.use("/api", productRoute);

// listening to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
