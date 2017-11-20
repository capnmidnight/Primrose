/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Button3D",
  baseClass: "Primrose.Controls.Entity",
  parameters: [{
    name: "model",
    type: "THREE.Object3D",
    description: "A 3D model to use as the graphics for this button."
  }, {
    name: "buttonName",
    type: "String",
    description: "A name for the button, to make it distinct from other buttons."
  }, {
    name: "options",
    type: "Object",
    description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released."
  }],
  description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
});
*/

import Entity from "./Entity";
import { Color } from "three";
export default class Button3D extends Entity {
  constructor(model, buttonName, options) {
    super(buttonName, Object.assign({}, Button3D.DEFAULTS, options));

    this.options.minDeflection = Math.cos(this.options.minDeflection);
    this.options.colorUnpressed = new Color(this.options.colorUnpressed);
    this.options.colorPressed = new Color(this.options.colorPressed);

    /*
    pliny.event({
      parent: "Primrose.Controls.Button3D",
      name: "click",
      description: "Occurs when the button is activated."
    });
    */

    /*
    pliny.event({
      parent: "Primrose.Controls.Button3D",
      name: "release",
      description: "Occurs when the button is deactivated."
    });
    */

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "base",
      type: "THREE.Object3D",
      description: "The stand the button cap sits on."
    });
    */
    this.base = model.children[1];

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "base",
      type: "THREE.Object3D",
      description: "The moveable part of the button, that triggers the click event."
    });
    */
    this.cap = model.children[0];
    this.cap.name = buttonName;
    this.cap.material = this.cap.material.clone();
    this.cap.button = this;
    this.cap.base = this.base;

    this.add(this.base);
    this.add(this.cap);

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "color",
      type: "Number",
      description: "The current color of the button cap."
    });
    */
    this.color = this.cap.material.color;

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: " name",
      type: "String",
      description: "A name for the button, to tell it from others when debugging."
    });
    */
    this.name = buttonName;

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "element",
      type: "Element",
      optional: true,
      description: "If this 3D button was created from a copy of an HTMLButtonElement, this is that element."
    });
    */
    this.element = null;
  }

  startUV(point) {

    /*
    pliny.method({
      parent: "Primrose.Controls.Button3D",
      name: "startUV",
      description: "Handle a mouse-down event on a textured object.",
      parameters: [{
        name: "point",
        type: "Primrose.Text.Point",
        description: "The UV coordinate of the texture that was clicked."
      }]
    });
    */

    this.color.copy(this.options.colorPressed);
    if (this.element) {
      this.element.click();
    }
    else {
      this.emit("click", { source: this });
    }
  }

  endPointer(evt) {

    /*
    pliny.method({
      parent: "Primrose.Controls.Button3D",
      name: "endPointer",
      description: "Handle a mouse-up event on a textured object.",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "Not actually used."
      }]
    });
    */

    this.color.copy(this.options.colorUnpressed);
    this.emit("release", { source: this });
  }

  consumeEvent(evt) {

    /*
    pliny.method({
      parent: "Primrose.Controls.Button3D",
      name: "consumeEvent",
      description: "Route events.",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The event to route."
      }]
    });
    */

    switch(evt.type){
      case "pointerstart":
        this.startUV();
      break;
      case "pointerend":
        this.endPointer(evt);
      break;
      case "gazecomplete":
        this.startUV();
        setTimeout(() => this.endPointer(evt), 100);
      break;
    }
  }
}

/*
pliny.record({
  parent: "Primrose.Controls.Button3D",
  name: "DEFAULTS",
  description: "Default option values that override undefined options passed to the Button3D class."
});
*/
/*
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "maxThrow",
  type: "Number",
  description: "The limit for how far the button can be depressed."
});
*/
/*
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "minDeflection",
  type: "Number",
  description: "The minimum distance the button must be depressed before it is activated."
});
*/
/*
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "colorUnpressed",
  type: "Number",
  description: "The color to change the button cap to when the button is deactivated."
});
*/
/*
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "colorPressed",
  type: "Number",
  description: "The color to change the button cap to when the button is activated."
});
*/
/*
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "toggle",
  type: "Boolean",
  description: "True if deactivating the button should require a second click. False if the button should deactivate when it is released."
});
*/
Button3D.DEFAULTS = {
  maxThrow: 0.1,
  minDeflection: 10,
  colorUnpressed: 0x7f0000,
  colorPressed: 0x007f00,
  toggle: true
};
