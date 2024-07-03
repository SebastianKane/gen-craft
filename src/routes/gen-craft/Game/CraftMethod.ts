import { createConstructionID, type squareFill } from "$lib/stores/interfaces";
import { logger } from "$lib/stores/logger";
import { emptyRecord, initializeCurrentBySchema, replaceNoneEmptyString } from "./util";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ConceptRecord, MethodRecord } from "./types";
import { getNamesFromConceptGrid } from "./util";
import { craftOneConcept, craftOneMethod, findByConstructionID, genNewConcept } from "../Managers/dbManager";
export class CraftMethod {
    name : string;
    inputSchema : squareFill[][];
    outputSchema : squareFill[][];
    currentInputs : (ConceptRecord | null )[][];
    currentOutputs : (ConceptRecord | null)[][];
    /**
     * Generate Craft Method Object. This makes it easy to generate new concepts and store information
     * about a craft method.
     */
    constructor(name : string, inputSchema : squareFill[][], outputSchema : squareFill[][]) {
        this.name = name;
        this.inputSchema = inputSchema;
        this.outputSchema = outputSchema;
        this.currentInputs = initializeCurrentBySchema(this.inputSchema);
        this.currentOutputs = initializeCurrentBySchema(this.outputSchema);

    }


    /** Adds all inputs from a list of list of records as current inputs for a craft method.
     * @param { ConceptRecord[][] } concepts - A list of list of concepts. 
     */
    addAllInputs(concepts : ConceptRecord[][]){
        for (let i = 0; i < concepts.length; i ++){
            for ( let j = 0; j < concepts[i].length; j++){
                if(this.inputSchema[i][j] === '#'){
                    this.currentInputs[i][j] = concepts[i][j]; 
                }
            }
        }
    }
        /** Adds all inputs from a list of list of records as current inputs for a craft method.
     * @param { string[][] } concepts - A list of list of concepts. 
     */
        addAllInputsTESTINGONLY(concepts : string[][]){
            for (let i = 0; i < concepts.length; i ++){
                for ( let j = 0; j < concepts[i].length; j++){
                    if(this.inputSchema[i][j] === '#'){
                        this.currentInputs[i][j] = {
                            name:concepts[i][j],
                            imageB64:'',
                            constructionID:''
                        } 
                    }
                }
            }
        }

    /**
     * 
     * @param { ConceptRecord } Concept - Imputed concept into crafting method
     * @param { number } x - Horizontal location of inputed concept.
     * @param { number } y - Vertical location of input concept.
     */
    addInput(Concept : ConceptRecord, x: number ,y : number){
        this.currentInputs[y][x] = Concept;
    }

    /**
     * Crafts from currentInputs and inserts the results into currentOutputs.
     */
    async craft(){
        for (let i = 0; i < this.outputSchema.length; i++){
            for(let j = 0; j < this.outputSchema[i].length; j++){
                await this.craftOne(i,j);
            }
        }
    }

    /**
     * Craft's one concept at the given coordinates in the output.
     * @param x - Horizontal location in output grid.
     * @param y - Vertical location in pouput grid.
     * @returns - New or current concept or method. 
     */
    async craftOne(x : number, y : number){
        try {
            let output : ConceptRecord;
            // Check if the two Schema's Match before Combining
            for (let i = 0; i < this.inputSchema.length; i++){
                for(let j = 0; j < this.inputSchema[i].length; j++){
                    if( this.inputSchema[i][j] == '' && this.currentInputs[i][j] === null ){
                        throw new Error("Input's schema and inputSchema do not match! Stupid robit 😑");
                    }
                }
            }
            const constructionID = createConstructionID(this.name, this.getInputNames(), x, y);
            const findRes = await findByConstructionID(constructionID);
            const findOutput = await findRes.json();
            if (findOutput.data){
                console.log('res',findOutput.data)
                output = findOutput.data;
            }else{
                console.log('CreatingNewConcept!')
                output = await this.createNewConcept(x, y);
            }
            this.currentOutputs[y][x] = output;
            console.log('craft method', this.currentOutputs)
            return output;
        } catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const log = logger.child({ 'game.ts/craft': {x : x, y : y, input : this.currentInputs}});
            logger.error(error);
            console.log(error)
            return emptyRecord;
        }
        

    }
    /**
     * Just cleaner looking in code :-)
     * @returns {string[][]} - List of list of names of the current inputs for the method.
     */
    getInputNames(){
        return getNamesFromConceptGrid(this.currentInputs);
    }
    
    /**
     * Creates a new concept or method and saves it to the DB.
     * @param  x - Horizontal location in output grid
     * @param  y - Vertical location in pouput grid
     * @returns - new concept record
     */
    async createNewConcept(x : number, y : number){
        let parsable = false;
        const max = 5;
        let tries = 0;
        let parsedOutput;
        const constructionID = createConstructionID(this.name, this.getInputNames(), x, y);
        while (!parsable && tries < max){
            const gptOutput = await genNewConcept(this.name, this.getInputNames(), this.outputSchema);
            try {
                parsedOutput = JSON.parse(gptOutput);
                parsedOutput.newInputSchema = replaceNoneEmptyString(parsedOutput.newInputSchema, "#");
                parsedOutput.newOutputSchema = replaceNoneEmptyString(parsedOutput.newOutputSchema, "#")

                parsable = true;
            } catch (e) {
                console.log(`Try ${tries} : Response from bot is not json parsable.`, e)
                tries++;
            }
        }
        if(parsable){
            parsedOutput = parsedOutput || parsedOutput.output            
            if (parsedOutput.type === 'concept') {
                await craftOneConcept(parsedOutput.conceptName, parsedOutput.isMaterial, constructionID);
            }else if (parsedOutput.type === 'method'){
                await craftOneMethod(parsedOutput.conceptName, parsedOutput.newInputSchema, parsedOutput.newOutputSchema, constructionID);
            }
        return parsedOutput;
        }
    }

}