import { Vector3 } from "three";

import { sphere } from "../../live-api"

const DIFF = new Vector3(),
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  MAX_TELEPORT_WAGGLE = 0.5,
  TELEPORT_PAD_RADIUS = 0.4,
  TELEPORT_COOLDOWN = 250;

export default class Teleporter {
  constructor(env) {

    this.enabled = true;
    this._environment = env;

    this._startPoint = new Vector3();
    this._moveDistance = 0;

    this._start = this._start.bind(this);
    this._exit = this._exit.bind(this);
    this._move = this._move.bind(this);
    this._end = this._end.bind(this);

    env.ground.on("exit", this._exit)
      .on("gazecancel", this._exit)
      .on("gazecomplete", this._exit)
      .on("pointerend", this._exit)

      .on("pointerstart", this._start)
      .on("gazestart", this._start)

      .on("pointermove", this._move)
      .on("gazemove", this._move)

      .on("select", this._end);


    this.disk = sphere(TELEPORT_PAD_RADIUS, 128, 3)
      .colored(0xff0000, {
        unshaded: true
      })
      .named("disk")
      .addTo(env.scene);

    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach((v) => {
      v.y = 0.1 * (v.y - this.disk.geometry.boundingBox.min.y);
    });
    this.disk.geometry.computeBoundingBox();

    this.disk.visible = false;
  }

  _exit(evt) {
    this.disk.visible = false;
  }

  _start(evt){
    if(this.enabled){
      this._updatePosition(evt);
      this.disk.visible = true;
      this._moveDistance = 0;
    }
  }

  _move(evt) {
    if(this.enabled) {
      this._updatePosition(evt);
      this.disk.visible = this._moveDistance < MAX_TELEPORT_WAGGLE;
    }
  }

  _end(evt) {
    if(this.enabled) {
      this._updatePosition(evt);
      if(this._moveDistance < MAX_TELEPORT_WAGGLE) {
        this._environment.teleport(this.disk.position);
      }
    }
  }

  _updatePosition(evt) {
    this._startPoint.copy(this.disk.position);
    this.disk.position.copy(evt.hit.point)
      .sub(this._environment.head.position);

    var distSq = this.disk.position.x * this.disk.position.x + this.disk.position.z * this.disk.position.z;
    if (distSq > MAX_MOVE_DISTANCE_SQ) {
      var dist = Math.sqrt(distSq),
        factor = MAX_MOVE_DISTANCE / dist,
        y = this.disk.position.y;
      this.disk.position.y = 0;
      this.disk.position.multiplyScalar(factor);
      this.disk.position.y = y;
    }

    this.disk.position.add(this._environment.head.position);

    const len = DIFF.copy(this.disk.position)
      .sub(this._startPoint)
      .length();
    this._moveDistance += len;
  }
};
