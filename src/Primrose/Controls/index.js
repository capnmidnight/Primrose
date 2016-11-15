pliny.namespace({
  name: "Controls",
  parent: "Primrose",
  description: "Various 3D control objects."
});

import { default as BaseControl } from "./BaseControl";
import { default as Button2D } from "./Button2D";
import { default as Button3D } from "./Button3D";
import { default as ButtonFactory } from "./ButtonFactory";
import { default as Entity } from "./Entity";
import { default as Form } from "./Form";
import { default as Image } from "./Image";
import { default as Label } from "./Label";
import { default as Progress } from "./Progress";
import { default as Surface } from "./Surface";
import { default as VUMeter } from "./VUMeter";

import * as Controls from ".";
export default Controls;