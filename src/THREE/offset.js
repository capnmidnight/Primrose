import { Geometry, BufferGeometry } from "three";

Geometry.prototype.offset = function(x, y, z){
  const arr = this.vertices;
  for(let i = 0; i < arr.length; ++i) {
    const vert = arr[i];
    vert.x += x;
    vert.y += y;
    vert.z += z;
  }
  return this;
};

BufferGeometry.prototype.offset = function(x, y, z){
  const arr = this.attributes.position.array,
    l = this.attributes.position.itemSize;
  for(let i = 0; i < arr.length; i += l) {
    arr[i] += x;
    arr[i + 1] += y;
    arr[i + 2] += z;
  }
  return this;
};
