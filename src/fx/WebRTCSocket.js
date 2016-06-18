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
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [
      {name: "proxyServer", type: "WebSocket", description: "A connection over which to negotiate the peering."},
      {name: "fromUserName", type: "String", description: "The name of the local user, from which the peering is being initiated."},
      {name: "proxyServer", type: "String", description: "The name of the remote user, to which the peering is being requested."},
      {name: "outAudio", type: "MediaStream", description: "An audio stream from the local user to send to the remote user."},
    ]
  });
  class WebRTCSocket {
    // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
    constructor(proxyServer, fromUserName, toUserName, outAudio) {

      // These logging constructs are basically off by default, but you will need them if you ever
      // need to debug the WebRTC workflow.
      let attemptCount = 0,
        messageNumber = 0;
      const ENABLE_DEBUGGING = false,
        instanceNumber = ++INSTANCE_COUNT,
        print = function(name, format){
          if(ENABLE_DEBUGGING){
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

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "rtc",
        type: "RTCPeerConnection",
        description: "The raw RTCPeerConnection that got negotiated."
      });
      this.rtc = null;

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "stream",
        type: "MediaStream",
        description: "A single audio channel from the remote user to the local user."
      });
      this.stream = null;

      // If the user leaves the page, we want to at least fire off the close signal and perhaps
      // not completely surprise the remote user.
      window.addEventListener("unload", this.close);

      // This is where things get gnarly
      this.ready = new Promise((resolve, reject) => {

        // We need to make two audio channels to get bidirectional communication going, 
        //  from local to remote, and from remote to local. This means we will be creating
        //  an offer locally, waiting for the answer, then waiting for an offer, then creating
        //  an answer. We don't want to continue processing until all answers are complete.
        const progress = {
          offer: {
            received: false,
            created: false
          },
          answer: {
            received: false,
            created: false
          }
        };

        // We don't want the ICE candidates, offers, and answers clashing in the middle, so we need to
        // be careful about order of operations. The decision here is arbitrary, but it's easy to keep
        // straight. Users with "lower" names initiate peering.
        const goFirst = fromUserName < toUserName;

        // The peering process is complete when all offers are answered.
        function complete() {
          log(progress.offer.created, progress.answer.received, progress.offer.received, progress.answer.created);
          return progress.offer.received &&
            progress.offer.created && 
            progress.answer.received && 
            progress.answer.created;
        }

        // A test to see if we were expecting a particular message. Sometimes the messages get criss-crossed on the
        // negotiation server, and this just makes sure we don't cause an error.
        function isExpected(tag, obj) {
          log(tag, obj.fromUserName, toUserName, "||", obj.toUserName, fromUserName, "complete?", complete());
          return obj.fromUserName === toUserName && obj.toUserName === fromUserName && !complete();
        }

        // Provides the context into a message so that the remote user can tell if the message `isExpected()`
        function wrap (item) {
          return {
            fromUserName,
            toUserName,
            item
          };
        }

        // This really long event handler is not really the start of the process. Skip ahead to `proxyServer.on("user", onUser)`
        const onUser = (evt) => {
          // When a user is joining a room with more than one user currently, already in the room, they will have to
          // make several connection in sequence. The Socket.IO event handlers don't seem to reliably turn off, so 
          // we have to make sure the message we here is the one meant for this particular instance of the socket manager.
          if(isExpected("new user", evt)) {

            // Indicate to the API what servers should be used to figure out NAT traversal.
            this.rtc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

            // Whether ending succesfully or failing, the processing is mostly the same: teardown all the event handlers.
            const done = (thunk, obj, exp) => {
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
            };

            // A pass-through function to include in the promise stream to see if the audio channels have all been
            // set up correctly and ready to go.
            const check = (obj) => {
              if(complete()){
                done(resolve, this.stream, null);
              } 
              return obj;
            };

            // A catch-all error handler to shot down the world if an error we couldn't handle happens.
            const onError = (exp) => done(reject, null, exp);

            // When an offer or an answer is created, it's pretty much the same exact processing. Either type of object
            // gets wrapped with a context identifying which peer channel is being negotiated, and then transmitted
            // through the negotiation server to the remote user.
            const descriptionCreated = (description) => {
              // mark that we made progress towards our goals.
              progress[description.type].created = true;

              // The description we create is always the local description, regardless of whether or not it's an offer
              // or an answer.
              return this.rtc.setLocalDescription(description)

                // Let the remote user know what happened.
                .then(()=> proxyServer.emit(description.type, wrap(description)))

                // check to see if we're done.
                .then(check);
            };

            // When an offer or an answer is received, it's pretty much the same exact processing. Either type of
            // object gets checked to see if it was expected, then unwrapped.
            const descriptionReceived = (description) => {
              // Check to see if we expected this sort of message from this user.
              if(isExpected(description.item.type, description)){

                // mark that we made progress towards our goals.
                progress[description.item.type].received = true;

                // The description we received is always the remote description, regardless of whether or not it's an offer
                // or an answer.
                return this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

                  // check to see if we're done.
                  .then(check)

                  // and if there are any errors, bomb out and shut everything down.
                  .catch(onError);
              }
            };

            // When an answer is recieved, it's much simpler than receiving an offer. We just mark the progress and
            // check to see if we're done.
            proxyServer.on("answer", descriptionReceived);

            // When an offer is received, we need to create an answer in reply.
            const onOffer = (offer) => {
              log("offer", offer);
              var promise = descriptionReceived(offer);
              if(promise){
                return promise.then(() => this.rtc.createAnswer())
                .then(descriptionCreated)
                .catch(onError);
              }
            };
            proxyServer.on("offer", onOffer);

            // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
            // with enough information for the remote user to be able to connect to it.
            const onIce = (ice) => {
              // Check to see if we expected this sort of message from this user.
              if(isExpected("ice", ice)){
                // And if so, store it in our database of possibilities.
                return this.rtc.addIceCandidate(new RTCIceCandidate(ice.item))
                  .catch(onError);
              }
            };
            proxyServer.on("ice", onIce);

            // This is just for debugging purposes.
            this.rtc.onsignalingstatechange = (evt) => log("[%s] Signal State: %s", instanceNumber, this.rtc.signalingState);

            // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
            // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
            // you that negotiation is necessary, and only then create the offer. There is a race-condition between
            // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
            // don't wait for the appropriate time.
            this.rtc.onnegotiationneeded = (evt) => this.rtc.createOffer()
              // modifies the offer to prioritize the Opus coded.
              .then(preferOpus)
              // record the local description.
              .then(descriptionCreated)
              // And bomb out and destroy the world if we failed.
              .catch(onError);

            // The API is going to figure out end-point configurations for us by communicating with the STUN servers
            // and seeing which end-points are visible and which require network address translation.
            this.rtc.onicecandidate = (evt) => {

              // There is an error condition where sometimes the candidate returned in this event handler will be null.
              if (evt.candidate) {

                // Then let the remote user know of our folly.
                proxyServer.emit("ice", wrap(evt.candidate));
              }
            };

            // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
            //  version of the API) and Chrome.
            const addStream = () => {
              log("adding stream", outAudio);

              // Make sure we actually have audio to send to the remote.
              if (outAudio) {
                if (isFirefox) {
                  outAudio.getAudioTracks().forEach((track) => this.rtc.addTrack(track, outAudio));
                }
                else {
                  this.rtc.addStream(outAudio);
                }
              }
            };

            // Receiving an audio stream from the peer connection is just a
            const onStream = (stream) => {
              this.stream = stream;
              if (!goFirst) {
                log("Creating the second stream");
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
            if (goFirst) {
              log("Creating the first stream");
              addStream();
            }
          }
        };

        // We need to do two things, wait for the remote user to indicate they would like to peer, and...
        proxyServer.on("user", onUser);

        // ... let the server know to inform the remote user that we would like to peer. We need to delay a little
        // bit because it takes the remote user a little time between logging in and being ready to receive messages.
        setTimeout(() => proxyServer.emit("peer", toUserName), 250);

        // Okay, now go back to onUser
      });
    }

    close(){
      
      pliny.method({
        parent: "Primrose.WebRTCSocket",
        name: "close",
        description: "shut down the peer connection, if it was succesful in being created."
      });

      if(this.rtc){
        this.rtc.close();
      }
    }
  }

  return WebRTCSocket;
})();

