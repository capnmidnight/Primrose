const PEERING_TIMEOUT_LENGTH = 30000;

// some useful information:
// - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
// - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
// - https://github.com/coturn/rfc5766-turn-server/
let ICE_SERVERS = [{
  urls: [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302"
  ]
}];

let INSTANCE_COUNT = 0;

pliny.class({
  parent: "Primrose",
  name: "WebRTCSocket",
  baseClass: "Primrose.AbstractEventEmitter",
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
class WebRTCSocket extends Primrose.AbstractEventEmitter {
  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  constructor(requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    super();
    // These logging constructs are basically off by default, but you will need them if you ever
    // need to debug the WebRTC workflow.
    let attemptCount = 0;
    const MAX_LOG_LEVEL = 5,
      instanceNumber = ++INSTANCE_COUNT,
      print = function (name, level, format) {
        if (level < MAX_LOG_LEVEL) {
          const args = [
            "%s: " + format,
            level
          ];
          for (var i = 3; i < arguments.length; ++i) {
            args.push(arguments[i]);
          }
          console[name].apply(console, args);
        }
        return arguments[3];
      };

    this.myResult = null;
    this.theirResult = null;
    this._timeout = null;
    this._log = print.bind(null, "log");
    this._error = print.bind(null, "error", 0);
    this.fromUserName = fromUserName;
    this.fromUserIndex = fromUserIndex;
    this.toUserName = toUserName;
    this.toUserIndex = toUserIndex;
    this.rtc = null;
    this.goFirst = !goSecond;
    this.progress = {
      offer: {
        created: false,
        received: false
      },
      answer: {
        created: false,
        recieved: false
      }
    };
    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", this.close.bind(this));

    let resolve = null, reject = null;

    const done = (isError) => {
      this._log(2, "Tearing down event handlers");
      this.clearTimeout();
      this.rtc.onsignalingstatechange = null;
      this.rtc.oniceconnectionstatechange = null;
      this.rtc.onnegotiationneeded = null;
      this.rtc.onicecandidate = null;

      this.teardown();
      if (isError) {
        this.close();
      }
    };

    // A pass-through function to include in the promise stream to see if the channels have all been
    // set up correctly and ready to go.
    const check = (obj) => {
      if (this.complete) {
        this._log(1, "Timeout avoided.");
        done();
        resolve();
      }
      return obj;
    };

    // When an offer or an answer is received, it's pretty much the same exact processing. Either
    // type of object gets checked to see if it was expected, then unwrapped.
    this.peering_answer = (description) => {
      this._log(1, "description", description);
      // Check to see if we expected this sort of message from this user.
      this.recordProgress(description.item, "received");
      // The description we received is always the remote description, regardless of whether or not it's an offer
      // or an answer.
      return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

        // check to see if we're done.
        .then(check)

        // and if there are any errors, bomb out and shut everything down.
        .catch(this.peering_cancel);
    };

    // When an offer or an answer is created, it's pretty much the same exact processing. Either type
    // of object gets wrapped with a context identifying which peer channel is being negotiated, and
    // then transmitted through the negotiation server to the remote user.
    this.descriptionCreated = (description) => {
      this.recordProgress(description, "created");

      // The description we create is always the local description, regardless of whether or not it's an offer
      // or an answer.
      return this.rtc.setLocalDescription(description)
        // Let the remote user know what happened.
        .then(() => this.emit(description.type, description))
        // check to see if we're done.
        .then(check)
        // and if there are any errors, bomb out and shut everything down.
        .catch(this.peering_cancel);
    };

    // A catch-all error handler to shut down the world if an error we couldn't handle happens.
    this.peering_cancel = (exp) => {
      this._error(exp);
      this.emit("cancel", exp);
      this._log(1, "Timeout avoided, but only because of an error.");
      done(true);
      reject(exp);
    };

    // When an offer is received, we need to create an answer in reply.
    this.peering_offer = (offer) => {
      this._log(1, "offer", offer);
      var promise = this.peering_answer(offer);
      if (promise) {
        return promise.then(() => this.rtc.createAnswer())
          .then(this.descriptionCreated);
      }
    };

    // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
    // with enough information for the remote user to be able to connect to it.
    this.peering_ice = (ice) => {
      this._log(1, "ice", ice);
      var candidate = new RTCIceCandidate(ice.item);
      return this.rtc.addIceCandidate(candidate)
        .catch(this._error);
    };

    this.peering_peer = (evt) => {
      this._log(1, "peering", evt);
      this.hasRTC.then(() => this.issueRequest());
    };

    // This is where things get gnarly
    this.hasRTC = Primrose.HTTP.getObject(requestICEPath)
      .then((config) => {
        config.iceServers.push.apply(config.iceServers, ICE_SERVERS);
        for(let i = config.iceServers.length - 1; i >= 0; --i){
          const server = config.iceServers[i];
          if(!server.urls || server.urls.length === 0){
            config.iceServers.splice(i, 1);
          }
          else {
            if(server.url && !server.urls){
              server.urls = [server.url];
              delete server.url;
            }
            if(server.username && server.credential){
              server.credentialType = "token";
            }
          }
        }
        config.iceCandidatePoolSize = 100;
        this._log(1, config);
        this.rtc = new RTCPeerConnection(config);
        // This is just for debugging purposes.
        this.rtc.onsignalingstatechange = (evt) => this._log(1, "[%s] Signal State: %s", instanceNumber, this.rtc.signalingState);
        this.rtc.oniceconnectionstatechange = (evt) => this._log(1, "[%s] ICE Connection %s, Gathering %s", instanceNumber, this.rtc.iceConnectionState, this.rtc.iceGatheringState);

        // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
        // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
        // you that negotiation is necessary, and only then create the offer. There is a race-condition between
        // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
        // don't wait for the appropriate time.
        this.rtc.onnegotiationneeded = (evt) => this.createOffer()
          .then(this.descriptionCreated);

        // The API is going to figure out end-point configurations for us by communicating with the STUN servers
        // and seeing which end-points are visible and which require network address translation.
        this.rtc.onicecandidate = (evt) => {
          // There is an error condition where sometimes the candidate returned in this event handler will be null.
          if (evt.candidate) {
            // Then let the remote user know of our folly.
            this.emit("ice", evt.candidate);
          }
        };
      });

      this.ready = this.hasRTC.then(() => new Promise((resolver, rejecter) => {
        resolve = resolver;
        reject = rejecter;
        this.emit("peer");
      }));
  }

  emit(type, evt){
    super.emit(type, {
      fromUserName: this.fromUserName,
      fromUserIndex: this.fromUserIndex,
      toUserName: this.toUserName,
      toUserIndex: this.toUserIndex,
      item: evt
    });
  }

  startTimeout() {
    if (this._timeout === null) {
      this._log(1, "Timing out in " + Math.floor(PEERING_TIMEOUT_LENGTH / 1000) + " seconds.");
      this._timeout = setTimeout(this.cancel.bind(this), PEERING_TIMEOUT_LENGTH);
    }
  }

  clearTimeout() {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  cancel() {
    this._log(1, "Timed out!");
    this.peering_cancel("Gave up waiting on the peering connection.");
  }

  createOffer() {
    return this.rtc.createOffer(this.offerOptions);
  }

  recordProgress(description, method) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "recordProgress",
      description: "mark that we made progress towards our goals.",
      parameters: [{
        name: "description",
        type: "RTCSessionDescription",
        description: "An answer or offer object."
      }, {
        name: "method",
        type: "String",
        description: "Whether or not the description had been 'created' or 'received' here."
      }]
    });
    this.progress[description.type][method] = true;
  }

  close() {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "close",
      description: "shut down the peer connection, if it was succesful in being created."
    });
    if (this.rtc && this.rtc.signalingState !== "closed") {
      this.rtc.close();
      this.rtc = null;
    }
  }

  teardown() {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "teardown",
      description: "Whether ending succesfully or failing, the processing is mostly the same: teardown all the event handlers."
    });

    throw new Error("Not implemented.");
  }

  get complete() {
    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "complete",
      returns: "Boolean",
      description: "Override this method in subClasses to indicate when the peering process is complete. The peering process is complete when all offers are answered."
    });

    return !this.rtc || this.rtc.signalingState === "closed";
  }

  issueRequest() {
    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "issueRequest",
      description: "Override this method in subClasses to trigger the peering process."
    });

    throw new Error("Not implemented");
  }
}

WebRTCSocket.PEERING_EVENTS = ["peer", "cancel", "offer", "ice", "answer"];