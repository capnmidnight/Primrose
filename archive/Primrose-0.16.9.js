/*
  Primrose v0.16.9 2015-12-07
  
  Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com> (https://www.seanmcbeth.com)
  https://www.primroseeditor.com
  https://github.com/capnmidnight/Primrose.git
*/
/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
console.clear();
var Primrose = {
  Input: {},
  Output: {},
  Text: {
    CodePages: {},
    CommandPacks: {},
    Controls: {},
    Grammars: {},
    OperatingSystems: {},
    Renderers: {},
    Themes: {}
  },
  SYS_FONTS: "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', " +
      "'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
  SKINS: [ "#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
    "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
    "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
    "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
    "#5B0001", "#302E2E" ]
};
;/* global Primrose, isFirefox */

Primrose.Application = ( function () {
  // This function is what is called a "Higher-order function", i.e. it is a function that takes a function as a parameter. Think of it as a function that doesn't know how to do the entire job, but it knows how to do some of it, and asks for the rest of the job as a parameter. It's a convenient way to be able to combine different bits of functionality without having to write the same code over and over again.
  function FCT ( thunk, evt ) {
    // for every point that has changed (we don't need to update points that didn't change, and on the touchend event, there is no element for the most recently released finger in the regular "touches" property).
    for ( var i = 0; i < evt.changedTouches.length; ++i ) {
      // call whatever function we were given. It's going to be one of start/move/end above, and as you can see, we're overriding the default value of the idx parameter.
      thunk.call( this, evt.changedTouches[i], evt.changedTouches[i].identifier );
    }
    evt.preventDefault();
  }

// we want to wire up all of the event handlers to the Canvas element itself, so that the X and Y coordinates of the events are offset correctly into the container.
  function E ( elem, k, f, t ) {
    var elems;
    if ( elem instanceof String || typeof elem === "string" ) {
      elems = Array.prototype.slice.call( document.querySelectorAll( elem ) );
    } else {
      elems = [ elem ];
    }
    for ( var i = 0; i < elems.length; ++i ) {
      elem = elems[i];
      if ( t ) {
        elem.addEventListener( k, FCT.bind( elem, f ), false );
      } else {
        elem.addEventListener( k, f.bind( elem ), false );
      }
    }
    return elems;
  }

  function beginApp ( update, render, resize, elem ) {
    var lt = 0,
        dt = 0,
        points = {},
        keys = {},
        onpaint = function onpaint ( t ) {
          var ticker = requestAnimationFrame( onpaint );
          try {
            dt = t - lt;
            update( dt, points, keys );
            render( dt );
          } catch ( err ) {
            cancelAnimationFrame( ticker );
            throw err;
          }
          lt = t;
        };

    // This function gets called the first time a mouse button is pressed or a new finger touches the screen. The idx value defaults to 10 because mouse clicks don't have an identifier value, but we need one to keep track of mouse clicks separately than touches, which do have identifier values, ending at 9.
    function setPoint ( evt, idx ) {
      if ( idx === undefined ) {
        idx = 10;
      }

      if ( idx === 10 ) {
        evt.preventDefault();
      }

      var obj = points[idx] || {};
      obj.x = evt.clientX;
      obj.y = evt.clientY;
      obj.rx = evt.radiusX;
      obj.ry = evt.radiusY;
      obj.b = evt.buttons;

      if ( isFirefox && obj.rx !== undefined ) {
        obj.rx /= 3;
        obj.ry /= 3;
      }

      if ( obj.b === undefined ) {
        obj.b = 1;
      }

      if ( obj.rx === undefined ) {
        if ( obj.b === 0 ) {
          obj.rx = 1;
          obj.ry = 1;
        }
        else {
          obj.rx = 1.5;
          obj.ry = 1.5;
        }
      }

      points[idx] = obj;
    }

    // This function gets called anytime the mouse or one of the fingers is released. It just cleans up our tracking objects, so the next time the mouse button is pressed, it can all start over again.
    function endPoint ( evt, idx ) {
      if ( idx === undefined ) {
        idx = 10;
      }

      if ( idx === 10 ) {
        evt.preventDefault();
      }

      points[idx] = null;
    }

    function keyDown ( evt ) {
      keys[evt.keyCode] = true;
      keys.shift = evt.shiftKey;
      keys.ctrl = evt.ctrlKey;
      keys.alt = evt.altKey;
    }

    function keyUp ( evt ) {
      keys[evt.keyCode] = false;
      keys.shift = evt.shiftKey;
      keys.ctrl = evt.ctrlKey;
      keys.alt = evt.altKey;
    }

    E( elem, "mousedown", setPoint );
    E( elem, "mousemove", setPoint );
    E( elem, "mouseup", endPoint );
    E( elem, "mouseout", endPoint );

    E( elem, "touchstart", setPoint, true );
    E( elem, "touchmove", setPoint, true );
    E( elem, "touchend", endPoint, true );

    E( window, "keydown", keyDown );
    E( window, "keyup", keyUp );

    E( window, "resize", resize );

    resize();
    requestAnimationFrame( requestAnimationFrame.bind( window, onpaint ) );
  }

  return beginApp;
} )();;/* global Primrose, THREE */

Primrose.Button = ( function () {
  function Button ( model, name, options ) {
    this.options = combineDefaults( options, Button );
    this.options.minDeflection = Math.cos( this.options.minDeflection );
    this.options.colorUnpressed = new THREE.Color(
        this.options.colorUnpressed );
    this.options.colorPressed = new THREE.Color( this.options.colorPressed );

    this.listeners = { click: [ ] };
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.isSolid = true;
    this.cap.material = this.cap.material.clone();
    this.color = this.cap.material.color;
    this.base = model.children[1];
    this.name = name;
    this.toggle = false;
    this.value = false;
    this.pressed = false;
    this.wasPressed = false;
  }

  Button.DEFAULTS = {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true,
    minDistance: 2
  };

  Button.prototype.addEventListener = function ( event, func ) {
    if ( this.listeners[event] ) {
      this.listeners[event].push( func );
    }
  };

  Button.prototype.fire = function () {
    for ( var i = 0; i < this.listeners.click.length; ++i ) {
      this.listeners.click[i].call( this );
    }
  };

  Button.prototype.moveBy = function(x, y, z){
    this.base.position.x += x;
    this.base.position.y += y;
    this.base.position.z += z;
    this.cap.physics.position.x += x;
    this.cap.physics.position.y += y;
    this.cap.physics.position.z += z;
  };

  Button.prototype.readContacts = function ( contacts ) {
    this.wasPressed = this.pressed;
    this.pressed = false;

    for ( var i = 0; i < contacts.length; ++i ) {
      var contact = contacts[i];
      if ( contact.bi.graphics === this.cap || contact.bj.graphics === this.cap) {
        this.pressed = true;
        break;
      }
    }

    if ( this.pressed ) {
      this.fire();
      this.color.copy( this.options.colorPressed );
    }
    else {
      this.color.copy( this.options.colorUnpressed );
    }
  };

  return Button;
} )();
;/* global Primrose */

Primrose.ButtonFactory = ( function () {

  var buttonCount = 0;

  function ButtonFactory ( templateFile, options ) {
    this.options = options;
    if(typeof templateFile === "string"){
      Primrose.ModelLoader.loadObject( templateFile, function ( obj ) {
        this.template = obj;
      }.bind( this ) );
    }
    else{
      this.template = templateFile;
    }
  }


  ButtonFactory.prototype.create = function ( toggle ) {
    var name = "button" + ( ++buttonCount );
    var obj = this.template.clone();
    var btn = new Primrose.Button( obj, name, this.options );
    btn.toggle = toggle;
    return btn;
  };

  return ButtonFactory;
} )();
;/* global Primrose */

Primrose.ChatApplication = ( function () {

  function ChatApplication ( name, options ) {
    this.formStateKey = name + " - formState";
    this.formState = getSetting( this.formStateKey );
    this.ctrls = findEverything();
    this.fullscreenElement = document.documentElement;
    this.options = combineDefaults( options, ChatApplication );
    this.users = { };
    this.chatLines = [ ];
    this.userName = ChatApplication.DEFAULT_USER_NAME;
    this.focused = true;
    this.wasFocused = false;
  }

  ChatApplication.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";
  ChatApplication.DEFAULTS = {
  };

  return ChatApplication;
} )();
;/* global Primrose, THREE */

Primrose.ModelLoader = ( function () {
  if ( typeof ( THREE ) === "undefined" ) {
    return function () {
    };
  }
  var JSON;

  if ( THREE.ObjectLoader ) {
    JSON = new THREE.ObjectLoader();
  }

  function fixJSONScene ( json ) {
    json.traverse( function ( obj ) {
      if ( obj.geometry ) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
      }
    } );
    return json;
  }

  function buildScene ( success, scene ) {
    scene.buttons = [ ];
    scene.traverse( function ( child ) {
      if ( child.isButton ) {
        scene.buttons.push(
            new Primrose.Button( child.parent, child.name ) );
      }
      if ( child.name ) {
        scene[child.name] = child;
      }
    } );
    if ( success ) {
      success( scene );
    }
  }

  var propertyTests = {
    isButton: function ( obj ) {
      return obj.material && obj.material.name.match( /^button\d+$/ );
    },
    isSolid: function ( obj ) {
      return !obj.name.match( /^(water|sky)/ );
    },
    isGround: function ( obj ) {
      return obj.material && obj.material.name && obj.material.name.match(/\bground\b/);
    }
  };

  function setProperties ( object ) {
    object.traverse( function ( obj ) {
      if ( obj instanceof THREE.Mesh ) {
        for ( var prop in propertyTests ) {
          obj[prop] = obj[prop] || propertyTests[prop]( obj );
        }
      }
    } );
  }

  function ModelLoader ( src, success ) {
    if ( src ) {
      var done = function ( scene ) {
        this.template = scene;
        if ( success ) {
          success( scene );
        }
      }.bind( this );
      ModelLoader.loadObject( src, done );
    }
  }

  ModelLoader.prototype.clone = function () {
    var obj = this.template.clone();

    obj.traverse( function ( child ) {
      if ( child instanceof THREE.SkinnedMesh ) {
        obj.animation = new THREE.Animation( child, child.geometry.animation );
        if ( !this.template.originalAnimationData && obj.animation.data ) {
          this.template.originalAnimationData = obj.animation.data;
        }
        if ( !obj.animation.data ) {
          obj.animation.data = this.template.originalAnimationData;
        }
      }
    }.bind( this ) );

    setProperties( obj );
    return obj;
  };


  ModelLoader.loadScene = function ( src, success ) {
    var done = buildScene.bind( window, success );
    ModelLoader.loadObject( src, done );
  };

  ModelLoader.loadObject = function ( src, success ) {
    var done = function ( scene ) {
      setProperties( scene );
      if ( success ) {
        success( scene );
      }
    };

    if ( /\.json$/.test(src) ) {
      if ( !JSON ) {
        console.error( "JSON seems to be broken right now" );
      }
      else {
        JSON.setCrossOrigin(THREE.ImageUtils.crossOrigin);
        JSON.load( src, function ( json ) {
          done( fixJSONScene( json ) );
        } );
      }
    }
  };

  return ModelLoader;
} )();
;/* global Primrose */

Primrose.NetworkedInput = ( function () {
  function NetworkedInput ( name, commands, socket, oscope ) {
    this.name = name;
    this.commandState = { };
    this.commands = [ ];
    this.socket = socket;
    this.oscope = oscope;
    this.enabled = true;
    this.paused = false;
    this.ready = true;
    this.transmitting = true;
    this.receiving = true;
    this.socketReady = false;
    this.inPhysicalUse = true;
    this.inputState = { };
    this.lastState = "";

    function readMetaKeys ( event ) {
      for ( var i = 0; i < NetworkedInput.META_KEYS.length; ++i ) {
        var m = NetworkedInput.META_KEYS[i];
        this.inputState[m] = event[m + "Key"];
      }
    }

    window.addEventListener( "keydown", readMetaKeys.bind( this ), false );
    window.addEventListener( "keyup", readMetaKeys.bind( this ), false );

    if ( socket ) {
      socket.on( "open", function () {
        this.socketReady = true;
        this.inPhysicalUse = !this.receiving;
      }.bind( this ) );
      socket.on( name, function ( cmdState ) {
        if ( this.receiving ) {
          this.inPhysicalUse = false;
          this.decodeStateSnapshot( cmdState );
          this.fireCommands();
        }
      }.bind( this ) );
      socket.on( "close", function () {
        this.inPhysicalUse = true;
        this.socketReady = false;
      }.bind( this ) );
    }

    for ( var i = 0; i < commands.length; ++i ) {
      this.addCommand( commands[i] );
    }

    for ( i = 0; i < NetworkedInput.META_KEYS.length; ++i ) {
      this.inputState[NetworkedInput.META_KEYS[i]] = false;
    }
  }

  NetworkedInput.META_KEYS = [ "ctrl", "shift", "alt", "meta" ];
  NetworkedInput.META_KEYS.forEach( function ( key, index ) {
    NetworkedInput[key.toLocaleUpperCase()] = index + 1;
  } );

  NetworkedInput.prototype.addCommand = function ( cmd ) {
    cmd = this.cloneCommand( cmd );
    cmd.repetitions = cmd.repetitions || 1;
    this.commands.push( cmd );
    this.commandState[cmd.name] = {
      value: null,
      pressed: false,
      wasPressed: false,
      fireAgain: false,
      lt: 0,
      ct: 0,
      repeatCount: 0
    };
  };

  NetworkedInput.prototype.cloneCommand = function ( cmd ) {
    throw new Error(
        "cloneCommand function must be defined in subclass" );
  };

  NetworkedInput.prototype.update = function ( dt ) {
    if ( this.ready && this.enabled && this.inPhysicalUse && !this.paused ) {
      for ( var c = 0; c < this.commands.length; ++c ) {
        var cmd = this.commands[c];
        var cmdState = this.commandState[cmd.name];
        cmdState.wasPressed = cmdState.pressed;
        cmdState.pressed = false;
        if ( !cmd.disabled ) {
          var metaKeysSet = true;

          if ( cmd.metaKeys ) {
            for ( var n = 0; n < cmd.metaKeys.length && metaKeysSet; ++n ) {
              var m = cmd.metaKeys[n];
              metaKeysSet = metaKeysSet &&
                  ( this.inputState[NetworkedInput.META_KEYS[m.index]] &&
                      m.toggle ||
                      !this.inputState[NetworkedInput.META_KEYS[m.index]] &&
                      !m.toggle );
            }
          }

          this.evalCommand( cmd, cmdState, metaKeysSet, dt );

          cmdState.lt += dt;
          if ( cmdState.lt >= cmd.dt ) {
            cmdState.repeatCount++;
          }

          cmdState.fireAgain = cmdState.pressed &&
              cmdState.lt >= cmd.dt &&
              cmdState.repeatCount >= cmd.repetitions;

          if ( cmdState.fireAgain ) {
            cmdState.lt = 0;
            cmdState.repeatCount = 0;
          }
        }
      }

      if ( this.socketReady && this.transmitting ) {
        var finalState = this.makeStateSnapshot();
        if ( finalState !== this.lastState ) {
          this.socket.emit( this.name, finalState );
          this.lastState = finalState;
        }
      }

      this.fireCommands();
    }
  };

  NetworkedInput.prototype.fireCommands = function () {
    if ( this.ready && !this.paused ) {
      for ( var i = 0; i < this.commands.length; ++i ) {
        var cmd = this.commands[i];
        var cmdState = this.commandState[cmd.name];
        if ( cmdState.fireAgain && cmd.commandDown ) {
          cmd.commandDown();
        }

        if ( !cmdState.pressed && cmdState.wasPressed && cmd.commandUp ) {
          cmd.commandUp();
        }
      }
    }
  };

  NetworkedInput.prototype.makeStateSnapshot = function () {
    var state = "";
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var cmdState = this.commandState[cmd.name];
      if ( cmdState ) {
        state += fmt(
            "$1:$2",
            ( i << 2 )
            | ( cmdState.pressed ? 0x1 : 0 )
            | ( cmdState.fireAgain ? 0x2 : 0 ),
            cmdState.value
            );
        if ( i < this.commands.length - 1 ) {
          state += "|";
        }
      }
    }
    return state;
  };

  NetworkedInput.prototype.decodeStateSnapshot = function ( snapshot ) {
    var cmd;
    for ( var c = 0; c < this.commands.length; ++c ) {
      cmd = this.commands[c];
      var cmdState = this.commandState[cmd.name];
      cmdState.wasPressed = cmdState.pressed;
    }
    var records = snapshot.split( "|" );
    for ( var i = 0; i < records.length; ++i ) {
      var record = records[i];
      var parts = record.split( ":" );
      var cmdIndex = parseInt( parts[0], 10 );
      var pressed = ( cmdIndex & 0x1 ) !== 0;
      var fireAgain = ( flags & 0x2 ) !== 0;
      cmdIndex >>= 2;
      cmd = this.commands[cmdIndex];
      var flags = parseInt( parts[2], 10 );
      this.commandState[cmd.name] = {
        value: parseFloat( parts[1] ),
        pressed: pressed,
        fireAgain: fireAgain
      };
    }
  };

  NetworkedInput.prototype.setProperty = function ( key, name, value ) {
    for ( var i = 0; i < this.commands.length; ++i ) {
      if ( this.commands[i].name === name ) {
        this.commands[i][key] = value;
        break;
      }
    }
  };

  NetworkedInput.prototype.addToArray = function ( key, name, value ) {
    for ( var i = 0; i < this.commands.length; ++i ) {
      if ( this.commands[i].name === name ) {
        this.commands[i][key].push( value );
        break;
      }
    }
  };

  NetworkedInput.prototype.removeFromArray = function ( key, name, value ) {
    var n = -1;
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var arr = cmd[key];
      n = arr.indexOf( value );
      if ( cmd.name === name && n > -1 ) {
        arr.splice( n, 1 );
        break;
      }
    }
  };

  NetworkedInput.prototype.invertInArray = function ( key, name, value ) {
    var n = -1;
    for ( var i = 0; i < this.commands.length; ++i ) {
      var cmd = this.commands[i];
      var arr = cmd[key];
      n = arr.indexOf( value );
      if ( cmd.name === name && n > -1 ) {
        arr[n] *= -1;
        break;
      }
    }
  };

  NetworkedInput.prototype.pause = function ( v ) {
    this.paused = v;
  };

  NetworkedInput.prototype.isPaused = function () {
    return this.paused;
  };

  NetworkedInput.prototype.enable = function ( k, v ) {
    if ( v === undefined || v === null ) {
      v = k;
      k = null;
    }

    if ( k ) {
      this.setProperty( "disabled", k, !v );
    }
    else {
      this.enabled = v;
    }
  };

  NetworkedInput.prototype.isEnabled = function ( k ) {
    if ( k ) {
      for ( var i = 0; i < this.commands.length; ++i ) {
        if ( this.commands[i].name === k ) {
          return !this.commands[i].disabled;
        }
      }
      return false;
    }
    else {
      return this.enabled;
    }
  };

  NetworkedInput.prototype.transmit = function ( v ) {
    this.transmitting = v;
  };

  NetworkedInput.prototype.isTransmitting = function () {
    return this.transmitting;
  };

  NetworkedInput.prototype.receive = function ( v ) {
    this.receiving = v;
  };

  NetworkedInput.prototype.isReceiving = function () {
    return this.receiving;
  };
  return NetworkedInput;
} )();
;/* global Primrose, HTMLSelectElement */
Primrose.StateList = ( function () {
  /*
   * The StateList is a set of objects that can be mapped to DOM elements
   * in such a way to alter their state. The UI presents a drop down list
   * and the select action changes the various controls as the state set
   * dictates. It's a way of streamlining the altering of UI state by select
   * list.
   *
   * States take the form of:
   * { name: "A string for display", values: [
   *      {
   *          ctrlName1: {attributeName1: value1, attributeName2: value2 },
   *          ctrlName2: {attributeName3: value3, attributeName4: value4 }
   *      |]}
   *
   *  The states paramareter should be an array of such objects
   */
  function StateList ( id, ctrls, states, callback, parent ) {
    var select = cascadeElement( id, "select", HTMLSelectElement );
    for ( var i = 0; i < states.length; ++i ) {
      var opt = document.createElement( "option" );
      opt.appendChild( document.createTextNode( states[i].name ) );
      select.appendChild( opt );
    }
    select.addEventListener( "change", function () {
      var values = states[select.selectedIndex].values;
      if ( values !== undefined ) {
        for ( var id in values ) {
          if ( values.hasOwnProperty( id ) ) {
            var attrs = values[id];
            for ( var attr in attrs ) {
              if ( attrs.hasOwnProperty( attr ) ) {
                ctrls[id][attr] = attrs[attr];
              }
            }
          }
        }
        if ( callback ) {
          callback();
        }
      }
    }.bind( this ), false );
    this.DOMElement = select;
    if ( parent ) {
      parent.appendChild( this.DOMElement );
    }
  }

  return StateList;
} )();
;/* global Primrose, CANNON, THREE, io, CryptoJS, fmt, Notification, requestFullScreen, isFullScreenMode */
Primrose.VRApplication = ( function () {
  if(typeof(THREE) === "undefined"){
    return function(){};
  }
  /*
   Create a new VR Application!

   `name` - name the application, for use with saving settings separately from
   other applications on the same domain
   `options` - optional values to override defaults
   | `avatarHeight` - the offset from the ground at which to place the camera
   | `walkSpeed` - how quickly the avatar moves across the ground
   | `button`
      | `model` - the model to use to make buttons, in THREE JSON format
      | `options` - configuration parameters for buttons
        | `maxThrow` - the distance the button may move
        | `minDeflection` - the angle boundary in which to do hit tests on the button
        | `colorUnpressed` - the color of the button when it is not depressed
        | `colorPressed` - the color of the button when it is depressed
   | `gravity` - the acceleration applied to falling objects (default: 9.8)
   | `useLeap` - use the Leap Motion device
   | `backgroundColor` - the color that WebGL clears the background with before
   drawing (default: 0x000000)
   | `drawDistance` - the far plane of the camera (default: 500)
   | `chatTextSize` - the size of a single line of text, in world units
   (default: 0.25)
   | `dtNetworkUpdate` - the amount of time to allow to elapse between sending
   state to teh server (default: 0.125)
   */
  var RIGHT = new THREE.Vector3( 1, 0, 0 ),
      UP = new THREE.Vector3( 0, 1, 0 ),
      FORWARD = new THREE.Vector3( 0, 0, 1 );
  function VRApplication ( name, options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );
    Primrose.ChatApplication.call( this, name, this.options );
    this.listeners = { ready: [ ], update: [ ] };
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;
    this.qRoll = new THREE.Quaternion( );
    this.qPitch = new THREE.Quaternion( );
    this.qHeading = new THREE.Quaternion( );
    this.qRift = new THREE.Quaternion( );
    this.pRift = new THREE.Vector3( );
    this.onground = true;
    this.lt = 0;
    this.frame = 0;
    this.enableMousePitch = true;
    this.currentUser = null;
    this.vrParams = null;
    this.inVR = false;
    this.world = new CANNON.World();
    this.world.defaultContactMaterial.friction = 0.2;
    this.world.gravity.set( 0, -this.options.gravity, 0 );
    this.world.broadphase = new CANNON.SAPBroadphase( this.world );
    this.audio = new Primrose.Output.Audio3D();
    this.music = new Primrose.Output.Music(this.audio.context);
    this.temp = new THREE.Matrix4();
    this.pickingScene = new THREE.Scene();
    this.currentUser = new THREE.Object3D();
    this.currentUser.velocity = new THREE.Vector3();

    //
    // keyboard input
    //
    this.keyboard = new Primrose.Input.Keyboard( "keyboard", window, [
      { name: "strafeLeft", buttons: [ -Primrose.Input.Keyboard.A, -Primrose.Input.Keyboard.LEFTARROW ] },
      { name: "strafeRight", buttons: [ Primrose.Input.Keyboard.D, Primrose.Input.Keyboard.RIGHTARROW ] },
      { name: "driveForward", buttons: [ -Primrose.Input.Keyboard.W, -Primrose.Input.Keyboard.UPARROW ] },
      { name: "driveBack", buttons: [ Primrose.Input.Keyboard.S, Primrose.Input.Keyboard.DOWNARROW ] },
      { name: "jump", buttons: [ Primrose.Input.Keyboard.SPACEBAR ], commandDown: this.jump.bind( this ), dt: 0.5 },
      { name: "zero", buttons: [ Primrose.Input.Keyboard.Z ], commandUp: this.zero.bind( this ) }
    ] );

    //
    // mouse input
    //
    this.mouse = new Primrose.Input.Mouse( "mouse", this.ctrls.frontBuffer, [
      { name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5 },
      { name: "heading", commands: [ "dx" ], integrate: true },
      { name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5 },
      { name: "pitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 }
    ] );

    //
    // gamepad input
    //
    this.gamepad = new Primrose.Input.Gamepad( "gamepad", [
      { name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ] },
      { name: "drive", axes: [ Primrose.Input.Gamepad.LSY ] },
      { name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true },
      { name: "dheading", commands: [ "heading" ], delta: true },
      { name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true }
    ] );
    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );
    
    //
    // VR input
    //
    function connectVR(id){
      var deviceIDs = Object.keys(this.vr.devices);
      if(deviceIDs.length > 0){
        if(this.options.vrFullScreenButton){
          this.options.vrFullScreenButton.style.display = "inline-block";
        }
        this.vr.connect(deviceIDs[0]);
        this.vrParams = this.vr.getParams();

        setTrans( translations[0], this.vrParams.left.eyeTranslation );
        setTrans( translations[1], this.vrParams.right.eyeTranslation );
        viewports[0] = this.vrParams.left.renderRect;
        viewports[1] = this.vrParams.right.renderRect;
      }
      else if(this.options.vrFullScreenButton){
        this.options.vrFullScreenButton.style.display = "none";
      }
    }
    
    this.vr = new Primrose.Input.VR( "vr" );
    this.vr.addEventListener("vrdeviceconnected", connectVR.bind(this), false);
    this.vr.addEventListener("vrdevicelost", connectVR.bind(this), false);

    var DEBUG_VR = false,
        translations = [ new THREE.Matrix4(), new THREE.Matrix4() ],
        viewports = [ ];

    function setTrans ( m, t ) {
      m.makeTranslation( t.x, t.y, t.z );
    }

    //
    // restoring the options the user selected
    //
    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function () {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );
    
    if(window.Leap && this.options.useLeap){
      this.glove = new Primrose.Output.HapticGlove( {
        hands: 2,
        fingers: 5,
        joints: 1,
        port: 9080
      });
    }

    //
    // Setup THREE.js
    //
    this.renderer = new THREE.WebGLRenderer( {
      antialias: true,
      alpha: true,
      canvas: this.ctrls.frontBuffer
    } );
    
    this.renderer.setClearColor( this.options.backgroundColor );
    
    if(this.options.button){
      this.buttonFactory = new Primrose.ButtonFactory( 
        this.options.button.model,
        this.options.button.options );
    }
    else{
      this.buttonFactory = new Primrose.ButtonFactory( 
        brick(0xff0000, 1, 1, 1), {
            maxThrow: 0.1,
            minDeflection: 10,
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00,
            toggle: true
          } );
    }

    this.buttons = [ ];

    this.groundMaterial = new CANNON.Material( "groundMaterial" );
    this.bodyMaterial = new CANNON.Material( "bodyMaterial" );
    this.bodyGroundContact = new CANNON.ContactMaterial(
        this.bodyMaterial,
        this.groundMaterial,
        {
          friction: 0.025,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1e8,
          frictionEquationRegularizationTime: 3
        } );
    this.bodyBodyContact = new CANNON.ContactMaterial(
        this.bodyMaterial,
        this.bodyMaterial,
        {
          friction: 0.4,
          restitution: 0.3,
          contactEquationStiffness: 1e8,
          contactEquationRelaxation: 3,
          frictionEquationStiffness: 1e8,
          frictionEquationRegularizationTime: 3
        } );
    this.world.addContactMaterial( this.bodyGroundContact );
    this.world.addContactMaterial( this.bodyBodyContact );

    function addPhysicsBody ( obj, body, shape, radius, skipObj ) {
      body.addShape( shape );
      body.linearDamping = body.angularDamping = 0.5;
      if ( skipObj ) {
        body.position.set( obj.x, obj.y + radius / 2, obj.z );
      }
      else {
        obj.physics = body;
        body.graphics = obj;
        body.position.copy( obj.position );
        body.quaternion.copy( obj.quaternion );
      }
      this.world.add( body );
      return body;
    }

    function makePlane ( obj ) {
      var shape = new CANNON.Plane();
      var body = new CANNON.Body( { mass: 0, material: this.groundMaterial } );
      return addPhysicsBody.call( this, obj, body, shape );
    }

    function makeCube ( obj ) {
      var body = new CANNON.Body( {
        mass: 1,
        material: this.bodyMaterial,
        fixedRotation: true,
        type: CANNON.Body.STATIC
      } );
      var b = obj.geometry.boundingBox,
          dx = b.max.x - b.min.x,
          dy = b.max.y - b.min.y,
          dz = b.max.z - b.min.z;
      var shape = new CANNON.Box( new CANNON.Vec3( dx / 2, dy / 2, dz / 2 ) );
      return addPhysicsBody.call( this, obj, body, shape );
    }

    function makeBall ( obj, mass, radius, skipObj ) {
      if(mass === undefined){
        mass = 1;
      }
      var body = new CANNON.Body( {
        mass: mass,
        material: this.bodyMaterial,
        fixedRotation: true
      } );
      var shape = new CANNON.Sphere(
          (radius || obj.geometry.boundingSphere.radius ));
      return addPhysicsBody.call( this, obj, body, shape, radius, skipObj );
    }

    this.makeButton = function ( toggle ) {
      var btn = this.buttonFactory.create( toggle );
      this.buttons.push( btn );
      this.scene[btn.name] = btn;
      this.scene.add( btn.base );
      this.scene.add( btn.cap );
      makeCube.call( this, btn.cap );
      return btn;
    };

    function waitForResources ( t ) {
      this.lt = t;
      
      if ( this.camera && this.scene && this.currentUser && this.buttonFactory && this.buttonFactory.template ) {
        this.pointer = textured( sphere( 0.02, 16, 8 ), 0xff6633 );
        this.scene.add(this.pointer);
        this.setSize( );

        if ( this.passthrough ) {
          this.camera.add( this.passthrough.mesh );
        }
        
        if(this.glove){
          this.glove.setEnvironment({
            scene: this.scene,
            camera: this.camera,
            world: this.world
          });

          for ( var i = 0; i < this.glove.numJoints; ++i ) {
            var s = textured( sphere( 0.01, 8, 8 ), 0xff0000 >> i );
            this.scene.add( s );
            this.glove.tips.push( makeBall.call( this, s ) );
          }
        }

        this.fire( "ready" );
        this.animate = this.animate.bind( this );
        requestAnimationFrame( this.animate );
      }
      else {
        requestAnimationFrame( waitForResources.bind( this ) );
      }
    }

    this.start = function () {
      requestAnimationFrame( waitForResources.bind( this ) );
    };

    if(!this.options.sceneModel){
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, this.options.drawDistance);
      this.scene.Camera = this.camera;
      this.scene.add(this.camera);
    }
    else {
      Primrose.ModelLoader.loadScene( this.options.sceneModel, function ( sceneGraph ) {
        this.scene = sceneGraph;
        this.camera = this.scene.Camera;
        this.currentUser.position.copy(this.camera.position);
        this.currentUser.position.y -= this.options.avatarHeight;
        if(!this.options.disablePhysics){
          this.scene.traverse( function ( obj ) {
            if ( obj.isSolid ) {
              if ( obj.isGround ) {
                makePlane.call( this, obj );
              }
              else {
                makeBall.call( this, obj, 1 );
              }
            }
          }.bind( this ) );
        }
      }.bind( this ) );
    }

    window.addEventListener( "resize", this.setSize.bind( this ), false );

    this.renderScene = function ( s, rt, fc ) {
      if ( this.inVR ) {
        this.renderer.renderStereo( s, this.camera, rt, fc,
            translations,
            viewports );
      }
      else {
        this.renderer.render( s, this.camera, rt, fc );
      }
    };

    if(this.options.disableAutoFullScreen){
      if(this.options.regularFullScreenButton){
        this.options.regularFullScreenButton.addEventListener( "click", this.goFullScreen.bind( this ), false );
      }

      if(this.options.vrFullScreenButton){
        this.options.vrFullScreenButton.addEventListener( "click", this.goFullScreen.bind( this ), false );
      }
    }
    else{
      window.addEventListener("mousedown", this.goFullScreen.bind(this), false);
    }
    
    function setVRMode(evt){
      if(this.vr.display){
        this.inVR = isFullScreenMode();
      }
      this.setSize();
    }
    window.addEventListener( "fullscreenchange", setVRMode.bind(this), false);
    window.addEventListener( "webkitfullscreenchange", setVRMode.bind(this), false);
    window.addEventListener( "mozfullscreenchange", setVRMode.bind(this), false);
  }

  inherit( VRApplication, Primrose.ChatApplication );

  VRApplication.DEFAULTS = {
    useLeap: false,
    avatarHeight: 1.75,
    walkSpeed: 3,
    gravity: 0.98, // the acceleration applied to falling objects
    jumpHeight: 0.25,
    backgroundColor: 0xafbfff, // the color that WebGL clears the background with before drawing    
    drawDistance: 500, // the far plane of the camera
    chatTextSize: 0.25, // the size of a single line of text, in world units
    dtNetworkUpdate: 0.125 // the amount of time to allow to elapse between sending state to the server
  };
  
  VRApplication.prototype.goFullScreen = function(){
    this.mouse.requestPointerLock( );
    if(!isFullScreenMode()){
      if(this.vr.display){
        requestFullScreen( this.ctrls.frontBuffer, this.vr.display );
      }
      else{      
        requestFullScreen( this.ctrls.frontBuffer );
      }
    }
  };

  VRApplication.prototype.addEventListener = function ( event, thunk ) {
    if ( this.listeners[event] ) {
      this.listeners[event].push( thunk );
    }
  };

  VRApplication.prototype.fire = function ( name, arg1, arg2, arg3, arg4 ) {
    for ( var i = 0; i < this.listeners[name].length; ++i ) {
      this.listeners[name][i]( arg1, arg2, arg3, arg4 );
    }
  };

  function addCell ( row, elem ) {
    if ( typeof elem === "string" ) {
      elem = document.createTextNode( elem );
    }
    var cell = document.createElement( "td" );
    cell.appendChild( elem );
    row.appendChild( cell );
  }

  VRApplication.prototype.setupModuleEvents = function ( container, module, name ) {
    var eID = name + "Enable",
        tID = name + "Transmit",
        rID = name + "Receive",
        e = document.createElement( "input" ),
        t = document.createElement( "input" ),
        r = document.createElement( "input" ),
        row = document.createElement( "tr" );

    this.ctrls[eID] = e;
    this.ctrls[tID] = t;
    this.ctrls[rID] = r;

    e.id = eID;
    t.id = tID;
    r.id = rID;

    e.type = t.type = r.type = "checkbox";

    e.checked = this.formState[eID];
    t.checked = this.formState[tID];
    r.checked = this.formState[rID];

    e.addEventListener( "change", function () {
      module.enable( e.checked );
      t.disabled = !e.checked;
      if ( t.checked && t.disabled ) {
        t.checked = false;
      }
    } );

    t.addEventListener( "change", function () {
      module.transmit( t.checked );
    } );

    r.addEventListener( "change", function () {
      module.receive( r.checked );
    } );

    container.appendChild( row );
    addCell( row, name );
    addCell( row, e );
    addCell( row, t );
    addCell( row, r );
    if ( module.zeroAxes ) {
      var zID = name + "Zero",
          z = document.createElement( "input" );
      this.ctrls[zID] = z;
      z.id = zID;
      z.type = "checkbox";
      z.checked = this.formState[zID];
      z.addEventListener( "click", module.zeroAxes.bind( module ), false );
      addCell( row, z );
    }
    else {
      r.colspan = 2;
    }

    module.enable( e.checked );
    module.transmit( t.checked );
    module.receive( r.checked );
    t.disabled = !e.checked;
    if ( t.checked && t.disabled ) {
      t.checked = false;
    }
  };

  VRApplication.prototype.setSize = function ( ) {
    var bounds = this.ctrls.frontBuffer.getBoundingClientRect(),
        styleWidth = bounds.width,
        styleHeight = bounds.height,
        ratio = window.devicePixelRatio || 1,
        fieldOfView = 75,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio,
        aspectWidth = canvasWidth;
    
    if ( this.inVR ) {
      canvasWidth = this.vrParams.left.renderRect.width +
          this.vrParams.right.renderRect.width;
      canvasHeight = Math.max( this.vrParams.left.renderRect.height,
          this.vrParams.right.renderRect.height );
      aspectWidth = canvasWidth / 2;
      fieldOfView = ( this.vrParams.left.recommendedFieldOfView.leftDegrees +
          this.vrParams.left.recommendedFieldOfView.rightDegrees );
    }
    this.renderer.domElement.width = canvasWidth;
    this.renderer.domElement.height = canvasHeight;
    this.renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    if(this.camera){
      this.camera.fov = fieldOfView;
      this.camera.aspect = aspectWidth / canvasHeight;
      this.camera.updateProjectionMatrix( );
    }
  };

  VRApplication.prototype.connectGamepad = function ( id ) {
    if ( !this.gamepad.isGamepadSet() && confirm( fmt(
        "Would you like to use this gamepad? \"$1\"", id ) ) ) {
      this.gamepad.setGamepad( id );
    }
  };

  VRApplication.prototype.zero = function () {
    this.currentUser.position.set( 0, 0, 0 );
    this.currentUser.velocity.set( 0, 0, 0 );
    if(this.inVR){
      this.vr.sensor.resetSensor();
    }
  };

  VRApplication.prototype.jump = function () {
    if ( this.onground ) {
      this.currentUser.velocity.y += this.options.jumpHeight;
      this.onground = false;
    }
  };

  VRApplication.prototype.animate = function ( t ) {
    requestAnimationFrame( this.animate );
    var dt = ( t - this.lt ) * 0.001;
    this.lt = t;
    var heading = 0,
        pitch = 0,
        strafe,
        drive,
        len,
        j,
        c;

    this.keyboard.update( dt );
    this.mouse.update( dt );
    this.gamepad.update( dt );
    this.vr.update( dt );

    if(!this.inVR) {
      pitch = this.gamepad.getValue("pitch") + 
          this.mouse.getValue("pitch") ;
    }

    if ( this.onground ) {
      
      heading = this.gamepad.getValue("heading") +
          this.mouse.getValue("heading");

      strafe = this.keyboard.getValue( "strafeRight" ) +
          this.keyboard.getValue( "strafeLeft" ) +
          this.gamepad.getValue( "strafe" );
      
      drive = this.keyboard.getValue( "driveBack" ) +
          this.keyboard.getValue( "driveForward" ) +
          this.gamepad.getValue( "drive" );
      
      if ( strafe || drive ) {
        len = this.walkSpeed * Math.min( 1, 1 / Math.sqrt( drive * drive +
            strafe * strafe ) );
      }
      else {
        len = 0;
      }

      strafe *= len;
      drive *= len;
      len = strafe * Math.cos( heading ) + drive * Math.sin( heading );
      drive = (drive * Math.cos( heading ) - strafe * Math.sin( heading )) * dt;
      strafe = len * dt;
      this.qPitch.setFromAxisAngle( RIGHT, pitch );
      this.currentUser.velocity.x = strafe;
      this.currentUser.velocity.z = drive;
      this.currentUser.quaternion.setFromAxisAngle( UP, heading );
      this.currentUser.quaternion.multiply(this.qPitch);
    }
    else{
      this.currentUser.velocity.y -= this.options.gravity * dt;
    }
    
    this.currentUser.position.add(this.currentUser.velocity);
    if(!this.onground && this.currentUser.position.y < 0){
      this.onground = true;
      this.currentUser.position.y = 0;
      this.currentUser.velocity.y = 0;
    }

    //
    // update the camera
    //
    this.camera.quaternion.copy( this.currentUser.quaternion );
    this.camera.position.copy( this.currentUser.position );

    if ( this.inVR ) {
      var state = this.vr.sensor.getState();

      if ( state.orientation ) {
        this.qRift.copy( state.orientation );
      }
      this.camera.quaternion.multiply( this.qRift );

      if ( state.position ) {
        this.pRift.copy( state.position );
      }
      this.camera.position.add( this.pRift );
    }

    this.camera.position.y += this.avatarHeight;
    
    FORWARD.set(0, 0, -1);
    FORWARD.applyQuaternion(this.camera.quaternion);
    this.pointer.position.copy(this.camera.position);
    this.pointer.position.add(FORWARD);

    //
    // do collision detection
    //
    this.world.step( dt );
    for ( j = 0; j < this.world.bodies.length; ++j ) {
      var obj = this.world.bodies[j];
      if ( obj.graphics ) {
        obj.graphics.position.copy( obj.position );
        obj.graphics.quaternion.copy( obj.quaternion );
      }
    }
    
    for ( j = 0; j < this.buttons.length; ++j ) {
      this.buttons[j].readContacts( this.world.contacts );
    }

    if(this.glove){
      this.glove.readContacts( this.world.contacts );
    }

    this.fire( "update", dt );

    this.renderScene( this.scene );
  };

  return VRApplication;
} )();
;/* global Primrose, io, Window */

