/*! Primrose 2015-01-28
Copyright (C) 2015 [object Object]
https://github.com/capnmidnight/Primrose*/
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

function Cursor(i, x, y) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = false;
}

Cursor.min = function (a, b) {
    if (a.i <= b.i) {
        return a;
    }
    return b;
};

Cursor.max = function (a, b) {
    if (a.i > b.i) {
        return a;
    }
    return b;
};

Cursor.prototype.toString = function () {
    return fmt("[i:$1 x:$2 y:$3]", this.i, this.x, this.y);
};

Cursor.prototype.copy = function (cursor) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
};

Cursor.prototype.rectify = function (lines) {
    if (this.y >= lines.length) {
        this.y = lines.length - 1;
    }
    if (this.x > lines[this.y].length) {
        this.x = lines[this.y].length;
    }
};

Cursor.prototype.left = function (lines) {
    if (this.i > 0) {
        --this.i;
        --this.x;
        if (this.x < 0) {
            --this.y;
            this.x = lines[this.y].length;
        }
    }
    this.moved = true;
};

Cursor.prototype.skipleft = function (lines) {
    if (this.x === 0) {
        this.left(lines);
    }
    else {
        var x = this.x - 1;
        var line = reverse(lines[this.y].substring(0, x));
        var m = line.match(/(\s|\W)+/);
        var dx = m ? (m.index + m[0].length + 1) : line.length + 1;
        this.i -= dx;
        this.x -= dx;
    }
    this.moved = true;
};

Cursor.prototype.right = function (lines) {
    if (this.y < lines.length - 1 || this.x < lines[this.y].length) {
        ++this.i;
        ++this.x;
        if (this.x > lines[this.y].length) {
            this.x = 0;
            ++this.y;
        }
    }
    this.moved = true;
};

Cursor.prototype.skipright = function (lines) {
    if (this.x === lines[this.y].length) {
        this.right(lines);
    }
    else {
        var x = this.x + 1;
        var line = lines[this.y].substring(x);
        var m = line.match(/(\s|\W)+/);
        var dx = m ? (m.index + m[0].length + 1) : (line.length - this.x);
        this.i += dx;
        this.x += dx;
    }
    this.moved = true;
};

Cursor.prototype.home = function (lines) {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
};

Cursor.prototype.fullhome = function (lines) {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
};

Cursor.prototype.end = function (lines) {
    var dx = lines[this.y].length - this.x;
    this.i += dx;
    this.x += dx;
    this.moved = true;
};

Cursor.prototype.fullend = function (lines) {
    this.i += lines[this.y].length - this.x;
    while (this.y < lines.length - 1) {
        ++this.y;
        this.i += lines[this.y].length + 1;
    }
    this.x = lines[this.y].length;
    this.moved = true;
};

Cursor.prototype.up = function (lines) {
    if (this.y > 0) {
        --this.y;
        var dx = Math.min(0, lines[this.y].length - this.x);
        this.x += dx;
        this.i -= lines[this.y].length + 1 - dx;
    }
    this.moved = true;
};

Cursor.prototype.down = function (lines) {
    if (this.y < lines.length - 1) {
        ++this.y;
        var dx = Math.min(0, lines[this.y].length - this.x);
        this.x += dx;
        this.i += lines[this.y - 1].length + 1 + dx;
    }
    this.moved = true;
};

Cursor.prototype.setXY = function (x, y, lines) {
    this.y = Math.max(0, Math.min(lines.length - 1, y));
    this.x = Math.max(0, Math.min(lines[this.y].length, x));
    this.i = this.x;
    for (var i = 0; i < this.y; ++i) {
        this.i += lines[i].length + 1;
    }
    this.moved = true;
};

