"use strict";

var ctrls = Primrose.DOM.findEverything(),
loginControls = [
ctrls.userName,
ctrls.connect
],
names = NameGen.compile("!mi"),
protocol = location.protocol.replace("http", "ws"),
serverPath = protocol + "//" + location.hostname,
roomPattern = /\broom=(\w+)/,
userPattern = /\buser=(\w+)/,
defaultRoomName = null,
defaultUserName = null,
socket = null,

env = new Primrose.BrowserEnvironment({
  autoScaleQuality: true,
  autoRescaleQuality: false,
  quality: Quality.HIGH,
  groundTexture: 0x000000,
  backgroundColor: 0x000000,
  disableDefaultLighting: true,
  sceneModel: "../doc/models/meeting/meetingroom.obj",
  avatarModel: "../doc/models/avatar.json",
  useFog: false,
  fullScreenIcon: "../doc/models/monitor.obj",
  VRIcon: "../doc/models/cardboard.obj",
  audioIcon: "../doc/models/microphone.obj",
  font: "../doc/fonts/helvetiker_regular.typeface.json",
  webRTC: Primrose.HTTP.getObject("/turn")
});

ctrls.closeButton.addEventListener("click", hideLoginForm, false);
ctrls.userName.addEventListener("keyup", authenticate);
ctrls.connect.addEventListener("click", authenticate);
ctrls.randomRoomName.addEventListener("click", setRoomName);
ctrls.randomUserName.addEventListener("click", setRandomUserName);

window.addEventListener("popstate", setRoomName);
env.addEventListener("ready", environmentReady);

setRoomName();
setRandomUserName();

ctrls.roomName.value = fromField(location.search, roomPattern) || fromField(document.cookie, roomPattern);
ctrls.userName.value = fromField(location.search, userPattern) || fromField(document.cookie, userPattern);

function setRoomName(evt) {
  defaultRoomName = evt && evt.state && evt.state.roomName || names.toString();
  ctrls.roomName.placeholder = "Type a room name (currently " + defaultRoomName + ")";
  ctrls.roomName.value = "";
  if(evt && evt.type !== "popstate"){
    history.pushState({ roomName: defaultRoomName }, "Room ID: " + defaultRoomName, "?room=" + defaultRoomName);
  }
}

function setRandomUserName() {
  defaultUserName = names.toString();
  ctrls.userName.placeholder = "Type a user name (currently " + defaultUserName + ")";
  ctrls.userName.value = "";
}

function getRoomName() {
  return ctrls.roomName.value || defaultRoomName;
}

function getUserName() {
  return ctrls.userName.value || defaultUserName;
}

function fromField(field, pattern) {
  var spec = field.match(pattern);
  return spec && spec[1];
}

function hideLoginForm(evt) {
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
  if (!evt || evt.type !== "keyup" || evt.keyCode === Primrose.Keys.ENTER) {

    disableLogin(true);

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
      userName: getUserName(),
      appKey: getRoomName()
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

  document.cookie = "user=" + getUserName() +
  "\nroom=" + getRoomName();
  env.connect(socket, ctrls.userName.value);
  document.title = getUserName() + " in " + getRoomName();
}