<script>
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import * as Tone from "tone";

    import DropdownButton from "$lib/components/DropdownButton.svelte";
    import FloatingInputWithButtons from "$lib/components/FloatingInputWithButtons.svelte";
    import FloatingInput from "$lib/components/FloatingInput.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { presetStore, setupPresetStore } from "$lib/stores/presets";
    import { soundStore } from "$lib/stores/sounds";
    import ExtraSounds from "$lib/components/ExtraSounds.svelte";

    let numMeasures = null;
    let secsPerMeasure = null;
    let beatsPerMeasure = null;
    let presetStoreMounted = false;
    $: if (presetStoreMounted) {
        updateCurrentConfig(numMeasures, secsPerMeasure, beatsPerMeasure);
    }
    $: if (numMeasures !== "" && numMeasures < 1) {
        numMeasures = 1;
    }
    $: if (secsPerMeasure !== "" && secsPerMeasure < 0.5) {
        secsPerMeasure = 0.5;
    }
    $: if (beatsPerMeasure !== "" && beatsPerMeasure < 1) {
        beatsPerMeasure = 1;
    }
    $: if (beatsPerMeasure > 12) {
        beatsPerMeasure = 12;
    }
    $: secsPerBeat = secsPerMeasure / beatsPerMeasure;
    $: numMeasures && pctCountInterpolated.set(0, { duration: 0 });

    let playing = false;

    /**
     * @type {number | undefined}
     */
    let outerCircleWidth;
    /**
     * @type {number | undefined}
     */
    let innerCircleWidth;
    let outerCircleRadius = 0;
    let innerCircleRadius = 0;
    $: if (outerCircleWidth !== undefined) {
        outerCircleRadius = outerCircleWidth / 2;
    }
    $: if (innerCircleWidth !== undefined) {
        innerCircleRadius = innerCircleWidth / 2;
    }
    const startingAngle = -Math.PI / 2;
    const endingAngle = (3 / 2) * Math.PI;
    const innerCircleTweened = tweened(startingAngle, {});
    $: innerCircleX =
        Math.cos($innerCircleTweened) * (outerCircleRadius - innerCircleRadius * 1.5) +
        outerCircleRadius -
        innerCircleRadius;
    $: innerCircleY =
        Math.sin($innerCircleTweened) * (outerCircleRadius - innerCircleRadius * 1.5) +
        outerCircleRadius -
        innerCircleRadius;

    /**
     * @type {Number[]}
     */
    let innerAuxiliaryCircles = [];
    $: if (beatsPerMeasure) {
        let anglePerBeat = (2 * Math.PI) / beatsPerMeasure;
        let temp_innerAuxiliaryCircles = [];
        for (let i = 0; i < beatsPerMeasure; i++) {
            const angle = startingAngle + anglePerBeat * i;
            temp_innerAuxiliaryCircles.push({
                left:
                    Math.cos(angle) * (outerCircleRadius - innerCircleRadius * 1.5) +
                    outerCircleRadius -
                    innerCircleRadius,
                top:
                    Math.sin(angle) * (outerCircleRadius - innerCircleRadius * 1.5) +
                    outerCircleRadius -
                    innerCircleRadius,
            });
        }
        innerAuxiliaryCircles = temp_innerAuxiliaryCircles;
    }

    let measureCount = 0;
    let pctCountInterpolated = tweened(0, {});
    /**
     * @type {NodeJS.Timeout | undefined}
     */
    let measureCountIntv;
    /**
     * @type {NodeJS.Timeout | undefined}
     */
    let stopTimeout;
    let weak_tone;
    let finish_tone;

    let dropdownIsOpen = false;
    let newPresetName = "";
    let newPresetErrorMsg = null;
    let presetModalIsOpen = false;

    let default_measure_tone;
    let multi_measure_tones = [];

    let isMobile = true;

    onMount(() => {
        isMobile = window.matchMedia("(max-width: 480px)").matches;

        soundStore.useLocalStorage();

        setupTones();

        /////////////////////
        setupPresetStore();
        if ($presetStore.currentConfig != null) {
            numMeasures = $presetStore.currentConfig.numMeasures;
            secsPerMeasure = $presetStore.currentConfig.secsPerMeasure;
            beatsPerMeasure = $presetStore.currentConfig.beatsPerMeasure;
        }
        presetStoreMounted = true;
    });

    function setupTones(do_reset = false) {
        if (do_reset) {
            weak_tone.disconnect();
            default_measure_tone.disconnect();
            multi_measure_tones.forEach((tone) => {
                tone.disconnect();
            });
            multi_measure_tones = [];
            finish_tone.disconnect();
        }
        if (
            typeof $soundStore?.selected == "number" &&
            Array.isArray($soundStore?.soundSets) &&
            $soundStore.soundSets.length
        ) {
            const soundItems = $soundStore.soundSets[$soundStore.selected].soundItems;
            default_measure_tone = new Tone.Player(soundItems[0].src).toDestination();
            soundItems.forEach((soundItem) => {
                if (soundItem.src !== undefined)
                    multi_measure_tones.push(new Tone.Player(soundItem.src).toDestination());
                else multi_measure_tones.push(default_measure_tone);
            });
        } else {
            default_measure_tone = new Tone.Player("house-kick-bassy-punchy-4.wav").toDestination();
        }

        weak_tone = new Tone.Player("drum-sticks_1bpm_E_minor.wav").toDestination();
        finish_tone = new Tone.Player("success-notification_C_major.wav").toDestination();
    }

    function reset_play() {
        measureCount = 0;
        pctCountInterpolated.set(0, { duration: 0 });
        innerCircleTweened.set(startingAngle, { duration: 0 });
    }

    /**
     * @param {MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }} ev
     */
    function toggle_play(ev, is_pause_resume = false) {
        if (playing) {
            setupTones(true);

            Tone.Transport.pause();

            if (stopTimeout !== undefined) {
                clearTimeout(stopTimeout);
                stopTimeout = undefined;
            }
            if (measureCountIntv !== undefined) {
                clearInterval(measureCountIntv);
                measureCountIntv = undefined;
            }
            if (is_pause_resume) {
                pctCountInterpolated.set((measureCount / numMeasures) * 100, { duration: 0 });
                innerCircleTweened.set(startingAngle, { duration: 0 });
            } else {
                reset_play();
            }
        } else {
            if (numMeasures === "") {
                numMeasures = 1;
            }
            if (secsPerMeasure === "") {
                secsPerMeasure = 1;
            }
            if (beatsPerMeasure === "") {
                beatsPerMeasure = 1;
            }
            if (!is_pause_resume) {
                reset_play();
            }
            Tone.loaded().then(() => {
                const now = Tone.now();
                let timeIncrement = 0;
                for (let iMeasure = measureCount; iMeasure < numMeasures + 1; iMeasure++) {
                    let player = default_measure_tone;
                    if (iMeasure < multi_measure_tones.length) {
                        player = multi_measure_tones[iMeasure];
                    }
                    if (iMeasure == numMeasures) {
                        player.start(now + timeIncrement);
                        finish_tone.start(now + timeIncrement + 0.7);
                        break; // Es una iteracion extra para terminar con un strong beat + finishing sound y sin weak beats
                    }
                    for (let iBeat = 0; iBeat < beatsPerMeasure; iBeat++) {
                        player.start(now + timeIncrement);
                        player = weak_tone;
                        timeIncrement += secsPerBeat;
                    }
                }
                let total_duration = (numMeasures - measureCount) * secsPerMeasure * 1000;
                pctCountInterpolated.set(100, { duration: total_duration });
                innerCircleTweened.set(endingAngle, { duration: secsPerMeasure * 1000 });
                measureCountIntv = setInterval(() => {
                    innerCircleTweened.set(startingAngle, { duration: 0 });
                    innerCircleTweened.set(endingAngle, { duration: secsPerMeasure * 1000 });
                    measureCount++;
                    if (measureCount == numMeasures) {
                        clearInterval(measureCountIntv);
                    }
                }, secsPerMeasure * 1000);
                stopTimeout = setTimeout(() => {
                    playing = false;
                    measureCount = 0;
                    innerCircleTweened.set(startingAngle, { duration: 0 });
                    if (measureCountIntv !== undefined) {
                        clearInterval(measureCountIntv);
                    }
                }, total_duration);
            });
        }
        playing = !playing;
    }

    function applyPreset(name) {
        const with_same_name = $presetStore.presets.filter((val) => val.name == name);
        if (with_same_name.length > 0) {
            numMeasures = with_same_name[0].numMeasures;
            secsPerMeasure = with_same_name[0].secsPerMeasure;
            beatsPerMeasure = with_same_name[0].beatsPerMeasure;
            dropdownIsOpen = false;
            presetStore.update((last) => {
                return {
                    ...last,
                    currentConfig: {
                        numMeasures: with_same_name[0].numMeasures,
                        secsPerMeasure: with_same_name[0].secsPerMeasure,
                        beatsPerMeasure: with_same_name[0].beatsPerMeasure,
                    },
                };
            });
        }
    }
    function deletePreset(name) {
        presetStore.update((vals) => {
            return {
                ...vals,
                presets: vals.presets.filter((val) => val.name !== name),
            };
        });
    }

    function saveNewPreset() {
        if (newPresetName === "") {
            let num = $presetStore.presets.length + 1;
            let candidate_name = `Preset ${num}`;
            while (true) {
                const with_same_name = $presetStore.presets.filter((val) => val.name == candidate_name);
                if (with_same_name.length == 0) {
                    newPresetName = candidate_name;
                    break;
                }
                candidate_name = `Preset ${++num}`;
            }
        }
        const with_same_name = $presetStore.presets.filter((val) => val.name == newPresetName);
        if (with_same_name.length > 0) {
            newPresetErrorMsg = "Ya existe un preset con ese nombre";
            setTimeout(() => {
                newPresetErrorMsg = null;
            }, 3000);
            return;
        }
        presetStore.update((lastVal) => {
            return {
                ...lastVal,
                presets: [
                    ...lastVal.presets,
                    {
                        name: newPresetName,
                        numMeasures,
                        secsPerMeasure,
                        beatsPerMeasure,
                    },
                ],
            };
        });
        newPresetName = "";
        presetModalIsOpen = false;
        dropdownIsOpen = true;
    }

    function updateCurrentConfig(numMeasures, secsPerMeasure, beatsPerMeasure) {
        if (numMeasures == null || secsPerMeasure == null || beatsPerMeasure == null) {
            return;
        }
        presetStore.update((prev) => {
            return {
                ...prev,
                currentConfig: { numMeasures, secsPerMeasure, beatsPerMeasure },
            };
        });
    }