Cursor.prototype.incY = function (dy, lines) {
    this.y = Math.max(0, Math.min(lines.length - 1, this.y + dy));
    this.x = Math.max(0, Math.min(lines[this.y].length, this.x));
    this.i = this.x;
    for (var i = 0; i < this.y; ++i) {
        this.i += lines[i].length + 1;
    }
    this.moved = true;
};;/* 
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


function Grammar(name, grammar) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map(function (rule) {
        return new Rule(rule[0], rule[1]);
    });
}

function Rule(name, test) {
    this.name = name;
    this.test = test;
}

function Token(value, type, index) {
    this.value = value;
    this.type = type;
    this.index = index;
}

Grammar.prototype.tokenize = function (text) {
    // all text starts off as regular text, then gets cut up into tokens of
    // more specific type
    var tokens = [new Token(text, "regular", 0)];
    for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
            var left = tokens[j];

            if (left.type === "regular") {
                var res = rule.test.exec(tokens[j].value);
                if (res) {
                    // insert the new token into the token list
                    var midx = res[res.length - 1];
                    var start = res.index;
                    if (res.length === 2) {
                        start += res[0].indexOf(midx);
                    }
                    var mid = new Token(midx, rule.name, left.index + start);
                    tokens.splice(j + 1, 0, mid);

                    // if there is any string after the found token,
                    // reinsert it so it can be processed further.
                    var end = start + midx.length;
                    if (end < left.value.length) {
                        var right = new Token(left.value.substring(end), "regular", left.index + end);
                        tokens.splice(j + 2, 0, right);
                    }

                    // cut the newly created token out of the current string
                    if (start > 0) {
                        left.value = left.value.substring(0, start);
                        // skip the token we just created
                        ++j;
                    }
                    else {
                        tokens.splice(j, 1);
                        // no need to backup, because the next array element
                        // will be a Token and we don't need to recheck it
                    }
                }
            }
        }
    }

    // normalize tokens
    var blockOn = false;
    for (i = 0; i < tokens.length; ++i) {
        var t = tokens[i];

        if (blockOn) {
            if (t.type === "endBlockComments") {
                blockOn = false;
            }
            if (t.type !== "newlines") {
                t.type = "comments";
            }
        }
        else if (t.type === "startBlockComments") {
            blockOn = true;
            t.type = "comments";
        }
    }
    return tokens;
};;/* 
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

// eventually, this will have configurable values for different locales.


var CodePages = {};
var Themes = {};
var Commands = {};
var OperatingSystems = {};
var Keys = {
    ///////////////////////////////////////////////////////////////////////////
    // modifiers
    ///////////////////////////////////////////////////////////////////////////
    MODIFIER_KEYS: ["CTRL", "ALT", "META", "SHIFT"],
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    META_L: 91,
    META_R: 92,
    ///////////////////////////////////////////////////////////////////////////
    // whitespace
    ///////////////////////////////////////////////////////////////////////////
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SPACEBAR: 32,
    DELETE: 46,
    ///////////////////////////////////////////////////////////////////////////
    // lock keys
    ///////////////////////////////////////////////////////////////////////////
    PAUSEBREAK: 19,
    CAPSLOCK: 20,
    NUMLOCK: 144,
    SCROLLLOCK: 145,
    INSERT: 45,
    ///////////////////////////////////////////////////////////////////////////
    // navigation keys
    ///////////////////////////////////////////////////////////////////////////
    ESCAPE: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    SELECTKEY: 93,
    ///////////////////////////////////////////////////////////////////////////
    // numpad
    ///////////////////////////////////////////////////////////////////////////
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMALPOINT: 110,
    DIVIDE: 111,
    ///////////////////////////////////////////////////////////////////////////
    // function keys
    ///////////////////////////////////////////////////////////////////////////
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    setCursorCommand: function (obj, mod, key, func, cur) {
        var name = mod + "_" + key;
        obj[name] = function (prim, lines) {
            prim["cursor" + func](lines, prim[cur + "Cursor"]);
        };
    },
    makeCursorCommand: function (obj, baseMod, key, func) {
        Keys.setCursorCommand(obj, baseMod || "NORMAL", key, func, "front");
        Keys.setCursorCommand(obj, baseMod + "SHIFT", key, func, "back");
    }
};

for(var key in Keys){
    var val = Keys[key];
    if(Keys.hasOwnProperty(key) && typeof(val) === "number"){
        Keys[val] = key;
    }
};/* 
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
            browser,
            commandSystem,
            keyboardSystem,
            commandPack = {},
            tokenizer,
            theme,
            pageSize,
            gridWidth, gridHeight,
            pointerX, pointerY,
            tabWidth, tabString,
            currentTouchID,
            texture,
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
            surrogateContainer;


    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Cursor();
    this.backCursor = new Cursor();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.gridLeft = 0;
    this.currentToken = null;


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

    function setCursorXY(cursor, x, y) {
        pointerX = x;
        pointerY = y;
        var lines = this.getLines();
        var cell = this.pixel2cell(x, y);
        cursor.setXY(cell.x, cell.y, lines);
    }

    function mouseButtonDown(pointerEventSource, evt) {
        if (focused && evt.button === 0) {
            var bounds = pointerEventSource.getBoundingClientRect();
            this.startPointer(evt.clientX - bounds.left, evt.clientY - bounds.top);
            evt.preventDefault();
        }
    }

    function mouseMove(pointerEventSource, evt) {
        if (focused) {
            var bounds = pointerEventSource.getBoundingClientRect();
            this.movePointer(evt.clientX - bounds.left, evt.clientY - bounds.top);
        }
    }

    function mouseButtonUp(evt) {
        if (focused && evt.button === 0) {
            this.endPointer();
        }
    }

    function touchStart(pointerEventSource, evt) {
        if (focused && evt.touches.length > 0 && !dragging) {
            var t = evt.touches[0];
            var bounds = pointerEventSource.getBoundingClientRect();
            this.startPointer(t.clientX - bounds.left, t.clientY - bounds.top);
            currentTouchID = t.identifier;
        }
    }

    function touchMove(pointerEventSource, evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                var bounds = pointerEventSource.getBoundingClientRect();
                this.movePointer(t.clientX - bounds.left, t.clientY - bounds.top);
                break;
            }
        }
    }

    function touchEnd(evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                this.endPointer();
            }
        }
    }

    function addCommandPack(cmd) {
        if (cmd) {
            for (var key in cmd) {
                if (cmd.hasOwnProperty(key)) {
                    var func = cmd[key];
                    if (!(func instanceof Function)) {
                        func = this.insertAtCursor.bind(this, func);
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
        addCommandPack.call(this, keyboardSystem);
        addCommandPack.call(this, operatingSystem);
        addCommandPack.call(this, browser);
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
        focused = true;
    };

    this.blur = function () {
        focused = false;
    };

    this.isFocused = function () {
        return focused;
    };

    this.getCanvas = function () {
        return canvas;
    };

    this.getTexture = function (anisotropy) {
        if (!texture) {
            texture = new THREE.Texture(canvas);
            texture.anisotropy = anisotropy || 8;
            texture.needsUpdate = true;
        }
        return texture;
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
        operatingSystem = os || (isOSX ? OperatingSystems.OSX : OperatingSystems.WINDOWS);
        refreshCommandPack.call(this);
    };

    this.setCommandSystem = function (cmd) {
        commandSystem = cmd || Commands.DEFAULT;
        refreshCommandPack.call(this);
    };

    this.setSize = function (w, h) {
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        measureText.call(this);
    };

    this.getWidth = function () {
        return canvas.width;
    };

    this.getHeight = function () {
        return canvas.height;
    };

    this.setCodePage = function (cp) {
        var key, code;
        var lang = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage || navigator.broserLanguage || "en-US";
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

    this.placeSurrogateUnder = function (elem) {
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
    
    this.incCurrentToken = function(dir){        
        if(this.currentToken && this.currentToken.type === "numbers"){
            var num = parseFloat(this.currentToken.value);
            var increment = Math.pow(10, Math.floor(Math.log10(Math.abs(num))));
            if(increment >= 1){
                increment /= 10;
            }
            else if(!increment){
                increment = 0.1;
            }
            num += dir * increment;
            var text = this.getText();
            var left = text.substring(0, this.currentToken.index);
            var right = text.substring(this.currentToken.index + this.currentToken.value.length);
            if(increment < 1){
                var d = Math.ceil(-Math.log10(1.1 * increment));
                console.log(num, increment, d);
                console.log(num.toFixed(d));
                text = left + num.toFixed(d) + right;
            }
            else{
                text = left + num.toString() + right;
            }
            this.setText(text);
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

            var func = commandPack[browser + "_" + commandName] || commandPack[commandName];
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
            
            this.currentToken = null;

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
                            if(minCursor.i === maxCursor.i){
                                this.currentToken = t;
                            }
                            var selectionFront = Cursor.max(minCursor, tokenFront);
                            var selectionBack = Cursor.min(maxCursor, tokenBack);
                            var cw = selectionBack.i - selectionFront.i;
                            gfx.fillStyle = theme.regular.selectedBackColor || Themes.DEFAULT.regular.selectedBackColor;
                            gfx.fillRect(
                                    (selectionFront.x - this.scrollLeft + this.gridLeft) * this.characterWidth,
                                    (selectionFront.y - this.scrollTop + 0.2) * this.characterHeight,
                                    cw * this.characterWidth + 1,
                                    this.characterHeight + 1);
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

            if (pointerX) {
                gfx.beginPath();
                gfx.strokeStyle = "#ff0000";
                gfx.moveTo(pointerX - 5, pointerY);
                gfx.lineTo(pointerX + 5, pointerY);
                gfx.moveTo(pointerX, pointerY - 5);
                gfx.lineTo(pointerX, pointerY + 5);
                gfx.stroke();
            }

            if (texture) {
                texture.needsUpdate = true;
            }
        }
    };

    this.readWheel = function (evt) {
        if (focused) {
            this.scrollTop += Math.floor(evt.deltaY / this.characterHeight);
            if (this.scrollTop < 0) {
                this.scrollTop = 0;
            }
            evt.preventDefault();
            this.drawText();
        }
    };

    this.startPointer = function (x, y) {
        setCursorXY.call(this, this.frontCursor, x, y);
        this.backCursor.copy(this.frontCursor);
        dragging = true;
        this.drawText();
    };

    this.movePointer = function (x, y) {
        if (dragging) {
            setCursorXY.call(this, this.backCursor, x, y);
            this.drawText();
        }
    };

    this.endPointer = function () {
        dragging = false;
        surrogate.focus();
    };

    this.bindEvents = function (keyEventSource, pointerEventSource) {
        if (keyEventSource) {
            keyEventSource.addEventListener("keydown", this.editText.bind(this));
        }

        if (pointerEventSource) {
            pointerEventSource.addEventListener("wheel", this.readWheel.bind(this));
            pointerEventSource.addEventListener("mousedown", mouseButtonDown.bind(this, pointerEventSource));
            pointerEventSource.addEventListener("mousemove", mouseMove.bind(this, pointerEventSource));
            pointerEventSource.addEventListener("mouseup", mouseButtonUp.bind(this));
            pointerEventSource.addEventListener("touchstart", touchStart.bind(this, pointerEventSource));
            pointerEventSource.addEventListener("touchmove", touchMove.bind(this, pointerEventSource));
            pointerEventSource.addEventListener("touchend", touchEnd.bind(this));
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

    this.setTabWidth(options.tabWidth);
    this.setTheme(options.theme);
    this.setTokenizer(options.tokenizer);
    this.setCodePage(options.codePage);
    this.setOperatingSystem(options.os);
    this.setCommandSystem(options.commands);
    this.setText(options.file);
    this.bindEvents(options.keyEventSource, options.pointerEventSource);

    this.themeSelect = makeSelectorFromObj("primrose-theme-selector-" + canvasID, Themes, theme.name, this, "setTheme", "theme");
    this.tokenizerSelect = makeSelectorFromObj("primrose-tokenizer-selector-" + canvasID, Grammar, tokenizer.name, this, "setTokenizer", "language syntax");
    this.keyboardSelect = makeSelectorFromObj("primrose-keyboard-selector-" + canvasID, CodePages, codePage.name, this, "setCodePage", "localization");
    this.commandSystemSelect = makeSelectorFromObj("primrose-command-system-selector-" + canvasID, Commands, commandSystem.name, this, "setCommandSystem", "sommand system");
    this.operatingSystemSelect = makeSelectorFromObj("primrose-operating-system-selector-" + canvasID, OperatingSystems, operatingSystem.name, this, "setOperatingSystem", "shortcut style");


    //////////////////////////////////////////////////////////////////////////
    // wire up event handlers
    //////////////////////////////////////////////////////////////////////////

    window.addEventListener("resize", measureText.bind(this));

    surrogate.addEventListener("copy", this.copySelectedText.bind(this));
    surrogate.addEventListener("cut", this.cutSelectedText.bind(this));
    surrogate.addEventListener("paste", readClipboard.bind(this));
};/* 
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

CodePages.DE_QWERTZ = {
    name: "Deutsch: QWERTZ",
    language: "de",
    deadKeys: [220, 221, 160, 192],
    NORMAL: {
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "60": "<",
        "63": "ß",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "160": function (prim) {
            prim.setDeadKeyState("DEAD3");
        },
        "163": "#",
        "171": "+",
        "173": "-",
        "186": "ü",
        "187": "+",
        "188": ",",
        "189": "-",
        "190": ".",
        "191": "#",
        "192": function (prim) {
            prim.setDeadKeyState("DEAD4");
        },
        "219": "ß",
        "220": function (prim) {
            prim.setDeadKeyState("DEAD1");
        },
        "221": function (prim) {
            prim.setDeadKeyState("DEAD2");
        },
        "222": "ä",
        "226": "<"
    },
    DEAD1NORMAL: {
        "65": "â",
        "69": "ê",
        "73": "î",
        "79": "ô",
        "85": "û",
        "190": "."
    },
    DEAD2NORMAL: {
        "65": "á",
        "69": "é",
        "73": "í",
        "79": "ó",
        "83": "s",
        "85": "ú",
        "89": "ý"
    },
    SHIFT: {
        "48": "=",
        "49": "!",
        "50": "\"",
        "51": "§",
        "52": "$",
        "53": "%",
        "54": "&",
        "55": "/",
        "56": "(",
        "57": ")",
        "60": ">",
        "63": "?",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "163": "'",
        "171": "*",
        "173": "_",
        "186": "Ü",
        "187": "*",
        "188": ";",
        "189": "_",
        "190": ":",
        "191": "'",
        "192": "Ö",
        "219": "?",
        "222": "Ä",
        "226": ">"
    },
    CTRLALT: {
        "48": "}",
        "50": "²",
        "51": "³",
        "55": "{",
        "56": "[",
        "57": "]",
        "60": "|",
        "63": "\\",
        "69": "€",
        "77": "µ",
        "81": "@",
        "171": "~",
        "187": "~",
        "219": "\\",
        "226": "|"
    },
    CTRLALTSHIFT: {
        "63": "ẞ",
        "219": "ẞ"
    },
    DEAD3NORMAL: {
        "65": "a",
        "69": "e",
        "73": "i",
        "79": "o",
        "85": "u",
        "190": "."
    },
    DEAD4NORMAL: {
        "65": "a",
        "69": "e",
        "73": "i",
        "79": "o",
        "83": "s",
        "85": "u",
        "89": "y"
    }
};;/* 
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

CodePages.EN_UKX = {
    name: "English: UK Extended",
    language: "en-GB",
    CTRLALT: {
        "52": "€",
        "65": "á",
        "69": "é",
        "73": "í",
        "79": "ó",
        "85": "ú",
        "163": "\\",
        "192": "¦",
        "222": "\\",
        "223": "¦"
    },
    CTRLALTSHIFT: {
        "65": "Á",
        "69": "É",
        "73": "Í",
        "79": "Ó",
        "85": "Ú",
        "222": "|"
    },
    NORMAL: {
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "59": ";",
        "61": "=",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "163": "#",
        "173": "-",
        "186": ";",
        "187": "=",
        "188": ",",
        "189": "-",
        "190": ".",
        "191": "/",
        "192": "'",
        "219": "[",
        "220": "\\",
        "221": "]",
        "222": "#",
        "223": "`"
    },
    SHIFT: {
        "48": ")",
        "49": "!",
        "50": "\"",
        "51": "£",
        "52": "$",
        "53": "%",
        "54": "^",
        "55": "&",
        "56": "*",
        "57": "(",
        "59": ":",
        "61": "+",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "163": "~",
        "173": "_",
        "186": ":",
        "187": "+",
        "188": "<",
        "189": "_",
        "190": ">",
        "191": "?",
        "192": "@",
        "219": "{",
        "220": "|",
        "221": "}",
        "222": "~",
        "223": "¬"
    }
};;/* 
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

CodePages.EN_US = {
    name: "English: USA",
    language: "en-US",
    NORMAL: {
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "59": ";",
        "61": "=",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "173": "-",
        "186": ";",
        "187": "=",
        "188": ",",
        "189": "-",
        "190": ".",
        "191": "/",
        "219": "[",
        "220": "\\",
        "221": "]",
        "222": "'"
    },
    SHIFT: {
        "48": ")",
        "49": "!",
        "50": "@",
        "51": "#",
        "52": "$",
        "53": "%",
        "54": "^",
        "55": "&",
        "56": "*",
        "57": "(",
        "59": ":",
        "61": "+",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "173": "_",
        "186": ":",
        "187": "+",
        "188": "<",
        "189": "_",
        "190": ">",
        "191": "?",
        "219": "{",
        "220": "|",
        "221": "}",
        "222": "\""
    }
};;/* 
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

CodePages.FR_AZERTY = {
    name: "Français: AZERTY",
    language: "fr",
    deadKeys: [221, 50, 55],
    NORMAL: {
        "48": "à",
        "49": "&",
        "50": "é",
        "51": "\"",
        "52": "'",
        "53": "(",
        "54": "-",
        "55": "è",
        "56": "_",
        "57": "ç",
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z",
        "186": "$",
        "187": "=",
        "188": ",",
        "190": ";",
        "191": ":",
        "192": "ù",
        "219": ")",
        "220": "*",
        "221": function (prim) {
            prim.setDeadKeyState("DEAD1");
        },
        "222": "²",
        "223": "!",
        "226": "<"
    },
    SHIFT: {
        "48": "0",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "53": "5",
        "54": "6",
        "55": "7",
        "56": "8",
        "57": "9",
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z",
        "186": "£",
        "187": "+",
        "188": "?",
        "190": ".",
        "191": "/",
        "192": "%",
        "219": "°",
        "220": "µ",
        "223": "§",
        "226": ">"
    },
    CTRLALT: {
        "48": "@",
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        },
        "51": "#",
        "52": "{",
        "53": "[",
        "54": "|",
        "55": function (prim) {
            prim.setDeadKeyState("DEAD3");
        },
        "56": "\\",
        "57": "^",
        "69": "€",
        "186": "¤",
        "187": "}",
        "219": "]"
    },
    DEAD1NORMAL: {
        "65": "â",
        "69": "ê",
        "73": "î",
        "79": "ô",
        "85": "û"
    },
    DEAD2NORMAL: {
        "65": "ã",
        "78": "ñ",
        "79": "õ"
    },
    DEAD2CTRLALT: {
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        },
        "55": function (prim) {
            prim.setDeadKeyState("DEAD3");
        }
    },
    DEAD1CTRLALT: {
        "50": function (prim) {
            prim.setDeadKeyState("DEAD2");
        }
    },
    DEAD3NORMAL: {
        "48": "à",
        "50": "é",
        "55": "è",
        "65": "à",
        "69": "è",
        "73": "ì",
        "79": "ò",
        "85": "ù"
    }
};;/* 
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


// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
Commands.DEFAULT = {
    name: "Basic commands",
    NORMAL_SPACEBAR: " ",
    SHIFT_SPACEBAR: " ",
    NORMAL_BACKSPACE: function (prim, lines) {
        if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.left(lines);
        }
        prim.deleteSelection();
        prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_ENTER: function (prim, lines) {
        var indent = "";
        for (var i = 0; i < lines[prim.frontCursor.y].length && lines[prim.frontCursor.y][i] === " "; ++i) {
            indent += " ";
        }
        prim.insertAtCursor("\n" + indent);
        prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_DELETE: function (prim, lines) {
        if (prim.frontCursor.i === prim.backCursor.i) {
            prim.backCursor.right(lines);
        }
        prim.deleteSelection();
        prim.scrollIntoView(prim.frontCursor);
    },
    SHIFT_DELETE: function (prim, lines) {
        if (prim.frontCursor.i === prim.backCursor.i) {
            prim.frontCursor.home(lines);
            prim.backCursor.end(lines);
        }
        prim.deleteSelection();
        prim.scrollIntoView(prim.frontCursor);
    },
    NORMAL_TAB: function (prim, lines) {
        var ts = prim.getTabString();
        if (prim.frontCursor.y === prim.backCursor.y && prim.frontCursor.x !== 0) {
            prim.insertAtCursor(ts);
        }
        else {
            var a = Cursor.min(prim.frontCursor, prim.backCursor);
            var b = Cursor.max(prim.frontCursor, prim.backCursor);
            a.home(lines);
            b.end(lines);
            for (var y = a.y; y <= b.y; ++y) {
                lines[y] = ts + lines[y];
            }
            a.setXY(0, a.y, lines);
            b.setXY(0, b.y, lines);
            b.end(lines);
            prim.pushUndo(lines);
        }
        prim.scrollIntoView(prim.frontCursor);
    },
    SHIFT_TAB: function (prim, lines) {
        var a = Cursor.min(prim.frontCursor, prim.backCursor);
        var b = Cursor.max(prim.frontCursor, prim.backCursor);
        a.home(lines);
        b.home(lines);
        var tw = prim.getTabWidth();
        var ts = prim.getTabString();
        var edited = false;
        for (var y = a.y; y <= b.y; ++y) {
            if (lines[y].substring(0, tw) === ts) {
                lines[y] = lines[y].substring(tw);
                edited = true;
            }
        }
        if (edited) {
            a.setXY(0, a.y, lines);
            b.setXY(0, b.y, lines);
            b.end(lines);
            prim.pushUndo(lines);
            prim.scrollIntoView(prim.frontCursor);
        }
    }
};

Keys.makeCursorCommand(Commands.DEFAULT, "", "LEFTARROW", "Left");
Keys.makeCursorCommand(Commands.DEFAULT, "", "RIGHTARROW", "Right");
Keys.makeCursorCommand(Commands.DEFAULT, "", "UPARROW", "Up");
Keys.makeCursorCommand(Commands.DEFAULT, "", "DOWNARROW", "Down");
Keys.makeCursorCommand(Commands.DEFAULT, "", "PAGEUP", "PageUp");
Keys.makeCursorCommand(Commands.DEFAULT, "", "PAGEDOWN", "PageDown");;/*
 https://www.github.com/capnmidnight/VR
 Copyright (c) 2014 - 2015 Sean T. McBeth <sean@seanmcbeth.com>
 All rights reserved.
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Pyschologist.js: so named because it keeps me from going crazy


function makeURL(url, queryMap) {
    var output = [];
    for (var key in queryMap) {
        if (queryMap.hasOwnProperty(key) && !(queryMap[key] instanceof Function)) {
            output.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryMap[key]));
        }
    }
    return url + "?" + output.join("&");
}

function XHR(url, method, type, progress, error, success, data) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = error;
    xhr.onabort = error;
    xhr.onprogress = progress;
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (success) {
                success(xhr.response);
            }
        }
        else if (error) {
            error();
        }
    };

    xhr.open(method, url);
    if (type) {
        xhr.responseType = type;
    }
    if (data) {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    }
    else {
        xhr.send();
    }
}

function GET(url, type, progress, error, success) {
    type = type || "text";
    XHR(url, "GET", type, progress, error, success);
}


function POST(url, data, type, progress, error, success) {
    XHR(url, "POST", type, progress, error, success, data);
}

function getObject(url, progress, error, success) {
    var progressThunk = success && error && progress,
            errorThunk = (success && error) || (error && progress),
            successThunk = success || error || progress;
    GET(url, "json", progressThunk, errorThunk, successThunk);
}

function sendObject(url, data, progress, error, success) {
    POST(url, data, "json",
            success && error && progress,
            (success && error) || (error && progress),
            success || error || progress);
}

// Utility functions for testing out event handlers. Meant only for learning
// about new APIs.
function XXX(msg, v) {
    return new Error(fmt("$1. Was given $2$3$2", msg, v ? '"' : "", v));
}

function E(elem, evt, thunk) {
    if (!elem || !elem.addEventListener) {
        throw XXX("must supply an element with an addEventListener method", elem);
    }
    if (!evt || typeof (evt) !== "string") {
        throw XXX("must provide the name of an event", evt);
    }

    if (!thunk) {
        thunk = console.log.bind(console, fmt("$1.$2", elem.tagName, evt));
    }

    elem.addEventListener(evt, thunk);
}

// Applying Array's slice method to array-like objects. Called with
// no parameters, this function converts array-like objects into
// JavaScript Arrays.
function arr(arg, a, b) {
    return Array.prototype.slice.call(arg, a, b);
}

function map(arr, fun) {
    return Array.prototype.map.call(arr, fun);
}

function reduce(arr, fun, base) {
    return Array.prototype.reduce.call(arr, fun, base);
}

function filter(arr, fun) {
    return Array.prototype.filter.call(arr, fun);
}

function ofType(arr, t) {
    if (typeof (t) === "function") {
        return filter(arr, function (elem) {
            return elem instanceof t;
        });
    }
    else {
        return filter(arr, function (elem) {
            return typeof (elem) === t;
        });
    }
}

function agg(arr, get, red) {
    if (typeof (get) !== "function") {
        get = (function (key, obj) {
            return obj[key];
        }).bind(window, get);
    }
    return arr.map(get).reduce(red);
}

function add(a, b) {
    return a + b;
}

function sum(arr, get) {
    return agg(arr, get, add);
}

function group(arr, getKey, getValue) {
    var groups = [];
    // we don't want to modify the original array.
    var clone = arr.slice();

    // Sorting the array by the group key criteeria first 
    // simplifies the grouping step. With a sorted array
    // by the keys, grouping can be done in a single pass.
    clone.sort(function (a, b) {
        var ka = getKey ? getKey(a) : a;
        var kb = getKey ? getKey(b) : b;
        if (ka < kb) {
            return -1;
        }
        else if (ka > kb) {
            return 1;
        }
        return 0;
    });

    for (var i = 0; i < clone.length; ++i) {
        var obj = clone[i];
        var key = getKey ? getKey(obj) : obj;
        var val = getValue ? getValue(obj) : obj;
        if (groups.length === 0 || groups[groups.length - 1].key !== key) {
            groups.push({key: key, values: []});
        }
        groups[groups.length - 1].values.push(val);
    }
    return groups;
}

// unicode-aware string reverse
var reverse = function (str) {
    str = str.replace(reverse.combiningMarks, function (match, capture1, capture2) {
        return reverse(capture2) + capture1;
    })
            .replace(reverse.surrogatePair, "$2$1");
    var res = "";
    for (var i = str.length - 1; i >= 0; --i) {
        res += str[i];
    }
    return res;
};
reverse.combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
reverse.surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

// An object inspection function.
function help(obj) {
    var funcs = {};
    var props = {};
    var evnts = [];
    if (obj) {
        for (var field in obj) {
            if (field.indexOf("on") === 0 && (obj !== navigator || field !== "onLine")) {
                // `online` is a known element that is not an event, but looks like
                // an event to the most basic assumption.
                evnts.push(field.substring(2));
            }
            else if (typeof (obj[field]) === "function") {
                funcs[field] = obj[field];
            }
            else {
                props[field] = obj[field];
            }
        }

        var type = typeof (obj);
        if (type === "function") {
            type = obj.toString().match(/(function [^(]*)/)[1];
        }
        else if (type === "object") {
            type = null;
            if (obj.constructor && obj.constructor.name) {
                type = obj.constructor.name;
            }
            else {
                var q = [{prefix: "", obj: window}];
                var traversed = [];
                while (q.length > 0 && type === null) {
                    var parentObject = q.shift();
                    parentObject.___traversed___ = true;
                    traversed.push(parentObject);
                    for (field in parentObject.obj) {
                        var testObject = parentObject.obj[field];
                        if (testObject) {
                            if (typeof (testObject) === "function") {
                                if (testObject.prototype && obj instanceof testObject) {
                                    type = parentObject.prefix + field;
                                    break;
                                }
                            }
                            else if (!testObject.___tried___) {
                                q.push({prefix: parentObject.prefix + field + ".", obj: testObject});
                            }
                        }
                    }
                }
                traversed.forEach(function (o) {
                    delete o.___traversed___;
                });
            }
        }
        obj = {
            type: type,
            events: evnts,
            functions: funcs,
            properties: props
        };

        console.debug(obj);

        return obj;
    }
    else {
        console.warn("Object was falsey.");
    }
}

/*
 * 1) If id is a string, tries to find the DOM element that has said ID
 *      a) if it exists, and it matches the expected tag type, returns the
 *          element, or throws an error if validation fails.
 *      b) if it doesn't exist, creates it and sets its ID to the provided
 *          id, then returns the new DOM element, not yet placed in the
 *          document anywhere.
 * 2) If id is a DOM element, validates that it is of the expected type,
 *      a) returning the DOM element back if it's good,
 *      b) or throwing an error if it is not
 * 3) If id is null, creates the DOM element to match the expected type.
 * @param {string|DOM element|null} id
 * @param {string} tag name
 * @param {function} DOMclass
 * @returns DOM element
 */
