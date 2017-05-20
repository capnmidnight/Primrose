export default function haxFunction(target, name, thunk) {
  if(target) {
    var original = target[name];
    if(original) {
      target[name] = function() {
        var args = Array.prototype.slice.call(arguments);
        thunk(args);
        var returnValue = original.apply(target, args);
        return returnValue;
      };
    }
  }
};
