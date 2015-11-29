/* global isMobile, help */
// fullscreen-isms
function isFullScreenMode () {
  return ( document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement );
}

var USE_VR_DISPLAY_PARAMETER = false;
function requestFullScreen ( elem, vrDisplay ) {
  var fullScreenParam;

  if ( ( !isMobile || USE_VR_DISPLAY_PARAMETER ) && vrDisplay ) {
    fullScreenParam = {vrDisplay: vrDisplay};
  }

  if ( elem.webkitRequestFullscreen && fullScreenParam ) {
    elem.webkitRequestFullscreen( fullScreenParam );
  }
  else if ( elem.webkitRequestFullscreen && !fullScreenParam ) {
    elem.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
  }
  else if ( elem.requestFullscreen ) {
    elem.requestFullscreen();
  }
  else if ( elem.mozRequestFullScreen ) {
    elem.mozRequestFullScreen();
  }
  else if ( elem.msRequestFullscreen ) {
    elem.msRequestFullscreen();
  }

  if ( elem.requestPointerLock ) {
    elem.requestPointerLock();
  }
  else if ( elem.webkitRequestPointerLock ) {
    elem.webkitRequestPointerLock();
  }
  else if ( elem.mozRequestPointerLock ) {
    elem.mozRequestPointerLock();
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

var exitPointerLock = ( document.exitPointerLock ||
    document.webkitExitPointerLock || document.mozExitPointerLock ||
    function () {
    } ).bind( document );

function isPointerLocked () {
  return !!( document.pointerLockElement ||
      document.webkitPointerLockElement ||
      document.mozPointerLockElement );
}

var requestPointerLock = ( document.documentElement.requestPointerLock ||
    document.documentElement.webkitRequestPointerLock ||
    document.documentElement.mozRequestPointerLock || function () {
    } ).bind( document.documentElement );
