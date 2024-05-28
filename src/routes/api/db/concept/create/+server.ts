import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { createConstructionID } from "../../../../gen-craft/game";
import { logger } from "$lib/stores/logger";
export async function POST(conceptName : string, methodName : string, input : string[][]){
    //TODO: Consider adding lineage information eg. methods and parents to create concept
    try {
        const db = new MongoDB(DB_USER,DB_HOST,DB_PASS,DB_NAME);
        const constructionID = createConstructionID(methodName, input);
        const concept = await db.findByConstructionID('concepts',constructionID);
        if(concept == null){
            const output = await db.create('concepts',
            {
                name:conceptName,
                constructionID: constructionID
            });
            db.close();
            return output;
        }
        else {
            db.close();
            return concept;
        }
        
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'concept/create':{conceptName:conceptName, methodName:methodName,input:input} });
        logger.error(error);
    }
}