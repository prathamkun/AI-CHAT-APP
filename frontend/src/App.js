import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [chats, setChats] = useState([[]]);
  const [activeChat, setActiveChat] = useState(0);

  const sendMessage = async (text) => {
    const updatedChats = [...chats];
    updatedChats[activeChat].push({ role: "user", text });
    setChats(updatedChats);

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

    updatedChats[activeChat].push({ role: "ai", text: "" });
    setChats([...updatedChats]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      aiText += chunk;

      updatedChats[activeChat][updatedChats[activeChat].length - 1].text = aiText;
      setChats([...updatedChats]);
    }
  };

  const newChat = () => {
    setChats([...chats, []]);
    setActiveChat(chats.length);
  };

  return (
    <div style="app">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        newChat={newChat}
      />

      <ChatWindow
        messages={chats[activeChat]}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default App;