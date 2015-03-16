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

var OperatingSystem = (function () {
    "use strict";
    
    function setCursorCommand(obj, mod, key, func, cur) {
        var name = mod + "_" + key;
        obj[name] = function (prim, lines) {
            prim["cursor" + func](lines, prim[cur + "Cursor"]);
        };
    }
    
    function makeCursorCommand(obj, baseMod, key, func) {
        setCursorCommand(obj, baseMod || "NORMAL", key, func, "front");
        setCursorCommand(obj, baseMod + "SHIFT", key, func, "back");
    }
    
    function OperatingSystem(name, pre1, pre2, redo, pre3, home, end, pre4, fullHome, fullEnd) {
        this.name = name;

        this[pre1 + "_a"] = function (prim, lines) {
            prim.frontCursor.fullhome(lines);
            prim.backCursor.fullend(lines);
            prim.forceUpdate();
        };

        this[redo] = function (prim, lines) {
            prim.redo();
            prim.scrollIntoView(prim.frontCursor);
        };

        this[pre1 + "_z"] = function (prim, lines) {
            prim.undo();
            prim.scrollIntoView(prim.frontCursor);
        };

        this[pre1 + "_DOWNARROW"] = function (prim, lines) {
            if (prim.scroll.y < lines.length) {
                ++prim.scroll.y;
            }
            prim.forceUpdate();
        };

        this[pre1 + "_UPARROW"] = function (prim, lines) {
            if (prim.scroll.y > 0) {
                --prim.scroll.y;
            }
            prim.forceUpdate();
        };

        makeCursorCommand(this, "", "LEFTARROW", "Left");
        makeCursorCommand(this, "", "RIGHTARROW", "Right");     
        makeCursorCommand(this, "", "UPARROW", "Up");
        makeCursorCommand(this, "", "DOWNARROW", "Down");
        makeCursorCommand(this, "", "PAGEUP", "PageUp");
        makeCursorCommand(this, "", "PAGEDOWN", "PageDown");
        makeCursorCommand(this, pre2, "LEFTARROW", "SkipLeft");
        makeCursorCommand(this, pre2, "RIGHTARROW", "SkipRight");   
        makeCursorCommand(this, pre3, home, "Home");
        makeCursorCommand(this, pre3, end, "End");
        makeCursorCommand(this, pre4, fullHome, "FullHome");
        makeCursorCommand(this, pre4, fullEnd, "FullEnd");
    }

    return OperatingSystem;
})();