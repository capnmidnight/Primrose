pliny.namespace({
  parent: "Primrose",
  name: "Network",
  description: "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN."
});

import { default as Manager } from "./Manager";
import { default as RemoteUser } from "./RemoteUser";

import * as Network from ".";
export default Network;