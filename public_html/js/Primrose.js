function Primrose(canvasID, options) {
    options = options || {};

    var languageGrammar = options.languageGrammar || Grammar.JavaScript;
    this.setLanguageGrammar = function (lang) {
        languageGrammar = lang;
    };

    var codePage = options.codePage || CodePages.EN_US;
    this.setCodePage = function (cp) {
        codePage = cp;
    };

    var history = [(options.file || "").split("\n")];
    this.getLines = function () {
        return history[history.length - 1].slice();
    };

    this.pushUndo = function (lines) {
        history.push(lines);
    };

    this.popUndo = function () {
        if (history.length > 1) {
            return history.pop();
        }
    };

    this.frontCursor = new Cursor();
    this.backCursor = new Cursor();
    this.bothCursors = new CombinedCursor(this.frontCursor, this.backCursor);

    var canvas = cascadeElement(canvasID, "canvas", HTMLCanvasElement);
    var gfx = canvas.getContext("2d");
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    var dragging = false;
    this.pageSize = options.pageSize || 5;
    this.tabWidth = options.tabWidth || 4;
    this.tabString = "";
    for (var i = 0; i < this.tabWidth; ++i) {
        this.tabString += " ";
    }

    var keyEventSource = options.keyEventSource || window;
    var clipboardEventSource = options.clipboardEventSource || window;
    var mouseEventSource = options.mouseEventSource || canvas;

    this.editText = function (evt) {
        evt = evt || event;
        var key = evt.keyCode;
        // don't do anything about the actual press of SHIFT, CTRL, or ALT
        if (key !== Keys.SHIFT && key !== Keys.CTRL && key !== Keys.ALT) {
            var type = ((evt.ctrlKey && "CTRL" || "")
                    + (evt.altKey && "ALT" || "")
                    + (evt.shiftKey && "SHIFT" || "")) || "NORMAL";
            var codeCommand = type + key;
            var charCommand = type + "+" + codePage.SHIFT[key];
            var func = Commands[codeCommand] || Commands[charCommand];
            if (func) {
                func.call(this, this.getLines());
                evt.preventDefault();
            }
            else if (codePage[type]) {
                var char = codePage[type][key];
                if (char) {
                    this.insertAtCursor(char);
                    if (key === Keys.SPACEBAR) {
                        evt.preventDefault();
                    }
                }
            }
            else {
                // what just happened?
                console.log(type, key);
            }
        }
        this.drawText();
    };

    function readClipboard(evt) {
        var i = evt.clipboardData.types.indexOf("text/plain");
        if (i < 0) {
            for (i = 0; i < evt.clipboardData.types.length; ++i) {
                if (/^text/.test(evt.clipboardData.types[i])) {
                    break;
                }
            }
        }
        if (i >= 0) {
            var type = evt.clipboardData.types[i];
            var str = evt.clipboardData.getData(type);
            evt.preventDefault();
            this.pasteAtCursor(str);
        }
    }

    this.drawText = function () {
        var lines = this.getLines();
        var text = lines.join("\n");
        var tokens = languageGrammar.tokenize(text);
        var clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";
        if (theme.regular.backColor) {
            gfx.fillStyle = theme.regular.backColor;
        }
        gfx[clearFunc](0, 0, gfx.canvas.width, gfx.canvas.height);
        var c = new Cursor(), d = new Cursor();
        for (var i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            if (t.type === "newlines") {
                c.x = 0;
                ++c.y;
                ++c.i;
            }
            else if (t.value.length > 0) {
                var a = this.getMinCursor();
                var b = this.getMaxCursor();
                d.copy(c);
                d.x += t.value.length;
                d.i += t.value.length;
                if (a.i <= d.i && c.i < b.i) {
                    var e = a, f = b;
                    if (c.i > a.i) {
                        e = c;
                    }
                    if (d.i < b.i) {
                        f = d;
                    }
                    var cw = f.i - e.i;
                    gfx.fillStyle = theme.regular.selectedBackColor
                            || Themes.DEFAULT.regular.selectedBackColor;
                    gfx.fillRect(
                            e.x * this.characterWidth, (e.y + 0.25) * this.characterHeight,
                            cw * this.characterWidth, this.characterHeight
                            );
                }
                var style = theme[t.type] || {};
                var font = (style.fontWeight || theme.regular.fontWeight || "")
                        + " " + (style.fontStyle || theme.regular.fontStyle || "")
                        + " " + this.characterHeight + "px " + theme.fontFamily;
                gfx.font = font.trim();
                gfx.fillStyle = style.foreColor || theme.regular.foreColor;
                gfx.fillText(t.value, c.x * this.characterWidth, (c.y + 1) * this.characterHeight);
                c.copy(d);
            }
        }

        gfx.beginPath();
        gfx.strokeStyle = "black";
        gfx.moveTo(this.frontCursor.x * this.characterWidth, this.frontCursor.y * this.characterHeight);
        gfx.lineTo(this.frontCursor.x * this.characterWidth, (this.frontCursor.y + 1.25) * this.characterHeight);
        gfx.moveTo(this.backCursor.x * this.characterWidth + 1, this.backCursor.y * this.characterHeight);
        gfx.lineTo(this.backCursor.x * this.characterWidth + 1, (this.backCursor.y + 1.25) * this.characterHeight);
        gfx.stroke();
    };

    var gridWidth, gridHeight;
    function measureText() {
        var r = this.getPixelRatio();
        this.characterHeight = fontSize * r;
        var w = canvas.style.width;
        var h = canvas.style.height;
        w = parseFloat(w.substring(0, w.length - 2));
        h = parseFloat(h.substring(0, h.length - 2));
        canvas.width = w * r;
        canvas.height = h * r;
        gfx.font = this.characterHeight + "px " + theme.fontFamily;
        this.characterWidth = gfx.measureText("M").width;
        gridWidth = Math.floor(canvas.width / this.characterWidth);
        gridHeight = Math.floor(canvas.height / this.characterHeight);
        this.drawText();
    }

    var fontSize = options.fontSize || 14;
    this.setFontSize = function (sz) {
        fontSize = sz;
        measureText.call(this);
    };

    this.increaseFontSize = function () {
        ++fontSize;
        measureText.call(this);
    };

    this.decreaseFontSize = function () {
        if (fontSize > 1) {
            --fontSize;
            measureText.call(this);
        }
    };

    var theme = null;
    this.setTheme = function (t) {
        theme = t;
        measureText.call(this);
    };
    this.setTheme(options.theme || Themes.DEFAULT);

    keyEventSource.addEventListener("keydown", this.editText.bind(this));

    clipboardEventSource.addEventListener("copy", this.copySelectedText.bind(this));
    clipboardEventSource.addEventListener("cut", this.cutSelectedText.bind(this));
    clipboardEventSource.addEventListener("paste", readClipboard.bind(this));

    mouseEventSource.addEventListener("mousedown", function (evt) {
        var lines = this.getLines();
        var cell = this.pixel2cell(evt.layerX, evt.layerY);
        this.bothCursors.setXY(cell.x, cell.y, lines);
        this.drawText();
        dragging = true;
    }.bind(this));

    mouseEventSource.addEventListener("mouseup", function () {
        dragging = false;
    });

    mouseEventSource.addEventListener("mousemove", function (evt) {
        if (dragging) {
            var lines = this.getLines();
            var cell = this.pixel2cell(evt.layerX, evt.layerY);
            this.backCursor.setXY(cell.x, cell.y, lines);
            this.drawText();
        }
    }.bind(this));
}

