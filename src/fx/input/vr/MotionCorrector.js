Primrose.Input.VR.MotionCorrector = (function () {

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
      correct = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)),
      zero = new THREE.Quaternion(),
      first = true,
      listeners = [];

    function waitForOrientation(event) {
      if (event.alpha) {
        window.removeEventListener("deviceorientation", waitForOrientation);
        checkOrientation(event);
        window.addEventListener("deviceorientation", checkOrientation, false);
      }
    }

    function checkOrientation(event) {
      e.set(
        event.beta * Math.PI / 180,
        event.alpha * Math.PI / 180,
        -event.gamma * Math.PI / 180, 'YXZ');
      o.setFromEuler(e);
      q.copy(zero)
        .multiply(o)
        .multiply(correct);
      for (var i = 0; i < listeners.length; ++i) {
        listeners[i](q);
      }
    };
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
        throw new Error(
          "The only event type that is supported is \"deviceorientation\". Type parameter was: " +
          type);
      }
      if (typeof (callback) !== "function") {
        throw new Error(
          "A function must be provided as a callback parameter. Callback parameter was: " +
          callback);
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
})();