Primrose.WebRTCSocket = ( function () {

  /* polyfills */
  Window.prototype.RTCPeerConnection =
      Window.prototype.RTCPeerConnection ||
      Window.prototype.webkitRTCPeerConnection ||
      Window.prototype.mozRTCPeerConnection ||
      function () {
      };
  
  Window.prototype.RTCIceCandidate =
      Window.prototype.RTCIceCandidate ||
      Window.prototype.mozRTCIceCandidate ||
      function () {
      };

  Window.prototype.RTCSessionDescription =
      Window.prototype.RTCSessionDescription ||
      Window.prototype.mozRTCSessionDescription ||
      function () {
      };

  function WebRTCSocket ( proxyServer, isStarHub ) {
    var socket,
        peers = [ ],
        channels = [ ],
        listeners = {},
        myIndex = null;

    function descriptionCreated ( myIndex, theirIndex, description ) {
      description.fromIndex = myIndex;
      description.toIndex = theirIndex;
      peers[theirIndex].setLocalDescription( description, function () {
        socket.emit( description.type, description );
      } );
    }

    function descriptionReceived ( theirIndex, description, thunk ) {
      if ( description.fromIndex === theirIndex ) {
        var remote = new RTCSessionDescription( description );
        peers[theirIndex].setRemoteDescription( remote, thunk );
      }
    }

    if ( typeof ( proxyServer ) === "string" ) {
      socket = io.connect( proxyServer, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 60
      } );
    }
    else if ( proxyServer && proxyServer.on && proxyServer.emit ) {
      socket = proxyServer;
    }
    else {
      console.error( "proxy error", socket );
      throw new Error( "need a socket" );
    }

    function setChannelEvents ( index ) {

      channels[index].addEventListener( "open", function () {
        if ( listeners.open ) {
          for ( var i = 0; i < listeners.open.length; ++i ) {
            var l = listeners.open[i];
            if ( l ) {
              l.call( this );
            }
          }
        }
      }, false );

      channels[index].addEventListener( "message", function ( evt ) {
        var args = JSON.parse( evt.data ),
            key = args.shift();
        if ( listeners[key] ) {
          for ( var i = 0; i < listeners[key].length; ++i ) {
            var l = listeners[key][i];
            if ( l ) {
              l.apply( this, args );
            }
          }
        }
      }, false );

      function connectionLost () {
        channels[index] = null;
        peers[index] = null;
        var closed = ( channels.filter( function ( c ) {
          return c;
        } ).length === 0 );
        if ( closed && listeners.close ) {
          for ( var i = 0; i < listeners.close.length; ++i ) {
            var l = listeners.close[i];
            if ( l ) {
              l.call( this );
            }
          }
        }
      }

      channels[index].addEventListener( "error", connectionLost, false );
      channels[index].addEventListener( "close", connectionLost, false );
    }

    this.on = function ( evt, thunk ) {
      if ( !listeners[evt] ) {
        listeners[evt] = [ ];
      }
      listeners[evt].push( thunk );
    };

    this.emit = function () {
      var data = JSON.stringify( Array.prototype.slice.call( arguments ) );
      for ( var i = 0; i < channels.length; ++i ) {
        var channel = channels[i];
        if ( channel && channel.readyState === "open" ) {
          channel.send( data );
        }
      }
    };

    this.close = function () {
      channels.forEach( function ( channel ) {
        if ( channel && channel.readyState === "open" ) {
          channel.close();
        }
      } );
      peers.forEach( function ( peer ) {
        if ( peer ) {
          peer.close();
        }
      } );
    };

    window.addEventListener( "unload", this.close.bind( this ) );

    this.connect = function ( connectionKey ) {
      socket.emit( "handshake", "peer" );

      socket.on( "handshakeComplete", function ( name ) {
        if ( name === "peer" ) {
          socket.emit( "joinRequest", connectionKey );
        }
      } );
    };

    socket.on( "user", function ( index, theirIndex ) {
      try {
        if ( myIndex === null ) {
          myIndex = index;
        }
        if ( !peers[theirIndex] ) {
          var peer = new RTCPeerConnection( {
            iceServers: [
              "stun.l.google.com:19302",
              "stun1.l.google.com:19302",
              "stun2.l.google.com:19302",
              "stun3.l.google.com:19302",
              "stun4.l.google.com:19302"
            ].map( function ( o ) {
              return {url: "stun:" + o};
            } )
          } );

          peers[theirIndex] = peer;

          peer.addEventListener( "icecandidate", function ( evt ) {
            if ( evt.candidate ) {
              evt.candidate.fromIndex = myIndex;
              evt.candidate.toIndex = theirIndex;
              socket.emit( "ice", evt.candidate );
            }
          }, false );

          socket.on( "ice", function ( ice ) {
            if ( ice.fromIndex === theirIndex ) {
              peers[theirIndex].addIceCandidate( new RTCIceCandidate( ice ) );
            }
          } );

          if ( isStarHub === true || ( isStarHub === undefined && myIndex <
              theirIndex ) ) {
            peer.addEventListener( "negotiationneeded", function ( evt ) {
              peer.createOffer(
                  descriptionCreated.bind( this, myIndex, theirIndex ),
                  console.error.bind( console, "createOffer error" ) );
            } );

            var channel = peer.createDataChannel( "data-channel-" + myIndex +
                "-to-" + theirIndex, {
                  id: myIndex,
                  ordered: false,
                  maxRetransmits: 0
                } );
            channels[theirIndex] = channel;
            setChannelEvents( theirIndex );

            socket.on( "answer", function ( answer ) {
              if ( answer.fromIndex === theirIndex ) {
                descriptionReceived( theirIndex, answer );
              }
            } );
          }
          else if ( isStarHub === false || ( isStarHub === undefined &&
              myIndex > theirIndex ) ) {
            peer.addEventListener( "datachannel", function ( evt ) {
              if ( evt.channel.id === theirIndex ) {
                channels[evt.channel.id] = evt.channel;
                setChannelEvents( theirIndex );
              }
            }, false );

            socket.on( "offer", function ( offer ) {
              if ( offer.fromIndex === theirIndex ) {
                descriptionReceived( theirIndex, offer, function () {
                  peers[theirIndex].createAnswer(
                      descriptionCreated,
                      console.error.bind( console, "createAnswer error" ) );
                } );
              }
            } );
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
      }
    } );
  }
  return WebRTCSocket;
} )();
;/* global Primrose, URL */

Primrose.Workerize = ( function () {
  function Workerize ( func ) {
    // First, rebuild the script that defines the class. Since we're dealing
    // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
    // a conversion at a point post-script reconstruction, pre-workerization.

    // start with the constructor function
    var script = func.toString(),
        // strip out the name in a way that Internet Explorer also undrestands 
        // (IE doesn't have the Function.name property supported by Chrome and
        // Firefox)
        name = script.match( /function (\w+)\(/ )[1],
        k;

    // then rebuild the member methods
    for ( k in func.prototype ) {
      // We preserve some formatting so it's easy to read the code in the debug
      // view. Yes, you'll be able to see the generated code in your browser's
      // debugger.
      script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
    }

    // Automatically instantiate an object out of the class inside the worker,
    // in such a way that the user-defined function won't be able to get to it.
    script += "\n\n(function(){\n  var instance = new " + name + "();";

    // Create a mapper from the events that the class defines to the worker-side
    // postMessage method, to send message to the UI thread that one of the
    // events occured.
    script += "\n  if(instance.addEventListener){\n" +
        "    for(var k in instance.listeners) {\n" +
        "      instance.addEventListener(k, function(){\n" +
        "        var args = Array.prototype.slice.call(arguments);\n" +
        "        postMessage(args);\n" +
        "      }.bind(this, k));\n" +
        "    }\n" +
        "  }";

    // Create a mapper from the worker-side onmessage event, to receive messages
    // from the UI thread that methods were called on the object.
    script += "\n\n  onmessage = function(evt){\n" +
        "    var f = evt.data.shift();\n" +
        "    if(instance[f]){\n" +
        "      instance[f].apply(instance, evt.data);\n" +
        "    }\n" +
        "  }\n\n" +
        "})();";

    // The binary-large-object can be used to convert the script from text to a
    // data URI, because workers can only be created from same-origin URIs.
    this.worker = Workerize.createWorker( script, false );

    // create a mapper from the UI-thread side onmessage event, to receive
    // messages from the worker thread that events occured and pass them on to
    // the UI thread.
    this.listeners = {};
    this.worker.onmessage = function ( e ) {
      var f = e.data.shift();
      if ( this.listeners[f] ) {
        this.listeners[f].forEach( function ( g ) {
          return g.apply( this, e.data );
        } );
      }
    }.bind( this );

    // create mappers from the UI-thread side method calls to the UI-thread side
    // postMessage method, to inform the worker thread that methods were called,
    // with parameters.
    for ( k in func.prototype ) {
      // we skip the addEventListener method because we override it in a
      // different way, to be able to pass messages across the thread boundary.
      if ( k !== "addEventListener" ) {
        // make the name of the function the first argument, no matter what.
        this[k] = this.methodShim.bind( this, k );
      }
    }
  }

  Workerize.prototype.methodShim = function () {
    // convert the varargs array to a real array
    var args = Array.prototype.slice.call( arguments );
    this.worker.postMessage( args );
  };

  // Adding an event listener just registers a function as being ready to
  // receive events, it doesn't do anything with the worker thread yet.
  Workerize.prototype.addEventListener = function ( evt, thunk ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( thunk );
  };

  Workerize.createWorker = function ( script ) {
    var stripFunc = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    if ( typeof script === "function" ) {
      script = script.toString();
    }

    if ( stripFunc ) {
      script = script.trim();
      var start = script.indexOf( '{' );
      script = script.substring( start + 1, script.length - 1 );
    }

    var blob = new Blob( [ script ], {
      type: "text/javascript"
    } ),
        dataURI = URL.createObjectURL( blob );

    return new Worker( dataURI );
  };

  return Workerize;
} )();;function reloadPage () {
  document.location = document.location.href;
}

/*
 * 1) If id is a string, tries to find the DOM element that has said ID
 *      a) if it exists, and it matches the expected tag type, returns the
 *          element, or throws an error if validation fails.
 *      b) if it doesn't exist, creates it and sets its ID to the provided
 *          id, then returns the new DOM element, not yet placed in the
 *          document anywhere.
 * 2) If id is a DOM element, validates that it is of the expected type,
 *      a) returning the DOM element back if it's good,
 *      b) or throwing an error if it is not
 * 3) If id is null, creates the DOM element to match the expected type.
 * @param {string|DOM element|null} id
 * @param {string} tag name
 * @param {function} DOMclass
 * @returns DOM element
 */
function cascadeElement ( id, tag, DOMClass ) {
  var elem = null;
  if ( id === null ) {
    elem = document.createElement( tag );
    elem.id = id = "auto_" + tag + Date.now();
  }
  else if ( DOMClass === undefined || id instanceof DOMClass ) {
    elem = id;
  }
  else if ( typeof ( id ) === "string" ) {
    elem = document.getElementById( id );
    if ( elem === null ) {
      elem = document.createElement( tag );
      elem.id = id;
    }
    else if ( elem.tagName !== tag.toUpperCase() ) {
      elem = null;
    }
  }

  if ( elem === null ) {
    throw new Error( id + " does not refer to a valid " + tag +
        " element." );
  }
  else {
    elem.innerHTML = "";
  }
  return elem;
}

function findEverything ( elem, obj ) {
  elem = elem || document;
  obj = obj || { };
  var arr = elem.querySelectorAll( "*" );
  for ( var i = 0; i < arr.length; ++i ) {
    var e = arr[i];
    if ( e.id && e.id.length > 0 ) {
      obj[e.id] = e;
      if ( e.parentElement ) {
        e.parentElement[e.id] = e;
      }
    }
  }
  return obj;
}

function makeHidingContainer ( id, obj ) {
  var elem = cascadeElement( id, "div", window.HTMLDivElement );
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild( obj );
  return elem;
}



function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
  var elem = cascadeElement( id, "select", window.HTMLSelectElement );
  var items = [ ];
  for ( var key in obj ) {
    if ( obj.hasOwnProperty( key ) ) {
      var val = obj[key];
      if ( !filter || val instanceof filter ) {
        val = val.name || key;
        var opt = document.createElement( "option" );
        opt.innerHTML = val;
        items.push( obj[key] );
        if ( val === def ) {
          opt.selected = "selected";
        }
        elem.appendChild( opt );
      }
    }
  }

  if ( typeof target[prop] === "function" ) {
    elem.addEventListener( "change", function () {
      target[prop]( items[elem.selectedIndex] );
    } );
  }
  else {
    elem.addEventListener( "change", function () {
      target[prop] = items[elem.selectedIndex];
    } );
  }

  var container = cascadeElement( "container -" + id, "div",
      window.HTMLDivElement );
  var label = cascadeElement( "label-" + id, "span",
      window.HTMLSpanElement );
  label.innerHTML = lbl + ": ";
  label.for = elem;
  elem.title = lbl;
  elem.alt = lbl;
  container.appendChild( label );
  container.appendChild( elem );
  return container;
}
;// snagged and adapted from http://detectmobilebrowsers.com/
var isMobile = ( function ( a ) {
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      a ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substring( 0, 4 ) );
} )( navigator.userAgent || navigator.vendor || window.opera ),
    isiOS = /Apple-iP(hone|od|ad)/.test( navigator.userAgent || "" ),
    isOSX = /Macintosh/.test( navigator.userAgent || "" ),
    isWindows = /Windows/.test( navigator.userAgent || "" ),
    isOpera = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0,
    isFirefox = typeof window.InstallTrigger !== 'undefined',
    isSafari = Object.prototype.toString.call( window.HTMLElement )
    .indexOf( 'Constructor' ) > 0,
    isChrome = !!window.chrome && !isOpera,
    isIE = /*@cc_on!@*/false || !!document.documentMode;
;function sigfig ( x, y ) {
  var p = Math.pow( 10, y );
  var v = ( Math.round( x * p ) / p ).toString();
  if ( y > 0 ) {
    var i = v.indexOf( "." );
    if ( i === -1 ) {
      v += ".";
      i = v.length - 1;
    }
    while ( v.length - i - 1 < y )
      v += "0";
  }
  return v;
}

/*
 Replace template place holders in a string with a positional value.
 Template place holders start with a dollar sign ($) and are followed
 by a digit that references the parameter position of the value to
 use in the text replacement. Note that the first position, position 0,
 is the template itself. However, you cannot reference the first position,
 as zero digit characters are used to indicate the width of number to
 pad values out to.

 Numerical precision padding is indicated with a period and trailing
 zeros.

 examples:
 fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
 fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
 fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001)
 => "1.41 + 3.14 = 9001.00"
 fmt("$001.000", Math.PI) => 003.142
 */
var fmt = ( function () {

  function addMillis ( val, txt ) {
    return txt.replace( /( AM| PM|$)/, function ( match, g1 ) {
      return ( val.getMilliseconds() / 1000 ).toString()
          .substring( 1 ) + g1;
    } );
  }

  function fmt ( template ) {
    // - match a dollar sign ($) literally,
    // - (optional) then zero or more zero digit (0) characters, greedily
    // - then one or more digits (the previous rule would necessitate that
    //      the first of these digits be at least one).
    // - (optional) then a period (.) literally
    // -            then one or more zero digit (0) characters
    var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
    var args = arguments;
    if ( typeof template !== "string" ) {
      template = template.toString();
    }
    return template.replace( paramRegex, function ( m, pad, index,
        precision ) {
      index = parseInt( index, 10 );
      if ( 0 <= index && index < args.length ) {
        var val = args[index];
        if ( val !== null && val !== undefined ) {
          if ( val instanceof Date && precision ) {
            switch ( precision.length ) {
              case 1:
                val = val.getYear();
                break;
              case 2:
                val = ( val.getMonth() + 1 ) + "/" + val.getYear();
                break;
              case 3:
                val = val.toLocaleDateString();
                break;
              case 4:
                val = addMillis( val, val.toLocaleTimeString() );
                break;
              case 5:
              case 6:
                val = val.toLocaleString();
                break;
              default:
                val = addMillis( val, val.toLocaleString() );
                break;
            }
            return val;
          }
          else {
            if ( precision && precision.length > 0 ) {
              val = sigfig( val, precision.length );
            }
            else {
              val = val.toString();
            }
            if ( pad && pad.length > 0 ) {
              var paddingRegex = new RegExp( "^\\d{" + ( pad.length + 1 ) +
                  "}(\\.\\d+)?" );
              while ( !paddingRegex.test( val ) ) {
                val = "0" + val;
              }
            }
            return val;
          }
        }
      }
      return undefined;
    } );
  }
  return fmt;
} )();

