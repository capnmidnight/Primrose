/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */
var log = null,
    GRASS = THREE.ImageUtils.loadTexture("../images/grass.png"),
    ROCK = THREE.ImageUtils.loadTexture("../images/rock.png"),
    SAND = THREE.ImageUtils.loadTexture("../images/sand.png"),
    WATER = THREE.ImageUtils.loadTexture("../images/water.png"),
    DECK = THREE.ImageUtils.loadTexture("../images/deck.png");

function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.UI.Text.Keys[evt.keyCode];
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
    else if ( txt instanceof Primrose.UI.Text.Controls.TextBox ) {
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

  if ( txt instanceof Primrose.UI.Text.Controls.TextBox ) {
    obj.editor = txt;
  }

  return obj;
}

function brick ( txt, w, h, l ) {
  return textured( box( w || 1, h || 1, l || 1 ), txt, false, 1, w, l );
}

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
  for ( var y = 0; y < h; ++y ) {
      put( brick( txt, w, 1, l ) )
          .on( point )
          .at( w / 2, y, l / 2 );
  }
  return point;
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
var start = put( hub() )
    .on( scene )
    .at( -12, -3, -12 );

put( fill( WATER, 25, 1, 12 ) )
    .on( start )
    .at( 0, 0, 12 );

for ( var z = 0; z < 12; ++z ) {
  var x = z;
  var w = 25 - x;
  put( fill( GRASS, w, 1, 1 ) )
      .on( start )
      .at( 0, 0, z );

  put( fill( SAND, x, 1, 1 ) )
      .on( start )
      .at( w, 0, z );

  if ( z < 10 ) {
    for ( var x = 0; x < 10; ++x ) {
      h = 10 - Math.sqrt( z * z + x * x );
      put( fill( ROCK, 1, h, 1 ) )
          .on( start )
          .at( x, 1, z );
    }
  }
}

var sun = put( hub() )
    .on( start )
    .at( 10, 10, -3 );
function sunBit () {
  return textured( box( 1 ), 0xffff00, true, 0.125 );
}
put( sunBit() )
    .on( sun )
    .at( 1, 0, 0 );
put( sunBit() )
    .on( sun )
    .at( -1, 0, 0 );
put( sunBit() )
    .on( sun )
    .at( 0, 1, 0 );
put( sunBit() )
    .on( sun )
    .at( 0, -1, 0 );
put( sunBit() )
    .on( sun )
    .at( 0, 0, 1 );
put( sunBit() )
    .on( sun )
    .at( 0, 0, -1 );

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
    options.size = new Primrose.UI.Text.Size( 1024 * w, 1024 * h );
    options.fontSize = ( options.fontSize || 30 ) / window.devicePixelRatio;
    options.theme = Primrose.UI.Text.Themes.Dark;
    options.tokenizer = options.tokenizer || Primrose.UI.Text.Grammars.PlainText;
    var t = new Primrose.UI.Text.Controls.TextBox( id, options );
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
      1, 0.25, 0, -0.59, 6.09, -Math.PI / 4, 0, 0,
      {
        readOnly: true,
        hideLineNumbers: true
      } ),
      documentation = makeEditor( "docBox",
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
      Primrose.UI.Text.Controls.TextBox - a text editor\n\
    unshaded: set to true to use constant lighting (default false)\n\
    opacity: 1 - opaque, 0 - transparent (default 1).\n\
    txtRepeatS: texture repeat in S direction (default 1).\n\
    txtRepeat: texture repeat in T direction (default 1)"
          } ),
      editor = makeEditor( "textEditor",
          1, 1, 0, 0, 6, 0, 0, 0,
          {
            tokenizer: Primrose.UI.Text.Grammars.JavaScript,
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
  window.addEventListener( "paste", paste );
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

  setupKeyOption( ctrls.leftKey, "A", 65 );
  setupKeyOption( ctrls.rightKey, "D", 68 );
  setupKeyOption( ctrls.forwardKey, "W", 87 );
  setupKeyOption( ctrls.backKey, "S", 83 );

  ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
      ctrls.output ) );
  ctrls.goVR.style.display = !!vrDisplay ? "inline-block" : "none";
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
    if ( mod && evt.keyCode === Primrose.UI.Text.Keys.E ) {
      documentation.visible = output.visible = editor.visible = !editor.visible;
      if ( !editor.visible && lastEditor && lastEditor.focused ) {
        lastEditor.blur( );
        lastEditor = null;
      }
    }
    else if ( mod && evt.keyCode === Primrose.UI.Text.Keys.UPARROW ) {
      lastEditor.increaseFontSize( );
    }
    else if ( mod && evt.keyCode === Primrose.UI.Text.Keys.DOWNARROW ) {
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
