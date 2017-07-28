import pliny from "pliny";

import { Vector3, Matrix4 } from "three";

export default class ViewCameraTransform {
  static makeTransform(eye, near, far) {
    return {
      translation: new Vector3().fromArray(eye.offset),
      projection: ViewCameraTransform.fieldOfViewToProjectionMatrix(eye.fieldOfView, near, far),
      viewport: {
        left: 0,
        top: 0,
        width: eye.renderWidth,
        height: eye.renderHeight
      }
    };
  }

  static fieldOfViewToProjectionMatrix(fov, zNear, zFar) {
    var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0),
      downTan = Math.tan(fov.downDegrees * Math.PI / 180.0),
      leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0),
      rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0),
      xScale = 2.0 / (leftTan + rightTan),
      yScale = 2.0 / (upTan + downTan),
      matrix = new Matrix4();

    matrix.elements[0] = xScale;
    matrix.elements[1] = 0.0;
    matrix.elements[2] = 0.0;
    matrix.elements[3] = 0.0;
    matrix.elements[4] = 0.0;
    matrix.elements[5] = yScale;
    matrix.elements[6] = 0.0;
    matrix.elements[7] = 0.0;
    matrix.elements[8] = -((leftTan - rightTan) * xScale * 0.5);
    matrix.elements[9] = ((upTan - downTan) * yScale * 0.5);
    matrix.elements[10] = -(zNear + zFar) / (zFar - zNear);
    matrix.elements[11] = -1.0;
    matrix.elements[12] = 0.0;
    matrix.elements[13] = 0.0;
    matrix.elements[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
    matrix.elements[15] = 0.0;

    return matrix;
  }

  constructor(display) {
    this.display = display;
  }

  getTransforms(near, far) {
    const l = this.display.getEyeParameters("left"),
      r = this.display.getEyeParameters("right"),
      params = [ViewCameraTransform.makeTransform(l, near, far)];
    if (r) {
      params.push(ViewCameraTransform.makeTransform(r, near, far));
    }
    for (let i = 1; i < params.length; ++i) {
      params[i].viewport.left = params[i - 1].viewport.left + params[i - 1].viewport.width;
    }
    return params;
  }
}
