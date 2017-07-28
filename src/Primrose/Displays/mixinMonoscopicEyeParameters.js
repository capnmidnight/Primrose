import pliny from "pliny";

import calculateElementSize from "./calculateElementSize";

import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;


let defaultFieldOfView = 100;

function getDefaultFieldOfView() {
  return defaultFieldOfView;
}

function setDefaultFieldOfView(v) {
  defaultFieldOfView = v;
}

function calcFoV(aFoV, aDim, bDim){
  return RAD2DEG * Math.atan(Math.tan(DEG2RAD * aFoV) * aDim / bDim);
}

function getMonoscopicEyeParameters (side) {
  if (side === "left") {
    const dim = calculateElementSize(this);

    let vFOV, hFOV;
    if(dim.height > dim.width) {
      vFOV = defaultFieldOfView / 2,
      hFOV = calcFoV(vFOV, dim.width, dim.height);
    }
    else {
      hFOV = defaultFieldOfView / 2,
      vFOV = calcFoV(hFOV, dim.height, dim.width);
    }

    return {
      fieldOfView: {
        upDegrees: vFOV,
        downDegrees: vFOV,
        leftDegrees: hFOV,
        rightDegrees: hFOV
      },
      offset: new Float32Array([0, 0, 0]),
      renderWidth: dim.width,
      renderHeight: dim.height
    };
  }
}

export default function mixinMonoscopicEyeParameters(classFunction) {

  Object.defineProperty(classFunction, "DEFAULT_FOV", {
    get: getDefaultFieldOfView,
    set: setDefaultFieldOfView
  });

  classFunction.prototype.getEyeParameters = getMonoscopicEyeParameters;
};
