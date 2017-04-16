import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;


function calcFoV(aFoV, aDim, bDim){
  return RAD2DEG * Math.atan(Math.tan(DEG2RAD * aFoV) * aDim / bDim);
}


export default function getMonoscopiceEyeParametersMixin (side) {
    if (side === "left") {
      const curLayer = this.getLayers()[0],
        elem = curLayer && curLayer.source || document.body,
        width = elem.clientWidth,
        height = elem.clientHeight;

      let vFOV, hFOV;
      if(height > width) {
        vFOV = defaultFieldOfView / 2,
        hFOV = calcFoV(vFOV, width, height);
      }
      else {
        hFOV = defaultFieldOfView / 2,
        vFOV = calcFoV(hFOV, height, width);
      }

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
};
