const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
// use DOTENV file
require("dotenv").config();
// importing ROUTES HERE
const authRoute = require("./routes/authRoute");

// parse JSON values
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase(process.env.MONGO_URI);

// calling ROUTES here
app.use("", authRoute);

// listening to the port
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started at PORT ${PORT}`);
});
