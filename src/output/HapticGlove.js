/* global Primrose, io */
Primrose.Output.HapticGlove = ( function () {
  function HapticGlove () {

    var addr = HapticGlove.DEFAULT_HOST,
        socket,
        fingerState = 0;

    if ( HapticGlove.DEFAULT_PORT !== 80 ) {
      addr += ":" + HapticGlove.DEFAULT_PORT;
    }

    if ( window.hasOwnProperty( "io" ) ) {
      socket = io.connect( addr, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 60
      } );
    }

    this.setFingerState = function ( i, value ) {
      var mask = 0x1 << i;
      if ( value ) {
        fingerState = fingerState | mask;
      }
      else {
        fingerState = fingerState & ~mask & 0x1f;
      }
      socket.emit( "data", fingerState );
    };

  }

  HapticGlove.DEFAULT_PORT = 9080;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();
