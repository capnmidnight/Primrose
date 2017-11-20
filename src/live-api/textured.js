/*
pliny.function({
  parent: "Live API",
  name: "textured",
  description: "Combines a geometry and a texture description into a mesh. The texture description can be quite complex, as there are a lot of options. The following description makes using this function sound quite complex, but it's actually quite easy to use. It's just complex in its implementation to be able to accommodate ease of use.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "geometry",
    type: "THREE.Geometry or THREE.Mesh",
    description: "The object to which to apply the texture. If the object provided is a THREE.Mesh, this replaces the material currently being used on the Mesh without creating a new Mesh."
  }, {
    name: "txt",
    type: "one of: [String, 6-item Array of String, Primrose.Controls.Surface, HTMLCanvasElement, HTMLVideoElement, HTMLImageElement, THREE.Texture]",
    description: "There are a lot of options for the types of things use can use for this parameter:\n\
\n\
* `String` - A texture will be loaded using the default texture loader with this value as the `src` attribute of the Image that is to be loaded.\n\
* `6-item Array of String` - Each item of the array will be loaded as a texture as in the case of a single String, but the results will be used to create a THREE.CubeTexture, rather than a THREE.Texture, thereby creating a cube-map.\n\
* `Primrose.Controls.Surface` - any subclass of the Surface class, including 2D button controls or text editors.\n\
* `HTMLCanvasElement`, `HTMLVideoElement`, or `HTMLImageElement` - HTML elements that represent image data in some way.\n\
* `THREE.Texture` - for convenience, any previously loaded texture may also be used as the texture parameter."
  }, {
    name: "options",
    type: "Live API.textured.optionsHash",
    optional: true,
    description: "Options to pass to the THREE.Texture constructor, or infrequently-used options to change the behavior of the setup. See [`Live API.textured.optionsHash`](#LiveAPI_textured_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }],
  examples: [{
    name: "Basic usage",
    description: "You'll typically want to create textures out of images.\n\
\n\
    grammar(\"JavaScript\");\n\
    var moon = textured(circle(1, 45), \"moon.jpg\", {\n\
      unshaded: true,\n\
      useFog: false\n\
    });\n\
    \n\
    env.sky.add(moon); // assuming we have a `Primrose.BrowserEnvironment` named `env`\n\
    moon.latLng(-30, 30, 7);\n\
    moon.lookAt(env.scene.position);\n\
\n\
The result should appear as:\n\
\n\
![screenshot](images/moon.jpg)"
  }]
});
*/

/*
pliny.record({
  parent: "Live API.textured",
  name: "optionsHash",
  type: "Object",
  description: "Optional options to alter how the texture is applied to the geometry. This also includes options that are passed on to the [`material()`](#LiveAPI_material) function.",
  parameters: [{
    name: "progress",
    type: "Function",
    optional: true,
    description: "A callback function to use for tracking progress. The callback function should accept a standard [`ProgressEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent)."
  }, {
    name: "resolve",
    type: "Function",
    optional: true,
    description: "A callback function to use when a texture is successfully created. It's generally best to use this callback to add the mesh to the scene, rather than adding the mesh when `textured()` returns, as textures that need time to load will cause WebGL warnings and slow down the overall experience."
  }, {
    name: "reject",
    type: "Function",
    optional: true,
    description: "An error callback function to use when the texture could not be loaded."
  }, {
    name: "shadow",
    type: "Boolean",
    optional: true,
    description: "If true, this texture will receive shadows from other objects, and the mesh will cast shadows onto other objects."
  }, {
    name: "txtRepeatX",
    type: "Number",
    optional: true,
    default: 1,
    description: "The number of times to repeat the texture across the mesh in the X axis."
  }, {
    name: "txtRepeatY",
    type: "Number",
    optional: true,
    default: 1,
    description: "The number of times to repeat the texture across the mesh in the Y axis."
  }, {
    name: "anisotropy",
    type: "Number",
    optional: true,
    default: 1,
    description: "The degree to which to sharpen textures at large distances and sharp angles."
  }, {
    name: "scaleTexture",
    type: "Number",
    optional: true,
    description: "The degree to which to resize a texture on both the X and Y  axis, if separate `scaleTextureWidth` and `scaleTextureHeight` options are not provided."
  }, {
    name: "scaleTextureWidth",
    type: "Number",
    optional: true,
    description: "The degree to which to resize a texture on the X axis to fit on the model."
  }, {
    name: "scaleTextureHeight",
    type: "Number",
    optional: true,
    description: "The degree to which to resize a texture on the Y axis to fit on the model."
  }]
});
*/

