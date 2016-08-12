Primrose.Network.AudioChannel = (function () {
  "use strict";

  const ENABLE_OPUS_HACK = true;

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
  }
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;
    navigator.mediaDevices.getUserMedia = (constraint) => new Promise((resolve, reject) => navigator.getUserMedia(constraint, resolve, reject));
  }

  var preferOpus = (function () {
    function preferOpus(description) {
      if (ENABLE_OPUS_HACK) {
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

    return preferOpus;
  })();

  let INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose.Network",
      name: "AudioChannel",
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
        name: "toUserName",
        type: "String",
        description: "The name of the remote user, to which the peering is being requested."
      }, {
        name: "outAudio",
        type: "MediaStream",
        description: "An audio stream from the local user to send to the remote user."
      }, ]
  });
  class AudioChannel extends Primrose.WebRTCSocket {
    constructor(proxyServer, fromUserName, toUserName, outAudio) {
      super(proxyServer, fromUserName, 0, toUserName, 0);

      pliny.property({
        parent: "Primrose.Network.AudioChannel",
        name: "outAudio",
        type: "MediaStream",
        description: "An audio channel from the local user to the remote user."
      });
      Object.defineProperty(this, "outAudio", {
        get: () => outAudio
      });

      pliny.property({
        parent: "Primrose.Network.AudioChannel",
        name: "inAudio",
        type: "MediaStream",
        description: "An audio channel from the remote user to the local user."
      });
      this.inAudio = null;
    }

    issueRequest() {
      // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
      //  version of the API) and Chrome.
      const addStream = () => {
        this._log(0, "adding stream", this.outAudio);

        // Make sure we actually have audio to send to the remote.
        if (this.outAudio) {
          if (isFirefox) {
            this.outAudio.getAudioTracks()
              .forEach((track) => this.rtc.addTrack(track, this.outAudio));
          }
          else {
            this.rtc.addStream(this.outAudio);
          }
        }
      };

      // Receiving an audio stream from the peer connection is just a
      const onStream = (stream) => {
        this.inAudio = stream;
        if (!this.goFirst) {
          this._log(0, "Creating the second stream from %s to %s", this.fromUserName, this.toUserName);
          addStream();
        }
      };

      // Wait to receive an audio track.
      if (isFirefox) {
        this.rtc.ontrack = (evt) => onStream(evt.streams[0]);
      }
      else {
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
        this._log(1, "[First]: OC %s -> AR %s -> OR %s -> AC %s.",
          this.progress.offer.created,
          this.progress.answer.received,
          this.progress.offer.received,
          this.progress.answer.created);
      }
      else {
        this._log(1, "[Second]: OR %s -> AC %s -> OC %s -> AR %s.",
          this.progress.offer.received,
          this.progress.answer.created,
          this.progress.offer.created,
          this.progress.answer.received);
      }

      return super.complete || (this.progress.offer.received &&
        this.progress.offer.created &&
        this.progress.answer.received &&
        this.progress.answer.created);
    }

    teardown() {
      if (isFirefox) {
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
  }

  return AudioChannel;
})();