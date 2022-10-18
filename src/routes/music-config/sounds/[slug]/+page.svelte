<script>
    import { page } from "$app/stores";
    import recordAudioAction from "$lib/actions/recordAudio";
    import { onMount } from "svelte";
    import { soundStore } from "$lib/stores/sounds";
    import DropdownButton from "$lib/components/DropdownButton.svelte";
    import { goto } from "$app/navigation";
    import { processBlobUrl } from "$lib/utilities/audioProcessing";

    const soundTypeToIconClass = {
        recorded: "mic",
        built_in: "music_note",
        local_file: "folder_open",
        undefined: "cancel",
    };

    const soundSetIndex = $page.params.slug;

    let soundSet = {};
    $: soundItems = soundSet.soundItems ?? [];
    $: updateStore(soundItems);

    onMount(() => {
        soundStore.useLocalStorage();
        if ($soundStore.soundSets.length > soundSetIndex) {
            soundSet = $soundStore.soundSets[soundSetIndex];
        } else {
            soundSet = {
                name: "error",
                soundItems: [],
            };
        }
    });

    /**
     * @type {HTMLAudioElement}
     */
    let audio; // = new Audio("/strong_beat_3.wav");

    let selectedSoundItemPosition = 0;
    $: selectedItem = soundItems.length > 0 ? soundItems[selectedSoundItemPosition] : {};
    $: if (selectedItem && typeof Audio !== "undefined") {
        audio = new Audio(selectedItem.src);
    }

    let fileInput;

    const soundItems_base_class = "flex justify-center items-center py-2 rounded-sm bg-indigo-100 text-gray-600";
    const soundItemsActiveClass =
        "flex justify-center items-center py-2 rounded-sm bg-sky-400 border-2 border-sky-200 text-white font-bold";

    let isRecording = false;

    function updateStore(_) {
        $soundStore = $soundStore;
    }

    function goToPrevItem() {
        if (selectedSoundItemPosition == 0) {
            return;
        }
        selectedSoundItemPosition--;
    }

    function goToNextItem() {
        if (selectedSoundItemPosition == soundItems.length - 1) {
            soundItems.push({
                id: selectedSoundItemPosition + 1,
                sound_type: "undefined",
                title: "Not set",
            });
            soundItems = soundItems;
        }
        selectedSoundItemPosition++;
    }
</script>

