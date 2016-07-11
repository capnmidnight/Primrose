Primrose.Input.Touch = (function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Input",
      name: "Touch",
      baseClass: "Primrose.InputProcessor",
      description: "| [under construction]"
  });
  class Touch extends Primrose.InputProcessor {
    constructor(DOMElement, parent, commands, socket) {
      super("Touch", parent, commands, socket);
      DOMElement = DOMElement || window;

      function setState(stateChange, setAxis, event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; ++i) {
          var t = touches[i];

          if (setAxis) {
            this.setAxis("X" + t.identifier, t.pageX);
            this.setAxis("Y" + t.identifier, t.pageY);
          }
          else {
            this.setAxis("LX" + t.identifier, t.pageX);
            this.setAxis("LY" + t.identifier, t.pageY);
          }

          this.setButton("FINGER" + t.identifier, stateChange);

          var mask = 1 << t.identifier;
          if (stateChange) {
            this.FINGERS |= mask;
          }
          else {
            mask = ~mask;
            this.FINGERS &= mask;
          }
        }
        event.preventDefault();
        this.update();
      }

      DOMElement.addEventListener("touchstart", setState.bind(this, true, false), false);
      DOMElement.addEventListener("touchend", setState.bind(this, false, true), false);
      DOMElement.addEventListener("touchmove", setState.bind(this, true, true), false);
    }

    updatePosition() {}

    updateVelocity() {
      var head = this,
        x = 0,
        z = 0;
      while (head) {
        x += head.getValue("strafe");
        z += head.getValue("drive");
        head = head.parent;
      }

      this.velocity.x = x;
      this.velocity.z = z;
    }

    updateOrientation(excludePitch) {
      var head = this,
        p = 0,
        h = 0;
      while (head) {
        p += head.getValue("pitch");
        h += head.getValue("heading");
        head = head.parent;
      }
      this.euler.set(excludePitch ? 0 : p, h, 0, "YXZ");
      this.mesh.quaternion.setFromEuler(this.euler);
    }

  }

  Touch.NUM_FINGERS = 10;

  var axes = ["FINGERS"];
  for (var i = 0; i < Touch.NUM_FINGERS; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
  return Touch;
})();