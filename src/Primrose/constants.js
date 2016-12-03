pliny.namespace({
  parent: "Primrose",
  name: "Constants",
  description: "Useful values that are used frequently."
})

pliny.value({
  parent: "Primrose.Constants",
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
  parent: "Primrose.Constants",
  name: "SKINS",
  type: "Array of Number",
  description: "A selection of color values that closely match skin colors of people."
});
export const SKINS = [0xFFDFC4, 0xF0D5BE, 0xEECEB3, 0xE1B899, 0xE5C298, 0xFFDCB2, 0xE5B887, 0xE5A073, 0xE79E6D, 0xDB9065, 0xCE967C, 0xC67856, 0xBA6C49, 0xA57257, 0xF0C8C9, 0xDDA8A0, 0xB97C6D, 0xA8756C, 0xAD6452, 0x5C3836, 0xCB8442, 0xBD723C, 0x704139, 0xA3866A, 0x870400, 0x710101, 0x430000, 0x5B0001, 0x302E2E ];

pliny.value({
  parent: "Primrose.Constants",
  name: "SYS_FONTS",
  type: "String",
  description: "A selection of fonts that will match whatever the user's operating system normally uses."
});
export const SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

pliny.enumeration({
  parent: "Primrose.Constants",
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

const constants = {
  PIXEL_SCALES,
  SKINS,
  SYS_FONTS,
  Quality
};
export default constants;