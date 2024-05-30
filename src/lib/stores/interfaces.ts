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
function printArr(arr : string[][] | string[] | string) {
    let str = "[";
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) str += printArr(arr[i]);
        else i+1 < arr.length ? str += arr[i] + ", " : str += arr[i];
    }
    return str+"]";
}
// '#' Represents fillable boxes on the grid
// '' Represents unfillable boxes on the grid
export type squareFill = '' | '#';

export function createConstructionID(methodName : string, input : string[][], x : number, y : number){
    return `${methodName}>>${input.join("|")}[${x},${y}]`
}
export const  generateCraftRequestStrings = (methodName : string, input : string[][]) => {
    return {
        system :`
        Terminology:
        '' - A square a user is forbidden to put an input or receive an ouput from
        '#' - A square a user may receive an input or an output from.
        You are a tool meant to generate new concepts and methods from combining multiple concepts together using a method. 
        For every schema each '#' will be replaced with either a singular new concept or a singular new method and each '' should stay the same.

        Each concept generated must use the following schema:

        {
            "thought process" : "Some notes on how you made this decision",
            "newConceptName" : "earth",
            "type" : "concept"
        }

        Each method must use the following schema:

        {
            "thought process" : "Some notes on how you made this decision",
            "newMethodName" : "furnace",
            "newInputSchema" : [['#']],
            "newOutputSchema" : [['#']],
            "type" : "method"

        }
        Following every rule below is essential for the system you are interfacing with to work. Follow each one to give our users the best experience!
        - Names should be as simple as possible, one word ideally and five words at the most. Focus on cultural concepts when appropriate, especially when it comes to internet humor, streamers and celebrities.
        - Names should never be "hand crafting" or the crafting method used to make the new concept or method.
        - Methods are the equivalent of minecraft crafting objects : furnace, crafting table & etc. For example since a furnace is used to for crafting it cannot be a concept it must be a method!
        - All methods must always have both a inputSchema and a ouputSchema.
        - An inputSchema is the format in which the newly created method will receive inputs.
        - An outputSchema is the format in which the crafting methid must always return its new outputs. 
        - Concepts can never have a inputSchema nor a outputSchema.
        - Schemas are abstract and should never have concept or method name strings.
        - The newInputSchema is almost always different the format of the input.
        - All inputSchema must only use '' and '#' strings and no other strings.
        - The inputSchema generally doesn't match the schema of the original input.
        - All outputSchema must only use '' and '#' strings and no other strings.
        - Every method must have both a inputSchema and a ouputSchema. Neither field can ever be empty.
        - A inputSchema can be small as a 1x1 2D list and as large as a 3x3 2D list.
        - A outputSchema can be small as a 1x1 2D list and as large as a 2x2 2D list
        - A outputSchema should usually use [['#']]. This is the equivalent of one sole output.
        - You may only return parsable JSON.
        - Do not include any signifiers that this is a json document, for instance markdown for a json block.
        - For testing purposes default to the results from minecraft recipes.
        - Methods have a variety of different input and ouput schemas. This is what keeps the game fun and engaging!
        - Only return 1 method or concept.
        - Examples 

        Examples:
        Concept Example 1:
        {
            "newConceptName": "wind",
            "type": "concept"
        }
    
        Method Example 1:
        {
            "thought process" : "This is the crafting table from minecraft. Crafting tables take a 3x3 input and return one thing as an ouput. Crafting tables are made out of wood, so this uses planks.",
            "newMethodName": "crafting table",
            "newInputSchema": [["#", "#", "#"], ["#", "#", "#"], ["#", "#", "#"]],
            "newOutputSchema": [["#"]],
            "type": "method"
        }
        
        Method Example 2:
        {
            "thought process" : "This is the furnace from minecraft. Furnaces take a 1x1 input and return one thing as an ouput. Furnaces are made out of stone so this is made from cobblestone.",
            "newMethodName" : "furnace",
            "newInputSchema" : [['#']],
            "newInputSchema" : [['#']],
            "type" : "method"
        }
        `,
        user : `
        Combine "${printArr(input)}" using the crafting method "${methodName}" return either a new method or a new concept.
        `
    }
}