var px = fmt.bind( this, "$1px" ),
    pct = fmt.bind( this, "$1%" ),
    ems = fmt.bind( this, "$1em" ),
    rgb = fmt.bind(this, "rgb($1, $2, $3)"),
    rgba = fmt.bind(this, "rgba($1, $2, $3, $4)"),
    hsl = fmt.bind(this, "hsl($1, $2, $3)"),
    hsla = fmt.bind(this, "hsla($1, $2, $3, $4)");
;function getSetting ( name, defValue ) {
  if ( window.localStorage ) {
    var val = window.localStorage.getItem( name );
    if ( val ) {
      try {
        return JSON.parse( val );
      }
      catch ( exp ) {
        console.error( "getSetting", name, val, typeof ( val ), exp );
      }
    }
  }
  return defValue;
}

function setSetting ( name, val ) {
  if ( window.localStorage && val ) {
    try {
      window.localStorage.setItem( name, JSON.stringify( val ) );
    }
    catch ( exp ) {
      console.error( "setSetting", name, val, typeof ( val ), exp );
    }
  }
}

function deleteSetting ( name ) {
  if ( window.localStorage ) {
    window.localStorage.removeItem( name );
  }
}

function readForm ( ctrls ) {
  var state = { };
  if ( ctrls ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( ( c.tagName === "INPUT" || c.tagName === "SELECT" ) &&
          ( !c.dataset || !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
          state[name] = c.value;
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}

function writeForm ( ctrls, state ) {
  if ( state ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( state[name] !== null && state[name] !== undefined &&
          ( c.tagName ===
              "INPUT" || c.tagName === "SELECT" ) && ( !c.dataset ||
          !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
          c.value = state[name];
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          c.checked = state[name];
        }
      }
    }
  }
}
;/* global isMobile, help */
// fullscreen-isms
function isFullScreenMode () {
  return ( document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement );
}

function requestFullScreen ( elem, vrDisplay ) {
  var fullScreenParam;

  if ( vrDisplay ) {
    fullScreenParam = {vrDisplay: vrDisplay};
  }

  if ( elem.webkitRequestFullscreen && fullScreenParam ) {
    elem.webkitRequestFullscreen( fullScreenParam );
  }
  else if ( elem.webkitRequestFullscreen && !fullScreenParam ) {
    elem.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
  }
  else if ( elem.mozRequestFullScreen ) {
    elem.mozRequestFullScreen( fullScreenParam );
  }
  else if ( elem.requestFullscreen ) {
    elem.requestFullscreen();
  }
  else if ( elem.msRequestFullscreen ) {
    elem.msRequestFullscreen();
  }
}

function exitFullScreen () {
  if ( isFullScreenMode() ) {
    document.exitFullscreen();
  }
}

function toggleFullScreen ( elem, vrDisplay ) {
  if ( isFullScreenMode() ) {
    exitFullScreen();
  }
  else {
    requestFullScreen( elem, vrDisplay );
  }
}

function addFullScreenShim ( elems ) {
  elems = elems.map( function ( e ) {
    return {
      elem: e,
      events: help( e ).events
    };
  } );

  function removeFullScreenShim () {
    elems.forEach( function ( elem ) {
      elem.events.forEach( function ( e ) {
        elem.removeEventListener( e, fullScreenShim );
      } );
    } );
  }

  function fullScreenShim ( evt ) {
    requestFullScreen( removeFullScreenShim );
  }

  elems.forEach( function ( elem ) {
    elem.events.forEach( function ( e ) {
      if ( e.indexOf( "fullscreenerror" ) < 0 ) {
        elem.addEventListener( e, fullScreenShim, false );
      }
    } );
  } );
}
;/* global THREE, Primrose */
var findVR = ( function () {
  "use strict";

  function gotVRDevices ( thunk, devices ) {
    var vrDisplay,
        vrSensor;
    for ( var i = 0; i < devices.length; ++i ) {
      var device = devices[i];
      if ( device instanceof window.HMDVRDevice ) {
        vrDisplay = device;
      }
      else if ( device instanceof window.PositionSensorVRDevice ) {
        vrSensor = device;
      }
      if ( vrSensor && vrDisplay ) {
        break;
      }
    }
    thunk( vrDisplay, vrSensor );
  }

  function findVR ( thunk ) {
    if ( navigator.getVRDevices ) {
      navigator.getVRDevices()
          .then( gotVRDevices.bind( window, thunk ) )
          .catch( thunk );
    } else if ( navigator.mozGetVRDevices ) {
      navigator.mozGetVRDevices( gotVRDevices.bind( window, thunk ) );
    }
    else {
      thunk();
    }
  }
  return findVR;
} )();

function InsideSphereGeometry ( radius, widthSegments, heightSegments,
    phiStart, phiLength, thetaStart, thetaLength ) {
  "use strict";

  THREE.Geometry.call( this );

  this.type = 'InsideSphereGeometry';

  this.parameters = {
    radius: radius,
    widthSegments: widthSegments,
    heightSegments: heightSegments,
    phiStart: phiStart,
    phiLength: phiLength,
    thetaStart: thetaStart,
    thetaLength: thetaLength
  };

  radius = radius || 50;

  widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
  heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

  phiStart = phiStart !== undefined ? phiStart : 0;
  phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

  thetaStart = thetaStart !== undefined ? thetaStart : 0;
  thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

  var x,
      y,
      vertices = [ ],
      uvs = [ ];

  for ( y = 0; y <= heightSegments; y++ ) {

    var verticesRow = [ ];
    var uvsRow = [ ];

    for ( x = widthSegments; x >= 0; x-- ) {

      var u = x / widthSegments;

      var v = y / heightSegments;

      var vertex = new THREE.Vector3();
      vertex.x = -radius * Math.cos( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );
      vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
      vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin(
          thetaStart + v * thetaLength );

      this.vertices.push( vertex );

      verticesRow.push( this.vertices.length - 1 );
      uvsRow.push( new THREE.Vector2( 1 - u, 1 - v ) );

    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

  }

  for ( y = 0; y < heightSegments; y++ ) {

    for ( x = 0; x < widthSegments; x++ ) {

      var v1 = vertices[ y ][ x + 1 ];
      var v2 = vertices[ y ][ x ];
      var v3 = vertices[ y + 1 ][ x ];
      var v4 = vertices[ y + 1 ][ x + 1 ];

      var n1 = this.vertices[ v1 ].clone()
          .normalize();
      var n2 = this.vertices[ v2 ].clone()
          .normalize();
      var n3 = this.vertices[ v3 ].clone()
          .normalize();
      var n4 = this.vertices[ v4 ].clone()
          .normalize();

      var uv1 = uvs[ y ][ x + 1 ].clone();
      var uv2 = uvs[ y ][ x ].clone();
      var uv3 = uvs[ y + 1 ][ x ].clone();
      var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

      if ( Math.abs( this.vertices[ v1 ].y ) === radius ) {

        uv1.x = ( uv1.x + uv2.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

      } else if ( Math.abs( this.vertices[ v3 ].y ) === radius ) {

        uv3.x = ( uv3.x + uv4.x ) / 2;
        this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

      } else {

        this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

        this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3,
          n4.clone() ] ) );
        this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

      }

    }

  }

  this.computeFaceNormals();

  this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

}
if ( typeof window.THREE !== "undefined" ) {

  InsideSphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
  InsideSphereGeometry.prototype.constructor = InsideSphereGeometry;
}

function axis ( length, width ) {
  var center = hub();
  put( brick( 0xff0000, length, width, width ) )
      .on( center );
  put( brick( 0x00ff00, width, width, length ) )
      .on( center );
  put( brick( 0x0000ff, width, length, width ) )
      .on( center );
  return center;
}

function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry( w, h, l );
}

function light ( color, intensity, distance, decay ) {
  return new THREE.PointLight( color, intensity, distance, decay );
}

function v3 ( x, y, z ) {
  return new THREE.Vector3( x, y, z );
}

function quad ( w, h, s, t ) {
  if ( h === undefined ) {
    h = w;
  }
  return new THREE.PlaneBufferGeometry( w, h );
}

function hub ( ) {
  return new THREE.Object3D( );
}

function brick ( txt, w, h, l ) {
  return textured( box( w || 1, h || 1, l || 1 ), txt, false, 1, w, l );
}

function put ( object ) {
  return {
    on: function ( s ) {
      s.add( object );
      return {
        at: function ( x, y, z ) {
          object.position.set( x, y, z );
          return object;
        }
      };
    }
  };
}

function textured ( geometry, txt, unshaded, o, s, t ) {
  var material;
  if ( o === undefined ) {
    o = 1;
  }

  if ( typeof txt === "number" ) {
    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        transparent: true,
        color: txt,
        opacity: o,
        shading: THREE.FlatShading
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        transparent: true,
        color: txt,
        opacity: o
      } );
    }
  }
  else {
    var texture;
    if ( typeof txt === "string" ) {
      texture = THREE.ImageUtils.loadTexture( txt );
    }
    else if ( txt instanceof Primrose.Text.Controls.TextBox ) {
      texture = txt.getRenderer( )
          .getTexture( );
    }
    else {
      texture = txt;
    }

    if ( unshaded ) {
      material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }
    else {
      material = new THREE.MeshLambertMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: o
      } );
    }

    if ( s * t > 1 ) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set( s, t );
    }
  }

  var obj = null;
  if ( geometry.type.indexOf( "Geometry" ) > -1 ) {
    obj = new THREE.Mesh( geometry, material );
  }
  else if ( geometry instanceof THREE.Object3D ) {
    geometry.material = material;
    obj = geometry;
  }

  if ( txt instanceof Primrose.Text.Controls.TextBox ) {
    obj.editor = txt;
  }

  return obj;
}

function sphere ( r, slices, rings ) {
  return new THREE.SphereGeometry( r, slices, rings );
}

function shell ( r, slices, rings, phi, theta ) {
  if ( phi === undefined ) {
    phi = Math.PI * 0.5;
  }
  if ( theta === undefined ) {
    theta = Math.PI * 0.5;
  }
  var phiStart = Math.PI + phi * 0.5,
      thetaStart = ( Math.PI - theta ) * 0.5,
      geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
          thetaStart, theta, true );
  return geom;
}

function makeEditor ( scene, pickingScene, id, w, h, x, y, z, rx, ry, rz, options ) {
  options.size = options.size || new Primrose.Text.Size( 1024 * w, 1024 * h );
  options.fontSize = options.fontSize || 30;
  options.theme = options.theme || Primrose.Text.Themes.Dark;
  options.tokenizer = options.tokenizer || Primrose.Text.Grammars.PlainText;
  if ( options.opacity === undefined ) {
    options.opacity = 1;
  }
  var t = new Primrose.Text.Controls.TextBox( id, options ),
      cellWidth = Math.round(1024 * w / options.fontSize),
      cellHeight = Math.round(1024 * h / options.fontSize),
      makeGeom = ( id === "textEditor" ) ? shell.bind( this, 1, cellWidth, cellHeight ) : quad.bind( this, w, h, cellWidth, cellHeight ),
      o = textured( makeGeom(), t, true, options.opacity ),
      p = textured( makeGeom(), t.getRenderer( )
          .getPickingTexture( ), true );
  o.position.set( x, y, z );
  o.rotation.set( rx, ry, rz );
  p.position.set( x, y, z );
  p.rotation.set( rx, ry, rz );
  scene.add( o );
  pickingScene.add( p );
  return o;
}
;function help ( obj ) {
  var funcs = { },
      props = { },
      evnts = [ ];
  
  if ( obj ) {
    for ( var field in obj ) {
      if ( field.indexOf( "on" ) === 0 && ( obj !== navigator || field !==
          "onLine" ) ) {
        // `online` is a known element that is not an event, but looks like
        // an event to the most basic assumption.
        evnts.push( field.substring( 2 ) );
      }
      else if ( typeof ( obj[field] ) === "function" ) {
        funcs[field] = obj[field];
      }
      else {
        props[field] = obj[field];
      }
    }

    var type = typeof ( obj );
    if ( type === "function" ) {
      type = obj.toString()
          .match( /(function [^(]*)/ )[1];
    }
    else if ( type === "object" ) {
      type = null;
      if ( obj.constructor && obj.constructor.name ) {
        type = obj.constructor.name;
      }
      else {
        var q = [ { prefix: "", obj: window } ];
        var traversed = [ ];
        while ( q.length > 0 && type === null ) {
          var parentObject = q.shift();
          parentObject.___traversed___ = true;
          traversed.push( parentObject );
          for ( field in parentObject.obj ) {
            var testObject = parentObject.obj[field];
            if ( testObject ) {
              if ( typeof ( testObject ) === "function" ) {
                if ( testObject.prototype && obj instanceof testObject ) {
                  type = parentObject.prefix + field;
                  break;
                }
              }
              else if ( !testObject.___tried___ ) {
                q.push( { prefix: parentObject.prefix + field + ".",
                  obj: testObject } );
              }
            }
          }
        }
        traversed.forEach( function ( o ) {
          delete o.___traversed___;
        } );
      }
    }
    
    obj = {
      type: type,
      events: evnts,
      functions: funcs,
      properties: props
    };

    return obj;
  }
  else {
    console.warn( "Object was falsey." );
  }
}
;var TAU = 2 * Math.PI;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  if(max === undefined){
    max = min;
    min = 0;
  }
  return Math.floor(randomRange(min, max));
}

function randomSteps(min, max, steps) {
  return min + randomInt(0, (1 + max - min) / steps) * steps;
}

function isNumber ( str ) {
  return !isNaN( str );
};function copyObject ( dest, source ) {
  var stack = [ { dest: dest, source: source } ];
  while ( stack.length > 0 ) {
    var frame = stack.pop();
    source = frame.source;
    dest = frame.dest;
    for ( var key in source ) {
      if ( source.hasOwnProperty( key ) ) {
        if ( typeof ( source[key] ) !== "object" ) {
          dest[key] = source[key];
        }
        else {
          if ( !dest[key] ) {
            dest[key] = { };
          }
          stack.push( { dest: dest[key], source: source[key] } );
        }
      }
    }
  }
}

function inherit ( classType, parentType ) {
  classType.prototype = Object.create( parentType.prototype );
  classType.prototype.constructor = classType;
}
;/* global Primrose */

function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( outElem, elemArr, evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Text.Keys[evt.keyCode];
  this.value = this.value.toLocaleLowerCase()
      .replace( "arrow", "" );
  this.blur( );
  var text = elemArr.map( function ( e ) {
    return e.value.toLocaleUpperCase();
  } )
      .join( ", " );
  if ( text.length === 10 ) {
    text = text.replace( /, /g, "" );
  }
  outElem.innerHTML = text;
}

function setupKeyOption ( outElem, elemArr, index, char, code ) {
  var elem = elemArr[index];
  elem.value = char.toLocaleLowerCase( );
  elem.dataset.keycode = code;
  elem.addEventListener( "keydown", clearKeyOption );
  elem.addEventListener( "keyup", setKeyOption.bind( elem, outElem, elemArr ) );
}

function combineDefaults(a, b){
  var c = {}, k;
  for(k in a){
    c[k] = a[k];
  }
  for(k in b){
    if(!c.hasOwnProperty(k)){
      c[k] = b[k];
    }
  }
  return c;
}
;function makeURL ( url, queryMap ) {
  var output = [ ];
  for ( var key in queryMap ) {
    if ( queryMap.hasOwnProperty( key ) &&
        typeof queryMap[key] !== "function" ) {
      output.push( encodeURIComponent( key ) + "=" + encodeURIComponent(
          queryMap[key] ) );
    }
  }
  return url + "?" + output.join( "&" );
}

function XHR ( url, method, type, progress, error, success, data ) {
  var xhr = new XMLHttpRequest();
  xhr.onerror = error;
  xhr.onabort = error;
  xhr.onprogress = progress;
  xhr.onload = function () {
    if ( xhr.status < 400 ) {
      if ( success ) {
        success( xhr.response );
      }
    }
    else if ( error ) {
      error();
    }
  };

  xhr.open( method, url );
  if ( type ) {
    xhr.responseType = type;
  }
  if ( data ) {
    xhr.setRequestHeader( "Content-Type",
        "application/json;charset=UTF-8" );
    xhr.send( JSON.stringify( data ) );
  }
  else {
    xhr.send();
  }
}

function GET ( url, type, progress, error, success ) {
  type = type || "text";

  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "GET", type, progressThunk, errorThunk, successThunk );
}

function POST ( url, data, type, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "POST", type, progressThunk, errorThunk, successThunk, data );
}

function getObject ( url, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  GET( url, "json", progressThunk, errorThunk, successThunk );
}

function sendObject ( url, data, progress, error, success ) {
  POST( url, data, "json",
      success && error && progress,
      ( success && error ) || ( error && progress ),
      success || error || progress );
}
;/* global Primrose */

Primrose.Input.ButtonAndAxis = ( function () {
  function ButtonAndAxisInput ( name, commands, socket, oscope, offset, axes ) {
    this.offset = offset || 0;
    Primrose.NetworkedInput.call( this, name, commands, socket, oscope );
    this.inputState.axes = [ ];
    this.inputState.buttons = [ ];
    this.axisNames = axes || [ ];
    this.commandNames = this.commands.map( function ( c ) {
      return c.name;
    } );

    for ( var i = 0; i < this.axisNames.length; ++i ) {
      this.inputState.axes[i] = 0;
    }

    this.setDeadzone = this.setProperty.bind( this, "deadzone" );
    this.setScale = this.setProperty.bind( this, "scale" );
    this.setDT = this.setProperty.bind( this, "dt" );
    this.setMin = this.setProperty.bind( this, "min" );
    this.setMax = this.setProperty.bind( this, "max" );
    this.setOffset = this.setProperty.bind( this, "offset" );

    this.addMetaKey = this.addToArray.bind( this, "metaKeys" );
    this.addAxis = this.addToArray.bind( this, "axes" );
    this.addButton = this.addToArray.bind( this, "buttons" );

    this.removeMetaKey = this.removeFromArray.bind( this, "metaKeys" );
    this.removeAxis = this.removeFromArray.bind( this, "axes" );
    this.removeButton = this.removeFromArray.bind( this, "buttons" );

    this.invertAxis = this.invertInArray.bind( this, "axes" );
    this.invertButton = this.invertInArray.bind( this, "buttons" );
    this.invertMetaKey = this.invertInArray.bind( this, "metaKeys" );
  }

  inherit( ButtonAndAxisInput, Primrose.NetworkedInput );

  ButtonAndAxisInput.inherit = function ( classFunc ) {
    inherit( classFunc, ButtonAndAxisInput );
    if ( classFunc.AXES ) {
      classFunc.AXES.forEach( function ( name, i ) {
        classFunc[name] = i + 1;
      } );
    }
  };

  ButtonAndAxisInput.prototype.getAxis = function ( name ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      var value = this.inputState.axes[i] || 0;
      return value;
    }
    return null;
  };

  ButtonAndAxisInput.prototype.setAxis = function ( name, value ) {
    var i = this.axisNames.indexOf( name );
    if ( i > -1 ) {
      this.inPhysicalUse = true;
      this.inputState.axes[i] = value;
    }
  };

  ButtonAndAxisInput.prototype.setButton = function ( index, pressed ) {
    this.inPhysicalUse = true;
    this.inputState.buttons[index] = pressed;
  };

  ButtonAndAxisInput.prototype.getValue = function ( name ) {
    var i = this.commandNames.indexOf( name );
    return ( ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        this.commandState[name].value ) || 0;
  };

  ButtonAndAxisInput.prototype.isDown = function ( name ) {
    var i = this.commandNames.indexOf( name );
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        this.commandState[name].pressed;
  };

  ButtonAndAxisInput.prototype.isUp = function ( name ) {
    var i = this.commandNames.indexOf( name );
    return ( this.enabled || ( this.receiving && this.socketReady ) ) &&
        i > -1 &&
        !this.commands[i].disabled &&
        this.commandState[name] &&
        !this.commandState[name].pressed;
  };

  ButtonAndAxisInput.prototype.maybeClone = function ( arr ) {
    var output = [ ];
    if ( arr ) {
      for ( var i = 0; i < arr.length; ++i ) {
        output[i] = {
          index: Math.abs( arr[i] ) - this.offset,
          toggle: arr[i] < 0,
          sign: ( arr[i] < 0 ) ? -1 : 1
        };
      }
    }
    return output;
  };

  ButtonAndAxisInput.prototype.cloneCommand = function ( cmd ) {
    return {
      name: cmd.name,
      disabled: !!cmd.disabled,
      dt: cmd.dt || 0,
      deadzone: cmd.deadzone || 0,
      threshold: cmd.threshold || 0,
      repetitions: cmd.repetitions || 1,
      scale: cmd.scale,
      offset: cmd.offset,
      min: cmd.min,
      max: cmd.max,
      integrate: cmd.integrate || false,
      delta: cmd.delta || false,
      axes: this.maybeClone( cmd.axes ),
      commands: cmd.commands && cmd.commands.slice() || [ ],
      buttons: this.maybeClone( cmd.buttons ),
      metaKeys: this.maybeClone( cmd.metaKeys ),
      commandDown: cmd.commandDown,
      commandUp: cmd.commandUp
    };
  };

  ButtonAndAxisInput.prototype.evalCommand = function ( cmd, cmdState,
      metaKeysSet, dt ) {
    if ( metaKeysSet ) {
      var pressed = true,
          value = 0,
          n, v;

      if ( cmd.buttons ) {
        for ( n = 0; n < cmd.buttons.length; ++n ) {
          var b = cmd.buttons[n];
          var p = !!this.inputState.buttons[b.index];
          v = p ? b.sign : 0;
          pressed = pressed && ( p && !b.toggle || !p && b.toggle );
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      if ( cmd.axes ) {
        for ( n = 0; n < cmd.axes.length; ++n ) {
          var a = cmd.axes[n];
          v = a.sign * this.inputState.axes[a.index];
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      if ( cmd.commands ) {
        for ( n = 0; n < cmd.commands.length; ++n ) {
          v = this.getValue( cmd.commands[n] );
          if ( Math.abs( v ) > Math.abs( value ) ) {
            value = v;
          }
        }
      }

      if ( cmd.scale !== undefined ) {
        value *= cmd.scale;
      }

      if ( cmd.offset !== undefined ) {
        value += cmd.offset;
      }

      if ( cmd.deadzone && Math.abs( value ) < cmd.deadzone ) {
        value = 0;
      }

      if ( cmd.integrate ) {
        value = this.getValue( cmd.name ) + value * dt;
      }
      else if ( cmd.delta ) {
        var ov = value;
        if ( cmdState.lv !== undefined ) {
          value = value - cmdState.lv;
        }
        cmdState.lv = ov;
      }

      if ( cmd.min !== undefined ) {
        value = Math.max( cmd.min, value );
      }

      if ( cmd.max !== undefined ) {
        value = Math.min( cmd.max, value );
      }

      if ( cmd.threshold ) {
        pressed = pressed && ( value > cmd.threshold );
      }

      cmdState.pressed = pressed;
      cmdState.value = value;
    }
  };

  return ButtonAndAxisInput;
} )();
;/* global Primrose, MediaStreamTrack, THREE, Navigator */

Primrose.Input.Camera = ( function () {

  /* polyfill */
  Navigator.prototype.getUserMedia =
      Navigator.prototype.getUserMedia ||
      Navigator.prototype.webkitGetUserMedia ||
      Navigator.prototype.mozGetUserMedia ||
      Navigator.prototype.msGetUserMedia ||
      Navigator.prototype.oGetUserMedia ||
      function () {
      };

  function CameraInput ( elem, id, size, x, y, z, options ) {
    MediaStreamTrack.getSources( function ( infos ) {
      var option = document.createElement( "option" );
      option.value = "";
      option.innerHTML = "-- select camera --";
      elem.appendChild( option );
      for ( var i = 0; i < infos.length; ++i ) {
        if ( infos[i].kind === "video" ) {
          option = document.createElement( "option" );
          option.value = infos[i].id;
          option.innerHTML = fmt( "[Facing: $1] [ID: $2...]",
              infos[i].facing ||
              "N/A", infos[i].id.substring( 0, 8 ) );
          option.selected = infos[i].id === id;
          elem.appendChild( option );
        }
      }
    } );

    this.options = combineDefaults( options, CameraInput );
    this.videoElement = document.createElement( "video" );
    this.buffer = document.createElement( "canvas" );
    this.gfx = this.buffer.getContext( "2d" );
    this.texture = new THREE.Texture( this.buffer );
    var material = new THREE.MeshBasicMaterial( {
      map: this.texture,
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    } );

    this.gfx.width = 500;
    this.gfx.height = 500;
    this.gfx.fillStyle = "white";
    this.gfx.fillRect( 0, 0, 500, 500 );

    var geometry = new THREE.PlaneGeometry( size, size );
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.set( x, y, z );

    this.streaming = false;
    this.videoElement.autoplay = 1;
    var getUserMediaFallthrough = function ( vidOpt, success, err ) {
      navigator.getUserMedia( {video: vidOpt}, function ( stream ) {
        streamURL = window.URL.createObjectURL( stream );
        this.videoElement.src = streamURL;
        success();
      }.bind( this ), err );
    }.bind( this );

    var tryModesFirstThen = function ( source, err, i ) {
      i = i || 0;
      if ( this.options.videoModes && i < this.options.videoModes.length ) {
        var mode = this.options.videoModes[i];
        var opt = {optional: [ {sourceId: source} ]};
        if ( mode !== "default" ) {
          opt.mandatory = {
            minWidth: mode.w,
            minHeight: mode.h
          };
          mode = fmt( "[w:$1, h:$2]", mode.w, mode.h );
        }
        getUserMediaFallthrough( opt, function () {
          console.log( fmt( "Connected to camera at mode $1.", mode ) );
        }, function ( err ) {
          console.error( fmt( "Failed to connect at mode $1. Reason: $2", mode,
              err ) );
          tryModesFirstThen( source, err, i + 1 );
        } );
      }
      else {
        err( "no video modes specified." );
      }
    }.bind( this );

    this.videoElement.addEventListener( "canplay", function () {
      if ( !this.streaming ) {
        this.streaming = true;
      }
    }.bind( this ), false );

    this.videoElement.addEventListener( "playing", function () {
      this.videoElement.height = this.buffer.height = this.videoElement.videoHeight;
      this.videoElement.width = this.buffer.width = this.videoElement.videoWidth;
      var aspectRatio = this.videoElement.videoWidth /
          this.videoElement.videoHeight;
      this.mesh.scale.set( aspectRatio, 1, 1 );
    }.bind( this ), false );

    this.connect = function ( source ) {
      if ( this.streaming ) {
        try {
          if ( window.stream ) {
            window.stream.stop();
          }
          this.videoElement.src = null;
          this.streaming = false;
        }
        catch ( err ) {
          console.error( "While stopping", err );
        }
      }

      tryModesFirstThen( source, function ( err ) {
        console.error( fmt(
            "Couldn't connect at requested resolutions. Reason: $1", err ) );
        getUserMediaFallthrough( true,
            console.log.bind( console,
                "Connected to camera at default resolution" ),
            console.error.bind( console, "Final connect attempt" ) );
      } );
    }.bind( this );

    if ( id ) {
      this.connect( id );
    }
  }

  CameraInput.DEFAULTS = {
    videoModes: [
      {w: 320, h: 240},
      {w: 640, h: 480},
      "default"
    ]
  };

  CameraInput.prototype.update = function () {
    this.gfx.drawImage( this.videoElement, 0, 0 );
    this.texture.needsUpdate = true;
  };
  return CameraInput;
} )();
;/* global Primrose */

Primrose.Input.Gamepad = ( function () {
  function GamepadInput ( name, commands, socket, oscope, gpid ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, oscope, 1,
        GamepadInput.AXES, true );
    var connectedGamepads = [ ],
        listeners = {
          gamepadconnected: [ ],
          gamepaddisconnected: [ ]
        };

    this.superUpdate = this.update;

    this.checkDevice = function ( pad ) {
      var i;
      for ( i = 0; i < pad.buttons.length; ++i ) {
        this.setButton( i, pad.buttons[i].pressed );
      }
      for ( i = 0; i < pad.axes.length; ++i ) {
        this.setAxis( GamepadInput.AXES[i], pad.axes[i] );
      }
    };

    this.update = function ( dt ) {
      var pads,
          currentPads = [ ],
          i;

      if ( navigator.getGamepads ) {
        pads = navigator.getGamepads();
      }
      else if ( navigator.webkitGetGamepads ) {
        pads = navigator.webkitGetGamepads();
      }

      if ( pads ) {
        for ( i = 0; i < pads.length; ++i ) {
          var pad = pads[i];
          if ( pad ) {
            if ( connectedGamepads.indexOf( pad.id ) === -1 ) {
              connectedGamepads.push( pad.id );
              onConnected( pad.id );
            }
            if ( pad.id === gpid ) {
              this.checkDevice( pad );
            }
            currentPads.push( pad.id );
          }
        }
      }

      for ( i = connectedGamepads.length - 1; i >= 0; --i ) {
        if ( currentPads.indexOf( connectedGamepads[i] ) === -1 ) {
          onDisconnected( connectedGamepads[i] );
          connectedGamepads.splice( i, 1 );
        }
      }

      this.superUpdate( dt );
    };

    function add ( arr, val ) {
      if ( arr.indexOf( val ) === -1 ) {
        arr.push( val );
      }
    }

    function remove ( arr, val ) {
      var index = arr.indexOf( val );
      if ( index > -1 ) {
        arr.splice( index, 1 );
      }
    }

    function sendAll ( arr, id ) {
      for ( var i = 0; i < arr.length; ++i ) {
        arr[i]( id );
      }
    }

    function onConnected ( id ) {
      sendAll( listeners.gamepadconnected, id );
    }

    function onDisconnected ( id ) {
      sendAll( listeners.gamepaddisconnected, id );
    }

    this.getErrorMessage = function () {
      return errorMessage;
    };

    this.setGamepad = function ( id ) {
      gpid = id;
      this.inPhysicalUse = true;
    };

    this.clearGamepad = function () {
      gpid = null;
      this.inPhysicalUse = false;
    };

    this.isGamepadSet = function () {
      return !!gpid;
    };

    this.getConnectedGamepads = function () {
      return connectedGamepads.slice();
    };

    this.addEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        listeners[event].push( handler );
      }
      if ( event === "gamepadconnected" ) {
        connectedGamepads.forEach( onConnected );
      }
    };

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( listeners[event] ) {
        remove( listeners[event], handler );
      }
    };

    try {
      this.update( 0 );
      available = true;
    }
    catch ( err ) {
      avaliable = false;
      errorMessage = err;
    }
  }

  GamepadInput.AXES = [ "LSX", "LSY", "RSX", "RSY" ];
  Primrose.Input.ButtonAndAxis.inherit( GamepadInput );
  return GamepadInput;
} )();
;/* global Primrose */

