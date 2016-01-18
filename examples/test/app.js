//global fmt, pliny, THREE, Primrose*/
var output = document.getElementById( "output" );
function println () {
  output.appendChild( document.createTextNode( fmt.apply( this, arguments ) + "\n" ) );
}

function resize () {
  println( "$5: $1 x $2 -> $3 x $4", screen.width, screen.height, window.innerWidth, window.innerHeight, window.orientation );
}
window.addEventListener( "resize", resize );
resize();