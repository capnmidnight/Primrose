"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.BaseControl = function () {
  "use strict";

  var ID = 1,
      NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
      DELIM = "\\s*,\\s*",
      UNITS = "(?:em|px)",
      TRANSLATE_PATTERN = new RegExp("translate3d\\s*\\(\\s*" + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + "\\s*\\)", "i"),
      ROTATE_PATTERN = new RegExp("rotate3d\\s*\\(\\s*" + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + "rad\\s*\\)", "i");

  pliny.class({
    parent: "Primrose",
    name: "BaseControl",
    description: "The BaseControl class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
  });

  pliny.method({
    parent: "Primrose.BaseControl",
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

  pliny.method({
    parent: "Primrose.BaseControl",
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

  pliny.method({
    parent: "Primrose.BaseControl",
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

  var BaseControl = function (_Primrose$AbstractEve) {
    _inherits(BaseControl, _Primrose$AbstractEve);

    function BaseControl() {
      _classCallCheck(this, BaseControl);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseControl).call(this));

      pliny.property({
        name: "controlID",
        type: "Number",
        description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
      });
      _this.controlID = ID++;

      pliny.property({
        name: "focused",
        type: "Boolean",
        description: "Flag indicating this control has received focus. You should theoretically only read it."
      });
      _this.focused = false;
      return _this;
    }

    _createClass(BaseControl, [{
      key: "focus",
      value: function focus() {
        this.focused = true;
        this.emit("focus", {
          target: this
        });
      }
    }, {
      key: "blur",
      value: function blur() {
        this.focused = false;
        emit.call(this, "blur", {
          target: this
        });
      }
    }, {
      key: "copyElement",
      value: function copyElement(elem) {
        this.element = elem;
        if (elem.style.transform) {
          var match = TRANSLATE_PATTERN.exec(elem.style.transform);
          if (match) {
            this.position.set(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
          }
          match = ROTATE_PATTERN.exec(elem.style.transform);
          if (match) {
            this.quaternion.setFromAxisAngle(new THREE.Vector3().set(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])), parseFloat(match[4]));
          }
        }
      }
    }]);

    return BaseControl;
  }(Primrose.AbstractEventEmitter);

  return BaseControl;
}();