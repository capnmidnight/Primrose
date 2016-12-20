class Recorder extends Replay.Automator {
  constructor(watchers, root) {
    super(root);
    this.watchers = watchers.map((path) => new Replay.Watcher(path, this.root));
  }

  update(t) {
    super.update(t);
    const records = this.watchers
      .map((w) => w.read())
      .filter((r) => r);

    var frame = new Replay.Frame(t - this.startT, records);
    this.frames.push(frame);
    this.emit("frame", frame);
  }

  toJSON() {
    const output = {};

    this.frames.forEach((frame) => {
      output[frame.t] = {};
      for (var i = 0; i < frame.records.length; ++i) {
        var record = frame.records[i];
        if (record.value !== null) {
          const parts = record.path.split("."),
            key = parts[parts.length - 1];
          let head = output[frame.t];
          for (let j = 0; j < parts.length - 1; ++j) {
            var part = parts[j];
            if (head[part] === undefined || head[part] === null) {
              if (/^\d+$/.test(parts[j + 1])) {
                head[part] = [];
              }
              else {
                head[part] = {};
              }
            }
            head = head[part];
          }
          head[key] = record.value;
        }
      }
    });

    return JSON.stringify(output);
  }
}