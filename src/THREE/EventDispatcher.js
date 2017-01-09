import { EventDispatcher } from "three/src/core/EventDispatcher";

EventDispatcher.prototype.emit = function(evt, obj) {
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

EventDispatcher.prototype.forward = function(obj, evts) {
  evts.forEach((type) =>
    this.addEventListener(type, obj.emit.bind(obj, type)));
};
