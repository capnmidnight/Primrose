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
    ".json": THREE.ObjectLoader && new THREE.ObjectLoader(),
    ".fbx": THREE.FBXLoader && new THREE.FBXLoader(),
    ".mtl": THREE.MTLLoader && new THREE.MTLLoader(),
    ".obj": THREE.OBJLoader && new THREE.OBJLoader(),
    ".stl": THREE.STLLoader && new THREE.STLLoader(),
    ".typeface.js": THREE.FontLoader && new THREE.FontLoader()
  },
    mime = {
      "text/prs.wavefront-obj": "obj",
      "text/prs.wavefront-mtl": "mtl"
    },
    EXTENSION_PATTERN = /(\.(\w+))+$/,
    NAME_PATTERN = /([^/]+)\.\w+$/;

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
    object.traverse(function (obj) {
      if (obj instanceof THREE.Mesh) {
        for (var prop in propertyTests) {
          obj[prop] = obj[prop] || propertyTests[prop](obj);
        }
      }
    });
    return object;
  }

  pliny.class({
    parent: "Primrose",
    name: "ModelLoader",
    description: "Creates an interface for cloning 3D models loaded from files, to instance those objects.\n\
\n\
> NOTE: You don't instantiate this class directly. Call `ModelLoader.loadModel`.",
    parameters: [
      { name: "template", type: "THREE.Object3D", description: "The 3D model to make clonable." }
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
    name: "loadObject",
    description: "Asynchronously loads a JSON, OBJ, or MTL file as a Three.js object. It processes the scene for attributes, creates new properties on the scene to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for one-time use models.\n\
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
    var extMatch = src.match(EXTENSION_PATTERN),
      extension = type && ("." + type) || extMatch[0];
    if (!extension) {
      return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
    }
    else {
      extension = extension.toLowerCase();
      var Loader = loaders[extension];
      if (!Loader) {
        return Promise.reject("There is no loader type for the file extension: " + extension);
      }
      else {
        var name = src.substring(0, extMatch.index),
          elemID = name + "_" + extension.toLowerCase(),
          elem = document.getElementById(elemID),
          promise = Promise.resolve();

        if (extension === ".obj") {
          var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
          promise = promise.then(() => ModelLoader.loadObject(newPath, "mtl", progress));
          promise = promise.then((materials) => {
            materials.preload();
            Loader.setMaterials(materials);
          });
        }

        if (elem) {
          var elemSource = elem.innerHTML
            .split(/\r?\n/g)
            .map(function (s) { return s.trim(); })
            .join("\n");
          promise = promise.then(() => Loader.parse(elemSource));
        }
        else {
          if (Loader.setCrossOrigin) {
            Loader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
          }
          promise = promise.then(() => new Promise((resolve, reject) => Loader.load(src, resolve, progress, reject)));
        }

        if (extension === ".json") {
          promise = promise.then(fixJSONScene);
        }

        if (extension !== ".mtl" && extension !== ".typeface.js") {
          promise = promise.then(setProperties);
        }
        promise = promise.catch(console.error.bind(console, "MODEL_ERR", src))
        return promise;
      }
    }
  };


  pliny.function({
    parent: "Primrose.ModelLoader",
    name: "loadObjects",
    description: "Asynchronously loads an array of JSON, OBJ, or MTL file as a Three.js object. It processes the objects for attributes, creating new properties on each object to give us\n\
faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
Useful for static models.\n\
\n\
See [`Primrose.ModelLoader.loadObject()`](#Primrose_ModelLoader_loadObject) for more details on how individual models are loaded.",
    returns: "Promise",
    parameters: [
      { name: "arr", type: "Array", description: "The files from which to load." },
      { name: "type", type: "String", description: "(Optional) The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension." },
      { name: "progress", type: "Function", description: "(Optional) A callback function to be called as the download from the server progresses." }
    ],
    examples: [
      {
        name: "Load some models.", description: "When Blender exports models, they are frequently treated as full scenes, essentially making them scene-graph sub-trees.\n\
We can load a bunch of models in one go using the following code.\n\
\n\
## Code:\n\
\n\
    grammar(\"JavaScript\");\n\
    // Create the scene where objects will go\n\
    var renderer = new THREE.WebGLRenderer(),\n\
        currentScene = new THREE.Scene(),\n\
        camera = new THREE.PerspectiveCamera(),\n\
        allModels = null;\n\
     \n\
    // Load up the file\n\
    Primrose.ModelLoader.loadObjects(\n\
      [\"path/to/model1.json\",\n\
        \"path/to/model2.obj\",\n\
        \"path/to/model3.obj\",\n\
        \"path/to/model4.fbx\"],\n\
      console.log.bind(console, \"Progress:\"))\n\
      .then(function(models){\n\
        allModels = models;\n\
        models.forEach(function(model){\n\
          scene.add(model);\n\
        });\n\
      })\n\
      .catch(console.error.bind(console));\n\
     \n\
    function paint(t){\n\
      requestAnimationFrame(paint);\n\
      \n\
      if(allModels){\n\
        // do whatever updating you want on the models\n\
      }\n\
      \n\
      renderer.render(scene, camera);\n\
    }\n\
    \n\
    requestAnimationFrame(paint);"}
    ]
  });
  ModelLoader.loadObjects = function (map) {
    var output = {},
      promise = Promise.resolve(output);
    for (var key in map) {
      if (map[key]) {
        promise = promise.then(loader(map, key));
      }
    }
    return promise;
  };

  function loader(map, key) {
    return (obj) => ModelLoader.loadObject(map[key])
      .then((model) => {
        obj[key] = model;
        return obj;
      });
  }

  return ModelLoader;
})();

