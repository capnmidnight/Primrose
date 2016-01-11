/* global Primrose, THREE, io, CryptoJS, Notification, HMDVRDevice, devicePixelRatio
 * Function, emit, isMobile, isVR, isiOS, shell, quad, HTMLCanvasElement */

Primrose.VRApplication = ( function ( ) {
  "use strict";

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
   | `backgroundColor` - the color that WebGL clears the background with before drawing (default: 0x000000)
   | `drawDistance` - the far plane of the camera (default: 500)
   | `chatTextSize` - the size of a single line of text, in world units (default: 0.25)
   | `dtNetworkUpdate` - the amount of time to allow to elapse between sending state to teh server (default: 0.125)
   */
  var RIGHT = new THREE.Vector3( 1, 0, 0 ),
      UP = new THREE.Vector3( 0, 1, 0 ),
      FORWARD = new THREE.Vector3( 0, 0, -1 ),
      POINTER_RADIUS = 0.01,
      POINTER_RESCALE = 20,
      FORWARDED_EVENTS = [
        "keydown", "keyup", "keypress",
        "mousedown", "mouseup", "mousemove", "wheel",
        "touchstart", "touchend", "touchmove" ],
      RESOLUTION_SCALE = 1;
  function VRApplication ( name, options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );

    var setSize = function ( ) {
      var canvasWidth,
          canvasHeight,
          fieldOfView,
          aspectWidth;

      if ( this.inVR ) {
        var p = this.input.transforms,
            l = p[0],
            r = p[1];
        canvasWidth = Math.floor( ( l.viewport.width + r.viewport.width ) * RESOLUTION_SCALE );
        canvasHeight = Math.floor( Math.max( l.viewport.height, r.viewport.height ) * RESOLUTION_SCALE );
        fieldOfView = l.fov;
        aspectWidth = canvasWidth / 2;
      }
      else {
        var bounds = this.renderer.domElement.getBoundingClientRect( ),
            boundsRatio = screen.width / screen.height,
            elementWidth = bounds.width,
            elementHeight = isiOS ? ( elementWidth * boundsRatio ) : ( elementWidth / boundsRatio ),
            pixelRatio = devicePixelRatio || 1;
        canvasWidth = Math.floor( elementWidth * pixelRatio * RESOLUTION_SCALE );
        canvasHeight = Math.floor( elementHeight * pixelRatio * RESOLUTION_SCALE );
        fieldOfView = 75;
        aspectWidth = canvasWidth;
        if ( isiOS ) {
          document.body.style.height = Math.max( document.body.clientHeight, elementHeight ) + "px";
          document.documentElement.style.height = Math.max( document.documentElement.clientHeight, elementHeight ) + "px";
        }
        this.renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
        this.renderer.setScissor( 0, 0, canvasWidth, canvasHeight );
      }
      this.renderer.domElement.width = canvasWidth;
      this.renderer.domElement.height = canvasHeight;
      this.camera.fov = fieldOfView;
      this.camera.aspect = aspectWidth / canvasHeight;
      this.camera.updateProjectionMatrix( );
    }.bind( this );

    var fire = emit.bind( this );

    this.addEventListener = function ( event, thunk, bubbles ) {
      if ( this.listeners[event] ) {
        this.listeners[event].push( thunk );
      }
      else if ( FORWARDED_EVENTS.indexOf( event ) >= 0 ) {
        window.addEventListener( event, thunk, bubbles );
      }
    };

    var lockedToEditor = function () {
      return this.currentControl && this.currentControl.readOnly === false;
    }.bind( this );

    this.zero = function ( ) {
      if ( !lockedToEditor() ) {
        this.player.position.set( 0, this.avatarHeight, 0 );
        this.player.velocity.set( 0, 0, 0 );
        this.input.zero();
      }
    };

    this.jump = function ( ) {
      if ( this.player.isOnGround && !lockedToEditor() ) {
        this.player.velocity.y += this.options.jumpSpeed;
        this.player.isOnGround = false;
      }
    };

    var makeEditor = function ( scene, id, w, h, options ) {
      var SCALE = isMobile ? 0.25 : 0.5;
      options.size = options.size || new Primrose.Text.Size( 1024 * w, 1024 * h );
      options.fontSize = options.fontSize || 32;
      if ( options.opacity === undefined ) {
        options.opacity = 1;
      }
      var text = new Primrose.Text.Controls.TextBox( id, options ),
          cellWidth = Math.round( SCALE * 1024 * w / options.fontSize ),
          cellHeight = Math.round( SCALE * 1024 * h / options.fontSize ),
          makeGeom = options.useShell ?
          shell.bind( null, 1, cellWidth, cellHeight ) :
          quad.bind( null, w, h, 1, 1 ),
          mesh = textured( makeGeom(), text, false, options.opacity );

      scene.add( mesh );

      text.mesh = mesh;
      mesh.textarea = text;

      this.registerPickableObject( mesh );
      return text;
    }.bind( this );

    var makeTextArea = function (  ) {
      return makeEditor(
          this.scene, "textEditor" + this.pickableObjects.length,
          1, 1, {
            tokenizer: Primrose.Text.Grammars.JavaScript,
            useShell: true,
            keyEventSource: window,
            wheelEventSource: this.renderer.domElement
          } );
    }.bind( this );

    var makePre = function ( ) {
      return makeEditor(
          this.scene, "textEditor" + this.pickableObjects.length,
          1, 1, {
            tokenizer: Primrose.Text.Grammars.PlainText,
            useShell: false,
            keyEventSource: window,
            wheelEventSource: this.renderer.domElement,
            hideLineNumbers: true,
            readOnly: true
          } );
    }.bind( this );

    var makeButton = function ( ) {
      var btn = this.buttonFactory.create( false );
      this.scene.add( btn.container );
      this.registerPickableObject( btn.cap );
      return btn;
    }.bind( this );

    var elementConstructors = {
      textarea: makeTextArea,
      pre: makePre,
      button: makeButton
    };

    this.appendChild = function ( elem ) {
      var type = elem.tagName.toLocaleLowerCase(),
          obj = null;

      if ( elementConstructors[type] ) {
        obj = elementConstructors[type]( );
        obj.copyElement( elem );
      }

      return obj;
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
      editor.mesh = obj;
      obj.textarea = editor;
      this.registerPickableObject( obj );
      return editor;
    };

    this.registerPickableObject = function ( obj ) {
      if ( obj.type === "Object3D" ) {
        obj.children[0].name = obj.children[0].name || obj.name;
        obj = obj.children[0];
      }
      if ( obj ) {
        var bag = createPickableObject( obj ),
            verts, faces, uvs, i;

        // it would be nice to do this the other way around, to have everything
        // stored in ArrayBuffers, instead of regular arrays, to pass to the
        // Worker thread. Maybe later.
        if ( obj.geometry instanceof THREE.BufferGeometry ) {
          var attr = obj.geometry.attributes,
              pos = attr.position,
              uv = attr.uv,
              idx = attr.index;

          verts = [ ];
          faces = [ ];
          if ( uv ) {
            uvs = [ ];
          }
          for ( i = 0; i < pos.count; ++i ) {
            verts.push( [ pos.getX( i ), pos.getY( i ), pos.getZ( i ) ] );
            if ( uv ) {
              uvs.push( [ uv.getX( i ), uv.getY( i ) ] );
            }
          }
          if ( idx ) {
            for ( i = 0; i < idx.count - 2; ++i ) {
              faces.push( [ idx.getX( i ), idx.getX( i + 1 ), idx.getX( i + 2 ) ] );
            }
          }
          else {
            for ( i = 0; i < pos.count; i += 3 ) {
              faces.push( [ i, i + 1, i + 2 ] );
            }
          }
        }
        else {
          verts = obj.geometry.vertices.map( function ( v ) {
            return v.toArray( );
          } );
          faces = [ ];
          uvs = [ ];
          // IDK why, but non-buffered geometry has an additional array layer
          for ( i = 0; i < obj.geometry.faces.length; ++i ) {
            var f = obj.geometry.faces[i],
                faceUVs = obj.geometry.faceVertexUvs[0][i];
            faces.push( [ f.a, f.b, f.c ] );
            uvs[f.a] = [ faceUVs[0].x, faceUVs[0].y ];
            uvs[f.b] = [ faceUVs[1].x, faceUVs[1].y ];
            uvs[f.c] = [ faceUVs[2].x, faceUVs[2].y ];
          }
        }

        bag.geometry = {
          vertices: verts,
          faces: faces,
          uvs: uvs
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
      t *= 0.001;
      var dt = t - lt,
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
      this.nose.visible = this.inVR;
      if ( !this.player.isOnGround ) {
        this.player.velocity.y -= this.options.gravity * dt;
      }
      else if ( !lockedToEditor() ) {
        this.player.velocity.set( strafe, 0, drive )
            .normalize()
            .multiplyScalar( this.walkSpeed );

        qHeading.setFromAxisAngle( UP, currentHeading );
        this.player.velocity.applyQuaternion( qHead );
        this.player.velocity.y = 0;
        this.player.velocity.applyQuaternion( qHeading );
      }

      this.player.position.add( vTemp.copy( this.player.velocity ).multiplyScalar( dt ) );
      if ( !this.player.isOnGround && this.player.position.y < this.avatarHeight ) {
        this.player.isOnGround = true;
        this.player.position.y = this.avatarHeight;
        this.player.velocity.y = 0;
      }

      if ( this.sky ) {
        this.sky.position.copy( this.player.position );
      }

      if ( this.ground ) {
        this.ground.position.set(
            Math.floor( this.player.position.x ),
            0,
            Math.floor( this.player.position.z ) );
        this.ground.material.needsUpdate = true;
      }

      if ( this.inVR ) {
        var dHeading = heading - currentHeading;
        if ( !lockedToEditor() && Math.abs( dHeading ) > Math.PI / 5 ) {
          var dh = Math.sign( dHeading ) * Math.PI / 100;
          currentHeading += dh;
          heading -= dh;
          dHeading = heading - currentHeading;
        }
        this.player.quaternion.setFromAxisAngle( UP, currentHeading );
        qHeading.setFromAxisAngle( UP, dHeading ).multiply( qPitch );
      }
      else {
        currentHeading = heading;
        this.player.quaternion.setFromAxisAngle( UP, currentHeading );
        this.player.quaternion.multiply( qPitch );
      }

      this.pointer.position.copy( FORWARD );
      if ( this.inVR && !isMobile ) {
        this.pointer.position.applyQuaternion( qHeading );
      }
      if ( !lockedToEditor() || isMobile ) {
        this.pointer.position.add( this.camera.position );
        this.pointer.position.applyQuaternion( this.camera.quaternion );
      }
      this.pointer.position.applyQuaternion( this.player.quaternion );
      this.pointer.position.add( this.player.position );
      if ( this.projector.ready ) {
        this.projector.ready = false;
        this.projector.updateObjects( this.pickableObjects.map( createPickableObject ) );
        this.projector.projectPointer( [
          this.pointer.position.toArray( ),
          transformForPicking( this.player ) ] );
      }

      var lastButtons = this.input.getValue( "dButtons" );
      if ( currentHit ) {
        var fp = currentHit.facePoint, fn = currentHit.faceNormal,
            object = this.findObject( currentHit.objectID );
        this.pointer.position.set(
            fp[0] + fn[0] * POINTER_RADIUS,
            fp[1] + fn[1] * POINTER_RADIUS,
            fp[2] + fn[2] * POINTER_RADIUS );

        if ( object === this.ground ) {
          this.pointer.scale.set( POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE );
        }
        else {
          this.pointer.scale.set( 1, 1, 1 );
        }
        this.pointer.material.color.setRGB( 1, 1, 1 );
        this.pointer.material.emissive.setRGB( 0.25, 0.25, 0.25 );
        if ( object ) {
          var buttons = this.input.getValue( "buttons" ),
              clickChanged = lastButtons !== 0,
              control = object.textarea || object.button;

          if ( !lockedToEditor() ) {
            buttons |= this.input.keyboard.getValue( "select" );
            clickChanged = clickChanged || this.input.keyboard.getValue( "dSelect" ) !== 0;
          }
          if ( lastHit && currentHit && lastHit.objectID === currentHit.objectID && !clickChanged && buttons > 0 ) {
            fire( "pointermove", currentHit );
          }
          else {
            if ( lastHit && clickChanged && buttons === 0 ) {
              fire( "pointerend", lastHit );
            }
            if ( currentHit && clickChanged && buttons > 0 ) {
              fire( "pointerstart", currentHit );
            }
          }

          if ( clickChanged && buttons > 0 ) {
            if ( this.currentControl && this.currentControl !== control ) {
              this.currentControl.blur( );
              this.currentControl = null;
            }

            if ( !this.currentControl && control ) {
              this.currentControl = control;
              this.currentControl.focus( );
            }
            else if ( object === this.ground ) {
              this.player.position.copy( this.pointer.position );
              this.player.position.y = this.avatarHeight;
              this.player.isOnGround = false;
            }
          }

          if ( this.currentControl ) {
            if ( clickChanged ) {
              if ( buttons > 0 ) {
                this.currentControl.startUV( currentHit.point );
              }
              else {
                this.currentControl.endPointer( );
              }
            }
            else if ( !clickChanged && buttons > 0 ) {
              this.currentControl.moveUV( currentHit.point );
            }
          }
        }
      }
      else {
        if ( this.currentControl && lastButtons > 0 ) {
          this.currentControl.blur( );
          this.currentControl = null;
        }
        this.pointer.material.color.setRGB( 1, 0, 0 );
        this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
        this.pointer.scale.set( 1, 1, 1 );
      }

      fire( "update", dt );
      for ( j = 0; j < this.pickableObjects.length; ++j ) {
        var obj = this.pickableObjects[j],
            txt = obj.textarea;
        if ( txt ) {
          txt.render( );
        }
      }

      if ( this.inVR && this.input.transforms ) {
        for ( i = 0; i < this.input.transforms.length; ++i ) {
          var st = this.input.transforms[i],
              m = st.transform,
              v = st.viewport,
              side = ( 2 * i ) - 1;
          this.input.getVector3( "headX", "headY", "headZ", this.camera.position );
          this.camera.position.applyMatrix4( m );
          this.camera.quaternion.copy( qHead );
          this.nose.position.set( side * -0.12, -0.12, -0.15 );
          this.nose.rotation.z = side * 0.7;
          this.renderer.setViewport( v.left * RESOLUTION_SCALE, v.top * RESOLUTION_SCALE, v.width * RESOLUTION_SCALE, v.height * RESOLUTION_SCALE );
          this.renderer.setScissor( v.left * RESOLUTION_SCALE, v.top * RESOLUTION_SCALE, v.width * RESOLUTION_SCALE, v.height * RESOLUTION_SCALE );
          this.renderer.render( this.scene, this.camera );
        }
      }
      else {
        this.camera.position.set( 0, 0, 0 );
        this.camera.quaternion.copy( qHead );
        this.renderer.render( this.scene, this.camera );
      }
    }.bind( this );



    //
    // restoring the options the user selected
    //
    this.ctrls = Primrose.DOM.findEverything();
    this.formStateKey = name + " - formState";
    this.formState = getSetting( this.formStateKey );
    this.fullscreenElement = document.documentElement;
    this.users = {};
    this.chatLines = [ ];
    this.userName = VRApplication.DEFAULT_USER_NAME;
    this.focused = true;
    this.wasFocused = false;

    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function ( ) {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );

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
    //
    // Initialize local variables
    //
    var lt = 0,
        lastHit = null,
        currentHit = null,
        currentHeading = 0,
        qPitch = new THREE.Quaternion( ),
        qHeading = new THREE.Quaternion( ),
        qHead = new THREE.Quaternion( ),
        vTemp = new THREE.Vector3(),
        skin = Primrose.Random.item( Primrose.SKIN_VALUES ),
        sceneLoaded = !this.options.sceneModel,
        buttonLoaded = !this.options.button,
        readyFired = false;

    //
    // Initialize public properties
    //
    this.inVR = false;
    this.currentControl = null;
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;
    this.listeners = {
      ready: [ ],
      update: [ ],
      gazestart: [ ],
      gazecomplete: [ ],
      gazecancel: [ ],
      pointerstart: [ ],
      pointermove: [ ],
      pointerend: [ ]
    };

    this.audio = new Primrose.Output.Audio3D( );

    this.music = new Primrose.Output.Music( this.audio.context );

    this.pickableObjects = [ ];

    this.projector = new Primrose.Workerize( Primrose.Projector );
    this.projector.ready = true;

    this.player = new THREE.Object3D( );
    this.player.velocity = new THREE.Vector3( );
    this.player.position.set( 0, this.avatarHeight, 0 );
    this.player.isOnGround = true;

    this.pointer = textured( sphere( POINTER_RADIUS, 10, 10 ), 0xff0000 );
    this.pointer.material.emissive.setRGB( 0.25, 0, 0 );
    this.pointer.material.opacity = 0.75;

    this.nose = textured( sphere( 0.05, 10, 10 ), skin );
    this.nose.name = "Nose";
    this.nose.scale.set( 0.5, 1, 1 );

    this.renderer = new THREE.WebGLRenderer( {
      canvas: Primrose.DOM.cascadeElement( this.options.canvasElement, "canvas", HTMLCanvasElement ),
      antialias: !isMobile,
      alpha: !isMobile,
      logarithmicDepthBuffer: !isMobile,
      DEBUG_WEBGL: this.options.DEBUG_WEBGL
    } );
    this.renderer.autoSortObjects = !isMobile;
    this.renderer.enableScissorTest( true );
    this.renderer.setClearColor( this.options.backgroundColor );
    if ( !this.renderer.domElement.parentElement ) {
      document.body.appendChild( this.renderer.domElement );
    }

    this.input = new Primrose.Input.FPSInput( this.renderer.domElement );

    this.scene = new THREE.Scene( );
    if ( this.options.useFog ) {
      this.scene.fog = new THREE.FogExp2( this.options.backgroundColor, 2 / this.options.drawDistance );
    }

    this.camera = new THREE.PerspectiveCamera( 75, 1, 0.1, this.options.drawDistance );

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

    this.camera.add( this.nose );
    this.camera.add( light( 0xffffff, 1, 2, 0.5 ) );
    this.player.add( this.camera );
    this.scene.add( this.player );
    this.scene.add( this.pointer );

    if ( this.passthrough ) {
      this.camera.add( this.passthrough.mesh );
    }

    if ( this.options.sceneModel ) {
      Primrose.ModelLoader.loadScene( this.options.sceneModel, function ( sceneGraph ) {
        sceneLoaded = true;
        this.scene.add.apply( this.scene, sceneGraph.children );
        this.scene.traverse( function ( obj ) {
          if ( obj.name ) {
            this.scene[obj.name] = obj;
          }
        }.bind( this ) );
        if ( sceneGraph.Camera ) {
          this.camera.position.copy( sceneGraph.Camera.position );
          this.camera.quaternion.copy( sceneGraph.Camera.quaternion );
        }
      }.bind( this ) );
    }

    if ( this.options.button ) {
      this.buttonFactory = new Primrose.ButtonFactory(
          this.options.button.model,
          this.options.button.options,
          function () {
            buttonLoaded = true;
          } );
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


    var waitForResources = function ( t ) {
      lt = t * 0.001;
      if ( sceneLoaded && buttonLoaded ) {
        if ( !readyFired ) {
          readyFired = true;
          setSize( );
          try {
            fire( "ready" );
          }
          catch ( exp ) {
            console.error( exp );
            console.warn( "There was an error during setup, but we're going to continue anyway." );
          }
        }
        this.timer = requestAnimationFrame( animate );
      }
      else {
        this.timer = requestAnimationFrame( waitForResources );
      }
    }.bind( this );

    this.start = function ( ) {
      if ( !this.timer ) {
        this.timer = requestAnimationFrame( waitForResources );
      }
    }.bind( this );

    this.stop = function ( ) {
      cancelAnimationFrame( this.timer );
      this.timer = null;
    }.bind( this );

    var handleHit = function ( h ) {
      var dt;
      this.projector.ready = true;
      lastHit = currentHit;
      currentHit = h;
      if ( lastHit && currentHit && lastHit.objectID === currentHit.objectID ) {
        currentHit.startTime = lastHit.startTime;
        currentHit.gazeFired = lastHit.gazeFired;
        dt = lt - currentHit.startTime;
        if ( dt >= this.options.gazeLength && !currentHit.gazeFired ) {
          currentHit.gazeFired = true;
          fire( "gazecomplete", currentHit );
        }
      }
      else {
        if ( lastHit ) {
          dt = lt - lastHit.startTime;
          if ( dt < this.options.gazeLength ) {
            fire( "gazecancel", lastHit );
          }
        }
        if ( currentHit ) {
          currentHit.startTime = lt;
          currentHit.gazeFired = false;
          fire( "gazestart", currentHit );
        }
      }
    }.bind( this );

    var basicKeyHandler = function ( evt ) {
      if ( !lockedToEditor() && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey && evt.keyCode === Primrose.Keys.F ) {
        this.goFullScreen( true );
      }
    }.bind( this );

    //
    // Manage full-screen state
    //
    this.goFullScreen = function ( useVR ) {
      this.input.mouse.requestPointerLock( );
      if ( !isFullScreenMode( ) ) {
        this.inVR = useVR;
        if ( useVR && this.input.vr && this.input.vr.display ) {
          requestFullScreen( this.renderer.domElement, this.input.vr.display );
        }
        else if ( !isiOS ) {
          requestFullScreen( this.renderer.domElement );
        }
        else {
          setSize();
        }
        history.pushState( null, document.title, "#fullscreen" );
      }
    };

    this.setFullScreenButton = function ( id, event, useVR ) {
      var elem = document.getElementById( id );
      if ( elem ) {
        var show = !useVR || isVR || isMobile;
        elem.style.cursor = show ? "pointer" : "not-allowed";
        elem.title = show ? ( useVR ? "Go Split-Screen" : "Go Fullscreen" ) : "VR is not available in your current browser.";
        elem.addEventListener( event, this.goFullScreen.bind( this, useVR ), false );
      }
    };

    var setVRMode = function ( evt ) {
      if ( !isFullScreenMode( ) ) {
        this.inVR = false;
        if ( location.hash === "#fullscreen" ) {
          location.hash = "";
        }
      }
      setSize( );
      evt.preventDefault();
    }.bind( this );

    window.addEventListener( "popstate", function ( evt ) {
      if ( isFullScreenMode( ) ) {
        exitFullScreen( );
        evt.preventDefault( );
      }
    }, true );
    window.addEventListener( "fullscreenchange", setVRMode, false );
    window.addEventListener( "webkitfullscreenchange", setVRMode, false );
    window.addEventListener( "mozfullscreenchange", setVRMode, false );
    window.addEventListener( "resize", setSize, false );
    if ( !this.options.disableAutoFullScreen ) {
      window.addEventListener( "mousedown", this.goFullScreen.bind( this, true ), false );
      window.addEventListener( "touchstart", this.goFullScreen.bind( this, true ), false );
    }
    window.addEventListener( "keydown", basicKeyHandler, false );
    this.input.addEventListener( "jump", this.jump.bind( this ), false );
    this.input.addEventListener( "zero", this.zero.bind( this ), false );
    this.projector.addEventListener( "hit", handleHit, false );
    window.addEventListener( "blur", this.stop, false );
    window.addEventListener( "focus", this.start, false );
    this.renderer.domElement.addEventListener( 'webglcontextlost', this.stop, false );
    this.renderer.domElement.addEventListener( 'webglcontextrestored', this.start, false );
    this.start();
  }

  VRApplication.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";

  VRApplication.DEFAULTS = {
    useLeap: false,
    useFog: false,
    avatarHeight: 1.75,
    walkSpeed: 2,
    // the acceleration applied to falling objects
    gravity: 9.8,
    jumpSpeed: 3.13,
    // the color that WebGL clears the background with before drawing
    backgroundColor: 0xafbfff,
    // the far plane of the camera
    drawDistance: 100,
    // the size of a single line of text, in world units
    chatTextSize: 0.25,
    // the amount of time to allow to elapse between sending state to the server
    dtNetworkUpdate: 0.125,
    canvasElement: "frontBuffer",
    gazeLength: 1
//    ,DEBUG_WEBGL: {
//      errorHandler: undefined,
//      logger: undefined
//    }
  };

  function createPickableObject ( obj ) {
    var bag = {
      uuid: obj.uuid,
      visible: obj.visible,
      name: obj.name
    };
    var originalBag = bag,
        head = obj;
    while ( head !== null ) {
      head.updateMatrix( );
      bag.matrix = head.matrix.elements.subarray( 0, head.matrix.elements.length );
      bag.parent = head.parent ? {} : null;
      bag = bag.parent;
      head = head.parent;
    }
    return originalBag;
  }

  function transformForPicking ( obj ) {
    var p = obj.position.clone( );
    obj = obj.parent;
    while ( obj !== null ) {
      p.applyMatrix4( obj.matrix );
      obj = obj.parent;
    }
    return p.toArray( );
  }

  function addCell ( row, elem ) {
    if ( typeof elem === "string" ) {
      elem = document.createTextNode( elem );
    }
    var cell = document.createElement( "td" );
    cell.appendChild( elem );
    row.appendChild( cell );
  }

  function isFullScreenMode () {
    return ( document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement );
  }

  function requestFullScreen ( elem, vrDisplay ) {
    var fullScreenParam;

    if ( typeof HMDVRDevice !== "undefined" && vrDisplay && vrDisplay instanceof HMDVRDevice ) {
      fullScreenParam = {vrDisplay: vrDisplay, vrDistortion: true};
    }

    if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( fullScreenParam || window.Element.ALLOW_KEYBOARD_INPUT );
    }
    else if ( elem.mozRequestFullScreen && fullScreenParam ) {
      elem.mozRequestFullScreen( fullScreenParam );
    }
    else if ( elem.mozRequestFullScreen && !fullScreenParam ) {
      elem.mozRequestFullScreen( );
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
        document.msExitFullscreen();
      }
    }
  }

  return VRApplication;
} )( );
