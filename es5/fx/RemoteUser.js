"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.RemoteUser = function () {
  "use strict";

  pliny.class({
    parent: "Primrose",
    name: "RemoteUser",
    description: "A networked user.",
    parameters: [{ name: "userName", type: "String", description: "The name of the user." }, { name: "modelFactory", type: "Primrose.ModelLoader", description: "The factory for creating avatars for the user." }, { name: "nameMateria", type: "Number", description: "The color to use with `textured()` to set as the material for the NAME object that will float above the user's avatar." }]
  });

  var RemoteUser = function () {
    function RemoteUser(userName, modelFactory, nameMaterial) {
      var _this = this;

      _classCallCheck(this, RemoteUser);

      this.userName = userName;
      this.head = null;
      this.dHeadQuaternion = null;
      this.dHeadPosition = null;
      this.avatar = modelFactory.clone();

      this.avatar.traverse(function (obj) {
        if (obj.name === "AvatarBelt") {
          textured(obj, Primrose.Random.color());
        } else if (obj.name === "AvatarHead") {
          _this.head = obj;
        }
      });

      this.dHeading = 0;
      this.velocity = new THREE.Vector3();
      this.time = 0;

      this.nameObject = textured(text3D(0.1, userName), nameMaterial);
      var bounds = this.nameObject.geometry.boundingBox.max;
      this.nameObject.rotation.set(Math.PI / 2, 0, 0);
      this.nameObject.position.set(-bounds.x / 2, 0, bounds.y);
      if (this.head) {
        this.head.add(this.nameObject);
        this.dHeadQuaternion = new THREE.Quaternion();
        this.dHeadPosition = new THREE.Vector3();
      }

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
          parameters: [{ name: "peeringSocket", type: "WebSocket", description: "A WebSocket over which the peer connection will be negotiated." }, { name: "microphone", type: "Promise", description: "A promise that resolves with an audio stream that can be sent to the remote user, representing the local user's voice chat." }, { name: "localUserName", type: "String", description: "The name of the user initiating the peer connection." }, { name: "audio", type: "Primrose.Output.Audio3D", description: "The audio context form which audio spatialization objects will be created, and to which the remote user's voice chat will be piped." }]
        });

        return microphone.then(function (outAudio) {
          _this2.audioChannel = new Primrose.Network.AudioChannel(peeringSocket, localUserName, _this2.userName, outAudio);
          _this2.audioChannel.ready.then(function () {
            if (!_this2.audioChannel.inAudio) {
              throw new Error("Didn't get an audio channel for " + _this2.userName);
            }
            _this2.audioElement = new Audio();
            Primrose.Output.Audio3D.setAudioStream(_this2.audioElement, _this2.audioChannel.inAudio);
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
      key: "update",
      value: function update(dt) {
        pliny.method({
          parent: "Pliny.RemoteUser",
          name: "update",
          description: "Moves the avatar by its velocity for a set amount of time. Updates the audio panner information.",
          parameters: [{ name: "dt", type: "Number", description: "The amount of time since the last update to the user." }]
        });

        this.time += dt;
        if (this.time >= RemoteUser.NETWORK_DT) {
          this.velocity.multiplyScalar(0.5);
          this.dHeading *= 0.5;
          this.dHeadQuaternion.x *= 0.5;
          this.dHeadQuaternion.y *= 0.5;
          this.dHeadQuaternion.z *= 0.5;
          this.dHeadQuaternion.w *= 0.5;
          this.dHeadPosition.x *= 0.5;
          this.dHeadPosition.y *= 0.5;
          this.dHeadPosition.z *= 0.5;
        }
        this.avatar.position.add(this.velocity.clone().multiplyScalar(dt));
        this.avatar.rotation.y += this.dHeading * dt;
        this.head.quaternion.x += this.dHeadQuaternion.x * dt;
        this.head.quaternion.y += this.dHeadQuaternion.y * dt;
        this.head.quaternion.z += this.dHeadQuaternion.z * dt;
        this.head.quaternion.w += this.dHeadQuaternion.w * dt;
        this.head.position.x += this.dHeadPosition.x * dt;
        this.head.position.y += this.dHeadPosition.y * dt;
        this.head.position.z += this.dHeadPosition.z * dt;
        if (this.panner) {
          this.panner.setPosition(this.avatar.position.x, this.avatar.position.y, this.avatar.position.z);
          this.panner.setOrientation(Math.sin(this.avatar.rotation.y), 0, Math.cos(this.avatar.rotation.y));
        }
      }
    }, {
      key: "state",
      set: function set(v) {
        pliny.property({
          parent: "Pliny.RemoteUser",
          name: "state",
          description: "After receiving a network update, sets the current state of the remote user so that, by the time the next network update comes around, the user will be where it is predicted to be.",
          parameters: [{ name: "v", type: "Array", description: "The raw state array from the network (includes the un-read first username field)." }]
        });

        this.time = 0;

        this.dHeading = (v[1] - this.avatar.rotation.y) / RemoteUser.NETWORK_DT;

        this.velocity.set(v[2], v[3], v[4]);
        this.velocity.sub(this.avatar.position);
        this.velocity.multiplyScalar(1 / RemoteUser.NETWORK_DT);

        this.dHeadQuaternion.set(v[7], v[5], v[6], v[8]);
        this.dHeadQuaternion.x -= this.head.quaternion.x;
        this.dHeadQuaternion.y -= this.head.quaternion.y;
        this.dHeadQuaternion.z -= this.head.quaternion.z;
        this.dHeadQuaternion.w -= this.head.quaternion.w;
        this.dHeadQuaternion.x /= RemoteUser.NETWORK_DT;
        this.dHeadQuaternion.y /= RemoteUser.NETWORK_DT;
        this.dHeadQuaternion.z /= RemoteUser.NETWORK_DT;
        this.dHeadQuaternion.w /= RemoteUser.NETWORK_DT;

        this.dHeadPosition.set(v[9], v[11], v[10]);
        this.dHeadPosition.x -= this.head.position.x;
        this.dHeadPosition.y -= this.head.position.y;
        this.dHeadPosition.z -= this.head.position.z;
        this.dHeadPosition.x /= RemoteUser.NETWORK_DT;
        this.dHeadPosition.y /= RemoteUser.NETWORK_DT;
        this.dHeadPosition.z /= RemoteUser.NETWORK_DT;
      }
    }]);

    return RemoteUser;
  }();

  RemoteUser.NETWORK_DT = 0.10;
  return RemoteUser;
}();