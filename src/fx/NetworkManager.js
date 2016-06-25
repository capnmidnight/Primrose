Primrose.NetworkManager = (function(){
  "use strict";

  pliny.class({
    parent: "Primrose",
    name: "NetworkManager",
    parameters: [
      { name: "serverAddress", type: "String", description: "The address of the WebSocket server that manages multiplayer and device fusion connections."},
      { name: "player", type: "THREE.Object3D", description: "The object that represents the player in the scene."}
    ]
  });
  class NetworkManager{
    constructor(serverAddress, player, microphone, audio, factories, options){
      this.path = serverAddress;
      this.player = player;
      this.vehicle = player.parent;
      this.microphone = microphone;
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
      this.listeners = {
        authorizationsucceeded: [],
        authorizationfailed: [],
        addavatar: [],
        removeavatar: []
      };
    }

    addEventListener(event, thunk) {
      if (this.listeners[event]) {
        this.listeners[event].push(thunk);
      }
    }

    update(dt){
      if (this.socket && this.deviceIndex === 0) {
        this.lastNetworkUpdate += dt;
        if (this.lastNetworkUpdate >= Primrose.RemoteUser.NETWORK_DT) {
          this.lastNetworkUpdate -= Primrose.RemoteUser.NETWORK_DT;
          var newState = [ ],
            add = (v) => v.toArray(newState, newState.length);
          add(this.vehicle.quaternion);
          add(this.vehicle.position);
          add(this.player.quaternion);
          add(this.player.position);
          for (var i = 0; i < newState.length; ++i) {
            if (this.oldState[i] !== newState[i]) {
              this.socket.emit("userState", newState);
              this.oldState = newState;
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

    authenticate(appKey, verb, userName, password, email){
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
        this.socket.on("logoutComplete", emit.bind(this, "loggedout"));
        this.socket.on("connection_lost",this.lostConnection.bind(this));
        this.socket.on("errorDetail", console.error.bind(console));
      }

      this.socket.once("salt", (salt) => {
        var hash = new Hashes.SHA256().hex(salt + password)
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

    addUser(state){
      var toUserName = state[0],
      user = new Primrose.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor);
      this.users[toUserName] = user;
      this.updateUser(state);
      this.listUserPromise = this.listUserPromise
        .then(() => user.peer(this.socket, this.microphone, this.userName, this.audio))
        .catch((exp) => console.error("Couldn't load user: " + name, exp));
      emit.call(this, "addavatar", user.avatar);
    }

    removeUser(key){
      console.log("User %s logging off.", key);
      var user = this.users[key];
      if(user){
        user.unpeer();
        delete this.users[key];
        emit.call(this, "removeavatar", user.avatar);
      }
    }

    listUsers(newUsers) {
      this.userName = this.attemptedUserName;
      Object.keys(this.users).forEach(this.removeUser.bind(this));
      while (newUsers.length > 0) {
        this.addUser(newUsers.shift());
      }
      emit.call(this, "authorizationsucceeded");
    }

    receiveChat(evt) {
      console.log("chat", evt);
    }

    updateUser(state){
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
        this.player.heading = state[1];
        this.player.position.x = state[2];
        this.player.position.y = state[3];
        this.player.position.z = state[4];
        this.player.qHead.x = state[5];
        this.player.qHead.y = state[6];
        this.player.qHead.z = state[7];
        this.player.qHead.w = state[8];
        this.player.pHead.x = state[9];
        this.player.pHead.y = state[10];
        this.player.pHead.z = state[11];
      }
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
        emit.call(this, "authorizationfailed", {
          verb,
          reason
        });
      }
    }
  }

  return NetworkManager; 
})();