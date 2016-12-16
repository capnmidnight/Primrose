pliny.namespace({
  name: "Util",
  description: "A few different utility functions.\n\
\n\
When including Primrose as a `script` tag, the Util functions are imported directly onto the window object and is available without qualification."
});

import cache from "./cache";
import deleteSetting from "./deleteSetting";
import findProperty from "./findProperty";
import getSetting from "./getSetting";
import identity from "./identity";
import immutable from "./immutable";
import mutable from "./mutable";
import setSetting from "./setSetting";
import Workerize from "./Workerize";

export {
  cache,
  deleteSetting,
  findProperty,
  getSetting,
  identity,
  immutable,
  mutable,
  setSetting,
  Workerize
};

export default {
  cache,
  deleteSetting,
  findProperty,
  getSetting,
  identity,
  immutable,
  mutable,
  setSetting,
  Workerize
};