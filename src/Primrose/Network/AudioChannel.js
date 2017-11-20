/*
pliny.class({
  parent: "Primrose.Network",
    name: "AudioChannel",
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
      name: "toUserName",
      type: "String",
      description: "The name of the remote user, to which the peering is being requested."
    }, {
      name: "outAudio",
      type: "Promise",
      description: "An audio stream from the local user to send to the remote user."
    }]
});
*/

import WebRTCSocket from "./WebRTCSocket";
import { isIE } from "../../flags";

const ENABLE_OPUS_HACK = true;

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
export default class AudioChannel extends WebRTCSocket {
  constructor(requestICEPath, fromUserName, toUserName, outAudio, goSecond) {
    console.log("attempting to peer audio from %s to %s. %s goes first.", fromUserName, toUserName, goSecond ? toUserName : fromUserName);
    super(requestICEPath, fromUserName, 0, toUserName, 0, goSecond);
    this.outAudio = outAudio;
    this.inAudio = null;
    this.startTimeout();
  }

  issueRequest() {
    console.log("going first", this.goFirst);
    // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
    //  version of the API) and Chrome.
    const addStream = () => {
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
    };

    // Receiving an audio stream from the peer connection is just a
    const onStream = (stream) => {
      this.inAudio = stream;
      if (!this.goFirst) {
        this._log(0, "Creating the second stream from %s to %s", this.fromUserName, this.toUserName);
        this.stopTimeout();
        this._log(1, "Restarting timeout.");
        this.startTimeout();
        addStream();
      }
    };

    // Wait to receive an audio track.
    if("ontrack" in this.rtc){
      this.rtc.ontrack = (evt) => onStream(evt.streams[0]);
    }
    else{
      this.rtc.onaddstream = (evt) => onStream(evt.stream);
    }

    // If we're the boss, tell people about it.
    if (this.goFirst) {
      this._log(0, "Creating the first stream from %s to %s", this.fromUserName, this.toUserName);
      addStream();
    }
  }

  // The peering process is complete when all offers are answered.
  get complete() {
    if (this.goFirst) {
      this._log(1, "[First]: offer created: %s, answer recv: %s -> offer recv: %s -> answer created: %s.",
        this.progress.offer.created,
        this.progress.answer.received,
        this.progress.offer.received,
        this.progress.answer.created,
        this.rtc.signalingState);
    }
    else {
      this._log(1, "[Second]: offer recv: %s, answer created: %s -> offer created: %s -> answer recv: %s.",
        this.progress.offer.received,
        this.progress.answer.created,
        this.progress.offer.created,
        this.progress.answer.received,
        this.rtc.signalingState);
    }

    return super.complete || (this.progress.offer.received &&
      this.progress.offer.created &&
      this.progress.answer.received &&
      this.progress.answer.created);
  }

  teardown() {
    if ("ontrack" in this.rtc) {
      this.rtc.ontrack = null;
    }
    else {
      this.rtc.onaddstream = null;
    }
  }

  createOffer() {
    return super.createOffer()
      .then(preferOpus);
  }
};
