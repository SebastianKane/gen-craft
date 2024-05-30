import { OPENAI_API_KEY, GPT_Temp } from "$env/static/private";
import { OpenAI } from "openai";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Stream } from "openai/streaming.mjs";
/**
 * Class representing a Open AI API Interactions
 */
class GPT {
    openai: OpenAI;
	modelName: string;
    /**
     * constructor
     * @param {string} modelName - GPT Model Name
     * @param {string} openAIKey - Open AI API Key
     * and sets up properties for the openAI API
     */
    constructor(modelName: string, openAIKey: string){
        this.openai = new OpenAI({apiKey:OPENAI_API_KEY});
        this.openai.apiKey = openAIKey;
        this.modelName = modelName;
    }
        /**
     * Creates a stream object
     * Reference 05-27 -> https://platform.openai.com/docs/api-reference/streaming
     * @param {string} systemContent - system instructions
     * @param {string} userContent - user instructions
     * @returns {string} - a Promise that returns an OpenAI Stream object **figure out stream type for docs
     * usage: 
     * stream = mygpt.stream([{"role": "user", "content": "Say this is a test"}]);
     * for await (const chunk of stream) {
     *     process.stdout.write(chunk.choices[0]?.delta?.content || "");
     * }
     */
    async request(systemContent : string, userContent : string) {
        return await this.openai.chat.completions.create({
            model: this.modelName,
            messages: [{role : 'system', content :systemContent}, {role : 'user', content :userContent}],
            "temperature": parseFloat(GPT_Temp)
        });
    }
}
export { GPT };