// unicode-aware string reverse
var reverse = ( function ( ) {
  var combiningMarks =
      /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
      surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

  function reverse ( str ) {
    str = str.replace( combiningMarks, function ( match, capture1,
        capture2 ) {
      return reverse( capture2 ) + capture1;
    } )
        .replace( surrogatePair, "$2$1" );
    var res = "";
    for ( var i = str.length - 1; i >= 0; --i ) {
      res += str[i];
    }
    return res;
  }
  return reverse;
}
)( );