Primrose.Input.Keyboard = ( function () {

  function KeyboardInput ( name, DOMElement, commands, socket, oscope ) {
    DOMElement = DOMElement || window;

    for ( var i = 0; i < commands.length; ++i ) {
      var cmd = commands[i];
      if ( cmd.preamble ) {
        cmd.commandUp = makeCommand( this, cmd.commandUp );
      }
    }

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket,
        oscope, 0, 0 );

    var textEntry = false,
        onTextEntry = null,
        text = null,
        insertionPoint = null;

    function makeCommand ( thisObj, cmd ) {
      return function ( update ) {
        textEntry = true;
        text = "";
        insertionPoint = 0;
        onTextEntry = update;
        onTextEntry( false, "|" );
        this.enable( false );
      }.bind( thisObj, cmd.commandUp );
    }

    function execute ( stateChange, event ) {
      if ( textEntry && stateChange ) {
        if ( event.keyCode === KeyboardInput.ENTER ||
            event.keyCode === KeyboardInput.ESCAPE ) {
          textEntry = false;
          if ( event.keyCode === KeyboardInput.ENTER ) {
            onTextEntry( true, text );
          }
          onTextEntry( false, null );
          this.enable( true );
        }
        else {
          var key = event.keyCode;
          if ( key === KeyboardInput.BACKSPACE ) {
            text = text.substring( 0, insertionPoint - 1 ) + text.substring(
                insertionPoint );
            --insertionPoint;
          }
          else if ( key === KeyboardInput.DELETE ) {
            text = text.substring( 0, insertionPoint ) + text.substring(
                insertionPoint + 1 );
          }
          else if ( key === KeyboardInput.LEFTARROW ) {
            --insertionPoint;
          }
          else if ( key === KeyboardInput.RIGHTARROW ) {
            ++insertionPoint;
          }
          else if ( key === KeyboardInput.HOME ) {
            insertionPoint = 0;
          }
          else if ( key === KeyboardInput.END ) {
            insertionPoint = text.length;
          }
          else if ( event.shiftKey && KeyboardInput.UPPERCASE[key] ) {
            text = text.substring( 0, insertionPoint ) +
                KeyboardInput.UPPERCASE[key] + text.substring(
                insertionPoint );
            ++insertionPoint;
          }
          else if ( !event.shiftKey && KeyboardInput.LOWERCASE[key] ) {
            text = text.substring( 0, insertionPoint ) +
                KeyboardInput.LOWERCASE[key] + text.substring(
                insertionPoint );
            ++insertionPoint;
          }
          else {
            console.log( event.keyCode );
          }

          insertionPoint = Math.max( 0, Math.min( text.length,
              insertionPoint ) );
          onTextEntry( false, text.substring( 0, insertionPoint ) + "|" +
              text.substring( insertionPoint ) );
          event.preventDefault();
        }
      }
      else {
        this.setButton( event.keyCode, stateChange );
      }
    }

    DOMElement.addEventListener( "keydown", execute.bind( this, true ),
        false );
    DOMElement.addEventListener( "keyup", execute.bind( this, false ), false );
  }

  Primrose.Input.ButtonAndAxis.inherit( KeyboardInput );

  KeyboardInput.BACKSPACE = 8;
  KeyboardInput.TAB = 9;
  KeyboardInput.ENTER = 13;
  KeyboardInput.SHIFT = 16;
  KeyboardInput.CTRL = 17;
  KeyboardInput.ALT = 18;
  KeyboardInput.PAUSEBREAK = 19;
  KeyboardInput.CAPSLOCK = 20;
  KeyboardInput.ESCAPE = 27;
  KeyboardInput.SPACEBAR = 32;
  KeyboardInput.PAGEUP = 33;
  KeyboardInput.PAGEDOWN = 34;
  KeyboardInput.END = 35;
  KeyboardInput.HOME = 36;
  KeyboardInput.LEFTARROW = 37;
  KeyboardInput.UPARROW = 38;
  KeyboardInput.RIGHTARROW = 39;
  KeyboardInput.DOWNARROW = 40;
  KeyboardInput.INSERT = 45;
  KeyboardInput.DELETE = 46;
  KeyboardInput.NUMBER0 = 48;
  KeyboardInput.NUMBER1 = 49;
  KeyboardInput.NUMBER2 = 50;
  KeyboardInput.NUMBER3 = 51;
  KeyboardInput.NUMBER4 = 52;
  KeyboardInput.NUMBER5 = 53;
  KeyboardInput.NUMBER6 = 54;
  KeyboardInput.NUMBER7 = 55;
  KeyboardInput.NUMBER8 = 56;
  KeyboardInput.NUMBER9 = 57;
  KeyboardInput.A = 65;
  KeyboardInput.B = 66;
  KeyboardInput.C = 67;
  KeyboardInput.D = 68;
  KeyboardInput.E = 69;
  KeyboardInput.F = 70;
  KeyboardInput.G = 71;
  KeyboardInput.H = 72;
  KeyboardInput.I = 73;
  KeyboardInput.J = 74;
  KeyboardInput.K = 75;
  KeyboardInput.L = 76;
  KeyboardInput.M = 77;
  KeyboardInput.N = 78;
  KeyboardInput.O = 79;
  KeyboardInput.P = 80;
  KeyboardInput.Q = 81;
  KeyboardInput.R = 82;
  KeyboardInput.S = 83;
  KeyboardInput.T = 84;
  KeyboardInput.U = 85;
  KeyboardInput.V = 86;
  KeyboardInput.W = 87;
  KeyboardInput.X = 88;
  KeyboardInput.Y = 89;
  KeyboardInput.Z = 90;
  KeyboardInput.LEFTWINDOWKEY = 91;
  KeyboardInput.RIGHTWINDOWKEY = 92;
  KeyboardInput.SELECTKEY = 93;
  KeyboardInput.NUMPAD0 = 96;
  KeyboardInput.NUMPAD1 = 97;
  KeyboardInput.NUMPAD2 = 98;
  KeyboardInput.NUMPAD3 = 99;
  KeyboardInput.NUMPAD4 = 100;
  KeyboardInput.NUMPAD5 = 101;
  KeyboardInput.NUMPAD6 = 102;
  KeyboardInput.NUMPAD7 = 103;
  KeyboardInput.NUMPAD8 = 104;
  KeyboardInput.NUMPAD9 = 105;
  KeyboardInput.MULTIPLY = 106;
  KeyboardInput.ADD = 107;
  KeyboardInput.SUBTRACT = 109;
  KeyboardInput.DECIMALPOINT = 110;
  KeyboardInput.DIVIDE = 111;
  KeyboardInput.F1 = 112;
  KeyboardInput.F2 = 113;
  KeyboardInput.F3 = 114;
  KeyboardInput.F4 = 115;
  KeyboardInput.F5 = 116;
  KeyboardInput.F6 = 117;
  KeyboardInput.F7 = 118;
  KeyboardInput.F8 = 119;
  KeyboardInput.F9 = 120;
  KeyboardInput.F10 = 121;
  KeyboardInput.F11 = 122;
  KeyboardInput.F12 = 123;
  KeyboardInput.NUMLOCK = 144;
  KeyboardInput.SCROLLLOCK = 145;
  KeyboardInput.SEMICOLON = 186;
  KeyboardInput.EQUALSIGN = 187;
  KeyboardInput.COMMA = 188;
  KeyboardInput.DASH = 189;
  KeyboardInput.PERIOD = 190;
  KeyboardInput.FORWARDSLASH = 191;
  KeyboardInput.GRAVEACCENT = 192;
  KeyboardInput.OPENBRACKET = 219;
  KeyboardInput.BACKSLASH = 220;
  KeyboardInput.CLOSEBRACKET = 221;
  KeyboardInput.SINGLEQUOTE = 222;

  KeyboardInput.LOWERCASE = { };
  KeyboardInput.LOWERCASE[KeyboardInput.A] = "a";
  KeyboardInput.LOWERCASE[KeyboardInput.B] = "b";
  KeyboardInput.LOWERCASE[KeyboardInput.C] = "c";
  KeyboardInput.LOWERCASE[KeyboardInput.D] = "d";
  KeyboardInput.LOWERCASE[KeyboardInput.E] = "e";
  KeyboardInput.LOWERCASE[KeyboardInput.F] = "f";
  KeyboardInput.LOWERCASE[KeyboardInput.G] = "g";
  KeyboardInput.LOWERCASE[KeyboardInput.H] = "h";
  KeyboardInput.LOWERCASE[KeyboardInput.I] = "i";
  KeyboardInput.LOWERCASE[KeyboardInput.J] = "j";
  KeyboardInput.LOWERCASE[KeyboardInput.K] = "k";
  KeyboardInput.LOWERCASE[KeyboardInput.L] = "l";
  KeyboardInput.LOWERCASE[KeyboardInput.M] = "m";
  KeyboardInput.LOWERCASE[KeyboardInput.N] = "n";
  KeyboardInput.LOWERCASE[KeyboardInput.O] = "o";
  KeyboardInput.LOWERCASE[KeyboardInput.P] = "p";
  KeyboardInput.LOWERCASE[KeyboardInput.Q] = "q";
  KeyboardInput.LOWERCASE[KeyboardInput.R] = "r";
  KeyboardInput.LOWERCASE[KeyboardInput.S] = "s";
  KeyboardInput.LOWERCASE[KeyboardInput.T] = "t";
  KeyboardInput.LOWERCASE[KeyboardInput.U] = "u";
  KeyboardInput.LOWERCASE[KeyboardInput.V] = "v";
  KeyboardInput.LOWERCASE[KeyboardInput.W] = "w";
  KeyboardInput.LOWERCASE[KeyboardInput.X] = "x";
  KeyboardInput.LOWERCASE[KeyboardInput.Y] = "y";
  KeyboardInput.LOWERCASE[KeyboardInput.Z] = "z";
  KeyboardInput.LOWERCASE[KeyboardInput.SPACEBAR] = " ";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER0] = "0";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER1] = "1";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER2] = "2";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER3] = "3";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER4] = "4";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER5] = "5";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER6] = "6";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER7] = "7";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER8] = "8";
  KeyboardInput.LOWERCASE[KeyboardInput.NUMBER9] = "9";
  KeyboardInput.LOWERCASE[KeyboardInput.MULTIPLY] = "*";
  KeyboardInput.LOWERCASE[KeyboardInput.ADD] = "+";
  KeyboardInput.LOWERCASE[KeyboardInput.SUBTRACT] = "-";
  KeyboardInput.LOWERCASE[KeyboardInput.DECIMALPOINT] = ".";
  KeyboardInput.LOWERCASE[KeyboardInput.DIVIDE] = "/";
  KeyboardInput.LOWERCASE[KeyboardInput.SEMICOLON] = ";";
  KeyboardInput.LOWERCASE[KeyboardInput.EQUALSIGN] = "=";
  KeyboardInput.LOWERCASE[KeyboardInput.COMMA] = ",";
  KeyboardInput.LOWERCASE[KeyboardInput.DASH] = "-";
  KeyboardInput.LOWERCASE[KeyboardInput.PERIOD] = ".";
  KeyboardInput.LOWERCASE[KeyboardInput.FORWARDSLASH] = "/";
  KeyboardInput.LOWERCASE[KeyboardInput.GRAVEACCENT] = "`";
  KeyboardInput.LOWERCASE[KeyboardInput.OPENBRACKET] = "[";
  KeyboardInput.LOWERCASE[KeyboardInput.BACKSLASH] = "\\";
  KeyboardInput.LOWERCASE[KeyboardInput.CLOSEBRACKET] = "]";
  KeyboardInput.LOWERCASE[KeyboardInput.SINGLEQUOTE] = "'";

  KeyboardInput.UPPERCASE = { };
  KeyboardInput.UPPERCASE[KeyboardInput.A] = "A";
  KeyboardInput.UPPERCASE[KeyboardInput.B] = "B";
  KeyboardInput.UPPERCASE[KeyboardInput.C] = "C";
  KeyboardInput.UPPERCASE[KeyboardInput.D] = "D";
  KeyboardInput.UPPERCASE[KeyboardInput.E] = "E";
  KeyboardInput.UPPERCASE[KeyboardInput.F] = "F";
  KeyboardInput.UPPERCASE[KeyboardInput.G] = "G";
  KeyboardInput.UPPERCASE[KeyboardInput.H] = "H";
  KeyboardInput.UPPERCASE[KeyboardInput.I] = "I";
  KeyboardInput.UPPERCASE[KeyboardInput.J] = "J";
  KeyboardInput.UPPERCASE[KeyboardInput.K] = "K";
  KeyboardInput.UPPERCASE[KeyboardInput.L] = "L";
  KeyboardInput.UPPERCASE[KeyboardInput.M] = "M";
  KeyboardInput.UPPERCASE[KeyboardInput.N] = "N";
  KeyboardInput.UPPERCASE[KeyboardInput.O] = "O";
  KeyboardInput.UPPERCASE[KeyboardInput.P] = "P";
  KeyboardInput.UPPERCASE[KeyboardInput.Q] = "Q";
  KeyboardInput.UPPERCASE[KeyboardInput.R] = "R";
  KeyboardInput.UPPERCASE[KeyboardInput.S] = "S";
  KeyboardInput.UPPERCASE[KeyboardInput.T] = "T";
  KeyboardInput.UPPERCASE[KeyboardInput.U] = "U";
  KeyboardInput.UPPERCASE[KeyboardInput.V] = "V";
  KeyboardInput.UPPERCASE[KeyboardInput.W] = "W";
  KeyboardInput.UPPERCASE[KeyboardInput.X] = "X";
  KeyboardInput.UPPERCASE[KeyboardInput.Y] = "Y";
  KeyboardInput.UPPERCASE[KeyboardInput.Z] = "Z";
  KeyboardInput.UPPERCASE[KeyboardInput.SPACEBAR] = " ";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER0] = ")";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER1] = "!";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER2] = "@";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER3] = "#";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER4] = "$";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER5] = "%";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER6] = "^";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER7] = "&";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER8] = "*";
  KeyboardInput.UPPERCASE[KeyboardInput.NUMBER9] = "(";
  KeyboardInput.UPPERCASE[KeyboardInput.MULTIPLY] = "*";
  KeyboardInput.UPPERCASE[KeyboardInput.ADD] = "+";
  KeyboardInput.UPPERCASE[KeyboardInput.SUBTRACT] = "-";
  KeyboardInput.UPPERCASE[KeyboardInput.DECIMALPOINT] = ".";
  KeyboardInput.UPPERCASE[KeyboardInput.DIVIDE] = "/";
  KeyboardInput.UPPERCASE[KeyboardInput.SEMICOLON] = ":";
  KeyboardInput.UPPERCASE[KeyboardInput.EQUALSIGN] = "+";
  KeyboardInput.UPPERCASE[KeyboardInput.COMMA] = "<";
  KeyboardInput.UPPERCASE[KeyboardInput.DASH] = "_";
  KeyboardInput.UPPERCASE[KeyboardInput.PERIOD] = ">";
  KeyboardInput.UPPERCASE[KeyboardInput.FORWARDSLASH] = "?";
  KeyboardInput.UPPERCASE[KeyboardInput.GRAVEACCENT] = "~";
  KeyboardInput.UPPERCASE[KeyboardInput.OPENBRACKET] = "{";
  KeyboardInput.UPPERCASE[KeyboardInput.BACKSLASH] = "|";
  KeyboardInput.UPPERCASE[KeyboardInput.CLOSEBRACKET] = "}";
  KeyboardInput.UPPERCASE[KeyboardInput.SINGLEQUOTE] = "\"";
  return KeyboardInput;
} )();
;/* global Primrose, requestAnimationFrame, Leap */

Primrose.Input.LeapMotion = ( function () {
  function processFingerParts ( i ) {
    return LeapMotionInput.FINGER_PARTS.map( function ( p ) {
      return "FINGER" + i + p.toUpperCase();
    } );
  }

  function LeapMotionInput ( name, commands, socket, oscope ) {
    this.isStreaming = false;
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket,
        oscope, 1,
        LeapMotionInput.AXES );
    this.controller = new Leap.Controller( { enableGestures: true } );
  }

  LeapMotionInput.COMPONENTS = [ "X", "Y", "Z" ];
  LeapMotionInput.NUM_HANDS = 2;
  LeapMotionInput.NUM_FINGERS = 10;
  LeapMotionInput.FINGER_PARTS = [ "tip", "dip", "pip", "mcp", "carp" ];
  LeapMotionInput.AXES = [ "X0", "Y0", "Z0",
    "X1", "Y1", "Z1",
    "FINGER0TIPX", "FINGER0TIPY",
    "FINGER0DIPX", "FINGER0DIPY",
    "FINGER0PIPX", "FINGER0PIPY",
    "FINGER0MCPX", "FINGER0MCPY",
    "FINGER0CARPX", "FINGER0CARPY",
    "FINGER1TIPX", "FINGER1TIPY",
    "FINGER1DIPX", "FINGER1DIPY",
    "FINGER1PIPX", "FINGER1PIPY",
    "FINGER1MCPX", "FINGER1MCPY",
    "FINGER1CARPX", "FINGER1CARPY",
    "FINGER2TIPX", "FINGER2TIPY",
    "FINGER2DIPX", "FINGER2DIPY",
    "FINGER2PIPX", "FINGER2PIPY",
    "FINGER2MCPX", "FINGER2MCPY",
    "FINGER2CARPX", "FINGER2CARPY",
    "FINGER3TIPX", "FINGER3TIPY",
    "FINGER3DIPX", "FINGER3DIPY",
    "FINGER3PIPX", "FINGER3PIPY",
    "FINGER3MCPX", "FINGER3MCPY",
    "FINGER3CARPX", "FINGER3CARPY",
    "FINGER4TIPX", "FINGER4TIPY",
    "FINGER4DIPX", "FINGER4DIPY",
    "FINGER4PIPX", "FINGER4PIPY",
    "FINGER4MCPX", "FINGER4MCPY",
    "FINGER4CARPX", "FINGER4CARPY",
    "FINGER5TIPX", "FINGER5TIPY",
    "FINGER5DIPX", "FINGER5DIPY",
    "FINGER5PIPX", "FINGER5PIPY",
    "FINGER5MCPX", "FINGER5MCPY",
    "FINGER5CARPX", "FINGER5CARPY",
    "FINGER6TIPX", "FINGER6TIPY",
    "FINGER6DIPX", "FINGER6DIPY",
    "FINGER6PIPX", "FINGER6PIPY",
    "FINGER6MCPX", "FINGER6MCPY",
    "FINGER6CARPX", "FINGER6CARPY",
    "FINGER7TIPX", "FINGER7TIPY",
    "FINGER7DIPX", "FINGER7DIPY",
    "FINGER7PIPX", "FINGER7PIPY",
    "FINGER7MCPX", "FINGER7MCPY",
    "FINGER7CARPX", "FINGER7CARPY",
    "FINGER8TIPX", "FINGER8TIPY",
    "FINGER8DIPX", "FINGER8DIPY",
    "FINGER8PIPX", "FINGER8PIPY",
    "FINGER8MCPX", "FINGER8MCPY",
    "FINGER8CARPX", "FINGER8CARPY",
    "FINGER9TIPX", "FINGER9TIPY",
    "FINGER9DIPX", "FINGER9DIPY",
    "FINGER9PIPX", "FINGER9PIPY",
    "FINGER9MCPX", "FINGER9MCPY",
    "FINGER9CARPX", "FINGER9CARPY" ];

  Primrose.Input.ButtonAndAxis.inherit( LeapMotionInput );

  LeapMotionInput.CONNECTION_TIMEOUT = 5000;
  LeapMotionInput.prototype.E = function ( e, f ) {
    if ( f ) {
      this.controller.on( e, f );
    }
    else {
      this.controller.on( e, console.log.bind( console,
          "Leap Motion Event: " + e ) );
    }
  };

  LeapMotionInput.prototype.start = function ( gameUpdateLoop ) {
    if ( this.isEnabled() ) {
      var canceller = null,
          startAlternate = null;
      if ( gameUpdateLoop ) {
        var alternateLooper = function ( t ) {
          requestAnimationFrame( alternateLooper );
          gameUpdateLoop( t );
        };
        startAlternate = requestAnimationFrame.bind( window,
            alternateLooper );
        var timeout = setTimeout( startAlternate,
            LeapMotionInput.CONNECTION_TIMEOUT );
        canceller = function () {
          clearTimeout( timeout );
          this.isStreaming = true;
        }.bind( this );
        this.E( "deviceStreaming", canceller );
        this.E( "streamingStarted", canceller );
        this.E( "streamingStopped", startAlternate );
      }
      this.E( "connect" );
      //this.E("protocol");
      this.E( "deviceStopped" );
      this.E( "disconnect" );
      this.E( "frame", this.setState.bind( this, gameUpdateLoop ) );
      this.controller.connect();
    }
  };

  LeapMotionInput.prototype.setState = function ( gameUpdateLoop, frame ) {
    var prevFrame = this.controller.history.get( 1 ),
        i,
        j;
    if ( !prevFrame || frame.hands.length !== prevFrame.hands.length ) {
      for ( i = 0; i < this.commands.length; ++i ) {
        this.enable( this.commands[i].name, frame.hands.length > 0 );
      }
    }

    for ( i = 0; i < frame.hands.length; ++i ) {
      var hand = frame.hands[i].palmPosition;
      var handName = "HAND" + i;
      for ( j = 0; j < LeapMotionInput.COMPONENTS.length; ++j ) {
        this.setAxis( handName + LeapMotionInput.COMPONENTS[j], hand[j] );
      }
    }

    for ( i = 0; i < frame.fingers.length; ++i ) {
      var finger = frame.fingers[i];
      var fingerName = "FINGER" + i;
      for ( j = 0; j < LeapMotionInput.FINGER_PARTS.length; ++j ) {
        var joint = finger[LeapMotionInput.FINGER_PARTS[j] + "Position"];
        var jointName = fingerName +
            LeapMotionInput.FINGER_PARTS[j].toUpperCase();
        for ( var k = 0; k < LeapMotionInput.COMPONENTS.length; ++k ) {
          this.setAxis( jointName + LeapMotionInput.COMPONENTS[k],
              joint[k] );
        }
      }
    }

    if ( gameUpdateLoop ) {
      gameUpdateLoop( frame.timestamp * 0.001 );
    }
  };
  return LeapMotionInput;
} )();
;/* global Primrose */
Primrose.Input.Location = ( function () {
  function LocationInput ( name, commands, socket, options, oscope ) {
    this.options = combineDefaults( options, LocationInput );
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, oscope, 1,
        LocationInput.AXES );
    this.available = !!navigator.geolocation;
    if ( this.available ) {
      navigator.geolocation.watchPosition(
          this.setState.bind( this ),
          function () {
            this.available = false;
          }.bind( this ),
          this.options );
    }
  }
  LocationInput.AXES = [ "LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING",
    "SPEED" ];
  Primrose.Input.ButtonAndAxis.inherit( LocationInput );

  LocationInput.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  LocationInput.prototype.setState = function ( location ) {
    for ( var p in location.coords ) {
      var k = p.toUpperCase();
      if ( LocationInput.AXES.indexOf( k ) > -1 ) {
        this.setAxis( k, location.coords[p] );
      }
    }
  };
  return LocationInput;
} )();
;/* global Primrose */

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

  function MotionInput ( name, commands, socket, oscope ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket,
        oscope, 1, MotionInput.AXES );

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
;/* global Primrose */

Primrose.Input.Mouse = ( function () {
  function MouseInput ( name, DOMElement, commands, socket, oscope ) {
    DOMElement = DOMElement || window;
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket,
        oscope, 1, MouseInput.AXES );

    this.setLocation = function ( x, y ) {
      this.setAxis( "X", x );
      this.setAxis( "Y", y );
    };

    this.setMovement = function ( dx, dy ) {
      this.setAxis( "X", dx + this.getAxis( "X" ) );
      this.setAxis( "Y", dy + this.getAxis( "Y" ) );
    };

    this.readEvent = function ( event ) {
      if ( MouseInput.isPointerLocked() ) {
        var mx = event.movementX,
            my = event.movementY;

        if ( mx === undefined ) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setMovement( mx, my );
      }
      else {
        this.setLocation( event.clientX, event.clientY );
      }
    };

    DOMElement.addEventListener( "mousedown", function ( event ) {
      this.setButton( event.button, true );
      this.readEvent( event );
    }.bind( this ), false );

    DOMElement.addEventListener( "mouseup", function ( event ) {
      this.setButton( event.button, false );
      this.readEvent( event );
    }.bind( this ), false );

    DOMElement.addEventListener( "mousemove", this.readEvent.bind( this ),
        false );

    DOMElement.addEventListener( "mousewheel", function ( event ) {
      this.setAxis( "Z", this.getAxis( "Z" ) + event.wheelDelta );
      this.readEvent( event );
    }.bind( this ), false );

    this.addEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.addEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.addEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.addEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.removeEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.removeEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.removeEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    DOMElement.requestPointerLock = DOMElement.requestPointerLock ||
        DOMElement.webkitRequestPointerLock ||
        DOMElement.mozRequestPointerLock ||
        function () {
        };

    this.requestPointerLock = function () {
      if ( !MouseInput.isPointerLocked() ) {
        DOMElement.requestPointerLock();
      }
    };

    this.exitPointerLock = ( document.webkitExitPointerLock ||
        document.mozExitPointerLock ||
        document.exitPointerLock ||
        function () {
        } ).bind( document );

    this.togglePointerLock = function () {
      if ( MouseInput.isPointerLocked() ) {
        this.exitPointerLock();
      }
      else {
        this.requestPointerLock();
      }
    };
  }

  MouseInput.isPointerLocked = function () {
    return !!( document.pointerLockElement ||
        document.webkitPointerLockElement ||
        document.mozPointerLockElement );
  };
  MouseInput.AXES = [ "X", "Y", "Z" ];
  Primrose.Input.ButtonAndAxis.inherit( MouseInput );
  return MouseInput;
} )();
;/* global Primrose */

