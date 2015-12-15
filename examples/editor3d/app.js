/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put, exp */

var app,
    log = null,
    clrscr = null,
    GRASS = THREE.ImageUtils.loadTexture( "../images/grass.png" ),
    ROCK = THREE.ImageUtils.loadTexture( "../images/rock.png" ),
    SAND = THREE.ImageUtils.loadTexture( "../images/sand.png" ),
    WATER = THREE.ImageUtils.loadTexture( "../images/water.png" ),
    DECK = THREE.ImageUtils.loadTexture( "../images/deck.png" );

function StartDemo ( isHomeScreen ) {
  app = new Primrose.VRApplication( "Codevember", {
    disableAutoFullScreen: isHomeScreen,
    regularFullScreenButton: isHomeScreen && document.getElementById( "goRegular" ),
    vrFullScreenButton: isHomeScreen && document.getElementById( "goVR" )
  } );

  var editor = null,
      output = null,
      documentation = null,
      modA = isOSX ? "metaKey" : "ctrlKey",
      modB = isOSX ? "altKey" : "shiftKey",
      cmdPre = isOSX ? "CMD+OPT" : "CTRL+SHIFT",
      editorSphereY = 1.5,
      subScene = new THREE.Object3D(),
      scriptUpdateTimeout,
      lastScript = null,
      scriptAnimate = null;

  app.addEventListener( "ready", function () {
    var skyGeom = shell( 50, 8, 4, Math.PI * 2, Math.PI ),
        sky = textured( skyGeom, "../images/bg2.jpg", true );

    app.scene.add( sky );
    app.scene.add( subScene );

    documentation = app.createElement( "pre", "docView" );
    documentation.textarea.setTokenizer( Primrose.Text.Grammars.PlainText );
    documentation.textarea.value = getDocumentation();
    documentation.position.y = editorSphereY;
    documentation.rotation.y = Math.PI / 2;

    editor = app.createElement( "textarea", "textEditor" );
    editor.textarea.value = getSourceCode();
    editor.position.y = editorSphereY;

    output = app.createElement( "pre", "outputView" );
    output.position.y = editorSphereY;
    output.rotation.y = -Math.PI / 2;
    output.textarea.setTheme( Primrose.Text.Themes.Dark );
    output.textarea.setFontSize( 40 );
    output.textarea.render();

    log( fmt( "$1+E to show/hide editor", cmdPre ) );
  } );

  app.addEventListener( "update", function ( dt ) {
    if ( !scriptUpdateTimeout ) {
      scriptUpdateTimeout = setTimeout( updateScript, 500 );
    }

    if ( scriptAnimate ) {
      try {
        scriptAnimate.call(app, dt );
      }
      catch ( exp ) {
        console.error( exp );
        log( "ERR: " + exp.message );
        scriptAnimate = null;
      }
    }
  } );

  app.addEventListener( "keydown", function ( evt ) {
    var mod = evt[modA] && evt[modB];
    if ( mod && evt.keyCode === Primrose.Text.Keys.E ) {
      documentation.visible = output.visible = editor.visible =
          !editor.visible;
      if ( !editor.visible && app.currentEditor &&
          app.currentEditor.focused ) {
        app.currentEditor.blur( );
        app.currentEditor = null;
      }
    }

    if ( scriptUpdateTimeout ) {
      clearTimeout( scriptUpdateTimeout );
      scriptUpdateTimeout = null;
    }
  } );

  window.addEventListener( "unload", function ( ) {
    var script = editor.textarea.value;
    if ( script.length > 0 ) {
      setSetting( "code", script );
    }
  } );

  function updateScript ( ) {
    var newScript = editor.textarea.value,
        exp;
    if ( newScript !== lastScript ) {
      try {
        log("----- loading new script -----");
        var scriptUpdate = new Function( "scene",
            newScript );
        for ( var i = subScene.children.length - 1; i >= 0; --i ) {
          subScene.remove( subScene.children[i] );
        }
        scriptAnimate = scriptUpdate.call(app, subScene );
        log("----- script loaded -----");
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

  log = function (  ) {
    if ( output ) {
      var msg = Array.prototype.join.call( arguments, ", " ),
          t = output.textarea;
      t.value += msg + "\n";
      t.selectionStart = t.selectionEnd = t.value.length;
      t.scrollIntoView( t.frontCursor );
    }
  };
  
  clrscr = function (){
    if ( output ) {
      var t = output.textarea;
      t.value = "";
      t.selectionStart = t.selectionEnd = t.value.length;
      t.scrollIntoView( t.frontCursor );
    }  
  };

  var cmdLabels = document.querySelectorAll( ".cmdLabel" );
  for ( var i = 0; i < cmdLabels.length; ++i ) {
    cmdLabels[i].innerHTML = cmdPre;
  }

  app.start();
}

function testDemo ( scene ) {
  var start = put( hub() )
      .on( scene )
      .at( -12, -3, -12 );

  put( fill( GRASS, 25, 1, 25 ) )
      .on( start );

  for ( var y = 0; y < 10; ++y ) {
    for ( var x = 0; x < 10; ++x ) {
      put( brick( ROCK ) )
          .on( start )
          .at( x, 10 - Math.max( x, y ), y );
    }
  }

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

  put( light( 0xffffff, 1, 100 ) )
      .on( sun );

  var t = 0,
      n = 0,
      nt = 0;
  function update ( dt ) {
    t += dt;
    nt += dt;
    ++n;
    sun.rotation.set( t, t / 2, t / 5 );
    if ( nt > 10 ) {
      log( Math.round( n / nt ) );
      nt = 0;
      n = 0;
    }
  }
  return update;
}

function getSourceCode () {
  var src = getSetting( "code", testDemo.toString( ) );
  // If there was no source code stored in local storage,
  // we use the script from a saved function and assume
  // it has been formatted with 2 spaces per-line.
  if ( src === testDemo.toString( ) ) {
    var lines = src.replace( "\r\n", "\n" ).split( "\n" );
    lines.pop( );
    lines.shift( );
    for ( var i = 0; i < lines.length; ++i ) {
      lines[i] = lines[i].substring( 2 );
    }
    src = lines.join( "\n" );
  }
  return src.trim();
}

// This is a function to just push it out of the way, uncluttering
// the code above.
function getDocumentation () {
  return "functions:\n" +
      "  log( msg );\n" +
      "    print a message to the window below the editor.\n" +
      "\n" +
      "  put( objectA ).on( objectB )[.at( x, y, z )];\n" +
      "    objectA: a THREE.Object3D to be added to another,\n" +
      "    objectB: a THREE.Object3D where objectA will be added,\n" +
      "    x, y, z: a location to set for objectA relative to objectB\n" +
      "\n" +
      "  light( color [, intensity[, distance[, decay]]] );\n" +
      "    creates a THREE.PointLight with the same parameters.\n" +
      "\n" +
      "  brick( txtName );\n" +
      "    creates a textured cube with the named texture, one of:\n" +
      "      [SAND, WATER, ROCK, GRASS, DECK].\n" +
      "\n" +
      "  quad( width[, height] );\n" +
      "    creates a THREE.PlaneBufferGeometry with the same parameters.\n" +
      "    if height is undefined, height is set to width (square).\n" +
      "\n" +
      "  box( width[, height, length] );\n" +
      "    creates a THREE.BoxGeometry with the same parameters.\n" +
      "    if height is undefined, height and length are set to width (cube).\n" +
      "\n" +
      "  hub( );\n" +
      "    creates a raw THREE.Object3D. Useful for combining objects.\n" +
      "\n" +
      "  sphere( radius[, slices, rings] );\n" +
      "    creates a THREE.SphereGeometry with the same parameters.\n" +
      "\n" +
      "  shell( radius[, slices, rings[, phi, theta]] );\n" +
      "    creates a portion of the inside surface of a sphere.\n" +
      "\n" +
      "  from( start ).to( end ).exec( thunk );\n" +
      "    iterates on the range [start, end), passing the index as the parameter\n" +
      "    to thunk, accumulating an array of thunk's return value.\n" +
      "\n" +
      "  textured( geometry, txt[, unshaded[, opacity[, txtRepeatS, txtRepeatT]]] );\n" +
      "    geometry: a THREE.Geometry object\n" +
      "    txt: a material definition of some kind. It could be a:\n" +
      "      number - a solid hex color\n" +
      "      string - a path to a texture image\n" +
      "      Primrose.Text.Controls.TextBox - a text editor\n" +
      "    unshaded: set to true to use constant lighting (default false)\n" +
      "    opacity: 1 - opaque, 0 - transparent (default 1).\n" +
      "    txtRepeatS: texture repeat in S direction (default 1).\n" +
      "    txtRepeat: texture repeat in T direction (default 1)";
}


/*
 * TODO:
 *
 *
 
 var elems = [ ctrls.leftKey, ctrls.rightKey, ctrls.forwardKey, ctrls.backKey
 ];
 setupKeyOption( ctrls.leftKey, elems, 0, "A", 65 );
 setupKeyOption( ctrls.rightKey, elems, 1, "D", 68 );
 setupKeyOption( ctrls.forwardKey, elems, 2, "W", 87 );
 setupKeyOption( ctrls.backKey, elems, 3, "S", 83 );
 */