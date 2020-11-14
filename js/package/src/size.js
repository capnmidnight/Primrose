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
}
