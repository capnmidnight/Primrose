pliny.class({
  parent: "Primrose.Network",
    name: "Manager",
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
      type: "Primrose.ModelLoader",
      description: "Model factory for creating avatars for new remote users."
    }]
});
class Manager extends Primrose.AbstractEventEmitter {
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
  }

  update(dt) {
    if (this._socket && this.deviceIndex === 0) {
      this.lastNetworkUpdate += dt;
      if (this.lastNetworkUpdate >= Primrose.Network.RemoteUser.NETWORK_DT) {
        this.lastNetworkUpdate -= Primrose.Network.RemoteUser.NETWORK_DT;
        for (var i = 0; i < this.localUser.newState.length; ++i) {
          if (this.oldState[i] !== this.localUser.newState[i]) {
            this._socket.emit("userState", this.localUser.newState);
            this.oldState = this.localUser.newState;
            break;
          }
        }
      }
    }
    for (var key in this.users) {
      var user = this.users[key];
      user.update(dt);
    }
  }

  updateUser(state) {
    var key = state[0];
    if (key !== this.userName) {
      var user = this.users[key];
      if (user) {
        user.setState(state);
      }
      else {
        console.error("Unknown user", key);
      }
    }
    else if (this.deviceIndex > 0) {
      this.localUser.stage.mesh.position.fromArray(state, 1);
      this.localUser.stage.mesh.quaternion.fromArray(state, 4);
      this.localUser.head.mesh.position.fromArray(state, 8);
      this.localUser.head.mesh.quaternion.fromArray(state, 11);
    }
  }

  connect(socket, userName) {
    this.userName = userName.toLocaleUpperCase();
    if (!this.microphone) {
      this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })
        //.then(Primrose.Output.Audio3D.setAudioStream)
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

      if(!this.options.disableWebRTC) {
        Primrose.WebRTCSocket.PEERING_EVENTS.forEach((name) => this._socket.on(name, (evt) => {
          console.log("-->", evt.type, evt);
          if(evt.toUserName === this.userName){
            const user = this.users[evt.fromUserName],
              methodName = "peering_" + name,
              method = user && user[methodName];
            if((user.peered || user.peering) && method){
              method.call(user, evt);
            }
            else{
              console.warn("NO METHOD %s ON USER %s", methodName, user);
            }
          }
          else{
            console.warn("MESSAGE SENT TO %s FROM %s BUT WE ARE %s", evt.toUserName, evt.fromUserName, this.userName);
          }
        }));
      }

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
      user = new Primrose.Network.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor, this.options.disableWebRTC, this.options.webRTC, this.microphone, this.userName, goSecond);
    this.users[toUserName] = user;
    this.updateUser(state);
    this.emit("addavatar", user);

    if(!this.options.disableWebRTC) {
      Primrose.WebRTCSocket.PEERING_EVENTS.forEach((name) =>
        user.addEventListener(name, (evt) => {
          console.log("<--", name, evt);
          this._socket.emit(name, evt);
        }));
      this.waitForLastUser = this.waitForLastUser
        .then(() => user.peer(this.audio))
        .then(() => console.log("%s is peered (%s) with %s", this.userName, user.peered, toUserName))
        .then(() => {
          if(user.peeringError) {
            console.error("Couldn't load user: " + name, user.peeringError);
          }
        });
    }
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
}
