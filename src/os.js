import {
    keyTypes,
    normalizeKeyValue
} from "./keys.js";

const gesture = Object.seal({
    type: "",
    text: "",
    command: ""
});

// Translates operating system-specific Browser KeyboardEvents into a
// cross-platform Gesture that can then be dispatched to a CommandPack
// for translation to an EditorCommand.
class OperatingSystem {
    constructor(osName, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
        this.name = osName;

        const pre4 = pre3;
        pre3 = pre3.length > 0 ? pre3 : "Normal";

        const definitions = Object.freeze(new Map([
            ["CursorDown", "Normal_ArrowDown"],
            ["CursorLeft", "Normal_ArrowLeft"],
            ["CursorRight", "Normal_ArrowRight"],
            ["CursorUp", "Normal_ArrowUp"],
            ["CursorPageDown", "Normal_PageDown"],
            ["CursorPageUp", "Normal_PageUp"],
            ["CursorSkipLeft", `${pre2}_ArrowLeft`],
            ["CursorSkipRight", `${pre2}_ArrowRight`],
            ["CursorHome", `${pre3}_${home}`],
            ["CursorEnd", `${pre3}_${end}`],
            ["CursorFullHome", `${pre5}_${fullHome}`],
            ["CursorFullEnd", `${pre5}_${fullEnd}`],


            ["SelectDown", "Shift_ArrowDown"],
            ["SelectLeft", "Shift_ArrowLeft"],
            ["SelectRight", "Shift_ArrowRight"],
            ["SelectUp", "Shift_ArrowUp"],
            ["SelectPageDown", "Shift_PageDown"],
            ["SelectPageUp", "Shift_PageUp"],
            ["SelectSkipLeft", `${pre2}Shift_ArrowLeft`],
            ["SelectSkipRight", `${pre2}Shift_ArrowRight`],
            ["SelectHome", `${pre4}Shift_${home}`],
            ["SelectEnd", `${pre4}Shift_${end}`],
            ["SelectFullHome", `${pre5}Shift_${fullHome}`],
            ["SelectFullEnd", `${pre5}Shift_${fullEnd}`],

            ["SelectAll", `${pre1}_a`],

            ["ScrollDown", `${pre1}_ArrowDown`],
            ["ScrollUp", `${pre1}_ArrowUp`],

            ["DeleteLetterLeft", "Normal_Backspace"],
            ["DeleteLetterRight", "Normal_Delete"],
            ["DeleteWordLeft", `${pre2}_Backspace`],
            ["DeleteWordRight", `${pre2}_Delete`],
            ["DeleteLine", `Shift_Delete`],

            ["AppendNewline", "Normal_Enter"],
            ["PrependNewline", `${pre2}_Enter`],

            ["InsertTab", "Normal_Tab"],
            ["RemoveTab", "Shift_Tab"],

            ["Undo", `${pre1}_z`],
            ["Redo", redo]
        ]));

        const substitutions = new Map();
        for (let pair of definitions) {
            substitutions.set(pair[1], pair[0]);
        }

        this.makeCommand = (evt) => {
            gesture.text = normalizeKeyValue(evt);

            gesture.type = keyTypes.has(gesture.text)
                ? keyTypes.get(gesture.text)
                : "printable";

            gesture.command = "";

            if (evt.ctrlKey
                || evt.altKey
                || evt.metaKey) {
                if (gesture.type === "printable"
                    || gesture.type === "whitespace") {
                    gesture.type = "special";
                }

                if (evt.ctrlKey) {
                    gesture.command += "Control";
                }

                if (evt.altKey) {
                    gesture.command += "Alt";
                }

                if (evt.metaKey) {
                    gesture.command += "Meta";
                }
            }

            if (evt.shiftKey) {
                gesture.command += "Shift";
            }

            if (gesture.command === "") {
                gesture.command += "Normal";
            }

            gesture.command += "_" + gesture.text;

            if (substitutions.has(gesture.command)) {
                gesture.command = substitutions.get(gesture.command);
            }

            return gesture;
        }

        Object.freeze(this);
    }
};

export const Windows = new OperatingSystem(
    "Windows",
    "Control", "Control",
    "Control_y",
    "", "Home", "End",
    "Control", "Home", "End");

export const MacOS = new OperatingSystem(
    "macOS",
    "Meta", "Alt",
    "MetaShift_z",
    "Meta", "ArrowLeft", "ArrowRight",
    "Meta", "ArrowUp", "ArrowDown");