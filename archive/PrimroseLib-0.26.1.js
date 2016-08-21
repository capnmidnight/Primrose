(function(){
"use strict";

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
      vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
      vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
      vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

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

      var n1 = this.vertices[v1].clone().normalize();
      var n2 = this.vertices[v2].clone().normalize();
      var n3 = this.vertices[v3].clone().normalize();
      var n4 = this.vertices[v4].clone().normalize();

      var uv1 = uvs[y][x + 1].clone();
      var uv2 = uvs[y][x].clone();
      var uv3 = uvs[y + 1][x].clone();
      var uv4 = uvs[y + 1][x + 1].clone();

      if (Math.abs(this.vertices[v1].y) === radius) {

        uv1.x = (uv1.x + uv2.x) / 2;
        this.faces.push(new THREE.Face3(v1, v3, v4, [n1, n3, n4]));
        this.faceVertexUvs[0].push([uv1, uv3, uv4]);
      } else if (Math.abs(this.vertices[v3].y) === radius) {

        uv3.x = (uv3.x + uv4.x) / 2;
        this.faces.push(new THREE.Face3(v1, v2, v3, [n1, n2, n3]));
        this.faceVertexUvs[0].push([uv1, uv2, uv3]);
      } else {

        this.faces.push(new THREE.Face3(v1, v2, v4, [n1, n2, n4]));
        this.faceVertexUvs[0].push([uv1, uv2, uv4]);

        this.faces.push(new THREE.Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9JbnNpZGVTcGhlcmVHZW9tZXRyeS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sc0JBREk7QUFFUixjQUFZLENBQUM7QUFDWCxVQUFNLFFBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sZUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxnQkFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FSUyxFQVlUO0FBQ0QsVUFBTSxVQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVpTLEVBZ0JUO0FBQ0QsVUFBTSxXQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQWhCUyxFQW9CVDtBQUNELFVBQU0sWUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FwQlMsRUF3QlQ7QUFDRCxVQUFNLGFBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBeEJTLENBRko7QUErQlIsZUFBYTs7Ozs7Ozs7QUEvQkwsQ0FBWjs7QUF5Q0EsU0FBUyxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxhQUF0QyxFQUFxRCxjQUFyRCxFQUFxRSxRQUFyRSxFQUErRSxTQUEvRSxFQUEwRixVQUExRixFQUFzRyxXQUF0RyxFQUFtSDtBQUNqSDs7QUFFQSxRQUFNLFFBQU4sQ0FBZSxJQUFmLENBQW9CLElBQXBCOztBQUVBLE9BQUssSUFBTCxHQUFZLHNCQUFaOztBQUVBLE9BQUssVUFBTCxHQUFrQjtBQUNoQixZQUFRLE1BRFE7QUFFaEIsbUJBQWUsYUFGQztBQUdoQixvQkFBZ0IsY0FIQTtBQUloQixjQUFVLFFBSk07QUFLaEIsZUFBVyxTQUxLO0FBTWhCLGdCQUFZLFVBTkk7QUFPaEIsaUJBQWE7QUFQRyxHQUFsQjs7QUFVQSxXQUFTLFVB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QVcsSUFBWCxDQUFnQixJQUFJLE1BQU0sS0FBVixDQUFnQixFQUFoQixFQUFvQixFQUFwQixFQUF3QixFQUF4QixFQUE0QixDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxDQUE1QixDQUFoQjtBQUNBLGFBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixJQUF0QixDQUEyQixDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxDQUEzQjs7QUFFQSxhQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQUksTUFBTSxLQUFWLENBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCLEVBQTRCLENBQUMsR0FBRyxLQUFILEVBQUQsRUFBYSxFQUFiLEVBQzFDLEdBQUcsS0FBSCxFQUQwQyxDQUE1QixDQUFoQjtBQUdBLGFBQUssYUFBTCxDQUFtQixDQUFuQixFQUFzQixJQUF0QixDQUEyQixDQUFDLElBQUksS0FBSixFQUFELEVBQWMsR0FBZCxFQUFtQixJQUFJLEtBQUosRUFBbkIsQ0FBM0I7QUFFRDtBQUVGO0FBRUY7O0FBRUQsT0FBSyxrQkFBTDs7QUFFQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxLQUFMLENBQVcsTUFBL0IsRUFBdUMsRUFBRSxDQUF6QyxFQUE0QztBQUMxQyxRQUFJLElBQUksS0FBSyxLQUFMLENBQVcsQ0FBWCxDQUFSO0FBQ0EsTUFBRSxNQUFGLENBQVMsY0FBVCxDQUF3QixDQUFDLENBQXpCO0FBQ0EsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQUUsYUFBRixDQUFnQixNQUFwQyxFQUE0QyxFQUFFLENBQTlDLEVBQWlEO0FBQy9DLFFBQUUsYUFBRixDQUFnQixDQUFoQixFQUFtQixjQUFuQixDQUFrQyxDQUFDLENBQW5DO0FBQ0Q7QUFDRjs7QUFFRCxPQUFLLGNBQUwsR0FBc0IsSUFBSSxNQUFNLE1BQVYsQ0FBaUIsSUFBSSxNQUFNLE9BQVYsRUFBakIsRUFBc0MsTUFBdEMsQ0FBdEI7QUFFRDtBQUNELElBQUksT0FBTyxPQUFPLEtBQWQsS0FBd0IsV0FBNUIsRUFBeUM7O0FBRXZDLHVCQUFxQixTQUFyQixHQUFpQyxPQUFPLE1BQVAsQ0FBYyxNQUFNLFFBQU4sQ0FBZSxTQUE3QixDQUFqQztBQUNBLHVCQUFxQixTQUFyQixDQUErQixXQUEvQixHQUE2QyxvQkFBN0M7QUFDRCIsImZpbGUiOiJzcmMvSW5zaWRlU3BoZXJlR2VvbWV0cnkuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.InsideSphereGeometry = InsideSphereGeometry;
})();
(function(){
"use strict";

var PIXEL_SCALES = [0.5, 0.25, 0.333333, 0.5, 1];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9QSVhFTF9TQ0FMRVMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixRQUFNLGNBREk7QUFFVixlQUFhO0FBRkgsQ0FBWjtBQUlBLElBQU0sZUFBZSxDQUNuQixHQURtQixFQUVuQixJQUZtQixFQUduQixRQUhtQixFQUluQixHQUptQixFQUtuQixDQUxtQixDQUFyQiIsImZpbGUiOiJzcmMvUElYRUxfU0NBTEVTLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.PIXEL_SCALES = PIXEL_SCALES;
})();
(function(){
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

var Primrose = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxRQUFNLFVBRFE7QUFFZCxlQUFhO0FBRkMsQ0FBaEI7QUFJQSxJQUFJLFdBQVcsRUFBZiIsImZpbGUiOiJzcmMvUHJpbXJvc2UuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose = Primrose;
})();
(function(){
"use strict";

var Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9RdWFsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sV0FBTixDQUFrQjtBQUNoQixRQUFNLFNBRFU7QUFFaEIsZUFBYTtBQUZHLENBQWxCO0FBSUEsSUFBTSxVQUFVO0FBQ2QsUUFBTSxDQURRO0FBRWQsV0FBUyxDQUZLO0FBR2QsT0FBSyxDQUhTO0FBSWQsVUFBUSxDQUpNO0FBS2QsUUFBTSxDQUxRO0FBTWQsV0FBUyxhQUFhLE1BQWIsR0FBc0I7QUFOakIsQ0FBaEIiLCJmaWxlIjoic3JjL1F1YWxpdHkuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Quality = Quality;
})();
(function(){
"use strict";

function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9heGlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsUUFBTSxNQURPO0FBRWIsZUFBYSw0RUFGQTtBQUdiLGNBQVksQ0FBQztBQUNYLFVBQU0sUUFESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxPQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLENBSEM7QUFZYixXQUFTLGdCQVpJO0FBYWIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFiRyxDQUFmOztBQThCQSxTQUFTLElBQVQsQ0FBYyxNQUFkLEVBQXNCLEtBQXRCLEVBQTZCO0FBQzNCLE1BQUksU0FBUyxLQUFiO0FBQ0EsTUFBSSxNQUFNLFFBQU4sRUFBZ0IsTUFBaEIsRUFBd0IsS0FBeEIsRUFBK0IsS0FBL0IsQ0FBSixFQUNHLEVBREgsQ0FDTSxNQUROO0FBRUEsTUFBSSxNQUFNLFFBQU4sRUFBZ0IsS0FBaEIsRUFBdUIsTUFBdkIsRUFBK0IsS0FBL0IsQ0FBSixFQUNHLEVBREgsQ0FDTSxNQUROO0FBRUEsTUFBSSxNQUFNLFFBQU4sRUFBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEIsTUFBOUIsQ0FBSixFQUNHLEVBREgsQ0FDTSxNQUROO0FBRUEsU0FBTyxNQUFQO0FBQ0QiLCJmaWxlIjoic3JjL2F4aXMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.axis = axis;
})();
(function(){
"use strict";

function box(width, height, length) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return cache("BoxGeometry(" + width + ", " + height + ", " + length + ")", function () {
    return new THREE.BoxGeometry(width, height, length);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9ib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLEtBRE87QUFFYixlQUFhLDBKQUZBO0FBR2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxPQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBSlMsRUFTVDtBQUNELFVBQU0sUUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGNBQVUsSUFIVDtBQUlELGlCQUFhO0FBSlosR0FUUyxDQUhDO0FBa0JiLFdBQVMsbUJBbEJJO0FBbUJiLFlBQVUsQ0FBQztBQUNULFVBQU0sYUFERztBQUVULGlCQUFhOzs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFuQkcsQ0FBZjs7QUFtQ0EsU0FBUyxHQUFULENBQWEsS0FBYixFQUFvQixNQUFwQixFQUE0QixNQUE1QixFQUFvQztBQUNsQyxNQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN4QixhQUFTLEtBQVQ7QUFDRDtBQUNELE1BQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLGFBQVMsS0FBVDtBQUNEO0FBQ0QsU0FBTyx1QkFDVSxLQURWLFVBQ29CLE1BRHBCLFVBQytCLE1BRC9CLFFBRUw7QUFBQSxXQUFNLElBQUksTUFBTSxXQUFWLENBQXNCLEtBQXRCLEVBQTZCLE1BQTdCLEVBQXFDLE1BQXJDLENBQU47QUFBQSxHQUZLLENBQVA7QUFHRCIsImZpbGUiOiJzcmMvYm94LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.box = box;
})();
(function(){
"use strict";

function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9icmljay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGVBQWEseUhBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLHFCQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLE9BREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSx5Q0FKWjtBQUtELGFBQVM7QUFMUixHQUpTLEVBVVQ7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSx5Q0FKWjtBQUtELGFBQVM7QUFMUixHQVZTLEVBZ0JUO0FBQ0QsVUFBTSxRQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEseUNBSlo7QUFLRCxhQUFTO0FBTFIsR0FoQlMsQ0FIQztBQTBCYixXQUFTLFlBMUJJO0FBMkJiLFlBQVUsQ0FBQztBQUNULFVBQU0sYUFERztBQUVULGlCQUFhOzs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUEzQkcsQ0FBZjs7QUEyQ0EsU0FBUyxLQUFULENBQWUsR0FBZixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QjtBQUMzQixTQUFPLFNBQVMsSUFBSSxLQUFLLENBQVQsRUFBWSxLQUFLLENBQWpCLEVBQW9CLEtBQUssQ0FBekIsQ0FBVCxFQUFzQyxHQUF0QyxFQUEyQztBQUNoRCxnQkFBWSxDQURvQztBQUVoRCxnQkFBWTtBQUZvQyxHQUEzQyxDQUFQO0FBSUQiLCJmaWxlIjoic3JjL2JyaWNrLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.brick = brick;
})();
(function(){
"use strict";

var cache = function () {
  var _cache = {};
  return function (hash, makeObject) {
    if (!_cache[hash]) {
      _cache[hash] = makeObject();
    }
    return _cache[hash];
  };
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jYWNoZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGVBQWEseVFBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLE1BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sWUFETDtBQUVELFVBQU0sVUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxDQUhDO0FBWWIsV0FBUyxRQVpJO0FBYWIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFiRyxDQUFmO0FBZ0NBLElBQU0sUUFBUyxZQUFZO0FBQ3pCLE1BQU0sU0FBUyxFQUFmO0FBQ0EsU0FBTyxVQUFDLElBQUQsRUFBTyxVQUFQLEVBQXNCO0FBQzNCLFFBQUksQ0FBQyxPQUFPLElBQVAsQ0FBTCxFQUFtQjtBQUNqQixhQUFPLElBQVAsSUFBZSxZQUFmO0FBQ0Q7QUFDRCxXQUFPLE9BQU8sSUFBUCxDQUFQO0FBQ0QsR0FMRDtBQU1ELENBUmEsRUFBZCIsImZpbGUiOiJzcmMvY2FjaGUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.cache = cache;
})();
(function(){
"use strict";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbG9uZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGNBQVksQ0FBQztBQUNYLFVBQU0sS0FESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxDQUZDO0FBT2IsZUFBYSxnREFQQTtBQVFiLFlBQVUsQ0FBQztBQUNULFVBQU0sNkJBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFSRyxDQUFmOztBQXVCQSxTQUFTLEtBQVQsQ0FBZSxHQUFmLEVBQW9CO0FBQ2xCLFNBQU8sS0FBSyxLQUFMLENBQVcsS0FBSyxTQUFMLENBQWUsR0FBZixDQUFYLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvY2xvbmUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.clone = clone;
})();
(function(){
"use strict";

function cloud(verts, c, s) {
  var geom = new THREE.Geometry();
  for (var i = 0; i < verts.length; ++i) {
    geom.vertices.push(verts[i]);
  }
  var mat = cache("PointsMaterial(" + c + ", " + s + ")", function () {
    return new THREE.PointsMaterial({
      color: c,
      size: s
    });
  });
  return new THREE.Points(geom, mat);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbG91ZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGVBQWEsMEZBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLE9BRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sR0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxHQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLENBSEM7QUFnQmIsV0FBUyxjQWhCSTtBQWlCYixZQUFVLENBQUM7QUFDVCxVQUFNLDZCQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFqQkcsQ0FBZjs7QUEyQ0EsU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QjtBQUMxQixNQUFJLE9BQU8sSUFBSSxNQUFNLFFBQVYsRUFBWDtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEVBQUUsQ0FBcEMsRUFBdUM7QUFDckMsU0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixNQUFNLENBQU4sQ0FBbkI7QUFDRDtBQUNELE1BQUksTUFBTSwwQkFDVSxDQURWLFVBQ2dCLENBRGhCLFFBRVI7QUFBQSxXQUFNLElBQUksTUFBTSxjQUFWLENBQXlCO0FBQzdCLGFBQU8sQ0FEc0I7QUFFN0IsWUFBTTtBQUZ1QixLQUF6QixDQUFOO0FBQUEsR0FGUSxDQUFWO0FBTUEsU0FBTyxJQUFJLE1BQU0sTUFBVixDQUFpQixJQUFqQixFQUF1QixHQUF2QixDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL2Nsb3VkLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.cloud = cloud;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
      if (shallow || _typeof(source[key]) !== "object" || source[key] instanceof String) {
        dest[key] = source[key];
      } else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jb3B5T2JqZWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLFlBRE87QUFFYixlQUFhLHNSQUZBO0FBR2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxNQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsRUFRVDtBQUNELFVBQU0sU0FETDtBQUVELFVBQU0sU0FGTDtBQUdELGNBQVUsSUFIVDtBQUlELGFBQVMsT0FKUjtBQUtELGlCQUFhO0FBTFosR0FSUyxDQUhDO0FBa0JiLFdBQVMsUUFsQkk7QUFtQmIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxpQkFERztBQUVULGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBbkJHLENBQWY7O0FBZ0RBLFNBQVMsVUFBVCxDQUFvQixJQUFwQixFQUEwQixNQUExQixFQUFrQyxPQUFsQyxFQUEyQztBQUN6QyxNQUFJLFFBQVEsQ0FBQztBQUNYLFVBQU0sSUFESztBQUVYLFlBQVE7QUFGRyxHQUFELENBQVo7QUFJQSxTQUFPLE1BQU0sTUFBTixHQUFlLENBQXRCLEVBQXlCO0FBQ3ZCLFFBQUksUUFBUSxNQUFNLEdBQU4sRUFBWjtBQUNBLGFBQVMsTUFBTSxNQUFmO0FBQ0EsV0FBTyxNQUFNLElBQWI7QUFDQSxTQUFLLElBQUksR0FBVCxJQUFnQixNQUFoQixFQUF3QjtBQUN0QixVQUFJLFdBQVcsUUFBUSxPQUFPLEdBQVAsQ0FBUixNQUF5QixRQUFwQyxJQUFnRCxPQUFPLEdBQVAsYUFBdUIsTUFBM0UsRUFBbUY7QUFDakYsYUFBSyxHQUFMLElBQVksT0FBTyxHQUFQLENBQVo7QUFDRCxPQUZELE1BR0s7QUFDSCxZQUFJLENBQUMsS0FBSyxHQUFMLENBQUwsRUFBZ0I7QUFDZCxlQUFLLEdBQUwsSUFBWSxFQUFaO0FBQ0Q7QUFDRCxjQUFNLElBQU4sQ0FBVztBQUNULGdCQUFNLEtBQUssR0FBTCxDQURHO0FBRVQsa0JBQVEsT0FBTyxHQUFQO0FBRkMsU0FBWDtBQUlEO0FBQ0Y7QUFDRjtBQUNELFNBQU8sSUFBUDtBQUNEIiwiZmlsZSI6InNyYy9jb3B5T2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.copyObject = copyObject;
})();
(function(){
"use strict";

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
  return cache("CylinderGeometry(" + rT + ", " + rB + ", " + height + ", " + rS + ", " + hS + ", " + openEnded + ", " + thetaStart + ", " + thetaEnd + ")", function () {
    return new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jeWxpbmRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sVUFETztBQUViLGVBQWEsc0VBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLElBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxjQUFVLElBSEM7QUFJWCxpQkFBYSx3Q0FKRjtBQUtYLGFBQVM7QUFMRSxHQUFELEVBTVQ7QUFDRCxVQUFNLElBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSwyQ0FKWjtBQUtELGFBQVM7QUFMUixHQU5TLEVBWVQ7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSw2QkFKWjtBQUtELGFBQVM7QUFMUixHQVpTLEVBa0JUO0FBQ0QsVUFBTSxJQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEsc0NBSlo7QUFLRCxhQUFTO0FBTFIsR0FsQlMsRUF3QlQ7QUFDRCxVQUFNLElBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSx3REFKWjtBQUtELGFBQVM7QUFMUixHQXhCUyxFQThCVDtBQUNELFVBQU0sV0FETDtBQUVELFVBQU0sU0FGTDtBQUdELGNBQVUsSUFIVDtBQUlELGlCQUFhLDhFQUpaO0FBS0QsYUFBUztBQUxSLEdBOUJTLEVBb0NUO0FBQ0QsVUFBTSxZQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEsb0RBSlo7QUFLRCxhQUFTO0FBTFIsR0FwQ1MsRUEwQ1Q7QUFDRCxVQUFNLFVBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSxrREFKWjtBQUtELGFBQVMsSUFBSSxLQUFLO0FBTGpCLEdBMUNTLENBSEM7QUFvRGIsV0FBUyx3QkFwREk7QUFxRGIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQXJERyxDQUFmOztBQXFFQSxTQUFTLFFBQVQsQ0FBa0IsRUFBbEIsRUFBc0IsRUFBdEIsRUFBMEIsTUFBMUIsRUFBa0MsRUFBbEMsRUFBc0MsRUFBdEMsRUFBMEMsU0FBMUMsRUFBcUQsVUFBckQsRUFBaUUsUUFBakUsRUFBMkU7QUFDekUsTUFBSSxPQUFPLFNBQVgsRUFBc0I7QUFDcEIsU0FBSyxHQUFMO0FBQ0Q7QUFDRCxNQUFJLE9BQU8sU0FBWCxFQUFzQjtBQUNwQixTQUFLLEdBQUw7QUFDRDtBQUNELE1BQUksV0FBVyxTQUFmLEVBQTBCO0FBQ3hCLGFBQVMsQ0FBVDtBQUNEO0FBQ0QsU0FBTyw0QkFDZSxFQURmLFVBQ3NCLEVBRHRCLFVBQzZCLE1BRDdCLFVBQ3dDLEVBRHhDLFVBQytDLEVBRC9DLFVBQ3NELFNBRHRELFVBQ29FLFVBRHBFLFVBQ21GLFFBRG5GLFFBRUw7QUFBQSxXQUFNLElBQUksTUFBTSxnQkFBVixDQUEyQixFQUEzQixFQUErQixFQUEvQixFQUFtQyxNQUFuQyxFQUEyQyxFQUEzQyxFQUErQyxFQUEvQyxFQUFtRCxTQUFuRCxFQUE4RCxVQUE5RCxFQUEwRSxRQUExRSxDQUFOO0FBQUEsR0FGSyxDQUFQO0FBR0QiLCJmaWxlIjoic3JjL2N5bGluZGVyLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.cylinder = cylinder;
})();
(function(){
"use strict";

function deleteSetting(name) {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9kZWxldGVTZXR0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsUUFBTSxlQURPO0FBRWIsY0FBWSxDQUFDO0FBQ1gsVUFBTSxPQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELENBRkM7QUFPYixlQUFhLHFDQVBBO0FBUWIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7Ozs7O0FBRkosR0FBRDtBQVJHLENBQWY7O0FBcUJBLFNBQVMsYUFBVCxDQUF1QixJQUF2QixFQUE2QjtBQUMzQixNQUFJLE9BQU8sWUFBWCxFQUF5QjtBQUN2QixXQUFPLFlBQVAsQ0FBb0IsVUFBcEIsQ0FBK0IsSUFBL0I7QUFDRDtBQUNGIiwiZmlsZSI6InNyYy9kZWxldGVTZXR0aW5nLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.deleteSetting = deleteSetting;
})();
(function(){
"use strict";

function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9lbWl0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsUUFBTSxNQURPO0FBRWIsZUFBYSw2R0FGQTtBQUdiLGNBQVksQ0FBQztBQUNYLFVBQU0sS0FESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxNQURMO0FBRUQsVUFBTSxPQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWE7QUFKWixHQUpTLENBSEM7QUFhYixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQWJHLENBQWY7O0FBdUNBLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUIsSUFBbkIsRUFBeUI7QUFDdkIsTUFBSSxXQUFXLEtBQUssU0FBTCxJQUFrQixLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQWxCLElBQXlDLEtBQUssVUFBTCxJQUFtQixLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBM0U7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLFlBQVksSUFBSSxTQUFTLE1BQXpDLEVBQWlELEVBQUUsQ0FBbkQsRUFBc0Q7QUFDcEQsYUFBUyxDQUFULEVBQVksSUFBWjtBQUNEO0FBQ0YiLCJmaWxlIjoic3JjL2VtaXQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.emit = emit;
})();
(function(){
"use strict";

function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (elem[arr[i]] !== undefined) {
      return arr[i];
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9maW5kUHJvcGVydHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLGNBRE87QUFFYixlQUFhLDJGQUZBO0FBR2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxNQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLEtBREw7QUFFRCxVQUFNLE9BRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsQ0FIQztBQVliLFdBQVMsUUFaSTtBQWFiLFlBQVUsQ0FBQztBQUNULFVBQU0sK0NBREc7QUFFVCxpQkFBYTs7Ozs7QUFGSixHQUFEO0FBYkcsQ0FBZjs7QUF1QkEsU0FBUyxZQUFULENBQXNCLElBQXRCLEVBQTRCLEdBQTVCLEVBQWlDO0FBQy9CLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFJLE1BQXhCLEVBQWdDLEVBQUUsQ0FBbEMsRUFBcUM7QUFDbkMsUUFBSSxLQUFLLElBQUksQ0FBSixDQUFMLE1BQWlCLFNBQXJCLEVBQWdDO0FBQzlCLGFBQU8sSUFBSSxDQUFKLENBQVA7QUFDRDtBQUNGO0FBQ0YiLCJmaWxlIjoic3JjL2ZpbmRQcm9wZXJ0eS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.findProperty = findProperty;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function getSetting(name, defValue) {
  if (window.localStorage) {
    var val = window.localStorage.getItem(name);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (exp) {
        console.error("getSetting", name, val, typeof val === "undefined" ? "undefined" : _typeof(val), exp);
        console.error(exp);
        console.error("getSetting", name, val, typeof val === "undefined" ? "undefined" : _typeof(val));
      }
    }
  }
  return defValue;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9nZXRTZXR0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLFlBRE87QUFFYixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sVUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxDQUZDO0FBV2IsV0FBUyx1SUFYSTtBQVliLGVBQWE7Ozs7a0ZBWkE7QUFpQmIsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQWpCRyxDQUFmOztBQWlDQSxTQUFTLFVBQVQsQ0FBb0IsSUFBcEIsRUFBMEIsUUFBMUIsRUFBb0M7QUFDbEMsTUFBSSxPQUFPLFlBQVgsRUFBeUI7QUFDdkIsUUFBSSxNQUFNLE9BQU8sWUFBUCxDQUFvQixPQUFwQixDQUE0QixJQUE1QixDQUFWO0FBQ0EsUUFBSSxHQUFKLEVBQVM7QUFDUCxVQUFJO0FBQ0YsZUFBTyxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVA7QUFDRCxPQUZELENBR0EsT0FBTyxHQUFQLEVBQVk7QUFDVixnQkFBUSxLQUFSLENBQWMsWUFBZCxFQUE0QixJQUE1QixFQUFrQyxHQUFsQyxTQUErQyxHQUEvQyx5Q0FBK0MsR0FBL0MsR0FBcUQsR0FBckQ7QUFDQSxnQkFBUSxLQUFSLENBQWMsR0FBZDtBQUNBLGdCQUFRLEtBQVIsQ0FBYyxZQUFkLEVBQTRCLElBQTVCLEVBQWtDLEdBQWxDLFNBQStDLEdBQS9DLHlDQUErQyxHQUEvQztBQUNEO0FBQ0Y7QUFDRjtBQUNELFNBQU8sUUFBUDtBQUNEIiwiZmlsZSI6InNyYy9nZXRTZXR0aW5nLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.getSetting = getSetting;
})();
(function(){
"use strict";

function hub() {
  return new THREE.Object3D();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9odWIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLEtBRE87QUFFYixlQUFhLG1YQUZBO0FBR2IsWUFBVSxDQUFDO0FBQ1QsVUFBTSxhQURHO0FBRVQsaUJBQWE7Ozs7QUFGSixHQUFEO0FBSEcsQ0FBZjs7QUFZQSxTQUFTLEdBQVQsR0FBZTtBQUNiLFNBQU8sSUFBSSxNQUFNLFFBQVYsRUFBUDtBQUNEIiwiZmlsZSI6InNyYy9odWIuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.hub = hub;
})();
(function(){
"use strict";

function identity(obj) {
  return obj;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pZGVudGl0eS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDckIsU0FBTyxHQUFQO0FBQ0QiLCJmaWxlIjoic3JjL2lkZW50aXR5LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.identity = identity;
})();
(function(){
"use strict";

var isChrome = !!window.chrome && !window.isOpera;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc0Nocm9tZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sVUFESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7OztBQUhILENBQVo7QUFPQSxJQUFNLFdBQVcsQ0FBQyxDQUFDLE9BQU8sTUFBVCxJQUFtQixDQUFDLE9BQU8sT0FBNUMiLCJmaWxlIjoic3JjL2lzQ2hyb21lLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.isChrome = isChrome;
})();
(function(){
"use strict";

var isFirefox = typeof window.InstallTrigger !== 'undefined';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc0ZpcmVmb3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixRQUFNLFdBREk7QUFFVixRQUFNLFNBRkk7QUFHVixlQUFhOzs7QUFISCxDQUFaO0FBT0EsSUFBTSxZQUFZLE9BQU8sT0FBTyxjQUFkLEtBQWlDLFdBQW5EIiwiZmlsZSI6InNyYy9pc0ZpcmVmb3guanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.isFirefox = isFirefox;
})();
(function(){
"use strict";

var isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc0dlYXJWUi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sVUFESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7QUFISCxDQUFaO0FBS0EsSUFBTSxXQUFXLFVBQVUsU0FBVixDQUFvQixPQUFwQixDQUE0QixXQUE1QixJQUEyQyxDQUFDLENBQTdEIiwiZmlsZSI6InNyYy9pc0dlYXJWUi5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.isGearVR = isGearVR;
})();
(function(){
"use strict";

var isIE = /*@cc_on!@*/false || !!document.documentMode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc0lFLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsUUFBTSxNQURJO0FBRVYsUUFBTSxTQUZJO0FBR1YsZUFBYTs7O0FBSEgsQ0FBWjtBQU9BLElBQU0sT0FBTyxZQUFhLFNBQVMsQ0FBQyxDQUFDLFNBQVMsWUFBOUMiLCJmaWxlIjoic3JjL2lzSUUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.isIE = isIE;
})();
(function(){
"use strict";

var isInIFrame = window.self !== window.top;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc0luSUZyYW1lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsUUFBTSxjQURJO0FBRVYsUUFBTSxTQUZJO0FBR1YsZUFBYTtBQUhILENBQVo7QUFLQSxJQUFNLGFBQWMsT0FBTyxJQUFQLEtBQWdCLE9BQU8sR0FBM0MiLCJmaWxlIjoic3JjL2lzSW5JRnJhbWUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.isInIFrame = isInIFrame;
})();
(function(){
"use strict";

var isMobile = function (a) {
  return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4))
  );
}(navigator.userAgent || navigator.vendor || window.opera);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc01vYmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sVUFESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7O0FBSEgsQ0FBWjtBQU1BLElBQU0sV0FBWSxVQUFVLENBQVYsRUFBYTtBQUM3QixTQUFPLHVVQUFzVSxJQUF0VSxDQUNILENBREcsS0FFTCwwa0RBQTBrRCxJQUExa0QsQ0FDRSxFQUFFLFNBQUYsQ0FBWSxDQUFaLEVBQWUsQ0FBZixDQURGO0FBRkY7QUFJRCxDQUxnQixDQUtkLFVBQVUsU0FBVixJQUF1QixVQUFVLE1BQWpDLElBQTJDLE9BQU8sS0FMcEMsQ0FBakIiLCJmaWxlIjoic3JjL2lzTW9iaWxlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.isMobile = isMobile;
})();
(function(){
"use strict";

var isOSX = /Macintosh/.test(navigator.userAgent || "");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc09TWC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sT0FESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7OztBQUhILENBQVo7QUFPQSxJQUFNLFFBQVEsWUFBWSxJQUFaLENBQWlCLFVBQVUsU0FBVixJQUF1QixFQUF4QyxDQUFkIiwiZmlsZSI6InNyYy9pc09TWC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.isOSX = isOSX;
})();
(function(){
"use strict";

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc09wZXJhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsUUFBTSxTQURJO0FBRVYsUUFBTSxTQUZJO0FBR1YsZUFBYTs7Ozs7QUFISCxDQUFaO0FBU0EsSUFBTSxVQUFVLENBQUMsQ0FBQyxPQUFPLEtBQVQsSUFBa0IsVUFBVSxTQUFWLENBQW9CLE9BQXBCLENBQTRCLE9BQTVCLEtBQXdDLENBQTFFIiwiZmlsZSI6InNyYy9pc09wZXJhLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.isOpera = isOpera;
})();
(function(){
"use strict";

var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc1NhZmFyaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sVUFESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7Ozs7O0FBSEgsQ0FBWjtBQVNBLElBQU0sV0FBVyxPQUFPLFNBQVAsQ0FBaUIsUUFBakIsQ0FBMEIsSUFBMUIsQ0FBK0IsT0FBTyxXQUF0QyxFQUNkLE9BRGMsQ0FDTixhQURNLElBQ1csQ0FENUIiLCJmaWxlIjoic3JjL2lzU2FmYXJpLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.isSafari = isSafari;
})();
(function(){
"use strict";

var isWebKit = !/iP(hone|od|ad)/.test(navigator.userAgent || "") || isOpera || isChrome;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc1dlYktpdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sVUFESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7OztBQUhILENBQVo7QUFPQSxJQUFNLFdBQVcsQ0FBRSxpQkFBaUIsSUFBakIsQ0FBc0IsVUFBVSxTQUFWLElBQXVCLEVBQTdDLENBQUYsSUFBdUQsT0FBdkQsSUFBa0UsUUFBbkYiLCJmaWxlIjoic3JjL2lzV2ViS2l0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.isWebKit = isWebKit;
})();
(function(){
"use strict";

var isWindows = /Windows/.test(navigator.userAgent || "");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc1dpbmRvd3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixRQUFNLFdBREk7QUFFVixRQUFNLFNBRkk7QUFHVixlQUFhOztBQUhILENBQVo7QUFNQSxJQUFNLFlBQVksVUFBVSxJQUFWLENBQWUsVUFBVSxTQUFWLElBQXVCLEVBQXRDLENBQWxCIiwiZmlsZSI6InNyYy9pc1dpbmRvd3MuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.isWindows = isWindows;
})();
(function(){
"use strict";

var isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pc2lPUy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sT0FESTtBQUVWLFFBQU0sU0FGSTtBQUdWLGVBQWE7OztBQUhILENBQVo7QUFPQSxJQUFNLFFBQVEsaUJBQWlCLElBQWpCLENBQXNCLFVBQVUsU0FBVixJQUF1QixFQUE3QyxDQUFkIiwiZmlsZSI6InNyYy9pc2lPUy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.isiOS = isiOS;
})();
(function(){
"use strict";

function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9saWdodC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGVBQWEsK0RBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxjQUFVLElBSEM7QUFJWCxpQkFBYSxvQ0FKRjtBQUtYLGFBQVM7QUFMRSxHQUFELEVBTVQ7QUFDRCxVQUFNLFdBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSw0QkFKWjtBQUtELGFBQVM7QUFMUixHQU5TLEVBWVQ7QUFDRCxVQUFNLFVBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSxvQ0FKWjtBQUtELGFBQVM7QUFMUixHQVpTLEVBa0JUO0FBQ0QsVUFBTSxPQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEsd0NBSlo7QUFLRCxhQUFTO0FBTFIsR0FsQlMsQ0FIQztBQTRCYixXQUFTLGtCQTVCSTtBQTZCYixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7QUFGSixHQUFEO0FBN0JHLENBQWY7O0FBb0NBLFNBQVMsS0FBVCxDQUFlLEtBQWYsRUFBc0IsU0FBdEIsRUFBaUMsUUFBakMsRUFBMkMsS0FBM0MsRUFBa0Q7QUFDaEQsU0FBTyxJQUFJLE1BQU0sVUFBVixDQUFxQixLQUFyQixFQUE0QixTQUE1QixFQUF1QyxRQUF2QyxFQUFpRCxLQUFqRCxDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL2xpZ2h0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.light = light;
})();
(function(){
"use strict";

function patch(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    if (obj1[k] === undefined || obj1[k] === null) {
      obj1[k] = obj2[k];
    }
  }
  return obj1;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9wYXRjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGNBQVksQ0FBQztBQUNYLFVBQU0sTUFESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxNQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLENBRkM7QUFXYixXQUFTLCtEQVhJO0FBWWIsZUFBYSxxR0FaQTtBQWFiLFlBQVUsQ0FBQztBQUNULFVBQU0scUJBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQWJHLENBQWY7O0FBb0NBLFNBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkI7QUFDekIsU0FBTyxRQUFRLEVBQWY7QUFDQSxPQUFLLElBQUksQ0FBVCxJQUFjLElBQWQsRUFBb0I7QUFDbEIsUUFBSSxLQUFLLENBQUwsTUFBWSxTQUFaLElBQXlCLEtBQUssQ0FBTCxNQUFZLElBQXpDLEVBQStDO0FBQzdDLFdBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxDQUFWO0FBQ0Q7QUFDRjtBQUNELFNBQU8sSUFBUDtBQUNEIiwiZmlsZSI6InNyYy9wYXRjaC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.patch = patch;
})();
(function(){
"use strict";

function put(object) {
  var box = {
    on: null,
    at: null,
    rot: null,
    scale: null,
    obj: function obj() {
      return object;
    }
  },
      on = function on(scene) {
    if (scene.appendChild) {
      scene.appendChild(object);
    } else {
      scene.add(object);
    }
    box.on = null;
    if (box.at || box.rot || box.scale) {
      return box;
    } else {
      return object;
    }
  },
      at = function at(x, y, z) {
    object.position.set(x, y, z);
    box.at = null;
    if (box.on || box.rot || box.scale) {
      return box;
    } else {
      return object;
    }
  },
      rot = function rot(x, y, z) {
    object.rotation.set(x, y, z);
    box.rot = null;
    if (box.on || box.at || box.scale) {
      return box;
    } else {
      return object;
    }
  },
      scale = function scale(x, y, z) {
    object.scale.set(x, y, z);
    box.scale = null;
    if (box.on || box.at || box.rot) {
      return box;
    } else {
      return object;
    }
  };

  box.on = on;
  box.at = at;
  box.rot = rot;
  box.scale = scale;

  return box;
}
//# sourceMappingURL=data:application/json;base64,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

if(typeof window !== "undefined") window.put = put;
})();
(function(){
"use strict";

function quad(w, h, s, t) {
  if (h === undefined) {
    h = w;
  }
  return cache("PlaneBufferGeometry(" + w + ", " + h + ", " + s + ", " + t + ")", function () {
    return new THREE.PlaneBufferGeometry(w, h, s, t);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9xdWFkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsUUFBTSxNQURPO0FBRWIsZUFBYTtBQUZBLENBQWY7O0FBS0EsU0FBUyxJQUFULENBQWMsQ0FBZCxFQUFpQixDQUFqQixFQUFvQixDQUFwQixFQUF1QixDQUF2QixFQUEwQjtBQUN4QixNQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNuQixRQUFJLENBQUo7QUFDRDtBQUNELFNBQU8sK0JBQ2tCLENBRGxCLFVBQ3dCLENBRHhCLFVBQzhCLENBRDlCLFVBQ29DLENBRHBDLFFBRUw7QUFBQSxXQUFNLElBQUksTUFBTSxtQkFBVixDQUE4QixDQUE5QixFQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxDQUFOO0FBQUEsR0FGSyxDQUFQO0FBR0QiLCJmaWxlIjoic3JjL3F1YWQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.quad = quad;
})();
(function(){
"use strict";

function range(n, m, s, t) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9yYW5nZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGVBQWE7QUFGQSxDQUFmOztBQUtBLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsRUFBMkI7QUFDekIsTUFBSSxLQUFLLEtBQUssQ0FBTCxJQUFVLENBQW5CO0FBQUEsTUFDRSxLQUFLLEtBQUssQ0FBTCxJQUFVLENBRGpCO0FBQUEsTUFFRSxLQUFLLEtBQUssQ0FBTCxJQUFVLENBRmpCO0FBQUEsTUFHRSxLQUFLLEtBQUssQ0FBTCxJQUFVLENBSGpCO0FBSUEsT0FBSyxJQUFJLElBQUksRUFBYixFQUFpQixJQUFJLEVBQXJCLEVBQXlCLEtBQUssRUFBOUIsRUFBa0M7QUFDaEMsT0FBRyxDQUFIO0FBQ0Q7QUFDRiIsImZpbGUiOiJzcmMvcmFuZ2UuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.range = range;
})();
(function(){
"use strict";

function readForm(ctrls) {
  var state = {};
  if (ctrls) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if ((c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          state[name] = c.value;
        } else if (c.type === "checkbox" || c.type === "radio") {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9yZWFkRm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFHQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sVUFETztBQUViLGNBQVksQ0FBQztBQUNYLFVBQU0sT0FESztBQUVYLFVBQU0sa0JBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsQ0FGQztBQU9iLFdBQVMsUUFQSTtBQVFiLGVBQWEsMk9BUkE7QUFTYixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFURyxDQUFmOztBQW9DQSxTQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBeUI7QUFDdkIsTUFBSSxRQUFRLEVBQVo7QUFDQSxNQUFJLEtBQUosRUFBVztBQUNULFNBQUssSUFBSSxJQUFULElBQWlCLEtBQWpCLEVBQXdCO0FBQ3RCLFVBQUksSUFBSSxNQUFNLElBQU4sQ0FBUjtBQUNBLFVBQUksQ0FBQyxFQUFFLE9BQUYsS0FBYyxPQUFkLElBQXlCLEVBQUUsT0FBRixLQUFjLFFBQXhDLE1BQ0QsQ0FBQyxFQUFFLE9BQUgsSUFBYyxDQUFDLEVBQUUsT0FBRixDQUFVLFNBRHhCLENBQUosRUFDd0M7QUFDdEMsWUFBSSxFQUFFLElBQUYsS0FBVyxNQUFYLElBQXFCLEVBQUUsSUFBRixLQUFXLFVBQWhDLElBQThDLEVBQUUsT0FBRixLQUFjLFFBQWhFLEVBQTBFO0FBQ3hFLGdCQUFNLElBQU4sSUFBYyxFQUFFLEtBQWhCO0FBQ0QsU0FGRCxNQUdLLElBQUksRUFBRSxJQUFGLEtBQVcsVUFBWCxJQUF5QixFQUFFLElBQUYsS0FBVyxPQUF4QyxFQUFpRDtBQUNwRCxnQkFBTSxJQUFOLElBQWMsRUFBRSxPQUFoQjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsU0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoic3JjL3JlYWRGb3JtLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.readForm = readForm;
})();
(function(){
"use strict";

function setFalse(evt) {
  evt.returnValue = false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXRGYWxzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsRUFBdUI7QUFDckIsTUFBSSxXQUFKLEdBQWtCLEtBQWxCO0FBQ0QiLCJmaWxlIjoic3JjL3NldEZhbHNlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.setFalse = setFalse;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function setSetting(name, val) {
  if (window.localStorage && val) {
    try {
      window.localStorage.setItem(name, JSON.stringify(val));
    } catch (exp) {
      console.error("setSetting", name, val, typeof val === "undefined" ? "undefined" : _typeof(val), exp);
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXRTZXR0aW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLFlBRE87QUFFYixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sS0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxDQUZDO0FBV2IsZUFBYTs7MEZBWEE7QUFjYixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBZEcsQ0FBZjs7QUE4QkEsU0FBUyxVQUFULENBQW9CLElBQXBCLEVBQTBCLEdBQTFCLEVBQStCO0FBQzdCLE1BQUksT0FBTyxZQUFQLElBQXVCLEdBQTNCLEVBQWdDO0FBQzlCLFFBQUk7QUFDRixhQUFPLFlBQVAsQ0FBb0IsT0FBcEIsQ0FBNEIsSUFBNUIsRUFBa0MsS0FBSyxTQUFMLENBQWUsR0FBZixDQUFsQztBQUNELEtBRkQsQ0FHQSxPQUFPLEdBQVAsRUFBWTtBQUNWLGNBQVEsS0FBUixDQUFjLFlBQWQsRUFBNEIsSUFBNUIsRUFBa0MsR0FBbEMsU0FBK0MsR0FBL0MseUNBQStDLEdBQS9DLEdBQXFELEdBQXJEO0FBQ0Q7QUFDRjtBQUNGIiwiZmlsZSI6InNyYy9zZXRTZXR0aW5nLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.setSetting = setSetting;
})();
(function(){
"use strict";

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
  return cache("InsideSphereGeometry(" + r + ", " + slices + ", " + rings + ", " + phi + ", " + theta + ")", function () {
    return new InsideSphereGeometry(r, slices, rings, phiStart, phi, thetaStart, theta, true);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zaGVsbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sT0FETztBQUViLGNBQVksQ0FBQztBQUNYLFVBQU0sUUFESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxlQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLEVBUVQ7QUFDRCxVQUFNLGdCQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLEVBWVQ7QUFDRCxVQUFNLEtBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYSx1REFKWjtBQUtELGFBQVM7QUFMUixHQVpTLEVBa0JUO0FBQ0QsVUFBTSxZQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEsdURBSlo7QUFLRCxhQUFTO0FBTFIsR0FsQlMsQ0FGQztBQTJCYixlQUFhOzs7aUZBM0JBO0FBK0JiLFlBQVUsQ0FBQztBQUNULFVBQU0scUJBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBL0JHLENBQWY7O0FBaUVBLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0IsTUFBbEIsRUFBMEIsS0FBMUIsRUFBaUMsR0FBakMsRUFBc0MsS0FBdEMsRUFBNkM7QUFDM0MsTUFBSSxRQUFRLElBQVo7QUFDQSxNQUFJLFFBQVEsU0FBWixFQUF1QjtBQUNyQixVQUFNLEtBQUssRUFBTCxHQUFVLEtBQWhCO0FBQ0Q7QUFDRCxNQUFJLFVBQVUsU0FBZCxFQUF5QjtBQUN2QixZQUFRLEtBQUssRUFBTCxHQUFVLEtBQVYsR0FBa0IsR0FBMUI7QUFDRDtBQUNELE1BQUksV0FBVyxNQUFNLEtBQUssRUFBWCxHQUFnQixNQUFNLEdBQXJDO0FBQUEsTUFDRSxhQUFhLENBQUMsS0FBSyxFQUFMLEdBQVUsS0FBWCxJQUFvQixHQURuQztBQUVBLFNBQU8sZ0NBQ21CLENBRG5CLFVBQ3lCLE1BRHpCLFVBQ29DLEtBRHBDLFVBQzhDLEdBRDlDLFVBQ3NELEtBRHRELFFBRUw7QUFBQSxXQUFNLElBQUksb0JBQUosQ0FBeUIsQ0FBekIsRUFBNEIsTUFBNUIsRUFBb0MsS0FBcEMsRUFBMkMsUUFBM0MsRUFBcUQsR0FBckQsRUFBMEQsVUFBMUQsRUFBc0UsS0FBdEUsRUFBNkUsSUFBN0UsQ0FBTjtBQUFBLEdBRkssQ0FBUDtBQUdEIiwiZmlsZSI6InNyYy9zaGVsbC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.shell = shell;
})();
(function(){
"use strict";

function sphere(r, slices, rings) {
  return cache("SphereGeometry(" + r + ", " + slices + ", " + rings + ")", function () {
    return new THREE.SphereGeometry(r, slices, rings);
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zcGhlcmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLFFBRE87QUFFYixlQUFhO0FBRkEsQ0FBZjs7QUFLQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsTUFBbkIsRUFBMkIsS0FBM0IsRUFBa0M7QUFDaEMsU0FBTywwQkFDYSxDQURiLFVBQ21CLE1BRG5CLFVBQzhCLEtBRDlCLFFBRUw7QUFBQSxXQUFNLElBQUksTUFBTSxjQUFWLENBQXlCLENBQXpCLEVBQTRCLE1BQTVCLEVBQW9DLEtBQXBDLENBQU47QUFBQSxHQUZLLENBQVA7QUFHRCIsImZpbGUiOiJzcmMvc3BoZXJlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.sphere = sphere;
})();
(function(){
"use strict";

var textureLoader = null,
    textureCache = {};

Primrose.loadTexture = function (url) {
  if (!textureLoader) {
    textureLoader = new THREE.TextureLoader();
  }
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache("Image(" + url + ")", function () {
    return new Promise(function (resolve, reject) {
      return textureLoader.load(url, resolve, null, reject);
    });
  });
};

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
  } else {
    var txtID = (txt.id || txt).toString(),
        textureDescription = "Primrose.textured(" + txtID + ", " + options.txtRepeatS + ", " + options.txtRepeatT + ")",
        materialDescription = "Primrose.material(" + textureDescription + ", " + options.unshaded + ", " + options.opacity + ", " + options.roughness + ", " + options.metalness + ", " + options.wireframe + ", " + options.emissive + ")";
    material = cache(materialDescription, function () {
      var materialOptions = {
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: options.side || THREE.FrontSide
      },
          MaterialType = THREE.MeshStandardMaterial;

      if (options.unshaded) {
        materialOptions.shading = THREE.FlatShading;
        MaterialType = THREE.MeshBasicMaterial;
      } else {
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
  } else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = material;
  }

  if (typeof txt === "number" || txt instanceof Number) {
    material.color.set(txt);
  } else if (txt) {
    material.color.set(0xffffff);

    var setTexture = function setTexture(texture) {
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

      if (options.scaleTextureWidth || options.scaleTextureHeight) {
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
        } else {
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
    } else if (txt instanceof Primrose.Surface) {
      txt._material = material;
      Primrose.Entity.registerEntity(txt);
      setTexture(txt);
      obj.surface = txt;
    } else if (typeof txt === "string") {
      Primrose.loadTexture(txt).then(setTexture).catch(console.error.bind(console, "Error loading texture", txt));
    } else if (txt instanceof Primrose.Text.Controls.TextBox) {
      setTexture(txt.renderer.texture);
    } else if (txt instanceof HTMLCanvasElement) {
      setTexture(new THREE.Texture(txt));
    } else {
      setTexture(txt);
    }
  }

  return obj;
}
//# sourceMappingURL=data:application/json;base64,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QXBDLEVBQThDO0FBQzVDLGtCQUFJLENBQUosS0FBVSxRQUFRLGlCQUFsQjtBQUNEO0FBQ0Y7QUFDRCxjQUFJLFFBQVEsa0JBQVosRUFBZ0M7QUFDOUIsaUJBQUssSUFBSSxDQUFULEVBQVksSUFBSSxJQUFJLE1BQXBCLEVBQTRCLEtBQUssR0FBRyxRQUFwQyxFQUE4QztBQUM1QyxrQkFBSSxDQUFKLElBQVMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFKLENBQUwsSUFBZSxRQUFRLGtCQUFwQztBQUNEO0FBQ0Y7QUFDRixTQWRELE1BZUs7QUFDSCxrQkFBUSxLQUFSLENBQWMsUUFBZDtBQUNEO0FBQ0Y7O0FBRUQsbUJBQWEsa0JBQWIsSUFBbUMsT0FBbkM7QUFDQSxlQUFTLEdBQVQsR0FBZSxPQUFmO0FBQ0EsZUFBUyxXQUFULEdBQXVCLElBQXZCO0FBQ0EsY0FBUSxXQUFSLEdBQXNCLElBQXRCO0FBQ0QsS0EvREQ7O0FBa0VBLFFBQUksYUFBYSxrQkFBYixDQUFKLEVBQXNDO0FBQ3BDLGlCQUFXLGFBQWEsa0JBQWIsQ0FBWDtBQUNELEtBRkQsTUFHSyxJQUFJLGVBQWUsU0FBUyxPQUE1QixFQUFxQztBQUN4QyxVQUFJLFNBQUosR0FBZ0IsUUFBaEI7QUFDQSxlQUFTLE1BQVQsQ0FBZ0IsY0FBaEIsQ0FBK0IsR0FBL0I7QUFDQSxpQkFBVyxHQUFYO0FBQ0EsVUFBSSxPQUFKLEdBQWMsR0FBZDtBQUNELEtBTEksTUFNQSxJQUFJLE9BQU8sR0FBUCxLQUFlLFFBQW5CLEVBQTZCO0FBQ2hDLGVBQVMsV0FBVCxDQUFxQixHQUFyQixFQUNHLElBREgsQ0FDUSxVQURSLEVBRUcsS0FGSCxDQUVTLFFBQVEsS0FBUixDQUFjLElBQWQsQ0FBbUIsT0FBbkIsRUFBNEIsdUJBQTVCLEVBQXFELEdBQXJELENBRlQ7QUFHRCxLQUpJLE1BS0EsSUFBSSxlQUFlLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsT0FBMUMsRUFBbUQ7QUFDdEQsaUJBQVcsSUFBSSxRQUFKLENBQWEsT0FBeEI7QUFDRCxLQUZJLE1BR0EsSUFBSSxlQUFlLGlCQUFuQixFQUFzQztBQUN6QyxpQkFBVyxJQUFJLE1BQU0sT0FBVixDQUFrQixHQUFsQixDQUFYO0FBQ0QsS0FGSSxNQUdBO0FBQ0gsaUJBQVcsR0FBWDtBQUNEO0FBQ0Y7O0FBRUQsU0FBTyxHQUFQO0FBQ0QiLCJmaWxlIjoic3JjL3RleHR1cmVkLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.textured = textured;
})();
(function(){
"use strict";

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy92My5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFFBQU0sSUFETztBQUViLGVBQWEsOERBRkE7QUFHYixjQUFZLENBQUM7QUFDWCxVQUFNLEdBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sR0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxHQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLENBSEM7QUFnQmIsV0FBUyxlQWhCSTtBQWlCYixZQUFVLENBQUM7QUFDVCxVQUFNLGlCQURHO0FBRVQsaUJBQWE7Ozs7OztBQUZKLEdBQUQ7QUFqQkcsQ0FBZjs7QUE0QkEsU0FBUyxFQUFULENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsQ0FBbEIsRUFBcUI7QUFDbkIsU0FBTyxJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL3YzLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.v3 = v3;
})();
(function(){
"use strict";

function writeForm(ctrls, state) {
  if (state) {
    for (var name in ctrls) {
      var c = ctrls[name];
      if (state[name] !== null && state[name] !== undefined && (c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
        if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
          c.value = state[name];
        } else if (c.type === "checkbox" || c.type === "radio") {
          c.checked = state[name];
        }
      }
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy93cml0ZUZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixRQUFNLFdBRE87QUFFYixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLGtCQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLE9BREw7QUFFRCxVQUFNLGFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsQ0FGQztBQVdiLGVBQWEsMElBWEE7QUFZYixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFaRyxDQUFmOztBQXVDQSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEIsS0FBMUIsRUFBaUM7QUFDL0IsTUFBSSxLQUFKLEVBQVc7QUFDVCxTQUFLLElBQUksSUFBVCxJQUFpQixLQUFqQixFQUF3QjtBQUN0QixVQUFJLElBQUksTUFBTSxJQUFOLENBQVI7QUFDQSxVQUFJLE1BQU0sSUFBTixNQUFnQixJQUFoQixJQUF3QixNQUFNLElBQU4sTUFBZ0IsU0FBeEMsS0FDRCxFQUFFLE9BQUYsS0FDQyxPQURELElBQ1ksRUFBRSxPQUFGLEtBQWMsUUFGekIsTUFFdUMsQ0FBQyxFQUFFLE9BQUgsSUFDdkMsQ0FBQyxFQUFFLE9BQUYsQ0FBVSxTQUhYLENBQUosRUFHMkI7QUFDekIsWUFBSSxFQUFFLElBQUYsS0FBVyxNQUFYLElBQXFCLEVBQUUsSUFBRixLQUFXLFVBQWhDLElBQThDLEVBQUUsT0FBRixLQUFjLFFBQWhFLEVBQTBFO0FBQ3hFLFlBQUUsS0FBRixHQUFVLE1BQU0sSUFBTixDQUFWO0FBQ0QsU0FGRCxNQUdLLElBQUksRUFBRSxJQUFGLEtBQVcsVUFBWCxJQUF5QixFQUFFLElBQUYsS0FBVyxPQUF4QyxFQUFpRDtBQUNwRCxZQUFFLE9BQUYsR0FBWSxNQUFNLElBQU4sQ0FBWjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YiLCJmaWxlIjoic3JjL3dyaXRlRm9ybS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.writeForm = writeForm;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AbstractEventEmitter = function () {
  function AbstractEventEmitter() {
    _classCallCheck(this, AbstractEventEmitter);

    this._handlers = {};
  }

  _createClass(AbstractEventEmitter, [{
    key: "addEventListener",
    value: function addEventListener(name, thunk) {
      if (!this._handlers[name]) {
        this._handlers[name] = [];
      }
      this._handlers[name].push(thunk);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(name, thunk) {
      if (this._handlers[name]) {
        var idx = this._handlers[name].indexOf(thunk);
        if (idx > -1) {
          this._handlers[name].splice(idx, 1);
        }
      }
    }
  }, {
    key: "emit",
    value: function emit(name, obj) {
      if (this._handlers[name]) {
        for (var i = 0; i < this._handlers[name].length; ++i) {
          this._handlers[name][i](obj);
        }
      }
    }
  }]);

  return AbstractEventEmitter;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9BYnN0cmFjdEV2ZW50RW1pdHRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0lBRU0sb0I7QUFDSixrQ0FBYztBQUFBOztBQUNaLFNBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNEOzs7O3FDQUVnQixJLEVBQU0sSyxFQUFPO0FBQzVCLFVBQUksQ0FBQyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQUwsRUFBMkI7QUFDekIsYUFBSyxTQUFMLENBQWUsSUFBZixJQUF1QixFQUF2QjtBQUNEO0FBQ0QsV0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixJQUFyQixDQUEwQixLQUExQjtBQUNEOzs7d0NBRW1CLEksRUFBTSxLLEVBQU87QUFDL0IsVUFBSSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQUosRUFBMEI7QUFDeEIsWUFBSSxNQUFNLEtBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsT0FBckIsQ0FBNkIsS0FBN0IsQ0FBVjtBQUNBLFlBQUksTUFBTSxDQUFDLENBQVgsRUFBYztBQUNaLGVBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsQ0FBNEIsR0FBNUIsRUFBaUMsQ0FBakM7QUFDRDtBQUNGO0FBQ0Y7Ozt5QkFFSSxJLEVBQU0sRyxFQUFLO0FBQ2QsVUFBSSxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQUosRUFBMEI7QUFDeEIsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBekMsRUFBaUQsRUFBRSxDQUFuRCxFQUFzRDtBQUNwRCxlQUFLLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLENBQXJCLEVBQXdCLEdBQXhCO0FBQ0Q7QUFDRjtBQUNGIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9BYnN0cmFjdEV2ZW50RW1pdHRlci5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.AbstractEventEmitter = AbstractEventEmitter;
})();
(function(){
"use strict";

var DEG2RAD = Math.PI / 180,
    RAD2DEG = 180 / Math.PI;
function Angle(v) {
  if (typeof v !== "number") {
    throw new Error("Angle must be initialized with a number. Initial value was: " + v);
  }

  var value = v,
      delta = 0,
      d1,
      d2,
      d3;
  Object.defineProperty(this, "degrees", {
    set: function set(newValue) {
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
        } else if (d3 < d1) {
          delta -= 360;
        }
      } while (d1 > d2 || d1 > d3);
      value = newValue + delta;
    },
    get: function get() {
      return value;
    }
  });
}

Object.defineProperty(Angle.prototype, "radians", {
  get: function get() {
    return this.degrees * DEG2RAD;
  },
  set: function set(val) {
    this.degrees = val * RAD2DEG;
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9BbmdsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLFVBQVUsS0FBSyxFQUFMLEdBQVUsR0FBeEI7QUFBQSxJQUNFLFVBQVUsTUFBTSxLQUFLLEVBRHZCO0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFUixRQUFNLE9BRkU7QUFHUixlQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUZBSEw7QUF5QlIsY0FBWSxDQUFDO0FBQ1gsVUFBTSx1QkFESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxDQXpCSjtBQThCUixZQUFVLENBQUM7QUFDVCxVQUFNLGFBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7QUFGSixHQUFELEVBYVA7QUFDRCxVQUFNLDRCQURMO0FBRUQsaUJBQWE7Ozs7Ozs7Ozs7O0FBRlosR0FiTyxFQTBCUDtBQUNELFVBQU0sNEJBREw7QUFFRCxpQkFBYTs7Ozs7Ozs7Ozs7QUFGWixHQTFCTztBQTlCRixDQUFaOztBQXdFQSxTQUFTLEtBQVQsQ0FBZSxDQUFmLEVBQWtCO0FBQ2hCLE1BQUksT0FBUSxDQUFSLEtBQWUsUUFBbkIsRUFBNkI7QUFDM0IsVUFBTSxJQUFJLEtBQUosQ0FBVSxpRUFBaUUsQ0FBM0UsQ0FBTjtBQUNEOztBQUVELE1BQUksUUFBUSxDQUFaO0FBQUEsTUFDRSxRQUFRLENBRFY7QUFBQSxNQUVFLEVBRkY7QUFBQSxNQUdFLEVBSEY7QUFBQSxNQUlFLEVBSkY7QUFLQSxRQUFNLFFBQU4sQ0FBZTtBQUNiLFlBQVEsZ0JBREs7QUFFYixVQUFNLFNBRk87QUFHYixVQUFNLFFBSE87QUFJYixpQkFBYTtBQUpBLEdBQWY7QUFNQSxTQUFPLGNBQVAsQ0FBc0IsSUFBdEIsRUFBNEIsU0FBNUIsRUFBdUM7QUFDckMsU0FBSyxhQUFVLFFBQVYsRUFBb0I7QUFDdkIsU0FBRztBQUNEO0FBQ0E7QUFDQTtBQUNBLGFBQUssV0FBVyxLQUFYLEdBQW1CLEtBQXhCO0FBQ0EsYUFBSyxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQWQsQ0FBTDtBQUNBLGFBQUssS0FBSyxHQUFMLENBQVMsS0FBSyxHQUFkLENBQUw7QUFDQSxhQUFLLEtBQUssR0FBTCxDQUFTLEVBQVQsQ0FBTDtBQUNBLFlBQUksS0FBSyxFQUFMLElBQVcsS0FBSyxFQUFwQixFQUF3QjtBQUN0QixtQkFBUyxHQUFUO0FBQ0QsU0FGRCxNQUdLLElBQUksS0FBSyxFQUFULEVBQWE7QUFDaEIsbUJBQVMsR0FBVDtBQUNEO0FBQ0YsT0FkRCxRQWNTLEtBQUssRUFBTCxJQUFXLEtBQUssRUFkekI7QUFlQSxjQUFRLFdBQVcsS0FBbkI7QUFDRCxLQWxCb0M7QUFtQnJDLFNBQUssZUFBWTtBQUNmLGFBQU8sS0FBUDtBQUNEO0FBckJvQyxHQUF2QztBQXVCRDs7QUFFRCxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZ0JBREs7QUFFYixRQUFNLFNBRk87QUFHYixRQUFNLFFBSE87QUFJYixlQUFhO0FBSkEsQ0FBZjtBQU1BLE9BQU8sY0FBUCxDQUFzQixNQUFNLFNBQTVCLEVBQXVDLFNBQXZDLEVBQWtEO0FBQ2hELE9BQUssZUFBWTtBQUNmLFdBQU8sS0FBSyxPQUFMLEdBQWUsT0FBdEI7QUFDRCxHQUgrQztBQUloRCxPQUFLLGFBQVUsR0FBVixFQUFlO0FBQ2xCLFNBQUssT0FBTCxHQUFlLE1BQU0sT0FBckI7QUFDRDtBQU4rQyxDQUFsRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvQW5nbGUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Angle = Angle;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ID = 1,
    NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
    DELIM = "\\s*,\\s*",
    UNITS = "(?:em|px)",
    TRANSLATE_PATTERN = new RegExp("translate3d\\s*\\(\\s*" + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + "\\s*\\)", "i"),
    ROTATE_PATTERN = new RegExp("rotate3d\\s*\\(\\s*" + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + "rad\\s*\\)", "i");

var BaseControl = function (_Primrose$AbstractEve) {
  _inherits(BaseControl, _Primrose$AbstractEve);

  function BaseControl() {
    _classCallCheck(this, BaseControl);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BaseControl).call(this));

    _this.controlID = ID++;

    _this.focused = false;
    return _this;
  }

  _createClass(BaseControl, [{
    key: "focus",
    value: function focus() {
      this.focused = true;
      this.emit("focus", {
        target: this
      });
    }
  }, {
    key: "blur",
    value: function blur() {
      this.focused = false;
      emit.call(this, "blur", {
        target: this
      });
    }
  }, {
    key: "copyElement",
    value: function copyElement(elem) {
      this.element = elem;
      if (elem.style.transform) {
        var match = TRANSLATE_PATTERN.exec(elem.style.transform);
        if (match) {
          this.position.set(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
        }
        match = ROTATE_PATTERN.exec(elem.style.transform);
        if (match) {
          this.quaternion.setFromAxisAngle(new THREE.Vector3().set(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])), parseFloat(match[4]));
        }
      }
    }
  }]);

  return BaseControl;
}(Primrose.AbstractEventEmitter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9CYXNlQ29udHJvbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQUksS0FBSyxDQUFUO0FBQUEsSUFDRSxpQkFBaUIsNkNBRG5CO0FBQUEsSUFFRSxRQUFRLFdBRlY7QUFBQSxJQUdFLFFBQVEsV0FIVjtBQUFBLElBSUUsb0JBQW9CLElBQUksTUFBSixDQUFXLDJCQUM3QixjQUQ2QixHQUNaLEtBRFksR0FDSixLQURJLEdBRTdCLGNBRjZCLEdBRVosS0FGWSxHQUVKLEtBRkksR0FHN0IsY0FINkIsR0FHWixLQUhZLEdBR0osU0FIUCxFQUdrQixHQUhsQixDQUp0QjtBQUFBLElBUUUsaUJBQWlCLElBQUksTUFBSixDQUFXLHdCQUMxQixjQUQwQixHQUNULEtBRFMsR0FFMUIsY0FGMEIsR0FFVCxLQUZTLEdBRzFCLGNBSDBCLEdBR1QsS0FIUyxHQUkxQixjQUowQixHQUlULFlBSkYsRUFJZ0IsR0FKaEIsQ0FSbkI7O0FBY0EsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFUixRQUFNLGFBRkU7QUFHUixlQUFhOzs7QUFITCxDQUFaOztBQVFBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSxzQkFERztBQUVYLFFBQU0sT0FGSztBQUdYLGVBQWEsa0dBSEY7QUFJWCxZQUFVLENBQUM7QUFDVCxVQUFNLHlDQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFKQyxDQUFiOztBQThCQSxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsc0JBREc7QUFFWCxRQUFNLE1BRks7QUFHWCxlQUFhLG9HQUhGO0FBSVgsWUFBVSxDQUFDO0FBQ1QsVUFBTSx5Q0FERztBQUVULGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBSkMsQ0FBYjs7QUE4QkEsTUFBTSxNQUFOLENBQWE7QUFDWCxVQUFRLHNCQURHO0FBRVgsUUFBTSxhQUZLO0FBR1gsZUFBYSw2RUFIRjtBQUlYLGNBQVksQ0FBQztBQUNYLFVBQU0sTUFESztBQUVYLFVBQU0sU0FGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxDQUpEO0FBU1gsWUFBVSxDQUFDO0FBQ1QsVUFBTSxlQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBVEMsQ0FBYjs7SUF3Qk0sVzs7O0FBQ0oseUJBQWM7QUFBQTs7QUFBQTs7QUFHWixVQUFNLFFBQU4sQ0FBZTtBQUNiLFlBQU0sV0FETztBQUViLFlBQU0sUUFGTztBQUdiLG1CQUFhO0FBSEEsS0FBZjtBQUtBLFVBQUssU0FBTCxHQUFpQixJQUFqQjs7QUFFQSxVQUFNLFFBQU4sQ0FBZTtBQUNiLFlBQU0sU0FETztBQUViLFlBQU0sU0FGTztBQUdiLG1CQUFhO0FBSEEsS0FBZjtBQUtBLFVBQUssT0FBTCxHQUFlLEtBQWY7QUFmWTtBQWdCYjs7Ozs0QkFFTztBQUNOLFdBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxXQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CO0FBQ2pCLGdCQUFRO0FBRFMsT0FBbkI7QUFHRDs7OzJCQUVNO0FBQ0wsV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLFdBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDdEIsZ0JBQVE7QUFEYyxPQUF4QjtBQUdEOzs7Z0NBRVcsSSxFQUFNO0FBQ2hCLFdBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxVQUFJLEtBQUssS0FBTCxDQUFXLFNBQWYsRUFBMEI7QUFDeEIsWUFBSSxRQUFRLGtCQUFrQixJQUFsQixDQUF1QixLQUFLLEtBQUwsQ0FBVyxTQUFsQyxDQUFaO0FBQ0EsWUFBSSxLQUFKLEVBQVc7QUFDVCxlQUFLLFFBQUwsQ0FBYyxHQUFkLENBQ0UsV0FBVyxNQUFNLENBQU4sQ0FBWCxDQURGLEVBRUUsV0FBVyxNQUFNLENBQU4sQ0FBWCxDQUZGLEVBR0UsV0FBVyxNQUFNLENBQU4sQ0FBWCxDQUhGO0FBSUQ7QUFDRCxnQkFBUSxlQUFlLElBQWYsQ0FBb0IsS0FBSyxLQUFMLENBQVcsU0FBL0IsQ0FBUjtBQUNBLFlBQUksS0FBSixFQUFXO0FBQ1QsZUFBSyxVQUFMLENBQWdCLGdCQUFoQixDQUNFLElBQUksTUFBTSxPQUFWLEdBQ0MsR0FERCxDQUVFLFdBQVcsTUFBTSxDQUFOLENBQVgsQ0FGRixFQUdFLFdBQVcsTUFBTSxDQUFOLENBQVgsQ0FIRixFQUlFLFdBQVcsTUFBTSxDQUFOLENBQVgsQ0FKRixDQURGLEVBTUUsV0FBVyxNQUFNLENBQU4sQ0FBWCxDQU5GO0FBT0Q7QUFDRjtBQUNGOzs7O0VBdER1QixTQUFTLG9CIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9CYXNlQ29udHJvbC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.BaseControl = BaseControl;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MILLISECONDS_TO_SECONDS = 0.001;

var BrowserEnvironment = function (_Primrose$AbstractEve) {
  _inherits(BrowserEnvironment, _Primrose$AbstractEve);

  function BrowserEnvironment(options) {
    var _arguments = arguments;

    _classCallCheck(this, BrowserEnvironment);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BrowserEnvironment).call(this));

    _this.options = patch(options, BrowserEnvironment.DEFAULTS);
    _this.options.foregroundColor = _this.options.foregroundColor || complementColor(new THREE.Color(_this.options.backgroundColor)).getHex();

    _this.zero = function () {
      if (!_this.input.lockMovement) {
        _this.input.zero();
        if (_this.quality === Quality.NONE) {
          _this.quality = Quality.HIGH;
        }
      }
    };

    var createPickableObject = function createPickableObject(obj, includeGeometry) {
      var geomObj = obj;
      if ((obj.type === "Object3D" || obj.type === "Group") && obj.children[0]) {
        geomObj = obj.children[0];
        geomObj.name = geomObj.name || obj.name;
      }
      var id = geomObj.uuid,
          mLeft = new THREE.Matrix4(),
          mRight = new THREE.Matrix4().identity(),
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
        inScene = inScene || head === _this.scene;
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
        } else {
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

    _this.registerPickableObject = function (obj) {
      if (obj) {
        var bag = createPickableObject(obj, true),
            verts,
            faces,
            uvs,
            i,
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
          } else {
            for (i = 0; i < pos.count; i += 3) {
              faces.push([i, i + 1, i + 2]);
            }
          }
        } else {
          verts = geometry.vertices.map(function (v) {
            return v.toArray();
          });
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

        _this.pickableObjects[bag.uuid] = obj;
        _this.projector.setObject(bag);
      }
    };

    var lastHits = null,
        currentHits = {},
        handleHit = function handleHit(h) {
      var dt;
      _this.projector.ready = true;
      lastHits = currentHits;
      currentHits = h;
    };

    var update = function update(t) {
      var dt = t - lt,
          i,
          j;
      lt = t;

      movePlayer(dt);
      _this.input.resolvePicking(currentHits, lastHits, _this.pickableObjects);
      moveSky();
      moveGround();
      _this.network.update(dt);
      checkQuality();

      _this.emit("update", dt);
    };

    var movePlayer = function movePlayer(dt) {
      _this.input.update(dt);

      if (_this.projector.ready) {
        _this.projector.ready = false;
        var arr = [],
            del = [];
        for (var key in _this.pickableObjects) {
          var obj = _this.pickableObjects[key],
              p = createPickableObject(obj);
          if (p) {
            arr.push(p);
            if (p.inScene === false) {
              del.push(key);
            }
          }
        }

        if (arr.length > 0) {
          _this.projector.updateObjects(arr);
        }
        for (var i = 0; i < del.length; ++i) {
          delete _this.pickableObjects[del[i]];
        }

        _this.projector.projectPointers(_this.input.segments);
      }
    };

    var moveSky = function moveSky() {
      if (_this.sky) {
        _this.sky.position.copy(_this.input.head.position);
      }
    };

    var moveGround = function moveGround() {
      if (_this.ground) {
        _this.ground.position.set(Math.floor(_this.input.head.position.x), -0.02, Math.floor(_this.input.head.position.z));
        _this.ground.material.needsUpdate = true;
      }
    };

    var animate = function animate(t) {
      update(t * MILLISECONDS_TO_SECONDS);
      render();
      RAF(animate);
    };

    var render = function render() {
      _this.camera.position.set(0, 0, 0);
      _this.camera.quaternion.set(0, 0, 0, 1);
      _this.audio.setPlayer(_this.input.head.mesh);
      if (_this.input.VR.isPresenting) {
        _this.renderer.clear(true, true, true);

        var trans = _this.input.VR.getTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);
        for (var i = 0; trans && i < trans.length; ++i) {
          var st = trans[i],
              v = st.viewport,
              side = 2 * i - 1;
          Primrose.Entity.eyeBlankAll(i);
          _this.camera.projectionMatrix.copy(st.projection);
          _this.camera.translateOnAxis(st.translation, 1);
          _this.renderer.setViewport(v.left * resolutionScale, v.top * resolutionScale, v.width * resolutionScale, v.height * resolutionScale);
          _this.renderer.render(_this.scene, _this.camera);
          _this.camera.translateOnAxis(st.translation, -1);
        }
        _this.input.submitFrame();
      }

      if (!_this.input.VR.isPresenting || _this.input.VR.canMirror && !_this.options.disableMirroring) {
        _this.camera.fov = _this.options.defaultFOV;
        _this.camera.aspect = _this.renderer.domElement.width / _this.renderer.domElement.height;
        _this.camera.updateProjectionMatrix();
        _this.renderer.clear(true, true, true);
        _this.renderer.setViewport(0, 0, _this.renderer.domElement.width, _this.renderer.domElement.height);
        _this.renderer.render(_this.scene, _this.camera);
      }
    };

    var modifyScreen = function modifyScreen() {
      var p = _this.input.VR.getTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);

      if (p) {
        var canvasWidth = 0,
            canvasHeight = 0;

        for (var i = 0; i < p.length; ++i) {
          canvasWidth += p[i].viewport.width;
          canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
        }
        canvasWidth = Math.floor(canvasWidth * resolutionScale);
        canvasHeight = Math.floor(canvasHeight * resolutionScale);

        _this.renderer.domElement.width = canvasWidth;
        _this.renderer.domElement.height = canvasHeight;
        if (!_this.timer) {
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
      scene: _this.options.sceneModel,
      avatar: _this.options.avatarModel,
      button: _this.options.button && typeof _this.options.button.model === "string" && _this.options.button.model,
      font: _this.options.font
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
        create: function create() {
          return new Primrose.Text.Controls.TextBox({
            tokenizer: Primrose.Text.Grammars.PlainText,
            hideLineNumbers: true,
            readOnly: true
          });
        }
      }
    };

    _this.factories = factories;

    _this.createElement = function (type) {
      if (factories[type]) {
        return factories[type].create();
      }
    };

    _this.appendChild = function (elem) {
      if (elem instanceof THREE.Mesh) {
        _this.scene.add(elem);
        _this.registerPickableObject(elem);
      } else {
        return elem.addToBrowserEnvironment(_this, _this.scene);
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
      while (hsl.h > 1) {
        hsl.h -= 1;
      }rgb.setHSL(hsl.h, hsl.s, hsl.l);
      return rgb;
    }

    var modelsReady = Primrose.ModelLoader.loadObjects(modelFiles).then(function (models) {
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
        _this.buttonFactory = new Primrose.ButtonFactory(models.button, _this.options.button.options);
      } else {
        _this.buttonFactory = new Primrose.ButtonFactory(brick(0xff0000, 1, 1, 1), {
          maxThrow: 0.1,
          minDeflection: 10,
          colorUnpressed: 0x7f0000,
          colorPressed: 0x007f00,
          toggle: true
        });
      }
    }).catch(function (err) {
      console.error(err);
      if (!_this.buttonFactory) {
        _this.buttonFactory = new Primrose.ButtonFactory(brick(0xff0000, 1, 1, 1), {
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
    _this.avatarHeight = _this.options.avatarHeight;
    _this.walkSpeed = _this.options.walkSpeed;

    _this.audio = new Primrose.Output.Audio3D();
    var audioReady = null,
        ocean = null;
    if (_this.options.ambientSound && !isMobile) {
      audioReady = _this.audio.load3DSound(_this.options.ambientSound, true, -1, 1, -1).then(function (aud) {
        ocean = aud;
        if (!(ocean.source instanceof MediaElementAudioSourceNode)) {
          ocean.volume.gain.value = 0.1;
          console.log(ocean.source);
          ocean.source.start();
        }
      }).catch(console.error.bind(console, "Audio3D loadSource"));
    } else {
      audioReady = Promise.resolve();
    }

    var documentReady = null;
    if (document.readyState === "complete") {
      documentReady = Promise.resolve("already");
    } else {
      documentReady = new Promise(function (resolve, reject) {
        document.addEventListener("readystatechange", function (evt) {
          if (document.readyState === "complete") {
            resolve("had to wait for it");
          }
        }, false);
      });
    }

    _this.music = new Primrose.Output.Music(_this.audio.context);

    _this.pickableObjects = {};

    _this.projector = new Primrose.Workerize(Primrose.Projector);

    _this.options.scene = _this.scene = _this.options.scene || new THREE.Scene();
    if (_this.options.useFog) {
      _this.scene.fog = new THREE.FogExp2(_this.options.backgroundColor, 2 / _this.options.drawDistance);
    }

    _this.camera = new THREE.PerspectiveCamera(75, 1, _this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);
    if (_this.options.skyTexture !== undefined) {
      _this.sky = textured(shell(_this.options.drawDistance, 18, 9, Math.PI * 2, Math.PI), _this.options.skyTexture, {
        unshaded: true
      });
      _this.sky.name = "Sky";
      _this.scene.add(_this.sky);
    }

    if (_this.options.groundTexture !== undefined) {
      var dim = 10,
          gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
      _this.ground = textured(gm, _this.options.groundTexture, {
        txtRepeatS: dim * 5,
        txtRepeatT: dim * 5
      });
      if (_this.options.sceneModel !== undefined) {
        _this.ground.position.y = -0.02;
      }
      _this.ground.rotation.x = -Math.PI / 2;
      _this.ground.name = "Ground";
      _this.scene.add(_this.ground);
      _this.registerPickableObject(_this.ground);
    }

    if (_this.passthrough) {
      _this.camera.add(_this.passthrough.mesh);
    }

    var buildScene = function buildScene(sceneGraph) {
      sceneGraph.buttons = [];
      sceneGraph.traverse(function (child) {
        if (child.isButton) {
          sceneGraph.buttons.push(new Primrose.Controls.Button3D(child.parent, child.name));
        }
        if (child.name) {
          sceneGraph[child.name] = child;
        }
      });
      _this.scene.add.apply(_this.scene, sceneGraph.children);
      _this.scene.traverse(function (obj) {
        if (_this.options.disableDefaultLighting && obj.material && obj.material.map) {
          textured(obj, obj.material.map, {
            unshaded: true
          });
        }
        if (obj.name) {
          _this.scene[obj.name] = obj;
        }
      });
      if (sceneGraph.Camera) {
        _this.camera.position.copy(sceneGraph.Camera.position);
        _this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
      }
      return sceneGraph;
    };

    put(light(0xffffff, 1.5, 50)).on(_this.scene).at(0, 10, 10);

    var currentTimerObject = null;
    _this.timer = 0;
    var RAF = function RAF(callback) {
      currentTimerObject = _this.input.VR.currentDevice || window;
      if (_this.timer !== null) {
        _this.timer = currentTimerObject.requestAnimationFrame(callback);
      }
    };

    //
    // Manage full-screen state
    //
    _this.goFullScreen = function (index, evt) {
      if (evt !== "Gaze") {
        _this.input.VR.connect(index);
        _this.input.VR.requestPresent([{
          source: _this.renderer.domElement
        }]).catch(function (exp) {
          return console.error("whaaat", exp);
        }).then(function () {
          return _this.renderer.domElement.focus();
        });
      }
    };

    var addAvatar = function addAvatar(user) {
      _this.scene.add(user.stage);
      _this.scene.add(user.head);
    };

    var removeAvatar = function removeAvatar(user) {
      _this.scene.remove(user.stage);
      _this.scene.remove(user.head);
    };

    var showHideButtons = function showHideButtons() {
      var hide = _this.input.VR.isPresenting,
          elem = _this.renderer.domElement.nextElementSibling;
      while (elem) {
        if (hide) {
          elem.dataset.originaldisplay = elem.style.display;
          elem.style.display = "none";
        } else {
          elem.style.display = elem.dataset.originaldisplay;
        }
        elem = elem.nextElementSibling;
      }
    };

    var fixPointerLock = function fixPointerLock() {
      if (_this.input.VR.isPresenting && !PointerLock.isActive) {
        PointerLock.request(_this.input.VR.currentCanvas);
      }
    };

    window.addEventListener("keydown", function (evt) {
      if (_this.input.VR.isPresenting) {
        if (evt.keyCode === Primrose.Keys.ESCAPE && !_this.input.VR.isPolyfilled) {
          _this.input.VR.cancel();
        } else {
          fixPointerLock();
        }
      }
    });

    PointerLock.addChangeListener(function (evt) {
      if (_this.input.VR.isPresenting && !PointerLock.isActive) {
        _this.input.VR.cancel();
      }
    });

    window.addEventListener("mousedown", fixPointerLock);

    window.addEventListener("vrdisplaypresentchange", function (evt) {
      if (!_this.input.VR.isPresenting) {
        _this.input.VR.cancel();
      }
      showHideButtons();
      modifyScreen();
    });
    window.addEventListener("resize", modifyScreen, false);
    window.addEventListener("blur", _this.stop, false);
    window.addEventListener("focus", _this.start, false);

    _this.projector.addEventListener("hit", handleHit, false);

    documentReady = documentReady.then(function () {
      if (_this.options.renderer) {
        _this.renderer = _this.options.renderer;
      } else {
        _this.renderer = new THREE.WebGLRenderer({
          canvas: Primrose.DOM.cascadeElement(_this.options.canvasElement, "canvas", HTMLCanvasElement),
          context: _this.options.context,
          antialias: _this.options.antialias,
          alpha: true,
          logarithmicDepthBuffer: false
        });
        _this.renderer.autoClear = false;
        _this.renderer.sortObjects = true;
        _this.renderer.setClearColor(_this.options.backgroundColor);
        if (!_this.renderer.domElement.parentElement) {
          document.body.appendChild(_this.renderer.domElement);
        }
      }

      _this.renderer.domElement.addEventListener('webglcontextlost', _this.stop, false);
      _this.renderer.domElement.addEventListener('webglcontextrestored', _this.start, false);

      _this.input = new Primrose.Input.FPSInput(_this.renderer.domElement, _this.options);
      _this.input.addEventListener("zero", _this.zero, false);
      window.addEventListener("paste", _this.input.Keyboard.withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", _this.input.Keyboard.withCurrentControl("readWheel"), false);

      _this.input.Keyboard.operatingSystem = _this.options.os;
      _this.input.Keyboard.codePage = _this.options.language;

      _this.input.head.add(_this.camera);

      _this.network = new Primrose.Network.Manager(_this.input, _this.audio, factories, _this.options);
      _this.network.addEventListener("addavatar", addAvatar);
      _this.network.addEventListener("removeavatar", removeAvatar);

      return _this.input.ready;
    });

    var frameCount = 0,
        frameTime = 0,
        NUM_FRAMES = 10,
        LEAD_TIME = 2000,
        lastQualityChange = 0,
        dq1 = 0,
        dq2 = 0;

    var checkQuality = function checkQuality() {
      if (_this.options.autoScaleQuality &&
      // don't check quality if we've already hit the bottom of the barrel.
      _this.quality !== Quality.NONE) {
        if (frameTime < lastQualityChange + LEAD_TIME) {
          // wait a few seconds before testing quality
          frameTime = performance.now();
        } else {
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
            } else if (
            // don't upgrade on mobile devices
            !isMobile &&
            // don't upgrade if the user says not to
            _this.options.autoRescaleQuality &&
            //good speed
            fps >= 60 &&
            // still room to grow
            _this.quality < Quality.MAXIMUM &&
            // and the last change wasn't a downgrade
            dq2 !== -1) {
              dq1 = 1;
            } else {
              dq1 = 0;
            }
            if (dq1 !== 0) {
              _this.quality += dq1;
            }
            lastQualityChange = now;
          }
        }
      }
    };

    var allReady = Promise.all([modelsReady, audioReady, documentReady]).then(function () {
      _this.renderer.domElement.style.cursor = "default";
      _this.input.VR.displays[0].DOMElement = _this.renderer.domElement;
      _this.input.VR.connect(0);
      _this.emit("ready");
    });

    _this.start = function () {
      allReady.then(function () {
        _this.audio.start();
        lt = performance.now() * MILLISECONDS_TO_SECONDS;
        RAF(animate);
      });
    };

    _this.stop = function () {
      if (currentTimerObject) {
        currentTimerObject.cancelAnimationFrame(_this.timer);
        _this.audio.stop();
        _this.timer = null;
      }
    };

    Object.defineProperties(_this, {
      quality: {
        get: function get() {
          return _this.options.quality;
        },
        set: function set(v) {
          if (0 <= v && v < PIXEL_SCALES.length) {
            _this.options.quality = v;
            resolutionScale = PIXEL_SCALES[v];
            if ("WebVRConfig" in window) {
              WebVRConfig.BUFFER_SCALE = resolutionScale;
            }
          }
          allReady.then(modifyScreen);
        }
      }
    });

    _this.quality = _this.options.quality;

    if (window.alert.toString().indexOf("native code") > -1) {
      // overwrite the native alert functions so they can't be called while in
      // fullscreen VR mode.

      var rerouteDialog = function rerouteDialog(oldFunction, newFunction) {
        if (!newFunction) {
          newFunction = function newFunction() {};
        }
        return function () {
          if (_this.input.VR.isPresenting) {
            newFunction();
          } else {
            oldFunction.apply(window, _arguments);
          }
        };
      };

      window.alert = rerouteDialog(window.alert);
      window.confirm = rerouteDialog(window.confirm);
      window.prompt = rerouteDialog(window.prompt);
    }

    _this.start();
    return _this;
  }

  _createClass(BrowserEnvironment, [{
    key: "connect",
    value: function connect(socket, userName) {
      return this.network && this.network.connect(socket, userName);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      return this.network && this.network.disconnect();
    }
  }, {
    key: "displays",
    get: function get() {
      return this.input.VR.displays;
    }
  }]);

  return BrowserEnvironment;
}(Primrose.AbstractEventEmitter);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Ccm93c2VyRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUFFQSxJQUFJLDBCQUEwQixLQUE5Qjs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsVUFERTtBQUVSLFFBQU0sb0JBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7SUFLTSxrQjs7O0FBQ0osOEJBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUFBOztBQUVuQixVQUFLLE9BQUwsR0FBZSxNQUFNLE9BQU4sRUFBZSxtQkFBbUIsUUFBbEMsQ0FBZjtBQUNBLFVBQUssT0FBTCxDQUFhLGVBQWIsR0FBK0IsTUFBSyxPQUFMLENBQWEsZUFBYixJQUFnQyxnQkFBZ0IsSUFBSSxNQUFNLEtBQVYsQ0FBZ0IsTUFBSyxPQUFMLENBQWEsZUFBN0IsQ0FBaEIsRUFDNUQsTUFENEQsRUFBL0Q7O0FBR0EsVUFBSyxJQUFMLEdBQVksWUFBTTtBQUNoQixVQUFJLENBQUMsTUFBSyxLQUFMLENBQVcsWUFBaEIsRUFBOEI7QUFDNUIsY0FBSyxLQUFMLENBQVcsSUFBWDtBQUNBLFlBQUksTUFBSyxPQUFMLEtBQWlCLFFBQVEsSUFBN0IsRUFBbUM7QUFDakMsZ0JBQUssT0FBTCxHQUFlLFFBQVEsSUFBdkI7QUFDRDtBQUNGO0FBQ0YsS0FQRDs7QUFVQSxRQUFJLHVCQUF1QixTQUF2QixvQkFBdUIsQ0FBQyxHQUFELEVBQU0sZUFBTixFQUEwQjtBQUNuRCxVQUFJLFVBQVUsR0FBZDtBQUNBLFVBQUksQ0FBQyxJQUFJLElBQUosS0FBYSxVQUFiLElBQTJCLElBQUksSUFBSixLQUFhLE9BQXpDLEtBQXFELElBQUksUUFBSixDQUFhLENBQWIsQ0FBekQsRUFBMEU7QUFDeEUsa0JBQVUsSUFBSSxRQUFKLENBQWEsQ0FBYixDQUFWO0FBQ0EsZ0JBQVEsSUFBUixHQUFlLFFBQVEsSUFBUixJQUFnQixJQUFJLElBQW5DO0FBQ0Q7QUFDRCxVQUFJLEtB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QSxVQUFLLE9BQUwsR0FBZSxNQUFLLE9BQUwsQ0FBYSxPQUE1Qjs7QUFFQSxRQUFJLE9BQU8sS0FBUCxDQUFhLFFBQWIsR0FDRCxPQURDLENBQ08sYUFEUCxJQUN3QixDQUFDLENBRDdCLEVBQ2dDO0FBQzlCO0FBQ0E7O0FBRUEsVUFBSSxnQkFBZ0IsU0FBaEIsYUFBZ0IsQ0FBQyxXQUFELEVBQWMsV0FBZCxFQUE4QjtBQUNoRCxZQUFJLENBQUMsV0FBTCxFQUFrQjtBQUNoQix3QkFBYyx1QkFBWSxDQUFFLENBQTVCO0FBQ0Q7QUFDRCxlQUFPLFlBQU07QUFDWCxjQUFJLE1BQUssS0FBTCxDQUFXLEVBQVgsQ0FBYyxZQUFsQixFQUFnQztBQUM5QjtBQUNELFdBRkQsTUFHSztBQUNILHdCQUFZLEtBQVosQ0FBa0IsTUFBbEI7QUFDRDtBQUNGLFNBUEQ7QUFRRCxPQVpEOztBQWNBLGFBQU8sS0FBUCxHQUFlLGNBQWMsT0FBTyxLQUFyQixDQUFmO0FBQ0EsYUFBTyxPQUFQLEdBQWlCLGNBQWMsT0FBTyxPQUFyQixDQUFqQjtBQUNBLGFBQU8sTUFBUCxHQUFnQixjQUFjLE9BQU8sTUFBckIsQ0FBaEI7QUFDRDs7QUFFRCxVQUFLLEtBQUw7QUE3eEJtQjtBQTh4QnBCOzs7OzRCQUVPLE0sRUFBUSxRLEVBQVU7QUFDeEIsYUFBTyxLQUFLLE9BQUwsSUFBZ0IsS0FBSyxPQUFMLENBQWEsT0FBYixDQUFxQixNQUFyQixFQUE2QixRQUE3QixDQUF2QjtBQUNEOzs7aUNBRVk7QUFDWCxhQUFPLEtBQUssT0FBTCxJQUFnQixLQUFLLE9BQUwsQ0FBYSxVQUFiLEVBQXZCO0FBQ0Q7Ozt3QkFFYztBQUNiLGFBQU8sS0FBSyxLQUFMLENBQVcsRUFBWCxDQUFjLFFBQXJCO0FBQ0Q7Ozs7RUEzeUI4QixTQUFTLG9COztBQTh5QjFDLG1CQUFtQixRQUFuQixHQUE4QjtBQUM1QixhQUFXLElBRGlCO0FBRTVCLG9CQUFrQixJQUZVO0FBRzVCLHNCQUFvQixLQUhRO0FBSTVCLFdBQVMsUUFBUSxPQUpXO0FBSzVCLFdBQVMsS0FMbUI7QUFNNUIsVUFBUSxLQU5vQjtBQU81QixnQkFBYyxJQVBjO0FBUTVCLGFBQVcsQ0FSaUI7QUFTNUI7QUFDQSxXQUFTLEdBVm1CO0FBVzVCO0FBQ0EsY0FBWSxDQVpnQjtBQWE1QjtBQUNBLG9CQUFrQixLQWRVO0FBZTVCO0FBQ0EsMEJBQXdCLEtBaEJJO0FBaUI1QjtBQUNBLG1CQUFpQixRQWxCVztBQW1CNUI7QUFDQSxhQUFXLElBcEJpQjtBQXFCNUI7QUFDQSxnQkFBYyxHQXRCYztBQXVCNUI7QUFDQSxjQUFZLEVBeEJnQjtBQXlCNUI7QUFDQSxnQkFBYyxJQTFCYztBQTJCNUI7QUFDQSxpQkFBZSxhQTVCYTtBQTZCNUI7QUFDQSxZQUFVLElBOUJrQjtBQStCNUI7QUFDQSxXQUFTLElBaENtQjtBQWlDNUI7QUFDQSxTQUFPO0FBbENxQixDQUE5QiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvQnJvd3NlckVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.BrowserEnvironment = BrowserEnvironment;
})();
(function(){
"use strict";

var buttonCount = 0;

function ButtonFactory(templateFile, options) {
  this.options = options;
  this.template = templateFile;
}

ButtonFactory.prototype.create = function (toggle) {
  var name = "button" + ++buttonCount;
  var obj = this.template.clone();
  var btn = new Primrose.Controls.Button3D(obj, name, this.options, toggle);
  return btn;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9CdXR0b25GYWN0b3J5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUksY0FBYyxDQUFsQjs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsVUFERTtBQUVSLFFBQU0sZUFGRTtBQUdSLGVBQWEsc0dBSEw7QUFJUixjQUFZLENBQUM7QUFDWCxVQUFNLFVBREs7QUFFWCxVQUFNLGdCQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLFNBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsRUFRVDtBQUNELFVBQU0sVUFETDtBQUVELFVBQU0sVUFGTDtBQUdELGlCQUFhO0FBSFosR0FSUztBQUpKLENBQVo7O0FBbUJBLFNBQVMsYUFBVCxDQUF1QixZQUF2QixFQUFxQyxPQUFyQyxFQUE4QztBQUM1QyxRQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQU0sU0FETztBQUViLFVBQU0sUUFGTztBQUdiLGlCQUFhO0FBSEEsR0FBZjtBQUtBLE9BQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxRQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQU0sVUFETztBQUViLFVBQU0sZ0JBRk87QUFHYixpQkFBYTtBQUhBLEdBQWY7QUFLQSxPQUFLLFFBQUwsR0FBZ0IsWUFBaEI7QUFDRDs7QUFFRCxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsd0JBREc7QUFFWCxRQUFNLFFBRks7QUFHWCxlQUFhLG9NQUhGO0FBSVgsY0FBWSxDQUFDO0FBQ1gsVUFBTSxRQURLO0FBRVgsVUFBTSxTQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELENBSkQ7QUFTWCxVQUFRO0FBVEcsQ0FBYjtBQVdBLGNBQWMsU0FBZCxDQUF3QixNQUF4QixHQUFpQyxVQUFVLE1BQVYsRUFBa0I7QUFDakQsTUFBSSxPQUFPLFdBQVksRUFBRSxXQUF6QjtBQUNBLE1BQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxLQUFkLEVBQVY7QUFDQSxNQUFJLE1BQU0sSUFBSSxTQUFTLFFBQVQsQ0FBa0IsUUFBdEIsQ0FBK0IsR0FBL0IsRUFBb0MsSUFBcEMsRUFBMEMsS0FBSyxPQUEvQyxFQUF3RCxNQUF4RCxDQUFWO0FBQ0EsU0FBTyxHQUFQO0FBQ0QsQ0FMRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvQnV0dG9uRmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.ButtonFactory = ButtonFactory;
})();
(function(){
"use strict";

var Controls = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxRQUFNLFVBRFE7QUFFZCxVQUFRLFVBRk07QUFHZCxlQUFhO0FBSEMsQ0FBaEI7QUFLQSxJQUFNLFdBQVcsRUFBakIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0NvbnRyb2xzLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Controls = Controls;
})();
(function(){
"use strict";

var DOM = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9ET00uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxTQUFOLENBQWdCO0FBQ2QsVUFBUSxVQURNO0FBRWQsUUFBTSxLQUZRO0FBR2QsZUFBYTtBQUhDLENBQWhCO0FBS0EsSUFBTSxNQUFNLEVBQVoiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0RPTS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.DOM = DOM;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entityKeys = [],
    entities = new WeakMap();

var Entity = function () {
  _createClass(Entity, null, [{
    key: "registerEntity",
    value: function registerEntity(e) {
      entities.set(e.id, e);
      entityKeys.push(e.id);
      e.addEventListener("_idchanged", function (evt) {
        entityKeys.splice(entityKeys.indexOf(evt.oldID), 1);
        entities.delete(evt.oldID);
        entities.set(evt.entity.id, evt.entity);
        entityKeys.push(evt.entity.id);
      }, false);
    }
  }, {
    key: "eyeBlankAll",
    value: function eyeBlankAll(eye) {
      entityKeys.forEach(function (id) {
        entities.get(id).eyeBlank(eye);
      });
    }
  }]);

  function Entity(id) {
    _classCallCheck(this, Entity);

    this.id = id;

    this.parent = null;

    this.children = [];

    this.focused = false;

    this.focusable = true;

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

    }

  _createClass(Entity, [{
    key: "addEventListener",
    value: function addEventListener(event, func) {
      if (this.listeners[event]) {
        this.listeners[event].push(func);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(event, func) {
      var evts = this.listeners[event];
      if (evt) {
        var i = evts.indexOf(func);
        if (0 <= i && i < evts.length) {
          evts.splice(i, 1);
        }
      }
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.focusable) {
        this.focused = true;
        emit.call(this, "focus", {
          target: this
        });
      }
    }
  }, {
    key: "blur",
    value: function blur() {
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
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      if (child && !child.parent) {
        child.parent = this;
        this.children.push(child);
      }
    }
  }, {
    key: "removeChild",
    value: function removeChild(child) {
      var i = this.children.indexOf(child);
      if (0 <= i && i < this.children.length) {
        this.children.splice(i, 1);
        child.parent = null;
      }
    }
  }, {
    key: "eyeBlank",
    value: function eyeBlank(eye) {
      for (var i = 0; i < this.children.length; ++i) {
        this.children[i].eyeBlank(eye);
      }
    }
  }, {
    key: "_forFocusedChild",
    value: function _forFocusedChild(name, evt) {
      var elem = this.focusedElement;
      if (elem && elem !== this) {
        elem[name](evt);
      }
    }
  }, {
    key: "startDOMPointer",
    value: function startDOMPointer(evt) {
      for (var i = 0; i < this.children.length; ++i) {
        this.children[i].startDOMPointer(evt);
      }
    }
  }, {
    key: "moveDOMPointer",
    value: function moveDOMPointer(evt) {
      this._forFocusedChild("moveDOMPointer", evt);
    }
  }, {
    key: "startUV",
    value: function startUV(evt) {
      this._forFocusedChild("startUV", evt);
    }
  }, {
    key: "moveUV",
    value: function moveUV(evt) {
      this._forFocusedChild("moveUV", evt);
    }
  }, {
    key: "endPointer",
    value: function endPointer() {
      this._forFocusedChild("endPointer");
    }
  }, {
    key: "keyDown",
    value: function keyDown(evt) {
      this._forFocusedChild("keyDown", evt);
    }
  }, {
    key: "keyUp",
    value: function keyUp(evt) {
      this._forFocusedChild("keyUp", evt);
    }
  }, {
    key: "readClipboard",
    value: function readClipboard(evt) {
      this._forFocusedChild("readClipboard", evt);
    }
  }, {
    key: "copySelectedText",
    value: function copySelectedText(evt) {
      this._forFocusedChild("copySelectedText", evt);
    }
  }, {
    key: "cutSelectedText",
    value: function cutSelectedText(evt) {
      this._forFocusedChild("cutSelectedText", evt);
    }
  }, {
    key: "readWheel",
    value: function readWheel(evt) {
      this._forFocusedChild("readWheel", evt);
    }
  }, {
    key: "id",
    get: function get() {
      return this._id;
    },
    set: function set(v) {
      var oldID = this._id;
      this._id = new String(v);
      emit.call(this, "_idchanged", {
        oldID: oldID,
        entity: this
      });
    }
  }, {
    key: "theme",
    get: function get() {
      return null;
    },
    set: function set(v) {
      for (var i = 0; i < this.children.length; ++i) {
        this.children[i].theme = v;
      }
    }
  }, {
    key: "lockMovement",
    get: function get() {
      var lock = false;
      for (var i = 0; i < this.children.length && !lock; ++i) {
        lock |= this.children[i].lockMovement;
      }
      return lock;
    }
  }, {
    key: "focusedElement",
    get: function get() {
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
  }]);

  return Entity;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9FbnRpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQUksYUFBYSxFQUFqQjtBQUFBLElBQ0UsV0FBVyxJQUFJLE9BQUosRUFEYjs7QUFHQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsVUFERTtBQUVSLFFBQU0sUUFGRTtBQUdSLGVBQWE7QUFITCxDQUFaOztJQUtNLE07OzttQ0FFa0IsQyxFQUFHO0FBQ3ZCLFlBQU0sUUFBTixDQUFlO0FBQ2IsZ0JBQVEsaUJBREs7QUFFYixjQUFNLGdCQUZPO0FBR2IscUJBQWEsMkRBSEE7QUFJYixvQkFBWSxDQUFDO0FBQ1gsZ0JBQU0sR0FESztBQUVYLGdCQUFNLGlCQUZLO0FBR1gsdUJBQWE7QUFIRixTQUFEO0FBSkMsT0FBZjtBQVVBLGVBQVMsR0FBVCxDQUFhLEVBQUUsRUFBZixFQUFtQixDQUFuQjtBQUNBLGlCQUFXLElBQVgsQ0FBZ0IsRUFBRSxFQUFsQjtBQUNBLFFBQUUsZ0JBQUYsQ0FBbUIsWUFBbkIsRUFBaUMsVUFBQyxHQUFELEVBQVM7QUFDeEMsbUJBQVcsTUFBWCxDQUFrQixXQUFXLE9BQVgsQ0FBbUIsSUFBSSxLQUF2QixDQUFsQixFQUFpRCxDQUFqRDtBQUNBLGlCQUFTLE1BQVQsQ0FBZ0IsSUFBSSxLQUFwQjtBQUNBLGlCQUFTLEdBQVQsQ0FBYSxJQUFJLE1BQUosQ0FBVyxFQUF4QixFQUE0QixJQUFJLE1BQWhDO0FBQ0EsbUJBQVcsSUFBWCxDQUFnQixJQUFJLE1BQUosQ0FBVyxFQUEzQjtBQUNELE9BTEQsRUFLRyxLQUxIO0FBTUQ7OztnQ0FFa0IsRyxFQUFLO0FBQ3RCLFlBQU0sUUFBTixDQUFlO0FBQ2IsZ0JBQVEsaUJBREs7QUFFYixjQUFNLGFBRk87QUFHYixxQkFBYSx5REFIQTtBQUliLG9CQUFZLENBQUM7QUFDWCxnQkFBTSxLQURLO0FBRVgsZ0JBQU0sUUFGSztBQUdYLHVCQUFhO0FBSEYsU0FBRDtBQUpDLE9BQWY7QUFV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

if(typeof window !== "undefined") window.Primrose.Entity = Entity;
})();
(function(){
"use strict";

var HTTP = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsVUFETTtBQUVkLFFBQU0sTUFGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sT0FBTyxFQUFiIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9IVFRQLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.HTTP = HTTP;
})();
(function(){
"use strict";

var Input = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxVQUFRLFVBRE07QUFFZCxRQUFNLE9BRlE7QUFHZCxlQUFhO0FBSEMsQ0FBaEI7QUFLQSxJQUFNLFFBQVEsRUFBZCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSW5wdXQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Input = Input;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"],
    TELEPORT_PAD_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    LASER_WIDTH = 0.01,
    LASER_LENGTH = 3 * LASER_WIDTH,
    moveTo = new THREE.Vector3(0, 0, 0);

var InputProcessor = function () {
  _createClass(InputProcessor, null, [{
    key: "defineAxisProperties",
    value: function defineAxisProperties(classFunc, values) {
      classFunc.AXES = values;
      values.forEach(function (name, i) {
        classFunc[name] = i + 1;
        Object.defineProperty(classFunc.prototype, name, {
          get: function get() {
            return this.getAxis(name);
          },
          set: function set(v) {
            this.setAxis(name, v);
          }
        });
      });
    }
  }]);

  function InputProcessor(name, parent, commands, socket, axisNames) {
    var _this = this;

    _classCallCheck(this, InputProcessor);

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
    };

    var readMetaKeys = function readMetaKeys(event) {
      for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        _this.inputState[m] = event[m + "Key"];
      }
    };

    window.addEventListener("keydown", readMetaKeys, false);
    window.addEventListener("keyup", readMetaKeys, false);

    if (socket) {
      socket.on("open", function () {
        _this.socketReady = true;
        _this.inPhysicalUse = !_this.receiving;
      });
      socket.on(name, function (cmdState) {
        if (_this.receiving) {
          _this.inPhysicalUse = false;
          _this.decodeStateSnapshot(cmdState);
          _this.fireCommands();
        }
      });
      socket.on("close", function () {
        _this.inPhysicalUse = true;
        _this.socketReady = false;
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

  _createClass(InputProcessor, [{
    key: "addCommand",
    value: function addCommand(name, cmd) {
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
  }, {
    key: "addEventListener",
    value: function addEventListener(evt, thunk, bubbles) {
      if (this.listeners[evt]) {
        this.listeners[evt].push(thunk);
      }
    }
  }, {
    key: "cloneCommand",
    value: function cloneCommand(cmd) {
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
        metaKeys: this.maybeClone(cmd.metaKeys && cmd.metaKeys.map(function (k) {
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
  }, {
    key: "maybeClone",
    value: function maybeClone(arr) {
      var output = [];
      if (arr) {
        for (var i = 0; i < arr.length; ++i) {
          output[i] = {
            index: Math.abs(arr[i]) - 1,
            toggle: arr[i] < 0,
            sign: arr[i] < 0 ? -1 : 1
          };
        }
      }
      return output;
    }
  }, {
    key: "update",
    value: function update(dt) {
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
                  metaKeysSet = metaKeysSet && (this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && !m.toggle || !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && m.toggle);
                }
              }

              if (metaKeysSet) {
                var pressed = true,
                    value = 0,
                    n,
                    temp,
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
                        p = code === Primrose.Keys.ANY && anyButtons || !!this.inputState.buttons[code];
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
                } else if (cmd.delta) {
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
                  pressed = pressed && value > cmd.threshold;
                }

                cmd.state.pressed = pressed;
                cmd.state.value = value;
              }

              cmd.state.lt += dt;

              cmd.state.fireAgain = cmd.state.pressed && cmd.state.lt >= cmd.dt && (cmd.repetitions === -1 || cmd.state.repeatCount < cmd.repetitions);

              if (cmd.state.fireAgain) {
                cmd.state.lt = 0;
                ++cmd.state.repeatCount;
              } else if (!cmd.state.pressed) {
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
  }, {
    key: "zero",
    value: function zero() {
      for (var i = 0; this.enabled && i < SETTINGS_TO_ZERO.length; ++i) {
        this.setValue(SETTINGS_TO_ZERO[i], 0);
      }
    }
  }, {
    key: "fireCommands",
    value: function fireCommands() {
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
  }, {
    key: "makeStateSnapshot",
    value: function makeStateSnapshot() {
      var state = "",
          i = 0,
          l = Object.keys(this.commands).length;
      for (var name in this.commands) {
        var cmd = this.commands[name];
        if (cmd.state) {
          state += i << 2 | (cmd.state.pressed ? 0x1 : 0) | (cmd.state.fireAgain ? 0x2 : 0) + ":" + cmd.state.value;
          if (i < l - 1) {
            state += "|";
          }
        }
        ++i;
      }
      return state;
    }
  }, {
    key: "decodeStateSnapshot",
    value: function decodeStateSnapshot(snapshot) {
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
  }, {
    key: "setProperty",
    value: function setProperty(key, name, value) {
      if (this.commands[name]) {
        this.commands[name][key] = value;
      }
    }
  }, {
    key: "setDeadzone",
    value: function setDeadzone(name, value) {
      this.setProperty("deadzone", name, value);
    }
  }, {
    key: "setScale",
    value: function setScale(name, value) {
      this.setProperty("scale", name, value);
    }
  }, {
    key: "setDT",
    value: function setDT(name, value) {
      this.setProperty("dt", name, value);
    }
  }, {
    key: "setMin",
    value: function setMin(name, value) {
      this.setProperty("min", name, value);
    }
  }, {
    key: "setMax",
    value: function setMax(name, value) {
      this.setProperty("max", name, value);
    }
  }, {
    key: "addToArray",
    value: function addToArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        this.commands[name][key].push(value);
      }
    }
  }, {
    key: "addMetaKey",
    value: function addMetaKey(name, value) {
      this.addToArray("metaKeys", name, value);
    }
  }, {
    key: "addAxis",
    value: function addAxis(name, value) {
      this.addToArray("axes", name, value);
    }
  }, {
    key: "addButton",
    value: function addButton(name, value) {
      this.addToArray("buttons", name, value);
    }
  }, {
    key: "removeMetaKey",
    value: function removeMetaKey(name, value) {
      this.removeFromArray("metaKeys", name, value);
    }
  }, {
    key: "removeAxis",
    value: function removeAxis(name, value) {
      this.removeFromArray("axes", name, value);
    }
  }, {
    key: "removeButton",
    value: function removeButton(name, value) {
      this.removeFromArray("buttons", name, value);
    }
  }, {
    key: "invertAxis",
    value: function invertAxis(name, value) {
      this.invertInArray("axes", name, value);
    }
  }, {
    key: "invertButton",
    value: function invertButton(name, value) {
      this.invertInArray("buttons", name, value);
    }
  }, {
    key: "invertMetaKey",
    value: function invertMetaKey(name, value) {
      this.invertInArray("metaKeys", name, value);
    }
  }, {
    key: "removeFromArray",
    value: function removeFromArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        var arr = this.commands[name][key],
            n = arr.indexOf(value);
        if (n > -1) {
          arr.splice(n, 1);
        }
      }
    }
  }, {
    key: "invertInArray",
    value: function invertInArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        var arr = this.commands[name][key],
            n = arr.indexOf(value);
        if (n > -1) {
          arr[n] *= -1;
        }
      }
    }
  }, {
    key: "pause",
    value: function pause(v) {
      this.paused = v;
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.paused;
    }
  }, {
    key: "enable",
    value: function enable(k, v) {
      if (v === undefined || v === null) {
        v = k;
        k = null;
      }

      if (k) {
        this.setProperty("disabled", k, !v);
      } else {
        this.enabled = v;
      }
    }
  }, {
    key: "isEnabled",
    value: function isEnabled(name) {
      return name && this.commands[name] && !this.commands[name].disabled;
    }
  }, {
    key: "transmit",
    value: function transmit(v) {
      this.transmitting = v;
    }
  }, {
    key: "isTransmitting",
    value: function isTransmitting() {
      return this.transmitting;
    }
  }, {
    key: "receive",
    value: function receive(v) {
      this.receiving = v;
    }
  }, {
    key: "isReceiving",
    value: function isReceiving() {
      return this.receiving;
    }
  }, {
    key: "getAxis",
    value: function getAxis(name) {
      var i = this.axisNames.indexOf(name);
      if (i > -1) {
        var value = this.inputState.axes[i] || 0;
        return value;
      }
      return null;
    }
  }, {
    key: "setAxis",
    value: function setAxis(name, value) {
      var i = this.axisNames.indexOf(name);
      if (i > -1) {
        this.inPhysicalUse = true;
        this.inputState.axes[i] = value;
      }
    }
  }, {
    key: "setButton",
    value: function setButton(index, pressed) {
      this.inPhysicalUse = true;
      this.inputState.buttons[index] = pressed;
    }
  }, {
    key: "getValue",
    value: function getValue(name) {
      return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.value || this.getAxis(name) || 0;
    }
  }, {
    key: "setValue",
    value: function setValue(name, value) {
      var j = this.axisNames.indexOf(name);
      if (!this.commands[name] && j > -1) {
        this.setAxis(name, value);
      } else if (this.commands[name] && !this.commands[name].disabled) {
        this.commands[name].state.value = value;
      }
    }
  }, {
    key: "isDown",
    value: function isDown(name) {
      return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }, {
    key: "isUp",
    value: function isUp(name) {
      return (this.enabled || this.receiving && this.socketReady) && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }]);

  return InputProcessor;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dFByb2Nlc3Nvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBTSxtQkFBbUIsQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixjQUE3QixFQUE2QyxPQUE3QyxFQUFzRCxPQUF0RCxFQUErRCxPQUEvRCxDQUF6QjtBQUFBLElBQ0Usc0JBQXNCLEdBRHhCO0FBQUEsSUFFRSxVQUFVLElBQUksTUFBTSxPQUFWLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQUMsQ0FBekIsQ0FGWjtBQUFBLElBR0Usc0JBQXNCLENBSHhCO0FBQUEsSUFJRSx5QkFBeUIsc0JBQXNCLG1CQUpqRDtBQUFBLElBS0Usb0JBQW9CLENBTHRCO0FBQUEsSUFNRSx1QkFBdUIsb0JBQW9CLGlCQU43QztBQUFBLElBT0UsY0FBYyxJQVBoQjtBQUFBLElBUUUsZUFBZSxJQUFJLFdBUnJCO0FBQUEsSUFTRSxTQUFTLElBQUksTUFBTSxPQUFWLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBVFg7O0FBV0EsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFUixRQUFNLGdCQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0lBS00sYzs7O3lDQUV3QixTLEVBQVcsTSxFQUFRO0FBQzdDLGdCQUFVLElBQVYsR0FBaUIsTUFBakI7QUFDQSxhQUFPLE9BQVAsQ0FBZSxVQUFVLElBQVYsRUFBZ0IsQ0FBaEIsRUFBbUI7QUFDaEMsa0JBQVUsSUFBVixJQUFrQixJQUFJLENBQXRCO0FBQ0EsZUFBTyxjQUFQLENBQXNCLFVBQVUsU0FBaEMsRUFBMkMsSUFBM0MsRUFBaUQ7QUFDL0MsZUFBSyxlQUFZO0FBQ2YsbUJBQU8sS0FBSyxPQUFMLENBQWEsSUFBYixDQUFQO0FBQ0QsV0FIOEM7QUFJL0MsZUFBSyxhQUFVLENBQVYsRUFBYTtBQUNoQixpQkFBSyxPQUFMLENBQWEsSUFBYixF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TyxJQUFQO0FBQ0Q7Ozs0QkFFTyxJLEVBQU0sSyxFQUFPO0FBQ25CLFVBQUksSUFBSSxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLElBQXZCLENBQVI7QUFDQSxVQUFJLElBQUksQ0FBQyxDQUFULEVBQVk7QUFDVixhQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxhQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBckIsSUFBMEIsS0FBMUI7QUFDRDtBQUNGOzs7OEJBRVMsSyxFQUFPLE8sRUFBUztBQUN4QixXQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsS0FBeEIsSUFBaUMsT0FBakM7QUFDRDs7OzZCQUVRLEksRUFBTTtBQUNiLGFBQVEsQ0FBQyxLQUFLLE9BQUwsSUFBaUIsS0FBSyxTQUFMLElBQWtCLEtBQUssV0FBekMsS0FDSixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBREksSUFFSixLQUFLLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLEtBQXBCLENBQTBCLEtBRnZCLElBR0wsS0FBSyxPQUFMLENBQWEsSUFBYixDQUhLLElBR2lCLENBSHhCO0FBSUQ7Ozs2QkFFUSxJLEVBQU0sSyxFQUFPO0FBQ3BCLFVBQUksSUFBSSxLQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLElBQXZCLENBQVI7QUFDQSxVQUFJLENBQUMsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFELElBQXdCLElBQUksQ0FBQyxDQUFqQyxFQUFvQztBQUNsQyxhQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLEtBQW5CO0FBQ0QsT0FGRCxNQUdLLElBQUksS0FBSyxRQUFMLENBQWMsSUFBZCxLQUF1QixDQUFDLEtBQUssUUFBTCxDQUFjLElBQWQsRUFBb0IsUUFBaEQsRUFBMEQ7QUFDN0QsYUFBSyxRQUFMLENBQWMsSUFBZCxFQUFvQixLQUFwQixDQUEwQixLQUExQixHQUFrQyxLQUFsQztBQUNEO0FBQ0Y7OzsyQkFFTSxJLEVBQU07QUFDWCxhQUFPLENBQUMsS0FBSyxPQUFMLElBQWlCLEtBQUssU0FBTCxJQUFrQixLQUFLLFdBQXpDLEtBQ0wsS0FBSyxTQUFMLENBQWUsSUFBZixDQURLLElBRUwsS0FBSyxRQUFMLENBQWMsSUFBZCxFQUFvQixLQUFwQixDQUEwQixPQUY1QjtBQUdEOzs7eUJBRUksSSxFQUFNO0FBQ1QsYUFBTyxDQUFDLEtBQUssT0FBTCxJQUFpQixLQUFLLFNBQUwsSUFBa0IsS0FBSyxXQUF6QyxLQUNMLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FESyxJQUVMLEtBQUssUUFBTCxDQUFjLElBQWQsRUFBb0IsS0FBcEIsQ0FBMEIsT0FGNUI7QUFHRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSW5wdXRQcm9jZXNzb3IuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.InputProcessor = InputProcessor;
})();
(function(){
"use strict";

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
  if (Keys.hasOwnProperty(key) && typeof val === "number") {
    Keys[val] = key;
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9LZXlzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sV0FBTixDQUFrQjtBQUNoQixVQUFRLFVBRFE7QUFFaEIsUUFBTSxNQUZVO0FBR2hCLGVBQWE7QUFIRyxDQUFsQjtBQUtBLElBQUksT0FBTztBQUNULE9BQUssT0FBTyxTQURIO0FBRVQ7QUFDQTtBQUNBO0FBQ0EsaUJBQWUsQ0FBQyxNQUFELEVBQVMsT0FBVCxFQUFrQixLQUFsQixFQUF5QixNQUF6QixFQUFpQyxRQUFqQyxFQUEyQyxRQUEzQyxDQUxOO0FBTVQsU0FBTyxFQU5FO0FBT1QsUUFBTSxFQVBHO0FBUVQsT0FBSyxFQVJJO0FBU1QsUUFBTSxFQVRHO0FBVVQsVUFBUSxFQVZDO0FBV1QsVUFBUSxFQVhDO0FBWVQ7QUFDQTtBQUNBO0FBQ0EsYUFBVyxDQWZGO0FBZ0JULE9BQUssQ0FoQkk7QUFpQlQsU0FBTyxFQWpCRTtBQWtCVCxTQUFPLEVBbEJFO0FBbUJULFVBQVEsRUFuQkM7QUFvQlQ7QUFDQTtBQUNBO0FBQ0EsY0FBWSxFQXZCSDtBQXdCVCxZQUFVLEVBeEJEO0FBeUJULFdBQVMsR0F6QkE7QUEwQlQsY0FBWSxHQTFCSDtBQTJCVCxVQUFRLEVBM0JDO0FBNEJUO0FBQ0E7QUFDQTtBQUNBLFVBQVEsRUEvQkM7QUFnQ1QsVUFBUSxFQWhDQztBQWlDVCxZQUFVLEVBakNEO0FBa0NULE9BQUssRUFsQ0k7QUFtQ1QsUUFBTSxFQW5DRztBQW9DVCxhQUFXLEVBcENGO0FBcUNULFdBQVMsRUFyQ0E7QUFzQ1QsY0FBWSxFQXRDSDtBQXVDVCxhQUFXLEVBdkNGO0FBd0NULGFBQVcsRUF4Q0Y7QUF5Q1Q7QUFDQTtBQUNBO0FBQ0EsV0FBUyxFQTVDQTtBQTZDVCxXQUFTLEVBN0NBO0FBOENULFdBQVMsRUE5Q0E7QUErQ1QsV0FBUyxFQS9DQTtBQWdEVCxXQUFTLEVBaERBO0FBaURULFdBQVMsRUFqREE7QUFrRFQsV0FBUyxFQWxEQTtBQW1EVCxXQUFTLEVBbkRBO0FBb0RULFdBQVMsRUFwREE7QUFxRFQsV0FBUyxFQXJEQTtBQXNEVDtBQUNBO0FBQ0E7QUFDQSxLQUFHLEVBekRNO0FBMERULEtBQUcsRUExRE07QUEyRFQsS0FBRyxFQTNETTtBQTREVCxLQUFHLEVBNURNO0FBNkRULEtBQUcsRUE3RE07QUE4RFQsS0FBRyxFQTlETTtBQStEVCxLQUFHLEVBL0RNO0FBZ0VULEtBQUcsRUFoRU07QUFpRVQsS0FBRyxFQWpFTTtBQWtFVCxLQUFHLEVBbEVNO0FBbUVULEtBQUcsRUFuRU07QUFvRVQsS0FBRyxFQXBFTTtBQXFFVCxLQUFHLEVBckVNO0FBc0VULEtBQUcsRUF0RU07QUF1RVQsS0FBRyxFQXZFTTtBQXdFVCxLQUFHLEVBeEVNO0FBeUVULEtBQUcsRUF6RU07QUEwRVQsS0FBRyxFQTFFTTtBQTJFVCxLQUFHLEVBM0VNO0FBNEVULEtBQUcsRUE1RU07QUE2RVQsS0FBRyxFQTdFTTtBQThFVCxLQUFHLEVBOUVNO0FBK0VULEtBQUcsRUEvRU07QUFnRlQsS0FBRyxFQWhGTTtBQWlGVCxLQUFHLEVBakZNO0FBa0ZULEtBQUcsRUFsRk07QUFtRlQ7QUFDQTtBQUNBO0FBQ0EsV0FBUyxFQXRGQTtBQXVGVCxXQUFTLEVBdkZBO0FBd0ZULFdBQVMsRUF4RkE7QUF5RlQsV0FBUyxFQXpGQTtBQTBGVCxXQUFTLEdBMUZBO0FBMkZULFdBQVMsR0EzRkE7QUE0RlQsV0FBUyxHQTVGQTtBQTZGVCxXQUFTLEdBN0ZBO0FBOEZULFdBQVMsR0E5RkE7QUErRlQsV0FBUyxHQS9GQTtBQWdHVCxZQUFVLEdBaEdEO0FBaUdULE9BQUssR0FqR0k7QUFrR1QsWUFBVSxHQWxHRDtBQW1HVCxnQkFBYyxHQW5HTDtBQW9HVCxVQUFRLEdBcEdDO0FBcUdUO0FBQ0E7QUFDQTtBQUNBLE1BQUksR0F4R0s7QUF5R1QsTUFBSSxHQXpHSztBQTBHVCxNQUFJLEdBMUdLO0FBMkdULE1BQUksR0EzR0s7QUE0R1QsTUFBSSxHQTVHSztBQTZHVCxNQUFJLEdBN0dLO0FBOEdULE1BQUksR0E5R0s7QUErR1QsTUFBSSxHQS9HSztBQWdIVCxNQUFJLEdBaEhLO0FBaUhULE9BQUssR0FqSEk7QUFrSFQsT0FBSyxHQWxISTtBQW1IVCxPQUFLLEdBbkhJO0FBb0hUO0FBQ0E7QUFDQTtBQUNBLGVBQWEsR0F2SEo7QUF3SFQsYUFBVyxHQXhIRjtBQXlIVCxjQUFZLEdBekhIO0FBMEhULGtCQUFnQjtBQTFIUCxDQUFYOztBQTZIQTtBQUNBLEtBQUssSUFBSSxHQUFULElBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLE1BQUksTUFBTSxLQUFLLEdBQUwsQ0FBVjtBQUNBLE1BQUksS0FBSyxjQUFMLENBQW9CLEdBQXBCLEtBQTRCLE9BQVEsR0FBUixLQUFpQixRQUFqRCxFQUEyRDtBQUN6RCxTQUFLLEdBQUwsSUFBWSxHQUFaO0FBQ0Q7QUFDRiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvS2V5cy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Keys = Keys;
})();
(function(){
"use strict";

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
  isButton: function isButton(obj) {
    return obj.material && obj.material.name.match(/^button\d+$/);
  },
  isSolid: function isSolid(obj) {
    return !obj.name.match(/^(water|sky)/);
  },
  isGround: function isGround(obj) {
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

function ModelLoader(template) {
  this.template = template;
}
ModelLoader.loadModel = function (src, type, progress) {
  return ModelLoader.loadObject(src, type, progress).then(function (scene) {
    return new ModelLoader(scene);
  });
};

ModelLoader.prototype.clone = function () {
  var _this = this;

  var obj = this.template.clone();

  obj.traverse(function (child) {
    if (child instanceof THREE.SkinnedMesh) {
      obj.animation = new THREE.Animation(child, child.geometry.animation);
      if (!_this.template.originalAnimationData && obj.animation.data) {
        _this.template.originalAnimationData = obj.animation.data;
      }
      if (!obj.animation.data) {
        obj.animation.data = _this.template.originalAnimationData;
      }
    }
  });

  setProperties(obj);
  return obj;
};

ModelLoader.loadObject = function (src, type, progress) {
  var extMatch = src.match(EXTENSION_PATTERN),
      extension = type && "." + type || extMatch[0];
  if (!extension) {
    return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
  } else {
    extension = extension.toLowerCase();
    var Loader = new loaders[extension]();
    if (!Loader) {
      return Promise.reject("There is no loader type for the file extension: " + extension);
    } else {
      var name = src.substring(0, extMatch.index),
          elemID = name + "_" + extension.toLowerCase(),
          elem = document.getElementById(elemID),
          promise = Promise.resolve();
      if (extension === ".obj") {
        var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
        promise = promise.then(function () {
          return ModelLoader.loadObject(newPath, "mtl", progress);
        }).then(function (materials) {
          materials.preload();
          Loader.setMaterials(materials);
        });
      } else if (extension === ".mtl") {
        var match = src.match(PATH_PATTERN),
            dir = match[1];
        src = match[2] + match[3];
        Loader.setBaseUrl(dir);
        Loader.setPath(dir);
      }

      if (elem) {
        var elemSource = elem.innerHTML.split(/\r?\n/g).map(function (s) {
          return s.trim();
        }).join("\n");
        promise = promise.then(function () {
          return Loader.parse(elemSource);
        });
      } else {
        if (Loader.setCrossOrigin) {
          Loader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
        }
        promise = promise.then(function () {
          return new Promise(function (resolve, reject) {
            return Loader.load(src, resolve, progress, reject);
          });
        });
      }

      if (extension === ".json") {
        promise = promise.then(fixJSONScene);
      }

      if (extension !== ".mtl" && extension !== ".typeface.js") {
        promise = promise.then(setProperties);
      }
      promise = promise.catch(console.error.bind(console, "MODEL_ERR", src));
      return promise;
    }
  }
};

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
  return function (obj) {
    return ModelLoader.loadObject(map[key]).then(function (model) {
      obj[key] = model;
      return obj;
    });
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Nb2RlbExvYWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTtBQUNBOztBQUNBLElBQUksVUFBVTtBQUNWLFdBQVMsTUFBTSxZQURMO0FBRVYsVUFBUSxNQUFNLFNBRko7QUFHVixVQUFRLE1BQU0sU0FISjtBQUlWLFVBQVEsTUFBTSxTQUpKO0FBS1YsVUFBUSxNQUFNLFNBTEo7QUFNVixrQkFBZ0IsTUFBTTtBQU5aLENBQWQ7QUFBQSxJQVFFLE9BQU87QUFDTCw0QkFBMEIsS0FEckI7QUFFTCw0QkFBMEI7QUFGckIsQ0FSVDtBQUFBLElBWUUsZUFBZSxpQ0FaakI7QUFBQSxJQWFFLG9CQUFvQixlQWJ0QjtBQUFBLElBY0UsZUFBZSxlQWRqQjs7QUFnQkE7QUFDQTtBQUNBLFNBQVMsWUFBVCxDQUFzQixJQUF0QixFQUE0QjtBQUMxQixPQUFLLFFBQUwsQ0FBYyxVQUFVLEdBQVYsRUFBZTtBQUMzQixRQUFJLElBQUksUUFBUixFQUFrQjtBQUNoQixVQUFJLFFBQUosQ0FBYSxxQkFBYjtBQUNBLFVBQUksUUFBSixDQUFhLGtCQUFiO0FBQ0Q7QUFDRixHQUxEO0FBTUEsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsSUFBSSxnQkFBZ0I7QUFDbEIsWUFBVSxrQkFBVSxHQUFWLEVBQWU7QUFDdkIsV0FBTyxJQUFJLFFBQUosSUFBZ0IsSUFBSSxRQUFKLENBQWEsSUFBYixDQUFrQixLQUFsQixDQUF3QixhQUF4QixDQUF2QjtBQUNELEdBSGlCO0FBSWxCLFdBQVMsaUJBQVUsR0FBVixFQUFlO0FBQ3RCLFdBQU8sQ0FBQyxJQUFJLElBQUosQ0FBUyxLQUFULENBQWUsY0FBZixDQUFSO0FBQ0QsR0FOaUI7QUFPbEIsWUFBVSxrQkFBVSxHQUFWLEVBQWU7QUFDdkIsV0FBTyxJQUFJLFFBQUosSUFBZ0IsSUFBSSxRQUFKLENBQWEsSUFBN0IsSUFBcUMsSUFBSSxRQUFKLENBQWEsSUFBYixDQUFrQixLQUFsQixDQUF3QixZQUF4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a0JBQVUsUUFBUSxJQUFSLENBQWEsYUFBYixDQUFWO0FBQ0Q7QUFDRCxnQkFBVSxRQUFRLEtBQVIsQ0FBYyxRQUFRLEtBQVIsQ0FBYyxJQUFkLENBQW1CLE9BQW5CLEVBQTRCLFdBQTVCLEVBQXlDLEdBQXpDLENBQWQsQ0FBVjtBQUNBLGFBQU8sT0FBUDtBQUNEO0FBQ0Y7QUFDRixDQTdERDs7QUFnRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLHNCQURLO0FBRWIsUUFBTSxhQUZPO0FBR2IsZUFBYTs7OztrSUFIQTtBQVFiLFdBQVMsU0FSSTtBQVNiLGNBQVksQ0FBQztBQUNYLFVBQU0sS0FESztBQUVYLFVBQU0sT0FGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxNQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWE7QUFKWixHQUpTLEVBU1Q7QUFDRCxVQUFNLFVBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBVFMsQ0FUQztBQXdCYixZQUFVLENBQUM7QUFDVCxVQUFNLG1CQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQXhCRyxDQUFmO0FBa0VBLFlBQVksV0FBWixHQUEwQixVQUFVLEdBQVYsRUFBZTtBQUN2QyxNQUFJLFNBQVMsRUFBYjtBQUFBLE1BQ0UsVUFBVSxRQUFRLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FEWjtBQUVBLE9BQUssSUFBSSxHQUFULElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFFBQUksSUFBSSxHQUFKLENBQUosRUFBYztBQUNaLGdCQUFVLFFBQVEsSUFBUixDQUFhLE9BQU8sR0FBUCxFQUFZLEdBQVosQ0FBYixDQUFWO0FBQ0Q7QUFDRjtBQUNELFNBQU8sT0FBUDtBQUNELENBVEQ7O0FBV0EsU0FBUyxNQUFULENBQWdCLEdBQWhCLEVBQXFCLEdBQXJCLEVBQTBCO0FBQ3hCLFNBQU8sVUFBQyxHQUFEO0FBQUEsV0FBUyxZQUFZLFVBQVosQ0FBdUIsSUFBSSxHQUFKLENBQXZCLEVBQ2IsSUFEYSxDQUNSLFVBQUMsS0FBRCxFQUFXO0FBQ2YsVUFBSSxHQUFKLElBQVcsS0FBWDtBQUNBLGFBQU8sR0FBUDtBQUNELEtBSmEsQ0FBVDtBQUFBLEdBQVA7QUFLRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvTW9kZWxMb2FkZXIuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.ModelLoader = ModelLoader;
})();
(function(){
"use strict";

var Network = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9OZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsVUFETTtBQUVkLFFBQU0sU0FGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sVUFBVSxFQUFoQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvTmV0d29yay5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Network = Network;
})();
(function(){
"use strict";

var Output = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9PdXRwdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxTQUFOLENBQWdCO0FBQ2QsVUFBUSxVQURNO0FBRWQsUUFBTSxRQUZRO0FBR2QsZUFBYTtBQUhDLENBQWhCO0FBS0EsSUFBTSxTQUFTLEVBQWYiLCJmaWxlIjoic3JjL1ByaW1yb3NlL091dHB1dC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Output = Output;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TELEPORT_PAD_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    LASER_WIDTH = 0.01,
    LASER_LENGTH = 3 * LASER_WIDTH,
    EULER_TEMP = new THREE.Euler(),
    moveBy = new THREE.Vector3(0, 0, 0);

var Pointer = function (_Primrose$AbstractEve) {
  _inherits(Pointer, _Primrose$AbstractEve);

  function Pointer(name, color, emission, isHand, orientationDevice) {
    var positionDevice = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, Pointer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Pointer).call(this));

    _this.name = name;
    _this.orientationDevice = orientationDevice;
    _this.positionDevice = positionDevice || orientationDevice;
    _this._currentControl = null;
    _this.showPointer = true;
    _this.color = color;
    _this.emission = emission;
    _this.velocity = new THREE.Vector3();
    _this.mesh = textured(box(LASER_WIDTH, LASER_WIDTH, LASER_LENGTH), _this.color, {
      emissive: _this.emission
    });
    _this.mesh.geometry.vertices.forEach(function (v) {
      v.z -= LASER_LENGTH * 0.5 + 0.5;
    });

    _this.disk = textured(sphere(TELEPORT_PAD_RADIUS, 128, 3), _this.color, {
      emissive: _this.emission
    });
    _this.disk.geometry.computeBoundingBox();
    _this.disk.geometry.vertices.forEach(function (v) {
      return v.y -= _this.disk.geometry.boundingBox.min.y;
    });
    _this.disk.geometry.computeBoundingBox();

    _this.disk.scale.set(1, 0.1, 1);

    if (isHand) {
      _this.mesh.add(textured(box(0.1, 0.025, 0.2), _this.color, {
        emissive: _this.emission
      }));
    }
    return _this;
  }

  _createClass(Pointer, [{
    key: "add",
    value: function add(obj) {
      this.mesh.add(obj);
    }
  }, {
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      scene.add(this.mesh);
      scene.add(this.disk);
    }
  }, {
    key: "updateMatrix",
    value: function updateMatrix() {
      return this.mesh.updateMatrix();
    }
  }, {
    key: "applyMatrix",
    value: function applyMatrix(m) {
      return this.mesh.applyMatrix(m);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.orientationDevice instanceof Primrose.PoseInputProcessor) {
        this.position.copy(this.orientationDevice.position);
        this.quaternion.copy(this.orientationDevice.quaternion);
      } else {

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
  }, {
    key: "resolvePicking",
    value: function resolvePicking(currentHits, lastHits, objects) {
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

          moveBy.fromArray(fp).sub(this.mesh.position);

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
            this.disk.position.copy(this.mesh.position).add(moveBy);
          } else {
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
              } else if (isGround) {
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
          } else if (this.currentControl) {
            this.currentControl.endPointer();
          }
        } else if (!changed && buttons > 0 && this.currentControl && point) {
          this.currentControl.moveUV(point);
        }
      }
    }
  }, {
    key: "position",
    get: function get() {
      return this.mesh.position;
    }
  }, {
    key: "quaternion",
    get: function get() {
      return this.mesh.quaternion;
    }
  }, {
    key: "matrix",
    get: function get() {
      return this.mesh.matrix;
    }
  }, {
    key: "currentControl",
    get: function get() {
      return this._currentControl;
    },
    set: function set(v) {
      var head = this;
      while (head) {
        head._currentControl = v;
        head = head.parent;
      }
    }
  }, {
    key: "segment",
    get: function get() {
      if (this.showPointer) {
        FORWARD.set(0, 0, -1).applyQuaternion(this.mesh.quaternion).add(this.mesh.position);
        return [this.name, this.mesh.position.toArray(), FORWARD.toArray()];
      }
    }
  }, {
    key: "lockMovement",
    get: function get() {
      var head = this;
      while (head) {
        if (this.currentControl && this.currentControl.lockMovement) {
          return true;
        }
        head = head.parent;
      }
      return false;
    }
  }]);

  return Pointer;
}(Primrose.AbstractEventEmitter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Qb2ludGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBTSxzQkFBc0IsR0FBNUI7QUFBQSxJQUNFLFVBQVUsSUFBSSxNQUFNLE9BQVYsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBQyxDQUF6QixDQURaO0FBQUEsSUFFRSxzQkFBc0IsQ0FGeEI7QUFBQSxJQUdFLHlCQUF5QixzQkFBc0IsbUJBSGpEO0FBQUEsSUFJRSxvQkFBb0IsQ0FKdEI7QUFBQSxJQUtFLHVCQUF1QixvQkFBb0IsaUJBTDdDO0FBQUEsSUFNRSxjQUFjLElBTmhCO0FBQUEsSUFPRSxlQUFlLElBQUksV0FQckI7QUFBQSxJQVFFLGFBQWEsSUFBSSxNQUFNLEtBQVYsRUFSZjtBQUFBLElBU0UsU0FBUyxJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQVRYOztBQVdBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxVQURFO0FBRVIsUUFBTSxTQUZFO0FBR1IsYUFBVywrQkFISDtBQUlSLGVBQWEsaUdBSkw7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLE9BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sT0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxVQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLEVBWVQ7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFNBRkw7QUFHRCxpQkFBYTtBQUhaLEdBWlMsRUFnQlQ7QUFDRCxVQUFNLG1CQURMO0FBRUQsVUFBTSx5QkFGTDtBQUdELGlCQUFhO0FBSFosR0FoQlMsRUFvQlQ7QUFDRCxVQUFNLGdCQURMO0FBRUQsVUFBTSw2QkFGTDtBQUdELGlCQUFhLDhEQUhaO0FBSUQsY0FBVSxJQUpUO0FBS0Qs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

if(typeof window !== "undefined") window.Primrose.Pointer = Pointer;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_POSE = {
  position: [0, 0, 0],
  orientation: [0, 0, 0, 1]
},
    EMPTY_SCALE = new THREE.Vector3();

var PoseInputProcessor = function (_Primrose$InputProces) {
  _inherits(PoseInputProcessor, _Primrose$InputProces);

  function PoseInputProcessor(name, parent, commands, socket, axisNames) {
    _classCallCheck(this, PoseInputProcessor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PoseInputProcessor).call(this, name, parent, commands, socket, axisNames));

    _this.currentDevice = null;
    _this.lastPose = null;
    _this.currentPose = null;
    _this.posePosition = new THREE.Vector3();
    _this.poseQuaternion = new THREE.Quaternion();
    _this.position = new THREE.Vector3();
    _this.quaternion = new THREE.Quaternion();
    _this.matrix = new THREE.Matrix4();
    return _this;
  }

  _createClass(PoseInputProcessor, [{
    key: "update",
    value: function update(dt) {
      _get(Object.getPrototypeOf(PoseInputProcessor.prototype), "update", this).call(this, dt);

      if (this.currentDevice) {
        var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
        this.lastPose = pose;
        this.inPhysicalUse = !!this.currentPose;
        var orient = this.currentPose && this.currentPose.orientation,
            pos = this.currentPose && this.currentPose.position;
        if (orient) {
          this.poseQuaternion.fromArray(orient);
        } else {
          this.poseQuaternion.set(0, 0, 0, 1);
        }
        if (pos) {
          this.posePosition.fromArray(pos);
        } else {
          this.posePosition.set(0, 0, 0);
        }
      }
    }
  }, {
    key: "updateStage",
    value: function updateStage(stageMatrix) {
      this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
      this.matrix.setPosition(this.posePosition);
      this.matrix.multiplyMatrices(stageMatrix, this.matrix);
      this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
    }
  }]);

  return PoseInputProcessor;
}(Primrose.InputProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Qb3NlSW5wdXRQcm9jZXNzb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQU0sZUFBZTtBQUNqQixZQUFVLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLENBRE87QUFFakIsZUFBYSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVY7QUFGSSxDQUFyQjtBQUFBLElBSUUsY0FBYyxJQUFJLE1BQU0sT0FBVixFQUpoQjs7QUFNQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsVUFERTtBQUVSLFFBQU0sb0JBRkU7QUFHUixhQUFXLHlCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sa0I7OztBQUNKLDhCQUFZLElBQVosRUFBa0IsTUFBbEIsRUFBMEIsUUFBMUIsRUFBb0MsTUFBcEMsRUFBNEMsU0FBNUMsRUFBdUQ7QUFBQTs7QUFBQSxzR0FDL0MsSUFEK0MsRUFDekMsTUFEeUMsRUFDakMsUUFEaUMsRUFDdkIsTUFEdUIsRUFDZixTQURlOztBQUdyRCxVQUFLLGFBQUwsR0FBcUIsSUFBckI7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxVQUFLLFlBQUwsR0FBb0IsSUFBSSxNQUFNLE9BQVYsRUFBcEI7QUFDQSxVQUFLLGNBQUwsR0FBc0IsSUFBSSxNQUFNLFVBQVYsRUFBdEI7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsSUFBSSxNQUFNLE9BQVYsRUFBaEI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsSUFBSSxNQUFNLFVBQVYsRUFBbEI7QUFDQSxVQUFLLE1BQUwsR0FBYyxJQUFJLE1BQU0sT0FBVixFQUFkO0FBVnFEO0FBV3REOzs7OzJCQUVNLEUsRUFBSTtBQUNULDJGQUFhLEVBQWI7O0FBRUEsVUFBSSxLQUFLLGFBQVQsRUFBd0I7QUFDdEIsWUFBSSxPQUFPLEtBQUssV0FBTCxJQUFvQixLQUFLLFFBQXpCLElBQXFDLFlBQWhEO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLENBQUMsQ0FBQyxLQUFLLFdBQTVCO0FBQ0EsWUFBSSxTQUFTLEtBQUssV0FBTCxJQUFvQixLQUFLLFdBQUwsQ0FBaUIsV0FBbEQ7QUFBQSxZQUNFLE1BQU0sS0FBSyxXQUFMLElBQW9CLEtBQUssV0FBTCxDQUFpQixRQUQ3QztBQUVBLFlBQUksTUFBSixFQUFZO0FBQ1YsZUFBSyxjQUFMLENBQW9CLFNBQXBCLENBQThCLE1BQTlCO0FBQ0QsU0FGRCxNQUdLO0FBQ0gsZUFBSyxjQUFMLENBQW9CLEdBQXBCLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDO0FBQ0Q7QUFDRCxZQUFJLEdBQUosRUFBUztBQUNQLGVBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixHQUE1QjtBQUNELFNBRkQsTUFHSztBQUNILGVBQUssWUFBTCxDQUFrQixHQUFsQixDQUFzQixDQUF0QixFQUF5QixDQUF6QixFQUE0QixDQUE1QjtBQUNEO0FBQ0Y7QUFDRjs7O2dDQUVXLFcsRUFBYTtBQUN2QixXQUFLLE1BQUwsQ0FBWSwwQkFBWixDQUF1QyxLQUFLLGNBQTVDO0FBQ0EsV0FBSyxNQUFMLENBQVksV0FBWixDQUF3QixLQUFLLFlBQTdCO0FBQ0EsV0FBSyxNQUFMLENBQVksZ0JBQVosQ0FBNkIsV0FBN0IsRUFBMEMsS0FBSyxNQUEvQztBQUNBLFdBQUssTUFBTCxDQUFZLFNBQVosQ0FBc0IsS0FBSyxRQUEzQixFQUFxQyxLQUFLLFVBQTFDLEVBQXNELFdBQXREO0FBQ0Q7Ozs7RUEzQzhCLFNBQVMsYyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvUG9zZUlucHV0UHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.PoseInputProcessor = PoseInputProcessor;
})();
(function(){
"use strict";

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

          return x < 0 ? -1 : x > 0 ? 1 : +x;
        };
      }

      if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {

        // Missing in IE9-11.
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name

        Object.defineProperty(Function.prototype, 'name', {
          get: function get() {

            return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
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
        this._w = w !== undefined ? w : 1;
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
        set: function set(x, y, z, w) {

          this._x = x;
          this._y = y;
          this._z = z;
          this._w = w;
          this.onChangeCallback();
          return this;
        },
        clone: function clone() {

          return new this.constructor(this._x, this._y, this._z, this._w);
        },
        copy: function copy(quaternion) {

          this._x = quaternion.x;
          this._y = quaternion.y;
          this._z = quaternion.z;
          this._w = quaternion.w;
          this.onChangeCallback();
          return this;
        },
        setFromEuler: function setFromEuler(euler, update) {

          if (euler instanceof THREE.Euler === false) {

            throw new Error('THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
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
          } else if (euler.order === 'YXZ') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if (euler.order === 'ZXY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if (euler.order === 'ZYX') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          } else if (euler.order === 'YZX') {

            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
          } else if (euler.order === 'XZY') {

            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
          }

          if (update !== false) this.onChangeCallback();
          return this;
        },
        setFromAxisAngle: function setFromAxisAngle(axis, angle) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

          // assumes axis is normalized

          var halfAngle = angle / 2,
              s = Math.sin(halfAngle);
          this._x = axis.x * s;
          this._y = axis.y * s;
          this._z = axis.z * s;
          this._w = Math.cos(halfAngle);
          this.onChangeCallback();
          return this;
        },
        setFromRotationMatrix: function setFromRotationMatrix(m) {

          // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

          // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

          var te = m.elements,
              m11 = te[0],
              m12 = te[4],
              m13 = te[8],
              m21 = te[1],
              m22 = te[5],
              m23 = te[9],
              m31 = te[2],
              m32 = te[6],
              m33 = te[10],
              trace = m11 + m22 + m33,
              s;
          if (trace > 0) {

            s = 0.5 / Math.sqrt(trace + 1.0);
            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
          } else if (m11 > m22 && m11 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;
          } else if (m22 > m33) {

            s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
          } else {

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

          var v1, r;
          var EPS = 0.000001;
          return function (vFrom, vTo) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            r = vFrom.dot(vTo) + 1;
            if (r < EPS) {

              r = 0;
              if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {

                v1.set(-vFrom.y, vFrom.x, 0);
              } else {

                v1.set(0, -vFrom.z, vFrom.y);
              }
            } else {

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
        inverse: function inverse() {

          this.conjugate().normalize();
          return this;
        },
        conjugate: function conjugate() {

          this._x *= -1;
          this._y *= -1;
          this._z *= -1;
          this.onChangeCallback();
          return this;
        },
        dot: function dot(v) {

          return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
        },
        lengthSq: function lengthSq() {

          return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
        },
        length: function length() {

          return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
        },
        normalize: function normalize() {

          var l = this.length();
          if (l === 0) {

            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
          } else {

            l = 1 / l;
            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;
          }

          this.onChangeCallback();
          return this;
        },
        multiply: function multiply(q, p) {

          if (p !== undefined) {

            console.warn('THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.');
            return this.multiplyQuaternions(q, p);
          }

          return this.multiplyQuaternions(this, q);
        },
        multiplyQuaternions: function multiplyQuaternions(a, b) {

          // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

          var qax = a._x,
              qay = a._y,
              qaz = a._z,
              qaw = a._w;
          var qbx = b._x,
              qby = b._y,
              qbz = b._z,
              qbw = b._w;
          this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
          this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
          this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
          this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
          this.onChangeCallback();
          return this;
        },
        multiplyVector3: function multiplyVector3(vector) {

          console.warn('THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.');
          return vector.applyQuaternion(this);
        },
        slerp: function slerp(qb, t) {

          if (t === 0) return this;
          if (t === 1) return this.copy(qb);
          var x = this._x,
              y = this._y,
              z = this._z,
              w = this._w;
          // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

          var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
          if (cosHalfTheta < 0) {

            this._w = -qb._w;
            this._x = -qb._x;
            this._y = -qb._y;
            this._z = -qb._z;
            cosHalfTheta = -cosHalfTheta;
          } else {

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
          this._w = w * ratioA + this._w * ratioB;
          this._x = x * ratioA + this._x * ratioB;
          this._y = y * ratioA + this._y * ratioB;
          this._z = z * ratioA + this._z * ratioB;
          this.onChangeCallback();
          return this;
        },
        equals: function equals(quaternion) {

          return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
        },
        fromArray: function fromArray(array, offset) {

          if (offset === undefined) offset = 0;
          this._x = array[offset];
          this._y = array[offset + 1];
          this._z = array[offset + 2];
          this._w = array[offset + 3];
          this.onChangeCallback();
          return this;
        },
        toArray: function toArray(array, offset) {

          if (array === undefined) array = [];
          if (offset === undefined) offset = 0;
          array[offset] = this._x;
          array[offset + 1] = this._y;
          array[offset + 2] = this._z;
          array[offset + 3] = this._w;
          return array;
        },
        onChange: function onChange(callback) {

          this.onChangeCallback = callback;
          return this;
        },
        onChangeCallback: function onChangeCallback() {}

      };
      THREE.Quaternion.slerp = function (qa, qb, qm, t) {

        return qm.copy(qa).slerp(qb, t);
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
        set: function set(x, y, z) {

          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        },
        setX: function setX(x) {

          this.x = x;
          return this;
        },
        setY: function setY(y) {

          this.y = y;
          return this;
        },
        setZ: function setZ(z) {

          this.z = z;
          return this;
        },
        setComponent: function setComponent(index, value) {

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
        getComponent: function getComponent(index) {

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
        clone: function clone() {

          return new this.constructor(this.x, this.y, this.z);
        },
        copy: function copy(v) {

          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        },
        add: function add(v, w) {

          if (w !== undefined) {

            console.warn('THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
            return this.addVectors(v, w);
          }

          this.x += v.x;
          this.y += v.y;
          this.z += v.z;
          return this;
        },
        addScalar: function addScalar(s) {

          this.x += s;
          this.y += s;
          this.z += s;
          return this;
        },
        addVectors: function addVectors(a, b) {

          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        },
        addScaledVector: function addScaledVector(v, s) {

          this.x += v.x * s;
          this.y += v.y * s;
          this.z += v.z * s;
          return this;
        },
        sub: function sub(v, w) {

          if (w !== undefined) {

            console.warn('THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
            return this.subVectors(v, w);
          }

          this.x -= v.x;
          this.y -= v.y;
          this.z -= v.z;
          return this;
        },
        subScalar: function subScalar(s) {
          this.x -= s;
          this.y -= s;
          this.z -= s;
          return this;
        },
        subVectors: function subVectors(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        },
        multiply: function multiply(v, w) {

          if (w !== undefined) {

            console.warn('THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.');
            return this.multiplyVectors(v, w);
          }

          this.x *= v.x;
          this.y *= v.y;
          this.z *= v.z;
          return this;
        },
        multiplyScalar: function multiplyScalar(scalar) {

          this.x *= scalar;
          this.y *= scalar;
          this.z *= scalar;
          return this;
        },
        multiplyVectors: function multiplyVectors(a, b) {

          this.x = a.x * b.x;
          this.y = a.y * b.y;
          this.z = a.z * b.z;
          return this;
        },
        applyEuler: function () {

          var quaternion;
          return function applyEuler(euler) {

            if (euler instanceof THREE.Euler === false) {

              console.error('THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.');
            }

            if (quaternion === undefined) quaternion = new THREE.Quaternion();
            this.applyQuaternion(quaternion.setFromEuler(euler));
            return this;
          };
        }(),
        applyAxisAngle: function () {

          var quaternion;
          return function applyAxisAngle(axis, angle) {

            if (quaternion === undefined) quaternion = new THREE.Quaternion();
            this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
            return this;
          };
        }(),
        applyMatrix3: function applyMatrix3(m) {

          var x = this.x;
          var y = this.y;
          var z = this.z;
          var e = m.elements;
          this.x = e[0] * x + e[3] * y + e[6] * z;
          this.y = e[1] * x + e[4] * y + e[7] * z;
          this.z = e[2] * x + e[5] * y + e[8] * z;
          return this;
        },
        applyMatrix4: function applyMatrix4(m) {

          // input: THREE.Matrix4 affine matrix

          var x = this.x,
              y = this.y,
              z = this.z;
          var e = m.elements;
          this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
          this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
          this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
          return this;
        },
        applyProjection: function applyProjection(m) {

          // input: THREE.Matrix4 projection matrix

          var x = this.x,
              y = this.y,
              z = this.z;
          var e = m.elements;
          var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

          this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
          this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
          this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
          return this;
        },
        applyQuaternion: function applyQuaternion(q) {

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

            if (matrix === undefined) matrix = new THREE.Matrix4();
            matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
            return this.applyProjection(matrix);
          };
        }(),
        unproject: function () {

          var matrix;
          return function unproject(camera) {

            if (matrix === undefined) matrix = new THREE.Matrix4();
            matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
            return this.applyProjection(matrix);
          };
        }(),
        transformDirection: function transformDirection(m) {

          // input: THREE.Matrix4 affine matrix
          // vector interpreted as a direction

          var x = this.x,
              y = this.y,
              z = this.z;
          var e = m.elements;
          this.x = e[0] * x + e[4] * y + e[8] * z;
          this.y = e[1] * x + e[5] * y + e[9] * z;
          this.z = e[2] * x + e[6] * y + e[10] * z;
          this.normalize();
          return this;
        },
        divide: function divide(v) {

          this.x /= v.x;
          this.y /= v.y;
          this.z /= v.z;
          return this;
        },
        divideScalar: function divideScalar(scalar) {

          if (scalar !== 0) {

            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
          } else {

            this.x = 0;
            this.y = 0;
            this.z = 0;
          }

          return this;
        },
        min: function min(v) {

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
        max: function max(v) {

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
        clamp: function clamp(min, max) {

          // This function assumes min < max, if this assumption isn't true it will not operate correctly

          if (this.x < min.x) {

            this.x = min.x;
          } else if (this.x > max.x) {

            this.x = max.x;
          }

          if (this.y < min.y) {

            this.y = min.y;
          } else if (this.y > max.y) {

            this.y = max.y;
          }

          if (this.z < min.z) {

            this.z = min.z;
          } else if (this.z > max.z) {

            this.z = max.z;
          }

          return this;
        },
        clampScalar: function () {

          var min, max;
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
        floor: function floor() {

          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          this.z = Math.floor(this.z);
          return this;
        },
        ceil: function ceil() {

          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          this.z = Math.ceil(this.z);
          return this;
        },
        round: function round() {

          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          this.z = Math.round(this.z);
          return this;
        },
        roundToZero: function roundToZero() {

          this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
          this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
          this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
          return this;
        },
        negate: function negate() {

          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        },
        dot: function dot(v) {

          return this.x * v.x + this.y * v.y + this.z * v.z;
        },
        lengthSq: function lengthSq() {

          return this.x * this.x + this.y * this.y + this.z * this.z;
        },
        length: function length() {

          return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        },
        lengthManhattan: function lengthManhattan() {

          return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
        },
        normalize: function normalize() {

          return this.divideScalar(this.length());
        },
        setLength: function setLength(l) {

          var oldLength = this.length();
          if (oldLength !== 0 && l !== oldLength) {

            this.multiplyScalar(l / oldLength);
          }

          return this;
        },
        lerp: function lerp(v, alpha) {

          this.x += (v.x - this.x) * alpha;
          this.y += (v.y - this.y) * alpha;
          this.z += (v.z - this.z) * alpha;
          return this;
        },
        lerpVectors: function lerpVectors(v1, v2, alpha) {

          this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
          return this;
        },
        cross: function cross(v, w) {

          if (w !== undefined) {

            console.warn('THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.');
            return this.crossVectors(v, w);
          }

          var x = this.x,
              y = this.y,
              z = this.z;
          this.x = y * v.z - z * v.y;
          this.y = z * v.x - x * v.z;
          this.z = x * v.y - y * v.x;
          return this;
        },
        crossVectors: function crossVectors(a, b) {

          var ax = a.x,
              ay = a.y,
              az = a.z;
          var bx = b.x,
              by = b.y,
              bz = b.z;
          this.x = ay * bz - az * by;
          this.y = az * bx - ax * bz;
          this.z = ax * by - ay * bx;
          return this;
        },
        projectOnVector: function () {

          var v1, dot;
          return function projectOnVector(vector) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            v1.copy(vector).normalize();
            dot = this.dot(v1);
            return this.copy(v1).multiplyScalar(dot);
          };
        }(),
        projectOnPlane: function () {

          var v1;
          return function projectOnPlane(planeNormal) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            v1.copy(this).projectOnVector(planeNormal);
            return this.sub(v1);
          };
        }(),
        reflect: function () {

          // reflect incident vector off plane orthogonal to normal
          // normal is assumed to have unit length

          var v1;
          return function reflect(normal) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            return this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
          };
        }(),
        angleTo: function angleTo(v) {

          var theta = this.dot(v) / (this.length() * v.length());
          // clamp, to handle numerical problems

          return Math.acos(THREE.Math.clamp(theta, -1, 1));
        },
        distanceTo: function distanceTo(v) {

          return Math.sqrt(this.distanceToSquared(v));
        },
        distanceToSquared: function distanceToSquared(v) {

          var dx = this.x - v.x;
          var dy = this.y - v.y;
          var dz = this.z - v.z;
          return dx * dx + dy * dy + dz * dz;
        },
        setEulerFromRotationMatrix: function setEulerFromRotationMatrix(m, order) {

          console.error('THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.');
        },
        setEulerFromQuaternion: function setEulerFromQuaternion(q, order) {

          console.error('THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.');
        },
        getPositionFromMatrix: function getPositionFromMatrix(m) {

          console.warn('THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().');
          return this.setFromMatrixPosition(m);
        },
        getScaleFromMatrix: function getScaleFromMatrix(m) {

          console.warn('THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().');
          return this.setFromMatrixScale(m);
        },
        getColumnFromMatrix: function getColumnFromMatrix(index, matrix) {

          console.warn('THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().');
          return this.setFromMatrixColumn(index, matrix);
        },
        setFromMatrixPosition: function setFromMatrixPosition(m) {

          this.x = m.elements[12];
          this.y = m.elements[13];
          this.z = m.elements[14];
          return this;
        },
        setFromMatrixScale: function setFromMatrixScale(m) {

          var sx = this.set(m.elements[0], m.elements[1], m.elements[2]).length();
          var sy = this.set(m.elements[4], m.elements[5], m.elements[6]).length();
          var sz = this.set(m.elements[8], m.elements[9], m.elements[10]).length();
          this.x = sx;
          this.y = sy;
          this.z = sz;
          return this;
        },
        setFromMatrixColumn: function setFromMatrixColumn(index, matrix) {

          var offset = index * 4;
          var me = matrix.elements;
          this.x = me[offset];
          this.y = me[offset + 1];
          this.z = me[offset + 2];
          return this;
        },
        equals: function equals(v) {

          return v.x === this.x && v.y === this.y && v.z === this.z;
        },
        fromArray: function fromArray(array, offset) {

          if (offset === undefined) offset = 0;
          this.x = array[offset];
          this.y = array[offset + 1];
          this.z = array[offset + 2];
          return this;
        },
        toArray: function toArray(array, offset) {

          if (array === undefined) array = [];
          if (offset === undefined) offset = 0;
          array[offset] = this.x;
          array[offset + 1] = this.y;
          array[offset + 2] = this.z;
          return array;
        },
        fromAttribute: function fromAttribute(attribute, index, offset) {

          if (offset === undefined) offset = 0;
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
        this.elements = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      };
      THREE.Matrix4.prototype = {
        constructor: THREE.Matrix4,
        set: function set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {

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
        identity: function identity() {

          this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          return this;
        },
        clone: function clone() {

          return new THREE.Matrix4().fromArray(this.elements);
        },
        copy: function copy(m) {

          this.elements.set(m.elements);
          return this;
        },
        extractPosition: function extractPosition(m) {

          console.warn('THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().');
          return this.copyPosition(m);
        },
        copyPosition: function copyPosition(m) {

          var te = this.elements;
          var me = m.elements;
          te[12] = me[12];
          te[13] = me[13];
          te[14] = me[14];
          return this;
        },
        extractBasis: function extractBasis(xAxis, yAxis, zAxis) {

          var te = this.elements;
          xAxis.set(te[0], te[1], te[2]);
          yAxis.set(te[4], te[5], te[6]);
          zAxis.set(te[8], te[9], te[10]);
          return this;
        },
        makeBasis: function makeBasis(xAxis, yAxis, zAxis) {

          this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
          return this;
        },
        extractRotation: function () {

          var v1;
          return function (m) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            var te = this.elements;
            var me = m.elements;
            var scaleX = 1 / v1.set(me[0], me[1], me[2]).length();
            var scaleY = 1 / v1.set(me[4], me[5], me[6]).length();
            var scaleZ = 1 / v1.set(me[8], me[9], me[10]).length();
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
        makeRotationFromEuler: function makeRotationFromEuler(euler) {

          if (euler instanceof THREE.Euler === false) {

            console.error('THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.');
          }

          var te = this.elements;
          var x = euler.x,
              y = euler.y,
              z = euler.z;
          var a = Math.cos(x),
              b = Math.sin(x);
          var c = Math.cos(y),
              d = Math.sin(y);
          var e = Math.cos(z),
              f = Math.sin(z);
          if (euler.order === 'XYZ') {

            var ae = a * e,
                af = a * f,
                be = b * e,
                bf = b * f;
            te[0] = c * e;
            te[4] = -c * f;
            te[8] = d;
            te[1] = af + be * d;
            te[5] = ae - bf * d;
            te[9] = -b * c;
            te[2] = bf - ae * d;
            te[6] = be + af * d;
            te[10] = a * c;
          } else if (euler.order === 'YXZ') {

            var ce = c * e,
                cf = c * f,
                de = d * e,
                df = d * f;
            te[0] = ce + df * b;
            te[4] = de * b - cf;
            te[8] = a * d;
            te[1] = a * f;
            te[5] = a * e;
            te[9] = -b;
            te[2] = cf * b - de;
            te[6] = df + ce * b;
            te[10] = a * c;
          } else if (euler.order === 'ZXY') {

            var ce = c * e,
                cf = c * f,
                de = d * e,
                df = d * f;
            te[0] = ce - df * b;
            te[4] = -a * f;
            te[8] = de + cf * b;
            te[1] = cf + de * b;
            te[5] = a * e;
            te[9] = df - ce * b;
            te[2] = -a * d;
            te[6] = b;
            te[10] = a * c;
          } else if (euler.order === 'ZYX') {

            var ae = a * e,
                af = a * f,
                be = b * e,
                bf = b * f;
            te[0] = c * e;
            te[4] = be * d - af;
            te[8] = ae * d + bf;
            te[1] = c * f;
            te[5] = bf * d + ae;
            te[9] = af * d - be;
            te[2] = -d;
            te[6] = b * c;
            te[10] = a * c;
          } else if (euler.order === 'YZX') {

            var ac = a * c,
                ad = a * d,
                bc = b * c,
                bd = b * d;
            te[0] = c * e;
            te[4] = bd - ac * f;
            te[8] = bc * f + ad;
            te[1] = f;
            te[5] = a * e;
            te[9] = -b * e;
            te[2] = -d * e;
            te[6] = ad * f + bc;
            te[10] = ac - bd * f;
          } else if (euler.order === 'XZY') {

            var ac = a * c,
                ad = a * d,
                bc = b * c,
                bd = b * d;
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
        setRotationFromQuaternion: function setRotationFromQuaternion(q) {

          console.warn('THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().');
          return this.makeRotationFromQuaternion(q);
        },
        makeRotationFromQuaternion: function makeRotationFromQuaternion(q) {

          var te = this.elements;
          var x = q.x,
              y = q.y,
              z = q.z,
              w = q.w;
          var x2 = x + x,
              y2 = y + y,
              z2 = z + z;
          var xx = x * x2,
              xy = x * y2,
              xz = x * z2;
          var yy = y * y2,
              yz = y * z2,
              zz = z * z2;
          var wx = w * x2,
              wy = w * y2,
              wz = w * z2;
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

          var x, y, z;
          return function (eye, target, up) {

            if (x === undefined) x = new THREE.Vector3();
            if (y === undefined) y = new THREE.Vector3();
            if (z === undefined) z = new THREE.Vector3();
            var te = this.elements;
            z.subVectors(eye, target).normalize();
            if (z.length() === 0) {

              z.z = 1;
            }

            x.crossVectors(up, z).normalize();
            if (x.length() === 0) {

              z.x += 0.0001;
              x.crossVectors(up, z).normalize();
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
        multiply: function multiply(m, n) {

          if (n !== undefined) {

            console.warn('THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.');
            return this.multiplyMatrices(m, n);
          }

          return this.multiplyMatrices(this, m);
        },
        multiplyMatrices: function multiplyMatrices(a, b) {

          var ae = a.elements;
          var be = b.elements;
          var te = this.elements;
          var a11 = ae[0],
              a12 = ae[4],
              a13 = ae[8],
              a14 = ae[12];
          var a21 = ae[1],
              a22 = ae[5],
              a23 = ae[9],
              a24 = ae[13];
          var a31 = ae[2],
              a32 = ae[6],
              a33 = ae[10],
              a34 = ae[14];
          var a41 = ae[3],
              a42 = ae[7],
              a43 = ae[11],
              a44 = ae[15];
          var b11 = be[0],
              b12 = be[4],
              b13 = be[8],
              b14 = be[12];
          var b21 = be[1],
              b22 = be[5],
              b23 = be[9],
              b24 = be[13];
          var b31 = be[2],
              b32 = be[6],
              b33 = be[10],
              b34 = be[14];
          var b41 = be[3],
              b42 = be[7],
              b43 = be[11],
              b44 = be[15];
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
        multiplyToArray: function multiplyToArray(a, b, r) {

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
        multiplyScalar: function multiplyScalar(s) {

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
        multiplyVector3: function multiplyVector3(vector) {

          console.warn('THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.');
          return vector.applyProjection(this);
        },
        multiplyVector4: function multiplyVector4(vector) {

          console.warn('THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.');
          return vector.applyMatrix4(this);
        },
        multiplyVector3Array: function multiplyVector3Array(a) {

          console.warn('THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.');
          return this.applyToVector3Array(a);
        },
        applyToVector3Array: function () {

          var v1;
          return function (array, offset, length) {

            if (v1 === undefined) v1 = new THREE.Vector3();
            if (offset === undefined) offset = 0;
            if (length === undefined) length = array.length;
            for (var i = 0, j = offset; i < length; i += 3, j += 3) {

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

            if (v1 === undefined) v1 = new THREE.Vector3();
            if (offset === undefined) offset = 0;
            if (length === undefined) length = buffer.length / buffer.itemSize;
            for (var i = 0, j = offset; i < length; i++, j++) {

              v1.x = buffer.getX(j);
              v1.y = buffer.getY(j);
              v1.z = buffer.getZ(j);
              v1.applyMatrix4(this);
              buffer.setXYZ(v1.x, v1.y, v1.z);
            }

            return buffer;
          };
        }(),
        rotateAxis: function rotateAxis(v) {

          console.warn('THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.');
          v.transformDirection(this);
        },
        crossVector: function crossVector(vector) {

          console.warn('THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.');
          return vector.applyMatrix4(this);
        },
        determinant: function determinant() {

          var te = this.elements;
          var n11 = te[0],
              n12 = te[4],
              n13 = te[8],
              n14 = te[12];
          var n21 = te[1],
              n22 = te[5],
              n23 = te[9],
              n24 = te[13];
          var n31 = te[2],
              n32 = te[6],
              n33 = te[10],
              n34 = te[14];
          var n41 = te[3],
              n42 = te[7],
              n43 = te[11],
              n44 = te[15];
          //TODO: make this more efficient
          //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

          return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
        },
        transpose: function transpose() {

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
        flattenToArrayOffset: function flattenToArrayOffset(array, offset) {

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

            if (v1 === undefined) v1 = new THREE.Vector3();
            console.warn('THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.');
            var te = this.elements;
            return v1.set(te[12], te[13], te[14]);
          };
        }(),
        setPosition: function setPosition(v) {

          var te = this.elements;
          te[12] = v.x;
          te[13] = v.y;
          te[14] = v.z;
          return this;
        },
        getInverse: function getInverse(m, throwOnInvertible) {

          // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
          var te = this.elements;
          var me = m.elements;
          var n11 = me[0],
              n12 = me[4],
              n13 = me[8],
              n14 = me[12];
          var n21 = me[1],
              n22 = me[5],
              n23 = me[9],
              n24 = me[13];
          var n31 = me[2],
              n32 = me[6],
              n33 = me[10],
              n34 = me[14];
          var n41 = me[3],
              n42 = me[7],
              n43 = me[11],
              n44 = me[15];
          te[0] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
          te[4] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
          te[8] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
          te[12] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
          te[1] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
          te[5] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
          te[9] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
          te[13] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
          te[2] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
          te[6] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
          te[10] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
          te[14] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
          te[3] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
          te[7] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
          te[11] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
          te[15] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
          var det = n11 * te[0] + n21 * te[4] + n31 * te[8] + n41 * te[12];
          if (det === 0) {

            var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || false) {

              throw new Error(msg);
            } else {

              console.warn(msg);
            }

            this.identity();
            return this;
          }

          this.multiplyScalar(1 / det);
          return this;
        },
        translate: function translate(v) {

          console.error('THREE.Matrix4: .translate() has been removed.');
        },
        rotateX: function rotateX(angle) {

          console.error('THREE.Matrix4: .rotateX() has been removed.');
        },
        rotateY: function rotateY(angle) {

          console.error('THREE.Matrix4: .rotateY() has been removed.');
        },
        rotateZ: function rotateZ(angle) {

          console.error('THREE.Matrix4: .rotateZ() has been removed.');
        },
        rotateByAxis: function rotateByAxis(axis, angle) {

          console.error('THREE.Matrix4: .rotateByAxis() has been removed.');
        },
        scale: function scale(v) {

          var te = this.elements;
          var x = v.x,
              y = v.y,
              z = v.z;
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
        getMaxScaleOnAxis: function getMaxScaleOnAxis() {

          var te = this.elements;
          var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
          var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
          var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
          return Math.sqrt(Math.max(scaleXSq, Math.max(scaleYSq, scaleZSq)));
        },
        makeTranslation: function makeTranslation(x, y, z) {

          this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
          return this;
        },
        makeRotationX: function makeRotationX(theta) {

          var c = Math.cos(theta),
              s = Math.sin(theta);
          this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
          return this;
        },
        makeRotationY: function makeRotationY(theta) {

          var c = Math.cos(theta),
              s = Math.sin(theta);
          this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
          return this;
        },
        makeRotationZ: function makeRotationZ(theta) {

          var c = Math.cos(theta),
              s = Math.sin(theta);
          this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
          return this;
        },
        makeRotationAxis: function makeRotationAxis(axis, angle) {

          // Based on http://www.gamedev.net/reference/articles/article1199.asp

          var c = Math.cos(angle);
          var s = Math.sin(angle);
          var t = 1 - c;
          var x = axis.x,
              y = axis.y,
              z = axis.z;
          var tx = t * x,
              ty = t * y;
          this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
          return this;
        },
        makeScale: function makeScale(x, y, z) {

          this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
          return this;
        },
        compose: function compose(position, quaternion, scale) {

          this.makeRotationFromQuaternion(quaternion);
          this.scale(scale);
          this.setPosition(position);
          return this;
        },
        decompose: function () {

          var vector, matrix;
          return function (position, quaternion, scale) {

            if (vector === undefined) vector = new THREE.Vector3();
            if (matrix === undefined) matrix = new THREE.Matrix4();
            var te = this.elements;
            var sx = vector.set(te[0], te[1], te[2]).length();
            var sy = vector.set(te[4], te[5], te[6]).length();
            var sz = vector.set(te[8], te[9], te[10]).length();
            // if determine is negative, we need to invert one scale
            var det = this.determinant();
            if (det < 0) {

              sx = -sx;
            }

            position.x = te[12];
            position.y = te[13];
            position.z = te[14];
            // scale the rotation part

            matrix.elements.set(this.elements); // at this point matrix is incomplete so we can't use .copy()

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
        makeFrustum: function makeFrustum(left, right, bottom, top, near, far) {

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
        makePerspective: function makePerspective(fov, aspect, near, far) {

          var ymax = near * Math.tan(THREE.Math.degToRad(fov * 0.5));
          var ymin = -ymax;
          var xmin = ymin * aspect;
          var xmax = ymax * aspect;
          return this.makeFrustum(xmin, xmax, ymin, ymax, near, far);
        },
        makeOrthographic: function makeOrthographic(left, right, top, bottom, near, far) {

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
        equals: function equals(matrix) {

          var te = this.elements;
          var me = matrix.elements;
          for (var i = 0; i < 16; i++) {

            if (te[i] !== me[i]) return false;
          }

          return true;
        },
        fromArray: function fromArray(array) {

          this.elements.set(array);
          return this;
        },
        toArray: function toArray() {

          var te = this.elements;
          return [te[0], te[1], te[2], te[3], te[4], te[5], te[6], te[7], te[8], te[9], te[10], te[11], te[12], te[13], te[14], te[15]];
        }

      };
      /**
       * @author alteredq / http://alteredqualia.com/
       * @author mrdoob / http://mrdoob.com/
       */

      THREE.Math = {
        generateUUID: function () {

          // http://www.broofa.com/Tools/Math.uuid.htm

          var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
          var uuid = new Array(36);
          var rnd = 0,
              r;
          return function () {

            for (var i = 0; i < 36; i++) {

              if (i === 8 || i === 13 || i === 18 || i === 23) {

                uuid[i] = '-';
              } else if (i === 14) {

                uuid[i] = '4';
              } else {

                if (rnd <= 0x02) rnd = 0x2000000 + Math.random() * 0x1000000 | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
              }
            }

            return uuid.join('');
          };
        }(),
        // Clamp value to range <a, b>

        clamp: function clamp(x, a, b) {

          return x < a ? a : x > b ? b : x;
        },
        // Clamp value to range <a, inf)

        clampBottom: function clampBottom(x, a) {

          return x < a ? a : x;
        },
        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        euclideanModulo: function euclideanModulo(n, m) {

          return (n % m + m) % m;
        },
        // Linear mapping from range <a1, a2> to range <b1, b2>

        mapLinear: function mapLinear(x, a1, a2, b1, b2) {

          return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
        },
        // http://en.wikipedia.org/wiki/Smoothstep

        smoothstep: function smoothstep(x, min, max) {

          if (x <= min) return 0;
          if (x >= max) return 1;
          x = (x - min) / (max - min);
          return x * x * (3 - 2 * x);
        },
        smootherstep: function smootherstep(x, min, max) {

          if (x <= min) return 0;
          if (x >= max) return 1;
          x = (x - min) / (max - min);
          return x * x * x * (x * (x * 6 - 15) + 10);
        },
        // Random float from <0, 1> with 16 bits of randomness
        // (standard Math.random() creates repetitive patterns when applied over larger space)

        random16: function random16() {

          return (65280 * Math.random() + 255 * Math.random()) / 65535;
        },
        // Random integer from <low, high> interval

        randInt: function randInt(low, high) {

          return low + Math.floor(Math.random() * (high - low + 1));
        },
        // Random float from <low, high> interval

        randFloat: function randFloat(low, high) {

          return low + Math.random() * (high - low);
        },
        // Random float from <-range/2, range/2> interval

        randFloatSpread: function randFloatSpread(range) {

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
        isPowerOfTwo: function isPowerOfTwo(value) {

          return (value & value - 1) === 0 && value !== 0;
        },
        nextPowerOfTwo: function nextPowerOfTwo(value) {

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
  return v.clone().applyMatrix4(obj.matrix);
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
  obj.matrix = new THREE.Matrix4().fromArray(obj.matrix);
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
  } else {
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
      verts[n] = new THREE.Vector3().fromArray(verts[n]);
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
    } else {
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
          this.m.set(this.a.x, this.b.x, -this.c.x, 0, this.a.y, this.b.y, -this.c.y, 0, this.a.z, this.b.z, -this.c.z, 0, 0, 0, 0, 1);
          if (Math.abs(this.m.determinant()) > 1e-10) {
            this.m.getInverse(this.m);
            this.d.subVectors(this.from, v0).applyMatrix4(this.m);
            if (0 <= this.d.x && this.d.x <= 1 && 0 <= this.d.y && this.d.y <= 1 && this.d.z > 0) {
              this.c.multiplyScalar(this.d.z).add(this.from);
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
                  } else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Qcm9qZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFUixRQUFNLFdBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLFNBQVQsQ0FBbUIsUUFBbkIsRUFBNkI7QUFDM0IsR0FBQyxZQUFZO0FBQ1gsUUFBSSxPQUFPLEtBQVAsS0FBaUIsV0FBckIsRUFBa0M7QUFDaEM7QUFDQTs7QUFFQTs7Ozs7OztBQU9BLFdBQUssS0FBTCxHQUFhO0FBQ1gsa0JBQVU7QUFEQyxPQUFiO0FBR0E7O0FBRUEsVUFBSSxLQUFLLElBQUwsS0FBYyxTQUFsQixFQUE2Qjs7QUFFM0I7O0FBRUEsYUFBSyxJQUFMLEdBQVksVUFBVSxDQUFWLEVBQWE7O0FBRXZCLGlCQUFRLElBQUksQ0FBTCxHQUFVLENBQUMsQ0FBWCxHQUFnQixJQUFJLENBQUwsR0FBVSxDQUFWLEdBQWMsQ0FBQyxDQUFyQztBQUNELFNBSEQ7QUFJRDs7QUFFRCxVQUFJLFNBQVMsU0FBVCxDQUFtQixJQUFuQixLQUE0QixTQUE1QixJQUF5QyxPQUFPLGNBQVAsS0FDM0MsU0FERixFQUNhOztBQUVYO0FBQ0E7O0FBRUEsZUFBTyxjQUFQLENBQXNCLFNBQVMsU0FBL0IsRUFBMEMsTUFBMUMsRUFBa0Q7QUFDaEQsZUFBSyxlQUFZOztBQUVmLG1CQUFPLEtBQUssUUFBTCxHQUNKLEtBREksQ0FDRSwyQkFERixFQUMrQixDQUQvQixDQUFQO0FBRUQ7O0FBTCtDLFNBQWxEO0FBUUQ7O0FBRUQ7O0FBRUE7Ozs7Ozs7Ozs7O0FBV0EsWUFBTSxVQUFOLEdBQW1CLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0I7O0FBRXZDLGFBQUssRUFBTCxHQUFVLEtBQUssQ0FBZjtBQUNBLGFBQUssRUFBTCxHQUFVLEtBQUssQ0FBZjtBQUNBLGFBQUssRUFBTCxHQUFVLEtBQUssQ0FBZjtBQUNBLGFBQUssRUFBTCxHQUFXLE1BQU0sU0FBUCxHQUFvQixDQUFwQixHQUF3QixDQUFsQztBQUNELE9BTkQ7QUFPQSxZQUFNLFVBQU4sQ0FBaUIsU0FBakIsR0FBNkI7QUFDM0IscUJBQWEsTUFBTSxVQURRO0FBRTNCLFlBQUksQ0FBSixHQUFROztBQUVOLGlCQUFPLEtBQUssRUFBWjtBQUNELFNBTDBCO0FBTTNCLFlBQUksQ0FBSixDQUFNLEtBQU4sRUFBYTs7QUFFWCxlQUFLLEVBQUwsR0FBVSxLQUFWO0FBQ0EsZUFBSyxnQkFBTDtBQUNELFNBVjBCO0FBVzNCLFlBQUksQ0FBSixHQUFROztBQUVOLGlCQUFPLEtBQUssRUFBWjtBQUNELFNBZDBCO0FBZTNCLFlBQUksQ0FBSixDQUFNLEtBQU4sRUFBYTs7QUFFWCxlQUFLLEVBQUwsR0FBVSxLQUFWO0FBQ0EsZUFBSyxnQkFBTDtBQUNELFNBbkIwQjtBQW9CM0IsWUFBSSxDQUFKLEdBQVE7O0FBRU4saUJBQU8sS0FBSyxFQUFaO0FBQ0QsU0F2QjBCO0FBd0IzQixZQUFJLENBQUosQ0FBTSxLQUFOLEVBQWE7O0FBRVgsZUFBSyxFQUFMLEdBQVUsS0FBVjtBQUNBLGVBQUssZ0JBQUw7QUFDRCxTQTVCMEI7QUE2QjNCLFlBQUksQ0FBSixHQUFROztBQUVOLGlCQUFPLEtBQUssRUFBWjtBQUNELFNBaEMwQjtBQWlDM0IsWUFBSSxDQUFKLENBQU0sS0FBTixFQUFhOztBQUVYLGVBQUssRUFBTCxHQUFVLEtBQVY7QUFDQSxlQUFLLGdCQUFMO0FBQ0QsU0FyQzBCO0FBc0MzQixhQUFLLGFBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0I7O0FBRXpCLGVBQUssRUFBTCxHQUFVLENBQVY7QUFDQSxlQUFLLEVBQUwsR0FBVSxDQUFWO0FBQ0EsZUFBSyxFQUFMLEdBQVUsQ0FBVjtBQUNBLGVBQUssRUFBTCxHQUFVLENBQVY7QUFDQSxlQUFLLGdCQUFMO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBOUMwQjtBQStDM0IsZUFBTyxpQkFBWTs7QUFFakIsaUJBQU8sSUFBSSxLQUFLLFdBQVQsQ0FBcUIsS0FBSyxFQUExQixFQUE4QixLQUFLLEVBQW5DLEVBQXVDLEtBQUssRUFBNUMsRUFBZ0QsS0FBSyxFQUFyRCxDQUFQO0FBQ0QsU0FsRDBCO0FBbUQzQixjQUFNLGNBQVUsVUFBVixFQUFzQjs7QUFFMUIsZUFBSyxFQUFMLEdBQVUsV0FBVyxDQUFyQjtBQUNBLGVBQUssRUFBTCxHQUFVLFdBQVcsQ0FBckI7QUFDQSxlQUFLLEVBQUwsR0FBVSxXQUFXLENBQXJCO0FBQ0EsZUFBSyxFQUFMLEdBQVUsV0FBVyxDQUFyQjtBQUNBLGVBQUssZ0JBQUw7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0EzRDBCO0FBNEQzQixzQkFBYyxzQkFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCOztBQUVyQyxjQUFJLGlCQUFpQixNQUFNLEtBQXZCLEtBQWlDLEtBQXJDLEVBQTRDOztBQUUxQyxrQkFBTSxJQUFJLEtBQUosQ0FDSixpR0FESSxDQUFOO0FBRUQ7O0FBRUQ7QUFDQTtBQUNBOztBQUVBLGNBQUksS0FBSyxLQUFLLEdBQUwsQ0FBUyxNQUFNLEVBQU4sR0FBVyxDQUFwQixDQUFUO0FBQ0EsY0FBSSxLQUFLLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBTixHQUFXLENBQXBCLENBQVQ7QUFDQSxjQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsTUFBTSxFQUFOLEdBQVcsQ0FBcEIsQ0FBVDtBQUNBLGNBQUksS0FBSyxLQUFLLEdBQUwsQ0FBUyxNQUFNLEVBQU4sR0FBVyxDQUFwQixDQUFUO0FBQ0EsY0FBSSxLQUFLLEtBQUssR0FBTCxDQUFTLE1BQU0sRUFBTixHQUFXLENBQXBCLENBQVQ7QUFDQSxjQUFJLEtBQUssS0FBSyxHQUFMLENBQVMsTUFBTSxFQUFOLEdBQVcsQ0FBcEIsQ0FBVDtBQUNBLGNBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUV6QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0QsV0FORCxNQU9LLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0QsV0FOSSxNQU9BLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0QsV0FOSSxNQU9BLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0QsV0FOSSxNQU9BLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0QsV0FOSSxNQU9BLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFLLEVBQUwsR0FBVSxFQUFuQztBQUNBLGlCQUFLLEVBQUwsR0FBVSxLQUFLLEVBQUwsR0FBVSxFQUFWLEdBQWUsS0FBSyxFQUFMLEdBQVUsRUFBbkM7QUFDQSxpQkFBSyxFQUFMLEdBQVUsS0FBSyxFQUFMLEdBQVUsRUFBVixHQUFlLEtBQUssRUFBTCxHQUFVLEVBQW5DO0FBQ0Q7O0FBRUQsY0FBSSxXQUFXLEtBQWYsRUFDRSxLQUFLLGdCQUFMO0FBQ0YsaUJBQU8sSUFBUDtBQUNELFNBNUgwQjtBQTZIM0IsMEJBQWtCLDBCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUI7O0FBRXZDOztBQUVBOztBQUVBLGNBQUksWUFBWSxRQUFRLENBQXhCO0FBQUEsY0FDRSxJQUFJLEtBQUssR0FBTCxDQUNGLFNBREUsQ0FETjtBQUdBLGVBQUssRUFBTCxHQUFVLEtBQUssQ0FBTCxHQUFTLENBQW5CO0FBQ0EsZUFBSyxFQUFMLEdBQVUsS0FBSyxDQUFMLEdBQVMsQ0FBbkI7QUFDQSxlQUFLLEVBQUwsR0FBVSxLQUFLLENBQUwsR0FBUyxDQUFuQjtBQUNBLGVBQUssRUFBTCxHQUFVLEtBQUssR0FBTCxDQUFTLFNBQVQsQ0FBVjtBQUNBLGVBQUssZ0JBQUw7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0E1STBCO0FBNkkzQiwrQkFBdUIsK0JBQVUsQ0FBVixFQUFhOztBQUVsQzs7QUFFQTs7QUFFQSxjQUFJLEtBQUssRUFBRSxRQUFYO0FBQUEsY0FDRSxNQUFNLEdBQUcsQ0FBSCxDQURSO0FBQUEsY0FFRSxNQUNBLEdBQUcsQ0FBSCxDQUhGO0FBQUEsY0FJRSxNQUNBLEdBQUcsQ0FBSCxDQUxGO0FBQUEsY0FNRSxNQUFNLEdBQUcsQ0FBSCxDQU5SO0FBQUEsY0FPRSxNQUNBLEdBQUcsQ0FBSCxDQVJGO0FBQUEsY0FTRSxNQUNBLEdBQUcsQ0FBSCxDQVZGO0FBQUEsY0FXRSxNQUFNLEdBQUcsQ0FBSCxDQVhSO0FBQUEsY0FZRSxNQUNBLEdBQUcsQ0FBSCxDQWJGO0FBQUEsY0FjRSxNQUNBLEdBQUcsRUFBSCxDQWZGO0FBQUEsY0FnQkUsUUFBUSxNQUFNLEdBQU4sR0FBWSxHQWhCdEI7QUFBQSxjQWlCRSxDQWpCRjtBQWtCQSxjQUFJLFFBQVEsQ0FBWixFQUFlOztBQUViLGdCQUFJLE1BQU0sS0FBSyxJQUFMLENBQVUsUUFBUSxHQUFsQixDQUFWO0FBQ0EsaUJBQUssRUFBTCxHQUFVLE9BQU8sQ0FBakI7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBQyxNQUFNLEdBQVAsSUFBYyxDQUF4QjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFDLE1BQU0sR0FBUCxJQUFjLENBQXhCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsTUFBTSxHQUFQLElBQWMsQ0FBeEI7QUFDRCxXQVBELE1BUUssSUFBSSxNQUFNLEdBQU4sSUFBYSxNQUFNLEdBQXZCLEVBQTRCOztBQUUvQixnQkFBSSxNQUFNLEtBQUssSUFBTCxDQUFVLE1BQU0sR0FBTixHQUFZLEdBQVosR0FBa0IsR0FBNUIsQ0FBVjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFDLE1BQU0sR0FBUCxJQUFjLENBQXhCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLE9BQU8sQ0FBakI7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBQyxNQUFNLEdBQVAsSUFBYyxDQUF4QjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFDLE1BQU0sR0FBUCxJQUFjLENBQXhCO0FBQ0QsV0FQSSxNQVFBLElBQUksTUFBTSxHQUFWLEVBQWU7O0FBRWxCLGdCQUFJLE1BQU0sS0FBSyxJQUFMLENBQVUsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixHQUE1QixDQUFWO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsTUFBTSxHQUFQLElBQWMsQ0FBeEI7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBQyxNQUFNLEdBQVAsSUFBYyxDQUF4QjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxPQUFPLENBQWpCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsTUFBTSxHQUFQLElBQWMsQ0FBeEI7QUFDRCxXQVBJLE1BUUE7O0FBRUgsZ0JBQUksTUFBTSxLQUFLLElBQUwsQ0FBVSxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLEdBQTVCLENBQVY7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBQyxNQUFNLEdBQVAsSUFBYyxDQUF4QjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFDLE1BQU0sR0FBUCxJQUFjLENBQXhCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsTUFBTSxHQUFQLElBQWMsQ0FBeEI7QUFDQSxpQkFBSyxFQUFMLEdBQVUsT0FBTyxDQUFqQjtBQUNEOztBQUVELGVBQUssZ0JBQUw7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0F4TTBCO0FBeU0zQiw0QkFBb0IsWUFBWTs7QUFFOUI7O0FBRUE7O0FBRUEsY0FBSSxFQUFKLEVBQ0UsQ0FERjtBQUVBLGNBQUksTUFBTSxRQUFWO0FBQ0EsaUJBQU8sVUFBVSxLQUFWLEVBQWlCLEdBQWpCLEVBQXNCOztBQUUzQixnQkFBSSxPQUFPLFNBQVgsRUFDRSxLQUFLLElBQUksTUFBTSxPQUFWLEVBQUw7QUFDRixnQkFBSSxNQUFNLEdBQU4sQ0FBVSxHQUFWLElBQWlCLENBQXJCO0FBQ0EsZ0JBQUksSUFBSSxHQUFSLEVBQWE7O0FBRVgsa0JBQUksQ0FBSjtBQUNBLGtCQUFJLEtBQUssR0FBTCxDQUFTLE1BQU0sQ0FBZixJQUFvQixLQUFLLEdBQUwsQ0FBUyxNQUFNLENBQWYsQ0FBeEIsRUFBMkM7O0FBRXpDLG1CQUFHLEdBQUgsQ0FBTyxDQUFDLE1BQU0sQ0FBZCxFQUFpQixNQUFNLENBQXZCLEVBQTBCLENBQTFCO0FBQ0QsZUFIRCxNQUlLOztBQUVILG1CQUFHLEdBQUgsQ0FBTyxDQUFQLEVBQVUsQ0FBQyxNQUFNLENBQWpCLEVBQW9CLE1BQU0sQ0FBMUI7QUFDRDtBQUVGLGFBWkQsTUFhSzs7QUFFSCxpQkFBRyxZQUFILENBQWdCLEtBQWhCLEVBQXVCLEdBQXZCO0FBQ0Q7O0FBRUQsaUJBQUssRUFBTCxHQUFVLEdBQUcsQ0FBYjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxHQUFHLENBQWI7QUFDQSxpQkFBSyxFQUFMLEdBQVUsR0FBRyxDQUFiO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQVY7QUFDQSxpQkFBSyxTQUFMO0FBQ0EsbUJBQU8sSUFBUDtBQUNELFdBN0JEO0FBOEJELFNBdkNtQixFQXpNTztBQWlQM0IsaUJBQVMsbUJBQVk7O0FBRW5CLGVBQUssU0FBTCxHQUNHLFNBREg7QUFFQSxpQkFBTyxJQUFQO0FBQ0QsU0F0UDBCO0FBdVAzQixtQkFBVyxxQkFBWTs7QUFFckIsZUFBSyxFQUFMLElBQVcsQ0FBQyxDQUFaO0FBQ0EsZUFBSyxFQUFMLElBQVcsQ0FBQyxDQUFaO0FBQ0EsZUFBSyxFQUFMLElBQVcsQ0FBQyxDQUFaO0FBQ0EsZUFBSyxnQkFBTDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTlQMEI7QUErUDNCLGFBQUssYUFBVSxDQUFWLEVBQWE7O0FBRWhCLGlCQUFPLEtBQUssRUFBTCxHQUFVLEVBQUUsRUFBWixHQUFpQixLQUFLLEVBQUwsR0FBVSxFQUFFLEVBQTdCLEdBQWtDLEtBQUssRUFBTCxHQUFVLEVBQUUsRUFBOUMsR0FBbUQsS0FBSyxFQUFMLEdBQ3hELEVBQUUsRUFESjtBQUVELFNBblEwQjtBQW9RM0Isa0JBQVUsb0JBQVk7O0FBRXBCLGlCQUFPLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBZixHQUFvQixLQUFLLEVBQUwsR0FBVSxLQUFLLEVBQW5DLEdBQXdDLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBdkQsR0FDTCxLQUFLLEVBQUwsR0FBVSxLQUFLLEVBRGpCO0FBRUQsU0F4UTBCO0FBeVEzQixnQkFBUSxrQkFBWTs7QUFFbEIsaUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFmLEdBQW9CLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBbkMsR0FBd0MsS0FBSyxFQUFMLEdBQ3ZELEtBQUssRUFEVSxHQUNMLEtBQUssRUFBTCxHQUFVLEtBQUssRUFEcEIsQ0FBUDtBQUVELFNBN1EwQjtBQThRM0IsbUJBQVcscUJBQVk7O0FBRXJCLGNBQUksSUFBSSxLQUFLLE1BQUwsRUFBUjtBQUNBLGNBQUksTUFBTSxDQUFWLEVBQWE7O0FBRVgsaUJBQUssRUFBTCxHQUFVLENBQVY7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBVjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFWO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQVY7QUFDRCxXQU5ELE1BT0s7O0FBRUgsZ0JBQUksSUFBSSxDQUFSO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLENBQXBCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLENBQXBCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLENBQXBCO0FBQ0EsaUJBQUssRUFBTCxHQUFVLEtBQUssRUFBTCxHQUFVLENBQXBCO0FBQ0Q7O0FBRUQsZUFBSyxnQkFBTDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQW5TMEI7QUFvUzNCLGtCQUFVLGtCQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCOztBQUV4QixjQUFJLE1BQU0sU0FBVixFQUFxQjs7QUFFbkIsb0JBQVEsSUFBUixDQUNFLHdHQURGO0FBRUEsbUJBQU8sS0FBSyxtQkFBTCxDQUF5QixDQUF6QixFQUE0QixDQUE1QixDQUFQO0FBQ0Q7O0FBRUQsaUJBQU8sS0FBSyxtQkFBTCxDQUF5QixJQUF6QixFQUErQixDQUEvQixDQUFQO0FBQ0QsU0E5UzBCO0FBK1MzQiw2QkFBcUIsNkJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRW5DOztBQUVBLGNBQUksTUFBTSxFQUFFLEVBQVo7QUFBQSxjQUNFLE1BQ0EsRUFBRSxFQUZKO0FBQUEsY0FHRSxNQUNBLEVBQUUsRUFKSjtBQUFBLGNBS0UsTUFDQSxFQUFFLEVBTko7QUFPQSxjQUFJLE1BQU0sRUFBRSxFQUFaO0FBQUEsY0FDRSxNQUNBLEVBQUUsRUFGSjtBQUFBLGNBR0UsTUFDQSxFQUFFLEVBSko7QUFBQSxjQUtFLE1BQ0EsRUFBRSxFQU5KO0FBT0EsZUFBSyxFQUFMLEdBQVUsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBcEQ7QUFDQSxlQUFLLEVBQUwsR0FBVSxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFwRDtBQUNBLGVBQUssRUFBTCxHQUFVLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQXBEO0FBQ0EsZUFBSyxFQUFMLEdBQVUsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBcEQ7QUFDQSxlQUFLLGdCQUFMO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBdlUwQjtBQXdVM0IseUJBQWlCLHlCQUFVLE1BQVYsRUFBa0I7O0FBRWpDLGtCQUFRLElBQVIsQ0FDRSxpSEFERjtBQUVBLGlCQUFPLE9BQU8sZUFBUCxDQUF1QixJQUF2QixDQUFQO0FBQ0QsU0E3VTBCO0FBOFUzQixlQUFPLGVBQVUsRUFBVixFQUFjLENBQWQsRUFBaUI7O0FBRXRCLGNBQUksTUFBTSxDQUFWLEVBQ0UsT0FBTyxJQUFQO0FBQ0YsY0FBSSxNQUFNLENBQVYsRUFDRSxPQUFPLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBUDtBQUNGLGNBQUksSUFBSSxLQUFLLEVBQWI7QUFBQSxjQUNFLElBQ0EsS0FBSyxFQUZQO0FBQUEsY0FHRSxJQUNBLEtBQUssRUFKUDtBQUFBLGNBS0UsSUFDQSxLQUFLLEVBTlA7QUFPQTs7QUFFQSxjQUFJLGVBQWUsSUFBSSxHQUFHLEVBQVAsR0FBWSxJQUFJLEdBQUcsRUFBbkIsR0FBd0IsSUFBSSxHQUFHLEVBQS9CLEdBQW9DLElBQUksR0FBRyxFQUE5RDtBQUNBLGNBQUksZUFBZSxDQUFuQixFQUFzQjs7QUFFcEIsaUJBQUssRUFBTCxHQUFVLENBQUMsR0FBRyxFQUFkO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsR0FBRyxFQUFkO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsR0FBRyxFQUFkO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQUMsR0FBRyxFQUFkO0FBQ0EsMkJBQWUsQ0FBQyxZQUFoQjtBQUNELFdBUEQsTUFRSzs7QUFFSCxpQkFBSyxJQUFMLENBQVUsRUFBVjtBQUNEOztBQUVELGNBQUksZ0JBQWdCLEdBQXBCLEVBQXlCOztBQUV2QixpQkFBSyxFQUFMLEdBQVUsQ0FBVjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxDQUFWO0FBQ0EsaUJBQUssRUFBTCxHQUFVLENBQVY7QUFDQSxpQkFBSyxFQUFMLEdBQVUsQ0FBVjtBQUNBLG1CQUFPLElBQVA7QUFDRDs7QUFFRCxjQUFJLFlBQVksS0FBSyxJQUFMLENBQVUsWUFBVixDQUFoQjtBQUNBLGNBQUksZUFBZSxLQUFLLElBQUwsQ0FBVSxNQUFNLGVBQWUsWUFBL0IsQ0FBbkI7QUFDQSxjQUFJLEtBQUssR0FBTCxDQUFTLFlBQVQsSUFBeUIsS0FBN0IsRUFBb0M7O0FBRWxDLGlCQUFLLEVBQUwsR0FBVSxPQUFPLElBQUksS0FBSyxFQUFoQixDQUFWO0FBQ0EsaUJBQUssRUFBTCxHQUFVLE9BQU8sSUFBSSxLQUFLLEVBQWhCLENBQVY7QUFDQSxpQkFBSyxFQUFMLEdBQVUsT0FBTyxJQUFJLEtBQUssRUFBaEIsQ0FBVjtBQUNBLGlCQUFLLEVBQUwsR0FBVSxPQUFPLElBQUksS0FBSyxFQUFoQixDQUFWO0FBQ0EsbUJBQU8sSUFBUDtBQUNEOztBQUVELGNBQUksU0FBUyxLQUFLLEdBQUwsQ0FBUyxDQUFDLElBQUksQ0FBTCxJQUFVLFNBQW5CLElBQWdDLFlBQTdDO0FBQUEsY0FDRSxTQUFTLEtBQUssR0FBTCxDQUFTLElBQUksU0FBYixJQUEwQixZQURyQztBQUVBLGVBQUssRUFBTCxHQUFXLElBQUksTUFBSixHQUFhLEtBQUssRUFBTCxHQUFVLE1BQWxDO0FBQ0EsZUFBSyxFQUFMLEdBQVcsSUFBSSxNQUFKLEdBQWEsS0FBSyxFQUFMLEdBQVUsTUFBbEM7QUFDQSxlQUFLLEVBQUwsR0FBVyxJQUFJLE1BQUosR0FBYSxLQUFLLEVBQUwsR0FBVSxNQUFsQztBQUNBLGVBQUssRUFBTCxHQUFXLElBQUksTUFBSixHQUFhLEtBQUssRUFBTCxHQUFVLE1BQWxDO0FBQ0EsZUFBSyxnQkFBTDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXZZMEI7QUF3WTNCLGdCQUFRLGdCQUFVLFVBQVYsRUFBc0I7O0FBRTVCLGlCQUFRLFdBQVcsRUFBWCxLQUFrQixLQUFLLEVBQXhCLElBQWdDLFdBQVcsRUFBWCxLQUNyQyxLQUFLLEVBREEsSUFDUSxXQUFXLEVBQVgsS0FBa0IsS0FBSyxFQUQvQixJQUN1QyxXQUFXLEVBQVgsS0FDNUMsS0FBSyxFQUZQO0FBR0QsU0E3WTBCO0FBOFkzQixtQkFBVyxtQkFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCOztBQUVsQyxjQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsQ0FBVDtBQUNGLGVBQUssRUFBTCxHQUFVLE1BQU0sTUFBTixDQUFWO0FBQ0EsZUFBSyxFQUFMLEdBQVUsTUFBTSxTQUFTLENBQWYsQ0FBVjtBQUNBLGVBQUssRUFBTCxHQUFVLE1BQU0sU0FBUyxDQUFmLENBQVY7QUFDQSxlQUFLLEVBQUwsR0FBVSxNQUFNLFNBQVMsQ0FBZixDQUFWO0FBQ0EsZUFBSyxnQkFBTDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXhaMEI7QUF5WjNCLGlCQUFTLGlCQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUI7O0FBRWhDLGNBQUksVUFBVSxTQUFkLEVBQ0UsUUFBUSxFQUFSO0FBQ0YsY0FBSSxXQUFXLFNBQWYsRUFDRSxTQUFTLENBQVQ7QUFDRixnQkFBTSxNQUFOLElBQWdCLEtBQUssRUFBckI7QUFDQSxnQkFBTSxTQUFTLENBQWYsSUFBb0IsS0FBSyxFQUF6QjtBQUNBLGdCQUFNLFNBQVMsQ0FBZixJQUFvQixLQUFLLEVBQXpCO0FBQ0EsZ0JBQU0sU0FBUyxDQUFmLElBQW9CLEtBQUssRUFBekI7QUFDQSxpQkFBTyxLQUFQO0FBQ0QsU0FwYTBCO0FBcWEzQixrQkFBVSxrQkFBVSxRQUFWLEVBQW9COztBQUU1QixlQUFLLGdCQUFMLEdBQXdCLFFBQXhCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBemEwQjtBQTBhM0IsMEJBQWtCLDRCQUFZLENBQUU7O0FBMWFMLE9BQTdCO0FBNmFBLFlBQU0sVUFBTixDQUFpQixLQUFqQixHQUF5QixVQUFVLEVBQVYsRUFBYyxFQUFkLEVBQWtCLEVBQWxCLEVBQXNCLENBQXRCLEVBQXlCOztBQUVoRCxlQUFPLEdBQUcsSUFBSCxDQUFRLEVBQVIsRUFDSixLQURJLENBRUgsRUFGRyxFQUdILENBSEcsQ0FBUDtBQUlELE9BTkQ7QUFPQTs7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsWUFBTSxPQUFOLEdBQWdCLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUI7O0FBRWpDLGFBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZDtBQUNBLGFBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZDtBQUNBLGFBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZDtBQUNELE9BTEQ7QUFNQSxZQUFNLE9BQU4sQ0FBYyxTQUFkLEdBQTBCO0FBQ3hCLHFCQUFhLE1BQU0sT0FESztBQUV4QixhQUFLLGFBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUI7O0FBRXRCLGVBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxlQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsZUFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQVJ1QjtBQVN4QixjQUFNLGNBQVUsQ0FBVixFQUFhOztBQUVqQixlQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBYnVCO0FBY3hCLGNBQU0sY0FBVSxDQUFWLEVBQWE7O0FBRWpCLGVBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FsQnVCO0FBbUJ4QixjQUFNLGNBQVUsQ0FBVixFQUFhOztBQUVqQixlQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBdkJ1QjtBQXdCeEIsc0JBQWMsc0JBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3Qjs7QUFFcEMsa0JBQVEsS0FBUjs7QUFFRSxpQkFBSyxDQUFMO0FBQ0UsbUJBQUssQ0FBTCxHQUFTLEtBQVQ7QUFDQTtBQUNGLGlCQUFLLENBQUw7QUFDRSxtQkFBSyxDQUFMLEdBQVMsS0FBVDtBQUNBO0FBQ0YsaUJBQUssQ0FBTDtBQUNFLG1CQUFLLENBQUwsR0FBUyxLQUFUO0FBQ0E7QUFDRjtBQUNFLG9CQUFNLElBQUksS0FBSixDQUFVLDRCQUE0QixLQUF0QyxDQUFOO0FBWko7QUFlRCxTQXpDdUI7QUEwQ3hCLHNCQUFjLHNCQUFVLEtBQVYsRUFBaUI7O0FBRTdCLGtCQUFRLEtBQVI7O0FBRUUsaUJBQUssQ0FBTDtBQUNFLHFCQUFPLEtBQUssQ0FBWjtBQUNGLGlCQUFLLENBQUw7QUFDRSxxQkFBTyxLQUFLLENBQVo7QUFDRixpQkFBSyxDQUFMO0FBQ0UscUJBQU8sS0FBSyxDQUFaO0FBQ0Y7QUFDRSxvQkFBTSxJQUFJLEtBQUosQ0FBVSw0QkFBNEIsS0FBdEMsQ0FBTjtBQVRKO0FBWUQsU0F4RHVCO0FBeUR4QixlQUFPLGlCQUFZOztBQUVqQixpQkFBTyxJQUFJLEtBQUssV0FBVCxDQUFxQixLQUFLLENBQTFCLEVBQTZCLEtBQUssQ0FBbEMsRUFBcUMsS0FBSyxDQUExQyxDQUFQO0FBQ0QsU0E1RHVCO0FBNkR4QixjQUFNLGNBQVUsQ0FBVixFQUFhOztBQUVqQixlQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FuRXVCO0FBb0V4QixhQUFLLGFBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRW5CLGNBQUksTUFBTSxTQUFWLEVBQXFCOztBQUVuQixvQkFBUSxJQUFSLENBQ0UsdUZBREY7QUFFQSxtQkFBTyxLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsQ0FBUDtBQUNEOztBQUVELGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQWpGdUI7QUFrRnhCLG1CQUFXLG1CQUFVLENBQVYsRUFBYTs7QUFFdEIsZUFBSyxDQUFMLElBQVUsQ0FBVjtBQUNBLGVBQUssQ0FBTCxJQUFVLENBQVY7QUFDQSxlQUFLLENBQUwsSUFBVSxDQUFWO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBeEZ1QjtBQXlGeEIsb0JBQVksb0JBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRTFCLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixHQUFNLEVBQUUsQ0FBakI7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQUYsR0FBTSxFQUFFLENBQWpCO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFqQjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQS9GdUI7QUFnR3hCLHlCQUFpQix5QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjs7QUFFL0IsZUFBSyxDQUFMLElBQVUsRUFBRSxDQUFGLEdBQU0sQ0FBaEI7QUFDQSxlQUFLLENBQUwsSUFBVSxFQUFFLENBQUYsR0FBTSxDQUFoQjtBQUNBLGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBRixHQUFNLENBQWhCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBdEd1QjtBQXVHeEIsYUFBSyxhQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCOztBQUVuQixjQUFJLE1BQU0sU0FBVixFQUFxQjs7QUFFbkIsb0JBQVEsSUFBUixDQUNFLHVGQURGO0FBRUEsbUJBQU8sS0FBSyxVQUFMLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLENBQVA7QUFDRDs7QUFFRCxlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FwSHVCO0FBcUh4QixtQkFBVyxtQkFBVSxDQUFWLEVBQWE7QUFDdEIsZUFBSyxDQUFMLElBQVUsQ0FBVjtBQUNBLGVBQUssQ0FBTCxJQUFVLENBQVY7QUFDQSxlQUFLLENBQUwsSUFBVSxDQUFWO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBMUh1QjtBQTJIeEIsb0JBQVksb0JBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDMUIsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFqQjtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixHQUFNLEVBQUUsQ0FBakI7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQUYsR0FBTSxFQUFFLENBQWpCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBaEl1QjtBQWlJeEIsa0JBQVUsa0JBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRXhCLGNBQUksTUFBTSxTQUFWLEVBQXFCOztBQUVuQixvQkFBUSxJQUFSLENBQ0UsaUdBREY7QUFFQSxtQkFBTyxLQUFLLGVBQUwsQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNEOztBQUVELGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGVBQUssQ0FBTCxJQUFVLEVBQUUsQ0FBWjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTlJdUI7QUErSXhCLHdCQUFnQix3QkFBVSxNQUFWLEVBQWtCOztBQUVoQyxlQUFLLENBQUwsSUFBVSxNQUFWO0FBQ0EsZUFBSyxDQUFMLElBQVUsTUFBVjtBQUNBLGVBQUssQ0FBTCxJQUFVLE1BQVY7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FySnVCO0FBc0p4Qix5QkFBaUIseUJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRS9CLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixHQUFNLEVBQUUsQ0FBakI7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQUYsR0FBTSxFQUFFLENBQWpCO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLEdBQU0sRUFBRSxDQUFqQjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTVKdUI7QUE2SnhCLG9CQUFZLFlBQVk7O0FBRXRCLGNBQUksVUFBSjtBQUNBLGlCQUFPLFNBQVMsVUFBVCxDQUFvQixLQUFwQixFQUEyQjs7QUFFaEMsZ0JBQUksaUJBQWlCLE1BQU0sS0FBdkIsS0FBaUMsS0FBckMsRUFBNEM7O0FBRTFDLHNCQUFRLEtBQVIsQ0FDRSw0RkFERjtBQUVEOztBQUVELGdCQUFJLGVBQWUsU0FBbkIsRUFDRSxhQUFhLElBQUksTUFBTSxVQUFWLEVBQWI7QUFDRixpQkFBSyxlQUFMLENBQXFCLFdBQVcsWUFBWCxDQUF3QixLQUF4QixDQUFyQjtBQUNBLG1CQUFPLElBQVA7QUFDRCxXQVpEO0FBYUQsU0FoQlcsRUE3Slk7QUE4S3hCLHdCQUFnQixZQUFZOztBQUUxQixjQUFJLFVBQUo7QUFDQSxpQkFBTyxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsS0FBOUIsRUFBcUM7O0FBRTFDLGdCQUFJLGVBQWUsU0FBbkIsRUFDRSxhQUFhLElBQUksTUFBTSxVQUFWLEVBQWI7QUFDRixpQkFBSyxlQUFMLENBQXFCLFdBQVcsZ0JBQVgsQ0FBNEIsSUFBNUIsRUFBa0MsS0FBbEMsQ0FBckI7QUFDQSxtQkFBTyxJQUFQO0FBQ0QsV0FORDtBQU9ELFNBVmUsRUE5S1E7QUF5THhCLHNCQUFjLHNCQUFVLENBQVYsRUFBYTs7QUFFekIsY0FBSSxJQUFJLEtBQUssQ0FBYjtBQUNBLGNBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxjQUFJLElBQUksS0FBSyxDQUFiO0FBQ0EsY0FBSSxJQUFJLEVBQUUsUUFBVjtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixJQUFPLENBQVAsR0FBVyxFQUFFLENBQUYsSUFBTyxDQUFsQixHQUFzQixFQUFFLENBQUYsSUFBTyxDQUF0QztBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixJQUFPLENBQVAsR0FBVyxFQUFFLENBQUYsSUFBTyxDQUFsQixHQUFzQixFQUFFLENBQUYsSUFBTyxDQUF0QztBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixJQUFPLENBQVAsR0FBVyxFQUFFLENBQUYsSUFBTyxDQUFsQixHQUFzQixFQUFFLENBQUYsSUFBTyxDQUF0QztBQUNBLGlCQUFPLElBQVA7QUFDRCxTQW5NdUI7QUFvTXhCLHNCQUFjLHNCQUFVLENBQVYsRUFBYTs7QUFFekI7O0FBRUEsY0FBSSxJQUFJLEtBQUssQ0FBYjtBQUFBLGNBQ0UsSUFDQSxLQUFLLENBRlA7QUFBQSxjQUdFLElBQ0EsS0FBSyxDQUpQO0FBS0EsY0FBSSxJQUFJLEVBQUUsUUFBVjtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBRixJQUFPLENBQVAsR0FBVyxFQUFFLENBQUYsSUFBTyxDQUFsQixHQUFzQixFQUFFLENBQUYsSUFBTyxDQUE3QixHQUFpQyxFQUFFLEVBQUYsQ0FBMUM7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFFLENBQUYsSUFBTyxDQUFQLEdBQVcsRUFBRSxDQUFGLElBQU8sQ0FBbEIsR0FBc0IsRUFBRSxDQUFGLElBQU8sQ0FBN0IsR0FBaUMsRUFBRSxFQUFGLENBQTFDO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsRUFBRixJQUFRLENBQTlCLEdBQWtDLEVBQUUsRUFBRixDQUEzQztBQUNBLGlCQUFPLElBQVA7QUFDRCxTQWxOdUI7QUFtTnhCLHlCQUFpQix5QkFBVSxDQUFWLEVBQWE7O0FBRTVCOztBQUVBLGNBQUksSUFBSSxLQUFLLENBQWI7QUFBQSxjQUNFLElBQ0EsS0FBSyxDQUZQO0FBQUEsY0FHRSxJQUNBLEtBQUssQ0FKUDtBQUtBLGNBQUksSUFBSSxFQUFFLFFBQVY7QUFDQSxjQUFJLElBQUksS0FBSyxFQUFFLENBQUYsSUFBTyxDQUFQLEdBQVcsRUFBRSxDQUFGLElBQU8sQ0FBbEIsR0FBc0IsRUFBRSxFQUFGLElBQVEsQ0FBOUIsR0FDWCxFQUFFLEVBQUYsQ0FETSxDQUFSLENBVjRCLENBV2xCOztBQUVWLGVBQUssQ0FBTCxHQUFTLENBQUMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsQ0FBRixJQUFPLENBQTdCLEdBQWlDLEVBQUUsRUFBRixDQUFsQyxJQUEyQyxDQUFwRDtBQUNBLGVBQUssQ0FBTCxHQUFTLENBQUMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsQ0FBRixJQUFPLENBQTdCLEdBQWlDLEVBQUUsRUFBRixDQUFsQyxJQUEyQyxDQUFwRDtBQUNBLGVBQUssQ0FBTCxHQUFTLENBQUMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsRUFBRixJQUFRLENBQTlCLEdBQWtDLEVBQUUsRUFBRixDQUFuQyxJQUE0QyxDQUFyRDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXBPdUI7QUFxT3hCLHlCQUFpQix5QkFBVSxDQUFWLEVBQWE7O0FBRTVCLGNBQUksSUFBSSxLQUFLLENBQWI7QUFDQSxjQUFJLElBQUksS0FBSyxDQUFiO0FBQ0EsY0FBSSxJQUFJLEtBQUssQ0FBYjtBQUNBLGNBQUksS0FBSyxFQUFFLENBQVg7QUFDQSxjQUFJLEtBQUssRUFBRSxDQUFYO0FBQ0EsY0FBSSxLQUFLLEVBQUUsQ0FBWDtBQUNBLGNBQUksS0FBSyxFQUFFLENBQVg7QUFDQTs7QUFFQSxjQUFJLEtBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkLEdBQWtCLEtBQUssQ0FBaEM7QUFDQSxjQUFJLEtBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkLEdBQWtCLEtBQUssQ0FBaEM7QUFDQSxjQUFJLEtBQUssS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkLEdBQWtCLEtBQUssQ0FBaEM7QUFDQSxjQUFJLEtBQUssQ0FBQyxFQUFELEdBQU0sQ0FBTixHQUFVLEtBQUssQ0FBZixHQUFtQixLQUFLLENBQWpDO0FBQ0E7O0FBRUEsZUFBSyxDQUFMLEdBQVMsS0FBSyxFQUFMLEdBQVUsS0FBSyxDQUFDLEVBQWhCLEdBQXFCLEtBQUssQ0FBQyxFQUEzQixHQUFnQyxLQUFLLENBQUMsRUFBL0M7QUFDQSxlQUFLLENBQUwsR0FBUyxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQUMsRUFBaEIsR0FBcUIsS0FBSyxDQUFDLEVBQTNCLEdBQWdDLEtBQUssQ0FBQyxFQUEvQztBQUNBLGVBQUssQ0FBTCxHQUFTLEtBQUssRUFBTCxHQUFVLEtBQUssQ0FBQyxFQUFoQixHQUFxQixLQUFLLENBQUMsRUFBM0IsR0FBZ0MsS0FBSyxDQUFDLEVBQS9DO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBMVB1QjtBQTJQeEIsaUJBQVMsWUFBWTs7QUFFbkIsY0FBSSxNQUFKO0FBQ0EsaUJBQU8sU0FBUyxPQUFULENBQWlCLE1BQWpCLEVBQXlCOztBQUU5QixnQkFBSSxXQUFXLFNBQWYsRUFDRSxTQUFTLElBQUksTUFBTSxPQUFWLEVBQVQ7QUFDRixtQkFBTyxnQkFBUCxDQUF3QixPQUFPLGdCQUEvQixFQUNFLE9BQU8sVUFBUCxDQUFrQixPQUFPLFdBQXpCLENBREY7QUFFQSxtQkFBTyxLQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBUDtBQUNELFdBUEQ7QUFRRCxTQVhRLEVBM1BlO0FBdVF4QixtQkFBVyxZQUFZOztBQUVyQixjQUFJLE1BQUo7QUFDQSxpQkFBTyxTQUFTLFNBQVQsQ0FBbUIsTUFBbkIsRUFBMkI7O0FBRWhDLGdCQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsSUFBSSxNQUFNLE9BQVYsRUFBVDtBQUNGLG1CQUFPLGdCQUFQLENBQXdCLE9BQU8sV0FBL0IsRUFBNEMsT0FBTyxVQUFQLENBQzFDLE9BQU8sZ0JBRG1DLENBQTVDO0FBRUEsbUJBQU8sS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQVA7QUFDRCxXQVBEO0FBUUQsU0FYVSxFQXZRYTtBQW1SeEIsNEJBQW9CLDRCQUFVLENBQVYsRUFBYTs7QUFFL0I7QUFDQTs7QUFFQSxjQUFJLElBQUksS0FBSyxDQUFiO0FBQUEsY0FDRSxJQUNBLEtBQUssQ0FGUDtBQUFBLGNBR0UsSUFDQSxLQUFLLENBSlA7QUFLQSxjQUFJLElBQUksRUFBRSxRQUFWO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsQ0FBRixJQUFPLENBQXRDO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsQ0FBRixJQUFPLENBQXRDO0FBQ0EsZUFBSyxDQUFMLEdBQVMsRUFBRSxDQUFGLElBQU8sQ0FBUCxHQUFXLEVBQUUsQ0FBRixJQUFPLENBQWxCLEdBQXNCLEVBQUUsRUFBRixJQUFRLENBQXZDO0FBQ0EsZUFBSyxTQUFMO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBblN1QjtBQW9TeEIsZ0JBQVEsZ0JBQVUsQ0FBVixFQUFhOztBQUVuQixlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxlQUFLLENBQUwsSUFBVSxFQUFFLENBQVo7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0ExU3VCO0FBMlN4QixzQkFBYyxzQkFBVSxNQUFWLEVBQWtCOztBQUU5QixjQUFJLFdBQVcsQ0FBZixFQUFrQjs7QUFFaEIsZ0JBQUksWUFBWSxJQUFJLE1BQXBCO0FBQ0EsaUJBQUssQ0FBTCxJQUFVLFNBQVY7QUFDQSxpQkFBSyxDQUFMLElBQVUsU0FBVjtBQUNBLGlCQUFLLENBQUwsSUFBVSxTQUFWO0FBQ0QsV0FORCxNQU9LOztBQUVILGlCQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsaUJBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxpQkFBSyxDQUFMLEdBQVMsQ0FBVDtBQUNEOztBQUVELGlCQUFPLElBQVA7QUFDRCxTQTVUdUI7QUE2VHhCLGFBQUssYUFBVSxDQUFWLEVBQWE7O0FBRWhCLGNBQUksS0FBSyxDQUFMLEdBQVMsRUFBRSxDQUFmLEVBQWtCOztBQUVoQixpQkFBSyxDQUFMLEdBQVMsRUFBRSxDQUFYO0FBQ0Q7O0FBRUQsY0FBSSxLQUFLLENBQUwsR0FBUyxFQUFFLENBQWYsRUFBa0I7O0FBRWhCLGlCQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDRDs7QUFFRCxjQUFJLEtBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBZixFQUFrQjs7QUFFaEIsaUJBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBWDtBQUNEOztBQUVELGlCQUFPLElBQVA7QUFDRCxTQS9VdUI7QUFnVnhCLGFBQUssYUFBVSxDQUFWLEVBQWE7O0FBRWhCLGNBQUksS0FBSyxDQUFMLEdBQVMsRUFBRSxDQUFmLEVBQWtCOztBQUVoQixpQkFBSyxDQUFMLEdBQVMsRUFBRSxDQUFYO0FBQ0Q7O0FBRUQsY0FBSSxLQUFLLENBQUwsR0FBUyxFQUFFLENBQWYsRUFBa0I7O0FBRWhCLGlCQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDRDs7QUFFRCxjQUFJLEtBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBZixFQUFrQjs7QUFFaEIsaUJBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBWDtBQUNEOztBQUVELGlCQUFPLElBQVA7QUFDRCxTQWxXdUI7QUFtV3hCLGVBQU8sZUFBVSxHQUFWLEVBQWUsR0FBZixFQUFvQjs7QUFFekI7O0FBRUEsY0FBSSxLQUFLLENBQUwsR0FBUyxJQUFJLENBQWpCLEVBQW9COztBQUVsQixpQkFBSyxDQUFMLEdBQVMsSUFBSSxDQUFiO0FBQ0QsV0FIRCxNQUlLLElBQUksS0FBSyxDQUFMLEdBQVMsSUFBSSxDQUFqQixFQUFvQjs7QUFFdkIsaUJBQUssQ0FBTCxHQUFTLElBQUksQ0FBYjtBQUNEOztBQUVELGNBQUksS0FBSyxDQUFMLEdBQVMsSUFBSSxDQUFqQixFQUFvQjs7QUFFbEIsaUJBQUssQ0FBTCxHQUFTLElBQUksQ0FBYjtBQUNELFdBSEQsTUFJSyxJQUFJLEtBQUssQ0FBTCxHQUFTLElBQUksQ0FBakIsRUFBb0I7O0FBRXZCLGlCQUFLLENBQUwsR0FBUyxJQUFJLENBQWI7QUFDRDs7QUFFRCxjQUFJLEtBQUssQ0FBTCxHQUFTLElBQUksQ0FBakIsRUFBb0I7O0FBRWxCLGlCQUFLLENBQUwsR0FBUyxJQUFJLENBQWI7QUFDRCxXQUhELE1BSUssSUFBSSxLQUFLLENBQUwsR0FBUyxJQUFJLENBQWpCLEVBQW9COztBQUV2QixpQkFBSyxDQUFMLEdBQVMsSUFBSSxDQUFiO0FBQ0Q7O0FBRUQsaUJBQU8sSUFBUDtBQUNELFNBbll1QjtBQW9ZeEIscUJBQWEsWUFBWTs7QUFFdkIsY0FBSSxHQUFKLEVBQ0UsR0FERjtBQUVBLGlCQUFPLFNBQVMsV0FBVCxDQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQzs7QUFFMUMsZ0JBQUksUUFBUSxTQUFaLEVBQXVCOztBQUVyQixvQkFBTSxJQUFJLE1BQU0sT0FBVixFQUFOO0FBQ0Esb0JBQU0sSUFBSSxNQUFNLE9BQVYsRUFBTjtBQUNEOztBQUVELGdCQUFJLEdBQUosQ0FBUSxNQUFSLEVBQWdCLE1BQWhCLEVBQXdCLE1BQXhCO0FBQ0EsZ0JBQUksR0FBSixDQUFRLE1BQVIsRUFBZ0IsTUFBaEIsRUFBd0IsTUFBeEI7QUFDQSxtQkFBTyxLQUFLLEtBQUwsQ0FBVyxHQUFYLEVBQWdCLEdBQWhCLENBQVA7QUFDRCxXQVhEO0FBWUQsU0FoQlksRUFwWVc7QUFxWnhCLGVBQU8saUJBQVk7O0FBRWpCLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTNadUI7QUE0WnhCLGNBQU0sZ0JBQVk7O0FBRWhCLGVBQUssQ0FBTCxHQUFTLEtBQUssSUFBTCxDQUFVLEtBQUssQ0FBZixDQUFUO0FBQ0EsZUFBSyxDQUFMLEdBQVMsS0FBSyxJQUFMLENBQVUsS0FBSyxDQUFmLENBQVQ7QUFDQSxlQUFLLENBQUwsR0FBUyxLQUFLLElBQUwsQ0FBVSxLQUFLLENBQWYsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQWxhdUI7QUFtYXhCLGVBQU8saUJBQVk7O0FBRWpCLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXphdUI7QUEwYXhCLHFCQUFhLHVCQUFZOztBQUV2QixlQUFLLENBQUwsR0FBVSxLQUFLLENBQUwsR0FBUyxDQUFWLEdBQWUsS0FBSyxJQUFMLENBQVUsS0FBSyxDQUFmLENBQWYsR0FBbUMsS0FBSyxLQUFMLENBQVcsS0FBSyxDQUFoQixDQUE1QztBQUNBLGVBQUssQ0FBTCxHQUFVLEtBQUssQ0FBTCxHQUFTLENBQVYsR0FBZSxLQUFLLElBQUwsQ0FBVSxLQUFLLENBQWYsQ0FBZixHQUFtQyxLQUFLLEtBQUwsQ0FBVyxLQUFLLENBQWhCLENBQTVDO0FBQ0EsZUFBSyxDQUFMLEdBQVUsS0FBSyxDQUFMLEdBQVMsQ0FBVixHQUFlLEtBQUssSUFBTCxDQUFVLEtBQUssQ0FBZixDQUFmLEdBQW1DLEtBQUssS0FBTCxDQUFXLEtBQUssQ0FBaEIsQ0FBNUM7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FoYnVCO0FBaWJ4QixnQkFBUSxrQkFBWTs7QUFFbEIsZUFBSyxDQUFMLEdBQVMsQ0FBQyxLQUFLLENBQWY7QUFDQSxlQUFLLENBQUwsR0FBUyxDQUFDLEtBQUssQ0FBZjtBQUNBLGVBQUssQ0FBTCxHQUFTLENBQUMsS0FBSyxDQUFmO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBdmJ1QjtBQXdieEIsYUFBSyxhQUFVLENBQVYsRUFBYTs7QUFFaEIsaUJBQU8sS0FBSyxDQUFMLEdBQVMsRUFBRSxDQUFYLEdBQWUsS0FBSyxDQUFMLEdBQVMsRUFBRSxDQUExQixHQUE4QixLQUFLLENBQUwsR0FBUyxFQUFFLENBQWhEO0FBQ0QsU0EzYnVCO0FBNGJ4QixrQkFBVSxvQkFBWTs7QUFFcEIsaUJBQU8sS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkLEdBQWtCLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBaEMsR0FBb0MsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUF6RDtBQUNELFNBL2J1QjtBQWdjeEIsZ0JBQVEsa0JBQVk7O0FBRWxCLGlCQUFPLEtBQUssSUFBTCxDQUFVLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZCxHQUFrQixLQUFLLENBQUwsR0FBUyxLQUFLLENBQWhDLEdBQW9DLEtBQUssQ0FBTCxHQUNuRCxLQUFLLENBREEsQ0FBUDtBQUVELFNBcGN1QjtBQXFjeEIseUJBQWlCLDJCQUFZOztBQUUzQixpQkFBTyxLQUFLLEdBQUwsQ0FBUyxLQUFLLENBQWQsSUFBbUIsS0FBSyxHQUFMLENBQVMsS0FBSyxDQUFkLENBQW5CLEdBQXNDLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBZCxDQUE3QztBQUNELFNBeGN1QjtBQXljeEIsbUJBQVcscUJBQVk7O0FBRXJCLGlCQUFPLEtBQUssWUFBTCxDQUFrQixLQUFLLE1BQUwsRUFBbEIsQ0FBUDtBQUNELFNBNWN1QjtBQTZjeEIsbUJBQVcsbUJBQVUsQ0FBVixFQUFhOztBQUV0QixjQUFJLFlBQVksS0FBSyxNQUFMLEVBQWhCO0FBQ0EsY0FBSSxjQUFjLENBQWQsSUFBbUIsTUFBTSxTQUE3QixFQUF3Qzs7QUFFdEMsaUJBQUssY0FBTCxDQUFvQixJQUFJLFNBQXhCO0FBQ0Q7O0FBRUQsaUJBQU8sSUFBUDtBQUNELFNBdGR1QjtBQXVkeEIsY0FBTSxjQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9COztBQUV4QixlQUFLLENBQUwsSUFBVSxDQUFDLEVBQUUsQ0FBRixHQUFNLEtBQUssQ0FBWixJQUFpQixLQUEzQjtBQUNBLGVBQUssQ0FBTCxJQUFVLENBQUMsRUFBRSxDQUFGLEdBQU0sS0FBSyxDQUFaLElBQWlCLEtBQTNCO0FBQ0EsZUFBSyxDQUFMLElBQVUsQ0FBQyxFQUFFLENBQUYsR0FBTSxLQUFLLENBQVosSUFBaUIsS0FBM0I7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0E3ZHVCO0FBOGR4QixxQkFBYSxxQkFBVSxFQUFWLEVBQWMsRUFBZCxFQUFrQixLQUFsQixFQUF5Qjs7QUFFcEMsZUFBSyxVQUFMLENBQWdCLEVBQWhCLEVBQW9CLEVBQXBCLEVBQ0csY0FESCxDQUVJLEtBRkosRUFHRyxHQUhILENBSUksRUFKSjtBQUtBLGlCQUFPLElBQVA7QUFDRCxTQXRldUI7QUF1ZXhCLGVBQU8sZUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjs7QUFFckIsY0FBSSxNQUFNLFNBQVYsRUFBcUI7O0FBRW5CLG9CQUFRLElBQVIsQ0FDRSwyRkFERjtBQUVBLG1CQUFPLEtBQUssWUFBTCxDQUFrQixDQUFsQixFQUFxQixDQUFyQixDQUFQO0FBQ0Q7O0FBRUQsY0FBSSxJQUFJLEtBQUssQ0FBYjtBQUFBLGNBQ0UsSUFDQSxLQUFLLENBRlA7QUFBQSxjQUdFLElBQ0EsS0FBSyxDQUpQO0FBS0EsZUFBSyxDQUFMLEdBQVMsSUFBSSxFQUFFLENBQU4sR0FBVSxJQUFJLEVBQUUsQ0FBekI7QUFDQSxlQUFLLENBQUwsR0FBUyxJQUFJLEVBQUUsQ0FBTixHQUFVLElBQUksRUFBRSxDQUF6QjtBQUNBLGVBQUssQ0FBTCxHQUFTLElBQUksRUFBRSxDQUFOLEdBQVUsSUFBSSxFQUFFLENBQXpCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBemZ1QjtBQTBmeEIsc0JBQWMsc0JBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRTVCLGNBQUksS0FBSyxFQUFFLENBQVg7QUFBQSxjQUNFLEtBQ0EsRUFBRSxDQUZKO0FBQUEsY0FHRSxLQUNBLEVBQUUsQ0FKSjtBQUtBLGNBQUksS0FBSyxFQUFFLENBQVg7QUFBQSxjQUNFLEtBQ0EsRUFBRSxDQUZKO0FBQUEsY0FHRSxLQUNBLEVBQUUsQ0FKSjtBQUtBLGVBQUssQ0FBTCxHQUFTLEtBQUssRUFBTCxHQUFVLEtBQUssRUFBeEI7QUFDQSxlQUFLLENBQUwsR0FBUyxLQUFLLEVBQUwsR0FBVSxLQUFLLEVBQXhCO0FBQ0EsZUFBSyxDQUFMLEdBQVMsS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUF4QjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTFnQnVCO0FBMmdCeEIseUJBQWlCLFlBQVk7O0FBRTNCLGNBQUksRUFBSixFQUNFLEdBREY7QUFFQSxpQkFBTyxTQUFTLGVBQVQsQ0FBeUIsTUFBekIsRUFBaUM7O0FBRXRDLGdCQUFJLE9BQU8sU0FBWCxFQUNFLEtBQUssSUFBSSxNQUFNLE9BQVYsRUFBTDtBQUNGLGVBQUcsSUFBSCxDQUFRLE1BQVIsRUFDRyxTQURIO0FBRUEsa0JBQU0sS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFOO0FBQ0EsbUJBQU8sS0FBSyxJQUFMLENBQVUsRUFBVixFQUNKLGNBREksQ0FFSCxHQUZHLENBQVA7QUFHRCxXQVZEO0FBV0QsU0FmZ0IsRUEzZ0JPO0FBMmhCeEIsd0JBQWdCLFlBQVk7O0FBRTFCLGNBQUksRUFBSjtBQUNBLGlCQUFPLFNBQVMsY0FBVCxDQUF3QixXQUF4QixFQUFxQzs7QUFFMUMsZ0JBQUksT0FBTyxTQUFYLEVBQ0UsS0FBSyxJQUFJLE1BQU0sT0FBVixFQUFMO0FBQ0YsZUFBRyxJQUFILENBQVEsSUFBUixFQUNHLGVBREgsQ0FFSSxXQUZKO0FBR0EsbUJBQU8sS0FBSyxHQUFMLENBQVMsRUFBVCxDQUFQO0FBQ0QsV0FSRDtBQVNELFNBWmUsRUEzaEJRO0FBd2lCeEIsaUJBQVMsWUFBWTs7QUFFbkI7QUFDQTs7QUFFQSxjQUFJLEVBQUo7QUFDQSxpQkFBTyxTQUFTLE9BQVQsQ0FBaUIsTUFBakIsRUFBeUI7O0FBRTlCLGdCQUFJLE9BQU8sU0FBWCxFQUNFLEtBQUssSUFBSSxNQUFNLE9BQVYsRUFBTDtBQUNGLG1CQUFPLEtBQUssR0FBTCxDQUFTLEdBQUcsSUFBSCxDQUFRLE1BQVIsRUFDYixjQURhLENBRVosSUFDQSxLQUFLLEdBQUwsQ0FDRSxNQURGLENBSFksQ0FBVCxDQUFQO0FBS0QsV0FURDtBQVVELFNBaEJRLEVBeGlCZTtBQXlqQnhCLGlCQUFTLGlCQUFVLENBQVYsRUFBYTs7QUFFcEIsY0FBSSxRQUFRLEtBQUssR0FBTCxDQUFTLENBQVQsS0FBZSxLQUFLLE1BQUwsS0FBZ0IsRUFBRSxNQUFGLEVBQS9CLENBQVo7QUFDQTs7QUFFQSxpQkFBTyxLQUFLLElBQUwsQ0FBVSxNQUFNLElBQU4sQ0FBVyxLQUFYLENBQWlCLEtBQWpCLEVBQXdCLENBQUMsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FBVixDQUFQO0FBQ0QsU0EvakJ1QjtBQWdrQnhCLG9CQUFZLG9CQUFVLENBQVYsRUFBYTs7QUFFdkIsaUJBQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxpQkFBTCxDQUF1QixDQUF2QixDQUFWLENBQVA7QUFDRCxTQW5rQnVCO0FBb2tCeEIsMkJBQW1CLDJCQUFVLENBQVYsRUFBYTs7QUFFOUIsY0FBSSxLQUFLLEtBQUssQ0FBTCxHQUFTLEVBQUUsQ0FBcEI7QUFDQSxjQUFJLEtBQUssS0FBSyxDQUFMLEdBQVMsRUFBRSxDQUFwQjtBQUNBLGNBQUksS0FBSyxLQUFLLENBQUwsR0FBUyxFQUFFLENBQXBCO0FBQ0EsaUJBQU8sS0FBSyxFQUFMLEdBQVUsS0FBSyxFQUFmLEdBQW9CLEtBQUssRUFBaEM7QUFDRCxTQTFrQnVCO0FBMmtCeEIsb0NBQTRCLG9DQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9COztBQUU5QyxrQkFBUSxLQUFSLENBQ0UsMkdBREY7QUFFRCxTQS9rQnVCO0FBZ2xCeEIsZ0NBQXdCLGdDQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9COztBQUUxQyxrQkFBUSxLQUFSLENBQ0UsbUdBREY7QUFFRCxTQXBsQnVCO0FBcWxCeEIsK0JBQXVCLCtCQUFVLENBQVYsRUFBYTs7QUFFbEMsa0JBQVEsSUFBUixDQUNFLHVGQURGO0FBRUEsaUJBQU8sS0FBSyxxQkFBTCxDQUEyQixDQUEzQixDQUFQO0FBQ0QsU0ExbEJ1QjtBQTJsQnhCLDRCQUFvQiw0QkFBVSxDQUFWLEVBQWE7O0FBRS9CLGtCQUFRLElBQVIsQ0FDRSxpRkFERjtBQUVBLGlCQUFPLEtBQUssa0JBQUwsQ0FBd0IsQ0FBeEIsQ0FBUDtBQUNELFNBaG1CdUI7QUFpbUJ4Qiw2QkFBcUIsNkJBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5Qjs7QUFFNUMsa0JBQVEsSUFBUixDQUNFLG1GQURGO0FBRUEsaUJBQU8sS0FBSyxtQkFBTCxDQUF5QixLQUF6QixFQUFnQyxNQUFoQyxDQUFQO0FBQ0QsU0F0bUJ1QjtBQXVtQnhCLCtCQUF1QiwrQkFBVSxDQUFWLEVBQWE7O0FBRWxDLGVBQUssQ0FBTCxHQUFTLEVBQUUsUUFBRixDQUFXLEVBQVgsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsUUFBRixDQUFXLEVBQVgsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQUUsUUFBRixDQUFXLEVBQVgsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTdtQnVCO0FBOG1CeEIsNEJBQW9CLDRCQUFVLENBQVYsRUFBYTs7QUFFL0IsY0FBSSxLQUFLLEtBQUssR0FBTCxDQUFTLEVBQUUsUUFBRixDQUFXLENBQVgsQ0FBVCxFQUF3QixFQUFFLFFBQUYsQ0FBVyxDQUFYLENBQXhCLEVBQ0wsRUFBRSxRQUFGLENBQVcsQ0FBWCxDQURLLEVBRU4sTUFGTSxFQUFUO0FBR0EsY0FBSSxLQUFLLEtBQUssR0FBTCxDQUFTLEVBQUUsUUFBRixDQUFXLENBQVgsQ0FBVCxFQUF3QixFQUFFLFFBQUYsQ0FBVyxDQUFYLENBQXhCLEVBQ0wsRUFBRSxRQUFGLENBQVcsQ0FBWCxDQURLLEVBRU4sTUFGTSxFQUFUO0FBR0EsY0FBSSxLQUFLLEtBQUssR0FBTCxDQUFTLEVBQUUsUUFBRixDQUFXLENBQVgsQ0FBVCxFQUF3QixFQUFFLFFBQUYsQ0FBVyxDQUFYLENBQXhCLEVBQ0wsRUFBRSxRQUFGLENBQVcsRUFBWCxDQURLLEVBRU4sTUFGTSxFQUFUO0FBR0EsZUFBSyxDQUFMLEdBQVMsRUFBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEVBQVQ7QUFDQSxlQUFLLENBQUwsR0FBUyxFQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBN25CdUI7QUE4bkJ4Qiw2QkFBcUIsNkJBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5Qjs7QUFFNUMsY0FBSSxTQUFTLFFBQVEsQ0FBckI7QUFDQSxjQUFJLEtBQUssT0FBTyxRQUFoQjtBQUNBLGVBQUssQ0FBTCxHQUFTLEdBQUcsTUFBSCxDQUFUO0FBQ0EsZUFBSyxDQUFMLEdBQVMsR0FBRyxTQUFTLENBQVosQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLEdBQUcsU0FBUyxDQUFaLENBQVQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0F0b0J1QjtBQXVvQnhCLGdCQUFRLGdCQUFVLENBQVYsRUFBYTs7QUFFbkIsaUJBQVMsRUFBRSxDQUFGLEtBQVEsS0FBSyxDQUFkLElBQXFCLEVBQUUsQ0FBRixLQUFRLEtBQUssQ0FBbEMsSUFBeUMsRUFBRSxDQUFGLEtBQy9DLEtBQUssQ0FEUDtBQUVELFNBM29CdUI7QUE0b0J4QixtQkFBVyxtQkFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCOztBQUVsQyxjQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsQ0FBVDtBQUNGLGVBQUssQ0FBTCxHQUFTLE1BQU0sTUFBTixDQUFUO0FBQ0EsZUFBSyxDQUFMLEdBQVMsTUFBTSxTQUFTLENBQWYsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLE1BQU0sU0FBUyxDQUFmLENBQVQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0FwcEJ1QjtBQXFwQnhCLGlCQUFTLGlCQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUI7O0FBRWhDLGNBQUksVUFBVSxTQUFkLEVBQ0UsUUFBUSxFQUFSO0FBQ0YsY0FBSSxXQUFXLFNBQWYsRUFDRSxTQUFTLENBQVQ7QUFDRixnQkFBTSxNQUFOLElBQWdCLEtBQUssQ0FBckI7QUFDQSxnQkFBTSxTQUFTLENBQWYsSUFBb0IsS0FBSyxDQUF6QjtBQUNBLGdCQUFNLFNBQVMsQ0FBZixJQUFvQixLQUFLLENBQXpCO0FBQ0EsaUJBQU8sS0FBUDtBQUNELFNBL3BCdUI7QUFncUJ4Qix1QkFBZSx1QkFBVSxTQUFWLEVBQXFCLEtBQXJCLEVBQTRCLE1BQTVCLEVBQW9DOztBQUVqRCxjQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsQ0FBVDtBQUNGLGtCQUFRLFFBQVEsVUFBVSxRQUFsQixHQUE2QixNQUFyQztBQUNBLGVBQUssQ0FBTCxHQUFTLFVBQVUsS0FBVixDQUFnQixLQUFoQixDQUFUO0FBQ0EsZUFBSyxDQUFMLEdBQVMsVUFBVSxLQUFWLENBQWdCLFFBQVEsQ0FBeEIsQ0FBVDtBQUNBLGVBQUssQ0FBTCxHQUFTLFVBQVUsS0FBVixDQUFnQixRQUFRLENBQXhCLENBQVQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0Q7O0FBenFCdUIsT0FBMUI7QUE0cUJBOztBQUVBOzs7Ozs7Ozs7Ozs7O0FBYUEsWUFBTSxPQUFOLEdBQWdCLFlBQVk7QUFDMUIsYUFBSyxRQUFMLEdBQWdCLElBQUksWUFBSixDQUFpQixDQUMvQixDQUQrQixFQUM1QixDQUQ0QixFQUN6QixDQUR5QixFQUN0QixDQURzQixFQUUvQixDQUYrQixFQUU1QixDQUY0QixFQUV6QixDQUZ5QixFQUV0QixDQUZzQixFQUcvQixDQUgrQixFQUc1QixDQUg0QixFQUd6QixDQUh5QixFQUd0QixDQUhzQixFQUkvQixDQUorQixFQUk1QixDQUo0QixFQUl6QixDQUp5QixFQUl0QixDQUpzQixDQUFqQixDQUFoQjtBQU1ELE9BUEQ7QUFRQSxZQUFNLE9BQU4sQ0FBYyxTQUFkLEdBQTBCO0FBQ3hCLHFCQUFhLE1BQU0sT0FESztBQUV4QixhQUFLLGFBQVUsR0FBVixFQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsR0FBekIsRUFBOEIsR0FBOUIsRUFBbUMsR0FBbkMsRUFBd0MsR0FBeEMsRUFBNkMsR0FBN0MsRUFBa0QsR0FBbEQsRUFBdUQsR0FBdkQsRUFBNEQsR0FBNUQsRUFDSCxHQURHLEVBQ0UsR0FERixFQUNPLEdBRFAsRUFDWSxHQURaLEVBQ2lCLEdBRGpCLEVBQ3NCOztBQUV6QixjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLEdBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFSO0FBQ0EsYUFBRyxFQUFILElBQVMsR0FBVDtBQUNBLGFBQUcsQ0FBSCxJQUFRLEdBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBUjtBQUNBLGFBQUcsRUFBSCxJQUFTLEdBQVQ7QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBUjtBQUNBLGFBQUcsRUFBSCxJQUFTLEdBQVQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxHQUFUO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLEdBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxHQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsR0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXZCdUI7QUF3QnhCLGtCQUFVLG9CQUFZOztBQUVwQixlQUFLLEdBQUwsQ0FDRSxDQURGLEVBQ0ssQ0FETCxFQUNRLENBRFIsRUFDVyxDQURYLEVBRUUsQ0FGRixFQUVLLENBRkwsRUFFUSxDQUZSLEVBRVcsQ0FGWCxFQUdFLENBSEYsRUFHSyxDQUhMLEVBR1EsQ0FIUixFQUdXLENBSFgsRUFJRSxDQUpGLEVBSUssQ0FKTCxFQUlRLENBSlIsRUFJVyxDQUpYO0FBT0EsaUJBQU8sSUFBUDtBQUNELFNBbEN1QjtBQW1DeEIsZUFBTyxpQkFBWTs7QUFFakIsaUJBQU8sSUFBSSxNQUFNLE9BQVYsR0FDSixTQURJLENBQ00sS0FBSyxRQURYLENBQVA7QUFFRCxTQXZDdUI7QUF3Q3hCLGNBQU0sY0FBVSxDQUFWLEVBQWE7O0FBRWpCLGVBQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsRUFBRSxRQUFwQjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTVDdUI7QUE2Q3hCLHlCQUFpQix5QkFBVSxDQUFWLEVBQWE7O0FBRTVCLGtCQUFRLElBQVIsQ0FDRSx3RUFERjtBQUVBLGlCQUFPLEtBQUssWUFBTCxDQUFrQixDQUFsQixDQUFQO0FBQ0QsU0FsRHVCO0FBbUR4QixzQkFBYyxzQkFBVSxDQUFWLEVBQWE7O0FBRXpCLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxjQUFJLEtBQUssRUFBRSxRQUFYO0FBQ0EsYUFBRyxFQUFILElBQVMsR0FBRyxFQUFILENBQVQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxHQUFHLEVBQUgsQ0FBVDtBQUNBLGFBQUcsRUFBSCxJQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBM0R1QjtBQTREeEIsc0JBQWMsc0JBQVUsS0FBVixFQUFpQixLQUFqQixFQUF3QixLQUF4QixFQUErQjs7QUFFM0MsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGdCQUFNLEdBQU4sQ0FBVSxHQUFHLENBQUgsQ0FBVixFQUFpQixHQUFHLENBQUgsQ0FBakIsRUFBd0IsR0FBRyxDQUFILENBQXhCO0FBQ0EsZ0JBQU0sR0FBTixDQUFVLEdBQUcsQ0FBSCxDQUFWLEVBQWlCLEdBQUcsQ0FBSCxDQUFqQixFQUF3QixHQUFHLENBQUgsQ0FBeEI7QUFDQSxnQkFBTSxHQUFOLENBQVUsR0FBRyxDQUFILENBQVYsRUFBaUIsR0FBRyxDQUFILENBQWpCLEVBQXdCLEdBQUcsRUFBSCxDQUF4QjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQW5FdUI7QUFvRXhCLG1CQUFXLG1CQUFVLEtBQVYsRUFBaUIsS0FBakIsRUFBd0IsS0FBeEIsRUFBK0I7O0FBRXhDLGVBQUssR0FBTCxDQUNFLE1BQU0sQ0FEUixFQUNXLE1BQU0sQ0FEakIsRUFDb0IsTUFBTSxDQUQxQixFQUM2QixDQUQ3QixFQUVFLE1BQU0sQ0FGUixFQUVXLE1BQU0sQ0FGakIsRUFFb0IsTUFBTSxDQUYxQixFQUU2QixDQUY3QixFQUdFLE1BQU0sQ0FIUixFQUdXLE1BQU0sQ0FIakIsRUFHb0IsTUFBTSxDQUgxQixFQUc2QixDQUg3QixFQUlFLENBSkYsRUFJSyxDQUpMLEVBSVEsQ0FKUixFQUlXLENBSlg7QUFNQSxpQkFBTyxJQUFQO0FBQ0QsU0E3RXVCO0FBOEV4Qix5QkFBaUIsWUFBWTs7QUFFM0IsY0FBSSxFQUFKO0FBQ0EsaUJBQU8sVUFBVSxDQUFWLEVBQWE7O0FBRWxCLGdCQUFJLE9BQU8sU0FBWCxFQUNFLEtBQUssSUFBSSxNQUFNLE9BQVYsRUFBTDtBQUNGLGdCQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsZ0JBQUksS0FBSyxFQUFFLFFBQVg7QUFDQSxnQkFBSSxTQUFTLElBQUksR0FBRyxHQUFILENBQU8sR0FBRyxDQUFILENBQVAsRUFBYyxHQUFHLENBQUgsQ0FBZCxFQUFxQixHQUFHLENBQUgsQ0FBckIsRUFDZCxNQURjLEVBQWpCO0FBRUEsZ0JBQUksU0FBUyxJQUFJLEdBQUcsR0FBSCxDQUFPLEdBQUcsQ0FBSCxDQUFQLEVBQWMsR0FBRyxDQUFILENBQWQsRUFBcUIsR0FBRyxDQUFILENBQXJCLEVBQ2QsTUFEYyxFQUFqQjtBQUVBLGdCQUFJLFNBQVMsSUFBSSxHQUFHLEdBQUgsQ0FBTyxHQUFHLENBQUgsQ0FBUCxFQUFjLEdBQUcsQ0FBSCxDQUFkLEVBQXFCLEdBQUcsRUFBSCxDQUFyQixFQUNkLE1BRGMsRUFBakI7QUFFQSxlQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsSUFBUSxNQUFoQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxJQUFRLE1BQWhCO0FBQ0EsZUFBRyxDQUFILElBQVEsR0FBRyxDQUFILElBQVEsTUFBaEI7QUFDQSxlQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsSUFBUSxNQUFoQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxJQUFRLE1BQWhCO0FBQ0EsZUFBRyxDQUFILElBQVEsR0FBRyxDQUFILElBQVEsTUFBaEI7QUFDQSxlQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsSUFBUSxNQUFoQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxJQUFRLE1BQWhCO0FBQ0EsZUFBRyxFQUFILElBQVMsR0FBRyxFQUFILElBQVMsTUFBbEI7QUFDQSxtQkFBTyxJQUFQO0FBQ0QsV0F0QkQ7QUF1QkQsU0ExQmdCLEVBOUVPO0FBeUd4QiwrQkFBdUIsK0JBQVUsS0FBVixFQUFpQjs7QUFFdEMsY0FBSSxpQkFBaUIsTUFBTSxLQUF2QixLQUFpQyxLQUFyQyxFQUE0Qzs7QUFFMUMsb0JBQVEsS0FBUixDQUNFLHNHQURGO0FBRUQ7O0FBRUQsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUksSUFBSSxNQUFNLENBQWQ7QUFBQSxjQUNFLElBQ0EsTUFBTSxDQUZSO0FBQUEsY0FHRSxJQUNBLE1BQU0sQ0FKUjtBQUtBLGNBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxDQUFULENBQVI7QUFBQSxjQUNFLElBQ0EsS0FBSyxHQUFMLENBQ0UsQ0FERixDQUZGO0FBSUEsY0FBSSxJQUFJLEtBQUssR0FBTCxDQUFTLENBQVQsQ0FBUjtBQUFBLGNBQ0UsSUFDQSxLQUFLLEdBQUwsQ0FDRSxDQURGLENBRkY7QUFJQSxjQUFJLElBQUksS0FBSyxHQUFMLENBQVMsQ0FBVCxDQUFSO0FBQUEsY0FDRSxJQUNBLEtBQUssR0FBTCxDQUNFLENBREYsQ0FGRjtBQUlBLGNBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUV6QixnQkFBSSxLQUFLLElBQUksQ0FBYjtBQUFBLGdCQUNFLEtBQ0EsSUFDQSxDQUhGO0FBQUEsZ0JBSUUsS0FDQSxJQUNBLENBTkY7QUFBQSxnQkFPRSxLQUNBLElBQ0EsQ0FURjtBQVVBLGVBQUcsQ0FBSCxJQUFRLElBQUksQ0FBWjtBQUNBLGVBQUcsQ0FBSCxJQUFRLENBQUMsQ0FBRCxHQUFLLENBQWI7QUFDQSxlQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxLQUFLLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxLQUFLLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsQ0FBQyxDQUFELEdBQUssQ0FBYjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssS0FBSyxDQUFsQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssS0FBSyxDQUFsQjtBQUNBLGVBQUcsRUFBSCxJQUFTLElBQUksQ0FBYjtBQUNELFdBckJELE1Bc0JLLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixnQkFBSSxLQUFLLElBQUksQ0FBYjtBQUFBLGdCQUNFLEtBQ0EsSUFDQSxDQUhGO0FBQUEsZ0JBSUUsS0FDQSxJQUNBLENBTkY7QUFBQSxnQkFPRSxLQUNBLElBQ0EsQ0FURjtBQVVBLGVBQUcsQ0FBSCxJQUFRLEtBQUssS0FBSyxDQUFsQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssQ0FBTCxHQUFTLEVBQWpCO0FBQ0EsZUFBRyxDQUFILElBQVEsSUFBSSxDQUFaO0FBQ0EsZUFBRyxDQUFILElBQVEsSUFBSSxDQUFaO0FBQ0EsZUFBRyxDQUFILElBQVEsSUFBSSxDQUFaO0FBQ0EsZUFBRyxDQUFILElBQVEsQ0FBQyxDQUFUO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxDQUFMLEdBQVMsRUFBakI7QUFDQSxlQUFHLENBQUgsSUFBUSxLQUFLLEtBQUssQ0FBbEI7QUFDQSxlQUFHLEVBQUgsSUFBUyxJQUFJLENBQWI7QUFDRCxXQXJCSSxNQXNCQSxJQUFJLE1BQU0sS0FBTixLQUFnQixLQUFwQixFQUEyQjs7QUFFOUIsZ0JBQUksS0FBSyxJQUFJLENBQWI7QUFBQSxnQkFDRSxLQUNBLElBQ0EsQ0FIRjtBQUFBLGdCQUlFLEtBQ0EsSUFDQSxDQU5GO0FBQUEsZ0JBT0UsS0FDQSxJQUNBLENBVEY7QUFVQSxlQUFHLENBQUgsSUFBUSxLQUFLLEtBQUssQ0FBbEI7QUFDQSxlQUFHLENBQUgsSUFBUSxDQUFDLENBQUQsR0FBSyxDQUFiO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxLQUFLLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxLQUFLLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsSUFBSSxDQUFaO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxLQUFLLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsQ0FBQyxDQUFELEdBQUssQ0FBYjtBQUNBLGVBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxlQUFHLEVBQUgsSUFBUyxJQUFJLENBQWI7QUFDRCxXQXJCSSxNQXNCQSxJQUFJLE1BQU0sS0FBTixLQUFnQixLQUFwQixFQUEyQjs7QUFFOUIsZ0JBQUksS0FBSyxJQUFJLENBQWI7QUFBQSxnQkFDRSxLQUNBLElBQ0EsQ0FIRjtBQUFBLGdCQUlFLEtBQ0EsSUFDQSxDQU5GO0FBQUEsZ0JBT0UsS0FDQSxJQUNBLENBVEY7QUFVQSxlQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxlQUFHLENBQUgsSUFBUSxLQUFLLENBQUwsR0FBUyxFQUFqQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssQ0FBTCxHQUFTLEVBQWpCO0FBQ0EsZUFBRyxDQUFILElBQVEsSUFBSSxDQUFaO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxDQUFMLEdBQVMsRUFBakI7QUFDQSxlQUFHLENBQUgsSUFBUSxLQUFLLENBQUwsR0FBUyxFQUFqQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLENBQUMsQ0FBVDtBQUNBLGVBQUcsQ0FBSCxJQUFRLElBQUksQ0FBWjtBQUNBLGVBQUcsRUFBSCxJQUFTLElBQUksQ0FBYjtBQUNELFdBckJJLE1Bc0JBLElBQUksTUFBTSxLQUFOLEtBQWdCLEtBQXBCLEVBQTJCOztBQUU5QixnQkFBSSxLQUFLLElBQUksQ0FBYjtBQUFBLGdCQUNFLEtBQ0EsSUFDQSxDQUhGO0FBQUEsZ0JBSUUsS0FDQSxJQUNBLENBTkY7QUFBQSxnQkFPRSxLQUNBLElBQ0EsQ0FURjtBQVVBLGVBQUcsQ0FBSCxJQUFRLElBQUksQ0FBWjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssS0FBSyxDQUFsQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssQ0FBTCxHQUFTLEVBQWpCO0FBQ0EsZUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGVBQUcsQ0FBSCxJQUFRLElBQUksQ0FBWjtBQUNBLGVBQUcsQ0FBSCxJQUFRLENBQUMsQ0FBRCxHQUFLLENBQWI7QUFDQSxlQUFHLENBQUgsSUFBUSxDQUFDLENBQUQsR0FBSyxDQUFiO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxDQUFMLEdBQVMsRUFBakI7QUFDQSxlQUFHLEVBQUgsSUFBUyxLQUFLLEtBQUssQ0FBbkI7QUFDRCxXQXJCSSxNQXNCQSxJQUFJLE1BQU0sS0FBTixLQUFnQixLQUFwQixFQUEyQjs7QUFFOUIsZ0JBQUksS0FBSyxJQUFJLENBQWI7QUFBQSxnQkFDRSxLQUNBLElBQ0EsQ0FIRjtBQUFBLGdCQUlFLEtBQ0EsSUFDQSxDQU5GO0FBQUEsZ0JBT0UsS0FDQSxJQUNBLENBVEY7QUFVQSxlQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxlQUFHLENBQUgsSUFBUSxDQUFDLENBQVQ7QUFDQSxlQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxlQUFHLENBQUgsSUFBUSxLQUFLLENBQUwsR0FBUyxFQUFqQjtBQUNBLGVBQUcsQ0FBSCxJQUFRLElBQUksQ0FBWjtBQUNBLGVBQUcsQ0FBSCxJQUFRLEtBQUssQ0FBTCxHQUFTLEVBQWpCO0FBQ0EsZUFBRyxDQUFILElBQVEsS0FBSyxDQUFMLEdBQVMsRUFBakI7QUFDQSxlQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxlQUFHLEVBQUgsSUFBUyxLQUFLLENBQUwsR0FBUyxFQUFsQjtBQUNEOztBQUVEO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0E7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBVDtBQUNBLGFBQUcsRUFBSCxJQUFTLENBQVQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBbFJ1QjtBQW1SeEIsbUNBQTJCLG1DQUFVLENBQVYsRUFBYTs7QUFFdEMsa0JBQVEsSUFBUixDQUNFLGdHQURGO0FBRUEsaUJBQU8sS0FBSywwQkFBTCxDQUFnQyxDQUFoQyxDQUFQO0FBQ0QsU0F4UnVCO0FBeVJ4QixvQ0FBNEIsb0NBQVUsQ0FBVixFQUFhOztBQUV2QyxjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsY0FBSSxJQUFJLEVBQUUsQ0FBVjtBQUFBLGNBQ0UsSUFDQSxFQUFFLENBRko7QUFBQSxjQUdFLElBQ0EsRUFBRSxDQUpKO0FBQUEsY0FLRSxJQUNBLEVBQUUsQ0FOSjtBQU9BLGNBQUksS0FBSyxJQUFJLENBQWI7QUFBQSxjQUNFLEtBQ0EsSUFDQSxDQUhGO0FBQUEsY0FJRSxLQUNBLElBQ0EsQ0FORjtBQU9BLGNBQUksS0FBSyxJQUFJLEVBQWI7QUFBQSxjQUNFLEtBQ0EsSUFDQSxFQUhGO0FBQUEsY0FJRSxLQUNBLElBQ0EsRUFORjtBQU9BLGNBQUksS0FBSyxJQUFJLEVBQWI7QUFBQSxjQUNFLEtBQ0EsSUFDQSxFQUhGO0FBQUEsY0FJRSxLQUNBLElBQ0EsRUFORjtBQU9BLGNBQUksS0FBSyxJQUFJLEVBQWI7QUFBQSxjQUNFLEtBQ0EsSUFDQSxFQUhGO0FBQUEsY0FJRSxLQUNBLElBQ0EsRUFORjtBQU9BLGFBQUcsQ0FBSCxJQUFRLEtBQUssS0FBSyxFQUFWLENBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxLQUFLLEVBQWI7QUFDQSxhQUFHLENBQUgsSUFBUSxLQUFLLEVBQWI7QUFDQSxhQUFHLENBQUgsSUFBUSxLQUFLLEVBQWI7QUFDQSxhQUFHLENBQUgsSUFBUSxLQUFLLEtBQUssRUFBVixDQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsS0FBSyxFQUFiO0FBQ0EsYUFBRyxDQUFILElBQVEsS0FBSyxFQUFiO0FBQ0EsYUFBRyxDQUFILElBQVEsS0FBSyxFQUFiO0FBQ0EsYUFBRyxFQUFILElBQVMsS0FBSyxLQUFLLEVBQVYsQ0FBVDtBQUNBO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0E7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBVDtBQUNBLGFBQUcsRUFBSCxJQUFTLENBQVQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBbFZ1QjtBQW1WeEIsZ0JBQVEsWUFBWTs7QUFFbEIsY0FBSSxDQUFKLEVBQ0UsQ0FERixFQUVFLENBRkY7QUFHQSxpQkFBTyxVQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLEVBQXZCLEVBQTJCOztBQUVoQyxnQkFBSSxNQUFNLFNBQVYsRUFDRSxJQUFJLElBQUksTUFBTSxPQUFWLEVBQUo7QUFDRixnQkFBSSxNQUFNLFNBQVYsRUFDRSxJQUFJLElBQUksTUFBTSxPQUFWLEVBQUo7QUFDRixnQkFBSSxNQUFNLFNBQVYsRUFDRSxJQUFJLElBQUksTUFBTSxPQUFWLEVBQUo7QUFDRixnQkFBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUUsVUFBRixDQUFhLEdBQWIsRUFBa0IsTUFBbEIsRUFDRyxTQURIO0FBRUEsZ0JBQUksRUFBRSxNQUFGLE9BQWUsQ0FBbkIsRUFBc0I7O0FBRXBCLGdCQUFFLENBQUYsR0FBTSxDQUFOO0FBQ0Q7O0FBRUQsY0FBRSxZQUFGLENBQWUsRUFBZixFQUFtQixDQUFuQixFQUNHLFNBREg7QUFFQSxnQkFBSSxFQUFFLE1BQUYsT0FBZSxDQUFuQixFQUFzQjs7QUFFcEIsZ0JBQUUsQ0FBRixJQUFPLE1BQVA7QUFDQSxnQkFBRSxZQUFGLENBQWUsRUFBZixFQUFtQixDQUFuQixFQUNHLFNBREg7QUFFRDs7QUFFRCxjQUFFLFlBQUYsQ0FBZSxDQUFmLEVBQWtCLENBQWxCO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxDQUFILElBQVEsRUFBRSxDQUFWO0FBQ0EsZUFBRyxFQUFILElBQVMsRUFBRSxDQUFYO0FBQ0EsbUJBQU8sSUFBUDtBQUNELFdBcENEO0FBcUNELFNBMUNPLEVBblZnQjtBQThYeEIsa0JBQVUsa0JBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7O0FBRXhCLGNBQUksTUFBTSxTQUFWLEVBQXFCOztBQUVuQixvQkFBUSxJQUFSLENBQ0Usa0dBREY7QUFFQSxtQkFBTyxLQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLENBQVA7QUFDRDs7QUFFRCxpQkFBTyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLEVBQTRCLENBQTVCLENBQVA7QUFDRCxTQXhZdUI7QUF5WXhCLDBCQUFrQiwwQkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjs7QUFFaEMsY0FBSSxLQUFLLEVBQUUsUUFBWDtBQUNBLGNBQUksS0FBSyxFQUFFLFFBQVg7QUFDQSxjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsQ0FBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsQ0FBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsRUFBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsRUFBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsQ0FBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsQ0FBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsRUFBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsY0FBSSxNQUFNLEdBQUcsQ0FBSCxDQUFWO0FBQUEsY0FDRSxNQUNBLEdBQUcsQ0FBSCxDQUZGO0FBQUEsY0FHRSxNQUNBLEdBQUcsRUFBSCxDQUpGO0FBQUEsY0FLRSxNQUNBLEdBQUcsRUFBSCxDQU5GO0FBT0EsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbEQ7QUFDQSxhQUFHLENBQUgsSUFBUSxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFsRDtBQUNBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQWxEO0FBQ0EsYUFBRyxFQUFILElBQVMsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbkQ7QUFDQSxhQUFHLENBQUgsSUFBUSxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFsRDtBQUNBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQWxEO0FBQ0EsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbEQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFuRDtBQUNBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQWxEO0FBQ0EsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbEQ7QUFDQSxhQUFHLEVBQUgsSUFBUyxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFuRDtBQUNBLGFBQUcsRUFBSCxJQUFTLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQW5EO0FBQ0EsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbEQ7QUFDQSxhQUFHLENBQUgsSUFBUSxNQUFNLEdBQU4sR0FBWSxNQUFNLEdBQWxCLEdBQXdCLE1BQU0sR0FBOUIsR0FBb0MsTUFBTSxHQUFsRDtBQUNBLGFBQUcsRUFBSCxJQUFTLE1BQU0sR0FBTixHQUFZLE1BQU0sR0FBbEIsR0FBd0IsTUFBTSxHQUE5QixHQUFvQyxNQUFNLEdBQW5EO0FBQ0EsYUFBRyxFQUFILElBQVMsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUFsQixHQUF3QixNQUFNLEdBQTlCLEdBQW9DLE1BQU0sR0FBbkQ7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0F2ZHVCO0FBd2R4Qix5QkFBaUIseUJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUI7O0FBRWxDLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxlQUFLLGdCQUFMLENBQXNCLENBQXRCLEVBQXlCLENBQXpCO0FBQ0EsWUFBRSxDQUFGLElBQU8sR0FBRyxDQUFILENBQVA7QUFDQSxZQUFFLENBQUYsSUFBTyxHQUFHLENBQUgsQ0FBUDtBQUNBLFlBQUUsQ0FBRixJQUFPLEdBQUcsQ0FBSCxDQUFQO0FBQ0EsWUFBRSxDQUFGLElBQU8sR0FBRyxDQUFILENBQVA7QUFDQSxZQUFFLENBQUYsSUFBTyxHQUFHLENBQUgsQ0FBUDtBQUNBLFlBQUUsQ0FBRixJQUFPLEdBQUcsQ0FBSCxDQUFQO0FBQ0EsWUFBRSxDQUFGLElBQU8sR0FBRyxDQUFILENBQVA7QUFDQSxZQUFFLENBQUYsSUFBTyxHQUFHLENBQUgsQ0FBUDtBQUNBLFlBQUUsQ0FBRixJQUFPLEdBQUcsQ0FBSCxDQUFQO0FBQ0EsWUFBRSxDQUFGLElBQU8sR0FBRyxDQUFILENBQVA7QUFDQSxZQUFFLEVBQUYsSUFBUSxHQUFHLEVBQUgsQ0FBUjtBQUNBLFlBQUUsRUFBRixJQUFRLEdBQUcsRUFBSCxDQUFSO0FBQ0EsWUFBRSxFQUFGLElBQVEsR0FBRyxFQUFILENBQVI7QUFDQSxZQUFFLEVBQUYsSUFBUSxHQUFHLEVBQUgsQ0FBUjtBQUNBLFlBQUUsRUFBRixJQUFRLEdBQUcsRUFBSCxDQUFSO0FBQ0EsWUFBRSxFQUFGLElBQVEsR0FBRyxFQUFILENBQVI7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0E3ZXVCO0FBOGV4Qix3QkFBZ0Isd0JBQVUsQ0FBVixFQUFhOztBQUUzQixjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLENBQUgsS0FBUyxDQUFUO0FBQ0EsYUFBRyxFQUFILEtBQVUsQ0FBVjtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLENBQUgsS0FBUyxDQUFUO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsRUFBSCxLQUFVLENBQVY7QUFDQSxhQUFHLENBQUgsS0FBUyxDQUFUO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsRUFBSCxLQUFVLENBQVY7QUFDQSxhQUFHLEVBQUgsS0FBVSxDQUFWO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLEVBQUgsS0FBVSxDQUFWO0FBQ0EsYUFBRyxFQUFILEtBQVUsQ0FBVjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQWxnQnVCO0FBbWdCeEIseUJBQWlCLHlCQUFVLE1BQVYsRUFBa0I7O0FBRWpDLGtCQUFRLElBQVIsQ0FDRSxvSUFERjtBQUVBLGlCQUFPLE9BQU8sZUFBUCxDQUF1QixJQUF2QixDQUFQO0FBQ0QsU0F4Z0J1QjtBQXlnQnhCLHlCQUFpQix5QkFBVSxNQUFWLEVBQWtCOztBQUVqQyxrQkFBUSxJQUFSLENBQ0UsZ0dBREY7QUFFQSxpQkFBTyxPQUFPLFlBQVAsQ0FBb0IsSUFBcEIsQ0FBUDtBQUNELFNBOWdCdUI7QUErZ0J4Qiw4QkFBc0IsOEJBQVUsQ0FBVixFQUFhOztBQUVqQyxrQkFBUSxJQUFSLENBQ0UsMkdBREY7QUFFQSxpQkFBTyxLQUFLLG1CQUFMLENBQXlCLENBQXpCLENBQVA7QUFDRCxTQXBoQnVCO0FBcWhCeEIsNkJBQXFCLFlBQVk7O0FBRS9CLGNBQUksRUFBSjtBQUNBLGlCQUFPLFVBQVUsS0FBVixFQUFpQixNQUFqQixFQUF5QixNQUF6QixFQUFpQzs7QUFFdEMsZ0JBQUksT0FBTyxTQUFYLEVBQ0UsS0FBSyxJQUFJLE1BQU0sT0FBVixFQUFMO0FBQ0YsZ0JBQUksV0FBVyxTQUFmLEVBQ0UsU0FBUyxDQUFUO0FBQ0YsZ0JBQUksV0FBVyxTQUFmLEVBQ0UsU0FBUyxNQUFNLE1BQWY7QUFDRixpQkFBSyxJQUFJLElBQUksQ0FBUixFQUNELElBQ0EsTUFGSixFQUVZLElBQ1YsTUFIRixFQUdVLEtBQ1IsQ0FEUSxFQUNMLEtBQ0gsQ0FMRixFQUtLOztBQUVILGlCQUFHLFNBQUgsQ0FBYSxLQUFiLEVBQW9CLENBQXBCO0FBQ0EsaUJBQUcsWUFBSCxDQUFnQixJQUFoQjtBQUNBLGlCQUFHLE9BQUgsQ0FBVyxLQUFYLEVBQWtCLENBQWxCO0FBQ0Q7O0FBRUQsbUJBQU8sS0FBUDtBQUNELFdBckJEO0FBc0JELFNBekJvQixFQXJoQkc7QUEraUJ4Qix1QkFBZSxZQUFZOztBQUV6QixjQUFJLEVBQUo7QUFDQSxpQkFBTyxTQUFTLGFBQVQsQ0FBdUIsTUFBdkIsRUFBK0IsTUFBL0IsRUFBdUMsTUFBdkMsRUFBK0M7O0FBRXBELGdCQUFJLE9BQU8sU0FBWCxFQUNFLEtBQUssSUFBSSxNQUFNLE9BQVYsRUFBTDtBQUNGLGdCQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsQ0FBVDtBQUNGLGdCQUFJLFdBQVcsU0FBZixFQUNFLFNBQVMsT0FBTyxNQUFQLEdBQWdCLE9BQU8sUUFBaEM7QUFDRixpQkFBSyxJQUFJLElBQUksQ0FBUixFQUNELElBQ0EsTUFGSixFQUVZLElBQ1YsTUFIRixFQUdVLEtBQUssR0FIZixFQUdvQjs7QUFFbEIsaUJBQUcsQ0FBSCxHQUFPLE9BQU8sSUFBUCxDQUFZLENBQVosQ0FBUDtBQUNBLGlCQUFHLENBQUgsR0FBTyxPQUFPLElBQVAsQ0FBWSxDQUFaLENBQVA7QUFDQSxpQkFBRyxDQUFILEdBQU8sT0FBTyxJQUFQLENBQVksQ0FBWixDQUFQO0FBQ0EsaUJBQUcsWUFBSCxDQUFnQixJQUFoQjtBQUNBLHFCQUFPLE1BQVAsQ0FBYyxHQUFHLENBQWpCLEVBQW9CLEdBQUcsQ0FBdkIsRUFBMEIsR0FBRyxDQUE3QjtBQUNEOztBQUVELG1CQUFPLE1BQVA7QUFDRCxXQXJCRDtBQXNCRCxTQXpCYyxFQS9pQlM7QUF5a0J4QixvQkFBWSxvQkFBVSxDQUFWLEVBQWE7O0FBRXZCLGtCQUFRLElBQVIsQ0FDRSxrR0FERjtBQUVBLFlBQUUsa0JBQUYsQ0FBcUIsSUFBckI7QUFDRCxTQTlrQnVCO0FBK2tCeEIscUJBQWEscUJBQVUsTUFBVixFQUFrQjs7QUFFN0Isa0JBQVEsSUFBUixDQUNFLDRGQURGO0FBRUEsaUJBQU8sT0FBTyxZQUFQLENBQW9CLElBQXBCLENBQVA7QUFDRCxTQXBsQnVCO0FBcWxCeEIscUJBQWEsdUJBQVk7O0FBRXZCLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxDQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxDQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxFQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxFQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQTtBQUNBOztBQUVBLGlCQUNFLE9BQU8sQ0FBQyxHQUFELEdBQU8sR0FBUCxHQUFhLEdBQWIsR0FDTCxNQUFNLEdBQU4sR0FBWSxHQURQLEdBRUwsTUFBTSxHQUFOLEdBQVksR0FGUCxHQUdMLE1BQU0sR0FBTixHQUFZLEdBSFAsR0FJTCxNQUFNLEdBQU4sR0FBWSxHQUpQLEdBS0wsTUFBTSxHQUFOLEdBQVksR0FMZCxJQU9BLE9BQU8sQ0FBQyxHQUFELEdBQU8sR0FBUCxHQUFhLEdBQWIsR0FDTCxNQUFNLEdBQU4sR0FBWSxHQURQLEdBRUwsTUFBTSxHQUFOLEdBQVksR0FGUCxHQUdMLE1BQU0sR0FBTixHQUFZLEdBSFAsR0FJTCxNQUFNLEdBQU4sR0FBWSxHQUpQLEdBS0wsTUFBTSxHQUFOLEdBQVksR0FMZCxDQVBBLEdBY0EsT0FBTyxDQUFDLEdBQUQsR0FBTyxHQUFQLEdBQWEsR0FBYixHQUNMLE1BQU0sR0FBTixHQUFZLEdBRFAsR0FFTCxNQUFNLEdBQU4sR0FBWSxHQUZQLEdBR0wsTUFBTSxHQUFOLEdBQVksR0FIUCxHQUlMLE1BQU0sR0FBTixHQUFZLEdBSlAsR0FLTCxNQUFNLEdBQU4sR0FBWSxHQUxkLENBZEEsR0FxQkEsT0FBTyxDQUFDLEdBQUQsR0FBTyxHQUFQLEdBQWEsR0FBYixHQUNMLE1BQU0sR0FBTixHQUFZLEdBRFAsR0FFTCxNQUFNLEdBQU4sR0FBWSxHQUZQLEdBR0wsTUFBTSxHQUFOLEdBQVksR0FIUCxHQUlMLE1BQU0sR0FBTixHQUFZLEdBSlAsR0FLTCxNQUFNLEdBQU4sR0FBWSxHQUxkLENBdEJGO0FBK0JELFNBdHBCdUI7QUF1cEJ4QixtQkFBVyxxQkFBWTs7QUFFckIsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUksR0FBSjtBQUNBLGdCQUFNLEdBQUcsQ0FBSCxDQUFOO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBRyxDQUFILENBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFSO0FBQ0EsZ0JBQU0sR0FBRyxDQUFILENBQU47QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLEdBQVI7QUFDQSxnQkFBTSxHQUFHLENBQUgsQ0FBTjtBQUNBLGFBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxDQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBUjtBQUNBLGdCQUFNLEdBQUcsQ0FBSCxDQUFOO0FBQ0EsYUFBRyxDQUFILElBQVEsR0FBRyxFQUFILENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxHQUFUO0FBQ0EsZ0JBQU0sR0FBRyxDQUFILENBQU47QUFDQSxhQUFHLENBQUgsSUFBUSxHQUFHLEVBQUgsQ0FBUjtBQUNBLGFBQUcsRUFBSCxJQUFTLEdBQVQ7QUFDQSxnQkFBTSxHQUFHLEVBQUgsQ0FBTjtBQUNBLGFBQUcsRUFBSCxJQUFTLEdBQUcsRUFBSCxDQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsR0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQTlxQnVCO0FBK3FCeEIsOEJBQXNCLDhCQUFVLEtBQVYsRUFBaUIsTUFBakIsRUFBeUI7O0FBRTdDLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxnQkFBTSxNQUFOLElBQWdCLEdBQUcsQ0FBSCxDQUFoQjtBQUNBLGdCQUFNLFNBQVMsQ0FBZixJQUFvQixHQUFHLENBQUgsQ0FBcEI7QUFDQSxnQkFBTSxTQUFTLENBQWYsSUFBb0IsR0FBRyxDQUFILENBQXBCO0FBQ0EsZ0JBQU0sU0FBUyxDQUFmLElBQW9CLEdBQUcsQ0FBSCxDQUFwQjtBQUNBLGdCQUFNLFNBQVMsQ0FBZixJQUFvQixHQUFHLENBQUgsQ0FBcEI7QUFDQSxnQkFBTSxTQUFTLENBQWYsSUFBb0IsR0FBRyxDQUFILENBQXBCO0FBQ0EsZ0JBQU0sU0FBUyxDQUFmLElBQW9CLEdBQUcsQ0FBSCxDQUFwQjtBQUNBLGdCQUFNLFNBQVMsQ0FBZixJQUFvQixHQUFHLENBQUgsQ0FBcEI7QUFDQSxnQkFBTSxTQUFTLENBQWYsSUFBb0IsR0FBRyxDQUFILENBQXBCO0FBQ0EsZ0JBQU0sU0FBUyxDQUFmLElBQW9CLEdBQUcsQ0FBSCxDQUFwQjtBQUNBLGdCQUFNLFNBQVMsRUFBZixJQUFxQixHQUFHLEVBQUgsQ0FBckI7QUFDQSxnQkFBTSxTQUFTLEVBQWYsSUFBcUIsR0FBRyxFQUFILENBQXJCO0FBQ0EsZ0JBQU0sU0FBUyxFQUFmLElBQXFCLEdBQUcsRUFBSCxDQUFyQjtBQUNBLGdCQUFNLFNBQVMsRUFBZixJQUFxQixHQUFHLEVBQUgsQ0FBckI7QUFDQSxnQkFBTSxTQUFTLEVBQWYsSUFBcUIsR0FBRyxFQUFILENBQXJCO0FBQ0EsZ0JBQU0sU0FBUyxFQUFmLElBQXFCLEdBQUcsRUFBSCxDQUFyQjtBQUNBLGlCQUFPLEtBQVA7QUFDRCxTQW5zQnVCO0FBb3NCeEIscUJBQWEsWUFBWTs7QUFFdkIsY0FBSSxFQUFKO0FBQ0EsaUJBQU8sWUFBWTs7QUFFakIsZ0JBQUksT0FBTyxTQUFYLEVBQ0UsS0FBSyxJQUFJLE1BQU0sT0FBVixFQUFMO0FBQ0Ysb0JBQVEsSUFBUixDQUNFLHNHQURGO0FBRUEsZ0JBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxtQkFBTyxHQUFHLEdBQUgsQ0FBTyxHQUFHLEVBQUgsQ0FBUCxFQUFlLEdBQUcsRUFBSCxDQUFmLEVBQXVCLEdBQUcsRUFBSCxDQUF2QixDQUFQO0FBQ0QsV0FSRDtBQVNELFNBWlksRUFwc0JXO0FBaXRCeEIscUJBQWEscUJBQVUsQ0FBVixFQUFhOztBQUV4QixjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsYUFBRyxFQUFILElBQVMsRUFBRSxDQUFYO0FBQ0EsYUFBRyxFQUFILElBQVMsRUFBRSxDQUFYO0FBQ0EsYUFBRyxFQUFILElBQVMsRUFBRSxDQUFYO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBeHRCdUI7QUF5dEJ4QixvQkFBWSxvQkFBVSxDQUFWLEVBQWEsaUJBQWIsRUFBZ0M7O0FBRTFDO0FBQ0EsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUksS0FBSyxFQUFFLFFBQVg7QUFDQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxDQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxDQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxFQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxjQUFJLE1BQU0sR0FBRyxDQUFILENBQVY7QUFBQSxjQUNFLE1BQ0EsR0FBRyxDQUFILENBRkY7QUFBQSxjQUdFLE1BQ0EsR0FBRyxFQUFILENBSkY7QUFBQSxjQUtFLE1BQ0EsR0FBRyxFQUFILENBTkY7QUFPQSxhQUFHLENBQUgsSUFBUSxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLE1BQU0sR0FBTixHQUFZLEdBQTlCLEdBQW9DLE1BQU0sR0FBTixHQUFZLEdBQWhELEdBQXNELE1BQzVELEdBRDRELEdBQ3RELEdBREEsR0FDTSxNQUFNLEdBQU4sR0FBWSxHQURsQixHQUN3QixNQUFNLEdBQU4sR0FBWSxHQUQ1QztBQUVBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLEdBQVosR0FBa0IsTUFBTSxHQUFOLEdBQVksR0FBOUIsR0FBb0MsTUFBTSxHQUFOLEdBQVksR0FBaEQsR0FBc0QsTUFDNUQsR0FENEQsR0FDdEQsR0FEQSxHQUNNLE1BQU0sR0FBTixHQUFZLEdBRGxCLEdBQ3dCLE1BQU0sR0FBTixHQUFZLEdBRDVDO0FBRUEsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUFzRCxNQUM1RCxHQUQ0RCxHQUN0RCxHQURBLEdBQ00sTUFBTSxHQUFOLEdBQVksR0FEbEIsR0FDd0IsTUFBTSxHQUFOLEdBQVksR0FENUM7QUFFQSxhQUFHLEVBQUgsSUFBUyxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLE1BQU0sR0FBTixHQUFZLEdBQTlCLEdBQW9DLE1BQU0sR0FBTixHQUFZLEdBQWhELEdBQ1AsTUFBTSxHQUFOLEdBQVksR0FETCxHQUNXLE1BQU0sR0FBTixHQUFZLEdBRHZCLEdBQzZCLE1BQU0sR0FBTixHQUFZLEdBRGxEO0FBRUEsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUFzRCxNQUM1RCxHQUQ0RCxHQUN0RCxHQURBLEdBQ00sTUFBTSxHQUFOLEdBQVksR0FEbEIsR0FDd0IsTUFBTSxHQUFOLEdBQVksR0FENUM7QUFFQSxhQUFHLENBQUgsSUFBUSxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLE1BQU0sR0FBTixHQUFZLEdBQTlCLEdBQW9DLE1BQU0sR0FBTixHQUFZLEdBQWhELEdBQXNELE1BQzVELEdBRDRELEdBQ3RELEdBREEsR0FDTSxNQUFNLEdBQU4sR0FBWSxHQURsQixHQUN3QixNQUFNLEdBQU4sR0FBWSxHQUQ1QztBQUVBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLEdBQVosR0FBa0IsTUFBTSxHQUFOLEdBQVksR0FBOUIsR0FBb0MsTUFBTSxHQUFOLEdBQVksR0FBaEQsR0FBc0QsTUFDNUQsR0FENEQsR0FDdEQsR0FEQSxHQUNNLE1BQU0sR0FBTixHQUFZLEdBRGxCLEdBQ3dCLE1BQU0sR0FBTixHQUFZLEdBRDVDO0FBRUEsYUFBRyxFQUFILElBQVMsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUNQLE1BQU0sR0FBTixHQUFZLEdBREwsR0FDVyxNQUFNLEdBQU4sR0FBWSxHQUR2QixHQUM2QixNQUFNLEdBQU4sR0FBWSxHQURsRDtBQUVBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLEdBQVosR0FBa0IsTUFBTSxHQUFOLEdBQVksR0FBOUIsR0FBb0MsTUFBTSxHQUFOLEdBQVksR0FBaEQsR0FBc0QsTUFDNUQsR0FENEQsR0FDdEQsR0FEQSxHQUNNLE1BQU0sR0FBTixHQUFZLEdBRGxCLEdBQ3dCLE1BQU0sR0FBTixHQUFZLEdBRDVDO0FBRUEsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUFzRCxNQUM1RCxHQUQ0RCxHQUN0RCxHQURBLEdBQ00sTUFBTSxHQUFOLEdBQVksR0FEbEIsR0FDd0IsTUFBTSxHQUFOLEdBQVksR0FENUM7QUFFQSxhQUFHLEVBQUgsSUFBUyxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLE1BQU0sR0FBTixHQUFZLEdBQTlCLEdBQW9DLE1BQU0sR0FBTixHQUFZLEdBQWhELEdBQ1AsTUFBTSxHQUFOLEdBQVksR0FETCxHQUNXLE1BQU0sR0FBTixHQUFZLEdBRHZCLEdBQzZCLE1BQU0sR0FBTixHQUFZLEdBRGxEO0FBRUEsYUFBRyxFQUFILElBQVMsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUNQLE1BQU0sR0FBTixHQUFZLEdBREwsR0FDVyxNQUFNLEdBQU4sR0FBWSxHQUR2QixHQUM2QixNQUFNLEdBQU4sR0FBWSxHQURsRDtBQUVBLGFBQUcsQ0FBSCxJQUFRLE1BQU0sR0FBTixHQUFZLEdBQVosR0FBa0IsTUFBTSxHQUFOLEdBQVksR0FBOUIsR0FBb0MsTUFBTSxHQUFOLEdBQVksR0FBaEQsR0FBc0QsTUFDNUQsR0FENEQsR0FDdEQsR0FEQSxHQUNNLE1BQU0sR0FBTixHQUFZLEdBRGxCLEdBQ3dCLE1BQU0sR0FBTixHQUFZLEdBRDVDO0FBRUEsYUFBRyxDQUFILElBQVEsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUFzRCxNQUM1RCxHQUQ0RCxHQUN0RCxHQURBLEdBQ00sTUFBTSxHQUFOLEdBQVksR0FEbEIsR0FDd0IsTUFBTSxHQUFOLEdBQVksR0FENUM7QUFFQSxhQUFHLEVBQUgsSUFBUyxNQUFNLEdBQU4sR0FBWSxHQUFaLEdBQWtCLE1BQU0sR0FBTixHQUFZLEdBQTlCLEdBQW9DLE1BQU0sR0FBTixHQUFZLEdBQWhELEdBQ1AsTUFBTSxHQUFOLEdBQVksR0FETCxHQUNXLE1BQU0sR0FBTixHQUFZLEdBRHZCLEdBQzZCLE1BQU0sR0FBTixHQUFZLEdBRGxEO0FBRUEsYUFBRyxFQUFILElBQVMsTUFBTSxHQUFOLEdBQVksR0FBWixHQUFrQixNQUFNLEdBQU4sR0FBWSxHQUE5QixHQUFvQyxNQUFNLEdBQU4sR0FBWSxHQUFoRCxHQUNQLE1BQU0sR0FBTixHQUFZLEdBREwsR0FDVyxNQUFNLEdBQU4sR0FBWSxHQUR2QixHQUM2QixNQUFNLEdBQU4sR0FBWSxHQURsRDtBQUVBLGNBQUksTUFBTSxNQUFNLEdBQUcsQ0FBSCxDQUFOLEdBQWMsTUFBTSxHQUFHLENBQUgsQ0FBcEIsR0FBNEIsTUFBTSxHQUFHLENBQUgsQ0FBbEMsR0FBMEMsTUFDbEQsR0FBRyxFQUFILENBREY7QUFFQSxjQUFJLFFBQVEsQ0FBWixFQUFlOztBQUViLGdCQUFJLE1BQ0YsbUVBREY7QUFFQSxnQkFBSSxxQkFBcUIsS0FBekIsRUFBZ0M7O0FBRTlCLG9CQUFNLElBQUksS0FBSixDQUFVLEdBQVYsQ0FBTjtBQUNELGFBSEQsTUFJSzs7QUFFSCxzQkFBUSxJQUFSLENBQWEsR0FBYjtBQUNEOztBQUVELGlCQUFLLFFBQUw7QUFDQSxtQkFBTyxJQUFQO0FBQ0Q7O0FBRUQsZUFBSyxjQUFMLENBQW9CLElBQUksR0FBeEI7QUFDQSxpQkFBTyxJQUFQO0FBQ0QsU0EveUJ1QjtBQWd6QnhCLG1CQUFXLG1CQUFVLENBQVYsRUFBYTs7QUFFdEIsa0JBQVEsS0FBUixDQUFjLCtDQUFkO0FBQ0QsU0FuekJ1QjtBQW96QnhCLGlCQUFTLGlCQUFVLEtBQVYsRUFBaUI7O0FBRXhCLGtCQUFRLEtBQVIsQ0FBYyw2Q0FBZDtBQUNELFNBdnpCdUI7QUF3ekJ4QixpQkFBUyxpQkFBVSxLQUFWLEVBQWlCOztBQUV4QixrQkFBUSxLQUFSLENBQWMsNkNBQWQ7QUFDRCxTQTN6QnVCO0FBNHpCeEIsaUJBQVMsaUJBQVUsS0FBVixFQUFpQjs7QUFFeEIsa0JBQVEsS0FBUixDQUFjLDZDQUFkO0FBQ0QsU0EvekJ1QjtBQWcwQnhCLHNCQUFjLHNCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUI7O0FBRW5DLGtCQUFRLEtBQVIsQ0FBYyxrREFBZDtBQUNELFNBbjBCdUI7QUFvMEJ4QixlQUFPLGVBQVUsQ0FBVixFQUFhOztBQUVsQixjQUFJLEtBQUssS0FBSyxRQUFkO0FBQ0EsY0FBSSxJQUFJLEVBQUUsQ0FBVjtBQUFBLGNBQ0UsSUFDQSxFQUFFLENBRko7QUFBQSxjQUdFLElBQ0EsRUFBRSxDQUpKO0FBS0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLENBQUgsS0FBUyxDQUFUO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLENBQUgsS0FBUyxDQUFUO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLEVBQUgsS0FBVSxDQUFWO0FBQ0EsYUFBRyxDQUFILEtBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxLQUFTLENBQVQ7QUFDQSxhQUFHLEVBQUgsS0FBVSxDQUFWO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBejFCdUI7QUEwMUJ4QiwyQkFBbUIsNkJBQVk7O0FBRTdCLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxjQUFJLFdBQVcsR0FBRyxDQUFILElBQVEsR0FBRyxDQUFILENBQVIsR0FBZ0IsR0FBRyxDQUFILElBQVEsR0FBRyxDQUFILENBQXhCLEdBQWdDLEdBQUcsQ0FBSCxJQUM3QyxHQUFHLENBQUgsQ0FERjtBQUVBLGNBQUksV0FBVyxHQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBUixHQUFnQixHQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBeEIsR0FBZ0MsR0FBRyxDQUFILElBQzdDLEdBQUcsQ0FBSCxDQURGO0FBRUEsY0FBSSxXQUFXLEdBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxDQUFSLEdBQWdCLEdBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxDQUF4QixHQUFnQyxHQUFHLEVBQUgsSUFDN0MsR0FBRyxFQUFILENBREY7QUFFQSxpQkFBTyxLQUFLLElBQUwsQ0FBVSxLQUFLLEdBQUwsQ0FBUyxRQUFULEVBQW1CLEtBQUssR0FBTCxDQUFTLFFBQVQsRUFDbEMsUUFEa0MsQ0FBbkIsQ0FBVixDQUFQO0FBRUQsU0FyMkJ1QjtBQXMyQnhCLHlCQUFpQix5QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQjs7QUFFbEMsZUFBSyxHQUFMLENBQ0UsQ0FERixFQUNLLENBREwsRUFDUSxDQURSLEVBQ1csQ0FEWCxFQUVFLENBRkYsRUFFSyxDQUZMLEVBRVEsQ0FGUixFQUVXLENBRlgsRUFHRSxDQUhGLEVBR0ssQ0FITCxFQUdRLENBSFIsRUFHVyxDQUhYLEVBSUUsQ0FKRixFQUlLLENBSkwsRUFJUSxDQUpSLEVBSVcsQ0FKWDtBQU9BLGlCQUFPLElBQVA7QUFDRCxTQWgzQnVCO0FBaTNCeEIsdUJBQWUsdUJBQVUsS0FBVixFQUFpQjs7QUFFOUIsY0FBSSxJQUFJLEtBQUssR0FBTCxDQUFTLEtBQVQsQ0FBUjtBQUFBLGNBQ0UsSUFDQSxLQUFLLEdBQUwsQ0FDRSxLQURGLENBRkY7QUFJQSxlQUFLLEdBQUwsQ0FDRSxDQURGLEVBQ0ssQ0FETCxFQUNRLENBRFIsRUFDVyxDQURYLEVBRUUsQ0FGRixFQUVLLENBRkwsRUFFUSxDQUFDLENBRlQsRUFFWSxDQUZaLEVBR0UsQ0FIRixFQUdLLENBSEwsRUFHUSxDQUhSLEVBR1csQ0FIWCxFQUlFLENBSkYsRUFJSyxDQUpMLEVBSVEsQ0FKUixFQUlXLENBSlg7QUFPQSxpQkFBTyxJQUFQO0FBQ0QsU0EvM0J1QjtBQWc0QnhCLHVCQUFlLHVCQUFVLEtBQVYsRUFBaUI7O0FBRTlCLGNBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQVI7QUFBQSxjQUNFLElBQ0EsS0FBSyxHQUFMLENBQ0UsS0FERixDQUZGO0FBSUEsZUFBSyxHQUFMLENBQ0UsQ0FERixFQUNLLENBREwsRUFDUSxDQURSLEVBQ1csQ0FEWCxFQUVFLENBRkYsRUFFSyxDQUZMLEVBRVEsQ0FGUixFQUVXLENBRlgsRUFFYyxDQUFDLENBRmYsRUFFa0IsQ0FGbEIsRUFFcUIsQ0FGckIsRUFFd0IsQ0FGeEIsRUFHRSxDQUhGLEVBR0ssQ0FITCxFQUdRLENBSFIsRUFHVyxDQUhYO0FBTUEsaUJBQU8sSUFBUDtBQUNELFNBNzRCdUI7QUE4NEJ4Qix1QkFBZSx1QkFBVSxLQUFWLEVBQWlCOztBQUU5QixjQUFJLElBQUksS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFSO0FBQUEsY0FDRSxJQUNBLEtBQUssR0FBTCxDQUNFLEtBREYsQ0FGRjtBQUlBLGVBQUssR0FBTCxDQUNFLENBREYsRUFDSyxDQUFDLENBRE4sRUFDUyxDQURULEVBQ1ksQ0FEWixFQUVFLENBRkYsRUFFSyxDQUZMLEVBRVEsQ0FGUixFQUVXLENBRlgsRUFHRSxDQUhGLEVBR0ssQ0FITCxFQUdRLENBSFIsRUFHVyxDQUhYLEVBSUUsQ0FKRixFQUlLLENBSkwsRUFJUSxDQUpSLEVBSVcsQ0FKWDtBQU9BLGlCQUFPLElBQVA7QUFDRCxTQTU1QnVCO0FBNjVCeEIsMEJBQWtCLDBCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUI7O0FBRXZDOztBQUVBLGNBQUksSUFBSSxLQUFLLEdBQUwsQ0FBUyxLQUFULENBQVI7QUFDQSxjQUFJLElBQUksS0FBSyxHQUFMLENBQVMsS0FBVCxDQUFSO0FBQ0EsY0FBSSxJQUFJLElBQUksQ0FBWjtBQUNBLGNBQUksSUFBSSxLQUFLLENBQWI7QUFBQSxjQUNFLElBQ0EsS0FBSyxDQUZQO0FBQUEsY0FHRSxJQUNBLEtBQUssQ0FKUDtBQUtBLGNBQUksS0FBSyxJQUFJLENBQWI7QUFBQSxjQUNFLEtBQ0EsSUFDQSxDQUhGO0FBSUEsZUFBSyxHQUFMLENBQ0UsS0FBSyxDQUFMLEdBQVMsQ0FEWCxFQUNjLEtBQUssQ0FBTCxHQUFTLElBQUksQ0FEM0IsRUFDOEIsS0FBSyxDQUFMLEdBQVMsSUFBSSxDQUQzQyxFQUM4QyxDQUQ5QyxFQUVFLEtBQUssQ0FBTCxHQUFTLElBQUksQ0FGZixFQUVrQixLQUFLLENBQUwsR0FBUyxDQUYzQixFQUU4QixLQUFLLENBQUwsR0FBUyxJQUFJLENBRjNDLEVBRThDLENBRjlDLEVBR0UsS0FBSyxDQUFMLEdBQVMsSUFBSSxDQUhmLEVBR2tCLEtBQUssQ0FBTCxHQUFTLElBQUksQ0FIL0IsRUFHa0MsSUFBSSxDQUFKLEdBQVEsQ0FBUixHQUFZLENBSDlDLEVBR2lELENBSGpELEVBSUUsQ0FKRixFQUlLLENBSkwsRUFJUSxDQUpSLEVBSVcsQ0FKWDtBQU9BLGlCQUFPLElBQVA7QUFDRCxTQXI3QnVCO0FBczdCeEIsbUJBQVcsbUJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUI7O0FBRTVCLGVBQUssR0FBTCxDQUNFLENBREYsRUFDSyxDQURMLEVBQ1EsQ0FEUixFQUNXLENBRFgsRUFFRSxDQUZGLEVBRUssQ0FGTCxFQUVRLENBRlIsRUFFVyxDQUZYLEVBR0UsQ0FIRixFQUdLLENBSEwsRUFHUSxDQUhSLEVBR1csQ0FIWCxFQUlFLENBSkYsRUFJSyxDQUpMLEVBSVEsQ0FKUixFQUlXLENBSlg7QUFPQSxpQkFBTyxJQUFQO0FBQ0QsU0FoOEJ1QjtBQWk4QnhCLGlCQUFTLGlCQUFVLFFBQVYsRUFBb0IsVUFBcEIsRUFBZ0MsS0FBaEMsRUFBdUM7O0FBRTlDLGVBQUssMEJBQUwsQ0FBZ0MsVUFBaEM7QUFDQSxlQUFLLEtBQUwsQ0FBVyxLQUFYO0FBQ0EsZUFBSyxXQUFMLENBQWlCLFFBQWpCO0FBQ0EsaUJBQU8sSUFBUDtBQUNELFNBdjhCdUI7QUF3OEJ4QixtQkFBVyxZQUFZOztBQUVyQixjQUFJLE1BQUosRUFDRSxNQURGO0FBRUEsaUJBQU8sVUFBVSxRQUFWLEVBQW9CLFVBQXBCLEVBQWdDLEtBQWhDLEVBQXVDOztBQUU1QyxnQkFBSSxXQUFXLFNBQWYsRUFDRSxTQUFTLElBQUksTUFBTSxPQUFWLEVBQVQ7QUFDRixnQkFBSSxXQUFXLFNBQWYsRUFDRSxTQUFTLElBQUksTUFBTSxPQUFWLEVBQVQ7QUFDRixnQkFBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGdCQUFJLEtBQUssT0FBTyxHQUFQLENBQVcsR0FBRyxDQUFILENBQVgsRUFBa0IsR0FBRyxDQUFILENBQWxCLEVBQXlCLEdBQUcsQ0FBSCxDQUF6QixFQUNOLE1BRE0sRUFBVDtBQUVBLGdCQUFJLEtBQUssT0FBTyxHQUFQLENBQVcsR0FBRyxDQUFILENBQVgsRUFBa0IsR0FBRyxDQUFILENBQWxCLEVBQXlCLEdBQUcsQ0FBSCxDQUF6QixFQUNOLE1BRE0sRUFBVDtBQUVBLGdCQUFJLEtBQUssT0FBTyxHQUFQLENBQVcsR0FBRyxDQUFILENBQVgsRUFBa0IsR0FBRyxDQUFILENBQWxCLEVBQXlCLEdBQUcsRUFBSCxDQUF6QixFQUNOLE1BRE0sRUFBVDtBQUVBO0FBQ0EsZ0JBQUksTUFBTSxLQUFLLFdBQUwsRUFBVjtBQUNBLGdCQUFJLE1BQU0sQ0FBVixFQUFhOztBQUVYLG1CQUFLLENBQUMsRUFBTjtBQUNEOztBQUVELHFCQUFTLENBQVQsR0FBYSxHQUFHLEVBQUgsQ0FBYjtBQUNBLHFCQUFTLENBQVQsR0FBYSxHQUFHLEVBQUgsQ0FBYjtBQUNBLHFCQUFTLENBQVQsR0FBYSxHQUFHLEVBQUgsQ0FBYjtBQUNBOztBQUVBLG1CQUFPLFFBQVAsQ0FBZ0IsR0FBaEIsQ0FDRSxLQUFLLFFBRFAsRUF6QjRDLENBMEIxQjs7QUFFbEIsZ0JBQUksUUFBUSxJQUFJLEVBQWhCO0FBQ0EsZ0JBQUksUUFBUSxJQUFJLEVBQWhCO0FBQ0EsZ0JBQUksUUFBUSxJQUFJLEVBQWhCO0FBQ0EsbUJBQU8sUUFBUCxDQUFnQixDQUFoQixLQUFzQixLQUF0QjtBQUNBLG1CQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsS0FBc0IsS0FBdEI7QUFDQSxtQkFBTyxRQUFQLENBQWdCLENBQWhCLEtBQXNCLEtBQXRCO0FBQ0EsbUJBQU8sUUFBUCxDQUFnQixDQUFoQixLQUFzQixLQUF0QjtBQUNBLG1CQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsS0FBc0IsS0FBdEI7QUFDQSxtQkFBTyxRQUFQLENBQWdCLENBQWhCLEtBQXNCLEtBQXRCO0FBQ0EsbUJBQU8sUUFBUCxDQUFnQixDQUFoQixLQUFzQixLQUF0QjtBQUNBLG1CQUFPLFFBQVAsQ0FBZ0IsQ0FBaEIsS0FBc0IsS0FBdEI7QUFDQSxtQkFBTyxRQUFQLENBQWdCLEVBQWhCLEtBQXVCLEtBQXZCO0FBQ0EsdUJBQVcscUJBQVgsQ0FBaUMsTUFBakM7QUFDQSxrQkFBTSxDQUFOLEdBQVUsRUFBVjtBQUNBLGtCQUFNLENBQU4sR0FBVSxFQUFWO0FBQ0Esa0JBQU0sQ0FBTixHQUFVLEVBQVY7QUFDQSxtQkFBTyxJQUFQO0FBQ0QsV0E3Q0Q7QUE4Q0QsU0FsRFUsRUF4OEJhO0FBMi9CeEIscUJBQWEscUJBQVUsSUFBVixFQUFnQixLQUFoQixFQUF1QixNQUF2QixFQUErQixHQUEvQixFQUFvQyxJQUFwQyxFQUEwQyxHQUExQyxFQUErQzs7QUFFMUQsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUksSUFBSSxJQUFJLElBQUosSUFBWSxRQUFRLElBQXBCLENBQVI7QUFDQSxjQUFJLElBQUksSUFBSSxJQUFKLElBQVksTUFBTSxNQUFsQixDQUFSO0FBQ0EsY0FBSSxJQUFJLENBQUMsUUFBUSxJQUFULEtBQWtCLFFBQVEsSUFBMUIsQ0FBUjtBQUNBLGNBQUksSUFBSSxDQUFDLE1BQU0sTUFBUCxLQUFrQixNQUFNLE1BQXhCLENBQVI7QUFDQSxjQUFJLElBQUksRUFBRSxNQUFNLElBQVIsS0FBaUIsTUFBTSxJQUF2QixDQUFSO0FBQ0EsY0FBSSxJQUFJLENBQUMsQ0FBRCxHQUFLLEdBQUwsR0FBVyxJQUFYLElBQW1CLE1BQU0sSUFBekIsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsRUFBSCxJQUFTLENBQVQ7QUFDQSxhQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBVDtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBQyxDQUFWO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXJoQ3VCO0FBc2hDeEIseUJBQWlCLHlCQUFVLEdBQVYsRUFBZSxNQUFmLEVBQXVCLElBQXZCLEVBQTZCLEdBQTdCLEVBQWtDOztBQUVqRCxjQUFJLE9BQU8sT0FBTyxLQUFLLEdBQUwsQ0FBUyxNQUFNLElBQU4sQ0FBVyxRQUFYLENBQW9CLE1BQU0sR0FBMUIsQ0FBVCxDQUFsQjtBQUNBLGNBQUksT0FBTyxDQUFDLElBQVo7QUFDQSxjQUFJLE9BQU8sT0FBTyxNQUFsQjtBQUNBLGNBQUksT0FBTyxPQUFPLE1BQWxCO0FBQ0EsaUJBQU8sS0FBSyxXQUFMLENBQWlCLElBQWpCLEVBQXVCLElBQXZCLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLEdBQS9DLENBQVA7QUFDRCxTQTdoQ3VCO0FBOGhDeEIsMEJBQWtCLDBCQUFVLElBQVYsRUFBZ0IsS0FBaEIsRUFBdUIsR0FBdkIsRUFBNEIsTUFBNUIsRUFBb0MsSUFBcEMsRUFBMEMsR0FBMUMsRUFBK0M7O0FBRS9ELGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxjQUFJLElBQUksUUFBUSxJQUFoQjtBQUNBLGNBQUksSUFBSSxNQUFNLE1BQWQ7QUFDQSxjQUFJLElBQUksTUFBTSxJQUFkO0FBQ0EsY0FBSSxJQUFJLENBQUMsUUFBUSxJQUFULElBQWlCLENBQXpCO0FBQ0EsY0FBSSxJQUFJLENBQUMsTUFBTSxNQUFQLElBQWlCLENBQXpCO0FBQ0EsY0FBSSxJQUFJLENBQUMsTUFBTSxJQUFQLElBQWUsQ0FBdkI7QUFDQSxhQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxhQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsRUFBSCxJQUFTLENBQUMsQ0FBVjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLENBQUgsSUFBUSxJQUFJLENBQVo7QUFDQSxhQUFHLENBQUgsSUFBUSxDQUFSO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBQyxDQUFWO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFDLENBQUQsR0FBSyxDQUFkO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBQyxDQUFWO0FBQ0EsYUFBRyxDQUFILElBQVEsQ0FBUjtBQUNBLGFBQUcsQ0FBSCxJQUFRLENBQVI7QUFDQSxhQUFHLEVBQUgsSUFBUyxDQUFUO0FBQ0EsYUFBRyxFQUFILElBQVMsQ0FBVDtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXhqQ3VCO0FBeWpDeEIsZ0JBQVEsZ0JBQVUsTUFBVixFQUFrQjs7QUFFeEIsY0FBSSxLQUFLLEtBQUssUUFBZDtBQUNBLGNBQUksS0FBSyxPQUFPLFFBQWhCO0FBQ0EsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQXBCLEVBQXdCLEdBQXhCLEVBQTZCOztBQUUzQixnQkFBSSxHQUFHLENBQUgsTUFBVSxHQUFHLENBQUgsQ0FBZCxFQUNFLE9BQU8sS0FBUDtBQUNIOztBQUVELGlCQUFPLElBQVA7QUFDRCxTQXBrQ3VCO0FBcWtDeEIsbUJBQVcsbUJBQVUsS0FBVixFQUFpQjs7QUFFMUIsZUFBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixLQUFsQjtBQUNBLGlCQUFPLElBQVA7QUFDRCxTQXprQ3VCO0FBMGtDeEIsaUJBQVMsbUJBQVk7O0FBRW5CLGNBQUksS0FBSyxLQUFLLFFBQWQ7QUFDQSxpQkFBTyxDQUNMLEdBQUcsQ0FBSCxDQURLLEVBQ0UsR0FBRyxDQUFILENBREYsRUFDUyxHQUFHLENBQUgsQ0FEVCxFQUNnQixHQUFHLENBQUgsQ0FEaEIsRUFFTCxHQUFHLENBQUgsQ0FGSyxFQUVFLEdBQUcsQ0FBSCxDQUZGLEVBRVMsR0FBRyxDQUFILENBRlQsRUFFZ0IsR0FBRyxDQUFILENBRmhCLEVBR0wsR0FBRyxDQUFILENBSEssRUFHRSxHQUFHLENBQUgsQ0FIRixFQUdTLEdBQUcsRUFBSCxDQUhULEVBR2lCLEdBQUcsRUFBSCxDQUhqQixFQUlMLEdBQUcsRUFBSCxDQUpLLEVBSUcsR0FBRyxFQUFILENBSkgsRUFJVyxHQUFHLEVBQUgsQ0FKWCxFQUltQixHQUFHLEVBQUgsQ0FKbkIsQ0FBUDtBQU1EOztBQW5sQ3VCLE9BQTFCO0FBc2xDQTs7Ozs7QUFLQSxZQUFNLElBQU4sR0FBYTtBQUNYLHNCQUFjLFlBQVk7O0FBRXhCOztBQUVBLGNBQUksUUFDRixpRUFBaUUsS0FBakUsQ0FDRSxFQURGLENBREY7QUFHQSxjQUFJLE9BQU8sSUFBSSxLQUFKLENBQVUsRUFBVixDQUFYO0FBQ0EsY0FBSSxNQUFNLENBQVY7QUFBQSxjQUNFLENBREY7QUFFQSxpQkFBTyxZQUFZOztBQUVqQixpQkFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQXBCLEVBQXdCLEdBQXhCLEVBQTZCOztBQUUzQixrQkFBSSxNQUFNLENBQU4sSUFBVyxNQUFNLEVBQWpCLElBQXVCLE1BQU0sRUFBN0IsSUFBbUMsTUFBTSxFQUE3QyxFQUFpRDs7QUFFL0MscUJBQUssQ0FBTCxJQUFVLEdBQVY7QUFDRCxlQUhELE1BSUssSUFBSSxNQUFNLEVBQVYsRUFBYzs7QUFFakIscUJBQUssQ0FBTCxJQUFVLEdBQVY7QUFDRCxlQUhJLE1BSUE7O0FBRUgsb0JBQUksT0FBTyxJQUFYLEVBQ0UsTUFBTSxZQUFhLEtBQUssTUFBTCxLQUFnQixTQUE3QixHQUEwQyxDQUFoRDtBQUNGLG9CQUFJLE1BQU0sR0FBVjtBQUNBLHNCQUFNLE9BQU8sQ0FBYjtBQUNBLHFCQUFLLENBQUwsSUFBVSxNQUFPLE1BQU0sRUFBUCxHQUFjLElBQUksR0FBTCxHQUFZLEdBQXpCLEdBQStCLENBQXJDLENBQVY7QUFDRDtBQUVGOztBQUVELG1CQUFPLEtBQUssSUFBTCxDQUFVLEVBQVYsQ0FBUDtBQUNELFdBeEJEO0FBeUJELFNBbkNhLEVBREg7QUFxQ1g7O0FBRUEsZUFBTyxlQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1COztBQUV4QixpQkFBUSxJQUFJLENBQUwsR0FBVSxDQUFWLEdBQWdCLElBQUksQ0FBTCxHQUFVLENBQVYsR0FBYyxDQUFwQztBQUNELFNBMUNVO0FBMkNYOztBQUVBLHFCQUFhLHFCQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCOztBQUUzQixpQkFBTyxJQUFJLENBQUosR0FBUSxDQUFSLEdBQVksQ0FBbkI7QUFDRCxTQWhEVTtBQWlEWDtBQUNBOztBQUVBLHlCQUFpQix5QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjs7QUFFL0IsaUJBQU8sQ0FBRSxJQUFJLENBQUwsR0FBVSxDQUFYLElBQWdCLENBQXZCO0FBQ0QsU0F2RFU7QUF3RFg7O0FBRUEsbUJBQVcsbUJBQVUsQ0FBVixFQUFhLEVBQWIsRUFBaUIsRUFBakIsRUFBcUIsRUFBckIsRUFBeUIsRUFBekIsRUFBNkI7O0FBRXRDLGlCQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUwsS0FBWSxLQUFLLEVBQWpCLEtBQXdCLEtBQUssRUFBN0IsQ0FBWjtBQUNELFNBN0RVO0FBOERYOztBQUVBLG9CQUFZLG9CQUFVLENBQVYsRUFBYSxHQUFiLEVBQWtCLEdBQWxCLEVBQXVCOztBQUVqQyxjQUFJLEtBQUssR0FBVCxFQUNFLE9BQU8sQ0FBUDtBQUNGLGNBQUksS0FBSyxHQUFULEVBQ0UsT0FBTyxDQUFQO0FBQ0YsY0FBSSxDQUFDLElBQUksR0FBTCxLQUFhLE1BQU0sR0FBbkIsQ0FBSjtBQUNBLGlCQUFPLElBQUksQ0FBSixJQUFTLElBQUksSUFBSSxDQUFqQixDQUFQO0FBQ0QsU0F4RVU7QUF5RVgsc0JBQWMsc0JBQVUsQ0FBVixFQUFhLEdBQWIsRUFBa0IsR0FBbEIsRUFBdUI7O0FBRW5DLGNBQUksS0FBSyxHQUFULEVBQ0UsT0FBTyxDQUFQO0FBQ0YsY0FBSSxLQUFLLEdBQVQsRUFDRSxPQUFPLENBQVA7QUFDRixjQUFJLENBQUMsSUFBSSxHQUFMLEtBQWEsTUFBTSxHQUFuQixDQUFKO0FBQ0EsaUJBQU8sSUFBSSxDQUFKLEdBQVEsQ0FBUixJQUFhLEtBQUssSUFBSSxDQUFKLEdBQVEsRUFBYixJQUFtQixFQUFoQyxDQUFQO0FBQ0QsU0FqRlU7QUFrRlg7QUFDQTs7QUFFQSxrQkFBVSxvQkFBWTs7QUFFcEIsaUJBQU8sQ0FBQyxRQUFRLEtBQUssTUFBTCxFQUFSLEdBQXdCLE1BQU0sS0FBSyxNQUFMLEVBQS9CLElBQWdELEtBQXZEO0FBQ0QsU0F4RlU7QUF5Rlg7O0FBRUEsaUJBQVMsaUJBQVUsR0FBVixFQUFlLElBQWYsRUFBcUI7O0FBRTVCLGlCQUFPLE1BQU0sS0FBSyxLQUFMLENBQVcsS0FBSyxNQUFMLE1BQWlCLE9BQU8sR0FBUCxHQUFhLENBQTlCLENBQVgsQ0FBYjtBQUNELFNBOUZVO0FBK0ZYOztBQUVBLG1CQUFXLG1CQUFVLEdBQVYsRUFBZSxJQUFmLEVBQXFCOztBQUU5QixpQkFBTyxNQUFNLEtBQUssTUFBTCxNQUFpQixPQUFPLEdBQXhCLENBQWI7QUFDRCxTQXBHVTtBQXFHWDs7QUFFQSx5QkFBaUIseUJBQVUsS0FBVixFQUFpQjs7QUFFaEMsaUJBQU8sU0FBUyxNQUFNLEtBQUssTUFBTCxFQUFmLENBQVA7QUFDRCxTQTFHVTtBQTJHWCxrQkFBVSxZQUFZOztBQUVwQixjQUFJLHdCQUF3QixLQUFLLEVBQUwsR0FBVSxHQUF0QztBQUNBLGlCQUFPLFVBQVUsT0FBVixFQUFtQjs7QUFFeEIsbUJBQU8sVUFBVSxxQkFBakI7QUFDRCxXQUhEO0FBSUQsU0FQUyxFQTNHQztBQW1IWCxrQkFBVSxZQUFZOztBQUVwQixjQUFJLHdCQUF3QixNQUFNLEtBQUssRUFBdkM7QUFDQSxpQkFBTyxVQUFVLE9BQVYsRUFBbUI7O0FBRXhCLG1CQUFPLFVBQVUscUJBQWpCO0FBQ0QsV0FIRDtBQUlELFNBUFMsRUFuSEM7QUEySFgsc0JBQWMsc0JBQVUsS0FBVixFQUFpQjs7QUFFN0IsaUJBQU8sQ0FBQyxRQUFTLFFBQVEsQ0FBbEIsTUFBMEIsQ0FBMUIsSUFBK0IsVUFBVSxDQUFoRDtBQUNELFNBOUhVO0FBK0hYLHdCQUFnQix3QkFBVSxLQUFWLEVBQWlCOztBQUUvQjtBQUNBLG1CQUFTLFNBQVMsQ0FBbEI7QUFDQSxtQkFBUyxTQUFTLENBQWxCO0FBQ0EsbUJBQVMsU0FBUyxDQUFsQjtBQUNBLG1CQUFTLFNBQVMsQ0FBbEI7QUFDQSxtQkFBUyxTQUFTLEVBQWxCO0FBQ0E7QUFDQSxpQkFBTyxLQUFQO0FBQ0Q7O0FBeklVLE9BQWI7QUE0SUE7QUFDRDtBQUNGLEdBbjdFRDs7QUFxN0VBLE9BQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLE9BQUssT0FBTCxHQUFlLEVBQWY7QUFDQSxPQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxPQUFLLENBQUwsR0FBUyxJQUFJLE1BQU0sT0FBVixFQUFUO0FBQ0EsT0FBSyxDQUFMLEdBQVMsSUFBSSxNQUFNLE9BQVYsRUFBVDtBQUNBLE9BQUssQ0FBTCxHQUFTLElBQUksTUFBTSxPQUFWLEVBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxJQUFJLE1BQU0sT0FBVixFQUFUO0FBQ0EsT0FBSyxJQUFMLEdBQVksSUFBSSxNQUFNLE9BQVYsRUFBWjtBQUNBLE9BQUssRUFBTCxHQUFVLElBQUksTUFBTSxPQUFWLEVBQVY7QUFDQSxPQUFLLENBQUwsR0FBUyxJQUFJLE1BQU0sT0FBVixFQUFUO0FBQ0EsT0FBSyxTQUFMLEdBQWlCO0FBQ2YsU0FBSztBQURVLEdBQWpCO0FBR0EsT0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNEOztBQUVELFVBQVUsU0FBVixDQUFvQixnQkFBcEIsR0FBdUMsVUFBVSxHQUFWLEVBQWUsT0FBZixFQUF3QjtBQUM3RCxNQUFJLENBQUMsS0FBSyxTQUFMLENBQWUsR0FBZixDQUFMLEVBQTBCO0FBQ3hCLFNBQUssU0FBTCxDQUFlLEdBQWYsSUFBc0IsRUFBdEI7QUFDRDtBQUNELE9BQUssU0FBTCxDQUFlLEdBQWYsRUFBb0IsSUFBcEIsQ0FBeUIsT0FBekI7QUFDRCxDQUxEO0FBTUEsVUFBVSxTQUFWLENBQW9CLEtBQXBCLEdBQTRCLElBQTVCO0FBQ0EsVUFBVSxTQUFWLENBQW9CLFVBQXBCLEdBQWlDLFVBQVUsR0FBVixFQUFlLENBQWYsRUFBa0I7QUFDakQsU0FBTyxFQUFFLEtBQUYsR0FDSixZQURJLENBRUgsSUFBSSxNQUZELENBQVA7QUFHRCxDQUpEO0FBS0E7QUFDQTtBQUNBO0FBQ0EsVUFBVSxTQUFWLENBQW9CLFNBQXBCLEdBQWdDLFVBQVUsR0FBVixFQUFlO0FBQzdDLE1BQUksUUFBUSxFQUFaO0FBQ0EsTUFBSSxXQUFXLEtBQUssYUFBTCxDQUFtQixJQUFJLE1BQXZCLENBQWY7QUFBQSxNQUNFLFFBQVEsU0FBUyxRQURuQjtBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEVBQUUsQ0FBcEMsRUFBdUM7QUFDckMsVUFBTSxDQUFOLElBQVcsS0FBSyxVQUFMLENBQWdCLEdBQWhCLEVBQXFCLE1BQU0sQ0FBTixDQUFyQixDQUFYO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQVJEOztBQVVBLFVBQVUsU0FBVixDQUFvQixTQUFwQixHQUFnQyxVQUFVLEdBQVYsRUFBZTtBQUM3QyxPQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQUksSUFBeEI7QUFDQSxPQUFLLE9BQUwsQ0FBYSxJQUFJLElBQWpCLElBQXlCLEdBQXpCO0FBQ0EsTUFBSSxNQUFKLEdBQWEsSUFBSSxNQUFNLE9BQVYsR0FDVixTQURVLENBQ0EsSUFBSSxNQURKLENBQWI7QUFFQSxNQUFJLE1BQU0sSUFBSSxRQUFKLENBQWEsR0FBdkI7QUFBQSxNQUNFLE9BQU8sT0FBTyxTQURoQjtBQUFBLE1BRUUsT0FBTyxPQUFPLFNBRmhCO0FBQUEsTUFHRSxPQUFPLE9BQU8sU0FIaEI7QUFBQSxNQUlFLE9BQU8sT0FBTyxTQUpoQjtBQUtBLE1BQUksT0FBTyxJQUFJLE1BQUosR0FBYSxDQUF4QixFQUEyQjtBQUN6QixTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxFQUFFLENBQWxDLEVBQXFDO0FBQ25DLFVBQUksS0FBSyxJQUFJLENBQUosQ0FBVDtBQUNBLFVBQUksRUFBSixFQUFRO0FBQ04sWUFBSSxJQUFJLEdBQUcsQ0FBSCxDQUFSO0FBQUEsWUFDRSxJQUFJLEdBQUcsQ0FBSCxDQUROO0FBRUEsZUFBTyxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsQ0FBZixDQUFQO0FBQ0EsZUFBTyxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsQ0FBZixDQUFQO0FBQ0EsZUFBTyxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsQ0FBZixDQUFQO0FBQ0EsZUFBTyxLQUFLLEdBQUwsQ0FBUyxJQUFULEVBQWUsQ0FBZixDQUFQO0FBQ0Q7QUFDRjtBQUNGLEdBWkQsTUFhSztBQUNILFdBQU8sQ0FBUDtBQUNBLFdBQU8sQ0FBUDtBQUNBLFdBQU8sQ0FBUDtBQUNBLFdBQU8sQ0FBUDtBQUNEOztBQUVELE9BQUssV0FBTCxDQUFpQixJQUFJLElBQXJCLEVBQTJCLE1BQTNCLEVBQW1DLElBQW5DO0FBQ0EsT0FBSyxXQUFMLENBQWlCLElBQUksSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsSUFBbkM7QUFDQSxPQUFLLFdBQUwsQ0FBaUIsSUFBSSxJQUFyQixFQUEyQixNQUEzQixFQUFtQyxJQUFuQztBQUNBLE9BQUssV0FBTCxDQUFpQixJQUFJLElBQXJCLEVBQTJCLE1BQTNCLEVBQW1DLElBQW5DO0FBQ0EsT0FBSyxXQUFMLENBQWlCLElBQUksSUFBckIsRUFBMkIsUUFBM0IsRUFBcUMsSUFBSSxRQUFKLENBQWEsSUFBbEQ7QUFDQSxNQUFJLENBQUMsS0FBSyxhQUFMLENBQW1CLElBQUksUUFBSixDQUFhLElBQWhDLENBQUwsRUFBNEM7QUFDMUMsU0FBSyxhQUFMLENBQW1CLElBQUksUUFBSixDQUFhLElBQWhDLElBQXdDLElBQUksUUFBNUM7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsUUFBUSxJQUFJLFFBQUosQ0FBYSxRQUFoQyxFQUEwQyxJQUFJLE1BQU0sTUFBekQsRUFBaUUsSUFBSSxDQUFyRSxFQUF3RSxFQUFFLENBQTFFLEVBQTZFO0FBQzNFLFlBQU0sQ0FBTixJQUFXLElBQUksTUFBTSxPQUFWLEdBQ1IsU0FEUSxDQUNFLE1BQU0sQ0FBTixDQURGLENBQVg7QUFFRDtBQUNGO0FBQ0QsT0FBSyxhQUFMLENBQW1CLENBQUMsR0FBRCxDQUFuQjtBQUNELENBM0NEOztBQTZDQSxVQUFVLFNBQVYsQ0FBb0IsYUFBcEIsR0FBb0MsVUFBVSxJQUFWLEVBQWdCO0FBQ2xELE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE1BQXpCLEVBQWlDLEVBQUUsQ0FBbkMsRUFBc0M7QUFDcEMsUUFBSSxNQUFNLEtBQUssQ0FBTCxDQUFWO0FBQ0EsUUFBSSxJQUFJLE9BQUosS0FBZ0IsS0FBcEIsRUFBMkI7QUFDekIsVUFBSSxPQUFPLEdBQVg7QUFBQSxVQUNFLFNBQVMsS0FBSyxPQUFMLENBQWEsSUFBSSxJQUFqQixDQURYO0FBRUEsVUFBSSxJQUFJLE1BQUosS0FBZSxJQUFuQixFQUF5QjtBQUN2QixlQUFPLE1BQVAsQ0FBYyxTQUFkLENBQXdCLElBQUksTUFBNUI7QUFDRDtBQUNELFVBQUksSUFBSSxPQUFKLEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGFBQUssV0FBTCxDQUFpQixJQUFJLElBQXJCLEVBQTJCLFNBQTNCLEVBQXNDLElBQUksT0FBMUM7QUFDRDtBQUNELFVBQUksSUFBSSxRQUFKLEtBQWlCLElBQXJCLEVBQTJCO0FBQ3pCLGFBQUssV0FBTCxDQUFpQixJQUFJLElBQXJCLEVBQTJCLFVBQTNCLEVBQXVDLElBQUksUUFBM0M7QUFDRDtBQUNGLEtBWkQsTUFhSztBQUNILGFBQU8sS0FBSyxPQUFMLENBQWEsSUFBSSxJQUFqQixDQUFQO0FBQ0EsVUFBSSxRQUFRLEtBQVo7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLENBQUMsS0FBRCxJQUFVLElBQUksS0FBSyxTQUFMLENBQWUsTUFBN0MsRUFBcUQsRUFBRSxDQUF2RCxFQUEwRDtBQUN4RCxZQUFJLE9BQU8sS0FBSyxPQUFMLENBQWEsS0FBSyxTQUFMLENBQWUsQ0FBZixDQUFiLENBQVg7QUFDQSxnQkFBUSxTQUFTLFFBQVEsS0FBSyxNQUFMLEtBQWdCLElBQUksTUFBN0M7QUFDRDtBQUNELFVBQUksQ0FBQyxLQUFMLEVBQVk7QUFDVixlQUFPLEtBQUssYUFBTCxDQUFtQixJQUFJLE1BQXZCLENBQVA7QUFDRDtBQUNELFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsS0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixJQUFJLElBQTNCLENBQXRCLEVBQXdELENBQXhEO0FBQ0Q7QUFDRjtBQUNGLENBN0JEOztBQStCQSxVQUFVLFNBQVYsQ0FBb0IsV0FBcEIsR0FBa0MsVUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDO0FBQ2xFLE1BQUksTUFBTSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQVY7QUFBQSxNQUNFLFFBQVEsU0FBUyxLQUFULENBQWUsR0FBZixDQURWO0FBRUEsU0FBTyxNQUFNLE1BQU4sR0FBZSxDQUF0QixFQUF5QjtBQUN2QixlQUFXLE1BQU0sS0FBTixFQUFYO0FBQ0EsUUFBSSxDQUFDLElBQUksUUFBSixDQUFMLEVBQW9CO0FBQ2xCLFVBQUksUUFBSixJQUFnQixFQUFoQjtBQUNEO0FBQ0QsVUFBTSxJQUFJLFFBQUosQ0FBTjtBQUNEO0FBQ0QsTUFBSSxNQUFNLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0I7QUFDdEIsZUFBVyxNQUFNLENBQU4sQ0FBWDtBQUNBLFFBQUksTUFBTSxDQUFOLENBQUosSUFBZ0IsS0FBaEI7QUFDRDtBQUNGLENBZEQ7O0FBZ0JBLFVBQVUsU0FBVixDQUFvQixlQUFwQixHQUFzQyxVQUFVLElBQVYsRUFBZ0I7QUFDcEQsTUFBSSxVQUFVLEVBQWQ7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxNQUF6QixFQUFpQyxFQUFFLENBQW5DLEVBQXNDO0FBQ3BDLFFBQUksT0FBTyxLQUFLLENBQUwsQ0FBWDtBQUFBLFFBQ0UsT0FBTyxLQUFLLENBQUwsQ0FEVDtBQUFBLFFBRUUsT0FBTyxLQUFLLENBQUwsQ0FGVDtBQUFBLFFBR0UsS0FBSyxLQUFLLENBQUwsQ0FIUDtBQUFBLFFBSUUsUUFBUSxJQUpWO0FBS0EsU0FBSyxJQUFMLENBQVUsU0FBVixDQUFvQixJQUFwQjtBQUNBLFNBQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0IsRUFBbEI7O0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssU0FBTCxDQUFlLE1BQW5DLEVBQTJDLEVBQUUsQ0FBN0MsRUFBZ0Q7QUFDOUMsVUFBSSxRQUFRLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBWjtBQUFBLFVBQ0UsTUFBTSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBRFI7QUFFQSxVQUFJLENBQUMsSUFBSSxRQUFULEVBQW1CO0FBQ2pCLFlBQUksUUFBUSxLQUFLLFNBQUwsQ0FBZSxHQUFmLENBQVo7QUFBQSxZQUNFLFFBQVEsSUFBSSxRQUFKLENBQWEsS0FEdkI7QUFBQSxZQUVFLE1BQU0sSUFBSSxRQUFKLENBQWEsR0FGckI7O0FBSUEsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsRUFBRSxDQUFwQyxFQUF1QztBQUNyQyxjQUFJLE9BQU8sTUFBTSxDQUFOLENBQVg7QUFBQSxjQUNFLEtBQUssTUFBTSxLQUFLLENBQUwsSUFBVSxNQUFNLE1BQXRCLENBRFA7QUFBQSxjQUVFLEtBQUssTUFBTSxLQUFLLENBQUwsSUFBVSxNQUFNLE1BQXRCLENBRlA7QUFBQSxjQUdFLEtBQUssTUFBTSxLQUFLLENBQUwsSUFBVSxNQUFNLE1BQXRCLENBSFA7QUFJQSxlQUFLLENBQUwsQ0FBTyxVQUFQLENBQWtCLEVBQWxCLEVBQXNCLEVBQXRCO0FBQ0EsZUFBSyxDQUFMLENBQU8sVUFBUCxDQUFrQixFQUFsQixFQUFzQixFQUF0QjtBQUNBLGVBQUssQ0FBTCxDQUFPLFVBQVAsQ0FBa0IsS0FBSyxFQUF2QixFQUEyQixLQUFLLElBQWhDO0FBQ0EsZUFBSyxDQUFMLENBQU8sR0FBUCxDQUNFLEtBQUssQ0FBTCxDQUFPLENBRFQsRUFDWSxLQUFLLENBQUwsQ0FBTyxDQURuQixFQUNzQixDQUFDLEtBQUssQ0FBTCxDQUFPLENBRDlCLEVBQ2lDLENBRGpDLEVBRUUsS0FBSyxDQUFMLENBQU8sQ0FGVCxFQUVZLEtBQUssQ0FBTCxDQUFPLENBRm5CLEVBRXNCLENBQUMsS0FBSyxDQUFMLENBQU8sQ0FGOUIsRUFFaUMsQ0FGakMsRUFHRSxLQUFLLENBQUwsQ0FBTyxDQUhULEVBR1ksS0FBSyxDQUFMLENBQU8sQ0FIbkIsRUFHc0IsQ0FBQyxLQUFLLENBQUwsQ0FBTyxDQUg5QixFQUdpQyxDQUhqQyxFQUlFLENBSkYsRUFJSyxDQUpMLEVBSVEsQ0FKUixFQUlXLENBSlg7QUFLQSxjQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssQ0FBTCxDQUFPLFdBQVAsRUFBVCxJQUFpQyxLQUFyQyxFQUE0QztBQUMxQyxpQkFBSyxDQUFMLENBQU8sVUFBUCxDQUFrQixLQUFLLENBQXZCO0FBQ0EsaUJBQUssQ0FBTCxDQUFPLFVBQVAsQ0FBa0IsS0FBSyxJQUF2QixFQUE2QixFQUE3QixFQUNHLFlBREgsQ0FDZ0IsS0FBSyxDQURyQjtBQUVBLGdCQUFJLEtBQUssS0FBSyxDQUFMLENBQU8sQ0FBWixJQUFpQixLQUFLLENBQUwsQ0FBTyxDQUFQLElBQVksQ0FBN0IsSUFBa0MsS0FBSyxLQUFLLENBQUwsQ0FBTyxDQUE5QyxJQUFtRCxLQUFLLENBQUwsQ0FBTyxDQUFQLElBQVksQ0FBL0QsSUFBb0UsS0FBSyxDQUFMLENBQU8sQ0FBUCxHQUFXLENBQW5GLEVBQXNGO0FBQ3BGLG1CQUFLLENBQUwsQ0FBTyxjQUFQLENBQXNCLEtBQUssQ0FBTCxDQUFPLENBQTdCLEVBQ0csR0FESCxDQUNPLEtBQUssSUFEWjtBQUVBLGtCQUFJLE9BQU8sS0FBSyxJQUFMLENBQVUsS0FBSyxDQUFMLENBQU8sQ0FBakIsSUFBc0IsS0FBSyxFQUFMLENBQVEsVUFBUixDQUFtQixLQUFLLENBQXhCLENBQWpDO0FBQ0Esa0JBQUksQ0FBQyxLQUFELElBQVUsT0FBTyxNQUFNLFFBQTNCLEVBQXFDO0FBQ25DLHdCQUFRO0FBQ04sd0JBQU0sSUFEQTtBQUVOLDRCQUFVLEtBRko7QUFHTiw0QkFBVSxJQUhKO0FBSU4sNkJBQVcsQ0FKTDtBQUtOLDZCQUFXLEtBQUssQ0FBTCxDQUFPLE9BQVAsRUFMTDtBQU1OLDhCQUFZLEtBQUssQ0FBTCxDQUFPLE9BQVA7QUFOTixpQkFBUjs7QUFTQSxvQkFBSSxHQUFKLEVBQVM7QUFDUCx1QkFBSyxJQUFJLEtBQUssQ0FBTCxJQUFVLElBQUksTUFBbEIsQ0FBTDtBQUNBLHVCQUFLLElBQUksS0FBSyxDQUFMLElBQVUsSUFBSSxNQUFsQixDQUFMO0FBQ0EsdUJBQUssSUFBSSxLQUFLLENBQUwsSUFBVSxJQUFJLE1BQWxCLENBQUw7QUFDQSxzQkFBSSxJQUFJLEtBQUssQ0FBTCxDQUFPLENBQVAsSUFBWSxHQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBcEIsSUFBNkIsS0FBSyxDQUFMLENBQU8sQ0FBUCxJQUFZLEdBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxDQUFwQixDQUE3QixHQUEwRCxHQUFHLENBQUgsQ0FBbEU7QUFBQSxzQkFDRSxJQUFJLEtBQUssQ0FBTCxDQUFPLENBQVAsSUFBWSxHQUFHLENBQUgsSUFBUSxHQUFHLENBQUgsQ0FBcEIsSUFBNkIsS0FBSyxDQUFMLENBQU8sQ0FBUCxJQUFZLEdBQUcsQ0FBSCxJQUFRLEdBQUcsQ0FBSCxDQUFwQixDQUE3QixHQUEwRCxHQUFHLENBQUgsQ0FEaEU7QUFFQSxzQkFBSSxJQUFJLElBQUosSUFBWSxDQUFaLElBQWlCLEtBQUssSUFBSSxJQUExQixJQUFrQyxJQUFJLElBQUosSUFBWSxDQUE5QyxJQUFtRCxJQUFJLElBQUksSUFBL0QsRUFBcUU7QUFDbkUsMEJBQU0sS0FBTixHQUFjLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBZDtBQUNELG1CQUZELE1BR0s7QUFDSCw0QkFBUSxJQUFSO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNELFFBQUksS0FBSixFQUFXO0FBQ1QsY0FBUSxJQUFSLElBQWdCLEtBQWhCO0FBQ0Q7QUFDRjtBQUNELE9BQUssS0FBTCxDQUFXLEtBQVgsRUFBa0IsT0FBbEI7QUFDRCxDQTFFRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvUHJvamVjdG9yLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Projector = Projector;
})();
(function(){
"use strict";

var Random = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxTQUFOLENBQWdCO0FBQ2QsVUFBUSxVQURNO0FBRWQsUUFBTSxRQUZRO0FBR2QsZUFBYTtBQUhDLENBQWhCO0FBS0EsSUFBTSxTQUFTLEVBQWYiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1JhbmRvbS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Random = Random;
})();
(function(){
"use strict";

var SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2", "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49", "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836", "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000", "#5B0001", "#302E2E"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9TS0lOUy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFFBQU0sT0FESTtBQUVWLFFBQU0saUJBRkk7QUFHVixlQUFhO0FBSEgsQ0FBWjtBQUtBLElBQU0sUUFBUSxDQUFDLFNBQUQsRUFBWSxTQUFaLEVBQXVCLFNBQXZCLEVBQWtDLFNBQWxDLEVBQTZDLFNBQTdDLEVBQXdELFNBQXhELEVBQ1osU0FEWSxFQUNELFNBREMsRUFDVSxTQURWLEVBQ3FCLFNBRHJCLEVBQ2dDLFNBRGhDLEVBQzJDLFNBRDNDLEVBQ3NELFNBRHRELEVBRVosU0FGWSxFQUVELFNBRkMsRUFFVSxTQUZWLEVBRXFCLFNBRnJCLEVBRWdDLFNBRmhDLEVBRTJDLFNBRjNDLEVBRXNELFNBRnRELEVBR1osU0FIWSxFQUdELFNBSEMsRUFHVSxTQUhWLEVBR3FCLFNBSHJCLEVBR2dDLFNBSGhDLEVBRzJDLFNBSDNDLEVBR3NELFNBSHRELEVBSVosU0FKWSxFQUlELFNBSkMsQ0FBZCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvU0tJTlMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.SKINS = SKINS;
})();
(function(){
"use strict";

var SKINS_VALUES = Primrose.SKINS.map(function (s) {
  return parseInt(s.substring(1), 16);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9TS0lOU19WQUxVRVMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixRQUFNLGFBREk7QUFFVixRQUFNLGlCQUZJO0FBR1YsZUFBYTtBQUhILENBQVo7QUFLQSxJQUFNLGVBQWUsU0FBUyxLQUFULENBQWUsR0FBZixDQUFtQixVQUFVLENBQVYsRUFBYTtBQUNuRCxTQUFPLFNBQVMsRUFBRSxTQUFGLENBQVksQ0FBWixDQUFULEVBQXlCLEVBQXpCLENBQVA7QUFDRCxDQUZvQixDQUFyQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvU0tJTlNfVkFMVUVTLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.SKINS_VALUES = SKINS_VALUES;
})();
(function(){
"use strict";

var SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9TWVNfRk9OVFMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFVixRQUFNLFdBRkk7QUFHVixRQUFNLFFBSEk7QUFJVixlQUFhO0FBSkgsQ0FBWjtBQU1BLElBQU0sWUFBWSwwSEFBbEIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1NZU19GT05UUy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.SYS_FONTS = SYS_FONTS;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var Surface = function (_Primrose$Entity) {
  _inherits(Surface, _Primrose$Entity);

  _createClass(Surface, null, [{
    key: "create",
    value: function create() {
      return new Surface();
    }
  }]);

  function Surface(options) {
    _classCallCheck(this, Surface);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Surface).call(this));

    _this.options = patch(options, {
      id: "Primrose.Surface[" + COUNTER++ + "]",
      bounds: new Primrose.Text.Rectangle()
    });
    _this.listeners.move = [];
    _this.bounds = _this.options.bounds;
    _this.canvas = null;
    _this.context = null;
    _this._opacity = 1;

    _this.style = {};

    Object.defineProperties(_this.style, {
      width: {
        get: function get() {
          return _this.bounds.width;
        },
        set: function set(v) {
          _this.bounds.width = v;
          _this.resize();
        }
      },
      height: {
        get: function get() {
          return _this.bounds.height;
        },
        set: function set(v) {
          _this.bounds.height = v;
          _this.resize();
        }
      },
      left: {
        get: function get() {
          return _this.bounds.left;
        },
        set: function set(v) {
          _this.bounds.left = v;
        }
      },
      top: {
        get: function get() {
          return _this.bounds.top;
        },
        set: function set(v) {
          _this.bounds.top = v;
        }
      },
      opacity: {
        get: function get() {
          return _this._opacity;
        },
        set: function set(v) {
          _this._opacity = v;
        }
      },
      fontSize: {
        get: function get() {
          return _this.fontSize;
        },
        set: function set(v) {
          _this.fontSize = v;
        }
      },
      backgroundColor: {
        get: function get() {
          return _this.backgroundColor;
        },
        set: function set(v) {
          _this.backgroundColor = v;
        }
      },
      color: {
        get: function get() {
          return _this.color;
        },
        set: function set(v) {
          _this.color = v;
        }
      }
    });

    if (_this.options.id instanceof Surface) {
      throw new Error("Object is already a Surface. Please don't try to wrap them.");
    } else if (_this.options.id instanceof CanvasRenderingContext2D) {
      _this.context = _this.options.id;
      _this.canvas = _this.context.canvas;
    } else if (_this.options.id instanceof HTMLCanvasElement) {
      _this.canvas = _this.options.id;
    } else if (typeof _this.options.id === "string" || _this.options.id instanceof String) {
      _this.canvas = document.getElementById(_this.options.id);
      if (_this.canvas === null) {
        _this.canvas = document.createElement("canvas");
        _this.canvas.id = _this.options.id;
      } else if (_this.canvas.tagName !== "CANVAS") {
        _this.canvas = null;
      }
    }

    if (_this.canvas === null) {
      console.error(_typeof(_this.options.id));
      console.error(_this.options.id);
      throw new Error(_this.options.id + " does not refer to a valid canvas element.");
    }

    _this.id = _this.canvas.id;

    if (_this.bounds.width === 0) {
      _this.bounds.width = _this.imageWidth;
      _this.bounds.height = _this.imageHeight;
    }

    _this.imageWidth = _this.bounds.width;
    _this.imageHeight = _this.bounds.height;

    if (_this.context === null) {
      _this.context = _this.canvas.getContext("2d");
    }

    _this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
    _this.context.imageSmoothingEnabled = false;
    _this.context.textBaseline = "top";

    _this._texture = null;
    _this._material = null;
    return _this;
  }

  _createClass(Surface, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var geom = this.className === "shell" ? shell(3, 10, 10) : quad(2, 2),
          mesh = textured(geom, this, {
        opacity: this._opacity
      });
      scene.add(mesh);
      env.registerPickableObject(mesh);
      return mesh;
    }
  }, {
    key: "invalidate",
    value: function invalidate(bounds) {
      var useDefault = !bounds;
      if (!bounds) {
        bounds = this.bounds.clone();
        bounds.left = 0;
        bounds.top = 0;
      } else if (bounds instanceof Primrose.Text.Rectangle) {
        bounds = bounds.clone();
      }
      for (var i = 0; i < this.children.length; ++i) {
        var child = this.children[i],
            overlap = bounds.overlap(child.bounds);
        if (overlap) {
          var x = overlap.left - child.bounds.left,
              y = overlap.top - child.bounds.top;
          this.context.drawImage(child.canvas, x, y, overlap.width, overlap.height, overlap.x, overlap.y, overlap.width, overlap.height);
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
  }, {
    key: "render",
    value: function render() {
      this.invalidate();
    }
  }, {
    key: "resize",
    value: function resize() {
      this.setSize(this.surfaceWidth, this.surfaceHeight);
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var oldTextBaseline = this.context.textBaseline,
          oldTextAlign = this.context.textAlign;
      this.imageWidth = width;
      this.imageHeight = height;

      this.context.textBaseline = oldTextBaseline;
      this.context.textAlign = oldTextAlign;
    }
  }, {
    key: "appendChild",
    value: function appendChild(child) {
      if (!(child instanceof Surface)) {
        throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
      }
      _get(Object.getPrototypeOf(Surface.prototype), "appendChild", this).call(this, child);
      this.invalidate();
    }
  }, {
    key: "mapUV",
    value: function mapUV(point) {
      return {
        x: point[0] * this.imageWidth,
        y: (1 - point[1]) * this.imageHeight
      };
    }
  }, {
    key: "unmapUV",
    value: function unmapUV(point) {
      return [point.x / this.imageWidth, 1 - point.y / this.imageHeight];
    }
  }, {
    key: "_findChild",
    value: function _findChild(x, y, thunk) {
      var here = this.inBounds(x, y),
          found = null;
      for (var i = this.children.length - 1; i >= 0; --i) {
        var child = this.children[i];
        if (!found && child.inBounds(x - this.bounds.left, y - this.bounds.top)) {
          found = child;
        } else if (child.focused) {
          child.blur();
        }
      }
      return found || here && this;
    }
  }, {
    key: "DOMInBounds",
    value: function DOMInBounds(x, y) {
      return this.inBounds(x * devicePixelRatio, y * devicePixelRatio);
    }
  }, {
    key: "UVInBounds",
    value: function UVInBounds(point) {
      return this.inBounds(point[0] * this.imageWidth, (1 - point[1]) * this.imageHeight);
    }
  }, {
    key: "inBounds",
    value: function inBounds(x, y) {
      return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
    }
  }, {
    key: "startDOMPointer",
    value: function startDOMPointer(evt) {
      this.startPointer(x * devicePixelRatio, y * devicePixelRatio);
    }
  }, {
    key: "moveDOMPointer",
    value: function moveDOMPointer(evt) {
      this.movePointer(x * devicePixelRatio, y * devicePixelRatio);
    }
  }, {
    key: "startPointer",
    value: function startPointer(x, y) {
      if (this.inBounds(x, y)) {
        var target = this._findChild(x, y, function (child, x2, y2) {
          return child.startPointer(x2, y2);
        });
        if (target) {
          if (!this.focused) {
            this.focus();
          }
          emit.call(this, "click", {
            target: target,
            x: x,
            y: y
          });
          if (target !== this) {
            target.startPointer(x - this.bounds.left, y - this.bounds.top);
          }
        } else if (this.focused) {
          this.blur();
        }
      }
    }
  }, {
    key: "movePointer",
    value: function movePointer(x, y) {
      var target = this._findChild(x, y, function (child, x2, y2) {
        return child.startPointer(x2, y2);
      });
      if (target) {
        emit.call(this, "move", {
          target: target,
          x: x,
          y: y
        });
        if (target !== this) {
          target.movePointer(x - this.bounds.left, y - this.bounds.top);
        }
      }
    }
  }, {
    key: "startUV",
    value: function startUV(point) {
      var p = this.mapUV(point);
      this.startPointer(p.x, p.y);
    }
  }, {
    key: "moveUV",
    value: function moveUV(point) {
      var p = this.mapUV(point);
      this.movePointer(p.x, p.y);
    }
  }, {
    key: "imageWidth",
    get: function get() {
      return this.canvas.width;
    },
    set: function set(v) {
      this.canvas.width = v;
      this.bounds.width = v;
    }
  }, {
    key: "imageHeight",
    get: function get() {
      return this.canvas.height;
    },
    set: function set(v) {
      this.canvas.height = v;
      this.bounds.height = v;
    }
  }, {
    key: "elementWidth",
    get: function get() {
      return this.canvas.clientWidth * devicePixelRatio;
    },
    set: function set(v) {
      this.canvas.style.width = v / devicePixelRatio + "px";
    }
  }, {
    key: "elementHeight",
    get: function get() {
      return this.canvas.clientHeight * devicePixelRatio;
    },
    set: function set(v) {
      this.canvas.style.height = v / devicePixelRatio + "px";
    }
  }, {
    key: "surfaceWidth",
    get: function get() {
      return this.canvas.parentElement ? this.elementWidth : this.bounds.width;
    }
  }, {
    key: "surfaceHeight",
    get: function get() {
      return this.canvas.parentElement ? this.elementHeight : this.bounds.height;
    }
  }, {
    key: "resized",
    get: function get() {
      return this.imageWidth !== this.surfaceWidth || this.imageHeight !== this.surfaceHeight;
    }
  }, {
    key: "texture",
    get: function get() {
      if (!this._texture) {
        this._texture = new THREE.Texture(this.canvas);
      }
      return this._texture;
    }
  }]);

  return Surface;
}(Primrose.Entity);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9TdXJmYWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQUksVUFBVSxDQUFkOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxVQURFO0FBRVIsUUFBTSxTQUZFO0FBR1IsZUFBYSwySUFITDtBQUlSLGFBQVcsaUJBSkg7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLFlBREs7QUFFWCxVQUFNLHlEQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLGdCQURMO0FBRUQsVUFBTSx5QkFGTDtBQUdELGlCQUFhO0FBSFosR0FKUztBQUxKLENBQVo7O0lBZU0sTzs7Ozs7NkJBRVk7QUFDZCxhQUFPLElBQUksT0FBSixFQUFQO0FBQ0Q7OztBQUVELG1CQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFFbkIsVUFBSyxPQUFMLEdBQWUsTUFBTSxPQUFOLEVBQWU7QUFDNUIsVUFBSSxzQkFBdUIsU0FBdkIsR0FBb0MsR0FEWjtBQUU1QixjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEI7QUFGb0IsS0FBZixDQUFmO0FBSUEsVUFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixFQUF0QjtBQUNBLFVBQUssTUFBTCxHQUFjLE1BQUssT0FBTCxDQUFhLE1BQTNCO0FBQ0EsVUFBSyxNQUFMLEdBQWMsSUFBZDtBQUNBLFVBQUssT0FBTCxHQUFlLElBQWY7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsQ0FBaEI7O0FBRUEsVUFBSyxLQUFMLEdBQWEsRUFBYjs7QUFFQSxXQUFPLGdCQUFQLENBQXdCLE1BQUssS0FBN0IsRUFBb0M7QUFDbEMsYUFBTztBQUNMLGFBQUssZUFBTTtBQUNULGlCQUFPLE1BQUssTUFBTCxDQUFZLEtBQW5CO0FBQ0QsU0FISTtBQUlMLGFBQUssYUFBQyxDQUFELEVBQU87QUFDVixnQkFBSyxNQUFMLENBQVksS0FBWixHQUFvQixDQUFwQjtBQUNBLGdCQUFL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QTJCLGdCQUFsQztBQUNELEs7c0JBRWlCLEMsRUFBRztBQUNuQixXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE1BQWxCLEdBQTRCLElBQUksZ0JBQUwsR0FBeUIsSUFBcEQ7QUFDRDs7O3dCQUVrQjtBQUNqQixhQUFPLEtBQUssTUFBTCxDQUFZLGFBQVosR0FBNEIsS0FBSyxZQUFqQyxHQUFnRCxLQUFLLE1BQUwsQ0FBWSxLQUFuRTtBQUNEOzs7d0JBRW1CO0FBQ2xCLGFBQU8sS0FBSyxNQUFMLENBQVksYUFBWixHQUE0QixLQUFLLGFBQWpDLEdBQWlELEtBQUssTUFBTCxDQUFZLE1BQXBFO0FBQ0Q7Ozt3QkFFYTtBQUNaLGFBQU8sS0FBSyxVQUFMLEtBQW9CLEtBQUssWUFBekIsSUFDTCxLQUFLLFdBQUwsS0FBcUIsS0FBSyxhQUQ1QjtBQUVEOzs7d0JBZ0JhO0FBQ1osVUFBSSxDQUFDLEtBQUssUUFBVixFQUFvQjtBQUNsQixhQUFLLFFBQUwsR0FBZ0IsSUFBSSxNQUFNLE9BQVYsQ0FBa0IsS0FBSyxNQUF2QixDQUFoQjtBQUNEO0FBQ0QsYUFBTyxLQUFLLFFBQVo7QUFDRDs7OztFQW5RbUIsU0FBUyxNIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9TdXJmYWNlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Surface = Surface;
})();
(function(){
"use strict";

var Text = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsVUFETTtBQUVkLFFBQU0sTUFGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sT0FBTyxFQUFiIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text = Text;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PEERING_TIMEOUT_LENGTH = 10000;

/* polyfills */
window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;

window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;

// some useful information:
// - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
// - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
// - https://github.com/coturn/rfc5766-turn-server/
var ICE_SERVERS = [{
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

var INSTANCE_COUNT = 0;

function formatTime(t) {
  var ms = t.getMilliseconds().toString();
  while (ms.length < 3) {
    ms = "0" + ms;
  }
  return t.toLocaleTimeString().replace(/(\d+:\d+:\d+)/, function (_, g) {
    return g + "." + ms;
  });
}

var WebRTCSocket = function () {
  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  function WebRTCSocket(extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    var _this = this;

    _classCallCheck(this, WebRTCSocket);

    // These logging constructs are basically off by default, but you will need them if you ever
    // need to debug the WebRTC workflow.
    var attemptCount = 0;
    var MAX_LOG_LEVEL = 5,
        instanceNumber = ++INSTANCE_COUNT,
        print = function print(name, level, format) {
      if (level < MAX_LOG_LEVEL) {
        var t = new Date();
        var args = ["[%s:%s %s] " + format, INSTANCE_COUNT, instanceNumber, formatTime(t)];
        for (var i = 3; i < arguments.length; ++i) {
          args.push(arguments[i]);
        }
        console[name].apply(console, args);
      }
      return arguments[3];
    };

    this._timeout = null;
    this._onError = null;
    this._log = print.bind(null, "log");
    this._error = print.bind(null, "error", 0);

    Object.defineProperty(this, "proxyServer", {
      get: function get() {
        return proxyServer;
      }
    });

    Object.defineProperty(this, "fromUserName", {
      get: function get() {
        return fromUserName;
      }
    });

    Object.defineProperty(this, "fromUserIndex", {
      get: function get() {
        return fromUserIndex;
      }
    });

    Object.defineProperty(this, "toUserName", {
      get: function get() {
        return toUserName;
      }
    });

    Object.defineProperty(this, "toUserIndex", {
      get: function get() {
        return toUserIndex;
      }
    });

    var iceServers = ICE_SERVERS.concat(extraIceServers);
    if (isFirefox) {
      iceServers = [{
        urls: iceServers.map(function (s) {
          return s.url;
        })
      }];
    }

    this._log(1, iceServers);

    this.rtc = new RTCPeerConnection({
      // Indicate to the API what servers should be used to figure out NAT traversal.
      iceServers: iceServers
    });

    var progress = {
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
      get: function get() {
        return progress;
      }
    });

    Object.defineProperty(this, "goFirst", {
      get: function get() {
        return !goSecond;
      }
    });

    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", this.close.bind(this));

    // This is where things get gnarly
    this.ready = new Promise(function (resolve, reject) {

      var done = function done(isError) {
        console.log(_this.rtc);
        _this._log(2, "Tearing down event handlers");
        _this.clearTimeout();
        _this.proxyServer.off("cancel", _this._onError);
        _this.proxyServer.off("peer", onUser);
        _this.proxyServer.off("offer", onOffer);
        _this.proxyServer.off("ice", onIce);
        _this.proxyServer.off("answer", descriptionReceived);
        _this.rtc.onsignalingstatechange = null;
        _this.rtc.oniceconnectionstatechange = null;
        _this.rtc.onnegotiationneeded = null;
        _this.rtc.onicecandidate = null;

        _this.teardown();
        if (isError) {
          _this.close();
        }
      };

      // A pass-through function to include in the promise stream to see if the channels have all been
      // set up correctly and ready to go.
      var check = function check(obj) {
        if (_this.complete) {
          _this._log(1, "Timeout avoided.");
          done();
          resolve();
        }
        return obj;
      };

      // When an offer or an answer is received, it's pretty much the same exact processing. Either
      // type of object gets checked to see if it was expected, then unwrapped.
      var descriptionReceived = function descriptionReceived(description) {
        _this._log(1, "description", description);
        // Check to see if we expected this sort of message from this user.
        if (_this.isExpected(description.item.type, description)) {

          _this.recordProgress(description.item, "received");

          // The description we received is always the remote description, regardless of whether or not it's an offer
          // or an answer.
          return _this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

          // check to see if we're done.
          .then(check)

          // and if there are any errors, bomb out and shut everything down.
          .catch(_this._onError);
        }
      };

      // When an offer or an answer is created, it's pretty much the same exact processing. Either type
      // of object gets wrapped with a context identifying which peer channel is being negotiated, and
      // then transmitted through the negotiation server to the remote user.
      var descriptionCreated = function descriptionCreated(description) {
        _this.recordProgress(description, "created");

        // The description we create is always the local description, regardless of whether or not it's an offer
        // or an answer.
        return _this.rtc.setLocalDescription(description)

        // Let the remote user know what happened.
        .then(function () {
          return _this.proxyServer.emit(description.type, _this.wrap(description));
        })

        // check to see if we're done.
        .then(check)

        // and if there are any errors, bomb out and shut everything down.
        .catch(_this._onError);
      };

      // A catch-all error handler to shut down the world if an error we couldn't handle happens.
      _this._onError = function (exp) {
        _this._error(exp);
        _this.proxyServer.emit("cancel", exp);
        _this._log(1, "Timeout avoided, but only because of an error.");
        done(true);
        reject(exp);
      };

      // When an offer is received, we need to create an answer in reply.
      var onOffer = function onOffer(offer) {
        _this._log(1, "offer", offer);
        var promise = descriptionReceived(offer);
        if (promise) {
          return promise.then(function () {
            return _this.rtc.createAnswer();
          }).then(descriptionCreated);
        }
      };

      // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
      // with enough information for the remote user to be able to connect to it.
      var onIce = function onIce(ice) {
        _this._log(1, "ice", ice);
        // Check to see if we expected this sort of message from this user.
        if (_this.isExpected("ice", ice)) {
          // And if so, store it in our database of possibilities.
          var candidate = new RTCIceCandidate(ice.item);
          return _this.rtc.addIceCandidate(candidate).catch(_this._error);
        }
      };

      // This really long event handler is not really the start of the process. Skip ahead to `proxyServer.on("user", onUser)`
      var onUser = function onUser(evt) {
        // When a user is joining a room with more than one user currently, already in the room, they will have to
        // make several connection in sequence. The Socket.IO event handlers don't seem to reliably turn off, so
        // we have to make sure the message we here is the one meant for this particular instance of the socket manager.
        if (_this.isExpected("new user", evt)) {

          // When an answer is recieved, it's much simpler than receiving an offer. We just mark the progress and
          // check to see if we're done.
          _this.proxyServer.on("cancel", _this._onError);
          _this.proxyServer.on("answer", descriptionReceived);
          _this.proxyServer.on("offer", onOffer);
          _this.proxyServer.on("ice", onIce);

          // This is just for debugging purposes.
          _this.rtc.onsignalingstatechange = function (evt) {
            return _this._log(1, "[%s] Signal State: %s", instanceNumber, _this.rtc.signalingState);
          };
          _this.rtc.oniceconnectionstatechange = function (evt) {
            return _this._log(1, "[%s] ICE Connection/Gathering State: %s/%s", instanceNumber, _this.rtc.iceConnectionState, _this.rtc.iceGatheringState);
          };

          // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
          // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
          // you that negotiation is necessary, and only then create the offer. There is a race-condition between
          // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
          // don't wait for the appropriate time.
          _this.rtc.onnegotiationneeded = function (evt) {
            return _this.createOffer()
            // record the local description.
            .then(descriptionCreated);
          };

          // The API is going to figure out end-point configurations for us by communicating with the STUN servers
          // and seeing which end-points are visible and which require network address translation.
          _this.rtc.onicecandidate = function (evt) {

            // There is an error condition where sometimes the candidate returned in this event handler will be null.
            if (evt.candidate) {

              // Then let the remote user know of our folly.
              _this.proxyServer.emit("ice", _this.wrap(evt.candidate));
            }
          };

          _this.issueRequest();
        }
      };

      // We need to do two things, wait for the remote user to indicate they would like to peer, and...
      _this.proxyServer.on("peer", onUser);

      // ... let the server know to inform the remote user that we would like to peer. We need to delay a little
      // bit because it takes the remote user a little time between logging in and being ready to receive messages.
      setTimeout(function () {
        return _this.proxyServer.emit("peer", _this.wrap());
      }, 250);

      // Okay, now go back to onUser
    });
  }

  _createClass(WebRTCSocket, [{
    key: "startTimeout",
    value: function startTimeout() {
      if (this._timeout === null) {
        this._log(1, "Timing out in 10 seconds.");
        this._timeout = setTimeout(this.cancel.bind(this), PEERING_TIMEOUT_LENGTH);
      }
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout() {
        return _clearTimeout.apply(this, arguments);
      }

      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };

      return clearTimeout;
    }(function () {
      if (this._timeout !== null) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    })
  }, {
    key: "cancel",
    value: function cancel() {
      this._log(1, "Timed out!");
      this._onError("Gave up waiting on the peering connection.");
    }
  }, {
    key: "createOffer",
    value: function createOffer() {
      return this.rtc.createOffer();
    }
  }, {
    key: "recordProgress",
    value: function recordProgress(description, method) {
      this.progress[description.type][method] = true;
    }
  }, {
    key: "wrap",
    value: function wrap(item) {
      return {
        fromUserName: this.fromUserName,
        fromUserIndex: this.fromUserIndex,
        toUserName: this.toUserName,
        toUserIndex: this.toUserIndex,
        item: item
      };
    }
  }, {
    key: "isExpected",
    value: function isExpected(tag, obj) {
      var incomplete = !this.complete,
          fromUser = obj.fromUserName === this.toUserName,
          fromIndex = obj.fromUserIndex === this.toUserIndex,
          toUser = obj.toUserName === this.fromUserName,
          toIndex = obj.toUserIndex === this.fromUserIndex,
          isExpected = incomplete && fromUser && fromIndex && toUser && toIndex;

      this._log(1, "[%s->%s] I %s || FROM %s==%s (%s), %s==%s (%s) || TO %s==%s (%s), %s==%s (%s)", tag, isExpected, incomplete, obj.fromUserName, this.toUserName, fromUser, obj.fromUserIndex, this.toUserIndex, fromIndex, obj.toUserName, this.fromUserName, toUser, obj.toUserIndex, this.fromUserIndex, toIndex);
      this._log(2, obj);
      return isExpected;
    }
  }, {
    key: "close",
    value: function close() {
      if (this.rtc && this.rtc.signalingState !== "closed") {
        this.rtc.close();
        this.rtc = null;
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      throw new Error("Not implemented.");
    }
  }, {
    key: "issueRequest",
    value: function issueRequest() {
      throw new Error("Not implemented");
    }
  }, {
    key: "complete",
    get: function get() {
      return !this.rtc || this.rtc.signalingState === "closed";
    }
  }]);

  return WebRTCSocket;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9XZWJSVENTb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLElBQU0seUJBQXlCLEtBQS9COztBQUVBO0FBQ0EsT0FBTyxpQkFBUCxHQUNFLE9BQU8saUJBQVAsSUFDQSxPQUFPLHVCQURQLElBRUEsT0FBTyxvQkFIVDs7QUFLQSxPQUFPLGVBQVAsR0FDRSxPQUFPLGVBQVAsSUFDQSxPQUFPLGtCQUZUOztBQUlBLE9BQU8scUJBQVAsR0FDRSxPQUFPLHFCQUFQLElBQ0EsT0FBTyx3QkFGVDs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksY0FBYyxDQUFDO0FBQ2pCLE9BQUs7QUFEWSxDQUFELEVBRWY7QUFDRCxPQUFLO0FBREosQ0FGZSxFQUlmO0FBQ0QsT0FBSztBQURKLENBSmUsRUFNZjtBQUNELE9BQUs7QUFESixDQU5lLEVBUWY7QUFDRCxPQUFLO0FBREosQ0FSZSxDQUFsQjs7QUFZQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFQSxTQUFTLFVBQVQsQ0FBb0IsQ0FBcEIsRUFBdUI7QUFDckIsTUFBSSxLQUFLLEVBQUUsZUFBRixHQUNOLFFBRE0sRUFBVDtBQUVBLFNBQU8sR0FBRyxNQUFILEdBQVksQ0FBbkIsRUFBc0I7QUFDcEIsU0FBSyxNQUFNLEVBQVg7QUFDRDtBQUNELFNBQU8sRUFBRSxrQkFBRixHQUNKLE9BREksQ0FDSSxlQURKLEVBQ3FCLFVBQUMsQ0FBRCxFQUFJLENBQUo7QUFBQSxXQUFVLElBQUksR0FBSixHQUFVLEVBQXBCO0FBQUEsR0FEckIsQ0FBUDtBQUVEOztBQUVELE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxVQURFO0FBRVIsUUFBTSxjQUZFO0FBR1IsZUFBYSwyRkFITDtBQUlSLGNBQVksQ0FBQztBQUNYLFVBQU0saUJBREs7QUFFWCxVQUFNLE9BRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sYUFETDtBQUVELFVBQU0sV0FGTDtBQUdE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WUFMdkIsRUFLcUMsTUFMckMsRUFNRSxJQUFJLFdBTk4sRUFNbUIsS0FBSyxhQU54QixFQU11QyxPQU52QztBQU9BLFdBQUssSUFBTCxDQUFVLENBQVYsRUFBYSxHQUFiO0FBQ0EsYUFBTyxVQUFQO0FBQ0Q7Ozs0QkFFTztBQUNOLFlBQU0sTUFBTixDQUFhO0FBQ1gsZ0JBQVEsdUJBREc7QUFFWCxjQUFNLE9BRks7QUFHWCxxQkFBYTtBQUhGLE9BQWI7QUFLQSxVQUFJLEtBQUssR0FBTCxJQUFZLEtBQUssR0FBTCxDQUFTLGNBQVQsS0FBNEIsUUFBNUMsRUFBc0Q7QUFDcEQsYUFBSyxHQUFMLENBQVMsS0FBVDtBQUNBLGFBQUssR0FBTCxHQUFXLElBQVg7QUFDRDtBQUNGOzs7K0JBRVU7QUFDVCxZQUFNLE1BQU4sQ0FBYTtBQUNYLGdCQUFRLHVCQURHO0FBRVgsY0FBTSxVQUZLO0FBR1gscUJBQWE7QUFIRixPQUFiOztBQU1BLFlBQU0sSUFBSSxLQUFKLENBQVUsa0JBQVYsQ0FBTjtBQUNEOzs7bUNBYWM7QUFDYixZQUFNLFFBQU4sQ0FBZTtBQUNiLGdCQUFRLHVCQURLO0FBRWIsY0FBTSxjQUZPO0FBR2IscUJBQWE7QUFIQSxPQUFmOztBQU1BLFlBQU0sSUFBSSxLQUFKLENBQVUsaUJBQVYsQ0FBTjtBQUNEOzs7d0JBbkJjO0FBQ2IsWUFBTSxRQUFOLENBQWU7QUFDYixnQkFBUSx1QkFESztBQUViLGNBQU0sVUFGTztBQUdiLGlCQUFTLFNBSEk7QUFJYixxQkFBYTtBQUpBLE9BQWY7O0FBT0EsYUFBTyxDQUFDLEtBQUssR0FBTixJQUFhLEtBQUssR0FBTCxDQUFTLGNBQVQsS0FBNEIsUUFBaEQ7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvV2ViUlRDU29ja2V0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.WebRTCSocket = WebRTCSocket;
})();
(function(){
"use strict";

function Workerize(func) {
  var _this = this;

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
  script += "\n  if(instance.addEventListener){\n" + "    self.args = [null, null];\n" + "    for(var k in instance.listeners) {\n" + "      instance.addEventListener(k, function(eventName, args){\n" + "        self.args[0] = eventName;\n" + "        self.args[1] = args;\n" + "        postMessage(self.args);\n" + "      }.bind(this, k));\n" + "    }\n" + "  }";

  // Create a mapper from the worker-side onmessage event, to receive messages
  // from the UI thread that methods were called on the object.
  script += "\n\n  onmessage = function(evt){\n" + "    var f = evt.data[0],\n" + "        t = instance[f];\n" + "    if(t){\n" + "      t.call(instance, evt.data[1]);\n" + "    }\n" + "  };\n\n" + "})();";

  // The binary-large-object can be used to convert the script from text to a
  // data URI, because workers can only be created from same-origin URIs.
  this.worker = Workerize.createWorker(script, false);

  this.args = [null, null];

  // create a mapper from the UI-thread side onmessage event, to receive
  // messages from the worker thread that events occured and pass them on to
  // the UI thread.
  this.listeners = {};

  this.worker.onmessage = function (e) {
    return emit.call(_this, e.data[0], e.data[1]);
  };

  // create mappers from the UI-thread side method calls to the UI-thread side
  // postMessage method, to inform the worker thread that methods were called,
  // with parameters.
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

Workerize.prototype.methodShim = function (eventName, args) {
  this.args[0] = eventName;
  this.args[1] = args;
  this.worker.postMessage(this.args);
};

Workerize.prototype.addEventListener = function (evt, thunk) {
  if (!this.listeners[evt]) {
    this.listeners[evt] = [];
  }
  this.listeners[evt].push(thunk);
};

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Xb3JrZXJpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFVBREU7QUFFUixRQUFNLFdBRkU7QUFHUixlQUFhOzs2TEFITDtBQU1SLGNBQVksQ0FBQztBQUNYLFVBQU0sTUFESztBQUVYLFVBQU0sVUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxDQU5KO0FBV1IsWUFBVSxDQUFDO0FBQ1QsVUFBTSxrQ0FERztBQUVULGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFYRixDQUFaOztBQXFIQSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFBQTs7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBSSxTQUFTLEtBQUssUUFBTCxFQUFiOztBQUNFO0FBQ0E7QUFDQTtBQUNBLFlBQVUsT0FBTyxLQUFQLENBQWEsdUJBQWIsQ0FKWjtBQUFBLE1BS0UsT0FBTyxRQUFRLENBQVIsQ0FMVDtBQUFBLE1BTUUsQ0FORjs7QUFRQTtBQUNBLE9BQUssQ0FBTCxJQUFVLEtBQUssU0FBZixFQUEwQjtBQUN4QjtBQUNBO0FBQ0E7QUFDQSxjQUFVLFNBQVMsSUFBVCxHQUFnQixhQUFoQixHQUFnQyxDQUFoQyxHQUFvQyxLQUFwQyxHQUE0QyxLQUFLLFNBQUwsQ0FBZSxDQUFmLEVBQWtCLFFBQWxCLEVBQTVDLEdBQTJFLEdBQXJGO0FBQ0Q7O0FBRUQ7QUFDQTtBQUNBLFlBQVUsNENBQTRDLElBQTVDLEdBQW1ELFNBQTdEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVUseUNBQ1IsaUNBRFEsR0FFUiwwQ0FGUSxHQUdSLGlFQUhRLEdBSVIscUNBSlEsR0FLUixnQ0FMUSxHQU1SLG1DQU5RLEdBT1IsMkJBUFEsR0FR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Y0FBWSxDQUFDO0FBQ1gsVUFBTSxRQURLO0FBRVgsVUFBTSxtQkFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxXQURMO0FBRUQsVUFBTSxTQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLENBSkM7QUFhYixXQUFTO0FBYkksQ0FBZjtBQWVBLFVBQVUsWUFBVixHQUF5QixVQUFVLE1BQVYsRUFBa0IsU0FBbEIsRUFBNkI7QUFDcEQsTUFBSSxPQUFPLE1BQVAsS0FBa0IsVUFBdEIsRUFBa0M7QUFDaEMsYUFBUyxPQUFPLFFBQVAsRUFBVDtBQUNEOztBQUVELE1BQUksU0FBSixFQUFlO0FBQ2IsYUFBUyxPQUFPLElBQVAsRUFBVDtBQUNBLFFBQUksUUFBUSxPQUFPLE9BQVAsQ0FBZSxHQUFmLENBQVo7QUFDQSxhQUFTLE9BQU8sU0FBUCxDQUFpQixRQUFRLENBQXpCLEVBQTRCLE9BQU8sTUFBUCxHQUFnQixDQUE1QyxDQUFUO0FBQ0Q7O0FBRUQsTUFBSSxPQUFPLElBQUksSUFBSixDQUFTLENBQUMsTUFBRCxDQUFULEVBQW1CO0FBQzFCLFVBQU07QUFEb0IsR0FBbkIsQ0FBWDtBQUFBLE1BR0UsVUFBVSxJQUFJLGVBQUosQ0FBb0IsSUFBcEIsQ0FIWjs7QUFLQSxTQUFPLElBQUksTUFBSixDQUFXLE9BQVgsQ0FBUDtBQUNELENBakJEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9Xb3JrZXJpemUuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Workerize = Workerize;
})();
(function(){
"use strict";

var X = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9YLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsVUFETTtBQUVkLFFBQU0sR0FGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sSUFBSSxFQUFWIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9YLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.X = X;
})();
(function(){
"use strict";

function cascadeElement(id, tag, DOMClass, add) {
  var elem = null;
  if (id === null) {
    elem = document.createElement(tag);
    elem.id = id = "auto_" + tag + Date.now();
  } else if (DOMClass === undefined || id instanceof DOMClass) {
    elem = id;
  } else if (typeof id === "string") {
    elem = document.getElementById(id);
    if (elem === null) {
      elem = document.createElement(tag);
      elem.id = id;
      if (add) {
        document.body.appendChild(elem);
      }
    } else if (elem.tagName !== tag.toUpperCase()) {
      elem = null;
    }
  }

  if (elem === null) {
    throw new Error(id + " does not refer to a valid " + tag + " element.");
  }
  return elem;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9ET00vY2FzY2FkZUVsZW1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGNBREs7QUFFYixRQUFNLGdCQUZPO0FBR2IsV0FBUyxTQUhJO0FBSWIsY0FBWSxDQUFDO0FBQ1gsVUFBTSxJQURLO0FBRVgsVUFBTSxrQkFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxLQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLEVBUVQ7QUFDRCxVQUFNLFVBREw7QUFFRCxVQUFNLE9BRkw7QUFHRCxpQkFBYTtBQUhaLEdBUlMsQ0FKQztBQWlCYixlQUFhOzs7Ozs7dUVBakJBO0FBd0JiLFlBQVUsQ0FBQztBQUNULFVBQU0sMkNBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQsRUFrQlA7QUFDRCxVQUFNLHdCQURMO0FBRUQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGWixHQWxCTyxFQW9DUDtBQUNELFVBQU0sb0JBREw7QUFFRCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZaLEdBcENPO0FBeEJHLENBQWY7O0FBb0ZBLFNBQVMsY0FBVCxDQUF3QixFQUF4QixFQUE0QixHQUE1QixFQUFpQyxRQUFqQyxFQUEyQyxHQUEzQyxFQUFnRDtBQUM5QyxNQUFJLE9BQU8sSUFBWDtBQUNBLE1BQUksT0FBTyxJQUFYLEVBQWlCO0FBQ2YsV0FBTyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBUDtBQUNBLFNBQUssRUFBTCxHQUFVLEtBQUssVUFBVSxHQUFWLEdBQWdCLEtBQUssR0FBTCxFQUEvQjtBQUNELEdBSEQsTUFJSyxJQUFJLGFBQWEsU0FBYixJQUEwQixjQUFjLFFBQTVDLEVBQXNEO0FBQ3pELFdBQU8sRUFBUDtBQUNELEdBRkksTUFHQSxJQUFJLE9BQVEsRUFBUixLQUFnQixRQUFwQixFQUE4QjtBQUNqQyxXQUFPLFNBQVMsY0FBVCxDQUF3QixFQUF4QixDQUFQO0FBQ0EsUUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsYUFBTyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBUDtBQUNBLFdBQUssRUFBTCxHQUFVLEVBQVY7QUFDQSxVQUFJLEdBQUosRUFBUztBQUNQLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLElBQTFCO0FBQ0Q7QUFDRixLQU5ELE1BT0ssSUFBSSxLQUFLLE9BQUwsS0FBaUIsSUFBSSxXQUFKLEVBQXJCLEVBQXdDO0FBQzNDLGFBQU8sSUFBUDtBQUNEO0FBQ0Y7O0FBRUQsTUFBSSxTQUFTLElBQWIsRUFBbUI7QUFDakIsVUFBTSxLQUFOLENBQVk7QUFDVixZQUFNLGlCQURJO0FBRVYsWUFBTSxPQUZJO0FBR1YsbUJBQWE7QUFISCxLQUFaO0FBS0EsVUFBTSxJQUFJLEtBQUosQ0FBVSxLQUFLLDZCQUFMLEdBQXFDLEdBQXJDLEdBQTJDLFdBQXJELENBQU47QUFDRDtBQUNELFNBQU8sSUFBUDtBQUNEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9ET00vY2FzY2FkZUVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.DOM.cascadeElement = cascadeElement;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9ET00vZmluZEV2ZXJ5dGhpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGNBREs7QUFFYixRQUFNLGdCQUZPO0FBR2IsZUFBYTs7Ozs7OzRJQUhBO0FBVWIsY0FBWSxDQUFDO0FBQ1gsVUFBTSxNQURLO0FBRVgsVUFBTSxTQUZLO0FBR1gsY0FBVSxJQUhDO0FBSVgsaUJBQWEsd0NBSkY7QUFLWCxhQUFTO0FBTEUsR0FBRCxFQU1UO0FBQ0QsVUFBTSxLQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWE7QUFKWixHQU5TLENBVkM7QUFzQmIsV0FBUyxRQXRCSTtBQXVCYixZQUFVLENBQUM7QUFDVCxVQUFNLHlCQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQXZCRyxDQUFmOztBQW1EQSxTQUFTLGNBQVQsQ0FBd0IsSUFBeEIsRUFBOEIsR0FBOUIsRUFBbUM7QUFDakMsU0FBTyxRQUFRLFFBQWY7QUFDQSxRQUFNLE9BQU8sRUFBYjtBQUNBLE1BQUksTUFBTSxLQUFLLGdCQUFMLENBQXNCLEdBQXRCLENBQVY7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksSUFBSSxNQUF4QixFQUFnQyxFQUFFLENBQWxDLEVBQXFDO0FBQ25DLFFBQUksSUFBSSxJQUFJLENBQUosQ0FBUjtBQUNBLFFBQUksRUFBRSxFQUFGLElBQVEsRUFBRSxFQUFGLENBQUssTUFBTCxHQUFjLENBQTFCLEVBQTZCO0FBQzNCLFVBQUksRUFBRSxFQUFOLElBQVksQ0FBWjtBQUNBLFVBQUksRUFBRSxhQUFOLEVBQXFCO0FBQ25CLFVBQUUsYUFBRixDQUFnQixFQUFFLEVBQWxCLElBQXdCLENBQXhCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsU0FBTyxHQUFQO0FBQ0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0RPTS9maW5kRXZlcnl0aGluZy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.DOM.findEverything = findEverything;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9ET00vbWFrZUhpZGluZ0NvbnRhaW5lci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsY0FESztBQUViLFFBQU0scUJBRk87QUFHYixlQUFhOzs7d0ZBSEE7QUFPYixjQUFZLENBQUM7QUFDWCxVQUFNLElBREs7QUFFWCxVQUFNLGtCQUZLO0FBR1gsaUJBQWE7OztBQUhGLEdBQUQsRUFNVDtBQUNELFVBQU0sS0FETDtBQUVELFVBQU0sU0FGTDtBQUdELGlCQUFhO0FBSFosR0FOUyxDQVBDO0FBa0JiLFdBQVM7QUFsQkksQ0FBZjs7QUFxQkEsU0FBUyxtQkFBVCxDQUE2QixFQUE3QixFQUFpQyxHQUFqQyxFQUFzQztBQUNwQyxNQUFJLE9BQU8sU0FBUyxHQUFULENBQWEsY0FBYixDQUE0QixFQUE1QixFQUFnQyxLQUFoQyxFQUF1QyxPQUFPLGNBQTlDLENBQVg7QUFDQSxPQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQXNCLFVBQXRCO0FBQ0EsT0FBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixDQUFsQjtBQUNBLE9BQUssS0FBTCxDQUFXLEdBQVgsR0FBaUIsQ0FBakI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxLQUFYLEdBQW1CLENBQW5CO0FBQ0EsT0FBSyxLQUFMLENBQVcsTUFBWCxHQUFvQixDQUFwQjtBQUNBLE9BQUssS0FBTCxDQUFXLFFBQVgsR0FBc0IsUUFBdEI7QUFDQSxPQUFLLFdBQUwsQ0FBaUIsR0FBakI7QUFDQSxTQUFPLElBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvRE9NL21ha2VIaWRpbmdDb250YWluZXIuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.DOM.makeHidingContainer = makeHidingContainer;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var AbstractLabel = function (_Primrose$Surface) {
  _inherits(AbstractLabel, _Primrose$Surface);

  function AbstractLabel(options) {
    _classCallCheck(this, AbstractLabel);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AbstractLabel).call(this, patch(options, {
      id: "Primrose.Controls.AbstractLabel[" + COUNTER++ + "]"
    })));
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////


    _this._lastFont = null;
    _this._lastText = null;
    _this._lastCharacterWidth = null;
    _this._lastCharacterHeight = null;
    _this._lastPadding = null;
    _this._lastWidth = -1;
    _this._lastHeight = -1;
    _this._lastTextAlign = null;

    _this.textAlign = _this.options.textAlign;
    _this.character = new Primrose.Text.Size();
    _this.theme = _this.options.theme;
    _this.fontSize = _this.options.fontSize || 16;
    _this.refreshCharacter();
    _this.backgroundColor = _this.options.backgroundColor || _this.theme.regular.backColor;
    _this.color = _this.options.color || _this.theme.regular.foreColor;
    _this.value = _this.options.value;
    return _this;
  }

  _createClass(AbstractLabel, [{
    key: "refreshCharacter",
    value: function refreshCharacter() {
      this.character.height = this.fontSize;
      this.context.font = this.character.height + "px " + this.theme.fontFamily;
      // measure 100 letter M's, then divide by 100, to get the width of an M
      // to two decimal places on systems that return integer values from
      // measureText.
      this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
    }
  }, {
    key: "_isChanged",
    value: function _isChanged() {
      var textChanged = this._lastText !== this.value,
          characterWidthChanged = this.character.width !== this._lastCharacterWidth,
          characterHeightChanged = this.character.height !== this._lastCharacterHeight,
          fontChanged = this.context.font !== this._lastFont,
          alignChanged = this.textAlign !== this._lastTextAlign,
          changed = this.resized || textChanged || characterWidthChanged || characterHeightChanged || this.resized || fontChanged || alignChanged;
      return changed;
    }
  }, {
    key: "render",
    value: function render() {
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

            var font = (this.theme.regular.fontWeight || "") + " " + (this.theme.regular.fontStyle || "") + " " + this.character.height + "px " + this.theme.fontFamily;
            this.context.font = font.trim();
            this.context.fillStyle = this.color;
            this.context.fillText(line, textX, textY);
          }
        }

        this.renderCanvasTrim();

        this.invalidate();
      }
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {}
  }, {
    key: "textAlign",
    get: function get() {
      return this.context.textAlign;
    },
    set: function set(v) {
      this.context.textAlign = v;
      this.render();
    }
  }, {
    key: "value",
    get: function get() {
      return this._value;
    },
    set: function set(txt) {
      txt = txt || "";
      this._value = txt.replace(/\r\n/g, "\n");
      this.render();
    }
  }, {
    key: "theme",
    get: function get() {
      return this._theme;
    },
    set: function set(t) {
      this._theme = clone(t || Primrose.Text.Themes.Default);
      this._theme.fontSize = this.fontSize;
      this.refreshCharacter();
      this.render();
    }
  }]);

  return AbstractLabel;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9BYnN0cmFjdExhYmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBSSxVQUFVLENBQWQ7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLG1CQURFO0FBRVIsUUFBTSxlQUZFO0FBR1IsZUFBYSw2Q0FITDtBQUlSLGFBQVcsa0JBSkg7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLHFCQURLO0FBRVgsVUFBTSx5REFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxTQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTO0FBTEosQ0FBWjs7SUFlTSxhOzs7QUFDSix5QkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBUW5CO0FBQ0E7QUFDQTs7QUFWbUIsaUdBSWIsTUFBTSxPQUFOLEVBQWU7QUFDbkIsVUFBSSxxQ0FBc0MsU0FBdEMsR0FBbUQ7QUFEcEMsS0FBZixDQUphO0FBQ25CO0FBQ0E7QUFDQTs7O0FBU0EsVUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLElBQWpCO0FBQ0EsVUFBSyxtQkFBTCxHQUEyQixJQUEzQjtBQUNBLFVBQUssb0JBQUwsR0FBNEIsSUFBNUI7QUFDQSxVQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxVQUFLLFVBQUwsR0FBa0IsQ0FBQyxDQUFuQjtBQUNBLFVBQUssV0FBTCxHQUFtQixDQUFDLENBQXBCO0FBQ0EsVUFBSyxjQUFMLEdBQXNCLElBQXRCOztBQUVBLFVBQUssU0FBTCxHQUFpQixNQUFLLE9BQUwsQ0FBYSxTQUE5QjtBQUNBLFVBQUssU0FBTCxHQUFpQixJQUFJLFNBQVMsSUFBVCxDQUFjLElBQWxCLEVBQWpCO0FBQ0EsVUFBSyxLQUFMLEdBQWEsTUFBSyxPQUFMLENBQWEsS0FBMUI7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsTUFBSyxPQUFMLENBQWEsUUFBYixJQUF5QixF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QUFHQSxnQkFBSSxRQUFRLElBQVo7QUFDQSxvQkFBUSxLQUFLLFNBQWI7QUFDRSxtQkFBSyxPQUFMO0FBQ0Usd0JBQVEsS0FBSyxVQUFiO0FBQ0E7QUFDRixtQkFBSyxRQUFMO0FBQ0Usd0JBQVEsS0FBSyxVQUFMLEdBQWtCLENBQTFCO0FBQ0E7QUFDRjtBQUNFLHdCQUFRLENBQVI7QUFSSjs7QUFXQSxnQkFBSSxPQUFPLENBQUMsS0FBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixVQUFuQixJQUFpQyxFQUFsQyxJQUNULEdBRFMsSUFDRixLQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLFNBQW5CLElBQWdDLEVBRDlCLElBRVQsR0FGUyxHQUVILEtBQUssU0FBTCxDQUFlLE1BRlosR0FFcUIsS0FGckIsR0FFNkIsS0FBSyxLQUFMLENBQVcsVUFGbkQ7QUFHQSxpQkFBSyxPQUFMLENBQWEsSUFBYixHQUFvQixLQUFLLElBQUwsRUFBcEI7QUFDQSxpQkFBSyxPQUFMLENBQWEsU0FBYixHQUF5QixLQUFLLEtBQTlCO0FBQ0EsaUJBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsSUFBdEIsRUFBNEIsS0FBNUIsRUFBbUMsS0FBbkM7QUFDRDtBQUNGOztBQUVELGFBQUssZ0JBQUw7O0FBRUEsYUFBSyxVQUFMO0FBQ0Q7QUFDRjs7O3VDQUVrQixDQUFFOzs7d0JBNUdMO0FBQ2QsYUFBTyxLQUFLLE9BQUwsQ0FBYSxTQUFwQjtBQUNELEs7c0JBRWEsQyxFQUFHO0FBQ2YsV0FBSyxPQUFMLENBQWEsU0FBYixHQUF5QixDQUF6QjtBQUNBLFdBQUssTUFBTDtBQUNEOzs7d0JBRVc7QUFDVixhQUFPLEtBQUssTUFBWjtBQUNELEs7c0JBRVMsRyxFQUFLO0FBQ2IsWUFBTSxPQUFPLEVBQWI7QUFDQSxXQUFLLE1BQUwsR0FBYyxJQUFJLE9BQUosQ0FBWSxPQUFaLEVBQXFCLElBQXJCLENBQWQ7QUFDQSxXQUFLLE1BQUw7QUFDRDs7O3dCQUVXO0FBQ1YsYUFBTyxLQUFLLE1BQVo7QUFDRCxLO3NCQUVTLEMsRUFBRztBQUNYLFdBQUssTUFBTCxHQUFjLE1BQU0sS0FBSyxTQUFTLElBQVQsQ0FBYyxNQUFkLENBQXFCLE9BQWhDLENBQWQ7QUFDQSxXQUFLLE1BQUwsQ0FBWSxRQUFaLEdBQXVCLEtBQUssUUFBNUI7QUFDQSxXQUFLLGdCQUFMO0FBQ0EsV0FBSyxNQUFMO0FBQ0Q7Ozs7RUE1RHlCLFNBQVMsTyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvQ29udHJvbHMvQWJzdHJhY3RMYWJlbC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Controls.AbstractLabel = AbstractLabel;
})();
(function(){
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var Button2D = function (_Primrose$Controls$Ab) {
  _inherits(Button2D, _Primrose$Controls$Ab);

  _createClass(Button2D, null, [{
    key: "create",
    value: function create() {
      return new Button2D();
    }
  }]);

  function Button2D(options) {
    _classCallCheck(this, Button2D);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button2D).call(this, patch(options, {
      id: "Primrose.Controls.Button2D[" + COUNTER++ + "]",
      textAlign: "center"
    })));

    _this._lastActivated = null;
    return _this;
  }

  _createClass(Button2D, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var btn3d = env.buttonFactory.create();
      btn3d.listeners = this.listeners;
      return env.appendChild(btn3d);
    }
  }, {
    key: "startPointer",
    value: function startPointer(x, y) {
      this.focus();
      this._activated = true;
      this.render();
    }
  }, {
    key: "endPointer",
    value: function endPointer() {
      if (this._activated) {
        this._activated = false;
        emit.call(this, "click", {
          target: this
        });
        this.render();
      }
    }
  }, {
    key: "_isChanged",
    value: function _isChanged() {
      var activatedChanged = this._activated !== this._lastActivated,
          changed = _get(Object.getPrototypeOf(Button2D.prototype), "_isChanged", this) || activatedChanged;
      return changed;
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {
      this.context.lineWidth = this._activated ? 4 : 2;
      this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
      this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);
    }
  }]);

  return Button2D;
}(Primrose.Controls.AbstractLabel);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24yRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBSSxVQUFVLENBQWQ7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLG1CQURFO0FBRVIsUUFBTSxVQUZFO0FBR1IsZUFBYSxzQ0FITDtBQUlSLGFBQVcsaUNBSkg7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLHFCQURLO0FBRVgsVUFBTSx5REFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxTQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTO0FBTEosQ0FBWjs7SUFlTSxROzs7Ozs2QkFFWTtBQUNkLGFBQU8sSUFBSSxRQUFKLEVBQVA7QUFDRDs7O0FBRUQsb0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBLDRGQUNiLE1BQU0sT0FBTixFQUFlO0FBQ25CLFVBQUksZ0NBQWlDLFNBQWpDLEdBQThDLEdBRC9CO0FBRW5CLGlCQUFXO0FBRlEsS0FBZixDQURhOztBQUtuQixVQUFLLGNBQUwsR0FBc0IsSUFBdEI7QUFMbUI7QUFNcEI7Ozs7NENBRXVCLEcsRUFBSyxLLEVBQU87QUFDbEMsVUFBSSxRQUFRLElBQUksYUFBSixDQUFrQixNQUFsQixFQUFaO0FBQ0EsWUFBTSxTQUFOLEdBQWtCLEtBQUssU0FBdkI7QUFDQSxhQUFPLElBQUksV0FBSixDQUFnQixLQUFoQixDQUFQO0FBQ0Q7OztpQ0FFWSxDLEVBQUcsQyxFQUFHO0FBQ2pCLFdBQUssS0FBTDtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFdBQUssTUFBTDtBQUNEOzs7aUNBRVk7QUFDWCxVQUFJLEtBQUssVUFBVCxFQUFxQjtBQUNuQixhQUFLLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLEVBQXlCO0FBQ3ZCLGtCQUFRO0FBRGUsU0FBekI7QUFHQSxhQUFLLE1BQUw7QUFDRDtBQUNGOzs7aUNBRVk7QUFDWCxVQUFJLG1CQUFtQixLQUFLLFVBQUwsS0FBb0IsS0FBSyxjQUFoRDtBQUFBLFVBQ0UsVUFBVSx1RUFBb0IsZ0JBRGhDO0FBRUEsYUFBTyxPQUFQO0FBQ0Q7Ozt1Q0FFa0I7QUFDakIsV0FBSyxPQUFMLENBQWEsU0FBYixHQUF5QixLQUFLLFVBQUwsR0FBa0IsQ0FBbEIsR0FBc0IsQ0FBL0M7QUFDQSxXQUFLLE9BQUwsQ0FBYSxXQUFiLEdBQTJCLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsU0FBbkIsSUFBZ0MsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFxQixPQUFyQixDQUE2QixPQUE3QixDQUFxQyxTQUFoRztBQUNBLFdBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsQ0FBeEIsRUFBMkIsQ0FBM0IsRUFBOEIsS0FBSyxVQUFuQyxFQUErQyxLQUFLLFdBQXBEO0FBQ0Q7Ozs7RUE5Q29CLFNBQVMsUUFBVCxDQUFrQixhIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24yRC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Controls.Button2D = Button2D;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button3D = function (_Primrose$BaseControl) {
  _inherits(Button3D, _Primrose$BaseControl);

  function Button3D(model, name, options) {
    _classCallCheck(this, Button3D);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button3D).call(this));

    options = patch(options, Button3D);
    options.minDeflection = Math.cos(options.minDeflection);
    options.colorUnpressed = new THREE.Color(options.colorUnpressed);
    options.colorPressed = new THREE.Color(options.colorPressed);

    _this.listeners.click = [];

    _this.listeners.release = [];

    _this.base = model.children[1];

    _this.cap = model.children[0];
    _this.cap.name = name;
    _this.cap.material = _this.cap.material.clone();
    _this.cap.button = _this;
    _this.cap.base = _this.base;

    _this.container = new THREE.Object3D();
    _this.container.add(_this.base);
    _this.container.add(_this.cap);

    _this.color = _this.cap.material.color;
    _this.name = name;
    _this.element = null;
    _this.startUV = function () {
      this.color.copy(options.colorPressed);
      if (this.element) {
        this.element.click();
      } else {
        emit.call(this, "click");
      }
    };

    _this.moveUV = function () {};

    _this.endPointer = function () {
      this.color.copy(options.colorUnpressed);
      emit.call(this, "release");
    };
    return _this;
  }

  _createClass(Button3D, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      scene.add(this.container);
      env.registerPickableObject(this.cap);
      return this.container;
    }
  }, {
    key: "position",
    get: function get() {
      return this.container.position;
    }
  }]);

  return Button3D;
}(Primrose.BaseControl);

Button3D.DEFAULTS = {
  maxThrow: 0.1,
  minDeflection: 10,
  colorUnpressed: 0x7f0000,
  colorPressed: 0x007f00,
  toggle: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24zRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxVQURFO0FBRVIsUUFBTSxVQUZFO0FBR1IsYUFBVyxzQkFISDtBQUlSLGNBQVksQ0FBQztBQUNYLFVBQU0sT0FESztBQUVYLFVBQU0sZ0JBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sTUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxTQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLENBSko7QUFpQlIsZUFBYTtBQWpCTCxDQUFaOztJQW1CTSxROzs7QUFDSixvQkFBWSxLQUFaLEVBQW1CLElBQW5CLEVBQXlCLE9BQXpCLEVBQWtDO0FBQUE7O0FBQUE7O0FBR2hDLGNBQVUsTUFBTSxPQUFOLEVBQWUsUUFBZixDQUFWO0FBQ0EsWUFBUSxhQUFSLEdBQXdCLEtBQUssR0FBTCxDQUFTLFFBQVEsYUFBakIsQ0FBeEI7QUFDQSxZQUFRLGNBQVIsR0FBeUIsSUFBSSxNQUFNLEtBQVYsQ0FBZ0IsUUFBUSxjQUF4QixDQUF6QjtBQUNBLFlBQVEsWUFBUixHQUF1QixJQUFJLE1BQU0sS0FBVixDQUFnQixRQUFRLFlBQXhCLENBQXZCOztBQUVBLFVBQU0sS0FBTixDQUFZO0FBQ1YsWUFBTSxPQURJO0FBRVYsbUJBQWE7QUFGSCxLQUFaO0FBSUEsVUFBSyxTQUFMLENBQWUsS0FBZixHQUF1QixFQUF2Qjs7QUFFQSxVQUFNLEtBQU4sQ0FBWTtBQUNWLFlBQU0sU0FESTtBQUVWLG1CQUFhO0FBRkgsS0FBWjtBQUlBLFVBQUssU0FBTCxDQUFlLE9BQWYsR0FBeUIsRUFBekI7O0FBRUEsVUFBTSxRQUFOLENBQWU7QUFDYixZQUFNLE1BRE87QUFFYixZQUFNLGdCQUZPO0FBR2IsbUJBQWE7QUFIQSxLQUFmO0FBS0EsVUFBSyxJQUFMLEdBQVksTUFBTSxRQUFOLENBQWUsQ0FBZixDQUFaOztBQUVBLFVBQU0sUUFBTixDQUFlO0FBQ2IsWUFBTSxNQURPO0FBRWIsWUFBTSxnQkFGTztBQUdiLG1CQUFhO0FBSEEsS0FBZjtBQUtBLFVBQUssR0FBTCxHQUFXLE1BQU0sUUFBTixDQUFlLENBQWYsQ0FBWDtBQUNBLFVBQUssR0FBTCxDQUFTLElBQVQsR0FBZ0IsSUFBaEI7QUFDQSxVQUFLLEdBQUwsQ0FBUyxRQUFULEdBQW9CLE1BQUssR0FBTCxDQUFTLFFBQVQsQ0FBa0IsS0FBbEIsRUFBcEI7QUFDQSxVQUFLLEdBQUwsQ0FBUyxNQUFUO0FBQ0EsVUFBSyxHQUFMLENBQVMsSUFBVCxHQUFnQixNQUFLLElBQXJCOztBQUVBLFVBQU0sUUFBTixDQUFlO0FBQ2IsWUFBTSxXQURPO0FBRWIsWUFBTSxnQkFGTztBQUdiLG1CQUFhO0FBSEEsS0FBZjtBQUtBLFVBQUssU0FBTCxHQUFpQixJQUFJLE1BQU0sUUFBVixFQUFqQjtBQUNBLFVBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsTUFBSyxJQUF4QjtBQUNBLFVBQUssU0FBTCxDQUFlLEdBQWYsQ0FBbUIsTUFBSyxHQUF4Qjs7QUFFQSxVQUFNLFFBQU4sQ0FBZTtBQUNiLFlBQU0sT0FETztBQUViLFlBQU0sUUFGTztBQUdiLG1CQUFhO0FBSEEsS0FBZjtBQUtBLFVBQUssS0FBTCxHQUFhLE1BQUssR0FBTCxDQUFTLFFBQVQsQ0FBa0IsS0FBL0I7QUFDQSxVQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsVUFBSyxPQUFMLEdBQWUsSUFBZjtBQUNBLFVBQUssT0FBTCxHQUFlLFlBQVk7QUFDekIsV0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixRQUFRLFlBQXhCO0FBQ0EsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxPQUFMLENBQWEsS0FBYjtBQUNELE9BRkQsTUFHSztBQUNILGFBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsT0FBaEI7QUFDRDtBQUNGLEtBUkQ7O0FBVUEsVUFBSyxNQUFMLEdBQWMsWUFBWSxDQUV6QixDQUZEOztBQUlBLFVBQUssVUFBTCxHQUFrQixZQUFZO0FBQzVCLFdBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsUUFBUSxjQUF4QjtBQUNBLFdBQUssSUFBTCxDQUFVLElBQVYsRUFBZ0IsU0FBaEI7QUFDRCxLQUhEO0FBckVnQztBQXlFakM7Ozs7NENBTXVCLEcsRUFBSyxLLEVBQU87QUFDbEMsWUFBTSxHQUFOLENBQVUsS0FBSyxTQUFmO0FBQ0EsVUFBSSxzQkFBSixDQUEyQixLQUFLLEdBQWhDO0FBQ0EsYUFBTyxLQUFLLFNBQVo7QUFDRDs7O3dCQVJjO0FBQ2IsYUFBTyxLQUFLLFNBQUwsQ0FBZSxRQUF0QjtBQUNEOzs7O0VBOUVvQixTQUFTLFc7O0FBdUZoQyxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsNEJBREc7QUFFWCxRQUFNLFVBRks7QUFHWCxlQUFhO0FBSEYsQ0FBYjs7QUFPQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsNEJBREs7QUFFYixRQUFNLFVBRk87QUFHYixRQUFNLGVBSE87QUFJYixlQUFhO0FBSkEsQ0FBZjtBQU1BLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxxQ0FERTtBQUVWLFFBQU0sVUFGSTtBQUdWLFFBQU0sUUFISTtBQUlWLGVBQWE7QUFKSCxDQUFaO0FBTUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLHFDQURFO0FBRVYsUUFBTSxlQUZJO0FBR1YsUUFBTSxRQUhJO0FBSVYsZUFBYTtBQUpILENBQVo7QUFNQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEscUNBREU7QUFFVixRQUFNLGdCQUZJO0FBR1YsUUFBTSxRQUhJO0FBSVYsZUFBYTtBQUpILENBQVo7QUFNQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEscUNBREU7QUFFVixRQUFNLGNBRkk7QUFHVixRQUFNLFFBSEk7QUFJVixlQUFhO0FBSkgsQ0FBWjtBQU1BLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxxQ0FERTtBQUVWLFFBQU0sUUFGSTtBQUdWLFFBQU0sU0FISTtBQUlWLGVBQWE7QUFKSCxDQUFaO0FBTUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCLFlBQVUsR0FEUTtBQUVsQixpQkFBZSxFQUZHO0FBR2xCLGtCQUFnQixRQUhFO0FBSWxCLGdCQUFjLFFBSkk7QUFLbEIsVUFBUTtBQUxVLENBQXBCIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9Db250cm9scy9CdXR0b24zRC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Controls.Button3D = Button3D;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;
var Form = function (_Primrose$Surface) {
  _inherits(Form, _Primrose$Surface);

  _createClass(Form, null, [{
    key: "create",
    value: function create() {
      return new Form();
    }
  }]);

  function Form(options) {
    _classCallCheck(this, Form);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, patch(options, {
      id: "Primrose.Controls.Form[" + COUNTER++ + "]"
    })));

    _this._mesh = textured(quad(1, _this.bounds.height / _this.bounds.width), _this);
    _this._mesh.name = _this.id + "-mesh";
    Object.defineProperties(_this.style, {
      display: {
        get: function get() {
          return _this._mesh.visible ? "" : "none";
        },
        set: function set(v) {
          if (v === "none") {
            _this.hide();
          } else {
            _this.show();
          }
        }
      },
      visible: {
        get: function get() {
          return _this._mesh.visible ? "" : "hidden";
        },
        set: function set(v) {
          return _this.visible = v !== "hidden";
        }
      }
    });
    return _this;
  }

  _createClass(Form, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      scene.add(this._mesh);
      env.registerPickableObject(this._mesh);
      return this._mesh;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.visible = false;
      this.disabled = true;
    }
  }, {
    key: "show",
    value: function show() {
      this.visible = true;
      this.disabled = false;
    }
  }, {
    key: "position",
    get: function get() {
      return this._mesh.position;
    }
  }, {
    key: "visible",
    get: function get() {
      return this._mesh.visible;
    },
    set: function set(v) {
      this._mesh.visible = v;
    }
  }, {
    key: "disabled",
    get: function get() {
      return this._mesh.disabled;
    },
    set: function set(v) {
      this._mesh.disabled = v;
    }
  }, {
    key: "enabled",
    get: function get() {
      return !this.disabled;
    },
    set: function set(v) {
      this.disabled = !v;
    }
  }]);

  return Form;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9Gb3JtLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBSSxVQUFVLENBQWQ7QUFDQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsbUJBREU7QUFFUixRQUFNLE1BRkU7QUFHUixhQUFXLGlCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sSTs7Ozs7NkJBRVk7QUFDZCxhQUFPLElBQUksSUFBSixFQUFQO0FBQ0Q7OztBQUVELGdCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSx3RkFDYixNQUFNLE9BQU4sRUFBZTtBQUNuQixzQ0FBOEIsU0FBOUI7QUFEbUIsS0FBZixDQURhOztBQUluQixVQUFLLEtBQUwsR0FBYSxTQUFTLEtBQUssQ0FBTCxFQUFRLE1BQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsTUFBSyxNQUFMLENBQVksS0FBekMsQ0FBVCxRQUFiO0FBQ0EsVUFBSyxLQUFMLENBQVcsSUFBWCxHQUFrQixNQUFLLEVBQUwsR0FBVSxPQUE1QjtBQUNBLFdBQU8sZ0JBQVAsQ0FBd0IsTUFBSyxLQUE3QixFQUFvQztBQUNsQyxlQUFTO0FBQ1AsYUFBSztBQUFBLGlCQUFNLE1BQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsRUFBckIsR0FBMEIsTUFBaEM7QUFBQSxTQURFO0FBRVAsYUFBSyxhQUFDLENBQUQsRUFBTztBQUNWLGNBQUksTUFBTSxNQUFWLEVBQWtCO0FBQ2hCLGtCQUFLLElBQUw7QUFDRCxXQUZELE1BR0s7QUFDSCxrQkFBSyxJQUFMO0FBQ0Q7QUFDRjtBQVRNLE9BRHlCO0FBWWxDLGVBQVM7QUFDUCxhQUFLO0FBQUEsaUJBQU0sTUFBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixFQUFyQixHQUEwQixRQUFoQztBQUFBLFNBREU7QUFFUCxhQUFLLGFBQUMsQ0FBRDtBQUFBLGlCQUFPLE1BQUssT0FBTCxHQUFlLE1BQU0sUUFBNUI7QUFBQTtBQUZFO0FBWnlCLEtBQXBDO0FBTm1CO0FBdUJwQjs7Ozs0Q0FFdUIsRyxFQUFLLEssRUFBTztBQUNsQyxZQUFNLEdBQU4sQ0FBVSxLQUFLLEtBQWY7QUFDQSxVQUFJLHNCQUFKLENBQTJCLEtBQUssS0FBaEM7QUFDQSxhQUFPLEtBQUssS0FBWjtBQUNEOzs7MkJBOEJNO0FBQ0wsV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLFdBQUssUUFBTCxHQUFnQixJQUFoQjtBQUNEOzs7MkJBRU07QUFDTCxXQUFLLE9BQUwsR0FBZSxJQUFmO0FBQ0EsV0FBSyxRQUFMLEdBQWdCLEtBQWhCO0FBQ0Q7Ozt3QkFwQ2M7QUFDYixhQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCO0FBQ0Q7Ozt3QkFFYTtBQUNaLGFBQU8sS0FBSyxLQUFMLENBQVcsT0FBbEI7QUFDRCxLO3NCQUVXLEMsRUFBRztBQUNiLFdBQUssS0FBTCxDQUFXLE9BQVgsR0FBcUIsQ0FBckI7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQjtBQUNELEs7c0JBRVksQyxFQUFHO0FBQ2QsV0FBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixDQUF0QjtBQUNEOzs7d0JBRWE7QUFDWixhQUFPLENBQUMsS0FBSyxRQUFiO0FBQ0QsSztzQkFFVyxDLEVBQUc7QUFDYixXQUFLLFFBQUwsR0FBZ0IsQ0FBQyxDQUFqQjtBQUNEOzs7O0VBL0RnQixTQUFTLE8iLCJmaWxlIjoic3JjL1ByaW1yb3NlL0NvbnRyb2xzL0Zvcm0uanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Controls.Form = Form;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var HtmlDoc = function (_Primrose$Surface) {
  _inherits(HtmlDoc, _Primrose$Surface);

  _createClass(HtmlDoc, null, [{
    key: "create",
    value: function create() {
      return new HtmlDoc();
    }
  }]);

  function HtmlDoc(options) {
    _classCallCheck(this, HtmlDoc);

    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HtmlDoc).call(this, patch(options, {
      id: "Primrose.Controls.HtmlDoc[" + COUNTER++ + "]"
    })));

    if (typeof options === "string") {
      _this.options = {
        element: _this.options
      };
    } else {
      _this.options = options || {};
    }

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    _this._lastImage = null;
    _this._image = null;
    _this.element = _this.options.element;
    return _this;
  }

  _createClass(HtmlDoc, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var mesh = textured(quad(2, 2), this);
      scene.add(mesh);
      env.registerPickableObject(mesh);
      return mesh;
    }
  }, {
    key: "_render",
    value: function _render() {
      var _this2 = this;

      html2canvas(this._element, {
        onrendered: function onrendered(canvas) {
          _this2._image = canvas;
          _this2.setSize(canvas.width, canvas.height);
          _this2.render();
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (this._image !== this._lastImage) {
        this._lastImage = this._image;
        this.context.fillStyle = "white";
        this.context.fillRect(0, 0, this.imageWidth, this.imageHeight);
        this.context.drawImage(this._image, 0, 0);
        this.invalidate();
      }
    }
  }, {
    key: "element",
    get: function get() {
      return this._element;
    },
    set: function set(v) {
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
  }, {
    key: "value",
    get: function get() {
      return this._element.innerHTML;
    },
    set: function set(v) {
      if (v !== this._element.innerHTML) {
        this._element.innerHTML = v;
        this._render();
      }
    }
  }]);

  return HtmlDoc;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9IdG1sRG9jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBSSxVQUFVLENBQWQ7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLG1CQURFO0FBRVIsUUFBTSxTQUZFO0FBR1IsYUFBVyxrQkFISDtBQUlSLGVBQWEsa0NBSkw7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLFNBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQ7QUFMSixDQUFaOztJQVdNLE87Ozs7OzZCQUVZO0FBQ2QsYUFBTyxJQUFJLE9BQUosRUFBUDtBQUNEOzs7QUFFRCxtQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBSW5CO0FBQ0E7QUFDQTs7QUFObUIsMkZBQ2IsTUFBTSxPQUFOLEVBQWU7QUFDbkIsVUFBSSwrQkFBZ0MsU0FBaEMsR0FBNkM7QUFEOUIsS0FBZixDQURhOztBQVFuQixRQUFJLE9BQU8sT0FBUCxLQUFtQixRQUF2QixFQUFpQztBQUMvQixZQUFLLE9BQUwsR0FBZTtBQUNiLGlCQUFTLE1BQUs7QUFERCxPQUFmO0FBR0QsS0FKRCxNQUtLO0FBQ0gsWUFBSyxPQUFMLEdBQWUsV0FBVyxFQUExQjtBQUNEOztBQUVEO0FBQ0E7QUFDQTtBQUNBLFVBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxVQUFLLE9BQUwsR0FBZSxNQUFLLE9BQUwsQ0FBYSxPQUE1QjtBQXRCbUI7QUF1QnBCOzs7OzRDQWtCdUIsRyxFQUFLLEssRUFBTztBQUNsQyxVQUFJLE9BQU8sU0FBUyxLQUFLLENBQUwsRUFBUSxDQUFSLENBQVQsRUFBcUIsSUFBckIsQ0FBWDtBQUNBLFlBQU0sR0FBTixDQUFVLElBQVY7QUFDQSxVQUFJLHNCQUFKLENBQTJCLElBQTNCO0FBQ0EsYUFBTyxJQUFQO0FBQ0Q7Ozs4QkFhUztBQUFBOztBQUNSLGtCQUFZLEtBQUssUUFBakIsRUFBMkI7QUFDekIsb0JBQVksb0JBQUMsTUFBRCxFQUFZO0FBQ3RCLGlCQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsaUJBQUssT0FBTCxDQUFhLE9BQU8sS0FBcEIsRUFBMkIsT0FBTyxNQUFsQztBQUNBLGlCQUFLLE1BQUw7QUFDRDtBQUx3QixPQUEzQjtBQU9EOzs7NkJBRVE7QUFDUCxVQUFJLEtBQUssTUFBTCxLQUFnQixLQUFLLFVBQXpCLEVBQXFDO0FBQ25DLGFBQUssVUFBTCxHQUFrQixLQUFLLE1BQXZCO0FBQ0EsYUFBSyxPQUFMLENBQWEsU0FBYixHQUF5QixPQUF6QjtBQUNBLGFBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsS0FBSyxVQUFqQyxFQUE2QyxLQUFLLFdBQWxEO0FBQ0EsYUFBSyxPQUFMLENBQWEsU0FBYixDQUF1QixLQUFLLE1BQTVCLEVBQW9DLENBQXBDLEVBQXVDLENBQXZDO0FBQ0EsYUFBSyxVQUFMO0FBQ0Q7QUFDRjs7O3dCQXBEYTtBQUNaLGFBQU8sS0FBSyxRQUFaO0FBQ0QsSztzQkFFVyxDLEVBQUc7QUFDYixVQUFJLENBQUosRUFBTztBQUNMLGFBQUssUUFBTCxHQUFnQixTQUFTLEdBQVQsQ0FBYSxjQUFiLENBQTRCLENBQTVCLEVBQStCLEtBQS9CLEVBQXNDLGNBQXRDLENBQWhCO0FBQ0EsYUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixRQUFwQixHQUErQixVQUEvQjtBQUNBLGFBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FBcEIsR0FBOEIsRUFBOUI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLEtBQXBCLEdBQTRCLEtBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsSUFBaEQ7QUFDQSxhQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE1BQXBCLEdBQTZCLEtBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsSUFBbEQ7QUFDQSxpQkFBUyxJQUFULENBQWMsV0FBZCxDQUEwQixTQUFTLEdBQVQsQ0FBYSxtQkFBYixDQUFpQyxLQUFLLEVBQUwsR0FBVSxRQUEzQyxFQUFxRCxLQUFLLFFBQTFELENBQTFCO0FBQ0EsYUFBSyxPQUFMO0FBQ0Q7QUFDRjs7O3dCQVNXO0FBQ1YsYUFBTyxLQUFLLFFBQUwsQ0FBYyxTQUFyQjtBQUNELEs7c0JBRVMsQyxFQUFHO0FBQ1gsVUFBSSxNQUFNLEtBQUssUUFBTCxDQUFjLFNBQXhCLEVBQW1DO0FBQ2pDLGFBQUssUUFBTCxDQUFjLFNBQWQsR0FBMEIsQ0FBMUI7QUFDQSxhQUFLLE9BQUw7QUFDRDtBQUNGOzs7O0VBL0RtQixTQUFTLE8iLCJmaWxlIjoic3JjL1ByaW1yb3NlL0NvbnRyb2xzL0h0bWxEb2MuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Controls.HtmlDoc = HtmlDoc;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0,
    HTMLImage = window.Image,
    imageCache = {};

var Image = function (_Primrose$Surface) {
  _inherits(Image, _Primrose$Surface);

  _createClass(Image, null, [{
    key: "create",
    value: function create() {
      return new Image();
    }
  }]);

  function Image(options) {
    _classCallCheck(this, Image);

    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Image).call(this, patch(options, {
      id: "Primrose.Controls.Image[" + COUNTER++ + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, 1, 1)
    })));

    _this.listeners.load = [];

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    _this._lastWidth = -1;
    _this._lastHeight = -1;
    _this._lastImage = null;
    _this._images = [];
    _this._currentImageIndex = 0;
    _this.className = "";

    setTimeout(function () {
      if (options.value) {
        if (/\.stereo\./.test(options.value)) {
          _this.loadStereoImage(options.value);
        } else {
          _this.loadImage(options.value);
        }
      }
    });
    return _this;
  }

  _createClass(Image, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
      scene.add(imageMesh);
      env.registerPickableObject(imageMesh);
      return imageMesh;
    }
  }, {
    key: "loadImage",
    value: function loadImage(i, src) {
      var _this2 = this;

      if (typeof i !== "number" && !(i instanceof Number)) {
        src = i;
        i = 0;
      }
      return new Promise(function (resolve, reject) {
        if (imageCache[src]) {
          resolve(imageCache[src]);
        } else if (src) {
          var temp = new HTMLImage();
          temp.addEventListener("load", function () {
            imageCache[src] = temp;
            resolve(imageCache[src]);
          }, false);
          temp.addEventListener("error", function () {
            reject("error loading image");
          }, false);
          temp.src = src;
        } else {
          reject("Image was null");
        }
      }).then(function (img) {
        _this2.setImage(i, img);
        return img;
      }).catch(function (err) {
        console.error("Failed to load image " + src);
        console.error(err);
        _this2.setImage(i, null);
      });
    }
  }, {
    key: "loadStereoImage",
    value: function loadStereoImage(src) {
      var _this3 = this;

      return this.loadImage(src).then(function (img) {
        var bounds = new Primrose.Text.Rectangle(0, 0, img.width / 2, img.height),
            a = new Primrose.Surface({
          id: _this3.id + "-left",
          bounds: bounds
        }),
            b = new Primrose.Surface({
          id: _this3.id + "-right",
          bounds: bounds
        });
        a.context.drawImage(img, 0, 0);
        b.context.drawImage(img, -bounds.width, 0);
        _this3.setImage(0, a.canvas);
        _this3.setImage(1, b.canvas);
        _this3.bounds.width = bounds.width;
        _this3.bounds.height = bounds.height;
        _this3.render();

        emit.call(_this3, "load", {
          target: _this3
        });
        return _this3;
      });
    }
  }, {
    key: "getImage",
    value: function getImage(i) {
      return this._images[i % this._images.length];
    }
  }, {
    key: "setImage",
    value: function setImage(i, img) {
      this._images[i] = img;
      this.render();
    }
  }, {
    key: "eyeBlank",
    value: function eyeBlank(eye) {
      this._currentImageIndex = eye;
      this.render();
    }
  }, {
    key: "render",
    value: function render(force) {
      if (this._changed || force) {
        if (this.resized) {
          this.resize();
        } else if (this.image !== this._lastImage) {
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
  }, {
    key: "src",
    get: function get() {
      return this.getImage(this._currentImageIndex).src;
    },
    set: function set(v) {
      if (this.className === "stereo") {
        this.loadStereoImage(v);
      } else {
        this.loadImage(0, src);
      }
    }
  }, {
    key: "image",
    get: function get() {
      return this.getImage(this._currentImageIndex);
    },
    set: function set(img) {
      this.setImage(this._currentImageIndex, img);
    }
  }, {
    key: "_changed",
    get: function get() {
      return this.resized || this.image !== this._lastImage;
    }
  }]);

  return Image;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9JbWFnZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQUksVUFBVSxDQUFkO0FBQUEsSUFDRSxZQUFZLE9BQU8sS0FEckI7QUFBQSxJQUVFLGFBQWEsRUFGZjs7QUFJQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsbUJBREU7QUFFUixRQUFNLE9BRkU7QUFHUixhQUFXLGtCQUhIO0FBSVIsZUFBYSx3Q0FKTDtBQUtSLGNBQVksQ0FBQztBQUNYLFVBQU0sU0FESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRDtBQUxKLENBQVo7O0lBV00sSzs7Ozs7NkJBRVk7QUFDZCxhQUFPLElBQUksS0FBSixFQUFQO0FBQ0Q7OztBQUVELGlCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFDbkI7QUFDQTtBQUNBOztBQUVBLGNBQVUsV0FBVyxFQUFyQjtBQUNBLFFBQUksT0FBTyxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQy9CLGdCQUFVO0FBQ1IsZUFBTztBQURDLE9BQVY7QUFHRDs7QUFWa0IseUZBWWIsTUFBTSxPQUFOLEVBQWU7QUFDbkIsVUFBSSw2QkFBOEIsU0FBOUIsR0FBMkMsR0FENUI7QUFFbkIsY0FBUSxJQUFJLFNBQVMsSUFBVCxDQUFjLFNBQWxCLENBQTRCLENBQTVCLEVBQStCLENBQS9CLEVBQWtDLENBQWxDLEVBQXFDLENBQXJDO0FBRlcsS0FBZixDQVphOztBQWdCbkIsVUFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixFQUF0Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsVUFBSyxVQUFMLEdBQWtCLENBQUMsQ0FBbkI7QUFDQSxVQUFLLFdBQUwsR0FBbUIsQ0FBQyxDQUFwQjtBQUNBLFVBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFVBQUssT0FBTCxHQUFlLEVBQWY7QUFDQSxVQUFLLGtCQUFMLEdBQTBCLENBQTFCO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLEVB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RUFBRSxNQUFuQjtBQUNBLGVBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsT0FBTyxLQUEzQjtBQUNBLGVBQUssTUFBTCxDQUFZLE1BQVosR0FBcUIsT0FBTyxNQUE1QjtBQUNBLGVBQUssTUFBTDs7QUFFQSxhQUFLLElBQUwsU0FBZ0IsTUFBaEIsRUFBd0I7QUFDdEI7QUFEc0IsU0FBeEI7QUFHQTtBQUNELE9BdkJJLENBQVA7QUF3QkQ7Ozs2QkFVUSxDLEVBQUc7QUFDVixhQUFPLEtBQUssT0FBTCxDQUFhLElBQUksS0FBSyxPQUFMLENBQWEsTUFBOUIsQ0FBUDtBQUNEOzs7NkJBRVEsQyxFQUFHLEcsRUFBSztBQUNmLFdBQUssT0FBTCxDQUFhLENBQWIsSUFBa0IsR0FBbEI7QUFDQSxXQUFLLE1BQUw7QUFDRDs7OzZCQU1RLEcsRUFBSztBQUNaLFdBQUssa0JBQUwsR0FBMEIsR0FBMUI7QUFDQSxXQUFLLE1BQUw7QUFDRDs7OzJCQUVNLEssRUFBTztBQUNaLFVBQUksS0FBSyxRQUFMLElBQWlCLEtBQXJCLEVBQTRCO0FBQzFCLFlBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCLGVBQUssTUFBTDtBQUNELFNBRkQsTUFHSyxJQUFJLEtBQUssS0FBTCxLQUFlLEtBQUssVUFBeEIsRUFBb0M7QUFDdkMsZUFBSyxPQUFMLENBQWEsU0FBYixDQUF1QixDQUF2QixFQUEwQixDQUExQixFQUE2QixLQUFLLFVBQWxDLEVBQThDLEtBQUssV0FBbkQ7QUFDRDs7QUFFRCxZQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNkLGVBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsS0FBSyxLQUE1QixFQUFtQyxDQUFuQyxFQUFzQyxDQUF0QztBQUNEOztBQUVELGFBQUssVUFBTCxHQUFrQixLQUFLLFVBQXZCO0FBQ0EsYUFBSyxXQUFMLEdBQW1CLEtBQUssV0FBeEI7QUFDQSxhQUFLLFVBQUwsR0FBa0IsS0FBSyxLQUF2Qjs7QUFFQSxhQUFLLFVBQUw7QUFDRDtBQUNGOzs7d0JBekhTO0FBQ1IsYUFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFLLGtCQUFuQixFQUNKLEdBREg7QUFFRCxLO3NCQUVPLEMsRUFBRztBQUNULFVBQUksS0FBSyxTQUFMLEtBQW1CLFFBQXZCLEVBQWlDO0FBQy9CLGFBQUssZUFBTCxDQUFxQixDQUFyQjtBQUNELE9BRkQsTUFHSztBQUNILGFBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsR0FBbEI7QUFDRDtBQUNGOzs7d0JBZ0VXO0FBQ1YsYUFBTyxLQUFLLFFBQUwsQ0FBYyxLQUFLLGtCQUFuQixDQUFQO0FBQ0QsSztzQkFFUyxHLEVBQUs7QUFDYixXQUFLLFFBQUwsQ0FBYyxLQUFLLGtCQUFuQixFQUF1QyxHQUF2QztBQUNEOzs7d0JBV2M7QUFDYixhQUFPLEtBQUssT0FBTCxJQUFnQixLQUFLLEtBQUwsS0FBZSxLQUFLLFVBQTNDO0FBQ0Q7Ozs7RUFySmlCLFNBQVMsTyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvQ29udHJvbHMvSW1hZ2UuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Controls.Image = Image;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var VUMeter = function (_Primrose$Surface) {
  _inherits(VUMeter, _Primrose$Surface);

  function VUMeter(analyzer, options) {
    _classCallCheck(this, VUMeter);

    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    options = options || {};
    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VUMeter).call(this, patch(options, {
      id: "Primrose.Controls.VUMeter[" + COUNTER++ + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, 512, 256),
      backgroundColor: 0x000000,
      foregroundColor: 0xffffff
    })));

    _this.analyzer = analyzer;
    _this.analyzer.fftSize = _this.bounds.width;
    _this.buffer = new Uint8Array(_this.analyzer.frequencyBinCount);
    return _this;
  }

  _createClass(VUMeter, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var imageMesh = textured(quad(0.5, 0.5 * this.imageHeight / this.imageWidth), this);
      scene.add(imageMesh);
      env.registerPickableObject(imageMesh);
      return imageMesh;
    }
  }, {
    key: "render",
    value: function render() {
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
  }]);

  return VUMeter;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9Db250cm9scy9WVU1ldGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsSUFBSSxVQUFVLENBQWQ7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLG1CQURFO0FBRVIsUUFBTSxTQUZFO0FBR1IsYUFBVyxrQkFISDtBQUlSLGVBQWEsZ0NBSkw7QUFLUixjQUFZLENBQUM7QUFDWCxVQUFNLFVBREs7QUFFWCxVQUFNLGFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sU0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUztBQUxKLENBQVo7O0lBZU0sTzs7O0FBRUosbUJBQVksUUFBWixFQUFzQixPQUF0QixFQUErQjtBQUFBOztBQUM3QjtBQUNBO0FBQ0E7O0FBRUEsY0FBVSxXQUFXLEVBQXJCO0FBQ0EsUUFBSSxPQUFPLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsZ0JBQVU7QUFDUixlQUFPO0FBREMsT0FBVjtBQUdEOztBQVNEO0FBQ0E7QUFDQTs7QUFyQjZCLDJGQVl2QixNQUFNLE9BQU4sRUFBZTtBQUNuQixVQUFJLCtCQUFnQyxTQUFoQyxHQUE2QyxHQUQ5QjtBQUVuQixjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEIsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsR0FBbEMsRUFBdUMsR0FBdkMsQ0FGVztBQUduQix1QkFBaUIsUUFIRTtBQUluQix1QkFBaUI7QUFKRSxLQUFmLENBWnVCOztBQXVCN0IsVUFBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsVUFBSyxRQUFMLENBQWMsT0FBZCxHQUF3QixNQUFLLE1BQUwsQ0FBWSxLQUFwQztBQUNBLFVBQUssTUFBTCxHQUFjLElBQUksVUFBSixDQUFlLE1BQUssUUFBTCxDQUFjLGlCQUE3QixDQUFkO0FBekI2QjtBQTBCOUI7Ozs7NENBRXVCLEcsRUFBSyxLLEVBQU87QUFDbEMsVUFBSSxZQUFZLFNBQVMsS0FBSyxHQUFMLEVBQVUsTUFBTSxLQUFLLFdBQVgsR0FBeUIsS0FBSyxVQUF4QyxDQUFULEVBQThELElBQTlELENBQWhCO0FBQ0EsWUFBTSxHQUFOLENBQVUsU0FBVjtBQUNBLFVBQUksc0JBQUosQ0FBMkIsU0FBM0I7QUFDQSxhQUFPLFNBQVA7QUFDRDs7OzZCQUVRO0FBQ1AsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxNQUFMO0FBQ0Q7O0FBRUQsV0FBSyxRQUFMLENBQWMscUJBQWQsQ0FBb0MsS0FBSyxNQUF6QztBQUNBLFdBQUssT0FBTCxDQUFhLFNBQWIsR0FBeUIsS0FBSyxPQUFMLENBQWEsZUFBdEM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLENBQXRCLEVBQXlCLENBQXpCLEVBQTRCLEtBQUssTUFBTCxDQUFZLEtBQXhDLEVBQStDLEtBQUssTUFBTCxDQUFZLE1BQTNEO0FBQ0EsV0FBSyxPQUFMLENBQWEsU0FBYixHQUF5QixDQUF6QjtBQUNBLFdBQUssT0FBTCxDQUFhLFdBQWIsR0FBMkIsS0FBSyxPQUFMLENBQWEsZUFBeEM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxTQUFiO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssTUFBTCxDQUFZLE1BQWhDLEVBQXdDLEVBQUUsQ0FBMUMsRUFBNkM7QUFDM0MsWUFBSSxJQUFJLElBQUksS0FBSyxNQUFMLENBQVksS0FBaEIsR0FBd0IsS0FBSyxNQUFMLENBQVksTUFBNUM7QUFBQSxZQUNFLElBQUksS0FBSyxNQUFMLENBQVksQ0FBWixJQUFpQixLQUFLLE1BQUwsQ0FBWSxNQUE3QixHQUFzQyxHQUQ1QztBQUFBLFlBRUUsT0FBTyxJQUFJLENBQUosR0FBUSxRQUFSLEdBQW1CLFFBRjVCO0FBR0EsYUFBSyxPQUFMLENBQWEsSUFBYixFQUFtQixDQUFuQixFQUFzQixDQUF0QjtBQUNEO0FBQ0QsV0FBSyxPQUFMLENBQWEsTUFBYjtBQUNBLFdBQUssVUFBTDtBQUNEOzs7O0VBeERtQixTQUFTLE8iLCJmaWxlIjoic3JjL1ByaW1yb3NlL0NvbnRyb2xzL1ZVTWV0ZXIuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Controls.VUMeter = VUMeter;
})();
(function(){
"use strict";

function XHR(method, type, url, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    options.headers = options.headers || {};
    if (method === "POST") {
      options.headers["Content-Type"] = options.headers["Content-Type"] || type;
    }

    var req = new XMLHttpRequest();
    req.onerror = function (evt) {
      return reject(new Error("Request error: " + evt.message));
    };
    req.onabort = function (evt) {
      return reject(new Error("Request abort: " + evt.message));
    };
    req.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if (req.status < 400) {
        resolve(req.response);
      } else {
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
    } else {
      req.send();
    }
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL1hIUi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sS0FGTztBQUdiLGVBQWEseUtBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLFFBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sTUFETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhLG1PQUhaO0FBSUQsYUFBUztBQUpSLEdBSlMsRUFTVDtBQUNELFVBQU0sS0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FUUyxFQWFUO0FBQ0QsVUFBTSxjQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQWJTLEVBaUJUO0FBQ0QsVUFBTSxrQkFETDtBQUVELFVBQU0sVUFGTDtBQUdELGNBQVUsSUFIVDtBQUlELGlCQUFhO0FBSlosR0FqQlMsQ0FMQztBQTRCYixZQUFVLENBQUM7QUFDVCxVQUFNLHFCQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUE1QkcsQ0FBZjs7QUE2Q0EsU0FBUyxHQUFULENBQWEsTUFBYixFQUFxQixJQUFyQixFQUEyQixHQUEzQixFQUFnQyxPQUFoQyxFQUF5QztBQUN2QyxTQUFPLElBQUksT0FBSixDQUFZLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQjtBQUM1QyxjQUFVLFdBQVcsRUFBckI7QUFDQSxZQUFRLE9BQVIsR0FBa0IsUUFBUSxPQUFSLElBQW1CLEVBQXJDO0FBQ0EsUUFBSSxXQUFXLE1BQWYsRUFBdUI7QUFDckIsY0FBUSxPQUFSLENBQWdCLGNBQWhCLElBQWtDLFFBQVEsT0FBUixDQUFnQixjQUFoQixLQUFtQyxJQUFyRTtBQUNEOztBQUVELFFBQUksTUFBTSxJQUFJLGNBQUosRUFBVjtBQUNBLFFBQUksT0FBSixHQUFjLFVBQUMsR0FBRDtBQUFBLGFBQVMsT0FBTyxJQUFJLEtBQUosQ0FBVSxvQkFBb0IsSUFBSSxPQUFsQyxDQUFQLENBQVQ7QUFBQSxLQUFkO0FBQ0EsUUFBSSxPQUFKLEdBQWMsVUFBQyxHQUFEO0FBQUEsYUFBUyxPQUFPLElBQUksS0FBSixDQUFVLG9CQUFvQixJQUFJLE9BQWxDLENBQVAsQ0FBVDtBQUFBLEtBQWQ7QUFDQSxRQUFJLE1BQUosR0FBYSxZQUFZO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBSSxJQUFJLE1BQUosR0FBYSxHQUFqQixFQUFzQjtBQUNwQixnQkFBUSxJQUFJLFFBQVo7QUFDRCxPQUZELE1BR0s7QUFDSCxlQUFPLEdBQVA7QUFDRDtBQUNGLEtBWEQ7O0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFJLElBQUosQ0FBUyxNQUFULEVBQWlCLEdBQWpCO0FBQ0EsUUFBSSxJQUFKLEVBQVU7QUFDUixVQUFJLFlBQUosR0FBbUIsSUFBbkI7QUFDRDs7QUFFRCxRQUFJLFVBQUosR0FBaUIsUUFBUSxRQUF6Qjs7QUFFQSxTQUFLLElBQUksR0FBVCxJQUFnQixRQUFRLE9BQXhCLEVBQWlDO0FBQy9CLFVBQUksZ0JBQUosQ0FBcUIsR0FBckIsRUFBMEIsUUFBUSxPQUFSLENBQWdCLEdBQWhCLENBQTFCO0FBQ0Q7O0FBRUQsUUFBSSxlQUFKLEdBQXNCLENBQUMsQ0FBQyxRQUFRLGVBQWhDOztBQUVBLFFBQUksUUFBUSxJQUFaLEVBQWtCO0FBQ2hCLFVBQUksSUFBSixDQUFTLEtBQUssU0FBTCxDQUFlLFFBQVEsSUFBdkIsQ0FBVDtBQUNELEtBRkQsTUFHSztBQUNILFVBQUksSUFBSjtBQUNEO0FBQ0YsR0E5Q00sQ0FBUDtBQStDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSFRUUC9YSFIuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.HTTP.XHR = XHR;
})();
(function(){
"use strict";

function del(type, url, options) {
  return Primrose.HTTP.XHR("DELETE", type, url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sS0FGTztBQUdiLGVBQWEsaUNBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLE1BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYSxtT0FIRjtBQUlYLGFBQVM7QUFKRSxHQUFELEVBS1Q7QUFDRCxVQUFNLEtBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBTFMsRUFTVDtBQUNELFVBQU0sY0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FUUyxFQWFUO0FBQ0QsVUFBTSxrQkFETDtBQUVELFVBQU0sVUFGTDtBQUdELGNBQVUsSUFIVDtBQUlELGlCQUFhO0FBSlosR0FiUztBQUxDLENBQWY7O0FBMEJBLFNBQVMsR0FBVCxDQUFhLElBQWIsRUFBbUIsR0FBbkIsRUFBd0IsT0FBeEIsRUFBaUM7QUFDL0IsU0FBTyxTQUFTLElBQVQsQ0FBYyxHQUFkLENBQWtCLFFBQWxCLEVBQTRCLElBQTVCLEVBQWtDLEdBQWxDLEVBQXVDLE9BQXZDLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSFRUUC9kZWwuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.HTTP.del = del;
})();
(function(){
"use strict";

function delObject(url, options) {
  return Primrose.HTTP.del("json", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2RlbE9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sV0FGTztBQUdiLGVBQWEsK0RBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sY0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxrQkFETDtBQUVELFVBQU0sVUFGTDtBQUdELGNBQVUsSUFIVDtBQUlELGlCQUFhO0FBSlosR0FSUztBQUxDLENBQWY7O0FBcUJBLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QixPQUF4QixFQUFpQztBQUMvQixTQUFPLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FBa0IsTUFBbEIsRUFBMEIsR0FBMUIsRUFBK0IsT0FBL0IsQ0FBUDtBQUNEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9IVFRQL2RlbE9iamVjdC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.HTTP.delObject = delObject;
})();
(function(){
"use strict";

function get(type, url, options) {
  return Primrose.HTTP.XHR("GET", type || "text", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2dldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sS0FGTztBQUdiLGVBQWEsOEJBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLE1BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYSxtT0FIRjtBQUlYLGFBQVM7QUFKRSxHQUFELEVBS1Q7QUFDRCxVQUFNLEtBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBTFMsRUFTVDtBQUNELFVBQU0sa0JBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBVFMsQ0FMQztBQW9CYixZQUFVLENBQUM7QUFDVCxVQUFNLHFCQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFwQkcsQ0FBZjs7QUFxQ0EsU0FBUyxHQUFULENBQWEsSUFBYixFQUFtQixHQUFuQixFQUF3QixPQUF4QixFQUFpQztBQUMvQixTQUFPLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FBa0IsS0FBbEIsRUFBeUIsUUFBUSxNQUFqQyxFQUF5QyxHQUF6QyxFQUE4QyxPQUE5QyxDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0hUVFAvZ2V0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.HTTP.get = get;
})();
(function(){
"use strict";

function getBuffer(url, options) {
  return Primrose.HTTP.get("arraybuffer", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2dldEJ1ZmZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sV0FGTztBQUdiLGVBQWEsbUNBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sa0JBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBSlMsQ0FMQztBQWViLFlBQVUsQ0FBQztBQUNULFVBQU0sd0NBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7O0FBRkosR0FBRDtBQWZHLENBQWY7O0FBbUNBLFNBQVMsU0FBVCxDQUFtQixHQUFuQixFQUF3QixPQUF4QixFQUFpQztBQUMvQixTQUFPLFNBQVMsSUFBVCxDQUFjLEdBQWQsQ0FBa0IsYUFBbEIsRUFBaUMsR0FBakMsRUFBc0MsT0FBdEMsQ0FBUDtBQUNEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9IVFRQL2dldEJ1ZmZlci5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.HTTP.getBuffer = getBuffer;
})();
(function(){
"use strict";

function getObject(url, options) {
  return Primrose.HTTP.get("json", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2dldE9iamVjdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsZUFESztBQUViLFFBQU0sV0FGTztBQUdiLGVBQWEsa0NBSEE7QUFJYixXQUFTLFNBSkk7QUFLYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sa0JBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBSlMsQ0FMQztBQWViLFlBQVUsQ0FBQztBQUNULFVBQU0sdUNBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFmRyxDQUFmOztBQWlDQSxTQUFTLFNBQVQsQ0FBbUIsR0FBbkIsRUFBd0IsT0FBeEIsRUFBaUM7QUFDL0IsU0FBTyxTQUFTLElBQVQsQ0FBYyxHQUFkLENBQWtCLE1BQWxCLEVBQTBCLEdBQTFCLEVBQStCLE9BQS9CLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSFRUUC9nZXRPYmplY3QuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.HTTP.getObject = getObject;
})();
(function(){
"use strict";

function getText(url, options) {
  return Primrose.HTTP.get("text", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL2dldFRleHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGVBREs7QUFFYixRQUFNLFNBRk87QUFHYixlQUFhLCtHQUhBO0FBSWIsV0FBUyxTQUpJO0FBS2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxLQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLGtCQURMO0FBRUQsVUFBTSxVQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWE7QUFKWixHQUpTLENBTEM7QUFlYixZQUFVLENBQUM7QUFDVCxVQUFNLG9DQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFmRyxDQUFmOztBQWdDQSxTQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsT0FBdEIsRUFBK0I7QUFDN0IsU0FBTyxTQUFTLElBQVQsQ0FBYyxHQUFkLENBQWtCLE1BQWxCLEVBQTBCLEdBQTFCLEVBQStCLE9BQS9CLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSFRUUC9nZXRUZXh0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.HTTP.getText = getText;
})();
(function(){
"use strict";

function post(type, url, options) {
  return Primrose.HTTP.XHR("POST", type, url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL3Bvc3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGVBREs7QUFFYixRQUFNLE1BRk87QUFHYixlQUFhLCtCQUhBO0FBSWIsV0FBUyxTQUpJO0FBS2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxNQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWEsbU9BSEY7QUFJWCxhQUFTO0FBSkUsR0FBRCxFQUtUO0FBQ0QsVUFBTSxLQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUxTLEVBU1Q7QUFDRCxVQUFNLGNBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBVFMsRUFhVDtBQUNELFVBQU0sa0JBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBYlM7QUFMQyxDQUFmOztBQTBCQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQXlCLE9BQXpCLEVBQWtDO0FBQ2hDLFNBQU8sU0FBUyxJQUFULENBQWMsR0FBZCxDQUFrQixNQUFsQixFQUEwQixJQUExQixFQUFnQyxHQUFoQyxFQUFxQyxPQUFyQyxDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0hUVFAvcG9zdC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.HTTP.post = post;
})();
(function(){
"use strict";

function postObject(url, options) {
  return Primrose.HTTP.post("json", url, options);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9IVFRQL3Bvc3RPYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGVBREs7QUFFYixRQUFNLFlBRk87QUFHYixlQUFhLGlDQUhBO0FBSWIsV0FBUyxTQUpJO0FBS2IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxLQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLGNBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsRUFRVDtBQUNELFVBQU0sa0JBREw7QUFFRCxVQUFNLFVBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBUlM7QUFMQyxDQUFmOztBQXFCQSxTQUFTLFVBQVQsQ0FBb0IsR0FBcEIsRUFBeUIsT0FBekIsRUFBa0M7QUFDaEMsU0FBTyxTQUFTLElBQVQsQ0FBYyxJQUFkLENBQW1CLE1BQW5CLEVBQTJCLEdBQTNCLEVBQWdDLE9BQWhDLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSFRUUC9wb3N0T2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.HTTP.postObject = postObject;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DISPLACEMENT = new THREE.Vector3(),
    EULER_TEMP = new THREE.Euler(),
    WEDGE = Math.PI / 3;

var FPSInput = function () {
  function FPSInput(DOMElement, options) {
    var _this = this;

    _classCallCheck(this, FPSInput);

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

    var keyUp = function keyUp(evt) {
      return _this.currentControl && _this.currentControl.keyUp && _this.currentControl.keyUp(evt);
    };
    var keyDown = function keyDown(evt) {
      return _this.Keyboard.doTyping(_this.currentControl && _this.currentControl.focusedElement, evt);
    };

    this.add(new Primrose.Input.Keyboard(this, null, {
      strafeLeft: {
        buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
      },
      strafeRight: {
        buttons: [Primrose.Keys.D, Primrose.Keys.RIGHTARROW]
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
        buttons: [Primrose.Keys.S, Primrose.Keys.DOWNARROW]
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

    Primrose.Input.Gamepad.addEventListener("gamepadconnected", function (pad) {
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
              commandUp: emit.bind(_this, "zero")
            }
          };

          for (var i = 0; i < _this.managers.length; ++i) {
            var mgr = _this.managers[i];
            if (mgr.currentPad && mgr.currentPad.id === pad.id) {
              ++controllerNumber;
            }
          }
        } else {
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
              commandUp: emit.bind(_this, "zero")
            }
          };
        }

        var mgr = new Primrose.Input.Gamepad(pad, controllerNumber, padCommands);
        _this.add(mgr);

        if (isMotion) {
          mgr.parent = _this.VR;
          _this.motionDevices.push(mgr);

          var shift = (_this.motionDevices.length - 2) * 8,
              ptr = new Primrose.Pointer(padID + "Pointer", 0x0000ff << shift, 0x00007f << shift, true, mgr);
          _this.pointers.push(ptr);
          ptr.addToBrowserEnvironment(null, _this.options.scene);
          ptr.addEventListener("teleport", function (evt) {
            return _this.moveStage(evt.position);
          });
        } else {
          _this.Keyboard.parent = mgr;
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

    this.pointers.forEach(function (ptr) {
      return ptr.addEventListener("teleport", function (evt) {
        return _this.moveStage(evt.position);
      });
    });

    this.ready = Promise.all(this.managers.map(function (mgr) {
      return mgr.ready;
    }).filter(identity));
  }

  _createClass(FPSInput, [{
    key: "remove",
    value: function remove(id) {
      var mgr = this[id],
          mgrIdx = this.managers.indexOf(mgr);
      if (mgrIdx > -1) {
        this.managers.splice(mgrIdx, 1);
        delete this[id];
      }
      console.log("removed", mgr);
    }
  }, {
    key: "add",
    value: function add(mgr) {
      for (var i = this.managers.length - 1; i >= 0; --i) {
        if (this.managers[i].name === mgr.name) {
          this.managers.splice(i, 1);
        }
      }
      this.managers.push(mgr);
      this[mgr.name] = mgr;
    }
  }, {
    key: "zero",
    value: function zero() {
      for (var i = 0; i < this.managers.length; ++i) {
        this.managers[i].zero();
      }
    }
  }, {
    key: "submitFrame",
    value: function submitFrame() {
      this.VR.submitFrame();
    }
  }, {
    key: "update",
    value: function update(dt) {
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
      } else {
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
  }, {
    key: "updateStage",
    value: function updateStage(dt) {
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
        heading = WEDGE * Math.floor(heading / WEDGE + 0.5);
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

      this.moveStage(DISPLACEMENT.copy(this.velocity).multiplyScalar(dt).applyQuaternion(this.stage.quaternion).add(this.head.position));
    }
  }, {
    key: "moveStage",
    value: function moveStage(position) {
      DISPLACEMENT.copy(position).sub(this.head.position);
      this.stage.position.x += DISPLACEMENT.x;
      this.stage.position.z += DISPLACEMENT.z;
    }
  }, {
    key: "resolvePicking",
    value: function resolvePicking(currentHits, lastHits, pickableObjects) {
      for (var i = 0; i < this.pointers.length; ++i) {
        this.pointers[i].resolvePicking(currentHits, lastHits, pickableObjects);
      }
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(evt, thunk, bubbles) {
      if (this.listeners[evt]) {
        this.listeners[evt].push(thunk);
      } else {
        for (var i = 0; i < this.managers.length; ++i) {
          this.managers[i].addEventListener(evt, thunk, bubbles);
        }
      }
    }
  }, {
    key: "hasMotionControllers",
    get: function get() {
      return !!(this.Vive_0 && this.Vive_0.enabled && this.Vive_0.inPhysicalUse || this.Vive_1 && this.Vive_1.enabled && this.Vive_1.inPhysicalUse);
    }
  }, {
    key: "hasGamepad",
    get: function get() {
      return !!(this.Gamepad_0 && this.Gamepad_0.enabled && this.Gamepad_0.inPhysicalUse);
    }
  }, {
    key: "hasMouse",
    get: function get() {
      return !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
    }
  }, {
    key: "hasTouch",
    get: function get() {
      return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
    }
  }, {
    key: "segments",
    get: function get() {
      var segments = [];
      for (var i = 0; i < this.pointers.length; ++i) {
        var seg = this.pointers[i].segment;
        if (seg) {
          segments.push(seg);
        }
      }
      return segments;
    }
  }, {
    key: "lockMovement",
    get: function get() {
      for (var i = 0; i < this.pointers.length; ++i) {
        var ptr = this.pointers[i];
        if (ptr.lockMovement) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "currentControl",
    get: function get() {
      for (var i = 0; i < this.pointers.length; ++i) {
        var ptr = this.pointers[i];
        if (ptr.currentControl) {
          return ptr.currentControl;
        }
      }
    }
  }]);

  return FPSInput;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9GUFNJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBTSxlQUFlLElBQUksTUFBTSxPQUFWLEVBQXJCO0FBQUEsSUFDRSxhQUFhLElBQUksTUFBTSxLQUFWLEVBRGY7QUFBQSxJQUVFLFFBQVEsS0FBSyxFQUFMLEdBQVUsQ0FGcEI7O0FBSUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGdCQURFO0FBRVIsUUFBTSxVQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0lBS00sUTtBQUNKLG9CQUFZLFVBQVosRUFBd0IsT0FBeEIsRUFBaUM7QUFBQTs7QUFBQTs7QUFDL0IsaUJBQWEsY0FBYyxNQUEzQjtBQUNBLFNBQUssT0FBTCxHQUFlLE9BQWY7QUFDQSxTQUFLLFNBQUwsR0FBaUI7QUFDZixZQUFNLEVBRFM7QUFFZix3QkFBa0IsRUFGSDtBQUdmLGVBQVM7QUFITSxLQUFqQjs7QUFNQSxTQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxTQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxTQUFLLFFBQUwsR0FBZ0IsSUFBSSxNQUFNLE9BQVYsRUFBaEI7QUFDQSxTQUFLLE1BQUwsR0FBYyxJQUFJLE1BQU0sT0FBVixFQUFkOztBQUVBLFFBQU0sUUFBUSxTQUFSLEtBQVEsQ0FBQyxHQUFEO0FBQUEsYUFBUyxNQUFLLGNBQUwsSUFBdUIsTUFBSyxjQUFMLENBQW9CLEtBQTNDLElBQW9ELE1BQUssY0FBTCxDQUFvQixLQUFwQixDQUEwQixHQUExQixDQUE3RDtBQUFBLEtBQWQ7QUFDQSxRQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRDtBQUFBLGFBQVMsTUFBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixNQUFLLGNBQUwsSUFBdUIsTUFBSyxjQUFMLENBQW9CLGNBQWxFLEVBQWtGLEdBQWxGLENB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RUFBMEMsRUFBRSxDQUE1QyxFQUErQztBQUM3QyxlQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLGdCQUFqQixDQUFrQyxHQUFsQyxFQUF1QyxLQUF2QyxFQUE4QyxPQUE5QztBQUNEO0FBQ0Y7QUFDRjs7O3dCQWxLMEI7QUFDekIsYUFBTyxDQUFDLEVBQUUsS0FBSyxNQUFMLElBQWUsS0FBSyxNQUFMLENBQVksT0FBM0IsSUFBc0MsS0FBSyxNQUFMLENBQVksYUFBbEQsSUFDUixLQUFLLE1BQUwsSUFBZSxLQUFLLE1BQUwsQ0FBWSxPQUEzQixJQUFzQyxLQUFLLE1BQUwsQ0FBWSxhQUQ1QyxDQUFSO0FBRUQ7Ozt3QkFFZ0I7QUFDZixhQUFPLENBQUMsRUFBRSxLQUFLLFNBQUwsSUFBa0IsS0FBSyxTQUFMLENBQWUsT0FBakMsSUFBNEMsS0FBSyxTQUFMLENBQWUsYUFBN0QsQ0FBUjtBQUNEOzs7d0JBRWM7QUFDYixhQUFPLENBQUMsRUFBRSxLQUFLLEtBQUwsSUFBYyxLQUFLLEtBQUwsQ0FBVyxPQUF6QixJQUFvQyxLQUFLLEtBQUwsQ0FBVyxhQUFqRCxDQUFSO0FBQ0Q7Ozt3QkFFYztBQUNiLGFBQU8sQ0FBQyxFQUFFLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBTCxDQUFXLE9BQXpCLElBQW9DLEtBQUssS0FBTCxDQUFXLGFBQWpELENBQVI7QUFDRDs7O3dCQXFHYztBQUNiLFVBQUksV0FBVyxFQUFmO0FBQ0EsV0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEtBQUssUUFBTCxDQUFjLE1BQWxDLEVBQTBDLEVBQUUsQ0FBNUMsRUFBK0M7QUFDN0MsWUFBSSxNQUFNLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsT0FBM0I7QUFDQSxZQUFJLEdBQUosRUFBUztBQUNQLG1CQUFTLElBQVQsQ0FBYyxHQUFkO0FBQ0Q7QUFDRjtBQUNELGFBQU8sUUFBUDtBQUNEOzs7d0JBRWtCO0FBQ2pCLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFFBQUwsQ0FBYyxNQUFsQyxFQUEwQyxFQUFFLENBQTVDLEVBQStDO0FBQzdDLFlBQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQVY7QUFDQSxZQUFJLElBQUksWUFBUixFQUFzQjtBQUNwQixpQkFBTyxJQUFQO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7O3dCQUVvQjtBQUNuQixXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxRQUFMLENBQWMsTUFBbEMsRUFBMEMsRUFBRSxDQUE1QyxFQUErQztBQUM3QyxZQUFJLE1BQU0sS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFWO0FBQ0EsWUFBSSxJQUFJLGNBQVIsRUFBd0I7QUFDdEIsaUJBQU8sSUFBSSxjQUFYO0FBQ0Q7QUFDRjtBQUNGIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9JbnB1dC9GUFNJbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Input.FPSInput = FPSInput;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;

var listeners = {
  gamepadconnected: [],
  gamepaddisconnected: []
},
    currentDeviceIDs = [],
    currentDevices = [],
    currentManagers = {};

var Gamepad = function (_Primrose$PoseInputPr) {
  _inherits(Gamepad, _Primrose$PoseInputPr);

  _createClass(Gamepad, null, [{
    key: "ID",
    value: function ID(pad) {
      var id = pad.id;
      if (id === "OpenVR Gamepad") {
        id = "Vive";
      } else if (id.indexOf("Xbox") === 0) {
        id = "Gamepad";
      } else if (id.indexOf("Rift") === 0) {
        id = "Rift";
      } else if (id.indexOf("Unknown") === 0) {
        id = "Unknown";
      }
      id = (id + "_" + (pad.index || 0)).replace(/\s+/g, "_");
      return id;
    }
  }, {
    key: "poll",
    value: function poll() {
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
            } else {
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
        } else if (mgr) {
          mgr.checkDevice(pad);
        }
      }

      newPads.forEach(emit.bind(Gamepad, "gamepadconnected"));
      oldPads.forEach(emit.bind(Gamepad, "gamepaddisconnected"));
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(evt, thunk) {
      if (listeners[evt]) {
        listeners[evt].push(thunk);
      }
    }
  }, {
    key: "pads",
    get: function get() {
      return currentDevices;
    }
  }, {
    key: "listeners",
    get: function get() {
      return listeners;
    }
  }]);

  function Gamepad(pad, axisOffset, commands, socket, parent) {
    _classCallCheck(this, Gamepad);

    var padID = Gamepad.ID(pad);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gamepad).call(this, padID, parent, commands, socket, Gamepad.AXES));

    currentManagers[padID] = _this;

    _this.currentDevice = pad;
    _this.axisOffset = axisOffset;
    return _this;
  }

  _createClass(Gamepad, [{
    key: "checkDevice",
    value: function checkDevice(pad) {
      var i,
          buttonMap = 0;
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
  }, {
    key: "vibrate",
    value: function vibrate(pattern) {
      if (this.currentDevice && this.currentDevice.vibrate) {
        this.currentDevice.vibrate(pattern);
      }
    }
  }]);

  return Gamepad;
}(Primrose.PoseInputProcessor);

Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9HYW1lcGFkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsVUFBVSxXQUFWLEdBQXdCLFVBQVUsV0FBVixJQUN0QixVQUFVLGlCQURaOztBQUdBLElBQU0sWUFBWTtBQUNkLG9CQUFrQixFQURKO0FBRWQsdUJBQXFCO0FBRlAsQ0FBbEI7QUFBQSxJQUlFLG1CQUFtQixFQUpyQjtBQUFBLElBS0UsaUJBQWlCLEVBTG5CO0FBQUEsSUFNRSxrQkFBa0IsRUFOcEI7O0FBUUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGdCQURFO0FBRVIsUUFBTSxTQUZFO0FBR1IsYUFBVyw2QkFISDtBQUlSLGNBQVksQ0FBQztBQUNYLFVBQU0sTUFESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxVQURMO0FBRUQsVUFBTSxPQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWE7QUFKWixHQUpTLEVBU1Q7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFdBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBVFMsQ0FKSjtBQW1CUixlQUFhO0FBbkJMLENBQVo7O0lBcUJNLE87Ozs7O3VCQUNNLEcsRUFBSztBQUNiLFVBQUksS0FBSyxJQUFJLEVBQWI7QUFDQSxVQUFJLE9BQU8sZ0JBQVgsRUFBNkI7QUFDM0IsYUFBSyxNQUFMO0FBQ0QsT0FGRCxNQUdLLElBQUksR0FBRyxPQUFILENBQVcsTUFBWCxNQUF1QixDQUEzQixFQUE4QjtBQUNqQyxhQUFLLFNBQUw7QUFDRCxPQUZJLE1BR0EsSUFBSSxHQUFHLE9BQUgsQ0FBVyxNQUFYLE1BQXVCLENBQTNCLEVBQThCO0FBQ2pDLGFBQUssTUFBTDtBQUNELE9BRkksTUFHQSxJQUFJLEdBQUcsT0FBSCxDQUFXLFNBQVgsTUFBMEIsQ0FBOUIsRUFBaUM7QUFDcEMsYUFBSyxTQUFMO0FBQ0Q7QUFDRCxXQUFL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

if(typeof window !== "undefined") window.Primrose.Input.Gamepad = Gamepad;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Keyboard = function (_Primrose$InputProces) {
  _inherits(Keyboard, _Primrose$InputProces);

  function Keyboard(input, parent, commands, socket) {
    _classCallCheck(this, Keyboard);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Keyboard).call(this, "Keyboard", parent, commands, socket));

    _this.listeners.clipboard = [];
    _this.listeners.keydown = [];
    _this.listeners.keyup = [];

    _this._operatingSystem = null;
    _this.browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
    _this._codePage = null;

    var execute = function execute(evt) {
      if (!input.lockMovement) {
        _this.setButton(evt.keyCode, evt.type === "keydown");
      } else {
        emit.call(_this, evt.type, evt);
      }
    };

    var focusClipboard = function focusClipboard(evt) {
      if (_this.lockMovement) {
        var cmdName = _this.operatingSystem.makeCommandName(evt, _this.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          surrogate.style.display = "block";
          surrogate.focus();
        }
      }
    };

    var clipboardOperation = function clipboardOperation(evt) {
      if (_this.currentControl) {
        _this.currentControl[evt.type + "SelectedText"](evt);
        if (!evt.returnValue) {
          evt.preventDefault();
        }
        surrogate.style.display = "none";
        _this.currentControl.focus();
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
    return _this;
  }

  _createClass(Keyboard, [{
    key: "doTyping",
    value: function doTyping(elem, evt) {
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
        } else {
          elem.keyDown(evt);
        }
      }
    }
  }, {
    key: "withCurrentControl",
    value: function withCurrentControl(name) {
      var _this2 = this;

      return function (evt) {
        if (_this2.currentControl) {
          if (_this2.currentControl[name]) {
            _this2.currentControl[name](evt);
          } else {
            console.warn("Couldn't find %s on %o", name, _this2.currentControl);
          }
        }
      };
    }
  }, {
    key: "operatingSystem",
    get: function get() {
      return this._operatingSystem;
    },
    set: function set(os) {
      this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
    }
  }, {
    key: "codePage",
    get: function get() {
      return this._codePage;
    },
    set: function set(cp) {
      var key, code, char, name;
      this._codePage = cp;
      if (!this._codePage) {
        var lang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || navigator.browserLanguage;

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
  }]);

  return Keyboard;
}(Primrose.InputProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9LZXlib2FyZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQkFERTtBQUVSLFFBQU0sVUFGRTtBQUdSLGFBQVcseUJBSEg7QUFJUixlQUFhLHdCQUpMO0FBS1IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxFQURLO0FBRVgsVUFBTSxFQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLEVBREw7QUFFRCxVQUFNLEVBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsRUFRVDtBQUNELFVBQU0sRUFETDtBQUVELFVBQU0sRUFGTDtBQUdELGlCQUFhO0FBSFosR0FSUyxFQVlUO0FBQ0QsVUFBTSxFQURMO0FBRUQsVUFBTSxFQUZMO0FBR0QsaUJBQWE7QUFIWixHQVpTO0FBTEosQ0FBWjs7SUF1Qk0sUTs7O0FBQ0osb0JBQVksS0FBWixFQUFtQixNQUFuQixFQUEyQixRQUEzQixFQUFxQyxNQUFyQyxFQUE2QztBQUFBOztBQUFBLDRGQUNyQyxVQURxQyxFQUN6QixNQUR5QixFQUNqQixRQURpQixFQUNQLE1BRE87O0FBRTNDLFVBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsRUFBM0I7QUFDQSxVQUFLLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLEVBQXpCO0FBQ0EsVUFBSyxTQUFMLENBQWUsS0FBZixHQUF1QixFQUF2Qjs7QUFFQSxVQUFLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsVUFBSyxPQUFMLEdBQWUsV0FBVyxVQUFYLEdBQXlCLFlBQVksU0FBWixHQUF5QixPQUFPLElBQVAsR0FBZSxVQUFVLE9BQVYsR0FBcUIsV0FBVyxRQUFYLEdBQXNCLFNBQTNIO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLElBQWpCOztBQUVBLFFBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBQyxHQUFELEVBQVM7QUFDdkIsVUFBSSxDQUFDLE1BQU0sWUFBWCxFQUF5QjtBQUN2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NEQ7QUFDMUQsZ0JBQUksY0FBSjtBQUNEO0FBQ0QsY0FBSSxLQUFLLGVBQUwsQ0FBcUIsYUFBckIsS0FBdUMsZUFBM0MsRUFBNEQ7QUFDMUQsaUJBQUssZUFBTCxDQUFxQixhQUFyQixHQUFxQyxFQUFyQztBQUNEO0FBQ0YsU0FWRCxNQVdLO0FBQ0gsZUFBSyxPQUFMLENBQWEsR0FBYjtBQUNEO0FBQ0Y7QUFDRjs7O3VDQUVrQixJLEVBQU07QUFBQTs7QUFDdkIsYUFBTyxVQUFDLEdBQUQsRUFBUztBQUNkLFlBQUksT0FBSyxjQUFULEVBQXlCO0FBQ3ZCLGNBQUksT0FBSyxjQUFMLENBQW9CLElBQXBCLENBQUosRUFBK0I7QUFDN0IsbUJBQUssY0FBTCxDQUFvQixJQUFwQixFQUEwQixHQUExQjtBQUNELFdBRkQsTUFHSztBQUNILG9CQUFRLElBQVIsQ0FBYSx3QkFBYixFQUF1QyxJQUF2QyxFQUE2QyxPQUFLLGNBQWxEO0FBQ0Q7QUFDRjtBQUNGLE9BVEQ7QUFVRDs7O3dCQUVxQjtBQUNwQixhQUFPLEtBQUssZ0JBQVo7QUFDRCxLO3NCQUVtQixFLEVBQUk7QUFDdEIsV0FBSyxnQkFBTCxHQUF3QixPQUFPLFFBQVEsU0FBUyxJQUFULENBQWMsZ0JBQWQsQ0FBK0IsR0FBdkMsR0FBNkMsU0FBUyxJQUFULENBQWMsZ0JBQWQsQ0FBK0IsT0FBbkYsQ0FBeEI7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLLFNBQVo7QUFDRCxLO3NCQUVZLEUsRUFBSTtBQUNmLFVBQUksR0FBSixFQUNFLElBREYsRUFFRSxJQUZGLEVBR0UsSUFIRjtBQUlBLFdBQUssU0FBTCxHQUFpQixFQUFqQjtBQUNBLFVBQUksQ0FBQyxLQUFLLFNBQVYsRUFBcUI7QUFDbkIsWUFBSSxPQUFRLFVBQVUsU0FBVixJQUF1QixVQUFVLFNBQVYsQ0FBb0IsQ0FBcEIsQ0FBeEIsSUFDVCxVQUFVLFFBREQsSUFFVCxVQUFVLFlBRkQsSUFHVCxVQUFVLGVBSFo7O0FBS0EsWUFBSSxDQUFDLElBQUQsSUFBUyxTQUFTLElBQXRCLEVBQTRCO0FBQzFCLGlCQUFPLE9BQVA7QUFDRDs7QUFFRCxhQUFLLEdBQUwsSUFBWSxTQUFTLElBQVQsQ0FBYyxTQUExQixFQUFxQztBQUNuQyxlQUFLLFNBQVMsSUFBVCxDQUFjLFNBQWQsQ0FBd0IsR0FBeEIsQ0FBTDtBQUNBLGNBQUksR0FBRyxRQUFILEtBQWdCLElBQXBCLEVBQTBCO0FBQ3hCLGlCQUFLLFNBQUwsR0FBaUIsRUFBakI7QUFDQTtBQUNEO0FBQ0Y7O0FBRUQsWUFBSSxDQUFDLEtBQUssU0FBVixFQUFxQjtBQUNuQixlQUFLLFNBQUwsR0FBaUIsU0FBUyxJQUFULENBQWMsU0FBZCxDQUF3QixLQUF6QztBQUNEO0FBQ0Y7QUFDRjs7OztFQXJJb0IsU0FBUyxjIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9JbnB1dC9LZXlib2FyZC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Input.Keyboard = Keyboard;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function processFingerParts(i) {
  return LeapMotion.FINGER_PARTS.map(function (p) {
    return "FINGER" + i + p.toUpperCase();
  });
}

var LeapMotion = function (_Primrose$InputProces) {
  _inherits(LeapMotion, _Primrose$InputProces);

  function LeapMotion(commands, socket) {
    _classCallCheck(this, LeapMotion);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LeapMotion).call(this, "LeapMotion", null, commands, socket));

    _this.isStreaming = false;
    _this.controller = new Leap.Controller({
      enableGestures: true
    });
    return _this;
  }

  _createClass(LeapMotion, [{
    key: "E",
    value: function E(e, f) {
      if (f) {
        this.controller.on(e, f);
      } else {
        this.controller.on(e, console.log.bind(console, "Leap Motion Event: " + e));
      }
    }
  }, {
    key: "start",
    value: function start(gameUpdateLoop) {
      var _this2 = this;

      if (this.isEnabled()) {
        var canceller = null,
            startAlternate = null;
        if (gameUpdateLoop) {
          var alternateLooper = function alternateLooper(t) {
            requestAnimationFrame(alternateLooper);
            gameUpdateLoop(t);
          };
          startAlternate = requestAnimationFrame.bind(window, alternateLooper);
          var timeout = setTimeout(startAlternate, LeapMotion.CONNECTION_TIMEOUT);
          canceller = function canceller() {
            clearTimeout(timeout);
            _this2.isStreaming = true;
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
  }, {
    key: "setState",
    value: function setState(gameUpdateLoop, frame) {
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
          var jointName = fingerName + LeapMotion.FINGER_PARTS[j].toUpperCase();
          for (var k = 0; k < LeapMotion.COMPONENTS.length; ++k) {
            this.setAxis(jointName + LeapMotion.COMPONENTS[k], joint[k]);
          }
        }
      }

      if (gameUpdateLoop) {
        gameUpdateLoop(frame.timestamp * 0.001);
      }

      this.update();
    }
  }]);

  return LeapMotion;
}(Primrose.InputProcessor);

LeapMotion.COMPONENTS = ["X", "Y", "Z"];

LeapMotion.NUM_HANDS = 2;

LeapMotion.NUM_FINGERS = 10;

LeapMotion.FINGER_PARTS = ["tip", "dip", "pip", "mcp", "carp"];

Primrose.InputProcessor.defineAxisProperties(LeapMotion, ["X0", "Y0", "Z0", "X1", "Y1", "Z1", "FINGER0TIPX", "FINGER0TIPY", "FINGER0DIPX", "FINGER0DIPY", "FINGER0PIPX", "FINGER0PIPY", "FINGER0MCPX", "FINGER0MCPY", "FINGER0CARPX", "FINGER0CARPY", "FINGER1TIPX", "FINGER1TIPY", "FINGER1DIPX", "FINGER1DIPY", "FINGER1PIPX", "FINGER1PIPY", "FINGER1MCPX", "FINGER1MCPY", "FINGER1CARPX", "FINGER1CARPY", "FINGER2TIPX", "FINGER2TIPY", "FINGER2DIPX", "FINGER2DIPY", "FINGER2PIPX", "FINGER2PIPY", "FINGER2MCPX", "FINGER2MCPY", "FINGER2CARPX", "FINGER2CARPY", "FINGER3TIPX", "FINGER3TIPY", "FINGER3DIPX", "FINGER3DIPY", "FINGER3PIPX", "FINGER3PIPY", "FINGER3MCPX", "FINGER3MCPY", "FINGER3CARPX", "FINGER3CARPY", "FINGER4TIPX", "FINGER4TIPY", "FINGER4DIPX", "FINGER4DIPY", "FINGER4PIPX", "FINGER4PIPY", "FINGER4MCPX", "FINGER4MCPY", "FINGER4CARPX", "FINGER4CARPY", "FINGER5TIPX", "FINGER5TIPY", "FINGER5DIPX", "FINGER5DIPY", "FINGER5PIPX", "FINGER5PIPY", "FINGER5MCPX", "FINGER5MCPY", "FINGER5CARPX", "FINGER5CARPY", "FINGER6TIPX", "FINGER6TIPY", "FINGER6DIPX", "FINGER6DIPY", "FINGER6PIPX", "FINGER6PIPY", "FINGER6MCPX", "FINGER6MCPY", "FINGER6CARPX", "FINGER6CARPY", "FINGER7TIPX", "FINGER7TIPY", "FINGER7DIPX", "FINGER7DIPY", "FINGER7PIPX", "FINGER7PIPY", "FINGER7MCPX", "FINGER7MCPY", "FINGER7CARPX", "FINGER7CARPY", "FINGER8TIPX", "FINGER8TIPY", "FINGER8DIPX", "FINGER8DIPY", "FINGER8PIPX", "FINGER8PIPY", "FINGER8MCPX", "FINGER8MCPY", "FINGER8CARPX", "FINGER8CARPY", "FINGER9TIPX", "FINGER9TIPY", "FINGER9DIPX", "FINGER9DIPY", "FINGER9PIPX", "FINGER9PIPY", "FINGER9MCPX", "FINGER9MCPY", "FINGER9CARPX", "FINGER9CARPY"]);

LeapMotion.CONNECTION_TIMEOUT = 5000;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9MZWFwTW90aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FBRUEsU0FBUyxrQkFBVCxDQUE0QixDQUE1QixFQUErQjtBQUM3QixTQUFPLFdBQVcsWUFBWCxDQUF3QixHQUF4QixDQUE0QixVQUFVLENBQVYsRUFBYTtBQUM5QyxXQUFPLFdBQVcsQ0FBWCxHQUFlLEVBQUUsV0FBRixFQUF0QjtBQUNELEdBRk0sQ0FBUDtBQUdEOztBQUdELE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQkFERTtBQUVSLFFBQU0saUJBRkU7QUFHUixhQUFXLHlCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sVTs7O0FBQ0osc0JBQVksUUFBWixFQUFzQixNQUF0QixFQUE4QjtBQUFBOztBQUFBLDhGQUN0QixZQURzQixFQUNSLElBRFEsRUFDRixRQURFLEVBQ1EsTUFEUjs7QUFHNUIsVUFBSyxXQUFMLEdBQW1CLEtBQW5CO0FBQ0EsVUFBSyxVQUFMLEdBQWtCLElBQUksS0FBSyxVQUFULENBQW9CO0FBQ3BDLHNCQUFnQjtBQURvQixLQUFwQixDQUFsQjtBQUo0QjtBQU83Qjs7OztzQkFFQyxDLEVBQUcsQyxFQUFHO0FBQ04sVUFBSSxDQUFKLEVBQU87QUFDTCxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEI7QUFDRCxPQUZELE1BR0s7QUFDSCxhQUFLLFVBQUwsQ0FBZ0IsRUFBaEIsQ0FBbUIsQ0FBbkIsRUFBc0IsUUFBUSxHQUFSLENBQVksSUFBWixDQUFpQixPQUFqQixFQUNwQix3QkFBd0IsQ0FESixDQUF0QjtBQUVEO0FBQ0Y7OzswQkFFSyxjLEVBQWdCO0FBQUE7O0FBQ3BCLFVBQUksS0FBSyxTQUFMLEVBQUosRUFBc0I7QUFDcEIsWUFBSSxZQUFZLElBQWhCO0FBQUEsWUFDRSxpQkFBaUIsSUFEbkI7QUFFQSxZQUFJLGNBQUosRUFBb0I7QUFDbEIsY0FBSSxr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

if(typeof window !== "undefined") window.Primrose.Input.LeapMotion = LeapMotion;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Location = function (_Primrose$InputProces) {
  _inherits(Location, _Primrose$InputProces);

  function Location(commands, socket, options) {
    _classCallCheck(this, Location);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Location).call(this, "Location", null, commands, socket));

    _this.options = patch(options, Location.DEFAULTS);

    _this.available = !!navigator.geolocation;
    if (_this.available) {
      navigator.geolocation.watchPosition(_this.setState.bind(_this), function () {
        return _this.available = false;
      }, _this.options);
    }
    return _this;
  }

  _createClass(Location, [{
    key: "setState",
    value: function setState(location) {
      for (var p in location.coords) {
        var k = p.toUpperCase();
        if (Location.AXES.indexOf(k) > -1) {
          this.setAxis(k, location.coords[p]);
        }
      }
      this.update();
    }
  }]);

  return Location;
}(Primrose.InputProcessor);

Primrose.InputProcessor.defineAxisProperties(Location, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

Location.DEFAULTS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 25000
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9Mb2NhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQkFERTtBQUVSLFFBQU0sVUFGRTtBQUdSLGFBQVcseUJBSEg7QUFJUixlQUFhO0FBSkwsQ0FBWjs7SUFNTSxROzs7QUFDSixvQkFBWSxRQUFaLEVBQXNCLE1BQXRCLEVBQThCLE9BQTlCLEVBQXVDO0FBQUE7O0FBQUEsNEZBQy9CLFVBRCtCLEVBQ25CLElBRG1CLEVBQ2IsUUFEYSxFQUNILE1BREc7O0FBR3JDLFVBQUssT0FBTCxHQUFlLE1BQU0sT0FBTixFQUFlLFNBQVMsUUFBeEIsQ0FBZjs7QUFFQSxVQUFLLFNBQUwsR0FBaUIsQ0FBQyxDQUFDLFVBQVUsV0FBN0I7QUFDQSxRQUFJLE1BQUssU0FBVCxFQUFvQjtBQUNsQixnQkFBVSxXQUFWLENBQXNCLGFBQXRCLENBQ0UsTUFBSyxRQUFMLENBQWMsSUFBZCxPQURGLEVBRUU7QUFBQSxlQUFNLE1BQUssU0FBTCxHQUFpQixLQUF2QjtBQUFBLE9BRkYsRUFHRSxNQUFLLE9BSFA7QUFJRDtBQVhvQztBQVl0Qzs7Ozs2QkFFUSxRLEVBQVU7QUFDakIsV0FBSyxJQUFJLENBQVQsSUFBYyxTQUFTLE1BQXZCLEVBQStCO0FBQzdCLFlBQUksSUFBSSxFQUFFLFdBQUYsRUFBUjtBQUNBLFlBQUksU0FBUyxJQUFULENBQWMsT0FBZCxDQUFzQixDQUF0QixJQUEyQixDQUFDLENBQWhDLEVBQW1DO0FBQ2pDLGVBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsU0FBUyxNQUFULENBQWdCLENBQWhCLENBQWhCO0FBQ0Q7QUFDRjtBQUNELFdBQUssTUFBTDtBQUNEOzs7O0VBdkJvQixTQUFTLGM7O0FBMEJoQyxTQUFTLGNBQVQsQ0FBd0Isb0JBQXhCLENBQTZDLFFBQTdDLEVBQXVELENBQUMsV0FBRCxFQUFjLFVBQWQsRUFBMEIsVUFBMUIsRUFBc0MsU0FBdEMsRUFBaUQsT0FBakQsQ0FBdkQ7O0FBRUEsU0FBUyxRQUFULEdBQW9CO0FBQ2xCLHNCQUFvQixJQURGO0FBRWxCLGNBQVksS0FGTTtBQUdsQixXQUFTO0FBSFMsQ0FBcEIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL0lucHV0L0xvY2F0aW9uLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Input.Location = Location;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Motion = function (_Primrose$InputProces) {
  _inherits(Motion, _Primrose$InputProces);

  function Motion(commands, socket) {
    _classCallCheck(this, Motion);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Motion).call(this, "Motion", null, commands, socket));

    var corrector = new MotionCorrector(),
        a = new THREE.Quaternion(),
        b = new THREE.Quaternion(),
        RIGHT = new THREE.Vector3(1, 0, 0),
        UP = new THREE.Vector3(0, 1, 0),
        FORWARD = new THREE.Vector3(0, 0, -1);
    corrector.addEventListener("deviceorientation", function (evt) {
      for (var i = 0; i < Motion.AXES.length; ++i) {
        var k = Motion.AXES[i];
        _this.setAxis(k, evt[k]);
      }
      a.set(0, 0, 0, 1).multiply(b.setFromAxisAngle(UP, evt.HEADING)).multiply(b.setFromAxisAngle(RIGHT, evt.PITCH)).multiply(b.setFromAxisAngle(FORWARD, evt.ROLL));
      _this.headRX = a.x;
      _this.headRY = a.y;
      _this.headRZ = a.z;
      _this.headRW = a.w;
      _this.update();
    });
    _this.zeroAxes = corrector.zeroAxes.bind(corrector);
    return _this;
  }

  _createClass(Motion, [{
    key: "getOrientation",
    value: function getOrientation(value) {
      value = value || new THREE.Quaternion();
      value.set(this.getValue("headRX"), this.getValue("headRY"), this.getValue("headRZ"), this.getValue("headRW"));
      return value;
    }
  }]);

  return Motion;
}(Primrose.InputProcessor);

Primrose.InputProcessor.defineAxisProperties(Motion, ["HEADING", "PITCH", "ROLL", "D_HEADING", "D_PITCH", "D_ROLL", "headAX", "headAY", "headAZ", "headRX", "headRY", "headRZ", "headRW"]);

function makeTransform(s, eye) {
  var sw = Math.max(screen.width, screen.height),
      sh = Math.min(screen.width, screen.height),
      w = Math.floor(sw * devicePixelRatio / 2),
      h = Math.floor(sh * devicePixelRatio),
      i = (eye + 1) / 2;

  if (window.THREE) {
    s.transform = new THREE.Matrix4().makeTranslation(eye * 0.034, 0, 0);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9Nb3Rpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsZ0JBREU7QUFFUixRQUFNLFFBRkU7QUFHUixhQUFXLHlCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sTTs7O0FBQ0osa0JBQVksUUFBWixFQUFzQixNQUF0QixFQUE4QjtBQUFBOztBQUFBLDBGQUN0QixRQURzQixFQUNaLElBRFksRUFDTixRQURNLEVBQ0ksTUFESjs7QUFFNUIsUUFBSSxZQUFZLElBQUksZUFBSixFQUFoQjtBQUFBLFFBQ0UsSUFBSSxJQUFJLE1BQU0sVUFBVixFQUROO0FBQUEsUUFFRSxJQUFJLElBQUksTUFBTSxVQUFWLEVBRk47QUFBQSxRQUdFLFFBQVEsSUFBSSxNQUFNLE9BQVYsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsQ0FIVjtBQUFBLFFBSUUsS0FBSyxJQUFJLE1BQU0sT0FBVixDQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUpQO0FBQUEsUUFLRSxVQUFVLElBQUksTUFBTSxPQUFWLENBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCLENBQUMsQ0FBekIsQ0FMWjtBQU1BLGNBQVUsZ0JBQVYsQ0FBMkIsbUJBQTNCLEVBQWdELFVBQUMsR0FBRCxFQUFTO0FBQ3ZELFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxPQUFPLElBQVAsQ0FBWSxNQUFoQyxFQUF3QyxFQUFFLENBQTFDLEVBQTZDO0FBQzNDLFlBQUksSUFBSSxPQUFPLElBQVAsQ0FBWSxDQUFaLENBQVI7QUFDQSxjQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLElBQUksQ0FBSixDQUFoQjtBQUNEO0FBQ0QsUUFBRSxHQUFGLENBQU0sQ0FBTixFQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixFQUNHLFFBREgsQ0FDWSxFQUFFLGdCQUFGLENBQW1CLEVBQW5CLEVBQXVCLElBQUksT0FBM0IsQ0FEWixFQUVHLFFBRkgsQ0FFWSxFQUFFLGdCQUFGLENBQW1CLEtBQW5CLEVBQTBCLElBQUksS0FBOUIsQ0FGWixFQUdHLFFBSEgsQ0FHWSxFQUFFLGdCQUFGLENBQW1CLE9BQW5CLEVBQTRCLElBQUksSUFBaEMsQ0FIWjtBQUlBLFlBQUssTUFBTCxHQUFjLEVBQUUsQ0FBaEI7QUFDQSxZQUFLLE1BQUwsR0FBYyxFQUFFLENBQWhCO0FBQ0EsWUFBSyxNQUFMLEdBQWMsRUFBRSxDQUFoQjtBQUNBLFlBQUssTUFBTCxHQUFjLEVBQUUsQ0FBaEI7QUFDQSxZQUFLLE1BQUw7QUFDRCxLQWREO0FBZUEsVUFBSyxRQUFMLEdBQWdCLFVBQVUsUUFBVixDQUFtQixJQUFuQixDQUF3QixTQUF4QixDQUFoQjtBQXZCNEI7QUF3QjdCOzs7O21DQUVjLEssRUFBTztBQUNwQixjQUFRLFNBQVMsSUFBSSxNQUFNLFVBQVYsRUFBakI7QUFDQSxZQUFNLEdBQU4sQ0FBVSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQVYsRUFDRSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBREYsRUFFRSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBRkYsRUFHRSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBSEY7QUFJQSxhQUFPLEtBQVA7QUFDRDs7OztFQWxDa0IsU0FBUyxjOztBQXFDOUIsU0FBUyxjQUFULENBQXdCLG9CQUF4QixDQUE2QyxNQUE3QyxFQUFxRCxDQUNuRCxTQURtRCxFQUN4QyxPQUR3QyxFQUMvQixNQUQrQixFQUVuRCxXQUZtRCxFQUV0QyxTQUZzQyxFQUUzQixRQUYyQixFQUduRCxRQUhtRCxFQUd6QyxRQUh5QyxFQUcvQixRQUgrQixFQUluRCxRQUptRCxFQUl6QyxRQUp5QyxFQUkvQixRQUorQixFQUlyQixRQUpxQixDQUFyRDs7QUFPQSxTQUFTLGFBQVQsQ0FBdUIsQ0FBdkIsRUFBMEIsR0FBMUIsRUFBK0I7QUFDN0IsTUFBSSxLQUFLLEtBQUssR0FBTCxDQUFTLE9BQU8sS0FBaEIsRUFBdUIsT0FBTyxNQUE5QixDQUFUO0FBQUEsTUFDRSxLQUFLLEtBQUssR0FBTCxDQUFTLE9BQU8sS0FBaEIsRUFBdUIsT0FBTyxNQUE5QixDQURQO0FBQUEsTUFFRSxJQUFJLEtBQUssS0FBTCxDQUFXLEtBQUssZ0JBQUwsR0FBd0IsQ0FBbkMsQ0FGTjtBQUFBLE1BR0UsSUFBSSxLQUFLLEtBQUwsQ0FBVyxLQUFLLGdCQUFoQixDQUhOO0FBQUEsTUFJRSxJQUFJLENBQUMsTUFBTSxDQUFQLElBQVksQ0FKbEI7O0FBTUEsTUFBSSxPQUFPLEtBQVgsRUFBa0I7QUFDaEIsTUFBRSxTQUFGLEdBQWMsSUFBSSxNQUFNLE9BQVYsR0FDWCxlQURXLENBQ0ssTUFBTSxLQURYLEVBQ2tCLENBRGxCLEVBQ3FCLENBRHJCLENBQWQ7QUFFRDtBQUNELElBQUUsUUFBRixHQUFhO0FBQ1gsT0FBRyxJQUFJLENBREk7QUFFWCxPQUFHLENBRlE7QUFHWCxXQUFPLENBSEk7QUFJWCxZQUFRLENBSkc7QUFLWCxTQUFLLENBTE07QUFNWCxXQUFPLENBQUMsSUFBSSxDQUFMLElBQVUsQ0FOTjtBQU9YLFlBQVEsQ0FQRztBQVFYLFVBQU0sSUFBSTtBQVJDLEdBQWI7QUFVQSxJQUFFLEdBQUYsR0FBUSxFQUFSO0FBQ0Q7O0FBRUQsT0FBTyxrQkFBUCxHQUE0QixDQUFDLEVBQUQsRUFBSyxFQUFMLENBQTVCO0FBQ0EsY0FBYyxPQUFPLGtCQUFQLENBQTBCLENBQTFCLENBQWQsRUFBNEMsQ0FBQyxDQUE3QztBQUNBLGNBQWMsT0FBTyxrQkFBUCxDQUEwQixDQUExQixDQUFkLEVBQTRDLENBQTVDIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9JbnB1dC9Nb3Rpb24uanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Input.Motion = Motion;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mouse = function (_Primrose$InputProces) {
  _inherits(Mouse, _Primrose$InputProces);

  function Mouse(DOMElement, parent, commands, socket) {
    _classCallCheck(this, Mouse);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mouse).call(this, "Mouse", parent, commands, socket));

    _this.timer = null;

    DOMElement = DOMElement || window;

    DOMElement.addEventListener("mousedown", function (event) {
      _this.setButton(event.button, true);
      _this.BUTTONS = event.buttons << 10;
    }, false);

    DOMElement.addEventListener("mouseup", function (event) {
      _this.setButton(event.button, false);
      _this.BUTTONS = event.buttons << 10;
    }, false);

    DOMElement.addEventListener("mousemove", function (event) {
      _this.BUTTONS = event.buttons << 10;
      if (PointerLock.isActive) {
        var mx = event.movementX,
            my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        _this.setMovement(mx, my);
      } else {
        _this.setLocation(event.layerX, event.layerY);
      }
    }, false);

    DOMElement.addEventListener("wheel", function (event) {
      if (isChrome) {
        _this.W += event.deltaX;
        _this.Z += event.deltaY;
      } else if (event.shiftKey) {
        _this.W += event.deltaY;
      } else {
        _this.Z += event.deltaY;
      }
      event.preventDefault();
    }, false);
    return _this;
  }

  _createClass(Mouse, [{
    key: "setLocation",
    value: function setLocation(x, y) {
      this.X = x;
      this.Y = y;
    }
  }, {
    key: "setMovement",
    value: function setMovement(dx, dy) {
      this.X += dx;
      this.Y += dy;
    }
  }]);

  return Mouse;
}(Primrose.InputProcessor);

Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9Nb3VzZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQkFERTtBQUVSLFFBQU0sT0FGRTtBQUdSLGFBQVcseUJBSEg7QUFJUixlQUFhO0FBSkwsQ0FBWjs7SUFNTSxLOzs7QUFDSixpQkFBWSxVQUFaLEVBQXdCLE1BQXhCLEVBQWdDLFFBQWhDLEVBQTBDLE1BQTFDLEVBQWtEO0FBQUE7O0FBQUEseUZBQzFDLE9BRDBDLEVBQ2pDLE1BRGlDLEVBQ3pCLFFBRHlCLEVBQ2YsTUFEZTs7QUFFaEQsVUFBSyxLQUFMLEdBQWEsSUFBYjs7QUFFQSxpQkFBYSxjQUFjLE1BQTNCOztBQUVBLGVBQVcsZ0JBQVgsQ0FBNEIsV0FBNUIsRUFBeUMsVUFBQyxLQUFELEVBQVc7QUFDbEQsWUFBSyxTQUFMLENBQWUsTUFBTSxNQUFyQixFQUE2QixJQUE3QjtBQUNBLFlBQUssT0FBTCxHQUFlLE1BQU0sT0FBTixJQUFpQixFQUFoQztBQUNELEtBSEQsRUFHRyxLQUhIOztBQUtBLGVBQVcsZ0JBQVgsQ0FBNEIsU0FBNUIsRUFBdUMsVUFBQyxLQUFELEVBQVc7QUFDaEQsWUFBSyxTQUFMLENBQWUsTUFBTSxNQUFyQixFQUE2QixLQUE3QjtBQUNBLFlBQUssT0FBTCxHQUFlLE1BQU0sT0FBTixJQUFpQixFQUFoQztBQUNELEtBSEQsRUFHRyxLQUhIOztBQUtBLGVBQVcsZ0JBQVgsQ0FBNEIsV0FBNUIsRUFBeUMsVUFBQyxLQUFELEVBQVc7QUFDbEQsWUFBSyxPQUFMLEdBQWUsTUFBTSxPQUFOLElBQWlCLEVBQWhDO0FBQ0EsVUFBSSxZQUFZLFFBQWhCLEVBQTBCO0FBQ3hCLFlBQUksS0FBSyxNQUFNLFNBQWY7QUFBQSxZQUNFLEtBQUssTUFBTSxTQURiOztBQUdBLFlBQUksT0FBTyxTQUFYLEVBQXNCO0FBQ3BCLGVBQUssTUFBTSxlQUFOLElBQXlCLE1BQU0sWUFBL0IsSUFBK0MsQ0FBcEQ7QUFDQSxlQUFLLE1BQU0sZUFBTixJQUF5QixNQUFNLFlBQS9CLElBQStDLENBQXBEO0FBQ0Q7QUFDRCxjQUFLLFdBQUwsQ0FBaUIsRUFBakIsRUFBcUIsRUFBckI7QUFDRCxPQVRELE1BVUs7QUFDSCxjQUFLLFdBQUwsQ0FBaUIsTUFBTSxNQUF2QixFQUErQixNQUFNLE1BQXJDO0FBQ0Q7QUFDRixLQWZELEVBZUcsS0FmSDs7QUFpQkEsZUFBVyxnQkFBWCxDQUE0QixPQUE1QixFQUFxQyxVQUFDLEtBQUQsRUFBVztBQUM5QyxVQUFJLFFBQUosRUFBYztBQUNaLGNBQUssQ0FBTCxJQUFVLE1BQU0sTUFBaEI7QUFDQSxjQUFLLENBQUwsSUFBVSxNQUFNLE1BQWhCO0FBQ0QsT0FIRCxNQUlLLElBQUksTUFBTSxRQUFWLEVBQW9CO0FBQ3ZCLGNBQUssQ0FBTCxJQUFVLE1BQU0sTUFBaEI7QUFDRCxPQUZJLE1BR0E7QUFDSCxjQUFLLENBQUwsSUFBVSxNQUFNLE1BQWhCO0FBQ0Q7QUFDRCxZQUFNLGNBQU47QUFDRCxLQVpELEVBWUcsS0FaSDtBQWpDZ0Q7QUE4Q2pEOzs7O2dDQUVXLEMsRUFBRyxDLEVBQUc7QUFDaEIsV0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLFdBQUssQ0FBTCxHQUFTLENBQVQ7QUFDRDs7O2dDQUVXLEUsRUFBSSxFLEVBQUk7QUFDbEIsV0FBSyxDQUFMLElBQVUsRUFBVjtBQUNBLFdBQUssQ0FBTCxJQUFVLEVBQVY7QUFDRDs7OztFQXpEaUIsU0FBUyxjOztBQTREN0IsU0FBUyxjQUFULENBQXdCLG9CQUF4QixDQUE2QyxLQUE3QyxFQUFvRCxDQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsR0FBWCxFQUFnQixHQUFoQixFQUFxQixTQUFyQixDQUFwRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSW5wdXQvTW91c2UuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Input.Mouse = Mouse;
})();
(function(){
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Speech = function (_Primrose$InputProces) {
  _inherits(Speech, _Primrose$InputProces);

  function Speech(commands, socket) {
    _classCallCheck(this, Speech);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Speech).call(this, "Speech", null, commands, socket));

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
      } else if (!running) {
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

    _this.check = function () {
      if (this.enabled && !running) {
        start();
      } else if (!this.enabled && running) {
        stop();
      }
    };

    _this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if (window.SpeechRecognition) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      } else {
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
      }.bind(_this), true);

      recognition.addEventListener("error", function (evt) {
        restart = true;
        console.log("speech error", evt);
        running = false;
        command = "speech error";
      }.bind(_this), true);

      recognition.addEventListener("end", function (evt) {
        console.log("speech ended", evt);
        running = false;
        command = "speech ended";
        if (restart) {
          restart = false;
          this.enable(true);
        }
      }.bind(_this), true);

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
      }.bind(_this), true);

      available = true;
    } catch (exp) {
      console.error(exp);
      errorMessage = exp;
      available = false;
    }
    return _this;
  }

  _createClass(Speech, [{
    key: "cloneCommand",
    value: function cloneCommand(cmd) {
      return {
        name: cmd.name,
        preamble: cmd.preamble,
        keywords: Speech.maybeClone(cmd.keywords),
        commandUp: cmd.commandUp,
        disabled: cmd.disabled
      };
    }
  }, {
    key: "evalCommand",
    value: function evalCommand(cmd, cmdState, metaKeysSet, dt) {
      if (metaKeysSet && this.inputState.text) {
        for (var i = 0; i < cmd.keywords.length; ++i) {
          if (this.inputState.text.indexOf(cmd.keywords[i]) === 0 && (cmd.preamble || cmd.keywords[i].length === this.inputState.text.length)) {
            cmdState.pressed = true;
            cmdState.value = this.inputState.text.substring(cmd.keywords[i].length).trim();
            this.inputState.text = null;
          }
        }
      }
    }
  }, {
    key: "enable",
    value: function enable(k, v) {
      _get(Object.getPrototypeOf(Speech.prototype), "enable", this).call(this, k, v);
      this.check();
    }
  }, {
    key: "transmit",
    value: function transmit(v) {
      _get(Object.getPrototypeOf(Speech.prototype), "transmit", this).call(this, v);
      this.check();
    }
  }], [{
    key: "maybeClone",
    value: function maybeClone(arr) {
      return arr && arr.slice() || [];
    }
  }]);

  return Speech;
}(Primrose.InputProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9TcGVlY2guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGdCQURFO0FBRVIsUUFBTSxRQUZFO0FBR1IsYUFBVyx5QkFISDtBQUlSLGVBQWE7QUFKTCxDQUFaOztJQU1NLE07OztBQUNKLGtCQUFZLFFBQVosRUFBc0IsTUFBdEIsRUFBOEI7QUFBQTs7QUFBQSwwRkFDdEIsUUFEc0IsRUFDWixJQURZLEVBQ04sUUFETSxFQUNJLE1BREo7O0FBRTVCLFFBQUksVUFBVSxLQUFkO0FBQUEsUUFDRSxjQUFjLElBRGhCO0FBQUEsUUFFRSxlQUFlLElBRmpCOztBQUlBLGFBQVMsSUFBVCxHQUFnQjtBQUNkLFVBQUksTUFBTSxpREFBaUQsYUFBYSxPQUF4RTtBQUNBLGNBQVEsS0FBUixDQUFjLEdBQWQ7QUFDQSxhQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFTLEtBQVQsR0FBaUI7QUFDZixVQUFJLENBQUMsU0FBTCxFQUFnQjtBQUNkLGVBQU8sTUFBUDtBQUNELE9BRkQsTUFHSyxJQUFJLENBQUMsT0FBTCxFQUFjO0FBQ2pCLGtCQUFVLElBQVY7QUFDQSxvQkFBWSxLQUFaO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7QUFDRCxhQUFPLEtBQVA7QUFDRDs7QUFFRCxhQUFTLElBQVQsR0FBZ0I7QUFDZCxVQUFJLENBQUMsU0FBTCxFQUFnQjtB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

if(typeof window !== "undefined") window.Primrose.Input.Speech = Speech;
})();
(function(){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Touch = function (_Primrose$InputProces) {
  _inherits(Touch, _Primrose$InputProces);

  function Touch(DOMElement, parent, commands, socket) {
    _classCallCheck(this, Touch);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Touch).call(this, "Touch", parent, commands, socket));

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
        } else {
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

    DOMElement.addEventListener("touchstart", setState.bind(_this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(_this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(_this, true, true), false);
    return _this;
  }

  return Touch;
}(Primrose.InputProcessor);

if (navigator.maxTouchPoints) {
  var axes = ["FINGERS"];
  for (var i = 0; i < navigator.maxTouchPoints; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9Ub3VjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsZ0JBREU7QUFFUixRQUFNLE9BRkU7QUFHUixhQUFXLHlCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sSzs7O0FBQ0osaUJBQVksVUFBWixFQUF3QixNQUF4QixFQUFnQyxRQUFoQyxFQUEwQyxNQUExQyxFQUFrRDtBQUFBOztBQUFBLHlGQUMxQyxPQUQwQyxFQUNqQyxNQURpQyxFQUN6QixRQUR5QixFQUNmLE1BRGU7O0FBRWhELGlCQUFhLGNBQWMsTUFBM0I7O0FBRUEsYUFBUyxRQUFULENBQWtCLFdBQWxCLEVBQStCLE9BQS9CLEVBQXdDLEtBQXhDLEVBQStDO0FBQzdDLFVBQUksVUFBVSxNQUFNLGNBQXBCO0FBQUEsVUFDRSxJQUFJLENBRE47QUFBQSxVQUVFLElBQUksSUFGTjtBQUdBLFdBQUssSUFBSSxDQUFULEVBQVksSUFBSSxRQUFRLE1BQXhCLEVBQWdDLEVBQUUsQ0FBbEMsRUFBcUM7QUFDbkMsWUFBSSxRQUFRLENBQVIsQ0FBSjs7QUFFQSxZQUFJLE9BQUosRUFBYTtBQUNYLGVBQUssT0FBTCxDQUFhLE1BQU0sRUFBRSxVQUFyQixFQUFpQyxFQUFFLEtBQW5DO0FBQ0EsZUFBSyxPQUFMLENBQWEsTUFBTSxFQUFFLFVBQXJCLEVBQWlDLEVBQUUsS0FBbkM7QUFDRCxTQUhELE1BSUs7QUFDSCxlQUFLLE9BQUwsQ0FBYSxPQUFPLEVBQUUsVUFBdEIsRUFBa0MsRUFBRSxLQUFwQztBQUNBLGVBQUssT0FBTCxDQUFhLE9BQU8sRUFBRSxVQUF0QixFQUFrQyxFQUFFLEtBQXBDO0FBQ0Q7O0FBRUQsYUFBSyxTQUFMLENBQWUsV0FBVyxFQUFFLFVBQTVCLEVBQXdDLFdBQXhDO0FBQ0Q7QUFDRCxnQkFBVSxNQUFNLE9BQWhCOztBQUVBLFVBQUksY0FBYyxDQUFsQjtBQUNBLFdBQUssSUFBSSxDQUFULEVBQVksSUFBSSxRQUFRLE1BQXhCLEVBQWdDLEVBQUUsQ0FBbEMsRUFBcUM7QUFDbkMsdUJBQWUsS0FBSyxFQUFFLFVBQXRCO0FBQ0Q7QUFDRCxXQUFLLE9BQUwsR0FBZSxXQUFmO0FBQ0EsWUFBTSxjQUFOO0FBQ0Q7O0FBRUQsZUFBVyxnQkFBWCxDQUE0QixZQUE1QixFQUEwQyxTQUFTLElBQVQsUUFBb0IsSUFBcEIsRUFBMEIsS0FBMUIsQ0FBMUMsRUFBNEUsS0FBNUU7QUFDQSxlQUFXLGdCQUFYLENBQTRCLFVBQTVCLEVBQXdDLFNBQVMsSUFBVCxRQUFvQixLQUFwQixFQUEyQixJQUEzQixDQUF4QyxFQUEwRSxLQUExRTtBQUNBLGVBQVcsZ0JBQVgsQ0FBNEIsV0FBNUIsRUFBeUMsU0FBUyxJQUFULFFBQW9CLElBQXBCLEVBQTBCLElBQTFCLENBQXpDLEVBQTBFLEtBQTFFO0FBbENnRDtBQW1DakQ7OztFQXBDaUIsU0FBUyxjOztBQXVDN0IsSUFBSSxVQUFVLGNBQWQsRUFBOEI7QUFDNUIsTUFBSSxPQUFPLENBQUMsU0FBRCxDQUFYO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsY0FBOUIsRUFBOEMsRUFBRSxDQUFoRCxFQUFtRDtBQUNqRCxTQUFLLElBQUwsQ0FBVSxNQUFNLENBQWhCO0FBQ0EsU0FBSyxJQUFMLENBQVUsTUFBTSxDQUFoQjtBQUNEOztBQUVELFdBQVMsY0FBVCxDQUF3QixvQkFBeEIsQ0FBNkMsS0FBN0MsRUFBb0QsSUFBcEQ7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvSW5wdXQvVG91Y2guanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Input.Touch = Touch;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_POSE = {
  position: [0, 0, 0],
  orientation: [0, 0, 0, 1]
},
    GAZE_LENGTH = 3000;
var VR = function (_Primrose$PoseInputPr) {
  _inherits(VR, _Primrose$PoseInputPr);

  function VR(avatarHeight, parent, socket) {
    _classCallCheck(this, VR);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VR).call(this, "VR", parent, null, socket));

    _this.displays = [];
    _this._transformers = [];
    _this.currentDeviceIndex = -1;
    _this.movePlayer = new THREE.Matrix4();
    _this.defaultAvatarHeight = avatarHeight;
    _this.stage = null;
    _this.lastStageWidth = null;
    _this.lastStageDepth = null;

    console.info("Checking for displays...");
    _this.ready = navigator.getVRDisplays().then(function (displays) {
      console.log("Displays found:", displays.length);
      _this.displays.push.apply(_this.displays, displays);
      return _this.displays;
    });
    return _this;
  }

  _createClass(VR, [{
    key: "connect",
    value: function connect(selectedIndex) {
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
  }, {
    key: "requestPresent",
    value: function requestPresent(opts) {
      var _this2 = this;

      if (!this.currentDevice) {
        return Promise.reject("No display");
      } else {
        var elem, promise;

        var _ret = function () {
          var layers = opts;
          if (!(layers instanceof Array)) {
            layers = [layers];
          }

          if (_this2.isNativeMobileWebVR) {
            layers = layers[0];
          }

          elem = opts[0].source;
          promise = FullScreen.request(elem).catch(function (exp) {
            return console.warn("FullScreen", exp);
          }).then(function () {
            return PointerLock.request(elem);
          }).catch(function (exp) {
            return console.warn("PointerLock", exp);
          }).then(function () {
            return _this2.currentDevice.requestPresent(layers);
          }).catch(function (exp) {
            return console.warn("requstPresent", exp);
          });


          if (_this2.isNativeMobileWebVR) {
            promise = promise.then(Orientation.lock).catch(function (exp) {
              return console.warn("OrientationLock", exp);
            });
          }

          return {
            v: promise
          };
        }();

        if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var _this3 = this;

      var promise = null;
      if (this.isPresenting) {
        promise = this.currentDevice.exitPresent();
        this.currentDevice = null;
        this.currentDeviceIndex = -1;
        this.currentPose = null;
      } else {
        promise = Promise.resolve();
      }

      if (this.isNativeMobileWebVR) {
        promise = promise.then(Orientation.unlock);
      }

      return promise.then(PointerLock.exit).then(function () {
        return _this3.connect(0);
      });
    }
  }, {
    key: "zero",
    value: function zero() {
      _get(Object.getPrototypeOf(VR.prototype), "zero", this).call(this);
      if (this.currentDevice) {
        this.currentDevice.resetPose();
      }
    }
  }, {
    key: "update",
    value: function update(dt) {
      _get(Object.getPrototypeOf(VR.prototype), "update", this).call(this, dt);

      var x = 0,
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
      } else {
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
  }, {
    key: "submitFrame",
    value: function submitFrame() {
      if (this.currentDevice) {
        this.currentDevice.submitFrame(this.currentPose);
      }
    }
  }, {
    key: "resolvePicking",
    value: function resolvePicking(currentHits, lastHits, objects) {
      _get(Object.getPrototypeOf(VR.prototype), "resolvePicking", this).call(this, currentHits, lastHits, objects);

      var currentHit = currentHits.VR,
          lastHit = lastHits && lastHits.VR,
          dt,
          lt;
      if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
        currentHit.startTime = lastHit.startTime;
        currentHit.gazeFired = lastHit.gazeFired;
        dt = lt - currentHit.startTime;
        if (dt >= GAZE_LENGTH && !currentHit.gazeFired) {
          currentHit.gazeFired = true;
          emit.call(this, "gazecomplete", currentHit);
          emit.call(this.pickableObjects[currentHit.objectID], "click", "Gaze");
        }
      } else {
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
  }, {
    key: "getTransforms",
    value: function getTransforms(near, far) {
      if (this.currentDevice) {
        if (!this._transformers[this.currentDeviceIndex]) {
          this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
        }
        return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
      }
    }
  }, {
    key: "isNativeMobileWebVR",
    get: function get() {
      return !(this.currentDevice && this.currentDevice.isPolyfilled) && isChrome && isMobile;
    }
  }, {
    key: "hasStage",
    get: function get() {
      return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
    }
  }, {
    key: "canMirror",
    get: function get() {
      return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
    }
  }, {
    key: "isPolyfilled",
    get: function get() {
      return this.currentDevice && this.currentDevice.isPolyfilled;
    }
  }, {
    key: "isPresenting",
    get: function get() {
      return this.currentDevice && this.currentDevice.isPresenting;
    }
  }, {
    key: "hasOrientation",
    get: function get() {
      return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
    }
  }, {
    key: "currentCanvas",
    get: function get() {
      return this.isPresenting && this.currentDevice.getLayers()[0].source;
    }
  }]);

  return VR;
}(Primrose.PoseInputProcessor);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9JbnB1dC9WUi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLGVBQWU7QUFDakIsWUFBVSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQURPO0FBRWpCLGVBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWO0FBRkksQ0FBckI7QUFBQSxJQUlFLGNBQWMsSUFKaEI7QUFLQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsZ0JBREU7QUFFUixRQUFNLElBRkU7QUFHUixhQUFXLDZCQUhIO0FBSVIsY0FBWSxDQUFDO0FBQ1gsVUFBTSxVQURLO0FBRVgsVUFBTSxPQUZLO0FBR1gsY0FBVSxJQUhDO0FBSVgsaUJBQWE7QUFKRixHQUFELEVBS1Q7QUFDRCxVQUFNLFFBREw7QUFFRCxVQUFNLFdBRkw7QUFHRCxjQUFVLElBSFQ7QUFJRCxpQkFBYTtBQUpaLEdBTFMsQ0FKSjtBQWVSLGVBQWE7QUFmTCxDQUFaOztJQWlCTSxFOzs7QUFDSixjQUFZLFlBQVosRUFBMEIsTUFBMUIsRUFBa0MsTUFBbEMsRUFBMEM7QUFBQTs7QUFBQSxzRkFDbEMsSUFEa0MsRUFDNUIsTUFENEIsRUFDcEIsSUFEb0IsRUFDZCxNQURjOztBQUd4QyxVQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxVQUFLLGtCQUFMLEdBQTBCLENBQUMsQ0FBM0I7QUFDQSxVQUFLLFVBQUwsR0FBa0IsSUFBSSxNQUFNLE9BQVYsRUFBbEI7QUFDQSxVQUFLLG1CQUFMLEdBQTJCLFlBQTNCO0FBQ0EsVUFBSyxLQUFMLEdBQWEsSUFBYjtBQUNBLFVBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNBLFVBQUssY0FBTCxHQUFzQixJQUF0Qjs7QUFFQSxZQUFRLElBQVIsQ0FBYSwwQkFBYjtBQUNBLFVBQUssS0FBTCxHQUFhLFVBQVUsYUFBVixHQUNWLElBRFUs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

if(typeof window !== "undefined") window.Primrose.Input.VR = VR;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ENABLE_OPUS_HACK = false;

if (!navigator.mediaDevices) {
  navigator.mediaDevices = {};
}
if (!navigator.mediaDevices.getUserMedia) {
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
  navigator.mediaDevices.getUserMedia = function (constraint) {
    return new Promise(function (resolve, reject) {
      return navigator.getUserMedia(constraint, resolve, reject);
    });
  };
}

var preferOpus = function () {
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
    return result && result.length == 2 ? result[1] : null;
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
}();

var AudioChannel = function (_Primrose$WebRTCSocke) {
  _inherits(AudioChannel, _Primrose$WebRTCSocke);

  function AudioChannel(extraIceServers, proxyServer, fromUserName, toUserName, outAudio, goSecond) {
    _classCallCheck(this, AudioChannel);

    console.log("attempting to peer audio from %s to %s. %s goes first.", fromUserName, toUserName, goSecond ? toUserName : fromUserName);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioChannel).call(this, extraIceServers, proxyServer, fromUserName, 0, toUserName, 0, goSecond));

    Object.defineProperty(_this, "outAudio", {
      get: function get() {
        return outAudio;
      }
    });

    _this.inAudio = null;
    _this.startTimeout();
    return _this;
  }

  _createClass(AudioChannel, [{
    key: 'issueRequest',
    value: function issueRequest() {
      var _this2 = this;

      // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
      //  version of the API) and Chrome.
      var addStream = function addStream() {
        _this2._log(0, "adding stream", _this2.outAudio);

        // Make sure we actually have audio to send to the remote.
        if (_this2.outAudio) {
          if (isFirefox) {
            _this2.outAudio.getAudioTracks().forEach(function (track) {
              return _this2.rtc.addTrack(track, _this2.outAudio);
            });
          } else {
            _this2.rtc.addStream(_this2.outAudio);
          }
        }
      };

      // Receiving an audio stream from the peer connection is just a
      var onStream = function onStream(stream) {
        _this2.inAudio = stream;
        if (!_this2.goFirst) {
          _this2._log(0, "Creating the second stream from %s to %s", _this2.fromUserName, _this2.toUserName);
          addStream();
        }
      };

      // Wait to receive an audio track.
      if (isFirefox) {
        this.rtc.ontrack = function (evt) {
          return onStream(evt.streams[0]);
        };
      } else {
        this.rtc.onaddstream = function (evt) {
          return onStream(evt.stream);
        };
      }

      // If we're the boss, tell people about it.
      if (this.goFirst) {
        this._log(0, "Creating the first stream from %s to %s", this.fromUserName, this.toUserName);
        addStream();
      }
    }

    // The peering process is complete when all offers are answered.

  }, {
    key: 'teardown',
    value: function teardown() {
      if (isFirefox) {
        this.rtc.ontrack = null;
      } else {
        this.rtc.onaddstream = null;
      }
    }
  }, {
    key: 'createOffer',
    value: function createOffer() {
      return _get(Object.getPrototypeOf(AudioChannel.prototype), 'createOffer', this).call(this).then(preferOpus);
    }
  }, {
    key: 'complete',
    get: function get() {
      if (this.goFirst) {
        this._log(1, "[First]: OC %s -> AR %s -> OR %s -> AC %s.", this.progress.offer.created, this.progress.answer.received, this.progress.offer.received, this.progress.answer.created);
      } else {
        this._log(1, "[Second]: OR %s -> AC %s -> OC %s -> AR %s.", this.progress.offer.received, this.progress.answer.created, this.progress.offer.created, this.progress.answer.received);
      }

      return _get(Object.getPrototypeOf(AudioChannel.prototype), 'complete', this) || this.progress.offer.received && this.progress.offer.created && this.progress.answer.received && this.progress.answer.created;
    }
  }]);

  return AudioChannel;
}(Primrose.WebRTCSocket);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9OZXR3b3JrL0F1ZGlvQ2hhbm5lbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTSxtQkFBbUIsS0FBekI7O0FBRUEsSUFBSSxDQUFDLFVBQVUsWUFBZixFQUE2QjtBQUMzQixZQUFVLFlBQVYsR0FBeUIsRUFBekI7QUFDRDtBQUNELElBQUksQ0FBQyxVQUFVLFlBQVYsQ0FBdUIsWUFBNUIsRUFBMEM7QUFDeEMsWUFBVSxZQUFWLEdBQ0UsVUFBVSxZQUFWLElBQ0EsVUFBVSxrQkFEVixJQUVBLFVBQVUsZUFGVixJQUdBLFVBQVUsY0FIVixJQUlBLFVBQVUsYUFMWjtBQU1BLFlBQVUsWUFBVixDQUF1QixZQUF2QixHQUFzQyxVQUFDLFVBQUQ7QUFBQSxXQUFnQixJQUFJLE9BQUosQ0FBWSxVQUFDLE9BQUQsRUFBVSxNQUFWO0FBQUEsYUFBcUIsVUFBVSxZQUFWLENBQXVCLFVBQXZCLEVBQW1DLE9BQW5DLEVBQTRDLE1BQTVDLENBQXJCO0FBQUEsS0FBWixDQUFoQjtBQUFBLEdBQXRDO0FBQ0Q7O0FBRUQsSUFBSSxhQUFjLFlBQVk7QUFDNUIsV0FBUyxVQUFULENBQW9CLFdBQXBCLEVBQWlDO0FBQy9CLFFBQUksZ0JBQUosRUFBc0I7QUFDcEIsVUFBSSxNQUFNLFlBQVksR0FBdEI7QUFDQSxVQUFJLFdBQVcsSUFBSSxLQUFKLENBQVUsTUFBVixDQUFmO0FBQ0EsVUFBSSxhQUFhLElBQWpCO0FBQ0E7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBUyxNQUE3QixFQUFxQyxHQUFyQyxFQUEwQztBQUN4QyxZQUFJLFNBQVMsQ0FBVCxFQUFZLE1BQVosQ0FBbUIsU0FBbkIsTUFBa0MsQ0FBQyxDQUF2QyxFQUEwQztBQUN4Qyx1QkFBYSxDQUFiO0FBQ0E7QUFDRDtBQUNGO0FBQ0QsVUFBSSxlQUFlLElBQW5CLEVBQXlCLE9BQU8sR0FBUDs7QUFFekI7QUFDQSxXQUFLLElB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QUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FEdEIsRUFFRSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLFFBRnZCLEVBR0UsS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixRQUh0QixFQUlFLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsT0FKdkI7QUFLRCxPQU5ELE1BT0s7QUFDSCxhQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsNkNBQWIsRUFDRSxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLFFBRHRCLEVBRUUsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixPQUZ2QixFQUdFLEtBQUssUUFBTCxDQUFjLEtBQWQsQ0FBb0IsT0FIdEIsRUFJRSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLFFBSnZCO0FBS0Q7O0FBRUQsYUFBTyx5RUFBbUIsS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixRQUFwQixJQUN4QixLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BREksSUFFeEIsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixRQUZHLElBR3hCLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsT0FIdkI7QUFJRDs7OztFQXZGd0IsU0FBUyxZIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9OZXR3b3JrL0F1ZGlvQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Network.AudioChannel = AudioChannel;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var INSTANCE_COUNT = 0;

var DataChannel = function (_Primrose$WebRTCSocke) {
  _inherits(DataChannel, _Primrose$WebRTCSocke);

  function DataChannel(extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    _classCallCheck(this, DataChannel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataChannel).call(this, extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond));

    _this.dataChannel = null;
    return _this;
  }

  _createClass(DataChannel, [{
    key: "issueRequest",
    value: function issueRequest() {
      var _this2 = this;

      if (goFirst) {
        this._log(0, "Creating data channel");
        this.dataChannel = this.rtc.createDataChannel();
      } else {
        this.ondatachannel = function (evt) {
          _this2._log(0, "Receving data channel");
          _this2.dataChannel = evt.channel;
        };
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      this.rtc.ondatachannel = null;
    }
  }, {
    key: "complete",
    get: function get() {
      if (this.goFirst) {
        this._log(1, "[First]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
      } else {
        this._log(1, "[Second]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
      }
      return _get(Object.getPrototypeOf(DataChannel.prototype), "complete", this) || this.goFirst && this.progress.offer.created && this.progress.answer.received || !this.goFirst && this.progress.offer.recieved && this.progress.answer.created;
    }
  }]);

  return DataChannel;
}(Primrose.WebRTCSocket);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9OZXR3b3JrL0RhdGFDaGFubmVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsa0JBREU7QUFFUixRQUFNLGFBRkU7QUFHUixhQUFXLHVCQUhIO0FBSVIsZUFBYSwyRkFKTDtBQUtSLGNBQVksQ0FBQztBQUNYLFVBQU0saUJBREs7QUFFWCxVQUFNLE9BRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sYUFETDtBQUVELFVBQU0sV0FGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxjQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTLEVBWVQ7QUFDRCxVQUFNLGVBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBWlMsRUFnQlQ7QUFDRCxVQUFNLFlBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBaEJTLEVBb0JUO0FBQ0QsVUFBTSxhQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQXBCUztBQUxKLENBQVo7O0lBK0JNLFc7OztBQUNKLHVCQUFZLGVBQVosRUFBNkIsV0FBN0IsRUFBMEMsWUFBMUMsRUFBd0QsYUFBeEQsRUFBdUUsVUFBdkUsRUFBbUYsV0FBbkYsRUFBZ0csUUFBaEcsRUFBMEc7QUFBQTs7QUFBQSwrRkFDbEcsZUFEa0csRUFDakYsV0FEaUYsRUFDcEUsWUFEb0UsRUFDdEQsYUFEc0QsRUFDdkMsVUFEdUMsRUFDM0IsV0FEMkIsRUFDZCxRQURjOztBQUd4RyxVQUFNLFFBQU4sQ0FBZTtBQUNiLGNBQVEsOEJBREs7QUFFYixZQUFNLGFBRk87QUFHYixZQUFNLGdCQUhPO0FBSWIsbUJBQWE7QUFKQSxLQUFmO0FBTUEsVUFBSyxXQUFMLEdBQW1CLElBQW5CO0FBVHdHO0FBVXpHOzs7O21DQUVjO0FBQUE7O0FBQ2IsVUFBSSxPQUFKLEVBQWE7QUFDWCxhQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsdUJBQWI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsS0FBSyxHQUFMLENBQVMsaUJBQVQsRUFBbkI7QUFDRCxPQUhELE1BSUs7QUFDSCxhQUFLLGFBQUwsR0FBcUIsVUFBQyxHQUFELEVBQVM7QUFDNUIsaUJBQUssSUFBTCxDQUFVLENBQVYsRUFBYSx1QkFBYjtBQUNBLGlCQUFLLFdBQUwsR0FBbUIsSUFBSSxPQUF2QjtBQUNELFNBSEQ7QUFJRDtBQUNGOzs7K0JBa0JVO0FBQ1QsV0FBSyxHQUFMLENBQVMsYUFBVCxHQUF5QixJQUF6QjtBQUNEOzs7d0JBbEJjO0FBQ2IsVUFBSSxLQUFLLE9BQVQsRUFBa0I7QUFDaEIsYUFBSyxJQUFMLENBQVUsQ0FBVixFQUFhLDBCQUFiLEVBQ0UsS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixPQUR0QixFQUVFLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsUUFGdkI7QUFHRCxPQUpELE1BS0s7QUFDSCxhQUFLLElBQUwsQ0FBVSxDQUFWLEVBQWEsMkJBQWIsRUFDRSxLQUFLLFFBQUwsQ0FBYyxLQUFkLENBQW9CLE9BRHRCLEVBRUUsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixRQUZ2QjtBQUdEO0FBQ0QsYUFBTyx3RUFDSixLQUFLLE9BQUwsSUFBZ0IsS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixPQUFwQyxJQUErQyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLFFBQXBFLElBQ0MsQ0FBQyxLQUFLLE9BQU4sSUFBaUIsS0FBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixRQUFyQyxJQUFpRCxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLE9BRjFFO0FBR0Q7Ozs7RUF4Q3VCLFNBQVMsWSIsImZpbGUiOiJzcmMvUHJpbXJvc2UvTmV0d29yay9EYXRhQ2hhbm5lbC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Network.DataChannel = DataChannel;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Manager = function (_Primrose$AbstractEve) {
  _inherits(Manager, _Primrose$AbstractEve);

  function Manager(localUser, audio, factories, options) {
    _classCallCheck(this, Manager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Manager).call(this));

    _this.localUser = localUser;
    _this.audio = audio;
    _this.factories = factories;
    _this.options = options;
    _this.lastNetworkUpdate = 0;
    _this.oldState = [];
    _this.users = {};
    _this.extraIceServers = [];
    if (options.webRTC) {
      _this.waitForLastUser = options.webRTC.then(function (obj) {
        if (obj) {
          _this.extraIceServers.push.apply(_this.extraIceServers, obj.iceServers);
        }
      });
    } else {
      _this.waitForLastUser = Promise.resolve();
    }
    _this._socket = null;
    _this.userName = null;
    _this.microphone = null;
    return _this;
  }

  _createClass(Manager, [{
    key: "update",
    value: function update(dt) {
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
  }, {
    key: "updateUser",
    value: function updateUser(state) {
      var key = state[0];
      if (key !== this.userName) {
        var user = this.users[key];
        if (user) {
          user.state = state;
        } else {
          console.error("Unknown user", key);
        }
      } else if (this.deviceIndex > 0) {
        this.localUser.stage.mesh.position.fromArray(state, 1);
        this.localUser.stage.mesh.quaternion.fromArray(state, 4);
        this.localUser.head.mesh.position.fromArray(state, 8);
        this.localUser.head.mesh.quaternion.fromArray(state, 11);
      }
    }
  }, {
    key: "connect",
    value: function connect(socket, userName) {
      this.userName = userName.toLocaleUpperCase();
      if (!this.microphone) {
        this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        }).then(Primrose.Output.Audio3D.setAudioStream).catch(console.warn.bind(console, "Can't get audio"));
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
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.userName = null;
      this._socket.close();
      this._socket = null;
    }
  }, {
    key: "addUser",
    value: function addUser(state, goSecond) {
      var _this2 = this;

      console.log("User %s logging on.", state[0]);
      var toUserName = state[0],
          user = new Primrose.Network.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor);
      this.users[toUserName] = user;
      this.updateUser(state);
      this.emit("addavatar", user);
      this.waitForLastUser = this.waitForLastUser.then(function () {
        return user.peer(_this2.extraIceServers, _this2._socket, _this2.microphone, _this2.userName, _this2.audio, goSecond);
      }).then(function () {
        return console.log("%s is peered with %s", _this2.userName, toUserName);
      }).catch(function (exp) {
        return console.error("Couldn't load user: " + name, exp);
      });
    }
  }, {
    key: "removeUser",
    value: function removeUser(key) {
      console.log("User %s logging off.", key);
      var user = this.users[key];
      if (user) {
        user.unpeer();
        delete this.users[key];
        this.emit("removeavatar", user);
      }
    }
  }, {
    key: "listUsers",
    value: function listUsers(newUsers) {
      Object.keys(this.users).forEach(this.removeUser.bind(this));
      while (newUsers.length > 0) {
        this.addUser(newUsers.shift(), true);
      }
      this.emit("authorizationsucceeded");
    }
  }, {
    key: "receiveChat",
    value: function receiveChat(evt) {
      console.log("chat", evt);
    }
  }, {
    key: "lostConnection",
    value: function lostConnection() {
      this.deviceIndex = null;
    }
  }, {
    key: "addDevice",
    value: function addDevice(index) {
      console.log("addDevice", index);
    }
  }, {
    key: "setDeviceIndex",
    value: function setDeviceIndex(index) {
      this.deviceIndex = index;
    }
  }]);

  return Manager;
}(Primrose.AbstractEventEmitter);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9OZXR3b3JrL01hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsa0JBREU7QUFFUixRQUFNLFNBRkU7QUFHUixjQUFZLENBQUM7QUFDWCxVQUFNLFdBREs7QUFFWCxVQUFNLHlCQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLE9BREw7QUFFRCxVQUFNLHlCQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLEVBUVQ7QUFDRCxVQUFNLFdBREw7QUFFRCxVQUFNLHNCQUZMO0FBR0QsaUJBQWE7QUFIWixHQVJTO0FBSEosQ0FBWjs7SUFpQk0sTzs7O0FBQ0osbUJBQVksU0FBWixFQUF1QixLQUF2QixFQUE4QixTQUE5QixFQUF5QyxPQUF6QyxFQUFrRDtBQUFBOztBQUFBOztBQUVoRCxVQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFDQSxVQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLFNBQWpCO0FBQ0EsVUFBSyxPQUFMLEdBQWUsT0FBZjtBQUNBLFVBQUssaUJBQUwsR0FBeUIsQ0FBekI7QUFDQSxVQUFLLFFBQUwsR0FBZ0IsRUFBaEI7QUFDQSxVQUFLLEtBQUwsR0FBYSxFQUFiO0FBQ0EsVUFBSyxlQUFMLEdBQXVCLEVBQXZCO0FBQ0EsUUFBSSxRQUFRLE1BQVosRUFBb0I7QUFDbEIsWUFBSyxlQUFMLEdBQXVCLFFBQVEsTUFBUixDQUFlLElBQWYsQ0FBb0IsVUFBQyxHQUFELEVBQVM7QUFDbEQsWUFBSSxHQUFKLEVBQVM7QUFDUCxnQkFBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLEtBQTFCLENBQWdDLE1BQUssZUFBckMsRUFBc0QsSUFBSSxVQUExRDtBQUNEO0FBQ0YsT0FKc0IsQ0FBdkI7QUFLRCxLQU5ELE1BT0s7QUFDSCxZQUFLLGVBQUwsR0FBdUIsUUFBUSxPQUFSLEVBQXZCO0FBQ0Q7QUFDRCxV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VUFBckIsQ0FBZ0MsVUFBaEMsRUFBNEMsS0FBSyxTQUFMLENBQWUsTUFBM0QsRUFBbUUsS0FBSyxPQUFMLENBQWEsZUFBaEYsQ0FEVDtBQUVBLFdBQUssS0FBTCxDQUFXLFVBQVgsSUFBeUIsSUFBekI7QUFDQSxXQUFLLFVBQUwsQ0FBZ0IsS0FBaEI7QUFDQSxXQUFLLElBQUwsQ0FBVSxXQUFWLEVBQXVCLElBQXZCO0FBQ0EsV0FBSyxlQUFMLEdBQXVCLEtBQUssZUFBTCxDQUNwQixJQURvQixDQUNmO0FBQUEsZUFBTSxLQUFLLElBQUwsQ0FBVSxPQUFLLGVBQWYsRUFBZ0MsT0FBSyxPQUFyQyxFQUE4QyxPQUFLLFVBQW5ELEVBQStELE9BQUssUUFBcEUsRUFBOEUsT0FBSyxLQUFuRixFQUEwRixRQUExRixDQUFOO0FBQUEsT0FEZSxFQUVwQixJQUZvQixDQUVmO0FBQUEsZUFBTSxRQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxPQUFLLFFBQXpDLEVBQW1ELFVBQW5ELENBQU47QUFBQSxPQUZlLEVBR3BCLEtBSG9CLENBR2QsVUFBQyxHQUFEO0FBQUEsZUFBUyxRQUFRLEtBQVIsQ0FBYyx5QkFBeUIsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBVDtBQUFBLE9BSGMsQ0FBdkI7QUFJRDs7OytCQUVVLEcsRUFBSztBQUNkLGNBQVEsR0FBUixDQUFZLHNCQUFaLEVBQW9DLEdBQXBDO0FBQ0EsVUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLEdBQVgsQ0FBWDtBQUNBLFVBQUksSUFBSixFQUFVO0FBQ1IsYUFBSyxNQUFMO0FBQ0EsZUFBTyxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVA7QUFDQSxhQUFLLElBQUwsQ0FBVSxjQUFWLEVBQTBCLElBQTFCO0FBQ0Q7QUFDRjs7OzhCQUVTLFEsRUFBVTtBQUNsQixhQUFPLElBQVAsQ0FBWSxLQUFLLEtBQWpCLEVBQ0csT0FESCxDQUNXLEtBQUssVUFBTCxDQUFnQixJQUFoQixDQUFxQixJQUFyQixDQURYO0FBRUEsYUFBTyxTQUFTLE1BQVQsR0FBa0IsQ0FBekIsRUFBNEI7QUFDMUIsYUFBSyxPQUFMLENBQWEsU0FBUyxLQUFULEVBQWIsRUFBK0IsSUFBL0I7QUFDRDtBQUNELFdBQUssSUFBTCxDQUFVLHdCQUFWO0FBQ0Q7OztnQ0FFVyxHLEVBQUs7QUFDZixjQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLEdBQXBCO0FBQ0Q7OztxQ0FFZ0I7QUFDZixXQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDRDs7OzhCQUVTLEssRUFBTztBQUNmLGNBQVEsR0FBUixDQUFZLFdBQVosRUFBeUIsS0FBekI7QUFDRDs7O21DQUVjLEssRUFBTztBQUNwQixXQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDRDs7OztFQTlJbUIsU0FBUyxvQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvTmV0d29yay9NYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Network.Manager = Manager;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RemoteUser = function () {
  function RemoteUser(userName, modelFactory, nameMaterial) {
    var _this = this;

    _classCallCheck(this, RemoteUser);

    this.time = 0;

    this.userName = userName;
    this.stage = modelFactory.clone();
    this.stage.traverse(function (obj) {
      if (obj.name === "AvatarBelt") {
        textured(obj, Primrose.Random.color());
      } else if (obj.name === "AvatarHead") {
        _this.head = obj;
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

  _createClass(RemoteUser, [{
    key: "peer",
    value: function peer(extraIceServers, peeringSocket, microphone, localUserName, audio, goSecond) {
      var _this2 = this;

      return microphone.then(function (outAudio) {
        _this2.audioChannel = new Primrose.Network.AudioChannel(extraIceServers, peeringSocket, localUserName, _this2.userName, outAudio, goSecond);
        return _this2.audioChannel.ready.then(function () {
          if (!_this2.audioChannel.inAudio) {
            throw new Error("Didn't get an audio channel for " + _this2.userName);
          }
          _this2.audioElement = new Audio();
          Primrose.Output.Audio3D.setAudioStream(_this2.audioChannel.inAudio);
          _this2.audioElement.controls = false;
          _this2.audioElement.autoplay = true;
          _this2.audioElement.crossOrigin = "anonymous";
          document.body.appendChild(_this2.audioElement);

          _this2.audioStream = audio.context.createMediaStreamSource(_this2.audioChannel.inAudio);
          _this2.gain = audio.context.createGain();
          _this2.panner = audio.context.createPanner();

          _this2.audioStream.connect(_this2.gain);
          _this2.gain.connect(_this2.panner);
          _this2.panner.connect(audio.mainVolume);
          _this2.panner.coneInnerAngle = 180;
          _this2.panner.coneOuterAngle = 360;
          _this2.panner.coneOuterGain = 0.1;
          _this2.panner.panningModel = "HRTF";
          _this2.panner.distanceModel = "exponential";
        });
      });
    }
  }, {
    key: "unpeer",
    value: function unpeer() {
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
  }, {
    key: "_updateV",
    value: function _updateV(v, dt, fade) {
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
  }, {
    key: "_predict",
    value: function _predict(v, state, off) {
      v.delta.fromArray(state, off);
      v.delta.toArray(v.arr1);
      v.curr.toArray(v.arr2);
      for (var i = 0; i < v.arr1.length; ++i) {
        v.arr1[i] = (v.arr1[i] - v.arr2[i]) * RemoteUser.NETWORK_DT_INV;
      }
      v.delta.fromArray(v.arr1);
    }
  }, {
    key: "update",
    value: function update(dt) {
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
  }, {
    key: "toString",
    value: function toString(digits) {
      return this.stage.position.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
    }
  }, {
    key: "state",
    set: function set(v) {
      this.time = 0;
      this._predict(this.headPosition, v, 1);
      this._predict(this.stageQuaternion, v, 4);
      this._predict(this.headQuaternion, v, 8);
    }
  }]);

  return RemoteUser;
}();

RemoteUser.FADE_FACTOR = 0.5;
RemoteUser.NETWORK_DT = 0.10;
RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9OZXR3b3JrL1JlbW90ZVVzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxrQkFERTtBQUVSLFFBQU0sWUFGRTtBQUdSLGVBQWEsbUJBSEw7QUFJUixjQUFZLENBQUM7QUFDWCxVQUFNLFVBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sY0FETDtBQUVELFVBQU0sc0JBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlMsRUFRVDtBQUNELFVBQU0sY0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FSUztBQUpKLENBQVo7O0lBa0JNLFU7QUFFSixzQkFBWSxRQUFaLEVBQXNCLFlBQXRCLEVBQW9DLFlBQXBDLEVBQWtEO0FBQUE7O0FBQUE7O0FBQ2hELFNBQUssSUFBTCxHQUFZLENBQVo7O0FBRUEsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsYUFBYSxLQUFiLEVBQWI7QUFDQSxTQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLFVBQUMsR0FBRCxFQUFTO0FBQzNCLFVBQUksSUFBSSxJQUFKLEtBQWEsWUFBakIsRUFBK0I7QUFDN0IsaUJBQVMsR0FBVCxFQUFjLFNBQVMsTUFBVCxDQUFnQixLQUFoQixFQUFkO0FBQ0QsT0FGRCxNQUdLLElBQUksSUFBSSxJQUFKLEtBQWEsWUFBakIsRUFBK0I7QUFDbEMsY0FBSyxJQUFMLEdBQVksR0FBWjtBQUNEO0FBQ0YsS0FQRDs7QUFTQSxTQUFLLFVBQUwsR0FBa0IsU0FBUyxPQUFPLEdBQVAsRUFBWSxRQUFaLENBQVQsRUFBZ0MsWUFBaEMsQ0FBbEI7QUFDQSxRQUFJLFNBQVMsS0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLFdBQXpCLENBQXFDLEdBQWxEO0FBQ0EsU0FBSyxVQUFMLENBQWdCLFFBQWhCLENBQXlCLEdBQXpCLENB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QStELEtBQUssR0FBTCxDQUFTLEtBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsQ0FBN0IsQ0FBL0Q7QUFDRDtBQUNGOzs7NkJBb0JRLE0sRUFBUTtBQUNmLGFBQU8sS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixJQUFwQixDQUF5QixRQUF6QixDQUFrQyxNQUFsQyxJQUE0QyxHQUE1QyxHQUFrRCxLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsUUFBdkIsQ0FBZ0MsTUFBaEMsQ0FBekQ7QUFDRDs7O3NCQXBCUyxDLEVBQUc7QUFDWCxZQUFNLFFBQU4sQ0FBZTtBQUNiLGdCQUFRLGtCQURLO0FBRWIsY0FBTSxPQUZPO0FBR2IscUJBQWEsc0xBSEE7QUFJYixvQkFBWSxDQUFDO0FBQ1gsZ0JBQU0sR0FESztBQUVYLGdCQUFNLE9BRks7QUFHWCx1QkFBYTtBQUhGLFNBQUQ7QUFKQyxPQUFmOztBQVdBLFdBQUssSUFBTCxHQUFZLENBQVo7QUFDQSxXQUFLLFFBQUwsQ0FBYyxLQUFLLFlBQW5CLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDO0FBQ0EsV0FBSyxRQUFMLENBQWMsS0FBSyxlQUFuQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QztBQUNBLFdBQUssUUFBTCxDQUFjLEtBQUssY0FBbkIsRUFBbUMsQ0FBbkMsRUFBc0MsQ0FBdEM7QUFDRDs7Ozs7O0FBT0gsV0FBVyxXQUFYLEdBQXlCLEdBQXpCO0FBQ0EsV0FBVyxVQUFYLEdBQXdCLElBQXhCO0FBQ0EsV0FBVyxjQUFYLEdBQTRCLElBQUksV0FBVyxVQUEzQyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvTmV0d29yay9SZW1vdGVVc2VyLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Network.RemoteUser = RemoteUser;
})();
(function(){
"use strict";

// polyfill

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Window.prototype.AudioContext = Window.prototype.AudioContext || Window.prototype.webkitAudioContext || function () {};

var Audio3D = function () {
  function Audio3D() {
    var _this = this;

    _classCallCheck(this, Audio3D);

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();

      var vec = new THREE.Vector3(),
          up = new THREE.Vector3(),
          left = new THREE.Matrix4().identity(),
          right = new THREE.Matrix4().identity(),
          swap = null;

      this.setVelocity = this.context.listener.setVelocity.bind(this.context.listener);
      this.setPlayer = function (obj) {
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

        _this.context.listener.setPosition(mx, my, mz);
        vec.set(0, 0, 1);
        vec.applyProjection(right);
        vec.normalize();
        up.set(0, -1, 0);
        up.applyProjection(right);
        up.normalize();
        _this.context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        right.elements[12] = mx;
        right.elements[13] = my;
        right.elements[14] = mz;
      };
      this.isAvailable = true;
      this.start();
    } catch (exp) {
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

  _createClass(Audio3D, [{
    key: "start",
    value: function start() {
      this.mainVolume.connect(this.context.destination);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.mainVolume.disconnect();
    }
  }, {
    key: "loadURL",
    value: function loadURL(src) {
      var _this2 = this;

      return Primrose.HTTP.getBuffer(src).then(function (data) {
        return new Promise(function (resolve, reject) {
          return _this2.context.decodeAudioData(data, resolve, reject);
        });
      });
    }
  }, {
    key: "loadURLCascadeSrcList",
    value: function loadURLCascadeSrcList(srcs, index) {
      var _this3 = this;

      index = index || 0;
      if (index >= srcs.length) {
        return Promise.reject("Failed to load a file from " + srcs.length + " files.");
      } else {
        return this.loadURL(srcs[index]).catch(function (err) {
          console.error(err);
          return _this3.loadURLCascadeSrcList(srcs, index + 1);
        });
      }
    }
  }, {
    key: "createRawSound",
    value: function createRawSound(pcmData) {
      if (pcmData.length !== 1 && pcmData.length !== 2) {
        throw new Error("Incorrect number of channels. Expected 1 or 2, got " + pcmData.length);
      }

      var frameCount = pcmData[0].length;
      if (pcmData.length > 1 && pcmData[1].length !== frameCount) {
        throw new Error("Second channel is not the same length as the first channel. Expected " + frameCount + ", but was " + pcmData[1].length);
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
  }, {
    key: "createSound",
    value: function createSound(loop, buffer) {
      var snd = {
        volume: this.context.createGain(),
        source: this.context.createBufferSource()
      };
      snd.source.buffer = buffer;
      snd.source.loop = loop;
      snd.source.connect(snd.volume);
      return snd;
    }
  }, {
    key: "create3DMediaStream",
    value: function create3DMediaStream(x, y, z, stream) {
      console.log(stream);
      var element = document.createElement("audio"),
          snd = {
        audio: element,
        source: this.context.createMediaElementSource(element)
      };
      if (isChrome) {
        element.src = URL.createObjectURL(stream);
      } else {
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
  }, {
    key: "create3DSound",
    value: function create3DSound(x, y, z, snd) {
      snd.panner = this.context.createPanner();
      snd.panner.setPosition(x, y, z);
      snd.panner.connect(this.mainVolume);
      snd.volume.connect(snd.panner);
      return snd;
    }
  }, {
    key: "createFixedSound",
    value: function createFixedSound(snd) {
      snd.volume.connect(this.mainVolume);
      return snd;
    }
  }, {
    key: "loadSource",
    value: function loadSource(sources, loop) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        if (!(sources instanceof Array)) {
          sources = [sources];
        }
        var audio = document.createElement("audio");
        audio.autoplay = true;
        audio.loop = loop;
        sources.map(function (src) {
          var source = document.createElement("source");
          source.src = src;
          return source;
        }).forEach(audio.appendChild.bind(audio));
        audio.oncanplay = function () {
          if (_this4.context) {
            audio.oncanplay = null;
            var snd = {
              volume: _this4.context.createGain(),
              source: _this4.context.createMediaElementSource(audio)
            };
            snd.source.connect(snd.volume);
          }
          resolve(snd);
        };
        audio.onerror = reject;
        document.body.appendChild(audio);
      });
    }
  }, {
    key: "load3DSound",
    value: function load3DSound(src, loop, x, y, z) {
      return this.loadSource(src, loop).then(this.create3DSound.bind(this, x, y, z));
    }
  }, {
    key: "loadFixedSound",
    value: function loadFixedSound(src, loop) {
      return this.loadSource(src, loop).then(this.createFixedSound.bind(this));
    }
  }, {
    key: "playBufferImmediate",
    value: function playBufferImmediate(buffer, volume) {
      var _this5 = this;

      var snd = this.createSound(false, buffer);
      snd = this.createFixedSound(snd);
      snd.volume.gain.value = volume;
      snd.source.addEventListener("ended", function (evt) {
        snd.volume.disconnect(_this5.mainVolume);
      });
      snd.source.start(0);
      return snd;
    }
  }], [{
    key: "setAudioStream",
    value: function setAudioStream(stream) {
      var audioElementCount = document.querySelectorAll("audio").length,
          element = Primrose.DOM.cascadeElement("audioStream" + audioElementCount, "audio", HTMLAudioElement, true);
      element.autoplay = true;
      if (isFirefox) {
        element.srcObject = stream;
      } else {
        element.src = URL.createObjectURL(stream);
      }
      element.setAttribute("muted", "");
      return stream;
    }
  }]);

  return Audio3D;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9PdXRwdXQvQXVkaW8zRC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7O0FBQ0EsT0FBTyxTQUFQLENBQWlCLFlBQWpCLEdBQ0UsT0FBTyxTQUFQLENBQWlCLFlBQWpCLElBQ0EsT0FBTyxTQUFQLENBQWlCLGtCQURqQixJQUVBLFlBQVksQ0FBRSxDQUhoQjs7QUFLQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsaUJBREU7QUFFUixRQUFNLFNBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7SUFLTSxPO0FBQ0oscUJBQWM7QUFBQTs7QUFBQTs7QUFFWixRQUFJO0FBQ0YsV0FBSyxPQUFMLEdBQWUsSUFBSSxZQUFKLEVBQWY7QUFDQSxXQUFLLFVBQUwsR0FBa0IsS0FBSyxPQUFMLENBQWEsVUFBL0I7QUFDQSxXQUFLLFVBQUwsR0FBa0IsS0FBSyxPQUFMLENBQWEsVUFBYixFQUFsQjs7QUFFQSxVQUFJLE1BQU0sSUFBSSxNQUFNLE9BQVYsRUFBVjtBQUFBLFVBQ0UsS0FBSyxJQUFJLE1BQU0sT0FBVixFQURQO0FBQUEsVUFFRSxPQUFPLElBQUksTUFBTSxPQUFWLEdBQ04sUUFETSxFQUZUO0FBQUEsVUFJRSxRQUFRLElBQUksTUFBTSxPQUFWLEdBQ1AsUUFETyxFQUpWO0FBQUEsVUFNRSxPQUFPLElBTlQ7O0FBUUEsV0FBSyxXQUFMLEdBQW1CLEtBQUssT0FBTCxDQUFhLFFBQWIsQ0FBc0IsV0FBdEIsQ0FBa0MsSUFBbEMsQ0FBdUMsS0FBSyxPQUFMLENBQWEsUUFBcEQsQ0FBbkI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsVUFBQyxHQUFELEVBQVM7QUFDeEIsWUFBSSxPQUFPLEdBQVg7QUFDQSxhQUFLLFFBQUw7QUFDQSxjQUFNLFFBQU47QUFDQSxlQUFPLFNBQVMsSUFBaEIsRUFBc0I7QUFDcEIsZUFBSyxTQUFMLENBQWUsS0FBSyxNQUFMLENBQVksUUFBM0I7QUFDQSxlQUFLLFFBQUwsQ0FBYyxLQUFkO0FB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QUFDUixzQkFBUSxPQUFLLE9BQUwsQ0FBYSxVQUFiLEVBREE7QUFFUixzQkFBUSxPQUFLLE9BQUwsQ0FBYSx3QkFBYixDQUFzQyxLQUF0QztBQUZBLGFBQVY7QUFJQSxnQkFBSSxNQUFKLENBQVcsT0FBWCxDQUFtQixJQUFJLE1BQXZCO0FBQ0Q7QUFDRCxrQkFBUSxHQUFSO0FBQ0QsU0FWRDtBQVdBLGNBQU0sT0FBTixHQUFnQixNQUFoQjtBQUNBLGlCQUFTLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQTFCO0FBQ0QsT0ExQk0sQ0FBUDtBQTJCRDs7O2dDQUVXLEcsRUFBSyxJLEVBQU0sQyxFQUFHLEMsRUFBRyxDLEVBQUc7QUFDOUIsYUFBTyxLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsRUFBcUIsSUFBckIsRUFDSixJQURJLENBQ0MsS0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQXhCLEVBQThCLENBQTlCLEVBQWlDLENBQWpDLEVBQW9DLENBQXBDLENBREQsQ0FBUDtBQUVEOzs7bUNBRWMsRyxFQUFLLEksRUFBTTtBQUN4QixhQUFPLEtBQUssVUFBTCxDQUFnQixHQUFoQixFQUFxQixJQUFyQixFQUNKLElBREksQ0FDQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLElBQTNCLENBREQsQ0FBUDtBQUVEOzs7d0NBRW1CLE0sRUFBUSxNLEVBQVE7QUFBQTs7QUFDbEMsVUFBSSxNQUFNLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixNQUF4QixDQUFWO0FBQ0EsWUFBTSxLQUFLLGdCQUFMLENBQXNCLEdBQXRCLENBQU47QUFDQSxVQUFJLE1BQUosQ0FBVyxJQUFYLENBQWdCLEtBQWhCLEdBQXdCLE1BQXhCO0FBQ0EsVUFBSSxNQUFKLENBQVcsZ0JBQVgsQ0FBNEIsT0FBNUIsRUFBcUMsVUFBQyxHQUFELEVBQVM7QUFDNUMsWUFBSSxNQUFKLENBQVcsVUFBWCxDQUFzQixPQUFLLFVBQTNCO0FBQ0QsT0FGRDtBQUdBLFVBQUksTUFBSixDQUFXLEtBQVgsQ0FBaUIsQ0FBakI7QUFDQSxhQUFPLEdBQVA7QUFDRDs7O21DQXpOcUIsTSxFQUFRO0FBQzVCLFVBQU0sb0JBQW9CLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFDdkIsTUFESDtBQUFBLFVBRUUsVUFBVSxTQUFTLEdBQVQsQ0FBYSxjQUFiLENBQTRCLGdCQUFnQixpQkFBNUMsRUFBK0QsT0FBL0QsRUFBd0UsZ0JBQXhFLEVBQTBGLElBQTFGLENBRlo7QUFHQSxjQUFRLFFBQVIsR0FBbUIsSUFBbkI7QUFDQSxVQUFJLFNBQUosRUFBZTtBQUNiLGdCQUFRLFNBQVIsR0FBb0IsTUFBcEI7QUFDRCxPQUZELE1BR0s7QUFDSCxnQkFBUSxHQUFSLEdBQWMsSUFBSSxlQUFKLENBQW9CLE1BQXBCLENBQWQ7QUFDRDtBQUNELGNBQVEsWUFBUixDQUFxQixPQUFyQixFQUE4QixFQUE5QjtBQUNBLGFBQU8sTUFBUDtBQUNEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9PdXRwdXQvQXVkaW8zRC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Output.Audio3D = Audio3D;
})();
(function(){
"use strict";

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

  var tipNames = ["tipPosition", "dipPosition", "pipPosition", "mcpPosition", "carpPosition"];

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
    } else {
      fingerState = fingerState & ~mask & 0x1f;
    }
    if (connected) {
      socket.emit("data", fingerState);
    }
  };
}

HapticGlove.DEFAULT_PORT = 8383;
HapticGlove.DEFAULT_HOST = document.location.hostname;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9PdXRwdXQvSGFwdGljR2xvdmUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGlCQURFO0FBRVIsUUFBTSxhQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0FBTUEsU0FBUyxXQUFULENBQXFCLE9BQXJCLEVBQThCOztBQUU1QixVQUFRLElBQVIsR0FBZSxRQUFRLElBQVIsSUFBZ0IsWUFBWSxZQUEzQztBQUNBLFVBQVEsSUFBUixHQUFlLFFBQVEsSUFBUixJQUFnQixZQUFZLFlBQTNDO0FBQ0EsT0FBSyxJQUFMLEdBQVksRUFBWjtBQUNBLE9BQUssU0FBTCxHQUFpQixRQUFRLEtBQVIsR0FBZ0IsUUFBUSxPQUF4QixHQUFrQyxRQUFRLE1BQTNEOztBQUVBLE1BQUksVUFBVSxLQUFkO0FBQUEsTUFDRSxZQUFZLEtBRGQ7O0FBR0EsT0FBSyxJQUFMOztBQUVBLE9BQUssY0FBTCxHQUFzQixVQUFVLElBQVYsRUFBZ0I7QUFDcEMsWUFBUSxLQUFSLEdBQWdCLEtBQUssS0FBckI7QUFDQSxZQUFRLEtBQVIsR0FBZ0IsS0FBSyxLQUFyQjtBQUNBLFlBQVEsTUFBUixHQUFpQixLQUFLLE1BQXRCOztBQUVBLFNBQUssY0FBTCxDQUFvQixFQUFwQixDQUF1QixPQUF2QixFQUFnQyxVQUFVLElBQVYsQ0FBZSxJQUFmLENBQWhDO0FBRUQsR0FQRDs7QUFTQSxNQUFJLFdBQVcsQ0FDYixhQURhLEVBRWIsYUFGYSxFQUdiLGFBSGEsRUFJYixhQUphLEVBS2IsY0FMYSxDQUFmOztBQVFBLFdBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQjtBQUN4QixRQUFJLE1BQU0sS0FBVixFQUFpQjtBQUNmLGdCQUFVLE1BQU0sS0FBTixDQUFZLE1BQVosR0FBcUIsQ0FBL0I7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxLQUFaLElBQXFCLElBQUksTUFBTSxLQUFOLENBQVksTUFBckQsRUFBNkQsRUFBRSxDQUEvRCxFQUFrRTtBQUNoRSxZQUFJLE9BQU8sTUFBTSxLQUFOLENBQVksQ0FBWixDQUFYO0FBQ0EsYUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsT0FBNUIsRUFBcUMsRUFBRSxDQUF2QyxFQUEwQztBQUN4QyxjQUFJLFNBQVMsS0FBSyxPQUFMLENBQWEsQ0FBYixDQUFiO0FBQ0EsZUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFFBQVEsTUFBNUIsRUFBb0MsRUFBRSxDQUF0QyxFQUF5QztBQUN2QyxnQkFBSSxJQUFJLElBQUksUUFBUSxPQUFaLEdBQXNCLFFBQVEsTUFBOUIsR0FBdUMsSUFBSSxRQUFRLE1BQW5ELEdBQTRELENBQXBFO0FBQ0EsZ0JBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxNQUFsQixFQUEwQjtBQUN4QixrQkFBSSxJQUFJLE9BQU8sU0FBUyxDQUFULENBQVAsQ0FBUjtBQUNBLGtCQUFJLElBQUksS0FBSyxJQUFMLENBQVUsQ0FBVixDQUFSO0FBQ0EsZ0JBQUUsUUFBRixDQUFXLEdBQVgsQ0FBZSxFQUFFLENBQUYsQ0FBZixFQUFxQixFQUFFLENBQUYsQ0FBckIsRUFBMkIsRUFBRSxDQUFGLENBQTNCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNGOztBQUVELE1BQUksTUFBSjtBQUFBLE1BQ0UsY0FBYyxDQURoQjs7QUFHQSxNQUFJLFFBQVEsSUFBUixLQUFpQixFQUFyQixFQUF5QjtBQUN2QixZQUFRLElBQVIsSUFBZ0IsTUFBTSxRQUFRLElBQTlCO0FBQ0Q7O0FBRUQsV0FBUyxHQUFHLE9BQUgsQ0FBVyxRQUFRLElBQW5CLEVBQXlCO0FBQ2hDLGlCQUFhLElBRG1CO0FBRWhDLDBCQUFzQixJQUZVO0FBR2hDLGlDQUE2QjtBQUhHLEdBQXpCLENBQVQ7O0FBTUEsU0FBTyxFQUFQLENBQVUsU0FBVixFQUFxQixZQUFZO0FBQy9CLGdCQUFZLElBQVo7QUFDQSxZQUFRLEdBQVIsQ0FBWSxZQUFaO0FBQ0QsR0FIRDs7QUFLQSxTQUFPLEVBQVAsQ0FBVSxZQUFWLEVBQXdCLFlBQVk7QUFDbEMsZ0JBQVksS0FBWjtBQUNBLFlBQVEsR0FBUixDQUFZLGVBQVo7QUFDRCxHQUhEOztBQUtBLE9BQUssWUFBTCxHQUFvQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsUUFBSSxRQUFRLENBQVo7QUFDQSxTQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLFdBQVcsUUFBUSxDQUFuQixJQUF3QixJQUFJLFNBQVMsTUFBckQsRUFBNkQsRUFBRSxDQUEvRCxFQUFrRTtBQUNoRSxVQUFJLFVBQVUsU0FBUyxDQUFULENBQWQ7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxLQUFaLElBQXFCLFFBQVEsQ0FBN0MsRUFBZ0QsRUFBRSxDQUFsRCxFQUFxRDtBQUNuRCxhQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksUUFBUSxPQUE1QixFQUFxQyxFQUFFLENBQXZDLEVBQTBDO0FBQ3hDLGNBQUksSUFBSSxLQUFLLElBQUwsQ0FBVSxDQUFWLENBQVI7QUFDQSxjQUFJLFFBQVEsS0FBWjtBQUNBLGNBQUksUUFBUSxFQUFSLEtBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsZ0JBQUksUUFBUSxFQUFSLENBQVcsUUFBWCxJQUF1QixRQUFRLEVBQVIsQ0FBVyxRQUFYLENBQW9CLE9BQS9DLEVBQXdEO0FBQ3RELG1CQUFLLGNBQUwsQ0FBb0IsQ0FBcEIsRUFBdUIsSUFBdkI7QUFDQSxzQkFBUSxJQUFSO0FBQ0EsZ0JBQUUsS0FBRjtBQUNEO0FBQ0Y7QUFDRCxjQUFJLENBQUMsS0FBTCxFQUFZO0FBQ1YsaUJBQUssY0FBTCxDQUFvQixDQUFwQixFQUF1QixLQUF2QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0YsR0FyQkQ7O0FBdUJBLE9BQUssY0FBTCxHQUFzQixVQUFVLENBQVYsRUFBYSxLQUFiLEVBQW9CO0FBQ3hDLFFBQUksT0FBTyxPQUFPLENBQWxCO0FBQ0EsUUFBSSxLQUFKLEVBQVc7QUFDVCxvQkFBYyxjQUFjLElBQTVCO0FBQ0QsS0FGRCxNQUdLO0FBQ0gsb0JBQWMsY0FBYyxDQUFDLElBQWYsR0FBc0IsSUFBcEM7QUFDRDtBQUNELFFBQUksU0FBSixFQUFlO0FBQ2IsYUFBTyxJQUFQLENBQVksTUFBWixFQUFvQixXQUFwQjtBQUNEO0FBQ0YsR0FYRDtBQVlEOztBQUVELFlBQVksWUFBWixHQUEyQixJQUEzQjtBQUNBLFlBQVksWUFBWixHQUEyQixTQUFTLFFBQVQsQ0FBa0IsUUFBN0MiLCJmaWxlIjoic3JjL1ByaW1yb3NlL091dHB1dC9IYXB0aWNHbG92ZS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Output.HapticGlove = HapticGlove;
})();
(function(){
"use strict";

/* polyfill */

Window.prototype.AudioContext = Window.prototype.AudioContext || Window.prototype.webkitAudioContext || function () {};

var PIANO_BASE = Math.pow(2, 1 / 12),
    MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1;

function piano(n) {
  return 440 * Math.pow(PIANO_BASE, n - 49);
}

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
  } else {
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
    o.timeout = setTimeout(function (n, o) {
      this.noteOff(n);
      o.timeout = null;
    }.bind(this, n, o), duration * 1000);
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9PdXRwdXQvTXVzaWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7O0FBQ0EsT0FBTyxTQUFQLENBQWlCLFlBQWpCLEdBQ0UsT0FBTyxTQUFQLENBQWlCLFlBQWpCLElBQ0EsT0FBTyxTQUFQLENBQWlCLGtCQURqQixJQUVBLFlBQVksQ0FBRSxDQUhoQjs7QUFLQSxJQUFJLGFBQWEsS0FBSyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksRUFBaEIsQ0FBakI7QUFBQSxJQUNFLGlCQUFpQixDQUFDLFVBQVUsY0FBVixJQUE0QixFQUE3QixJQUFtQyxDQUR0RDs7QUFHQSxTQUFTLEtBQVQsQ0FBZSxDQUFmLEVBQWtCO0FBQ2hCLFNBQU8sTUFBTSxLQUFLLEdBQUwsQ0FBUyxVQUFULEVBQXFCLElBQUksRUFBekIsQ0FBYjtBQUNEOztBQUVELE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxpQkFERTtBQUVSLFFBQU0sT0FGRTtBQUdSLGVBQWE7QUFITCxDQUFaOztBQU1BLFNBQVMsS0FBVCxDQUFlLE9BQWYsRUFBd0IsSUFBeEIsRUFBOEIsUUFBOUIsRUFBd0M7QUFDdEMsT0FBSyxLQUFMLEdBQWEsV0FBVyxJQUFJLFlBQUosRUFBeEI7QUFDQSxNQUFJLEtBQUssS0FBTCxJQUFjLEtBQUssS0FBTCxDQUFXLFVBQTdCLEVBQXlDO0FBQ3ZDLFFBQUksYUFBYSxTQUFqQixFQUE0QjtBQUMxQixpQkFBVyxjQUFYO0FBQ0Q7QUFDRCxRQUFJLFNBQVMsU0FBYixFQUF3QjtBQUN0QixhQUFPLFVBQVA7QUFDRDtBQUNELFNBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBLFNBQUssVUFBTCxHQUFrQixLQUFLLEtBQUwsQ0FBVyxVQUFYLEVBQWxCO0FBQ0EsU0FBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLEtBQUssS0FBTCxDQUFXLFdBQW5DO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEVBQW5COztBQUVBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFFBQXpCLEVBQW1DLEVBQUUsQ0FBckMsRUFBd0M7QUFDdEMsVUFBSSxJQUFJLEtBQUssS0FBTCxDQUFXLGdCQUFYLEVBQVI7QUFBQSxVQUNFLElBQUksS0FBSyxLQUFMLENBQVcsVUFBWCxFQUROO0FBRUEsUUFBRSxJQUFGLEdBQVMsSUFBVDtBQUNBLFFBQUUsU0FBRixDQUFZLEtBQVosR0FBb0IsQ0FBcEI7QUFDQSxRQUFFLE9BQUYsQ0FBVSxDQUFWO0FBQ0EsUUFBRSxLQUFGO0FBQ0EsUUFBRSxPQUFGLENBQVUsS0FBSyxVQUFmO0FBQ0EsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCO0FBQ3BCLGFBQUssQ0FEZTtBQUVwQixZQUFJLENBRmdCO0FBR3BCLGlCQUFTO0FBSFcsT0FBdEI7QUFLRDtBQUNGLEdBM0JELE1BNEJLO0FBQ0gsU0FBSyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0Q7QUFDRjs7QUFFRCxNQUFNLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsVUFBVSxNQUFWLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCO0FBQy9DLE1BQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLFFBQUksTUFBTSxTQUFWLEVBQXFCO0FBQ25CLFVBQUksQ0FBSjtBQUNEO0FBQ0QsUUFBSSxJQUFJLEtBQUssV0FBTCxDQUFpQixJQUFJLEtBQUssUUFBMUIsQ0FBUjtBQUFBLFFBQ0UsSUFBSSxNQUFNLFdBQVcsQ0FBWCxJQUFnQixDQUF0QixDQUROO0FBRUEsTUFBRSxFQUFGLENBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsTUFBbEI7QUFDQSxNQUFFLEdBQUYsQ0FBTSxTQUFOLENBQWdCLGNBQWhCLENBQStCLENBQS9CLEVBQWtDLENBQWxDO0FBQ0EsV0FBTyxDQUFQO0FBQ0Q7QUFDRixDQVhEOztBQWFBLE1BQU0sU0FBTixDQUFnQixPQUFoQixHQUEwQixVQUFVLENBQVYsRUFBYTtBQUNyQyxNQUFJLEtBQUssU0FBVCxFQUFvQjtBQUNsQixRQUFJLE1BQU0sU0FBVixFQUFxQjtBQUNuQixVQUFJLENBQUo7QUFDRDtBQUNELFFBQUksSUFBSSxLQUFLLFdBQUwsQ0FBaUIsSUFBSSxLQUFLLFFBQTFCLENBQVI7QUFDQSxNQUFFLEdBQUYsQ0FBTSxTQUFOLENBQWdCLGNBQWhCLENBQStCLENBQS9CLEVBQWtDLENBQWxDO0FBQ0Q7QUFDRixDQVJEOztBQVVBLE1BQU0sU0FBTixDQUFnQixJQUFoQixHQUF1QixVQUFVLENBQVYsRUFBYSxNQUFiLEVBQXFCLFFBQXJCLEVBQStCLENBQS9CLEVBQWtDO0FBQ3ZELE1BQUksS0FBSyxTQUFULEVBQW9CO0FBQ2xCLFFBQUksT0FBTyxDQUFQLEtBQWEsUUFBakIsRUFBMkI7QUFDekIsVUFBSSxDQUFKO0FBQ0Q7QUFDRCxRQUFJLElBQUksS0FBSyxNQUFMLENBQVksTUFBWixFQUFvQixDQUFwQixFQUF1QixDQUF2QixDQUFSO0FBQ0EsUUFBSSxFQUFFLE9BQU4sRUFBZTtBQUNiLG1CQUFhLEVBQUUsT0FBZjtBQUNBLFFBQUUsT0FBRixHQUFZLElBQVo7QUFDRDtBQUNELE1BQUUsT0FBRixHQUFZLFdBQVksVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNwQyxXQUFLLE9BQUwsQ0FBYSxDQUFiO0FBQ0EsUUFBRSxPQUFGLEdBQVksSUFBWjtBQUNELEtBSG9CLENBSXBCLElBSm9CLENBSWYsSUFKZSxFQUlULENBSlMsRUFJTixDQUpNLENBQVgsRUFJUyxXQUFXLElBSnBCLENBQVo7QUFLRDtBQUNGLENBaEJEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9PdXRwdXQvTXVzaWMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Output.Music = Music;
})();
(function(){
"use strict";

function pickRandomOption(options, key, min, max) {
  if (options[key] === undefined) {
    options[key] = min + (max - min) * Math.random();
  } else {
    options[key] = Math.min(max, Math.max(min, options[key]));
  }
  return options[key];
}

var Speech = null;

try {
  Speech = function Speech(options) {
    options = options || {};
    var voices = speechSynthesis.getVoices().filter(function (v) {
      return v.default || v.localService;
    }.bind(this));

    var voice = voices[Math.floor(pickRandomOption(options, "voice", 0, voices.length))];

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
} catch (exp) {
  console.error(exp);

  // in case of error, return a shim that lets us continue unabated
  Speech = function Speech() {
    this.speak = function () {};
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9PdXRwdXQvU3BlZWNoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLFNBQVMsZ0JBQVQsQ0FBMEIsT0FBMUIsRUFBbUMsR0FBbkMsRUFBd0MsR0FBeEMsRUFBNkMsR0FBN0MsRUFBa0Q7QUFDaEQsTUFBSSxRQUFRLEdBQVIsTUFBaUIsU0FBckIsRUFBZ0M7QUFDOUIsWUFBUSxHQUFSLElBQWUsTUFBTSxDQUFDLE1BQU0sR0FBUCxJQUFjLEtBQUssTUFBTCxFQUFuQztBQUNELEdBRkQsTUFHSztBQUNILFlBQVEsR0FBUixJQUFlLEtBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxLQUFLLEdBQUwsQ0FBUyxHQUFULEVBQWMsUUFBUSxHQUFSLENBQWQsQ0FBZCxDQUFmO0FBQ0Q7QUFDRCxTQUFPLFFBQVEsR0FBUixDQUFQO0FBQ0Q7O0FBRUQsSUFBSSxTQUFTLElBQWI7O0FBRUEsSUFBSTtBQUNGLFFBQU0sS0FBTixDQUFZO0FBQ1YsWUFBUSxpQkFERTtBQUVSLFVBQU0sUUFGRTtBQUdSLGlCQUFhO0FBSEwsR0FBWjtBQUtBLFdBQVMsZ0JBQVUsT0FBVixFQUFtQjtBQUMxQixjQUFVLFdBQVcsRUFBckI7QUFDQSxRQUFJLFNBQVMsZ0JBQWdCLFNBQWhCLEdBQ1YsTUFEVSxDQUNILFVBQVUsQ0FBVixFQUFhO0FBQ25CLGFBQU8sRUFBRSxPQUFGLElBQWEsRUFBRSxZQUF0QjtBQUNELEtBRk8sQ0FFTixJQUZNLENBRUQsSUFGQyxDQURHLENBQWI7O0FBS0EsUUFBSSxRQUFRLE9BQ1YsS0FBSyxLQUFMLENBQVcsaUJBQWlCLE9BQWpCLEVBQTBCLE9BQTFCLEVBQW1DLENBQW5DLEVBQXNDLE9BQU8sTUFBN0MsQ0FBWCxDQURVLENBQVo7O0FBR0EsU0FBSyxLQUFMLEdBQWEsVUFBVSxHQUFWLEVBQWUsUUFBZixFQUF5QjtBQUNwQyxVQUFJLE1BQU0sSUFBSSx3QkFBSixFQUFWO0FBQ0EsVUFBSSxLQUFKLEdBQVksS0FBWjtBQUNBLFVBQUksTUFBSixHQUFhLGlCQUFpQixPQUFqQixFQUEwQixRQUExQixFQUFvQyxDQUFwQyxFQUF1QyxDQUF2QyxDQUFiO0FBQ0EsVUFBSSxJQUFKLEdBQVcsaUJBQWlCLE9BQWpCLEVBQTBCLE1BQTFCLEVBQWtDLEdBQWxDLEVBQXVDLENBQXZDLENBQVg7QUFDQSxVQUFJLEtBQUosR0FBWSxpQkFBaUIsT0FBakIsRUFBMEIsT0FBMUIsRUFBbUMsQ0FBbkMsRUFBc0MsQ0FBdEMsQ0FBWjtBQUNBLFVBQUksSUFBSixHQUFXLEdBQVg7QUFDQSxVQUFJLEtBQUosR0FBWSxRQUFaO0FBQ0Esc0JBQWdCLEtBQWhCLENBQXNCLEdBQXRCO0FBQ0QsS0FURDtBQVVELEdBcEJEO0FBcUJELENBM0JELENBNEJBLE9BQU8sR0FBUCxFQUFZO0FBQ1YsVUFBUSxLQUFSLENBQWMsR0FBZDs7QUFFQTtBQUNBLFFBQU0sS0FBTixDQUFZO0FBQ1YsWUFBUSxpQkFERTtBQUVSLFVBQU0sUUFGRTtBQUdSLGlCQUFhO0FBSEwsR0FBWjtBQUtBLFdBQVMsa0JBQVk7QUFDbkIsU0FBSyxLQUFMLEdBQWEsWUFBWSxDQUFFLENBQTNCO0FBQ0QsR0FGRDtBQUdEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9PdXRwdXQvU3BlZWNoLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Output.Speech = Speech;
})();
(function(){
"use strict";

function ID() {
  return (Math.random() * Math.log(Number.MAX_VALUE)).toString(36).replace(".", "");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vSUQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGlCQURLO0FBRWIsUUFBTSxJQUZPO0FBR2IsZUFBYSxzSEFIQTtBQUliLFdBQVMsUUFKSTtBQUtiLFlBQVUsQ0FBQztBQUNULFVBQU0saUNBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBTEcsQ0FBZjs7QUE4QkEsU0FBUyxFQUFULEdBQWM7QUFDWixTQUFPLENBQUMsS0FBSyxNQUFMLEtBQWdCLEtBQUssR0FBTCxDQUFTLE9BQU8sU0FBaEIsQ0FBakIsRUFDSixRQURJLENBQ0ssRUFETCxFQUVKLE9BRkksQ0FFSSxHQUZKLEVBRVMsRUFGVCxDQUFQO0FBR0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1JhbmRvbS9JRC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Random.ID = ID;
})();
(function(){
"use strict";

function color() {
  var r = Primrose.Random.int(0, 256),
      g = Primrose.Random.int(0, 256),
      b = Primrose.Random.int(0, 256);
  return r << 16 | g << 8 | b;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vY29sb3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGlCQURLO0FBRWIsUUFBTSxPQUZPO0FBR2IsZUFBYSx3REFIQTtBQUliLFdBQVMsUUFKSTtBQUtiLFlBQVUsQ0FBQztBQUNULFVBQU0sMEJBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBTEcsQ0FBZjs7QUE4QkEsU0FBUyxLQUFULEdBQWlCO0FBQ2YsTUFBSSxJQUFJLFNBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFvQixDQUFwQixFQUF1QixHQUF2QixDQUFSO0FBQUEsTUFDRSxJQUFJLFNBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFvQixDQUFwQixFQUF1QixHQUF2QixDQUROO0FBQUEsTUFFRSxJQUFJLFNBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFvQixDQUFwQixFQUF1QixHQUF2QixDQUZOO0FBR0EsU0FBTyxLQUFLLEVBQUwsR0FBVSxLQUFLLENBQWYsR0FBbUIsQ0FBMUI7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvUmFuZG9tL2NvbG9yLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Random.color = color;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsVUFBUSxpQkFESztBQUViLFFBQU0sS0FGTztBQUdiLGVBQWEsbVVBSEE7QUFJYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sS0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxFQVFUO0FBQ0QsVUFBTSxPQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsY0FBVSxJQUhUO0FBSUQsaUJBQWEsK09BSlo7QUFLRCxhQUFTO0FBTFIsR0FSUyxDQUpDO0FBbUJiLFdBQVMsUUFuQkk7QUFvQmIsWUFBVSxDQUFDO0FBQ1QsVUFBTSwyREFERztBQUVULGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQsRUFzQlA7QUFDRCxVQUFNLGtFQURMO0FBRUQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRlosR0F0Qk87QUFwQkcsQ0FBZjs7QUFtRUEsU0FBUyxHQUFULENBQWEsR0FBYixFQUFrQixHQUFsQixFQUF1QixLQUF2QixFQUE4QjtBQUM1QixVQUFRLFNBQVMsQ0FBakI7QUFDQSxNQUFJLFFBQVEsU0FBWixFQUF1QjtBQUNyQixVQUFNLEdBQU47QUFDQSxVQUFNLENBQU47QUFDRDtBQUNELE1BQUksUUFBUSxNQUFNLEdBQWxCO0FBQUEsTUFDRSxJQUFJLEtBQUssR0FBTCxDQUFTLEtBQUssTUFBTCxFQUFULEVBQXdCLEtBQXhCLENBRE47QUFFQSxTQUFPLEtBQUssS0FBTCxDQUFXLE1BQU0sSUFBSSxLQUFyQixDQUFQO0FBQ0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1JhbmRvbS9pbnQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Random.int = int;
})();
(function(){
"use strict";

function item(arr) {
  return arr[Primrose.Random.int(arr.length)];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vaXRlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQSxNQUFNLFFBQU4sQ0FBZTtBQUNiLFVBQVEsaUJBREs7QUFFYixRQUFNLE1BRk87QUFHYixlQUFhLHlDQUhBO0FBSWIsY0FBWSxDQUFDO0FBQ1gsVUFBTSxLQURLO0FBRVgsVUFBTSxPQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELENBSkM7QUFTYixXQUFTLEtBVEk7QUFVYixZQUFVLENBQUM7QUFDVCxVQUFNLHdDQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFWRyxDQUFmOztBQTBDQSxTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CO0FBQ2pCLFNBQU8sSUFBSSxTQUFTLE1BQVQsQ0FBZ0IsR0FBaEIsQ0FBb0IsSUFBSSxNQUF4QixDQUFKLENBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvUmFuZG9tL2l0ZW0uanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Random.item = item;
})();
(function(){
"use strict";

function number(min, max) {
  return Math.random() * (max - min) + min;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vbnVtYmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sUUFBTixDQUFlO0FBQ2IsVUFBUSxpQkFESztBQUViLFFBQU0sUUFGTztBQUdiLGVBQWEsNFBBSEE7QUFJYixjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sS0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxDQUpDO0FBYWIsV0FBUyxRQWJJO0FBY2IsWUFBVSxDQUFDO0FBQ1QsVUFBTSxnREFERztBQUVULGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZKLEdBQUQ7QUFkRyxDQUFmOztBQXVDQSxTQUFTLE1BQVQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMEI7QUFDeEIsU0FBTyxLQUFLLE1BQUwsTUFBaUIsTUFBTSxHQUF2QixJQUE4QixHQUFyQztBQUNEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9SYW5kb20vbnVtYmVyLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Random.number = number;
})();
(function(){
"use strict";

function steps(min, max, steps) {
  return min + Primrose.Random.int(0, (1 + max - min) / steps) * steps;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9SYW5kb20vc3RlcHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxRQUFOLENBQWU7QUFDYixVQUFRLGlCQURLO0FBRWIsUUFBTSxPQUZPO0FBR2IsZUFBYSxzV0FIQTtBQUliLGNBQVksQ0FBQztBQUNYLFVBQU0sS0FESztBQUVYLFVBQU0sUUFGSztBQUdYLGlCQUFhO0FBSEYsR0FBRCxFQUlUO0FBQ0QsVUFBTSxLQURMO0FBRUQsVUFBTSxRQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTLEVBUVQ7QUFDRCxVQUFNLE9BREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBUlMsQ0FKQztBQWlCYixXQUFTLFFBakJJO0FBa0JiLFlBQVUsQ0FBQztBQUNULFVBQU0sZ0NBREc7QUFFVCxpQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixHQUFEO0FBbEJHLENBQWY7O0FBMkNBLFNBQVMsS0FBVCxDQUFlLEdBQWYsRUFBb0IsR0FBcEIsRUFBeUIsS0FBekIsRUFBZ0M7QUFDOUIsU0FBTyxNQUFNLFNBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFvQixDQUFwQixFQUF1QixDQUFDLElBQUksR0FBSixHQUFVLEdBQVgsSUFBa0IsS0FBekMsSUFBa0QsS0FBL0Q7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvUmFuZG9tL3N0ZXBzLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Random.steps = steps;
})();
(function(){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
    if ((typeof codes === "undefined" ? "undefined" : _typeof(codes)) === "object") {
      for (code in codes) {
        if (code.indexOf("_") > -1) {
          var parts = code.split(' '),
              browser = parts[0];
          code = parts[1];
          char = commands.NORMAL[code];
          cmdName = browser + "_" + type + " " + char;
        } else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLFVBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLFFBQVQsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEIsRUFBOEIsT0FBOUIsRUFBdUM7QUFDckMsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssUUFBTCxHQUFnQixJQUFoQjs7QUFFQSxNQUFJLFdBQVc7QUFDYixZQUFRO0FBQ04sWUFBTSxHQURBO0FBRU4sWUFBTSxHQUZBO0FBR04sWUFBTSxHQUhBO0FBSU4sWUFBTSxHQUpBO0FBS04sWUFBTSxHQUxBO0FBTU4sWUFBTSxHQU5BO0FBT04sWUFBTSxHQVBBO0FBUU4sWUFBTSxHQVJBO0FBU04sWUFBTSxHQVRBO0FBVU4sWUFBTSxHQVZBO0FBV04sWUFBTSxHQVhBO0FBWU4sWUFBTSxHQVpBO0FBYU4sWUFBTSxHQWJBO0FBY04sWUFBTSxHQWRBO0FBZU4sWUFBTSxHQWZBO0FBZ0JOLFlBQU0sR0FoQkE7QUFpQk4sWUFBTSxHQWpCQTtBQWtCTixZQUFNLEdBbEJBO0FBbUJOLFlBQU0sR0FuQkE7QUFvQk4sWUFBTSxHQXBCQTtBQXFCTixZQUFNLEdBckJBO0FBc0JOLFlBQU0sR0F0QkE7QUF1Qk4sWUFBTSxHQXZCQTtBQXdCTixZQUFNLEdBeEJBO0FBeUJOLFlBQU0sR0F6QkE7QUEwQk4sWUFBTTtBQTFCQSxLQURLO0FBNkJiLFdBQU87QUFDTCxZQUFNLEdBREQ7QUFFTCxZQUFNLEdBRkQ7QUFHTCxZQUFNLEdBSEQ7QUFJTCxZQUFNLEdBSkQ7QUFLTCxZQUFNLEdBTEQ7QUFNTCxZQUFNLEdBTkQ7QUFPTCxZQUFNLEdBUEQ7QUFRTCxZQUFNLEdBUkQ7QUFTTCxZQUFNLEdBVEQ7QUFVTCxZQUFNLEdBVkQ7QUFXTCxZQUFNLEdBWEQ7QUFZTCxZQUFNLEdBWkQ7QUFhTCxZQUFNLEdBYkQ7QUFjTCxZQUFNLEdBZEQ7QUFlTCxZQUFNLEdBZkQ7QUFnQkwsWUFBTSxHQWhCRDtBQWlCTCxZQUFNLEdBakJEO0FBa0JMLFlBQU0sR0FsQkQ7QUFtQkwsWUFBTSxHQW5CRDtBQW9CTCxZQUFNLEdBcEJEO0FBcUJMLFlBQU0sR0FyQkQ7QUFzQkwsWUFBTSxHQXRCRDtBQXVCTCxZQUFNLEdBdkJEO0FBd0JMLFlBQU0sR0F4QkQ7QUF5QkwsWUFBTSxHQXpCRDtBQTBCTCxZQUFNO0FBMUJEO0FBN0JNLEdBQWY7O0FBMkRBLGFBQVcsUUFBWCxFQUFxQixPQUFyQjs7QUFFQSxNQUFJLElBQUosRUFBVSxJQUFWLEVBQWdCLE9BQWhCO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixLQUFLLENBQXJCLEVBQXdCLEVBQUUsQ0FBMUIsRUFBNkI7QUFDM0IsV0FBTyxTQUFTLElBQVQsQ0FBYyxXQUFXLENBQXpCLENBQVA7QUFDQSxhQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsSUFBd0IsRUFBRSxRQUFGLEVBQXhCO0FBQ0Q7O0FBRUQsV0FBUyxNQUFULENBQWdCLFNBQVMsSUFBVCxDQUFjLFFBQTlCLElBQTBDLEdBQTFDO0FBQ0EsV0FBUyxNQUFULENBQWdCLFNBQVMsSUFBVCxDQUFjLEdBQTlCLElBQXFDLEdBQXJDO0FBQ0EsV0FBUyxNQUFULENBQWdCLFNBQVMsSUFBVCxDQUFjLFFBQTlCLElBQTBDLEdBQTFDO0FBQ0EsV0FBUyxNQUFULENBQWdCLFNBQVMsSUFBVCxDQUFjLFlBQTlCLElBQThDLEdBQTlDO0FBQ0EsV0FBUyxNQUFULENBQWdCLFNBQVMsSUFBVCxDQUFjLE1BQTlCLElBQXdDLEdBQXhDOztBQUVBLE9BQUssUUFBTCxHQUFnQixFQUFoQjtBQUNBLE9BQUssWUFBTCxHQUFvQixFQUFwQjtBQUNBLE9BQUssSUFBTCxJQUFhLFNBQVMsSUFBdEIsRUFBNEI7QUFDMUIsV0FBTyxTQUFTLElBQVQsQ0FBYyxJQUFkLENBQVA7QUFDQSxRQUFJLENBQUMsTUFBTSxJQUFOLENBQUwsRUFBa0I7QUFDaEIsV0FBSyxRQUFMLENBQWMsSUFBZCxJQUFzQixJQUF0QjtBQUNEO0FBQ0Y7O0FBRUQsV0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQTRCLElBQTVCLEVBQWtDLEtBQWxDLEVBQXlDO0FBQ3ZDLFNBQUssWUFBTCxHQUFvQixHQUFwQjtBQUNEOztBQUVELE9BQUssSUFBSSxJQUFULElBQWlCLFFBQWpCLEVBQTJCO0FBQ3pCLFFBQUksUUFBUSxTQUFTLElBQVQsQ0FBWjtBQUNBLFFBQUksUUFBUSxLQUFSLHlDQUFRLEtBQVIsT0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsV0FBSyxJQUFMLElBQWEsS0FBYixFQUFvQjtBQUNsQixZQUFJLEtBQUssT0FBTCxDQUFhLEdBQWIsSUFBb0IsQ0FBQyxDQUF6QixFQUE0QjtBQUMxQixjQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFaO0FBQUEsY0FDRSxVQUFVLE1BQU0sQ0FBTixDQURaO0FBRUEsaUJBQU8sTUFBTSxDQUFOLENBQVA7QUFDQSxpQkFBTyxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsQ0FBUDtBQUNBLG9CQUFVLFVBQVUsR0FBVixHQUFnQixJQUFoQixHQUF1QixHQUF2QixHQUE2QixJQUF2QztBQUNELFNBTkQsTUFPSztBQUNILGlCQUFPLFNBQVMsTUFBVCxDQUFnQixJQUFoQixDQUFQO0FBQ0Esb0JBQVUsT0FBTyxHQUFQLEdBQWEsSUFBdkI7QUFDRDtBQUNELGFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixPQUF2QjtBQUNBLGFBQUssUUFBTCxDQUFjLElBQWQsSUFBc0IsSUFBdEI7QUFDQSxZQUFJLE9BQU8sTUFBTSxJQUFOLENBQVg7QUFDQSxZQUFJLE9BQU8sSUFBUCxLQUFnQixVQUFwQixFQUFnQztBQUM5QixpQkFBTyxjQUFjLElBQWQsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsQ0FBUDtBQUNEO0FBQ0QsYUFBSyxPQUFMLElBQWdCLElBQWhCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQsU0FBUyxJQUFULEdBQWdCLFVBQVUsR0FBVixFQUFlO0FBQzdCLFNBQU8sVUFBVSxJQUFWLEVBQWdCO0FBQ3JCLFNBQUssZUFBTCxDQUFxQixTQUFTLEdBQTlCO0FBQ0QsR0FGRDtBQUdELENBSkQiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29kZVBhZ2UuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.CodePage = CodePage;
})();
(function(){
"use strict";

var CodePages = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxVQUFRLGVBRE07QUFFZCxRQUFNLFdBRlE7QUFHZCxlQUFhO0FBSEMsQ0FBaEI7QUFLQSxJQUFNLFlBQVksRUFBbEIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29kZVBhZ2VzLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.CodePages = CodePages;
})();
(function(){
"use strict";

function CommandPack(name, commands) {
  this.name = name;
  copyObject(this, commands);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxlQURFO0FBRVIsUUFBTSxhQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0FBTUEsU0FBUyxXQUFULENBQXFCLElBQXJCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQ25DLE9BQUssSUFBTCxHQUFZLElBQVo7QUFDQSxhQUFXLElBQVgsRUFBaUIsUUFBakI7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db21tYW5kUGFjay5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.CommandPack = CommandPack;
})();
(function(){
"use strict";

var CommandPacks = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxVQUFRLGVBRE07QUFFZCxRQUFNLGNBRlE7QUFHZCxlQUFhO0FBSEMsQ0FBaEI7QUFLQSxJQUFNLGVBQWUsRUFBckIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29tbWFuZFBhY2tzLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.CommandPacks = CommandPacks;
})();
(function(){
"use strict";

var Controls = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsZUFETTtBQUVkLFFBQU0sVUFGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sV0FBVyxFQUFqQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db250cm9scy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Controls = Controls;
})();
(function(){
"use strict";

// unicode-aware string reverse

var reverse = function () {
  var combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
      surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

  function reverse(str) {
    str = str.replace(combiningMarks, function (match, capture1, capture2) {
      return reverse(capture2) + capture1;
    }).replace(surrogatePair, "$2$1");
    var res = "";
    for (var i = str.length - 1; i >= 0; --i) {
      res += str[i];
    }
    return res;
  }
  return reverse;
}();

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
  } else {
    var x = this.x - 1;
    var line = lines[this.y];
    var word = reverse(line.substring(0, x));
    var m = word.match(/(\s|\W)+/);
    var dx = m ? m.index + m[0].length + 1 : word.length;
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
  } else {
    var x = this.x + 1;
    line = line.substring(x);
    var m = line.match(/(\s|\W)+/);
    var dx = m ? m.index + m[0].length + 1 : line.length - this.x;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0N1cnNvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7QUFDQSxJQUFJLFVBQVcsWUFBWTtBQUN6QixNQUFJLGlCQUNGLDJEQURGO0FBQUEsTUFFRSxnQkFBZ0IsZ0RBRmxCOztBQUlBLFdBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQjtBQUNwQixVQUFNLElBQUksT0FBSixDQUFZLGNBQVosRUFBNEIsVUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQzlCLFFBRDhCLEVBQ3BCO0FBQ1YsYUFBTyxRQUFRLFFBQVIsSUFBb0IsUUFBM0I7QUFDRCxLQUhHLEVBSUgsT0FKRyxDQUlLLGFBSkwsRUFJb0IsTUFKcEIsQ0FBTjtBQUtBLFFBQUksTUFBTSxFQUFWO0FBQ0EsU0FBSyxJQUFJLElBQUksSUFBSSxNQUFKLEdBQWEsQ0FBMUIsRUFBNkIsS0FBSyxDQUFsQyxFQUFxQyxFQUFFLENBQXZDLEVBQTBDO0FBQ3hDLGFBQU8sSUFBSSxDQUFKLENBQVA7QUFDRDtBQUNELFdBQU8sR0FBUDtBQUNEO0FBQ0QsU0FBTyxPQUFQO0FBQ0QsQ0FsQmEsRUFBZDs7QUFvQkEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLFFBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLE1BQVQsQ0FBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUI7QUFDdkIsT0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkO0FBQ0EsT0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkO0FBQ0EsT0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFkO0FBQ0EsT0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNEOztBQUVELE9BQU8sR0FBUCxHQUFhLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDM0IsTUFBSSxFQUFFLENBQUYsSUFBTyxFQUFFLENBQWIsRUFBZ0I7QUFDZCxXQUFPLENBQVA7QUFDRDtBQUNELFNBQU8s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LEtBQUssTUFBZCxFQUFzQixDQUF0QixDQUFaLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxLQUFLLENBQWQ7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksS0FBSyxDQUF6QixFQUE0QixFQUFFLENBQTlCLEVBQWlDO0FBQy9CLFNBQUssQ0FBTCxJQUFVLE1BQU0sQ0FBTixFQUFTLE1BQW5CO0FBQ0Q7QUFDRCxPQUFLLGtCQUFMLENBQXdCLEtBQXhCO0FBQ0EsT0FBSyxLQUFMLEdBQWEsSUFBYjtBQUNELENBVkQ7O0FBWUEsT0FBTyxTQUFQLENBQWlCLElBQWpCLEdBQXdCLFVBQVUsQ0FBVixFQUFhLEtBQWIsRUFBb0I7QUFDMUMsT0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNBLE9BQUssU0FBTCxDQUFlLEtBQWY7QUFDQSxPQUFLLEtBQUwsR0FBYSxJQUFiO0FBQ0QsQ0FKRDs7QUFNQSxPQUFPLFNBQVAsQ0FBaUIsa0JBQWpCLEdBQXNDLFVBQVUsS0FBVixFQUFpQjtBQUNyRCxNQUFJLE9BQU8sTUFBTSxLQUFLLENBQVgsQ0FBWDtBQUNBLE1BQUksS0FBSyxDQUFMLEdBQVMsQ0FBVCxJQUFjLEtBQUssS0FBSyxDQUFMLEdBQVMsQ0FBZCxNQUFxQixJQUF2QyxFQUE2QztBQUMzQyxNQUFFLEtBQUssQ0FBUDtBQUNBLE1BQUUsS0FBSyxDQUFQO0FBQ0EsV0FBTyxJQUFQO0FBQ0Q7QUFDRCxTQUFPLEtBQVA7QUFDRCxDQVJEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L0N1cnNvci5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Cursor = Cursor;
})();
(function(){
"use strict";

function Grammar(name, rules) {
  this.name = name;

  // clone the preprocessing grammar to start a new grammar
  this.grammar = rules.map(function (rule) {
    return new Primrose.Text.Rule(rule[0], rule[1]);
  });

  function crudeParsing(tokens) {
    var commentDelim = null,
        stringDelim = null,
        line = 0,
        i,
        t;
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
      } else if (commentDelim) {
        if (commentDelim === "startBlockComments" && t.type === "endBlockComments" || commentDelim === "startLineComments" && t.type === "newlines") {
          commentDelim = null;
        }
        if (t.type !== "newlines") {
          t.type = "comments";
        }
      } else if (t.type === "stringDelim") {
        stringDelim = t.value;
        t.type = "strings";
      } else if (t.type === "startBlockComments" || t.type === "startLineComments") {
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
      } else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLFNBRkU7QUFHUixjQUFZLENBQUM7QUFDWCxVQUFNLE1BREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sT0FETDtBQUVELFVBQU0sT0FGTDtBQUdELGlCQUFhO0FBSFosR0FKUyxDQUhKO0FBWVIsZUFBYTs7OztpRkFaTDtBQWlCUixZQUFVLENBQUM7QUFDVCxVQUFNLDJCQURHO0FBRVQsaUJBQWE7Ozs7Ozs7Ozs7O0FBRkosR0FBRCxFQWFQO0FBQ0QsVUFBTSxxQkFETDtBQUVELGlCQUFhOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUZaLEdBYk87QUFqQkYsQ0FBWjs7QUFtRUEsU0FBUyxPQUFULENBQWlCLElBQWpCLEVBQXVCLEtBQXZCLEVBQThCO0FBQzVCLFFBQU0sUUFBTixDQUFlO0FBQ2IsWUFBUSx1QkFESztBQUViLFVBQU0sT0FGTztBQUdiLFVBQU0sUUFITztBQUliLGlCQUFhO0FBSkEsR0FBZjtBQU1BLE9BQUssSUFBTCxHQUFZLElBQVo7O0FBRUEsUUFBTSxRQUFOLENBQWU7QUFDYixZQUFRLHVCQURLO0FBRWIsVUFBTSxTQUZPO0FBR2IsVUFBTSxPQUhPO0FBSWIsaUJBQWE7QUFKQSxHQUFmO0FBTUE7QUFDQSxPQUFLLE9BQUwsR0FBZSxNQUFNLEdBQU4sQ0FBVSxVQUFVLElBQVYsRUFBZ0I7QUFDdkMsV0FBTyxJQUFJLFNBQVMsSUFBVCxDQUFjLElBQWxCLENBQXVCLEtBQUssQ0FBTCxDQUF2QixFQUFnQyxLQUFLLENBQUwsQ0FBaEMsQ0FBUDtBQUNELEdBRmMsQ0FBZjs7QUFJQSxXQUFTLFlBQVQsQ0FBc0IsTUFBdEIsRUFBOEI7QUFDNUIsUUFBSSxlQUFlLElBQW5CO0FBQUEsUUFDRSxjQUFjLElBRGhCO0FBQUEsUUFFRSxPQUFPLENBRlQ7QUFBQSxRQUdFLENBSEY7QUFBQSxRQUdLLENBSEw7QUFJQSxTQUFLLElBQUksQ0FBVCxFQUFZLElBQUksT0FBTyxNQUF2QixFQUErQixFQUFFLENBQWpDLEVBQW9DO0FBQ2xDLFVBQUksT0FBTyxDQUFQLENBQUo7QUFDQSxRQUFFLElBQUYsR0FBUyxJQUFUO0FBQ0EsVUFBSSxFQUFFLElBQUYsS0FBVyxVQUFmLEVBQTJCO0FBQ3pCLFVBQUUsSUFBRjtBQUNEOztBQUVELFVBQUksV0FBSixFQUFpQjtBQUNmLFlBQUksRUFBRSxJQUFGLEtBQVcsYUFBWCxJQUE0QixFQUFFLEtBQUYsS0FBWSxXQUF4QyxLQUF3RCxNQUFNLENBQU4sSUFBVyxPQUFPLElBQUksQ0FBWCxFQUFjLEtBQWQsQ0FBb0IsT0FBTyxJQUFJLENBQVgsRUFBYyxLQUFkLENBQW9CLE1BQXBCLEdBQTZCLENBQWpELE1BQXdELElBQTNILENBQUosRUFBc0k7QUFDcEksd0JBQWMsSUFBZDtBQUNEO0FBQ0QsWUFBSSxFQUFFLElBQUYsS0FBVyxVQUFmLEVBQTJCO0FBQ3pCLFlBQUUsSUFBRixHQUFTLFNBQVQ7QUFDRDtBQUNGLE9BUEQsTUFRSyxJQUFJLFlBQUosRUFBa0I7QUFDckIsWUFBSSxpQkFBaUIsb0JBQWpCLElBQXlDLEVBQUUsSUFBRixLQUFXLGtCQUFwRCxJQUNGLGlCQUFpQixtQkFBakIsSUFBd0MsRUFBRSxJQUFGLEtBQVcsVUFEckQsRUFDaUU7QUFDL0QseUJBQWUsSUFBZjtBQUNEO0FBQ0QsWUFBSSxFQUFFLElBQUYsS0FBVyxVQUFmLEVBQTJCO0FBQ3pCLFlBQUUsSUFBRixHQUFTLFVBQVQ7QUFDRDtBQUNGLE9BUkksTUFTQSxJQUFJLEVBQUUsSUFBRixLQUFXLGFBQWYsRUFBOEI7QUFDakMsc0JBQWMsRUFBRSxLQUFoQjtBQUNBLFVBQUUsSUFBRixHQUFTLFNBQVQ7QUFDRCxPQUhJLE1BSUEsSUFBSSxFQUFFLElBQUYsS0FBVyxvQkFBWCxJQUFtQyxFQUFFLElBQUYsS0FBVyxtQkFBbEQsRUFBdUU7QUFDMUUsdUJBQWUsRUFBRSxJQUFqQjtBQUNBLFVBQUUsSUFBRixHQUFTLFVBQVQ7QUFDRDtBQUNGOztBQUVEO0FBQ0EsU0FBSyxJQUFJLE9BQU8sTUFBUCxHQUFnQixDQUF6QixFQUE0QixJQUFJLENBQWhDLEVBQW1DLEVBQUUsQ0FBckMsRUFBd0M7QUFDdEMsVUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFYLENBQVI7QUFDQSxVQUFJLE9BQU8sQ0FBUCxDQUFKO0FBQ0EsVUFBSSxFQUFFLElBQUYsS0FBVyxFQUFFLElBQWIsSUFBcUIsRUFBRSxJQUFGLEtBQVcsVUFBcEMsRUFBZ0Q7QUFDOUMsVUFBRSxLQUFGLElBQVcsRUFBRSxLQUFiO0FBQ0EsZUFBTyxNQUFQLENBQWMsQ0FBZCxFQUFpQixDQUFqQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxVQUFRLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsVUFBVSxHQUFWLEVBQWUsS0FBZixFQUFzQjtBQUMvQyxZQUFRLFNBQVMsU0FBUyxJQUFULENBQWMsTUFBZCxDQUFxQixPQUF0QztBQUNBLFFBQUksWUFBWSxLQUFLLFFBQUwsQ0FBYyxHQUFkLENBQWhCO0FBQUEsUUFDRSxPQUFPLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQURUO0FBRUEsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFVBQVUsTUFBOUIsRUFBc0MsRUFBRSxDQUF4QyxFQUEyQztBQUN6QztBQUNBLFVBQUksSUFBSSxVQUFVLENBQVYsQ0FBUjtBQUNBLFVBQUksRUFBRSxJQUFGLEtBQVcsVUFBZixFQUEyQjtBQUN6QixhQUFLLFdBQUwsQ0FBaUIsU0FBUyxhQUFULENBQXVCLElBQXZCLENBQWpCO0FBQ0QsT0FGRCxNQUdLO0FBQ0gsWUFBSSxRQUFRLE1BQU0sRUFBRSxJQUFSLEtBQWlCLEVBQTdCO0FBQUEsWUFDRSxPQUFPLFNBQVMsYUFBVCxDQUF1QixNQUF2QixDQURUO0FBRUEsYUFBSyxLQUFMLENBQVcsVUFBWCxHQUF3QixNQUFNLFVBQU4sSUFBb0IsTUFBTSxPQUFOLENBQWMsVUFBMUQ7QUFDQSxhQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLE1BQU0sU0FBTixJQUFtQixNQUFNLE9BQU4sQ0FBYyxTQUFqQyxJQUE4QyxFQUFyRTtBQUNBLGFBQUssS0FBTCxDQUFXLEtBQVgsR0FBbUIsTUFBTSxTQUFOLElBQW1CLE1BQU0sT0FBTixDQUFjLFNBQXBEO0FBQ0EsYUFBSyxLQUFMLENBQVcsZUFBWCxHQUE2QixNQUFNLFNBQU4sSUFBbUIsTUFBTSxPQUFOLENBQWMsU0FBOUQ7QUFDQSxhQUFLLEtBQUwsQ0FBVyxVQUFYLEdBQXdCLE1BQU0sVUFBTixJQUFvQixNQUFNLFVBQWxEO0FBQ0EsYUFBSyxXQUFMLENBQWlCLFNBQVMsY0FBVCxDQUF3QixFQUFFLEtBQTFCLENBQWpCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLElBQWpCO0FBQ0Q7QUFDRjtBQUNELFdBQU8sS0FBSyxTQUFaO0FBQ0QsR0F2QkQ7O0FBeUJBLFFBQU0sTUFBTixDQUFhO0FBQ1gsWUFBUSx1QkFERztBQUVYLFVBQU0sVUFGSztBQUdYLGdCQUFZLENBQUM7QUFDWCxZQUFNLE1BREs7QUFFWCxZQUFNLFFBRks7QUFHWCxtQkFBYTtBQUhGLEtBQUQsQ0FIRDtBQVFYLGFBQVMsc0pBUkU7QUFTWCxpQkFBYSxtRkFURjtBQVVYLGNBQVUsQ0FBQztBQUNULFlBQU0sMEJBREc7QUFFVCxtQkFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFGSixLQUFEO0FBVkMsR0FBYjtBQTJDQSxPQUFLLFFBQUwsR0FBZ0IsVUFBVSxJQUFWLEVBQWdCO0FBQzlCO0FBQ0E7QUFDQSxRQUFJLFNBQVMsQ0FBQyxJQUFJLFNBQVMsSUFBVCxDQUFjLEtBQWxCLENBQXdCLElBQXhCLEVBQThCLFNBQTlCLEVBQXlDLENBQXpDLENBQUQsQ0FBYjtBQUNBLFNBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLE9BQUwsQ0FBYSxNQUFqQyxFQUF5QyxFQUFFLENBQTNDLEVBQThDO0FBQzVDLFVBQUksT0FBTyxLQUFLLE9BQUwsQ0FBYSxDQUFiLENBQVg7QUFDQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksT0FBTyxNQUEzQixFQUFtQyxFQUFFLENBQXJDLEVBQXdDO0FBQ3RDLGFBQUssb0JBQUwsQ0FBMEIsTUFBMUIsRUFBa0MsQ0FBbEM7QUFDRDtBQUNGOztBQUVELGlCQUFhLE1BQWI7QUFDQSxXQUFPLE1BQVA7QUFDRCxHQWJEO0FBY0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvR3JhbW1hci5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Grammar = Grammar;
})();
(function(){
"use strict";

var Grammars = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sU0FBTixDQUFnQjtBQUNkLFVBQVEsZUFETTtBQUVkLFFBQU0sVUFGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sV0FBVyxFQUFqQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Grammars = Grammars;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var OperatingSystem = function () {
  function OperatingSystem(name, pre1, pre2, redo, pre3, home, end, pre5, fullHome, fullEnd) {
    _classCallCheck(this, OperatingSystem);

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

  _createClass(OperatingSystem, [{
    key: "makeCommandName",
    value: function makeCommandName(evt, codePage) {
      var key = evt.keyCode;
      if (key !== Primrose.Keys.CTRL && key !== Primrose.Keys.ALT && key !== Primrose.Keys.META_L && key !== Primrose.Keys.META_R && key !== Primrose.Keys.SHIFT) {

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
  }]);

  return OperatingSystem;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsU0FBUyxnQkFBVCxDQUEwQixHQUExQixFQUErQixHQUEvQixFQUFvQyxHQUFwQyxFQUF5QyxJQUF6QyxFQUErQyxHQUEvQyxFQUFvRDtBQUNsRCxNQUFJLE9BQU8sTUFBTSxHQUFOLEdBQVksR0FBdkI7QUFDQSxNQUFJLElBQUosSUFBWSxVQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDckMsU0FBSyxXQUFXLElBQWhCLEVBQXNCLFNBQXRCLEVBQWlDLEtBQUssTUFBTSxRQUFYLENBQWpDO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVMsaUJBQVQsQ0FBMkIsR0FBM0IsRUFBZ0MsT0FBaEMsRUFBeUMsR0FBekMsRUFBOEMsSUFBOUMsRUFBb0Q7QUFDbEQsbUJBQWlCLEdBQWpCLEVBQXNCLFdBQVcsUUFBakMsRUFBMkMsR0FBM0MsRUFBZ0QsSUFBaEQsRUFBc0QsT0FBdEQ7QUFDQSxtQkFBaUIsR0FBakIsRUFBc0IsVUFBVSxPQUFoQyxFQUF5QyxHQUF6QyxFQUE4QyxJQUE5QyxFQUFvRCxNQUFwRDtBQUNEOztBQUVELE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxlQURFO0FBRVIsUUFBTSxpQkFGRTtBQUdSLGVBQWE7QUFITCxDQUFaOztJQUtNLGU7QUFDSiwyQkFBWSxJQUFaLEVBQWtCLElBQWxCLEVBQXdCLElBQXhCLEVBQThCLElBQTlCLEVBQW9DLElBQXBDLEVBQTBDLElBQTFDLEVBQWdELEdBQWhELEVBQXFELElBQXJELEVBQTJELFFBQTNELEVBQXFFLE9BQXJFLEVBQThFO0FBQUE7O0FBQzVFLFFBQUksT0FBTyxJQUFYO0FBQ0EsV0FBTyxLQUFLLE1BQUwsR0FBYyxDQUFkLEdBQWtCLElBQWxCLEdBQXlCLFFBQWhDOztBQUVBLFNBQUssT0FBTyxJQUFaLElBQW9CLFlBQXBCO0FBQ0EsU0FBSyxPQUFPLElBQVosSUFBb0IsTUFBcEI7QUFDQSxTQUFLLE9BQU8sSUFBWixJQUFvQixLQUFwQjtBQUNBLFNBQUssT0FBTyxJQUFaLElBQW9CLE9BQXBCO0FBQ0EsU0FBSyxJQUFMLElBQWEsTUFBYjtBQUNBLFNBQUssT0FBTyxJQUFaLElBQW9CLE1BQXBCO0FBQ0EsU0FBSyxPQUFPLFlBQVosSUFBNEIsb0JBQTVCO0FBQ0EsU0FBSyxPQUFPLFVBQVosSUFBMEIsa0JBQTFCO0FBQ0EsU0FBSyxPQUFPLFlBQVosSUFBNEIsaUJBQTVCO0FBQ0EsU0FBSyxPQUFPLGlCQUFaLElBQWlDLGdCQUFqQztBQUNBLFNBQUssT0FBTyxhQUFaLElBQTZCLGtCQUE3QjtBQUNBLFNBQUssT0FBTyxrQkFBWixJQUFrQyxpQkFBbEM7QUFDQSxTQUFLLE9BQU8sT0FBWixJQUF1QixhQUF2QjtBQUNBLFNBQUssT0FBTyxZQUFaLElBQTRCLFlBQTVCO0FBQ0EsU0FBSyxPQUFPLE1BQVosSUFBc0IsWUFBdEI7QUFDQSxTQUFLLE9BQU8sV0FBWixJQUEyQixXQUEzQjtBQUNBLFNBQUssT0FBTyxPQUFaLElBQXVCLFdBQXZCO0FBQ0EsU0FBSyxPQUFPLFlBQVosSUFBNEIsZ0JBQTVCO0FBQ0EsU0FBSyxPQUFPLE1BQVosSUFBc0IsVUFBdEI7QUFDQSxTQUFLLE9BQU8sV0FBWixJQUEyQixlQUEzQjs7QUFFQSxTQUFLLGFBQUwsR0FBcUIsRUFBckI7QUFDRDs7OztvQ0FFZSxHLEVBQUssUSxFQUFVO0FBQzdCLFVBQUksTUFBTSxJQUFJLE9BQWQ7QUFDQSxVQUFJLFFBQVEsU0FBUyxJQUFULENBQWMsSUFBdEIsSUFDRixRQUFRLFNBQVMsSUFBVCxDQUFjLEdBRHBCLElBRUYsUUFBUSxTQUFTLElBQVQsQ0FBYyxNQUZwQixJQUdGLFFBQVEsU0FBUyxJQUFULENBQWMsTUFIcEIsSUFJRixRQUFRLFNBQVMsSUFBVCxDQUFjLEtBSnhCLEVBSStCOztBQUU3QixZQUFJLGtCQUFrQixLQUFLLGFBQTNCO0FBQUEsWUFDRSxjQUFjLEtBQUssYUFEckI7O0FBR0EsWUFBSSxJQUFJLE9BQVIsRUFBaUI7QUFDZix5QkFBZSxNQUFmO0FBQ0Q7QUFDRCxZQUFJLElBQUksTUFBUixFQUFnQjtBQUNkLHlCQUFlLEtBQWY7QUFDRDtBQUNELFlBQUksSUFBSSxPQUFSLEVBQWlCO0FBQ2YseUJBQWUsTUFBZjtBQUNEO0FBQ0QsWUFBSSxJQUFJLFFBQVIsRUFBa0I7QUFDaEIseUJBQWUsT0FBZjtBQUNEO0FBQ0QsWUFBSSxnQkFBZ0IsS0FBSyxhQUF6QixFQUF3QztBQUN0Qyx5QkFBZSxRQUFmO0FBQ0Q7O0FBRUQsdUJBQWUsTUFBTSxTQUFTLFFBQVQsQ0FBa0IsR0FBbEIsQ0FBckI7O0FBRUEsZUFBTyxLQUFLLFdBQUwsS0FBcUIsV0FBNUI7QUFDRDtBQUNGIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.OperatingSystem = OperatingSystem;
})();
(function(){
"use strict";

var OperatingSystems = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxTQUFOLENBQWdCO0FBQ2QsVUFBUSxlQURNO0FBRWQsUUFBTSxrQkFGUTtBQUdkLGVBQWE7QUFIQyxDQUFoQjtBQUtBLElBQU0sbUJBQW1CLEVBQXpCIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems = OperatingSystems;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1BvaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxlQURFO0FBRVIsUUFBTSxPQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0FBTUEsU0FBUyxLQUFULENBQWUsQ0FBZixFQUFrQixDQUFsQixFQUFxQjtBQUNuQixPQUFLLEdBQUwsQ0FBUyxLQUFLLENBQWQsRUFBaUIsS0FBSyxDQUF0QjtBQUNEOztBQUVELE1BQU0sU0FBTixDQUFnQixHQUFoQixHQUFzQixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ3BDLE9BQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxPQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0QsQ0FIRDs7QUFLQSxNQUFNLFNBQU4sQ0FBZ0IsSUFBaEIsR0FBdUIsVUFBVSxDQUFWLEVBQWE7QUFDbEMsTUFBSSxDQUFKLEVBQU87QUFDTCxTQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDQSxTQUFLLENBQUwsR0FBUyxFQUFFLENBQVg7QUFDRDtBQUNGLENBTEQ7O0FBT0EsTUFBTSxTQUFOLENBQWdCLEtBQWhCLEdBQXdCLFlBQVk7QUFDbEMsU0FBTyxJQUFJLEtBQUosQ0FBVSxLQUFLLENBQWYsRUFBa0IsS0FBSyxDQUF2QixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxNQUFNLFNBQU4sQ0FBZ0IsUUFBaEIsR0FBMkIsWUFBWTtBQUNyQyxTQUFPLFFBQVEsS0FBSyxDQUFiLEdBQWlCLE1BQWpCLEdBQTBCLEtBQUssQ0FBL0IsR0FBbUMsR0FBMUM7QUFDRCxDQUZEIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L1BvaW50LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.Point = Point;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rectangle = function () {
  function Rectangle(x, y, width, height) {
    _classCallCheck(this, Rectangle);

    this.point = new Primrose.Text.Point(x, y);
    this.size = new Primrose.Text.Size(width, height);
  }

  _createClass(Rectangle, [{
    key: "set",
    value: function set(x, y, width, height) {
      this.point.set(x, y);
      this.size.set(width, height);
    }
  }, {
    key: "copy",
    value: function copy(r) {
      if (r) {
        this.point.copy(r.point);
        this.size.copy(r.size);
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[" + this.point.toString() + " x " + this.size.toString() + "]";
    }
  }, {
    key: "overlap",
    value: function overlap(r) {
      var left = Math.max(this.left, r.left),
          top = Math.max(this.top, r.top),
          right = Math.min(this.right, r.right),
          bottom = Math.min(this.bottom, r.bottom);
      if (right > left && bottom > top) {
        return new Rectangle(left, top, right - left, bottom - top);
      }
    }
  }, {
    key: "x",
    get: function get() {
      return this.point.x;
    },
    set: function set(x) {
      this.point.x = x;
    }
  }, {
    key: "left",
    get: function get() {
      return this.point.x;
    },
    set: function set(x) {
      this.point.x = x;
    }
  }, {
    key: "width",
    get: function get() {
      return this.size.width;
    },
    set: function set(width) {
      this.size.width = width;
    }
  }, {
    key: "right",
    get: function get() {
      return this.point.x + this.size.width;
    },
    set: function set(right) {
      this.point.x = right - this.size.width;
    }
  }, {
    key: "y",
    get: function get() {
      return this.point.y;
    },
    set: function set(y) {
      this.point.y = y;
    }
  }, {
    key: "top",
    get: function get() {
      return this.point.y;
    },
    set: function set(y) {
      this.point.y = y;
    }
  }, {
    key: "height",
    get: function get() {
      return this.size.height;
    },
    set: function set(height) {
      this.size.height = height;
    }
  }, {
    key: "bottom",
    get: function get() {
      return this.point.y + this.size.height;
    },
    set: function set(bottom) {
      this.point.y = bottom - this.size.height;
    }
  }, {
    key: "area",
    get: function get() {
      return this.width * this.height;
    }
  }]);

  return Rectangle;
}();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1JlY3RhbmdsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLFdBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7SUFLTSxTO0FBQ0oscUJBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsS0FBbEIsRUFBeUIsTUFBekIsRUFBaUM7QUFBQTs7QUFDL0IsU0FBSyxLQUFMLEdBQWEsSUFBSSxTQUFTLElBQVQsQ0FBYyxLQUFsQixDQUF3QixDQUF4QixFQUEyQixDQUEzQixDQUFiO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBSSxTQUFTLElBQVQsQ0FBYyxJQUFsQixDQUF1QixLQUF2QixFQUE4QixNQUE5QixDQUFaO0FBQ0Q7Ozs7d0JBK0RHLEMsRUFBRyxDLEVBQUcsSyxFQUFPLE0sRUFBUTtBQUN2QixXQUFLLEtBQUwsQ0FBVyxHQUFYLENBQWUsQ0FBZixFQUFrQixDQUFsQjtBQUNBLFdBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxLQUFkLEVBQXFCLE1BQXJCO0FBQ0Q7Ozt5QkFFSSxDLEVBQUc7QUFDTixVQUFJLENBQUosRUFBTztBQUNMLGFBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsRUFBRSxLQUFsQjtBQUNBLGFBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxFQUFFLElBQWpCO0FBQ0Q7QUFDRjs7OzRCQUVPO0FBQ04sYUFBTyxJQUFJLFNBQUosQ0FBYyxLQUFLLEtBQUwsQ0FBVyxDQUF6QixFQUE0QixLQUFLLEtBQUwsQ0FBVyxDQUF2QyxFQUEwQyxLQUFLLElBQUwsQ0FBVSxLQUFwRCxFQUEyRCxLQUFLLElBQUwsQ0FBVSxNQUFyRSxDQUFQO0FBQ0Q7OzsrQkFFVTtBQUNULG1CQUFXLEtBQUssS0FBTCxDQUFXLFFBQVgsRUFBWCxXQUFzQyxLQUFLLElBQUwsQ0FBVSxRQUFWLEVBQXRDO0FBQ0Q7Ozs0QkFFTyxDLEVBQUc7QUFDVCxVQUFJLE9BQU8sS0FBSyxHQUFMLENBQVMsS0FBSyxJQUFkLEVBQW9CLEVBQUUsSUFBdEIsQ0FBWDtBQUFBLFVBQ0UsTUFBTSxLQUFLLEdBQUwsQ0FBUyxLQUFLLEdBQWQsRUFBbUIsRUFBRSxHQUFyQixDQURSO0FBQUEsVUFFRSxRQUFRLEtBQUssR0FBTCxDQUFTLEtBQUssS0FBZCxFQUFxQixFQUFFLEtBQXZCLENBRlY7QUFBQSxVQUdFLFNBQVMsS0FBSyxHQUFMLENBQVMsS0FBSyxNQUFkLEVBQXNCLEVBQUUsTUFBeEIsQ0FIWDtBQUlBLFVBQUksUUFBUSxJQUFSLElBQWdCLFNBQVMsR0FBN0IsRUFBa0M7QUFDaEMsZUFBTyxJQUFJLFNBQUosQ0FBYyxJQUFkLEVBQW9CLEdBQXBCLEVBQXlCLFFBQVEsSUFBakMsRUFBdUMsU0FBUyxHQUFoRCxDQUFQO0FBQ0Q7QUFDRjs7O3dCQXpGTztBQUNOLGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBbEI7QUFDRCxLO3NCQUVLLEMsRUFBRztBQUNQLFdBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxDQUFmO0FBQ0Q7Ozt3QkFFVTtBQUNULGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBbEI7QUFDRCxLO3NCQUNRLEMsRUFBRztBQUNWLFdBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxDQUFmO0FBQ0Q7Ozt3QkFFVztBQUNWLGFBQU8sS0FBSyxJQUFMLENBQVUsS0FBakI7QUFDRCxLO3NCQUNTLEssRUFBTztBQUNmLFdBQUssSUFBTCxDQUFVLEtBQVYsR0FBa0IsS0FBbEI7QUFDRDs7O3dCQUVXO0FBQ1YsYUFBTyxLQUFLLEtBQUwsQ0FBVyxDQUFYLEdBQWUsS0FBSyxJQUFMLENBQVUsS0FBaEM7QUFDRCxLO3NCQUNTLEssRUFBTztBQUNmLFdBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxRQUFRLEtBQUssSUFBTCxDQUFVLEtBQWpDO0FBQ0Q7Ozt3QkFFTztBQUNOLGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBbEI7QUFDRCxLO3NCQUNLLEMsRUFBRztBQUNQLFdBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxDQUFmO0FBQ0Q7Ozt3QkFFUztBQUNSLGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBbEI7QUFDRCxLO3NCQUNPLEMsRUFBRztBQUNULFdBQUssS0FBTCxDQUFXLENBQVgsR0FBZSxDQUFmO0FBQ0Q7Ozt3QkFFWTtBQUNYLGFBQU8sS0FBSyxJQUFMLENBQVUsTUFBakI7QUFDRCxLO3NCQUNVLE0sRUFBUTtBQUNqQixXQUFLLElBQUwsQ0FBVSxNQUFWLEdBQW1CLE1BQW5CO0FBQ0Q7Ozt3QkFFWTtBQUNYLGFBQU8sS0FBSyxLQUFMLENBQVcsQ0FBWCxHQUFlLEtBQUssSUFBTCxDQUFVLE1BQWhDO0FBQ0QsSztzQkFDVSxNLEVBQVE7QUFDakIsV0FBSyxLQUFMLENBQVcsQ0FBWCxHQUFlLFNBQVMsS0FBSyxJQUFMLENBQVUsTUFBbEM7QUFDRDs7O3dCQUVVO0FBQ1QsYUFBTyxLQUFLLEtBQUwsR0FBYSxLQUFLLE1BQXpCO0FBQ0QiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvUmVjdGFuZ2xlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.Rectangle = Rectangle;
})();
(function(){
"use strict";

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
      } else {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1J1bGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLE1BRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCO0FBQ3hCLE9BQUssSUFBTCxHQUFZLElBQVo7QUFDQSxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7O0FBRUQsS0FBSyxTQUFMLENBQWUsb0JBQWYsR0FBc0MsVUFBVSxNQUFWLEVBQWtCLENBQWxCLEVBQXFCO0FBQ3pELE1BQUksUUFBUSxPQUFPLENBQVAsQ0FBWjtBQUNBLE1BQUksTUFBTSxJQUFOLEtBQWUsU0FBbkIsRUFBOEI7QUFDNUIsUUFBSSxNQUFNLEtBQUssSUFBTCxDQUFVLElBQVYsQ0FBZSxNQUFNLEtBQXJCLENBQVY7QUFDQSxRQUFJLEdBQUosRUFBUztBQUNQO0FBQ0E7QUFDQTtBQUNBLFVBQUksT0FBTyxJQUFJLElBQUksTUFBSixHQUFhLENBQWpCLENBQVg7QUFBQSxVQUNFLFFBQVEsSUFBSSxLQUFKLENBQVUsT0FBVixDQUFrQixJQUFsQixDQURWO0FBQUEsVUFFRSxNQUFNLFFBQVEsS0FBSyxNQUZyQjtBQUdBLFVBQUksVUFBVSxDQUFkLEVBQWlCO0FBQ2Y7QUFDQSxjQUFNLElBQU4sR0FBYSxLQUFLLElBQWxCO0FBQ0EsWUFBSSxNQUFNLE1BQU0sS0FBTixDQUFZLE1BQXRCLEVBQThCO0FBQzVCO0FBQ0EsY0FBSSxPQUFPLE1BQU0sT0FBTixDQUFjLEdBQWQsQ0FBWDtBQUNBLGVBQUssSUFBTCxHQUFZLFNBQVo7QUFDQSxpQkFBTyxNQUFQLENBQWMsSUFBSSxDQUFsQixFQUFxQixDQUFyQixFQUF3QixJQUF4QjtBQUNEO0FBQ0YsT0FURCxNQVVLO0FBQ0g7QUFDQSxZQUFJLE1BQU0sTUFBTSxPQUFOLENBQWMsS0FBZCxDQUFWO0FBQ0EsWUFBSSxLQUFLLE1BQUwsR0FBYyxJQUFJLEtBQUosQ0FBVSxNQUE1QixFQUFvQztBQUNsQztBQUNBLGNBQUksUUFBUSxJQUFJLE9BQUosQ0FBWSxLQUFLLE1BQWpCLENBQVo7QUFDQSxpQkFBTyxNQUFQLENBQWMsSUFBSSxDQUFsQixFQUFxQixDQUFyQixFQUF3QixLQUF4QjtBQUNEO0FBQ0QsWUFBSSxJQUFKLEdBQVcsS0FBSyxJQUFoQjtBQUNBLGVBQU8sTUFBUCxDQUFjLElBQUksQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsR0FBeEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRixDQWxDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9SdWxlLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.Rule = Rule;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1NpemUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLGVBREU7QUFFUixRQUFNLE1BRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLElBQVQsQ0FBYyxLQUFkLEVBQXFCLE1BQXJCLEVBQTZCO0FBQzNCLE9BQUssR0FBTCxDQUFTLFNBQVMsQ0FBbEIsRUFBcUIsVUFBVSxDQUEvQjtBQUNEOztBQUVELEtBQUssU0FBTCxDQUFlLEdBQWYsR0FBcUIsVUFBVSxLQUFWLEVBQWlCLE1BQWpCLEVBQXlCO0FBQzVDLE9BQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxPQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0QsQ0FIRDs7QUFLQSxLQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLFVBQVUsQ0FBVixFQUFhO0FBQ2pDLE1BQUksQ0FBSixFQUFPO0FBQ0wsU0FBSyxLQUFMLEdBQWEsRUFBRSxLQUFmO0FBQ0EsU0FBSyxNQUFMLEdBQWMsRUFBRSxNQUFoQjtBQUNEO0FBQ0YsQ0FMRDs7QUFPQSxLQUFLLFNBQUwsQ0FBZSxLQUFmLEdBQXVCLFlBQVk7QUFDakMsU0FBTyxJQUFJLElBQUosQ0FBUyxLQUFLLEtBQWQsRUFBcUIsS0FBSyxNQUExQixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxLQUFLLFNBQUwsQ0FBZSxRQUFmLEdBQTBCLFlBQVk7QUFDcEMsU0FBTyxRQUFRLEtBQUssS0FBYixHQUFxQixNQUFyQixHQUE4QixLQUFLLE1BQW5DLEdBQTRDLEdBQW5EO0FBQ0QsQ0FGRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9TaXplLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.Size = Size;
})();
(function(){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Terminal = function Terminal(inputEditor, outputEditor) {
  _classCallCheck(this, Terminal);

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
    } else {
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
          next = function next() {
        if (self.running) {
          setTimeout(looper, 1);
        }
      };

      currentProgram = inputEditor.value;
      looper = originalGrammar.interpret(currentProgram, input, stdout, stdout, next, clearScreen, this.loadFile.bind(this), done);
      outputEditor.tokenizer = Primrose.Text.Grammars.PlainText;
      clearScreen();
      next();
    }
  };

  this.loadFile = function (fileName) {
    return Primrose.HTTP.getText(fileName.toLowerCase()).then(function (file) {
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
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1Rlcm1pbmFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsZUFERTtBQUVSLFFBQU0sVUFGRTtBQUdSLGVBQWE7QUFITCxDQUFaOztJQUtNLFEsR0FDSixrQkFBWSxXQUFaLEVBQXlCLFlBQXpCLEVBQXVDO0FBQUE7O0FBQ3JDLGlCQUFlLGdCQUFnQixXQUEvQjs7QUFFQSxNQUFJLGdCQUFnQixJQUFwQjtBQUFBLE1BQ0UsaUJBQWlCLElBRG5CO0FBQUEsTUFFRSxrQkFBa0IsSUFGcEI7QUFBQSxNQUdFLG1CQUFtQixDQUhyQjtBQUFBLE1BSUUsV0FBVyxFQUpiO0FBQUEsTUFLRSxjQUFjLEVBTGhCO0FBQUEsTUFNRSxTQUFTLEVBTlg7QUFBQSxNQU9FLGVBQWUsZ0JBQWdCLFlBUGpDO0FBQUEsTUFRRSxPQUFPLElBUlQ7O0FBVUEsT0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLE9BQUssZUFBTCxHQUF1QixLQUF2Qjs7QUFFQSxXQUFTLEtBQVQsQ0FBZSxNQUFmLEVBQXVCO0FBQ3JCLFdBQU8sY0FBUCxHQUF3QixPQUFPLFlBQVAsR0FBc0IsT0FBTyxLQUFQLENBQWEsTUFBM0Q7QUFDQSxXQUFPLGNBQVAsQ0FBc0IsT0FBTyxXQUE3QjtBQUNEOztBQUVELFdBQVMsSUFBVCxHQUFnQjtBQUNkLFFBQUksS0FBSyxPQUFULEVBQWtCO0FBQ2hCO0FBQ0EsV0FBSyxPQUFMLEdBQWUsS0FBZjtBQUNBLFVBQUksWUFBSixFQUFrQjtBQUNoQixvQkFBWSxTQUFaLEdBQXdCLGVBQXhCO0FBQ0Esb0JBQVksS0FBWixHQUFvQixjQUFwQjtBQUNEO0FBQ0QsWUFBTSxXQUFOO0FBQ0Q7QUFDRjs7QUFFRCxXQUFTLFdBQVQsR0FBdUI7QUFDckIsaUJBQWEsY0FBYixHQUE4QixhQUFhLFlBQWIsR0FBNEIsQ0FBMUQ7QUFDQSxpQkFBYSxLQUFiLEdBQXFCLEVBQXJCO0FBQ0EsV0FB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

if(typeof window !== "undefined") window.Primrose.Text.Terminal = Terminal;
})();
(function(){
"use strict";

var Themes = {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1RoZW1lcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLFNBQU4sQ0FBZ0I7QUFDZCxVQUFRLGVBRE07QUFFZCxRQUFNLFFBRlE7QUFHZCxlQUFhO0FBSEMsQ0FBaEI7QUFLQSxJQUFNLFNBQVMsRUFBZiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9UaGVtZXMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Themes = Themes;
})();
(function(){
"use strict";

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1Rva2VuLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxlQURFO0FBRVIsUUFBTSxPQUZFO0FBR1IsZUFBYTtBQUhMLENBQVo7O0FBTUEsU0FBUyxLQUFULENBQWUsS0FBZixFQUFzQixJQUF0QixFQUE0QixLQUE1QixFQUFtQyxJQUFuQyxFQUF5QztBQUN2QyxPQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsT0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLE9BQUssS0FBTCxHQUFhLEtBQWI7QUFDQSxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0Q7O0FBRUQsTUFBTSxTQUFOLENBQWdCLEtBQWhCLEdBQXdCLFlBQVk7QUFDbEMsU0FBTyxJQUFJLEtBQUosQ0FBVSxLQUFLLEtBQWYsRUFBc0IsS0FBSyxJQUEzQixFQUFpQyxLQUFLLEtBQXRDLEVBQTZDLEtBQUssSUFBbEQsQ0FBUDtBQUNELENBRkQ7O0FBSUEsTUFBTSxTQUFOLENBQWdCLE9BQWhCLEdBQTBCLFVBQVUsQ0FBVixFQUFhO0FBQ3JDLE1BQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLENBQXJCLENBQVg7QUFDQSxPQUFLLEtBQUwsR0FBYSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBQWI7QUFDQSxTQUFPLElBQUksS0FBSixDQUFVLElBQVYsRUFBZ0IsS0FBSyxJQUFyQixFQUEyQixLQUFLLEtBQUwsR0FBYSxDQUF4QyxFQUEyQyxLQUFLLElBQWhELENBQVA7QUFDRCxDQUpEOztBQU1BLE1BQU0sU0FBTixDQUFnQixRQUFoQixHQUEyQixZQUFZO0FBQ3JDLFNBQU8sTUFBTSxLQUFLLElBQVgsR0FBa0IsSUFBbEIsR0FBeUIsS0FBSyxLQUE5QixHQUFzQyxHQUE3QztBQUNELENBRkQiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvVG9rZW4uanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Token = Token;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var WIDTH = 512,
    HEIGHT = 150;

var LoginForm = function (_Primrose$Controls$Fo) {
  _inherits(LoginForm, _Primrose$Controls$Fo);

  _createClass(LoginForm, null, [{
    key: "create",
    value: function create() {
      return new LoginForm();
    }
  }]);

  function LoginForm() {
    _classCallCheck(this, LoginForm);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginForm).call(this, {
      id: "Primrose.X.LoginForm[" + COUNTER++ + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    }));

    _this.listeners.login = [];
    _this.listeners.signup = [];

    _this.labelUserName = new Primrose.Controls.AbstractLabel({
      id: _this.id + "-labelUserName",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "User name:",
      textAlign: "right"
    });

    _this.userName = new Primrose.Text.Controls.TextInput({
      id: _this.id + "-userName",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 3),
      fontSize: 32
    });

    _this.labelPassword = new Primrose.Controls.AbstractLabel({
      id: _this.id + "-labelPassword",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Password:",
      textAlign: "right"
    });

    _this.password = new Primrose.Text.Controls.TextInput({
      id: _this.id + "-password",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      passwordCharacter: "*"
    });

    _this.signupButton = new Primrose.Controls.Button2D({
      id: _this.id + "-signupButton",
      bounds: new Primrose.Text.Rectangle(0, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Sign up"
    });

    _this.loginButton = new Primrose.Controls.Button2D({
      id: _this.id + "-loginButton",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
      fontSize: 32,
      value: "Login"
    });

    _this.loginButton.addEventListener("click", function (evt) {
      return emit.call(_this, "login", {
        target: _this
      });
    }, false);
    _this.signupButton.addEventListener("click", function (evt) {
      return emit.call(_this, "signup", {
        target: _this
      });
    }, false);

    _this.appendChild(_this.labelUserName);
    _this.appendChild(_this.userName);
    _this.appendChild(_this.labelPassword);
    _this.appendChild(_this.password);
    _this.appendChild(_this.signupButton);
    _this.appendChild(_this.loginButton);
    return _this;
  }

  return LoginForm;
}(Primrose.Controls.Form);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9YL0xvZ2luRm9ybS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztBQUVBLElBQUksVUFBVSxDQUFkOztBQUVBLElBQU0sUUFBUSxHQUFkO0FBQUEsSUFDRSxTQUFTLEdBRFg7O0FBR0EsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLFlBREU7QUFFUixRQUFNLFdBRkU7QUFHUixhQUFXLHdCQUhIO0FBSVIsZUFBYTtBQUpMLENBQVo7O0lBTU0sUzs7Ozs7NkJBRVk7QUFDZCxhQUFPLElBQUksU0FBSixFQUFQO0FBQ0Q7OztBQUVELHVCQUFjO0FBQUE7O0FBQUEsNkZBQ047QUFDSixvQ0FBNEIsU0FBNUIsTUFESTtBQUVKLGNBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxTQUFsQixDQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxLQUFsQyxFQUF5QyxNQUF6QztBQUZKLEtBRE07O0FBTVosVUFBSyxTQUFMLENBQWUsS0FBZixHQUF1QixFQUF2QjtBQUNBLFVBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsRUFBeEI7O0FBRUEsVUFBSyxhQUFMLEdBQXFCLElBQUksU0FBUyxRQUFULENBQWtCLGFBQXRCLENBQW9DO0FBQ3ZELFVBQUksTUFBSyxFQUFMLEdBQVUsZ0JBRHlDO0FBRXZELGNBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxTQUFsQixDQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxRQUFRLENBQTFDLEVBQTZDLFNBQVMsQ0FBdEQsQ0FGK0M7QUFHdkQsZ0JBQVUsRUFINkM7QUFJdkQsYUFBTyxZQUpnRDtBQUt2RCxpQkFBVztBQUw0QyxLQUFwQyxDQUFyQjs7QUFRQSxVQUFLLFFBQUwsR0FBZ0IsSUFBSSxTQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLFNBQTNCLENBQXFDO0FBQ25ELFVBQUksTUFBSyxFQUFMLEdBQVUsV0FEcUM7QUFFbkQsY0FBUSxJQUFJLFNBQVMsSUFBVCxDQUFjLFNBQWxCLENB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

if(typeof window !== "undefined") window.Primrose.X.LoginForm = LoginForm;
})();
(function(){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WIDTH = 512,
    HEIGHT = 200;

var COUNTER = 0;

var SignupForm = function (_Primrose$Controls$Fo) {
  _inherits(SignupForm, _Primrose$Controls$Fo);

  function SignupForm() {
    _classCallCheck(this, SignupForm);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SignupForm).call(this, {
      id: "Primrose.X.SignupForm[" + COUNTER++ + "]",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    }));

    _this.listeners.login = [];
    _this.listeners.signup = [];

    _this.labelEmail = new Primrose.Controls.AbstractLabel({
      id: _this.id + "-labelEmail",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Email:",
      textAlign: "right"
    });

    _this.email = new Primrose.Text.Controls.TextInput({
      id: _this.id + "-email",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    _this.labelUserName = new Primrose.Controls.AbstractLabel({
      id: _this.id + "-labelUserName",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "User name:",
      textAlign: "right"
    });

    _this.userName = new Primrose.Text.Controls.TextInput({
      id: _this.id + "-userName",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    _this.labelPassword = new Primrose.Controls.AbstractLabel({
      id: _this.id + "-labelPassword",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Password:",
      textAlign: "right"
    });

    _this.password = new Primrose.Text.Controls.TextInput({
      id: _this.id + "-password",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      passwordCharacter: "*"
    });

    _this.loginButton = new Primrose.Controls.Button2D({
      id: _this.id + "-loginButton",
      bounds: new Primrose.Text.Rectangle(0, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Log in"
    });

    _this.signupButton = new Primrose.Controls.Button2D({
      id: _this.id + "-signupButton",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Sign up"
    });

    _this.loginButton.addEventListener("click", function (evt) {
      return emit.call(_this, "login", {
        target: _this
      });
    }, false);
    _this.signupButton.addEventListener("click", function (evt) {
      return emit.call(_this, "signup", {
        target: _this
      });
    }, false);

    _this.appendChild(_this.labelUserName);
    _this.appendChild(_this.userName);
    _this.appendChild(_this.labelEmail);
    _this.appendChild(_this.email);
    _this.appendChild(_this.labelPassword);
    _this.appendChild(_this.password);
    _this.appendChild(_this.loginButton);
    _this.appendChild(_this.signupButton);
    return _this;
  }

  return SignupForm;
}(Primrose.Controls.Form);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9YL1NpZ251cEZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBRUEsSUFBTSxRQUFRLEdBQWQ7QUFBQSxJQUNFLFNBQVMsR0FEWDs7QUFHQSxJQUFJLFVBQVUsQ0FBZDs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsWUFERTtBQUVSLFFBQU0sWUFGRTtBQUdSLGFBQVcsd0JBSEg7QUFJUixlQUFhO0FBSkwsQ0FBWjs7SUFNTSxVOzs7QUFDSix3QkFBYztBQUFBOztBQUFBLDhGQUVOO0FBQ0oscUNBQTZCLFNBQTdCLE1BREk7QUFFSixjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEIsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsS0FBbEMsRUFBeUMsTUFBekM7QUFGSixLQUZNOztBQU9aLFVBQUssU0FBTCxDQUFlLEtBQWYsR0FBdUIsRUFBdkI7QUFDQSxVQUFLLFNBQUwsQ0FBZSxNQUFmLEdBQXdCLEVBQXhCOztBQUVBLFVBQUssVUFBTCxHQUFrQixJQUFJLFNBQVMsUUFBVCxDQUFrQixhQUF0QixDQUFvQztBQUNwRCxVQUFJLE1BQUssRUFBTCxHQUFVLGFBRHNDO0FBRXBELGNBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxTQUFsQixDQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxRQUFRLENBQTFDLEVBQTZDLFNBQVMsQ0FBdEQsQ0FGNEM7QUFHcEQsZ0JBQVUsRUFIMEM7QUFJcEQsYUFBTyxRQUo2QztBQUtwRCxpQkFBVztBQUx5QyxLQUFwQyxDQUFsQjs7QUFRQSxVQUFLLEtBQUwsR0FBYSxJQUFJLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsU0FBM0IsQ0FBcUM7QUFDaEQsVUFBSSxNQUFLLEVBQUwsR0FBVSxRQURrQztBQUVoRCxjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEIsQ0FBNEIsUUFBUSxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQyxRQUFRLENBQWxELEVBQXFELFNBQVMsQ0FBOUQsQ0FGd0M7QUFHaEQsZ0JBQVU7QUFIc0MsS0FBckMsQ0FBYjs7QUFNQSxVQUFLLGFBQUwsR0FBcUIsSUFBSSxTQUFTLFFBQVQsQ0FBa0IsYUFBdEIsQ0FBb0M7QUFDdkQsVUFBSSxNQUFLLEVBQUwsR0FBVSxnQkFEeUM7QUFFdkQsY0FBUSxJQUFJLFNBQVMsSUFBVCxDQUFjLFNBQWxCLENBQTRCLENBQTVCLEVBQStCLFNBQVMsQ0FBeEMsRUFBMkMsUUFBUSxDQUFuRCxFQUFzRCxTQUFTLENBQS9ELENBRitDO0FBR3ZELGdCQUFVLEVBSDZDO0FBSXZELGFBQU8sWUFKZ0Q7QUFLdkQsaUJBQVc7QUFMNEMsS0FBcEMsQ0FBckI7O0FBUUEsVUFBSyxRQUFMLEdBQWdCLElBQUksU0FBUyxJQUFULENBQWMsUUFBZCxDQUF1QixTQUEzQixDQUFxQztBQUNuRCxVQUFJLE1BQUssRUFBTCxHQUFVLFdBRHFDO0FBRW5ELGNBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxTQUFsQixDQUE0QixRQUFRLENBQXBDLEVBQXVDLFNBQVMsQ0FBaEQsRUFBbUQsUUFBUSxDQUEzRCxFQUE4RCxTQUFTLENBQXZFLENBRjJDO0FBR25ELGdCQUFVO0FBSHlDLEtBQXJDLENBQWhCOztBQU1BLFVBQUssYUFBTCxHQUFxQixJQUFJLFNBQVMsUUFBVCxDQUFrQixhQUF0QixDQUFvQztBQUN2RCxVQUFJLE1BQUssRUFBTCxHQUFVLGdCQUR5QztBQUV2RCxjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEIsQ0FBNEIsQ0FBNUIsRUFBK0IsU0FBUyxDQUF4QyxFQUEyQyxRQUFRLENBQW5ELEVBQXNELFNBQVMsQ0FBL0QsQ0FGK0M7QUFHdkQsZ0JBQVUsRUFINkM7QUFJdkQsYUFBTyxXQUpnRDtBQUt2RCxpQkFBVztBQUw0QyxLQUFwQyxDQUFyQjs7QUFRQSxVQUFLLFFBQUwsR0FBZ0IsSUFBSSxTQUFTLElBQVQsQ0FBYyxRQUFkLENBQXVCLFNBQTNCLENBQXFDO0FBQ25ELFVBQUksTUFBSyxFQUFMLEdBQVUsV0FEcUM7QUFFbkQsY0FBUSxJQUFJLFNBQVMsSUFBVCxDQUFjLFNBQWxCLENBQTRCLFFBQVEsQ0FBcEMsRUFBdUMsU0FBUyxDQUFoRCxFQUFtRCxRQUFRLENBQTNELEVBQThELFNBQVMsQ0FBdkUsQ0FGMkM7QUFHbkQsZ0JBQVUsRUFIeUM7QUFJbkQseUJBQW1CO0FBSmdDLEtBQXJDLENBQWhCOztBQU9BLFVBQUssV0FBTCxHQUFtQixJQUFJLFNBQVMsUUFBVCxDQUFrQixRQUF0QixDQUErQjtBQUNoRCxVQUFJLE1BQUssRUFBTCxHQUFVLGNBRGtDO0FBRWhELGNBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxTQUFsQixDQUE0QixDQUE1QixFQUErQixJQUFJLE1BQUosR0FBYSxDQUE1QyxFQUErQyxRQUFRLENBQXZELEVBQTBELFNBQVMsQ0FBbkUsQ0FGd0M7QUFHaEQsZ0JBQVUsRUFIc0M7QUFJaEQsYUFBTztBQUp5QyxLQUEvQixDQUFuQjs7QUFPQSxVQUFLLFlBQUwsR0FBb0IsSUFBSSxTQUFTLFFBQVQsQ0FBa0IsUUFBdEIsQ0FBK0I7QUFDakQsVUFBSSxNQUFLLEVBQUwsR0FBVSxlQURtQztBQUVqRCxjQUFRLElBQUksU0FBUyxJQUFULENBQWMsU0FBbEIsQ0FBNEIsUUFBUSxDQUFwQyxFQUF1QyxJQUFJLE1BQUosR0FBYSxDQUFwRCxFQUF1RCxRQUFRLENBQS9ELEVBQWtFLFNBQVMsQ0FBM0UsQ0FGeUM7QUFHakQsZ0JBQVUsRUFIdUM7QUFJakQsYUFBTztBQUowQyxLQUEvQixDQUFwQjs7QUFPQSxVQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQWtDLE9BQWxDLEVBQTJDLFVBQUMsR0FBRDtBQUFBLGFBQVMsS0FBSyxJQUFMLFFBQWdCLE9BQWhCLEVBQXlCO0FBQzNFO0FBRDJFLE9BQXpCLENBQVQ7QUFBQSxLQUEzQyxFQUVJLEtBRko7QUFHQSxVQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLENBQW1DLE9BQW5DLEVBQTRDLFVBQUMsR0FBRDtBQUFBLGFBQVMsS0FBSyxJQUFMLFFBQWdCLFFBQWhCLEVBQTBCO0FBQzdFO0FBRDZFLE9BQTFCLENBQVQ7QUFBQSxLQUE1QyxFQUVJLEtBRko7O0FBSUEsVUFBSyxXQUFMLENBQWlCLE1BQUssYUFBdEI7QUFDQSxVQUFLLFdBQUwsQ0FBaUIsTUFBSyxRQUF0QjtBQUNBLFVBQUssV0FBTCxDQUFpQixNQUFLLFVBQXRCO0FBQ0EsVUFBSyxXQUFMLENBQWlCLE1BQUssS0FBdEI7QUFDQSxVQUFLLFdBQUwsQ0FBaUIsTUFBSyxhQUF0QjtBQUNBLFVBQUssV0FBTCxDQUFpQixNQUFLLFFBQXRCO0FBQ0EsVUFBSyxXQUFMLENBQWlCLE1BQUssV0FBdEI7QUFDQSxVQUFLLFdBQUwsQ0FBaUIsTUFBSyxZQUF0QjtBQWpGWTtBQWtGYjs7O0VBbkZzQixTQUFTLFFBQVQsQ0FBa0IsSSIsImZpbGUiOiJzcmMvUHJpbXJvc2UvWC9TaWdudXBGb3JtLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.X.SignupForm = SignupForm;
})();
(function(){
"use strict";

var CodePage = Primrose.Text.CodePage;

var DE_QWERTZ = new CodePage("Deutsch: QWERTZ", "de", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9ERV9RV0VSVFouanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsSUFBSSxXQUFXLFNBQVMsSUFBVCxDQUFjLFFBQTdCOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSx5QkFERztBQUVYLFFBQU0sV0FGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxZQUFZLElBQUksUUFBSixDQUFhLGlCQUFiLEVBQWdDLElBQWhDLEVBQXNDO0FBQ3RELFlBQVUsQ0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLEdBQVgsRUFBZ0IsR0FBaEIsQ0FENEM7QUFFdEQsVUFBUTtBQUNOLFVBQU0sR0FEQTtBQUVOLFVBQU0sR0FGQTtBQUdOLFVBQU0sR0FIQTtBQUlOLFVBQU0sR0FKQTtBQUtOLFVBQU0sR0FMQTtBQU1OLFVBQU0sR0FOQTtBQU9OLFVBQU0sR0FQQTtBQVFOLFVBQU0sR0FSQTtBQVNOLFVBQU0sR0FUQTtBQVVOLFVBQU0sR0FWQTtBQVdOLFVBQU0sR0FYQTtBQVlOLFVBQU0sR0FaQTtBQWFOLFVBQU0sR0FiQTtBQWNOLFdBQU8sU0FBUyxJQUFULENBQWMsQ0FBZCxDQWREO0FBZU4sV0FBTyxHQWZEO0FBZ0JOLFdBQU8sR0FoQkQ7QUFpQk4sV0FBTyxHQWpCRDtBQWtCTixXQUFPLEdBbEJEO0FBbUJOLFdBQU8sR0FuQkQ7QUFvQk4sV0FBTyxHQXBCRDtBQXFCTixXQUFPLEdBckJEO0FBc0JOLFdBQU8sR0F0QkQ7QUF1Qk4sV0FBTyxHQXZCRDtBQXdCTixXQUFPLFNBQVMsSUFBVCxDQUFjLENBQWQsQ0F4QkQ7QUF5Qk4sV0FBTyxHQXpCRDtBQTBCTixXQUFPLFNBQVMsSUFBVCxDQUFjLENBQWQsQ0ExQkQ7QUEyQk4sV0FBTyxTQUFTLElBQVQsQ0FBYyxDQUFkLENBM0JEO0FBNEJOLFdBQU8sR0E1QkQ7QUE2Qk4sV0FBTztBQTdCRCxHQUY4QztBQWlDdEQsZUFBYTtBQUNYLFVBQU0sR0FESztBQUVYLFVBQU0sR0FGSztBQUdYLFVBQU0sR0FISztBQUlYLFVBQU0sR0FKSztBQUtYLFVBQU0sR0FMSztBQU1YLFdBQU87QUFOSSxHQWpDeUM7QUF5Q3RELGVBQWE7QUFDWCxVQUFNLEdBREs7QUFFWCxVQUFNLEdBRks7QUFHWCxVQUFNLEdBSEs7QUFJWCxVQUFNLEdBSks7QUFLWCxVQUFNLEdBTEs7QUFNWCxVQUFNLEdBTks7QUFPWCxVQUFNO0FBUEssR0F6Q3lDO0FBa0R0RCxTQUFPO0FBQ0wsVUFBTSxHQUREO0FBRUwsVUFBTSxHQUZEO0FBR0wsVUFBTSxHQUhEO0FBSUwsVUFBTSxJQUpEO0FBS0wsVUFBTSxHQUxEO0FBTUwsVUFBTSxHQU5EO0FBT0wsVUFBTSxHQVBEO0FBUUwsVUFBTSxHQVJEO0FBU0wsVUFBTSxHQVREO0FBVUwsVUFBTSxHQVZEO0FBV0wsVUFBTSxHQVhEO0FBWUwsVUFBTSxHQVpEO0FBYUwsVUFBTSxHQWJEO0FBY0wsV0FBTyxHQWRGO0FBZUwsV0FBTyxHQWZGO0FBZ0JMLFdBQU8sR0FoQkY7QUFpQkwsV0FBTyxHQWpCRjtBQWtCTCxXQUFPLEdBbEJGO0FBbUJMLFdBQU8sR0FuQkY7QUFvQkwsV0FBTyxHQXBCRjtBQXFCTCxXQUFPLEdBckJGO0FBc0JMLFdBQU8sR0F0QkY7QUF1QkwsV0FBTyxHQXZCRjtBQXdCTCxXQUFPLEdBeEJGO0FBeUJMLFdBQU8sR0F6QkY7QUEwQkwsV0FBTztBQTFCRixHQWxEK0M7QUE4RXRELFdBQVM7QUFDUCxVQUFNLEdBREM7QUFFUCxVQUFNLEdBRkM7QUFHUCxVQUFNLEdBSEM7QUFJUCxVQUFNLEdBSkM7QUFLUCxVQUFNLEdBTEM7QUFNUCxVQUFNLEdBTkM7QUFPUCxVQUFNLEdBUEM7QUFRUCxVQUFNLElBUkM7QUFTUCxVQUFNLEdBVEM7QUFVUCxVQUFNLEdBVkM7QUFXUCxVQUFNLEdBWEM7QUFZUCxXQUFPLEdBWkE7QUFhUCxXQUFPLEdBYkE7QUFjUCxXQUFPLElBZEE7QUFlUCxXQUFPO0FBZkEsR0E5RTZDO0FBK0Z0RCxnQkFBYztBQUNaLFVBQU0sR0FETTtBQUVaLFdBQU87QUFGSyxHQS9Gd0M7QUFtR3RELGVBQWE7QUFDWCxVQUFNLEdBREs7QUFFWCxVQUFNLEdBRks7QUFHWCxVQUFNLEdBSEs7QUFJWCxVQUFNLEdBSks7QUFLWCxVQUFNLEdBTEs7QUFNWCxXQUFPO0FBTkksR0FuR3lDO0FBMkd0RCxlQUFhO0FBQ1gsVUFBTSxHQURLO0FBRVgsVUFBTSxHQUZLO0FBR1gsVUFBTSxHQUhLO0FBSVgsVUFBTSxHQUpLO0FBS1gsVUFBTSxHQUxLO0FBTVgsVUFBTSxHQU5LO0FBT1gsVUFBTTtBQVBLO0FBM0d5QyxDQUF0QyxDQUFsQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db2RlUGFnZXMvREVfUVdFUlRaLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.CodePages.DE_QWERTZ = DE_QWERTZ;
})();
(function(){
"use strict";

var CodePage = Primrose.Text.CodePage;

var EN_UKX = new CodePage("English: UK Extended", "en-GB", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9FTl9VS1guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0EsSUFBSSxXQUFXLFNBQVMsSUFBVCxDQUFjLFFBQTdCOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSx5QkFERztBQUVYLFFBQU0sUUFGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxTQUFTLElBQUksUUFBSixDQUFhLHNCQUFiLEVBQXFDLE9BQXJDLEVBQThDO0FBQzNELFdBQVM7QUFDUCxVQUFNLEdBREM7QUFFUCxVQUFNLEdBRkM7QUFHUCxVQUFNLEdBSEM7QUFJUCxVQUFNLEdBSkM7QUFLUCxVQUFNLEdBTEM7QUFNUCxVQUFNLEdBTkM7QUFPUCxXQUFPLElBUEE7QUFRUCxXQUFPLEdBUkE7QUFTUCxXQUFPLElBVEE7QUFVUCxXQUFPO0FBVkEsR0FEa0Q7QUFhM0QsZ0JBQWM7QUFDWixVQUFNLEdBRE07QUFFWixVQUFNLEdBRk07QUFHWixVQUFNLEdBSE07QUFJWixVQUFNLEdBSk07QUFLWixVQUFNLEdBTE07QUFNWixXQUFPO0FBTkssR0FiNkM7QUFxQjNELFVBQVE7QUFDTixVQUFNLEdBREE7QUFFTixVQUFNLEdBRkE7QUFHTixVQUFNLEdBSEE7QUFJTixVQUFNLEdBSkE7QUFLTixVQUFNLEdBTEE7QUFNTixVQUFNLEdBTkE7QUFPTixVQUFNLEdBUEE7QUFRTixVQUFNLEdBUkE7QUFTTixVQUFNLEdBVEE7QUFVTixVQUFNLEdBVkE7QUFXTixVQUFNLEdBWEE7QUFZTixVQUFNLEdBWkE7QUFhTixVQUFNLEdBYkE7QUFjTixXQUFPLEdBZEQ7QUFlTixXQUFPLEdBZkQ7QUFnQk4sV0FBTyxHQWhCRDtBQWlCTixXQUFPLEdBakJEO0FBa0JOLFdBQU8sR0FsQkQ7QUFtQk4sV0FBTyxHQW5CRDtBQW9CTixXQUFPLEdBcEJEO0FBcUJOLFdBQU8sR0FyQkQ7QUFzQk4sV0FBTyxHQXRCRDtBQXVCTixXQUFPLEdBdkJEO0FBd0JOLFdBQU8sSUF4QkQ7QUF5Qk4sV0FBTyxHQXpCRDtBQTBCTixXQUFPLEdBMUJEO0FBMkJOLFdBQU87QUEzQkQsR0FyQm1EO0FBa0QzRCxTQUFPO0FBQ0wsVUFBTSxHQUREO0FBRUwsVUFBTSxHQUZEO0FBR0wsVUFBTSxHQUhEO0FBSUwsVUFBTSxJQUpEO0FBS0wsVUFBTSxHQUxEO0FBTUwsVUFBTSxHQU5EO0FBT0wsVUFBTSxHQVBEO0FBUUwsVUFBTSxHQVJEO0FBU0wsVUFBTSxHQVREO0FBVUwsVUFBTSxHQVZEO0FBV0wsVUFBTSxHQVhEO0FBWUwsVUFBTSxHQVpEO0FBYUwsVUFBTSxHQWJEO0FBY0wsV0FBTyxHQWRGO0FBZUwsV0FBTyxHQWZGO0FBZ0JMLFdBQU8sR0FoQkY7QUFpQkwsV0FBTyxHQWpCRjtBQWtCTCxXQUFPLEdBbEJGO0FBbUJMLFdBQU8sR0FuQkY7QUFvQkwsV0FBTyxHQXBCRjtBQXFCTCxXQUFPLEdBckJGO0FBc0JMLFdBQU8sR0F0QkY7QUF1QkwsV0FBTyxHQXZCRjtBQXdCTCxXQUFPLEdBeEJGO0FBeUJMLFdBQU8sR0F6QkY7QUEwQkwsV0FBTyxHQTFCRjtBQTJCTCxXQUFPO0FBM0JGO0FBbERvRCxDQUE5QyxDQUFmIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9FTl9VS1guanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.CodePages.EN_UKX = EN_UKX;
})();
(function(){
"use strict";

var CodePage = Primrose.Text.CodePage;

var EN_US = new CodePage("English: USA", "en-US", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9FTl9VUy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFJLFdBQVcsU0FBUyxJQUFULENBQWMsUUFBN0I7O0FBRUEsTUFBTSxNQUFOLENBQWE7QUFDWCxVQUFRLHlCQURHO0FBRVgsUUFBTSxPQUZLO0FBR1gsZUFBYTtBQUhGLENBQWI7QUFLQSxJQUFNLFFBQVEsSUFBSSxRQUFKLENBQWEsY0FBYixFQUE2QixPQUE3QixFQUFzQztBQUNsRCxVQUFRO0FBQ04sVUFBTSxHQURBO0FBRU4sVUFBTSxHQUZBO0FBR04sVUFBTSxHQUhBO0FBSU4sVUFBTSxHQUpBO0FBS04sVUFBTSxHQUxBO0FBTU4sVUFBTSxHQU5BO0FBT04sVUFBTSxHQVBBO0FBUU4sVUFBTSxHQVJBO0FBU04sVUFBTSxHQVRBO0FBVU4sVUFBTSxHQVZBO0FBV04sVUFBTSxHQVhBO0FBWU4sVUFBTSxHQVpBO0FBYU4sVUFBTSxHQWJBO0FBY04sV0FBTyxHQWREO0FBZU4sV0FBTyxHQWZEO0FBZ0JOLFdBQU8sR0FoQkQ7QUFpQk4sV0FBTyxHQWpCRDtBQWtCTixXQUFPLEdBbEJEO0FBbUJOLFdBQU8sR0FuQkQ7QUFvQk4sV0FBTyxHQXBCRDtBQXFCTixXQUFPLEdBckJEO0FBc0JOLFdBQU8sSUF0QkQ7QUF1Qk4sV0FBTyxHQXZCRDtBQXdCTixXQUFPO0FBeEJELEdBRDBDO0FBMkJsRCxTQUFPO0FBQ0wsVUFBTSxHQUREO0FBRUwsVUFBTSxHQUZEO0FBR0wsVUFBTSxHQUhEO0FBSUwsVUFBTSxHQUpEO0FBS0wsVUFBTSxHQUxEO0FBTUwsVUFBTSxHQU5EO0FBT0wsVUFBTSxHQVBEO0FBUUwsVUFBTSxHQVJEO0FBU0wsVUFBTSxHQVREO0FBVUwsVUFBTSxHQVZEO0FBV0wsVUFBTSxHQVhEO0FBWUwsVUFBTSxHQVpEO0FBYUwsVUFBTSxHQWJEO0FBY0wsV0FBTyxHQWRGO0FBZUwsV0FBTyxHQWZGO0FBZ0JMLFdBQU8sR0FoQkY7QUFpQkwsV0FBTyxHQWpCRjtBQWtCTCxXQUFPLEdBbEJGO0FBbUJMLFdBQU8sR0FuQkY7QUFvQkwsV0FBTyxHQXBCRjtBQXFCTCxXQUFPLEdBckJGO0FBc0JMLFdBQU8sR0F0QkY7QUF1QkwsV0FBTyxHQXZCRjtBQXdCTCxXQUFPO0FBeEJGO0FBM0IyQyxDQUF0QyxDQUFkIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9FTl9VUy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.CodePages.EN_US = EN_US;
})();
(function(){
"use strict";

var CodePage = Primrose.Text.CodePage;

var FR_AZERTY = new CodePage("Français: AZERTY", "fr", {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvZGVQYWdlcy9GUl9BWkVSVFkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsSUFBSSxXQUFXLFNBQVMsSUFBVCxDQUFjLFFBQTdCOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSx5QkFERztBQUVYLFFBQU0sV0FGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxZQUFZLElBQUksUUFBSixDQUFhLGtCQUFiLEVBQWlDLElBQWpDLEVBQXVDO0FBQ3ZELFlBQVUsQ0FBQyxHQUFELEVBQU0sRUFBTixFQUFVLEVBQVYsQ0FENkM7QUFFdkQsVUFBUTtBQUNOLFVBQU0sR0FEQTtBQUVOLFVBQU0sR0FGQTtBQUdOLFVBQU0sR0FIQTtBQUlOLFVBQU0sR0FKQTtBQUtOLFVBQU0sSUFMQTtBQU1OLFVBQU0sR0FOQTtBQU9OLFVBQU0sR0FQQTtBQVFOLFVBQU0sR0FSQTtBQVNOLFVBQU0sR0FUQTtBQVVOLFVBQU0sR0FWQTtBQVdOLFVBQU0sR0FYQTtBQVlOLFdBQU8sR0FaRDtBQWFOLFdBQU8sR0FiRDtBQWNOLFdBQU8sR0FkRDtBQWVOLFdBQU8sR0FmRDtBQWdCTixXQUFPLEdBaEJEO0FBaUJOLFdBQU8sR0FqQkQ7QUFrQk4sV0FBTyxHQWxCRDtBQW1CTixXQUFPLEdBbkJEO0FBb0JOLFdBQU8sU0FBUyxJQUFULENBQWMsQ0FBZCxDQXBCRDtBQXFCTixXQUFPLEdBckJEO0FBc0JOLFdBQU8sR0F0QkQ7QUF1Qk4sV0FBTztBQXZCRCxHQUYrQztBQTJCdkQsU0FBTztBQUNMLFVBQU0sR0FERDtBQUVMLFVBQU0sR0FGRDtBQUdMLFVBQU0sR0FIRDtBQUlMLFVBQU0sR0FKRDtBQUtMLFVBQU0sR0FMRDtBQU1MLFVBQU0sR0FORDtBQU9MLFVBQU0sR0FQRDtBQVFMLFVBQU0sR0FSRDtBQVNMLFVBQU0sR0FURDtBQVVMLFVBQU0sR0FWRDtBQVdMLFVBQU0sR0FYRDtBQVlMLFdBQU8sR0FaRjtBQWFMLFdBQU8sR0FiRjtBQWNMLFdBQU8sR0FkRjtBQWVMLFdBQU8sR0FmRjtBQWdCTCxXQUFPLEdBaEJGO0FBaUJMLFdBQU8sR0FqQkY7QUFrQkwsV0FBTyxHQWxCRjtBQW1CTCxXQUFPLEdBbkJGO0FBb0JMLFdBQU8sR0FwQkY7QUFxQkwsV0FBTztBQXJCRixHQTNCZ0Q7QUFrRHZELFdBQVM7QUFDUCxVQUFNLEdBREM7QUFFUCxVQUFNLFNBQVMsSUFBVCxDQUFjLENBQWQsQ0FGQztBQUdQLFVBQU0sR0FIQztBQUlQLFVBQU0sR0FKQztBQUtQLFVBQU0sR0FMQztBQU1QLFVBQU0sR0FOQztBQU9QLFVBQU0sU0FBUyxJQUFULENBQWMsQ0FBZCxDQVBDO0FBUVAsVUFBTSxJQVJDO0FBU1AsVUFBTSxHQVRDO0FBVVAsVUFBTSxHQVZDO0FBV1AsV0FBTyxHQVhBO0FBWVAsV0FBTyxHQVpBO0FBYVAsV0FBTztBQWJBLEdBbEQ4QztBQWlFdkQsZUFBYTtBQUNYLFVBQU0sR0FESztBQUVYLFVBQU0sR0FGSztBQUdYLFVBQU0sR0FISztBQUlYLFVBQU0sR0FKSztBQUtYLFVBQU07QUFMSyxHQWpFMEM7QUF3RXZELGVBQWE7QUFDWCxVQUFNLEdBREs7QUFFWCxVQUFNLEdBRks7QUFHWCxVQUFNO0FBSEssR0F4RTBDO0FBNkV2RCxlQUFhO0FBQ1gsVUFBTSxHQURLO0FBRVgsVUFBTSxHQUZLO0FBR1gsVUFBTSxHQUhLO0FBSVgsVUFBTSxHQUpLO0FBS1gsVUFBTSxHQUxLO0FBTVgsVUFBTSxHQU5LO0FBT1gsVUFBTSxHQVBLO0FBUVgsVUFBTTtBQVJLO0FBN0UwQyxDQUF2QyxDQUFsQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db2RlUGFnZXMvRlJfQVpFUlRZLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.CodePages.FR_AZERTY = FR_AZERTY;
})();
(function(){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BasicTextInput = function (_Primrose$Text$Comman) {
  _inherits(BasicTextInput, _Primrose$Text$Comman);

  function BasicTextInput(additionalName, additionalCommands) {
    _classCallCheck(this, BasicTextInput);

    var commands = {
      NORMAL_LEFTARROW: function NORMAL_LEFTARROW(prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPLEFT: function NORMAL_SKIPLEFT(prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_RIGHTARROW: function NORMAL_RIGHTARROW(prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPRIGHT: function NORMAL_SKIPRIGHT(prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.frontCursor);
      },
      NORMAL_HOME: function NORMAL_HOME(prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.frontCursor);
      },
      NORMAL_END: function NORMAL_END(prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.frontCursor);
      },
      NORMAL_BACKSPACE: function NORMAL_BACKSPACE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.left(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
        emit.call(prim, "change", {
          target: prim
        });
      },
      NORMAL_DELETE: function NORMAL_DELETE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.backCursor.right(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_TAB: function NORMAL_TAB(prim, tokenRows) {
        prim.selectedText = prim.tabString;
      },

      SHIFT_LEFTARROW: function SHIFT_LEFTARROW(prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPLEFT: function SHIFT_SKIPLEFT(prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.backCursor);
      },
      SHIFT_RIGHTARROW: function SHIFT_RIGHTARROW(prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPRIGHT: function SHIFT_SKIPRIGHT(prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.backCursor);
      },
      SHIFT_HOME: function SHIFT_HOME(prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.backCursor);
      },
      SHIFT_END: function SHIFT_END(prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.backCursor);
      },
      SHIFT_DELETE: function SHIFT_DELETE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.home(tokenRows);
          prim.backCursor.end(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      CTRL_HOME: function CTRL_HOME(prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.frontCursor);
      },
      CTRL_END: function CTRL_END(prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.frontCursor);
      },

      CTRLSHIFT_HOME: function CTRLSHIFT_HOME(prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.backCursor);
      },
      CTRLSHIFT_END: function CTRLSHIFT_END(prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.backCursor);
      },

      SELECT_ALL: function SELECT_ALL(prim, tokenRows) {
        prim.frontCursor.fullhome(tokenRows);
        prim.backCursor.fullend(tokenRows);
      },

      REDO: function REDO(prim, tokenRows) {
        prim.redo();
        prim.scrollIntoView(prim.frontCursor);
      },
      UNDO: function UNDO(prim, tokenRows) {
        prim.undo();
        prim.scrollIntoView(prim.frontCursor);
      }
    };

    if (additionalCommands) {
      for (var key in additionalCommands) {
        commands[key] = additionalCommands[key];
      }
    }

    return _possibleConstructorReturn(this, Object.getPrototypeOf(BasicTextInput).call(this, additionalName || "Text editor commands", commands));
  }

  return BasicTextInput;
}(Primrose.Text.CommandPack);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy9CYXNpY1RleHRJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7QUFFQSxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsNEJBREc7QUFFWCxRQUFNLFdBRks7QUFHWCxhQUFXLDJCQUhBO0FBSVgsZUFBYTtBQUpGLENBQWI7O0lBTU0sYzs7O0FBQ0osMEJBQVksY0FBWixFQUE0QixrQkFBNUIsRUFBZ0Q7QUFBQTs7QUFDOUMsUUFBSSxXQUFXO0FBQ2Isd0JBQWtCLDBCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDM0MsYUFBSyxVQUFMLENBQWdCLFNBQWhCLEVBQTJCLEtBQUssV0FBaEM7QUFDRCxPQUhZO0FBSWIsdUJBQWlCLHlCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDMUMsYUFBSyxjQUFMLENBQW9CLFNBQXBCLEVBQStCLEtBQUssV0FBcEM7QUFDRCxPQU5ZO0FBT2IseUJBQW1CLDJCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDNUMsYUFBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLEtBQUssV0FBakM7QUFDRCxPQVRZO0FBVWIsd0JBQWtCLDBCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDM0MsYUFBSyxlQUFMLENBQXFCLFNBQXJCLEVBQWdDLEtBQUssV0FBckM7QUFDRCxPQVpZO0FBYWIsbUJBQWEscUJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUN0QyxhQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxXQUFoQztBQUNELE9BZlk7QUFnQmIsa0JBQVksb0JBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUNyQyxhQUFLLFNBQUwsQ0FBZSxTQUFmLEVBQTBCLEtBQUssV0FBL0I7QUFDRCxPQWxCWTtBQW1CYix3QkFBa0IsMEJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMzQyxZQUFJLEtBQUssV0FB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Q0FBbUIsU0FBbkIsRUFBOEIsS0FBSyxVQUFuQztBQUNELE9BaEZZOztBQWtGYixrQkFBWSxvQkFBVSxJQUFWLEVBQWdCLFNBQWhCLEVBQTJCO0FBQ3JDLGFBQUssV0FBTCxDQUFpQixRQUFqQixDQUEwQixTQUExQjtBQUNBLGFBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixTQUF4QjtBQUNELE9BckZZOztBQXVGYixZQUFNLGNBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMvQixhQUFLLElBQUw7QUFDQSxhQUFLLGNBQUwsQ0FBb0IsS0FBSyxXQUF6QjtBQUNELE9BMUZZO0FBMkZiLFlBQU0sY0FBVSxJQUFWLEVBQWdCLFNBQWhCLEVBQTJCO0FBQy9CLGFBQUssSUFBTDtBQUNBLGFBQUssY0FBTCxDQUFvQixLQUFLLFdBQXpCO0FBQ0Q7QUE5RlksS0FBZjs7QUFpR0EsUUFBSSxrQkFBSixFQUF3QjtBQUN0QixXQUFLLElBQUksR0FBVCxJQUFnQixrQkFBaEIsRUFBb0M7QUFDbEMsaUJBQVMsR0FBVCxJQUFnQixtQkFBbUIsR0FBbkIsQ0FBaEI7QUFDRDtBQUNGOztBQXRHNkMsNkZBd0d4QyxrQkFBa0Isc0JBeEdzQixFQXdHRSxRQXhHRjtBQXlHL0M7OztFQTFHMEIsU0FBUyxJQUFULENBQWMsVyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db21tYW5kUGFja3MvQmFzaWNUZXh0SW5wdXQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.BasicTextInput = BasicTextInput;
})();
(function(){
"use strict";

var TextEditor = new Primrose.Text.CommandPacks.BasicTextInput("Text Area input commands", {
  NORMAL_UPARROW: function NORMAL_UPARROW(prim, tokenRows) {
    prim.cursorUp(tokenRows, prim.frontCursor);
  },
  NORMAL_DOWNARROW: function NORMAL_DOWNARROW(prim, tokenRows) {
    prim.cursorDown(tokenRows, prim.frontCursor);
  },
  NORMAL_PAGEUP: function NORMAL_PAGEUP(prim, tokenRows) {
    prim.cursorPageUp(tokenRows, prim.frontCursor);
  },
  NORMAL_PAGEDOWN: function NORMAL_PAGEDOWN(prim, tokenRows) {
    prim.cursorPageDown(tokenRows, prim.frontCursor);
  },
  NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
    var indent = "";
    var tokenRow = tokenRows[prim.frontCursor.y];
    if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
      indent = tokenRow[0].value;
    }
    prim.selectedText = "\n" + indent;
    prim.scrollIntoView(prim.frontCursor);
  },

  SHIFT_UPARROW: function SHIFT_UPARROW(prim, tokenRows) {
    prim.cursorUp(tokenRows, prim.backCursor);
  },
  SHIFT_DOWNARROW: function SHIFT_DOWNARROW(prim, tokenRows) {
    prim.cursorDown(tokenRows, prim.backCursor);
  },
  SHIFT_PAGEUP: function SHIFT_PAGEUP(prim, tokenRows) {
    prim.cursorPageUp(tokenRows, prim.backCursor);
  },
  SHIFT_PAGEDOWN: function SHIFT_PAGEDOWN(prim, tokenRows) {
    prim.cursorPageDown(tokenRows, prim.backCursor);
  },

  WINDOW_SCROLL_DOWN: function WINDOW_SCROLL_DOWN(prim, tokenRows) {
    if (prim.scroll.y < tokenRows.length) {
      ++prim.scroll.y;
    }
  },
  WINDOW_SCROLL_UP: function WINDOW_SCROLL_UP(prim, tokenRows) {
    if (prim.scroll.y > 0) {
      --prim.scroll.y;
    }
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy9UZXh0RWRpdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSw0QkFERztBQUVYLFFBQU0sWUFGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxhQUFhLElBQUksU0FBUyxJQUFULENBQWMsWUFBZCxDQUEyQixjQUEvQixDQUNqQiwwQkFEaUIsRUFDVztBQUMxQixrQkFBZ0Isd0JBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUN6QyxTQUFLLFFBQUwsQ0FBYyxTQUFkLEVBQXlCLEtBQUssV0FBOUI7QUFDRCxHQUh5QjtBQUkxQixvQkFBa0IsMEJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMzQyxTQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxXQUFoQztBQUNELEdBTnlCO0FBTzFCLGlCQUFlLHVCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDeEMsU0FBSyxZQUFMLENBQWtCLFNBQWxCLEVBQTZCLEtBQUssV0FBbEM7QUFDRCxHQVR5QjtBQVUxQixtQkFBaUIseUJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMxQyxTQUFLLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsS0FBSyxXQUFwQztBQUNELEdBWnlCO0FBYTFCLGdCQUFjLHNCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkIsWUFBM0IsRUFBeUM7QUFDckQsUUFBSSxTQUFTLEVBQWI7QUFDQSxRQUFJLFdBQVcsVUFBVSxLQUFLLFdBQUwsQ0FBaUIsQ0FBM0IsQ0FBZjtBQUNBLFFBQUksU0FBUyxNQUFULEdBQWtCLENBQWxCLElBQXVCLFNBQVMsQ0FBVCxFQUFZLElBQVosS0FBcUIsWUFBaEQsRUFBOEQ7QUFDNUQsZUFBUyxTQUFTLENBQVQsRUFBWSxLQUFyQjtBQUNEO0FBQ0QsU0FBSyxZQUFMLEdBQW9CLE9BQU8sTUFBM0I7QUFDQSxTQUFLLGNBQUwsQ0FBb0IsS0FBSyxXQUF6QjtBQUNELEdBckJ5Qjs7QUF1QjFCLGlCQUFlLHVCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDeEMsU0FBSyxRQUFMLENBQWMsU0FBZCxFQUF5QixLQUFLLFVBQTlCO0FBQ0QsR0F6QnlCO0FBMEIxQixtQkFBaUIseUJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUMxQyxTQUFLLFVBQUwsQ0FBZ0IsU0FBaEIsRUFBMkIsS0FBSyxVQUFoQztBQUNELEdBNUJ5QjtBQTZCMUIsZ0JBQWMsc0JBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUN2QyxTQUFLLFlBQUwsQ0FBa0IsU0FBbEIsRUFBNkIsS0FBSyxVQUFsQztBQUNELEdBL0J5QjtBQWdDMUIsa0JBQWdCLHdCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDekMsU0FBSyxjQUFMLENBQW9CLFNBQXBCLEVBQStCLEtBQUssVUFBcEM7QUFDRCxHQWxDeUI7O0FBb0MxQixzQkFBb0IsNEJBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUM3QyxRQUFJLEtBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsVUFBVSxNQUE5QixFQUFzQztBQUNwQyxRQUFFLEtBQUssTUFBTCxDQUFZLENBQWQ7QUFDRDtBQUNGLEdBeEN5QjtBQXlDMUIsb0JBQWtCLDBCQUFVLElBQVYsRUFBZ0IsU0FBaEIsRUFBMkI7QUFDM0MsUUFBSSxLQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLENBQXBCLEVBQXVCO0FBQ3JCLFFBQUUsS0FBSyxNQUFMLENBQVksQ0FBZDtBQUNEO0FBQ0Y7QUE3Q3lCLENBRFgsQ0FBbkIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29tbWFuZFBhY2tzL1RleHRFZGl0b3IuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.TextEditor = TextEditor;
})();
(function(){
////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
"use strict";

var TextInput = new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbW1hbmRQYWNrcy9UZXh0SW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSw0QkFERztBQUVYLFFBQU0sV0FGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxZQUFZLElBQUksU0FBUyxJQUFULENBQWMsWUFBZCxDQUEyQixjQUEvQixDQUE4QywwQkFBOUMsQ0FBbEIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29tbWFuZFBhY2tzL1RleHRJbnB1dC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.TextInput = TextInput;
})();
(function(){
"use strict";

function PlainText(text, size, fgcolor, bgcolor, x, y, z, hAlign) {
  text = text.replace(/\r\n/g, "\n");
  var lines = text.split("\n");
  hAlign = hAlign || "center";
  var lineHeight = size * 1000;
  var boxHeight = lineHeight * lines.length;

  var textCanvas = document.createElement("canvas");
  var textContext = textCanvas.getContext("2d");
  textContext.font = lineHeight + "px Arial";
  var width = textContext.measureText(text).width;

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

  var textGeometry = new THREE.PlaneGeometry(size * width / lineHeight, size * lines.length);
  textGeometry.computeBoundingBox();
  textGeometry.computeVertexNormals();

  var textMesh = new THREE.Mesh(textGeometry, material);
  if (hAlign === "left") {
    x -= textGeometry.boundingBox.min.x;
  } else if (hAlign === "right") {
    x += textGeometry.boundingBox.min.x;
  }
  textMesh.position.set(x, y, z);
  return textMesh;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzL1BsYWluVGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsd0JBREU7QUFFUixRQUFNLFdBRkU7QUFHUixlQUFhO0FBSEwsQ0FBWjs7QUFNQSxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsT0FBL0IsRUFBd0MsT0FBeEMsRUFBaUQsQ0FBakQsRUFBb0QsQ0FBcEQsRUFBdUQsQ0FBdkQsRUFBMEQsTUFBMUQsRUFBa0U7QUFDaEUsU0FBTyxLQUFLLE9BQUwsQ0FBYSxPQUFiLEVBQXNCLElBQXRCLENBQVA7QUFDQSxNQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFaO0FBQ0EsV0FBUyxVQUFVLFFBQW5CO0FBQ0EsTUFBSSxhQUFjLE9BQU8sSUFBekI7QUFDQSxNQUFJLFlBQVksYUFBYSxNQUFNLE1BQW5DOztBQUVBLE1BQUksYUFBYSxTQUFTLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBakI7QUFDQSxNQUFJLGNBQWMsV0FBVyxVQUFYLENBQXNCLElBQXRCLENBQWxCO0FBQ0EsY0FBWSxJQUFaLEdBQW1CLGFBQWEsVUFBaEM7QUFDQSxNQUFJLFFBQVEsWUFBWSxXQUFaLENBQXdCLElBQXhCLEVBQ1QsS0FESDs7QUFHQSxhQUFXLEtBQVgsR0FBbUIsS0FBbkI7QUFDQSxhQUFXLE1BQVgsR0FBb0IsU0FBcEI7QUFDQSxjQUFZLElBQVosR0FBbUIsYUFBYSxHQUFiLEdBQW1CLFVBQXRDO0FBQ0EsTUFBSSxZQUFZLGFBQWhCLEVBQStCO0FBQzdCLGdCQUFZLFNBQVosR0FBd0IsT0FBeEI7QUFDQSxnQkFBWSxRQUFaLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLEVBQTJCLFdBQVcsS0FBdEMsRUFBNkMsV0FBVyxNQUF4RDtBQUNEO0FBQ0QsY0FBWSxTQUFaLEdBQXdCLE9BQXhCOztBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEVBQUUsQ0FBcEMsRUFBdUM7QUFDckMsZ0JBQVksUUFBWixDQUFxQixNQUFNLENBQU4sQ0FBckIsRUFBK0IsQ0FBL0IsRUFBa0MsSUFBSSxVQUF0QztBQUNEOztBQUVELE1BQUksVUFBVSxJQUFJLE1BQU0sT0FBVixDQUFrQixVQUFsQixDQUFkO0FBQ0EsVUFBUSxXQUFSLEdBQXNCLElBQXRCOztBQUVBLE1BQUksV0FBVyxJQUFJLE1BQU0saUJBQVYsQ0FBNEI7QUFDekMsU0FBSyxPQURvQztBQUV6QyxpQkFBYSxZQUFZLGFBRmdCO0FBR3pDLDBCQUFzQixLQUhtQjtBQUl6QyxXQUFPLFFBSmtDO0FBS3pDLGFBQVMsTUFBTTtBQUwwQixHQUE1QixDQUFmOztBQVFBLE1BQUksZUFBZSxJQUFJLE1BQU0sYUFBVixDQUF3QixPQUFPLEtBQVAsR0FBZSxVQUF2QyxFQUNqQixPQUFPLE1BQU0sTUFESSxDQUFuQjtBQUVBLGVBQWEsa0JBQWI7QUFDQSxlQUFhLG9CQUFiOztBQUVBLE1BQUksV0FBVyxJQUFJLE1BQU0sSUFBVixDQUFlLFlBQWYsRUFBNkIsUUFBN0IsQ0FBZjtBQUNBLE1BQUksV0FBVyxNQUFmLEVBQXVCO0FBQ3JCLFNBQUssYUFBYSxXQUFiLENBQXlCLEdBQXpCLENBQTZCLENBQWxDO0FBQ0QsR0FGRCxNQUdLLElBQUksV0FBVyxPQUFmLEVBQXdCO0FBQzNCLFNBQUssYUFBYSxXQUFiLENBQXlCLEdBQXpCLENBQTZCLENBQWxDO0FBQ0Q7QUFDRCxXQUFTLFFBQVQsQ0FBa0IsR0FBbEIsQ0FBc0IsQ0FBdEIsRUFBeUIsQ0FBekIsRUFBNEIsQ0FBNUI7QUFDQSxTQUFPLFFBQVA7QUFDRCIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db250cm9scy9QbGFpblRleHQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Controls.PlainText = PlainText;
})();
(function(){
"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCROLL_SCALE = isFirefox ? 3 : 100,
    COUNTER = 0,
    OFFSET = 5;

var TextBox = function (_Primrose$Surface) {
  _inherits(TextBox, _Primrose$Surface);

  _createClass(TextBox, null, [{
    key: "create",
    value: function create() {
      return new TextBox();
    }
  }]);

  function TextBox(options) {
    _classCallCheck(this, TextBox);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextBox).call(this, patch(options, {
      id: "Primrose.Text.Controls.TextBox[" + COUNTER++ + "]"
    })));

    _this.listeners.change = [];
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    if (typeof options === "string") {
      _this.options = {
        value: _this.options
      };
    } else {
      _this.options = options || {};
    }

    _this.useCaching = !isFirefox || !isMobile;

    var makeCursorCommand = function makeCursorCommand(name) {
      var method = name.toLowerCase();
      this["cursor" + name] = function (lines, cursor) {
        cursor[method](lines);
        this.scrollIntoView(cursor);
      };
    };

    ["Left", "Right", "SkipLeft", "SkipRight", "Up", "Down", "Home", "End", "FullHome", "FullEnd"].map(makeCursorCommand.bind(_this));

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    _this.tokens = null;
    _this.lines = null;
    _this._commandPack = null;
    _this._tokenRows = null;
    _this._tokenHashes = null;
    _this._tabString = null;
    _this._currentTouchID = null;
    _this._lineCountWidth = null;

    _this._lastFont = null;
    _this._lastText = null;
    _this._lastCharacterWidth = null;
    _this._lastCharacterHeight = null;
    _this._lastGridBounds = null;
    _this._lastPadding = null;
    _this._lastFrontCursor = null;
    _this._lastBackCursor = null;
    _this._lastWidth = -1;
    _this._lastHeight = -1;
    _this._lastScrollX = -1;
    _this._lastScrollY = -1;
    _this._lastFocused = false;
    _this._lastThemeName = null;
    _this._lastPointer = new Primrose.Text.Point();

    // different browsers have different sets of keycodes for less-frequently
    // used keys like curly brackets.
    _this._browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
    _this._pointer = new Primrose.Text.Point();
    _this._deadKeyState = "";
    _this._history = [];
    _this._historyFrame = -1;
    _this._topLeftGutter = new Primrose.Text.Size();
    _this._bottomRightGutter = new Primrose.Text.Size();
    _this._dragging = false;
    _this._scrolling = false;
    _this._wheelScrollSpeed = 4;
    var subBounds = new Primrose.Text.Rectangle(0, 0, _this.bounds.width, _this.bounds.height);
    _this._fg = new Primrose.Surface({
      id: _this.id + "-fore",
      bounds: subBounds
    });
    _this._fgCanvas = _this._fg.canvas;
    _this._fgfx = _this._fg.context;
    _this._bg = new Primrose.Surface({
      id: _this.id + "-back",
      bounds: subBounds
    });
    _this._bgCanvas = _this._bg.canvas;
    _this._bgfx = _this._bg.context;
    _this._trim = new Primrose.Surface({
      id: _this.id + "-trim",
      bounds: subBounds
    });
    _this._trimCanvas = _this._trim.canvas;
    _this._tgfx = _this._trim.context;
    _this._rowCache = {};
    _this._VSCROLL_WIDTH = 2;

    _this.tabWidth = _this.options.tabWidth;
    _this.showLineNumbers = !_this.options.hideLineNumbers;
    _this.showScrollBars = !_this.options.hideScrollBars;
    _this.wordWrap = !_this.options.disableWordWrap;
    _this.readOnly = !!_this.options.readOnly;
    _this.multiline = !_this.options.singleLine;
    _this.gridBounds = new Primrose.Text.Rectangle();
    _this.frontCursor = new Primrose.Text.Cursor();
    _this.backCursor = new Primrose.Text.Cursor();
    _this.scroll = new Primrose.Text.Point();
    _this.character = new Primrose.Text.Size();
    _this.theme = _this.options.theme;
    _this.fontSize = _this.options.fontSize;
    _this.tokenizer = _this.options.tokenizer;
    _this.commandPack = _this.options.commands || Primrose.Text.CommandPacks.TextEditor;
    _this.value = _this.options.value;
    _this.padding = _this.options.padding || 1;

    _this.addEventListener("focus", _this.render.bind(_this), false);
    _this.addEventListener("blur", _this.render.bind(_this), false);
    return _this;
  }

  _createClass(TextBox, [{
    key: "cursorPageUp",
    value: function cursorPageUp(lines, cursor) {
      cursor.incY(-this.gridBounds.height, lines);
      this.scrollIntoView(cursor);
    }
  }, {
    key: "cursorPageDown",
    value: function cursorPageDown(lines, cursor) {
      cursor.incY(this.gridBounds.height, lines);
      this.scrollIntoView(cursor);
    }
  }, {
    key: "setDeadKeyState",
    value: function setDeadKeyState(st) {
      this._deadKeyState = st || "";
    }
  }, {
    key: "pushUndo",
    value: function pushUndo(lines) {
      if (this._historyFrame < this._history.length - 1) {
        this._history.splice(this._historyFrame + 1);
      }
      this._history.push(lines);
      this._historyFrame = this._history.length - 1;
      this.refreshTokens();
      this.render();
    }
  }, {
    key: "redo",
    value: function redo() {
      if (this._historyFrame < this._history.length - 1) {
        ++this._historyFrame;
      }
      this.refreshTokens();
      this.fixCursor();
      this.render();
    }
  }, {
    key: "undo",
    value: function undo() {
      if (this._historyFrame > 0) {
        --this._historyFrame;
      }
      this.refreshTokens();
      this.fixCursor();
      this.render();
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(currentCursor) {
      this.scroll.y += this.minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
      if (!this.wordWrap) {
        this.scroll.x += this.minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width);
      }
      this.clampScroll();
    }
  }, {
    key: "readWheel",
    value: function readWheel(evt) {
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
  }, {
    key: "startPointer",
    value: function startPointer(x, y) {
      if (!_get(Object.getPrototypeOf(TextBox.prototype), "startPointer", this).call(this, x, y)) {
        this._dragging = true;
        this.setCursorXY(this.frontCursor, x, y);
      }
    }
  }, {
    key: "movePointer",
    value: function movePointer(x, y) {
      if (this._dragging) {
        this.setCursorXY(this.backCursor, x, y);
      }
    }
  }, {
    key: "endPointer",
    value: function endPointer() {
      _get(Object.getPrototypeOf(TextBox.prototype), "endPointer", this).call(this);
      this._dragging = false;
      this._scrolling = false;
    }
  }, {
    key: "copySelectedText",
    value: function copySelectedText(evt) {
      if (this.focused && this.frontCursor.i !== this.backCursor.i) {
        var clipboard = evt.clipboardData || window.clipboardData;
        clipboard.setData(window.clipboardData ? "Text" : "text/plain", this.selectedText);
        evt.returnValue = false;
      }
    }
  }, {
    key: "cutSelectedText",
    value: function cutSelectedText(evt) {
      if (this.focused) {
        this.copySelectedText(evt);
        if (!this.readOnly) {
          this.selectedText = "";
        }
      }
    }
  }, {
    key: "execCommand",
    value: function execCommand(browser, codePage, commandName) {
      if (commandName && this.focused && !this.readOnly) {
        var altCommandName = browser + "_" + commandName,
            func = this.commandPack[altCommandName] || this.commandPack[commandName] || codePage[altCommandName] || codePage[commandName];

        if (func instanceof String || typeof func === "string") {
          console.log("okay");
          func = this.commandPack[func] || this.commandPack[func] || func;
        }

        if (func === undefined) {
          return false;
        } else {
          this.frontCursor.moved = false;
          this.backCursor.moved = false;
          if (func instanceof Function) {
            func(this, this.lines);
          } else if (func instanceof String || typeof func === "string") {
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
  }, {
    key: "readClipboard",
    value: function readClipboard(evt) {
      if (this.focused && !this.readOnly) {
        evt.returnValue = false;
        var clipboard = evt.clipboardData || window.clipboardData,
            str = clipboard.getData(window.clipboardData ? "Text" : "text/plain");
        if (str) {
          this.selectedText = str;
        }
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      _get(Object.getPrototypeOf(TextBox.prototype), "resize", this).call(this);
      this._bg.setSize(this.surfaceWidth, this.surfaceHeight);
      this._fg.setSize(this.surfaceWidth, this.surfaceHeight);
      this._trim.setSize(this.surfaceWidth, this.surfaceHeight);
      if (this.theme) {
        this.character.height = this.fontSize;
        this.context.font = this.character.height + "px " + this.theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
      }
      this.render();
    }
  }, {
    key: "pixel2cell",
    value: function pixel2cell(point) {
      var x = point.x * this.imageWidth / this.surfaceWidth,
          y = point.y * this.imageHeight / this.surfaceHeight;
      point.set(Math.round(point.x / this.character.width) + this.scroll.x - this.gridBounds.x, Math.floor(point.y / this.character.height - 0.25) + this.scroll.y);
    }
  }, {
    key: "clampScroll",
    value: function clampScroll() {
      if (this.scroll.y < 0) {
        this.scroll.y = 0;
      } else {
        while (0 < this.scroll.y && this.scroll.y > this.lines.length - this.gridBounds.height) {
          --this.scroll.y;
        }
      }
    }
  }, {
    key: "refreshTokens",
    value: function refreshTokens() {
      this.tokens = this.tokenizer.tokenize(this.value);
    }
  }, {
    key: "fixCursor",
    value: function fixCursor() {
      var moved = this.frontCursor.fixCursor(this.lines) || this.backCursor.fixCursor(this.lines);
      if (moved) {
        this.render();
      }
    }
  }, {
    key: "setCursorXY",
    value: function setCursorXY(cursor, x, y) {
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
      } else if (this._scrolling || onRight && !onBottom) {
        this._scrolling = true;
        var scrollHeight = this.lines.length - this.gridBounds.height;
        if (gy >= 0 && scrollHeight >= 0) {
          var sy = gy * scrollHeight / this.gridBounds.height;
          this.scroll.y = Math.floor(sy);
        }
      } else if (onBottom && !onLeft) {
        var maxWidth = 0;
        for (var dy = 0; dy < this.lines.length; ++dy) {
          maxWidth = Math.max(maxWidth, this.lines[dy].length);
        }
        var scrollWidth = maxWidth - this.gridBounds.width;
        if (gx >= 0 && scrollWidth >= 0) {
          var sx = gx * scrollWidth / this.gridBounds.width;
          this.scroll.x = Math.floor(sx);
        }
      } else if (onLeft && !onBottom) {
        // clicked in number-line gutter
      } else {
          // clicked in the lower-left corner
        }
      this._lastPointer.copy(this._pointer);
      this.render();
    }
  }, {
    key: "mouseButtonDown",
    value: function mouseButtonDown(evt) {
      if (evt.button === 0) {
        this.startDOMPointer(evt);
        evt.preventDefault();
      }
    }
  }, {
    key: "mouseMove",
    value: function mouseMove(evt) {
      if (this.focused) {
        this.moveDOMPointer(evt);
      }
    }
  }, {
    key: "mouseButtonUp",
    value: function mouseButtonUp(evt) {
      if (this.focused && evt.button === 0) {
        this.endPointer();
      }
    }
  }, {
    key: "touchStart",
    value: function touchStart(evt) {
      if (this.focused && evt.touches.length > 0 && !this._dragging) {
        var t = evt.touches[0];
        this.startDOMPointer(t);
        this._currentTouchID = t.identifier;
      }
    }
  }, {
    key: "touchMove",
    value: function touchMove(evt) {
      for (var i = 0; i < evt.changedTouches.length && this._dragging; ++i) {
        var t = evt.changedTouches[i];
        if (t.identifier === this._currentTouchID) {
          this.moveDOMPointer(t);
          break;
        }
      }
    }
  }, {
    key: "touchEnd",
    value: function touchEnd(evt) {
      for (var i = 0; i < evt.changedTouches.length && this._dragging; ++i) {
        var t = evt.changedTouches[i];
        if (t.identifier === this._currentTouchID) {
          this.endPointer();
        }
      }
    }
  }, {
    key: "setGutter",
    value: function setGutter() {
      if (this.showLineNumbers) {
        this._topLeftGutter.width = 1;
      } else {
        this._topLeftGutter.width = 0;
      }

      if (!this.showScrollBars) {
        this._bottomRightGutter.set(0, 0);
      } else if (this.wordWrap) {
        this._bottomRightGutter.set(this._VSCROLL_WIDTH, 0);
      } else {
        this._bottomRightGutter.set(this._VSCROLL_WIDTH, 1);
      }
    }
  }, {
    key: "refreshGridBounds",
    value: function refreshGridBounds() {
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
  }, {
    key: "performLayout",
    value: function performLayout() {

      // group the tokens into rows
      this._tokenRows = [[]];
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
  }, {
    key: "minDelta",
    value: function minDelta(v, minV, maxV) {
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
  }, {
    key: "fillRect",
    value: function fillRect(gfx, fill, x, y, w, h) {
      gfx.fillStyle = fill;
      gfx.fillRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
  }, {
    key: "strokeRect",
    value: function strokeRect(gfx, stroke, x, y, w, h) {
      gfx.strokeStyle = stroke;
      gfx.strokeRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
  }, {
    key: "renderCanvasBackground",
    value: function renderCanvasBackground() {
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
      this._bgfx.translate((this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, -this.scroll.y * this.character.height + this.padding);

      // draw the current row highlighter
      if (this.focused) {
        this.fillRect(this._bgfx, this.theme.regular.currentRowBackColor || Primrose.Text.Themes.Default.regular.currentRowBackColor, 0, minCursor.y + OFFSETY, this.gridBounds.width, maxCursor.y - minCursor.y + 1);
      }

      for (var y = 0; y < this._tokenRows.length; ++y) {
        // draw the tokens on this row
        var row = this._tokenRows[y];

        for (var i = 0; i < row.length; ++i) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height && this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x + this.gridBounds.width) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i;
            if (inSelection) {
              var selectionFront = Primrose.Text.Cursor.max(minCursor, tokenFront);
              var selectionBack = Primrose.Text.Cursor.min(maxCursor, tokenBack);
              var cw = selectionBack.i - selectionFront.i;
              this.fillRect(this._bgfx, this.theme.regular.selectedBackColor || Primrose.Text.Themes.Default.regular.selectedBackColor, selectionFront.x, selectionFront.y + OFFSETY, cw, 1);
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
  }, {
    key: "renderCanvasForeground",
    value: function renderCanvasForeground() {
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
          if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height && this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x + this.gridBounds.width) {

            // draw the text
            if (this.useCaching && this._rowCache[line] !== undefined) {
              if (i === 0) {
                this._fgfx.putImageData(this._rowCache[line], this.padding, textY + this.padding + OFFSET);
              }
            } else {
              var style = this.theme[t.type] || {};
              var font = (style.fontWeight || this.theme.regular.fontWeight || "") + " " + (style.fontStyle || this.theme.regular.fontStyle || "") + " " + this.character.height + "px " + this.theme.fontFamily;
              this._fgfx.font = font.trim();
              this._fgfx.fillStyle = style.foreColor || this.theme.regular.foreColor;
              this.drawText(this._fgfx, t.value, tokenFront.x * this.character.width, textY);
              drawn = true;
            }
          }

          tokenFront.copy(tokenBack);
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy(tokenFront);
        if (this.useCaching && drawn && this._rowCache[line] === undefined) {
          this._rowCache[line] = this._fgfx.getImageData(this.padding, textY + this.padding + OFFSET, this.imageWidth - 2 * this.padding, this.character.height);
        }
      }

      this._fgfx.restore();
    }

    // provides a hook for TextInput to be able to override text drawing and spit out password blanking characters

  }, {
    key: "drawText",
    value: function drawText(ctx, txt, x, y) {
      ctx.fillText(txt, x, y);
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {
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
          this.fillRect(this._tgfx, this.theme.regular.selectedBackColor || Primrose.Text.Themes.Default.regular.selectedBackColor, 0, y, this.gridBounds.x, 1);
          this._tgfx.font = "bold " + this.character.height + "px " + this.theme.fontFamily;

          if (currentLine > lastLine) {
            this._tgfx.fillStyle = this.theme.regular.foreColor;
            this._tgfx.fillText(lineNumber, 0, y * this.character.height);
          }
          lastLine = currentLine;
        }
      }

      this._tgfx.restore();

      if (this.showLineNumbers) {
        this.strokeRect(this._tgfx, this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor, 0, 0, this.gridBounds.x, this.gridBounds.height);
      }

      // draw the scrollbars
      if (this.showScrollBars) {
        var drawWidth = this.gridBounds.width * this.character.width - this.padding,
            drawHeight = this.gridBounds.height * this.character.height,
            scrollX = this.scroll.x * drawWidth / maxLineWidth + this.gridBounds.x * this.character.width,
            scrollY = this.scroll.y * drawHeight / this._tokenRows.length;

        this._tgfx.fillStyle = this.theme.regular.selectedBackColor || Primrose.Text.Themes.Default.regular.selectedBackColor;
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
  }, {
    key: "render",
    value: function render() {
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
            changeBounds = new Primrose.Text.Rectangle(0, top * this.character.height, this.bounds.width, (bottom - top) * this.character.height + 2);
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
  }, {
    key: "value",
    get: function get() {
      return this._history[this._historyFrame].join("\n");
    },
    set: function set(txt) {
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
  }, {
    key: "selectedText",
    get: function get() {
      var minCursor = Primrose.Text.Cursor.min(this.frontCursor, this.backCursor),
          maxCursor = Primrose.Text.Cursor.max(this.frontCursor, this.backCursor);
      return this.value.substring(minCursor.i, maxCursor.i);
    },
    set: function set(str) {
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
  }, {
    key: "padding",
    get: function get() {
      return this._padding;
    },
    set: function set(v) {
      this._padding = v;
      this.render();
    }
  }, {
    key: "wordWrap",
    get: function get() {
      return this._wordWrap;
    },
    set: function set(v) {
      this._wordWrap = v || false;
      this.setGutter();
    }
  }, {
    key: "showLineNumbers",
    get: function get() {
      return this._showLineNumbers;
    },
    set: function set(v) {
      this._showLineNumbers = v;
      this.setGutter();
    }
  }, {
    key: "showScrollBars",
    get: function get() {
      return this._showScrollBars;
    },
    set: function set(v) {
      this._showScrollBars = v;
      this.setGutter();
    }
  }, {
    key: "theme",
    get: function get() {
      return this._theme;
    },
    set: function set(t) {
      this._theme = clone(t || Primrose.Text.Themes.Default);
      this._theme.fontSize = this.fontSize;
      this._rowCache = {};
      this.render();
    }
  }, {
    key: "commandPack",
    get: function get() {
      return this._commandPack;
    },
    set: function set(v) {
      this._commandPack = v;
    }
  }, {
    key: "selectionStart",
    get: function get() {
      return this.frontCursor.i;
    },
    set: function set(i) {
      this.frontCursor.setI(i, this.lines);
    }
  }, {
    key: "selectionEnd",
    get: function get() {
      return this.backCursor.i;
    },
    set: function set(i) {
      this.backCursor.setI(i, this.lines);
    }
  }, {
    key: "selectionDirection",
    get: function get() {
      return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
    }
  }, {
    key: "tokenizer",
    get: function get() {
      return this._tokenizer;
    },
    set: function set(tk) {
      this._tokenizer = tk || Primrose.Text.Grammars.JavaScript;
      if (this._history && this._history.length > 0) {
        this.refreshTokens();
        this.render();
      }
    }
  }, {
    key: "tabWidth",
    get: function get() {
      return this._tabWidth;
    },
    set: function set(tw) {
      this._tabWidth = tw || 2;
      this._tabString = "";
      for (var i = 0; i < this._tabWidth; ++i) {
        this._tabString += " ";
      }
    }
  }, {
    key: "tabString",
    get: function get() {
      return this._tabString;
    }
  }, {
    key: "fontSize",
    get: function get() {
      return this._fontSize || 16;
    },
    set: function set(v) {
      v = v || 16;
      this._fontSize = v;
      if (this.theme) {
        this.theme.fontSize = this._fontSize;
        this.resize();
        this.render();
      }
    }
  }, {
    key: "lockMovement",
    get: function get() {
      return this.focused && !this.readOnly;
    }
  }]);

  return TextBox;
}(Primrose.Surface);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzL1RleHRCb3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7OztBQUVBLElBQUksZUFBZSxZQUFZLENBQVosR0FBZ0IsR0FBbkM7QUFBQSxJQUNFLFVBQVUsQ0FEWjtBQUFBLElBRUUsU0FBUyxDQUZYOztBQUlBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSx3QkFERTtBQUVSLFFBQU0sU0FGRTtBQUdSLGVBQWEsc0NBSEw7QUFJUixhQUFXLGtCQUpIO0FBS1IsY0FBWSxDQUFDO0FBQ1gsVUFBTSxxQkFESztBQUVYLFVBQU0seURBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQsRUFJVDtBQUNELFVBQU0sU0FETDtBQUVELFVBQU0sUUFGTDtBQUdELGlCQUFhO0FBSFosR0FKUztBQUxKLENBQVo7O0lBZU0sTzs7Ozs7NkJBRVk7QUFDZCxhQUFPLElBQUksT0FBSixFQUFQO0FBQ0Q7OztBQUVELG1CQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSwyRkFDYixNQUFNLE9BQU4sRUFBZTtBQUNuQixVQUFJLG9DQUFxQyxTQUFyQyxHQUFrRDtBQURuQyxLQUFmLENBRGE7O0FBSW5CLFVBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsRUFBeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsUUFBSSxPQUFPLE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7QUFDL0IsWUFBSyxPQUFMLEdBQWU7QUFDYixlQUFPLE1BQUs7QUFEQyxPQUFmO0FBR0QsS0FKRCxNQUtLO0FBQ0gsWUFBSyxPQUFMLEdBQWUsV0FBVyxFQUExQjtBQUNEOztBQUVELFVBQUssVUFBTCxHQUFrQixDQUFDLFNBQUQsSUFBYyxDQUFDLFFBQWpDOztBQUVBLFFBQUksb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFVLElBQVYsRUFBZ0I7QUFDdEMsVUFBSSxTQUFTLEtBQUssV0FBTCxFQUFiO0FBQ0EsV0FBSyxXQUFXLElBQWhCLElBQXdCLFVBQVUsS0FB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Ozs7d0JBRWlCO0FBQ2hCLGFBQU8sS0FBSyxZQUFaO0FBQ0QsSztzQkFFZSxDLEVBQUc7QUFDakIsV0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0Q7Ozt3QkFFb0I7QUFDbkIsYUFBTyxLQUFLLFdBQUwsQ0FBaUIsQ0FBeEI7QUFDRCxLO3NCQUVrQixDLEVBQUc7QUFDcEIsV0FBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLENBQXRCLEVBQXlCLEtBQUssS0FBOUI7QUFDRDs7O3dCQUVrQjtBQUNqQixhQUFPLEtBQUssVUFBTCxDQUFnQixDQUF2QjtBQUNELEs7c0JBRWdCLEMsRUFBRztBQUNsQixXQUFLLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBckIsRUFBd0IsS0FBSyxLQUE3QjtBQUNEOzs7d0JBRXdCO0FBQ3ZCLGFBQU8sS0FBSyxXQUFMLENBQWlCLENBQWpCLElBQXNCLEtBQUssVUFBTCxDQUFnQixDQUF0QyxHQUEwQyxTQUExQyxHQUFzRCxVQUE3RDtBQUNEOzs7d0JBRWU7QUFDZCxhQUFPLEtBQUssVUFBWjtBQUNELEs7c0JBRWEsRSxFQUFJO0FBQ2hCLFdBQUssVUFBTCxHQUFrQixNQUFNLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsVUFBL0M7QUFDQSxVQUFJLEtBQUssUUFBTCxJQUFpQixLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLENBQTVDLEVBQStDO0FBQzdDLGFBQUssYUFBTDtBQUNBLGFBQUssTUFBTDtBQUNEO0FBQ0Y7Ozt3QkFFYztBQUNiLGFBQU8sS0FBSyxTQUFaO0FBQ0QsSztzQkFFWSxFLEVBQUk7QUFDZixXQUFLLFNBQUwsR0FBaUIsTUFBTSxDQUF2QjtBQUNBLFdBQUssVUFBTCxHQUFrQixFQUFsQjtBQUNBLFdBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxLQUFLLFNBQXpCLEVBQW9DLEVBQUUsQ0FBdEMsRUFBeUM7QUFDdkMsYUFBSyxVQUFMLElBQW1CLEdBQW5CO0FBQ0Q7QUFDRjs7O3dCQUVlO0FBQ2QsYUFBTyxLQUFLLFVBQVo7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLLFNBQUwsSUFBa0IsRUFBekI7QUFDRCxLO3NCQUVZLEMsRUFBRztBQUNkLFVBQUksS0FBSyxFQUFUO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0EsVUFBSSxLQUFLLEtBQVQsRUFBZ0I7QUFDZCxhQUFLLEtBQUwsQ0FBVyxRQUFYLEdBQXNCLEtBQUssU0FBM0I7QUFDQSxhQUFLLE1BQUw7QUFDQSxhQUFLLE1BQUw7QUFDRDtBQUNGOzs7d0JBRWtCO0FBQ2pCLGFBQU8sS0FBSyxPQUFMLElBQWdCLENBQUMsS0FBSyxRQUE3QjtBQUNEOzs7O0VBbFRtQixTQUFTLE8iLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvQ29udHJvbHMvVGV4dEJveC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Controls.TextBox = TextBox;
})();
(function(){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0;

var TextInput = function (_Primrose$Text$Contro) {
  _inherits(TextInput, _Primrose$Text$Contro);

  function TextInput(options) {
    _classCallCheck(this, TextInput);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextInput).call(this, copyObject(patch(options, {
      id: "Primrose.Text.Controls.TextInput[" + COUNTER++ + "]",
      padding: 5
    }), {
      singleLine: true,
      disableWordWrap: true,
      hideLineNumbers: true,
      hideScrollBars: true,
      tabWidth: 1,
      tokenizer: Primrose.Text.Grammars.PlainText,
      commands: Primrose.Text.CommandPacks.TextInput
    }, true)));

    _this.passwordCharacter = _this.options.passwordCharacter;
    return _this;
  }

  _createClass(TextInput, [{
    key: "drawText",
    value: function drawText(ctx, txt, x, y) {
      if (this.passwordCharacter) {
        var val = "";
        for (var i = 0; i < txt.length; ++i) {
          val += this.passwordCharacter;
        }
        txt = val;
      }
      _get(Object.getPrototypeOf(TextInput.prototype), "drawText", this).call(this, ctx, txt, x, y);
    }
  }, {
    key: "value",
    get: function get() {
      return _get(Object.getPrototypeOf(TextInput.prototype), "value", this);
    },
    set: function set(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      _set(Object.getPrototypeOf(TextInput.prototype), "value", v, this);
    }
  }, {
    key: "selectedText",
    get: function get() {
      return _get(Object.getPrototypeOf(TextInput.prototype), "selectedText", this);
    },
    set: function set(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      _set(Object.getPrototypeOf(TextInput.prototype), "selectedText", v, this);
    }
  }]);

  return TextInput;
}(Primrose.Text.Controls.TextBox);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0NvbnRyb2xzL1RleHRJbnB1dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFJLFVBQVUsQ0FBZDs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsd0JBREU7QUFFUixRQUFNLFdBRkU7QUFHUixlQUFhLHVCQUhMO0FBSVIsYUFBVyxnQ0FKSDtBQUtSLGNBQVksQ0FBQztBQUNYLFVBQU0scUJBREs7QUFFWCxVQUFNLHlEQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLFNBREw7QUFFRCxVQUFNLFFBRkw7QUFHRCxpQkFBYTtBQUhaLEdBSlM7QUFMSixDQUFaOztJQWVNLFM7OztBQUNKLHFCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQSw2RkFDYixXQUNKLE1BQU0sT0FBTixFQUFlO0FBQ2IsVUFBSSxzQ0FBdUMsU0FBdkMsR0FBb0QsR0FEM0M7QUFFYixlQUFTO0FBRkksS0FBZixDQURJLEVBSUE7QUFDRixrQkFBWSxJQURWO0FBRUYsdUJBQWlCLElBRmY7QUFHRix1QkFBaUIsSUFIZjtBQUlGLHNCQUFnQixJQUpkO0FBS0YsZ0JBQVUsQ0FMUjtBQU1GLGlCQUFXLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsU0FOaEM7QUFPRixnQkFBVSxTQUFTLElBQVQsQ0FBYyxZQUFkLENBQTJCO0FBUG5DLEtBSkEsRUFZRCxJQVpDLENBRGE7O0FBZW5CLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxPQUFMLENBQWEsaUJBQXRDO0FBZm1CO0FBZ0JwQjs7Ozs2QkFzQlEsRyxFQUFLLEcsRUFBSyxDLEVBQUcsQyxFQUFHO0FBQ3ZCLFVBQUksS0FBSyxpQkFBVCxFQUE0QjtBQUMxQixZQUFJLE1BQU0sRUFBVjtBQUNBLGFBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxJQUFJLE1BQXhCLEVBQWdDLEVBQUUsQ0FBbEMsRUFBcUM7QUFDbkMsaUJBQU8sS0FBSyxpQkFBWjtBQUNEO0FBQ0QsY0FBTSxHQUFOO0FBQ0Q7QUFDRCxvRkFBZSxHQUFmLEVBQW9CLEdBQXBCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCO0FBQ0Q7Ozt3QkE3Qlc7QUFDVjtBQUNELEs7c0JBRVMsQyxFQUFHO0FBQ1gsVUFBSSxLQUFLLEVBQVQ7QUFDQSxVQUFJLEVBQUUsT0FBRixDQUFVLFFBQVYsRUFBb0IsRUFBcEIsQ0FBSjtBQUNBLGdFQUFjLENBQWQ7QUFDRDs7O3dCQUVrQjtBQUNqQjtBQUNELEs7c0JBRWdCLEMsRUFBRztBQUNsQixVQUFJLEtBQUssRUFBVDtBQUNBLFVBQUksRUFBRSxPQUFGLENBQVUsUUFBVixFQUFvQixFQUFwQixDQUFKO0FBQ0EsdUVBQXFCLENBQXJCO0FBQ0Q7Ozs7RUFyQ3FCLFNBQVMsSUFBVCxDQUFjLFFBQWQsQ0FBdUIsTyIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9Db250cm9scy9UZXh0SW5wdXQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Controls.TextInput = TextInput;
})();
(function(){
"use strict";

// we don't use strict here because this grammar includes an interpreter that uses `eval()`

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
["strings", /"(?:\\"|[^"])*"/], ["strings", /'(?:\\'|[^'])*'/],
// Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
// Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
["keywords", /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/],
// Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
["keywords", /^DEF FN/],
// These are all treated as mathematical operations.
["operators", /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/],
// Once everything else has been matched, the left over blocks of words are treated as variable and function names.
["identifiers", /\w+\$?/]]);

var oldTokenize = Basic.tokenize;
Basic.tokenize = function (code) {
  return oldTokenize.call(this, code.toUpperCase());
};

Basic.interpret = function (sourceCode, input, output, errorOut, next, clearScreen, loadFile, done) {
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
    INT: function INT(v) {
      return v | 0;
    },
    RND: function RND() {
      return Math.random();
    },
    CLK: function CLK() {
      return Date.now() / 3600000;
    },
    LEN: function LEN(id) {
      return id.length;
    },
    LINE: function LINE() {
      return lineNumbers[counter];
    },
    TAB: function TAB(v) {
      var str = "";
      for (var i = 0; i < v; ++i) {
        str += " ";
      }
      return str;
    },
    POW: function POW(a, b) {
      return Math.pow(a, b);
    }
  };

  function toNum(ln) {
    return new Primrose.Text.Token(ln.toString(), "numbers");
  }

  function toStr(str) {
    return new Primrose.Text.Token("\"" + str.replace("\n", "\\n").replace("\"", "\\\"") + "\"", "strings");
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
    } else if (token.type !== "regular" && token.type !== "comments") {
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
        throw new Error("expected line number greater than " + lastLine + ", but received " + lineNumber + ".");
      } else if (line.length > 0) {
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
        } else if (!isNaN(op.value)) {
          return setProgramCounter([op]);
        } else if (state[op.value] || line.length > 0 && line[0].type === "operators" && line[0].value === "=") {
          line.unshift(op);
          return translate(line);
        } else {
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
      if (t.type === "identifiers" && typeof state[t.value] !== "function" && i < line.length - 1 && line[i + 1].value === "(") {
        for (var j = i + 1; j < line.length; ++j) {
          var t2 = line[j];
          if (t2.value === "(") {
            if (nest === 0) {
              t2.value = "[";
            }
            ++nest;
          } else if (t2.value === ")") {
            --nest;
            if (nest === 0) {
              t2.value = "]";
            }
          } else if (t2.value === "," && nest === 1) {
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
    } catch (exp) {
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
      } else if (t.value === ")") {
        --nest;
      }
      if (nest === 0 && t.value === ",") {
        decl = [];
        decls.push(decl);
      } else {
        decl.push(t);
      }
    }
    for (i = 0; i < decls.length; ++i) {
      decl = decls[i];
      var id = decl.shift();
      if (id.type !== "identifiers") {
        error("Identifier expected: " + id.value);
      } else {
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
          } else {
            val = new Array(sizes[0]);
            var queue = [val];
            for (j = 1; j < sizes.length; ++j) {
              var size = sizes[j];
              for (var k = 0, l = queue.length; k < l; ++k) {
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
        } else if (t.value === ";") {
          t.value = "+ \" \"";
          if (i < line.length - 1) {
            t.value += " + ";
          } else {
            endLine = "";
          }
        } else if (t.value === "(") {
          ++nest;
        } else if (t.value === ")") {
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
    while (counter < lineNumbers.length - 1 && lineNumbers[counter + 1] < lineNumber) {
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
      } else if (line[i].type === "keywords" && line[i].value === "ELSE") {
        elseIndex = i;
      }
    }
    if (thenIndex === -1) {
      error("Expected THEN clause.");
    } else {
      var condition = line.slice(0, thenIndex);
      for (i = 0; i < condition.length; ++i) {
        var t = condition[i];
        if (t.type === "operators" && t.value === "=") {
          t.value = "==";
        }
      }
      var thenClause, elseClause;
      if (elseIndex === -1) {
        thenClause = line.slice(thenIndex + 1);
      } else {
        thenClause = line.slice(thenIndex + 1, elseIndex);
        elseClause = line.slice(elseIndex + 1);
      }
      if (evaluate(condition)) {
        return process(thenClause);
      } else if (elseClause) {
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
      } else {
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
      while (line.length > 0 && (line[0].type !== "keywords" || line[0].value !== "GOTO")) {
        idxExpr.push(line.shift());
      }

      if (line.length > 0) {
        line.shift(); // burn the goto;

        for (var i = 0; i < line.length; ++i) {
          var t = line[i];
          if (t.type !== "operators" || t.value !== ",") {
            targets.push(t);
          }
        }

        idx = evaluate(idxExpr) - 1;

        if (0 <= idx && idx < targets.length) {
          return setProgramCounter([targets[idx]]);
        }
      }
    } catch (exp) {
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
    } else {
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
      } else {
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
    } else {
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
    loadFile(evaluate(line)).then(next);
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
    var name = line.shift().value;
    var signature = "";
    var body = "";
    var fillSig = true;
    for (var i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.type === "operators" && t.value === "=") {
        fillSig = false;
      } else if (fillSig) {
        signature += t.value;
      } else {
        body += t.value;
      }
    }
    name = "FN" + name;
    var script = "(function " + name + signature + "{ return " + body + "; })";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL0Jhc2ljLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLHdCQURFO0FBRVYsUUFBTSxPQUZJO0FBR1YsZUFBYTtBQUhILENBQVo7QUFLQSxJQUFJLFFBQVEsSUFBSSxTQUFTLElBQVQsQ0FBYyxPQUFsQixDQUEwQixPQUExQjtBQUNWO0FBQ0E7QUFDRTtBQUNBLENBQUMsVUFBRCxFQUFhLGdCQUFiLENBRkY7QUFHRTtBQUNBLENBQUMsYUFBRCxFQUFnQixTQUFoQixDQUpGO0FBS0U7QUFDQSxDQUFDLG1CQUFELEVBQXNCLFFBQXRCLENBTkY7QUFPRTtBQUNBLENBQUMsU0FBRCxFQUFZLGlCQUFaLENBUkYsRUFTRSxDQUFDLFNBQUQsRUFBWSxpQkFBWixDQVRGO0FBVUU7QUFDQSxDQUFDLFNBQUQsRUFBWSw0QkFBWixDQVhGO0FBWUU7QUFDQSxDQUFDLFVBQUQsRUFDRSx5S0FERixDQWJGO0FBZ0JFO0FBQ0EsQ0FBQyxVQUFELEVBQWEsU0FBYixDQWpCRjtBQWtCRTtBQUNBLENBQUMsV0FBRCxFQUNFLG1FQURGLENBbkJGO0FBc0JFO0FBQ0EsQ0FBQyxhQUFELEVBQWdCLFFBQWhCLENBdkJGLENBRlUsQ0FBWjs7QUE0QkEsSUFBSSxjQUFjLE1BQU0sUUFBeEI7QUFDQSxNQUFNLFFBQU4sR0FBaUIsVUFBVSxJQUFWLEVBQWdCO0FBQy9CLFNBQU8sWUFBWSxJQUFaLENBQWlCLElBQWpCLEVBQXVCLEtBQUssV0FBTCxFQUF2QixDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxNQUFNLFNBQU4sR0FBa0IsVUFBVSxVQUFWLEVBQXNCLEtBQXRCLEVBQTZCLE1BQTdCLEVBQXFDLFFBQXJDLEVBQStDLElBQS9DLEVBQ2hCLFdBRGdCLEVBQ0gsUUFERyxFQUNPLElBRFAsRUFDYTtBQUM3QixNQUFJLFNBQVMsS0FBSyxRQUFMLENBQWMsVUFBZCxDQUFiO0FBQUEs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UTtBQUViLFNBQUssU0FGUTtBQUdiLFdBQU8sS0FITTtBQUliLFVBQU0saUJBSk87QUFLYixRQUFJLGdCQUxTO0FBTWIsV0FBTyxZQU5NO0FBT2IsU0FBSyxtQkFQUTtBQVFiLFVBQU0sbUJBUk87QUFTYixTQUFLLElBVFE7QUFVYixTQUFLLElBVlE7QUFXYixTQUFLLFdBWFE7QUFZYixRQUFJLFdBWlM7QUFhYixXQUFPLGNBYk07QUFjYixZQUFRLFdBZEs7QUFlYixVQUFNLFlBZk87QUFnQmIsVUFBTSxRQWhCTztBQWlCYixVQUFNLFFBakJPO0FBa0JiLGFBQVMsV0FsQkk7QUFtQmIsWUFBUSxTQW5CSztBQW9CYixXQUFPLFNBcEJNO0FBcUJiLGNBQVUsY0FyQkc7QUFzQmIsV0FBTyxTQXRCTTtBQXVCYixVQUFNLFdBdkJPO0FBd0JiLFNBQUssT0F4QlE7QUF5QmIsVUFBTSxXQXpCTztBQTBCYixXQUFPO0FBMUJNLEdBQWY7O0FBNkJBLFNBQU8sWUFBWTtBQUNqQixRQUFJLENBQUMsTUFBTCxFQUFhO0FBQ1gsVUFBSSxTQUFTLElBQWI7QUFDQSxhQUFPLE1BQVAsRUFBZTtBQUNiLFlBQUksT0FBTyxRQUFRLE9BQVIsQ0FBWDtBQUNBLGlCQUFTLFFBQVEsSUFBUixDQUFUO0FBQ0EsVUFBRSxPQUFGO0FBQ0Q7QUFDRjtBQUNGLEdBVEQ7QUFVRCxDQXRtQkQiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvR3JhbW1hcnMvQmFzaWMuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Grammars.Basic = Basic;
})();
(function(){
"use strict";

var JavaScript = new Primrose.Text.Grammar("JavaScript", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /\/\*/], ["endBlockComments", /\*\//], ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/], ["stringDelim", /("|')/], ["startLineComments", /\/\/.*$/m], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/], ["functions", /(\w+)(?:\s*\()/], ["members", /(\w+)\./], ["members", /((\w+\.)+)(\w+)/]]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL0phdmFTY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxLQUFOLENBQVk7QUFDVixVQUFRLHdCQURFO0FBRVYsUUFBTSxZQUZJO0FBR1YsZUFBYTtBQUhILENBQVo7QUFLQSxJQUFNLGFBQWEsSUFBSSxTQUFTLElBQVQsQ0FBYyxPQUFsQixDQUEwQixZQUExQixFQUF3QyxDQUN6RCxDQUFDLFVBQUQsRUFBYSxnQkFBYixDQUR5RCxFQUV6RCxDQUFDLG9CQUFELEVBQXVCLE1BQXZCLENBRnlELEVBR3pELENBQUMsa0JBQUQsRUFBcUIsTUFBckIsQ0FIeUQsRUFJekQsQ0FBQyxTQUFELEVBQVksa0RBQVosQ0FKeUQsRUFLekQsQ0FBQyxhQUFELEVBQWdCLE9BQWhCLENBTHlELEVBTXpELENBQUMsbUJBQUQsRUFBc0IsVUFBdEIsQ0FOeUQsRUFPekQsQ0FBQyxTQUFELEVBQVksNEJBQVosQ0FQeUQsRUFRekQsQ0FBQyxVQUFELEVBQ0UsbU1BREYsQ0FSeUQsRUFXekQsQ0FBQyxXQUFELEVBQWMsZ0JBQWQsQ0FYeUQsRUFZekQsQ0FBQyxTQUFELEVBQVksU0FBWixDQVp5RCxFQWF6RCxDQUFDLFNBQUQsRUFBWSxpQkFBWixDQWJ5RCxDQUF4QyxDQUFuQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy9KYXZhU2NyaXB0LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.Primrose.Text.Grammars.JavaScript = JavaScript;
})();
(function(){
"use strict";

var PlainText = new Primrose.Text.Grammar("PlainText", [["newlines", /(?:\r\n|\r|\n)/]]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL1BsYWluVGV4dC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLEtBQU4sQ0FBWTtBQUNWLFVBQVEsd0JBREU7QUFFVixRQUFNLFdBRkk7QUFHVixlQUFhO0FBSEgsQ0FBWjtBQUtBLElBQU0sWUFBWSxJQUFJLFNBQVMsSUFBVCxDQUFjLE9BQWxCLENBQTBCLFdBQTFCLEVBQXVDLENBQ3ZELENBQUMsVUFBRCxFQUFhLGdCQUFiLENBRHVELENBQXZDLENBQWxCIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL1BsYWluVGV4dC5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Grammars.PlainText = PlainText;
})();
(function(){
"use strict";

var TestResults = new Primrose.Text.Grammar("TestResults", [["newlines", /(?:\r\n|\r|\n)/, true], ["numbers", /(\[)(o+)/, true], ["numbers", /(\d+ succeeded), 0 failed/, true], ["numbers", /^    Successes:/, true], ["functions", /(x+)\]/, true], ["functions", /[1-9]\d* failed/, true], ["functions", /^    Failures:/, true], ["comments", /(\d+ms:)(.*)/, true], ["keywords", /(Test results for )(\w+):/, true], ["strings", /        \w+/, true]]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L0dyYW1tYXJzL1Rlc3RSZXN1bHRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSx3QkFERTtBQUVWLFFBQU0sYUFGSTtBQUdWLGVBQWE7QUFISCxDQUFaO0FBS0EsSUFBTSxjQUFjLElBQUksU0FBUyxJQUFULENBQWMsT0FBbEIsQ0FBMEIsYUFBMUIsRUFBeUMsQ0FDM0QsQ0FBQyxVQUFELEVBQWEsZ0JBQWIsRUFBK0IsSUFBL0IsQ0FEMkQsRUFFM0QsQ0FBQyxTQUFELEVBQVksVUFBWixFQUF3QixJQUF4QixDQUYyRCxFQUczRCxDQUFDLFNBQUQsRUFBWSwyQkFBWixFQUF5QyxJQUF6QyxDQUgyRCxFQUkzRCxDQUFDLFNBQUQsRUFBWSxpQkFBWixFQUErQixJQUEvQixDQUoyRCxFQUszRCxDQUFDLFdBQUQsRUFBYyxRQUFkLEVBQXdCLElBQXhCLENBTDJELEVBTTNELENBQUMsV0FBRCxFQUFjLGlCQUFkLEVBQWlDLElBQWpDLENBTjJELEVBTzNELENBQUMsV0FBRCxFQUFjLGdCQUFkLEVBQWdDLElBQWhDLENBUDJELEVBUTNELENBQUMsVUFBRCxFQUFhLGNBQWIsRUFBNkIsSUFBN0IsQ0FSMkQsRUFTM0QsQ0FBQyxVQUFELEVBQWEsMkJBQWIsRUFBMEMsSUFBMUMsQ0FUMkQsRUFVM0QsQ0FBQyxTQUFELEVBQVksYUFBWixFQUEyQixJQUEzQixDQVYyRCxDQUF6QyxDQUFwQiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9HcmFtbWFycy9UZXN0UmVzdWx0cy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Grammars.TestResults = TestResults;
})();
(function(){
"use strict";

var OSX = new Primrose.Text.OperatingSystem("OS X", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMvT1NYLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQ0FERTtBQUVWLFFBQU0sS0FGSTtBQUdWLGVBQWE7QUFISCxDQUFaO0FBS0EsSUFBTSxNQUFNLElBQUksU0FBUyxJQUFULENBQWMsZUFBbEIsQ0FDVixNQURVLEVBQ0YsTUFERSxFQUNNLEtBRE4sRUFDYSxhQURiLEVBRVYsTUFGVSxFQUVGLFdBRkUsRUFFVyxZQUZYLEVBR1YsTUFIVSxFQUdGLFNBSEUsRUFHUyxXQUhULENBQVoiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvT3BlcmF0aW5nU3lzdGVtcy9PU1guanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems.OSX = OSX;
})();
(function(){
////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
"use strict";

var Windows = new Primrose.Text.OperatingSystem("Windows", "CTRL", "CTRL", "CTRL_y", "", "HOME", "END", "CTRL", "HOME", "END");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMvV2luZG93cy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU0sS0FBTixDQUFZO0FBQ1YsVUFBUSxnQ0FERTtBQUVWLFFBQU0sS0FGSTtBQUdWLGVBQWE7QUFISCxDQUFaO0FBS0EsSUFBTSxVQUFVLElBQUksU0FBUyxJQUFULENBQWMsZUFBbEIsQ0FDZCxTQURjLEVBQ0gsTUFERyxFQUNLLE1BREwsRUFDYSxRQURiLEVBRWQsRUFGYyxFQUVWLE1BRlUsRUFFRixLQUZFLEVBR2QsTUFIYyxFQUdOLE1BSE0sRUFHRSxLQUhGLENBQWhCIiwiZmlsZSI6InNyYy9Qcmltcm9zZS9UZXh0L09wZXJhdGluZ1N5c3RlbXMvV2luZG93cy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems.Windows = Windows;
})();
(function(){
"use strict";

var Dark = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1RoZW1lcy9EYXJrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSxzQkFERztBQUVYLFFBQU0sTUFGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxPQUFPO0FBQ1gsUUFBTSxNQURLO0FBRVgsY0FBWSxzRkFGRDtBQUdYLGVBQWEsT0FIRjtBQUlYLFlBQVUsRUFKQztBQUtYLGVBQWE7QUFDWCxlQUFXO0FBREEsR0FMRjtBQVFYLFdBQVM7QUFDUCxlQUFXLE9BREo7QUFFUCxlQUFXLFNBRko7QUFHUCx5QkFBcUIsU0FIZDtBQUlQLHVCQUFtQixTQUpaO0FBS1AsZUFBVztBQUxKLEdBUkU7QUFlWCxXQUFTO0FBQ1AsZUFBVyxTQURKO0FBRVAsZUFBVztBQUZKLEdBZkU7QUFtQlgsV0FBUztBQUNQLGVBQVcsU0FESjtBQUVQLGVBQVc7QUFGSixHQW5CRTtBQXVCWCxXQUFTO0FBQ1AsZUFBVztBQURKLEdBdkJFO0FBMEJYLFlBQVU7QUFDUixlQUFXLFFBREg7QUFFUixlQUFXO0FBRkgsR0ExQkM7QUE4QlgsWUFBVTtBQUNSLGVBQVc7QUFESCxHQTlCQztBQWlDWCxhQUFXO0FBQ1QsZUFBVyxPQURGO0FBRVQsZ0JBQVk7QUFGSCxHQWpDQTtBQXFDWCxXQUFTO0FBQ1AsZUFBVztBQURKLEdBckNFO0FBd0NYLFNBQU87QUFDTCxlQUFXLEtBRE47QUFFTCxlQUFXO0FBRk47QUF4Q0ksQ0FBYiIsImZpbGUiOiJzcmMvUHJpbXJvc2UvVGV4dC9UaGVtZXMvRGFyay5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.Primrose.Text.Themes.Dark = Dark;
})();
(function(){
"use strict";

var Default = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9Qcmltcm9zZS9UZXh0L1RoZW1lcy9EZWZhdWx0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLE1BQU0sTUFBTixDQUFhO0FBQ1gsVUFBUSxzQkFERztBQUVYLFFBQU0sU0FGSztBQUdYLGVBQWE7QUFIRixDQUFiO0FBS0EsSUFBTSxVQUFVO0FBQ2QsUUFBTSxPQURRO0FBRWQsY0FBWSxzRkFGRTtBQUdkLGVBQWEsT0FIQztBQUlkLFlBQVUsRUFKSTtBQUtkLGVBQWE7QUFDWCxlQUFXO0FBREEsR0FMQztBQVFkLFdBQVM7QUFDUCxlQUFXLE9BREo7QUFFUCxlQUFXLE9BRko7QUFHUCx5QkFBcUIsU0FIZDtBQUlQLHVCQUFtQixTQUpaO0FBS1AsZUFBVztBQUxKLEdBUks7QUFlZCxXQUFTO0FBQ1AsZUFBVyxTQURKO0FBRVAsZUFBVztBQUZKLEdBZks7QUFtQmQsV0FBUztBQUNQLGVBQVcsU0FESjtBQUVQLGVBQVc7QUFGSixHQW5CSztBQXVCZCxXQUFTO0FBQ1AsZUFBVztBQURKLEdBdkJLO0FBMEJkLFlBQVU7QUFDUixlQUFXLE1BREg7QUFFUixlQUFXO0FBRkgsR0ExQkk7QUE4QmQsWUFBVTtBQUNSLGVBQVc7QUFESCxHQTlCSTtBQWlDZCxhQUFXO0FBQ1QsZUFBVyxPQURGO0FBRVQsZ0JBQVk7QUFGSCxHQWpDRztBQXFDZCxXQUFTO0FBQ1AsZUFBVztBQURKLEdBckNLO0FBd0NkLFNBQU87QUFDTCxlQUFXLEtBRE47QUFFTCxlQUFXO0FBRk47QUF4Q08sQ0FBaEIiLCJmaWxlIjoic3JjL1ByaW1yb3NlL1RleHQvVGhlbWVzL0RlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.Primrose.Text.Themes.Default = Default;
})();
(function(){
"use strict";

function addToBrowserEnvironment(env, scene) {
  var _this = this;

  scene.add(this);
  // this has to be done as a lambda expression because it needs to capture the
  // env variable provided in the addToBrowserEnvironment call;

  this.appendChild = function (child) {
    if (child.addToBrowserEnvironment) {
      return child.addToBrowserEnvironment(env, _this);
    } else {
      _this.add(child);
      env.registerPickableObject(child);
      return child;
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9PYmplY3QzRC9wcm90b3R5cGUvYWRkVG9Ccm93c2VyRW52aXJvbm1lbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUEsTUFBTSxNQUFOLENBQWE7QUFDWCxVQUFRLGdCQURHO0FBRVgsUUFBTSx5QkFGSztBQUdYLGVBQWEsZ1dBSEY7QUFJWCxjQUFZLENBQUM7QUFDWCxVQUFNLEtBREs7QUFFWCxVQUFNLDZCQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFELEVBSVQ7QUFDRCxVQUFNLE9BREw7QUFFRCxVQUFNLGdCQUZMO0FBR0QsaUJBQWE7QUFIWixHQUpTO0FBSkQsQ0FBYjs7QUFlQSxTQUFTLHVCQUFULENBQWlDLEdBQWpDLEVBQXNDLEtBQXRDLEVBQTZDO0FBQUE7O0FBQzNDLFFBQU0sR0FBTixDQUFVLElBQVY7QUFDQTtBQUNBOztBQUVBLFFBQU0sTUFBTixDQUFhO0FBQ1gsWUFBUSxnQkFERztBQUVYLFVBQU0sYUFGSztBQUdYLGlCQUFhLDBOQUhGO0FBSVgsZ0JBQVksQ0FBQztBQUNYLFlBQU0sT0FESztBQUVYLFlBQU0sUUFGSztBQUdYLG1CQUFhO0FBSEYsS0FBRDtBQUpELEdBQWI7QUFVQSxPQUFLLFdBQUwsR0FBbUIsVUFBQyxLQUFELEVBQVc7QUFDNUIsUUFBSSxNQUFNLHVCQUFWLEVBQW1DO0FBQ2pDLGFBQU8sTUFBTSx1QkFBTixDQUE4QixHQUE5QixRQUFQO0FBQ0QsS0FGRCxNQUdLO0FBQ0gsWUFBSyxHQUFMLENBQVMsS0FBVDtBQUNBLFVBQUksc0JBQUosQ0FBMkIsS0FBM0I7QUFDQSxhQUFPLEtBQVA7QUFDRDtBQUNGLEdBVEQ7QUFVRCIsImZpbGUiOiJzcmMvVEhSRUUvT2JqZWN0M0QvcHJvdG90eXBlL2FkZFRvQnJvd3NlckVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.THREE.Object3D.prototype.addToBrowserEnvironment = addToBrowserEnvironment;
})();
(function(){
"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label + "\n" + val);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9NYXRyaXg0L3Byb3RvdHlwZS9kZWJ1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLE1BQXRCLEVBQThCO0FBQzVCLE1BQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQVY7QUFDQSxNQUFJLFFBQVEsS0FBSyxPQUFqQixFQUEwQjtBQUN4QixTQUFLLE9BQUwsR0FBZSxHQUFmO0FBQ0EsWUFBUSxHQUFSLENBQVksUUFBUSxJQUFSLEdBQWUsR0FBM0I7QUFDRDtBQUNGIiwiZmlsZSI6InNyYy9USFJFRS9NYXRyaXg0L3Byb3RvdHlwZS9kZWJ1Zy5qcyIsInNvdXJjZVJvb3QiOiIvUHJpbXJvc2UifQ==

if(typeof window !== "undefined") window.THREE.Matrix4.prototype.debug = debug;
})();
(function(){
"use strict";

function toString(digits) {
  this.transpose();
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map(function (v) {
      return v.toFixed(digits);
    });
  }
  var output = "";
  for (var i = 0; i < parts.length; ++i) {
    if (i % 4 === 0) {
      output += "| ";
    }
    output += parts[i];
    if (i % 4 === 3) {
      output += " |\n";
    } else {
      output += ", ";
    }
  }
  this.transpose();
  return output;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9NYXRyaXg0L3Byb3RvdHlwZS90b1N0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsZUFERztBQUVYLFFBQU0sV0FGSztBQUdYLGVBQWEseUNBSEY7QUFJWCxjQUFZLENBQUM7QUFDWCxVQUFNLFFBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQ7QUFKRCxDQUFiOztBQVdBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixPQUFLLFNBQUw7QUFDQSxNQUFJLFFBQVEsS0FBSyxPQUFMLEVBQVo7QUFDQSxNQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN4QixZQUFRLE1BQU0sR0FBTixDQUFVLFVBQUMsQ0FBRDtBQUFBLGFBQU8sRUFBRSxPQUFGLENBQVUsTUFBVixDQUFQO0FBQUEsS0FBVixDQUFSO0FBQ0Q7QUFDRCxNQUFJLFNBQVMsRUFBYjtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLEVBQUUsQ0FBcEMsRUFBdUM7QUFDckMsUUFBSyxJQUFJLENBQUwsS0FBWSxDQUFoQixFQUFtQjtBQUNqQixnQkFBVSxJQUFWO0FBQ0Q7QUFDRCxjQUFVLE1BQU0sQ0FBTixDQUFWO0FBQ0EsUUFBSyxJQUFJLENBQUwsS0FBWSxDQUFoQixFQUFtQjtBQUNqQixnQkFBVSxNQUFWO0FBQ0QsS0FGRCxNQUdLO0FBQ0gsZ0JBQVUsSUFBVjtBQUNEO0FBQ0Y7QUFDRCxPQUFLLFNBQUw7QUFDQSxTQUFPLE1BQVA7QUFDRCIsImZpbGUiOiJzcmMvVEhSRUUvTWF0cml4NC9wcm90b3R5cGUvdG9TdHJpbmcuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.THREE.Matrix4.prototype.toString = toString;
})();
(function(){
"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9RdWF0ZXJuaW9uL3Byb3RvdHlwZS9kZWJ1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLE1BQXRCLEVBQThCO0FBQzVCLE1BQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQVY7QUFDQSxNQUFJLFFBQVEsS0FBSyxPQUFqQixFQUEwQjtBQUN4QixTQUFLLE9BQUwsR0FBZSxHQUFmO0FBQ0EsWUFBUSxHQUFSLENBQVksS0FBWixFQUFtQixHQUFuQjtBQUNEO0FBQ0YiLCJmaWxlIjoic3JjL1RIUkVFL1F1YXRlcm5pb24vcHJvdG90eXBlL2RlYnVnLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.THREE.Quaternion.prototype.debug = debug;
})();
(function(){
"use strict";

function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    for (var i = 0; i < parts.length; ++i) {
      if (parts[i] !== null && parts[i] !== undefined) {
        parts[i] = parts[i].toFixed(digits);
      } else {
        parts[i] = "undefined";
      }
    }
  }
  return "{" + parts.join(", ") + "}";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9RdWF0ZXJuaW9uL3Byb3RvdHlwZS90b1N0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsa0JBREc7QUFFWCxRQUFNLFdBRks7QUFHWCxlQUFhLHlDQUhGO0FBSVgsY0FBWSxDQUFDO0FBQ1gsVUFBTSxRQURLO0FBRVgsVUFBTSxRQUZLO0FBR1gsaUJBQWE7QUFIRixHQUFEO0FBSkQsQ0FBYjs7QUFXQSxTQUFTLFFBQVQsQ0FBa0IsTUFBbEIsRUFBMEI7QUFDeEIsTUFBSSxRQUFRLEtBQUssT0FBTCxFQUFaO0FBQ0EsTUFBSSxXQUFXLFNBQWYsRUFBMEI7QUFDeEIsU0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLE1BQU0sTUFBMUIsRUFBa0MsRUFBRSxDQUFwQyxFQUF1QztBQUNyQyxVQUFJLE1BQU0sQ0FBTixNQUFhLElBQWIsSUFBcUIsTUFBTSxDQUFOLE1BQWEsU0FBdEMsRUFBaUQ7QUFDL0MsY0FBTSxDQUFOLElBQVcsTUFBTSxDQUFOLEVBQVMsT0FBVCxDQUFpQixNQUFqQixDQUFYO0FBQ0QsT0FGRCxNQUdLO0FBQ0gsY0FBTSxDQUFOLElBQVcsV0FBWDtBQUNEO0FBQ0Y7QUFDRjtBQUNELFNBQU8sTUFBTSxNQUFNLElBQU4sQ0FBVyxJQUFYLENBQU4sR0FBeUIsR0FBaEM7QUFDRCIsImZpbGUiOiJzcmMvVEhSRUUvUXVhdGVybmlvbi9wcm90b3R5cGUvdG9TdHJpbmcuanMiLCJzb3VyY2VSb290IjoiL1ByaW1yb3NlIn0=

if(typeof window !== "undefined") window.THREE.Quaternion.prototype.toString = toString;
})();
(function(){
"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9WZWN0b3IzL3Byb3RvdHlwZS9kZWJ1Zy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxTQUFTLEtBQVQsQ0FBZSxLQUFmLEVBQXNCLE1BQXRCLEVBQThCO0FBQzVCLE1BQUksTUFBTSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQVY7QUFDQSxNQUFJLFFBQVEsS0FBSyxPQUFqQixFQUEwQjtBQUN4QixTQUFLLE9BQUwsR0FBZSxHQUFmO0FBQ0EsWUFBUSxHQUFSLENBQVksS0FBWixFQUFtQixHQUFuQjtBQUNEO0FBQ0YiLCJmaWxlIjoic3JjL1RIUkVFL1ZlY3RvcjMvcHJvdG90eXBlL2RlYnVnLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.THREE.Vector3.prototype.debug = debug;
})();
(function(){
"use strict";

function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map(function (v) {
      return v.toFixed(digits);
    });
  }
  return "<" + parts.join(", ") + ">";
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9USFJFRS9WZWN0b3IzL3Byb3RvdHlwZS90b1N0cmluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxNQUFNLE1BQU4sQ0FBYTtBQUNYLFVBQVEsZUFERztBQUVYLFFBQU0sV0FGSztBQUdYLGVBQWEseUNBSEY7QUFJWCxjQUFZLENBQUM7QUFDWCxVQUFNLFFBREs7QUFFWCxVQUFNLFFBRks7QUFHWCxpQkFBYTtBQUhGLEdBQUQ7QUFKRCxDQUFiOztBQVdBLFNBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQjtBQUN4QixNQUFJLFFBQVEsS0FBSyxPQUFMLEVBQVo7QUFDQSxNQUFJLFdBQVcsU0FBZixFQUEwQjtBQUN4QixZQUFRLE1BQU0sR0FBTixDQUFVLFVBQUMsQ0FBRDtBQUFBLGFBQU8sRUFBRSxPQUFGLENBQVUsTUFBVixDQUFQO0FBQUEsS0FBVixDQUFSO0FBQ0Q7QUFDRCxTQUFPLE1BQU0sTUFBTSxJQUFOLENBQVcsSUFBWCxDQUFOLEdBQXlCLEdBQWhDO0FBQ0QiLCJmaWxlIjoic3JjL1RIUkVFL1ZlY3RvcjMvcHJvdG90eXBlL3RvU3RyaW5nLmpzIiwic291cmNlUm9vdCI6Ii9Qcmltcm9zZSJ9

if(typeof window !== "undefined") window.THREE.Vector3.prototype.toString = toString;
})();