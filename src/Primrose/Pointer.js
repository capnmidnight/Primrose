const EULER_TEMP = new THREE.Euler();

pliny.class({
  parent: "Primrose",
    name: "Pointer",
    baseClass: "Primrose.AbstractPointer",
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
    }]
});
class Pointer extends Primrose.AbstractPointer {
  constructor(name, color, highlight, orientationDevices, positionDevices = null) {
    super(name, color, highlight, orientationDevices, positionDevices);
    this.unproject = null;
  }

  update() {
    var pitch = 0,
      heading = 0,
      x = 0,
      y = 0,
      z = 0;
    for(let i = 0; i < this.orientationDevices.length; ++i) {
      const obj = this.orientationDevices[i];
      if(obj.enabled) {
        pitch += obj.getValue("pitch");
        heading += obj.getValue("heading");
      }
    }

    EULER_TEMP.set(pitch, heading, 0, "YXZ");
    this.quaternion.setFromEuler(EULER_TEMP);

    for(let i = 0; i < this.positionDevices.length; ++i) {
      const obj = this.positionDevices[i];
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

    this.position.set(x, y, z);
  }
}