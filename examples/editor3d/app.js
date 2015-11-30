/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put */
var log = null,
    GRASS = THREE.ImageUtils.loadTexture( "../images/grass.png" ),
    ROCK = THREE.ImageUtils.loadTexture( "../images/rock.png" ),
    SAND = THREE.ImageUtils.loadTexture( "../images/sand.png" ),
    WATER = THREE.ImageUtils.loadTexture( "../images/water.png" ),
    DECK = THREE.ImageUtils.loadTexture( "../images/deck.png" );

function fill ( txt, w, h, l ) {
  if ( h === undefined ) {
    h = 1;
    if ( l === undefined ) {
      l = 1;
      if ( w === undefined ) {
        w = 1;
      }
    }
  }
  var point = hub();
  put( brick( txt, w, h, l ) )
      .on( point )
      .at( w / 2, h / 2, l / 2 );
  return point;
}

function testDemo ( scene ) {
  var start = put( hub() )
      .on( scene )
      .at( -12, -3, -12 );

  put( fill( GRASS, 25, 1, 25 ) )
      .on( start );

  var sun = put( hub() )
      .on( start )
      .at( 10, 10, -3 );

  function sunBit ( x, y, z ) {
    put( textured( box( 1 ), 0xffff00, true, 0.125 ) )
        .on( sun )
        .at( x, y, z );
  }

  sunBit( 1, 0, 0 );
  sunBit( -1, 0, 0 );
  sunBit( 0, 1, 0 );
  sunBit( 0, -1, 0 );
  sunBit( 0, 0, 1 );
  sunBit( 0, 0, -1 );

  var t = 0;
  function update ( dt ) {
    t += dt * 0.0005;
    sun.rotation.set( t, t / 2, t / 5 );
  }
  log( "ok" );
  return update;
}

