"use strict";

if (window.THREE) {
  pliny.method({
    parent: "THREE.Object3D",
    name: "addToBrowserEnvironment",
    description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene. This half of the polyfill implements the visitor pattern, so that individual objects can define their own processing for this action.",
    parameters: [{ name: "env", type: "Primrose.BrowserEnvironment", description: "The environment (with collision detection and ray-picking capability) to which to register objects" }, { name: "scene", type: "THREE.Object3D", description: "The true parent element for `this` object" }]
  });
  THREE.Object3D.prototype.addToBrowserEnvironment = function (env, scene) {
    var _this = this;

    scene.add(this);
    // this has to be done as a lambda expression because it needs to capture the
    // env variable provided in the addToBrowserEnvironment call;

    pliny.method({
      parent: "THREE.Object3D",
      name: "appendChild",
      description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene.",
      parameters: [{ name: "child", type: "Object", description: "Any Primrose.Entity or THREE.Object3D to add to this object." }]
    });
    this.appendChild = function (child) {
      if (child.addToBrowserEnvironment) {
        return child.addToBrowserEnvironment(env, _this);
      } else {
        _this.add(child);
        env.registerPickableObject(child);
        return child;
      }
    };
  };
}