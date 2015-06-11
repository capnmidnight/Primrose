/* global Primrose, io, Leap */
Primrose.Output.HapticGlove = ( function () {
  function HapticGlove ( options, fingers, joints, port, addr ) {

    port = port || HapticGlove.DEFAULT_PORT;
    addr = addr || HapticGlove.DEFAULT_HOST;
    var tips = [ ];
    this.numJoints = fingers * joints;
    this.addTip = function ( body ) {
      tips.push( body );
    };

    var leap = new Leap.Controller( { enableGestures: false } )
        .use( 'transform', {
          vr: true,
          effectiveParent: options.camera
        } )
        .use( 'boneHand', {
          scene: options.scene,
          arm: true
        } )
        .on( "frame", readFrame )
        .connect( );
    function readFrame ( frame ) {
      if ( frame.valid ) {
        if ( frame.hands.length > 0 ) {
          var h = frame.hands[0];
          for ( var i = 0; i < fingers; ++i ) {
            var f = h.fingers[i];
            for ( var j = 0; j < joints; ++j ) {
              var n = i * joints + j;
              if ( n < tips.length ) {
                var p = f.positions[f.positions.length - j - 1];
                var t = tips[n];
                t.position.set( p[0], p[1], p[2] );
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
    console.log( addr );
    socket = io.connect( addr, {
      "reconnect": true,
      "reconnection delay": 1000,
      "max reconnection attempts": 5
    } );

    socket.on( "connect", console.log.bind( console, "Connected!" ) );

    this.readContacts = function ( contacts ) {
      var count = 0;
      for ( var f = 0; f < fingers; ++f ) {
        var n = f * joints;
        var t = tips[n];
        var found = false;
        for ( var c = 0; count < 2 && c < contacts.length; ++c ) {
          var contact = contacts[c];
          if ( contact.bi === t ) {
            if ( contact.bj.graphics && contact.bj.graphics.isSolid ) {
              this.setFingerState( f, true );
              found = true;
              ++count;
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
      socket.emit( "data", fingerState );
    };
  }

  HapticGlove.DEFAULT_PORT = 8383;
  HapticGlove.DEFAULT_HOST = document.location.hostname;
  return HapticGlove;
} )();
