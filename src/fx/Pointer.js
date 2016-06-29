Primrose.Pointer = (function () {
  "use strict";

  const POINTER_RADIUS = 0.02,
    POINTER_RESCALE = 5,
    TELEPORT_RADIUS = 0.4,
    ORIGIN = new THREE.Vector3(0, 0, 0),
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    LASER_LENGTH = 1,
    moveTo = new THREE.Vector3(0, 0, 0);

  class Pointer {

    constructor(scene, fromObj, length) {
      if (length === undefined) {
        length = LASER_LENGTH;
      }

      this.fromObj = fromObj;

      this.mesh = textured(box(0.01, 0.01, length), 0xff0000, {
        emissive: 0x3f0000
      });
      this.mesh.geometry.vertices.forEach((v) => {
        v.z -= length * 0.5 + 0.5;
      });

      this.disk = textured(sphere(TELEPORT_RADIUS, 128, 3), 0x00ff00, {
        emissive: 0x003f00
      });
      this.disk.geometry.computeBoundingBox();

      this.disk.scale.set(1, 0.1, 1);

      this.stage = textured(box(), 0x00ff00, {
        wireframe: true,
        emissive: 0x003f00
      });


      scene.add(this.mesh);
      scene.add(this.disk);
      scene.add(this.stage);

      this.setStage(0, 0);
    }

    update(stage) {
      this.setStage(stage.sizeX, stage.sizeZ);
      this.mesh.position.set(0, 0, 0);
      this.mesh.quaternion.set(0, 0, 0, 1);
      this.mesh.updateMatrix();
      this.mesh.applyMatrix(this.fromObj.matrixWorld);
      FORWARD.set(0, 0, -1);
      FORWARD.applyMatrix4(this.fromObj.matrixWorld);
      return [this.mesh.position.toArray(), FORWARD.toArray()];
    }

    setStage(sizeX, sizeZ) {
      if (sizeX !== this.stageX || sizeZ !== this.sizeZ) {
        this.stageX = sizeX;
        this.stageZ = sizeZ;
        if (this.stageX * this.stageZ === 0) {
          this.groundMesh = this.disk;
          this.stage.visible = false;
          this.disk.visible = true;
        }
        else {
          var scene = this.stage.parent;
          scene.remove(this.stage);
          this.stage = textured(box(this.stageX, 2.5, this.stageZ), 0x00ff00, {
            wireframe: true,
            emissive: 0x003f00
          });
          this.stage.geometry.computeBoundingBox();
          scene.add(this.stage);
          this.groundMesh = this.stage;
          this.stage.visible = true;
          this.disk.visible = false;
        }
      }
    }

    registerHit(currentHit, isGround) {
      var fp = currentHit.facePoint,
        moveMesh = this.mesh;

      moveTo.fromArray(fp)
        .sub(this.fromObj.position);

      this.groundMesh.visible = isGround;

      if (isGround) {
        var distSq = moveTo.x * moveTo.x + moveTo.z * moveTo.z;
        moveMesh = this.groundMesh;
        //this.mesh.visible = distSq > MAX_MOVE_DISTANCE_SQ;
        if (distSq > MAX_MOVE_DISTANCE_SQ) {
          var dist = Math.sqrt(distSq),
            factor = MAX_MOVE_DISTANCE / dist,
            y = moveTo.y;
          moveTo.y = 0;
          moveTo.multiplyScalar(factor);
          moveTo.y = y;

          this.mesh.material.color.setRGB(1, 1, 0);
          this.mesh.material.emissive.setRGB(0.5, 0.5, 0);
        }
        this.groundMesh.position
          .copy(this.fromObj.position)
          .add(moveTo);
        this.groundMesh.position.y -= this.groundMesh.geometry.boundingBox.min.y;
      }
      else if (moveTo.lengthSq() <= MAX_SELECT_DISTANCE_SQ) {
        this.mesh.material.color.setRGB(0, 1, 0);
        this.mesh.material.emissive.setRGB(0, 0.5, 0);
      }
    }

    reset() {
      this.groundMesh.visible = false;
      this.mesh.visible = true;
      this.mesh.material.color.setRGB(1, 0, 0);
      if (this.mesh.material.emissive) {
        this.mesh.material.emissive.setRGB(0.5, 0, 0);
      }
    }
  }

  return Pointer;
})();