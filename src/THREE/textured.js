import { BufferGeometry } from "three/src/core/BufferGeometry";
import { Geometry } from "three/src/core/Geometry";
import { Mesh } from "three/src/objects/Mesh";
import textured from "../live-api/textured";

BufferGeometry.prototype.textured =
Geometry.prototype.textured =
Mesh.prototype.textured =
  function(texture, options) {
    return textured(this, texture, options);
  };