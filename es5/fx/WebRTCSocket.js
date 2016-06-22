"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.WebRTCSocket = function () {
  "use strict";

  /* polyfills */

  window.RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

  window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate;

  window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription;

  // some useful information:
  // - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
  // - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
  // - https://github.com/coturn/rfc5766-turn-server/
  var ICE_SERVERS = [{ url: "stun:stun.l.google.com:19302" }, { url: "stun:stun1.l.google.com:19302" }, { url: "stun:stun2.l.google.com:19302" }, { url: "stun:stun3.l.google.com:19302" }, { url: "stun:stun4.l.google.com:19302" }];

  if (isFirefox) {
    ICE_SERVERS = [{ urls: ICE_SERVERS.map(function (s) {
        return s.url;
      }) }];
  }

  var INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose",
    name: "WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{ name: "proxyServer", type: "WebSocket", description: "A connection over which to negotiate the peering." }, { name: "fromUserName", type: "String", description: "The name of the local user, from which the peering is being initiated." }, { name: "fromUserIndex", type: "Number", description: "For users with multiple devices logged in at one time, this is the index of the device that is performing the peering operation." }, { name: "toUserName", type: "String", description: "The name of the remote user, to which the peering is being requested." }, { name: "toUserIndex", type: "Number", description: "For users with multiple devices logged in at one time, this is the index of the device that is receiving the peering operation." }]
  });

  var WebRTCSocket = function () {
    // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.

    function WebRTCSocket(proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex) {
      var _this = this;

      _classCallCheck(this, WebRTCSocket);

      // These logging constructs are basically off by default, but you will need them if you ever
      // need to debug the WebRTC workflow.
      var attemptCount = 0,
          messageNumber = 0;
      var ENABLE_DEBUGGING = false,
          instanceNumber = ++INSTANCE_COUNT,
          print = function print(name, format) {
        if (ENABLE_DEBUGGING) {
          var args = Array.prototype.slice.call(arguments, 2);
          format = "[%s:%s:%s] " + format;
          args.unshift(INSTANCE_COUNT);
          args.unshift(instanceNumber);
          args.unshift(++messageNumber);
          args.unshift(format);
          console[name].apply(console, args);
        }
      };

      this._log = print.bind(null, "log");
      this._error = print.bind(null, "error");

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "proxyServer",
        type: "WebSocket",
        description: "The connection over which to negotiate the peering."
      });
      Object.defineProperty(this, "proxyServer", {
        get: function get() {
          return proxyServer;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "fromUserName",
        type: "String",
        description: "The name of the local user."
      });
      Object.defineProperty(this, "fromUserName", {
        get: function get() {
          return fromUserName;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "fromUserIndex",
        type: "Number",
        description: "The index of the local user's current device."
      });
      Object.defineProperty(this, "fromUserIndex", {
        get: function get() {
          return fromUserIndex;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "toUserName",
        type: "String",
        description: "The name of the remote user."
      });
      Object.defineProperty(this, "toUserName", {
        get: function get() {
          return toUserName;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "toUserIndex",
        type: "Number",
        description: "The index of the remote user's current device."
      });
      Object.defineProperty(this, "toUserIndex", {
        get: function get() {
          return toUserIndex;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "rtc",
        type: "RTCPeerConnection",
        description: "The raw RTCPeerConnection that got negotiated."
      });
      var rtc = new RTCPeerConnection({
        // Indicate to the API what servers should be used to figure out NAT traversal.
        iceServers: ICE_SERVERS
      });
      Object.defineProperty(this, "rtc", {
        get: function get() {
          return rtc;
        }
      });

      pliny.property({
        parent: "Primrose.WebRTCSocket",
        name: "progress",
        type: "WebSocket",
        description: "The connection over which to negotiate the peering."
      });
      var progress = {
        offer: { created: false, received: false },
        answer: { created: false, recieved: false }
      };
      Object.defineProperty(this, "progress", {
        get: function get() {
          return progress;
        }
      });

      // If the user leaves the page, we want to at least fire off the close signal and perhaps
      // not completely surprise the remote user.
      window.addEventListener("unload", this.close.bind(this));

      // This is where things get gnarly
      this.ready = new Promise(function (resolve, reject) {

        var done = function done() {
          _this._log("Tearing down event handlers");
          _this.proxyServer.off("peer", onUser);
          _this.proxyServer.off("offer", onOffer);
          _this.proxyServer.off("ice", onIce);
          _this.proxyServer.off("answer", descriptionReceived);
          _this.rtc.onsignalingstatechange = null;
          _this.rtc.oniceconnectionstatechange = null;
          _this.rtc.onnegotiationneeded = null;
          _this.rtc.onicecandidate = null;

          _this.teardown();
        };

        // A pass-through function to include in the promise stream to see if the channels have all been
        // set up correctly and ready to go.
        var check = function check(obj) {
          if (_this.complete) {
            done();
            resolve();
          }
          return obj;
        };

        // When an offer or an answer is received, it's pretty much the same exact processing. Either
        // type of object gets checked to see if it was expected, then unwrapped.
        var descriptionReceived = function descriptionReceived(description) {
          // Check to see if we expected this sort of message from this user.
          if (_this.isExpected(description.item.type, description)) {

            _this.recordProgress(description.item, "received");

            // The description we received is always the remote description, regardless of whether or not it's an offer
            // or an answer.
            return _this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

            // check to see if we're done.
            .then(check)

            // and if there are any errors, bomb out and shut everything down.
            .catch(onError);
          }
        };

        // When an offer or an answer is created, it's pretty much the same exact processing. Either type
        // of object gets wrapped with a context identifying which peer channel is being negotiated, and
        // then transmitted through the negotiation server to the remote user.
        var descriptionCreated = function descriptionCreated(description) {
          _this.recordProgress(description, "created");

          // The description we create is always the local description, regardless of whether or not it's an offer
          // or an answer.
          return _this.rtc.setLocalDescription(description)

          // Let the remote user know what happened.
          .then(function () {
            return _this.proxyServer.emit(description.type, _this.wrap(description));
          })

          // check to see if we're done.
          .then(check)

          // and if there are any errors, bomb out and shut everything down.
          .catch(onError);
        };

        // A catch-all error handler to shot down the world if an error we couldn't handle happens.
        var onError = function onError(exp) {
          _this._error(exp);
          done();
          reject();
        };

        // When an offer is received, we need to create an answer in reply.
        var onOffer = function onOffer(offer) {
          _this._log("offer", offer);
          var promise = descriptionReceived(offer);
          if (promise) {
            return promise.then(function () {
              return _this.rtc.createAnswer();
            }).then(descriptionCreated);
          }
        };

        // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
        // with enough information for the remote user to be able to connect to it.
        var onIce = function onIce(ice) {
          // Check to see if we expected this sort of message from this user.
          if (_this.isExpected("ice", ice)) {
            // And if so, store it in our database of possibilities.
            return _this.rtc.addIceCandidate(new RTCIceCandidate(ice.item)).catch(onError);
          }
        };

        // This really long event handler is not really the start of the process. Skip ahead to `proxyServer.on("user", onUser)`
        var onUser = function onUser(evt) {
          // When a user is joining a room with more than one user currently, already in the room, they will have to
          // make several connection in sequence. The Socket.IO event handlers don't seem to reliably turn off, so
          // we have to make sure the message we here is the one meant for this particular instance of the socket manager.
          if (_this.isExpected("new user", evt)) {

            // When an answer is recieved, it's much simpler than receiving an offer. We just mark the progress and
            // check to see if we're done.
            _this.proxyServer.on("answer", descriptionReceived);
            _this.proxyServer.on("offer", onOffer);
            _this.proxyServer.on("ice", onIce);

            // This is just for debugging purposes.
            _this.rtc.onsignalingstatechange = function (evt) {
              return _this._log("[%s] Signal State: %s", instanceNumber, _this.rtc.signalingState);
            };
            _this.rtc.oniceconnectionstatechange = function (evt) {
              return _this._log("[%s] ICE Connection/Gathering State: %s/%s", instanceNumber, _this.rtc.iceConnectionState, _this.rtc.iceGatheringState);
            };

            // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel
            // or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell
            // you that negotiation is necessary, and only then create the offer. There is a race-condition between
            // the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we
            // don't wait for the appropriate time.
            _this.rtc.onnegotiationneeded = function (evt) {
              return _this.createOffer()
              // record the local description.
              .then(descriptionCreated);
            };

            // The API is going to figure out end-point configurations for us by communicating with the STUN servers
            // and seeing which end-points are visible and which require network address translation.
            _this.rtc.onicecandidate = function (evt) {

              // There is an error condition where sometimes the candidate returned in this event handler will be null.
              if (evt.candidate) {

                // Then let the remote user know of our folly.
                _this.proxyServer.emit("ice", _this.wrap(evt.candidate));
              }
            };

            _this.issueRequest();
          }
        };

        // We need to do two things, wait for the remote user to indicate they would like to peer, and...
        _this.proxyServer.on("peer", onUser);

        // ... let the server know to inform the remote user that we would like to peer. We need to delay a little
        // bit because it takes the remote user a little time between logging in and being ready to receive messages.
        setTimeout(function () {
          return _this.proxyServer.emit("peer", _this.wrap());
        }, 250);

        // Okay, now go back to onUser
      });
    }

    _createClass(WebRTCSocket, [{
      key: "createOffer",
      value: function createOffer() {
        return this.rtc.createOffer();
      }
    }, {
      key: "recordProgress",
      value: function recordProgress(description, method) {
        pliny.method({
          parent: "Primrose.WebRTCSocket",
          name: "recordProgress",
          description: "mark that we made progress towards our goals.",
          parameters: [{ name: "description", type: "RTCSessionDescription", description: "An answer or offer object." }, { name: "method", type: "String", description: "Whether or not the description had been 'created' or 'received' here." }]
        });
        this.progress[description.type][method] = true;
      }
    }, {
      key: "wrap",
      value: function wrap(item) {
        pliny.method({
          parent: "Primrose.WebRTCSocket",
          name: "wrap",
          returns: "Object",
          description: "Provides the context into a message so that the remote user can tell if the message `this.isExpected()`",
          parameters: [{ name: "item", type: "Object", description: "The object to wrap." }]
        });
        return {
          fromUserName: this.fromUserName,
          fromUserIndex: this.fromUserIndex,
          toUserName: this.toUserName,
          toUserIndex: this.toUserIndex,
          item: item
        };
      }
    }, {
      key: "isExpected",
      value: function isExpected(tag, obj) {
        pliny.method({
          parent: "Primrose.WebRTCSocket",
          name: "isExpected",
          returns: "Boolean",
          description: "A test to see if we were expecting a particular message. Sometimes the messages get criss-crossed on the negotiation server, and this just makes sure we don't cause an error.",
          parameters: [{ name: "tag", type: "String", description: "A name for the operation being tested." }, { name: "obj", type: "Object", description: "The object within the operating being tested." }]
        });

        var incomplete = !this.complete,
            fromUser = obj.fromUserName === this.toUserName,
            fromIndex = obj.fromUserIndex === this.toUserIndex,
            toUser = obj.toUserName === this.fromUserName,
            toIndex = obj.toUserIndex === this.fromUserIndex,
            isExpected = incomplete && fromUser && fromIndex && toUser && toIndex;

        this._log("[%s->%s] I %s || FROM %s==%s (%s), %s==%s (%s) || TO %s==%s (%s), %s==%s (%s)", tag, isExpected, incomplete, obj.fromUserName, this.toUserName, fromUser, obj.fromUserIndex, this.toUserIndex, fromIndex, obj.toUserName, this.fromUserName, toUser, obj.toUserIndex, this.fromUserIndex, toIndex);
        this._log(obj);
        return isExpected;
      }
    }, {
      key: "close",
      value: function close() {
        pliny.method({
          parent: "Primrose.WebRTCSocket",
          name: "close",
          description: "shut down the peer connection, if it was succesful in being created."
        });

        this.rtc.close();
      }
    }, {
      key: "teardown",
      value: function teardown() {
        pliny.method({
          parent: "Primrose.WebRTCSocket",
          name: "teardown",
          description: "Whether ending succesfully or failing, the processing is mostly the same: teardown all the event handlers."
        });

        throw new Error("Not implemented.");
      }
    }, {
      key: "issueRequest",
      value: function issueRequest() {
        pliny.property({
          parent: "Primrose.WebRTCSocket",
          name: "issueRequest",
          description: "Override this method in subClasses to trigger the peering process."
        });

        throw new Error("Not implemented");
      }
    }, {
      key: "goFirst",
      get: function get() {
        pliny.property({
          parent: "Primrose.WebRTCSocket",
          name: "goFirst",
          type: "Boolean",
          description: "We don't want the ICE candidates, offers, and answers clashing in the middle, so we need to be careful about order of operations. The decision here is arbitrary, but it's easy to keep straight. Users with 'lower' names initiate peering."
        });
        return this.fromUserName < this.toUserName;
      }
    }, {
      key: "complete",
      get: function get() {
        pliny.property({
          parent: "Primrose.WebRTCSocket",
          name: "complete",
          returns: "Boolean",
          description: "Override this method in subClasses to indicate when the peering process is complete. The peering process is complete when all offers are answered."
        });

        throw new Error("Not implemented.");
      }
    }]);

    return WebRTCSocket;
  }();

  return WebRTCSocket;
}();