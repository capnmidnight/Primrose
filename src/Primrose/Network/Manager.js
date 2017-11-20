/*
pliny.class({
  parent: "Primrose.Network",
  name: "Manager",
  baseClass: "THREE.EventDispatcher",
  parameters: [{
    name: "localUser",
    type: "Primrose.Input.FPSInput",
    description: "The object that represents the player's location in the scene."
  }, {
    name: "audio",
    type: "Primrose.Output.Audio3D",
    description: "The audio manager being used in the current Environment."
  }, {
    name: "factories",
    type: "Primrose.Controls.ModelFactory",
    description: "Model factory for creating avatars for new remote users."
  }]
});
*/

import { EventDispatcher } from "three";
import RemoteUser from "./RemoteUser";

export default class Manager extends EventDispatcher {
  constructor(localUser, audio, factories, options) {
    super();
    this.localUser = localUser;
    this.audio = audio;
    this.factories = factories;
    this.options = options;
    this.lastNetworkUpdate = 0;
    this.oldState = [];
    this.users = {};
    this.waitForLastUser = Promise.resolve();
    this._socket = null;
    this.userName = null;
    this.microphone = null;
    this.audioHeap = {};
  }

  update(dt) {
    if (this._socket && this.deviceIndex === 0) {
      this.lastNetworkUpdate += dt;
      if (this.lastNetworkUpdate >= RemoteUser.NETWORK_DT) {
        this.lastNetworkUpdate -= RemoteUser.NETWORK_DT;
        for (var i = 0; i < this.localUser.newState.length; ++i) {
          if (this.oldState[i] !== this.localUser.newState[i]) {
            this._socket.emit("userState", this.localUser.newState);
            this.oldState = this.localUser.newState;
            break;
          }
        }
      }
    }
    for (const key in this.users) {
      const user = this.users[key];
      user.update(dt);
      if(this.audioHeap[key]){
        user.setAudio(this.audio, this.audioHeap[key]);
        delete this.audioHeap[key];
      }
    }
  }

  updateUser(state) {
    const key = state[0];
    if (key !== this.userName) {
      const user = this.users[key];
      if (user) {
        user.setState(state);
      }
    }
    else if (this.deviceIndex > 0) {
      this.localUser.stage.position.fromArray(state, 1);
      this.localUser.stage.quaternion.fromArray(state, 4);
      this.localUser.head.position.fromArray(state, 8);
      this.localUser.head.quaternion.fromArray(state, 11);
    }
  }

  connect(socket, userName) {
    this.userName = userName.toLocaleUpperCase();
    if (!this.microphone) {
      this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })
        .catch(console.warn.bind(console, "Can't get audio"));
    }
    if (!this._socket) {
      this._socket = socket;
      this._socket.on("userList", this.listUsers.bind(this));
      this._socket.on("userJoin", this.addUser.bind(this));
      this._socket.on("deviceAdded", this.addDevice.bind(this));
      this._socket.on("deviceIndex", this.setDeviceIndex.bind(this));
      this._socket.on("chat", this.receiveChat.bind(this));
      this._socket.on("userState", this.updateUser.bind(this));
      this._socket.on("userLeft", this.removeUser.bind(this));
      this._socket.on("connection_lost", this.lostConnection.bind(this));
      this._socket.emit("listUsers");
      this._socket.emit("getDeviceIndex");
    }
  }

  disconnect() {
    this.userName = null;
    this._socket.close();
    this._socket = null;
  }

  addUser(state, goSecond) {
    console.log("User %s logging on.", state[0]);
    var toUserName = state[0],
      user = new RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor, this.options.disableWebRTC, this.options.webRTC, this.microphone, this.userName, goSecond);
    this.users[toUserName] = user;
    this.updateUser(state);
    this.emit("addavatar", user);
  }

  removeUser(key) {
    console.log("User %s logging off.", key);
    var user = this.users[key];
    if (user) {
      if(user.peered){
        user.unpeer();
      }
      delete this.users[key];
      this.emit("removeavatar", user);
    }
  }

  listUsers(newUsers) {
    Object.keys(this.users)
      .forEach(this.removeUser.bind(this));
    while (newUsers.length > 0) {
      this.addUser(newUsers.shift(), true);
    }
    this.emit("authorizationsucceeded");
  }

  receiveChat(evt) {
    console.log("chat", evt);
  }

  lostConnection() {
    this.deviceIndex = null;
  }

  addDevice(index) {
    console.log("addDevice", index);
  }

  setDeviceIndex(index) {
    this.deviceIndex = index;
  }

  setAudioFromUser(userName, audioElement){
    this.audioHeap[userName] = audioElement;
  }
}
