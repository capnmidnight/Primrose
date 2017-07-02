import hax from "./hax";

export default function haxFunction(target, name, thunk) {
  hax(target, name, (original, args) => {
    thunk(args);
    var returnValue = original.apply(target, args);
    return returnValue;
  });
};
