"use strict";

const APP_KEY = "Primrose:Meeting:test";

var idSpec = location.search.match(/id=(\w+)/),
  meetingID = idSpec && idSpec[1] || "public",
  ctrls2D = Primrose.DOM.findEverything(),
  audio = new Primrose.Output.Audio3D(),
  micReady = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(readyAudioDevice)
    .catch(console.warn.bind(console, "Can't get audio")),
  users = {},
  socket,
  userName;


function logAudio(name, stream) {
  console.log(name, stream);
  if (stream) {
    for (var key in stream) {
      if (key.indexOf("on") === 0) {
        stream.addEventListener(key.substring(2), console.log.bind(console, name + "." + key));
      }
    }
  }
}

function readyAudioDevice(device) {
  logAudio("out audio", device);

  var node = audio.context.createMediaStreamSource(device);
  logAudio("out audio node", node);

  var gain = audio.context.createGain();
  logAudio("out audio gain", gain);
  node.connect(gain);

  var stream = audio.context.createMediaStreamDestination();
  logAudio("out audio stream", stream);
  gain.connect(stream);

  return stream.stream;
}

function addUser(state) {
  var key = state[0],
    avatar = {};
  users[key] = avatar;
  console.log("Connecting from %s to %s", userName, key);
  micReady.then((outAudio) => {
    logAudio("out", outAudio);
    avatar.peer = new Primrose.WebRTCSocket(socket, userName, key, outAudio);
    avatar.peer.ready
      .then((inAudio) => {
        logAudio("in audio", inAudio);

        var stream = audio.context.createMediaStreamSource(inAudio);
        logAudio("in audio stream", stream);

        var gain = audio.context.createGain();
        logAudio("in audio gain", gain);
        stream.connect(gain);

        gain.connect(audio.mainVolume);
      })
      .catch(console.error.bind(console, "error"));
  });
}

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", authenticate);
ctrls2D.loginForm.style.display = "";
ctrls2D.closeButton.href = "javascript:ctrls2D.loginForm.style.display = 'none',ctrls2D.controls.style.width = 'initial',undefined";
ctrls2D.userName.value = "sean";
ctrls2D.password.value = "ppyptky7";

showSignup(document.cookie.indexOf(APP_KEY) === -1);

document.cookie = APP_KEY;

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

function listUsers(newUsers) {
  ctrls2D.loginForm.style.display = "none";
  ctrls2D.controls.style.width = "initial";

  Object.keys(users).forEach(removeUser);
  newUsers.forEach(addUser);
}

function receiveChat(evt) {
  console.log("chat", evt);
}

function removeUser(key) {
  delete users[key];
}

function authFailed(name) {
  return function (reason) {
    console.error(name + " failed", reason);
    showSignup(name === "signup");
  }
}

function authenticate() {
  if (!socket) {
    var protocol = location.protocol.replace("http", "ws");
    socket = io.connect(protocol + "//" + location.hostname);
    socket.on("signupFailed", authFailed("signup"));
    socket.on("loginFailed", authFailed("login"));
    socket.on("userList", listUsers);
    socket.on("userJoin", addUser);
    socket.on("chat", receiveChat);
    socket.on("userLeft", removeUser);
    socket.on("logoutComplete", showSignup.bind(null, false));
  }

  var verb = ctrls2D.email.style.display === "none" ? "signup" : "login",
    password = ctrls2D.password.value,
    email = ctrls2D.email.value;

  userName = ctrls2D.userName.value.toLocaleUpperCase();

  socket.once("salt", function (salt) {
    var hash = new Hashes.SHA256().hex(salt + password)
    socket.emit("hash", hash);
  });
  socket.emit(verb, {
    userName: userName,
    email: email,
    app: "Meeting:test"
  });
}

ctrls2D.frontBuffer.style.cursor = "default";