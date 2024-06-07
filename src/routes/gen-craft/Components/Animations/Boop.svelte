<script lang="ts">
    import { spring } from 'svelte/motion';
    import { onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import { writable } from 'svelte/store';

    let hovering = false;
    interface Transform {
        scale: number;
        rotate: number;
        translateX: number;
    }

    interface RGBColor {
        r: number;
        g: number;
        b: number;
    }
    let colorString = '';
    let defaultColor = { r: 50, g: 50, b: 60 };
    let transitionedColor = { r: 30, g: 0, b: 0 };
    let interval: number | undefined;
    let transform = spring<Transform>({ scale: 1, rotate: 0, translateX: 0 }, { stiffness: 0.1, damping: 0.25 });
    let color = tweened<RGBColor>(defaultColor, { duration: 500, easing: cubicOut });
    function startAnimation() {
        let direction = 1;
        interval = window.setInterval(() => {
            transform.set({
                scale: 1 + 0.2 * direction,
                rotate: 10 * direction,
                translateX: (direction == 1? -30 * direction : -55 * direction)
            });
            direction *= -1;
            if (direction === 1){
                color.set(transitionedColor); 
            }else{
                color.set(defaultColor); 
            }
        }, 500); 

    }

    function stopAnimation() {
        if (interval !== undefined) {
            clearInterval(interval);
            interval = undefined;
        }
        transform.set({ scale: 1, rotate: 0, translateX: 0 });
        color.set(defaultColor); 
    }

    onDestroy(() => {
        if (interval !== undefined) {
            clearInterval(interval);
        }
    });
    $: colorString = `rgb(${$color.r}, ${$color.g}, ${$color.b})`;
</script>

<style>
    .animate-on-hover {
        text-align: center;
        transition: transform 0.3s;
    }
</style>

<span 
    class="animate-on-hover"
    on:mouseover={() => { hovering = true; startAnimation(); }}
    on:mouseout={() => { hovering = false; stopAnimation(); }}
    style="transform: scale({$transform.scale}) rotate({$transform.rotate}deg) translateX({$transform.translateX}px); font-size: 10rem; cursor: pointer; color: {colorString};" 
>
➧
</span>
