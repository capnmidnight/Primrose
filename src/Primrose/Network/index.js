/*
pliny.namespace({
  parent: "Primrose",
  name: "Network",
  description: "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN."
});
*/

import AudioChannel from "./AudioChannel";
import DataChannel from "./DataChannel";
import Manager from "./Manager";
import RemoteUser from "./RemoteUser";
import WebRTCSocket from "./WebRTCSocket";

export {
  AudioChannel,
  DataChannel,
  Manager,
  RemoteUser,
  WebRTCSocket
};

export default {
  AudioChannel,
  DataChannel,
  Manager,
  RemoteUser,
  WebRTCSocket
};
