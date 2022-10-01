<script>
    import { onMount } from "svelte";
    import data from "$lib/audio.json";

    onMount(() => {
        // var data = audioBuffer.getChannelData(0)

        var arr = Float32Array.from(data);

        var audioContext = new AudioContext();
        var sampleRate = 48000;
        var durationSecs = data.length / sampleRate;
        var buffer = audioContext.createBuffer(durationSecs, sampleRate * durationSecs, sampleRate);
        buffer.copyToChannel(arr, 0);
    });
</script>
