/*
pliny.class({
  parent: "Util",
    name: "Angle",
    description: "The Angle class smooths out the jump from 360 to 0 degrees. It\n\
keeps track of the previous state of angle values and keeps the change between\n\
angle values to a maximum magnitude of 180 degrees, plus or minus. This allows for\n\
smoother operation as rotating past 360 degrees will not reset to 0, but continue\n\
to 361 degrees and beyond, while rotating behind 0 degrees will not reset to 360\n\
but continue to -1 and below.\n\
\n\
When instantiating, choose a value that is as close as you can guess will be your\n\
initial sensor readings.\n\
\n\
This is particularly important for the 180 degrees, +- 10 degrees or so. If you\n\
expect values to run back and forth over 180 degrees, then initialAngleInDegrees\n\
should be set to 180. Otherwise, if your initial value is anything slightly larger\n\
than 180, the correction will rotate the angle into negative degrees, e.g.:\n\
* initialAngleInDegrees = 0\n\
* first reading = 185\n\
* updated degrees value = -175\n\
\n\
It also automatically performs degree-to-radian and radian-to-degree conversions.\n\
For more information, see [Radian - Wikipedia, the free encyclopedia](https://en.wikipedia.org/wiki/Radian).\n\
\n\
![Radians](https://upload.wikimedia.org/wikipedia/commons/4/4e/Circle_radians.gif)",
    parameters: [{
      name: "initialAngleInDegrees",
      type: "Number",
      description: "(Required) Specifies the initial context of the angle. Zero is not always the correct value."
    }],
    examples: [{
      name: "Basic usage",
      description: "To use the Angle class, create an instance of it with `new`, and modify the `degrees` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Angle(356);\n\
  a.degrees += 5;\n\
  console.log(a.degrees);\n\
\n\
## Results:\n\
> 361"
    }, {
      name: "Convert degrees to radians",
      description: "Create an instance of Angle, modify the `degrees` property, and read the `radians` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Angle(10);\n\
  a.degrees += 355;\n\
  console.log(a.radians);\n\
\n\
## Results:\n\
> 0.08726646259971647"
    }, {
      name: "Convert radians to degress",
      description: "Create an instance of Angle, modify the `radians` property, and read the `degrees` property.\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  var a = new Angle(0);\n\
  a.radians += Math.PI / 2;\n\
  console.log(a.degrees);\n\
\n\
## Results:\n\
> 90"
    }]
});
*/

import { Math as _Math } from "three";

const { DEG2RAD, RAD2DEG } = _Math;

export default class Angle {
  constructor (v) {
    if (typeof (v) !== "number") {
      throw new Error("Angle must be initialized with a number. Initial value was: " + v);
    }

    this._value = v;
    this._delta = 0;
    this._d1 = null;
    this._d2 = null;
    this._d3 = null;
  }

  get degrees() {
    return this._value;
  }

  set degrees(newValue) {

    /*
    pliny.property({
      parent: "Util.Angle",
      name: "degrees",
      type: "Number",
      description: "Get/set the current value of the angle in degrees."
    });
    */

    do {
      // figure out if it is adding the raw value, or whole
      // rotations of the value, that results in a smaller
      // magnitude of change.
      this._d1 = newValue + this._delta - this._value;
      this._d2 = Math.abs(this._d1 + 360);
      this._d3 = Math.abs(this._d1 - 360);
      this._d1 = Math.abs(this._d1);
      if (this._d2 < this._d1 && this._d2 < this._d3) {
        this._delta += 360;
      }
      else if (this._d3 < this._d1) {
        this._delta -= 360;
      }
    } while (this._d1 > this._d2 || this._d1 > this._d3);
    this._value = newValue + this._delta;
  }

  get radians() {
    return this.degrees * DEG2RAD;
  }

  set radians(val) {

    /*
    pliny.property({
      parent: "Util.Angle",
      name: "radians",
      type: "Number",
      description: "Get/set the current value of the angle in radians."
    });
    */

    this.degrees = val * RAD2DEG;
  }
};

