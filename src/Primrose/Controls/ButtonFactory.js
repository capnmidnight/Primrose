/*
pliny.class({
  parent: "Primrose.Controls",
  name: "ButtonFactory",
  description: "Loads a model file and holds the data, creating clones of the data whenever a new button is desired.",
  parameters: [{
    name: "template",
    type: "THREE.Object3D",
    description: "A THREE.Object3D that specifies a 3D model for a button, to be used as a template."
  }, {
    name: "options",
    type: "Object",
    description: "The options to apply to all buttons that get created by the factory."
  }, {
    name: "complete",
    type: "Function",
    description: "A callback function to indicate when the loading process has completed, if `templateFile` was a String path."
  }]
});
*/

import { colored, box } from "../../live-api";

import Button3D from "./Button3D";

let buttonCount = 0;

export default class ButtonFactory {

  constructor(templateFile, options) {
    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "options",
      type: "Object",
      description: "The options that the user provided, so that we might change them after the factory has been created, if we so choose."
    });
    */
    this.options = options;

    /*
    pliny.property({
      parent: "Primrose.Controls.Button3D",
      name: "template",
      type: "THREE.Object3D",
      description: "The 3D model for the button, that will be cloned every time a new button is created."
    });
    */
    this.template = templateFile;
  }

  create(toggle) {
    /*
    pliny.method({
      parent: "Primrose.ButtonFactory",
      name: "create",
      description: "Clones all of the geometry, materials, etc. in a 3D model to create a new copy of it. This really should be done with instanced objects, but I just don't have the time to deal with it right now.",
      parameters: [{
        name: "toggle",
        type: "Boolean",
        description: "True if the new button should be a toggle button (requiring additional clicks to deactivate) or a regular button (deactivating when the button is released, aka \"momentary\"."
      }],
      return: "The cloned button that which we so desired."
    });
    */

    var name = "button" + (++buttonCount);
    var obj = this.template.clone();
    var btn = new Button3D(obj, name, this.options, toggle);
    return btn;
  }

}

ButtonFactory.DEFAULT = new ButtonFactory(
  colored(box(1, 1, 1), 0xff0000), {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true
  });
