<script>
    import { onMount } from "svelte";
    import * as Tone from "tone";

    import FloatingInput from "$lib/FloatingInput.svelte";

    let numMeasures = 5;
    let secsPerMeasure = 2;
    let beatsPerMeasure = 4;
    let playing = false;
    let dropdownIsActive = true;
    let presetRegistrationIsOn = true;
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
        dropdownIsActive = false;
        if (playing) {
            bass1.stop();
            bass2.stop();
            if (stopTimeout !== undefined) {
                clearTimeout(stopTimeout);
                stopTimeout = undefined;
            }
        } else {
            Tone.loaded().then(() => {
                const now = Tone.now();
                let secsPerBeat = secsPerMeasure / beatsPerMeasure;
                let timeIncrement = 0;
                for (let iMeasure = 0; iMeasure < numMeasures; iMeasure++) {
                    let player = bass1;
                    for (let iBeat = 0; iBeat < beatsPerMeasure; iBeat++) {
                        player.start(now + timeIncrement);
                        player = bass2;
                        timeIncrement += secsPerBeat;
                    }
                }
            });
            stopTimeout = setTimeout(() => {
                playing = false;
            }, numMeasures * secsPerMeasure * 1000);
        }
        playing = !playing;
    }

    function register_preset() {
        presetRegistrationIsOn = false;
    }
</script>

<div class="mx-2">
    <div class=" mt-2 space-y-2">
        <FloatingInput label="Number of repetitions" bind:value={numMeasures} />
        <FloatingInput label="Seconds per repetition" bind:value={secsPerMeasure} />
        <FloatingInput label="Beats per repetition" bind:value={beatsPerMeasure} />

        {#if !playing}
            <div class="flex">
                <button on:click={toggle_play} class="bg-indigo-500 text-white rounded-sm py-3 flex-grow rounded-r-none"
                    >Play</button
                >
                <button
                    class="bg-indigo-500 text-white rounded-sm py-3 px-3 flex items-center border-l-2 border-indigo-300"
                    class:bg-indigo-700={dropdownIsActive}
                    on:click={() => (dropdownIsActive = !dropdownIsActive)}
                >
                    <span class="material-icons">{dropdownIsActive ? "expand_less" : "expand_more"}</span>
                </button>
            </div>
        {:else}
            <button on:click={toggle_play} class="w-full bg-orange-700 text-white rounded-sm py-3">Stop</button>
        {/if}
    </div>

    <!-- Dropdown menu -->
    <div class="w-full border-2 border-indigo-300/50" class:hidden={!dropdownIsActive}>
        <div class="z-10 shadow-xl bg-white rounded divide-gray-100 inner-popup">
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
                        <a href="#" class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >Preset 1: 50reps - 1secs - 2beats</a
                        >
                    </li>
                    <li>
                        <a href="#" class="block py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            >Preset 2: 20reps - 0.5secs - 1beat</a
                        >
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div>Other ocntent</div>
</div>

<style>
    .inner-popup {
        border: 1px solid #80808000;
        background-color: white;
    }
</style>
