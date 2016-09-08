var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",
  CODE_KEY = "Pacman code",

  env = new Primrose.BrowserEnvironment({
    quality: Quality.HIGH,
    autoScaleQuality: false,
    autoRescaleQuality: false,
    backgroundColor: 0x000000,
    skyTexture: DECK,
    groundTexture: DECK,
    font: "../fonts/helvetiker_regular.typeface.json"
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
    fontSize = 40 / env.quality;

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
  editorFrameMesh.position.set(0, env.avatarHeight, 0);
  editorFrameMesh.visible = false;
  editorFrameMesh.disabled = true;
}, false);

window.addEventListener("beforeunload", function (evt) {
  if (false && editor && editor.value !== getSourceCode(true)) {
    return evt.returnValue = "Are you sure you want to leave?";
  }
}, false);

window.addEventListener("unload", function (evt) {
  var script = editor.value;
  if (script.length > 0) {
    setSetting(CODE_KEY, script);
  }
}, false);

env.addEventListener("update", function (dt) {
  if (!scriptUpdateTimeout) {
    scriptUpdateTimeout = setTimeout(updateScript, 500);
  }

  if (scriptAnimate) {
    // If quality has degraded, it's likely because the user bombed on a script.
    // Let's help them not lose their lunch.
    if (env.quality === Quality.NONE) {
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

function pacman() {
  var R = Primrose.Random.int,
    L = Primrose.ModelLoader.loadObject,
    T = 3,
    W = 30,
    H = 30,
    colors = [
      0xff0000,
      0xffff00,
      0xff00ff,
      0x00ffff
    ],
    ghosts,
    map = [
      "12222222221",
      "10000000001",
      "10222022201",
      "10001000001",
      "10101022201",
      "10100010101",
      "10222220101",
      "10000000001",
      "12222222221"
    ];

  function C(n, x, y) {
    if (n !== 0) {
      put(textured(cylinder(0.5, 0.5, T), 0x0000ff))
        .on(scene)
        .rot(0, n * Math.PI / 2, Math.PI / 2)
        .at(T * x - W / 2, env.avatarHeight, T * y - H / 2);
    }
  }

  for (var y = 0; y < map.length; ++y) {
    var row = map[y];
    for (var x = 0; x < row.length; ++x) {
      C(row[x] | 0, x, y);
    }
  }
  console.log("Here we go");
  L("../models/ghost.obj")
    .then(function (ghost) {
      console.log("ghost", ghost);
      ghosts = colors.map(function (color, i) {
        var g = ghost.clone(),
          body = g.children[0];
        textured(body, color);
        scene.appendChild(g);
        g.position.set(i * 3 - 4, 0, -5);
        g.velocity = v3(0, 0, 0);
        g.velocity.x = R(-1, 2);
        if (g.velocity.x === 0 && g.velocity.z === 0) {
          g.velocity.z = R(-1, 2);
        }
        return g;
      });
    });

  function collisionCheck(dt, a, t) {
    var x = Math.floor((a.position.x + W / 2 + 1) / T),
      y = Math.floor((a.position.z + H / 2 + 1) / T),
      row = map[y],
      tile = row && row[x] | 0;
    var v = a.velocity.clone()
      .multiplyScalar(-dt * 1.5);
    if (tile > 0) {
      if (t || a.isOnGround) {
        a.position.add(v);
      }
      if (t) {
        a.velocity.set(
          a.velocity.z,
          0, -a.velocity.x
        );
      }
    }
  }

  return function (dt) {
    if (ghosts) {
      ghosts.forEach(function (g) {
        g.position.add(g.velocity.clone()
          .multiplyScalar(dt));
        collisionCheck(dt, g, env.input.head);
      });
    }
    collisionCheck(dt, env.input.head, null);
  }
}

window.addEventListener("keydown", function (evt) {
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
      Primrose.HTTP.postObject("saveScript", {
        "Content-Type": "application/json",
        data: {
          fileName: "pacman",
          content: editor.value
        }
      });
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
      else if (env.quality === Quality.NONE) {
        env.quality = Quality.MEDIUM;
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