Primrose.Input.Speech = ( function () {
  /*
   Class: SpeechInput

   Connects to a the webkitSpeechRecognition API and manages callbacks based on
   keyword sets related to the callbacks. Note that the webkitSpeechRecognition
   API requires a network connection, as the processing is done on an external
   server.

   Constructor: new SpeechInput(name, commands, socket);

   The `name` parameter is used when transmitting the commands through the command
   proxy server.

   The `commands` parameter specifies a collection of keywords tied to callbacks
   that will be called when one of the keywords are heard. Each callback can
   be associated with multiple keywords, to be able to increase the accuracy
   of matches by combining words and phrases that sound similar.

   Each command entry is a simple object following the pattern:

   {
   "keywords": ["phrase no. 1", "phrase no. 2", ...],
   "command": <callbackFunction>
   }

   The `keywords` property is an array of strings for which SpeechInput will
   listen. If any of the words or phrases in the array matches matches the heard
   command, the associated callbackFunction will be executed.

   The `command` property is the callback function that will be executed. It takes no
   parameters.

   The `socket` (optional) parameter is a WebSocket connecting back to the command
   proxy server.

   Methods:
   `start()`: starts the command unrecognition, unless it's not available, in which
   case it prints a message to the console error log. Returns true if the running
   state changed. Returns false otherwise.

   `stop()`: uhm... it's like start, but it's called stop.

   `isAvailable()`: returns true if the setup process was successful.

   `getErrorMessage()`: returns the Error object that occured when setup failed, or
   null if setup was successful. */
  function SpeechInput ( name, commands, socket, oscope ) {
    Primrose.NetworkedInput.call( this, name, commands, socket,
        oscope );
    var running = false,
        recognition = null,
        errorMessage = null;

    function warn () {
      var msg = fmt( "Failed to initialize speech engine. Reason: $1",
          errorMessage.message );
      console.error( msg );
      return false;
    }

    function start () {
      if ( !available ) {
        return warn();
      }
      else if ( !running ) {
        running = true;
        recognition.start();
        return true;
      }
      return false;
    }

    function stop () {
      if ( !available ) {
        return warn();
      }
      if ( running ) {
        recognition.stop();
        return true;
      }
      return false;
    }

    this.check = function () {
      if ( this.enabled && !running ) {
        start();
      }
      else if ( !this.enabled && running ) {
        stop();
      }
    };

    this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if ( window.SpeechRecognition ) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      }
      else {
        // purposefully don't check the existance so it errors out and setup fails.
        recognition = new webkitSpeechRecognition();
      }
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      var restart = false;
      recognition.addEventListener( "start", function () {
        console.log( "speech started" );
        command = "";
      }.bind( this ), true );

      recognition.addEventListener( "error", function ( event ) {
        restart = true;
        console.log( "speech error", event );
        running = false;
        command = "speech error";
      }.bind( this ), true );

      recognition.addEventListener( "end", function () {
        console.log( "speech ended", arguments );
        running = false;
        command = "speech ended";
        if ( restart ) {
          restart = false;
          this.enable( true );
        }
      }.bind( this ), true );

      recognition.addEventListener( "result", function ( event ) {
        var newCommand = [ ];
        var result = event.results[event.resultIndex];
        var max = 0;
        var maxI = -1;
        if ( result && result.isFinal ) {
          for ( var i = 0; i < result.length; ++i ) {
            var alt = result[i];
            if ( alt.confidence > max ) {
              max = alt.confidence;
              maxI = i;
            }
          }
        }

        if ( max > 0.85 ) {
          newCommand.push( result[maxI].transcript.trim() );
        }

        newCommand = newCommand.join( " " );

        if ( newCommand !== this.inputState ) {
          this.inputState.text = newCommand;
        }
      }.bind( this ), true );

      available = true;
    }
    catch ( err ) {
      errorMessage = err;
      available = false;
    }
  }

  inherit( SpeechInput, Primrose.NetworkedInput );

  SpeechInput.maybeClone = function ( arr ) {
    return ( arr && arr.slice() ) || [ ];
  };

  SpeechInput.prototype.cloneCommand = function ( cmd ) {
    return {
      name: cmd.name,
      preamble: cmd.preamble,
      keywords: SpeechInput.maybeClone( cmd.keywords ),
      commandUp: cmd.commandUp,
      disabled: cmd.disabled
    };
  };

  SpeechInput.prototype.evalCommand = function ( cmd, cmdState,
      metaKeysSet, dt ) {
    if ( metaKeysSet && this.inputState.text ) {
      for ( var i = 0; i < cmd.keywords.length; ++i ) {
        if ( this.inputState.text.indexOf( cmd.keywords[i] ) === 0 &&
            ( cmd.preamble || cmd.keywords[i].length ===
            this.inputState.text.length ) ) {
          cmdState.pressed = true;
          cmdState.value = this.inputState.text.substring(
              cmd.keywords[i].length )
              .trim();
          this.inputState.text = null;
        }
      }
    }
  };

  SpeechInput.prototype.enable = function ( k, v ) {
    Primrose.NetworkedInput.prototype.enable.call( this, k, v );
    this.check();
  };

  SpeechInput.prototype.transmit = function ( v ) {
    Primrose.NetworkedInput.prototype.transmit.call( this, v );
    this.check();
  };
  return SpeechInput;
} )();
;/* global Primrose */

Primrose.Input.Touch = ( function () {
  function TouchInput ( name, DOMElement, buttonBounds, commands, socket,
      oscope ) {
    DOMElement = DOMElement || window;
    buttonBounds = buttonBounds || [ ];
    for ( var i = buttonBounds.length - 1; i >= 0; --i ) {
      var b = buttonBounds[i];
      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;
    }

    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, oscope, 1,
        TouchInput.AXES );

    function setState ( stateChange, setAxis, event ) {
      var touches = stateChange ? event.touches : event.changedTouches;
      for ( var i = 0; i < touches.length && i < TouchInput.NUM_FINGERS;
          ++i ) {
        var t = touches[i];
        if ( setAxis ) {
          for ( var j = 0; j < buttonBounds.length; ++j ) {
            this.setButton( j, false );
            var b = buttonBounds[j];
            if ( b.x <= t.pageX && t.pageX < b.x2 &&
                b.y <= t.pageY && t.pageY < b.y2 ) {
              this.setButton( j, stateChange );
            }
          }
          this.setAxis( "X" + i, t.pageX );
          this.setAxis( "Y" + i, t.pageY );
        }
        else {
          this.setAxis( "LX" + i, t.pageX );
          this.setAxis( "LY" + i, t.pageY );
        }
      }
      event.preventDefault();
    }

    DOMElement.addEventListener( "touchstart", setState.bind( this, true,
        false ), false );
    DOMElement.addEventListener( "touchend", setState.bind( this, false,
        true ), false );
    DOMElement.addEventListener( "touchmove", setState.bind( this, true,
        true ), false );
  }

  TouchInput.NUM_FINGERS = 10;
  TouchInput.AXES = [ ];
  for ( var i = 0; i < TouchInput.NUM_FINGERS; ++i ) {
    TouchInput.AXES.push( "X" + i );
    TouchInput.AXES.push( "Y" + i );
  }
  Primrose.Input.ButtonAndAxis.inherit( TouchInput );
  return TouchInput;
} )();
;/* global Primrose, HMDVRDevice, PositionSensorVRDevice */
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
;/* global Primrose, Window */

Primrose.Output.Audio3D = ( function () {

  /* polyfill */
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  function Audio3D () {

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();
      this.mainVolume.connect( this.context.destination );

      this.setPosition = this.context.listener.setPosition.bind(
          this.context.listener );
      this.setVelocity = this.context.listener.setVelocity.bind(
          this.context.listener );
      this.setOrientation = this.context.listener.setOrientation.bind(
          this.context.listener );
      this.isAvailable = true;
    }
    catch ( exp ) {
      this.isAvailable = false;
      this.setPosition = function () {
      };
      this.setVelocity = function () {
      };
      this.setOrientation = function () {
      };
      this.error = exp;
      console.error( "AudioContext not available. Reason: ", exp.message );
    }
  }

  Audio3D.prototype.loadBuffer = function ( src, progress, success ) {
    if ( !success ) {
      throw new Error(
          "You need to provide a callback function for when the audio finishes loading" );
    }

    // just overlook the lack of progress indicator
    if ( !progress ) {
      progress = function () {
      };
    }

    var error = function () {
      progress( "error", src );
    };

    if ( this.isAvailable ) {
      progress( "loading", src );
      var xhr = new XMLHttpRequest();
      xhr.open( "GET", src );
      xhr.responseType = "arraybuffer";
      xhr.onerror = error;
      xhr.onabort = error;
      xhr.onprogress = function ( evt ) {
        progress( "intermediate", src, evt.loaded );
      };
      xhr.onload = function () {
        if ( xhr.status < 400 ) {
          progress( "success", src );
          this.context.decodeAudioData( xhr.response, success, error );
        }
        else {
          error();
        }
      }.bind( this );
      xhr.send();
    }
    else {
      error();
    }
  };

  Audio3D.prototype.loadBufferCascadeSrcList = function ( srcs, progress,
      success, index ) {
    index = index || 0;
    if ( index === srcs.length ) {
      if ( progress ) {
        srcs.forEach( function ( s ) {
          progress( "error", s );
        } );
      }
    }
    else {
      var userSuccess = success,
          userProgress = progress;
      success = function ( buffer ) {
        if ( userProgress ) {
          for ( var i = index + 1; i < srcs.length; ++i ) {
            console.log( "Skipping loading alternate file [" + srcs[i] +
                "]. [" + srcs[index] + "] has already loaded." );
            userProgress( "skip", srcs[i], "[" + srcs[index] +
                "] has already loaded." );
          }
        }
        if ( userSuccess ) {
          userSuccess( buffer );
        }
      };
      progress = function ( type, file, data ) {
        if ( userProgress ) {
          userProgress( type, file, data );
        }
        if ( type === "error" ) {
          console.warn( "Failed to decode " + srcs[index] );
          setTimeout( this.loadBufferCascadeSrcList.bind( this, srcs,
              userProgress, userSuccess, index + 1 ), 0 );
        }
      };
      this.loadBuffer( srcs[index], progress, success );
    }
  };

  Audio3D.prototype.createRawSound = function ( pcmData, success ) {
    if ( pcmData.length !== 1 && pcmData.length !== 2 ) {
      throw new Error( "Incorrect number of channels. Expected 1 or 2, got " +
          pcmData.length );
    }

    var frameCount = pcmData[0].length;
    if ( pcmData.length > 1 && pcmData[1].length !== frameCount ) {
      throw new Error(
          "Second channel is not the same length as the first channel. Expected " +
          frameCount + ", but was " + pcmData[1].length );
    }

    var buffer = this.context.createBuffer( pcmData.length, frameCount, this.sampleRate );
    for ( var c = 0; c < pcmData.length; ++c ) {
      var channel = buffer.getChannelData( c );
      for ( var i = 0; i < frameCount; ++i ) {
        channel[i] = pcmData[c][i];
      }
    }
    success( buffer );
  };

  Audio3D.prototype.createSound = function ( loop, success, buffer ) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect( snd.volume );
    success( snd );
  };

  Audio3D.prototype.create3DSound = function ( x, y, z, success, snd ) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition( x, y, z );
    snd.panner.connect( this.mainVolume );
    snd.volume.connect( snd.panner );
    success( snd );
  };

  Audio3D.prototype.createFixedSound = function ( success, snd ) {
    snd.volume.connect( this.mainVolume );
    success( snd );
  };

  Audio3D.prototype.loadSound = function ( src, loop, progress, success ) {
    this.loadBuffer( src, progress, this.createSound.bind( this, loop,
        success ) );
  };

  Audio3D.prototype.loadSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadBufferCascadeSrcList( srcs, progress, this.createSound.bind( this,
        loop, success ) );
  };

  Audio3D.prototype.load3DSound = function ( src, loop, x, y, z, progress, success ) {
    this.loadSound( src, loop, progress, this.create3DSound.bind( this, x, y,
        z, success ) );
  };

  Audio3D.prototype.load3DSoundCascadeSrcList = function ( srcs, loop, x, y, z, progress, success ) {
    this.loadSoundCascadeSrcList()( srcs, loop, progress,
        this.create3DSound.bind( this, x, y, z, success ) );
  };

  Audio3D.prototype.loadFixedSound = function ( src, loop, progress, success ) {
    this.loadSound( src, loop, progress, this.createFixedSound.bind( this,
        success ) );
  };

  Audio3D.prototype.loadFixedSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadSoundCascadeSrcList( srcs, loop, progress,
        this.createFixedSound.bind( this, success ) );
  };

  Audio3D.prototype.playBufferImmediate = function ( buffer, volume ) {
    this.createSound( false, this.createFixedSound.bind( this, function (
        snd ) {
      snd.volume.gain.value = volume;
      snd.source.addEventListener( "ended", function ( evt ) {
        snd.volume.disconnect( this.mainVolume );
      }.bind( this ) );
      snd.source.start( 0 );
    } ), buffer );
  };

  return Audio3D;
} )();
;/* global Primrose, io, Leap */
Primrose.Output.HapticGlove = ( function () {
  function HapticGlove ( options ) {

    options.port = options.port || HapticGlove.DEFAULT_PORT;
    options.addr = options.addr || HapticGlove.DEFAULT_HOST;
    this.tips = [ ];
    this.numJoints = options.hands * options.fingers * options.joints;

    var enabled = false,
        connected = false;

    Leap.loop();

    this.setEnvironment = function ( opts ) {
      options.world = opts.world;
      options.scene = opts.scene;
      options.camera = opts.camera;

      Leap.loopController.on( "frame", readFrame.bind(this) );

    };

    var tipNames = [
      "tipPosition",
      "dipPosition",
      "pipPosition",
      "mcpPosition",
      "carpPosition"
    ];

    function readFrame ( frame ) {
      if ( frame.valid ) {
        enabled = frame.hands.length > 0;
        for ( var h = 0; h < options.hands && h < frame.hands.length; ++h ) {
          var hand = frame.hands[h];
          for ( var f = 0; f < options.fingers; ++f ) {
            var finger = hand.fingers[f];
            for ( var j = 0; j < options.joints; ++j ) {
              var n = h * options.fingers * options.joints + f * options.joints + j;
              if ( n < this.tips.length ) {
                var p = finger[tipNames[j]];
                var t = this.tips[n];
                t.position.set( p[0], p[1], p[2]) ;
              }
            }
          }
        }
      }
    }

    var socket,
        fingerState = 0;

    if ( options.port !== 80 ) {
      options.addr += ":" + options.port;
    }

    socket = io.connect( options.addr, {
      "reconnect": true,
      "reconnection delay": 1000,
      "max reconnection attempts": 5
    } );

    socket.on( "connect", function () {
      connected = true;
      console.log( "Connected!" );
    } );

    socket.on( "disconnect", function () {
      connected = false;
      console.log( "Disconnected!" );
    } );

    this.readContacts = function ( contacts ) {
      var count = 0;
      for ( var c = 0; enabled && count < 2 && c < contacts.length; ++c ) {
        var contact = contacts[c];
        for ( var h = 0; h < options.hands && count < 2; ++h ) {
          for ( var f = 0; f < options.fingers; ++f ) {
            var t = this.tips[f];
            var found = false;
            if ( contact.bi === t ) {
              if ( contact.bj.graphics && contact.bj.graphics.isSolid ) {
                this.setFingerState( f, true );
                found = true;
                ++count;
              }
            }
            if ( !found ) {
              this.setFingerState( f, false );
            }
          }
        }
      }
    };

    this.setFingerState = function ( i, value ) {
      var mask = 0x1 << i;
      if ( value ) {
        fingerState = fingerState | mask;
      }
      else {
        fingerState = fingerState & ~mask & 0x1f;
      }
      if ( connected ) {
        socket.emit( "data", fingerState );
      }
    };
  }

  HapticGlove.DEFAULT_PORT = 8383;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();
;/* global Primrose, Window */

Primrose.Output.Music = ( function () {

  /* polyfill */
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  var PIANO_BASE = Math.pow( 2, 1 / 12 ),
      MAX_NOTE_COUNT = ( navigator.maxTouchPoints || 10 ) + 1;

  function piano ( n ) {
    return 440 * Math.pow( PIANO_BASE, n - 49 );
  }

  function Music ( context, type, numNotes ) {
    this.audio = context || new AudioContext();
    if ( this.audio && this.audio.createGain ) {
      if ( numNotes === undefined ) {
        numNotes = MAX_NOTE_COUNT;
      }
      if ( type === undefined ) {
        type = "sawtooth";
      }
      this.available = true;
      this.mainVolume = this.audio.createGain();
      this.mainVolume.connect( this.audio.destination );
      this.numNotes = numNotes;
      this.oscillators = [ ];

      for ( var i = 0; i < this.numNotes; ++i ) {
        var o = this.audio.createOscillator(),
            g = this.audio.createGain();
        o.type = type;
        o.frequency.value = 0;
        o.connect( g );
        o.start();
        g.connect( this.mainVolume );
        this.oscillators.push( {
          osc: o,
          gn: g,
          timeout: null
        } );
      }
    } else {
      this.available = false;
      IS_IN_GRID = true;
    }
  }

  Music.prototype.noteOn = function ( volume, i, n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes],
          f = piano( parseFloat( i ) + 1 );

      o.gn.gain.value = volume;
      o.osc.frequency.setValueAtTime( f, 0 );
      return o;
    }
  };

  Music.prototype.noteOff = function ( n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes];
      o.osc.frequency.setValueAtTime( 0, 0 );
    }
  };

  Music.prototype.play = function ( i, volume, duration, n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.noteOn( volume, i, n );
      if ( o.timeout ) {
        clearTimeout( o.timeout );
        o.timeout = null;
      }
      o.timeout = setTimeout( ( function ( n, o ) {
        this.noteOff( n );
        o.timeout = null;
      } ).bind( this, n, o ), duration * 1000 );
    }
  };

  return Music;
} )();;/* global Primrose, speechSynthesis */

