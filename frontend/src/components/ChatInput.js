import { useState } from "react";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div style={{ display: "flex", marginTop: "10px" }}>
      <input
        style={{ flex: 1, padding: "10px" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default ChatInput;