/*
pliny.class({
  parent: "Primrose.Text",
    name: "Point",
    description: "| [under construction]"
});
*/

export default class Point {
  constructor (x, y) {
    this.set(x || 0, y || 0);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  copy(p) {
    if (p) {
      this.x = p.x;
      this.y = p.y;
    }
  }

  clone() {
    return new Point(this.x, this.y);
  }

  toString() {
    return "(x:" + this.x + ", y:" + this.y + ")";
  }
};
