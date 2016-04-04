/* global isOSX, Primrose, THREE, isVR, isMobile, put, exp */

var GRASS = "/examples/images/grass.png",
  ROCK = "/examples/images/rock.png",
  SAND = "/examples/images/sand.png",
  WATER = "/examples/images/water.png",
  DECK = "/examples/images/deck.png",
  SKY = "/examples/images/bg2.jpg",
  app = new Primrose.BrowserEnvironment("Editor3D", {
    disableAutoFullScreen: true,
    useFog: false,
    skyTexture: SKY,
    groundTexture: GRASS
  }),
  modA = isOSX ? "metaKey" : "ctrlKey",
  modB = isOSX ? "altKey" : "shiftKey",
  cmdA = isOSX ? "CMD" : "CTRL",
  cmdB = isOSX ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,
  loginForm = new Primrose.X.LoginForm(),
  signupForm = new Primrose.X.SignupForm(),
  stereoImage = new Primrose.Controls.Image(),
  myWindow,
  socket = new io(location.origin);

["chat",
  "deviceAdded",
  "deviceLost",
  "error",
  "handshakeFailed",
  "loginFailed",
  "userJoined",
  "userLeft",
  "userState",
].forEach(function (n) {
  socket.on(n, console._log.bind(console, n.toLocaleUpperCase()))
});

function makeWindow(width, height, size) {
  size = size || 1;
  return textured(quad(size, size * height / width), new Primrose.Surface({
    bounds: new Primrose.Text.Rectangle(0, 0, width, height)
  }));
}

app.addEventListener("ready", function () {
  var sun = put(light(0xffffff))
    .on(app.scene)
    .at(10, 10, 10);

  stereoImage.loadStereoImage("prong.stereo.jpg")
    .then(function (img) {
      var myWindow = put(makeWindow(stereoImage.imageWidth, stereoImage.imageHeight, 0.5))
        .on(app.scene)
        .at(0, app.avatarHeight, -1);
      myWindow.surface.appendChild(stereoImage);
      app.scene.add(myWindow);
      app.registerPickableObject(myWindow);
    });

  signupForm.mesh.position.x = loginForm.mesh.position.x = -0.75;
  signupForm.mesh.position.y = loginForm.mesh.position.y = app.avatarHeight;
  signupForm.mesh.position.z = loginForm.mesh.position.z = -1;
  loginForm.userName.value = getSetting("userName");
  loginForm.mesh.visible = false;

  app.scene.add(loginForm.mesh);
  app.registerPickableObject(loginForm.mesh);
  app.scene.add(signupForm.mesh);
  app.registerPickableObject(signupForm.mesh);

  loginForm.addEventListener("signup", function() {
    loginForm.mesh.visible = false;
    signupForm.mesh.visible = true;
  }, false);

  signupForm.addEventListener("login", function() {
    loginForm.mesh.visible = true;
    signupForm.mesh.visible = false;
  }, false);

  function listUsers(users) {
    signupForm.mesh.visible = loginForm.mesh.visible = false;
    console._log(users);
  }

  function userFormAction(formName, form) {
    form.addEventListener(formName, function () {
      if (form === signupForm) {
        loginForm.userName.value = signupForm.userName.value;
      }

      var failHandlerName = formName + "Failed",
        failHandler = function () {
          socket.off("userList", success);
          alert("Failed to " + formName);
        }, success = function (users) {
          socket.off(failHandlerName, failHandler);
          socket.on("userList", listUsers);
          listUsers(users);
        };

      socket.once("salt", function (salt) {
        socket.emit("hash", CryptoJS.SHA512(salt + form.password.value).toString());
      });
      socket.once("userList", success);
      socket.once(formName + "Failed", failHandler);

      var ident = {
        app: "nypl",
        userName: form.userName.value
      };
      if (form.email) {
        ident.email = form.email.value;
      }
      socket.emit(formName, ident);
    });
  }

  socket.on("handshakeComplete", function (name) {
    if (name === "login") {
      userFormAction("login", loginForm);
      userFormAction("signup", signupForm);
    }
  });

  socket.emit("handshake", "login");
});

window.addEventListener("unload", function () {
  setSetting("userName", loginForm.userName.value);
});

app.addEventListener("update", function (dt) {
});

app.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.S) {
    }
  }
});

