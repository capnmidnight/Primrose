/* global Primrose, THREE */

Primrose.Button = ( function () {
  function Button ( model, name, options ) {
    this.options = combineDefaults( options, Button );
    this.options.minDeflection = Math.cos( this.options.minDeflection );
    this.options.colorUnpressed = new THREE.Color(
        this.options.colorUnpressed );
    this.options.colorPressed = new THREE.Color( this.options.colorPressed );

    this.listeners = { click: [ ] };
    this.base = model;
    this.position = this.base.position;
    this.rotation = this.base.rotation;
    this.name = name;
    this.toggle = false;
    this.value = false;
    this.pressed = false;
    this.wasPressed = false;
    this.direction = new THREE.Vector3();
    this.testPoint = new THREE.Vector3();
    this.raycaster = new THREE.Raycaster( this.testPoint, this.direction, 0,
        1 );

    for ( var i = 0; i < this.base.children.length && !this.cap; ++i ) {
      var obj = this.base.children[i];
      if ( obj instanceof THREE.Object3D ) {
        for ( var j = 0; j < obj.children.length && !this.cap; ++j ) {
          var subObj = obj.children[j];
          if ( subObj.material ) {
            for ( var k = 0; k < subObj.material.materials.length && !this.cap;
                ++k ) {
              var m = subObj.material.materials[k];
              if ( m.name === "button" ) {
                this.cap = obj;
                this.cap.name = name;
                this.rest = this.cap.position.clone();
              }
            }
          }
        }
      }
    }
    if ( this.cap ) {
      var capMesh = this.cap.children[0];
      capMesh.material = capMesh.material.clone();
      this.color = capMesh.material.materials[0].color;
    }
    else {
      throw new Error( fmt( "Couldn't find a cap for the button [$1: $2].",
          this.base.name, name ) );
    }
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

  Button.prototype.test = function ( cameraPosition, pointer ) {
    var tag = null;
    this.wasPressed = this.pressed;
    this.pressed = false;
    this.cap.position.y = this.rest.y;

    var len = this.direction.copy( this.cap.position )
        .add( this.position )
        .sub( pointer.position )
        .length();
    if ( len <= this.options.minDistance ) {
      this.testPoint.copy( pointer.position )
          .sub( cameraPosition )
          .normalize();

      this.direction.copy( this.cap.position )
          .add( this.position )
          .sub( cameraPosition )
          .normalize();
      var dot = this.direction.dot( this.testPoint );
      if ( this.options.minDeflection < dot ) {
        this.testPoint.copy( pointer.position );
        this.testPoint.y += this.options.minDistance;
        this.direction.set( 0, -1, 0 );
        this.raycaster.ray.origin.copy( this.testPoint );
        this.raycaster.ray.direction.copy( this.direction );
        this.raycaster.far = this.options.minDistance * 2;
        var intersections = this.raycaster.intersectObject(
            this.cap.children[0] );
        if ( intersections.length > 0 ) {
          var inter = intersections[0];
          this.testPoint.copy( inter.face.normal );
          this.testPoint.applyEuler( this.base.rotation );
          dot = this.testPoint.dot( pointer.velocity );
          if ( dot < 0 ) {
            var y = inter.point.y;
            var proportion = Math.max( 0, Math.min( this.options.maxThrow, y -
                pointer.position.y ) / this.options.maxThrow );
            this.touched = proportion > 0;
            this.cap.position.y = this.rest.y - proportion *
                this.options.maxThrow;
            this.pressed = proportion === 1;
            tag = inter.point;
          }
        }
      }
    }

    var fire = function () {
      for ( var i = 0; i < this.listeners.click.length; ++i ) {
        this.listeners.click[i].call( this );
      }
    }.bind( this );

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
      fire();
      this.color.copy( this.options.colorPressed );
    }
    else {
      this.color.copy( this.options.colorUnpressed );
    }
    return tag;
  };
  return Button;
} )();
