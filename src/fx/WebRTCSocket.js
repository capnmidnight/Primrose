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

  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = (constraint) => new Promise((resolve, reject) => navigator.getUserMedia(constraint, resolve, reject));
  }

  pliny.class({
    parent: "Primrose",
    name: "WebRTCSocket",
    description: "[under construction]"
  });
  class WebRTCSocket {
    constructor(proxyServer, userName, toUserName) {
      this.rtc = null;

      const descriptionCreated = (description) => this.rtc.setLocalDescription(description, proxyServer.emit.bind(proxyServer, description.type, description)),
        descriptionReceived = (description, thunk) => this.rtc.setRemoteDescription(new RTCSessionDescription(description), thunk);

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
        proxyServer.on("user", (evt) => navigator.mediaDevices.getUserMedia({ audio: true })
          .catch(console.warn.bind(console, "Can't get audio"))
          .then((audio) => {
            this.rtc = new RTCPeerConnection({
              iceServers: [
                { url: "stun:stun.l.google.com:19302" },
                { url: "stun:stun1.l.google.com:19302" },
                { url: "stun:stun2.l.google.com:19302" },
                { url: "stun:stun3.l.google.com:19302" },
                { url: "stun:stun4.l.google.com:19302" }
              ]
            });

            proxyServer.on("offer", (offer) => descriptionReceived(offer, () => this.rtc.createAnswer(descriptionCreated, reject)));
            proxyServer.on("ice", (ice) => this.rtc.addIceCandidate(new RTCIceCandidate(ice)));
            proxyServer.on("answer", (answer) => descriptionReceived(answer, () => { }));

            this.rtc.onnegotiationneeded = (evt) => this.rtc.createOffer(descriptionCreated, reject);

            this.rtc.onicecandidate = (evt) => {
              if (evt.candidate) {
                proxyServer.emit("ice", evt.candidate);
              }
            };

            this.rtc.onaddstream = (evt) => resolve(evt.stream);

            if (audio) {
              console.log("adding audio", audio);
              this.rtc.addStream(audio);
            }
          }));

        proxyServer.emit("peer", toUserName);
      });
    }
  }
  return WebRTCSocket;
})();

