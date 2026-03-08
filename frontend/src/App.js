import { useState } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";

function App() {
  const [messages, setMessages] = useState([]);

  const sendMessage = async (text) => {
    const userMessage = { role: "user", text };
    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let aiText = "";

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      aiText += chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = aiText;
        return updated;
      });
    }
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