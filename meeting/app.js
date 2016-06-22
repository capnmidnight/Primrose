"use strict";

var MEETING_ID_PATTERN = /\bid=(\w+)/,
  TEST_USER_NAME_PATTERN = /\bu=(\w+)/,
  USER_NAME_PATTERN = /Primrose:user:(\w+)/,
  idSpec = location.search.match(MEETING_ID_PATTERN),
  hasMeetingID = !!idSpec,
  meetingID = idSpec && idSpec[1] || Primrose.Random.ID(),
  appKey = "Primrose:Meeting:" + meetingID,
  testUserNameSpec = location.search.match(TEST_USER_NAME_PATTERN),
  isTest = !!testUserNameSpec,
  userNameSpec = testUserNameSpec || document.cookie.match(USER_NAME_PATTERN),
  userName = userNameSpec && userNameSpec[1] || "",
  
  ctrls2D = Primrose.DOM.findEverything(),
  loginControls = ["email", "password", "userName", "switchMode", "connect"].map(function(name){
    return ctrls2D[name];
  }),
  env = new Primrose.BrowserEnvironment(appKey, {
    autoScaleQuality: true,
    autoRescaleQuality: false,
    quality: Primrose.Quality.HIGH,
    groundTexture: 0x000000,
    backgroundColor: 0x000000,
    disableDefaultLighting: true,
    sceneModel: "../doc/models/meeting/meetingroom.obj",
    avatarModel: "../doc/models/avatar.json",
    useFog: true,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    audioIcon: "../doc/models/microphone.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  });

if(!hasMeetingID){
  var state = "?id=" + meetingID;
  if(isTest){
    state += "&u=" + userName;
  }
  history.pushState(null, "Room ID: " + meetingID, state);
}

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", authenticate);
ctrls2D.userName.value = userName;

showSignup(userName.length === 0);

ctrls2D.closeButton.addEventListener("click", hideLoginForm, false);

env.addEventListener("ready", environmentReady);
env.addEventListener("update", update);

var micReady = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(setAudioStream.bind(null, ctrls2D.localAudio))
    .catch(console.warn.bind(console, "Can't get audio")),
  users = {},
  socket,
  lastNetworkUpdate = 0,
  oldState = [],
  deviceIndex

function setAudioStream(element, stream){
  if(isFirefox){
    element.srcObject = stream;
  }
  else{
    element.src = URL.createObjectURL(stream);
  }
  element.muted = true;
  return stream;
}

function showSignup(state) {
  if (typeof state !== "boolean") {
    state = ctrls2D.emailRow.style.display === "none";
  }

  ctrls2D.emailRow.style.display = state ? "" : "none";
  ctrls2D.switchMode.innerHTML = state ? "Log in" : "Sign up";
  ctrls2D.switchMode.className = state ? "loginButton" : "signupButton";
  ctrls2D.connect.innerHTML = state ? "Sign up" : "Log in";
  ctrls2D.connect.className = state ? "signupButton" : "loginButton";
}

function hideLoginForm(){
  ctrls2D.loginForm.style.display = "none";
  ctrls2D.controls.style.width = "initial";
  ctrls2D.controls.style.height = "initial";
  ctrls2D.frontBuffer.focus();
}

var listUserPromise = Promise.resolve();
function listUsers(newUsers) {
  ctrls2D.errorMessage.innerHTML = "";
  ctrls2D.errorMessage.style.display = "none";
  disableLogin(false);
  hideLoginForm();

  document.cookie = "Primrose:user:" + userName;

  Object.keys(users).forEach(removeUser);
  while (newUsers.length > 0) {
    addUser(newUsers.shift());
  }
}

function addUser(state) {
  var toUserName = state[0],
  user = new Primrose.RemoteUser(toUserName, env.factories.avatar, env.options.foregroundColor);
  users[toUserName] = user;
  env.scene.add(user.avatar);
  updateUser(state);
  listUserPromise = listUserPromise
    .then(() => user.peer(socket, micReady, userName, env.audio))
    .catch((exp) => console.error("Couldn't load user: " + name));
}

function receiveChat(evt) {
  console.log("chat", evt);
}

function updateUser(state) {
  var key = state[0];
  if (key !== userName) {
    var user = users[key];
    if (user) {
      user.state = state;
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
  var user = users[key];
  if(user){
    user.unpeer();
    env.scene.remove(user.avatar);
    delete users[key];
  }
}

var ERROR_MESSAGES = {
  login: "We couldn't log you in right now because ",
  signup: "We couldn't sign you up right now because "
}

function errorMessage(message){
  if(!ctrls2D.loginForm.style.width){
    ctrls2D.loginForm.style.width = ctrls2D.loginForm.clientWidth + "px";
  }
  ctrls2D.errorMessage.innerHTML = message;
  ctrls2D.errorMessage.style.display = "block";
  disableLogin(false);
}

function authFailed(name) {
  return function (reason) {
    showSignup(name === "signup");
    errorMessage(ERROR_MESSAGES[name] + reason.replace(/\[USER\]/g, ctrls2D.userName.value));
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

function disableLogin(v){
  loginControls.forEach(function(ctrl){
    ctrl.disabled = v;
  });
  document.body.style.cursor = v ? "wait" : "";
}

function authenticate() {
  if (!socket) {
    var protocol = location.protocol.replace("http", "ws"),
      path = protocol + "//" + location.hostname;
    console.log("connecting to: %s", path);
    socket = io.connect(path);
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
    socket.on("errorDetail", console.error.bind(console));
  }

  var verb = ctrls2D.emailRow.style.display === "none" ? "login" : "signup",
    password = ctrls2D.password.value,
    email = ctrls2D.email.value;

  userName = ctrls2D.userName.value.toLocaleUpperCase();
  disableLogin(true);
  if(userName.length === 0){
    errorMessage("You must provide a user name.");
  }
  else if(password.length === 0){
    errorMessage("You must provide a password.");
  }
  else{
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
}

function environmentReady() {
  ctrls2D.loginForm.style.display = "";

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });
}

function update(dt) {
  if (socket && deviceIndex === 0) {
    lastNetworkUpdate += dt;
    if (lastNetworkUpdate >= Primrose.RemoteUser.NETWORK_DT) {
      lastNetworkUpdate -= Primrose.RemoteUser.NETWORK_DT;
      var newState = [
        env.player.heading,
        env.player.position.x,
        env.player.position.y - env.avatarHeight,
        env.player.position.z,
        env.player.qHead.x,
        env.player.qHead.y,
        env.player.qHead.z,
        env.player.qHead.w,
        env.input.VR.getValue("headX"),
        env.input.VR.getValue("headY") + env.avatarHeight,
        env.input.VR.getValue("headZ")
      ];
      for (var i = 0; i < newState.length; ++i) {
        if (oldState[i] !== newState[i]) {
          socket.emit("userState", newState);
          oldState = newState;
          break;
        }
      }
    }
  }
  for (var key in users) {
    var user = users[key];
    user.update(dt);
  }
}