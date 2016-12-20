class Record extends Replay.Obj {

  constructor(path, value, root) {
    super(path, root);
    this.value = value;
  }

  write() {
    if (this.value !== this.get()) {
      this.set(this.value);
    }
  }
}