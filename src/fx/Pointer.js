Primrose.Pointer = (function () {
  "use strict";

  const TELEPORT_PAD_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    LASER_WIDTH = 0.01,
    LASER_LENGTH = 3 * LASER_WIDTH,
    EULER_TEMP = new THREE.Euler(),
    moveTo = new THREE.Vector3(0, 0, 0);

  pliny.class({
    parent: "Primrose",
      name: "Pointer",
      baseClass: "Primrose.AbstractEventEmitter",
      description: "A device that points into the scene somewhere, casting a ray at objects for picking operations.",
      parameters: [{
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
        name: "orientationDevice",
        type: "Primrose.InputProcessor",
        description: "The input object that defines the orientation for this pointer."
      }, {
        name: "positionDevice",
        type: "Primrose.PoseInputProcessor",
        description: "The input object that defines the position for this pointer.",
        optional: true,
        defaultValue: null
      }]
  });
  class Pointer extends Primrose.AbstractEventEmitter {
    constructor(color, emission, isHand, orientationDevice, positionDevice = null) {
      super();
      this.orientationDevice = orientationDevice;
      this.positionDevice = positionDevice || orientationDevice;
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
      this.disk.geometry.vertices.forEach((v) => v.y -= this.disk.geometry.boundingBox.min.y);
      this.disk.geometry.computeBoundingBox();

      this.disk.scale.set(1, 0.1, 1);

      if (isHand) {
        this.mesh.add(textured(box(0.1, 0.025, 0.2), this.color, {
          emissive: this.emission
        }));
      }
    }

    add(obj) {
      this.mesh.add(obj);
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

    get segment() {
      if (this.showPointer) {
        FORWARD.set(0, 0, -1)
          .applyQuaternion(this.mesh.quaternion)
          .add(this.mesh.position);
        return [this.name, this.mesh.position.toArray(), FORWARD.toArray()];
      }
    }

    update() {
      if (this.orientationDevice instanceof Primrose.PoseInputProcessor) {
        this.position.copy(this.orientationDevice.position);
        this.quaternion.copy(this.orientationDevice.quaternion);
      }
      else {

        var head = this.orientationDevice,
          pitch = 0,
          heading = 0;
        while (head) {
          pitch += head.getValue("pitch");
          heading += head.getValue("heading");
          head = head.parent;
        }

        EULER_TEMP.set(pitch, heading, 0, "YXZ");
        this.quaternion.setFromEuler(EULER_TEMP);
        this.position.copy(this.positionDevice.position);
      }
    }

    resolvePicking(currentHits, lastHits, objects) {
      this.disk.visible = false;
      this.mesh.visible = false;

      if (this.orientationDevice.enabled && this.showPointer) {
        // reset the mesh color to the base value
        textured(this.mesh, this.color, {
          emissive: this.minorColor
        });
        this.mesh.visible = true;
        var buttons = 0,
          dButtons = 0,
          currentHit = currentHits[this.name],
          lastHit = lastHits && lastHits[this.name],
          head = this.orientationDevice,
          isGround = false,
          object,
          control,
          point;

        while (head) {
          buttons += head.getValue("buttons");
          dButtons += head.getValue("dButtons");
          head = head.parent;
        }

        var changed = dButtons !== 0;

        if (currentHit) {
          object = objects[currentHit.objectID];
          isGround = object && object.name === "Ground";

          var fp = currentHit.facePoint;

          point = currentHit.point;
          control = object && (object.button || object.surface);

          moveTo.fromArray(fp)
            .sub(this.mesh.position);

          this.disk.visible = isGround;
          if (isGround) {
            var distSq = moveTo.x * moveTo.x + moveTo.z * moveTo.z;
            if (distSq > MAX_MOVE_DISTANCE_SQ) {
              var dist = Math.sqrt(distSq),
                factor = MAX_MOVE_DISTANCE / dist,
                y = moveTo.y;
              moveTo.y = 0;
              moveTo.multiplyScalar(factor);
              moveTo.y = y;
              textured(this.mesh, 0xffff00, {
                emissive: 0x7f7f00
              });
            }
            this.disk.position
              .copy(this.mesh.position)
              .add(moveTo);
          }
          else {
            textured(this.mesh, 0x00ff00, {
              emissive: 0x007f00
            });
          }
        }

        if (changed) {
          if (buttons) {
            var blurCurrentControl = !!this.currentControl,
              currentControl = this.currentControl;
            this.currentControl = null;

            if (object) {
              if (currentControl && currentControl === control) {
                blurCurrentControl = false;
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

            if (blurCurrentControl) {
              currentControl.blur();
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

  }

  return Pointer;
})();