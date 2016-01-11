var crypto = require("crypto"),
    log = require("../core").log;

function User(info) {
  this.devices = [];
  this.handlers = [];
  this.state = {
    x: 0,
    y: 0,
    z: 0,
    dx: 0,
    dy: 0,
    dz: 0,
    heading: 0,
    dHeading: 0,
    isRunning: false,
    userName: info.userName
  };
  
  this.salt = info.salt;
  this.hash = info.hash;  
  this.email = info.email;
}

User.makeNewSalt = function () {
  var bytes = crypto.randomBytes(256);
  var salt = "";
  for (var i = 0; i < bytes.length; ++i) {
    salt += bytes[i].toString(16);
  }
  return salt;
};

User.prototype.addDevice = function (users, socket) {
  //
  // find a slot in which to put the socket
  //
  var index = 0;
  while (index < this.devices.length && this.devices[index]) {
    ++index;
  }
  
  log("Device added for $1", this.state.userName);
  this.devices[index] = socket;
  
  //
  // bind the events
  //
  var handlers = {
    onUserState: function (state) {
      this.state.x = state.x;
      this.state.y = state.y;
      this.state.z = state.z;
      this.state.heading = state.heading;
      this.state.isRunning = state.isRunning;
      this.broadcast(users, index, "userState", this.state);
    }.bind(this),
    onChat: User.prototype.chat.bind(this, users),
    onDisconnect: User.prototype.disconnect.bind(this, users, index)
  };
  socket.on("userState", handlers.onUserState);
  socket.on("chat", handlers.onChat);
  socket.on("logout", handlers.onDisconnect);
  socket.on("disconnect", handlers.onDisconnect);
  this.handlers[index] = handlers;
  
  //
  // notify the new client of all of the users currently logged in
  //
  var userList = [];
  for (var key in users) {
    if (users[key].isConnected()) {
      userList.push(users[key].state);
    }
  }
  socket.emit("userList", userList);
  
  if (index === 0) {
    //
    // notify all of the users of a new user
    //
    this.broadcast(users, index, "userJoin", this.state);
  }
  else {
    //
    // notify all of the user's devices that a new device was connected,
    // then update them on the user's current state.
    //
    this.emit(index, "deviceAdded");
    socket.emit("userState", this.state);
  }
};

User.prototype.broadcast = function (users, skipIndex) {
  var args = Array.prototype.slice.call(arguments, 2);
  for (var key in users) {
    var toUser = users[key];
    toUser.emit
            .bind(toUser, (toUser.state.userName === this.state.userName) ? skipIndex : -1)
            .apply(toUser, args);
  }
};

User.prototype.emit = function (skipIndex) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < this.devices.length; ++i) {
    if (i !== skipIndex && this.devices[i]) {
      this.devices[i].emit.apply(this.devices[i], args);
    }
  }
};

User.prototype.isConnected = function () {
  var devicesLeft = 0;
  for (var i = 0; i < this.devices.length; ++i) {
    if (this.devices[i]) {
      ++devicesLeft;
    }
  }
  return devicesLeft > 0;
};

User.prototype.chat = function (users, text) {
  log("[$1]: $2", this.state.userName, text);
  this.broadcast(users, -1, "chat", {
    userName: this.state.userName,
    text: text
  });
};

User.prototype.disconnect = function (users, index) {
  this.devices[index].removeListener("userState", this.handlers[index].onUserState);
  this.devices[index].removeListener("chat", this.handlers[index].onChat);
  this.devices[index].removeListener("logout", this.handlers[index].onDisconnect);
  this.devices[index].removeListener("disconnect", this.handlers[index].onDisconnect);
  this.devices[index] = null;
  this.handlers[index] = null;
  if (this.isConnected()) {
    log("Device #$1 lost for $2.", index, this.state.userName);
    this.emit(index, "deviceLost");
  }
  else {
    log("disconnect = $1.", this.state.userName);
    this.broadcast(users, -1, "userLeft", this.state.userName);
    this.devices.splice(0);
  }
};

module.exports = User;