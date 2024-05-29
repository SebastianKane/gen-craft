import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
import { json, type RequestHandler } from "@sveltejs/kit";
export const POST = (async ({ request }) => {
    /** Inserts new concept into the concept collection
    */
    const {conceptName, constructionID} = await request.json();
    try {
        const db = new MongoDB(DB_USER,DB_PASS,DB_HOST,DB_NAME);
        const output = await db.create('methods',
        
        { 
            data:{
                name : conceptName,
                constructionID : constructionID,
                }
        });
        
        db.close();
        return json({output, status : 200});
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'method/create':{conceptName : conceptName, constructionID : constructionID} });
        logger.error(error);
        return json({
			status : 404
		})
    }
}) satisfies RequestHandler;