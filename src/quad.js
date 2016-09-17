pliny.function({
  name: "quad",
  description: "| [under construction]"
});

function quad(w, h, options) {
  if (h === undefined) {
    h = w;
  }
  options = options || {};
  if(options.s === undefined){
    options.s = 1;
  }
  if(options.t === undefined){
    options.t = 1;
  }
  return cache(
    `PlaneBufferGeometry(${w}, ${h}, ${options.s}, ${options.t}, ${options.maxU}, $options.maxV)`,
    () => fixGeometry(new THREE.PlaneBufferGeometry(w, h, options.s, options.t), options));
}