var fs = require("fs"),
    User = require("../game/User"),
    log = require("../core").log,

    users = {};

fs.readFile("users.json", "utf8", function (err, file) {
  if (err) {
    log("No users file");
  }
  else {
    log("Reading users from disk.");
    var userList = null;
    try {
      userList = JSON.parse(file);
      log("Users found");
    }
        catch (exp) {
      log("User file corrupted");
    }
    if (userList !== null) {
      var anyHadPassword = false;
      for (var i = 0; i < userList.length; ++i) {
        anyHadPassword = anyHadPassword || !!userList[i].password;
        users[userList[i].userName.toLocaleUpperCase()] = new User(userList[i]);
      }
      if (anyHadPassword) {
        writeUserList();
      }
    }
  }
});

function writeUserList() {
  var userList = [];
  for (var key in users) {
    var user = users[key];
    userList.push({
      userName: user.state.userName,
      salt: user.salt,
      hash: user.hash,
      email: user.email
    });
  }
  
  // synchronous so two new users at the same time can't get into
  // a race condition, right?
  fs.writeFileSync("users.json", JSON.stringify(userList));
}

module.exports = {
  handshake: "demo",
  bindSocket: function (socket) {
    log("starting demo for new user.");
    
    function receiveHash(identity, key, salt, hash) {
      if (!users[key]) {
        log("[$1, $2] > new user", key, identity.userName);
        identity.salt = salt;
        identity.hash = hash;
        users[key] = new User(identity);
        writeUserList();
      }
      
      if (hash === users[key].hash) {
        if (!users[key].isConnected()) {
          log("[$1] > user login", key);
        }
        users[key].email = identity.email || users[key].email;
        users[key].addDevice(users, socket);
      }
      else {
        log("[$1] > failed to authenticate", key);
        socket.emit("loginFailed");
      }
    }
    
    function login(identity) {
      var key = identity 
                && identity.userName 
                && identity.userName.toLocaleUpperCase().trim();
      log("Trying to authenticate $1", key);
      if (!key) {
        socket.emit("loginFailed");
      }
      else {
        var salt = users[key] && users[key].salt || User.makeNewSalt();
        socket.once("hash", receiveHash.bind(this, identity, key, salt));
        socket.emit("salt", salt);
      }
    }
    socket.on("login", login);
  }
};
