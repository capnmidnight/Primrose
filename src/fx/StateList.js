/* global Primrose, HTMLSelectElement */
Primrose.StateList = ( function () {
  /*
   * The StateList is a set of objects that can be mapped to DOM elements
   * in such a way to alter their state. The UI presents a drop down list
   * and the select action changes the various controls as the state set
   * dictates. It's a way of streamlining the altering of UI state by select
   * list.
   *
   * States take the form of:
   * { name: "A string for display", values: [
   *      {
   *          ctrlName1: {attributeName1: value1, attributeName2: value2 },
   *          ctrlName2: {attributeName3: value3, attributeName4: value4 }
   *      |]}
   *
   *  The states paramareter should be an array of such objects
   */
  function StateList ( id, ctrls, states, callback, parent ) {
    var select = cascadeElement( id, "select", HTMLSelectElement );
    for ( var i = 0; i < states.length; ++i ) {
      var opt = document.createElement( "option" );
      opt.appendChild( document.createTextNode( states[i].name ) );
      select.appendChild( opt );
    }
    select.addEventListener( "change", function () {
      var values = states[select.selectedIndex].values;
      if ( values !== undefined ) {
        for ( var id in values ) {
          if ( values.hasOwnProperty( id ) ) {
            var attrs = values[id];
            for ( var attr in attrs ) {
              if ( attrs.hasOwnProperty( attr ) ) {
                ctrls[id][attr] = attrs[attr];
              }
            }
          }
        }
        if ( callback ) {
          callback();
        }
      }
    }.bind( this ), false );
    this.DOMElement = select;
    if ( parent ) {
      parent.appendChild( this.DOMElement );
    }
  }

  return StateList;
} )();
