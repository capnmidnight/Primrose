/* global Primrose, isFirefox */

Primrose.Application = ( function () {
  // This function is what is called a "Higher-order function", i.e. it is a function that takes a function as a parameter. Think of it as a function that doesn't know how to do the entire job, but it knows how to do some of it, and asks for the rest of the job as a parameter. It's a convenient way to be able to combine different bits of functionality without having to write the same code over and over again.
  function FCT ( thunk, evt ) {
    // for every point that has changed (we don't need to update points that didn't change, and on the touchend event, there is no element for the most recently released finger in the regular "touches" property).
    for ( var i = 0; i < evt.changedTouches.length; ++i ) {
      // call whatever function we were given. It's going to be one of start/move/end above, and as you can see, we're overriding the default value of the idx parameter.
      thunk.call( this, evt.changedTouches[i], evt.changedTouches[i].identifier );
    }
    evt.preventDefault();
  }

// we want to wire up all of the event handlers to the Canvas element itself, so that the X and Y coordinates of the events are offset correctly into the container.
  function E ( elem, k, f, t ) {
    var elems;
    if ( elem instanceof String || typeof elem === "string" ) {
      elems = Array.prototype.slice.call( document.querySelectorAll( elem ) );
    } else {
      elems = [ elem ];
    }
    for ( var i = 0; i < elems.length; ++i ) {
      elem = elems[i];
      if ( t ) {
        elem.addEventListener( k, FCT.bind( elem, f ), false );
      } else {
        elem.addEventListener( k, f.bind( elem ), false );
      }
    }
    return elems;
  }

  function beginApp ( update, render, resize, elem ) {
    var lt = 0,
        dt = 0,
        points = {},
        keys = {},
        onpaint = function onpaint ( t ) {
          var ticker = requestAnimationFrame( onpaint );
          try {
            dt = t - lt;
            update( dt, points, keys );
            render( dt );
          } catch ( err ) {
            cancelAnimationFrame( ticker );
            throw err;
          }
          lt = t;
        };

    // This function gets called the first time a mouse button is pressed or a new finger touches the screen. The idx value defaults to 10 because mouse clicks don't have an identifier value, but we need one to keep track of mouse clicks separately than touches, which do have identifier values, ending at 9.
    function setPoint ( evt, idx ) {
      if ( idx === undefined ) {
        idx = 10;
      }

      if ( idx === 10 ) {
        evt.preventDefault();
      }

      var obj = points[idx] || {};
      obj.x = evt.clientX;
      obj.y = evt.clientY;
      obj.rx = evt.radiusX;
      obj.ry = evt.radiusY;
      obj.b = evt.buttons;

      if ( isFirefox && obj.rx !== undefined ) {
        obj.rx /= 3;
        obj.ry /= 3;
      }

      if ( obj.b === undefined ) {
        obj.b = 1;
      }

      if ( obj.rx === undefined ) {
        if ( obj.b === 0 ) {
          obj.rx = 1;
          obj.ry = 1;
        }
        else {
          obj.rx = 1.5;
          obj.ry = 1.5;
        }
      }

      points[idx] = obj;
    }

    // This function gets called anytime the mouse or one of the fingers is released. It just cleans up our tracking objects, so the next time the mouse button is pressed, it can all start over again.
    function endPoint ( evt, idx ) {
      if ( idx === undefined ) {
        idx = 10;
      }

      if ( idx === 10 ) {
        evt.preventDefault();
      }

      points[idx] = null;
    }

    function keyDown ( evt ) {
      keys[evt.keyCode] = true;
      keys.shift = evt.shiftKey;
      keys.ctrl = evt.ctrlKey;
      keys.alt = evt.altKey;
    }

    function keyUp ( evt ) {
      keys[evt.keyCode] = false;
      keys.shift = evt.shiftKey;
      keys.ctrl = evt.ctrlKey;
      keys.alt = evt.altKey;
    }

    E( elem, "mousedown", setPoint );
    E( elem, "mousemove", setPoint );
    E( elem, "mouseup", endPoint );
    E( elem, "mouseout", endPoint );

    E( elem, "touchstart", setPoint, true );
    E( elem, "touchmove", setPoint, true );
    E( elem, "touchend", endPoint, true );

    E( window, "keydown", keyDown );
    E( window, "keyup", keyUp );

    E( window, "resize", resize );

    resize();
    requestAnimationFrame( requestAnimationFrame.bind( window, onpaint ) );
  }

  return beginApp;
} )();