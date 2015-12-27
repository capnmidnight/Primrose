/* global Primrose, THREE, fireAll */

Primrose.Button = ( function () {
  function Button ( model, name, options ) {
    this.options = combineDefaults( options, Button );
    this.options.minDeflection = Math.cos( this.options.minDeflection );
    this.options.colorUnpressed = new THREE.Color( this.options.colorUnpressed );
    this.options.colorPressed = new THREE.Color( this.options.colorPressed );

    this.listeners = {click: [ ], release: [ ]};
    this.base = model.children[1];
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.material = this.cap.material.clone();
    this.cap.button = this;
    this.cap.base = this.base;
    this.container = new THREE.Object3D();
    this.container.add( this.base );
    this.container.add( this.cap );
    this.color = this.cap.material.color;
    this.name = name;
    this.element = null;
  }

  Button.DEFAULTS = {
    maxThrow: 0.1,
    minDeflection: 10,
    colorUnpressed: 0x7f0000,
    colorPressed: 0x007f00,
    toggle: true,
    minDistance: 2
  };

  Button.prototype.addEventListener = function ( event, func ) {
    if ( this.listeners[event] ) {
      this.listeners[event].push( func );
    }
  };

  Button.prototype.focus = function ( ) {
    this.focused = true;
  };

  Button.prototype.blur = function ( ) {
    this.focused = false;
  };

  Button.prototype.startPointer = function () {
    this.color.copy( this.options.colorPressed );
    if ( this.element ) {
      this.element.click();
    }
    else {
      fireAll.call( this, "click" );
    }
  };

  Button.prototype.movePointer = function () {

  };

  Button.prototype.endPointer = function () {
    this.color.copy( this.options.colorUnpressed );
    fireAll.call( this, "release" );
  };

  var NUMBER_PATTERN = "\\s*([+-]?(?:(?:\\d+(?:\\.\\d*)?)|(?:\\.\\d+)))(?:em|px)?\\s*",
      TRANSLATE_PATTERN = new RegExp( "translate3d\\s*\\(" +
          NUMBER_PATTERN + "," +
          NUMBER_PATTERN + "," +
          NUMBER_PATTERN + "\\)", "i" );

  Button.prototype.copyElement = function ( elem ) {
    this.element = elem;
    if ( elem.style.transform ) {
      var transMatch = elem.style.transform.match( TRANSLATE_PATTERN );
      if ( transMatch ) {
        this.position.set(
            parseFloat( transMatch[1] ),
            parseFloat( transMatch[2] ),
            parseFloat( transMatch[3] ) );
      }
    }
  };

  Object.defineProperties( Button.prototype, {
    position: {
      get: function () {
        return this.container.position;
      }
    }} );

  return Button;
} )();
