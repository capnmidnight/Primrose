var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",
  CODE_KEY = "Pacman code",

  env = new Primrose.BrowserEnvironment("Pacman", {
    quality: Primrose.Quality.HIGH,
    autoScaleQuality: false,
    autoRescaleQuality: false,
    backgroundColor: 0x000000,
    skyTexture: DECK,
    ambientSound: "../audio/menu.ogg",
    groundTexture: DECK,
    fullScreenIcon: "../models/monitor.obj",
    VRIcon: "../models/cardboard.obj",
    font: "../fonts/helvetiker_regular.typeface.js"
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
    fontSize = 20;

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

  editorFrameMesh = editorCenter.appendChild(editorFrame);
  editorFrameMesh.name = "EditorFrameMesh";
  editorFrameMesh.position.set(0, 0, 0);
  editorFrameMesh.visible = false;
  editorFrameMesh.disabled = true;
});

window.addEventListener("beforeunload", function (evt) {
  if (false && editor && editor.value !== getSourceCode(true)) {
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
      try {
        scriptAnimate.call(env, dt);
      }
      catch (exp) {
        console.error(exp);
        scriptAnimate = null;
      }
    }
  }
});
function getSourceCode(skipReload) {
  var defaultDemo = pacman.toString(),
    src = skipReload && defaultDemo || getSetting(CODE_KEY, defaultDemo);
  // If there was no source code stored in local storage,
  // we use the script from a saved function and assume
  // it has been formatted with 2 spaces per-line.
  if (src === defaultDemo) {
    var lines = src.replace("\r\n", "\n").split("\n");
    lines.pop();
    lines.shift();
    for (var i = 0; i < lines.length; ++i) {
      lines[i] = lines[i].substring(2);
    }
    src = lines.join("\n");
  }
  return src.trim();
}
function pacman() {
  var R = Primrose.Random.number,
    L = Primrose.ModelLoader.loadObject,
    colors = [
      0xff0000,
      0xffff00,
      0xff00ff,
      0x00ffff
    ],
    ghosts;
  L("../models/ghost.obj").then(function (ghost) {
    ghosts = colors.map(function (color, i) {
      var g = ghost.clone(),
        body = g.children[0];
      textured(body, color);
      scene.appendChild(g);
      g.position.set(i * 3 - 4, 0, -5);
      g.velocity = v3(R(-1, 1), 0, R(-1, 1));
      return g;
    });
  });

  return function (dt) {
    if (ghosts) {
      ghosts.forEach(function (g) {
        g.position.add(g.velocity.clone().multiplyScalar(dt));
      });
    }
  }
}

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
    else if (evt.keyCode === Primrose.Keys.E && editor) {
      Primrose.HTTP.sendObject("saveScript", {
        "Content-Type": "application/json",
        data: {
          fileName: "pacman",
          content: editor.value
        }
      });
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

function clrscr() {
  if (output) {
    var t = output;
    t.value = "";
    t.selectionStart = t.selectionEnd = t.value.length;
    t.scrollIntoView(t.frontCursor);
  }
}