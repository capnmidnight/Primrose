function loadTexture(url, resolve, progress, reject) {
  progress = progress || function(){};
  var textureLoader = null,
    txtName = null;
  if(url instanceof Array && url.length === 6) {
    textureLoader = new THREE.CubeTextureLoader();
    txtName = url.join(",");
  }
  else {
    if(url instanceof HTMLImageElement){
      url = url.src;
    }

    if(typeof url === "string") {
      txtName = url;
      textureLoader = new THREE.TextureLoader();
    }
  }
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache(
    `Texture(${txtName})`,
    () => textureLoader.load(url, resolve, progress, reject),
    resolve);
}