function cascadeElement(id, tag, DOMClass) {
    var elem = null;
    if (id === null) {
        elem = document.createElement(tag);
    }
    else if (DOMClass === undefined || id instanceof DOMClass) {
        elem = id;
    }
    else if (typeof (id) === "string") {
        elem = document.getElementById(id);
        if (elem === null) {
            elem = document.createElement(tag);
            elem.id = id;
        }
        else if (elem.tagName !== tag.toUpperCase()) {
            elem = null;
        }
    }

    if (elem === null) {
        throw new Error(id + " does not refer to a valid " + tag + " element.");
    }
    else {
        elem.innerHTML = "";
    }
    return elem;
}

/*
 Replace template place holders in a string with a positional value.
 Template place holders start with a dollar sign ($) and are followed
 by a digit that references the parameter position of the value to 
 use in the text replacement. Note that the first position, position 0,
 is the template itself. However, you cannot reference the first position,
 as zero digit characters are used to indicate the width of number to
 pad values out to.
 
 Numerical precision padding is indicated with a period and trailing
 zeros.
 
 examples:
 fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
 fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
 fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001) 
 => "1.41 + 3.14 = 9001.00"
 fmt("$001.000", Math.PI) => 003.142
 */
function fmt(template) {
    // - match a dollar sign ($) literally, 
    // - (optional) then zero or more zero digit (0) characters, greedily
    // - then one or more digits (the previous rule would necessitate that
    //      the first of these digits be at least one).
    // - (optional) then a period (.) literally
    // -            then one or more zero digit (0) characters
    var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
    var args = arguments;
    return template.replace(paramRegex, function (m, pad, index, precision) {
        index = parseInt(index, 10);
        if (0 <= index && index < args.length) {
            var val = args[index];
            if (val !== null && val !== undefined) {
                if (val instanceof Date && precision) {
                    switch (precision.length) {
                        case 1:
                            val = val.getYear();
                            break;
                        case 2:
                            val = (val.getMonth() + 1) + "/" + val.getYear();
                            break;
                        case 3:
                            val = val.toLocaleDateString();
                            break;
                        case 4:
                            val = fmt.addMillis(val, val.toLocaleTimeString());
                            break;
                        case 5:
                        case 6:
                            val = val.toLocaleString();
                            break;
                        default:
                            val = fmt.addMillis(val, val.toLocaleString());
                            break;
                    }
                    return val;
                }
                else {
                    if (precision && precision.length > 0) {
                        val = sigfig(val, precision.length);
                    }
                    else {
                        val = val.toString();
                    }
                    if (pad && pad.length > 0) {
                        var paddingRegex = new RegExp("^\\d{" + (pad.length + 1) + "}(\\.\\d+)?");
                        while (!paddingRegex.test(val)) {
                            val = "0" + val;
                        }
                    }
                    return val;
                }
            }
        }
        return undefined;
    });
}

