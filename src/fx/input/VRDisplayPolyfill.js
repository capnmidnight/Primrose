Primrose.Input.VRDisplayPolyfill = (function () {
  "use strict";
  class VRDisplayPolyfill {
    constructor(canPresent, hasOrientation, hasPosition, displayID, displayName) {
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

      this._onFullScreenRemoved = () => {
        FullScreen.removeChangeListener(this._onFullScreenRemoved);
        this.exitPresent();
        window.dispatchEvent(new Event("vrdisplaypresentchange"));
      };
    }

    getLayers() {
      if (this._currentLayer) {
        return [this._currentLayer];
      }
      else {
        return [];
      }
    }

    exitPresent() {
      var clear = (err) => {
        if (err) {
          console.error(err);
        }
        console.log("exit presenting");
        this.isPresenting = false;
        this._currentLayer = null;
      };
      return FullScreen.exit()
        .then(function (elem) {
          clear();
          return elem;
        })
        .catch(clear);
    }

    requestPresent(layers) {
      if (!this.capabilities.canPresent) {
        return Promrise.reject(new Error("This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName));
      }
      else if (!layers) {
        return Promise.reject(new Error("No layers provided to requestPresent"));
      }
      else if (!(layers instanceof Array)) {
        return Promise.reject(new Error("Layers parameters must be an array"));
      }
      else if (layers.length !== 1) {
        return Promise.reject(new Error("Only one layer at a time is supported right now."));
      }
      else if (!layers[0].source) {
        return Promise.reject(new Error("No source on layer parameter."));
      }
      else {
        return this._requestPresent(layers)
          .then((elem) => {
            this._currentLayer = layers[0];
            this.isPresenting = elem === this._currentLayer.source;
            FullScreen.addChangeListener(this._onFullScreenRemoved, false);
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            return elem;
          });
      }
    }

    requestAnimationFrame(thunk) {
      window.requestAnimationFrame(thunk);
    }

    cancelAnimationFrame(handle) {
      window.cancelAnimationFrame(handle);
    }

    submitFrame() {
    }
  }
  return VRDisplayPolyfill;
})();