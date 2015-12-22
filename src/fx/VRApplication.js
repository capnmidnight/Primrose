/* global Primrose, CANNON, THREE, io, CryptoJS, fmt, Notification, requestFullScreen, isFullScreenMode, Function, fireAll, isMobile */
Primrose.VRApplication = ( function ( ) {
  if ( typeof THREE === "undefined" ) {
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
      POINTER_RESCALE = 20,
      FORWARDED_EVENTS = [
        "keydown", "keyup", "keypress",
        "mousedown", "mouseup", "mousemove", "wheel",
        "touchstart", "touchend", "touchmove" ];
  function VRApplication ( name, options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );
    Primrose.ChatApplication.call( this, name, this.options );
    this.listeners = {
      ready: [ ],
      update: [ ]
    };

    //
    // Initialize local variables
    //
    var lt = 0,
        vrRequest = false,
        currentHit = null,
        currentHeading = 0,
        qPitch = new THREE.Quaternion( ),
        qHeading = new THREE.Quaternion( ),
        qHead = new THREE.Quaternion( ),
        skin = Primrose.SKINS[randomInt( Primrose.SKINS.length )],
        skinCode = parseInt( skin.substring( 1 ), 16 );

    //
    // Initialize public properties
    //
    this.onground = true;
    this.inVR = false;
    this.currentEditor = null;
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;
    this.audio = new Primrose.Output.Audio3D( );
    this.music = new Primrose.Output.Music( this.audio.context );
    this.currentUser = new THREE.Object3D( );
    this.pointer = textured( sphere( POINTER_RADIUS, 10, 10 ), 0xff0000 );
    this.nose = textured( sphere( 0.05, 10, 10 ), skinCode );
    this.buttons = [ ];
    this.pickableObjects = [ ];
    this.projector = new Primrose.Workerize( Primrose.Projector );
    this.input = new Primrose.Input.FPSInput( this.ctrls.frontBuffer );

    //
    // Setup base state
    //
    this.currentUser.velocity = new THREE.Vector3( );
    this.currentUser.position.set( 0, this.avatarHeight, 0 );
    this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    this.pointer.material.opacity = 0.75;
    this.nose.name = "Nose";
    this.nose.scale.set( 0.5, 1, 1 );
    this.projector.ready = true;

    function setSize ( ) {
      var bounds = this.renderer.domElement.getBoundingClientRect( ),
          styleWidth = bounds.width,
          styleHeight = bounds.height,
          ratio = window.devicePixelRatio || 1,
          fieldOfView = 75,
          canvasWidth = styleWidth * ratio,
          canvasHeight = styleHeight * ratio,
          aspectWidth = canvasWidth;
      if ( this.inVR ) {
        var p = this.input.vr.params,
            l = p.left,
            r = p.right;
        canvasWidth = l.renderRect.width + r.renderRect.width;
        canvasHeight = Math.max( l.renderRect.height, r.renderRect.height );
        aspectWidth = canvasWidth / 2;
        fieldOfView = ( l.recommendedFieldOfView.leftDegrees + l.recommendedFieldOfView.rightDegrees );
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
    }

    function waitForResources ( t ) {
      lt = t;
      if ( this.camera && this.scene && this.buttonFactory && this.buttonFactory.template ) {
        setSize.call( this );
        this.scene.add( this.currentUser );
        this.scene.add( this.pointer );
        this.currentUser.add( this.camera );
        this.camera.near = 0.01;
        this.camera.far = this.options.drawDistance * 2;
        this.camera.add( this.nose );
        this.camera.add( light( 0xffffff, 1, 2, 0.5 ) );

        if ( this.options.useFog ) {
          this.scene.fog = new THREE.FogExp2( this.options.backgroundColor, 2 / this.options.drawDistance );
        }

        if ( this.options.skyTexture ) {
          this.sky = textured(
              shell(
                  this.options.drawDistance,
                  18,
                  9,
                  Math.PI * 2,
                  Math.PI ),
              this.options.skyTexture,
              true );
          this.sky.name = "Sky";
          this.scene.add( this.sky );
        }

        if ( this.options.groundTexture ) {
          var dim = 2 * this.options.drawDistance,
              gm = new THREE.PlaneGeometry( dim, dim, dim, dim );
          this.ground = textured( gm, this.options.groundTexture, false, 1, dim, dim );
          this.ground.rotation.x = Math.PI / 2;
          this.ground.name = "Ground";
          this.scene.add( this.ground );
          this.registerPickableObject( this.ground );
        }

        if ( this.passthrough ) {
          this.camera.add( this.passthrough.mesh );
        }

        fireAll.call( this, "ready" );
        requestAnimationFrame( animate );
      }
      else {
        requestAnimationFrame( waitForResources.bind( this ) );
      }
    }

    function createPickableObject ( obj ) {
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

    function transformForPicking ( obj ) {
      var p = obj.position.clone();
      obj = obj.parent;
      while ( obj !== null ) {
        p.applyMatrix4( obj.matrix );
        obj = obj.parent;
      }
      return p.toArray();
    }

    function addCell ( row, elem ) {
      if ( typeof elem === "string" ) {
        elem = document.createTextNode( elem );
      }
      var cell = document.createElement( "td" );
      cell.appendChild( elem );
      row.appendChild( cell );
    }

    this.setupModuleEvents = function ( container, module, name ) {
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
      e.addEventListener( "change", function ( t, module ) {
        module.enable( this.checked );
        t.disabled = !this.checked;
        if ( t.checked && t.disabled ) {
          t.checked = false;
        }
      }.bind( e, t, module ) );
      t.addEventListener( "change", function ( module ) {
        module.transmit( this.checked );
      }.bind( t, module ) );
      r.addEventListener( "change", function ( module ) {
        module.receive( this.checked );
      }.bind( r, module ) );
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

    this.start = function ( ) {
      requestAnimationFrame( waitForResources.bind( this ) );
    };

    this.stop = function () {
      cancelAnimationFrame( this.timer );
    };

    this.goFullScreen = function ( useVR ) {
      this.input.mouse.requestPointerLock( );
      if ( !isFullScreenMode( ) ) {
        vrRequest = useVR;
        if ( useVR && this.input.vr.display ) {
          requestFullScreen( this.ctrls.frontBuffer, this.input.vr.display );
        }
        else {
          requestFullScreen( this.ctrls.frontBuffer );
        }
        history.pushState( null, document.title, "#fullscreen" );
      }
    };

    this.addEventListener = function ( event, thunk, bubbles ) {
      if ( this.listeners[event] ) {
        this.listeners[event].push( thunk );
      }
      else if ( FORWARDED_EVENTS.indexOf( event ) >= 0 ) {
        window.addEventListener( event, thunk, bubbles );
      }
    };

    this.zero = function ( ) {
      if ( !this.currentEditor ) {
        this.currentUser.position.set( 0, this.avatarHeight, 0 );
        this.currentUser.velocity.set( 0, 0, 0 );
      }
      if ( this.inVR ) {
        this.input.vr.sensor.resetSensor( );
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
        var bag = createPickableObject( obj );
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
        this.pickableObjects.push( obj );
        this.projector.setObject( bag );
      }
    };

    this.findObject = function ( id ) {
      for ( var i = 0; i < this.pickableObjects.length; ++i ) {
        if ( this.pickableObjects[i].uuid === id ) {
          return this.pickableObjects[i];
        }
      }
    };

    var animate = function ( t ) {
      this.timer = requestAnimationFrame( animate );
      var dt = ( t - lt ) * 0.001,
          heading = 0,
          pitch = 0,
          strafe = 0,
          drive = 0,
          len,
          i, j;

      lt = t;
      this.input.update( dt );

      heading = this.input.getValue( "heading" );
      strafe = this.input.getValue( "strafe" );
      drive = this.input.getValue( "drive" );
      pitch = this.input.getValue( "pitch" );
      this.input.getQuaternion( "headRX", "headRY", "headRZ", "headRW", qHead );
      qPitch.setFromAxisAngle( RIGHT, pitch );

      this.nose.visible = this.inVR && !isMobile;

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

        qHeading.setFromAxisAngle( UP, currentHeading );
        this.currentUser.velocity.set( strafe, 0, drive );
        if ( isMobile ) {
          this.currentUser.velocity.applyQuaternion( qHead );
          this.currentUser.velocity.y = 0;
        }
        this.currentUser.velocity.applyQuaternion( qHeading );
      }

      this.currentUser.position.add( this.currentUser.velocity );

      if ( !this.onground && this.currentUser.position.y < this.avatarHeight ) {
        this.onground = true;
        this.currentUser.position.y = this.avatarHeight;
        this.currentUser.velocity.y = 0;
      }

      if ( this.sky ) {
        this.sky.position.copy( this.currentUser.position );
      }

      if ( this.ground ) {
        this.ground.position.set(
            Math.floor( this.currentUser.position.x ),
            0.5,
            Math.floor( this.currentUser.position.z ) );
        this.ground.material.needsUpdate = true;
      }

      if ( !this.inVR || isMobile ) {
        currentHeading = heading;
        this.currentUser.quaternion.setFromAxisAngle( UP, currentHeading );
        if ( !isMobile ) {
          this.currentUser.quaternion.multiply( qPitch );
        }
      }
      else {
        var dHeading = heading - currentHeading;
        if ( !this.currentEditor && Math.abs( dHeading ) > Math.PI / 5 ) {
          var dh = Math.sign( dHeading ) * Math.PI / 100;
          currentHeading += dh;
          heading -= dh;
          dHeading = heading - currentHeading;
        }
        this.currentUser.quaternion.setFromAxisAngle( UP, currentHeading );
        qHeading.setFromAxisAngle( UP, dHeading ).multiply( qPitch );
      }

      this.pointer.position.copy( FORWARD );
      if ( this.inVR && !isMobile ) {
        this.pointer.position.applyQuaternion( qHeading );
      }
      if ( !this.currentEditor || isMobile ) {
        this.pointer.position.add( this.camera.position );
        this.pointer.position.applyQuaternion( this.camera.quaternion );
      }
      this.pointer.position.applyQuaternion( this.currentUser.quaternion );
      this.pointer.position.add( this.currentUser.position );

      if ( this.projector.ready ) {
        this.projector.ready = false;

        for ( i = 0; i < this.pickableObjects.length; ++i ) {
          this.projector.updateObject( createPickableObject( this.pickableObjects[i] ) );
        }

        this.projector.projectPointer(
            this.pointer.position.toArray(),
            transformForPicking( this.currentUser ) );
      }

      var lastButtons = this.input.getValue( "dButtons" );

      if ( currentHit ) {
        var fp = currentHit.facePoint, fn = currentHit.faceNormal;
        this.pointer.position.set(
            fp[0] + fn[0] * POINTER_RADIUS,
            fp[1] + fn[1] * POINTER_RADIUS,
            fp[2] + fn[2] * POINTER_RADIUS );
        this.pointer.material.color.setRGB( 1, 1, 1 );
        this.pointer.material.emissive.setRGB( 0.25, 0.25, 0.25 );
        var object = this.findObject( currentHit.objectID );
        if ( object ) {
          var buttons = this.input.getValue( "buttons" ),
              clickChanged = lastButtons > 0,
              editor = object.textarea;

          if ( editor ) {
            this.pointer.scale.set( 1, 1, 1 );
          }
          else {
            this.pointer.scale.set( POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE );
          }

          if ( clickChanged && buttons > 0 ) {
            if ( this.currentEditor && this.currentEditor !== editor ) {
              this.currentEditor.blur();
              this.currentEditor = null;
            }

            if ( !this.currentEditor && editor ) {
              this.currentEditor = editor;
              this.currentEditor.focus();
            }
            else if ( object === this.ground ) {
              this.currentUser.position.set(
                  fp[0] + fn[0] * this.avatarHeight,
                  fp[1] + fn[1] * this.avatarHeight,
                  fp[2] + fn[2] * this.avatarHeight );
              this.currentUser.position.y = this.avatarHeight;
              this.onground = false;
            }
          }

          if ( this.currentEditor ) {
            var // At this point, the UV coord is scaled to a proporitional value, on
                // the range [0, 1] for the dimensions of the image used as the texture.
                // So we have to rescale it back out again. Also, the y coordinate is
                // flipped.
                txt = object.material.map.image,
                textureU = Math.floor( txt.width * currentHit.point[0] ),
                textureV = Math.floor( txt.height * ( 1 - currentHit.point[1] ) );
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
      else {
        if ( this.currentEditor && lastButtons > 0 ) {
          this.currentEditor.blur();
          this.currentEditor = null;
        }
        this.pointer.material.color.setRGB( 1, 0, 0 );
        this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
        this.pointer.scale.set( 1, 1, 1 );
      }

      fireAll.call( this, "update", dt );

      for ( j = 0; j < this.pickableObjects.length; ++j ) {
        if ( this.pickableObjects[j].textarea ) {
          this.pickableObjects[j].textarea.render();
        }
      }

      if ( !this.inVR || !this.input.vr.params ) {
        this.camera.position.set( 0, 0, 0 );
        this.camera.quaternion.set( 0, 0, 0, 1 );
        this.renderer.render( this.scene, this.camera );
      }
      else {
        for ( i = 0; i < this.input.vr.transforms.length; ++i ) {
          var st = this.input.vr.transforms[i],
              m = st.transform,
              v = st.viewport,
              side = ( 2 * i ) - 1;
          this.input.getVector3( "headX", "headY", "headZ", this.camera.position );
          this.camera.position.applyMatrix4( m );
          this.camera.quaternion.copy( qHead );
          this.camera.position.applyQuaternion( this.camera.quaternion );
          this.nose.position.set( side * -0.12, -0.12, -0.15 );
          this.nose.rotation.z = side * 0.7;
          this.renderer.setViewport( v.left, v.top, v.width, v.height );
          this.renderer.setScissor( v.left, v.top, v.width, v.height );
          this.renderer.render( this.scene, this.camera );
        }
      }
    }.bind( this );
    //
    // Setup THREE.js
    //
    this.renderer = new THREE.WebGLRenderer( {
      canvas: this.ctrls.frontBuffer,
      antialias: !isMobile,
      alpha: !isMobile,
      logarithmicDepthBuffer: !isMobile
    } );

    this.renderer.autoSortObjects = !isMobile;
    this.renderer.enableScissorTest( true );
    this.renderer.setClearColor( this.options.backgroundColor );

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

    //
    // setup button objects
    //
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

    //
    // bind non-signal processed user commands
    //
    this.input.addEventListener( "jump", this.jump.bind( this ), false );
    this.input.addEventListener( "zero", this.zero.bind( this ), false );
    this.projector.addEventListener( "hit", function ( h ) {
      this.projector.ready = true;
      currentHit = h;
    }.bind( this ) );

    //
    // restoring the options the user selected
    //
    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function ( ) {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );

    //
    // Manage full-screen state
    //
    function setVRMode ( ) {
      this.inVR = isFullScreenMode( ) && vrRequest && this.input.vr.display;
      if ( !isFullScreenMode() && location.hash === "#fullscreen" ) {
        location.hash = "";
      }
      setSize.call( this );
    }

    window.addEventListener( "popstate", function ( evt ) {
      if ( isFullScreenMode() ) {
        exitFullScreen();
        evt.preventDefault();
      }
    }, true );

    window.addEventListener( "fullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "webkitfullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "mozfullscreenchange", setVRMode.bind( this ), false );
    window.addEventListener( "resize", setSize.bind( this ), false );

    if ( !this.options.disableAutoFullScreen ) {
      window.addEventListener( "mousedown", this.goFullScreen.bind( this, true ), false );
      window.addEventListener( "touchstart", this.goFullScreen.bind( this, true ), false );
    }
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
    drawDistance: 50, // the far plane of the camera
    chatTextSize: 0.25, // the size of a single line of text, in world units
    dtNetworkUpdate: 0.125 // the amount of time to allow to elapse between sending state to the server
  };

  return VRApplication;
} )( );
