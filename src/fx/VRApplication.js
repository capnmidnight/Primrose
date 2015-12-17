/* global Primrose, CANNON, THREE, io, CryptoJS, fmt, Notification, requestFullScreen, isFullScreenMode, Function, isMobile */
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
      FORWARD = new THREE.Vector3( 0, 0, -1 ),
      POINTER_RADIUS = 0.01,
      POINTER_RESCALE = 20;
  function VRApplication ( name, options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );
    Primrose.ChatApplication.call( this, name, this.options );
    this.listeners = {
      ready: [ ],
      update: [ ]
    };

    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;
    this.qRoll = new THREE.Quaternion( );
    this.qPitch = new THREE.Quaternion( );
    this.qHeading = new THREE.Quaternion( );
    this.onground = true;
    this.lt = 0;
    this.frame = 0;
    this.enableMousePitch = true;
    this.audio = new Primrose.Output.Audio3D( );
    this.music = new Primrose.Output.Music( this.audio.context );
    this.temp = new THREE.Matrix4( );
    this.currentUser = new THREE.Object3D( );
    this.currentUser.velocity = new THREE.Vector3( );
    this.pointer = textured( sphere( POINTER_RADIUS, 10, 10 ), 0xff0000 );
    this.pointer.targetPosition = new THREE.Vector3();
    this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    this.pointer.material.opacity = 0.75;
    this.currentUser.position.set( 0, this.avatarHeight, 0 );
    this.vrParams = null;
    this.inVR = false;
    this.currentHeading = 0;
    this.stereoSettings = [ {
        transform: new THREE.Matrix4( ),
        viewport: new THREE.Box2( )
      }, {
        transform: new THREE.Matrix4( ),
        viewport: null
      } ];
    this.buttons = [ ];
    this.editors = [ ];
    this.currentEditor = null;
    this.projector = new Primrose.Workerize( Primrose.Projector );
    this.projector.ready = true;
    this.currentHit = null;
    this.vrRequested = false;

    //
    // keyboard input
    //
    this.keyboard = new Primrose.Input.Keyboard( "keyboard", window, [
      {name: "strafeLeft", buttons: [
          -Primrose.Input.Keyboard.A,
          -Primrose.Input.Keyboard.LEFTARROW ]},
      {name: "strafeRight", buttons: [
          Primrose.Input.Keyboard.D,
          Primrose.Input.Keyboard.RIGHTARROW ]},
      {name: "driveForward", buttons: [
          -Primrose.Input.Keyboard.W,
          -Primrose.Input.Keyboard.UPARROW ]},
      {name: "driveBack", buttons: [
          Primrose.Input.Keyboard.S,
          Primrose.Input.Keyboard.DOWNARROW ]},
      {name: "jump", buttons: [
          -Primrose.Input.Keyboard.CTRL,
          -Primrose.Input.Keyboard.ALT,
          -Primrose.Input.Keyboard.SHIFT,
          Primrose.Input.Keyboard.SPACEBAR ],
        commandDown: function () {
          this.jump();
        }.bind( this ), dt: 0.5},
      {name: "zero", buttons: [
          -Primrose.Input.Keyboard.CTRL,
          -Primrose.Input.Keyboard.ALT,
          -Primrose.Input.Keyboard.SHIFT,
          Primrose.Input.Keyboard.Z ],
        commandUp: function () {
          this.zero();
        }.bind( this )}
    ] );
    //
    // mouse input
    //
    this.mouse = new Primrose.Input.Mouse( "mouse", this.ctrls.frontBuffer, [
      {name: "dButtons", axes: [ Primrose.Input.Mouse.BUTTONS ], delta: true},
      {name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5},
      {name: "heading", commands: [ "dx" ], integrate: true},
      {name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5},
      {name: "pitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5},
      {name: "pointerPitch", commands: [ "dy" ], integrate: true, min: -Math.PI * 0.25, max: Math.PI * 0.25}
    ] );

    //
    // touch input
    //
    this.touch = new Primrose.Input.Touch( "touch", this.ctrls.frontBuffer, [
      {name: "dFingers", axes: [ Primrose.Input.Touch.FINGERS ], delta: true}
    ] );


    //
    // gamepad input
    //
    this.gamepad = new Primrose.Input.Gamepad( "gamepad", [
      {name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ]},
      {name: "drive", axes: [ Primrose.Input.Gamepad.LSY ]},
      {name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true
      },
      {name: "dheading", commands: [ "heading" ], delta: true},
      {name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true}
    ] );
    //
    // VR input
    //
    function setStereoSettings ( vrParams ) {
      setStereoSetting( this.stereoSettings[0], vrParams.left );
      setStereoSetting( this.stereoSettings[1], vrParams.right );
    }

    function setStereoSetting ( s, eye ) {
      s.transform.makeTranslation( eye.eyeTranslation.x, eye.eyeTranslation.y,
          eye.eyeTranslation.z );
      s.viewport = eye.renderRect;
    }

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
    this.vr.addEventListener( "vrdeviceconnected", connectVR.bind( this ),
        false );
    this.vr.addEventListener( "vrdevicelost", connectVR.bind( this ), false );

    window.addEventListener( "popstate", function ( evt ) {
      if ( isFullScreenMode() ) {
        exitFullScreen();
        evt.preventDefault();
      }
    }, true );

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

    this.renderer.enableScissorTest( true );
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

    function waitForResources ( t ) {
      this.lt = t;
      if ( this.camera && this.scene && this.buttonFactory &&
          this.buttonFactory.template ) {
        this.setSize( );
        this.scene.add( this.currentUser );
        if ( this.options.useFog ) {
          this.scene.fog = new THREE.Fog( this.options.backgroundColor, 1, 50 );
        }
        this.scene.add( this.pointer );
        this.currentUser.add( this.camera );
        if ( this.passthrough ) {
          this.camera.add( this.passthrough.mesh );
        }

        this.camera.add( light( 0xffffff, 1, 2, 0.5 ) );

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

    function defaultCamera () {
      return new THREE.PerspectiveCamera( 45, 1, 0.1,
          this.options.drawDistance );
    }

    if ( !this.options.sceneModel ) {
      this.scene = new THREE.Scene( );
      this.camera = defaultCamera.call( this );
      this.scene.Camera = this.camera;
    }
    else {
      Primrose.ModelLoader.loadScene( this.options.sceneModel, function (
          sceneGraph ) {
        this.scene = sceneGraph;
        this.camera = this.scene.Camera || defaultCamera.call( this );
        this.scene.Camera = this.camera;
      }.bind( this ) );
    }

    this.renderScene = function ( s, rt, fc ) {

      if ( !this.inVR || !this.vrParams ) {
        this.camera.position.set( 0, 0, 0 );
        this.camera.quaternion.set( 0, 0, 0, 1 );
        this.renderer.render( s, this.camera, rt, fc );
      }
      else {
        var state = this.vr.sensor.getState( );
        for ( var i = 0; i < this.stereoSettings.length; ++i ) {
          var st = this.stereoSettings[i],
              m = st.transform,
              v = st.viewport;
          this.camera.position.applyMatrix4( m );

          if ( state.orientation ) {
            this.camera.quaternion.copy( state.orientation );
            this.camera.position.applyQuaternion( this.camera.quaternion );
          }
          else {
            this.camera.quaternion.set( 0, 0, 0, 1 );
          }
          if ( state.position ) {
            this.camera.position.add( state.position );
          }
          this.renderer.setViewport( v.left, v.top, v.width, v.height );
          this.renderer.setScissor( v.left, v.top, v.width, v.height );
          this.renderer.render( s, this.camera, rt, fc );
        }
      }
    };


    function setVRMode ( ) {
      this.inVR = isFullScreenMode( ) && this.vrRequested && this.vr.display;
      if ( !isFullScreenMode() && location.hash === "#fullscreen" ) {
        location.hash = "";
      }
      this.setSize( );
    }

    this.projector.addEventListener( "hit", function ( hit ) {
      this.projector.ready = true;
      this.currentHit = hit;
    }.bind( this ) );


    this.goFullScreen = function ( useVR ) {
      this.mouse.requestPointerLock( );
      if ( !isFullScreenMode( ) ) {
        this.vrRequested = useVR;
        if ( useVR && this.vr.display ) {
          requestFullScreen( this.ctrls.frontBuffer, this.vr.display );
        }
        else {
          requestFullScreen( this.ctrls.frontBuffer );
        }
        history.pushState( null, document.title, "#fullscreen" );
      }
    };

    var FORWARDED_EVENTS = [
      "keydown", "keyup", "keypress",
      "mousedown", "mouseup", "mousemove", "wheel",
      "touchstart", "touchend", "touchmove" ];

    this.addEventListener = function ( event, thunk, bubbles ) {
      if ( this.listeners[event] ) {
        this.listeners[event].push( thunk );
      }
      else if ( FORWARDED_EVENTS.indexOf( event ) >= 0 ) {
        window.addEventListener( event, thunk, bubbles );
      }
    };

    ( function () {
      var _bind = Function.prototype.bind;
      Function.prototype.bind = function () {
        var thunk = _bind.apply( this, arguments );
        thunk.executionContext = arguments[0];
        return thunk;
      };
    } )();

    this.fire = function ( name ) {
      var args = Array.prototype.slice.call( arguments, 1 );
      for ( var i = 0; i < this.listeners[name].length; ++i ) {
        var thunk = this.listeners[name][i];
        thunk.apply( thunk.executionContext || this, args );
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

    this.setupModuleEvents = function ( container, module,
        name ) {
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

    this.setSize = function ( ) {
      var bounds = this.renderer.domElement.getBoundingClientRect( ),
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
      this.renderer.setScissor( 0, 0, canvasWidth, canvasHeight );
      if ( this.camera ) {
        this.camera.fov = fieldOfView;
        this.camera.aspect = aspectWidth / canvasHeight;
        this.camera.updateProjectionMatrix( );
      }
    };

    this.connectGamepad = function ( id ) {
      if ( !this.gamepad.isGamepadSet( ) && confirm( fmt(
          "Would you like to use this gamepad? \"$1\"", id ) ) ) {
        this.gamepad.setGamepad( id );
      }
    };

    this.zero = function ( ) {
      if ( !this.currentEditor ) {
        this.currentUser.position.set( 0, this.avatarHeight, 0 );
        this.currentUser.velocity.set( 0, 0, 0 );
      }
      if ( this.inVR ) {
        this.vr.sensor.resetSensor( );
      }
    };

    this.jump = function ( ) {
      if ( this.onground && !this.currentEditor ) {
        this.currentUser.velocity.y += this.options.jumpHeight;
        this.onground = false;
      }
    };

    this.createElement = function ( elem, id ) {
      if ( elem === "textarea" || elem === "pre" ) {
        var tokenizer = elem === "textarea" ? Primrose.Text.Grammars.JavaScript : Primrose.Text.Grammars.PlainText;
        var ed = makeEditor(
            this.scene, id,
            1, 1,
            0, 0, 0,
            0, 0, 0, {
              tokenizer: tokenizer,
              useShell: true,
              keyEventSource: window,
              wheelEventSource: this.renderer.domElement,
              theme: Primrose.Text.Themes.Default,
              hideLineNumbers: elem === "pre",
              readOnly: elem === "pre"
            } );
        this.editors.push( ed );
        this.registerPickableObject( ed );
        return ed;
      }
    };

    this.convertToEditor = function ( obj ) {
      var editor = new Primrose.Text.Controls.TextBox( "textEditor", {
        size: new Primrose.Text.Size( 1024, 1024 ),
        fontSize: 32,
        tokenizer: Primrose.Text.Grammars.Basic,
        theme: Primrose.Text.Themes.Dark,
        keyEventSource: window,
        wheelEventSource: this.renderer.domElement,
        hideLineNumbers: true
      } );
      textured( obj, editor );
      obj.textarea = editor;
      this.registerPickableObject( obj );
      return obj;
    };

    this.registerPickableObject = function ( obj ) {
      if ( obj.type === "Object3D" ) {
        obj.children[0].name = obj.children[0].name || obj.name;
        obj = obj.children[0];
      }
      if ( obj ) {
        var bag = createWorkerObject( obj );
        bag.geometry = {
          vertices: obj.geometry.vertices.map( function ( v ) {
            return v.toArray();
          } ),
          faces: obj.geometry.faces.map( function ( f ) {
            return [ f.a, f.b, f.c ];
          } ),
          faceVertexUvs: obj.geometry.faceVertexUvs.map( function ( face ) {
            return face.map( function ( uvs ) {
              return uvs.map( function ( uv ) {
                return uv.toArray();
              } );
            } );
          } )
        };
        this.editors.push( obj );
        this.projector.setObject( bag );
      }
    };

    function createWorkerObject ( obj ) {
      var bag = {
        uuid: obj.uuid,
        visible: obj.visible,
        name: obj.name
      };
      var originalBag = bag,
          head = obj;
      while ( head !== null ) {
        head.updateMatrix();
        bag.matrix = head.matrix.elements.subarray( 0, head.matrix.elements.length );
        bag.parent = head.parent ? {} : null;
        bag = bag.parent;
        head = head.parent;
      }
      return originalBag;
    }

    this.stop = function () {
      cancelAnimationFrame( this.timer );
    };

    this.findObject = function ( id ) {
      for ( var i = 0; i < this.editors.length; ++i ) {
        if ( this.editors[i].uuid === id ) {
          return this.editors[i];
        }
      }
    };

    this.animate = function ( t ) {
      this.timer = requestAnimationFrame( this.animate );
      var dt = ( t - this.lt ) * 0.001,
          heading = 0,
          pitch = 0,
          strafe = 0,
          drive = 0,
          len,
          j;

      this.lt = t;
      this.keyboard.update( dt );
      this.mouse.update( dt );
      this.touch.update( dt );
      this.gamepad.update( dt );
      this.vr.update( dt );

      heading = this.gamepad.getValue( "heading" ) +
          ( isMobile ? 0 : this.mouse.getValue( "heading" ) );
      strafe = this.gamepad.getValue( "strafe" ) +
          this.keyboard.getValue( "strafeRight" ) +
          this.keyboard.getValue( "strafeLeft" );
      drive = this.gamepad.getValue( "drive" ) +
          this.keyboard.getValue( "driveBack" ) +
          this.keyboard.getValue( "driveForward" );

      pitch = this.gamepad.getValue( "pitch" );
      if ( this.inVR ) {
        pitch += this.mouse.getValue( "pointerPitch" );
      }
      else {
        pitch += this.mouse.getValue( "pitch" );
      }
      this.qPitch.setFromAxisAngle( RIGHT, pitch );

      if ( !this.onground ) {
        this.currentUser.velocity.y -= this.options.gravity * dt;
      }
      else if ( !this.currentEditor || this.currentEditor.readOnly ) {

        if ( strafe || drive ) {
          len = drive * drive + strafe * strafe;
          len = this.walkSpeed / Math.max( 1, Math.sqrt( len ) );
        }
        else {
          len = 0;
        }

        strafe *= len * dt;
        drive *= len * dt;

        this.qHeading.setFromAxisAngle( UP, this.currentHeading );
        this.currentUser.velocity.set( strafe, 0, drive );
        this.currentUser.velocity.applyQuaternion( this.qHeading );
      }

      this.currentUser.position.add( this.currentUser.velocity );
      if ( !this.onground && this.currentUser.position.y < this.avatarHeight ) {
        this.onground = true;
        this.currentUser.position.y = this.avatarHeight;
        this.currentUser.velocity.y = 0;
      }


      if ( !this.inVR || isMobile ) {
        this.currentHeading = heading;
        this.currentUser.quaternion.setFromAxisAngle( UP, this.currentHeading );
        if ( !isMobile ) {
          this.currentUser.quaternion.multiply( this.qPitch );
        }
      }
      else {
        var dHeading = heading - this.currentHeading;
        if ( !this.currentEditor && Math.abs( dHeading ) > Math.PI / 5 ) {
          var dh = Math.sign( dHeading ) * Math.PI / 100;
          this.currentHeading += dh;
          heading -= dh;
          dHeading = heading - this.currentHeading;
        }
        this.currentUser.quaternion.setFromAxisAngle( UP, this.currentHeading );
        this.qHeading.setFromAxisAngle( UP, dHeading ).multiply( this.qPitch );
      }

      if ( this.projector.ready ) {
        this.projector.ready = false;
        this.pointer.targetPosition.copy( FORWARD );
        if ( this.inVR && !isMobile ) {
          this.pointer.targetPosition.applyQuaternion( this.qHeading );
        }
        if ( !this.currentEditor || isMobile ) {
          this.pointer.targetPosition.add( this.camera.position );
          this.pointer.targetPosition.applyQuaternion( this.camera.quaternion );
        }
        this.pointer.targetPosition.applyQuaternion( this.currentUser.quaternion );
        this.pointer.targetPosition.add( this.currentUser.position );

        for ( var i = 0; i < this.editors.length; ++i ) {
          this.projector.updateObject( createWorkerObject( this.editors[i] ) );
        }
        this.projector.projectPointer(
            this.pointer.targetPosition.toArray(),
            transformForPicking( this.currentUser ) );
      }

      var lastButtons = this.mouse.getValue( "dButtons" ) |
          this.touch.getValue( "dFingers" ),
          hit = this.currentHit;
      if ( !hit || !hit.point ) {
        if ( this.currentEditor && lastButtons > 0 ) {
          this.currentEditor.blur();
          this.currentEditor = null;
        }
        this.pointer.material.color.setRGB( 1, 0, 0 );
        this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
        this.pointer.scale.set( 1, 1, 1 );
      }
      else {
        var fp = hit.facePoint, fn = hit.faceNormal;
        this.pointer.targetPosition.set(
            fp[0] + fn[0] * POINTER_RADIUS,
            fp[1] + fn[1] * POINTER_RADIUS,
            fp[2] + fn[2] * POINTER_RADIUS );
        this.pointer.material.color.setRGB( 1, 1, 1 );
        this.pointer.material.emissive.setRGB( 0.25, 0.25, 0.25 );
        var object = hit && this.findObject( hit.objectID );
        if ( object ) {
          var buttons = this.mouse.getValue( "BUTTONS" ) | this.touch.getValue( "FINGERS" ),
              clickChanged = lastButtons > 0,
              editor = object.textarea;

          if ( editor ) {
            this.pointer.scale.set( 1, 1, 1 );
          }
          else {
            this.pointer.scale.set( POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE );
          }

          if ( clickChanged && buttons > 0 && this.currentEditor && this.currentEditor !== editor ) {
            this.currentEditor.blur();
            this.currentEditor = null;
          }

          if ( editor && !this.currentEditor && clickChanged && buttons > 0 ) {
            editor.focus();
            this.currentEditor = editor;
          }

          if ( this.currentEditor ) {
            var // At this point, the UV coord is scaled to a proporitional value, on
                // the range [0, 1] for the dimensions of the image used as the texture.
                // So we have to rescale it back out again. Also, the y coordinate is
                // flipped.
                txt = object.material.map.image,
                textureU = Math.floor( txt.width * hit.point[0] ),
                textureV = Math.floor( txt.height * ( 1 - hit.point[1] ) );
            if ( !clickChanged && buttons > 0 ) {
              this.currentEditor.movePointer( textureU, textureV );
            }
            else if ( clickChanged && buttons > 0 ) {
              this.currentEditor.startPointer( textureU, textureV );
            }
            else {
              this.currentEditor.endPointer();
            }
          }
        }
      }

      this.pointer.position.add( this.pointer.targetPosition ).multiplyScalar( 0.5 );

      this.fire( "update", dt );

      for ( j = 0; j < this.editors.length; ++j ) {
        if ( this.editors[j].textarea ) {
          this.editors[j].textarea.render();
        }
      }
      this.renderScene( this.scene );
    };


    function transformForPicking ( obj ) {
      var p = obj.position.clone();
      obj = obj.parent;
      while ( obj !== null ) {
        p.applyMatrix4( obj.matrix );
        obj = obj.parent;
      }
      return p.toArray();
    }


    if ( this.options.disableAutoFullScreen ) {
      if ( this.options.regularFullScreenButton ) {
        this.options.regularFullScreenButton.addEventListener( "click",
            this.goFullScreen.bind( this, false ), false );
      }

      if ( this.options.vrFullScreenButton ) {
        this.options.vrFullScreenButton.addEventListener( "click",
            this.goFullScreen.bind( this, true ), false );
      }
    }
    else {
      window.addEventListener( "mousedown", this.goFullScreen.bind( this, true ), false );
      window.addEventListener( "touchstart", this.goFullScreen.bind( this, true ), false );
    }

    this.gamepad.addEventListener( "gamepadconnected", this.connectGamepad.bind( this ), false );

    window.addEventListener( "fullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "webkitfullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "mozfullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "resize", this.setSize.bind( this ), false );
  }

  inherit( VRApplication, Primrose.ChatApplication );
  VRApplication.DEFAULTS = {
    useLeap: false,
    useFog: false,
    avatarHeight: 1.75,
    walkSpeed: 3,
    gravity: 0.98, // the acceleration applied to falling objects
    jumpHeight: 0.25,
    // the color that WebGL clears the background with before drawing
    backgroundColor: 0xafbfff,
    drawDistance: 500, // the far plane of the camera
    chatTextSize: 0.25, // the size of a single line of text, in world units
    dtNetworkUpdate: 0.125 // the amount of time to allow to elapse between sending state to the server
  };

  return VRApplication;
} )( );
