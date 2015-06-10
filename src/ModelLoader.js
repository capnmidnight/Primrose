/* global Primrose, THREE */

Primrose.ModelLoader = ( function () {
  var COLLADA = new THREE.ColladaLoader(),
      JSON = new THREE.ObjectLoader();
  COLLADA.options.convertUpAxis = true;

  function ModelLoader ( src, success ) {
    if ( src ) {
      var done = function ( scene ) {
        this.template = scene;
        if ( success ) {
          success( scene );
        }
      }.bind( this );
      if ( src.endsWith( ".dae" ) ) {
        console.error( "COLLADA is currently broken in Three.js" );
        if ( false ) {
          loadCollada( src, done );
        }
      }
      else if ( src.endsWith( ".json" ) ) {
        loadJSON( src, done );
      }
    }
  }

  function setProperties ( object ) {
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

  function loadCollada ( src, success ) {
    COLLADA.load( src, function ( collada ) {
      setProperties( collada.scene );
      if ( success ) {
        success( collada.scene );
      }
    } );
  };

  function loadJSON ( src, success ) {
    JSON.load( src, function ( json ) {
      setProperties( json );
      if ( success ) {
        success( json );
      }
    } );
  };

  function buildScene ( success, scene ) {
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
    if ( src.endsWith( ".dae" ) ) {
      loadCollada( src, done );
    }
    else if ( src.endsWith( ".json" ) ) {
      loadJSON( src, done );
    }
  };

  ModelLoader.loadObject = function ( src, success ) {
    if ( src.endsWith( ".dae" ) ) {
      loadCollada( src, success );
    }
    else if ( src.endsWith( ".json" ) ) {
      loadJSON( src, success );
    }
  };

  return ModelLoader;
} )();
