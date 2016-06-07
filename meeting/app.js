var idSpec = location.search.match(/id=(\w+)/),
  meetingID = idSpec && idSpec[1] || "public",
  NETWORK_DT = 0.25,
  env = new Primrose.BrowserEnvironment("Meeting:" + meetingID, {
    autoScaleQuality: false,
    autoRescaleQuality: false,
    quality: Primrose.Quality.HIGH,
    skyTexture: 0x000000,
    backgroundColor: 0x000000,
    disableDefaultLighting: true,
    sceneModel: "../doc/models/meeting/meetingroom.obj",
    useFog: true,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  }),
  loggedIn = false,
  login = new Primrose.X.LoginForm(),
  signup = new Primrose.X.SignupForm(),
  socket,
  avatarFactory,
  users = {};

signup.userName.value = login.userName.value = "sean";
signup.password.value = login.password.value = "ppyptky7";
signup.email.value = "sean.mcbeth@gmail.com";

function showSignup(state) {
  signup[state ? "show" : "hide"]();
  login[state ? "hide" : "show"]();
}

login.addEventListener("signup", showSignup.bind(null, true), false);
signup.addEventListener("login", showSignup.bind(null, false), false);
showSignup(true);

function listUsers(newUsers) {
  signup.hide();
  login.hide();
  loggedIn = true;

  Object.keys(users).forEach(removeUser);
  newUsers.forEach(addUser);
}

function addUser(state) {
  var key = state[0],
    avatar = avatarFactory.clone();
  avatar.name = key;
  avatar.velocity = new THREE.Vector3();
  avatar.target = new THREE.Vector3();
  avatar.time = 0;
  env.scene.add(avatar);
  users[key] = avatar;
  updateUser(state);
}

function receiveChat(evt) {
  console.log("chat", evt);
}

function updateUser(state) {
  var key = state[0],
    avatar = users[key];
  if (!avatar) {
    addUser(state);
  }
  else {
    var name = textured(text3D(0.1, key), env.options.foregroundColor),
      bounds = name.geometry.boundingBox.max;

    name.rotation.set(0, Math.PI, 0);
    name.position.set(bounds.x / 2, env.avatarHeight + bounds.y, 0);
    avatar.add(name);
    avatar.rotation.set(0, state[1], 0);
    avatar.target.set(state[5], state[6], state[7]);
    avatar.target.multiplyScalar(NETWORK_DT);
    avatar.target.x += state[2];
    avatar.target.y += state[3];
    avatar.target.z += state[4];
    avatar.target.sub(avatar.position);
    avatar.target.multiplyScalar(1 / NETWORK_DT);
    avatar.velocity.copy(avatar.target);
    avatar.time = 0;
    /*  env.player.qHead.x,
      env.player.qHead.y,
      env.player.qHead.z,
      env.player.qHead.w */
  }
}

function removeUser(key) {
  env.scene.remove(users[key]);
  delete users[key];
}

function authFailed(name) {
  return function (reason) {
    console.error(name + " failed", reason);
    showSignup(name === "signup");
  }
}

function lostConnection() {
  loggedIn = false;
}

function makeConnection() {
  if (socket) {
    authenticate();
  }
  else {
    var protocol = location.protocol.replace("http", "ws");
    socket = io.connect(protocol + "//" + location.hostname);
    socket.on("connect", socket.emit.bind(socket, "handshake", "login"));
    socket.on("handshakeComplete", authenticate);
    socket.on("signupFailed", authFailed("signup"));
    socket.on("loginFailed", authFailed("login"));
    socket.on("userList", listUsers);
    socket.on("userJoin", addUser);
    socket.on("chat", receiveChat);
    socket.on("userState", updateUser);
    socket.on("userLeft", removeUser);
    socket.on("logoutComplete", showSignup.bind(null, false));
    socket.on("connection_lost", lostConnection);
  }
}

function authenticate() {
  var form = signup.visible ? signup : login,
    verb = signup.visible ? "signup" : "login",
    userName = form.userName.value,
    password = form.password.value,
    email = form.email && form.email.value;

  socket.once("salt", function (salt) {
    var hash = new Hashes.SHA256().hex(salt + password)
    socket.emit("hash", hash);
  });
  socket.emit(verb, {
    userName: userName,
    email: email,
    app: env.id
  });
}

signup.addEventListener("signup", makeConnection, false);
login.addEventListener("login", makeConnection, false);


env.addEventListener("ready", function () {
  login.position.set(0, env.avatarHeight, -0.5);
  signup.position.set(0, env.avatarHeight, -0.5);
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

  Primrose.ModelLoader.loadModel("../doc/models/avatar.obj").then(function (avatarModel) {
    avatarFactory = avatarModel;
  });
});

var lastNetworkUpdate = 0,
  state = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
env.addEventListener("update", function (dt) {
  if (socket && loggedIn) {
    lastNetworkUpdate += dt;
    if (lastNetworkUpdate >= NETWORK_DT) {
      lastNetworkUpdate -= NETWORK_DT;
      var newState = [
        env.player.heading,
        env.player.position.x,
        env.player.position.y - env.avatarHeight,
        env.player.position.z,
        env.player.velocity.x,
        env.player.velocity.y,
        env.player.velocity.z,
        env.player.qHead.x,
        env.player.qHead.y,
        env.player.qHead.z,
        env.player.qHead.w
      ];
      for (var i = 0; i < newState.length; ++i) {
        if (state[i] !== newState[i]) {
          socket.emit("userState", newState);
          state = newState;
          break;
        }
      }
    }
  }
  for (var key in users) {
    var avatar = users[key];
    avatar.time += dt;
    if (avatar.time >= NETWORK_DT) {
      avatar.velocity.multiplyScalar(0.5);
    }
    avatar.position.add(avatar.velocity.clone().multiplyScalar(dt));
  }
});