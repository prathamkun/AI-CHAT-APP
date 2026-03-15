const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  messages: [
    {
      role: String,
      text: String,
    },
  ],
});

module.exports = mongoose.model("Chat", ChatSchema);