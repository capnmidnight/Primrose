/*
  Primrose v0.11.4 2015-04-19
  gplv3
  Copyright (C) 2015 Sean T. McBeth [sean@seanmcbeth.com]
  https://www.primroseeditor.com
  https://github.com/capnmidnight/Primrose.git
*/
// Pyschologist.js: so named because it keeps me from going crazy

/////////////////////////////////////////////////////////////////////////////
// polyfills
/////////////////////////////////////////////////////////////////////////////

navigator.vibrate = navigator.vibrate ||
    navigator.webkitVibrate ||
    navigator.mozVibrate ||
    function () {
    };

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia ||
    function () {
    };

window.RTCPeerConnection = window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection ||
    function () {
    };

window.RTCIceCandidate = window.RTCIceCandidate ||
    window.mozRTCIceCandidate ||
    function () {
    };

window.RTCSessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription ||
    function () {
    };

window.Element.prototype.requestPointerLock =
    window.Element.prototype.requestPointerLock ||
    window.Element.prototype.webkitRequestPointerLock ||
    window.Element.prototype.mozRequestPointerLock ||
    function () {
    };

window.Element.prototype.requestFullscreen =
    window.Element.prototype.requestFullscreen ||
    window.Element.prototype.webkitRequestFullscreen ||
    window.Element.prototype.mozRequestFullScreen ||
    window.Element.prototype.msRequestFullscreen ||
    function () {
    };

window.Document.prototype.exitFullscreen =
    window.Document.prototype.exitFullscreen ||
    window.Document.prototype.webkitExitFullscreen ||
    window.Document.prototype.mozCancelFullScreen ||
    window.Document.prototype.msExitFullscreen ||
    function () {
    };

// this doesn't seem to actually work
screen.lockOrientation = screen.lockOrientation ||
    screen.mozLockOrientation ||
    screen.msLockOrientation ||
    function () {
    };


/////////////////////////////////////////////////////////////////////////////
//  end polyfils
/////////////////////////////////////////////////////////////////////////////

function sigfig ( x, y ) {
  var p = Math.pow( 10, y );
  var v = ( Math.round( x * p ) / p ).toString();
  if ( y > 0 ) {
    var i = v.indexOf( "." );
    if ( i === -1 ) {
      v += ".";
      i = v.length - 1;
    }
    while ( v.length - i - 1 < y )
      v += "0";
  }
  return v;
}

/*
 Replace template place holders in a string with a positional value.
 Template place holders start with a dollar sign ($) and are followed
 by a digit that references the parameter position of the value to
 use in the text replacement. Note that the first position, position 0,
 is the template itself. However, you cannot reference the first position,
 as zero digit characters are used to indicate the width of number to
 pad values out to.

 Numerical precision padding is indicated with a period and trailing
 zeros.

 examples:
 fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
 fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
 fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001)
 => "1.41 + 3.14 = 9001.00"
 fmt("$001.000", Math.PI) => 003.142
 */
var fmt = ( function () {

  function addMillis ( val, txt ) {
    return txt.replace( /( AM| PM|$)/, function ( match, g1 ) {
      return ( val.getMilliseconds() / 1000 ).toString()
          .substring( 1 ) + g1;
    } );
  }

  function fmt ( template ) {
    // - match a dollar sign ($) literally,
    // - (optional) then zero or more zero digit (0) characters, greedily
    // - then one or more digits (the previous rule would necessitate that
    //      the first of these digits be at least one).
    // - (optional) then a period (.) literally
    // -            then one or more zero digit (0) characters
    var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
    var args = arguments;
    if ( typeof template !== "string" ) {
      template = template.toString();
    }
    return template.replace( paramRegex, function ( m, pad, index,
        precision ) {
      index = parseInt( index, 10 );
      if ( 0 <= index && index < args.length ) {
        var val = args[index];
        if ( val !== null && val !== undefined ) {
          if ( val instanceof Date && precision ) {
            switch ( precision.length ) {
              case 1:
                val = val.getYear();
                break;
              case 2:
                val = ( val.getMonth() + 1 ) + "/" + val.getYear();
                break;
              case 3:
                val = val.toLocaleDateString();
                break;
              case 4:
                val = addMillis( val, val.toLocaleTimeString() );
                break;
              case 5:
              case 6:
                val = val.toLocaleString();
                break;
              default:
                val = addMillis( val, val.toLocaleString() );
                break;
            }
            return val;
          }
          else {
            if ( precision && precision.length > 0 ) {
              val = sigfig( val, precision.length );
            }
            else {
              val = val.toString();
            }
            if ( pad && pad.length > 0 ) {
              var paddingRegex = new RegExp( "^\\d{" + ( pad.length + 1 ) +
                  "}(\\.\\d+)?" );
              while ( !paddingRegex.test( val ) ) {
                val = "0" + val;
              }
            }
            return val;
          }
        }
      }
      return undefined;
    } );
  }
  return fmt;
} )();



// unicode-aware string reverse
var reverse = ( function ( ) {
  var combiningMarks =
      /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
      surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

  function reverse ( str ) {
    str = str.replace( combiningMarks, function ( match, capture1,
        capture2 ) {
      return reverse( capture2 ) + capture1;
    } )
        .replace( surrogatePair, "$2$1" );
    var res = "";
    for ( var i = str.length - 1; i >= 0; --i ) {
      res += str[i];
    }
    return res;
  }
  return reverse;
}
)( );

/*
 * 1) If id is a string, tries to find the DOM element that has said ID
 *      a) if it exists, and it matches the expected tag type, returns the
 *          element, or throws an error if validation fails.
 *      b) if it doesn't exist, creates it and sets its ID to the provided
 *          id, then returns the new DOM element, not yet placed in the
 *          document anywhere.
 * 2) If id is a DOM element, validates that it is of the expected type,
 *      a) returning the DOM element back if it's good,
 *      b) or throwing an error if it is not
 * 3) If id is null, creates the DOM element to match the expected type.
 * @param {string|DOM element|null} id
 * @param {string} tag name
 * @param {function} DOMclass
 * @returns DOM element
 */
function cascadeElement ( id, tag, DOMClass ) {
  var elem = null;
  if ( id === null ) {
    elem = document.createElement( tag );
    elem.id = id = "auto_" + tag + Date.now();
  }
  else if ( DOMClass === undefined || id instanceof DOMClass ) {
    elem = id;
  }
  else if ( typeof ( id ) === "string" ) {
    elem = document.getElementById( id );
    if ( elem === null ) {
      elem = document.createElement( tag );
      elem.id = id;
    }
    else if ( elem.tagName !== tag.toUpperCase() ) {
      elem = null;
    }
  }

  if ( elem === null ) {
    throw new Error( id + " does not refer to a valid " + tag +
        " element." );
  }
  else {
    elem.innerHTML = "";
  }
  return elem;
}

function copyObject ( dest, source ) {
  var stack = [ { dest: dest, source: source } ];
  while ( stack.length > 0 ) {
    var frame = stack.pop(),
        source = frame.source,
        dest = frame.dest;
    for ( var key in source ) {
      if ( source.hasOwnProperty( key ) ) {
        if ( typeof ( source[key] ) !== "object" ) {
          dest[key] = source[key];
        }
        else {
          if ( !dest[key] ) {
            dest[key] = { };
          }
          stack.push( { dest: dest[key], source: source[key] } );
        }
      }
    }
  }
}

function help ( obj ) {
  var funcs = { };
  var props = { };
  var evnts = [ ];
  if ( obj ) {
    for ( var field in obj ) {
      if ( field.indexOf( "on" ) === 0 && ( obj !== navigator || field !==
          "onLine" ) ) {
        // `online` is a known element that is not an event, but looks like
        // an event to the most basic assumption.
        evnts.push( field.substring( 2 ) );
      }
      else if ( typeof ( obj[field] ) === "function" ) {
        funcs[field] = obj[field];
      }
      else {
        props[field] = obj[field];
      }
    }

    var type = typeof ( obj );
    if ( type === "function" ) {
      type = obj.toString()
          .match( /(function [^(]*)/ )[1];
    }
    else if ( type === "object" ) {
      type = null;
      if ( obj.constructor && obj.constructor.name ) {
        type = obj.constructor.name;
      }
      else {
        var q = [ { prefix: "", obj: window } ];
        var traversed = [ ];
        while ( q.length > 0 && type === null ) {
          var parentObject = q.shift();
          parentObject.___traversed___ = true;
          traversed.push( parentObject );
          for ( field in parentObject.obj ) {
            var testObject = parentObject.obj[field];
            if ( testObject ) {
              if ( typeof ( testObject ) === "function" ) {
                if ( testObject.prototype && obj instanceof testObject ) {
                  type = parentObject.prefix + field;
                  break;
                }
              }
              else if ( !testObject.___tried___ ) {
                q.push( { prefix: parentObject.prefix + field + ".",
                  obj: testObject } );
              }
            }
          }
        }
        traversed.forEach( function ( o ) {
          delete o.___traversed___;
        } );
      }
    }
    obj = {
      type: type,
      events: evnts,
      functions: funcs,
      properties: props
    };

    return obj;
  }
  else {
    console.warn( "Object was falsey." );
  }
}

function isNumber ( str ) {
  return !isNaN( str );
}

function makeURL ( url, queryMap ) {
  var output = [ ];
  for ( var key in queryMap ) {
    if ( queryMap.hasOwnProperty( key ) &&
        typeof queryMap[key] !== "function" ) {
      output.push( encodeURIComponent( key ) + "=" + encodeURIComponent(
          queryMap[key] ) );
    }
  }
  return url + "?" + output.join( "&" );
}

function XHR ( url, method, type, progress, error, success, data ) {
  var xhr = new XMLHttpRequest();
  xhr.onerror = error;
  xhr.onabort = error;
  xhr.onprogress = progress;
  xhr.onload = function () {
    if ( xhr.status < 400 ) {
      if ( success ) {
        success( xhr.response );
      }
    }
    else if ( error ) {
      error();
    }
  };

  xhr.open( method, url );
  if ( type ) {
    xhr.responseType = type;
  }
  if ( data ) {
    xhr.setRequestHeader( "Content-Type",
        "application/json;charset=UTF-8" );
    xhr.send( JSON.stringify( data ) );
  }
  else {
    xhr.send();
  }
}

function GET ( url, type, progress, error, success ) {
  type = type || "text";

  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "GET", type, progressThunk, errorThunk, successThunk );
}

function POST ( url, data, type, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  XHR( url, "POST", type, progressThunk, errorThunk, successThunk );
}

function getObject ( url, progress, error, success ) {
  var progressThunk = success && error && progress,
      errorThunk = ( success && error ) || ( error && progress ),
      successThunk = success || error || progress;
  GET( url, "json", progressThunk, errorThunk, successThunk );
}

function sendObject ( url, data, progress, error, success ) {
  POST( url, data, "json",
      success && error && progress,
      ( success && error ) || ( error && progress ),
      success || error || progress );
}

// Applying Array's slice method to array-like objects. Called with
// no parameters, this function converts array-like objects into
// JavaScript Arrays.
function arr ( arg, a, b ) {
  return Array.prototype.slice.call( arg, a, b );
}

function map ( arr, fun ) {
  return Array.prototype.map.call( arr, fun );
}

function reduce ( arr, fun, base ) {
  return Array.prototype.reduce.call( arr, fun, base );
}

function filter ( arr, fun ) {
  return Array.prototype.filter.call( arr, fun );
}

function ofType ( arr, t ) {
  if ( typeof ( t ) === "function" ) {
    return filter( arr, function ( elem ) {
      return elem instanceof t;
    } );
  }
  else {
    return filter( arr, function ( elem ) {
      return typeof ( elem ) === t;
    } );
  }
}

function agg ( arr, get, red ) {
  if ( typeof ( get ) !== "function" ) {
    get = ( function ( key, obj ) {
      return obj[key];
    } ).bind( window, get );
  }
  return arr.map( get )
      .reduce( red );
}

function add ( a, b ) {
  return a + b;
}

function sum ( arr, get ) {
  return agg( arr, get, add );
}

function group ( arr, getKey, getValue ) {
  var groups = [ ];
  // we don't want to modify the original array.
  var clone = arr.slice();

  // Sorting the array by the group key criteeria first
  // simplifies the grouping step. With a sorted array
  // by the keys, grouping can be done in a single pass.
  clone.sort( function ( a, b ) {
    var ka = getKey ? getKey( a ) : a;
    var kb = getKey ? getKey( b ) : b;
    if ( ka < kb ) {
      return -1;
    }
    else if ( ka > kb ) {
      return 1;
    }
    return 0;
  } );

  for ( var i = 0; i < clone.length; ++i ) {
    var obj = clone[i];
    var key = getKey ? getKey( obj ) : obj;
    var val = getValue ? getValue( obj ) : obj;
    if ( groups.length === 0 || groups[groups.length - 1].key !== key ) {
      groups.push( { key: key, values: [ ] } );
    }
    groups[groups.length - 1].values.push( val );
  }
  return groups;
}

function log () {
  console.log( fmt.apply( window, arguments ) );
}

function err () {
  console.error( fmt.apply( window, arguments ) );
}

var px = fmt.bind( this, "$1px" ),
    pct = fmt.bind( this, "$1%" ),
    ems = fmt.bind( this, "$1em" );

function findEverything ( elem, obj ) {
  elem = elem || document;
  obj = obj || { };
  var arr = elem.querySelectorAll( "*" );
  for ( var i = 0; i < arr.length; ++i ) {
    var e = arr[i];
    if ( e.id && e.id.length > 0 ) {
      obj[e.id] = e;
      if ( e.parentElement ) {
        e.parentElement[e.id] = e;
      }
    }
  }
  return obj;
}

function inherit ( classType, parentType ) {
  classType.prototype = Object.create( parentType.prototype );
  classType.prototype.constructor = classType;
}

function getSetting ( name, defValue ) {
  if ( window.localStorage ) {
    var val = window.localStorage.getItem( name );
    if ( val ) {
      try {
        return JSON.parse( val );
      }
      catch ( exp ) {
        console.error( "getSetting", name, val, typeof ( val ), exp );
      }
    }
  }
  return defValue;
}

