const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");

const app = express(); // ✅ MUST come BEFORE app.use

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/aichat");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/chat", chatRoute);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});