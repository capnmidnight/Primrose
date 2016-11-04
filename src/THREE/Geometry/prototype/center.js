function center() {
  this.computeBoundingBox();
  const b = this.boundingBox,
        dx = (b.max.x + b.min.x) / 2,
        dy = (b.max.y + b.min.y) / 2,
        dz = (b.max.z + b.min.z) / 2,
        verts = this.vertices;
  for(let i = 0; i < verts.length; ++i){
    verts[i].x -= dx;
    verts[i].y -= dy;
    verts[i].z -= dz;
  }
  return this;
}