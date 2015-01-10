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

function Command(regexParts, func){
    var key = regexParts.pop();
    this.regex = regex;
    this.comparater = this.regex.toString();
    this.func = func;
}

var Commands = [
    [
        [Keys.LEFTARROW],
        function (lines, cursor) {
            cursor.left(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.LEFTARROW],
        function (lines, cursor) {
            cursor.skipLeft(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.RIGHTARROW],
        function (lines, cursor) {
            cursor.right(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.RIGHTARROW],
        function (lines, cursor) {
            cursor.skipRight(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.UPARROW],
        function (lines, cursor) {
            cursor.up(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.DOWNARROW],
        function (lines, cursor) {
            cursor.down(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.HOME],
        function (lines, cursor) {
            cursor.home(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.HOME],
        function (lines, cursor) {
            cursor.fullHome(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.END],
        function (lines, cursor) {
            cursor.end(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.END],
        function (lines, cursor) {
            cursor.fullEnd(lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.DOWNARROW],
        function (lines, cursor) {
            if (this.scrollTop < lines.length) {
                ++this.scrollTop;
            }
        }
    ],
    [
        ["CTRL", Keys.UPARROW],
        function (lines, cursor) {
            if (this.scrollTop > 0) {
                --this.scrollTop;
            }
        }
    ],
    [
        [Keys.PAGEUP],
        function (lines, cursor) {
            cursor.incY(-this.pageSize, lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.PAGEDOWN],
        function (lines, cursor) {
            cursor.incY(this.pageSize, lines);
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.DASH],
        function (lines, cursor) {
            this.decreaseFontSize();
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", Keys.EQUALSIGN],
        function (lines, cursor) {
            this.increaseFontSize();
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.BACKSPACE],
        function (lines, cursor) {
            if (this.frontCursor.i === this.backCursor.i) {
                this.frontCursor.left(lines);
            }
            this.deleteSelection();
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["SHIFT", Keys.DELETE],
        function (lines, cursor) {
            if (this.frontCursor.i === this.backCursor.i) {
                this.frontCursor.home(lines);
                this.backCursor.end(lines);
            }
            this.deleteSelection();
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.DELETE],
        function (lines, cursor) {
            if (this.frontCursor.i === this.backCursor.i) {
                this.backCursor.right(lines);
            }
            this.deleteSelection();
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.ENTER],
        function (lines, cursor) {
            var indent = "";
            for (var i = 0; i < lines[this.frontCursor.y].length && lines[this.frontCursor.y][i] === " "; ++i) {
                indent += " ";
            }
            this.insertAtCursor("\n" + indent);
            this.scrollIntoView(cursor);
        }
    ],
    [
        [Keys.TAB],
        function (lines, cursor) {
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
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["SHIFT", Keys.TAB],
        function (lines, cursor) {
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
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", "a"],
        function (lines, cursor) {
            this.frontCursor.fullHome(lines);
            this.backCursor.fullEnd(lines);
        }
    ],
    [
        ["CTRL", "y"],
        function (lines, cursor) {
            this.redo();
            this.scrollIntoView(cursor);
        }
    ],
    [
        ["CTRL", "z"],
        function (lines, cursor) {
            this.undo();
            this.scrollIntoView(cursor);
        }
    ]
].map(function(parts){ return new Command(parts[0], parts[1]); });