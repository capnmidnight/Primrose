/* 
 * Copyright (C) 2015 Sean
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


var Point = (function () {
    "use strict";
    function Point(x, y) {
        this.set(x || 0, y || 0);
    }

    Point.prototype.set = function (x, y) {
        if (x instanceof Point) {
            this.x = x.x;
            this.y = x.y;
        }
        else {
            this.x = x;
            this.y = y;
        }
    };

    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };

    Point.prototype.toString = function () {
        return fmt("(x:$1, y:$2)", this.x, this.y);
    };

    return Point;
})();

var Size = (function () {
    "use strict";
    function Size(width, height) {
        this.set(width || 0, height || 0);
    }

    Size.prototype.set = function (width, height) {
        if (width instanceof Size) {
            this.width = width.width;
            this.height = width.height;
        }
        else {
            this.width = width;
            this.height = height;
        }
    };

    Size.prototype.clone = function () {
        return new Size(this.width, this.height);
    };

    Size.prototype.toString = function () {
        return fmt("<w:$1, h:$2>", this.width, this.height);
    };

    return Size;
})();

var Rectangle = (function () {
    "use strict";
    function Rectangle() {
        this.point = new Point();
        this.size = new Size();
        
        Object.defineProperties(this, {
            x: {
                get: function () {
                    return this.point.x;
                },
                set: function (x) {
                    this.point.x = x;
                }
            },
            left: {
                get: function () {
                    return this.point.x;
                },
                set: function (left) {
                    this.point.x = left;
                }
            },
            right: {
                get: function () {
                    return this.point.x + this.size.width;
                },
                set: function (right) {
                    this.point.x = right - this.size.width;
                }
            },
            y: {
                get: function () {
                    return this.point.y;
                },
                set: function (y) {
                    this.point.y = y;
                }
            },
            top: {
                get: function () {
                    return this.point.y;
                },
                set: function (top) {
                    this.point.y = top;
                }
            },
            bottom: {
                get: function () {
                    return this.point.y + this.size.height;
                },
                set: function (bottom) {
                    this.point.y = bottom - this.size.height;
                }
            }
        });
    }

    Rectangle.prototype.clone = function () {
        return new Rectangle(this.point.clone(), this.size.clone());
    };

    Rectangle.prototype.toString = function () {
        return fmt("[$1 x $2]", this.point.toString(), this.size.toString());
    };

    return Rectangle;
})();