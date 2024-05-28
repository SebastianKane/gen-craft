import type { squareFill } from "$lib/stores/interfaces";
import { OPENAI_API_KEY } from "$env/static/private";
import { generateCraftRequestStrings } from "../../../gen-craft/gpt-request-templates/craft";
import { GPT } from "../openai";
export async function GET(methodName : string, input : string[][], outputSchema : squareFill[][]){
	/**
	 * Sends a prompt to gpt-4o to generate new concepts given a method, an input and an outputSchema.
	 */
	const gpt = new GPT('gpt-4o', OPENAI_API_KEY);
	const reqStrings = generateCraftRequestStrings(methodName, input, outputSchema)
	const res = await gpt.request(reqStrings.system, reqStrings.user);
	return JSON.parse(res.choices[0].message.content || "");

}