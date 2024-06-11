import { CraftMethod } from "./CraftMethod"
/**
 * Replaces all empty strings in a nested list
 * @param nestedList - A nested list of strings.
 * @param replacement - New string to replace empty strings with.
 * @returns - A new nested list with empty strings replaced.
 */


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
