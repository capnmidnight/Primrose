function Primrose(canvas, options) {
    options = options || {};

    this.syntaxRules = options.syntaxRules || Grammar.JavaScript;

    this.theme = options.theme || Themes.DEFAULT;
    this.codePage = options.codePage || CodePages.EN_US;
    this.history = [(options.file || "").split("\n")];
    this.start = new Cursor();
    this.finish = new Cursor();
    this.both = new CombinedCursor(this.start, this.finish);

    var graphics = canvas.getContext("2d");
    var PIX_RATIO = window.devicePixelRatio || 1;
    var CHAR_HEIGHT = 20 * PIX_RATIO;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
    canvas.width = canvas.width * PIX_RATIO;
    canvas.height = canvas.height * PIX_RATIO;
    graphics.font = CHAR_HEIGHT + "px " + this.theme.fontFamily;
    var CHAR_WIDTH = graphics.measureText("M").width;
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
            var charCommand = type + "+" + this.codePage.SHIFT[key];
            var func = Commands[codeCommand] || Commands[charCommand];
            if (func) {
                func.call(this, this.getLines());
                evt.preventDefault();
            }
            else if (this.codePage[type]) {
                var char = this.codePage[type][key];
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

    function pixel2cell(x, y) {
        x = Math.floor(x * PIX_RATIO / CHAR_WIDTH);
        y = Math.floor((y * PIX_RATIO / CHAR_HEIGHT) - 0.25);
        return {x: x, y: y};
    }

    this.drawText = function () {
        var lines = this.getLines();
        var text = lines.join("\n");
        var tokens = this.syntaxRules.tokenize(text);
        var clearFunc = this.theme.regular.backColor ? "fillRect" : "clearRect";
        graphics[clearFunc](0, 0, graphics.canvas.width, graphics.canvas.height);
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
                    graphics.fillStyle = this.theme.regular.selectedBackColor
                            || Themes.DEFAULT.regular.selectedBackColor;
                    graphics.fillRect(
                            e.x * CHAR_WIDTH, (e.y + 0.25) * CHAR_HEIGHT,
                            cw * CHAR_WIDTH, CHAR_HEIGHT
                            );
                }
                var style = this.theme[t.type] || {};
                var font = (style.fontWeight || this.theme.regular.fontWeight || "")
                        + " " + (style.fontStyle || this.theme.regular.fontStyle || "")
                        + " " + CHAR_HEIGHT + "px " + this.theme.fontFamily;
                graphics.font = font.trim();
                graphics.fillStyle = style.foreColor || this.theme.regular.foreColor;
                graphics.fillText(t.value, c.x * CHAR_WIDTH, (c.y + 1) * CHAR_HEIGHT);
                c.copy(d);
            }
        }

        graphics.beginPath();
        graphics.strokeStyle = "black";
        graphics.moveTo(this.start.x * CHAR_WIDTH, this.start.y * CHAR_HEIGHT);
        graphics.lineTo(this.start.x * CHAR_WIDTH, (this.start.y + 1.25) * CHAR_HEIGHT);
        graphics.moveTo(this.finish.x * CHAR_WIDTH + 1, this.finish.y * CHAR_HEIGHT);
        graphics.lineTo(this.finish.x * CHAR_WIDTH + 1, (this.finish.y + 1.25) * CHAR_HEIGHT);
        graphics.stroke();
    };

    keyEventSource.addEventListener("keydown", this.editText.bind(this));

    clipboardEventSource.addEventListener("copy", this.copySelectedText.bind(this));
    clipboardEventSource.addEventListener("cut", this.cutSelectedText.bind(this));
    clipboardEventSource.addEventListener("paste", readClipboard.bind(this));

    mouseEventSource.addEventListener("mousedown", function (evt) {
        var lines = this.history[this.history.length - 1];
        var cell = pixel2cell(evt.layerX, evt.layerY);
        this.both.setXY(cell.x, cell.y, lines);
        this.drawText();
        dragging = true;
    }.bind(this));

    mouseEventSource.addEventListener("mouseup", function (evt) {
        dragging = false;
    });

    mouseEventSource.addEventListener("mousemove", function (evt) {
        if (dragging) {
            var lines = this.history[this.history.length - 1];
            var cell = pixel2cell(evt.layerX, evt.layerY);
            this.finish.setXY(cell.x, cell.y, lines);
            this.drawText();
        }
    }.bind(this));
}

Primrose.prototype.insertAtCursor = function (str) {
    if (str.length > 0) {
        this.deleteSelection();
        var lines = this.getLines();
        var parts = str.split("\n");
        parts[0] = lines[this.start.y].substring(0, this.start.x) + parts[0];
        parts[parts.length - 1] += lines[this.start.y].substring(this.start.x);
        lines.splice.bind(lines, this.start.y, 1).apply(lines, parts);
        for (var i = 0; i < str.length; ++i) {
            this.start.right(lines);
        }
        this.finish.copy(this.start);
        this.pushUndo(lines);
    }
};

Primrose.prototype.getMinCursor = function () {
    return this.start.i <= this.finish.i ? this.start : this.finish;
};

Primrose.prototype.getMaxCursor = function () {
    return this.start.i > this.finish.i ? this.start : this.finish;
};

Primrose.prototype.getLines = function () {
    return this.history[this.history.length - 1].slice();
};

Primrose.prototype.export = function(){
    return this.getLines().map(function(m) {
        return "\"" + m.replace(/"/g, "\\\"") + "\\n\"";
    }).join("\n+ ");
};

Primrose.prototype.pushUndo = function (lines) {
    this.history.push(lines);
};

Primrose.prototype.popUndo = function () {
    if (this.history.length > 1) {
        return this.history.pop();
    }
};

Primrose.prototype.copySelectedText = function (evt) {
    if (this.start.i !== this.finish.i) {
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
        this.start.right(lines);
    }
    this.finish.copy(this.start);
    this.drawText();
};

Primrose.prototype.deleteSelection = function () {
    if (this.start.i !== this.finish.i) {
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