<script lang="ts">
	import { Motion } from 'svelte-motion';
	import Boop from './Animations/Boop.svelte';
	import ConceptSquare from './ConceptSquare.svelte';
    export let thisMethod;
	let method = thisMethod;
	let currentOutputs = method.currentOutputs;
	let currentInputs = method.currentInputs;
	$: {
		method = thisMethod;
		currentOutputs = method.currentOutputs;
		currentInputs = method.currentInputs;
		console.log(`the current title is ${currentOutputs[0][0].name}`);
		}
</script>

<style>
	:global(*) {
	box-sizing: border-box;
  	}
	.methodBackground {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			border: 4px solid grey;
			background-color: floralwhite;
		}
	.inputContainer {
		display:grid;
		grid-template-columns:auto auto auto;
	}
	.outputContainer {
		display:grid;
		grid-template-columns:auto auto;
	}
	
	span {
			display: flex;
			align-items: center;
			justify-content: center;
		}
	
	.methodBackground{
		width:400px;
		aspect-ratio: 2/1;
		position:relative;
	}
	.inputContainer, .outputContainer{
		grid-gap:10px;
	}
	  
  </style>
  <div class="methodBackground">
	  <div style="display: flex;">
		{thisMethod.name}
		<span style="flex: 1;">
			  <Motion let:motion={grid} layout>
				<div use:grid class=inputContainer>
					{#each currentInputs as inputLine, y}
						{#each inputLine as conceptSquare, x}
							<ConceptSquare  { conceptSquare } { x } { y }/>
						{/each}
					{/each}
					</div>
			  </Motion>
			</span >
		<Boop>
		</Boop>
		<span style="flex: 1;">
			<Motion let:motion={grid} layout>
				<div use:grid class=outputContainer >
					{#each currentOutputs as outputLine, y}
						{#each outputLine as conceptSquare, x}
							<ConceptSquare { conceptSquare } { x } { y } isOutput= { true }/>
						{/each}
					{/each}
				</div>
			</Motion>
		</span>
	  </div>
  </div>