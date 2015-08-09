/* global isOSX, Primrose, THREE, isMobile, requestFullScreen */

function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Text.Keys[evt.keyCode];
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

function PrimroseDemo ( vrDisplay, vrSensor, err ) {
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
      lt = 0,
      touchCount = 0,
      touchDrive = 0,
      touchStrafe = 0,
      heading = 0,
      pitch = 0,
      SPEED = 0.0005,
      inVR = false,
      dragging = false,
      keyState = { },
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      cmdPre = isOSX ? "CMD+OPT" : "CTRL+SHIFT",
      execKey = isOSX ? "E" : "SPACE",
      scene = new THREE.Scene(),
      pickingScene = new THREE.Scene(),
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
      mouse = new THREE.Vector3( 0, 0, 0 ),
      raycaster = new THREE.Raycaster( new THREE.Vector3(),
          new THREE.Vector3(), 0, 50 ),
      pointer = textured( sphere( 0.01, 4, 2 ), 0xff0000 ),
      renderer = new THREE.WebGLRenderer( {
        canvas: ctrls.output,
        alpha: true,
        antialias: true
      } ),
      inVR = false,
      gl = renderer.getContext(),
      skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
      sky = textured( skyGeom, "../images/bg2.jpg" ),
      floor = textured( box( 25, 1, 25 ), "../images/deck.png", 25, 25 ),
      loader = new THREE.ObjectLoader(),
      editor = new Primrose.Text.Controls.TextBox( "textEditor", {
        size: new Primrose.Text.Size( 1024, 1024 ),
        fontSize: ( vrDisplay ? 40 : 20 ) / window.devicePixelRatio,
        tokenizer: Primrose.Text.Grammars.Basic,
        theme: Primrose.Text.Themes.Dark,
        hideLineNumbers: true,
        hideScrollBars: true
      } ),
      terminal = new Primrose.Text.Terminal( editor ),
      UP = new THREE.Vector3(0, 1, 0),
      RIGHT = new THREE.Vector3(1, 0, 0),
      qPitch = new THREE.Quaternion(),
      qRift = new THREE.Quaternion(),
      position = new THREE.Vector3(),
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
    else if( vrDisplay.getRecommendedEyeRenderRect ) {
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
    else{
      console.error("Couldn't figure out how to process the VR Display object", vrDisplay);
    }

    setTrans( translations[0], vrParams.left.eyeTranslation );
    setTrans( translations[1], vrParams.right.eyeTranslation );
    setView( viewports[0], vrParams.left.renderRect );
    setView( viewports[1], vrParams.right.renderRect );
  }

  back.generateMipMaps = false;

  loader.load( "commodore_pet.json", function ( f ) {
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

  position.set( 0, 0, vrDisplay || isMobile ? 1 : 0.35 );
  floor.position.set( 0, -3, 0 );

  scene.add( sky );
  scene.add( floor );
  scene.add( camera );
  scene.add( pointer );

  window.addEventListener( "resize", refreshSize );
  window.addEventListener( "keydown", keyDown );
  window.addEventListener( "keyup", function ( evt ) {
    keyState[evt.keyCode] = false;
  } );
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

  terminal.loadFile( "../oregon.bas" );

  ctrls.goRegular.addEventListener( "click", requestFullScreen.bind( window,
      ctrls.output ) );
  if ( vrDisplay ) {
    ctrls.goVR.style.display = "inline-block";
    ctrls.goVR.addEventListener( "click", function ( ) {
      requestFullScreen( ctrls.output, vrDisplay );
      inVR = true;
      camera.fov = ( vrParams.left.recommendedFieldOfView.leftDegrees +
          vrParams.left.recommendedFieldOfView.rightDegrees );
      refreshSize();
    } );
  }

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
    if ( !lastEditor ||
        !lastEditor.focused ) {
      keyState[evt.keyCode] = true;
    }
    else if ( terminal.running &&
        terminal.waitingForInput &&
        evt.keyCode === Primrose.Text.Keys.ENTER ) {
      terminal.sendInput( evt );
    }
    else if ( !terminal.running &&
        isExecuteCommand( evt ) ) {
      terminal.execute();
    }
    else if ( lastEditor ) {
      lastEditor.keyDown( evt );
    }
  }

  function isExecuteCommand ( evt ) {
    return evt[modA] && evt[modB] && evt.keyCode === Primrose.Text.Keys[execKey];
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

    qPitch.setFromAxisAngle(RIGHT, pitch);
    camera.quaternion.setFromAxisAngle(UP, heading);
    camera.quaternion.multiply(qPitch);

    camera.position.copy(position);
    if ( vrSensor ) {
      var state = vrSensor.getState();
      if ( state.orientation ) {
        qRift.copy(state.orientation);
        camera.quaternion.multiply(qRift);
      }

      if (state.position ) {
        camera.position.add(state.position);
      }
    }

    sky.position.copy( camera.position );

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

  function renderScene ( s, rt, fc ) {
    if ( inVR ) {
      renderer.renderStereo( s, camera, rt, fc, translations, viewports );
    }
    else {
      renderer.render( s, camera, rt, fc );
    }
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
      else if ( txt instanceof Primrose.Text.Controls.TextBox ) {
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

    if ( txt instanceof Primrose.Text.Controls.TextBox ) {
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
    var phiStart = Math.PI + phi * 0.5,
        thetaStart = ( Math.PI - theta ) * 0.5,
        geom = new InsideSphereGeometry( r, slices, rings, phiStart, phi,
            thetaStart, theta, true );
    return geom;
  }

  function pick ( op ) {
    if ( lastEditor && lastEditor.focused ) {
      renderScene( pickingScene, back, true );
      lastEditor[op + "Picking"]( gl, pointerX, ctrls.output.height -
          pointerY );
    }
  }
}
