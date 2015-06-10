/* global Primrose */

function clearKeyOption ( evt ) {
  this.value = "";
  this.dataset.keycode = "";
}

function setKeyOption ( outElem, elemArr, evt ) {
  this.dataset.keycode = evt.keyCode;
  this.value = this.value || Primrose.Text.Keys[evt.keyCode];
  this.value = this.value.toLocaleLowerCase()
      .replace( "arrow", "" );
  this.blur( );
  var text = elemArr.map( function ( e ) {
    return e.value.toLocaleUpperCase();
  } )
      .join( ", " );
  if ( text.length === 10 ) {
    text = text.replace( /, /g, "" );
  }
  outElem.innerHTML = text;
}

function setupKeyOption ( outElem, elemArr, index, char, code ) {
  var elem = elemArr[index];
  elem.value = char.toLocaleLowerCase( );
  elem.dataset.keycode = code;
  elem.addEventListener( "keydown", clearKeyOption );
  elem.addEventListener( "keyup", setKeyOption.bind( elem, outElem, elemArr ) );
}
