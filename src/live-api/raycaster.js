/*
pliny.function({
  parent: "Live API",
  name: "raycaster",
  description: "Creates a THREE.Raycaster. This is useful so you don't have to try to figure out how to import any parts of Three.js separately from Primrose. It also makes it possible to use in functional settings."
});
*/

import { Raycaster } from "three";


export default function raycaster() {
  return new Raycaster();
};
