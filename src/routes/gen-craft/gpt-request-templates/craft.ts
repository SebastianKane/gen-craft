import type { squareFill } from "$lib/stores/interfaces"
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

/**
Example: 
System:

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

 User:

    Using the method "hand crafting" combine the inputs [[earth,earth,earth],[water,water,water],[earth,water,water]]



    Return the result in the following outputSchema:

    {

    output : [['#']]

    }

*/