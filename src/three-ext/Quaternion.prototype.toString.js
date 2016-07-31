(function () {
  "use strict";

  if (window.THREE) {
    pliny.method({
      parent: "THREE.Quaternion",
      name: "toString ",
      description: "A polyfill method for printing objects.",
      parameters: [{
        name: "digits",
        type: "Number",
        description: "the number of significant figures to print."
      }]
    });
    THREE.Quaternion.prototype.toString = function (digits) {
      var parts = this.toArray();
      if (digits !== undefined) {
        for (var i = 0; i < parts.length; ++i) {
          if (parts[i] !== null && parts[i] !== undefined) {
            parts[i] = parts[i].toFixed(digits);
          }
          else {
            parts[i] = "undefined";
          }
        }
      }
      return "{" + parts.join(", ") + "}";
    };

    THREE.Quaternion.prototype.debug = function (label, digits) {
      var val = this.toString(digits);
      if (val !== this.lastVal) {
        this.lastVal = val;
        console.log(label, val);
      }
    };
  }
})();