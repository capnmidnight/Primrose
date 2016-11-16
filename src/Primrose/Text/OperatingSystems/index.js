pliny.namespace({
  parent: "Primrose.Text",
  name: "OperatingSystems",
  description: "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems."
});


import { default as Linux } from "./Linux";
import { default as macOS } from "./macOS";
import { default as OperatingSystem } from "./OperatingSystem";
import { default as Windows } from "./Windows";

import * as OperatingSystems from ".";
export default OperatingSystems;