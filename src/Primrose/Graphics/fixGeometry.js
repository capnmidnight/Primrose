/*
pliny.function({
  parent: "Primrose.Graphics",
  name: "fixGeometry",
  description: "Performs some changes to the geometry's UV coordinates to make them work better.",
  returns: "THREE.Geometry",
  parameters: [{
    name: "geometry",
    type: "THREE.Geometry",
    description: "The geometry to fix."
  }, {
    name: "options",
    type: "Primrose.Graphics.fixGeometry.optionsHash",
    optional: true,
    description: "Options for changing the UV coordinates. See [`Primrose.Graphics.fixGeometry.optionsHash`](#Primrose_Graphics_fixGeometry_optionsHash) for more information."
  }]
});
*/

/*
pliny.record({
  parent: "Primrose.Graphics.fixGeometry",
  name: "optionsHash",
  description: "Options for changing the UV coordinates.",
  parameters: [{
    name: "maxU",
    type: "Number",
    optional: true,
    default: 1,
    description: "The value by which to scale the U component of the texture coordinate."
  }, {
    name: "maxV",
    type: "Number",
    optional: true,
    default: 1,
    description: "The value by which to scale the V component of the texture coordinate."
  }]
});
*/
export default function fixGeometry(geometry, options){
  options = options || {};
  const maxU = options.maxU || 1,
    maxV = options.maxV || 1,
    attrs = geometry.attributes || (geometry._bufferGeometry && geometry._bufferGeometry.attributes);
  if (attrs && attrs.uv && attrs.uv.array) {
    const uv = attrs.uv,
      arr = uv.array;
    for (let j = 0; j < arr.length; j += uv.itemSize) {
      arr[j] *= maxU;
    }
    for (let j = 1; j < arr.length; j += uv.itemSize) {
      arr[j] = 1 - (1 - arr[j]) * maxV;
    }
  }
  else if(geometry.faceVertexUvs) {
    const faces = geometry.faceVertexUvs;
    for(let i = 0; i < faces.length; ++i){
      const face = faces[i];
      for(let j = 0; j < face.length; ++j){
        const uvs = face[j];
        for(let k = 0; k < uvs.length; ++k){
          const uv = uvs[k];
          uv.x *= maxU;
          uv.y = 1 - (1 - uv.y) * maxV;
        }
      }
    }
  }

  return geometry;
};
