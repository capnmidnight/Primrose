const TEMP = new THREE.Vector2();

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
      axes.push("DX" + i);
      axes.push("DY" + i);
    }
    super("Touch", commands, axes);

    DOMElement = DOMElement || window;

    var setState = (stateChange, setAxis, event) => {
      // We have to find the minimum identifier value because iOS uses a very
      // large number that changes after every gesture. Every other platform
      // just numbers them 0 through 9.
      let touches = event.changedTouches,
        minIdentifier = Number.MAX_VALUE;
      for (let i = 0; i < touches.length; ++i) {
        minIdentifier = Math.min(minIdentifier, touches[i].identifier);
      }

      for (let i = 0; i < touches.length; ++i) {
        const t = touches[i],
          id = t.identifier - minIdentifier,
          x = t.pageX,
          y = t.pageY;
        this.setAxis("X" + id, x);
        this.setAxis("Y" + id, y);
        this.setButton("FINGER" + t.identifier, stateChange);

        if(setAxis){
          const lx = this.getAxis("LX" + id),
            ly = this.getAxis("LY" + id);
          this.setAxis("DX" + id, x - lx);
          this.setAxis("DY" + id, y - ly);
        }

        this.setAxis("LX" + id, x);
        this.setAxis("LY" + id, y);
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

  update(dt) {
    super.update(dt);
    TEMP.set(this.getAxis("DX0"), this.getAxis("DY0"));
    if(TEMP.debug){
      TEMP.debug("delta", 2);
    }
  }
}