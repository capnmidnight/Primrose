/* global Primrose, THREE, fireAll */

Primrose.Button = ( function () {
  function Button ( model, name, options, toggle ) {
    this.options = combineDefaults( options, Button );
    this.options.minDeflection = Math.cos( this.options.minDeflection );
    this.options.colorUnpressed = new THREE.Color( this.options.colorUnpressed );
    this.options.colorPressed = new THREE.Color( this.options.colorPressed );

    this.listeners = {click: [ ]};
    this.base = model.children[1];
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.material = this.cap.material.clone();
    this.cap.button = this;
    this.cap.base = this.base;
    this.color = this.cap.material.color;
    this.name = name;
    this.toggle = toggle;
    this.value = false;
    this.pressed = false;
    this.wasPressed = false;
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

  Button.prototype.moveBy = function ( x, y, z ) {
    this.base.position.x += x;
    this.base.position.y += y;
    this.base.position.z += z;
    this.cap.position.x += x;
    this.cap.position.y += y;
    this.cap.position.z += z;
  };

  Button.prototype.activate = function ( press ) {
    this.wasPressed = this.pressed;
    this.pressed = press;
    
    if ( this.pressed ) {
      fireAll.call( this, "click" );
      this.color.copy( this.options.colorPressed );
    }
    else {
      this.color.copy( this.options.colorUnpressed );
    }
  };

  return Button;
} )();
