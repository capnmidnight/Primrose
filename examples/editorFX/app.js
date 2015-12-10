/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put */

var app,
    log = null,
    GRASS = THREE.ImageUtils.loadTexture( "../images/grass.png" ),
    ROCK = THREE.ImageUtils.loadTexture( "../images/rock.png" ),
    SAND = THREE.ImageUtils.loadTexture( "../images/sand.png" ),
    WATER = THREE.ImageUtils.loadTexture( "../images/water.png" ),
    DECK = THREE.ImageUtils.loadTexture( "../images/deck.png" );

function StartDemo () {
  app = new Primrose.VRApplication( "Codevember" );
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
    app.scene.add( subScene );

    editor = app.createElement( "textarea", "textEditor" );
    editor.value = getSourceCode();
    editor.mesh.position.y = editorSphereY;

    documentation = app.createElement( "textarea", "textEditor2" );
    documentation.setTokenizer( Primrose.Text.Grammars.PlainText );
    documentation.value = getDocumentation();
    documentation.mesh.position.y = editorSphereY;
    documentation.mesh.rotation.y = Math.PI / 2;

    output = app.createElement( "textarea", "textEditor3" );
    output.mesh.position.y = editorSphereY;
    output.mesh.rotation.y = -Math.PI / 2;
    output.render();

    log( fmt( "$1+E to show/hide editor", cmdPre ) );
  } );

  app.addEventListener( "update", function ( dt ) {
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
  } );

  app.addEventListener( "keydown", function ( evt ) {
    var mod = evt[modA] && evt[modB];
    if ( mod && evt.keyCode === Primrose.Text.Keys.E ) {
      documentation.visible = output.visible = editor.visible = !editor.visible;
      if ( !editor.visible && app.currentEditor && app.currentEditor.focused ) {
        app.currentEditor.blur( );
        app.currentEditor = null;
      }
    }
    else if ( mod && evt.keyCode === Primrose.Text.Keys.UPARROW ) {
      app.currentEditor.increaseFontSize( );
    }
    else if ( mod && evt.keyCode === Primrose.Text.Keys.DOWNARROW ) {
      app.currentEditor.decreaseFontSize( );
    }

    if ( scriptUpdateTimeout ) {
      clearTimeout( scriptUpdateTimeout );
      scriptUpdateTimeout = null;
    }
  } );
  
  window.addEventListener( "unload", function ( ) {
    var script = editor.value;
    if ( script.length > 0 ) {
      setSetting( "code", script );
    }
  } );

  function updateScript ( ) {
    var newScript = editor.value,
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

  log = function (  ) {
    if ( output ) {
      var msg = Array.prototype.join.call( arguments, ", " );
      output.value += msg + "\n";
      output.selectionStart = output.selectionEnd = output.value.length;
      output.scrollIntoView( output.frontCursor );
    }
  };

  app.start();
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

  put( light( 0xffffff, 1, 100 ) ).on( sun );

  var t = 0;
  function update ( dt ) {
    t += dt * 0.5;
    sun.rotation.set( t, t / 2, t / 5 );
  }
  log( "ok" );
  return update;
}

function getSourceCode () {
  var src = getSetting( "code", testDemo.toString( ) );
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
  return src;
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