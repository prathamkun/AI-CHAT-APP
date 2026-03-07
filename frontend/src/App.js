import { useState } from "react";
import axios from "axios";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text) => {
    const userMessage = { role: "user", text };

    setMessages((prev) => [...prev, userMessage]);

    const res = await axios.post("http://localhost:5000/api/chat", {
      message: text,
    });

    const aiMessage = {
      role: "ai",
      text: res.data.reply,
    };

    setMessages((prev) => [...prev, aiMessage]);
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h2>AI Chat 🤖</h2>

      <div style={{ minHeight: "400px" }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default App;