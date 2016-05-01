Primrose.Input.Motion = (function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Motion",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });
  class Motion extends Primrose.InputProcessor {
    constructor(commands, socket) {
      super("Motion", commands, socket);
      var corrector = new MotionCorrector(),
        a = new THREE.Quaternion(),
        b = new THREE.Quaternion(),
        RIGHT = new THREE.Vector3(1, 0, 0),
        UP = new THREE.Vector3(0, 1, 0),
        FORWARD = new THREE.Vector3(0, 0, -1);
      corrector.addEventListener("deviceorientation", (evt) => {
        for (var i = 0; i < Motion.AXES.length; ++i) {
          var k = Motion.AXES[i];
          this.setAxis(k, evt[k]);
        }
        a.set(0, 0, 0, 1)
          .multiply(b.setFromAxisAngle(UP, evt.HEADING))
          .multiply(b.setFromAxisAngle(RIGHT, evt.PITCH))
          .multiply(b.setFromAxisAngle(FORWARD, evt.ROLL));
        this.headRX = a.x;
        this.headRY = a.y;
        this.headRZ = a.z;
        this.headRW = a.w;
        this.update();
      });
      this.zeroAxes = corrector.zeroAxes.bind(corrector);
    }

    getOrientation(value) {
      value = value || new THREE.Quaternion();
      value.set(this.getValue("headRX"),
        this.getValue("headRY"),
        this.getValue("headRZ"),
        this.getValue("headRW"));
      return value;
    }
  }

  Primrose.InputProcessor.defineAxisProperties(Motion, [
    "HEADING", "PITCH", "ROLL",
    "D_HEADING", "D_PITCH", "D_ROLL",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW"]);

  function makeTransform(s, eye) {
    var sw = Math.max(screen.width, screen.height),
      sh = Math.min(screen.width, screen.height),
      w = Math.floor(sw * devicePixelRatio / 2),
      h = Math.floor(sh * devicePixelRatio),
      i = (eye + 1) / 2;

    if (window.THREE) {
      s.transform = new THREE.Matrix4().makeTranslation(eye * 0.034, 0, 0);
    }
    s.viewport = {
      x: i * w,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: (i + 1) * w,
      bottom: h,
      left: i * w
    };
    s.fov = 75;
  }

  Motion.DEFAULT_TRANSFORMS = [{}, {}];
  makeTransform(Motion.DEFAULT_TRANSFORMS[0], -1);
  makeTransform(Motion.DEFAULT_TRANSFORMS[1], 1);

  return Motion;
})();

