export const singleLineOutput = Object.freeze([
    "CursorLeft",
    "CursorRight",
    "CursorSkipLeft",
    "CursorSkipRight",
    "CursorHome",
    "CursorEnd",
    "CursorFullHome",
    "CursorFullEnd",

    "SelectLeft",
    "SelectRight",
    "SelectSkipLeft",
    "SelectSkipRight",
    "SelectHome",
    "SelectEnd",
    "SelectFullHome",
    "SelectFullEnd",

    "SelectAll"
]);

export const multiLineOutput = Object.freeze(singleLineOutput
    .concat([
        "CursorDown",
        "CursorUp",
        "CursorPageDown",
        "CursorPageUp",

        "SelectDown",
        "SelectUp",
        "SelectPageDown",
        "SelectPageUp",

        "ScrollDown",
        "ScrollUp"
    ]));

const input = [
    "Backspace",
    "Delete",
    "DeleteWordLeft",
    "DeleteWordRight",
    "DeleteLine",

    "Undo",
    "Redo",
];

export const singleLineInput = Object.freeze(singleLineOutput
    .concat(input));

export const multiLineInput = Object.freeze(multiLineOutput
    .concat(input)
    .concat([
        "AppendNewline",
        "PrependNewline"
    ]));