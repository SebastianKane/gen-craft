<script lang="ts">
    import { Motion } from 'svelte-motion';
	let l = "";
</script>
<Motion>

</Motion>

<style>
	.outputSquare {
		width:80px;
		height:80px;
		border-radius:50%;
		color:white;
		display:flex;
		align-items:center;
		justify-content:center;
		font-size:30px;
		font-weight:900;
	}
</style>

<Motion let:motion layoutId={'3'} layout>
	<div use:motion class=emptySquare}>
		{l}
	</div>
</Motion>