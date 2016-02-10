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
    description: "Loads a model and keeps a reference of it around to be able to use as a factory of models.\n\
\n\
*NOTE: uses the same Cross-Origin Request policy as THREE.ImageUtils, meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin policy that Primrose uses for request.*",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.JS JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.ModelLoader(\"path/to/model.json\", function(model){\n\
        model.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
     \n\
    // Add copies of the model to the scene every time the user hits the ENTER key.\n\
    window.addEventListener(\"keyup\", function(evt){\n\
      // If the template object exists, then the model loaded successfully.\n\
      if(modelFactory.template && evt.keyCode === 10){\n\
        scene.add(modelFactory.clone());\n\
      }\n\
    });"}
    ]
  } );
  function ModelLoader ( src, success, error, progress ) {
    pliny.property( {
      name: "template",
      type: "THREE.Object3D",
      description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
    } );
    var done = function ( scene ) {
      this.template = scene;
      if ( success ) {
        success( scene );
      }
    }.bind( this );
    ModelLoader.loadObject( src, done, error, progress );
  }

  pliny.method( "Primrose.ModelLoader", {
    name: "clone",
    description: "Creates a copy of the stored template model.",
    returns: "A THREE.Object3D that is a copy of the stored template.",
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.JS JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
    \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.ModelLoader(\"path/to/model.json\", function(model){\n\
        model.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
    \n\
    // Add copies of the model to the scene every time the user hits the ENTER key.\n\
    window.addEventListener(\"keyup\", function(evt){\n\
      // If the template object exists, then the model loaded successfully.\n\
      if(modelFactory.template && evt.keyCode === 10){\n\
        scene.add(modelFactory.clone());\n\
      }\n\
    });"}
    ]
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
    description: "Asynchronously loads a model intended to be used as a scene. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It also translates objects marked as GUI elements into instances of their associated elements within the Primrose framework.\n\
\n\
*NOTE: uses the same Cross-Origin Request policy as THREE.ImageUtils, meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin policy that Primrose uses for request.*",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.JS JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
    Primrose.ModelLoader.loadScene(\"path/to/scene.json\", function(newScene){\n\
      currentScene = newScene;\n\
      newScene.traverse(function(child){\n\
        if(child instanceof THREE.PerspectiveCamera){\n\
          camera = child;\n\
        }\n\
        // Do whatever else you want to the individual child objects of the scene.\n\
      });\n\
    }, console.error.bind(console), console.log.bind(console, \"Progress:\"));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
    ]
  } );
  ModelLoader.loadScene = function ( src, success, error, progress ) {
    var done = buildScene.bind( window, success, error, progress );
    ModelLoader.loadObject( src, done, error, progress );
  };

  pliny.function( "Primrose.ModelLoader", {
    name: "loadObject",
    description: "Asynchronously loads a JSON file as a JavaScript object. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It uses callbacks to tell you when loading progresses, when it's complete, or when an error occurred. Useful for one-time use models.\n\
\n\
*NOTE: uses the same Cross-Origin Request policy as THREE.ImageUtils, meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin policy that Primrose uses for request.*",
    parameters: [
      {name: "src", type: "String", description: "The file from which to load."},
      {name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully."},
      {name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs."},
      {name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses."}
    ],
    examples: [
      {name: "Load a basic model.", description: "When Blender exports the Three.JS JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file\n\
    Primrose.ModelLoader.loadObject(\n\
      \"path/to/model.json\",\n\
      scene.add.bind(scene),\n\
      console.error.bind(console),\n\
      console.log.bind(console, \"Progress:\"));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
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

pliny.issue( "Primrose.ModelLoader", {
  name: "document ModelLoader",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.ModelLoader](#Primrose_ModelLoader) class in the  directory"
} );

pliny.issue( "Primrose.ModelLoader", {
  name: "Move ModelLoader to a Three.JS specific namespace",
  type: "open",
  description: "This class won't work outside of a Three.JS context. The bits of code that absolutely must have Three.js should be moved to their own namespace."
} );
