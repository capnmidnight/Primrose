import hax from "./hax";

export default function haxClass(target, name, thunk) {
  hax(target, name, (original, args) => {
    thunk(args);
    // bind's context argument
    args.unshift(null);
    var classFunc = original.bind.apply(original, args);
    // totes m'goats you didn't know the parens were optional when instantiating a javascript object.
    return new classFunc;
  });
};
