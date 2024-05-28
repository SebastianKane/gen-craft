import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
import type { squareFill } from "$lib/stores/interfaces";
export async function POST(methodName : string, constructionID : string, inputSchema : squareFill[][], outputSchema : squareFill){
    /** Looks for
    * 
    */
    try {
        const db = new MongoDB(DB_USER,DB_HOST,DB_PASS,DB_NAME);
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
        return output;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'method/create':{
            name : methodName,
            constructionID : constructionID,
            inputSchema : inputSchema,
            outputSchema : outputSchema
        } });
        logger.error(error);
    }
}