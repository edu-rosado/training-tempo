export default function (node) {
    let canRecord = false;
    let isRecording = false;
    let audioURL;
    let mediaRecorder;
    /**
     * @type {BlobPart[] | undefined}
     */
    let chunks = [];

    function startRecording() {
        console.log("starting recording");

        //////////////////////////
        if (navigator.mediaDevices.getUserMedia) {
            canRecord = true;
            const constraints = { audio: true };

            const onSuccess = function (/** @type {MediaStream} */ stream) {
                //////////////////////////////////////////////
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.onstop = function (e) {
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                    chunks = [];
                    audioURL = window.URL.createObjectURL(blob);
                    node.dispatchEvent(new CustomEvent("recordingStopped", { detail: audioURL }));
                };
                mediaRecorder.ondataavailable = function (e) {
                    chunks.push(e.data);
                };
                mediaRecorder.start();
                //////////////////////////////////////////////
            };
            const onError = function (err) {
                console.log("The following error occured: " + err);
            };
            navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
        } else {
            {
                alert("El navegador no admite grabación de audio");
                return false;
            }
        }
        //////////////////////////

        node.dispatchEvent(new CustomEvent("recordingStarted"));
        return true;
    }

    node.onclick = function () {
        if (canRecord && isRecording) {
            mediaRecorder.stop();
        } else {
            const success = startRecording();
            if (!success) {
                return;
            }
        }
        isRecording = !isRecording;
    };
}
