pliny.class({
  parent: "Primrose.Input",
    name: "Touch",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Touch extends Primrose.InputProcessor {
  constructor(DOMElement, commands) {
    var axes = ["FINGERS"];
    for (var i = 0; i < 10; ++i) {
      axes.push("X" + i);
      axes.push("Y" + i);
      axes.push("LX" + i);
      axes.push("LY" + i);
    }
    super("Touch", commands, axes);
    console.log(DOMElement);
    DOMElement = DOMElement || window;

    var setState = (stateChange, setAxis, event) => {
      let touches = event.changedTouches,
        minIdentifier = Number.MAX_VALUE;
      for (let i = 0; i < touches.length; ++i) {
        minIdentifier = Math.min(minIdentifier, touches[i].identifier);
      }

      for (let i = 0; i < touches.length; ++i) {
        const t = touches[i],
          id = t.identifier - minIdentifier;
        if (setAxis) {
          this.setAxis("X" + id, t.pageX);
          this.setAxis("Y" + id, t.pageY);
        }
        else {
          this.setAxis("LX" + id, t.pageX);
          this.setAxis("LY" + id, t.pageY);
        }

        this.setButton("FINGER" + t.identifier, stateChange);
      }

      touches = event.touches;
      let fingerState = 0;
      for (let i = 0; i < touches.length; ++i) {
        const t = touches[i];
        fingerState |= 1 << t.identifier;
      }
      this.setAxis("FINGERS", fingerState);
      event.preventDefault();
    };

    DOMElement.addEventListener("touchstart", setState.bind(this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(this, true, true), false);
  }
}