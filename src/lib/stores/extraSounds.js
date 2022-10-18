import { createWritableStore } from "./utils";

// The defaults ones have url directly while the others will have a urlKey, which is a localStorage key where the actual url is stored

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
