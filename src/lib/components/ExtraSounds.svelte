<script>
    import { onMount } from "svelte";

    let menu_is_expanded = false;
    let audio_repetimos, audio_fail, audio_aplauso, audio_codos, audio_rodillas, audio_talones, audio_pecho;
    let allSounds = [];

    onMount(() => {
        audio_repetimos = new Audio("extra-sounds/repetimos.mp3");
        audio_fail = new Audio("extra-sounds/fail.wav");
        audio_aplauso = new Audio("extra-sounds/aplauso.wav");

        audio_codos = new Audio("extra-sounds/codos.mp3");
        audio_rodillas = new Audio("extra-sounds/rodillas.mp3");
        audio_talones = new Audio("extra-sounds/talones.mp3");
        audio_pecho = new Audio("extra-sounds/pecho.mp3");
        allSounds = [
            {
                audio: audio_repetimos,
                label: "Repetimos",
            },
            {
                audio: audio_fail,
                label: "Fail",
            },
            {
                audio: audio_aplauso,
                label: "Aplauso",
            },
            {
                audio: audio_codos,
                label: "Codos",
            },
            {
                audio: audio_rodillas,
                label: "Rodillas",
            },
            {
                audio: audio_talones,
                label: "Talones",
            },
            {
                audio: audio_pecho,
                label: "Pecho",
            },
        ];
    });
</script>

<div
    class="absolute bottom-0 left-5 rounded-lg p-1 bg-orange-200 overflow-y-auto border-2 border-amber-100"
    style={menu_is_expanded
        ? "max-width: 90vw; max-height: 120px;"
        : "max-width: 90vw; max-height: 120px; border-top-left-radius: 100px; border-top-right-radius: 100px;"}
>
    <div
        class="flex justify-center items-center text-orange-900 cursor-pointer"
        class:pr-2={menu_is_expanded}
        class:w-12={!menu_is_expanded}
        on:click={() => {
            menu_is_expanded = !menu_is_expanded;
        }}
    >
        <div class="material-icons" style="font-size: {menu_is_expanded ? '3' : '2'}rem;">
            {menu_is_expanded ? "expand_more" : "expand_less"}
        </div>
        <div class="" class:hidden={!menu_is_expanded}>Extra sounds</div>
    </div>
    <div class="grid grid-cols-3">
        {#each allSounds as soundItem (soundItem.label)}
            <button
                class="p-3 m-1 flex justify-center items-center bg-amber-600 text-amber-200 rounded-md"
                class:hidden={!menu_is_expanded}
                on:click={() => soundItem.audio.play()}>{soundItem.label}</button
            >
        {/each}
    </div>
</div>
