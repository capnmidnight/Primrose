"use strict";

var ctrls = Primrose.DOM.findEverything(),
  loginControls = [
    ctrls.userName,
    ctrls.connect
  ],
  names = NameGen.compile("!mi"),
  protocol = location.protocol.replace("http", "ws"),
  serverPath = protocol + "//" + location.hostname,
  socket = null,
  meetingID = null,

  env = new Primrose.BrowserEnvironment({
    autoScaleQuality: true,
    autoRescaleQuality: false,
    quality: Primrose.Quality.HIGH,
    groundTexture: 0x000000,
    backgroundColor: 0x000000,
    disableDefaultLighting: true,
    sceneModel: "../doc/models/meeting/meetingroom.obj",
    avatarModel: "../doc/models/avatar.json",
    useFog: false,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    audioIcon: "../doc/models/microphone.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  });

ctrls.closeButton.addEventListener("click", hideLoginForm, false);
ctrls.userName.addEventListener("keyup", authenticate);
ctrls.connect.addEventListener("click", authenticate);

env.addEventListener("ready", environmentReady);


ctrls.userName.value = fromField(location.search, /\buser=(\w+)/) || fromField(document.cookie, /\buser=(\w+)/);

function fromField(field, pattern) {
  var spec = field.match(pattern);
  return spec && spec[1];
}

function hideLoginForm() {
  ctrls.loginForm.style.display = "none";
  ctrls.frontBuffer.focus();
}

function showLoginForm() {
  ctrls.loginForm.style.display = "";
  ctrls.userName.focus();
}

function errorMessage(message) {
  ctrls.errorMessage.innerHTML = message;
  ctrls.errorMessage.style.display = "block";
  showLoginForm();
  disableLogin(false);
}

function disableLogin(v) {
  loginControls.forEach(function (ctrl) {
    ctrl.disabled = v;
  });
  document.body.style.cursor = v ? "wait" : "";
}

function environmentReady() {
  ctrls.loginForm.style.display = "";

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });
}

function authenticate(evt) {
  if (!evt || evt.type !== "keyup" || evt.keyCode === 13) {

    disableLogin(true);

    meetingID = fromField(location.search, /\broom=(\w+)/);
    if(!meetingID){
      meetingID =  Primrose.Random.ID();
      var state = "?room=" + meetingID;
      history.pushState(null, "Room ID: " + meetingID, state);
    }

    if(ctrls.userName.value.length === 0){
      ctrls.userName.value = names.toString();
    }

    if (!socket) {
      console.log("connecting to: %s", serverPath);
      socket = io(serverPath);
      socket.on("connect_error", connectionError);
      socket.on("reconnect", authenticate);
      socket.on("loginFailed", authFailed);
      socket.on("loginComplete", authSucceeded);
      socket.on("errorDetail", console.error.bind(console));
    }

    socket.emit("guest", {
      userName: ctrls.userName.value,
      appKey: meetingID
    });
  }
}

function connectionError(evt) {
  socket.close();
  socket = null;
  env.disconnect();
  authFailed("an error occured while connecting to the server.");
}

function authFailed(reason) {
  errorMessage("We couldn't log you in right now because " + reason.replace(/\[USER\]/g, ctrls.userName.value));
}

function authSucceeded() {
  ctrls.errorMessage.innerHTML = "";
  ctrls.errorMessage.style.display = "none";
  disableLogin(false);
  hideLoginForm();

  document.cookie = "user=" + ctrls.userName.value;
  env.connect(socket, ctrls.userName.value);
}