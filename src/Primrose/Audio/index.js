pliny.namespace({
  parent: "Primrose",
  name: "Audio",
  description: "The audio namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)."
});

import { default as Audio3D } from "./Audio3D";
import { default as Music } from "./Music";
import { default as Speech } from "./Speech";

import * as Audio from "."
export default Audio;