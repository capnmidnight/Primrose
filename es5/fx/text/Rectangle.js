"use strict";

/* global qp, Primrose, pliny */

Primrose.Text.Rectangle = function () {
  "use strict";

  pliny.class("Primrose.Text", {
    name: "Rectangle",
    description: "| [under construction]"
  });
  function Rectangle(x, y, width, height) {
    this.point = new Primrose.Text.Point(x, y);
    this.size = new Primrose.Text.Size(width, height);

    Object.defineProperties(this, {
      x: {
        get: function get() {
          return this.point.x;
        },
        set: function set(x) {
          this.point.x = x;
        }
      },
      left: {
        get: function get() {
          return this.point.x;
        },
        set: function set(x) {
          this.point.x = x;
        }
      },
      width: {
        get: function get() {
          return this.size.width;
        },
        set: function set(width) {
          this.size.width = width;
        }
      },
      right: {
        get: function get() {
          return this.point.x + this.size.width;
        },
        set: function set(right) {
          this.point.x = right - this.size.width;
        }
      },
      y: {
        get: function get() {
          return this.point.y;
        },
        set: function set(y) {
          this.point.y = y;
        }
      },
      top: {
        get: function get() {
          return this.point.y;
        },
        set: function set(y) {
          this.point.y = y;
        }
      },
      height: {
        get: function get() {
          return this.size.height;
        },
        set: function set(height) {
          this.size.height = height;
        }
      },
      bottom: {
        get: function get() {
          return this.point.y + this.size.height;
        },
        set: function set(bottom) {
          this.point.y = bottom - this.size.height;
        }
      }
    });
  }

  Rectangle.prototype.set = function (x, y, width, height) {
    this.point.set(x, y);
    this.size.set(width, height);
  };

  Rectangle.prototype.copy = function (r) {
    if (r) {
      this.point.copy(r.point);
      this.size.copy(r.size);
    }
  };

  Rectangle.prototype.clone = function () {
    return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
  };

  Rectangle.prototype.toString = function () {
    return "[" + this.point.toString() + " x " + this.size.toString() + "]";
  };

  return Rectangle;
}();

pliny.issue("Primrose.Text.Rectangle", {
  name: "document Rectangle",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Rectangle](#Primrose_Text_Rectangle) class in the text/ directory"
});
