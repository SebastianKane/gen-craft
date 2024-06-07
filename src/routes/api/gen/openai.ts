import { OPENAI_API_KEY, GPT_Temp } from "$env/static/private";
import { OpenAI } from "openai";
import sharp from "sharp";
import { Buffer } from "buffer";
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
     * Reference 05-27 -> https://platform.openai.com/docs/api-reference/
     * @param {string} systemContent - system instructions
     * @param {string} userContent - user instructions
     * @returns {string} - a Promise that returns an OpenAI Stream object **figure out stream type for docs
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
    downScale : "" | "32x32" | "64x64" | "128x128";
    
    /**
     * constructor
     * @param {"dall-e-3" | "dall-e-2"} modelName - Diffusion Model Name
     * @param {"256x256" | "512x512" | "1024x1024"} genSize - size of the generated image
     * @param {"" | "32x32" | "64x64" | "128x128"} [downScale="64x64"] - size of outputed image "" is original gen size
     * and sets up properties for the openAI API
     */
    constructor(modelName: "dall-e-3" | "dall-e-2", genSize: "256x256" | "512x512" | "1024x1024", downScale:"" | "32x32" | "64x64" | "128x128" ="64x64"){
        this.openai = new OpenAI({apiKey:OPENAI_API_KEY});
        this.openai.apiKey = OPENAI_API_KEY;
        this.modelName = modelName;
        this.size = genSize;
        this.downScale = downScale;
    }
        /**
     * Creates a stream object
     * Reference 06-07 -> https://platform.openai.com/docs/api-reference/images
     * @param {string} systemContent - system instructions
     * @param {string} userContent - user instructions
     * @returns {string} - a Promise that returns an OpenAI Stream object **figure out stream type for docs
     * }
     */
    async request(systemContent : string) {
        const response = await this.openai.images.generate({
            model: this.modelName,
            prompt: systemContent,
            n: 1,
            size: this.size,
          });
          if (this.downScale){
            const [x,y]= this.downScale.split('x').map(Number);
            return this.downscaleB64Image(response.data[0].b64_json || "", x, y)
          }
          return response.data[0].b64_json;
    }
async downscaleB64Image(b64 : string, newWidth : number, newHeight : number){
    const b64Data = b64.replace(/^data:image\/\w+;base64,/, '');
    const imgBuffer = Buffer.from(b64Data, 'base64');

    const resizedBuffer = await sharp(imgBuffer)
        .resize(newWidth,newHeight)
        .toBuffer
    return `data:image/jpeg;base64,${resizedBuffer.toString()}`;
}
}
export { DIFFUSION };