import { describe, it, expect } from 'vitest';
import { Game } from './Game/game';

describe('game test', async () => {
 	it('returns true when a valid word is entered', async() => {
		const game = new Game();
		const method = game.foundMethods['Hand Crafting'];
		const gameOut = await method.createNewConcept([['','','fire'],['','','water'],['','','',]]);
		console.log(gameOut)
	});
});
