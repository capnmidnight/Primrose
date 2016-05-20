var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",
  CODE_KEY = "Pacman code",

  env = new Primrose.BrowserEnvironment("Pacman", {
    skyTexture: DECK,
    ambientSound: "../audio/wind.ogg",
    groundTexture: DECK,
    VRIcon: "../models/cardboard.obj",
    font: "../fonts/helvetiker_regular.typeface.js",
    autoScaleQuality: false
  }),

  editor = null,
  output = null,
  editorFrame = null,
  editorFrameMesh = null,
  
  modA = isOSX ? "metaKey" : "ctrlKey",
  modB = isOSX ? "altKey" : "shiftKey",
  cmdA = isOSX ? "CMD" : "CTRL",
  cmdB = isOSX ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,

  scriptUpdateTimeout,
  lastScript = null,
  scriptAnimate = null,

  subScene = hub(),
  editorCenter = hub();

env.addEventListener("ready", function () {
  env.appendChild(editorCenter);
  env.appendChild(subScene);

  var editorSize = isMobile ? 512 : 1024,
    fontSize = 40;

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
  editor.value = getSetting(CODE_KEY);
  
  editorFrame.appendChild(editor);

  editorFrameMesh = editorCenter.appendChild(editorFrame);
  editorFrameMesh.name = "EditorFrameMesh";
  editorFrameMesh.position.set(0, 0, 0);
  editorFrameMesh.visible = false;
  editorFrameMesh.disabled = true;
});

window.addEventListener("beforeunload", function (evt) {
  if (editor && editor.value !== getSetting(CODE_KEY)) {
    return evt.returnValue = "Are you sure you want to leave?";
  }
}, false);

window.addEventListener("unload", function (evt) {
  if (editor) {
    var script = editor.value;
    if (script.length > 0) {
      setSetting(CODE_KEY, script);
    }
  }
}, false);

env.addEventListener("update", function (dt) {
  if (!scriptUpdateTimeout) {
    scriptUpdateTimeout = setTimeout(updateScript, 500);
  }

  editorCenter.position.copy(env.player.position);

  if (scriptAnimate) {
    // If quality has degraded, it's likely because the user bombed on a script.
    // Let's help them not lose their lunch.
    if (env.quality === Primrose.Quality.NONE) {
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
      if (editorFrameMesh.visible && env.currentControl && env.currentControl.focused) {
        env.currentControl.blur();
        env.currentControl = null;
      }
      editorFrameMesh.visible = !editorFrameMesh.visible;
      editorFrameMesh.disabled = !editorFrameMesh.disabled;
    }
    else if (evt.keyCode === Primrose.Keys.X) {
      editor.value = "";
    }
  }

  if (scriptUpdateTimeout) {
    clearTimeout(scriptUpdateTimeout);
    scriptUpdateTimeout = null;
  }
});

function wipeScene() {
  for (var i = subScene.children.length - 1; i >= 0; --i) {
    subScene.remove(subScene.children[i]);
  }
}

function updateScript() {
  var newScript = editor.value,
    exp;
  if (newScript !== lastScript) {
    scriptUpdateTimeout = null;
    lastScript = newScript;
    if (newScript.indexOf("function update") >= 0 &&
      newScript.indexOf("return update") < 0) {
      newScript += "\nreturn update;";
    }
    try {
      console.log("----- loading new script -----");
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
      else if (env.quality === Primrose.Quality.NONE) {
        env.quality = Primrose.Quality.MEDIUM;
      }
    }
    catch (exp) {
      console.error(exp);
      scriptAnimate = null;
      throw exp;
    }
  }
}

logger.setup(logger.USER, function (msg) {
  if (output) {
    var data = JSON.parse(msg),
      t = output;
    t.value += data.name + ":> " + data.args[0] + "\n";
    t.selectionStart = t.selectionEnd = t.value.length;
    t.scrollIntoView(t.frontCursor);
  }
});

function clrscr() {
  if (output) {
    var t = output;
    t.value = "";
    t.selectionStart = t.selectionEnd = t.value.length;
    t.scrollIntoView(t.frontCursor);
  }
}