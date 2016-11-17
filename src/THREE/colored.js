import { BufferGeometry, Geometry, Mesh } from "three";

BufferGeometry.prototype.colored =
Geometry.prototype.colored =
Mesh.prototype.colored =
  function(name, color, options){
    var mesh = window.colored(this, color, options);
    mesh.name = name;
    return mesh;
  };