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


// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
Commands.DEFAULT = {
    name: "Basic commands",
    CTRLSHIFT_x: function (prim, lines) {
        prim.blur();
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
Keys.makeCursorCommand(Commands.DEFAULT, "", "PAGEDOWN", "PageDown");