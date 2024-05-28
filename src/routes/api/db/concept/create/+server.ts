import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
export async function POST(conceptName : string, constructionID : string){
    /** Looks for
    * 
    */
    try {
        const db = new MongoDB(DB_USER,DB_HOST,DB_PASS,DB_NAME);
        const output = await db.create('methods',
        
        { 
            data:{
                name : conceptName,
                constructionID : constructionID,
                }
        }
    );
        db.close();
        return output;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'method/create':{conceptName : conceptName, constructionID : constructionID} });
        logger.error(error);
    }
}