import { MongoDB } from "../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { createConstructionID } from "../../../../gen-craft/game";
export async function POST(conceptName : string, methodName : string, input : string[][]){
    //TODO: Consider adding lineage information eg. methods and parents to create concept
    const db = new MongoDB(DB_USER,DB_HOST,DB_PASS,DB_NAME);
    return await db.create('concepts',
    {
        name:conceptName,
        constructionID: createConstructionID(methodName, input)
    });
}