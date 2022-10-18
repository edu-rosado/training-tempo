<script>
    import MeasureTab from "./MeasureTab.svelte";
    import ExtraSoundsTab from "./ExtraSoundsTab.svelte";

    let selected_tab = "measure";
</script>

<div class="grid grid-cols-2">
    <div
        class={"p-3 border roundex-sm border-indigo-400/25 bg-indigo-100/50 text-indigo-700 font-light flex justify-center items-center cursor-pointer" +
            (selected_tab === "measure" ? " border-b-4 border-b-indigo-500 font-normal" : "")}
        on:click={() => {
            selected_tab = "measure";
        }}
    >
        Measure sound
    </div>
    <div
        class={"p-3 border roundex-sm border-indigo-400/25 bg-indigo-100/50 text-indigo-700 font-light flex justify-center items-center cursor-pointer" +
            (selected_tab === "extra" ? " border-b-4 border-b-indigo-500 font-normal" : "")}
        on:click={() => {
            selected_tab = "extra";
        }}
    >
        Extra sounds
    </div>
</div>

{#if selected_tab === "measure"}
    <MeasureTab />
{:else if selected_tab === "extra"}
    <ExtraSoundsTab />
{/if}
