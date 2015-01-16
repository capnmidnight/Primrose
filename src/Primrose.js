/* 
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Primrose(canvasID, options) {
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || {};


    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////

    var codePage,
            operatingSystem,
            commandSystem,
            keyboardSystem,
            commandPack = {},
            tokenizer,
            theme,
            pageSize,
            gridWidth,
            gridHeight,
            tabWidth,
            tabString,
            deadKeyState = "",
            commandState = "",
            keyNames = [],
            history = [],
            historyFrame = -1,
            dragging = false,
            focused = false,
            leftGutterWidth = 1,
            rightGutterWidth = 1,
            bottomGutterHeight = 1,
            canvas = cascadeElement(canvasID, "canvas", HTMLCanvasElement),
            gfx = canvas.getContext("2d"),
            surrogate = cascadeElement("primrose-surrogate-textarea-" + canvasID, "textarea", HTMLTextAreaElement),
            surrogateContainer,
            keyEventSource = options.keyEventSource || surrogate,
            clipboardEventSource = options.clipboardEventSource || surrogate,
            mouseEventSource = options.mouseEventSource || canvas;


    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Cursor();
    this.backCursor = new Cursor();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.gridLeft = 0;


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function onFocus() {
        focused = true;
        this.drawText();
    }

    function onBlur() {
        focused = false;
        this.drawText();
    }

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

    function measureText() {
        var r = this.getPixelRatio();
        this.characterHeight = theme.fontSize * r;
        canvas.width = canvas.clientWidth * r;
        canvas.height = canvas.clientHeight * r;
        gfx.font = this.characterHeight + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.characterWidth = gfx.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
        this.drawText();
    }

    function setCursorXY(cursor, evt) {
        var lines = this.getLines();
        var cell = this.pixel2cell(evt.layerX, evt.layerY);
        cursor.setXY(cell.x, cell.y, lines);
    }

    function readWheel(evt) {
        this.scrollTop += Math.floor(evt.deltaY / this.characterHeight);
        if (this.scrollTop < 0) {
            this.scrollTop = 0;
        }
        evt.preventDefault();
        this.drawText();
    }

    function mouseButtonDown(evt) {
        if (evt.button === 0) {
            setCursorXY.call(this, this.frontCursor, evt);
            this.backCursor.copy(this.frontCursor);
            dragging = true;
            this.drawText();
        }
    }

    function mouseButtonUp(evt) {
        if (evt.button === 0) {
            dragging = false;
        }
        surrogate.focus();
    }

    function mouseMove(evt) {
        if (dragging) {
            setCursorXY.call(this, this.backCursor, evt);
            this.drawText();
        }
    }

    function releaseKey(evt) {
    }

    function addCommandPack(cmd) {
        if (cmd) {
            for (var key in cmd) {
                if (cmd.hasOwnProperty(key)) {
                    commandPack[key] = cmd[key];
                }
            }
        }
    }

    function refreshCommandPack() {
        if (keyboardSystem && operatingSystem && commandSystem) {
            commandPack = {};
        }
        addCommandPack.call(this, keyboardSystem);
        addCommandPack.call(this, operatingSystem);
        addCommandPack.call(this, commandSystem);
    }

    function makeCursorCommand(name) {
        var method = name.toLowerCase();
        this["cursor" + name] = function (lines, cursor) {
            cursor[method](lines);
            this.scrollIntoView(cursor);
        };
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    ["Left", "Right",
        "SkipLeft", "SkipRight",
        "Up", "Down",
        "Home", "End",
        "FullHome", "FullEnd"].map(makeCursorCommand.bind(this));

    this.cursorPageUp = function (lines, cursor) {
        cursor.incY(-pageSize, lines);
        this.scrollIntoView(cursor);
    };

    this.cursorPageDown = function (lines, cursor) {
        cursor.incY(pageSize, lines);
        this.scrollIntoView(cursor);
    };

    this.focus = function () {
        surrogate.focus();
    };
    
    this.getCanvas = function(){
        return canvas;
    };

    this.setTheme = function (t) {
        theme = t || Themes.DEFAULT;
        measureText.call(this);
    };

    this.setDeadKeyState = function (st) {
        deadKeyState = st || "";
    };

    this.setCommandState = function (st) {
        commandState = st || "";
    };

    this.setOperatingSystem = function (os) {
        operatingSystem = os || (isOSX ? OSCommands.OSX : OSCommands.WINDOWS);
        refreshCommandPack.call(this);
    };

    this.setCommandSystem = function (cmd) {
        commandSystem = cmd || Commands.DEFAULT;
        refreshCommandPack.call(this);
    };

    this.setCodePage = function (cp) {
        var key, code;
        var lang = navigator.userLanguage || navigator.languages[0];
        codePage = cp;

        if (codePage === undefined) {
            for (key in CodePages) {
                cp = CodePages[key];
                if (cp.language === lang) {
                    codePage = cp;
                    break;
                }
            }
        }

        keyNames = [];
        for (key in Keys) {
            code = Keys[key];
            if (!isNaN(code)) {
                keyNames[code] = key;
            }
        }

        keyboardSystem = {};
        for (var type in codePage) {
            var codes = codePage[type];
            if (typeof (codes) === "object") {
                for (code in codes) {
                    var char = codePage.NORMAL[code];
                    keyNames[code] = char;
                    var name = type + "_" + char;

                    var func = codes[code];
                    if (!(func instanceof Function)) {
                        func = this.insertAtCursor.bind(this, codes[code]);
                    }
                    keyboardSystem[name] = func;
                }
            }
        }

        refreshCommandPack.call(this);
    };

    this.setTokenizer = function (tk) {
        tokenizer = tk || Grammar.JavaScript;
        if (this.drawText) {
            this.drawText();
        }
    };

    this.getTokenizer = function () {
        return tokenizer;
    };

    this.getLines = function () {
        return history[historyFrame].slice();
    };

    this.pushUndo = function (lines) {
        if (historyFrame < history.length - 1) {
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
        if (historyFrame > 0) {
            --historyFrame;
        }
    };

    this.setTabWidth = function (tw) {
        tabWidth = tw || 4;
        tabString = "";
        for (var i = 0; i < tabWidth; ++i) {
            tabString += " ";
        }
    };

    this.getTabWidth = function () {
        return tabWidth;
    };

    this.getTabString = function () {
        return tabString;
    };

    this.scrollIntoView = function (currentCursor) {
        this.scrollTop += minDelta(currentCursor.y, this.scrollTop, this.scrollTop + gridHeight);
        this.scrollLeft += minDelta(currentCursor.x, this.scrollLeft, this.scrollLeft + gridWidth);
    };

    this.increaseFontSize = function () {
        ++theme.fontSize;
        measureText.call(this);
    };

    this.decreaseFontSize = function () {
        if (theme.fontSize > 1) {
            --theme.fontSize;
            measureText.call(this);
        }
    };

    this.getText = function () {
        return this.getLines().join("\n");
    };

    this.setText = function (txt) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        var lines = txt.split("\n");
        this.pushUndo(lines);
        if (this.drawText) {
            this.drawText();
        }
    };

    this.pixel2cell = function (x, y) {
        var r = this.getPixelRatio();
        x = Math.floor(x * r / this.characterWidth) + this.scrollLeft - this.gridLeft;
        y = Math.floor((y * r / this.characterHeight) - 0.25) + this.scrollTop;
        return {x: x, y: y};
    };

    this.cell2i = function (x, y) {
        var lines = this.getLines();
        var i = 0;
        for (var dy = 0; dy < y; ++dy) {
            i += lines[dy].length + 1;
        }
        i += x;
        return i;
    };

    this.i2cell = function (i) {
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

    this.getPixelRatio = function () {
        return window.devicePixelRatio || 1;
    };

    this.deleteSelection = function () {
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

    this.insertAtCursor = function (str) {
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

    this.pasteAtCursor = function (str) {
        this.insertAtCursor(str);
        this.drawText();
    };

    this.copySelectedText = function (evt) {
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

    this.cutSelectedText = function (evt) {
        this.copySelectedText(evt);
        this.deleteSelection();
        this.drawText();
    };
    
    this.setSurrogateRectangle = function(x, y, w, h){
        if (surrogate) {
            surrogate.style.left = x + "px";
            surrogate.style.top = y + "px";
            surrogate.style.width = w + "px";
            surrogate.style.height = h + "px";
        }
    };

    this.editText = function (evt) {
        evt = evt || event;

        var key = evt.keyCode;
        if (key !== Keys.CTRL && key !== Keys.ALT && key !== Keys.META_L && key !== Keys.META_R && key !== Keys.SHIFT) {
            var oldDeadKeyState = deadKeyState;

            var commandName = deadKeyState;

            if (evt.ctrlKey) {
                commandName += "CTRL";
            }
            if (evt.altKey) {
                commandName += "ALT";
            }
            if (evt.metaKey) {
                commandName += "META";
            }
            if (evt.shiftKey) {
                commandName += "SHIFT";
            }
            if (commandName === deadKeyState) {
                commandName += "NORMAL";
            }

            commandName += "_" + keyNames[key];

            var func = commandPack[commandName];
            if (func) {
                this.frontCursor.moved = false;
                this.backCursor.moved = false;
                var lines = this.getLines();
                func.call(null, this, lines);
                lines = this.getLines();
                if (this.frontCursor.moved && !this.backCursor.moved) {
                    this.backCursor.copy(this.frontCursor);
                }
                this.frontCursor.rectify(lines);
                this.backCursor.rectify(lines);
                evt.preventDefault();
            }

            if (deadKeyState === oldDeadKeyState) {
                deadKeyState = "";
            }
        }
        this.drawText();
    };

    this.drawText = function () {
        if (theme && tokenizer && history.length > 0) {
            var t;
            var clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";
            if (theme.regular.backColor) {
                gfx.fillStyle = theme.regular.backColor;
            }
            gfx[clearFunc](0, 0, gfx.canvas.width, gfx.canvas.height);

            var tokens = tokenizer.tokenize(this.getText());

            // group the tokens into rows
            var rows = [[]];
            for (var i = 0; i < tokens.length; ++i) {
                t = tokens[i];
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
            pageSize = Math.floor(gridHeight);

            var minCursor = Cursor.min(this.frontCursor, this.backCursor);
            var maxCursor = Cursor.max(this.frontCursor, this.backCursor);
            var tokenFront = new Cursor();
            var tokenBack = new Cursor();
            var maxLineWidth = 0;

            for (var y = 0; y < rows.length; ++y) {
                // draw the tokens on this row
                var row = rows[y];
                for (var n = 0; n < row.length; ++n) {
                    t = row[n];
                    var toPrint = t.value;
                    tokenBack.x += toPrint.length;
                    tokenBack.i += toPrint.length;

                    // skip drawing tokens that aren't in view
                    if (this.scrollTop <= y && y < this.scrollTop + gridHeight && this.scrollLeft <= tokenBack.x && tokenFront.x < scrollRight) {

                        // draw the selection box
                        if (minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i) {
                            var selectionFront = Cursor.max(minCursor, tokenFront);
                            var selectionBack = Cursor.min(maxCursor, tokenBack);
                            var cw = selectionBack.i - selectionFront.i;
                            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
                            gfx.fillRect(
                                    (selectionFront.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                                    (selectionFront.y - this.scrollTop + 0.2) * this.characterHeight,
                                    cw * this.characterWidth,
                                    this.characterHeight);
                        }

                        // draw the text
                        var style = theme[t.type] || {};
                        var font = (style.fontWeight || theme.regular.fontWeight || "") +
                                " " + (style.fontStyle || theme.regular.fontStyle || "") +
                                " " + this.characterHeight + "px " + theme.fontFamily;
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
                    gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
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
            if (focused) {
                gfx.beginPath();
                gfx.strokeStyle = theme.cursorColor || "black";
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
            }

            // draw the scrollbars

            //vertical
            var scrollY = (this.scrollTop * canvas.height) / rows.length;
            var scrollBarHeight = gridHeight * canvas.height / rows.length - bottomGutterHeight * this.characterHeight;
            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
            gfx.fillRect(
                    canvas.width - this.characterWidth,
                    scrollY,
                    this.characterWidth,
                    scrollBarHeight);

            // horizontal
            var scrollX = (this.scrollLeft * canvas.width) / maxLineWidth + (this.gridLeft * this.characterWidth);
            var scrollBarWidth = gridWidth * canvas.width / maxLineWidth - (this.gridLeft + rightGutterWidth) * this.characterWidth;
            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
            gfx.fillRect(
                    scrollX,
                    gridHeight * this.characterHeight,
                    scrollBarWidth,
                    this.characterWidth);
        }
    };


    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////
    if(!(canvasID instanceof HTMLCanvasElement) && options.width && options.height){
        canvas.style.position = "absolute";
        canvas.style.width = options.width;
        canvas.style.height = options.height;
    }

    // the `surrogate` textarea makes the soft-keyboard appear on mobile devices.
    surrogate.style.position = "absolute";
    surrogateContainer = makeHidingContainer("primrose-surrogate-textarea-container-" + canvasID, surrogate);

    if (!canvas.parentElement) {
        document.body.appendChild(makeHidingContainer("primrose-container-" + canvasID, canvas));
    }

    canvas.parentElement.insertBefore(surrogateContainer, canvas);

    this.setTabWidth(options.tabWidth);
    this.setTheme(options.theme);
    this.setTokenizer(options.tokenizer);
    this.setCodePage(options.codePage);
    this.setOperatingSystem(options.os);
    this.setCommandSystem(options.commands);
    this.setText(options.file);

    this.themeSelect = makeSelectorFromObj("primrose-theme-selector-" + canvasID, Themes, theme.name, this, "setTheme", "theme");
    this.tokenizerSelect = makeSelectorFromObj("primrose-tokenizer-selector-" + canvasID, Grammar, tokenizer.name, this, "setTokenizer", "language syntax");
    this.keyboardSelect = makeSelectorFromObj("primrose-keyboard-selector-" + canvasID, CodePages, codePage.name, this, "setCodePage", "localization");
    this.commandSystemSelect = makeSelectorFromObj("primrose-command-system-selector-" + canvasID, Commands, commandSystem.name, this, "setCommandSystem", "sommand system");
    this.operatingSystemSelect = makeSelectorFromObj("primrose-operating-system-selector-" + canvasID, OSCommands, operatingSystem.name, this, "setOperatingSystem", "shortcut style");
    

    //////////////////////////////////////////////////////////////////////////
    // wire up event handlers
    //////////////////////////////////////////////////////////////////////////

    window.addEventListener("resize", measureText.bind(this));

    surrogate.addEventListener("focus", onFocus.bind(this));
    surrogate.addEventListener("blur", onBlur.bind(this));

    keyEventSource.addEventListener("keydown", this.editText.bind(this));
    keyEventSource.addEventListener("keyup", releaseKey.bind(this));

    clipboardEventSource.addEventListener("copy", this.copySelectedText.bind(this));
    clipboardEventSource.addEventListener("cut", this.cutSelectedText.bind(this));
    clipboardEventSource.addEventListener("paste", readClipboard.bind(this));

    mouseEventSource.addEventListener("wheel", readWheel.bind(this));
    mouseEventSource.addEventListener("mousedown", mouseButtonDown.bind(this));
    mouseEventSource.addEventListener("mouseup", mouseButtonUp.bind(this));
    mouseEventSource.addEventListener("mousemove", mouseMove.bind(this));
}