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
        For every schema  each '#' will be replaced with either a singular new concept or a singular new method and each '' should stay the same.

        Each concept generated will use the following schema:

        {
            name : 'earth',
            type : 'concept'
        }

        Each method will use the following schema:

        {

            name : 'industrial furnace',
            inputSchema : [['','#',''],['#','#','#'],['','#','']],
            outputSchema : [['#']],
            type : 'method'

        }

        - Names should be as simple as possible, one word ideally and five words at the most. Focus on cultural concepts when appropriate, especially when it comes to internet humor, streamers and celebrities.
        - For methods keep inputSchemas and ouputSchemas simple but interesting.
        - Input Schemas should never be larger than a 3x3 list.
        - Output Schemas should never be larger than a 2x2 list.
        - Output Schemas should usually use [['#']]. This is the equivalent of one sole output.
        - You may only return JSON
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