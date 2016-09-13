function material(textureDescription, options){
  var materialDescription = `Primrose.material(${textureDescription}, ${options.unshaded}, ${options.opacity}, ${options.roughness}, ${options.metalness}, ${options.wireframe}, ${options.emissive}, ${options.wireframe})`;
  return cache(materialDescription, () => {
    var materialOptions = {
        transparent: options.opacity < 1,
        opacity: options.opacity,
        side: options.side || THREE.FrontSide
      },
      MaterialType = THREE.MeshStandardMaterial;

    if (options.unshaded) {
      materialOptions.shading = THREE.FlatShading;
      MaterialType = THREE.MeshBasicMaterial;
    }
    else {
      materialOptions.roughness = options.roughness;
      materialOptions.metalness = options.metalness;

      if (options.emissive !== undefined) {
        materialOptions.emissive = options.emissive;
      }
    }
    var mat = new MaterialType(materialOptions);
    mat.wireframe = options.wireframe;
    return mat;
  });
}