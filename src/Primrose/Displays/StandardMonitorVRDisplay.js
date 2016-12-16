import { lock, unlock } from "./Orientation";
import PointerLock from "./PointerLock";
import FullScreen from "./FullScreen";
import immutable from "./immutable";
import mutable from "./mutable";
import isMobile from "./isMobile";

const Orientation = { lock, unlock };
let defaultFieldOfView = 50;

function warn(msg){
  return function(exp){
    console.warn(msg, exp);
  };
}

function defaultPose() {
  return {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1],
    linearVelocity: null,
    linearAcceleration: null,
    angularVelocity: null,
    angularAcceleration: null
  };
}

function fireDisplayPresentChange (evt) {
  if (!FullScreen.isActive) {
    FullScreen.removeChangeListener(fireDisplayPresentChange);
  }
  window.dispatchEvent(new Event("vrdisplaypresentchange"));
}

export default class WebVRStandardMonitor {

  static get DEFAULT_FOV () {
    return defaultFieldOfView;
  }

  static set DEFAULT_FOV (v) {
    defaultFieldOfView = v;
  }

  static standardFullScreenBehavior(elem) {
    return FullScreen.request(elem)
      .catch(warn("FullScreen failed"))
      .then(WebVRStandardMonitor.standardLockBehavior);
  }

  static standardLockBehavior(elem) {
    if (isMobile) {
      return Orientation.lock(elem)
        .catch(warn("OrientationLock failed"));
    }
    else{
      return PointerLock.request(elem)
        .catch(warn("PointerLock failed"));
    }
  }

  static standardExitFullScreenBehavior() {
    return WebVRStandardMonitor.standardUnlockBehavior()
      .then(() => FullScreen.exit())
      .catch(warn("FullScreen failed"));
  }

  static standardUnlockBehavior() {
    if (isMobile) {
      Orientation.unlock();
      return Promise.resolve();
    }
    else{
      return PointerLock.exit()
        .catch(warn("PointerLock exit failed"));
    }
  }

  constructor(display) {
    if(this !== window && this !== undefined) {
      this._currentLayers = [];
      this._display = display;

      Object.defineProperties(this, {
        capabilities: immutable(Object.defineProperties({}, {
          hasPosition: immutable(false),
          hasOrientation: immutable(isMobile),
          hasExternalDisplay: immutable(false),
          canPresent: immutable(true),
          maxLayers: immutable(1)
        })),
        isPolyfilled: immutable(display && display.isPolyfilled || false),
        displayId: immutable(0),
        displayName: immutable(isMobile && "Magic Window" || "Standard Monitor"),
        isConnected: immutable(true),
        stageParameters: immutable(null),
        isPresenting: immutable(function () {
          return FullScreen.isActive;
        }),

        depthNear: mutable(0.01, "number"),
        depthFar: mutable(10000.0, "number")
      });
    }
  }


  requestAnimationFrame(thunk) {
    return window.requestAnimationFrame(thunk);
  }

  cancelAnimationFrame(handle) {
    window.cancelAnimationFrame(handle);
  }

  submitFrame() {}

  getPose(){
    var display = isMobile && this._display;
    if(display){
      return display.getPose();
    }
    else{
      return defaultPose();
    }
  }

  getImmediatePose() {
    var display = isMobile && this._display;
    if(display){
      return display.getImmediatePose();
    }
    else{
      return defaultPose();
    }
  }

  resetPose(){
    var display = isMobile && this._display;
    if(display){
      return display.resetPose();
    }
  }

  requestPresent(layers) {
    for (var i = 0; i < this.capabilities.maxLayers && i < layers.length; ++i) {
      this._currentLayers[i] = layers[i];
    }
    const elem = layers[0].source;
    if(isMobile){
      return this._display.requestPresent(layers)
        .then(() => WebVRStandardMonitor.standardLockBehavior(elem));
    }
    else{
      FullScreen.addChangeListener(fireDisplayPresentChange);
      return WebVRStandardMonitor.standardFullScreenBehavior(elem);
    }
  }

  getLayers() {
    return this._currentLayers.slice();
  }

  exitPresent () {
    this._currentLayers.splice(0);

    if(isMobile){
      return  WebVRStandardMonitor.standardUnlockBehavior()
        .then(() => this._display.exitPresent());
    }
    else{
      return WebVRStandardMonitor.standardExitFullScreenBehavior();
    }
  }

  getEyeParameters (side) {
    if (side === "left") {
      var curLayer = this.getLayers()[0],
        elem = curLayer && curLayer.source || document.body,
        width = elem.clientWidth,
        height = elem.clientHeight,
        vFOV = defaultFieldOfView / 2,
        hFOV = calcFoV(vFOV, width, height);
      return {
        renderWidth: width * devicePixelRatio,
        renderHeight: height * devicePixelRatio,
        offset: new Float32Array([0, 0, 0]),
        fieldOfView: {
          upDegrees: vFOV,
          downDegrees: vFOV,
          leftDegrees: hFOV,
          rightDegrees: hFOV
        }
      };
    }
  }
}

function calcFoV(aFoV, aDim, bDim){
  return 360 * Math.atan(Math.tan(aFoV * Math.PI / 360) * aDim / bDim) / Math.PI;
}

WebVRStandardMonitor._shimSetup = false;
