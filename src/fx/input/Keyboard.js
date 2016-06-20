Primrose.Input.Keyboard = ( function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]",
    parameters: [
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""},
      {name: "", type: "", description: ""}
    ]
  } );
  class Keyboard extends Primrose.InputProcessor {
    constructor(DOMElement, commands, socket) {
      super("Keyboard", commands, socket);
      DOMElement = DOMElement || window;
      if(DOMElement instanceof HTMLCanvasElement && (DOMElement.tabIndex === null || DOMElement.tabIndex === -1)){
        DOMElement.tabIndex = 1;
      }
      function execute(stateChange, event) {
        this.setButton(event.keyCode, stateChange);
        this.update();
      }

      DOMElement.addEventListener("keydown", execute.bind(this, true), false);
      DOMElement.addEventListener("keyup", execute.bind(this, false), false);
    }
  }

  return Keyboard;
} )();
