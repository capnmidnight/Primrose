const TELEPORT_PAD_RADIUS = 0.4,
  FORWARD = new THREE.Vector3(0, 0, -1),
  MAX_SELECT_DISTANCE = 2,
  MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  LASER_WIDTH = 0.01,
  LASER_LENGTH = 3 * LASER_WIDTH,
  EULER_TEMP = new THREE.Euler(),
  moveBy = new THREE.Vector3(0, 0, 0);

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

    this._currentControl = null;
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

    this.disk = textured(sphere(TELEPORT_PAD_RADIUS, 128, 3), this.color, {
      emissive: this.emission
    });
    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach((v) => {
      v.y -= this.disk.geometry.boundingBox.min.y;
    });
    this.disk.geometry.computeBoundingBox();

    this.disk.scale.set(1, 0.1, 1);
  }

  add(obj) {
    this.mesh.add(obj);
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
    scene.add(this.mesh);
    scene.add(this.disk);
  }

  get position() {
    return this.mesh.position;
  }

  get quaternion() {
    return this.mesh.quaternion;
  }

  get matrix() {
    return this.mesh.matrix;
  }

  updateMatrix() {
    return this.mesh.updateMatrix();
  }

  applyMatrix(m) {
    return this.mesh.applyMatrix(m);
  }

  get currentControl() {
    return this._currentControl;
  }

  set currentControl(v) {
    var head = this;
    while (head) {
      head._currentControl = v;
      head = head.parent;
    }
  }

  get lockMovement() {
    var head = this;
    while (head) {
      if (this.currentControl && this.currentControl.lockMovement) {
        return true;
      }
      head = head.parent;
    }
    return false;
  }

  get segment() {
    if (this.showPointer) {
      FORWARD.set(0, 0, -1)
        .applyQuaternion(this.mesh.quaternion)
        .add(this.mesh.position);
      return [this.name, this.mesh.position.toArray(), FORWARD.toArray()];
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

  resolvePicking(currentHits, lastHits, objects) {
    this.disk.visible = false;
    this.mesh.visible = false;

    if (this.showPointer) {
      // reset the mesh color to the base value
      textured(this.mesh, this.color, {
        emissive: this.emission
      });
      this.mesh.visible = true;
      var buttons = 0,
        dButtons = 0,
        currentHit = currentHits[this.name],
        lastHit = lastHits && lastHits[this.name],
        isGround = false,
        object,
        control,
        point;

      for(var i = 0; i < this.triggerDevices.length; ++i) {
        var obj = this.triggerDevices[i];
        if(obj.enabled){
          var v1 = obj.getValue("buttons"),
            v2 = obj.getValue("dButtons");
          buttons += v1;
          dButtons += v2;
        }
      }

      var changed = dButtons !== 0;

      if (currentHit) {
        object = objects[currentHit.objectID];
        isGround = object && object.name === "Ground";

        var fp = currentHit.facePoint;

        point = currentHit.point;
        control = object && (object.button || object.surface);

        moveBy.fromArray(fp)
          .sub(this.mesh.position);

        this.disk.visible = isGround;
        if (isGround) {
          var distSq = moveBy.x * moveBy.x + moveBy.z * moveBy.z;
          if (distSq > MAX_MOVE_DISTANCE_SQ) {
            var dist = Math.sqrt(distSq),
              factor = MAX_MOVE_DISTANCE / dist,
              y = moveBy.y;
            moveBy.y = 0;
            moveBy.multiplyScalar(factor);
            moveBy.y = y;
            textured(this.mesh, 0xffff00, {
              emissive: 0x7f7f00
            });
          }
          this.disk.position
            .copy(this.mesh.position)
            .add(moveBy);
        }
        else {
          textured(this.mesh, 0x00ff00, {
            emissive: 0x007f00
          });
        }
      }

      if (changed) {
        if (!buttons) {
          var lastControl = this.currentControl;

          this.currentControl = null;

          if (object) {
            if (lastControl && lastControl === control) {
              lastControl = null;
            }

            if (!this.currentControl && control) {
              this.currentControl = control;
              this.currentControl.focus();
            }
            else if (isGround) {
              this.emit("teleport", {
                name: this.name,
                position: this.disk.position
              });
            }

            if (this.currentControl) {
              this.currentControl.startUV(point);
            }
          }

          if (lastControl) {
            lastControl.blur();
          }
        }
        else if (this.currentControl) {
          this.currentControl.endPointer();
        }
      }
      else if (!changed && buttons > 0 && this.currentControl && point) {
        this.currentControl.moveUV(point);
      }
    }
  }
}