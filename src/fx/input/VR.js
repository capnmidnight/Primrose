/* global Primrose, HMDVRDevice, PositionSensorVRDevice */
Primrose.Input.VR = ( function () {
  function VRInput ( name, commands, elem, selectedID ) {
    if ( commands === undefined || commands === null ) {
      commands = VRInput.AXES.map( function ( a ) {
        return {
          name: a,
          axes: [ Primrose.Input.VR[a] ]
        };
      } );
    }

    Primrose.Input.ButtonAndAxis.call( this, name, commands, null, null, 1, VRInput.AXES );

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

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        remove( listeners[event], handler );
      }
    };

    this.devices = {};
    this.sensor = null;
    this.display = null;
    function checkForVRDevices () {
      if ( navigator.getVRDevices ) {
        navigator.getVRDevices().then( this.enumerateVRDevices.bind( this, elem, selectedID ) );
      } else if ( navigator.mozGetVRDevices ) {
        navigator.mozGetVRDevices( this.enumerateVRDevices.bind( this, elem, selectedID ) );
      }
      else{
        console.log("Your browser doesn't have WebVR capability. Check out http://mozvr.com/");
      }
    }

    this.enumerateVRDevices = function ( elem, selectedID, devices ) {
      var id,
          newDevices = [],
          lostDevices = Object.keys(this.devices);
      
      for ( var i = 0; i < devices.length; ++i ) {
        var device = devices[i];
        id = device.hardwareUnitId;
        if ( !this.devices[id] ) {
          newDevices.push(id);
          var j = lostDevices.indexOf(id);
          if(j >= 0){
            lostDevices.splice(j, 1);
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
      
      newDevices.forEach(onConnected);
      lostDevices.forEach(onDisconnected);

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

      this.connect( selectedID );
    };
    
    checkForVRDevices.call(this);
  }

  VRInput.AXES = [
    "X", "Y", "Z",
    "VX", "VY", "VZ",
    "AX", "AY", "AZ",
    "RX", "RY", "RZ", "RW",
    "RVX", "RVY", "RVZ",
    "RAX", "RAY", "RAZ"
  ];
  Primrose.Input.ButtonAndAxis.inherit( VRInput );

  VRInput.prototype.update = function ( dt ) {
    if ( this.sensor ) {
      var state = this.sensor.getState();

      if ( state.position ) {
        this.setAxis( "X", state.position.x );
        this.setAxis( "Y", state.position.y );
        this.setAxis( "Z", state.position.z );
      }

      if ( state.linearVelocity ) {
        this.setAxis( "VX", state.linearVelocity.x );
        this.setAxis( "VY", state.linearVelocity.y );
        this.setAxis( "VZ", state.linearVelocity.z );
      }

      if ( state.linearAcceleration ) {
        this.setAxis( "AX", state.linearAcceleration.x );
        this.setAxis( "AY", state.linearAcceleration.y );
        this.setAxis( "AZ", state.linearAcceleration.z );
      }

      if ( state.orientation ) {
        this.setAxis( "RX", state.orientation.x );
        this.setAxis( "RY", state.orientation.y );
        this.setAxis( "RZ", state.orientation.z );
        this.setAxis( "RW", state.orientation.w );
      }

      if ( state.angularVelocity ) {
        this.setAxis( "RVX", state.angularVelocity.x );
        this.setAxis( "RVY", state.angularVelocity.y );
        this.setAxis( "RVZ", state.angularVelocity.z );
      }

      if ( state.angularAcceleration ) {
        this.setAxis( "RAX", state.angularAcceleration.x );
        this.setAxis( "RAY", state.angularAcceleration.y );
        this.setAxis( "RAZ", state.angularAcceleration.z );
      }
    }
    Primrose.Input.ButtonAndAxis.prototype.update.call( this, dt );
  };

  VRInput.prototype.connect = function ( selectedID ) {
    var device = this.devices[selectedID];
    if ( device ) {
      this.sensor = device.sensor;
      this.display = device.display;
    }
  };

  VRInput.prototype.getParams = function () {
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
  };

  return VRInput;
} )();
