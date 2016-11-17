var objectIDs = new WeakMap(),
  counter = 0;

export default function loadTexture(url, resolve, progress, reject) {
  var textureLoader = null,
    txtName = null;
  if(url instanceof Array && url.length === 6) {
    textureLoader = new THREE.CubeTextureLoader();
    txtName = url.join(",");
  }
  else {
    if(url instanceof HTMLImageElement){
      txtName = url.src;
      url = url.src;
    }
    else if(typeof url === "object"){
      if(!objectIDs.has(url)) {
        objectIDs.set(url, `object-${counter++}`);
      }
      txtName = objectIDs.get(url);
    }

    if(typeof url === "string") {
      txtName = url;
      textureLoader = new THREE.TextureLoader();
    }
  }

  if(textureLoader){
    textureLoader.setCrossOrigin(THREE.ImageUtils.crossOrigin);
  }

  return cache(
    `Texture(${txtName})`,
    () => {
      var txt = null;
      if(textureLoader){
        txt = textureLoader.load(url, resolve, progress, reject);
      }
      else{
        txt = new THREE.Texture(url);
        resolve();
      }
      return txt;
    },
    resolve);
}