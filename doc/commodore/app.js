// different operating systems have different keyboard shortcuts.
var modA = isOSX ? "metaKey" : "ctrlKey",
  modB = isOSX ? "altKey" : "shiftKey",
  execKey = isOSX ? "E" : "SPACE",

  // a place to stow an object we will modify out of the loaded scene file
  editor = null,
  terminal = null,

  // setup the VR environment
  app = new Primrose.BrowserEnvironment("Commodore", {
    sceneModel: "models/commodore_pet.json",
    skyTexture: "images/bg2.jpg",
    groundTexture: "images/deck.png",
    fullScreenIcon: "models/monitor.obj",
    VRIcon: "models/cardboard.obj",
    font: "fonts/helvetiker_regular.typeface.js"
  });

function isExecuteCommand(evt) {
  return evt[modA] && evt[modB] && evt.keyCode === Primrose.Keys[execKey];
}

window.addEventListener("keydown", function (evt) {
  if (terminal.running && terminal.waitingForInput && evt.keyCode === Primrose.Keys.ENTER) {
    terminal.sendInput(evt);
  }
  else if (!terminal.running && isExecuteCommand(evt)) {
    terminal.execute();
  }
});

app.addEventListener("ready", function () {

  // A hack to reposition the objects in the scene because the model file is a little janky
  ["CaseBottom", "CaseInset", "CaseTitle", "CaseTop",
    "Feet", "Keyboard", "KeyboardBezel",
    "MonitorCase", "MonitorInset", "Screen",
    "TapeDeck", "TapeDeckControls", "TapeDeckDoor", "TapeDeckInset"]
    .map(function (name) {
      return app.scene[name];
    }).forEach(function (obj) {
      obj.position.y += app.avatarHeight * 0.9;
      obj.position.z -= 3;
    });

  for (var i = app.scene.children.length - 1; 0 <= i; --i) {
    var obj = app.scene.children[i];
    if (obj.name.length > 0 && obj.type === "PointLight") {
      app.scene.remove(obj);
    }
  }

  editor = new Primrose.Text.Controls.TextBox({
    bounds: new Primrose.Text.Rectangle(0, 0, 512, 512),
    tokenizer: Primrose.Text.Grammars.PlainText,
    theme: Primrose.Text.Themes.Dark,
    hideLineNumbers: true,
    fontSize: 15
  });
  editor.padding = 10;

  terminal = new Primrose.Text.Terminal(editor);
  terminal.loadFile("commodore/oregon.bas");

  var editorMesh = textured(app.scene.Screen, editor);
  app.registerPickableObject(editorMesh);
});