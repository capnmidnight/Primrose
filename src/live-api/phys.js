/*
pliny.function({
  parent: "Live API",
  name: "phys",
  description: "Make a 3D object react to physics updates."
});
*/

import CANNON from "cannon";
import { Vector3 } from "three";

import Entity from "../Primrose/Controls/Entity";


const TEMP = new Vector3();

export default function phys(obj, options) {
  options = Object.assign({}, options);

  const ent = new Entity(obj.name, options);
  obj.name = "";
  ent.mesh = obj;
  ent.add(obj);
  ent.rigidBody = new CANNON.Body(options);
  ent.rigidBody.position.copy(obj.position);
  ent.rigidBody.quaternion.copy(obj.quaternion);
  obj.position.set(0, 0, 0);
  obj.quaternion.set(0, 0, 0, 1);

  if(!options.disableAutoShape && obj.geometry){
    const g = obj.geometry;
    g.computeBoundingSphere();
    g.computeBoundingBox();
    g.boundingBox.getSize(TEMP);
    const volSphere = g.boundingSphere.radius * g.boundingSphere.radius * Math.PI,
      volBox = TEMP.x * TEMP.y * TEMP.z;

    if(volSphere < volBox){
      ent.rigidBody.addShape(new CANNON.Sphere(g.boundingSphere.radius));
    }
    else {
      TEMP.multiplyScalar(0.5);
      ent.rigidBody.addShape(new CANNON.Box(new CANNON.Vec3().copy(TEMP)));
    }
  }

  return ent;
}
