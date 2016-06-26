Primrose.Network.DataChannel = (function () {
  "use strict";

  let INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose.Network",
      name: "DataChannel",
      baseClass: "Primrose.WebRTCSocket",
      description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
      parameters: [{
        name: "proxyServer",
        type: "WebSocket",
        description: "A connection over which to negotiate the peering."
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
  class DataChannel extends Primrose.WebRTCSocket {
    constructor(proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex) {
      super(proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex);

      pliny.property({
        parent: "Primrose.Network.DataChannel",
        name: "dataChannel",
        type: "RTCDataChannel",
        description: "A bidirectional data channel from the remote user to the local user."
      });
      this.dataChannel = null;
    }

    issueRequest() {
      if (goFirst) {
        this._log("Creating data channel");
        this.dataChannel = this.rtc.createDataChannel();
      }
      else {
        this.ondatachannel = (evt) => {
          this._log("Receving data channel");
          this.dataChannel = evt.channel;
        };
      }
    }

    get complete() {
      if (this.goFirst) {
        this._log("[First]: OC %s -> AR %s.",
          this.progress.offer.created,
          this.progress.answer.received);
      }
      else {
        this._log("[Second]: OC %s -> AR %s.",
          this.progress.offer.created,
          this.progress.answer.received);
      }
      return super.complete ||
        (this.goFirst && this.progress.offer.created && this.progress.answer.received ||
          !this.goFirst && this.progress.offer.recieved && this.progress.answer.created);
    }

    teardown() {
      this.rtc.ondatachannel = null;
    }
  }

  return DataChannel;
})();