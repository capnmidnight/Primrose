/*
pliny.class({
  parent: "Primrose",
    name: "ModelFactory",
    description: "Creates an interface for cloning 3D models loaded from files, to instance those objects.\n\
\n\
> NOTE: You don't instantiate this class directly. Call `ModelFactory.loadModel`.",
    parameters: [{
      name: "template",
      type: "THREE.Object3D",
      description: "The 3D model to make clonable."
    }],
    examples: [{
      name: "Load a basic model.",
      description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.Controls.ModelFactory object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
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
  .catch(console.error.bind(console));"
    }]
});
*/

import { ObjectLoader, FontLoader, AnimationClip } from "three";

import { MTLLoader, OBJLoader } from "../../THREE"

// The JSON format object loader is not always included in the Three.js distribution,
// so we have to first check for it.
var loaders = null,
  mime = {
    "text/prs.wavefront-obj": "obj",
    "text/prs.wavefront-mtl": "mtl"
  },
  PATH_PATTERN = /((?:https?:\/\/)?(?:[^/]+\/)+)(\w+)(\.(?:\w+))$/,
  EXTENSION_PATTERN = /(\.(?:\w+))+$/,
  NAME_PATTERN = /([^/]+)\.\w+$/;

function loader(map, key) {
  return (obj) => ModelFactory.loadObject(map[key])
    .then((model) => {
      obj[key] = model;
      return obj;
    });
}

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

function fixOBJScene(group) {
  if(group.type === "Group" && group.children.length === 1 && group.children[0].isMesh) {
    return group.children[0];
  }
  return group;
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
}

function setProperties(object) {
  object.traverse(function (obj) {
    if (obj.isMesh) {
      for (var prop in propertyTests) {
        obj[prop] = obj[prop] || propertyTests[prop](obj);
      }
    }
  });
  return object;
}

export default class ModelFactory {

  static loadModel(src, type, progress) {
    return ModelFactory.loadObject(src, type, progress)
      .then((scene) => {
        while(scene && scene.type === "Group"){
          scene = scene.children[0];
        }
        return new ModelFactory(scene);
      });
  }

  static loadObject(src, type, progress) {

    /*
    pliny.function({
      parent: "Primrose.Controls.ModelFactory",
      name: "loadObject",
      description: "Asynchronously loads a JSON, OBJ, or MTL file as a Three.js object. It processes the scene for attributes, creates new properties on the scene to give us\n\
    faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
    Useful for one-time use models.",
      returns: "Promise",
      parameters: [{
        name: "src",
        type: "String",
        description: "The file from which to load."
      }, {
        name: "type",
        type: "String",
        optional: true,
        description: "The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension."
      }, {
        name: "progress",
        type: "Function",
        optional: true,
        description: "A callback function to use for tracking progress. The callback function should accept a standard [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)."
      }],
      examples: [{
        name: "Load a basic model.",
        description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.Controls.ModelFactory object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
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
      Primrose.Controls.ModelFactory.loadObject(\n\
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
      requestAnimationFrame(paint);"
      }]
    });
    */

    var extMatch = src.match(EXTENSION_PATTERN),
      extension = type && ("." + type) || extMatch[0];
    if (!extension) {
      return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
    }
    else {
      extension = extension.toLowerCase();
      if(loaders === null){
        loaders = {
          ".json": ObjectLoader,
          ".mtl": MTLLoader,
          ".obj": OBJLoader,
          ".typeface.json": FontLoader
        }
      }
      var LoaderType = loaders[extension];
      if (!LoaderType) {
        return Promise.reject("There is no loader type for the file extension: " + extension);
      }
      else {
        var loader = new LoaderType(),
          name = src.substring(0, extMatch.index),
          elemID = name + "_" + extension.toLowerCase(),
          elem = document.getElementById(elemID),
          promise = Promise.resolve();
        if (extension === ".obj") {
          var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
          promise = promise
            .then(() => ModelFactory.loadObject(newPath, "mtl", progress))
            .then((materials) => {
              materials.preload();
              loader.setMaterials(materials);
            })
            .catch(console.error.bind(console, "Error loading MTL file: " + newPath));
        }
        else if (extension === ".mtl") {
          var match = src.match(PATH_PATTERN);
          if(match) {
            var dir = match[1];
            src = match[2] + match[3];
            loader.setTexturePath(dir);
            loader.setPath(dir);
          }
        }

        if (elem) {
          var elemSource = elem.innerHTML
            .split(/\r?\n/g)
            .map((s) => s.trim())
            .join("\n");
          promise = promise.then(() => loader.parse(elemSource));
        }
        else {
          if (loader.setCrossOrigin) {
            loader.setCrossOrigin("anonymous");
          }
          promise = promise.then(() => new Promise((resolve, reject) => loader.load(src, resolve, progress, reject)));
        }

        if (extension === ".obj") {
          promise = promise.then(fixOBJScene);
        }

        if (extension === ".json") {
          promise = promise.then(fixJSONScene);
        }

        if (extension !== ".mtl" && extension !== ".typeface.json") {
          promise = promise.then(setProperties);
        }
        promise = promise.catch(console.error.bind(console, "MODEL_ERR", src));
        return promise;
      }
    }
  }

