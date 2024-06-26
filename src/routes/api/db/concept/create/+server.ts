import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
import { json, type RequestHandler } from "@sveltejs/kit";
export const POST = (async ({ request }) => {
    /** Inserts new concept into the concept collection
    */
    const {conceptName, constructionID, imageB64} = await request.json();
    try {
        const db = new MongoDB(DB_USER,DB_PASS,DB_HOST,DB_NAME);
        const output = await db.create('concepts',
        
        { 
            name : conceptName,
            constructionID : constructionID,
            imageB64:imageB64
        });
        
        db.close();
        return json({data : output, status : 200});
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'concept/create':{conceptName : conceptName, constructionID : constructionID} });
        logger.error(error);
        return json({
			status : 404
		})
    }
}) satisfies RequestHandler;