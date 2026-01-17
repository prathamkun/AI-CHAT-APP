import cors from "cors";
import "dotenv/config";
import express from "express";
import { serverClient } from "./serverClient";
import { OpenAIAgent } from "./agents/openai/OpenAIAgent";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

const start = async () => {
    await serverClient.connectUser(
        { id: "ai_assistant", name: "AI Assistant" },
        serverClient.createToken("ai_assistant")
    );

    const channel = serverClient.channel("messaging", "ai-writing-room", {
        name: "AI Writing Room",
    });

    await channel.watch();
    

    const agent = new OpenAIAgent(serverClient, channel);
    await agent.init();

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
};

start();
