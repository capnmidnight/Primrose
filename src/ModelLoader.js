/* global Primrose, THREE */

Primrose.ModelLoader = ( function () {
  var COLLADA = new THREE.ColladaLoader();
  COLLADA.options.convertUpAxis = true;

  function ModelLoader ( src, success ) {
    if ( src ) {
      ModelLoader.loadCollada( src, function ( scene ) {
        this.template = scene;
        if ( success ) {
          success( scene );
        }
      }.bind( this ) );
    }
  }

  ModelLoader.setProperties = function ( object ) {
    object.traverse( function ( child ) {
      for ( var i = 0; i < child.children.length; ++i ) {
        var obj = child.children[i];
        if ( obj instanceof THREE.Mesh ) {
          var materials = obj.material.materials;
          if ( materials ) {
            for ( var j = 0; j < materials.length; ++j ) {
              child.isSolid = child.isSolid ||
                  materials[j].name === "solid";
              child.isButton = child.isButton ||
                  materials[j].name === "button";
            }
          }
        }
      }
    } );
  };

  ModelLoader.loadCollada = function ( src, success ) {
    COLLADA.load( src, function ( collada ) {
      ModelLoader.setProperties( collada.scene );
      if ( success ) {
        success( collada.scene );
      }
    } );
  };

  ModelLoader.loadScene = function ( src, success ) {
    ModelLoader.loadCollada( src, function ( scene ) {
      scene.buttons = [ ];
      scene.traverse( function ( child ) {
        if ( child.isButton ) {
          scene.buttons.push( new Primrose.Button( child.parent,
              child.name ) );
        }
        if ( child.name ) {
          scene[child.name] = child;
        }
      } );
      if ( success ) {
        success( scene );
      }
    } );
  };

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

    ModelLoader.setProperties( obj );
    return obj;
  };

  return ModelLoader;
} )();