fmt.addMillis = function (val, txt) {
    return txt.replace(/( AM| PM|$)/, function (match, g1) {
        return (val.getMilliseconds() / 1000).toString().substring(1) + g1;
    });
};

function sigfig(x, y) {
    var p = Math.pow(10, y);
    var v = (Math.round(x * p) / p).toString();
    if (y > 0) {
        var i = v.indexOf(".");
        if (i === -1) {
            v += ".";
            i = v.length - 1;
        }
        while (v.length - i - 1 < y)
            v += "0";
    }
    return v;
}

var px = fmt.bind(this, "$1px");
var pct = fmt.bind(this, "$1%");
var ems = fmt.bind(this, "$1em");

function findEverything(elem, obj) {
    elem = elem || document;
    obj = obj || {};
    var arr = elem.querySelectorAll("*");
    for (var i = 0; i < arr.length; ++i) {
        var e = arr[i];
        if (e.id && e.id.length > 0) {
            obj[e.id] = e;
            if (e.parentElement) {
                e.parentElement[e.id] = e;
            }
        }
    }
    return obj;
}

function inherit(classType, parentType) {
    classType.prototype = Object.create(parentType.prototype);
    classType.prototype.constructor = classType;
}

function getSetting(name, defValue) {
    if (window.localStorage) {
        var val = window.localStorage.getItem(name);
        if (val) {
            try {
                return JSON.parse(val);
            }
            catch (exp) {
                console.error("getSetting", name, val, typeof (val), exp);
            }
        }
    }
    return defValue;
}

