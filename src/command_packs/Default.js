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
    name: "DEFAULT"
};

Commands.DEFAULT["NORMAL" + Keys.LEFTARROW] = function (prim, lines, cursor) {
    cursor.left(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.LEFTARROW] = function (prim, lines, cursor) {
    cursor.skipLeft(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.RIGHTARROW] = function (prim, lines, cursor) {
    cursor.right(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.RIGHTARROW] = function (prim, lines, cursor) {
    cursor.skipRight(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.UPARROW] = function (prim, lines, cursor) {
    cursor.up(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.DOWNARROW] = function (prim, lines, cursor) {
    cursor.down(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.HOME] = function (prim, lines, cursor) {
    cursor.home(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.HOME] = function (prim, lines, cursor) {
    cursor.fullHome(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.END] = function (prim, lines, cursor) {
    cursor.end(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.END] = function (prim, lines, cursor) {
    cursor.fullEnd(lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.DOWNARROW] = function (prim, lines, cursor) {
    if (prim.scrollTop < lines.length) {
        ++prim.scrollTop;
    }
};

Commands.DEFAULT["CTRL" + Keys.UPARROW] = function (prim, lines, cursor) {
    if (prim.scrollTop > 0) {
        --prim.scrollTop;
    }
};

Commands.DEFAULT["NORMAL" + Keys.PAGEUP] = function (prim, lines, cursor) {
    cursor.incY(-prim.pageSize, lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.PAGEDOWN] = function (prim, lines, cursor) {
    cursor.incY(prim.pageSize, lines);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.DASH] = function (prim, lines, cursor) {
    prim.decreaseFontSize();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["CTRL" + Keys.EQUALSIGN] = function (prim, lines, cursor) {
    prim.increaseFontSize();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.BACKSPACE] = function (prim, lines, cursor) {
    if (prim.frontCursor.i === prim.backCursor.i) {
        prim.frontCursor.left(lines);
    }
    prim.deleteSelection();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["SHIFT" + Keys.DELETE] = function (prim, lines, cursor) {
    if (prim.frontCursor.i === prim.backCursor.i) {
        prim.frontCursor.home(lines);
        prim.backCursor.end(lines);
    }
    prim.deleteSelection();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.DELETE] = function (prim, lines, cursor) {
    if (prim.frontCursor.i === prim.backCursor.i) {
        prim.backCursor.right(lines);
    }
    prim.deleteSelection();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.ENTER] = function (prim, lines, cursor) {
    var indent = "";
    for (var i = 0; i < lines[prim.frontCursor.y].length && lines[prim.frontCursor.y][i] === " "; ++i) {
        indent += " ";
    }
    prim.insertAtCursor("\n" + indent);
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["NORMAL" + Keys.TAB] = function (prim, lines, cursor) {
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
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT["SHIFT" + Keys.TAB] = function (prim, lines, cursor) {
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
        prim.scrollIntoView(cursor);
    }
};

Commands.DEFAULT.CTRLSHIFT_e = function (prim, lines, cursor) {
    prim.getTokenizer().exec(prim.getText());
};

Commands.DEFAULT.CTRL_a = function (prim, lines, cursor) {
    prim.frontCursor.fullHome(lines);
    prim.backCursor.fullEnd(lines);
};

Commands.DEFAULT.CTRL_y = function (prim, lines, cursor) {
    prim.redo();
    prim.scrollIntoView(cursor);
};

Commands.DEFAULT.CTRL_z = function (prim, lines, cursor) {
    prim.undo();
    prim.scrollIntoView(cursor);
};