/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

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

function move ( object ) {
  return {
    to: function ( x, y, z ) {
      object.position.set( x, y, z );
    },
    toX: function ( x ) {
      object.position.setX( x );
    },
    toY: function ( y ) {
      object.position.setY( y );
    },
    toZ: function ( z ) {
      object.position.setZ( z );
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
      texture = txt.getRenderer()
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
  return new THREE.PlaneBufferGeometry( w, h );
}

function box ( w, h, l ) {
  if ( h === undefined ) {
    h = w;
    l = w;
  }
  return new THREE.BoxGeometry( w, h, l );
}

function hub () {
  return new THREE.Object3D();
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
      h = put( hub() )
      .on( scene )
      .at( 0, 0, -1 ),
      cubes = from( 0 )
      .to( rows * cols )
      .exec( function (
          i ) {
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
  if ( err ) {
    console.error( err );
  }
  var lastMouseX,
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
      scene = new THREE.Scene(),
      subScene = new THREE.Object3D(),
      pickingScene = new THREE.Scene(),
      body = new THREE.Object3D(),
      ctrls = findEverything(),
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
      pointer = textured( sphere( 0.01, 4, 2 ), 0xff0000, true ),
      renderer = new THREE.WebGLRenderer( {
        canvas: ctrls.output,
        alpha: true,
        antialias: true
      } ),
      vrEffect = new SeansVREffect( renderer, vrDisplay ),
      gl = renderer.getContext(),
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg", true ),
      floor = textured( box( 25, 1, 25 ), "../images/deck.png", true, 1, 25,
      25 ),
      src = getSetting( "code", testDemo.toString() );

  maxAnisotropy = renderer.getMaxAnisotropy();

  if ( src === testDemo.toString() ) {
    var lines = src.replace( "\r\n", "\n" )
        .split( "\n" );
    lines.pop();
    lines.shift();
    for ( var i = 0; i < lines.length; ++i ) {
      lines[i] = lines[i].substring( 2 );
    }
    src = lines.join( "\n" );
  }

  var editor = new Primrose.Controls.TextBox( "textEditor", {
    size: new Primrose.Size( 1024, 1024 ),
    fontSize: 20 / window.devicePixelRatio,
    tokenizer: Primrose.Grammars.JavaScript,
    file: src
  } ),
      editorSize = 1,
      editorGeom = shell( editorSize, 5, 10 ),
      editorShell = textured( editorGeom, editor, true, 0.75 ),
      light = new THREE.PointLight( 0xffffff );

  back.generateMipMaps = false;

  body.position.set( 0, 0, 4 );
  floor.position.set( 0, -3, 0 );
  editorShell.position.set( 0, 0, -editorSize );
  light.position.set( 5, 5, 5 );

  scene.add( sky );
  scene.add( light );
  scene.add( fakeCamera );
  scene.add( floor );
  scene.add( pointer );
  scene.add( subScene );
  body.add( camera );
  body.add( editorShell );
  scene.add( body );

  window.addEventListener( "resize", refreshSize );
  window.addEventListener( "keydown", keyDown );
  window.addEventListener( "keyup", function ( evt ) {
    keyState[evt.keyCode] = false;
  } );
  window.addEventListener( "wheel", mouseWheel );
  window.addEventListener( "paste", paste );
  window.addEventListener( "unload", function () {
    var script = editor.value;
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
    ctrls.goVR.addEventListener( "click", function () {
      requestFullScreen( ctrls.output, vrDisplay );
      inVR = true;
    } );
  }
  else {
    ctrls.goVR.style.display = "none";
    ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
        ctrls.output ) );
  }

  refreshSize();

  requestAnimationFrame( render );

  function refreshSize () {
    var styleWidth = ctrls.outputContainer.clientWidth,
        styleHeight = ctrls.outputContainer.clientHeight,
        ratio = window.devicePixelRatio || 1,
        canvasWidth = styleWidth * ratio,
        canvasHeight = styleHeight * ratio;
    if ( inVR ) {
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

  function keyDown ( evt ) {
    if ( evt[modA] && evt[modB] ) {
      if ( evt.keyCode === Primrose.Keys.E ) {
        editorShell.visible = !editorShell.visible;
        if ( !editorShell.visible && lastEditor && lastEditor.focused ) {
          lastEditor.blur();
          lastEditor = null;
        }
      }
      else if ( evt.keyCode === Primrose.Keys.UPARROW ) {
        editor.increaseFontSize();
      }
      else if ( evt.keyCode === Primrose.Keys.DOWNARROW ) {
        editor.decreaseFontSize();
      }
    }
    else if ( !lastEditor ||
        !lastEditor.focused ) {
      keyState[evt.keyCode] = true;
    }
    else if ( lastEditor ) {
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
    var rotating = evt.shiftKey || !editorShell.visible;
    if ( isPointerLocked() ) {
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

  function pick ( op ) {
    if ( lastEditor && lastEditor.focused ) {
      var r = inVR ? vrEffect : renderer;
      scene.remove( body );
      r.render( pickingScene, camera, back, true );
      scene.add( body );
      lastEditor[op + "Picking"]( gl, pointerX, pointerY );
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
    if ( !inVR ) {
      body.rotateX( pitch );
    }

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

    if ( !scriptUpdateTimeout ) {
      scriptUpdateTimeout = setTimeout( updateScript, 500 );
    }

    if ( scriptAnimate ) {
      try {
        scriptAnimate( dt );
      }
      catch ( exp ) {
        console.error( exp );
        scriptAnimate = null;
      }
    }
  }

  function render ( t ) {
    requestAnimationFrame( render );
    if ( lt ) {
      update( t - lt );
    }
    var r = inVR ? vrEffect : renderer;
    r.render( scene, camera );
    lt = t;
  }

  function updateScript () {
    var newScript = editor.value;
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
        scriptAnimate = null;
      }
      lastScript = newScript;
    }
    scriptUpdateTimeout = null;
  }
}
