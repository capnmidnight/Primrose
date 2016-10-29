pliny.function({
  name: "light",
  description: "Shortcut function for creating a new THREE.PointLight object.",
  parameters: [{
    name: "color",
    type: "Number",
    optional: true,
    description: "The RGB color value for the light.",
    default: "0xffffff"
  }, {
    name: "intensity",
    type: "Number",
    optional: true,
    description: "The strength of the light.",
    default: 1
  }, {
    name: "distance",
    type: "Number",
    optional: true,
    description: "The distance the light will shine.",
    default: 0
  }, {
    name: "decay",
    type: "Number",
    optional: true,
    description: "How much the light dims over distance.",
    default: 1
  }],
  returns: "THREE.PointLight",
  examples: [{
    name: "Basic usage",
    description: "    grammar(\"JavaScript\");\n\
    put(light(0xffff00)).on(scene).at(0, 100, 0);"
  }]
});

function light(color, intensity, distance, decay) {
  return new THREE.PointLight(color, intensity, distance, decay);
}