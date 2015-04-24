/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global isOSX, Primrose, THREE, ctrls, isMobile */
var modA = isOSX ? "metaKey" : "ctrlKey";
var modB = isOSX ? "altKey" : "shiftKey";
var cmdPre = isOSX ? "CMD+OPT" : "CTRL+SHIFT";
var vrDisplay,
    vrSensor,
    vrEffect,
    renderer,
    lastTab,
    ctrls;

function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Keys[evt.keyCode];
  this.value = this.value.toLowerCase()
      .replace( "arrow", " arrow" );
  this.blur();
}

function setupKeyOption ( elem, char, code ) {
  elem.value = char.toLowerCase();
  elem.dataset.keycode = code;
  elem.addEventListener( "keydown", clearKeyOption );
  elem.addEventListener( "keyup", setKeyOption );
}

function goFullscreen () {
  var elem = ctrls.output;
  if ( vrDisplay ) {
    if ( !vrEffect ) {
      vrEffect = new SeansVREffect( renderer, vrDisplay );
    }
    if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( { vrDisplay: vrDisplay } );
    }
    else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen( { vrDisplay: vrDisplay } );
    }
  }
  else {
    if ( elem.requestFullscreen ) {
      elem.requestFullscreen();
    }
    else if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
    }
    else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen();
    }
    else if ( elem.msRequestFullscreen ) {
      elem.msRequestFullscreen();
    }
  }

  if ( elem.requestPointerLock ) {
    elem.requestPointerLock();
  }
  else if ( elem.webkitRequestPointerLock ) {
    elem.webkitRequestPointerLock();
  }
  else if ( elem.mozRequestPointerLock ) {
    elem.mozRequestPointerLock();
  }
}

function gotVRDevices ( devices ) {
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
  PrimroseDemo();
}