function setSetting(name, val) {
    if (window.localStorage && val) {
        try {
            window.localStorage.setItem(name, JSON.stringify(val));
        }
        catch (exp) {
            console.error("setSetting", name, val, typeof (val), exp);
        }
    }
}

function deleteSetting(name) {
    if (window.localStorage) {
        window.localStorage.removeItem(name);
    }
}

function readForm(ctrls) {
    var state = {};
    if (ctrls) {
        for (var name in ctrls) {
            var c = ctrls[name];
            if ((c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
                if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
                    state[name] = c.value;
                }
                else if (c.type === "checkbox" || c.type === "radio") {
                    state[name] = c.checked;
                }
            }
        }
    }
    return state;
}

function writeForm(ctrls, state) {
    if (state) {
        for (var name in ctrls) {
            var c = ctrls[name];
            if (state[name] !== null && state[name] !== undefined && (c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
                if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
                    c.value = state[name];
                }
                else if (c.type === "checkbox" || c.type === "radio") {
                    c.checked = state[name];
                }
            }
        }
    }
}

function reloadPage() {
    document.location = document.location.href;
}

function makeSelectorFromObj(id, obj, def, target, prop, lbl) {
    var elem = cascadeElement(id, "select", HTMLSelectElement);
    var items = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var opt = document.createElement("option");
            var val = obj[key].name || key;
            opt.innerHTML = val;
            items.push(obj[key]);
            if (val === def) {
                opt.selected = "selected";
            }
            elem.appendChild(opt);
        }
    }

    if (target[prop] instanceof Function) {
        E(elem, "change", function () {
            target[prop](items[elem.selectedIndex]);
        });
    }
    else {

        E(elem, "change", function () {
            target[prop] = items[elem.selectedIndex];
        });
    }

    var container = cascadeElement("container -" + id, "div", HTMLDivElement);
    var label = cascadeElement("label-" + id, "span", HTMLSpanElement);
    label.innerHTML = " - " + lbl;
    label.for = elem;
    elem.title = lbl;
    elem.alt = lbl;
    container.appendChild(elem);
    container.appendChild(label);
    return container;
}

