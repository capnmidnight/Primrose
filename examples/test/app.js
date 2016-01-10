//global fmt, pliny, THREE, Primrose*/
var output = document.getElementById( "output" );
function println () {
  output.appendChild( document.createTextNode( fmt.apply( this, arguments ) + "\n" ) );
}

function walk ( d ) {
  for ( var k in d ) {
    var s = k.toLowerCase();
    if ( k.indexOf( "full" ) > -1 && k.indexOf( "screen" ) > -1 ) {
      println( k );
      println( d[k] );
    }
  }
}

println("window");
walk(window);
println("document");
walk(document);
println("documentElement");
walk(document.documentElement);
println(screen.width + "x" + screen.height);