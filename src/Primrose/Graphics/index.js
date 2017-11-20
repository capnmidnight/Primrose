/*
pliny.namespace({
  parent: "Primrose",
  name: "Graphics",
  description: "The Graphics namespace contains classes and functions that with 3D geometry."
});
*/

import fixGeometry from "./fixGeometry";
import InsideSphereGeometry from "./InsideSphereGeometry";
import loadTexture from "./loadTexture";
import ModelFactory from "./ModelFactory";

export {
  fixGeometry,
  InsideSphereGeometry,
  loadTexture,
  ModelFactory
};

export default {
  fixGeometry,
  InsideSphereGeometry,
  loadTexture,
  ModelFactory
};
