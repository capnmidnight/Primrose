import { Mesh, Object3D } from "three";

import phys from "../live-api/phys";

Object3D.prototype.phys = Mesh.prototype.phys = function(options) {
  return phys(this, options);
};
