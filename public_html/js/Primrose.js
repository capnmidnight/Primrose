function Primrose(canvas, options) {
    options = options || {};

    this.syntaxRules = options.syntaxRules || Grammar.JavaScript;

    this.codePage = options.codePage || CodePages.EN_US;
    this.history = [(options.file || "").split("\n")];
    this.start = new Cursor();
    this.finish = new Cursor();
    this.both = new CombinedCursor(this.start, this.finish);

    this.canvas = canvas;
    this.graphics = this.canvas.getContext("2d");
    this.canvas.style.width = this.canvas.width + "px";
    this.canvas.style.height = this.canvas.height + "px";
    
    this.fontSize = options.fontSize || 20;
    
    var dragging = false;
    this.pageSize = options.pageSize || 5;
    this.tabWidth = options.tabWidth || 4;
    this.tabString = "";
    for (var i = 0; i < this.tabWidth; ++i) {
        this.tabString += " ";
    }

    var keyEventSource = options.keyEventSource || window;
    var clipboardEventSource = options.clipboardEventSource || window;
    var mouseEventSource = options.mouseEventSource || this.canvas;

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

    this.drawText = function () {
        var lines = this.getLines();
        var text = lines.join("\n");
        var tokens = this.syntaxRules.tokenize(text);
        var clearFunc = this.theme.regular.backColor ? "fillRect" : "clearRect";
        if(this.theme.regular.backColor){
            this.graphics.fillStyle = this.theme.regular.backColor;
        }
        this.graphics[clearFunc](0, 0, this.graphics.canvas.width, this.graphics.canvas.height);
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
                    this.graphics.fillStyle = this.theme.regular.selectedBackColor
                            || Themes.DEFAULT.regular.selectedBackColor;
                    this.graphics.fillRect(
                            e.x * this.characterWidth, (e.y + 0.25) * this.characterHeight,
                            cw * this.characterWidth, this.characterHeight
                            );
                }
                var style = this.theme[t.type] || {};
                var font = (style.fontWeight || this.theme.regular.fontWeight || "")
                        + " " + (style.fontStyle || this.theme.regular.fontStyle || "")
                        + " " + this.characterHeight + "px " + this.theme.fontFamily;
                this.graphics.font = font.trim();
                this.graphics.fillStyle = style.foreColor || this.theme.regular.foreColor;
                this.graphics.fillText(t.value, c.x * this.characterWidth, (c.y + 1) * this.characterHeight);
                c.copy(d);
            }
        }

        this.graphics.beginPath();
        this.graphics.strokeStyle = "black";
        this.graphics.moveTo(this.start.x * this.characterWidth, this.start.y * this.characterHeight);
        this.graphics.lineTo(this.start.x * this.characterWidth, (this.start.y + 1.25) * this.characterHeight);
        this.graphics.moveTo(this.finish.x * this.characterWidth + 1, this.finish.y * this.characterHeight);
        this.graphics.lineTo(this.finish.x * this.characterWidth + 1, (this.finish.y + 1.25) * this.characterHeight);
        this.graphics.stroke();
    };

    keyEventSource.addEventListener("keydown", this.editText.bind(this));

    clipboardEventSource.addEventListener("copy", this.copySelectedText.bind(this));
    clipboardEventSource.addEventListener("cut", this.cutSelectedText.bind(this));
    clipboardEventSource.addEventListener("paste", readClipboard.bind(this));

    mouseEventSource.addEventListener("mousedown", function (evt) {
        var lines = this.history[this.history.length - 1];
        var cell = this.pixel2cell(evt.layerX, evt.layerY);
        this.both.setXY(cell.x, cell.y, lines);
        this.drawText();
        dragging = true;
    }.bind(this));

    mouseEventSource.addEventListener("mouseup", function () {
        dragging = false;
    });

    mouseEventSource.addEventListener("mousemove", function (evt) {
        if (dragging) {
            var lines = this.history[this.history.length - 1];
            var cell = this.pixel2cell(evt.layerX, evt.layerY);
            this.finish.setXY(cell.x, cell.y, lines);
            this.drawText();
        }
    }.bind(this));
    
    this.setTheme(options.theme || Themes.DEFAULT);    
}

Primrose.prototype.pixel2cell = function(x, y) {
    var r = this.getPixelRatio();
    x = Math.floor(x * r / this.characterWidth);
    y = Math.floor((y * r / this.characterHeight) - 0.25);
    return {x: x, y: y};
};

Primrose.prototype.getPixelRatio = function(){
    return window.devicePixelRatio || 1;
};

Primrose.prototype.setTheme = function(theme){
    this.theme = theme;
    var r = this.getPixelRatio();
    this.characterHeight = this.fontSize * r;
    this.canvas.width = this.canvas.width * r;
    this.canvas.height = this.canvas.height * r;
    this.graphics.font = this.characterHeight + "px " + this.theme.fontFamily;
    this.characterWidth = this.graphics.measureText("M").width;
    this.drawText();
};

Primrose.prototype.setCodePage = function(codePage){
    this.codePage = codePage;
};

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