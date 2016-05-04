var fs = require("fs"),
  crypto = require("crypto"),
  User = require("./User"),
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
      console.error(exp);
      log("User file corrupted.");
    }
  }
});

function saveUserList() {
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

function getUser(key) {
  return users[key];
}

function newUser(identity, key, salt, hash) {
  if (!users[key]) {
    log("[$1, $2] > new user", key, identity.userName);
    identity.salt = salt;
    identity.hash = hash;
    users[key] = new User(identity);
  }
  return users[key];
}

function makeNewSalt() {
  var bytes = crypto.randomBytes(256);
  var salt = "";
  for (var i = 0; i < bytes.length; ++i) {
    salt += bytes[i].toString(16);
  }
  return salt;
}

function forEachUser(thunk) {
  for (var key in users) {
    thunk(key, getUser(key));
  }
}

module.exports = {
  get: getUser,
  forEach: forEachUser,
  newUser: newUser,
  newSalt: makeNewSalt,
  save: saveUserList
};