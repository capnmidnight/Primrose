// A chunk of text that represents a single element of code,
// with fields linking it back to its source.
export class Token {
    constructor(value, type, line, index) {
        this.value = value;
        this.type = type;
        this.index = index;
        this.line = line;
        Object.seal(this);
    }

    clone() {
        return new Token(this.value, this.type, this.line, this.index);
    }

    splitAt(i) {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.line, this.index);
    }

    toString() {
        return "[" + this.type + ": " + this.value + "]";
    }
};
