const combiningMarks =
    /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
    surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

// unicode-aware string reverse
export function reverse(str) {
    str = str.replace(combiningMarks, function (match, capture1,
        capture2) {
        return reverse(capture2) + capture1;
    })
        .replace(surrogatePair, "$2$1");
    let res = "";
    for (let i = str.length - 1; i >= 0; --i) {
        res += str[i];
    }
    return res;
}

export class Cursor {

    static min(a, b) {
        if (a.i <= b.i) {
            return a;
        }
        return b;
    }

    static max(a, b) {
        if (a.i > b.i) {
            return a;
        }
        return b;
    }

    constructor(i, x, y) {
        this.i = i || 0;
        this.x = x || 0;
        this.y = y || 0;
        this.moved = true;
        Object.seal(this);
    }

    clone() {
        return new Cursor(this.i, this.x, this.y);
    }

    toString() {
        return "[i:" + this.i + " x:" + this.x + " y:" + this.y + "]";
    }

    copy(cursor) {
        this.i = cursor.i;
        this.x = cursor.x;
        this.y = cursor.y;
        this.moved = false;
    }

    fullHome() {
        this.i = 0;
        this.x = 0;
        this.y = 0;
        this.moved = true;
    }

    fullEnd(rows) {
        this.i = 0;
        let lastLength = 0;
        for (let y = 0; y < rows.length; ++y) {
            const row = rows[y];
            lastLength = row.stringLength;
            this.i += lastLength;
        }
        this.y = rows.length - 1;
        this.x = lastLength;
        this.moved = true;
    }

    left(rows, skipAdjust = false) {
        if (this.i > 0) {
            --this.i;
            --this.x;
            if (this.x < 0) {
                --this.y;
                const row = rows[this.y];
                this.x = row.stringLength - 1;
            }
            else if (!skipAdjust) {
                rows[this.y].adjust(this, -1);
            }
        }
        this.moved = true;
    }

    skipLeft(rows) {
        if (this.x <= 1) {
            this.left(rows);
        }
        else {
            const x = this.x - 1,
                row = rows[this.y],
                word = reverse(row.substring(0, x)),
                m = word.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : this.x;
            this.i -= dx;
            this.x -= dx;
            rows[this.y].adjust(this, -1);
        }
        this.moved = true;
    }

    right(rows, skipAdjust = false) {
        const row = rows[this.y];
        if (this.y < rows.length - 1
            || this.x < row.stringLength) {
            ++this.i;
            ++this.x;
            if (this.y < rows.length - 1
                && this.x === row.stringLength) {
                this.x = 0;
                ++this.y;
            }
            else if (!skipAdjust) {
                rows[this.y].adjust(this, 1);
            }
        }
    }

    skipRight(rows) {
        const row = rows[this.y];
        if (this.x < row.stringLength - 1) {
            const x = this.x + 1,
                subrow = row.substring(x),
                m = subrow.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : (row.stringLength - this.x);
            this.i += dx;
            this.x += dx;
            if (this.x > 0
                && this.x === row.stringLength
                && this.y < rows.length - 1) {
                --this.x;
                --this.i;
            }
            rows[this.y].adjust(this, 1);
        }
        else if(this.y < rows.length -1) {
            this.right(rows);
        }
        this.moved = true;
    }

    home() {
        this.i -= this.x;
        this.x = 0;
        this.moved = true;
    }

    end(rows) {
        const row = rows[this.y];
        let dx = row.stringLength - this.x;
        if (this.y < rows.length - 1) {
            --dx;
        }
        this.i += dx;
        this.x += dx;
        this.moved = true;
    }

    up(rows, skipAdjust = false) {
        if (this.y > 0) {
            --this.y;
            const row = rows[this.y],
                dx = Math.min(0, row.stringLength - this.x - 1);
            this.x += dx;
            this.i -= row.stringLength - dx;
            if (!skipAdjust) {
                rows[this.y].adjust(this, 1);
            }
        }
        this.moved = true;
    }

    down(rows, skipAdjust = false) {
        if (this.y < rows.length - 1) {
            const prevRow = rows[this.y];
            ++this.y;
            this.i += prevRow.stringLength;

            const row = rows[this.y];
            if (this.x >= row.stringLength) {
                let dx = this.x - row.stringLength;
                if (this.y < rows.length - 1) {
                    ++dx;
                }
                this.i -= dx;
                this.x -= dx;
            }
            if (!skipAdjust) {
                rows[this.y].adjust(this, 1);
            }
        }
        this.moved = true;
    }

    incX(rows, dx) {
        const dir = Math.sign(dx);
        dx = Math.abs(dx);
        if (dir === -1) {
            for (let i = 0; i < dx; ++i) {
                this.left(rows, true);
            }
            rows[this.y].adjust(this, -1);
        }
        else if (dir === 1) {
            for (let i = 0; i < dx; ++i) {
                this.right(rows, true);
            }
            rows[this.y].adjust(this, 1);
        }
    }

    incY(rows, dy) {
        const dir = Math.sign(dy);
        dy = Math.abs(dy);
        if (dir === -1) {
            for (let i = 0; i < dy; ++i) {
                this.up(rows, true);
            }
        }
        else if (dir === 1) {
            for (let i = 0; i < dy; ++i) {
                this.down(rows, true);
            }
        }
        rows[this.y].adjust(this, 1);
    }

    setXY(rows, x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        this.y = Math.max(0, Math.min(rows.length - 1, y));
        const row = rows[this.y];
        this.x = Math.max(0, Math.min(row.stringLength, x));
        this.i = this.x;
        for (let i = 0; i < this.y; ++i) {
            this.i += rows[i].stringLength;
        }
        if (this.x > 0
            && this.x === row.stringLength
            && this.y < rows.length - 1) {
            --this.x;
            --this.i;
        }
        rows[this.y].adjust(this, 1);
        this.moved = true;
    }

    setI(rows, i) {
        this.x = this.i = i;
        this.y = 0;
        let total = 0,
            row = rows[this.y];
        while (this.x > row.stringLength) {
            this.x -= row.stringLength;
            total += row.stringLength;
            if (this.y >= rows.length - 1) {
                this.i = total;
                this.x = row.stringLength;
                this.moved = true;
                break;
            }
            ++this.y;
            row = rows[this.y];
        }

        if (this.y < rows.length - 1
            && this.x === row.stringLength) {
            this.x = 0;
            ++this.y;
        }

        rows[this.y].adjust(this, 1);
        this.moved = true;
    }
}
