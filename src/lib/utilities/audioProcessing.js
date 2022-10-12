////////////////////////////////////////////////////////////////////////////////////////////////////
function blobToBase64Url(blob) {
    var reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(blob);
    });
}

function blobToAudioBuffer(blob) {
    const audioContext = new AudioContext();
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
        fileReader.onloadend = () => {
            const arrayBuffer = fileReader.result;
            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                resolve(audioBuffer);
            });
        };
        fileReader.readAsArrayBuffer(blob);
    });
}

export async function processBlobUrl(blobUrl) {
    // para de URL a blob
    const response = await fetch(blobUrl);
    let blob = await response.blob();

    // Preprocesar audio para quitar silencio inicial
    let audioBuffer = await blobToAudioBuffer(blob);

    audioBuffer = cutIntroSilence(audioBuffer);

    blob = audioBufferToBlob(audioBuffer);

    // Pasar el blob a un string en b64 para meterlo en un Audio
    const base64Url = await blobToBase64Url(blob);
    return base64Url;
}

function cutIntroSilence(audioBuffer) {
    const oldArr = audioBuffer.getChannelData(0);
    let cutoutIndex = null;
    for (let i = 1; i < oldArr.length; i++) {
        let prev = oldArr[i - 1];
        let curr = oldArr[i];
        if (curr > 0.07 && curr >= prev / 2) {
            cutoutIndex = Math.max(0, i - audioBuffer.sampleRate / 100); // 100ms antes o el comienzo del audio
            break;
        }
    }
    let newArr;
    if (cutoutIndex !== null) {
        newArr = oldArr.slice(cutoutIndex, oldArr.length);
    } else {
        newArr = oldArr;
    }

    const audioContext = new AudioContext();
    const durationSecs = newArr.length / audioBuffer.sampleRate;
    const buffer = audioContext.createBuffer(1, newArr.length, audioBuffer.sampleRate);
    buffer.copyToChannel(newArr, 0);
    return buffer;
}

function audioBufferToBlob(audioBuffer) {
    // get WAV file bytes and audio params of your audio source
    const wavBytes = getWavBytes(audioBuffer.getChannelData(0).buffer, {
        isFloat: true, // floating point or 16-bit integer
        numChannels: 1,
        sampleRate: audioBuffer.sampleRate,
    });
    return new Blob([wavBytes], { type: "audio/wav" });
}

// Returns Uint8Array of WAV bytes
function getWavBytes(buffer, options) {
    const type = options.isFloat ? Float32Array : Uint16Array;
    const numFrames = buffer.byteLength / type.BYTES_PER_ELEMENT;

    const headerBytes = getWavHeader(Object.assign({}, options, { numFrames }));
    const wavBytes = new Uint8Array(headerBytes.length + buffer.byteLength);

    // prepend header, then add pcmBytes
    wavBytes.set(headerBytes, 0);
    wavBytes.set(new Uint8Array(buffer), headerBytes.length);

    return wavBytes;
}

// adapted from https://gist.github.com/also/900023
// returns Uint8Array of WAV header bytes
function getWavHeader(options) {
    const numFrames = options.numFrames;
    const numChannels = options.numChannels || 2;
    const sampleRate = options.sampleRate || 44100;
    const bytesPerSample = options.isFloat ? 4 : 2;
    const format = options.isFloat ? 3 : 1;

    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numFrames * blockAlign;

    const buffer = new ArrayBuffer(44);
    const dv = new DataView(buffer);

    let p = 0;

    function writeString(s) {
        for (let i = 0; i < s.length; i++) {
            dv.setUint8(p + i, s.charCodeAt(i));
        }
        p += s.length;
    }

    function writeUint32(d) {
        dv.setUint32(p, d, true);
        p += 4;
    }

    function writeUint16(d) {
        dv.setUint16(p, d, true);
        p += 2;
    }

    writeString("RIFF"); // ChunkID
    writeUint32(dataSize + 36); // ChunkSize
    writeString("WAVE"); // Format
    writeString("fmt "); // Subchunk1ID
    writeUint32(16); // Subchunk1Size
    writeUint16(format); // AudioFormat https://i.stack.imgur.com/BuSmb.png
    writeUint16(numChannels); // NumChannels
    writeUint32(sampleRate); // SampleRate
    writeUint32(byteRate); // ByteRate
    writeUint16(blockAlign); // BlockAlign
    writeUint16(bytesPerSample * 8); // BitsPerSample
    writeString("data"); // Subchunk2ID
    writeUint32(dataSize); // Subchunk2Size

    return new Uint8Array(buffer);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
