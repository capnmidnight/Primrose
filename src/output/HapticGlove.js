/* global Primrose, io, Leap */
Primrose.Output.HapticGlove = ( function () {
  function HapticGlove ( options, hands, fingers, joints, port, addr ) {

    port = port || HapticGlove.DEFAULT_PORT;
    addr = addr || HapticGlove.DEFAULT_HOST;
    var tips = [ ];
    this.numJoints = hands * fingers * joints;
    this.addTip = function ( body ) {
      tips.push( body );
    };

    var scale = -50,
        offX = 0,
        offY = 1.3,
        offZ = 1,
        enabled = false,
        connected = false;

    // Connect to localhost and start getting frames
    Leap.loop();

    Leap.loopController.use( 'transform', {
      vr: true,
      effectiveParent: options.camera
    } ).use( 'boneHand', {
      scene: options.scene,
      arm: true
    } ).on("frame", readFrame);

    var tipNames = [
      "tipPosition",
      "dipPosition",
      "pipPosition",
      "mcpPosition",
      "carpPosition"
    ];

    function readFrame ( frame ) {
      if ( frame.valid ) {
        enabled = frame.hands.length > 0;
        for ( var h = 0; h < hands && h < frame.hands.length; ++h ) {
          var hand = frame.hands[h];
          for ( var f = 0; f < fingers; ++f ) {
            var finger = hand.fingers[f];
            for ( var j = 0; j < joints; ++j ) {
              var n = h * fingers * joints + f * joints + j;
              if ( n < tips.length ) {
                var p = finger[tipNames[j]];
                var t = tips[n];
                t.position.set(
                    p[0] / scale + offX,
                    p[2] / scale + offY,
                    p[1] / scale + offZ );
              }
            }
          }
        }
      }
    }

    var socket,
        fingerState = 0;

    if ( port !== 80 ) {
      addr += ":" + port;
    }

    socket = io.connect( addr, {
      "reconnect": true,
      "reconnection delay": 1000,
      "max reconnection attempts": 5
    } );

    socket.on( "connect", function () {
      connected = true;
    } );

    socket.on( "disconnect", function () {
      connected = false;
    } );

    this.readContacts = function ( contacts ) {
      var count = 0;
      for ( var h = 0; h < hands && count < 2; ++h ) {
        for ( var f = 0; f < fingers; ++f ) {
          var t = tips[f];
          var found = false;
          for ( var c = 0; enabled && count < 2 && c < contacts.length; ++c ) {
            var contact = contacts[c];
            if ( contact.bi === t ) {
              if ( contact.bj.graphics && contact.bj.graphics.isSolid ) {
                this.setFingerState( f, true );
                found = true;
                ++count;
              }
            }
          }
        }
        if ( !found ) {
          this.setFingerState( f, false );
        }
      }
    };

    this.setFingerState = function ( i, value ) {
      var mask = 0x1 << i;
      if ( value ) {
        fingerState = fingerState | mask;
      }
      else {
        fingerState = fingerState & ~mask & 0x1f;
      }
      if ( connected ) {
        socket.emit( "data", fingerState );
      }
    };
  }

  HapticGlove.DEFAULT_PORT = 8383;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();
