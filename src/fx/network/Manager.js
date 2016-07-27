Primrose.Network.Manager = (function () {
  "use strict";

  pliny.class({
    parent: "Primrose.Network",
      name: "Manager",
      parameters: [{
        name: "serverAddress",
        type: "String",
        description: "The address of the WebSocket server that manages multiplayer and device fusion connections."
      }, {
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
    constructor(serverAddress, localUser, audio, factories, options) {
      super();
      this.path = serverAddress;
      this.localUser = localUser;
      this.audio = audio;
      this.factories = factories;
      this.options = options;
      this.lastNetworkUpdate = 0;
      this.oldState = [];
      this.users = {};
      this.listUserPromise = Promise.resolve();
      this.socket = null;
      this.userName = null;
      this.attemptedUserName = null;
      this.microphone = null;
    }

    update(dt) {
      if (this.socket && this.deviceIndex === 0) {
        this.lastNetworkUpdate += dt;
        if (this.lastNetworkUpdate >= Primrose.Network.RemoteUser.NETWORK_DT) {
          this.lastNetworkUpdate -= Primrose.Network.RemoteUser.NETWORK_DT;
          for (var i = 0; i < this.localUser.newState.length; ++i) {
            if (this.oldState[i] !== this.localUser.newState[i]) {
              this.socket.emit("userState", this.localUser.newState);
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
          user.state = state;
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

    authenticate(appKey, verb, userName, password, email) {
      if(this.microphone === null){
        this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        })
        .then(Primrose.Output.Audio3D.setAudioStream.bind(null))
        .catch(console.warn.bind(console, "Can't get audio"))
      }
      this.attemptedUserName = userName;
      if (!this.socket) {
        console.log("connecting to: %s", this.path);
        this.socket = io(this.path);
        this.socket.on("connect_error", this.connectionError.bind(this, verb));
        this.socket.on("signupFailed", this.authFailed("signup"));
        this.socket.on("loginFailed", this.authFailed("login"));
        this.socket.on("userList", this.listUsers.bind(this));
        this.socket.on("userJoin", this.addUser.bind(this));
        this.socket.on("deviceAdded", this.addDevice.bind(this));
        this.socket.on("deviceIndex", this.setDeviceIndex.bind(this));
        this.socket.on("chat", this.receiveChat.bind(this));
        this.socket.on("userState", this.updateUser.bind(this));
        this.socket.on("userLeft", this.removeUser.bind(this));
        this.socket.on("logoutComplete", this.emit.bind(this, "loggedout"));
        this.socket.on("connection_lost", this.lostConnection.bind(this));
        this.socket.on("errorDetail", console.error.bind(console));
      }

      this.socket.once("salt", (salt) => {
        var hash = new Hashes.SHA256()
          .hex(salt + password)
        this.socket.emit("hash", hash);
      });
      this.socket.emit(verb, {
        userName: userName,
        email: email,
        app: appKey
      });
    }

    connectionError(verb, evt) {
      this.socket.close();
      this.socket = null;
      this.authFailed(verb)("an error occured while connecting to the server.");
    }

    addUser(state) {
      var toUserName = state[0],
        user = new Primrose.Network.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor);
      this.users[toUserName] = user;
      this.updateUser(state);
      this.listUserPromise = this.listUserPromise
        .then(() => user.peer(this.socket, this.microphone, this.userName, this.audio))
        .catch((exp) => console.error("Couldn't load user: " + name, exp));
      this.emit("addavatar", user);
    }

    removeUser(key) {
      console.log("User %s logging off.", key);
      var user = this.users[key];
      if (user) {
        user.unpeer();
        delete this.users[key];
        this.emit("removeavatar", user);
      }
    }

    listUsers(newUsers) {
      this.userName = this.attemptedUserName;
      Object.keys(this.users)
        .forEach(this.removeUser.bind(this));
      while (newUsers.length > 0) {
        this.addUser(newUsers.shift());
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

    authFailed(verb) {
      return (reason) => {
        this.emit("authorizationfailed", {
          verb,
          reason
        });
      }
    }
  }

  return Manager;
})();