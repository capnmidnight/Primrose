export class Line {
    constructor(txt) {
        this.text = txt;
        this.graphemes = Object.freeze([...txt]);
        Object.freeze(this);
    }

    adjust(cursor, dir) {
        let trueX = 0,
            i = 0;
        for (; i < this.graphemes.length
            && trueX < cursor.x;
            ++i) {
            trueX += this.graphemes[i].length;
        }

        if (trueX !== cursor.x) {
            let delta = trueX - cursor.x;
            if (dir === -1
                && this.graphemes[i - 1].length > 1) {
                delta -= this.graphemes[i - 1].length;
            }

            cursor.i += delta;
            cursor.x += delta;
        }
    }

    get length() {
        return this.text.length;
    }

    toString() {
        return this.text;
    }

    substring(x, y) {
        return this.text.substring(x, y);
    }
}