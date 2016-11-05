function offset(x, y, z){
  const arr = this.attributes.position.array,
    l = this.attributes.position.itemSize;
  for(let i = 0; i < arr.length; i += l) {
    arr[i] += x;
    arr[i + 1] += y;
    arr[i + 2] += z;
  }
}