var GRASS = "images/grass.png",
  ROCK = "images/rock.png",
  SAND = "images/sand.png",
  WATER = "images/water.png",
  DECK = "images/deck.png",
  SKY = "images/bg2.jpg",
  app = new Primrose.BrowserEnvironment("NYPL", {
    skyTexture: SKY,
    groundTexture: GRASS,
    fullScreenIcon: "models/monitor.obj",
    VRIcon: "models/cardboard.obj",
    font: "fonts/helvetiker_regular.typeface.js"
  }),
  modA = isOSX ? "metaKey" : "ctrlKey",
  modB = isOSX ? "altKey" : "shiftKey",
  cmdA = isOSX ? "CMD" : "CTRL",
  cmdB = isOSX ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,
  loginForm = new Primrose.X.LoginForm(),
  signupForm = new Primrose.X.SignupForm(),
  stereoImage = new Primrose.Controls.Image(),
  stereoImageWindow,
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
  socket.on(n, (console._log || console.log).bind(console, n.toLocaleUpperCase()))
});

function makeWindow(width, height, size) {
  size = size || 1;
  return textured(quad(size, size * height / width), new Primrose.Surface({
    bounds: new Primrose.Text.Rectangle(0, 0, width, height)
  }));
}

app.addEventListener("ready", function () {

  if (!isMobile) {
    stereoImage.loadStereoImage("images/prong.stereo.jpg")
      .then(function (img) {
        stereoImageWindow = put(makeWindow(stereoImage.imageWidth, stereoImage.imageHeight, 0.5))
          .on(app.scene)
          .at(0, app.avatarHeight, -1.5);
        stereoImageWindow.name = "StereoImage";
        stereoImageWindow.surface.appendChild(stereoImage);
        app.scene.add(stereoImageWindow);
        app.registerPickableObject(stereoImageWindow);
      });
  }

  signupForm.mesh.position.x = loginForm.mesh.position.x = -0.75;
  signupForm.mesh.position.y = loginForm.mesh.position.y = app.avatarHeight;
  signupForm.mesh.position.z = loginForm.mesh.position.z = -1.5;
  loginForm.userName.value = getSetting("userName");

  app.scene.add(loginForm.mesh);
  app.registerPickableObject(loginForm.mesh);
  app.scene.add(signupForm.mesh);
  app.registerPickableObject(signupForm.mesh);
 
  var setState = function (state) {
    loginForm.mesh.disabled = !state;
    loginForm.mesh.visible = state;
    signupForm.mesh.disabled = state;
    signupForm.mesh.visible = !state;
  };

  loginForm.addEventListener("signup", setState.bind(window, false), false);
  signupForm.addEventListener("login", setState.bind(window, true), false);

  setState(false);

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

