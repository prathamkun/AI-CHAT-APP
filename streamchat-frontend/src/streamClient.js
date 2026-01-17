import { StreamChat } from "stream-chat";

export const chatClient = StreamChat.getInstance(
  process.env.REACT_APP_STREAM_API_KEY
);
