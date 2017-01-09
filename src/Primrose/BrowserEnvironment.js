import { packageName, version, homepage } from "../../package.json";
console.info(`[${packageName} v${version}]:> see ${homepage} for more information.`);

pliny.class({
  parent: "Primrose",
  name: "BrowserEnvironment",
  description: "Make a Virtual Reality app in your web browser!\n\
\n\
The `BrowserEnvironment` class provides a plethora of options for setting up new scenes and customizing the VR experience to your system. It is the starting point for all of your projects. It is named `BrowserEnvironment` as one day their may be an `AltspaceVREnvironment` or a `HiFidelityEnvironment`.",
  parameters: [{
    name: "options",
    type: "Primrose.BrowserEnvironment.optionsHash",
    description: "Settings to change how the environment looks and behaves. See [`Primrose.BrowserEnvironment.optionsHash`](#Primrose_BrowserEnvironment_optionsHash) for more information."
  }]
});

pliny.record({
  parent: "Primrose.BrowserEnvironment",
  name: "optionsHash",
  description: "Settings to change how the environment looks and behaves.",
  parameters: [{
    name: "antialias",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Enable or disable anti-aliasing"
  }, {
    name: "quality",
    type: "Primrose.Constants.Quality",
    optional: true,
    default: "Primrose.Constants.Quality.MAXIMUM",
    description: "The quality level at which to start rendering."
  }, {
    name: "fullScreenButtonContainer",
    type: "String",
    optional: true,
    description: "A DOM query selector that, if provided, will have buttons added to it for each of the fullscreen modes."
  }, {
    name: "useGaze",
    type: "Boolean",
    optional: true,
    description: "Whether or not to used timed ring cursors."
  }, {
    name: "useFog",
    type: "Boolean",
    optional: true,
    description: "Whether or not to use fog in the scene to limit view distance."
  }, {
    name: "avatarHeight",
    type: "Number",
    optional: true,
    default: 1.65,
    description: "The default height of the user's avatar, if the VR system doesn't provide a height."
  }, {
    name: "walkSpeed",
    type: "Number",
    optional: true,
    default: 2,
    description: "The number of meters per second at which the user runs."
  }, {
    name: "disableKeyboard",
    type: "Boolean",
    optional: true,
    description: "Set to true to disable keyboard-based input."
  }, {
    name: "enableShadows",
    type: "",
    optional: true,
    description: "Set to true to enable the use of shadows on objects in the scene."
  }, {
    name: "shadowMapSize",
    type: "Number",
    optional: true,
    default: 1024,
    description: "The size to use for the width and height of the shadow map that will be generated."
  }, {
    name: "progress",
    type: "Function",
    optional: true,
    description: "Callback function for recording model download progress."
  }, {
    name: "gravity",
    type: "Number",
    optional: true,
    default: 9.8,
    description: "The acceleration applied to falling objects."
  }, {
    name: "gazeLength",
    type: "Number",
    optional: true,
    default: 1.5,
    description: "The amount of time in seconds to require gazes on objects before triggering the gaze event."
  }, {
    name: "disableMirroring",
    type: "Boolean",
    optional: true,
    description: "By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance."
  }, {
    name: "disableDefaultLighting",
    type: "Boolean",
    optional: true,
    description: "By default, a single light is added to the scene,"
  }, {
    name: "backgroundColor",
    type: "Number",
    optional: true,
    default: 0xafbfff,
    description: "The color that WebGL clears the background with before drawing."
  }, {
    name: "skyTexture",
    type: "String or Array of String",
    optional: true,
    description: "The texture(s) to use for the sky."
  }, {
    name: "groundTexture",
    type: "String",
    optional: true,
    description: "The texture to use for the ground."
  }, {
    name: "nearPlane",
    type: "Number",
    optional: true,
    default: 0.01,
    description: "The near plane of the camera."
  }, {
    name: "drawDistance",
    type: "Number",
    optional: true,
    default: 100,
    description: "The distance from the near plane to the far plane of the camera."
  }, {
    name: "defaultFOV",
    type: "Number",
    optional: true,
    default: 75,
    description: "The field of view to use in non-VR settings."
  }, {
    name: "ambientSound",
    type: "String",
    optional: true,
    description: "The sound to play on loop in the background."
  }, {
    name: "canvasElement",
    type: "HTMLCanvasElement",
    optional: true,
    default: "frontBuffer",
    description: "HTML5 canvas element to which to render, if one had already been created."
  }, {
    name: "renderer",
    type: "THREE.WebGLRenderer",
    optional: true,
    description: "Three.js renderer, if one had already been created."
  }, {
    name: "context",
    type: "WebGLRenderingContext",
    optional: true,
    description: "A WebGL context to use, if one had already been created."
  }, {
    name: "scene",
    type: "THREE.Scene",
    optional: true,
    description: "Three.js scene, if one had already been created."
  }, {

    name: "nonstandardNeckLength",
    type: "Number",
    optional: true,
    description: "When creating a neck model, this is how high the neck runs. This is an experimental feature for setting the height of a user's \"neck\" on orientation-only systems (such as Google Cardboard and Samsung Gear VR) to create a more realistic feel."
  }, {
    name: "nonstandardNeckDepth",
    type: "Number",
    optional: true,
    description: "When creating a neck model, this is the distance from the center meridian of the neck to the eyes."
  }, {
    name: "showHeadPointer",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Whether or not to show a pointer tracking the gaze direction."
  }, {
    name: "nonstandardIPD",
    type: "Number",
    optional: true,
    description: "When creating a neck model, this is the how far apart to set the eyes. I highly suggest you don't go down the road that requires setting this. I will not help you understand what it does, because I would rather you just not use it."
  }, {
    name: "eyeRenderOrder",
    type: "Array of String",
    optional: true,
    default: `["left", "right"]`,
    description: "The order in which to draw the stereo view. I highly suggest you don't go down the road that requires setting this. I will not help you understand what it does, because I would rather you just not use it."
  }]
});

