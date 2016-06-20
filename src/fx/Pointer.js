Primrose.Pointer = (function(){
  "use strict";

  const POINTER_RADIUS = 0.02,
    POINTER_RESCALE = 20,
    FORWARD = new THREE.Vector3(0, 0, -1),
    DISTANCE = new THREE.Vector3(0, 0, 0),
    MAX_SELECT_DISTANCE = 2,
    MAX_SELECT_DISTANCE_SQ = MAX_SELECT_DISTANCE * MAX_SELECT_DISTANCE,
    MAX_MOVE_DISTANCE = 5,
    MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE;

  class Pointer{

    constructor(scene){
      this.mesh = textured(sphere(POINTER_RADIUS, 10, 10), 0xff0000);
      this.groundMesh = textured(sphere(POINTER_RADIUS * POINTER_RESCALE, 32, 3), 0x00ff00);
      this.groundMesh.visible = false;
      this.groundMesh.scale.set(1, 0.1, 1);

      scene.add(this.mesh);
      scene.add(this.groundMesh);
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

    registerHit(currentHit, player, isGround){
      var fp = currentHit.facePoint,
        fn = currentHit.faceNormal,
        moveMesh = this.mesh;

      DISTANCE.set(
        fp[0] + fn[0] * POINTER_RADIUS,
        fp[1] + fn[1] * POINTER_RADIUS,
        fp[2] + fn[2] * POINTER_RADIUS)
        .sub(player.position);


      if(isGround){
        this.mesh.material.color.setRGB(1, 1, 0);
        //this.mesh.material.emissive.setRGB(0.25, 0.25, 0);
        this.mesh.scale.set(1, 1, 1);
        var distSq = DISTANCE.x * DISTANCE.x + DISTANCE.z * DISTANCE.z;
        moveMesh = this.groundMesh;
        this.mesh.visible = false;
        if(distSq > MAX_MOVE_DISTANCE_SQ){
          var dist = Math.sqrt(distSq);
          DISTANCE.x *= MAX_MOVE_DISTANCE / dist;
          DISTANCE.z *= MAX_MOVE_DISTANCE / dist;
          this.mesh.visible = true;
        }
      }
      else{
        this.groundMesh.visible = false;
        if(DISTANCE.lengthSq() > MAX_SELECT_DISTANCE_SQ) {
          return;
        }
        this.mesh.scale.set(0.5, 1, 0.5);
      }

      moveMesh.visible = true;
      moveMesh.position.copy(player.position).add(DISTANCE);
      moveMesh.material.color.setRGB(0, 1, 0);
      //moveMesh.material.emissive.setRGB(0.25, 0.25, 0.25);
    }

    reset(){
      this.groundMesh.visible = false;
      this.mesh.material.color.setRGB(1, 0, 0);
      //this.mesh.material.emissive.setRGB(0.25, 0, 0);
      this.mesh.scale.set(1, 1, 1);
    }
  }

  return Pointer;
})();