// Color themes for text-oriented controls, for use when coupled with a parsing grammar.

// A dark background with a light foreground for text.
export const Dark = Object.freeze({
    name: "Dark",
    cursorColor: "white",
    lineNumbers: {
        foreColor: "white"
    },
    regular: {
        backColor: "black",
        foreColor: "#c0c0c0",
        currentRowBackColor: "#202020",
        selectedBackColor: "#404040",
        unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    regexes: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    numbers: {
        foreColor: "green"
    },
    comments: {
        foreColor: "yellow",
        fontStyle: "italic"
    },
    keywords: {
        foreColor: "cyan"
    },
    functions: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    members: {
        foreColor: "green"
    },
    error: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
});


// A light background with dark foreground text.
export const Light = Object.freeze({
    name: "Light",
    cursorColor: "black",
    lineNumbers: {
        foreColor: "black"
    },
    regular: {
        backColor: "white",
        foreColor: "black",
        currentRowBackColor: "#f0f0f0",
        selectedBackColor: "#c0c0c0",
        unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    regexes: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    numbers: {
        foreColor: "green"
    },
    comments: {
        foreColor: "grey",
        fontStyle: "italic"
    },
    keywords: {
        foreColor: "blue"
    },
    functions: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    members: {
        foreColor: "green"
    },
    error: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
});

export const themes = Object.freeze(new Map([
    ["light", Light],
    ["dark", Dark]
]));