function PrimroseDemo ( vrDisplay, vrSensor, err ) {
  "use strict";
  if ( err ) {
    console.error( err );
  }
  var vrParams,
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
      lastScript,
      scriptUpdateTimeout,
      scriptAnimate,
      lt = 0,
      touchCount = 0,
      touchDrive = 0,
      touchStrafe = 0,
      heading = 0,
      pitch = 0,
      SPEED = 0.005,
      inVR = false,
      dragging = false,
      keyState = {},
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      cmdPre = isOSX ? "CMD+OPT" : "CTRL+SHIFT",
      scene = new THREE.Scene( ),
      subScene = new THREE.Object3D( ),
      pickingScene = new THREE.Scene( ),
      ctrls = findEverything( ),
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
      pointer = textured( sphere( 0.02, 4, 2 ), 0xff0000, true ),
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
      src = getSetting( "code", testDemo.toString( ) ),
      translations = [ new THREE.Matrix4(), new THREE.Matrix4() ],
      viewports = [ ];

  function setTrans ( m, t ) {
    m.makeTranslation( t.x, t.y, t.z );
  }

  function setView ( b, r ) {
    b.min.set( r.x, r.y );
    b.max.set( r.x + r.width, r.y + r.height );
  }

  if ( vrDisplay ) {
    if ( vrDisplay.getEyeParameters ) {
      vrParams = {
        left: vrDisplay.getEyeParameters( "left" ),
        right: vrDisplay.getEyeParameters( "right" )
      };
    }
    else {
      vrParams = {
        left: {
          renderRect: vrDisplay.getRecommendedEyeRenderRect( "left" ),
          eyeTranslation: vrDisplay.getEyeTranslation( "left" ),
          recommendedFieldOfView: vrDisplay.getRecommendedEyeFieldOfView(
              "left" )
        },
        right: {
          renderRect: vrDisplay.getRecommendedEyeRenderRect( "right" ),
          eyeTranslation: vrDisplay.getEyeTranslation( "right" ),
          recommendedFieldOfView: vrDisplay.getRecommendedEyeFieldOfView(
              "right" )
        }
      };
    }

    setTrans( translations[0], vrParams.left.eyeTranslation );
    setTrans( translations[1], vrParams.right.eyeTranslation );
    viewports[0] = vrParams.left.renderRect;
    viewports[1] = vrParams.right.renderRect;
  }

  if ( src === testDemo.toString( ) ) {
    var lines = src.replace( "\r\n", "\n" )
        .split( "\n" );
    lines.pop( );
    lines.shift( );
    for ( var i = 0; i < lines.length; ++i ) {
      lines[i] = lines[i].substring( 2 );
    }
    src = lines.join( "\n" );
  }

  var output = makeEditor( scene, pickingScene, "outputBox",
      1, 0.25, 0, -0.59, 6.09, -Math.PI / 4, 0, 0,
      {
        readOnly: true,
        hideLineNumbers: true
      } ),
      documentation = makeEditor( scene, pickingScene, "docBox",
          1, 1, 0.85, 0, 6.35, 0, -Math.PI / 4, 0,
          {
            readOnly: true,
            hideLineNumbers: true,
            fontSize: 20,
            file: "functions:\n\
  log( msg );\n\
    print a message to the window below the editor.\n\
\n\
  put( objectA ).on( objectB )[.at( x, y, z )];\n\
    objectA: a THREE.Object3D to be added to another,\n\
    objectB: a THREE.Object3D where objectA will be added,\n\
    x, y, z: a location to set for objectA relative to objectB\n\
\n\
  light( color [, intensity[, distance[, decay]]] );\n\
    creates a THREE.PointLight with the same parameters.\n\
\n\
  brick( txtName );\n\
    creates a textured cube with the named texture, one of:\n\
      [SAND, WATER, ROCK, GRASS, DECK].\n\
\n\
  quad( width[, height] );\n\
    creates a THREE.PlaneBufferGeometry with the same parameters.\n\
    if height is undefined, height is set to width (square).\n\
\n\
  box( width[, height, length] );\n\
    creates a THREE.BoxGeometry with the same parameters.\n\
    if height is undefined, height and length are set to width (cube).\n\
\n\
  hub( );\n\
    creates a raw THREE.Object3D. Useful for combining objects.\n\
\n\
  sphere( radius[, slices, rings] );\n\
    creates a THREE.SphereGeometry with the same parameters.\n\
\n\
  shell( radius[, slices, rings[, phi, theta]] );\n\
    creates a portion of the inside surface of a sphere.\n\
\n\
  from( start ).to( end ).exec( thunk );\n\
    iterates on the range [start, end), passing the index as the parameter\n\
    to thunk, accumulating an array of thunk's return value.\n\
\n\
  textured( geometry, txt[, unshaded[, opacity[, txtRepeatS, txtRepeatT]]] );\n\
    geometry: a THREE.Geometry object\n\
    txt: a material definition of some kind. It could be a:\n\
      number - a solid hex color\n\
      string - a path to a texture image\n\
      Primrose.Text.Controls.TextBox - a text editor\n\
    unshaded: set to true to use constant lighting (default false)\n\
    opacity: 1 - opaque, 0 - transparent (default 1).\n\
    txtRepeatS: texture repeat in S direction (default 1).\n\
    txtRepeat: texture repeat in T direction (default 1)"
          } ),
      editor = makeEditor( scene, pickingScene, "textEditor",
          1, 1, 0, 0, 6, 0, 0, 0,
          {
            keyEventSource: window,
            tokenizer: Primrose.Text.Grammars.JavaScript,
            file: src
          } );

  log = function (  ) {
    if ( output.editor ) {
      var msg = Array.prototype.join.call( arguments, ", " );
      output.editor.value += msg + "\n";
      output.editor.selectionStart = output.editor.selectionEnd = output.editor.value.length;
      output.editor.scrollIntoView( output.editor.frontCursor );
      output.editor.forceUpdate( );
    }
  };

  log( fmt( "$1+E to show/hide editor", cmdPre ) );

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
  window.addEventListener( "unload", function ( ) {
    var script = editor.editor.value;
    if ( script.length > 0 ) {
      setSetting( "code", script );
    }
  } );

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

  var elems = [ ctrls.leftKey, ctrls.rightKey, ctrls.forwardKey, ctrls.backKey
  ];
  setupKeyOption( ctrls.leftKey, elems, 0, "A", 65 );
  setupKeyOption( ctrls.rightKey, elems, 1, "D", 68 );
  setupKeyOption( ctrls.forwardKey, elems, 2, "W", 87 );
  setupKeyOption( ctrls.backKey, elems, 3, "S", 83 );

  function onFullScreen ( elem, vrDisplay ) {
    requestFullScreen( elem, vrDisplay );
    history.pushState( null, "Primrose > full screen", "#fullscreen" );
  }

  ctrls.goRegular.addEventListener( "click", onFullScreen.bind( window, ctrls.output ) );
  ctrls.goVR.style.display = !!vrDisplay ? "inline-block" : "none";
  ctrls.goVR.addEventListener( "click", function ( ) {
    onFullScreen( ctrls.output, vrDisplay );
    inVR = true;
    camera.fov = ( vrParams.left.recommendedFieldOfView.leftDegrees +
        vrParams.left.recommendedFieldOfView.rightDegrees );
    refreshSize();
  } );
  
  window.addEventListener( "popstate", function ( evt ) {
    if ( isFullScreenMode() ) {
      inVR = false;
      exitFullScreen();
      evt.preventDefault();
    }
  }, true );

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
      documentation.visible = output.visible = editor.visible = !editor.visible;
      if ( !editor.visible && lastEditor && lastEditor.focused ) {
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

    if ( scriptUpdateTimeout ) {
      clearTimeout( scriptUpdateTimeout );
      scriptUpdateTimeout = null;
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
    var rotating = evt.shiftKey || !editor.visible;
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
        sin = Math.sin( heading ),
        exp;
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

    if ( !scriptUpdateTimeout ) {
      scriptUpdateTimeout = setTimeout( updateScript, 500 );
    }

    if ( scriptAnimate ) {
      try {
        scriptAnimate( dt );
      }
      catch ( exp ) {
        console.error( exp );
        log( "ERR: " + exp.message );
        scriptAnimate = null;
      }
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

  function updateScript ( ) {
    if ( editor.editor ) {
      var newScript = editor.editor.value,
          exp;
      if ( newScript !== lastScript ) {
        try {
          var scriptUpdate = new Function( "scene",
              newScript );
          for ( var i = subScene.children.length - 1; i >= 0; --i ) {
            subScene.remove( subScene.children[i] );
          }
          scriptAnimate = scriptUpdate( subScene );
        }
        catch ( exp ) {
          console.error( exp );
          log( "ERR: " + exp.message );
          scriptAnimate = null;
        }
        lastScript = newScript;
      }
      scriptUpdateTimeout = null;
    }
  }
}
