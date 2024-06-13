<script lang="ts">
    import { Motion } from 'svelte-motion';
	import type { ConceptRecord, MethodRecord } from '../Game/types';
    export let outputSquare : ConceptRecord | MethodRecord;
	$: outputSquare = outputSquare;
</script>
<Motion>

</Motion>

<style>
	.outputSquare {
		height: 45px;
		width: 45px;
		border-style: dotted;
		color:white;
		background-color: aliceblue;
		border-color: black;
		display:flex;
		align-items:center;
		justify-content:center;
		font-size:30px;
		font-weight:900;
	}
	.outputSquareImage {
		max-width : 100%;
		max-height : 100%;
	}
</style>

<Motion let:motion layoutId={outputSquare.name} layout>
	<div use:motion class=outputSquare >
		<img class=outputSquareImage src={outputSquare.imageB64} alt={outputSquare.name} title={outputSquare.name}>
	</div>
</Motion>