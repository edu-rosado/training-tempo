<script>
    import { soundStore, setupSoundStore } from "$lib/stores/sounds";
    import { onMount } from "svelte";

    let selected_tab = "measure";

    $: if (selected_tab === "measure") {
    }

    let selectedSoundSet;
    $: if (selectedSoundSet !== undefined) {
        console.log("upp");
        $soundStore.selected = selectedSoundSet;
    }

    const checkIconBaseClass = "material-icons p-1 rounded-full bg-gray-300 text-white my-auto cursor-pointer";
    const checkIconActiveClass = "material-icons p-1 rounded-full bg-green-300 text-green-600 my-auto cursor-pointer";

    onMount(() => {
        setupSoundStore();
        console.log(selectedSoundSet);
        selectedSoundSet = $soundStore.selected ?? "default-1";
        console.log(selectedSoundSet);
    });
</script>

<div class="grid grid-cols-2">
    <div
        class={"p-3 border roundex-sm border-indigo-400/25 bg-indigo-100/50 text-indigo-700 font-light flex justify-center items-center" +
            (selected_tab === "measure" ? " border-b-4 border-b-indigo-500 font-normal" : "")}
        on:click={() => {
            selected_tab = "measure";
        }}
    >
        Measure sound
    </div>
    <div
        class={"p-3 border roundex-sm border-indigo-400/25 bg-indigo-100/50 text-indigo-700 font-light flex justify-center items-center" +
            (selected_tab === "beat" ? " border-b-4 border-b-indigo-500 font-normal" : "")}
        on:click={() => {
            selected_tab = "beat";
        }}
    >
        Beat sound
    </div>
</div>

<div class="p-2 relative h-full bg-gray-100 overflow-y-auto pb-16">
    <!-- DEFAULTS -->

    <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
        <span
            class={selectedSoundSet === "default-1" ? checkIconActiveClass : checkIconBaseClass}
            style="font-size: 2rem; width: fit-content; height: fit-content;"
            on:click={() => (selectedSoundSet = "default-1")}>done</span
        >
        <div class="col-span-3">
            <div>Default</div>
            <div class="text-sm">Single sound</div>
        </div>
        <span
            class="material-icons col-span-2 my-auto mx-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
            style="font-size: 2rem; width: fit-content; height: fit-content;">play_arrow</span
        >
    </div>

    <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
        <span
            class={selectedSoundSet === "default-2" ? checkIconActiveClass : checkIconBaseClass}
            style="font-size: 2rem; width: fit-content; height: fit-content;"
            on:click={() => (selectedSoundSet = "default-2")}>done</span
        >
        <div class="col-span-3">
            <div>Default voice</div>
            <div class="text-sm">Multi sound</div>
        </div>
        <span
            class="material-icons col-span-2 my-auto mx-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
            style="font-size: 2rem; width: fit-content; height: fit-content;">play_arrow</span
        >
    </div>

    <!-- CUSTOM -->
    {#each $soundStore.soundSets as soundSet, index (soundSet.name)}
        <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
            <span
                class={selectedSoundSet === index ? checkIconActiveClass : checkIconBaseClass}
                style="font-size: 2rem; width: fit-content; height: fit-content;"
                on:click={() => {
                    console.log("hwudhwhd");
                    selectedSoundSet = index;
                    console.log(selectedSoundSet);
                }}>done</span
            >
            <div class="col-span-3">
                <div>{soundSet.name}</div>
                <div class="text-sm">Multi sound</div>
            </div>
            <div class="flex justify-center col-span-2">
                <span
                    class="material-icons my-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
                    style="font-size: 2rem; width: fit-content; height: fit-content;">play_arrow</span
                >
                <a class="flex items-center" href="music-config/sounds/{index}">
                    <span
                        class="material-icons my-auto ml-2 p-2 rounded-full bg-gray-200 cursor-pointer"
                        style="font-size: 1.5rem; width: fit-content; height: fit-content;">tune</span
                    >
                </a>
            </div>
        </div>
    {/each}

    <button
        ><span
            class="material-icons fixed bottom-5 right-5 text-indigo-500/75 bg-indigo-200/75 p-2 rounded-full"
            style="font-size: 3rem;">add</span
        ></button
    >
</div>
