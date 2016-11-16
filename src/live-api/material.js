import { FrontSide, MeshStandardMaterial, MeshBasicMaterial, CubeTexture, Texture } from "three/Three";
export default function material(textureDescription, options){
  options = options || {};

  if (options.opacity === undefined) {
    options.opacity = 1;
  }
  if (options.roughness === undefined) {
    options.roughness = 0.5;
  }
  if (options.metalness === undefined) {
    options.metalness = 0;
  }
  if(options.color === undefined){
    options.color = 0xffffff;
  }
  if(options.fog === undefined){
    options.fog = true;
  }

  options.unshaded = !!options.unshaded;
  options.wireframe = !!options.wireframe;

  var materialDescription = `Primrose.material(${textureDescription}, ${options.color}, ${options.unshaded}, ${options.side}, ${options.opacity}, ${options.roughness}, ${options.metalness}, ${options.color}, ${options.emissive}, ${options.wireframe}, ${options.fog})`;
  return cache(materialDescription, () => {
    var materialOptions = {
        fog: options.fog,
        transparent: options.transparent || options.opacity < 1,
        opacity: options.opacity,
        side: options.side || FrontSide
      },
      MaterialType = MeshStandardMaterial;

    if (options.unshaded) {
      materialOptions.shading = FlatShading;
      MaterialType = MeshBasicMaterial;
    }
    else {
      materialOptions.roughness = options.roughness;
      materialOptions.metalness = options.metalness;

      if (options.emissive !== undefined) {
        materialOptions.emissive = options.emissive;
      }
    }

    if(options.texture instanceof CubeTexture){
      materialOptions.envMap = options.texture;
    }
    else if(options.texture instanceof Texture){
      materialOptions.map = options.texture;
    }

    var mat = new MaterialType(materialOptions);
    if (typeof options.color === "number" || options.color instanceof Number) {
      mat.color.set(options.color);
    }
    mat.wireframe = options.wireframe;
    return mat;
  });
};