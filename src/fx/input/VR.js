/* global THREE, Primrose, HMDVRDevice, PositionSensorVRDevice */
Primrose.Input.VR = ( function () {
  function VRInput ( name, commands, socket, elem, selectedID ) {
    if ( commands === undefined || commands === null ) {
      commands = VRInput.AXES.map( function ( a ) {
        return {
          name: a,
          axes: [ Primrose.Input.VR[a] ]
        };
      } );
    }
    
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, VRInput.AXES );
    this.setAxis("headRW", 1);

    var listeners = {
      vrdeviceconnected: [ ],
      vrdevicelost: [ ]
    };


    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "vrdeviceconnected" ) {
        Object.keys( this.devices ).forEach( handler );
      }
    };

    function sendAll ( arr, id ) {
      for ( var i = 0; i < arr.length; ++i ) {
        arr[i]( id );
      }
    }

    function onConnected ( id ) {
      sendAll( listeners.vrdeviceconnected, id );
    }

    function onDisconnected ( id ) {
      sendAll( listeners.vrdevicelost, id );
    }

    this.devices = {};
    this.deviceIDs = null;
    this.sensor = null;
    this.display = null;
    this.params = null;
    this.transforms = null;

    function enumerateVRDevices ( elem, devices ) {
      var id,
          newDevices = [ ],
          lostDevices = Object.keys( this.devices );

      for ( var i = 0; i < devices.length; ++i ) {
        var device = devices[i];
        id = device.hardwareUnitId;
        if ( !this.devices[id] ) {
          newDevices.push( id );
          var j = lostDevices.indexOf( id );
          if ( j >= 0 ) {
            lostDevices.splice( j, 1 );
          }
          this.devices[id] = {
            display: null,
            sensor: null
          };
        }
        var vr = this.devices[id];
        if ( device instanceof HMDVRDevice ) {
          vr.display = device;
        }
        else if ( devices[i] instanceof PositionSensorVRDevice ) {
          vr.sensor = device;
        }
      }

      this.deviceIDs = Object.keys( this.devices );
      this.deviceIDs.forEach( function ( id ) {
        var d = this.devices[id],
            a = d.display.deviceName,
            b = d.sensor.deviceName;
        d.name = "";
        for ( var i = 0; i < a.length && i < b.length && a[i] === b[i]; ++i ) {
          d.name += a[i];
        }
        while ( d.name.length > 0 && !/\w/.test( d.name[d.name.length - 1] ) ) {
          d.name = d.name.substring( 0, d.name.length - 1 );
        }
      }.bind( this ) );

      newDevices.forEach( onConnected );
      lostDevices.forEach( onDisconnected );

      if ( elem ) {
        elem.innerHTML = "";
        for ( id in this.devices ) {
          var option = document.createElement( "option" );
          option.value = id;
          option.innerHTML = this.devices[id].sensor.deviceName;
          option.selected = ( selectedID === id );
          elem.appendChild( option );
        }
      }

      selectedID = selectedID || this.deviceIDs.length === 1 && this.deviceIDs[0];
      if ( selectedID ) {
        this.connect( selectedID );
      }
    }

    function checkForVRDevices () {
      if ( navigator.getVRDevices ) {
        navigator.getVRDevices().then( enumerateVRDevices.bind( this, elem ) ).catch( console.error.bind( console, "Could not find VR devices" ) );
      } else if ( navigator.mozGetVRDevices ) {
        navigator.mozGetVRDevices( enumerateVRDevices.bind( this, elem ) );
      }
      else {
        console.log( "Your browser doesn't have WebVR capability. Check out http://mozvr.com/" );
      }
    }

    checkForVRDevices.call( this );
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

  VRInput.prototype.update = function ( dt ) {
    if ( this.sensor ) {
      var state = this.sensor.getState();

      if ( state.position ) {
        this.setAxis( "headX", state.position.x );
        this.setAxis( "headY", state.position.y );
        this.setAxis( "headZ", state.position.z );
      }

      if ( state.linearVelocity ) {
        this.setAxis( "headVX", state.linearVelocity.x );
        this.setAxis( "headVY", state.linearVelocity.y );
        this.setAxis( "headVZ", state.linearVelocity.z );
      }

      if ( state.linearAcceleration ) {
        this.setAxis( "headAX", state.linearAcceleration.x );
        this.setAxis( "headAY", state.linearAcceleration.y );
        this.setAxis( "headAZ", state.linearAcceleration.z );
      }

      if ( state.orientation ) {
        this.setAxis( "headRX", state.orientation.x );
        this.setAxis( "headRY", state.orientation.y );
        this.setAxis( "headRZ", state.orientation.z );
        this.setAxis( "headRW", state.orientation.w );
      }

      if ( state.angularVelocity ) {
        this.setAxis( "headRVX", state.angularVelocity.x );
        this.setAxis( "headRVY", state.angularVelocity.y );
        this.setAxis( "headRVZ", state.angularVelocity.z );
        this.setAxis( "headRVW", state.angularVelocity.w );
      }

      if ( state.angularAcceleration ) {
        this.setAxis( "headRAX", state.angularAcceleration.x );
        this.setAxis( "headRAY", state.angularAcceleration.y );
        this.setAxis( "headRAZ", state.angularAcceleration.z );
        this.setAxis( "headRAW", state.angularAcceleration.w );
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
    if ( this.display ) {
      var params = null;
      if ( this.display.getEyeParameters ) {
        params = {
          left: this.display.getEyeParameters( "left" ),
          right: this.display.getEyeParameters( "right" )
        };
      }
      else {
        params = {
          left: {
            renderRect: this.display.getRecommendedEyeRenderRect( "left" ),
            eyeTranslation: this.display.getEyeTranslation( "left" ),
            recommendedFieldOfView: this.display.getRecommendedEyeFieldOfView( "left" )
          },
          right: {
            renderRect: this.display.getRecommendedEyeRenderRect( "right" ),
            eyeTranslation: this.display.getEyeTranslation( "right" ),
            recommendedFieldOfView: this.display.getRecommendedEyeFieldOfView( "right" )
          }
        };
      }
      return params;
    }
  }

  function makeTransform ( s, eye ) {
    var t = eye.eyeTranslation;
    s.transform.makeTranslation( t.x, t.y, t.z );
    s.viewport = eye.renderRect;
  }

  VRInput.prototype.connect = function ( selectedID ) {
    var device = this.devices[selectedID];
    if ( device ) {
      this.sensor = device.sensor;
      this.display = device.display;
      this.params = getParams.call( this );
      this.transforms = [ {
          transform: new THREE.Matrix4()
        }, {
          transform: new THREE.Matrix4()
        } ];
      makeTransform( this.transforms[0], this.params.left );
      makeTransform( this.transforms[1], this.params.right );
    }
  };

  return VRInput;
} )();
