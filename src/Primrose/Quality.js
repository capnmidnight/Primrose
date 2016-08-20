"use strict";

pliny.enumeration({
  parent: "Primrose",
  name: "Quality",
  description: "Graphics quality settings."
});
const Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: Primrose.RESOLUTION_SCALES.length - 1
};