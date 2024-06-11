import type { ConceptRecord } from "./types"
/**
 * Replaces all non-empty strings from a list of list of strings with a value.
 * @param { string[][] } nestedList - Inputed string of strings.
 * @param { string } replacement - Inputed replacement string.
 * @returns 
 */
export function replaceNoneEmptyString(nestedList : string[][], replacement : string){
    return nestedList.map(sublist =>
        sublist.map(item =>
            item !== "" ? replacement : item
        )
    )
}
/**
 * Takes a list of list of concept records and returns a list of list of names from the concept records in the same order.
 * @param { ConceptRecord[][] } concepts - List of list of Concept records. 
 * @returns { string[][] } - List of list of strings of just the names.
 */
export function getNamesFromConceptGrid(concepts : ConceptRecord[][]){
    return concepts.map(sublist =>
        sublist.map(item =>
            item.name
        )
    )
}
export const emptyRecord = {
    name  : '',
    constructionID : '',
    imageB64: '',
    inputSchema: [],
    outputSchema: [],
}