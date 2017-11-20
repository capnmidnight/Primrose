import { Geometry, BufferGeometry } from "three";

BufferGeometry.prototype.center =
Geometry.prototype.center =
  function() {
    this.computeBoundingBox();
    const b = this.boundingBox,
          dx = (b.max.x + b.min.x) / 2,
          dy = (b.max.y + b.min.y) / 2,
          dz = (b.max.z + b.min.z) / 2;
    return this.offset(-dx, -dy, -dz);
  };
