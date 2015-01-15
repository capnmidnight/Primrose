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
OSCommands.OSX = {
    name: "OSX",
    METASHIFT_e: function (prim, lines) {
        prim.getTokenizer().exec(prim.getText());
    },
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
    }
};

Keys.makeCursorCommand(OSCommands.OSX, "META", "LEFTARROW", "Home");
Keys.makeCursorCommand(OSCommands.OSX, "META", "RIGHTARROW", "End");
Keys.makeCursorCommand(OSCommands.OSX, "META", "LEFTARROW", "FullHome");
Keys.makeCursorCommand(OSCommands.OSX, "META", "RIGHTARROW", "FullEnd");
Keys.makeCursorCommand(OSCommands.OSX, "ALT", "RIGHTARROW", "SkipRight");
Keys.makeCursorCommand(OSCommands.OSX, "ALT", "LEFTARROW", "SkipLeft");