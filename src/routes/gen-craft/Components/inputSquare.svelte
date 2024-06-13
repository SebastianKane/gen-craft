<script lang="ts">
    import { Motion } from 'svelte-motion';
    export let inputSquare;

</script>
<Motion>

</Motion>

<style>
	.inputSquare {
		height : 45px;
		width : 45px;
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
	.inputSquareImage {
		max-width : 100%;
		max-height : 100%;
	}
</style>

<Motion let:motion layoutId={inputSquare.id} layout>
	<div use:motion class=inputSquare style={`background-color:rgb(${inputSquare.r},${inputSquare.g},${inputSquare.b})`}>
		<img class=inputSquareImage src={inputSquare.imageB64} alt={inputSquare.name} title={inputSquare.name}>
	</div>
</Motion>