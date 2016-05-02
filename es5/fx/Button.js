"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Button = function () {
  pliny.class({
    parent: "Primrose",
    name: "Button",
    baseClass: "Primrose.BaseControl",
    parameters: [{ name: "model", type: "THREE.Object3D", description: "A 3D model to use as the graphics for this button." }, { name: "name", type: "String", description: "A name for the button, to make it distinct from other buttons." }, { name: "options", type: "Object", description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released." }],
    description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
  });

  var Button = function (_Primrose$BaseControl) {
    _inherits(Button, _Primrose$BaseControl);

    function Button(model, name, options) {
      _classCallCheck(this, Button);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this));

      options = patch(options, Button);
      options.minDeflection = Math.cos(options.minDeflection);
      options.colorUnpressed = new THREE.Color(options.colorUnpressed);
      options.colorPressed = new THREE.Color(options.colorPressed);

      pliny.event({
        name: "click",
        description: "Occurs when the button is activated."
      });
      _this.listeners.click = [];

      pliny.event({
        name: "release",
        description: "Occurs when the button is deactivated."
      });
      _this.listeners.release = [];

      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The stand the button cap sits on."
      });
      _this.base = model.children[1];

      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The moveable part of the button, that triggers the click event."
      });
      _this.cap = model.children[0];
      _this.cap.name = name;
      _this.cap.material = _this.cap.material.clone();
      _this.cap.button = _this;
      _this.cap.base = _this.base;

      pliny.property({
        name: "container",
        type: "THREE.Object3D",
        description: "A grouping collection for the base and cap."
      });
      _this.container = new THREE.Object3D();
      _this.container.add(_this.base);
      _this.container.add(_this.cap);

      pliny.property({
        name: "color",
        type: "Number",
        description: "The current color of the button cap."
      });
      _this.color = _this.cap.material.color;
      _this.name = name;
      _this.element = null;

      _this.startUV = function () {
        this.color.copy(options.colorPressed);
        if (this.element) {
          this.element.click();
        } else {
          emit.call(this, "click");
        }
      };

      _this.moveUV = function () {};

      _this.endPointer = function () {
        this.color.copy(options.colorUnpressed);
        emit.call(this, "release");
      };
      return _this;
    }

    return Button;
  }(Primrose.BaseControl);

  pliny.record({
    parent: "Primrose.Button",
    name: "DEFAULTS",
    description: "Default option values that override undefined options passed to the Button class."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "maxThrow",
    type: "Number",
    description: "The limit for how far the button can be depressed."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "minDeflection",
    type: "Number",
    description: "The minimum distance the button must be depressed before it is activated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "colorUnpressed",
    type: "Number",
    description: "The color to change the button cap to when the button is deactivated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "colorPressed",
    type: "Number",
    description: "The color to change the button cap to when the button is activated."
  });
  pliny.value({
    parent: "Primrose.Button.DEFAULTS",
    name: "toggle",
    type: "Boolean",
    description: "True if deactivating the button should require a second click. False if the button should deactivate when it is released."
  });
  Button.DEFAULTS = {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true
  };

  pliny.property({
    parent: "Primrose.Button",
    name: "position",
    type: "THREE.Vector3",
    description: "The location of the button."
  });
  Object.defineProperty(Button.prototype, "position", {
    get: function get() {
      return this.container.position;
    }
  });

  return Button;
}();