</script>

<div class="mx-2">
    <div class=" mt-2 space-y-2">
        <div class="inputs">
            <FloatingInputWithButtons bind:value={numMeasures} label="Num Measures" inputClasses="" />
            <FloatingInputWithButtons
                bind:value={secsPerMeasure}
                label="Secs/Measure"
                inputClasses=""
                buttonValues={[-1, -0.5, 0.5, 1]}
            />
            <FloatingInputWithButtons bind:value={beatsPerMeasure} label="Beats/Measure" inputClasses="" />
        </div>

        {#if !playing}
            <div class="flex">
                {#if measureCount > 0}
                    <!-- se measureCount > 0 es que habiamos pausado -->
                    <div class="grid grid-cols-3 gap-1 flex-grow">
                        <button
                            on:click={(ev) => toggle_play(ev, true)}
                            class="col-span-2 w-full bg-indigo-500 text-white rounded-md py-3">Resume</button
                        >
                        <button on:click={reset_play} class="w-full bg-orange-700 text-white rounded-md py-3"
                            >Stop</button
                        >
                    </div>
                {:else}
                    <button
                        on:click={toggle_play}
                        class="bg-indigo-500 text-white rounded-sm py-3 flex-grow rounded-r-none">Play</button
                    >
                    <DropdownButton
                        bind:isActive={dropdownIsOpen}
                        menuStyles="right: 0; width: {isMobile ? 'calc(100vw - 1rem)' : '400px'}; z-index: 1"
                    >
                        <button
                            slot="button"
                            class="bg-indigo-500 text-white rounded-sm py-3 px-3 flex items-center border-l-2 border-l-indigo-600"
                        >
                            <span class="material-icons">expand_more</span>
                        </button>
                        <div slot="menu" class="bg-white shadow-lg relative">
                            <div class="border-t-2 border-gray-50">
                                <ul class="py-1 text-sm text-gray-700" aria-labelledby="dropdownDefault">
                                    <li
                                        class="flex items-center py-2 border-b border-sky-200 cursor-pointer"
                                        on:click={() => {
                                            presetModalIsOpen = !presetModalIsOpen;
                                        }}
                                    >
                                        <span class="material-icons mr-2">add</span>
                                        <span>Save current</span>
                                    </li>
                                    {#each $presetStore.presets as preset (preset.name)}
                                        <li class="flex items-center">
                                            <span
                                                class="material-icons mr-2 text-red-400 cursor-pointer"
                                                on:click={() => deletePreset(preset.name)}>delete</span
                                            >
                                            <a
                                                href="#"
                                                class="block py-2 hover:bg-gray-100 "
                                                on:click={() => applyPreset(preset.name)}
                                                >{preset.name}: {preset.numMeasures} reps, {preset.secsPerMeasure} secs,
                                                {preset.beatsPerMeasure} beats</a
                                            >
                                        </li>
                                    {/each}
                                </ul>
                            </div>
                        </div>
                    </DropdownButton>
                {/if}
            </div>
        {:else}
            <div class="grid grid-cols-3 gap-1">
                <button
                    on:click={(ev) => toggle_play(ev, true)}
                    class="col-span-2 w-full bg-orange-300 text-white rounded-md py-3">Pause</button
                >
                <button on:click={toggle_play} class="w-full bg-orange-700 text-white rounded-md py-3">Stop</button>
            </div>
        {/if}
    </div>
</div>

<div class="flex-grow flex justify-center items-center" style="max-height: 300px;">
    <div
        bind:clientWidth={outerCircleWidth}
        class="h-36 w-36 rounded-full bg-slate-300 p-28 flex justify-center items-center relative"
    >
        <div
            bind:clientWidth={innerCircleWidth}
            class="absolute bg-blue-600 rounded-full"
            style="top: {innerCircleY}px; left: {innerCircleX}px; width: 2rem; height: 2rem;"
        />
        {#each innerAuxiliaryCircles as attrs, i (i)}
            <div
                class="absolute bg-blue-500/25 rounded-full border-2 border-blue-500"
                style="top: {attrs.top}px; left: {attrs.left}px; width: 2rem; height: 2rem;"
            />
        {/each}
        <!-- {#each { length: 0 } as _, i}
            <div
                bind:this={innerAuxiliaryCircles[i]}
                class="absolute bg-blue-500/25 rounded-full border-2 border-blue-500"
                style="width: 2rem; height: 2rem;"
            />
        {/each} -->
        <span class="text-slate-600" style="font-size: 7rem">{measureCount}</span>
    </div>
</div>

<div class={"mb-10 mx-3 bg-blue-200 flex border-2 border-green-400 rounded-lg relative gap-1"}>
    {#each { length: numMeasures } as _, i}
        <span class="w-3 h-10 bg-sky-500/50 flex-grow rounded-lg" />
    {/each}
    <div class="absolute h-full bg-green-400 rounded-lg" style="width: {$pctCountInterpolated}%" />
</div>

<ExtraSounds {isMobile} />

<Modal bind:isOpen={presetModalIsOpen}>
    <p slot="title" class="text-2xl text-gray-700">Save new preset</p>
    <div slot="body">
        <FloatingInput bind:value={newPresetName} label="Preset name" />
        {#if newPresetErrorMsg !== null}
            <p class="text-white bg-red-500/75 p-3 rounded-md text-center">{newPresetErrorMsg}</p>
        {/if}
    </div>

    <div slot="footer">
        <button class="bg-indigo-500 p-3 text-white rounded-sm mr-4" on:click={saveNewPreset}>Save</button>
        <button
            on:click={() => {
                presetModalIsOpen = false;
                dropdownIsOpen = true;
            }}
            class="text-red-500">Cancel</button
        >
    </div>
</Modal>

<style>
    .inner-popup {
        border: 1px solid #80808000;
        background-color: white;
    }
</style>
