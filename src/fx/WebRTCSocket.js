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

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
  }
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = (constraint) => new Promise((resolve, reject) => navigator.getUserMedia(constraint, resolve, reject));
  }

  let ICE_SERVERS = [
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
    { url: "stun:stun2.l.google.com:19302" },
    { url: "stun:stun3.l.google.com:19302" },
    { url: "stun:stun4.l.google.com:19302" }
  ];

  if (isFirefox) {
    ICE_SERVERS = [{ urls: ICE_SERVERS.map((s) => s.url) }];
  }

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

  let INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose",
    name: "WebRTCSocket",
    description: "[under construction]"
  });
  class WebRTCSocket {
    constructor(proxyServer, fromUserName, toUserName, outAudio) {

      let attemptCount = 0,
        messageNumber = 0;
      const instanceNumber = ++INSTANCE_COUNT,
        print = function(name, format){
          if(false){
            const args = Array.prototype.slice.call(arguments, 2);
            format = "[%s:%s:%s] " + format;
            args.unshift(INSTANCE_COUNT);
            args.unshift(instanceNumber);
            args.unshift(++messageNumber);
            args.unshift(format);
            console[name].apply(console, args);
          }
        },
        log = print.bind(null, "log"),
        error = print.bind(null, "error");

      this.rtc = null;

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
        error("proxy error", proxyServer);
        throw new Error("need a socket");
      }

      window.addEventListener("unload", this.close);

      this.ready = new Promise((resolve, reject) => {

        const progress = {
          offer: {
            received: false,
            created: false
          },
          answer: {
            received: false,
            created: false
          }
        }, complete = () => {
          return progress.offer.received &&
          progress.offer.created && 
          progress.answer.received && 
          progress.answer.created;
        }, isExpected = (tag, obj) => {
          log(tag, obj.fromUserName, toUserName, "||", obj.toUserName, fromUserName, "complete?", complete());
          return obj.fromUserName === toUserName && obj.toUserName === fromUserName && !complete();
        };

        const onUser = (evt) => {
          if(isExpected("new user", evt)) {
            this.rtc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
            const check = (obj) => {
                if(complete()){
                  done(resolve, this.stream, null);
                } 
                return obj;
              },
              wrap = (item) => {
                return {
                  fromUserName,
                  toUserName,
                  item
                };
              },
              goFirst = fromUserName < toUserName,
              descriptionCreated = (description) => {
                progress[description.type].created = true;
                return this.rtc.setLocalDescription(description)
                  .then(()=> proxyServer.emit(description.type, wrap(description)))
                  .then(check)
                  .catch(onError);
              },
              descriptionReceived = (description) => {
                if(isExpected(description.item.type, description)){
                  progress[description.item.type].received = true;
                  return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))
                    .then(check)
                    .catch(onError);
                }
              },
              addStream = () => {
                log("adding stream", outAudio);
                if (outAudio) {
                  if (isFirefox) {
                    outAudio.getAudioTracks().forEach((track) => this.rtc.addTrack(track, outAudio));
                  }
                  else {
                    this.rtc.addStream(outAudio);
                  }
                }
              },
              onOffer = (offer) => {
                log("offer", offer);
                var promise = descriptionReceived(offer);
                if(promise){
                  return promise.then(() => this.rtc.createAnswer())
                  .then(descriptionCreated)
                  .catch(onError);
                }
              },
              onIce = (ice) => {
                if(isExpected("ice", ice)){
                  return this.rtc.addIceCandidate(new RTCIceCandidate(ice.item))
                    .catch(onError);
                }
              },
              done = (thunk, obj, exp) => {
                if(exp){
                  error("Fatal error. Turning off event handlers.", thunk, exp);
                }
                else{
                  log("All done. Turning off event handlers.", thunk, obj);
                }
                proxyServer.off("user", onUser);
                proxyServer.off("offer", onOffer);
                proxyServer.off("ice", onIce);
                proxyServer.off("answer", descriptionReceived);
                this.rtc.onsignalingstatechange = null;
                this.rtc.onnegotiationneeded = null;
                this.rtc.onicecandidate = null;
                if (isFirefox) {
                  this.rtc.ontrack = null;
                }
                else {
                  this.rtc.onaddstream = null;
                }
                return thunk(obj);
              },
              onError = (exp) => done(reject, null, exp),
              onStream = (stream) => {
                this.stream = stream;
                if (!goFirst) {
                  log("Creating the second stream");
                  addStream();
                }
              };

            proxyServer.on("offer", onOffer);
            proxyServer.on("ice", onIce);
            proxyServer.on("answer", descriptionReceived);

            this.rtc.onsignalingstatechange = (evt) => log("[%s] Signal State: %s", instanceNumber, this.rtc.signalingState);

            this.rtc.onnegotiationneeded = (evt) => this.rtc.createOffer()
              .then(descriptionCreated)
              .catch(onError);

            this.rtc.onicecandidate = (evt) => {
              if (evt.candidate) {
                proxyServer.emit("ice", wrap(evt.candidate));
              }
            };

            if (isFirefox) {
              this.rtc.ontrack = (evt) => onStream(evt.streams[0]);
            }
            else {
              this.rtc.onaddstream = (evt) => onStream(evt.stream);
            }

            if (goFirst) {
              log("Creating the first stream");
              addStream();
            }
          }
        };

        proxyServer.on("user", onUser);

        setTimeout(() => proxyServer.emit("peer", toUserName), 250);
      });
    }

    close(){
      if(this.rtc){
        this.rtc.close();
      }
    }
  }
  return WebRTCSocket;
})();

