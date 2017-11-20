import { BufferGeometry, Geometry, Mesh } from "three";

import { colored } from "../live-api";


BufferGeometry.prototype.colored =
Geometry.prototype.colored =
Mesh.prototype.colored =
  function(color, options){
    return colored(this, color, options);
  };
