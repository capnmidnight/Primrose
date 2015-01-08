function Primrose(canvasID, options) {
    options = options || {};

    this.keyboardSelect = cascadeElement("primrose-keyboard-language-selector", "select", HTMLSelectElement);
    this.themeSelect = cascadeElement("primrose-keyboard-language-selector", "select", HTMLSelectElement);
    makeSelectorFromObj(this.keyboardSelect, CodePages, "EN_US", this, "setCodePage");
    makeSelectorFromObj(this.themeSelect, Themes, "DEFAULT", this, "setTheme");

    var languageGrammar = options.languageGrammar || Grammar.JavaScript;
    this.setLanguageGrammar = function (lang) {
        languageGrammar = lang;
    };

    var codePage;
    this.setCodePage = function (cp) {
        codePage = cp;
        for (var type in codePage) {
            var codes = codePage[type];
            for (var code in codes) {
                var name = type + "_" + codePage.NORMAL[code];
                Commands[name] = this.insertAtCursor.bind(this, codes[code]);
            }
        }
    };
    this.setCodePage(options.codePage || CodePages.EN_US);

    var history = [];
    var historyFrame = -1;
    this.getLines = function () {
        return history[historyFrame].slice();
    };

    this.pushUndo = function (lines) {
        if(historyFrame < history.length - 1){
            history.splice(historyFrame + 1);
        }
        history.push(lines);
        historyFrame = history.length - 1;
    };

    this.redo = function () {
        if (historyFrame < history.length - 1) {
            ++historyFrame;
        }
    };

    this.undo = function () {
        if (historyFrame > 1) {
            --historyFrame;
        }
    };

    this.setText(options.file || "");

    this.frontCursor = new Cursor();
    this.backCursor = new Cursor();

    var canvas = cascadeElement(canvasID, "canvas", HTMLCanvasElement);
    var gfx = canvas.getContext("2d");
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    var dragging = false;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.gridLeft = 0;
    var leftGutterWidth = 1;
    var rightGutterWidth = 1;
    var bottomGutterHeight = 1;
    var gridWidth = 0;
    var gridHeight = 0;
    this.pageSize = 0;
    this.tabWidth = options.tabWidth || 4;
    this.tabString = "";
    for (var i = 0; i < this.tabWidth; ++i) {
        this.tabString += " ";
    }

    this.DOMElement = cascadeElement("primrose-surrogate-textarea-container", "div", HTMLDivElement);
    this.DOMElement.style.position = "absolute";
    this.DOMElement.style.left = 0;
    this.DOMElement.style.top = 0;
    this.DOMElement.style.width = 0;
    this.DOMElement.style.height = 0;
    this.DOMElement.style.overflow = "hidden";

    var surrogate = cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement);
    surrogate.style.position = "absolute";
    surrogate.style.left = canvas.offsetLeft + "px";
    surrogate.style.top = canvas.offsetTop + "px";
    surrogate.style.width = canvas.offsetWidth + "px";
    surrogate.style.height = canvas.offsetHeigth + "px";
    surrogate.value = this.getText();
    this.DOMElement.appendChild(surrogate);

    var keyEventSource = options.keyEventSource || surrogate;
    var clipboardEventSource = options.clipboardEventSource || surrogate;
    var mouseEventSource = options.mouseEventSource || canvas;

    this.editText = function (evt) {
        evt = evt || event;
        var key = evt.keyCode;
        var typeA = (evt.ctrlKey && "CTRL" || "")
                + (evt.altKey && "ALT" || "");
        var typeB = (typeA + (evt.shiftKey && "SHIFT" || "")) || "NORMAL";
        typeA = typeA || "NORMAL";
        var codeCommandA = typeA + key;
        var codeCommandB = typeB + key;
        var charCommand = typeB + "_" + codePage.NORMAL[key];
        var func = Commands[codeCommandB] || Commands[codeCommandA] || Commands[charCommand];
        if (func) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            var currentCursor = evt.shiftKey ? this.backCursor : this.frontCursor;
            var lines = this.getLines();
            func.call(this, lines, currentCursor);
            lines = this.getLines();
            if (this.frontCursor.moved && !this.backCursor.moved) {
                this.backCursor.copy(this.frontCursor);
            }
            this.frontCursor.rectify(lines);
            this.backCursor.rectify(lines);
            evt.preventDefault();
        }
        else {
            // what just happened?
            console.log(typeB, key);
        }
        this.drawText();
    };

    function minDelta(v, minV, maxV) {
        var dvMinV = v - minV;
        var dvMaxV = v - maxV + 1;
        var dv = 0;
        if (!(dvMinV >= 0 && dvMaxV < 0)) {
            // compare the absolute values, so we get the smallest change regardless
            // of direction
            if (Math.abs(dvMinV) < Math.abs(dvMaxV)) {
                dv = dvMinV;
            }
            else {
                dv = dvMaxV;
            }
        }

        return dv;
    }

    this.scrollIntoView = function (currentCursor) {
        this.scrollTop += minDelta(currentCursor.y, this.scrollTop, this.scrollTop + gridHeight);
        this.scrollLeft += minDelta(currentCursor.x, this.scrollLeft, this.scrollLeft + gridWidth);
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
        var clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";
        if (theme.regular.backColor) {
            gfx.fillStyle = theme.regular.backColor;
        }
        gfx[clearFunc](0, 0, gfx.canvas.width, gfx.canvas.height);

        var tokens = languageGrammar.tokenize(this.getText());

        // group the tokens into rows
        var rows = [[]];
        for (var i = 0; i < tokens.length; ++i) {
            var t = tokens[i];
            rows[rows.length - 1].push(t);
            if (t.type === "newlines") {
                rows.push([]);
            }
        }

        var lineCountWidth = Math.max(1, Math.ceil(Math.log(rows.length) / Math.LN10));
        this.gridLeft = lineCountWidth + leftGutterWidth;
        gridWidth = Math.floor(canvas.width / this.characterWidth) - this.gridLeft - rightGutterWidth;
        var scrollRight = this.scrollLeft + gridWidth;
        gridHeight = Math.floor(canvas.height / this.characterHeight) - bottomGutterHeight;
        this.pageSize = Math.floor(gridHeight);

        var minCursor = Cursor.min(this.frontCursor, this.backCursor);
        var maxCursor = Cursor.max(this.frontCursor, this.backCursor);
        var tokenFront = new Cursor();
        var tokenBack = new Cursor();
        var maxLineWidth = 0;

        for (var y = 0; y < rows.length; ++y) {
            // draw the tokens on this row
            var row = rows[y];
            for (var n = 0; n < row.length; ++n) {
                var t = row[n];
                var toPrint = t.value;
                tokenBack.x += toPrint.length;
                tokenBack.i += toPrint.length;

                // skip drawing tokens that aren't in view
                if (this.scrollTop <= y && y < this.scrollTop + gridHeight
                        && this.scrollLeft <= tokenBack.x && tokenFront.x < scrollRight) {

                    // draw the selection box
                    if (minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i) {
                        var selectionFront = Cursor.max(minCursor, tokenFront);
                        var selectionBack = Cursor.min(maxCursor, tokenBack);
                        var cw = selectionBack.i - selectionFront.i;
                        gfx.fillStyle = theme.regular.selectedBackColor
                                || Themes.DEFAULT.regular.selectedBackColor;
                        gfx.fillRect(
                                (selectionFront.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                                (selectionFront.y - this.scrollTop + 0.2) * this.characterHeight,
                                cw * this.characterWidth,
                                this.characterHeight);
                    }

                    // draw the text
                    var style = theme[t.type] || {};
                    var font = (style.fontWeight || theme.regular.fontWeight || "")
                            + " " + (style.fontStyle || theme.regular.fontStyle || "")
                            + " " + this.characterHeight + "px " + theme.fontFamily;
                    gfx.font = font.trim();
                    gfx.fillStyle = style.foreColor || theme.regular.foreColor;
                    gfx.fillText(
                            toPrint,
                            (tokenFront.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                            (tokenFront.y - this.scrollTop + 1) * this.characterHeight);
                }

                tokenFront.copy(tokenBack);
            }

            if (this.scrollTop <= y && y < this.scrollTop + gridHeight) {
                // draw the left gutter
                var lineNumber = y.toString();
                while (lineNumber.length < lineCountWidth) {
                    lineNumber = " " + lineNumber;
                }
                gfx.fillStyle = theme.regular.selectedBackColor
                        || Themes.DEFAULT.regular.selectedBackColor;
                gfx.fillRect(
                        0,
                        (y - this.scrollTop + 0.2) * this.characterHeight,
                        (lineNumber.length + leftGutterWidth) * this.characterWidth,
                        this.characterHeight);
                gfx.font = "bold " + this.characterHeight + "px " + theme.fontFamily;
                gfx.fillStyle = theme.regular.foreColor;
                gfx.fillText(
                        lineNumber,
                        0,
                        (y - this.scrollTop + 1) * this.characterHeight);
            }

            maxLineWidth = Math.max(maxLineWidth, tokenBack.x);
            tokenFront.x = 0;
            ++tokenFront.y;
            tokenBack.copy(tokenFront);
        }

        // draw the cursor caret
        gfx.beginPath();
        gfx.strokeStyle = "black";
        gfx.moveTo(
                (this.frontCursor.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                (this.frontCursor.y - this.scrollTop) * this.characterHeight);
        gfx.lineTo(
                (this.frontCursor.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                (this.frontCursor.y - this.scrollTop + 1.25) * this.characterHeight);
        gfx.moveTo(
                (this.backCursor.x - this.scrollLeft + this.gridLeft) * this.characterWidth + 1,
                (this.backCursor.y - this.scrollTop) * this.characterHeight);
        gfx.lineTo(
                (this.backCursor.x - this.scrollLeft + this.gridLeft) * this.characterWidth + 1,
                (this.backCursor.y - this.scrollTop + 1.25) * this.characterHeight);
        gfx.stroke();

        // draw the scrollbars

        //vertical
        var scrollY = (this.scrollTop * canvas.height) / rows.length;
        var scrollBarHeight = gridHeight * canvas.height / rows.length - bottomGutterHeight * this.characterHeight;
        gfx.fillStyle = theme.regular.selectedBackColor
                || Themes.DEFAULT.regular.selectedBackColor;
        gfx.fillRect(
                canvas.width - this.characterWidth,
                scrollY,
                this.characterWidth,
                scrollBarHeight);

        // horizontal
        var scrollX = (this.scrollLeft * canvas.width) / maxLineWidth + (this.gridLeft * this.characterWidth);
        var scrollBarWidth = gridWidth * canvas.width / maxLineWidth - (this.gridLeft + rightGutterWidth) * this.characterWidth;
        gfx.fillStyle = theme.regular.selectedBackColor
                || Themes.DEFAULT.regular.selectedBackColor;
        gfx.fillRect(
                scrollX,
                gridHeight * this.characterHeight,
                scrollBarWidth,
                this.characterHeight);
    };

    function measureText() {
        var r = this.getPixelRatio();
        this.characterHeight = fontSize * r;
        canvas.width = canvas.clientWidth * r;
        canvas.height = canvas.clientHeight * r;
        gfx.font = this.characterHeight + "px " + theme.fontFamily;
        this.characterWidth = gfx.measureText("M").width;
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
    keyEventSource.addEventListener("keyup", function () {
        surrogate.value = this.getText();
        surrogate.selectionStart = this.frontCursor.i;
        surrogate.selectionLength = this.backCursor.i - this.frontCursor.i;
    }.bind(this));

    clipboardEventSource.addEventListener("copy", this.copySelectedText.bind(this));
    clipboardEventSource.addEventListener("cut", this.cutSelectedText.bind(this));
    clipboardEventSource.addEventListener("paste", readClipboard.bind(this));

    function setCursorXY(cursor, evt) {
        var lines = this.getLines();
        var cell = this.pixel2cell(evt.layerX, evt.layerY);
        cursor.setXY(cell.x, cell.y, lines);
    }

    mouseEventSource.addEventListener("wheel", function (evt) {
        this.scrollTop += Math.floor(evt.deltaY / this.characterHeight);
        if (this.scrollTop < 0) {
            this.scrollTop = 0;
        }
        evt.preventDefault();
        this.drawText();
    }.bind(this));

    mouseEventSource.addEventListener("mousedown", function (evt) {
        if (evt.button === 0) {
            setCursorXY.call(this, this.frontCursor, evt);
            this.backCursor.copy(this.frontCursor);
            dragging = true;
            this.drawText();
        }
    }.bind(this));

    mouseEventSource.addEventListener("mouseup", function (evt) {
        if (evt.button === 0) {
            dragging = false;
        }
        surrogate.focus();
    }.bind(this));

    mouseEventSource.addEventListener("mousemove", function (evt) {
        if (dragging) {
            setCursorXY.call(this, this.backCursor, evt);
            this.drawText();
        }
    }.bind(this));
}

Primrose.prototype.getText = function () {
    return this.getLines().join("\n");
};

Primrose.prototype.setText = function (txt) {
    txt = txt.replace(/\r\n/g, "\n");
    var lines = txt.split("\n");
    this.pushUndo(lines);
    if (this.drawText) {
        this.drawText();
    }
};

Primrose.prototype.pixel2cell = function (x, y) {
    var r = this.getPixelRatio();
    x = Math.floor(x * r / this.characterWidth) + this.scrollLeft - this.gridLeft;
    y = Math.floor((y * r / this.characterHeight) - 0.25) + this.scrollTop;
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
        this.setText(text);
        maxCursor.copy(minCursor);
    }
};

Primrose.prototype.insertAtCursor = function (str) {
    if (str.length > 0) {
        str = str.replace(/\r\n/g, "\n");
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
        this.scrollIntoView(this.frontCursor);
        this.pushUndo(lines);
    }
};

Primrose.prototype.pasteAtCursor = function (str) {
    this.insertAtCursor(str);
    this.drawText();
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