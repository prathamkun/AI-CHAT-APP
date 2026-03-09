const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const Chat = require("../models/Chat");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  const chat = new Chat({
    messages: [{ role: "user", text: message }],
  });

  await chat.save();

  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: message }],
    stream: true,
  });

  res.setHeader("Content-Type", "text/plain");

  let aiText = "";

  for await (const chunk of stream) {
    const text = chunk.choices?.[0]?.delta?.content || "";
    aiText += text;
    res.write(text);
  }

  chat.messages.push({ role: "ai", text: aiText });
  await chat.save();

  res.end();
});

module.exports = router;