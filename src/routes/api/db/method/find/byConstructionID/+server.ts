import { MongoDB } from "../../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";

export async function GET(constructionID : string){
    try {
        const db = new MongoDB(DB_USER,DB_HOST,DB_PASS,DB_NAME);
        const output = await db.findByConstructionID('methods',constructionID);
        db.close();
        return {
            data : output
        }
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'method/find/constructionID' : { constructionID : constructionID } });
        logger.error(error);
    }
}