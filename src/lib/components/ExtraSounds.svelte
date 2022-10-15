<script>
    import { onMount } from "svelte";
    import { extraSoundsStore } from "$lib/stores/extraSounds";

    let menu_is_expanded = false;
    let allSounds = [];

    onMount(() => {
        extraSoundsStore.useLocalStorage();
        allSounds = $extraSoundsStore.soundList
            .filter((item) => item.url != null)
            .map((item) => {
                return {
                    audio: new Audio(item.url),
                    label: item.label,
                };
            });
    });
</script>

<div class="absolute bottom-0 w-full">
    <div
        class="ml-10 w-fit h-12 rounded-lg p-1 bg-slate-100 overflow-y-hidden rounded-t-full  border border-slate-200 cursor-pointer"
        on:click={() => {
            menu_is_expanded = !menu_is_expanded;
        }}
    >
        <div class="material-icons -translate-y-2 text-slate-700" style="font-size: 3rem;">
            {menu_is_expanded ? "expand_more" : "expand_less"}
        </div>
    </div>

    <div class="grid grid-cols-3 bg-slate-100 p-1 border border-t-slate-300 overflow-y-auto" style="max-height: 178px">
        {#each allSounds as soundItem (soundItem.label)}
            <button
                class="p-3 m-1 flex justify-center items-center bg-sky-600 text-sky-200 rounded-md break-all"
                class:hidden={!menu_is_expanded}
                on:click={() => soundItem.audio.play()}>{soundItem.label}</button
            >
        {/each}
    </div>
</div>
