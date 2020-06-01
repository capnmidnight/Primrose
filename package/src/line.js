export class Line {
    constructor(txt, tokens) {
        this.text = txt;
        this.tokens = tokens;
        this.length = txt.length;

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
        };

        this.toString = () => txt;

        this.substring = (x, y) => txt.substring(x, y);

        Object.freeze(this);
    }
}