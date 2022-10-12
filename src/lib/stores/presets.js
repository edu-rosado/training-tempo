import { writable } from "svelte/store";

export const presetStore = writable({
    currentConfig: {
        numMeasures: 20,
        secsPerMeasure: 2,
        beatsPerMeasure: 2,
    },
    presets: [
        {
            name: "Preset1",
            numMeasures: 20,
            secsPerMeasure: 2,
            beatsPerMeasure: 2,
        },
    ],
});

let STORE_IS_SETUP = false;
export function setupPresetStore() {
    if (!STORE_IS_SETUP) {
        // STORE_IS_SETUP = true; // singleton desabilitado
        setupPresetStore_aux();
    }
}
function setupPresetStore_aux() {
    let tempVal;
    let initVal = { presets: [] };
    try {
        tempVal = JSON.parse(localStorage.presets);
    } catch {}
    if (tempVal !== null && Array.isArray(tempVal?.presets)) {
        const allNames = [];
        tempVal.presets.forEach((val) => {
            if (
                typeof val === "object" &&
                typeof val.name === "string" &&
                val.name.length > 0 &&
                !allNames.includes(val.names) &&
                typeof val.numMeasures === "number" &&
                typeof val.secsPerMeasure === "number" &&
                typeof val.beatsPerMeasure === "number"
            ) {
                initVal.presets.push({
                    name: val.name,
                    numMeasures: parseInt(val.numMeasures),
                    secsPerMeasure: parseInt(val.secsPerMeasure),
                    beatsPerMeasure: parseInt(val.beatsPerMeasure),
                });
            }
        });
        if (tempVal.currentConfig != null) {
            initVal.currentConfig = tempVal.currentConfig;
        }
        presetStore.set(initVal);
    }
    presetStore.subscribe((newVal) => {
        localStorage.presets = JSON.stringify(newVal);
    });
}
