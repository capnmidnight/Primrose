Primrose.Pointer = (function(){
  "use strict";

  const POINTER_RADIUS = 0.02,
    POINTER_RESCALE = 5,
    TELEPORT_RADIUS = 0.4,
    FORWARD = new THREE.Vector3(0, 0, -1),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
    moveTo = new THREE.Vector3(0, 0, 0);

  class Pointer{

    constructor(scene){
      this.mesh = textured(sphere(POINTER_RADIUS, 10, 10), 0xff0000, {
        emissive: 0x3f0000
      });

      this.disk = textured(sphere(TELEPORT_RADIUS, 32, 3), 0x00ff00, {
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

    move(lockedToEditor, inVR, qHeading, camera, player){
      this.mesh.position.copy(FORWARD);
      if (inVR && !isMobile) {
        this.mesh.position.applyQuaternion(qHeading);
      }
      if (!lockedToEditor || isMobile) {
        this.mesh.position.add(camera.position);
        this.mesh.position.applyQuaternion(camera.quaternion);
      }
      this.mesh.position.applyQuaternion(player.quaternion);
      this.mesh.position.add(player.position);
    }

    get position(){
      return this.mesh.position;
    }

    setStage(sizeX, sizeZ){
      if(sizeX !== this.stageX || sizeZ !== this.sizeZ){
        this.stageX = sizeX;
        this.stageZ = sizeZ;
        if(this.stageX * this.stageZ === 0){
          this.groundMesh = this.disk;
          this.stage.visible = false;
          this.disk.visible = true;
        }
        else{
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

    registerHit(currentHit, player, isGround){
      var fp = currentHit.facePoint,
        moveMesh = this.mesh;

      moveTo.fromArray(fp)
        .sub(player.position);

      this.groundMesh.visible = isGround;

      if(isGround){
        var distSq = moveTo.x * moveTo.x + moveTo.z * moveTo.z;
        moveMesh = this.groundMesh;
        this.mesh.visible = distSq > MAX_MOVE_DISTANCE_SQ;
        if(this.mesh.visible){
          this.mesh.scale.set(1, 1, 1);
          var dist = Math.sqrt(distSq),
            factor = MAX_MOVE_DISTANCE / dist,
            y = moveTo.y;
          moveTo.multiplyScalar(factor);
          this.mesh.material.color.setRGB(1, 1, 0);
          this.mesh.material.emissive.setRGB(0.5, 0.5, 0);
          this.mesh.scale.set(POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE);
          this.mesh.position.copy(player.position).add(moveTo);
          moveTo.y = y;
        }
        this.groundMesh.position.copy(player.position).add(moveTo);
        this.groundMesh.position.y -= this.groundMesh.geometry.boundingBox.min.y;
      }
      else if(moveTo.lengthSq() <= MAX_SELECT_DISTANCE_SQ) {
        this.mesh.scale.set(0.5, 1, 0.5);
        this.mesh.material.color.setRGB(0, 1, 0);
        this.mesh.material.emissive.setRGB(0, 0.5, 0);
        this.mesh.position.copy(player.position).add(moveTo);
      }
    }

    reset(){
      this.groundMesh.visible = false;
      this.mesh.visible = true;
      this.mesh.material.color.setRGB(1, 0, 0);
      this.mesh.material.emissive.setRGB(0.5, 0, 0);
      this.mesh.scale.set(1, 1, 1);
    }
  }

  return Pointer;
})();