import { Mesh, RepeatWrapping, Texture } from "three";

import { cache } from "../util";

import material from "./material";

import loadTexture from "../Primrose/Graphics/loadTexture";


const seenElements = new WeakMap();
let seenElementCount = 0;

export default function textured(geometry, txt, options) {
  if(!options){
    options = {};
  }
  if(!options.txtRepeatX){
    options.txtRepeatX = 1;
  }
  if(!options.txtRepeatY){
    options.txtRepeatY = 1;
  }
  if(!options.anisotropy){
    options.anisotropy = 1;
  }

  let txtType = typeof txt,
    txtID = null;
  if(txtType === "object") {
    if(txt.id){
      txtID = txt.id;
    }
    else{
      if(!seenElements.has(txt)) {
        seenElements.set(txt, "TextureAutoID" + seenElementCount);
        ++seenElementCount;
      }
      txtID = seenElements.get(txt);
    }
  }
  else if(txtType === "string") {
    txtID = txt;
  }
  else{
    var err = new Error(`Couldn't figure out how to make a texture out of typeof '${txtType}', value ${txt}.`);
    if(options.reject){
      options.reject(err);
    }
    else{
      throw err;
    }
  }

  const textureDescription = `Primrose.textured(${txtID}, ${options.txtRepeatX}, ${options.txtRepeatY}, ${options.anisotropy}, ${options.scaleTextureWidth}, ${options.scaleTextureHeight})`;
  const texturePromise = cache(textureDescription, () => {
      if (typeof txt === "string" || (txt instanceof Array || txt.length === 6)) {
        return loadTexture(textureDescription, txt, options.progress);
      }
      else {
        let retValue = null;
        if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement || txt instanceof HTMLImageElement) {
          retValue = new Texture(txt);
        }
        else if(txt.isTexture) {
          retValue = txt;
        }
        else {
          Promise.reject("Texture description couldn't be converted to a THREE.Texture object");
        }

        return Promise.resolve(retValue);
      }
    });

  var mat = material(textureDescription, options),
    obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new Mesh(geometry, mat);
  }
  else if (geometry.isMesh) {
    obj = geometry;
    obj.material = mat;
    geometry = obj.geometry;
  }

  if(options.shadow){
    obj.receiveShadow = true;
    obj.castShadow = true;
  }

  if ((options.scaleTextureWidth || options.scaleTextureHeight)) {
    if (geometry.attributes && geometry.attributes.uv && geometry.attributes.uv.array) {
      var uv = geometry.attributes.uv,
        arr = uv.array,
        i;
      if (options.scaleTextureWidth) {
        for (i = 0; i < arr.length; i += uv.itemSize) {
          arr[i] *= options.scaleTextureWidth;
        }
      }
      if (options.scaleTextureHeight) {
        for (i = 1; i < arr.length; i += uv.itemSize) {
          arr[i] = 1 - (1 - arr[i]) * options.scaleTextureHeight;
        }
      }
    }
    else {
      console.trace(geometry, options);
    }
  }

  options.promise = texturePromise.then((texture) => {
    if (options.txtRepeatX * options.txtRepeatY > 1) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(options.txtRepeatX, options.txtRepeatY);
    }

    texture.anisotropy = options.anisotropy;

    if(texture.isCubeTexture){
      mat.envMap = texture;
    }
    else if(texture.isTexture){
      mat.map = texture;
    }

    mat.needsUpdate = true;
    texture.needsUpdate = true;
    return texture;
  });

  return obj;
}
