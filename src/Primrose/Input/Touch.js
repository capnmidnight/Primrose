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
      var touches = event.changedTouches,
        i = 0,
        t = null;
      for (i = 0; i < touches.length; ++i) {
        t = touches[i];

        if (setAxis) {
          this.setAxis("X" + t.identifier, t.pageX);
          this.setAxis("Y" + t.identifier, t.pageY);
        }
        else {
          this.setAxis("LX" + t.identifier, t.pageX);
          this.setAxis("LY" + t.identifier, t.pageY);
        }

        this.setButton("FINGER" + t.identifier, stateChange);
      }
      touches = event.touches;

      var fingerState = 0;
      for (i = 0; i < touches.length; ++i) {
        fingerState |= 1 << t.identifier;
      }
      this.FINGERS = fingerState;
      event.preventDefault();
    }

    DOMElement.addEventListener("touchstart", setState.bind(this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(this, true, true), false);
  }
}

if (navigator.maxTouchPoints) {
  var axes = ["FINGERS"];
  for (var i = 0; i < navigator.maxTouchPoints; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
}