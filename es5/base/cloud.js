"use strict";

pliny.function({
  name: "cloud",
  description: "| [under construction]"
});
function cloud(verts, c, s) {
  var geom = new THREE.Geometry();
  for (var i = 0; i < verts.length; ++i) {
    geom.vertices.push(verts[i]);
  }
  var mat = cache("PointsMaterial(" + c + ", " + s + ")", function () {
    return new THREE.PointsMaterial({ color: c, size: s });
  });
  return new THREE.Points(geom, mat);
}
