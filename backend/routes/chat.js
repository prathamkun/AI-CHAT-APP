const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }],
      stream: true,
    });

    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content || "";
      res.write(text);
    }

    res.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating response");
  }
});

module.exports = router;