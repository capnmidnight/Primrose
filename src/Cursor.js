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

var Cursor = (function () {
    "use strict";
    function Cursor(i, x, y) {
        this.i = i || 0;
        this.x = x || 0;
        this.y = y || 0;
        this.moved = false;
    }

    Cursor.min = function (a, b) {
        if (a.i <= b.i) {
            return a;
        }
        return b;
    };

    Cursor.max = function (a, b) {
        if (a.i > b.i) {
            return a;
        }
        return b;
    };

    Cursor.prototype.toString = function () {
        return fmt("[i:$1 x:$2 y:$3]", this.i, this.x, this.y);
    };

    Cursor.prototype.copy = function (cursor) {
        this.i = cursor.i;
        this.x = cursor.x;
        this.y = cursor.y;
        this.moved = false;
    };

    Cursor.prototype.rectify = function (lines) {
        if (this.y >= lines.length) {
            this.y = lines.length - 1;
        }
        if (this.x > lines[this.y].length) {
            this.x = lines[this.y].length;
        }
    };

    Cursor.prototype.left = function (lines) {
        if (this.i > 0) {
            --this.i;
            --this.x;
            if (this.x < 0) {
                --this.y;
                this.x = lines[this.y].length;
            }
        }
        this.moved = true;
    };

    Cursor.prototype.skipleft = function (lines) {
        if (this.x === 0) {
            this.left(lines);
        }
        else {
            var x = this.x - 1;
            var line = reverse(lines[this.y].substring(0, x));
            var m = line.match(/(\s|\W)+/);
            var dx = m ? (m.index + m[0].length + 1) : line.length + 1;
            this.i -= dx;
            this.x -= dx;
        }
        this.moved = true;
    };

    Cursor.prototype.right = function (lines) {
        if (this.y < lines.length - 1 || this.x < lines[this.y].length) {
            ++this.i;
            ++this.x;
            if (this.x > lines[this.y].length) {
                this.x = 0;
                ++this.y;
            }
        }
        this.moved = true;
    };

    Cursor.prototype.skipright = function (lines) {
        if (this.x === lines[this.y].length) {
            this.right(lines);
        }
        else {
            var x = this.x + 1;
            var line = lines[this.y].substring(x);
            var m = line.match(/(\s|\W)+/);
            var dx = m ? (m.index + m[0].length + 1) : (line.length - this.x);
            this.i += dx;
            this.x += dx;
        }
        this.moved = true;
    };

    Cursor.prototype.home = function (lines) {
        this.i -= this.x;
        this.x = 0;
        this.moved = true;
    };

    Cursor.prototype.fullhome = function (lines) {
        this.i = 0;
        this.x = 0;
        this.y = 0;
        this.moved = true;
    };

    Cursor.prototype.end = function (lines) {
        var dx = lines[this.y].length - this.x;
        this.i += dx;
        this.x += dx;
        this.moved = true;
    };

    Cursor.prototype.fullend = function (lines) {
        this.i += lines[this.y].length - this.x;
        while (this.y < lines.length - 1) {
            ++this.y;
            this.i += lines[this.y].length + 1;
        }
        this.x = lines[this.y].length;
        this.moved = true;
    };

    Cursor.prototype.up = function (lines) {
        if (this.y > 0) {
            --this.y;
            var dx = Math.min(0, lines[this.y].length - this.x);
            this.x += dx;
            this.i -= lines[this.y].length + 1 - dx;
        }
        this.moved = true;
    };

    Cursor.prototype.down = function (lines) {
        if (this.y < lines.length - 1) {
            ++this.y;
            var dx = Math.min(0, lines[this.y].length - this.x);
            this.x += dx;
            this.i += lines[this.y - 1].length + 1 + dx;
        }
        this.moved = true;
    };

    Cursor.prototype.setXY = function (x, y, lines) {
        this.y = Math.max(0, Math.min(lines.length - 1, y));
        this.x = Math.max(0, Math.min(lines[this.y].length, x));
        this.i = this.x;
        for (var i = 0; i < this.y; ++i) {
            this.i += lines[i].length + 1;
        }
        this.moved = true;
    };

    Cursor.prototype.incY = function (dy, lines) {
        this.y = Math.max(0, Math.min(lines.length - 1, this.y + dy));
        this.x = Math.max(0, Math.min(lines[this.y].length, this.x));
        this.i = this.x;
        for (var i = 0; i < this.y; ++i) {
            this.i += lines[i].length + 1;
        }
        this.moved = true;
    };
    return Cursor;
})();