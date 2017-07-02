import { Mesh } from "three";

import phys from "../live-api/phys";

Mesh.prototype.phys = function(options) {
  return phys(this, options);
};