function makeHidingContainer(id, obj) {
    var elem = cascadeElement(id, "div", HTMLDivElement);
    elem.style.position = "absolute";
    elem.style.left = 0;
    elem.style.top = 0;
    elem.style.width = 0;
    elem.style.height = 0;
    elem.style.overflow = "hidden";
    elem.appendChild(obj);
    return elem;
}

// snagged and adapted from http://detectmobilebrowsers.com/
var isMobile = (function (a) {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera),
        isiOS = /Apple-iP(hone|od|ad)/.test(navigator.userAgent || ""),
        isOSX = /Macintosh/.test(navigator.userAgent || ""),
        isWindows = /Windows/.test(navigator.userAgent || ""),
        isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        isFirefox = typeof InstallTrigger !== 'undefined',
        isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        isChrome = !!window.chrome && !isOpera,
        isIE = /*@cc_on!@*/false || !!document.documentMode;


navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

// this doesn't seem to actually work
screen.lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || function () {
};

// full-screen-ism polyfill
if (!document.documentElement.requestFullscreen) {
    if (document.documentElement.msRequestFullscreen) {
        document.documentElement.requestFullscreen = document.documentElement.msRequestFullscreen;
        document.exitFullscreen = document.msExitFullscreen;
    }
    else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.requestFullscreen = document.documentElement.mozRequestFullScreen;
        document.exitFullscreen = document.mozCancelFullScreen;
    }
    else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.requestFullscreen = document.documentElement.webkitRequestFullscreen;
        document.exitFullscreen = document.webkitExitFullscreen;
    }
}

