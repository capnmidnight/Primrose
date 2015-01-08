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

var Commands = {};

Commands["NORMAL" + Keys.LEFTARROW] = function (lines) {
    this.bothCursors.left(lines);
};

Commands["SHIFT" + Keys.LEFTARROW] = function (lines) {
    this.backCursor.left(lines);
};

Commands["CTRL" + Keys.LEFTARROW] = function (lines) {
    this.bothCursors.skipLeft(lines);
};

Commands["CTRLSHIFT" + Keys.LEFTARROW] = function (lines) {
    this.backCursor.skipLeft(lines);
};

Commands["NORMAL" + Keys.RIGHTARROW] = function (lines) {
    this.bothCursors.right(lines);
};

Commands["SHIFT" + Keys.RIGHTARROW] = function (lines) {
    this.backCursor.right(lines);
};

Commands["CTRL" + Keys.RIGHTARROW] = function (lines) {
    this.bothCursors.skipRight(lines);
};

Commands["CTRLSHIFT" + Keys.RIGHTARROW] = function (lines) {
    this.backCursor.skipRight(lines);
};

Commands["NORMAL" + Keys.UPARROW] = function (lines) {
    this.bothCursors.up(lines);
};

Commands["SHIFT" + Keys.UPARROW] = function (lines) {
    this.backCursor.up(lines);
};

Commands["NORMAL" + Keys.DOWNARROW] = function (lines) {
    this.bothCursors.down(lines);
};

Commands["SHIFT" + Keys.DOWNARROW] = function (lines) {
    this.backCursor.down(lines);
};

Commands["NORMAL" + Keys.PAGEUP] = function (lines) {
    this.bothCursors.incY(-this.pageSize, lines);
};

Commands["SHIFT" + Keys.PAGEUP] = function (lines) {
    this.backCursor.incY(-this.pageSize, lines);
};

Commands["NORMAL" + Keys.PAGEDOWN] = function (lines) {
    this.bothCursors.incY(this.pageSize, lines);
};

Commands["SHIFT" + Keys.PAGEDOWN] = function (lines) {
    this.backCursor.incY(this.pageSize, lines);
};

Commands["NORMAL" + Keys.HOME] = function (lines) {
    this.bothCursors.home(lines);
};

Commands["SHIFT" + Keys.HOME] = function (lines) {
    this.backCursor.home(lines);
};

Commands["CTRL" + Keys.HOME] = function (lines) {
    this.bothCursors.fullHome(lines);
};

Commands["CTRLSHIFT" + Keys.HOME] = function (lines) {
    this.backCursor.fullHome(lines);
};

Commands["NORMAL" + Keys.END] = function (lines) {
    this.bothCursors.end(lines);
};

Commands["SHIFT" + Keys.END] = function (lines) {
    this.backCursor.end(lines);
};

Commands["CTRL" + Keys.END] = function (lines) {
    this.bothCursors.fullEnd(lines);
};

Commands["CTRLSHIFT" + Keys.END] = function (lines) {
    this.backCursor.fullEnd(lines);
};

Commands["CTRL" + Keys.DASH] = function (lines) {
    this.decreaseFontSize();
};

Commands["CTRL" + Keys.EQUALSIGN] = function (lines) {
    this.increaseFontSize();
};

Commands["NORMAL" + Keys.BACKSPACE] = function (lines) {
    if (this.frontCursor.i === this.backCursor.i) {
        this.frontCursor.left(lines);
    }
    this.deleteSelection();
};

Commands["NORMAL" + Keys.DELETE] = function (lines) {
    if (this.frontCursor.i === this.backCursor.i) {
        this.backCursor.right(lines);
    }
    this.deleteSelection();
};

Commands["NORMAL" + Keys.ENTER] = function (lines) {
    var indent = "";
    for (var i = 0; i < lines[this.frontCursor.y].length && lines[this.frontCursor.y][i] === " "; ++i) {
        indent += " ";
    }
    this.insertAtCursor("\n" + indent);
};

Commands["NORMAL" + Keys.TAB] = function (lines) {
    if (this.frontCursor.y === this.backCursor.y) {
        this.insertAtCursor(this.tabString);
    }
    else {
        var a = this.getMinCursor();
        var b = this.getMaxCursor();
        a.home(lines);
        b.end(lines);
        for (var y = a.y; y <= b.y; ++y) {
            lines[y] = this.tabString + lines[y];
        }
        a.setXY(0, a.y, lines);
        b.setXY(0, b.y, lines);
        b.end(lines);
        this.pushUndo(lines);
    }
};

Commands["SHIFT" + Keys.TAB] = function (lines) {
    if (this.frontCursor.y !== this.backCursor.y) {
        var a = this.getMinCursor();
        var b = this.getMaxCursor();
        a.home(lines);
        b.end(lines);
        for (var y = a.y; y <= b.y; ++y) {
            if (lines[y].substring(0, this.tabWidth) === this.tabString) {
                lines[y] = lines[y].substring(this.tabWidth);
            }
        }
        a.setXY(0, a.y, lines);
        b.setXY(0, b.y, lines);
        b.end(lines);
        this.pushUndo(lines);
    }
};

Commands["CTRL+A"] = function (lines) {
    this.frontCursor.fullHome(lines);
    this.backCursor.fullEnd(lines);
};

Commands["CTRL+Z"] = function (lines) {
    this.popUndo();
};

