pliny.namespace({
  parent: "Primrose",
  name: "Audio",
  description: "The audio namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)."
});

import Audio3D from "./Audio3D";
import Music from "./Music";
import Speech from "./Speech";

export {
  Audio3D,
  Music,
  Speech
};

export default {
  Audio3D,
  Music,
  Speech
};