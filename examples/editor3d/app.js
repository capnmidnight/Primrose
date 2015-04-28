/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
var log = null;
function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Keys[evt.keyCode];
  this.value = this.value.toLowerCase( )
      .replace( "arrow", " arrow" );
  this.blur( );
}

function setupKeyOption ( elem, char, code ) {
  elem.value = char.toLowerCase( );
  elem.dataset.keycode = code;
  elem.addEventListener( "keydown", clearKeyOption );
  elem.addEventListener( "keyup", setKeyOption );
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
    else if ( txt instanceof Primrose.Controls.TextBox ) {
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

  if ( txt instanceof Primrose.Controls.TextBox ) {
    obj.editor = txt;
  }

  return obj;
}

function light ( color, intensity, distance, decay ) {
  return new THREE.PointLight( color, intensity, distance, decay );
}

function v3 ( x, y, z ) {
  return new THREE.Vector3( x, y, z );
}

function quad ( w, h ) {
  if ( h === undefined ) {
    h = w;
  }
  return new THREE.PlaneBufferGeometry( w, h );
}

function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry( w, h, l );
}

function hub ( ) {
  return new THREE.Object3D( );
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

function from ( start ) {
  return {
    to: function ( end ) {
      return {
        exec: function ( thunk ) {
          var arr = [ ];
          for ( var i = start; i < end; ++i ) {
            arr[i] = thunk( i );
          }
          return arr;
        }
      };
    }
  };
}

function testDemo ( scene ) {
  var rows = 20,
      cols = 5,
      size = 0.1,
      scale = 3,
      spacing = size * scale,
      h = put( hub( ) )
      .on( scene )
      .at( 0, 0, -1 ),
      cubes = from( 0 )
      .to( rows * cols )
      .exec( function ( i ) {
        var r = ( i / cols ) | 0,
            c = i % cols;
        return put( textured( sphere( size ), "../images/bg2.jpg" ) )
            .on( h )
            .at(
                ( r - rows / 2 ) * spacing,
                ( c - cols / 2 ) * spacing,
                0 );
      } );
  var t = 0;
  return function ( dt ) {
    t += dt / 500;
    h.rotation.set( 0, 0, t / 10 );
    cubes.forEach( function ( q ) {
      q.rotation.set( t * 0.2, t, t * 0.5 );
    } );
  };
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
      keyState = { },
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
      pointer = textured( sphere( 0.01, 4, 2 ), 0xff0000, true ),
      renderer = new THREE.WebGLRenderer( {
        canvas: ctrls.output,
        alpha: true,
        antialias: true
      } ),
      gl = renderer.getContext( ),
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg", true ),
      floor = textured( box( 25, 1, 25 ), "../images/deck.png", true, 1, 25,
          25 ),
      light = new THREE.PointLight( 0xffffff ),
      UP = new THREE.Vector3( 0, 1, 0 ),
      RIGHT = new THREE.Vector3( 1, 0, 0 ),
      qPitch = new THREE.Quaternion( ),
      qRift = new THREE.Quaternion( ),
      position = new THREE.Vector3( ),
      src = getSetting( "code", testDemo.toString( ) ),
      translations = [ new THREE.Matrix4(), new THREE.Matrix4() ],
      viewports = [ new THREE.Box2(), new THREE.Box2() ];

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
    setView( viewports[0], vrParams.left.renderRect );
    setView( viewports[1], vrParams.right.renderRect );
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

  function makeEditor ( id, w, h, x, y, z, rx, ry, rz, options ) {
    options.size = new Primrose.Size( 1024 * w, 1024 * h );
    options.fontSize = ( options.fontSize || 30 ) / window.devicePixelRatio;
    options.theme = Primrose.Themes.Dark;
    options.tokenizer = options.tokenizer || Primrose.Grammars.PlainText;
    var t = new Primrose.Controls.TextBox( id, options );
    var o = textured( quad( w, h ), t, true, 0.75 );
    var p = textured( quad( w, h ), t.getRenderer( )
        .getPickingTexture( ), true );
    o.position.set( x, y, z );
    o.rotation.set( rx, ry, rz );
    p.position.set( x, y, z );
    p.rotation.set( rx, ry, rz );
    scene.add( o );
    pickingScene.add( p );
    return o;
  }

  var output = makeEditor( "outputBox",
      1, 0.25, 0, -0.59, 3.09, -Math.PI / 4, 0, 0,
      {
        readOnly: true,
        hideLineNumbers: true
      } ),
      documentation = makeEditor( "docBox",
          1, 1, 0.85, 0, 3.35, 0, -Math.PI / 4, 0,
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
  v3( x, y, z );\n\
    creates a THREE.Vector3 with the same parameters.\n\
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
      Primrose.Controls.TextBox - a text editor\n\
    unshaded: set to true to use constant lighting (default false)\n\
    opacity: 1 - opaque, 0 - transparent (default 1).\n\
    txtRepeatS: texture repeat in S direction (default 1).\n\
    txtRepeat: texture repeat in T direction (default 1)"
          } ),
      editor = makeEditor( "textEditor",
          1, 1, 0, 0, 3, 0, 0, 0,
          {
            tokenizer: Primrose.Grammars.JavaScript,
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

  floor.position.set( 0, -3, 0 );
  light.position.set( 5, 5, 5 );
  position.set( 0, 0, 4 );

  scene.add( sky );
  scene.add( light );
  scene.add( floor );
  scene.add( pointer );
  scene.add( subScene );

  window.addEventListener( "resize", refreshSize );
  window.addEventListener( "keydown", keyDown );
  window.addEventListener( "keyup", function ( evt ) {
    keyState[evt.keyCode] = false;
  } );
  window.addEventListener( "wheel", mouseWheel );
  window.addEventListener( "paste", paste );
  window.addEventListener( "unload", function ( ) {
    var script = editor.editor.value;
    if ( script.length > 0 ) {
      setSetting( "code", script );
    }
  } );

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
    ctrls.goVR.addEventListener( "click", function ( ) {
      requestFullScreen( ctrls.output, vrDisplay );
      inVR = true;
      camera.fov = ( vrParams.left.recommendedFieldOfView.leftDegrees +
          vrParams.left.recommendedFieldOfView.rightDegrees );
      camera.aspect = ( vrParams.left.recommendedFieldOfView.leftDegrees +
          vrParams.left.recommendedFieldOfView.rightDegrees ) /
          ( vrParams.left.recommendedFieldOfView.upDegrees +
              vrParams.left.recommendedFieldOfView.downDegrees );
      camera.updateProjectionMatrix();
    } );
  }
  else {
    ctrls.goVR.style.display = "none";
    ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
        ctrls.output ) );
  }

  refreshSize( );

  requestAnimationFrame( render );

  function refreshSize ( ) {
    var styleWidth = ctrls.outputContainer.clientWidth,
        styleHeight = ctrls.outputContainer.clientHeight,
        ratio = window.devicePixelRatio || 1,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio;
    if ( inVR ) {
      canvasWidth = vrParams.left.renderRect.width +
          vrParams.right.renderRect.width;
      canvasHeight = Math.max( vrParams.left.renderRect.height,
          vrParams.right.renderRect.height );
    }
    renderer.domElement.style.width = px( styleWidth );
    renderer.domElement.style.height = px( styleHeight );
    renderer.domElement.width = canvasWidth;
    renderer.domElement.height = canvasHeight;
    renderer.setViewport( 0, 0, canvasWidth, canvasHeight );
    back.setSize( canvasWidth, canvasHeight );
    camera.updateProjectionMatrix( );
  }

  function keyDown ( evt ) {
    var mod = evt[modA] && evt[modB];
    if ( mod && evt.keyCode === Primrose.Keys.E ) {
      documentation.visible = output.visible = editor.visible = !editor.visible;
      if ( !editor.visible && lastEditor && lastEditor.focused ) {
        lastEditor.blur( );
        lastEditor = null;
      }
    }
    else if ( mod && evt.keyCode === Primrose.Keys.UPARROW ) {
      lastEditor.increaseFontSize( );
    }
    else if ( mod && evt.keyCode === Primrose.Keys.DOWNARROW ) {
      lastEditor.decreaseFontSize( );
    }
    else if ( !lastEditor || !lastEditor.focused ) {
      keyState[evt.keyCode] = true;
    }
    else if ( lastEditor && !lastEditor.readOnly ) {
      lastEditor.keyDown( evt );
    }

    if ( scriptUpdateTimeout ) {
      clearTimeout( scriptUpdateTimeout );
      scriptUpdateTimeout = null;
    }
  }

  function setPointer ( x, y ) {
    pointerX = x;
    pointerY = ctrls.output.height - y;
    mouse.set(
        2 * ( x / ctrls.output.width ) - 1,
        -2 * ( y / ctrls.output.height ) + 1 );

    raycaster.setFromCamera( mouse, camera );
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
    if ( lastEditor && !lastEditor.readOnly ) {
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
        currentEditor.focus( );
        good = true;
      }
    }

    if ( !good && lastEditor && lastEditor.focused ) {
      lastEditor.blur( );
      lastEditor = null;
    }
  }

  function mouseDown ( evt ) {
    if ( evt.target === ctrls.output ) {
      dragging = true;
      if ( !isPointerLocked( ) ) {
        lastMouseX = evt.clientX;
        lastMouseY = evt.clientY;
      }
      editorFocus( evt );
      setPointer( lastMouseX, lastMouseY );
      pick( "start" );
    }
    else {
      editorFocus( evt );
    }
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
      lastEditor[op + "Picking"]( gl, pointerX, pointerY );
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
      var newScript = editor.editor.value;
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
