/*
pliny.class({
  parent: "Primrose.Text",
    name: "Size",
    description: "| [under construction]"
});
*/

export default class Size {
  constructor(width, height) {
    this.set(width || 0, height || 0);
  }

  set(width, height) {
    this.width = width;
    this.height = height;
  }

  copy(s) {
    if (s) {
      this.width = s.width;
      this.height = s.height;
    }
  }

  clone() {
    return new Size(this.width, this.height);
  }

  toString() {
    return "<w:" + this.width + ", h:" + this.height + ">";
  }
};
