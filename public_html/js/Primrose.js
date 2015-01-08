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
    var scrollTop = 0
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
            var typeA = (evt.ctrlKey && "CTRL" || "")
                    + (evt.altKey && "ALT" || "");
            var typeB = (typeA + (evt.shiftKey && "SHIFT" || "")) || "NORMAL";
            typeA = typeA || "NORMAL";
            var codeCommandA = typeA + key;
            var codeCommandB = typeB + key;
            var charCommand = typeB + "_" + codePage.SHIFT[key];
            var func = Commands[codeCommandB] || Commands[codeCommandA] || Commands[charCommand];
            if (func) {
                var currentCursor = evt.shiftKey ? this.backCursor : this.bothCursors;
                if (func instanceof Function) {
                    func.call(this, this.getLines(), currentCursor);
                }
                else {
                    currentCursor[func](this.getLines(), currentCursor);
                }
                currentCursor = evt.shiftKey ? this.backCursor : this.frontCursor;
                this.scrollIntoView(currentCursor);
                evt.preventDefault();
            }
            else if (codePage[typeB]) {
                var char = codePage[typeB][key];
                if (char) {
                    this.insertAtCursor(char);
                    if (key === Keys.SPACEBAR) {
                        evt.preventDefault();
                    }
                }
            }
            else {
                // what just happened?
                console.log(typeB, key);
            }
        }
        this.drawText();
    };

    this.scrollIntoView = function (currentCursor) {
        var dyTop = currentCursor.y - scrollTop;
        var dyBottom = dyTop - gridHeight;
        if (!(dyTop >= 0 && dyBottom < 0)) {
            var dy = 0;
            // compare the absolute values, so we get the smallest change regardless
            // of direction
            if (Math.abs(dyTop) < Math.abs(dyBottom)) {
                dy = dyTop;
            }
            else {
                dy = dyBottom;
            }
            scrollTop += dy;
        }
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
        var rows = [[]];
        for (var i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            if (t.type === "newlines") {
                rows.push([]);
            }
            else {
                rows[rows.length - 1].push(t);
            }
        }

        var clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";
        if (theme.regular.backColor) {
            gfx.fillStyle = theme.regular.backColor;
        }
        gfx[clearFunc](0, 0, gfx.canvas.width, gfx.canvas.height);
        var minCursor = Cursor.min(this.frontCursor, this.backCursor);
        var maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        var tokenFront = new Cursor();
        var tokenBack = new Cursor();

        for (var y = 0; y < rows.length; ++y) {
            var row = rows[y];
            for (var n = 0; n < row.length; ++n) {
                var t = row[n];
                tokenBack.x += t.value.length;
                tokenBack.i += t.value.length;

                if (scrollTop <= y && y < scrollTop + gridHeight) {
                    if (minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i) {
                        var selectionFront = Cursor.max(minCursor, tokenFront);
                        var selectionBack = Cursor.min(maxCursor, tokenBack);
                        var cw = selectionBack.i - selectionFront.i;
                        gfx.fillStyle = theme.regular.selectedBackColor
                                || Themes.DEFAULT.regular.selectedBackColor;
                        gfx.fillRect(
                                selectionFront.x * this.characterWidth, (selectionFront.y + 0.2 - scrollTop) * this.characterHeight,
                                cw * this.characterWidth, this.characterHeight
                                );
                    }
                    var style = theme[t.type] || {};
                    var font = (style.fontWeight || theme.regular.fontWeight || "")
                            + " " + (style.fontStyle || theme.regular.fontStyle || "")
                            + " " + this.characterHeight + "px " + theme.fontFamily;
                    gfx.font = font.trim();
                    gfx.fillStyle = style.foreColor || theme.regular.foreColor;
                    gfx.fillText(t.value, tokenFront.x * this.characterWidth, (tokenFront.y + 1 - scrollTop) * this.characterHeight);
                }

                tokenFront.copy(tokenBack);
            }
            tokenFront.x = 0;
            ++tokenFront.y;
            ++tokenFront.i;
            tokenBack.copy(tokenFront);
        }

        gfx.beginPath();
        gfx.strokeStyle = "black";
        gfx.moveTo(this.frontCursor.x * this.characterWidth, (this.frontCursor.y - scrollTop) * this.characterHeight);
        gfx.lineTo(this.frontCursor.x * this.characterWidth, (this.frontCursor.y - scrollTop + 1.25) * this.characterHeight);
        gfx.moveTo(this.backCursor.x * this.characterWidth + 1, (this.backCursor.y - scrollTop) * this.characterHeight);
        gfx.lineTo(this.backCursor.x * this.characterWidth + 1, (this.backCursor.y - scrollTop + 1.25) * this.characterHeight);
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

Primrose.prototype.export = function () {
    return this.getLines().map(function (m) {
        return "\"" + m.replace(/"/g, "\\\"") + "\\n\"";
    }).join("\n+ ");
};

Primrose.prototype.copySelectedText = function (evt) {
    if (this.frontCursor.i !== this.backCursor.i) {
        var minCursor = Cursor.min(this.frontCursor, this.backCursor);
        var maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        var lines = this.getLines();
        var text = lines.join("\n");
        var str = text.substring(minCursor.i, maxCursor.i);
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
    var minCursor = Cursor.min(this.frontCursor, this.backCursor);
    var left = text.substring(0, minCursor.i);
    var right = text.substring(minCursor.i);
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
        var minCursor = Cursor.min(this.frontCursor, this.backCursor);
        var maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        var lines = this.getLines();
        // TODO: don't rejoin the string first.
        var text = lines.join("\n");
        var left = text.substring(0, minCursor.i);
        var right = text.substring(maxCursor.i);
        text = left + right;
        lines = text.split("\n");
        this.pushUndo(lines);
        maxCursor.copy(minCursor);
    }
};