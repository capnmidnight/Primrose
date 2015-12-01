/* global Primrose, THREE */

Primrose.ModelLoader = ( function () {
  if ( typeof ( THREE ) === "undefined" ) {
    return function () {
    };
  }
  var JSON;

  if ( THREE.ObjectLoader ) {
    JSON = new THREE.ObjectLoader();
  }

  function fixJSONScene ( json ) {
    json.traverse( function ( obj ) {
      if ( obj.geometry ) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
      }
    } );
    return json;
  }

  function buildScene ( success, scene ) {
    scene.buttons = [ ];
    scene.traverse( function ( child ) {
      if ( child.isButton ) {
        scene.buttons.push(
            new Primrose.Button( child.parent, child.name ) );
      }
      if ( child.name ) {
        scene[child.name] = child;
      }
    } );
    if ( success ) {
      success( scene );
    }
  }

  var propertyTests = {
    isButton: function ( obj ) {
      return obj.material && obj.material.name.match( /^button\d+$/ );
    },
    isSolid: function ( obj ) {
      return !obj.name.match( /^(water|sky)/ );
    },
    isGround: function ( obj ) {
      return obj.material && obj.material.name && obj.material.name.match(/\bground\b/);
    }
  };

  function setProperties ( object ) {
    object.traverse( function ( obj ) {
      if ( obj instanceof THREE.Mesh ) {
        for ( var prop in propertyTests ) {
          obj[prop] = obj[prop] || propertyTests[prop]( obj );
        }
      }
    } );
  }

  function ModelLoader ( src, success ) {
    if ( src ) {
      var done = function ( scene ) {
        this.template = scene;
        if ( success ) {
          success( scene );
        }
      }.bind( this );
      ModelLoader.loadObject( src, done );
    }
  }

  ModelLoader.prototype.clone = function () {
    var obj = this.template.clone();

    obj.traverse( function ( child ) {
      if ( child instanceof THREE.SkinnedMesh ) {
        obj.animation = new THREE.Animation( child, child.geometry.animation );
        if ( !this.template.originalAnimationData && obj.animation.data ) {
          this.template.originalAnimationData = obj.animation.data;
        }
        if ( !obj.animation.data ) {
          obj.animation.data = this.template.originalAnimationData;
        }
      }
    }.bind( this ) );

    setProperties( obj );
    return obj;
  };


  ModelLoader.loadScene = function ( src, success ) {
    var done = buildScene.bind( window, success );
    ModelLoader.loadObject( src, done );
  };

  ModelLoader.loadObject = function ( src, success ) {
    var done = function ( scene ) {
      setProperties( scene );
      if ( success ) {
        success( scene );
      }
    };

    if ( /\.json$/.test(src) ) {
      if ( !JSON ) {
        console.error( "JSON seems to be broken right now" );
      }
      else {
        JSON.setCrossOrigin(THREE.ImageUtils.crossOrigin);
        JSON.load( src, function ( json ) {
          done( fixJSONScene( json ) );
        } );
      }
    }
  };

  return ModelLoader;
} )();
