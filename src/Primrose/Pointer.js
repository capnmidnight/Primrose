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
    this.mesh.geometry.vertices.forEach((v) => {
      v.z -= LASER_LENGTH * 0.5 + 0.5;
    });
    this.gazeMesh = new THREE.Mesh( new THREE.RingBufferGeometry( 0.04, 0.08, 10, 1, 0, 0 ), this.mesh.material );
    this.gazeMesh.position.set(0, 0, -0.5);
    this.gazeMesh.visible = false;
    this.useGaze = false;

    this.root = new THREE.Object3D();
    this.add(this.mesh);
    this.add(this.gazeMesh);

    _(this, {
      firstGaze: null,
      lastHit: null
    });
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

  resolvePicking(currentHit) {
    this.mesh.visible = false;

    if (this.showPointer) {
      const _priv = _(this),
        lastHit = _priv.lastHit,
        moved = lastHit && currentHit &&
          (currentHit.facePoint[0] !== lastHit.facePoint[0] ||
          currentHit.facePoint[1] !== lastHit.facePoint[1] ||
          currentHit.facePoint[2] !== lastHit.facePoint[2]),
        evt = {
          name: this.name,
          buttons: 0,
          hit: currentHit,
          lastHit: lastHit
        };

      if(moved){
        lastHit.facePoint[0] = currentHit.facePoint[0];
        lastHit.facePoint[1] = currentHit.facePoint[1];
        lastHit.facePoint[2] = currentHit.facePoint[2];
      }

      // reset the mesh color to the base value
      textured(this.mesh, this.color, {
        emissive: this.emission
      });
      this.mesh.visible = !this.useGaze;

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
        var firstGaze = _priv.firstGaze;
        const dt = firstGaze && firstGaze.time && (performance.now() - firstGaze.time);

        if(firstGaze && (!currentHit || currentHit.objectID !== firstGaze.objectID)) {
          if(dt !== null && dt < GAZE_TIMEOUT){
            this.gazeMesh.visible = false;
            this.emit("gazecancel", evt);
          }
          _priv.firstGaze = firstGaze = null;
        }

        if(currentHit){
          if(!firstGaze) {
            _priv.firstGaze = firstGaze = currentHit;

            this.gazeMesh.visible = true;
            this.emit("gazestart", {
              name: this.name,
              objectID: currentHit.objectID
            });
          }
          else if(dt !== null && dt >= GAZE_TIMEOUT){
            this.gazeMesh.visible = false;
            this.emit("gazecomplete", evt);
            firstGaze.time = null;
          }
          else {
            var p = Math.round(36 * dt / GAZE_TIMEOUT),
              a = 2 * Math.PI * p / 36;
            this.gazeMesh.geometry = cache(
              `RingBufferGeometry(${GAZE_RING_INNER}, ${GAZE_RING_OUTER}, ${p}, 1, 0, ${a})`,
              () => new THREE.RingBufferGeometry( GAZE_RING_INNER, GAZE_RING_OUTER, p, 1, 0, a ));
            if(moved) {
              this.emit("gazemove", evt);
            }
          }
        }
      }

      _priv.lastHit = currentHit;
    }
  }
}

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel"];