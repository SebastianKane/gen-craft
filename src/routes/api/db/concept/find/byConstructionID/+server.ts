import { MongoDB } from "../../../mongodb";
import { DB_USER, DB_PASS, DB_HOST, DB_NAME } from "$env/static/private";
import { logger } from "$lib/stores/logger";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const POST = (async ({ request }) => {
    const { constructionID } = await request.json();
    try {
        const db = new MongoDB(DB_USER,DB_PASS,DB_HOST,DB_NAME);
        const output = await db.findByConstructionID('concepts',constructionID);
        db.close();
        return json({
            data : output,
            status : 200
        });
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'concept/find/constructionID' : { constructionID : constructionID } });
        logger.error(error);
        return json({
			status : 404
		})
    }
}) satisfies RequestHandler;