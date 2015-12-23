/* global isMobile, help, HMDVRDevice */
// fullscreen-isms
function isFullScreenMode () {
  return ( document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement );
}

function requestFullScreen ( elem, vrDisplay ) {
  var fullScreenParam;

  if ( window.HMDVRDevice && vrDisplay && vrDisplay instanceof HMDVRDevice) {
    fullScreenParam = {vrDisplay: vrDisplay};
  }
  
  if ( elem.webkitRequestFullscreen && fullScreenParam ) {
    elem.webkitRequestFullscreen( fullScreenParam );
  }
  else if ( elem.webkitRequestFullscreen && !fullScreenParam ) {
    elem.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
  }
  else if ( elem.mozRequestFullScreen && fullScreenParam ) {
    elem.mozRequestFullScreen( fullScreenParam );
  }
  else if ( elem.mozRequestFullScreen && !fullScreenParam ) {
    elem.mozRequestFullScreen( );
  }
  else if ( elem.requestFullscreen ) {
    elem.requestFullscreen();
  }
  else if ( elem.msRequestFullscreen ) {
    elem.msRequestFullscreen();
  }
}

function exitFullScreen () {
  if ( isFullScreenMode() ) {
    document.exitFullscreen();
  }
}

function toggleFullScreen ( elem, vrDisplay ) {
  if ( isFullScreenMode() ) {
    exitFullScreen();
  }
  else {
    requestFullScreen( elem, vrDisplay );
  }
}

function addFullScreenShim ( elems ) {
  elems = elems.map( function ( e ) {
    return {
      elem: e,
      events: help( e ).events
    };
  } );

  function removeFullScreenShim () {
    elems.forEach( function ( elem ) {
      elem.events.forEach( function ( e ) {
        elem.removeEventListener( e, fullScreenShim );
      } );
    } );
  }

  function fullScreenShim ( evt ) {
    requestFullScreen( removeFullScreenShim );
  }

  elems.forEach( function ( elem ) {
    elem.events.forEach( function ( e ) {
      if ( e.indexOf( "fullscreenerror" ) < 0 ) {
        elem.addEventListener( e, fullScreenShim, false );
      }
    } );
  } );
}
