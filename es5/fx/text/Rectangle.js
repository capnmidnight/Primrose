"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Text.Rectangle = function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Text",
    name: "Rectangle",
    description: "| [under construction]"
  });

  var Rectangle = function () {
    function Rectangle(x, y, width, height) {
      _classCallCheck(this, Rectangle);

      this.point = new Primrose.Text.Point(x, y);
      this.size = new Primrose.Text.Size(width, height);
    }

    _createClass(Rectangle, [{
      key: "set",
      value: function set(x, y, width, height) {
        this.point.set(x, y);
        this.size.set(width, height);
      }
    }, {
      key: "copy",
      value: function copy(r) {
        if (r) {
          this.point.copy(r.point);
          this.size.copy(r.size);
        }
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[" + this.point.toString() + " x " + this.size.toString() + "]";
      }
    }, {
      key: "overlap",
      value: function overlap(r) {
        var left = Math.max(this.left, r.left),
            top = Math.max(this.top, r.top),
            right = Math.min(this.right, r.right),
            bottom = Math.min(this.bottom, r.bottom);
        if (right > left && bottom > top) {
          return new Rectangle(left, top, right - left, bottom - top);
        }
      }
    }, {
      key: "x",
      get: function get() {
        return this.point.x;
      },
      set: function set(x) {
        this.point.x = x;
      }
    }, {
      key: "left",
      get: function get() {
        return this.point.x;
      },
      set: function set(x) {
        this.point.x = x;
      }
    }, {
      key: "width",
      get: function get() {
        return this.size.width;
      },
      set: function set(width) {
        this.size.width = width;
      }
    }, {
      key: "right",
      get: function get() {
        return this.point.x + this.size.width;
      },
      set: function set(right) {
        this.point.x = right - this.size.width;
      }
    }, {
      key: "y",
      get: function get() {
        return this.point.y;
      },
      set: function set(y) {
        this.point.y = y;
      }
    }, {
      key: "top",
      get: function get() {
        return this.point.y;
      },
      set: function set(y) {
        this.point.y = y;
      }
    }, {
      key: "height",
      get: function get() {
        return this.size.height;
      },
      set: function set(height) {
        this.size.height = height;
      }
    }, {
      key: "bottom",
      get: function get() {
        return this.point.y + this.size.height;
      },
      set: function set(bottom) {
        this.point.y = bottom - this.size.height;
      }
    }, {
      key: "area",
      get: function get() {
        return this.width * this.height;
      }
    }]);

    return Rectangle;
  }();

  return Rectangle;
}();