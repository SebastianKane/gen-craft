import { createConstructionID, type squareFill } from "$lib/stores/interfaces";
import { logger } from "$lib/stores/logger";
import { replaceNoneEmptyString } from "./util";

export class CraftMethod {
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
    /**
     * @param input 
     * @returns {Record} - new concept record
     */
    async craft(input : string[][]){
        for (let i = 0; i < this.outputSchema.length; i++){
            for(let j = 0; j < this.outputSchema[i].length; j++){
                return this.craftOne(input,j,i);
            }
        }
    }

    /**
     * 
     * @param input - Inputed concepts.
     * @param x - Horizontal location in output grid.
     * @param y - Vertical location in pouput grid.
     * @returns 
     */
    async craftOne(input : string[][], x : number, y : number){
        try {
            // Check if the two Schema's Match before Combining
            for (let i = 0; i < this.inputSchema.length; i++){
                for(let j = 0; j < this.inputSchema[i].length; j++){
                    if( this.inputSchema[i][j] == '' && input[i][j] != '' ){
                        throw new Error("Input's schema and inputSchema do not match! Stupid robit 😑");
                    }
                }
            }

            const findRes = await fetch('/api/db/concept/find/byConstructionID', {
                method: 'POST',
                body: JSON.stringify({ constructionID:createConstructionID(this.name, input, x, y) }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const findOutput = await findRes.json();
            console.log('res',findOutput.data)
            if (findOutput.data){
                return findOutput
            }else{
                console.log('CreatingNewConcept!')
                return await this.createNewConcept(input, x, y);
            }
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const log = logger.child({ 'game.ts/craft': {input:input}});
            logger.error(error);
            console.log(error)
        }
        

    }
    
    /**
     * 
     * @param {string[][]} input - Inputed concepts
     * @param {Number} x - Horizontal location in output grid
     * @param {Number} y - Vertical location in pouput grid
     * @returns {Record} - new concept record
     */
    async createNewConcept(input : string[][], x : number, y : number){
        let parsable = false;
        const max = 5;
        let tries = 0;
        let parsedOutput;
        while (!parsable && tries < max){
            const gptRes = await fetch('/api/gen/concept', {
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
            console.log(gptOutput)
            try {
                parsedOutput = JSON.parse(gptOutput.data);

                parsable = true;
            } catch (e) {
                console.log(`Try ${tries} : Response from bot is not json parsable.`, e)
                tries++;
            }
        }
        if(parsable){
            parsedOutput = parsedOutput || parsedOutput.output;
            console.log('look here!',parsedOutput.type === 'concept', parsedOutput)
            const imagePrompt =`
            Create a pixel art icon for the ${parsedOutput.isMaterial? 'material' : 'concept'} '${parsedOutput.newConceptName}', Ensure the background is a solid green color (#00FF00). 
            ${parsedOutput.isMaterial? 'Generate all materials as a sphere.' : ''}
            `;
            const imageReq = await fetch('/api/gen/image', {
                method: 'POST',
                body: JSON.stringify({ 
                    input : imagePrompt,
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const imageRes = await imageReq.json();
            const imageB64 = await imageRes.data;
            console.log(imageB64)
            
            if (parsedOutput.type === 'concept') {
                await fetch('/api/db/concept/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        conceptName : parsedOutput.newConceptName,
                        constructionID:createConstructionID(this.name, input, x, y),
                        imageB64: imageB64
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
            }else if (parsedOutput.type === 'method'){
                await fetch('/api/db/method/create', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        methodName : parsedOutput.newMethodName,
                        constructionID:createConstructionID(this.name, input, x, y),
                        inputSchema:replaceNoneEmptyString(parsedOutput.newInputSchema, "#"),
                        outputSchema:replaceNoneEmptyString(parsedOutput.newOutputSchema, "#"),
                        imageB64: imageB64
                    }),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
            }
        parsedOutput['data']['imageB64'] = imageB64;
        return parsedOutput;
        }
    }

}