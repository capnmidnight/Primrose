export type TokenType = "regular" | "stringDelim" | "newlines" | "strings" | "startBlockComments" | "endBlockComments" | "startLineComments" | "comments" | "lineNumbers" | "whitespace" | "numbers" | "keywords" | "operators" | "members" | "regexes" | "functions";
export declare class Token {
    value: string;
    type: TokenType;
    readonly startStringIndex: number;
    constructor(value: string, type: TokenType, startStringIndex: number);
    get length(): number;
    get endStringIndex(): number;
    clone(): Token;
    splitAt(i: number): Token;
    toString(): string;
}
//# sourceMappingURL=Token.d.ts.map