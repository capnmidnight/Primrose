import { EventDispatcher, Object3D } from "three";

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

Object3D.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent = function(evt) {
  if (this._listeners === undefined ){
    return;
  }

  var listeners = this._listeners;
  var listenerArray = listeners[ evt.type ];

  if ( listenerArray !== undefined ) {

    if(!(evt instanceof Event)) {
      evt.target = this;
    }

    var array = [], i = 0;
    var length = listenerArray.length;

    for ( i = 0; i < length; i ++ ) {

      array[ i ] = listenerArray[ i ];

    }

    for ( i = 0; i < length; i ++ ) {

      array[ i ].call( this, evt );

    }

  }
};

Object3D.prototype.watch = EventDispatcher.prototype.watch = function(child, events) {
  if(!(events instanceof Array)) {
    events = [events];
  }
  events.forEach((event) =>
    child.addEventListener(event, this.dispatchEvent.bind(this)));
  return this;
};

Object3D.prototype.route = EventDispatcher.prototype.route = function(events, listener) {
  events.forEach((event) =>
    this.addEventListener(event, listener));
  return this;
};

Object3D.prototype.on = EventDispatcher.prototype.on = function(event, listener) {
  this.addEventListener(event, listener);
  return this;
};
