/* global Primrose, CANNON, THREE, io, CryptoJS, fmt, Notification, requestFullScreen */
Primrose.VRApplication = ( function () {
  if(typeof(THREE) === "undefined"){
    return function(){};
  }
  /*
   Create a new VR Application!

   `name` - name the application, for use with saving settings separately from
   other applications on the same domain
   `sceneModel` - the scene to present to the user, in COLLADA format
   `buttonModel` - the model to use to make buttons, in COLLADA format
   `buttonOptions` - configuration parameters for buttons
   | `maxThrow` - the distance the button may move
   | `minDeflection` - the angle boundary in which to do hit tests on the button
   | `colorUnpressed` - the color of the button when it is not depressed
   | `colorPressed` - the color of the button when it is depressed
   `avatarModel` - the model to use for players in the game, in COLLADA format
   `avatarHeight` - the offset from the ground at which to place the camera
   `walkSpeed` - how quickly the avatar moves across the ground
   `clickSound` - the sound that plays when the user types
   `ambientSound` - background hum or music
   `options` - optional values to override defaults
   | `gravity` - the acceleration applied to falling objects (default: 9.8)
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
  function VRApplication ( name, sceneModel, buttonModel,
      buttonOptions, avatarHeight, walkSpeed,
      options ) {
    this.options = combineDefaults( options, VRApplication.DEFAULTS );
    Primrose.Application.call( this, name, this.options );
    this.listeners = { ready: [ ], update: [ ] };
    this.avatarHeight = avatarHeight;
    this.walkSpeed = walkSpeed;
    this.qRoll = new THREE.Quaternion( );
    this.qPitch = new THREE.Quaternion( );
    this.qRift = new THREE.Quaternion( );
    this.pRift = new THREE.Vector3( );
    this.onground = true;
    this.lt = 0;
    this.frame = 0;
    this.enableMousePitch = true;
    this.currentUser = null;
    this.vrParams = null;
    this.vrDisplay = null;
    this.vrSensor = null;
    this.inVR = false;
    this.world = new CANNON.World();
    this.world.defaultContactMaterial.friction = 0.2;
    this.world.gravity.set( 0, -this.options.gravity, 0 );
    this.world.broadphase = new CANNON.SAPBroadphase( this.world );
    this.audio = new Primrose.Output.Audio3D();

    //
    // keyboard input
    //
    this.keyboard = new Primrose.Input.Keyboard( "keyboard", window, [
      { name: "strafeLeft", buttons: [ -Primrose.Input.Keyboard.A,
          -Primrose.Input.Keyboard.LEFTARROW ] },
      { name: "strafeRight", buttons: [ Primrose.Input.Keyboard.D,
          Primrose.Input.Keyboard.RIGHTARROW ]
      },
      { name: "driveForward", buttons: [ -Primrose.Input.Keyboard.W,
          -Primrose.Input.Keyboard.UPARROW ] },
      { name: "driveBack", buttons: [ Primrose.Input.Keyboard.S,
          Primrose.Input.Keyboard.DOWNARROW
        ] },
      { name: "zeroSensor", buttons: [ Primrose.Input.Keyboard.Z ],
        commandDown: this.zero.bind( this ), dt: 1 },
      { name: "jump", buttons: [ Primrose.Input.Keyboard.SPACEBAR ],
        commandDown: this.jump.bind( this ), dt: 0.5 },
      { name: "resetPosition", buttons: [ Primrose.Input.Keyboard.P ],
        commandUp: this.resetPosition.bind( this ) }
    ] );

    //
    // mouse input
    //
    this.mouse = new Primrose.Input.Mouse( "mouse", window, [
      { name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5
      },
      { name: "heading", commands: [ "dx" ], integrate: true },
      { name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5
      },
      { name: "pitch", commands: [ "dy" ], integrate: true, min: -Math.PI *
            0.5, max: Math.PI * 0.5 }
    ] );

    var DEBUG_VR = false,
        translations = [ new THREE.Matrix4(), new THREE.Matrix4() ],
        viewports = [ ];

    function setTrans ( m, t ) {
      m.makeTranslation( t.x, t.y, t.z );
    }

    function checkForVR () {
      findVR( function ( display, sensor ) {
        if ( display && ( display.deviceName !== "Mockulus Rift" ||
            DEBUG_VR ) ) {
          this.vrDisplay = display;
          this.vrSensor = sensor;
        }

        if ( !this.vrDisplay ) {
          this.ctrls.goVR.style.display = "none";
          setTimeout( checkForVR.bind( this ), 5000 );
        }
        else {
          this.ctrls.goVR.style.display = "inline-block";
          if ( this.vrDisplay.getEyeParameters ) {
            this.vrParams = {
              left: this.vrDisplay.getEyeParameters( "left" ),
              right: this.vrDisplay.getEyeParameters( "right" )
            };
          }
          else {
            this.vrParams = {
              left: {
                renderRect: this.vrDisplay.getRecommendedEyeRenderRect(
                    "left" ),
                eyeTranslation: this.vrDisplay.getEyeTranslation( "left" ),
                recommendedFieldOfView: this.vrDisplay.getRecommendedEyeFieldOfView(
                    "left" )
              },
              right: {
                renderRect: this.vrDisplay.getRecommendedEyeRenderRect(
                    "right" ),
                eyeTranslation: this.vrDisplay.getEyeTranslation( "right" ),
                recommendedFieldOfView: this.vrDisplay.getRecommendedEyeFieldOfView(
                    "right" )
              }
            };
          }

          setTrans( translations[0], this.vrParams.left.eyeTranslation );
          setTrans( translations[1], this.vrParams.right.eyeTranslation );
          viewports[0] = this.vrParams.left.renderRect;
          viewports[1] = this.vrParams.right.renderRect;
        }
      }.bind( this ) );
    }

    checkForVR.call( this );

    //
    // gamepad input
    //
    this.gamepad = new Primrose.Input.Gamepad( "gamepad", [
      { name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ] },
      { name: "drive", axes: [ Primrose.Input.Gamepad.LSY ] },
      { name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true
      },
      { name: "dheading", commands: [ "heading" ], delta: true },
      { name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true }
    ] );

    this.gamepad.addEventListener( "gamepadconnected",
        this.connectGamepad.bind( this ), false );

    //
    // restoring the options the user selected
    //
    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function () {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
    }.bind( this ), false );

    //
    // Setup THREE.js
    //
    this.glove = new Primrose.Output.HapticGlove( {
      hands: 2,
      fingers: 5,
      joints: 1,
      port: 9080
    });
    this.scene = null;
    this.renderer = new THREE.WebGLRenderer( {
      antialias: true,
      alpha: true,
      canvas: this.ctrls.frontBuffer
    } );
    this.renderer.setClearColor( this.options.backgroundColor );
    this.buttonFactory = new Primrose.ButtonFactory( buttonModel,
        buttonOptions );

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
      if ( this.camera && this.scene && this.currentUser &&
          this.buttonFactory.template ) {
        this.setSize( );

        if ( this.passthrough ) {
          this.camera.add( this.passthrough.mesh );
        }

        this.animate = this.animate.bind( this );
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

        this.fire( "ready" );
        requestAnimationFrame( this.animate );
      }
      else {
        requestAnimationFrame( waitForResources.bind( this ) );
      }
    }

    this.start = function () {
      requestAnimationFrame( waitForResources.bind( this ) );
    };

    Primrose.ModelLoader.loadScene( sceneModel, function ( sceneGraph ) {
      this.scene = sceneGraph;
      this.scene.traverse( function ( obj ) {
        if ( obj.isSolid ) {
          if ( obj.name === "Terrain" || obj.name.startsWith( "Plane" ) ) {
            makePlane.call( this, obj );
          }
          else {
            makeBall.call( this, obj, 1 );
          }
        }
      }.bind( this ) );
      this.camera = this.scene.Camera;
    }.bind( this ) );

    window.addEventListener( "resize", this.setSize.bind( this ), false );

    this.fullScreen = function () {
      if ( this.ctrls.frontBuffer.webkitRequestFullscreen ) {
        this.ctrls.frontBuffer.webkitRequestFullscreen(  );
      }
      else if ( this.ctrls.frontBuffer.mozRequestFullScreen ) {
        this.ctrls.frontBuffer.mozRequestFullScreen(  );
      }
    };


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

    this.currentUser = new THREE.Object3D();
    this.currentUser.velocity = new THREE.Vector3();

    this.ctrls.goRegular.addEventListener( "click", function () {
      requestFullScreen( this.ctrls.frontBuffer );
      this.setSize();
    }.bind( this ) );

    this.ctrls.goVR.addEventListener( "click", function ( ) {
      requestFullScreen( this.ctrls.frontBuffer, this.vrDisplay );
      this.inVR = true;
      this.setSize();
    }.bind( this ) );
  }

  inherit( VRApplication, Primrose.Application );

  VRApplication.DEFAULTS = {
    gravity: 9.8, // the acceleration applied to falling objects
    backgroundColor: 0x000000,
    // the color that WebGL clears the background with before drawing
    drawDistance: 500, // the far plane of the camera
    chatTextSize: 0.25, // the size of a single line of text, in world units
    dtNetworkUpdate: 0.125 // the amount of time to allow to elapse between sending state to teh server
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

  VRApplication.prototype.setupModuleEvents = function ( container, module,
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
    var styleWidth = this.ctrls.outputContainer.clientWidth,
        styleHeight = this.ctrls.outputContainer.clientHeight,
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
    this.renderer.domElement.style.width = px( styleWidth );
    this.renderer.domElement.style.height = px( styleHeight );
    this.renderer.domElement.width = canvasWidth;
    this.renderer.domElement.height = canvasHeight;
    this.renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    this.camera.fov = fieldOfView;
    this.camera.aspect = aspectWidth / canvasHeight;
    this.camera.updateProjectionMatrix( );
  };

  VRApplication.prototype.connectGamepad = function ( id ) {
    if ( !this.gamepad.isGamepadSet() && confirm( fmt(
        "Would you like to use this gamepad? \"$1\"", id ) ) ) {
      this.gamepad.setGamepad( id );
    }
  };

  VRApplication.prototype.resetPosition = function () {
    this.currentUser.position.set( 0, 1, 0 );
    this.currentUser.velocity.set( 0, 0, 0 );
  };

  VRApplication.prototype.zero = function () {
    if ( this.vrSensor ) {
      this.vrSensor.resetSensor();
    }
  };

  VRApplication.prototype.jump = function () {
    if ( this.onground ) {
      this.currentUser.velocity.y += 10;
      this.onground = false;
    }
  };

  var heading = 0,
      strafe,
      drive;

  VRApplication.prototype.animate = function ( t ) {
    requestAnimationFrame( this.animate );
    var dt = ( t - this.lt ) * 0.001;
    this.lt = t;
    var len,
        j,
        c;

    this.keyboard.update( dt );
    this.mouse.update( dt );
    this.gamepad.update( dt );

    if ( this.onground ) {

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
      this.currentUser.velocity.x = this.currentUser.velocity.x * 0.9 +
          strafe * 0.1;
      this.currentUser.velocity.z = this.currentUser.velocity.z * 0.9 +
          drive * 0.1;
      this.currentUser.quaternion.setFromAxisAngle( UP, heading );
    }

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

    this.currentUser.position.add(this.currentUser.velocity);

    this.glove.readContacts( this.world.contacts );
    for ( j = 0; j < this.buttons.length; ++j ) {
      this.buttons[j].readContacts( this.world.contacts );
    }

    if ( this.dragging ) {
      this.pick( "move" );
    }

    this.fire( "update", dt );

    //
    // update the camera
    //
    this.camera.quaternion.copy( this.currentUser.quaternion );
    this.camera.position.copy( this.currentUser.position );

    if ( this.inVR ) {
      var state = this.vrSensor.getState();

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

    this.renderScene( this.scene );
  };

  return VRApplication;
} )();
