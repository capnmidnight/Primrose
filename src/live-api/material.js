import { FrontSide } from "three/src/constants";
import { FlatShading } from "three/src/constants";
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
export default function material(textureDescription, options){
  if(options === undefined && typeof textureDescription !== "string") {
    options = textureDescription;
    textureDescription = "none";
  }
  options = Object.assign({}, {
    opacity: 1,
    roughness: 0.5,
    metalness: 0,
    color: 0xffffff,
    fog: true,
    unshaded: false,
    wireframe: false,
    side: FrontSide
  }, options);

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

    var mat = new MaterialType(materialOptions);
    if (typeof options.color === "number" || options.color instanceof Number) {
      mat.color.set(options.color);
    }
    mat.wireframe = options.wireframe;
    return mat;
  });
};