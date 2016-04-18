/* global Primrose, THREE, pliny */

Primrose.ModelLoader = (function () {
  // If Three.js hasn't been loaded, then this module doesn't make sense and we
  // can just return a shim to prevent errors from occuring. This is useful in
  // cases where we want to use Primrose in a 2D context, or perhaps use it with
  // a different 3D library, whatever that might be.
  if (typeof (THREE) === "undefined") {
    return function () {
    };
  }

  // The JSON format object loader is not always included in the Three.js distribution,
  // so we have to first check for it.
  var loaders = {
    JSON: THREE.ObjectLoader && new THREE.ObjectLoader(),
    FBX: THREE.FBXLoader && new THREE.FBXLoader(),
    MTL: THREE.MTLLoader && new THREE.MTLLoader(),
    OBJ: THREE.OBJLoader && new THREE.OBJLoader(),
    STL: THREE.STLLoader && new THREE.STLLoader()
  },
    EXTENSION_PATTERN = /\.(\w+)$/;

  console.log(loaders);

  // Sometimes, the properties that export out of Blender and into Three.js don't
  // come out correctly, so we need to do a correction.
  function fixJSONScene(json) {
    json.traverse(function (obj) {
      if (obj.geometry) {
        obj.geometry.computeBoundingSphere();
        obj.geometry.computeBoundingBox();
      }
    });
    return json;
  }

  var propertyTests = {
    isButton: function (obj) {
      return obj.material && obj.material.name.match(/^button\d+$/);
    },
    isSolid: function (obj) {
      return !obj.name.match(/^(water|sky)/);
    },
    isGround: function (obj) {
      return obj.material && obj.material.name && obj.material.name.match(/\bground\b/);
    }
  };

  function setProperties(object) {
    console.log(object);
    object.traverse(function (obj) {
      if (obj instanceof THREE.Mesh) {
        for (var prop in propertyTests) {
          obj[prop] = obj[prop] || propertyTests[prop](obj);
        }
      }
    });
    return object;
  }

  function buildScene(progress, scene) {
    scene.buttons = [];
    scene.traverse(function (child) {
      if (child.isButton) {
        scene.buttons.push(
          new Primrose.Button(child.parent, child.name));
      }
      if (child.name) {
        scene[child.name] = child;
      }
    });
    return scene;
  }

  pliny.class({
    parent: "Primrose",
    name: "ModelLoader",
    description: "Loads a model and keeps a reference of it around to be able to use as a factory of models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    parameters: [
      { name: "src", type: "String", description: "The file from which to load." },
      { name: "success", type: "Function", description: "(Optional) the callback to issue whenever the request finishes successfully." },
      { name: "error", type: "Function", description: "(Optional) the callback to issue whenever an error occurs." },
      { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }
    ],
    examples: [
      {
        name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var scene = new THREE.Scene(),\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
      modelFactory = new Primrose.loadModel(\"path/to/model.json\", console.log.bind(console, \"Progress:\"))\n\
      .then(function(model){\n\
        model.template.traverse(function(child){\n\
          // Do whatever you want to the individual child objects of the scene.\n\
        });\n\
     \n\
      // Add copies of the model to the scene every time the user hits the ENTER key.\n\
      window.addEventListener(\"keyup\", function(evt){\n\
        // If the template object exists, then the model loaded successfully.\n\
        if(evt.keyCode === 10){\n\
          scene.add(model.clone());\n\
        }\n\
      });\n\
    })\n\
    .catch(console.error.bind(console));"}
    ]
  });
  function ModelLoader(template) {
    pliny.property({
      name: "template",
      type: "THREE.Object3D",
      description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
    });
    this.template = template;
  }
  ModelLoader.loadModel = function (src, type, progress) {
    return ModelLoader.loadObject(src, type, progress)
      .then((scene) => new ModelLoader(scene));
  };

  pliny.method({
    parent: "Primrose.ModelLoader",
    name: "clone",
    description: "Creates a copy of the stored template model.",
    returns: "A THREE.Object3D that is a copy of the stored template.",
    examples: [
      {
        name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
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
  });
  ModelLoader.prototype.clone = function () {
    var obj = this.template.clone();

    obj.traverse(function (child) {
      if (child instanceof THREE.SkinnedMesh) {
        obj.animation = new THREE.Animation(child, child.geometry.animation);
        if (!this.template.originalAnimationData && obj.animation.data) {
          this.template.originalAnimationData = obj.animation.data;
        }
        if (!obj.animation.data) {
          obj.animation.data = this.template.originalAnimationData;
        }
      }
    }.bind(this));

    setProperties(obj);
    return obj;
  };

  pliny.function({
    parent: "Primrose.ModelLoader",
    name: "loadScene",
    description: "Asynchronously loads a model intended to be used as a scene. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It also translates objects marked as GUI elements into instances of their associated elements within the Primrose framework.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    returns: "Promise",
    parameters: [
      { name: "src", type: "String", description: "The file from which to load." },
      { name: "type", type: "String", description: "(Optional) The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension." },
      { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }
    ],
    examples: [
      {
        name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file, optionally \"check it out\"\n\
    Primrose.ModelLoader.loadScene(\"path/to/scene.json\", console.log.bind(console, \"Progress:\"))\n\
    .then(function(newScene){\n\
      currentScene = newScene;\n\
      newScene.traverse(function(child){\n\
        if(child instanceof THREE.PerspectiveCamera){\n\
          camera = child;\n\
        }\n\
        // Do whatever else you want to the individual child objects of the scene.\n\
      });\n\
    })\n\
    .catch(console.error.bind(console));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
    ]
  });
  ModelLoader.loadScene = function (src, type, progress) {
    return ModelLoader.loadObject(src, type, progress)
      .then(buildScene.bind(window, progress));
  };

  pliny.function({
    parent: "Primrose.ModelLoader",
    name: "loadObject",
    description: "Asynchronously loads a JSON file as a JavaScript object. It processes the scene for attributes, creates new properties on the scene to give us faster access to some of the elements within it. It uses callbacks to tell you when loading progresses, when it's complete, or when an error occurred. Useful for one-time use models.\n\
\n\
> NOTE: ModelLoader uses the same Cross-Origin Request policy as THREE.ImageUtils,\n\
> meaning you may use THREE.ImageUtils.crossOrigin to configure the cross-origin\n\
> policy that Primrose uses for requests.",
    returns: "Promise",
    parameters: [
      { name: "src", type: "String", description: "The file from which to load." },
      { name: "type", type: "String", description: "(Optional) The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension." },
      { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }
    ],
    examples: [
      {
        name: "Load a basic model.", description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.ModelLoader object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera();\n\
     \n\
    // Load up the file\n\
    Primrose.ModelLoader.loadObject(\n\
      \"path/to/model.json\",\n\
      null,\n\
      console.log.bind(console, \"Progress:\"))\n\
      .then(scene.add.bind(scene))\n\
      .catch(console.error.bind(console));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      renderer.render(scene, camera);\n\
    }\n\
     \n\
    requestAnimationFrame(paint);"}
    ]
  });
  ModelLoader.loadObject = function (src, type, progress) {
    var extension = type || src.match(EXTENSION_PATTERN)[1];
    if (!extension) {
      return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
    }
    else {
      extension = extension.toUpperCase();
      console.log(extension);
      var Loader = loaders[extension];
      if (!Loader) {
        return Promise.reject("There is no loader type for the file extension: " + extension);
      }
      else {
        var promise = Promise.resolve();

        if (extension === "OBJ") {
          var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
          promise = promise.then(() => {
            return ModelLoader.loadObject(newPath, "mtl", progress)
              .then((materials) => {
                materials.preload();
                Loader.setMaterials(materials);
              });
          });
        }

        promise = promise.then(() => new Promise((resolve, reject) => {
          if (Loader.setCrossOrigin) {
            Loader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
          }
          Loader.load(src, resolve, progress, reject);
        }));

        if (extension === "JSON") {
          promise = promise.then(fixJSONScene);
        }

        if (extension !== "MTL") {
          promise = promise.then(setProperties);
        }

        return promise;
      }
    }
  };

  return ModelLoader;
})();

pliny.issue({
  parent: "Primrose.ModelLoader",
  name: "document ModelLoader",
  type: "closed",
  description: "Finish writing the documentation for the [Primrose.ModelLoader](#Primrose_ModelLoader) class in the  directory"
});

pliny.issue({
  parent: "Primrose.ModelLoader",
  name: "Move ModelLoader to a Three.js specific namespace",
  type: "open",
  description: "This class won't work outside of a Three.js context. The bits of code that absolutely must have Three.js should be moved to their own namespace."
});
