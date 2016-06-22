'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Network.AudioChannel = function () {
  "use strict";

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {};
  }
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    navigator.mediaDevices.getUserMedia = function (constraint) {
      return new Promise(function (resolve, reject) {
        return navigator.getUserMedia(constraint, resolve, reject);
      });
    };
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
    return result && result.length == 2 ? result[1] : null;
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

  var INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose.Network",
    name: "AudioChannel",
    baseClass: "Primrose.WebRTCSocket",
    description: "Manages the negotiation between peer users to set up bidirectional audio between the two.",
    parameters: [{ name: "proxyServer", type: "WebSocket", description: "A connection over which to negotiate the peering." }, { name: "fromUserName", type: "String", description: "The name of the local user, from which the peering is being initiated." }, { name: "toUserName", type: "String", description: "The name of the remote user, to which the peering is being requested." }, { name: "outAudio", type: "MediaStream", description: "An audio stream from the local user to send to the remote user." }]
  });

  var AudioChannel = function (_Primrose$WebRTCSocke) {
    _inherits(AudioChannel, _Primrose$WebRTCSocke);

    function AudioChannel(proxyServer, fromUserName, toUserName, outAudio) {
      _classCallCheck(this, AudioChannel);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AudioChannel).call(this, proxyServer, fromUserName, 0, toUserName, 0));

      pliny.property({
        parent: "Primrose.Network.AudioChannel",
        name: "outAudio",
        type: "MediaStream",
        description: "An audio channel from the local user to the remote user."
      });
      Object.defineProperty(_this, "outAudio", {
        get: function get() {
          return outAudio;
        }
      });

      pliny.property({
        parent: "Primrose.Network.AudioChannel",
        name: "inAudio",
        type: "MediaStream",
        description: "An audio channel from the remote user to the local user."
      });
      _this.inAudio = null;
      return _this;
    }

    _createClass(AudioChannel, [{
      key: 'issueRequest',
      value: function issueRequest() {
        var _this2 = this;

        // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
        //  version of the API) and Chrome.
        var addStream = function addStream() {
          _this2._log("adding stream", _this2.outAudio);

          // Make sure we actually have audio to send to the remote.
          if (_this2.outAudio) {
            if (isFirefox) {
              _this2.outAudio.getAudioTracks().forEach(function (track) {
                return _this2.rtc.addTrack(track, _this2.outAudio);
              });
            } else {
              _this2.rtc.addStream(_this2.outAudio);
            }
          }
        };

        // Receiving an audio stream from the peer connection is just a
        var onStream = function onStream(stream) {
          _this2.inAudio = stream;
          if (!_this2.goFirst) {
            _this2._log("Creating the second stream");
            addStream();
          }
        };

        // Wait to receive an audio track.
        if (isFirefox) {
          this.rtc.ontrack = function (evt) {
            return onStream(evt.streams[0]);
          };
        } else {
          this.rtc.onaddstream = function (evt) {
            return onStream(evt.stream);
          };
        }

        // If we're the boss, tell people about it.
        if (this.goFirst) {
          this._log("Creating the first stream");
          addStream();
        }
      }

      // The peering process is complete when all offers are answered.

    }, {
      key: 'teardown',
      value: function teardown() {
        if (isFirefox) {
          this.rtc.ontrack = null;
        } else {
          this.rtc.onaddstream = null;
        }
      }
    }, {
      key: 'createOffer',
      value: function createOffer() {
        return _get(Object.getPrototypeOf(AudioChannel.prototype), 'createOffer', this).call(this).then(preferOpus);
      }
    }, {
      key: 'complete',
      get: function get() {
        if (this.goFirst) {
          this._log("[First]: OC %s -> AR %s -> OR %s -> AC %s.", this.progress.offer.created, this.progress.answer.received, this.progress.offer.received, this.progress.answer.created);
        } else {
          this._log("[Second]: OR %s -> AC %s -> OC %s -> AR %s.", this.progress.offer.received, this.progress.answer.created, this.progress.offer.created, this.progress.answer.received);
        }

        return this.progress.offer.received && this.progress.offer.created && this.progress.answer.received && this.progress.answer.created;
      }
    }]);

    return AudioChannel;
  }(Primrose.WebRTCSocket);

  return AudioChannel;
}();