(function () {
  "use strict";

  if (window.THREE) {
    pliny.method({
      parent: "THREE.Vector3",
      name: "toString ",
      description: "A polyfill method for printing objects.",
      parameters: [{
        name: "digits",
        type: "Number",
        description: "the number of significant figures to print."
      }]
    });
    THREE.Vector3.prototype.toString = function (digits) {
      var parts = this.toArray();
      if (digits !== undefined) {
        parts = parts.map((v) => v.toFixed(digits));
      }
      return "<" + parts.join(", ") + ">";
    };

    THREE.Vector3.prototype.debug = function (label, digits) {
      var val = this.toString(digits);
      if (val !== this.lastVal) {
        this.lastVal = val;
        console.log(label, val);
      }
    };
  }
})();