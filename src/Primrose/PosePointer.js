pliny.class({
  parent: "Primrose",
    name: "PoisePointer",
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
    }]
});
class PosePointer extends Primrose.AbstractPointer {
  constructor(name, color, highlight, devices) {
    super(name, color, highlight, devices);
    if(devices.length === 1){
      this.add(colored(box(0.1, 0.025, 0.2), color, {
        emissive: highlight
      }));
    }
  }

  update(){
    this.quaternion.copy(this.orientationDevices[0].quaternion);
    this.position.copy(this.orientationDevices[0].position);
  }
}