import { createWritableStore } from "./utils";

const defaultVal = {
    soundList: [
        {
            id: 0,
            url: "extra-sounds/fail.wav",
            label: "Fail",
            isDefault: true,
        },
        {
            id: 1,
            url: "extra-sounds/aplauso.wav",
            label: "Clapping",
            isDefault: true,
        },
    ],
    nextId: 2,
};

export const extraSoundsStore = createWritableStore("extraSounds", defaultVal);
