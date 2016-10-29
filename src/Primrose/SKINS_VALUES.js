pliny.value({
  name: "SKIN_VALUES",
  type: "Array of Number",
  description: "A selection of color values that closely match skin colors of people."
});
const SKINS_VALUES = Primrose.SKINS.map(function (s) {
  return parseInt(s.substring(1), 16);
});