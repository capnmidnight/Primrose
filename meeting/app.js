"use strict";

var ERROR_MESSAGES = {
    login: "We couldn't log you in right now because ",
    signup: "We couldn't sign you up right now because "
  },
  MEETING_ID_PATTERN = /\bid=(\w+)/,
  idSpec = location.search.match(MEETING_ID_PATTERN),
  hasMeetingID = !!idSpec,
  meetingID = idSpec && idSpec[1] || Primrose.Random.ID(),
  appKey = "Primrose:Meeting:" + meetingID,
  protocol = location.protocol.replace("http", "ws"),
  serverPath = protocol + "//" + location.hostname,
  socket = null,


  ////////////////////////////////////////////////////////////////////////
  ///////     setting up test user accounts    ///////////////////////////
  ////////////////////////////////////////////////////////////////////////
  TEST_USER_NAME_PATTERN = /\bu=(\w+)/,
  USER_NAME_PATTERN = /Primrose:user:(\w+)/,
  testUserNameSpec = location.search.match(TEST_USER_NAME_PATTERN),
  hasTestUser = !!testUserNameSpec,
  userNameSpec = testUserNameSpec || document.cookie.match(USER_NAME_PATTERN),
  userName = userNameSpec && userNameSpec[1] || "",

  TEST_PASSWORD_PATTERN = /\bp=(\w+)/,
  testPasswordSpec = location.search.match(TEST_PASSWORD_PATTERN),
  hasTestPassword = !!testPasswordSpec,
  testPassword = testPasswordSpec && testPasswordSpec[1] || null,
  ////////////////////////////////////////////////////////////////////////
  ///////     end setting up test user accounts    ///////////////////////
  ////////////////////////////////////////////////////////////////////////


  ctrls2D = Primrose.DOM.findEverything(),
  loginControls = ["email", "password", "userName", "switchMode", "connect"].map(function (name) {
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
    useFog: false,
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    audioIcon: "../doc/models/microphone.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  });

if (!hasMeetingID) {
  var state = "?id=" + meetingID;
  if (hasTestUser) {
    state += "&u=" + userName;
    if(hasTestPassword) {
      state += "&p=" + testPassword;
    }
  }
  history.pushState(null, "Room ID: " + meetingID, state);
}

ctrls2D.userName.value = userName;
ctrls2D.password.value = testPassword;

showSignup(userName.length === 0);

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", authenticate);
ctrls2D.userName.addEventListener("keyup", authenticate);
ctrls2D.password.addEventListener("keyup", authenticate);
ctrls2D.closeButton.addEventListener("click", hideLoginForm, false);


env.addEventListener("ready", environmentReady);


function showSignup(state) {
  if (typeof state !== "boolean") {
    state = ctrls2D.emailRow.style.display === "none";
  }

  ctrls2D.controls.style.width = "100%";
  ctrls2D.controls.style.height = "100%";
  ctrls2D.emailRow.style.display = state ? "" : "none";
  ctrls2D.switchMode.innerHTML = state ? "Log in" : "Sign up";
  ctrls2D.switchMode.className = state ? "loginButton" : "signupButton";
  ctrls2D.connect.innerHTML = state ? "Sign up" : "Log in";
  ctrls2D.connect.className = state ? "signupButton" : "loginButton";
}

function hideLoginForm() {
  ctrls2D.loginForm.style.display = "none";
  ctrls2D.frontBuffer.focus();
}

function errorMessage(message) {
  if (!ctrls2D.loginForm.style.width) {
    ctrls2D.loginForm.style.width = ctrls2D.loginForm.clientWidth + "px";
  }
  ctrls2D.errorMessage.innerHTML = message;
  ctrls2D.errorMessage.style.display = "block";
  disableLogin(false);
}

function disableLogin(v) {
  loginControls.forEach(function (ctrl) {
    ctrl.disabled = v;
  });
  document.body.style.cursor = v ? "wait" : "";
}

function environmentReady() {
  ctrls2D.loginForm.style.display = "";

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });
}

function authenticate(evt) {
  if (evt.type !== "keyup" || evt.keyCode === 13) {
    var verb = ctrls2D.emailRow.style.display === "none" ? "login" : "signup",
      password = ctrls2D.password.value,
      email = ctrls2D.email.value;

    userName = ctrls2D.userName.value.toLocaleUpperCase();
    disableLogin(true);

    if (userName.length === 0) {
      errorMessage("You must provide a user name.");
    }
    else if (password.length === 0) {
      errorMessage("You must provide a password.");
    }
    else {
      if (!socket) {
        console.log("connecting to: %s", serverPath);
        socket = io(serverPath);
        socket.on("connect_error", connectionError.bind(null, verb));
        socket.on("signupFailed", authFailed("signup"));
        socket.on("loginFailed", authFailed("login"));
        socket.on("logoutComplete", showSignup.bind(null, false));
        socket.on("errorDetail", console.error.bind(console));
        socket.on("loginComplete", authSucceeded);
      }

      socket.once("salt", function(salt) {
        var hash = new Hashes.SHA256()
          .hex(salt + password)
        socket.emit("hash", hash);
      });
      socket.emit(verb, {
        userName: userName,
        email: email,
        app: appKey
      });
    }
  }
}

function connectionError(verb, evt) {
  socket.close();
  socket = null;
  env.disconnect();
  authFailed(verb)("an error occured while connecting to the server.");
}

function authFailed(verb) {
  return function(reason) {
    showSignup(verb === "signup");
    errorMessage(ERROR_MESSAGES[verb] + reason.replace(/\[USER\]/g, ctrls2D.userName.value));
  }
}

function authSucceeded() {
  ctrls2D.errorMessage.innerHTML = "";
  ctrls2D.errorMessage.style.display = "none";
  disableLogin(false);
  hideLoginForm();

  document.cookie = "Primrose:user:" + userName;
  env.connect(socket, userName);
}