import OpenAI from "openai";
import type { Channel, Event, StreamChat, MessageResponse } from "stream-chat";
import type { AIAgent } from "../types";
import { OpenAIResponseHandler } from "./OpenAIResponseHandler";

export class OpenAIAgent implements AIAgent {
    private openai!: OpenAI;
    private assistant!: OpenAI.Beta.Assistants.Assistant;
    private openAiThread!: OpenAI.Beta.Threads.Thread;
    private lastInteractionTs = Date.now();
    private handlers: OpenAIResponseHandler[] = [];

    constructor(
        readonly chatClient: StreamChat,
        readonly channel: Channel
    ) {}

    dispose = async () => {
        this.chatClient.off("message.new", this.handleMessage);
        this.handlers.forEach(h => h.dispose());
        this.handlers = [];
    };

    get user() {
        return this.chatClient.user;
    }

    getLastInteraction = (): number => this.lastInteractionTs;

    init = async () => {
        const apiKey = process.env.OPEN_API_KEY;
        if (!apiKey) {
            throw new Error("OpenAI API key is required");
        }

        this.openai = new OpenAI({ apiKey });

        this.assistant = await this.openai.beta.assistants.create({
            name: "AI Writing Assistant",
            instructions: "You are a helpful writing assistant.",
            model: "gpt-4.1-mini"
        });

        this.openAiThread = await this.openai.beta.threads.create();

        this.chatClient.on("message.new", this.handleMessage);
    };

    private handleMessage = async (event: Event) => {
        const message = event.message as MessageResponse | undefined;
        if (!message || !message.text) return;

        const text = message.text;
        this.lastInteractionTs = Date.now();

        const assistantStream = await this.openai.beta.threads.runs.stream(
            this.openAiThread.id,
            {
                assistant_id: this.assistant.id,
                additional_messages: [
                    { role: "user", content: text }
                ]
            }
        );

        const handler = new OpenAIResponseHandler(
            this.openai,
            this.openAiThread,
            assistantStream,
            this.chatClient,
            this.channel,
            message,
            () => {
                this.handlers = this.handlers.filter(h => h !== handler);
            }
        );

        this.handlers.push(handler);

        assistantStream.on("event", handler["handleStreamEvent"]);
        assistantStream.on("error", handler["handleError"]);
    };
}
