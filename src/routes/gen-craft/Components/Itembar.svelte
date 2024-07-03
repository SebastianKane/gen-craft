<script lang='ts'>
    import { Toolbar } from "flowbite-svelte";
	import ConceptSquare from "./ConceptSquare.svelte";
	import type { ConceptRecord, MethodRecord } from "../Game/types";
    export let items : (ConceptRecord | MethodRecord )[];
</script>
<style>
    .toolbar{
        position : fixed;
        left: 1%;
        height : 70px;
        width : 98%;
        bottom : 10px;
        background-color: lightgrey;
    }
    .conceptContainer{
        position: fixed;
        padding-left: 50%;
    }
</style>
<div class=toolbar>
    <div class=conceptContainer>
    {#each items as conceptSquare, x}
    <ConceptSquare  { conceptSquare } { x } y = { 0 } />
    {/each}
    </div>
</div>