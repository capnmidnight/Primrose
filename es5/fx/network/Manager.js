"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.Network.Manager = function () {
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

  var Manager = function (_Primrose$AbstractEve) {
    _inherits(Manager, _Primrose$AbstractEve);

    function Manager(serverAddress, localUser, audio, factories, options) {
      _classCallCheck(this, Manager);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Manager).call(this));

      _this.path = serverAddress;
      _this.localUser = localUser;
      _this.audio = audio;
      _this.factories = factories;
      _this.options = options;
      _this.lastNetworkUpdate = 0;
      _this.oldState = [];
      _this.users = {};
      _this.listUserPromise = Promise.resolve();
      _this.socket = null;
      _this.userName = null;
      _this.attemptedUserName = null;
      _this.microphone = null;
      return _this;
    }

    _createClass(Manager, [{
      key: "update",
      value: function update(dt) {
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
    }, {
      key: "updateUser",
      value: function updateUser(state) {
        var key = state[0];
        if (key !== this.userName) {
          var user = this.users[key];
          if (user) {
            user.state = state;
          } else {
            console.error("Unknown user", key);
          }
        } else if (this.deviceIndex > 0) {
          this.localUser.stage.mesh.position.fromArray(state, 1);
          this.localUser.stage.mesh.quaternion.fromArray(state, 4);
          this.localUser.head.mesh.position.fromArray(state, 8);
          this.localUser.head.mesh.quaternion.fromArray(state, 11);
        }
      }
    }, {
      key: "authenticate",
      value: function authenticate(appKey, verb, userName, password, email) {
        var _this2 = this;

        if (this.microphone === null) {
          this.microphone = navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          }).then(Primrose.Output.Audio3D.setAudioStream.bind(null)).catch(console.warn.bind(console, "Can't get audio"));
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

        this.socket.once("salt", function (salt) {
          var hash = new Hashes.SHA256().hex(salt + password);
          _this2.socket.emit("hash", hash);
        });
        this.socket.emit(verb, {
          userName: userName,
          email: email,
          app: appKey
        });
      }
    }, {
      key: "connectionError",
      value: function connectionError(verb, evt) {
        this.socket.close();
        this.socket = null;
        this.authFailed(verb)("an error occured while connecting to the server.");
      }
    }, {
      key: "addUser",
      value: function addUser(state) {
        var _this3 = this;

        var toUserName = state[0],
            user = new Primrose.Network.RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor);
        this.users[toUserName] = user;
        this.updateUser(state);
        this.listUserPromise = this.listUserPromise.then(function () {
          return user.peer(_this3.socket, _this3.microphone, _this3.userName, _this3.audio);
        }).catch(function (exp) {
          return console.error("Couldn't load user: " + name, exp);
        });
        this.emit("addavatar", user);
      }
    }, {
      key: "removeUser",
      value: function removeUser(key) {
        console.log("User %s logging off.", key);
        var user = this.users[key];
        if (user) {
          user.unpeer();
          delete this.users[key];
          this.emit("removeavatar", user);
        }
      }
    }, {
      key: "listUsers",
      value: function listUsers(newUsers) {
        this.userName = this.attemptedUserName;
        Object.keys(this.users).forEach(this.removeUser.bind(this));
        while (newUsers.length > 0) {
          this.addUser(newUsers.shift());
        }
        this.emit("authorizationsucceeded");
      }
    }, {
      key: "receiveChat",
      value: function receiveChat(evt) {
        console.log("chat", evt);
      }
    }, {
      key: "lostConnection",
      value: function lostConnection() {
        this.deviceIndex = null;
      }
    }, {
      key: "addDevice",
      value: function addDevice(index) {
        console.log("addDevice", index);
      }
    }, {
      key: "setDeviceIndex",
      value: function setDeviceIndex(index) {
        this.deviceIndex = index;
      }
    }, {
      key: "authFailed",
      value: function authFailed(verb) {
        var _this4 = this;

        return function (reason) {
          _this4.emit("authorizationfailed", {
            verb: verb,
            reason: reason
          });
        };
      }
    }]);

    return Manager;
  }(Primrose.AbstractEventEmitter);

  return Manager;
}();