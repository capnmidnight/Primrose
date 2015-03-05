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

// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
OperatingSystems.WINDOWS = (function () {
    "use strict";
    return {
        name: "Windows",
        CTRL_a: function (prim, lines) {
            prim.frontCursor.fullhome(lines);
            prim.backCursor.fullend(lines);
            prim.forceUpdate();
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
            if (prim.scroll.y < lines.length) {
                ++prim.scroll.y;
            }
            prim.forceUpdate();
        },
        CTRL_UPARROW: function (prim, lines) {
            if (prim.scroll.y > 0) {
                --prim.scroll.y;
            }
            prim.forceUpdate();
        }
    };
})();

Keys.makeCursorCommand(OperatingSystems.WINDOWS, "", "HOME", "Home");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "", "END", "End");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "HOME", "FullHome");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "END", "FullEnd");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "RIGHTARROW", "SkipRight");
Keys.makeCursorCommand(OperatingSystems.WINDOWS, "CTRL", "LEFTARROW", "SkipLeft");
