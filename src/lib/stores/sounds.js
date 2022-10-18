import { createWritableStore } from "./utils";

function setupDefaultSpanish(storeData, increment, title) {
    // Increment: solo ara valores < 30, cual es el incremento entre ellos
    let found = false;
    for (let i = 0; i < storeData.soundSets; i++) {
        if (storeData.soundSets[i].name === title) {
            found = true;
            break;
        }
    }

    if (!found) {
        // meter default spanish
        const spanishSet = {
            name: title,
            id: storeData.nextSoundSetId++,
            isDefault: true,
            soundItems: [
                {
                    id: "Default",
                    sound_type: "local_file",
                    title: "Built-in - Chimes",
                    src: "/strong_beat_3.wav",
                },
            ],
        };
        for (let i = 1; i <= 100; i++) {
            if ((i > 30 && i % 5 != 0) || (i % increment != 0 && i != 1)) {
                spanishSet.soundItems.push({
                    id: i.toString(),
                    sound_type: "undefined",
                    title: "Not set",
                });
            } else {
                spanishSet.soundItems.push({
                    id: i.toString(),
                    sound_type: "local_file",
                    title: "Local file - " + i,
                    src: "/spanish_counts/" + i + ".mp3",
                });
            }
        }
        storeData.soundSets.push(spanishSet);
    }
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
            nextSoundSetId: prev.nextSoundSetId + 1,
            soundSets: [
                ...prev.soundSets,
                {
                    id: prev.nextSoundSetId,
                    name: new_name,
                    isDefault: false,
                    soundItems: [
                        {
                            id: "Default",
                            sound_type: "recorded",
                            title: "Built-in - Chimes",
                            src: "/strong_beat_3.wav",
                        },
                    ],
                },
            ],
        };
    });
}

const defaultVal = {
    selected: "default-1",
    nextSoundSetId: 1,
    soundSets: [
        {
            name: "Built-in - Chimes",
            id: 0,
            isDefault: true,
            soundItems: [
                {
                    id: "Default",
                    sound_type: "local_file",
                    title: "Built-in - Chimes",
                    src: "/strong_beat_3.wav",
                },
            ],
        },
    ],
};

setupDefaultSpanish(defaultVal, 1, "Default spanish");
setupDefaultSpanish(defaultVal, 5, "Default spanish 5 by 5");

export const soundStore = createWritableStore("sounds", defaultVal);
