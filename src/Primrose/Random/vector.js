function vector(min, max){
  return new THREE.Vector3().set(
    Primrose.Random.number(min, max),
    Primrose.Random.number(min, max),
    Primrose.Random.number(min, max)
  );
}