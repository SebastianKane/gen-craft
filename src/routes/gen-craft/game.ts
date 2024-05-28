import { CraftRequest } from "./gpt-request-templates/craft";
// '#' Represents fillable boxes on the grid
// '' Represents unfillable boxes on the grid
export type squareFill = '' | '#';

class CraftMethod {
    name : string;
    inputSchema : squareFill[][];
    outputSchema : squareFill[][];

    /**
     * Generate Craft Method Schema
     */
    constructor(name : string, inputSchema : squareFill[][], outputSchema : squareFill[][]) {
        this.name = name;
        this.inputSchema = inputSchema;
        this.outputSchema = outputSchema;
    }
    craft(input : squareFill[][]){
        gpt = new GPT('gpt-40',);
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
