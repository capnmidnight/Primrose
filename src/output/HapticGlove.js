/* global Primrose, io */
Primrose.Output.HapticGlove = ( function () {
  function HapticGlove (port, addr) {

    port = port || HapticGlove.DEFAULT_PORT;
    addr = addr || HapticGlove.DEFAULT_HOST;

    var socket,
        fingerState = 0;

    if ( port !== 80 ) {
      addr += ":" + port;
    }

    if ( window.hasOwnProperty( "io" ) ) {
      socket = io.connect( addr, {
        "reconnect": true,
        "reconnection delay": 1000,
        "max reconnection attempts": 5
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

  HapticGlove.DEFAULT_PORT = 8383;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();
