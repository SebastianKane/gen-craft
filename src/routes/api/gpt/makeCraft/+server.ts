import type { squareFill } from "$lib/stores/interfaces";
import { OPENAI_API_KEY } from "$env/static/private";
import { GPT } from "../openai";
import { logger } from "$lib/stores/logger";
import { generateCraftRequestStrings } from "$lib/stores/interfaces";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
	/**
	 * Sends a prompt to gpt-4o to generate new concepts given a method, an input and an outputSchema.
	 */
	const {methodName, input, outputSchema} = await request.json();
	try {
		const gpt = new GPT('gpt-4o', OPENAI_API_KEY)
		const reqStrings = generateCraftRequestStrings(methodName, input, outputSchema);
		const res = await gpt.request(reqStrings.system, reqStrings.user);
		return json({
			data : JSON.parse(res.choices[0].message.content || ""),
			status : 200
		});	
	} catch (error) {
		console.log(error)
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const log = logger.child({ 'gpt/makeCraft': {
			methodName : methodName, 
			input : input, 
			outputSchema : outputSchema} 
		});
		logger.error(error);
		return json({
			status : 418
		})
	}

}) satisfies RequestHandler;