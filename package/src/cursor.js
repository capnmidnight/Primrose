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

    fullEnd(lines) {
        this.i = 0;
        let lastLength = 0;
        for (let y = 0; y < lines.length; ++y) {
            const line = lines[y];
            lastLength = line.length;
            this.i += lastLength;
        }
        this.y = lines.length - 1;
        this.x = lastLength;
        this.moved = true;
    }

    left(lines, skipAdjust = false) {
        if (this.i > 0) {
            --this.i;
            --this.x;
            if (this.x < 0) {
                --this.y;
                const line = lines[this.y];
                this.x = line.length - 1;
            }
            else if (!skipAdjust) {
                lines[this.y].adjust(this, -1);
            }
        }
        this.moved = true;
    }

    skipLeft(lines) {
        if (this.x <= 1) {
            this.left(lines);
        }
        else {
            const x = this.x - 1,
                line = lines[this.y],
                word = reverse(line.substring(0, x)),
                m = word.match(/(\s|\W)+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : word.length;
            this.i -= dx;
            this.x -= dx;
            lines[this.y].adjust(this, -1);
        }
        this.moved = true;
    }

    right(lines, skipAdjust = false) {
        const line = lines[this.y];
        if (this.y < lines.length - 1
            || this.x < line.length) {
            ++this.i;
            ++this.x;
            if (this.y < lines.length - 1
                && this.x === line.length) {
                this.x = 0;
                ++this.y;
            }
            else if (!skipAdjust) {
                lines[this.y].adjust(this, 1);
            }
        }
    }

    skipRight(lines) {
        const line = lines[this.y];
        if (this.x < line.length - 1) {
            const x = this.x + 1,
                subline = line.substring(x),
                m = subline.match(/(\s|\W)+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : (subline.length - this.x);
            this.i += dx;
            this.x += dx;
            if (this.x > 0
                && this.x === line.length
                && this.y < lines.length - 1) {
                --this.x;
                --this.i;
            }
            lines[this.y].adjust(this, 1);
        }
        else if(this.y < lines.length -1) {
            this.right(lines);
        }
        this.moved = true;
    }

    home() {
        this.i -= this.x;
        this.x = 0;
        this.moved = true;
    }

    end(lines) {
        const line = lines[this.y];
        let dx = line.length - this.x;
        if (this.y < lines.length - 1) {
            --dx;
        }
        this.i += dx;
        this.x += dx;
        this.moved = true;
    }

    up(lines, skipAdjust = false) {
        if (this.y > 0) {
            --this.y;
            const line = lines[this.y],
                dx = Math.min(0, line.length - this.x - 1);
            this.x += dx;
            this.i -= line.length - dx;
            if (!skipAdjust) {
                lines[this.y].adjust(this, 1);
            }
        }
        this.moved = true;
    }

    down(lines, skipAdjust = false) {
        if (this.y < lines.length - 1) {
            const pLine = lines[this.y];
            ++this.y;
            this.i += pLine.length;

            const line = lines[this.y];
            if (this.x >= line.length) {
                let dx = this.x - line.length;
                if (this.y < lines.length - 1) {
                    ++dx;
                }
                this.i -= dx;
                this.x -= dx;
            }
            if (!skipAdjust) {
                lines[this.y].adjust(this, 1);
            }
        }
        this.moved = true;
    }

    incX(lines, dx) {
        const dir = Math.sign(dx);
        dx = Math.abs(dx);
        if (dir === -1) {
            for (let i = 0; i < dx; ++i) {
                this.left(lines, true);
            }
            lines[this.y].adjust(this, -1);
        }
        else if (dir === 1) {
            for (let i = 0; i < dx; ++i) {
                this.right(lines, true);
            }
            lines[this.y].adjust(this, 1);
        }
    }

    incY(lines, dy) {
        const dir = Math.sign(dy);
        dy = Math.abs(dy);
        if (dir === -1) {
            for (let i = 0; i < dy; ++i) {
                this.up(lines, true);
            }
        }
        else if (dir === 1) {
            for (let i = 0; i < dy; ++i) {
                this.down(lines, true);
            }
        }
        lines[this.y].adjust(this, 1);
    }

    setXY(lines, x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        this.y = Math.max(0, Math.min(lines.length - 1, y));
        const line = lines[this.y];
        this.x = Math.max(0, Math.min(line.length, x));
        this.i = this.x;
        for (let i = 0; i < this.y; ++i) {
            this.i += lines[i].length;
        }
        if (this.x > 0
            && this.x === line.length
            && this.y < lines.length - 1) {
            --this.x;
            --this.i;
        }
        lines[this.y].adjust(this, 1);
        this.moved = true;
    }

    setI(lines, i) {
        this.x = this.i = i;
        this.y = 0;
        let total = 0,
            line = lines[this.y];
        while (this.x > line.length) {
            this.x -= line.length;
            total += line.length;
            if (this.y >= lines.length - 1) {
                this.i = total;
                this.x = line.length;
                this.moved = true;
                break;
            }
            ++this.y;
            line = lines[this.y];
        }
        lines[this.y].adjust(this, 1);
        this.moved = true;
    }
}
