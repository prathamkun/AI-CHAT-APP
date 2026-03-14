const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/aichat");

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

app.use("/api/chat", chatRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});