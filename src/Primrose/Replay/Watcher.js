class Watcher extends Replay.Obj {
  constructor(path, root) {
    super(path, root);

    let lastValue = null;
    this.read = () => {
      const value = this.get();
      if (value !== this.lastValue) {
        this.lastValue = value;
        return new Replay.Record(this.path, value, root);
      }
      else {
        return null;
      }
    };
  }
}