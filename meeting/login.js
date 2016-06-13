"use strict";

var MEETING_ID_PATTERN = /\bid=(\w+)/,
  USER_NAME_PATTERN = /Primrose:Meeting:\w+:(\w+)/,
  idSpec = location.search.match(MEETING_ID_PATTERN),
  meetingID = idSpec && idSpec[1] || "public",
  appKey = "Primrose:Meeting:" + meetingID,
  ctrls2D = Primrose.DOM.findEverything(),
  audio = new Primrose.Output.Audio3D(),
  micReady = navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(readyAudioOutputStream)
    .catch(console.warn.bind(console, "Can't get audio")),
  userNameSpec = document.cookie.match(USER_NAME_PATTERN),
  userName = userNameSpec && userNameSpec[1] || "",
  users = {},
  socket;

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", authenticate);
ctrls2D.loginForm.style.display = "";
ctrls2D.closeButton.href = "javascript:ctrls2D.loginForm.style.display = 'none',ctrls2D.controls.style.width = 'initial',undefined";
ctrls2D.userName.value = userName;
ctrls2D.password.value = "ppyptky7";
ctrls2D.frontBuffer.style.cursor = "default";

showSignup(userName.length === 0);

function readyAudioOutputStream(device){
  var node = audio.context.createMediaStreamSource(device);
  var gain = audio.context.createGain();
  var stream = audio.context.createMediaStreamDestination();

  node.connect(gain);
  gain.connect(stream);

  return stream.stream;
}

function readyAudioInputStream(inAudio) {
  var element = new Audio();
  if (isFirefox) {
    element.srcObject = inAudio;
  }
  else {
    element.src = URL.createObjectURL(inAudio);
  }

  element.controls = false;
  element.autoplay = true;
  element.crossOrigin = "anonymous";
  document.body.appendChild(element);
}

function addUser(state) {
  var key = state[0],
    avatar = {};
  users[key] = avatar;
  console.log("Connecting from %s to %s", userName, key); 
  micReady.then((outAudio) => {
    avatar.peer = new Primrose.WebRTCSocket(socket, userName, key, outAudio);
    avatar.peer.ready
      .then(readyAudioInputStream)
      .catch(console.error.bind(console, "error"));
  });
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

function listUsers(newUsers) {
  ctrls2D.loginForm.style.display = "none";
  ctrls2D.controls.style.width = "initial";

  document.cookie = appKey + ":" + userName;

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
    app: appKey.replace("Primrose:", "")
  });
}