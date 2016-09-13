var textureLoader = new THREE.TextureLoader();

function loadTexture(url, progress) {
  progress = progress || function(){};
  textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  return cache(
    `Image(${url})`,
    () => new Promise((resolve, reject) => textureLoader.load(url, resolve, progress, reject)));
}