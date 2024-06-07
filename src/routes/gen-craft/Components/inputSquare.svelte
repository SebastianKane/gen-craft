<script lang="ts">
    import { Motion } from 'svelte-motion';
    export let inputSquare;

</script>
<Motion>

</Motion>

<style>
	.inputSquare {
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

<Motion let:motion layoutId={inputSquare.id} layout>
	<div use:motion class=inputSquare style={`background-color:rgb(${inputSquare.r},${inputSquare.g},${inputSquare.b})`}>
		_		
	</div>
</Motion>