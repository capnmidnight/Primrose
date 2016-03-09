/* global isMobile, isiOS, devicePixelRatio */
( function ( ) {
  var m = document.querySelector( "main" ),
      h = document.querySelector( "header" );
  function r ( ) {
    try {
      var t = h.clientHeight + 1,
          y = window.innerHeight - t;
      if ( window.innerHeight < screen.height && isMobile ) {
        if ( !isiOS ) {
          y += screen.height - window.innerHeight - 10 * devicePixelRatio;
        }
        else if ( window.orientation === 90 ) {
          y += screen.availHeight - window.innerHeight;
        }
        else {
          y += screen.availWidth - window.innerWidth;
        }
      }
      m.style.top = t + "px";
      m.style.height = y + "px";
    }
    catch ( e ) {
      setTimeout( r );
    }
  }
  window.addEventListener( "resize", r, false );
  window.addEventListener( "load", r, false );
  r();
} )( );