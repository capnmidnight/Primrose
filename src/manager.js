import { Primrose } from "./primrose.js";

const controls = [];
let focusedControl = null,
    hoveredControl = null;

export const Manager = {
    add: (v) => {
        controls.push(v);

        v.addEventListener("blur", () => {
            focusedControl = null;
        });

        v.addEventListener("focus", () => {
            // make sure the previous control knows it has 
            // gotten unselected.
            if (focusedControl !== null
                && (!focusedControl.isInDocument
                    || !v.isInDocument)) {
                focusedControl.blur();
            }
            focusedControl = v;
        });

        v.addEventListener("over", () => {
            hoveredControl = v;
        });

        v.addEventListener("out", () => {
            hoveredControl = null;
        });
    }
};

Object.defineProperties(Manager, {
    focusedControl: {
        get: () => focusedControl
    },

    hoveredControl: {
        get: () => hoveredControl
    }
});

requestAnimationFrame(function update() {
    requestAnimationFrame(update);
    for (let control of controls) {
        if (control.isInDocument) {
            control.resize();
        }
    }
});

const withCurrentControl = (name) => {
    const evtName = name.toLocaleLowerCase(),
        funcName = `read${name}Event`;

    window.addEventListener(evtName, (evt) => {
        if (focusedControl !== null) {
            focusedControl[funcName](evt);
        }
    }, { passive: false });
};

withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("KeyUp");
withCurrentControl("BeforeCopy");
withCurrentControl("BeforeCut");
withCurrentControl("BeforePase");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");

window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (control !== null) {
        control.readWheelEvent(evt);
    }
}, { passive: false });


const documentReady = document.readyState === "complete"
    ? Promise.resolve("already")
    : new Promise(resolve => {
        document.addEventListener("readystatechange", (evt) => {
            if (document.readyState === "complete") {
                resolve("had to wait for it");
            }
        }, false);
    });

(async function () {
    await documentReady;
    const primroses = document.getElementsByTagName("primrose");
    for (let parentElement of primroses) {
        new Primrose({
            parentElement
        });
    }
    const canvases = document.querySelectorAll("canvas.primrose");
    for (let parentElement of canvases) {
        new Primrose({
            parentElement
        });
    }
})();