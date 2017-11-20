/*
pliny.function({
  parent: "Live API",
  name: "cloud",
  description: "Creates a point cloud with points of a fixed color and size out of an array of vertices.",
  parameters: [{
    name: "verts",
    type: "Array",
    description: "An array of `THREE.Vector3`s to turn into a `THREE.Points` object."
  }, {
    name: "c",
    type: "Number",
    description: "A hexadecimal color value to use when creating the `THREE.PointsMaterial` to go with the point cloud."
  }, {
    name: "s",
    type: "Number",
    description: "A numeric size value to use when creating the `THREE.PointsMaterial` to go with the point cloud."
  }],
  returns: "THREE.Points",
  examples: [{
    name: "Create randomized \"dust\".",
    description: "Creating a cloud is pretty simple.\n\
\n\
    grammar(\"JavaScript\");\n\
    var verts = [],\n\
        R = Primrose.Random.number,\n\
        WIDTH = 10,\n\
        HEIGHT = 10,\n\
        DEPTH = 10;\n\
    \n\
    for (var i = 0; i< 5000; ++i) {\n\
      verts.push(v3(R(-0.5 * WIDTH, 0.5 * WIDTH),\n\
                    R(-0.5 * HEIGHT, 0.5 * HEIGHT),\n\
                    R(-0.5 * DEPTH, 0.5 * DEPTH)));\n\
    }\n\
    cloud(verts, 0x7f7f7f 0.05)\n\
      .addTo(scene)\n\
      .at(WIDTH / 2 , HEIGHT / 2, DEPTH / 2);\n\
\n\
The results should look like this:\n\
\n\
<img src=\"images/cloud.jpg\">"
  }]
});
*/

import { Geometry, PointsMaterial, Points } from "three";

import { cache } from "../util";


export default function cloud(verts, c, s) {
  var geom = new Geometry();
  for (var i = 0; i < verts.length; ++i) {
    geom.vertices.push(verts[i]);
  }
  var mat = cache(
    `PointsMaterial(${c}, ${s})`,
    () => new PointsMaterial({
      color: c,
      size: s
    }));
  return new Points(geom, mat);
};
