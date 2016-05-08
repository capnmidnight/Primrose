var GRASS = "images/grass.png",
  ROCK = "images/rock.png",
  SAND = "images/sand.png",
  WATER = "images/water.png",
  DECK = "images/deck.png",

  app = new Primrose.BrowserEnvironment("Editor3D", {
    skyTexture: "images/bg2.jpg",
    ambientSound: "audio/wind.ogg",
    groundTexture: GRASS,
    fullScreenIcon: "models/monitor.obj",
    VRIcon: "models/cardboard.obj",
    font: "fonts/helvetiker_regular.typeface.js"
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
  scriptAnimate = null,

  editorCenter = new THREE.Object3D();

app.addEventListener("ready", function () {
  app.scene.add(editorCenter);
  app.scene.add(subScene);

  stereoImage = new Primrose.Controls.Image({
    id: "StereoImage"
  });
  stereoImage.loadStereoImage("images/prong.stereo.jpg")
    .then(function () {
      stereoImageMesh = textured(quad(0.5, 0.5 * stereoImage.imageHeight / stereoImage.imageWidth), stereoImage);
      stereoImageMesh.rotation.set(0, 75 * Math.PI / 180, 0);
      stereoImageMesh.position.set(-4, app.avatarHeight, -1);
      app.scene.add(stereoImageMesh);
      app.registerPickableObject(stereoImageMesh);
    });

  var editorSize = isMobile ? 512 : 1024,
    fontSize = isMobile ? 10 : 20;

  editorFrame = new Primrose.Surface({
    id: "EditorFrame",
    bounds: new Primrose.Text.Rectangle(0, 0, editorSize, editorSize)
  });

  editor = new Primrose.Text.Controls.TextBox({
    id: "Editor",
    bounds: new Primrose.Text.Rectangle(0, 0, editorFrame.surfaceWidth, Math.floor(editorFrame.surfaceHeight * 2 / 3)),
    tokenizer: Primrose.Text.Grammars.JavaScript,
    value: getSourceCode(isInIFrame),
    fontSize: fontSize
  });

  output = new Primrose.Text.Controls.TextBox({
    id: "Output",
    bounds: new Primrose.Text.Rectangle(0, editor.surfaceHeight + 25, editorFrame.surfaceWidth, editorFrame.surfaceHeight - editor.surfaceHeight - 25),
    tokenizer: Primrose.Text.Grammars.PlainText,
    hideLineNumbers: true,
    readOnly: true,
    fontSize: fontSize
  });

  button1 = new Primrose.Controls.Button2D({
    id: "ThemeButton",
    bounds: new Primrose.Text.Rectangle(editorFrame.surfaceWidth - 400, output.bounds.top, 400, 45),
    value: "Switch to dark theme",
    backgroundColor: "#ffff00",
    color: "#0000ff"
  });

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
  editorFrameMesh = textured(shell(3, 10, 10), editorFrame, {
    opacity: 0.75
  });
  editorFrameMesh.name = "MyWindow";
  editorFrameMesh.position.set(0, 0, 0);
  editorCenter.add(editorFrameMesh);
  app.registerPickableObject(editorFrameMesh);

  documentation = new Primrose.Text.Controls.TextBox({
    id: "Documentation",
    bounds: new Primrose.Text.Rectangle(0, 0, editorSize, editorSize),
    tokenizer: Primrose.Text.Grammars.PlainText,
    hideLineNumbers: true,
    readOnly: true,
    value: getDocumentation(),
    fontSize: fontSize
  });

  documentationMesh = textured(quad(2, 2), documentation);
  documentationMesh.position.set(-2.2, app.avatarHeight, -1);
  documentationMesh.rotation.set(0, Math.PI / 4, 0);
  app.scene.add(documentationMesh);
  app.registerPickableObject(documentationMesh);

  console.log("INSTRUCTIONS:");
  console.log(" - " + cmdPre + "+E to show/hide editor");
  console.log(" - " + cmdPre + "+X to reload original demo code");
  console.log(" - Z to reset position/sensor");
  console.log();
});

app.addEventListener("update", function (dt) {
  if (!scriptUpdateTimeout) {
    scriptUpdateTimeout = setTimeout(updateScript, 500);
  }

  editorCenter.position.copy(app.player.position);

  if (scriptAnimate) {
    // If quality has degraded, it's likely because the user bombed on a script.
    // Let's help them not lose their lunch.
    if (app.quality === Primrose.Quality.NONE) {
      scriptAnimate = null;
      wipeScene();
    }
    else{
      scriptAnimate.call(app, dt);
    }
  }
});

app.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.E) {
      documentationMesh.visible = editorFrameMesh.visible = !editorFrameMesh.visible;
      documentationMesh.disabled = editorFrameMesh.disabled = !editorFrameMesh.disabled;
      if (!editorFrameMesh.visible && app.currentEditor && app.currentEditor.focused) {
        app.currentEditor.blur();
        app.currentEditor = null;
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
      scriptAnimate = scriptUpdate.call(app, subScene);
      if (scriptAnimate) {
        scriptAnimate(0);
      }
      console.log("----- script loaded -----");
      if (!scriptAnimate) {
        console.log("----- No update script provided -----");
      }
      else if (app.quality === Primrose.Quality.NONE) {
        app.quality = Primrose.Quality.MEDIUM;
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
      .at(-MIDX, 0, -DEPTH - 2);

  var balls = [];

  for (var i = 0; i < 10; ++i) {
    balls.push(put(brick(DECK))
      .on(start)
      .at(R.int(WIDTH),
      R.int(HEIGHT),
      R.int(DEPTH)));

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
      p.add(v.clone().multiplyScalar(dt));
      if (p.x < 0 && v.x < 0 || WIDTH <= p.x && v.x > 0) {
        v.x *= -1;
      }
      if (p.y < 1 && v.y < 0 || HEIGHT <= p.y && v.y > 0) {
        v.y *= -1;
      }
      if (p.z < 0 && v.z < 0
        || DEPTH <= p.z && v.z > 0) {
        v.z *= -1;
      }
    }
  }
}

// This is a function to just push it out of the way, uncluttering
// the code above.
function getDocumentation() {
  return "functions:\n" + "  console.log( msg );\n" + "    print a message to the window below the editor.\n" +
    "\n" +
    "  put( objectA ).on( objectB )[.at( x, y, z )];\n" +
    "    objectA: a THREE.Object3D to be added to another,\n" +
    "    objectB: a THREE.Object3D where objectA will be added,\n" +
    "    x, y, z: a location to set for objectA relative to objectB\n" +
    "\n" +
    "  light( color [, intensity[, distance[, decay]]] );\n" +
    "    creates a THREE.PointLight with the same parameters.\n" +
    "\n" +
    "  brick( txtName );\n" +
    "    creates a textured cube with the named texture, one of:\n" +
    "      [SAND, WATER, ROCK, GRASS, DECK].\n" +
    "\n" +
    "  quad( width[, height] );\n" +
    "    creates a THREE.PlaneBufferGeometry with the same parameters.\n" +
    "    if height is undefined, height is set to width (square).\n" +
    "\n" +
    "  box( width[, height, length] );\n" +
    "    creates a THREE.BoxGeometry with the same parameters.\n" +
    "    if height is undefined, height and length are set to width (cube).\n" +
    "\n" +
    "  hub( );\n" +
    "    creates a raw THREE.Object3D. Useful for combining objects.\n" +
    "\n" +
    "  sphere( radius[, slices, rings] );\n" +
    "    creates a THREE.SphereGeometry with the same parameters.\n" +
    "\n" +
    "  shell( radius[, slices, rings[, phi, theta]] );\n" +
    "    creates a portion of the inside surface of a sphere.\n" +
    "\n" +
    "  from( start ).to( end ).exec( thunk );\n" +
    "    iterates on the range [start, end), passing the index as the parameter\n" +
    "    to thunk, accumulating an array of thunk's return value.\n" +
    "\n" +
    "  textured( geometry, txt[, options: { unshaded: false, wireframe: false, opacity: 1, txtRepeatS: 1, txtRepeatT: 1} ] );\n" +
    "    geometry: a THREE.Geometry object\n" +
    "    txt: a material definition of some kind. It could be a:\n" +
    "      number - a solid hex color\n" +
    "      string - a path to a texture image\n" +
    "      Primrose.Text.Controls.TextBox - a text editor\n" +
    "    unshaded: set to true to use constant lighting (default false)\n" +
    "    opacity: 1 - opaque, 0 - transparent (default 1).\n" +
    "    txtRepeatS: texture repeat in S direction (default 1).\n" +
    "    txtRepeat: texture repeat in T direction (default 1)";
}
