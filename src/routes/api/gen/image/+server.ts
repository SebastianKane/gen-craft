import { Diffusion } from "../openai";
import { logger } from "$lib/stores/logger";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
	/**
	 * Sends a prompt to gpt-4o to generate new concepts given a method, an input and an outputSchema.
	 */
	const {input} = await request.json();
	try {
		const diff = new Diffusion('dall-e-2', '256x256');
		const res = await diff.request(input);
		return json({
			data : res,
			status : 200
		});	
	} catch (error) {
		console.log(error)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const log = logger.child({ 'gen/genImage': 
			{
			input : input
			} 
		});
		logger.error(error);
		return json({
			status : 418
		})
	}

}) satisfies RequestHandler;