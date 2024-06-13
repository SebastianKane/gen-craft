<script lang="ts">
	import { spring } from 'svelte/motion';
    import { CraftMethod } from '../Game/CraftMethod';
	import OutputSquare from './outputSquare.svelte';
	import { AnimateSharedLayout } from 'svelte-motion';
	import { Motion } from 'svelte-motion';
	import EmptySquare from './emptySquare.svelte';
	import InputSquare from './inputSquare.svelte';
	import Boop from './Animations/Boop.svelte';
    export let thisMethod;
	export let width = 400;
	export let height = 200
	$: method = thisMethod;
	$: currentOutputs = method.currentOutputs;
	$: currentInputs = method.currentInputs;

	let gap=10;
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
	
	button {
		border:4px solid white;
		background-color: transparent;
		color: white;
		border-radius:4rem;
		padding:1rem 2rem;
		font-size:200%;
	}
	  
  </style>
  <div class="methodBackground" style={'width:'+width+'px; height:'+height+'px;'}>
	  <div style="display: flex;">
		{thisMethod.name}
		<span style="flex: 1;">
			  <Motion let:motion={grid} layout>
				<div use:grid class=inputContainer style={'grid-gap:'+gap+'px;'}>
					{#each currentInputs as inputLine}
						{#each inputLine as inputSquare}
							{#if inputSquare}
								<InputSquare {inputSquare}/>
							{:else}
								<EmptySquare />
							{/if}
						{/each}
					{/each}
					</div>
			  </Motion>
			</span >
		<Boop>
		</Boop>
		<span style="flex: 1;">
			<Motion let:motion={grid} layout>
				<div use:grid class=outputContainer style={'grid-gap:'+gap+'px'}>
					{#each currentOutputs as outputLine}
						{#each outputLine as outputSquare}
							{#if outputSquare}
								<OutputSquare {outputSquare}/>
							{:else}
								<EmptySquare/>
							{/if}
						{/each}
					{/each}
				</div>
			</Motion>
		</span>
	  </div>
  </div>