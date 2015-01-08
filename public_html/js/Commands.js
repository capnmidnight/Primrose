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

Commands["NORMAL" + Keys.LEFTARROW] = "left";
Commands["CTRL" + Keys.LEFTARROW] = "skipLeft";
Commands["NORMAL" + Keys.RIGHTARROW] = "right";
Commands["CTRL" + Keys.RIGHTARROW] = "skipRight";
Commands["NORMAL" + Keys.UPARROW] = "up";
Commands["NORMAL" + Keys.DOWNARROW] = "down";
Commands["NORMAL" + Keys.HOME] = "home";
Commands["CTRL" + Keys.HOME] = "fullHome";
Commands["NORMAL" + Keys.END] = "end";
Commands["CTRL" + Keys.END] = "fullEnd";

Commands["NORMAL" + Keys.PAGEUP] = function (lines, cursor) {
    cursor.incY(-this.pageSize, lines);
};

Commands["NORMAL" + Keys.PAGEDOWN] = function (lines, cursor) {
    cursor.incY(this.pageSize, lines);
};

Commands["CTRL" + Keys.DASH] = function () {
    this.decreaseFontSize();
};

Commands["CTRL" + Keys.EQUALSIGN] = function () {
    this.increaseFontSize();
};

Commands["NORMAL" + Keys.BACKSPACE] = function (lines) {
    if (this.frontCursor.i === this.backCursor.i) {
        this.frontCursor.left(lines);
    }
    this.deleteSelection();
};

Commands["SHIFT" + Keys.DELETE] = function (lines) {
    if (this.frontCursor.i === this.backCursor.i) {
        this.frontCursor.home(lines);
        this.backCursor.end(lines);
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

Commands.CTRL_A = function (lines) {
    this.frontCursor.fullHome(lines);
    this.backCursor.fullEnd(lines);
};

Commands.CTRL_Z = function (lines) {
    this.popUndo();
};

