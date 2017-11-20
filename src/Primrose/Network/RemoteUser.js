/*
pliny.class({
  parent: "Primrose.Network",
  name: "RemoteUser",
  baseClass: "THREE.EventDispatcher",
  description: "A networked user.",
  parameters: [{
    name: "userName",
    type: "String",
    description: "The name of the user."
  }, {
    name: "modelFactory",
    type: "Primrose.Controls.ModelFactory",
    description: "The factory for creating avatars for the user."
  }, {
    name: "nameMaterial",
    type: "Number",
    description: "The color to use with `colored()` to set as the material for the NAME object that will float above the user's avatar."
  }, {
    name: "requestICEPath",
    type: "string",
    description: "A request path at which to retrieve the extra ICE servers to use with the connection."
  }, {
    name: "microphone",
    type: "Promise",
    description: "A promise that resolves with an audio stream that can be sent to the remote user, representing the local user's voice chat."
  }, {
    name: "localUserName",
    type: "String",
    description: "The name of the user initiating the peer connection."
  }]
});
*/

import { EventDispatcher } from "three";

import { colored } from "../../live-api";

import randColor from "../Random/color";
import Audio3D from "../Audio/Audio3D";
import { Quaternion, Vector3 } from "three";

export default class RemoteUser extends EventDispatcher {

  constructor(userName, modelFactory, nameMaterial, disableWebRTC, requestICEPath, microphone, localUserName, goSecond) {
    super();
    this.time = 0;

    this.userName = userName;
    this.peeringError = null;
    this.peering = false;
    this.peered = false;
    this.stage = modelFactory.clone();
    this.stage.traverse((obj) => {
      if (obj.name === "AvatarBelt") {
        colored(obj, randColor());
      }
      else if (obj.name === "AvatarHead") {
        this.head = obj;
      }
    });

    this.nameObject = colored(text3D(0.1, userName), nameMaterial);
    var bounds = this.nameObject.geometry.boundingBox.max;
    this.nameObject.rotation.set(0, Math.PI, 0);
    this.nameObject.position.set(bounds.x / 2, bounds.y, 0);
    this.head.add(this.nameObject);

    this.dStageQuaternion = new Quaternion();
    this.dHeadPosition = new Vector3();
    this.dHeadQuaternion = new Quaternion();

    this.lastStageQuaternion = new Quaternion();
    this.lastHeadPosition = new Vector3();
    this.lastHeadQuaternion = new Quaternion();

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

  setAudio(audio, audioSource){
    if(audioSource instanceof Element){
      this.audioElement = audioSource;
      Audio3D.setAudioProperties(this.audioElement);
      this.audioStream = audio.context.createMediaElementSource(this.audioElement);
    }
    else {
      this.audioElement = Audio3D.setAudioStream(audioSource, "audio" + this.userName);
      this.audioStream = audio.context.createMediaStreamSource(audioSource);
    }
    this.gain = audio.context.createGain();
    this.panner = audio.context.createPanner();

    this.audioStream.connect(this.gain);
    this.gain.connect(this.panner);
    this.panner.connect(audio.mainVolume);
    this.panner.coneInnerAngle = 180;
    this.panner.coneOuterAngle = 360;
    this.panner.coneOuterGain = 0.1;
    this.panner.panningModel = "HRTF";
    this.panner.distanceModel = "exponential";
  }

  unpeer() {
    /*
    pliny.method({
      parent: "Pliny.RemoteUser",
      name: "unpeer",
      description: "Cleans up after a user has left the room, removing the audio channels that were created for the user."
    });
    */

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
    /*
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
    */

    this.time += dt;
    var fade = this.time >= RemoteUser.NETWORK_DT;
    this._updateV(this.headPosition, dt, fade);
    this._updateV(this.headQuaternion, dt, fade);
    this.stage.rotation.setFromQuaternion(this.headQuaternion.curr);
    this.stage.rotation.x = 0;
    this.stage.rotation.z = 0;
    this.stage.position.copy(this.headPosition.curr);
    this.stage.position.y = 0;
    if (this.panner) {
      this.panner.setPosition(this.stage.position.x, this.stage.position.y, this.stage.position.z);
      this.panner.setOrientation(Math.sin(this.stage.rotation.y), 0, Math.cos(this.stage.rotation.y));
    }
  }

  setState(v) {
    /*
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
    */

    this.time = 0;
    this._predict(this.headPosition, v, 1);
    this._predict(this.headQuaternion, v, 4);
  }

  toString(digits) {
    return this.stage.position.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
  }
}

RemoteUser.FADE_FACTOR = 0.5;
RemoteUser.NETWORK_DT = 0.10;
RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;
