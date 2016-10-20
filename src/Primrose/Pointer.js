const TELEPORT_PAD_RADIUS = 0.4,
  FORWARD = new THREE.Vector3(0, 0, -1),
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  GAZE_RING_DISTANCE  = -1.25,
  GAZE_RING_INNER = 0.015,
  GAZE_RING_OUTER = 0.03,
  VECTOR_TEMP = new THREE.Vector3(),
  EULER_TEMP = new THREE.Euler(),
  QUAT_TEMP = new THREE.Quaternion(),

  _ = priv();


pliny.class({
  parent: "Primrose",
    name: "Pointer",
    baseClass: "Primrose.AbstractEventEmitter",
    description: "An object that points into the scene somewhere, casting a ray at objects for picking operations.",
    parameters: [{
      name: "name ",
      type: "String",
      description: "A friendly name for this pointer object, to make debugging easier."
    }, {
      name: "color",
      type: "Number",
      description: "The color to use to render the teleport pad and 3D pointer cursor."
    }, {
      name: "highlight",
      type: "Number",
      description: "The color to use to highlight the teleport pad and 3D pointer cursor when it's pointing at a real thing."
    }, {
      name: "devices",
      type: "Array",
      description: "An Array of `Primrose.InputProcessor` objects that define the orientation for this pointer."
    }, {
      name: "triggerDevices",
      type: "Array",
      description: "An Array of `Primrose.InputProcessor` objects that define the button trigger for this pointer.",
      optional: true,
      defaultValue: null
    }]
});
class Pointer extends Primrose.AbstractEventEmitter {
  constructor(name, color, highlight, s, devices, triggerDevices = null, options) {
    super();
    this.name = name;
    this.devices = devices;
    this.triggerDevices = triggerDevices || devices.slice();
    this.options = options;
    this.gazeTimeout = (this.options.gazeLength || 1.5) * 1000;

    this.unproject = null;

    this.picker = new THREE.Raycaster();
    this.showPointer = true;
    this.color = color;
    this.highlight = highlight;
    this.velocity = new THREE.Vector3();
    this.mesh = colored(box(LASER_WIDTH / s, LASER_WIDTH / s, LASER_LENGTH * s), this.color, {
      unshaded: true
    });
    this.mesh.position.z = -1.5;

    this.disk = colored(sphere(TELEPORT_PAD_RADIUS, 128, 3), this.color, {
      unshaded: true
    });
    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach((v) => {
      v.y = 0.1 * (v.y - this.disk.geometry.boundingBox.min.y);
    });
    this.disk.visible = false;
    this.disk.geometry.computeBoundingBox();

    this.gazeInner = colored(circle(GAZE_RING_INNER / 2, 10), 0xc0c0c0, {
      unshaded: true
    });
    this.gazeInner.position.set(0, 0, GAZE_RING_DISTANCE);

    this.gazeInner.add(colored(ring(GAZE_RING_INNER * 0.5, GAZE_RING_INNER * 0.75, 10, 36, 0, 2 * Math.PI), 0xffffff, {
      unshaded: true
    }));

    this.gazeOuter = colored(ring(GAZE_RING_INNER, GAZE_RING_OUTER, 10, 36, 0, 2 * Math.PI), 0xffffff, {
      unshaded: true
    });
    this.gazeOuter.visible = false;
    this.gazeInner.add(this.gazeOuter);

    this.root = new THREE.Object3D();
    this.root.add(this.mesh);
    this.root.add(this.gazeInner);

    this.useGaze = false;
    _(this, {
      lastHit: null
    });
  }

  get useGaze() {
    return this.gazeInner.visible;
  }

  set useGaze(v) {
    this.gazeInner.visible = !!v;
    this.mesh.visible = !v;
  }

  get material(){
    return this.mesh.material;
  }

  set material(v){
    this.mesh.material = v;
    this.disk.material = v;
    this.gazeInner.material = v;
    this.gazeOuter.material = v;
  }

  add(obj) {
    this.root.add(obj);
  }

  addDevice(orientation, trigger){
    if(orientation){
      this.devices.push(orientation);
    }

    if(trigger){
      this.triggerDevices.push(trigger);
    }
  }

  addToBrowserEnvironment(env, scene) {
    pliny.method({
      parent: "Primrose.Pointer",
      name: "addToBrowserEnvironment",
      description: "Add this meshes that give the visual representation of the pointer, to the scene.",
      parameters: [{
        name: "env",
        type: "Primrose.BrowserEnvironment",
        description: "Not used, just here to fulfill a common interface in the framework."
      }, {
        name: "scene",
        type: "THREE.Scene",
        description: "The scene to which to add the 3D cursor."
      }]
    });
    scene.add(this.root);
    scene.add(this.disk);
  }

