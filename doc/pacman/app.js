var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",
  CODE_KEY = "Pacman code",

  env = new Primrose.BrowserEnvironment({
    backgroundColor: 0x000000,
    skyTexture: DECK,
    groundTexture: DECK,
    font: "../fonts/helvetiker_regular.typeface.json",
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    progress: Preloader.thunk
  }),

  editor = null,

  modA = isMacOS ? "metaKey" : "ctrlKey",
  modB = isMacOS ? "altKey" : "shiftKey",
  cmdA = isMacOS ? "CMD" : "CTRL",
  cmdB = isMacOS ? "OPT" : "SHIFT",
  cmdPre = cmdA + "+" + cmdB,

  scriptUpdateTimeout,
  lastScript = null,
  scriptAnimate = null,

  subScene = hub();

env.addEventListener("ready", function () {
  env.scene.add(subScene);

  var editorSize = isMobile ? 512 : 1024,
    fontSize = isMobile ? 10 : 20;

  editor = new Primrose.Controls.TextBox({
      id: "Editor",
      width: editorSize,
      height: editorSize,
      geometry: shell(1.5, 25, 25),
      fontSize: fontSize,
      tokenizer: Primrose.Text.Grammars.JavaScript,
      value: getSourceCode(isInIFrame)
    })
    .addTo(env.vicinity)
    .at(0, env.options.avatarHeight, 0);

  Preloader.hide();
}, false);

window.addEventListener("beforeunload", function (evt) {
  if (false && editor && editor.value !== getSourceCode(true)) {
    return evt.returnValue = "Are you sure you want to leave?";
  }
}, false);

window.addEventListener("unload", function (evt) {
  var script = editor && editor.value;
  if (script && script.length > 0) {
    setSetting(CODE_KEY, script);
  }
}, false);

env.addEventListener("update", function () {
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
      try {
        scriptAnimate.call(env, env.deltaTime);
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

env.addEventListener("keydown", function (evt) {
  if (evt[modA] && evt[modB]) {
    if (evt.keyCode === Primrose.Keys.E) {
      editor.visible = !editor.visible;
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
        scriptUpdate = null;
        console.error(exp);
        console.error(newScript);
      }
    }, null, first);
    first = false;
  }
}



function pacman() {
  var R = Primrose.Random.int,
    L = Primrose.Graphics.ModelFactory.loadObject,
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
      cylinder(0.5, 0.5, T)
        .colored(0x0000ff)
        .addTo(scene)
        .rot(0, n * Math.PI / 2, Math.PI / 2)
        .at(T * x - W / 2, env.options.avatarHeight, T * y - H / 2);
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
        colored(body, color);
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