import { writable } from "svelte/store";

export const soundStore = writable({
    selected: null,
    soundSets: [
        {
            name: "mi custom 1",
            soundItems: [
                {
                    id: "Default",
                    sound_type: "recorded",
                    title: "Built-in - Chimes",
                    src: "/house-kick-bassy-punchy-4.wav",
                },
            ],
        },
    ],
});

let STORE_IS_SETUP = false;
export function setupSoundStore() {
    if (!STORE_IS_SETUP) {
        STORE_IS_SETUP = true; // singleton
        setupSoundStore_aux();
    }
}
function setupSoundStore_aux() {
    let tempVal;
    try {
        tempVal = JSON.parse(localStorage.sounds);
    } catch {}
    if (typeof tempVal === "object") {
        // console.log(34, tempVal);
        soundStore.set(tempVal);
    }
    soundStore.subscribe((newVal) => {
        localStorage.sounds = JSON.stringify(newVal);
    });
}
