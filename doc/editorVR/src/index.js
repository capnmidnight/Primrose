import { isMacOS, isMobile, isInIFrame } from "../../../src/flags";
import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";
import Keys from "../../../src/Primrose/Keys";
import JavaScript from "../../../src/Primrose/Text/Grammars/JavaScript";
import Dark from "../../../src/Primrose/Text/Themes/Dark";
import * as liveAPI from "../../../src/live-api";
import getSetting from "../../../src/util/getSetting";
import * as rand from "../../../src/Primrose/Random";
import { Quality } from "../../../src/Primrose/constants";

Object.assign(window, liveAPI, rand);

var GRASS = "../images/grass.png",
  ROCK = "../images/rock.png",
  SAND = "../images/sand.png",
  WATER = "../images/water.png",
  DECK = "../images/deck.png",

  env = new BrowserEnvironment({
    skyTexture: "../images/bg2.jpg",
    groundTexture: GRASS,
    font: "../fonts/helvetiker_regular.typeface.json",
    fullScreenButtonContainer: "#fullScreenButtonContainer"
  }),

  subScene = hub(),

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
  editor.tokenizer = JavaScript;
  editor.value = getSourceCode(isInIFrame);

  editorFrame.appendChild(editor);

  editorFrameMesh = env.appendChild(editorFrame);
  editorFrameMesh.name = "MyWindow";
  editorFrameMesh.position.set(0, env.avatarHeight, 0);

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
    if (evt.keyCode === Keys.E) {
      editorFrameMesh.visible = !editorFrameMesh.visible;
      if (!editorFrameMesh.visible && env.currentControl && env.currentControl.focused) {
        env.currentControl.blur();
        env.currentControl = null;
      }
    }
    else if (evt.keyCode === Keys.X) {
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

function testDemo(scene) {
  var GRASS = "../images/grass.png",
    ROCK = "../images/rock.png",
    SAND = "../images/sand.png",
    WATER = "../images/water.png",
    DECK = "../images/deck.png",
    WIDTH = 5,
    HEIGHT = 5,
    DEPTH = 5,
    MIDX = WIDTH / 2 - 5,
    MIDY = HEIGHT / 2,
    MIDZ = DEPTH / 2,
    t = 0,
    start = put(hub())
    .on(scene)
    .at(-MIDX, 0, -DEPTH - 2)
    .obj();

  var balls = [];

  for (var i = 0; i < 10; ++i) {
    balls.push(put(brick(DECK))
      .on(start)
      .at(number(WIDTH),
        number(HEIGHT),
        number(DEPTH))
      .obj());

    balls[i].velocity = v3(
      number(WIDTH),
      number(HEIGHT),
      number(DEPTH));
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