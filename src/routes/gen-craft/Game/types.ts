import type { squareFill } from "$lib/stores/interfaces"

export type ConceptRecord = {
    name : string,
    constructionID:string,
    imageB64: string
}


export type MethodRecord = ConceptRecord & {
    inputSchema: squareFill[][],
    outputSchema: squareFill[][],
}