/* global Primrose, THREE, isChrome, pliny */

Primrose.Input.Mouse = (function () {

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
    
    DOMElement.addEventListener("mousedown", function (event) {
      this.setButton(event.button, true);
      this.BUTTONS = event.buttons << 10;
      this.update();
    }.bind(this), false);

    DOMElement.addEventListener("mouseup", function (event) {
      this.setButton(event.button, false);
      this.BUTTONS = event.buttons << 10;
      this.update();
    }.bind(this), false);

    DOMElement.addEventListener("mousemove", function (event) {
      this.BUTTONS = event.buttons << 10;
      if (MouseInput.Lock.isActive) {
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
      this.update();
    }.bind(this), false);

    DOMElement.addEventListener("wheel", function (event) {
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
      this.update();
    }.bind(this), false);
  }



  var elementName = findProperty(document, ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"]),
    changeEventName = findProperty(document, ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"]),
    errorEventName = findProperty(document, ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"]),
    requestMethodName = findProperty(document.documentElement, ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"]),
    exitMethodName = findProperty(document, ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);

  changeEventName = changeEventName && changeEventName.substring(2);
  errorEventName = errorEventName && errorEventName.substring(2);
  
  MouseInput.Lock = {
    addChangeListener: (thunk, bubbles) => document.addEventListener(changeEventName, thunk, bubbles),
    removeChangeListener: (thunk) => document.removeEventListener(changeEventName, thunk),
    addErrorListener: (thunk, bubbles) => document.addEventListener(errorEventName, thunk, bubbles),
    removeErrorListener: (thunk) => document.removeEventListener(errorEventName, thunk),
    withChange: (act) => {
      return new Promise((resolve, reject) => {
        var onPointerLock,
          onPointerLockError,
          timeout,
          tearDown = () => {
            if (timeout) {
              clearTimeout(timeout);
            }
            MouseInput.Lock.removeChangeListener(onPointerLock);
            MouseInput.Lock.removeErrorListener(onPointerLockError);
          };

        onPointerLock = () => {
          setTimeout(tearDown);
          resolve(MouseInput.Lock.element);
        };

        onPointerLockError = (evt) => {
          setTimeout(tearDown);
          reject(evt);
        };

        MouseInput.Lock.addChangeListener(onPointerLock, false);
        MouseInput.Lock.addErrorListener(onPointerLockError, false);

        if (act()) {
          tearDown();
          resolve();
        }
        else {      
          // Timeout wating on the pointer lock to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          timeout = setTimeout(() => {
            tearDown();
            reject("Pointer Lock state did not change in allotted time");
          }, 1000);
        }
      });
    },
    request: (elem) => {
      return MouseInput.Lock.withChange(() => {
        if (!requestMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        }
        else if (MouseInput.Lock.isActive) {
          return true;
        } else {
          elem[requestMethodName]();
        }
      });
    },
    exit: () => {
      return MouseInput.Lock.withChange(() => {
        if (!exitMethodName) {
          console.error("No Pointer Lock API support.");
          throw new Error("No Pointer Lock API support.");
        }
        else if (!MouseInput.Lock.isActive) {
          return true;
        }
        else {
          document[exitMethodName]();
        }
      });
    }
  };

  Object.defineProperties(MouseInput.Lock, {
    element: {
      get: () => document[elementName]
    },
    isActive: {
      get: () => !!MouseInput.Lock.element
    }
  });

  MouseInput.AXES = ["X", "Y", "Z", "W", "BUTTONS"];
  Primrose.Input.ButtonAndAxis.inherit(MouseInput);

  return MouseInput;
})();