function PrimroseDemo ( err ) {
  if ( err ) {
    console.error( err );
  }

  ctrls = findEverything();

  var lt = 0,
      dragging = false,
      lastMouseX,
      lastMouseY,
      lastTouchX,
      lastTouchY,
      touchCount = 0,
      pointerX,
      pointerY,
      currentEditor,
      lastEditor,
      touchDrive = 0,
      touchStrafe = 0,
      SPEED = 0.0005,
      heading = 0,
      pitch = 0,
      keyState = { },
      scene = new THREE.Scene(),
      pickingScene = new THREE.Scene(),
      body = new THREE.Object3D(),
      camera = new THREE.PerspectiveCamera( 50, ctrls.output.width /
          ctrls.output.height, 0.1, 1000 ),
      back = new THREE.WebGLRenderTarget( ctrls.output.width,
          ctrls.output.height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            stencilBuffer: false
          } ),
      fakeCamera = new THREE.PerspectiveCamera( 50, ctrls.output.width /
          ctrls.output.height, 0.001, 1000 ),
      mouse = new THREE.Vector3( 0, 0, 0 ),
      raycaster = new THREE.Raycaster( new THREE.Vector3(),
          new THREE.Vector3(), 0, 50 ),
      pointer = textured( sphere( 0.01, 4, 2 ), 0xff0000 );
  back.generateMipMaps = false;
  renderer = new THREE.WebGLRenderer( {
    canvas: ctrls.output,
    alpha: true,
    antialias: true
  } );

  var gl = renderer.getContext(),
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg" ),
      floor = textured( box( 25, 1, 25 ), "../images/deck.png", 25, 25 ),
      loader = new THREE.ObjectLoader(),
      editor = new Primrose.Controls.TextBox( "textEditor", {
        size: new Primrose.Size( 1024, 1024 ),
        fontSize: (vrDisplay ? 40 : 20) / window.devicePixelRatio,
        tokenizer: Primrose.Grammars.Basic,
        theme: Primrose.Themes.Dark,
        hideLineNumbers: true,
        hideScrollBars: true
      } );

  loader.load( "monitor.json", function ( f ) {
    scene.add( f );
    f.position.set( -0.1, -0.1, 0 );
    f.traverse( function ( obj ) {
      if ( obj.material && obj.material.name === "ScreenMaterial" ) {
        textured( obj, editor );
        pickingScene.add( textured( obj.geometry, editor.getRenderer()
            .getPickingTexture() ) );
      }
    } );
  } );

  body.position.set( 0, 0, vrDisplay || isMobile ? 1 : 0.35 );
  floor.position.set( 0, -3, 0 );

  scene.add( sky );
  body.add( camera );
  scene.add( fakeCamera );
  scene.add( floor );
  scene.add( body );
  scene.add( pointer );



  var running = false;
  var inputCallback = null;
  var currentEditIndex = 0;
  var currentProgram = null;
  var originalGrammar = null;

  function toEnd (  ) {
    editor.selectionStart = editor.selectionEnd = editor.value.length;
    editor.scrollIntoView( editor.frontCursor );
    editor.forceUpdate();
  }

  function done () {
    if ( running ) {
      flush( );
      running = false;
      if ( originalGrammar ) {
        editor.setTokenizer( originalGrammar );
      }
      editor.value = currentProgram;
      toEnd( );
    }
  }

  function clearScreen () {
    editor.selectionStart = editor.selectionEnd = 0;
    editor.value = "";
    return true;
  }

  function loadFile ( fileName, callback ) {
    GET( fileName.toLowerCase(), "text", function ( file ) {
      if ( isOSX ) {
        file = file.replace( "CTRL+SHIFT+SPACE", "CMD+OPT+E" );
      }
      editor.value = currentProgram = file;
      if ( callback ) {
        callback();
      }
    } );
  }

  loadFile( "../oregon.bas" );
  var pageSize = vrDisplay ? 10 : 40;
  var outputQueue = [ ];
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
    flush( );
  }

  var buffer = "";
  function stdout ( str ) {
    buffer += str;
  }

  window.addEventListener( "resize", refreshSize );
  window.addEventListener( "keydown", keyDown );
  window.addEventListener( "keyup", keyUp );
  window.addEventListener( "wheel", mouseWheel );
  window.addEventListener( "paste", paste );
  ctrls.output.addEventListener( "mousedown", mouseDown );
  ctrls.output.addEventListener( "mousemove", mouseMove );
  ctrls.output.addEventListener( "mouseup", mouseUp );
  ctrls.output.addEventListener( "touchstart", touchStart );
  ctrls.output.addEventListener( "touchmove", touchMove );
  ctrls.output.addEventListener( "touchend", touchEnd );

  var cmdLabels = document.querySelectorAll( ".cmdLabel" );
  for ( var i = 0; i < cmdLabels.length; ++i ) {
    cmdLabels[i].innerHTML = cmdPre;
  }

  setupKeyOption( ctrls.leftKey, "A", 65 );
  setupKeyOption( ctrls.rightKey, "D", 68 );
  setupKeyOption( ctrls.forwardKey, "W", 87 );
  setupKeyOption( ctrls.backKey, "S", 83 );

  if ( vrDisplay ) {
    ctrls.goRegular.style.display = "none";
    ctrls.nightly.display = "none";
    ctrls.goVR.addEventListener( "click", goFullscreen );
  }
  else {
    ctrls.goVR.style.display = "none";
    ctrls.goRegular.addEventListener( "click", goFullscreen );
  }

  refreshSize();

  requestAnimationFrame( render );

  function refreshSize () {
    var styleWidth = ctrls.outputContainer.clientWidth,
        styleHeight = ctrls.outputContainer.clientHeight,
        ratio = window.devicePixelRatio || 1,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio;
    if ( vrEffect ) {
      canvasWidth = vrEffect.left.renderRect.width +
          vrEffect.right.renderRect.width;
      canvasHeight = Math.max( vrEffect.left.renderRect.height,
          vrEffect.right.renderRect.height );
    }
    renderer.domElement.style.width = px( styleWidth );
    renderer.domElement.style.height = px( styleHeight );
    renderer.domElement.width = canvasWidth;
    renderer.domElement.height = canvasHeight;
    renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    back.setSize( canvasWidth, canvasHeight );
    fakeCamera.aspect = camera.aspect = canvasWidth / canvasHeight;
    camera.updateProjectionMatrix( );
    fakeCamera.updateProjectionMatrix( );
  }

  function sendInput ( evt ) {
    if ( buffer.length > 0 ) {
      flush();
    }
    else {
      editor.keyDown( evt );
      var str = editor.value.substring( currentEditIndex );
      inputCallback( str.trim() );
      inputCallback = null;
    }
  }

  function isExecuteCommand ( evt ) {
    return ( !isOSX &&
        evt.ctrlKey &&
        evt.shiftKey &&
        evt.keyCode === Primrose.Keys.SPACE ) ||
        ( isOSX &&
            evt.metaKey &&
            evt.altKey &&
            evt.keyCode === Primrose.Keys.E );
  }

  function execute () {
    originalGrammar = lastEditor.getTokenizer();
    if ( originalGrammar && originalGrammar.interpret ) {
      running = true;

      var next = function () {
        if ( running ) {
          setTimeout( looper, 1 );
        }
      };

      currentProgram = editor.value;
      var looper = originalGrammar.interpret( currentProgram, input,
          stdout, stdout, next, clearScreen, loadFile, done );
      editor.setTokenizer( Primrose.Grammars.PlainText );
      clearScreen();
      next();
    }
  }

  function keyDown ( evt ) {
    if ( !lastEditor || !lastEditor.focused ) {
      keyState[evt.keyCode] = true;
    }
    else if ( running && inputCallback && evt.keyCode ===
        Primrose.Keys.ENTER ) {
      sendInput( evt );
    }
    else if ( !running && isExecuteCommand( evt ) ) {
      execute();
    }
    else if ( lastEditor ) {
      lastEditor.keyDown( evt );
    }
  }

  function keyUp ( evt ) {
    keyState[evt.keyCode] = false;
  }

  function setPointer ( x, y ) {
    pointerX = x;
    pointerY = ctrls.output.height - y;
    mouse.set(
        2 * ( x / ctrls.output.width ) - 1,
        -2 * ( y / ctrls.output.height ) + 1 );

    fakeCamera.position.copy( body.position );
    fakeCamera.rotation.copy( body.rotation );
    raycaster.setFromCamera( mouse, fakeCamera );
    if ( currentEditor ) {
      lastEditor = currentEditor;
    }
    currentEditor = null;
    var objects = raycaster.intersectObject( scene, true );
    var firstObj = objects.length > 0 && objects[0].object;
    if ( firstObj === sky || firstObj === floor ) {
      pointer.position.copy( raycaster.ray.direction );
      pointer.position.multiplyScalar( 3 );
      pointer.position.add( raycaster.ray.origin );
    }
    else {
      for ( var i = 0; i < objects.length; ++i ) {
        var obj = objects[i];
        if ( obj.object !== pointer ) {
          pointer.position.set( 0, 0, 0 );
          pointer.lookAt( obj.face.normal );
          pointer.position.copy( obj.point );
          if ( obj.object.editor ) {
            currentEditor = obj.object.editor;
          }
          break;
        }
      }
    }
  }

  function paste ( evt ) {
    if ( lastEditor ) {
      lastEditor.readClipboard( evt );
    }
  }

  function mouseWheel ( evt ) {
    if ( lastEditor ) {
      lastEditor.readWheel( evt );
    }
  }

  function editorFocus ( evt ) {
    var good = false;
    if ( evt.target === ctrls.output ) {
      if ( currentEditor ) {
        currentEditor.focus();
        evt.preventDefault();
        if ( !window.onbeforeunload ) {
          window.onbeforeunload = function () {
            return "Are you sure you want to leave?";
          };
        }
        good = true;
      }
    }

    if ( !good && lastEditor ) {
      lastEditor.blur();
      lastEditor = null;
    }
  }

  function mouseDown ( evt ) {
    if ( evt.target === ctrls.output ) {
      dragging = true;
      if ( !isPointerLocked() ) {
        lastMouseX = evt.clientX;
        lastMouseY = evt.clientY;
        setPointer( lastMouseX, lastMouseY );
        pick( "start" );
      }
    }
    editorFocus( evt );
  }

  function mouseMove ( evt ) {
    if ( isPointerLocked() ) {
      var dx = evt.movementX,
          dy = evt.movementY;
      if ( dx === undefined ) {
        dx = evt.mozMovementX;
        dy = evt.mozMovementY;
      }

      if ( dx !== undefined ) {
        if ( evt.shiftKey ) {
          heading -= dx * 0.001;
          pitch += dy * 0.001;
        }
        if ( lastMouseX === undefined ) {
          lastMouseX = dx;
          lastMouseY = dy;
        }
        else {
          lastMouseX += dx;
          lastMouseY += dy;
        }
      }
    }
    else {
      var x = evt.clientX,
          y = evt.clientY;
      if ( lastMouseX !== undefined && evt.shiftKey ) {
        heading -= ( x - lastMouseX ) * 0.001;
        pitch += ( y - lastMouseY ) * 0.001;
      }
      lastMouseX = x;
      lastMouseY = y;
    }
    if ( lastMouseX !== undefined ) {
      setPointer( lastMouseX, lastMouseY );
    }
  }

  function mouseUp ( evt ) {
    dragging = false;
    if ( lastEditor && lastEditor.focused ) {
      lastEditor.endPointer();
    }
  }

  function touchStart ( evt ) {
    lastTouchX = 0;
    lastTouchY = 0;
    for ( var i = 0; i < evt.touches.length; ++i ) {
      lastTouchX += evt.touches[i].clientX;
      lastTouchY += evt.touches[i].clientY;
    }
    lastTouchX /= evt.touches.length;
    lastTouchY /= evt.touches.length;
    setPointer( lastTouchX, lastTouchY );
    pick( "start" );
    if ( evt.touches.length <= 2 && evt.touches.length > touchCount ) {
      touchCount = evt.touches.length;
    }
    editorFocus( evt );
  }

  function touchMove ( evt ) {
    var x = 0,
        y = 0;
    for ( var i = 0; i < evt.touches.length; ++i ) {
      x += evt.touches[i].clientX;
      y += evt.touches[i].clientY;
    }
    x /= evt.touches.length;
    y /= evt.touches.length;

    if ( !lastEditor || !lastEditor.focused ) {
      if ( touchCount === 1 ) {
        touchStrafe = ( x - lastTouchX );
        touchDrive = ( y - lastTouchY );
      }
      else {
        heading += ( x - lastTouchX ) * 0.005;
        pitch += ( y - lastTouchY ) * 0.005;
      }
    }
    else {
      dragging = true;
    }
    lastTouchX = x;
    lastTouchY = y;
    setPointer( lastTouchX, lastTouchY );
    evt.preventDefault( );
  }

  function touchEnd ( evt ) {
    if ( evt.touches.length === 0 ) {
      lastTouchX = null;
      lastTouchY = null;
      touchCount = 0;
      touchDrive = 0;
      touchStrafe = 0;
      if ( currentEditor && currentEditor.isFocused( ) ) {
        currentEditor.endPointer( );
      }
    }
  }

  function update ( dt ) {
    var cos = Math.cos( heading ),
        sin = Math.sin( heading );
    if ( keyState[ctrls.forwardKey.dataset.keycode] ) {
      body.position.z -= dt * SPEED * cos;
      body.position.x -= dt * SPEED * sin;
    }
    else if ( keyState[ctrls.backKey.dataset.keycode] ) {
      body.position.z += dt * SPEED * cos;
      body.position.x += dt * SPEED * sin;
    }
    if ( keyState[ctrls.leftKey.dataset.keycode] ) {
      body.position.x -= dt * SPEED * cos;
      body.position.z += dt * SPEED * sin;
    }
    else if ( keyState[ctrls.rightKey.dataset.keycode] ) {
      body.position.x += dt * SPEED * cos;
      body.position.z -= dt * SPEED * sin;
    }

    body.position.z += dt * SPEED * ( touchStrafe * sin - touchDrive * cos );
    body.position.x -= dt * SPEED * ( touchStrafe * cos + touchDrive * sin );
    body.position.x = Math.min( 12.5, Math.max( -12.5, body.position.x ) );
    body.position.z = Math.min( 12.5, Math.max( -12.5, body.position.z ) );

    body.rotation.set( 0, 0, 0, 0 );
    body.rotateY( heading );
    body.rotateX( pitch );

    sky.position.copy( body.position );

    if ( vrSensor ) {
      var state = vrSensor.getState();
      if ( state.position ) {
        camera.position.set( state.position.x, state.position.y,
            state.position.z );
      }
      if ( state.orientation ) {
        camera.quaternion.set( state.orientation.x, state.orientation.y,
            state.orientation.z, state.orientation.w );
      }
    }

    if ( dragging ) {
      pick( "move" );
    }
  }

  function render ( t ) {
    requestAnimationFrame( render );
    if ( outputQueue.length > 0 ) {
      editor.value += outputQueue.shift() + "\n";
      toEnd( );
      currentEditIndex = editor.selectionStart;
    }
    if ( lt ) {
      update( t - lt );
    }
    var r = vrEffect || renderer;
    r.render( scene, camera );
    lt = t;
  }

  function textured ( geometry, txt, s, t ) {
    var material;

    if ( typeof ( txt ) === "number" ) {
      material = new THREE.MeshBasicMaterial( {
        transparent: true,
        color: txt,
        useScreenCoordinates: false,
        shading: THREE.FlatShading
      } );
    }
    else {
      var texture;
      if ( typeof ( txt ) === "string" ) {
        texture = THREE.ImageUtils.loadTexture( txt );
        texture.anisotropy = renderer.getMaxAnisotropy();
      }
      else if ( txt instanceof Primrose.Controls.TextBox ) {
        texture = txt.getRenderer()
            .getTexture( renderer.getMaxAnisotropy() );
      }
      else {
        texture = txt;
      }

      material = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        map: texture,
        transparent: false,
        shading: THREE.FlatShading,
        side: THREE.DoubleSide
      } );

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

    if ( txt instanceof Primrose.Controls.TextBox ) {
      obj.editor = txt;
    }

    return obj;
  }

  function quad ( w, h ) {
    return new THREE.PlaneBufferGeometry( w, h );
  }

  function box ( w, h, l ) {
    return new THREE.BoxGeometry( w, h, l );
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
    var phiStart = Math.PI + phi * 0.5;
    var thetaStart = ( Math.PI - theta ) * 0.5;
    var geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
        thetaStart, theta, true );
    return geom;
  }

  function pick ( op ) {
    if ( lastEditor && lastEditor.focused ) {
      var r = vrEffect ? vrEffect : renderer;
      scene.remove( body );
      r.render( pickingScene, camera, back, true );
      scene.add( body );
      lastEditor[op + "Picking"]( gl, pointerX, pointerY );
    }
  }
}

function demoSetup () {
  if ( navigator.getVRDevices ) {
    navigator.getVRDevices()
        .then( gotVRDevices )
        .catch( PrimroseDemo );
  } else if ( navigator.mozGetVRDevices ) {
    navigator.mozGetVRDevices( gotVRDevices );
  }
  else {
    PrimroseDemo();
  }
}
