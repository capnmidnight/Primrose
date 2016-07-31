"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Network.DataChannel = function () {
  "use strict";

  var INSTANCE_COUNT = 0;

  pliny.class({
    parent: "Primrose.Network",
    name: "DataChannel",
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

  var DataChannel = function (_Primrose$WebRTCSocke) {
    _inherits(DataChannel, _Primrose$WebRTCSocke);

    function DataChannel(proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex) {
      _classCallCheck(this, DataChannel);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataChannel).call(this, proxyServer, fromUserName, fromUserIndex, toUserName, toUserIndex));

      pliny.property({
        parent: "Primrose.Network.DataChannel",
        name: "dataChannel",
        type: "RTCDataChannel",
        description: "A bidirectional data channel from the remote user to the local user."
      });
      _this.dataChannel = null;
      return _this;
    }

    _createClass(DataChannel, [{
      key: "issueRequest",
      value: function issueRequest() {
        var _this2 = this;

        if (goFirst) {
          this._log("Creating data channel");
          this.dataChannel = this.rtc.createDataChannel();
        } else {
          this.ondatachannel = function (evt) {
            _this2._log("Receving data channel");
            _this2.dataChannel = evt.channel;
          };
        }
      }
    }, {
      key: "teardown",
      value: function teardown() {
        this.rtc.ondatachannel = null;
      }
    }, {
      key: "complete",
      get: function get() {
        if (this.goFirst) {
          this._log("[First]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
        } else {
          this._log("[Second]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
        }
        return _get(Object.getPrototypeOf(DataChannel.prototype), "complete", this) || this.goFirst && this.progress.offer.created && this.progress.answer.received || !this.goFirst && this.progress.offer.recieved && this.progress.answer.created;
      }
    }]);

    return DataChannel;
  }(Primrose.WebRTCSocket);

  return DataChannel;
}();