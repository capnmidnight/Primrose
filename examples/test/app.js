/*global fmt, pliny, THREE, Primrose*/
var output = document.getElementById( "output" );
function println () {
  output.appendChild( document.createTextNode( fmt.apply( this,
      arguments ) + "\n" ) );
}

var m = new Primrose.Input.Motion( "motion" ),
    lt = 0,
    q = new THREE.Quaternion();

pliny.the.elder.function( "animate", {
  description: "animation looper function, yeah!",
  author: "Sean T. McBeth",
  parameters: [
    {name: "t", desciption: "a bit of time", type: Number}
  ]
} );
function animate ( t ) {
  requestAnimationFrame( animate );
  var dt = t - lt;
  lt = t;
  if ( dt > 0 ) {
    pliny
        .the
        .elder
        .note( "The quick brown fox jumps over the lazy dog." );
    m.update( dt );
    pliny.the.elder.note( "Rats live on no evil star." );
    m.getQuaternion( "headRX", "headRY", "headRZ", "headRW", q );
  }
}
requestAnimationFrame( animate );


pliny.the.younger( "Primrose.BaseControl" );