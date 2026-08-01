const dotenv = require("dotenv");
dotenv.config(); // Load environmnent variables from .env file

const express = require("express");
const cors = require("cors"); // Import cors module to handle cross-origin requests

const app = express();
app.use(cors());  // For now, allow all origins. In production, we allow only specific origins.

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
