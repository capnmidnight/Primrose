// fullscreen-isms
function isFullScreenMode () {
  return ( document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement );
}


function requestFullScreen ( elem, vrDisplay ) {
  if ( vrDisplay ) {
    if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( { vrDisplay: vrDisplay } );
    }
    else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen( { vrDisplay: vrDisplay } );
    }
  }
  else {
    if ( elem.requestFullscreen ) {
      elem.requestFullscreen();
    }
    else if ( elem.webkitRequestFullscreen ) {
      elem.webkitRequestFullscreen( window.Element.ALLOW_KEYBOARD_INPUT );
    }
    else if ( elem.mozRequestFullScreen ) {
      elem.mozRequestFullScreen();
    }
    else if ( elem.msRequestFullscreen ) {
      elem.msRequestFullscreen();
    }
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
