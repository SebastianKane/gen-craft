<script lang="ts">
    import { Motion } from 'svelte-motion';
    export let outputSquare;
</script>
<Motion>

</Motion>

<style>
	.outputSquare {
		width:2.5rem;
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
</style>

<Motion let:motion layoutId={outputSquare.id} layout>
	<div use:motion class=outputSquare style={`background-color:rgb(${outputSquare.r},${outputSquare.g},${outputSquare.b})`}>
		_
	</div>
</Motion>