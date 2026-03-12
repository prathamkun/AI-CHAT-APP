import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [chats, setChats] = useState([
    { title: "New Chat", messages: [] }
  ]);
  const [activeChat, setActiveChat] = useState(0);

  const sendMessage = async (text) => {
    const updatedChats = [...chats];

    updatedChats[activeChat].messages.push({ role: "user", text });
    setChats([...updatedChats]);

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

    updatedChats[activeChat].messages.push({ role: "ai", text: "" });
    setChats([...updatedChats]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      aiText += chunk;

      updatedChats[activeChat].messages[
        updatedChats[activeChat].messages.length - 1
      ].text = aiText;

      setChats([...updatedChats]);
    }

    // Auto generate chat title
    if (updatedChats[activeChat].messages.length === 2) {
      updatedChats[activeChat].title = text.slice(0, 30);
      setChats([...updatedChats]);
    }
  };

  const newChat = () => {
    setChats([...chats, { title: "New Chat", messages: [] }]);
    setActiveChat(chats.length);
  };

  return (
    <div className="app">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        newChat={newChat}
      />

      <ChatWindow
        messages={chats[activeChat].messages}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;