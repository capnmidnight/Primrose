pliny.class({
  parent: "Primrose.Input",
    name: "Mouse",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Mouse extends Primrose.InputProcessor {
  constructor(DOMElement, commands) {
    super("Mouse", commands, ["BUTTONS", "X", "Y", "Z", "W"]);
    this.timer = null;

    DOMElement = DOMElement || window;

    var setState = (stateChange, event) => {
      var state = event.buttons,
        button = 0;
      while(state > 0){
        var isDown = state & 0x1 !== 0;
        if(isDown && stateChange || !isDown && !stateChange){
          this.setButton(button, stateChange);
        }
        state >>= 1;
        ++button;
      }
      this.setAxis("BUTTONS", event.buttons << 10);
      event.preventDefault();
    };

    DOMElement.addEventListener("mousedown", setState.bind(this, true), false);
    DOMElement.addEventListener("mouseup", setState.bind(this, false), false);
    DOMElement.addEventListener("mousemove", (event) => {
      setState(true, event);

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

  setLocation(x, y) {
    this.setAxis("X", x);
    this.setAxis("Y", y);
  }

  setMovement(dx, dy) {
    this.setAxis("X", this.getAxis("X") + dx);
    this.setAxis("Y", this.getAxis("Y") + dy);
  }
}