pliny.value({
  name: "PIXEL_SCALES",
  description: "Scaling factors for changing the resolution of the display when the render quality level changes."
});
export const PIXEL_SCALES = [
  0.5,
  0.25,
  0.333333,
  0.5,
  1
];

pliny.value({
  name: "SKINS",
  type: "Array of String",
  description: "A selection of color values that closely match skin colors of people."
});
export const SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
  "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
  "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
  "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
  "#5B0001", "#302E2E"
];

pliny.value({
  name: "SKIN_VALUES",
  type: "Array of Number",
  description: "A selection of color values that closely match skin colors of people."
});
export const SKINS_VALUES = Primrose.SKINS.map(function (s) {
  return parseInt(s.substring(1), 16);
});

pliny.value({
  parent: "Primrose",
  name: "SYS_FONTS",
  type: "String",
  description: "A selection of fonts that will match whatever the user's operating system normally uses."
});
export const SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

pliny.enumeration({
  name: "Quality",
  description: "Graphics quality settings."
});
export const Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};

import * as constants from ".";
export default constants;