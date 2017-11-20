/*
pliny.enumeration({
  parent: "Primrose.Constants",
  name: "Quality",
  description: "Graphics quality settings."
});
*/

import PIXEL_SCALES from "./PIXEL_SCALES";

export default {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};
