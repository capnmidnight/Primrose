Primrose.Button = ( function () {
  pliny.class({
    parent: "Primrose",
    name: "Button",
    baseClass: "Primrose.BaseControl",
    parameters: [
      {name: "model", type: "THREE.Object3D", description: "A 3D model to use as the graphics for this button."},
      {name: "name", type: "String", description: "A name for the button, to make it distinct from other buttons."},
      {name: "options", type: "Object", description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released."}
    ],
    description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
  } );
  class Button extends Primrose.BaseControl{
    constructor(model, name, options) {
      super();

      options = patch(options, Button);
      options.minDeflection = Math.cos(options.minDeflection);
      options.colorUnpressed = new THREE.Color(options.colorUnpressed);
      options.colorPressed = new THREE.Color(options.colorPressed);

      pliny.event({
        name: "click",
        description: "Occurs when the button is activated."
      });
      this.listeners.click = [];

      pliny.event({
        name: "release",
        description: "Occurs when the button is deactivated."
      });
      this.listeners.release = [];

      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The stand the button cap sits on."
      });
      this.base = model.children[1];

      pliny.property({
        name: "base",
        type: "THREE.Object3D",
        description: "The moveable part of the button, that triggers the click event."
      });
      this.cap = model.children[0];
      this.cap.name = name;
      this.cap.material = this.cap.material.clone();
      this.cap.button = this;
      this.cap.base = this.base;

      pliny.property({
        name: "container",
        type: "THREE.Object3D",
        description: "A grouping collection for the base and cap."
      });
      this.container = new THREE.Object3D();
      this.container.add(this.base);
      this.container.add(this.cap);

      pliny.property({
        name: "color",
        type: "Number",
        description: "The current color of the button cap."
      });
      this.color = this.cap.material.color;
      this.name = name;
      this.element = null;



      this.startUV = function () {
        this.color.copy(options.colorPressed);
        if (this.element) {
          this.element.click();
        }
        else {
          emit.call(this, "click");
        }
      };

      this.moveUV = function () {

      };

      this.endPointer = function () {
        this.color.copy(options.colorUnpressed);
        emit.call(this, "release");
      };
    }
  }
  
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
  } );
  Object.defineProperty( Button.prototype, "position", {
    get: function () {
      return this.container.position;
    }
  } );

  return Button;
} )();

