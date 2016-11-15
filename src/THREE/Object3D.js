import { Object3D } from "three/Three";

pliny.method({
  parent: "THREE.Object3D",
  name: "addToBrowserEnvironment",
  description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene. This half of the polyfill implements the visitor pattern, so that individual objects can define their own processing for this action.",
  parameters: [{
    name: "env",
    type: "Primrose.BrowserEnvironment",
    description: "The environment (with collision detection and ray-picking capability) to which to register objects"
  }, {
    name: "scene",
    type: "THREE.Object3D",
    description: "The true parent element for `this` object"
  }]
});
Object3D.prototype.addToBrowserEnvironment = function(env, scene) {
  scene.add(this);
  // this has to be done as a lambda expression because it needs to capture the
  // env variable provided in the addToBrowserEnvironment call;

  pliny.method({
    parent: "THREE.Object3D",
    name: "appendChild",
    description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene.",
    parameters: [{
      name: "child",
      type: "Object",
      description: "Any Primrose.Entity or THREE.Object3D to add to this object."
    }]
  });
  this.appendChild = (child) => {
    if (child.addToBrowserEnvironment) {
      return child.addToBrowserEnvironment(env, this);
    }
    else {
      this.add(child);
      env.registerPickableObject(child);
      return child;
    }
  };
}

Object3D.prototype.latLon = function(lat, lon, r) {
  lat = -Math.PI * (lat || 0) / 180;
  lon = Math.PI * (lon || 0) / 180;
  r = r || 1.5;
  this.rotation.set(lat, lon, 0, "XYZ");
  this.position.set(0, 0, -r);
  this.position.applyQuaternion(this.quaternion);
  return this;
}