/* global Primrose, CANNON, THREE, io, CryptoJS, fmt, Notification, requestFullScreen, isFullScreenMode */
Primrose.VRApplication = ( function ( ) {
  if ( typeof ( THREE ) === "undefined" ) {
    return function ( ) {
    };
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
    this.listeners = {ready: [ ], update: [ ]};
    this.pointer = textured( sphere( 0.02, 16, 8 ), 0xff6633 );
    this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    this.pointer.material.opacity = 0.5;
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
    this.audio = new Primrose.Output.Audio3D( );
    this.music = new Primrose.Output.Music( this.audio.context );
    this.temp = new THREE.Matrix4( );
    this.currentUser = new THREE.Object3D( );
    this.currentUser.velocity = new THREE.Vector3( );
    this.vrParams = null;
    this.inVR = false;
    this.stereoSettings = [ {
        transform: new THREE.Matrix4( ),
        inverseTransform: new THREE.Matrix4( ),
        viewport: new THREE.Box2( )
      }, {
        transform: new THREE.Matrix4( ),
        inverseTransform: new THREE.Matrix4( ),
        viewport: null
      } ];
    this.editors = [ ];
    this.lastEditor = null;

    function setStereoSettings ( vrParams ) {
      setStereoSetting( this.stereoSettings[0], vrParams.left );
      setStereoSetting( this.stereoSettings[1], vrParams.right );
    }

    function setStereoSetting ( s, eye ) {
      setTrans( s.transform, eye.eyeTranslation, 1 );
      setTrans( s.inverseTransform, eye.eyeTranslation, -1 );
      s.viewport = eye.renderRect;
    }

    function setTrans ( m, t, i ) {
      m.makeTranslation( i * t.x, i * t.y, i * t.z );
    }

    //
    // keyboard input
    //
    this.keyboard = new Primrose.Input.Keyboard( "keyboard", window, [
      {name: "strafeLeft", buttons: [ -Primrose.Input.Keyboard.A, -Primrose.Input.Keyboard.LEFTARROW ]},
      {name: "strafeRight", buttons: [ Primrose.Input.Keyboard.D, Primrose.Input.Keyboard.RIGHTARROW ]},
      {name: "driveForward", buttons: [ -Primrose.Input.Keyboard.W, -Primrose.Input.Keyboard.UPARROW ]},
      {name: "driveBack", buttons: [ Primrose.Input.Keyboard.S, Primrose.Input.Keyboard.DOWNARROW ]},
      {name: "jump", buttons: [ -Primrose.Input.Keyboard.CTRL, -Primrose.Input.Keyboard.ALT, -Primrose.Input.Keyboard.SHIFT, Primrose.Input.Keyboard.SPACEBAR ], commandDown: this.jump.bind( this ), dt: 0.5},
      {name: "zero", buttons: [ -Primrose.Input.Keyboard.CTRL, -Primrose.Input.Keyboard.ALT, -Primrose.Input.Keyboard.SHIFT, Primrose.Input.Keyboard.Z ], commandUp: this.zero.bind( this )}
    ] );
    //
    // mouse input
    //
    this.mouse = new Primrose.Input.Mouse( "mouse", this.ctrls.frontBuffer, [
      {name: "dButtons", axes: [ Primrose.Input.Mouse.BUTTONS ], delta: true},
      {name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5},
      {name: "heading", commands: [ "dx" ], integrate: true},
      {name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5},
      {name: "pitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5}
    ] );
    window.addEventListener( "mousewheel", function ( evt ) {
      if ( this.lastEditor ) {
        this.lastEditor.readWheel( evt );
      }
    }.bind( this ), false );
    //
    // gamepad input
    //
    this.gamepad = new Primrose.Input.Gamepad( "gamepad", [
      {name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ]},
      {name: "drive", axes: [ Primrose.Input.Gamepad.LSY ]},
      {name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true},
      {name: "dheading", commands: [ "heading" ], delta: true},
      {name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true}
    ] );
    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );
    //
    // VR input
    //
    function connectVR ( id ) {
      var deviceIDs = Object.keys( this.vr.devices );
      if ( deviceIDs.length > 0 ) {
        if ( this.options.vrFullScreenButton ) {
          this.options.vrFullScreenButton.style.display = "inline-block";
        }
        this.vr.connect( deviceIDs[0] );
        this.vrParams = this.vr.getParams( );
        setStereoSettings.call( this, this.vrParams );
      }
      else if ( this.options.vrFullScreenButton ) {
        this.options.vrFullScreenButton.style.display = "none";
      }
    }

    this.vr = new Primrose.Input.VR( "vr" );
    this.vr.addEventListener( "vrdeviceconnected", connectVR.bind( this ), false );
    this.vr.addEventListener( "vrdevicelost", connectVR.bind( this ), false );

    //
    // restoring the options the user selected
    //
    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function ( ) {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );

    //
    // Setup THREE.js
    //
    this.renderer = new THREE.WebGLRenderer( {
      antialias: true,
      alpha: true,
      canvas: this.ctrls.frontBuffer
    } );
    this.renderer.setClearColor( this.options.backgroundColor );
    if ( this.options.button ) {
      this.buttonFactory = new Primrose.ButtonFactory(
          this.options.button.model,
          this.options.button.options );
    }
    else {
      this.buttonFactory = new Primrose.ButtonFactory(
          brick( 0xff0000, 1, 1, 1 ), {
        maxThrow: 0.1,
        minDeflection: 10,
        colorUnpressed: 0x7f0000,
        colorPressed: 0x007f00,
        toggle: true
      } );
    }

    this.buttons = [ ];

    function waitForResources ( t ) {
      this.lt = t;
      if ( this.camera && this.scene && this.buttonFactory && this.buttonFactory.template ) {
        this.scene.add( this.pointer );
        this.setSize( );
        if ( this.passthrough ) {
          this.camera.add( this.passthrough.mesh );
        }

        this.fire( "ready" );
        this.animate = this.animate.bind( this );
        requestAnimationFrame( this.animate );
      }
      else {
        requestAnimationFrame( waitForResources.bind( this ) );
      }
    }

    this.start = function ( ) {
      requestAnimationFrame( waitForResources.bind( this ) );
    };
    if ( !this.options.sceneModel ) {
      this.scene = new THREE.Scene( );
      this.camera = new THREE.PerspectiveCamera( 45, 1, 0.1, this.options.drawDistance );
      this.scene.Camera = this.camera;
      this.scene.add( this.camera );
    }
    else {
      Primrose.ModelLoader.loadScene( this.options.sceneModel, function ( sceneGraph ) {
        this.scene = sceneGraph;
        this.camera = this.scene.Camera;
        this.currentUser.position.copy( this.camera.position );
        this.currentUser.position.y -= this.options.avatarHeight;
      }.bind( this ) );
    }

    window.addEventListener( "resize", this.setSize.bind( this ), false );
    this.renderScene = function ( s, rt, fc ) {
      if ( !this.inVR || !this.vrParams ) {
        this.renderer.render( s, this.camera, rt, fc );
      }
      else if ( this.renderer.renderStereo ) {
        this.renderer.renderStereo( s, this.camera, this.stereoSettings, rt, fc );
      }
      else {
        this.renderer.enableScissorTest( true );
        for ( var i = 0; i < this.stereoSettings.length; ++i ) {
          var st = this.stereoSettings[i],
              m = st.transform,
              mI = st.inverseTransform,
              v = st.viewport;
          this.renderer.setViewport( v.left, v.top, v.width, v.height );
          this.renderer.setScissor( v.left, v.top, v.width, v.height );
          this.camera.matrixWorld.multiply( m );
          this.renderer.render( s, this.camera, rt, fc );
          this.camera.matrixWorld.multiply( mI );
        }
      }
    };
    if ( this.options.disableAutoFullScreen ) {
      if ( this.options.regularFullScreenButton ) {
        this.options.regularFullScreenButton.addEventListener( "click", this.goFullScreen.bind( this ), false );
      }

      if ( this.options.vrFullScreenButton ) {
        this.options.vrFullScreenButton.addEventListener( "click", this.goFullScreen.bind( this ), false );
      }
    }
    else {
      window.addEventListener( "mousedown", this.goFullScreen.bind( this ), false );
    }

    function setVRMode ( evt ) {
      if ( this.vr.display ) {
        this.inVR = isFullScreenMode( );
      }
      this.setSize( );
    }
    window.addEventListener( "fullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "webkitfullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "mozfullscreenchange", setVRMode.bind( this ), false );
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

  VRApplication.prototype.goFullScreen = function ( ) {
    this.mouse.requestPointerLock( );
    if ( !isFullScreenMode( ) ) {
      if ( this.vr.display ) {
        requestFullScreen( this.ctrls.frontBuffer, this.vr.display );
      }
      else {
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
    e.addEventListener( "change", function ( ) {
      module.enable( e.checked );
      t.disabled = !e.checked;
      if ( t.checked && t.disabled ) {
        t.checked = false;
      }
    } );
    t.addEventListener( "change", function ( ) {
      module.transmit( t.checked );
    } );
    r.addEventListener( "change", function ( ) {
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
    var bounds = this.ctrls.frontBuffer.getBoundingClientRect( ),
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
    if ( this.camera ) {
      this.camera.fov = fieldOfView;
      this.camera.aspect = aspectWidth / canvasHeight;
      this.camera.updateProjectionMatrix( );
    }
  };

  VRApplication.prototype.connectGamepad = function ( id ) {
    if ( !this.gamepad.isGamepadSet( ) && confirm( fmt(
        "Would you like to use this gamepad? \"$1\"", id ) ) ) {
      this.gamepad.setGamepad( id );
    }
  };

  VRApplication.prototype.zero = function ( ) {
    if ( !this.lastEditor ) {
      this.currentUser.position.set( 0, 0, 0 );
      this.currentUser.velocity.set( 0, 0, 0 );
    }
    if ( this.inVR ) {
      this.vr.sensor.resetSensor( );
    }
  };

  VRApplication.prototype.jump = function ( ) {
    if ( this.onground && !this.lastEditor ) {
      this.currentUser.velocity.y += this.options.jumpHeight;
      this.onground = false;
    }
  };

  VRApplication.prototype.createElement = function ( elem, id ) {
    if ( elem === "textarea" ) {
      var ed = makeEditor(
          this.scene, id,
          1, 1,
          0, 0, 0,
          0, 0, 0, {
            tokenizer: Primrose.Text.Grammars.JavaScript,
            fontSize: 20,
            keyEventSource: window
          } );
      this.editors.push( ed );
      return ed;
    }
  };

  VRApplication.prototype.animate = function ( t ) {
    requestAnimationFrame( this.animate );
    var dt = ( t - this.lt ) * 0.001,
        heading = 0,
        pitch = 0,
        strafe,
        drive,
        len,
        j;

    this.lt = t;
    this.keyboard.update( dt );
    this.mouse.update( dt );
    this.gamepad.update( dt );
    this.vr.update( dt );
    for ( j = 0; j < this.editors.length; ++j ) {
      this.editors[j].render();
    }

    if ( !this.inVR ) {
      pitch = this.gamepad.getValue( "pitch" ) +
          this.mouse.getValue( "pitch" );
    }

    if ( this.onground ) {

      heading = this.gamepad.getValue( "heading" ) +
          this.mouse.getValue( "heading" );
      strafe = this.gamepad.getValue( "strafe" );
      drive = this.gamepad.getValue( "drive" );

      if ( !this.lastEditor ) {
        strafe += this.keyboard.getValue( "strafeRight" ) +
            this.keyboard.getValue( "strafeLeft" );
        drive += this.keyboard.getValue( "driveBack" ) +
            this.keyboard.getValue( "driveForward" );
      }

      if ( strafe || drive ) {
        len = drive * drive + strafe * strafe;
        len = this.walkSpeed / Math.max( 1, Math.sqrt( len ) );
      }
      else {
        len = 0;
      }

      strafe *= len;
      drive *= len;
      len = strafe * Math.cos( heading ) + drive * Math.sin( heading );
      drive = ( drive * Math.cos( heading ) - strafe * Math.sin( heading ) ) * dt;
      strafe = len * dt;
      this.qPitch.setFromAxisAngle( RIGHT, pitch );
      this.currentUser.velocity.x = strafe;
      this.currentUser.velocity.z = drive;
      this.currentUser.quaternion.setFromAxisAngle( UP, heading );
      this.currentUser.quaternion.multiply( this.qPitch );
    }
    else {
      this.currentUser.velocity.y -= this.options.gravity * dt;
    }

    this.currentUser.position.add( this.currentUser.velocity );
    if ( !this.onground && this.currentUser.position.y < 0 ) {
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
      var state = this.vr.sensor.getState( );
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

    this.pointer.position
        .set( 0, 0, -1 )
        .applyQuaternion( this.camera.quaternion )
        .add( this.camera.position );

    var hit = Primrose.Input.Mouse.projectPointer( this.pointer.position, this.camera.position, this.editors ),
        lastButtons = this.mouse.getValue( "dButtons" );
    if ( !hit || 0 > hit.point.x || hit.point.x > 1 || 0 > hit.point.y || hit.point.y > 1 ) {
      if ( this.lastEditor && lastButtons > 0 ) {
        this.lastEditor.blur();
        this.lastEditor = null;
      }
      this.pointer.material.color.setRGB( 1, 0, 0 );
      this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    }
    else if ( hit.object ) {
      var editor = hit.object,
          // At this point, the UV coord is scaled to a proporitional value, on
          // the range [0, 1] for the dimensions of the image used as the texture.
          // So we have to rescale it back out again. Also, the y coordinate is
          // flipped.
          txt = editor.mesh.material.map.image,
          textureU = Math.floor( txt.width * hit.point.x ),
          textureV = Math.floor( txt.height * ( 1 - hit.point.y ) ),
          buttons = this.mouse.getValue( "BUTTONS" );

      if ( buttons > 0 ) {
        if ( this.lastEditor && this.lastEditor !== editor ) {
          this.lastEditor.blur();
          this.lastEditor = null;
        }
        if ( lastButtons !== buttons ) {
          editor.movePointer( textureU, textureV );
        }
        else {
          if ( !editor.focused ) {
            editor.focus();
            this.lastEditor = editor;
          }
          editor.startPointer( textureU, textureV );
        }
      }
      else if ( lastButtons < 0 ) {
        editor.endPointer();
      }


      // move the demo pointer into place on the surface of the face
      this.pointer.position.sub( hit.axis.clone().multiplyScalar( hit.distance ) )
          .add( hit.axis.multiplyScalar( 0.01 ) );
      this.pointer.material.color.setRGB( 0, 1, 0 );
      this.pointer.material.emissive.setRGB( 0, 0.25, 0 );
    }

    this.fire( "update", dt );
    this.renderScene( this.scene );
  };

  return VRApplication;
} )( );