function setSetting ( name, val ) {
  if ( window.localStorage && val ) {
    try {
      window.localStorage.setItem( name, JSON.stringify( val ) );
    }
    catch ( exp ) {
      console.error( "setSetting", name, val, typeof ( val ), exp );
    }
  }
}

function deleteSetting ( name ) {
  if ( window.localStorage ) {
    window.localStorage.removeItem( name );
  }
}

function readForm ( ctrls ) {
  var state = { };
  if ( ctrls ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( ( c.tagName === "INPUT" || c.tagName === "SELECT" ) &&
          ( !c.dataset || !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
          state[name] = c.value;
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          state[name] = c.checked;
        }
      }
    }
  }
  return state;
}

function writeForm ( ctrls, state ) {
  if ( state ) {
    for ( var name in ctrls ) {
      var c = ctrls[name];
      if ( state[name] !== null && state[name] !== undefined &&
          ( c.tagName ===
              "INPUT" || c.tagName === "SELECT" ) && ( !c.dataset ||
          !c.dataset.skipcache ) ) {
        if ( c.type === "text" || c.type === "password" || c.tagName ===
            "SELECT" ) {
          c.value = state[name];
        }
        else if ( c.type === "checkbox" || c.type === "radio" ) {
          c.checked = state[name];
        }
      }
    }
  }
}

function reloadPage () {
  document.location = document.location.href;
}

function makeHidingContainer ( id, obj ) {
  var elem = cascadeElement( id, "div", window.HTMLDivElement );
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild( obj );
  return elem;
}

// snagged and adapted from http://detectmobilebrowsers.com/
var isMobile = ( function ( a ) {
  return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      a ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
          a.substring( 0, 4 ) );
} )( navigator.userAgent || navigator.vendor || window.opera ),
    isiOS = /Apple-iP(hone|od|ad)/.test( navigator.userAgent || "" ),
    isOSX = /Macintosh/.test( navigator.userAgent || "" ),
    isWindows = /Windows/.test( navigator.userAgent || "" ),
    isOpera = !!window.opera || navigator.userAgent.indexOf( ' OPR/' ) >= 0,
    isFirefox = typeof window.InstallTrigger !== 'undefined',
    isSafari = Object.prototype.toString.call( window.HTMLElement )
    .indexOf( 'Constructor' ) > 0,
    isChrome = !!window.chrome && !isOpera,
    isIE = /*@cc_on!@*/false || !!document.documentMode;
// fullscreen-isms
function isFullScreenMode () {
  return ( document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement );
}

function requestFullScreen ( vrDisplay, success ) {
  if ( !success ) {
    success = vrDisplay;
    vrDisplay = null;
  }
  if ( !isFullScreenMode() ) {
    if ( vrDisplay ) {
      document.documentElement.requestFullscreen( { vrDisplay: vrDisplay
      } );
    }
    else {
      document.documentElement.requestFullscreen(
          window.Element.ALLOW_KEYBOARD_INPUT );
    }
    var interval = setInterval( function () {
      if ( isFullScreenMode() ) {
        clearInterval( interval );
        screen.lockOrientation( "landscape-primary" );
        if ( success ) {
          success();
        }
      }
    }, 1000 );
  }
  else if ( success ) {
    success();
  }
}

function exitFullScreen () {
  if ( isFullScreenMode() ) {
    document.exitFullscreen();
  }
}

function toggleFullScreen () {
  if ( document.documentElement.requestFullscreen ) {
    if ( isFullScreenMode() ) {
      exitFullScreen();
    }
    else {
      requestFullScreen();
    }
  }
}