  get position() {
    return this.root.position;
  }

  get quaternion() {
    return this.root.quaternion;
  }

  get rotation(){
    return this.root.rotation;
  }

  get matrix() {
    return this.root.matrix;
  }

  updateMatrix() {
    return this.root.updateMatrix();
  }

  applyMatrix(m) {
    return this.root.applyMatrix(m);
  }

  update() {
    this.position.set(0, 0, 0);

    if(this.unproject) {
      QUAT_TEMP.set(0, 1, 0, 0);
      VECTOR_TEMP.set(0, 0, 0);
      for(let i = 0; i < this.devices.length; ++i) {
        const obj = this.devices[i];
        if(obj.enabled) {
          VECTOR_TEMP.x += obj.getValue("U");
          VECTOR_TEMP.y += obj.getValue("V");
        }
      }

      VECTOR_TEMP.applyMatrix4(this.unproject)
        .applyQuaternion(QUAT_TEMP);
      this.root.lookAt(VECTOR_TEMP);
    }
    else {
      this.quaternion.set(0, 0, 0, 1);
      EULER_TEMP.set(0, 0, 0, "YXZ");
      for(let i = 0; i < this.devices.length; ++i) {
        const obj = this.devices[i];
        if(obj.enabled) {
          if(obj.quaternion) {
            this.quaternion.multiply(obj.quaternion);
          }
          if(obj.position) {
            this.position.add(obj.position);
          }
        }
      }

      QUAT_TEMP.setFromEuler(EULER_TEMP);
      this.quaternion.multiply(QUAT_TEMP);
    }
    this.root.updateMatrixWorld();
  }

  moveTeleportPad(point){
    this.disk.position
      .copy(point);
  }

  resolvePicking(objects) {
    this.mesh.visible = false;

    this.mesh.material = material("", {
      color: this.color,
      unshaded: true
    });

    if(this.showPointer){
      VECTOR_TEMP.set(0, 0, 0)
        .applyMatrix4(this.root.matrixWorld);
      FORWARD.set(0, 0, -1)
        .applyMatrix4(this.root.matrixWorld)
        .sub(VECTOR_TEMP);
      this.picker.set(VECTOR_TEMP, FORWARD);
      const hits = this.picker.intersectObjects(objects, true),
        currentHit = hits[0],
        _priv = _(this),
        lastHit = _priv.lastHit,
        moved = lastHit && currentHit &&
          (currentHit.point.x !== lastHit.point.x ||
          currentHit.point.y !== lastHit.point.y ||
          currentHit.point.z !== lastHit.point.z),
        dt = lastHit && lastHit.time && (performance.now() - lastHit.time),
        changed = !lastHit && currentHit ||
          lastHit && !currentHit ||
          lastHit && currentHit && currentHit.object.id !== lastHit.object.id,
        evt = {
          pointer: this,
          buttons: 0,
          hit: currentHit,
          lastHit: lastHit
        };

      if(currentHit){
        currentHit.time = performance.now();

        this.mesh.material = material("", {
          color: this.highlight,
          unshaded: true
        });
      }

      if(moved){
        lastHit.point.copy(currentHit.point);
      }

      this.mesh.visible = !this.useGaze;

      if(changed){
        if(lastHit){
          this.emit("exit", evt);
        }
        if(currentHit){
          this.emit("enter", evt);
        }
      }

      var dButtons = 0;
      for(let i = 0; i < this.triggerDevices.length; ++i) {
        const obj = this.triggerDevices[i];
        if(obj.enabled){
          evt.buttons |= obj.getValue("buttons");
          dButtons |= obj.getValue("dButtons");
        }
      }

      if(dButtons){
        if(evt.buttons){
          this.emit("pointerstart", evt);
        }
        else{
          this.emit("pointerend", evt);
        }
      }
      else if(moved) {
        this.emit("pointermove", evt);
      }

      if(this.useGaze){
        if(changed) {
          if(dt !== null && dt < this.gazeTimeout){
            this.gazeOuter.visible = false;
            this.emit("gazecancel", evt);
          }
          if(currentHit){
            this.gazeOuter.visible = true;
            this.emit("gazestart", evt);
          }
        }
        else if(dt !== null) {
          if(dt >= this.gazeTimeout){
            this.gazeOuter.visible = false;
            this.emit("gazecomplete", evt);
            lastHit.time = null;
          }
          else {
            var p = Math.round(36 * dt / this.gazeTimeout),
              a = 2 * Math.PI * p / 36;
            this.gazeOuter.geometry = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 36, p, 0, a);
            if(moved) {
              this.emit("gazemove", evt);
            }
          }
        }
      }

      if(changed){
        _priv.lastHit = currentHit;
      }
    }
  }
}

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel", "exit", "enter"];