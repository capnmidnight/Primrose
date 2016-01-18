/* global Primrose, THREE, pliny */

Primrose.ModelLoader = ( function () {
  // If THREE.js hasn't been loaded, then this module doesn't make sense and we
  // can just return a shim to prevent errors from occuring. This is useful in
  // cases where we want to use Primrose in a 2D context, or perhaps use it with
  // a different 3D library, whatever that might be.
  if ( typeof ( THREE ) === "undefined" ) {
    return function () {
    };
  }

  // The JSON format object loader is not always included in the THREE.js distribution,
  // so we have to first check for it.
  var JSON = THREE.ObjectLoader && new THREE.ObjectLoader();

  // Sometimes, the properties that export out of Blender and into THREE.js don't
  // come out correctly, so we need to do a correction.
  function fixJSONScene ( json ) {
    json.traverse( function ( obj ) {
      if ( obj.geometry ) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
      }
    } );
    return json;
  }

  var propertyTests = {
    isButton: function ( obj ) {
      return obj.material && obj.material.name.match( /^button\d+$/ );
    },
    isSolid: function ( obj ) {
      return !obj.name.match( /^(water|sky)/ );
    },
    isGround: function ( obj ) {
      return obj.material && obj.material.name && obj.material.name.match( /\bground\b/ );
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

  function buildScene ( success, error, progress, scene ) {
    try {
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
    catch ( exp ) {
      if ( error ) {
        error( exp );
      }
    }
  }

  pliny.class( "Primrose", {
    name: "ModelLoader",
    description: "Loads a model and keeps a reference of it around to be able to use as a factory of models.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ]
  } );
  function ModelLoader ( src, success, error, progress ) {
    if ( src ) {
      var done = function ( scene ) {
        pliny.property( {
          name: "template",
          type: "THREE.Object3D",
          description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
        } );
        this.template = scene;
        if ( success ) {
          success( scene );
        }
      }.bind( this );
      ModelLoader.loadObject( src, done, error, progress );
    }
  }

  pliny.method( "Primrose.ModelLoader", {
    name: "clone",
    description: "Creates a copy of the stored template model.",
    returns: "A THREE.Object3D that is a copy of the stored template."
  } );
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

  pliny.function( "Primrose.ModelLoader", {
    name: "loadScene",
    description: "Loads a model intended to be used as a scene. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it, but does not keep a reference of it for cloning.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ]
  } );
  ModelLoader.loadScene = function ( src, success, error, progress ) {
    var done = buildScene.bind( window, success, error, progress );
    ModelLoader.loadObject( src, done, error, progress );
  };

  pliny.function( "Primrose.ModelLoader", {
    name: "loadObject",
    description: "Loads a model intended to be used as an object in a scene. It processes the model for attributes, but does not keep a reference of it for cloning.",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ]
  } );
  ModelLoader.loadObject = function ( src, success, error, progress ) {
    var done = function ( scene ) {
      setProperties( scene );
      if ( success ) {
        success( scene );
      }
    };

    if ( !JSON ) {
      if ( error ) {
        error( "JSON seems to be broken right now" );
      }
    }
    else {
      try {
        JSON.setCrossOrigin( THREE.ImageUtils.crossOrigin );
        JSON.load( src, function ( json ) {
          done( fixJSONScene( json ) );
        }, progress, error );
      }
      catch ( exp ) {
        if ( error ) {
          error( exp );
        }
      }
    }
  };

  return ModelLoader;
} )();
