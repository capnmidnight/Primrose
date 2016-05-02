"use strict";

Primrose.ButtonFactory = function () {

  var buttonCount = 0;

  pliny.class({
    parent: "Primrose",
    name: "ButtonFactory",
    description: "Loads a model file and holds the data, creating clones of the data whenever a new button is desired.",
    parameters: [{ name: "template", type: "THREE.Object3D", description: "A THREE.Object3D that specifies a 3D model for a button, to be used as a template." }, { name: "options", type: "Object", description: "The options to apply to all buttons that get created by the factory." }, { name: "complete", type: "Function", description: "A callback function to indicate when the loading process has completed, if `templateFile` was a String path." }]
  });
  function ButtonFactory(templateFile, options) {
    pliny.property({
      name: "options",
      type: "Object",
      description: "The options that the user provided, so that we might change them after the factory has been created, if we so choose."
    });
    this.options = options;
    pliny.property({
      name: "template",
      type: "THREE.Object3D",
      description: "The 3D model for the button, that will be cloned every time a new button is created."
    });
    this.template = templateFile;
  }

  pliny.method({
    parent: "Primrose.ButtonFactory",
    name: "create",
    description: "Clones all of the geometry, materials, etc. in a 3D model to create a new copy of it. This really should be done with instanced objects, but I just don't have the time to deal with it right now.",
    parameters: [{ name: "toggle", type: "Boolean", description: "True if the new button should be a toggle button (requiring additional clicks to deactivate) or a regular button (deactivating when the button is released, aka \"momentary\"." }],
    return: "The cloned button that which we so desired."
  });
  ButtonFactory.prototype.create = function (toggle) {
    var name = "button" + ++buttonCount;
    var obj = this.template.clone();
    var btn = new Primrose.Button(obj, name, this.options, toggle);
    return btn;
  };

  return ButtonFactory;
}();