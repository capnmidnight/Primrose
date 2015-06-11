/* global Primrose, THREE */

Primrose.Button = ( function () {
  function Button ( model, name, options ) {
    this.options = combineDefaults( options, Button );
    this.options.minDeflection = Math.cos( this.options.minDeflection );
    this.options.colorUnpressed = new THREE.Color(
        this.options.colorUnpressed );
    this.options.colorPressed = new THREE.Color( this.options.colorPressed );

    this.listeners = { click: [ ] };
    this.cap = model.children[0];
    this.cap.name = name;
    this.cap.isSolid = true;
    this.cap.material = this.cap.material.clone();
    this.color = this.cap.material.color;
    this.base = model.children[1];
    this.name = name;
    this.toggle = false;
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

  Button.prototype.fire = function () {
    for ( var i = 0; i < this.listeners.click.length; ++i ) {
      this.listeners.click[i].call( this );
    }
  };

  Button.prototype.moveBy = function(x, y, z){
    this.base.position.x += x;
    this.base.position.y += y;
    this.base.position.z += z;
    this.cap.physics.position.x += x;
    this.cap.physics.position.y += y;
    this.cap.physics.position.z += z;
  };

  Button.prototype.readContacts = function ( contacts ) {
    this.wasPressed = this.pressed;
    this.pressed = false;

    for ( var i = 0; i < contacts.length; ++i ) {
      var contact = contacts[i];
      if ( contact.bi.graphics === this.cap || contact.bj.graphics === this.cap ) {
        this.pressed = true;
        break;
      }
    }

    if ( this.pressed && !this.wasPressed ) {
      if ( this.toggle ) {
        this.value = !this.value;
      }
      else {
        this.value = this.pressed;
      }
    }
    else if ( !this.toggle && !this.pressed ) {
      this.value = false;
    }

    if ( this.value ) {
      this.fire();
      this.color.copy( this.options.colorPressed );
    }
    else {
      this.color.copy( this.options.colorUnpressed );
    }
  };

  return Button;
} )();
