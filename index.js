import { Primrose } from "./package/src/primrose.js";

Primrose.ready.then(() => {
    for (let editor of Primrose.editors) {
        editor.scaleFactor = devicePixelRatio;
    }
});

window.addEventListener("wheel", (evt) => {
    if (evt.ctrlKey
        && !evt.altKey
        && !evt.shiftKey
        && !evt.metaKey) {
        for (let editor of Primrose.editors) {
            if (editor.isInDocument) {
                const dir = -Math.sign(evt.deltaY);
                editor.scaleFactor += dir / 4;
            }
        }
    }
}, { passive: false });