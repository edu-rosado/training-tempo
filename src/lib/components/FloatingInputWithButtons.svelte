<script>
    import FloatingInput from "$lib/components/FloatingInput.svelte";

    export /**
     * @type {any}
     */
    let value;
    export let label = "";
    export let buttonValues = [-5, -1, 1, 5];
    export let inputClasses = "";

    // @ts-ignore
    $: displayButtons = displayButtons = buttonValues
        // @ts-ignore
        .sort((a, b) => a <= b);
</script>

<div class="flex main">
    <FloatingInput {label} bind:value classes={inputClasses} />
    <div class="flex-grow grid grid-cols-4">
        {#each displayButtons as btn (btn)}
            {#if btn < 0}
                <button
                    class="flex-grow flex justify-center items-center m-1 rounded-md bg-red-200 text-red-700"
                    on:click={() => (value += btn)}>{btn}</button
                >
            {:else}
                <button
                    class="flex-grow flex justify-center items-center m-1 rounded-md bg-green-200 text-green-700"
                    on:click={() => (value += btn)}>{btn}</button
                >
            {/if}
        {/each}
    </div>
</div>

<style>
    .main :global(input) {
        width: 7rem;
    }
</style>
