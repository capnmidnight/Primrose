var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",

  env = new Primrose.BrowserEnvironment({
    skyTexture: "../images/bg2.jpg",
    ambientSound: "../audio/wind.ogg",
    groundTexture: GRASS,
    font: "../fonts/helvetiker_regular.typeface.json"
  }),

  subScene = new THREE.Object3D(),

  editor = null,
  output = null,
  button1 = null,
  editorFrame = null,
  editorFrameMesh = null,
  documentation = null,
  documentationMesh = null,
  stereoImage = null,
  stereoImageMesh = null,

  modA = isOSX ? "metaKey" : "ctrlKey",
  modB = isOSX ? "altKey" : "shiftKey",
  cmdA = isOSX ? "CMD" : "CTRL",
  cmdB = isOSX ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,

  scriptUpdateTimeout,
  lastScript = null,
  scriptAnimate = null;

env.addEventListener("ready", function () {
  env.scene.add(subScene);

  stereoImage = env.createElement("img");
  stereoImage.id = "StereoImage";
  stereoImage.className = "stereo";
  stereoImage.addEventListener("load", function (evt) {
    stereoImageMesh = env.appendChild(stereoImage);
    stereoImageMesh.rotation.set(0, 75 * Math.PI / 180, 0);
    stereoImageMesh.position.set(-4, env.avatarHeight, -1);
  }, false);
  stereoImage.src = "../images/prong.stereo.jpg";

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
  editor.style.height = Math.floor(editorFrame.surfaceHeight * 2 / 3);
  editor.style.fontSize = fontSize;
  editor.tokenizer = Primrose.Text.Grammars.JavaScript;
  editor.value = getSourceCode(isInIFrame);

  output = env.createElement("pre");
  output.id = "Output";
  output.style.top = editor.surfaceHeight + 25;
  output.style.width = editorFrame.surfaceWidth;
  output.style.height = editorFrame.surfaceHeight - editor.surfaceHeight - 25;
  output.style.fontSize = fontSize;

  button1 = env.createElement("button");
  button1.id = "ThemeButton";
  button1.style.backgroundColor = "#ffff00";
  button1.style.color = "#0000ff";
  button1.style.left = editorFrame.surfaceWidth - 400;
  button1.style.top = output.bounds.top;
  button1.style.width = 400;
  button1.style.height = 45;
  button1.value = "Switch to dark theme";

  button1.addEventListener("click", function () {
    var nextTheme = Primrose.Text.Themes.Default,
      nextString = "Switch to dark theme";
    if (editor.theme.name === nextTheme.name) {
      nextTheme = Primrose.Text.Themes.Dark;
      nextString = "Switch to light theme";
    }
    console.log("Switching to theme: " + nextTheme.name);
    documentation.theme = output.theme = editor.theme = nextTheme;
    button1.value = nextString;
  }, false);

  editorFrame.appendChild(output);
  editorFrame.appendChild(editor);
  editorFrame.appendChild(button1);

  editorFrameMesh = env.appendChild(editorFrame);
  editorFrameMesh.name = "MyWindow";
  editorFrameMesh.position.set(0, env.avatarHeight, 0);

  documentation = env.createElement("div");
  documentation.id = "Documentation";
  documentation.style.width = editorSize;
  documentation.style.height = editorSize;
  documentation.element = "docPage";

  documentationMesh = env.appendChild(documentation);
  documentationMesh.position.set(-2.2, env.avatarHeight, -1);
  documentationMesh.rotation.set(0, Math.PI / 4, 0);

  console.log("INSTRUCTIONS:");
  console.log(" - " + cmdPre + "+E to show/hide editor");
  console.log(" - " + cmdPre + "+X to reload original demo code");
  console.log(" - Z to reset position/sensor");
  console.log();
});

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
      scriptAnimate.call(env, dt);
    }
  }
});

env.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.E) {
      documentationMesh.visible = editorFrameMesh.visible = !editorFrameMesh.visible;
      documentationMesh.disabled = editorFrameMesh.disabled = !editorFrameMesh.disabled;
      if (!editorFrameMesh.visible && env.currentEditor && env.currentEditor.focused) {
        env.currentEditor.blur();
        env.currentEditor = null;
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

function testDemo(scene) {
  var WIDTH = 5,
    HEIGHT = 5,
    DEPTH = 5,
    MIDX = WIDTH / 2 - 5,
    MIDY = HEIGHT / 2,
    MIDZ = DEPTH / 2,
    t = 0,
    R = Primrose.Random,
    start = put(hub())
    .on(scene)
    .at(-MIDX, 0, -DEPTH - 2)
    .obj();

  var balls = [];

  for (var i = 0; i < 10; ++i) {
    balls.push(put(brick(DECK))
      .on(start)
      .at(R.int(WIDTH),
        R.int(HEIGHT),
        R.int(DEPTH))
      .obj());

    balls[i].velocity = v3(
      R.number(0, WIDTH),
      R.number(0, HEIGHT),
      R.number(0, DEPTH));
  }

  function update(dt) {
    t += dt;
    for (var i = 0; i < balls.length; ++i) {
      var ball = balls[i],
        p = ball.position,
        v = ball.velocity;
      p.add(v.clone()
        .multiplyScalar(dt));
      if (p.x < 0 && v.x < 0 || WIDTH <= p.x && v.x > 0) {
        v.x *= -1;
      }
      if (p.y < 1 && v.y < 0 || HEIGHT <= p.y && v.y > 0) {
        v.y *= -1;
      }
      if (p.z < 0 && v.z < 0 ||
        DEPTH <= p.z && v.z > 0) {
        v.z *= -1;
      }
    }
  }
}