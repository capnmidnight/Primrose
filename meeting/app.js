"use strict";

var MEETING_ID_PATTERN = /\bid=(\w+)/,
  USER_NAME_PATTERN = /Primrose:user:(\w+)/,
  NETWORK_DT = 0.25,
  idSpec = location.hash.match(MEETING_ID_PATTERN),
  meetingID = idSpec && idSpec[1] || (Math.random() * Math.log(Number.MAX_VALUE)).toString(36).replace(".", ""),
  appKey = "Primrose:Meeting:" + meetingID,
  audio = new Primrose.Output.Audio3D(),
  lastNetworkUpdate = 0,
  state = [0, 0, 0, 0, 0, 0, 0, 1],
  ctrls2D = Primrose.DOM.findEverything(),
  ctrls3D = {
    login: new Primrose.X.LoginForm(),
    signup: new Primrose.X.SignupForm()
  },
  env = new Primrose.BrowserEnvironment(appKey, {
    autoScaleQuality: false,
    autoRescaleQuality: false,
    quality: Primrose.Quality.HIGH,
    groundTexture: 0x000000,
    backgroundColor: 0x000000,
    disableDefaultLighting: true,
    sceneModel: "../doc/models/meeting/meetingroom.obj",
    useFog: true,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    audioIcon: "../doc/models/microphone.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  }),
  micReady = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .catch(console.warn.bind(console, "Can't get audio")),
  users = {},
  socket,
  avatarFactory,
  userNameSpec = document.cookie.match(USER_NAME_PATTERN),
  userName = userNameSpec && userNameSpec[1] || "",
  deviceIndex;

location.hash = "id=" + meetingID;

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", setLoginValues.bind(null, ctrls2D, ctrls3D.signup, ctrls3D.login));
ctrls2D.loginForm.style.display = "";
ctrls2D.userName.value = userName;
ctrls2D.closeButton.href = "javascript:ctrls2D.loginForm.style.display = 'none',ctrls2D.controls.style.width = 'initial',undefined";

ctrls3D.login.position.set(0, env.avatarHeight, -0.5);
ctrls3D.signup.position.set(0, env.avatarHeight, -0.5);

showSignup(userName.length === 0);

setTimeout(function () {
  ctrls3D.signup.userName.value = ctrls3D.login.userName.value = ctrls2D.userName.value;
  ctrls3D.signup.password.value = ctrls3D.login.password.value = ctrls2D.password.value;
  ctrls3D.signup.email.value = ctrls2D.email.value;
}, 250);

ctrls3D.login.addEventListener("signup", showSignup.bind(null, true), false);
ctrls3D.signup.addEventListener("login", showSignup.bind(null, false), false);
ctrls3D.signup.addEventListener("signup", setLoginValues.bind(null, ctrls3D.signup, ctrls3D.login, ctrls2D), false);
ctrls3D.login.addEventListener("login", setLoginValues.bind(null, ctrls3D.login, ctrls3D.signup, ctrls2D), false);

env.addEventListener("ready", environmentReady);
env.addEventListener("update", update);

function showSignup(state) {
  if (typeof state !== "boolean") {
    state = ctrls2D.emailRow.style.display === "none";
  }

  ctrls2D.emailRow.style.display = state ? "" : "none";
  ctrls2D.switchMode.innerHTML = state ? "Log in" : "Sign up";
  ctrls2D.switchMode.className = state ? "loginButton" : "signupButton";
  ctrls2D.connect.innerHTML = state ? "Sign up" : "Log in";
  ctrls2D.connect.className = state ? "signupButton" : "loginButton";

  ctrls3D.signup.style.display = state ? "" : "none";
  ctrls3D.login.style.display = state ? "none" : "";

  if (state) {
    ctrls3D.signup.userName.value = ctrls3D.login.userName.value;
    ctrls3D.signup.password.value = ctrls3D.login.password.value;
  }
}

function listUsers(newUsers) {
  ctrls3D.signup.style.display
    = ctrls3D.login.style.display
    = ctrls2D.loginForm.style.display
    = "none";
  ctrls2D.controls.style.width = "initial";
  ctrls2D.controls.style.height = "initial";

  document.cookie = "Primrose:user:" + userName;

  Object.keys(users).forEach(removeUser);
  var promise = Promise.resolve();
  while (newUsers.length > 0) {
    promise = promise.then(addUser(newUsers.shift()));
  }
}

function logAudio(name, stream) {
  if (stream) {
    for (var key in stream) {
      if (key.indexOf("on") === 0) {
        stream.addEventListener(key.substring(2), console.log.bind(console, name + "." + key));
      }
    }
  }
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
  console.log("Connecting from %s to %s", userName, key);
  return micReady.then(function (outAudio) {
    avatar.peer = new Primrose.WebRTCSocket(socket, userName, key, outAudio);
    avatar.peer.ready
      .then(function (inAudio) {
        avatar.audioElement = new Audio();
        if (isFirefox) {
          avatar.audioElement.srcObject = inAudio;
        }
        else {
          avatar.audioElement.src = URL.createObjectURL(inAudio);
        }

        avatar.audioElement.controls = false;
        avatar.audioElement.autoplay = true;
        avatar.audioElement.crossOrigin = "anonymous";
        document.body.appendChild(avatar.audioElement);
      })
      .catch(console.error.bind(console, "error"));
  });
}

function receiveChat(evt) {
  console.log("chat", evt);
}

function updateUser(state) {
  var key = state[0];
  if (key !== userName) {
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
    else {
      console.error("Unknown user", key);
    }
  }
  else if (deviceIndex > 0) {
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
  console.log("User %s logging off.", key);
  var avatar = users[key];
  env.scene.remove(avatar);
  if (avatar.peer) {
    avatar.peer.close();
    if (avatar.audioElement) {
      avatar.audioElement.pause();
      document.body.removeChild(avatar.audioElement);
    }
  }
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

function addDevice(index) {
  console.log("addDevice", arguments);
}

function setDeviceIndex(index) {
  deviceIndex = index;
}

function setLoginValues(formA, formB, formC) {
  formB.userName.value = formC.userName.value = formA.userName.value;
  formB.password.value = formC.password.value = formA.password.value;
  if (formA.email) {
    if (formB.email) {
      formB.email.value = formA.email.value;
    }
    if (formC.email) {
      formC.email.value = formA.email.value;
    }
  }

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
  var verb = ctrls3D.signup.style.display === "none" ? "login" : "signup",
    password = ctrls3D.signup.password.value,
    email = ctrls3D.signup.email.value;

  userName = ctrls3D.signup.userName.value.toLocaleUpperCase();

  socket.once("salt", function (salt) {
    var hash = new Hashes.SHA256().hex(salt + password)
    socket.emit("hash", hash);
  });
  socket.emit(verb, {
    userName: userName,
    email: email,
    app: appKey
  });
}

function environmentReady() {
  env.appendChild(ctrls3D.login);
  env.appendChild(ctrls3D.signup);

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });

  Primrose.ModelLoader.loadModel("../doc/models/avatar.json")
    .then(function (avatarModel) {
      avatarFactory = avatarModel;
    });
}

function update(dt) {
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
}