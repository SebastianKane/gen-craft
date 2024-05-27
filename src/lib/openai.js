import { OpenAI } from "openai";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Stream } from "openai/streaming.mjs";
/**
 * Class representing a Open AI API Interactions
 */
class GPT {
    /**
     * constructor
     * @param {string} modelName - GPT Model Name
     * @param {string} openAIKey - Open AI API Key
     * and sets up properties for the openAI API
     */
    constructor(modelName, openAIKey){
        this.openai = new OpenAI();
        this.openai.apiKey = openAIKey;
        this.key = modelName;
    }
        /**
     * Creates a stream object
     * Reference 05-27 -> https://platform.openai.com/docs/api-reference/streaming
     * @param {OpenAI.ChatCompletionAssistantMessageParam} messages - Previous messages and role. Example: {{"role": "user", "content": "Say this is a test"}}
     * @returns {Promise<Stream<any>>} - a Promise that returns an OpenAI Stream object **figure out stream type for docs
     * usage: 
     * stream = mygpt.stream([{"role": "user", "content": "Say this is a test"}]);
     * for await (const chunk of stream) {
     *     process.stdout.write(chunk.choices[0]?.delta?.content || "");
     * }
     */
    async stream(messages) {
        return await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [messages],
            stream: true,
        });
    }
}
export { GPT };