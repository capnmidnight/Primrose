import type { Cursor } from "./Cursor";
import type { Token } from "./Grammars";

export class Row {
    static emptyRow(startStringIndex: number, startTokenIndex: number, lineNumber: number) {
        return new Row("", [], startStringIndex, startTokenIndex, lineNumber);
    }


    private readonly leftCorrections: number[];
    private readonly rightCorrections: number[];

    constructor(
        public text: string,
        public tokens: Token[],
        public startStringIndex: number,
        public startTokenIndex: number,
        public lineNumber: number) {

        const graphemes = Object.freeze([...text]);
        this.leftCorrections = new Array<number>(text.length);
        this.rightCorrections = new Array<number>(text.length);

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

    substring(x: number, y?: number) {
        return this.text.substring(x, y);
    }

    adjust(cursor: Cursor, dir: number) {
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