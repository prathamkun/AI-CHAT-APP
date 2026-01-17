import OpenAI from "openai";
import type { AssistantStream } from "openai/lib/AssistantStream";
import type { Channel, Event, MessageResponse, StreamChat } from "stream-chat";

export class OpenAIResponseHandler {
    private message_text = "";
    private chunk_counter = 0;
    private run_id = "";
    private is_done = false;
    private last_update_time = 0;

    constructor(
        private readonly openai: OpenAI,
        private readonly openAiThread: OpenAI.Beta.Threads.Thread,
        private readonly assistantStream: AssistantStream,
        private readonly chatClient: StreamChat,
        private readonly channel: Channel,
        private readonly message: MessageResponse,
        private readonly onDispose: () => void
    ) {
        this.chatClient.on("ai_indicator.stop", this.handleStopGenerating);
    }

    run = async () => {
    this.assistantStream.on("event", this.handleStreamEvent);
    this.assistantStream.on("error", this.handleError);
};


    dispose = async () => {
        if (this.is_done) {
            return;
        }
        this.is_done = true;
        this.chatClient.off("ai_indicator.stop", this.handleStopGenerating);
        this.onDispose();
    };

    private handleStopGenerating = async (event: Event) => {
        if (this.is_done || event.message_id !== this.message.id) {
            return;
        }

        if (!this.openai || !this.openAiThread || !this.run_id) {
            return;
        }

        try {
            await (this.openai.beta.threads.runs as any).cancel(
                this.openAiThread.id,
                this.run_id
            );
        } catch {}

        await this.channel.sendEvent({
            type: "ai_indicator.clear",
            cid: this.message.cid,
            message_id: this.message.id,
        });

        await this.dispose();
    };

    private handleStreamEvent = async (event: OpenAI.Beta.Assistants.AssistantStreamEvent) => {
        const {cid, id} = this.message

        if(event.event ==="thread.run.created"){
            this.run_id = event.data.id
        } else if(event.event === "thread.message.delta"){
            const textDelta = event.data.delta.content?.[0]
            if(textDelta?.type === "text" && textDelta.text){
                this.message.text += textDelta.text.value || ""
                const now = Date.now()
                if(now - this.last_update_time > 1000){
                    this.chatClient.partialUpdateMessage(id,{
                        set: {text: this.message_text}
                    })
                    this.last_update_time = now
                }
                this.chunk_counter += 1
            }

        }else if(event.event === "thread.message.completed"){
            this.chatClient.partialUpdateMessage(id, {
                set: {
                    text: event.data.content[0].type === "text" ?
                    event.data.content[0].text.value
                    : this.message_text,
                },
            });
            this.channel.sendEvent({
                type: "ai_indicator.clear",
                cid: cid,
                message_id: id
            })

        }else if (event.event ==="thread.run.step.created"){
            if(event.data.step_details.type === "message_creation"){
                this.channel.sendEvent({
                    type: "ai_indicator.update",
                    ai_state: "AI_STATE_GENERATING",
                    cid: cid,
                    message_id: id
                })
            }
        }
        
    };

    private handleError = async (error: Error) => {
        if (this.is_done) {
            return;
        }

        await this.channel.sendEvent({
            type: "ai_indicator.update",
            ai_state: "AI_STATE_ERROR",
            cid: this.message.cid,
            message_id: this.message.id,
        });

        await this.chatClient.partialUpdateMessage(this.message.id, {
            set: {
                text: error.message ?? "Error generating the message",
                message: error.toString(),
            },
        });

        await this.dispose();
    };

    private performWebSearch = async (query: string): Promise<string> => {
        const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

        if (!TAVILY_API_KEY) {
            return JSON.stringify({
                error: "Web search is not available, API key not configured.",
            });
        }

        try {
            const response = await fetch("http://api.tavily.com/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TAVILY_API_KEY}`,
                },
                body: JSON.stringify({
                    query,
                    search_depth: "advanced",
                    max_result: 5,
                    include_answer: true,
                    include_raw_content: false,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return JSON.stringify({
                    error: `Search failed with status: ${response.status}`,
                    details: errorText,
                });
            }

            const data = await response.json();
            return JSON.stringify(data);
        } catch {
            return JSON.stringify({
                error: "An exception occured during web search",
            });
        }
    };
}
