"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

pliny.class({
  parent: "Primrose",
  name: "Entity",
  description: "An object that receives user input events and network messages to perform actions."
});
Primrose.Entity = function () {
  "use strict";

  var entityKeys = [],
      entities = new WeakMap();

  pliny.class({
    parent: "Primrose",
    name: "Entity",
    description: "The Entity class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  });

  var Entity = function () {
    _createClass(Entity, null, [{
      key: "registerEntity",
      value: function registerEntity(e) {
        entities.set(e.id, e);
        entityKeys.push(e.id);
        e.addEventListener("_idchanged", function (evt) {
          entityKeys.splice(entityKeys.indexOf(evt.oldID), 1);
          entities.delete(evt.oldID);
          entities.set(evt.entity.id, evt.entity);
          entityKeys.push(evt.entity.id);
        }, false);
      }
    }, {
      key: "eyeBlankAll",
      value: function eyeBlankAll(eye) {
        entityKeys.forEach(function (id) {
          entities.get(id).eyeBlank(eye);
        });
      }
    }]);

    function Entity(id) {
      _classCallCheck(this, Entity);

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
        wheel: [],
        _idchanged: []
      };
    }

    _createClass(Entity, [{
      key: "addEventListener",


      /*
      pliny.method({
      parent: "Primrose.Entity",
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
      value: function addEventListener(event, func) {
        if (this.listeners[event]) {
          this.listeners[event].push(func);
        }
      }

      /*
      pliny.method({
      parent: "Primrose.Entity",
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

    }, {
      key: "removeEventListener",
      value: function removeEventListener(event, func) {
        var evts = this.listeners[event];
        if (evt) {
          var i = evts.indexOf(func);
          if (0 <= i && i < evts.length) {
            evts.splice(i, 1);
          }
        }
      }

      /*
      pliny.method({
      parent: "Primrose.Entity",
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

    }, {
      key: "focus",
      value: function focus() {
        this.focused = true;
        emit.call(this, "focus", { target: this });
      }

      /*
      pliny.method({
      parent: "Primrose.Entity",
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

    }, {
      key: "blur",
      value: function blur() {
        this.focused = false;
        for (var i = 0; i < this.children.length; ++i) {
          if (this.children[i].focused) {
            this.children[i].blur();
          }
        }
        emit.call(this, "blur", { target: this });
      }

      /*
      pliny.method({
      parent: "Primrose.Entity",
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

    }, {
      key: "appendChild",
      value: function appendChild(child) {
        if (child && !child.parent) {
          child.parent = this;
          this.children.push(child);
        }
      }

      /*
      pliny.method({
      parent: "Primrose.Entity",
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

    }, {
      key: "removeChild",
      value: function removeChild(child) {
        console.log("removeChild", this.id);
        var i = this.children.indexOf(child);
        if (0 <= i && i < this.children.length) {
          this.children.splice(i, 1);
          child.parent = null;
        }
      }
    }, {
      key: "_forFocusedChild",
      value: function _forFocusedChild(name, evt) {
        var elem = this.focusedElement;
        if (elem && elem !== this) {
          elem[name](evt);
        }
      }
    }, {
      key: "startDOMPointer",
      value: function startDOMPointer(evt) {
        for (var i = 0; i < this.children.length; ++i) {
          this.children[i].startDOMPointer(evt);
        }
      }
    }, {
      key: "eyeBlank",
      value: function eyeBlank(eye) {
        for (var i = 0; i < this.children.length; ++i) {
          this.children[i].eyeBlank(eye);
        }
      }
    }, {
      key: "moveDOMPointer",
      value: function moveDOMPointer(evt) {
        this._forFocusedChild("moveDOMPointer", evt);
      }
    }, {
      key: "startUV",
      value: function startUV(evt) {
        this._forFocusedChild("startUV", evt);
      }
    }, {
      key: "moveUV",
      value: function moveUV(evt) {
        this._forFocusedChild("moveUV", evt);
      }
    }, {
      key: "endPointer",
      value: function endPointer() {
        this._forFocusedChild("endPointer");
      }
    }, {
      key: "keyDown",
      value: function keyDown(evt) {
        this._forFocusedChild("keyDown", evt);
      }
    }, {
      key: "keyUp",
      value: function keyUp(evt) {
        this._forFocusedChild("keyUp", evt);
      }
    }, {
      key: "readClipboard",
      value: function readClipboard(evt) {
        this._forFocusedChild("readClipboard", evt);
      }
    }, {
      key: "copySelectedText",
      value: function copySelectedText(evt) {
        this._forFocusedChild("copySelectedText", evt);
      }
    }, {
      key: "cutSelectedText",
      value: function cutSelectedText(evt) {
        this._forFocusedChild("cutSelectedText", evt);
      }
    }, {
      key: "readWheel",
      value: function readWheel(evt) {
        this._forFocusedChild("readWheel", evt);
      }
    }, {
      key: "id",
      get: function get() {
        return this._id;
      },
      set: function set(v) {
        var oldID = this._id;
        this._id = new String(v);
        emit.call(this, "_idchanged", {
          oldID: oldID,
          entity: this
        });
      }
    }, {
      key: "theme",
      get: function get() {
        return null;
      },
      set: function set(v) {
        for (var i = 0; i < this.children.length; ++i) {
          this.children[i].theme = v;
        }
      }
    }, {
      key: "lockMovement",
      get: function get() {
        var lock = false;
        for (var i = 0; i < this.children.length && !lock; ++i) {
          lock |= this.children[i].lockMovement;
        }
        return lock;
      }
    }, {
      key: "focusedElement",
      get: function get() {
        if (this.focused) {
          for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (child.focused) {
              return child.focusedElement;
            }
          }
          return this;
        }
      }
    }]);

    return Entity;
  }();

  return Entity;
}();