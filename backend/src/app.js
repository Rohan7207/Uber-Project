const dotenv = require("dotenv");
dotenv.config(); // Load environmnent variables from .env file
const express = require("express");
const cors = require("cors"); // Import cors module to handle cross-origin requests
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

const app = express();
app.use(cors()); // For now, allow all origins. In production, we allow only specific origins.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/users", authRoutes);
app.use("/captains", captainRoutes);

module.exports = app;
