import type { squareFill } from "../../lib/stores/interfaces";
import { logger } from "$lib/stores/logger";
import { createConstructionID } from "../../lib/stores/interfaces";

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
        let createOutput;
        let parsable = false;
        let max = 5;
        let tries = 0;
        let parsedOutput;
        while (!parsable && tries < max){
            const gptRes = await fetch('/api/gpt/makeCraft', {
                method: 'POST',
                body: JSON.stringify({ 
                    methodName:this.name,
                    input:input, 
                    outputSchema: this.outputSchema 
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const gptOutput = await gptRes.json();
            try {
                parsedOutput = JSON.parse(gptOutput.data);
                parsable = true;
            } catch (e) {
                tries++;
            }
        }
        if(parsable){
            if (parsedOutput.type === 'concept') {
                const createRes = await fetch('/api/concept/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        conceptName : parsedOutput.name,
                        constructionID:createConstructionID(this.name, input) 
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const createOutput = await createRes.json();
            }else if (parsedOutput.type === 'method'){
                const createRes = await fetch('/api/method/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        conceptName : parsedOutput.name,
                        constructionID:createConstructionID(this.name, input),
                        inputSchema:parsedOutput.inputSchema
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const createOutput = await createRes.json();
            }
        return parsedOutput;
        }
    }

}

export class Game {
    foundConcepts : string[]
    foundMethods : Record<string,CraftMethod>

	/**
	 * Create a game object from the player's cookie, or initialize a new game
	 */
	constructor() {
        this.foundConcepts = ['earth','water','fire','air']
        this.foundMethods = {'Hand Crafting' : new CraftMethod('Hand Crafting', [['#','#','#'],['#','#','#'],['#','#','#']], [['#']])}
	}

}
