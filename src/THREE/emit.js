import { EventDispatcher } from "three/src/core/EventDispatcher";
import { Object3D } from "three/src/core/Object3D";

Object3D.prototype.emit = EventDispatcher.prototype.emit = function(evt, obj) {
  if(!obj) {
    obj = {};
  }

  if(typeof obj === "object" && !(obj instanceof Event)){
    obj.type = evt;

    if(obj.defaultPrevented === undefined){
      obj.defaultPrevented = false;
      obj.preventDefault = () => obj.defaultPrevented = true;
    }
  }

  this.dispatchEvent(obj);
};