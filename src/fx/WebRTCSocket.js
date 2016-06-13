Primrose.WebRTCSocket = (function () {

  /* polyfills */
  window.RTCPeerConnection =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection;

  window.RTCIceCandidate =
    window.RTCIceCandidate ||
    window.mozRTCIceCandidate;

  window.RTCSessionDescription =
    window.RTCSessionDescription ||
    window.mozRTCSessionDescription;


  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    navigator.oGetUserMedia;

  navigator.mediaDevices = navigator.mediaDevices || {};
  navigator.mediaDevices.getUserMedia = navigator.mediaDevices.getUserMedia || function (constraint) { return new Promise((resolve, reject) => navigator.getUserMedia(constraint, resolve, reject)); }

  function preferOpus(description) {
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

  pliny.class({
    parent: "Primrose",
    name: "WebRTCSocket",
    description: "[under construction]"
  });
  class WebRTCSocket {
    constructor(proxyServer, userName, toUserName, outAudio) {
      this.rtc = null;

      const descriptionCreated = (description) => this.rtc.setLocalDescription(preferOpus(description)).then(proxyServer.emit.bind(proxyServer, description.type, description)),
        descriptionReceived = (description) => this.rtc.setRemoteDescription(new RTCSessionDescription(description));

      if (typeof (proxyServer) === "string") {
        proxyServer = io.connect(proxyServer, {
          "reconnect": true,
          "reconnection delay": 1000,
          "max reconnection attempts": 60
        });
      }
      else if (proxyServer && proxyServer.on && proxyServer.emit) {
        proxyServer = proxyServer;
      }
      else {
        console.error("proxy error", proxyServer);
        throw new Error("need a socket");
      }

      this.close = () => this.rtc.close();

      window.addEventListener("unload", this.close);
      this.ready = new Promise((resolve, reject) => {
        const onUser = (evt) => {
          console.log("user", evt);
          this.rtc = new RTCPeerConnection({
            iceServers: [
              { url: "stun:stun.l.google.com:19302" },
              { url: "stun:stun1.l.google.com:19302" },
              { url: "stun:stun2.l.google.com:19302" },
              { url: "stun:stun3.l.google.com:19302" },
              { url: "stun:stun4.l.google.com:19302" }
            ]
          });

          const addStream = () => {
            if (outAudio) {
              this.rtc.addStream(outAudio);
            }
          },
            onOffer = (offer) => descriptionReceived(offer).then(() => this.rtc.createAnswer(descriptionCreated, onError)).catch(onError),
            onIce = (ice) => this.rtc.addIceCandidate(new RTCIceCandidate(ice)).catch(onError),
            onAnswer = (answer) => descriptionReceived(answer).then(() => {
            }).catch(onError),
            done = (thunk, obj) => {
              proxyServer.off("user", onUser);
              proxyServer.off("offer", onOffer);
              proxyServer.off("ice", onIce);
              proxyServer.off("answer", onAnswer);
              this.rtc.onnegotiationneeded = null;
              this.rtc.onicecandidate = null;
              this.rtc.onaddstream = null;
              thunk(obj);
            },
            onError = (err) => done(reject, err);

          proxyServer.on("offer", onOffer);
          proxyServer.on("ice", onIce);
          proxyServer.on("answer", onAnswer);

          this.rtc.onnegotiationneeded = (evt) => this.rtc.createOffer(descriptionCreated, onError);

          this.rtc.onicecandidate = (evt) => {
            if (evt.candidate) {
              proxyServer.emit("ice", evt.candidate);
            }
          };

          this.rtc.onaddstream = (evt) => {
            if (userName >= toUserName) {
              addStream();
            }
            resolve(evt.stream);
          }
          if (userName < toUserName) {
            addStream();
          }
        };

        proxyServer.on("user", onUser);

        setTimeout(() => proxyServer.emit("peer", toUserName), 250);
      });
    }
  }
  return WebRTCSocket;
})();

