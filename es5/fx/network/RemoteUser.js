"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.Network.RemoteUser = function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Network",
    name: "RemoteUser",
    description: "A networked user.",
    parameters: [{
      name: "userName",
      type: "String",
      description: "The name of the user."
    }, {
      name: "modelFactory",
      type: "Primrose.ModelLoader",
      description: "The factory for creating avatars for the user."
    }, {
      name: "nameMaterial",
      type: "Number",
      description: "The color to use with `textured()` to set as the material for the NAME object that will float above the user's avatar."
    }]
  });

  var RemoteUser = function () {
    function RemoteUser(userName, modelFactory, nameMaterial) {
      var _this = this;

      _classCallCheck(this, RemoteUser);

      this.time = 0;

      this.userName = userName;
      this.stage = modelFactory.clone();
      this.stage.traverse(function (obj) {
        if (obj.name === "AvatarBelt") {
          textured(obj, Primrose.Random.color());
        } else if (obj.name === "AvatarHead") {
          _this.head = obj;
        }
      });

      this.nameObject = textured(text3D(0.1, userName), nameMaterial);
      var bounds = this.nameObject.geometry.boundingBox.max;
      this.nameObject.rotation.set(Math.PI / 2, 0, 0);
      this.nameObject.position.set(-bounds.x / 2, 0, bounds.y);
      this.head.add(this.nameObject);

      this.dStagePosition = new THREE.Vector3();
      this.dStageQuaternion = new THREE.Quaternion();
      this.dHeadPosition = new THREE.Vector3();
      this.dHeadQuaternion = new THREE.Quaternion();

      this.lastStagePosition = new THREE.Vector3();
      this.lastStageQuaternion = new THREE.Quaternion();
      this.lastHeadPosition = new THREE.Vector3();
      this.lastHeadQuaternion = new THREE.Quaternion();

      this.stagePosition = {
        arr1: [],
        arr2: [],
        last: this.lastStagePosition,
        delta: this.dStagePosition,
        curr: this.stage.position
      };
      this.stageQuaternion = {
        arr1: [],
        arr2: [],
        last: this.lastStageQuaternion,
        delta: this.dStageQuaternion,
        curr: this.stage.quaternion
      };

      this.headPosition = {
        arr1: [],
        arr2: [],
        last: this.lastHeadPosition,
        delta: this.dHeadPosition,
        curr: this.head.position
      };
      this.headQuaternion = {
        arr1: [],
        arr2: [],
        last: this.lastHeadQuaternion,
        delta: this.dHeadQuaternion,
        curr: this.head.quaternion
      };

      this.audioChannel = null;
      this.audioElement = null;
      this.audioStream = null;
      this.gain = null;
      this.panner = null;
      this.analyzer = null;
    }

    _createClass(RemoteUser, [{
      key: "peer",
      value: function peer(peeringSocket, microphone, localUserName, audio) {
        var _this2 = this;

        pliny.method({
          parent: "Pliny.RemoteUser",
          name: "peer",
          returns: "Promise",
          description: "Makes a WebRTCPeerConnection between the local user and this remote user and wires up the audio channel.",
          parameters: [{
            name: "peeringSocket",
            type: "WebSocket",
            description: "A WebSocket over which the peer connection will be negotiated."
          }, {
            name: "microphone",
            type: "Promise",
            description: "A promise that resolves with an audio stream that can be sent to the remote user, representing the local user's voice chat."
          }, {
            name: "localUserName",
            type: "String",
            description: "The name of the user initiating the peer connection."
          }, {
            name: "audio",
            type: "Primrose.Output.Audio3D",
            description: "The audio context form which audio spatialization objects will be created, and to which the remote user's voice chat will be piped."
          }]
        });

        return microphone.then(function (outAudio) {
          _this2.audioChannel = new Primrose.Network.AudioChannel(peeringSocket, localUserName, _this2.userName, outAudio);
          _this2.audioChannel.ready.then(function () {
            if (!_this2.audioChannel.inAudio) {
              throw new Error("Didn't get an audio channel for " + _this2.userName);
            }
            _this2.audioElement = new Audio();
            Primrose.Output.Audio3D.setAudioStream(_this2.audioChannel.inAudio);
            _this2.audioElement.controls = false;
            _this2.audioElement.autoplay = true;
            _this2.audioElement.crossOrigin = "anonymous";
            document.body.appendChild(_this2.audioElement);

            _this2.audioStream = audio.context.createMediaStreamSource(_this2.audioChannel.inAudio);
            _this2.gain = audio.context.createGain();
            _this2.panner = audio.context.createPanner();

            Primrose.Output.Audio3D.chain(_this2.audioStream, _this2.gain, _this2.panner, audio.mainVolume);
            _this2.panner.coneInnerAngle = 180;
            _this2.panner.coneOuterAngle = 360;
            _this2.panner.coneOuterGain = 0.1;
            _this2.panner.panningModel = "HRTF";
            _this2.panner.distanceModel = "exponential";
          }).catch(console.error.bind(console, "error"));
        });
      }
    }, {
      key: "unpeer",
      value: function unpeer() {
        pliny.method({
          parent: "Pliny.RemoteUser",
          name: "unpeer",
          description: "Cleans up after a user has left the room, removing the audio channels that were created for the user."
        });

        if (this.audioChannel) {
          this.audioChannel.close();
          if (this.audioElement) {
            document.body.removeChild(this.audioElement);
            if (this.panner) {
              this.panner.disconnect();
              this.gain.disconnect();
              this.audioStream.disconnect();
            }
          }
        }
      }
    }, {
      key: "_updateV",
      value: function _updateV(v, dt, fade) {
        v.curr.toArray(v.arr1);
        v.delta.toArray(v.arr2);
        for (var i = 0; i < v.arr1.length; ++i) {
          if (fade) {
            v.arr2[i] *= RemoteUser.FADE_FACTOR;
          }
          v.arr1[i] += v.arr2[i] * dt;
        }

        v.curr.fromArray(v.arr1);
        v.delta.fromArray(v.arr2);
      }
    }, {
      key: "_predict",
      value: function _predict(v, state, off) {
        v.delta.fromArray(state, off);
        v.delta.toArray(v.arr1);
        v.curr.toArray(v.arr2);
        for (var i = 0; i < v.arr1.length; ++i) {
          v.arr1[i] = (v.arr1[i] - v.arr2[i]) * RemoteUser.NETWORK_DT_INV;
        }
        v.delta.fromArray(v.arr1);
      }
    }, {
      key: "update",
      value: function update(dt) {
        pliny.method({
          parent: "Pliny.RemoteUser",
          name: "update",
          description: "Moves the avatar by its velocity for a set amount of time. Updates the audio panner information.",
          parameters: [{
            name: "dt",
            type: "Number",
            description: "The amount of time since the last update to the user."
          }]
        });

        this.time += dt;
        var fade = this.time >= RemoteUser.NETWORK_DT;
        this._updateV(this.stagePosition, dt, fade);
        this._updateV(this.stageQuaternion, dt, fade);
        this._updateV(this.headPosition, dt, fade);
        this._updateV(this.headQuaternion, dt, fade);
        if (this.panner) {
          this.panner.setPosition(this.stage.position.x, this.stage.position.y, this.stage.position.z);
          this.panner.setQuaternion(Math.sin(this.stage.rotation.y), 0, Math.cos(this.stage.rotation.y));
        }
      }
    }, {
      key: "toString",
      value: function toString(digits) {
        return this.stagePosition.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
      }
    }, {
      key: "state",
      set: function set(v) {
        pliny.property({
          parent: "Pliny.RemoteUser",
          name: "state",
          description: "After receiving a network update, sets the current state of the remote user so that, by the time the next network update comes around, the user will be where it is predicted to be.",
          parameters: [{
            name: "v",
            type: "Array",
            description: "The raw state array from the network (includes the un-read first username field)."
          }]
        });

        this.time = 0;
        this._predict(this.stagePosition, v, 1);
        this._predict(this.stageQuaternion, v, 4);
        this._predict(this.headPosition, v, 8);
        this._predict(this.headQuaternion, v, 11);
      }
    }]);

    return RemoteUser;
  }();

  RemoteUser.FADE_FACTOR = 0.5;
  RemoteUser.NETWORK_DT = 0.10;
  RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
  return RemoteUser;
}();