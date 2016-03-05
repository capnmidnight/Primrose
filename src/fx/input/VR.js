/* global THREE, Primrose, HMDVRDevice, PositionSensorVRDevice, pliny, Promise */

Primrose.Input.VR = ( function () {

  function withFullScreenChange ( elem, act ) {
    return new Promise( function ( resolve, reject ) {
      var tearDown,
          onFullScreen,
          onFullScreenError;

      tearDown = function () {
        elem.removeEventListener( "fullscreenchange", onFullScreen );
        elem.removeEventListener( "webkitfullscreenchange", onFullScreen );
        elem.removeEventListener( "mozfullscreenchange", onFullScreen );
        elem.removeEventListener( "msfullscreenchange", onFullScreen );
        elem.removeEventListener( "fullscreenerror", onFullScreenError );
        elem.removeEventListener( "webkitfullscreenerror", onFullScreenError );
        elem.removeEventListener( "mozfullscreenerror", onFullScreenError );
        elem.removeEventListener( "msfullscreenerror", onFullScreenError );
      };

      onFullScreen = function () {
        tearDown();
        console.log( "got fullscreen" );
        resolve( document.webkitFullscreenElement || document.fullscreenElement );
      };

      onFullScreenError = function ( evt ) {
        tearDown();
        console.error( "no got fullscreen" );
        reject( evt );
      };

      elem.addEventListener( "fullscreenchange", onFullScreen, false );
      elem.addEventListener( "webkitfullscreenchange", onFullScreen, false );
      elem.addEventListener( "mozfullscreenchange", onFullScreen, false );
      elem.addEventListener( "msfullscreenchange", onFullScreen, false );
      elem.addEventListener( "fullscreenerror", onFullScreenError, false );
      elem.addEventListener( "webkitfullscreenerror", onFullScreenError, false );
      elem.addEventListener( "mozfullscreenerror", onFullScreenError, false );
      elem.addEventListener( "msfullscreenerror", onFullScreenError, false );

      act();
    } );
  }

  function requestFullScreen ( elem, fullScreenParam ) {
    console.log( "Entering fullscreen" );
    return new Promise( function ( resolve, reject ) {
      withFullScreenChange( elem, function () {
        if ( elem.webkitRequestFullscreen ) {
          elem.webkitRequestFullscreen( fullScreenParam || window.Element.ALLOW_KEYBOARD_INPUT );
        }
        else if ( elem.mozRequestFullScreen && fullScreenParam ) {
          elem.mozRequestFullScreen( fullScreenParam );
        }
        else if ( elem.mozRequestFullScreen && !fullScreenParam ) {
          elem.mozRequestFullScreen( );
        }
        else {
          reject();
        }
      } )
          .then( resolve )
          .catch( reject );
    } );
  }

  function exitFullScreen ( elem ) {
    console.log( "Exiting fullscreen" );
    return new Promise( function ( resolve, reject ) {
      withFullScreenChange( elem, function () {
        if ( document.exitFullscreen ) {
          document.exitFullscreen();
        }
        else if ( document.webkitExitFullscreen ) {
          document.webkitExitFullscreen();
        }
        else if ( document.webkitCancelFullScreen ) {
          document.webkitCancelFullScreen();
        }
        else if ( document.mozCancelFullScreen ) {
          document.mozCancelFullScreen();
        }
        else if ( document.msExitFullscreen ) {
          document.msExitFullscreen( );
        }
        else {
          reject();
        }
      } ).then( resolve )
          .catch( reject );
    } );
  }

  function MockVRDisplay ( device ) {
    this.capabilities = {
      canPresent: !!device.display,
      hasExternalDisplay: !!device.display && !isMobile,
      hasOrientation: !!device.sensor,
      hasPosition: !!device.sensor && !isMobile
    };

    this.displayId = device.display.hardwareUnitId;

    this.displayName = "";
    var a = device.display.deviceName,
        b = device.sensor.deviceName;
    for ( var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i ) {
      this.displayName += a[i];
    }
    while ( this.displayName.length > 0 && !/\w/.test( this.displayName[this.displayName.length - 1] ) ) {
      this.displayName = this.displayName.substring( 0, this.displayName.length - 1 );
    }

    this.isConnected = true;
    this.isPresenting = false;
    this.stageParameters = null;

    this.getEyeParameters = device.display.getEyeParameters.bind( device.display );
    this.getImmediatePose = device.sensor.getImmediateState.bind( device.sensor );
    this.getPose = device.sensor.getState.bind( device.sensor );
    this.resetPose = device.sensor.resetSensor.bind( device.sensor );

    var currentLayer = null;

    this.getLayers = function () {
      return [ currentLayer ];
    };

    var fullScreenParam = {vrDisplay: device.display, vrDistortion: true};

    this.requestPresent = function ( layer ) {
      var promises = [ ];
      if ( currentLayer ) {
        promises.push( this.exitPresent() );
      }
      promises.push( new Promise( function ( resolve, reject ) {
        if ( !this.capabilities.canPresent ) {
          reject( new Error( "This device cannot be used as a presentation display. DisplayID: " + this.displayId + ". Name: " + this.displayName ) );
        }
        else if ( !layer ) {
          reject( new Error( "No layer provided to requestPresent" ) );
        }
        else if ( !layer.source ) {
          reject( new Error( "No source on layer parameter." ) );
        }
        else {
          requestFullScreen( layer.source, fullScreenParam )
              .then( function ( elem ) {
                this.isPresenting = elem === layer.source;
                currentLayer = layer;
                if ( isMobile && screen.orientation && screen.orientation.lock ) {
                  screen.orientation.lock( 'landscape-primary' );
                }
                resolve();
              }.bind( this ) )
              .catch( function ( evt ) {
                this.isPresenting = false;
                reject( evt );
              }.bind( this ) );
        }
      }.bind( this ) ) );
      return Promise.all( promises );
    }.bind( this );

    this.exitPresent = function () {
      return new Promise( function ( resolve, reject ) {
        if ( !this.isPresenting ) {
          reject( new Error( "Not presenting." ) );
        }
        else if ( !currentLayer ) {
          reject( new Error( "Not in control of presentation." ) );
        }
        else {
          var clear = function () {
            this.isPresenting = false;
            currentLayer = null;
          }.bind( this );

          exitFullScreen( currentLayer.source )
              .then( function () {
                clear();
                resolve();
              } )
              .catch( function ( err ) {
                clear();
                reject( err );
              } );
        }
      } );
    };
  }

  MockVRDisplay.prototype.requestAnimationFrame = window.requestAnimationFrame.bind( window );
  MockVRDisplay.prototype.cancelAnimationFrame = window.cancelAnimationFrame.bind( window );

  MockVRDisplay.prototype.submitFrame = function () {
  };

  pliny.class( "Primrose.Input", {
    name: "VR",
    description: "<under construction>"
  } );
  function VRInput ( name, near, far, commands, socket, elem, selectedIndex ) {
    if ( commands === undefined || commands === null ) {
      commands = VRInput.AXES.map( function ( a ) {
        return {
          name: a,
          axes: [ Primrose.Input.VR[a] ]
        };
      } );
    }

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, VRInput.AXES );

    var listeners = {
      vrdeviceconnected: [ ],
      vrdevicelost: [ ]
    };


    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "vrdeviceconnected" ) {
        Object.keys( this.displays ).forEach( handler );
      }
    };

    function onConnected ( id ) {
      for ( var i = 0; i < listeners.vrdeviceconnected.length; ++i ) {
        listeners.vrdeviceconnected[i]( id );
      }
    }

    this.displays = [ ];
    this.currentDisplay = null;
    this.currentPose = null;
    this.params = null;
    this.transforms = null;

    function registerDisplays ( elem, displays ) {
      console.log( "Displays found:", displays.length );
      console.log( "Displays:", displays );
      this.displays = displays;

      if ( elem ) {
        console.log( "Building chooser interface.", elem );
        elem.innerHTML = "";
        for ( var i = 0; i < this.displays.length; ++i ) {
          var option = document.createElement( "option" );
          option.value = i;
          option.innerHTML = this.displays[i].deviceName;
          option.selected = ( selectedIndex === i );
          elem.appendChild( option );
        }
      }

      this.displays.forEach( onConnected );

      if ( typeof selectedIndex !== "number" && this.displays.length === 1 ) {
        selectedIndex = 0;
      }
      if ( typeof selectedIndex === "number" ) {
        this.connect( selectedIndex, near, far );
      }
    }

    function enumerateVRDevices ( elem, devices ) {
      console.log( "Devices found:", devices.length );
      console.log( "Devices:", devices );
      var displays = {},
          id = null;

      for ( var i = 0; i < devices.length; ++i ) {
        var device = devices[i];
        id = device.hardwareUnitId;
        if ( !displays[id] ) {
          displays[id] = {};
        }

        var display = displays[id];
        if ( device instanceof HMDVRDevice ) {
          display.display = device;
        }
        else if ( devices[i] instanceof PositionSensorVRDevice ) {
          display.sensor = device;
        }
      }

      var mockDisplays = [ ];
      for ( id in displays ) {
        mockDisplays.push( new MockVRDisplay( displays[id] ) );
      }

      registerDisplays.call( this, elem, mockDisplays );
    }

    function checkForVRDisplays () {
      console.log( "Checking for VR Displays..." );
      if ( navigator.getVRDisplays ) {
        console.log( "Using WebVR API 1" );
        navigator.getVRDisplays().then( registerDisplays.bind( this, elem ) );
      }
      else if ( navigator.getVRDevices ) {
        console.log( "Using Chromium Experimental WebVR API" );
        navigator.getVRDevices().then( enumerateVRDevices.bind( this, elem ) ).catch( console.error.bind( console, "Could not find VR devices" ) );
      } else if ( navigator.mozGetVRDevices ) {
        console.log( "Using Firefox Experimental WebVR API" );
        navigator.mozGetVRDevices( enumerateVRDevices.bind( this, elem ) );
      }
      else {
        console.log( "Your browser doesn't have WebVR capability. Check out http://mozvr.com/" );
      }
    }

    checkForVRDisplays.call( this );
  }

  VRInput.AXES = [
    "headX", "headY", "headZ",
    "headVX", "headVY", "headVZ",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW",
    "headRVX", "headRVY", "headRVZ",
    "headRAX", "headRAY", "headRAZ"
  ];
  Primrose.Input.ButtonAndAxis.inherit( VRInput );

  VRInput.prototype.submitFrame = function () {
    if ( this.currentDisplay ) {
      this.currentDisplay.submitFrame( this.currentPose );
    }
  };

  VRInput.prototype.update = function ( dt ) {
    if ( this.currentDisplay ) {
      var caps = this.currentDisplay.capabilities,
          pose = this.currentDisplay.getPose();
      this.currentPose = pose;
      
      if ( caps.hasPosition ) {
        this.headX = pose.position[0];
        this.headY = pose.position[1];
        this.headZ = pose.position[2];
        this.headVX = pose.linearVelocity[0];
        this.headVY = pose.linearVelocity[1];
        this.headVZ = pose.linearVelocity[2];
        this.headAX = pose.linearAcceleration[0];
        this.headAY = pose.linearAcceleration[1];
        this.headAZ = pose.linearAcceleration[2];
      }

      if ( caps.hasOrientation ) {
        this.headRX = pose.orientation[0];
        this.headRY = pose.orientation[1];
        this.headRZ = pose.orientation[2];
        this.headRW = pose.orientation[3];
        this.headRVX = pose.angularVelocity[0];
        this.headRVY = pose.angularVelocity[1];
        this.headRVZ = pose.angularVelocity[2];
        this.headRAX = pose.angularAcceleration[0];
        this.headRAY = pose.angularAcceleration[1];
        this.headRAZ = pose.angularAcceleration[2];
      }
    }
    Primrose.Input.ButtonAndAxis.prototype.update.call( this, dt );
  };

  VRInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion();
    value.set( this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ),
        this.getValue( w ) );
    return value;
  };

  function getParams () {
    if ( this.currentDisplay ) {
      var params = null;
      if ( this.currentDisplay.getEyeParameters ) {
        params = {
          left: this.currentDisplay.getEyeParameters( "left" ),
          right: this.currentDisplay.getEyeParameters( "right" )
        };
      }
      else {
        var l = this.currentDisplay.getRecommendedEyeRenderRect( "left" ),
            r = this.currentDisplay.getRecommendedEyeRenderRect( "right" );
        params = {
          left: {
            renderWidth: l.width,
            renderHeight: l.height,
            offset: this.currentDisplay.getEyeTranslation( "left" ),
            fieldOfView: this.currentDisplay.getRecommendedEyeFieldOfView( "left" )
          },
          right: {
            renderWidth: r.width,
            renderHeight: r.height,
            offset: this.currentDisplay.getEyeTranslation( "right" ),
            fieldOfView: this.currentDisplay.getRecommendedEyeFieldOfView( "right" )
          }
        };
      }
      return params;
    }
  }

  function fieldOfViewToProjectionMatrix ( fov, zNear, zFar ) {
    var upTan = Math.tan( fov.upDegrees * Math.PI / 180.0 ),
        downTan = Math.tan( fov.downDegrees * Math.PI / 180.0 ),
        leftTan = Math.tan( fov.leftDegrees * Math.PI / 180.0 ),
        rightTan = Math.tan( fov.rightDegrees * Math.PI / 180.0 ),
        xScale = 2.0 / ( leftTan + rightTan ),
        yScale = 2.0 / ( upTan + downTan ),
        matrix = new THREE.Matrix4();
    matrix.elements[0] = xScale;
    matrix.elements[1] = 0.0;
    matrix.elements[2] = 0.0;
    matrix.elements[3] = 0.0;
    matrix.elements[4] = 0.0;
    matrix.elements[5] = yScale;
    matrix.elements[6] = 0.0;
    matrix.elements[7] = 0.0;
    matrix.elements[8] = -( ( leftTan - rightTan ) * xScale * 0.5 );
    matrix.elements[9] = ( ( upTan - downTan ) * yScale * 0.5 );
    matrix.elements[10] = -( zNear + zFar ) / ( zFar - zNear );
    matrix.elements[11] = -1.0;
    matrix.elements[12] = 0.0;
    matrix.elements[13] = 0.0;
    matrix.elements[14] = -( 2.0 * zFar * zNear ) / ( zFar - zNear );
    matrix.elements[15] = 0.0;

    return matrix;
  }

  function makeTransform ( s, eye, near, far ) {
    var t = eye.offset;
    s.translation = new THREE.Matrix4().makeTranslation( t[0], t[1], t[2] );
    s.projection = fieldOfViewToProjectionMatrix( eye.fieldOfView, near, far );
    s.viewport = {
      left: 0,
      top: 0,
      width: eye.renderWidth,
      height: eye.renderHeight
    };
  }

  VRInput.prototype.connect = function ( selectedIndex, near, far ) {
    this.currentDisplay = this.displays[selectedIndex];
    if ( this.currentDisplay ) {
      this.enabled = true;
      var params = getParams.call( this );
      this.transforms = [ {}, {} ];
      makeTransform( this.transforms[0], params.left, near, far );
      makeTransform( this.transforms[1], params.right, near, far );
      this.transforms[1].viewport.left = this.transforms[0].viewport.width;
    }
  };

  return VRInput;
} )();

pliny.issue( "Primrose.Input.VR", {
  name: "document VR",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.VR](#Primrose_Input_VR) class in the input/ directory"
} );
