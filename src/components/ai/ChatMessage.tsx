import React from "react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(message);
  };

  return (
    <div style={{
      textAlign: isUser ? "right" : "left",
      margin: "8px 0"
    }}>
      <div style={{
        display: "inline-block",
        background: isUser ? "#e0f7fa" : "#f1f1f1",
        borderRadius: 12,
        padding: "8px 16px",
        maxWidth: 400,
        position: "relative"
      }}>
        <span style={{ whiteSpace: "pre-line" }}>{message}</span>
        {!isUser && (
          <button onClick={handleCopy} style={{
            position: "absolute",
            top: 4,
            right: 4,
            background: "none",
            border: "none",
            color: "#888",
            cursor: "pointer",
            fontSize: 12
          }}>Copy</button>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 