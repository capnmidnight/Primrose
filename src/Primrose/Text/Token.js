/*
pliny.class({
  parent: "Primrose.Text",
    name: "Token",
    description: "| [under construction]"
});
*/

export default class Token {
  constructor(value, type, index, line) {
    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  clone() {
    return new Token(this.value, this.type, this.index, this.line);
  }

  splitAt(i) {
    var next = this.value.substring(i);
    this.value = this.value.substring(0, i);
    return new Token(next, this.type, this.index + i, this.line);
  }

  toString() {
    return "[" + this.type + ": " + this.value + "]";
  }
};
