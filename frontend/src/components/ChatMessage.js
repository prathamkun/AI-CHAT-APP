import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyText = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

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
          position: "relative",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.text}
        </ReactMarkdown>

        {!isUser && (
          <button
            onClick={copyText}
            style={{
              position: "absolute",
              right: "8px",
              top: "8px",
              fontSize: "12px",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;