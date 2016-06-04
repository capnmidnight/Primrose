var idSpec = location.search.match(/id=(\w+)/),
  meetingID = idSpec && idSpec[1] || "public",
  env = new Primrose.BrowserEnvironment("Meeting:" + meetingID, {
    skyTexture: 0x000000,
    backgroundColor: 0x000000,
    disableDefaultLighting: true,
    sceneModel: "../doc/models/meeting/meetingroom.obj",
    useFog: true,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  }),
  login = new Primrose.X.LoginForm(),
  signup = new Primrose.X.SignupForm(),
  socket;

function showSignup(state) {
  signup[state ? "show" : "hide"]();
  login[state ? "hide" : "show"]();
}

login.addEventListener("signup", showSignup.bind(null, true), false);
signup.addEventListener("login", showSignup.bind(null, false), false);
showSignup(true);
signup.userName.value = login.userName.value = "sean";
signup.password.value = login.password.value = "ppyptky7";
signup.email.value = "sean.mcbeth@gmail.com";

function listUsers(users) {
  signup.hide();
  login.hide();
}

var SHA256 = new Hashes.SHA256();

function attemptSignup() {
  socket.once("salt", function (salt) {
    var hash = SHA256.hex(salt + login.password.value)
    socket.emit("hash", hash);
  });
  socket.emit("signup", {
    userName: signup.userName.value,
    email: signup.email.value,
    app: env.id
  });
}

signup.addEventListener("signup", function () {
  if (signup.userName.value && signup.password.value) {
    if (!socket) {
      socket = io.connect("ws://" + location.hostname);
      socket.on("signupFailed", function (reason) {
        console.error("signup failed", reason);
        showSignup(false);
      });
      socket.on("userList", listUsers);
      socket.once("handshakeComplete", attemptSignup);
      socket.emit("handshake", "login");
    }
    else {
      attemptSignup();
    }
  }
}, false);

function attemptLogin() {
  socket.once("salt", function (salt) {
    var hash = SHA256.hex(salt + login.password.value)
    socket.emit("hash", hash);
  });
  socket.emit("login", {
    userName: login.userName.value
  });
}

login.addEventListener("login", function () {
  if (login.userName.value && login.password.value) {
    if (!socket) {
      socket = io.connect("ws://" + location.hostname);
      socket.on("loginFailed", function (reason) {
        console.error("login failed", reason);
        showSignup(true);
      });
      socket.on("userList", listUsers);
      socket.once("handshakeComplete", attemptLogin);
      socket.emit("handshake", "login");
    }
    else {
      attemptLogin();
    }
  }
}, false);

login.addEventListener("logout", function () {

}, false);

env.addEventListener("ready", function () {
  login.mesh.position.set(-1, env.avatarHeight, -1.5);
  signup.mesh.position.set(-1, env.avatarHeight, -1.5);
  env.appendChild(login);
  env.appendChild(signup);

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("Chair") === 0) {
      env.registerPickableObject(obj);
    }
    else if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });
});

env.addEventListener("gazecomplete", function (evt) {

});

env.addEventListener("pointerend", function (evt) {

});

env.addEventListener("update", function (dt) {

});