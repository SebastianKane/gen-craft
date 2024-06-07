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
/**
 * Reduces 2D list into the smallest 2D list that still contains all elements and their original structure.
 * @param twoDList - Input a rectangular 2D list.
 * @returns {string[][]}- Trimmed 2D list.
 */
function trim2DList( twoDList : string[][]){
    let removeTop = true;
    let removeBottom = true;
    let removeRight = true;
    let removeLeft = true;
    while (removeBottom || removeTop || removeLeft || removeRight){
        if ( removeRight || removeLeft){
            for( let i = 0; i < twoDList.length; i++){
                if (twoDList[i][0] != ''){
                    removeLeft = false;
                }
                if (twoDList[i].length > 0 && (twoDList[i][twoDList[i].length-1] != '')){
                    removeRight = false;
                }
            }
        }
        if ( removeTop || removeBottom){
            for( let i = 0; i < twoDList[0].length; i++){
                if (twoDList[0][i] != ''){
                    removeTop = false;
                }
                if (twoDList[0].length > 0 && (twoDList[twoDList.length-1][i] != '')){
                    removeBottom = false;
                }
            }
        }
        if ( removeTop ) {
            twoDList.shift();
        }
        if ( removeBottom ) {
            twoDList = twoDList.slice(0,-1)
        }
        if (removeRight) {
            for( let i = 0; i < twoDList.length; i++){
                twoDList[i] = twoDList[i].slice(0,-1)
            }
        }
        if (removeLeft) {
            for( let i = 0; i < twoDList.length; i++){
                twoDList[i].shift()
            }
        }
    }
    return twoDList;
}
export function createConstructionID(methodName : string, input : string[][], x : number, y : number){
    const reducedInput = trim2DList(input); 
    return `${methodName}>>${reducedInput?.join("|")}[${x},${y}]`
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
            "thought process" : "This is the furnace from minecraft. Furnaces take a 2x1 input and return one thing as an ouput. The bottom input usually receives coal and the top receives the material being cooked. Furnaces are made out of stone so this is made from cobblestone.",
            "newMethodName" : "furnace",
            "newInputSchema" : [['#'],['#']],
            "type" : "method"
        }
        `,
        user : `
        Combine "${printArr(input)}" using the crafting method "${methodName}" return either a new method or a new concept.
        `
    }
}