// Color themes for text-oriented controls, for use when coupled with a parsing grammar.

import { TokenType } from "./Grammars";

export interface FontStyle {
    readonly backColor: CssColorValue;
    readonly foreColor: CssColorValue;
    readonly fontStyle: string;
    readonly fontWeight: string;
}

export interface Theme extends Partial<Record<TokenType, Partial<FontStyle>>> {
    readonly name: string;
    readonly cursorColor?: CssColorValue;
    readonly unfocused?: CssColorValue;
    readonly currentRowBackColor?: CssColorValue;
    readonly selectedBackColor?: CssColorValue;
    readonly lineNumbers?: Partial<FontStyle>;
    readonly regular?: Partial<FontStyle>;
    readonly strings?: Partial<FontStyle>;
    readonly regexes?: Partial<FontStyle>;
    readonly numbers?: Partial<FontStyle>;
    readonly comments?: Partial<FontStyle>;
    readonly keywords?: Partial<FontStyle>;
    readonly functions?: Partial<FontStyle>;
    readonly members?: Partial<FontStyle>;
    readonly error?: Partial<FontStyle>;
}

// A dark background with a light foreground for text.
export const Dark: Theme = {
    name: "Dark",
    cursorColor: "white",
    unfocused: "rgba(0, 0, 255, 0.25)",
    currentRowBackColor: "#202020",
    selectedBackColor: "#404040",
    lineNumbers: {
        foreColor: "white"
    },
    regular: {
        backColor: "black",
        foreColor: "#c0c0c0"
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
};


// A light background with dark foreground text.
export const Light: Theme = {
    name: "Light",
    cursorColor: "black",
    unfocused: "rgba(0, 0, 255, 0.25)",
    currentRowBackColor: "#f0f0f0",
    selectedBackColor: "#c0c0c0",
    lineNumbers: {
        foreColor: "black"
    },
    regular: {
        backColor: "white",
        foreColor: "black"
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
};

export const themes = Object.freeze(new Map<string, Theme>([
    ["light", Light],
    ["dark", Dark]
]));