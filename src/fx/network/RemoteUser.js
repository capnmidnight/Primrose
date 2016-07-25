Primrose.Network.RemoteUser = (function () {
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
  class RemoteUser {

    constructor(userName, modelFactory, nameMaterial) {
      this.time = 0;

      this.userName = userName;
      this.avatar = modelFactory.clone();
      this.avatar.traverse((obj) => {
        if (obj.name === "AvatarBelt") {
          textured(obj, Primrose.Random.color());
        }
        else if (obj.name === "AvatarHead") {
          this.head = obj;
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
        curr: this.avatar.position
      };
      this.stageQuaternion = {
        arr1: [],
        arr2: [],
        last: this.lastStageQuaternion,
        delta: this.dStageQuaternion,
        curr: this.avatar.quaternion
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

    peer(peeringSocket, microphone, localUserName, audio) {
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


      return microphone.then((outAudio) => {
        this.audioChannel = new Primrose.Network.AudioChannel(peeringSocket, localUserName, this.userName, outAudio);
        this.audioChannel.ready
          .then(() => {
            if (!this.audioChannel.inAudio) {
              throw new Error("Didn't get an audio channel for " + this.userName);
            }
            this.audioElement = new Audio();
            Primrose.Output.Audio3D.setAudioStream(this.audioElement, this.audioChannel.inAudio);
            this.audioElement.controls = false;
            this.audioElement.autoplay = true;
            this.audioElement.crossOrigin = "anonymous";
            document.body.appendChild(this.audioElement);

            this.audioStream = audio.context.createMediaStreamSource(this.audioChannel.inAudio);
            this.gain = audio.context.createGain();
            this.panner = audio.context.createPanner();

            Primrose.Output.Audio3D.chain(
              this.audioStream,
              this.gain,
              this.panner,
              audio.mainVolume);
            this.panner.coneInnerAngle = 180;
            this.panner.coneOuterAngle = 360;
            this.panner.coneOuterGain = 0.1;
            this.panner.panningModel = "HRTF";
            this.panner.distanceModel = "exponential";
          })
          .catch(console.error.bind(console, "error"));
      });
    }

    unpeer() {
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

    _updateV(v, dt, fade) {
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

    _predict(v, state, off) {
      v.delta.fromArray(state, off);
      v.delta.toArray(v.arr1);
      v.curr.toArray(v.arr2);
      for (var i = 0; i < v.arr1.length; ++i) {
        v.arr1[i] = (v.arr1[i] - v.arr2[i]) * RemoteUser.NETWORK_DT_INV;
      }
      v.delta.fromArray(v.arr1);
    }

    update(dt) {
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
        this.panner.setPosition(this.avatar.position.x, this.avatar.position.y, this.avatar.position.z);
        this.panner.setQuaternion(Math.sin(this.avatar.rotation.y), 0, Math.cos(this.avatar.rotation.y));
      }
    }

    set state(v) {
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

    toString(digits) {
      return this.stagePosition.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
    }
  }

  RemoteUser.FADE_FACTOR = 0.5;
  RemoteUser.NETWORK_DT = 0.10;
  RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
  return RemoteUser;
})();