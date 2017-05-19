export default function haxClass(target, name, thunk) {
  var original = target[name];
  if(original) {
    target[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      thunk(args);
      // bind's context argument
      args.unshift(null);
      var classFunc = original.bind.apply(original, args);
      // totes m'goats you didn't know the parens were optional when instantiating a javascript object.
      return new classFunc;
    };
  }
};
