import { logger } from "$lib/stores/logger"
import type { squareFill } from "$lib/stores/interfaces";
import { getImagePrompt } from "../Game/util";
import { emptyRecord } from "../Game/util";

export async function genNewConcept(name : string, input : string[][], outputSchema : squareFill[][]){
    try{
        const res = await fetch('/api/gen/concept', {
            method: 'POST',
            body: JSON.stringify({ 
                name:name,
                input:input, 
                outputSchema: outputSchema
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
         const genOutput = await res.json();
         return genOutput
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'dbManager.ts/genNewConcept': {
            name : name, 
            input : input, 
            outputSchema : outputSchema
        }});
        logger.error(error);
        console.log(error)
        return emptyRecord;
    }
}
/**
 * Craft's one concept by name.
 * @param name - Name of the concept.
 * @param isMaterial - Whether or not the concept is a material.
 * @param constructionID - constructionID of new concept. 
 * @returns - New or current concept or method. 
 */
export async function craftOneConcept(name : string, isMaterial : boolean, constructionID : string){
    try{
        console.log('CreatingNewConcept!')
        const imagePrompt =getImagePrompt(name,isMaterial)
        const imageReq = await fetch('/api/gen/image', {
            method: 'POST',
            body: JSON.stringify({ 
                input : imagePrompt,
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        const imageRes = await imageReq.json();
        const imageB64 = await imageRes.data;
        await fetch('/api/db/concept/create', {
            method: 'POST',
            body: JSON.stringify({ 
                name : name,
                constructionID:constructionID,
                imageB64: imageB64
            }),
            headers: {
                'content-type': 'application/json'
            }
        });
        return { 
            name : name,
            constructionID:constructionID,
            imageB64: imageB64
        }
            
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'dbManager.ts/craftOneConcept': {name : name, isMaterial : isMaterial}});
        logger.error(error);
        console.log(error)
        return emptyRecord;
    }
    

}
/**
 * Craft's one method by name, inputSchema and OutputSchema.
 * @param name - Name of the new method.
 * @param inputSchema - Input Schema of the new concept.
 * @param outputSchema - Output Schema of the new concept.
 * @param constructionID - constructionID of new method. 
 * @returns - New or current concept or method. 
 */
export async function craftOneMethod(name : string, inputSchema : squareFill[][], 
    outputSchema : squareFill[][], constructionID : string){
    try {
        const findRes = await fetch('/api/db/concept/find/byConstructionID', {
            method: 'POST',
            body: JSON.stringify({ constructionID:constructionID}),
            headers: {
                'content-type': 'application/json'
            }
        });
        const findOutput = await findRes.json();
        if (findOutput.data){
            console.log('res',findOutput.data)
            return findOutput.data
        }else{
            console.log('CreatingNewConcept!')
            const imagePrompt =getImagePrompt(name,false)
            const imageReq = await fetch('/api/gen/image', {
                method: 'POST',
                body: JSON.stringify({ 
                    input : imagePrompt,
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            const imageRes = await imageReq.json();
            const imageB64 = await imageRes.data;
            await fetch('/api/db/concept/create', {
                method: 'POST',
                body: JSON.stringify({ 
                    name : name,
                    constructionID:constructionID,
                    inputSchema:inputSchema,
                    outputSchema:outputSchema,
                    imageB64: imageB64
                }),
                headers: {
                    'content-type': 'application/json'
                }
            });
            return { 
                name : name,
                constructionID:constructionID,
                inputSchema:inputSchema,
                outputSchema:outputSchema,
                imageB64: imageB64
            }
            
        }
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const log = logger.child({ 'dbManager.ts/craftOneMethod': {name : name, inputSchema : inputSchema, outputSchema : outputSchema}});
        logger.error(error);
        console.log(error)
        return emptyRecord;
    }
    

}
/**
 * Finds a concept corresponding to a constructionID
 * @param constructionID - The constructionID of the concept.
 * @returns The record of the concept.
 */
export async function findByConstructionID(constructionID : string){
    const findRes = await fetch('/api/db/concept/find/byConstructionID', {
        method: 'POST',
        body: JSON.stringify({ constructionID:constructionID}),
        headers: {
            'content-type': 'application/json'
        }
    });
    const findOutput = await findRes.json();
    return findOutput.data;
}