<div class="bg-gray-100 h-full">
    <div class="p-2 flex items-center">
        <input
            class="w-full rounded-lg px-2 py-1 border border-sky-200 shadow-sm"
            placeholder="Preset name"
            type="text"
            bind:value={soundSet.name}
        />
        <DropdownButton>
            <button slot="button" class="material-icons">more_vert</button>
            <button
                slot="menu"
                class="absolute right-0 top-0 p-2 shadow-md rounded-sm bg-slate-100 flex items-center"
                on:click={() => {
                    $soundStore.soundSets.splice(soundSetIndex, 1);
                    $soundStore.soundSets = $soundStore.soundSets;
                    goto("/music-config");
                }}
            >
                <div class="material-icons mr-2 text-red-400">delete</div>
                <div class="text-red-500">Delete</div>
            </button>
        </DropdownButton>
    </div>

    <div class="flex flex-col h-full">
        <div class="flex justify-between items-center bg-sky-500 p-2 rounded-sm">
            <div class="text-white">
                <div class="font-serif">Selected: <span class="font-bold">{selectedItem.id}</span></div>
                <div class="font-bold">{selectedItem.title}</div>
            </div>
            <span
                class="material-icons my-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
                style="font-size: 4rem; width: fit-content; height: fit-content;"
                on:click={() => {
                    audio.play();
                }}>play_arrow</span
            >
        </div>

        <div class="bg-sky-100 pt-2 p-2">
            <div class="font-serif mb-1 text-center text-sky-600 font-bold">Change sound</div>
            <div class="grid grid-cols-4">
                <button
                    class="bg-sky-300 border border-sky-500 text-sky-600 mx-2 p-2 rounded-lg h-16 text-center flex justify-center items-center"
                    on:click={() => {
                        selectedItem.sound_type = "built_in";
                        selectedItem.src = "/strong_beat_3.wav";
                        selectedItem.title = "Built-in - Chimes";
                        soundItems = soundItems;
                    }}
                >
                    <span class="material-icons" style="font-size: 2.5rem;">music_note</span>
                </button>
                <button
                    class={isRecording
                        ? "bg-red-300 border border-red-500 text-red-600 mx-2 p-2 rounded-lg h-16 text-center flex justify-center items-center"
                        : "bg-sky-300 border border-sky-500 text-sky-600 mx-2 p-2 rounded-lg h-16 text-center flex justify-center items-center"}
                    use:recordAudioAction
                    on:recordingStarted={() => (isRecording = true)}
                    on:recordingStopped={async (ev) => {
                        isRecording = false;
                        const base64Url = await processBlobUrl(ev.detail);
                        audio = new Audio(base64Url);
                        audio.play();

                        selectedItem.src = base64Url;
                        soundItems = soundItems;
                        goToNextItem();
                        selectedItem.sound_type = "recorded";
                        selectedItem.title = "Recorded";
                    }}
                >
                    <span class="material-icons" style="font-size: 2.5rem;">{isRecording ? "stop" : "mic"}</span>
                </button>
                <button
                    class="bg-sky-300 border border-sky-500 text-sky-600 mx-2 p-2 rounded-lg h-16 text-center flex justify-center items-center"
                >
                    <span
                        class="material-icons"
                        style="font-size: 2.5rem;"
                        on:click={() => {
                            fileInput.click();
                        }}>folder_open</span
                    >
                    <input
                        type="file"
                        class="hidden"
                        bind:this={fileInput}
                        on:change={async (ev) => {
                            const urlObj = URL.createObjectURL(ev.target.files[0]);
                            const base64Url = await processBlobUrl(urlObj);
                            audio = new Audio(base64Url);
                            audio.play();

                            selectedItem.src = base64Url;
                            soundItems = soundItems;
                            goToNextItem();
                            selectedItem.sound_type = "local_file";
                            selectedItem.title = "Local file";
                        }}
                    />
                </button>
                <button
                    class="bg-sky-300 border border-sky-500 text-sky-600 mx-2 p-2 rounded-lg h-16 text-center flex justify-center items-center"
                    on:click={() => {
                        selectedItem.sound_type = "undefined";
                        selectedItem.src = undefined;
                        selectedItem.title = "Not set";
                        soundItems = soundItems;
                    }}
                >
                    <span class="material-icons" style="font-size: 2.5rem;">cancel</span>
                </button>
            </div>
        </div>

        <div class="flex justify-between gap-2 px-1 py-2">
            <button
                class="flex-grow bg-indigo-100 rounded-sm flex items-center justify-center text-gray-600 border border-indigo-200 shadow-md"
                on:click={goToPrevItem}
            >
                <div class="material-icons" style="font-size: 2rem;">navigate_before</div>
            </button>
            <button
                class="flex-grow bg-indigo-100 rounded-sm flex items-center justify-center text-gray-600 border border-indigo-200 shadow-md"
                on:click={goToNextItem}
            >
                <div class="material-icons" style="font-size: 2rem;">navigate_next</div>
            </button>
        </div>

        <div class="flex-grow px-1 grid grid-cols-3 gap-1 content-start overflow-y-auto mb-20">
            {#each soundItems as item, index (index)}
                <button
                    class={selectedItem.id === item.id ? soundItemsActiveClass : soundItems_base_class}
                    on:click={() => (selectedSoundItemPosition = index)}
                >
                    <span>{item.id}</span>
                    <span class="material-icons ml-1">{soundTypeToIconClass[item.sound_type]}</span>
                </button>
            {/each}
        </div>
    </div>
</div>
