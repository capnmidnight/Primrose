export class Row {
    constructor(txt, tokens, startStringIndex, startTokenIndex, lineNumber) {
        this.text = txt;
        this.startStringIndex = startStringIndex;

        this.tokens = tokens;
        this.startTokenIndex = startTokenIndex;

        this.lineNumber = lineNumber;

        const graphemes = Object.freeze([...txt]),
            leftCorrections = new Array(txt.length),
            rightCorrections = new Array(txt.length);

        let x = 0;
        for (let grapheme of graphemes) {
            leftCorrections[x] = 0;
            rightCorrections[x] = 0;
            for (let i = 1; i < grapheme.length; ++i) {
                leftCorrections[x + i] = -i;
                rightCorrections[x + i] = grapheme.length - i;
            }
            x += grapheme.length;
        }

        this.adjust = (cursor, dir) => {
            const correction = dir === -1
                ? leftCorrections
                : rightCorrections;

            if (cursor.x < correction.length) {
                const delta = correction[cursor.x];
                cursor.x += delta;
                cursor.i += delta;
            }
            else if (dir === 1
                && txt[txt.length - 1] === '\n') {
                this.adjust(cursor, -1);
            }
        };

        this.toString = () => txt;

        this.substring = (x, y) => txt.substring(x, y);

        Object.seal(this);
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

Row.emptyRow = (startStringIndex, startTokenIndex, lineNumber) => new Row("", [], startStringIndex, startTokenIndex, lineNumber);