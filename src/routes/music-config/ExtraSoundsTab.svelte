<script>
    import { onMount } from "svelte";
    import recordAudioAction from "$lib/actions/recordAudio";
    import { processBlobUrl } from "$lib/utilities/audioProcessing";
    import { extraSoundsStore } from "$lib/stores/extraSounds";

    let recordingId = null;

    let fileInput;

    onMount(() => {
        extraSoundsStore.useLocalStorage();
    });
</script>

<div class="p-2 relative h-full bg-gray-100 overflow-y-auto pb-16">
    {#each $extraSoundsStore.soundList as extraSound (extraSound.id)}
        <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
            <div class="col-span-2 flex items-center">
                <div>{extraSound.label}</div>
            </div>

            <div class="col-span-4 flex">
                <button
                    class="material-icons my-auto mx-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
                    style="font-size: 2rem; width: fit-content; height: fit-content;"
                    on:click={() => {
                        if (extraSound.url != null) {
                            const audio = new Audio(extraSound.url);
                            audio.play();
                        } else if (extraSound.urlKey != null) {
                            const url = localStorage.getItem(extraSound.urlKey);
                            if (url != null) {
                                const audio = new Audio(url);
                                audio.play();
                            }
                        }
                    }}>play_arrow</button
                >

                <!-- ///////////////////////// -->
                {#if !extraSound.isDefault}
                    <button
                        class={recordingId == extraSound.id
                            ? "bg-red-300 border border-red-500 text-red-600 mx-1 p-2 rounded-lg text-center flex justify-center items-center"
                            : "bg-sky-300 border border-sky-500 text-sky-600 mx-1 p-2 rounded-lg text-center flex justify-center items-center"}
                        use:recordAudioAction
                        on:recordingStarted={() => (recordingId = extraSound.id)}
                        on:recordingStopped={async (ev) => {
                            recordingId = null;
                            const url = await processBlobUrl(ev.detail, false);
                            localStorage.setItem(extraSound.urlKey, url);
                        }}
                    >
                        <span class="material-icons" style="font-size: 2rem;"
                            >{recordingId == extraSound.id ? "stop" : "mic"}</span
                        >
                    </button>
                    <button
                        class="bg-sky-300 border border-sky-500 text-sky-600 mx-1 p-2 rounded-lg text-center flex justify-center items-center"
                    >
                        <span
                            class="material-icons"
                            style="font-size: 2rem;"
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
                                const url = await processBlobUrl(urlObj);
                                localStorage.setItem(extraSound.urlKey, url);
                            }}
                        />
                    </button>
                    <button
                        class="h-fit my-auto text-red-500 mx-1 ml-2 rounded-full text-center flex justify-center items-center"
                        on:click={() => {
                            localStorage.removeItem(extraSound.urlKey);
                            $extraSoundsStore.soundList = $extraSoundsStore.soundList.filter(
                                (item) => item.id != extraSound.id
                            );
                        }}
                    >
                        <span class="material-icons" style="font-size: 1.5rem;">cancel</span>
                    </button>
                {/if}
                <!-- ///////////////////////// -->
            </div>
        </div>
    {/each}

    <button
        on:click={() => {
            let label = prompt("Name for the new sound");
            if (label.length == 0) {
                label = "new sound";
            }
            const newId = $extraSoundsStore.nextId++;
            $extraSoundsStore.soundList.push({
                id: newId,
                label,
                urlKey: "extraSounds-" + newId,
                isDefault: false,
            });
            $extraSoundsStore = $extraSoundsStore;
        }}
        ><span
            class="material-icons fixed bottom-5 right-5 text-indigo-500/75 bg-indigo-200/75 p-2 rounded-full"
            style="font-size: 3rem;">add</span
        ></button
    >
</div>
