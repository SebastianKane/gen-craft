export function replaceNoneEmptyString(nestedList : string[][], replacement : string){
    return nestedList.map(sublist =>
        sublist.map(item =>
            item !== "" ? replacement : item
        )
    )
}