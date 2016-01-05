/* global Primrose, THREE, isWebKit, isiOS, devicePixelRatio */

Primrose.Input.Motion = ( function ( ) {
  /*
   Class: MotionCorrector
   
   The MotionCorrector class observes orientation and gravitational acceleration values
   and determines a corrected set of orientation values that reset the orientation
   origin to 0 degrees north, 0 degrees above the horizon, with 0 degrees of tilt
   in the landscape orientation. This is useful for head-mounted displays (HMD).
   
   Constructor: new MotionCorrector( );
   
   Properties:
   degrees: get/set the current value of the angle in degrees.
   radians: get/set the current value of the angle in radians.
   
   */
  function MotionCorrector ( ) {
    var acceleration,
        orientation,
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
        dAccel = {x: 0, y: 0, z: 0},
    dOrient = {alpha: 0, beta: 0, gamma: 0};
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

    function calculate ( ) {
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

        isAboveHorizon = isWebKit ?
            ( isPrimary ?
                orientation.gamma > 0 :
                orientation.gamma < 0 ) :
            osz === 1;
        deltaAlpha = ( isWebKit && ( isAboveHorizon ^ !isPrimary ) || !isWebKit && isPrimary ) ? 270 : 90;
        if ( isPrimary ) {
          if ( isAboveHorizon ) {
            if ( isiOS ) {
              deltaGamma = 90;
            }
            else {
              deltaGamma = -90;
            }
            signGamma = 1;
            signBeta = -1;
            deltaBeta = 0;
          }
          else {
            if ( isWebKit ) {
              signGamma = 1;
            }
            else {
              signGamma = -1;
            }
            if ( isiOS ) {
              deltaGamma = -90;
            }
            else {
              deltaGamma = 90;
            }
            signBeta = 1;
            deltaBeta = 180;
          }
        }
        else {
          if ( isAboveHorizon ) {
            if ( isiOS ) {
              deltaGamma = 90;
            }
            else {
              deltaGamma = -90;
            }
            signGamma = -1;
            signBeta = 1;
            deltaBeta = 0;
          }
          else {
            if ( isWebKit ) {
              signGamma = -1;
            }
            else {
              signGamma = 1;
            }
            if ( isiOS ) {
              deltaGamma = -90;
            }
            else {
              deltaGamma = 90;
            }
            signBeta = -1;
            deltaBeta = 180;
          }
        }

        heading = wrap( signAlpha * orientation.alpha + deltaAlpha - dOrient.alpha );
        pitch = wrap( signGamma * orientation.gamma + deltaGamma - dOrient.gamma ) - 360;
        if ( pitch < -180 ) {
          pitch += 360;
        }
        roll = wrap( signBeta * orientation.beta + deltaBeta - dOrient.beta );
        if ( roll > 180 ) {
          roll -= 360;
        }
      }
    }

    Object.defineProperties( this, {
      acceleration: {
        set: function ( v ) {
          acceleration = v;
          calculate( );
        },
        get: function ( ) {
          return acceleration;
        }
      },
      orientation: {
        set: function ( v ) {
          orientation = v;
          calculate( );
        },
        get: function ( ) {
          return orientation;
        }
      },
      heading: {
        get: function ( ) {
          return heading;
        }
      },
      pitch: {
        get: function ( ) {
          return pitch;
        }
      },
      roll: {
        get: function ( ) {
          return roll;
        }
      }
    } );

    this.zeroAxes = function ( ) {
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
      var heading = new Primrose.Angle( 0 ),
          pitch = new Primrose.Angle( 0 ),
          roll = new Primrose.Angle( 0 );
      this.onChange = function ( ) {
        var a = this.acceleration;
        if ( this.orientation && a ) {
          heading.degrees = -this.heading;
          pitch.degrees = this.pitch;
          roll.degrees = this.roll;
          callback( {
            HEADING: heading.radians,
            PITCH: pitch.radians,
            ROLL: roll.radians,
            headAX: a.y - dAccel.y,
            headAY: a.x - dAccel.x,
            headAZ: a.z - dAccel.z
          } );
        }
      };
      this.checkOrientation = function ( event ) {
        this.orientation = event.alpha !== null && event;
        this.onChange( );
      };
      this.checkMotion = function ( event ) {
        if ( event && event.accelerationIncludingGravity &&
            event.accelerationIncludingGravity.x !== null ) {
          this.acceleration = event.accelerationIncludingGravity;
          this.onChange( );
        }
        else if ( event && event.acceleration && event.acceleration.x !== null ) {
          this.acceleration = event.acceleration;
          this.onChange( );
        }

      };
      this.acceleration = MotionCorrector.ZERO_VECTOR;
      this.orientation = MotionCorrector.ZERO_EULER;
      window.addEventListener( "deviceorientation", this.checkOrientation.bind( this ), bubbles );
      window.addEventListener( "devicemotion", this.checkMotion.bind( this ), bubbles );
    };
  }


// A few default values to let the code
// run in a static view on a sensorless device.
  MotionCorrector.ZERO_VECTOR = {x: -9.80665, y: 0, z: 0};
  MotionCorrector.ZERO_EULER = {gamma: 90, alpha: 270, beta: 0};

  function makeTransform ( s, eye ) {
    var w = Math.floor( window.innerWidth * devicePixelRatio / 2 ),
        h = window.innerHeight * devicePixelRatio,
        i = ( eye + 1 ) / 2;

    s.transform = new THREE.Matrix4().makeTranslation( eye * 0.034, 0, 0 );
    s.viewport = {
      x: i * w,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: ( i + 1 ) * w,
      bottom: h,
      left: i * w};
    s.fov = 75;
  }

  function MotionInput ( name, commands, socket ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, MotionInput.AXES );
    var corrector = new MotionCorrector( ),
        a = new THREE.Quaternion( ),
        b = new THREE.Quaternion( ),
        RIGHT = new THREE.Vector3( 1, 0, 0 ),
        UP = new THREE.Vector3( 0, 1, 0 ),
        FORWARD = new THREE.Vector3( 0, 0, -1 );
    corrector.addEventListener( "deviceorientation", function ( evt ) {
      for ( var i = 0; i < MotionInput.AXES.length; ++i ) {
        var k = MotionInput.AXES[i];
        this.setAxis( k, evt[k] );
      }
      a.set( 0, 0, 0, 1 )
          .multiply( b.setFromAxisAngle( UP, evt.HEADING ) )
          .multiply( b.setFromAxisAngle( RIGHT, evt.PITCH ) )
          .multiply( b.setFromAxisAngle( FORWARD, evt.ROLL ) );
      this.headRX = a.x;
      this.headRY = a.y;
      this.headRZ = a.z;
      this.headRW = a.w;
    }.bind( this ) );
    this.zeroAxes = corrector.zeroAxes.bind( corrector );
    this.transforms = [ {}, {} ];
    makeTransform( this.transforms[0], -1 );
    makeTransform( this.transforms[1], 1 );
  }

  MotionInput.AXES = [
    "HEADING", "PITCH", "ROLL",
    "D_HEADING", "D_PITCH", "D_ROLL",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW" ];
  Primrose.Input.ButtonAndAxis.inherit( MotionInput );

  MotionInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion();
    value.set( this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ),
        this.getValue( w ) );
    return value;
  };
  return MotionInput;
} )( );
