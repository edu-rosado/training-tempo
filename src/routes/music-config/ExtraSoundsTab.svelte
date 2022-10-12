<script>
    import { onMount } from "svelte";
    import recordAudioAction from "$lib/actions/recordAudio";
    import { processBlobUrl } from "$lib/utilities/audioProcessing";

    let isRecording = false;

    let fileInput;

    onMount(() => {});
</script>

<div class="p-2 relative h-full bg-gray-100 overflow-y-auto pb-16">
    <div class="grid grid-cols-6 bg-sky-100/50 p-2 roundex-sm shadow-md font-light">
        <div class="col-span-2 flex items-center">
            <div>Clapping</div>
        </div>

        <div class="col-span-4 flex">
            <button
                class="material-icons my-auto mx-auto p-1 rounded-full bg-sky-200 text-sky-500 cursor-pointer"
                style="font-size: 2rem; width: fit-content; height: fit-content;"
                on:click={() => {
                    const audio = new Audio("/house-kick-bassy-punchy-4.wav");
                    audio.play();
                }}>play_arrow</button
            >

            <!-- ///////////////////////// -->
            <button
                class={isRecording
                    ? "bg-red-300 border border-red-500 text-red-600 mx-1 p-2 rounded-lg text-center flex justify-center items-center"
                    : "bg-sky-300 border border-sky-500 text-sky-600 mx-1 p-2 rounded-lg text-center flex justify-center items-center"}
                use:recordAudioAction
                on:recordingStarted={() => (isRecording = true)}
                on:recordingStopped={(ev) => {
                    isRecording = false;
                    processBlobUrl(ev.detail);
                }}
            >
                <span class="material-icons" style="font-size: 2rem;">{isRecording ? "stop" : "mic"}</span>
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
                    on:change={(ev) => {
                        // const urlObj = URL.createObjectURL(ev.target.files[0]);
                        // processBlobUrl(urlObj);
                        // selectedItem.sound_type = "local_file";
                        // selectedItem.title = "Local file";
                    }}
                />
            </button>
            <button
                class="h-fit my-auto text-red-500 mx-1 ml-2 rounded-full text-center flex justify-center items-center"
                on:click={() => {
                    // selectedItem.sound_type = "undefined";
                    // selectedItem.src = undefined;
                    // selectedItem.title = "Not set";
                    // soundItems = soundItems;
                }}
            >
                <span class="material-icons" style="font-size: 1.5rem;">cancel</span>
            </button>
            <!-- ///////////////////////// -->
        </div>

        <button on:click={() => {}}
            ><span
                class="material-icons fixed bottom-5 right-5 text-indigo-500/75 bg-indigo-200/75 p-2 rounded-full"
                style="font-size: 3rem;">add</span
            ></button
        >
    </div>
</div>
