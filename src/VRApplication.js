/* global Primrose, THREE, io, CryptoJS, fmt, Notification, requestFullScreen */
Primrose.VRApplication = ( function () {
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
  function VRApplication ( name, sceneModel, buttonModel, buttonOptions,
      avatarModel, avatarHeight, walkSpeed, clickSound, ambientSound,
      options ) {
    Primrose.Application.call( this, name, options );
    this.options = combineDefaults( this.options, VRApplication );
    this.listeners = { ready: [ ], update: [ ] };
    this.glove = new Primrose.Output.HapticGlove();
    this.avatarHeight = avatarHeight;
    this.walkSpeed = walkSpeed;
    this.cameraMount = new THREE.Object3D();
    this.oculusCorrector = new THREE.Object3D();
    this.onground = false;
    this.lt = 0;
    this.frame = 0;
    this.enableMousePitch = true;
    this.currentUser = null;
    this.mainScene = null;
    this.userList = new Primrose.Text.Controls.TextBox("userList");

    //
    // speech input
    //
    this.speech = new Primrose.Input.Speech( "speech", [
      { name: "options", keywords: [ "options" ],
        commandUp: this.toggleOptions.bind( this ) },
      { name: "chat", preamble: true, keywords: [ "message" ],
        commandUp: function () {
          this.showTyping( true, true, this.speech.getValue( "chat" ) );
        }.bind( this ) }
    ], this.proxy );

    //
    // keyboard input
    //
    this.keyboard = new Primrose.Input.Keyboard( "keyboard", window, [
      { name: "strafeLeft", buttons: [ -Primrose.Input.Keyboard.A,
          -Primrose.Input.Keyboard.LEFTARROW ] },
      { name: "strafeRight", buttons: [ Primrose.Input.Keyboard.D,
          Primrose.Input.Keyboard.RIGHT ]
      },
      { name: "driveForward", buttons: [ -Primrose.Input.Keyboard.W,
          -Primrose.Input.Keyboard.UPARROW ] },
      { name: "driveBack", buttons: [ Primrose.Input.Keyboard.S,
          Primrose.Input.Keyboard.DOWNARROW
        ] },
      { name: "jump", buttons: [ Primrose.Input.Keyboard.SPACEBAR ],
        commandDown: this.jump.bind( this ), dt: 0.5 },
      { name: "camera", buttons: [ Primrose.Input.Keyboard.C ] },
      { name: "debug", buttons: [ Primrose.Input.Keyboard.X ] },
      { name: "resetPosition", buttons: [ Primrose.Input.Keyboard.P ],
        commandUp: this.resetPosition.bind( this ) },
      { name: "chat", preamble: true, buttons: [ Primrose.Input.Keyboard.T ],
        commandUp: this.showTyping.bind( this, true ) }
    ], this.proxy );
    this.keyboard.pause( true );

    //
    // mouse input
    //
    this.mouse = new Primrose.Input.Mouse( "mouse", this.fullscreenElement, [
      { name: "dx", axes: [ -Primrose.Input.Mouse.X ], delta: true, scale: 0.5
      },
      { name: "heading", commands: [ "dx" ], metaKeys: [
          -Primrose.NetworkedInput.SHIFT
        ], integrate: true },
      { name: "pointerHeading", commands: [ "dx" ], metaKeys: [
          Primrose.NetworkedInput.SHIFT ], integrate: true, min: -Math.PI *
            0.2,
        max: Math.PI * 0.2 },
      { name: "dy", axes: [ -Primrose.Input.Mouse.Y ], delta: true, scale: 0.5
      },
      { name: "pitch", commands: [ "dy" ], metaKeys: [
          -Primrose.NetworkedInput.SHIFT ],
        integrate: true, min: -Math.PI * 0.5, max: Math.PI * 0.5 },
      { name: "pointerPitch", commands: [ "dy" ], metaKeys: [
          Primrose.NetworkedInput.SHIFT ], integrate: true, min: -Math.PI *
            0.125,
        max: Math.PI * 0.125 },
      { name: "dz", axes: [ Primrose.Input.Mouse.Z ], delta: true },
      { name: "pointerDistance", commands: [ "dz" ], integrate: true,
        scale: 0.1, min: 0, max: 10 },
      { name: "pointerPress", buttons: [ 1 ], integrate: true, scale: 100,
        offset: -50, min: 0, max: 5 }
    ], this.proxy );

    //
    // capacitive touch screen input
    //
    this.touch = new Primrose.Input.Touch( "touch", this.fullscreenElement,
        null, [
          { name: "heading", axes: [ Primrose.Input.Touch.DX0 ],
            integrate: true
          },
          { name: "drive", axes: [ -Primrose.Input.Touch.DY0 ] }
        ], this.proxy );

    //
    // smartphone orientation sensor-based head tracking
    //
    this.head = new Primrose.Input.Motion( "head", [
      { name: "pitch", axes: [ Primrose.Input.Motion.PITCH ] },
      { name: "heading", axes: [ -Primrose.Input.Motion.HEADING ] },
      { name: "roll", axes: [ -Primrose.Input.Motion.ROLL ] }
    ], this.proxy );

    //
    // VR HEAD MOUNTED DISPLAY OOOOOH YEAH!
    //
    this.vr = new Primrose.Input.VR(
        "hmd",
        [
          { name: "pitch", axes: [ Primrose.Input.VR.RX ] },
          { name: "heading", axes: [ Primrose.Input.VR.RY ] },
          { name: "roll", axes: [ Primrose.Input.VR.RZ ] },
          { name: "homogeneous", axes: [ Primrose.Input.VR.RW ] }
        ],
        this.ctrls.hmdListing,
        this.formState && this.formState.hmdListing || "" );

    this.ctrls.hmdListing.addEventListener(
        "change",
        this.changeHMD.bind( this ) );

    //
    // gamepad input
    //
    this.gamepad = new Primrose.Input.Gamepad( "gamepad", [
      { name: "strafe", axes: [ Primrose.Input.Gamepad.LSX ] },
      { name: "drive", axes: [ Primrose.Input.Gamepad.LSY ] },
      { name: "heading", axes: [ -Primrose.Input.Gamepad.RSX ], integrate: true
      },
      { name: "pitch", axes: [ Primrose.Input.Gamepad.RSY ], integrate: true },
      { name: "options", buttons: [ 9 ], commandUp: this.toggleOptions.bind(
            this ) }
    ], this.proxy );

    this.gamepad.addEventListener( "gamepadconnected",
        this.connectGamepad.bind( this ), false );

    //
    // geolocation input
    //
    this.location = new Primrose.Input.Location( "location", [ ], this.proxy );

    //
    // passthrough camera
    //
    this.passthrough = new Primrose.Input.Camera( this.ctrls.cameraListing,
        this.formState && this.formState.cameraListing || "", 1, 0, 0, -1 );
    this.ctrls.cameraListing.addEventListener( "change", function () {
      this.passthrough.connect( this.ctrls.cameraListing.value );
    }.bind( this ) );

    //
    // Leap Motion input
    //
    var leapCommands = [ ];
    leapCommands.push( { name: "HAND0X", axes: [
        Primrose.Input.LeapMotion.HAND0X ],
      scale: -0.015 } );
    leapCommands.push( { name: "HAND0Y", axes: [
        Primrose.Input.LeapMotion.HAND0Y ],
      scale: 0.015, offset: -4 } );
    leapCommands.push( { name: "HAND0Z", axes: [
        Primrose.Input.LeapMotion.HAND0Z ],
      scale: -0.015, offset: 3 } );
    this.leap = new Primrose.Input.LeapMotion( "leap", leapCommands,
        this.proxy );

    //
    // The various options, and packs of them when selecting from a dropdown
    // list. This makes it easy to preconfigure the program to certain specs
    // and let the user override the others.
    //
    var HMD_SMARTPHONE = "Smartphone HMD",
      NO_HMD_SMARTPHONE = "Smartphone - no HMD";
    this.stateList = new Primrose.StateList( this.ctrls.deviceTypes, this.ctrls, [
      { name: "-- select device type --" },
      { name: "PC (no HMD)", values: {
          speechEnable: { checked: false },
          speechTransmit: { checked: false },
          speechReceive: { checked: false },
          keyboardEnable: { checked: true },
          keyboardTransmit: { checked: true },
          keyboardReceive: { checked: false },
          mouseEnable: { checked: true },
          mouseTransmit: { checked: true },
          mouseReceive: { checked: false },
          gamepadEnable: { checked: true },
          gamepadTransmit: { checked: true },
          gamepadReceive: { checked: false },
          leapEnable: { checked: true },
          leapTransmit: { checked: true },
          leapReceive: { checked: false },
          touchEnable: { checked: false },
          touchTransmit: { checked: false },
          touchReceive: { checked: true },
          headEnable: { checked: false },
          headTransmit: { checked: false },
          headReceive: { checked: true },
          locationEnable: { checked: false },
          locationTransmit: { checked: false },
          locationReceive: { checked: true },
          renderingStyle: { value: "regular" },
          defaultDisplay: { checked: true }
        } },

      { name: "PC (with HMD)", values: {
          speechEnable: { checked: false },
          speechTransmit: { checked: false },
          speechReceive: { checked: false },
          keyboardEnable: { checked: true },
          keyboardTransmit: { checked: true },
          keyboardReceive: { checked: false },
          mouseEnable: { checked: true },
          mouseTransmit: { checked: true },
          mouseReceive: { checked: false },
          gamepadEnable: { checked: true },
          gamepadTransmit: { checked: true },
          gamepadReceive: { checked: false },
          leapEnable: { checked: true },
          leapTransmit: { checked: true },
          leapReceive: { checked: false },
          touchEnable: { checked: false },
          touchTransmit: { checked: false },
          touchReceive: { checked: true },
          headEnable: { checked: false },
          headTransmit: { checked: false },
          headReceive: { checked: true },
          locationEnable: { checked: false },
          locationTransmit: { checked: false },
          locationReceive: { checked: true },
          renderingStyle: { value: "regular" },
          defaultDisplay: { checked: true }
        } },
      { name: HMD_SMARTPHONE, values: {
          speechEnable: { checked: false },
          speechTransmit: { checked: false },
          speechReceive: { checked: true },
          keyboardEnable: { checked: false },
          keyboardTransmit: { checked: false },
          keyboardReceive: { checked: true },
          mouseEnable: { checked: false },
          mouseTransmit: { checked: false },
          mouseReceive: { checked: true },
          gamepadEnable: { checked: false },
          gamepadTransmit: { checked: false },
          gamepadReceive: { checked: true },
          leapEnable: { checked: false },
          leapTransmit: { checked: false },
          leapReceive: { checked: true },
          touchEnable: { checked: false },
          touchTransmit: { checked: false },
          touchReceive: { checked: true },
          headEnable: { checked: true },
          headTransmit: { checked: true },
          headReceive: { checked: false },
          locationEnable: { checked: true },
          locationTransmit: { checked: true },
          locationReceive: { checked: false },
          renderingStyle: { value: "cardboard" },
          defaultDisplay: { checked: false }
        } },
      { name: NO_HMD_SMARTPHONE, values: {
          speechEnable: { checked: false },
          speechTransmit: { checked: false },
          speechReceive: { checked: false },
          keyboardEnable: { checked: false },
          keyboardTransmit: { checked: false },
          keyboardReceive: { checked: false },
          mouseEnable: { checked: false },
          mouseTransmit: { checked: false },
          mouseReceive: { checked: false },
          gamepadEnable: { checked: false },
          gamepadTransmit: { checked: false },
          gamepadReceive: { checked: false },
          leapEnable: { checked: false },
          leapTransmit: { checked: false },
          leapReceive: { checked: false },
          touchEnable: { checked: true },
          touchTransmit: { checked: true },
          touchReceive: { checked: false },
          headEnable: { checked: true },
          headTransmit: { checked: true },
          headReceive: { checked: false },
          locationEnable: { checked: true },
          locationTransmit: { checked: true },
          locationReceive: { checked: false },
          renderingStyle: { value: "regular" },
          defaultDisplay: { checked: true }
        } }
    ] );

    //
    // restoring the options the user selected
    //
    writeForm( this.ctrls, this.formState );
    window.addEventListener( "beforeunload", function () {
      var state = readForm( this.ctrls );
      setSetting( this.formStateKey, state );
      this.speech.enable( false );
    }.bind( this ), false );

    //
    // Setup THREE.js
    //
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer( {
      antialias: true,
      canvas: this.ctrls.frontBuffer
    } );
    this.renderer.setClearColor( this.options.backgroundColor );
    this.testPoint = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster( new THREE.Vector3(),
        new THREE.Vector3(), 0, 7 );
    this.direction = new THREE.Vector3();
    this.buttonFactory = new Primrose.ButtonFactory( buttonModel,
        buttonOptions );
    this.avatar = new Primrose.ModelLoader( avatarModel, function () {
      this.addUser( { x: 0, y: 0, z: 0, dx: 0, dy: 0, dz: 0, heading: 0,
        dHeading: 0, userName: this.userName } );
    }.bind( this ) );
    this.hand = new THREE.Mesh(
        new THREE.SphereGeometry( 0.1, 4, 4 ),
        new THREE.MeshPhongMaterial( { color: 0xffff00, emissive: 0x7f7f00 } )
        );
    this.hand.name = "HAND0";
    this.hand.add( new THREE.PointLight( 0xffff00, 1, 7 ) );
    this.hand.velocity = new THREE.Vector3();
    this.scene.add( this.hand );
    Primrose.ModelLoader.loadScene( sceneModel, function ( sceneGraph ) {
      this.mainScene = sceneGraph;
      this.scene.add( sceneGraph );
      var cam = this.mainScene.Camera.children[0];
      this.scene.remove( cam );
      this.camera = new THREE.PerspectiveCamera( cam.fov, cam.aspect, cam.near,
          this.options.drawDistance );
    }.bind( this ) );

    //
    // Setup audio
    //
    this.audio = new Primrose.Output.Audio3D();
    this.audio.loadBuffer( clickSound, null, function ( buffer ) {
      this.clickSound = buffer;
    }.bind( this ) );
    this.audio.load3DSound( ambientSound, true, 0, 0, 0, null, function (
        amb ) {
      amb.volume.gain.value = 0.07;
      amb.source.start( 0 );
    }.bind( this ) );

    //
    // Setup networking
    //
    if ( navigator.onLine ) {
      this.ctrls.connectButton.addEventListener( "click", this.login.bind(
          this ), false );

      this.socket = io.connect( document.location.hostname, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 60
      } );
      this.socket.on( "connect", this.connectToServer.bind( this ) );
      this.socket.on( "typing", this.showTyping.bind( this, false, false ) );
      this.socket.on( "chat", this.showChat.bind( this ) );
      this.socket.on( "userJoin", this.addUser.bind( this ) );
      this.socket.on( "userState", this.updateUserState.bind( this, false ) );
      this.socket.on( "userLeft", this.loseUser.bind( this ) );
      this.socket.on( "loginFailed", this.announceFailure.bind( this ) );
      this.socket.on( "userList", this.listUsers.bind( this ) );
      this.socket.on( "disconnect", this.disconnectFromServer.bind( this ) );
      this.socket.on( "handshakeFailed", console.error.bind( console,
          "Failed to connect to websocket server. Available socket controllers are:" ) );
      this.socket.on( "handshakeComplete", this.completeHandshake.bind(
          this ) );
      this.proxy = new Primrose.WebRTCSocket(
          this.socket,
          this.ctrls.deviceTypes.value !== HMD_SMARTPHONE);
    }

    //
    // setting up all other event listeners
    //
    this.setupModuleEvents( this.leap, "leap" );
    this.setupModuleEvents( this.gamepad, "gamepad" );
    this.setupModuleEvents( this.touch, "touch" );
    this.setupModuleEvents( this.head, "head" );
    this.setupModuleEvents( this.speech, "speech" );
    this.setupModuleEvents( this.keyboard, "keyboard" );
    this.setupModuleEvents( this.mouse, "mouse" );

    window.addEventListener( "keyup", function ( evt ) {
      if ( evt.keyCode === Primrose.Input.Keyboard.GRAVEACCENT ) {
        this.toggleOptions();
      }
    }.bind( this ), false );

    window.addEventListener( "resize", function () {
      this.setSize( window.innerWidth, window.innerHeight );
    }.bind( this ), false );

    window.addEventListener( "focus", function () {
      this.focused = true;
    }.bind( this ), false );

    window.addEventListener( "blur", function () {
      this.focused = false;
    }.bind( this ), false );

    document.addEventListener( "focus", function () {
      this.focused = true;
    }.bind( this ), false );

    document.addEventListener( "blur", function () {
      this.focused = false;
    }.bind( this ), false );

    this.fullScreen = function () {
      if ( this.fullscreenElement.webkitRequestFullscreen ) {
        this.fullscreenElement.webkitRequestFullscreen( {
          vrDisplay: this.vr.display } );
      }
      else if ( this.fullscreenElement.mozRequestFullScreen ) {
        this.fullscreenElement.mozRequestFullScreen( {
          vrDisplay: this.vr.display } );
      }
    };

  this.ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
      this.ctrls.output ) );
  this.ctrls.goVR.addEventListener( "click", function ( ) {
    requestFullScreen( ctrls.output, vrDisplay );
    inVR = true;
    camera.fov = ( vrParams.left.recommendedFieldOfView.leftDegrees +
        vrParams.left.recommendedFieldOfView.rightDegrees );
    refreshSize();
  } );

    this.ctrls.renderingStyle.addEventListener( "change", function () {
      this.chooseRenderingEffect( this.ctrls.renderingStyle.value );
    }.bind( this ), false );
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

  VRApplication.CONNECTED_TEXT = "Disconnect";
  VRApplication.DISCONNECTED_TEXT = "Connect";
  VRApplication.RIGHT = new THREE.Vector3( -1, 0, 0 );

  VRApplication.prototype.makeButton = function ( toggle ) {
    var btn = this.buttonFactory.create( toggle );
    this.mainScene.buttons.push( btn );
    this.mainScene[btn.name] = btn;
    this.scene.add( btn.base );
    return btn;
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

  VRApplication.prototype.setupModuleEvents = function ( module, name ) {
    var e = this.ctrls[name + "Enable"],
        t = this.ctrls[name + "Transmit"],
        r = this.ctrls[name + "Receive"];
    z = this.ctrls[name + "Zero"];
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

    if ( z && module.zeroAxes ) {
      z.addEventListener( "click", module.zeroAxes.bind( module ), false );
    }

    module.enable( e.checked );
    module.transmit( t.checked );
    module.receive( r.checked );
    t.disabled = !e.checked;
    if ( t.checked && t.disabled ) {
      t.checked = false;
    }
  };

  VRApplication.prototype.showOptions = function () {
    this.ctrls.options.style.display = "";
    this.keyboard.pause( true );
    this.mouse.exitPointerLock();
  };

  VRApplication.prototype.hideOptions = function () {
    this.ctrls.options.style.display = "none";
    this.fullScreen();
    this.keyboard.pause( false );
    this.mouse.requestPointerLock();
  };

  VRApplication.prototype.toggleOptions = function () {
    var show = this.ctrls.options.style.display !== "";
    if ( show ) {
      this.showOptions();
    }
    else {
      this.hideOptions();
    }
  };

  VRApplication.prototype.chooseRenderingEffect = function ( type ) {
    this.oculusCorrector.rotation.set( 0, 0, 0, "XYZ" );
    if ( this.lastRenderingType !== type ) {
      switch ( type ) {
        case "anaglyph":
          this.effect = new THREE.AnaglyphEffect( this.renderer, 5,
              window.innerWidth, window.innerHeight );
          this.enableMousePitch = true;
          break;
        case "cardboard":
          this.effect = new THREE.OculusRiftEffect( this.renderer, {
            worldFactor: 1,
            HMD: {
              hResolution: screen.availWidth,
              vResolution: screen.availHeight,
              hScreenSize: 0.126,
              vScreenSize: 0.075,
              interpupillaryDistance: 0.064,
              lensSeparationDistance: 0.064,
              eyeToScreenDistance: 0.051,
              distortionK: [ 1, 0.22, 0.06, 0.0 ],
              chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0 ]
            }
          } );
          this.enableMousePitch = false;
          break;
        case "vr":
          this.effect = new THREE.VREffect( this.renderer, this.vr.display );
          this.enableMousePitch = false;
          this.oculusCorrector.rotation.set( 0, -Math.PI / 3, 0, "XYZ" );
          break;
        default:
          this.effect = null;
          type = "regular";
          this.enableMousePitch = true;
          break;
      }

      if ( this.ctrls.renderingStyle.value !== type ) {
        this.ctrls.renderingStyle.value = type;
      }

      if ( ( this.lastRenderingType === "cardboard" ||
          this.lastRenderingType === "vr" ) &&
          ( type === "anaglyph" || type === "regular" ) ) {
        alert( "The page must reload to enable the new settings." );
        document.location.reload();
      }
      this.lastRenderingType = type;
    }
  };

  VRApplication.prototype.setSize = function ( w, h ) {
    if ( this.camera ) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }

    this.chooseRenderingEffect( this.ctrls.renderingStyle.value );

    this.renderer.setSize( w, h );
    if ( this.effect ) {
      this.effect.setSize( w, h );
    }
  };

  VRApplication.prototype.login = function () {
    if ( this.socket &&
        this.socket.connected &&
        this.ctrls.connectButton.classList.contains( "primary" ) ) {
      if ( this.ctrls.connectButton.innerHTML ===
          VRApplication.DISCONNECTED_TEXT ) {
        this.userName = this.ctrls.userNameField.value;
        var password = this.ctrls.passwordField.value;
        if ( this.userName && password ) {
          this.socket.once( "salt", function ( salt ) {
            var hash = CryptoJS.SHA512( salt + password )
                .toString();
            this.socket.emit( "hash", hash );
          }.bind( this ) );
          this.ctrls.connectButton.innerHTML = "Connecting...";
          this.ctrls.connectButton.className = "secondary button";
          this.socket.emit( "login", {
            userName: this.userName,
            email: this.ctrls.emailField.value
          } );
        }
        else {
          this.showMessage( "Please complete the form." );
        }
      }
      else if ( this.ctrls.connectButton.innerHTML ===
          VRApplication.CONNECTED_TEXT ) {
        this.socket.emit( "logout" );
        this.ctrls.connectButton.innerHTML = VRApplication.DISCONNECTED_TEXT;
      }
    }
    else {
      this.showMessage( "No socket available." );
    }
  };

  VRApplication.prototype.addUser = function ( userState,
      skipMakingChatList ) {
    var user = null;
    if ( !this.users[userState.userName] ) {
      if ( this.userName === Primrose.Application.DEFAULT_USER_NAME ||
          userState.userName !== this.userName ) {
        user = new THREE.Object3D();
        var model = this.avatar.clone();
        user.animation = model.animation;
        model.position.z = 1.33;
        user.add( model );

        user.nameObj = new Primrose.Text.PlainText(
            userState.userName, 0.5,
            "white", "transparent",
            0, this.avatarHeight + 2.5, 0,
            "center" );
        user.add( user.nameObj );

        user.velocity = new THREE.Vector3();

        if ( userState.userName === Primrose.Application.DEFAULT_USER_NAME ) {
          this.currentUser = user;
        }
        else {
          this.showMessage( "$1 has joined", userState.userName );
        }

        this.scene.add( user );
      }
      else {
        delete this.users[Primrose.Application.DEFAULT_USER_NAME];
        user = this.currentUser;
      }
    }
    else {
      user = this.users[userState.userName];
    }

    this.users[userState.userName] = user;
    this.updateUserState( true, userState );

    if ( !skipMakingChatList ) {
      this.makeChatList();
    }
  };

  VRApplication.prototype.connectToServer = function () {
    this.socket.emit( "handshake", "demo" );
    this.ctrls.connectButton.innerHTML = VRApplication.DISCONNECTED_TEXT;
    this.ctrls.connectButton.className = "primary button";
  };

  VRApplication.prototype.disconnectFromServer = function ( reason ) {
    this.ctrls.connectButton.className = "secondary button";
    this.ctrls.connectButton.innerHTML = fmt( "Disconnected: $1", reason );
    this.showMessage( reason );
  };

  VRApplication.prototype.completeHandshake = function ( controller ) {
    if ( controller === "demo" && this.ctrls.autoLogin.checked ) {
      this.ctrls.connectButton.click();
    }
  };

  VRApplication.prototype.announceFailure = function () {
    this.ctrls.connectButton.innerHTML = "Login failed. Try again.";
    this.ctrls.connectButton.className = "primary button";
    this.showMessage( "Incorrect user name or password!" );
  };

  VRApplication.prototype.listUsers = function ( newUsers ) {
    this.ctrls.connectButton.innerHTML = VRApplication.CONNECTED_TEXT;
    this.ctrls.connectButton.className = "primary button";
    this.proxy.connect( this.userName );
    newUsers.sort( function ( a ) {
      return ( a.userName === this.userName ) ? -1 : 1;
    } );
    for ( var i = 0; i < newUsers.length; ++i ) {
      this.addUser( newUsers[i], true );
    }
    this.makeChatList();
  };

  VRApplication.prototype.loseUser = function ( userName ) {
    if ( this.users[userName] ) {
      this.showMessage( "$1 has disconnected", userName );
      this.scene.remove( this.users[userName] );
      delete this.users[userName];
      this.makeChatList();
    }
  };

  VRApplication.prototype.updateUserState = function ( firstTime, userState ) {
    var user = user || this.users[userState.userName];
    if ( !user ) {
      setTimeout( this.addUser.bind( this, userState ), 1 );
    }
    else {
      if ( firstTime ) {
        user.position.set(
            userState.x,
            // just in case the user falls through the world,
            // reloading will get them back to level.
            Math.max( 0, userState.y ),
            userState.z );
        user.lastHeading = user.heading = userState.heading;
        user.dHeading = 0;
      }
      else {
        user.velocity.set(
            ( ( userState.x + userState.dx * this.options.dtNetworkUpdate ) -
                user.position.x ) / this.options.dtNetworkUpdate,
            ( ( userState.y + userState.dy * this.options.dtNetworkUpdate ) -
                user.position.y ) / this.options.dtNetworkUpdate,
            ( ( userState.z + userState.dz * this.options.dtNetworkUpdate ) -
                user.position.z ) / this.options.dtNetworkUpdate );
        user.dHeading = ( ( userState.heading + userState.dHeading *
            this.options.dtNetworkUpdate ) - user.heading ) /
            this.options.dtNetworkUpdate;
      }
    }
  };

  VRApplication.prototype.makeChatList = function () {
    var list = [ ];
    for ( var k in this.users ) {
      list.push( k );
    }
    list.sort();
    var userList = "";
    for ( var i = 0; i < list.length; ++i ) {
      if ( list[i] !== Primrose.Application.DEFAULT_USER_NAME ) {
        userList += list[i] + "\n";
      }
    }

    this.userList.value = userList;
  };

  VRApplication.prototype.connectGamepad = function ( id ) {
    if ( !this.gamepad.isGamepadSet() && confirm( fmt(
        "Would you like to use this gamepad? \"$1\"", id ) ) ) {
      this.gamepad.setGamepad( id );
    }
  };

  VRApplication.prototype.changeHMD = function () {
    this.vr.connect( this.ctrls.hmdListing.value );
    if ( this.ctrls.hmdListing.value ) {
      if ( this.ctrls.renderingStyle.value !== "vr" ) {
        this.chooseRenderingEffect( "vr" );
      }
      else {
        this.effect.setHMD( this.vr.display );
      }
    }
  };

  VRApplication.prototype.resetPosition = function () {
    this.currentUser.position.set( 0, 2, 0 );
    this.currentUser.velocity.set( 0, 0, 0 );
  };

  VRApplication.prototype.jump = function () {
    if ( this.onground ) {
      this.currentUser.velocity.y += 10;
      this.onground = false;
    }
  };

  VRApplication.prototype.showMessage = function () {
    var msg = fmt.apply( window, map( arguments, function ( v ) {
      return v ? v.toString() : "";
    } ) );
    if ( this.currentUser ) {
      this.showChat( msg );
    }
    else {
      alert( msg );
    }
  };

  VRApplication.prototype.showTyping = function ( isLocal, isComplete, text ) {
    if ( this.currentUser ) {
      if ( this.lastText ) {
        this.camera.remove( this.lastText );
        this.lastText = null;
      }

      if ( isComplete ) {
        if ( this.socket ) {
          this.socket.emit( "chat", text );
        }
      }
      else {
        if ( isLocal && this.socket ) {
          this.socket.emit( "typing", text );
        }
        if ( text ) {
          var textObj = this.putUserText( text, 0.125, 0, 0, -4, "right" );
          this.lastText = textObj;
          if ( this.clickSound ) {
            this.audio.playBufferImmediate( this.clickSound, 0.5 );
          }
        }
      }
    }
  };

  VRApplication.prototype.shiftLines = function () {
    for ( var i = 0; i < this.chatLines.length; ++i ) {
      this.chatLines[i].position.y = ( this.chatLines.length - i ) *
          this.options.chatTextSize * 1.333 - 1;
    }
  };

  VRApplication.prototype.putUserText = function ( msg, size, x, y, z,
      align ) {
    var textObj = new Primrose.Text.PlainText(
        msg, size,
        "white", "transparent",
        x, y, z, align );
    this.camera.add( textObj );
    return textObj;
  };

  VRApplication.prototype.showChat = function ( msg ) {
    msg = typeof ( msg ) === "string" ? msg : fmt( "[$1]: $2", msg.userName,
        msg.text );
    if ( this.currentUser ) {
      if ( this.userName === msg.userName ) {
        this.showTyping( true, false, null );
      }
      var textObj = this.putUserText( msg, this.options.chatTextSize, 0, 0, -5,
          "left" );
      this.chatLines.push( textObj );
      this.shiftLines();
      setTimeout( function () {
        this.camera.remove( textObj );
        this.chatLines.shift();
        this.shiftLines();
      }.bind( this ), 3000 );
    }

    var div = document.createElement( "div" );
    div.appendChild( document.createTextNode( msg ) );
    this.ctrls.chatLog.appendChild( div );
    this.ctrls.chatLog.scrollTop = this.ctrls.chatLog.scrollHeight;

    if ( !this.focused && window.Notification ) {
      this.makeNotification( msg );
    }
  };

  VRApplication.prototype.makeNotification = function ( msg ) {
    if ( Notification.permission === "granted" ) {
      if ( this.lastNote ) {
        msg = this.lastNote.body + "\n" + msg;
        this.lastNote.close();
        this.lastNote = null;
      }
      this.lastNote = new Notification( document.title, {
        icon: "../ico/chat.png",
        body: msg
      } );
      this.lastNote.addEventListener( "close", function () {
        this.lastNote = null;
      }.bind( this ), false );
      return this.lastNote;
    }
  };

  VRApplication.prototype.start = function () {
    var waitForResources = function ( t ) {
      this.lt = t;
      if ( this.camera && this.mainScene && this.currentUser &&
          this.buttonFactory.template ) {
        this.setSize( window.innerWidth, window.innerHeight );

        this.cameraMount.position.y = this.avatarHeight;

        this.currentUser.add( this.cameraMount );
        this.cameraMount.add( this.oculusCorrector );
        this.oculusCorrector.add( this.camera );
        this.camera.add( this.passthrough.mesh );

        this.leap.start();
        this.animate = this.animate.bind( this );
        this.fire( "ready" );
        requestAnimationFrame( this.animate );
      }
      else {
        requestAnimationFrame( waitForResources );
      }
    }.bind( this );

    requestAnimationFrame( waitForResources );
  };

  var lastDebug = null;

  VRApplication.prototype.animate = function ( t ) {
    requestAnimationFrame( this.animate );
    var dt = ( t - this.lt ) * 0.001;
    this.lt = t;

    if ( this.wasFocused && this.focused ) {
      THREE.AnimationHandler.update( dt );
      this.speech.update( dt );
      this.keyboard.update( dt );
      this.mouse.update( dt );
      this.head.update( dt );
      this.vr.update( dt );
      this.touch.update( dt );
      this.gamepad.update( dt );
      this.leap.update( dt );

      var roll = this.head.getValue( "roll" );
      var pitch = this.head.getValue( "pitch" );
      if ( this.enableMousePitch ) {
        pitch += this.gamepad.getValue( "pitch" ) +
            this.mouse.getValue( "pitch" );
      }
      var heading = this.head.getValue( "heading" ) +
          this.gamepad.getValue( "heading" ) +
          this.touch.getValue( "heading" ) +
          this.mouse.getValue( "heading" );
      var pointerPitch = pitch +
          this.leap.getValue( "HAND0Y" ) +
          this.mouse.getValue( "pointerPitch" );
      var pointerHeading = heading +
          this.leap.getValue( "HAND0X" ) +
          this.mouse.getValue( "pointerHeading" );
      var pointerDistance = ( this.leap.getValue( "HAND0Z" ) +
          this.mouse.getValue( "pointerDistance" ) +
          this.mouse.getValue( "pointerPress" ) +
          2 ) / Math.cos( pointerPitch );

      var strafe = 0;
      var drive = 0;

      this.passthrough.mesh.visible = this.keyboard.isDown( "camera" );
      if ( this.passthrough.mesh.visible ) {
        this.passthrough.update();
      }

      if ( lastDebug ) {
        this.camera.remove( lastDebug );
        lastDebug = null;
      }
      if ( this.keyboard.isDown( "debug" ) ) {
        lastDebug = this.putUserText(
            fmt( "[nothing]" ),
            this.options.chatTextSize, 0, 0, pointerDistance, "left" );
      }

      if ( this.ctrls.defaultDisplay.checked ) {
        //
        // update user position and view
        //
        this.currentUser.dHeading = ( heading - this.currentUser.heading ) /
            dt;
        strafe = this.keyboard.getValue( "strafeRight" ) +
            this.keyboard.getValue( "strafeLeft" ) +
            this.gamepad.getValue( "strafe" );
        drive = this.keyboard.getValue( "driveBack" ) +
            this.keyboard.getValue( "driveForward" ) +
            this.gamepad.getValue( "drive" ) +
            this.touch.getValue( "drive" );

        if ( this.onground || this.currentUser.position.y < -0.5 ) {
          if ( this.autoWalking ) {
            strafe = 0;
            drive = -0.5;
          }
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
          drive = drive * Math.cos( heading ) - strafe * Math.sin( heading );
          strafe = len;
          this.currentUser.velocity.x = this.currentUser.velocity.x * 0.9 +
              strafe * 0.1;
          this.currentUser.velocity.z = this.currentUser.velocity.z * 0.9 +
              drive * 0.1;
        }

        this.currentUser.velocity.y -= dt * this.options.gravity;

        //
        // do collision detection
        //
        var len = this.currentUser.velocity.length() * dt,
            inter,
            i;
        this.direction.copy( this.currentUser.velocity );
        this.direction.normalize();
        this.testPoint.copy( this.currentUser.position );
        this.testPoint.y += this.avatarHeight / 2;
        this.raycaster.ray.origin.copy( this.testPoint );
        this.raycaster.ray.direction.copy( this.direction );
        this.raycaster.far = len;
        var intersections = this.raycaster.intersectObject( this.scene, true );
        for ( i = 0; i < intersections.length; ++i ) {
          inter = intersections[i];
          if ( inter.object.parent.isSolid ) {
            this.testPoint.copy( inter.face.normal );
            this.testPoint.applyEuler( inter.object.parent.rotation );
            this.currentUser.velocity.reflect( this.testPoint );
            var d = this.testPoint.dot( this.camera.up );
            if ( d > 0.75 ) {
              this.currentUser.position.y = inter.point.y;
              this.currentUser.velocity.y = 0;
              this.onground = true;
            }
          }
        }

        // ground test
        this.testPoint.copy( this.currentUser.velocity )
            .multiplyScalar( dt )
            .add( this.currentUser.position );
        var GROUND_TEST_HEIGHT = 3;
        this.testPoint.y += GROUND_TEST_HEIGHT;
        this.direction.set( 0, -1, 0 );
        this.raycaster.ray.origin.copy( this.testPoint );
        this.raycaster.ray.direction.copy( this.direction );
        this.raycaster.far = GROUND_TEST_HEIGHT * 2;
        intersections = this.raycaster.intersectObject( this.scene, true );
        for ( i = 0; i < intersections.length; ++i ) {
          inter = intersections[i];
          if ( inter.object.parent.isSolid &&
              inter.distance < GROUND_TEST_HEIGHT ) {
            this.testPoint.copy( inter.face.normal );
            this.testPoint.applyEuler( inter.object.parent.rotation );
            this.currentUser.position.y = inter.point.y;
            this.currentUser.velocity.y = 0;
            this.onground = true;
          }
        }

        //
        // send a network update of the user's position, if it's been enough
        // time since the last update (don'dt want to flood the server).
        //
        this.frame += dt;
        if ( this.frame > this.options.dtNetworkUpdate ) {
          this.frame -= this.options.dtNetworkUpdate;
          var state = {
            x: this.currentUser.position.x,
            y: this.currentUser.position.y,
            z: this.currentUser.position.z,
            dx: this.currentUser.velocity.x,
            dy: this.currentUser.velocity.y,
            dz: this.currentUser.velocity.z,
            heading: this.currentUser.heading,
            dHeading: ( this.currentUser.heading -
                this.currentUser.lastHeading ) / this.options.dtNetworkUpdate,
            isRunning: this.currentUser.velocity.length() > 0
          };
          this.currentUser.lastHeading = this.currentUser.heading;
          if ( this.socket ) {
            this.socket.emit( "userState", state );
          }
        }
      }

      //
      // update avatars
      //
      for ( var key in this.users ) {
        var user = this.users[key];
        this.testPoint.copy( user.velocity );
        this.testPoint.multiplyScalar( dt );
        user.position.add( this.testPoint );
        user.heading += user.dHeading * dt;
        user.rotation.set( 0, user.heading, 0, "XYZ" );
        if ( user !== this.currentUser ) {
          // we have to offset the rotation of the name so the user
          // can read it.
          user.nameObj.rotation.set( 0, this.currentUser.heading -
              user.heading, 0, "XYZ" );
        }
        if ( !user.animation.isPlaying && user.velocity.length() >= 2 ) {
          user.animation.play();
        }
        else if ( user.animation.isPlaying && user.velocity.length() < 2 ) {
          user.animation.stop();
        }
      }

      //
      // place pointer
      //
      this.direction.set( 0, 0, -pointerDistance )
          .applyAxisAngle( VRApplication.RIGHT, -pointerPitch )
          .applyAxisAngle( this.camera.up, pointerHeading );

      this.testPoint.copy( this.hand.position );
      this.hand.position.copy( this.currentUser.position )
          .add(
              this.direction );
      this.hand.velocity.copy( this.hand.position )
          .sub(
              this.testPoint );

      for ( var j = 0; j < this.mainScene.buttons.length; ++j ) {
        var btn = this.mainScene.buttons[j];
        var tag = btn.test( this.currentUser.position, this.hand );
        if ( tag ) {
          this.hand.position.copy( tag );
        }
        else {
          btn.test( this.currentUser.position, this.currentUser );
        }
      }

      this.fire( "update", dt );
      //
      // update audio
      //
      this.testPoint.copy( this.currentUser.position );
      this.testPoint.divideScalar( 10 );
      this.audio.setPosition( this.testPoint.x, this.testPoint.y,
          this.testPoint.z );
      this.audio.setVelocity( this.currentUser.velocity.x,
          this.currentUser.velocity.y, this.currentUser.velocity.z );
      this.testPoint.normalize();
      this.audio.setOrientation( this.testPoint.x, this.testPoint.y,
          this.testPoint.z, 0, 1, 0 );

      //
      // update the camera
      //
      this.cameraMount.rotation.set( pitch, 0, roll, "YZX" );
      this.camera.quaternion.set(
          this.vr.getValue( "pitch" ),
          this.vr.getValue( "heading" ),
          this.vr.getValue( "roll" ),
          this.vr.getValue( "homogeneous" ) );

      //
      // draw
      //
      if ( this.effect ) {
        this.effect.render( this.scene, this.camera );
      }
      else {
        this.renderer.render( this.scene, this.camera );
      }
    }

    this.wasFocused = this.focused;
  };

  return VRApplication;
} )();
