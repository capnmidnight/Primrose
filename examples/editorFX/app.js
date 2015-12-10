/* global isOSX, Primrose, THREE, isMobile, requestFullScreen, put */

var app, ed, ed2, ed3,
    log = null,
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

function StartDemo () {
  app = new Primrose.VRApplication( "Codevember" );

  var lastEditor = null;

  app.addEventListener( "ready", function () {
    window.addEventListener( "mousedown", function ( evt ) {
      if ( lastEditor ) {
        lastEditor.blur();
      }
      lastEditor = null;
    }, false );

    ed = app.createElement( "textarea", "textEditor" );
    ed.value = StartDemo.toString();
    ed.mesh.position.y = 1.75;

    ed2 = app.createElement( "textarea", "textEditor2" );
    ed2.setTokenizer(Primrose.Text.Grammars.PlainText);
    ed2.value = "functions:\n\
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
    txtRepeat: texture repeat in T direction (default 1)";
    ed2.mesh.position.y = 1.75;
    ed2.mesh.rotation.y = Math.PI / 2;

    ed3 = app.createElement( "textarea", "textEditor3" );
    ed3.value = StartDemo.toString();
    ed3.mesh.position.y = 1.75;
    ed3.mesh.rotation.y = -Math.PI / 2;
  } );

  app.start();
}