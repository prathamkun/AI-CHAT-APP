import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, sendMessage, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {loading && (
          <div style={{ padding: "10px", color: "#aaa" }}>
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="input-area">
        <ChatInput onSend={sendMessage} />
      </div>
    </div>
  );
}

export default ChatWindow;