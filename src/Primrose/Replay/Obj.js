/*
pliny.class({
  parent: "Primrose.Replay",
  name: "Obj",
  description: "| [under construction]"
});
*/

export default class Obj {
  constructor(path, root = window) {
    this.path = path;

    const parts = path.split("."),
      key = parts[parts.length - 1];

    const find = (fill) => {
      let head = root;

      for (let i = 0; i < parts.length - 1; ++i) {
        const part = parts[i];
        if (head[part] === undefined || head[part] === null) {
          if (fill) {
            if (/^\d+$/.test(parts[i + 1])) {
              head[part] = [];
            }
            else {
              head[part] = {};
            }
          }
          else {
            head = null;
            break;
          }
        }
        head = head[part];
      }

      return head;
    };

    this.get = () => {
      var obj = find(false);
      return obj && obj[key];
    };

    this.set = (v) => {
      var obj = find(true);
      if (obj) {
        obj[key] = v;
      }
    };
  }
};
