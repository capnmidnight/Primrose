import { Primrose } from "./package/primrose.min.js";

(async function() {
    await Primrose.ready
    const response = await fetch("test.js"),
        code = await response.text();

    for (let editor of Primrose.editors) {
        editor.scaleFactor = devicePixelRatio;
        editor.value = code;
    }
})();

window.addEventListener("wheel", (evt) => {
    if (evt.ctrlKey
        && !evt.altKey
        && !evt.shiftKey
        && !evt.metaKey) {
        for (let editor of Primrose.editors) {
            if (editor.isInDocument
                && editor.focused) {
                evt.preventDefault();
                const dir = -Math.sign(evt.deltaY);
                editor.scaleFactor += dir / 4;
            }
        }
    }
}, { passive: false });