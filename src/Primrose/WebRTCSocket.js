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

function formatTime(t) {
  var ms = t.getMilliseconds()
    .toString();
  while (ms.length < 3) {
    ms = "0" + ms;
  }
  return t.toLocaleTimeString()
    .replace(/(\d+:\d+:\d+)/, (_, g) => g + "." + ms);
}

pliny.class({
  parent: "Primrose",
    name: "WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{
      name: "requestICEPath",
      type: "string",
      description: "A request path at which to retrieve the extra ICE servers to use with the connection."
    }, {
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
class WebRTCSocket {
  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  constructor(requestICEPath, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {

    // These logging constructs are basically off by default, but you will need them if you ever
    // need to debug the WebRTC workflow.
    let attemptCount = 0;
    const MAX_LOG_LEVEL = 5,
      instanceNumber = ++INSTANCE_COUNT,
      print = function (name, level, format) {
        if (level < MAX_LOG_LEVEL) {
          var t = new Date();
          const args = [
            "[%s:%s] " + format,
            level,
            formatTime(t)
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
    this._onError = null;
    this._log = print.bind(null, "log");
    this._error = print.bind(null, "error", 0);

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "proxyServer",
      type: "WebSocket",
      description: "The connection over which to negotiate the peering."
    });
    Object.defineProperty(this, "proxyServer", {
      get: () => proxyServer
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "fromUserName",
      type: "String",
      description: "The name of the local user."
    });
    Object.defineProperty(this, "fromUserName", {
      get: () => fromUserName
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "fromUserIndex",
      type: "Number",
      description: "The index of the local user's current device."
    });
    Object.defineProperty(this, "fromUserIndex", {
      get: () => fromUserIndex
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "toUserName",
      type: "String",
      description: "The name of the remote user."
    });
    Object.defineProperty(this, "toUserName", {
      get: () => toUserName
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "toUserIndex",
      type: "Number",
      description: "The index of the remote user's current device."
    });
    Object.defineProperty(this, "toUserIndex", {
      get: () => toUserIndex
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "requestICEPath",
      type: "String",
      description: "A request path at which to retrieve the extra ICE servers to use with the connection."
    });
    Object.defineProperty(this, "requestICEPath", {
      get: () => requestICEPath
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "rtc",
      type: "RTCPeerConnection",
      description: "The raw RTCPeerConnection that got negotiated."
    });
    this.rtc = null;

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "progress",
      type: "WebSocket",
      description: "The connection over which to negotiate the peering."
    });
    const progress = {
      offer: {
        created: false,
        received: false
      },
      answer: {
        created: false,
        recieved: false
      }
    };
    Object.defineProperty(this, "progress", {
      get: () => progress
    });

    pliny.property({
      parent: "Primrose.WebRTCSocket",
      name: "goFirst",
      type: "Boolean",
      description: "We don't want the ICE candidates, offers, and answers clashing in the middle, so we need to be careful about order of operations. Users already in the room will initiate peer connections with users that are just joining."
    });
    Object.defineProperty(this, "goFirst", {
      get: () => !goSecond
    });

    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", this.close.bind(this));

    // This is where things get gnarly
    this.ready = Primrose.HTTP.getObject(this.requestICEPath)
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
        console.log(config);
        this.rtc = new RTCPeerConnection(config);
      }).then(() => new Promise((resolve, reject) => {
        const setHandlers = (enabled) => {
          const method = enabled ? "on" : "off";

          this.proxyServer[method]("cancel", this._onError);
          this.proxyServer[method]("query_request", onQuery);
          this.proxyServer[method]("query_result", onQueryResult);
          this.proxyServer[method]("offer", onOffer);
          this.proxyServer[method]("ice", onIce);
          this.proxyServer[method]("peer", onUser);
          // When an answer is received, it's much simpler than receiving an offer. We just mark the progress and
          // check to see if we're done.
          this.proxyServer[method]("answer", descriptionReceived);
        };

        const done = (isError) => {
          console.log(this.rtc);
          this._log(2, "Tearing down event handlers");
          this.clearTimeout();
          setHandlers(false);
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
        const descriptionReceived = (description) => {
          this._log(1, "description", description);
          // Check to see if we expected this sort of message from this user.
          if (this.isExpected(description.item.type, description)) {

            this.recordProgress(description.item, "received");

            // The description we received is always the remote description, regardless of whether or not it's an offer
            // or an answer.
            return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

            // check to see if we're done.
            .then(check)

            // and if there are any errors, bomb out and shut everything down.
            .catch(this._onError);
          }
        };

        // When an offer or an answer is created, it's pretty much the same exact processing. Either type
        // of object gets wrapped with a context identifying which peer channel is being negotiated, and
        // then transmitted through the negotiation server to the remote user.
        const descriptionCreated = (description) => {
          this.recordProgress(description, "created");

          // The description we create is always the local description, regardless of whether or not it's an offer
          // or an answer.
          return this.rtc.setLocalDescription(description)

          // Let the remote user know what happened.
          .then(() => this.proxyServer.emit(description.type, this.wrap(description)))

          // check to see if we're done.
          .then(check)

          // and if there are any errors, bomb out and shut everything down.
          .catch(this._onError);
        };

        // A catch-all error handler to shut down the world if an error we couldn't handle happens.
        this._onError = (exp) => {
          this._error(exp);
          this.proxyServer.emit("cancel", exp);
          this._log(1, "Timeout avoided, but only because of an error.");
          done(true);
          reject(exp);
        };

        const checkQueryState = () => {
          console.log("checkQueryState", this.myResult, this.theirResult);
          if(this.myResult && this.theirResult){
            console.log(1, "Issuing request to peer.");
            this.issueRequest();
          }
          else if(this.myResult === false) {
            console.log(1, "Local user couldn't peer.");
            done();
            resolve("Local user said they couldn't peer.");
          }
          else if(this.theirResult === false){
            console.log(1, "Remote user couldn't peer.");
            done();
            resolve("Remote user said they couldn't peer.");
          }
          else if(this.goFirst || this.myResult) {
            console.log("QUERYING", this.goFirst, this.theirResult);
            this.proxyServer.emit("query_request", this.wrap());
          }
        };

        const onQuery = (evt) => {
          if(this.isExpected("query request", evt)) {
            this.myResult = isChrome && !isiOS;
            console.log("QUERY REQUEST", this.myResult);
            this.proxyServer.emit("query_result", this.wrap(this.myResult));
            checkQueryState();
          }
        };

        const onQueryResult = (evt) => {
          if(this.isExpected("query result", evt)){
            this.theirResult = evt.item;
            console.log("QUERY RESULT", this.theirResult);
            checkQueryState();
          }
        };

        // When an offer is received, we need to create an answer in reply.
        const onOffer = (offer) => {
          this._log(1, "offer", offer);
          var promise = descriptionReceived(offer);
          if (promise) {
            return promise.then(() => this.rtc.createAnswer())
              .then(descriptionCreated);
          }
        };

        // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
        // with enough information for the remote user to be able to connect to it.
        const onIce = (ice) => {
          this._log(1, "ice", ice);
          // Check to see if we expected this sort of message from this user.
          if (this.isExpected("ice", ice)) {
            // And if so, store it in our database of possibilities.
            var candidate = new RTCIceCandidate(ice.item);
            return this.rtc.addIceCandidate(candidate)
              .catch(this._error);
          }
        };

        // This really long event handler is not really the start of the process. Skip ahead to `proxyServer.on("user", onUser)`
        const onUser = (evt) => {
          // When a user is joining a room with more than one user currently, already in the room, they will have to
          // make several connection in sequence. The Socket.IO event handlers don't seem to reliably turn off, so
          // we have to make sure the message we here is the one meant for this particular instance of the socket manager.
          if (this.isExpected("new user", evt)) {
            // This is just for debugging purposes.
            this.rtc.onsignalingstatechange = (evt) => this._log(1, "[%s] Signal State: %s", instanceNumber, this.rtc.signalingState);
            this.rtc.oniceconnectionstatechange = (evt) => this._log(1, "[%s] ICE Connection %s, Gathering %s", instanceNumber, this.rtc.iceConnectionState, this.rtc.iceGatheringState);

            // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
            // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
            // you that negotiation is necessary, and only then create the offer. There is a race-condition between
            // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
            // don't wait for the appropriate time.
            this.rtc.onnegotiationneeded = (evt) => this.createOffer(this.offerOptions)
              // record the local description.
              .then(descriptionCreated);

            // The API is going to figure out end-point configurations for us by communicating with the STUN servers
            // and seeing which end-points are visible and which require network address translation.
            this.rtc.onicecandidate = (evt) => {

              // There is an error condition where sometimes the candidate returned in this event handler will be null.
              if (evt.candidate) {

                // Then let the remote user know of our folly.
                this.proxyServer.emit("ice", this.wrap(evt.candidate));
              }
            };

            checkQueryState();
          }
        };

        // We need to do two things, wait for the remote user to indicate they would like to peer, and...
        setHandlers(true);

        // ... let the server know to inform the remote user that we would like to peer. We need to delay a little
        // bit because it takes the remote user a little time between logging in and being ready to receive messages.
        setTimeout(() => this.proxyServer.emit("peer", this.wrap()), 250);

        // Okay, now go back to onUser
      }));
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
    this._onError("Gave up waiting on the peering connection.");
  }

  createOffer() {
    return this.rtc.createOffer();
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

  wrap(item) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "wrap",
      returns: "Object",
      description: "Provides the context into a message so that the remote user can tell if the message `this.isExpected()`",
      parameters: [{
        name: "item",
        type: "Object",
        description: "The object to wrap."
      }]
    });
    return {
      fromUserName: this.fromUserName,
      fromUserIndex: this.fromUserIndex,
      toUserName: this.toUserName,
      toUserIndex: this.toUserIndex,
      item: item
    };
  }

  isExpected(tag, obj) {
    pliny.method({
      parent: "Primrose.WebRTCSocket",
      name: "isExpected",
      returns: "Boolean",
      description: "A test to see if we were expecting a particular message. Sometimes the messages get criss-crossed on the negotiation server, and this just makes sure we don't cause an error.",
      parameters: [{
        name: "tag",
        type: "String",
        description: "A name for the operation being tested."
      }, {
        name: "obj",
        type: "Object",
        description: "The object within the operating being tested."
      }]
    });

    const incomplete = !this.complete,
      fromUser = obj.fromUserName === this.toUserName,
      fromIndex = obj.fromUserIndex === this.toUserIndex,
      toUser = obj.toUserName === this.fromUserName,
      toIndex = obj.toUserIndex === this.fromUserIndex,
      isExpected = incomplete && fromUser && fromIndex && toUser && toIndex;

    this._log(1, "[%s->%s] I %s || FROM %s==%s (%s), %s==%s (%s) || TO %s==%s (%s), %s==%s (%s)",
      tag, isExpected,
      incomplete,
      obj.fromUserName, this.toUserName, fromUser,
      obj.fromUserIndex, this.toUserIndex, fromIndex,
      obj.toUserName, this.fromUserName, toUser,
      obj.toUserIndex, this.fromUserIndex, toIndex);
    this._log(2, obj);
    return isExpected;
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