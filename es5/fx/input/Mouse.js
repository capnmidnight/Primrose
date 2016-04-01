"use strict";

/* global Primrose, THREE, isChrome, pliny */

Primrose.Input.Mouse = function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Mouse",
    description: "| [under construction]"
  });
  function MouseInput(name, DOMElement, commands, socket) {
    DOMElement = DOMElement || window;
    Primrose.Input.ButtonAndAxis.call(this, name, commands, socket, MouseInput.AXES);
    this.setLocation = function (x, y) {
      this.X = x;
      this.Y = y;
    };

    this.setMovement = function (dx, dy) {
      this.X += dx;
      this.Y += dy;
    };

    this.readEvent = function (event) {
      this.BUTTONS = event.buttons << 10;
      if (MouseInput.isPointerLocked()) {
        var mx = event.movementX,
            my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setMovement(mx, my);
      } else {
        this.setLocation(event.layerX, event.layerY);
      }
    };

    DOMElement.addEventListener("mousedown", function (event) {
      this.setButton(event.button, true);
      this.BUTTONS = event.buttons << 10;
    }.bind(this), false);

    DOMElement.addEventListener("mouseup", function (event) {
      this.setButton(event.button, false);
      this.BUTTONS = event.buttons << 10;
    }.bind(this), false);

    DOMElement.addEventListener("mousemove", this.readEvent.bind(this), false);

    DOMElement.addEventListener("wheel", function (event) {
      if (isChrome) {
        this.W += event.deltaX;
        this.Z += event.deltaY;
      } else if (event.shiftKey) {
        this.W += event.deltaY;
      } else {
        this.Z += event.deltaY;
      }
      event.preventDefault();
    }.bind(this), false);

    this.addEventListener = function (event, handler, bubbles) {
      if (event === "pointerlockchange") {
        if (document.exitPointerLock) {
          document.addEventListener('pointerlockchange', handler, bubbles);
        } else if (document.mozExitPointerLock) {
          document.addEventListener('mozpointerlockchange', handler, bubbles);
        } else if (document.webkitExitPointerLock) {
          document.addEventListener('webkitpointerlockchange', handler, bubbles);
        }
      }
    };

    this.removeEventListener = function (event, handler, bubbles) {
      if (event === "pointerlockchange") {
        if (document.exitPointerLock) {
          document.removeEventListener('pointerlockchange', handler, bubbles);
        } else if (document.mozExitPointerLock) {
          document.removeEventListener('mozpointerlockchange', handler, bubbles);
        } else if (document.webkitExitPointerLock) {
          document.removeEventListener('webkitpointerlockchange', handler, bubbles);
        }
      }
    };

    DOMElement.requestPointerLock = DOMElement.requestPointerLock || DOMElement.webkitRequestPointerLock || DOMElement.mozRequestPointerLock || function () {};

    this.requestPointerLock = function () {
      if (!MouseInput.isPointerLocked()) {
        DOMElement.requestPointerLock();
      }
    };

    this.exitPointerLock = (document.webkitExitPointerLock || document.mozExitPointerLock || document.exitPointerLock || function () {}).bind(document);

    this.togglePointerLock = function () {
      if (MouseInput.isPointerLocked()) {
        this.exitPointerLock();
      } else {
        this.requestPointerLock();
      }
    };
  }

  var elementName = findProperty(document, ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"]),
      changeEventName = findProperty(document, ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"]),
      errorEventName = findProperty(document, ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"]),
      requestMethodName = findProperty(document.documentElement, ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"]),
      exitMethodName = findProperty(document, ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);

  MouseInput.Lock = {
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
    getElement: function getElement() {
      return document[elementName];
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
          MouseInput.Lock.removeChangeListener(onPointerLock);
          MouseInput.Lock.removeErrorListener(onPointerLockError);
        };

        onPointerLock = function onPointerLock() {
          setTimeout(tearDown);
          resolve(MouseInput.Lock.getElement());
        };

        onPointerLockError = function onPointerLockError(evt) {
          setTimeout(tearDown);
          reject(evt);
        };

        MouseInput.Lock.addChangeListener(onPointerLock, false);
        MouseInput.Lock.addErrorListener(onPointerLockError, false);

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
      return MouseInput.Lock.withChange(function () {
        if (!requestMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        } else if (MouseInput.Lock.getElement()) {
          return true;
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: function exit() {
      return MouseInput.Lock.withChange(function () {
        if (!exitMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        } else if (!MouseInput.Lock.getElement()) {
          return true;
        } else {
          document[exitMethodName]();
        }
      });
    }
  };

  MouseInput.isPointerLocked = function () {
    return !!MouseInput.Lock.getElement();
  };

  MouseInput.AXES = ["X", "Y", "Z", "W", "BUTTONS"];
  Primrose.Input.ButtonAndAxis.inherit(MouseInput);

  return MouseInput;
}();

pliny.issue({
  parent: "Primrose.Input.Mouse",
  name: "document Mouse",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Mouse](#Primrose_Input_Mouse) class in the input/ directory"
});
