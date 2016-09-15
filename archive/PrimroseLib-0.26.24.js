////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\axis.js
(function(){"use strict";

function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}
    if(typeof window !== "undefined") window.axis = axis;
})();
    // end D:\Documents\VR\Primrose\src\axis.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\box.js
(function(){"use strict";

function box(width, height, length) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return cache("BoxBufferGeometry(" + width + ", " + height + ", " + length + ")", function () {
    return new THREE.BoxBufferGeometry(width, height, length);
  });
}
    if(typeof window !== "undefined") window.box = box;
})();
    // end D:\Documents\VR\Primrose\src\box.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\brick.js
(function(){"use strict";

function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}
    if(typeof window !== "undefined") window.brick = brick;
})();
    // end D:\Documents\VR\Primrose\src\brick.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\cache.js
(function(){"use strict";

var cache = function () {
  var _cache = {};
  return function (hash, makeObject) {
    if (!_cache[hash]) {
      _cache[hash] = makeObject();
    }
    return _cache[hash];
  };
}();
    if(typeof window !== "undefined") window.cache = cache;
})();
    // end D:\Documents\VR\Primrose\src\cache.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\circle.js
(function(){"use strict";

function circle(r, sections, start, end) {
  r = r || 1;
  sections = sections || 18;
  return cache("CircleBufferGeometry(" + r + ", " + sections + ", " + start + ", " + end + ")", function () {
    return new THREE.CircleBufferGeometry(r, sections, start, end);
  });
}
    if(typeof window !== "undefined") window.circle = circle;
})();
    // end D:\Documents\VR\Primrose\src\circle.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\clone.js
(function(){"use strict";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
    if(typeof window !== "undefined") window.clone = clone;
})();
    // end D:\Documents\VR\Primrose\src\clone.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\cloud.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.cloud = cloud;
})();
    // end D:\Documents\VR\Primrose\src\cloud.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\colored.js
(function(){"use strict";

function colored(geometry, color, options) {
  options = options || {};
  if (options.opacity === undefined) {
    options.opacity = 1;
  }
  if (options.roughness === undefined) {
    options.roughness = 0.5;
  }
  if (options.metalness === undefined) {
    options.metalness = 0;
  }

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;
  options.color = color;

  var mat = material("", options),
      obj = null;

  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new THREE.Mesh(geometry, mat);
  } else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = mat;
  }

  return obj;
}
    if(typeof window !== "undefined") window.colored = colored;
})();
    // end D:\Documents\VR\Primrose\src\colored.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\copyObject.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.copyObject = copyObject;
})();
    // end D:\Documents\VR\Primrose\src\copyObject.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\cylinder.js
(function(){"use strict";

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
  return cache("CylinderBufferGeometry(" + rT + ", " + rB + ", " + height + ", " + rS + ", " + hS + ", " + openEnded + ", " + thetaStart + ", " + thetaEnd + ")", function () {
    return new THREE.CylinderBufferGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd);
  });
}
    if(typeof window !== "undefined") window.cylinder = cylinder;
})();
    // end D:\Documents\VR\Primrose\src\cylinder.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\deleteSetting.js
(function(){"use strict";

function deleteSetting(name) {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  }
}
    if(typeof window !== "undefined") window.deleteSetting = deleteSetting;
})();
    // end D:\Documents\VR\Primrose\src\deleteSetting.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\emit.js
(function(){"use strict";

function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}
    if(typeof window !== "undefined") window.emit = emit;
})();
    // end D:\Documents\VR\Primrose\src\emit.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\findProperty.js
(function(){"use strict";

function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (elem[arr[i]] !== undefined) {
      return arr[i];
    }
  }
}
    if(typeof window !== "undefined") window.findProperty = findProperty;
})();
    // end D:\Documents\VR\Primrose\src\findProperty.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\getSetting.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.getSetting = getSetting;
})();
    // end D:\Documents\VR\Primrose\src\getSetting.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\hub.js
(function(){"use strict";

function hub() {
  return new THREE.Object3D();
}
    if(typeof window !== "undefined") window.hub = hub;
})();
    // end D:\Documents\VR\Primrose\src\hub.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\identity.js
(function(){"use strict";

function identity(obj) {
  return obj;
}
    if(typeof window !== "undefined") window.identity = identity;
})();
    // end D:\Documents\VR\Primrose\src\identity.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\InsideSphereGeometry.js
(function(){"use strict";

function InsideSphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
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
    if(typeof window !== "undefined") window.InsideSphereGeometry = InsideSphereGeometry;
})();
    // end D:\Documents\VR\Primrose\src\InsideSphereGeometry.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isChrome.js
(function(){"use strict";

var isChrome = !!window.chrome && !window.isOpera;
    if(typeof window !== "undefined") window.isChrome = isChrome;
})();
    // end D:\Documents\VR\Primrose\src\isChrome.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isFirefox.js
(function(){"use strict";

var isFirefox = typeof window.InstallTrigger !== 'undefined';
    if(typeof window !== "undefined") window.isFirefox = isFirefox;
})();
    // end D:\Documents\VR\Primrose\src\isFirefox.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isGearVR.js
(function(){"use strict";

var isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;
    if(typeof window !== "undefined") window.isGearVR = isGearVR;
})();
    // end D:\Documents\VR\Primrose\src\isGearVR.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isIE.js
(function(){"use strict";

var isIE = /*@cc_on!@*/false || !!document.documentMode;
    if(typeof window !== "undefined") window.isIE = isIE;
})();
    // end D:\Documents\VR\Primrose\src\isIE.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isInIFrame.js
(function(){"use strict";

var isInIFrame = window.self !== window.top;
    if(typeof window !== "undefined") window.isInIFrame = isInIFrame;
})();
    // end D:\Documents\VR\Primrose\src\isInIFrame.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isiOS.js
(function(){"use strict";

var isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");
    if(typeof window !== "undefined") window.isiOS = isiOS;
})();
    // end D:\Documents\VR\Primrose\src\isiOS.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isMobile.js
(function(){"use strict";

var isMobile = function (a) {
  return (/(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4))
  );
}(navigator.userAgent || navigator.vendor || window.opera);
    if(typeof window !== "undefined") window.isMobile = isMobile;
})();
    // end D:\Documents\VR\Primrose\src\isMobile.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isOpera.js
(function(){"use strict";

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if(typeof window !== "undefined") window.isOpera = isOpera;
})();
    // end D:\Documents\VR\Primrose\src\isOpera.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isOSX.js
(function(){"use strict";

var isOSX = /Macintosh/.test(navigator.userAgent || "");
    if(typeof window !== "undefined") window.isOSX = isOSX;
})();
    // end D:\Documents\VR\Primrose\src\isOSX.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isSafari.js
(function(){"use strict";

var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    if(typeof window !== "undefined") window.isSafari = isSafari;
})();
    // end D:\Documents\VR\Primrose\src\isSafari.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isWebKit.js
(function(){"use strict";

var isWebKit = !/iP(hone|od|ad)/.test(navigator.userAgent || "") || isOpera || isChrome;
    if(typeof window !== "undefined") window.isWebKit = isWebKit;
})();
    // end D:\Documents\VR\Primrose\src\isWebKit.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\isWindows.js
(function(){"use strict";

var isWindows = /Windows/.test(navigator.userAgent || "");
    if(typeof window !== "undefined") window.isWindows = isWindows;
})();
    // end D:\Documents\VR\Primrose\src\isWindows.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\light.js
(function(){"use strict";

function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}
    if(typeof window !== "undefined") window.light = light;
})();
    // end D:\Documents\VR\Primrose\src\light.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\material.js
(function(){"use strict";

function material(textureDescription, options) {
  var materialDescription = "Primrose.material(" + textureDescription + ", " + options.color + ", " + options.unshaded + ", " + options.side + ", " + options.opacity + ", " + options.roughness + ", " + options.metalness + ", " + options.color + ", " + options.emissive + ", " + options.wireframe + ")";
  return cache(materialDescription, function () {
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
    var mat = new MaterialType(materialOptions);
    if (typeof options.color === "number" || options.color instanceof Number) {
      mat.color.set(options.color);
    }
    mat.wireframe = options.wireframe;
    return mat;
  });
}
    if(typeof window !== "undefined") window.material = material;
})();
    // end D:\Documents\VR\Primrose\src\material.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\patch.js
(function(){"use strict";

function patch(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    if (obj1[k] === undefined || obj1[k] === null) {
      obj1[k] = obj2[k];
    }
  }
  return obj1;
}
    if(typeof window !== "undefined") window.patch = patch;
})();
    // end D:\Documents\VR\Primrose\src\patch.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\PIXEL_SCALES.js
(function(){"use strict";

var PIXEL_SCALES = [0.5, 0.25, 0.333333, 0.5, 1];
    if(typeof window !== "undefined") window.PIXEL_SCALES = PIXEL_SCALES;
})();
    // end D:\Documents\VR\Primrose\src\PIXEL_SCALES.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose.js
(function(){"use strict";

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
var Primrose = {};
    if(typeof window !== "undefined") window.Primrose = Primrose;
})();
    // end D:\Documents\VR\Primrose\src\Primrose.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\priv.js
(function(){"use strict";

function priv() {
  var heap = new WeakMap();
  return function (obj, value) {
    if (!heap.has(obj)) {
      heap.set(obj, value || {});
    }
    return heap.get(obj);
  };
}
    if(typeof window !== "undefined") window.priv = priv;
})();
    // end D:\Documents\VR\Primrose\src\priv.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\put.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.put = put;
})();
    // end D:\Documents\VR\Primrose\src\put.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\quad.js
(function(){"use strict";

function quad(w, h, s, t) {
  if (h === undefined) {
    h = w;
  }
  return cache("PlaneBufferGeometry(" + w + ", " + h + ", " + s + ", " + t + ")", function () {
    return new THREE.PlaneBufferGeometry(w, h, s, t);
  });
}
    if(typeof window !== "undefined") window.quad = quad;
})();
    // end D:\Documents\VR\Primrose\src\quad.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Quality.js
(function(){"use strict";

var Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};
    if(typeof window !== "undefined") window.Quality = Quality;
})();
    // end D:\Documents\VR\Primrose\src\Quality.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\range.js
(function(){"use strict";

function range(n, m, s, t) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}
    if(typeof window !== "undefined") window.range = range;
})();
    // end D:\Documents\VR\Primrose\src\range.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\readForm.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.readForm = readForm;
})();
    // end D:\Documents\VR\Primrose\src\readForm.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\ring.js
(function(){"use strict";

function ring(rInner, rOuter, sectors, start, end, rings) {
  start = start || 0;
  end = end || 2 * Math.PI;
  rings = rings || 1;
  return cache("RingBufferGeometry(" + rInner + ", " + rOuter + ", " + sectors + ", " + start + ", " + end + ", " + rings + ")", function () {
    return new THREE.RingBufferGeometry(rInner, rOuter, sectors, start, end, rings);
  });
}
    if(typeof window !== "undefined") window.ring = ring;
})();
    // end D:\Documents\VR\Primrose\src\ring.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\setFalse.js
(function(){"use strict";

function setFalse(evt) {
  evt.returnValue = false;
}
    if(typeof window !== "undefined") window.setFalse = setFalse;
})();
    // end D:\Documents\VR\Primrose\src\setFalse.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\setSetting.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.setSetting = setSetting;
})();
    // end D:\Documents\VR\Primrose\src\setSetting.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\shell.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.shell = shell;
})();
    // end D:\Documents\VR\Primrose\src\shell.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\sphere.js
