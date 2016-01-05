/*global fmt, pliny, THREE, Primrose*/
var output = document.getElementById( "output" );
function println () {
  output.appendChild( document.createTextNode( fmt.apply( this,
      arguments ) + "\n" ) );
}

var m = new Primrose.Input.Motion( "motion" ),
    lt = 0,
    q = new THREE.Quaternion();

pliny.the.younger.function( "animate", {
  description: "animation looper function, yeah!",
  author: "Sean T. McBeth",
  parameters: [
    {name: "t", desciption: "a bit of time", type: Number}
  ]
} );

pliny.the.elder.log( "animate" );

function animate ( t ) {
  requestAnimationFrame( animate );
  var dt = t - lt;
  lt = t;
  if ( dt > 0 ) {
    m.update( dt );
    m.getQuaternion( "headRX", "headRY", "headRZ", "headRW", q );
  }
}
requestAnimationFrame( animate );