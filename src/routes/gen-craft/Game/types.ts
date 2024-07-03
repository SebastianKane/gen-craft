import type { squareFill } from "$lib/stores/interfaces"

export interface ConceptRecord {
    name : string;
    constructionID:string;
    imageB64: string;
}


export interface MethodRecord extends ConceptRecord {
    inputSchema: squareFill[][];
    outputSchema: squareFill[][];
}

export type RecordType = ConceptRecord | MethodRecord;