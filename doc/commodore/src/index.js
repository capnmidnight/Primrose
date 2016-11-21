import isMacOS from "../../../src/flags/isMacOS";
import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";
import Keys from "../../../src/Primrose/Keys";
import TextBox from "../../../src/Primrose/Text/Controls/TextBox";
import Rectangle from "../../../src/Primrose/Text/Rectangle";
import PlainText from "../../../src/Primrose/Text/Grammars/PlainText";
import Dark from "../../../src/Primrose/Text/Themes/Dark";
import Terminal from "../../../src/Primrose/Text/Terminal";
import * as liveAPI from "../../../src/live-api";
Object.assign(window, liveAPI);

// different operating systems have different keyboard shortcuts.
var modA = isMacOS ? "metaKey" : "ctrlKey",
  modB = isMacOS ? "altKey" : "shiftKey",
  execKey = isMacOS ? "E" : "SPACE",

  // a place to stow an object we will modify out of the loaded scene file
  editor = null,
  terminal = null,

  // setup the VR environment
  env = new BrowserEnvironment({
    sceneModel: "../models/commodore_pet.json",
    skyTexture: "../images/bg2.jpg",
    groundTexture: "../images/deck.png",
    font: "../fonts/helvetiker_regular.typeface.json"
  });

function isExecuteCommand(evt) {
  return evt[modA] && evt[modB] && evt.keyCode === Keys[execKey];
}

window.addEventListener("keydown", function (evt) {
  if (terminal.running && terminal.waitingForInput && evt.keyCode === Keys.ENTER) {
    terminal.sendInput(evt);
  }
  else if (!terminal.running && isExecuteCommand(evt)) {
    terminal.execute();
  }
});

env.addEventListener("ready", function () {

  // A hack to reposition the objects in the scene because the model file is a little janky
  ["CaseBottom", "CaseInset", "CaseTitle", "CaseTop",
    "Feet", "Keyboard", "KeyboardBezel",
    "MonitorCase", "MonitorInset", "Screen",
    "TapeDeck", "TapeDeckControls", "TapeDeckDoor", "TapeDeckInset"
  ]
  .map(function (name) {
      return env.scene[name];
    })
    .forEach(function (obj) {
      obj.position.y += env.avatarHeight * 0.9;
      obj.position.z -= 3;
    });

  for (var i = env.scene.children.length - 1; 0 <= i; --i) {
    var obj = env.scene.children[i];
    if (obj.name.length > 0 && obj.type === "PointLight") {
      env.scene.remove(obj);
    }
  }

  editor = new TextBox({
    bounds: new Rectangle(0, 0, 512, 512),
    tokenizer: PlainText,
    theme: Dark,
    hideLineNumbers: true,
    fontSize: 15
  });
  editor.padding = 10;

  terminal = new Terminal(editor);
  terminal.loadFile("oregon.bas");

  var editorMesh = textured(env.scene.Screen, editor);
  env.registerPickableObject(editorMesh);
});