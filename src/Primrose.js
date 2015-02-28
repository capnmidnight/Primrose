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
 * along with self program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Primrose(canvasID, options) {
    "use strict";
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || {};


    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////

    var codePage,
            operatingSystem,
            browser,
            commandSystem,
            keyboardSystem,
            commandPack = {},
            tokenizer,
            tokens,
            theme,
            pageSize,
            gridWidth, gridHeight,
            pointerX, pointerY,
            tabWidth, tabString,
            currentTouchID,
            texture, pickingTexture,
            deadKeyState = "",
            commandState = "",
            keyNames = [],
            history = [],
            historyFrame = -1,
            dragging = false,
            focused = false,
            changed = false,
            showLineNumbers = false,
            leftGutterWidth = 1,
            rightGutterWidth = 1,
            bottomGutterHeight = 1,
            canvas = cascadeElement(canvasID, "canvas", HTMLCanvasElement),
            gfx = canvas.getContext("2d"),
            surrogate = cascadeElement("primrose-surrogate-textarea-" + canvasID, "textarea", HTMLTextAreaElement),
            surrogateContainer;


    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    self.frontCursor = new Cursor();
    self.backCursor = new Cursor();
    self.scrollTop = 0;
    self.scrollLeft = 0;
    self.gridLeft = 0;
    self.currentToken = null;


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function minDelta(v, minV, maxV) {
        var dvMinV = v - minV;
        var dvMaxV = v - maxV + 5;
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
            self.pasteAtCursor(str);
        }
    }

    function measureText() {
        var r = self.getPixelRatio(),
                oldCharacterWidth = self.characterWidth,
                oldCharacterHeight = self.characterHeight,
                oldWidth = canvas.width,
                oldHeight = canvas.height,
                oldFont = gfx.font;
        
        self.characterHeight = theme.fontSize * r;
        canvas.width = canvas.clientWidth * r;
        canvas.height = canvas.clientHeight * r;
        gfx.font = self.characterHeight + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        self.characterWidth = gfx.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
        changed = oldCharacterWidth !== self.characterWidth ||
                oldCharacterHeight !== self.characterHeight ||
                oldWidth !== canvas.width ||
                oldHeight !== canvas.height ||
                oldFont !== gfx.font;
        self.drawText();
    }

    function setCursorXY(cursor, x, y) {
        changed = true;
        pointerX = x;
        pointerY = y;
        var lines = self.getLines();
        var cell = self.pixel2cell(x, y);
        cursor.setXY(cell.x, cell.y, lines);
    }

    function mouseButtonDown(pointerEventSource, evt) {
        if (focused && evt.button === 0) {
            var bounds = pointerEventSource.getBoundingClientRect();
            self.startPointer(evt.clientX - bounds.left, evt.clientY - bounds.top);
            evt.preventDefault();
        }
    }

    function mouseMove(pointerEventSource, evt) {
        if (focused) {
            var bounds = pointerEventSource.getBoundingClientRect();
            self.movePointer(evt.clientX - bounds.left, evt.clientY - bounds.top);
        }
    }

    function mouseButtonUp(evt) {
        if (focused && evt.button === 0) {
            self.endPointer();
        }
    }

    function touchStart(pointerEventSource, evt) {
        if (focused && evt.touches.length > 0 && !dragging) {
            var t = evt.touches[0];
            var bounds = pointerEventSource.getBoundingClientRect();
            self.startPointer(t.clientX - bounds.left, t.clientY - bounds.top);
            currentTouchID = t.identifier;
        }
    }

    function touchMove(pointerEventSource, evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                var bounds = pointerEventSource.getBoundingClientRect();
                self.movePointer(t.clientX - bounds.left, t.clientY - bounds.top);
                break;
            }
        }
    }

    function touchEnd(evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                self.endPointer();
            }
        }
    }

    function addCommandPack(cmd) {
        if (cmd) {
            for (var key in cmd) {
                if (cmd.hasOwnProperty(key)) {
                    var func = cmd[key];
                    if (!(func instanceof Function)) {
                        func = self.insertAtCursor.bind(self, func);
                    }
                    commandPack[key] = func;
                }
            }
        }
    }

    function refreshCommandPack() {
        if (keyboardSystem && operatingSystem && commandSystem) {
            commandPack = {};
        }
        addCommandPack.call(self, keyboardSystem);
        addCommandPack.call(self, operatingSystem);
        addCommandPack.call(self, browser);
        addCommandPack.call(self, commandSystem);
    }

    function makeCursorCommand(name) {
        var method = name.toLowerCase();
        self["cursor" + name] = function (lines, cursor) {
            changed = true;
            cursor[method](lines);
            self.scrollIntoView(cursor);
        };
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    ["Left", "Right",
        "SkipLeft", "SkipRight",
        "Up", "Down",
        "Home", "End",
        "FullHome", "FullEnd"].map(makeCursorCommand.bind(self));

    self.cursorPageUp = function (lines, cursor) {
        changed = true;
        cursor.incY(-pageSize, lines);
        self.scrollIntoView(cursor);
    };

    self.cursorPageDown = function (lines, cursor) {
        changed = true;
        cursor.incY(pageSize, lines);
        self.scrollIntoView(cursor);
    };

    self.focus = function () {
        changed = true;
        focused = true;
    };

    self.blur = function () {
        changed = true;
        focused = false;
    };

    self.isFocused = function () {
        return focused;
    };

    self.getCanvas = function () {
        return canvas;
    };

    self.getTexture = function (anisotropy) {
        if (window.THREE && !texture) {
            texture = new THREE.Texture(canvas);
            texture.anisotropy = anisotropy || 8;
            texture.needsUpdate = true;
        }
        return texture;
    };
    
    self.getPickingTexture = function(){
        if(!pickingTexture){
            var canvas = document.createElement("canvas"),
                    w = self.getWidth(),
                    h = self.getHeight();
            canvas.width = w;
            canvas.height = h;

            var gfx = canvas.getContext("2d"),
                pixels = gfx.createImageData(w, h);

            for (var i = 0, p = 0, l = w * h; i < l; ++i, p += 4) {
                pixels.data[p] = (0xff0000 & i) >> 16;
                pixels.data[p + 1] = (0x00ff00 & i) >> 8;
                pixels.data[p + 2] = (0x0000ff & i) >> 0;
                pixels.data[p + 3] = 0xff;
            }
            gfx.putImageData(pixels, 0, 0);
            pickingTexture = new THREE.Texture(canvas, THREE.UVMapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter, THREE.NearestMipMapNearestFilter, THREE.RGBAFormat, THREE.UnsignedByteType, 0);            
            pickingTexture.needsUpdate = true;
        }
        return pickingTexture;
    };
    
    self.setShowLineNumbers = function (v) {
        showLineNumbers = v;
        changed = true;
        self.drawText();
    };
    
    self.getShowLineNumbers = function() {
        return showLineNumbers;
    };

    self.setTheme = function (t) {
        theme = t || Themes.DEFAULT;
        measureText.call(self);
    };
    
    self.getTheme = function(){
        return theme;
    };

    self.setDeadKeyState = function (st) {
        changed = true;
        deadKeyState = st || "";
    };

    self.setCommandState = function (st) {
        changed = true;
        commandState = st || "";
    };

    self.setOperatingSystem = function (os) {
        changed = true;
        operatingSystem = os || (isOSX ? OperatingSystems.OSX : OperatingSystems.WINDOWS);
        refreshCommandPack.call(self);
    };
    
    self.getOperatingSystem = function(){
        return operatingSystem;
    };

    self.setCommandSystem = function (cmd) {
        changed = true;
        commandSystem = cmd || Commands.DEFAULT;
        refreshCommandPack.call(self);
    };

    self.setSize = function (w, h) {
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        measureText.call(self);
    };
    
    self.forceUpdate = function(){
        changed = true;
        self.drawText();
    };

    self.getWidth = function () {
        return canvas.width;
    };

    self.getHeight = function () {
        return canvas.height;
    };

    self.setCodePage = function (cp) {
        changed = true;
        var key, code;
        var lang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || navigator.browserLanguage;
        
        if(!lang || lang === "en"){
            lang = "en-US";
        }
        
        codePage = cp;

        if (!codePage) {
            for (key in CodePages) {
                cp = CodePages[key];
                if (cp.language === lang) {
                    codePage = cp;
                    break;
                }
            }
        
            if(!codePage){
                codePage = CodePages.EN_US;
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
                    var char, name;
                    if (code.indexOf("_") > -1) {
                        var parts = code.split(' ');
                        var browser = parts[0];
                        code = parts[1];
                        char = codePage.NORMAL[code];
                        name = browser + "_" + type + " " + char;
                    }
                    else {
                        char = codePage.NORMAL[code];
                        name = type + "_" + char;
                    }
                    keyNames[code] = char;
                    keyboardSystem[name] = codes[code];
                }
            }
        }

        refreshCommandPack.call(self);
    };
    
    self.getCodePage = function(){
        return codePage;
    };

    self.setTokenizer = function (tk) {
        changed = true;
        tokenizer = tk || Grammar.JavaScript;
        if(history && history.length > 0){
            tokens = tokenizer.tokenize(self.getText());
            if (self.drawText) {
                self.drawText();
            }
        }
    };

    self.getTokenizer = function () {
        return tokenizer;
    };

    self.getLines = function () {
        return history[historyFrame].slice();
    };

    self.pushUndo = function (lines) {
        changed = true;
        if (historyFrame < history.length - 1) {
            history.splice(historyFrame + 1);
        }
        history.push(lines);
        historyFrame = history.length - 1;
        tokens = tokenizer.tokenize(self.getText());
        self.drawText();
    };

    self.redo = function () {
        changed = true;
        if (historyFrame < history.length - 1) {
            ++historyFrame;
        }
        tokens = tokenizer.tokenize(self.getText());
    };

    self.undo = function () {
        changed = true;
        if (historyFrame > 0) {
            --historyFrame;
        }
        tokens = tokenizer.tokenize(self.getText());
    };

    self.setTabWidth = function (tw) {
        tabWidth = tw || 4;
        tabString = "";
        for (var i = 0; i < tabWidth; ++i) {
            tabString += " ";
        }
    };

    self.getTabWidth = function () {
        return tabWidth;
    };

    self.getTabString = function () {
        return tabString;
    };

    self.scrollIntoView = function (currentCursor) {
        self.scrollTop += minDelta(currentCursor.y, self.scrollTop, self.scrollTop + gridHeight);
        self.scrollLeft += minDelta(currentCursor.x, self.scrollLeft, self.scrollLeft + gridWidth);
    };

    self.increaseFontSize = function () {
        ++theme.fontSize;
        measureText.call(self);
    };

    self.decreaseFontSize = function () {
        if (theme.fontSize > 1) {
            --theme.fontSize;
            measureText.call(self);
        }
    };

    self.getText = function () {
        return self.getLines().join("\n");
    };

    self.setText = function (txt) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        var lines = txt.split("\n");
        self.pushUndo(lines);
        if (self.drawText) {
            self.drawText();
        }
    };

    self.pixel2cell = function (x, y) {
        var r = self.getPixelRatio();
        x = Math.floor(x * r / self.characterWidth) + self.scrollLeft - self.gridLeft;
        y = Math.floor((y * r / self.characterHeight) - 0.25) + self.scrollTop;
        return {x: x, y: y};
    };

    self.cell2i = function (x, y) {
        var lines = self.getLines();
        var i = 0;
        for (var dy = 0; dy < y; ++dy) {
            i += lines[dy].length + 1;
        }
        i += x;
        return i;
    };

    self.i2cell = function (i) {
        var lines = self.getLines();
        for (var y = 0; y < lines.length; ++y) {
            if (i <= lines.length) {
                return {x: i, y: y};
            }
            else {
                i -= lines.length - 1;
            }
        }
    };

    self.getPixelRatio = function () {
        return window.devicePixelRatio || 1;
    };

    self.deleteSelection = function () {
        if (self.frontCursor.i !== self.backCursor.i) {
            var minCursor = Cursor.min(self.frontCursor, self.backCursor);
            var maxCursor = Cursor.max(self.frontCursor, self.backCursor);
            var lines = self.getLines();
            // TODO: don't rejoin the string first.
            var text = lines.join("\n");
            var left = text.substring(0, minCursor.i);
            var right = text.substring(maxCursor.i);
            text = left + right;
            maxCursor.copy(minCursor);
            self.setText(text);
        }
    };

    self.insertAtCursor = function (str) {
        if (str.length > 0) {
            str = str.replace(/\r\n/g, "\n");
            self.deleteSelection();
            var lines = self.getLines();
            var parts = str.split("\n");
            parts[0] = lines[self.frontCursor.y].substring(0, self.frontCursor.x) + parts[0];
            parts[parts.length - 1] += lines[self.frontCursor.y].substring(self.frontCursor.x);
            lines.splice.bind(lines, self.frontCursor.y, 1).apply(lines, parts);
            for (var i = 0; i < str.length; ++i) {
                self.frontCursor.right(lines);
            }
            self.backCursor.copy(self.frontCursor);
            self.scrollIntoView(self.frontCursor);
            self.pushUndo(lines);
        }
    };

    self.pasteAtCursor = function (str) {
        self.insertAtCursor(str);
        self.drawText();
    };

    self.copySelectedText = function (evt) {
        if (self.frontCursor.i !== self.backCursor.i) {
            var minCursor = Cursor.min(self.frontCursor, self.backCursor);
            var maxCursor = Cursor.max(self.frontCursor, self.backCursor);
            var lines = self.getLines();
            var text = lines.join("\n");
            var str = text.substring(minCursor.i, maxCursor.i);
            evt.clipboardData.setData("text/plain", str);
        }
        evt.preventDefault();
    };

    self.cutSelectedText = function (evt) {
        self.copySelectedText(evt);
        self.deleteSelection();
        self.drawText();
    };

    self.placeSurrogateUnder = function (elem) {
        if (surrogate && elem) {
            // wait a brief amount of time to make sure the browser rendering 
            // engine had time to catch up
            setTimeout(function () {
                var bounds = elem.getBoundingClientRect();
                surrogate.style.left = bounds.left + "px";
                surrogate.style.top = window.scrollY + bounds.top + "px";
                surrogate.style.width = (bounds.right - bounds.left) + "px";
                surrogate.style.height = (bounds.bottom - bounds.top) + "px";
            }, 250);
        }
    };
    
    self.incCurrentToken = function(dir){        
        if(self.currentToken && self.currentToken.type === "numbers"){
            var num = parseFloat(self.currentToken.value);
            var increment = Math.pow(10, Math.floor(Math.log10(Math.abs(num))));
            if(increment >= 1){
                increment /= 10;
            }
            else if(!increment){
                increment = 0.1;
            }
            num += dir * increment;
            var text = self.getText();
            var left = text.substring(0, self.currentToken.index);
            var right = text.substring(self.currentToken.index + self.currentToken.value.length);
            if(increment < 1){
                var d = Math.ceil(-Math.log10(1.1 * increment));
                console.log(num, increment, d);
                console.log(num.toFixed(d));
                text = left + num.toFixed(d) + right;
            }
            else{
                text = left + num.toString() + right;
            }
            self.setText(text);
        }
    };

    self.editText = function (evt) {
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

            var func = commandPack[browser + "_" + commandName] || commandPack[commandName];
            if (func) {
                self.frontCursor.moved = false;
                self.backCursor.moved = false;
                var lines = self.getLines();
                func.call(null, self, lines);
                lines = self.getLines();
                if (self.frontCursor.moved && !self.backCursor.moved) {
                    self.backCursor.copy(self.frontCursor);
                }
                self.frontCursor.rectify(lines);
                self.backCursor.rectify(lines);
                evt.preventDefault();
            }

            if (deadKeyState === oldDeadKeyState) {
                deadKeyState = "";
            }
        }
        self.drawText();
    };

    self.drawText = function () {
        if (changed && theme && tokens) {
            var t;
            var clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";
            if (theme.regular.backColor) {
                gfx.fillStyle = theme.regular.backColor;
            }
            gfx[clearFunc](0, 0, gfx.canvas.width, gfx.canvas.height);

            // group the tokens into rows
            var rows = [[]];
            for (var i = 0; i < tokens.length; ++i) {
                t = tokens[i];
                rows[rows.length - 1].push(t);
                if (t.type === "newlines") {
                    rows.push([]);
                }
            }

            var lineCountWidth = 0;
            self.gridLeft = leftGutterWidth;
            if(showLineNumbers) {
                lineCountWidth = Math.max(1, Math.ceil(Math.log(rows.length) / Math.LN10));
                self.gridLeft += lineCountWidth;
            }
            gridWidth = Math.floor(canvas.width / self.characterWidth) - self.gridLeft - rightGutterWidth;
            var scrollRight = self.scrollLeft + gridWidth;
            gridHeight = Math.floor(canvas.height / self.characterHeight) - bottomGutterHeight;
            pageSize = Math.floor(gridHeight);

            var minCursor = Cursor.min(self.frontCursor, self.backCursor);
            var maxCursor = Cursor.max(self.frontCursor, self.backCursor);
            var tokenFront = new Cursor();
            var tokenBack = new Cursor();
            var maxLineWidth = 0;
            
            self.currentToken = null;

            for (var y = 0; y < rows.length; ++y) {
                // draw the tokens on self row
                var row = rows[y];
                for (var n = 0; n < row.length; ++n) {
                    t = row[n];
                    var toPrint = t.value;
                    tokenBack.x += toPrint.length;
                    tokenBack.i += toPrint.length;

                    // skip drawing tokens that aren't in view
                    if (self.scrollTop <= y && y < self.scrollTop + gridHeight && self.scrollLeft <= tokenBack.x && tokenFront.x < scrollRight) {
                        // draw the selection box
                        if (minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i) {
                            if(minCursor.i === maxCursor.i){
                                self.currentToken = t;
                            }
                            var selectionFront = Cursor.max(minCursor, tokenFront);
                            var selectionBack = Cursor.min(maxCursor, tokenBack);
                            var cw = selectionBack.i - selectionFront.i;
                            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
                            gfx.fillRect(
                                    (selectionFront.x - self.scrollLeft + self.gridLeft) * self.characterWidth,
                                    (selectionFront.y - self.scrollTop + 0.2) * self.characterHeight,
                                    cw * self.characterWidth + 1,
                                    self.characterHeight + 1);
                        }

                        // draw the text
                        var style = theme[t.type] || {};
                        var font = (style.fontWeight || theme.regular.fontWeight || "") +
                                " " + (style.fontStyle || theme.regular.fontStyle || "") +
                                " " + self.characterHeight + "px " + theme.fontFamily;
                        gfx.font = font.trim();
                        gfx.fillStyle = style.foreColor || theme.regular.foreColor;
                        gfx.fillText(
                                toPrint,
                                (tokenFront.x - self.scrollLeft + self.gridLeft) * self.characterWidth,
                                (tokenFront.y - self.scrollTop + 1) * self.characterHeight);
                    }

                    tokenFront.copy(tokenBack);
                }

                if (showLineNumbers && self.scrollTop <= y && y < self.scrollTop + gridHeight) {
                    // draw the left gutter
                    var lineNumber = y.toString();
                    while (lineNumber.length < lineCountWidth) {
                        lineNumber = " " + lineNumber;
                    }
                    gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
                    gfx.fillRect(
                            0,
                            (y - self.scrollTop + 0.2) * self.characterHeight,
                            (lineNumber.length + leftGutterWidth) * self.characterWidth,
                            self.characterHeight);
                    gfx.font = "bold " + self.characterHeight + "px " + theme.fontFamily;
                    gfx.fillStyle = theme.regular.foreColor;
                    gfx.fillText(
                            lineNumber,
                            0,
                            (y - self.scrollTop + 1) * self.characterHeight);
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
                        (self.frontCursor.x - self.scrollLeft + self.gridLeft) * self.characterWidth,
                        (self.frontCursor.y - self.scrollTop) * self.characterHeight);
                gfx.lineTo(
                        (self.frontCursor.x - self.scrollLeft + self.gridLeft) * self.characterWidth,
                        (self.frontCursor.y - self.scrollTop + 1.25) * self.characterHeight);
                gfx.moveTo(
                        (self.backCursor.x - self.scrollLeft + self.gridLeft) * self.characterWidth + 1,
                        (self.backCursor.y - self.scrollTop) * self.characterHeight);
                gfx.lineTo(
                        (self.backCursor.x - self.scrollLeft + self.gridLeft) * self.characterWidth + 1,
                        (self.backCursor.y - self.scrollTop + 1.25) * self.characterHeight);
                gfx.stroke();
            }

            // draw the scrollbars

            //vertical
            var scrollY = (self.scrollTop * canvas.height) / rows.length;
            var scrollBarHeight = gridHeight * canvas.height / rows.length - bottomGutterHeight * self.characterHeight;
            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
            gfx.fillRect(
                    canvas.width - self.characterWidth,
                    scrollY,
                    self.characterWidth,
                    scrollBarHeight);

            // horizontal
            var scrollX = (self.scrollLeft * canvas.width) / maxLineWidth + (self.gridLeft * self.characterWidth);
            var scrollBarWidth = gridWidth * canvas.width / maxLineWidth - (self.gridLeft + rightGutterWidth) * self.characterWidth;
            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
            gfx.fillRect(
                    scrollX,
                    gridHeight * self.characterHeight,
                    scrollBarWidth,
                    self.characterWidth);

            if (texture) {
                texture.needsUpdate = true;
            }
            changed = false;
        }
    };

    self.readWheel = function (evt) {
        if (focused) {
            changed = true;
            self.scrollTop += Math.floor(evt.deltaY / self.characterHeight);
            if (self.scrollTop < 0) {
                self.scrollTop = 0;
            }
            evt.preventDefault();
            self.drawText();
        }
    };

    self.startPointer = function (x, y) {
        setCursorXY.call(self, self.frontCursor, x, y);
        self.backCursor.copy(self.frontCursor);
        dragging = true;
        self.drawText();
    };

    self.movePointer = function (x, y) {
        if (dragging) {
            setCursorXY.call(self, self.backCursor, x, y);
            self.drawText();
        }
    };

    self.endPointer = function () {
        dragging = false;
        surrogate.focus();
    };

    self.bindEvents = function (keyEventSource, pointerEventSource) {
        if (keyEventSource) {
            keyEventSource.addEventListener("keydown", self.editText.bind(self));
        }

        if (pointerEventSource) {
            pointerEventSource.addEventListener("wheel", self.readWheel.bind(self));
            pointerEventSource.addEventListener("mousedown", mouseButtonDown.bind(self, pointerEventSource));
            pointerEventSource.addEventListener("mousemove", mouseMove.bind(self, pointerEventSource));
            pointerEventSource.addEventListener("mouseup", mouseButtonUp.bind(self));
            pointerEventSource.addEventListener("touchstart", touchStart.bind(self, pointerEventSource));
            pointerEventSource.addEventListener("touchmove", touchMove.bind(self, pointerEventSource));
            pointerEventSource.addEventListener("touchend", touchEnd.bind(self));
        }
    };


    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////
    browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
    if (!(canvasID instanceof HTMLCanvasElement) && options.width && options.height) {
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

    document.body.appendChild(surrogateContainer);

    self.setShowLineNumbers(!options.hideLineNumbers);
    self.setTabWidth(options.tabWidth);
    self.setTheme(options.theme);
    self.setTokenizer(options.tokenizer);
    self.setCodePage(options.codePage);
    self.setOperatingSystem(options.os);
    self.setCommandSystem(options.commands);
    self.setText(options.file);
    self.bindEvents(options.keyEventSource, options.pointerEventSource);

    self.themeSelect = makeSelectorFromObj("primrose-theme-selector-" + canvasID, Themes, theme.name, self, "setTheme", "theme");
    self.tokenizerSelect = makeSelectorFromObj("primrose-tokenizer-selector-" + canvasID, Grammar, tokenizer.name, self, "setTokenizer", "language syntax");
    self.keyboardSelect = makeSelectorFromObj("primrose-keyboard-selector-" + canvasID, CodePages, codePage.name, self, "setCodePage", "localization");
    self.commandSystemSelect = makeSelectorFromObj("primrose-command-system-selector-" + canvasID, Commands, commandSystem.name, self, "setCommandSystem", "command system");
    self.operatingSystemSelect = makeSelectorFromObj("primrose-operating-system-selector-" + canvasID, OperatingSystems, operatingSystem.name, self, "setOperatingSystem", "shortcut style");


    //////////////////////////////////////////////////////////////////////////
    // wire up event handlers
    //////////////////////////////////////////////////////////////////////////

    window.addEventListener("resize", measureText.bind(self));

    surrogate.addEventListener("copy", self.copySelectedText.bind(self));
    surrogate.addEventListener("cut", self.cutSelectedText.bind(self));
    surrogate.addEventListener("paste", readClipboard.bind(self));
}