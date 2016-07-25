Primrose.Input.Pointer = (function () {
  "use strict";

  class Pointer {
    constructor(scene, color = 0xff0000, minorColor = 0x7f0000) {
      this.color = color;
      this.minorColor = minorColor;
      this.showPointer = true;
      this.position = new THREE.Vector3();
      this.velocity = new THREE.Vector3();
      this.quaternion = new THREE.Quaternion();
      this.euler = new THREE.Euler();
      this.mesh = textured(box(LASER_WIDTH, LASER_WIDTH, LASER_LENGTH), this.color, {
        emissive: this.minorColor
      });
      this.mesh.geometry.vertices.forEach((v) => {
        v.z -= LASER_LENGTH * 0.5 + 0.5;
      });

      this.disk = textured(sphere(TELEPORT_RADIUS, 128, 3), this.color, {
        emissive: this.minorColor
      });
      this.disk.geometry.computeBoundingBox();
      this.disk.geometry.vertices.forEach((v) => v.y -= this.disk.geometry.boundingBox.min.y);
      this.disk.geometry.computeBoundingBox();

      this.disk.scale.set(1, 0.1, 1);

      this.groundMesh = this.disk;

      this.stageGrid = textured(box(), this.color, {
        wireframe: true,
        emissive: this.minorColor
      });

      scene.add(this.mesh);
      scene.add(this.disk);
      scene.add(this.stageGrid);
    }
  }

  return Pointer;
})();