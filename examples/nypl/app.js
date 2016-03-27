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
  myWindow;

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
  signupForm.mesh.visible = false;

  app.scene.add(loginForm.mesh);
  app.registerPickableObject(loginForm.mesh);
  app.scene.add(signupForm.mesh);
  app.registerPickableObject(signupForm.mesh);

  loginForm.addEventListener("signup", () => {
    loginForm.mesh.visible = false;
    signupForm.mesh.visible = true;
  }, false);

  loginForm.addEventListener("login", () => {
    console.log(loginForm.userName.value, loginForm.password.value);
  }, false);

  signupForm.addEventListener("login", () => {
    loginForm.mesh.visible = true;
    signupForm.mesh.visible = false;
  }, false);
});

app.addEventListener("update", function (dt) {
});

app.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.S) {
    }
  }
});

app.setFullScreenButton("goVR", "click", true);
app.setFullScreenButton("goRegular", "click", false);
app.ctrls.viewSource.addEventListener("click", function () {
  var path = "https://github.com/capnmidnight/Primrose/tree/master" + document.location.pathname;
  path = path.replace(/\/(index.html)?(#fullscreen)?$/, "/app.js");
  window.open(path);
}, false);