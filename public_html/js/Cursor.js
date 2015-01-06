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

function Cursor(i, x, y) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
}

Cursor.prototype.copy = function (cursor) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
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
};

Cursor.prototype.up = function (lines) {
    if (this.y > 0) {
        --this.y;
        var dx = Math.min(0, lines[this.y].length - this.x);
        this.x += dx;
        this.i -= lines[this.y].length + 1 - dx;
    }
};

Cursor.prototype.down = function (lines) {
    if (this.y < lines.length - 1) {
        ++this.y;
        var dx = Math.min(0, lines[this.y].length - this.x);
        this.x += dx;
        this.i += lines[this.y - 1].length + 1 + dx;
    }
};

Cursor.prototype.setXY = function(x, y, lines){
    this.y = Math.max(0, Math.min(lines.length - 1, y));
    this.x = Math.max(0, Math.min(lines[this.y].length, x));
    this.i = this.x;
    for (var i = 0; i < this.y; ++i) {
        this.i += lines[i].length + 1;
    }
};