pliny.class("Primrose", {
  name: "Entity",
  description: "An object that receives user input events and network messages to perform actions."
});
Primrose.Entity = (function () {
  "use strict";

  pliny.class("Primrose", {
    name: "Entity",
    description: "The Entity class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  });
  class Entity {

    constructor(id) {
      this.id = id;
      this.parent = null;
      this.children = [];
      this.focused = false;
      this.listeners = {
        focus: [],
        blur: [],
        click: [],
        keydown: [],
        keyup: [],
        paste: [],
        copy: [],
        cut: [],
        wheel: []
      };
    }

    /*
  pliny.method("Primrose.Entity", {
    name: "addEventListener",
    description: "Adding an event listener registers a function as being ready to receive events.",
    parameters: [
      { name: "evt", type: "String", description: "The name of the event for which we are listening." },
      { name: "thunk", type: "Function", description: "The callback to fire when the event occurs." }
    ],
    examples: [{
      name: "Add an event listener.",
      description: "The `addEventListener()` method operates nearly identically\n\
to the method of the same name on DOM elements.\n\
\n\
    grammar(\"JavaScript\");\n\
    var txt = new Primrose.Text.Controls.TextBox();\n\
    txt.addEventListener(\"mousemove\", console.log.bind(console, \"mouse move\"));\n\
    txt.addEventListener(\"keydown\", console.log.bind(console, \"key down\"));"
    }]
  });
    */
    addEventListener(event, func) {
      if (this.listeners[event]) {
        this.listeners[event].push(func);
      }
    }

    /*
  pliny.method("Primrose.Entity", {
    name: "removeEventListener",
      description: "Removing an event listener so that it no longer receives events from this object. Note that it must be the same function instance that was used when the event listener was added.",
        parameters: [
          { name: "evt", type: "String", description: "The name of the event from which we are removing." },
          { name: "thunk", type: "Function", description: "The callback to remove." }
        ],
          examples: [{
            name: "Remove an event listener.",
            description: "The `removeEventListener()` method operates nearly identically\n\
to the method of the same name on DOM elements.\n\
\n\
    grammar(\"JavaScript\");\n\
    var txt = new Primrose.Text.Controls.TextBox(),\n\
      func = console.log.bind(console, \"mouse move\");\n\
    txt.addEventListener(\"mousemove\", func);\n\
    txt.removeEventListener(\"mousemove\", func);"
          }]
  });*/
    removeEventListener(event, func) {
      const evts = this.listeners[event];
      if (evt) {
        const i = evts.indexOf(func);
        if (0 <= i && i < evts.length) {
          evts.splice(i, 1);
        }
      }
    }

    /*
  pliny.method("Primrose.Entity", {
    name: "focus",
    description: "Sets the focus property of the control, does not change the focus property of any other control.",
    examples: [{
      name: "Focus on one control, blur all the rest",
      description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = [\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Button()\n\
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
    */
    focus() {
      this.focused = true;
      emit.call(this, "focus", { target: this });
    }

    /*
  pliny.method("Primrose.Entity", {
    name: "blur",
      description: "Unsets the focus property of the control, does not change the focus property of any other control.",
        examples: [{
          name: "Focus on one control, blur all the rest",
          description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = [\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Controls.TextBox(),\n\
      new Primrose.Text.Button()\n\
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
    */
    blur() {
      this.focused = false;
      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].focused) {
          this.children[i].blur();
        }
      }
      emit.call(this, "blur", { target: this });
    }
    
    /*
  pliny.method("Primrose.Entity", {
    name: "appendChild",
      description: "Adds an Entity as a child entity of this entity.",
      parameters: [
        {name: "child", type: "Primrose.Entity", description: "The object to add. Will only succeed if `child.parent` is not set to a value." }
      ],
        examples: [{
          name: "Add an entity to another entity",
          description: "Entities can be arranged in parent-child relationships.\n\
\n\
    grammar(\"JavaScript\");\n\
    var a = new Primrose.Entity(),\n\
      b = new Primrose.Entity();\n\
    a.appendChild(b);\n\
    console.assert(a.children.length === 1);\n\
    console.assert(a.children[0] === b);\n\
    console.assert(b.parent === a);"
        }]
  });
    */
    appendChild(child) {
      if (child && !child.parent) {
        child.parent = this;
        this.children.push(child);
      }
    }
    
    
    /*
  pliny.method("Primrose.Entity", {
    name: "removeChild",
    description: "Removes an Entity from another Entity of this entity.",
    parameters: [
      { name: "child", type: "Primrose.Entity", description: "The object to remove. Will only succeed if `child.parent` is this object." }
    ],
    examples: [{
      name: "Remove an entity from another entity",
      description: "Entities can be arranged in parent-child relationships.\n\
\n\
    grammar(\"JavaScript\");\n\
    var a = new Primrose.Entity(),\n\
      b = new Primrose.Entity();\n\
    a.appendChild(b);\n\
    console.assert(a.children.length === 1);\n\
    console.assert(a.children[0] === b);\n\
    console.assert(b.parent === a);\n\
    a.removeChild(b);\n\
    console.assert(a.children.length === 0)\n\
    console.assert(b.parent === null);"
        }]
  });
    */
    removeChild(child) {
      console.log("removeChild", this.id);
      const i = this.children.indexOf(child);
      if (0 <= i && i < this.children.length) {
        this.children.splice(i, 1);
        child.parent = null;
      }
    }

    get lockMovement() {
      var lock = false;
      for (var i = 0; i < this.children.length && !lock; ++i) {
        lock |= this.children[i].lockMovement;
      }
      return lock;
    }

    keyDown(evt) {
      if (this.focused) {
        evt.target = this;
        emit.call(this, "keydown", evt);
      }
    }

    keyUp(evt) {
      if (this.focused) {
        emit.call(this, "keyup", { target: this, evt });
      }
    }

    readClipboard(evt) {
      if (this.focused) {
        evt.target = this;
        emit.call(this, "paste", evt);
      }
    }

    readWheel(evt) {
      if (this.focused) {
        evt.target = this;
        emit.call(this, "wheel", evt);
      }
    }
  }
  return Entity;
})();
