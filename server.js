// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

// MongoDB connection
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
  process.exit(1);
}
const dbconfig = require("./config/dbConfig");

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());


// routes 
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const insertRoutes = require("./routes/insertRoutes");

app.use("/api/user", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/insert", insertRoutes);

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server running on port ${PORT}`);
});
