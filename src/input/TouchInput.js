/* global Primrose */

Primrose.Input.TouchInput = ( function () {
  function TouchInput ( name, DOMElement, buttonBounds, commands, socket,
      oscope ) {
    DOMElement = DOMElement || window;
    buttonBounds = buttonBounds || [ ];
    for ( var i = buttonBounds.length - 1; i >= 0; --i ) {
      var b = buttonBounds[i];
      b.x2 = b.x + b.w;
      b.y2 = b.y + b.h;
    }

    Primrose.Input.ButtonAndAxisInput.call( this, name, commands, socket, oscope, 1,
        TouchInput.AXES );

    function setState ( stateChange, setAxis, event ) {
      var touches = stateChange ? event.touches : event.changedTouches;
      for ( var i = 0; i < touches.length && i < TouchInput.NUM_FINGERS;
          ++i ) {
        var t = touches[i];
        if ( setAxis ) {
          for ( var j = 0; j < buttonBounds.length; ++j ) {
            this.setButton( j, false );
            var b = buttonBounds[j];
            if ( b.x <= t.pageX && t.pageX < b.x2 &&
                b.y <= t.pageY && t.pageY < b.y2 ) {
              this.setButton( j, stateChange );
            }
          }
          this.setAxis( "X" + i, t.pageX );
          this.setAxis( "Y" + i, t.pageY );
        }
        else {
          this.setAxis( "LX" + i, t.pageX );
          this.setAxis( "LY" + i, t.pageY );
        }
      }
      event.preventDefault();
    }

    DOMElement.addEventListener( "touchstart", setState.bind( this, true,
        false ), false );
    DOMElement.addEventListener( "touchend", setState.bind( this, false,
        true ), false );
    DOMElement.addEventListener( "touchmove", setState.bind( this, true,
        true ), false );
  }

  TouchInput.NUM_FINGERS = 10;
  TouchInput.AXES = [ ];
  for ( var i = 0; i < TouchInput.NUM_FINGERS; ++i ) {
    TouchInput.AXES.push( "X" + i );
    TouchInput.AXES.push( "Y" + i );
  }
  Primrose.Input.ButtonAndAxisInput.inherit( TouchInput );
  return TouchInput;
} )();
