"use strict";

/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
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

var setFalse = function setFalse(evt) {
  return evt.returnValue = false;
};

window.Primrose = function () {
  "use strict";

  var Primrose = {};

  Primrose.Controls = {};

  Primrose.DOM = {};

  Primrose.HTTP = {};

  Primrose.Input = {};

  Primrose.Network = {};

  Primrose.Output = {};

  Primrose.Random = {};

  Primrose.Text = {};

  Primrose.Text.CodePages = {};

  Primrose.Text.CommandPacks = {};

  Primrose.Text.Controls = {};

  Primrose.Text.Grammars = {};

  Primrose.Text.OperatingSystems = {};

  Primrose.Text.Renderers = {};

  Primrose.Text.Themes = {};

  Primrose.X = {};

  Primrose.SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

  Primrose.SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2", "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49", "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836", "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000", "#5B0001", "#302E2E"];

  Primrose.SKIN_VALUES = Primrose.SKINS.map(function (s) {
    return parseInt(s.substring(1), 16);
  });

  window.isInIFrame = window.self !== window.top;

  // snagged and adapted from http://detectmobilebrowsers.com/
  window.isMobile = function (a) {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4))
    );
  }(navigator.userAgent || navigator.vendor || window.opera);

  window.isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;

  window.isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");

  window.isOSX = /Macintosh/.test(navigator.userAgent || "");

  window.isWindows = /Windows/.test(navigator.userAgent || "");

  window.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  window.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

  window.isChrome = !!window.chrome && !window.isOpera;

  window.isFirefox = typeof window.InstallTrigger !== 'undefined';

  window.isWebKit = window.isiOS || window.isOpera || window.isChrome;

  window.isIE = /*@cc_on!@*/false || !!document.documentMode;

  Primrose.RESOLUTION_SCALES = [0.5, 0.25, 0.333333, 0.5, 1];
  if (!isMobile) {
    Primrose.RESOLUTION_SCALES.push(2);
  }

  Primrose.Quality = {
    NONE: 0,
    VERYLOW: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
    MAXIMUM: Primrose.RESOLUTION_SCALES.length - 1
  };

  return Primrose;
}();
"use strict";

function axis(length, width) {
  var center = hub();
  put(brick(0xff0000, length, width, width)).on(center);
  put(brick(0x00ff00, width, length, width)).on(center);
  put(brick(0x0000ff, width, width, length)).on(center);
  return center;
}
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
"use strict";

function brick(txt, w, h, l) {
  return textured(box(w || 1, h || 1, l || 1), txt, {
    txtRepeatS: w,
    txtRepeatT: l
  });
}
"use strict";

var cache = function () {
  var cache = {};
  return function (hash, makeObject) {
    if (!cache[hash]) {
      cache[hash] = makeObject();
    }
    return cache[hash];
  };
}();
"use strict";

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
"use strict";

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
"use strict";

function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  return cache("CylinderGeometry(" + rT + ", " + rB + ", " + height + ", " + rS + ", " + hS + ", " + openEnded + ", " + thetaStart + ", " + thetaEnd + ")", function () {
    return new THREE.CylinderGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd);
  });
}
"use strict";

function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (elem[arr[i]] !== undefined) {
      return arr[i];
    }
  }
}
"use strict";

function sigfig(x, y) {
  var p = Math.pow(10, y);
  var v = (Math.round(x * p) / p).toString();
  if (y > 0) {
    var i = v.indexOf(".");
    if (i === -1) {
      v += ".";
      i = v.length - 1;
    }
    while (v.length - i - 1 < y) {
      v += "0";
    }
  }
  return v;
}

var fmt = function () {

  function addMillis(val, txt) {
    return txt.replace(/( AM| PM|$)/, function (match, g1) {
      return (val.getMilliseconds() / 1000).toString().substring(1) + g1;
    });
  }

  // - match a dollar sign ($) literally,
  // - (optional) then zero or more zero digit (0) characters, greedily
  // - then one or more digits (the previous rule would necessitate that
  //      the first of these digits be at least one).
  // - (optional) then a period (.) literally
  // -            then one or more zero digit (0) characters
  var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;

  function fmt(template) {
    var args = arguments;
    if (typeof template !== "string") {
      template = template.toString();
    }
    return template.replace(paramRegex, function (m, pad, index, precision) {
      index = parseInt(index, 10);
      if (0 <= index && index < args.length) {
        var val = args[index];
        if (val !== null && val !== undefined) {
          if (val instanceof Date && precision) {
            switch (precision.length) {
              case 1:
                val = val.getYear() + 1900;
                break;
              case 2:
                val = val.getMonth() + 1 + "/" + (val.getYear() + 1900);
                break;
              case 3:
                val = val.toLocaleDateString();
                break;
              case 4:
                val = addMillis(val, val.toLocaleTimeString());
                break;
              case 5:
              case 6:
                val = val.toLocaleString();
                break;
              default:
                val = addMillis(val, val.toLocaleString());
                break;
            }
            return val;
          } else {
            if (precision && precision.length > 0) {
              val = sigfig(val, precision.length);
            } else {
              val = val.toString();
            }
            if (pad && pad.length > 0) {
              var paddingRegex = new RegExp("^\\d{" + (pad.length + 1) + "}(\\.\\d+)?");
              while (!paddingRegex.test(val)) {
                val = "0" + val;
              }
            }
            return val;
          }
        }
      }
      return undefined;
    });
  }
  return fmt;
}();

var px = fmt.bind(undefined, "$1px");

var pct = fmt.bind(undefined, "$1%");

var ems = fmt.bind(undefined, "$1em");

var rems = fmt.bind(undefined, "$1rem");

var vws = fmt.bind(undefined, "$1vw");

var rgb = fmt.bind(undefined, "rgb($1, $2, $3)");

var rgba = fmt.bind(undefined, "rgba($1, $2, $3, $4)");

var hsl = fmt.bind(undefined, "hsl($1, $2%, $3%)");

var hsla = fmt.bind(undefined, "hsla($1, $2%, $3%, $4)");
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

function setSetting(name, val) {
  if (window.localStorage && val) {
    try {
      window.localStorage.setItem(name, JSON.stringify(val));
    } catch (exp) {
      console.error("setSetting", name, val, typeof val === "undefined" ? "undefined" : _typeof(val), exp);
    }
  }
}

function deleteSetting(name) {
  if (window.localStorage) {
    window.localStorage.removeItem(name);
  }
}

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
"use strict";