  static loadObjects(map) {

    /*
    pliny.function({
      parent: "Primrose.Controls.ModelFactory",
      name: "loadObjects",
      description: "Asynchronously loads an array of JSON, OBJ, or MTL file as a Three.js object. It processes the objects for attributes, creating new properties on each object to give us\n\
    faster access to some of the elements within it. It uses callbacks to tell you when loading progresses. It uses a Promise to tell you when it's complete, or when an error occurred.\n\
    Useful for static models.\n\
    \n\
    See [`Primrose.Controls.ModelFactory.loadObject()`](#Primrose_Controls_ModelFactory_loadObject) for more details on how individual models are loaded.",
      returns: "Promise",
      parameters: [{
        name: "arr",
        type: "Array",
        description: "The files from which to load."
      }, {
        name: "type",
        type: "String",
        optional: true,
        description: "The type of the file--JSON, FBX, OJB, or STL--if it can't be determined from the file extension."
      }, {
        name: "progress",
        type: "Function",
        optional: true,
        description: "A callback function to use for tracking progress. The callback function should accept a standard [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)."
      }],
      examples: [{
        name: "Load some models.",
        description: "When Blender exports models, they are frequently treated as full scenes, essentially making them scene-graph sub-trees.\n\
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
      Primrose.Controls.ModelFactory.loadObjects(\n\
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
      requestAnimationFrame(paint);"
      }]
    });
    */

    var output = {},
      promise = Promise.resolve(output);
    for (var key in map) {
      if (map[key]) {
        promise = promise.then(loader(map, key));
      }
    }
    return promise;
  }

  constructor(template) {
    /*
    pliny.property({
      parent: "Primrose.Graphics.ModelFactory",
      name: "template",
      type: "THREE.Object3D",
      description: "When a model is loaded, stores a reference to the model so it can be cloned in the future."
    });
    */
    this.template = template;
  }

  clone() {

    /*
    pliny.method({
      parent: "Primrose.Controls.ModelFactory",
      name: "clone",
      description: "Creates a copy of the stored template model.",
      returns: "A THREE.Object3D that is a copy of the stored template.",
      examples: [{
        name: "Load a basic model.",
        description: "When Blender exports the Three.js JSON format, models are treated as full scenes, essentially making them scene-graph sub-trees. Instantiating a Primrose.Controls.ModelFactory object referencing one of these model files creates a factory for that model that we can use to generate an arbitrary number of copies of the model in our greater scene.\n\
    \n\
    ## Code:\n\
    \n\
      grammar(\"JavaScript\");\n\
      // Create the scene where objects will go\n\
      var scene = new THREE.Scene(),\n\
      \n\
      // Load up the file, optionally \"check it out\"\n\
        modelFactory = new Primrose.Controls.ModelFactory(\"path/to/model.json\", function(model){\n\
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
      });"
      }]
    });
    */
    var obj = this.template.clone();

    obj.traverse((child) => {
      if (child.isSkinnedMesh) {
        obj.animation = new AnimationClip(child, child.geometry.animation);
        if (!this.template.originalAnimationClipData && obj.animation.data) {
          this.template.originalAnimationClipData = obj.animation.data;
        }
        if (!obj.animation.data) {
          obj.animation.data = this.template.originalAnimationClipData;
        }
      }
    });

    setProperties(obj);
    return obj;
  }

}
