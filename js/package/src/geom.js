/*
pliny.class({
  parent: "Primrose.Text",
    name: "Point",
    description: "| [under construction]"
});
*/

export class Point {
    constructor(x, y) {
        this.set(x || 0, y || 0);
        Object.seal(this);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    copy(p) {
        if (p) {
            this.x = p.x;
            this.y = p.y;
        }
    }

    toCell(character, scroll, gridBounds) {
        this.x = Math.round(this.x / character.width) + scroll.x - gridBounds.x;
        this.y = Math.floor((this.y / character.height) - 0.25) + scroll.y;
    }

    inBounds(bounds) {
        return bounds.left <= this.x
            && this.x < bounds.right
            && bounds.top <= this.y
            && this.y < bounds.bottom;
    }

    clone() {
        return new Point(this.x, this.y);
    }

    toString() {
        return `(x:${this.x}, y:${this.y})`;
    }
};

export class Size {
    constructor(width, height) {
        this.width = width || 0;
        this.height = height || 0;
        Object.seal(this);
    }

    set(width, height) {
        this.width = width;
        this.height = height;
    }

    copy(s) {
        if (!!s) {
            this.width = s.width;
            this.height = s.height;
        }
    }

    clone() {
        return new Size(this.width, this.height);
    }

    toString() {
        return `<w:${this.width}, h:${this.height}>`;
    }
};

export class Rectangle {
    constructor(x, y, width, height) {
        this.point = new Point(x, y);
        this.size = new Size(width, height);
        Object.freeze(this);
    }

    get x() {
        return this.point.x;
    }

    set x(x) {
        this.point.x = x;
    }

    get left() {
        return this.point.x;
    }
    set left(x) {
        this.point.x = x;
    }

    get width() {
        return this.size.width;
    }
    set width(width) {
        this.size.width = width;
    }

    get right() {
        return this.point.x + this.size.width;
    }
    set right(right) {
        this.point.x = right - this.size.width;
    }

    get y() {
        return this.point.y;
    }
    set y(y) {
        this.point.y = y;
    }

    get top() {
        return this.point.y;
    }
    set top(y) {
        this.point.y = y;
    }

    get height() {
        return this.size.height;
    }
    set height(height) {
        this.size.height = height;
    }

    get bottom() {
        return this.point.y + this.size.height;
    }
    set bottom(bottom) {
        this.point.y = bottom - this.size.height;
    }

    get area() {
        return this.width * this.height;
    }

    set(x, y, width, height) {
        this.point.set(x, y);
        this.size.set(width, height);
    }

    copy(r) {
        if (r) {
            this.point.copy(r.point);
            this.size.copy(r.size);
        }
    }

    clone() {
        return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
    }

    overlap(r) {
        const left = Math.max(this.left, r.left),
            top = Math.max(this.top, r.top),
            right = Math.min(this.right, r.right),
            bottom = Math.min(this.bottom, r.bottom);
        if (right > left && bottom > top) {
            return new Rectangle(left, top, right - left, bottom - top);
        }
    }

    toString() {
        return `[${this.point.toString()} x ${this.size.toString()}]`;
    }
};