(function(){"use strict";

function sphere(r, slices, rings) {
  return cache("SphereGeometry(" + r + ", " + slices + ", " + rings + ")", function () {
    return new THREE.SphereGeometry(r, slices, rings);
  });
}
    if(typeof window !== "undefined") window.sphere = sphere;
})();
    // end D:\Documents\VR\Primrose\src\sphere.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\textured.js
(function(){"use strict";

var textureCache = {};

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
  if (options.color === undefined) {
    options.color = 0xffffff;
  }

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;

  var mat = null,
      textureDescription;
  if (txt instanceof THREE.Material) {
    mat = txt;
    txt = null;
  } else {
    var txtID = (txt.id || txt).toString();
    textureDescription = "Primrose.textured(" + txtID + ", " + options.txtRepeatS + ", " + options.txtRepeatT + ")";
    mat = material(textureDescription, options);
  }

  var obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new THREE.Mesh(geometry, mat);
  } else if (geometry instanceof THREE.Object3D) {
    obj = geometry;
    obj.material = mat;
  }

  if (txt) {
    var setTexture = function setTexture(texture) {
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
          console.trace(geometry, options);
        }
      }

      textureCache[textureDescription] = texture;
      mat.map = texture;
      mat.needsUpdate = true;
      texture.needsUpdate = true;
    };

    if (textureCache[textureDescription]) {
      setTexture(textureCache[textureDescription]);
    } else if (txt instanceof Primrose.Surface) {
      if (!options.scaleTextureWidth || !options.scaleTextureHeight) {
        obj.surface = txt;
        var imgWidth = txt.imageWidth,
            imgHeight = txt.imageHeight,
            dimX = Math.ceil(Math.log(imgWidth) / Math.LN2),
            dimY = Math.ceil(Math.log(imgHeight) / Math.LN2),
            newWidth = Math.pow(2, dimX),
            newHeight = Math.pow(2, dimY);

        if (options.scaleTexture) {
          newWidth *= options.scaleTexture;
          newHeight *= options.scaleTexture;
        }

        var scaleX = imgWidth / newWidth,
            scaleY = imgHeight / newHeight;

        if (scaleX !== 1 || scaleY !== 1) {
          if (scaleX !== 1) {
            options.scaleTextureWidth = scaleX;
          }

          if (scaleY !== 1) {
            options.scaleTextureHeight = scaleY;
          }

          txt.bounds.width = newWidth;
          txt.bounds.height = newHeight;
          txt.resize();
          txt.render(true);
        }
      }
      txt._material = mat;
      setTexture(txt.texture);
    } else if (typeof txt === "string") {
      Primrose.loadTexture(txt, options.progress).then(setTexture).catch(console.error.bind(console, "Error loading texture", txt));
    } else if (txt instanceof Primrose.Text.Controls.TextBox) {
      setTexture(txt.renderer.texture);
    } else if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement) {
      setTexture(new THREE.Texture(txt));
    } else {
      setTexture(txt);
    }
  }

  return obj;
}
    if(typeof window !== "undefined") window.textured = textured;
})();
    // end D:\Documents\VR\Primrose\src\textured.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\v3.js
(function(){"use strict";

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
    if(typeof window !== "undefined") window.v3 = v3;
})();
    // end D:\Documents\VR\Primrose\src\v3.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\writeForm.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.writeForm = writeForm;
})();
    // end D:\Documents\VR\Primrose\src\writeForm.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\AbstractEventEmitter.js
(function(){"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
    key: "forward",
    value: function forward(obj, evts) {
      var _this = this;

      evts.forEach(function (evt) {
        return _this.addEventListener(evt, obj.emit.bind(obj, evt));
      });
    }
  }, {
    key: "emit",
    value: function emit(name, obj) {
      if (this._handlers[name]) {
        if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && !(obj instanceof UIEvent)) {
          obj.type = name;
        }
        for (var i = 0; i < this._handlers[name].length; ++i) {
          this._handlers[name][i](obj);
        }
      }
    }
  }]);

  return AbstractEventEmitter;
}();
    if(typeof window !== "undefined") window.Primrose.AbstractEventEmitter = AbstractEventEmitter;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\AbstractEventEmitter.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Angle.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Angle = Angle;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Angle.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\BaseControl.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (BaseControl.__proto__ || Object.getPrototypeOf(BaseControl)).call(this));

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
    if(typeof window !== "undefined") window.Primrose.BaseControl = BaseControl;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\BaseControl.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\BrowserEnvironment.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MILLISECONDS_TO_SECONDS = 0.001,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    TELEPORT_COOLDOWN = 250;

