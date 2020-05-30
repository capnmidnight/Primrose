const combiningMarks =
    /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
    surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

// unicode-aware string reverse
function reverse(str) {
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

class Cursor {

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
                m = word.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : this.x;
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
                m = subline.match(/\w+/),
                dx = m
                    ? (m.index + m[0].length + 1)
                    : (line.length - this.x);
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

// A selection of fonts for preferred monospace rendering.
const monospaceFamily = "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace";

class Line {
    constructor(txt) {
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
                : rightCorrections,
                delta = correction[cursor.x];

            cursor.x += delta;
            cursor.i += delta;
        };

        this.toString = () => txt;

        this.substring = (x, y) => txt.substring(x, y);

        Object.freeze(this);
    }
}

// Color themes for text-oriented controls, for use when coupled with a parsing grammar.

// A dark background with a light foreground for text.
const Dark = Object.freeze({
    name: "Dark",
    cursorColor: "white",
    lineNumbers: {
        foreColor: "white"
    },
    regular: {
        backColor: "black",
        foreColor: "#c0c0c0",
        currentRowBackColor: "#202020",
        selectedBackColor: "#404040",
        unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    regexes: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    numbers: {
        foreColor: "green"
    },
    comments: {
        foreColor: "yellow",
        fontStyle: "italic"
    },
    keywords: {
        foreColor: "cyan"
    },
    functions: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    members: {
        foreColor: "green"
    },
    error: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
});


// A light background with dark foreground text.
const Light = Object.freeze({
    name: "Light",
    cursorColor: "black",
    lineNumbers: {
        foreColor: "black"
    },
    regular: {
        backColor: "white",
        foreColor: "black",
        currentRowBackColor: "#f0f0f0",
        selectedBackColor: "#c0c0c0",
        unfocused: "rgba(0, 0, 255, 0.25)"
    },
    strings: {
        foreColor: "#aa9900",
        fontStyle: "italic"
    },
    regexes: {
        foreColor: "#aa0099",
        fontStyle: "italic"
    },
    numbers: {
        foreColor: "green"
    },
    comments: {
        foreColor: "grey",
        fontStyle: "italic"
    },
    keywords: {
        foreColor: "blue"
    },
    functions: {
        foreColor: "brown",
        fontWeight: "bold"
    },
    members: {
        foreColor: "green"
    },
    error: {
        foreColor: "red",
        fontStyle: "underline italic"
    }
});

const themes = Object.freeze(new Map([
    ["light", Light],
    ["dark", Dark]
]));

class TimedEvent extends EventTarget {
    constructor(timeout, continuous = false) {
        super();

        const tickEvt = new Event("tick");

        let handle = null;

        this.cancel = () => {
            const wasRunning = this.isRunning;
            if (wasRunning) {
                if (continuous) {
                    clearInterval(handle);
                }
                else {
                    clearTimeout(handle);
                }
                handle = null;
            }

            return wasRunning;
        };

        const tick = () => {
            if (!continuous) {
                this.cancel();
            }
            this.dispatchEvent(tickEvt);
        };

        this.start = () => {
            this.cancel();
            if (continuous) {
                handle = setTimeout(tick, timeout);
            }
            else {
                handle = setInterval(tick, timeout);
            }
        };

        Object.defineProperties(this, {
            isRunning: {
                get: () => handle !== null
            }
        });

        Object.freeze(this);
    }
}

function assignAttributes(elem, ...rest) {
    rest.filter(x => !(x instanceof Element)
            && !(x instanceof String)
            && typeof x !== "string")
        .forEach(attr => {
        for (let key in attr) {
            const value = attr[key];
            if (key === "style") {
                for (let subKey in value) {
                    elem[key][subKey] = value[subKey];
                }
            }
            else if (key === "textContent" || key === "innerText") {
                elem.appendChild(document.createTextNode(value));
            }
            else if (key.startsWith("on") && typeof value === "function") {
                elem.addEventListener(key.substring(2), value);
            }
            else if (!(typeof value === "boolean" || value instanceof Boolean)
                || key === "muted") {
                elem[key] = value;
            }
            else if (value) {
                elem.setAttribute(key, "");
            }
            else {
                elem.removeAttribute(key);
            }
        }
    });
}

function tag(name, ...rest) {
    const elem = document.createElement(name);

    assignAttributes(elem, ...rest);

    const textContent = rest.filter(x => x instanceof String || typeof x === "string")
        .reduce((a, b) => (a + "\n" + b), "")
        .trim();

    if (textContent.length > 0) {
        elem.appendChild(document.createTextNode(textContent));
    }

    rest.filter(x => x instanceof Element)
        .forEach(elem.appendChild.bind(elem));

    return elem;
}
function br() { return tag("br"); }
function canvas(...rest) { return tag("canvas", ...rest); }
function div(...rest) { return tag("div", ...rest); }
function span(...rest) { return tag("span", ...rest); }
function text(value) { return document.createTextNode(value); }

function isCanvas(elem) {
    if (elem instanceof HTMLCanvasElement) {
        return true;
    }

    if (window.OffscreenCanvas
        && elem instanceof OffscreenCanvas) {
        return true;
    }

    return false;
}

function offscreenCanvas(options) {
    const width = options && options.width || 512,
        height = options && options.height || width;

    if (options instanceof Object) {
        Object.assign(options, {
            width,
            height
        });
    }

    if (window.OffscreenCanvas) {
        return new OffscreenCanvas(width, height);
    }

    return canvas(options);
}

function setCanvasSize(canv, w, h, superscale = 1) {
    w = Math.floor(w * superscale);
    h = Math.floor(h * superscale);
    if (canv.width != w
        || canv.height != h) {
        canv.width = w;
        canv.height = h;
        return true;
    }
    return false;
}

function setContextSize(ctx, w, h, superscale = 1) {
    const oldImageSmoothingEnabled = ctx.imageSmoothingEnabled,
        oldTextBaseline = ctx.textBaseline,
        oldTextAlign = ctx.textAlign,
        oldFont = ctx.font,
        resized = setCanvasSize(
            ctx.canvas,
            w,
            h,
            superscale);

    if (resized) {
        ctx.imageSmoothingEnabled = oldImageSmoothingEnabled;
        ctx.textBaseline = oldTextBaseline;
        ctx.textAlign = oldTextAlign;
        ctx.font = oldFont;
    }

    return resized;
}

function resizeContext(ctx, superscale = 1) {
    return setContextSize(
        ctx,
        ctx.canvas.clientWidth,
        ctx.canvas.clientHeight,
        superscale);
}

// Various flags used for feature detecting and configuring the system
const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
const isFirefox = typeof window.InstallTrigger !== "undefined";
const isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");
const isMacOS = /Macintosh/.test(navigator.userAgent || "");
const isSafari = Object.prototype.toString.call(window.HTMLElement)
    .indexOf("Constructor") > 0;

function testUserAgent(a) {
    return /(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
        a) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substring(0, 4));
}

const isMobile = testUserAgent(navigator.userAgent || navigator.vendor || window.opera);

/*
pliny.class({
  parent: "Primrose.Text",
    name: "Point",
    description: "| [under construction]"
});
*/

class Point {
    constructor(x, y) {
        this.set(x || 0, y || 0);
        Object.seal(this);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    copy(p) {
        if (p) {
            this.x = p.x;
            this.y = p.y;
        }
    }

    toCell(character, scroll, gridBounds) {
        this.x = Math.round(this.x / character.width) + scroll.x - gridBounds.x;
        this.y = Math.floor((this.y / character.height) - 0.25) + scroll.y;
    }

    inBounds(bounds) {
        return bounds.left <= this.x
            && this.x < bounds.right
            && bounds.top <= this.y
            && this.y < bounds.bottom;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    toString() {
        return "(x:" + this.x + ", y:" + this.y + ")";
    }
}
class Size {
    constructor(width, height) {
        this.width = width || 0;
        this.height = height || 0;
        Object.seal(this);
    }

    set(width, height) {
        this.width = width;
        this.height = height;
    }

    copy(s) {
        if (!!s) {
            this.width = s.width;
            this.height = s.height;
        }
    }

    clone() {
        return new Size(this.width, this.height);
    }

    toString() {
        return "<w:" + this.width + ", h:" + this.height + ">";
    }
}
class Rectangle {
    constructor(x, y, width, height) {
        this.point = new Point(x, y);
        this.size = new Size(width, height);
        Object.freeze(this);
    }

    get x() {
        return this.point.x;
    }

    set x(x) {
        this.point.x = x;
    }

    get left() {
        return this.point.x;
    }
    set left(x) {
        this.point.x = x;
    }

    get width() {
        return this.size.width;
    }
    set width(width) {
        this.size.width = width;
    }

    get right() {
        return this.point.x + this.size.width;
    }
    set right(right) {
        this.point.x = right - this.size.width;
    }

    get y() {
        return this.point.y;
    }
    set y(y) {
        this.point.y = y;
    }

    get top() {
        return this.point.y;
    }
    set top(y) {
        this.point.y = y;
    }

    get height() {
        return this.size.height;
    }
    set height(height) {
        this.size.height = height;
    }

    get bottom() {
        return this.point.y + this.size.height;
    }
    set bottom(bottom) {
        this.point.y = bottom - this.size.height;
    }

    get area() {
        return this.width * this.height;
    }

    set(x, y, width, height) {
        this.point.set(x, y);
        this.size.set(width, height);
    }

    copy(r) {
        if (r) {
            this.point.copy(r.point);
            this.size.copy(r.size);
        }
    }

    clone() {
        return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
    }

    overlap(r) {
        const left = Math.max(this.left, r.left),
            top = Math.max(this.top, r.top),
            right = Math.min(this.right, r.right),
            bottom = Math.min(this.bottom, r.bottom);
        if (right > left && bottom > top) {
            return new Rectangle(left, top, right - left, bottom - top);
        }
    }

    toString() {
        return `[${this.point.toString()} x ${this.size.toString()}]`;
    }
}

// These values are defined here:
//   https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
//   Values read on May 24, 2020
const keyGroups = Object.freeze(new Map([
    ["special", [
        "Unidentified"
    ]],

    ["modifier", [
        "Alt",
        "AltGraph",
        "CapsLock",
        "Control",
        "Fn",
        "FnLock",
        "Hyper",
        "Meta",
        "NumLock",
        "ScrollLock",
        "Shift",
        "Super",
        "Symbol",
        "SymbolLock"
    ]],

    ["whitespace", [
        "Enter",
        "Tab"
    ]],

    ["navigation", [
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "End",
        "Home",
        "PageDown",
        "PageUp"
    ]],

    ["editing", [
        "Backspace",
        "Clear",
        "Copy",
        "CrSel",
        "Cut",
        "Delete",
        "EraseEof",
        "ExSel",
        "Insert",
        "Paste",
        "Redo",
        "Undo"
    ]],

    ["ui", [
        "Accept",
        "Again",
        "Attn",
        "Cancel",
        "ContextMenu",
        "Escape",
        "Execute",
        "Find",
        "Finish",
        "Help",
        "Pause",
        "Play",
        "Props",
        "Select",
        "ZoomIn",
        "ZoomOut"
    ]],

    ["device", [
        "BrightnessDown",
        "BrightnessUp",
        "Eject",
        "LogOff",
        "Power",
        "PowerOff",
        "PrintScreen",
        "Hibernate",
        "Standby",
        "WakeUp"
    ]],

    ["ime", [
        "AllCandidates",
        "Alphanumeric",
        "CodeInput",
        "Compose",
        "Convert",
        "Dead",
        "FinalMode",
        "GroupFirst",
        "GroupNext",
        "GroupPrevious",
        "ModeChange",
        "NextCandidate",
        "NonConvert",
        "PreviousCandidate",
        "Process",
        "SingleCandidate"
    ]],

    ["korean", [
        "HangulMode",
        "HanjaMode",
        "JunjaMode"
    ]],

    ["japanese", [
        "Eisu",
        "Hankaku",
        "Hiragana",
        "HiraganaKatakana",
        "KanaMode",
        "KanjiMode",
        "Katakana",
        "Romaji",
        "Zenkaku",
        "ZenkakuHanaku"
    ]],

    ["function", [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "F13",
        "F14",
        "F15",
        "F16",
        "F17",
        "F18",
        "F19",
        "F20",
        "Soft1",
        "Soft2",
        "Soft3",
        "Soft4"
    ]],

    ["phone", [
        "AppSwitch",
        "Call",
        "Camera",
        "CameraFocus",
        "EndCall",
        "GoBack",
        "GoHome",
        "HeadsetHook",
        "LastNumberRedial",
        "Notification",
        "MannerMode",
        "VoiceDial"
    ]],

    ["multimedia", [
        "ChannelDown",
        "ChannelUp",
        "MediaFastForward",
        "MediaPause",
        "MediaPlay",
        "MediaPlayPause",
        "MediaRecord",
        "MediaRewind",
        "MediaStop",
        "MediaTrackNext",
        "MediaTrackPrevious"
    ]],

    ["audio", [
        "AudioBalanceLeft",
        "AudioBalanceRight",
        "AudioBassDown",
        "AudioBassBoostDown",
        "AudioBassBoostToggle",
        "AudioBassBoostUp",
        "AudioBassUp",
        "AudioFaderFront",
        "AudioFaderRear",
        "AudioSurroundModeNext",
        "AudioTrebleDown",
        "AudioTrebleUp",
        "AudioVolumeDown",
        "AudioVolumeMute",
        "AudioVolumeUp",
        "MicrophoneToggle",
        "MicrophoneVolumeDown",
        "MicrophoneVolumeMute",
        "MicrophoneVolumeUp"
    ]],

    ["tv", [
        "TV",
        "TV3DMode",
        "TVAntennaCable",
        "TVAudioDescription",
        "TVAudioDescriptionMixDown",
        "TVAudioDescriptionMixUp",
        "TVContentsMenu",
        "TVDataService",
        "TVInput",
        "TVInputComponent1",
        "TVInputComponent2",
        "TVInputComposite1",
        "TVInputComposite2",
        "TVInputHDMI1",
        "TVInputHDMI2",
        "TVInputHDMI3",
        "TVInputHDMI4",
        "TVInputVGA1",
        "TVMediaContext",
        "TVNetwork",
        "TVNumberEntry",
        "TVPower",
        "TVRadioService",
        "TVSatellite",
        "TVSatelliteBS",
        "TVSatelliteCS",
        "TVSatelliteToggle",
        "TVTerrestrialAnalog",
        "TVTerrestrialDigital",
        "TVTimer"
    ]],

    ["mediaController", [
        "AVRInput",
        "AVRPower",
        "ColorF0Red",
        "ColorF1Green",
        "ColorF2Yellow",
        "ColorF3Blue",
        "ColorF4Grey",
        "ColorF5Brown",
        "ClosedCaptionToggle",
        "Dimmer",
        "DisplaySwap",
        "DVR",
        "Exit",
        "FavoriteClear0",
        "FavoriteClear1",
        "FavoriteClear2",
        "FavoriteClear3",
        "FavoriteRecall0",
        "FavoriteRecall1",
        "FavoriteRecall2",
        "FavoriteRecall3",
        "FavoriteStore0",
        "FavoriteStore1",
        "FavoriteStore2",
        "FavoriteStore3",
        "Guide",
        "GuideNextDay",
        "GuidePreviousDay",
        "Info",
        "InstantReplay",
        "Link",
        "ListProgram",
        "LiveContent",
        "Lock",
        "MediaApps",
        "MediaAudioTrack",
        "MediaLast",
        "MediaSkipBackward",
        "MediaSkipForward",
        "MediaStepBackward",
        "MediaStepForward",
        "MediaTopMenu",
        "NavigateIn",
        "NavigateNext",
        "NavigateOut",
        "NavigatePrevious",
        "NextFavoriteChannel",
        "NextUserProfile",
        "OnDemand",
        "Pairing",
        "PinPDown",
        "PinPMove",
        "PinPToggle",
        "PinPUp",
        "PlaySpeedDown",
        "PlaySpeedReset",
        "PlaySpeedUp",
        "RandomToggle",
        "RcLowBattery",
        "RecordSpeedNext",
        "RfBypass",
        "ScanChannelsToggle",
        "ScreenModeNext",
        "Settings",
        "SplitScreenToggle",
        "STBInput",
        "STBPower",
        "Subtitle",
        "Teletext",
        "VideoModeNext",
        "Wink",
        "ZoomToggle"
    ]],

    ["speechRecognition", [
        "SpeechCorrectionList",
        "SpeechInputToggle"
    ]],

    ["document", [
        "Close",
        "New",
        "Open",
        "Print",
        "Save",
        "SpellCheck",
        "MailForward",
        "MailReply",
        "MailSend"
    ]],

    ["applicationSelector", [
        "LaunchCalculator",
        "LaunchCalendar",
        "LaunchContacts",
        "LaunchMail",
        "LaunchMediaPlayer",
        "LaunchMusicPlayer",
        "LaunchMyComputer",
        "LaunchPhone",
        "LaunchScreenSaver",
        "LaunchSpreadsheet",
        "LaunchWebBrowser",
        "LaunchWebCam",
        "LaunchWordProcessor",
        "LaunchApplication1",
        "LaunchApplication2",
        "LaunchApplication3",
        "LaunchApplication4",
        "LaunchApplication5",
        "LaunchApplication6",
        "LaunchApplication7",
        "LaunchApplication8",
        "LaunchApplication9",
    ]],

    ["browserControl", [
        "BrowserBack",
        "BrowserFavorites",
        "BrowserForward",
        "BrowserHome",
        "BrowserRefresh",
        "BrowserSearch",
        "BrowserStop"
    ]],

    ["numericKeypad", [
        "Clear"
    ]]
]));

// reverse lookup for keyGroups
const keyTypes = new Map();
for (let pair of keyGroups) {
    for (let value of pair[1]) {
        keyTypes.set(value, pair[0]);
    }
}
Object.freeze(keyTypes);

let isFnDown = false;
if (isMacOS) {
    window.addEventListener("keydown", (evt) => {
        if (evt.key === "Fn") {
            isFnDown = true;
        }
    });

    window.addEventListener("keyup", (evt) => {
        if (evt.key === "Fn") {
            isFnDown = false;
        }
    });
}
// Fixes for out-of-spec values that some older browser versions might have returned.
function normalizeKeyValue(evt) {
    // modifier
    if (evt.key === "OS"
        && (evt.code === "OSLeft"
            || evt.code === "OSRight")) {
        return "Meta";
    }
    else if (evt.key === "Scroll") {
        return "ScrollLock";
    }
    else if (evt.key === "Win") {
        return "Meta";
    }
    // whitespace
    else if (evt.key === "Spacebar") {
        return " ";
    }
    else if (evt.key === "\n") {
        return "Enter";
    }
    // navigation
    else if (evt.key === "Down") {
        return "ArrowDown";
    }
    else if (evt.key === "Left") {
        return "ArrowLeft";
    }
    else if (evt.key === "Right") {
        return "ArrowRight";
    }
    else if (evt.key === "Up") {
        return "ArrowUp";
    }
    // editing
    else if (evt.key === "Del") {
        return "Delete";
    }
    else if (evt.key === "Delete"
        && isMacOS
        && isFnDown) {
        return "Backspace";
    }
    else if (evt.key === "Crsel") {
        return "CrSel";
    }
    else if (evt.key === "Exsel") {
        return "ExSel";
    }
    // ui
    else if (evt.key === "Esc") {
        return "Escape";
    }
    else if (evt.key === "Apps") {
        return "ContextMenu";
    }
    // device - None
    // ime
    else if (evt.key === "Multi") {
        return "Compose";
    }
    else if (evt.key === "Nonconvert") {
        return "NonConvert";
    }
    // korean - None
    // japanese
    else if (evt.key === "RomanCharacters") {
        return "Eisu";
    }
    else if (evt.key === "HalfWidth") {
        return "Hankaku";
    }
    else if (evt.key === "FullWidth") {
        return "Zenkaku";
    }
    // dead - None
    // function - None
    // phone
    else if (evt.key === "Exit"
        || evt.key === "MozHomeScreen") {
        return "GoHome";
    }
    // multimedia
    else if (evt.key === "MediaNextTrack") {
        return "MediaTrackNext";
    }
    else if (evt.key === "MediaPreviousTrack") {
        return "MediaTrackPrevious";
    }
    else if (evt.key === "FastFwd") {
        return "MedaiFastFwd";
    }
    // audio
    else if (evt.key === "VolumeDown") {
        return "AudioVolumeDown";
    }
    else if (evt.key === "VolumeMute") {
        return "AudioVolumeMute";
    }
    else if (evt.key === "VolumeUp") {
        return "AudioVolumeUp";
    }
    // TV
    else if (evt.key === "Live") {
        return "TV";
    }
    // media
    else if (evt.key === "Zoom") {
        return "ZoomToggle";
    }
    // speech recognition - None
    // document - None
    // application selector
    else if (evt.key === "SelectMedia"
        || evt.key === "MediaSelect") {
        return "LaunchMediaPlayer";
    }
    // browser - None
    // numeric keypad
    else if (evt.key === "Add") {
        return "+";
    }
    else if (evt.key === "Divide") {
        return "/";
    }
    else if (evt.key === "Decimal") {
        // this is incorrect for some locales, but
        // this is a deprecated value that is fixed in
        // modern browsers, so it shouldn't come up
        // very often.
        return ".";
    }
    else if (evt.key === "Key11") {
        return "11";
    }
    else if (evt.key === "Key12") {
        return "12";
    }
    else if (evt.key === "Multiply") {
        return "*";
    }
    else if (evt.key === "Subtract") {
        return "-";
    }
    else if (evt.key === "Separator") {
        // this is incorrect for some locales, but 
        // this is a deprecated value that is fixed in
        // modern browsers, so it shouldn't come up
        // very often.
        return ",";
    }
    return evt.key;
}

const gesture = Object.seal({
    type: "",
    text: "",
    command: ""
});

// Translates operating system-specific Browser KeyboardEvents into a
// cross-platform Gesture that can then be dispatched to a CommandPack
// for translation to an EditorCommand.
class OperatingSystem {
    constructor(osName, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
        this.name = osName;

        const pre4 = pre3;
        pre3 = pre3.length > 0 ? pre3 : "Normal";

        const definitions = Object.freeze(new Map([
            ["CursorDown", "Normal_ArrowDown"],
            ["CursorLeft", "Normal_ArrowLeft"],
            ["CursorRight", "Normal_ArrowRight"],
            ["CursorUp", "Normal_ArrowUp"],
            ["CursorPageDown", "Normal_PageDown"],
            ["CursorPageUp", "Normal_PageUp"],
            ["CursorSkipLeft", `${pre2}_ArrowLeft`],
            ["CursorSkipRight", `${pre2}_ArrowRight`],
            ["CursorHome", `${pre3}_${home}`],
            ["CursorEnd", `${pre3}_${end}`],
            ["CursorFullHome", `${pre5}_${fullHome}`],
            ["CursorFullEnd", `${pre5}_${fullEnd}`],


            ["SelectDown", "Shift_ArrowDown"],
            ["SelectLeft", "Shift_ArrowLeft"],
            ["SelectRight", "Shift_ArrowRight"],
            ["SelectUp", "Shift_ArrowUp"],
            ["SelectPageDown", "Shift_PageDown"],
            ["SelectPageUp", "Shift_PageUp"],
            ["SelectSkipLeft", `${pre2}Shift_ArrowLeft`],
            ["SelectSkipRight", `${pre2}Shift_ArrowRight`],
            ["SelectHome", `${pre4}Shift_${home}`],
            ["SelectEnd", `${pre4}Shift_${end}`],
            ["SelectFullHome", `${pre5}Shift_${fullHome}`],
            ["SelectFullEnd", `${pre5}Shift_${fullEnd}`],

            ["SelectAll", `${pre1}_a`],

            ["ScrollDown", `${pre1}_ArrowDown`],
            ["ScrollUp", `${pre1}_ArrowUp`],

            ["DeleteLetterLeft", "Normal_Backspace"],
            ["DeleteLetterRight", "Normal_Delete"],
            ["DeleteWordLeft", `${pre2}_Backspace`],
            ["DeleteWordRight", `${pre2}_Delete`],
            ["DeleteLine", `Shift_Delete`],

            ["AppendNewline", "Normal_Enter"],
            ["PrependNewline", `${pre2}_Enter`],

            ["InsertTab", "Normal_Tab"],
            ["RemoveTab", "Shift_Tab"],

            ["Undo", `${pre1}_z`],
            ["Redo", redo]
        ]));

        const substitutions = new Map();
        for (let pair of definitions) {
            substitutions.set(pair[1], pair[0]);
        }
        Object.freeze(substitutions);

        this.makeCommand = (evt) => {
            gesture.text = normalizeKeyValue(evt);

            gesture.type = keyTypes.has(gesture.text)
                ? keyTypes.get(gesture.text)
                : "printable";

            gesture.command = "";

            if (evt.ctrlKey
                || evt.altKey
                || evt.metaKey) {
                if (gesture.type === "printable"
                    || gesture.type === "whitespace") {
                    gesture.type = "special";
                }

                if (evt.ctrlKey) {
                    gesture.command += "Control";
                }

                if (evt.altKey) {
                    gesture.command += "Alt";
                }

                if (evt.metaKey) {
                    gesture.command += "Meta";
                }
            }

            if (evt.shiftKey) {
                gesture.command += "Shift";
            }

            if (gesture.command === "") {
                gesture.command += "Normal";
            }

            gesture.command += "_" + gesture.text;

            if (substitutions.has(gesture.command)) {
                gesture.command = substitutions.get(gesture.command);
            }

            if (gesture.command === "PrependNewline") {
                gesture.type = "whitespace";
            }

            return gesture;
        };

        Object.freeze(this);
    }
}
const Windows = new OperatingSystem(
    "Windows",
    "Control", "Control",
    "Control_y",
    "", "Home", "End",
    "Control", "Home", "End");

const MacOS = new OperatingSystem(
    "macOS",
    "Meta", "Alt",
    "MetaShift_z",
    "Meta", "ArrowLeft", "ArrowRight",
    "Meta", "ArrowUp", "ArrowDown");

// A single syntax matching rule, for tokenizing code.
class Rule {
    constructor(name, test) {
        this.name = name;
        this.test = test;
        Object.freeze(this);
    }

    carveOutMatchedToken(tokens, j) {
        const token = tokens[j];
        if (token.type === "regular") {
            const res = this.test.exec(token.value);
            if (!!res) {
                // Only use the last group that matches the regex, to allow for more
                // complex regexes that can match in special contexts, but not make
                // the context part of the token.
                const midx = res[res.length - 1],
                    start = res.input.indexOf(midx),
                    end = start + midx.length;
                if (start === 0) {
                    // the rule matches the start of the token
                    token.type = this.name;
                    if (end < token.value.length) {
                        // but not the end
                        const next = token.splitAt(end);
                        next.type = "regular";
                        tokens.splice(j + 1, 0, next);
                    }
                }
                else {
                    // the rule matches from the middle of the token
                    const mid = token.splitAt(start);
                    if (midx.length < mid.value.length) {
                        // but not the end
                        const right = mid.splitAt(midx.length);
                        tokens.splice(j + 1, 0, right);
                    }
                    mid.type = this.name;
                    tokens.splice(j + 1, 0, mid);
                }
            }
        }
    }
}

// A chunk of text that represents a single element of code,
// with fields linking it back to its source.
class Token {
    constructor(value, type, index, line) {
        this.value = value;
        this.type = type;
        this.index = index;
        this.line = line;
        Object.seal(this);
    }

    clone() {
        return new Token(this.value, this.type, this.index, this.line);
    }

    splitAt(i) {
        var next = this.value.substring(i);
        this.value = this.value.substring(0, i);
        return new Token(next, this.type, this.index + i, this.line);
    }

    toString() {
        return "[" + this.type + ": " + this.value + "]";
    }
}

/*
pliny.class({
  parent: "Primrose.Text",
    name: "Grammar",
    parameters: [{
      name: "grammarName",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    }, {
      name: "rules",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    }],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [{
      name: "A plain-text \"grammar\".",
      description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var plainTextGrammar = new Primrose.Text.Grammar(\n\
    // The name is for displaying in options views.\n\
    \"Plain-text\", [\n\
    // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
    [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
  ] );"
    }, {
      name: "A grammar for BASIC",
      description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var basicGrammar = new Primrose.Text.Grammar( \"BASIC\",\n\
    // Grammar rules are applied in the order they are specified.\n\
    [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [ \"newlines\", /(?:\\r\\n|\\r|\\n)/ ],\n\
      // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.\n\
      [ \"lineNumbers\", /^\\d+\\s+/ ],\n\
      // Comments were lines that started with the keyword \"REM\" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.\n\
      [ \"startLineComments\", /^REM\\s/ ],\n\
      // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.\n\
      [ \"strings\", /\"(?:\\\\\"|[^\"])*\"/ ],\n\
      [ \"strings\", /'(?:\\\\'|[^'])*'/ ],\n\
      // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).\n\
      [ \"numbers\", /-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b/ ],\n\
      // Keywords are really just a list of different words we want to match, surrounded by the \"word boundary\" selector \"\\b\".\n\
      [ \"keywords\",\n\
        /\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b/\n\
      ],\n\
      // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.\n\
      [ \"keywords\", /^DEF FN/ ],\n\
      // These are all treated as mathematical operations.\n\
      [ \"operators\",\n\
        /(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])/\n\
      ],\n\
      // Once everything else has been matched, the left over blocks of words are treated as variable and function names.\n\
      [ \"identifiers\", /\\w+\\$?/ ]\n\
    ] );"
    }]
});
*/

const DefaultRules = [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["whitespace", /(?:\s+)/]
];

class Grammar {
    constructor(grammarName, rules) {
        rules = rules || [];
        rules = DefaultRules.concat(rules);
        /*
        pliny.property({
          parent: "Primrose.Text.Grammar",
          name: " name",
          type: "String",
          description: "A user-friendly name for the grammar, to be able to include it in an options listing."
        });
        */
        this.name = grammarName;

        /*
        pliny.property({
          parent: "Primrose.Text.Grammar",
          name: "grammar",
          type: "Array",
          description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
        });
        */
        // clone the preprocessing grammar to start a new grammar
        this.grammar = rules.map((rule) =>
            new Rule(rule[0], rule[1]));

        function crudeParsing(tokens) {
            var commentDelim = null,
                stringDelim = null,
                line = 0,
                i, t;
            for (i = 0; i < tokens.length; ++i) {
                t = tokens[i];
                t.line = line;
                if (t.type === "newlines") {
                    ++line;
                }

                if (stringDelim) {
                    if (t.type === "stringDelim" && t.value === stringDelim && (i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
                        stringDelim = null;
                    }
                    if (t.type !== "newlines") {
                        t.type = "strings";
                    }
                }
                else if (commentDelim) {
                    if (commentDelim === "startBlockComments" && t.type === "endBlockComments" ||
                        commentDelim === "startLineComments" && t.type === "newlines") {
                        commentDelim = null;
                    }
                    if (t.type !== "newlines") {
                        t.type = "comments";
                    }
                }
                else if (t.type === "stringDelim") {
                    stringDelim = t.value;
                    t.type = "strings";
                }
                else if (t.type === "startBlockComments" || t.type === "startLineComments") {
                    commentDelim = t.type;
                    t.type = "comments";
                }
            }

            // recombine like-tokens
            for (i = tokens.length - 1; i > 0; --i) {
                var p = tokens[i - 1];
                t = tokens[i];
                if (p.type === t.type && p.type !== "newlines") {
                    p.value += t.value;
                    tokens.splice(i, 1);
                }
            }
        }

        /*
        pliny.method({
          parent: "Primrose.Text.Grammar",
          name: "tokenize",
          parameters: [{
            name: "text",
            type: "String",
            description: "The text to tokenize."
          }],
          returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
          description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
          examples: [{
            name: 'Tokenize some JavaScript',
            description: 'Primrose comes with a grammar for JavaScript built in.\n\
      \n\
      ## Code:\n\
      \n\
        grammar(\"JavaScript\");\n\
        var tokens = new Primrose.Text.Grammars.JavaScript\n\
          .tokenize("var x = 3;\\n\\\n\
        var y = 2;\\n\\\n\
        console.log(x + y);");\n\
        console.log(JSON.stringify(tokens));\n\
      \n\
      ## Result:\n\
      \n\
        grammar(\"JavaScript\");\n\
        [ \n\
          { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
          { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
          { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
          { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
          { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
          { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
          { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
          { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
          { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
          { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
          { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
          { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
          { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
        ]'
          }]
        });
        */
        this.tokenize = function (text) {
            // all text starts off as regular text, then gets cut up into tokens of
            // more specific type
            const tokens = [new Token(text, "regular", 0)];
            for (let rule of this.grammar) {
                for (var j = 0; j < tokens.length; ++j) {
                    rule.carveOutMatchedToken(tokens, j);
                }
            }

            crudeParsing(tokens);
            return tokens;
        };

        Object.freeze(this);
    }

    toHTML(parent, txt, theme, fontSize) {
        if (theme === undefined) {
            theme = Light;
        }

        var tokenRows = this.tokenize(txt),
            temp = div();
        for (var y = 0; y < tokenRows.length; ++y) {
            // draw the tokens on this row
            var t = tokenRows[y];
            if (t.type === "newlines") {
                temp.appendChild(br());
            }
            else {
                var style = theme[t.type] || {},
                    elem = span({
                        fontWeight: style.fontWeight || theme.regular.fontWeight,
                        fontStyle: style.fontStyle || theme.regular.fontStyle || "",
                        color: style.foreColor || theme.regular.foreColor,
                        backgroundColor: style.backColor || theme.regular.backColor,
                        fontFamily: monospaceFamily
                    });
                elem.appendChild(text(t.value));
                temp.appendChild(elem);
            }
        }

        parent.innerHTML = temp.innerHTML;
        Object.assign(parent.style, {
            backgroundColor: theme.regular.backColor,
            fontSize: `${fontSize}px`,
            lineHeight: `${fontSize}px`,
        });
    }
}

// A grammar and an interpreter for a BASIC-like language.
class BasicGrammar extends Grammar {
    constructor() {
        super("BASIC",
            // Grammar rules are applied in the order they are specified.
            [
                // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
                ["lineNumbers", /^\d+\s+/],
                // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
                ["startLineComments", /^REM\s/],
                // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
                ["stringDelim", /("|')/],
                // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
                ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
                // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
                ["keywords",
                    /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
                ],
                // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
                ["keywords", /^DEF FN/],
                // These are all treated as mathematical operations.
                ["operators",
                    /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
                ],
                // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
                ["members", /\w+\$?/]
            ]);
    }

    tokenize(code) {
        return super.tokenize(code.toUpperCase());
    }

    interpret(sourceCode, input, output, errorOut, next, clearScreen, loadFile, done) {
        var tokens = this.tokenize(sourceCode),
            EQUAL_SIGN = new Token("=", "operators"),
            counter = 0,
            isDone = false,
            program = new Map(),
            lineNumbers = [],
            currentLine = [],
            lines = [currentLine],
            data = [],
            returnStack = [],
            forLoopCounters = new Map(),
            dataCounter = 0;

        Object.assign(window, {
            INT: function (v) {
                return v | 0;
            },
            RND: function () {
                return Math.random();
            },
            CLK: function () {
                return Date.now() / 3600000;
            },
            LEN: function (id) {
                return id.length;
            },
            LINE: function () {
                return lineNumbers[counter];
            },
            TAB: function (v) {
                var str = "";
                for (var i = 0; i < v; ++i) {
                    str += " ";
                }
                return str;
            },
            POW: function (a, b) {
                return Math.pow(a, b);
            }
        });

        function toNum(ln) {
            return new Token(ln.toString(), "numbers");
        }

        function toStr(str) {
            return new Token("\"" + str.replace("\n", "\\n")
                .replace("\"", "\\\"") + "\"", "strings");
        }

        var tokenMap = {
            "OR": "||",
            "AND": "&&",
            "NOT": "!",
            "MOD": "%",
            "<>": "!="
        };

        while (tokens.length > 0) {
            var token = tokens.shift();
            if (token.type === "newlines") {
                currentLine = [];
                lines.push(currentLine);
            }
            else if (token.type !== "regular" && token.type !== "comments") {
                token.value = tokenMap[token.value] || token.value;
                currentLine.push(token);
            }
        }

        for (var i = 0; i < lines.length; ++i) {
            var line = lines[i];
            if (line.length > 0) {
                var lastLine = lineNumbers[lineNumbers.length - 1];
                var lineNumber = line.shift();

                if (lineNumber.type !== "lineNumbers") {
                    line.unshift(lineNumber);

                    if (lastLine === undefined) {
                        lastLine = -1;
                    }

                    lineNumber = toNum(lastLine + 1);
                }

                lineNumber = parseFloat(lineNumber.value);
                if (lastLine && lineNumber <= lastLine) {
                    throw new Error("expected line number greater than " + lastLine +
                        ", but received " + lineNumber + ".");
                }
                else if (line.length > 0) {
                    lineNumbers.push(lineNumber);
                    program.set(lineNumber, line);
                }
            }
        }


        function process(line) {
            if (line && line.length > 0) {
                var op = line.shift();
                if (op) {
                    if (commands.hasOwnProperty(op.value)) {
                        return commands[op.value](line);
                    }
                    else if (!isNaN(op.value)) {
                        return setProgramCounter([op]);
                    }
                    else if (window[op.value] ||
                        (line.length > 0 && line[0].type === "operators" &&
                            line[0].value === "=")) {
                        line.unshift(op);
                        return translate(line);
                    }
                    else {
                        error("Unknown command. >>> " + op.value);
                    }
                }
            }
            return pauseBeforeComplete();
        }

        function error(msg) {
            errorOut("At line " + lineNumbers[counter] + ": " + msg);
        }

        function getLine(i) {
            var lineNumber = lineNumbers[i];
            var line = program.get(lineNumber);
            return line && line.slice();
        }

        function evaluate(line) {
            var script = "";
            for (var i = 0; i < line.length; ++i) {
                var t = line[i];
                var nest = 0;
                if (t.type === "identifiers" &&
                    typeof window[t.value] !== "function" &&
                    i < line.length - 1 &&
                    line[i + 1].value === "(") {
                    for (var j = i + 1; j < line.length; ++j) {
                        var t2 = line[j];
                        if (t2.value === "(") {
                            if (nest === 0) {
                                t2.value = "[";
                            }
                            ++nest;
                        }
                        else if (t2.value === ")") {
                            --nest;
                            if (nest === 0) {
                                t2.value = "]";
                            }
                        }
                        else if (t2.value === "," && nest === 1) {
                            t2.value = "][";
                        }

                        if (nest === 0) {
                            break;
                        }
                    }
                }
                script += t.value;
            }

            try {
                return eval(script); // jshint ignore:line
            }
            catch (exp) {
                console.error(exp);
                console.debug(line.join(", "));
                console.error(script);
                error(exp.message + ": " + script);
            }
        }

        function declareVariable(line) {
            var decl = [],
                decls = [decl],
                nest = 0,
                i;
            for (i = 0; i < line.length; ++i) {
                var t = line[i];
                if (t.value === "(") {
                    ++nest;
                }
                else if (t.value === ")") {
                    --nest;
                }
                if (nest === 0 && t.value === ",") {
                    decl = [];
                    decls.push(decl);
                }
                else {
                    decl.push(t);
                }
            }
            for (i = 0; i < decls.length; ++i) {
                decl = decls[i];
                var id = decl.shift();
                if (id.type !== "identifiers") {
                    error("Identifier expected: " + id.value);
                }
                else {
                    var val = null,
                        j;
                    id = id.value;
                    if (decl[0].value === "(" && decl[decl.length - 1].value === ")") {
                        var sizes = [];
                        for (j = 1; j < decl.length - 1; ++j) {
                            if (decl[j].type === "numbers") {
                                sizes.push(decl[j].value | 0);
                            }
                        }
                        if (sizes.length === 0) {
                            val = [];
                        }
                        else {
                            val = new Array(sizes[0]);
                            var queue = [val];
                            for (j = 1; j < sizes.length; ++j) {
                                var size = sizes[j];
                                for (var k = 0,
                                    l = queue.length; k < l; ++k) {
                                    var arr = queue.shift();
                                    for (var m = 0; m < arr.length; ++m) {
                                        arr[m] = new Array(size);
                                        if (j < sizes.length - 1) {
                                            queue.push(arr[m]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    window[id] = val;
                    return true;
                }
            }
        }

        function print(line) {
            var endLine = "\n";
            var nest = 0;
            line = line.map(function (t, i) {
                t = t.clone();
                if (t.type === "operators") {
                    if (t.value === ",") {
                        if (nest === 0) {
                            t.value = "+ \", \" + ";
                        }
                    }
                    else if (t.value === ";") {
                        t.value = "+ \" \"";
                        if (i < line.length - 1) {
                            t.value += " + ";
                        }
                        else {
                            endLine = "";
                        }
                    }
                    else if (t.value === "(") {
                        ++nest;
                    }
                    else if (t.value === ")") {
                        --nest;
                    }
                }
                return t;
            });
            var txt = evaluate(line);
            if (txt === undefined) {
                txt = "";
            }
            output(txt + endLine);
            return true;
        }

        function setProgramCounter(line) {
            var lineNumber = parseFloat(evaluate(line));
            counter = -1;
            while (counter < lineNumbers.length - 1 &&
                lineNumbers[counter + 1] < lineNumber) {
                ++counter;
            }

            return true;
        }

        function checkConditional(line) {
            var thenIndex = -1,
                elseIndex = -1,
                i;
            for (i = 0; i < line.length; ++i) {
                if (line[i].type === "keywords" && line[i].value === "THEN") {
                    thenIndex = i;
                }
                else if (line[i].type === "keywords" && line[i].value === "ELSE") {
                    elseIndex = i;
                }
            }
            if (thenIndex === -1) {
                error("Expected THEN clause.");
            }
            else {
                var condition = line.slice(0, thenIndex);
                for (i = 0; i < condition.length; ++i) {
                    var t = condition[i];
                    if (t.type === "operators" && t.value === "=") {
                        t.value = "==";
                    }
                }
                var thenClause,
                    elseClause;
                if (elseIndex === -1) {
                    thenClause = line.slice(thenIndex + 1);
                }
                else {
                    thenClause = line.slice(thenIndex + 1, elseIndex);
                    elseClause = line.slice(elseIndex + 1);
                }
                if (evaluate(condition)) {
                    return process(thenClause);
                }
                else if (elseClause) {
                    return process(elseClause);
                }
            }

            return true;
        }

        function pauseBeforeComplete() {
            output("PROGRAM COMPLETE - PRESS RETURN TO FINISH.");
            input(function () {
                isDone = true;
                if (done) {
                    done();
                }
            });
            return false;
        }

        function labelLine(line) {
            line.push(EQUAL_SIGN);
            line.push(toNum(lineNumbers[counter]));
            return translate(line);
        }

        function waitForInput(line) {
            var toVar = line.pop();
            if (line.length > 0) {
                print(line);
            }
            input(function (str) {
                str = str.toUpperCase();
                var valueToken = null;
                if (!isNaN(str)) {
                    valueToken = toNum(str);
                }
                else {
                    valueToken = toStr(str);
                }
                evaluate([toVar, EQUAL_SIGN, valueToken]);
                if (next) {
                    next();
                }
            });
            return false;
        }

        function onStatement(line) {
            var idxExpr = [],
                idx = null,
                targets = [];
            try {
                while (line.length > 0 &&
                    (line[0].type !== "keywords" ||
                        line[0].value !== "GOTO")) {
                    idxExpr.push(line.shift());
                }

                if (line.length > 0) {
                    line.shift(); // burn the goto;

                    for (var i = 0; i < line.length; ++i) {
                        var t = line[i];
                        if (t.type !== "operators" ||
                            t.value !== ",") {
                            targets.push(t);
                        }
                    }

                    idx = evaluate(idxExpr) - 1;

                    if (0 <= idx && idx < targets.length) {
                        return setProgramCounter([targets[idx]]);
                    }
                }
            }
            catch (exp) {
                console.error(exp);
            }
            return true;
        }

        function gotoSubroutine(line) {
            returnStack.push(toNum(lineNumbers[counter + 1]));
            return setProgramCounter(line);
        }

        function setRepeat() {
            returnStack.push(toNum(lineNumbers[counter]));
            return true;
        }

        function conditionalReturn(cond) {
            var ret = true;
            var val = returnStack.pop();
            if (val && cond) {
                ret = setProgramCounter([val]);
            }
            return ret;
        }

        function untilLoop(line) {
            var cond = !evaluate(line);
            return conditionalReturn(cond);
        }

        function findNext(str) {
            for (i = counter + 1; i < lineNumbers.length; ++i) {
                var l = getLine(i);
                if (l[0].value === str) {
                    return i;
                }
            }
            return lineNumbers.length;
        }

        function whileLoop(line) {
            var cond = evaluate(line);
            if (!cond) {
                counter = findNext("WEND");
            }
            else {
                returnStack.push(toNum(lineNumbers[counter]));
            }
            return true;
        }

        var FOR_LOOP_DELIMS = ["=", "TO", "STEP"];

        function forLoop(line) {
            var n = lineNumbers[counter];
            var varExpr = [];
            var fromExpr = [];
            var toExpr = [];
            var skipExpr = [];
            var arrs = [varExpr, fromExpr, toExpr, skipExpr];
            var a = 0;
            var i = 0;
            for (i = 0; i < line.length; ++i) {
                var t = line[i];
                if (t.value === FOR_LOOP_DELIMS[a]) {
                    if (a === 0) {
                        varExpr.push(t);
                    }
                    ++a;
                }
                else {
                    arrs[a].push(t);
                }
            }

            var skip = 1;
            if (skipExpr.length > 0) {
                skip = evaluate(skipExpr);
            }

            if (!forLoopCounters.has(n) === undefined) {
                forLoopCounters.set(n, evaluate(fromExpr));
            }

            var end = evaluate(toExpr);
            var cond = forLoopCounters.get(n) <= end;
            if (!cond) {
                forLoopCounters.delete(n);
                counter = findNext("NEXT");
            }
            else {
                var v = forLoopCounters.get(n);
                varExpr.push(toNum(v));
                process(varExpr);
                v += skip;
                forLoopCounters.set(n, v);
                returnStack.push(toNum(lineNumbers[counter]));
            }
            return true;
        }

        function stackReturn() {
            return conditionalReturn(true);
        }

        function loadCodeFile(line) {
            loadFile(evaluate(line))
                .then(next);
            return false;
        }

        function noop() {
            return true;
        }

        function loadData(line) {
            while (line.length > 0) {
                var t = line.shift();
                if (t.type !== "operators") {
                    data.push(t.value);
                }
            }
            return true;
        }

        function readData(line) {
            if (data.length === 0) {
                var dataLine = findNext("DATA");
                process(getLine(dataLine));
            }
            var value = data[dataCounter];
            ++dataCounter;
            line.push(EQUAL_SIGN);
            line.push(toNum(value));
            return translate(line);
        }

        function restoreData() {
            dataCounter = 0;
            return true;
        }

        function defineFunction(line) {
            var name = line.shift()
                .value;
            var signature = "";
            var body = "";
            var fillSig = true;
            for (var i = 0; i < line.length; ++i) {
                var t = line[i];
                if (t.type === "operators" && t.value === "=") {
                    fillSig = false;
                }
                else if (fillSig) {
                    signature += t.value;
                }
                else {
                    body += t.value;
                }
            }
            name = "FN" + name;
            var script = "(function " + name + signature + "{ return " + body +
                "; })";
            window[name] = eval(script); // jshint ignore:line
            return true;
        }

        function translate(line) {
            evaluate(line);
            return true;
        }

        var commands = {
            DIM: declareVariable,
            LET: translate,
            PRINT: print,
            GOTO: setProgramCounter,
            IF: checkConditional,
            INPUT: waitForInput,
            END: pauseBeforeComplete,
            STOP: pauseBeforeComplete,
            REM: noop,
            "'": noop,
            CLS: clearScreen,
            ON: onStatement,
            GOSUB: gotoSubroutine,
            RETURN: stackReturn,
            LOAD: loadCodeFile,
            DATA: loadData,
            READ: readData,
            RESTORE: restoreData,
            REPEAT: setRepeat,
            UNTIL: untilLoop,
            "DEF FN": defineFunction,
            WHILE: whileLoop,
            WEND: stackReturn,
            FOR: forLoop,
            NEXT: stackReturn,
            LABEL: labelLine
        };

        return function () {
            if (!isDone) {
                var goNext = true;
                while (goNext) {
                    var line = getLine(counter);
                    goNext = process(line);
                    ++counter;
                }
            }
        };
    };
}

const Basic = new BasicGrammar();

/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "HTML",
  description: "A grammar for HyperText Markup Language."
});
*/
const HTML = new Grammar("HTML", [
    ["startBlockComments", /(?:<|&lt;)!--/],
    ["endBlockComments", /--(?:>|&gt;)/],
    ["stringDelim", /("|')/],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    ["keywords",
        /(?:<|&lt;)\/?(html|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|dd|div|dl|dt|figcaption|figure|hr|li|main|ol|p|pre|ul|a|abbr|b|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|embed|object|param|source|canvas|noscript|script|del|ins|caption|col|colgroup|table|tbody|td|tfoot|th|thead|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template|acronym|applet|basefont|big|blink|center|command|content|dir|font|frame|frameset|isindex|keygen|listing|marquee|multicol|nextid|noembed|plaintext|spacer|strike|tt|xmp)\b/
    ],
    ["members", /(\w+)=/]
]);

/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "A grammar for the JavaScript programming language."
});
*/
const JavaScript = new Grammar("JavaScript", [
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
    ["stringDelim", /("|'|`)/],
    ["startLineComments", /\/\/.*$/m],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    ["keywords",
        /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    ["functions", /(\w+)(?:\s*\()/],
    ["members", /(\w+)\./],
    ["members", /((\w+\.)+)(\w+)/]
]);

/*
pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "PlainText",
  description: "A grammar that makes displaying plain text work with the text editor designed for syntax highlighting."
});
*/
const PlainText = new Grammar("PlainText");

const grammars = Object.freeze(new Map([
    ["basic", Basic],
    ["bas", Basic],
    ["html", HTML],
    ["javascript", JavaScript],
    ["js", JavaScript],
    ["plaintext", PlainText],
    ["txt", PlainText]
]));

const singleLineOutput = Object.freeze([
    "CursorLeft",
    "CursorRight",
    "CursorSkipLeft",
    "CursorSkipRight",
    "CursorHome",
    "CursorEnd",
    "CursorFullHome",
    "CursorFullEnd",

    "SelectLeft",
    "SelectRight",
    "SelectSkipLeft",
    "SelectSkipRight",
    "SelectHome",
    "SelectEnd",
    "SelectFullHome",
    "SelectFullEnd",

    "SelectAll"
]);

const multiLineOutput = Object.freeze(singleLineOutput
    .concat([
        "CursorDown",
        "CursorUp",
        "CursorPageDown",
        "CursorPageUp",

        "SelectDown",
        "SelectUp",
        "SelectPageDown",
        "SelectPageUp",

        "ScrollDown",
        "ScrollUp"
    ]));

const input = [
    "Backspace",
    "Delete",
    "DeleteWordLeft",
    "DeleteWordRight",
    "DeleteLine",

    "Undo",
    "Redo",
];

const singleLineInput = Object.freeze(singleLineOutput
    .concat(input));

const multiLineInput = Object.freeze(multiLineOutput
    .concat(input)
    .concat([
        "AppendNewline",
        "PrependNewline"
    ]));

//>>>>>>>>>> PRIVATE STATIC FIELDS >>>>>>>>>>
let elementCounter = 0,
    focusedControl = null,
    hoveredControl = null,
    publicControls = [];

const wheelScrollSpeed = 4,
    vScrollWidth = 2,
    scrollScale = isFirefox ? 3 : 100,
    optionDefaults = Object.freeze({
        readOnly: false,
        multiLine: true,
        wordWrap: true,
        scrollBars: true,
        lineNumbers: true,
        padding: 0,
        fontSize: 16,
        language: "JavaScript",
        scaleFactor: devicePixelRatio
    }),
    controls = [],
    elements = new WeakMap(),
    ready = (document.readyState === "complete"
        ? Promise.resolve("already")
        : new Promise((resolve) => {
            document.addEventListener("readystatechange", (evt) => {
                if (document.readyState === "complete") {
                    resolve("had to wait for it");
                }
            }, false);
        }))
        .then(() => {
            for (let element of document.getElementsByTagName("primrose")) {
                new Primrose({
                    element
                });
            }
        });

//<<<<<<<<<< PRIVATE STATIC FIELDS <<<<<<<<<<

class Primrose extends EventTarget {
    constructor(options) {
        super();

        const debugEvt = (name, callback, debugLocal) => {
            return (evt) => {
                if ( debugLocal) {
                    console.log(`Primrose #${elementID}`, name, evt);
                }

                if (!!callback) {
                    callback(evt);
                }
            };
        };

        //>>>>>>>>>> VALIDATE PARAMETERS >>>>>>>>>>
        options = options || {};

        if (options.element === undefined) {
            options.element = null;
        }

        if (options.element !== null
            && !(options.element instanceof HTMLElement)) {
            throw new Error("element must be null, an instance of HTMLElement, an instance of HTMLCanvaseElement, or an instance of OffscreenCanvas");
        }

        options = Object.assign({}, optionDefaults, options);
        //<<<<<<<<<< VALIDATE PARAMETERS <<<<<<<<<<


        //>>>>>>>>>> PRIVATE METHODS >>>>>>>>>>
        //>>>>>>>>>> RENDERING >>>>>>>>>>
        let render = () => {
            // do nothing, disabling rendering until the object is fully initialized;
        };

        const fillRect = (gfx, fill, x, y, w, h) => {
            gfx.fillStyle = fill;
            gfx.fillRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const strokeRect = (gfx, stroke, x, y, w, h) => {
            gfx.strokeStyle = stroke;
            gfx.strokeRect(
                x * character.width,
                y * character.height,
                w * character.width + 1,
                h * character.height + 1);
        };

        const renderCanvasBackground = () => {
            const minCursor = Cursor.min(frontCursor, backCursor),
                maxCursor = Cursor.max(frontCursor, backCursor),
                clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

            if (clearFunc === "fillRect") {
                bgfx.fillStyle = theme.regular.backColor;
            }
            bgfx[clearFunc](0, 0, canv.width, canv.height);
            bgfx.save();
            bgfx.scale(scaleFactor, scaleFactor);
            bgfx.translate(
                (gridBounds.x - scroll.x) * character.width + padding,
                -scroll.y * character.height + padding);


            // draw the current row highlighter
            if (focused) {
                fillRect(bgfx, theme.regular.currentRowBackColor ||
                    DefaultTheme.regular.currentRowBackColor,
                    0, minCursor.y,
                    gridBounds.width,
                    maxCursor.y - minCursor.y + 1);
            }

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(textRows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const row = tokenRows[y];
                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x && tokenFront.x <= maxX) {
                        // draw the selection box
                        const inSelection = minCursor.i <= tokenBack.i
                            && tokenFront.i < maxCursor.i;
                        if (inSelection) {
                            const selectionFront = Cursor.max(minCursor, tokenFront),
                                selectionBack = Cursor.min(maxCursor, tokenBack),
                                cw = selectionBack.i - selectionFront.i;
                            fillRect(bgfx, theme.regular.selectedBackColor ||
                                DefaultTheme.regular.selectedBackColor,
                                selectionFront.x, selectionFront.y,
                                cw, 1);
                        }
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            // draw the cursor caret
            if (focused) {
                const cc = theme.cursorColor || DefaultTheme.cursorColor,
                    w = 1 / character.width;
                fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
                fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
            }
            bgfx.restore();
        };

        const renderCanvasForeground = () => {
            fgfx.clearRect(0, 0, canv.width, canv.height);
            fgfx.save();
            fgfx.scale(scaleFactor, scaleFactor);
            fgfx.translate(
                (gridBounds.x - scroll.x) * character.width + padding,
                padding);

            const minY = scroll.y | 0,
                maxY = minY + gridBounds.height,
                minX = scroll.x | 0,
                maxX = minX + gridBounds.width;
            tokenFront.setXY(textRows, 0, minY);
            tokenBack.copy(tokenFront);
            for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                // draw the tokens on this row
                const row = tokenRows[y],
                    textY = (y - scroll.y) * character.height;

                for (let i = 0; i < row.length; ++i) {
                    const t = row[i];
                    tokenBack.x += t.value.length;
                    tokenBack.i += t.value.length;

                    // skip drawing tokens that aren't in view
                    if (minX <= tokenBack.x && tokenFront.x <= maxX) {

                        // draw the text
                        const style = theme[t.type] || {},
                            font = (style.fontWeight || theme.regular.fontWeight || "") +
                                " " + (style.fontStyle || theme.regular.fontStyle || "") +
                                " " + context.font;
                        fgfx.font = font.trim();
                        fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
                        fgfx.fillText(
                            t.value,
                            tokenFront.x * character.width,
                            textY);
                    }

                    tokenFront.copy(tokenBack);
                }

                tokenFront.x = 0;
                ++tokenFront.y;
                tokenBack.copy(tokenFront);
            }

            fgfx.restore();
        };

        const renderCanvasTrim = () => {
            tgfx.clearRect(0, 0, canv.width, canv.height);
            tgfx.save();
            tgfx.scale(scaleFactor, scaleFactor);
            tgfx.translate(padding, padding);

            if (showLineNumbers) {
                fillRect(tgfx,
                    theme.regular.selectedBackColor ||
                    DefaultTheme.regular.selectedBackColor,
                    0, 0,
                    gridBounds.x, this.width - padding * 2);
                strokeRect(tgfx,
                    theme.regular.foreColor ||
                    DefaultTheme.regular.foreColor,
                    0, 0,
                    gridBounds.x, this.height - padding * 2);
            }

            let maxLineWidth = 2;
            tgfx.save();
            {
                tgfx.translate((lineCountWidth - 0.5) * character.width, -scroll.y * character.height);
                let lastLine = -1;
                const minY = scroll.y | 0,
                    maxY = minY + gridBounds.height;
                tokenFront.setXY(textRows, 0, minY);
                tokenBack.copy(tokenFront);
                for (let y = minY; y <= maxY && y < tokenRows.length; ++y) {
                    const row = tokenRows[y];

                    for (let i = 0; i < row.length; ++i) {
                        const t = row[i];
                        tokenBack.x += t.value.length;
                        tokenBack.i += t.value.length;
                    }
                    tokenFront.copy(tokenBack);

                    maxLineWidth = Math.max(maxLineWidth, tokenBack.x - 1);
                    tokenFront.x = 0;
                    ++tokenFront.y;
                    tokenBack.copy(tokenFront);

                    if (showLineNumbers) {
                        // draw the left gutter
                        const currentLine = row.length > 0
                            ? row[0].line
                            : lastLine + 1,
                            lineNumber = currentLine.toString();

                        if (currentLine > lastLine) {
                            lastLine = currentLine;
                            tgfx.font = "bold " + context.font;
                            tgfx.fillStyle = theme.regular.foreColor;
                            tgfx.fillText(
                                lineNumber,
                                0, y * character.height);
                        }
                    }
                }
            }
            tgfx.restore();

            // draw the scrollbars
            if (showScrollBars) {
                const drawWidth = gridBounds.width * character.width - padding,
                    drawHeight = gridBounds.height * character.height,
                    scrollX = (scroll.x * drawWidth) / maxLineWidth + gridBounds.x * character.width,
                    scrollY = (scroll.y * drawHeight) / tokenRows.length;

                tgfx.fillStyle = theme.regular.selectedBackColor ||
                    DefaultTheme.regular.selectedBackColor;
                // horizontal
                let bw = null;
                if (!wordWrap && maxLineWidth > gridBounds.width) {
                    const scrollBarWidth = drawWidth * (gridBounds.width / maxLineWidth),
                        by = gridBounds.height * character.height;
                    bw = Math.max(character.width, scrollBarWidth);
                    tgfx.fillRect(scrollX, by, bw, character.height);
                    tgfx.strokeRect(scrollX, by, bw, character.height);
                }

                //vertical
                if (tokenRows.length > gridBounds.height) {
                    const scrollBarHeight = drawHeight * (gridBounds.height / tokenRows.length),
                        bx = this.width - vScrollWidth * character.width - 2 * padding,
                        bh = Math.max(character.height, scrollBarHeight);
                    bw = vScrollWidth * character.width;
                    tgfx.fillRect(bx, scrollY, bw, bh);
                    tgfx.strokeRect(bx, scrollY, bw, bh);
                }
            }

            tgfx.restore();
            if (!focused) {
                tgfx.fillStyle = theme.regular.unfocused || DefaultTheme.regular.unfocused;
                tgfx.fillRect(0, 0, canv.width, canv.height);
            }
        };

        const doRender = () => {
            if (tokens && theme) {
                const textChanged = lastText !== value,
                    focusChanged = focused !== lastFocused,
                    fontChanged = context.font !== lastFont,
                    paddingChanged = padding !== lastPadding,
                    themeChanged = theme.name !== lastThemeName,
                    boundsChanged = gridBounds.toString() !== lastGridBounds,
                    characterWidthChanged = character.width !== lastCharacterWidth,
                    characterHeightChanged = character.height !== lastCharacterHeight,

                    cursorChanged = frontCursor.i !== lastFrontCursor
                        || backCursor.i !== lastBackCursor,

                    scrollChanged = scroll.x !== lastScrollX
                        || scroll.y !== lastScrollY,

                    layoutChanged = resized
                        || boundsChanged
                        || textChanged
                        || characterWidthChanged
                        || characterHeightChanged
                        || paddingChanged
                        || scrollChanged
                        || themeChanged,

                    backgroundChanged = layoutChanged
                        || cursorChanged,

                    foregroundChanged = layoutChanged
                        || fontChanged,

                    trimChanged = layoutChanged
                        || focusChanged;

                if (backgroundChanged) {
                    renderCanvasBackground();
                }
                if (foregroundChanged) {
                    renderCanvasForeground();
                }
                if (trimChanged) {
                    renderCanvasTrim();
                }

                context.clearRect(0, 0, canv.width, canv.height);
                context.save();
                context.translate(vibX, vibY);
                context.drawImage(bg, 0, 0);
                context.drawImage(fg, 0, 0);
                context.drawImage(tg, 0, 0);
                context.restore();

                lastGridBounds = gridBounds.toString();
                lastText = value;
                lastCharacterWidth = character.width;
                lastCharacterHeight = character.height;
                lastPadding = padding;
                lastFrontCursor = frontCursor.i;
                lastBackCursor = backCursor.i;
                lastFocused = focused;
                lastFont = context.font;
                lastThemeName = theme.name;
                lastScrollX = scroll.x;
                lastScrollY = scroll.y;
                resized = false;
                this.dispatchEvent(updateEvt);
            }
        };
        //<<<<<<<<<< RENDERING <<<<<<<<<<

        const setValue = (txt, setUndo) => {
            txt = txt || "";
            txt = txt.replace(/\r\n/g, "\n");
            if (txt !== value) {
                value = txt;
                if (setUndo) {
                    pushUndo();
                }
                refreshTokens();
                refreshGridBounds();
                this.dispatchEvent(changeEvt);
            }
        };

        const refreshControlType = () => {
            const lastControlType = controlType;

            if (readOnly && multiLine) {
                controlType = multiLineOutput;
            }
            else if (readOnly && !multiLine) {
                controlType = singleLineOutput;
            }
            else if (!readOnly && multiLine) {
                controlType = multiLineInput;
            }
            else {
                controlType = singleLineInput;
            }

            if (controlType !== lastControlType) {
                render();
            }
        };

        const refreshTokens = () => {
            tokens = language.tokenize(value);
        };

        const refreshGutter = () => {
            if (!showScrollBars) {
                bottomRightGutter.set(0, 0);
            }
            else if (wordWrap) {
                bottomRightGutter.set(vScrollWidth, 0);
            }
            else {
                bottomRightGutter.set(vScrollWidth, 1);
            }
        };

        const refreshGridBounds = () => {
            // figure out the width of the line count gutter
            lineCountWidth = 0;
            if (showLineNumbers) {
                const lineCount = value.split(/\n/).length;
                lineCountWidth = Math.max(1, Math.ceil(Math.log(lineCount) / Math.LN10)) + 1;
            }

            // measure the grid
            const x = Math.floor(lineCountWidth + padding / character.width),
                y = Math.floor(padding / character.height),
                w = Math.floor((this.width - 2 * padding) / character.width) - x - bottomRightGutter.width,
                h = Math.floor((this.height - 2 * padding) / character.height) - y - bottomRightGutter.height;
            gridBounds.set(x, y, w, h);

            // group the tokens into rows
            textRows.splice(0);
            textRows.push("");
            tokenRows.splice(0);
            tokenRows.push([]);
            let currentRowWidth = 0;
            const tokenQueue = tokens.slice();
            for (let i = 0; i < tokenQueue.length; ++i) {
                const t = tokenQueue[i].clone(),
                    widthLeft = gridBounds.width - currentRowWidth,
                    wrap = wordWrap && t.type !== "newlines" && t.value.length > widthLeft,
                    breakLine = t.type === "newlines" || wrap;
                if (wrap) {
                    const split = t.value.length > gridBounds.width ? widthLeft : 0;
                    tokenQueue.splice(i + 1, 0, t.splitAt(split));
                }

                const end = tokenRows.length - 1;
                if (t.value.length > 0) {
                    tokenRows[end].push(t);
                    textRows[end] += t.value;
                    currentRowWidth += t.value.length;
                }

                if (breakLine) {
                    textRows[end] = new Line(textRows[end]);
                    textRows.push("");
                    tokenRows.push([]);
                    currentRowWidth = 0;
                }
            }

            textRows[textRows.length - 1] = new Line(textRows[textRows.length - 1]);

            maxVerticalScroll = Math.max(0, tokenRows.length - gridBounds.height);

            render();
        };

        const refreshBuffers = () => {
            resized = true;
            setContextSize(fgfx, canv.width, canv.height);
            setContextSize(bgfx, canv.width, canv.height);
            setContextSize(tgfx, canv.width, canv.height);
            refreshGridBounds();
        };

        const minDelta = (v, minV, maxV) => {
            const dvMinV = v - minV,
                dvMaxV = v - maxV + 5;
            let dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0) {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.abs(dvMinV) < Math.abs(dvMaxV)
                    ? dvMinV
                    : dvMaxV;
            }

            return dv;
        };

        const clampScroll = () => {
            const toHigh = scroll.y < 0 || maxVerticalScroll === 0,
                toLow = scroll.y > maxVerticalScroll;

            if (toHigh) {
                scroll.y = 0;
            }
            else if (toLow) {
                scroll.y = maxVerticalScroll;
            }
            render();

            return toHigh || toLow;
        };

        const scrollIntoView = (currentCursor) => {
            const dx = minDelta(currentCursor.x, scroll.x, scroll.x + gridBounds.width),
                dy = minDelta(currentCursor.y, scroll.y, scroll.y + gridBounds.height);
            this.scrollBy(dx, dy);
        };

        const pushUndo = () => {
            if (historyIndex < history.length - 1) {
                history.splice(historyIndex + 1);
            }
            history.push({
                value,
                frontCursor: frontCursor.i,
                backCursor: backCursor.i
            });
            historyIndex = history.length - 1;
        };

        const moveInHistory = (dh) => {
            const nextHistoryIndex = historyIndex + dh;
            if (0 <= nextHistoryIndex && nextHistoryIndex < history.length) {
                const curFrame = history[historyIndex];
                historyIndex = nextHistoryIndex;
                const nextFrame = history[historyIndex];
                setValue(nextFrame.value, false);
                frontCursor.setI(textRows, curFrame.frontCursor);
                backCursor.setI(textRows, curFrame.backCursor);
            }
        };
        //<<<<<<<<<< PRIVATE METHODS <<<<<<<<<<


        //>>>>>>>>>> PUBLIC METHODS >>>>>>>>>>

        /// <summary>
        /// Removes focus from the control.
        /// </summary>
        this.blur = () => {
            if (focused) {
                focused = false;
                this.dispatchEvent(blurEvt);
                render();
            }
        };

        /// <summary>
        /// Sets the control to be the focused control. If all controls in the app have been properly registered with the Event Manager, then any other, currently focused control will first get `blur`red.
        /// </summary>
        this.focus = () => {
            if (!focused) {
                focused = true;
                this.dispatchEvent(focusEvt);
                render();
            }
        };

        /// <summary>
        /// </summary>
        this.resize = () => {
            if (!this.isInDocument) {
                console.warn("Can't automatically resize a canvas that is not in the DOM tree");
            }
            else if (resizeContext(context, scaleFactor)) {
                refreshBuffers();
            }
        };

        /// <summary>
        /// Sets the scale-independent width and height of the editor control.
        /// </summary>
        this.setSize = (w, h) => {
            if (setContextSize(context, w, h, scaleFactor)) {
                refreshBuffers();
            }
        };

        /// <summary>
        /// Move the scroll window to a new location. Values get clamped to the text contents of the editor.
        /// </summary>
        this.scrollTo = (x, y) => {
            if (!wordWrap) {
                scroll.x = x;
            }
            scroll.y = y;
            return clampScroll();
        };

        /// <summary>
        /// Move the scroll window by a given amount to a new location. The final location of the scroll window gets clamped to the text contents of the editor.
        /// </summary>
        this.scrollBy = (dx, dy) => {
            return this.scrollTo(scroll.x + dx, scroll.y + dy);
        };
        //<<<<<<<<<< PUBLIC METHODS <<<<<<<<<<


        //>>>>>>>>>> KEY EVENT HANDLERS >>>>>>>>>>
        const keyDownCommands = Object.freeze(new Map([
            ["CursorUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.up(textRows);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.down(textRows);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.left(textRows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.right(textRows);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageUp", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                minCursor.incY(textRows, -gridBounds.height);
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorPageDown", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                maxCursor.incY(textRows, gridBounds.height);
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipLeft", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    minCursor.skipLeft(textRows);
                }
                maxCursor.copy(minCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorSkipRight", () => {
                const minCursor = Cursor.min(frontCursor, backCursor),
                    maxCursor = Cursor.max(frontCursor, backCursor);
                if (minCursor.i === maxCursor.i) {
                    maxCursor.skipRight(textRows);
                }
                minCursor.copy(maxCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorHome", () => {
                frontCursor.home();
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorEnd", () => {
                frontCursor.end(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullHome", () => {
                frontCursor.fullHome(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["CursorFullEnd", () => {
                frontCursor.fullEnd(textRows);
                backCursor.copy(frontCursor);
                scrollIntoView(frontCursor);
            }],

            ["SelectDown", () => {
                backCursor.down(textRows);
                scrollIntoView(frontCursor);
            }],

            ["SelectLeft", () => {
                backCursor.left(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectRight", () => {
                backCursor.right(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectUp", () => {
                backCursor.up(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectPageDown", () => {
                backCursor.incY(textRows, gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectPageUp", () => {
                backCursor.incY(textRows, -gridBounds.height);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipLeft", () => {
                backCursor.skipLeft(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectSkipRight", () => {
                backCursor.skipRight(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectHome", () => {
                backCursor.home();
                scrollIntoView(backCursor);
            }],

            ["SelectEnd", () => {
                backCursor.end(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectFullHome", () => {
                backCursor.fullHome(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectFullEnd", () => {
                backCursor.fullEnd(textRows);
                scrollIntoView(backCursor);
            }],

            ["SelectAll", () => {
                frontCursor.fullHome();
                backCursor.fullEnd(textRows);
                render();
            }],

            ["ScrollDown", () => {
                if (scroll.y < textRows.length - gridBounds.height) {
                    this.scrollBy(0, 1);
                }
            }],

            ["ScrollUp", () => {
                if (scroll.y > 0) {
                    this.scrollBy(0, -1);
                }
            }],

            ["DeleteLetterLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.left(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteLetterRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.right(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteWordLeft", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.skipLeft(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteWordRight", () => {
                if (frontCursor.i === backCursor.i) {
                    backCursor.skipRight(textRows);
                }
                this.selectedText = "";
            }],

            ["DeleteLine", () => {
                if (frontCursor.i === backCursor.i) {
                    frontCursor.home();
                    backCursor.end(textRows);
                    backCursor.right(textRows);
                }
                this.selectedText = "";
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }],

            ["Redo", () => {
                moveInHistory(1);
            }],

            ["InsertTab", () => {
                tabPressed = true;
                this.selectedText = tabString;
                frontCursor.incX(textRows, tabString.length);
                backCursor.copy(frontCursor);
            }],

            ["RemoveTab", () => {
                const line = textRows[frontCursor.y],
                    toDelete = Math.min(frontCursor.x, tabWidth);
                for (let i = 0; i < frontCursor.x; ++i) {
                    if (line[i] !== ' ') {
                        // can only remove tabs at the beginning of a line
                        return;
                    }
                }

                frontCursor.incX(textRows, -toDelete);
                this.selectedText = "";
                frontCursor.left(textRows);
                frontCursor.right(textRows);
            }]
        ]));

        this.readKeyDownEvent = debugEvt("keydown", (evt) => {
            const command = os.makeCommand(evt);
            if (keyDownCommands.has(command.command)) {
                evt.preventDefault();
                keyDownCommands.get(command.command)(evt);
            }
        });


        const keyPressCommands = Object.freeze(new Map([
            ["AppendNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const tokenRow = tokenRows[frontCursor.y];
                    if (tokenRow.length > 0
                        && tokenRow[0].type === "whitespace") {
                        indent = tokenRow[0].value;
                    }
                    this.selectedText = "\n" + indent;
                    frontCursor.incX(textRows, indent.length + 1);
                    backCursor.copy(frontCursor);
                    render();
                }
                else {
                    this.dispatchEvent(changeEvt);
                }
            }],

            ["PrependNewline", () => {
                if (multiLine) {
                    let indent = "";
                    const tokenRow = tokenRows[frontCursor.y];
                    if (tokenRow.length > 0
                        && tokenRow[0].type === "whitespace") {
                        indent = tokenRow[0].value;
                    }
                    frontCursor.home();
                    backCursor.copy(frontCursor);
                    this.selectedText = indent + "\n";
                    frontCursor.incX(textRows, indent.length);
                    backCursor.copy(frontCursor);
                    render();
                }
                else {
                    this.dispatchEvent(changeEvt);
                }
            }],

            ["Undo", () => {
                moveInHistory(-1);
            }]
        ]));
        
        this.readKeyPressEvent = debugEvt("keypress", (evt) => {
            const command = os.makeCommand(evt);
            if (!this.readOnly) {
                evt.preventDefault();

                if (keyPressCommands.has(command.command)) {
                    keyPressCommands.get(command.command)();
                }
                else if (command.type === "printable"
                    || command.type === "whitespace") {
                    this.selectedText = command.text;
                    frontCursor.right(textRows);
                    backCursor.copy(frontCursor);
                }

                clampScroll();
                render();
            }
        });

        this.readKeyUpEvent = debugEvt("keyup");
        //<<<<<<<<<< KEY EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> CLIPBOARD EVENT HANDLERS >>>>>>>>>>
        const copySelectedText = (evt) => {
            if (focused && frontCursor.i !== backCursor.i) {
                const clipboard = evt.clipboardData || window.clipboardData;
                clipboard.setData(
                    window.clipboardData ? "Text" : "text/plain", this.selectedText);
                evt.returnValue = false;
                return true;
            }

            return false;
        };

        this.readCopyEvent = debugEvt("copy", (evt) => {
            copySelectedText(evt);
        });

        this.readCutEvent = debugEvt("cut", (evt) => {
            if (copySelectedText(evt)
                && !this.readOnly) {
                this.selectedText = "";
            }
        });

        this.readPasteEvent = debugEvt("paste", (evt) => {
            if (focused && !this.readOnly) {
                evt.returnValue = false;
                const clipboard = evt.clipboardData || window.clipboardData,
                    str = clipboard.getData(window.clipboardData ? "Text" : "text/plain");
                if (str) {
                    this.selectedText = str;
                    frontCursor.incX(str.length);
                    backCursor.copy(frontCursor);
                }
            }
        });
        //<<<<<<<<<< CLIPBOARD EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> POINTER EVENT HANDLERS >>>>>>>>>>
        const pointerOver = () => {
            hovered = true;
            this.dispatchEvent(overEvt);
        };

        const pointerOut = () => {
            hovered = false;
            this.dispatchEvent(outEvt);
        };

        const pointerDown = () => {
            this.focus();
            pressed = true;
        };

        const startSelecting = () => {
            dragging = true;
            moveCursor(frontCursor);
        };

        const pointerMove = () => {
            if (dragging) {
                moveCursor(backCursor);
            }
            else if (pressed) {
                dragScroll();
            }
        };

        const moveCursor = (cursor) => {
            pointer.toCell(character, scroll, gridBounds);
            const gx = pointer.x - scroll.x,
                gy = pointer.y - scroll.y,
                onBottom = gy >= gridBounds.height,
                onLeft = gx < 0,
                onRight = pointer.x >= gridBounds.width;

            if (!scrolling && !onBottom && !onLeft && !onRight) {
                cursor.setXY(textRows, pointer.x, pointer.y);
                backCursor.copy(cursor);
            }
            else if (scrolling || onRight && !onBottom) {
                scrolling = true;
                const scrollHeight = textRows.length - gridBounds.height;
                if (gy >= 0 && scrollHeight >= 0) {
                    const sy = gy * scrollHeight / gridBounds.height;
                    this.scrollTo(scroll.x, sy);
                }
            }
            else if (onBottom && !onLeft) {
                let maxWidth = 0;
                for (let dy = 0; dy < textRows.length; ++dy) {
                    maxWidth = Math.max(maxWidth, textRows[dy].length);
                }
                const scrollWidth = maxWidth - gridBounds.width;
                if (gx >= 0 && scrollWidth >= 0) {
                    const sx = gx * scrollWidth / gridBounds.width;
                    this.scrollTo(sx, scroll.y);
                }
            }

            render();
        };

        let lastScrollDX = null,
            lastScrollDY = null;
        const dragScroll = () => {
            if (lastScrollDX !== null
                && lastScrollDY !== null) {
                let dx = (lastScrollDX - pointer.x) / character.width,
                    dy = (lastScrollDY - pointer.y) / character.height;
                this.scrollBy(dx, dy);
            }
            lastScrollDX = pointer.x;
            lastScrollDY = pointer.y;
        };

        const mouseLikePointerDown = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                pointerDown();
                startSelecting();
            }
        };

        const mouseLikePointerUp = () => {
            pressed = false;
            dragging = false;
            scrolling = false;
        };

        const mouseLikePointerMove = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                pointerMove();
            };
        };

        const touchLikePointerDown = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                tx = pointer.x;
                ty = pointer.y;
                pointerDown();
                longPress.start();
            };
        };

        const touchLikePointerUp = () => {
            if (longPress.cancel() && !dragging) {
                startSelecting();
            }
            mouseLikePointerUp();
            lastScrollDX = null;
            lastScrollDY = null;
        };

        const touchLikePointerMove = (setPointer) => {
            return (evt) => {
                setPointer(evt);
                if (longPress.isRunning) {
                    const dx = pointer.x - tx,
                        dy = pointer.y - ty,
                        lenSq = dx * dx + dy * dy;
                    if (lenSq > 25) {
                        longPress.cancel();
                    }
                }

                if (!longPress.isRunning) {
                    pointerMove();
                }
            };
        };


        //>>>>>>>>>> MOUSE EVENT HANDLERS >>>>>>>>>> 
        const setMousePointer = (evt) => {
            pointer.set(
                evt.offsetX,
                evt.offsetY);
        };
        this.readMouseOverEvent = debugEvt("mouseover", pointerOver);
        this.readMouseOutEvent = debugEvt("mouseout", pointerOut);
        this.readMouseDownEvent = debugEvt("mousedown", mouseLikePointerDown(setMousePointer));
        this.readMouseUpEvent = debugEvt("mouseup", mouseLikePointerUp);
        this.readMouseMoveEvent = debugEvt("mousemove", mouseLikePointerMove(setMousePointer));

        this.readWheelEvent = debugEvt("wheel", (evt) => {
            if (hovered || focused) {
                if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.shiftKey
                    && !evt.metaKey) {
                    const dy = Math.floor(evt.deltaY * wheelScrollSpeed / scrollScale);
                    if (!this.scrollBy(0, dy) || focused) {
                        evt.preventDefault();
                    }
                }
                else if (!evt.ctrlKey
                    && !evt.altKey
                    && !evt.metaKey) {
                    evt.preventDefault();
                    this.fontSize += -evt.deltaY / scrollScale;
                }
                render();
            }
        });
        //<<<<<<<<<< MOUSE EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> TOUCH EVENT HANDLERS >>>>>>>>>>
        let vibX = 0,
            vibY = 0;

        const longPress = new TimedEvent(1000);

        longPress.addEventListener("tick", () => {
            startSelecting();
            backCursor.copy(frontCursor);
            frontCursor.skipLeft(textRows);
            backCursor.skipRight(textRows);
            render();
            navigator.vibrate(20);
        });

        let tx = 0,
            ty = 0;

        const findTouch = (touches) => {
            for (let touch of touches) {
                {
                    return touch;
                }
            }
            return null;
        };

        const withPrimaryTouch = (callback) => {
            return (evt) => {
                evt.preventDefault();
                callback(findTouch(evt.touches)
                    || findTouch(evt.changedTouches));
            };
        };

        const setTouchPointer = (touch) => {
            const cb = canv.getBoundingClientRect();
            pointer.set(
                touch.clientX - cb.left,
                touch.clientY - cb.top);
        };

        this.readTouchStartEvent = debugEvt("touchstart", withPrimaryTouch(touchLikePointerDown(setTouchPointer)));
        this.readTouchMoveEvent = debugEvt("touchmove", withPrimaryTouch(touchLikePointerMove(setTouchPointer)));
        this.readTouchEndEvent = debugEvt("touchend", withPrimaryTouch(touchLikePointerUp));
        //<<<<<<<<<< TOUCH EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> UV POINTER EVENT HANDLERS >>>>>>>>>>
        const setUVPointer = (evt) => {
            pointer.set(
                evt.uv.x * this.width,
                (1 - evt.uv.y) * this.height);
        };

        this.mouse = Object.freeze({

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the hover gestures.
            // </summary>
            readOverEventUV: debugEvt("mouseuvover", pointerOver),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture.
            // </summary>
            readOutEventUV: debugEvt("mouseuvout", pointerOut),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-down gesture.
            // </summary>
            readDownEventUV: debugEvt("mouseuvdown", mouseLikePointerDown(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for primary-button-up gesture.
            // </summary>
            readUpEventUV: debugEvt("mouseuvup", mouseLikePointerUp),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform mouse-like behavior for move gesture, whether the primary button is pressed or not.
            // </summary>
            readMoveEventUV: debugEvt("mouseuvmove", mouseLikePointerMove(setUVPointer))
        });

        this.touch = Object.freeze({

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOverEventUV, included for completeness.
            // </summary>
            readOverEventUV: debugEvt("touchuvover", pointerOver),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform the end of the hover gesture. This is the same as mouse.readOutEventUV, included for completeness.
            // </summary>
            readOutEventUV: debugEvt("touchuvout", pointerOut),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger touching down gesture.
            // </summary>
            readDownEventUV: debugEvt("touchuvdown", touchLikePointerDown(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger raising up gesture.
            // </summary>
            readMoveEventUV: debugEvt("touchuvmove", touchLikePointerMove(setUVPointer)),

            /// <summary>
            /// Read's a THREE.js Raycast intersection to perform touch-like behavior for the first finger moving gesture.
            // </summary>
            readUpEventUV: debugEvt("touchuvup", touchLikePointerUp)
        });
        //<<<<<<<<<< UV POINTER EVENT HANDLERS <<<<<<<<<<
        //<<<<<<<<<< POINTER EVENT HANDLERS <<<<<<<<<<


        //>>>>>>>>>> PUBLIC PROPERTIES >>>>>>>>>>
        Object.defineProperties(this, {

            /// <summary>
            /// The DOM element that was used to construct the `Primrose` control out of the document tree.If the Control was not constructed from the document tree, this value will be`null`.
            /// </summary>
            element: {
                get: () => element
            },

            /// <summary>
            /// Returns `false` if `element` is null. Returns `true` otherwise.
            /// </summary>
            isInDocument: {
                get: () => !isOffScreen
                    && document.body.contains(canv)
            },

            /// <summary>
            /// The canvas to which the editor is rendering text. If the `options.element` value was set to a canvas, that canvas will be returned. Otherwise, the canvas will be the canvas that Primrose created for the control. If `OffscreenCanvas` is not available, the canvas will be an `HTMLCanvasElement`.
            /// </summary>
            canvas: {
                get: () => canv
            },

            /// <summary>
            /// Returns `true` when the control has a pointer hovering over it.
            /// </summary>
            hovered: {
                get: () => hovered
            },

            /// <summary>
            /// Returns `true` when the control has been selected.Writing to this value will change the focus state of the control.
            /// If the control is already focused and`focused` is set to`true`, or the control is not focused and`focus` is set to`false`, nothing happens.
            /// If the control is focused and`focused` is set to`false`, the control is blurred, just as if `blur()` was called.
            /// If the control is not focused and`focused` is set to`true`, the control is blurred, just as if `focus()` was called.
            /// </summary>
            focused: {
                get: () => focused,
                set: (f) => {
                    if (f !== focused) {
                        if (f) {
                            this.focus();
                        }
                        else {
                            this.blur();
                        }
                    }
                }
            },

            /// <summary>
            /// Indicates whether or not the text in the editor control can be modified.
            /// </summary>
            readOnly: {
                get: () => readOnly,
                set: (r) => {
                    r = !!r;
                    if (r !== readOnly) {
                        readOnly = r;
                        refreshControlType();
                    }
                }
            },

            multiLine: {
                get: () => multiLine,
                set: (m) => {
                    m = !!m;
                    if (m !== multiLine) {
                        if (!m && wordWrap) {
                            this.wordWrap = false;
                        }
                        multiLine = m;
                        refreshControlType();
                        refreshGutter();
                    }
                }
            },

            /// <summary>
            /// Indicates whether or not the text in the editor control will be broken across lines when it reaches the right edge of the editor control.
            /// </summary>
            wordWrap: {
                get: () => wordWrap,
                set: (w) => {
                    w = !!w;
                    if (w !== wordWrap
                        && (multiLine
                            || !w)) {
                        wordWrap = w;
                        refreshGutter();
                        render();
                    }
                }
            },

            /// <summary>
            /// The text value contained in the control. NOTE: if the text value was set with Windows-style newline characters (`\r\n`), the newline characters will be normalized to Unix-style newline characters (`\n`).
            /// </summary>
            value: {
                get: () => value,
                set: (txt) => setValue(txt, true)
            },

            /// <summary>
            /// A synonymn for `value`
            /// </summary>
            text: {
                get: () => value,
                set: (txt) => setValue(txt, true)
            },

            /// <summary>
            /// The range of text that is currently selected by the cursor. If no text is selected, reading `selectedText` returns the empty string (`""`) and writing to it inserts text at the current cursor location. 
            /// If text is selected, reading `selectedText` returns the text between the front and back cursors, writing to it overwrites the selected text, inserting the provided value.
            /// </summary>
            selectedText: {
                get: () => {
                    const minCursor = Cursor.min(frontCursor, backCursor),
                        maxCursor = Cursor.max(frontCursor, backCursor);
                    return value.substring(minCursor.i, maxCursor.i);
                },
                set: (txt) => {
                    txt = txt || "";
                    txt = txt.replace(/\r\n/g, "\n");

                    if (frontCursor.i !== backCursor.i || txt.length > 0) {
                        const minCursor = Cursor.min(frontCursor, backCursor),
                            maxCursor = Cursor.max(frontCursor, backCursor),
                            left = value.substring(0, minCursor.i),
                            right = value.substring(maxCursor.i);
                        setValue(left + txt + right, true);
                        maxCursor.copy(minCursor);
                        render();
                    }
                }
            },

            /// <summary>
            /// The string index at which the front cursor is located. NOTE: the "front cursor" is the main cursor, but does not necessarily represent the beginning of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
            /// </summary>
            selectionStart: {
                get: () => frontCursor.i,
                set: (i) => {
                    i = i | 0;
                    if (i !== frontCursor.i) {
                        frontCursor.setI(textRows, i);
                        render();
                    }
                }
            },

            /// <summary>
            /// The string index at which the back cursor is located. NOTE: the "back cursor" is the selection range cursor, but does not necessarily represent the end of the selction range. The selection range runs from the minimum of front and back cursors, to the maximum.
            /// </summary>
            selectionEnd: {
                get: () => backCursor.i,
                set: (i) => {
                    i = i | 0;
                    if (i !== backCursor.i) {
                        backCursor.setI(textRows, i);
                        render();
                    }
                }
            },

            /// <summary>
            /// If the back cursor is behind the front cursor, this value returns `"backward"`. Otherwise, `"forward"` is returned.
            /// </summary>
            selectionDirection: {
                get: () => frontCursor.i <= backCursor.i
                    ? "forward"
                    : "backward"
            },

            /// <summary>
            /// The number of spaces to insert when the <kbd>Tab</kbd> key is pressed. Changing this value does not convert existing tabs, it only changes future tabs that get inserted.
            /// </summary>
            tabWidth: {
                get: () => tabWidth,
                set: (tw) => {
                    tabWidth = tw || 2;
                    tabString = "";
                    for (let i = 0; i < tabWidth; ++i) {
                        tabString += " ";
                    }
                }
            },

            /// <summary>
            /// A JavaScript object that defines the color and style values for rendering different UI and text elements.
            /// </summary>
            theme: {
                get: () => theme,
                set: (t) => {
                    if (t !== theme) {
                        theme = t;
                        render();
                    }
                }
            },

            /// <summary>
            /// Set or get the language pack used to tokenize the control text for syntax highlighting.
            /// </summary>
            language: {
                get: () => language,
                set: (l) => {
                    if (l !== language) {
                        language = l;
                        refreshTokens();
                        render();
                    }
                }
            },

            /// <summary>
            /// The `Number` of pixels to inset the control rendering from the edge of the canvas. This is useful for texturing objects where the texture edge cannot be precisely controlled. This value is scale-independent.
            /// </summary>
            padding: {
                get: () => padding,
                set: (p) => {
                    p = p | 0;
                    if (p !== padding) {
                        padding = p;
                        render();
                    }
                }
            },

            /// <summary>
            /// Indicates whether or not line numbers should be rendered on the left side of the control.
            /// </summary>
            showLineNumbers: {
                get: () => showLineNumbers,
                set: (s) => {
                    s = s || false;
                    if (s !== showLineNumbers) {
                        showLineNumbers = s;
                        refreshGutter();
                    }
                }
            },

            /// <summary>
            /// Indicates whether or not scroll bars should be rendered at the right and bottom in the control. If wordWrap is enabled, the bottom, horizontal scrollbar will not be rendered.
            /// </summary>
            showScrollBars: {
                get: () => showScrollBars,
                set: (s) => {
                    s = s || false;
                    if (s !== showScrollBars) {
                        showScrollBars = s;
                        refreshGutter();
                    }
                }
            },

            /// <summary>
            /// The `Number` of pixels tall to draw characters. This value is scale-independent.
            /// </summary>
            fontSize: {
                get: () => fontSize,
                set: (s) => {
                    s = Math.max(1, s || 0);
                    if (s !== fontSize) {
                        fontSize = s;
                        context.font = `${fontSize}px ${monospaceFamily}`;
                        character.height = fontSize;
                        // measure 100 letter M's, then divide by 100, to get the width of an M
                        // to two decimal places on systems that return integer values from
                        // measureText.
                        character.width = context.measureText(
                            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
                            .width /
                            100;
                        refreshGridBounds();
                    }
                }
            },

            /// <summary>
            /// The value by which pixel values are scaled before being used by the editor control.
            /// With THREE.js, it's best to set this value to 1 and change the width, height, and fontSize manually.
            /// </summary>
            scaleFactor: {
                get: () => scaleFactor,
                set: (s) => {
                    s = Math.max(0.25, Math.min(4, s || 0));
                    if (s !== scaleFactor) {
                        const lastWidth = this.width,
                            lastHeight = this.height;
                        scaleFactor = s;
                        this.setSize(lastWidth, lastHeight);
                    }
                }
            },

            /// <summary>
            /// The scale-independent width of the editor control.
            /// </summary>
            width: {
                get: () => canv.width / scaleFactor,
                set: (w) => this.setSize(w, this.height)
            },

            /// <summary>
            /// The scale-independent height of the editor control.
            /// </summary>
            height: {
                get: () => canv.height / scaleFactor,
                set: (h) => this.setSize(this.width, h)
            }
        });
        //<<<<<<<<<< PUBLIC PROPERTIES <<<<<<<<<<


        //>>>>>>>>>> PRIVATE MUTABLE FIELDS >>>>>>>>>>
        let value = "",
            padding = 0,
            theme = Dark,
            tabWidth = 2,
            canv = null,
            tokens = [],
            resized = false,
            hovered = false,
            focused = false,
            fontSize = null,
            scaleFactor = 2,
            pressed = false,
            tabString = "  ",
            readOnly = false,
            dragging = false,
            wordWrap = false,
            historyIndex = -1,
            scrolling = false,
            multiLine = false,
            tabPressed = false,
            lineCountWidth = 0,
            isOffScreen = false,
            element = null,
            language = JavaScript,
            showScrollBars = false,
            showLineNumbers = false,
            elementID = ++elementCounter,
            controlType = singleLineOutput,
            maxVerticalScroll = 0,

            lastCharacterHeight = null,
            lastCharacterWidth = null,
            lastFrontCursor = null,
            lastGridBounds = null,
            lastBackCursor = null,
            lastThemeName = null,
            lastPadding = null,
            lastFocused = null,
            lastScrollX = null,
            lastScrollY = null,
            lastFont = null,
            lastText = null;

        const history = [],
            tokenRows = [],
            textRows = [""],
            scroll = new Point(),
            pointer = new Point(),
            character = new Size(),
            bottomRightGutter = new Size(),
            gridBounds = new Rectangle(),
            tokenBack = new Cursor(),
            tokenFront = new Cursor(),
            backCursor = new Cursor(),
            frontCursor = new Cursor(),
            outEvt = new Event("out"),
            overEvt = new Event("over"),
            blurEvt = new Event("blur"),
            focusEvt = new Event("focus"),
            changeEvt = new Event("change"),
            updateEvt = new Event("update"),
            os = isMacOS ? MacOS : Windows;
        //<<<<<<<<<< PRIVATE MUTABLE FIELDS <<<<<<<<<<

        //>>>>>>>>>> SETUP CANVAS >>>>>>>>>>
        let currentValue = "",
            currentTabIndex = -1;

        if (options.element !== null) {
            const elem = options.element,
                width = elem.width,
                height = elem.height;
            currentTabIndex = elem.tabIndex;

            const optionsStr = elem.dataset.options || "",
                entries = optionsStr.trim().split(','),
                optionUser = {};
            for (let entry of entries) {
                entry = entry.trim();
                if (entry.length > 0) {
                    const pairs = entry.split('=');
                    if (pairs.length > 1) {
                        const key = pairs[0].trim(),
                            value = pairs[1].trim(),
                            boolTest = value.toLocaleLowerCase();
                        if (boolTest === "true"
                            || boolTest === "false") {
                            optionUser[key] = boolTest === "true";
                        }
                        else {
                            optionUser[key] = value;
                        }
                    }
                }
            }

            currentValue = elem.textContent;
            options = Object.assign(
                options,
                { width, height },
                optionUser);
        }


        if (options.element === null) {
            canv = offscreenCanvas(options);
            isOffScreen = !(canv instanceof HTMLCanvasElement);
        }
        else if (isCanvas(options.element)) {
            element = canv = options.element;
            canv.innerHTML = "";
        }
        else {
            element = options.element;
            element.innerHTML = "";

            canv = canvas({
                style: {
                    width: "100%",
                    height: "100%"
                }
            });
            element.appendChild(canv);
            element.removeAttribute("tabindex");

            assignAttributes(element, {
                style: {
                    display: "block",
                    padding: "none",
                    border: "2px inset #c0c0c0",
                    overflow: "unset"
                }
            });
        }

        if (canv.parentElement !== null
            && currentTabIndex === -1) {
            const tabbableElements = document.querySelectorAll("[tabindex]");
            for (let tabbableElement of tabbableElements) {
                currentTabIndex = Math.max(currentTabIndex, tabbableElement.tabIndex);
            }
            ++currentTabIndex;
        }

        if (canv instanceof HTMLCanvasElement
            && this.isInDocument) {
            canv.tabIndex = currentTabIndex;
            canv.style.touchAction = "none";
            canv.addEventListener("focus", () => this.focus());
            canv.addEventListener("blur", () => this.blur());

            canv.addEventListener("mouseover", this.readMouseOverEvent);
            canv.addEventListener("mouseout", this.readMouseOutEvent);
            canv.addEventListener("mousedown", this.readMouseDownEvent);
            canv.addEventListener("mouseup", this.readMouseUpEvent);
            canv.addEventListener("mousemove", this.readMouseMoveEvent);

            canv.addEventListener("touchstart", this.readTouchStartEvent);
            canv.addEventListener("touchend", this.readTouchEndEvent);
            canv.addEventListener("touchmove", this.readTouchMoveEvent);
        }
        //<<<<<<<<<< SETUP CANVAS <<<<<<<<<<

        //>>>>>>>>>> SETUP BUFFERS >>>>>>>>>>
        const context = canv.getContext("2d"),
            fg = offscreenCanvas(),
            fgfx = fg.getContext("2d"),
            bg = offscreenCanvas(),
            bgfx = bg.getContext("2d"),
            tg = offscreenCanvas(),
            tgfx = tg.getContext("2d");

        context.imageSmoothingEnabled
            = fgfx.imageSmoothingEnabled
            = bgfx.imageSmoothingEnabled
            = tgfx.imageSmoothingEnabled
            = true;
        context.textBaseline
            = fgfx.textBaseline
            = bgfx.textBaseline
            = tgfx.textBaseline
            = "top";

        tgfx.textAlign = "right";
        fgfx.textAlign = "left";
        //<<<<<<<<<< SETUP BUFFERS <<<<<<<<<<

        //>>>>>>>>>> INITIALIZE STATE >>>>>>>>>>
        this.addEventListener("blur", () => {
            if (tabPressed) {
                tabPressed = false;
                this.focus();
            }
        });

        options.language = options.language.toLocaleLowerCase();
        if (grammars.has(options.language)) {
            options.language = grammars.get(options.language);
        }
        else {
            options.language = null;
        }
        Object.freeze(options);

        Object.seal(this);
        this.readOnly = options.readOnly;
        this.multiLine = options.multiLine;
        this.wordWrap = options.wordWrap;
        this.showScrollBars = options.scrollBars;
        this.showLineNumbers = options.lineNumbers;
        this.padding = options.padding;
        this.fontSize = options.fontSize;
        this.language = options.language;
        this.scaleFactor = options.scaleFactor;
        this.value = currentValue;
        //<<<<<<<<<< INITIALIZE STATE <<<<<<<<<<

        render = () => {
            requestAnimationFrame(doRender);
        };
        doRender();

        // This is done last so that controls that have errored 
        // out during their setup don't get added to the control
        // manager.
        Primrose.add(element, this);
    }
}

/// <summary>
/// Registers a new Primrose editor control with the Event Manager, to wire-up key, clipboard, and mouse wheel events, and to manage the currently focused element.
/// The Event Manager maintains the references in a WeakMap, so when the JS Garbage Collector collects the objects, they will be gone.
/// Multiple objects may be used to register a single control with the Event Manager without causing issue.This is useful for associating the control with closed objects from other systems, such as Three.js Mesh objects being targeted for pointer picking.
/// If you are working with Three.js, it's recommended to use the Mesh on which you are texturing the canvas as the key when adding the editor to the Event Manager.
/// </summary>
Primrose.add = (key, control) => {
    if (key !== null) {
        elements.set(key, control);
    }

    if (controls.indexOf(control) === -1) {
        controls.push(control);
        publicControls = Object.freeze(controls.slice());

        control.addEventListener("blur", () => {
            focusedControl = null;
        });

        control.addEventListener("focus", () => {
            // make sure the previous control knows it has 
            // gotten unselected.
            if (focusedControl !== null
                && (!focusedControl.isInDocument
                    || !control.isInDocument)) {
                focusedControl.blur();
            }
            focusedControl = control;
        });

        control.addEventListener("over", () => {
            hoveredControl = control;
        });

        control.addEventListener("out", () => {
            hoveredControl = null;
        });
    }
};

/// <summary>
/// Checks for the existence of a control, by the key that the user supplied when calling `Primrose.add()`
/// </summary>
Primrose.has = (key) => {
    return elements.has(key);
};

/// <summary>
/// Gets the control associated with the given key.
/// </summary>
Primrose.get = (key) => {
    return elements.has(key)
        ? elements.get(key)
        : null;
};

Object.defineProperties(Primrose, {

    /// <summary>
    /// The current `Primrose` control that has the mouse hovered over it. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is hovered, this returns `null`.
    /// </summary>
    hoveredControl: {
        get: () => hoveredControl
    },

    /// <summary>
    /// The current `Primrose` control that has pointer-focus. It will receive all keyboard and clipboard events. In 2D contexts, you probably don't need to check this value, but in WebGL contexts, this is useful for helping Primrose manage events.
    /// If no control is focused, this returns `null`.
    /// </summary>
    focusedControl: {
        get: () => focusedControl
    },

    /// <summary>
    /// An array of all of the `Primrose` editor controls that Primrose currently knows about.
    /// This array is not mutable and is not the array used by the Event Manager. It is a read-only clone that is created whenever the Event Manager registers or removes a new control
    /// </summary.
    editors: {
        get: () => publicControls
    },

    /// <summary>
    /// A `Promise` that resolves when the document is ready and the Event Manager has finished its initial setup.
    /// </summary>
    ready: {
        get: () => ready
    }
});

Object.freeze(Primrose);

requestAnimationFrame(function update() {
    requestAnimationFrame(update);
    for (let i = controls.length - 1; i >= 0; --i) {
        const control = controls[i];
        if (control.isInDocument) {
            if (elements.has(control.element)) {
                control.resize();
            }
            else {
                controls.splice(i, 1);
                publicControls = Object.freeze(controls.slice());
            }
        }
    }
});

const withCurrentControl = (name) => {
    const evtName = name.toLocaleLowerCase(),
        funcName = `read${name}Event`;

    window.addEventListener(evtName, (evt) => {
        if (focusedControl !== null) {
            focusedControl[funcName](evt);
        }
    }, { passive: false });
};

withCurrentControl("KeyDown");
withCurrentControl("KeyPress");
withCurrentControl("KeyUp");
withCurrentControl("Copy");
withCurrentControl("Cut");
withCurrentControl("Paste");

window.addEventListener("wheel", (evt) => {
    const control = focusedControl || hoveredControl;
    if (control !== null) {
        control.readWheelEvent(evt);
    }
}, { passive: false });

export { Basic, Dark, Grammar, HTML, JavaScript, Light, PlainText, Primrose, grammars, themes };
