function offset(x, y, z){
  const arr = this.vertices;
  for(let i = 0; i < arr.length; ++i) {
    const vert = arr[i];
    vert.x += x;
    vert.y += y;
    vert.z += z;
  }
}