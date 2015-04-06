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

var Primrose = (function () {
    function Primrose(renderToElementOrID, Renderer, options) {
        "use strict";
        var self = this;
        Primrose.EDITORS.push(this);
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
                tokenRows,
                theme,
                pointer = new Point(),
                lastPointer = new Point(),
                tabWidth,
                tabString,
                currentTouchID,
                deadKeyState = "",
                keyNames = [],
                history = [],
                historyFrame = -1,
                gridBounds = new Rectangle(),
                topLeftGutter = new Size(),
                bottomRightGutter = new Size(),
                dragging = false,
                focused = false,
                changed = false,
                showLineNumbers = true,
                showScrollBars = true,
                wordWrap = false,
                wheelScrollSpeed = 0,
                renderer = new Renderer(renderToElementOrID, options),
                surrogate = cascadeElement("primrose-surrogate-textarea-" +
                        renderer.id, "textarea", HTMLTextAreaElement),
                surrogateContainer;

        //////////////////////////////////////////////////////////////////////////
        // public fields
        //////////////////////////////////////////////////////////////////////////

        this.frontCursor = new Cursor();
        this.backCursor = new Cursor();
        this.scroll = new Point();


        //////////////////////////////////////////////////////////////////////////
        // private methods
        //////////////////////////////////////////////////////////////////////////

        function refreshTokens() {
            tokens = tokenizer.tokenize(self.getText());
            self.drawText();
        }

        function clampScroll() {
            if (self.scroll.y < 0) {
                self.scroll.y = 0;
            }
            else {
                while (0 < self.scroll.y &&
                        self.scroll.y > tokenRows.length - gridBounds.height) {
                    --self.scroll.y;
                }
            }
        }

        function setSurrogateSize() {
            var bounds = renderer.getCanvas()
                    .getBoundingClientRect();
            surrogateContainer.style.left = px(bounds.left);
            surrogateContainer.style.top = px(window.scrollY + bounds.top);
            surrogateContainer.style.width = 0;
            surrogateContainer.style.height = 0;
            surrogate.style.fontFamily = theme.fontFamily;
            var ch = renderer.character.height / renderer.getPixelRatio();
            surrogate.style.fontSize = px(ch * 0.99);
            surrogate.style.lineHeight = px(ch);
        }

        function setCursorXY(cursor, x, y) {
            changed = true;
            pointer.set(x, y);
            renderer.pixel2cell(pointer, self.scroll, gridBounds);
            var gx = pointer.x - self.scroll.x;
            var gy = pointer.y - self.scroll.y;
            var onBottom = gy >= gridBounds.height;
            var onLeft = gx < 0;
            var onRight = pointer.x >= gridBounds.width;
            if (!onBottom && !onLeft && !onRight) {
                cursor.setXY(pointer.x, pointer.y, tokenRows);
                setSurrogateCursor();
                self.backCursor.copy(cursor);
            }
            else if (onRight && !onBottom) {
                var scrollHeight = tokenRows.length - gridBounds.height;
                if (gy >= 0 && scrollHeight >= 0) {
                    var sy = gy * scrollHeight / gridBounds.height;
                    self.scroll.y = Math.floor(sy);
                }
            }
            else if (onBottom && !onLeft) {
                var maxWidth = 0;
                for (var dy = 0; dy < tokenRows.length; ++dy) {
                    var tokenRow = tokenRows[dy];
                    var width = 0;
                    for (var dx = 0; dx < tokenRow.length; ++dx) {
                        width += tokenRow[dx].value.length;
                    }
                    maxWidth = Math.max(maxWidth, width);
                }
                var scrollWidth = maxWidth - gridBounds.width;
                if (gx >= 0 && scrollWidth >= 0) {
                    var sx = gx * scrollWidth / gridBounds.width;
                    self.scroll.x = Math.floor(sx);
                }
            }
            else if (onLeft && !onBottom) {
                // clicked in number-line gutter
            }
            else {
                // clicked in the lower-left corner
            }
            lastPointer.copy(pointer);
        }

        function pointerStart(x, y) {
            if (options.pointerEventSource) {
                for (var i = 0; i < Primrose.EDITORS.length; ++i) {
                    var e = Primrose.EDITORS[i];
                    if (e !== self) {
                        e.blur();
                    }
                }
                self.focus();
                var bounds =
                        options.pointerEventSource.getBoundingClientRect();
                self.startPointer(x - bounds.left, y - bounds.top);
            }
        }

        function pointerMove(x, y) {
            if (options.pointerEventSource) {
                var bounds =
                        options.pointerEventSource.getBoundingClientRect();
                self.movePointer(x - bounds.left, y - bounds.top);
            }
        }

        function mouseButtonDown(evt) {
            if (evt.button === 0) {
                pointerStart(evt.clientX, evt.clientY);
                evt.preventDefault();
            }
        }

        function mouseMove(evt) {
            if (focused) {
                pointerMove(evt.clientX, evt.clientY);
            }
        }

        function mouseButtonUp(evt) {
            if (focused && evt.button === 0) {
                self.endPointer();
            }
        }

        function touchStart(evt) {
            if (focused && evt.touches.length > 0 && !dragging) {
                var t = evt.touches[0];
                pointerStart(t.clientX, t.clientY);
                currentTouchID = t.identifier;
            }
        }

        function touchMove(evt) {
            for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
                var t = evt.changedTouches[i];
                if (t.identifier === currentTouchID) {
                    pointerMove(t.clientX, t.clientY);
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
                            func = self.overwriteText.bind(self, func);
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
            addCommandPack(keyboardSystem);
            addCommandPack(operatingSystem);
            addCommandPack(commandSystem);
        }

        function makeCursorCommand(name) {
            var method = name.toLowerCase();
            self["cursor" + name] = function (tokenRows, cursor) {
                changed = true;
                cursor[method](tokenRows);
                self.scrollIntoView(cursor);
            };
        }

        function performLayout() {
            var lineCountWidth;
            if (showLineNumbers) {
                lineCountWidth = Math.max(1, Math.ceil(Math.log(
                        self.getLineCount()) / Math.LN10));
                topLeftGutter.width = 1;
            }
            else {
                lineCountWidth = 0;
                topLeftGutter.width = 0;
            }

            if (showScrollBars) {
                if (wordWrap) {
                    bottomRightGutter.set(renderer.VSCROLL_WIDTH, 0);
                }
                else {
                    bottomRightGutter.set(renderer.VSCROLL_WIDTH, 1);
                }
            }
            else {
                bottomRightGutter.set(0, 0);
            }

            var x = topLeftGutter.width + lineCountWidth,
                    y = 0,
                    w = Math.floor(self.getWidth() /
                            renderer.character.width) -
                    x -
                    bottomRightGutter.width,
                    h = Math.floor(self.getHeight() /
                            renderer.character.height) -
                    y -
                    bottomRightGutter.height;
            gridBounds.set(x, y, w, h);
            var cw = renderer.character.width / renderer.getPixelRatio();
            var ch = renderer.character.height / renderer.getPixelRatio();
            surrogate.style.left = px(gridBounds.x * cw);
            surrogate.style.top = px(gridBounds.y * ch);
            surrogate.style.width = px(gridBounds.width * cw);
            surrogate.style.height = px(gridBounds.height * ch);

            // group the tokens into rows
            tokenRows = [[]];
            var currentRowWidth = 0;
            var tokenQueue = tokens.slice();
            for (var i = 0; i < tokenQueue.length; ++i) {
                var t = tokenQueue[i].clone();
                var widthLeft = gridBounds.width - currentRowWidth;
                var wrap = wordWrap && t.value.length > widthLeft;
                var breakLine = t.type === "newlines" || wrap;
                if (wrap) {
                    tokenQueue.splice(i + 1, 0, t.splitAt(widthLeft));
                }

                tokenRows[tokenRows.length - 1].push(t);
                currentRowWidth += t.value.length;

                if (breakLine) {
                    tokenRows.push([]);
                    currentRowWidth = 0;
                }
            }
            return lineCountWidth;
        }


        //////////////////////////////////////////////////////////////////////////
        // public methods
        //////////////////////////////////////////////////////////////////////////
        ["Left", "Right",
            "SkipLeft", "SkipRight",
            "Up", "Down",
            "Home", "End",
            "FullHome", "FullEnd"].map(makeCursorCommand.bind(this));

        this.cursorPageUp = function (tokenRows, cursor) {
            changed = true;
            cursor.incY(-gridBounds.height, tokenRows);
            this.scrollIntoView(cursor);
        };

        this.cursorPageDown = function (tokenRows, cursor) {
            changed = true;
            cursor.incY(gridBounds.height, tokenRows);
            this.scrollIntoView(cursor);
        };

        this.focus = function () {
            focused = true;
            this.forceUpdate();
        };

        this.blur = function () {
            focused = false;
            this.forceUpdate();
        };

        this.isFocused = function () {
            return focused;
        };

        this.getRenderer = function () {
            return renderer;
        };

        this.setWheelScrollSpeed = function (v) {
            wheelScrollSpeed = v || 25;
        };

        this.getWheelScrollSpeed = function () {
            return wheelScrollSpeed;
        };

        this.setWordWrap = function (v) {
            wordWrap = v || false;
            this.forceUpdate();
        };

        this.getWordWrap = function () {
            return wordWrap;
        };

        this.setShowLineNumbers = function (v) {
            showLineNumbers = v;
            this.forceUpdate();
        };

        this.getShowLineNumbers = function () {
            return showLineNumbers;
        };

        this.setShowScrollBars = function (v) {
            showScrollBars = v;
            this.forceUpdate();
        };

        this.getShowScrollBars = function () {
            return showScrollBars;
        };

        this.setTheme = function (t) {
            theme = t || Themes.DEFAULT;
            renderer.setTheme(theme);
            renderer.resize();
            changed = true;
            this.drawText();
        };

        this.getTheme = function () {
            return theme;
        };

        this.setDeadKeyState = function (st) {
            changed = true;
            deadKeyState = st || "";
        };

        this.setOperatingSystem = function (os) {
            changed = true;
            operatingSystem = os || (isOSX ? OperatingSystem.OSX :
                    OperatingSystem.Windows);
            refreshCommandPack();
        };

        this.getOperatingSystem = function () {
            return operatingSystem;
        };

        this.setCommandSystem = function (cmd) {
            changed = true;
            commandSystem = cmd || Commands.TextEditor;
            refreshCommandPack();
        };

        this.setSize = function (w, h) {
            changed = renderer.setSize(w, h);
        };

        this.getWidth = function () {
            return renderer.getWidth();
        };

        this.getHeight = function () {
            return renderer.getHeight();
        };

        this.forceUpdate = function () {
            changed = true;
            this.drawText();
        };

        this.setCodePage = function (cp) {
            changed = true;
            var key,
                    code,
                    char,
                    name;
            codePage = cp;
            if (!codePage) {
                var lang = (navigator.languages && navigator.languages[0]) ||
                        navigator.language ||
                        navigator.userLanguage ||
                        navigator.browserLanguage;

                if (!lang || lang === "en") {
                    lang = "en-US";
                }

                for (key in CodePage) {
                    cp = CodePage[key];
                    if (cp.language === lang) {
                        codePage = cp;
                        break;
                    }
                }

                if (!codePage) {
                    codePage = CodePage.EN_US;
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
                        if (code.indexOf("_") > -1) {
                            var parts = code.split(' '),
                                    browser = parts[0];
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

            refreshCommandPack();
        };

        this.getCodePage = function () {
            return codePage;
        };

        this.setTokenizer = function (tk) {
            changed = true;
            tokenizer = tk || Grammar.JavaScript;
            if (history && history.length > 0) {
                refreshTokens();
                if (this.drawText) {
                    this.drawText();
                }
            }
        };

        this.getTokenizer = function () {
            return tokenizer;
        };

        this.getLines = function () {
            return history[historyFrame].slice();
        };

        this.getLineCount = function () {
            return history[historyFrame].length;
        };

        this.getText = function () {
            return history[historyFrame].join("\n");
        };

        this.pushUndo = function (lines) {
            if (historyFrame < history.length - 1) {
                history.splice(historyFrame + 1);
            }
            history.push(lines);
            historyFrame = history.length - 1;
            refreshTokens();
            this.forceUpdate();
        };

        this.redo = function () {
            changed = true;
            if (historyFrame < history.length - 1) {
                ++historyFrame;
            }
            refreshTokens();
        };

        this.undo = function () {
            changed = true;
            if (historyFrame > 0) {
                --historyFrame;
            }
            refreshTokens();
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

        function minDelta(v, minV, maxV) {
            var dvMinV = v - minV,
                    dvMaxV = v - maxV + 5,
                    dv = 0;
            if (dvMinV < 0 || dvMaxV >= 0) {
                // compare the absolute values, so we get the smallest change
                // regardless of direction.
                dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
            }

            return dv;
        }

        this.scrollIntoView = function (currentCursor) {
            this.scroll.y += minDelta(currentCursor.y, this.scroll.y,
                    this.scroll.y + gridBounds.height);
            if (!wordWrap) {
                this.scroll.x += minDelta(currentCursor.x, this.scroll.x,
                        this.scroll.x + gridBounds.width);
            }
            clampScroll();
        };

        this.increaseFontSize = function () {
            ++theme.fontSize;
            changed = renderer.resize();
        };

        this.decreaseFontSize = function () {
            if (theme.fontSize > 1) {
                --theme.fontSize;
                changed = renderer.resize();
            }
        };

        function setSurrogateCursor() {
            surrogate.selectionStart = Math.min(self.frontCursor.i, self.backCursor.i);
            surrogate.selectionEnd = Math.max(self.frontCursor.i, self.backCursor.i);
        }

        this.setText = function (txt) {
            txt = txt || "";
            txt = txt.replace(/\r\n/g, "\n");
            var lines = txt.split("\n");
            this.pushUndo(lines);
            this.drawText();
            surrogate.value = txt;
            setSurrogateCursor();
        };

        this.getPixelRatio = function () {
            return window.devicePixelRatio || 1;
        };

        this.cell2i = function (x, y) {
            var i = 0;
            for (var dy = 0; dy < y; ++dy) {
                var tokenRow = tokenRows[dy];
                for (var dx = 0; dx < tokenRow.length; ++dx) {
                    i += tokenRow[dx].value.length;
                }
                ++i;
            }
            i += x;
            return i;
        };

        this.i2cell = function (i) {
            for (var y = 0; y < tokenRows.length; ++y) {
                var tokenRow = tokenRows[y];
                var rowWidth = 0;
                for (var x = 0; x < tokenRow.length; ++x) {
                    rowWidth += tokenRow[x].value.length;
                }
                if (i <= rowWidth) {
                    return {x: i, y: y};
                }
                else {
                    i -= rowWidth - 1;
                }
            }
        };

        this.readWheel = function (evt) {
            this.scroll.y += Math.floor(evt.deltaY / wheelScrollSpeed);
            clampScroll();
            evt.preventDefault();
            this.forceUpdate();
        };

        this.startPicking = function (gl, x, y) {
            var p = renderer.getPixelIndex(gl, x, y);
            this.startPointer(p.x, p.y);
        };

        this.movePicking = function (gl, x, y) {
            var p = renderer.getPixelIndex(gl, x, y);
            this.movePointer(p.x, p.y);
        };

        this.startPointer = function (x, y) {
            setCursorXY(this.frontCursor, x, y);
            dragging = true;
            this.drawText();
        };

        this.movePointer = function (x, y) {
            if (dragging) {
                setCursorXY(this.backCursor, x, y);
                this.drawText();
            }
        };

        this.endPointer = function () {
            dragging = false;
            surrogate.focus();
        };

        function setFalse(evt) {
            evt.returnValue = false;
        }

        this.bindEvents = function (k, p, w, c) {
            if (k) {
                k.addEventListener("keydown", this.editText.bind(this));
                surrogate.addEventListener("beforecopy", setFalse);
                surrogate.addEventListener("beforecut", setFalse);
                k.addEventListener("beforepaste", setFalse);
            }

            if (p) {
                p.addEventListener("wheel", this.readWheel.bind(this));
                p.addEventListener("mousedown", mouseButtonDown);
                p.addEventListener("mousemove", mouseMove);
                p.addEventListener("mouseup", mouseButtonUp);
                p.addEventListener("touchstart", touchStart);
                p.addEventListener("touchmove", touchMove);
                p.addEventListener("touchend", touchEnd);
            }

            if (w) {
                w.addEventListener("wheel", this.readWheel.bind(this));
            }
            
            if (c) {
                surrogate.addEventListener("copy", this.copySelectedText.bind(this));
                surrogate.addEventListener("cut", this.cutSelectedText.bind(this));
                if (k) {
                    k.addEventListener("paste", this.readClipboard.bind(this));
                }
            }
        };

        this.overwriteText = function (str) {
            str = str || "";
            str = str.replace(/\r\n/g, "\n");

            if (this.frontCursor.i !== this.backCursor.i || str.length > 0) {
                // TODO: don't rejoin the string first.
                var minCursor = Cursor.min(this.frontCursor, this.backCursor),
                        maxCursor = Cursor.max(this.frontCursor,
                                this.backCursor),
                        text = this.getText(),
                        left = text.substring(0, minCursor.i),
                        right = text.substring(maxCursor.i);
                this.setText(left + str + right);
                minCursor.advanceN(tokenRows, str.length);
                this.scrollIntoView(maxCursor);
                clampScroll();
                maxCursor.copy(minCursor);
                this.forceDraw();
            }
        };

        this.pasteAtCursor = function (str) {
            this.overwriteText(str);
            this.drawText();
        };

        this.copySelectedText = function (evt) {
            evt.returnValue = false;
            if (this.frontCursor.i !== this.backCursor.i) {
                var minCursor = Cursor.min(this.frontCursor, this.backCursor),
                        maxCursor = Cursor.max(this.frontCursor,
                                this.backCursor),
                        text = this.getText(),
                        str = text.substring(minCursor.i, maxCursor.i);
                var clipboard = evt.clipboardData || window.clipboardData;
                clipboard.setData(window.clipboardData ? "Text" : "text/plain",
                        str);
            }
            evt.preventDefault();
        };

        this.cutSelectedText = function (evt) {
            this.copySelectedText(evt);
            this.overwriteText();
            this.drawText();
        };

        this.readClipboard = function(evt) {
            evt.returnValue = false;
            var clipboard = evt.clipboardData || window.clipboardData,
                    str = clipboard.getData(window.clipboardData ? "Text" :
                            "text/plain");
            if (str) {
                this.pasteAtCursor(str);
            }
        };

        this.editText = function (evt) {
            if (focused) {
                evt = evt || event;

                var key = evt.keyCode;
                if (key !== Keys.CTRL && key !== Keys.ALT && key !==
                        Keys.META_L &&
                        key !== Keys.META_R && key !== Keys.SHIFT) {
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

                    var func = commandPack[browser + "_" + commandName] ||
                            commandPack[commandName];
                    if (func) {
                        this.frontCursor.moved = false;
                        this.backCursor.moved = false;
                        func(self, tokenRows);
                        if (this.frontCursor.moved && !this.backCursor.moved) {
                            this.backCursor.copy(this.frontCursor);
                        }
                        clampScroll();
                        evt.preventDefault();
                    }

                    if (deadKeyState === oldDeadKeyState) {
                        deadKeyState = "";
                    }
                }
                this.drawText();
            }
        };

        this.drawText = function () {
            if (changed && theme && tokens) {
                this.forceDraw();
            }
        };

        this.forceDraw = function () {
            var lineCountWidth = performLayout();

            renderer.render(
                    tokenRows,
                    this.frontCursor, this.backCursor,
                    gridBounds,
                    this.scroll,
                    focused, showLineNumbers, showScrollBars, wordWrap,
                    lineCountWidth);

            setSurrogateCursor();

            changed = false;
        };

        //////////////////////////////////////////////////////////////////////////
        // initialization
        /////////////////////////////////////////////////////////////////////////

        //
        // different browsers have different sets of keycodes for less-frequently
        // used keys like.
        browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ?
                "IE" :
                (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));

        //
        // the `surrogate` textarea makes the soft-keyboard appear on mobile devices.
        surrogate.style.position = "absolute";
        surrogateContainer = makeHidingContainer(
                "primrose-surrogate-textarea-container-" + renderer.id,
                surrogate);

        document.body.insertBefore(surrogateContainer,
                document.body.children[0]);

        this.setWheelScrollSpeed(options.wheelScrollSpeed);
        this.setWordWrap(!options.disableWordWrap);
        this.setShowLineNumbers(!options.hideLineNumbers);
        this.setShowScrollBars(!options.hideScrollBars);
        this.setTabWidth(options.tabWidth);
        this.setTheme(options.theme);
        this.setTokenizer(options.tokenizer);
        this.setCodePage(options.codePage);
        this.setOperatingSystem(options.os);
        this.setCommandSystem(options.commands);
        this.setText(options.file);
        this.bindEvents(options.keyEventSource, options.pointerEventSource,
                options.wheelEventSource, !options.disableClipboard);

        this.themeSelect = makeSelectorFromObj("primrose-theme-selector-" +
                renderer.id, Themes, theme.name, self, "setTheme", "theme");
        this.commandSystemSelect = makeSelectorFromObj(
                "primrose-command-system-selector-" + renderer.id, Commands,
                commandSystem.name, self, "setCommandSystem",
                "command system");
        this.tokenizerSelect = makeSelectorFromObj(
                "primrose-tokenizer-selector-" +
                renderer.id, Grammar, tokenizer.name, self, "setTokenizer",
                "language syntax", Grammar);
        this.keyboardSelect = makeSelectorFromObj(
                "primrose-keyboard-selector-" +
                renderer.id, CodePage, codePage.name, self, "setCodePage",
                "localization", CodePage);
        this.operatingSystemSelect = makeSelectorFromObj(
                "primrose-operating-system-selector-" + renderer.id,
                OperatingSystem, operatingSystem.name, self,
                "setOperatingSystem",
                "shortcut style", OperatingSystem);


        //////////////////////////////////////////////////////////////////////////
        // wire up event handlers
        //////////////////////////////////////////////////////////////////////////

        window.addEventListener("resize", function () {
            changed = renderer.resize();
            setSurrogateSize();
            self.forceDraw();
        });

        setSurrogateSize();
    }

    Primrose.EDITORS = [];

    return Primrose;
})();