var BrowserEnvironment = function (_Primrose$AbstractEve) {
  _inherits(BrowserEnvironment, _Primrose$AbstractEve);

  function BrowserEnvironment(options) {
    var _arguments = arguments;

    _classCallCheck(this, BrowserEnvironment);

    var _this = _possibleConstructorReturn(this, (BrowserEnvironment.__proto__ || Object.getPrototypeOf(BrowserEnvironment)).call(this));

    _this.options = patch(options, BrowserEnvironment.DEFAULTS);
    _this.options.foregroundColor = _this.options.foregroundColor || complementColor(new THREE.Color(_this.options.backgroundColor)).getHex();

    _this.zero = function () {
      if (!_this.lockMovement) {
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

    var currentHits = {},
        handleHit = function handleHit(h) {
      var dt;
      _this.projector.ready = true;
      currentHits = h;
      for (var key in currentHits) {
        var hit = currentHits[key];
        hit.object = _this.pickableObjects[hit.objectID];
      }
    };

    var update = function update(t) {
      var dt = t - lt,
          i,
          j;
      lt = t;

      movePlayer(dt);
      _this.input.resolvePicking(currentHits);
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
        _this.buttonFactory = new Primrose.ButtonFactory(colored(box(1, 1, 1), 0xff0000), {
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
        _this.buttonFactory = new Primrose.ButtonFactory(colored(box(1, 1, 1), 0xff0000), {
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
    _this.currentControl = null;

    var POSITION = new THREE.Vector3(),
        lastTeleport = 0;

    _this.teleport = function (pos) {
      var t = performance.now(),
          dt = t - lastTeleport;
      if (dt > TELEPORT_COOLDOWN) {
        lastTeleport = t;
        _this.input.moveStage(pos);
      }
    };

    _this.selectControl = function (evt) {
      var obj = evt.hit && evt.hit.object;

      if (evt.type === "exit" && evt.lastHit && evt.lastHit.object === _this.ground) {
        evt.pointer.disk.visible = false;
      }

      if (evt.type !== "exit" && evt.hit && obj === _this.ground) {
        POSITION.fromArray(evt.hit.facePoint).sub(_this.input.head.position);

        var distSq = POSITION.x * POSITION.x + POSITION.z * POSITION.z;
        if (distSq > MAX_MOVE_DISTANCE_SQ) {
          var dist = Math.sqrt(distSq),
              factor = MAX_MOVE_DISTANCE / dist,
              y = POSITION.y;
          POSITION.y = 0;
          POSITION.multiplyScalar(factor);
          POSITION.y = y;
        }

        POSITION.add(_this.input.head.position);

        if (evt.type === "enter") {
          evt.pointer.disk.visible = true;
        } else if (evt.type === "pointermove" || evt.type === "gazemove") {
          evt.pointer.moveTeleportPad(POSITION);
        } else if (evt.type === "pointerend" || evt.type === "gazecomplete") {
          _this.teleport(POSITION);
        }
      }

      if (evt.type === "pointerstart" || evt.type === "gazecomplete") {
        obj = obj && (obj.surface || obj.button);
        if (obj !== _this.currentControl) {
          if (_this.currentControl) {
            _this.currentControl.blur();
          }
          _this.currentControl = obj;
          if (_this.currentControl) {
            _this.currentControl.focus();
          }
        }
      }

      if (_this.currentControl) {
        if (_this.currentControl.dispatchEvent) {
          _this.currentControl.dispatchEvent(evt);
        } else {
          console.log(_this.currentControl);
        }
      }
    };

    _this.projector = new Primrose.Workerize(Primrose.Projector);

    _this.options.scene = _this.scene = _this.options.scene || new THREE.Scene();
    if (_this.options.useFog) {
      _this.scene.fog = new THREE.FogExp2(_this.options.backgroundColor, 2 / _this.options.drawDistance);
    }

    _this.camera = new THREE.PerspectiveCamera(75, 1, _this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);
    if (_this.options.skyTexture !== undefined) {
      var skyFunc = typeof _this.options.skyTexture === "number" ? colored : textured;
      _this.sky = skyFunc(shell(_this.options.drawDistance * 0.9, 18, 9, Math.PI * 2, Math.PI), _this.options.skyTexture, {
        unshaded: true
      });
      _this.sky.name = "Sky";
      _this.scene.add(_this.sky);
    }

    if (_this.options.groundTexture !== undefined) {
      var dim = 10,
          gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
      var groundFunc = typeof _this.options.groundTexture === "number" ? colored : textured;
      _this.ground = groundFunc(gm, _this.options.groundTexture, {
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

    PointerLock.addChangeListener(function (evt) {
      if (_this.input.VR.isPresenting && !PointerLock.isActive) {
        _this.input.VR.cancel();
      }
    });

    window.addEventListener("vrdisplaypresentchange", function (evt) {
      if (!_this.input.VR.isPresenting) {
        _this.input.VR.cancel();
      }
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

      var maxTabIndex = 0,
          elementsWithTabIndex = document.querySelectorAll("[tabIndex]");
      for (var i = 0; i < elementsWithTabIndex.length; ++i) {
        maxTabIndex = Math.max(maxTabIndex, elementsWithTabIndex[i].tabIndex);
      }

      _this.renderer.domElement.tabIndex = maxTabIndex + 1;
      _this.renderer.domElement.addEventListener('webglcontextlost', _this.stop, false);
      _this.renderer.domElement.addEventListener('webglcontextrestored', _this.start, false);

      _this.input = new Primrose.Input.FPSInput(_this.renderer.domElement, _this.options);
      _this.input.addEventListener("zero", _this.zero, false);
      Primrose.Pointer.EVENTS.forEach(function (evt) {
        return _this.input.addEventListener(evt, _this.selectControl.bind(_this), false);
      });
      _this.input.forward(_this, Primrose.Pointer.EVENTS);

      var keyDown = function keyDown(evt) {
        if (_this.input.VR.isPresenting) {
          if (evt.keyCode === Primrose.Keys.ESCAPE && !_this.input.VR.isPolyfilled) {
            _this.input.VR.cancel();
          }
        }

        if (!_this.lockMovement) {
          _this.input.Keyboard.dispatchEvent(evt);
        } else if (_this.currentControl) {
          _this.currentControl.keyDown(evt);
        }
        _this.emit("keydown", evt);
      },
          keyUp = function keyUp(evt) {
        if (!_this.lockMovement) {
          _this.input.Keyboard.dispatchEvent(evt);
        } else if (_this.currentControl) {
          _this.currentControl.keyUp(evt);
        }
        _this.emit("keyup", evt);
      },
          withCurrentControl = function withCurrentControl(name) {
        return function (evt) {
          if (_this.currentControl) {
            if (_this.currentControl[name]) {
              _this.currentControl[name](evt);
            } else {
              console.warn("Couldn't find %s on %o", name, _this.currentControl);
            }
          }
        };
      };

      window.addEventListener("keydown", keyDown, false);

      window.addEventListener("keyup", keyUp, false);

      window.addEventListener("paste", withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", withCurrentControl("readWheel"), false);

      var focusClipboard = function focusClipboard(evt) {
        if (_this.lockMovement) {
          var cmdName = _this.input.Keyboard.operatingSystem.makeCommandName(evt, _this.input.Keyboard.codePage);
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
    key: "lockMovement",
    get: function get() {
      return this.currentControl && this.currentControl.lockMovement;
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
    if(typeof window !== "undefined") window.Primrose.BrowserEnvironment = BrowserEnvironment;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\BrowserEnvironment.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\ButtonFactory.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.ButtonFactory = ButtonFactory;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\ButtonFactory.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls.js
(function(){"use strict";

var Controls = {};
    if(typeof window !== "undefined") window.Primrose.Controls = Controls;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\DOM.js
(function(){"use strict";

var DOM = {};
    if(typeof window !== "undefined") window.Primrose.DOM = DOM;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\DOM.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Entity.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var entityKeys = [],
    entities = new WeakMap();

var Entity = function () {
  _createClass(Entity, null, [{
    key: "registerEntity",
    value: function registerEntity(e) {
      entities.set(e._idObj, e);
      entityKeys.push(e._idObj);
      e.addEventListener("_idchanged", function (evt) {
        entityKeys.splice(entityKeys.indexOf(evt.oldID), 1);
        entities.delete(evt.oldID);
        entities.set(evt.entity._idObj, evt.entity);
        entityKeys.push(evt.entity._idObj);
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
    value: function endPointer(evt) {
      this._forFocusedChild("endPointer", evt);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      var _this = this;

      switch (evt.type) {
        case "pointerstart":
          this.startUV(evt.hit.point);
          break;
        case "pointerend":
          this.endPointer(evt);
          break;
        case "pointermove":
        case "gazemove":
          this.moveUV(evt.hit.point);
          break;
        case "gazecomplete":
          this.startUV(evt.hit.point);
          setTimeout(function () {
            return _this.endPointer(evt);
          }, 100);
          break;
      }
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
      if (this._id !== v) {
        var oldID = this._idObj;
        this._id = v;
        this._idObj = new Object(v);
        // this `_idchanged` event is necessary to update the related ID in the WeakMap of entities for eye-blanking.
        emit.call(this, "_idchanged", {
          oldID: oldID,
          entity: this
        });
      }
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
        lock = lock || this.children[i].lockMovement;
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
    if(typeof window !== "undefined") window.Primrose.Entity = Entity;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Entity.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP.js
(function(){"use strict";

var HTTP = {};
    if(typeof window !== "undefined") window.Primrose.HTTP = HTTP;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input.js
(function(){"use strict";

var Input = {};
    if(typeof window !== "undefined") window.Primrose.Input = Input;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\InputProcessor.js
(function(){"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"];

var InputProcessor = function () {
  function InputProcessor(name, commands, axisNames) {
    var _this = this;

    _classCallCheck(this, InputProcessor);

    this.name = name;
    this.commands = {};
    this.commandNames = [];
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.inPhysicalUse = false;
    this.inputState = {
      buttons: [],
      axes: [],
      ctrl: false,
      alt: false,
      shift: false,
      meta: false
    };

    var i,
        readMetaKeys = function readMetaKeys(event) {
      for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        var m = Primrose.Keys.MODIFIER_KEYS[i];
        _this.inputState[m] = event[m + "Key"];
      }
    };

    window.addEventListener("keydown", readMetaKeys, false);
    window.addEventListener("keyup", readMetaKeys, false);
    window.addEventListener("focus", readMetaKeys, false);

    this.axisNames = axisNames || [];

    for (i = 0; i < this.axisNames.length; ++i) {
      this.inputState.axes[i] = 0;
    }

    for (var cmdName in commands) {
      this.addCommand(cmdName, commands[cmdName]);
    }

    for (i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
      this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
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
          var index = 0,
              toggle = false,
              sign = 1,
              t = _typeof(arr[i]);

          if (t === "number") {
            index = Math.abs(arr[i]) - 1;
            toggle = arr[i] < 0;
            sign = arr[i] < 0 ? -1 : 1;
          } else if (t === "string") {
            index = this.axisNames.indexOf(arr[i]);
          } else {
            throw new Error("Cannot clone command spec. Element was type: " + t, arr[i]);
          }

          output[i] = {
            index: index,
            toggle: toggle,
            sign: sign
          };
        }
      }
      return output;
    }
  }, {
    key: "update",
    value: function update(dt) {
      if (this.enabled && this.ready && this.inPhysicalUse && !this.paused && dt > 0) {
        for (var name in this.commands) {
          var cmd = this.commands[name];
          cmd.state.wasPressed = cmd.state.pressed;
          cmd.state.pressed = false;
          if (!cmd.disabled) {
            var metaKeysSet = true,
                n;

            if (cmd.metaKeys) {
              for (n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n) {
                var m = cmd.metaKeys[n];
                metaKeysSet = metaKeysSet && (this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && !m.toggle || !this.inputState[Primrose.Keys.MODIFIER_KEYS[m.index]] && m.toggle);
              }
            }

            if (metaKeysSet) {
              var pressed = true,
                  value = 0,
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

        this.fireCommands();
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
      if (i > -1 && (this.inPhysicalUse || value !== 0)) {
        this.inPhysicalUse = true;
        this.inputState.axes[i] = value;
      }
    }
  }, {
    key: "setButton",
    value: function setButton(index, pressed) {
      if (this.inPhysicalUse || pressed) {
        this.inPhysicalUse = true;
        this.inputState.buttons[index] = pressed;
      }
    }
  }, {
    key: "isDown",
    value: function isDown(name) {
      return this.enabled && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }, {
    key: "isUp",
    value: function isUp(name) {
      return this.enabled && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }, {
    key: "getValue",
    value: function getValue(name) {
      return this.enabled && this.isEnabled(name) && (this.commands[name].state.value || this.getAxis(name)) || 0;
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
  }]);

  return InputProcessor;
}();
    if(typeof window !== "undefined") window.Primrose.InputProcessor = InputProcessor;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\InputProcessor.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Keys.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Keys = Keys;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Keys.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\loadTexture.js
(function(){"use strict";

var textureLoader = new THREE.TextureLoader();

function loadTexture(url, progress) {
  progress = progress || function () {};
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache("Image(" + url + ")", function () {
    return new Promise(function (resolve, reject) {
      return textureLoader.load(url, resolve, progress, reject);
    });
  });
}
    if(typeof window !== "undefined") window.Primrose.loadTexture = loadTexture;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\loadTexture.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\ModelLoader.js
(function(){"use strict";

// The JSON format object loader is not always included in the Three.js distribution,
// so we have to first check for it.
var loaders = {
  ".json": THREE.ObjectLoader,
  ".fbx": THREE.FBXLoader,
  ".mtl": THREE.MTLLoader,
  ".obj": THREE.OBJLoader,
  ".stl": THREE.STLLoader,
  ".typeface.json": THREE.FontLoader
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
        Loader.setTexturePath(dir);
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

      if (extension !== ".mtl" && extension !== ".typeface.json") {
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
    if(typeof window !== "undefined") window.Primrose.ModelLoader = ModelLoader;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\ModelLoader.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Network.js
(function(){"use strict";

var Network = {};
    if(typeof window !== "undefined") window.Primrose.Network = Network;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Network.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Output.js
(function(){"use strict";

var Output = {};
    if(typeof window !== "undefined") window.Primrose.Output = Output;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Output.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Pointer.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TELEPORT_PAD_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    LASER_WIDTH = 0.01,
    LASER_LENGTH = 3 * LASER_WIDTH,
    EULER_TEMP = new THREE.Euler(),
    GAZE_TIMEOUT = 1000,
    GAZE_RING_INNER = 0.01,
    GAZE_RING_OUTER = 0.02,
    _ = priv();

var Pointer = function (_Primrose$AbstractEve) {
  _inherits(Pointer, _Primrose$AbstractEve);

  function Pointer(name, color, emission, orientationDevices) {
    var positionDevices = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];
    var triggerDevices = arguments.length <= 5 || arguments[5] === undefined ? null : arguments[5];

    _classCallCheck(this, Pointer);

    var _this = _possibleConstructorReturn(this, (Pointer.__proto__ || Object.getPrototypeOf(Pointer)).call(this));

    _this.name = name;
    _this.orientationDevices = orientationDevices;
    _this.positionDevices = positionDevices || orientationDevices.slice();
    _this.triggerDevices = triggerDevices || orientationDevices.slice();

    _this.showPointer = true;
    _this.color = color;
    _this.emission = emission;
    _this.velocity = new THREE.Vector3();
    _this.mesh = colored(box(LASER_WIDTH, LASER_WIDTH, LASER_LENGTH), _this.color, {
      emissive: _this.emission
    });

    var arr = _this.mesh.geometry.attributes.position;
    for (var i = 2; i < arr.array.length; i += arr.itemSize) {
      arr.array[i] -= LASER_LENGTH * 0.5 + 0.5;
    }

    _this.disk = colored(sphere(TELEPORT_PAD_RADIUS, 128, 3), _this.color, {
      emissive: _this.emission
    });
    _this.disk.geometry.computeBoundingBox();
    _this.disk.geometry.vertices.forEach(function (v) {
      v.y = 0.1 * (v.y - _this.disk.geometry.boundingBox.min.y);
    });
    _this.disk.visible = false;
    _this.disk.geometry.computeBoundingBox();

    _this.gazeInner = colored(circle(GAZE_RING_INNER / 2, 10), _this.color, {
      emissive: _this.emission
    });
    _this.gazeInner.position.set(0, 0, -0.5);

    _this.gazeOuter = colored(ring(GAZE_RING_INNER, GAZE_RING_OUTER, 10), _this.color, {
      emissive: _this.emission
    });
    _this.gazeOuter.visible = false;
    _this.gazeInner.add(_this.gazeOuter);

    _this.root = new THREE.Object3D();
    _this.add(_this.mesh);
    _this.add(_this.gazeInner);

    _this.useGaze = false;

    _(_this, {
      lastHit: null
    });
    return _this;
  }

  _createClass(Pointer, [{
    key: "add",
    value: function add(obj) {
      this.root.add(obj);
    }
  }, {
    key: "addDevice",
    value: function addDevice(orientation, position, trigger) {
      if (orientation) {
        this.orientationDevices.push(orientation);
      }

      if (position) {
        this.positionDevices.push(position);
      }

      if (trigger) {
        this.triggerDevices.push(trigger);
      }
    }
  }, {
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      scene.add(this.root);
      scene.add(this.disk);
    }
  }, {
    key: "updateMatrix",
    value: function updateMatrix() {
      return this.root.updateMatrix();
    }
  }, {
    key: "applyMatrix",
    value: function applyMatrix(m) {
      return this.root.applyMatrix(m);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.orientationDevices[0] instanceof Primrose.PoseInputProcessor) {
        this.position.copy(this.orientationDevices[0].position);
        this.quaternion.copy(this.orientationDevices[0].quaternion);
      } else {
        var pitch = 0,
            heading = 0,
            x = 0,
            y = 0,
            z = 0,
            i,
            obj;

        for (i = 0; i < this.orientationDevices.length; ++i) {
          obj = this.orientationDevices[i];
          if (obj.enabled) {
            pitch += obj.getValue("pitch");
            heading += obj.getValue("heading");
          }
        }

        for (i = 0; i < this.positionDevices.length; ++i) {
          obj = this.positionDevices[i];
          if (obj.enabled) {
            if (obj.position) {
              x += obj.position.x;
              y += obj.position.y;
              z += obj.position.z;
            } else {
              x += obj.getValue("X");
              y += obj.getValue("Y");
              z += obj.getValue("Z");
            }
          }
        }

        EULER_TEMP.set(pitch, heading, 0, "YXZ");
        this.quaternion.setFromEuler(EULER_TEMP);
        this.position.set(x, y, z);
      }
    }
  }, {
    key: "moveTeleportPad",
    value: function moveTeleportPad(point) {
      this.disk.position.copy(point);
    }
  }, {
    key: "resolvePicking",
    value: function resolvePicking(currentHit) {
      this.mesh.visible = false;

      if (this.showPointer) {
        var _priv = _(this),
            lastHit = _priv.lastHit,
            moved = lastHit && currentHit && (currentHit.facePoint[0] !== lastHit.facePoint[0] || currentHit.facePoint[1] !== lastHit.facePoint[1] || currentHit.facePoint[2] !== lastHit.facePoint[2]),
            dt = lastHit && lastHit.time && performance.now() - lastHit.time,
            changed = !lastHit && currentHit || lastHit && !currentHit || lastHit && currentHit && currentHit.objectID !== lastHit.objectID,
            evt = {
          pointer: this,
          buttons: 0,
          hit: currentHit,
          lastHit: lastHit
        };

        if (moved) {
          lastHit.facePoint[0] = currentHit.facePoint[0];
          lastHit.facePoint[1] = currentHit.facePoint[1];
          lastHit.facePoint[2] = currentHit.facePoint[2];
        }

        this.mesh.visible = !this.useGaze;

        if (changed) {
          if (lastHit) {
            this.emit("exit", evt);
          }
          if (currentHit) {
            this.emit("enter", evt);
          }
        }

        var dButtons = 0;
        for (var i = 0; i < this.triggerDevices.length; ++i) {
          var obj = this.triggerDevices[i];
          if (obj.enabled) {
            evt.buttons |= obj.getValue("buttons");
            dButtons |= obj.getValue("dButtons");
          }
        }

        if (dButtons) {
          if (evt.buttons) {
            this.emit("pointerstart", evt);
          } else {
            this.emit("pointerend", evt);
          }
        } else if (moved) {
          this.emit("pointermove", evt);
        }

        if (this.useGaze) {
          if (changed) {
            if (dt !== null && dt < GAZE_TIMEOUT) {
              this.gazeOuter.visible = false;
              this.emit("gazecancel", evt);
            }
            if (currentHit) {
              this.gazeOuter.visible = true;
              this.emit("gazestart", evt);
            }
          } else if (dt !== null) {
            if (dt >= GAZE_TIMEOUT) {
              this.gazeOuter.visible = false;
              this.emit("gazecomplete", evt);
              lastHit.time = null;
            } else {
              var p = Math.round(36 * dt / GAZE_TIMEOUT),
                  a = 2 * Math.PI * p / 36;
              this.gazeOuter.geometry = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 36, p, 0, a);
              if (moved) {
                this.emit("gazemove", evt);
              }
            }
          }
        }

        if (changed) {
          _priv.lastHit = currentHit;
        }
      }
    }
  }, {
    key: "useGaze",
    get: function get() {
      return this.gazeInner.visible;
    },
    set: function set(v) {
      this.gazeInner.visible = !!v;
      this.mesh.visible = !v;
    }
  }, {
    key: "material",
    get: function get() {
      return this.mesh.material;
    },
    set: function set(v) {
      this.mesh.material = v;
      this.disk.material = v;
      this.gazeInner.material = v;
      this.gazeOuter.material = v;
    }
  }, {
    key: "position",
    get: function get() {
      return this.root.position;
    }
  }, {
    key: "quaternion",
    get: function get() {
      return this.root.quaternion;
    }
  }, {
    key: "matrix",
    get: function get() {
      return this.root.matrix;
    }
  }, {
    key: "segment",
    get: function get() {
      if (this.showPointer) {
        FORWARD.set(0, 0, -1).applyQuaternion(this.root.quaternion).add(this.root.position);
        return [this.name, this.root.position.toArray(), FORWARD.toArray()];
      }
    }
  }]);

  return Pointer;
}(Primrose.AbstractEventEmitter);

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel", "exit", "enter"];
    if(typeof window !== "undefined") window.Primrose.Pointer = Pointer;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Pointer.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\PoseInputProcessor.js
(function(){"use strict";

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

  function PoseInputProcessor(name, commands, axisNames) {
    _classCallCheck(this, PoseInputProcessor);

    var _this = _possibleConstructorReturn(this, (PoseInputProcessor.__proto__ || Object.getPrototypeOf(PoseInputProcessor)).call(this, name, commands, axisNames));

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
      _get(PoseInputProcessor.prototype.__proto__ || Object.getPrototypeOf(PoseInputProcessor.prototype), "update", this).call(this, dt);

      if (this.currentDevice) {
        var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
        this.lastPose = pose;
        this.inPhysicalUse = this.hasOrientation || this.inPhysicalUse;
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
  }, {
    key: "hasPose",
    get: function get() {
      return !!this.currentPose;
    }
  }]);

  return PoseInputProcessor;
}(Primrose.InputProcessor);
    if(typeof window !== "undefined") window.Primrose.PoseInputProcessor = PoseInputProcessor;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\PoseInputProcessor.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Projector.js
(function(){"use strict";

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
                  time: performance.now(),
                  objectID: objID,
                  object: null,
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
    if(typeof window !== "undefined") window.Primrose.Projector = Projector;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Projector.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random.js
(function(){"use strict";

var Random = {};
    if(typeof window !== "undefined") window.Primrose.Random = Random;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\SKINS.js
(function(){"use strict";

var SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2", "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49", "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836", "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000", "#5B0001", "#302E2E"];
    if(typeof window !== "undefined") window.Primrose.SKINS = SKINS;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\SKINS.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\SKINS_VALUES.js
(function(){"use strict";

var SKINS_VALUES = Primrose.SKINS.map(function (s) {
  return parseInt(s.substring(1), 16);
});
    if(typeof window !== "undefined") window.Primrose.SKINS_VALUES = SKINS_VALUES;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\SKINS_VALUES.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Surface.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (Surface.__proto__ || Object.getPrototypeOf(Surface)).call(this));

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
    _this._environment = null;
    return _this;
  }

  _createClass(Surface, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      this._environment = env;
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
      _get(Surface.prototype.__proto__ || Object.getPrototypeOf(Surface.prototype), "appendChild", this).call(this, child);
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
    key: "inBounds",
    value: function inBounds(x, y) {
      return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
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
  }, {
    key: "environment",
    get: function get() {
      var head = this;
      while (head) {
        if (head._environment) {
          if (head !== this) {
            this._environment = head._environment;
          }
          return this._environment;
        }
        head = head.parent;
      }
    }
  }]);

  return Surface;
}(Primrose.Entity);
    if(typeof window !== "undefined") window.Primrose.Surface = Surface;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Surface.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\SYS_FONTS.js
(function(){"use strict";

var SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";
    if(typeof window !== "undefined") window.Primrose.SYS_FONTS = SYS_FONTS;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\SYS_FONTS.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text.js
(function(){"use strict";

var Text = {};
    if(typeof window !== "undefined") window.Primrose.Text = Text;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\WebRTCSocket.js
(function(){"use strict";

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
            return _this._log(1, "[%s] ICE Connection %s, Gathering %s", instanceNumber, _this.rtc.iceConnectionState, _this.rtc.iceGatheringState);
          };

          // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
          // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
          // you that negotiation is necessary, and only then create the offer. There is a race-condition between
          // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
          // don't wait for the appropriate time.
          _this.rtc.onnegotiationneeded = function (evt) {
            return _this.createOffer(_this.offerOptions)
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
    if(typeof window !== "undefined") window.Primrose.WebRTCSocket = WebRTCSocket;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\WebRTCSocket.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Workerize.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Workerize = Workerize;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Workerize.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\X.js
(function(){"use strict";

var X = {};
    if(typeof window !== "undefined") window.Primrose.X = X;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\X.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\AbstractLabel.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (AbstractLabel.__proto__ || Object.getPrototypeOf(AbstractLabel)).call(this, patch(options, {
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
    if(typeof window !== "undefined") window.Primrose.Controls.AbstractLabel = AbstractLabel;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\AbstractLabel.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\Button2D.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (Button2D.__proto__ || Object.getPrototypeOf(Button2D)).call(this, patch(options, {
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
      btn3d._handlers = this.listeners;
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
          changed = _get(Button2D.prototype.__proto__ || Object.getPrototypeOf(Button2D.prototype), "_isChanged", this) || activatedChanged;
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
    if(typeof window !== "undefined") window.Primrose.Controls.Button2D = Button2D;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\Button2D.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\Button3D.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button3D = function (_Primrose$BaseControl) {
  _inherits(Button3D, _Primrose$BaseControl);

  function Button3D(model, name, options) {
    _classCallCheck(this, Button3D);

    var _this = _possibleConstructorReturn(this, (Button3D.__proto__ || Object.getPrototypeOf(Button3D)).call(this));

    options = patch(options, Button3D);
    options.minDeflection = Math.cos(options.minDeflection);
    options.colorUnpressed = new THREE.Color(options.colorUnpressed);
    options.colorPressed = new THREE.Color(options.colorPressed);

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
    _this.startUV = function (point) {
      this.color.copy(options.colorPressed);
      if (this.element) {
        this.element.click();
      } else {
        this.emit("click", { source: this });
      }
    };

    _this.endPointer = function (evt) {
      this.color.copy(options.colorUnpressed);
      this.emit("release", { source: this });
    };
    return _this;
  }

  _createClass(Button3D, [{
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      var _this2 = this;

      switch (evt.type) {
        case "pointerstart":
          this.startUV(evt.hit.point);
          break;
        case "pointerend":
          this.endPointer(evt);
          break;
        case "gazecomplete":
          this.startUV(evt.hit.point);
          setTimeout(function () {
            return _this2.endPointer(evt);
          }, 100);
          break;
      }
    }
  }, {
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
    if(typeof window !== "undefined") window.Primrose.Controls.Button3D = Button3D;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\Button3D.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\Form.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, patch(options, {
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
    if(typeof window !== "undefined") window.Primrose.Controls.Form = Form;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\Form.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\HtmlDoc.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (HtmlDoc.__proto__ || Object.getPrototypeOf(HtmlDoc)).call(this, patch(options, {
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
    if(typeof window !== "undefined") window.Primrose.Controls.HtmlDoc = HtmlDoc;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\HtmlDoc.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\Image.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var COUNTER = 0,
    _ = priv();

var Image = function (_Primrose$Entity) {
  _inherits(Image, _Primrose$Entity);

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

    if (options.radius) {
      options.geometry = shell(options.radius, 72, 36, Math.PI * 2, Math.PI);
    } else if (!options.geometry) {
      options.geometry = quad(0.5, 0.5);
    }

    if (!options.id) {
      options.id = "Primrose.Controls.Image[" + COUNTER++ + "]";
    }

    var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, options.id));

    _this.options = options;
    Primrose.Entity.registerEntity(_this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    _this._images = [];
    _this._currentImageIndex = 0;
    _this.meshes = null;
    _this.isVideo = false;
    return _this;
  }

  _createClass(Image, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      var _this2 = this;

      this.meshes = this._images.map(function (txt) {
        return textured(_this2.options.geometry, txt, _this2.options);
      });
      this.meshes.forEach(function (mesh, i) {
        scene.add(mesh);
        mesh.name = _this2.id + "-" + i;
        if (i > 0) {
          mesh.visible = false;
        } else {
          env.registerPickableObject(mesh);
        }
      });
    }
  }, {
    key: "loadImages",
    value: function loadImages(images, progress) {
      var _this3 = this;

      return Promise.all(images.map(function (src, i) {
        return Primrose.loadTexture(src, progress).then(function (txt) {
          return _this3._images[i] = txt;
        });
      })).then(function () {
        return _this3.isVideo = false;
      }).then(function () {
        return _this3;
      });
    }
  }, {
    key: "loadVideos",
    value: function loadVideos(videos, progress) {
      var _this4 = this;

      return Promise.all(videos.map(function (src, i) {
        return new Promise(function (resolve, reject) {
          var video = document.createElement("video"),
              source = document.createElement("source");
          video.muted = true;
          video.preload = "auto";
          video.autoplay = true;
          video.loop = true;
          video.oncanplay = function () {
            _this4._images[i] = video;
            console.log(video.videoWidth, video.videoHeight);
            resolve();
          };
          video.onprogress = progress;
          video.onerror = reject;
          video.src = src;
          document.body.insertBefore(video, document.body.children[0]);
        });
      })).then(function () {
        return _this4.isVideo = true;
      }).then(function () {
        return _this4;
      });
    }
  }, {
    key: "eyeBlank",
    value: function eyeBlank(eye) {
      if (this.meshes) {
        this._currentImageIndex = eye % this.meshes.length;
        for (var i = 0; i < this.meshes.length; ++i) {
          var m = this.meshes[i];
          m.visible = i === this._currentImageIndex;
          if (i > 0) {
            m.position.copy(this.position);
            m.quaternion.copy(this.quaternion);
            m.scale.copy(this.scale);
          }
        }
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (this.meshes && this.isVideo) {
        for (var i = 0; i < this.meshes.length; ++i) {
          this.meshes[i].material.map.needsUpdate = true;
        }
      }
    }
  }, {
    key: "position",
    get: function get() {
      return this.meshes[0].position;
    }
  }, {
    key: "quaternion",
    get: function get() {
      return this.meshes[0].quaternion;
    }
  }, {
    key: "scale",
    get: function get() {
      return this.meshes[0].scale;
    }
  }]);

  return Image;
}(Primrose.Entity);
    if(typeof window !== "undefined") window.Primrose.Controls.Image = Image;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\Image.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\Progress.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SIZE = 1,
    INSET = 0.8,
    PROPORTION = 10,
    SIZE_SMALL = SIZE / PROPORTION,
    INSET_LARGE = 1 - (1 - INSET) / PROPORTION;

var Progress = function () {
  function Progress(majorColor, minorColor) {
    _classCallCheck(this, Progress);

    majorColor = majorColor || 0xffffff;
    minorColor = minorColor || 0x000000;
    var geom = box(SIZE, SIZE_SMALL, SIZE_SMALL);

    this.totalBar = colored(geom, minorColor, {
      unshaded: true,
      side: THREE.BackSide
    });

    this.valueBar = colored(geom, majorColor, {
      unshaded: true
    });
    this.valueBar.scale.set(0, INSET, INSET);

    this.totalBar.add(this.valueBar);

    this.fileState = null;
    this.reset();
  }

  _createClass(Progress, [{
    key: "addToBrowserEnvironment",
    value: function addToBrowserEnvironment(env, scene) {
      scene.add(this.totalBar);
    }
  }, {
    key: "reset",
    value: function reset() {
      this.fileState = {};
      this.value = 0;
    }
  }, {
    key: "onProgress",
    value: function onProgress(evt) {
      var file = evt.target.responseURL || evt.target.currentSrc;
      if (file && evt.loaded !== undefined) {
        if (!this.fileState[file]) {
          this.fileState[file] = {};
        }
        var f = this.fileState[file];
        f.loaded = evt.loaded;
        f.total = evt.total;
      }

      var total = 0,
          loaded = 0;
      for (var key in this.fileState) {
        var _f = this.fileState[key];
        total += _f.total;
        loaded += _f.loaded;
      }

      if (total > 0) {
        this.value = loaded / total;
      } else {
        this.value = 0;
      }
    }
  }, {
    key: "visible",
    get: function get() {
      return this.totalBar.visible;
    },
    set: function set(v) {
      this.totalBar.visible = v;
    }
  }, {
    key: "position",
    get: function get() {
      return this.totalBar.position;
    }
  }, {
    key: "quaternion",
    get: function get() {
      return this.totalBar.quaternion;
    }
  }, {
    key: "value",
    get: function get() {
      return this.valueBar.scale.x;
    },
    set: function set(v) {
      this.valueBar.scale.x = v * INSET_LARGE;
      this.valueBar.position.x = -SIZE * (1 - v) * INSET_LARGE / 2;
    }
  }]);

  return Progress;
}();
    if(typeof window !== "undefined") window.Primrose.Controls.Progress = Progress;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\Progress.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Controls\VUMeter.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (VUMeter.__proto__ || Object.getPrototypeOf(VUMeter)).call(this, patch(options, {
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
    if(typeof window !== "undefined") window.Primrose.Controls.VUMeter = VUMeter;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Controls\VUMeter.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\DOM\cascadeElement.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.DOM.cascadeElement = cascadeElement;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\DOM\cascadeElement.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\DOM\findEverything.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.DOM.findEverything = findEverything;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\DOM\findEverything.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\DOM\makeHidingContainer.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.DOM.makeHidingContainer = makeHidingContainer;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\DOM\makeHidingContainer.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\del.js
(function(){"use strict";

function del(type, url, options) {
  return Primrose.HTTP.XHR("DELETE", type, url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.del = del;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\del.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\delObject.js
(function(){"use strict";

function delObject(url, options) {
  return Primrose.HTTP.del("json", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.delObject = delObject;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\delObject.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\get.js
(function(){"use strict";

function get(type, url, options) {
  return Primrose.HTTP.XHR("GET", type || "text", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.get = get;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\get.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\getBuffer.js
(function(){"use strict";

function getBuffer(url, options) {
  return Primrose.HTTP.get("arraybuffer", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.getBuffer = getBuffer;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\getBuffer.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\getObject.js
(function(){"use strict";

function getObject(url, options) {
  return Primrose.HTTP.get("json", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.getObject = getObject;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\getObject.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\getText.js
(function(){"use strict";

function getText(url, options) {
  return Primrose.HTTP.get("text", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.getText = getText;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\getText.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\post.js
(function(){"use strict";

function post(type, url, options) {
  return Primrose.HTTP.XHR("POST", type, url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.post = post;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\post.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\postObject.js
(function(){"use strict";

function postObject(url, options) {
  return Primrose.HTTP.post("json", url, options);
}
    if(typeof window !== "undefined") window.Primrose.HTTP.postObject = postObject;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\postObject.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\HTTP\XHR.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.HTTP.XHR = XHR;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\HTTP\XHR.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\FPSInput.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISPLACEMENT = new THREE.Vector3(),
    EULER_TEMP = new THREE.Euler(),
    WEDGE = Math.PI / 3;

var FPSInput = function (_Primrose$AbstractEve) {
  _inherits(FPSInput, _Primrose$AbstractEve);

  function FPSInput(DOMElement, options) {
    _classCallCheck(this, FPSInput);

    var _this = _possibleConstructorReturn(this, (FPSInput.__proto__ || Object.getPrototypeOf(FPSInput)).call(this));

    DOMElement = DOMElement || window;
    _this.options = options;
    _this._handlers.zero = [];
    _this._handlers.motioncontroller = [];
    _this._handlers.gamepad = [];

    _this.managers = [];
    _this.newState = [];
    _this.pointers = [];
    _this.motionDevices = [];
    _this.velocity = new THREE.Vector3();
    _this.matrix = new THREE.Matrix4();

    _this.add(new Primrose.Input.Keyboard(_this, {
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
        commandUp: emit.bind(_this, "zero")
      }
    }));

    _this.Keyboard.operatingSystem = _this.options.os;
    _this.Keyboard.codePage = _this.options.language;

    _this.add(new Primrose.Input.Touch(DOMElement, {
      buttons: {
        axes: ["FINGERS"]
      },
      dButtons: {
        axes: ["FINGERS"],
        delta: true
      },
      dx: {
        axes: ["X0"],
        delta: true,
        scale: -0.005,
        min: -5,
        max: 5
      },
      heading: {
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: ["Y0"],
        delta: true,
        scale: -0.005,
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

    _this.add(new Primrose.Input.Mouse(DOMElement, {
      buttons: {
        axes: ["BUTTONS"]
      },
      dButtons: {
        axes: ["BUTTONS"],
        delta: true
      },
      dx: {
        axes: ["X"],
        delta: true,
        scale: -0.005,
        min: -5,
        max: 5
      },
      heading: {
        metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
        commands: ["dx"],
        integrate: true
      },
      dy: {
        axes: ["Y"],
        delta: true,
        scale: -0.005,
        min: -5,
        max: 5
      },
      pitch: {
        metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
        commands: ["dy"],
        integrate: true,
        min: -Math.PI * 0.5,
        max: Math.PI * 0.5
      }
    }));

    _this.add(new Primrose.Input.VR(_this.options.avatarHeight));
    _this.motionDevices.push(_this.VR);

    Primrose.Input.Gamepad.addEventListener("gamepadconnected", function (pad) {
      var padID = Primrose.Input.Gamepad.ID(pad),
          mgr;

      if (padID !== "Unknown" && padID !== "Rift") {
        if (Primrose.Input.Gamepad.isMotionController(pad)) {
          var controllerNumber = 0;
          for (var i = 0; i < _this.managers.length; ++i) {
            mgr = _this.managers[i];
            if (mgr.currentPad && mgr.currentPad.id === pad.id) {
              ++controllerNumber;
            }
          }

          mgr = new Primrose.Input.Gamepad(pad, controllerNumber, {
            buttons: {
              axes: ["BUTTONS"]
            },
            dButtons: {
              axes: ["BUTTONS"],
              delta: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
              commandUp: emit.bind(_this, "zero")
            }
          });

          _this.add(mgr);
          _this.motionDevices.push(mgr);

          var shift = (_this.motionDevices.length - 2) * 8,
              color = 0x0000ff << shift,
              emission = 0x00007f << shift,
              ptr = new Primrose.Pointer(padID + "Pointer", color, emission, [mgr]);

          ptr.add(colored(box(0.1, 0.025, 0.2), color, {
            emissive: emission
          }));

          _this.pointers.push(ptr);
          ptr.addToBrowserEnvironment(null, _this.options.scene);
          ptr.forward(_this, Primrose.Pointer.EVENTS);
        } else {
          mgr = new Primrose.Input.Gamepad(pad, 0, {
            buttons: {
              axes: ["BUTTONS"]
            },
            dButtons: {
              axes: ["BUTTONS"],
              delta: true
            },
            strafe: {
              axes: ["LSX"],
              deadzone: 0.2
            },
            drive: {
              axes: ["LSY"],
              deadzone: 0.2
            },
            heading: {
              axes: ["RSX"],
              scale: -1,
              deadzone: 0.2,
              integrate: true
            },
            dHeading: {
              commands: ["heading"],
              delta: true
            },
            pitch: {
              axes: ["RSY"],
              scale: -1,
              deadzone: 0.2,
              integrate: true
            },
            zero: {
              buttons: [Primrose.Input.Gamepad.XBOX_ONE_BUTTONS.BACK],
              commandUp: emit.bind(_this, "zero")
            }
          });
          _this.add(mgr);
          _this.mousePointer.addDevice(mgr, mgr, mgr);
          _this.head.addDevice(mgr, mgr, mgr);
        }
      }
    });

    Primrose.Input.Gamepad.addEventListener("gamepaddisconnected", _this.remove.bind(_this));

    _this.stage = new THREE.Object3D();

    _this.mousePointer = new Primrose.Pointer("MousePointer", 0xff0000, 0x7f0000, [_this.Mouse], [_this.VR, _this.Keyboard]);
    _this.pointers.push(_this.mousePointer);
    _this.mousePointer.addToBrowserEnvironment(null, _this.options.scene);

    _this.head = new Primrose.Pointer("GazePointer", 0xffff00, 0x7f7f00, [_this.VR, _this.Mouse, _this.Touch, _this.Keyboard]);
    _this.head.useGaze = _this.options.useGaze;
    _this.pointers.push(_this.head);
    _this.head.addToBrowserEnvironment(null, _this.options.scene);
    _this.pointers.forEach(function (ptr) {
      return ptr.forward(_this, Primrose.Pointer.EVENTS);
    });
    _this.ready = Promise.all(_this.managers.map(function (mgr) {
      return mgr.ready;
    }).filter(identity));
    return _this;
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
      var i,
          hadGamepad = this.hasGamepad;
      Primrose.Input.Gamepad.poll();
      for (i = 0; i < this.managers.length; ++i) {
        this.managers[i].update(dt);
      }
      if (!hadGamepad && this.hasGamepad) {
        this.Mouse.inPhysicalUse = false;
      }

      this.head.showPointer = this.VR.hasOrientation;
      this.mousePointer.showPointer = (this.hasMouse || this.hasGamepad) && !this.hasMotionControllers;
      this.Keyboard.enabled = this.Touch.enabled = this.Mouse.enabled = !this.hasMotionControllers;
      if (this.Gamepad_0) {
        this.Gamepad_0.enabled = !this.hasMotionControllers;
      }

      this.updateStage(dt);

      // update the motionDevices
      this.stage.updateMatrix();
      this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
      for (i = 0; i < this.motionDevices.length; ++i) {
        this.motionDevices[i].updateStage(this.matrix);
      }

      for (i = 0; i < this.pointers.length; ++i) {
        this.pointers[i].update();
      }

      if (!this.VR.isStereo && this.mousePointer.showPointer) {
        // if we're not using an HMD, then update the view according to the mouse
        this.head.quaternion.copy(this.mousePointer.quaternion);
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
    value: function resolvePicking(currentHits) {
      for (var i = 0; i < this.pointers.length; ++i) {
        var ptr = this.pointers[i];
        ptr.resolvePicking(currentHits[ptr.name]);
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
  }]);

  return FPSInput;
}(Primrose.AbstractEventEmitter);
    if(typeof window !== "undefined") window.Primrose.Input.FPSInput = FPSInput;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\FPSInput.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Gamepad.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;

function playPattern(devices, pattern, pause) {
  if (pattern.length > 0) {
    var length = pattern.shift();
    if (!pause) {
      for (var i = 0; i < devices.length; ++i) {
        devices[0].vibrate(1, length);
      }
    }
    setTimeout(playPattern, length, devices, pattern, !pause);
  }
}

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
      } else if (id.indexOf("Rift") === 0) {
        id = "Rift";
      } else if (id.indexOf("Unknown") === 0) {
        id = "Unknown";
      } else {
        id = "Gamepad";
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
          i,
          padID;

      if (maybePads) {
        for (i = 0; i < maybePads.length; ++i) {
          var maybePad = maybePads[i];
          if (maybePad) {
            padID = Gamepad.ID(maybePad);
            var padIdx = currentDeviceIDs.indexOf(padID);
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
        padID = currentDeviceIDs[i];
        var mgr = currentManagers[padID],
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
    key: "isMotionController",
    value: function isMotionController(pad) {
      if (pad) {
        var obj = pad.capabilities || pad.pose;
        return obj && obj.hasOrientation;
      }
      return false;
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

  function Gamepad(pad, axisOffset, commands) {
    _classCallCheck(this, Gamepad);

    var padID = Gamepad.ID(pad);

    var _this = _possibleConstructorReturn(this, (Gamepad.__proto__ || Object.getPrototypeOf(Gamepad)).call(this, padID, commands, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]));

    currentManagers[padID] = _this;

    _this.currentDevice = pad;
    _this.axisOffset = axisOffset;
    return _this;
  }

  _createClass(Gamepad, [{
    key: "checkDevice",
    value: function checkDevice(pad) {
      var i,
          j,
          buttonMap = 0;
      this.currentDevice = pad;
      this.currentPose = this.hasOrientation && this.currentDevice.pose;
      for (i = 0, j = pad.buttons.length; i < pad.buttons.length; ++i, ++j) {
        var btn = pad.buttons[i];
        this.setButton(i, btn.pressed);
        if (btn.pressed) {
          buttonMap |= 0x1 << i;
        }

        this.setButton(j, btn.touched);
        if (btn.touched) {
          buttonMap |= 0x1 << j;
        }
      }
      this.setAxis("BUTTONS", buttonMap);
      for (i = 0; i < pad.axes.length; ++i) {
        var axisName = this.axisNames[this.axisOffset * pad.axes.length + i],
            axisValue = pad.axes[i];
        this.setAxis(axisName, axisValue);
      }
    }
  }, {
    key: "vibratePattern",
    value: function vibratePattern(pattern) {
      if (this.currentDevice) {
        if (this.currentDevice.vibrate) {
          this.currentDevice.vibrate(pattern);
        } else if (this.currentDevice.haptics && this.currentDevice.haptics.length > 0) {
          playPattern(this.currentDevice.haptics, pattern);
        }
      }
    }
  }, {
    key: "hasOrientation",
    get: function get() {
      return Gamepad.isMotionController(this.currentDevice);
    }
  }, {
    key: "haptics",
    get: function get() {
      return this.currentDevice && this.currentDevice.haptics;
    }
  }]);

  return Gamepad;
}(Primrose.PoseInputProcessor);

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
    if(typeof window !== "undefined") window.Primrose.Input.Gamepad = Gamepad;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Gamepad.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Keyboard.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Keyboard = function (_Primrose$InputProces) {
  _inherits(Keyboard, _Primrose$InputProces);

  function Keyboard(input, commands) {
    _classCallCheck(this, Keyboard);

    var _this = _possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, "Keyboard", commands));

    _this.listeners = {
      clipboard: [],
      keydown: [],
      keyup: []
    };

    _this._operatingSystem = null;
    _this.browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
    _this._codePage = null;
    return _this;
  }

  _createClass(Keyboard, [{
    key: "dispatchEvent",
    value: function dispatchEvent(evt) {
      this.setButton(evt.keyCode, evt.type === "keydown");
    }
  }, {
    key: "addEventListener",
    value: function addEventListener(name, thunk) {
      if (this.listeners[name]) {
        this.listeners[name].push(thunk);
      }
    }
  }, {
    key: "doTyping",
    value: function doTyping(elem, evt) {
      if (elem && elem.execCommand && this.operatingSystem && this.browser && this.codePage) {
        var oldDeadKeyState = this.operatingSystem._deadKeyState,
            cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);

        if (elem.execCommand(this.browser, this.codePage, cmdName)) {
          evt.preventDefault();
        }
        if (this.operatingSystem._deadKeyState === oldDeadKeyState) {
          this.operatingSystem._deadKeyState = "";
        }
      }
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
    if(typeof window !== "undefined") window.Primrose.Input.Keyboard = Keyboard;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Keyboard.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\LeapMotion.js
(function(){"use strict";

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

  function LeapMotion(commands) {
    _classCallCheck(this, LeapMotion);

    var _this = _possibleConstructorReturn(this, (LeapMotion.__proto__ || Object.getPrototypeOf(LeapMotion)).call(this, "LeapMotion", commands, ["X0", "Y0", "Z0", "X1", "Y1", "Z1", "FINGER0TIPX", "FINGER0TIPY", "FINGER0DIPX", "FINGER0DIPY", "FINGER0PIPX", "FINGER0PIPY", "FINGER0MCPX", "FINGER0MCPY", "FINGER0CARPX", "FINGER0CARPY", "FINGER1TIPX", "FINGER1TIPY", "FINGER1DIPX", "FINGER1DIPY", "FINGER1PIPX", "FINGER1PIPY", "FINGER1MCPX", "FINGER1MCPY", "FINGER1CARPX", "FINGER1CARPY", "FINGER2TIPX", "FINGER2TIPY", "FINGER2DIPX", "FINGER2DIPY", "FINGER2PIPX", "FINGER2PIPY", "FINGER2MCPX", "FINGER2MCPY", "FINGER2CARPX", "FINGER2CARPY", "FINGER3TIPX", "FINGER3TIPY", "FINGER3DIPX", "FINGER3DIPY", "FINGER3PIPX", "FINGER3PIPY", "FINGER3MCPX", "FINGER3MCPY", "FINGER3CARPX", "FINGER3CARPY", "FINGER4TIPX", "FINGER4TIPY", "FINGER4DIPX", "FINGER4DIPY", "FINGER4PIPX", "FINGER4PIPY", "FINGER4MCPX", "FINGER4MCPY", "FINGER4CARPX", "FINGER4CARPY", "FINGER5TIPX", "FINGER5TIPY", "FINGER5DIPX", "FINGER5DIPY", "FINGER5PIPX", "FINGER5PIPY", "FINGER5MCPX", "FINGER5MCPY", "FINGER5CARPX", "FINGER5CARPY", "FINGER6TIPX", "FINGER6TIPY", "FINGER6DIPX", "FINGER6DIPY", "FINGER6PIPX", "FINGER6PIPY", "FINGER6MCPX", "FINGER6MCPY", "FINGER6CARPX", "FINGER6CARPY", "FINGER7TIPX", "FINGER7TIPY", "FINGER7DIPX", "FINGER7DIPY", "FINGER7PIPX", "FINGER7PIPY", "FINGER7MCPX", "FINGER7MCPY", "FINGER7CARPX", "FINGER7CARPY", "FINGER8TIPX", "FINGER8TIPY", "FINGER8DIPX", "FINGER8DIPY", "FINGER8PIPX", "FINGER8PIPY", "FINGER8MCPX", "FINGER8MCPY", "FINGER8CARPX", "FINGER8CARPY", "FINGER9TIPX", "FINGER9TIPY", "FINGER9DIPX", "FINGER9DIPY", "FINGER9PIPX", "FINGER9PIPY", "FINGER9MCPX", "FINGER9MCPY", "FINGER9CARPX", "FINGER9CARPY"]));

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

LeapMotion.CONNECTION_TIMEOUT = 5000;
    if(typeof window !== "undefined") window.Primrose.Input.LeapMotion = LeapMotion;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\LeapMotion.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Location.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Location = function (_Primrose$InputProces) {
  _inherits(Location, _Primrose$InputProces);

  function Location(commands, options) {
    _classCallCheck(this, Location);

    var _this = _possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, "Location", commands, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]));

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
        if (this.axisNames.indexOf(k) > -1) {
          this.setAxis(k, location.coords[p]);
        }
      }
      this.update();
    }
  }]);

  return Location;
}(Primrose.InputProcessor);

Location.DEFAULTS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 25000
};
    if(typeof window !== "undefined") window.Primrose.Input.Location = Location;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Location.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Mouse.js
(function(){"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mouse = function (_Primrose$InputProces) {
  _inherits(Mouse, _Primrose$InputProces);

  function Mouse(DOMElement, commands) {
    _classCallCheck(this, Mouse);

    var _this = _possibleConstructorReturn(this, (Mouse.__proto__ || Object.getPrototypeOf(Mouse)).call(this, "Mouse", commands, ["BUTTONS", "X", "Y", "Z", "W"]));

    _this.timer = null;

    DOMElement = DOMElement || window;

    var setState = function setState(stateChange, event) {
      var state = event.buttons,
          button = 0;
      while (state > 0) {
        var isDown = state & 0x1 !== 0;
        if (isDown && stateChange || !isDown && !stateChange) {
          _this.setButton(button, stateChange);
        }
        state >>= 1;
        ++button;
      }
      _this.setAxis("BUTTONS", event.buttons << 10);
      event.preventDefault();
    };

    DOMElement.addEventListener("mousedown", setState.bind(_this, true), false);
    DOMElement.addEventListener("mouseup", setState.bind(_this, false), false);
    DOMElement.addEventListener("mousemove", function (event) {
      setState(true, event);

      if (PointerLock.isActive) {
        var mx = event.movementX,
            my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        _this.setAxis("X", _this.getAxis("X") + mx);
        _this.setAxis("Y", _this.getAxis("Y") + my);
      } else {
        _this.setAxis("X", event.layerX);
        _this.setAxis("Y", event.layerY);
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

  return Mouse;
}(Primrose.InputProcessor);
    if(typeof window !== "undefined") window.Primrose.Input.Mouse = Mouse;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Mouse.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Speech.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Speech = function (_Primrose$InputProces) {
  _inherits(Speech, _Primrose$InputProces);

  function Speech(commands) {
    _classCallCheck(this, Speech);

    var _this = _possibleConstructorReturn(this, (Speech.__proto__ || Object.getPrototypeOf(Speech)).call(this, "Speech", commands));

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
      _get(Speech.prototype.__proto__ || Object.getPrototypeOf(Speech.prototype), "enable", this).call(this, k, v);
      this.check();
    }
  }, {
    key: "transmit",
    value: function transmit(v) {
      _get(Speech.prototype.__proto__ || Object.getPrototypeOf(Speech.prototype), "transmit", this).call(this, v);
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
    if(typeof window !== "undefined") window.Primrose.Input.Speech = Speech;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Speech.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\Touch.js
(function(){"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Touch = function (_Primrose$InputProces) {
  _inherits(Touch, _Primrose$InputProces);

  function Touch(DOMElement, commands) {
    _classCallCheck(this, Touch);

    var axes = ["FINGERS"];
    for (var i = 0; i < 10; ++i) {
      axes.push("X" + i);
      axes.push("Y" + i);
      axes.push("LX" + i);
      axes.push("LY" + i);
    }

    var _this = _possibleConstructorReturn(this, (Touch.__proto__ || Object.getPrototypeOf(Touch)).call(this, "Touch", commands, axes));

    DOMElement = DOMElement || window;

    var setState = function setState(stateChange, setAxis, event) {
      var touches = event.changedTouches,
          i = 0,
          t = null;
      for (i = 0; i < touches.length; ++i) {
        t = touches[i];

        if (setAxis) {
          _this.setAxis("X" + t.identifier, t.pageX);
          _this.setAxis("Y" + t.identifier, t.pageY);
        } else {
          _this.setAxis("LX" + t.identifier, t.pageX);
          _this.setAxis("LY" + t.identifier, t.pageY);
        }

        _this.setButton("FINGER" + t.identifier, stateChange);
      }
      touches = event.touches;
      var fingerState = 0,
          before = _this.getAxis("FINGERS");
      for (i = 0; i < touches.length; ++i) {
        t = touches[i];
        fingerState |= 1 << t.identifier;
      }
      _this.setAxis("FINGERS", fingerState);
      event.preventDefault();
    };

    DOMElement.addEventListener("touchstart", setState.bind(_this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(_this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(_this, true, true), false);
    return _this;
  }

  return Touch;
}(Primrose.InputProcessor);
    if(typeof window !== "undefined") window.Primrose.Input.Touch = Touch;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\Touch.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Input\VR.js
(function(){"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEFAULT_POSE = {
  position: [0, 0, 0],
  orientation: [0, 0, 0, 1]
},
    GAZE_LENGTH = 3000,
    _ = priv();

var VR = function (_Primrose$PoseInputPr) {
  _inherits(VR, _Primrose$PoseInputPr);

  _createClass(VR, null, [{
    key: "isStereoDisplay",
    value: function isStereoDisplay(display) {
      var leftParams = display.getEyeParameters("left"),
          rightParams = display.getEyeParameters("right");
      return !!(leftParams && rightParams);
    }
  }]);

  function VR(avatarHeight) {
    _classCallCheck(this, VR);

    var _this = _possibleConstructorReturn(this, (VR.__proto__ || Object.getPrototypeOf(VR)).call(this, "VR"));

    _(_this, {
      requestPresent: function requestPresent(layers) {
        return _this.currentDevice.requestPresent(layers).catch(function (exp) {
          return console.warn("requstPresent", exp);
        });
      }
    });

    _this.displays = [];
    _this._transformers = [];
    _this.currentDeviceIndex = -1;
    _this.movePlayer = new THREE.Matrix4();
    _this.defaultAvatarHeight = avatarHeight;
    _this.stage = null;
    _this.lastStageWidth = null;
    _this.lastStageDepth = null;
    _this.isStereo = false;

    console.info("Checking for displays...");
    _this.ready = navigator.getVRDisplays().then(function (displays) {
      // We skip the WebVR-Polyfill's Mouse and Keyboard display because it does not
      // play well with our interaction model.
      _this.displays.push.apply(_this.displays, displays.filter(function (display) {
        return display.displayName !== "Mouse and Keyboard VRDisplay (webvr-polyfill)";
      }));
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
        var leftParams = this.currentDevice.getEyeParameters("left"),
            fov = leftParams.fieldOfView;
        this.rotationAngle = Math.PI * (fov.leftDegrees + fov.rightDegrees) / 360;
        this.isStereo = VR.isStereoDisplay(this.currentDevice);
      }
    }
  }, {
    key: "requestPresent",
    value: function requestPresent(opts) {
      var _this2 = this;

      if (!this.currentDevice) {
        return Promise.reject("No display");
      } else {
        var promise, rp;

        var _ret = function () {
          var layers = opts,
              elem = opts[0].source;

          if (!(layers instanceof Array)) {
            layers = [layers];
          }

          // A hack to deal with a bug in the current build of Chromium
          if (_this2.isNativeMobileWebVR) {
            layers = layers[0];
          }

          promise = null;
          rp = _(_this2).requestPresent;

          // If we're using WebVR-Polyfill, just let it do its job.

          if (_this2.currentDevice.isPolyfilled) {
            // for Firefox's sake, this can't be done in a Promise.
            promise = rp(layers);
          } else {
            // PCs with HMD should also make the browser window on the main
            // display full-screen, so we can then also lock pointer.
            promise = WebVRStandardMonitor.standardFullScreenBehavior(elem).then(function () {
              return rp(layers);
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
      _get(VR.prototype.__proto__ || Object.getPrototypeOf(VR.prototype), "zero", this).call(this);
      if (this.currentDevice) {
        this.currentDevice.resetPose();
      }
    }
  }, {
    key: "update",
    value: function update(dt) {
      _get(VR.prototype.__proto__ || Object.getPrototypeOf(VR.prototype), "update", this).call(this, dt);

      var x, z, stage;

      if (this.currentDevice) {
        this.currentPose = this.currentDevice.getPose();
        stage = this.currentDevice.stageParameters;
      } else {
        stage = null;
      }

      if (stage) {
        this.movePlayer.fromArray(stage.sittingToStandingTransform);
        x = stage.sizeX;
        z = stage.sizeZ;
      } else {
        this.movePlayer.makeTranslation(0, this.defaultAvatarHeight, 0);
        x = 0;
        z = 0;
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
      _get(VR.prototype.__proto__ || Object.getPrototypeOf(VR.prototype), "resolvePicking", this).call(this, currentHits, lastHits, objects);

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
        this.currentDevice.depthNear = near;
        this.currentDevice.depthFar = far;
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
      if (this.isPresenting) {
        var layers = this.currentDevice.getLayers();
        if (layers.length > 0) {
          return layers[0].source;
        }
      }
      return null;
    }
  }]);

  return VR;
}(Primrose.PoseInputProcessor);
    if(typeof window !== "undefined") window.Primrose.Input.VR = VR;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Input\VR.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Network\AudioChannel.js
(function(){'use strict';

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

    var _this = _possibleConstructorReturn(this, (AudioChannel.__proto__ || Object.getPrototypeOf(AudioChannel)).call(this, extraIceServers, proxyServer, fromUserName, 0, toUserName, 0, goSecond));

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
          if (_this2.rtc.addTrack) {
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
          _this2.clearTimeout();
          _this2._log(1, "Restarting timeout.");
          _this2.startTimeout();
          addStream();
        }
      };

      // Wait to receive an audio track.
      if (this.rtc.ontrack) {
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
      if (this.rtc.ontrack) {
        this.rtc.ontrack = null;
      }
      if (this.rtc.onaddstream) {
        this.rtc.onaddstream = null;
      }
    }
  }, {
    key: 'createOffer',
    value: function createOffer() {
      return _get(AudioChannel.prototype.__proto__ || Object.getPrototypeOf(AudioChannel.prototype), 'createOffer', this).call(this).then(preferOpus);
    }
  }, {
    key: 'complete',
    get: function get() {
      if (this.goFirst) {
        this._log(1, "[First]: OC %s -> AR %s -> OR %s -> AC %s.", this.progress.offer.created, this.progress.answer.received, this.progress.offer.received, this.progress.answer.created);
      } else {
        this._log(1, "[Second]: OR %s -> AC %s -> OC %s -> AR %s.", this.progress.offer.received, this.progress.answer.created, this.progress.offer.created, this.progress.answer.received);
      }

      return _get(AudioChannel.prototype.__proto__ || Object.getPrototypeOf(AudioChannel.prototype), 'complete', this) || this.progress.offer.received && this.progress.offer.created && this.progress.answer.received && this.progress.answer.created;
    }
  }]);

  return AudioChannel;
}(Primrose.WebRTCSocket);
    if(typeof window !== "undefined") window.Primrose.Network.AudioChannel = AudioChannel;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Network\AudioChannel.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Network\DataChannel.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (DataChannel.__proto__ || Object.getPrototypeOf(DataChannel)).call(this, extraIceServers, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond));

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
      return _get(DataChannel.prototype.__proto__ || Object.getPrototypeOf(DataChannel.prototype), "complete", this) || this.goFirst && this.progress.offer.created && this.progress.answer.received || !this.goFirst && this.progress.offer.recieved && this.progress.answer.created;
    }
  }]);

  return DataChannel;
}(Primrose.WebRTCSocket);
    if(typeof window !== "undefined") window.Primrose.Network.DataChannel = DataChannel;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Network\DataChannel.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Network\Manager.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Manager = function (_Primrose$AbstractEve) {
  _inherits(Manager, _Primrose$AbstractEve);

  function Manager(localUser, audio, factories, options) {
    _classCallCheck(this, Manager);

    var _this = _possibleConstructorReturn(this, (Manager.__proto__ || Object.getPrototypeOf(Manager)).call(this));

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
          user.setState(state);
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
    if(typeof window !== "undefined") window.Primrose.Network.Manager = Manager;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Network\Manager.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Network\RemoteUser.js
(function(){"use strict";

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
        colored(obj, Primrose.Random.color());
      } else if (obj.name === "AvatarHead") {
        _this.head = obj;
      }
    });

    this.nameObject = colored(text3D(0.1, userName), nameMaterial);
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
    key: "setState",
    value: function setState(v) {
      this.time = 0;
      this._predict(this.headPosition, v, 1);
      this._predict(this.stageQuaternion, v, 4);
      this._predict(this.headQuaternion, v, 8);
    }
  }, {
    key: "toString",
    value: function toString(digits) {
      return this.stage.position.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
    }
  }]);

  return RemoteUser;
}();

RemoteUser.FADE_FACTOR = 0.5;
RemoteUser.NETWORK_DT = 0.10;
RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
    if(typeof window !== "undefined") window.Primrose.Network.RemoteUser = RemoteUser;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Network\RemoteUser.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Output\Audio3D.js
(function(){"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// polyfill
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
          var snd = null;
          if (_this4.context) {
            audio.oncanplay = null;
            snd = {
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
    if(typeof window !== "undefined") window.Primrose.Output.Audio3D = Audio3D;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Output\Audio3D.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Output\HapticGlove.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Output.HapticGlove = HapticGlove;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Output\HapticGlove.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Output\Music.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Output.Music = Music;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Output\Music.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Output\Speech.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Output.Speech = Speech;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Output\Speech.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\color.js
(function(){"use strict";

function color() {
  var r = Primrose.Random.int(0, 256),
      g = Primrose.Random.int(0, 256),
      b = Primrose.Random.int(0, 256);
  return r << 16 | g << 8 | b;
}
    if(typeof window !== "undefined") window.Primrose.Random.color = color;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\color.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\ID.js
(function(){"use strict";

function ID() {
  return (Math.random() * Math.log(Number.MAX_VALUE)).toString(36).replace(".", "");
}
    if(typeof window !== "undefined") window.Primrose.Random.ID = ID;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\ID.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\int.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Random.int = int;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\int.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\item.js
(function(){"use strict";

function item(arr) {
  return arr[Primrose.Random.int(arr.length)];
}
    if(typeof window !== "undefined") window.Primrose.Random.item = item;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\item.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\number.js
(function(){"use strict";

function number(min, max) {
  return Math.random() * (max - min) + min;
}
    if(typeof window !== "undefined") window.Primrose.Random.number = number;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\number.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Random\steps.js
(function(){"use strict";

function steps(min, max, steps) {
  return min + Primrose.Random.int(0, (1 + max - min) / steps) * steps;
}
    if(typeof window !== "undefined") window.Primrose.Random.steps = steps;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Random\steps.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePage.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CodePage = CodePage;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePage.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePages.js
(function(){"use strict";

var CodePages = {};
    if(typeof window !== "undefined") window.Primrose.Text.CodePages = CodePages;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePages.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CommandPack.js
(function(){"use strict";

function CommandPack(name, commands) {
  this.name = name;
  copyObject(this, commands);
}
    if(typeof window !== "undefined") window.Primrose.Text.CommandPack = CommandPack;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CommandPack.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks.js
(function(){"use strict";

var CommandPacks = {};
    if(typeof window !== "undefined") window.Primrose.Text.CommandPacks = CommandPacks;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Controls.js
(function(){"use strict";

var Controls = {};
    if(typeof window !== "undefined") window.Primrose.Text.Controls = Controls;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Controls.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Cursor.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Cursor = Cursor;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Cursor.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammar.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Grammar = Grammar;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammar.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammars.js
(function(){"use strict";

var Grammars = {};
    if(typeof window !== "undefined") window.Primrose.Text.Grammars = Grammars;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammars.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystem.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.OperatingSystem = OperatingSystem;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystem.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems.js
(function(){"use strict";

var OperatingSystems = {};
    if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems = OperatingSystems;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Point.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Point = Point;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Point.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Rectangle.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Rectangle = Rectangle;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Rectangle.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Rule.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Rule = Rule;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Rule.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Size.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Size = Size;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Size.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Terminal.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Terminal = Terminal;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Terminal.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Themes.js
(function(){"use strict";

var Themes = {};
    if(typeof window !== "undefined") window.Primrose.Text.Themes = Themes;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Themes.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Token.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Token = Token;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Token.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\DE_QWERTZ.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CodePages.DE_QWERTZ = DE_QWERTZ;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\DE_QWERTZ.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\EN_UKX.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CodePages.EN_UKX = EN_UKX;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\EN_UKX.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\EN_US.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CodePages.EN_US = EN_US;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\EN_US.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\FR_AZERTY.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CodePages.FR_AZERTY = FR_AZERTY;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CodePages\FR_AZERTY.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\BasicTextInput.js
(function(){"use strict";

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

    return _possibleConstructorReturn(this, (BasicTextInput.__proto__ || Object.getPrototypeOf(BasicTextInput)).call(this, additionalName || "Text editor commands", commands));
  }

  return BasicTextInput;
}(Primrose.Text.CommandPack);
    if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.BasicTextInput = BasicTextInput;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\BasicTextInput.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\TextEditor.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.TextEditor = TextEditor;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\TextEditor.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\TextInput.js
(function(){"use strict";

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
var TextInput = new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
    if(typeof window !== "undefined") window.Primrose.Text.CommandPacks.TextInput = TextInput;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\CommandPacks\TextInput.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Controls\PlainText.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Controls.PlainText = PlainText;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Controls\PlainText.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Controls\TextBox.js
(function(){"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SCROLL_SCALE = isFirefox ? 3 : 100,
    COUNTER = 0,
    OFFSET = 0;

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

    var _this = _possibleConstructorReturn(this, (TextBox.__proto__ || Object.getPrototypeOf(TextBox)).call(this, patch(options, {
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
      if (!_get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "startPointer", this).call(this, x, y)) {
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
      _get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "endPointer", this).call(this);
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
    key: "keyDown",
    value: function keyDown(evt) {
      this.environment.input.Keyboard.doTyping(this, evt);
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
      _get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "resize", this).call(this);
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
    if(typeof window !== "undefined") window.Primrose.Text.Controls.TextBox = TextBox;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Controls\TextBox.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Controls\TextInput.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, copyObject(patch(options, {
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
      _get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "drawText", this).call(this, ctx, txt, x, y);
    }
  }, {
    key: "value",
    get: function get() {
      return _get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "value", this);
    },
    set: function set(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      _set(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "value", v, this);
    }
  }, {
    key: "selectedText",
    get: function get() {
      return _get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "selectedText", this);
    },
    set: function set(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      _set(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "selectedText", v, this);
    }
  }]);

  return TextInput;
}(Primrose.Text.Controls.TextBox);
    if(typeof window !== "undefined") window.Primrose.Text.Controls.TextInput = TextInput;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Controls\TextInput.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\Basic.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Grammars.Basic = Basic;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\Basic.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\JavaScript.js
(function(){"use strict";

var JavaScript = new Primrose.Text.Grammar("JavaScript", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /\/\*/], ["endBlockComments", /\*\//], ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/], ["stringDelim", /("|')/], ["startLineComments", /\/\/.*$/m], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/], ["functions", /(\w+)(?:\s*\()/], ["members", /(\w+)\./], ["members", /((\w+\.)+)(\w+)/]]);
    if(typeof window !== "undefined") window.Primrose.Text.Grammars.JavaScript = JavaScript;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\JavaScript.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\PlainText.js
(function(){"use strict";

var PlainText = new Primrose.Text.Grammar("PlainText", [["newlines", /(?:\r\n|\r|\n)/]]);
    if(typeof window !== "undefined") window.Primrose.Text.Grammars.PlainText = PlainText;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\PlainText.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\TestResults.js
(function(){"use strict";

var TestResults = new Primrose.Text.Grammar("TestResults", [["newlines", /(?:\r\n|\r|\n)/, true], ["numbers", /(\[)(o+)/, true], ["numbers", /(\d+ succeeded), 0 failed/, true], ["numbers", /^    Successes:/, true], ["functions", /(x+)\]/, true], ["functions", /[1-9]\d* failed/, true], ["functions", /^    Failures:/, true], ["comments", /(\d+ms:)(.*)/, true], ["keywords", /(Test results for )(\w+):/, true], ["strings", /        \w+/, true]]);
    if(typeof window !== "undefined") window.Primrose.Text.Grammars.TestResults = TestResults;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Grammars\TestResults.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems\OSX.js
(function(){"use strict";

var OSX = new Primrose.Text.OperatingSystem("OS X", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");
    if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems.OSX = OSX;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems\OSX.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems\Windows.js
(function(){"use strict";

////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
var Windows = new Primrose.Text.OperatingSystem("Windows", "CTRL", "CTRL", "CTRL_y", "", "HOME", "END", "CTRL", "HOME", "END");
    if(typeof window !== "undefined") window.Primrose.Text.OperatingSystems.Windows = Windows;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\OperatingSystems\Windows.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Themes\Dark.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Themes.Dark = Dark;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Themes\Dark.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\Text\Themes\Default.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.Primrose.Text.Themes.Default = Default;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\Text\Themes\Default.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\X\LoginForm.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (LoginForm.__proto__ || Object.getPrototypeOf(LoginForm)).call(this, {
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
    if(typeof window !== "undefined") window.Primrose.X.LoginForm = LoginForm;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\X\LoginForm.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\Primrose\X\SignupForm.js
(function(){"use strict";

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

    var _this = _possibleConstructorReturn(this, (SignupForm.__proto__ || Object.getPrototypeOf(SignupForm)).call(this, {
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
    if(typeof window !== "undefined") window.Primrose.X.SignupForm = SignupForm;
})();
    // end D:\Documents\VR\Primrose\src\Primrose\X\SignupForm.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Matrix4\prototype\debug.js
(function(){"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label + "\n" + val);
  }
}
    if(typeof window !== "undefined") window.THREE.Matrix4.prototype.debug = debug;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Matrix4\prototype\debug.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Matrix4\prototype\toString.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.THREE.Matrix4.prototype.toString = toString;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Matrix4\prototype\toString.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Object3D\prototype\addToBrowserEnvironment.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.THREE.Object3D.prototype.addToBrowserEnvironment = addToBrowserEnvironment;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Object3D\prototype\addToBrowserEnvironment.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Quaternion\prototype\debug.js
(function(){"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
    if(typeof window !== "undefined") window.THREE.Quaternion.prototype.debug = debug;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Quaternion\prototype\debug.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Quaternion\prototype\toString.js
(function(){"use strict";

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
    if(typeof window !== "undefined") window.THREE.Quaternion.prototype.toString = toString;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Quaternion\prototype\toString.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Vector3\prototype\debug.js
(function(){"use strict";

function debug(label, digits) {
  var val = this.toString(digits);
  if (val !== this.lastVal) {
    this.lastVal = val;
    console.log(label, val);
  }
}
    if(typeof window !== "undefined") window.THREE.Vector3.prototype.debug = debug;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Vector3\prototype\debug.js
    ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
    // start D:\Documents\VR\Primrose\src\THREE\Vector3\prototype\toString.js
(function(){"use strict";

function toString(digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    parts = parts.map(function (v) {
      return v.toFixed(digits);
    });
  }
  return "<" + parts.join(", ") + ">";
}
    if(typeof window !== "undefined") window.THREE.Vector3.prototype.toString = toString;
})();
    // end D:\Documents\VR\Primrose\src\THREE\Vector3\prototype\toString.js
    ////////////////////////////////////////////////////////////////////////////////
console.info("primrose v0.26.24. see https://www.primrosevr.com for more information.");