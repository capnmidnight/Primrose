Primrose.Input.Mouse = (function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Input",
      name: "Mouse",
      baseClass: "Primrose.InputProcessor",
      description: "| [under construction]"
  });
  class Mouse extends Primrose.InputProcessor {
    constructor(DOMElement, parent, commands, socket) {
      super("Mouse", parent, commands, socket);
      this.timer = null;

      DOMElement = DOMElement || window;

      DOMElement.addEventListener("mousedown", (event) => {
        this.setButton(event.button, true);
        this.BUTTONS = event.buttons << 10;
      }, false);

      DOMElement.addEventListener("mouseup", (event) => {
        this.setButton(event.button, false);
        this.BUTTONS = event.buttons << 10;
      }, false);

      DOMElement.addEventListener("mousemove", (event) => {
        this.BUTTONS = event.buttons << 10;
        if (PointerLock.isActive) {
          var mx = event.movementX,
            my = event.movementY;

          if (mx === undefined) {
            mx = event.webkitMovementX || event.mozMovementX || 0;
            my = event.webkitMovementY || event.mozMovementY || 0;
          }
          this.setMovement(mx, my);
        }
        else {
          this.setLocation(event.layerX, event.layerY);
        }
      }, false);

      DOMElement.addEventListener("wheel", (event) => {
        if (isChrome) {
          this.W += event.deltaX;
          this.Z += event.deltaY;
        }
        else if (event.shiftKey) {
          this.W += event.deltaY;
        }
        else {
          this.Z += event.deltaY;
        }
        event.preventDefault();
      }, false);
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
      this.quaternion.setFromEuler(this.euler);
    }

    setLocation(x, y) {
      this.X = x;
      this.Y = y;
    }

    setMovement(dx, dy) {
      this.X += dx;
      this.Y += dy;
    }
  }

  Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);

  return Mouse;
})();