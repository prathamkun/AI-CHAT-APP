import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

function ChatWindow({ messages, sendMessage }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ flex: 1, overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}

export default ChatWindow;