import { OPENAI_API_KEY, GPT_Temp } from "$env/static/private";
import { OpenAI } from "openai";
/**
 * Class representing a Open AI API Interactions
 */
class GPT {
    openai: OpenAI;
	modelName: "gpt-4o" | "gpt-3.5-turbo";
    /**
     * constructor
     * @param {"gpt-4o" | "gpt-3.5-turbo"} modelName - GPT Model Name
     * and sets up properties for the openAI API
     */
    constructor(modelName: "gpt-4o" | "gpt-3.5-turbo"){
        this.openai = new OpenAI({apiKey:OPENAI_API_KEY});
        this.openai.apiKey = OPENAI_API_KEY;
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

/**
 * Class representing a Open AI API Interactions
 */
class DIFFUSION {
    openai: OpenAI;
	modelName: "dall-e-3" | "dall-e-2";
    size : "256x256" | "512x512" | "1024x1024";
    /**
     * constructor
     * @param {"dall-e-3" | "dall-e-2"} modelName - Diffusion Model Name
     * @param {"256x256" | "512x512" | "1024x1024"} size - size of the outputed image
     * and sets up properties for the openAI API
     */
    constructor(modelName: "dall-e-3" | "dall-e-2", size: "256x256" | "512x512" | "1024x1024"){
        this.openai = new OpenAI({apiKey:OPENAI_API_KEY});
        this.openai.apiKey = OPENAI_API_KEY;
        this.modelName = modelName;
        this.size = size;
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
    async request(systemContent : string) {
        const response = await this.openai.images.generate({
            model: this.modelName,
            prompt: systemContent,
            n: 1,
            size: "1024x1024",
          });
          return response.data[0].b64_json;
    }
}
export { DIFFUSION };