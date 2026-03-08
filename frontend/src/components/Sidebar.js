function Sidebar({ chats, activeChat, setActiveChat, newChat }) {
  return (
    <div
      style={{
        width: "250px",
        background: "#202123",
        color: "white",
        height: "100vh",
        padding: "10px",
      }}
    >
      <button
        onClick={newChat}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        + New Chat
      </button>

      {chats.map((chat, index) => (
        <div
          key={index}
          onClick={() => setActiveChat(index)}
          style={{
            padding: "10px",
            cursor: "pointer",
            background: activeChat === index ? "#343541" : "transparent",
          }}
        >
          Chat {index + 1}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;