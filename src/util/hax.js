export default function hax(target, name, thunk) {
  var original = target[name];
  if(original) {
    target[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      return thunk(original, args);
    }
  }
};
