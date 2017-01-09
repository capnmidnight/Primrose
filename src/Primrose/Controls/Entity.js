pliny.class({
  parent: "Primrose.Controls",
  name: "Entity",
  baseClass: "THREE.Object3D",
  description: "The Entity class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
});

var entities = [];

pliny.function({
  parent: "Primrose.Controls.Entity",
  name: "eyeBlankAll",
  description: "Trigger the eyeBlank event for all registered entities.",
  parameters: [{
    name: "eye",
    type: "Number",
    description: "The eye to switch to: -1 for left, +1 for right."
  }]
});
export function eyeBlankAll(eye) {
  entities.forEach((entity) => entity.eyeBlank(eye));
}

import { Object3D } from "three/src/core/Object3D";

export default class Entity extends Object3D {

  constructor(id) {
    super();
    this.isEntity = true;
    this.name = id;

    pliny.property({
      parent: "Primrose.Controls.Entity",
      name: "focused",
      type: "Boolean",
      description: "A flag indicating if the element, or a child element within it, has received focus from the user."
    });
    this.focused = false;

    pliny.property({
      parent: "Primrose.Controls.Entity",
      name: "focusable",
      type: "Boolean",
      description: "A flag indicating if the element, or any child elements within it, is capable of receiving focus."
    });
    this.focusable = true;

    pliny.event({ parent: "Primrose.Controls.Entity", name: "focus", description: "If the element is focusable, occurs when the user clicks on an element for the first time, or when a program calls the `focus()` method." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "blur", description: "If the element is focused (which implies it is also focusable), occurs when the user clicks off of an element, or when a program calls the `blur()` method." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "click", description: "Occurs whenever the user clicks on an element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "keydown", description: "Occurs when the user pushes a key down while focused on the element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "keyup", description: "Occurs when the user releases a key while focused on the element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "paste", description: "Occurs when the user activates the clipboard's `paste` command while focused on the element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "cut", description: "Occurs when the user activates the clipboard's `cut` command while focused on the element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "copy", description: "Occurs when the user activates the clipboard's `copy` command while focused on the element." });
    pliny.event({ parent: "Primrose.Controls.Entity", name: "wheel", description: "Occurs when the user scrolls the mouse wheel while focused on the element." });

    entities.push(this);
  }

  focus() {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "focus",
      description: "If the control is focusable, sets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
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
    if (this.focusable) {
      this.focused = true;
      this.emit("focus", {
        target: this
      });
    }
  }

  blur() {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "blur",
      description: "If the element is focused, unsets the focus property of the control and all child controls. Does not change the focus property of any parent or sibling controls.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
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
    if (this.focused) {
      this.focused = false;
      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].focused) {
          this.children[i].blur();
        }
      }
      this.emit("blur", {
        target: this
      });
    }
  }

  get theme() {
    pliny.property({
      parent: "Primrose.Controls.Entity",
      name: "theme",
      type: "Primrose.Text.Themes.*",
      description: "Get or set the theme used for rendering text on any controls in the control tree."
    });
    return null;
  }

  set theme(v) {
    for (var i = 0; i < this.children.length; ++i) {
      this.children[i].theme = v;
    }
  }

  get lockMovement() {
    pliny.property({
      parent: "Primrose.Controls.Entity",
      name: "lockMovement",
      type: "Boolean",
      description: "Recursively searches the deepest leaf-node of the control graph for a control that has its `lockMovement` property set to `true`, indicating that key events should not be used to navigate the user, because they are being interpreted as typing commands."
    });
    var lock = false;
    for (var i = 0; i < this.children.length && !lock; ++i) {
      lock = lock || this.children[i].lockMovement;
    }
    return lock;
  }

  get focusedElement() {
    pliny.property({
      parent: "Primrose.Controls.Entity",
      name: "focusedElement",
      type: "Primrose.Controls.Entity",
      description: "Searches the deepest leaf-node of the control graph for a control that has its `focused` property set to `true`."
    });
    var result = null,
      head = this;
    while (head && head.focused) {
      result = head;
      var children = head.children;
      head = null;
      for (var i = 0; i < children.length; ++i) {
        var child = children[i];
        if (child.focused) {
          head = child;
        }
      }
    }
    return result;
  }

  eyeBlank(eye) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "eyeBlank",
      parameters: [{
        name: "eye",
        type: "Number",
        description: "The eye to switch to: -1 for left, +1 for right."
      }],
      description: "Instructs any stereoscopically rendered surfaces to change their rendering offset."
    });
    for (var i = 0; i < this.children.length; ++i) {
      if(this.children[i].isEntity) {
        this.children[i].eyeBlank(eye);
      }
    }
  }

  _forFocusedChild(name, evt) {
    var elem = this.focusedElement;
    if (elem && elem !== this) {
      elem[name](evt);
    }
  }

  startUV(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "startUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseDown` and `touchStart` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused children."
    });
    this._forFocusedChild("startUV", evt);
  }

  moveUV(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "moveUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseMove` and `touchMove` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused children."
    });
    this._forFocusedChild("moveUV", evt);
  }

  endPointer(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "endPointer",
      description: "Hooks up to the window's `mouseUp` and `toucheEnd` events and propagates it to any of its focused children."
    });
    this._forFocusedChild("endPointer", evt);
  }

  dispatchEvent(evt) {
    switch(evt.type){
      case "pointerstart":
        this.startUV(evt.hit.uv);
      break;
      case "pointerend":
        this.endPointer(evt);
      break;
      case "pointermove":
      case "gazemove":
        this.moveUV(evt.hit.uv);
      break;
      case "gazecomplete":
        this.startUV(evt.hit.uv);
        setTimeout(() => this.endPointer(evt), 100);
      break;
    }
  }

  keyDown(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "keyDown",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyDown` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("keyDown", evt);
  }

  keyUp(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "keyUp",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyUp` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("keyUp", evt);
  }

  readClipboard(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "readClipboard",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `paste` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("readClipboard", evt);
  }

  copySelectedText(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "copySelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `copy` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("copySelectedText", evt);
  }

  cutSelectedText(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "cutSelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `cut` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("cutSelectedText", evt);
  }

  readWheel(evt) {
    pliny.method({
      parent: "Primrose.Controls.Entity",
      name: "readWheel",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The wheel event to read"
      }],
      description: "Hooks up to the window's `wheel` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("readWheel", evt);
  }
}