Primrose.Output.Speech = ( function ( ) {
  function pickRandomOption ( options, key, min, max ) {
    if ( options[key] === undefined ) {
      options[key] = min + ( max - min ) * Math.random( );
    }
    else {
      options[key] = Math.min( max, Math.max( min, options[key] ) );
    }
    return options[key];
  }

  try {
    return {
      Character: function ( options ) {
        options = options || { };
        var voices = speechSynthesis.getVoices( )
              .filter( function ( v ) {
                return v.default || v.localService;
              }.bind( this ) );

        var voice = voices[
          Math.floor(pickRandomOption( options, "voice", 0, voices.length ))];

        this.speak = function ( txt, callback ) {
          var msg = new SpeechSynthesisUtterance( );
          msg.voice = voice;
          msg.volume = pickRandomOption( options, "volume", 1, 1 );
          msg.rate = pickRandomOption( options, "rate", 0.1, 5 );
          msg.pitch = pickRandomOption( options, "pitch", 0, 2 );
          msg.text = txt;
          msg.onend = callback;
          speechSynthesis.speak( msg );
        };
      }
    };
  }
  catch ( exp ) {

// in case of error, return a shim that lets us continue unabated.
    return {
      Character: function ( ) {
        this.speak = function ( ) {
        };
      }
    };
  }
} )( );
;/* global Primrose */
Primrose.Text.CodePage = ( function ( ) {
  "use strict";

  function CodePage ( name, lang, options ) {
    this.name = name;
    this.language = lang;

    copyObject( this, {
      NORMAL: {
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z"
      },
      SHIFT: {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z"
      }
    } );

    copyObject( this, options );

    for ( var i = 0; i <= 9; ++i ) {
      var code = Primrose.Text.Keys["NUMPAD" + i];
      this.NORMAL[code] = i.toString();
    }

    this.NORMAL[Primrose.Text.Keys.MULTIPLY] = "*";
    this.NORMAL[Primrose.Text.Keys.ADD] = "+";
    this.NORMAL[Primrose.Text.Keys.SUBTRACT] = "-";
    this.NORMAL[Primrose.Text.Keys.DECIMALPOINT] = ".";
    this.NORMAL[Primrose.Text.Keys.DIVIDE] = "/";
  }

  CodePage.DEAD = function ( key ) {
    return function ( prim ) {
      prim.setDeadKeyState( "DEAD" + key );
    };
  };

  return CodePage;
} ) ();
;/* global Primrose */
Primrose.Text.CommandPack = ( function ( ) {
  "use strict";

  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();
;/* global Primrose */
Primrose.Text.Control = ( function () {
  "use strict";

  var CONTROLS = [ ];

  function updateControls () {
    for ( var i = 0; i < CONTROLS.length; ++i ) {
      CONTROLS[i].render();
    }
    requestAnimationFrame( updateControls );
  }

  requestAnimationFrame( updateControls );

  function Control () {
    CONTROLS.push( this );
    this.focused = false;
    this.changed = false;
  }

  Control.prototype.render = function(){
    this.changed = false;
  };

  Control.prototype.update = function () {
    if(this.changed){
      this.render();
    }
  };

  Control.prototype.forceUpdate = function(){
    this.changed = true;
    this.update();
  };

  Control.prototype.dispose = function () {
    for ( var i = CONTROLS.length - 1; i >= 0; --i ) {
      if ( CONTROLS[i] === this ) {
        CONTROLS.splice( i, 1 );
        break;
      }
    }
  };

  Control.prototype.focus = function () {
    for ( var i = 0; i < CONTROLS.length; ++i ) {
      var e = CONTROLS[i];
      if ( e !== this ) {
        e.blur();
      }
    }
    this.focused = true;
    this.forceUpdate();
  };

  Control.prototype.blur = function () {
    this.focused = false;
    this.forceUpdate();
  };

  return Control;
} )();
;/* global qp, Primrose */
Primrose.Text.Cursor = ( function ( ) {
  "use strict";

  // unicode-aware string reverse
  var reverse = ( function ( ) {
    var combiningMarks =
        /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
        surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

    function reverse ( str ) {
      str = str.replace( combiningMarks, function ( match, capture1,
          capture2 ) {
        return reverse( capture2 ) + capture1;
      } )
          .replace( surrogatePair, "$2$1" );
      var res = "";
      for ( var i = str.length - 1; i >= 0; --i ) {
        res += str[i];
      }
      return res;
    }
    return reverse;
  }
  )( );

  function Cursor ( i, x, y ) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  Cursor.min = function ( a, b ) {
    if ( a.i <= b.i ) {
      return a;
    }
    return b;
  };

  Cursor.max = function ( a, b ) {
    if ( a.i > b.i ) {
      return a;
    }
    return b;
  };

  Cursor.prototype.toString = function () {
    return fmt( "[i:$1 x:$2 y:$3]", this.i, this.x, this.y );
  };

  Cursor.prototype.copy = function ( cursor ) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
  };

  Cursor.prototype.fullhome = function ( tokenRows ) {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
  };

  function rebuildLine ( tokenRows, y ) {
    var tokenRow = tokenRows[y];
    var line = "";
    for ( var i = 0; i < tokenRow.length; ++i ) {
      line += tokenRow[i].value;
    }
    return line;
  }

  Cursor.prototype.fullend = function ( tokenRows ) {
    this.i = 0;
    var lastLength = 0;
    for ( var y = 0; y < tokenRows.length; ++y ) {
      var line = rebuildLine( tokenRows, y );
      lastLength = line.length;
      this.i += lastLength;
    }
    this.y = tokenRows.length - 1;
    this.x = lastLength;
    this.moved = true;
  };

  Cursor.prototype.skipleft = function ( tokenRows ) {
    if ( this.x === 0 ) {
      this.left( tokenRows );
    }
    else {
      var x = this.x - 1;
      var line = rebuildLine( tokenRows, this.y );
      var word = reverse( line.substring( 0, x ) );
      var m = word.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : word.length;
      this.i -= dx;
      this.x -= dx;
    }
    this.moved = true;
  };

  Cursor.prototype.left = function ( tokenRows ) {
    if ( this.i > 0 ) {
      --this.i;
      --this.x;
      if ( this.x < 0 ) {
        --this.y;
        var line = rebuildLine( tokenRows, this.y );
        this.x = line.length;
      }
      if ( this.reverseFromNewline( tokenRows ) ) {
        ++this.i;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.skipright = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x === line.length || line[this.x] === '\n' ) {
      this.right( tokenRows );
    }
    else {
      var x = this.x + 1;
      line = line.substring( x );
      var m = line.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : ( line.length - this.x );
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.fixCursor = function ( tokenRows ) {
    this.x = this.i;
    this.y = 0;
    var total = 0;
    var line = rebuildLine( tokenRows, this.y );
    while ( this.x > line.length ) {
      this.x -= line.length;
      total += line.length;
      if ( this.y >= tokenRows.length - 1 ) {
        this.i = total;
        this.x = line.length;
        this.moved = true;
        break;
      }
      ++this.y;
      line = rebuildLine( tokenRows, this.y );
    }
    return this.moved;
  };

  Cursor.prototype.right = function ( tokenRows ) {
    this.advanceN( tokenRows, 1 );
  };

  Cursor.prototype.advanceN = function ( tokenRows, n ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.y < tokenRows.length - 1 || this.x < line.length ) {
      this.i += n;
      this.fixCursor( tokenRows );
      line = rebuildLine( tokenRows, this.y );
      if ( this.x > 0 && line[this.x - 1] === '\n' ) {
        ++this.y;
        this.x = 0;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.home = function ( tokenRows ) {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
  };

  Cursor.prototype.end = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    var dx = line.length - this.x;
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.up = function ( tokenRows ) {
    if ( this.y > 0 ) {
      --this.y;
      var line = rebuildLine( tokenRows, this.y );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i -= line.length - dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.down = function ( tokenRows ) {
    if ( this.y < tokenRows.length - 1 ) {
      ++this.y;
      var line = rebuildLine( tokenRows, this.y );
      var pLine = rebuildLine( tokenRows, this.y - 1 );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i += pLine.length + dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.incY = function ( dy, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, this.y + dy ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, this.x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.setXY = function ( x, y, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, y ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.setI = function ( i, tokenRows ) {
    this.i = i;
    this.fixCursor( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.reverseFromNewline = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x > 0 && line[this.x - 1] === '\n' ) {
      --this.x;
      --this.i;
      return true;
    }
    return false;
  };

  return Cursor;
} )();
;/* global Primrose */
Primrose.Text.Grammar = ( function ( ) {
  "use strict";

  function Grammar ( name, grammar ) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map( function ( rule ) {
      return new Primrose.Text.Rule( rule[0], rule[1] );
    } );

    function crudeParsing ( tokens ) {
      var blockOn = false,
          line = 0;
      for ( var i = 0; i < tokens.length; ++i ) {
        var t = tokens[i];
        t.line = line;
        if ( t.type === "newlines" ) {
          ++line;
        }

        if ( blockOn ) {
          if ( t.type === "endBlockComments" ) {
            blockOn = false;
          }
          if ( t.type !== "newlines" ) {
            t.type = "comments";
          }
        }
        else if ( t.type === "startBlockComments" ) {
          blockOn = true;
          t.type = "comments";
        }
      }
    }

    this.tokenize = function ( text ) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [ new Primrose.Text.Token( text, "regular", 0 ) ];
      for ( var i = 0; i < this.grammar.length; ++i ) {
        var rule = this.grammar[i];
        for ( var j = 0; j < tokens.length; ++j ) {
          rule.carveOutMatchedToken( tokens, j );
        }
      }

      crudeParsing( tokens );
      return tokens;
    };
  }

  return Grammar;
} )();
;/* global Primrose */
Primrose.Text.Keys = ( function ( ) {
  "use strict";
  var Keys = {
    ///////////////////////////////////////////////////////////////////////////
    // modifiers
    ///////////////////////////////////////////////////////////////////////////
    MODIFIER_KEYS: [ "CTRL", "ALT", "META", "SHIFT" ],
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    META_L: 91,
    META_R: 92,
    ///////////////////////////////////////////////////////////////////////////
    // whitespace
    ///////////////////////////////////////////////////////////////////////////
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    DELETE: 46,
    ///////////////////////////////////////////////////////////////////////////
    // lock keys
    ///////////////////////////////////////////////////////////////////////////
    PAUSEBREAK: 19,
    CAPSLOCK: 20,
    NUMLOCK: 144,
    SCROLLLOCK: 145,
    INSERT: 45,
    ///////////////////////////////////////////////////////////////////////////
    // navigation keys
    ///////////////////////////////////////////////////////////////////////////
    ESCAPE: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    SELECTKEY: 93,
    ///////////////////////////////////////////////////////////////////////////
    // numbers
    ///////////////////////////////////////////////////////////////////////////
    NUMBER0: 48,
    NUMBER1: 49,
    NUMBER2: 50,
    NUMBER3: 51,
    NUMBER4: 52,
    NUMBER5: 53,
    NUMBER6: 54,
    NUMBER7: 55,
    NUMBER8: 56,
    NUMBER9: 57,
    ///////////////////////////////////////////////////////////////////////////
    // letters
    ///////////////////////////////////////////////////////////////////////////
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    ///////////////////////////////////////////////////////////////////////////
    // numpad
    ///////////////////////////////////////////////////////////////////////////
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMALPOINT: 110,
    DIVIDE: 111,
    ///////////////////////////////////////////////////////////////////////////
    // function keys
    ///////////////////////////////////////////////////////////////////////////
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
  };

  // create a reverse mapping from keyCode to name.
  for ( var key in Keys ) {
    var val = Keys[key];
    if ( Keys.hasOwnProperty( key ) && typeof ( val ) === "number" ) {
      Keys[val] = key;
    }
  }

  return Keys;
} )();
;/* global Primrose */
Primrose.Text.OperatingSystem = ( function ( ) {
  "use strict";

  function setCursorCommand ( obj, mod, key, func, cur ) {
    var name = mod + "_" + key;
    obj[name] = function ( prim, tokenRows ) {
      prim["cursor" + func]( tokenRows, prim[cur + "Cursor"] );
    };
  }

  function makeCursorCommand ( obj, baseMod, key, func ) {
    setCursorCommand( obj, baseMod || "NORMAL", key, func, "front" );
    setCursorCommand( obj, baseMod + "SHIFT", key, func, "back" );
  }

  function OperatingSystem ( name, pre1, pre2, redo, pre3, home, end, pre4,
      fullHome, fullEnd ) {
    this.name = name;

    this[pre1 + "_a"] = function ( prim, tokenRows ) {
      prim.frontCursor.fullhome( tokenRows );
      prim.backCursor.fullend( tokenRows );
      prim.forceUpdate();
    };

    this[redo] = function ( prim, tokenRows ) {
      prim.redo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_z"] = function ( prim, tokenRows ) {
      prim.undo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_DOWNARROW"] = function ( prim, tokenRows ) {
      if ( prim.scroll.y < tokenRows.length ) {
        ++prim.scroll.y;
      }
      prim.forceUpdate();
    };

    this[pre1 + "_UPARROW"] = function ( prim, tokenRows ) {
      if ( prim.scroll.y > 0 ) {
        --prim.scroll.y;
      }
      prim.forceUpdate();
    };
  
    this.isClipboardReadingEvent = function(evt){
      return evt[pre1.toLowerCase() + "Key"] && //meta or ctrl
          (evt.keyCode === 67 || // C
          evt.keyCode === 88); // X
    };

    makeCursorCommand( this, "", "LEFTARROW", "Left" );
    makeCursorCommand( this, "", "RIGHTARROW", "Right" );
    makeCursorCommand( this, "", "UPARROW", "Up" );
    makeCursorCommand( this, "", "DOWNARROW", "Down" );
    makeCursorCommand( this, "", "PAGEUP", "PageUp" );
    makeCursorCommand( this, "", "PAGEDOWN", "PageDown" );
    makeCursorCommand( this, pre2, "LEFTARROW", "SkipLeft" );
    makeCursorCommand( this, pre2, "RIGHTARROW", "SkipRight" );
    makeCursorCommand( this, pre3, home, "Home" );
    makeCursorCommand( this, pre3, end, "End" );
    makeCursorCommand( this, pre4, fullHome, "FullHome" );
    makeCursorCommand( this, pre4, fullEnd, "FullEnd" );
  }

  return OperatingSystem;
} )();
;/* global qp, Primrose */
Primrose.Text.Point = ( function ( ) {
  "use strict";

  function Point ( x, y ) {
    this.set( x || 0, y || 0 );
  }

  Point.prototype.set = function ( x, y ) {
    this.x = x;
    this.y = y;
  };

  Point.prototype.copy = function ( p ) {
    if ( p ) {
      this.x = p.x;
      this.y = p.y;
    }
  };

  Point.prototype.clone = function () {
    return new Point( this.x, this.y );
  };

  Point.prototype.toString = function () {
    return fmt( "(x:$1, y:$2)", this.x, this.y );
  };

  return Point;
} )();
;/* global qp, Primrose */
Primrose.Text.Rectangle = ( function ( ) {
  "use strict";

  function Rectangle ( x, y, width, height ) {
    this.point = new Primrose.Text.Point( x, y );
    this.size = new Primrose.Text.Size( width, height );

    Object.defineProperties( this, {
      x: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      left: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      width: {
        get: function () {
          return this.size.width;
        },
        set: function ( width ) {
          this.size.width = width;
        }
      },
      right: {
        get: function () {
          return this.point.x + this.size.width;
        },
        set: function ( right ) {
          this.point.x = right - this.size.width;
        }
      },
      y: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      top: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      height: {
        get: function () {
          return this.size.height;
        },
        set: function ( height ) {
          this.size.height = height;
        }
      },
      bottom: {
        get: function () {
          return this.point.y + this.size.height;
        },
        set: function ( bottom ) {
          this.point.y = bottom - this.size.height;
        }
      }
    } );
  }

  Rectangle.prototype.set = function ( x, y, width, height ) {
    this.point.set( x, y );
    this.size.set( width, height );
  };

  Rectangle.prototype.copy = function ( r ) {
    if ( r ) {
      this.point.copy( r.point );
      this.size.copy( r.size );
    }
  };

  Rectangle.prototype.clone = function () {
    return new Rectangle( this.point.x, this.point.y, this.size.width,
        this.size.height );
  };

  Rectangle.prototype.toString = function () {
    return fmt( "[$1 x $2]", this.point.toString(), this.size.toString() );
  };

  return Rectangle;
} )();
;/* global Primrose */
Primrose.Text.Rule = ( function ( ) {
  "use strict";

  function Rule ( name, test ) {
    this.name = name;
    this.test = test;
  }

  Rule.prototype.carveOutMatchedToken = function ( tokens, j ) {
    var token = tokens[j];
    if ( token.type === "regular" ) {
      var res = this.test.exec( token.value );
      if ( res ) {
        // Only use the last group that matches the regex, to allow for more
        // complex regexes that can match in special contexts, but not make
        // the context part of the token.
        var midx = res[res.length - 1];
        var start = res.index;
        // We skip the first record, because it's not a captured group, it's
        // just the entire matched text.
        for ( var k = 1; k < res.length - 1; ++k ) {
          start += res[k].length;
        }

        var end = start + midx.length;
        if ( start === 0 ) {
          // the rule matches the start of the token
          token.type = this.name;
          if ( end < token.value.length ) {
            // but not the end
            var next = token.splitAt( end );
            next.type = "regular";
            tokens.splice( j + 1, 0, next );
          }
        }
        else {
          // the rule matches from the middle of the token
          var mid = token.splitAt( start );
          if ( midx.length < mid.value.length ) {
            // but not the end
            var right = mid.splitAt( midx.length );
            tokens.splice( j + 1, 0, right );
          }
          mid.type = this.name;
          tokens.splice( j + 1, 0, mid );
        }
      }
    }
  };

  return Rule;
} )();
;/* global Primrose */
Primrose.Text.Size = (function ( ) {
  "use strict";

  function Size ( width, height ) {
    this.set( width || 0, height || 0 );
  }

  Size.prototype.set = function ( width, height ) {
    this.width = width;
    this.height = height;
  };

  Size.prototype.copy = function ( s ) {
    if ( s ) {
      this.width = s.width;
      this.height = s.height;
    }
  };

  Size.prototype.clone = function () {
    return new Size( this.width, this.height );
  };

  Size.prototype.toString = function () {
    return fmt( "<w:$1, h:$2>", this.width, this.height );
  };

  return Size;
} )();
;/* global Primrose, isOSX */
Primrose.Text.Terminal = function ( inputEditor, outputEditor ) {
  "use strict";

  outputEditor = outputEditor || inputEditor;

  var inputCallback = null,
      currentProgram = null,
      originalGrammar = null,
      currentEditIndex = 0,
      pageSize = 40,
      outputQueue = [ ],
      buffer = "",
      restoreInput = inputEditor === outputEditor,
      self = this;

  this.running = false;
  this.waitingForInput = false;

  function toEnd ( editor ) {
    editor.selectionStart = editor.selectionEnd = editor.value.length;
    editor.scrollIntoView( editor.frontCursor );
    editor.forceUpdate();
  }

  function done () {
    if ( self.running ) {
      flush( );
      self.running = false;
      if ( restoreInput ) {
        inputEditor.setTokenizer( originalGrammar );
        inputEditor.value = currentProgram;
      }
      toEnd( inputEditor );
    }
  }

  function clearScreen () {
    outputEditor.selectionStart = outputEditor.selectionEnd = 0;
    outputEditor.value = "";
    return true;
  }

  function flush () {
    if ( buffer.length > 0 ) {
      var lines = buffer.split( "\n" );
      for ( var i = 0; i < pageSize && lines.length > 0; ++i ) {
        outputQueue.push( lines.shift() );
      }
      if ( lines.length > 0 ) {
        outputQueue.push( " ----- more -----" );
      }
      buffer = lines.join( "\n" );
    }
  }

  function input ( callback ) {
    inputCallback = callback;
    self.waitingForInput = true;
    flush( );
  }

  function stdout ( str ) {
    buffer += str;
  }

  this.sendInput = function ( evt ) {
    if ( buffer.length > 0 ) {
      flush( );
    }
    else {
      outputEditor.keyDown( evt );
      var str = outputEditor.value.substring( currentEditIndex );
      inputCallback( str.trim() );
      inputCallback = null;
      this.waitingForInput = false;
    }
  };

  this.execute = function ( inVR ) {
    pageSize = inVR ? 10 : 40;
    originalGrammar = inputEditor.getTokenizer();
    if ( originalGrammar && originalGrammar.interpret ) {
      this.running = true;
      var looper,
          next = function () {
            if ( self.running ) {
              setTimeout( looper, 1 );
            }
          };

      currentProgram = inputEditor.value;
      looper = originalGrammar.interpret( currentProgram, input, stdout,
          stdout, next, clearScreen, this.loadFile.bind( this ), done );
      outputEditor.setTokenizer( Primrose.Text.Grammars.PlainText );
      clearScreen();
      next();
    }
  };

  this.loadFile = function ( fileName, callback ) {
    GET( fileName.toLowerCase(), "text", function ( file ) {
      if ( isOSX ) {
        file = file.replace( "CTRL+SHIFT+SPACE", "CMD+OPT+E" );
      }
      inputEditor.value = currentProgram = file;
      if ( callback ) {
        callback();
      }
    } );
  };

  this.update = function () {
    if ( outputQueue.length > 0 ) {
      outputEditor.value += outputQueue.shift() + "\n";
      toEnd( outputEditor );
      currentEditIndex = outputEditor.selectionStart;
    }
  };
};
;/* global Primrose */
Primrose.Text.Token = ( function () {
  "use strict";
  function Token ( value, type, index, line ) {
    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  Token.prototype.clone = function () {
    return new Token( this.value, this.type, this.index, this.line );
  };

  Token.prototype.splitAt = function ( i ) {
    var next = this.value.substring( i );
    this.value = this.value.substring( 0, i );
    return new Token( next, this.type, this.index + i, this.line );
  };

  Token.prototype.toString = function(){
    return fmt("[$1: $2]", this.type, this.value);
  };

  return Token;
} )();
;/* global Primrose */
Primrose.Text.CodePages.DE_QWERTZ = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  return new CodePage("Deutsch: QWERTZ", "de", {
    deadKeys: [220, 221, 160, 192],
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "60": "<",
      "63": "ß",
      "160": CodePage.DEAD(3),
      "163": "#",
      "171": "+",
      "173": "-",
      "186": "ü",
      "187": "+",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "#",
      "192": CodePage.DEAD(4),
      "219": "ß",
      "220": CodePage.DEAD(1),
      "221": CodePage.DEAD(2),
      "222": "ä",
      "226": "<"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û",
      "190": "."
    },
    DEAD2NORMAL: {
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "83": "s",
      "85": "ú",
      "89": "ý"
    },
    SHIFT: {
      "48": "=",
      "49": "!",
      "50": "\"",
      "51": "§",
      "52": "$",
      "53": "%",
      "54": "&",
      "55": "/",
      "56": "(",
      "57": ")",
      "60": ">",
      "63": "?",
      "163": "'",
      "171": "*",
      "173": "_",
      "186": "Ü",
      "187": "*",
      "188": ";",
      "189": "_",
      "190": ":",
      "191": "'",
      "192": "Ö",
      "219": "?",
      "222": "Ä",
      "226": ">"
    },
    CTRLALT: {
      "48": "}",
      "50": "²",
      "51": "³",
      "55": "{",
      "56": "[",
      "57": "]",
      "60": "|",
      "63": "\\",
      "69": "€",
      "77": "µ",
      "81": "@",
      "171": "~",
      "187": "~",
      "219": "\\",
      "226": "|"
    },
    CTRLALTSHIFT: {
      "63": "ẞ",
      "219": "ẞ"
    },
    DEAD3NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "85": "u",
      "190": "."
    },
    DEAD4NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "83": "s",
      "85": "u",
      "89": "y"
    }
  });
})();
;/* global Primrose */
Primrose.Text.CodePages.EN_UKX = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  return new CodePage("English: UK Extended", "en-GB", {
    CTRLALT: {
      "52": "€",
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "85": "ú",
      "163": "\\",
      "192": "¦",
      "222": "\\",
      "223": "¦"
    },
    CTRLALTSHIFT: {
      "65": "Á",
      "69": "É",
      "73": "Í",
      "79": "Ó",
      "85": "Ú",
      "222": "|"
    },
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "163": "#",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "192": "'",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "#",
      "223": "`"
    }, SHIFT: {
      "48": ")",
      "49": "!",
      "50": "\"",
      "51": "£",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "163": "~",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "192": "@",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "~",
      "223": "¬"
    }
  });
})();
;/* global Primrose */
Primrose.Text.CodePages.EN_US = (function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  return new CodePage("English: USA", "en-US", {
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "'"
    },
    SHIFT: {
      "48": ")",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "\""
    }
  });
})();
;/* global Primrose */
Primrose.Text.CodePages.FR_AZERTY = ( function () {
  "use strict";
  var CodePage = Primrose.Text.CodePage;
  return new CodePage( "Français: AZERTY", "fr", {
    deadKeys: [ 221, 50, 55 ],
    NORMAL: {
      "48": "à",
      "49": "&",
      "50": "é",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "-",
      "55": "è",
      "56": "_",
      "57": "ç",
      "186": "$",
      "187": "=",
      "188": ",",
      "190": ";",
      "191": ":",
      "192": "ù",
      "219": ")",
      "220": "*",
      "221": CodePage.DEAD( 1 ),
      "222": "²",
      "223": "!",
      "226": "<"
    },
    SHIFT: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "186": "£",
      "187": "+",
      "188": "?",
      "190": ".",
      "191": "/",
      "192": "%",
      "219": "°",
      "220": "µ",
      "223": "§",
      "226": ">"
    },
    CTRLALT: {
      "48": "@",
      "50": CodePage.DEAD( 2 ),
      "51": "#",
      "52": "{",
      "53": "[",
      "54": "|",
      "55": CodePage.DEAD( 3 ),
      "56": "\\",
      "57": "^",
      "69": "€",
      "186": "¤",
      "187": "}",
      "219": "]"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û"
    },
    DEAD2NORMAL: {
      "65": "ã",
      "78": "ñ",
      "79": "õ"
    },
    DEAD3NORMAL: {
      "48": "à",
      "50": "é",
      "55": "è",
      "65": "à",
      "69": "è",
      "73": "ì",
      "79": "ò",
      "85": "ù"
    }
  } );
} )();
;// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
/* global Primrose */
Primrose.Text.CommandPacks.TextEditor = ( function () {
  "use strict";

  return {
    name: "Basic commands",
    NORMAL_SPACE: " ",
    SHIFT_SPACE: " ",
    NORMAL_BACKSPACE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.left( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
        indent = tokenRow[0].value;
      }
      prim.overwriteText( "\n" + indent );
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.backCursor.right( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    SHIFT_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.home( tokenRows );
        prim.backCursor.end( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_TAB: function ( prim, tokenRows ) {
      var ts = prim.getTabString();
      prim.overwriteText( ts );
    }
  };
} )();
;/* global Primrose */
// // For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
Primrose.Text.CommandPacks.TextEditor = ( function () {
  "use strict";

  function TextEditor ( operatingSystem, codePage, editor ) {
    var commands = {
      NORMAL_SPACE: " ",
      SHIFT_SPACE: " ",
      NORMAL_BACKSPACE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.left( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
        var indent = "";
        var tokenRow = tokenRows[prim.frontCursor.y];
        if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
          indent = tokenRow[0].value;
        }
        prim.overwriteText( "\n" + indent );
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.backCursor.right( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      SHIFT_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.home( tokenRows );
          prim.backCursor.end( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_TAB: function ( prim, tokenRows ) {
        var ts = prim.getTabString();
        prim.overwriteText( ts );
      }
    };

    var allCommands = { };

    copyObject( allCommands, codePage );
    copyObject( allCommands, operatingSystem );
    copyObject( allCommands, commands );

    for ( var key in allCommands ) {
      if ( allCommands.hasOwnProperty( key ) ) {
        var func = allCommands[key];
        if ( typeof func !== "function" ) {
          func = editor.overwriteText.bind( editor, func );
        }
        allCommands[key] = func;
      }
    }

    Primrose.Text.CommandPack.call( this, "Text editor commands", allCommands );
  }
  inherit( TextEditor, Primrose.Text.CommandPack );
  return TextEditor;
} )();
;/* global Primrose */
Primrose.Text.Controls.Keyboard = ( function () {
  "use strict";

  function Keyboard ( id, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || { };
    if ( typeof options === "string" ) {
      options = { file: options };
    }

    Primrose.Text.Control.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var codePage,
        operatingSystem,
        browser,
        keyboardSystem,
        commandPack,
        currentTouchID,
        events = { keydown: [ ] },
        deadKeyState = "",
        keyNames = [ ],
        dragging = false,
        DOMElement = null;

    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function pointerStart ( x, y ) {
      if ( options.pointerEventSource ) {
        self.focus();
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.startPointer( x - bounds.left, y - bounds.top );
      }
    }

    function pointerMove ( x, y ) {
      if ( options.pointerEventSource ) {
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.movePointer( x - bounds.left, y - bounds.top );
      }
    }

    function mouseButtonDown ( evt ) {
      if ( evt.button === 0 ) {
        pointerStart( evt.clientX, evt.clientY );
        evt.preventDefault();
      }
    }

    function mouseMove ( evt ) {
      if ( self.focused ) {
        pointerMove( evt.clientX, evt.clientY );
      }
    }

    function mouseButtonUp ( evt ) {
      if ( self.focused && evt.button === 0 ) {
        self.endPointer();
      }
    }

    function touchStart ( evt ) {
      if ( self.focused && evt.touches.length > 0 && !dragging ) {
        var t = evt.touches[0];
        pointerStart( t.clientX, t.clientY );
        currentTouchID = t.identifier;
      }
    }

    function touchMove ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          pointerMove( t.clientX, t.clientY );
          break;
        }
      }
    }

    function touchEnd ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          self.endPointer();
        }
      }
    }

    function refreshCommandPack () {
      if ( keyboardSystem && operatingSystem ) {
        commandPack = { };
        var commands = {
          NORMAL_SPACE: " ",
          SHIFT_SPACE: " ",
          NORMAL_TAB: "\t"
        };

        var allCommands = { };

        copyObject( allCommands, codePage );
        copyObject( allCommands, operatingSystem );
        copyObject( allCommands, commands );
      }
    }

    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////

    this.addEventListener = function ( event, thunk ) {
      if ( events.hasOwnProperty( event ) ) {
        events[event].push( thunk );
      }
    };

    this.getDOMElement = function () {
      return DOMElement;
    };

    this.setDeadKeyState = function ( st ) {
      this.changed = true;
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      this.changed = true;
      operatingSystem = os || ( isOSX ? Primrose.Text.OperatingSystems.OSX :
          Primrose.Text.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setSize = function ( w, h ) {

    };

    this.getWidth = function () {
      return null;
    };

    this.getHeight = function () {
      return null;
    };

    this.setCodePage = function ( cp ) {
      this.changed = true;
      var key,
          code,
          char,
          name;
      codePage = cp;
      if ( !codePage ) {
        var lang = ( navigator.languages && navigator.languages[0] ) ||
            navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage;

        if ( !lang || lang === "en" ) {
          lang = "en-US";
        }

        for ( key in Primrose.Text.CodePages ) {
          cp = Primrose.Text.CodePages[key];
          if ( cp.language === lang ) {
            codePage = cp;
            break;
          }
        }

        if ( !codePage ) {
          codePage = Primrose.Text.CodePages.EN_US;
        }
      }

      keyNames = [ ];
      for ( key in Primrose.Text.Keys ) {
        code = Primrose.Text.Keys[key];
        if ( !isNaN( code ) ) {
          keyNames[code] = key;
        }
      }

      keyboardSystem = { };
      for ( var type in codePage ) {
        var codes = codePage[type];
        if ( typeof ( codes ) === "object" ) {
          for ( code in codes ) {
            if ( code.indexOf( "_" ) > -1 ) {
              var parts = code.split( ' ' ),
                  browser = parts[0];
              code = parts[1];
              char = codePage.NORMAL[code];
              name = browser + "_" + type + " " + char;
            }
            else {
              char = codePage.NORMAL[code];
              name = type + "_" + char;
            }
            keyNames[code] = char;
            keyboardSystem[name] = codes[code];
          }
        }
      }

      refreshCommandPack();
    };

    this.getCodePage = function () {
      return codePage;
    };

    this.startPicking = function ( gl, x, y ) {
    };

    this.movePicking = function ( gl, x, y ) {
    };

    this.startPointer = function ( x, y ) {
    };

    this.movePointer = function ( x, y ) {
    };

    this.endPointer = function () {
      dragging = false;
    };

    this.bindEvents = function ( k, p ) {
      if ( k ) {
        k.addEventListener( "keydown", this.keyDown.bind( this ) );
      }

      if ( p ) {
        p.addEventListener( "mousedown", mouseButtonDown );
        p.addEventListener( "mousemove", mouseMove );
        p.addEventListener( "mouseup", mouseButtonUp );
        p.addEventListener( "touchstart", touchStart );
        p.addEventListener( "touchmove", touchMove );
        p.addEventListener( "touchend", touchEnd );
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Text.Keys.CTRL && key !== Primrose.Text.Keys.ALT && key !==
            Primrose.Text.Keys.META_L &&
            key !== Primrose.Text.Keys.META_R && key !== Primrose.Text.Keys.SHIFT ) {
          var oldDeadKeyState = deadKeyState;

          var commandName = deadKeyState;

          if ( evt.ctrlKey ) {
            commandName += "CTRL";
          }
          if ( evt.altKey ) {
            commandName += "ALT";
          }
          if ( evt.metaKey ) {
            commandName += "META";
          }
          if ( evt.shiftKey ) {
            commandName += "SHIFT";
          }
          if ( commandName === deadKeyState ) {
            commandName += "NORMAL";
          }

          commandName += "_" + keyNames[key];

          var func = commandPack[browser + "_" + commandName] ||
              commandPack[commandName];
          if ( func ) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            func( self, tokenRows );
            if ( this.frontCursor.moved && !this.backCursor.moved ) {
              this.backCursor.copy( this.frontCursor );
            }
            clampScroll();
            evt.preventDefault();
          }

          if ( deadKeyState === oldDeadKeyState ) {
            deadKeyState = "";
          }
        }
        this.update();
      }
    };

    this.render = function () {
      Primrose.Text.Control.prototype.render.call( this );
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////

    //
    // different browsers have different sets of keycodes for less-frequently
    // used keys like.
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" :
        ( isIE ?
            "IE" :
            ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" :
                "UNKNOWN" ) ) ) );

    DOMElement = cascadeElement( id, "canvas", HTMLCanvasElement );

    if ( options.autoBindEvents ) {
      if ( options.keyEventSource === undefined ) {
        options.keyEventSource = DOMElement;
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = DOMElement;
      }
    }

    this.setCodePage( options.codePage );
    this.setOperatingSystem( options.os );

    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource );

    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        DOMElement.id, Primrose.Text.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + DOMElement.id,
        Primrose.Text.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.Text.OperatingSystem );
  }

  inherit( Keyboard, Primrose.Text.Control );

  return Keyboard;
} )();
;/* global Primrose, THREE */

