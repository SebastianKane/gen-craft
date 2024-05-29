import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
export const POST = (async ({ request }) => {
    /** Inserts new method into the methods collection.
    */
    const {methodName, constructionID, inputSchema, outputSchema} = await request.json();
    try {
        const db = new MongoDB(DB_USER,DB_PASS,DB_HOST,DB_NAME);
        const output = await db.create('methods',
        { 
            data:{
                name : methodName,
                constructionID : constructionID,
                inputSchema : inputSchema,
                outputSchema : outputSchema
                }
        }
        );
        db.close();
        return json({output, status : 200});
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'method/create':{
            name : methodName,
            constructionID : constructionID,
            inputSchema : inputSchema,
            outputSchema : outputSchema
        } });
        logger.error(error);
        return json({
			status : 409
		})
    }
}) satisfies RequestHandler;