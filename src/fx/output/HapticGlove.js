Primrose.Output.HapticGlove = ( function () {
  
  pliny.class({
    parent: "Primrose.Output",
    name: "HapticGlove",
    description: "| [under construction]"
  } );
  function HapticGlove ( options ) {

    options.port = options.port || HapticGlove.DEFAULT_PORT;
    options.addr = options.addr || HapticGlove.DEFAULT_HOST;
    this.tips = [ ];
    this.numJoints = options.hands * options.fingers * options.joints;

    var enabled = false,
        connected = false;

    Leap.loop();

    this.setEnvironment = function ( opts ) {
      options.world = opts.world;
      options.scene = opts.scene;
      options.camera = opts.camera;

      Leap.loopController.on( "frame", readFrame.bind(this) );

    };

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
        for ( var h = 0; h < options.hands && h < frame.hands.length; ++h ) {
          var hand = frame.hands[h];
          for ( var f = 0; f < options.fingers; ++f ) {
            var finger = hand.fingers[f];
            for ( var j = 0; j < options.joints; ++j ) {
              var n = h * options.fingers * options.joints + f * options.joints + j;
              if ( n < this.tips.length ) {
                var p = finger[tipNames[j]];
                var t = this.tips[n];
                t.position.set( p[0], p[1], p[2]) ;
              }
            }
          }
        }
      }
    }

    var socket,
        fingerState = 0;

    if ( options.port !== 80 ) {
      options.addr += ":" + options.port;
    }

    socket = io.connect( options.addr, {
      "reconnect": true,
      "reconnection delay": 1000,
      "max reconnection attempts": 5
    } );

    socket.on( "connect", function () {
      connected = true;
      console.log( "Connected!" );
    } );

    socket.on( "disconnect", function () {
      connected = false;
      console.log( "Disconnected!" );
    } );

    this.readContacts = function ( contacts ) {
      var count = 0;
      for ( var c = 0; enabled && count < 2 && c < contacts.length; ++c ) {
        var contact = contacts[c];
        for ( var h = 0; h < options.hands && count < 2; ++h ) {
          for ( var f = 0; f < options.fingers; ++f ) {
            var t = this.tips[f];
            var found = false;
            if ( contact.bi === t ) {
              if ( contact.bj.graphics && contact.bj.graphics.isSolid ) {
                this.setFingerState( f, true );
                found = true;
                ++count;
              }
            }
            if ( !found ) {
              this.setFingerState( f, false );
            }
          }
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

