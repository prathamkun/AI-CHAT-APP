const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  messages: [
    {
      role: String,
      text: String,
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);