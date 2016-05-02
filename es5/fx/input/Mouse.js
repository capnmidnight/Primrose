"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Input.Mouse = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Mouse",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });

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