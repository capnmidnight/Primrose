var idSpec = location.search.match(/id=(\w+)/),
meetingID = idSpec && idSpec[1] || "public",
env = new Primrose.BrowserEnvironment("Meeting:" + meetingID, {
  autoscaleQuality: false,
  quality: Primrose.Quality.LOW,
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
socket;

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

function listUsers(users) {
  signup.hide();
  login.hide();
  console.log(users);
}

function authFailed(name){
  return function(reason){
    console.error(name + " failed", reason);
    showSignup(name === "signup");
  }
}

function makeConnection(){
  if(socket){
    return Promise.resolve();
  }
  else{
    return new Promise(function(resolve, reject){
      var protocol = location.protocol.replace("http", "ws");
      socket = io.connect(protocol + "//" + location.hostname);
      socket.on("signupFailed", authFailed("signup"));
      socket.on("loginFailed", authFailed("login"));
      socket.on("userList", listUsers);
      socket.on("logoutComplete", showSignup.bind(null, false));
      socket.once("handshakeComplete", resolve);
      socket.emit("handshake", "login");
    });
  }
}

function attemptSignupLogin() {
  var form = signup.visible ? signup : login,
  verb = signup.visible ? "signup" : "login",
  userName = form.userName.value,
  password = form.password.value,
  email = form.email && form.email.value;

  if(userName && password && (!form.email || email)){
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
}

function doAuth(){
  makeConnection().then(attemptSignupLogin);
}

signup.addEventListener("signup", doAuth, false);
login.addEventListener("login", doAuth, false);

env.addEventListener("ready", function () {
  login.position.set(-1, env.avatarHeight, -1.5);
  signup.position.set(-1, env.avatarHeight, -1.5);
  env.appendChild(login);
  env.appendChild(signup);

  env.scene.traverse(function (obj) {
    if (obj.name.indexOf("Chair") === 0) {
      env.registerPickableObject(obj);
    }
    else if (obj.name.indexOf("LightPanel") === 0) {
      obj.material.emissive.setRGB(1, 1, 1);
    }
  });
});

env.addEventListener("gazecomplete", function (evt) {

});

env.addEventListener("pointerend", function (evt) {

});

env.addEventListener("update", function (dt) {

});