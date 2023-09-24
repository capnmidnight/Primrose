export class Row {
    static emptyRow(startStringIndex, startTokenIndex, lineNumber) {
        return new Row("", [], startStringIndex, startTokenIndex, lineNumber);
    }
    constructor(text, tokens, startStringIndex, startTokenIndex, lineNumber) {
        this.text = text;
        this.tokens = tokens;
        this.startStringIndex = startStringIndex;
        this.startTokenIndex = startTokenIndex;
        this.lineNumber = lineNumber;
        const graphemes = Object.freeze([...text]);
        this.leftCorrections = new Array(text.length);
        this.rightCorrections = new Array(text.length);
        let x = 0;
        for (const grapheme of graphemes) {
            this.leftCorrections[x] = 0;
            this.rightCorrections[x] = 0;
            for (let i = 1; i < grapheme.length; ++i) {
                this.leftCorrections[x + i] = -i;
                this.rightCorrections[x + i] = grapheme.length - i;
            }
            x += grapheme.length;
        }
        Object.seal(this);
    }
    toString() {
        return this.text;
    }
    substring(x, y) {
        return this.text.substring(x, y);
    }
    adjust(cursor, dir) {
        const correction = dir === -1
            ? this.leftCorrections
            : this.rightCorrections;
        if (cursor.x < correction.length) {
            const delta = correction[cursor.x];
            cursor.x += delta;
            cursor.i += delta;
        }
        else if (dir === 1
            && this.text[this.text.length - 1] === "\n") {
            this.adjust(cursor, -1);
        }
    }
    get stringLength() {
        return this.text.length;
    }
    get endStringIndex() {
        return this.startStringIndex + this.stringLength;
    }
    get numTokens() {
        return this.tokens.length;
    }
    get endTokenIndex() {
        return this.startTokenIndex + this.numTokens;
    }
}
//# sourceMappingURL=Row.js.map