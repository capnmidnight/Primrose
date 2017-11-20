/*
pliny.class({
  parent: "Primrose.Graphics",
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
not exactly helpful.\n\
\n\
Say you want a to model the sky as a sphere, or the inside of a helmet. You don't\n\
care anything about the outside of this sphere, only the inside. You would use\n\
InsideSphereGeometry in this case. Or its alias, [`shell()`](#LiveAPI_shell)."
});
*/

import { Geometry, Vector3, Vector2, Face3, Sphere } from "three";
export default class InsideSphereGeometry extends Geometry {
  constructor(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    super();

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

        var vertex = new Vector3();
        vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(
          thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(
          thetaStart + v * thetaLength);

        this.vertices.push(vertex);

        verticesRow.push(this.vertices.length - 1);
        uvsRow.push(new Vector2(1 - u, 1 - v));

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
          this.faces.push(new Face3(v1, v3, v4, [n1, n3, n4]));
          this.faceVertexUvs[0].push([uv1, uv3, uv4]);

        }
        else if (Math.abs(this.vertices[v3].y) === radius) {

          uv3.x = (uv3.x + uv4.x) / 2;
          this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
          this.faceVertexUvs[0].push([uv1, uv2, uv3]);

        }
        else {

          this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
          this.faceVertexUvs[0].push([uv1, uv2, uv4]);

          this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3,
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

    this.boundingSphere = new Sphere(new Vector3(), radius);

  }
};