Primrose.Text.Controls.PlainText = ( function () {

  function PlainText ( text, size, fgcolor, bgcolor, x, y, z, hAlign ) {
    text = text.replace( /\r\n/g, "\n" );
    var lines = text.split( "\n" );
    hAlign = hAlign || "center";
    var lineHeight = ( size * 1000 );
    var boxHeight = lineHeight * lines.length;

    var textCanvas = document.createElement( "canvas" );
    var textContext = textCanvas.getContext( "2d" );
    textContext.font = lineHeight + "px Arial";
    var width = textContext.measureText( text ).width;

    textCanvas.width = width;
    textCanvas.height = boxHeight;
    textContext.font = lineHeight * 0.8 + "px Arial";
    if ( bgcolor !== "transparent" ) {
      textContext.fillStyle = bgcolor;
      textContext.fillRect( 0, 0, textCanvas.width, textCanvas.height );
    }
    textContext.fillStyle = fgcolor;
    textContext.textBaseline = "top";

    for ( var i = 0; i < lines.length; ++i ) {
      textContext.fillText( lines[i], 0, i * lineHeight );
    }

    var texture = new THREE.Texture( textCanvas );
    texture.needsUpdate = true;

    var material = new THREE.MeshBasicMaterial( {
      map: texture,
      transparent: bgcolor === "transparent",
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    } );

    var textGeometry = new THREE.PlaneGeometry( size * width / lineHeight,
        size * lines.length );
    textGeometry.computeBoundingBox();
    textGeometry.computeVertexNormals();

    var textMesh = new THREE.Mesh( textGeometry, material );
    if ( hAlign === "left" ) {
      x -= textGeometry.boundingBox.min.x;
    }
    else if ( hAlign === "right" ) {
      x += textGeometry.boundingBox.min.x;
    }
    textMesh.position.set( x, y, z );
    return textMesh;
  }

  return PlainText;
} )();
;/* global qp, Primrose, isOSX, isIE, isOpera, isChrome, isFirefox, isSafari, HTMLCanvasElement */
Primrose.Text.Controls.TextBox = ( function ( ) {
  "use strict";

  function TextBox ( renderToElementOrID, options ) {
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || { };
    if ( typeof options === "string" ) {
      options = { file: options };
    }

    if(options.readOnly){
      options.disableClipboard = true;
    }

    Primrose.Text.Control.call( this );

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var Renderer = options.renderer || Primrose.Text.Renderers.Canvas,
        codePage,
        operatingSystem,
        browser,
        CommandSystem,
        keyboardSystem,
        commandPack,
        tokenizer,
        tokens,
        tokenRows,
        lines,
        theme,
        pointer = new Primrose.Text.Point(),
        lastPointer = new Primrose.Text.Point(),
        tabWidth,
        tabString,
        currentTouchID,
        deadKeyState = "",
        keyNames = [ ],
        history = [ ],
        historyFrame = -1,
        gridBounds = new Primrose.Text.Rectangle(),
        topLeftGutter = new Primrose.Text.Size(),
        bottomRightGutter = new Primrose.Text.Size(),
        dragging = false,
        scrolling = false,
        showLineNumbers = true,
        showScrollBars = true,
        wordWrap = false,
        wheelScrollSpeed = 0,
        renderer = new Renderer( renderToElementOrID, options ),
        surrogate = null,
        surrogateContainer = null;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Primrose.Text.Cursor();
    this.backCursor = new Primrose.Text.Cursor();
    this.scroll = new Primrose.Text.Point();


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function refreshTokens () {
      tokens = tokenizer.tokenize( self.value );
      self.update();
    }

    function clampScroll () {
      if ( self.scroll.y < 0 ) {
        self.scroll.y = 0;
      }
      else {
        while ( 0 < self.scroll.y &&
            self.scroll.y > tokenRows.length - gridBounds.height ) {
          --self.scroll.y;
        }
      }
    }

    function setCursorXY ( cursor, x, y ) {
      self.changed = true;
      pointer.set( x, y );
      renderer.pixel2cell( pointer, self.scroll, gridBounds );
      var gx = pointer.x - self.scroll.x;
      var gy = pointer.y - self.scroll.y;
      var onBottom = gy >= gridBounds.height;
      var onLeft = gx < 0;
      var onRight = pointer.x >= gridBounds.width;
      if ( !scrolling && !onBottom && !onLeft && !onRight ) {
        cursor.setXY( pointer.x, pointer.y, tokenRows );
        self.backCursor.copy( cursor );
      }
      else if ( scrolling || onRight && !onBottom ) {
        scrolling = true;
        var scrollHeight = tokenRows.length - gridBounds.height;
        if ( gy >= 0 && scrollHeight >= 0 ) {
          var sy = gy * scrollHeight / gridBounds.height;
          self.scroll.y = Math.floor( sy );
        }
      }
      else if ( onBottom && !onLeft ) {
        var maxWidth = 0;
        for ( var dy = 0; dy < tokenRows.length; ++dy ) {
          var tokenRow = tokenRows[dy];
          var width = 0;
          for ( var dx = 0; dx < tokenRow.length; ++dx ) {
            width += tokenRow[dx].value.length;
          }
          maxWidth = Math.max( maxWidth, width );
        }
        var scrollWidth = maxWidth - gridBounds.width;
        if ( gx >= 0 && scrollWidth >= 0 ) {
          var sx = gx * scrollWidth / gridBounds.width;
          self.scroll.x = Math.floor( sx );
        }
      }
      else if ( onLeft && !onBottom ) {
        // clicked in number-line gutter
      }
      else {
        // clicked in the lower-left corner
      }
      lastPointer.copy( pointer );
    }

    function fixCursor () {
      var moved = self.frontCursor.fixCursor( tokenRows ) ||
          self.backCursor.fixCursor( tokenRows );
      if ( moved ) {
        self.render();
      }
    }

    function pointerStart ( x, y ) {
      if ( options.pointerEventSource ) {
        self.focus();
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.startPointer( x - bounds.left, y - bounds.top );
      }
    }

    function pointerMove ( x, y ) {
      if ( options.pointerEventSource ) {
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.movePointer( x - bounds.left, y - bounds.top );
      }
    }

    function mouseButtonDown ( evt ) {
      if ( evt.button === 0 ) {
        pointerStart( evt.clientX, evt.clientY );
        evt.preventDefault();
      }
    }

    function mouseMove ( evt ) {
      if ( self.focused ) {
        pointerMove( evt.clientX, evt.clientY );
      }
    }

    function mouseButtonUp ( evt ) {
      if ( self.focused && evt.button === 0 ) {
        self.endPointer();
      }
    }

    function touchStart ( evt ) {
      if ( self.focused && evt.touches.length > 0 && !dragging ) {
        var t = evt.touches[0];
        pointerStart( t.clientX, t.clientY );
        currentTouchID = t.identifier;
      }
    }

    function touchMove ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          pointerMove( t.clientX, t.clientY );
          break;
        }
      }
    }

    function touchEnd ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          self.endPointer();
        }
      }
    }

    function refreshCommandPack () {
      if ( keyboardSystem && operatingSystem && CommandSystem ) {
        commandPack = new CommandSystem( operatingSystem, keyboardSystem,
            self );
      }
    }

    function makeCursorCommand ( name ) {
      var method = name.toLowerCase();
      self["cursor" + name] = function ( tokenRows, cursor ) {
        self.changed = true;
        cursor[method]( tokenRows );
        self.scrollIntoView( cursor );
      };
    }

    function performLayout () {
      var lineCountWidth;
      if ( showLineNumbers ) {
        lineCountWidth = Math.max( 1, Math.ceil( Math.log(self.getLineCount() ) / Math.LN10 ) );
        topLeftGutter.width = 1;
      }
      else {
        lineCountWidth = 0;
        topLeftGutter.width = 0;
      }

      if ( showScrollBars ) {
        if ( wordWrap ) {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 0 );
        }
        else {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 1 );
        }
      }
      else {
        bottomRightGutter.set( 0, 0 );
      }

      var x = topLeftGutter.width + lineCountWidth,
          y = 0,
          w = Math.floor( self.getWidth() /
              renderer.character.width ) -
          x -
          bottomRightGutter.width,
          h = Math.floor( self.getHeight() /
              renderer.character.height ) -
          y -
          bottomRightGutter.height;
      gridBounds.set( x + 2, y, w - 2, h - 2 );

      // group the tokens into rows
      tokenRows = [ [ ] ];
      lines = [""];
      var currentRowWidth = 0;
      var tokenQueue = tokens.slice();
      for ( var i = 0; i < tokenQueue.length; ++i ) {
        var t = tokenQueue[i].clone();
        var widthLeft = gridBounds.width - currentRowWidth;
        var wrap = wordWrap && t.type !== "newlines" && t.value.length >
            widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if ( wrap ) {
          var split = t.value.length > gridBounds.width ? widthLeft : 0;
          tokenQueue.splice( i + 1, 0, t.splitAt( split ) );
        }

        if ( t.value.length > 0 ) {
          tokenRows[tokenRows.length - 1].push( t );
          lines[lines.length - 1] += JSON.stringify(t);
          currentRowWidth += t.value.length;
        }

        if ( breakLine ) {
          tokenRows.push( [ ] );
          lines.push("");
          currentRowWidth = 0;
        }
      }
      return lineCountWidth;
    }

    function setFalse ( evt ) {
      evt.returnValue = false;
    }

    function minDelta ( v, minV, maxV ) {
      var dvMinV = v - minV,
          dvMaxV = v - maxV + 5,
          dv = 0;
      if ( dvMinV < 0 || dvMaxV >= 0 ) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs( dvMinV ) < Math.abs( dvMaxV ) ? dvMinV : dvMaxV;
      }

      return dv;
    }

    function makeToggler ( id, value, lblTxt, funcName ) {
      var span = document.createElement( "span" );

      var check = document.createElement( "input" );
      check.type = "checkbox";
      check.checked = value;
      check.id = id;
      span.appendChild( check );

      var lbl = document.createElement( "label" );
      lbl.innerHTML = lblTxt + " ";
      lbl.for = id;
      span.appendChild( lbl );

      check.addEventListener( "change", function () {
        self[funcName]( check.checked );
      } );
      return span;
    }

    function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
      var elem = cascadeElement( id, "select", window.HTMLSelectElement );
      var items = [ ];
      for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
          var val = obj[key];
          if ( !filter || val instanceof filter ) {
            val = val.name || key;
            var opt = document.createElement( "option" );
            opt.innerHTML = val;
            items.push( obj[key] );
            if ( val === def ) {
              opt.selected = "selected";
            }
            elem.appendChild( opt );
          }
        }
      }

      if ( typeof target[prop] === "function" ) {
        elem.addEventListener( "change", function () {
          target[prop]( items[elem.selectedIndex] );
        } );
      }
      else {
        elem.addEventListener( "change", function () {
          target[prop] = items[elem.selectedIndex];
        } );
      }

      var container = cascadeElement( "container -" + id, "div",
          window.HTMLDivElement );
      var label = cascadeElement( "label-" + id, "span",
          window.HTMLSpanElement );
      label.innerHTML = lbl + ": ";
      label.for = elem;
      elem.title = lbl;
      elem.alt = lbl;
      container.appendChild( label );
      container.appendChild( elem );
      return container;
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    [ "Left", "Right",
      "SkipLeft", "SkipRight",
      "Up", "Down",
      "Home", "End",
      "FullHome", "FullEnd" ].map( makeCursorCommand.bind( this ) );

    this.addEventListener = function ( event, thunk ) {
      if ( event === "keydown" ) {
        options.keyEventSource.addEventListener( event, thunk );
      }
    };

    this.cursorPageUp = function ( tokenRows, cursor ) {
      this.changed = true;
      cursor.incY( -gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.cursorPageDown = function ( tokenRows, cursor ) {
      this.changed = true;
      cursor.incY( gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.getDOMElement = function () {
      return renderer.getDOMElement();
    };

    this.focus = Primrose.Text.Control.prototype.focus.bind( this );
    this.blur = Primrose.Text.Control.prototype.blur.bind( this );

    this.getRenderer = function () {
      return renderer;
    };

    this.setWheelScrollSpeed = function ( v ) {
      wheelScrollSpeed = v || 25;
    };

    this.getWheelScrollSpeed = function () {
      return wheelScrollSpeed;
    };

    this.setWordWrap = function ( v ) {
      wordWrap = v || false;
      this.forceUpdate();
    };

    this.getWordWrap = function () {
      return wordWrap;
    };

    this.setShowLineNumbers = function ( v ) {
      showLineNumbers = v;
      this.forceUpdate();
    };

    this.getShowLineNumbers = function () {
      return showLineNumbers;
    };

    this.setShowScrollBars = function ( v ) {
      showScrollBars = v;
      this.forceUpdate();
    };

    this.getShowScrollBars = function () {
      return showScrollBars;
    };

    this.setTheme = function ( t ) {
      theme = t || Primrose.Text.Themes.Default;
      renderer.setTheme( theme );
      renderer.resize();
      this.changed = true;
      this.update();
    };

    this.getTheme = function () {
      return theme;
    };

    this.setDeadKeyState = function ( st ) {
      this.changed = true;
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      this.changed = true;
      operatingSystem = os || ( isOSX ? Primrose.Text.OperatingSystems.OSX :
          Primrose.Text.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setCommandSystem = function ( cmd ) {
      this.changed = true;
      CommandSystem = cmd || Primrose.Text.CommandPacks.TextEditor;
      refreshCommandPack();
    };

    this.setSize = function ( w, h ) {
      this.changed = renderer.setSize( w, h );
    };

    this.getWidth = function () {
      return renderer.getWidth();
    };

    this.getHeight = function () {
      return renderer.getHeight();
    };

    this.setCodePage = function ( cp ) {
      this.changed = true;
      var key,
          code,
          char,
          name;
      codePage = cp;
      if ( !codePage ) {
        var lang = ( navigator.languages && navigator.languages[0] ) ||
            navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage;

        if ( !lang || lang === "en" ) {
          lang = "en-US";
        }

        for ( key in Primrose.Text.CodePages ) {
          cp = Primrose.Text.CodePages[key];
          if ( cp.language === lang ) {
            codePage = cp;
            break;
          }
        }

        if ( !codePage ) {
          codePage = Primrose.Text.CodePages.EN_US;
        }
      }

      keyNames = [ ];
      for ( key in Primrose.Text.Keys ) {
        code = Primrose.Text.Keys[key];
        if ( !isNaN( code ) ) {
          keyNames[code] = key;
        }
      }

      keyboardSystem = { };
      for ( var type in codePage ) {
        var codes = codePage[type];
        if ( typeof ( codes ) === "object" ) {
          for ( code in codes ) {
            if ( code.indexOf( "_" ) > -1 ) {
              var parts = code.split( ' ' ),
                  browser = parts[0];
              code = parts[1];
              char = codePage.NORMAL[code];
              name = browser + "_" + type + " " + char;
            }
            else {
              char = codePage.NORMAL[code];
              name = type + "_" + char;
            }
            keyNames[code] = char;
            keyboardSystem[name] = codes[code];
          }
        }
      }

      refreshCommandPack();
    };

    this.getCodePage = function () {
      return codePage;
    };

    this.setTokenizer = function ( tk ) {
      this.changed = true;
      tokenizer = tk || Primrose.Text.Grammars.JavaScript;
      if ( history && history.length > 0 ) {
        refreshTokens();
        this.update();
      }
    };

    this.getTokenizer = function () {
      return tokenizer;
    };

    this.getLines = function () {
      return history[historyFrame].slice();
    };

    this.getLineCount = function () {
      return history[historyFrame].length;
    };


    Object.defineProperties( this, {
      value: {
        get: function () {
          return history[historyFrame].join( "\n" );
        },
        set: function ( txt ) {
          txt = txt || "";
          txt = txt.replace( /\r\n/g, "\n" );
          var lines = txt.split( "\n" );
          this.pushUndo( lines );
          this.update();
        }
      },
      selectionStart: {
        get: function () {
          return this.frontCursor.i;
        },
        set: function ( i ) {
          this.frontCursor.setI( i, tokenRows );
        }
      },
      selectionEnd: {
        get: function () {
          return this.backCursor.i;
        },
        set: function ( i ) {
          this.backCursor.setI( i, tokenRows );
        }
      },
      selectionDirection: {
        get: function () {
          return this.frontCursor.i <= this.backCursor.i ? "forward"
              : "backward";
        }
      }
    } );

    this.pushUndo = function ( lines ) {
      if ( historyFrame < history.length - 1 ) {
        history.splice( historyFrame + 1 );
      }
      history.push( lines );
      historyFrame = history.length - 1;
      refreshTokens();
      this.forceUpdate();
    };

    this.redo = function () {
      this.changed = true;
      if ( historyFrame < history.length - 1 ) {
        ++historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.undo = function () {
      this.changed = true;
      if ( historyFrame > 0 ) {
        --historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.setTabWidth = function ( tw ) {
      tabWidth = tw || 4;
      tabString = "";
      for ( var i = 0; i < tabWidth; ++i ) {
        tabString += " ";
      }
    };

    this.getTabWidth = function () {
      return tabWidth;
    };

    this.getTabString = function () {
      return tabString;
    };

    this.scrollIntoView = function ( currentCursor ) {
      this.scroll.y += minDelta( currentCursor.y, this.scroll.y,
          this.scroll.y + gridBounds.height );
      if ( !wordWrap ) {
        this.scroll.x += minDelta( currentCursor.x, this.scroll.x,
            this.scroll.x + gridBounds.width );
      }
      clampScroll();
    };

    this.increaseFontSize = function () {
      ++theme.fontSize;
      this.changed = renderer.resize();
    };

    this.decreaseFontSize = function () {
      if ( theme.fontSize > 1 ) {
        --theme.fontSize;
        this.changed = renderer.resize();
      }
    };

    this.setFontSize = function ( v ) {
      theme.fontSize = v;
      this.changed = renderer.resize();
    };

    this.cell2i = function ( x, y ) {
      var i = 0;
      for ( var dy = 0; dy < y; ++dy ) {
        var tokenRow = tokenRows[dy];
        for ( var dx = 0; dx < tokenRow.length; ++dx ) {
          i += tokenRow[dx].value.length;
        }
        ++i;
      }
      i += x;
      return i;
    };

    this.i2cell = function ( i ) {
      for ( var y = 0; y < tokenRows.length; ++y ) {
        var tokenRow = tokenRows[y];
        var rowWidth = 0;
        for ( var x = 0; x < tokenRow.length; ++x ) {
          rowWidth += tokenRow[x].value.length;
        }
        if ( i <= rowWidth ) {
          return { x: i, y: y };
        }
        else {
          i -= rowWidth - 1;
        }
      }
    };

    this.readWheel = function ( evt ) {
      this.scroll.y += Math.floor( evt.deltaY / wheelScrollSpeed );
      clampScroll();
      evt.preventDefault();
      this.forceUpdate();
    };

    this.startPicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.startPointer( p.x, p.y );
    };

    this.movePicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.movePointer( p.x, p.y );
    };

    this.startPointer = function ( x, y ) {
      setCursorXY( this.frontCursor, x, y );
      dragging = true;
      this.update();
    };

    this.movePointer = function ( x, y ) {
      if ( dragging ) {
        setCursorXY( this.backCursor, x, y );
        this.update();
      }
    };

    this.endPointer = function () {
      dragging = false;
      scrolling = false;
    };

    this.bindEvents = function ( k, p, w, enableClipboard ) {

      if ( p ) {
        p.addEventListener( "wheel", this.readWheel.bind( this ), false );
        p.addEventListener( "mousedown", mouseButtonDown, false );
        p.addEventListener( "mousemove", mouseMove, false );
        p.addEventListener( "mouseup", mouseButtonUp, false );
        p.addEventListener( "touchstart", touchStart, false );
        p.addEventListener( "touchmove", touchMove, false );
        p.addEventListener( "touchend", touchEnd, false );
      }

      if ( w ) {
        w.addEventListener( "wheel", this.readWheel.bind( this ), false );
      }

      if ( k ) {

        if ( k instanceof HTMLCanvasElement && !k.tabindex ) {
          k.tabindex = 0;
        }
          
        if ( enableClipboard ) {
          //
          // the `surrogate` textarea makes clipboard events possible
          surrogate = cascadeElement( "primrose-surrogate-textarea-" + renderer.id, "textarea", window.HTMLTextAreaElement );
          surrogateContainer = makeHidingContainer( "primrose-surrogate-textarea-container-" + renderer.id, surrogate );
          surrogateContainer.style.position = "absolute";
          surrogateContainer.style.overflow = "hidden";
          surrogateContainer.style.width = 0;
          surrogateContainer.style.height = 0;
          document.body.insertBefore( surrogateContainer, document.body.children[0] );

          k.addEventListener( "beforepaste", setFalse, false );
          k.addEventListener( "paste", this.readClipboard.bind( this ), false );
          k.addEventListener( "keydown", function ( evt ) {
            if ( self.focused && operatingSystem.isClipboardReadingEvent( evt ) ) {
              surrogate.style.display = "block";
              surrogate.focus();
            }
          }, true );
          surrogate.addEventListener( "beforecopy", setFalse, false );
          surrogate.addEventListener( "copy", this.copySelectedText.bind( this ), false );
          surrogate.addEventListener( "beforecut", setFalse, false );
          surrogate.addEventListener( "cut", this.cutSelectedText.bind( this ), false );
        }
        
        k.addEventListener( "keydown", this.keyDown.bind( this ), false );
      }
    };

    this.overwriteText = function ( str ) {
      str = str || "";
      str = str.replace( /\r\n/g, "\n" );

      if ( this.frontCursor.i !== this.backCursor.i || str.length > 0 ) {
        var minCursor = Primrose.Text.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.Text.Cursor.max( this.frontCursor,
                this.backCursor ),
            // TODO: don't recalc the string first.
            text = this.value,
            left = text.substring( 0, minCursor.i ),
            right = text.substring( maxCursor.i );
        this.value = left + str + right;
        minCursor.advanceN( tokenRows, Math.max( 0, str.length ) );
        this.scrollIntoView( maxCursor );
        clampScroll();
        maxCursor.copy( minCursor );
        this.render();
      }
    };

    this.copySelectedText = function ( evt ) {
      evt.returnValue = false;
      if ( this.frontCursor.i !== this.backCursor.i ) {
        var minCursor = Primrose.Text.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.Text.Cursor.max( this.frontCursor,
                this.backCursor ),
            text = this.value,
            str = text.substring( minCursor.i, maxCursor.i );
        var clipboard = evt.clipboardData || window.clipboardData;
        clipboard.setData( window.clipboardData ? "Text" : "text/plain",
            str );
      }
      evt.preventDefault();
      surrogate.style.display = "none";
      options.keyEventSource.focus();
    };

    this.cutSelectedText = function ( evt ) {
      this.copySelectedText( evt );
      this.overwriteText();
      this.update();
    };

    this.readClipboard = function ( evt ) {
      evt.returnValue = false;
      var clipboard = evt.clipboardData || window.clipboardData,
          str = clipboard.getData( window.clipboardData ? "Text" :
              "text/plain" );
      if ( str ) {
        this.overwriteText( str );
      }
    };

    this.keyDown = function ( evt ) {
      if ( this.focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Text.Keys.CTRL && key !== Primrose.Text.Keys.ALT && key !==
            Primrose.Text.Keys.META_L &&
            key !== Primrose.Text.Keys.META_R && key !== Primrose.Text.Keys.SHIFT ) {
          var oldDeadKeyState = deadKeyState;

          var commandName = deadKeyState;

          if ( evt.ctrlKey ) {
            commandName += "CTRL";
          }
          if ( evt.altKey ) {
            commandName += "ALT";
          }
          if ( evt.metaKey ) {
            commandName += "META";
          }
          if ( evt.shiftKey ) {
            commandName += "SHIFT";
          }
          if ( commandName === deadKeyState ) {
            commandName += "NORMAL";
          }

          commandName += "_" + keyNames[key];

          var func = commandPack[browser + "_" + commandName] ||
              commandPack[commandName];
          if ( func ) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            func( self, tokenRows );
            if ( this.frontCursor.moved && !this.backCursor.moved ) {
              this.backCursor.copy( this.frontCursor );
            }
            clampScroll();
            evt.preventDefault();
          }

          if ( deadKeyState === oldDeadKeyState ) {
            deadKeyState = "";
          }
        }
        this.update();
      }
    };

    this.update = function () {
      if ( renderer.hasResized() ) {
        this.changed = renderer.resize();
      }

      Primrose.Text.Control.prototype.update.call( this );
    };

    this.render = function () {
      if ( tokens ) {
        var lineCountWidth = performLayout();

        renderer.render(
            tokenRows,
            lines,
            this.frontCursor, this.backCursor,
            gridBounds,
            this.scroll,
            this.focused, showLineNumbers, showScrollBars, wordWrap,
            lineCountWidth );

        Primrose.Text.Control.prototype.render.call( this );
      }
    };

    this.appendControls = function ( elem ) {
      elem.appendChild( this.lineNumberToggler );
      elem.appendChild( this.wordWrapToggler );
      elem.appendChild( this.scrollBarToggler );
      elem.appendChild( this.operatingSystemSelect );
      elem.appendChild( this.keyboardSelect );
      elem.appendChild( this.commandSystemSelect );
      elem.appendChild( this.tokenizerSelect );
      elem.appendChild( this.themeSelect );
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////

    //
    // different browsers have different sets of keycodes for less-frequently
    // used keys like.
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" : ( isIE ? "IE" : ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" : "UNKNOWN" ) ) ) );

    this.readOnly = !!options.readOnly;
    
    if ( options.autoBindEvents || renderer.autoBindEvents ) {
      if ( !options.readOnly && options.keyEventSource === undefined ) {
        options.keyEventSource = renderer.getDOMElement();
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = renderer.getDOMElement();
      }
      if ( options.wheelEventSource === undefined ) {
        options.wheelEventSource = renderer.getDOMElement();
      }
    }

    this.setWheelScrollSpeed( options.wheelScrollSpeed );
    this.setWordWrap( !options.disableWordWrap );
    this.setShowLineNumbers( !options.hideLineNumbers );
    this.setShowScrollBars( !options.hideScrollBars );
    this.setTabWidth( options.tabWidth );
    this.setTheme( options.theme );
    this.setFontSize( options.fontSize || 14 );
    this.setTokenizer( options.tokenizer );
    this.setCodePage( options.codePage );
    this.setOperatingSystem( options.os );
    this.setCommandSystem( options.commands );
    this.value = options.file;
    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource,
        options.wheelEventSource,
        !options.disableClipboard );

    this.lineNumberToggler = makeToggler( "primrose-line-number-toggler-" +
        renderer.id, !options.hideLineNumbers, "Line numbers",
        "setShowLineNumbers" );
    this.wordWrapToggler = makeToggler( "primrose-word-wrap-toggler-" +
        renderer.id, !options.disableWordWrap, "Line wrap", "setWordWrap" );
    this.scrollBarToggler = makeToggler( "primrose-scrollbar-toggler-" +
        renderer.id, !options.hideScrollBars, "Scroll bars",
        "setShowScrollBars" );
    this.themeSelect = makeSelectorFromObj( "primrose-theme-selector-" +
        renderer.id, Primrose.Text.Themes, theme.name, self, "setTheme", "theme" );
    this.commandSystemSelect = makeSelectorFromObj(
        "primrose-command-system-selector-" + renderer.id, Primrose.Text.Commands,
        CommandSystem.name, self, "setCommandSystem",
        "Command system" );
    this.tokenizerSelect = makeSelectorFromObj(
        "primrose-tokenizer-selector-" +
        renderer.id, Primrose.Text.Grammars, tokenizer.name, self, "setTokenizer",
        "Language syntax", Primrose.Text.Grammar );
    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        renderer.id, Primrose.Text.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.Text.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + renderer.id,
        Primrose.Text.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.Text.OperatingSystem );
  }

  inherit( TextBox, Primrose.Text.Control );

  return TextBox;
} )();
;/* global Primrose */
Primrose.Text.Grammars.Basic = ( function ( ) {

  var grammar = new Primrose.Text.Grammar( "BASIC", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "lineNumbers", /^\d+\s+/ ],
    [ "comments", /^REM.*$/ ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/
    ],
    [ "keywords", /^DEF FN/ ],
    [ "operators",
      /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
    ],
    [ "identifiers", /\w+\$?/ ]
  ] );

  var oldTokenize = grammar.tokenize;
  grammar.tokenize = function ( code ) {
    return oldTokenize.call( this, code.toUpperCase( ) );
  };

  grammar.interpret = function ( sourceCode, input, output, errorOut, next,
      clearScreen, loadFile, done ) {
    var tokens = this.tokenize( sourceCode ),
        EQUAL_SIGN = new Primrose.Text.Token( "=", "operators" ),
        counter = 0,
        isDone = false,
        program = { },
        lineNumbers = [ ],
        currentLine = [ ],
        lines = [ currentLine ],
        data = [ ],
        returnStack = [ ],
        forLoopCounters = { },
        dataCounter = 0,
        state = {
          INT: function ( v ) {
            return v | 0;
          },
          RND: function ( ) {
            return Math.random( );
          },
          CLK: function ( ) {
            return Date.now( ) / 3600000;
          },
          LEN: function ( id ) {
            return id.length;
          },
          LINE: function ( ) {
            return lineNumbers[counter];
          },
          TAB: function ( v ) {
            var str = "";
            for ( var i = 0; i < v; ++i ) {
              str += " ";
            }
            return str;
          },
          POW: function ( a, b ) {
            return Math.pow( a, b );
          }
        };

    function toNum ( ln ) {
      return new Primrose.Text.Token( ln.toString(), "numbers" );
    }

    function toStr ( str ) {
      return new Primrose.Text.Token( "\"" + str.replace( "\n", "\\n" )
          .replace( "\"", "\\\"" ) + "\"", "strings" );
    }

    var tokenMap = {
      "OR": "||",
      "AND": "&&",
      "NOT": "!",
      "MOD": "%",
      "<>": "!="
    };

    while ( tokens.length > 0 ) {
      var token = tokens.shift( );
      if ( token.type === "newlines" ) {
        currentLine = [ ];
        lines.push( currentLine );
      }
      else if ( token.type !== "regular" && token.type !== "comments" ) {
        token.value = tokenMap[token.value] || token.value;
        currentLine.push( token );
      }
    }

    for ( var i = 0; i < lines.length; ++i ) {
      var line = lines[i];
      if ( line.length > 0 ) {
        var lastLine = lineNumbers[lineNumbers.length - 1];
        var lineNumber = line.shift( );

        if ( lineNumber.type !== "lineNumbers" ) {
          line.unshift( lineNumber );

          if ( lastLine === undefined ) {
            lastLine = -1;
          }

          lineNumber = toNum( lastLine + 1 );
        }

        lineNumber = parseFloat( lineNumber.value );
        if ( lastLine && lineNumber <= lastLine ) {
          throw new Error( "expected line number greater than " + lastLine +
              ", but received " + lineNumber + "." );
        }
        else if ( line.length > 0 ) {
          lineNumbers.push( lineNumber );
          program[lineNumber] = line;
        }
      }
    }


    function process ( line ) {
      if ( line && line.length > 0 ) {
        var op = line.shift( );
        if ( op ) {
          if ( commands.hasOwnProperty( op.value ) ) {
            return commands[op.value]( line );
          }
          else if ( isNumber( op.value ) ) {
            return setProgramCounter( [ op ] );
          }
          else if ( state[op.value] ||
              ( line.length > 0 && line[0].type === "operators" &&
                  line[0].value === "=" ) ) {
            line.unshift( op );
            return translate( line );
          }
          else {
            error( "Unknown command. >>> " + op.value );
          }
        }
      }
      return pauseBeforeComplete();
    }

    function error ( msg ) {
      errorOut( "At line " + lineNumbers[counter] + ": " + msg );
    }

    function getLine ( i ) {
      var lineNumber = lineNumbers[i];
      var line = program[lineNumber];
      return line && line.slice( );
    }

    function evaluate ( line ) {
      var script = "";
      for ( var i = 0; i < line.length; ++i ) {
        var t = line[i];
        var nest = 0;
        if ( t.type === "identifiers" &&
            typeof state[t.value] !== "function" &&
            i < line.length - 1 &&
            line[i + 1].value === "(" ) {
          for ( var j = i + 1; j < line.length; ++j ) {
            var t2 = line[j];
            if ( t2.value === "(" ) {
              if ( nest === 0 ) {
                t2.value = "[";
              }
              ++nest;
            }
            else if ( t2.value === ")" ) {
              --nest;
              if ( nest === 0 ) {
                t2.value = "]";
              }
            }
            else if ( t2.value === "," && nest === 1 ) {
              t2.value = "][";
            }

            if ( nest === 0 ) {
              break;
            }
          }
        }
        script += t.value;
      }
      with ( state ) { // jshint ignore:line
        try {
          return eval( script ); // jshint ignore:line
        }
        catch ( exp ) {
          console.debug( line.join( ", " ) );
          console.error( exp );
          console.error( script );
          error( exp.message + ": " + script );
        }
      }
    }

    function declareVariable ( line ) {
      var decl = [ ],
          decls = [ decl ],
          nest = 0,
          i;
      for ( i = 0; i < line.length; ++i ) {
        var t = line[i];
        if ( t.value === "(" ) {
          ++nest;
        }
        else if ( t.value === ")" ) {
          --nest;
        }
        if ( nest === 0 && t.value === "," ) {
          decl = [ ];
          decls.push( decl );
        }
        else {
          decl.push( t );
        }
      }
      for ( i = 0; i < decls.length; ++i ) {
        decl = decls[i];
        var id = decl.shift( );
        if ( id.type !== "identifiers" ) {
          error( "Identifier expected: " + id.value );
        }
        else {
          var val = null,
              j;
          id = id.value;
          if ( decl[0].value === "(" && decl[decl.length - 1].value === ")" ) {
            var sizes = [ ];
            for ( j = 1; j < decl.length - 1; ++j ) {
              if ( decl[j].type === "numbers" ) {
                sizes.push( decl[j].value | 0 );
              }
            }
            if ( sizes.length === 0 ) {
              val = [ ];
            }
            else {
              val = new Array( sizes[0] );
              var queue = [ val ];
              for ( j = 1; j < sizes.length; ++j ) {
                var size = sizes[j];
                for ( var k = 0,
                    l = queue.length; k < l; ++k ) {
                  var arr = queue.shift();
                  for ( var m = 0; m < arr.length; ++m ) {
                    arr[m] = new Array( size );
                    if ( j < sizes.length - 1 ) {
                      queue.push( arr[m] );
                    }
                  }
                }
              }
            }
          }
          state[id] = val;
          return true;
        }
      }
    }

    function print ( line ) {
      var endLine = "\n";
      var nest = 0;
      line = line.map( function ( t, i ) {
        t = t.clone();
        if ( t.type === "operators" ) {
          if ( t.value === "," ) {
            if ( nest === 0 ) {
              t.value = "+ \", \" + ";
            }
          }
          else if ( t.value === ";" ) {
            t.value = "+ \" \"";
            if ( i < line.length - 1 ) {
              t.value += " + ";
            }
            else {
              endLine = "";
            }
          }
          else if ( t.value === "(" ) {
            ++nest;
          }
          else if ( t.value === ")" ) {
            --nest;
          }
        }
        return t;
      } );
      var txt = evaluate( line );
      if ( txt === undefined ) {
        txt = "";
      }
      output( txt + endLine );
      return true;
    }

    function setProgramCounter ( line ) {
      var lineNumber = parseFloat( evaluate( line ) );
      counter = -1;
      while ( counter < lineNumbers.length - 1 &&
          lineNumbers[counter + 1] < lineNumber ) {
        ++counter;
      }

      return true;
    }

    function checkConditional ( line ) {
      var thenIndex = -1,
          elseIndex = -1,
          i;
      for ( i = 0; i < line.length; ++i ) {
        if ( line[i].type === "keywords" && line[i].value === "THEN" ) {
          thenIndex = i;
        }
        else if ( line[i].type === "keywords" && line[i].value === "ELSE" ) {
          elseIndex = i;
        }
      }
      if ( thenIndex === -1 ) {
        error( "Expected THEN clause." );
      }
      else {
        var condition = line.slice( 0, thenIndex );
        for ( i = 0; i < condition.length; ++i ) {
          var t = condition[i];
          if ( t.type === "operators" && t.value === "=" ) {
            t.value = "==";
          }
        }
        var thenClause,
            elseClause;
        if ( elseIndex === -1 ) {
          thenClause = line.slice( thenIndex + 1 );
        }
        else {
          thenClause = line.slice( thenIndex + 1, elseIndex );
          elseClause = line.slice( elseIndex + 1 );
        }
        if ( evaluate( condition ) ) {
          return process( thenClause );
        }
        else if ( elseClause ) {
          return process( elseClause );
        }
      }

      return true;
    }

    function pauseBeforeComplete () {
      output( "PROGRAM COMPLETE - PRESS RETURN TO FINISH." );
      input( function ( ) {
        isDone = true;
        if ( done ) {
          done( );
        }
      } );
      return false;
    }

    function labelLine ( line ) {
      line.push( EQUAL_SIGN );
      line.push( toNum( lineNumbers[counter] ) );
      return translate( line );
    }

    function waitForInput ( line ) {
      var toVar = line.pop();
      if ( line.length > 0 ) {
        print( line );
      }
      input( function ( str ) {
        str = str.toUpperCase();
        var valueToken = null;
        if ( isNumber( str ) ) {
          valueToken = toNum( str );
        }
        else {
          valueToken = toStr( str );
        }
        evaluate( [ toVar, EQUAL_SIGN, valueToken ] );
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function onStatement ( line ) {
      var idxExpr = [ ],
          idx = null,
          targets = [ ];
      try {
        while ( line.length > 0 &&
            ( line[0].type !== "keywords" ||
                line[0].value !== "GOTO" ) ) {
          idxExpr.push( line.shift( ) );
        }

        if ( line.length > 0 ) {
          line.shift( ); // burn the goto;

          for ( var i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.type !== "operators" ||
                t.value !== "," ) {
              targets.push( t );
            }
          }

          idx = evaluate( idxExpr ) - 1;

          if ( 0 <= idx && idx < targets.length ) {
            return setProgramCounter( [ targets[idx] ] );
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
      }
      return true;
    }

    function gotoSubroutine ( line ) {
      returnStack.push( toNum( lineNumbers[counter + 1] ) );
      return setProgramCounter( line );
    }

    function setRepeat ( ) {
      returnStack.push( toNum( lineNumbers[counter] ) );
      return true;
    }

    function conditionalReturn ( cond ) {
      var ret = true;
      var val = returnStack.pop();
      if ( val && cond ) {
        ret = setProgramCounter( [ val ] );
      }
      return ret;
    }

    function untilLoop ( line ) {
      var cond = !evaluate( line );
      return conditionalReturn( cond );
    }

    function findNext ( str ) {
      for ( i = counter + 1; i < lineNumbers.length; ++i ) {
        var l = getLine( i );
        if ( l[0].value === str ) {
          return i;
        }
      }
      return lineNumbers.length;
    }

    function whileLoop ( line ) {
      var cond = evaluate( line );
      if ( !cond ) {
        counter = findNext( "WEND" );
      }
      else {
        returnStack.push( toNum( lineNumbers[counter] ) );
      }
      return true;
    }

    var FOR_LOOP_DELIMS = [ "=", "TO", "STEP" ];

    function forLoop ( line ) {
      var n = lineNumbers[counter];
      var varExpr = [ ];
      var fromExpr = [ ];
      var toExpr = [ ];
      var skipExpr = [ ];
      var arrs = [ varExpr, fromExpr, toExpr, skipExpr ];
      var a = 0;
      var i = 0;
      for ( i = 0; i < line.length; ++i ) {
        var t = line[i];
        if ( t.value === FOR_LOOP_DELIMS[a] ) {
          if ( a === 0 ) {
            varExpr.push( t );
          }
          ++a;
        }
        else {
          arrs[a].push( t );
        }
      }

      var skip = 1;
      if ( skipExpr.length > 0 ) {
        skip = evaluate( skipExpr );
      }

      if ( forLoopCounters[n] === undefined ) {
        forLoopCounters[n] = evaluate( fromExpr );
      }

      var end = evaluate( toExpr );
      var cond = forLoopCounters[n] <= end;
      if ( !cond ) {
        delete forLoopCounters[n];
        counter = findNext( "NEXT" );
      }
      else {
        varExpr.push( toNum( forLoopCounters[n] ) );
        process( varExpr );
        forLoopCounters[n] += skip;
        returnStack.push( toNum( lineNumbers[counter] ) );
      }
      return true;
    }

    function stackReturn ( ) {
      return conditionalReturn( true );
    }

    function loadCodeFile ( line ) {
      loadFile( evaluate( line ), function ( ) {
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function noop ( ) {
      return true;
    }

    function loadData ( line ) {
      while ( line.length > 0 ) {
        var t = line.shift();
        if ( t.type !== "operators" ) {
          data.push( t.value );
        }
      }
      return true;
    }

    function readData ( line ) {
      if ( data.length === 0 ) {
        var dataLine = findNext( "DATA" );
        process( getLine( dataLine ) );
      }
      var value = data[dataCounter];
      ++dataCounter;
      line.push( EQUAL_SIGN );
      line.push( toNum( value ) );
      return translate( line );
    }

    function restoreData () {
      dataCounter = 0;
      return true;
    }

    function defineFunction ( line ) {
      var name = line.shift().value;
      var signature = "";
      var body = "";
      var fillSig = true;
      for ( var i = 0; i < line.length; ++i ) {
        var t = line[i];
        if ( t.type === "operators" && t.value === "=" ) {
          fillSig = false;
        }
        else if ( fillSig ) {
          signature += t.value;
        }
        else {
          body += t.value;
        }
      }
      name = "FN" + name;
      var script = "(function " + name + signature + "{ return " + body +
          "; })";
      state[name] = eval( script ); // jshint ignore:line
      return true;
    }

    function translate ( line ) {
      evaluate( line );
      return true;
    }

    var commands = {
      DIM: declareVariable,
      LET: translate,
      PRINT: print,
      GOTO: setProgramCounter,
      IF: checkConditional,
      INPUT: waitForInput,
      END: pauseBeforeComplete,
      STOP: pauseBeforeComplete,
      REM: noop,
      "'": noop,
      CLS: clearScreen,
      ON: onStatement,
      GOSUB: gotoSubroutine,
      RETURN: stackReturn,
      LOAD: loadCodeFile,
      DATA: loadData,
      READ: readData,
      RESTORE: restoreData,
      REPEAT: setRepeat,
      UNTIL: untilLoop,
      "DEF FN": defineFunction,
      WHILE: whileLoop,
      WEND: stackReturn,
      FOR: forLoop,
      NEXT: stackReturn,
      LABEL: labelLine
    };

    return function ( ) {
      if ( !isDone ) {
        var goNext = true;
        while ( goNext ) {
          var line = getLine( counter );
          goNext = process( line );
          ++counter;
        }
      }
    };
  };
  return grammar;
} )( );
;/* global Primrose */
Primrose.Text.Grammars.JavaScript = ( function () {
  "use strict";

  return new Primrose.Text.Grammar( "JavaScript", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "comments", /\/\/.*$/ ],
    [ "startBlockComments", /\/\*/ ],
    [ "endBlockComments", /\*\// ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "strings", /\/(?:\\\/|[^/])*\/\w*/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    [ "functions", /(\w+)(?:\s*\()/ ],
    [ "members", /(?:(?:\w+\.)+)(\w+)/ ]
  ] );
} )();
;/* global Primrose */
Primrose.Text.Grammars.PlainText = (function () {
  "use strict";

  return new Primrose.Text.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();
;/* global Primrose */
Primrose.Text.Grammars.TestResults = (function () {
  "use strict";

  return new Primrose.Text.Grammar("TestResults", [
    ["newlines", /(?:\r\n|\r|\n)/, true],
    ["numbers", /(\[)(o+)/, true],
    ["numbers", /(\d+ succeeded), 0 failed/, true],
    ["numbers", /^    Successes:/, true],
    ["functions", /(x+)\]/, true],
    ["functions", /[1-9]\d* failed/, true],
    ["functions", /^    Failures:/, true],
    ["comments", /(\d+ms:)(.*)/, true],
    ["keywords", /(Test results for )(\w+):/, true],
    ["strings", /        \w+/, true]
  ]);
})();
;/* global Primrose */
Primrose.Text.OperatingSystems.OSX = ( function () {
  "use strict";

  return new Primrose.Text.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();
;// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
/* global Primrose */
Primrose.Text.OperatingSystems.Windows = (function () {
  "use strict";

  return new Primrose.Text.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();
;/*global THREE, qp, Primrose */
Primrose.Text.Renderers.Canvas = ( function ( ) {
  "use strict";

  return function ( canvasElementOrID, options ) {
    var self = this,
        canvas = cascadeElement( canvasElementOrID, "canvas",
            window.HTMLCanvasElement ),
        bgCanvas = cascadeElement( canvas.id + "-back", "canvas",
            window.HTMLCanvasElement ),
        fgCanvas = cascadeElement( canvas.id + "-front", "canvas",
            window.HTMLCanvasElement ),
        trimCanvas = cascadeElement( canvas.id + "-trim", "canvas",
            window.HTMLCanvasElement ),
        gfx = canvas.getContext( "2d" ),
        fgfx = fgCanvas.getContext( "2d" ),
        bgfx = bgCanvas.getContext( "2d" ),
        tgfx = trimCanvas.getContext( "2d" ),
        theme = null,
        texture = null,
        pickingTexture = null,
        pickingPixelBuffer = null,
        strictSize = options.size,
        rowCache = {},
        lastLines = null,
        lastScrollY = -1,
        lastScrollX = -1,
        lastFrontCursorI = -1,
        lastBackCursorI = -1;

    this.VSCROLL_WIDTH = 2;

    this.character = new Primrose.Text.Size();
    this.id = canvas.id;
    this.autoBindEvents = true;

    this.setTheme = function ( t ) {
      theme = t;
    };

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      var x = point.x * canvas.width / canvas.clientWidth;
      var y = point.y * canvas.height / canvas.clientHeight;
      point.set(
          Math.round( x / this.character.width ) + scroll.x - gridBounds.x,
          Math.floor( ( y / this.character.height ) - 0.25 ) + scroll.y );
    };

    this.hasResized = function () {
      var oldWidth = canvas.width,
          oldHeight = canvas.height,
          newWidth = canvas.clientWidth,
          newHeight = canvas.clientHeight;
      return oldWidth !== newWidth || oldHeight !== newHeight;
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            oldWidth = canvas.width,
            oldHeight = canvas.height,
            newWidth = ( strictSize && strictSize.width ) ||
            canvas.clientWidth,
            newHeight = ( strictSize && strictSize.height ) ||
            canvas.clientHeight,
            oldFont = gfx.font;
        this.character.height = theme.fontSize;
        gfx.font = this.character.height + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( changed ) {
          rowCache = {};
        }

        if ( newWidth > 0 && newHeight > 0 ) {
          bgCanvas.width =
              fgCanvas.width =
              trimCanvas.width =
              canvas.width = newWidth;
          bgCanvas.height =
              fgCanvas.height =
              trimCanvas.height =
              canvas.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      return this.resize();
    };

    this.getWidth = function () {
      return canvas.width;
    };

    this.getHeight = function () {
      return canvas.height;
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, gridBounds, scroll, frontCursor, backCursor, focused ) {
      var minCursor = Primrose.Text.Cursor.min( frontCursor, backCursor ),
          maxCursor = Primrose.Text.Cursor.max( frontCursor, backCursor ),
          tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
      }

      bgfx[clearFunc]( 0, 0, canvas.width, canvas.height );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            Primrose.Text.Themes.Default.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Primrose.Text.Cursor.max( minCursor,
                  tokenFront );
              var selectionBack = Primrose.Text.Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  Primrose.Text.Themes.Default.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect( bgfx, cc, minCursor.x, minCursor.y, w, 1 );
        fillRect( bgfx, cc, maxCursor.x, maxCursor.y, w, 1 );
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll, lines ) {
      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          lineOffsetY = Math.ceil( self.character.height * 0.2 ),
          i;

      fgfx.clearRect( 0, 0, canvas.width, canvas.height );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width, 0 );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var line = lines[y],
            row = tokenRows[y],
            drawn = false,
            textY = ( y + 1 - scroll.y ) * self.character.height,
            imageY = ( y - scroll.y ) * self.character.height + lineOffsetY;

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            if ( rowCache[line] !== undefined ) {
              if ( i === 0 ) {
                fgfx.putImageData( rowCache[line], 0, imageY );
              }
            }
            else {
              var style = theme[t.type] || {};
              var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                  " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                  " " + self.character.height + "px " + theme.fontFamily;
              fgfx.font = font.trim();
              fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
              fgfx.fillText(
                  t.value,
                  tokenFront.x * self.character.width,
                  textY );
              drawn = true;
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
        if ( drawn && rowCache[line] === undefined ) {
          rowCache[line] = fgfx.getImageData(
              0,
              imageY,
              fgCanvas.width,
              self.character.height );
        }
      }
      fgfx.restore();
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth ) {

      var tokenFront = new Primrose.Text.Cursor(),
          tokenBack = new Primrose.Text.Cursor(),
          maxLineWidth = 0,
          i;

      tgfx.clearRect( 0, 0, canvas.width, canvas.height );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      for ( var y = 0, lastLine = -1; y < tokenRows.length; ++y ) {
        var row = tokenRows[y];

        for ( i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;
          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );

        if ( showLineNumbers && scroll.y <= y && y < scroll.y + gridBounds.height ) {
          // draw the tokens on this row
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              Primrose.Text.Themes.Default.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, ( y + 1 ) * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            Primrose.Text.Themes.Default.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              canvas.width - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      if ( theme ) {
        var textUnchanged = scroll.y === lastScrollY &&
            scroll.x === lastScrollX &&
            lastLines !== null &&
            lastLines.length === lines.length,
            cursorUnchanged = frontCursor.i === lastFrontCursorI && lastBackCursorI === backCursor.i;
        for ( var i = 0; i < lines.length && textUnchanged; ++i ) {
          textUnchanged = lastLines[i] === lines[i];
        }
        
        if ( !textUnchanged || !cursorUnchanged ) {
          renderCanvasBackground( tokenRows, gridBounds, scroll, frontCursor, backCursor, focused );
          
          if(!textUnchanged){
            renderCanvasForeground( tokenRows, gridBounds, scroll, lines );
            renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers, showScrollBars, wordWrap, lineCountWidth );
          }

          gfx.clearRect( 0, 0, canvas.width, canvas.height );
          gfx.drawImage( bgCanvas, 0, 0 );
          gfx.drawImage( fgCanvas, 0, 0 );
          gfx.drawImage( trimCanvas, 0, 0 );
          
          if ( texture ) {
            texture.needsUpdate = true;
          }
          
          lastLines = lines;
          lastScrollY = scroll.y;
          lastScrollX = scroll.x;
          lastFrontCursorI = frontCursor.i;
          lastBackCursorI = backCursor.i;
        }
      }
    };

    this.getDOMElement = function () {
      return canvas;
    };

    this.getTexture = function (  ) {
      if ( typeof window.THREE !== "undefined" && !texture ) {
        texture = new THREE.Texture( canvas );
        texture.needsUpdate = true;
      }
      return texture;
    };

    this.getPickingTexture = function () {
      if ( !pickingTexture ) {
        var c = document.createElement( "canvas" ),
            w = this.getWidth(),
            h = this.getHeight();
        c.width = w;
        c.height = h;

        var gfx = c.getContext( "2d" ),
            pixels = gfx.createImageData( w, h );

        for ( var i = 0,
            p = 0,
            l = w * h; i < l; ++i, p += 4 ) {
          pixels.data[p] = ( 0xff0000 & i ) >> 16;
          pixels.data[p + 1] = ( 0x00ff00 & i ) >> 8;
          pixels.data[p + 2] = ( 0x0000ff & i ) >> 0;
          pixels.data[p + 3] = 0xff;
        }
        gfx.putImageData( pixels, 0, 0 );
        pickingTexture = new THREE.Texture( c, THREE.UVMapping,
            THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter,
            THREE.NearestMipMapNearestFilter, THREE.RGBAFormat,
            THREE.UnsignedByteType, 0 );
        pickingTexture.needsUpdate = true;
      }
      return pickingTexture;
    };

    this.getPixelIndex = function ( gl, x, y ) {
      if ( !pickingPixelBuffer ) {
        pickingPixelBuffer = new Uint8Array( 4 );
      }

      gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE,
          pickingPixelBuffer );

      var i = ( pickingPixelBuffer[0] << 16 ) |
          ( pickingPixelBuffer[1] << 8 ) |
          ( pickingPixelBuffer[2] << 0 );
      return {x: i % canvas.clientWidth, y: i / canvas.clientWidth};
    };


    if ( !( canvasElementOrID instanceof window.HTMLCanvasElement ) &&
        strictSize ) {
      canvas.style.position = "absolute";
      canvas.style.width = strictSize.width;
      canvas.style.height = strictSize.height;
    }

    if ( !canvas.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          canvas.id, canvas ) );
    }
  };
} )();
;/*global THREE, qp, Primrose */
Primrose.Text.Renderers.DOM = ( function ( ) {
  "use strict";

  var Size = Primrose.Text.Size,
      Cursor = Primrose.Text.Cursor,
      defaultTheme = Primrose.Text.Themes.Default;

  function FakeContext ( target ) {
    var self = this;
    this.font = null;
    this.fillStyle = null;
    var translate = [ new Point() ];

    function setFont(elem){
      elem.style.font = self.font;
      elem.style.lineHeight = px(parseInt(self.font, 10));
      elem.style.padding = "0";
      elem.style.margin = "0";
    }

    this.measureText = function ( txt ) {
      var tester = document.createElement( "div" );
      setFont(tester);
      tester.style.position = "absolute";
      tester.style.visibility = "hidden";
      tester.innerHTML = txt;
      document.body.appendChild( tester );
      var size = new Size( tester.clientWidth, tester.clientHeight );
      document.body.removeChild( tester );
      return size;
    };

    this.clearRect = function(){
        target.innerHTML = "";
    };

    this.drawImage = function(img, x, y){
      var top = translate[translate.length - 1];
      img.style.position = "absolute";
      img.style.left = px(x + top.x);
      img.style.top = px(y + top.y);
      target.appendChild(img);
    };

    this.fillRect = function ( x, y, w, h ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "div" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x);
      box.style.top = px( y + top.y );
      box.style.width = px( w );
      box.style.height = px( h );
      box.style.backgroundColor = this.fillStyle;
      target.appendChild( box );
    };

    this.fillText = function(str, x, y){
      var top = translate[translate.length - 1];
      var box = document.createElement( "span" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      box.style.whiteSpace = "pre";
      setFont(box);
      box.style.color = this.fillStyle;
      box.appendChild(document.createTextNode(str));
      target.appendChild( box );
    };

    this.save = function () {
      var top = translate[translate.length - 1];
      translate.push(top.clone());
    };

    this.restore = function(){
      translate.pop();
    };

    this.translate = function(x, y){
      var top = translate[translate.length - 1];
      top.x += x;
      top.y += y;
    };
  }

  window.HTMLDivElement.prototype.getContext = function ( type ) {
    if ( type !== "2d" ) {
      throw new Exception( "type parameter needs to be '2d'." );
    }
    this.style.width = pct(100);
    this.style.height = pct(100);
    return new FakeContext( this );
  };

  return function ( domElementOrID, options ) {
    var self = this,
        div = cascadeElement( domElementOrID, "div",
            window.HTMLDivElement ),
        bgDiv = cascadeElement( div.id + "-back", "div",
            window.HTMLDivElement ),
        fgDiv = cascadeElement( div.id + "-front", "div",
            window.HTMLDivElement ),
        trimDiv = cascadeElement( div.id + "-trim", "div",
            window.HTMLDivElement ),
        gfx = div.getContext( "2d" ),
        fgfx = fgDiv.getContext( "2d" ),
        bgfx = bgDiv.getContext( "2d" ),
        tgfx = trimDiv.getContext( "2d" ),
        theme = null,
        oldWidth = null,
        oldHeight = null;

    this.VSCROLL_WIDTH = 2;

    this.character = new Size();
    this.id = div.id;
    this.autoBindEvents = true;

    this.setTheme = function ( t ) {
      theme = t;
    };

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      point.set(
          Math.round( point.x / this.character.width ) + scroll.x -
          gridBounds.x,
          Math.floor( ( point.y / this.character.height ) - 0.25 ) +
          scroll.y );
    };

    this.hasResized = function () {
      var newWidth = div.clientWidth,
          newHeight = div.clientHeight;
      return oldWidth !== newWidth || oldHeight !== newHeight;
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            newWidth = div.clientWidth,
            newHeight = div.clientHeight,
            oldFont = gfx.font;
        this.character.height = theme.fontSize;
        gfx.font = px( this.character.height ) + " " + theme.fontFamily;

        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( newWidth > 0 && newHeight > 0 ) {
          bgDiv.width =
              fgDiv.width =
              trimDiv.width = newWidth;
          bgDiv.height =
              fgDiv.height =
              trimDiv.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;

          oldWidth = newWidth;
          oldHeight = newHeight;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      div.style.width = px( w );
      div.style.height = px( h );
      return this.resize();
    };

    this.getWidth = function () {
      return oldWidth;
    };

    this.getHeight = function () {
      return oldHeight;
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, frontCursor, backCursor,
        gridBounds, scroll, focused ) {
      var minCursor = Cursor.min( frontCursor, backCursor ),
          maxCursor = Cursor.max( frontCursor, backCursor ),
          tokenFront = new Cursor(),
          tokenBack = new Cursor();

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
        bgDiv.style.backgroundColor = theme.regular.backColor;
      }

      bgfx.clearRect( 0, 0, oldWidth, oldHeight );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            defaultTheme.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Cursor.max( minCursor, tokenFront );
              var selectionBack = Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  defaultTheme.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
        fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll ) {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          maxLineWidth = 0;

      fgfx.clearRect( 0, 0, oldWidth, oldHeight );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];
        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            var style = theme[t.type] || { };
            var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                " " + self.character.height + "px " + theme.fontFamily;
            fgfx.font = font.trim();
            fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
            fgfx.fillText(
                t.value,
                tokenFront.x * self.character.width,
                y * self.character.height );
          }

          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }
      fgfx.restore();
      return maxLineWidth;
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, maxLineWidth ) {
      tgfx.clearRect( 0, 0, oldWidth, oldHeight );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      if ( showLineNumbers ) {
        for ( var y = scroll.y,
            lastLine = -1; y < scroll.y + gridBounds.height && y <
            tokenRows.length; ++y ) {
          // draw the tokens on this row
          var row = tokenRows[y];
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              defaultTheme.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, y * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            defaultTheme.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              oldWidth - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows, lines,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      var maxLineWidth = 0;

      renderCanvasBackground( tokenRows, frontCursor, backCursor, gridBounds,
          scroll, focused );
      maxLineWidth = renderCanvasForeground( tokenRows, gridBounds, scroll );
      renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers,
          showScrollBars, wordWrap, lineCountWidth, maxLineWidth );

      gfx.clearRect( 0, 0, oldWidth, oldHeight );
      gfx.drawImage( bgDiv, 0, 0 );
      gfx.drawImage( fgDiv, 0, 0 );
      gfx.drawImage( trimDiv, 0, 0 );
    };

    this.getDOMElement = function () {
      return div;
    };

    if ( !( domElementOrID instanceof window.HTMLDivElement ) &&
        options.width && options.height ) {
      div.style.position = "absolute";
      div.style.width = options.width;
      div.style.height = options.height;
    }

    if ( !div.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          div.id, div ) );
    }
  };
} );
;/* global Primrose */
Primrose.Text.Themes.Dark = ( function ( ) {
  "use strict";
  return {
    name: "Dark",
    fontFamily: "monospace",
    cursorColor: "white",
    fontSize: 14,
    lineNumbers: {
      foreColor: "white"
    },
    regular: {
      backColor: "black",
      foreColor: "#c0c0c0",
      currentRowBackColor: "#202020",
      selectedBackColor: "#404040"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "yellow",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "cyan"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();
;/* global Primrose */
Primrose.Text.Themes.Default = ( function ( ) {
  "use strict";
  return {
    name: "Light",
    fontFamily: "monospace",
    cursorColor: "black",
    fontSize: 14,
    regular: {
      backColor: "white",
      foreColor: "black",
      currentRowBackColor: "#f0f0f0",
      selectedBackColor: "#c0c0c0"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "grey",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "blue"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();
Primrose.VERSION = "v0.16.9";
console.log("Using Primrose v0.16.9. Find out more at http://www.primroseeditor.com");