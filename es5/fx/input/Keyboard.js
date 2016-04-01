"use strict";

/* global Primrose, pliny */

Primrose.Input.Keyboard = function () {

  pliny.issue({
    parent: "Primrose.Input.Keyboard",
    name: "document Keyboard",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Keyboard](#Primrose_Input_Keyboard) class in the input/ directory"
  });

  pliny.class({
    parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.Input.ButtonAndAxis",
    description: "| [under construction]",
    parameters: [{ name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }, { name: "", type: "", description: "" }]
  });
  function KeyboardInput(name, DOMElement, commands, socket) {
    DOMElement = DOMElement || window;

    Primrose.Input.ButtonAndAxis.call(this, name, commands, socket);

    function execute(stateChange, event) {
      this.setButton(event.keyCode, stateChange);
    }

    DOMElement.addEventListener("keydown", execute.bind(this, true), false);
    DOMElement.addEventListener("keyup", execute.bind(this, false), false);
  }

  Primrose.Input.ButtonAndAxis.inherit(KeyboardInput);
  return KeyboardInput;
}();
