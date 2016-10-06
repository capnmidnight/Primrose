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
  font: "../doc/fonts/helvetiker_regular.typeface.json",
  webRTC: Primrose.HTTP.getObject("/turn")
});

ctrls.closeButton.addEventListener("click", hideLoginForm, false);
ctrls.userName.addEventListener("keyup", authenticate, false);
ctrls.connect.addEventListener("click", authenticate, false);
ctrls.randomRoomName.addEventListener("click", setRoomName, false);
ctrls.randomUserName.addEventListener("click", setUserName, false);
ctrls.roomName.addEventListener("change", setRoomName, false);
ctrls.userName.addEventListener("change", setUserName, false);

window.addEventListener("popstate", setRoomName);
env.addEventListener("ready", environmentReady);

setRoomName({ state: {
  roomName: fromField(location.search, roomPattern) || fromField(document.cookie, roomPattern)
}});

setUserName({ state: {
  userName: fromField(location.search, userPattern) || fromField(document.cookie, userPattern)
}});

function setRoomName(evt) {
  defaultRoomName = evt && evt.state && evt.state.roomName;
  if(defaultRoomName){
    evt = evt || true;
    ctrls.roomName.value = defaultRoomName;
  }
  else if(evt.type === "change"){
    defaultRoomName = ctrls.roomName.value;
  }
  else {
    defaultRoomName = names.toString();
    ctrls.roomName.placeholder = "Type a room name (currently " + defaultRoomName + ")";
    ctrls.roomName.value = "";
  }
  if(evt && evt.type !== "popstate"){
    history.pushState({ roomName: defaultRoomName }, "Room ID: " + defaultRoomName, "?room=" + defaultRoomName);
  }
}

function setUserName(evt) {
  defaultUserName = evt && evt.state && evt.state.userName;
  if(defaultUserName){
    ctrls.userName.value = defaultUserName;
  }
  else if(evt.type === "change"){
    defaultUserName = ctrls.userName.value;
  }
  else{
    defaultUserName = names.toString();
    ctrls.userName.placeholder = "Type a user name (currently " + defaultUserName + ")";
    ctrls.userName.value = "";
  }
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
  const userName = getUserName(),
    roomName = getRoomName();
  document.cookie = "user=" + userName + "&room=" + roomName;
  env.connect(socket, userName);
  document.title = userName + " in " + roomName;
}