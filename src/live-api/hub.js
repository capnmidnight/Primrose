/*
pliny.function({
  parent: "Live API",
  name: "hub",
  description: "Calling `hub()` is a short-hand for creating a new `THREE.Object3D`. This is useful in live-coding examples to keep code terse and easy to write. It also polyfills in a method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the hub using `appendChild()` such that they may be pickable in the scene.",
  returns: "THREE.Object3D",
  examples: [{
    name: "Basic usage",
    description: `
    grammar("JavaScript");
    //these two lines of code perform the same task.
    var base1 = new THREE.Object3D();
    var base2 = hub();`
  }]
});
*/

import { Object3D } from "three";


export default function hub() {
  return new Object3D();
};
