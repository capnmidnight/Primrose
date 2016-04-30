/* global Primrose, pliny */

Primrose.Input.Keyboard = ( function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]",
    baseClass: "Primrose.InputProcessor",
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