function isFullScreenMode() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function requestFullScreen(vrDisplay, success) {
    if (vrDisplay instanceof Function) {
        success = vrDisplay;
        vrDisplay = null;
    }
    if (!isFullScreenMode()) {
        if (vrDisplay) {
            document.documentElement.requestFullscreen({vrDisplay: vrDisplay});
        }
        else {
            document.documentElement.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        var interval = setInterval(function () {
            if (isFullScreenMode()) {
                clearInterval(interval);
                screen.lockOrientation("landscape-primary");
                if (success) {
                    success();
                }
            }
        }, 1000);
    }
    else if (success) {
        success();
    }
}

function exitFullScreen() {
    if (isFullScreenMode()) {
        document.exitFullscreen();
    }
}

function toggleFullScreen() {
    if (document.documentElement.requestFullscreen) {
        if (isFullScreenMode()) {
            exitFullScreen();
        }
        else {
            requestFullScreen();
        }
    }
}

function addFullScreenShim() {
    var elems = arr(arguments);
    elems = elems.map(function (e) {
        return {
            elem: e,
            events: help(e).events
        };
    });

    function removeFullScreenShim() {
        elems.forEach(function (elem) {
            elem.events.forEach(function (e) {
                elem.elem.removeEventListener(e, fullScreenShim);
            });
        });
    }

    function fullScreenShim(evt) {
        requestFullScreen(removeFullScreenShim);
    }

    elems.forEach(function (elem) {
        elem.events.forEach(function (e) {
            if (e.indexOf("fullscreenerror") < 0) {
                elem.elem.addEventListener(e, fullScreenShim, false);
            }
        });
    });
}

var exitPointerLock = (document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock || function () {
}).bind(document);
function isPointerLocked() {
    return !!(document.pointerLockElement || document.webkitPointerLockElement || document.mozPointerLockElement);
}
var requestPointerLock = (document.documentElement.requestPointerLock || document.documentElement.webkitRequestPointerLock || document.documentElement.mozRequestPointerLock || function () {
}).bind(document.documentElement);;/* 
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

Grammar.JavaScript = new Grammar("JavaScript", [
    ["newlines", /(?:\r\n|\r|\n)/],
    ["comments", /\/\/.*$/],
    ["startBlockComments", /\/\*/],
    ["endBlockComments", /\*\//],
    ["strings", /"(?:\\"|[^"]*)"/],
    ["strings", /'(?:\\'|[^']*)'/],
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/],
    ["functions", /(\w+)(?:\s*\()/],
    ["members", /(?:(?:\w+\.)+)(\w+)/]
]);;/* 
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


// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
OperatingSystems.OSX = {
    name: "OSX",
    META_a: function (prim, lines) {
        prim.frontCursor.fullhome(lines);
        prim.backCursor.fullend(lines);
    },
    METASHIFT_z: function (prim, lines) {
        prim.redo();
        prim.scrollIntoView(prim.frontCursor);
    },
    META_z: function (prim, lines) {
        prim.undo();
        prim.scrollIntoView(prim.frontCursor);
    },
    META_DOWNARROW: function (prim, lines) {
        if (prim.scrollTop < lines.length) {
            ++prim.scrollTop;
        }
    },
    META_UPARROW: function (prim, lines) {
        if (prim.scrollTop > 0) {
            --prim.scrollTop;
        }
    }
};

Keys.makeCursorCommand(OperatingSystems.OSX, "META", "LEFTARROW", "Home");
Keys.makeCursorCommand(OperatingSystems.OSX, "META", "RIGHTARROW", "End");
Keys.makeCursorCommand(OperatingSystems.OSX, "META", "UPARROW", "FullHome");
Keys.makeCursorCommand(OperatingSystems.OSX, "META", "DOWNARROW", "FullEnd");
Keys.makeCursorCommand(OperatingSystems.OSX, "ALT", "RIGHTARROW", "SkipRight");
Keys.makeCursorCommand(OperatingSystems.OSX, "ALT", "LEFTARROW", "SkipLeft");
;/* 
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

// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
OperatingSystems.WINDOWS = {
    name: "Windows",
    CTRL_a: function (prim, lines) {
        prim.frontCursor.fullhome(lines);
        prim.backCursor.fullend(lines);
    },
    CTRL_y: function (prim, lines) {
        prim.redo();
        prim.scrollIntoView(prim.frontCursor);
    },
    CTRL_z: function (prim, lines) {
        prim.undo();
        prim.scrollIntoView(prim.frontCursor);
    },
    CTRL_DOWNARROW: function (prim, lines) {
        if (prim.scrollTop < lines.length) {
            ++prim.scrollTop;
        }
    },
    CTRL_UPARROW: function (prim, lines) {
        if (prim.scrollTop > 0) {
            --prim.scrollTop;
        }
    },
    ALTSHIFT_LEFTARROW: function (prim, lines) {
        prim.incCurrentToken(-1);
    },
    ALTSHIFT_RIGHTARROW: function (prim, lines) {
        prim.incCurrentToken(1);
    }
};

Keys.makeCursorCommand(OperatingSystems.WINDOWS, "", "HOME", "Home");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "", "END", "End");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "HOME", "FullHome");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "END", "FullEnd");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "RIGHTARROW", "SkipRight");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "LEFTARROW", "SkipLeft");
;/* 
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

Themes.Dark = {
    name: "Dark",
    fontFamily: "monospace",
    cursorColor: "white",
    fontSize: 14,
    regular: {
        backColor: "black",
        foreColor: "#c0c0c0",
        selectedBackColor: "#404040",
        selectedForeColor: "#ffffff"
    },
    strings: {
        foreColor: "#aa9900",
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
};;/* 
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

Themes.DEFAULT = {
    name: "Light",
    fontFamily: "monospace",
    cursorColor: "black",
    fontSize: 14,
    regular: {
        backColor: "white",
        foreColor: "black",
        selectedBackColor: "#c0c0c0",
        selectedForeColor: "#000000"
    },
    strings: {
        foreColor: "#aa9900",
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
};