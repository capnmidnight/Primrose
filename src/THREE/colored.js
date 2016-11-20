import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Geometry } from "three/src/core/Geometry";
import { Mesh } from "three/src/objects/Mesh";
import colored from "../live-api/colored";

BufferGeometry.prototype.colored =
Geometry.prototype.colored =
Mesh.prototype.colored =
  function(color, options){
    return colored(this, color, options);
  };