<script>
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import DropdownButton from "$lib/DropdownButton.svelte";
    import FloatingInputWithButtons from "$lib/FloatingInputWithButtons.svelte";

    let numMeasures = 5;
    let secsPerMeasure = 1;
    let beatsPerMeasure = 2;
    $: if (numMeasures < 1) {
        numMeasures = 1;
    }
    $: if (secsPerMeasure < 1) {
        secsPerMeasure = 1;
    }
    $: if (beatsPerMeasure < 1) {
        beatsPerMeasure = 1;
    }
    $: secsPerBeat = secsPerMeasure / beatsPerMeasure;

    let playing = false;
    let dropdownIsActive = false;
    let presetRegistrationIsOn = false;

    let measureCount = 0;
    /**
     * @type {NodeJS.Timeout | undefined}
     */
    let measureCountIntv;
    /**
     * @type {NodeJS.Timeout | undefined}
     */
    let stopTimeout;
    /**
     * @type {Tone.Player}
     */
    let bass1;
    /**
     * @type {Tone.Player}
     */
    let bass2;

    onMount(() => {
        bass1 = new Tone.Player("house-kick-bassy-punchy-4.wav").toDestination();
        bass2 = new Tone.Player("slap-house-kit-bass-shot.wav").toDestination();
    });

    function toggle_play() {
        if (playing) {
            bass1.stop();
            bass2.stop();
            if (stopTimeout !== undefined) {
                clearTimeout(stopTimeout);
                stopTimeout = undefined;
            }
            if (measureCountIntv !== undefined) {
                clearInterval(measureCountIntv);
                measureCountIntv = undefined;
            }
            measureCount = 0;
        } else {
            Tone.loaded().then(() => {
                const now = Tone.now();
                let timeIncrement = 0;
                for (let iMeasure = 0; iMeasure < numMeasures; iMeasure++) {
                    let player = bass2;
                    for (let iBeat = 0; iBeat < beatsPerMeasure; iBeat++) {
                        player.start(now + timeIncrement);
                        player = bass1;
                        timeIncrement += secsPerBeat;
                    }
                }
                measureCount++;
                measureCountIntv = setInterval(() => {
                    measureCount++;
                    if (measureCount == numMeasures) {
                        clearInterval(measureCountIntv);
                    }
                }, secsPerMeasure * 1000);
                stopTimeout = setTimeout(() => {
                    playing = false;
                }, numMeasures * secsPerMeasure * 1000);
            });
        }
        playing = !playing;
    }

    function register_preset() {
        presetRegistrationIsOn = false;
    }
</script>

<div class="mx-2">
    <div class=" mt-2 space-y-2">
        <div class="inputs">
            <FloatingInputWithButtons bind:value={numMeasures} label="Num Measures" inputClasses="" />
            <FloatingInputWithButtons bind:value={secsPerMeasure} label="secs per Measure" inputClasses="" />
            <FloatingInputWithButtons bind:value={beatsPerMeasure} label="Beats per Measure" inputClasses="" />
        </div>

        {#if !playing}
            <div class="flex">
                <button on:click={toggle_play} class="bg-indigo-500 text-white rounded-sm py-3 flex-grow rounded-r-none"
                    >Play</button
                >
                <DropdownButton menuStyles="right: 0; width: 90vw; width: calc(100vw - 1rem);">
                    <button
                        slot="button"
                        class="bg-indigo-500 text-white rounded-sm py-3 px-3 flex items-center border-l-2 border-l-indigo-600"
                        on:click={() => (dropdownIsActive = !dropdownIsActive)}
                    >
                        <span class="material-icons">expand_more</span>
                    </button>
                    <div slot="menu" class="bg-white border-2 shadow-lg p-3">
                        <div class="flex" class:hidden={!presetRegistrationIsOn}>
                            <input type="text" placeholder="Preset name" class="w-1/2 px-3 flex-grow" />
                            <a href="#" class="p-3 flex items-center ml-auto" on:click={register_preset}>
                                <span class="material-icons">add </span> Save current
                            </a>
                        </div>
                        <div class="border-t-2 border-gray-50 p-4">
                            <input type="text" placeholder="Search presets..." class="w-full p-2" />
                            <ul class="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefault">
                                <li>
                                    <a
                                        href="#"
                                        class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >Preset 1: 50reps - 1secs - 2beats</a
                                    >
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >Preset 2: 20reps - 0.5secs - 1beat</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </DropdownButton>
            </div>
        {:else}
            <button on:click={toggle_play} class="w-full bg-orange-700 text-white rounded-sm py-3">Stop</button>
        {/if}
    </div>
</div>

<div class="flex-grow flex justify-center items-center">
    <div class="h-36 w-36 rounded-full bg-slate-300 p-28 flex justify-center items-center">
        <span class="text-9xl text-slate-600">{measureCount}</span>
    </div>
</div>

<div class="mb-10 mx-3 space-x-3 bg-slate-200 flex">
    {#each { length: numMeasures } as _, i}
        <span class="w-3 h-10 bg-sky-500/75 flex-grow" />
    {/each}
</div>

<style>
    .inner-popup {
        border: 1px solid #80808000;
        background-color: white;
    }
    .inputs :global(input) {
        width: 10rem;
    }
</style>
