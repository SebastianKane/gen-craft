import { type Logger, type LoggerOptions } from 'pino';

export enum ServerEnvironment {
    DEV,
    PREV,
    STG,
    PROD 
}

export type PinoLogger = Logger & {
    setLogLevel?: (NODE_ENV: ServerEnvironment) => LoggerOptions['level'];
};

// '#' Represents fillable boxes on the grid
// '' Represents unfillable boxes on the grid
export type squareFill = '' | '#';

export function createConstructionID(methodName : string, input : string[][]){
    return `${methodName}>>${input.join("|")}`
}
export const  generateCraftRequestStrings = (methodName : string, input : string[][], outputSchema : squareFill[][]) => {
    return {
        system :`
        You are a tool meant to generate new concepts and methods from combining multiple concepts together using a method. 
        For every schema each '#' will be replaced with either a singular new concept or a singular new method and each '' should stay the same.

        Each concept generated must use the following schema:

        {
            name : 'earth',
            type : 'concept'
        }

        Each method must use the following schema:

        {

            name : 'industrial furnace',
            inputSchema : [['','#',''],['#','#','#'],['','#','']],
            outputSchema : [['#']],
            type : 'method'

        }
        Following every rule below is essential for the system you are interfacing with to work. Follow each one to give our users the best experience!
        - Names should be as simple as possible, one word ideally and five words at the most. Focus on cultural concepts when appropriate, especially when it comes to internet humor, streamers and celebrities.
        - Methods are the equivalent of minecraft crafting objects : furnace, crafting table & etc. For example since a furnace is used to for crafting it cannot be a concept it must be a method!
        - All methods must always have both a inputSchema and a ouputSchema.
        - An inputSchema is the format in which the newly created method will receive inputs.
        - An outputSchema is the format in which the crafting methid must always return its new outputs. 
        - Concepts can never have a inputSchema nor a outputSchema.
        - Schemas are abstract and should never have concept or method name strings.
        - All inputSchema must only use '' and '#' strings and no other strings.
        - All outputSchema must only use '' and '#' strings and no other strings.
        - Every method must have both a inputSchema and a ouputSchema. Neither field can ever be empty.
        - A inputSchema must never be larger than a 3x3 list.
        - A outputSchema must never be larger than a 2x2 list.
        - A outputSchema should usually use [['#']]. This is the equivalent of one sole output.
        - You may only return parsable JSON.
        - Do not include any signifiers that this is a json document, for instance markdown for a json block.
        - For testing purposes default to the results from minecraft recipes.

        Examples:
        Concept:
        {
            "name": "wind",
            "type": "concept"
        }
    
        Method:
        {
            "name": "crafting table",
            "inputSchema": [["#", "#", "#"], ["#", "#", "#"], ["#", "#", "#"]],
            "outputSchema": [["#"]],
            "type": "method"
        }

        `,
        user : `
        Using the method "${methodName}" combine the inputs ${input}
        Return the result in the following outputSchema:

        {

            output : ${outputSchema}
        
        }
        `
    }
}