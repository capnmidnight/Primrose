/* global Primrose, requestAnimationFrame, Leap */

Primrose.Input.LeapMotionInput = ( function () {
  function LeapMotionInput ( name, commands, socket, oscope ) {
    this.isStreaming = false;
    Primrose.Input.ButtonAndAxisInput.call( this, name, commands, socket, oscope, 1,
        LeapMotionInput.AXES );

    this.controller = new Leap.Controller( { enableGestures: true } );
  }

  LeapMotionInput.AXES = [ ];
  LeapMotionInput.COMPONENTS = [ "X", "Y", "Z" ];
  LeapMotionInput.NUM_HANDS = 2;
  for ( var i = 0; i < LeapMotionInput.NUM_HANDS; ++i ) {
    var h = "HAND" + i;
    LeapMotionInput.COMPONENTS.forEach( function ( c ) {
      LeapMotionInput.AXES.push( h + c );
    } );
  }

  LeapMotionInput.NUM_FINGERS = 10;
  LeapMotionInput.FINGER_PARTS = [ "tip", "dip", "pip", "mcp", "carp" ];
  for ( var i = 0; i < LeapMotionInput.NUM_FINGERS; ++i ) {
    LeapMotionInput.FINGER_PARTS.map( function ( p ) {
      return "FINGER" + i + p.toUpperCase();
    } )
        .forEach(
            function ( f ) {
              LeapMotionInput.COMPONENTS.forEach( function ( c ) {
                LeapMotionInput.AXES.push( f + c );
              } );
            } );
      }
      Primrose.Input.ButtonAndAxisInput.inherit( LeapMotionInput );

      LeapMotionInput.CONNECTION_TIMEOUT = 5000;
      LeapMotionInput.prototype.E = function ( e, f ) {
        if ( f ) {
          this.controller.on( e, f );
        }
        else {
          this.controller.on( e, console.log.bind( console,
              "Leap Motion Event: " + e ) );
        }
      };

      LeapMotionInput.prototype.start = function ( gameUpdateLoop ) {
        if ( this.isEnabled() ) {
          var canceller = null,
              startAlternate = null;
          if ( gameUpdateLoop ) {
            var alternateLooper = function ( t ) {
              requestAnimationFrame( alternateLooper );
              gameUpdateLoop( t );
            };
            startAlternate = requestAnimationFrame.bind( window,
                alternateLooper );
            var timeout = setTimeout( startAlternate,
                LeapMotionInput.CONNECTION_TIMEOUT );
            canceller = function () {
              clearTimeout( timeout );
              this.isStreaming = true;
            }.bind( this );
            this.E( "deviceStreaming", canceller );
            this.E( "streamingStarted", canceller );
            this.E( "streamingStopped", startAlternate );
          }
          this.E( "connect" );
          //this.E("protocol");
          this.E( "deviceStopped" );
          this.E( "disconnect" );
          this.E( "frame", this.setState.bind( this, gameUpdateLoop ) );
          this.controller.connect();
        }
      };

      LeapMotionInput.prototype.setState = function ( gameUpdateLoop, frame ) {
        var prevFrame = this.controller.history.get( 1 );
        if ( !prevFrame || frame.hands.length !== prevFrame.hands.length ) {
          for ( var i = 0; i < this.commands.length; ++i ) {
            this.enable( this.commands[i].name, frame.hands.length > 0 );
          }
        }

        for ( var i = 0; i < frame.hands.length; ++i ) {
          var hand = frame.hands[i].palmPosition;
          var handName = "HAND" + i;
          for ( var j = 0; j < LeapMotionInput.COMPONENTS.length; ++j ) {
            this.setAxis( handName + LeapMotionInput.COMPONENTS[j], hand[j] );
          }
        }

        for ( var i = 0; i < frame.fingers.length; ++i ) {
          var finger = frame.fingers[i];
          var fingerName = "FINGER" + i;
          for ( var j = 0; j < LeapMotionInput.FINGER_PARTS.length; ++j ) {
            var joint = finger[LeapMotionInput.FINGER_PARTS[j] + "Position"];
            var jointName = fingerName +
                LeapMotionInput.FINGER_PARTS[j].toUpperCase();
            for ( var k = 0; k < LeapMotionInput.COMPONENTS.length; ++k ) {
              this.setAxis( jointName + LeapMotionInput.COMPONENTS[k],
                  joint[k] );
            }
          }
        }

        if ( gameUpdateLoop ) {
          gameUpdateLoop( frame.timestamp * 0.001 );
        }
      };
      return LeapMotionInput;
    } )();
