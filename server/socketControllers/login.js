var log = require("../core").log,
  users = require("../data/users");

module.exports = {
  handshake: "login",
  bindSocket: function (socket) {
    function receiveHash(identity, key, salt, hash) {
      var user = users.get(key) || users.newUser(identity, key, salt, hash);

      if (hash === user.hash) {
        if (!user.isConnected()) {
          log("[$1] > user login", key);
        }
        user.email = identity.email || user.email;
        user.state.app = identity.app;
        user.addDevice(socket, users);
        users.save();
      }
      else {
        log("[$1] > failed to authenticate", key);
        socket.emit("loginFailed");
      }
    }

    socket.on("login", function (identity) {
      var key = identity
        && identity.userName
        && identity.userName.toLocaleUpperCase().trim();
      if (!key) {
        log("Login request didn't have a user name.", identity);
        socket.emit("loginFailed");
      }
      else {
        log("Trying to authenticate $1", key);
        var user = users.get(key);
        if (!user) {
          socket.emit("loginFailed");
        }
        else {
          socket.once("hash", receiveHash.bind(this, identity, key, user.salt));
          socket.emit("salt", salt);
        }
      }
    });

    socket.on("signup", function (identity) {
      var key = identity
        && identity.userName
        && identity.userName.toLocaleUpperCase().trim();
      if (!key) {
        log("Login request didn't have a user name: $1", identity);
        socket.emit("signupFailed");
      }
      else {
        log("Trying to signup: $1", key);
        var user = users.get(key);
        if (user) {
          log("User already exists: $1", key);
          socket.emit("signupFailed");
        }
        else {
          salt = users.newSalt();
          socket.once("hash", receiveHash.bind(this, identity, key, salt));
          socket.emit("salt", salt);
        }
      }
    });
  }
};
