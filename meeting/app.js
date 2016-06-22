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

ctrls2D.userName.value = userName;

showSignup(userName.length === 0);

ctrls2D.switchMode.addEventListener("click", showSignup);
ctrls2D.connect.addEventListener("click", doLogin);
ctrls2D.userName.addEventListener("keyup", doLogin);
ctrls2D.password.addEventListener("keyup", doLogin);
ctrls2D.closeButton.addEventListener("click", hideLoginForm, false);
env.addEventListener("ready", environmentReady);
env.addEventListener("authorizationfailed", authFailed);
env.addEventListener("authorizationsucceeded", loggedIn);
env.addEventListener("loggedout", showSignup.bind(null, false));

function authFailed(evt) {
  showSignup(evt.verb === "signup");
  errorMessage(ERROR_MESSAGES[evt.verb] + evt.reason.replace(/\[USER\]/g, ctrls2D.userName.value));
}

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

function hideLoginForm(){
  ctrls2D.loginForm.style.display = "none";
  ctrls2D.controls.style.width = "initial";
  ctrls2D.controls.style.height = "initial";
  ctrls2D.frontBuffer.focus();
}

function loggedIn() {
  ctrls2D.errorMessage.innerHTML = "";
  ctrls2D.errorMessage.style.display = "none";
  disableLogin(false);
  hideLoginForm();

  document.cookie = "Primrose:user:" + userName;
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

function disableLogin(v){
  loginControls.forEach(function(ctrl){
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

function doLogin(evt) {
  if(evt.type !== "keyup" || evt.keyCode === 13){
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
      env.authenticate(verb, userName, password, email);
    }
  }
}