const MILLISECONDS_TO_SECONDS = 0.001,
  TELEPORT_DISPLACEMENT = new Vector3(),
  GROUND_HEIGHT = -0.07,
  EYE_INDICES = { "left": 0, "right": 1 };

import PointerLock from "../util/PointerLock";

import isiOS from "../flags/isiOS";

import box from "../live-api/box";
import brick from "../live-api/brick";
import colored from "../live-api/colored";
import hub from "../live-api/hub";
import textured from "../live-api/textured";
import sphere from "../live-api/sphere";

import identity from "../util/identity";

import Angle from "./Angle";
import Pointer from "./Pointer";
import Keys from "./Keys";

import Text2Speech from "./Audio/Speech";
import Audio3D from "./Audio/Audio3D";
import Music from "./Audio/Music";

import { eyeBlankAll } from "./Controls/BaseTextured";
import Button2D from "./Controls/Button2D";
import Button3D from "./Controls/Button3D";
import ButtonFactory from "./Controls/ButtonFactory";
import Entity from "./Controls/Entity";
import Ground from "./Controls/Ground";
import Sky from "./Controls/Sky";
import Image from "./Controls/Image";
import Surface from "./Controls/Surface";
import TextBox from "./Controls/TextBox";

import StandardMonitorVRDisplay from "./Displays/StandardMonitorVRDisplay";

import cascadeElement from "./DOM/cascadeElement";
import makeHidingContainer from "./DOM/makeHidingContainer";

import ModelFactory from "./Graphics/ModelFactory";

import FPSInput from "./Input/FPSInput";
import VR from "./Input/VR";

import NetworkManager from "./Network/Manager";

import PlainText from "./Text/Grammars/PlainText";

import Teleporter from "./Tools/Teleporter";

import { Quality, PIXEL_SCALES } from "./Constants";


import { EventDispatcher } from "three/src/core/EventDispatcher";
import { BackSide, PCFSoftShadowMap } from "three/src/constants";
import { FogExp2 } from "three/src/scenes/FogExp2";
import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { TextGeometry } from "three/src/geometries/TextGeometry";
import { Quaternion } from "three/src/math/Quaternion";
import { Color } from "three/src/math/Color";
import { Euler } from "three/src/math/Euler";
import { Vector3 } from "three/src/math/Vector3";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";

