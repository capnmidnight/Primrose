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
