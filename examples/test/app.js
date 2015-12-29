/*global fmt*/
var output = document.getElementById( "output" );
function println () {
  output.appendChild( document.createTextNode( fmt.apply( this,
      arguments ) + "\n" ) );
}

var m = new Primrose.Input.Motion("motion"),
    lt = 0,
    q = new THREE.Quaternion();

function animate(t){
  requestAnimationFrame(animate);
  var dt = t - lt;
  lt = t;
  if(dt > 0){
    m.update(dt);
    m.getQuaternion("headRX" , "headRY", "headRZ", "headRW", q);
    println(JSON.stringify(q));
  }
}
requestAnimationFrame(animate);