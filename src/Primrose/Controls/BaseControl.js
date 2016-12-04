pliny.class({
  parent: "Primrose.Controls",
  baseClass: "Primrose.AbstractEventEmitter",
  name: "BaseControl",
  description: "The BaseControl class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
});

var ID = 1,
  NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
  DELIM = "\\s*,\\s*",
  UNITS = "(?:em|px)",
  TRANSLATE_PATTERN = new RegExp("translate3d\\s*\\(\\s*" +
    NUMBER_PATTERN + UNITS + DELIM +
    NUMBER_PATTERN + UNITS + DELIM +
    NUMBER_PATTERN + UNITS + "\\s*\\)", "i"),
  ROTATE_PATTERN = new RegExp("rotate3d\\s*\\(\\s*" +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + "rad\\s*\\)", "i"),
  TEMP_VECTOR = new Vector3();

import { Vector3 } from "three/src/math/Vector3";
import AbstractEventEmitter from "../AbstractEventEmitter";
export default class BaseControl extends AbstractEventEmitter {
  constructor() {
    super();

    pliny.property({
      parent: "Primrose.Controls.BaseControl",
      name: "controlID",
      type: "Number",
      description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
    });
    this.controlID = ID++;

    pliny.property({
      parent: "Primrose.Controls.BaseControl",
      name: "focused",
      type: "Boolean",
      description: "Flag indicating this control has received focus. You should theoretically only read it."
    });
    this.focused = false;
  }

  focus() {

    pliny.method({
      parent: "Primrose.Controls.BaseControl",
      name: "focus",
      description: "Sets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track\n\
    focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
    \n\
      grammar(\"JavaScript\");\n\
      var ctrls = [\n\
        new Primrose.Controls.TextBox(),\n\
        new Primrose.Controls.TextBox(),\n\
        new Primrose.Controls.Button()\n\
      ];\n\
    \n\
      function focusOn(id){\n\
        for(var i = 0; i < ctrls.length; ++i){\n\
          var c = ctrls[i];\n\
          if(c.controlID === id){\n\
            c.focus();\n\
          }\n\
          else{\n\
            c.blur();\n\
          }\n\
        }\n\
      }"
      }]
    });

    this.focused = true;
    this.emit("focus", {
      target: this
    });
  }

  blur() {

    pliny.method({
      parent: "Primrose.Controls.BaseControl",
      name: "blur",
      description: "Unsets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track\n\
    focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
    \n\
      grammar(\"JavaScript\");\n\
      var ctrls = [\n\
        new Primrose.Controls.TextBox(),\n\
        new Primrose.Controls.TextBox(),\n\
        new Primrose.Controls.Button()\n\
      ];\n\
      \n\
      function focusOn(id){\n\
        for(var i = 0; i < ctrls.length; ++i){\n\
          var c = ctrls[i];\n\
          if(c.controlID === id){\n\
            c.focus();\n\
          }\n\
          else{\n\
            c.blur();\n\
          }\n\
        }\n\
      }"
      }]
    });

    this.focused = false;
    this.emit("blur", {
      target: this
    });
  }

  copyElement(elem) {

    pliny.method({
      parent: "Primrose.Controls.BaseControl",
      name: "copyElement",
      description: "Copies properties from a DOM element that the control is supposed to match.",
      parameters: [{
        name: "elem",
        type: "Element",
        description: "The element--e.g. a button or textarea--to copy."
      }],
      examples: [{
        name: "Rough concept",
        description: "The class is not used directly. Its methods would be used in a base\n\
    class that implements its functionality.\n\
    \n\
    The `copyElement()` method gets used when a DOM element is getting \"converted\"\n\
    to a 3D element on-the-fly.\n\
    \n\
      grammar(\"JavaScript\");\n\
      var myDOMButton = document.querySelector(\"button[type='button']\"),\n\
        my3DButton = new Primrose.Controls.Button3D();\n\
      my3DButton.copyElement(myDOMButton);"
      }]
    });

    this.element = elem;
    if (elem.style.transform) {
      var match = TRANSLATE_PATTERN.exec(elem.style.transform);
      if (match) {
        this.position.set(
          parseFloat(match[1]),
          parseFloat(match[2]),
          parseFloat(match[3]));
      }
      match = ROTATE_PATTERN.exec(elem.style.transform);
      if (match) {
        TEMP_VECTOR.set(
          parseFloat(match[1]),
          parseFloat(match[2]),
          parseFloat(match[3]));
        this.quaternion.setFromAxisAngle(
          TEMP_VECTOR,
          parseFloat(match[4]));
      }
    }
  }
}