var FullScreen = function () {
  "use strict";

  var elementName = findProperty(document, ["fullscreenElement", "mozFullScreenElement", "webkitFullscreenElement", "msFullscreenElement"]),
      changeEventName = findProperty(document, ["onfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange", "onmsfullscreenchange"]),
      errorEventName = findProperty(document, ["onfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror", "onmsfullscreenerror"]),
      requestMethodName = findProperty(document.documentElement, ["requestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen", "webkitRequestFullScreen", "msRequestFullscreen"]),
      exitMethodName = findProperty(document, ["exitFullscreen", "mozExitFullScreen", "webkitExitFullscreen", "webkitExitFullScreen", "msExitFullscreen"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  var ns = {
    addChangeListener: function addChangeListener(thunk, bubbles) {
      return document.addEventListener(changeEventName, thunk, bubbles);
    },
    removeChangeListener: function removeChangeListener(thunk) {
      return document.removeEventListener(changeEventName, thunk);
    },
    addErrorListener: function addErrorListener(thunk, bubbles) {
      return document.addEventListener(errorEventName, thunk, bubbles);
    },
    removeErrorListener: function removeErrorListener(thunk) {
      return document.removeEventListener(errorEventName, thunk);
    },
    withChange: function withChange(act) {
      return new Promise(function (resolve, reject) {
        var onFullScreen,
            onFullScreenError,
            timeout,
            tearDown = function tearDown() {
          if (timeout) {
            clearTimeout(timeout);
          }
          FullScreen.removeChangeListener(onFullScreen);
          FullScreen.removeErrorListener(onFullScreenError);
        };

        onFullScreen = function onFullScreen() {
          setTimeout(tearDown);
          resolve(FullScreen.element);
        };

        onFullScreenError = function onFullScreenError(evt) {
          setTimeout(tearDown);
          reject(evt);
        };

        FullScreen.addChangeListener(onFullScreen, false);
        FullScreen.addErrorListener(onFullScreenError, false);

        if (act()) {
          // we've already gotten fullscreen, so don't wait for it.
          tearDown();
          resolve(FullScreen.element);
        } else {
          // Timeout wating on the fullscreen to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          timeout = setTimeout(function () {
            tearDown();
            reject("Fullscreen state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: function request(elem, fullScreenParam) {
      return FullScreen.withChange(function () {
        if (!requestMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        } else if (FullScreen.isActive) {
          return true;
        } else if (fullScreenParam) {
          elem[requestMethodName](fullScreenParam);
        } else if (isChrome) {
          elem[requestMethodName](window.Element.ALLOW_KEYBOARD_INPUT);
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: function exit() {
      return FullScreen.withChange(function () {
        if (!exitMethodName) {
          console.error("No Fullscreen API support.");
          throw new Error("No Fullscreen API support.");
        } else if (!FullScreen.isActive) {
          return true;
        } else {
          document[exitMethodName]();
        }
      });
    }
  };

  Object.defineProperties(ns, {
    element: {
      get: function get() {
        return document[elementName];
      }
    },
    isActive: {
      get: function get() {
        return !!FullScreen.element;
      }
    }
  });

  return ns;
}();
"use strict";

function hub() {
  return new THREE.Object3D();
}
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
"use strict";

function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function copyObject(dest, source) {
  var stack = [{ dest: dest, source: source }];
  while (stack.length > 0) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (_typeof(source[key]) !== "object") {
          dest[key] = source[key];
        } else {
          if (!dest[key]) {
            dest[key] = {};
          }
          stack.push({ dest: dest[key], source: source[key] });
        }
      }
    }
  }
}

function range(n, m, s, t) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1,
      t2 = t || s || m;
  for (var i = n2; i < m2; i += s2) {
    t2(i);
  }
}

function emit(evt, args) {
  var handlers = this.listeners && this.listeners[evt] || this._listeners && this._listeners[evt];
  for (var i = 0; handlers && i < handlers.length; ++i) {
    handlers[i](args);
  }
}
"use strict";

function overwrite(obj1, obj2) {
  obj1 = obj1 || {};
  for (var k in obj2) {
    obj1[k] = obj2[k];
  }
  return obj1;
}
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
"use strict";

function put(object) {
  var at = function at(x, y, z) {
    object.position.set(x, y, z);
    return object;
  },
      rot = function rot(x, y, z) {
    object.rotation.set(x, y, z);
    return { at: at };
  };
  return {
    on: function on(s) {
      s.add(object);
      return {
        at: at,
        rot: rot
      };
    }
  };
}
"use strict";

function quad(w, h, s, t) {
  if (h === undefined) {
    h = w;
  }
  return cache("PlaneBufferGeometry(" + w + ", " + h + ", " + s + ", " + t + ")", function () {
    return new THREE.PlaneBufferGeometry(w, h, s, t);
  });
}
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
"use strict";

function sphere(r, slices, rings) {
  return cache("SphereGeometry(" + r + ", " + slices + ", " + rings + ")", function () {
    return new THREE.SphereGeometry(r, slices, rings);
  });
}
"use strict";

var textured = function () {
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

    var material = null;
    if (txt instanceof THREE.Material) {
      material = txt;
      txt = null;
    } else {
      var txtID = txt.id || txt.toString(),
          textureDescription = "Primrose.textured(" + txtID + ", " + options.txtRepeatS + ", " + options.txtRepeatT + ")",
          materialDescription = "material(" + textureDescription + ", " + options.unshaded + ", " + options.opacity + ")";
      material = cache(materialDescription, function () {
        var materialOptions = {
          transparent: options.opacity < 1,
          opacity: options.opacity,
          side: THREE.DoubleSide
        },
            MaterialType = THREE.MeshStandardMaterial;

        if (options.unshaded) {
          materialOptions.shading = THREE.FlatShading;
          MaterialType = THREE.MeshBasicMaterial;
        } else {
          if (options.roughness === undefined) {
            options.roughness = 0.5;
          }
          if (options.metalness === undefined) {
            options.metalness = 0;
          }
          materialOptions.roughness = options.roughness;
          materialOptions.metalness = options.metalness;
        }
        return new MaterialType(materialOptions);
      });
    }

    material.wireframe = !!options.wireframe;

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
          if (options.scaleTextureWidth || !options.scaleTextureHeight) {
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

  return textured;
}();
"use strict";

function v3(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
"use strict";

Primrose.Angle = function () {
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

  return Angle;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.BaseControl = function () {
  "use strict";

  var ID = 1,
      NUMBER_PATTERN = "([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))",
      DELIM = "\\s*,\\s*",
      UNITS = "(?:em|px)",
      TRANSLATE_PATTERN = new RegExp("translate3d\\s*\\(\\s*" + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + DELIM + NUMBER_PATTERN + UNITS + "\\s*\\)", "i"),
      ROTATE_PATTERN = new RegExp("rotate3d\\s*\\(\\s*" + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + DELIM + NUMBER_PATTERN + "rad\\s*\\)", "i");

  var BaseControl = function () {
    function BaseControl() {
      _classCallCheck(this, BaseControl);

      this.controlID = ID++;

      this.focused = false;

      this.listeners = {
        focus: [],
        blur: []
      };
    }

    _createClass(BaseControl, [{
      key: "addEventListener",
      value: function addEventListener(event, func) {
        if (this.listeners[event]) {
          this.listeners[event].push(func);
        }
      }
    }, {
      key: "focus",
      value: function focus() {
        this.focused = true;
        emit.call(this, "focus", { target: this });
      }
    }, {
      key: "blur",
      value: function blur() {
        this.focused = false;
        emit.call(this, "blur", { target: this });
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
  }();

  return BaseControl;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.BrowserEnvironment = function () {
  "use strict";

  if (typeof THREE === "undefined") {
    return function () {};
  }
  /*
   Create a new VR Application!
   
   `name` - name the application, for use with saving settings separately from
   other applications on the same domain
   `options` - optional values to override defaults
   | `avatarHeight` - the offset from the ground at which to place the camera
   | `walkSpeed` - how quickly the avatar moves across the ground
   | `button`
   | `model` - the model to use to make buttons, in THREE JSON format
   | `options` - configuration parameters for buttons
   | `maxThrow` - the distance the button may move
   | `minDeflection` - the angle boundary in which to do hit tests on the button
   | `colorUnpressed` - the color of the button when it is not depressed
   | `colorPressed` - the color of the button when it is depressed
   | `gravity` - the acceleration applied to falling objects (default: 9.8)
   | `useLeap` - use the Leap Motion device
   | `backgroundColor` - the color that WebGL clears the background with before drawing (default: 0x000000)
   | `drawDistance` - the far plane of the camera (default: 500)
   | `chatTextSize` - the size of a single line of text, in world units (default: 0.25)
   | `dtNetworkUpdate` - the amount of time to allow to elapse between sending state to teh server (default: 0.125)
   */
  var MILLISECONDS_TO_SECONDS = 0.001,
      RIGHT = new THREE.Vector3(1, 0, 0),
      UP = new THREE.Vector3(0, 1, 0),
      FORWARD = new THREE.Vector3(0, 0, -1),
      POINTER_RADIUS = 0.01,
      POINTER_RESCALE = 20,
      FORWARDED_EVENTS = ["keydown", "keyup", "keypress", "mousedown", "mouseup", "mousemove", "wheel", "touchstart", "touchend", "touchmove"];

  var BrowserEnvironment = function () {
    function BrowserEnvironment(name, options) {
      var _this = this;

      _classCallCheck(this, BrowserEnvironment);

      this.options = patch(options, BrowserEnvironment.DEFAULTS);

      var fire = emit.bind(this);

      this.addEventListener = function (event, thunk, bubbles) {
        if (_this.listeners[event]) {
          _this.listeners[event].push(thunk);
        } else if (FORWARDED_EVENTS.indexOf(event) >= 0) {
          window.addEventListener(event, thunk, bubbles);
        }
      };

      var lockedToEditor = function lockedToEditor() {
        return _this.currentControl && _this.currentControl.lockMovement;
      };

      this.zero = function () {
        if (!lockedToEditor()) {
          _this.player.position.set(0, _this.avatarHeight, 0);
          _this.player.velocity.set(0, 0, 0);
          _this.input.zero();
          if (_this.quality === Primrose.Quality.NONE) {
            _this.quality = Primrose.Quality.HIGH;
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

      this.registerPickableObject = function (obj) {
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

      var wasFullscreen = false;
      var checkFullscreen = function checkFullscreen() {
        if (Primrose.Input.VR.Version === 1 && isMobile) {
          if (wasFullscreen !== FullScreen.isActive) {
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            wasFullscreen = FullScreen.isActive;
          }
        }
      };

      var update = function update(t) {
        var dt = t - lt,
            i,
            j;
        lt = t;

        movePlayer(dt);
        moveSky();
        moveGround();
        movePointer();
        resolvePicking();
        checkQuality();
        fire("update", dt);
      };

      var movePlayer = function movePlayer(dt) {

        _this.input.update();
        var heading = _this.input.getValue("heading"),
            pitch = _this.input.getValue("pitch"),
            strafe = _this.input.getValue("strafe"),
            drive = _this.input.getValue("drive");

        if (_this.inVR || isMobile) {
          _this.input.getOrientation(qHead);
        } else {
          qHead.set(0, 0, 0, 1);
        }
        qPitch.setFromAxisAngle(RIGHT, pitch);
        if (!_this.player.isOnGround) {
          _this.player.velocity.y -= _this.options.gravity * dt;
        } else if (!lockedToEditor()) {
          _this.player.velocity.set(strafe, 0, drive).normalize().multiplyScalar(_this.walkSpeed);

          qHeading.setFromAxisAngle(UP, currentHeading);
          _this.player.velocity.applyQuaternion(qHead);
          _this.player.velocity.y = 0;
          _this.player.velocity.applyQuaternion(qHeading);
        }

        _this.player.position.add(vBody.copy(_this.player.velocity).multiplyScalar(dt));
        if (!_this.player.isOnGround && _this.player.position.y < _this.avatarHeight) {
          _this.player.isOnGround = true;
          _this.player.position.y = _this.avatarHeight;
          _this.player.velocity.y = 0;
        }

        if (_this.inVR) {
          var dHeading = heading - currentHeading;
          if (!lockedToEditor() && Math.abs(dHeading) > Math.PI / 5) {
            var dh = Math.sign(dHeading) * Math.PI / 100;
            currentHeading += dh;
            heading -= dh;
            dHeading = heading - currentHeading;
          }
          _this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          qHeading.setFromAxisAngle(UP, dHeading).multiply(qPitch);
        } else {
          currentHeading = heading;
          _this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          _this.player.quaternion.multiply(qPitch);
        }
      };

      var moveSky = function moveSky() {
        if (_this.sky) {
          _this.sky.position.copy(_this.player.position);
        }
      };

      var moveGround = function moveGround() {
        if (_this.ground) {
          _this.ground.position.set(Math.floor(_this.player.position.x), 0, Math.floor(_this.player.position.z));
          _this.ground.material.needsUpdate = true;
        }
      };

      var movePointer = function movePointer() {
        _this.pointer.position.copy(FORWARD);
        if (_this.inVR && !isMobile) {
          _this.pointer.position.applyQuaternion(qHeading);
        }
        if (!lockedToEditor() || isMobile) {
          _this.pointer.position.add(_this.camera.position);
          _this.pointer.position.applyQuaternion(_this.camera.quaternion);
        }
        _this.pointer.position.applyQuaternion(_this.player.quaternion);
        _this.pointer.position.add(_this.player.position);
      };

      var pointerStart = function pointerStart(name) {
        if (!(name === "keyboard" && lockedToEditor())) {
          if (currentHit) {
            var object = _this.pickableObjects[currentHit.objectID];
            if (object) {
              var control = object.button || object.surface;
              fire("pointerstart", currentHit);
              emit.call(object, "click");

              if (_this.currentControl && _this.currentControl !== control) {
                _this.currentControl.blur();
                _this.currentControl = null;
              }

              if (!_this.currentControl && control) {
                _this.currentControl = control;
                _this.currentControl.focus();
              } else if (object === _this.ground) {
                _this.player.position.copy(_this.pointer.position);
                _this.player.position.y = _this.avatarHeight;
                _this.player.isOnGround = false;
              }

              if (_this.currentControl) {
                _this.currentControl.startUV(currentHit.point);
              }
            }
          } else if (_this.currentControl) {
            _this.currentControl.blur();
            _this.currentControl = null;
          }
        }
      };

      var pointerEnd = function pointerEnd(name) {
        if (!(name === "keyboard" && lockedToEditor()) && currentHit) {
          var object = _this.pickableObjects[currentHit.objectID];
          if (object) {
            var control = object.button || object.surface;
            fire("pointerend", lastHit);

            if (_this.currentControl) {
              _this.currentControl.endPointer();
            }
          }
        }
      };

      var resolvePicking = function resolvePicking() {

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

          _this.projector.projectPointer([_this.pointer.position.toArray(), transformForPicking(_this.player)]);
        }

        var lastButtons = _this.input.getValue("dButtons");
        if (currentHit) {
          var fp = currentHit.facePoint,
              fn = currentHit.faceNormal,
              object = _this.pickableObjects[currentHit.objectID];
          _this.pointer.position.set(fp[0] + fn[0] * POINTER_RADIUS, fp[1] + fn[1] * POINTER_RADIUS, fp[2] + fn[2] * POINTER_RADIUS);

          if (object === _this.ground) {
            _this.pointer.scale.set(POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE);
          } else {
            _this.pointer.scale.set(1, 1, 1);
          }
          _this.pointer.material.color.setRGB(1, 1, 1);
          _this.pointer.material.emissive.setRGB(0.25, 0.25, 0.25);

          if (object) {
            var buttons = _this.input.getValue("buttons"),
                clickChanged = lastButtons !== 0,
                control = object.button || object.surface;

            if (!lockedToEditor()) {
              buttons |= _this.input.Keyboard.getValue("select");
              clickChanged = clickChanged || _this.input.Keyboard.getValue("dSelect") !== 0;
            }

            if (!clickChanged && buttons > 0) {
              if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
                fire("pointermove", currentHit);
              }
              if (_this.currentControl && currentHit.point) {
                _this.currentControl.moveUV(currentHit.point);
              }
            }
          }
        } else {
          _this.pointer.material.color.setRGB(1, 0, 0);
          _this.pointer.material.emissive.setRGB(0.25, 0, 0);
          _this.pointer.scale.set(1, 1, 1);
        }
      };

      var animate = function animate(t) {
        checkFullscreen();
        RAF(animate);
        update(t * MILLISECONDS_TO_SECONDS);
        render();
      };

      var eyeCounter = 0,
          blankEye = false;
      var render = function render() {
        if (_this.inVR) {
          _this.renderer.clear(true, true, true);
          var trans = _this.input.VR.transforms;
          for (var i = 0; trans && i < trans.length; ++i) {
            var st = trans[i],
                v = st.viewport,
                side = 2 * i - 1;
            Primrose.Entity.eyeBlankAll(i);
            _this.input.getVector3("headX", "headY", "headZ", _this.camera.position);
            _this.camera.projectionMatrix.copy(st.projection);
            vEye.set(0, 0, 0);
            vEye.applyMatrix4(st.translation);
            vEye.applyQuaternion(qHead);
            _this.camera.position.add(vEye);
            _this.camera.quaternion.copy(qHead);
            if (_this.options.useNose) {
              _this.nose.visible = true;
              _this.nose.position.set(side * -0.12, -0.12, -0.15);
              _this.nose.rotation.z = side * 0.7;
            }
            _this.renderer.setViewport(v.left * resolutionScale, v.top * resolutionScale, v.width * resolutionScale, v.height * resolutionScale);
            _this.renderer.render(_this.scene, _this.camera);
          }
          _this.input.VR.currentDisplay.submitFrame(_this.input.VR.currentPose);
        }

        if (!isMobile) {
          _this.audio.setPlayer(_this.camera);
        }

        if (!_this.inVR || _this.input.VR.currentDisplay.capabilities.hasExternalDisplay && !_this.options.disableMirroring) {
          if (blankEye) {
            eyeCounter = 1 - eyeCounter;
            Primrose.Entity.eyeBlankAll(eyeCounter);
          }
          _this.nose.visible = false;
          _this.camera.fov = _this.options.defaultFOV;
          _this.camera.aspect = _this.renderer.domElement.width / _this.renderer.domElement.height;
          _this.camera.updateProjectionMatrix();
          _this.camera.position.set(0, 0, 0);
          _this.camera.quaternion.copy(qHead);
          _this.renderer.clear(true, true, true);
          _this.renderer.setViewport(0, 0, _this.renderer.domElement.width, _this.renderer.domElement.height);
          _this.renderer.render(_this.scene, _this.camera);
        }
      };

      var setOrientationLock = function setOrientationLock() {
        if (isMobile) {
          if (isFullScreenMode()) {
            var type = screen.orientation && screen.orientation.type || screen.mozOrientation || "";
            if (type.indexOf("landscape") === -1) {
              type = "landscape-primary";
            }
            if (screen.orientation && screen.orientation.lock) {
              screen.orientation.lock(type);
            } else if (screen.mozLockOrientation) {
              screen.mozLockOrientation(type);
            }
          } else {
            if (screen.orientation && screen.orientation.unlock) {
              screen.orientation.unlock();
            } else if (screen.mozUnlockOrientation) {
              screen.mozUnlockOrientation();
            }
          }
        }
      };

      var modifyScreen = function modifyScreen() {
        var canvasWidth, canvasHeight, aspectWidth;

        setOrientationLock();

        if (_this.inVR) {
          _this.input.VR.resetTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);

          var p = _this.input.VR.transforms,
              l = p[0],
              r = p[1];
          canvasWidth = Math.floor((l.viewport.width + r.viewport.width) * resolutionScale);
          canvasHeight = Math.floor(Math.max(l.viewport.height, r.viewport.height) * resolutionScale);
          aspectWidth = canvasWidth / 2;
        } else {
          var pixelRatio = devicePixelRatio || 1,
              elementWidth,
              elementHeight;
          if (FullScreen.isActive) {
            elementWidth = screen.width;
            elementHeight = screen.height;
            _this.renderer.domElement.style.width = px(elementWidth);
            _this.renderer.domElement.style.height = px(elementHeight);
          } else {
            _this.renderer.domElement.style.width = "";
            _this.renderer.domElement.style.height = "";
            var bounds = _this.renderer.domElement.getBoundingClientRect();
            elementWidth = bounds.width;
            if (isiOS) {
              elementHeight = elementWidth * screen.width / screen.height;
            } else {
              elementHeight = bounds.height;
            }
          }
          canvasWidth = Math.floor(elementWidth * pixelRatio * resolutionScale);
          canvasHeight = Math.floor(elementHeight * pixelRatio * resolutionScale);
          aspectWidth = canvasWidth;
        }

        _this.renderer.domElement.width = canvasWidth;
        _this.renderer.domElement.height = canvasHeight;
        if (!_this.timer) {
          render();
        }
      };

      //
      // Initialize local variables
      //
      var lt = 0,
          lastHit = null,
          currentHit = null,
          currentHeading = 0,
          qPitch = new THREE.Quaternion(),
          qHeading = new THREE.Quaternion(),
          qHead = new THREE.Quaternion(),
          vEye = new THREE.Vector3(),
          vBody = new THREE.Vector3(),
          skin = Primrose.Random.item(Primrose.SKIN_VALUES),
          readyFired = false,
          modelFiles = {
        monitor: this.options.fullScreenIcon,
        cardboard: null,
        scene: this.options.sceneModel,
        button: this.options.button && typeof this.options.button.model === "string" && this.options.button.model,
        font: this.options.font
      },
          icons = [],
          cardboardFactory = null,
          cardboardTextFactory = null,
          resolutionScale = 1;

      if (Primrose.Input.VR.Version > 0) {
        modelFiles.cardboard = this.options.VRIcon;
      }

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

      var putIconInScene = function putIconInScene(icon, i, arr) {
        var arm = hub();
        arm.add(icon);
        icon.position.z = -1;
        put(arm).on(_this.scene).at(0, _this.options.avatarHeight, 0);
        var wedge = 75 / arr.length;
        arm.rotation.set(0, Math.PI * wedge * ((arr.length - 1) * 0.5 - i) / 180, 0);
        _this.registerPickableObject(icon);
      };

      var fgColor = null;

      var makeCardboard = function makeCardboard(display, i) {
        var cardboard = cardboardFactory.clone(),
            titleText = textured(text3D(0.05, display.displayName), fgColor),
            vrText = textured(text3D(0.1, "VR"), fgColor);

        cardboard.name = "Cardboard" + i;
        cardboard.addEventListener("click", _this.goVR.bind(_this, i), false);

        put(titleText).on(cardboard).rot(0, 90 * Math.PI / 180, 0).at(0, -0.1, titleText.geometry.boundingSphere.radius);

        put(vrText).on(cardboard).rot(0, 90 * Math.PI / 180, 0).at(0, 0.075, vrText.geometry.boundingSphere.radius);

        put(cardboard).on(_this.scene).rot(0, 270 * Math.PI / 180, 0);

        _this.registerPickableObject(cardboard);
        return cardboard;
      };

      var modelsReady = Primrose.ModelLoader.loadObjects(modelFiles).then(function (models) {
        window.text3D = function (font, size, text) {
          var geom = new THREE.TextGeometry(text, {
            font: font,
            size: size,
            height: size / 5,
            curveSegments: 2
          });
          geom.computeBoundingSphere();
          return geom;
        }.bind(window, models.font);

        if (models.scene) {
          buildScene(models.scene);
        }

        fgColor = complementColor(new THREE.Color(_this.options.backgroundColor)).getHex();

        if (models.monitor) {
          var monitor = models.monitor;
          monitor.name = "Monitor";
          var monitorText = textured(text3D(0.1, "Fullscreen"), fgColor),
              radius = monitorText.geometry.boundingSphere.radius;
          put(monitorText).on(monitor).rot(0, 90 * Math.PI / 180, 0).at(0, 1.25, radius);
          monitor.addEventListener("click", _this.goFullScreen, false);
          monitor.rotation.set(0, Math.PI * 3 / 2, 0);
          monitor.position.y = -1;
          icons.push(monitor);
        }

        if (models.cardboard) {
          cardboardFactory = new Primrose.ModelLoader(models.cardboard);
          icons.splice.bind(icons, icons.length, 0).apply(icons, (_this.input.VR && _this.input.VR.displays || [{ displayName: "Test Icon" }]).map(makeCardboard));
        }

        icons.forEach(putIconInScene);

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
      }).then(function () {
        _this.renderer.domElement.style.cursor = "default";
        fire("ready");
      });

      //
      // Initialize public properties
      //
      this.currentControl = null;
      this.avatarHeight = this.options.avatarHeight;
      this.walkSpeed = this.options.walkSpeed;
      this.listeners = {
        ready: [],
        update: [],
        gazestart: [],
        gazecomplete: [],
        gazecancel: [],
        pointerstart: [],
        pointermove: [],
        pointerend: []
      };

      this.audio = new Primrose.Output.Audio3D();
      var audioReady = null,
          ocean = null;
      if (this.options.ambientSound && !isMobile) {
        audioReady = this.audio.load3DSound(this.options.ambientSound, true, -1, 1, -1).then(function (aud) {
          ocean = aud;
          if (!(ocean.source instanceof MediaElementAudioSourceNode)) {
            ocean.volume.gain.value = 0.1;
            console.log(ocean.source);
            ocean.source.start();
          }
        });
      } else {
        audioReady = Promise.resolve();
      }

      var documentReady = null;
      if (document.readyState === "complete") {
        documentReady = Promise.resolve();
      } else {
        documentReady = new Promise(function (resolve, reject) {
          document.addEventListener("readystatechange", function (evt) {
            if (document.readyState === "complete") {
              resolve();
            }
          }, false);
        });
      }

      var allReady = Promise.all([modelsReady, audioReady, documentReady]);
      this.music = new Primrose.Output.Music(this.audio.context);

      this.pickableObjects = {};

      this.projector = new Primrose.Workerize(Primrose.Projector);

      this.player = new THREE.Object3D();
      this.player.velocity = new THREE.Vector3();
      this.player.name = "Player";
      this.player.position.set(0, this.avatarHeight, 0);
      this.player.isOnGround = true;

      this.pointer = textured(sphere(POINTER_RADIUS, 10, 10), 0xff0000);
      this.pointer.material.emissive.setRGB(0.25, 0, 0);
      this.pointer.material.opacity = 0.75;

      this.nose = textured(sphere(0.05, 10, 10), skin);
      this.nose.name = "Nose";
      this.nose.scale.set(0.5, 1, 1);

      this.scene = new THREE.Scene();
      if (this.options.useFog) {
        this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
      }

      this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);
      if (this.options.skyTexture) {
        this.sky = textured(shell(this.options.drawDistance, 18, 9, Math.PI * 2, Math.PI), this.options.skyTexture, { unshaded: true });
        this.sky.name = "Sky";
        this.scene.add(this.sky);
      }

      if (this.options.groundTexture) {
        var dim = 10,
            gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
        this.ground = textured(gm, this.options.groundTexture, {
          txtRepeatS: dim * 5,
          txtRepeatT: dim * 5
        });
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.name = "Ground";
        this.scene.add(this.ground);
        this.registerPickableObject(this.ground);
      }

      this.camera.add(this.nose);
      this.player.add(this.camera);
      this.scene.add(this.player);
      this.scene.add(this.pointer);

      if (this.passthrough) {
        this.camera.add(this.passthrough.mesh);
      }

      var buildScene = function buildScene(sceneGraph) {
        sceneGraph.buttons = [];
        sceneGraph.traverse(function (child) {
          if (child.isButton) {
            sceneGraph.buttons.push(new Primrose.Button(child.parent, child.name));
          }
          if (child.name) {
            sceneGraph[child.name] = child;
          }
        });
        _this.scene.add.apply(_this.scene, sceneGraph.children);
        _this.scene.traverse(function (obj) {
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

      put(light(0xffffff, 1.5, 50)).on(this.scene).at(0, 10, 10);

      var RAF = function RAF(callback) {
        if (_this.inVR) {
          _this.timer = _this.input.VR.currentDisplay.requestAnimationFrame(callback);
        } else {
          _this.timer = requestAnimationFrame(callback);
        }
      };

      this.start = function () {
        allReady.then(function () {
          _this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          RAF(animate);
        });
      };

      this.stop = function () {
        if (_this.inVR) {
          _this.input.VR.currentDisplay.cancelAnimationFrame(_this.timer);
        } else {
          cancelAnimationFrame(_this.timer);
        }
        _this.audio.stop();
        _this.timer = null;
      };

      var handleHit = function handleHit(h) {
        var dt;
        _this.projector.ready = true;
        lastHit = currentHit;
        currentHit = h;
        if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
          currentHit.startTime = lastHit.startTime;
          currentHit.gazeFired = lastHit.gazeFired;
          dt = lt - currentHit.startTime;
          if (dt >= _this.options.gazeLength && !currentHit.gazeFired) {
            currentHit.gazeFired = true;
            fire("gazecomplete", currentHit);
          }
        } else {
          if (lastHit) {
            dt = lt - lastHit.startTime;
            if (dt < _this.options.gazeLength) {
              fire("gazecancel", lastHit);
            }
          }
          if (currentHit) {
            currentHit.startTime = lt;
            currentHit.gazeFired = false;
            fire("gazestart", currentHit);
          }
        }
      };

      var keyDown = function keyDown(evt) {
        if (!lockedToEditor() && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
          if (evt.keyCode === Primrose.Keys.E) {
            blankEye = true;
            evt.preventDefault();
          }
        } else if (_this.currentControl) {
          var elem = _this.currentControl.focusedElement;
          if (elem) {
            if (elem.execCommand) {
              var oldDeadKeyState = _this.operatingSystem._deadKeyState;
              if (elem.execCommand(_this._browser, _this.codePage, _this.operatingSystem.makeCommandName(evt, _this.codePage))) {
                evt.preventDefault();
              }
              if (_this.operatingSystem._deadKeyState === oldDeadKeyState) {
                _this.operatingSystem._deadKeyState = "";
              }
            } else {
              elem.keyDown(evt);
            }
          }
        }
      };

      var keyUp = function keyUp(evt) {
        if (_this.currentControl && _this.currentControl.keyUp) {
          _this.currentControl.keyUp(evt);
        } else if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
          if (evt.keyCode === Primrose.Keys.E) {
            blankEye = false;
          }
        }
      };

      //
      // Manage full-screen state
      //
      this.goFullScreen = function () {
        setPointerLock();
        FullScreen.request(_this.renderer.domElement);
      };

      this.goVR = function (index) {
        if (_this.input.VR) {
          _this.input.VR.connect(index);
          setPointerLock();
          return _this.input.VR.requestPresent([{ source: _this.renderer.domElement }]).then(function (elem) {
            if (Primrose.Input.VR.Version === 1 && isMobile) {
              var remover = function remover() {
                _this.input.VR.currentDisplay.exitPresent();
                window.removeEventListener("vrdisplaypresentchange", remover);
              };

              var adder = function adder() {
                window.addEventListener("vrdisplaypresentchange", remover, false);
                window.removeEventListener("vrdisplaypresentchange", adder);
              };

              window.addEventListener("vrdisplaypresentchange", adder, false);
            }

            return elem;
          });
        }
      };

      var showHideButtons = function showHideButtons() {
        icons.forEach(function (icon) {
          icon.visible = !isFullScreenMode();
          icon.disabled = isFullScreenMode();
        });
      };

      window.addEventListener("vrdisplaypresentchange", showHideButtons, false);
      FullScreen.addChangeListener(showHideButtons, false);

      Primrose.Input.Mouse.Lock.addChangeListener(function (evt) {
        if (!Primrose.Input.Mouse.Lock.isActive && _this.inVR) {
          _this.input.VR.currentDisplay.exitPresent();
        }
      }, false);

      window.addEventListener("vrdisplaypresentchange", modifyScreen, false);
      FullScreen.addChangeListener(modifyScreen, false);

      var isFullScreenMode = function isFullScreenMode() {
        return !!(FullScreen.isActive || _this.inVR);
      };

      BrowserEnvironment.createSurrogate.call(this);

      this.operatingSystem = this.options.os;
      this.codePage = this.options.language;

      var focusClipboard = function focusClipboard(evt) {
        var cmdName = _this.operatingSystem.makeCommandName(evt, _this.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          _this._surrogate.style.display = "block";
          _this._surrogate.focus();
        }
      };

      var setPointerLock = function setPointerLock() {
        return (Primrose.Input.Mouse.Lock.isActive || isMobile ? Promise.resolve() : Primrose.Input.Mouse.Lock.request(_this.renderer.domElement)).then(setFullscreen);
      };

      var setFullscreen = function setFullscreen() {
        if (!isFullScreenMode() && isMobile) {
          if (Primrose.Input.VR.Version >= 1) {
            _this.goVR(0);
          } else {
            _this.goFullScreen();
          }
        }
      };

      var withCurrentControl = function withCurrentControl(name) {
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

      this._browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
      window.addEventListener("keydown", keyDown, false);
      window.addEventListener("keyup", keyUp, false);
      window.addEventListener("keydown", focusClipboard, true);
      window.addEventListener("beforepaste", setFalse, false);
      window.addEventListener("paste", withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", withCurrentControl("readWheel"), false);
      window.addEventListener("resize", modifyScreen, false);
      window.addEventListener("blur", this.stop, false);
      window.addEventListener("focus", this.start, false);

      this.projector.addEventListener("hit", handleHit, false);

      documentReady.then(function () {
        _this.renderer = new THREE.WebGLRenderer({
          canvas: Primrose.DOM.cascadeElement(_this.options.canvasElement, "canvas", HTMLCanvasElement),
          antialias: !isMobile,
          alpha: true,
          logarithmicDepthBuffer: false
        });
        _this.renderer.autoClear = false;
        _this.renderer.autoSortObjects = true;
        _this.renderer.setClearColor(_this.options.backgroundColor);
        if (!_this.renderer.domElement.parentElement) {
          document.body.appendChild(_this.renderer.domElement);
        }

        _this.renderer.domElement.addEventListener('webglcontextlost', _this.stop, false);
        _this.renderer.domElement.addEventListener('webglcontextrestored', _this.start, false);

        _this.input = new Primrose.Input.FPSInput(_this.renderer.domElement);
        _this.input.addEventListener("zero", _this.zero, false);
        _this.input.addEventListener("lockpointer", setPointerLock, false);
        _this.input.addEventListener("fullscreen", setFullscreen, false);
        _this.input.addEventListener("pointerstart", pointerStart, false);
        _this.input.addEventListener("pointerend", pointerEnd, false);
      });

      var quality = -1,
          frameCount = 0,
          frameTime = 0,
          NUM_FRAMES = 10,
          LEAD_TIME = 2000,
          lastQualityChange = 0,
          dq1 = 0,
          dq2 = 0;

      var checkQuality = function checkQuality() {
        if (_this.options.autoScaleQuality &&
        // don't check quality if we've already hit the bottom of the barrel.
        _this.quality !== Primrose.Quality.NONE) {
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
              _this.quality < Primrose.Quality.MAXIMUM &&
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

      Object.defineProperties(this, {
        inVR: {
          get: function get() {
            return _this.input && _this.input.VR && _this.input.VR.currentDisplay && _this.input.VR.currentDisplay.isPresenting;
          }
        },
        quality: {
          get: function get() {
            return quality;
          },
          set: function set(v) {
            if (0 <= v && v < Primrose.RESOLUTION_SCALES.length) {
              quality = v;
              resolutionScale = Primrose.RESOLUTION_SCALES[v];
            }
            allReady.then(modifyScreen);
          }
        }
      });

      this.quality = this.options.quality;

      if (window.alert.toString().indexOf("native code") > -1) {
        // overwrite the native alert functions so they can't be called while in
        // fullscreen VR mode.

        var rerouteDialog = function rerouteDialog(oldFunction, newFunction) {
          if (!newFunction) {
            newFunction = function newFunction() {};
          }
          return function () {
            if (isFullScreenMode()) {
              newFunction();
            } else {
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

    _createClass(BrowserEnvironment, [{
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
    }], [{
      key: "createSurrogate",
      value: function createSurrogate() {
        var _this2 = this;

        var clipboardOperation = function clipboardOperation(name, evt) {
          if (_this2.currentControl) {
            _this2.currentControl[name + "SelectedText"](evt);
            if (!evt.returnValue) {
              evt.preventDefault();
            }
            _this2._surrogate.style.display = "none";
            _this2.currentControl.canvas.focus();
          }
        };

        // the `surrogate` textarea makes clipboard events possible
        this._surrogate = Primrose.DOM.cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement);
        this._surrogateContainer = Primrose.DOM.makeHidingContainer("primrose-surrogate-textarea-container", this._surrogate);
        this._surrogateContainer.style.position = "absolute";
        this._surrogateContainer.style.overflow = "hidden";
        this._surrogateContainer.style.width = 0;
        this._surrogateContainer.style.height = 0;
        this._surrogate.addEventListener("beforecopy", setFalse, false);
        this._surrogate.addEventListener("copy", clipboardOperation.bind(this, "copy"), false);
        this._surrogate.addEventListener("beforecut", setFalse, false);
        this._surrogate.addEventListener("cut", clipboardOperation.bind(this, "cut"), false);
        document.body.insertBefore(this._surrogateContainer, document.body.children[0]);
      }
    }]);

    return BrowserEnvironment;
  }();

  BrowserEnvironment.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";

  BrowserEnvironment.DEFAULTS = {
    autoScaleQuality: true,
    autoRescaleQuality: false,
    quality: Primrose.Quality.MAXIMUM,
    useNose: false,
    useLeap: false,
    useFog: false,
    avatarHeight: 1.75,
    walkSpeed: 2,
    // The acceleration applied to falling objects.
    gravity: 9.8,
    // The amount of time in seconds to require gazes on objects before triggering the gaze event.
    gazeLength: 1,
    // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
    disableMirroring: false,
    // The color that WebGL clears the background with before drawing.
    backgroundColor: 0xafbfff,
    // the near plane of the camera
    nearPlane: 0.01,
    // the far plane of the camera
    drawDistance: 100,
    // the field of view to use in non-VR settings
    defaultFOV: 75,
    // the amount of time to allow to elapse between sending state to the server
    dtNetworkUpdate: 0.125,
    canvasElement: "frontBuffer",
    // The sound to play on loop in the background
    ambientSound: null
  };

  function transformForPicking(obj) {
    var p = obj.position.clone();
    obj = obj.parent;
    while (obj !== null) {
      p.applyMatrix4(obj.matrix);
      obj = obj.parent;
    }
    return p.toArray();
  }

  return BrowserEnvironment;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Button = function () {
  var Button = function (_Primrose$BaseControl) {
    _inherits(Button, _Primrose$BaseControl);

    function Button(model, name, options) {
      _classCallCheck(this, Button);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this));

      options = patch(options, Button);
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

    return Button;
  }(Primrose.BaseControl);

  Button.DEFAULTS = {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true
  };

  Object.defineProperty(Button.prototype, "position", {
    get: function get() {
      return this.container.position;
    }
  });

  return Button;
}();
"use strict";

Primrose.ButtonFactory = function () {

  var buttonCount = 0;

  function ButtonFactory(templateFile, options) {
    this.options = options;
    this.template = templateFile;
  }

  ButtonFactory.prototype.create = function (toggle) {
    var name = "button" + ++buttonCount;
    var obj = this.template.clone();
    var btn = new Primrose.Button(obj, name, this.options, toggle);
    return btn;
  };

  return ButtonFactory;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Entity = function () {
  "use strict";

  var entities = new WeakMap();

  var Entity = function () {
    _createClass(Entity, null, [{
      key: "registerEntity",
      value: function registerEntity(e) {
        entities[e.id] = e;
      }
    }, {
      key: "eyeBlankAll",
      value: function eyeBlankAll(eye) {
        for (var id in entities) {
          entities[id].eyeBlank(eye);
        }
      }
    }]);

    function Entity(id) {
      _classCallCheck(this, Entity);

      this.id = id;
      this.parent = null;
      this.children = [];
      this.focused = false;
      this.listeners = {
        focus: [],
        blur: [],
        click: [],
        keydown: [],
        keyup: [],
        paste: [],
        copy: [],
        cut: [],
        wheel: []
      };
    }

    /*
    */


    _createClass(Entity, [{
      key: "addEventListener",
      value: function addEventListener(event, func) {
        if (this.listeners[event]) {
          this.listeners[event].push(func);
        }
      }

      /*
      */

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

      /*
      */

    }, {
      key: "focus",
      value: function focus() {
        this.focused = true;
        emit.call(this, "focus", { target: this });
      }

      /*
      */

    }, {
      key: "blur",
      value: function blur() {
        this.focused = false;
        for (var i = 0; i < this.children.length; ++i) {
          if (this.children[i].focused) {
            this.children[i].blur();
          }
        }
        emit.call(this, "blur", { target: this });
      }

      /*
      */

    }, {
      key: "appendChild",
      value: function appendChild(child) {
        if (child && !child.parent) {
          child.parent = this;
          this.children.push(child);
        }
      }

      /*
      */

    }, {
      key: "removeChild",
      value: function removeChild(child) {
        console.log("removeChild", this.id);
        var i = this.children.indexOf(child);
        if (0 <= i && i < this.children.length) {
          this.children.splice(i, 1);
          child.parent = null;
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
      key: "eyeBlank",
      value: function eyeBlank(eye) {
        for (var i = 0; i < this.children.length; ++i) {
          this.children[i].eyeBlank(eye);
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
        if (this.focused) {
          for (var i = 0; i < this.children.length; ++i) {
            var child = this.children[i];
            if (child.focused) {
              return child.focusedElement;
            }
          }
          return this;
        }
      }
    }]);

    return Entity;
  }();

  return Entity;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.InputProcessor = function () {

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

    function InputProcessor(name, commands, socket) {
      var _this = this;

      _classCallCheck(this, InputProcessor);

      this.name = name;
      this.commands = {};
      this.commandNames = [];
      this.socket = socket;
      this.enabled = true;
      this.paused = false;
      this.ready = true;
      this.transmitting = true;
      this.receiving = true;
      this.socketReady = false;
      this.inPhysicalUse = true;
      this.inputState = {
        buttons: [],
        axes: [],
        ctrl: false,
        alt: false,
        shift: false,
        meta: false
      };
      this.lastState = "";
      this.lastT = performance.now();

      var readMetaKeys = function readMetaKeys(event) {
        for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
          var m = Primrose.Keys.MODIFIER_KEYS[i];
          _this.inputState[m] = event[m + "Key"];
        }
        _this.update();
      };

      window.addEventListener("keydown", readMetaKeys, false);
      window.addEventListener("keyup", readMetaKeys, false);

      if (socket) {
        socket.on("open", function () {
          this.socketReady = true;
          this.inPhysicalUse = !this.receiving;
        }.bind(this));
        socket.on(name, function (cmdState) {
          if (this.receiving) {
            this.inPhysicalUse = false;
            this.decodeStateSnapshot(cmdState);
            this.fireCommands();
          }
        }.bind(this));
        socket.on("close", function () {
          this.inPhysicalUse = true;
          this.socketReady = false;
        }.bind(this));
      }

      for (var cmdName in commands) {
        this.addCommand(cmdName, commands[cmdName]);
      }

      for (var i = 0; i < Primrose.Keys.MODIFIER_KEYS.length; ++i) {
        this.inputState[Primrose.Keys.MODIFIER_KEYS[i]] = false;
      }

      this.axisNames = Primrose.Input[name] && Primrose.Input[name].AXES || [];

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
          }.bind(this))),
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
      value: function update() {
        var t = performance.now() / 1000,
            dt = t - this.lastT;
        this.lastT = t;
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
      key: "getVector3",
      value: function getVector3(x, y, z, value) {
        value = value || new THREE.Vector3();
        value.set(this.getValue(x), this.getValue(y), this.getValue(z));
        return value;
      }
    }, {
      key: "addVector3",
      value: function addVector3(x, y, z, value) {
        value.x += this.getValue(x);
        value.y += this.getValue(y);
        value.z += this.getValue(z);
        return value;
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

  return InputProcessor;
}();
"use strict";

Primrose.Keys = function () {
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

  return Keys;
}();
"use strict";

Primrose.ModelLoader = function () {
  // If Three.js hasn't been loaded, then this module doesn't make sense and we
  // can just return a shim to prevent errors from occuring. This is useful in
  // cases where we want to use Primrose in a 2D context, or perhaps use it with
  // a different 3D library, whatever that might be.
  if (typeof THREE === "undefined") {
    return function () {};
  }

  // The JSON format object loader is not always included in the Three.js distribution,
  // so we have to first check for it.
  var loaders = {
    ".json": THREE.ObjectLoader && new THREE.ObjectLoader(),
    ".fbx": THREE.FBXLoader && new THREE.FBXLoader(),
    ".mtl": THREE.MTLLoader && new THREE.MTLLoader(),
    ".obj": THREE.OBJLoader && new THREE.OBJLoader(),
    ".stl": THREE.STLLoader && new THREE.STLLoader(),
    ".typeface.js": THREE.FontLoader && new THREE.FontLoader()
  },
      mime = {
    "text/prs.wavefront-obj": "obj",
    "text/prs.wavefront-mtl": "mtl"
  },
      EXTENSION_PATTERN = /(\.(\w+))+$/,
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
    var obj = this.template.clone();

    obj.traverse(function (child) {
      if (child instanceof THREE.SkinnedMesh) {
        obj.animation = new THREE.Animation(child, child.geometry.animation);
        if (!this.template.originalAnimationData && obj.animation.data) {
          this.template.originalAnimationData = obj.animation.data;
        }
        if (!obj.animation.data) {
          obj.animation.data = this.template.originalAnimationData;
        }
      }
    }.bind(this));

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
      var Loader = loaders[extension];
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
          });
          promise = promise.then(function (materials) {
            materials.preload();
            Loader.setMaterials(materials);
          });
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

  return ModelLoader;
}();
"use strict";

Primrose.Projector = function () {

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

        self.THREE = { REVISION: '72dev' };
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
    this.f = new THREE.Vector3();
    this.p = new THREE.Vector3();
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
          found = found || this.objects[this.objectIDs[j]].geomID === obj.geomID;
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

  Projector.prototype.projectPointer = function (args) {
    var p = args[0],
        from = args[1],
        value = null;
    this.p.fromArray(p);
    this.f.fromArray(from);

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
          this.c.subVectors(this.p, this.f);
          this.m.set(this.a.x, this.b.x, -this.c.x, 0, this.a.y, this.b.y, -this.c.y, 0, this.a.z, this.b.z, -this.c.z, 0, 0, 0, 0, 1);
          if (Math.abs(this.m.determinant()) > 1e-10) {
            this.m.getInverse(this.m);
            this.d.subVectors(this.f, v0).applyMatrix4(this.m);
            if (0 <= this.d.x && this.d.x <= 1 && 0 <= this.d.y && this.d.y <= 1 && this.d.z > 0) {
              this.c.multiplyScalar(this.d.z).add(this.f);
              var dist = Math.sign(this.d.z) * this.p.distanceTo(this.c);
              if (!value || dist < value.distance) {
                value = {
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
    this._emit("hit", value);
  };
  return Projector;
}();
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Surface = function () {
  "use strict";

  var COUNTER = 0;

  var Surface = function (_Primrose$Entity) {
    _inherits(Surface, _Primrose$Entity);

    function Surface(options) {
      _classCallCheck(this, Surface);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Surface).call(this));

      options = patch(options, {
        id: "Primrose.Surface[" + COUNTER++ + "]"
      });
      _this.listeners.move = [];
      _this.bounds = options.bounds || new Primrose.Text.Rectangle();
      _this.canvas = null;
      _this.context = null;

      if (options.id instanceof Surface) {
        throw new Error("Object is already a Surface. Please don't try to wrap them.");
      } else if (options.id instanceof CanvasRenderingContext2D) {
        _this.context = options.id;
        _this.canvas = _this.context.canvas;
      } else if (options.id instanceof HTMLCanvasElement) {
        _this.canvas = options.id;
      } else if (typeof options.id === "string" || options.id instanceof String) {
        _this.canvas = document.getElementById(options.id);
        if (_this.canvas === null) {
          _this.canvas = document.createElement("canvas");
          _this.canvas.id = options.id;
        } else if (_this.canvas.tagName !== "CANVAS") {
          _this.canvas = null;
        }
      }

      if (_this.canvas === null) {
        console.error(_typeof(options.id));
        console.error(options.id);
        throw new Error(options.id + " does not refer to a valid canvas element.");
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
            emit.call(this, "click", { target: target, x: x, y: y });
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
          emit.call(this, "move", { target: target, x: x, y: y });
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

  return Surface;
}();
"use strict";

Primrose.WebRTCSocket = function () {

  /* polyfills */
  Window.prototype.RTCPeerConnection = Window.prototype.RTCPeerConnection || Window.prototype.webkitRTCPeerConnection || Window.prototype.mozRTCPeerConnection || function () {};

  Window.prototype.RTCIceCandidate = Window.prototype.RTCIceCandidate || Window.prototype.mozRTCIceCandidate || function () {};

  Window.prototype.RTCSessionDescription = Window.prototype.RTCSessionDescription || Window.prototype.mozRTCSessionDescription || function () {};

  function WebRTCSocket(proxyServer, isStarHub) {
    var socket,
        peers = [],
        channels = [],
        listeners = {},
        myIndex = null;

    function descriptionCreated(myIndex, theirIndex, description) {
      description.fromIndex = myIndex;
      description.toIndex = theirIndex;
      peers[theirIndex].setLocalDescription(description, function () {
        socket.emit(description.type, description);
      });
    }

    function descriptionReceived(theirIndex, description, thunk) {
      if (description.fromIndex === theirIndex) {
        var remote = new RTCSessionDescription(description);
        peers[theirIndex].setRemoteDescription(remote, thunk);
      }
    }

    if (typeof proxyServer === "string") {
      socket = io.connect(proxyServer, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 60
      });
    } else if (proxyServer && proxyServer.on && proxyServer.emit) {
      socket = proxyServer;
    } else {
      console.error("proxy error", socket);
      throw new Error("need a socket");
    }

    function setChannelEvents(index) {

      channels[index].addEventListener("open", function () {
        if (listeners.open) {
          for (var i = 0; i < listeners.open.length; ++i) {
            var l = listeners.open[i];
            if (l) {
              l.call(this);
            }
          }
        }
      }, false);

      channels[index].addEventListener("message", function (evt) {
        var args = JSON.parse(evt.data),
            key = args.shift();
        if (listeners[key]) {
          for (var i = 0; i < listeners[key].length; ++i) {
            var l = listeners[key][i];
            if (l) {
              l.apply(this, args);
            }
          }
        }
      }, false);

      function connectionLost() {
        channels[index] = null;
        peers[index] = null;
        var closed = channels.filter(function (c) {
          return c;
        }).length === 0;
        if (closed && listeners.close) {
          for (var i = 0; i < listeners.close.length; ++i) {
            var l = listeners.close[i];
            if (l) {
              l.call(this);
            }
          }
        }
      }

      channels[index].addEventListener("error", connectionLost, false);
      channels[index].addEventListener("close", connectionLost, false);
    }

    this.on = function (evt, thunk) {
      if (!listeners[evt]) {
        listeners[evt] = [];
      }
      listeners[evt].push(thunk);
    };

    this.emit = function (args) {
      var data = JSON.stringify(args);
      for (var i = 0; i < channels.length; ++i) {
        var channel = channels[i];
        if (channel && channel.readyState === "open") {
          channel.send(data);
        }
      }
    };

    this.close = function () {
      channels.forEach(function (channel) {
        if (channel && channel.readyState === "open") {
          channel.close();
        }
      });
      peers.forEach(function (peer) {
        if (peer) {
          peer.close();
        }
      });
    };

    window.addEventListener("unload", this.close.bind(this));

    this.connect = function (connectionKey) {
      socket.emit("handshake", "peer");

      socket.on("handshakeComplete", function (name) {
        if (name === "peer") {
          socket.emit("joinRequest", connectionKey);
        }
      });
    };

    socket.on("user", function (index, theirIndex) {
      try {
        if (myIndex === null) {
          myIndex = index;
        }
        if (!peers[theirIndex]) {
          var peer = new RTCPeerConnection({
            iceServers: ["stun.l.google.com:19302", "stun1.l.google.com:19302", "stun2.l.google.com:19302", "stun3.l.google.com:19302", "stun4.l.google.com:19302"].map(function (o) {
              return { url: "stun:" + o };
            })
          });

          peers[theirIndex] = peer;

          peer.addEventListener("icecandidate", function (evt) {
            if (evt.candidate) {
              evt.candidate.fromIndex = myIndex;
              evt.candidate.toIndex = theirIndex;
              socket.emit("ice", evt.candidate);
            }
          }, false);

          socket.on("ice", function (ice) {
            if (ice.fromIndex === theirIndex) {
              peers[theirIndex].addIceCandidate(new RTCIceCandidate(ice));
            }
          });

          if (isStarHub === true || isStarHub === undefined && myIndex < theirIndex) {
            peer.addEventListener("negotiationneeded", function (evt) {
              peer.createOffer(descriptionCreated.bind(this, myIndex, theirIndex), console.error.bind(console, "createOffer error"));
            });

            var channel = peer.createDataChannel("data-channel-" + myIndex + "-to-" + theirIndex, {
              id: myIndex,
              ordered: false,
              maxRetransmits: 0
            });
            channels[theirIndex] = channel;
            setChannelEvents(theirIndex);

            socket.on("answer", function (answer) {
              if (answer.fromIndex === theirIndex) {
                descriptionReceived(theirIndex, answer);
              }
            });
          } else if (isStarHub === false || isStarHub === undefined && myIndex > theirIndex) {
            peer.addEventListener("datachannel", function (evt) {
              if (evt.channel.id === theirIndex) {
                channels[evt.channel.id] = evt.channel;
                setChannelEvents(theirIndex);
              }
            }, false);

            socket.on("offer", function (offer) {
              if (offer.fromIndex === theirIndex) {
                descriptionReceived(theirIndex, offer, function () {
                  peers[theirIndex].createAnswer(descriptionCreated, console.error.bind(console, "createAnswer error"));
                });
              }
            });
          }
        }
      } catch (exp) {
        console.error(exp);
      }
    });
  }
  return WebRTCSocket;
}();
"use strict";

Primrose.Workerize = function () {
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
      emit.call(this, e.data[0], e.data[1]);
    }.bind(this);

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

  return Workerize;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.X.LoginForm = function () {
  var COUNTER = 0;
  var LoginForm = function (_Primrose$Entity) {
    _inherits(LoginForm, _Primrose$Entity);

    function LoginForm() {
      _classCallCheck(this, LoginForm);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginForm).call(this, "Primrose.X.LoginForm[" + COUNTER++ + "]"));

      _this.listeners.login = [];
      _this.listeners.signup = [];

      _this.frame = new Primrose.Surface({
        id: _this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 150)
      });

      _this.labelUserName = new Primrose.Controls.Label({
        id: _this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, 256, 50),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      _this.userName = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(256, 0, 256, 50),
        fontSize: 32
      });

      _this.labelPassword = new Primrose.Controls.Label({
        id: _this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      _this.password = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-password",
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32,
        passwordCharacter: "*"
      });

      _this.signupButton = new Primrose.Controls.Button2D({
        id: _this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      _this.loginButton = new Primrose.Controls.Button2D({
        id: _this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      _this.loginButton.addEventListener("click", function (evt) {
        return emit.call(_this, "login", { target: _this });
      }, false);
      _this.signupButton.addEventListener("click", function (evt) {
        return emit.call(_this, "signup", { target: _this });
      }, false);

      _this.mesh = textured(quad(1, 150 / 512), _this.frame);
      _this.mesh.name = "LoginForm";

      _this.frame.appendChild(_this.labelUserName);
      _this.frame.appendChild(_this.userName);
      _this.frame.appendChild(_this.labelPassword);
      _this.frame.appendChild(_this.password);
      _this.frame.appendChild(_this.signupButton);
      _this.frame.appendChild(_this.loginButton);
      _this.appendChild(_this.frame);
      return _this;
    }

    return LoginForm;
  }(Primrose.Entity);

  return LoginForm;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.X.SignupForm = function () {
  var COUNTER = 0;
  var SignupForm = function (_Primrose$Entity) {
    _inherits(SignupForm, _Primrose$Entity);

    function SignupForm() {
      _classCallCheck(this, SignupForm);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SignupForm).call(this, "Primrose.X.SignupForm[" + COUNTER++ + "]"));

      _this.listeners.login = [];
      _this.listeners.signup = [];

      _this.frame = new Primrose.Surface({
        id: _this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 200)
      });

      _this.labelUserName = new Primrose.Controls.Label({
        id: _this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, 256, 50),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      _this.userName = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(256, 0, 256, 50),
        fontSize: 32
      });

      _this.labelEmail = new Primrose.Controls.Label({
        id: _this.id + "-labelEmail",
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Email:",
        textAlign: "center"
      });

      _this.email = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-email",
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32
      });

      _this.labelPassword = new Primrose.Controls.Label({
        id: _this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "left"
      });

      _this.password = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-password",
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        passwordCharacter: "*"
      });

      _this.loginButton = new Primrose.Controls.Button2D({
        id: _this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(0, 150, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      _this.signupButton = new Primrose.Controls.Button2D({
        id: _this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(256, 150, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      _this.loginButton.addEventListener("click", function (evt) {
        return emit.call(_this, "login", { target: _this });
      }, false);
      _this.signupButton.addEventListener("click", function (evt) {
        return emit.call(_this, "signup", { target: _this });
      }, false);

      _this.mesh = textured(quad(1, 200 / 512), _this.frame);
      _this.mesh.name = "SignupForm";

      _this.frame.appendChild(_this.labelUserName);
      _this.frame.appendChild(_this.userName);
      _this.frame.appendChild(_this.labelEmail);
      _this.frame.appendChild(_this.email);
      _this.frame.appendChild(_this.labelPassword);
      _this.frame.appendChild(_this.password);
      _this.frame.appendChild(_this.loginButton);
      _this.frame.appendChild(_this.signupButton);
      _this.appendChild(_this.frame);
      return _this;
    }

    return SignupForm;
  }(Primrose.Entity);

  return SignupForm;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Label = function () {
  "use strict";

  var COUNTER = 0;

  var Label = function (_Primrose$Surface) {
    _inherits(Label, _Primrose$Surface);

    function Label(options) {
      _classCallCheck(this, Label);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Label).call(this, patch(options, {
        id: "Primrose.Controls.Label[" + COUNTER++ + "]"
      })));

      if (typeof options === "string") {
        _this.options = { value: _this.options };
      } else {
        _this.options = options || {};
      }

      ////////////////////////////////////////////////////////////////////////
      // initialization
      ///////////////////////////////////////////////////////////////////////

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
      _this.value = _this.options.value;
      return _this;
    }

    _createClass(Label, [{
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

          var backColor = this.options.backgroundColor || this.theme.regular.backColor,
              foreColor = this.options.color || this.theme.regular.foreColor;

          var clearFunc = backColor ? "fillRect" : "clearRect";

          if (this.theme.regular.backColor) {
            this.context.fillStyle = backColor;
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
              this.context.fillStyle = foreColor;
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

    return Label;
  }(Primrose.Surface);

  return Label;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Button2D = function () {
  "use strict";

  var COUNTER = 0;

  var Button2D = function (_Primrose$Controls$La) {
    _inherits(Button2D, _Primrose$Controls$La);

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
          emit.call(this, "click", { target: this });
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
  }(Primrose.Controls.Label);

  return Button2D;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Controls.Image = function () {
  "use strict";

  var COUNTER = 0,
      HTMLImage = window.Image,
      imageCache = {};

  var Image = function (_Primrose$Surface) {
    _inherits(Image, _Primrose$Surface);

    function Image(options) {
      _classCallCheck(this, Image);

      ////////////////////////////////////////////////////////////////////////
      // normalize input parameters
      ////////////////////////////////////////////////////////////////////////

      options = options || {};
      if (typeof options === "string") {
        options = { value: options };
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
        emit.call(this, "load", { target: this });
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

  return Image;
}();
"use strict";

Primrose.DOM.cascadeElement = function (id, tag, DOMClass) {
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
    } else if (elem.tagName !== tag.toUpperCase()) {
      elem = null;
    }
  }

  if (elem === null) {
    throw new Error(id + " does not refer to a valid " + tag + " element.");
  } else if (tag !== "canvas") {
    elem.innerHTML = "";
  }
  return elem;
};
"use strict";

Primrose.DOM.findEverything = function (elem, obj) {
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
};
"use strict";

Primrose.DOM.makeHidingContainer = function (id, obj) {
  var elem = Primrose.DOM.cascadeElement(id, "div", window.HTMLDivElement);
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild(obj);
  return elem;
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.DOM.StateList = function () {
  var StateList = function StateList(id, ctrls, states, callback, parent) {
    _classCallCheck(this, StateList);

    var select = Primrose.DOM.cascadeElement(id, "select", HTMLSelectElement);
    for (var i = 0; i < states.length; ++i) {
      var opt = document.createElement("option");
      opt.appendChild(document.createTextNode(states[i].name));
      select.appendChild(opt);
    }
    select.addEventListener("change", function () {
      var values = states[select.selectedIndex].values;
      if (values !== undefined) {
        for (var id in values) {
          if (values.hasOwnProperty(id)) {
            var attrs = values[id];
            for (var attr in attrs) {
              if (attrs.hasOwnProperty(attr)) {
                ctrls[id][attr] = attrs[attr];
              }
            }
          }
        }
        if (callback) {
          callback();
        }
      }
    }.bind(this), false);

    this.DOMElement = select;
    if (parent) {
      parent.appendChild(this.DOMElement);
    }
  };

  return StateList;
}();
"use strict";

Primrose.HTTP.get = function (type, url, options) {
  return Primrose.HTTP.XHR("GET", type || "text", url, options);
};
"use strict";

Primrose.HTTP.getBuffer = function (url, options) {
  return Primrose.HTTP.get("arraybuffer", url, options);
};
"use strict";

Primrose.HTTP.getObject = function (url, options) {
  return Primrose.HTTP.get("json", url, options);
};
"use strict";

Primrose.HTTP.getText = function (url, options) {
  return Primrose.HTTP.get("text", url, options);
};
"use strict";

Primrose.HTTP.post = function (type, url, options) {
  return Primrose.HTTP.XHR("POST", type, url, options);
};
"use strict";

Primrose.HTTP.sendObject = function (url, options) {
  console.original_log("sendObject", options);
  return Primrose.HTTP.post("json", url, options);
};
"use strict";

Primrose.HTTP.XHR = function (method, type, url, options) {
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
};
"use strict";

Primrose.Input.Camera = function () {

  /* polyfill */
  Navigator.prototype.getUserMedia = Navigator.prototype.getUserMedia || Navigator.prototype.webkitGetUserMedia || Navigator.prototype.mozGetUserMedia || Navigator.prototype.msGetUserMedia || Navigator.prototype.oGetUserMedia || function () {};

  function CameraInput(elem, id, size, x, y, z, options) {
    MediaStreamTrack.getSources(function (infos) {
      var option = document.createElement("option");
      option.value = "";
      option.innerHTML = "-- select camera --";
      elem.appendChild(option);
      for (var i = 0; i < infos.length; ++i) {
        if (infos[i].kind === "video") {
          option = document.createElement("option");
          option.value = infos[i].id;
          option.innerHTML = fmt("[Facing: $1] [ID: $2...]", infos[i].facing || "N/A", infos[i].id.substring(0, 8));
          option.selected = infos[i].id === id;
          elem.appendChild(option);
        }
      }
    });

    this.options = patch(options, CameraInput);

    this.videoElement = document.createElement("video");

    this.buffer = document.createElement("canvas");

    this.gfx = this.buffer.getContext("2d");

    this.texture = new THREE.Texture(this.buffer);
    var material = new THREE.MeshBasicMaterial({
      map: this.texture,
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    this.gfx.width = 500;
    this.gfx.height = 500;
    this.gfx.fillStyle = "white";
    this.gfx.fillRect(0, 0, 500, 500);

    var geometry = new THREE.PlaneGeometry(size, size);
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);

    this.streaming = false;
    this.videoElement.autoplay = 1;
    var getUserMediaFallthrough = function (vidOpt, success, err) {
      navigator.getUserMedia({ video: vidOpt }, function (stream) {
        streamURL = window.URL.createObjectURL(stream);
        this.videoElement.src = streamURL;
        success();
      }.bind(this), err);
    }.bind(this);

    var tryModesFirstThen = function (source, err, i) {
      i = i || 0;
      if (this.options.videoModes && i < this.options.videoModes.length) {
        var mode = this.options.videoModes[i];
        var opt = { optional: [{ sourceId: source }] };
        if (mode !== "default") {
          opt.mandatory = {
            minWidth: mode.w,
            minHeight: mode.h
          };
          mode = fmt("[w:$1, h:$2]", mode.w, mode.h);
        }
        getUserMediaFallthrough(opt, function () {
          console.log(fmt("Connected to camera at mode $1.", mode));
        }, function (err) {
          console.error(fmt("Failed to connect at mode $1. Reason: $2", mode, err));
          tryModesFirstThen(source, err, i + 1);
        });
      } else {
        err("no video modes specified.");
      }
    }.bind(this);

    this.videoElement.addEventListener("canplay", function () {
      if (!this.streaming) {
        this.streaming = true;
      }
    }.bind(this), false);

    this.videoElement.addEventListener("playing", function () {
      this.videoElement.height = this.buffer.height = this.videoElement.videoHeight;
      this.videoElement.width = this.buffer.width = this.videoElement.videoWidth;
      var aspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
      this.mesh.scale.set(aspectRatio, 1, 1);
    }.bind(this), false);

    this.connect = function (source) {
      if (this.streaming) {
        try {
          if (window.stream) {
            window.stream.stop();
          }
          this.videoElement.src = null;
          this.streaming = false;
        } catch (exp) {
          console.error(exp);
          console.error("While stopping");
        }
      }

      tryModesFirstThen(source, function (err) {
        console.error(fmt("Couldn't connect at requested resolutions. Reason: $1", err));
        getUserMediaFallthrough(true, console.log.bind(console, "Connected to camera at default resolution"), console.error.bind(console, "Final connect attempt"));
      });
    }.bind(this);

    if (id) {
      this.connect(id);
    }
  }

  CameraInput.DEFAULTS = {
    videoModes: [{ w: 320, h: 240 }, { w: 640, h: 480 }, "default"]
  };

  CameraInput.prototype.update = function () {
    this.gfx.drawImage(this.videoElement, 0, 0);
    this.texture.needsUpdate = true;
  };
  return CameraInput;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Input.FPSInput = function () {
  "use strict";

  var SETTINGS_TO_ZERO = ["heading", "pitch", "roll", "pointerPitch", "headX", "headY", "headZ"];

  var temp = new THREE.Quaternion();

  var FPSInput = function () {
    function FPSInput(DOMElement) {
      var _this = this;

      _classCallCheck(this, FPSInput);

      DOMElement = DOMElement || window;

      this.listeners = {
        zero: [],
        lockpointer: [],
        fullscreen: [],
        pointerstart: [],
        pointerend: []
      };

      this.managers = [
      // keyboard should always run on the window
      new Primrose.Input.Keyboard(window, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandUp: emit.bind(this, "lockpointer") },
        fullScreen: {
          buttons: [Primrose.Keys.F],
          commandDown: emit.bind(this, "fullscreen")
        },
        strafeLeft: {
          buttons: [-Primrose.Keys.A, -Primrose.Keys.LEFTARROW]
        },
        strafeRight: {
          buttons: [Primrose.Keys.D, Primrose.Keys.RIGHTARROW]
        },
        strafe: { commands: ["strafeLeft", "strafeRight"] },
        driveForward: {
          buttons: [-Primrose.Keys.W, -Primrose.Keys.UPARROW]
        },
        driveBack: {
          buttons: [Primrose.Keys.S, Primrose.Keys.DOWNARROW]
        },
        drive: { commands: ["driveForward", "driveBack"] },
        select: { buttons: [Primrose.Keys.ENTER] },
        dSelect: { buttons: [Primrose.Keys.ENTER], delta: true },
        zero: {
          buttons: [Primrose.Keys.Z],
          metaKeys: [-Primrose.Keys.CTRL, -Primrose.Keys.ALT, -Primrose.Keys.SHIFT, -Primrose.Keys.META],
          commandUp: emit.bind(this, "zero")
        }
      }), new Primrose.Input.Mouse(DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandDown: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Mouse.BUTTONS] },
        dButtons: { axes: [Primrose.Input.Mouse.BUTTONS], delta: true },
        pointerX: { axes: [Primrose.Input.Mouse.X] },
        pointerY: { axes: [Primrose.Input.Mouse.Y] },
        dx: { axes: [-Primrose.Input.Mouse.X], delta: true, scale: 0.005, min: -5, max: 5 },
        heading: { commands: ["dx"], integrate: true },
        dy: { axes: [-Primrose.Input.Mouse.Y], delta: true, scale: 0.005, min: -5, max: 5 },
        pitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 },
        pointerPitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25 }
      }), new Primrose.Input.Touch(DOMElement, {
        lockPointer: { buttons: [Primrose.Keys.ANY], commandUp: emit.bind(this, "lockpointer") },
        pointer: {
          buttons: [Primrose.Keys.ANY],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        buttons: { axes: [Primrose.Input.Touch.FINGERS] },
        dButtons: { axes: [Primrose.Input.Touch.FINGERS], delta: true },
        pointerX: { axes: [Primrose.Input.Touch.X0] },
        pointerY: { axes: [Primrose.Input.Touch.Y0] },
        dx: { axes: [-Primrose.Input.Touch.X0], delta: true, scale: 0.005, min: -5, max: 5 },
        heading: { commands: ["dx"], integrate: true },
        dy: { axes: [-Primrose.Input.Touch.Y0], delta: true, scale: 0.005, min: -5, max: 5 },
        pitch: { commands: ["dy"], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 }
      }), new Primrose.Input.Gamepad({
        pointer: {
          buttons: [Primrose.Input.Gamepad.XBOX_BUTTONS.A],
          commandDown: emit.bind(this, "pointerstart"),
          commandUp: emit.bind(this, "pointerend")
        },
        strafe: { axes: [Primrose.Input.Gamepad.LSX] },
        drive: { axes: [Primrose.Input.Gamepad.LSY] },
        heading: { axes: [-Primrose.Input.Gamepad.RSX], integrate: true },
        dheading: { commands: ["heading"], delta: true },
        pitch: { axes: [Primrose.Input.Gamepad.RSY], integrate: true }
      })];

      if (Primrose.Input.VR.Version > 0) {
        var vr = new Primrose.Input.VR();
        this.managers.push(vr);
        vr.init();
      }

      this.managers.forEach(function (mgr) {
        return _this[mgr.name] = mgr;
      });
    }

    _createClass(FPSInput, [{
      key: "zero",
      value: function zero() {
        if (this.vr && this.vr.currentDisplay) {
          this.vr.currentDisplay.resetPose();
        }
        if (this.motion) {
          this.motion.zeroAxes();
        }
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          for (var j = 0; mgr.enabled && j < SETTINGS_TO_ZERO.length; ++j) {
            mgr.setValue(SETTINGS_TO_ZERO[j], 0);
          }
        }
      }
    }, {
      key: "update",
      value: function update() {
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            if (mgr.poll) {
              mgr.poll();
            }
            mgr.update();
          }
        }
      }
    }, {
      key: "addEventListener",
      value: function addEventListener(evt, thunk, bubbles) {
        if (this.listeners[evt]) {
          this.listeners[evt].push(thunk);
        } else {
          this.managers.forEach(function (mgr) {
            if (mgr.addEventListener) {
              mgr.addEventListener(evt, thunk, bubbles);
            }
          });
        }
      }
    }, {
      key: "getValue",
      value: function getValue(name) {
        var value = 0;
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            value += mgr.getValue(name);
          }
        }
        return value;
      }
    }, {
      key: "getLatestValue",
      value: function getLatestValue(name) {
        var value = 0,
            maxT = Number.MIN_VALUE;
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled && mgr.lastT > maxT) {
            maxT = mgr.lastT;
            value = mgr.getValue(name);
          }
        }
        return value;
      }
    }, {
      key: "getVector3",
      value: function getVector3(x, y, z, value) {
        value = value || new THREE.Vector3();
        value.set(0, 0, 0);
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            mgr.addVector3(x, y, z, value);
          }
        }
        return value;
      }
    }, {
      key: "getVector3s",
      value: function getVector3s(x, y, z, values) {
        values = values || [];
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled) {
            values[i] = mgr.getVector3(x, y, z, values[i]);
          }
        }
        return values;
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(x, y, z, w, value, accumulate) {
        value = value || new THREE.Quaternion();
        value.set(0, 0, 0, 1);
        for (var i = 0; i < this.managers.length; ++i) {
          var mgr = this.managers[i];
          if (mgr.enabled && mgr.getOrientation) {
            mgr.getOrientation(x, y, z, w, temp);
            value.multiply(temp);
            if (!accumulate) {
              break;
            }
          }
        }
        return value;
      }
    }, {
      key: "VRDisplays",
      get: function get() {
        return this.VR && this.VR.displays;
      }
    }]);

    return FPSInput;
  }();

  return FPSInput;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Gamepad = function () {

  var Gamepad = function (_Primrose$InputProces) {
    _inherits(Gamepad, _Primrose$InputProces);

    function Gamepad(commands, socket, gpid) {
      _classCallCheck(this, Gamepad);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Gamepad).call(this, "Gamepad", commands, socket));

      var connectedGamepads = [],
          listeners = {
        gamepadconnected: [],
        gamepaddisconnected: []
      };

      _this.checkDevice = function (pad) {
        var i;
        for (i = 0; i < pad.buttons.length; ++i) {
          this.setButton(i, pad.buttons[i].pressed);
        }
        for (i = 0; i < pad.axes.length; ++i) {
          this.setAxis(Gamepad.AXES[i], pad.axes[i]);
        }
      };

      _this.poll = function () {
        var pads,
            currentPads = [],
            i;

        if (navigator.getGamepads) {
          pads = navigator.getGamepads();
        } else if (navigator.webkitGetGamepads) {
          pads = navigator.webkitGetGamepads();
        }

        if (pads) {
          for (i = 0; i < pads.length; ++i) {
            var pad = pads[i];
            if (pad) {
              if (!gpid) {
                gpid = pad.id;
              }
              if (connectedGamepads.indexOf(pad.id) === -1) {
                connectedGamepads.push(pad.id);
                onConnected(pad.id);
              }
              if (pad.id === gpid) {
                this.checkDevice(pad);
              }
              currentPads.push(pad.id);
            }
          }
        }

        for (i = connectedGamepads.length - 1; i >= 0; --i) {
          if (currentPads.indexOf(connectedGamepads[i]) === -1) {
            onDisconnected(connectedGamepads[i]);
            connectedGamepads.splice(i, 1);
          }
        }
      };

      function add(arr, val) {
        if (arr.indexOf(val) === -1) {
          arr.push(val);
        }
      }

      function remove(arr, val) {
        var index = arr.indexOf(val);
        if (index > -1) {
          arr.splice(index, 1);
        }
      }

      function sendAll(arr, id) {
        for (var i = 0; i < arr.length; ++i) {
          arr[i](id);
        }
      }

      function onConnected(id) {
        sendAll(listeners.gamepadconnected, id);
      }

      function onDisconnected(id) {
        sendAll(listeners.gamepaddisconnected, id);
      }

      _this.getErrorMessage = function () {
        return errorMessage;
      };

      _this.setGamepad = function (id) {
        gpid = id;
        this.inPhysicalUse = true;
      };

      _this.clearGamepad = function () {
        gpid = null;
        this.inPhysicalUse = false;
      };

      _this.isGamepadSet = function () {
        return !!gpid;
      };

      _this.getConnectedGamepads = function () {
        return connectedGamepads.slice();
      };

      _this.addEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
        if (event === "gamepadconnected") {
          connectedGamepads.forEach(onConnected);
        }
      };

      _this.removeEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          remove(listeners[event], handler);
        }
      };

      try {
        _this.update();
        _this.available = true;
      } catch (exp) {
        console.error(exp);
        _this.avaliable = false;
        _this.errorMessage = exp;
      }
      return _this;
    }

    return Gamepad;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(Gamepad, ["LSX", "LSY", "RSX", "RSY"]);
  return Gamepad;
}();

Primrose.Input.Gamepad.XBOX_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  leftBumper: 5,
  rightBumper: 6,
  leftTrigger: 7,
  rightTrigger: 8,
  back: 9,
  start: 10,
  leftStick: 11,
  rightStick: 12,
  up: 13,
  down: 14,
  left: 15,
  right: 16
};
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Keyboard = function () {

  var Keyboard = function (_Primrose$InputProces) {
    _inherits(Keyboard, _Primrose$InputProces);

    function Keyboard(DOMElement, commands, socket) {
      _classCallCheck(this, Keyboard);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Keyboard).call(this, "Keyboard", commands, socket));

      DOMElement = DOMElement || window;

      function execute(stateChange, event) {
        this.setButton(event.keyCode, stateChange);
        this.update();
      }

      DOMElement.addEventListener("keydown", execute.bind(_this, true), false);
      DOMElement.addEventListener("keyup", execute.bind(_this, false), false);
      return _this;
    }

    return Keyboard;
  }(Primrose.InputProcessor);

  return Keyboard;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.LeapMotion = function () {
  function processFingerParts(i) {
    return LeapMotion.FINGER_PARTS.map(function (p) {
      return "FINGER" + i + p.toUpperCase();
    });
  }

  var LeapMotion = function (_Primrose$InputProces) {
    _inherits(LeapMotion, _Primrose$InputProces);

    function LeapMotion(commands, socket) {
      _classCallCheck(this, LeapMotion);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LeapMotion).call(this, "LeapMotion", commands, socket));

      _this.isStreaming = false;
      _this.controller = new Leap.Controller({ enableGestures: true });
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
            canceller = function () {
              clearTimeout(timeout);
              this.isStreaming = true;
            }.bind(this);
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

  return LeapMotion;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Location = function () {

  var Location = function (_Primrose$InputProces) {
    _inherits(Location, _Primrose$InputProces);

    function Location(commands, socket, options) {
      _classCallCheck(this, Location);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Location).call(this, "Location", commands, socket));

      _this.options = patch(options, Location.DEFAULTS);

      _this.available = !!navigator.geolocation;
      if (_this.available) {
        navigator.geolocation.watchPosition(_this.setState.bind(_this), function () {
          this.available = false;
        }.bind(_this), _this.options);
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

  return Location;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Motion = function () {

  var Motion = function (_Primrose$InputProces) {
    _inherits(Motion, _Primrose$InputProces);

    function Motion(commands, socket) {
      _classCallCheck(this, Motion);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Motion).call(this, "Motion", commands, socket));

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

  return Motion;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Mouse = function () {

  var Mouse = function (_Primrose$InputProces) {
    _inherits(Mouse, _Primrose$InputProces);

    function Mouse(DOMElement, commands, socket) {
      _classCallCheck(this, Mouse);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Mouse).call(this, "Mouse", commands, socket));

      DOMElement = DOMElement || window;

      DOMElement.addEventListener("mousedown", function (event) {
        _this.setButton(event.button, true);
        _this.BUTTONS = event.buttons << 10;
        _this.update();
      }, false);

      DOMElement.addEventListener("mouseup", function (event) {
        _this.setButton(event.button, false);
        _this.BUTTONS = event.buttons << 10;
        _this.update();
      }, false);

      DOMElement.addEventListener("mousemove", function (event) {
        _this.BUTTONS = event.buttons << 10;
        if (Mouse.Lock.isActive) {
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
        _this.update();
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
        _this.update();
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

  var elementName = findProperty(document, ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"]),
      changeEventName = findProperty(document, ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"]),
      errorEventName = findProperty(document, ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"]),
      requestMethodName = findProperty(document.documentElement, ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"]),
      exitMethodName = findProperty(document, ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  Mouse.Lock = {
    addChangeListener: function addChangeListener(thunk, bubbles) {
      return document.addEventListener(changeEventName, thunk, bubbles);
    },
    removeChangeListener: function removeChangeListener(thunk) {
      return document.removeEventListener(changeEventName, thunk);
    },
    addErrorListener: function addErrorListener(thunk, bubbles) {
      return document.addEventListener(errorEventName, thunk, bubbles);
    },
    removeErrorListener: function removeErrorListener(thunk) {
      return document.removeEventListener(errorEventName, thunk);
    },
    withChange: function withChange(act) {
      return new Promise(function (resolve, reject) {
        var onPointerLock,
            onPointerLockError,
            timeout,
            tearDown = function tearDown() {
          if (timeout) {
            clearTimeout(timeout);
          }
          Mouse.Lock.removeChangeListener(onPointerLock);
          Mouse.Lock.removeErrorListener(onPointerLockError);
        };

        onPointerLock = function onPointerLock() {
          setTimeout(tearDown);
          resolve(Mouse.Lock.element);
        };

        onPointerLockError = function onPointerLockError(evt) {
          setTimeout(tearDown);
          reject(evt);
        };

        Mouse.Lock.addChangeListener(onPointerLock, false);
        Mouse.Lock.addErrorListener(onPointerLockError, false);

        if (act()) {
          tearDown();
          resolve();
        } else {
          // Timeout wating on the pointer lock to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          timeout = setTimeout(function () {
            tearDown();
            reject("Pointer Lock state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: function request(elem) {
      return Mouse.Lock.withChange(function () {
        if (!requestMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        } else if (Mouse.Lock.isActive) {
          return true;
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: function exit() {
      return Mouse.Lock.withChange(function () {
        if (!exitMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        } else if (!Mouse.Lock.isActive) {
          return true;
        } else {
          document[exitMethodName]();
        }
      });
    }
  };

  Object.defineProperties(Mouse.Lock, {
    element: {
      get: function get() {
        return document[elementName];
      }
    },
    isActive: {
      get: function get() {
        return !!Mouse.Lock.element;
      }
    }
  });

  Primrose.InputProcessor.defineAxisProperties(Mouse, ["X", "Y", "Z", "W", "BUTTONS"]);

  return Mouse;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Speech = function () {

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

    function Speech(commands, socket) {
      _classCallCheck(this, Speech);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Speech).call(this, "Speech", commands, socket));

      var running = false,
          recognition = null,
          errorMessage = null;

      function warn() {
        var msg = fmt("Failed to initialize speech engine. Reason: $1", errorMessage.message);
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

        recognition.addEventListener("error", function (event) {
          restart = true;
          console.log("speech error", event);
          running = false;
          command = "speech error";
        }.bind(_this), true);

        recognition.addEventListener("end", function () {
          console.log("speech ended", arguments);
          running = false;
          command = "speech ended";
          if (restart) {
            restart = false;
            this.enable(true);
          }
        }.bind(_this), true);

        recognition.addEventListener("result", function (event) {
          var newCommand = [];
          var result = event.results[event.resultIndex];
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

  return Speech;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Touch = function () {

  var Touch = function (_Primrose$InputProces) {
    _inherits(Touch, _Primrose$InputProces);

    function Touch(DOMElement, commands, socket) {
      _classCallCheck(this, Touch);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Touch).call(this, "Touch", commands, socket));

      DOMElement = DOMElement || window;

      function setState(stateChange, setAxis, event) {
        var touches = event.changedTouches;
        for (var i = 0; i < touches.length; ++i) {
          var t = touches[i];

          if (setAxis) {
            this.setAxis("X" + t.identifier, t.pageX);
            this.setAxis("Y" + t.identifier, t.pageY);
          } else {
            this.setAxis("LX" + t.identifier, t.pageX);
            this.setAxis("LY" + t.identifier, t.pageY);
          }

          this.setButton("FINGER" + t.identifier, stateChange);

          var mask = 1 << t.identifier;
          if (stateChange) {
            this.FINGERS |= mask;
          } else {
            mask = ~mask;
            this.FINGERS &= mask;
          }
        }
        event.preventDefault();
        this.update();
      }

      DOMElement.addEventListener("touchstart", setState.bind(_this, true, false), false);
      DOMElement.addEventListener("touchend", setState.bind(_this, false, true), false);
      DOMElement.addEventListener("touchmove", setState.bind(_this, true, true), false);
      return _this;
    }

    return Touch;
  }(Primrose.InputProcessor);

  Touch.NUM_FINGERS = 10;

  var axes = ["FINGERS"];
  for (var i = 0; i < Touch.NUM_FINGERS; ++i) {
    axes.push("X" + i);
    axes.push("Y" + i);
  }

  Primrose.InputProcessor.defineAxisProperties(Touch, axes);
  return Touch;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR = function () {

  function makeTransform(s, eye, near, far) {
    var t = eye.offset;
    s.translation = new THREE.Matrix4().makeTranslation(t[0], t[1], t[2]);
    s.projection = fieldOfViewToProjectionMatrix(eye.fieldOfView, near, far);
    s.viewport = {
      left: 0,
      top: 0,
      width: eye.renderWidth,
      height: eye.renderHeight
    };
  }

  function fieldOfViewToProjectionMatrix(fov, zNear, zFar) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI / 180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan),
        matrix = new THREE.Matrix4();

    matrix.elements[0] = xScale;
    matrix.elements[1] = 0.0;
    matrix.elements[2] = 0.0;
    matrix.elements[3] = 0.0;
    matrix.elements[4] = 0.0;
    matrix.elements[5] = yScale;
    matrix.elements[6] = 0.0;
    matrix.elements[7] = 0.0;
    matrix.elements[8] = -((leftTan - rightTan) * xScale * 0.5);
    matrix.elements[9] = (upTan - downTan) * yScale * 0.5;
    matrix.elements[10] = -(zNear + zFar) / (zFar - zNear);
    matrix.elements[11] = -1.0;
    matrix.elements[12] = 0.0;
    matrix.elements[13] = 0.0;
    matrix.elements[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
    matrix.elements[15] = 0.0;

    return matrix;
  }

  var VR = function (_Primrose$InputProces) {
    _inherits(VR, _Primrose$InputProces);

    function VR(commands, socket, elem, selectedIndex) {
      _classCallCheck(this, VR);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(VR).call(this, "VR", commands, socket));

      if (commands === undefined || commands === null) {
        commands = VR.AXES.map(function (a) {
          return {
            name: a,
            axes: [Primrose.Input.VR[a]]
          };
        });
      }

      var listeners = {
        vrdeviceconnected: [],
        vrdevicelost: []
      };

      _this.addEventListener = function (event, handler, bubbles) {
        if (listeners[event]) {
          listeners[event].push(handler);
        }
        if (event === "vrdeviceconnected") {
          Object.keys(this.displays).forEach(handler);
        }
      };

      _this.displays = [];
      _this.currentDisplay = null;
      _this.currentPose = null;
      _this.transforms = null;

      function onConnected(id) {
        for (var i = 0; i < listeners.vrdeviceconnected.length; ++i) {
          listeners.vrdeviceconnected[i](id);
        }
      }

      function enumerateVRDisplays(elem, displays) {
        console.log("Displays found:", displays.length);
        this.displays = displays;
        this.displays.forEach(onConnected);

        if (typeof selectedIndex === "number" && 0 <= selectedIndex && selectedIndex < this.displays.length) {
          this.connect(selectedIndex);
          return this.currentDisplay;
        }
      }

      function enumerateLegacyVRDevices(elem, devices) {
        console.log("Devices found:", devices.length);
        var displays = {},
            id = null;

        for (var i = 0; i < devices.length; ++i) {
          var device = devices[i];
          id = device.hardwareUnitId;
          if (!displays[id]) {
            displays[id] = {};
          }

          var display = displays[id];
          if (device instanceof HMDVRDevice) {
            display.display = device;
          } else if (devices[i] instanceof PositionSensorVRDevice) {
            display.sensor = device;
          }
        }

        var mockedLegacyDisplays = [];
        for (id in displays) {
          mockedLegacyDisplays.push(new Primrose.Input.VR.LegacyVRDisplay(displays[id].display, displays[id].sensor));
        }

        return enumerateVRDisplays.call(this, elem, mockedLegacyDisplays);
      }

      function createCardboardVRDisplay(elem) {
        var mockedCardboardDisplays = [new Primrose.Input.VR.CardboardVRDisplay()];
        return enumerateVRDisplays.call(this, elem, mockedCardboardDisplays);
      }

      _this.init = function () {
        var _this2 = this;

        console.info("Checking for VR Displays...");
        if (navigator.getVRDisplays) {
          console.info("Using WebVR API 1");
          return navigator.getVRDisplays().then(enumerateVRDisplays.bind(this, elem));
        } else if (navigator.getVRDevices) {
          console.info("Using Chromium Experimental WebVR API");
          return navigator.getVRDevices().then(enumerateLegacyVRDevices.bind(this, elem)).catch(console.error.bind(console, "Could not find VR devices"));
        } else {
          return new Promise(function (resolve, reject) {
            var timer = setTimeout(reject, 1000);
            var waitForValidMotion = function waitForValidMotion(evt) {
              if (evt.alpha) {
                clearTimeout(timer);
                timer = null;
                window.removeEventListener("deviceorientation", waitForValidMotion);
                console.info("Using Device Motion API");
                resolve(createCardboardVRDisplay.call(_this2, elem));
              }
            };
            console.info("Your browser doesn't have WebVR capability. Check out http://mozvr.com/. We're still going to try for Device Motion API, but there is no way to know ahead of time if your device has a motion sensor.");
            window.addEventListener("deviceorientation", waitForValidMotion, false);
          });
        }
      };
      return _this;
    }

    _createClass(VR, [{
      key: "requestPresent",
      value: function requestPresent(opts) {
        if (!this.currentDisplay) {
          return Promise.reject("No display");
        } else {
          return this.currentDisplay.requestPresent(VR.Version === 1 && isMobile ? opts[0] : opts).then(function (elem) {
            return elem || opts[0].source;
          });
        }
      }
    }, {
      key: "poll",
      value: function poll() {
        if (this.currentDisplay) {
          var pose = this.currentDisplay.getPose();
          if (pose) {
            this.currentPose = pose;

            if (pose.position) {
              this.headX = pose.position[0];
              this.headY = pose.position[1];
              this.headZ = pose.position[2];
            }
            if (pose.linearVelocity) {
              this.headVX = pose.linearVelocity[0];
              this.headVY = pose.linearVelocity[1];
              this.headVZ = pose.linearVelocity[2];
            }
            if (pose.linearAcceleration) {
              this.headAX = pose.linearAcceleration[0];
              this.headAY = pose.linearAcceleration[1];
              this.headAZ = pose.linearAcceleration[2];
            }

            if (pose.orientation) {
              this.headRX = pose.orientation[0];
              this.headRY = pose.orientation[1];
              this.headRZ = pose.orientation[2];
              this.headRW = pose.orientation[3];
            }
            if (pose.angularVelocity) {
              this.headRVX = pose.angularVelocity[0];
              this.headRVY = pose.angularVelocity[1];
              this.headRVZ = pose.angularVelocity[2];
            }
            if (pose.angularAcceleration) {
              this.headRAX = pose.angularAcceleration[0];
              this.headRAY = pose.angularAcceleration[1];
              this.headRAZ = pose.angularAcceleration[2];
            }
          }
        }
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(value) {
        value = value || new THREE.Quaternion();
        value.set(this.getValue("headRX"), this.getValue("headRY"), this.getValue("headRZ"), this.getValue("headRW"));
        return value;
      }
    }, {
      key: "resetTransforms",
      value: function resetTransforms(near, far) {
        if (this.currentDisplay) {
          this.enabled = true;
          var params = {
            left: this.currentDisplay.getEyeParameters("left"),
            right: this.currentDisplay.getEyeParameters("right")
          };
          var transforms = [{}, {}];
          makeTransform(transforms[0], params.left, near, far);
          makeTransform(transforms[1], params.right, near, far);
          transforms[1].viewport.left = transforms[0].viewport.width;
          this.transforms = transforms;
        }
      }
    }, {
      key: "connect",
      value: function connect(selectedIndex) {
        this.currentDisplay = this.displays[selectedIndex];
      }
    }], [{
      key: "Version",
      get: function get() {
        if (navigator.getVRDisplays) {
          return 1.0;
        } else if (navigator.getVRDevices) {
          return 0.5;
        } else if (navigator.mozGetVRDevices) {
          return 0.4;
        } else if (isMobile) {
          return 0.1;
        } else {
          return 0;
        }
      }
    }]);

    return VR;
  }(Primrose.InputProcessor);

  Primrose.InputProcessor.defineAxisProperties(VR, ["headX", "headY", "headZ", "headVX", "headVY", "headVZ", "headAX", "headAY", "headAZ", "headRX", "headRY", "headRZ", "headRW", "headRVX", "headRVY", "headRVZ", "headRAX", "headRAY", "headRAZ"]);

  return VR;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Input.VRDisplayPolyfill = function () {
  "use strict";

  var VRDisplayPolyfill = function () {
    function VRDisplayPolyfill(canPresent, hasOrientation, hasPosition, displayID, displayName) {
      var _this = this;

      _classCallCheck(this, VRDisplayPolyfill);

      this.capabilities = {
        canPresent: canPresent,
        hasExternalDisplay: false,
        hasOrientation: hasOrientation,
        hasPosition: hasPosition
      };

      this.displayID = displayID;
      this.displayName = displayName;
      this.isConnected = true;
      this.isPresenting = false;
      this.stageParameters = null;

      this._currentLayer = null;

      this._onFullScreenRemoved = function () {
        FullScreen.removeChangeListener(_this._onFullScreenRemoved);
        _this.exitPresent();
        window.dispatchEvent(new Event("vrdisplaypresentchange"));
      };
    }

    _createClass(VRDisplayPolyfill, [{
      key: "getLayers",
      value: function getLayers() {
        if (this._currentLayer) {
          return [this._currentLayer];
        } else {
          return [];
        }
      }
    }, {
      key: "exitPresent",
      value: function exitPresent() {
        var _this2 = this;

        var clear = function clear(err) {
          if (err) {
            console.error(err);
          }
          console.log("exit presenting");
          _this2.isPresenting = false;
          _this2._currentLayer = null;
        };
        return FullScreen.exit().then(function (elem) {
          clear();
          return elem;
        }).catch(clear);
      }
    }, {
      key: "requestPresent",
      value: function requestPresent(layers) {
        var _this3 = this;

        if (!this.capabilities.canPresent) {
          return Promrise.reject(new Error("This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName));
        } else if (!layers) {
          return Promise.reject(new Error("No layers provided to requestPresent"));
        } else if (!(layers instanceof Array)) {
          return Promise.reject(new Error("Layers parameters must be an array"));
        } else if (layers.length !== 1) {
          return Promise.reject(new Error("Only one layer at a time is supported right now."));
        } else if (!layers[0].source) {
          return Promise.reject(new Error("No source on layer parameter."));
        } else {
          return this._requestPresent(layers).then(function (elem) {
            _this3._currentLayer = layers[0];
            _this3.isPresenting = elem === _this3._currentLayer.source;
            FullScreen.addChangeListener(_this3._onFullScreenRemoved, false);
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            return elem;
          });
        }
      }
    }, {
      key: "requestAnimationFrame",
      value: function requestAnimationFrame(thunk) {
        window.requestAnimationFrame(thunk);
      }
    }, {
      key: "cancelAnimationFrame",
      value: function cancelAnimationFrame(handle) {
        window.cancelAnimationFrame(handle);
      }
    }, {
      key: "submitFrame",
      value: function submitFrame() {}
    }]);

    return VRDisplayPolyfill;
  }();

  return VRDisplayPolyfill;
}();
"use strict";

Primrose.Output.Audio3D = function () {

  // polyfill
  Window.prototype.AudioContext = Window.prototype.AudioContext || Window.prototype.webkitAudioContext || function () {};

  function Audio3D() {
    var _this = this;

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

  Audio3D.prototype.start = function () {
    this.mainVolume.connect(this.context.destination);
  };

  Audio3D.prototype.stop = function () {
    this.mainVolume.disconnect();
  };

  Audio3D.prototype.loadURL = function (src) {
    var _this2 = this;

    return Primrose.HTTP.getBuffer(src).then(function (data) {
      return new Promise(function (resolve, reject) {
        return _this2.context.decodeAudioData(data, resolve, reject);
      });
    });
  };

  Audio3D.prototype.loadURLCascadeSrcList = function (srcs, index) {
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
  };

  Audio3D.prototype.createRawSound = function (pcmData) {
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
  };

  Audio3D.prototype.createSound = function (loop, buffer) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect(snd.volume);
    return snd;
  };

  Audio3D.prototype.create3DSound = function (x, y, z, snd) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition(x, y, z);
    snd.panner.connect(this.mainVolume);
    snd.volume.connect(snd.panner);
    return snd;
  };

  Audio3D.prototype.createFixedSound = function (snd) {
    snd.volume.connect(this.mainVolume);
    return snd;
  };

  Audio3D.prototype.loadSource = function (sources, loop) {
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
        audio.oncanplay = null;
        var snd = {
          volume: _this4.context.createGain(),
          source: _this4.context.createMediaElementSource(audio)
        };
        snd.source.connect(snd.volume);
        resolve(snd);
      };
      audio.onerror = reject;
      document.body.appendChild(audio);
    });
  };

  Audio3D.prototype.load3DSound = function (src, loop, x, y, z) {
    return this.loadSource(src, loop).then(this.create3DSound.bind(this, x, y, z));
  };

  Audio3D.prototype.loadFixedSound = function (src, loop) {
    return this.loadSource(src, loop).then(this.createFixedSound.bind(this));
  };

  Audio3D.prototype.playBufferImmediate = function (buffer, volume) {
    var _this5 = this;

    var snd = this.createSound(false, buffer);
    snd = this.createFixedSound(snd);
    snd.volume.gain.value = volume;
    snd.source.addEventListener("ended", function (evt) {
      snd.volume.disconnect(_this5.mainVolume);
    });
    snd.source.start(0);
    return snd;
  };

  return Audio3D;
}();
"use strict";

Primrose.Output.HapticGlove = function () {

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
  return HapticGlove;
}();
"use strict";

Primrose.Output.Music = function () {

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

  return Music;
}();
"use strict";

Primrose.Output.Speech = function () {
  function pickRandomOption(options, key, min, max) {
    if (options[key] === undefined) {
      options[key] = min + (max - min) * Math.random();
    } else {
      options[key] = Math.min(max, Math.max(min, options[key]));
    }
    return options[key];
  }

  try {
    return function (options) {
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
    return function () {
      this.speak = function () {};
    };
  }
}();
"use strict";

Primrose.Random.int = function (min, max, power) {
  power = power || 1;
  if (max === undefined) {
    max = min;
    min = 0;
  }
  var delta = max - min,
      n = Math.pow(Math.random(), power);
  return Math.floor(min + n * delta);
};
"use strict";

Primrose.Random.item = function (arr) {
  return arr[Primrose.Random.int(arr.length)];
};
"use strict";

Primrose.Random.number = function (min, max) {
  return Math.random() * (max - min) + min;
};
"use strict";

Primrose.Random.steps = function (min, max, steps) {
  return min + Primrose.Random.int(0, (1 + max - min) / steps) * steps;
};
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Primrose.Text.CodePage = function () {
  "use strict";

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

  return CodePage;
}();
"use strict";

Primrose.Text.CommandPack = function () {
  "use strict";

  function CommandPack(name, commands) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
}();
"use strict";

Primrose.Text.Cursor = function () {
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

  return Cursor;
}();
"use strict";

Primrose.Text.Grammar = function () {
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

    Grammar.prototype.toHTML = function (txt) {
      var tokenRows = this.tokenize(txt),
          temp = document.createElement("div");
      for (var y = 0; y < tokenRows.length; ++y) {
        // draw the tokens on this row
        var t = tokenRows[y];
        if (t.type === "newlines") {
          temp.appendChild(document.createElement("br"));
        } else {
          var style = Primrose.Text.Themes.Default[t.type] || {},
              elem = document.createElement("span");
          elem.style.fontWeight = style.fontWeight || Primrose.Text.Themes.Default.regular.fontWeight;
          elem.style.fontStyle = style.fontStyle || Primrose.Text.Themes.Default.regular.fontStyle || "";
          elem.style.color = style.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
          elem.style.backgroundColor = style.backColor || Primrose.Text.Themes.Default.regular.backColor;
          elem.style.fontFamily = style.fontFamily || Primrose.Text.Themes.Default.fontFamily;
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

  return Grammar;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Text.OperatingSystem = function () {
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

  return OperatingSystem;
}();
"use strict";

Primrose.Text.Point = function () {
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

  return Point;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Text.Rectangle = function () {
  "use strict";

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

  return Rectangle;
}();
"use strict";

Primrose.Text.Rule = function () {
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

  return Rule;
}();
"use strict";

Primrose.Text.Size = function () {
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

  return Size;
}();
"use strict";

Primrose.Text.Terminal = function (inputEditor, outputEditor) {
  "use strict";

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

  this.execute = function (inVR) {
    pageSize = inVR ? 10 : 40;
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
"use strict";

Primrose.Text.Token = function () {
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

  return Token;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR.CardboardVRDisplay = function () {
  "use strict";

  var CardboardVRDisplay = function (_Primrose$Input$VRDis) {
    _inherits(CardboardVRDisplay, _Primrose$Input$VRDis);

    function CardboardVRDisplay() {
      _classCallCheck(this, CardboardVRDisplay);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CardboardVRDisplay).call(this, true, isMobile, false, "B4CEAE28-1A89-4314-872E-9C223DDABD02", "Device Motion API"));

      var corrector = new Primrose.Input.VR.MotionCorrector(),
          currentPose = null,
          frameID = 0;

      _this.getEyeParameters = function (side) {
        var dEye = side === "left" ? -1 : 1;

        return {
          renderWidth: Math.floor(screen.width * devicePixelRatio / 2),
          renderHeight: screen.height * devicePixelRatio,
          offset: new Float32Array([dEye * 0.03, 0, 0]),
          fieldOfView: {
            upDegrees: 40,
            downDegrees: 40,
            leftDegrees: 40,
            rightDegrees: 40
          }
        };
      };

      corrector.addEventListener("deviceorientation", function (evt) {
        currentPose = {
          timestamp: performance.now(),
          frameID: ++frameID,
          orientation: new Float32Array(evt.toArray())
        };
      });

      _this.getImmediatePose = function () {
        return currentPose;
      };

      _this.getPose = function () {
        return currentPose;
      };

      _this.resetPose = corrector.zeroAxes.bind(corrector);

      _this._requestPresent = function (layers) {
        return FullScreen.request(layers[0].source);
      };
      return _this;
    }

    return CardboardVRDisplay;
  }(Primrose.Input.VRDisplayPolyfill);

  return CardboardVRDisplay;
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.VR.LegacyVRDisplay = function () {
  "use strict";

  function makeDisplayName(legacyDisplay, legacySensor) {
    var displayName = "";
    var a = legacyDisplay.deviceName,
        b = legacySensor.deviceName;
    for (var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i) {
      displayName += a[i];
    }
    while (displayName.length > 0 && !/\w/.test(displayName[displayName.length - 1])) {
      displayName = displayName.substring(0, displayName.length - 1);
    }
    return displayName;
  }

  var frameID = 0;
  function createPoseFromState(state) {
    var pose = {
      timestamp: state.timestamp,
      frameID: ++frameID,
      position: null,
      linearVelocity: null,
      linearAcceleration: null,
      orientation: null,
      angularVelocity: null,
      angularAcceleration: null
    };

    if (state.position) {
      pose.position = new Float32Array([state.position.x, state.position.y, state.position.z]);
    }
    if (state.linearVelocity) {
      pose.linearVelocity = new Float32Array([state.linearVelocity.x, state.linearVelocity.y, state.linearVelocity.z]);
    }
    if (state.linearAcceleration) {
      pose.linearAcceleration = new Float32Array([state.linearAcceleration.x, state.linearAcceleration.y, state.linearAcceleration.z]);
    }
    if (state.orientation) {
      pose.orientation = new Float32Array([state.orientation.x, state.orientation.y, state.orientation.z, state.orientation.w]);
    }
    if (state.angularVelocity) {
      pose.angularVelocity = new Float32Array([state.angularVelocity.x, state.angularVelocity.y, state.angularVelocity.z]);
    }
    if (state.angularAcceleration) {
      pose.angularAcceleration = new Float32Array([state.angularAcceleration.x, state.angularAcceleration.y, state.angularAcceleration.z]);
    }
    return pose;
  }

  var LegacyVRDisplay = function (_Primrose$Input$VRDis) {
    _inherits(LegacyVRDisplay, _Primrose$Input$VRDis);

    function LegacyVRDisplay(legacyDisplay, legacySensor) {
      _classCallCheck(this, LegacyVRDisplay);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LegacyVRDisplay).call(this, !!legacyDisplay, !!legacySensor, !!legacySensor, legacyDisplay.hardwareUnitId, makeDisplayName(legacyDisplay, legacySensor)));

      _this.getEyeParameters = function (side) {
        var oldFormat = null;
        if (legacyDisplay.getEyeParameters) {
          oldFormat = legacyDisplay.getEyeParameters(side);
        } else {
          oldFormat = {
            renderRect: legacyDisplay.getRecommendedEyeRenderRect(side),
            eyeTranslation: legacyDisplay.getEyeTranslation(side),
            recommendedFieldOfView: legacyDisplay.getRecommendedEyeFieldOfView(side)
          };
        }

        var newFormat = {
          renderWidth: oldFormat.renderRect.width,
          renderHeight: oldFormat.renderRect.height,
          offset: new Float32Array([oldFormat.eyeTranslation.x, oldFormat.eyeTranslation.y, oldFormat.eyeTranslation.z]),
          fieldOfView: oldFormat.recommendedFieldOfView
        };

        return newFormat;
      };

      _this.getImmediatePose = function () {
        return createPoseFromState(legacySensor.getImmediateState());
      };

      _this.getPose = function () {
        return createPoseFromState(legacySensor.getState());
      };

      _this.resetPose = legacySensor.resetSensor.bind(legacySensor);

      _this._requestPresent = function (layers) {
        return FullScreen.request(layers[0].source, {
          vrDisplay: legacyDisplay,
          vrDistortion: true
        });
      };
      return _this;
    }

    return LegacyVRDisplay;
  }(Primrose.Input.VRDisplayPolyfill);

  ;
  return LegacyVRDisplay;
}();
"use strict";

Primrose.Input.VR.MotionCorrector = function () {

  ////
  // Class: MotionCorrector
  //
  // The MotionCorrector class observes orientation and gravitational acceleration values
  // and determines a corrected set of orientation values that reset the orientation
  // origin to 0 degrees north, 0 degrees above the horizon, with 0 degrees of tilt
  // in the landscape orientation. This is useful for head-mounted displays (HMD).
  //
  // Constructor: new MotionCorrector( );
  ///
  function MotionCorrector() {
    var e = new THREE.Euler(),
        o = new THREE.Quaternion(),
        q = new THREE.Quaternion(),
        s = new THREE.Quaternion(),
        correct = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)),
        zero = new THREE.Quaternion(),
        first = true,
        listeners = [];

    function waitForOrientation(event) {
      if (event.alpha) {
        window.removeEventListener("deviceorientation", waitForOrientation);
        checkDeviceOrientation(event);
        checkScreenOrientation();
        window.addEventListener("deviceorientation", checkDeviceOrientation, false);
        window.addEventListener("orientationchange", checkScreenOrientation, false);
      }
    }

    function checkScreenOrientation() {
      var a = Math.PI * -window.orientation / 360;
      s.set(0, Math.sin(a), 0, Math.cos(a));
    }

    function checkDeviceOrientation(event) {
      e.set(event.beta * Math.PI / 180, event.alpha * Math.PI / 180, -event.gamma * Math.PI / 180, 'YXZ');
      o.setFromEuler(e);
      q.copy(zero).multiply(o).multiply(s).multiply(correct);
      for (var i = 0; i < listeners.length; ++i) {
        listeners[i](q);
      }
    }
    /*
     Add an event listener for motion/orientation events.
     
     Parameters:
     type: There is only one type of event, called "deviceorientation". Any other value for type will result
     in an error. It is included to maintain interface compatability with the regular DOM event handler
     syntax, and the standard device orientation events.
     
     callback: the function to call when an event occures
     
     [bubbles]: set to true if the events should be captured in the bubbling phase. Defaults to false. The
     non-default behavior is rarely needed, but it is included for completeness.
     */
    this.addEventListener = function (type, callback, bubbles) {
      if (type !== "deviceorientation") {
        throw new Error("The only event type that is supported is \"deviceorientation\". Type parameter was: " + type);
      }
      if (typeof callback !== "function") {
        throw new Error("A function must be provided as a callback parameter. Callback parameter was: " + callback);
      }

      if (first) {
        window.addEventListener("deviceorientation", waitForOrientation, false);
        first = false;
      }

      listeners.push(callback);
    };

    this.zeroAxes = function () {
      zero.set(0, e.y, 0, 1);
    };
  }

  // A few default values to let the code
  // run in a static view on a sensorless device.
  MotionCorrector.ZERO_EULER = { gamma: 90, alpha: 270, beta: 0 };
  return MotionCorrector;
}();
"use strict";

Primrose.Text.CodePages.DE_QWERTZ = function () {
  "use strict";

  var CodePage = Primrose.Text.CodePage;

  return new CodePage("Deutsch: QWERTZ", "de", {
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
}();
"use strict";

Primrose.Text.CodePages.EN_UKX = function () {
  "use strict";

  var CodePage = Primrose.Text.CodePage;

  return new CodePage("English: UK Extended", "en-GB", {
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
    }, SHIFT: {
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
}();
"use strict";

Primrose.Text.CodePages.EN_US = function () {
  "use strict";

  var CodePage = Primrose.Text.CodePage;

  return new CodePage("English: USA", "en-US", {
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
}();
"use strict";

Primrose.Text.CodePages.FR_AZERTY = function () {
  "use strict";

  var CodePage = Primrose.Text.CodePage;

  return new CodePage("Français: AZERTY", "fr", {
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
}();
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.BasicTextInput = function () {
  "use strict";

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
          emit.call(prim, "change", { target: prim });
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

  return BasicTextInput;
}();
"use strict";

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextEditor = function () {
  "use strict";

  return new Primrose.Text.CommandPacks.BasicTextInput("Text Area input commands", {
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
}();
"use strict";

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
//
Primrose.Text.CommandPacks.TextInput = function () {
  "use strict";

  return new Primrose.Text.CommandPacks.BasicTextInput("Text Line input commands");
}();
"use strict";

Primrose.Text.Controls.PlainText = function () {

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

  return PlainText;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Text.Controls.TextBox = function () {
  "use strict";

  var SCROLL_SCALE = isFirefox ? 3 : 100,
      COUNTER = 0;

  var TextBox = function (_Primrose$Surface) {
    _inherits(TextBox, _Primrose$Surface);

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
        _this.options = { value: _this.options };
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
            this.fontSize += evt.deltaX / SCROLL_SCALE;
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
      key: "bindEvents",
      value: function bindEvents(elem) {
        var _this2 = this;

        if (elem instanceof HTMLCanvasElement && (elem.tabindex === undefined || elem.tabindex === null)) {
          elem.tabindex = 0;
        }

        BrowserEnvironment.createSurrogate.call(this);

        elem.addEventListener("wheel", this.readWheel.bind(this), false);
        elem.addEventListener("mousedown", this.mouseButtonDown.bind(this), false);
        elem.addEventListener("mousemove", this.mouseMove.bind(this), false);
        elem.addEventListener("mouseup", this.mouseButtonUp.bind(this), false);
        elem.addEventListener("touchstart", this.touchStart.bind(this), false);
        elem.addEventListener("touchmove", this.touchMove.bind(this), false);
        elem.addEventListener("touchend", this.touchEnd.bind(this), false);
        elem.addEventListener("keydown", this.keyDown.bind(this), false);
        elem.addEventListener("beforepaste", function (evt) {
          return evt.returnValue = false;
        }, false);
        elem.addEventListener("paste", this.readClipboard.bind(this), false);
        elem.addEventListener("keydown", function (evt) {
          var os = isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows;
          if (_this2.focused && os.isClipboardReadingEvent(evt)) {
            _this2._surrogate.style.display = "block";
            _this2._surrogate.focus();
          }
        }, true);
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
            clearFunc = this.theme.regular.backColor ? "fillRect" : "clearRect";

        if (this.theme.regular.backColor) {
          this._bgfx.fillStyle = this.theme.regular.backColor;
        }

        this._bgfx[clearFunc](0, 0, this.imageWidth, this.imageHeight);
        this._bgfx.save();
        this._bgfx.translate((this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, -this.scroll.y * this.character.height + this.padding);

        // draw the current row highlighter
        if (this.focused) {
          this.fillRect(this._bgfx, this.theme.regular.currentRowBackColor || Primrose.Text.Themes.Default.regular.currentRowBackColor, 0, minCursor.y, this.gridBounds.width, maxCursor.y - minCursor.y + 1);
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
                this.fillRect(this._bgfx, this.theme.regular.selectedBackColor || Primrose.Text.Themes.Default.regular.selectedBackColor, selectionFront.x, selectionFront.y, cw, 1);
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
          this.fillRect(this._bgfx, cc, minCursor.x, minCursor.y, w, 1);
          this.fillRect(this._bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
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
                  this._fgfx.putImageData(this._rowCache[line], this.padding, textY + this.padding);
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
            this._rowCache[line] = this._fgfx.getImageData(this.padding, textY + this.padding, this.imageWidth - 2 * this.padding, this.character.height);
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
        emit.call(this, "change", { target: this });
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
        this._tabWidth = tw || 4;
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

  return TextBox;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Text.Controls.TextInput = function () {
  "use strict";

  var COUNTER = 0;

  var TextInput = function (_Primrose$Text$Contro) {
    _inherits(TextInput, _Primrose$Text$Contro);

    function TextInput(options) {
      _classCallCheck(this, TextInput);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TextInput).call(this, overwrite(patch(options, {
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
      })));

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

  return TextInput;
}();
"use strict";

Primrose.Text.Grammars.Basic = function () {

  var basicGrammar = new Primrose.Text.Grammar("BASIC",
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

  var oldTokenize = basicGrammar.tokenize;
  basicGrammar.tokenize = function (code) {
    return oldTokenize.call(this, code.toUpperCase());
  };

  basicGrammar.interpret = function (sourceCode, input, output, errorOut, next, clearScreen, loadFile, done) {
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
  return basicGrammar;
}();
"use strict";

Primrose.Text.Grammars.JavaScript = function () {
  "use strict";

  return new Primrose.Text.Grammar("JavaScript", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /\/\*/], ["endBlockComments", /\*\//], ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/], ["stringDelim", /("|')/], ["startLineComments", /\/\/.*$/m], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/], ["functions", /(\w+)(?:\s*\()/], ["members", /(\w+)\./], ["members", /((\w+\.)+)(\w+)/]]);
}();
"use strict";

Primrose.Text.Grammars.PlainText = function () {
  "use strict";

  return new Primrose.Text.Grammar("PlainText", [["newlines", /(?:\r\n|\r|\n)/]]);
}();
"use strict";

Primrose.Text.Grammars.TestResults = function () {
  "use strict";

  return new Primrose.Text.Grammar("TestResults", [["newlines", /(?:\r\n|\r|\n)/, true], ["numbers", /(\[)(o+)/, true], ["numbers", /(\d+ succeeded), 0 failed/, true], ["numbers", /^    Successes:/, true], ["functions", /(x+)\]/, true], ["functions", /[1-9]\d* failed/, true], ["functions", /^    Failures:/, true], ["comments", /(\d+ms:)(.*)/, true], ["keywords", /(Test results for )(\w+):/, true], ["strings", /        \w+/, true]]);
}();
"use strict";

Primrose.Text.OperatingSystems.OSX = function () {
  "use strict";

  return new Primrose.Text.OperatingSystem("OS X", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");
}();
"use strict";

////
// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
///
Primrose.Text.OperatingSystems.Windows = function () {
  "use strict";

  return new Primrose.Text.OperatingSystem("Windows", "CTRL", "CTRL", "CTRL_y", "", "HOME", "END", "CTRL", "HOME", "END");
}();
"use strict";

Primrose.Text.Themes.Dark = function () {
  "use strict";

  return {
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
}();
"use strict";

Primrose.Text.Themes.Default = function () {
  "use strict";

  return {
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
}();
Primrose.VERSION = "v0.23.4";
console.info("Using Primrose v0.23.4. Find out more at http://www.primrosevr.com");