export default class BrowserEnvironment extends EventDispatcher {
  constructor(options) {
    super();

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "options",
      type: "Object",
      description: "A manager for messages sent across the network."
    });
    this.options = Object.assign({}, BrowserEnvironment.DEFAULTS, options);

    this.options.foregroundColor = this.options.foregroundColor || complementColor(new Color(this.options.backgroundColor))
      .getHex();

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "network",
      type: "Primrose.Network.Manager",
      description: "A manager for messages sent across the network."
    });
    this.network = null;

    if(this.options.nonstandardIPD !== null){
      this.options.nonstandardIPD *= 0.5;
    }

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "audioQueue",
      type: "Array",
      description: "Remote user Audio elements that joined as peers before the `BrowserEnvironment` could finish loading all of the assets."
    });
    this.audioQueue = [];


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "zero",
      description: "Zero and reset sensor data."
    });
    this.zero = () => {
      if (!this.lockMovement) {
        this.input.zero();
        if (this.quality === Quality.NONE) {
          this.quality = Quality.HIGH;
        }
      }
    };

    const update = (dt) => {
      dt *= MILLISECONDS_TO_SECONDS;
      this.input.update(dt);
      doPicking();
      moveGround();
      moveUI();
      if(this.network){
        this.network.update(dt);
      }

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "update",
        description: "Fires after every animation update."
      });
      this.emit("update");
    };

    const doPicking = () => {
      eyeBlankAll(0);
      for(let i = this.pickableObjects.length - 1; i >= 0; --i){
        let inScene = false;
        for(let head = this.pickableObjects[i].parent; head !== null; head = head.parent){
          if(head === this.scene){
            inScene = true;
          }
        }
        if(!inScene) {
          this.pickableObjects.splice(i, 1);
        }
      }
      this.input.resolvePicking(this.pickableObjects.filter((obj) => !obj.disabled));
    };

    const moveGround = () => {
      if(this.sky) {
        this.sky.position.copy(this.input.head.position);
      }

      if (this.ground) {
        this.ground.position.set(
          Math.floor(this.input.head.position.x),
          GROUND_HEIGHT,
          Math.floor(this.input.head.position.z));
        if(this.ground.material){
          this.ground.material.needsUpdate = true;
        }
      }
    };

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "turns",
      type: "Primrose.Angle",
      description: "A slewing angle that loosely follows the user around."
    });
    this.turns = new Angle(0);
    const followEuler = new Euler(),
      maxX = -Math.PI / 4,
      maxY = Math.PI / 6;

    const moveUI = (dt) => {
      this.ui.position.copy(this.input.stage.position);
      followEuler.setFromQuaternion(this.input.head.quaternion);
      this.turns.radians = followEuler.y;
      followEuler.set(maxX, this.turns.radians, 0, "YXZ");
      this.ui.quaternion.setFromEuler(followEuler);
    };

    var animate = (t) => {
      var dt = t - lt,
        i, j;
      lt = t;
      update(dt);
      render();
      RAF(animate);
    };

    var render = () => {
      this.camera.position.set(0, 0, 0);
      this.camera.quaternion.set(0, 0, 0, 1);
      this.audio.setPlayer(this.input.head.mesh);
      this.renderer.clear(true, true, true);

      var trans = this.input.VR.getTransforms(
        this.options.nearPlane,
        this.options.nearPlane + this.options.drawDistance);
      for (var n = 0; trans && n < trans.length; ++n) {
        var eye = this.options.eyeRenderOrder[n],
          i = EYE_INDICES[eye],
          st = trans[i] || trans[1 - i];
        if(!st) {
          i = 1 - i;
          st = trans[i];
        }
        var v = st.viewport;
        eyeBlankAll(i);

        if(trans.length > 1) {
          var side = (2 * i) - 1;
          if(this.options.nonstandardIPD !== null && st.translation.x !== 0){
            st.translation.x = Math.sign(st.translation.x) * this.options.nonstandardIPD;
          }
          if(this.options.nonstandardNeckLength !== null){
            st.translation.y = this.options.nonstandardNeckLength;
          }
          if(this.options.nonstandardNeckDepth !== null){
            st.translation.z = this.options.nonstandardNeckDepth;
          }
        }
        this.renderer.setViewport(
          v.left * resolutionScale,
          v.top * resolutionScale,
          v.width * resolutionScale,
          v.height * resolutionScale);
        this.camera.projectionMatrix.copy(st.projection);
        if (this.input.mousePointer.unproject) {
          this.input.mousePointer.unproject.getInverse(st.projection);
        }
        this.camera.translateOnAxis(st.translation, 1);
        this.renderer.render(this.scene, this.camera);
        this.camera.translateOnAxis(st.translation, -1);
      }
      this.input.submitFrame();
    };

    var modifyScreen = () => {
      var near = this.options.nearPlane,
        far = near + this.options.drawDistance,
        p = this.input && this.input.VR && this.input.VR.getTransforms(near, far);

      if (p) {
        var canvasWidth = 0,
          canvasHeight = 0;

        for (var i = 0; i < p.length; ++i) {
          canvasWidth += p[i].viewport.width;
          canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
        }

        this.input.Mouse.commands.U.scale = devicePixelRatio * 2 / canvasWidth;
        this.input.Mouse.commands.V.scale = devicePixelRatio * 2 / canvasHeight;

        canvasWidth = Math.floor(canvasWidth * resolutionScale);
        canvasHeight = Math.floor(canvasHeight * resolutionScale);

        this.renderer.domElement.width = canvasWidth;
        this.renderer.domElement.height = canvasHeight;
        if (!this.timer) {
          render();
        }
      }
    };

    //
    // Initialize local variables
    //

    var lt = 0,
      currentHeading = 0,
      qPitch = new Quaternion(),
      vEye = new Vector3(),
      vBody = new Vector3(),
      modelFiles = {
        scene: this.options.sceneModel,
        avatar: this.options.avatarModel,
        button: this.options.button && typeof this.options.button.model === "string" && this.options.button.model,
        font: this.options.font
      },
      resolutionScale = 1;

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "factories",
      type: "Object",
      description: "A database of object factories, generally used to create 3D models."
    });
    this.factories = {
      button: Button2D,
      img: Image,
      section: Surface,
      textarea: TextBox,
      avatar: null,
      pre: {
        create: () => new TextBox({
          tokenizer: PlainText,
          hideLineNumbers: true,
          readOnly: true
        })
      }
    };

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "createElement",
      description: "Different types of HTML elements are represented by different types of 3D elements. This method provides a DOM-like interface for creating them.",
      returns: "Primrose.Entity",
      parameters: [{
        name: "type",
        type: "String",
        description: "The type of object to create."
      }]
    });
    this.createElement = (type) => {
      if (this.factories[type]) {
        return this.factories[type].create();
      }
    };

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "appendChild",
      description: "Add an object to the scene, potentially informing the object so that it may perform other tasks during the transition.",
      returns: "THREE.Object3D",
      parameters: [{
        name: "elem",
        type: "THREE.Object3D",
        description: "The object to add to the scene."
      }]
    });
    this.appendChild = (elem) => {
      if (elem.isMesh) {
        this.scene.add(elem);
      }
      else {
        return elem.addToBrowserEnvironment(this, this.scene);
      }
    };

    function setColor(model, color) {
      return model.children[0].material.color.set(color);
    }

    function complementColor(color) {
      var rgb = color.clone();
      var hsl = rgb.getHSL();
      hsl.h = hsl.h + 0.5;
      hsl.l = 1 - hsl.l;
      while (hsl.h > 1) hsl.h -= 1;
      rgb.setHSL(hsl.h, hsl.s, hsl.l);
      return rgb;
    }

    var modelsReady = ModelFactory.loadObjects(modelFiles)
      .then((models) => {
        window.text3D = function (font, size, text) {
          var geom = new TextGeometry(text, {
            font: font,
            size: size,
            height: size / 5,
            curveSegments: 2
          });
          geom.computeBoundingSphere();
          geom.computeBoundingBox();
          return geom;
        }.bind(window, models.font);

        if (models.scene) {
          buildScene(models.scene);
        }

        if (models.avatar) {
          this.factories.avatar = new ModelFactory(models.avatar);
        }

        pliny.property({
          parent: "Primrose.BrowserEnvironment",
          name: "buttonFactory",
          type: "Primrose.Controls.ButtonFactory",
          description: "A factory for creating the geometry for individual 3D buttons whenever they are needed."
        })
        if (models.button) {
          this.buttonFactory = new ButtonFactory(
            models.button,
            this.options.button.options);
        }
      })
      .catch((err) => console.error(err))
      .then(() => this.buttonFactory = this.buttonFactory || ButtonFactory.DEFAULT);

    //
    // Initialize public properties
    //

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "speech",
      type: "Primrose.Audio.Speech",
      description: "A text-2-speech system."
    });
    this.speech = new Text2Speech(this.options.speech);

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "audio",
      type: "Primrose.Audio.Audio3D",
      description: "An audio graph that keeps track of 3D information."
    });
    this.audio = new Audio3D();

    if (this.options.ambientSound) {
      this.audio.load3DSound(this.options.ambientSound, true, -1, 1, -1)
        .then((aud) => {
          if (!(aud.source instanceof MediaElementAudioSourceNode)) {
            aud.volume.gain.value = 0.1;
            aud.source.start();
          }
        })
        .catch(console.error.bind(console, "Audio3D loadSource"));
    }

    var documentReady = null;
    if (document.readyState === "complete") {
      documentReady = Promise.resolve("already");
    }
    else {
      documentReady = new Promise((resolve, reject) => {
        document.addEventListener("readystatechange", (evt) => {
          if (document.readyState === "complete") {
            resolve("had to wait for it");
          }
        }, false);
      });
    }

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "music",
      type: "Primrose.Audio.Music",
      description: "A primitive sort of synthesizer for making simple music."
    });
    this.music = new Music(this.audio);

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "pickableObjects",
      type: "Array",
      description: "The objects to raycast against to check for clicks."
    });
    this.pickableObjects = [];


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "registerPickableObject",
      description: "Add an object to the list of pickable objects.",
      parameters: [{
        name: "obj",
        type: "Any",
        description: "The object to make pickable."
      }]
    });
    this.registerPickableObject = (obj) => {
      if(obj) {
        this.pickableObjects.push(obj);
      }
    };

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "currentControl",
      type: "Primrose.Control.BaseControl",
      description: "The currently selected control, by a user-click or some other function."
    });
    this.currentControl = null;


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "fadeOut",
      returns: "Promise",
      description: "Causes the fully rendered view fade out to the color provided `options.backgroundColor`"
    });
    const FADE_SPEED = 0.1;
    this.fadeOut = () => {
      return new Promise((resolve, reject) => {
        var timer = setInterval(() => {
          this.fader.material.opacity += FADE_SPEED;
          if(this.fader.material.opacity >= 1){
            clearInterval(timer);
            resolve();
          }
        }, 10);
      });
    };


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "fadeIn",
      returns: "Promise",
      description: "Causes the faded out cube to disappear."
    });
    this.fadeIn = () => {
      return new Promise((resolve, reject) => {
        var timer = setInterval(() => {
          this.fader.material.opacity -= FADE_SPEED;
          if(this.fader.material.opacity <= 0){
            clearInterval(timer);
            resolve();
          }
        }, 10);
      });
    };

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "teleportAvailable",
      type: "Boolean",
      description: "Returns true when the system is not currently fading out or in.`"
    });
    this.teleportAvailable = true;

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "transition",
      returns: "Promise",
      description: "Perform an action in between a fade-out and a fade-in. Useful for hiding actions that might cause the view update to freeze, so the user doesn't get sick.",
      parameters: [{
        name: "thunk",
        type: "Function",
        description: "A callback function, to be executed between the fade-out and fade-in effects."
      }]
    });
    this.transition = (thunk, check, immediate) => {
      if(immediate) {
        thunk();
        return Promise.resolve();
      }
      else if(!check || check()){
        this.fader.visible = true;
        return this.fadeOut()
          .then(thunk)
          .then(() => this.fadeIn())
          .catch(console.warn.bind(console, "Error while transitioning"))
          .then(() => this.fader.visible = false);
      }
    };


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "teleport",
      returns: "Promise",
      description: "Move the user to a position, using the fade-out/fade-in transition effect.",
      parameters: [{
        name: "pos",
        type: "THREE.Vector3",
        description: "The point at which to move the user."
      }, {
        name: "immediate",
        type: "Boolean",
        optional: true,
        default: false,
        description: "If true, skips the transition effect."
      }]
    });
    this.teleport = (pos, immediate) => this.transition(
      () => this.input.moveStage(pos),
      () => this.teleportAvailable && TELEPORT_DISPLACEMENT.copy(pos)
        .sub(this.input.head.position)
        .length() > 0.2,
      immediate);

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "selectControl",
      description: "Handles pointer interactions and differentiates between teleportation and selecting controls on the screen.",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "A pointer click event that triggered."
      }]
    });
    this.selectControl = (evt) => {
      const hit = evt.hit,
        obj = hit && hit.object;
        console.log(evt.type, obj);

      if(evt.type === "pointerstart" || evt.type === "gazecomplete"){
        const ctrl = obj && (obj.surface || obj.button);
        if(ctrl !== this.currentControl){
          if(this.currentControl){
            this.currentControl.blur();
            this.input.Mouse.commands.pitch.disabled =
            this.input.Mouse.commands.heading.disabled = false;
          }
          this.currentControl = ctrl;
          if(this.currentControl){
            this.currentControl.focus();
            if(obj.surface){
              this.input.Mouse.commands.pitch.disabled =
              this.input.Mouse.commands.heading.disabled = !this.input.VR.isPresenting;
            }
          }
        }
      }

      if(this.currentControl){
        if(this.currentControl.dispatchEvent){
          this.currentControl.dispatchEvent(evt);
        }
        else{
          console.log(this.currentControl);
        }
      }
      else if(obj) {
        const handler = obj["on" + evt.type];
        if(handler){
          handler(evt);
        }
      }
    };

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "scene",
      type: "THREE.Scene",
      description: "The 3D scene that gets displayed to the user."
    });
    this.options.scene = this.scene = this.options.scene || new Scene();

    if (this.options.useFog) {
      this.scene.fog = new FogExp2(this.options.backgroundColor, 1 / Math.sqrt(this.options.drawDistance));
    }

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "camera",
      type: "THREE.PerspectiveCamera",
      description: "The camera used to render the view."
    });
    this.camera = new PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "sky",
      type: "THREE.Object3D",
      description: "If a `skyTexture` option is provided, it will be a texture cube or photosphere. If no `skyTexture` option is provided, there will only be a THREE.Object3D, to create an anchor point on which implementing scripts can add objects that follow the user's position."
    });
    this.sky = new Sky(this.options);
    this.appendChild(this.sky);


    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "ground",
      type: "THREE.Object3D",
      description: "If a `groundTexture` option is provided, it will be a flat plane extending to infinity. As the user moves, the ground will shift under them by whole texture repeats, making the ground look infinite."
    });
    this.ground = new Ground(this.options);
    this.appendChild(this.ground);

    this.teleporter = new Teleporter(this, this.ground);


    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "ui",
      type: "THREE.Object3D",
      description: "An anchor point on which objects can be added that follows the user around in both position and orientation. The orientation lags following the user, so if the UI is ever in the way, the user can turn slightly and it won't follow them."
    });
    this.ui = hub().named("UI");
    this.scene.add(this.ui);

    var buildScene = (sceneGraph) => {
      sceneGraph.buttons = [];
      sceneGraph.traverse(function (child) {
        if (child.isButton) {
          sceneGraph.buttons.push(
            new Button3D(child.parent, child.name));
        }
        if (child.name) {
          sceneGraph[child.name] = child;
        }
      });
      this.scene.add.apply(this.scene, sceneGraph.children);
      this.scene.traverse((obj) => {
        if (this.options.disableDefaultLighting && obj.material) {
          if(obj.material.map){
            textured(obj, obj.material.map, {
              unshaded: true
            });
          }
          else{
            colored(obj, obj.material.color.getHex(), {
              unshaded: true
            });
          }
        }
        if (obj.name) {
          this.scene[obj.name] = obj;
        }
      });
      if (sceneGraph.Camera) {
        this.camera.position.copy(sceneGraph.Camera.position);
        this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
      }
      return sceneGraph;
    };

    var currentTimerObject = null;
    this.timer = 0;
    var RAF = (callback) => {
      currentTimerObject = this.input.VR.currentDevice || window;
      if (this.timer !== null) {
        this.timer = currentTimerObject.requestAnimationFrame(callback);
      }
    };


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "goFullScreen",
      returns: "Promise",
      description: "Enter full-screen mode on one of the available displays. NOTE: due to a defect in iOS, this feature is not available on iPhones or iPads."
    });
    this.goFullScreen = (index, evt) => {
      if (evt !== "Gaze") {
        let elem = null;
        if(evt === "force" || this.input.VR.canMirror || this.input.VR.isNativeMobileWebVR) {
          elem = this.renderer.domElement;
        }
        else{
          elem = this.options.fullScreenElement;
        }
        this.input.VR.connect(index);
        return this.input.VR.requestPresent([{
            source: elem
          }])
          .catch((exp) => console.error("whaaat", exp))
          .then(() => elem.focus());
      }
    };

    this.addAvatar = (user) => {
      console.log(user);
      this.scene.add(user.stage);
      this.scene.add(user.head);
    };

    this.removeAvatar = (user) => {
      this.scene.remove(user.stage);
      this.scene.remove(user.head);
    };

    PointerLock.addChangeListener((evt) => {
      if (this.input.VR.isPresenting && !PointerLock.isActive) {
        this.input.cancelVR();
      }
    });

    const fullScreenChange = (evt) => {
      const presenting = !!this.input.VR.isPresenting,
        cmd = (presenting ? "remove" : "add") + "Button";
      this.input.Mouse[cmd]("dx", 0);
      this.input.Mouse[cmd]("dy", 0);
      this.input.Mouse.commands.U.disabled =
        this.input.Mouse.commands.V.disabled = presenting && !this.input.VR.isStereo;
      this.input.Mouse.commands.heading.scale = presenting ? -1 : 1;
      this.input.Mouse.commands.pitch.scale = presenting ? -1 : 1;
      if (!presenting) {
        this.input.cancelVR();
      }
      modifyScreen();
    };

    window.addEventListener("vrdisplaypresentchange", fullScreenChange, false);
    window.addEventListener("resize", modifyScreen, false);
    window.addEventListener("blur", this.stop, false);
    window.addEventListener("focus", this.start, false);

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "renderer",
      type: "THREE.WebGLRenderer",
      description: "The Three.js renderer being used to draw the scene."
    });
    documentReady = documentReady.then(() => {
      if (this.options.renderer) {
        this.renderer = this.options.renderer;
      }
      else {
        this.renderer = new WebGLRenderer({
          canvas: cascadeElement(this.options.canvasElement, "canvas", HTMLCanvasElement),
          context: this.options.context,
          antialias: this.options.antialias,
          alpha: true,
          logarithmicDepthBuffer: false
        });
        this.renderer.autoClear = false;
        this.renderer.sortObjects = true;
        this.renderer.setClearColor(this.options.backgroundColor);
        if (!this.renderer.domElement.parentElement) {
          document.body.appendChild(this.renderer.domElement);
        }
      }

      this.options.fullScreenElement = document.querySelector(this.options.fullScreenElement) || this.renderer.domElement;
      let maxTabIndex = 0;
      const elementsWithTabIndex = document.querySelectorAll("[tabIndex]");
      for(let i = 0; i < elementsWithTabIndex.length; ++i){
        maxTabIndex = Math.max(maxTabIndex, elementsWithTabIndex[i].tabIndex);
      }

      this.renderer.domElement.tabIndex = maxTabIndex + 1;
      this.renderer.domElement.addEventListener('webglcontextlost', this.stop, false);
      this.renderer.domElement.addEventListener('webglcontextrestored', this.start, false);


      pliny.property({
        parent: "Primrose.BrowserEnvironment",
        name: "input",
        type: "Primrose.Input.FPSInput",
        description: "The input manager."
      });
      this.input = new FPSInput(this.options.fullScreenElement, this.options);
      this.input.addEventListener("zero", this.zero, false);
      this.input.VR.ready.then((displays) => displays.forEach((display, i) => {
        window.addEventListener("vrdisplayactivate", (evt) => {
          if(evt.display === display) {
            const exitVR = () => {
              window.removeEventListener("vrdisplaydeactivate", exitVR);
              this.input.cancelVR();
            };
            window.addEventListener("vrdisplaydeactivate", exitVR, false);
            this.goFullScreen(i);
          }
        }, false);
      }));

      this.fader = colored(box(1, 1, 1), this.options.backgroundColor, {
        opacity: 0,
        useFog: false,
        transparent: true,
        unshaded: true,
        side: BackSide
      });
      this.fader.visible = false;
      this.input.head.root.add(this.fader);

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "select",
        description: "Fired when an object has been selected, either by a physical cursor or a gaze-based cursor. You will typically want to use this instead of pointerend or gazecomplete."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointerstart",
        description: "Fired when mouse, gamepad, or touch-based pointers have their trigger buttons depressed."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointerend",
        description: "Fired when mouse, gamepad, or touch-based pointers have their trigger buttons released."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointermove",
        description: "Fired when mouse, gamepad, or touch-based pointers are moved away from where they were last frame."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazestart",
        description: "Fired when a gaze-based cursor starts spinning on a selectable object."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazemove",
        description: "Fired when a gaze-based cursor moves across an object that it is attempting to select."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazecomplete",
        description: "Fired when a gaze-based cursor finishes spinning on a selectable object."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazecancel",
        description: "Fired when a gaze-based cursor is moved off of the object it is attempting to select before it can finish spinning."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "exit",
        description: "Fired when a pointer leaves an object."
      });

      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "enter",
        description: "Fired when a pointer hovers over an object."
      });


      if(!this.options.disableKeyboard) {
        const keyDown =  (evt) => {
            if (this.input.VR.isPresenting) {
              if (evt.keyCode === Keys.ESCAPE && !this.input.VR.isPolyfilled) {
                this.input.cancelVR();
              }
            }

            if(!this.lockMovement){
              this.input.Keyboard.dispatchEvent(evt);
            }
            else if(this.currentControl){
              this.currentControl.keyDown(evt);
            }

            pliny.event({
              parent: "Primrose.BrowserEnvironment",
              name: "keydown",
              description: "Standard browser KeyDown event. Bind to this version, rather than the window or document, as certain checks involving user state and locking movement to text boxes are performed."
            });
            this.emit("keydown", evt);
          },

          keyUp = (evt) => {
            if(!this.lockMovement){
              this.input.Keyboard.dispatchEvent(evt);
            }
            else if(this.currentControl){
              this.currentControl.keyUp(evt);
            }

            pliny.event({
              parent: "Primrose.BrowserEnvironment",
              name: "keyup",
              description: "Standard browser KeyUp event. Bind to this version, rather than the window or document, as certain checks involving user state and locking movement to text boxes are performed."
            });
            this.emit("keyup", evt);
          },

          withCurrentControl = (name) => {
            return (evt) => {
              if (this.currentControl) {
                if (this.currentControl[name]) {
                  this.currentControl[name](evt);
                }
                else {
                  console.warn("Couldn't find %s on %o", name, this.currentControl);
                }
              }
            };
          };

        window.addEventListener("keydown", keyDown, false);

        window.addEventListener("keyup", keyUp, false);


        window.addEventListener("paste", withCurrentControl("readClipboard"), false);
        window.addEventListener("wheel", withCurrentControl("readWheel"), false);


        const focusClipboard = (evt) => {
          if (this.lockMovement) {
            var cmdName = this.input.Keyboard.operatingSystem.makeCommandName(evt, this.input.Keyboard.codePage);
            if (cmdName === "CUT" || cmdName === "COPY") {
              surrogate.style.display = "block";
              surrogate.focus();
            }
          }
        };

        const clipboardOperation = (evt) => {
          if (this.currentControl) {
            this.currentControl[evt.type + "SelectedText"](evt);
            if (!evt.returnValue) {
              evt.preventDefault();
            }
            surrogate.style.display = "none";
            this.currentControl.focus();
          }
        };

        // the `surrogate` textarea makes clipboard events possible
        var surrogate = cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
          surrogateContainer = makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

        surrogateContainer.style.position = "absolute";
        surrogateContainer.style.overflow = "hidden";
        surrogateContainer.style.width = 0;
        surrogateContainer.style.height = 0;

        function setFalse(evt) {
          evt.returnValue = false;
        }
        surrogate.addEventListener("beforecopy", setFalse, false);
        surrogate.addEventListener("copy", clipboardOperation, false);
        surrogate.addEventListener("beforecut", setFalse, false);
        surrogate.addEventListener("cut", clipboardOperation, false);
        document.body.insertBefore(surrogateContainer, document.body.children[0]);

        window.addEventListener("beforepaste", setFalse, false);
        window.addEventListener("keydown", focusClipboard, true);
      }

      this.input.head.add(this.camera);

      return this.input.ready;
    });

    this._readyParts = [
      this.sky.ready,
      this.ground.ready,
      modelsReady,
      documentReady
    ];
    this.ready = Promise.all(this._readyParts)
      .then(() => {
        this.renderer.domElement.style.cursor = "default";
        if(this.options.enableShadows && this.sky.sun) {
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = PCFSoftShadowMap;
          this.sky.sun.castShadow = true;
          this.sky.sun.shadow.mapSize.width =
          this.sky.sun.shadow.mapSize.height = this.options.shadowMapSize;
          if(this.ground.material){
            this.ground.receiveShadow = true;
            this.ground.castShadow = true;
          }
        }

        this.input.VR.displays.forEach((display) => {
          if(display.DOMElement !== undefined) {
            display.DOMElement = this.renderer.domElement;
          }
        });

        if(this.options.fullScreenButtonContainer){
          this.insertFullScreenButtons(this.options.fullScreenButtonContainer);
        }

        this.input.VR.connect(0);

        pliny.event({
          parent: "Primrose.BrowserEnvironment",
          name: "ready",
          description: "Fires after the initial assets have been downloaded and the scene initialized, just before animation starts."
        });
        this.emit("ready");
        window.dispatchEvent(new CustomEvent("vrbrowserenvironmentready", {
          detail: this
        }));
      });


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "start",
      returns: "Promise",
      description: "Restart animation after it has been stopped."
    });
    this.start = () => {
      this.ready.then(() => {
        this.audio.start();
        lt = performance.now() * MILLISECONDS_TO_SECONDS;
        RAF(animate);
      });
    };


    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "stop",
      description: "Pause animation."
    });
    this.stop = () => {
      if (currentTimerObject) {
        currentTimerObject.cancelAnimationFrame(this.timer);
        this.audio.stop();
        this.timer = null;
      }
    };

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "quality",
      type: "Primrose.Constants.Quality",
      description: "The current render quality."
    });
    Object.defineProperties(this, {
      quality: {
        get: () => this.options.quality,
        set: (v) => {
          if (0 <= v && v < PIXEL_SCALES.length) {
            this.options.quality = v;
            resolutionScale = PIXEL_SCALES[v];
          }
          this.ready.then(modifyScreen);
        }
      }
    });

    this.quality = this.options.quality;

    if (window.alert.toString().indexOf("native code") > -1) {
      // overwrite the native alert functions so they can't be called while in
      // full screen VR mode.

      var rerouteDialog = (oldFunction, newFunction) => {
        if (!newFunction) {
          newFunction = function () {};
        }
        return (function () {
          if (this.input && this.input.VR && this.input.VR.isPresenting) {
            newFunction();
          }
          else {
            oldFunction.apply(window, arguments);
          }
        }).bind(this);
      };

      window.alert = rerouteDialog(window.alert);
      window.confirm = rerouteDialog(window.confirm);
      window.prompt = rerouteDialog(window.prompt);
    }

    this.start();
  }

  get lockMovement(){

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "lockMovement",
      type: "Boolean",
      description: "True if the user is focused on a text box control. If the user is focused on a text box control, keyboard commands should not move their position."
    });

    return this.currentControl && this.currentControl.lockMovement;
  }

  connect(socket, userName) {

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "connect",
      description: "Connect to a server at a WebSocket using a specific userName. NOTE: this does not handle authentication or authorization. You must handle those tasks yourself. This only binds an authenticated WebSocket connection to the framework so the framework may use it to transmit user state.",
      parameters: [{
        name: "socket",
        type: "WebSocket",
        description: "The socket connecting us to the server."
      }, {
        name: "userName",
        type: "String",
        description: "The name of the user being connected."
      }]
    });

    if(!this.network){
      this.network = new NetworkManager(this.input, this.audio, this.factories, this.options);
      this.network.addEventListener("addavatar", this.addAvatar);
      this.network.addEventListener("removeavatar", this.removeAvatar);
    }
    return this.network && this.network.connect(socket, userName);
  }

  disconnect() {

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "disconnect",
      description: "Disconnect from the server."
    });

    return this.network && this.network.disconnect();
  }

  get displays() {

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "displays",
      type: "Array of VRDisplay",
      description: "The VRDisplays available on the system."
    });

    return this.input.VR.displays;
  }

  get fieldOfView() {
    var d = this.input.VR.currentDevice,
      eyes = [
      d && d.getEyeParameters("left"),
      d && d.getEyeParameters("right")
    ].filter(identity);
    if(eyes.length > 0){
      return eyes.reduce((fov, eye) => Math.max(fov, eye.fieldOfView.upDegrees + eye.fieldOfView.downDegrees), 0);
    }
  }

  set fieldOfView(v){
    this.options.defaultFOV = StandardMonitorVRDisplay.DEFAULT_FOV = v;
  }

  get currentTime() {
    return this.audio.context.currentTime;
  }

  setAudioFromUser(userName, audioElement){

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "setAudioFromUser",
      description: "When using a 3D-party voice chat provider, this method associates the `HTMLVideoElement` or `HTMLAudioElement` created by the chat provider with the remote user, so that their audio may be spatialized with their position.",
      parameters: [{
        name: "userName",
        type: "String",
        description: "The name of the user to which to add the audio."
      }, {
        name: "audioElement",
        type: "HTMLAudioElement or HTMLVideoElement",
        description: "The DOM element that represents the user's audio."
      }]
    });

    this.audioQueue.push([userName, audioElement]);
    if(this.network){
      while(this.audioQueue.length > 0){
        this.network.setAudioFromUser.apply(this.network, this.audioQueue.shift());
      }
    }
  }

  insertFullScreenButtons(containerSpec){

    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "insertFullScreenButtons",
      description: "Add the default UI for managing full screen state.",
      returns: "Array of `HTMLButtonElement`s",
      parameters: [{
        name: "containerSpec",
        type: "String",
        description: "A query selector for the DOM element to which to add the buttons."
      }]
    });

    const container = document.querySelector(containerSpec);
    const newButton = (title, text, thunk) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.title = title;
      btn.appendChild(document.createTextNode(text));
      btn.addEventListener("click", thunk, false);
      container.appendChild(btn);
      return btn;
    };

    const buttons = this.displays
      // We skip the Standard Monitor and Magic Window on iOS because we can't go full screen on those systems.
      .map((display, i) => {
        if(!isiOS || VR.isStereoDisplay(display)) {
          const enterVR = this.goFullScreen.bind(this, i),
            btn = newButton(display.displayName, display.displayName, enterVR),
            isStereo = VR.isStereoDisplay(display);
          btn.className = isStereo ? "stereo" : "mono";
          return btn;
        }
      })
      .filter(identity);

    if(!/(www\.)?primrosevr.com/.test(document.location.hostname) && !this.options.disableAdvertising) {
      buttons.push(newButton("Primrose", "✿", () => open("https://www.primrosevr.com", "_blank")));
    }
    return buttons;
  }
}

