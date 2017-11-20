/*
pliny.class({
  parent: "Primrose",
  name: "WebRTCSocket",
  baseClass: "THREE.EventDispatcher",
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

import { EventDispatcher } from "three";
import { isIE } from "../../flags";

const PEERING_TIMEOUT_LENGTH = 30000;
const ENABLE_OPUS_HACK = true;

// some useful information:
// - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
// - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
// - https://github.com/coturn/rfc5766-turn-server/

let INSTANCE_COUNT = 0;

class WebRTCSocketEvent extends Event {
  constructor(type, target, fromUserName, toUserName, item) {
    super(type, target);
    Object.assign(this, {
      fromUserName,
      toUserName,
      item
    });
  }
}

function preferOpus(description) {
  if (ENABLE_OPUS_HACK && description) {
    var sdp = description.sdp;
    var sdpLines = sdp.split('\r\n');
    var mLineIndex = null;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
    }
    if (mLineIndex === null) return sdp;

    // If Opus is available, set it as the default in m line.
    for (var j = 0; j < sdpLines.length; j++) {
      if (sdpLines[j].search('opus/48000') !== -1) {
        var opusPayload = extractSdp(sdpLines[j], /:(\d+) opus\/48000/i);
        if (opusPayload) sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
        break;
      }
    }

    // Remove CN in m line and sdp.
    sdpLines = removeCN(sdpLines, mLineIndex);

    description.sdp = sdpLines.join('\r\n');
  }
  return description;
}

function extractSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return (result && result.length == 2) ? result[1] : null;
}

function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = [];
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    if (elements[i] !== payload) newLine[index++] = elements[i];
  }
  return newLine.join(' ');
}

function removeCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length - 1; i >= 0; i--) {
    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}

export default class WebRTCSocket extends EventDispatcher {
  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  constructor(config, fromUserName, toUserName, goSecond) {
    super();

    // These logging constructs are basically off by default, but you will need
    // them if you ever need to debug the WebRTC workflow.
    let attemptCount = 0;
    const MAX_LOG_LEVEL = 0,
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
    this._log = print.bind(null, "trace");
    this._error = print.bind(null, "error", 0, "");
    this.fromUserName = fromUserName;
    this.toUserName = toUserName;
    this.rtc = null;
    this.inAudioStreams = [];
    this.outAudioStreams = []
    this.dataChannels = [];
    this.goFirst = !goSecond;
    this.preferOpus = true;
    this.progress = {
      offer: {
        created: false,
        received: false
      },
      answer: {
        created: false,
        received: false
      }
    };

    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", this.close.bind(this));

    const done = (isError) => {
      this._log(2, "Tearing down event handlers");
      this.stopTimeout();
      this.rtc.onsignalingstatechange = null;
      this.rtc.oniceconnectionstatechange = null;
      this.rtc.onnegotiationneeded = null;
      this.rtc.onicecandidate = null;
      this.rtc.ondatachannel = null;
      this.rtc.ontrack = null;
      this.rtc.onaddstream = null;

      this.teardown();
      if (isError) {
        this.close();
      }
    };

    // A pass-through function to include in the promise stream to see if the
    // channels have all been set up correctly and ready to go.
    const check = (obj) => {
      if (this.complete) {
        this._log(1, "Timeout avoided.");
        done();
        this.emit("ready", this.dataChannels[0]);
      }
      return obj;
    };

    // When an offer or an answer is received, it's pretty much the same exact
    // processing. Either type of object gets checked to see if it was expected,
    // then unwrapped.
    this.peering_answer = (description) => {
      this._log(1, "description", description);
      // Check to see if we expected this sort of message from this user.
      this.recordProgress(description.item, "received");

      // The description we received is always the remote description,
      // regardless of whether or not it's an offer or an answer.
      return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

        // check to see if we're done.
        .then(check)

        // and if there are any errors, bomb out and shut everything down.
        .catch(this.peering_error);
    };

    // When an offer or an answer is created, it's pretty much the same exact
    // processing. Either type of object gets wrapped with a context identifying
    // which peer channel is being negotiated, and then transmitted through the
    // negotiation server to the remote user.
    this.descriptionCreated = (description) => {
      this.recordProgress(description, "created");

      // The description we create is always the local description, regardless
      // of whether or not it's an offer
      // or an answer.
      return this.rtc.setLocalDescription(description)
        // Let the remote user know what happened.
        .then(() => this.emit(description.type, description))
        // check to see if we're done.
        .then(check)
        // and if there are any errors, bomb out and shut everything down.
        .catch(this.peering_error);
    };

    // A catch-all error handler to shut down the world if an error we couldn't
    // handle happens.
    this.peering_error = (exp) => {
      this._error(exp);
      this.emit("cancel", exp);
      this._log(1, "Timeout avoided, but only because of an error.");
      done(true);
      this.emit("error", exp);
    };

    // A catch-all error handler to shut down the world if an error we couldn't
    // handle happens.
    this.peering_cancel = (exp) => {
      this._error(exp);
      this._log(1, "Timeout avoided, but only because of an error.");
      done(true);
      this.emit("error", exp);
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
      if (this.goFirst) {
        this._log(0, "Creating data channel");
        this.emit("readyforcontent");
      }
    };

    // This is where things get gnarly
    if(config === true) {
      config = WebRTCSocket.DEFAULT_ICE_CONFIG;
    }
    else if(config === false) {
      config = null;
    }

    if(config) {
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
    }

    this._log(1, JSON.stringify(config));
    this.rtc = new RTCPeerConnection(config);
    // This is just for debugging purposes.
    this.rtc.onsignalingstatechange = (evt) =>
      this._log(
        1,
        "[%s] Signal State: %s",
        instanceNumber,
        this.rtc.signalingState);

    this.rtc.oniceconnectionstatechange = (evt) =>
      this._log(
        1,
        "[%s] ICE Connection %s, Gathering %s",
        instanceNumber,
        this.rtc.iceConnectionState,
        this.rtc.iceGatheringState);

    // All of the literature you'll read on WebRTC show creating an offer right
    // after creating a data channel or adding a stream to the peer connection.
    // This is wrong. The correct way is to wait for the API to tell you that
    // negotiation is necessary, and only then create the offer. There is a
    // race-condition between the signaling state of the RTCPeerConnection and
    // creating an offer after creating a channel if we don't wait for the
    // appropriate time.
    this.rtc.onnegotiationneeded = (evt) => this.createOffer()
      .then(this.descriptionCreated);

    // The API is going to figure out end-point configurations for us by
    // communicating with the STUN servers and seeing which end-points are
    // visible and which require network address translation.
    this.rtc.onicecandidate = (evt) => {
      // There is an error condition where sometimes the candidate returned in
      // this event handler will be null.
      if (evt.candidate) {
        // Then let the remote user know of our folly.
        this.emit("ice", evt.candidate);
      }
    };

    // Receiving an audio stream from the peer connection is just a
    const onStream = (stream) => {
      this.inAudio = stream;
      if (!this.goFirst) {
        this._log(0, "Creating the second stream from %s to %s", this.fromUserName, this.toUserName);
        this.stopTimeout();
        this._log(1, "Restarting timeout.");
        this.startTimeout();
        this.addStream();
      }
    };

    // Wait to receive an audio track.
    if("ontrack" in this.rtc){
      this.rtc.ontrack = (evt) => onStream(evt.streams[0]);
    }
    else{
      this.rtc.onaddstream = (evt) => onStream(evt.stream);
    }
  }

  createChannel() {
    if(this.rtc) {
      const channel = this.rtc.createDataChannel(`from-${this.fromUserName}-to-${this.toUserName}-${this.dataChannels.length}`);
      this.dataChannels.push(channel);
      return channel;
    }
  }



  // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
  //  version of the API) and Chrome.
  addStream () {
    this._log(0, "adding stream", this.outAudio, this.rtc.addTrack);

    // Make sure we actually have audio to send to the remote.
    this.outAudio.then((aud) => {
      if (this.rtc.addTrack) {
        aud.getAudioTracks()
          .forEach((track) => this.rtc.addTrack(track, aud));
      }
      else {
        this.rtc.addStream(aud);
      }

      if(isIE){
        this.createOffer()
          .then(this.descriptionCreated);
      }
    });
  }

  connect() {
    return new Promise((resolve, reject) => {
      const done = () => {
          this.removeEventListener("ready", good);
          this.removeEventListener("error", bad);
        }, good = (evt) => {
          done();
          resolve(evt.item);
        }, bad = (exp) => {
          done();
          reject(exp);
        };

      this.addEventListener("ready", good);
      this.addEventListener("error", bad);

      if(!this.goFirst) {
        this.emit("peer");
      }
    });
  }

  emit(type, evt){
    this.dispatchEvent(new WebRTCSocketEvent(
      type,
      this,
      this.fromUserName,
      this.toUserName,
      evt
    ));
  }

  startTimeout() {
    if (this._timeout === null) {
      this._log(1, "Timing out in " + Math.floor(PEERING_TIMEOUT_LENGTH / 1000) + " seconds.");
      this._timeout = setTimeout(this.peering_error.bind(this, "Gave up waiting on the peering connection."), PEERING_TIMEOUT_LENGTH);
    }
  }

  stopTimeout() {
    if (this._timeout !== null) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  createOffer() {
    return this.rtc.createOffer(this.offerOptions);
  }

  recordProgress(description, method) {
    this._log(2, "Logging progress [%s]: %s %s -> true", description.type, method, this.progress[description.type][method]);
    this.progress[description.type][method] = true;
  }

  close() {
    if (this.rtc && this.rtc.signalingState !== "closed") {
      this.rtc.close();
      this.rtc = null;
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
    return !this.rtc ||
      this.rtc.signalingState === "closed" ||
      this.dataChannels.length > 0 &&
      (this.goFirst && this.progress.offer.created && this.progress.answer.received ||
        !this.goFirst && this.progress.offer.received && this.progress.answer.created);
  }

  teardown() {
    this.rtc.ondatachannel = null;
  }
}

WebRTCSocket.PEERING_EVENTS = ["peer", "cancel", "offer", "ice", "answer"];
WebRTCSocket.DEFAULT_ICE_CONFIG = {
  iceServers: [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun3.l.google.com:19302",
    "stun:stun4.l.google.com:19302"
  ].map((address) => Object.assign({
    credential: null,
    url: address,
    urls: address,
    username: null
  }))
};
