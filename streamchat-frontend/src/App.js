import { useEffect, useState } from "react";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";
import { chatClient } from "./streamClient";

function App() {
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      await chatClient.connectUser(
        {
          id: "test_user",
          name: "Test User",
        },
        chatClient.devToken("test_user")
      );

      const channel = chatClient.channel("messaging", "ai-writing-room", {
        name: "AI Writing Room",
      });

      await channel.watch();
      setChannel(channel);
    }

    init();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!channel) return <div>Loading chat...</div>;

  return (
    <Chat client={chatClient} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

export default App;
