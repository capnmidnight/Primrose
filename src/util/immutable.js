/*
pliny.function({
  parent: "Util",
  name: "immutable",
  description: "Define an enumerable property that cannot be modified.",
  returns: "Property",
  parameters: [{
    name: "value",
    type: "Object",
    optional: true,
    description: "The initial value for the property."
  }]
});
*/

export default function immutable(value) {
  const getter = (typeof value === "function") ? value : function () {
    return value;
  };
  return {
    enumerable: true,
    configurable: true,
    get: getter,
    set: function() {
      throw new Error("This value is immutable and may only be read, not written.");
    }
  };
};