BrowserEnvironment.DEFAULTS = {
  antialias: true,
  quality: Quality.MAXIMUM,
  useGaze: false,
  useFog: false,
  avatarHeight: 1.65,
  walkSpeed: 2,
  disableKeyboard: false,
  enableShadows: false,
  shadowMapSize: 1024,
  progress: null,
  // The acceleration applied to falling objects.
  gravity: 9.8,
  // The amount of time in seconds to require gazes on objects before triggering the gaze event.
  gazeLength: 1.5,
  // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
  disableMirroring: false,
  // By default, a single light is added to the scene,
  disableDefaultLighting: false,
  // The color that WebGL clears the background with before drawing.
  backgroundColor: 0xafbfff,
  // the textures to use for the sky and ground
  skyTexture: null,
  groundTexture: null,
  // the near plane of the camera.
  nearPlane: 0.01,
  // the far plane of the camera.
  drawDistance: 100,
  // the field of view to use in non-VR settings.
  defaultFOV: 55,
  // The sound to play on loop in the background.
  ambientSound: null,
  // HTML5 canvas element, if one had already been created.
  canvasElement: "frontBuffer",
  // Three.js renderer, if one had already been created.
  renderer: null,
  // A WebGL context to use, if one had already been created.
  context: null,
  // Three.js scene, if one had already been created.
  scene: null,
  // This is an experimental feature for setting the height of a user's "neck" on orientation-only systems (such as Google Cardboard and Samsung Gear VR) to create a more realistic feel.
  nonstandardNeckLength: null,
  nonstandardNeckDepth: null,
  showHeadPointer: true,
  // WARNING: I highly suggest you don't go down the road that requires the following settings this. I will not help you understand what they do, because I would rather you just not use them.
  eyeRenderOrder: ["left", "right"],
  nonstandardIPD: null,
  disableAdvertising: false
};