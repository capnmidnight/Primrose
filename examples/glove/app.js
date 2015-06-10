/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

var DEBUG_VR = false;

function StartDemo ( ) {
  "use strict";
  var application = new Primrose.VRApplication(
        "glove demo",
        "../models/scene.json",
        "../models/button.json", null,
        "../models/bear.json", 1.75, 1.3,
        "../audio/click.mp3",
        "../audio/ocean.mp3"
      ),
      vrParams,
      vrDisplay,
      vrSensor,
      lastMouseX,
      lastMouseY,
      lastTouchX,
      lastTouchY,
      pointerX,
      pointerY,
      lastPointerX,
      lastPointerY,
      currentEditor,
      lastEditor,
      lt = 0,
      touchCount = 0,
      touchDrive = 0,
      touchStrafe = 0,
      heading = 0,
      pitch = 0,
      SPEED = 0.005,
      inVR = false,
      dragging = false,
      keyState = { },
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      cmdPre = isOSX ? "CMD+OPT" : "CTRL+SHIFT",
      scene = new THREE.Scene( ),
      subScene = new THREE.Object3D( ),
      pickingScene = new THREE.Scene( ),
      ctrls = findEverything( ),
      keyOptionControls = [
        ctrls.forwardKey,
        ctrls.leftKey,
        ctrls.backKey,
        ctrls.rightKey
      ],
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
      mouse = new THREE.Vector3( 0, 0, 0 ),
      raycaster = new THREE.Raycaster( new THREE.Vector3( ),
          new THREE.Vector3( ), 0, 50 ),
      pointer = textured( sphere( 0.01, 4, 2 ), 0xff0000, true ),
      renderer = new THREE.WebGLRenderer( {
        canvas: ctrls.output,
        alpha: true,
        antialias: true
      } ),
      gl = renderer.getContext( ),
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg", true ),
      light = new THREE.PointLight( 0xffffff ),
      UP = new THREE.Vector3( 0, 1, 0 ),
      RIGHT = new THREE.Vector3( 1, 0, 0 ),
      qPitch = new THREE.Quaternion( ),
      qRift = new THREE.Quaternion( ),
      position = new THREE.Vector3( ),
      translations = [ new THREE.Matrix4(), new THREE.Matrix4() ],
      viewports = [ new THREE.Box2(), new THREE.Box2() ];

  function setTrans ( m, t ) {
    m.makeTranslation( t.x, t.y, t.z );
  }

  function setView ( b, r ) {
    b.min.set( r.x, r.y );
    b.max.set( r.x + r.width, r.y + r.height );
  }

  back.generateMipMaps = false;

  light.position.set( 5, 5, 5 );
  position.set( 0, 0, 8 );

  scene.add( sky );
  scene.add( light );
  scene.add( pointer );
  scene.add( subScene );

  window.addEventListener( "resize", refreshSize );
  window.addEventListener( "keydown", keyDown );
  window.addEventListener( "keyup", function ( evt ) {
    keyState[evt.keyCode] = false;
  } );
  window.addEventListener( "wheel", mouseWheel );
  window.addEventListener( "paste", paste );

  window.addEventListener( "mousedown", mouseDown );
  window.addEventListener( "mousemove", mouseMove );
  window.addEventListener( "mouseup", mouseUp );
  ctrls.output.addEventListener( "touchstart", touchStart );
  ctrls.output.addEventListener( "touchmove", touchMove );
  ctrls.output.addEventListener( "touchend", touchEnd );

  var cmdLabels = document.querySelectorAll( ".cmdLabel" );
  for ( var i = 0; i < cmdLabels.length; ++i ) {
    cmdLabels[i].innerHTML = cmdPre;
  }

  setupKeyOption( ctrls.keyControlNote, keyOptionControls, 0, "W", 87 );
  setupKeyOption( ctrls.keyControlNote, keyOptionControls, 1, "A", 65 );
  setupKeyOption( ctrls.keyControlNote, keyOptionControls, 2, "S", 83 );
  setupKeyOption( ctrls.keyControlNote, keyOptionControls, 3, "D", 68 );

  ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
      ctrls.output ) );
  ctrls.goVR.addEventListener( "click", function ( ) {
    requestFullScreen( ctrls.output, vrDisplay );
    inVR = true;
    camera.fov = ( vrParams.left.recommendedFieldOfView.leftDegrees +
        vrParams.left.recommendedFieldOfView.rightDegrees );
    refreshSize();
  } );

  refreshSize( );

  requestAnimationFrame( render );

  function refreshSize ( ) {
    var styleWidth = ctrls.outputContainer.clientWidth,
        styleHeight = ctrls.outputContainer.clientHeight,
        ratio = window.devicePixelRatio || 1,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio,
        aspectWidth = canvasWidth;
    if ( inVR ) {
      canvasWidth = vrParams.left.renderRect.width +
          vrParams.right.renderRect.width;
      canvasHeight = Math.max( vrParams.left.renderRect.height,
          vrParams.right.renderRect.height );
      aspectWidth = canvasWidth / 2;
    }
    renderer.domElement.style.width = px( styleWidth );
    renderer.domElement.style.height = px( styleHeight );
    renderer.domElement.width = canvasWidth;
    renderer.domElement.height = canvasHeight;
    renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    back.setSize( canvasWidth, canvasHeight );
    camera.aspect = aspectWidth / canvasHeight;
    camera.updateProjectionMatrix( );
  }

  function keyDown ( evt ) {
    var mod = evt[modA] && evt[modB];
    if ( mod && evt.keyCode === Primrose.Text.Keys.E ) {
      if ( lastEditor && lastEditor.focused ) {
        lastEditor.blur( );
        lastEditor = null;
      }
    }
    else if ( mod && evt.keyCode === Primrose.Text.Keys.UPARROW ) {
      lastEditor.increaseFontSize( );
    }
    else if ( mod && evt.keyCode === Primrose.Text.Keys.DOWNARROW ) {
      lastEditor.decreaseFontSize( );
    }
    else if ( !lastEditor || !lastEditor.focused ) {
      keyState[evt.keyCode] = true;
    }
    else if ( lastEditor && !lastEditor.readOnly ) {
      lastEditor.keyDown( evt );
    }
  }

  function setPointer ( x, y ) {
    if ( lastPointerX !== undefined ) {
      var dx = x - lastPointerX,
          dy = y - lastPointerY,
          nextX = pointerX + dx,
          nextY = pointerY + dy;
      if ( nextX < 0 || nextX > ctrls.output.width ) {
        dx = 0;
      }
      if ( nextY < 0 || nextY > ctrls.output.height ) {
        dy = 0;
      }
      pointerX += dx;
      pointerY += dy;

      mouse.set(
          2 * ( pointerX / ctrls.output.width ) - 1,
          -2 * ( pointerY / ctrls.output.height ) + 1 );

      raycaster.setFromCamera( mouse, camera );
      if ( currentEditor ) {
        lastEditor = currentEditor;
      }
      currentEditor = null;
      var objects = raycaster.intersectObject( scene, true );
      var found = false;
      for ( var i = 0; i < objects.length; ++i ) {
        var obj = objects[i];
        if ( obj.object.editor ) {
          pointer.position.set( 0, 0, 0 );
          pointer.lookAt( obj.face.normal );
          pointer.position.copy( obj.point );
          currentEditor = obj.object.editor;
          found = true;
          break;
        }
      }
      if ( !found ) {
        pointer.position.copy( raycaster.ray.direction );
        pointer.position.multiplyScalar( 3 );
        pointer.position.add( raycaster.ray.origin );
      }
    }
    else {
      pointerX = x;
      pointerY = y;
    }
    lastPointerX = x;
    lastPointerY = y;
    var good = false;
    if ( currentEditor ) {
      currentEditor.focus( );
      good = true;
    }

    if ( !good && lastEditor && lastEditor.focused ) {
      lastEditor.blur( );
      lastEditor = null;
    }
  }

  function paste ( evt ) {
    if ( lastEditor && !lastEditor.readOnly ) {
      lastEditor.readClipboard( evt );
    }
  }

  function mouseWheel ( evt ) {
    if ( lastEditor ) {
      lastEditor.readWheel( evt );
    }
  }

  function mouseDown ( evt ) {
    dragging = true;
    if ( !isPointerLocked( ) ) {
      lastMouseX = evt.clientX;
      lastMouseY = evt.clientY;
    }

    setPointer( lastMouseX, lastMouseY );
    pick( "start" );
  }

  function mouseMove ( evt ) {
    var rotating = evt.shiftKey;
    if ( isPointerLocked( ) ) {
      var dx = evt.movementX,
          dy = evt.movementY;
      if ( dx === undefined ) {
        dx = evt.mozMovementX;
        dy = evt.mozMovementY;
      }

      if ( dx !== undefined ) {
        if ( rotating ) {
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
      if ( lastMouseX !== undefined && rotating ) {
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
      lastEditor.endPointer( );
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
    if ( evt.touches.length <= 3 && evt.touches.length > touchCount ) {
      touchCount = evt.touches.length;
    }
    if ( touchCount === 1 ) {
      setPointer( lastTouchX, lastTouchY );
      pick( "start" );
    }
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

    if ( touchCount === 1 ) {
      dragging = true;
      setPointer( x, y );
    }
    else if ( touchCount === 2 ) {
      touchStrafe = ( x - lastTouchX ) * 0.05;
      touchDrive = ( y - lastTouchY ) * 0.05;
    }
    else if ( touchCount === 3 ) {
      heading += ( x - lastTouchX ) * 0.005;
      pitch += ( y - lastTouchY ) * 0.005;
    }
    lastTouchX = x;
    lastTouchY = y;
    evt.preventDefault( );
  }

  function touchEnd ( evt ) {
    if ( evt.touches.length === 0 ) {
      lastTouchX = null;
      lastTouchY = null;
      touchCount = 0;
      touchDrive = 0;
      touchStrafe = 0;
      if ( lastEditor && lastEditor.focused ) {
        lastEditor.endPointer( );
      }
    }
  }

  function renderScene ( s, rt, fc ) {
    if ( inVR ) {
      renderer.renderStereo( s, camera, rt, fc, translations, viewports );
    }
    else {
      renderer.render( s, camera, rt, fc );
    }
  }

  function pick ( op ) {
    if ( lastEditor && lastEditor.focused ) {
      renderScene( pickingScene, back, true );
      lastEditor[op + "Picking"]( gl, pointerX, ctrls.output.height -
          pointerY );
    }
  }

  function update ( dt ) {
    var cos = Math.cos( heading ),
        sin = Math.sin( heading );
    if ( keyState[ctrls.forwardKey.dataset.keycode] ) {
      position.z -= dt * SPEED * cos;
      position.x -= dt * SPEED * sin;
    }
    else if ( keyState[ctrls.backKey.dataset.keycode] ) {
      position.z += dt * SPEED * cos;
      position.x += dt * SPEED * sin;
    }
    if ( keyState[ctrls.leftKey.dataset.keycode] ) {
      position.x -= dt * SPEED * cos;
      position.z += dt * SPEED * sin;
    }
    else if ( keyState[ctrls.rightKey.dataset.keycode] ) {
      position.x += dt * SPEED * cos;
      position.z -= dt * SPEED * sin;
    }

    position.z += dt * SPEED * ( touchStrafe * sin - touchDrive * cos );
    position.x -= dt * SPEED * ( touchStrafe * cos + touchDrive * sin );
    position.x = Math.min( 12.5, Math.max( -12.5, position.x ) );
    position.z = Math.min( 12.5, Math.max( -12.5, position.z ) );
    camera.quaternion.setFromAxisAngle( UP, heading );
    if ( !inVR ) {
      qPitch.setFromAxisAngle( RIGHT, pitch );
      camera.quaternion.multiply( qPitch );
    }

    camera.position.copy( position );
    if ( vrSensor ) {
      var state = vrSensor.getState( );
      if ( state.orientation ) {
        qRift.copy( state.orientation );
        camera.quaternion.multiply( qRift );
      }

      if ( state.position ) {
        camera.position.add( state.position );
      }
    }

    if ( dragging ) {
      pick( "move" );
    }
  }

  function render ( t ) {
    requestAnimationFrame( render );

    if ( lt ) {
      update( t - lt );
    }

    renderScene( scene );
    lt = t;
  }
}
