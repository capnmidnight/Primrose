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

// eventually, this will have configurable values for different locales.


var CodePages = {};
var Themes = {};

function Tile(i, c, bg, fg, style, weight){
    this.index = i;
    this.char = c;
    this.backColor = bg;
    this.foreColor = fg;
    this.fontStyle = style;
    this.fontWeight = weight;
}

var Commands = {};
var OperatingSystems = {};
var Keys = (function(){
    "use strict";
    return {
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
    },
    addNumPad: function(obj){
        for(var i = 0; i <= 9; ++i){
            var code = Keys["NUMPAD" + i];
            obj.NORMAL[code] = i.toString();
        }
    }
};
})();

for(var key in Keys){
    var val = Keys[key];
    if(Keys.hasOwnProperty(key) && typeof(val) === "number"){
        Keys[val] = key;
    }
}