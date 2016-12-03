pliny.namespace({
  parent: "Primrose",
  name: "Graphics",
  description: "The Graphics namespace contains classes and functions that with 3D geometry."
});

import fixGeometry from "./fixGeometry";
import InsideSphereGeometry from "./InsideSphereGeometry";
import loadTexture from "./loadTexture";
import ModelLoader from "./ModelLoader";

export {
  fixGeometry,
  InsideSphereGeometry,
  loadTexture,
  ModelLoader
};

export default {
  fixGeometry,
  InsideSphereGeometry,
  loadTexture,
  ModelLoader
};