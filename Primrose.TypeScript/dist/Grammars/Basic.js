import { Grammar } from "./Grammar";
// import { Token } from "./Token";
// A grammar and an interpreter for a BASIC-like language.
export class BasicGrammar extends Grammar {
    constructor() {
        super("BASIC", 
        // Grammar rules are applied in the order they are specified.
        [
            ["newlines", /(?:\r\n|\r|\n)/],
            // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
            ["lineNumbers", /^\d+\s+/],
            ["whitespace", /(?:\s+)/],
            // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
            ["startLineComments", /^REM\s/],
            // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
            ["stringDelim", /("|')/],
            // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
            ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
            // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
            ["keywords",
                /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
            ],
            // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
            ["keywords", /^DEF FN/],
            // These are all treated as mathematical operations.
            ["operators",
                /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
            ],
            // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
            ["members", /\w+\$?/]
        ]);
    }
    tokenize(code) {
        return super.tokenize(code.toUpperCase());
    }
}
export const Basic = new BasicGrammar();
//# sourceMappingURL=Basic.js.map