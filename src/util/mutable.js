/*
pliny.function({
  parent: "Util",
  name: "mutable",
  description: "Define an enumerable property that can be modified, with type optional checking.",
  returns: "Property",
  parameters: [{
    name: "value",
    type: "Object",
    optional: true,
    description: "The initial value for the property."
  }, {
    name: "type",
    type: "string or Function",
    optional: true,

  }]
});
*/

export default function mutable(value, type) {
  if(!type) {
    return {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: function(v) {
        value = v;
      }
    };
  }
  else if(typeof type === "function") {
    return {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: function(v) {
        if(v instanceof type) {
          throw new Error("Value must be a " + type + ": " + v);
        }
        value = v;
      }
    };
  }
  else {
    return {
      enumerable: true,
      configurable: true,
      get: function() {
        return value;
      },
      set: function(v) {
        var t = typeof v;
        if(t !== type) {
          throw new Error("Value must be a " + type + ". An " + t + " was provided instead: " + v);
        }
        value = v;
      }
    };
  }
};
