import { writable } from "svelte/store";

export const soundStore = writable({
    selected: "default-1",
    soundSets: [
        {
            name: "Custom 1",
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
    if (typeof tempVal === "object" && tempVal !== null) {
        soundStore.set(tempVal);
    }
    soundStore.subscribe((newVal) => {
        localStorage.sounds = JSON.stringify(newVal);
    });
}

export function addNewSoundSet() {
    soundStore.update((prev) => {
        let count = prev.soundSets.length;
        let new_name = `Custom ${count}`;
        while (prev.soundSets.filter((item) => item.name === new_name).length > 0) {
            new_name = `Custom ${++count}`;
        }
        return {
            ...prev,
            soundSets: [
                ...prev.soundSets,
                {
                    name: new_name,
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
        };
    });
}
