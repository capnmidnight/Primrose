/* global Primrose */

Primrose.Input.Motion = ( function () {
  /*
   Class: Angle

   The Angle class smooths out the jump from 360 to 0 degrees. It keeps track
   of the previous state of angle values and keeps the change between angle values
   to a maximum magnitude of 180 degrees, plus or minus. This allows for smoother
   opperation as rotating past 360 degrees will not reset to 0, but continue to 361
   degrees and beyond, while rotating behind 0 degrees will not reset to 360 but continue
   to -1 and below.

   It also automatically performs degree-to-radian and radian-to-degree conversions.

   Constructor: new Angle(initialAngleInDegrees);

   The initialAngleInDegrees value must be supplied. It specifies the initial context
   of the angle. Zero is not always the correct value. Choose a values that is as close
   as you can guess will be your initial sensor readings.

   This is particularly important for the 180 degrees, +- 10 degrees or so. If you expect
   values to run back and forth over 180 degrees, then initialAngleInDegrees should be
   set to 180. Otherwise, if your initial value is anything slightly larger than 180,
   the correction will rotate the angle into negative degrees, e.g.:
   initialAngleInDegrees = 0
   first reading = 185
   updated degrees value = -175

   Properties:
   degrees: get/set the current value of the angle in degrees.
   radians: get/set the current value of the angle in radians.

   */
  function Angle ( v ) {
    if ( typeof ( v ) !== "number" ) {
      throw new Error(
          "Angle must be initialized with a number. Initial value was: " + v );
    }

    var value = v,
        delta = 0,
        d1,
        d2,
        d3,
        DEG2RAD = Math.PI / 180,
        RAD2DEG = 180 / Math.PI;

    this.setDegrees = function ( newValue ) {
      do {
        // figure out if it is adding the raw value, or whole
        // rotations of the value, that results in a smaller
        // magnitude of change.
        d1 = newValue + delta - value;
        d2 = Math.abs( d1 + 360 );
        d3 = Math.abs( d1 - 360 );
        d1 = Math.abs( d1 );
        if ( d2 < d1 && d2 < d3 ) {
          delta += 360;
        }
        else if ( d3 < d1 ) {
          delta -= 360;
        }
      } while ( d1 > d2 || d1 > d3 );
      value = newValue + delta;
    };

    this.getDegrees = function () {
      return value;
    };
    this.getRadians = function () {
      return this.getDegrees() * DEG2RAD;
    };
    this.setRadians = function ( val ) {
      this.setDegrees( val * RAD2DEG );
    };
  }

  /*
   Class: MotionCorrector

   The MotionCorrector class observes orientation and gravitational acceleration values
   and determines a corrected set of orientation values that reset the orientation
   origin to 0 degrees north, 0 degrees above the horizon, with 0 degrees of tilt
   in the landscape orientation. This is useful for head-mounted displays (HMD).

   Constructor: new MotionCorrector([browserIsGoogleChrome]);

   Properties:
   degrees: get/set the current value of the angle in degrees.
   radians: get/set the current value of the angle in radians.

   */
  function MotionCorrector ( isChrome ) {
    var acceleration,
        orientation,
        rotation,
        deltaAlpha,
        signAlpha,
        heading,
        deltaGamma,
        signGamma,
        pitch,
        deltaBeta,
        signBeta,
        roll,
        omx,
        omy,
        omz,
        osx,
        osy,
        osz,
        isPrimary,
        isAboveHorizon,
        dAccel = { x: 0, y: 0, z: 0 },
    dOrient = { alpha: 0, beta: 0, gamma: 0 };

    signAlpha = -1;

    function wrap ( v ) {
      while ( v < 0 ) {
        v += 360;
      }
      while ( v >= 360 ) {
        v -= 360;
      }
      return v;
    }

    function calculate () {
      if ( acceleration && orientation ) {
        omx = Math.abs( acceleration.x );
        omy = Math.abs( acceleration.y );
        omz = Math.abs( acceleration.z );

        osx = ( omx > 0 ) ? acceleration.x / omx : 1;
        osy = ( omy > 0 ) ? acceleration.y / omy : 1;
        osz = ( omz > 0 ) ? acceleration.z / omz : 1;

        if ( omx > omy && omx > omz && omx > 4.5 ) {
          isPrimary = osx === -1;
        }
        else if ( omy > omz && omy > omx && omy > 4.5 ) {
          isPrimary = osy === 1;
        }

        isAboveHorizon = isChrome ? ( isPrimary ? orientation.gamma > 0
            : orientation.gamma < 0 ) : osz === 1;
        deltaAlpha = ( isChrome && ( isAboveHorizon ^ !isPrimary ) ||
            !isChrome && isPrimary ) ? 270 : 90;
        if ( isPrimary ) {
          if ( isAboveHorizon ) {
            signGamma = 1;
            deltaGamma = -90;
            signBeta = -1;
            deltaBeta = 0;
          }
          else {
            if ( isChrome ) {
              signGamma = 1;
              deltaGamma = 90;
            }
            else {
              signGamma = -1;
              deltaGamma = 90;
            }
            signBeta = 1;
            deltaBeta = 180;
          }
        }
        else {
          if ( isAboveHorizon ) {
            signGamma = -1;
            deltaGamma = -90;
            signBeta = 1;
            deltaBeta = 0;
          }
          else {
            if ( isChrome ) {
              signGamma = -1;
              deltaGamma = 90;
            }
            else {
              signGamma = 1;
              deltaGamma = 90;
            }
            signBeta = -1;
            deltaBeta = 180;
          }
        }

        heading = wrap( signAlpha * orientation.alpha + deltaAlpha -
            dOrient.alpha );
        pitch = wrap( signGamma * orientation.gamma + deltaGamma -
            dOrient.gamma ) - 360;
        if ( pitch < -180 ) {
          pitch += 360;
        }
        roll = wrap( signBeta * orientation.beta + deltaBeta - dOrient.beta );
        if ( roll > 180 ) {
          roll -= 360;
        }
      }
    }

    this.setAcceleration = function ( v ) {
      acceleration = v;
      calculate();
    };

    this.setOrientation = function ( v ) {
      orientation = v;
      calculate();
    };

    this.setRotation = function ( v ) {
      rotation = v;
    };

    this.getRotation = function () {
      return rotation;
    };
    this.getAcceleration = function () {
      return acceleration;
    };
    this.getOrientation = function () {
      return orientation;
    };
    this.getHeading = function () {
      return heading;
    };
    this.getPitch = function () {
      return pitch;
    };
    this.getRoll = function () {
      return roll;
    };

    this.zeroAxes = function () {
      if ( acceleration ) {
        dAccel.x = acceleration.x;
        dAccel.y = acceleration.y;
        dAccel.z = acceleration.z;
      }
      if ( orientation ) {
        dOrient.alpha = orientation.alpha;
        dOrient.beta = orientation.beta;
        dOrient.gamma = orientation.gamma;
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
    this.addEventListener = function ( type, callback, bubbles ) {
      if ( type !== "deviceorientation" ) {
        throw new Error(
            "The only event type that is supported is \"deviceorientation\". Type parameter was: " +
            type );
      }
      if ( typeof ( callback ) !== "function" ) {
        throw new Error(
            "A function must be provided as a callback parameter. Callback parameter was: " +
            callback );
      }
      var heading = new Angle( 0 ),
          pitch = new Angle( 0 ),
          roll = new Angle( 0 ),
          dHeading = new Angle( 0 ),
          dPitch = new Angle( 0 ),
          dRoll = new Angle( 0 ),
          o,
          a;

      this.onChange = function () {
        o = this.getOrientation();
        a = this.getAcceleration();
        r = this.getRotation();
        if ( o && a && r ) {
          heading.setDegrees( this.getHeading() );
          pitch.setDegrees( this.getPitch() );
          roll.setDegrees( this.getRoll() );
          dHeading.setDegrees( r.alpha );
          dPitch.setDegrees( r.beta );
          dRoll.setDegrees( r.gamma );
          callback( {
            HEADING: heading.getRadians(),
            PITCH: pitch.getRadians(),
            ROLL: roll.getRadians(),
            D_HEADING: dHeading.getRadians(),
            D_PITCH: dPitch.getRadians(),
            D_ROLL: dRoll.getRadians(),
            ACCELX: a.x - dAccel.x,
            ACCELY: a.y - dAccel.y,
            ACCELZ: a.z - dAccel.z
          } );
        }
      };

      this.checkOrientation = function ( event ) {
        this.setOrientation( event.alpha !== null && event );
        this.onChange();
      };

      this.checkMotion = function ( event ) {
        if ( event && event.accelerationIncludingGravity &&
            event.accelerationIncludingGravity.x ) {
          this.setAcceleration( event.accelerationIncludingGravity );
        }
        else if ( event && event.acceleration && event.acceleration.x ) {
          this.setAcceleration( event.acceleration );
        }

        if ( event.rotationRate ) {
          this.setRotation( event.rotationRate );
        }

        this.onChange();
      };

      this.setAcceleration( MotionCorrector.ZERO_VECTOR );
      this.setOrientation( MotionCorrector.ZERO_EULER );

      window.addEventListener( "deviceorientation", this.checkOrientation.bind(
          this ), bubbles );
      window.addEventListener( "devicemotion", this.checkMotion.bind( this ),
          bubbles );
    };
  }


// A few default values to let the code
// run in a static view on a sensorless device.
  MotionCorrector.ZERO_VECTOR = { x: -9.80665, y: 0, z: 0 };
  MotionCorrector.ZERO_EULER = { gamma: 90, alpha: 270, beta: 0 };

// Set this value to "true" if you are using Google Chrome.
// Set it to "false" if you are using Firefox.
// Behavior of other browsers hasn't been tested.
  MotionCorrector.BROWSER_IS_GOOGLE_CHROME = !!window.chrome &&
      !window.opera && navigator.userAgent.indexOf( ' OPR/' ) < 0;

  function MotionInput ( name, commands, socket ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, MotionInput.AXES );

    var corrector = new MotionCorrector(
        MotionCorrector.BROWSER_IS_GOOGLE_CHROME );
    corrector.addEventListener( "deviceorientation", function ( evt ) {
      for ( var i = 0; i < MotionInput.AXES.length; ++i ) {
        var k = MotionInput.AXES[i];
        this.setAxis( k, evt[k] );
      }
    }.bind( this ) );

    this.zeroAxes = corrector.zeroAxes.bind( corrector );
  }

  MotionInput.AXES = [ "HEADING", "PITCH", "ROLL", "D_HEADING", "D_PITCH",
    "D_ROLL", "ACCELX", "ACCELY", "ACCELZ" ];
  Primrose.Input.ButtonAndAxis.inherit( MotionInput );

  return MotionInput;
} )();
