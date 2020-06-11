import { Primrose } from "./package/src/primrose.js";
import { grammars } from "./package/src/grammars.js";
import { themes } from "./package/src/themes.js";
import { version } from "./package/src/version.js";

//import { Primrose, grammars, themes } from "./package/primrose.min.js";

(async function() {
    await Primrose.ready

    const versionNumbers = document.querySelectorAll(".version-number");
    for (let i = 0; i < versionNumbers.length; ++i) {
        const vn = versionNumbers[i];
        while (vn.lastChild) {
            vn.lastChild.remove();
        }
        vn.appendChild(document.createTextNode("v" + version));
    }

    const demosSel = document.querySelector("#demos"),
        themesSel = document.querySelector("#themes"),
        loadDemo = async () => {

        const file = "test." + demosSel.value,
            lang = grammars.get(demosSel.value),
            theme = themes.get(themesSel.value),
            response = await fetch(file),
            code = await response.text();

        for (let editor of Primrose.editors) {
            editor.scaleFactor = devicePixelRatio;
            editor.value = code;
            editor.language = lang;
            editor.theme = theme;
        }
    };

    demosSel.addEventListener("input", loadDemo);
    themesSel.addEventListener("input", loadDemo);
    loadDemo();
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