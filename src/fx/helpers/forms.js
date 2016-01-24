/* global pliny */

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

pliny.issue( "", {
  name: "document helpers/forms",
  type: "open",
  description: "Finish writing the documentation for the [forms](#forms) class in the helpers/ directory"
} );