function addFullScreenShim () {
  var elems = arr( arguments );
  elems = elems.map( function ( e ) {
    return {
      elem: e,
      events: help( e ).events
    };
  } );

  function removeFullScreenShim () {
    elems.forEach( function ( elem ) {
      elem.events.forEach( function ( e ) {
        elem.elem.removeEventListener( e, fullScreenShim );
      } );
    } );
  }

  function fullScreenShim ( evt ) {
    requestFullScreen( removeFullScreenShim );
  }

  elems.forEach( function ( elem ) {
    elem.events.forEach( function ( e ) {
      if ( e.indexOf( "fullscreenerror" ) < 0 ) {
        elem.elem.addEventListener( e, fullScreenShim, false );
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
    } ).bind( document.documentElement );;window.Primrose = window.Primrose || { };
window.Primrose.CodePage = ( function ( ) {
  "use strict";

  function CodePage ( name, lang, options ) {
    this.name = name;
    this.language = lang;

    copyObject( this, {
      NORMAL: {
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z"
      },
      SHIFT: {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z"
      }
    } );
    
    copyObject( this, options );

    for ( var i = 0; i <= 9; ++i ) {
      var code = Primrose.Keys["NUMPAD" + i];
      this.NORMAL[code] = i.toString();
    }
  }

  CodePage.DEAD = function ( key ) {
    return function ( prim ) {
      prim.setDeadKeyState( "DEAD" + key );
    };
  };

  return CodePage;
} ) ();
;window.Primrose = window.Primrose || { };
window.Primrose.CommandPack = ( function ( ) {
  "use strict";

  function CommandPack ( name, commands ) {
    this.name = name;
    copyObject(this, commands);
  }

  return CommandPack;
} )();;/* global qp */
window.Primrose = window.Primrose || { };
window.Primrose.Cursor = ( function ( ) {
  "use strict";

  function Cursor ( i, x, y ) {
    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  Cursor.min = function ( a, b ) {
    if ( a.i <= b.i ) {
      return a;
    }
    return b;
  };

  Cursor.max = function ( a, b ) {
    if ( a.i > b.i ) {
      return a;
    }
    return b;
  };

  Cursor.prototype.toString = function () {
    return fmt( "[i:$1 x:$2 y:$3]", this.i, this.x, this.y );
  };

  Cursor.prototype.copy = function ( cursor ) {
    this.i = cursor.i;
    this.x = cursor.x;
    this.y = cursor.y;
    this.moved = false;
  };

  Cursor.prototype.fullhome = function ( tokenRows ) {
    this.i = 0;
    this.x = 0;
    this.y = 0;
    this.moved = true;
  };

  function rebuildLine ( tokenRows, y ) {
    var tokenRow = tokenRows[y];
    var line = "";
    for ( var i = 0; i < tokenRow.length; ++i ) {
      line += tokenRow[i].value;
    }
    return line;
  }

  Cursor.prototype.fullend = function ( tokenRows ) {
    this.i = 0;
    var lastLength = 0;
    for ( var y = 0; y < tokenRows.length; ++y ) {
      var line = rebuildLine( tokenRows, y );
      lastLength = line.length;
      this.i += lastLength;
    }
    this.y = tokenRows.length - 1;
    this.x = lastLength;
    this.moved = true;
  };

  Cursor.prototype.skipleft = function ( tokenRows ) {
    if ( this.x === 0 ) {
      this.left( tokenRows );
    }
    else {
      var x = this.x - 1;
      var line = rebuildLine( tokenRows, this.y );
      var word = reverse( line.substring( 0, x ) );
      var m = word.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : word.length;
      this.i -= dx;
      this.x -= dx;
    }
    this.moved = true;
  };

  Cursor.prototype.left = function ( tokenRows ) {
    if ( this.i > 0 ) {
      --this.i;
      --this.x;
      if ( this.x < 0 ) {
        --this.y;
        var line = rebuildLine( tokenRows, this.y );
        this.x = line.length;
      }
      if ( this.reverseFromNewline( tokenRows ) ) {
        ++this.i;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.skipright = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x === line.length || line[this.x] === '\n' ) {
      this.right( tokenRows );
    }
    else {
      var x = this.x + 1;
      line = line.substring( x );
      var m = line.match( /(\s|\W)+/ );
      var dx = m ? ( m.index + m[0].length + 1 ) : ( line.length - this.x );
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.fixCursor = function ( tokenRows ) {
    this.x = this.i;
    this.y = 0;
    var total = 0;
    var line = rebuildLine( tokenRows, this.y );
    while ( this.x > line.length ) {
      this.x -= line.length;
      total += line.length;
      if ( this.y >= tokenRows.length - 1 ) {
        this.i = total;
        this.x = line.length;
        this.moved = true;
        break;
      }
      ++this.y;
      line = rebuildLine( tokenRows, this.y );
    }
    return this.moved;
  };

  Cursor.prototype.right = function ( tokenRows ) {
    this.advanceN( tokenRows, 1 );
  };

  Cursor.prototype.advanceN = function ( tokenRows, n ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.y < tokenRows.length - 1 || this.x < line.length ) {
      this.i += n;
      this.fixCursor( tokenRows );
      line = rebuildLine( tokenRows, this.y );
      if ( this.x > 0 && line[this.x - 1] === '\n' ) {
        ++this.y;
        this.x = 0;
      }
    }
    this.moved = true;
  };

  Cursor.prototype.home = function ( tokenRows ) {
    this.i -= this.x;
    this.x = 0;
    this.moved = true;
  };

  Cursor.prototype.end = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    var dx = line.length - this.x;
    this.i += dx;
    this.x += dx;
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.up = function ( tokenRows ) {
    if ( this.y > 0 ) {
      --this.y;
      var line = rebuildLine( tokenRows, this.y );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i -= line.length - dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.down = function ( tokenRows ) {
    if ( this.y < tokenRows.length - 1 ) {
      ++this.y;
      var line = rebuildLine( tokenRows, this.y );
      var pLine = rebuildLine( tokenRows, this.y - 1 );
      var dx = Math.min( 0, line.length - this.x );
      this.x += dx;
      this.i += pLine.length + dx;
      this.reverseFromNewline( tokenRows );
    }
    this.moved = true;
  };

  Cursor.prototype.incY = function ( dy, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, this.y + dy ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, this.x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.setXY = function ( x, y, tokenRows ) {
    this.y = Math.max( 0, Math.min( tokenRows.length - 1, y ) );
    var line = rebuildLine( tokenRows, this.y );
    this.x = Math.max( 0, Math.min( line.length, x ) );
    this.i = this.x;
    for ( var i = 0; i < this.y; ++i ) {
      this.i += rebuildLine( tokenRows, i ).length;
    }
    this.reverseFromNewline( tokenRows );
    this.moved = true;
  };

  Cursor.prototype.setI = function ( i, tokenRows ) {
    this.i = i;
    this.fixCursor(tokenRows);
    this.moved = true;
  };

  Cursor.prototype.reverseFromNewline = function ( tokenRows ) {
    var line = rebuildLine( tokenRows, this.y );
    if ( this.x > 0 && line[this.x - 1] === '\n' ) {
      --this.x;
      --this.i;
      return true;
    }
    return false;
  };

  return Cursor;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Grammar = ( function ( ) {
  "use strict";

  function Grammar ( name, grammar ) {
    this.name = name;
    // clone the preprocessing grammar to start a new grammar
    this.grammar = grammar.map( function ( rule ) {
      return new Primrose.Rule( rule[0], rule[1] );
    } );

    function crudeParsing ( tokens ) {
      var blockOn = false,
          line = 0;
      for ( var i = 0; i < tokens.length; ++i ) {
        var t = tokens[i];
        t.line = line;
        if ( t.type === "newlines" ) {
          ++line;
        }

        if ( blockOn ) {
          if ( t.type === "endBlockComments" ) {
            blockOn = false;
          }
          if ( t.type !== "newlines" ) {
            t.type = "comments";
          }
        }
        else if ( t.type === "startBlockComments" ) {
          blockOn = true;
          t.type = "comments";
        }
      }
    }

    this.tokenize = function ( text ) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [ new Primrose.Token( text, "regular", 0 ) ];
      for ( var i = 0; i < this.grammar.length; ++i ) {
        var rule = this.grammar[i];
        for ( var j = 0; j < tokens.length; ++j ) {
          rule.carveOutMatchedToken( tokens, j );
        }
      }

      crudeParsing( tokens );
      return tokens;
    };
  }

  return Grammar;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Keys = ( function ( ) {
  "use strict";
  var Keys = {
    ///////////////////////////////////////////////////////////////////////////
    // modifiers
    ///////////////////////////////////////////////////////////////////////////
    MODIFIER_KEYS: [ "CTRL", "ALT", "META", "SHIFT" ],
    SHIFT: 16,
    CTRL: 17,
    ALT: 18,
    META_L: 91,
    META_R: 92,
    ///////////////////////////////////////////////////////////////////////////
    // whitespace
    ///////////////////////////////////////////////////////////////////////////
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SPACE: 32,
    DELETE: 46,
    ///////////////////////////////////////////////////////////////////////////
    // lock keys
    ///////////////////////////////////////////////////////////////////////////
    PAUSEBREAK: 19,
    CAPSLOCK: 20,
    NUMLOCK: 144,
    SCROLLLOCK: 145,
    INSERT: 45,
    ///////////////////////////////////////////////////////////////////////////
    // navigation keys
    ///////////////////////////////////////////////////////////////////////////
    ESCAPE: 27,
    PAGEUP: 33,
    PAGEDOWN: 34,
    END: 35,
    HOME: 36,
    LEFTARROW: 37,
    UPARROW: 38,
    RIGHTARROW: 39,
    DOWNARROW: 40,
    SELECTKEY: 93,
    ///////////////////////////////////////////////////////////////////////////
    // numbers
    ///////////////////////////////////////////////////////////////////////////
    NUMBER0: 48,
    NUMBER1: 49,
    NUMBER2: 50,
    NUMBER3: 51,
    NUMBER4: 52,
    NUMBER5: 53,
    NUMBER6: 54,
    NUMBER7: 55,
    NUMBER8: 56,
    NUMBER9: 57,
    ///////////////////////////////////////////////////////////////////////////
    // letters
    ///////////////////////////////////////////////////////////////////////////
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    ///////////////////////////////////////////////////////////////////////////
    // numpad
    ///////////////////////////////////////////////////////////////////////////
    NUMPAD0: 96,
    NUMPAD1: 97,
    NUMPAD2: 98,
    NUMPAD3: 99,
    NUMPAD4: 100,
    NUMPAD5: 101,
    NUMPAD6: 102,
    NUMPAD7: 103,
    NUMPAD8: 104,
    NUMPAD9: 105,
    MULTIPLY: 106,
    ADD: 107,
    SUBTRACT: 109,
    DECIMALPOINT: 110,
    DIVIDE: 111,
    ///////////////////////////////////////////////////////////////////////////
    // function keys
    ///////////////////////////////////////////////////////////////////////////
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123
  };

  // create a reverse mapping from keyCode to name.
  for ( var key in Keys ) {
    var val = Keys[key];
    if ( Keys.hasOwnProperty( key ) && typeof ( val ) === "number" ) {
      Keys[val] = key;
    }
  }

  return Keys;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.OperatingSystem = ( function ( ) {
  "use strict";

  function setCursorCommand ( obj, mod, key, func, cur ) {
    var name = mod + "_" + key;
    obj[name] = function ( prim, tokenRows ) {
      prim["cursor" + func]( tokenRows, prim[cur + "Cursor"] );
    };
  }

  function makeCursorCommand ( obj, baseMod, key, func ) {
    setCursorCommand( obj, baseMod || "NORMAL", key, func, "front" );
    setCursorCommand( obj, baseMod + "SHIFT", key, func, "back" );
  }

  function OperatingSystem ( name, pre1, pre2, redo, pre3, home, end, pre4,
      fullHome, fullEnd ) {
    this.name = name;

    this[pre1 + "_a"] = function ( prim, tokenRows ) {
      prim.frontCursor.fullhome( tokenRows );
      prim.backCursor.fullend( tokenRows );
      prim.forceUpdate();
    };

    this[redo] = function ( prim, tokenRows ) {
      prim.redo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_z"] = function ( prim, tokenRows ) {
      prim.undo();
      prim.scrollIntoView( prim.frontCursor );
    };

    this[pre1 + "_DOWNARROW"] = function ( prim, tokenRows ) {
      if ( prim.scroll.y < tokenRows.length ) {
        ++prim.scroll.y;
      }
      prim.forceUpdate();
    };

    this[pre1 + "_UPARROW"] = function ( prim, tokenRows ) {
      if ( prim.scroll.y > 0 ) {
        --prim.scroll.y;
      }
      prim.forceUpdate();
    };

    makeCursorCommand( this, "", "LEFTARROW", "Left" );
    makeCursorCommand( this, "", "RIGHTARROW", "Right" );
    makeCursorCommand( this, "", "UPARROW", "Up" );
    makeCursorCommand( this, "", "DOWNARROW", "Down" );
    makeCursorCommand( this, "", "PAGEUP", "PageUp" );
    makeCursorCommand( this, "", "PAGEDOWN", "PageDown" );
    makeCursorCommand( this, pre2, "LEFTARROW", "SkipLeft" );
    makeCursorCommand( this, pre2, "RIGHTARROW", "SkipRight" );
    makeCursorCommand( this, pre3, home, "Home" );
    makeCursorCommand( this, pre3, end, "End" );
    makeCursorCommand( this, pre4, fullHome, "FullHome" );
    makeCursorCommand( this, pre4, fullEnd, "FullEnd" );
  }

  return OperatingSystem;
} )();;/* global qp */
window.Primrose = window.Primrose || { };
window.Primrose.Point = ( function ( ) {
  "use strict";

  function Point ( x, y ) {
    this.set( x || 0, y || 0 );
  }

  Point.prototype.set = function ( x, y ) {
    this.x = x;
    this.y = y;
  };

  Point.prototype.copy = function ( p ) {
    if ( p ) {
      this.x = p.x;
      this.y = p.y;
    }
  };

  Point.prototype.clone = function () {
    return new Point( this.x, this.y );
  };

  Point.prototype.toString = function () {
    return fmt( "(x:$1, y:$2)", this.x, this.y );
  };

  return Point;
} )();;/*global qp*/
window.Primrose = window.Primrose || { };
window.Primrose.Rectangle = ( function ( ) {
  "use strict";

  function Rectangle ( x, y, width, height ) {
    this.point = new Primrose.Point( x, y );
    this.size = new Primrose.Size( width, height );

    Object.defineProperties( this, {
      x: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      left: {
        get: function () {
          return this.point.x;
        },
        set: function ( x ) {
          this.point.x = x;
        }
      },
      width: {
        get: function () {
          return this.size.width;
        },
        set: function ( width ) {
          this.size.width = width;
        }
      },
      right: {
        get: function () {
          return this.point.x + this.size.width;
        },
        set: function ( right ) {
          this.point.x = right - this.size.width;
        }
      },
      y: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      top: {
        get: function () {
          return this.point.y;
        },
        set: function ( y ) {
          this.point.y = y;
        }
      },
      height: {
        get: function () {
          return this.size.height;
        },
        set: function ( height ) {
          this.size.height = height;
        }
      },
      bottom: {
        get: function () {
          return this.point.y + this.size.height;
        },
        set: function ( bottom ) {
          this.point.y = bottom - this.size.height;
        }
      }
    } );
  }

  Rectangle.prototype.set = function ( x, y, width, height ) {
    this.point.set( x, y );
    this.size.set( width, height );
  };

  Rectangle.prototype.copy = function ( r ) {
    if ( r ) {
      this.point.copy( r.point );
      this.size.copy( r.size );
    }
  };

  Rectangle.prototype.clone = function () {
    return new Rectangle( this.point.x, this.point.y, this.size.width,
        this.size.height );
  };

  Rectangle.prototype.toString = function () {
    return fmt( "[$1 x $2]", this.point.toString(), this.size.toString() );
  };

  return Rectangle;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Rule = ( function ( ) {
  "use strict";

  function Rule ( name, test ) {
    this.name = name;
    this.test = test;
  }

  Rule.prototype.carveOutMatchedToken = function ( tokens, j ) {
    var token = tokens[j];
    if ( token.type === "regular" ) {
      var res = this.test.exec( token.value );
      if ( res ) {
        // Only use the last group that matches the regex, to allow for more
        // complex regexes that can match in special contexts, but not make
        // the context part of the token.
        var midx = res[res.length - 1];
        var start = res.index;
        // We skip the first record, because it's not a captured group, it's
        // just the entire matched text.
        for ( var k = 1; k < res.length - 1; ++k ) {
          start += res[k].length;
        }

        var end = start + midx.length;
        if ( start === 0 ) {
          // the rule matches the start of the token
          token.type = this.name;
          if ( end < token.value.length ) {
            // but not the end
            var next = token.splitAt( end );
            next.type = "regular";
            tokens.splice( j + 1, 0, next );
          }
        }
        else {
          // the rule matches from the middle of the token
          var mid = token.splitAt( start );
          if ( midx.length < mid.value.length ) {
            // but not the end
            var right = mid.splitAt( midx.length );
            tokens.splice( j + 1, 0, right );
          }
          mid.type = this.name;
          tokens.splice( j + 1, 0, mid );
        }
      }
    }
  };

  return Rule;
} )();;/* global qp */

window.Primrose = window.Primrose || { };
window.Primrose.Size = (function ( ) {
  "use strict";
  
  function Size ( width, height ) {
    this.set( width || 0, height || 0 );
  }

  Size.prototype.set = function ( width, height ) {
    this.width = width;
    this.height = height;
  };

  Size.prototype.copy = function ( s ) {
    if ( s ) {
      this.width = s.width;
      this.height = s.height;
    }
  };

  Size.prototype.clone = function () {
    return new Size( this.width, this.height );
  };

  Size.prototype.toString = function () {
    return fmt( "<w:$1, h:$2>", this.width, this.height );
  };

  return Size;
} )();;/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* global qp */

window.Primrose = window.Primrose || { };
window.Primrose.TextBox = ( function ( ) {
  "use strict";

  var EDITORS = [ ];

  function renderPump () {
    requestAnimationFrame( renderPump );
    for ( var i = 0; i < EDITORS.length; ++i ) {
      if ( EDITORS[i].drawText ) {
        EDITORS[i].drawText();
      }
    }
  }

  requestAnimationFrame( renderPump );

  function TextBox ( renderToElementOrID, options ) {
    var self = this;
    EDITORS.push( this );
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || { };
    if ( typeof options === "string" ) {
      options = { file: options };
    }

    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////
    var Renderer = options.renderer || Primrose.Renderers.Canvas,
        codePage,
        operatingSystem,
        browser,
        CommandSystem,
        keyboardSystem,
        commandPack,
        tokenizer,
        tokens,
        tokenRows,
        theme,
        pointer = new Primrose.Point(),
        lastPointer = new Primrose.Point(),
        tabWidth,
        tabString,
        currentTouchID,
        deadKeyState = "",
        keyNames = [ ],
        history = [ ],
        historyFrame = -1,
        gridBounds = new Primrose.Rectangle(),
        topLeftGutter = new Primrose.Size(),
        bottomRightGutter = new Primrose.Size(),
        dragging = false,
        scrolling = false,
        focused = false,
        changed = false,
        showLineNumbers = true,
        showScrollBars = true,
        wordWrap = false,
        wheelScrollSpeed = 0,
        renderer = new Renderer( renderToElementOrID, options ),
        surrogate = cascadeElement( "primrose-surrogate-textarea-" +
            renderer.id, "textarea", window.HTMLTextAreaElement ),
        surrogateContainer;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Primrose.Cursor();
    this.backCursor = new Primrose.Cursor();
    this.scroll = new Primrose.Point();


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function refreshTokens () {
      tokens = tokenizer.tokenize( self.value );
      self.drawText();
    }

    function clampScroll () {
      if ( self.scroll.y < 0 ) {
        self.scroll.y = 0;
      }
      else {
        while ( 0 < self.scroll.y &&
            self.scroll.y > tokenRows.length - gridBounds.height ) {
          --self.scroll.y;
        }
      }
    }

    function setSurrogateSize () {
      if ( theme ) {
        var bounds = renderer.getDOMElement()
            .getBoundingClientRect();
        surrogateContainer.style.left = px( bounds.left );
        surrogateContainer.style.top = px( window.scrollY + bounds.top );
        surrogateContainer.style.width = 0;
        surrogateContainer.style.height = 0;
        surrogate.style.fontFamily = theme.fontFamily;
        var ch = renderer.character.height / renderer.getPixelRatio();
        surrogate.style.fontSize = px( ch * 0.99 );
        surrogate.style.lineHeight = px( ch );
      }
    }

    function setCursorXY ( cursor, x, y ) {
      changed = true;
      pointer.set( x, y );
      renderer.pixel2cell( pointer, self.scroll, gridBounds );
      var gx = pointer.x - self.scroll.x;
      var gy = pointer.y - self.scroll.y;
      var onBottom = gy >= gridBounds.height;
      var onLeft = gx < 0;
      var onRight = pointer.x >= gridBounds.width;
      if ( !scrolling && !onBottom && !onLeft && !onRight ) {
        cursor.setXY( pointer.x, pointer.y, tokenRows );
        setSurrogateCursor();
        self.backCursor.copy( cursor );
      }
      else if ( scrolling || onRight && !onBottom ) {
        scrolling = true;
        var scrollHeight = tokenRows.length - gridBounds.height;
        if ( gy >= 0 && scrollHeight >= 0 ) {
          var sy = gy * scrollHeight / gridBounds.height;
          self.scroll.y = Math.floor( sy );
        }
      }
      else if ( onBottom && !onLeft ) {
        var maxWidth = 0;
        for ( var dy = 0; dy < tokenRows.length; ++dy ) {
          var tokenRow = tokenRows[dy];
          var width = 0;
          for ( var dx = 0; dx < tokenRow.length; ++dx ) {
            width += tokenRow[dx].value.length;
          }
          maxWidth = Math.max( maxWidth, width );
        }
        var scrollWidth = maxWidth - gridBounds.width;
        if ( gx >= 0 && scrollWidth >= 0 ) {
          var sx = gx * scrollWidth / gridBounds.width;
          self.scroll.x = Math.floor( sx );
        }
      }
      else if ( onLeft && !onBottom ) {
        // clicked in number-line gutter
      }
      else {
        // clicked in the lower-left corner
      }
      lastPointer.copy( pointer );
    }

    function fixCursor () {
      var moved = self.frontCursor.fixCursor( tokenRows ) ||
          self.backCursor.fixCursor( tokenRows );
      if ( moved ) {
        self.forceDraw();
      }
    }

    function pointerStart ( x, y ) {
      if ( options.pointerEventSource ) {
        self.focus();
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.startPointer( x - bounds.left, y - bounds.top );
      }
    }

    function pointerMove ( x, y ) {
      if ( options.pointerEventSource ) {
        var bounds =
            options.pointerEventSource.getBoundingClientRect();
        self.movePointer( x - bounds.left, y - bounds.top );
      }
    }

    function mouseButtonDown ( evt ) {
      if ( evt.button === 0 ) {
        pointerStart( evt.clientX, evt.clientY );
        evt.preventDefault();
      }
    }

    function mouseMove ( evt ) {
      if ( focused ) {
        pointerMove( evt.clientX, evt.clientY );
      }
    }

    function mouseButtonUp ( evt ) {
      if ( focused && evt.button === 0 ) {
        self.endPointer();
      }
    }

    function touchStart ( evt ) {
      if ( focused && evt.touches.length > 0 && !dragging ) {
        var t = evt.touches[0];
        pointerStart( t.clientX, t.clientY );
        currentTouchID = t.identifier;
      }
    }

    function touchMove ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          pointerMove( t.clientX, t.clientY );
          break;
        }
      }
    }

    function touchEnd ( evt ) {
      for ( var i = 0; i < evt.changedTouches.length && dragging; ++i ) {
        var t = evt.changedTouches[i];
        if ( t.identifier === currentTouchID ) {
          self.endPointer();
        }
      }
    }

    function refreshCommandPack () {
      if ( keyboardSystem && operatingSystem && CommandSystem ) {
        commandPack = new CommandSystem( operatingSystem, keyboardSystem,
            self );
      }
    }

    function makeCursorCommand ( name ) {
      var method = name.toLowerCase();
      self["cursor" + name] = function ( tokenRows, cursor ) {
        changed = true;
        cursor[method]( tokenRows );
        self.scrollIntoView( cursor );
      };
    }

    function performLayout () {
      var lineCountWidth;
      if ( showLineNumbers ) {
        lineCountWidth = Math.max( 1, Math.ceil( Math.log(
            self.getLineCount() ) / Math.LN10 ) );
        topLeftGutter.width = 1;
      }
      else {
        lineCountWidth = 0;
        topLeftGutter.width = 0;
      }

      if ( showScrollBars ) {
        if ( wordWrap ) {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 0 );
        }
        else {
          bottomRightGutter.set( renderer.VSCROLL_WIDTH, 1 );
        }
      }
      else {
        bottomRightGutter.set( 0, 0 );
      }

      var x = topLeftGutter.width + lineCountWidth,
          y = 0,
          w = Math.floor( self.getWidth() /
              renderer.character.width ) -
          x -
          bottomRightGutter.width,
          h = Math.floor( self.getHeight() /
              renderer.character.height ) -
          y -
          bottomRightGutter.height;
      gridBounds.set( x + 2, y, w - 2, h - 2 );
      var cw = renderer.character.width / renderer.getPixelRatio();
      var ch = renderer.character.height / renderer.getPixelRatio();
      surrogate.style.left = px( gridBounds.x * cw );
      surrogate.style.top = px( gridBounds.y * ch );
      surrogate.style.width = px( gridBounds.width * cw );
      surrogate.style.height = px( gridBounds.height * ch );

      // group the tokens into rows
      tokenRows = [ [ ] ];
      var currentRowWidth = 0;
      var tokenQueue = tokens.slice();
      for ( var i = 0; i < tokenQueue.length; ++i ) {
        var t = tokenQueue[i].clone();
        var widthLeft = gridBounds.width - currentRowWidth;
        var wrap = wordWrap && t.type !== "newlines" && t.value.length > widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if ( wrap ) {
          var split = t.value.length > gridBounds.width ? widthLeft : 0;
          tokenQueue.splice( i + 1, 0, t.splitAt( split ) );
        }

        if ( t.value.length > 0 ) {
          tokenRows[tokenRows.length - 1].push( t );
          currentRowWidth += t.value.length;
        }

        if ( breakLine ) {
          tokenRows.push( [ ] );
          currentRowWidth = 0;
        }
      }
      return lineCountWidth;
    }

    function setFalse ( evt ) {
      evt.returnValue = false;
    }

    function setSurrogateCursor () {
      surrogate.selectionStart = Math.min( self.frontCursor.i,
          self.backCursor.i );
      surrogate.selectionEnd = Math.max( self.frontCursor.i,
          self.backCursor.i );
    }

    function minDelta ( v, minV, maxV ) {
      var dvMinV = v - minV,
          dvMaxV = v - maxV + 5,
          dv = 0;
      if ( dvMinV < 0 || dvMaxV >= 0 ) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs( dvMinV ) < Math.abs( dvMaxV ) ? dvMinV : dvMaxV;
      }

      return dv;
    }

    function makeToggler ( id, value, lblTxt, funcName ) {
      var span = document.createElement( "span" );

      var check = document.createElement( "input" );
      check.type = "checkbox";
      check.checked = value;
      check.id = id;
      span.appendChild( check );

      var lbl = document.createElement( "label" );
      lbl.innerHTML = lblTxt + " ";
      lbl.for = id;
      span.appendChild( lbl );

      check.addEventListener( "change", function () {
        self[funcName]( check.checked );
      } );
      return span;
    }

    function makeSelectorFromObj ( id, obj, def, target, prop, lbl, filter ) {
      var elem = cascadeElement( id, "select", window.HTMLSelectElement );
      var items = [ ];
      for ( var key in obj ) {
        if ( obj.hasOwnProperty( key ) ) {
          var val = obj[key];
          if ( !filter || val instanceof filter ) {
            val = val.name || key;
            var opt = document.createElement( "option" );
            opt.innerHTML = val;
            items.push( obj[key] );
            if ( val === def ) {
              opt.selected = "selected";
            }
            elem.appendChild( opt );
          }
        }
      }

      if ( typeof target[prop] === "function" ) {
        elem.addEventListener( "change", function () {
          target[prop]( items[elem.selectedIndex] );
        } );
      }
      else {
        elem.addEventListener( "change", function () {
          target[prop] = items[elem.selectedIndex];
        } );
      }

      var container = cascadeElement( "container -" + id, "div",
          window.HTMLDivElement );
      var label = cascadeElement( "label-" + id, "span",
          window.HTMLSpanElement );
      label.innerHTML = lbl + ": ";
      label.for = elem;
      elem.title = lbl;
      elem.alt = lbl;
      container.appendChild( label );
      container.appendChild( elem );
      return container;
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    [ "Left", "Right",
      "SkipLeft", "SkipRight",
      "Up", "Down",
      "Home", "End",
      "FullHome", "FullEnd" ].map( makeCursorCommand.bind( this ) );

    this.addEventListener = function ( event, thunk ) {
      if ( event === "keydown" ) {
        options.keyEventSource.addEventListener( event, thunk );
      }
    };

    this.cursorPageUp = function ( tokenRows, cursor ) {
      changed = true;
      cursor.incY( -gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.cursorPageDown = function ( tokenRows, cursor ) {
      changed = true;
      cursor.incY( gridBounds.height, tokenRows );
      this.scrollIntoView( cursor );
    };

    this.getDOMElement = function () {
      return renderer.getDOMElement();
    };

    this.focus = function () {
      for ( var i = 0; i < EDITORS.length; ++i ) {
        var e = EDITORS[i];
        if ( e !== self ) {
          e.blur();
        }
      }
      surrogate.focus();
      focused = true;
      this.forceUpdate();
    };

    this.blur = function () {
      surrogate.blur();
      focused = false;
      this.forceUpdate();
    };

    this.isFocused = function () {
      return focused;
    };

    this.getRenderer = function () {
      return renderer;
    };

    this.setWheelScrollSpeed = function ( v ) {
      wheelScrollSpeed = v || 25;
    };

    this.getWheelScrollSpeed = function () {
      return wheelScrollSpeed;
    };

    this.setWordWrap = function ( v ) {
      wordWrap = v || false;
      this.forceUpdate();
    };

    this.getWordWrap = function () {
      return wordWrap;
    };

    this.setShowLineNumbers = function ( v ) {
      showLineNumbers = v;
      this.forceUpdate();
    };

    this.getShowLineNumbers = function () {
      return showLineNumbers;
    };

    this.setShowScrollBars = function ( v ) {
      showScrollBars = v;
      this.forceUpdate();
    };

    this.getShowScrollBars = function () {
      return showScrollBars;
    };

    this.setTheme = function ( t ) {
      theme = t || Primrose.Themes.Default;
      renderer.setTheme( theme );
      renderer.resize();
      changed = true;
      this.drawText();
    };

    this.getTheme = function () {
      return theme;
    };

    this.setDeadKeyState = function ( st ) {
      changed = true;
      deadKeyState = st || "";
    };

    this.setOperatingSystem = function ( os ) {
      changed = true;
      operatingSystem = os || ( isOSX ? Primrose.OperatingSystems.OSX :
          Primrose.OperatingSystems.Windows );
      refreshCommandPack();
    };

    this.getOperatingSystem = function () {
      return operatingSystem;
    };

    this.setCommandSystem = function ( cmd ) {
      changed = true;
      CommandSystem = cmd || Primrose.CommandPacks.TextEditor;
      refreshCommandPack();
    };

    this.setSize = function ( w, h ) {
      changed = renderer.setSize( w, h );
    };

    this.getWidth = function () {
      return renderer.getWidth();
    };

    this.getHeight = function () {
      return renderer.getHeight();
    };

    this.forceUpdate = function () {
      changed = true;
      this.drawText();
    };

    this.setCodePage = function ( cp ) {
      changed = true;
      var key,
          code,
          char,
          name;
      codePage = cp;
      if ( !codePage ) {
        var lang = ( navigator.languages && navigator.languages[0] ) ||
            navigator.language ||
            navigator.userLanguage ||
            navigator.browserLanguage;

        if ( !lang || lang === "en" ) {
          lang = "en-US";
        }

        for ( key in Primrose.CodePages ) {
          cp = Primrose.CodePages[key];
          if ( cp.language === lang ) {
            codePage = cp;
            break;
          }
        }

        if ( !codePage ) {
          codePage = Primrose.CodePages.EN_US;
        }
      }

      keyNames = [ ];
      for ( key in Primrose.Keys ) {
        code = Primrose.Keys[key];
        if ( !isNaN( code ) ) {
          keyNames[code] = key;
        }
      }

      keyboardSystem = { };
      for ( var type in codePage ) {
        var codes = codePage[type];
        if ( typeof ( codes ) === "object" ) {
          for ( code in codes ) {
            if ( code.indexOf( "_" ) > -1 ) {
              var parts = code.split( ' ' ),
                  browser = parts[0];
              code = parts[1];
              char = codePage.NORMAL[code];
              name = browser + "_" + type + " " + char;
            }
            else {
              char = codePage.NORMAL[code];
              name = type + "_" + char;
            }
            keyNames[code] = char;
            keyboardSystem[name] = codes[code];
          }
        }
      }

      refreshCommandPack();
    };

    this.getCodePage = function () {
      return codePage;
    };

    this.setTokenizer = function ( tk ) {
      changed = true;
      tokenizer = tk || Primrose.Grammars.JavaScript;
      if ( history && history.length > 0 ) {
        refreshTokens();
        if ( this.drawText ) {
          this.drawText();
        }
      }
    };

    this.getTokenizer = function () {
      return tokenizer;
    };

    this.getLines = function () {
      return history[historyFrame].slice();
    };

    this.getLineCount = function () {
      return history[historyFrame].length;
    };


    Object.defineProperties( this, {
      value: {
        get: function () {
          return history[historyFrame].join( "\n" );
        },
        set: function ( txt ) {
          txt = txt || "";
          txt = txt.replace( /\r\n/g, "\n" );
          var lines = txt.split( "\n" );
          this.pushUndo( lines );
          this.drawText();
          surrogate.value = txt;
          setSurrogateCursor();
        }
      },
      selectionStart: {
        get: function () {
          return this.frontCursor.i;
        },
        set: function ( i ) {
          this.frontCursor.setI( i, tokenRows );
        }
      },
      selectionEnd: {
        get: function () {
          return this.backCursor.i;
        },
        set: function ( i ) {
          this.backCursor.setI( i, tokenRows );
        }
      },
      selectionDirection:{
        get: function(){
          return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
        }
      }
    } );

    this.pushUndo = function ( lines ) {
      if ( historyFrame < history.length - 1 ) {
        history.splice( historyFrame + 1 );
      }
      history.push( lines );
      historyFrame = history.length - 1;
      refreshTokens();
      this.forceUpdate();
    };

    this.redo = function () {
      changed = true;
      if ( historyFrame < history.length - 1 ) {
        ++historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.undo = function () {
      changed = true;
      if ( historyFrame > 0 ) {
        --historyFrame;
      }
      refreshTokens();
      fixCursor();
    };

    this.setTabWidth = function ( tw ) {
      tabWidth = tw || 4;
      tabString = "";
      for ( var i = 0; i < tabWidth; ++i ) {
        tabString += " ";
      }
    };

    this.getTabWidth = function () {
      return tabWidth;
    };

    this.getTabString = function () {
      return tabString;
    };

    this.scrollIntoView = function ( currentCursor ) {
      this.scroll.y += minDelta( currentCursor.y, this.scroll.y,
          this.scroll.y + gridBounds.height );
      if ( !wordWrap ) {
        this.scroll.x += minDelta( currentCursor.x, this.scroll.x,
            this.scroll.x + gridBounds.width );
      }
      clampScroll();
    };

    this.increaseFontSize = function () {
      ++theme.fontSize;
      changed = renderer.resize();
    };

    this.decreaseFontSize = function () {
      if ( theme.fontSize > 1 ) {
        --theme.fontSize;
        changed = renderer.resize();
      }
    };

    this.setFontSize = function ( v ) {
      theme.fontSize = v;
      changed = renderer.resize();
    };

    this.cell2i = function ( x, y ) {
      var i = 0;
      for ( var dy = 0; dy < y; ++dy ) {
        var tokenRow = tokenRows[dy];
        for ( var dx = 0; dx < tokenRow.length; ++dx ) {
          i += tokenRow[dx].value.length;
        }
        ++i;
      }
      i += x;
      return i;
    };

    this.i2cell = function ( i ) {
      for ( var y = 0; y < tokenRows.length; ++y ) {
        var tokenRow = tokenRows[y];
        var rowWidth = 0;
        for ( var x = 0; x < tokenRow.length; ++x ) {
          rowWidth += tokenRow[x].value.length;
        }
        if ( i <= rowWidth ) {
          return { x: i, y: y };
        }
        else {
          i -= rowWidth - 1;
        }
      }
    };

    this.readWheel = function ( evt ) {
      this.scroll.y += Math.floor( evt.deltaY / wheelScrollSpeed );
      clampScroll();
      evt.preventDefault();
      this.forceUpdate();
    };

    this.startPicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.startPointer( p.x, p.y );
    };

    this.movePicking = function ( gl, x, y ) {
      var p = renderer.getPixelIndex( gl, x, y );
      this.movePointer( p.x, p.y );
    };

    this.startPointer = function ( x, y ) {
      setCursorXY( this.frontCursor, x, y );
      dragging = true;
      this.drawText();
    };

    this.movePointer = function ( x, y ) {
      if ( dragging ) {
        setCursorXY( this.backCursor, x, y );
        this.drawText();
      }
    };

    this.endPointer = function () {
      dragging = false;
      scrolling = false;
      surrogate.focus();
    };

    this.bindEvents = function ( k, p, w, c ) {
      if ( k ) {
        k.addEventListener( "keydown", this.editText.bind( this ) );
        surrogate.addEventListener( "beforecopy", setFalse );
        surrogate.addEventListener( "beforecut", setFalse );
        k.addEventListener( "beforepaste", setFalse );
      }

      if ( p ) {
        p.addEventListener( "wheel", this.readWheel.bind( this ) );
        p.addEventListener( "mousedown", mouseButtonDown );
        p.addEventListener( "mousemove", mouseMove );
        p.addEventListener( "mouseup", mouseButtonUp );
        p.addEventListener( "touchstart", touchStart );
        p.addEventListener( "touchmove", touchMove );
        p.addEventListener( "touchend", touchEnd );
      }

      if ( w ) {
        w.addEventListener( "wheel", this.readWheel.bind( this ) );
      }

      if ( c ) {
        surrogate.addEventListener( "copy", this.copySelectedText.bind(
            this ) );
        surrogate.addEventListener( "cut", this.cutSelectedText.bind( this ) );
        if ( k ) {
          k.addEventListener( "paste", this.readClipboard.bind( this ) );
        }
      }
    };

    this.overwriteText = function ( str ) {
      str = str || "";
      str = str.replace( /\r\n/g, "\n" );

      if ( this.frontCursor.i !== this.backCursor.i || str.length > 0 ) {
        var minCursor = Primrose.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.Cursor.max( this.frontCursor,
                this.backCursor ),
            // TODO: don't recalc the string first.
            text = this.value,
            left = text.substring( 0, minCursor.i ),
            right = text.substring( maxCursor.i );
        this.value = left + str + right;
        minCursor.advanceN( tokenRows, Math.max( 0, str.length ) );
        this.scrollIntoView( maxCursor );
        clampScroll();
        maxCursor.copy( minCursor );
        this.forceDraw();
      }
    };

    this.copySelectedText = function ( evt ) {
      evt.returnValue = false;
      if ( this.frontCursor.i !== this.backCursor.i ) {
        var minCursor = Primrose.Cursor.min( this.frontCursor,
            this.backCursor ),
            maxCursor = Primrose.Cursor.max( this.frontCursor,
                this.backCursor ),
            text = this.value,
            str = text.substring( minCursor.i, maxCursor.i );
        var clipboard = evt.clipboardData || window.clipboardData;
        clipboard.setData( window.clipboardData ? "Text" : "text/plain",
            str );
      }
      evt.preventDefault();
    };

    this.cutSelectedText = function ( evt ) {
      this.copySelectedText( evt );
      this.overwriteText();
      this.drawText();
    };

    this.readClipboard = function ( evt ) {
      evt.returnValue = false;
      var clipboard = evt.clipboardData || window.clipboardData,
          str = clipboard.getData( window.clipboardData ? "Text" :
              "text/plain" );
      if ( str ) {
        this.overwriteText( str );
      }
    };

    this.editText = function ( evt ) {
      if ( focused ) {
        evt = evt || event;

        var key = evt.keyCode;
        if ( key !== Primrose.Keys.CTRL && key !== Primrose.Keys.ALT && key !==
            Primrose.Keys.META_L &&
            key !== Primrose.Keys.META_R && key !== Primrose.Keys.SHIFT ) {
          var oldDeadKeyState = deadKeyState;

          var commandName = deadKeyState;

          if ( evt.ctrlKey ) {
            commandName += "CTRL";
          }
          if ( evt.altKey ) {
            commandName += "ALT";
          }
          if ( evt.metaKey ) {
            commandName += "META";
          }
          if ( evt.shiftKey ) {
            commandName += "SHIFT";
          }
          if ( commandName === deadKeyState ) {
            commandName += "NORMAL";
          }

          commandName += "_" + keyNames[key];

          var func = commandPack[browser + "_" + commandName] ||
              commandPack[commandName];
          if ( func ) {
            this.frontCursor.moved = false;
            this.backCursor.moved = false;
            func( self, tokenRows );
            if ( this.frontCursor.moved && !this.backCursor.moved ) {
              this.backCursor.copy( this.frontCursor );
            }
            clampScroll();
            evt.preventDefault();
          }

          if ( deadKeyState === oldDeadKeyState ) {
            deadKeyState = "";
          }
        }
        this.drawText();
      }
    };

    this.drawText = function () {
      if ( renderer.hasResized() ) {
        changed = renderer.resize();
        setSurrogateSize();
      }

      if ( changed ) {
        this.forceDraw();
      }
    };

    this.forceDraw = function () {
      if ( tokens ) {
        var lineCountWidth = performLayout();

        renderer.render(
            tokenRows,
            this.frontCursor, this.backCursor,
            gridBounds,
            this.scroll,
            focused, showLineNumbers, showScrollBars, wordWrap,
            lineCountWidth );

        setSurrogateCursor();

        changed = false;
      }
    };

    this.appendControls = function ( elem ) {
      elem.appendChild( this.lineNumberToggler );
      elem.appendChild( this.wordWrapToggler );
      elem.appendChild( this.scrollBarToggler );
      elem.appendChild( this.operatingSystemSelect );
      elem.appendChild( this.keyboardSelect );
      elem.appendChild( this.commandSystemSelect );
      elem.appendChild( this.tokenizerSelect );
      elem.appendChild( this.themeSelect );
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////

    //
    // different browsers have different sets of keycodes for less-frequently
    // used keys like.
    browser = isChrome ? "CHROMIUM" : ( isFirefox ? "FIREFOX" :
        ( isIE ?
            "IE" :
            ( isOpera ? "OPERA" : ( isSafari ? "SAFARI" :
                "UNKNOWN" ) ) ) );

    //
    // the `surrogate` textarea makes the soft-keyboard appear on mobile devices.
    surrogate.style.position = "absolute";
    surrogate.addEventListener( "blur", this.blur.bind( this ) );
    surrogateContainer = makeHidingContainer(
        "primrose-surrogate-textarea-container-" + renderer.id,
        surrogate );

    document.body.insertBefore( surrogateContainer,
        document.body.children[0] );

    if ( options.autoBindEvents || renderer.autoBindEvents ) {
      if ( !options.readOnly && options.keyEventSource === undefined ) {
        options.keyEventSource = surrogate;
      }
      if ( options.pointerEventSource === undefined ) {
        options.pointerEventSource = renderer.getDOMElement();
      }
      if ( options.wheelEventSource === undefined ) {
        options.wheelEventSource = renderer.getDOMElement();
      }
    }

    this.setWheelScrollSpeed( options.wheelScrollSpeed );
    this.setWordWrap( !options.disableWordWrap );
    this.setShowLineNumbers( !options.hideLineNumbers );
    this.setShowScrollBars( !options.hideScrollBars );
    this.setTabWidth( options.tabWidth );
    this.setTheme( options.theme );
    this.setFontSize( options.fontSize || 14 );
    this.setTokenizer( options.tokenizer );
    this.setCodePage( options.codePage );
    this.setOperatingSystem( options.os );
    this.setCommandSystem( options.commands );
    this.value = options.file;

    this.bindEvents(
        options.keyEventSource,
        options.pointerEventSource,
        options.wheelEventSource,
        !options.disableClipboard );

    this.lineNumberToggler = makeToggler( "primrose-line-number-toggler-" +
        renderer.id, !options.hideLineNumbers, "Line numbers",
        "setShowLineNumbers" );
    this.wordWrapToggler = makeToggler( "primrose-word-wrap-toggler-" +
        renderer.id, !options.disableWordWrap, "Line wrap", "setWordWrap" );
    this.scrollBarToggler = makeToggler( "primrose-scrollbar-toggler-" +
        renderer.id, !options.hideScrollBars, "Scroll bars",
        "setShowScrollBars" );
    this.themeSelect = makeSelectorFromObj( "primrose-theme-selector-" +
        renderer.id, Primrose.Themes, theme.name, self, "setTheme", "theme" );
    this.commandSystemSelect = makeSelectorFromObj(
        "primrose-command-system-selector-" + renderer.id, Primrose.Commands,
        CommandSystem.name, self, "setCommandSystem",
        "Command system" );
    this.tokenizerSelect = makeSelectorFromObj(
        "primrose-tokenizer-selector-" +
        renderer.id, Primrose.Grammars, tokenizer.name, self, "setTokenizer",
        "Language syntax", Primrose.Grammar );
    this.keyboardSelect = makeSelectorFromObj(
        "primrose-keyboard-selector-" +
        renderer.id, Primrose.CodePages, codePage.name, self, "setCodePage",
        "Localization", Primrose.CodePage );
    this.operatingSystemSelect = makeSelectorFromObj(
        "primrose-operating-system-selector-" + renderer.id,
        Primrose.OperatingSystems, operatingSystem.name, self,
        "setOperatingSystem",
        "Shortcut style", Primrose.OperatingSystem );
    setSurrogateSize();
  }

  return TextBox;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Token = ( function () {
  "use strict";
  function Token ( value, type, index, line ) {
    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  Token.prototype.clone = function () {
    return new Token( this.value, this.type, this.index, this.line );
  };

  Token.prototype.splitAt = function ( i ) {
    var next = this.value.substring( i );
    this.value = this.value.substring( 0, i );
    return new Token( next, this.type, this.index + i, this.line );
  };

  Token.prototype.toString = function(){
    return fmt("[$1: $2]", this.type, this.value);
  };

  return Token;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.CodePages = window.Primrose.CodePages || {};
window.Primrose.CodePages.DE_QWERTZ = (function () {
  "use strict";
  var CodePage = Primrose.CodePage;
  return new CodePage("Deutsch: QWERTZ", "de", {
    deadKeys: [220, 221, 160, 192],
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "60": "<",
      "63": "ß",
      "160": CodePage.DEAD(3),
      "163": "#",
      "171": "+",
      "173": "-",
      "186": "ü",
      "187": "+",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "#",
      "192": CodePage.DEAD(4),
      "219": "ß",
      "220": CodePage.DEAD(1),
      "221": CodePage.DEAD(2),
      "222": "ä",
      "226": "<"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û",
      "190": "."
    },
    DEAD2NORMAL: {
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "83": "s",
      "85": "ú",
      "89": "ý"
    },
    SHIFT: {
      "48": "=",
      "49": "!",
      "50": "\"",
      "51": "§",
      "52": "$",
      "53": "%",
      "54": "&",
      "55": "/",
      "56": "(",
      "57": ")",
      "60": ">",
      "63": "?",
      "163": "'",
      "171": "*",
      "173": "_",
      "186": "Ü",
      "187": "*",
      "188": ";",
      "189": "_",
      "190": ":",
      "191": "'",
      "192": "Ö",
      "219": "?",
      "222": "Ä",
      "226": ">"
    },
    CTRLALT: {
      "48": "}",
      "50": "²",
      "51": "³",
      "55": "{",
      "56": "[",
      "57": "]",
      "60": "|",
      "63": "\\",
      "69": "€",
      "77": "µ",
      "81": "@",
      "171": "~",
      "187": "~",
      "219": "\\",
      "226": "|"
    },
    CTRLALTSHIFT: {
      "63": "ẞ",
      "219": "ẞ"
    },
    DEAD3NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "85": "u",
      "190": "."
    },
    DEAD4NORMAL: {
      "65": "a",
      "69": "e",
      "73": "i",
      "79": "o",
      "83": "s",
      "85": "u",
      "89": "y"
    }
  });
})();;window.Primrose = window.Primrose || { };
window.Primrose.CodePages = window.Primrose.CodePages || {};
window.Primrose.CodePages.EN_UKX = (function () {
  "use strict";
  var CodePage = Primrose.CodePage;
  return new CodePage("English: UK Extended", "en-GB", {
    CTRLALT: {
      "52": "€",
      "65": "á",
      "69": "é",
      "73": "í",
      "79": "ó",
      "85": "ú",
      "163": "\\",
      "192": "¦",
      "222": "\\",
      "223": "¦"
    },
    CTRLALTSHIFT: {
      "65": "Á",
      "69": "É",
      "73": "Í",
      "79": "Ó",
      "85": "Ú",
      "222": "|"
    },
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "163": "#",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "192": "'",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "#",
      "223": "`"
    }, SHIFT: {
      "48": ")",
      "49": "!",
      "50": "\"",
      "51": "£",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "163": "~",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "192": "@",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "~",
      "223": "¬"
    }
  });
})();;window.Primrose = window.Primrose || { };
window.Primrose.CodePages = window.Primrose.CodePages || {};
window.Primrose.CodePages.EN_US = (function () {
  "use strict";
  var CodePage = Primrose.CodePage;
  return new CodePage("English: USA", "en-US", {
    NORMAL: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "59": ";",
      "61": "=",
      "173": "-",
      "186": ";",
      "187": "=",
      "188": ",",
      "189": "-",
      "190": ".",
      "191": "/",
      "219": "[",
      "220": "\\",
      "221": "]",
      "222": "'"
    },
    SHIFT: {
      "48": ")",
      "49": "!",
      "50": "@",
      "51": "#",
      "52": "$",
      "53": "%",
      "54": "^",
      "55": "&",
      "56": "*",
      "57": "(",
      "59": ":",
      "61": "+",
      "173": "_",
      "186": ":",
      "187": "+",
      "188": "<",
      "189": "_",
      "190": ">",
      "191": "?",
      "219": "{",
      "220": "|",
      "221": "}",
      "222": "\""
    }
  });
})();;window.Primrose = window.Primrose || { };
window.Primrose.CodePages = window.Primrose.CodePages || { };
window.Primrose.CodePages.FR_AZERTY = ( function () {
  "use strict";
  var CodePage = Primrose.CodePage;
  return new CodePage( "Français: AZERTY", "fr", {
    deadKeys: [ 221, 50, 55 ],
    NORMAL: {
      "48": "à",
      "49": "&",
      "50": "é",
      "51": "\"",
      "52": "'",
      "53": "(",
      "54": "-",
      "55": "è",
      "56": "_",
      "57": "ç",
      "186": "$",
      "187": "=",
      "188": ",",
      "190": ";",
      "191": ":",
      "192": "ù",
      "219": ")",
      "220": "*",
      "221": CodePage.DEAD( 1 ),
      "222": "²",
      "223": "!",
      "226": "<"
    },
    SHIFT: {
      "48": "0",
      "49": "1",
      "50": "2",
      "51": "3",
      "52": "4",
      "53": "5",
      "54": "6",
      "55": "7",
      "56": "8",
      "57": "9",
      "186": "£",
      "187": "+",
      "188": "?",
      "190": ".",
      "191": "/",
      "192": "%",
      "219": "°",
      "220": "µ",
      "223": "§",
      "226": ">"
    },
    CTRLALT: {
      "48": "@",
      "50": CodePage.DEAD( 2 ),
      "51": "#",
      "52": "{",
      "53": "[",
      "54": "|",
      "55": CodePage.DEAD( 3 ),
      "56": "\\",
      "57": "^",
      "69": "€",
      "186": "¤",
      "187": "}",
      "219": "]"
    },
    DEAD1NORMAL: {
      "65": "â",
      "69": "ê",
      "73": "î",
      "79": "ô",
      "85": "û"
    },
    DEAD2NORMAL: {
      "65": "ã",
      "78": "ñ",
      "79": "õ"
    },
    DEAD3NORMAL: {
      "48": "à",
      "50": "é",
      "55": "è",
      "65": "à",
      "69": "è",
      "73": "ì",
      "79": "ò",
      "85": "ù"
    }
  } );
} )();;// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
window.Primrose = window.Primrose || { };
window.Primrose.CommandPacks = window.Primrose.CommandPacks || { };
window.Primrose.CommandPacks.TextEditor = ( function () {
  "use strict";

  return {
    name: "Basic commands",
    NORMAL_SPACE: " ",
    SHIFT_SPACE: " ",
    NORMAL_BACKSPACE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.left( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
      var indent = "";
      var tokenRow = tokenRows[prim.frontCursor.y];
      if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
        indent = tokenRow[0].value;
      }
      prim.overwriteText( "\n" + indent );
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.backCursor.right( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    SHIFT_DELETE: function ( prim, tokenRows ) {
      if ( prim.frontCursor.i === prim.backCursor.i ) {
        prim.frontCursor.home( tokenRows );
        prim.backCursor.end( tokenRows );
      }
      prim.overwriteText();
      prim.scrollIntoView( prim.frontCursor );
    },
    NORMAL_TAB: function ( prim, tokenRows ) {
      var ts = prim.getTabString();
      prim.overwriteText( ts );
    }
  };
} )();;// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front.
// If SHIFT is held, then "back"
window.Primrose = window.Primrose || { };
window.Primrose.CommandPacks = window.Primrose.CommandPacks || { };
window.Primrose.CommandPacks.TextEditor = ( function () {
  "use strict";

  function TextEditor ( operatingSystem, codePage, editor ) {
    var commands = {
      NORMAL_SPACE: " ",
      SHIFT_SPACE: " ",
      NORMAL_BACKSPACE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.left( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_ENTER: function ( prim, tokenRows, currentToken ) {
        var indent = "";
        var tokenRow = tokenRows[prim.frontCursor.y];
        if ( tokenRow.length > 0 && tokenRow[0].type === "whitespace" ) {
          indent = tokenRow[0].value;
        }
        prim.overwriteText( "\n" + indent );
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.backCursor.right( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      SHIFT_DELETE: function ( prim, tokenRows ) {
        if ( prim.frontCursor.i === prim.backCursor.i ) {
          prim.frontCursor.home( tokenRows );
          prim.backCursor.end( tokenRows );
        }
        prim.overwriteText();
        prim.scrollIntoView( prim.frontCursor );
      },
      NORMAL_TAB: function ( prim, tokenRows ) {
        var ts = prim.getTabString();
        prim.overwriteText( ts );
      }
    };

    var allCommands = { };

    copyObject( allCommands, codePage );
    copyObject( allCommands, operatingSystem );
    copyObject( allCommands, commands );

    for ( var key in allCommands ) {
      if ( allCommands.hasOwnProperty( key ) ) {
        var func = allCommands[key];
        if ( typeof func !== "function" ) {
          func = editor.overwriteText.bind( editor, func );
        }
        allCommands[key] = func;
      }
    }

    Primrose.CommandPack.call( this, "Text editor commands", allCommands );
  }
  inherit( TextEditor, Primrose.CommandPack );
  return TextEditor;
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.Basic = ( function ( ) {

  var grammar = new Primrose.Grammar( "BASIC", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "lineNumbers", /^\d+\s+/ ],
    [ "comments", /^REM.*$/ ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK)\b/
    ],
    [ "keywords", /^DEF FN/ ],
    [ "operators",
      /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/
    ],
    [ "identifiers", /\w+\$?/ ]
  ] );

  var oldTokenize = grammar.tokenize;
  grammar.tokenize = function ( code ) {
    return oldTokenize.call( this, code.toUpperCase( ) );
  };

  grammar.interpret = function ( sourceCode, input, output, errorOut, next,
      clearScreen, loadFile, done ) {
    var tokens = this.tokenize( sourceCode ),
        EQUAL_SIGN = new Primrose.Token( "=", "operators" ),
        counter = 0,
        isDone = false,
        program = { },
        lineNumbers = [ ],
        currentLine = [ ],
        lines = [ currentLine ],
        data = [ ],
        returnStack = [ ],
        forLoopCounters = { },
        dataCounter = 0,
        state = {
          INT: function ( v ) {
            return v | 0;
          },
          RND: function ( ) {
            return Math.random( );
          },
          CLK: function ( ) {
            return Date.now( ) / 3600000;
          },
          LINE: function ( ) {
            return lineNumbers[counter];
          },
          TAB: function ( v ) {
            var str = "";
            for ( var i = 0; i < v; ++i ) {
              str += " ";
            }
            return str;
          },
          POW: function ( a, b ) {
            return Math.pow( a, b );
          }
        };

    function toNum ( ln ) {
      return new Primrose.Token( ln.toString(), "numbers" );
    }

    function toStr ( str ) {
      return new Primrose.Token( "\"" + str.replace( "\n", "\\n" )
          .replace( "\"", "\\\"" ) + "\"", "strings" );
    }

    var tokenMap = {
      "OR": "||",
      "AND": "&&",
      "NOT": "!",
      "MOD": "%",
      "<>": "!="
    };

    while ( tokens.length > 0 ) {
      var token = tokens.shift( );
      if ( token.type === "newlines" ) {
        currentLine = [ ];
        lines.push( currentLine );
      }
      else if ( token.type !== "regular" && token.type !== "comments" ) {
        token.value = tokenMap[token.value] || token.value;

        if ( token.type === "identifiers" &&
            token.value[token.value.length - 1] === "$" &&
            tokens[0].type === "operators" &&
            tokens[0].value === "(" ) {
          tokens[0].value = "[";
          for ( var j = 1; j < tokens.length; ++j ) {
            if ( tokens[j].type === "operators" && tokens[j].value ===
                ")" ) {
              tokens[j].value = "]";
              break;
            }
          }
        }

        currentLine.push( token );
      }
    }

    for ( var i = 0; i < lines.length; ++i ) {
      var line = lines[i];
      if ( line.length > 0 ) {
        var lastLine = lineNumbers[lineNumbers.length - 1];
        var lineNumber = line.shift( );

        if ( lineNumber.type !== "lineNumbers" ) {
          line.unshift( lineNumber );

          if ( lastLine === undefined ) {
            lastLine = -1;
          }

          lineNumber = toNum( lastLine + 1 );
        }

        lineNumber = parseFloat( lineNumber.value );
        if ( lastLine && lineNumber <= lastLine ) {
          throw new Error( "expected line number greater than " + lastLine +
              ", but received " + lineNumber + "." );
        }
        else if ( line.length > 0 ) {
          lineNumbers.push( lineNumber );
          program[lineNumber] = line;
        }
      }
    }


    function process ( line ) {
      var op;
      try {
        if ( line && line.length > 0 ) {
          op = line.shift( );
          if ( op ) {
            if ( commands.hasOwnProperty( op.value ) ) {
              return commands[op.value]( line );
            }
            else if ( isNumber( op.value ) ) {
              return setProgramCounter( [ op ] );
            }
            else if ( state[op.value] ||
                ( line.length > 0 && line[0].type === "operators" &&
                    line[0].value === "=" ) ) {
              line.unshift( op );
              return setValue( line );
            }
            else {
              error( "Unknown command. >>> " + op.value );
            }
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
        if ( op ) {
          console.log( op.toString() );
        }
        error( exp.message );
      }
      return pauseBeforeComplete();
    }

    function error ( msg ) {
      errorOut( "At line " + lineNumbers[counter] + ": " + msg );
    }

    function getLine ( i ) {
      var lineNumber = lineNumbers[i];
      var line = program[lineNumber];
      return line && line.slice( );
    }

    function evaluate ( line ) {
      var script = line.map( function ( token ) {
        return token.value;
      } )
          .join( " " );
      with ( state ) {
        try {
          return eval( script );
        }
        catch ( exp ) {
          console.debug( line.join( ", " ) );
          console.error( exp );
          console.error( script );
          error( exp.message + ": " + script );
        }
      }
    }

    function declareVariable ( line ) {
      var id = line.shift( );
      if ( id.type !== "identifiers" ) {
        error( "Identifier expected: " + id.value );
      }
      else {
        var val = null;
        id = id.value;
        if ( id[id.length - 1] === "$" ) {
          val = [ ];
          if ( line.length === 3 &&
              line[0].type === "operators" && line[0].value === "(" &&
              line[1].type === "numbers" &&
              line[2].type === "operators" && line[2].value === ")" ) {
            for ( var i = Math.floor( parseFloat( line[1].value ) ); i > 0;
                --i ) {
              val.push( null );
            }
          }
        }
        state[id] = val;
        return true;
      }
    }

    function setValue ( line ) {
      var name = line.shift( );
      var equals = line.shift( );
      var val = null;
      if ( name.type !== "identifiers" ) {
        error( "Identifier expected. >>> " + name.value );
      }
      else if ( equals.type === "operators" && equals.value === "=" ) {
        val = evaluate( line );
        state[name.value] = val;
      }
      else if ( equals.type === "operators" && equals.value === "[" ) {
        var idxExpr = [ ];
        while ( line.length > 0 && line[0].type !== "operators" &&
            line[0].value !== "]" ) {
          idxExpr.push( line.shift( ) );
        }
        if ( line.length > 0 ) {
          line.shift( ); // burn the close paren
          equals = line.shift( );
          if ( equals.type === "operators" && equals.value === "=" ) {
            val = evaluate( line );
            state[name.value][evaluate( idxExpr )] = val;
          }
        }
      }
      else {
        error( "Expected equals sign. >>> " + equals.value );
      }

      return true;
    }

    function print ( line ) {
      var endLine = "\n";
      var nest = 0;
      line = line.map( function ( t, i ) {
        t = t.clone();
        if ( t.type === "operators" ) {
          if ( t.value === "," ) {
            if ( nest === 0 ) {
              t.value = "+ \", \" + ";
            }
          }
          else if ( t.value === ";" ) {
            t.value = "+ \" \"";
            if ( i < line.length - 1 ) {
              t.value += " + ";
            }
            else {
              endLine = "";
            }
          }
          else if ( t.value === "(" ) {
            ++nest;
          }
          else if ( t.value === ")" ) {
            --nest;
          }
        }
        return t;
      } );
      var txt = evaluate( line );
      if ( txt === undefined ) {
        txt = "";
      }
      output( txt + endLine );
      return true;
    }

    function setProgramCounter ( line ) {
      var lineNumber = parseFloat( evaluate( line ) );
      counter = -1;
      while ( counter < lineNumbers.length - 1 &&
          lineNumbers[counter + 1] < lineNumber ) {
        ++counter;
      }

      return true;
    }

    function checkConditional ( line ) {
      var thenIndex = -1,
          elseIndex = -1,
          i;
      for ( i = 0; i < line.length; ++i ) {
        if ( line[i].type === "keywords" && line[i].value === "THEN" ) {
          thenIndex = i;
        }
        else if ( line[i].type === "keywords" && line[i].value === "ELSE" ) {
          elseIndex = i;
        }
      }
      if ( thenIndex === -1 ) {
        error( "Expected THEN clause." );
      }
      else {
        var condition = line.slice( 0, thenIndex );
        for ( i = 0; i < condition.length; ++i ) {
          var t = condition[i];
          if ( t.type === "operators" && t.value === "=" ) {
            t.value = "==";
          }
        }
        var thenClause,
            elseClause;
        if ( elseIndex === -1 ) {
          thenClause = line.slice( thenIndex + 1 );
        }
        else {
          thenClause = line.slice( thenIndex + 1, elseIndex );
          elseClause = line.slice( elseIndex + 1 );
        }
        if ( evaluate( condition ) ) {
          return process( thenClause );
        }
        else if ( elseClause ) {
          return process( elseClause );
        }
      }

      return true;
    }

    function pauseBeforeComplete () {
      output( "PROGRAM COMPLETE - PRESS RETURN TO FINISH." );
      input( function ( ) {
        isDone = true;
        if ( done ) {
          done( );
        }
      } );
      return false;
    }

    function labelLine ( line ) {
      line.push( EQUAL_SIGN );
      line.push( toNum( lineNumbers[counter] ) );
      return setValue( line );
    }

    function waitForInput ( line ) {
      var toVar = line.pop();
      if ( line.length > 0 ) {
        print( line );
      }
      input( function ( str ) {
        str = str.toUpperCase();
        var valueToken = null;
        if ( isNumber( str ) ) {
          valueToken = toNum( str );
        }
        else {
          valueToken = toStr( str );
        }
        setValue( [ toVar, EQUAL_SIGN, valueToken ] );
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function onStatement ( line ) {
      var idxExpr = [ ],
          idx = null,
          targets = [ ];
      try {
        while ( line.length > 0 &&
            ( line[0].type !== "keywords" ||
                line[0].value !== "GOTO" ) ) {
          idxExpr.push( line.shift( ) );
        }

        if ( line.length > 0 ) {
          line.shift( ); // burn the goto;

          for ( var i = 0; i < line.length; ++i ) {
            var t = line[i];
            if ( t.type !== "operators" ||
                t.value !== "," ) {
              targets.push( t );
            }
          }

          idx = evaluate( idxExpr ) - 1;

          if ( 0 <= idx && idx < targets.length ) {
            return setProgramCounter( [ targets[idx] ] );
          }
        }
      }
      catch ( exp ) {
        console.error( exp );
      }
      return true;
    }

    function gotoSubroutine ( line ) {
      returnStack.push( toNum( lineNumbers[counter + 1] ) );
      return setProgramCounter( line );
    }

    function setRepeat ( ) {
      returnStack.push( toNum( lineNumbers[counter] ) );
      return true;
    }

    function conditionalReturn ( cond ) {
      var ret = true;
      var val = returnStack.pop();
      if ( val && cond ) {
        ret = setProgramCounter( [ val ] );
      }
      return ret;
    }

    function untilLoop ( line ) {
      var cond = !evaluate( line );
      return conditionalReturn( cond );
    }

    function findNext ( str ) {
      for ( i = counter + 1; i < lineNumbers.length; ++i ) {
        var l = getLine( i );
        if ( l[0].value === str ) {
          return i;
        }
      }
      return lineNumbers.length;
    }

    function whileLoop ( line ) {
      var cond = evaluate( line );
      if ( !cond ) {
        counter = findNext( "WEND" );
      }
      else {
        returnStack.push( toNum( lineNumbers[counter] ) );
      }
      return true;
    }

    var FOR_LOOP_DELIMS = [ "=", "TO", "STEP" ];

    function forLoop ( line ) {
      var n = lineNumbers[counter];
      var varExpr = [ ];
      var fromExpr = [ ];
      var toExpr = [ ];
      var skipExpr = [ ];
      var arrs = [ varExpr, fromExpr, toExpr, skipExpr ];
      var a = 0;
      var i = 0;
      for ( i = 0; i < line.length; ++i ) {
        var t = line[i];
        if ( t.value === FOR_LOOP_DELIMS[a] ) {
          if ( a === 0 ) {
            varExpr.push( t );
          }
          ++a;
        }
        else {
          arrs[a].push( t );
        }
      }

      var skip = 1;
      if ( skipExpr.length > 0 ) {
        skip = evaluate( skipExpr );
      }

      if ( forLoopCounters[n] === undefined ) {
        forLoopCounters[n] = evaluate( fromExpr );
      }

      var end = evaluate( toExpr );
      var cond = forLoopCounters[n] <= end;
      if ( !cond ) {
        delete forLoopCounters[n];
        counter = findNext( "NEXT" );
      }
      else {
        varExpr.push( toNum( forLoopCounters[n] ) );
        process( varExpr );
        forLoopCounters[n] += skip;
        returnStack.push( toNum( lineNumbers[counter] ) );
      }
      return true;
    }

    function stackReturn ( ) {
      return conditionalReturn( true );
    }

    function loadCodeFile ( line ) {
      loadFile( evaluate( line ), function ( ) {
        if ( next ) {
          next( );
        }
      } );
      return false;
    }

    function noop ( ) {
      return true;
    }

    function loadData ( line ) {
      while ( line.length > 0 ) {
        var t = line.shift();
        if ( t.type !== "operators" ) {
          data.push( t.value );
        }
      }
      return true;
    }

    function readData ( line ) {
      if ( data.length === 0 ) {
        var dataLine = findNext( "DATA" );
        process( getLine( dataLine ) );
      }
      var value = data[dataCounter];
      ++dataCounter;
      line.push( EQUAL_SIGN );
      line.push( toNum( value ) );
      return setValue( line );
    }

    function restoreData () {
      dataCounter = 0;
      return true;
    }

    function defineFunction ( line ) {
      var name = line.shift().value;
      var signature = "";
      var body = "";
      var fillSig = true;
      for ( var i = 0; i < line.length; ++i ) {
        var t = line[i];
        if ( t.type === "operators" && t.value === "=" ) {
          fillSig = false;
        }
        else if ( fillSig ) {
          signature += t.value;
        }
        else {
          body += t.value;
        }
      }
      name = "FN" + name;
      var script = "(function " + name + signature + "{ return " + body +
          "; })";
      state[name] = eval( script );
      return true;
    }

    var commands = {
      DIM: declareVariable,
      LET: setValue,
      PRINT: print,
      GOTO: setProgramCounter,
      IF: checkConditional,
      INPUT: waitForInput,
      END: pauseBeforeComplete,
      STOP: pauseBeforeComplete,
      REM: noop,
      "'": noop,
      CLS: clearScreen,
      ON: onStatement,
      GOSUB: gotoSubroutine,
      RETURN: stackReturn,
      LOAD: loadCodeFile,
      DATA: loadData,
      READ: readData,
      RESTORE: restoreData,
      REPEAT: setRepeat,
      UNTIL: untilLoop,
      "DEF FN": defineFunction,
      WHILE: whileLoop,
      WEND: stackReturn,
      FOR: forLoop,
      NEXT: stackReturn,
      LABEL: labelLine
    };

    return function ( ) {
      if ( !isDone ) {
        var goNext = true;
        while (goNext){
          var line = getLine( counter );
          goNext = process( line );
          ++counter;
        }
      }
    };
  };
  return grammar;
} )( );;window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.JavaScript = ( function () {
  "use strict";

  return new Primrose.Grammar( "JavaScript", [
    [ "newlines", /(?:\r\n|\r|\n)/ ],
    [ "comments", /\/\/.*$/ ],
    [ "startBlockComments", /\/\*/ ],
    [ "endBlockComments", /\*\// ],
    [ "strings", /"(?:\\"|[^"])*"/ ],
    [ "strings", /'(?:\\'|[^'])*'/ ],
    [ "strings", /\/(?:\\\/|[^/])*\/\w*/ ],
    [ "numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/ ],
    [ "keywords",
      /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/
    ],
    [ "functions", /(\w+)(?:\s*\()/ ],
    [ "members", /(?:(?:\w+\.)+)(\w+)/ ]
  ] );
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.PlainText = (function () {
  "use strict";

  return new Primrose.Grammar("PlainText", [
    ["newlines", /(?:\r\n|\r|\n)/]
  ]);
})();;window.Primrose = window.Primrose || { };
window.Primrose.Grammars = window.Primrose.Grammars || { };
window.Primrose.Grammars.TestResults = (function () {
  "use strict";

  return new Primrose.Grammar("TestResults", [
    ["newlines", /(?:\r\n|\r|\n)/, true],
    ["numbers", /(\[)(o+)/, true],
    ["numbers", /(\d+ succeeded), 0 failed/, true],
    ["numbers", /^    Successes:/, true],
    ["functions", /(x+)\]/, true],
    ["functions", /[1-9]\d* failed/, true],
    ["functions", /^    Failures:/, true],
    ["comments", /(\d+ms:)(.*)/, true],
    ["keywords", /(Test results for )(\w+):/, true],
    ["strings", /        \w+/, true]
  ]);
})();;// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
window.Primrose = window.Primrose || { };
window.Primrose.OperatingSystems = window.Primrose.OperatingSystems || { };
window.Primrose.OperatingSystems.OSX = ( function () {
  "use strict";

  return new Primrose.OperatingSystem(
      "OS X", "META", "ALT", "METASHIFT_z",
      "META", "LEFTARROW", "RIGHTARROW",
      "META", "UPARROW", "DOWNARROW" );
} )();;// cut, copy, and paste commands are events that the browser manages,
// so we don't have to include handlers for them here.
window.Primrose = window.Primrose || { };
window.Primrose.OperatingSystems = window.Primrose.OperatingSystems || {};
window.Primrose.OperatingSystems.Windows = (function () {
  "use strict";

  return new Primrose.OperatingSystem(
      "Windows", "CTRL", "CTRL", "CTRL_y",
      "", "HOME", "END",
      "CTRL", "HOME", "END");
})();
;/*global THREE, qp*/

window.Primrose = window.Primrose || { };
window.Primrose.Renderers = window.Primrose.Renderers || { };
window.Primrose.Renderers.Canvas = ( function ( ) {
  "use strict";

  return function ( canvasElementOrID, options ) {
    var self = this,
        canvas = cascadeElement( canvasElementOrID, "canvas",
            window.HTMLCanvasElement ),
        bgCanvas = cascadeElement( canvas.id + "-back", "canvas",
            window.HTMLCanvasElement ),
        fgCanvas = cascadeElement( canvas.id + "-front", "canvas",
            window.HTMLCanvasElement ),
        trimCanvas = cascadeElement( canvas.id + "-trim", "canvas",
            window.HTMLCanvasElement ),
        gfx = canvas.getContext( "2d" ),
        fgfx = fgCanvas.getContext( "2d" ),
        bgfx = bgCanvas.getContext( "2d" ),
        tgfx = trimCanvas.getContext( "2d" ),
        theme = null,
        texture = null,
        pickingTexture = null,
        pickingPixelBuffer = null,
        strictSize = options.size;

    this.VSCROLL_WIDTH = 2;

    this.character = new Primrose.Size();
    this.id = canvas.id;
    this.autoBindEvents = true;

    this.setTheme = function ( t ) {
      theme = t;
    };

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      var r = this.getPixelRatio();
      var x = point.x * canvas.width / canvas.clientWidth;
      var y = point.y * canvas.height / canvas.clientHeight;
      point.set(
          Math.round( x * r / this.character.width ) + scroll.x - gridBounds.x,
          Math.floor( ( y * r / this.character.height ) - 0.25 ) + scroll.y );
    };

    this.hasResized = function () {
      var r = this.getPixelRatio(),
          oldWidth = canvas.width,
          oldHeight = canvas.height,
          newWidth = canvas.clientWidth * r,
          newHeight = canvas.clientHeight * r;
      return oldWidth !== newWidth || oldHeight !== newHeight;
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var r = this.getPixelRatio(),
            oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            oldWidth = canvas.width,
            oldHeight = canvas.height,
            newWidth = ( strictSize && strictSize.width ) ||
            ( canvas.clientWidth * r ),
            newHeight = ( strictSize && strictSize.height ) ||
            ( canvas.clientHeight * r ),
            oldFont = gfx.font;
        this.character.height = theme.fontSize * r;
        gfx.font = this.character.height + "px " + theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( newWidth > 0 && newHeight > 0 ) {
          bgCanvas.width =
              fgCanvas.width =
              trimCanvas.width =
              canvas.width = newWidth;
          bgCanvas.height =
              fgCanvas.height =
              trimCanvas.height =
              canvas.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      return this.resize();
    };

    this.getWidth = function () {
      return canvas.width;
    };

    this.getHeight = function () {
      return canvas.height;
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, frontCursor, backCursor,
        gridBounds, scroll, focused ) {
      var minCursor = Primrose.Cursor.min( frontCursor, backCursor ),
          maxCursor = Primrose.Cursor.max( frontCursor, backCursor ),
          tokenFront = new Primrose.Cursor(),
          tokenBack = new Primrose.Cursor(),
          clearFunc = theme.regular.backColor ? "fillRect" : "clearRect";

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
      }

      bgfx[clearFunc]( 0, 0, canvas.width, canvas.height );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            Primrose.Themes.Default.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Primrose.Cursor.max( minCursor,
                  tokenFront );
              var selectionBack = Primrose.Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  Primrose.Themes.Default.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect( bgfx, cc, minCursor.x, minCursor.y, w, 1 );
        fillRect( bgfx, cc, maxCursor.x, maxCursor.y, w, 1 );
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll ) {
      var tokenFront = new Primrose.Cursor(),
          tokenBack = new Primrose.Cursor(),
          maxLineWidth = 0;

      fgfx.clearRect( 0, 0, canvas.width, canvas.height );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];
        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            var style = theme[t.type] || { };
            var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                " " + self.character.height + "px " + theme.fontFamily;
            fgfx.font = font.trim();
            fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
            fgfx.fillText(
                t.value,
                tokenFront.x * self.character.width,
                ( y + 1 ) * self.character.height );
          }

          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }
      fgfx.restore();
      return maxLineWidth;
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, maxLineWidth ) {
      tgfx.clearRect( 0, 0, canvas.width, canvas.height );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      if ( showLineNumbers ) {
        for ( var y = scroll.y,
            lastLine = -1; y < scroll.y + gridBounds.height && y <
            tokenRows.length; ++y ) {
          // draw the tokens on this row
          var row = tokenRows[y];
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              Primrose.Themes.Default.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, ( y + 1 ) * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            Primrose.Themes.Default.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              canvas.width - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      if ( theme ) {
        var maxLineWidth = 0;

        renderCanvasBackground( tokenRows, frontCursor, backCursor, gridBounds,
            scroll, focused );
        maxLineWidth = renderCanvasForeground( tokenRows, gridBounds, scroll );
        renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers,
            showScrollBars, wordWrap, lineCountWidth, maxLineWidth );

        gfx.clearRect( 0, 0, canvas.width, canvas.height );
        gfx.drawImage( bgCanvas, 0, 0 );
        gfx.drawImage( fgCanvas, 0, 0 );
        gfx.drawImage( trimCanvas, 0, 0 );

        if ( texture ) {
          texture.needsUpdate = true;
        }
      }
    };

    this.getDOMElement = function () {
      return canvas;
    };

    this.getTexture = function ( anisotropy ) {
      if ( typeof window.THREE !== "undefined" && !texture ) {
        texture = new THREE.Texture( canvas );
        texture.anisotropy = anisotropy || 8;
        texture.needsUpdate = true;
      }
      return texture;
    };

    this.getPickingTexture = function () {
      if ( !pickingTexture ) {
        var c = document.createElement( "canvas" ),
            w = this.getWidth(),
            h = this.getHeight();
        c.width = w;
        c.height = h;

        var gfx = c.getContext( "2d" ),
            pixels = gfx.createImageData( w, h );

        for ( var i = 0,
            p = 0,
            l = w * h; i < l; ++i, p += 4 ) {
          pixels.data[p] = ( 0xff0000 & i ) >> 16;
          pixels.data[p + 1] = ( 0x00ff00 & i ) >> 8;
          pixels.data[p + 2] = ( 0x0000ff & i ) >> 0;
          pixels.data[p + 3] = 0xff;
        }
        gfx.putImageData( pixels, 0, 0 );
        pickingTexture = new THREE.Texture( c, THREE.UVMapping,
            THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.NearestFilter,
            THREE.NearestMipMapNearestFilter, THREE.RGBAFormat,
            THREE.UnsignedByteType, 0 );
        pickingTexture.needsUpdate = true;
      }
      return pickingTexture;
    };

    this.getPixelRatio = function () {
      return window.devicePixelRatio || 1;
    };

    this.getPixelIndex = function ( gl, x, y ) {
      if ( !pickingPixelBuffer ) {
        pickingPixelBuffer = new Uint8Array( 4 );
      }

      gl.readPixels( x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE,
          pickingPixelBuffer );

      var i = ( pickingPixelBuffer[0] << 16 ) |
          ( pickingPixelBuffer[1] << 8 ) |
          ( pickingPixelBuffer[2] << 0 );
      return { x: i % canvas.clientWidth, y: i / canvas.clientWidth };
    };


    if ( !( canvasElementOrID instanceof window.HTMLCanvasElement ) &&
        strictSize ) {
      canvas.style.position = "absolute";
      canvas.style.width = strictSize.width;
      canvas.style.height = strictSize.height;
    }

    if ( !canvas.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          canvas.id, canvas ) );
    }
  };
} )();;/*global THREE, qp*/

window.Primrose = window.Primrose || { };
window.Primrose.Renderers = window.Primrose.Renderers || { };
window.Primrose.Renderers.DOM = ( function ( ) {
  "use strict";
  
  var Size = Primrose.Size,
      Cursor = Primrose.Cursor,
      defaultTheme = Primrose.Themes.Default;

  function FakeContext ( target ) {
    var self = this;
    this.font = null;
    this.fillStyle = null;
    var translate = [ new Point() ];

    function setFont(elem){
      elem.style.font = self.font;
      elem.style.lineHeight = px(parseInt(self.font, 10));
      elem.style.padding = "0";
      elem.style.margin = "0";
    }

    this.measureText = function ( txt ) {
      var tester = document.createElement( "div" );
      setFont(tester);
      tester.style.position = "absolute";
      tester.style.visibility = "hidden";
      tester.innerHTML = txt;
      document.body.appendChild( tester );
      var size = new Size( tester.clientWidth, tester.clientHeight );
      document.body.removeChild( tester );
      return size;
    };

    this.clearRect = function(){
        target.innerHTML = "";
    };

    this.drawImage = function(img, x, y){
      var top = translate[translate.length - 1];
      img.style.position = "absolute";
      img.style.left = px(x + top.x);
      img.style.top = px(y + top.y);
      target.appendChild(img);
    };

    this.fillRect = function ( x, y, w, h ) {
      var top = translate[translate.length - 1];
      var box = document.createElement( "div" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x);
      box.style.top = px( y + top.y );
      box.style.width = px( w );
      box.style.height = px( h );
      box.style.backgroundColor = this.fillStyle;
      target.appendChild( box );
    };

    this.fillText = function(str, x, y){
      var top = translate[translate.length - 1];
      var box = document.createElement( "span" );
      box.style.position = "absolute";
      box.style.left = px( x + top.x );
      box.style.top = px( y + top.y );
      setFont(box);
      box.style.color = this.fillStyle;
      box.appendChild(document.createTextNode(str));
      target.appendChild( box );
    };

    this.save = function () {
      var top = translate[translate.length - 1];
      translate.push(top.clone());
    };

    this.restore = function(){
      translate.pop();
    };

    this.translate = function(x, y){
      var top = translate[translate.length - 1];
      top.x += x;
      top.y += y;
    };
  }

  window.HTMLDivElement.prototype.getContext = function ( type ) {
    if ( type !== "2d" ) {
      throw new Exception( "type parameter needs to be '2d'." );
    }
    this.style.width = pct(100);
    this.style.height = pct(100);
    return new FakeContext( this );
  };

  return function ( domElementOrID, options ) {
    var self = this,
        div = cascadeElement( domElementOrID, "div",
            window.HTMLDivElement ),
        bgDiv = cascadeElement( div.id + "-back", "div",
            window.HTMLDivElement ),
        fgDiv = cascadeElement( div.id + "-front", "div",
            window.HTMLDivElement ),
        trimDiv = cascadeElement( div.id + "-trim", "div",
            window.HTMLDivElement ),
        gfx = div.getContext( "2d" ),
        fgfx = fgDiv.getContext( "2d" ),
        bgfx = bgDiv.getContext( "2d" ),
        tgfx = trimDiv.getContext( "2d" ),
        theme = null,
        oldWidth = null,
        oldHeight = null;

    this.VSCROLL_WIDTH = 2;

    this.character = new Size();
    this.id = div.id;
    this.autoBindEvents = true;

    this.setTheme = function ( t ) {
      theme = t;
    };

    this.pixel2cell = function ( point, scroll, gridBounds ) {
      point.set(
          Math.round( point.x / this.character.width ) + scroll.x -
          gridBounds.x,
          Math.floor( ( point.y / this.character.height ) - 0.25 ) +
          scroll.y );
    };

    this.hasResized = function () {
      var newWidth = div.clientWidth,
          newHeight = div.clientHeight;
      return oldWidth !== newWidth || oldHeight !== newHeight;
    };

    this.resize = function () {
      var changed = false;
      if ( theme ) {
        var oldCharacterWidth = this.character.width,
            oldCharacterHeight = this.character.height,
            newWidth = div.clientWidth,
            newHeight = div.clientHeight,
            oldFont = gfx.font;
        this.character.height = theme.fontSize;
        gfx.font = px( this.character.height ) + " " + theme.fontFamily;

        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = gfx.measureText(
            "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM" ).width /
            100;
        changed = oldCharacterWidth !== this.character.width ||
            oldCharacterHeight !== this.character.height ||
            oldFont !== gfx.font;

        if ( newWidth > 0 && newHeight > 0 ) {
          bgDiv.width =
              fgDiv.width =
              trimDiv.width = newWidth;
          bgDiv.height =
              fgDiv.height =
              trimDiv.height = newHeight;

          changed = changed ||
              oldWidth !== newWidth ||
              oldHeight !== newWidth;

          oldWidth = newWidth;
          oldHeight = newHeight;
        }
      }
      return changed;
    };

    this.setSize = function ( w, h ) {
      div.style.width = px( w );
      div.style.height = px( h );
      return this.resize();
    };

    this.getWidth = function () {
      return oldWidth;
    };

    this.getHeight = function () {
      return oldHeight;
    };

    function fillRect ( gfx, fill, x, y, w, h ) {
      gfx.fillStyle = fill;
      gfx.fillRect(
          x * self.character.width,
          y * self.character.height,
          w * self.character.width + 1,
          h * self.character.height + 1 );
    }

    function renderCanvasBackground ( tokenRows, frontCursor, backCursor,
        gridBounds, scroll, focused ) {
      var minCursor = Cursor.min( frontCursor, backCursor ),
          maxCursor = Cursor.max( frontCursor, backCursor ),
          tokenFront = new Cursor(),
          tokenBack = new Cursor();

      if ( theme.regular.backColor ) {
        bgfx.fillStyle = theme.regular.backColor;
        bgDiv.style.backgroundColor = theme.regular.backColor;
      }

      bgfx.clearRect( 0, 0, oldWidth, oldHeight );
      bgfx.save();
      bgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );


      // draw the current row highlighter
      if ( focused ) {
        fillRect( bgfx, theme.regular.currentRowBackColor ||
            defaultTheme.regular.currentRowBackColor,
            0, minCursor.y + 0.2,
            gridBounds.width, maxCursor.y - minCursor.y + 1 );
      }

      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];

        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i <
                maxCursor.i;
            if ( inSelection ) {
              var selectionFront = Cursor.max( minCursor, tokenFront );
              var selectionBack = Cursor.min( maxCursor, tokenBack );
              var cw = selectionBack.i - selectionFront.i;
              fillRect( bgfx, theme.regular.selectedBackColor ||
                  defaultTheme.regular.selectedBackColor,
                  selectionFront.x, selectionFront.y + 0.2,
                  cw, 1 );
            }
          }

          tokenFront.copy( tokenBack );
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }

      // draw the cursor caret
      if ( focused ) {
        var cc = theme.cursorColor || "black";
        var w = 1 / self.character.width;
        fillRect(bgfx, cc, minCursor.x, minCursor.y, w, 1);
        fillRect(bgfx, cc, maxCursor.x, maxCursor.y, w, 1);
      }
      bgfx.restore();
    }

    function renderCanvasForeground ( tokenRows, gridBounds, scroll ) {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          maxLineWidth = 0;

      fgfx.clearRect( 0, 0, oldWidth, oldHeight );
      fgfx.save();
      fgfx.translate( ( gridBounds.x - scroll.x ) * self.character.width,
          -scroll.y * self.character.height );
      for ( var y = 0; y < tokenRows.length; ++y ) {
        // draw the tokens on this row
        var row = tokenRows[y];
        for ( var i = 0; i < row.length; ++i ) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if ( scroll.y <= y && y < scroll.y + gridBounds.height &&
              scroll.x <= tokenBack.x && tokenFront.x < scroll.x +
              gridBounds.width ) {

            // draw the text
            var style = theme[t.type] || { };
            var font = ( style.fontWeight || theme.regular.fontWeight || "" ) +
                " " + ( style.fontStyle || theme.regular.fontStyle || "" ) +
                " " + self.character.height + "px " + theme.fontFamily;
            fgfx.font = font.trim();
            fgfx.fillStyle = style.foreColor || theme.regular.foreColor;
            fgfx.fillText(
                t.value,
                tokenFront.x * self.character.width,
                y * self.character.height );
          }

          tokenFront.copy( tokenBack );
        }

        maxLineWidth = Math.max( maxLineWidth, tokenBack.x );
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy( tokenFront );
      }
      fgfx.restore();
      return maxLineWidth;
    }

    function renderCanvasTrim ( tokenRows, gridBounds, scroll, showLineNumbers,
        showScrollBars, wordWrap, lineCountWidth, maxLineWidth ) {
      tgfx.clearRect( 0, 0, oldWidth, oldHeight );
      tgfx.save();
      tgfx.translate( 0, -scroll.y * self.character.height );
      if ( showLineNumbers ) {
        for ( var y = scroll.y,
            lastLine = -1; y < scroll.y + gridBounds.height && y <
            tokenRows.length; ++y ) {
          // draw the tokens on this row
          var row = tokenRows[y];
          // be able to draw brand-new rows that don't have any tokens yet
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while ( lineNumber.length < lineCountWidth ) {
            lineNumber = " " + lineNumber;
          }
          fillRect( tgfx,
              theme.regular.selectedBackColor ||
              defaultTheme.regular.selectedBackColor,
              0, y + 0.2,
              gridBounds.x, 1 );
          tgfx.font = "bold " + self.character.height + "px " +
              theme.fontFamily;

          if ( currentLine > lastLine ) {
            tgfx.fillStyle = theme.regular.foreColor;
            tgfx.fillText(
                lineNumber,
                0, y * self.character.height );
          }
          lastLine = currentLine;
        }
      }

      tgfx.restore();

      // draw the scrollbars
      if ( showScrollBars ) {
        var drawWidth = gridBounds.width * self.character.width;
        var drawHeight = gridBounds.height * self.character.height;
        var scrollX = ( scroll.x * drawWidth ) / maxLineWidth + gridBounds.x *
            self.character.width;
        var scrollY = ( scroll.y * drawHeight ) / tokenRows.length +
            gridBounds.y * self.character.height;

        tgfx.fillStyle = theme.regular.selectedBackColor ||
            defaultTheme.regular.selectedBackColor;
        // horizontal
        if ( !wordWrap && maxLineWidth > gridBounds.width ) {
          var scrollBarWidth = drawWidth * ( gridBounds.width / maxLineWidth );
          tgfx.fillRect(
              scrollX,
              ( gridBounds.height + 0.25 ) * self.character.height,
              Math.max( self.character.width, scrollBarWidth ),
              self.character.height );
        }

        //vertical
        if ( tokenRows.length > gridBounds.height ) {
          var scrollBarHeight = drawHeight * ( gridBounds.height /
              tokenRows.length );
          tgfx.fillRect(
              oldWidth - self.VSCROLL_WIDTH * self.character.width,
              scrollY,
              self.VSCROLL_WIDTH * self.character.width,
              Math.max( self.character.height, scrollBarHeight ) );
        }
      }
    }

    this.render = function ( tokenRows,
        frontCursor, backCursor,
        gridBounds,
        scroll,
        focused, showLineNumbers, showScrollBars, wordWrap,
        lineCountWidth ) {
      var maxLineWidth = 0;

      renderCanvasBackground( tokenRows, frontCursor, backCursor, gridBounds,
          scroll, focused );
      maxLineWidth = renderCanvasForeground( tokenRows, gridBounds, scroll );
      renderCanvasTrim( tokenRows, gridBounds, scroll, showLineNumbers,
          showScrollBars, wordWrap, lineCountWidth, maxLineWidth );

      gfx.clearRect( 0, 0, oldWidth, oldHeight );
      gfx.drawImage( bgDiv, 0, 0 );
      gfx.drawImage( fgDiv, 0, 0 );
      gfx.drawImage( trimDiv, 0, 0 );
    };

    this.getDOMElement = function () {
      return div;
    };

    this.getPixelRatio = function () {
      return 1;
    };

    if ( !( domElementOrID instanceof window.HTMLDivElement ) &&
        options.width && options.height ) {
      div.style.position = "absolute";
      div.style.width = options.width;
      div.style.height = options.height;
    }

    if ( !div.parentElement ) {
      this.autoBindEvents = false;
      document.body.appendChild( makeHidingContainer(
          "primrose-container-" +
          div.id, div ) );
    }
  };
} );;window.Primrose = window.Primrose || { };
window.Primrose.Themes = window.Primrose.Themes || { };
window.Primrose.Themes.Dark = ( function ( ) {
  "use strict";
  return {
    name: "Dark",
    fontFamily: "monospace",
    cursorColor: "white",
    fontSize: 14,
    lineNumbers: {
      foreColor: "white"
    },
    regular: {
      backColor: "black",
      foreColor: "#c0c0c0",
      currentRowBackColor: "#202020",
      selectedBackColor: "#404040"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "yellow",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "cyan"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();;window.Primrose = window.Primrose || { };
window.Primrose.Themes = window.Primrose.Themes || { };
window.Primrose.Themes.Default = ( function ( ) {
  "use strict";
  return {
    name: "Light",
    fontFamily: "monospace",
    cursorColor: "black",
    fontSize: 14,
    regular: {
      backColor: "white",
      foreColor: "black",
      currentRowBackColor: "#f0f0f0",
      selectedBackColor: "#c0c0c0"
    },
    strings: {
      foreColor: "#aa9900",
      fontStyle: "italic"
    },
    numbers: {
      foreColor: "green"
    },
    comments: {
      foreColor: "grey",
      fontStyle: "italic"
    },
    keywords: {
      foreColor: "blue"
    },
    functions: {
      foreColor: "brown",
      fontWeight: "bold"
    },
    members: {
      foreColor: "green"
    },
    error: {
      foreColor: "red",
      fontStyle: "underline italic"
    }
  };
} )();Primrose.VERSION = "v0.11.4";