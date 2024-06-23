<script lang="ts">
	import type { ConceptRecord, MethodRecord } from '../Game/types';
    export let conceptSquare : ConceptRecord | MethodRecord;
	export let x : number;
	export let y : number;
	export let isOutput = false;

</script>

<style>
	.conceptSquare {
		height : 45px;
		width : 45px;
		background-color: rgb(158, 158, 158);
		box-shadow:  inset 3px 3px black, 3px 3px white;
		display:flex;
		align-items:center;
		justify-content:center;
		font-size:30px;
		font-weight:900;
	}
	.inputSquareImage {
		max-width : 100%;
		max-height : 100%;
	}
</style>
<div class=conceptSquare id={`${x},${y}`} >
	<img class=inputSquareImage src={conceptSquare.imageB64} alt={conceptSquare.name} title={conceptSquare.name}>
</div>
