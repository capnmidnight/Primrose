import { BufferGeometry, Geometry, Mesh } from "three";

BufferGeometry.prototype.textured =
Geometry.prototype.textured =
Mesh.prototype.textured =
  function(texture, options) {
    return window.textured(this, texture, options);
  };