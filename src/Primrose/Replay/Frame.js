/*
pliny.class({
  parent: "Primrose.Replay",
  name: "Frame",
  description: "| [under construction]"
});
*/

import Record from "./Record";

/*
  A collection of all the recorded state values at a single point in time.
*/
export default class Frame {

  static parse(timestamp, obj, root) {
    const stack = [{
        path: "",
        value: obj
      }],
      records = [];

    while (stack.length > 0) {
      const {
        path,
        value
      } = stack.shift();

      if (typeof value === "object") {
        for (const key in value) {
          let newPath = path;
          if (path.length > 0) {
            newPath += ".";
          }
          newPath += key;
          stack.push({
            path: newPath,
            value: value[key]
          });
        }
      }
      else {
        records.push(new Record(path, value, root));
      }
    }

    return new Frame(timestamp, records);
  }

  constructor(timestamp, records) {
    this.t = timestamp;
    this.records = records;
  }

  write() {
    for (var i = 0; i < this.records.length; ++i) {
      this.records[i].write();
    }
  }
};
