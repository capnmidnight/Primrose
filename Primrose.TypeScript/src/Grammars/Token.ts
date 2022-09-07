export type TokenType =
    | "regular"
    | "stringDelim"
    | "newlines"
    | "strings"
    | "startBlockComments"
    | "endBlockComments"
    | "startLineComments"
    | "comments"
    | "lineNumbers"
    | "whitespace"
    | "numbers"
    | "keywords"
    | "operators"
    | "members"
    | "regexes"
    | "functions";

// A chunk of text that represents a single element of code,
// with fields linking it back to its source.
export class Token {
    constructor(
        public value: string,
        public type: TokenType,
        public readonly startStringIndex: number) {
        Object.seal(this);
    }

    get length() {
        return this.value.length;
    }

    get endStringIndex() {
        return this.startStringIndex + this.length;
    }

    clone() {
        return new Token(this.value, this.type, this.startStringIndex);
    }

    splitAt(i: number): Token {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.startStringIndex + i);
    }

    toString() {
        return `[${this.type}: ${this.value}]`;
    }
};