Primrose.prototype.pixel2cell = function (x, y) {
    var r = this.getPixelRatio();
    x = Math.floor(x * r / this.characterWidth);
    y = Math.floor((y * r / this.characterHeight) - 0.25);
    return {x: x, y: y};
};

Primrose.prototype.cell2i = function (x, y) {
    var lines = this.getLines();
    var i = 0;
    for (var dy = 0; dy < y; ++dy) {
        i += lines[dy].length + 1;
    }
    i += x;
    return i;
};

Primrose.prototype.i2cell = function (i) {
    var lines = this.getLines();
    for (var y = 0; y < lines.length; ++y) {
        if (i <= lines.length) {
            return {x: i, y: y};
        }
        else {
            i -= lines.length - 1;
        }
    }
};

Primrose.prototype.getPixelRatio = function () {
    return window.devicePixelRatio || 1;
};

Primrose.prototype.insertAtCursor = function (str) {
    if (str.length > 0) {
        this.deleteSelection();
        var lines = this.getLines();
        var parts = str.split("\n");
        parts[0] = lines[this.frontCursor.y].substring(0, this.frontCursor.x) + parts[0];
        parts[parts.length - 1] += lines[this.frontCursor.y].substring(this.frontCursor.x);
        lines.splice.bind(lines, this.frontCursor.y, 1).apply(lines, parts);
        for (var i = 0; i < str.length; ++i) {
            this.frontCursor.right(lines);
        }
        this.backCursor.copy(this.frontCursor);
        this.pushUndo(lines);
    }
};

Primrose.prototype.getMinCursor = function () {
    return this.frontCursor.i <= this.backCursor.i ? this.frontCursor : this.backCursor;
};

Primrose.prototype.getMaxCursor = function () {
    return this.frontCursor.i > this.backCursor.i ? this.frontCursor : this.backCursor;
};

Primrose.prototype.export = function () {
    return this.getLines().map(function (m) {
        return "\"" + m.replace(/"/g, "\\\"") + "\\n\"";
    }).join("\n+ ");
};

Primrose.prototype.copySelectedText = function (evt) {
    if (this.frontCursor.i !== this.backCursor.i) {
        var a = this.getMinCursor();
        var b = this.getMaxCursor();
        var lines = this.getLines();
        var text = lines.join("\n");
        var str = text.substring(a.i, b.i);
        evt.clipboardData.setData("text/plain", str);
    }
    evt.preventDefault();
};

Primrose.prototype.cutSelectedText = function (evt) {
    this.copySelectedText(evt);
    this.deleteSelection();
    this.drawText();
};

Primrose.prototype.pasteAtCursor = function (str) {
    this.deleteSelection();
    var lines = this.getLines();
    var text = lines.join("\n");
    var a = this.getMinCursor();
    var left = text.substring(0, a.i);
    var right = text.substring(a.i);
    text = left + str + right;
    lines = text.split("\n");
    this.pushUndo(lines);
    for (var i = 0; i < str.length; ++i) {
        this.frontCursor.right(lines);
    }
    this.backCursor.copy(this.frontCursor);
    this.drawText();
};

Primrose.prototype.deleteSelection = function () {
    if (this.frontCursor.i !== this.backCursor.i) {
        var a = this.getMinCursor();
        var b = this.getMaxCursor();
        var lines = this.getLines();
        // TODO: don't rejoin the string first.
        var text = lines.join("\n");
        var left = text.substring(0, a.i);
        var right = text.substring(b.i);
        text = left + right;
        lines = text.split("\n");
        this.pushUndo(lines);
        b.copy(a);
    }
};