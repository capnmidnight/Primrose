var idSpec = location.search.match(/id=(\w+)/),
  meetingID = idSpec && idSpec[1] || "public",
  NETWORK_DT = 0.25,
  env = new Primrose.BrowserEnvironment("Meeting:" + meetingID, {
    autoScaleQuality: false,
    autoRescaleQuality: false,
    quality: Primrose.Quality.HIGH,
    groundTexture: 0x000000,
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
  users = {},
  socket,
  avatarFactory,
  userName,
  deviceIndex;

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

  Object.keys(users).forEach(removeUser);
  newUsers.forEach(addUser);
}

function addUser(state) {
  var key = state[0],
    avatar = avatarFactory.clone();
  avatar.name = key;
  avatar.velocity = new THREE.Vector3();
  avatar.time = 0;
  avatar.traverse(function (obj) {
    if (obj.name === "AvatarBelt") {
      textured(obj, Primrose.Random.color());
    }
    else if (obj.name === "AvatarHead") {
      avatar.head = obj;
    }
  });
  avatar.head.dQuaternion = new THREE.Quaternion();
  avatar.dHeading = 0;
  env.scene.add(avatar);
  users[key] = avatar;
  updateUser(state);
}

function receiveChat(evt) {
  console.log("chat", evt);
}

function updateUser(state) {
  var key = state[0];
  if(key !== userName){
    var avatar = users[key];
    if (avatar) {
      avatar.time = 0;

      var name = textured(text3D(0.1, key), env.options.foregroundColor),
        bounds = name.geometry.boundingBox.max;
      name.rotation.set(0, Math.PI, 0);
      name.position.set(bounds.x / 2, env.avatarHeight + bounds.y, 0);
      avatar.add(name);
      
      avatar.dHeading = (state[1] - avatar.rotation.y) / NETWORK_DT;

      avatar.velocity.set(state[2], state[3], state[4]);
      avatar.velocity.sub(avatar.position);
      avatar.velocity.multiplyScalar(1 / NETWORK_DT);
      
      avatar.head.dQuaternion.set(state[7], state[5], state[6], state[8]);
      avatar.head.dQuaternion.x -= avatar.head.quaternion.x;
      avatar.head.dQuaternion.y -= avatar.head.quaternion.y;
      avatar.head.dQuaternion.z -= avatar.head.quaternion.z;
      avatar.head.dQuaternion.w -= avatar.head.quaternion.w;
      avatar.head.dQuaternion.x /= NETWORK_DT;
      avatar.head.dQuaternion.y /= NETWORK_DT;
      avatar.head.dQuaternion.z /= NETWORK_DT;
      avatar.head.dQuaternion.w /= NETWORK_DT;
    }
    else{
      console.error("Unknown user", key);
    }
  }
  else if(deviceIndex > 0){
    env.player.heading = state[1];
    env.player.position.x = state[2];
    env.player.position.y = state[3] + env.avatarHeight;
    env.player.position.z = state[4];
    env.player.qHead.x = state[5];
    env.player.qHead.y = state[6];
    env.player.qHead.z = state[7];
    env.player.qHead.w = state[8];
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
  deviceIndex = null;
}

function addDevice(index){
  console.log("addDevice", arguments);
  //socket.emit("peer", index);
}

function setDeviceIndex(index){
  deviceIndex = index;
}

function makeConnection() {
  if (!socket) {
    var protocol = location.protocol.replace("http", "ws");
    socket = io.connect(protocol + "//" + location.hostname); 
    socket.on("signupFailed", authFailed("signup"));
    socket.on("loginFailed", authFailed("login"));
    socket.on("userList", listUsers);
    socket.on("userJoin", addUser);
    socket.on("deviceAdded", addDevice);
    socket.on("deviceIndex", setDeviceIndex);
    socket.on("chat", receiveChat);
    socket.on("userState", updateUser);
    socket.on("userLeft", removeUser);
    socket.on("logoutComplete", showSignup.bind(null, false));
    socket.on("connection_lost", lostConnection);
  }

  authenticate();
}

function authenticate() {
  var form = signup.visible ? signup : login,
    verb = signup.visible ? "signup" : "login",
    password = form.password.value,
    email = form.email && form.email.value;

  userName = form.userName.value.toLocaleUpperCase();

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
    if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });

  Primrose.ModelLoader.loadModel("../doc/models/avatar.json")
    .then(function (avatarModel) {
      avatarFactory = avatarModel;
    });
});

var lastNetworkUpdate = 0,
  state = [0, 0, 0, 0, 0, 0, 0, 1];
env.addEventListener("update", function (dt) {
  if (socket && deviceIndex === 0) {
    lastNetworkUpdate += dt;
    if (lastNetworkUpdate >= NETWORK_DT) {
      lastNetworkUpdate -= NETWORK_DT;
      var newState = [
        env.player.heading,
        env.player.position.x,
        env.player.position.y - env.avatarHeight,
        env.player.position.z,
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
      avatar.dHeading *= 0.5;
      avatar.head.dQuaternion.x *= 0.5;
      avatar.head.dQuaternion.y *= 0.5;
      avatar.head.dQuaternion.z *= 0.5;
      avatar.head.dQuaternion.w *= 0.5;
    }
    avatar.position.add(avatar.velocity.clone().multiplyScalar(dt));
    avatar.rotation.y += avatar.dHeading * dt;
    avatar.head.quaternion.x += avatar.head.dQuaternion.x * dt;
    avatar.head.quaternion.y += avatar.head.dQuaternion.y * dt;
    avatar.head.quaternion.z += avatar.head.dQuaternion.z * dt;
    avatar.head.quaternion.w += avatar.head.dQuaternion.w * dt;
  }
});