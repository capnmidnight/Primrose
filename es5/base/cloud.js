"use strict";

pliny.issue({
  name: "document cloud",
  type: "open",
  description: "Finish writing the documentation for the [`cloud`](#cloud) function\n\
in the helpers/graphics.js file."
});
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

pliny.issue({
  name: "document helpers/graphics",
  type: "open",
  description: "Finish writing the documentation for the [graphics](#graphics) class in the helpers/ directory"
});
