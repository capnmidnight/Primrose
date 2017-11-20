/*
pliny.function({
  parent: "Primrose.Displays",
  name: "defaultPose",
  description: "Creates a new copy of the default, base state."
});
*/

export default function defaultPose(){
  return {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1],
    linearVelocity: null,
    linearAcceleration: null,
    angularVelocity: null,
    angularAcceleration: null
  };
};
