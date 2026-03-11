function Sidebar({ chats, activeChat, setActiveChat, newChat }) {
  return (
    <div className="sidebar">
      <button className="new-chat-btn" onClick={newChat}>
        + New Chat
      </button>

      <div className="chat-list">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`chat-item ${
              activeChat === index ? "active" : ""
            }`}
            onClick={() => setActiveChat(index)}
          >
            Chat {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;