// A chunk of text that represents a single element of code,
// with fields linking it back to its source.
export class Token {
    constructor(value, type, startStringIndex) {
        this.value = value;
        this.type = type;
        this.startStringIndex = startStringIndex;
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
    splitAt(i) {
        const next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.startStringIndex + i);
    }
    toString() {
        return `[${this.type}: ${this.value}]`;
    }
}
//# sourceMappingURL=Token.js.map