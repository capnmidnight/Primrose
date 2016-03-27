"use strict";

/* global Primrose, pliny */

Primrose.Text.Size = function () {
  "use strict";

  pliny.class("Primrose.Text", {
    name: "Size",
    description: "| [under construction]"
  });
  function Size(width, height) {
    this.set(width || 0, height || 0);
  }

  Size.prototype.set = function (width, height) {
    this.width = width;
    this.height = height;
  };

  Size.prototype.copy = function (s) {
    if (s) {
      this.width = s.width;
      this.height = s.height;
    }
  };

  Size.prototype.clone = function () {
    return new Size(this.width, this.height);
  };

  Size.prototype.toString = function () {
    return "<w:" + this.width + ", h:" + this.height + ">";
  };

  return Size;
}();

pliny.issue("Primrose.Text.Size", {
  name: "document Size",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Text.Size](#Primrose_Text_Size) class in the text/ directory"
});
