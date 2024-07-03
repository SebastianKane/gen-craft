import { CraftMethod } from "./CraftMethod"
import type { ConceptRecord, MethodRecord } from "./types"
import { craftOneConcept, craftOneMethod } from "../Managers/dbManager"
import { createConstructionID } from "$lib/stores/interfaces"

export class Game {
    foundConcepts : Record<string,ConceptRecord>
    foundMethods : Record<string,CraftMethod>

	/**
	 * Create a game object from the player's cookie, or initialize a new game
	 */
	constructor() {
        this.foundMethods = {'Empty Method' : new CraftMethod('Empty Method', [['#']], [['#']])}
		this.foundConcepts = {}
	}
	/**
	 * Initializes a list of names as new concepts without manual crafting.
	 * @param startingConcepts - List of concept names. 
	 */
	async initStartingConcepts(startingConcepts : string[]){
		for(const name of startingConcepts){
			const constructionID = createConstructionID('Hand Crafting', [[name]],0,0)
			const curr = await craftOneConcept(name, true, constructionID);
			this.foundConcepts[name] = curr;
		}
	}
	/**
	 * Initializes a list of method records into new methods without manual crafting.
	 * @param startingMethods - List of Method names. 
	 */
	async initStartingMethods(startingMethods : MethodRecord[]){
		for(const { name, inputSchema, outputSchema }  of startingMethods){
			const constructionID = createConstructionID('Hand Crafting', [[name]],0,0)
			await craftOneMethod(name,inputSchema, outputSchema, constructionID);
			this.foundMethods[name] = new CraftMethod(name, inputSchema, outputSchema);
		}
	}

}
