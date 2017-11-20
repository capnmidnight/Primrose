/*
pliny.class({
  parent: "Primrose.Network",
    name: "DataChannel",
    baseClass: "Primrose.WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{
      name: "requestICEPath",
      type: "string",
      description: "A request path at which to retrieve the extra ICE servers to use with the connection."
    }, {
      name: "fromUserName",
      type: "String",
      description: "The name of the local user, from which the peering is being initiated."
    }, {
      name: "fromUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is performing the peering operation."
    }, {
      name: "toUserName",
      type: "String",
      description: "The name of the remote user, to which the peering is being requested."
    }, {
      name: "toUserIndex",
      type: "Number",
      description: "For users with multiple devices logged in at one time, this is the index of the device that is receiving the peering operation."
    }]
});
*/

import WebRTCSocket from "./WebRTCSocket";

let INSTANCE_COUNT = 0;

export default class DataChannel extends WebRTCSocket {
  constructor(requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    super(requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond);

    /*
    pliny.property({
      parent: "Primrose.Network.DataChannel",
      name: "dataChannel",
      type: "RTCDataChannel",
      description: "A bidirectional data channel from the remote user to the local user."
    });
    */
    this.dataChannel = null;
  }

  issueRequest() {
    if (this.goFirst) {
      this._log(0, "Creating data channel");
      this.dataChannel = this.rtc.createDataChannel();
    }
    else {
      this.ondatachannel = (evt) => {
        this._log(0, "Receving data channel");
        this.dataChannel = evt.channel;
      };
    }
  }

  get complete() {
    if (this.goFirst) {
      this._log(1, "[First]: OC %s -> AR %s.",
        this.progress.offer.created,
        this.progress.answer.received);
    }
    else {
      this._log(1, "[Second]: OC %s -> AR %s.",
        this.progress.offer.created,
        this.progress.answer.received);
    }
    return super.complete ||
      (this.goFirst && this.progress.offer.created && this.progress.answer.received ||
        !this.goFirst && this.progress.offer.received && this.progress.answer.created);
  }

  teardown() {
    this.rtc.ondatachannel = null;
  }
}
