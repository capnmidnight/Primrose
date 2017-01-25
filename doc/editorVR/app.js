Object.assign(window, Primrose.Random);

var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png";

window.env = new Primrose.BrowserEnvironment({
  skyTexture: "../images/bg2.jpg",
  groundTexture: GRASS,
  font: "../fonts/helvetiker_regular.typeface.json",
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  progress: Preloader.thunk
});

var subScene = null,
  editor = null,
  editorFrame = null,
  editorFrameMesh = null,

  modA = isMacOS ? "metaKey" : "ctrlKey",
  modB = isMacOS ? "altKey" : "shiftKey",
  cmdA = isMacOS ? "CMD" : "CTRL",
  cmdB = isMacOS ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,

  scriptUpdateTimeout,
  lastScript = null,
  scriptAnimate = null;

env.addEventListener("ready", function () {
  subScene = hub();
  env.scene.add(subScene);

  var editorSize = isMobile ? 512 : 1024,
    fontSize = isMobile ? 10 : 20;

  editorFrame = env.createElement("section");
  editorFrame.id = "EditorFrame";
  editorFrame.className = "shell";
  editorFrame.style.width = editorSize;
  editorFrame.style.height = editorSize;

  editor = env.createElement("textarea");
  editor.id = "Editor";
  editor.style.width = editorFrame.surfaceWidth;
  editor.style.height = editorFrame.surfaceHeight;
  editor.style.fontSize = fontSize;
  editor.tokenizer = Primrose.Text.Grammars.JavaScript;
  editor.value = getSourceCode(isInIFrame);


  editorFrame.appendChild(editor);

  editorFrameMesh = env.appendChild(editorFrame);
  editorFrameMesh.name = "MyWindow";
  editorFrameMesh.position.set(0, env.options.avatarHeight, 0);

  console.log("INSTRUCTIONS:");
  console.log(" - " + cmdPre + "+E to show/hide editor");
  console.log(" - " + cmdPre + "+X to reload original demo code");
  console.log(" - Z to reset position/sensor");
  console.log();

  Preloader.hide();
});

env.addEventListener("update", function (dt) {
  if (!scriptUpdateTimeout) {
    scriptUpdateTimeout = setTimeout(updateScript, 500);
  }

  if (scriptAnimate) {
    // If quality has degraded, it's likely because the user bombed on a script.
    // Let's help them not lose their lunch.
    if (env.quality === Primrose.Constants.Quality.NONE) {
      scriptAnimate = null;
      wipeScene();
    }
    else {
      scriptAnimate.call(env, dt);
    }
  }
});

env.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.E) {
      editorFrameMesh.visible = !editorFrameMesh.visible;
      if (!editorFrameMesh.visible && env.currentControl && env.currentControl.focused) {
        env.currentControl.blur();
        env.currentControl = null;
      }
    }
    else if (evt.keyCode === Primrose.Keys.X) {
      editor.value = getSourceCode(true);
    }
  }

  if (scriptUpdateTimeout) {
    clearTimeout(scriptUpdateTimeout);
    scriptUpdateTimeout = null;
  }
});

window.addEventListener("beforeunload", function (evt) {
  return evt.returnValue = "Are you sure you want to leave?";
}, false);

window.addEventListener("unload", function () {
  console.log("unloading, going to try to save file?", !!editor);
  if (editor) {
    var script = editor.value;
    if (script.length > 0) {
      setSetting("code", script);
    }
  }
});

function wipeScene() {
  for (var i = subScene.children.length - 1; i >= 0; --i) {
    subScene.remove(subScene.children[i]);
  }
}

var first = true;
function updateScript() {
  var newScript = editor.value,
    exp;
  if (newScript !== lastScript) {
    env.transition(function() {
      scriptUpdateTimeout = null;
      lastScript = newScript;
      if (newScript.indexOf("function update") >= 0 &&
        newScript.indexOf("return update") < 0) {
        newScript += "\nreturn update;";
      }
      console.log("----- loading new script -----");
      scriptAnimate = null;
      try{
        var scriptUpdate = new Function("scene", newScript);
        wipeScene();
        scriptAnimate = scriptUpdate.call(env, subScene);
        if (scriptAnimate) {
          scriptAnimate(0);
        }
        console.log("----- script loaded -----");
        if (!scriptAnimate) {
          console.log("----- No update script provided -----");
        }
        else if (env.quality === Primrose.Constants.Quality.NONE) {
          env.quality = Primrose.Constants.Quality.MEDIUM;
        }
      }
      catch(exp){
        console.error(exp);
        console.error(newScript);
      }
    }, null, first);
    first = false;
  }
}

function getSourceCode(skipReload) {
  var defaultDemo = testDemo.toString(),
    src = skipReload && defaultDemo || getSetting("code", defaultDemo);
  // If there was no source code stored in local storage,
  // we use the script from a saved function and assume
  // it has been formatted with 2 spaces per-line.
  if (src === defaultDemo) {
    var lines = src.replace("\r\n", "\n")
      .split("\n");
    lines.pop();
    lines.shift();
    for (var i = 0; i < lines.length; ++i) {
      lines[i] = lines[i].substring(2);
    }
    src = lines.join("\n");
  }
  return src.trim();
}
