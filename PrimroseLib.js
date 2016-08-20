;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.InsideSphereGeometry = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  name: "InsideSphereGeometry",
    parameters: [{
      name: "radius",
      type: "Number",
      description: "How far the sphere should extend away from a center point."
    }, {
      name: "widthSegments",
      type: "Number",
      description: "The number of faces wide in which to slice the geometry."
    }, {
      name: "heightSegments",
      type: "Number",
      description: "The number of faces tall in which to slice the geometry."
    }, {
      name: "phiStart",
      type: "Number",
      description: "The angle in radians around the Y-axis at which the sphere starts."
    }, {
      name: "phiLength",
      type: "Number",
      description: "The change of angle in radians around the Y-axis to which the sphere ends."
    }, {
      name: "thetaStart",
      type: "Number",
      description: "The angle in radians around the Z-axis at which the sphere starts."
    }, {
      name: "thetaLength",
      type: "Number",
      description: "The change of angle in radians around the Z-axis to which the sphere ends."
    }],
    description: "The InsideSphereGeometry is basically an inside-out Sphere. Or\n\
more accurately, it's a Sphere where the face winding order is reversed, so that\n\
textures appear on the inside of the sphere, rather than the outside. I know, that's\n\
note exactly helpful.\n\
\n\
Say you want a to model the sky as a sphere, or the inside of a helmet. You don't\n\
care anything about the outside of this sphere, only the inside. You would use\n\
InsideSphereGeometry in this case. Or its alias, [`shell()`](#shell)."
});

function InsideSphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
  "use strict";

  THREE.Geometry.call(this);

  this.type = 'InsideSphereGeometry';

  this.parameters = {
    radius: radius,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    phiStart: phiStart,
    phiLength: phiLength,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  radius = radius || 50;

  widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
  heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

  phiStart = phiStart !== undefined ? phiStart : 0;
  phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

  var x,
    y,
    vertices = [],
    uvs = [];

  for (y = 0; y <= heightSegments; y++) {

    var verticesRow = [];
    var uvsRow = [];

    for (x = widthSegments; x >= 0; x--) {

      var u = x / widthSegments;

      var v = y / heightSegments;

      var vertex = new THREE.Vector3();
      vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(
        thetaStart + v * thetaLength);
      vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
      vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(
        thetaStart + v * thetaLength);

      this.vertices.push(vertex);

      verticesRow.push(this.vertices.length - 1);
      uvsRow.push(new THREE.Vector2(1 - u, 1 - v));

    }

    vertices.push(verticesRow);
    uvs.push(uvsRow);

  }

  for (y = 0; y < heightSegments; y++) {

    for (x = 0; x < widthSegments; x++) {

      var v1 = vertices[y][x + 1];
      var v2 = vertices[y][x];
      var v3 = vertices[y + 1][x];
      var v4 = vertices[y + 1][x + 1];

      var n1 = this.vertices[v1].clone()
        .normalize();
      var n2 = this.vertices[v2].clone()
        .normalize();
      var n3 = this.vertices[v3].clone()
        .normalize();
      var n4 = this.vertices[v4].clone()
        .normalize();

      var uv1 = uvs[y][x + 1].clone();
      var uv2 = uvs[y][x].clone();
      var uv3 = uvs[y + 1][x].clone();
      var uv4 = uvs[y + 1][x + 1].clone();

      if (Math.abs(this.vertices[v1].y) === radius) {

        uv1.x = (uv1.x + uv2.x) / 2;
        this.faces.push(new THREE.Face3(v1, v3, v4, [n1, n3, n4]));
        this.faceVertexUvs[0].push([uv1, uv3, uv4]);

      }
      else if (Math.abs(this.vertices[v3].y) === radius) {

        uv3.x = (uv3.x + uv4.x) / 2;
        this.faces.push(new THREE.Face3(v1, v2, v3, [n1, n2, n3]));
        this.faceVertexUvs[0].push([uv1, uv2, uv3]);

      }
      else {

        this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]));
        this.faceVertexUvs[0].push([uv1, uv2, uv4]);

        this.faces.push(new THREE.Face3(v2, v3, v4, [n2.clone(), n3,
          n4.clone()
        ]));
        this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);

      }

    }

  }

  this.computeFaceNormals();

  for (var i = 0; i < this.faces.length; ++i) {
    var f = this.faces[i];
    f.normal.multiplyScalar(-1);
    for (var j = 0; j < f.vertexNormals.length; ++j) {
      f.vertexNormals[j].multiplyScalar(-1);
    }
  }

  this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);

}
if (typeof window.THREE !== "undefined") {

  InsideSphereGeometry.prototype = Object.create(THREE.Geometry.prototype);
  InsideSphereGeometry.prototype.constructor = InsideSphereGeometry;
}
return InsideSphereGeometry;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.PIXEL_SCALES = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "PIXEL_SCALES",
  description: "Scaling factors for changing the resolution of the display when the render quality level changes."
});
const PIXEL_SCALES = [
  0.5,
  0.25,
  0.333333,
  0.5,
  1
];
return PIXEL_SCALES;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose = factory();
  }
}(this, function() {
/*
 * Copyright (C) 2014 - 2016 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
"use strict";

pliny.namespace({
  name: "Primrose",
  description: "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments."
});
var Primrose = {};
return Primrose;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Quality = factory();
  }
}(this, function() {
"use strict";

pliny.enumeration({
  name: "Quality",
  description: "Graphics quality settings."
});
const Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};
return Quality;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.axis = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "axis",
  description: "Creates a set of reference axes, with X as red, Y as green, and Z as blue.",
  parameters: [{
    name: "length",
    type: "Number",
    description: "The length each axis should be in its own axis."
  }, {
    name: "width",
    type: "Number",
    description: "The size each axis should be in the other axes."
  }],
  returns: "THREE.Object3D",
  examples: [{
    name: "Basic usage",
    description: "To create a fixed point of reference in the scene, use the `axis()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var scene = new THREE.Scene()\n\
    // This set of axis bars will each be 1 meter long and 5cm wide.\n\
    // They'll be centered on each other, so the individual halves\n\
    // of the bars will only extend half a meter.\n\
    scene.add(axis(1, 0.05));\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/axis.png)"
  }]
});

function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width))
    .on(center);
  put(brick(0x00ff00, width, length, width))
    .on(center);
  put(brick(0x0000ff, width, width, length))
    .on(center);
  return center;
}
return axis;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.box = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "box",
  description: "A shortcut function for the THREE.BoxGeometry class. Creates a \"rectilinear prism\", i.e. the general class of rectangular objects that includes cubes.",
  parameters: [{
    name: "width",
    type: "Number",
    description: "The size of the box in the X dimension."
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The size of the box in the Y dimension. If height is not provided, it will be set to the width parameter."
  }, {
    name: "length",
    type: "Number",
    optional: true,
    description: "The size of the box in the Z dimension. If length is not provided, it will be set to the width parameter."
  }],
  returns: "THREE.BoxGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple box geometry object that you can then add a material to create a mesh:\n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = box(1, 2, 3),\n\
      mesh = textured(geom, 0xff0000);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/box.jpg\">"
  }]
});

function box(width, height, length) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return cache(
    `BoxGeometry(${width}, ${height}, ${length})`,
    () => new THREE.BoxGeometry(width, height, length));
}
return box;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.brick = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "brick",
  description: "Creates a textured box. See [`box()`](#box) and [`textured()`](#textured). The texture will be repeated across the box.",
  parameters: [{
    name: "txt",
    type: "Texture description",
    description: "The texture to apply to the box."
  }, {
    name: "width",
    type: "Number",
    optional: true,
    description: "The size of the box in the X dimension.",
    default: 1
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The size of the box in the Y dimension.",
    default: 1
  }, {
    name: "length",
    type: "Number",
    optional: true,
    description: "The size of the box in the Z dimension.",
    default: 1
  }],
  returns: "THREE.Mesh",
  examples: [{
    name: "Basic usage",
    description: "To create a textured brick with the `brick()` function.:\n\
\n\
    grammar(\"JavaScript\");\n\
    var mesh = brick(DECK, 1, 2, 3);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/brick.jpg)"
  }]
});

function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}
return brick;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.cache = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "cache",
  description: "Looks for the hashed name of the object in the object cache, and if it exists, returns it. If it doesn't exist, calls the makeObject function, using the return results to set the object in the cache, and returning it. In other words, a simple sort of memoization.",
  parameters: [{
    name: "hash",
    type: "String",
    description: "The hash key for the object to cache or retrieve."
  }, {
    name: "makeObject",
    type: "Function",
    description: "A function that creates the object we want, if it doesn't already exist in the cache."
  }],
  returns: "Object",
  examples: [{
    name: "Basic usage",
    description: "Using the `cache()` function lets you create an object once and retrieve it back again with the same function call.\n\
\n\
    grammar(\"JavaScript\");\n\
    function makeCube(i){\n\
      return cache(\"cubeGeom\" + i, function(){\n\
        return new THREE.BoxGeometry(i, i, i);\n\
      });\n\
    }\n\
    \n\
    var a = makeCube(1),\n\
        b = makeCube(2),\n\
        c = makeCube(1);\n\
    \n\
    console.assert(a !== b);\n\
    console.assert(a === c);"
  }]
});
const cache = (function () {
  const _cache = {};
  return (hash, makeObject) => {
    if (!_cache[hash]) {
      _cache[hash] = makeObject();
    }
    return _cache[hash];
  };
})();
return cache;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.clone = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "clone",
  parameters: [{
    name: "obj",
    type: "Object",
    description: "The object-literal to clone"
  }],
  description: "Creates a copy of a JavaScript object literal.",
  examples: [{
    name: "Create a copy of an object.",
    description: "To create a copy of an object that can be modified without modifying the original object, use the `clone()` function:\n\
\n\
    grammar(\"JavaScript\");\n\
    var objA = { x: 1, y: 2 },\n\
        objB = clone(objA);\n\
    console.assert(objA !== objB);\n\
    console.assert(objA.x === objB.x);\n\
    console.assert(objA.y === objB.y);\n\
    objB.x = 3;\n\
    console.assert(objA.x !== objB.x);"
  }]
});

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
return clone;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.cloud = factory();
  }
}(this, function() {
"use strict";

pliny.function({
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
    put(cloud(verts, 0x7f7f7f 0.05))\n\
      .on(scene)\n\
      .at(WIDTH / 2 , HEIGHT / 2, DEPTH / 2);\n\
\n\
The results should look like this:\n\
\n\
<img src=\"images/cloud.jpg\">"
  }]
});

function cloud(verts, c, s) {
  var geom = new THREE.Geometry();
  for (var i = 0; i < verts.length; ++i) {
    geom.vertices.push(verts[i]);
  }
  var mat = cache(
    `PointsMaterial(${c}, ${s})`,
    () => new THREE.PointsMaterial({
      color: c,
      size: s
    }));
  return new THREE.Points(geom, mat);
}
return cloud;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.copyObject = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "copyObject",
  description: "Copies properties from one object to another, essentially cloning the source object into the destination object. Uses a local stack to perform recursive copying. Overwrites any fields that already exist in the destination. For convenience, also returns the destination object.",
  parameters: [{
    name: "dest",
    type: "Object",
    description: "The object to which to copy fields."
  }, {
    name: "source",
    type: "Object",
    description: "The object from which to copy fields."
  }, {
    name: "shallow",
    type: "Boolean",
    optional: true,
    default: "false",
    description: "Pass true to avoid recursing through object and only perform a shallow clone."
  }],
  returns: "Object",
  examples: [{
    name: "Copy an object.",
    description: "Blah blah blah\n\
\n\
    grammar(\"JavaScript\");\n\
    var dest = {\n\
        a: 1,\n\
        b: 2,\n\
        c: {\n\
          d: 3\n\
        }\n\
      },\n\
      src = {\n\
        b: 5,\n\
        c: {\n\
          e: 6\n\
        },\n\
        f: 7\n\
      };\n\
    \n\
    copyObject(dest, src);\n\
    console.assert(dest.a === 1);\n\
    console.assert(dest.b === 5);\n\
    console.assert(dest.c.d === 3);\n\
    console.assert(dest.c.e === 6);\n\
    console.assert(dest.f === 7);"
  }]
});

function copyObject(dest, source, shallow) {
  var stack = [{
    dest: dest,
    source: source
  }];
  while (stack.length > 0) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for (var key in source) {
      if (shallow || typeof (source[key]) !== "object" || source[key] instanceof String) {
        dest[key] = source[key];
      }
      else {
        if (!dest[key]) {
          dest[key] = {};
        }
        stack.push({
          dest: dest[key],
          source: source[key]
        });
      }
    }
  }
  return dest;
}
return copyObject;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.cylinder = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "cylinder",
  description: "Shorthand functino for creating a new THREE.CylinderGeometry object.",
  parameters: [{
    name: "rT",
    type: "Number",
    optional: true,
    description: "The radius at the top of the cylinder.",
    default: 0.5
  }, {
    name: "rB",
    type: "Number",
    optional: true,
    description: "The radius at the bottom of the cylinder.",
    default: 0.5
  }, {
    name: "height",
    type: "Number",
    optional: true,
    description: "The height of the cylinder.",
    default: 1
  }, {
    name: "rS",
    type: "Number",
    optional: true,
    description: "The number of sides on the cylinder.",
    default: 8
  }, {
    name: "hS",
    type: "Number",
    optional: true,
    description: "The number of slices along the height of the cylinder.",
    default: 1
  }, {
    name: "openEnded",
    type: "Boolean",
    optional: true,
    description: "Whether or not to leave the end of the cylinder open, thereby making a pipe.",
    default: false
  }, {
    name: "thetaStart",
    type: "Number",
    optional: true,
    description: "The angle at which to start sweeping the cylinder.",
    default: 0
  }, {
    name: "thetaEnd",
    type: "Number",
    optional: true,
    description: "The angle at which to end sweeping the cylinder.",
    default: 2 * Math.PI
  }, ],
  returns: "THREE.CylinderGeometry",
  examples: [{
    name: "Basic usage",
    description: "Three.js separates geometry from materials, so you can create shared materials and geometry that recombine in different ways. To create a simple cylinder geometry object that you can then add a material to create a mesh: \n\
  \n\
    grammar(\"JavaScript\");\n\
    var geom = cylinder(),\n\
      mesh = textured(geom, 0xff0000);\n\
    put(mesh)\n\
      .on(scene)\n\
      .at(-2, 1, -5);\n\
\n\
It should look something like this:\n\
<img src=\"images/cylinder.jpg\">"
  }]
});

function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  if (rT === undefined) {
    rT = 0.5;
  }
  if (rB === undefined) {
    rB = 0.5;
  }
  if (height === undefined) {
    height = 1;
  }
  return cache(
    `CylinderGeometry(${rT}, ${rB}, ${height}, ${rS}, ${hS}, ${openEnded}, ${thetaStart}, ${thetaEnd})`,
    () => new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd));
}
return cylinder;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.deleteSetting = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "deleteSetting",
  parameters: [{
    name: " name",
    type: "string",
    description: "The name of the setting to delete."
  }],
  description: "Removes an object from localStorage",
  examples: [{
    name: "Basic usage",
    description: "\
\n\
    grammar(\"JavaScript\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");\n\
    setSetting(\"A\", \"modified-A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"modified-A\");\n\
    deleteSetting(\"A\");\n\
    console.assert(getSetting(\"A\", \"default-A\") === \"default-A\");"
  }]
});

function deleteSetting(name) {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  }
}
return deleteSetting;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.emit = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "emit",
  description: "A shorthand function for triggering events. Can be `.call()`ed on objects that have a `listeners` property.",
  parameters: [{
    name: "evt",
    type: "String",
    description: "The name of the event to trigger."
  }, {
    name: "args",
    type: "Array",
    optional: true,
    description: "Arguments to pass to the event."
  }],
  examples: [{
    name: "Basic usage",
    description: "    grammar(\"JavaScript\");\n\
    function MyClass(){\n\
      this.listeners = {\n\
        myevent: []\n\
      };\n\
    }\n\
    \n\
    MyClass.prototype.addEventListener = function(evt, thunk){\n\
      this.listeners[evt].push(thunk);\n\
    };\n\
    \n\
    MyClass.prototype.execute = function(){\n\
      emit.call(this, \"myevent\", { a: 1, b: 2});\n\
    };\n\
    \n\
    var obj = new MyClass();\n\
    obj.addEventListener(\"myevent\", function(evt){\n\
      console.assert(evt.a === 1);\n\
      console.assert(evt.b === 2);\n\
    });\n\
    obj.execute();"
  }]
});

function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}
return emit;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.findProperty = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "findProperty",
  description: "Searches an object for a property that might go by different names in different browsers.",
  parameters: [{
    name: "elem",
    type: "Object",
    description: "The object to search."
  }, {
    name: "arr",
    type: "Array",
    description: "An array of strings that lists the possible values for the property name."
  }, ],
  returns: "String",
  examples: [{
    name: "Find the right name of the fullScree element.",
    description: "    grammar(\"JavaScript\");\n\
    var elementName = findProperty(document, [\"fullscreenElement\", \"mozFullScreenElement\", \"webkitFullscreenElement\", \"msFullscreenElement\"]);\n\
    console.assert(!isFirefox || elementName === \"mozFullScreenElement\");\n\
    console.assert(!isChrome || elementName === \"webkitFullscreenElement\");\n\
    console.assert(!isIE || elementName === \"msFullscreenElement\");"
  }]
});

function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (elem[arr[i]] !== undefined) {
      return arr[i];
    }
  }
}
return findProperty;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.getSetting = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "getSetting",
  parameters: [{
    name: " name",
    type: "string",
    description: "The name of the setting to read."
  }, {
    name: "defValue",
    type: "Object",
    description: "The default value to return, if the setting is not present in `localStorage`."
  }],
  returns: "The Object stored in `localStorage` for the given name, or the default value provided if the setting doesn't exist in `localStorage`.",
  description: "Retrieves named values out of `localStorage`. The values should\n\
be valid for passing to `JSON.parse()`. A default value can be specified in the\n\
function call that should be returned if the value does not exist, or causes an\n\
error in parsing. Typically, you'd call this function at page-load time after having\n\
called the [`setSetting()`](#setSetting) function during a previous page session.",
  examples: [{
    name: "Basic usage",
    description: "Assuming a text input element with the id `text1`, the following\n\
code should persist between reloads whatever the user writes in the text area:\n\
\n\
    grammar(\"JavaScript\");\n\
    var text1 = document.getElementById(\"text1\");\n\
    document.addEventListener(\"unload\", function(){\n\
      setSetting(\"text1-value\", text1.value);\n\
    }, false);\n\
    document.addEventListener(\"load\", function(){\n\
      text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
    }, false);"
  }]
});

function getSetting(name, defValue) {
  if (window.localStorage) {
    var val = window.localStorage.getItem(name);
    if (val) {
      try {
        return JSON.parse(val);
      }
      catch (exp) {
        console.error("getSetting", name, val, typeof (val), exp);
        console.error(exp);
        console.error("getSetting", name, val, typeof (val));
      }
    }
  }
  return defValue;
}
return getSetting;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.hub = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "hub",
  description: "Calling `hub()` is a short-hand for creating a new `THREE.Object3D`. This is useful in live-coding examples to keep code terse and easy to write. It also polyfills in a method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the hub using `appendChild()` such that they may be pickable in the scene.",
  examples: [{
    name: "Basic usage",
    description: "\n\
    //these two lines of code perform the same task.\n\
    var base1 = new THREE.Object3D();\n\
    var base2 = hub();"
  }]
});

function hub() {
  return new THREE.Object3D();
}
return hub;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.identity = factory();
  }
}(this, function() {
"use strict";

function identity(obj){
  return obj;
}
return identity;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isChrome = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isChrome",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
});
const isChrome = !!window.chrome && !window.isOpera;
return isChrome;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isFirefox = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isFirefox",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
});
const isFirefox = typeof window.InstallTrigger !== 'undefined';
return isFirefox;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isGearVR = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isGearVR",
  type: "Boolean",
  description: "Flag indicating the application is running on the Samsung Gear VR in the Samsung Internet app."
});
const isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;
return isGearVR;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isIE = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isIE",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
});
const isIE = /*@cc_on!@*/ false || !!document.documentMode;
return isIE;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isInIFrame = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isHomeScreen",
  type: "Boolean",
  description: "Flag indicating the script is currently running in an IFRAME or not."
});
const isInIFrame = (window.self !== window.top);
return isInIFrame;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isMobile = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isMobile",
  type: "Boolean",
  description: "Flag indicating the current system is a recognized \"mobile\"\n\
device, usually possessing a motion sensor."
});
const isMobile = (function (a) {
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      a) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substring(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);
return isMobile;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isOSX = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isOSX",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
});
const isOSX = /Macintosh/.test(navigator.userAgent || "");
return isOSX;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isOpera = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isOpera",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
});
const isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
return isOpera;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isSafari = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isSafari",
  type: "Boolean",
  description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
});
const isSafari = Object.prototype.toString.call(window.HTMLElement)
  .indexOf('Constructor') > 0;
return isSafari;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isWebKit = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isWebKit",
  type: "Boolean",
  description: "Flag indicating the browser is one of Chrome, Safari, or Opera.\n\
WebKit browsers have certain issues in common that can be treated together, like\n\
a common basis for orientation events."
});
const isWebKit = !(/iP(hone|od|ad)/.test(navigator.userAgent || "")) || isOpera || isChrome;
return isWebKit;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isWindows = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isWindows",
  type: "Boolean",
  description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
});
const isWindows = /Windows/.test(navigator.userAgent || "");
return isWindows;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.isiOS = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "isiOS",
  type: "Boolean",
  description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards."
});
const isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");
return isiOS;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.light = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "light",
  description: "Shortcut function for creating a new THREE.PointLight object.",
  parameters: [{
    name: "color",
    type: "Number",
    optional: true,
    description: "The RGB color value for the light.",
    default: "0xffffff"
  }, {
    name: "intensity",
    type: "Number",
    optional: true,
    description: "The strength of the light.",
    default: 1
  }, {
    name: "distance",
    type: "Number",
    optional: true,
    description: "The distance the light will shine.",
    default: 0
  }, {
    name: "decay",
    type: "Number",
    optional: true,
    description: "How much the light dims over distance.",
    default: 1
  }, ],
  returns: "THREE.PointLight",
  examples: [{
    name: "Basic usage",
    description: "    grammar(\"JavaScript\");\n\
    put(light(0xffff00)).on(scene).at(0, 100, 0);"
  }]
});

function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}
return light;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.patch = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "patch",
  parameters: [{
    name: "obj1",
    type: "Object",
    description: "The object to which to copy values that don't yet exist in the object."
  }, {
    name: "obj2",
    type: "Object",
    description: "The object from which to copy values to obj1, if obj1 does not already have a value in place."
  }],
  returns: "Object - the obj1 parameter, with the values copied from obj2",
  description: "Copies values into Object A from Object B, skipping any value names that already exist in Object A.",
  examples: [{
    name: "Set default values.",
    description: "The `patch` function is intended to copy default values onto a user-supplied 'options' object, without clobbering the values they have provided.\n\
    var obj1 = {\n\
      a: 1,\n\
      b: 2,\n\
      c: 3\n\
    },\n\
      obj2 = {\n\
      c: 4,\n\
      d: 5,\n\
      e: 6\n\
    },\n\
      obj3 = patch(obj1, obj2);\n\
    console.assert(obj1 === obj3); // the returned object is exactly the same object as the first parameter.\n\
    console.assert(obj3.a === 1); // the `a` property did not exist in obj2\n\
    console.assert(obj3.b === 2); // the `b` property did not exist in obj2\n\
    console.assert(obj3.c === 3); // the `c` property existed in obj2, but it already existed in obj1, so it doesn't get overwritten\n\
    console.assert(obj3.d === 5); // the `d` property did not exist in obj1\n\
    console.assert(obj3.e === 6); // the `e` property did not exist in obj1"
  }]
});

function patch(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    if (obj1[k] === undefined || obj1[k] === null) {
      obj1[k] = obj2[k];
    }
  }
  return obj1;
}
return patch;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.put = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "put",
  description: "A literate interface for putting objects onto scenes with basic, common transformations. You call `put()` with an object, then have access to a series of methods that you can chain together, before receiving the object back again. This makes it possible to create objects in the parameter position of `put()` at the same time as declaring the variable that will hold it.\n\
\n\
* .on(scene) - the Primrose.Entity or THREE.Object3D on which to append the element.\n\
* .at(x, y, z) - set the translation for the object.\n\
* .rot(x, y, z) - set the rotation for the object.\n\
* .scale(x, y, z) - set the scale for the object.\n\
* .obj() - return the naked object, if not all of the transformations are desired.",
  parameters: [{
    name: "object",
    type: "Object",
    description: "The object to manipulate."
  }],
  returns: "Object",
  examples: [{
    name: "Put an object on a scene at a specific location.",
    description: "    grammar(\"JavaScript\");\n\
    var myCylinder = put(textured(cylinder(), 0x00ff00))\n\
      .on(scene)\n\
      .at(1, 2, 3)\n\
      .obj();"
  }]
});

function put(object) {
  var box = {
      on: null,
      at: null,
      rot: null,
      scale: null,
      obj: () => object
    },
    on = function (scene) {
      if (scene.appendChild) {
        scene.appendChild(object);
      }
      else {
        scene.add(object);
      }
      box.on = null;
      if (box.at || box.rot || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    at = function (x, y, z) {
      object.position.set(x, y, z);
      box.at = null;
      if (box.on || box.rot || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    rot = function (x, y, z) {
      object.rotation.set(x, y, z);
      box.rot = null;
      if (box.on || box.at || box.scale) {
        return box;
      }
      else {
        return object;
      }
    },
    scale = function (x, y, z) {
      object.scale.set(x, y, z);
      box.scale = null;
      if (box.on || box.at || box.rot) {
        return box;
      }
      else {
        return object;
      }
    };

  box.on = on;
  box.at = at;
  box.rot = rot;
  box.scale = scale;

  return box;
}
return put;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.quad = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "quad",
  description: "| [under construction]"
});

function quad(w, h, s, t) {
  if (h === undefined) {
    h = w;
  }
  return cache(
    `PlaneBufferGeometry(${w}, ${h}, ${s}, ${t})`,
    () => new THREE.PlaneBufferGeometry(w, h, s, t));
}
return quad;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.range = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "range",
  description: "| [under construction]"
});

function range(n, m, s, t) {
  var n2 = s && n || 0,
    m2 = s && m || n,
    s2 = t && s || 1,
    t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}
return range;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.readForm = factory();
  }
}(this, function() {
"use strict";


pliny.function({
  name: "readForm",
  parameters: [{
    name: "ctrls",
    type: "Hash of Elements",
    description: "An array of HTML form elements, aka INPUT, TEXTAREA, SELECT, etc."
  }],
  returns: "Object",
  description: "Scans through an array of input elements and builds a state object that contains the values the input elements represent. Elements that do not have an ID attribute set, or have an attribute `data-skipcache` set, will not be included.",
  examples: [{
    name: "Basic usage",
    description: "Assuming the following HTML form:\n\
\n\
    grammar(\"HTML\");\n\
    <form>\n\
      <input type=\"text\" id=\"txt\" value=\"hello\">\n\
      <input type=\"number\" id=\"num\" value=\"5\">\n\
    </form>\n\
\n\
##Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = findEverything();\n\
    ctrls.txt.value = \"world\";\n\
    ctrls.num.value = \"6\"6;\n\
    var state = readForm(ctrls);\n\
    console.assert(state.txt === \"world\");\n\
    console.assert(state.num === \"6\");\n\
    state.txt = \"mars\";\n\
    state.num = 55;\n\
    writeForm(ctrls, state);\n\
    console.assert(ctrls.txt.value === \"mars\");\n\
    console.assert(ctrls.num.value === \"55\");"
  }]
});

function readForm(ctrls) {
  var state = {};
  if (ctrls) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if ((c.tagName === "INPUT" || c.tagName === "SELECT") &&
        (!c.dataset || !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          state[name] = c.value;
        }
        else if (c.type === "checkbox" || c.type === "radio") {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}
return readForm;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.setFalse = factory();
  }
}(this, function() {
"use strict";

function setFalse(evt){
  evt.returnValue = false;
}
return setFalse;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.setSetting = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "setSetting",
  parameters: [{
    name: " name",
    type: "string",
    description: "The name of the setting to set."
  }, {
    name: "val",
    type: "Object",
    description: "The value to write. It should be useable as a parameter to `JSON.stringify()`."
  }],
  description: "Writes named values to `localStorage`. The values should be valid\n\
for passing to `JSON.stringify()`. Typically, you'd call this function at page-unload\n\
time, then call the [`getSetting()`](#getSetting) function during a subsequent page load.",
  examples: [{
    name: "Basic usage",
    description: "Assuming a text input element with the id `text1`, the following\n\
code should persist between reloads whatever the user writes in the text area:\n\
\n\
    grammar(\"JavaScript\");\n\
    var text1 = document.getElementById(\"text1\");\n\
    document.addEventListener(\"unload\", function(){\n\
      setSetting(\"text1-value\", text1.value);\n\
    }, false);\n\
    document.addEventListener(\"load\", function(){\n\
      text1.value = getSetting(\"text1-value\", \"My default value!\");\n\
    }, false);"
  }]
});

function setSetting(name, val) {
  if (window.localStorage && val) {
    try {
      window.localStorage.setItem(name, JSON.stringify(val));
    }
    catch (exp) {
      console.error("setSetting", name, val, typeof (val), exp);
    }
  }
}
return setSetting;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.shell = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "shell",
  parameters: [{
    name: "radius",
    type: "Number",
    description: "How far the sphere should extend away from a center point."
  }, {
    name: "widthSegments",
    type: "Number",
    description: "The number of faces wide in which to slice the geometry."
  }, {
    name: "heightSegments",
    type: "Number",
    description: "The number of faces tall in which to slice the geometry."
  }, {
    name: "phi",
    type: "Number",
    optional: true,
    description: "The angle in radians around the Y-axis of the sphere.",
    default: "80 degrees."
  }, {
    name: "thetaStart",
    type: "Number",
    optional: true,
    description: "The angle in radians around the Z-axis of the sphere.",
    default: "48 degrees."
  }],
  description: "The shell is basically an inside-out sphere. Say you want a to model\n\
the sky as a sphere, or the inside of a helmet. You don't care anything about the\n\
outside of this sphere, only the inside. You would use InsideSphereGeometry in this\n\
case. It is mostly an alias for [`InsideSphereGeometry`](#InsideSphereGeometry).",
  examples: [{
    name: "Create a sky sphere",
    description: "To create a sphere that hovers around the user at a\n\
far distance, showing a sky of some kind, you can use the `shell()` function in\n\
combination with the [`textured()`](#textured) function. Assuming you have an image\n\
file to use as the texture, execute code as such:\n\
\n\
    grammar(\"JavaScript\");\n\
    var sky = textured(\n\
      shell(\n\
          // The radius value should be less than your draw distance.\n\
          1000,\n\
          // The number of slices defines how smooth the sphere will be in the\n\
          // horizontal direction. Think of it like lines of longitude.\n\
          18,\n\
          // The number of rings defines how smooth the sphere will be in the\n\
          // vertical direction. Think of it like lines of latitude.\n\
          9,\n\
          // The phi angle is the number or radians around the 'belt' of the sphere\n\
          // to sweep out the geometry. To make a full circle, you'll need 2 * PI\n\
          // radians.\n\
          Math.PI * 2,\n\
          // The theta angle is the number of radians above and below the 'belt'\n\
          // of the sphere to sweep out the geometry. Since the belt sweeps a full\n\
          // 360 degrees, theta only needs to sweep a half circle, or PI radians.\n\
          Math.PI ),\n\
      // Specify the texture image next.\n\
      \"skyTexture.jpg\",\n\
      // Specify that the material should be shadeless, i.e. no shadows. This\n\
      // works best for skymaps.\n\
      {unshaded: true} );"
  }]
});

function shell(r, slices, rings, phi, theta) {
  var SLICE = 0.45;
  if (phi === undefined) {
    phi = Math.PI * SLICE;
  }
  if (theta === undefined) {
    theta = Math.PI * SLICE * 0.6;
  }
  var phiStart = 1.5 * Math.PI - phi * 0.5,
    thetaStart = (Math.PI - theta) * 0.5;
  return cache(
    `InsideSphereGeometry(${r}, ${slices}, ${rings}, ${phi}, ${theta})`,
    () => new InsideSphereGeometry(r, slices, rings, phiStart, phi, thetaStart, theta, true));
}
return shell;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.sphere = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "sphere",
  description: "| [under construction]"
});

function sphere(r, slices, rings) {
  return cache(
    `SphereGeometry(${r}, ${slices}, ${rings})`,
    () => new THREE.SphereGeometry(r, slices, rings));
}
return sphere;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.textured = factory();
  }
}(this, function() {
"use strict";

var textureLoader = null,
  textureCache = {};

Primrose.loadTexture = function (url) {
  if (!textureLoader) {
    textureLoader = new THREE.TextureLoader();
  }
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache(
    `Image(${url})`,
    () => new Promise((resolve, reject) => textureLoader.load(url, resolve, null, reject)));
};

pliny.function({
  name: "textured",
  description: "| [under construction]"
});
function textured(geometry, txt, options) {
  options = options || {};
  if (options.opacity === undefined) {
    options.opacity = 1;
  }
  if (options.txtRepeatS === undefined) {
    options.txtRepeatS = 1;
  }
  if (options.txtRepeatT === undefined) {
    options.txtRepeatT = 1;
  }
  if (options.roughness === undefined) {
    options.roughness = 0.5;
  }
  if (options.metalness === undefined) {
    options.metalness = 0;
  }

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;

  var material = null;
  if (txt instanceof THREE.Material) {
    material = txt;
    txt = null;
  }
  else {
    var txtID = (txt.id || txt)
      .toString(),
      textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatS}, ${options.txtRepeatT})`,
      materialDescription = `Primrose.material(${textureDescription}, ${options.unshaded}, ${options.opacity}, ${options.roughness}, ${options.metalness}, ${options.wireframe}, ${options.emissive})`;
    material = cache(materialDescription, () => {
      var materialOptions = {
          transparent: options.opacity < 1,
          opacity: options.opacity,
          side: options.side || THREE.FrontSide
        },
        MaterialType = THREE.MeshStandardMaterial;

      if (options.unshaded) {
        materialOptions.shading = THREE.FlatShading;
        MaterialType = THREE.MeshBasicMaterial;
      }
      else {
        materialOptions.roughness = options.roughness;
        materialOptions.metalness = options.metalness;

        if (options.emissive !== undefined) {
          materialOptions.emissive = options.emissive;
        }
      }
      return new MaterialType(materialOptions);
    });
  }

  material.wireframe = options.wireframe;

  var obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new THREE.Mesh(geometry, material);
  }
  else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = material;
  }

  if (typeof txt === "number" || txt instanceof Number) {
    material.color.set(txt);
  }
  else if (txt) {
    material.color.set(0xffffff);

    var setTexture = function (texture) {
      var surface;
      if (texture instanceof Primrose.Surface) {
        surface = texture;
        texture = surface.texture;
        if (!options.scaleTextureWidth || !options.scaleTextureHeight) {
          var imgWidth = surface.imageWidth,
            imgHeight = surface.imageHeight,
            dimX = Math.ceil(Math.log(imgWidth) / Math.LN2),
            dimY = Math.ceil(Math.log(imgHeight) / Math.LN2),
            newWidth = Math.pow(2, dimX),
            newHeight = Math.pow(2, dimY),
            scaleX = imgWidth / newWidth,
            scaleY = imgHeight / newHeight;

          if (scaleX !== 1 || scaleY !== 1) {
            if (scaleX !== 1) {
              options.scaleTextureWidth = scaleX;
            }

            if (scaleY !== 1) {
              options.scaleTextureHeight = scaleY;
            }

            surface.bounds.width = newWidth;
            surface.bounds.height = newHeight;
            surface.resize();
            surface.render(true);
          }
        }
      }


      if (options.txtRepeatS * options.txtRepeatT > 1) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(options.txtRepeatS, options.txtRepeatT);
      }

      if ((options.scaleTextureWidth || options.scaleTextureHeight)) {
        if (geometry.attributes && geometry.attributes.uv && geometry.attributes.uv.array) {
          var uv = geometry.attributes.uv,
            arr = uv.array,
            i;
          if (options.scaleTextureWidth) {
            for (i = 0; i < arr.length; i += uv.itemSize) {
              arr[i] *= options.scaleTextureWidth;
            }
          }
          if (options.scaleTextureHeight) {
            for (i = 1; i < arr.length; i += uv.itemSize) {
              arr[i] = 1 - (1 - arr[i]) * options.scaleTextureHeight;
            }
          }
        }
        else {
          console.trace(geometry);
        }
      }

      textureCache[textureDescription] = texture;
      material.map = texture;
      material.needsUpdate = true;
      texture.needsUpdate = true;
    };


    if (textureCache[textureDescription]) {
      setTexture(textureCache[textureDescription]);
    }
    else if (txt instanceof Primrose.Surface) {
      txt._material = material;
      Primrose.Entity.registerEntity(txt);
      setTexture(txt);
      obj.surface = txt;
    }
    else if (typeof txt === "string") {
      Primrose.loadTexture(txt)
        .then(setTexture)
        .catch(console.error.bind(console, "Error loading texture", txt));
    }
    else if (txt instanceof Primrose.Text.Controls.TextBox) {
      setTexture(txt.renderer.texture);
    }
    else if (txt instanceof HTMLCanvasElement) {
      setTexture(new THREE.Texture(txt));
    }
    else {
      setTexture(txt);
    }
  }

  return obj;
}
return textured;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.v3 = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "v3",
  description: "A shortcut function for creating a new THREE.Vector3 object.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X component of the vector"
  }, {
    name: "y",
    type: "Number",
    description: "The Y component of the vector"
  }, {
    name: "z",
    type: "Number",
    description: "The Z component of the vector"
  }],
  returns: "THREE.Vector3",
  examples: [{
    name: "Create a vector",
    description: "    grammar(\"JavaScript\");\n\
    var a = v3(1, 2, 3);\n\
    console.assert(a.x === 1);\n\
    console.assert(a.y === 2);\n\
    console.assert(a.z === 3);\n\
    console.assert(a.toArray().join(\", \") === \"1, 2, 3\");"
  }]
});

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
return v3;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.writeForm = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  name: "writeForm",
  parameters: [{
    name: "ctrls",
    type: "Hash of Elements",
    description: "A hash-collection of HTML input elements that will have their values set."
  }, {
    name: "state",
    type: "Hash object",
    description: "The values that will be set on the form. Hash keys should match IDs of the elements in the `ctrls` parameter."
  }],
  description: "Writes out a full set of state values to an HTML input form, wherever keys in the `ctrls` parameter match keys in the `state` parameter.",
  examples: [{
    name: "Basic usage",
    description: "Assuming the following HTML form:\n\
\n\
    grammar(\"HTML\");\n\
    <form>\n\
      <input type=\"text\" id=\"txt\" value=\"hello\">\n\
      <input type=\"number\" id=\"num\" value=\"5\">\n\
    </form>\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    var ctrls = findEverything();\n\
    ctrls.txt.value = \"world\";\n\
    ctrls.num.value = \"6\"6;\n\
    var state = readForm(ctrls);\n\
    console.assert(state.txt === \"world\");\n\
    console.assert(state.num === \"6\");\n\
    state.txt = \"mars\";\n\
    state.num = 55;\n\
    writeForm(ctrls, state);\n\
    console.assert(ctrls.txt.value === \"mars\");\n\
    console.assert(ctrls.num.value === \"55\");"
  }]
});

function writeForm(ctrls, state) {
  if (state) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if (state[name] !== null && state[name] !== undefined &&
        (c.tagName ===
          "INPUT" || c.tagName === "SELECT") && (!c.dataset ||
          !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          c.value = state[name];
        }
        else if (c.type === "checkbox" || c.type === "radio") {
          c.checked = state[name];
        }
      }
    }
  }
}
return writeForm;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.AbstractEventEmitter = factory();
  }
}(this, function() {
"use strict";

class AbstractEventEmitter {
  constructor() {
    this._handlers = {};
  }

  addEventListener(name, thunk) {
    if (!this._handlers[name]) {
      this._handlers[name] = [];
    }
    this._handlers[name].push(thunk);
  }

  removeEventListener(name, thunk) {
    if (this._handlers[name]) {
      var idx = this._handlers[name].indexOf(thunk);
      if (idx > -1) {
        this._handlers[name].splice(idx, 1);
      }
    }
  }

  emit(name, obj) {
    if (this._handlers[name]) {
      for (var i = 0; i < this._handlers[name].length; ++i) {
        this._handlers[name][i](obj);
      }
    }
  }
}
return AbstractEventEmitter;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Angle = factory();
  }
}(this, function() {
"use strict";

var DEG2RAD = Math.PI / 180,
  RAD2DEG = 180 / Math.PI;
pliny.class({
  parent: "Primrose",
    name: "Angle",
    description: "The Angle class smooths out the jump from 360 to 0 degrees. It\n\
keeps track of the previous state of angle values and keeps the change between\n\
angle values to a maximum magnitude of 180 degrees, plus or minus. This allows for\n\
smoother opperation as rotating past 360 degrees will not reset to 0, but continue\n\
to 361 degrees and beyond, while rotating behind 0 degrees will not reset to 360\n\
but continue to -1 and below.\n\
\n\
When instantiating, choose a value that is as close as you can guess will be your\n\
initial sensor readings.\n\
\n\
This is particularly important for the 180 degrees, +- 10 degrees or so. If you\n\
expect values to run back and forth over 180 degrees, then initialAngleInDegrees\n\
should be set to 180. Otherwise, if your initial value is anything slightly larger\n\
than 180, the correction will rotate the angle into negative degrees, e.g.:\n\
* initialAngleInDegrees = 0\n\
* first reading = 185\n\
* updated degrees value = -175\n\
\n\
It also automatically performs degree-to-radian and radian-to-degree conversions.\n\
For more information, see [Radian - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Radian).\n\
\n\
![Radians](https://upload.wikimedia.org/wikipedia/commons/4/4e/Circle_radians.gif)",
    parameters: [{
      name: "initialAngleInDegrees",
      type: "Number",
      description: "(Required) Specifies the initial context of the angle. Zero is not always the correct value."
    }],
    examples: [{
      name: "Basic usage",
      description: "To use the Angle class, create an instance of it with `new`, and modify the `degrees` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Primrose.Angle(356);\n\
  a.degrees += 5;\n\
  console.log(a.degrees);\n\
\n\
## Results:\n\
> 361"
    }, {
      name: "Convert degrees to radians",
      description: "Create an instance of Primrose.Angle, modify the `degrees` property, and read the `radians` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Primrose.Angle(10);\n\
  a.degrees += 355;\n\
  console.log(a.radians);\n\
\n\
## Results:\n\
> 0.08726646259971647"
    }, {
      name: "Convert radians to degress",
      description: "Create an instance of Primrose.Angle, modify the `radians` property, and read the `degrees` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Primrose.Angle(0);\n\
  a.radians += Math.PI / 2;\n\
  console.log(a.degrees);\n\
\n\
## Results:\n\
> 90"
    }]
});

function Angle(v) {
  if (typeof (v) !== "number") {
    throw new Error("Angle must be initialized with a number. Initial value was: " + v);
  }

  var value = v,
    delta = 0,
    d1,
    d2,
    d3;
  pliny.property({
    parent: "Primrose.Angle",
    name: "degrees",
    type: "Number",
    description: "Get/set the current value of the angle in degrees."
  });
  Object.defineProperty(this, "degrees", {
    set: function (newValue) {
      do {
        // figure out if it is adding the raw value, or whole
        // rotations of the value, that results in a smaller
        // magnitude of change.
        d1 = newValue + delta - value;
        d2 = Math.abs(d1 + 360);
        d3 = Math.abs(d1 - 360);
        d1 = Math.abs(d1);
        if (d2 < d1 && d2 < d3) {
          delta += 360;
        }
        else if (d3 < d1) {
          delta -= 360;
        }
      } while (d1 > d2 || d1 > d3);
      value = newValue + delta;
    },
    get: function () {
      return value;
    }
  });
}

pliny.property({
  parent: "Primrose.Angle",
  name: "radians",
  type: "Number",
  description: "Get/set the current value of the angle in radians."
});
Object.defineProperty(Angle.prototype, "radians", {
  get: function () {
    return this.degrees * DEG2RAD;
  },
  set: function (val) {
    this.degrees = val * RAD2DEG;
  }
});
return Angle;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.BaseControl = factory();
  }
}(this, function() {
"use strict";

var ID = 1,
  NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
  DELIM = "\\s*,\\s*",
  UNITS = "(?:em|px)",
  TRANSLATE_PATTERN = new RegExp("translate3d\\s*\\(\\s*" +
    NUMBER_PATTERN + UNITS + DELIM +
    NUMBER_PATTERN + UNITS + DELIM +
    NUMBER_PATTERN + UNITS + "\\s*\\)", "i"),
  ROTATE_PATTERN = new RegExp("rotate3d\\s*\\(\\s*" +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + DELIM +
    NUMBER_PATTERN + "rad\\s*\\)", "i");

pliny.class({
  parent: "Primrose",
    name: "BaseControl",
    description: "The BaseControl class is the parent class for all 3D controls.\n\
It manages a unique ID for every new control, the focus state of the control, and\n\
performs basic conversions from DOM elements to the internal Control format."
});

pliny.method({
  parent: "Primrose.BaseControl",
  name: "focus",
  description: "Sets the focus property of the control, does not change the focus property of any other control.",
  examples: [{
    name: "Focus on one control, blur all the rest",
    description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
    new Primrose.Text.Controls.TextBox(),\n\
    new Primrose.Text.Controls.TextBox(),\n\
    new Primrose.Text.Button()\n\
  ];\n\
\n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
  }]
});

pliny.method({
  parent: "Primrose.BaseControl",
  name: "blur",
  description: "Unsets the focus property of the control, does not change the focus property of any other control.",
  examples: [{
    name: "Focus on one control, blur all the rest",
    description: "When we have a list of controls and we are trying to track\n\
focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
    new Primrose.Text.Controls.TextBox(),\n\
    new Primrose.Text.Controls.TextBox(),\n\
    new Primrose.Text.Button()\n\
  ];\n\
  \n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
  }]
});

pliny.method({
  parent: "Primrose.BaseControl",
  name: "copyElement",
  description: "Copies properties from a DOM element that the control is supposed to match.",
  parameters: [{
    name: "elem",
    type: "Element",
    description: "The element--e.g. a button or textarea--to copy."
  }],
  examples: [{
    name: "Rough concept",
    description: "The class is not used directly. Its methods would be used in a base\n\
class that implements its functionality.\n\
\n\
The `copyElement()` method gets used when a DOM element is getting \"converted\"\n\
to a 3D element on-the-fly.\n\
\n\
  grammar(\"JavaScript\");\n\
  var myDOMButton = document.querySelector(\"button[type='button']\"),\n\
    my3DButton = new Primrose.Controls.Button3D();\n\
  my3DButton.copyElement(myDOMButton);"
  }]
});

class BaseControl extends Primrose.AbstractEventEmitter {
  constructor() {
    super();

    pliny.property({
      name: "controlID",
      type: "Number",
      description: "Automatically incrementing counter for controls, to make sure there is a distinct differentiator between them all."
    });
    this.controlID = ID++;

    pliny.property({
      name: "focused",
      type: "Boolean",
      description: "Flag indicating this control has received focus. You should theoretically only read it."
    });
    this.focused = false;
  }

  focus() {
    this.focused = true;
    this.emit("focus", {
      target: this
    });
  }

  blur() {
    this.focused = false;
    emit.call(this, "blur", {
      target: this
    });
  }

  copyElement(elem) {
    this.element = elem;
    if (elem.style.transform) {
      var match = TRANSLATE_PATTERN.exec(elem.style.transform);
      if (match) {
        this.position.set(
          parseFloat(match[1]),
          parseFloat(match[2]),
          parseFloat(match[3]));
      }
      match = ROTATE_PATTERN.exec(elem.style.transform);
      if (match) {
        this.quaternion.setFromAxisAngle(
          new THREE.Vector3()
          .set(
            parseFloat(match[1]),
            parseFloat(match[2]),
            parseFloat(match[3])),
          parseFloat(match[4]));
      }
    }
  }
}
return BaseControl;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.BrowserEnvironment = factory();
  }
}(this, function() {
"use strict";

if (typeof THREE === "undefined") {
  return function () {};
}

var MILLISECONDS_TO_SECONDS = 0.001;

pliny.class({
  parent: "Primrose",
    name: "BrowserEnvironment",
    description: "Make a Virtual Reality app in your web browser!"
});
class BrowserEnvironment extends Primrose.AbstractEventEmitter {
  constructor(options) {
    super();
    this.options = patch(options, BrowserEnvironment.DEFAULTS);
    this.options.foregroundColor = this.options.foregroundColor || complementColor(new THREE.Color(this.options.backgroundColor))
      .getHex();

    this.zero = () => {
      if (!this.input.lockMovement) {
        this.input.zero();
        if (this.quality === Quality.NONE) {
          this.quality = Quality.HIGH;
        }
      }
    };


    var createPickableObject = (obj, includeGeometry) => {
      var geomObj = obj;
      if ((obj.type === "Object3D" || obj.type === "Group") && obj.children[0]) {
        geomObj = obj.children[0];
        geomObj.name = geomObj.name || obj.name;
      }
      var id = geomObj.uuid,
        mLeft = new THREE.Matrix4(),
        mRight = new THREE.Matrix4()
        .identity(),
        mSwap,
        inScene = false,
        lastBag = objectHistory[id],
        update = false,
        disabled = !!obj.disabled,
        bag = {
          uuid: id,
          name: null,
          inScene: null,
          visible: null,
          disabled: null,
          matrix: null,
          geometry: null
        },
        head = geomObj;

      while (head !== null) {
        head.updateMatrix();
        mLeft.copy(head.matrix);
        mLeft.multiply(mRight);
        mSwap = mLeft;
        mLeft = mRight;
        mRight = mSwap;
        head = head.parent;
        inScene = inScene || (head === this.scene);
      }

      if (!lastBag || lastBag.visible !== obj.visible) {
        update = true;
        bag.visible = obj.visible;
      }

      if (!lastBag || lastBag.disabled !== disabled) {
        update = true;
        bag.disabled = disabled;
      }

      var m = mRight.elements.subarray(0, mRight.elements.length),
        mStr = describeMatrix(m);
      if (!lastBag || !lastBag.matrix || describeMatrix(lastBag.matrix) !== mStr) {
        update = true;
        bag.matrix = m;
      }

      if (!lastBag || lastBag.inScene !== inScene) {
        update = true;
        bag.inScene = inScene;
      }

      if (includeGeometry === true) {
        update = true;
        bag.name = obj.name;
        bag.geometry = geomObj.geometry;
      }

      if (update) {
        if (!lastBag) {
          objectHistory[id] = bag;
        }
        else {
          for (var key in bag) {
            lastBag[key] = bag[key];
          }
        }
        return bag;
      }
    };

    function describeMatrix(m) {
      var output = "";
      for (var i = 0; i < m.length; ++i) {
        if (i > 0) {
          output += ",";
        }
        output += m[i];
      }
      return output;
    }


    var objectHistory = {};

    this.registerPickableObject = (obj) => {
      if (obj) {
        var bag = createPickableObject(obj, true),
          verts, faces, uvs, i,
          geometry = bag.geometry;
        // it would be nice to do this the other way around, to have everything
        // stored in ArrayBuffers, instead of regular arrays, to pass to the
        // Worker thread. Maybe later.
        if (geometry instanceof THREE.BufferGeometry) {
          var attr = geometry.attributes,
            pos = attr.position,
            uv = attr.uv,
            idx = attr.index;

          verts = [];
          faces = [];
          if (uv) {
            uvs = [];
          }
          for (i = 0; i < pos.count; ++i) {
            verts.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
            if (uv) {
              uvs.push([uv.getX(i), uv.getY(i)]);
            }
          }
          if (idx) {
            for (i = 0; i < idx.count - 2; ++i) {
              faces.push([idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)]);
            }
          }
          else {
            for (i = 0; i < pos.count; i += 3) {
              faces.push([i, i + 1, i + 2]);
            }
          }
        }
        else {
          verts = geometry.vertices.map((v) => v.toArray());
          faces = [];
          uvs = [];
          // IDK why, but non-buffered geometry has an additional array layer
          for (i = 0; i < geometry.faces.length; ++i) {
            var f = geometry.faces[i],
              faceUVs = geometry.faceVertexUvs[0][i];
            faces.push([f.a, f.b, f.c]);
            uvs[f.a] = [faceUVs[0].x, faceUVs[0].y];
            uvs[f.b] = [faceUVs[1].x, faceUVs[1].y];
            uvs[f.c] = [faceUVs[2].x, faceUVs[2].y];
          }
        }

        bag.geometry = {
          uuid: geometry.uuid,
          vertices: verts,
          faces: faces,
          uvs: uvs
        };

        this.pickableObjects[bag.uuid] = obj;
        this.projector.setObject(bag);
      }
    };

    var lastHits = null,
      currentHits = {},
      handleHit = (h) => {
        var dt;
        this.projector.ready = true;
        lastHits = currentHits;
        currentHits = h;
      };

    var update = (t) => {
      var dt = t - lt,
        i, j;
      lt = t;

      movePlayer(dt);
      this.input.resolvePicking(currentHits, lastHits, this.pickableObjects);
      moveSky();
      moveGround();
      this.network.update(dt);
      checkQuality();

      this.emit("update", dt);
    };

    var movePlayer = (dt) => {
      this.input.update(dt);

      if (this.projector.ready) {
        this.projector.ready = false;
        var arr = [],
          del = [];
        for (var key in this.pickableObjects) {
          var obj = this.pickableObjects[key],
            p = createPickableObject(obj);
          if (p) {
            arr.push(p);
            if (p.inScene === false) {
              del.push(key);
            }
          }
        }

        if (arr.length > 0) {
          this.projector.updateObjects(arr);
        }
        for (var i = 0; i < del.length; ++i) {
          delete this.pickableObjects[del[i]];
        }

        this.projector.projectPointers(this.input.segments);
      }
    };

    var moveSky = () => {
      if (this.sky) {
        this.sky.position.copy(this.input.head.position);
      }
    };

    var moveGround = () => {
      if (this.ground) {
        this.ground.position.set(
          Math.floor(this.input.head.position.x), -0.02,
          Math.floor(this.input.head.position.z));
        this.ground.material.needsUpdate = true;
      }
    };

    var animate = (t) => {
      update(t * MILLISECONDS_TO_SECONDS);
      render();
      RAF(animate);
    };

    var render = () => {
      this.camera.position.set(0, 0, 0);
      this.camera.quaternion.set(0, 0, 0, 1);
      this.audio.setPlayer(this.input.head.mesh);
      if (this.input.VR.isPresenting) {
        this.renderer.clear(true, true, true);

        var trans = this.input.VR.getTransforms(
          this.options.nearPlane,
          this.options.nearPlane + this.options.drawDistance);
        for (var i = 0; trans && i < trans.length; ++i) {
          var st = trans[i],
            v = st.viewport,
            side = (2 * i) - 1;
          Primrose.Entity.eyeBlankAll(i);
          this.camera.projectionMatrix.copy(st.projection);
          this.camera.translateOnAxis(st.translation, 1);
          this.renderer.setViewport(
            v.left * resolutionScale,
            v.top * resolutionScale,
            v.width * resolutionScale,
            v.height * resolutionScale);
          this.renderer.render(this.scene, this.camera);
          this.camera.translateOnAxis(st.translation, -1);
        }
        this.input.submitFrame();
      }

      if (!this.input.VR.isPresenting || (this.input.VR.canMirror && !this.options.disableMirroring)) {
        this.camera.fov = this.options.defaultFOV;
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
        this.renderer.clear(true, true, true);
        this.renderer.setViewport(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
        this.renderer.render(this.scene, this.camera);
      }
    };

    var modifyScreen = () => {
      var p = this.input.VR.getTransforms(
        this.options.nearPlane,
        this.options.nearPlane + this.options.drawDistance);

      if (p) {
        var canvasWidth = 0,
          canvasHeight = 0;

        for (var i = 0; i < p.length; ++i) {
          canvasWidth += p[i].viewport.width;
          canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
        }
        canvasWidth = Math.floor(canvasWidth * resolutionScale);
        canvasHeight = Math.floor(canvasHeight * resolutionScale);

        this.renderer.domElement.width = canvasWidth;
        this.renderer.domElement.height = canvasHeight;
        if (!this.timer) {
          render();
        }
      }
    };

    //
    // Initialize local variables
    //

    var lt = 0,
      currentHeading = 0,
      qPitch = new THREE.Quaternion(),
      vEye = new THREE.Vector3(),
      vBody = new THREE.Vector3(),
      modelFiles = {
        scene: this.options.sceneModel,
        avatar: this.options.avatarModel,
        button: this.options.button && typeof this.options.button.model === "string" && this.options.button.model,
        font: this.options.font
      },
      resolutionScale = 1,
      factories = {
        button: Primrose.Controls.Button2D,
        img: Primrose.Controls.Image,
        div: Primrose.Controls.HtmlDoc,
        section: Primrose.Surface,
        textarea: Primrose.Text.Controls.TextBox,
        avatar: null,
        pre: {
          create: () => new Primrose.Text.Controls.TextBox({
            tokenizer: Primrose.Text.Grammars.PlainText,
            hideLineNumbers: true,
            readOnly: true
          })
        }
      };

    this.factories = factories;

    this.createElement = (type) => {
      if (factories[type]) {
        return factories[type].create();
      }
    };

    this.appendChild = (elem) => {
      if (elem instanceof THREE.Mesh) {
        this.scene.add(elem);
        this.registerPickableObject(elem);
      }
      else {
        return elem.addToBrowserEnvironment(this, this.scene);
      }
    };

    function setColor(model, color) {
      return model.children[0].material.color.set(color);
    }

    function complementColor(color) {
      var rgb = color.clone();
      var hsl = rgb.getHSL();
      hsl.h = hsl.h + 0.5;
      hsl.l = 1 - hsl.l;
      while (hsl.h > 1) hsl.h -= 1;
      rgb.setHSL(hsl.h, hsl.s, hsl.l);
      return rgb;
    }

    var modelsReady = Primrose.ModelLoader.loadObjects(modelFiles)
      .then((models) => {
        window.text3D = function (font, size, text) {
          var geom = new THREE.TextGeometry(text, {
            font: font,
            size: size,
            height: size / 5,
            curveSegments: 2
          });
          geom.computeBoundingSphere();
          geom.computeBoundingBox();
          return geom;
        }.bind(window, models.font);

        if (models.scene) {
          buildScene(models.scene);
        }

        if (models.avatar) {
          factories.avatar = new Primrose.ModelLoader(models.avatar);
        }

        if (models.button) {
          this.buttonFactory = new Primrose.ButtonFactory(
            models.button,
            this.options.button.options);
        }
        else {
          this.buttonFactory = new Primrose.ButtonFactory(
            brick(0xff0000, 1, 1, 1), {
              maxThrow: 0.1,
              minDeflection: 10,
              colorUnpressed: 0x7f0000,
              colorPressed: 0x007f00,
              toggle: true
            });
        }
      })
      .catch((err) => {
        console.error(err);
        if (!this.buttonFactory) {
          this.buttonFactory = new Primrose.ButtonFactory(
            brick(0xff0000, 1, 1, 1), {
              maxThrow: 0.1,
              minDeflection: 10,
              colorUnpressed: 0x7f0000,
              colorPressed: 0x007f00,
              toggle: true
            });
        }
      });

    //
    // Initialize public properties
    //
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;

    this.audio = new Primrose.Output.Audio3D();
    var audioReady = null,
      ocean = null;
    if (this.options.ambientSound && !isMobile) {
      audioReady = this.audio.load3DSound(this.options.ambientSound, true, -1, 1, -1)
        .then((aud) => {
          ocean = aud;
          if (!(ocean.source instanceof MediaElementAudioSourceNode)) {
            ocean.volume.gain.value = 0.1;
            console.log(ocean.source);
            ocean.source.start();
          }
        })
        .catch(console.error.bind(console, "Audio3D loadSource"));
    }
    else {
      audioReady = Promise.resolve();
    }

    var documentReady = null;
    if (document.readyState === "complete") {
      documentReady = Promise.resolve("already");
    }
    else {
      documentReady = new Promise((resolve, reject) => {
        document.addEventListener("readystatechange", (evt) => {
          if (document.readyState === "complete") {
            resolve("had to wait for it");
          }
        }, false);
      });
    }

    this.music = new Primrose.Output.Music(this.audio.context);

    this.pickableObjects = {};

    this.projector = new Primrose.Workerize(Primrose.Projector);

    this.options.scene = this.scene = this.options.scene || new THREE.Scene();
    if (this.options.useFog) {
      this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
    }

    this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);
    if (this.options.skyTexture !== undefined) {
      this.sky = textured(
        shell(
          this.options.drawDistance,
          18,
          9,
          Math.PI * 2,
          Math.PI),
        this.options.skyTexture, {
          unshaded: true
        });
      this.sky.name = "Sky";
      this.scene.add(this.sky);
    }

    if (this.options.groundTexture !== undefined) {
      var dim = 10,
        gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
      this.ground = textured(gm, this.options.groundTexture, {
        txtRepeatS: dim * 5,
        txtRepeatT: dim * 5
      });
      if (this.options.sceneModel !== undefined) {
        this.ground.position.y = -0.02;
      }
      this.ground.rotation.x = -Math.PI / 2;
      this.ground.name = "Ground";
      this.scene.add(this.ground);
      this.registerPickableObject(this.ground);
    }

    if (this.passthrough) {
      this.camera.add(this.passthrough.mesh);
    }

    var buildScene = (sceneGraph) => {
      sceneGraph.buttons = [];
      sceneGraph.traverse(function (child) {
        if (child.isButton) {
          sceneGraph.buttons.push(
            new Primrose.Controls.Button3D(child.parent, child.name));
        }
        if (child.name) {
          sceneGraph[child.name] = child;
        }
      });
      this.scene.add.apply(this.scene, sceneGraph.children);
      this.scene.traverse((obj) => {
        if (this.options.disableDefaultLighting && obj.material && obj.material.map) {
          textured(obj, obj.material.map, {
            unshaded: true
          });
        }
        if (obj.name) {
          this.scene[obj.name] = obj;
        }
      });
      if (sceneGraph.Camera) {
        this.camera.position.copy(sceneGraph.Camera.position);
        this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
      }
      return sceneGraph;
    };

    put(light(0xffffff, 1.5, 50))
      .on(this.scene)
      .at(0, 10, 10);

    var currentTimerObject = null;
    this.timer = 0;
    var RAF = (callback) => {
      currentTimerObject = this.input.VR.currentDevice || window;
      if (this.timer !== null) {
        this.timer = currentTimerObject.requestAnimationFrame(callback);
      }
    };

    //
    // Manage full-screen state
    //
    this.goFullScreen = (index, evt) => {
      if (evt !== "Gaze") {
        this.input.VR.connect(index);
        this.input.VR.requestPresent([{
            source: this.renderer.domElement
          }])
          .catch((exp) => console.error("whaaat", exp))
          .then(() => this.renderer.domElement.focus());
      }
    };

    var addAvatar = (user) => {
      this.scene.add(user.stage);
      this.scene.add(user.head);
    };

    var removeAvatar = (user) => {
      this.scene.remove(user.stage);
      this.scene.remove(user.head);
    };

    var showHideButtons = () => {
      var hide = this.input.VR.isPresenting,
        elem = this.renderer.domElement.nextElementSibling;
      while (elem) {
        if (hide) {
          elem.dataset.originaldisplay = elem.style.display;
          elem.style.display = "none";
        }
        else {
          elem.style.display = elem.dataset.originaldisplay;
        }
        elem = elem.nextElementSibling;
      }
    };

    var fixPointerLock = () => {
      if (this.input.VR.isPresenting && !PointerLock.isActive) {
        PointerLock.request(this.input.VR.currentCanvas);
      }
    }

    window.addEventListener("keydown", (evt) => {
      if (this.input.VR.isPresenting) {
        if (evt.keyCode === Primrose.Keys.ESCAPE && !this.input.VR.isPolyfilled) {
          this.input.VR.cancel();
        }
        else {
          fixPointerLock();
        }
      }
    });

    PointerLock.addChangeListener((evt) => {
      if (this.input.VR.isPresenting && !PointerLock.isActive) {
        this.input.VR.cancel();
      }
    });

    window.addEventListener("mousedown", fixPointerLock);


    window.addEventListener("vrdisplaypresentchange", (evt) => {
      if (!this.input.VR.isPresenting) {
        this.input.VR.cancel();
      }
      showHideButtons();
      modifyScreen();
    });
    window.addEventListener("resize", modifyScreen, false);
    window.addEventListener("blur", this.stop, false);
    window.addEventListener("focus", this.start, false);

    this.projector.addEventListener("hit", handleHit, false);

    documentReady = documentReady.then(() => {
      if (this.options.renderer) {
        this.renderer = this.options.renderer;
      }
      else {
        this.renderer = new THREE.WebGLRenderer({
          canvas: Primrose.DOM.cascadeElement(this.options.canvasElement, "canvas", HTMLCanvasElement),
          context: this.options.context,
          antialias: this.options.antialias,
          alpha: true,
          logarithmicDepthBuffer: false
        });
        this.renderer.autoClear = false;
        this.renderer.sortObjects = true;
        this.renderer.setClearColor(this.options.backgroundColor);
        if (!this.renderer.domElement.parentElement) {
          document.body.appendChild(this.renderer.domElement);
        }
      }

      this.renderer.domElement.addEventListener('webglcontextlost', this.stop, false);
      this.renderer.domElement.addEventListener('webglcontextrestored', this.start, false);

      this.input = new Primrose.Input.FPSInput(this.renderer.domElement, this.options);
      this.input.addEventListener("zero", this.zero, false);
      window.addEventListener("paste", this.input.Keyboard.withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", this.input.Keyboard.withCurrentControl("readWheel"), false);


      this.input.Keyboard.operatingSystem = this.options.os;
      this.input.Keyboard.codePage = this.options.language;

      this.input.head.add(this.camera);

      this.network = new Primrose.Network.Manager(this.input, this.audio, factories, this.options);
      this.network.addEventListener("addavatar", addAvatar);
      this.network.addEventListener("removeavatar", removeAvatar);

      return this.input.ready;
    });

    var frameCount = 0,
      frameTime = 0,
      NUM_FRAMES = 10,
      LEAD_TIME = 2000,
      lastQualityChange = 0,
      dq1 = 0,
      dq2 = 0;

    var checkQuality = () => {
      if (this.options.autoScaleQuality &&
        // don't check quality if we've already hit the bottom of the barrel.
        this.quality !== Quality.NONE) {
        if (frameTime < lastQualityChange + LEAD_TIME) {
          // wait a few seconds before testing quality
          frameTime = performance.now();
        }
        else {
          ++frameCount;
          if (frameCount === NUM_FRAMES) {
            var now = performance.now(),
              dt = (now - frameTime) * 0.001,
              fps = Math.round(NUM_FRAMES / dt);
            frameTime = now;
            frameCount = 0;
            // save the last change
            dq2 = dq1;

            // if we drop low, decrease quality
            if (fps < 45) {
              dq1 = -1;
            }
            else if (
              // don't upgrade on mobile devices
              !isMobile &&
              // don't upgrade if the user says not to
              this.options.autoRescaleQuality &&
              //good speed
              fps >= 60 &&
              // still room to grow
              this.quality < Quality.MAXIMUM &&
              // and the last change wasn't a downgrade
              dq2 !== -1) {
              dq1 = 1;
            }
            else {
              dq1 = 0;
            }
            if (dq1 !== 0) {
              this.quality += dq1;
            }
            lastQualityChange = now;
          }
        }
      }
    };

    var allReady = Promise.all([
        modelsReady,
        audioReady,
        documentReady
      ])
      .then(() => {
        this.renderer.domElement.style.cursor = "default";
        this.input.VR.displays[0].DOMElement = this.renderer.domElement;
        this.input.VR.connect(0);
        this.emit("ready");
      });

    this.start = () => {
      allReady
        .then(() => {
          this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          RAF(animate);
        });
    };

    this.stop = () => {
      if (currentTimerObject) {
        currentTimerObject.cancelAnimationFrame(this.timer);
        this.audio.stop();
        this.timer = null;
      }
    };

    Object.defineProperties(this, {
      quality: {
        get: () => this.options.quality,
        set: (v) => {
          if (0 <= v && v < PIXEL_SCALES.length) {
            this.options.quality = v;
            resolutionScale = PIXEL_SCALES[v];
            if ("WebVRConfig" in window) {
              WebVRConfig.BUFFER_SCALE = resolutionScale;
            }
          }
          allReady.then(modifyScreen);
        }
      }
    });

    this.quality = this.options.quality;

    if (window.alert.toString()
      .indexOf("native code") > -1) {
      // overwrite the native alert functions so they can't be called while in
      // fullscreen VR mode.

      var rerouteDialog = (oldFunction, newFunction) => {
        if (!newFunction) {
          newFunction = function () {};
        }
        return () => {
          if (this.input.VR.isPresenting) {
            newFunction();
          }
          else {
            oldFunction.apply(window, arguments);
          }
        };
      };

      window.alert = rerouteDialog(window.alert);
      window.confirm = rerouteDialog(window.confirm);
      window.prompt = rerouteDialog(window.prompt);
    }

    this.start();
  }

  connect(socket, userName) {
    return this.network && this.network.connect(socket, userName);
  }

  disconnect() {
    return this.network && this.network.disconnect();
  }

  get displays() {
    return this.input.VR.displays;
  }
}

BrowserEnvironment.DEFAULTS = {
  antialias: true,
  autoScaleQuality: true,
  autoRescaleQuality: false,
  quality: Quality.MAXIMUM,
  useLeap: false,
  useFog: false,
  avatarHeight: 1.65,
  walkSpeed: 2,
  // The acceleration applied to falling objects.
  gravity: 9.8,
  // The amount of time in seconds to require gazes on objects before triggering the gaze event.
  gazeLength: 1,
  // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
  disableMirroring: false,
  // By default, a single light is added to the scene,
  disableDefaultLighting: false,
  // The color that WebGL clears the background with before drawing.
  backgroundColor: 0xafbfff,
  // the near plane of the camera.
  nearPlane: 0.01,
  // the far plane of the camera.
  drawDistance: 100,
  // the field of view to use in non-VR settings.
  defaultFOV: 75,
  // The sound to play on loop in the background.
  ambientSound: null,
  // HTML5 canvas element, if one had already been created.
  canvasElement: "frontBuffer",
  // THREE.js renderer, if one had already been created.
  renderer: null,
  // A WebGL context to use, if one had already been created.
  context: null,
  // THREE.js scene, if one had already been created.
  scene: null
};
return BrowserEnvironment;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.ButtonFactory = factory();
  }
}(this, function() {
"use strict";

var buttonCount = 0;

pliny.class({
  parent: "Primrose",
    name: "ButtonFactory",
    description: "Loads a model file and holds the data, creating clones of the data whenever a new button is desired.",
    parameters: [{
      name: "template",
      type: "THREE.Object3D",
      description: "A THREE.Object3D that specifies a 3D model for a button, to be used as a template."
    }, {
      name: "options",
      type: "Object",
      description: "The options to apply to all buttons that get created by the factory."
    }, {
      name: "complete",
      type: "Function",
      description: "A callback function to indicate when the loading process has completed, if `templateFile` was a String path."
    }]
});

function ButtonFactory(templateFile, options) {
  pliny.property({
    name: "options",
    type: "Object",
    description: "The options that the user provided, so that we might change them after the factory has been created, if we so choose."
  });
  this.options = options;
  pliny.property({
    name: "template",
    type: "THREE.Object3D",
    description: "The 3D model for the button, that will be cloned every time a new button is created."
  });
  this.template = templateFile;
}

pliny.method({
  parent: "Primrose.ButtonFactory",
  name: "create",
  description: "Clones all of the geometry, materials, etc. in a 3D model to create a new copy of it. This really should be done with instanced objects, but I just don't have the time to deal with it right now.",
  parameters: [{
    name: "toggle",
    type: "Boolean",
    description: "True if the new button should be a toggle button (requiring additional clicks to deactivate) or a regular button (deactivating when the button is released, aka \"momentary\"."
  }],
  return: "The cloned button that which we so desired."
});
ButtonFactory.prototype.create = function (toggle) {
  var name = "button" + (++buttonCount);
  var obj = this.template.clone();
  var btn = new Primrose.Controls.Button3D(obj, name, this.options, toggle);
  return btn;
};
return ButtonFactory;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  name: "Controls",
  parent: "Primrose",
  description: "Various 3D control objects."
});
const Controls = {};
return Controls;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.DOM = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "DOM",
  description: "A few functions for manipulating DOM."
});
const DOM = {};
return DOM;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Entity = factory();
  }
}(this, function() {
"use strict";

var entityKeys = [],
  entities = new WeakMap();

pliny.class({
  parent: "Primrose",
    name: "Entity",
    description: "The Entity class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
});
class Entity {

  static registerEntity(e) {
    pliny.function({
      parent: "Primrose.Entity",
      name: "registerEntity",
      description: "Register an entity to be able to receive eyeBlank events.",
      parameters: [{
        name: "e",
        type: "Primrose.Entity",
        description: "The entity to register."
      }]
    });
    entities.set(e.id, e);
    entityKeys.push(e.id);
    e.addEventListener("_idchanged", (evt) => {
      entityKeys.splice(entityKeys.indexOf(evt.oldID), 1);
      entities.delete(evt.oldID);
      entities.set(evt.entity.id, evt.entity);
      entityKeys.push(evt.entity.id);
    }, false);
  }

  static eyeBlankAll(eye) {
    pliny.function({
      parent: "Primrose.Entity",
      name: "eyeBlankAll",
      description: "Trigger the eyeBlank event for all registered entities.",
      parameters: [{
        name: "eye",
        type: "Number",
        description: "The eye to switch to: -1 for left, +1 for right."
      }],
    });
    entityKeys.forEach((id) => {
      entities.get(id)
        .eyeBlank(eye);
    });
  }

  constructor(id) {
    this.id = id;

    pliny.property({
      parent: "Primrose.Entity",
      name: "parent ",
      type: "Primrose.Entity",
      description: "The parent element of this eleemnt, if this element has been added as a child to another element."
    });
    this.parent = null;

    pliny.property({
      parent: "Primrose.Entity",
      name: "children",
      type: "Array",
      description: "The child elements of this element."
    });
    this.children = [];

    pliny.property({
      parent: "Primrose.Entity",
      name: "focused",
      type: "Boolean",
      description: "A flag indicating if the element, or a child element within it, has received focus from the user."
    });
    this.focused = false;

    pliny.property({
      parent: "Primrose.Entity",
      name: "focusable",
      type: "Boolean",
      description: "A flag indicating if the element, or any child elements within it, is capable of receiving focus."
    });
    this.focusable = true;

    pliny.property({
      parent: "Primrose.Entity",
      name: "listeners",
      type: "Object",
      description: "The event listener container, holding the callbacks to trigger for each type of event."
    });
    this.listeners = {
      focus: [],
      blur: [],
      click: [],
      keydown: [],
      keyup: [],
      paste: [],
      copy: [],
      cut: [],
      wheel: [],
      _idchanged: []
    };

    pliny.event({
      parent: "Primrose.Entity",
      name: "focus",
      description: "If the element is focusable, occurs when the user clicks on an element for the first time, or when a program calls the `focus()` method."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "blur",
      description: "If the element is focused (which implies it is also focusable), occurs when the user clicks off of an element, or when a program calls the `blur()` method."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "click",
      description: "Occurs whenever the user clicks on an element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "keydown",
      description: "Occurs when the user pushes a key down while focused on the element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "keyup",
      description: "Occurs when the user releases a key while focused on the element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "paste",
      description: "Occurs when the user activates the clipboard's `paste` command while focused on the element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "cut",
      description: "Occurs when the user activates the clipboard's `cut` command while focused on the element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "copy",
      description: "Occurs when the user activates the clipboard's `copy` command while focused on the element."
    });

    pliny.event({
      parent: "Primrose.Entity",
      name: "wheel",
      description: "Occurs when the user scrolls the mouse wheel while focused on the element."
    });
  }

  get id() {
    pliny.property({
      parent: "Primrose.Entity",
      name: "id ",
      type: "String",
      description: "Get or set the id for the control."
    });
    return this._id;
  }

  set id(v) {
    var oldID = this._id;
    this._id = new String(v);
    emit.call(this, "_idchanged", {
      oldID: oldID,
      entity: this
    });
  }

  addEventListener(event, func) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "addEventListener",
      description: "Adding an event listener registers a function as being ready to receive events.",
      parameters: [{
        name: "evt",
        type: "String",
        description: "The name of the event for which we are listening."
      }, {
        name: "thunk",
        type: "Function",
        description: "The callback to fire when the event occurs."
      }],
      examples: [{
        name: "Add an event listener.",
        description: "The `addEventListener()` method operates nearly identically to the method of the same name on DOM elements.\n\
\n\
  grammar(\"JavaScript\");\n\
  var txt = new Primrose.Text.Controls.TextBox();\n\
  txt.addEventListener(\"mousemove\", console.log.bind(console, \"mouse move\"));\n\
  txt.addEventListener(\"keydown\", console.log.bind(console, \"key down\"));"
      }]
    });
    if (this.listeners[event]) {
      this.listeners[event].push(func);
    }
  }

  removeEventListener(event, func) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "removeEventListener",
      description: "Removing an event listener so that it no longer receives events from this object. Note that it must be the same function instance that was used when the event listener was added.",
      parameters: [{
        name: "evt",
        type: "String",
        description: "The name of the event from which we are removing."
      }, {
        name: "thunk",
        type: "Function",
        description: "The callback to remove."
      }],
      examples: [{
        name: "Remove an event listener.",
        description: "The `removeEventListener()` method operates nearly identically to the method of the same name on DOM elements.\n\
\n\
  grammar(\"JavaScript\");\n\
  var txt = new Primrose.Text.Controls.TextBox(),\n\
  func = console.log.bind(console, \"mouse move\");\n\
  txt.addEventListener(\"mousemove\", func);\n\
  txt.removeEventListener(\"mousemove\", func);"
      }]
    });
    const evts = this.listeners[event];
    if (evt) {
      const i = evts.indexOf(func);
      if (0 <= i && i < evts.length) {
        evts.splice(i, 1);
      }
    }
  }

  focus() {
    pliny.method({
      parent: "Primrose.Entity",
      name: "focus",
      description: "If the control is focusable, sets the focus property of the control, does not change the focus property of any other control.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
  new Primrose.Text.Controls.TextBox(),\n\
  new Primrose.Text.Controls.TextBox(),\n\
  new Primrose.Text.Button()\n\
  ];\n\
  \n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
      }]
    });
    if (this.focusable) {
      this.focused = true;
      emit.call(this, "focus", {
        target: this
      });
    }
  }

  blur() {
    pliny.method({
      parent: "Primrose.Entity",
      name: "blur",
      description: "If the element is focused, unsets the focus property of the control and all child controls. Does not change the focus property of any parent or sibling controls.",
      examples: [{
        name: "Focus on one control, blur all the rest",
        description: "When we have a list of controls and we are trying to track focus between them all, we must coordinate calls between `focus()` and `blur()`.\n\
\n\
  grammar(\"JavaScript\");\n\
  var ctrls = [\n\
  new Primrose.Text.Controls.TextBox(),\n\
  new Primrose.Text.Controls.TextBox(),\n\
  new Primrose.Text.Button()\n\
  ];\n\
  \n\
  function focusOn(id){\n\
    for(var i = 0; i < ctrls.length; ++i){\n\
      var c = ctrls[i];\n\
      if(c.controlID === id){\n\
        c.focus();\n\
      }\n\
      else{\n\
        c.blur();\n\
      }\n\
    }\n\
  }"
      }]
    });
    if (this.focused) {
      this.focused = false;
      for (var i = 0; i < this.children.length; ++i) {
        if (this.children[i].focused) {
          this.children[i].blur();
        }
      }
      emit.call(this, "blur", {
        target: this
      });
    }
  }

  appendChild(child) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "appendChild",
      description: "Adds an Entity as a child entity of this entity.",
      parameters: [{
        name: "child",
        type: "Primrose.Entity",
        description: "The object to add. Will only succeed if `child.parent` is not set to a value."
      }],
      examples: [{
        name: "Add an entity to another entity",
        description: "Entities can be arranged in parent-child relationships.\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Primrose.Entity(),\n\
  b = new Primrose.Entity();\n\
  a.appendChild(b);\n\
  console.assert(a.children.length === 1);\n\
  console.assert(a.children[0] === b);\n\
  console.assert(b.parent === a);"
      }]
    });
    if (child && !child.parent) {
      child.parent = this;
      this.children.push(child);
    }
  }

  removeChild(child) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "removeChild",
      description: "Removes an Entity from another Entity of this entity.",
      parameters: [{
        name: "child",
        type: "Primrose.Entity",
        description: "The object to remove. Will only succeed if `child.parent` is this object."
      }],
      examples: [{
        name: "Remove an entity from another entity",
        description: "Entities can be arranged in parent-child relationships.\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Primrose.Entity(),\n\
  b = new Primrose.Entity();\n\
  a.appendChild(b);\n\
  console.assert(a.children.length === 1);\n\
  console.assert(a.children[0] === b);\n\
  console.assert(b.parent === a);\n\
  a.removeChild(b);\n\
  console.assert(a.children.length === 0)\n\
  console.assert(b.parent === null);"
      }]
    });
    const i = this.children.indexOf(child);
    if (0 <= i && i < this.children.length) {
      this.children.splice(i, 1);
      child.parent = null;
    }
  }

  get theme() {
    pliny.property({
      parent: "Primrose.Entity",
      name: "theme",
      type: "Primrose.Text.Themes.*",
      description: "Get or set the theme used for rendering text on any controls in the control tree."
    });
    return null;
  }

  set theme(v) {
    for (var i = 0; i < this.children.length; ++i) {
      this.children[i].theme = v;
    }
  }

  get lockMovement() {
    pliny.property({
      parent: "Primrose.Entity",
      name: "lockMovement",
      type: "Boolean",
      description: "Recursively searches the deepest leaf-node of the control graph for a control that has its `lockMovement` property set to `true`, indicating that key events should not be used to navigate the user, because they are being interpreted as typing commands."
    });
    var lock = false;
    for (var i = 0; i < this.children.length && !lock; ++i) {
      lock |= this.children[i].lockMovement;
    }
    return lock;
  }

  get focusedElement() {
    pliny.property({
      parent: "Primrose.Entity",
      name: "focusedElement",
      type: "Primrose.Entity",
      description: "Searches the deepest leaf-node of the control graph for a control that has its `focused` property set to `true`."
    });
    var result = null,
      head = this;
    while (head && head.focused) {
      result = head;
      var children = head.children;
      head = null;
      for (var i = 0; i < children.length; ++i) {
        var child = children[i];
        if (child.focused) {
          head = child;
        }
      }
    }
    return result;
  }

  eyeBlank(eye) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "eyeBlank",
      parameters: [{
        name: "eye",
        type: "Number",
        description: "The eye to switch to: -1 for left, +1 for right."
      }],
      description: "Instructs any stereoscopically rendered surfaces to change their rendering offset."
    });
    for (var i = 0; i < this.children.length; ++i) {
      this.children[i].eyeBlank(eye);
    }
  }

  _forFocusedChild(name, evt) {
    var elem = this.focusedElement;
    if (elem && elem !== this) {
      elem[name](evt);
    }
  }

  startDOMPointer(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "startDOMPointer",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseDown` and `touchStart` events and propagates it to any of its focused children."
    });
    for (var i = 0; i < this.children.length; ++i) {
      this.children[i].startDOMPointer(evt);
    }
  }

  moveDOMPointer(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "moveDOMPointer",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseMove` and `touchMove` events and propagates it to any of its focused children."
    });
    this._forFocusedChild("moveDOMPointer", evt);
  }

  startUV(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "startUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseDown` and `touchStart` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused children."
    });
    this._forFocusedChild("startUV", evt);
  }

  moveUV(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "moveUV",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The pointer event to read"
      }],
      description: "Hooks up to the window's `mouseMove` and `touchMove` events, with coordinates translated to tangent-space UV coordinates, and propagates it to any of its focused children."
    });
    this._forFocusedChild("moveUV", evt);
  }

  endPointer() {
    pliny.method({
      parent: "Primrose.Entity",
      name: "endPointer",
      description: "Hooks up to the window's `mouseUp` and `toucheEnd` events and propagates it to any of its focused children."
    });
    this._forFocusedChild("endPointer");
  }

  keyDown(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "keyDown",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyDown` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("keyDown", evt);
  }

  keyUp(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "keyUp",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The key event to read"
      }],
      description: "Hooks up to the window's `keyUp` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("keyUp", evt);
  }

  readClipboard(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "readClipboard",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `paste` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("readClipboard", evt);
  }

  copySelectedText(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "copySelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `copy` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("copySelectedText", evt);
  }

  cutSelectedText(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "cutSelectedText",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The clipboard event to read"
      }],
      description: "Hooks up to the clipboard's `cut` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("cutSelectedText", evt);
  }

  readWheel(evt) {
    pliny.method({
      parent: "Primrose.Entity",
      name: "readWheel",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "The wheel event to read"
      }],
      description: "Hooks up to the window's `wheel` event and propagates it to any of its focused children."
    });
    this._forFocusedChild("readWheel", evt);
  }
}
return Entity;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "HTTP",
  description: "A collection of basic XMLHttpRequest wrappers."
});
const HTTP = {};
return HTTP;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "Input",
  description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."
});
const Input = {};
return Input;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.InputProcessor = factory();
  }
}(this, function() {
"use strict";

const SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"],
  TELEPORT_PAD_RADIUS = 0.4,
  FORWARD = new THREE.Vector3(0, 0, -1),
  MAX_SELECT_DISTANCE = 2,
  MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  moveTo = new THREE.Vector3(0, 0, 0);

pliny.class({
  parent: "Primrose",
    name: "InputProcessor",
    description: "| [under construction]"
});
class InputProcessor {

  static defineAxisProperties(classFunc, values) {
    classFunc.AXES = values;
    values.forEach(function (name, i) {
      classFunc[name] = i + 1;
      Object.defineProperty(classFunc.prototype, name, {
        get: function () {
          return this.getAxis(name);
        },
        set: function (v) {
          this.setAxis(name, v);
        }
      });
    });
  }

  constructor(name, parent, commands, socket, axisNames) {
    this.name = name;
    this.parent = parent;
    this.commands = {};
    this.commandNames = [];
    this.socket = socket;
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.transmitting = true;
    this.receiving = true;
    this.socketReady = false;
    this.inPhysicalUse = false;
    this.inputState = {
      buttons: [],
      axes: [],
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };
    this.lastState = "";
    this.listeners = {
      teleport: []
    }

    var readMetaKeys = (event) => {
      for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    };

    window.addEventListener("keydown", readMetaKeys, false);
    window.addEventListener("keyup", readMetaKeys, false);

    if (socket) {
      socket.on("open", () => {
        this.socketReady = true;
        this.inPhysicalUse = !this.receiving;
      });
      socket.on(name, (cmdState) => {
        if (this.receiving) {
          this.inPhysicalUse = false;
          this.decodeStateSnapshot(cmdState);
          this.fireCommands();
        }
      });
      socket.on("close", () => {
        this.inPhysicalUse = true;
        this.socketReady = false;
      });
    }

    for (var cmdName in commands) {
      this.addCommand(cmdName, commands[cmdName]);
    }

    for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
    }

    this.axisNames = axisNames || Primrose.Input[name] && Primrose.Input[name].AXES || [];

    for (var i = 0; i < this.axisNames.length; ++i) {
      this.inputState.axes[i] = 0;
    }
  }

  addCommand(name, cmd) {
    cmd.name = name;
    cmd = this.cloneCommand(cmd);
    if (typeof cmd.repetitions === "undefined") {
      cmd.repetitions = 1;
    }
    cmd.state = {
      value: null,
      pressed: false,
      wasPressed: false,
      fireAgain: false,
      lt: 0,
      ct: 0,
      repeatCount: 0
    };
    this.commands[name] = cmd;
    this.commandNames.push(name);
  }

  addEventListener(evt, thunk, bubbles) {
    if (this.listeners[evt]) {
      this.listeners[evt].push(thunk);
    }
  }

  cloneCommand(cmd) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone(cmd.axes),
      commands: cmd.commands && cmd.commands.slice() || [],
      buttons: this.maybeClone(cmd.buttons),
      metaKeys: this.maybeClone(cmd.metaKeys && cmd.metaKeys.map((k) => {
        for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          if (Math.abs(k) === Primrose.Keys[m.toLocaleUpperCase()]) {
            return Math.sign(k) * (i + 1);
          }
        }
      })),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  }

  maybeClone(arr) {
    var output = [];
    if (arr) {
      for (var i = 0; i < arr.length; ++i) {
        output[i] = {
          index: Math.abs(arr[i]) - 1,
          toggle: arr[i] < 0,
          sign: (arr[i] < 0) ? -1 : 1
        };
      }
    }
    return output;
  }

  update(dt) {
    if (this.enabled) {
      if (this.ready && this.enabled && this.inPhysicalUse && !this.paused && dt > 0) {
        for (var name in this.commands) {
          var cmd = this.commands[name];
          cmd.state.wasPressed = cmd.state.pressed;
          cmd.state.pressed = false;
          if (!cmd.disabled) {
            var metaKeysSet = true;

            if (cmd.metaKeys) {
              for (var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n) {
                var m = cmd.metaKeys[n];
                metaKeysSet = metaKeysSet &&
                  (this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                    !m.toggle ||
                    !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] &&
                    m.toggle);
              }
            }

            if (metaKeysSet) {
              var pressed = true,
                value = 0,
                n, temp,
                anyButtons = false;

              for (n in this.inputState.buttons) {
                if (this.inputState.buttons[n]) {
                  anyButtons = true;
                  break;
                }
              }

              if (cmd.buttons) {
                for (n = 0; n < cmd.buttons.length; ++n) {
                  var btn = cmd.buttons[n],
                    code = btn.index + 1,
                    p = (code === Primrose.Keys.ANY) && anyButtons || !!this.inputState.buttons[code];
                  temp = p ? btn.sign : 0;
                  pressed = pressed && (p && !btn.toggle || !p && btn.toggle);
                  if (Math.abs(temp) > Math.abs(value)) {
                    value = temp;
                  }
                }
              }

              if (cmd.axes) {
                for (n = 0; n < cmd.axes.length; ++n) {
                  var a = cmd.axes[n];
                  temp = a.sign * this.inputState.axes[a.index];
                  if (Math.abs(temp) > Math.abs(value)) {
                    value = temp;
                  }
                }
              }

              for (n = 0; n < cmd.commands.length; ++n) {
                temp = this.getValue(cmd.commands[n]);
                if (Math.abs(temp) > Math.abs(value)) {
                  value = temp;
                }
              }

              if (cmd.scale !== undefined) {
                value *= cmd.scale;
              }

              if (cmd.offset !== undefined) {
                value += cmd.offset;
              }

              if (cmd.deadzone && Math.abs(value) < cmd.deadzone) {
                value = 0;
              }

              if (cmd.integrate) {
                value = this.getValue(cmd.name) + value * dt;
              }
              else if (cmd.delta) {
                var ov = value;
                if (cmd.state.lv !== undefined) {
                  value = (value - cmd.state.lv) / dt;
                }
                cmd.state.lv = ov;
              }

              if (cmd.min !== undefined) {
                value = Math.max(cmd.min, value);
              }

              if (cmd.max !== undefined) {
                value = Math.min(cmd.max, value);
              }

              if (cmd.threshold) {
                pressed = pressed && (value > cmd.threshold);
              }

              cmd.state.pressed = pressed;
              cmd.state.value = value;
            }

            cmd.state.lt += dt;

            cmd.state.fireAgain = cmd.state.pressed &&
              cmd.state.lt >= cmd.dt &&
              (cmd.repetitions === -1 || cmd.state.repeatCount < cmd.repetitions);

            if (cmd.state.fireAgain) {
              cmd.state.lt = 0;
              ++cmd.state.repeatCount;
            }
            else if (!cmd.state.pressed) {
              cmd.state.repeatCount = 0;
            }
          }
        }

        if (this.socketReady && this.transmitting) {
          var finalState = this.makeStateSnapshot();
          if (finalState !== this.lastState) {
            this.socket.emit(this.name, finalState);
            this.lastState = finalState;
          }
        }

        this.fireCommands();
      }
    }
  }

  zero() {
    for (var i = 0; this.enabled && i < SETTINGS_TO_ZERO.length; ++i) {
      this.setValue(SETTINGS_TO_ZERO[i], 0);
    }
  }

  fireCommands() {
    if (this.ready && !this.paused) {
      for (var name in this.commands) {
        var cmd = this.commands[name];
        if (cmd.state.fireAgain && cmd.commandDown) {
          cmd.commandDown(this.name);
        }

        if (!cmd.state.pressed && cmd.state.wasPressed && cmd.commandUp) {
          cmd.commandUp(this.name);
        }
      }
    }
  }

  makeStateSnapshot() {
    var state = "",
      i = 0,
      l = Object.keys(this.commands)
      .length;
    for (var name in this.commands) {
      var cmd = this.commands[name];
      if (cmd.state) {
        state += (i << 2) |
          (cmd.state.pressed ? 0x1 : 0) |
          (cmd.state.fireAgain ? 0x2 : 0) + ":" +
          cmd.state.value;
        if (i < l - 1) {
          state += "|";
        }
      }
      ++i;
    }
    return state;
  }

  decodeStateSnapshot(snapshot) {
    var cmd, name;
    for (name in this.commands) {
      cmd = this.commands[name];
      cmd.state.wasPressed = cmd.state.pressed;
    }
    var records = snapshot.split("|");
    for (var i = 0; i < records.length; ++i) {
      var record = records[i],
        parts = record.split(":"),
        cmdIndex = parseInt(parts[0], 10),
        pressed = (cmdIndex & 0x1) !== 0,
        fireAgain = (flags & 0x2) !== 0,
        flags = parseInt(parts[2], 10);
      cmdIndex >>= 2;
      name = this.commandNames(cmdIndex);
      cmd = this.commands[name];
      cmd.state = {
        value: parseFloat(parts[1]),
        pressed: pressed,
        fireAgain: fireAgain
      };
    }
  }

  setProperty(key, name, value) {
    if (this.commands[name]) {
      this.commands[name][key] = value;
    }
  }

  setDeadzone(name, value) {
    this.setProperty("deadzone", name, value);
  }

  setScale(name, value) {
    this.setProperty("scale", name, value);
  }

  setDT(name, value) {
    this.setProperty("dt", name, value);
  }

  setMin(name, value) {
    this.setProperty("min", name, value);
  }

  setMax(name, value) {
    this.setProperty("max", name, value);
  }

  addToArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      this.commands[name][key].push(value);
    }
  }

  addMetaKey(name, value) {
    this.addToArray("metaKeys", name, value);
  }


  addAxis(name, value) {
    this.addToArray("axes", name, value);
  }

  addButton(name, value) {
    this.addToArray("buttons", name, value);
  }

  removeMetaKey(name, value) {
    this.removeFromArray("metaKeys", name, value);
  }

  removeAxis(name, value) {
    this.removeFromArray("axes", name, value);
  }

  removeButton(name, value) {
    this.removeFromArray("buttons", name, value);
  }

  invertAxis(name, value) {
    this.invertInArray("axes", name, value);
  }

  invertButton(name, value) {
    this.invertInArray("buttons", name, value);
  }

  invertMetaKey(name, value) {
    this.invertInArray("metaKeys", name, value);
  }

  removeFromArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      var arr = this.commands[name][key],
        n = arr.indexOf(value);
      if (n > -1) {
        arr.splice(n, 1);
      }
    }
  }

  invertInArray(key, name, value) {
    if (this.commands[name] && this.commands[name][key]) {
      var arr = this.commands[name][key],
        n = arr.indexOf(value);
      if (n > -1) {
        arr[n] *= -1;
      }
    }
  }

  pause(v) {
    this.paused = v;
  }

  isPaused() {
    return this.paused;
  }

  enable(k, v) {
    if (v === undefined || v === null) {
      v = k;
      k = null;
    }

    if (k) {
      this.setProperty("disabled", k, !v);
    }
    else {
      this.enabled = v;
    }
  }

  isEnabled(name) {
    return name && this.commands[name] && !this.commands[name].disabled;
  }

  transmit(v) {
    this.transmitting = v;
  }

  isTransmitting() {
    return this.transmitting;
  }

  receive(v) {
    this.receiving = v;
  }

  isReceiving() {
    return this.receiving;
  }

  getAxis(name) {
    var i = this.axisNames.indexOf(name);
    if (i > -1) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  }

  setAxis(name, value) {
    var i = this.axisNames.indexOf(name);
    if (i > -1) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  }

  setButton(index, pressed) {
    this.inPhysicalUse = true;
    this.inputState.buttons[index] = pressed;
  }

  getValue(name) {
    return ((this.enabled || (this.receiving && this.socketReady)) &&
        this.isEnabled(name) &&
        this.commands[name].state.value) ||
      this.getAxis(name) || 0;
  }

  setValue(name, value) {
    var j = this.axisNames.indexOf(name);
    if (!this.commands[name] && j > -1) {
      this.setAxis(name, value);
    }
    else if (this.commands[name] && !this.commands[name].disabled) {
      this.commands[name].state.value = value;
    }
  }

  isDown(name) {
    return (this.enabled || (this.receiving && this.socketReady)) &&
      this.isEnabled(name) &&
      this.commands[name].state.pressed;
  }

  isUp(name) {
    return (this.enabled || (this.receiving && this.socketReady)) &&
      this.isEnabled(name) &&
      this.commands[name].state.pressed;
  }
}
return InputProcessor;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Keys = factory();
  }
}(this, function() {
"use strict";

pliny.enumeration({
  parent: "Primrose",
  name: "Keys",
  description: "Keycode values for system keys that are the same across all international standards"
});
var Keys = {
  ANY: Number.MAX_VALUE,
  ///////////////////////////////////////////////////////////////////////////
  // modifiers
  ///////////////////////////////////////////////////////////////////////////
  MODIFIER_KEYS: ["ctrl", "shift", "alt", "meta", "meta_l", "meta_r"],
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  META: 91,
  META_L: 91,
  META_R: 92,
  ///////////////////////////////////////////////////////////////////////////
  // whitespace
  ///////////////////////////////////////////////////////////////////////////
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  DELETE: 46,
  ///////////////////////////////////////////////////////////////////////////
  // lock keys
  ///////////////////////////////////////////////////////////////////////////
  PAUSEBREAK: 19,
  CAPSLOCK: 20,
  NUMLOCK: 144,
  SCROLLLOCK: 145,
  INSERT: 45,
  ///////////////////////////////////////////////////////////////////////////
  // navigation keys
  ///////////////////////////////////////////////////////////////////////////
  ESCAPE: 27,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFTARROW: 37,
  UPARROW: 38,
  RIGHTARROW: 39,
  DOWNARROW: 40,
  SELECTKEY: 93,
  ///////////////////////////////////////////////////////////////////////////
  // numbers
  ///////////////////////////////////////////////////////////////////////////
  NUMBER0: 48,
  NUMBER1: 49,
  NUMBER2: 50,
  NUMBER3: 51,
  NUMBER4: 52,
  NUMBER5: 53,
  NUMBER6: 54,
  NUMBER7: 55,
  NUMBER8: 56,
  NUMBER9: 57,
  ///////////////////////////////////////////////////////////////////////////
  // letters
  ///////////////////////////////////////////////////////////////////////////
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  ///////////////////////////////////////////////////////////////////////////
  // numpad
  ///////////////////////////////////////////////////////////////////////////
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMALPOINT: 110,
  DIVIDE: 111,
  ///////////////////////////////////////////////////////////////////////////
  // function keys
  ///////////////////////////////////////////////////////////////////////////
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  ///////////////////////////////////////////////////////////////////////////
  // media keys
  ///////////////////////////////////////////////////////////////////////////
  VOLUME_DOWN: 174,
  VOLUME_UP: 175,
  TRACK_NEXT: 176,
  TRACK_PREVIOUS: 177
};

// create a reverse mapping from keyCode to name.
for (var key in Keys) {
  var val = Keys[key];
  if (Keys.hasOwnProperty(key) && typeof (val) === "number") {
    Keys[val] = key;
  }
}
return Keys;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.ModelLoader = factory();
  }
}(this, function() {
"use strict";

// If Three.js hasn't been loaded, then this module doesn't make sense and we
// can just return a shim to prevent errors from occuring. This is useful in
// cases where we want to use Primrose in a 2D context, or perhaps use it with
// a different 3D library, whatever that might be.
if (typeof (THREE) === "undefined") {
  return function () {};
}

// The JSON format object loader is not always included in the Three.js distribution,
// so we have to first check for it.
var loaders = {
    ".json": THREE.ObjectLoader,
    ".fbx": THREE.FBXLoader,
    ".mtl": THREE.MTLLoader,
    ".obj": THREE.OBJLoader,
    ".stl": THREE.STLLoader,
    ".typeface.js": THREE.FontLoader
  },
  mime = {
    "text/prs.wavefront-obj": "obj",
    "text/prs.wavefront-mtl": "mtl"
  },
  PATH_PATTERN = /((?:[^/]+\/)+)(\w+)(\.(?:\w+))$/,
  EXTENSION_PATTERN = /(\.(?:\w+))+$/,
  NAME_PATTERN = /([^/]+)\.\w+$/;

// Sometimes, the properties that export out of Blender and into Three.js don't
// come out correctly, so we need to do a correction.
function fixJSONScene(json) {
  json.traverse(function (obj) {
    if (obj.geometry) {
      obj.geometry.computeBoundingSphere();
      obj.geometry.computeBoundingBox();
    }
  });
  return json;
}

var propertyTests = {
  isButton: function (obj) {
    return obj.material && obj.material.name.match(/^button\d+$/);
  },
  isSolid: function (obj) {
    return !obj.name.match(/^(water|sky)/);
  },
  isGround: function (obj) {
    return obj.material && obj.material.name && obj.material.name.match(/\bground\b/);
  }
};

function setProperties(object) {
  object.traverse(function (obj) {
    if (obj instanceof THREE.Mesh) {
      for (var prop in propertyTests) {
        obj[prop] = obj[prop] || propertyTests[prop](obj);
      }
    }
  });
  return object;
}

pliny.class({
  parent: "Primrose",
    name: "ModelLoader",
    description: "Creates an interface for cloning 3D models loaded from files, to instance those objects.\n\
\n\
> NOTE: You don't instantiate this class directly. Call `ModelLoader.loadModel`.",
    parameters: [{
      name: "template",
      type: "THREE.Object3D",
      description: "The 3D model to make clonable."
    }],
    examples: [{
      name: "Load a basic model.",
      description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  // Create the scene where objects will go\n\
  var scene = new THREE.Scene(),\n\
   \n\
  // Load up the file, optionally \"check it out\"\n\
    modelFactory = new Primrose.loadModel(\"path/to/model.json\", console.log.bind(console, \"Progress:\"))\n\
    .then(function(model){\n\
      model.template.traverse(function(child){\n\
        // Do whatever you want to the individual child objects of the scene.\n\
      });\n\
   \n\
    // Add copies of the model to the scene every time the user hits the ENTER key.\n\
    window.addEventListener(\"keyup\", function(evt){\n\
      // If the template object exists, then the model loaded successfully.\n\
      if(evt.keyCode === 10){\n\
        scene.add(model.clone());\n\
      }\n\
    });\n\
  })\n\
  .catch(console.error.bind(console));"
    }]
});

function ModelLoader(template) {
  pliny.property({
    name: "template",
    type: "THREE.Object3D",
    description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
  });
  this.template = template;
}
ModelLoader.loadModel = function (src, type, progress) {
  return ModelLoader.loadObject(src, type, progress)
    .then((scene) => new ModelLoader(scene));
};

pliny.method({
  parent: "Primrose.ModelLoader",
  name: "clone",
  description: "Creates a copy of the stored template model.",
  returns: "A THREE.Object3D that is a copy of the stored template.",
  examples: [{
    name: "Load a basic model.",
    description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  // Create the scene where objects will go\n\
  var scene = new THREE.Scene(),\n\
  \n\
  // Load up the file, optionally \"check it out\"\n\
    modelFactory = new Primrose.ModelLoader(\"path/to/model.json\", function(model){\n\
      model.traverse(function(child){\n\
        // Do whatever you want to the individual child objects of the scene.\n\
      });\n\
  }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
  \n\
  // Add copies of the model to the scene every time the user hits the ENTER key.\n\
  window.addEventListener(\"keyup\", function(evt){\n\
    // If the template object exists, then the model loaded successfully.\n\
    if(modelFactory.template && evt.keyCode === 10){\n\
      scene.add(modelFactory.clone());\n\
    }\n\
  });"
  }]
});
ModelLoader.prototype.clone = function () {
  var obj = this.template.clone();

  obj.traverse((child) => {
    if (child instanceof THREE.SkinnedMesh) {
      obj.animation = new THREE.Animation(child, child.geometry.animation);
      if (!this.template.originalAnimationData && obj.animation.data) {
        this.template.originalAnimationData = obj.animation.data;
      }
      if (!obj.animation.data) {
        obj.animation.data = this.template.originalAnimationData;
      }
    }
  });

  setProperties(obj);
  return obj;
};

pliny.function({
  parent: "Primrose.ModelLoader",
  name: "loadObject",
  description: "Asynchronously loads a JSON, OBJ, or MTL file as a Three.js object. It processes the scene for attributes, creates new properties on the scene to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for one-time use models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
  returns: "Promise",
  parameters: [{
    name: "src",
    type: "String",
    description: "The file from which to load."
  }, {
    name: "type",
    type: "String",
    optional: true,
    description: "The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension."
  }, {
    name: "progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Load a basic model.",
    description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  // Create the scene where objects will go\n\
  var renderer = new THREE.WebGLRenderer(),\n\
      currentScene = new THREE.Scene(),\n\
      camera = new THREE.PerspectiveCamera();\n\
   \n\
  // Load up the file\n\
  Primrose.ModelLoader.loadObject(\n\
    \"path/to/model.json\",\n\
    null,\n\
    console.log.bind(console, \"Progress:\"))\n\
    .then(scene.add.bind(scene))\n\
    .catch(console.error.bind(console));\n\
   \n\
  function paint(t){\n\
    requestAnimationFrame(paint);\n\
    renderer.render(scene, camera);\n\
  }\n\
   \n\
  requestAnimationFrame(paint);"
  }]
});
ModelLoader.loadObject = function (src, type, progress) {
  var extMatch = src.match(EXTENSION_PATTERN),
    extension = type && ("." + type) || extMatch[0];
  if (!extension) {
    return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
  }
  else {
    extension = extension.toLowerCase();
    var Loader = new loaders[extension]();
    if (!Loader) {
      return Promise.reject("There is no loader type for the file extension: " + extension);
    }
    else {
      var name = src.substring(0, extMatch.index),
        elemID = name + "_" + extension.toLowerCase(),
        elem = document.getElementById(elemID),
        promise = Promise.resolve();
      if (extension === ".obj") {
        var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
        promise = promise
          .then(() => ModelLoader.loadObject(newPath, "mtl", progress))
          .then((materials) => {
            materials.preload();
            Loader.setMaterials(materials)
          });
      }
      else if (extension === ".mtl") {
        var match = src.match(PATH_PATTERN),
          dir = match[1];
        src = match[2] + match[3];
        Loader.setBaseUrl(dir);
        Loader.setPath(dir);
      }

      if (elem) {
        var elemSource = elem.innerHTML
          .split(/\r?\n/g)
          .map(function (s) {
            return s.trim();
          })
          .join("\n");
        promise = promise.then(() => Loader.parse(elemSource));
      }
      else {
        if (Loader.setCrossOrigin) {
          Loader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
        }
        promise = promise.then(() => new Promise((resolve, reject) => Loader.load(src, resolve, progress, reject)));
      }

      if (extension === ".json") {
        promise = promise.then(fixJSONScene);
      }

      if (extension !== ".mtl" && extension !== ".typeface.js") {
        promise = promise.then(setProperties);
      }
      promise = promise.catch(console.error.bind(console, "MODEL_ERR", src))
      return promise;
    }
  }
};


pliny.function({
  parent: "Primrose.ModelLoader",
  name: "loadObjects",
  description: "Asynchronously loads an array of JSON, OBJ, or MTL file as a Three.js object. It processes the objects for attributes, creating new properties on each object to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for static models.\n\
\n\
See [`Primrose.ModelLoader.loadObject()`](#Primrose_ModelLoader_loadObject) for more details on how individual models are loaded.",
  returns: "Promise",
  parameters: [{
    name: "arr",
    type: "Array",
    description: "The files from which to load."
  }, {
    name: "type",
    type: "String",
    optional: true,
    description: "The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension."
  }, {
    name: "progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Load some models.",
    description: "When Blender exports models, they are frequently treated as full scenes, essentially making them scene-graph sub-trees.\n\
We can load a bunch of models in one go using the following code.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  // Create the scene where objects will go\n\
  var renderer = new THREE.WebGLRenderer(),\n\
      currentScene = new THREE.Scene(),\n\
      camera = new THREE.PerspectiveCamera(),\n\
      allModels = null;\n\
   \n\
  // Load up the file\n\
  Primrose.ModelLoader.loadObjects(\n\
    [\"path/to/model1.json\",\n\
      \"path/to/model2.obj\",\n\
      \"path/to/model3.obj\",\n\
      \"path/to/model4.fbx\"],\n\
    console.log.bind(console, \"Progress:\"))\n\
    .then(function(models){\n\
      allModels = models;\n\
      models.forEach(function(model){\n\
        scene.add(model);\n\
      });\n\
    })\n\
    .catch(console.error.bind(console));\n\
   \n\
  function paint(t){\n\
    requestAnimationFrame(paint);\n\
    \n\
    if(allModels){\n\
      // do whatever updating you want on the models\n\
    }\n\
    \n\
    renderer.render(scene, camera);\n\
  }\n\
  \n\
  requestAnimationFrame(paint);"
  }]
});
ModelLoader.loadObjects = function (map) {
  var output = {},
    promise = Promise.resolve(output);
  for (var key in map) {
    if (map[key]) {
      promise = promise.then(loader(map, key));
    }
  }
  return promise;
};

function loader(map, key) {
  return (obj) => ModelLoader.loadObject(map[key])
    .then((model) => {
      obj[key] = model;
      return obj;
    });
}
return ModelLoader;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Network = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "Network",
  description: "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN."
});
const Network = {};
return Network;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Output = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "Output",
  description: "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)."
});
const Output = {};
return Output;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Pointer = factory();
  }
}(this, function() {
"use strict";

const TELEPORT_PAD_RADIUS = 0.4,
  FORWARD = new THREE.Vector3(0, 0, -1),
  MAX_SELECT_DISTANCE = 2,
  MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  EULER_TEMP = new THREE.Euler(),
  moveBy = new THREE.Vector3(0, 0, 0);

pliny.class({
  parent: "Primrose",
    name: "Pointer",
    baseClass: "Primrose.AbstractEventEmitter",
    description: "A device that points into the scene somewhere, casting a ray at objects for picking operations.",
    parameters: [{
      name: "name ",
      type: "String",
      description: "A friendly name for this pointer object, to make debugging easier."
    }, {
      name: "color",
      type: "Number",
      description: "The color to use to render the teleport pad and 3D pointer cursor."
    }, {
      name: "emission",
      type: "Number",
      description: "The color to use to highlight the teleport pad and 3D pointer cursor so that it's not 100% black outside of lighted areas."
    }, {
      name: "isHand",
      type: "Boolean",
      description: "Pass true to add a hand model at the origin of the pointer ray."
    }, {
      name: "orientationDevice",
      type: "Primrose.InputProcessor",
      description: "The input object that defines the orientation for this pointer."
    }, {
      name: "positionDevice",
      type: "Primrose.PoseInputProcessor",
      description: "The input object that defines the position for this pointer.",
      optional: true,
      defaultValue: null
    }]
});
class Pointer extends Primrose.AbstractEventEmitter {
  constructor(name, color, emission, isHand, orientationDevice, positionDevice = null) {
    super();
    this.name = name;
    this.orientationDevice = orientationDevice;
    this.positionDevice = positionDevice || orientationDevice;
    this._currentControl = null;
    this.showPointer = true;
    this.color = color;
    this.emission = emission;
    this.velocity = new THREE.Vector3();
    this.mesh = textured(box(LASER_WIDTH, LASER_WIDTH, LASER_LENGTH), this.color, {
      emissive: this.emission
    });
    this.mesh.geometry.vertices.forEach((v) => {
      v.z -= LASER_LENGTH * 0.5 + 0.5;
    });

    this.disk = textured(sphere(TELEPORT_PAD_RADIUS, 128, 3), this.color, {
      emissive: this.emission
    });
    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach((v) => v.y -= this.disk.geometry.boundingBox.min.y);
    this.disk.geometry.computeBoundingBox();

    this.disk.scale.set(1, 0.1, 1);

    if (isHand) {
      this.mesh.add(textured(box(0.1, 0.025, 0.2), this.color, {
        emissive: this.emission
      }));
    }
  }

  add(obj) {
    this.mesh.add(obj);
  }

  addToBrowserEnvironment(env, scene) {
    pliny.method({
      parent: "Primrose.Pointer",
      name: "addToBrowserEnvironment",
      description: "Add this meshes that give the visual representation of the pointer, to the scene.",
      parameters: [{
        name: "env",
        type: "Primrose.BrowserEnvironment",
        description: "Not used, just here to fulfill a common interface in the framework."
      }, {
        name: "scene",
        type: "THREE.Scene",
        description: "The scene to which to add the 3D cursor."
      }]
    });
    scene.add(this.mesh);
    scene.add(this.disk);
  }

  get position() {
    return this.mesh.position;
  }

  get quaternion() {
    return this.mesh.quaternion;
  }

  get matrix() {
    return this.mesh.matrix;
  }

  updateMatrix() {
    return this.mesh.updateMatrix();
  }

  applyMatrix(m) {
    return this.mesh.applyMatrix(m);
  }

  get currentControl() {
    return this._currentControl;
  }

  set currentControl(v) {
    var head = this;
    while (head) {
      head._currentControl = v;
      head = head.parent;
    }
  }

  get segment() {
    if (this.showPointer) {
      FORWARD.set(0, 0, -1)
        .applyQuaternion(this.mesh.quaternion)
        .add(this.mesh.position);
      return [this.name, this.mesh.position.toArray(), FORWARD.toArray()];
    }
  }

  update() {
    if (this.orientationDevice instanceof Primrose.PoseInputProcessor) {
      this.position.copy(this.orientationDevice.position);
      this.quaternion.copy(this.orientationDevice.quaternion);
    }
    else {

      var head = this.orientationDevice,
        pitch = 0,
        heading = 0;
      while (head) {
        pitch += head.getValue("pitch");
        heading += head.getValue("heading");
        head = head.parent;
      }

      EULER_TEMP.set(pitch, heading, 0, "YXZ");
      this.quaternion.setFromEuler(EULER_TEMP);
      this.position.copy(this.positionDevice.position);
    }
  }

  resolvePicking(currentHits, lastHits, objects) {
    this.disk.visible = false;
    this.mesh.visible = false;

    if (this.orientationDevice.enabled && this.showPointer) {
      // reset the mesh color to the base value
      textured(this.mesh, this.color, {
        emissive: this.minorColor
      });
      this.mesh.visible = true;
      var buttons = 0,
        dButtons = 0,
        currentHit = currentHits[this.name],
        lastHit = lastHits && lastHits[this.name],
        head = this.orientationDevice,
        isGround = false,
        object,
        control,
        point;

      while (head) {
        buttons += head.getValue("buttons");
        dButtons += head.getValue("dButtons");
        head = head.parent;
      }

      var changed = dButtons !== 0;

      if (currentHit) {
        object = objects[currentHit.objectID];
        isGround = object && object.name === "Ground";

        var fp = currentHit.facePoint;

        point = currentHit.point;
        control = object && (object.button || object.surface);

        moveBy.fromArray(fp)
          .sub(this.mesh.position);

        this.disk.visible = isGround;
        if (isGround) {
          var distSq = moveBy.x * moveBy.x + moveBy.z * moveBy.z;
          if (distSq > MAX_MOVE_DISTANCE_SQ) {
            var dist = Math.sqrt(distSq),
              factor = MAX_MOVE_DISTANCE / dist,
              y = moveBy.y;
            moveBy.y = 0;
            moveBy.multiplyScalar(factor);
            moveBy.y = y;
            textured(this.mesh, 0xffff00, {
              emissive: 0x7f7f00
            });
          }
          this.disk.position
            .copy(this.mesh.position)
            .add(moveBy);
        }
        else {
          textured(this.mesh, 0x00ff00, {
            emissive: 0x007f00
          });
        }
      }

      if (changed) {
        if (buttons) {
          var blurCurrentControl = !!this.currentControl,
            currentControl = this.currentControl;
          this.currentControl = null;

          if (object) {
            if (currentControl && currentControl === control) {
              blurCurrentControl = false;
            }

            if (!this.currentControl && control) {
              this.currentControl = control;
              this.currentControl.focus();
            }
            else if (isGround) {
              this.emit("teleport", {
                name: this.name,
                position: this.disk.position
              });
            }

            if (this.currentControl) {
              this.currentControl.startUV(point);
            }
          }

          if (blurCurrentControl) {
            currentControl.blur();
          }
        }
        else if (this.currentControl) {
          this.currentControl.endPointer();
        }
      }
      else if (!changed && buttons > 0 && this.currentControl && point) {
        this.currentControl.moveUV(point);
      }
    }
  }

  get lockMovement() {
    var head = this;
    while (head) {
      if (this.currentControl && this.currentControl.lockMovement) {
        return true;
      }
      head = head.parent;
    }
    return false;
  }

}
return Pointer;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.PoseInputProcessor = factory();
  }
}(this, function() {
"use strict";

const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  EMPTY_SCALE = new THREE.Vector3();

pliny.class({
  parent: "Primrose",
    name: "PoseInputProcessor",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class PoseInputProcessor extends Primrose.InputProcessor {
  constructor(name, parent, commands, socket, axisNames) {
    super(name, parent, commands, socket, axisNames);

    this.currentDevice = null;
    this.lastPose = null;
    this.currentPose = null;
    this.posePosition = new THREE.Vector3();
    this.poseQuaternion = new THREE.Quaternion();
    this.position = new THREE.Vector3();
    this.quaternion = new THREE.Quaternion();
    this.matrix = new THREE.Matrix4();
  }

  update(dt) {
    super.update(dt);

    if (this.currentDevice) {
      var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
      this.lastPose = pose;
      this.inPhysicalUse = !!this.currentPose;
      var orient = this.currentPose && this.currentPose.orientation,
        pos = this.currentPose && this.currentPose.position;
      if (orient) {
        this.poseQuaternion.fromArray(orient);
      }
      else {
        this.poseQuaternion.set(0, 0, 0, 1);
      }
      if (pos) {
        this.posePosition.fromArray(pos);
      }
      else {
        this.posePosition.set(0, 0, 0);
      }
    }
  }

  updateStage(stageMatrix) {
    this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
    this.matrix.setPosition(this.posePosition);
    this.matrix.multiplyMatrices(stageMatrix, this.matrix);
    this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
  }
}
return PoseInputProcessor;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Projector = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose",
    name: "Projector",
    description: "| [under construction]"
});

function Projector(isWorker) {
  (function () {
    if (typeof THREE === "undefined") {
      /* jshint ignore:start */
      // File:src/three.js

      /**
       * This is just the THREE.Matrix4 and THREE.Vector3 classes from Three.js, to
       * be loaded into a WebWorker so the worker can do math. - STM
       *
       * @author mrdoob / http://mrdoob.com/
       */

      self.THREE = {
        REVISION: '72dev'
      };
      // polyfills

      if (Math.sign === undefined) {

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

        Math.sign = function (x) {

          return (x < 0) ? -1 : (x > 0) ? 1 : +x;
        };
      }

      if (Function.prototype.name === undefined && Object.defineProperty !==
        undefined) {

        // Missing in IE9-11.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

        Object.defineProperty(Function.prototype, 'name', {
          get: function () {

            return this.toString()
              .match(/^\s*function\s*(\S*)\s*\(/)[1];
          }

        });
      }

      // File:src/math/Quaternion.js

      /**
       * @author mikael emtinger / http://gomo.se/
       * @author alteredq / http://alteredqualia.com/
       * @author WestLangley / http://github.com/WestLangley
       * @author bhouston / http://exocortex.com
       *
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       * @param {Number} w
       */
      THREE.Quaternion = function (x, y, z, w) {

        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = (w !== undefined) ? w : 1;
      };
      THREE.Quaternion.prototype = {
        constructor: THREE.Quaternion,
        get x() {

          return this._x;
        },
        set x(value) {

          this._x = value;
          this.onChangeCallback();
        },
        get y() {

          return this._y;
        },
        set y(value) {

          this._y = value;
          this.onChangeCallback();
        },
        get z() {

          return this._z;
        },
        set z(value) {

          this._z = value;
          this.onChangeCallback();
        },
        get w() {

          return this._w;
        },
        set w(value) {

          this._w = value;
          this.onChangeCallback();
        },
        set: function (x, y, z, w) {

          this._x = x;
          this._y = y;
          this._z = z;
          this._w = w;
          this.onChangeCallback();
          return this;
        },
        clone: function () {

          return new this.constructor(this._x, this._y, this._z, this._w);
        },
        copy: function (quaternion) {

          this._x = quaternion.x;
          this._y = quaternion.y;
          this._z = quaternion.z;
          this._w = quaternion.w;
          this.onChangeCallback();
          return this;
        },
        setFromEuler: function (euler, update) {

          if (euler instanceof THREE.Euler === false) {

            throw new Error(
              'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
          }

          // http://www.mathworks.com/matlabcentral/fileexchange/
          // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
          //	content/SpinCalc.m

          var c1 = Math.cos(euler._x / 2);
          var c2 = Math.cos(euler._y / 2);
          var c3 = Math.cos(euler._z / 2);
          var s1 = Math.sin(euler._x / 2);
          var s2 = Math.sin(euler._y / 2);
          var s3 = Math.sin(euler._z / 2);
          if (euler.order === 'XYZ') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          }
          else if (euler.order === 'YXZ') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }
          else if (euler.order === 'ZXY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          }
          else if (euler.order === 'ZYX') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }
          else if (euler.order === 'YZX') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          }
          else if (euler.order === 'XZY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }

          if (update !== false)
            this.onChangeCallback();
          return this;
        },
        setFromAxisAngle: function (axis, angle) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

          // assumes axis is normalized

          var halfAngle = angle / 2,
            s = Math.sin(
              halfAngle);
          this._x = axis.x * s;
          this._y = axis.y * s;
          this._z = axis.z * s;
          this._w = Math.cos(halfAngle);
          this.onChangeCallback();
          return this;
        },
        setFromRotationMatrix: function (m) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

          // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

          var te = m.elements,
            m11 = te[0],
            m12 =
            te[4],
            m13 =
            te[8],
            m21 = te[1],
            m22 =
            te[5],
            m23 =
            te[9],
            m31 = te[2],
            m32 =
            te[6],
            m33 =
            te[10],
            trace = m11 + m22 + m33,
            s;
          if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);
            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
          }
          else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;
          }
          else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
          }
          else {

            s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
            this._w = (m21 - m12) / s;
            this._x = (m13 + m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;
          }

          this.onChangeCallback();
          return this;
        },
        setFromUnitVectors: function () {

          // http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

          // assumes direction vectors vFrom and vTo are normalized

          var v1,
            r;
          var EPS = 0.000001;
          return function (vFrom, vTo) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            r = vFrom.dot(vTo) + 1;
            if (r < EPS) {

              r = 0;
              if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

                v1.set(-vFrom.y, vFrom.x, 0);
              }
              else {

                v1.set(0, -vFrom.z, vFrom.y);
              }

            }
            else {

              v1.crossVectors(vFrom, vTo);
            }

            this._x = v1.x;
            this._y = v1.y;
            this._z = v1.z;
            this._w = r;
            this.normalize();
            return this;
          };
        }(),
        inverse: function () {

          this.conjugate()
            .normalize();
          return this;
        },
        conjugate: function () {

          this._x *= -1;
          this._y *= -1;
          this._z *= -1;
          this.onChangeCallback();
          return this;
        },
        dot: function (v) {

          return this._x * v._x + this._y * v._y + this._z * v._z + this._w *
            v._w;
        },
        lengthSq: function () {

          return this._x * this._x + this._y * this._y + this._z * this._z +
            this._w * this._w;
        },
        length: function () {

          return Math.sqrt(this._x * this._x + this._y * this._y + this._z *
            this._z + this._w * this._w);
        },
        normalize: function () {

          var l = this.length();
          if (l === 0) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
          }
          else {

            l = 1 / l;
            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;
          }

          this.onChangeCallback();
          return this;
        },
        multiply: function (q, p) {

          if (p !== undefined) {

            console.warn(
              'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
            return this.multiplyQuaternions(q, p);
          }

          return this.multiplyQuaternions(this, q);
        },
        multiplyQuaternions: function (a, b) {

          // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

          var qax = a._x,
            qay =
            a._y,
            qaz =
            a._z,
            qaw =
            a._w;
          var qbx = b._x,
            qby =
            b._y,
            qbz =
            b._z,
            qbw =
            b._w;
          this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
          this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
          this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
          this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
          this.onChangeCallback();
          return this;
        },
        multiplyVector3: function (vector) {

          console.warn(
            'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.');
          return vector.applyQuaternion(this);
        },
        slerp: function (qb, t) {

          if (t === 0)
            return this;
          if (t === 1)
            return this.copy(qb);
          var x = this._x,
            y =
            this._y,
            z =
            this._z,
            w =
            this._w;
          // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

          var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
          if (cosHalfTheta < 0) {

            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;
            cosHalfTheta = -cosHalfTheta;
          }
          else {

            this.copy(qb);
          }

          if (cosHalfTheta >= 1.0) {

            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;
            return this;
          }

          var halfTheta = Math.acos(cosHalfTheta);
          var sinHalfTheta = Math.sqrt(1.0 - cosHalfTheta * cosHalfTheta);
          if (Math.abs(sinHalfTheta) < 0.001) {

            this._w = 0.5 * (w + this._w);
            this._x = 0.5 * (x + this._x);
            this._y = 0.5 * (y + this._y);
            this._z = 0.5 * (z + this._z);
            return this;
          }

          var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
          this._w = (w * ratioA + this._w * ratioB);
          this._x = (x * ratioA + this._x * ratioB);
          this._y = (y * ratioA + this._y * ratioB);
          this._z = (z * ratioA + this._z * ratioB);
          this.onChangeCallback();
          return this;
        },
        equals: function (quaternion) {

          return (quaternion._x === this._x) && (quaternion._y ===
            this._y) && (quaternion._z === this._z) && (quaternion._w ===
            this._w);
        },
        fromArray: function (array, offset) {

          if (offset === undefined)
            offset = 0;
          this._x = array[offset];
          this._y = array[offset + 1];
          this._z = array[offset + 2];
          this._w = array[offset + 3];
          this.onChangeCallback();
          return this;
        },
        toArray: function (array, offset) {

          if (array === undefined)
            array = [];
          if (offset === undefined)
            offset = 0;
          array[offset] = this._x;
          array[offset + 1] = this._y;
          array[offset + 2] = this._z;
          array[offset + 3] = this._w;
          return array;
        },
        onChange: function (callback) {

          this.onChangeCallback = callback;
          return this;
        },
        onChangeCallback: function () {}

      };
      THREE.Quaternion.slerp = function (qa, qb, qm, t) {

        return qm.copy(qa)
          .slerp(
            qb,
            t);
      };
      // File:src/math/Vector3.js

      /**
       * @author mrdoob / http://mrdoob.com/
       * @author *kile / http://kile.stravaganza.org/
       * @author philogb / http://blog.thejit.org/
       * @author mikael emtinger / http://gomo.se/
       * @author egraether / http://egraether.com/
       * @author WestLangley / http://github.com/WestLangley
       *
       * @param {Number} x
       * @param {Number} y
       * @param {Number} z
       */
      THREE.Vector3 = function (x, y, z) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
      };
      THREE.Vector3.prototype = {
        constructor: THREE.Vector3,
        set: function (x, y, z) {

          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        },
        setX: function (x) {

          this.x = x;
          return this;
        },
        setY: function (y) {

          this.y = y;
          return this;
        },
        setZ: function (z) {

          this.z = z;
          return this;
        },
        setComponent: function (index, value) {

          switch (index) {

            case 0:
              this.x = value;
              break;
            case 1:
              this.y = value;
              break;
            case 2:
              this.z = value;
              break;
            default:
              throw new Error('index is out of range: ' + index);
          }

        },
        getComponent: function (index) {

          switch (index) {

            case 0:
              return this.x;
            case 1:
              return this.y;
            case 2:
              return this.z;
            default:
              throw new Error('index is out of range: ' + index);
          }

        },
        clone: function () {

          return new this.constructor(this.x, this.y, this.z);
        },
        copy: function (v) {

          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        },
        add: function (v, w) {

          if (w !== undefined) {

            console.warn(
              'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
          }

          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
          return this;
        },
        addScalar: function (s) {

          this.x += s;
          this.y += s;
          this.z += s;
          return this;
        },
        addVectors: function (a, b) {

          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        },
        addScaledVector: function (v, s) {

          this.x += v.x * s;
          this.y += v.y * s;
          this.z += v.z * s;
          return this;
        },
        sub: function (v, w) {

          if (w !== undefined) {

            console.warn(
              'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
          }

          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
          return this;
        },
        subScalar: function (s) {
          this.x -= s;
          this.y -= s;
          this.z -= s;
          return this;
        },
        subVectors: function (a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        },
        multiply: function (v, w) {

          if (w !== undefined) {

            console.warn(
              'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
          }

          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
          return this;
        },
        multiplyScalar: function (scalar) {

          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
          return this;
        },
        multiplyVectors: function (a, b) {

          this.x = a.x * b.x;
          this.y = a.y * b.y;
          this.z = a.z * b.z;
          return this;
        },
        applyEuler: function () {

          var quaternion;
          return function applyEuler(euler) {

            if (euler instanceof THREE.Euler === false) {

              console.error(
                'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
            }

            if (quaternion === undefined)
              quaternion = new THREE.Quaternion();
            this.applyQuaternion(quaternion.setFromEuler(euler));
            return this;
          };
        }(),
        applyAxisAngle: function () {

          var quaternion;
          return function applyAxisAngle(axis, angle) {

            if (quaternion === undefined)
              quaternion = new THREE.Quaternion();
            this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
            return this;
          };
        }(),
        applyMatrix3: function (m) {

          var x = this.x;
          var y = this.y;
          var z = this.z;
          var e = m.elements;
          this.x = e[0] * x + e[3] * y + e[6] * z;
          this.y = e[1] * x + e[4] * y + e[7] * z;
          this.z = e[2] * x + e[5] * y + e[8] * z;
          return this;
        },
        applyMatrix4: function (m) {

          // input: THREE.Matrix4 affine matrix

          var x = this.x,
            y =
            this.y,
            z =
            this.z;
          var e = m.elements;
          this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
          this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
          this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
          return this;
        },
        applyProjection: function (m) {

          // input: THREE.Matrix4 projection matrix

          var x = this.x,
            y =
            this.y,
            z =
            this.z;
          var e = m.elements;
          var d = 1 / (e[3] * x + e[7] * y + e[11] * z +
            e[15]); // perspective divide

          this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
          this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
          this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
          return this;
        },
        applyQuaternion: function (q) {

          var x = this.x;
          var y = this.y;
          var z = this.z;
          var qx = q.x;
          var qy = q.y;
          var qz = q.z;
          var qw = q.w;
          // calculate quat * vector

          var ix = qw * x + qy * z - qz * y;
          var iy = qw * y + qz * x - qx * z;
          var iz = qw * z + qx * y - qy * x;
          var iw = -qx * x - qy * y - qz * z;
          // calculate result * inverse quat

          this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
          this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
          this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
          return this;
        },
        project: function () {

          var matrix;
          return function project(camera) {

            if (matrix === undefined)
              matrix = new THREE.Matrix4();
            matrix.multiplyMatrices(camera.projectionMatrix,
              matrix.getInverse(camera.matrixWorld));
            return this.applyProjection(matrix);
          };
        }(),
        unproject: function () {

          var matrix;
          return function unproject(camera) {

            if (matrix === undefined)
              matrix = new THREE.Matrix4();
            matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(
              camera.projectionMatrix));
            return this.applyProjection(matrix);
          };
        }(),
        transformDirection: function (m) {

          // input: THREE.Matrix4 affine matrix
          // vector interpreted as a direction

          var x = this.x,
            y =
            this.y,
            z =
            this.z;
          var e = m.elements;
          this.x = e[0] * x + e[4] * y + e[8] * z;
          this.y = e[1] * x + e[5] * y + e[9] * z;
          this.z = e[2] * x + e[6] * y + e[10] * z;
          this.normalize();
          return this;
        },
        divide: function (v) {

          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
          return this;
        },
        divideScalar: function (scalar) {

          if (scalar !== 0) {

            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
          }
          else {

            this.x = 0;
            this.y = 0;
            this.z = 0;
          }

          return this;
        },
        min: function (v) {

          if (this.x > v.x) {

            this.x = v.x;
          }

          if (this.y > v.y) {

            this.y = v.y;
          }

          if (this.z > v.z) {

            this.z = v.z;
          }

          return this;
        },
        max: function (v) {

          if (this.x < v.x) {

            this.x = v.x;
          }

          if (this.y < v.y) {

            this.y = v.y;
          }

          if (this.z < v.z) {

            this.z = v.z;
          }

          return this;
        },
        clamp: function (min, max) {

          // This function assumes min < max, if this assumption isn't true it will not operate correctly

          if (this.x < min.x) {

            this.x = min.x;
          }
          else if (this.x > max.x) {

            this.x = max.x;
          }

          if (this.y < min.y) {

            this.y = min.y;
          }
          else if (this.y > max.y) {

            this.y = max.y;
          }

          if (this.z < min.z) {

            this.z = min.z;
          }
          else if (this.z > max.z) {

            this.z = max.z;
          }

          return this;
        },
        clampScalar: function () {

          var min,
            max;
          return function clampScalar(minVal, maxVal) {

            if (min === undefined) {

              min = new THREE.Vector3();
              max = new THREE.Vector3();
            }

            min.set(minVal, minVal, minVal);
            max.set(maxVal, maxVal, maxVal);
            return this.clamp(min, max);
          };
        }(),
        floor: function () {

          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          this.z = Math.floor(this.z);
          return this;
        },
        ceil: function () {

          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          this.z = Math.ceil(this.z);
          return this;
        },
        round: function () {

          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          this.z = Math.round(this.z);
          return this;
        },
        roundToZero: function () {

          this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
          this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
          return this;
        },
        negate: function () {

          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        },
        dot: function (v) {

          return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        lengthSq: function () {

          return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        length: function () {

          return Math.sqrt(this.x * this.x + this.y * this.y + this.z *
            this.z);
        },
        lengthManhattan: function () {

          return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        },
        normalize: function () {

          return this.divideScalar(this.length());
        },
        setLength: function (l) {

          var oldLength = this.length();
          if (oldLength !== 0 && l !== oldLength) {

            this.multiplyScalar(l / oldLength);
          }

          return this;
        },
        lerp: function (v, alpha) {

          this.x += (v.x - this.x) * alpha;
          this.y += (v.y - this.y) * alpha;
          this.z += (v.z - this.z) * alpha;
          return this;
        },
        lerpVectors: function (v1, v2, alpha) {

          this.subVectors(v2, v1)
            .multiplyScalar(
              alpha)
            .add(
              v1);
          return this;
        },
        cross: function (v, w) {

          if (w !== undefined) {

            console.warn(
              'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
          }

          var x = this.x,
            y =
            this.y,
            z =
            this.z;
          this.x = y * v.z - z * v.y;
          this.y = z * v.x - x * v.z;
          this.z = x * v.y - y * v.x;
          return this;
        },
        crossVectors: function (a, b) {

          var ax = a.x,
            ay =
            a.y,
            az =
            a.z;
          var bx = b.x,
            by =
            b.y,
            bz =
            b.z;
          this.x = ay * bz - az * by;
          this.y = az * bx - ax * bz;
          this.z = ax * by - ay * bx;
          return this;
        },
        projectOnVector: function () {

          var v1,
            dot;
          return function projectOnVector(vector) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            v1.copy(vector)
              .normalize();
            dot = this.dot(v1);
            return this.copy(v1)
              .multiplyScalar(
                dot);
          };
        }(),
        projectOnPlane: function () {

          var v1;
          return function projectOnPlane(planeNormal) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            v1.copy(this)
              .projectOnVector(
                planeNormal);
            return this.sub(v1);
          };
        }(),
        reflect: function () {

          // reflect incident vector off plane orthogonal to normal
          // normal is assumed to have unit length

          var v1;
          return function reflect(normal) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            return this.sub(v1.copy(normal)
              .multiplyScalar(
                2 *
                this.dot(
                  normal)));
          };
        }(),
        angleTo: function (v) {

          var theta = this.dot(v) / (this.length() * v.length());
          // clamp, to handle numerical problems

          return Math.acos(THREE.Math.clamp(theta, -1, 1));
        },
        distanceTo: function (v) {

          return Math.sqrt(this.distanceToSquared(v));
        },
        distanceToSquared: function (v) {

          var dx = this.x - v.x;
          var dy = this.y - v.y;
          var dz = this.z - v.z;
          return dx * dx + dy * dy + dz * dz;
        },
        setEulerFromRotationMatrix: function (m, order) {

          console.error(
            'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
        },
        setEulerFromQuaternion: function (q, order) {

          console.error(
            'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
        },
        getPositionFromMatrix: function (m) {

          console.warn(
            'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
          return this.setFromMatrixPosition(m);
        },
        getScaleFromMatrix: function (m) {

          console.warn(
            'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
          return this.setFromMatrixScale(m);
        },
        getColumnFromMatrix: function (index, matrix) {

          console.warn(
            'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
          return this.setFromMatrixColumn(index, matrix);
        },
        setFromMatrixPosition: function (m) {

          this.x = m.elements[12];
          this.y = m.elements[13];
          this.z = m.elements[14];
          return this;
        },
        setFromMatrixScale: function (m) {

          var sx = this.set(m.elements[0], m.elements[1],
              m.elements[2])
            .length();
          var sy = this.set(m.elements[4], m.elements[5],
              m.elements[6])
            .length();
          var sz = this.set(m.elements[8], m.elements[9],
              m.elements[10])
            .length();
          this.x = sx;
          this.y = sy;
          this.z = sz;
          return this;
        },
        setFromMatrixColumn: function (index, matrix) {

          var offset = index * 4;
          var me = matrix.elements;
          this.x = me[offset];
          this.y = me[offset + 1];
          this.z = me[offset + 2];
          return this;
        },
        equals: function (v) {

          return ((v.x === this.x) && (v.y === this.y) && (v.z ===
            this.z));
        },
        fromArray: function (array, offset) {

          if (offset === undefined)
            offset = 0;
          this.x = array[offset];
          this.y = array[offset + 1];
          this.z = array[offset + 2];
          return this;
        },
        toArray: function (array, offset) {

          if (array === undefined)
            array = [];
          if (offset === undefined)
            offset = 0;
          array[offset] = this.x;
          array[offset + 1] = this.y;
          array[offset + 2] = this.z;
          return array;
        },
        fromAttribute: function (attribute, index, offset) {

          if (offset === undefined)
            offset = 0;
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[index];
          this.y = attribute.array[index + 1];
          this.z = attribute.array[index + 2];
          return this;
        }

      };
      // File:src/math/Matrix4.js

      /**
       * @author mrdoob / http://mrdoob.com/
       * @author supereggbert / http://www.paulbrunt.co.uk/
       * @author philogb / http://blog.thejit.org/
       * @author jordi_ros / http://plattsoft.com
       * @author D1plo1d / http://github.com/D1plo1d
       * @author alteredq / http://alteredqualia.com/
       * @author mikael emtinger / http://gomo.se/
       * @author timknip / http://www.floorplanner.com/
       * @author bhouston / http://exocortex.com
       * @author WestLangley / http://github.com/WestLangley
       */

      THREE.Matrix4 = function () {
        this.elements = new Float32Array([
          1, 0, 0, 0,
          0, 1, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        ]);
      };
      THREE.Matrix4.prototype = {
        constructor: THREE.Matrix4,
        set: function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33,
          n34, n41, n42, n43, n44) {

          var te = this.elements;
          te[0] = n11;
          te[4] = n12;
          te[8] = n13;
          te[12] = n14;
          te[1] = n21;
          te[5] = n22;
          te[9] = n23;
          te[13] = n24;
          te[2] = n31;
          te[6] = n32;
          te[10] = n33;
          te[14] = n34;
          te[3] = n41;
          te[7] = n42;
          te[11] = n43;
          te[15] = n44;
          return this;
        },
        identity: function () {

          this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

          );
          return this;
        },
        clone: function () {

          return new THREE.Matrix4()
            .fromArray(this.elements);
        },
        copy: function (m) {

          this.elements.set(m.elements);
          return this;
        },
        extractPosition: function (m) {

          console.warn(
            'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().');
          return this.copyPosition(m);
        },
        copyPosition: function (m) {

          var te = this.elements;
          var me = m.elements;
          te[12] = me[12];
          te[13] = me[13];
          te[14] = me[14];
          return this;
        },
        extractBasis: function (xAxis, yAxis, zAxis) {

          var te = this.elements;
          xAxis.set(te[0], te[1], te[2]);
          yAxis.set(te[4], te[5], te[6]);
          zAxis.set(te[8], te[9], te[10]);
          return this;
        },
        makeBasis: function (xAxis, yAxis, zAxis) {

          this.set(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            0, 0, 0, 1
          );
          return this;
        },
        extractRotation: function () {

          var v1;
          return function (m) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            var te = this.elements;
            var me = m.elements;
            var scaleX = 1 / v1.set(me[0], me[1], me[2])
              .length();
            var scaleY = 1 / v1.set(me[4], me[5], me[6])
              .length();
            var scaleZ = 1 / v1.set(me[8], me[9], me[10])
              .length();
            te[0] = me[0] * scaleX;
            te[1] = me[1] * scaleX;
            te[2] = me[2] * scaleX;
            te[4] = me[4] * scaleY;
            te[5] = me[5] * scaleY;
            te[6] = me[6] * scaleY;
            te[8] = me[8] * scaleZ;
            te[9] = me[9] * scaleZ;
            te[10] = me[10] * scaleZ;
            return this;
          };
        }(),
        makeRotationFromEuler: function (euler) {

          if (euler instanceof THREE.Euler === false) {

            console.error(
              'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
          }

          var te = this.elements;
          var x = euler.x,
            y =
            euler.y,
            z =
            euler.z;
          var a = Math.cos(x),
            b =
            Math.sin(
              x);
          var c = Math.cos(y),
            d =
            Math.sin(
              y);
          var e = Math.cos(z),
            f =
            Math.sin(
              z);
          if (euler.order === 'XYZ') {

            var ae = a * e,
              af =
              a *
              f,
              be =
              b *
              e,
              bf =
              b *
              f;
            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;
            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = -b * c;
            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
          }
          else if (euler.order === 'YXZ') {

            var ce = c * e,
              cf =
              c *
              f,
              de =
              d *
              e,
              df =
              d *
              f;
            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;
            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;
            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
          }
          else if (euler.order === 'ZXY') {

            var ce = c * e,
              cf =
              c *
              f,
              de =
              d *
              e,
              df =
              d *
              f;
            te[0] = ce - df * b;
            te[4] = -a * f;
            te[8] = de + cf * b;
            te[1] = cf + de * b;
            te[5] = a * e;
            te[9] = df - ce * b;
            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
          }
          else if (euler.order === 'ZYX') {

            var ae = a * e,
              af =
              a *
              f,
              be =
              b *
              e,
              bf =
              b *
              f;
            te[0] = c * e;
            te[4] = be * d - af;
            te[8] = ae * d + bf;
            te[1] = c * f;
            te[5] = bf * d + ae;
            te[9] = af * d - be;
            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
          }
          else if (euler.order === 'YZX') {

            var ac = a * c,
              ad =
              a *
              d,
              bc =
              b *
              c,
              bd =
              b *
              d;
            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;
            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;
            te[2] = -d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
          }
          else if (euler.order === 'XZY') {

            var ac = a * c,
              ad =
              a *
              d,
              bc =
              b *
              c,
              bd =
              b *
              d;
            te[0] = c * e;
            te[4] = -f;
            te[8] = d * e;
            te[1] = ac * f + bd;
            te[5] = a * e;
            te[9] = ad * f - bc;
            te[2] = bc * f - ad;
            te[6] = b * e;
            te[10] = bd * f + ac;
          }

          // last column
          te[3] = 0;
          te[7] = 0;
          te[11] = 0;
          // bottom row
          te[12] = 0;
          te[13] = 0;
          te[14] = 0;
          te[15] = 1;
          return this;
        },
        setRotationFromQuaternion: function (q) {

          console.warn(
            'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().');
          return this.makeRotationFromQuaternion(q);
        },
        makeRotationFromQuaternion: function (q) {

          var te = this.elements;
          var x = q.x,
            y =
            q.y,
            z =
            q.z,
            w =
            q.w;
          var x2 = x + x,
            y2 =
            y +
            y,
            z2 =
            z +
            z;
          var xx = x * x2,
            xy =
            x *
            y2,
            xz =
            x *
            z2;
          var yy = y * y2,
            yz =
            y *
            z2,
            zz =
            z *
            z2;
          var wx = w * x2,
            wy =
            w *
            y2,
            wz =
            w *
            z2;
          te[0] = 1 - (yy + zz);
          te[4] = xy - wz;
          te[8] = xz + wy;
          te[1] = xy + wz;
          te[5] = 1 - (xx + zz);
          te[9] = yz - wx;
          te[2] = xz - wy;
          te[6] = yz + wx;
          te[10] = 1 - (xx + yy);
          // last column
          te[3] = 0;
          te[7] = 0;
          te[11] = 0;
          // bottom row
          te[12] = 0;
          te[13] = 0;
          te[14] = 0;
          te[15] = 1;
          return this;
        },
        lookAt: function () {

          var x,
            y,
            z;
          return function (eye, target, up) {

            if (x === undefined)
              x = new THREE.Vector3();
            if (y === undefined)
              y = new THREE.Vector3();
            if (z === undefined)
              z = new THREE.Vector3();
            var te = this.elements;
            z.subVectors(eye, target)
              .normalize();
            if (z.length() === 0) {

              z.z = 1;
            }

            x.crossVectors(up, z)
              .normalize();
            if (x.length() === 0) {

              z.x += 0.0001;
              x.crossVectors(up, z)
                .normalize();
            }

            y.crossVectors(z, x);
            te[0] = x.x;
            te[4] = y.x;
            te[8] = z.x;
            te[1] = x.y;
            te[5] = y.y;
            te[9] = z.y;
            te[2] = x.z;
            te[6] = y.z;
            te[10] = z.z;
            return this;
          };
        }(),
        multiply: function (m, n) {

          if (n !== undefined) {

            console.warn(
              'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
            return this.multiplyMatrices(m, n);
          }

          return this.multiplyMatrices(this, m);
        },
        multiplyMatrices: function (a, b) {

          var ae = a.elements;
          var be = b.elements;
          var te = this.elements;
          var a11 = ae[0],
            a12 =
            ae[4],
            a13 =
            ae[8],
            a14 =
            ae[12];
          var a21 = ae[1],
            a22 =
            ae[5],
            a23 =
            ae[9],
            a24 =
            ae[13];
          var a31 = ae[2],
            a32 =
            ae[6],
            a33 =
            ae[10],
            a34 =
            ae[14];
          var a41 = ae[3],
            a42 =
            ae[7],
            a43 =
            ae[11],
            a44 =
            ae[15];
          var b11 = be[0],
            b12 =
            be[4],
            b13 =
            be[8],
            b14 =
            be[12];
          var b21 = be[1],
            b22 =
            be[5],
            b23 =
            be[9],
            b24 =
            be[13];
          var b31 = be[2],
            b32 =
            be[6],
            b33 =
            be[10],
            b34 =
            be[14];
          var b41 = be[3],
            b42 =
            be[7],
            b43 =
            be[11],
            b44 =
            be[15];
          te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
          te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
          te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
          te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
          te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
          te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
          te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
          te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
          te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
          te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
          te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
          te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
          te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
          te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
          te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
          te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
          return this;
        },
        multiplyToArray: function (a, b, r) {

          var te = this.elements;
          this.multiplyMatrices(a, b);
          r[0] = te[0];
          r[1] = te[1];
          r[2] = te[2];
          r[3] = te[3];
          r[4] = te[4];
          r[5] = te[5];
          r[6] = te[6];
          r[7] = te[7];
          r[8] = te[8];
          r[9] = te[9];
          r[10] = te[10];
          r[11] = te[11];
          r[12] = te[12];
          r[13] = te[13];
          r[14] = te[14];
          r[15] = te[15];
          return this;
        },
        multiplyScalar: function (s) {

          var te = this.elements;
          te[0] *= s;
          te[4] *= s;
          te[8] *= s;
          te[12] *= s;
          te[1] *= s;
          te[5] *= s;
          te[9] *= s;
          te[13] *= s;
          te[2] *= s;
          te[6] *= s;
          te[10] *= s;
          te[14] *= s;
          te[3] *= s;
          te[7] *= s;
          te[11] *= s;
          te[15] *= s;
          return this;
        },
        multiplyVector3: function (vector) {

          console.warn(
            'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.');
          return vector.applyProjection(this);
        },
        multiplyVector4: function (vector) {

          console.warn(
            'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.');
          return vector.applyMatrix4(this);
        },
        multiplyVector3Array: function (a) {

          console.warn(
            'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.');
          return this.applyToVector3Array(a);
        },
        applyToVector3Array: function () {

          var v1;
          return function (array, offset, length) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            if (offset === undefined)
              offset = 0;
            if (length === undefined)
              length = array.length;
            for (var i = 0,
                j =
                offset; i <
              length; i +=
              3, j +=
              3) {

              v1.fromArray(array, j);
              v1.applyMatrix4(this);
              v1.toArray(array, j);
            }

            return array;
          };
        }(),
        applyToBuffer: function () {

          var v1;
          return function applyToBuffer(buffer, offset, length) {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            if (offset === undefined)
              offset = 0;
            if (length === undefined)
              length = buffer.length / buffer.itemSize;
            for (var i = 0,
                j =
                offset; i <
              length; i++, j++) {

              v1.x = buffer.getX(j);
              v1.y = buffer.getY(j);
              v1.z = buffer.getZ(j);
              v1.applyMatrix4(this);
              buffer.setXYZ(v1.x, v1.y, v1.z);
            }

            return buffer;
          };
        }(),
        rotateAxis: function (v) {

          console.warn(
            'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.');
          v.transformDirection(this);
        },
        crossVector: function (vector) {

          console.warn(
            'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.');
          return vector.applyMatrix4(this);
        },
        determinant: function () {

          var te = this.elements;
          var n11 = te[0],
            n12 =
            te[4],
            n13 =
            te[8],
            n14 =
            te[12];
          var n21 = te[1],
            n22 =
            te[5],
            n23 =
            te[9],
            n24 =
            te[13];
          var n31 = te[2],
            n32 =
            te[6],
            n33 =
            te[10],
            n34 =
            te[14];
          var n41 = te[3],
            n42 =
            te[7],
            n43 =
            te[11],
            n44 =
            te[15];
          //TODO: make this more efficient
          //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

          return (
            n41 * (+n14 * n23 * n32 -
              n13 * n24 * n32 -
              n14 * n22 * n33 +
              n12 * n24 * n33 +
              n13 * n22 * n34 -
              n12 * n23 * n34
            ) +
            n42 * (+n11 * n23 * n34 -
              n11 * n24 * n33 +
              n14 * n21 * n33 -
              n13 * n21 * n34 +
              n13 * n24 * n31 -
              n14 * n23 * n31
            ) +
            n43 * (+n11 * n24 * n32 -
              n11 * n22 * n34 -
              n14 * n21 * n32 +
              n12 * n21 * n34 +
              n14 * n22 * n31 -
              n12 * n24 * n31
            ) +
            n44 * (-n13 * n22 * n31 -
              n11 * n23 * n32 +
              n11 * n22 * n33 +
              n13 * n21 * n32 -
              n12 * n21 * n33 +
              n12 * n23 * n31
            )

          );
        },
        transpose: function () {

          var te = this.elements;
          var tmp;
          tmp = te[1];
          te[1] = te[4];
          te[4] = tmp;
          tmp = te[2];
          te[2] = te[8];
          te[8] = tmp;
          tmp = te[6];
          te[6] = te[9];
          te[9] = tmp;
          tmp = te[3];
          te[3] = te[12];
          te[12] = tmp;
          tmp = te[7];
          te[7] = te[13];
          te[13] = tmp;
          tmp = te[11];
          te[11] = te[14];
          te[14] = tmp;
          return this;
        },
        flattenToArrayOffset: function (array, offset) {

          var te = this.elements;
          array[offset] = te[0];
          array[offset + 1] = te[1];
          array[offset + 2] = te[2];
          array[offset + 3] = te[3];
          array[offset + 4] = te[4];
          array[offset + 5] = te[5];
          array[offset + 6] = te[6];
          array[offset + 7] = te[7];
          array[offset + 8] = te[8];
          array[offset + 9] = te[9];
          array[offset + 10] = te[10];
          array[offset + 11] = te[11];
          array[offset + 12] = te[12];
          array[offset + 13] = te[13];
          array[offset + 14] = te[14];
          array[offset + 15] = te[15];
          return array;
        },
        getPosition: function () {

          var v1;
          return function () {

            if (v1 === undefined)
              v1 = new THREE.Vector3();
            console.warn(
              'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');
            var te = this.elements;
            return v1.set(te[12], te[13], te[14]);
          };
        }(),
        setPosition: function (v) {

          var te = this.elements;
          te[12] = v.x;
          te[13] = v.y;
          te[14] = v.z;
          return this;
        },
        getInverse: function (m, throwOnInvertible) {

          // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
          var te = this.elements;
          var me = m.elements;
          var n11 = me[0],
            n12 =
            me[4],
            n13 =
            me[8],
            n14 =
            me[12];
          var n21 = me[1],
            n22 =
            me[5],
            n23 =
            me[9],
            n24 =
            me[13];
          var n31 = me[2],
            n32 =
            me[6],
            n33 =
            me[10],
            n34 =
            me[14];
          var n41 = me[3],
            n42 =
            me[7],
            n43 =
            me[11],
            n44 =
            me[15];
          te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 *
            n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
          te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 *
            n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
          te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 *
            n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
          te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 +
            n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
          te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 *
            n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
          te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 *
            n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
          te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 *
            n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
          te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 -
            n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
          te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 *
            n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
          te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 *
            n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
          te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 -
            n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
          te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 +
            n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
          te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 *
            n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
          te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 *
            n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
          te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 +
            n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
          te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 -
            n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
          var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 *
            te[12];
          if (det === 0) {

            var msg =
              "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || false) {

              throw new Error(msg);
            }
            else {

              console.warn(msg);
            }

            this.identity();
            return this;
          }

          this.multiplyScalar(1 / det);
          return this;
        },
        translate: function (v) {

          console.error('THREE.Matrix4: .translate() has been removed.');
        },
        rotateX: function (angle) {

          console.error('THREE.Matrix4: .rotateX() has been removed.');
        },
        rotateY: function (angle) {

          console.error('THREE.Matrix4: .rotateY() has been removed.');
        },
        rotateZ: function (angle) {

          console.error('THREE.Matrix4: .rotateZ() has been removed.');
        },
        rotateByAxis: function (axis, angle) {

          console.error('THREE.Matrix4: .rotateByAxis() has been removed.');
        },
        scale: function (v) {

          var te = this.elements;
          var x = v.x,
            y =
            v.y,
            z =
            v.z;
          te[0] *= x;
          te[4] *= y;
          te[8] *= z;
          te[1] *= x;
          te[5] *= y;
          te[9] *= z;
          te[2] *= x;
          te[6] *= y;
          te[10] *= z;
          te[3] *= x;
          te[7] *= y;
          te[11] *= z;
          return this;
        },
        getMaxScaleOnAxis: function () {

          var te = this.elements;
          var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] *
            te[2];
          var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] *
            te[6];
          var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] *
            te[10];
          return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq,
            scaleZSq)));
        },
        makeTranslation: function (x, y, z) {

          this.set(
            1, 0, 0, x,
            0, 1, 0, y,
            0, 0, 1, z,
            0, 0, 0, 1

          );
          return this;
        },
        makeRotationX: function (theta) {

          var c = Math.cos(theta),
            s =
            Math.sin(
              theta);
          this.set(
            1, 0, 0, 0,
            0, c, -s, 0,
            0, s, c, 0,
            0, 0, 0, 1

          );
          return this;
        },
        makeRotationY: function (theta) {

          var c = Math.cos(theta),
            s =
            Math.sin(
              theta);
          this.set(
            c, 0, s, 0,
            0, 1, 0, 0, -s, 0, c, 0,
            0, 0, 0, 1

          );
          return this;
        },
        makeRotationZ: function (theta) {

          var c = Math.cos(theta),
            s =
            Math.sin(
              theta);
          this.set(
            c, -s, 0, 0,
            s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1

          );
          return this;
        },
        makeRotationAxis: function (axis, angle) {

          // Based on http://www.gamedev.net/reference/articles/article1199.asp

          var c = Math.cos(angle);
          var s = Math.sin(angle);
          var t = 1 - c;
          var x = axis.x,
            y =
            axis.y,
            z =
            axis.z;
          var tx = t * x,
            ty =
            t *
            y;
          this.set(
            tx * x + c, tx * y - s * z, tx * z + s * y, 0,
            tx * y + s * z, ty * y + c, ty * z - s * x, 0,
            tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
            0, 0, 0, 1

          );
          return this;
        },
        makeScale: function (x, y, z) {

          this.set(
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1

          );
          return this;
        },
        compose: function (position, quaternion, scale) {

          this.makeRotationFromQuaternion(quaternion);
          this.scale(scale);
          this.setPosition(position);
          return this;
        },
        decompose: function () {

          var vector,
            matrix;
          return function (position, quaternion, scale) {

            if (vector === undefined)
              vector = new THREE.Vector3();
            if (matrix === undefined)
              matrix = new THREE.Matrix4();
            var te = this.elements;
            var sx = vector.set(te[0], te[1], te[2])
              .length();
            var sy = vector.set(te[4], te[5], te[6])
              .length();
            var sz = vector.set(te[8], te[9], te[10])
              .length();
            // if determine is negative, we need to invert one scale
            var det = this.determinant();
            if (det < 0) {

              sx = -sx;
            }

            position.x = te[12];
            position.y = te[13];
            position.z = te[14];
            // scale the rotation part

            matrix.elements.set(
              this.elements); // at this point matrix is incomplete so we can't use .copy()

            var invSX = 1 / sx;
            var invSY = 1 / sy;
            var invSZ = 1 / sz;
            matrix.elements[0] *= invSX;
            matrix.elements[1] *= invSX;
            matrix.elements[2] *= invSX;
            matrix.elements[4] *= invSY;
            matrix.elements[5] *= invSY;
            matrix.elements[6] *= invSY;
            matrix.elements[8] *= invSZ;
            matrix.elements[9] *= invSZ;
            matrix.elements[10] *= invSZ;
            quaternion.setFromRotationMatrix(matrix);
            scale.x = sx;
            scale.y = sy;
            scale.z = sz;
            return this;
          };
        }(),
        makeFrustum: function (left, right, bottom, top, near, far) {

          var te = this.elements;
          var x = 2 * near / (right - left);
          var y = 2 * near / (top - bottom);
          var a = (right + left) / (right - left);
          var b = (top + bottom) / (top - bottom);
          var c = -(far + near) / (far - near);
          var d = -2 * far * near / (far - near);
          te[0] = x;
          te[4] = 0;
          te[8] = a;
          te[12] = 0;
          te[1] = 0;
          te[5] = y;
          te[9] = b;
          te[13] = 0;
          te[2] = 0;
          te[6] = 0;
          te[10] = c;
          te[14] = d;
          te[3] = 0;
          te[7] = 0;
          te[11] = -1;
          te[15] = 0;
          return this;
        },
        makePerspective: function (fov, aspect, near, far) {

          var ymax = near * Math.tan(THREE.Math.degToRad(fov * 0.5));
          var ymin = -ymax;
          var xmin = ymin * aspect;
          var xmax = ymax * aspect;
          return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);
        },
        makeOrthographic: function (left, right, top, bottom, near, far) {

          var te = this.elements;
          var w = right - left;
          var h = top - bottom;
          var p = far - near;
          var x = (right + left) / w;
          var y = (top + bottom) / h;
          var z = (far + near) / p;
          te[0] = 2 / w;
          te[4] = 0;
          te[8] = 0;
          te[12] = -x;
          te[1] = 0;
          te[5] = 2 / h;
          te[9] = 0;
          te[13] = -y;
          te[2] = 0;
          te[6] = 0;
          te[10] = -2 / p;
          te[14] = -z;
          te[3] = 0;
          te[7] = 0;
          te[11] = 0;
          te[15] = 1;
          return this;
        },
        equals: function (matrix) {

          var te = this.elements;
          var me = matrix.elements;
          for (var i = 0; i < 16; i++) {

            if (te[i] !== me[i])
              return false;
          }

          return true;
        },
        fromArray: function (array) {

          this.elements.set(array);
          return this;
        },
        toArray: function () {

          var te = this.elements;
          return [
            te[0], te[1], te[2], te[3],
            te[4], te[5], te[6], te[7],
            te[8], te[9], te[10], te[11],
            te[12], te[13], te[14], te[15]
          ];
        }

      };
      /**
       * @author alteredq / http://alteredqualia.com/
       * @author mrdoob / http://mrdoob.com/
       */

      THREE.Math = {
        generateUUID: function () {

          // http://www.broofa.com/Tools/Math.uuid.htm

          var chars =
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
              '');
          var uuid = new Array(36);
          var rnd = 0,
            r;
          return function () {

            for (var i = 0; i < 36; i++) {

              if (i === 8 || i === 13 || i === 18 || i === 23) {

                uuid[i] = '-';
              }
              else if (i === 14) {

                uuid[i] = '4';
              }
              else {

                if (rnd <= 0x02)
                  rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
              }

            }

            return uuid.join('');
          };
        }(),
        // Clamp value to range <a, b>

        clamp: function (x, a, b) {

          return (x < a) ? a : ((x > b) ? b : x);
        },
        // Clamp value to range <a, inf)

        clampBottom: function (x, a) {

          return x < a ? a : x;
        },
        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        euclideanModulo: function (n, m) {

          return ((n % m) + m) % m;
        },
        // Linear mapping from range <a1, a2> to range <b1, b2>

        mapLinear: function (x, a1, a2, b1, b2) {

          return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        },
        // http://en.wikipedia.org/wiki/Smoothstep

        smoothstep: function (x, min, max) {

          if (x <= min)
            return 0;
          if (x >= max)
            return 1;
          x = (x - min) / (max - min);
          return x * x * (3 - 2 * x);
        },
        smootherstep: function (x, min, max) {

          if (x <= min)
            return 0;
          if (x >= max)
            return 1;
          x = (x - min) / (max - min);
          return x * x * x * (x * (x * 6 - 15) + 10);
        },
        // Random float from <0, 1> with 16 bits of randomness
        // (standard Math.random() creates repetitive patterns when applied over larger space)

        random16: function () {

          return (65280 * Math.random() + 255 * Math.random()) / 65535;
        },
        // Random integer from <low, high> interval

        randInt: function (low, high) {

          return low + Math.floor(Math.random() * (high - low + 1));
        },
        // Random float from <low, high> interval

        randFloat: function (low, high) {

          return low + Math.random() * (high - low);
        },
        // Random float from <-range/2, range/2> interval

        randFloatSpread: function (range) {

          return range * (0.5 - Math.random());
        },
        degToRad: function () {

          var degreeToRadiansFactor = Math.PI / 180;
          return function (degrees) {

            return degrees * degreeToRadiansFactor;
          };
        }(),
        radToDeg: function () {

          var radianToDegreesFactor = 180 / Math.PI;
          return function (radians) {

            return radians * radianToDegreesFactor;
          };
        }(),
        isPowerOfTwo: function (value) {

          return (value & (value - 1)) === 0 && value !== 0;
        },
        nextPowerOfTwo: function (value) {

          value--;
          value |= value >> 1;
          value |= value >> 2;
          value |= value >> 4;
          value |= value >> 8;
          value |= value >> 16;
          value++;
          return value;
        }

      };
      /* jshint ignore:end */
    }
  })();

  this.objectIDs = [];
  this.objects = {};
  this.geometryCache = {};
  this.a = new THREE.Vector3();
  this.b = new THREE.Vector3();
  this.c = new THREE.Vector3();
  this.d = new THREE.Vector3();
  this.from = new THREE.Vector3();
  this.to = new THREE.Vector3();
  this.m = new THREE.Matrix4();
  this.listeners = {
    hit: []
  };
  this.ready = true;
}

Projector.prototype.addEventListener = function (evt, handler) {
  if (!this.listeners[evt]) {
    this.listeners[evt] = [];
  }
  this.listeners[evt].push(handler);
};
Projector.prototype._emit = emit;
Projector.prototype._transform = function (obj, v) {
  return v.clone()
    .applyMatrix4(
      obj.matrix);
};
// We have to transform the vertices of the geometry into world-space
// coordinations, because the object they are on could be rotated or
// positioned somewhere else.
Projector.prototype._getVerts = function (obj) {
  var trans = [];
  var geometry = this.geometryCache[obj.geomID],
    verts = geometry.vertices;
  for (var i = 0; i < verts.length; ++i) {
    trans[i] = this._transform(obj, verts[i]);
  }
  return trans;
};

Projector.prototype.setObject = function (obj) {
  this.objectIDs.push(obj.uuid);
  this.objects[obj.uuid] = obj;
  obj.matrix = new THREE.Matrix4()
    .fromArray(obj.matrix);
  var uvs = obj.geometry.uvs,
    minU = Number.MAX_VALUE,
    minV = Number.MAX_VALUE,
    maxU = Number.MIN_VALUE,
    maxV = Number.MIN_VALUE;
  if (uvs && uvs.length > 0) {
    for (var i = 0; i < uvs.length; ++i) {
      var uv = uvs[i];
      if (uv) {
        var u = uv[0],
          v = uv[1];
        minU = Math.min(minU, u);
        maxU = Math.max(maxU, u);
        minV = Math.min(minV, v);
        maxV = Math.max(maxV, v);
      }
    }
  }
  else {
    minU = 0;
    maxU = 1;
    minV = 0;
    maxV = 1;
  }

  this.setProperty(obj.uuid, "minU", minU);
  this.setProperty(obj.uuid, "maxU", maxU);
  this.setProperty(obj.uuid, "minV", minV);
  this.setProperty(obj.uuid, "maxV", maxV);
  this.setProperty(obj.uuid, "geomID", obj.geometry.uuid);
  if (!this.geometryCache[obj.geometry.uuid]) {
    this.geometryCache[obj.geometry.uuid] = obj.geometry;
    for (var n = 0, verts = obj.geometry.vertices, l = verts.length; n < l; ++n) {
      verts[n] = new THREE.Vector3()
        .fromArray(verts[n]);
    }
  }
  this.updateObjects([obj]);
};

Projector.prototype.updateObjects = function (objs) {
  for (var i = 0; i < objs.length; ++i) {
    var obj = objs[i];
    if (obj.inScene !== false) {
      var head = obj,
        curObj = this.objects[obj.uuid];
      if (obj.matrix !== null) {
        curObj.matrix.fromArray(obj.matrix);
      }
      if (obj.visible !== null) {
        this.setProperty(obj.uuid, "visible", obj.visible);
      }
      if (obj.disabled !== null) {
        this.setProperty(obj.uuid, "disabled", obj.disabled);
      }
    }
    else {
      delete this.objects[obj.uuid];
      var found = false;
      for (var j = 0; !found && j < this.objectIDs.length; ++j) {
        var obj2 = this.objects[this.objectIDs[j]];
        found = found || obj2 && obj2.geomID === obj.geomID;
      }
      if (!found) {
        delete this.geometryCache[obj.geomID];
      }
      this.objectIDs.splice(this.objectIDs.indexOf(obj.uuid), 1);
    }
  }
};

Projector.prototype.setProperty = function (objID, propName, value) {
  var obj = this.objects[objID],
    parts = propName.split(".");
  while (parts.length > 1) {
    propName = parts.shift();
    if (!obj[propName]) {
      obj[propName] = {};
    }
    obj = obj[propName];
  }
  if (parts.length === 1) {
    propName = parts[0];
    obj[parts[0]] = value;
  }
};

Projector.prototype.projectPointers = function (args) {
  var results = {};
  for (var n = 0; n < args.length; ++n) {
    var pack = args[n],
      name = pack[0],
      from = pack[1],
      to = pack[2],
      value = null;
    this.from.fromArray(from);
    this.to.fromArray(to);

    for (var i = 0; i < this.objectIDs.length; ++i) {
      var objID = this.objectIDs[i],
        obj = this.objects[objID];
      if (!obj.disabled) {
        var verts = this._getVerts(obj),
          faces = obj.geometry.faces,
          uvs = obj.geometry.uvs;

        for (var j = 0; j < faces.length; ++j) {
          var face = faces[j],
            v0 = verts[face[0] % verts.length],
            v1 = verts[face[1] % verts.length],
            v2 = verts[face[2] % verts.length];
          this.a.subVectors(v1, v0);
          this.b.subVectors(v2, v0);
          this.c.subVectors(this.to, this.from);
          this.m.set(
            this.a.x, this.b.x, -this.c.x, 0,
            this.a.y, this.b.y, -this.c.y, 0,
            this.a.z, this.b.z, -this.c.z, 0,
            0, 0, 0, 1);
          if (Math.abs(this.m.determinant()) > 1e-10) {
            this.m.getInverse(this.m);
            this.d.subVectors(this.from, v0)
              .applyMatrix4(this.m);
            if (0 <= this.d.x && this.d.x <= 1 && 0 <= this.d.y && this.d.y <= 1 && this.d.z > 0) {
              this.c.multiplyScalar(this.d.z)
                .add(this.from);
              var dist = Math.sign(this.d.z) * this.to.distanceTo(this.c);
              if (!value || dist < value.distance) {
                value = {
                  name: name,
                  objectID: objID,
                  distance: dist,
                  faceIndex: j,
                  facePoint: this.c.toArray(),
                  faceNormal: this.d.toArray()
                };

                if (uvs) {
                  v0 = uvs[face[0] % uvs.length];
                  v1 = uvs[face[1] % uvs.length];
                  v2 = uvs[face[2] % uvs.length];
                  var u = this.d.x * (v1[0] - v0[0]) + this.d.y * (v2[0] - v0[0]) + v0[0],
                    v = this.d.x * (v1[1] - v0[1]) + this.d.y * (v2[1] - v0[1]) + v0[1];
                  if (obj.minU <= u && u <= obj.maxU && obj.minV <= v && v < obj.maxV) {
                    value.point = [u, v];
                  }
                  else {
                    value = null;
                  }
                }
              }
            }
          }
        }
      }
    }
    if (value) {
      results[name] = value;
    }
  }
  this._emit("hit", results);
};
return Projector;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "Random",
  description: "Functions for handling random numbers of different criteria, or selecting random elements of arrays."
});
const Random = {};
return Random;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.SKINS = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "SKINS",
  type: "Array of String",
  description: "A selection of color values that closely match skin colors of people."
});
const SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
  "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
  "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
  "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
  "#5B0001", "#302E2E"
];
return SKINS;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.SKINS_VALUES = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  name: "SKIN_VALUES",
  type: "Array of Number",
  description: "A selection of color values that closely match skin colors of people."
});
const SKINS_VALUES = Primrose.SKINS.map(function (s) {
  return parseInt(s.substring(1), 16);
});
return SKINS_VALUES;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.SYS_FONTS = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  parent: "Primrose",
  name: "SYS_FONTS",
  type: "String",
  description: "A selection of fonts that will match whatever the user's operating system normally uses."
});
const SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
return SYS_FONTS;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Surface = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose",
    name: "Surface",
    description: "Cascades through a number of options to eventually return a CanvasRenderingContext2D object on which one will perform drawing operations.",
    baseClass: "Primrose.Entity",
    parameters: [{
      name: "options.id",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options.bounds",
      type: "Primrose.Text.Rectangle",
      description: "The size and location of the surface to create."
    }]
});
class Surface extends Primrose.Entity {

  static create() {
    return new Surface();
  }

  constructor(options) {
    super();
    this.options = patch(options, {
      id: "Primrose.Surface[" + (COUNTER++) + "]",
      bounds: new Primrose.Text.Rectangle()
    });
    this.listeners.move = [];
    this.bounds = this.options.bounds;
    this.canvas = null;
    this.context = null;
    this._opacity = 1;

    this.style = {};

    Object.defineProperties(this.style, {
      width: {
        get: () => {
          return this.bounds.width;
        },
        set: (v) => {
          this.bounds.width = v;
          this.resize();
        }
      },
      height: {
        get: () => {
          return this.bounds.height;
        },
        set: (v) => {
          this.bounds.height = v;
          this.resize();
        }
      },
      left: {
        get: () => {
          return this.bounds.left;
        },
        set: (v) => {
          this.bounds.left = v;
        }
      },
      top: {
        get: () => {
          return this.bounds.top;
        },
        set: (v) => {
          this.bounds.top = v;
        }
      },
      opacity: {
        get: () => {
          return this._opacity;
        },
        set: (v) => {
          this._opacity = v;
        }
      },
      fontSize: {
        get: () => {
          return this.fontSize;
        },
        set: (v) => {
          this.fontSize = v;
        }
      },
      backgroundColor: {
        get: () => {
          return this.backgroundColor;
        },
        set: (v) => {
          this.backgroundColor = v;
        }
      },
      color: {
        get: () => {
          return this.color;
        },
        set: (v) => {
          this.color = v;
        }
      }
    });


    if (this.options.id instanceof Surface) {
      throw new Error("Object is already a Surface. Please don't try to wrap them.");
    }
    else if (this.options.id instanceof CanvasRenderingContext2D) {
      this.context = this.options.id;
      this.canvas = this.context.canvas;
    }
    else if (this.options.id instanceof HTMLCanvasElement) {
      this.canvas = this.options.id;
    }
    else if (typeof (this.options.id) === "string" || this.options.id instanceof String) {
      this.canvas = document.getElementById(this.options.id);
      if (this.canvas === null) {
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.options.id;
      }
      else if (this.canvas.tagName !== "CANVAS") {
        this.canvas = null;
      }
    }

    if (this.canvas === null) {
      pliny.error({
        name: "Invalid element",
        type: "Error",
        description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."
      });
      console.error(typeof (this.options.id));
      console.error(this.options.id);
      throw new Error(this.options.id + " does not refer to a valid canvas element.");
    }

    this.id = this.canvas.id;

    if (this.bounds.width === 0) {
      this.bounds.width = this.imageWidth;
      this.bounds.height = this.imageHeight;
    }

    this.imageWidth = this.bounds.width;
    this.imageHeight = this.bounds.height;

    if (this.context === null) {
      this.context = this.canvas.getContext("2d");
    }

    this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
    this.context.imageSmoothingEnabled = false;
    this.context.textBaseline = "top";

    this._texture = null;
    this._material = null;
  }

  addToBrowserEnvironment(env, scene) {
    var geom = this.className === "shell" ? shell(3, 10, 10) : quad(2, 2),
      mesh = textured(geom, this, {
        opacity: this._opacity
      });
    scene.add(mesh);
    env.registerPickableObject(mesh);
    return mesh;
  }

  invalidate(bounds) {
    var useDefault = !bounds;
    if (!bounds) {
      bounds = this.bounds.clone();
      bounds.left = 0;
      bounds.top = 0;
    }
    else if (bounds instanceof Primrose.Text.Rectangle) {
      bounds = bounds.clone();
    }
    for (var i = 0; i < this.children.length; ++i) {
      var child = this.children[i],
        overlap = bounds.overlap(child.bounds);
      if (overlap) {
        var x = overlap.left - child.bounds.left,
          y = overlap.top - child.bounds.top;
        this.context.drawImage(
          child.canvas,
          x, y, overlap.width, overlap.height,
          overlap.x, overlap.y, overlap.width, overlap.height);
      }
    }
    if (this._texture) {
      this._texture.needsUpdate = true;
    }
    if (this._material) {
      this._material.needsUpdate = true;
    }
    if (this.parent && this.parent.invalidate) {
      bounds.left += this.bounds.left;
      bounds.top += this.bounds.top;
      this.parent.invalidate(bounds);
    }
  }

  render() {
    this.invalidate();
  }

  get imageWidth() {
    return this.canvas.width;
  }

  set imageWidth(v) {
    this.canvas.width = v;
    this.bounds.width = v;
  }

  get imageHeight() {
    return this.canvas.height;
  }

  set imageHeight(v) {
    this.canvas.height = v;
    this.bounds.height = v;
  }

  get elementWidth() {
    return this.canvas.clientWidth * devicePixelRatio;
  }

  set elementWidth(v) {
    this.canvas.style.width = (v / devicePixelRatio) + "px";
  }

  get elementHeight() {
    return this.canvas.clientHeight * devicePixelRatio;
  }

  set elementHeight(v) {
    this.canvas.style.height = (v / devicePixelRatio) + "px";
  }

  get surfaceWidth() {
    return this.canvas.parentElement ? this.elementWidth : this.bounds.width;
  }

  get surfaceHeight() {
    return this.canvas.parentElement ? this.elementHeight : this.bounds.height;
  }

  get resized() {
    return this.imageWidth !== this.surfaceWidth ||
      this.imageHeight !== this.surfaceHeight;
  }

  resize() {
    this.setSize(this.surfaceWidth, this.surfaceHeight);
  }

  setSize(width, height) {
    const oldTextBaseline = this.context.textBaseline,
      oldTextAlign = this.context.textAlign;
    this.imageWidth = width;
    this.imageHeight = height;

    this.context.textBaseline = oldTextBaseline;
    this.context.textAlign = oldTextAlign;
  }

  get texture() {
    if (!this._texture) {
      this._texture = new THREE.Texture(this.canvas);
    }
    return this._texture;
  }

  appendChild(child) {
    if (!(child instanceof Surface)) {
      throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
    }
    super.appendChild(child);
    this.invalidate();
  }

  mapUV(point) {
    return {
      x: point[0] * this.imageWidth,
      y: (1 - point[1]) * this.imageHeight
    };
  }

  unmapUV(point) {
    return [point.x / this.imageWidth, (1 - point.y / this.imageHeight)];
  }

  _findChild(x, y, thunk) {
    var here = this.inBounds(x, y),
      found = null;
    for (var i = this.children.length - 1; i >= 0; --i) {
      var child = this.children[i];
      if (!found && child.inBounds(x - this.bounds.left, y - this.bounds.top)) {
        found = child;
      }
      else if (child.focused) {
        child.blur();
      }
    }
    return found || here && this;
  }

  DOMInBounds(x, y) {
    return this.inBounds(x * devicePixelRatio, y * devicePixelRatio);
  }

  UVInBounds(point) {
    return this.inBounds(point[0] * this.imageWidth, (1 - point[1]) * this.imageHeight);
  }

  inBounds(x, y) {
    return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
  }

  startDOMPointer(evt) {
    this.startPointer(x * devicePixelRatio, y * devicePixelRatio);
  }

  moveDOMPointer(evt) {
    this.movePointer(x * devicePixelRatio, y * devicePixelRatio);
  }

  startPointer(x, y) {
    if (this.inBounds(x, y)) {
      var target = this._findChild(x, y, (child, x2, y2) => child.startPointer(x2, y2));
      if (target) {
        if (!this.focused) {
          this.focus();
        }
        emit.call(this, "click", {
          target,
          x,
          y
        });
        if (target !== this) {
          target.startPointer(x - this.bounds.left, y - this.bounds.top);
        }
      }
      else if (this.focused) {
        this.blur();
      }
    }
  }

  movePointer(x, y) {
    var target = this._findChild(x, y, (child, x2, y2) => child.startPointer(x2, y2));
    if (target) {
      emit.call(this, "move", {
        target,
        x,
        y
      });
      if (target !== this) {
        target.movePointer(x - this.bounds.left, y - this.bounds.top);
      }
    }
  }

  startUV(point) {
    var p = this.mapUV(point);
    this.startPointer(p.x, p.y);
  }

  moveUV(point) {
    var p = this.mapUV(point);
    this.movePointer(p.x, p.y);
  }
}
return Surface;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "Text",
  description: "The Text namespace contains classes everything regarding the Primrose source code editor."
});
const Text = {};
return Text;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.WebRTCSocket = factory();
  }
}(this, function() {
"use strict";

/* polyfills */
window.RTCPeerConnection =
  window.RTCPeerConnection ||
  window.webkitRTCPeerConnection ||
  window.mozRTCPeerConnection;

window.RTCIceCandidate =
  window.RTCIceCandidate ||
  window.mozRTCIceCandidate;

window.RTCSessionDescription =
  window.RTCSessionDescription ||
  window.mozRTCSessionDescription;

// some useful information:
// - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
// - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
// - https://github.com/coturn/rfc5766-turn-server/
let ICE_SERVERS = [{
  url: "stun:stun.l.google.com:19302"
}, {
  url: "stun:stun1.l.google.com:19302"
}, {
  url: "stun:stun2.l.google.com:19302"
}, {
  url: "stun:stun3.l.google.com:19302"
}, {
  url: "stun:stun4.l.google.com:19302"
}];

let INSTANCE_COUNT = 0;

function formatTime(t) {
  var ms = t.getMilliseconds()
    .toString();
  while (ms.length < 3) {
    ms = "0" + ms;
  }
  return t.toLocaleTimeString()
    .replace(/(\d+:\d+:\d+)/, (_, g) => g + "." + ms);
}

pliny.class({
  parent: "Primrose",
    name: "WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{
      name: "extraIceServers",
      type: "Array",
      description: "A collection of ICE servers to use on top of the default Google STUN servers."
    }, {
      name: "proxyServer",
      type: "WebSocket",
      description: "A connection over which to negotiate the peering."
    }, {
      name: "fromUserName",
      type: "String",
      description: "The name of the local user, from which the peering is being initiated."
    }, {
      name: "fromUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is performing the peering operation."
    }, {
      name: "toUserName",
      type: "String",
      description: "The name of the remote user, to which the peering is being requested."
    }, {
      name: "toUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is receiving the peering operation."
    }]
});
class WebRTCSocket {
  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  constructor(extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {

    // These logging constructs are basically off by default, but you will need them if you ever
    // need to debug the WebRTC workflow.
    let attemptCount = 0;
    const MAX_LOG_LEVEL = 0,
      instanceNumber = ++INSTANCE_COUNT,
      print = function (name, level, format) {
        if (level < MAX_LOG_LEVEL) {
          var t = new Date();
          const args = [
            "[%s:%s %s] " + format,
            INSTANCE_COUNT,
            instanceNumber,
            formatTime(t)
          ];
          for (var i = 3; i < arguments.length; ++i) {
            args.push(arguments[i]);
          }
          console[name].apply(console, args);
        }
        return arguments[3];
      };

    this._log = print.bind(null, "log");
    this._error = print.bind(null, "error", 0);

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "proxyServer",
      type: "WebSocket",
      description: "The connection over which to negotiate the peering."
    });
    Object.defineProperty(this, "proxyServer", {
      get: () => proxyServer
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "fromUserName",
      type: "String",
      description: "The name of the local user."
    });
    Object.defineProperty(this, "fromUserName", {
      get: () => fromUserName
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "fromUserIndex",
      type: "Number",
      description: "The index of the local user's current device."
    });
    Object.defineProperty(this, "fromUserIndex", {
      get: () => fromUserIndex
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "toUserName",
      type: "String",
      description: "The name of the remote user."
    });
    Object.defineProperty(this, "toUserName", {
      get: () => toUserName
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "toUserIndex",
      type: "Number",
      description: "The index of the remote user's current device."
    });
    Object.defineProperty(this, "toUserIndex", {
      get: () => toUserIndex
    });

    var iceServers = ICE_SERVERS.concat(extraIceServers);
    if (isFirefox) {
      iceServers = [{
        urls: iceServers.map((s) => s.url)
      }];
    }

    this._log(1, iceServers);

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "rtc",
      type: "RTCPeerConnection",
      description: "The raw RTCPeerConnection that got negotiated."
    });
    const rtc = new RTCPeerConnection({
      // Indicate to the API what servers should be used to figure out NAT traversal.
      iceServers
    });
    Object.defineProperty(this, "rtc", {
      get: () => rtc
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "progress",
      type: "WebSocket",
      description: "The connection over which to negotiate the peering."
    });
    const progress = {
      offer: {
        created: false,
        received: false
      },
      answer: {
        created: false,
        recieved: false
      }
    };
    Object.defineProperty(this, "progress", {
      get: () => progress
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "goFirst",
      type: "Boolean",
      description: "We don't want the ICE candidates, offers, and answers clashing in the middle, so we need to be careful about order of operations. Users already in the room will initiate peer connections with users that are just joining."
    });
    Object.defineProperty(this, "goFirst", {
      get: () => !goSecond
    });

    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", this.close.bind(this));

    // This is where things get gnarly
    this.ready = new Promise((resolve, reject) => {

      const done = () => {
        this._log(2, "Tearing down event handlers");
        this.proxyServer.off("peer", onUser);
        this.proxyServer.off("offer", onOffer);
        this.proxyServer.off("ice", onIce);
        this.proxyServer.off("answer", descriptionReceived);
        this.rtc.onsignalingstatechange = null;
        this.rtc.oniceconnectionstatechange = null;
        this.rtc.onnegotiationneeded = null;
        this.rtc.onicecandidate = null;

        this.teardown();
      }

      // A pass-through function to include in the promise stream to see if the channels have all been
      // set up correctly and ready to go.
      const check = (obj) => {
        if (this.complete) {
          done();
          resolve();
        }
        return obj;
      };

      // When an offer or an answer is received, it's pretty much the same exact processing. Either
      // type of object gets checked to see if it was expected, then unwrapped.
      const descriptionReceived = (description) => {
        this._log(1, "description", description);
        // Check to see if we expected this sort of message from this user.
        if (this.isExpected(description.item.type, description)) {

          this.recordProgress(description.item, "received");

          // The description we received is always the remote description, regardless of whether or not it's an offer
          // or an answer.
          return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

          // check to see if we're done.
          .then(check)

          // and if there are any errors, bomb out and shut everything down.
          .catch(onError);
        }
      };

      // When an offer or an answer is created, it's pretty much the same exact processing. Either type
      // of object gets wrapped with a context identifying which peer channel is being negotiated, and
      // then transmitted through the negotiation server to the remote user.
      const descriptionCreated = (description) => {
        this.recordProgress(description, "created");

        // The description we create is always the local description, regardless of whether or not it's an offer
        // or an answer.
        return this.rtc.setLocalDescription(description)

        // Let the remote user know what happened.
        .then(() => this.proxyServer.emit(description.type, this.wrap(description)))

        // check to see if we're done.
        .then(check)

        // and if there are any errors, bomb out and shut everything down.
        .catch(onError);
      };

      // A catch-all error handler to shut down the world if an error we couldn't handle happens.
      const onError = (exp) => {
        this._error(exp);
        done();
        reject(exp);
      };

      // When an offer is received, we need to create an answer in reply.
      const onOffer = (offer) => {
        this._log(1, "offer", offer);
        var promise = descriptionReceived(offer);
        if (promise) {
          return promise.then(() => this.rtc.createAnswer())
            .then(descriptionCreated);
        }
      };

      // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
      // with enough information for the remote user to be able to connect to it.
      const onIce = (ice) => {
        this._log(1, "ice", ice);
        // Check to see if we expected this sort of message from this user.
        if (this.isExpected("ice", ice)) {
          // And if so, store it in our database of possibilities.
          var candidate = new RTCIceCandidate(ice.item);
          return this.rtc.addIceCandidate(candidate)
            .catch(this._error);
        }
      };

      // This really long event handler is not really the start of the process. Skip ahead to `proxyServer.on("user", onUser)`
      const onUser = (evt) => {
        // When a user is joining a room with more than one user currently, already in the room, they will have to
        // make several connection in sequence. The Socket.IO event handlers don't seem to reliably turn off, so
        // we have to make sure the message we here is the one meant for this particular instance of the socket manager.
        if (this.isExpected("new user", evt)) {

          // When an answer is recieved, it's much simpler than receiving an offer. We just mark the progress and
          // check to see if we're done.
          this.proxyServer.on("answer", descriptionReceived);
          this.proxyServer.on("offer", onOffer);
          this.proxyServer.on("ice", onIce);

          // This is just for debugging purposes.
          this.rtc.onsignalingstatechange = (evt) => this._log(1, "[%s] Signal State: %s", instanceNumber, this.rtc.signalingState);
          this.rtc.oniceconnectionstatechange = (evt) => this._log(1, "[%s] ICE Connection/Gathering State: %s/%s", instanceNumber, this.rtc.iceConnectionState, this.rtc.iceGatheringState);

          // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
          // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
          // you that negotiation is necessary, and only then create the offer. There is a race-condition between
          // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
          // don't wait for the appropriate time.
          this.rtc.onnegotiationneeded = (evt) => this.createOffer()
            // record the local description.
            .then(descriptionCreated);

          // The API is going to figure out end-point configurations for us by communicating with the STUN servers
          // and seeing which end-points are visible and which require network address translation.
          this.rtc.onicecandidate = (evt) => {

            // There is an error condition where sometimes the candidate returned in this event handler will be null.
            if (evt.candidate) {

              // Then let the remote user know of our folly.
              this.proxyServer.emit("ice", this.wrap(evt.candidate));
            }
          };

          this.issueRequest();
        }
      };

      // We need to do two things, wait for the remote user to indicate they would like to peer, and...
      this.proxyServer.on("peer", onUser);

      // ... let the server know to inform the remote user that we would like to peer. We need to delay a little
      // bit because it takes the remote user a little time between logging in and being ready to receive messages.
      setTimeout(() => this.proxyServer.emit("peer", this.wrap()), 250);

      // Okay, now go back to onUser
    });
  }

  createOffer() {
    return this.rtc.createOffer();
  }

  recordProgress(description, method) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "recordProgress",
      description: "mark that we made progress towards our goals.",
      parameters: [{
        name: "description",
        type: "RTCSessionDescription",
        description: "An answer or offer object."
      }, {
        name: "method",
        type: "String",
        description: "Whether or not the description had been 'created' or 'received' here."
      }]
    });
    this.progress[description.type][method] = true;
  }

  wrap(item) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "wrap",
      returns: "Object",
      description: "Provides the context into a message so that the remote user can tell if the message `this.isExpected()`",
      parameters: [{
        name: "item",
        type: "Object",
        description: "The object to wrap."
      }]
    });
    return {
      fromUserName: this.fromUserName,
      fromUserIndex: this.fromUserIndex,
      toUserName: this.toUserName,
      toUserIndex: this.toUserIndex,
      item: item
    };
  }

  isExpected(tag, obj) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "isExpected",
      returns: "Boolean",
      description: "A test to see if we were expecting a particular message. Sometimes the messages get criss-crossed on the negotiation server, and this just makes sure we don't cause an error.",
      parameters: [{
        name: "tag",
        type: "String",
        description: "A name for the operation being tested."
      }, {
        name: "obj",
        type: "Object",
        description: "The object within the operating being tested."
      }]
    });

    const incomplete = !this.complete,
      fromUser = obj.fromUserName === this.toUserName,
      fromIndex = obj.fromUserIndex === this.toUserIndex,
      toUser = obj.toUserName === this.fromUserName,
      toIndex = obj.toUserIndex === this.fromUserIndex,
      isExpected = incomplete && fromUser && fromIndex && toUser && toIndex;

    this._log(1, "[%s->%s] I %s || FROM %s==%s (%s), %s==%s (%s) || TO %s==%s (%s), %s==%s (%s)",
      tag, isExpected,
      incomplete,
      obj.fromUserName, this.toUserName, fromUser,
      obj.fromUserIndex, this.toUserIndex, fromIndex,
      obj.toUserName, this.fromUserName, toUser,
      obj.toUserIndex, this.fromUserIndex, toIndex);
    this._log(2, obj);
    return isExpected;
  }

  close() {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "close",
      description: "shut down the peer connection, if it was succesful in being created."
    });
    if (this.rtc.signalingState !== "closed") {
      this.rtc.close();
    }
  }

  teardown() {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "teardown",
      description: "Whether ending succesfully or failing, the processing is mostly the same: teardown all the event handlers."
    });

    throw new Error("Not implemented.");
  }

  get complete() {
    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "complete",
      returns: "Boolean",
      description: "Override this method in subClasses to indicate when the peering process is complete. The peering process is complete when all offers are answered."
    });

    return !this.rtc || this.rtc.signalingState === "closed";
  }

  issueRequest() {
    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "issueRequest",
      description: "Override this method in subClasses to trigger the peering process."
    });

    throw new Error("Not implemented");
  }
}
return WebRTCSocket;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Workerize = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose",
    name: "Workerize",
    description: "Builds a WebWorker thread out of a JavaScript class's source code, and attempts to create a message interface that matches the message-passing interface that the class already uses.\n\
\n\
Automatically workerized classes should have methods that take a single array for any parameters and return no values. All return results should come through an Event that the class emits.",
    parameters: [{
      name: "func",
      type: "Function",
      description: "The class function to workerize"
    }],
    examples: [{
      name: "Create a basic workerized class.",
      description: "Classes in JavaScript are created by adding new functions to the `prototype` of another function, then instantiating objects from that class with `new`. When creating such a class for automatic workerization, a few restrictions are required:\n\
* All methods in the class must be on the prototype. Any methods created and assigned in the constructor will not be available to the message passing interface.\n\
* All interaction with objects of the class must be through these publicly accessible methods. This includes initialization.\n\
* All methods should take at most a single argument. If you need multiple arguments, pack them into an array.\n\
* The methods cannot return any values. If a value must be returned to the calling context, it must be done through an event callback.\n\
* The class must assign handlers to events through an addEventListener method that mirrors the standard interface used in DOM. Workerize will not respect the 3rd `bubbles` parameter that is so often omitted when programming against DOM.\n\
\n\
Assuming the following class:\n\
\n\
  grammar(\"JavaScript\");\n\
  function MyClass(){\n\
    this.listeners = {\n\
      complete: []\n\
    };\n\
    this.objects = [];\n\
  }\n\
\n\
  MyClass.prototype.addEventListener = function(evt, handler){\n\
    if(this.listeners[evt]){\n\
      this.listeners[evt].push(handler);\n\
    }\n\
  };\n\
\n\
  MyClass.prototype.addObject = function(obj){\n\
    this.objects.push(obj);\n\
  };\n\
\n\
  MyClass.prototype.update = function(dt){\n\
    // we can make essentially arbitrarily small timeslice updates\n\
    var SLICE = 0.1;\n\
    for(var ddt = 0; ddt < dt; ddt += SLICE){\n\
      for(var i = 0; i < this.objects.length; ++i){\n\
        var o = this.objects[i];\n\
        o.x += o.vx * SLICE;\n\
        o.y += o.vy * SLICE;\n\
        o.z += o.vz * SLICE;\n\
      }\n\
    }\n\
    // prepare our return state for the UI thread.\n\
    var returnValue = [];\n\
    for(var i = 0; i < this.objects.length; ++i){\n\
      returnValue.push([o.x, o.y, o.z]);\n\
    }\n\
    // and emit the event to all of the listeners.\n\
    for(var i = 0; i < this.listeners.complete.length; ++i){\n\
      this.listeners.complete[i](returnValue);\n\
    }\n\
  };\n\
\n\
Then we can create and use an automatically workerized version of it as follows.\n\
\n\
  grammar(\"JavaScript\");\n\
  var phys = new Primrose.Workerize(MyClass);\n\
  // we keep a local copy of the state so we can perform other operations on it.\n\
  var objects = [];\n\
  for(var i = 0; i < 10; ++i){\n\
    var obj = {\n\
      // random values between -1 and 1\n\
      x: 2 * Math.random() - 1,\n\
      y: 2 * Math.random() - 1,\n\
      z: 2 * Math.random() - 1,\n\
      vx: 2 * Math.random() - 1,\n\
      vy: 2 * Math.random() - 1,\n\
      vz: 2 * Math.random() - 1\n\
    };\n\
    objects.push(obj);\n\
    phys.addObject(obj);\n\
  }\n\
  \n\
  // this flag lets us keep track of whether or not we know that the worker is in the middle of an expensive operation.\n\
  phys.ready = true;\n\
  phys.addEventListener(\"complete\", function(newPositions){\n\
    // We update the state in the UI thread with the expensively-computed values.\n\
    for(var i = 0; i < newPositions.length; ++i){\n\
      objects[i].x = newPositions[i][0];\n\
      objects[i].y = newPositions[i][1];\n\
      objects[i].z = newPositions[i][2];\n\
    }\n\
    phys.ready = true;\n\
  });\n\
  \n\
  var lt = null;\n\
  function paint(t){\n\
    requestAnimationFrame(paint);\n\
    if(lt === undefined || lt === null){\n\
      lt = t;\n\
    } else {\n\
      var dt = t - lt;\n\
      if(phys.ready){\n\
        phys.ready = false;\n\
        phys.update(dt);\n\
        lt = t;\n\
      }\n\
      for(var i = 0; i < objects.length; ++i){\n\
        var o = objects[i];\n\
        // We can even perform a much cheaper position update to smooth over the blips in the expensive update on the worker thread.\n\
        drawObjectAt(o.x + o.vx * dt, o.y + o.vy * dt, o.z + o.vz * dt);\n\
      }\n\
    }\n\
  }\n\
  requestAnimationFrame(paint);"
    }]
});

function Workerize(func) {
  // First, rebuild the script that defines the class. Since we're dealing
  // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
  // a conversion at a point post-script reconstruction, pre-workerization.

  // start with the constructor function
  var script = func.toString(),
    // strip out the name in a way that Internet Explorer also undrestands
    // (IE doesn't have the Function.name property supported by Chrome and
    // Firefox)
    matches = script.match(/function\s+(\w+)\s*\(/),
    name = matches[1],
    k;

  // then rebuild the member methods
  for (k in func.prototype) {
    // We preserve some formatting so it's easy to read the code in the debug
    // view. Yes, you'll be able to see the generated code in your browser's
    // debugger.
    script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
  }

  // Automatically instantiate an object out of the class inside the worker,
  // in such a way that the user-defined function won't be able to get to it.
  script += "\n\n(function(){\n  var instance = new " + name + "(true);";

  // Create a mapper from the events that the class defines to the worker-side
  // postMessage method, to send message to the UI thread that one of the
  // events occured.
  script += "\n  if(instance.addEventListener){\n" +
    "    self.args = [null, null];\n" +
    "    for(var k in instance.listeners) {\n" +
    "      instance.addEventListener(k, function(eventName, args){\n" +
    "        self.args[0] = eventName;\n" +
    "        self.args[1] = args;\n" +
    "        postMessage(self.args);\n" +
    "      }.bind(this, k));\n" +
    "    }\n" +
    "  }";

  // Create a mapper from the worker-side onmessage event, to receive messages
  // from the UI thread that methods were called on the object.
  script += "\n\n  onmessage = function(evt){\n" +
    "    var f = evt.data[0],\n" +
    "        t = instance[f];\n" +
    "    if(t){\n" +
    "      t.call(instance, evt.data[1]);\n" +
    "    }\n" +
    "  };\n\n" +
    "})();";

  // The binary-large-object can be used to convert the script from text to a
  // data URI, because workers can only be created from same-origin URIs.
  pliny.property({
    name: "worker",
    type: "WebWorker",
    description: "The worker thread containing our class."
  });
  this.worker = Workerize.createWorker(script, false);

  pliny.property({
    name: "args",
    type: "Array",
    description: "Static allocation of an array to save on memory usage when piping commands to a worker."
  });
  this.args = [null, null];

  // create a mapper from the UI-thread side onmessage event, to receive
  // messages from the worker thread that events occured and pass them on to
  // the UI thread.
  pliny.property({
    name: "listeners",
    type: "Object",
    description: "A bag of arrays of callbacks for each of the class' events."
  });
  this.listeners = {};

  this.worker.onmessage = (e) => emit.call(this, e.data[0], e.data[1]);

  // create mappers from the UI-thread side method calls to the UI-thread side
  // postMessage method, to inform the worker thread that methods were called,
  // with parameters.
  pliny.property({
    name: "&lt;mappings for each method in the original class&gt;",
    type: "Function",
    description: "Each mapped function causes a message to be posted to the worker thread with its arguments packed into an array."
  });
  for (k in func.prototype) {
    // we skip the addEventListener method because we override it in a
    // different way, to be able to pass messages across the thread boundary.
    if (k !== "addEventListener" && k[0] !== '_') {
      // make the name of the function the first argument, no matter what.
      this[k] = this.methodShim.bind(this, k);
    }
  }

  this.ready = true;
}

pliny.method({
  parent: "Primrose.Workerize",
  name: "methodShim",
  description: "Posts messages to the worker thread by packing arguments into an array. The worker will receive the array and interpret the first value as the name of the method to invoke and the second value as another array of parameters.",
  parameters: [{
    name: "methodName",
    type: "String",
    description: "The method inside the worker context that we want to invoke."
  }, {
    name: "args",
    type: "Array",
    description: "The arguments that we want to pass to the method that we are calling in the worker context."
  }]
});
Workerize.prototype.methodShim = function (eventName, args) {
  this.args[0] = eventName;
  this.args[1] = args;
  this.worker.postMessage(this.args);
};

pliny.method({
  parent: "Primrose.Workerize",
  name: "addEventListener",
  description: "Adding an event listener just registers a function as being ready to receive events, it doesn't do anything with the worker thread yet.",
  parameters: [{
    name: "evt",
    type: "String",
    description: "The name of the event for which we are listening."
  }, {
    name: "thunk",
    type: "Function",
    description: "The callback to fire when the event occurs."
  }]
});
Workerize.prototype.addEventListener = function (evt, thunk) {
  if (!this.listeners[evt]) {
    this.listeners[evt] = [];
  }
  this.listeners[evt].push(thunk);
};


pliny.function({
  parent: "Primrose.Workerize",
  name: "createWorker",
  description: "A static function that loads Plain Ol' JavaScript Functions into a WebWorker.",
  parameters: [{
    name: "script",
    type: "(String|Function)",
    description: "A String defining a script, or a Function that can be toString()'d to get it's script."
  }, {
    name: "stripFunc",
    type: "Boolean",
    description: "Set to true if you want the function to strip the surround function block scope from the script."
  }],
  returns: "The WebWorker object."
});
Workerize.createWorker = function (script, stripFunc) {
  if (typeof script === "function") {
    script = script.toString();
  }

  if (stripFunc) {
    script = script.trim();
    var start = script.indexOf('{');
    script = script.substring(start + 1, script.length - 1);
  }

  var blob = new Blob([script], {
      type: "text/javascript"
    }),
    dataURI = URL.createObjectURL(blob);

  return new Worker(dataURI);
};
return Workerize;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.X = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose",
  name: "X",
  description: "Extensions and components that combine other Primrose elements."
});
const X = {};
return X;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.AbstractLabel = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose.Controls",
    name: "Label",
    description: "A simple label of text to put on a Surface.",
    baseClass: "Primrose.Surface",
    parameters: [{
      name: "idOrCanvasOrContext",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Button."
    }]
});
class AbstractLabel extends Primrose.Surface {
  constructor(options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////
    super(patch(options, {
      id: "Primrose.Controls.AbstractLabel[" + (COUNTER++) + "]"
    }));

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    this._lastFont = null;
    this._lastText = null;
    this._lastCharacterWidth = null;
    this._lastCharacterHeight = null;
    this._lastPadding = null;
    this._lastWidth = -1;
    this._lastHeight = -1;
    this._lastTextAlign = null;

    this.textAlign = this.options.textAlign;
    this.character = new Primrose.Text.Size();
    this.theme = this.options.theme;
    this.fontSize = this.options.fontSize || 16;
    this.refreshCharacter();
    this.backgroundColor = this.options.backgroundColor || this.theme.regular.backColor;
    this.color = this.options.color || this.theme.regular.foreColor;
    this.value = this.options.value;
  }

  get textAlign() {
    return this.context.textAlign;
  }

  set textAlign(v) {
    this.context.textAlign = v;
    this.render();
  }

  get value() {
    return this._value;
  }

  set value(txt) {
    txt = txt || "";
    this._value = txt.replace(/\r\n/g, "\n");
    this.render();
  }

  get theme() {
    return this._theme;
  }

  set theme(t) {
    this._theme = clone(t || Primrose.Text.Themes.Default);
    this._theme.fontSize = this.fontSize;
    this.refreshCharacter();
    this.render();
  }

  refreshCharacter() {
    this.character.height = this.fontSize;
    this.context.font = this.character.height + "px " + this.theme.fontFamily;
    // measure 100 letter M's, then divide by 100, to get the width of an M
    // to two decimal places on systems that return integer values from
    // measureText.
    this.character.width = this.context.measureText(
        "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
      .width /
      100;
  }

  _isChanged() {
    var textChanged = this._lastText !== this.value,
      characterWidthChanged = this.character.width !== this._lastCharacterWidth,
      characterHeightChanged = this.character.height !== this._lastCharacterHeight,
      fontChanged = this.context.font !== this._lastFont,
      alignChanged = this.textAlign !== this._lastTextAlign,
      changed = this.resized || textChanged || characterWidthChanged || characterHeightChanged || this.resized || fontChanged || alignChanged;
    return changed;
  }

  render() {
    if (this.resized) {
      this.resize();
    }

    if (this.theme && this._isChanged) {
      this._lastText = this.value;
      this._lastCharacterWidth = this.character.width;
      this._lastCharacterHeight = this.character.height;
      this._lastWidth = this.imageWidth;
      this._lastHeight = this.imageHeight;
      this._lastFont = this.context.font;
      this._lastTextAlign = this.textAlign;

      this.context.textAlign = this.textAlign || "left";

      var clearFunc = this.backgroundColor ? "fillRect" : "clearRect";
      if (this.theme.regular.backColor) {
        this.context.fillStyle = this.backgroundColor;
      }

      this.context[clearFunc](0, 0, this.imageWidth, this.imageHeight);

      if (this.value) {
        var lines = this.value.split("\n");
        for (var y = 0; y < lines.length; ++y) {
          var line = lines[y],
            textY = (this.imageHeight - lines.length * this.character.height) / 2 + y * this.character.height;

          var textX = null;
          switch (this.textAlign) {
            case "right":
              textX = this.imageWidth;
              break;
            case "center":
              textX = this.imageWidth / 2;
              break;
            default:
              textX = 0;
          }

          var font = (this.theme.regular.fontWeight || "") +
            " " + (this.theme.regular.fontStyle || "") +
            " " + this.character.height + "px " + this.theme.fontFamily;
          this.context.font = font.trim();
          this.context.fillStyle = this.color;
          this.context.fillText(line, textX, textY);
        }
      }

      this.renderCanvasTrim();

      this.invalidate();
    }
  }

  renderCanvasTrim() {}
}
return AbstractLabel;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.Button2D = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose.Controls",
    name: "Button2D",
    description: "A simple button to put on a Surface.",
    baseClass: "Primrose.Controls.AbstractLabel",
    parameters: [{
      name: "idOrCanvasOrContext",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Button."
    }]
});
class Button2D extends Primrose.Controls.AbstractLabel {

  static create() {
    return new Button2D();
  }

  constructor(options) {
    super(patch(options, {
      id: "Primrose.Controls.Button2D[" + (COUNTER++) + "]",
      textAlign: "center"
    }));
    this._lastActivated = null;
  }

  addToBrowserEnvironment(env, scene) {
    var btn3d = env.buttonFactory.create();
    btn3d.listeners = this.listeners;
    return env.appendChild(btn3d);
  }

  startPointer(x, y) {
    this.focus();
    this._activated = true;
    this.render();
  }

  endPointer() {
    if (this._activated) {
      this._activated = false;
      emit.call(this, "click", {
        target: this
      });
      this.render();
    }
  }

  _isChanged() {
    var activatedChanged = this._activated !== this._lastActivated,
      changed = super._isChanged || activatedChanged;
    return changed;
  }

  renderCanvasTrim() {
    this.context.lineWidth = this._activated ? 4 : 2;
    this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
    this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);
  }
}
return Button2D;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.Button3D = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose",
    name: "Button3D",
    baseClass: "Primrose.BaseControl",
    parameters: [{
      name: "model",
      type: "THREE.Object3D",
      description: "A 3D model to use as the graphics for this button."
    }, {
      name: "name",
      type: "String",
      description: "A name for the button, to make it distinct from other buttons."
    }, {
      name: "options",
      type: "Object",
      description: "A hash of options:\n\t\t\tmaxThrow - The limit for how far the button can be depressed.\n\t\t\tminDeflection - The minimum distance the button must be depressed before it is activated.\n\t\t\tcolorPressed - The color to change the button cap to when the button is activated.\n\t\t\tcolorUnpressed - The color to change the button cap to when the button is deactivated.\n\t\t\ttoggle - True if deactivating the button should require a second click. False if the button should deactivate when it is released."
    }],
    description: "A 3D button control, with a separate cap from a stand that it sits on. You click and depress the cap on top of the stand to actuate."
});
class Button3D extends Primrose.BaseControl {
  constructor(model, name, options) {
    super();

    options = patch(options, Button3D);
    options.minDeflection = Math.cos(options.minDeflection);
    options.colorUnpressed = new THREE.Color(options.colorUnpressed);
    options.colorPressed = new THREE.Color(options.colorPressed);

    pliny.event({
      name: "click",
      description: "Occurs when the button is activated."
    });
    this.listeners.click = [];

    pliny.event({
      name: "release",
      description: "Occurs when the button is deactivated."
    });
    this.listeners.release = [];

    pliny.property({
      name: "base",
      type: "THREE.Object3D",
      description: "The stand the button cap sits on."
    });
    this.base = model.children[1];

    pliny.property({
      name: "base",
      type: "THREE.Object3D",
      description: "The moveable part of the button, that triggers the click event."
    });
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.material = this.cap.material.clone();
    this.cap.button = this;
    this.cap.base = this.base;

    pliny.property({
      name: "container",
      type: "THREE.Object3D",
      description: "A grouping collection for the base and cap."
    });
    this.container = new THREE.Object3D();
    this.container.add(this.base);
    this.container.add(this.cap);

    pliny.property({
      name: "color",
      type: "Number",
      description: "The current color of the button cap."
    });
    this.color = this.cap.material.color;
    this.name = name;
    this.element = null;
    this.startUV = function () {
      this.color.copy(options.colorPressed);
      if (this.element) {
        this.element.click();
      }
      else {
        emit.call(this, "click");
      }
    };

    this.moveUV = function () {

    };

    this.endPointer = function () {
      this.color.copy(options.colorUnpressed);
      emit.call(this, "release");
    };
  }

  get position() {
    return this.container.position;
  }

  addToBrowserEnvironment(env, scene) {
    scene.add(this.container);
    env.registerPickableObject(this.cap);
    return this.container;
  }
}

pliny.record({
  parent: "Primrose.Controls.Button3D",
  name: "DEFAULTS",
  description: "Default option values that override undefined options passed to the Button3D class."
});


pliny.property({
  parent: "Primrose.Controls.Button3D",
  name: "position",
  type: "THREE.Vector3",
  description: "The location of the button."
});
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "maxThrow",
  type: "Number",
  description: "The limit for how far the button can be depressed."
});
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "minDeflection",
  type: "Number",
  description: "The minimum distance the button must be depressed before it is activated."
});
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "colorUnpressed",
  type: "Number",
  description: "The color to change the button cap to when the button is deactivated."
});
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "colorPressed",
  type: "Number",
  description: "The color to change the button cap to when the button is activated."
});
pliny.value({
  parent: "Primrose.Controls.Button3D.DEFAULTS",
  name: "toggle",
  type: "Boolean",
  description: "True if deactivating the button should require a second click. False if the button should deactivate when it is released."
});
Button3D.DEFAULTS = {
  maxThrow: 0.1,
  minDeflection: 10,
  colorUnpressed: 0x7f0000,
  colorPressed: 0x007f00,
  toggle: true
};
return Button3D;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.Form = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;
pliny.class({
  parent: "Primrose.Controls",
    name: "Form",
    baseClass: "Primrose.Entity",
    description: "A basic 2D form control, with its own mesh to use as a frame."
});
class Form extends Primrose.Surface {

  static create() {
    return new Form();
  }

  constructor(options) {
    super(patch(options, {
      id: `Primrose.Controls.Form[${COUNTER++}]`
    }));
    this._mesh = textured(quad(1, this.bounds.height / this.bounds.width), this);
    this._mesh.name = this.id + "-mesh";
    Object.defineProperties(this.style, {
      display: {
        get: () => this._mesh.visible ? "" : "none",
        set: (v) => {
          if (v === "none") {
            this.hide();
          }
          else {
            this.show();
          }
        }
      },
      visible: {
        get: () => this._mesh.visible ? "" : "hidden",
        set: (v) => this.visible = v !== "hidden"
      }
    });
  }

  addToBrowserEnvironment(env, scene) {
    scene.add(this._mesh);
    env.registerPickableObject(this._mesh);
    return this._mesh;
  }

  get position() {
    return this._mesh.position;
  }

  get visible() {
    return this._mesh.visible;
  }

  set visible(v) {
    this._mesh.visible = v;
  }

  get disabled() {
    return this._mesh.disabled;
  }

  set disabled(v) {
    this._mesh.disabled = v;
  }

  get enabled() {
    return !this.disabled;
  }

  set enabled(v) {
    this.disabled = !v;
  }

  hide() {
    this.visible = false;
    this.disabled = true;
  }

  show() {
    this.visible = true;
    this.disabled = false;
  }
}
return Form;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.HtmlDoc = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose.Controls",
    name: "HtmlDoc",
    baseClass: "Primrose.Surface",
    description: "A rendering of an HTML document.",
    parameters: [{
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Document."
    }]
});
class HtmlDoc extends Primrose.Surface {

  static create() {
    return new HtmlDoc();
  }

  constructor(options) {
    super(patch(options, {
      id: "Primrose.Controls.HtmlDoc[" + (COUNTER++) + "]"
    }));
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    if (typeof options === "string") {
      this.options = {
        element: this.options
      };
    }
    else {
      this.options = options || {};
    }

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this._lastImage = null;
    this._image = null;
    this.element = this.options.element;
  }

  get element() {
    return this._element;
  }

  set element(v) {
    if (v) {
      this._element = Primrose.DOM.cascadeElement(v, "DIV", HTMLDivElement);
      this._element.style.position = "absolute";
      this._element.style.display = "";
      this._element.style.width = this.bounds.width + "px";
      this._element.style.height = this.bounds.height + "px";
      document.body.appendChild(Primrose.DOM.makeHidingContainer(this.id + "-hider", this._element));
      this._render();
    }
  }

  addToBrowserEnvironment(env, scene) {
    var mesh = textured(quad(2, 2), this);
    scene.add(mesh);
    env.registerPickableObject(mesh);
    return mesh;
  }

  get value() {
    return this._element.innerHTML;
  }

  set value(v) {
    if (v !== this._element.innerHTML) {
      this._element.innerHTML = v;
      this._render();
    }
  }

  _render() {
    html2canvas(this._element, {
      onrendered: (canvas) => {
        this._image = canvas;
        this.setSize(canvas.width, canvas.height);
        this.render();
      }
    });
  }

  render() {
    if (this._image !== this._lastImage) {
      this._lastImage = this._image;
      this.context.fillStyle = "white";
      this.context.fillRect(0, 0, this.imageWidth, this.imageHeight);
      this.context.drawImage(this._image, 0, 0);
      this.invalidate();
    }
  }
}
return HtmlDoc;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.Image = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0,
  HTMLImage = window.Image,
  imageCache = {};

pliny.class({
  parent: "Primrose.Controls",
    name: "Image",
    baseClass: "Primrose.Surface",
    description: "A simple 2D image to put on a Surface.",
    parameters: [{
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Image."
    }]
});
class Image extends Primrose.Surface {

  static create() {
    return new Image();
  }

  constructor(options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    super(patch(options, {
      id: "Primrose.Controls.Image[" + (COUNTER++) + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, 1, 1)
    }));
    this.listeners.load = [];

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    this._lastWidth = -1;
    this._lastHeight = -1;
    this._lastImage = null;
    this._images = [];
    this._currentImageIndex = 0;
    this.className = "";

    setTimeout(() => {
      if (options.value) {
        if (/\.stereo\./.test(options.value)) {
          this.loadStereoImage(options.value);
        }
        else {
          this.loadImage(options.value);
        }
      }
    });
  }

  addToBrowserEnvironment(env, scene) {
    var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
    scene.add(imageMesh);
    env.registerPickableObject(imageMesh);
    return imageMesh;
  }

  get src() {
    return this.getImage(this._currentImageIndex)
      .src;
  }

  set src(v) {
    if (this.className === "stereo") {
      this.loadStereoImage(v);
    }
    else {
      this.loadImage(0, src);
    }
  }

  loadImage(i, src) {
    if (typeof i !== "number" && !(i instanceof Number)) {
      src = i;
      i = 0;
    }
    return new Promise((resolve, reject) => {
        if (imageCache[src]) {
          resolve(imageCache[src]);
        }
        else if (src) {
          var temp = new HTMLImage();
          temp.addEventListener("load", () => {
            imageCache[src] = temp;
            resolve(imageCache[src]);
          }, false);
          temp.addEventListener("error", () => {
            reject("error loading image");
          }, false);
          temp.src = src;
        }
        else {
          reject("Image was null");
        }
      })
      .then((img) => {
        this.setImage(i, img);
        return img;
      })
      .catch((err) => {
        console.error("Failed to load image " + src);
        console.error(err);
        this.setImage(i, null);
      });
  }

  loadStereoImage(src) {
    return this.loadImage(src)
      .then((img) => {
        var bounds = new Primrose.Text.Rectangle(0, 0, img.width / 2, img.height),
          a = new Primrose.Surface({
            id: this.id + "-left",
            bounds: bounds
          }),
          b = new Primrose.Surface({
            id: this.id + "-right",
            bounds: bounds
          });
        a.context.drawImage(img, 0, 0);
        b.context.drawImage(img, -bounds.width, 0);
        this.setImage(0, a.canvas);
        this.setImage(1, b.canvas);
        this.bounds.width = bounds.width;
        this.bounds.height = bounds.height;
        this.render();

        emit.call(this, "load", {
          target: this
        });
        return this;
      });
  }

  get image() {
    return this.getImage(this._currentImageIndex);
  }

  set image(img) {
    this.setImage(this._currentImageIndex, img);
  }

  getImage(i) {
    return this._images[i % this._images.length];
  }

  setImage(i, img) {
    this._images[i] = img;
    this.render();
  }

  get _changed() {
    return this.resized || this.image !== this._lastImage;
  }

  eyeBlank(eye) {
    this._currentImageIndex = eye;
    this.render();
  }

  render(force) {
    if (this._changed || force) {
      if (this.resized) {
        this.resize();
      }
      else if (this.image !== this._lastImage) {
        this.context.clearRect(0, 0, this.imageWidth, this.imageHeight);
      }

      if (this.image) {
        this.context.drawImage(this.image, 0, 0);
      }

      this._lastWidth = this.imageWidth;
      this._lastHeight = this.imageHeight;
      this._lastImage = this.image;

      this.invalidate();
    }
  }
}
return Image;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Controls.VUMeter = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose.Controls",
    name: "VUMeter",
    baseClass: "Primrose.Surface",
    description: "A visualization of audio data.",
    parameters: [{
      name: "analyzer",
      type: "MediaStream",
      description: "The audio stream to analyze."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the Button."
    }]
});
class VUMeter extends Primrose.Surface {

  constructor(analyzer, options) {
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    super(patch(options, {
      id: "Primrose.Controls.VUMeter[" + (COUNTER++) + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, 512, 256),
      backgroundColor: 0x000000,
      foregroundColor: 0xffffff
    }));

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    this.analyzer = analyzer;
    this.analyzer.fftSize = this.bounds.width;
    this.buffer = new Uint8Array(this.analyzer.frequencyBinCount);
  }

  addToBrowserEnvironment(env, scene) {
    var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
    scene.add(imageMesh);
    env.registerPickableObject(imageMesh);
    return imageMesh;
  }

  render() {
    if (this.resized) {
      this.resize();
    }

    this.analyzer.getByteTimeDomainData(this.buffer);
    this.context.fillStyle = this.options.backgroundColor;
    this.context.fillRect(0, 0, this.bounds.width, this.bounds.height);
    this.context.lineWidth = 2;
    this.context.strokeStyle = this.options.foregroundColor;
    this.context.beginPath();
    for (var i = 0; i < this.buffer.length; ++i) {
      var x = i * this.bounds.width / this.buffer.length,
        y = this.buffer[i] * this.bounds.height / 256,
        func = i > 0 ? "lineTo" : "moveTo";
      this.context[func](x, y);
    }
    this.context.stroke();
    this.invalidate();
  }
}
return VUMeter;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.DOM.cascadeElement = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.DOM",
  name: "cascadeElement",
  returns: "Element",
  parameters: [{
    name: "id",
    type: "(String|Element)",
    description: "A vague reference to the element. Either a String id where the element can be had, a String id to give a newly created element if it does not exist, or an Element to manipulate and validate"
  }, {
    name: "tag",
    type: "String",
    description: "The HTML tag name of the element we are finding/creating/validating."
  }, {
    name: "DOMClass",
    type: "Class",
    description: "The class Function that is the type of element that we are frobnicating."
  }],
  description: "* If `id` is a string, tries to find the DOM element that has said ID\n\
  * If it exists, and it matches the expected tag type, returns the element, or throws an error if validation fails.\n\
  * If it doesn't exist, creates it and sets its ID to the provided id, then returns the new DOM element, not yet placed in the document anywhere.\n\
* If `id` is a DOM element, validates that it is of the expected type,\n\
  * returning the DOM element back if it's good,\n\
  * or throwing an error if it is not\n\
* If `id` is null, creates the DOM element to match the expected type.",
  examples: [{
    name: "Get an element by ID that already exists.",
    description: "Assuming the following HTML snippet:\n\
\n\
  grammar(\"HTML\");\n\
  <div>\n\
    <div id=\"First\">first element</div>\n\
    <section id=\"second-elem\">\n\
      Second element\n\
      <img id=\"img1\" src=\"img.png\">\n\
    </section>\n\
  </div>\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var elem = Primrose.DOM.cascadeElement(\"second-elem\", \"section\", HTMLElement);\n\
  console.assert(elem.textContent === \"Second element\");"
  }, {
    name: "Validate the tag type.",
    description: "Assuming the following HTML snippet:\n\
\n\
  grammar(\"HTML\");\n\
  <div>\n\
    <div id=\"First\">first element</div>\n\
    <section id=\"second-elem\">\n\
      Second element\n\
      <img id=\"img1\" src=\"img.png\">\n\
    </section>\n\
  </div>\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  //The following line of code should cause a runtime error.\n\
  Primrose.DOM.cascadeElement(\"img1\", \"section\", HTMLElement);"
  }, {
    name: "Create an element.",
    description: "Assuming the following HTML snippet:\n\
\n\
  grammar(\"HTML\");\n\
  <div>\n\
    <div id=\"First\">first element</div>\n\
    <section id=\"second-elem\">\n\
      Second element\n\
      <img id=\"img1\" src=\"img.png\">\n\
    </section>\n\
  </div>\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var elem = Primrose.DOM.cascadeElement(\"img2\", \"img\", HTMLImageElement);\n\
  console.assert(elem.id === \"img2\");\n\
  console.assert(elem.parentElement === null);\n\
  document.body.appendChild(elem);\n\
  console.assert(elem.parentElement === document.body);"
  }]
});

function cascadeElement(id, tag, DOMClass, add) {
  var elem = null;
  if (id === null) {
    elem = document.createElement(tag);
    elem.id = id = "auto_" + tag + Date.now();
  }
  else if (DOMClass === undefined || id instanceof DOMClass) {
    elem = id;
  }
  else if (typeof (id) === "string") {
    elem = document.getElementById(id);
    if (elem === null) {
      elem = document.createElement(tag);
      elem.id = id;
      if (add) {
        document.body.appendChild(elem);
      }
    }
    else if (elem.tagName !== tag.toUpperCase()) {
      elem = null;
    }
  }

  if (elem === null) {
    pliny.error({
      name: "Invalid element",
      type: "Error",
      description: "If the element could not be found, could not be created, or one of the appropriate ID was found but did not match the expected type, an error is thrown to halt operation."
    });
    throw new Error(id + " does not refer to a valid " + tag + " element.");
  }
  return elem;
}
return cascadeElement;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.DOM.findEverything = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.DOM",
  name: "findEverything",
  description: "Searches an element for all sub elements that have a named ID,\n\
using that ID as the name of a field in a hashmap to store a reference to the element.\n\
Basically, a quick way to get at all the named elements in a page. Returns an object full\n\
of element references, with fields named by the ID of the elements that were found.\n\
\n\
> NOTE: You may name your IDs pretty much anything you want, but for ease of use,\n\
> you should name them in a camalCase fashion. See [CamelCase - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/CamelCase).",
  parameters: [{
    name: "elem",
    type: "Element",
    optional: true,
    description: "the root element from which to search.",
    default: "`document`."
  }, {
    name: "obj",
    type: "Object",
    optional: true,
    description: "the object in which to store the element references. If no object is provided, one will be created."
  }],
  returns: "Object",
  examples: [{
    name: "Get all child elements.",
    description: "Assuming the following HTML snippet:\n\
\n\
  grammar(\"HTML\");\n\
  <div>\n\
    <div id=\"First\">first element</div>\n\
    <section id=\"second-elem\">\n\
      Second element\n\
      <img id=\"img1\" src=\"img.png\">\n\
    </section>\n\
  </div>\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var elems = Primrose.DOM.findEverything();\n\
  console.log(elems.First.innerHTML);\n\
  console.log(elems[\"second-elem\"].textContent);\n\
  console.log(elems.img1.src);\n\
\n\
## Results:\n\
> first element  \n\
> Second element  \n\
> img.png"
  }]
});

function findEverything(elem, obj) {
  elem = elem || document;
  obj = obj || {};
  var arr = elem.querySelectorAll("*");
  for (var i = 0; i < arr.length; ++i) {
    var e = arr[i];
    if (e.id && e.id.length > 0) {
      obj[e.id] = e;
      if (e.parentElement) {
        e.parentElement[e.id] = e;
      }
    }
  }
  return obj;
}
return findEverything;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.DOM.makeHidingContainer = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.DOM",
  name: "makeHidingContainer",
  description: "Takes an element and shoves it into a containing element that\n\
is 0x0 pixels in size, with the overflow hidden. Sometimes, we need an element\n\
like a TextArea in the DOM to be able to receive key events, but we don't want the\n\
user to see it, so the makeHidingContainer function makes it easy to make it disappear.",
  parameters: [{
    name: "id",
    type: "(String|Element)",
    description: "A vague reference to\n\
the element. Either a String id where the element can be had, a String id to give\n\
a newly created element if it does not exist, or an Element to manipulate and validate."
  }, {
    name: "obj",
    type: "Element",
    description: "The child element to stow in the hiding container."
  }],
  returns: "The hiding container element, not yet inserted into the DOM."
});

function makeHidingContainer(id, obj) {
  var elem = Primrose.DOM.cascadeElement(id, "div", window.HTMLDivElement);
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild(obj);
  return elem;
}
return makeHidingContainer;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.XHR = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "XHR",
  description: "Wraps up the XMLHttpRequest object into a workflow that is easier for me to handle: a single function call. Can handle both GETs and POSTs, with or  without a payload.",
  returns: "Promise",
  parameters: [{
    name: "method",
    type: "String",
    description: "The HTTP Verb being used for the request."
  }, {
    name: "type",
    type: "String",
    description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).",
    default: "\"text\""
  }, {
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload, if this is a PUT request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.XHR(\"GET\", \"json\", \"localFile.json\", {\n\
    progress: console.log.bind(console, \"progress\"))\n\
    .then(console.log.bind(console, \"done\")))\n\
    .catch(console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"
  }]
});

function XHR(method, type, url, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    options.headers = options.headers || {};
    if (method === "POST") {
      options.headers["Content-Type"] = options.headers["Content-Type"] || type;
    }

    var req = new XMLHttpRequest();
    req.onerror = (evt) => reject(new Error("Request error: " + evt.message));
    req.onabort = (evt) => reject(new Error("Request abort: " + evt.message));
    req.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if (req.status < 400) {
        resolve(req.response);
      }
      else {
        reject(req);
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The "open" method does not refer to a network connection.
    req.open(method, url);
    if (type) {
      req.responseType = type;
    }

    req.onprogress = options.progress;

    for (var key in options.headers) {
      req.setRequestHeader(key, options.headers[key]);
    }

    req.withCredentials = !!options.withCredentials;

    if (options.data) {
      req.send(JSON.stringify(options.data));
    }
    else {
      req.send();
    }
  });
}
return XHR;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.del = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "del",
  description: "Process an HTTP DELETE request.",
  returns: "Promise",
  parameters: [{
    name: "type",
    type: "String",
    description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).",
    default: "\"text\""
  }, {
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }, ]
});
function del(type, url, options) {
  return Primrose.HTTP.XHR("DELETE", type, url, options);
}
return del;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.delObject = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "delObject",
  description: "Delete something on the server, and receive JSON in response.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload, if this is a PUT request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }]
});
function delObject (url, options) {
  return  Primrose.HTTP.del("json", url, options);
}
return delObject;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.get = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "get",
  description: "Process an HTTP GET request.",
  returns: "Promise",
  parameters: [{
    name: "type",
    type: "String",
    description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).",
    default: "\"text\""
  }, {
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.get(\"json\", \"localFile.json\",\n\
    console.log.bind(console, \"progress\"),\n\
    console.log.bind(console, \"done\"),\n\
    console.error.bind(console));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"
  }]
});
function get(type, url, options){
  return Primrose.HTTP.XHR("GET", type || "text", url, options);
}
return get;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.getBuffer = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "getBuffer",
  description: "Get an ArrayBuffer from a server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request for an ArrayBuffer.",
    description: "Use this to load audio files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var context = new AudioContext();\n\
  Primrose.HTTP.getBuffer(\"audio.mp3\",\n\
    console.log.bind(console, \"progress\"));,\n\
    function(buffer){\n\
      context.decodeAudioData(\n\
        buffer,\n\
        console.log.bind(console, \"success\"),\n\
        console.error.bind(console, \"error decoding\"));\n\
    },\n\
    console.error.bind(console, \"error loading\")\n"
  }]
});
function getBuffer(url, options){
  return Primrose.HTTP.get("arraybuffer", url, options);
}
return getBuffer;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.getObject = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "getObject",
  description: "Get a JSON object from a server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request for a JSON object.",
    description: "Typically, you would use one of the other functions in the Primrose.HTTP namespace, but the XHR function is provided as a fallback in case those others do not meet your needs.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.getObject(\"localFile.json\", {\n\
      progress: console.log.bind(console, \"progress\")\n\
    })\n\
    .then(console.log.bind(console, \"done\"))\n\
    .catch(console.error.bind(console)));\n\
\n\
## Results:\n\
> Object {field1: 1, field2: \"Field2\"}"
  }]
});
function getObject(url, options){
  return Primrose.HTTP.get("json", url, options);
}
return getObject;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.getText = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "getText",
  description: "Get plain text from a server. Returns a promise that will be resolve with the text retrieved from the server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }],
  examples: [{
    name: "Make a GET request for plain text.",
    description: "Use this to load arbitrary files and do whatever you want with them.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  Primrose.HTTP.getText(\"localFile.json\",\n\
    console.log.bind(console, \"progress\"),\n\
    console.log.bind(console, \"done\"),\n\
    console.error.bind(console));\n\
\n\
## Results:\n\
> \"Object {field1: 1, field2: \\\"Field2\\\"}\""
  }]
});
function getText(url, options){
  return Primrose.HTTP.get("text", url, options);
}
return getText;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.post = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "post",
  description: "Process an HTTP POST request.",
  returns: "Promise",
  parameters: [{
    name: "type",
    type: "String",
    description: "How the response should be interpreted. One of [\"text\", \"json\", \"arraybuffer\"]. See the [MDN - XMLHttpRequest - responseType](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#xmlhttprequest-responsetype).",
    default: "\"text\""
  }, {
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload, if this is a POST request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }, ]
});
function post(type, url, options){
  return Primrose.HTTP.XHR("POST", type, url, options);
}
return post;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.HTTP.postObject = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.HTTP",
  name: "postObject",
  description: "Send a JSON object to a server.",
  returns: "Promise",
  parameters: [{
    name: "url",
    type: "String",
    description: "The resource to which the request is being sent."
  }, {
    name: "options.data",
    type: "Object",
    description: "The data object to use as the request body payload, if this is a PUT request."
  }, {
    name: "options.progress",
    type: "Function",
    optional: true,
    description: "A callback function to be called as the download from the server progresses."
  }]
});
function postObject(url, options){
  return Primrose.HTTP.post("json", url, options);
}
return postObject;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.FPSInput = factory();
  }
}(this, function() {
"use strict";

const DISPLACEMENT = new THREE.Vector3(),
  EULER_TEMP = new THREE.Euler(),
  WEDGE = Math.PI / 3;

pliny.class({
  parent: "Primrose.Input",
    name: "FPSInput",
    description: "| [under construction]"
});
class FPSInput {
  constructor(DOMElement, options) {
    DOMElement = DOMElement || window;
    this.options = options;
    this.listeners = {
      zero: [],
      motioncontroller: [],
      gamepad: []
    };

    this.managers = [];
    this.newState = [];
    this.pointers = [];
    this.motionDevices = [];
    this.velocity = new THREE.Vector3();
    this.matrix = new THREE.Matrix4();

    const keyUp = (evt) => this.currentControl && this.currentControl.keyUp && this.currentControl.keyUp(evt);
    const keyDown = (evt) => this.Keyboard.doTyping(this.currentControl && this.currentControl.focusedElement, evt);

    this.add(new Primrose.Input.Keyboard(this, null, {
      strafeLeft: {
        buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
      },
      strafeRight: {
        buttons: [
          Primrose.Keys.D,
          Primrose.Keys.RIGHTARROW
        ]
      },
      strafe: {
        commands: ["strafeLeft", "strafeRight"]
      },
      boost: {
        buttons: [Primrose.Keys.E],
        scale: 0.2
      },
      driveForward: {
        buttons: [-Primrose.Keys.W, -Primrose.Keys.UPARROW]
      },
      driveBack: {
        buttons: [
          Primrose.Keys.S,
          Primrose.Keys.DOWNARROW
        ]
      },
      drive: {
        commands: ["driveForward", "driveBack"]
      },
      select: {
        buttons: [Primrose.Keys.ENTER]
      },
      dSelect: {
        buttons: [Primrose.Keys.ENTER],
        delta: true
      },
      zero: {
        buttons: [Primrose.Keys.Z],
        metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
        commandUp: emit.bind(this, "zero")
      }
    }));

    this.Keyboard.addEventListener("keydown", keyDown);
    this.Keyboard.addEventListener("keyup", keyUp);

    this.add(new Primrose.Input.Touch(DOMElement, this.Keyboard, {
      buttons: {
        axes: [Primrose.Input.Touch.FINGERS]
      },
      dButtons: {
        axes: [Primrose.Input.Touch.FINGERS],
        delta: true
      },
      dx: {
        axes: [-Primrose.Input.Touch.X0],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: [-Primrose.Input.Touch.Y0],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      pitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      }
    }));

    this.add(new Primrose.Input.Mouse(DOMElement, this.Keyboard, {
      buttons: {
        axes: [Primrose.Input.Mouse.BUTTONS]
      },
      dButtons: {
        axes: [Primrose.Input.Mouse.BUTTONS],
        delta: true
      },
      dx: {
        axes: [-Primrose.Input.Mouse.X],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: [-Primrose.Input.Mouse.Y],
        delta: true,
        scale: 0.005,
        min: -5,
        max: 5
      },
      pitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      },
      pointerPitch: {
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.25,
        max: Math.PI * 0.25
      }
    }));

    this.add(new Primrose.Input.VR(this.options.avatarHeight, isMobile ? this.Touch : this.Mouse));

    this.motionDevices.push(this.VR);

    Primrose.Input.Gamepad.addEventListener("gamepadconnected", (pad) => {
      var padID = Primrose.Input.Gamepad.ID(pad),
        isMotion = padID.indexOf("Vive") === 0,
        padCommands = null,
        controllerNumber = 0;

      if (padID !== "Unknown" && padID !== "Rift") {
        if (isMotion) {
          padCommands = {
            buttons: {
              axes: [Primrose.Input.Gamepad.BUTTONS]
            },
            dButtons: {
              axes: [Primrose.Input.Gamepad.BUTTONS],
              delta: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
              commandUp: emit.bind(this, "zero")
            }
          };

          for (var i = 0; i < this.managers.length; ++i) {
            var mgr = this.managers[i];
            if (mgr.currentPad && mgr.currentPad.id === pad.id) {
              ++controllerNumber;
            }
          }
        }
        else {
          padCommands = {
            buttons: {
              axes: [Primrose.Input.Gamepad.BUTTONS]
            },
            dButtons: {
              axes: [Primrose.Input.Gamepad.BUTTONS],
              delta: true
            },
            strafe: {
              axes: [Primrose.Input.Gamepad.LSX],
              deadzone: 0.2
            },
            drive: {
              axes: [Primrose.Input.Gamepad.LSY],
              deadzone: 0.2
            },
            heading: {
              axes: [-Primrose.Input.Gamepad.RSX],
              deadzone: 0.2,
              integrate: true
            },
            dHeading: {
              commands: ["heading"],
              delta: true
            },
            pitch: {
              axes: [-Primrose.Input.Gamepad.RSY],
              deadzone: 0.2,
              integrate: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.XBOX_ONE_BUTTONS.BACK],
              commandUp: emit.bind(this, "zero")
            }
          };
        }

        var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
        this.add(mgr);

        if (isMotion) {
          mgr.parent = this.VR;
          this.motionDevices.push(mgr);

          var shift = (this.motionDevices.length - 2) * 8,
            ptr = new Primrose.Pointer(padID + "Pointer", 0x0000ff << shift, 0x00007f << shift, true, mgr);
          this.pointers.push(ptr);
          ptr.addToBrowserEnvironment(null, this.options.scene);
          ptr.addEventListener("teleport", (evt) => this.moveStage(evt.position));
        }
        else {
          this.Keyboard.parent = mgr;
        }
      }
    });

    Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", this.remove.bind(this));

    this.stage = new THREE.Object3D();

    this.mousePointer = new Primrose.Pointer("MousePointer", 0xff0000, 0x7f0000, false, this.Mouse, this.VR);
    this.pointers.push(this.mousePointer);
    this.mousePointer.addToBrowserEnvironment(null, this.options.scene);

    this.head = new Primrose.Pointer("GazePointer", 0xffff00, 0x7f7f00, false, this.VR);
    this.pointers.push(this.head);
    this.head.addToBrowserEnvironment(null, this.options.scene);

    this.pointers.forEach((ptr) => ptr.addEventListener("teleport", (evt) => this.moveStage(evt.position)));

    this.ready = Promise.all(this.managers
      .map((mgr) => mgr.ready)
      .filter(identity));
  }

  remove(id) {
    var mgr = this[id],
      mgrIdx = this.managers.indexOf(mgr);
    if (mgrIdx > -1) {
      this.managers.splice(mgrIdx, 1);
      delete this[id];
    }
    console.log("removed", mgr);
  }

  add(mgr) {
    for (var i = this.managers.length - 1; i >= 0; --i) {
      if (this.managers[i].name === mgr.name) {
        this.managers.splice(i, 1);
      }
    }
    this.managers.push(mgr);
    this[mgr.name] = mgr;
  }

  zero() {
    for (var i = 0; i < this.managers.length; ++i) {
      this.managers[i].zero();
    }
  }

  get hasMotionControllers() {
    return !!(this.Vive_0 && this.Vive_0.enabled && this.Vive_0.inPhysicalUse ||
      this.Vive_1 && this.Vive_1.enabled && this.Vive_1.inPhysicalUse);
  }

  get hasGamepad() {
    return !!(this.Gamepad_0 && this.Gamepad_0.enabled && this.Gamepad_0.inPhysicalUse);
  }

  get hasMouse() {
    return !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
  }

  get hasTouch() {
    return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
  }

  submitFrame() {
    this.VR.submitFrame();
  }

  update(dt) {
    this.Keyboard.enabled = this.Touch.enabled = this.Mouse.enabled = !this.hasMotionControllers;
    if (this.Gamepad_0) {
      this.Gamepad_0.enabled = !this.hasMotionControllers;
    }

    var hadGamepad = this.hasGamepad;
    Primrose.Input.Gamepad.poll();
    for (var i = 0; i < this.managers.length; ++i) {
      this.managers[i].update(dt);
    }
    if (!hadGamepad && this.hasGamepad) {
      this.Mouse.inPhysicalUse = false;
    }

    this.updateStage(dt);

    // update the motionDevices
    this.stage.updateMatrix();
    this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
    for (var i = 0; i < this.motionDevices.length; ++i) {
      this.motionDevices[i].updateStage(this.matrix);
    }

    for (var i = 0; i < this.pointers.length; ++i) {
      this.pointers[i].update();
    }

    if (this.VR.hasOrientation) {
      this.mousePointer.showPointer = (this.hasMouse || this.hasGamepad) && !(this.hasTouch || this.hasMotionControllers);
      this.head.showPointer = !(this.mousePointer.showPointer || this.hasMotionControllers);
    }
    else {
      // if we're not using an HMD, then update the view according to the mouse
      this.head.quaternion.copy(this.mousePointer.quaternion);
      this.head.showPointer = false;
      this.mousePointer.showPointer = true;
    }

    // record the position and orientation of the user
    this.newState = [];
    this.head.updateMatrix();
    this.stage.updateMatrix();
    this.head.position.toArray(this.newState, 0);
    this.stage.quaternion.toArray(this.newState, 3);
    this.head.quaternion.toArray(this.newState, 7);
  }

  updateStage(dt) {
    // get the linear movement from the mouse/keyboard/gamepad
    var heading = 0,
      strafe = 0,
      drive = 0;
    for (var i = 0; i < this.managers.length; ++i) {
      var mgr = this.managers[i];
      heading += mgr.getValue("heading");
      strafe += mgr.getValue("strafe");
      drive += mgr.getValue("drive");
    }

    // move stage according to heading and thrust
    if (this.VR.hasOrientation) {
      heading = WEDGE * Math.floor((heading / WEDGE) + 0.5);
    }

    EULER_TEMP.set(0, heading, 0, "YXZ");
    this.stage.quaternion.setFromEuler(EULER_TEMP);

    // update the stage's velocity
    this.velocity.x = strafe;
    this.velocity.z = drive;

    if (!this.stage.isOnGround) {
      this.velocity.y -= this.options.gravity * dt;
      if (this.stage.position.y < 0) {
        this.velocity.y = 0;
        this.stage.position.y = 0;
        this.stage.isOnGround = true;
      }
    }

    this.moveStage(DISPLACEMENT
      .copy(this.velocity)
      .multiplyScalar(dt)
      .applyQuaternion(this.stage.quaternion)
      .add(this.head.position));
  }

  moveStage(position) {
    DISPLACEMENT.copy(position)
      .sub(this.head.position);
    this.stage.position.x += DISPLACEMENT.x;
    this.stage.position.z += DISPLACEMENT.z;
  }

  get segments() {
    var segments = [];
    for (var i = 0; i < this.pointers.length; ++i) {
      var seg = this.pointers[i].segment;
      if (seg) {
        segments.push(seg);
      }
    }
    return segments;
  }

  get lockMovement() {
    for (var i = 0; i < this.pointers.length; ++i) {
      var ptr = this.pointers[i];
      if (ptr.lockMovement) {
        return true;
      }
    }

    return false;
  }

  get currentControl() {
    for (var i = 0; i < this.pointers.length; ++i) {
      var ptr = this.pointers[i];
      if (ptr.currentControl) {
        return ptr.currentControl;
      }
    }
  }

  resolvePicking(currentHits, lastHits, pickableObjects) {
    for (var i = 0; i < this.pointers.length; ++i) {
      this.pointers[i].resolvePicking(currentHits, lastHits, pickableObjects);
    }
  }

  addEventListener(evt, thunk, bubbles) {
    if (this.listeners[evt]) {
      this.listeners[evt].push(thunk);
    }
    else {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].addEventListener(evt, thunk, bubbles);
      }
    }
  }
}
return FPSInput;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Gamepad = factory();
  }
}(this, function() {
"use strict";

navigator.getGamepads = navigator.getGamepads ||
  navigator.webkitGetGamepads;

const listeners = {
    gamepadconnected: [],
    gamepaddisconnected: []
  },
  currentDeviceIDs = [],
  currentDevices = [],
  currentManagers = {};

pliny.class({
  parent: "Primrose.Input",
    name: "Gamepad",
    baseClass: "Primrose.PoseInputProcessor",
    parameters: [{
      name: "name",
      type: "string",
      description: "An unique name for this input manager. Note that systems with motion controllers will often have two controllers with the same ID, but different indexes. The name should take that into account."
    }, {
      name: "commands",
      type: "Array",
      optional: true,
      description: "An array of input command descriptions."
    }, {
      name: "socket",
      type: "WebSocket",
      optional: true,
      description: "A socket over which to transmit device state for device fusion."
    }],
    description: "An input processor for Gamepads, including those with positional data."
});
class Gamepad extends Primrose.PoseInputProcessor {
  static ID(pad) {
    var id = pad.id;
    if (id === "OpenVR Gamepad") {
      id = "Vive";
    }
    else if (id.indexOf("Xbox") === 0) {
      id = "Gamepad";
    }
    else if (id.indexOf("Rift") === 0) {
      id = "Rift";
    }
    else if (id.indexOf("Unknown") === 0) {
      id = "Unknown";
    }
    id = (id + "_" + (pad.index || 0))
      .replace(/\s+/g, "_")
    return id;
  }

  static poll() {
    var maybePads = navigator.getGamepads(),
      pads = [],
      padIDs = [],
      newPads = [],
      oldPads = [],
      i;

    if (maybePads) {
      for (i = 0; i < maybePads.length; ++i) {
        var maybePad = maybePads[i];
        if (maybePad) {
          var padID = Gamepad.ID(maybePad),
            padIdx = currentDeviceIDs.indexOf(padID);
          pads.push(maybePad);
          padIDs.push(padID);
          if (padIdx === -1) {
            newPads.push(maybePad);
            currentDeviceIDs.push(padID);
            currentDevices.push(maybePad);
            delete currentManagers[padID];
          }
          else {
            currentDevices[padIdx] = maybePad;
          }
        }
      }
    }

    for (i = currentDeviceIDs.length - 1; i >= 0; --i) {
      var padID = currentDeviceIDs[i],
        mgr = currentManagers[padID],
        pad = currentDevices[i];
      if (padIDs.indexOf(padID) === -1) {
        oldPads.push(padID);
        currentDevices.splice(i, 1);
        currentDeviceIDs.splice(i, 1);
      }
      else if (mgr) {
        mgr.checkDevice(pad);
      }
    }

    newPads.forEach(emit.bind(Gamepad, "gamepadconnected"));
    oldPads.forEach(emit.bind(Gamepad, "gamepaddisconnected"));
  }

  static get pads() {
    return currentDevices;
  }

  static get listeners() {
    return listeners;
  }

  static addEventListener(evt, thunk) {
    if (listeners[evt]) {
      listeners[evt].push(thunk);
    }
  }

  constructor(pad, axisOffset, commands, socket, parent) {
    var padID = Gamepad.ID(pad);
    super(padID, parent, commands, socket, Gamepad.AXES);
    currentManagers[padID] = this;

    this.currentDevice = pad;
    this.axisOffset = axisOffset;
  }

  checkDevice(pad) {
    var i, buttonMap = 0;
    this.currentDevice = pad;
    this.currentPose = this.currentDevice.pose;
    for (i = 0; i < pad.buttons.length; ++i) {
      var btn = pad.buttons[i];
      this.setButton(i, btn.pressed);
      if (btn.pressed) {
        buttonMap |= 0x1 << i;
      }
      this.setButton(i + pad.buttons.length, btn.touched);
    }
    this.setAxis("BUTTONS", buttonMap);
    for (i = 0; i < pad.axes.length; ++i) {
      var axisName = this.axisNames[this.axisOffset * pad.axes.length + i];
      this.setAxis(axisName, pad.axes[i]);
    }
  }

  vibrate(pattern) {
    if (this.currentDevice && this.currentDevice.vibrate) {
      this.currentDevice.vibrate(pattern);
    }
  }
}
Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);

pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_360_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
Gamepad.XBOX_360_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "XBOX_ONE_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
Gamepad.XBOX_ONE_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

pliny.enumeration({
  parent: "Primrose.Input.Gamepad",
  name: "VIVE_BUTTONS",
  description: "Labeled names for each of the different control buttons of the HTC Vive Motion Controllers."
});
Gamepad.VIVE_BUTTONS = {
  TOUCHPAD_PRESSED: 0,
  TRIGGER_PRESSED: 1,
  GRIP_PRESSED: 2,
  MENU_PRESSED: 3,

  TOUCHPAD_TOUCHED: 4,
  //TRIGGER_TOUCHED: 5, // doesn't ever actually trigger in the current version of Chromium - STM 6/22/2016
  GRIP_TOUCHED: 6,
  MENU_TOUCHED: 7
};
return Gamepad;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Keyboard = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Input",
    name: "Keyboard",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]",
    parameters: [{
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }, {
      name: "",
      type: "",
      description: ""
    }]
});
class Keyboard extends Primrose.InputProcessor {
  constructor(input, parent, commands, socket) {
    super("Keyboard", parent, commands, socket);
    this.listeners.clipboard = [];
    this.listeners.keydown = [];
    this.listeners.keyup = [];

    this._operatingSystem = null;
    this.browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
    this._codePage = null;

    const execute = (evt) => {
      if (!input.lockMovement) {
        this.setButton(evt.keyCode, evt.type === "keydown");
      }
      else {
        emit.call(this, evt.type, evt);
      }
    };

    const focusClipboard = (evt) => {
      if (this.lockMovement) {
        var cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          surrogate.style.display = "block";
          surrogate.focus();
        }
      }
    };

    const clipboardOperation = (evt) => {
      if (this.currentControl) {
        this.currentControl[evt.type + "SelectedText"](evt);
        if (!evt.returnValue) {
          evt.preventDefault();
        }
        surrogate.style.display = "none";
        this.currentControl.focus();
      }
    };

    // the `surrogate` textarea makes clipboard events possible
    var surrogate = Primrose.DOM.cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
      surrogateContainer = Primrose.DOM.makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

    surrogateContainer.style.position = "absolute";
    surrogateContainer.style.overflow = "hidden";
    surrogateContainer.style.width = 0;
    surrogateContainer.style.height = 0;
    surrogate.addEventListener("beforecopy", setFalse, false);
    surrogate.addEventListener("copy", clipboardOperation, false);
    surrogate.addEventListener("beforecut", setFalse, false);
    surrogate.addEventListener("cut", clipboardOperation, false);
    document.body.insertBefore(surrogateContainer, document.body.children[0]);

    window.addEventListener("beforepaste", setFalse, false);
    window.addEventListener("keydown", focusClipboard, true);
    window.addEventListener("keydown", execute, false);
    window.addEventListener("keyup", execute, false);
  }

  doTyping(elem, evt) {
    if (elem) {
      if (elem.execCommand && this.operatingSystem && this.browser && this.codePage) {
        var oldDeadKeyState = this.operatingSystem._deadKeyState,
          cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);

        if (elem.execCommand(this.browser, this.codePage, cmdName)) {
          evt.preventDefault();
        }
        if (this.operatingSystem._deadKeyState === oldDeadKeyState) {
          this.operatingSystem._deadKeyState = "";
        }
      }
      else {
        elem.keyDown(evt);
      }
    }
  }

  withCurrentControl(name) {
    return (evt) => {
      if (this.currentControl) {
        if (this.currentControl[name]) {
          this.currentControl[name](evt);
        }
        else {
          console.warn("Couldn't find %s on %o", name, this.currentControl);
        }
      }
    };
  }

  get operatingSystem() {
    return this._operatingSystem;
  }

  set operatingSystem(os) {
    this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
  }

  get codePage() {
    return this._codePage;
  }

  set codePage(cp) {
    var key,
      code,
      char,
      name;
    this._codePage = cp;
    if (!this._codePage) {
      var lang = (navigator.languages && navigator.languages[0]) ||
        navigator.language ||
        navigator.userLanguage ||
        navigator.browserLanguage;

      if (!lang || lang === "en") {
        lang = "en-US";
      }

      for (key in Primrose.Text.CodePages) {
        cp = Primrose.Text.CodePages[key];
        if (cp.language === lang) {
          this._codePage = cp;
          break;
        }
      }

      if (!this._codePage) {
        this._codePage = Primrose.Text.CodePages.EN_US;
      }
    }
  }
}
return Keyboard;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.LeapMotion = factory();
  }
}(this, function() {
"use strict";

function processFingerParts(i) {
  return LeapMotion.FINGER_PARTS.map(function (p) {
    return "FINGER" + i + p.toUpperCase();
  });
}


pliny.class({
  parent: "Primrose.Input",
    name: "LeapMotionInput",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class LeapMotion extends Primrose.InputProcessor {
  constructor(commands, socket) {
    super("LeapMotion", null, commands, socket);

    this.isStreaming = false;
    this.controller = new Leap.Controller({
      enableGestures: true
    });
  }

  E(e, f) {
    if (f) {
      this.controller.on(e, f);
    }
    else {
      this.controller.on(e, console.log.bind(console,
        "Leap Motion Event: " + e));
    }
  }

  start(gameUpdateLoop) {
    if (this.isEnabled()) {
      var canceller = null,
        startAlternate = null;
      if (gameUpdateLoop) {
        var alternateLooper = (t) => {
          requestAnimationFrame(alternateLooper);
          gameUpdateLoop(t);
        };
        startAlternate = requestAnimationFrame.bind(window, alternateLooper);
        var timeout = setTimeout(startAlternate, LeapMotion.CONNECTION_TIMEOUT);
        canceller = () => {
          clearTimeout(timeout);
          this.isStreaming = true;
        };
        this.E("deviceStreaming", canceller);
        this.E("streamingStarted", canceller);
        this.E("streamingStopped", startAlternate);
      }
      this.E("connect");
      //this.E("protocol");
      this.E("deviceStopped");
      this.E("disconnect");
      this.E("frame", this.setState.bind(this, gameUpdateLoop));
      this.controller.connect();
    }
  }

  setState(gameUpdateLoop, frame) {
    var prevFrame = this.controller.history.get(1),
      i,
      j;
    if (!prevFrame || frame.hands.length !== prevFrame.hands.length) {
      for (i = 0; i < this.commands.length; ++i) {
        this.enable(this.commands[i].name, frame.hands.length > 0);
      }
    }

    for (i = 0; i < frame.hands.length; ++i) {
      var hand = frame.hands[i].palmPosition;
      var handName = "HAND" + i;
      for (j = 0; j < LeapMotion.COMPONENTS.length; ++j) {
        this.setAxis(handName + LeapMotion.COMPONENTS[j], hand[j]);
      }
    }

    for (i = 0; i < frame.fingers.length; ++i) {
      var finger = frame.fingers[i];
      var fingerName = "FINGER" + i;
      for (j = 0; j < LeapMotion.FINGER_PARTS.length; ++j) {
        var joint = finger[LeapMotion.FINGER_PARTS[j] + "Position"];
        var jointName = fingerName +
          LeapMotion.FINGER_PARTS[j].toUpperCase();
        for (var k = 0; k < LeapMotion.COMPONENTS.length; ++k) {
          this.setAxis(jointName + LeapMotion.COMPONENTS[k],
            joint[k]);
        }
      }
    }

    if (gameUpdateLoop) {
      gameUpdateLoop(frame.timestamp * 0.001);
    }

    this.update();
  }
}

LeapMotion.COMPONENTS = ["X", "Y", "Z"];

LeapMotion.NUM_HANDS = 2;

LeapMotion.NUM_FINGERS = 10;

LeapMotion.FINGER_PARTS = ["tip", "dip", "pip", "mcp", "carp"];

Primrose.InputProcessor.defineAxisProperties(LeapMotion, ["X0", "Y0", "Z0",
  "X1", "Y1", "Z1",
  "FINGER0TIPX", "FINGER0TIPY",
  "FINGER0DIPX", "FINGER0DIPY",
  "FINGER0PIPX", "FINGER0PIPY",
  "FINGER0MCPX", "FINGER0MCPY",
  "FINGER0CARPX", "FINGER0CARPY",
  "FINGER1TIPX", "FINGER1TIPY",
  "FINGER1DIPX", "FINGER1DIPY",
  "FINGER1PIPX", "FINGER1PIPY",
  "FINGER1MCPX", "FINGER1MCPY",
  "FINGER1CARPX", "FINGER1CARPY",
  "FINGER2TIPX", "FINGER2TIPY",
  "FINGER2DIPX", "FINGER2DIPY",
  "FINGER2PIPX", "FINGER2PIPY",
  "FINGER2MCPX", "FINGER2MCPY",
  "FINGER2CARPX", "FINGER2CARPY",
  "FINGER3TIPX", "FINGER3TIPY",
  "FINGER3DIPX", "FINGER3DIPY",
  "FINGER3PIPX", "FINGER3PIPY",
  "FINGER3MCPX", "FINGER3MCPY",
  "FINGER3CARPX", "FINGER3CARPY",
  "FINGER4TIPX", "FINGER4TIPY",
  "FINGER4DIPX", "FINGER4DIPY",
  "FINGER4PIPX", "FINGER4PIPY",
  "FINGER4MCPX", "FINGER4MCPY",
  "FINGER4CARPX", "FINGER4CARPY",
  "FINGER5TIPX", "FINGER5TIPY",
  "FINGER5DIPX", "FINGER5DIPY",
  "FINGER5PIPX", "FINGER5PIPY",
  "FINGER5MCPX", "FINGER5MCPY",
  "FINGER5CARPX", "FINGER5CARPY",
  "FINGER6TIPX", "FINGER6TIPY",
  "FINGER6DIPX", "FINGER6DIPY",
  "FINGER6PIPX", "FINGER6PIPY",
  "FINGER6MCPX", "FINGER6MCPY",
  "FINGER6CARPX", "FINGER6CARPY",
  "FINGER7TIPX", "FINGER7TIPY",
  "FINGER7DIPX", "FINGER7DIPY",
  "FINGER7PIPX", "FINGER7PIPY",
  "FINGER7MCPX", "FINGER7MCPY",
  "FINGER7CARPX", "FINGER7CARPY",
  "FINGER8TIPX", "FINGER8TIPY",
  "FINGER8DIPX", "FINGER8DIPY",
  "FINGER8PIPX", "FINGER8PIPY",
  "FINGER8MCPX", "FINGER8MCPY",
  "FINGER8CARPX", "FINGER8CARPY",
  "FINGER9TIPX", "FINGER9TIPY",
  "FINGER9DIPX", "FINGER9DIPY",
  "FINGER9PIPX", "FINGER9PIPY",
  "FINGER9MCPX", "FINGER9MCPY",
  "FINGER9CARPX", "FINGER9CARPY"
]);

LeapMotion.CONNECTION_TIMEOUT = 5000;
return LeapMotion;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Location = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Input",
    name: "Location",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Location extends Primrose.InputProcessor {
  constructor(commands, socket, options) {
    super("Location", null, commands, socket);

    this.options = patch(options, Location.DEFAULTS);

    this.available = !!navigator.geolocation;
    if (this.available) {
      navigator.geolocation.watchPosition(
        this.setState.bind(this),
        () => this.available = false,
        this.options);
    }
  }

  setState(location) {
    for (var p in location.coords) {
      var k = p.toUpperCase();
      if (Location.AXES.indexOf(k) > -1) {
        this.setAxis(k, location.coords[p]);
      }
    }
    this.update();
  }
}

Primrose.InputProcessor.defineAxisProperties(Location, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

Location.DEFAULTS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 25000
};
return Location;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Motion = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Input",
    name: "Motion",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Motion extends Primrose.InputProcessor {
  constructor(commands, socket) {
    super("Motion", null, commands, socket);
    var corrector = new MotionCorrector(),
      a = new THREE.Quaternion(),
      b = new THREE.Quaternion(),
      RIGHT = new THREE.Vector3(1, 0, 0),
      UP = new THREE.Vector3(0, 1, 0),
      FORWARD = new THREE.Vector3(0, 0, -1);
    corrector.addEventListener("deviceorientation", (evt) => {
      for (var i = 0; i < Motion.AXES.length; ++i) {
        var k = Motion.AXES[i];
        this.setAxis(k, evt[k]);
      }
      a.set(0, 0, 0, 1)
        .multiply(b.setFromAxisAngle(UP, evt.HEADING))
        .multiply(b.setFromAxisAngle(RIGHT, evt.PITCH))
        .multiply(b.setFromAxisAngle(FORWARD, evt.ROLL));
      this.headRX = a.x;
      this.headRY = a.y;
      this.headRZ = a.z;
      this.headRW = a.w;
      this.update();
    });
    this.zeroAxes = corrector.zeroAxes.bind(corrector);
  }

  getOrientation(value) {
    value = value || new THREE.Quaternion();
    value.set(this.getValue("headRX"),
      this.getValue("headRY"),
      this.getValue("headRZ"),
      this.getValue("headRW"));
    return value;
  }
}

Primrose.InputProcessor.defineAxisProperties(Motion, [
  "HEADING", "PITCH", "ROLL",
  "D_HEADING", "D_PITCH", "D_ROLL",
  "headAX", "headAY", "headAZ",
  "headRX", "headRY", "headRZ", "headRW"
]);

function makeTransform(s, eye) {
  var sw = Math.max(screen.width, screen.height),
    sh = Math.min(screen.width, screen.height),
    w = Math.floor(sw * devicePixelRatio / 2),
    h = Math.floor(sh * devicePixelRatio),
    i = (eye + 1) / 2;

  if (window.THREE) {
    s.transform = new THREE.Matrix4()
      .makeTranslation(eye * 0.034, 0, 0);
  }
  s.viewport = {
    x: i * w,
    y: 0,
    width: w,
    height: h,
    top: 0,
    right: (i + 1) * w,
    bottom: h,
    left: i * w
  };
  s.fov = 75;
}

Motion.DEFAULT_TRANSFORMS = [{}, {}];
makeTransform(Motion.DEFAULT_TRANSFORMS[0], -1);
makeTransform(Motion.DEFAULT_TRANSFORMS[1], 1);
return Motion;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Mouse = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Input",
    name: "Mouse",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Mouse extends Primrose.InputProcessor {
  constructor(DOMElement, parent, commands, socket) {
    super("Mouse", parent, commands, socket);
    this.timer = null;

    DOMElement = DOMElement || window;

    DOMElement.addEventListener("mousedown", (event) => {
      this.setButton(event.button, true);
      this.BUTTONS = event.buttons << 10;
    }, false);

    DOMElement.addEventListener("mouseup", (event) => {
      this.setButton(event.button, false);
      this.BUTTONS = event.buttons << 10;
    }, false);

    DOMElement.addEventListener("mousemove", (event) => {
      this.BUTTONS = event.buttons << 10;
      if (PointerLock.isActive) {
        var mx = event.movementX,
          my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setMovement(mx, my);
      }
      else {
        this.setLocation(event.layerX, event.layerY);
      }
    }, false);

    DOMElement.addEventListener("wheel", (event) => {
      if (isChrome) {
        this.W += event.deltaX;
        this.Z += event.deltaY;
      }
      else if (event.shiftKey) {
        this.W += event.deltaY;
      }
      else {
        this.Z += event.deltaY;
      }
      event.preventDefault();
    }, false);
  }

  setLocation(x, y) {
    this.X = x;
    this.Y = y;
  }

  setMovement(dx, dy) {
    this.X += dx;
    this.Y += dy;
  }
}

Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);
return Mouse;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Speech = factory();
  }
}(this, function() {
"use strict";

////
//   Class: SpeechInput
//
//   Connects to a the webkitSpeechRecognition API and manages callbacks based on
//   keyword sets related to the callbacks. Note that the webkitSpeechRecognition
//   API requires a network connection, as the processing is done on an external
//   server.
//
//   Constructor: new SpeechInput(name, commands, socket);
//
//   The `name` parameter is used when transmitting the commands through the command
//   proxy server.
//
//   The `commands` parameter specifies a collection of keywords tied to callbacks
//   that will be called when one of the keywords are heard. Each callback can
//   be associated with multiple keywords, to be able to increase the accuracy
//   of matches by combining words and phrases that sound similar.
//
//   Each command entry is a simple object following the pattern:
//
//   {
//   "keywords": ["phrase no. 1", "phrase no. 2", ...],
//   "command": <callbackFunction>
//   }
//
//   The `keywords` property is an array of strings for which SpeechInput will
//   listen. If any of the words or phrases in the array matches matches the heard
//   command, the associated callbackFunction will be executed.
//
//  The `command` property is the callback function that will be executed. It takes no
//  parameters.
//
//  The `socket` (optional) parameter is a WebSocket connecting back to the command
//  proxy server.
//
//  Methods:
//  `start()`: starts the command unrecognition, unless it's not available, in which
//  case it prints a message to the console error log. Returns true if the running
//  state changed. Returns false otherwise.
//
//  `stop()`: uhm... it's like start, but it's called stop.
//
//  `isAvailable()`: returns true if the setup process was successful.
//
//  `getErrorMessage()`: returns the Error object that occured when setup failed, or
//  null if setup was successful.
///

pliny.class({
  parent: "Primrose.Input",
    name: "Speech",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Speech extends Primrose.InputProcessor {
  constructor(commands, socket) {
    super("Speech", null, commands, socket);
    var running = false,
      recognition = null,
      errorMessage = null;

    function warn() {
      var msg = "Failed to initialize speech engine. Reason: " + errorMessage.message;
      console.error(msg);
      return false;
    }

    function start() {
      if (!available) {
        return warn();
      }
      else if (!running) {
        running = true;
        recognition.start();
        return true;
      }
      return false;
    }

    function stop() {
      if (!available) {
        return warn();
      }
      if (running) {
        recognition.stop();
        return true;
      }
      return false;
    }

    this.check = function () {
      if (this.enabled && !running) {
        start();
      }
      else if (!this.enabled && running) {
        stop();
      }
    };

    this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if (window.SpeechRecognition) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      }
      else {
        // purposefully don't check the existance so it errors out and setup fails.
        recognition = new webkitSpeechRecognition();
      }
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      var restart = false;
      recognition.addEventListener("start", function () {
        console.log("speech started");
        command = "";
      }.bind(this), true);

      recognition.addEventListener("error", function (evt) {
        restart = true;
        console.log("speech error", evt);
        running = false;
        command = "speech error";
      }.bind(this), true);

      recognition.addEventListener("end", function (evt) {
        console.log("speech ended", evt);
        running = false;
        command = "speech ended";
        if (restart) {
          restart = false;
          this.enable(true);
        }
      }.bind(this), true);

      recognition.addEventListener("result", function (evt) {
        var newCommand = [];
        var result = evt.results[evt.resultIndex];
        var max = 0;
        var maxI = -1;
        if (result && result.isFinal) {
          for (var i = 0; i < result.length; ++i) {
            var alt = result[i];
            if (alt.confidence > max) {
              max = alt.confidence;
              maxI = i;
            }
          }
        }

        if (max > 0.85) {
          newCommand.push(result[maxI].transcript.trim());
        }

        newCommand = newCommand.join(" ");

        if (newCommand !== this.inputState) {
          this.inputState.text = newCommand;
        }
        this.update();
      }.bind(this), true);

      available = true;
    }
    catch (exp) {
      console.error(exp);
      errorMessage = exp;
      available = false;
    }
  }

  static maybeClone(arr) {
    return (arr && arr.slice()) || [];
  }

  cloneCommand(cmd) {
    return {
      name: cmd.name,
      preamble: cmd.preamble,
      keywords: Speech.maybeClone(cmd.keywords),
      commandUp: cmd.commandUp,
      disabled: cmd.disabled
    };
  }

  evalCommand(cmd, cmdState, metaKeysSet, dt) {
    if (metaKeysSet && this.inputState.text) {
      for (var i = 0; i < cmd.keywords.length; ++i) {
        if (this.inputState.text.indexOf(cmd.keywords[i]) === 0 && (cmd.preamble || cmd.keywords[i].length === this.inputState.text.length)) {
          cmdState.pressed = true;
          cmdState.value = this.inputState.text.substring(cmd.keywords[i].length)
            .trim();
          this.inputState.text = null;
        }
      }
    }
  }

  enable(k, v) {
    super.enable(k, v);
    this.check();
  }

  transmit(v) {
    super.transmit(v);
    this.check();
  }
}
return Speech;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.Touch = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Input",
    name: "Touch",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Touch extends Primrose.InputProcessor {
  constructor(DOMElement, parent, commands, socket) {
    super("Touch", parent, commands, socket);
    DOMElement = DOMElement || window;

    function setState(stateChange, setAxis, event) {
      var touches = event.changedTouches,
        i = 0,
        t = null;
      for (i = 0; i < touches.length; ++i) {
        t = touches[i];

        if (setAxis) {
          this.setAxis("X" + t.identifier, t.pageX);
          this.setAxis("Y" + t.identifier, t.pageY);
        }
        else {
          this.setAxis("LX" + t.identifier, t.pageX);
          this.setAxis("LY" + t.identifier, t.pageY);
        }

        this.setButton("FINGER" + t.identifier, stateChange);
      }
      touches = event.touches;

      var fingerState = 0;
      for (i = 0; i < touches.length; ++i) {
        fingerState |= 1 << t.identifier;
      }
      this.FINGERS = fingerState;
      event.preventDefault();
    }

    DOMElement.addEventListener("touchstart", setState.bind(this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(this, true, true), false);
  }
}

if (navigator.maxTouchPoints) {
  var axes = ["FINGERS"];
  for (var i = 0; i < navigator.maxTouchPoints; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
}
return Touch;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Input.VR = factory();
  }
}(this, function() {
"use strict";

const DEFAULT_POSE = {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1]
  },
  GAZE_LENGTH = 3000;
pliny.class({
  parent: "Primrose.Input",
    name: "VR",
    baseClass: "Primrose.PoseInputProcessor",
    parameters: [{
      name: "commands",
      type: "Array",
      optional: true,
      description: "An array of input command descriptions."
    }, {
      name: "socket",
      type: "WebSocket",
      optional: true,
      description: "A socket over which to transmit device state for device fusion."
    }],
    description: "An input manager for gamepad devices."
});
class VR extends Primrose.PoseInputProcessor {
  constructor(avatarHeight, parent, socket) {
    super("VR", parent, null, socket);

    this.displays = [];
    this._transformers = [];
    this.currentDeviceIndex = -1;
    this.movePlayer = new THREE.Matrix4();
    this.defaultAvatarHeight = avatarHeight;
    this.stage = null;
    this.lastStageWidth = null;
    this.lastStageDepth = null;

    console.info("Checking for displays...");
    this.ready = navigator.getVRDisplays()
      .then((displays) => {
        console.log("Displays found:", displays.length);
        this.displays.push.apply(this.displays, displays);
        return this.displays;
      });
  }

  get isNativeMobileWebVR() {
    return !(this.currentDevice && this.currentDevice.isPolyfilled) && isChrome && isMobile;
  }

  connect(selectedIndex) {
    this.currentDevice = null;
    this.currentDeviceIndex = selectedIndex;
    this.currentPose = null;
    if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
      this.currentDevice = this.displays[selectedIndex];
      this.currentPose = this.currentDevice.getPose();
      var params = this.currentDevice.getEyeParameters("left"),
        fov = params.fieldOfView;
      this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
    }
  }

  requestPresent(opts) {
    if (!this.currentDevice) {
      return Promise.reject("No display");
    }
    else {
      let layers = opts;
      if (!(layers instanceof Array)) {
        layers = [layers];
      }

      if (this.isNativeMobileWebVR) {
        layers = layers[0];
      }

      var elem = opts[0].source,
        promise = FullScreen.request(elem)
        .catch((exp) => console.warn("FullScreen", exp))
        .then(() => PointerLock.request(elem))
        .catch((exp) => console.warn("PointerLock", exp))
        .then(() => this.currentDevice.requestPresent(layers))
        .catch((exp) => console.warn("requstPresent", exp));

      if (this.isNativeMobileWebVR) {
        promise = promise.then(Orientation.lock)
          .catch((exp) => console.warn("OrientationLock", exp));
      }

      return promise;
    }
  }

  cancel() {
    let promise = null;
    if (this.isPresenting) {
      promise = this.currentDevice.exitPresent();
      this.currentDevice = null;
      this.currentDeviceIndex = -1;
      this.currentPose = null;
    }
    else {
      promise = Promise.resolve();
    }

    if (this.isNativeMobileWebVR) {
      promise = promise.then(Orientation.unlock);
    }

    return promise
      .then(PointerLock.exit)
      .then(() => this.connect(0));
  }

  zero() {
    super.zero();
    if (this.currentDevice) {
      this.currentDevice.resetPose();
    }
  }

  update(dt) {
    super.update(dt);

    let x = 0,
      z = 0,
      stage = null;

    if (this.currentDevice) {
      this.currentPose = this.currentDevice.getPose();
      stage = this.currentDevice.stageParameters;
    }

    if (stage) {
      this.movePlayer.fromArray(stage.sittingToStandingTransform);
      x = stage.sizeX;
      z = stage.sizeZ;
    }
    else {
      this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
    }

    var s = {
      matrix: this.movePlayer,
      sizeX: x,
      sizeZ: z
    };

    if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
      this.stage = s;
    }
  }

  get hasStage() {
    return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
  }

  submitFrame() {
    if (this.currentDevice) {
      this.currentDevice.submitFrame(this.currentPose);
    }
  }

  resolvePicking(currentHits, lastHits, objects) {
    super.resolvePicking(currentHits, lastHits, objects);

    var currentHit = currentHits.VR,
      lastHit = lastHits && lastHits.VR,
      dt, lt;
    if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
      currentHit.startTime = lastHit.startTime;
      currentHit.gazeFired = lastHit.gazeFired;
      dt = lt - currentHit.startTime;
      if (dt >= GAZE_LENGTH && !currentHit.gazeFired) {
        currentHit.gazeFired = true;
        emit.call(this, "gazecomplete", currentHit);
        emit.call(this.pickableObjects[currentHit.objectID], "click", "Gaze");
      }
    }
    else {
      if (lastHit) {
        dt = lt - lastHit.startTime;
        if (dt < GAZE_LENGTH) {
          emit.call(this, "gazecancel", lastHit);
        }
      }
      if (currentHit) {
        currentHit.startTime = lt;
        currentHit.gazeFired = false;
        emit.call(this, "gazestart", currentHit);
      }
    }
  }

  getTransforms(near, far) {
    if (this.currentDevice) {
      if (!this._transformers[this.currentDeviceIndex]) {
        this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
      }
      return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
    }
  }

  get canMirror() {
    return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
  }

  get isPolyfilled() {
    return this.currentDevice && this.currentDevice.isPolyfilled;
  }

  get isPresenting() {
    return this.currentDevice && this.currentDevice.isPresenting;
  }

  get hasOrientation() {
    return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
  }

  get currentCanvas() {
    return this.isPresenting && this.currentDevice.getLayers()[0].source;
  }
}
return VR;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Network.AudioChannel = factory();
  }
}(this, function() {
"use strict";

const ENABLE_OPUS_HACK = true;

if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};
}
if (!navigator.mediaDevices.getUserMedia) {
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia;
  navigator.mediaDevices.getUserMedia = (constraint) => new Promise((resolve, reject) => navigator.getUserMedia(constraint, resolve, reject));
}

var preferOpus = (function () {
  function preferOpus(description) {
    if (ENABLE_OPUS_HACK) {
      var sdp = description.sdp;
      var sdpLines = sdp.split('\r\n');
      var mLineIndex = null;
      // Search for m line.
      for (var i = 0; i < sdpLines.length; i++) {
        if (sdpLines[i].search('m=audio') !== -1) {
          mLineIndex = i;
          break;
        }
      }
      if (mLineIndex === null) return sdp;

      // If Opus is available, set it as the default in m line.
      for (var j = 0; j < sdpLines.length; j++) {
        if (sdpLines[j].search('opus/48000') !== -1) {
          var opusPayload = extractSdp(sdpLines[j], /:(\d+) opus\/48000/i);
          if (opusPayload) sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
          break;
        }
      }

      // Remove CN in m line and sdp.
      sdpLines = removeCN(sdpLines, mLineIndex);

      description.sdp = sdpLines.join('\r\n');
    }
    return description;
  }

  function extractSdp(sdpLine, pattern) {
    var result = sdpLine.match(pattern);
    return (result && result.length == 2) ? result[1] : null;
  }

  function setDefaultCodec(mLine, payload) {
    var elements = mLine.split(' ');
    var newLine = [];
    var index = 0;
    for (var i = 0; i < elements.length; i++) {
      if (index === 3) // Format of media starts from the fourth.
        newLine[index++] = payload; // Put target payload to the first.
      if (elements[i] !== payload) newLine[index++] = elements[i];
    }
    return newLine.join(' ');
  }

  function removeCN(sdpLines, mLineIndex) {
    var mLineElements = sdpLines[mLineIndex].split(' ');
    // Scan from end for the convenience of removing an item.
    for (var i = sdpLines.length - 1; i >= 0; i--) {
      var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
      if (payload) {
        var cnPos = mLineElements.indexOf(payload);
        if (cnPos !== -1) {
          // Remove CN payload from m line.
          mLineElements.splice(cnPos, 1);
        }
        // Remove CN line in sdp
        sdpLines.splice(i, 1);
      }
    }

    sdpLines[mLineIndex] = mLineElements.join(' ');
    return sdpLines;
  }

  return preferOpus;
})();

let INSTANCE_COUNT = 0;

pliny.class({
  parent: "Primrose.Network",
    name: "AudioChannel",
    baseClass: "Primrose.WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{
      name: "extraIceServers",
      type: "Array",
      description: "A collection of ICE servers to use on top of the default Google STUN servers."
    }, {
      name: "proxyServer",
      type: "WebSocket",
      description: "A connection over which to negotiate the peering."
    }, {
      name: "fromUserName",
      type: "String",
      description: "The name of the local user, from which the peering is being initiated."
    }, {
      name: "toUserName",
      type: "String",
      description: "The name of the remote user, to which the peering is being requested."
    }, {
      name: "outAudio",
      type: "MediaStream",
      description: "An audio stream from the local user to send to the remote user."
    }, ]
});
class AudioChannel extends Primrose.WebRTCSocket {
  constructor(extraIceServers, proxyServer, fromUserName, toUserName, outAudio, goSecond) {
    super(extraIceServers, proxyServer, fromUserName, 0, toUserName, 0, goSecond);

    pliny.property({
      parent: "Primrose.Network.AudioChannel",
      name: "outAudio",
      type: "MediaStream",
      description: "An audio channel from the local user to the remote user."
    });
    Object.defineProperty(this, "outAudio", {
      get: () => outAudio
    });

    pliny.property({
      parent: "Primrose.Network.AudioChannel",
      name: "inAudio",
      type: "MediaStream",
      description: "An audio channel from the remote user to the local user."
    });
    this.inAudio = null;
  }

  issueRequest() {
    // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
    //  version of the API) and Chrome.
    const addStream = () => {
      this._log(0, "adding stream", this.outAudio);

      // Make sure we actually have audio to send to the remote.
      if (this.outAudio) {
        if (isFirefox) {
          this.outAudio.getAudioTracks()
            .forEach((track) => this.rtc.addTrack(track, this.outAudio));
        }
        else {
          this.rtc.addStream(this.outAudio);
        }
      }
    };

    // Receiving an audio stream from the peer connection is just a
    const onStream = (stream) => {
      this.inAudio = stream;
      if (!this.goFirst) {
        this._log(0, "Creating the second stream from %s to %s", this.fromUserName, this.toUserName);
        addStream();
      }
    };

    // Wait to receive an audio track.
    if (isFirefox) {
      this.rtc.ontrack = (evt) => onStream(evt.streams[0]);
    }
    else {
      this.rtc.onaddstream = (evt) => onStream(evt.stream);
    }

    // If we're the boss, tell people about it.
    if (this.goFirst) {
      this._log(0, "Creating the first stream from %s to %s", this.fromUserName, this.toUserName);
      addStream();
    }
  }

  // The peering process is complete when all offers are answered.
  get complete() {
    if (this.goFirst) {
      this._log(1, "[First]: OC %s -> AR %s -> OR %s -> AC %s.",
        this.progress.offer.created,
        this.progress.answer.received,
        this.progress.offer.received,
        this.progress.answer.created);
    }
    else {
      this._log(1, "[Second]: OR %s -> AC %s -> OC %s -> AR %s.",
        this.progress.offer.received,
        this.progress.answer.created,
        this.progress.offer.created,
        this.progress.answer.received);
    }

    return super.complete || (this.progress.offer.received &&
      this.progress.offer.created &&
      this.progress.answer.received &&
      this.progress.answer.created);
  }

  teardown() {
    if (isFirefox) {
      this.rtc.ontrack = null;
    }
    else {
      this.rtc.onaddstream = null;
    }
  }

  createOffer() {
    return super.createOffer()
      .then(preferOpus);
  }
}
return AudioChannel;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Network.DataChannel = factory();
  }
}(this, function() {
"use strict";

let INSTANCE_COUNT = 0;

pliny.class({
  parent: "Primrose.Network",
    name: "DataChannel",
    baseClass: "Primrose.WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{
      name: "extraIceServers",
      type: "Array",
      description: "A collection of ICE servers to use on top of the default Google STUN servers."
    }, {
      name: "proxyServer",
      type: "WebSocket",
      description: "A connection over which to negotiate the peering."
    }, {
      name: "fromUserName",
      type: "String",
      description: "The name of the local user, from which the peering is being initiated."
    }, {
      name: "fromUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is performing the peering operation."
    }, {
      name: "toUserName",
      type: "String",
      description: "The name of the remote user, to which the peering is being requested."
    }, {
      name: "toUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is receiving the peering operation."
    }]
});
class DataChannel extends Primrose.WebRTCSocket {
  constructor(extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    super(extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond);

    pliny.property({
      parent: "Primrose.Network.DataChannel",
      name: "dataChannel",
      type: "RTCDataChannel",
      description: "A bidirectional data channel from the remote user to the local user."
    });
    this.dataChannel = null;
  }

  issueRequest() {
    if (goFirst) {
      this._log(0, "Creating data channel");
      this.dataChannel = this.rtc.createDataChannel();
    }
    else {
      this.ondatachannel = (evt) => {
        this._log(0, "Receving data channel");
        this.dataChannel = evt.channel;
      };
    }
  }

  get complete() {
    if (this.goFirst) {
      this._log(1, "[First]: OC %s -> AR %s.",
        this.progress.offer.created,
        this.progress.answer.received);
    }
    else {
      this._log(1, "[Second]: OC %s -> AR %s.",
        this.progress.offer.created,
        this.progress.answer.received);
    }
    return super.complete ||
      (this.goFirst && this.progress.offer.created && this.progress.answer.received ||
        !this.goFirst && this.progress.offer.recieved && this.progress.answer.created);
  }

  teardown() {
    this.rtc.ondatachannel = null;
  }
}
return DataChannel;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Network.Manager = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Network",
    name: "Manager",
    parameters: [{
      name: "localUser",
      type: "Primrose.Input.FPSInput",
      description: "The object that represents the player's location in the scene."
    }, {
      name: "audio",
      type: "Primrose.Output.Audio3D",
      description: "The audio manager being used in the current Environment."
    }, {
      name: "factories",
      type: "Primrose.ModelLoader",
      description: "Model factory for creating avatars for new remote users."
    }]
});
class Manager extends Primrose.AbstractEventEmitter {
  constructor(localUser, audio, factories, options) {
    super();
    this.localUser = localUser;
    this.audio = audio;
    this.factories = factories;
    this.options = options;
    this.lastNetworkUpdate = 0;
    this.oldState = [];
    this.users = {};
    this.extraIceServers = [];
    if (options.webRTC) {
      this.waitForLastUser = options.webRTC.then((obj) => {
        if (obj) {
          this.extraIceServers.push.apply(this.extraIceServers, obj.iceServers);
        }
      });
    }
    else {
      this.waitForLastUser = Promise.resolve();
    }
    this._socket = null;
    this.userName = null;
    this.microphone = null;
  }

  update(dt) {
    if (this._socket && this.deviceIndex === 0) {
      this.lastNetworkUpdate += dt;
      if (this.lastNetworkUpdate >= Primrose.Network.RemoteUser.NETWORK_DT) {
        this.lastNetworkUpdate -= Primrose.Network.RemoteUser.NETWORK_DT;
        for (var i = 0; i < this.localUser.newState.length; ++i) {
          if (this.oldState[i] !== this.localUser.newState[i]) {
            this._socket.emit("userState", this.localUser.newState);
            this.oldState = this.localUser.newState;
            break;
          }
        }
      }
    }
    for (var key in this.users) {
      var user = this.users[key];
      user.update(dt);
    }
  }

  updateUser(state) {
    var key = state[0];
    if (key !== this.userName) {
      var user = this.users[key];
      if (user) {
        user.state = state;
      }
      else {
        console.error("Unknown user", key);
      }
    }
    else if (this.deviceIndex > 0) {
      this.localUser.stage.mesh.position.fromArray(state, 1);
      this.localUser.stage.mesh.quaternion.fromArray(state, 4);
      this.localUser.head.mesh.position.fromArray(state, 8);
      this.localUser.head.mesh.quaternion.fromArray(state, 11);
    }
  }

  connect(socket, userName) {
    this.userName = userName.toLocaleUpperCase();
    if (!this.microphone) {
      this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })
        .then(Primrose.Output.Audio3D.setAudioStream)
        .catch(console.warn.bind(console, "Can't get audio"))
    }
    if (!this._socket) {
      this._socket = socket;
      this._socket.on("userList", this.listUsers.bind(this));
      this._socket.on("userJoin", this.addUser.bind(this));
      this._socket.on("deviceAdded", this.addDevice.bind(this));
      this._socket.on("deviceIndex", this.setDeviceIndex.bind(this));
      this._socket.on("chat", this.receiveChat.bind(this));
      this._socket.on("userState", this.updateUser.bind(this));
      this._socket.on("userLeft", this.removeUser.bind(this));
      this._socket.on("connection_lost", this.lostConnection.bind(this));
      this._socket.emit("listUsers");
      this._socket.emit("getDeviceIndex");
    }
  }

  disconnect() {
    this.userName = null;
    this._socket.close();
    this._socket = null;
  }

  addUser(state, goSecond) {
    console.log("User %s logging on.", state[0]);
    var toUserName = state[0],
      user = new Primrose.Network.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor);
    this.users[toUserName] = user;
    this.updateUser(state);
    this.emit("addavatar", user);
    this.waitForLastUser = this.waitForLastUser
      .then(() => user.peer(this.extraIceServers, this._socket, this.microphone, this.userName, this.audio, goSecond))
      .then(() => console.log("%s is peered with %s", this.userName, toUserName))
      .catch((exp) => console.error("Couldn't load user: " + name, exp));
  }

  removeUser(key) {
    console.log("User %s logging off.", key);
    var user = this.users[key];
    if (user) {
      user.unpeer();
      delete this.users[key];
      this.emit("removeavatar", user);
    }
  }

  listUsers(newUsers) {
    Object.keys(this.users)
      .forEach(this.removeUser.bind(this));
    while (newUsers.length > 0) {
      this.addUser(newUsers.shift(), true);
    }
    this.emit("authorizationsucceeded");
  }

  receiveChat(evt) {
    console.log("chat", evt);
  }

  lostConnection() {
    this.deviceIndex = null;
  }

  addDevice(index) {
    console.log("addDevice", index);
  }

  setDeviceIndex(index) {
    this.deviceIndex = index;
  }
}
return Manager;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Network.RemoteUser = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Network",
    name: "RemoteUser",
    description: "A networked user.",
    parameters: [{
      name: "userName",
      type: "String",
      description: "The name of the user."
    }, {
      name: "modelFactory",
      type: "Primrose.ModelLoader",
      description: "The factory for creating avatars for the user."
    }, {
      name: "nameMaterial",
      type: "Number",
      description: "The color to use with `textured()` to set as the material for the NAME object that will float above the user's avatar."
    }]
});
class RemoteUser {

  constructor(userName, modelFactory, nameMaterial) {
    this.time = 0;

    this.userName = userName;
    this.stage = modelFactory.clone();
    this.stage.traverse((obj) => {
      if (obj.name === "AvatarBelt") {
        textured(obj, Primrose.Random.color());
      }
      else if (obj.name === "AvatarHead") {
        this.head = obj;
      }
    });

    this.nameObject = textured(text3D(0.1, userName), nameMaterial);
    var bounds = this.nameObject.geometry.boundingBox.max;
    this.nameObject.rotation.set(0, Math.PI, 0);
    this.nameObject.position.set(bounds.x / 2, bounds.y, 0);
    this.head.add(this.nameObject);

    this.dStageQuaternion = new THREE.Quaternion();
    this.dHeadPosition = new THREE.Vector3();
    this.dHeadQuaternion = new THREE.Quaternion();

    this.lastStageQuaternion = new THREE.Quaternion();
    this.lastHeadPosition = new THREE.Vector3();
    this.lastHeadQuaternion = new THREE.Quaternion();

    this.stageQuaternion = {
      arr1: [],
      arr2: [],
      last: this.lastStageQuaternion,
      delta: this.dStageQuaternion,
      curr: this.stage.quaternion
    };

    this.headPosition = {
      arr1: [],
      arr2: [],
      last: this.lastHeadPosition,
      delta: this.dHeadPosition,
      curr: this.head.position
    };
    this.headQuaternion = {
      arr1: [],
      arr2: [],
      last: this.lastHeadQuaternion,
      delta: this.dHeadQuaternion,
      curr: this.head.quaternion
    };

    this.audioChannel = null;
    this.audioElement = null;
    this.audioStream = null;
    this.gain = null;
    this.panner = null;
    this.analyzer = null;
  }

  peer(extraIceServers, peeringSocket, microphone, localUserName, audio, goSecond) {
    pliny.method({
      parent: "Pliny.RemoteUser",
      name: "peer",
      returns: "Promise",
      description: "Makes a WebRTCPeerConnection between the local user and this remote user and wires up the audio channel.",
      parameters: [{
        name: "extraIceServers",
        type: "Array",
        description: "A collection of ICE servers to use on top of the default Google STUN servers."
      }, {
        name: "peeringSocket",
        type: "WebSocket",
        description: "A WebSocket over which the peer connection will be negotiated."
      }, {
        name: "microphone",
        type: "Promise",
        description: "A promise that resolves with an audio stream that can be sent to the remote user, representing the local user's voice chat."
      }, {
        name: "localUserName",
        type: "String",
        description: "The name of the user initiating the peer connection."
      }, {
        name: "audio",
        type: "Primrose.Output.Audio3D",
        description: "The audio context form which audio spatialization objects will be created, and to which the remote user's voice chat will be piped."
      }]
    });


    return microphone.then((outAudio) => {
      this.audioChannel = new Primrose.Network.AudioChannel(extraIceServers, peeringSocket, localUserName, this.userName, outAudio, goSecond);
      return this.audioChannel.ready
        .then(() => {
          if (!this.audioChannel.inAudio) {
            throw new Error("Didn't get an audio channel for " + this.userName);
          }
          this.audioElement = new Audio();
          Primrose.Output.Audio3D.setAudioStream(this.audioChannel.inAudio);
          this.audioElement.controls = false;
          this.audioElement.autoplay = true;
          this.audioElement.crossOrigin = "anonymous";
          document.body.appendChild(this.audioElement);

          this.audioStream = audio.context.createMediaStreamSource(this.audioChannel.inAudio);
          this.gain = audio.context.createGain();
          this.panner = audio.context.createPanner();

          this.audioStream.connect(this.gain);
          this.gain.connect(this.panner);
          this.panner.connect(audio.mainVolume);
          this.panner.coneInnerAngle = 180;
          this.panner.coneOuterAngle = 360;
          this.panner.coneOuterGain = 0.1;
          this.panner.panningModel = "HRTF";
          this.panner.distanceModel = "exponential";
        });
    });
  }

  unpeer() {
    pliny.method({
      parent: "Pliny.RemoteUser",
      name: "unpeer",
      description: "Cleans up after a user has left the room, removing the audio channels that were created for the user."
    });

    if (this.audioChannel) {
      this.audioChannel.close();
      if (this.audioElement) {
        document.body.removeChild(this.audioElement);
        if (this.panner) {
          this.panner.disconnect();
          this.gain.disconnect();
          this.audioStream.disconnect();
        }
      }
    }
  }

  _updateV(v, dt, fade) {
    v.curr.toArray(v.arr1);
    v.delta.toArray(v.arr2);
    for (var i = 0; i < v.arr1.length; ++i) {
      if (fade) {
        v.arr2[i] *= RemoteUser.FADE_FACTOR;
      }
      v.arr1[i] += v.arr2[i] * dt;
    }

    v.curr.fromArray(v.arr1);
    v.delta.fromArray(v.arr2);
  }

  _predict(v, state, off) {
    v.delta.fromArray(state, off);
    v.delta.toArray(v.arr1);
    v.curr.toArray(v.arr2);
    for (var i = 0; i < v.arr1.length; ++i) {
      v.arr1[i] = (v.arr1[i] - v.arr2[i]) * RemoteUser.NETWORK_DT_INV;
    }
    v.delta.fromArray(v.arr1);
  }

  update(dt) {
    pliny.method({
      parent: "Pliny.RemoteUser",
      name: "update",
      description: "Moves the avatar by its velocity for a set amount of time. Updates the audio panner information.",
      parameters: [{
        name: "dt",
        type: "Number",
        description: "The amount of time since the last update to the user."
      }]
    });

    this.time += dt;
    var fade = this.time >= RemoteUser.NETWORK_DT;
    this._updateV(this.headPosition, dt, fade);
    this._updateV(this.stageQuaternion, dt, fade);
    this._updateV(this.headQuaternion, dt, fade);
    this.stage.position.copy(this.headPosition.curr);
    this.stage.position.y = 0;
    if (this.panner) {
      this.panner.setPosition(this.stage.position.x, this.stage.position.y, this.stage.position.z);
      this.panner.setOrientation(Math.sin(this.stage.rotation.y), 0, Math.cos(this.stage.rotation.y));
    }
  }

  set state(v) {
    pliny.property({
      parent: "Pliny.RemoteUser",
      name: "state",
      description: "After receiving a network update, sets the current state of the remote user so that, by the time the next network update comes around, the user will be where it is predicted to be.",
      parameters: [{
        name: "v",
        type: "Array",
        description: "The raw state array from the network (includes the un-read first username field)."
      }]
    });

    this.time = 0;
    this._predict(this.headPosition, v, 1);
    this._predict(this.stageQuaternion, v, 4);
    this._predict(this.headQuaternion, v, 8);
  }

  toString(digits) {
    return this.stage.position.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
  }
}

RemoteUser.FADE_FACTOR = 0.5;
RemoteUser.NETWORK_DT = 0.10;
RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
return RemoteUser;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Output.Audio3D = factory();
  }
}(this, function() {
"use strict";

// polyfill
Window.prototype.AudioContext =
  Window.prototype.AudioContext ||
  Window.prototype.webkitAudioContext ||
  function () {};

pliny.class({
  parent: "Primrose.Output",
    name: "Audio3D",
    description: "| [under construction]"
});
class Audio3D {
  constructor() {

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();

      var vec = new THREE.Vector3(),
        up = new THREE.Vector3(),
        left = new THREE.Matrix4()
        .identity(),
        right = new THREE.Matrix4()
        .identity(),
        swap = null;

      this.setVelocity = this.context.listener.setVelocity.bind(this.context.listener);
      this.setPlayer = (obj) => {
        var head = obj;
        left.identity();
        right.identity();
        while (head !== null) {
          left.fromArray(head.matrix.elements);
          left.multiply(right);
          swap = left;
          left = right;
          right = swap;
          head = head.parent;
        }
        swap = left;
        var mx = swap.elements[12],
          my = swap.elements[13],
          mz = swap.elements[14];
        swap.elements[12] = swap.elements[13] = swap.elements[14] = 0;

        this.context.listener.setPosition(mx, my, mz);
        vec.set(0, 0, 1);
        vec.applyProjection(right);
        vec.normalize();
        up.set(0, -1, 0);
        up.applyProjection(right);
        up.normalize();
        this.context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        right.elements[12] = mx;
        right.elements[13] = my;
        right.elements[14] = mz;
      };
      this.isAvailable = true;
      this.start();
    }
    catch (exp) {
      console.error(exp);
      console.error("AudioContext not available.");
      this.isAvailable = false;
      this.setPlayer = function () {};
      this.setVelocity = function () {};
      this.start = function () {};
      this.stop = function () {};
      this.error = exp;
    }
  }

  static setAudioStream(stream) {
    const audioElementCount = document.querySelectorAll("audio")
      .length,
      element = Primrose.DOM.cascadeElement("audioStream" + audioElementCount, "audio", HTMLAudioElement, true);
    element.autoplay = true;
    if (isFirefox) {
      element.srcObject = stream;
    }
    else {
      element.src = URL.createObjectURL(stream);
    }
    element.setAttribute("muted", "");
    return stream;
  }

  start() {
    this.mainVolume.connect(this.context.destination);
  }

  stop() {
    this.mainVolume.disconnect();
  }

  loadURL(src) {
    return Primrose.HTTP.getBuffer(src)
      .then((data) => new Promise((resolve, reject) =>
        this.context.decodeAudioData(data, resolve, reject)));
  }

  loadURLCascadeSrcList(srcs, index) {
    index = index || 0;
    if (index >= srcs.length) {
      return Promise.reject("Failed to load a file from " + srcs.length + " files.");
    }
    else {
      return this.loadURL(srcs[index])
        .catch((err) => {
          console.error(err);
          return this.loadURLCascadeSrcList(srcs, index + 1);
        });
    }
  }

  createRawSound(pcmData) {
    if (pcmData.length !== 1 && pcmData.length !== 2) {
      throw new Error("Incorrect number of channels. Expected 1 or 2, got " + pcmData.length);
    }

    var frameCount = pcmData[0].length;
    if (pcmData.length > 1 && pcmData[1].length !== frameCount) {
      throw new Error(
        "Second channel is not the same length as the first channel. Expected " + frameCount + ", but was " + pcmData[1].length);
    }

    var buffer = this.context.createBuffer(pcmData.length, frameCount, this.sampleRate);
    for (var c = 0; c < pcmData.length; ++c) {
      var channel = buffer.getChannelData(c);
      for (var i = 0; i < frameCount; ++i) {
        channel[i] = pcmData[c][i];
      }
    }
    return buffer;
  }

  createSound(loop, buffer) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect(snd.volume);
    return snd;
  }

  create3DMediaStream(x, y, z, stream) {
    console.log(stream);
    var element = document.createElement("audio"),
      snd = {
        audio: element,
        source: this.context.createMediaElementSource(element),
        //volume: this.context.createGain(),
        //panner: this.context.createPanner()
      };
    if (isChrome) {
      element.src = URL.createObjectURL(stream);
    }
    else {
      element.srcObject = stream;
    }
    element.autoplay = true;
    element.controls = true;
    element.muted = true;
    snd.source.connect(this.mainVolume);
    //snd.source.connect(snd.volume):
    //snd.volume.connect(snd.panner);
    //snd.panner.connect(this.mainVolume);
    //snd.panner.setPosition(x, y, z);
    return snd;
  }

  create3DSound(x, y, z, snd) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition(x, y, z);
    snd.panner.connect(this.mainVolume);
    snd.volume.connect(snd.panner);
    return snd;
  }

  createFixedSound(snd) {
    snd.volume.connect(this.mainVolume);
    return snd;
  }

  loadSource(sources, loop) {

    pliny.method({
      parent: "Primrose.Output.Audio3D",
      name: "loadSound",
      returns: "Promise<MediaElementAudioSourceNode>",
      parameters: [{
        name: "sources",
        type: "String|Array<String>",
        description: "A string URI to an audio source, or an array of string URIs to audio sources. Will be used as a collection of HTML5 &lt;source> tags as children of an HTML5 &lt;audio> tag."
      }, {
        name: "loop",
        type: "Boolean",
        optional: true,
        description: "indicate that the sound should be played on loop."
      }],
      description: "Loads the first element of the `sources` array for which the browser supports the file format as an HTML5 &lt;audio> tag to use as an `AudioSourceNode` attached to the current `AudioContext`. This does not load all of the audio files. It only loads the first one of a list of options that could work, because all browsers do not support the same audio formats.",
      examples: [{
        name: "Load a single audio file.",
        description: "There is no one, good, compressed audio format supported in all browsers, but they do all support uncompressed WAV. You shouldn't use this on the Internet, but it might be okay for a local solution.\n\
\n\
  grammar(\"JavaScript\");\n\
  var audio = new Primrose.Output.Audio3D();\n\
  audio.loadSource(\"mySong.wav\").then(function(node){\n\
    node.connect(audio.context.destination);\n\
  });"
      }, {
        name: "Load a single audio file from a list of options.",
        description: "There is no one, good, compressed audio format supported in all browsers. As a hack around the problem, HTML5 media tags may include one or more &lt;source> tags as children to specify a cascading list of media sources. The browser will select the first one that it can successfully decode.\n\
\n\
  grammar(\"JavaScript\");\n\
  var audio = new Primrose.Output.Audio3D();\n\
  audio.loadSource([\n\
    \"mySong.mp3\",\n\
    \"mySong.aac\",\n\
    \"mySong.ogg\"\n\
  ]).then(function(node){\n\
    node.connect(audio.context.destination);\n\
  });"
      }, {
        name: "Load an ambient audio file that should be looped.",
        description: "The only audio option that is available is whether or not the audio file should be looped. You specify this with the second parameter to the `loadSource()` method, a `Boolean` value to indicate that looping is desired.\n\
\n\
  grammar(\"JavaScript\");\n\
  var audio = new Primrose.Output.Audio3D();\n\
  audio.loadSource([\n\
    \"mySong.mp3\",\n\
    \"mySong.aac\",\n\
    \"mySong.ogg\"\n\
  ], true).then(function(node){\n\
    node.connect(audio.context.destination);\n\
  });"
      }]
    });

    return new Promise((resolve, reject) => {
      if (!(sources instanceof Array)) {
        sources = [sources];
      }
      var audio = document.createElement("audio");
      audio.autoplay = true;
      audio.loop = loop;
      sources.map((src) => {
          var source = document.createElement("source");
          source.src = src;
          return source;
        })
        .forEach(audio.appendChild.bind(audio));
      audio.oncanplay = () => {
        if (this.context) {
          audio.oncanplay = null;
          var snd = {
            volume: this.context.createGain(),
            source: this.context.createMediaElementSource(audio)
          };
          snd.source.connect(snd.volume);
        }
        resolve(snd);
      };
      audio.onerror = reject;
      document.body.appendChild(audio);
    });
  }

  load3DSound(src, loop, x, y, z) {
    return this.loadSource(src, loop)
      .then(this.create3DSound.bind(this, x, y, z));
  }

  loadFixedSound(src, loop) {
    return this.loadSource(src, loop)
      .then(this.createFixedSound.bind(this));
  }

  playBufferImmediate(buffer, volume) {
    var snd = this.createSound(false, buffer);
    snd = this.createFixedSound(snd);
    snd.volume.gain.value = volume;
    snd.source.addEventListener("ended", (evt) => {
      snd.volume.disconnect(this.mainVolume);
    });
    snd.source.start(0);
    return snd;
  }
}
return Audio3D;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Output.HapticGlove = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Output",
    name: "HapticGlove",
    description: "| [under construction]"
});

function HapticGlove(options) {

  options.port = options.port || HapticGlove.DEFAULT_PORT;
  options.addr = options.addr || HapticGlove.DEFAULT_HOST;
  this.tips = [];
  this.numJoints = options.hands * options.fingers * options.joints;

  var enabled = false,
    connected = false;

  Leap.loop();

  this.setEnvironment = function (opts) {
    options.world = opts.world;
    options.scene = opts.scene;
    options.camera = opts.camera;

    Leap.loopController.on("frame", readFrame.bind(this));

  };

  var tipNames = [
    "tipPosition",
    "dipPosition",
    "pipPosition",
    "mcpPosition",
    "carpPosition"
  ];

  function readFrame(frame) {
    if (frame.valid) {
      enabled = frame.hands.length > 0;
      for (var h = 0; h < options.hands && h < frame.hands.length; ++h) {
        var hand = frame.hands[h];
        for (var f = 0; f < options.fingers; ++f) {
          var finger = hand.fingers[f];
          for (var j = 0; j < options.joints; ++j) {
            var n = h * options.fingers * options.joints + f * options.joints + j;
            if (n < this.tips.length) {
              var p = finger[tipNames[j]];
              var t = this.tips[n];
              t.position.set(p[0], p[1], p[2]);
            }
          }
        }
      }
    }
  }

  var socket,
    fingerState = 0;

  if (options.port !== 80) {
    options.addr += ":" + options.port;
  }

  socket = io.connect(options.addr, {
    "reconnect": true,
    "reconnection delay": 1000,
    "max reconnection attempts": 5
  });

  socket.on("connect", function () {
    connected = true;
    console.log("Connected!");
  });

  socket.on("disconnect", function () {
    connected = false;
    console.log("Disconnected!");
  });

  this.readContacts = function (contacts) {
    var count = 0;
    for (var c = 0; enabled && count < 2 && c < contacts.length; ++c) {
      var contact = contacts[c];
      for (var h = 0; h < options.hands && count < 2; ++h) {
        for (var f = 0; f < options.fingers; ++f) {
          var t = this.tips[f];
          var found = false;
          if (contact.bi === t) {
            if (contact.bj.graphics && contact.bj.graphics.isSolid) {
              this.setFingerState(f, true);
              found = true;
              ++count;
            }
          }
          if (!found) {
            this.setFingerState(f, false);
          }
        }
      }
    }
  };

  this.setFingerState = function (i, value) {
    var mask = 0x1 << i;
    if (value) {
      fingerState = fingerState | mask;
    }
    else {
      fingerState = fingerState & ~mask & 0x1f;
    }
    if (connected) {
      socket.emit("data", fingerState);
    }
  };
}

HapticGlove.DEFAULT_PORT = 8383;
HapticGlove.DEFAULT_HOST = document.location.hostname;
return HapticGlove;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Output.Music = factory();
  }
}(this, function() {
"use strict";

/* polyfill */
Window.prototype.AudioContext =
  Window.prototype.AudioContext ||
  Window.prototype.webkitAudioContext ||
  function () {};

var PIANO_BASE = Math.pow(2, 1 / 12),
  MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1;

function piano(n) {
  return 440 * Math.pow(PIANO_BASE, n - 49);
}

pliny.class({
  parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
});

function Music(context, type, numNotes) {
  this.audio = context || new AudioContext();
  if (this.audio && this.audio.createGain) {
    if (numNotes === undefined) {
      numNotes = MAX_NOTE_COUNT;
    }
    if (type === undefined) {
      type = "sawtooth";
    }
    this.available = true;
    this.mainVolume = this.audio.createGain();
    this.mainVolume.connect(this.audio.destination);
    this.numNotes = numNotes;
    this.oscillators = [];

    for (var i = 0; i < this.numNotes; ++i) {
      var o = this.audio.createOscillator(),
        g = this.audio.createGain();
      o.type = type;
      o.frequency.value = 0;
      o.connect(g);
      o.start();
      g.connect(this.mainVolume);
      this.oscillators.push({
        osc: o,
        gn: g,
        timeout: null
      });
    }
  }
  else {
    this.available = false;
  }
}

Music.prototype.noteOn = function (volume, i, n) {
  if (this.available) {
    if (n === undefined) {
      n = 0;
    }
    var o = this.oscillators[n % this.numNotes],
      f = piano(parseFloat(i) + 1);
    o.gn.gain.value = volume;
    o.osc.frequency.setValueAtTime(f, 0);
    return o;
  }
};

Music.prototype.noteOff = function (n) {
  if (this.available) {
    if (n === undefined) {
      n = 0;
    }
    var o = this.oscillators[n % this.numNotes];
    o.osc.frequency.setValueAtTime(0, 0);
  }
};

Music.prototype.play = function (i, volume, duration, n) {
  if (this.available) {
    if (typeof n !== "number") {
      n = 0;
    }
    var o = this.noteOn(volume, i, n);
    if (o.timeout) {
      clearTimeout(o.timeout);
      o.timeout = null;
    }
    o.timeout = setTimeout((function (n, o) {
        this.noteOff(n);
        o.timeout = null;
      })
      .bind(this, n, o), duration * 1000);
  }
};
return Music;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Output.Speech = factory();
  }
}(this, function() {
"use strict";

function pickRandomOption(options, key, min, max) {
  if (options[key] === undefined) {
    options[key] = min + (max - min) * Math.random();
  }
  else {
    options[key] = Math.min(max, Math.max(min, options[key]));
  }
  return options[key];
}

var Speech = null;

try {
  pliny.class({
    parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
  });
  Speech = function(options) {
    options = options || {};
    var voices = speechSynthesis.getVoices()
      .filter(function (v) {
        return v.default || v.localService;
      }.bind(this));

    var voice = voices[
      Math.floor(pickRandomOption(options, "voice", 0, voices.length))];

    this.speak = function (txt, callback) {
      var msg = new SpeechSynthesisUtterance();
      msg.voice = voice;
      msg.volume = pickRandomOption(options, "volume", 1, 1);
      msg.rate = pickRandomOption(options, "rate", 0.1, 5);
      msg.pitch = pickRandomOption(options, "pitch", 0, 2);
      msg.text = txt;
      msg.onend = callback;
      speechSynthesis.speak(msg);
    };
  };
}
catch (exp) {
  console.error(exp);

  // in case of error, return a shim that lets us continue unabated
  pliny.class({
    parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
  });
  Speech = function() {
    this.speak = function () {};
  };
}
return Speech;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.ID = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.Random",
  name: "ID",
  description: "Returns a randomized string to be used as a general purpose identifier. Collisions are possible, but should be rare.",
  returns: "String",
  examples: [{
    name: "Generate 10 random identifiers.",
    description: "To generate a randomized identifier, call the `Primrose.Random.ID()` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.ID());\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 25xzdqnhg1ma2qsb3k1n61or\n\
> 1hyajmimpyjb4chvge5ng66r\n\
> cq3dy9qnkwhneza3vr3haor\n\
> g3l5k2kfwmxjrxjwg0uj714i\n\
> 7qsta7cutxke8t88pahy3nmi\n\
> h75g0nj0d4gh7zsyowxko6r\n\
> 7pbej49fhhd5icimp3krzfr\n\
> 3vnlovkkvyvmetsjcyirizfr\n\
> icrehedvz97dpgkusfumzpvi\n\
> 9p06sytn6dfearuibsnn4s4i"
  }]
});
function ID () {
  return (Math.random() * Math.log(Number.MAX_VALUE))
  .toString(36)
  .replace(".", "");
}
return ID;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.color = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.Random",
  name: "color",
  description: "Returns a random hex RGB number to be used as a color.",
  returns: "Number",
  examples: [{
    name: "Generate a random color.",
    description: "To generate colors at random, call the `Primrose.Random.color()` function:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.color().toString(16));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 351233\n\
> 3e8e9\n\
> 8a85a6\n\
> 5fad58\n\
> 17fe2b\n\
> d4b42b\n\
> e986bf\n\
> 38541a\n\
> 5a19db\n\
> 5f5c50"
  }]
});

function color() {
  var r = Primrose.Random.int(0, 256),
    g = Primrose.Random.int(0, 256),
    b = Primrose.Random.int(0, 256);
  return r << 16 | g << 8 | b;
}
return color;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.int = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.Random",
  name: "int",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive. Includes a means to skew the results in one direction or another. The number is as good as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }, {
    name: "power",
    type: "Number",
    optional: true,
    description: "The power to which to raise the random number before scaling and translating into the desired range. Values greater than 1 skew output values to the minimum of the range. Values less than 1 skew output values to the maximum of the range.",
    default: 1
  }],
  returns: "Number",
  examples: [{
    name: "Generate a random integer numbers on the range [-10, 10).",
    description: "To generate a random integer on a closed range, call the `Primrose.Random.integer` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.int(-10, 10));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -3  \n\
> 1  \n\
> -2  \n\
> 8  \n\
> 7  \n\
> 4  \n\
> 5  \n\
> -9  \n\
> 4  \n\
> 0"
  }, {
    name: "Generate skewed random integer numbers on the range [-100, 100).",
    description: "To generate a random integer skewed to one end of the range on a closed range, call the `Primrose.Random.integer` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.int(-100, 100, 5));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -100  \n\
> -100  \n\
> -78  \n\
> -81  \n\
> -99  \n\
> 18  \n\
> -100  \n\
> -100  \n\
> -100  \n\
> 52"
  }]
});
function int(min, max, power) {
  power = power || 1;
  if (max === undefined) {
    max = min;
    min = 0;
  }
  var delta = max - min,
    n = Math.pow(Math.random(), power);
  return Math.floor(min + n * delta);
}
return int;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.item = factory();
  }
}(this, function() {
"use strict";
pliny.function({
  parent: "Primrose.Random",
  name: "item",
  description: "Returns a random element from an array.",
  parameters: [{
    name: "arr",
    type: "Array",
    description: "The array form which to pick items."
  }],
  returns: "Any",
  examples: [{
    name: "Select a random element from an array.",
    description: "To pick an item from an array at random, call the `Primrose.Random.item` function with the `power` parameter as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var numbers = [\n\
    \"one\",\n\
    \"two\",\n\
    \"three\",\n\
    \"four\",\n\
    \"five\"\n\
  ];\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.item(numbers));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> three  \n\
> four  \n\
> four  \n\
> two  \n\
> three  \n\
> two  \n\
> five  \n\
> four  \n\
> three  \n\
> two"
  }]
});
function item (arr) {
  return arr[Primrose.Random.int(arr.length)];
}
return item;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.number = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.Random",
  name: "number",
  description: "Returns a random floating-point number on a given range [min, max), i.e. min is inclusive, max is exclusive. As random as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }],
  returns: "Number",
  examples: [{
    name: "Generate a random number on the range [-1, 1).",
    description: "To generate a random number on a closed range, call the `Primrose.Random.number` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.number(-1, 1));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> -0.4869012129493058  \n\
> 0.5300767715089023  \n\
> 0.11962601682171226  \n\
> -0.22012147679924965  \n\
> 0.48508461797609925  \n\
> -0.8488651723600924  \n\
> 0.15711558377370238  \n\
> -0.3644236018881202  \n\
> 0.4486056035384536  \n\
> -0.9659552359953523"
  }]
});
function number (min, max){
  return Math.random() * (max - min) + min;
}
return number;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Random.steps = factory();
  }
}(this, function() {
"use strict";

pliny.function({
  parent: "Primrose.Random",
  name: "steps",
  description: "Returns a random integer number on a given range [min, max), i.e. min is inclusive, max is exclusive, sticking to a number of steps in between. Useful for randomly generating music note values on pentatonic scales. As random as your JavaScript engine supports with Math.random(), which is not good enough for crypto, but is certainly good enough for games.",
  parameters: [{
    name: "min",
    type: "Number",
    description: "The included minimum side of the range of numbers."
  }, {
    name: "max",
    type: "Number",
    description: "The excluded maximum side of the range of numbers."
  }, {
    name: "steps",
    type: "Number",
    description: "The number of steps between individual integers, e.g. if min is even and step is even, then no odd numbers will be generated."
  }],
  returns: "Number",
  examples: [{
    name: "Generate random, even numbers.",
    description: "To generate numbers on a closed range with a constant step size between them, call the `Primrose.Random.step` function as shown:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.steps(0, 100, 2));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 86  \n\
> 32  \n\
> 86  \n\
> 56  \n\
> 4  \n\
> 96  \n\
> 68  \n\
> 92  \n\
> 4  \n\
> 36"
  }]
});
function steps(min, max, steps){
  return min + Primrose.Random.int(0, (1 + max - min) / steps) * steps;
}
return steps;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePage = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "CodePage",
    description: "| [under construction]"
});

function CodePage(name, lang, options) {
  this.name = name;
  this.language = lang;

  var commands = {
    NORMAL: {
      "65": "a",
      "66": "b",
      "67": "c",
      "68": "d",
      "69": "e",
      "70": "f",
      "71": "g",
      "72": "h",
      "73": "i",
      "74": "j",
      "75": "k",
      "76": "l",
      "77": "m",
      "78": "n",
      "79": "o",
      "80": "p",
      "81": "q",
      "82": "r",
      "83": "s",
      "84": "t",
      "85": "u",
      "86": "v",
      "87": "w",
      "88": "x",
      "89": "y",
      "90": "z"
    },
    SHIFT: {
      "65": "A",
      "66": "B",
      "67": "C",
      "68": "D",
      "69": "E",
      "70": "F",
      "71": "G",
      "72": "H",
      "73": "I",
      "74": "J",
      "75": "K",
      "76": "L",
      "77": "M",
      "78": "N",
      "79": "O",
      "80": "P",
      "81": "Q",
      "82": "R",
      "83": "S",
      "84": "T",
      "85": "U",
      "86": "V",
      "87": "W",
      "88": "X",
      "89": "Y",
      "90": "Z"
    }
  };

  copyObject(commands, options);

  var char, code, cmdName;
  for (var i = 0; i <= 9; ++i) {
    code = Primrose.Keys["NUMPAD" + i];
    commands.NORMAL[code] = i.toString();
  }

  commands.NORMAL[Primrose.Keys.MULTIPLY] = "*";
  commands.NORMAL[Primrose.Keys.ADD] = "+";
  commands.NORMAL[Primrose.Keys.SUBTRACT] = "-";
  commands.NORMAL[Primrose.Keys.DECIMALPOINT] = ".";
  commands.NORMAL[Primrose.Keys.DIVIDE] = "/";

  this.keyNames = {};
  this.commandNames = [];
  for (char in Primrose.Keys) {
    code = Primrose.Keys[char];
    if (!isNaN(code)) {
      this.keyNames[code] = char;
    }
  }

  function overwriteText(txt, prim, lines) {
    prim.selectedText = txt;
  }

  for (var type in commands) {
    var codes = commands[type];
    if (typeof (codes) === "object") {
      for (code in codes) {
        if (code.indexOf("_") > -1) {
          var parts = code.split(' '),
            browser = parts[0];
          code = parts[1];
          char = commands.NORMAL[code];
          cmdName = browser + "_" + type + " " + char;
        }
        else {
          char = commands.NORMAL[code];
          cmdName = type + "_" + char;
        }
        this.commandNames.push(cmdName);
        this.keyNames[code] = char;
        var func = codes[code];
        if (typeof func !== "function") {
          func = overwriteText.bind(null, func);
        }
        this[cmdName] = func;
      }
    }
  }
}

CodePage.DEAD = function (key) {
  return function (prim) {
    prim.setDeadKeyState("DEAD" + key);
  };
};
return CodePage;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePages = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "CodePages",
  description: "The CodePages namespace contains international keyboard parameters."
});
const CodePages = {};

return CodePages;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CommandPack = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "CommandPack",
    description: "| [under construction]"
});
function CommandPack(name, commands) {
  this.name = name;
  copyObject(this, commands);
}
return CommandPack;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CommandPacks = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "CommandPacks",
  description: "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls."
});
const CommandPacks = {};
return CommandPacks;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Controls = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "Controls",
  description: "The Controls namespace contains different types of text-oriented controls."
});
const Controls = {};
return Controls;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Cursor = factory();
  }
}(this, function() {
"use strict";

// unicode-aware string reverse
var reverse = (function () {
  var combiningMarks =
    /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
    surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

  function reverse(str) {
    str = str.replace(combiningMarks, function (match, capture1,
        capture2) {
        return reverse(capture2) + capture1;
      })
      .replace(surrogatePair, "$2$1");
    var res = "";
    for (var i = str.length - 1; i >= 0; --i) {
      res += str[i];
    }
    return res;
  }
  return reverse;
})();

pliny.class({
  parent: "Primrose.Text",
    name: "Cursor",
    description: "| [under construction]"
});

function Cursor(i, x, y) {
  this.i = i || 0;
  this.x = x || 0;
  this.y = y || 0;
  this.moved = true;
}

Cursor.min = function (a, b) {
  if (a.i <= b.i) {
    return a;
  }
  return b;
};

Cursor.max = function (a, b) {
  if (a.i > b.i) {
    return a;
  }
  return b;
};

Cursor.prototype.clone = function () {
  return new Cursor(this.i, this.x, this.y);
};

Cursor.prototype.toString = function () {
  return "[i:" + this.i + " x:" + this.x + " y:" + this.y + "]";
};

Cursor.prototype.copy = function (cursor) {
  this.i = cursor.i;
  this.x = cursor.x;
  this.y = cursor.y;
  this.moved = false;
};

Cursor.prototype.fullhome = function () {
  this.i = 0;
  this.x = 0;
  this.y = 0;
  this.moved = true;
};

Cursor.prototype.fullend = function (lines) {
  this.i = 0;
  var lastLength = 0;
  for (var y = 0; y < lines.length; ++y) {
    var line = lines[y];
    lastLength = line.length;
    this.i += lastLength;
  }
  this.y = lines.length - 1;
  this.x = lastLength;
  this.moved = true;
};

Cursor.prototype.skipleft = function (lines) {
  if (this.x === 0) {
    this.left(lines);
  }
  else {
    var x = this.x - 1;
    var line = lines[this.y];
    var word = reverse(line.substring(0, x));
    var m = word.match(/(\s|\W)+/);
    var dx = m ? (m.index + m[0].length + 1) : word.length;
    this.i -= dx;
    this.x -= dx;
  }
  this.moved = true;
};

Cursor.prototype.left = function (lines) {
  if (this.i > 0) {
    --this.i;
    --this.x;
    if (this.x < 0) {
      --this.y;
      var line = lines[this.y];
      this.x = line.length;
    }
    if (this.reverseFromNewline(lines)) {
      ++this.i;
    }
  }
  this.moved = true;
};

Cursor.prototype.skipright = function (lines) {
  var line = lines[this.y];
  if (this.x === line.length || line[this.x] === '\n') {
    this.right(lines);
  }
  else {
    var x = this.x + 1;
    line = line.substring(x);
    var m = line.match(/(\s|\W)+/);
    var dx = m ? (m.index + m[0].length + 1) : (line.length - this.x);
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline(lines);
  }
  this.moved = true;
};

Cursor.prototype.fixCursor = function (lines) {
  this.x = this.i;
  this.y = 0;
  var total = 0;
  var line = lines[this.y];
  while (this.x > line.length) {
    this.x -= line.length;
    total += line.length;
    if (this.y >= lines.length - 1) {
      this.i = total;
      this.x = line.length;
      this.moved = true;
      break;
    }
    ++this.y;
    line = lines[this.y];
  }
  return this.moved;
};

Cursor.prototype.right = function (lines) {
  this.advanceN(lines, 1);
};

Cursor.prototype.advanceN = function (lines, n) {
  var line = lines[this.y];
  if (this.y < lines.length - 1 || this.x < line.length) {
    this.i += n;
    this.fixCursor(lines);
    line = lines[this.y];
    if (this.x > 0 && line[this.x - 1] === '\n') {
      ++this.y;
      this.x = 0;
    }
  }
  this.moved = true;
};

Cursor.prototype.home = function () {
  this.i -= this.x;
  this.x = 0;
  this.moved = true;
};

Cursor.prototype.end = function (lines) {
  var line = lines[this.y];
  var dx = line.length - this.x;
  this.i += dx;
  this.x += dx;
  this.reverseFromNewline(lines);
  this.moved = true;
};

Cursor.prototype.up = function (lines) {
  if (this.y > 0) {
    --this.y;
    var line = lines[this.y];
    var dx = Math.min(0, line.length - this.x);
    this.x += dx;
    this.i -= line.length - dx;
    this.reverseFromNewline(lines);
  }
  this.moved = true;
};

Cursor.prototype.down = function (lines) {
  if (this.y < lines.length - 1) {
    ++this.y;
    var line = lines[this.y];
    var pLine = lines[this.y - 1];
    var dx = Math.min(0, line.length - this.x);
    this.x += dx;
    this.i += pLine.length + dx;
    this.reverseFromNewline(lines);
  }
  this.moved = true;
};

Cursor.prototype.incY = function (dy, lines) {
  this.y = Math.max(0, Math.min(lines.length - 1, this.y + dy));
  var line = lines[this.y];
  this.x = Math.max(0, Math.min(line.length, this.x));
  this.i = this.x;
  for (var i = 0; i < this.y; ++i) {
    this.i += lines[i].length;
  }
  this.reverseFromNewline(lines);
  this.moved = true;
};

Cursor.prototype.setXY = function (x, y, lines) {
  this.y = Math.max(0, Math.min(lines.length - 1, y));
  var line = lines[this.y];
  this.x = Math.max(0, Math.min(line.length, x));
  this.i = this.x;
  for (var i = 0; i < this.y; ++i) {
    this.i += lines[i].length;
  }
  this.reverseFromNewline(lines);
  this.moved = true;
};

Cursor.prototype.setI = function (i, lines) {
  this.i = i;
  this.fixCursor(lines);
  this.moved = true;
};

Cursor.prototype.reverseFromNewline = function (lines) {
  var line = lines[this.y];
  if (this.x > 0 && line[this.x - 1] === '\n') {
    --this.x;
    --this.i;
    return true;
  }
  return false;
};
return Cursor;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammar = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Grammar",
    parameters: [{
      name: "name",
      type: "String",
      description: "A user-friendly name for the grammar, to be able to include it in an options listing."
    }, {
      name: "rules",
      type: "Array",
      description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
    }],
    description: "A Grammar is a collection of rules for processing text into tokens. Tokens are special characters that tell us about the structure of the text, things like keywords, curly braces, numbers, etc. After the text is tokenized, the tokens get a rough processing pass that groups them into larger elements that can be rendered in color on the screen.\n\
\n\
As tokens are discovered, they are removed from the text being processed, so order is important. Grammar rules are applied in the order they are specified, and more than one rule can produce the same token type.\n\
\n\
See [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names.",
    examples: [{
      name: "A plain-text \"grammar\".",
      description: "Plain text does not actually have a grammar that needs to be processed. However, to get the text to work with the rendering system, a basic grammar is necessary to be able to break the text up into lines and prepare it for rendering.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var plainTextGrammar = new Primrose.Text.Grammar(\n\
    // The name is for displaying in options views.\n\
    \"Plain-text\", [\n\
    // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
    [\"newlines\", /(?:\\r\\n|\\r|\\n)/] \n\
  ] );"
    }, {
      name: "A grammar for BASIC",
      description: "The BASIC programming language is now defunct, but a grammar for it to display in Primrose is quite easy to build.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var basicGrammar = new Primrose.Text.Grammar( \"BASIC\",\n\
    // Grammar rules are applied in the order they are specified.\n\
    [\n\
      // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.\n\
      [ \"newlines\", /(?:\\r\\n|\\r|\\n)/ ],\n\
      // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.\n\
      [ \"lineNumbers\", /^\\d+\\s+/ ],\n\
      // Comments were lines that started with the keyword \"REM\" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.\n\
      [ \"startLineComments\", /^REM\\s/ ],\n\
      // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.\n\
      [ \"strings\", /\"(?:\\\\\"|[^\"])*\"/ ],\n\
      [ \"strings\", /'(?:\\\\'|[^'])*'/ ],\n\
      // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).\n\
      [ \"numbers\", /-?(?:(?:\\b\\d*)?\\.)?\\b\\d+\\b/ ],\n\
      // Keywords are really just a list of different words we want to match, surrounded by the \"word boundary\" selector \"\\b\".\n\
      [ \"keywords\",\n\
        /\\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\\b/\n\
      ],\n\
      // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.\n\
      [ \"keywords\", /^DEF FN/ ],\n\
      // These are all treated as mathematical operations.\n\
      [ \"operators\",\n\
        /(?:\\+|;|,|-|\\*\\*|\\*|\\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\\(|\\)|\\[|\\])/\n\
      ],\n\
      // Once everything else has been matched, the left over blocks of words are treated as variable and function names.\n\
      [ \"identifiers\", /\\w+\\$?/ ]\n\
    ] );"
    }]
});

function Grammar(name, rules) {
  pliny.property({
    parent: "Primrose.Text.Grammar",
    name: " name",
    type: "String",
    description: "A user-friendly name for the grammar, to be able to include it in an options listing."
  });
  this.name = name;

  pliny.property({
    parent: "Primrose.Text.Grammar",
    name: "grammar",
    type: "Array",
    description: "A collection of rules to apply to tokenize text. The rules should be an array of two-element arrays. The first element should be a token name (see [`Primrose.Text.Rule`](#Primrose_Text_Rule) for a list of valid token names), followed by a regular expression that selects the token out of the source code."
  });
  // clone the preprocessing grammar to start a new grammar
  this.grammar = rules.map(function (rule) {
    return new Primrose.Text.Rule(rule[0], rule[1]);
  });

  function crudeParsing(tokens) {
    var commentDelim = null,
      stringDelim = null,
      line = 0,
      i, t;
    for (i = 0; i < tokens.length; ++i) {
      t = tokens[i];
      t.line = line;
      if (t.type === "newlines") {
        ++line;
      }

      if (stringDelim) {
        if (t.type === "stringDelim" && t.value === stringDelim && (i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
          stringDelim = null;
        }
        if (t.type !== "newlines") {
          t.type = "strings";
        }
      }
      else if (commentDelim) {
        if (commentDelim === "startBlockComments" && t.type === "endBlockComments" ||
          commentDelim === "startLineComments" && t.type === "newlines") {
          commentDelim = null;
        }
        if (t.type !== "newlines") {
          t.type = "comments";
        }
      }
      else if (t.type === "stringDelim") {
        stringDelim = t.value;
        t.type = "strings";
      }
      else if (t.type === "startBlockComments" || t.type === "startLineComments") {
        commentDelim = t.type;
        t.type = "comments";
      }
    }

    // recombine like-tokens
    for (i = tokens.length - 1; i > 0; --i) {
      var p = tokens[i - 1];
      t = tokens[i];
      if (p.type === t.type && p.type !== "newlines") {
        p.value += t.value;
        tokens.splice(i, 1);
      }
    }
  }

  Grammar.prototype.toHTML = function (txt, theme) {
    theme = theme || Primrose.Text.Themes.Default;
    var tokenRows = this.tokenize(txt),
      temp = document.createElement("div");
    for (var y = 0; y < tokenRows.length; ++y) {
      // draw the tokens on this row
      var t = tokenRows[y];
      if (t.type === "newlines") {
        temp.appendChild(document.createElement("br"));
      }
      else {
        var style = theme[t.type] || {},
          elem = document.createElement("span");
        elem.style.fontWeight = style.fontWeight || theme.regular.fontWeight;
        elem.style.fontStyle = style.fontStyle || theme.regular.fontStyle || "";
        elem.style.color = style.foreColor || theme.regular.foreColor;
        elem.style.backgroundColor = style.backColor || theme.regular.backColor;
        elem.style.fontFamily = style.fontFamily || theme.fontFamily;
        elem.appendChild(document.createTextNode(t.value));
        temp.appendChild(elem);
      }
    }
    return temp.innerHTML;
  };

  pliny.method({
    parent: "Primrose.Text.Grammar",
    name: "tokenize",
    parameters: [{
      name: "text",
      type: "String",
      description: "The text to tokenize."
    }],
    returns: "An array of tokens, ammounting to drawing instructions to the renderer. However, they still need to be layed out to fit the bounds of the text area.",
    description: "Breaks plain text up into a list of tokens that can later be rendered with color.",
    examples: [{
      name: 'Tokenize some JavaScript',
      description: 'Primrose comes with a grammar for JavaScript built in.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var tokens = new Primrose.Text.Grammars.JavaScript\n\
    .tokenize("var x = 3;\\n\\\n\
  var y = 2;\\n\\\n\
  console.log(x + y);");\n\
  console.log(JSON.stringify(tokens));\n\
\n\
## Result:\n\
\n\
  grammar(\"JavaScript\");\n\
  [ \n\
    { "value": "var", "type": "keywords", "index": 0, "line": 0 },\n\
    { "value": " x = ", "type": "regular", "index": 3, "line": 0 },\n\
    { "value": "3", "type": "numbers", "index": 8, "line": 0 },\n\
    { "value": ";", "type": "regular", "index": 9, "line": 0 },\n\
    { "value": "\\n", "type": "newlines", "index": 10, "line": 0 },\n\
    { "value": " y = ", "type": "regular", "index": 11, "line": 1 },\n\
    { "value": "2", "type": "numbers", "index": 16, "line": 1 },\n\
    { "value": ";", "type": "regular", "index": 17, "line": 1 },\n\
    { "value": "\\n", "type": "newlines", "index": 18, "line": 1 },\n\
    { "value": "console", "type": "members", "index": 19, "line": 2 },\n\
    { "value": ".", "type": "regular", "index": 26, "line": 2 },\n\
    { "value": "log", "type": "functions", "index": 27, "line": 2 },\n\
    { "value": "(x + y);", "type": "regular", "index": 30, "line": 2 }\n\
  ]'
    }]
  });
  this.tokenize = function (text) {
    // all text starts off as regular text, then gets cut up into tokens of
    // more specific type
    var tokens = [new Primrose.Text.Token(text, "regular", 0)];
    for (var i = 0; i < this.grammar.length; ++i) {
      var rule = this.grammar[i];
      for (var j = 0; j < tokens.length; ++j) {
        rule.carveOutMatchedToken(tokens, j);
      }
    }

    crudeParsing(tokens);
    return tokens;
  };
}
return Grammar;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammars = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "Grammars",
  description: "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting."
});
const Grammars = {};
return Grammars;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.OperatingSystem = factory();
  }
}(this, function() {
"use strict";

function setCursorCommand(obj, mod, key, func, cur) {
  var name = mod + "_" + key;
  obj[name] = function (prim, tokenRows) {
    prim["cursor" + func](tokenRows, prim[cur + "Cursor"]);
  };
}

function makeCursorCommand(obj, baseMod, key, func) {
  setCursorCommand(obj, baseMod || "NORMAL", key, func, "front");
  setCursorCommand(obj, baseMod + "SHIFT", key, func, "back");
}

pliny.class({
  parent: "Primrose.Text",
    name: "OperatingSystem",
    description: "| [under construction]"
});
class OperatingSystem {
  constructor(name, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
    var pre4 = pre3;
    pre3 = pre3.length > 0 ? pre3 : "NORMAL";

    this[pre1 + "_a"] = "SELECT_ALL";
    this[pre1 + "_c"] = "COPY";
    this[pre1 + "_x"] = "CUT";
    this[pre1 + "_v"] = "PASTE";
    this[redo] = "REDO";
    this[pre1 + "_z"] = "UNDO";
    this[pre1 + "_DOWNARROW"] = "WINDOW_SCROLL_DOWN";
    this[pre1 + "_UPARROW"] = "WINDOW_SCROLL_UP";
    this[pre2 + "_LEFTARROW"] = "NORMAL_SKIPLEFT";
    this[pre2 + "SHIFT_LEFTARROW"] = "SHIFT_SKIPLEFT";
    this[pre2 + "_RIGHTARROW"] = "NORMAL_SKIPRIGHT";
    this[pre2 + "SHIFT_RIGHTARROW"] = "SHIFT_SKIPRIGHT";
    this[pre3 + "_HOME"] = "NORMAL_HOME";
    this[pre4 + "SHIFT_HOME"] = "SHIFT_HOME";
    this[pre3 + "_END"] = "NORMAL_END";
    this[pre4 + "SHIFT_END"] = "SHIFT_END";
    this[pre5 + "_HOME"] = "CTRL_HOME";
    this[pre5 + "SHIFT_HOME"] = "CTRLSHIFT_HOME";
    this[pre5 + "_END"] = "CTRL_END";
    this[pre5 + "SHIFT_END"] = "CTRLSHIFT_END";

    this._deadKeyState = "";
  }

  makeCommandName(evt, codePage) {
    var key = evt.keyCode;
    if (key !== Primrose.Keys.CTRL &&
      key !== Primrose.Keys.ALT &&
      key !== Primrose.Keys.META_L &&
      key !== Primrose.Keys.META_R &&
      key !== Primrose.Keys.SHIFT) {

      var oldDeadKeyState = this._deadKeyState,
        commandName = this._deadKeyState;

      if (evt.ctrlKey) {
        commandName += "CTRL";
      }
      if (evt.altKey) {
        commandName += "ALT";
      }
      if (evt.metaKey) {
        commandName += "META";
      }
      if (evt.shiftKey) {
        commandName += "SHIFT";
      }
      if (commandName === this._deadKeyState) {
        commandName += "NORMAL";
      }

      commandName += "_" + codePage.keyNames[key];

      return this[commandName] || commandName;
    }
  }
}
return OperatingSystem;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.OperatingSystems = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "OperatingSystems",
  description: "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems."
});
const OperatingSystems = {};
return OperatingSystems;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Point = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Point",
    description: "| [under construction]"
});

function Point(x, y) {
  this.set(x || 0, y || 0);
}

Point.prototype.set = function (x, y) {
  this.x = x;
  this.y = y;
};

Point.prototype.copy = function (p) {
  if (p) {
    this.x = p.x;
    this.y = p.y;
  }
};

Point.prototype.clone = function () {
  return new Point(this.x, this.y);
};

Point.prototype.toString = function () {
  return "(x:" + this.x + ", y:" + this.y + ")";
};
return Point;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Rectangle = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Rectangle",
    description: "| [under construction]"
});
class Rectangle {
  constructor(x, y, width, height) {
    this.point = new Primrose.Text.Point(x, y);
    this.size = new Primrose.Text.Size(width, height);
  }

  get x() {
    return this.point.x;
  }

  set x(x) {
    this.point.x = x;
  }

  get left() {
    return this.point.x;
  }
  set left(x) {
    this.point.x = x;
  }

  get width() {
    return this.size.width;
  }
  set width(width) {
    this.size.width = width;
  }

  get right() {
    return this.point.x + this.size.width;
  }
  set right(right) {
    this.point.x = right - this.size.width;
  }

  get y() {
    return this.point.y;
  }
  set y(y) {
    this.point.y = y;
  }

  get top() {
    return this.point.y;
  }
  set top(y) {
    this.point.y = y;
  }

  get height() {
    return this.size.height;
  }
  set height(height) {
    this.size.height = height;
  }

  get bottom() {
    return this.point.y + this.size.height;
  }
  set bottom(bottom) {
    this.point.y = bottom - this.size.height;
  }

  get area() {
    return this.width * this.height;
  }

  set(x, y, width, height) {
    this.point.set(x, y);
    this.size.set(width, height);
  }

  copy(r) {
    if (r) {
      this.point.copy(r.point);
      this.size.copy(r.size);
    }
  }

  clone() {
    return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
  }

  toString() {
    return `[${this.point.toString()} x ${this.size.toString()}]`;
  }

  overlap(r) {
    var left = Math.max(this.left, r.left),
      top = Math.max(this.top, r.top),
      right = Math.min(this.right, r.right),
      bottom = Math.min(this.bottom, r.bottom);
    if (right > left && bottom > top) {
      return new Rectangle(left, top, right - left, bottom - top);
    }
  }
}
return Rectangle;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Rule = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Rule",
    description: "| [under construction]"
});

function Rule(name, test) {
  this.name = name;
  this.test = test;
}

Rule.prototype.carveOutMatchedToken = function (tokens, j) {
  var token = tokens[j];
  if (token.type === "regular") {
    var res = this.test.exec(token.value);
    if (res) {
      // Only use the last group that matches the regex, to allow for more
      // complex regexes that can match in special contexts, but not make
      // the context part of the token.
      var midx = res[res.length - 1],
        start = res.input.indexOf(midx),
        end = start + midx.length;
      if (start === 0) {
        // the rule matches the start of the token
        token.type = this.name;
        if (end < token.value.length) {
          // but not the end
          var next = token.splitAt(end);
          next.type = "regular";
          tokens.splice(j + 1, 0, next);
        }
      }
      else {
        // the rule matches from the middle of the token
        var mid = token.splitAt(start);
        if (midx.length < mid.value.length) {
          // but not the end
          var right = mid.splitAt(midx.length);
          tokens.splice(j + 1, 0, right);
        }
        mid.type = this.name;
        tokens.splice(j + 1, 0, mid);
      }
    }
  }
};
return Rule;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Size = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Size",
    description: "| [under construction]"
});

function Size(width, height) {
  this.set(width || 0, height || 0);
}

Size.prototype.set = function (width, height) {
  this.width = width;
  this.height = height;
};

Size.prototype.copy = function (s) {
  if (s) {
    this.width = s.width;
    this.height = s.height;
  }
};

Size.prototype.clone = function () {
  return new Size(this.width, this.height);
};

Size.prototype.toString = function () {
  return "<w:" + this.width + ", h:" + this.height + ">";
};
return Size;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Terminal = factory();
  }
}(this, function() {
pliny.class({
  parent: "Primrose.Text",
    name: "Terminal",
    description: "| [under construction]"
});
class Terminal {
  constructor(inputEditor, outputEditor) {
    outputEditor = outputEditor || inputEditor;

    var inputCallback = null,
      currentProgram = null,
      originalGrammar = null,
      currentEditIndex = 0,
      pageSize = 40,
      outputQueue = [],
      buffer = "",
      restoreInput = inputEditor === outputEditor,
      self = this;

    this.running = false;
    this.waitingForInput = false;

    function toEnd(editor) {
      editor.selectionStart = editor.selectionEnd = editor.value.length;
      editor.scrollIntoView(editor.frontCursor);
    }

    function done() {
      if (self.running) {
        flush();
        self.running = false;
        if (restoreInput) {
          inputEditor.tokenizer = originalGrammar;
          inputEditor.value = currentProgram;
        }
        toEnd(inputEditor);
      }
    }

    function clearScreen() {
      outputEditor.selectionStart = outputEditor.selectionEnd = 0;
      outputEditor.value = "";
      return true;
    }

    function flush() {
      if (buffer.length > 0) {
        var lines = buffer.split("\n");
        for (var i = 0; i < pageSize && lines.length > 0; ++i) {
          outputQueue.push(lines.shift());
        }
        if (lines.length > 0) {
          outputQueue.push(" ----- more -----");
        }
        buffer = lines.join("\n");
      }
    }

    function input(callback) {
      inputCallback = callback;
      self.waitingForInput = true;
      flush();
    }

    function stdout(str) {
      buffer += str;
    }

    this.sendInput = function (evt) {
      if (buffer.length > 0) {
        flush();
      }
      else {
        outputEditor.keyDown(evt);
        var str = outputEditor.value.substring(currentEditIndex);
        inputCallback(str.trim());
        inputCallback = null;
        this.waitingForInput = false;
      }
    };

    this.execute = function () {
      pageSize = 10;
      originalGrammar = inputEditor.tokenizer;
      if (originalGrammar && originalGrammar.interpret) {
        this.running = true;
        var looper,
          next = function () {
            if (self.running) {
              setTimeout(looper, 1);
            }
          };

        currentProgram = inputEditor.value;
        looper = originalGrammar.interpret(currentProgram, input, stdout,
          stdout, next, clearScreen, this.loadFile.bind(this), done);
        outputEditor.tokenizer = Primrose.Text.Grammars.PlainText;
        clearScreen();
        next();
      }
    };

    this.loadFile = function (fileName) {
      return Primrose.HTTP.getText(fileName.toLowerCase())
        .then(function (file) {
          if (isOSX) {
            file = file.replace("CTRL+SHIFT+SPACE", "CMD+OPT+E");
          }
          inputEditor.value = currentProgram = file;
          return file;
        });
    };

    this.update = function () {
      if (outputQueue.length > 0) {
        outputEditor.value += outputQueue.shift() + "\n";
        toEnd(outputEditor);
        currentEditIndex = outputEditor.selectionStart;
      }
    };
  }
}
return Terminal;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Themes = factory();
  }
}(this, function() {
"use strict";

pliny.namespace({
  parent: "Primrose.Text",
  name: "Themes",
  description: "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar."
});
const Themes = {};
return Themes;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Token = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text",
    name: "Token",
    description: "| [under construction]"
});

function Token(value, type, index, line) {
  this.value = value;
  this.type = type;
  this.index = index;
  this.line = line;
}

Token.prototype.clone = function () {
  return new Token(this.value, this.type, this.index, this.line);
};

Token.prototype.splitAt = function (i) {
  var next = this.value.substring(i);
  this.value = this.value.substring(0, i);
  return new Token(next, this.type, this.index + i, this.line);
};

Token.prototype.toString = function () {
  return "[" + this.type + ": " + this.value + "]";
};
return Token;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.X.LoginForm = factory();
  }
}(this, function() {

"use strict";

var COUNTER = 0;

const WIDTH = 512,
  HEIGHT = 150;

pliny.class({
  parent: "Primrose.X",
    name: "LoginForm",
    baseClass: "Primrose.Controls.Form",
    description: "A basic authentication form."
});
class LoginForm extends Primrose.Controls.Form {

  static create() {
    return new LoginForm();
  }

  constructor() {
    super({
      id: `Primrose.X.LoginForm[${COUNTER++}]`,
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    });

    this.listeners.login = [];
    this.listeners.signup = [];

    this.labelUserName = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelUserName",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "User name:",
      textAlign: "right"
    });

    this.userName = new Primrose.Text.Controls.TextInput({
      id: this.id + "-userName",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 3),
      fontSize: 32
    });

    this.labelPassword = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelPassword",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Password:",
      textAlign: "right"
    });

    this.password = new Primrose.Text.Controls.TextInput({
      id: this.id + "-password",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      passwordCharacter: "*"
    });

    this.signupButton = new Primrose.Controls.Button2D({
      id: this.id + "-signupButton",
      bounds: new Primrose.Text.Rectangle(0, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Sign up"
    });

    this.loginButton = new Primrose.Controls.Button2D({
      id: this.id + "-loginButton",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Login"
    });

    this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", {
      target: this
    }), false);
    this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", {
      target: this
    }), false);

    this.appendChild(this.labelUserName);
    this.appendChild(this.userName);
    this.appendChild(this.labelPassword);
    this.appendChild(this.password);
    this.appendChild(this.signupButton);
    this.appendChild(this.loginButton);
  }
}
return LoginForm;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.X.SignupForm = factory();
  }
}(this, function() {
"use strict";

const WIDTH = 512,
  HEIGHT = 200;

let COUNTER = 0;

pliny.class({
  parent: "Primrose.X",
    name: "SignupForm",
    baseClass: "Primrose.Controls.Form",
    description: "A basic registration form."
});
class SignupForm extends Primrose.Controls.Form {
  constructor() {

    super({
      id: `Primrose.X.SignupForm[${COUNTER++}]`,
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    });

    this.listeners.login = [];
    this.listeners.signup = [];

    this.labelEmail = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelEmail",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Email:",
      textAlign: "right"
    });

    this.email = new Primrose.Text.Controls.TextInput({
      id: this.id + "-email",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    this.labelUserName = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelUserName",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "User name:",
      textAlign: "right"
    });

    this.userName = new Primrose.Text.Controls.TextInput({
      id: this.id + "-userName",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    this.labelPassword = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelPassword",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Password:",
      textAlign: "right"
    });

    this.password = new Primrose.Text.Controls.TextInput({
      id: this.id + "-password",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      passwordCharacter: "*"
    });

    this.loginButton = new Primrose.Controls.Button2D({
      id: this.id + "-loginButton",
      bounds: new Primrose.Text.Rectangle(0, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Log in"
    });

    this.signupButton = new Primrose.Controls.Button2D({
      id: this.id + "-signupButton",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Sign up"
    });

    this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", {
      target: this
    }), false);
    this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", {
      target: this
    }), false);

    this.appendChild(this.labelUserName);
    this.appendChild(this.userName);
    this.appendChild(this.labelEmail);
    this.appendChild(this.email);
    this.appendChild(this.labelPassword);
    this.appendChild(this.password);
    this.appendChild(this.loginButton);
    this.appendChild(this.signupButton);
  }
}
return SignupForm;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePages.DE_QWERTZ = factory();
  }
}(this, function() {
"use strict";

var CodePage = Primrose.Text.CodePage;

pliny.record({
  parent: "Primrose.Text.CodePages",
  name: "DE_QWERTZ",
  description: "| [under construction]"
});
const DE_QWERTZ = new CodePage("Deutsch: QWERTZ", "de", {
  deadKeys: [220, 221, 160, 192],
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "60": "<",
    "63": "ß",
    "160": CodePage.DEAD(3),
    "163": "#",
    "171": "+",
    "173": "-",
    "186": "ü",
    "187": "+",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "#",
    "192": CodePage.DEAD(4),
    "219": "ß",
    "220": CodePage.DEAD(1),
    "221": CodePage.DEAD(2),
    "222": "ä",
    "226": "<"
  },
  DEAD1NORMAL: {
    "65": "â",
    "69": "ê",
    "73": "î",
    "79": "ô",
    "85": "û",
    "190": "."
  },
  DEAD2NORMAL: {
    "65": "á",
    "69": "é",
    "73": "í",
    "79": "ó",
    "83": "s",
    "85": "ú",
    "89": "ý"
  },
  SHIFT: {
    "32": " ",
    "48": "=",
    "49": "!",
    "50": "\"",
    "51": "§",
    "52": "$",
    "53": "%",
    "54": "&",
    "55": "/",
    "56": "(",
    "57": ")",
    "60": ">",
    "63": "?",
    "163": "'",
    "171": "*",
    "173": "_",
    "186": "Ü",
    "187": "*",
    "188": ";",
    "189": "_",
    "190": ":",
    "191": "'",
    "192": "Ö",
    "219": "?",
    "222": "Ä",
    "226": ">"
  },
  CTRLALT: {
    "48": "}",
    "50": "²",
    "51": "³",
    "55": "{",
    "56": "[",
    "57": "]",
    "60": "|",
    "63": "\\",
    "69": "€",
    "77": "µ",
    "81": "@",
    "171": "~",
    "187": "~",
    "219": "\\",
    "226": "|"
  },
  CTRLALTSHIFT: {
    "63": "ẞ",
    "219": "ẞ"
  },
  DEAD3NORMAL: {
    "65": "a",
    "69": "e",
    "73": "i",
    "79": "o",
    "85": "u",
    "190": "."
  },
  DEAD4NORMAL: {
    "65": "a",
    "69": "e",
    "73": "i",
    "79": "o",
    "83": "s",
    "85": "u",
    "89": "y"
  }
});
return DE_QWERTZ;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePages.EN_UKX = factory();
  }
}(this, function() {
"use strict";
var CodePage = Primrose.Text.CodePage;

pliny.record({
  parent: "Primrose.Text.CodePages",
  name: "EN_UKX",
  description: "| [under construction]"
});
const EN_UKX = new CodePage("English: UK Extended", "en-GB", {
  CTRLALT: {
    "52": "€",
    "65": "á",
    "69": "é",
    "73": "í",
    "79": "ó",
    "85": "ú",
    "163": "\\",
    "192": "¦",
    "222": "\\",
    "223": "¦"
  },
  CTRLALTSHIFT: {
    "65": "Á",
    "69": "É",
    "73": "Í",
    "79": "Ó",
    "85": "Ú",
    "222": "|"
  },
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "59": ";",
    "61": "=",
    "163": "#",
    "173": "-",
    "186": ";",
    "187": "=",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "/",
    "192": "'",
    "219": "[",
    "220": "\\",
    "221": "]",
    "222": "#",
    "223": "`"
  },
  SHIFT: {
    "32": " ",
    "48": ")",
    "49": "!",
    "50": "\"",
    "51": "£",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "59": ":",
    "61": "+",
    "163": "~",
    "173": "_",
    "186": ":",
    "187": "+",
    "188": "<",
    "189": "_",
    "190": ">",
    "191": "?",
    "192": "@",
    "219": "{",
    "220": "|",
    "221": "}",
    "222": "~",
    "223": "¬"
  }
});
return EN_UKX;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePages.EN_US = factory();
  }
}(this, function() {
"use strict";

var CodePage = Primrose.Text.CodePage;

pliny.record({
  parent: "Primrose.Text.CodePages",
  name: "EN_US",
  description: "| [under construction]"
});
const EN_US = new CodePage("English: USA", "en-US", {
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "59": ";",
    "61": "=",
    "173": "-",
    "186": ";",
    "187": "=",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "/",
    "219": "[",
    "220": "\\",
    "221": "]",
    "222": "'"
  },
  SHIFT: {
    "32": " ",
    "48": ")",
    "49": "!",
    "50": "@",
    "51": "#",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "59": ":",
    "61": "+",
    "173": "_",
    "186": ":",
    "187": "+",
    "188": "<",
    "189": "_",
    "190": ">",
    "191": "?",
    "219": "{",
    "220": "|",
    "221": "}",
    "222": "\""
  }
});
return EN_US;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CodePages.FR_AZERTY = factory();
  }
}(this, function() {
"use strict";

var CodePage = Primrose.Text.CodePage;

pliny.record({
  parent: "Primrose.Text.CodePages",
  name: "FR_AZERTY",
  description: "| [under construction]"
});
const FR_AZERTY = new CodePage("Français: AZERTY", "fr", {
  deadKeys: [221, 50, 55],
  NORMAL: {
    "32": " ",
    "48": "à",
    "49": "&",
    "50": "é",
    "51": "\"",
    "52": "'",
    "53": "(",
    "54": "-",
    "55": "è",
    "56": "_",
    "57": "ç",
    "186": "$",
    "187": "=",
    "188": ",",
    "190": ";",
    "191": ":",
    "192": "ù",
    "219": ")",
    "220": "*",
    "221": CodePage.DEAD(1),
    "222": "²",
    "223": "!",
    "226": "<"
  },
  SHIFT: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "186": "£",
    "187": "+",
    "188": "?",
    "190": ".",
    "191": "/",
    "192": "%",
    "219": "°",
    "220": "µ",
    "223": "§",
    "226": ">"
  },
  CTRLALT: {
    "48": "@",
    "50": CodePage.DEAD(2),
    "51": "#",
    "52": "{",
    "53": "[",
    "54": "|",
    "55": CodePage.DEAD(3),
    "56": "\\",
    "57": "^",
    "69": "€",
    "186": "¤",
    "187": "}",
    "219": "]"
  },
  DEAD1NORMAL: {
    "65": "â",
    "69": "ê",
    "73": "î",
    "79": "ô",
    "85": "û"
  },
  DEAD2NORMAL: {
    "65": "ã",
    "78": "ñ",
    "79": "õ"
  },
  DEAD3NORMAL: {
    "48": "à",
    "50": "é",
    "55": "è",
    "65": "à",
    "69": "è",
    "73": "ì",
    "79": "ò",
    "85": "ù"
  }
});
return FR_AZERTY;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CommandPacks.BasicTextInput = factory();
  }
}(this, function() {
"use strict";

pliny.record({
  parent: "Primrose.Text.CommandPacks",
  name: "TextInput",
  baseClass: "Primrose.Text.CommandPack",
  description: "| [under construction]"
});
class BasicTextInput extends Primrose.Text.CommandPack {
  constructor(additionalName, additionalCommands) {
    var commands = {
      NORMAL_LEFTARROW: function (prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPLEFT: function (prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_RIGHTARROW: function (prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPRIGHT: function (prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.frontCursor);
      },
      NORMAL_HOME: function (prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.frontCursor);
      },
      NORMAL_END: function (prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.frontCursor);
      },
      NORMAL_BACKSPACE: function (prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.left(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_ENTER: function (prim, tokenRows, currentToken) {
        emit.call(prim, "change", {
          target: prim
        });
      },
      NORMAL_DELETE: function (prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.backCursor.right(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_TAB: function (prim, tokenRows) {
        prim.selectedText = prim.tabString;
      },

      SHIFT_LEFTARROW: function (prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPLEFT: function (prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.backCursor);
      },
      SHIFT_RIGHTARROW: function (prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPRIGHT: function (prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.backCursor);
      },
      SHIFT_HOME: function (prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.backCursor);
      },
      SHIFT_END: function (prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.backCursor);
      },
      SHIFT_DELETE: function (prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.home(tokenRows);
          prim.backCursor.end(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      CTRL_HOME: function (prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.frontCursor);
      },
      CTRL_END: function (prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.frontCursor);
      },

      CTRLSHIFT_HOME: function (prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.backCursor);
      },
      CTRLSHIFT_END: function (prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.backCursor);
      },

      SELECT_ALL: function (prim, tokenRows) {
        prim.frontCursor.fullhome(tokenRows);
        prim.backCursor.fullend(tokenRows);
      },

      REDO: function (prim, tokenRows) {
        prim.redo();
        prim.scrollIntoView(prim.frontCursor);
      },
      UNDO: function (prim, tokenRows) {
        prim.undo();
        prim.scrollIntoView(prim.frontCursor);
      }
    };

    if (additionalCommands) {
      for (var key in additionalCommands) {
        commands[key] = additionalCommands[key];
      }
    }

    super(additionalName || "Text editor commands", commands);
  }
}
return BasicTextInput;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CommandPacks.TextEditor = factory();
  }
}(this, function() {
"use strict";

pliny.record({
  parent: "Primrose.Text.CommandPacks",
  name: "TextEditor",
  description: "| [under construction]"
});
const TextEditor = new Primrose.Text.CommandPacks.BasicTextInput(
  "Text Area input commands", {
    NORMAL_UPARROW: function (prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.frontCursor);
    },
    NORMAL_DOWNARROW: function (prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEUP: function (prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.frontCursor);
    },
    NORMAL_PAGEDOWN: function (prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.frontCursor);
    },
    NORMAL_ENTER: function (prim, tokenRows, currentToken) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
        indent = tokenRow[0].value;
      }
      prim.selectedText = "\n" + indent;
      prim.scrollIntoView(prim.frontCursor);
    },

    SHIFT_UPARROW: function (prim, tokenRows) {
      prim.cursorUp(tokenRows, prim.backCursor);
    },
    SHIFT_DOWNARROW: function (prim, tokenRows) {
      prim.cursorDown(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEUP: function (prim, tokenRows) {
      prim.cursorPageUp(tokenRows, prim.backCursor);
    },
    SHIFT_PAGEDOWN: function (prim, tokenRows) {
      prim.cursorPageDown(tokenRows, prim.backCursor);
    },

    WINDOW_SCROLL_DOWN: function (prim, tokenRows) {
      if (prim.scroll.y < tokenRows.length) {
        ++prim.scroll.y;
      }
    },
    WINDOW_SCROLL_UP: function (prim, tokenRows) {
      if (prim.scroll.y > 0) {
        --prim.scroll.y;
      }
    }
  });
return TextEditor;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.CommandPacks.TextInput = factory();
  }
}(this, function() {
////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
"use strict";

pliny.record({
  parent: "Primrose.Text.CommandPacks",
  name: "TextInput",
  description: "| [under construction]"
});
const TextInput = new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
return TextInput;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Controls.PlainText = factory();
  }
}(this, function() {
"use strict";

pliny.class({
  parent: "Primrose.Text.Controls",
    name: "PlainText",
    description: "| [under construction]"
});

function PlainText(text, size, fgcolor, bgcolor, x, y, z, hAlign) {
  text = text.replace(/\r\n/g, "\n");
  var lines = text.split("\n");
  hAlign = hAlign || "center";
  var lineHeight = (size * 1000);
  var boxHeight = lineHeight * lines.length;

  var textCanvas = document.createElement("canvas");
  var textContext = textCanvas.getContext("2d");
  textContext.font = lineHeight + "px Arial";
  var width = textContext.measureText(text)
    .width;

  textCanvas.width = width;
  textCanvas.height = boxHeight;
  textContext.font = lineHeight * 0.8 + "px Arial";
  if (bgcolor !== "transparent") {
    textContext.fillStyle = bgcolor;
    textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
  }
  textContext.fillStyle = fgcolor;

  for (var i = 0; i < lines.length; ++i) {
    textContext.fillText(lines[i], 0, i * lineHeight);
  }

  var texture = new THREE.Texture(textCanvas);
  texture.needsUpdate = true;

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: bgcolor === "transparent",
    useScreenCoordinates: false,
    color: 0xffffff,
    shading: THREE.FlatShading
  });

  var textGeometry = new THREE.PlaneGeometry(size * width / lineHeight,
    size * lines.length);
  textGeometry.computeBoundingBox();
  textGeometry.computeVertexNormals();

  var textMesh = new THREE.Mesh(textGeometry, material);
  if (hAlign === "left") {
    x -= textGeometry.boundingBox.min.x;
  }
  else if (hAlign === "right") {
    x += textGeometry.boundingBox.min.x;
  }
  textMesh.position.set(x, y, z);
  return textMesh;
}
return PlainText;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Controls.TextBox = factory();
  }
}(this, function() {
"use strict";

var SCROLL_SCALE = isFirefox ? 3 : 100,
  COUNTER = 0,
  OFFSET = 5;

pliny.class({
  parent: "Primrose.Text.Controls",
    name: "TextBox",
    description: "Syntax highlighting textbox control.",
    baseClass: "Primrose.Surface",
    parameters: [{
      name: "idOrCanvasOrContext",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the TextBox."
    }]
});
class TextBox extends Primrose.Surface {

  static create() {
    return new TextBox();
  }

  constructor(options) {
    super(patch(options, {
      id: "Primrose.Text.Controls.TextBox[" + (COUNTER++) + "]"
    }));
    this.listeners.change = [];
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    if (typeof options === "string") {
      this.options = {
        value: this.options
      };
    }
    else {
      this.options = options || {};
    }

    this.useCaching = !isFirefox || !isMobile;

    var makeCursorCommand = function (name) {
      var method = name.toLowerCase();
      this["cursor" + name] = function (lines, cursor) {
        cursor[method](lines);
        this.scrollIntoView(cursor);
      };
    };

    ["Left", "Right",
      "SkipLeft", "SkipRight",
      "Up", "Down",
      "Home", "End",
      "FullHome", "FullEnd"
    ].map(makeCursorCommand.bind(this));

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    this.tokens = null;
    this.lines = null;
    this._commandPack = null;
    this._tokenRows = null;
    this._tokenHashes = null;
    this._tabString = null;
    this._currentTouchID = null;
    this._lineCountWidth = null;

    this._lastFont = null;
    this._lastText = null;
    this._lastCharacterWidth = null;
    this._lastCharacterHeight = null;
    this._lastGridBounds = null;
    this._lastPadding = null;
    this._lastFrontCursor = null;
    this._lastBackCursor = null;
    this._lastWidth = -1;
    this._lastHeight = -1;
    this._lastScrollX = -1;
    this._lastScrollY = -1;
    this._lastFocused = false;
    this._lastThemeName = null;
    this._lastPointer = new Primrose.Text.Point();

    // different browsers have different sets of keycodes for less-frequently
    // used keys like curly brackets.
    this._browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
    this._pointer = new Primrose.Text.Point();
    this._deadKeyState = "";
    this._history = [];
    this._historyFrame = -1;
    this._topLeftGutter = new Primrose.Text.Size();
    this._bottomRightGutter = new Primrose.Text.Size();
    this._dragging = false;
    this._scrolling = false;
    this._wheelScrollSpeed = 4;
    var subBounds = new Primrose.Text.Rectangle(0, 0, this.bounds.width, this.bounds.height);
    this._fg = new Primrose.Surface({
      id: this.id + "-fore",
      bounds: subBounds
    });
    this._fgCanvas = this._fg.canvas;
    this._fgfx = this._fg.context;
    this._bg = new Primrose.Surface({
      id: this.id + "-back",
      bounds: subBounds
    });
    this._bgCanvas = this._bg.canvas;
    this._bgfx = this._bg.context;
    this._trim = new Primrose.Surface({
      id: this.id + "-trim",
      bounds: subBounds
    });
    this._trimCanvas = this._trim.canvas;
    this._tgfx = this._trim.context;
    this._rowCache = {};
    this._VSCROLL_WIDTH = 2;

    this.tabWidth = this.options.tabWidth;
    this.showLineNumbers = !this.options.hideLineNumbers;
    this.showScrollBars = !this.options.hideScrollBars;
    this.wordWrap = !this.options.disableWordWrap;
    this.readOnly = !!this.options.readOnly;
    this.multiline = !this.options.singleLine;
    this.gridBounds = new Primrose.Text.Rectangle();
    this.frontCursor = new Primrose.Text.Cursor();
    this.backCursor = new Primrose.Text.Cursor();
    this.scroll = new Primrose.Text.Point();
    this.character = new Primrose.Text.Size();
    this.theme = this.options.theme;
    this.fontSize = this.options.fontSize;
    this.tokenizer = this.options.tokenizer;
    this.commandPack = this.options.commands || Primrose.Text.CommandPacks.TextEditor;
    this.value = this.options.value;
    this.padding = this.options.padding || 1;

    this.addEventListener("focus", this.render.bind(this), false);
    this.addEventListener("blur", this.render.bind(this), false);
  }

  cursorPageUp(lines, cursor) {
    cursor.incY(-this.gridBounds.height, lines);
    this.scrollIntoView(cursor);
  }

  cursorPageDown(lines, cursor) {
    cursor.incY(this.gridBounds.height, lines);
    this.scrollIntoView(cursor);
  }

  setDeadKeyState(st) {
    this._deadKeyState = st || "";
  }

  get value() {
    return this._history[this._historyFrame].join("\n");
  }

  set value(txt) {
    txt = txt || "";
    txt = txt.replace(/\r\n/g, "\n");
    if (!this.multiline) {
      txt = txt.replace(/\n/g, "");
    }
    var lines = txt.split("\n");
    this.pushUndo(lines);
    this.render();
    emit.call(this, "change", {
      target: this
    });
  }

  get selectedText() {
    var minCursor = Primrose.Text.Cursor.min(this.frontCursor, this.backCursor),
      maxCursor = Primrose.Text.Cursor.max(this.frontCursor, this.backCursor);
    return this.value.substring(minCursor.i, maxCursor.i);
  }

  set selectedText(str) {
    str = str || "";
    str = str.replace(/\r\n/g, "\n");

    if (this.frontCursor.i !== this.backCursor.i || str.length > 0) {
      var minCursor = Primrose.Text.Cursor.min(this.frontCursor, this.backCursor),
        maxCursor = Primrose.Text.Cursor.max(this.frontCursor, this.backCursor),
        // TODO: don't recalc the string first.
        text = this.value,
        left = text.substring(0, minCursor.i),
        right = text.substring(maxCursor.i);

      var v = left + str + right;
      this.value = v;
      this.refreshGridBounds();
      this.performLayout();
      minCursor.advanceN(this.lines, Math.max(0, str.length));
      this.scrollIntoView(maxCursor);
      this.clampScroll();
      maxCursor.copy(minCursor);
      this.render();
    }
  }

  get padding() {
    return this._padding;
  }

  set padding(v) {
    this._padding = v;
    this.render();
  }

  get wordWrap() {
    return this._wordWrap;
  }

  set wordWrap(v) {
    this._wordWrap = v || false;
    this.setGutter();
  }

  get showLineNumbers() {
    return this._showLineNumbers;
  }

  set showLineNumbers(v) {
    this._showLineNumbers = v;
    this.setGutter();
  }

  get showScrollBars() {
    return this._showScrollBars;
  }

  set showScrollBars(v) {
    this._showScrollBars = v;
    this.setGutter();
  }

  get theme() {
    return this._theme;
  }

  set theme(t) {
    this._theme = clone(t || Primrose.Text.Themes.Default);
    this._theme.fontSize = this.fontSize;
    this._rowCache = {};
    this.render();
  }

  get commandPack() {
    return this._commandPack;
  }

  set commandPack(v) {
    this._commandPack = v;
  }

  get selectionStart() {
    return this.frontCursor.i;
  }

  set selectionStart(i) {
    this.frontCursor.setI(i, this.lines);
  }

  get selectionEnd() {
    return this.backCursor.i;
  }

  set selectionEnd(i) {
    this.backCursor.setI(i, this.lines);
  }

  get selectionDirection() {
    return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
  }

  get tokenizer() {
    return this._tokenizer;
  }

  set tokenizer(tk) {
    this._tokenizer = tk || Primrose.Text.Grammars.JavaScript;
    if (this._history && this._history.length > 0) {
      this.refreshTokens();
      this.render();
    }
  }

  get tabWidth() {
    return this._tabWidth;
  }

  set tabWidth(tw) {
    this._tabWidth = tw || 2;
    this._tabString = "";
    for (var i = 0; i < this._tabWidth; ++i) {
      this._tabString += " ";
    }
  }

  get tabString() {
    return this._tabString;
  }

  get fontSize() {
    return this._fontSize || 16;
  }

  set fontSize(v) {
    v = v || 16;
    this._fontSize = v;
    if (this.theme) {
      this.theme.fontSize = this._fontSize;
      this.resize();
      this.render();
    }
  }

  get lockMovement() {
    return this.focused && !this.readOnly;
  }

  pushUndo(lines) {
    if (this._historyFrame < this._history.length - 1) {
      this._history.splice(this._historyFrame + 1);
    }
    this._history.push(lines);
    this._historyFrame = this._history.length - 1;
    this.refreshTokens();
    this.render();
  }

  redo() {
    if (this._historyFrame < this._history.length - 1) {
      ++this._historyFrame;
    }
    this.refreshTokens();
    this.fixCursor();
    this.render();
  }

  undo() {
    if (this._historyFrame > 0) {
      --this._historyFrame;
    }
    this.refreshTokens();
    this.fixCursor();
    this.render();
  }

  scrollIntoView(currentCursor) {
    this.scroll.y += this.minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
    if (!this.wordWrap) {
      this.scroll.x += this.minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width);
    }
    this.clampScroll();
  }

  readWheel(evt) {
    if (this.focused) {
      if (evt.shiftKey || isChrome) {
        this.fontSize += -evt.deltaX / SCROLL_SCALE;
      }
      if (!evt.shiftKey || isChrome) {
        this.scroll.y += Math.floor(evt.deltaY * this._wheelScrollSpeed / SCROLL_SCALE);
      }
      this.clampScroll();
      this.render();
      evt.preventDefault();
    }
  }

  startPointer(x, y) {
    if (!super.startPointer(x, y)) {
      this._dragging = true;
      this.setCursorXY(this.frontCursor, x, y);
    }
  }

  movePointer(x, y) {
    if (this._dragging) {
      this.setCursorXY(this.backCursor, x, y);
    }
  }

  endPointer() {
    super.endPointer();
    this._dragging = false;
    this._scrolling = false;
  }

  copySelectedText(evt) {
    if (this.focused && this.frontCursor.i !== this.backCursor.i) {
      var clipboard = evt.clipboardData || window.clipboardData;
      clipboard.setData(
        window.clipboardData ? "Text" : "text/plain", this.selectedText);
      evt.returnValue = false;
    }
  }

  cutSelectedText(evt) {
    if (this.focused) {
      this.copySelectedText(evt);
      if (!this.readOnly) {
        this.selectedText = "";
      }
    }
  }

  execCommand(browser, codePage, commandName) {
    if (commandName && this.focused && !this.readOnly) {
      var altCommandName = browser + "_" + commandName,
        func = this.commandPack[altCommandName] ||
        this.commandPack[commandName] ||
        codePage[altCommandName] ||
        codePage[commandName];

      if (func instanceof String || typeof func === "string") {
        console.log("okay");
        func = this.commandPack[func] ||
          this.commandPack[func] ||
          func;
      }

      if (func === undefined) {
        return false;
      }
      else {
        this.frontCursor.moved = false;
        this.backCursor.moved = false;
        if (func instanceof Function) {
          func(this, this.lines);
        }
        else if (func instanceof String || typeof func === "string") {
          console.log(func);
          this.selectedText = func;
        }
        if (this.frontCursor.moved && !this.backCursor.moved) {
          this.backCursor.copy(this.frontCursor);
        }
        this.clampScroll();
        this.render();
        return true;
      }
    }
  }

  readClipboard(evt) {
    if (this.focused && !this.readOnly) {
      evt.returnValue = false;
      var clipboard = evt.clipboardData || window.clipboardData,
        str = clipboard.getData(window.clipboardData ? "Text" : "text/plain");
      if (str) {
        this.selectedText = str;
      }
    }
  }

  resize() {
    super.resize();
    this._bg.setSize(this.surfaceWidth, this.surfaceHeight);
    this._fg.setSize(this.surfaceWidth, this.surfaceHeight);
    this._trim.setSize(this.surfaceWidth, this.surfaceHeight);
    if (this.theme) {
      this.character.height = this.fontSize;
      this.context.font = this.character.height + "px " + this.theme.fontFamily;
      // measure 100 letter M's, then divide by 100, to get the width of an M
      // to two decimal places on systems that return integer values from
      // measureText.
      this.character.width = this.context.measureText(
          "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM")
        .width /
        100;
    }
    this.render();
  }

  pixel2cell(point) {
    const x = point.x * this.imageWidth / this.surfaceWidth,
      y = point.y * this.imageHeight / this.surfaceHeight;
    point.set(
      Math.round(point.x / this.character.width) + this.scroll.x - this.gridBounds.x,
      Math.floor((point.y / this.character.height) - 0.25) + this.scroll.y);
  }

  clampScroll() {
    if (this.scroll.y < 0) {
      this.scroll.y = 0;
    }
    else {
      while (0 < this.scroll.y &&
        this.scroll.y > this.lines.length - this.gridBounds.height) {
        --this.scroll.y;
      }
    }
  }

  refreshTokens() {
    this.tokens = this.tokenizer.tokenize(this.value);
  }

  fixCursor() {
    var moved = this.frontCursor.fixCursor(this.lines) ||
      this.backCursor.fixCursor(this.lines);
    if (moved) {
      this.render();
    }
  }

  setCursorXY(cursor, x, y) {
    x = Math.round(x);
    y = Math.round(y);
    this._pointer.set(x, y);
    this.pixel2cell(this._pointer, this.scroll, this.gridBounds);
    var gx = this._pointer.x - this.scroll.x,
      gy = this._pointer.y - this.scroll.y,
      onBottom = gy >= this.gridBounds.height,
      onLeft = gx < 0,
      onRight = this._pointer.x >= this.gridBounds.width;
    if (!this._scrolling && !onBottom && !onLeft && !onRight) {
      cursor.setXY(this._pointer.x, this._pointer.y, this.lines);
      this.backCursor.copy(cursor);
    }
    else if (this._scrolling || onRight && !onBottom) {
      this._scrolling = true;
      var scrollHeight = this.lines.length - this.gridBounds.height;
      if (gy >= 0 && scrollHeight >= 0) {
        var sy = gy * scrollHeight / this.gridBounds.height;
        this.scroll.y = Math.floor(sy);
      }
    }
    else if (onBottom && !onLeft) {
      var maxWidth = 0;
      for (var dy = 0; dy < this.lines.length; ++dy) {
        maxWidth = Math.max(maxWidth, this.lines[dy].length);
      }
      var scrollWidth = maxWidth - this.gridBounds.width;
      if (gx >= 0 && scrollWidth >= 0) {
        var sx = gx * scrollWidth / this.gridBounds.width;
        this.scroll.x = Math.floor(sx);
      }
    }
    else if (onLeft && !onBottom) {
      // clicked in number-line gutter
    }
    else {
      // clicked in the lower-left corner
    }
    this._lastPointer.copy(this._pointer);
    this.render();
  }

  mouseButtonDown(evt) {
    if (evt.button === 0) {
      this.startDOMPointer(evt);
      evt.preventDefault();
    }
  }

  mouseMove(evt) {
    if (this.focused) {
      this.moveDOMPointer(evt);
    }
  }

  mouseButtonUp(evt) {
    if (this.focused && evt.button === 0) {
      this.endPointer();
    }
  }

  touchStart(evt) {
    if (this.focused && evt.touches.length > 0 && !this._dragging) {
      var t = evt.touches[0];
      this.startDOMPointer(t);
      this._currentTouchID = t.identifier;
    }
  }

  touchMove(evt) {
    for (var i = 0; i < evt.changedTouches.length && this._dragging; ++i) {
      var t = evt.changedTouches[i];
      if (t.identifier === this._currentTouchID) {
        this.moveDOMPointer(t);
        break;
      }
    }
  }

  touchEnd(evt) {
    for (var i = 0; i < evt.changedTouches.length && this._dragging; ++i) {
      var t = evt.changedTouches[i];
      if (t.identifier === this._currentTouchID) {
        this.endPointer();
      }
    }
  }

  setGutter() {
    if (this.showLineNumbers) {
      this._topLeftGutter.width = 1;
    }
    else {
      this._topLeftGutter.width = 0;
    }

    if (!this.showScrollBars) {
      this._bottomRightGutter.set(0, 0);
    }
    else if (this.wordWrap) {
      this._bottomRightGutter.set(this._VSCROLL_WIDTH, 0);
    }
    else {
      this._bottomRightGutter.set(this._VSCROLL_WIDTH, 1);
    }
  }

  refreshGridBounds() {
    this._lineCountWidth = 0;
    if (this.showLineNumbers) {
      this._lineCountWidth = Math.max(1, Math.ceil(Math.log(this._history[this._historyFrame].length) / Math.LN10));
    }

    var x = Math.floor(this._topLeftGutter.width + this._lineCountWidth + this.padding / this.character.width),
      y = Math.floor(this.padding / this.character.height),
      w = Math.floor((this.imageWidth - 2 * this.padding) / this.character.width) - x - this._bottomRightGutter.width,
      h = Math.floor((this.imageHeight - 2 * this.padding) / this.character.height) - y - this._bottomRightGutter.height;
    this.gridBounds.set(x, y, w, h);
  }

  performLayout() {

    // group the tokens into rows
    this._tokenRows = [
      []
    ];
    this._tokenHashes = [""];
    this.lines = [""];
    var currentRowWidth = 0;
    var tokenQueue = this.tokens.slice();
    for (var i = 0; i < tokenQueue.length; ++i) {
      var t = tokenQueue[i].clone();
      var widthLeft = this.gridBounds.width - currentRowWidth;
      var wrap = this.wordWrap && t.type !== "newlines" && t.value.length > widthLeft;
      var breakLine = t.type === "newlines" || wrap;
      if (wrap) {
        var split = t.value.length > this.gridBounds.width ? widthLeft : 0;
        tokenQueue.splice(i + 1, 0, t.splitAt(split));
      }

      if (t.value.length > 0) {
        this._tokenRows[this._tokenRows.length - 1].push(t);
        this._tokenHashes[this._tokenHashes.length - 1] += JSON.stringify(t);
        this.lines[this.lines.length - 1] += t.value;
        currentRowWidth += t.value.length;
      }

      if (breakLine) {
        this._tokenRows.push([]);
        this._tokenHashes.push("");
        this.lines.push("");
        currentRowWidth = 0;
      }
    }
  }

  minDelta(v, minV, maxV) {
    var dvMinV = v - minV,
      dvMaxV = v - maxV + 5,
      dv = 0;
    if (dvMinV < 0 || dvMaxV >= 0) {
      // compare the absolute values, so we get the smallest change
      // regardless of direction.
      dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
    }

    return dv;
  }

  fillRect(gfx, fill, x, y, w, h) {
    gfx.fillStyle = fill;
    gfx.fillRect(
      x * this.character.width,
      y * this.character.height,
      w * this.character.width + 1,
      h * this.character.height + 1);
  }

  strokeRect(gfx, stroke, x, y, w, h) {
    gfx.strokeStyle = stroke;
    gfx.strokeRect(
      x * this.character.width,
      y * this.character.height,
      w * this.character.width + 1,
      h * this.character.height + 1);
  }

  renderCanvasBackground() {
    var minCursor = Primrose.Text.Cursor.min(this.frontCursor, this.backCursor),
      maxCursor = Primrose.Text.Cursor.max(this.frontCursor, this.backCursor),
      tokenFront = new Primrose.Text.Cursor(),
      tokenBack = new Primrose.Text.Cursor(),
      clearFunc = this.theme.regular.backColor ? "fillRect" : "clearRect",
      OFFSETY = OFFSET / this.character.height;

    if (this.theme.regular.backColor) {
      this._bgfx.fillStyle = this.theme.regular.backColor;
    }

    this._bgfx[clearFunc](0, 0, this.imageWidth, this.imageHeight);
    this._bgfx.save();
    this._bgfx.translate(
      (this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, -this.scroll.y * this.character.height + this.padding);


    // draw the current row highlighter
    if (this.focused) {
      this.fillRect(this._bgfx, this.theme.regular.currentRowBackColor ||
        Primrose.Text.Themes.Default.regular.currentRowBackColor,
        0, minCursor.y + OFFSETY,
        this.gridBounds.width,
        maxCursor.y - minCursor.y + 1);
    }

    for (var y = 0; y < this._tokenRows.length; ++y) {
      // draw the tokens on this row
      var row = this._tokenRows[y];

      for (var i = 0; i < row.length; ++i) {
        var t = row[i];
        tokenBack.x += t.value.length;
        tokenBack.i += t.value.length;

        // skip drawing tokens that aren't in view
        if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height &&
          this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x +
          this.gridBounds.width) {
          // draw the selection box
          var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
            maxCursor.i;
          if (inSelection) {
            var selectionFront = Primrose.Text.Cursor.max(minCursor,
              tokenFront);
            var selectionBack = Primrose.Text.Cursor.min(maxCursor, tokenBack);
            var cw = selectionBack.i - selectionFront.i;
            this.fillRect(this._bgfx, this.theme.regular.selectedBackColor ||
              Primrose.Text.Themes.Default.regular.selectedBackColor,
              selectionFront.x, selectionFront.y + OFFSETY,
              cw, 1);
          }
        }

        tokenFront.copy(tokenBack);
      }

      tokenFront.x = 0;
      ++tokenFront.y;
      tokenBack.copy(tokenFront);
    }

    // draw the cursor caret
    if (this.focused) {
      var cc = this.theme.cursorColor || "black";
      var w = 1 / this.character.width;
      this.fillRect(this._bgfx, cc, minCursor.x, minCursor.y + OFFSETY, w, 1);
      this.fillRect(this._bgfx, cc, maxCursor.x, maxCursor.y + OFFSETY, w, 1);
    }
    this._bgfx.restore();
  }

  renderCanvasForeground() {
    var tokenFront = new Primrose.Text.Cursor(),
      tokenBack = new Primrose.Text.Cursor();

    this._fgfx.clearRect(0, 0, this.imageWidth, this.imageHeight);
    this._fgfx.save();
    this._fgfx.translate((this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, this.padding);
    for (var y = 0; y < this._tokenRows.length; ++y) {
      // draw the tokens on this row
      var line = this.lines[y] + this.padding,
        row = this._tokenRows[y],
        drawn = false,
        textY = (y - this.scroll.y) * this.character.height;

      for (var i = 0; i < row.length; ++i) {
        var t = row[i];
        tokenBack.x += t.value.length;
        tokenBack.i += t.value.length;

        // skip drawing tokens that aren't in view
        if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height &&
          this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x +
          this.gridBounds.width) {

          // draw the text
          if (this.useCaching && this._rowCache[line] !== undefined) {
            if (i === 0) {
              this._fgfx.putImageData(this._rowCache[line], this.padding, textY + this.padding + OFFSET);
            }
          }
          else {
            var style = this.theme[t.type] || {};
            var font = (style.fontWeight || this.theme.regular.fontWeight || "") +
              " " + (style.fontStyle || this.theme.regular.fontStyle || "") +
              " " + this.character.height + "px " + this.theme.fontFamily;
            this._fgfx.font = font.trim();
            this._fgfx.fillStyle = style.foreColor || this.theme.regular.foreColor;
            this.drawText(this._fgfx, t.value,
              tokenFront.x * this.character.width,
              textY);
            drawn = true;
          }
        }

        tokenFront.copy(tokenBack);
      }

      tokenFront.x = 0;
      ++tokenFront.y;
      tokenBack.copy(tokenFront);
      if (this.useCaching && drawn && this._rowCache[line] === undefined) {
        this._rowCache[line] = this._fgfx.getImageData(
          this.padding,
          textY + this.padding + OFFSET,
          this.imageWidth - 2 * this.padding,
          this.character.height);
      }
    }

    this._fgfx.restore();
  }

  // provides a hook for TextInput to be able to override text drawing and spit out password blanking characters
  drawText(ctx, txt, x, y) {
    ctx.fillText(txt, x, y);
  }


  renderCanvasTrim() {
    var tokenFront = new Primrose.Text.Cursor(),
      tokenBack = new Primrose.Text.Cursor(),
      maxLineWidth = 0;

    this._tgfx.clearRect(0, 0, this.imageWidth, this.imageHeight);
    this._tgfx.save();
    this._tgfx.translate(this.padding, this.padding);
    this._tgfx.save();
    this._tgfx.lineWidth = 2;
    this._tgfx.translate(0, -this.scroll.y * this.character.height);
    for (var y = 0, lastLine = -1; y < this._tokenRows.length; ++y) {
      var row = this._tokenRows[y];

      for (var i = 0; i < row.length; ++i) {
        var t = row[i];
        tokenBack.x += t.value.length;
        tokenBack.i += t.value.length;
        tokenFront.copy(tokenBack);
      }

      maxLineWidth = Math.max(maxLineWidth, tokenBack.x);
      tokenFront.x = 0;
      ++tokenFront.y;
      tokenBack.copy(tokenFront);

      if (this.showLineNumbers && this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height) {
        var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
        // draw the left gutter
        var lineNumber = currentLine.toString();
        while (lineNumber.length < this._lineCountWidth) {
          lineNumber = " " + lineNumber;
        }
        this.fillRect(this._tgfx,
          this.theme.regular.selectedBackColor ||
          Primrose.Text.Themes.Default.regular.selectedBackColor,
          0, y,
          this.gridBounds.x, 1);
        this._tgfx.font = "bold " + this.character.height + "px " +
          this.theme.fontFamily;

        if (currentLine > lastLine) {
          this._tgfx.fillStyle = this.theme.regular.foreColor;
          this._tgfx.fillText(
            lineNumber,
            0, y * this.character.height);
        }
        lastLine = currentLine;
      }
    }

    this._tgfx.restore();

    if (this.showLineNumbers) {
      this.strokeRect(this._tgfx,
        this.theme.regular.foreColor ||
        Primrose.Text.Themes.Default.regular.foreColor,
        0, 0,
        this.gridBounds.x, this.gridBounds.height);
    }

    // draw the scrollbars
    if (this.showScrollBars) {
      var drawWidth = this.gridBounds.width * this.character.width - this.padding,
        drawHeight = this.gridBounds.height * this.character.height,
        scrollX = (this.scroll.x * drawWidth) / maxLineWidth + this.gridBounds.x * this.character.width,
        scrollY = (this.scroll.y * drawHeight) / this._tokenRows.length;

      this._tgfx.fillStyle = this.theme.regular.selectedBackColor ||
        Primrose.Text.Themes.Default.regular.selectedBackColor;
      // horizontal
      var bw;
      if (!this.wordWrap && maxLineWidth > this.gridBounds.width) {
        var scrollBarWidth = drawWidth * (this.gridBounds.width / maxLineWidth),
          by = this.gridBounds.height * this.character.height;
        bw = Math.max(this.character.width, scrollBarWidth);
        this._tgfx.fillRect(scrollX, by, bw, this.character.height);
        this._tgfx.strokeRect(scrollX, by, bw, this.character.height);
      }

      //vertical
      if (this._tokenRows.length > this.gridBounds.height) {
        var scrollBarHeight = drawHeight * (this.gridBounds.height / this._tokenRows.length),
          bx = this.image - this._VSCROLL_WIDTH * this.character.width - 2 * this.padding,
          bh = Math.max(this.character.height, scrollBarHeight);
        bw = this._VSCROLL_WIDTH * this.character.width;
        this._tgfx.fillRect(bx, scrollY, bw, bh);
        this._tgfx.strokeRect(bx, scrollY, bw, bh);
      }
    }

    this._tgfx.lineWidth = 2;
    this._tgfx.restore();
    this._tgfx.strokeRect(1, 1, this.imageWidth - 2, this.imageHeight - 2);
    if (!this.focused) {
      this._tgfx.fillStyle = this.theme.regular.unfocused || Primrose.Text.Themes.Default.regular.unfocused;
      this._tgfx.fillRect(0, 0, this.imageWidth, this.imageHeight);
    }
  }

  render() {
    if (this.tokens && this.theme) {
      this.refreshGridBounds();
      var boundsChanged = this.gridBounds.toString() !== this._lastGridBounds,
        textChanged = this._lastText !== this.value,
        characterWidthChanged = this.character.width !== this._lastCharacterWidth,
        characterHeightChanged = this.character.height !== this._lastCharacterHeight,
        paddingChanged = this.padding !== this._lastPadding,
        cursorChanged = !this._lastFrontCursor || !this._lastBackCursor || this.frontCursor.i !== this._lastFrontCursor.i || this._lastBackCursor.i !== this.backCursor.i,
        scrollChanged = this.scroll.x !== this._lastScrollX || this.scroll.y !== this._lastScrollY,
        fontChanged = this.context.font !== this._lastFont,
        themeChanged = this.theme.name !== this._lastThemeName,
        focusChanged = this.focused !== this._lastFocused,

        changeBounds = null,

        layoutChanged = this.resized || boundsChanged || textChanged || characterWidthChanged || characterHeightChanged || paddingChanged,
        backgroundChanged = layoutChanged || cursorChanged || scrollChanged || themeChanged,
        foregroundChanged = backgroundChanged || textChanged,
        trimChanged = backgroundChanged || focusChanged,
        imageChanged = foregroundChanged || backgroundChanged || trimChanged;

      if (layoutChanged) {
        this.performLayout(this.gridBounds);
        this._rowCache = {};
      }

      if (imageChanged) {
        if (cursorChanged && !(layoutChanged || scrollChanged || themeChanged || focusChanged)) {
          var top = Math.min(this.frontCursor.y, this._lastFrontCursor.y, this.backCursor.y, this._lastBackCursor.y) - this.scroll.y + this.gridBounds.y,
            bottom = Math.max(this.frontCursor.y, this._lastFrontCursor.y, this.backCursor.y, this._lastBackCursor.y) - this.scroll.y + 1;
          changeBounds = new Primrose.Text.Rectangle(
            0,
            top * this.character.height,
            this.bounds.width,
            (bottom - top) * this.character.height + 2);
        }

        if (backgroundChanged) {
          this.renderCanvasBackground();
        }
        if (foregroundChanged) {
          this.renderCanvasForeground();
        }
        if (trimChanged) {
          this.renderCanvasTrim();
        }

        this.context.clearRect(0, 0, this.imageWidth, this.imageHeight);
        this.context.drawImage(this._bgCanvas, 0, 0);
        this.context.drawImage(this._fgCanvas, 0, 0);
        this.context.drawImage(this._trimCanvas, 0, 0);
        this.invalidate(changeBounds);
      }

      this._lastGridBounds = this.gridBounds.toString();
      this._lastText = this.value;
      this._lastCharacterWidth = this.character.width;
      this._lastCharacterHeight = this.character.height;
      this._lastWidth = this.imageWidth;
      this._lastHeight = this.imageHeight;
      this._lastPadding = this.padding;
      this._lastFrontCursor = this.frontCursor.clone();
      this._lastBackCursor = this.backCursor.clone();
      this._lastFocused = this.focused;
      this._lastFont = this.context.font;
      this._lastThemeName = this.theme.name;
      this._lastScrollX = this.scroll.x;
      this._lastScrollY = this.scroll.y;
    }
  }
}
return TextBox;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Controls.TextInput = factory();
  }
}(this, function() {
"use strict";

var COUNTER = 0;

pliny.class({
  parent: "Primrose.Text.Controls",
    name: "TextInput",
    description: "plain text input box.",
    baseClass: "Primrose.Text.Controls.TextBox",
    parameters: [{
      name: "idOrCanvasOrContext",
      type: "String or HTMLCanvasElement or CanvasRenderingContext2D",
      description: "Either an ID of an element that exists, an element, or the ID to set on an element that is to be created."
    }, {
      name: "options",
      type: "Object",
      description: "Named parameters for creating the TextInput."
    }]
});
class TextInput extends Primrose.Text.Controls.TextBox {
  constructor(options) {
    super(copyObject(
      patch(options, {
        id: "Primrose.Text.Controls.TextInput[" + (COUNTER++) + "]",
        padding: 5
      }), {
        singleLine: true,
        disableWordWrap: true,
        hideLineNumbers: true,
        hideScrollBars: true,
        tabWidth: 1,
        tokenizer: Primrose.Text.Grammars.PlainText,
        commands: Primrose.Text.CommandPacks.TextInput
      }, true));

    this.passwordCharacter = this.options.passwordCharacter;
  }

  get value() {
    return super.value;
  }

  set value(v) {
    v = v || "";
    v = v.replace(/\r?\n/g, "");
    super.value = v;
  }

  get selectedText() {
    return super.selectedText;
  }

  set selectedText(v) {
    v = v || "";
    v = v.replace(/\r?\n/g, "");
    super.selectedText = v;
  }

  drawText(ctx, txt, x, y) {
    if (this.passwordCharacter) {
      var val = "";
      for (var i = 0; i < txt.length; ++i) {
        val += this.passwordCharacter;
      }
      txt = val;
    }
    super.drawText(ctx, txt, x, y);
  }
}
return TextInput;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammars.Basic = factory();
  }
}(this, function() {
// we don't use strict here because this grammar includes an interpreter that uses `eval()`

pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "Basic",
  description: "| [under construction]"
});
var Basic = new Primrose.Text.Grammar("BASIC",
  // Grammar rules are applied in the order they are specified.
  [
    // Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.
    ["newlines", /(?:\r\n|\r|\n)/],
    // BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
    ["lineNumbers", /^\d+\s+/],
    // Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
    ["startLineComments", /^REM\s/],
    // Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
    ["strings", /"(?:\\"|[^"])*"/],
    ["strings", /'(?:\\'|[^'])*'/],
    // Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
    ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
    // Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
    ["keywords",
      /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
    ],
    // Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
    ["keywords", /^DEF FN/],
    // These are all treated as mathematical operations.
    ["operators",
      /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
    ],
    // Once everything else has been matched, the left over blocks of words are treated as variable and function names.
    ["identifiers", /\w+\$?/]
  ]);

var oldTokenize = Basic.tokenize;
Basic.tokenize = function (code) {
  return oldTokenize.call(this, code.toUpperCase());
};

Basic.interpret = function (sourceCode, input, output, errorOut, next,
  clearScreen, loadFile, done) {
  var tokens = this.tokenize(sourceCode),
    EQUAL_SIGN = new Primrose.Text.Token("=", "operators"),
    counter = 0,
    isDone = false,
    program = {},
    lineNumbers = [],
    currentLine = [],
    lines = [currentLine],
    data = [],
    returnStack = [],
    forLoopCounters = {},
    dataCounter = 0,
    state = {
      INT: function (v) {
        return v | 0;
      },
      RND: function () {
        return Math.random();
      },
      CLK: function () {
        return Date.now() / 3600000;
      },
      LEN: function (id) {
        return id.length;
      },
      LINE: function () {
        return lineNumbers[counter];
      },
      TAB: function (v) {
        var str = "";
        for (var i = 0; i < v; ++i) {
          str += " ";
        }
        return str;
      },
      POW: function (a, b) {
        return Math.pow(a, b);
      }
    };

  function toNum(ln) {
    return new Primrose.Text.Token(ln.toString(), "numbers");
  }

  function toStr(str) {
    return new Primrose.Text.Token("\"" + str.replace("\n", "\\n")
      .replace("\"", "\\\"") + "\"", "strings");
  }

  var tokenMap = {
    "OR": "||",
    "AND": "&&",
    "NOT": "!",
    "MOD": "%",
    "<>": "!="
  };

  while (tokens.length > 0) {
    var token = tokens.shift();
    if (token.type === "newlines") {
      currentLine = [];
      lines.push(currentLine);
    }
    else if (token.type !== "regular" && token.type !== "comments") {
      token.value = tokenMap[token.value] || token.value;
      currentLine.push(token);
    }
  }

  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    if (line.length > 0) {
      var lastLine = lineNumbers[lineNumbers.length - 1];
      var lineNumber = line.shift();

      if (lineNumber.type !== "lineNumbers") {
        line.unshift(lineNumber);

        if (lastLine === undefined) {
          lastLine = -1;
        }

        lineNumber = toNum(lastLine + 1);
      }

      lineNumber = parseFloat(lineNumber.value);
      if (lastLine && lineNumber <= lastLine) {
        throw new Error("expected line number greater than " + lastLine +
          ", but received " + lineNumber + ".");
      }
      else if (line.length > 0) {
        lineNumbers.push(lineNumber);
        program[lineNumber] = line;
      }
    }
  }


  function process(line) {
    if (line && line.length > 0) {
      var op = line.shift();
      if (op) {
        if (commands.hasOwnProperty(op.value)) {
          return commands[op.value](line);
        }
        else if (!isNaN(op.value)) {
          return setProgramCounter([op]);
        }
        else if (state[op.value] ||
          (line.length > 0 && line[0].type === "operators" &&
            line[0].value === "=")) {
          line.unshift(op);
          return translate(line);
        }
        else {
          error("Unknown command. >>> " + op.value);
        }
      }
    }
    return pauseBeforeComplete();
  }

  function error(msg) {
    errorOut("At line " + lineNumbers[counter] + ": " + msg);
  }

  function getLine(i) {
    var lineNumber = lineNumbers[i];
    var line = program[lineNumber];
    return line && line.slice();
  }

  function evaluate(line) {
    var script = "";
    for (var i = 0; i < line.length; ++i) {
      var t = line[i];
      var nest = 0;
      if (t.type === "identifiers" &&
        typeof state[t.value] !== "function" &&
        i < line.length - 1 &&
        line[i + 1].value === "(") {
        for (var j = i + 1; j < line.length; ++j) {
          var t2 = line[j];
          if (t2.value === "(") {
            if (nest === 0) {
              t2.value = "[";
            }
            ++nest;
          }
          else if (t2.value === ")") {
            --nest;
            if (nest === 0) {
              t2.value = "]";
            }
          }
          else if (t2.value === "," && nest === 1) {
            t2.value = "][";
          }

          if (nest === 0) {
            break;
          }
        }
      }
      script += t.value;
    }
    //with ( state ) { // jshint ignore:line
    try {
      return eval(script); // jshint ignore:line
    }
    catch (exp) {
      console.error(exp);
      console.debug(line.join(", "));
      console.error(script);
      error(exp.message + ": " + script);
    }
    //}
  }

  function declareVariable(line) {
    var decl = [],
      decls = [decl],
      nest = 0,
      i;
    for (i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.value === "(") {
        ++nest;
      }
      else if (t.value === ")") {
        --nest;
      }
      if (nest === 0 && t.value === ",") {
        decl = [];
        decls.push(decl);
      }
      else {
        decl.push(t);
      }
    }
    for (i = 0; i < decls.length; ++i) {
      decl = decls[i];
      var id = decl.shift();
      if (id.type !== "identifiers") {
        error("Identifier expected: " + id.value);
      }
      else {
        var val = null,
          j;
        id = id.value;
        if (decl[0].value === "(" && decl[decl.length - 1].value === ")") {
          var sizes = [];
          for (j = 1; j < decl.length - 1; ++j) {
            if (decl[j].type === "numbers") {
              sizes.push(decl[j].value | 0);
            }
          }
          if (sizes.length === 0) {
            val = [];
          }
          else {
            val = new Array(sizes[0]);
            var queue = [val];
            for (j = 1; j < sizes.length; ++j) {
              var size = sizes[j];
              for (var k = 0,
                  l = queue.length; k < l; ++k) {
                var arr = queue.shift();
                for (var m = 0; m < arr.length; ++m) {
                  arr[m] = new Array(size);
                  if (j < sizes.length - 1) {
                    queue.push(arr[m]);
                  }
                }
              }
            }
          }
        }
        state[id] = val;
        return true;
      }
    }
  }

  function print(line) {
    var endLine = "\n";
    var nest = 0;
    line = line.map(function (t, i) {
      t = t.clone();
      if (t.type === "operators") {
        if (t.value === ",") {
          if (nest === 0) {
            t.value = "+ \", \" + ";
          }
        }
        else if (t.value === ";") {
          t.value = "+ \" \"";
          if (i < line.length - 1) {
            t.value += " + ";
          }
          else {
            endLine = "";
          }
        }
        else if (t.value === "(") {
          ++nest;
        }
        else if (t.value === ")") {
          --nest;
        }
      }
      return t;
    });
    var txt = evaluate(line);
    if (txt === undefined) {
      txt = "";
    }
    output(txt + endLine);
    return true;
  }

  function setProgramCounter(line) {
    var lineNumber = parseFloat(evaluate(line));
    counter = -1;
    while (counter < lineNumbers.length - 1 &&
      lineNumbers[counter + 1] < lineNumber) {
      ++counter;
    }

    return true;
  }

  function checkConditional(line) {
    var thenIndex = -1,
      elseIndex = -1,
      i;
    for (i = 0; i < line.length; ++i) {
      if (line[i].type === "keywords" && line[i].value === "THEN") {
        thenIndex = i;
      }
      else if (line[i].type === "keywords" && line[i].value === "ELSE") {
        elseIndex = i;
      }
    }
    if (thenIndex === -1) {
      error("Expected THEN clause.");
    }
    else {
      var condition = line.slice(0, thenIndex);
      for (i = 0; i < condition.length; ++i) {
        var t = condition[i];
        if (t.type === "operators" && t.value === "=") {
          t.value = "==";
        }
      }
      var thenClause,
        elseClause;
      if (elseIndex === -1) {
        thenClause = line.slice(thenIndex + 1);
      }
      else {
        thenClause = line.slice(thenIndex + 1, elseIndex);
        elseClause = line.slice(elseIndex + 1);
      }
      if (evaluate(condition)) {
        return process(thenClause);
      }
      else if (elseClause) {
        return process(elseClause);
      }
    }

    return true;
  }

  function pauseBeforeComplete() {
    output("PROGRAM COMPLETE - PRESS RETURN TO FINISH.");
    input(function () {
      isDone = true;
      if (done) {
        done();
      }
    });
    return false;
  }

  function labelLine(line) {
    line.push(EQUAL_SIGN);
    line.push(toNum(lineNumbers[counter]));
    return translate(line);
  }

  function waitForInput(line) {
    var toVar = line.pop();
    if (line.length > 0) {
      print(line);
    }
    input(function (str) {
      str = str.toUpperCase();
      var valueToken = null;
      if (!isNaN(str)) {
        valueToken = toNum(str);
      }
      else {
        valueToken = toStr(str);
      }
      evaluate([toVar, EQUAL_SIGN, valueToken]);
      if (next) {
        next();
      }
    });
    return false;
  }

  function onStatement(line) {
    var idxExpr = [],
      idx = null,
      targets = [];
    try {
      while (line.length > 0 &&
        (line[0].type !== "keywords" ||
          line[0].value !== "GOTO")) {
        idxExpr.push(line.shift());
      }

      if (line.length > 0) {
        line.shift(); // burn the goto;

        for (var i = 0; i < line.length; ++i) {
          var t = line[i];
          if (t.type !== "operators" ||
            t.value !== ",") {
            targets.push(t);
          }
        }

        idx = evaluate(idxExpr) - 1;

        if (0 <= idx && idx < targets.length) {
          return setProgramCounter([targets[idx]]);
        }
      }
    }
    catch (exp) {
      console.error(exp);
    }
    return true;
  }

  function gotoSubroutine(line) {
    returnStack.push(toNum(lineNumbers[counter + 1]));
    return setProgramCounter(line);
  }

  function setRepeat() {
    returnStack.push(toNum(lineNumbers[counter]));
    return true;
  }

  function conditionalReturn(cond) {
    var ret = true;
    var val = returnStack.pop();
    if (val && cond) {
      ret = setProgramCounter([val]);
    }
    return ret;
  }

  function untilLoop(line) {
    var cond = !evaluate(line);
    return conditionalReturn(cond);
  }

  function findNext(str) {
    for (i = counter + 1; i < lineNumbers.length; ++i) {
      var l = getLine(i);
      if (l[0].value === str) {
        return i;
      }
    }
    return lineNumbers.length;
  }

  function whileLoop(line) {
    var cond = evaluate(line);
    if (!cond) {
      counter = findNext("WEND");
    }
    else {
      returnStack.push(toNum(lineNumbers[counter]));
    }
    return true;
  }

  var FOR_LOOP_DELIMS = ["=", "TO", "STEP"];

  function forLoop(line) {
    var n = lineNumbers[counter];
    var varExpr = [];
    var fromExpr = [];
    var toExpr = [];
    var skipExpr = [];
    var arrs = [varExpr, fromExpr, toExpr, skipExpr];
    var a = 0;
    var i = 0;
    for (i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.value === FOR_LOOP_DELIMS[a]) {
        if (a === 0) {
          varExpr.push(t);
        }
        ++a;
      }
      else {
        arrs[a].push(t);
      }
    }

    var skip = 1;
    if (skipExpr.length > 0) {
      skip = evaluate(skipExpr);
    }

    if (forLoopCounters[n] === undefined) {
      forLoopCounters[n] = evaluate(fromExpr);
    }

    var end = evaluate(toExpr);
    var cond = forLoopCounters[n] <= end;
    if (!cond) {
      delete forLoopCounters[n];
      counter = findNext("NEXT");
    }
    else {
      varExpr.push(toNum(forLoopCounters[n]));
      process(varExpr);
      forLoopCounters[n] += skip;
      returnStack.push(toNum(lineNumbers[counter]));
    }
    return true;
  }

  function stackReturn() {
    return conditionalReturn(true);
  }

  function loadCodeFile(line) {
    loadFile(evaluate(line))
      .then(next);
    return false;
  }

  function noop() {
    return true;
  }

  function loadData(line) {
    while (line.length > 0) {
      var t = line.shift();
      if (t.type !== "operators") {
        data.push(t.value);
      }
    }
    return true;
  }

  function readData(line) {
    if (data.length === 0) {
      var dataLine = findNext("DATA");
      process(getLine(dataLine));
    }
    var value = data[dataCounter];
    ++dataCounter;
    line.push(EQUAL_SIGN);
    line.push(toNum(value));
    return translate(line);
  }

  function restoreData() {
    dataCounter = 0;
    return true;
  }

  function defineFunction(line) {
    var name = line.shift()
      .value;
    var signature = "";
    var body = "";
    var fillSig = true;
    for (var i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.type === "operators" && t.value === "=") {
        fillSig = false;
      }
      else if (fillSig) {
        signature += t.value;
      }
      else {
        body += t.value;
      }
    }
    name = "FN" + name;
    var script = "(function " + name + signature + "{ return " + body +
      "; })";
    state[name] = eval(script); // jshint ignore:line
    return true;
  }

  function translate(line) {
    evaluate(line);
    return true;
  }

  var commands = {
    DIM: declareVariable,
    LET: translate,
    PRINT: print,
    GOTO: setProgramCounter,
    IF: checkConditional,
    INPUT: waitForInput,
    END: pauseBeforeComplete,
    STOP: pauseBeforeComplete,
    REM: noop,
    "'": noop,
    CLS: clearScreen,
    ON: onStatement,
    GOSUB: gotoSubroutine,
    RETURN: stackReturn,
    LOAD: loadCodeFile,
    DATA: loadData,
    READ: readData,
    RESTORE: restoreData,
    REPEAT: setRepeat,
    UNTIL: untilLoop,
    "DEF FN": defineFunction,
    WHILE: whileLoop,
    WEND: stackReturn,
    FOR: forLoop,
    NEXT: stackReturn,
    LABEL: labelLine
  };

  return function () {
    if (!isDone) {
      var goNext = true;
      while (goNext) {
        var line = getLine(counter);
        goNext = process(line);
        ++counter;
      }
    }
  };
};
return Basic;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammars.JavaScript = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "JavaScript",
  description: "| [under construction]"
});
const JavaScript = new Primrose.Text.Grammar("JavaScript", [
  ["newlines", /(?:\r\n|\r|\n)/],
  ["startBlockComments", /\/\*/],
  ["endBlockComments", /\*\//],
  ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/],
  ["stringDelim", /("|')/],
  ["startLineComments", /\/\/.*$/m],
  ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
  ["keywords",
    /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
  ],
  ["functions", /(\w+)(?:\s*\()/],
  ["members", /(\w+)\./],
  ["members", /((\w+\.)+)(\w+)/]
]);
return JavaScript;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammars.PlainText = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "PlainText",
  description: "| [under construction]"
});
const PlainText = new Primrose.Text.Grammar("PlainText", [
  ["newlines", /(?:\r\n|\r|\n)/]
]);
return PlainText;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Grammars.TestResults = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  parent: "Primrose.Text.Grammars",
  name: "TestResults",
  description: "| [under construction]"
});
const TestResults = new Primrose.Text.Grammar("TestResults", [
  ["newlines", /(?:\r\n|\r|\n)/, true],
  ["numbers", /(\[)(o+)/, true],
  ["numbers", /(\d+ succeeded), 0 failed/, true],
  ["numbers", /^    Successes:/, true],
  ["functions", /(x+)\]/, true],
  ["functions", /[1-9]\d* failed/, true],
  ["functions", /^    Failures:/, true],
  ["comments", /(\d+ms:)(.*)/, true],
  ["keywords", /(Test results for )(\w+):/, true],
  ["strings", /        \w+/, true]
]);
return TestResults;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.OperatingSystems.OSX = factory();
  }
}(this, function() {
"use strict";

pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "OSX",
  description: "| [under construction]"
});
const OSX = new Primrose.Text.OperatingSystem(
  "OS X", "META", "ALT", "METASHIFT_z",
  "META", "LEFTARROW", "RIGHTARROW",
  "META", "UPARROW", "DOWNARROW");
return OSX;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.OperatingSystems.Windows = factory();
  }
}(this, function() {
////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
"use strict";

pliny.value({
  parent: "Primrose.Text.OperatingSystems",
  name: "OSX",
  description: "| [under construction]"
});
const Windows = new Primrose.Text.OperatingSystem(
  "Windows", "CTRL", "CTRL", "CTRL_y",
  "", "HOME", "END",
  "CTRL", "HOME", "END");
return Windows;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Themes.Dark = factory();
  }
}(this, function() {
"use strict";

pliny.record({
  parent: "Primrose.Text.Themes",
  name: "Dark",
  description: "| [under construction]"
});
const Dark = {
  name: "Dark",
  fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
  cursorColor: "white",
  fontSize: 16,
  lineNumbers: {
    foreColor: "white"
  },
  regular: {
    backColor: "black",
    foreColor: "#c0c0c0",
    currentRowBackColor: "#202020",
    selectedBackColor: "#404040",
    unfocused: "rgba(0, 0, 255, 0.25)"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "yellow",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "cyan"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};
return Dark;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.Primrose.Text.Themes.Default = factory();
  }
}(this, function() {
"use strict";

pliny.record({
  parent: "Primrose.Text.Themes",
  name: "Default",
  description: "| [under construction]"
});
const Default = {
  name: "Light",
  fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
  cursorColor: "black",
  fontSize: 16,
  lineNumbers: {
    foreColor: "black"
  },
  regular: {
    backColor: "white",
    foreColor: "black",
    currentRowBackColor: "#f0f0f0",
    selectedBackColor: "#c0c0c0",
    unfocused: "rgba(0, 0, 255, 0.25)"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "grey",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "blue"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};
return Default;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Matrix4.prototype.debug = factory();
  }
}(this, function() {
"use strict";

function debug (label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label + "\n" + val);
  }
}
return debug;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Matrix4.prototype.toString = factory();
  }
}(this, function() {
"use strict";

pliny.method({
  parent: "THREE.Matrix4",
  name: "toString ",
  description: "A polyfill method for printing objects.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "the number of significant figures to print."
  }]
});
function toString(digits) {
  this.transpose();
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map((v) => v.toFixed(digits));
  }
  var output = "";
  for (var i = 0; i < parts.length; ++i) {
    if ((i % 4) === 0) {
      output += "| ";
    }
    output += parts[i];
    if ((i % 4) === 3) {
      output += " |\n";
    }
    else {
      output += ", ";
    }
  }
  this.transpose();
  return output;
}
return toString;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Object3D.prototype.addToBrowserEnvironment = factory();
  }
}(this, function() {
"use strict";

pliny.method({
  parent: "THREE.Object3D",
  name: "addToBrowserEnvironment",
  description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene. This half of the polyfill implements the visitor pattern, so that individual objects can define their own processing for this action.",
  parameters: [{
    name: "env",
    type: "Primrose.BrowserEnvironment",
    description: "The environment (with collision detection and ray-picking capability) to which to register objects"
  }, {
    name: "scene",
    type: "THREE.Object3D",
    description: "The true parent element for `this` object"
  }]
});
function addToBrowserEnvironment (env, scene) {
  scene.add(this);
  // this has to be done as a lambda expression because it needs to capture the
  // env variable provided in the addToBrowserEnvironment call;

  pliny.method({
    parent: "THREE.Object3D",
    name: "appendChild",
    description: "A polyfill method for being able to add the object to a `Primrose.BrowserEnvironment` using `appendChild()` and to add other elements to the Object3D using `appendChild()` such that they may be pickable in the scene.",
    parameters: [{
      name: "child",
      type: "Object",
      description: "Any Primrose.Entity or THREE.Object3D to add to this object."
    }]
  });
  this.appendChild = (child) => {
    if (child.addToBrowserEnvironment) {
      return child.addToBrowserEnvironment(env, this);
    }
    else {
      this.add(child);
      env.registerPickableObject(child);
      return child;
    }
  };
}
return addToBrowserEnvironment;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Quaternion.prototype.debug = factory();
  }
}(this, function() {
"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
return debug;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Quaternion.prototype.toString = factory();
  }
}(this, function() {
"use strict";

pliny.method({
  parent: "THREE.Quaternion",
  name: "toString ",
  description: "A polyfill method for printing objects.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "the number of significant figures to print."
  }]
});
function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    for (var i = 0; i < parts.length; ++i) {
      if (parts[i] !== null && parts[i] !== undefined) {
        parts[i] = parts[i].toFixed(digits);
      }
      else {
        parts[i] = "undefined";
      }
    }
  }
  return "{" + parts.join(", ") + "}";
}
return toString;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Vector3.prototype.debug = factory();
  }
}(this, function() {
"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
return debug;
}));

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.THREE.Vector3.prototype.toString = factory();
  }
}(this, function() {
"use strict";

pliny.method({
  parent: "THREE.Vector3",
  name: "toString ",
  description: "A polyfill method for printing objects.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "the number of significant figures to print."
  }]
});
function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map((v) => v.toFixed(digits));
  }
  return "<" + parts.join(", ") + ">";
}
return toString;
}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9JbnNpZGVTcGhlcmVHZW9tZXRyeS5qcyIsInNyYy9QSVhFTF9TQ0FMRVMuanMiLCJzcmMvUHJpbXJvc2UuanMiLCJzcmMvUXVhbGl0eS5qcyIsInNyYy9heGlzLmpzIiwic3JjL2JveC5qcyIsInNyYy9icmljay5qcyIsInNyYy9jYWNoZS5qcyIsInNyYy9jbG9uZS5qcyIsInNyYy9jbG91ZC5qcyIsInNyYy9jb3B5T2JqZWN0LmpzIiwic3JjL2N5bGluZGVyLmpzIiwic3JjL2RlbGV0ZVNldHRpbmcuanMiLCJzcmMvZW1pdC5qcyIsInNyYy9maW5kUHJvcGVydHkuanMiLCJzcmMvZ2V0U2V0dGluZy5qcyIsInNyYy9odWIuanMiLCJzcmMvaWRlbnRpdHkuanMiLCJzcmMvaXNDaHJvbWUuanMiLCJzcmMvaXNGaXJlZm94LmpzIiwic3JjL2lzR2VhclZSLmpzIiwic3JjL2lzSUUuanMiLCJzcmMvaXNJbklGcmFtZS5qcyIsInNyYy9pc01vYmlsZS5qcyIsInNyYy9pc09TWC5qcyIsInNyYy9pc09wZXJhLmpzIiwic3JjL2lzU2FmYXJpLmpzIiwic3JjL2lzV2ViS2l0LmpzIiwic3JjL2lzV2luZG93cy5qcyIsInNyYy9pc2lPUy5qcyIsInNyYy9saWdodC5qcyIsInNyYy9wYXRjaC5qcyIsInNyYy9wdXQuanMiLCJzcmMvcXVhZC5qcyIsInNyYy9yYW5nZS5qcyIsInNyYy9yZWFkRm9ybS5qcyIsInNyYy9zZXRGYWxzZS5qcyIsInNyYy9zZXRTZXR0aW5nLmpzIiwic3JjL3NoZWxsLmpzIiwic3JjL3NwaGVyZS5qcyIsInNyYy90ZXh0dXJlZC5qcyIsInNyYy92My5qcyIsInNyYy93cml0ZUZvcm0uanMiLCJzcmMvUHJpbXJvc2UvQWJzdHJhY3RFdmVudEVtaXR0ZXIuanMiLCJzcmMvUHJpbXJvc2UvQW5nbGUuanMiLCJzcmMvUHJpbXJvc2UvQmFzZUNvbnRyb2wuanMiLCJzcmMvUHJpbXJvc2UvQnJvd3NlckVudmlyb25tZW50LmpzIiwic3JjL1ByaW1yb3NlL0J1dHRvbkZhY3RvcnkuanMiLCJzcmMvUHJpbXJvc2UvQ29udHJvbHMuanMiLCJzcmMvUHJpbXJvc2UvRE9NLmpzIiwic3JjL1ByaW1yb3NlL0VudGl0eS5qcyIsInNyYy9Qcmltcm9zZS9IVFRQLmpzIiwic3JjL1ByaW1yb3NlL0lucHV0LmpzIiwic3JjL1ByaW1yb3NlL0lucHV0UHJvY2Vzc29yLmpzIiwic3JjL1ByaW1yb3NlL0tleXMuanMiLCJzcmMvUHJpbXJvc2UvTW9kZWxMb2FkZXIuanMiLCJzcmMvUHJpbXJvc2UvTmV0d29yay5qcyIsInNyYy9Qcmltcm9zZS9PdXRwdXQuanMiLCJzcmMvUHJpbXJvc2UvUG9pbnRlci5qcyIsInNyYy9Qcmltcm9zZS9Qb3NlSW5wdXRQcm9jZXNzb3IuanMiLCJzcmMvUHJpbXJvc2UvUHJvamVjdG9yLmpzIiwic3JjL1ByaW1yb3NlL1JhbmRvbS5qcyIsInNyYy9Qcmltcm9zZS9TS0lOUy5qcyIsInNyYy9Qcmltcm9zZS9TS0lOU19WQUxVRVMuanMiLCJzcmMvUHJpbXJvc2UvU1lTX0ZPTlRTLmpzIiwic3JjL1ByaW1yb3NlL1N1cmZhY2UuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC5qcyIsInNyYy9Qcmltcm9zZS9XZWJSVENTb2NrZXQuanMiLCJzcmMvUHJpbXJvc2UvV29ya2VyaXplLmpzIiwic3JjL1ByaW1yb3NlL1guanMiLCJzcmMvUHJpbXJvc2UvQ29udHJvbHMvQWJzdHJhY3RMYWJlbC5qcyIsInNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24yRC5qcyIsInNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24zRC5qcyIsInNyYy9Qcmltcm9zZS9Db250cm9scy9Gb3JtLmpzIiwic3JjL1ByaW1yb3NlL0NvbnRyb2xzL0h0bWxEb2MuanMiLCJzcmMvUHJpbXJvc2UvQ29udHJvbHMvSW1hZ2UuanMiLCJzcmMvUHJpbXJvc2UvQ29udHJvbHMvVlVNZXRlci5qcyIsInNyYy9Qcmltcm9zZS9ET00vY2FzY2FkZUVsZW1lbnQuanMiLCJzcmMvUHJpbXJvc2UvRE9NL2ZpbmRFdmVyeXRoaW5nLmpzIiwic3JjL1ByaW1yb3NlL0RPTS9tYWtlSGlkaW5nQ29udGFpbmVyLmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvWEhSLmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZGVsLmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZGVsT2JqZWN0LmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZ2V0LmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZ2V0QnVmZmVyLmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZ2V0T2JqZWN0LmpzIiwic3JjL1ByaW1yb3NlL0hUVFAvZ2V0VGV4dC5qcyIsInNyYy9Qcmltcm9zZS9IVFRQL3Bvc3QuanMiLCJzcmMvUHJpbXJvc2UvSFRUUC9wb3N0T2JqZWN0LmpzIiwic3JjL1ByaW1yb3NlL0lucHV0L0ZQU0lucHV0LmpzIiwic3JjL1ByaW1yb3NlL0lucHV0L0dhbWVwYWQuanMiLCJzcmMvUHJpbXJvc2UvSW5wdXQvS2V5Ym9hcmQuanMiLCJzcmMvUHJpbXJvc2UvSW5wdXQvTGVhcE1vdGlvbi5qcyIsInNyYy9Qcmltcm9zZS9JbnB1dC9Mb2NhdGlvbi5qcyIsInNyYy9Qcmltcm9zZS9JbnB1dC9Nb3Rpb24uanMiLCJzcmMvUHJpbXJvc2UvSW5wdXQvTW91c2UuanMiLCJzcmMvUHJpbXJvc2UvSW5wdXQvU3BlZWNoLmpzIiwic3JjL1ByaW1yb3NlL0lucHV0L1RvdWNoLmpzIiwic3JjL1ByaW1yb3NlL0lucHV0L1ZSLmpzIiwic3JjL1ByaW1yb3NlL05ldHdvcmsvQXVkaW9DaGFubmVsLmpzIiwic3JjL1ByaW1yb3NlL05ldHdvcmsvRGF0YUNoYW5uZWwuanMiLCJzcmMvUHJpbXJvc2UvTmV0d29yay9NYW5hZ2VyLmpzIiwic3JjL1ByaW1yb3NlL05ldHdvcmsvUmVtb3RlVXNlci5qcyIsInNyYy9Qcmltcm9zZS9PdXRwdXQvQXVkaW8zRC5qcyIsInNyYy9Qcmltcm9zZS9PdXRwdXQvSGFwdGljR2xvdmUuanMiLCJzcmMvUHJpbXJvc2UvT3V0cHV0L011c2ljLmpzIiwic3JjL1ByaW1yb3NlL091dHB1dC9TcGVlY2guanMiLCJzcmMvUHJpbXJvc2UvUmFuZG9tL0lELmpzIiwic3JjL1ByaW1yb3NlL1JhbmRvbS9jb2xvci5qcyIsInNyYy9Qcmltcm9zZS9SYW5kb20vaW50LmpzIiwic3JjL1ByaW1yb3NlL1JhbmRvbS9pdGVtLmpzIiwic3JjL1ByaW1yb3NlL1JhbmRvbS9udW1iZXIuanMiLCJzcmMvUHJpbXJvc2UvUmFuZG9tL3N0ZXBzLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvQ29kZVBhZ2UuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9Db2RlUGFnZXMuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9Db21tYW5kUGFjay5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvQ3Vyc29yLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvR3JhbW1hci5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvT3BlcmF0aW5nU3lzdGVtLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvT3BlcmF0aW5nU3lzdGVtcy5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L1BvaW50LmpzIiwic3JjL1ByaW1yb3NlL1RleHQvUmVjdGFuZ2xlLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvUnVsZS5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L1NpemUuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9UZXJtaW5hbC5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L1RoZW1lcy5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L1Rva2VuLmpzIiwic3JjL1ByaW1yb3NlL1gvTG9naW5Gb3JtLmpzIiwic3JjL1ByaW1yb3NlL1gvU2lnbnVwRm9ybS5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9ERV9RV0VSVFouanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9Db2RlUGFnZXMvRU5fVUtYLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvQ29kZVBhZ2VzL0VOX1VTLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvQ29kZVBhZ2VzL0ZSX0FaRVJUWS5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy9CYXNpY1RleHRJbnB1dC5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy9UZXh0RWRpdG9yLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvQ29tbWFuZFBhY2tzL1RleHRJbnB1dC5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzL1BsYWluVGV4dC5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzL1RleHRCb3guanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9Db250cm9scy9UZXh0SW5wdXQuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy9CYXNpYy5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL0phdmFTY3JpcHQuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy9QbGFpblRleHQuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy9UZXN0UmVzdWx0cy5qcyIsInNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMvT1NYLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvT3BlcmF0aW5nU3lzdGVtcy9XaW5kb3dzLmpzIiwic3JjL1ByaW1yb3NlL1RleHQvVGhlbWVzL0RhcmsuanMiLCJzcmMvUHJpbXJvc2UvVGV4dC9UaGVtZXMvRGVmYXVsdC5qcyIsInNyYy9USFJFRS9NYXRyaXg0L3Byb3RvdHlwZS9kZWJ1Zy5qcyIsInNyYy9USFJFRS9NYXRyaXg0L3Byb3RvdHlwZS90b1N0cmluZy5qcyIsInNyYy9USFJFRS9PYmplY3QzRC9wcm90b3R5cGUvYWRkVG9Ccm93c2VyRW52aXJvbm1lbnQuanMiLCJzcmMvVEhSRUUvUXVhdGVybmlvbi9wcm90b3R5cGUvZGVidWcuanMiLCJzcmMvVEhSRUUvUXVhdGVybmlvbi9wcm90b3R5cGUvdG9TdHJpbmcuanMiLCJzcmMvVEhSRUUvVmVjdG9yMy9wcm90b3R5cGUvZGVidWcuanMiLCJzcmMvVEhSRUUvVmVjdG9yMy9wcm90b3R5cGUvdG9TdHJpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxMkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1bUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcmpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdlNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pwRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNWVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0tBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDalRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiUHJpbXJvc2VMaWIuanMifQ==
