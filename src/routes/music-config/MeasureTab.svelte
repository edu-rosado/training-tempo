<script>
    import { soundStore, addNewSoundSet } from "$lib/stores/sounds";
    import { onMount } from "svelte";

    let selectedSoundSet;
    $: if (selectedSoundSet !== undefined) {
        $soundStore.selected = selectedSoundSet;
    }

    const checkIconBaseClass = "material-icons p-1 rounded-full bg-gray-300 text-white my-auto cursor-pointer";
    const checkIconActiveClass = "material-icons p-1 rounded-full bg-green-300 text-green-600 my-auto cursor-pointer";

    onMount(() => {
        soundStore.useLocalStorage();
        selectedSoundSet = $soundStore.selected ?? "default-1";
    });
</script>

<div class="p-2 relative h-full bg-gray-100 overflow-y-auto pb-16">
    {#each $soundStore.soundSets as soundSet, index (soundSet.name)}
        <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
            <span
                class={selectedSoundSet === index ? checkIconActiveClass : checkIconBaseClass}
                style="font-size: 2rem; width: fit-content; height: fit-content;"
                on:click={() => {
                    selectedSoundSet = index;
                }}>done</span
            >
            <div class="col-span-3">
                <div>{soundSet.name}</div>
                <div class="text-sm">{soundSet.isDefault ? "Default" : "Custom"}</div>
            </div>

            {#if soundSet.isDefault}
                {#if soundSet.id == 0}
                    <span
                        class="material-icons col-span-2 my-auto mx-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
                        style="font-size: 2rem; width: fit-content; height: fit-content;"
                        on:click={() => {
                            const audio = new Audio("/strong_beat_3.wav");
                            audio.play();
                        }}
                        >play_arrow
                    </span>
                {/if}
            {:else}
                <div class="flex justify-center col-span-2">
                    <a class="flex items-center" href="music-config/sounds/{index}">
                        <span
                            class="material-icons my-auto ml-2 p-2 rounded-full bg-gray-200 cursor-pointer"
                            style="font-size: 1.5rem; width: fit-content; height: fit-content;">tune</span
                        >
                    </a>
                </div>
            {/if}
        </div>
    {/each}

    <button on:click={addNewSoundSet}
        ><span
            class="material-icons fixed bottom-5 right-5 text-indigo-500/75 bg-indigo-200/75 p-2 rounded-full"
            style="font-size: 3rem;">add</span
        ></button
    >
</div>
