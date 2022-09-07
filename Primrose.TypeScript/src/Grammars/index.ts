import { Basic } from "./Basic";
import { HTML } from "./HTML";
import { JavaScript } from "./JavaScript";
import { PlainText } from "./PlainText";
export * from "./Grammar";
export * from "./Token";
export * from "./Rule";

export {
    Basic,
    HTML,
    JavaScript,
    PlainText
};


export const grammars = Object.freeze(new Map([
    ["basic", Basic],
    ["bas", Basic],
    ["html", HTML],
    ["javascript", JavaScript],
    ["js", JavaScript],
    ["plaintext", PlainText],
    ["txt", PlainText]
]));