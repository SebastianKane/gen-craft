import type { squareFill } from "../../lib/stores/interfaces";
import { logger } from "$lib/stores/logger";

export function createConstructionID(methodName : string, input : string[][]){
    return `${methodName}>>${input.join("|")}`
}

class CraftMethod {
    name : string;
    inputSchema : squareFill[][];
    outputSchema : squareFill[][];

    /**
     * Generate Craft Method Object. This makes it easy to generate new concepts and store information
     * about a craft method.
     */
    constructor(name : string, inputSchema : squareFill[][], outputSchema : squareFill[][]) {
        this.name = name;
        this.inputSchema = inputSchema;
        this.outputSchema = outputSchema;
    }
    async craft(input : string[][]){
        let output = null;
        try {
            // Check if the two Schema's Match before Combining
            for (let i = 0; i < this.inputSchema.length; i++){
                for(let j = 0; j < this.inputSchema[i].length; j++){
                    if( this.inputSchema[i][j] == '#' && input[i][j] == '' ){
                        throw new Error("Input's schema and inputSchema do not match! Stupid robit 😑");
                    }
                }
            }
            //TODO: Combining regardless. Add appropriate safeguards in the system.
            //const res = makeCraftRequest(this.name, input, this.outputSchema);

            const findRes = await fetch('/api/concept/find/byConstructionID', {
                method: 'POST',
                body: JSON.stringify({ constructionID:createConstructionID(this.name, input) }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const findOutput = await findRes.json();
            if (findOutput){
                return findOutput
            }else{
                return await this.createNewConcept(input);
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const log = logger.child({ 'game.ts/craft': {input:input}});
            logger.error(error);
        }
        

    }
    
    async createNewConcept(input : string[][]){
        const gptRes = await fetch('/api/gpt/makeCraft', {
            method: 'POST',
            body: JSON.stringify({ methodName:this.name,input:input, outputSchema: this.outputSchema }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const gptOutput = await gptRes.json();
        if (gptOutput.type === 'concept') {
            const findRes = await fetch('/api/concept/create', {
                method: 'POST',
                body: JSON.stringify({ conceptName : gptOutput.name,constructionID:createConstructionID(this.name, input) }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            return await findRes.json();
        }else if (gptOutput.type === 'method'){
            console.log();
        }
    }

}

export class Game {
    foundConcepts : string[]
    foundMethods : CraftMethod

	/**
	 * Create a game object from the player's cookie, or initialize a new game
	 */
	constructor() {
        this.foundConcepts = ['earth','water','fire','air']
        this.foundMethods = new CraftMethod('Hand Crafting', [['#','#','#'],['#','#','#'],['#','#','#']], [['#']])
	}

}
