import { GPT } from "../openai";
import { logger } from "$lib/stores/logger";
import { generateCraftRequestStrings } from "$lib/stores/interfaces";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
	/**
	 * Sends a prompt to gpt-4o to generate new concepts given a method, an input and an outputSchema.
	 */
	const {methodName, input} = await request.json();
	try {
		const gpt = new GPT('gpt-4o')
		const reqStrings = generateCraftRequestStrings(methodName, input);
		console.log(reqStrings)
		const res = await gpt.request(reqStrings.system, reqStrings.user);
		return json({
			data : res.choices[0].message.content || "",
			status : 200
		});	
	} catch (error) {
		console.log(error)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const log = logger.child({ 'gen/makeCraft': {
			methodName : methodName, 
			input : input} 
		});
		logger.error(error);
		return json({
			status : 418
		})
	}

}) satisfies RequestHandler;