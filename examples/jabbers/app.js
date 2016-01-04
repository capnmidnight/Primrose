/* global Primrose, put */
var WIDTH = 100,
    HEIGHT = 6,
    DEPTH = 100,
    MIDX = WIDTH / 2,
    MIDY = HEIGHT / 2,
    MIDZ = DEPTH / 2,
    GRAVITY = 9.8,
    t = 0,
    bodies = [ ],
    app = new Primrose.VRApplication( "Editor3D", {
      disableAutoFullScreen: true,
      skyTexture: "../images/bg2.jpg",
      groundTexture: "../images/grass.png"
    } );

// we setup the event handlers for going full-screen
app.setFullScreenButton( "goVR", "click", true );
app.setFullScreenButton( "goRegular", "click", false );


function eye ( side, body ) {
  var ball = put( textured( sphere( 0.05, 18, 10 ), 0xffffff ) )
      .on( body ).at( side * 0.07, 0.05, 0.16 ),
      pupil = put( textured( sphere( 0.01 ), 0 ) )
      .on( ball )
      .at( 0, 0, 0.045 );
  return ball;
}

function jabber ( w, h, s ) {
  var obj = hub(),
      skin = Primrose.SKINS[randomInt( Primrose.SKINS.length )],
      si = parseInt( "0x" + skin.substring( 1 ), 16 ),
      body = put( textured( sphere( 0.2, 18, 10 ), si ) ).on( obj ).at(
      randomRange( -w, w ),
      1,
      randomRange( -h, h ) ),
      leftEye = eye( -1, body ),
      rightEye = eye( 1, body ),
      velocity = v3(
          randomRange( -s, s ),
          0,
          randomRange( -s, s ) ),
      v = v3( 0, 0, 0 );

  body.rotation.y = Math.PI;
  obj.update = function ( dt ) {
    velocity.y -= GRAVITY * dt;
    body.position.add( v.copy( velocity ).multiplyScalar( dt ) );
    body.lookAt( app.player.position );
    if ( velocity.x > 0 && body.position.x >= w ||
        velocity.x < 0 && body.position.x <= -w ) {
      velocity.x *= -1;
    }
    if ( velocity.z > 0 && body.position.z >= h ||
        velocity.z < 0 && body.position.z <= -h ) {
      velocity.z *= -1;
    }
    if ( velocity.y < 0 && body.position.y < 1 ) {
      velocity.y = 0;
      body.position.y = 1;
    }
    var d = body.position.distanceTo( app.player.position );
    if ( d < 3 ) {
      obj.position.set(
          randomRange( -0.01, 0.01 ),
          randomRange( -0.01, 0.01 ),
          randomRange( -0.01, 0.01 ) );
    }
    if ( body.position.y === 1 && randomInt( 0, 100 ) < 1 ) {
      this.jump();
    }
  };
  obj.jump = function () {
    velocity.y = GRAVITY;
  };
  return obj;
}

// Once Primrose has setup the WebGL context, setup THREE.js, 
// downloaded and validated all of model files, and constructed
// the basic scene hierarchy out of it, the "ready" event is fired,
// indicating that we may make additional changes to the scene now.
app.addEventListener( "ready", function () {
  put( light( 0xffffff ) ).on( app.scene ).at( 0, 10, 0 );
  for ( var i = 0; i < 25; ++i ) {
    var body = put( jabber(
        MIDX / 5,
        MIDZ / 5, 1 ) ).on( app.scene ).at( 0, 0, 0 );
    bodies.push( body );
  }
} );

app.addEventListener( "update", function ( dt ) {
  for ( var i = 0; i < bodies.length; ++i ) {
    bodies[i].update( dt );
  }
} );