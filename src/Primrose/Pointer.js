const TELEPORT_PAD_RADIUS = 0.4,
  FORWARD = new THREE.Vector3(0, 0, -1),
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  EULER_TEMP = new THREE.Euler(),
  GAZE_TIMEOUT = 1000,
  GAZE_RING_INNER = 0.01,
  GAZE_RING_OUTER = 0.02,

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
      name: "emission",
      type: "Number",
      description: "The color to use to highlight the teleport pad and 3D pointer cursor so that it's not 100% black outside of lighted areas."
    }, {
      name: "isHand",
      type: "Boolean",
      description: "Pass true to add a hand model at the origin of the pointer ray."
    }, {
      name: "orientationDevices",
      type: "Array",
      description: "An Array of `Primrose.InputProcessor` objects that define the orientation for this pointer."
    }, {
      name: "positionDevices",
      type: "Array",
      description: "An Array of `Primrose.PoseInputProcessor` objects that define the position for this pointer.",
      optional: true,
      defaultValue: null
    }, {
      name: "triggerDevices",
      type: "Array",
      description: "An Array of `Primrose.InputProcessor` objects that define the button trigger for this pointer.",
      optional: true,
      defaultValue: null
    }]
});
class Pointer extends Primrose.AbstractEventEmitter {
  constructor(name, color, emission, orientationDevices, positionDevices = null, triggerDevices = null) {
    super();
    this.name = name;
    this.orientationDevices = orientationDevices;
    this.positionDevices = positionDevices || orientationDevices.slice();
    this.triggerDevices = triggerDevices || orientationDevices.slice();

    this.showPointer = true;
    this.color = color;
    this.emission = emission;
    this.velocity = new THREE.Vector3();
    this.mesh = textured(box(LASER_WIDTH, LASER_WIDTH, LASER_LENGTH), this.color, {
      emissive: this.emission
    });

    var arr = this.mesh.geometry.attributes.position;
    for(var i = 2; i < arr.array.length; i += arr.itemSize){
      arr.array[i] -= LASER_LENGTH * 0.5 + 0.5;
    }

    this.disk = textured(sphere(TELEPORT_PAD_RADIUS, 128, 3), this.material);
    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach((v) => {
      v.y = 0.1 * (v.y - this.disk.geometry.boundingBox.min.y);
    });
    this.disk.visible = false;
    this.disk.geometry.computeBoundingBox();

    this.gazeInner = new THREE.Mesh( new THREE.CircleBufferGeometry( GAZE_RING_INNER / 2, 10 ), this.material );
    this.gazeInner.position.set(0, 0, -0.5);

    this.gazeOuter = new THREE.Mesh( new THREE.RingBufferGeometry( GAZE_RING_INNER, GAZE_RING_OUTER, 10, 1, 0, 0 ), this.material );
    this.gazeOuter.visible = false;
    this.gazeInner.add(this.gazeOuter);

    this.root = new THREE.Object3D();
    this.add(this.mesh);
    this.add(this.gazeInner);

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

  addDevice(orientation, position, trigger){
    if(orientation){
      this.orientationDevices.push(orientation);
    }

    if(position){
      this.positionDevices.push(position);
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

  get matrix() {
    return this.root.matrix;
  }

  updateMatrix() {
    return this.root.updateMatrix();
  }

  applyMatrix(m) {
    return this.root.applyMatrix(m);
  }

  get segment() {
    if (this.showPointer) {
      FORWARD.set(0, 0, -1)
        .applyQuaternion(this.root.quaternion)
        .add(this.root.position);
      return [this.name, this.root.position.toArray(), FORWARD.toArray()];
    }
  }

  update() {
    if (this.orientationDevices[0] instanceof Primrose.PoseInputProcessor) {
      this.position.copy(this.orientationDevices[0].position);
      this.quaternion.copy(this.orientationDevices[0].quaternion);
    }
    else {
      var pitch = 0,
        heading = 0,
        x = 0,
        y = 0,
        z = 0,
        i,
        obj;

      for(i = 0; i < this.orientationDevices.length; ++i) {
        obj = this.orientationDevices[i];
        if(obj.enabled) {
          pitch += obj.getValue("pitch");
          heading += obj.getValue("heading");
        }
      }

      for(i = 0; i < this.positionDevices.length; ++i) {
        obj = this.positionDevices[i];
        if(obj.enabled) {
          if(obj.position){
            x += obj.position.x;
            y += obj.position.y;
            z += obj.position.z;
          }
          else{
            x += obj.getValue("X");
            y += obj.getValue("Y");
            z += obj.getValue("Z");
          }
        }
      }

      EULER_TEMP.set(pitch, heading, 0, "YXZ");
      this.quaternion.setFromEuler(EULER_TEMP);
      this.position.set(x, y, z);
    }
  }

  moveTeleportPad(point){
    this.disk.position
      .copy(point);
  }

  resolvePicking(currentHit) {
    this.mesh.visible = false;

    if (this.showPointer) {
      const _priv = _(this),
        lastHit = _priv.lastHit,
        moved = lastHit && currentHit &&
          (currentHit.facePoint[0] !== lastHit.facePoint[0] ||
          currentHit.facePoint[1] !== lastHit.facePoint[1] ||
          currentHit.facePoint[2] !== lastHit.facePoint[2]),
        dt = lastHit && lastHit.time && (performance.now() - lastHit.time),
        changed = !lastHit && currentHit ||
          lastHit && !currentHit ||
          lastHit && currentHit && currentHit.objectID !== lastHit.objectID,
        evt = {
          pointer: this,
          buttons: 0,
          hit: currentHit,
          lastHit: lastHit
        };

      if(moved){
        lastHit.facePoint[0] = currentHit.facePoint[0];
        lastHit.facePoint[1] = currentHit.facePoint[1];
        lastHit.facePoint[2] = currentHit.facePoint[2];
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
      for(var i = 0; i < this.triggerDevices.length; ++i) {
        var obj = this.triggerDevices[i];
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
          if(dt !== null && dt < GAZE_TIMEOUT){
            this.gazeOuter.visible = false;
            this.emit("gazecancel", evt);
          }
          if(currentHit){
            this.gazeOuter.visible = true;
            this.emit("gazestart", evt);
          }
        }
        else if(dt !== null) {
          if(dt >= GAZE_TIMEOUT){
            this.gazeOuter.visible = false;
            this.emit("gazecomplete", evt);
            lastHit.time = null;
          }
          else {
            var p = Math.round(36 * dt / GAZE_TIMEOUT),
              a = 2 * Math.PI * p / 36;
            this.gazeOuter.geometry = cache(
              `RingBufferGeometry(${GAZE_RING_INNER}, ${GAZE_RING_OUTER}, ${p}, 1, 0, ${a})`,
              () => new THREE.RingBufferGeometry( GAZE_RING_INNER, GAZE_RING_OUTER, p, 1, 0, a ));
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