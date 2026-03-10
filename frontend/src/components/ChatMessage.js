import ReactMarkdown from "react-markdown";

function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "12px",
          borderRadius: "10px",
          backgroundColor: isUser ? "#10a37f" : "#444654",
        }}
      >
        <ReactMarkdown>{message.text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default ChatMessage;