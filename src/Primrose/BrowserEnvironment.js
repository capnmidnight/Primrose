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
    name: "nonstandardIPD",
    type: "Number",
    optional: true,
    description: "When creating a neck model, this is the how far apart to set the eyes. I highly suggest you don't go down the road that requires setting this. I will not help you understand what it does, because I would rather you just not use it."
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
  }]
});

const MILLISECONDS_TO_SECONDS = 0.001,
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  TELEPORT_COOLDOWN = 250,
  TELEPORT_DISPLACEMENT = new Vector3(),
  GROUND_HEIGHT = -0.07;

import PointerLock from "webvr-standard-monitor/src/PointerLock";
import isMobile from "../flags/isMobile";
import box from "../live-api/box";
import brick from "../live-api/brick";
import colored from "../live-api/colored";
import hub from "../live-api/hub";
import light from "../live-api/light";
import put from "../live-api/put";
import Angle from "./Angle";
import AbstractEventEmitter from "./AbstractEventEmitter";
import Pointer from "./Pointer";
import Keys from "./Keys";
import Text2Speech from "./Audio/Speech";
import Audio3D from "./Audio/Audio3D";
import Music from "./Audio/Music";
import Entity from "./Controls/Entity";
import Button2D from "./Controls/Button2D";
import Button3D from "./Controls/Button3D";
import ButtonFactory from "./Controls/ButtonFactory";
import Image from "./Controls/Image";
import Surface from "./Controls/Surface";
import cascadeElement from "./DOM/cascadeElement";
import makeHidingContainer from "./DOM/makeHidingContainer";
import ModelLoader from "./Graphics/ModelLoader";
import FPSInput from "./Input/FPSInput";
import VR from "./Input/VR";
import NetworkManager from "./Network/Manager";
import TextBox from "./Text/Controls/TextBox";
import PlainText from "./Text/Grammars/PlainText";
import { Quality, PIXEL_SCALES } from "./Constants";
import { BackSide, PCFSoftShadowMap } from "three/src/constants";
import { FogExp2 } from "three/src/scenes/FogExp2";
import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { AmbientLight } from "three/src/lights/AmbientLight";
import { TextGeometry } from "three/src/geometries/TextGeometry";
import { Quaternion } from "three/src/math/Quaternion";
import { Color } from "three/src/math/Color";
import { Euler } from "three/src/math/Euler";
import { Vector3 } from "three/src/math/Vector3";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
export default class BrowserEnvironment extends AbstractEventEmitter {
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
      movePlayer(dt);
      moveUI();
      doPicking();
      moveGround();
      if(this.network){
        this.network.update(dt);
      }

      this.emit("update", dt);
    };

    const movePlayer = (dt) => {
      this.input.update(dt);
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

    const doPicking = () => {
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
        this.sky.position.set(
          this.input.head.position.x,
          0,
          this.input.head.position.z);
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
      if (this.input.VR.isPresenting) {
        this.renderer.clear(true, true, true);

        var trans = this.input.VR.getTransforms(
          this.options.nearPlane,
          this.options.nearPlane + this.options.drawDistance);
        for (var i = 0; trans && i < trans.length; ++i) {
          var st = trans[i],
            v = st.viewport,
            side = (2 * i) - 1;
          if(this.options.nonstandardIPD !== null){
            st.translation.x = Math.sign(st.translation.x) * this.options.nonstandardIPD;
          }
          if(this.options.nonstandardNeckLength !== null){
            st.translation.y = this.options.nonstandardNeckLength;
          }
          if(this.options.nonstandardNeckDepth !== null){
            st.translation.z = this.options.nonstandardNeckDepth;
          }
          Entity.eyeBlankAll(i);
          this.camera.projectionMatrix.copy(st.projection);
          this.camera.translateOnAxis(st.translation, 1);
          this.renderer.setViewport(
            v.left * resolutionScale,
            v.top * resolutionScale,
            v.width * resolutionScale,
            v.height * resolutionScale);
          this.renderer.render(this.scene, this.camera);
          this.camera.translateOnAxis(st.translation, -1);
        }
        this.input.submitFrame();
      }

      if (!this.input.VR.isPresenting || (this.input.VR.canMirror && !this.options.disableMirroring)) {
        this.camera.fov = this.options.defaultFOV;
        this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
        this.camera.updateProjectionMatrix();
        this.renderer.clear(true, true, true);
        if(this.input.mousePointer.unproject){
          this.input.mousePointer.unproject.getInverse(this.camera.projectionMatrix);
        }
        this.renderer.setViewport(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
        this.renderer.render(this.scene, this.camera);
      }
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

        this.input.Mouse.commands.U.scale = 2/canvasWidth;
        this.input.Mouse.commands.V.scale = 2/canvasHeight;

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

    var modelsReady = ModelLoader.loadObjects(modelFiles)
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
          this.factories.avatar = new ModelLoader(models.avatar);
        }

        if (models.button) {
          this.buttonFactory = new ButtonFactory(
            models.button,
            this.options.button.options);
        }
        else {
          this.buttonFactory = new ButtonFactory(
            colored(box(1, 1, 1), 0xff0000), {
              maxThrow: 0.1,
              minDeflection: 10,
              colorUnpressed: 0x7f0000,
              colorPressed: 0x007f00,
              toggle: true
            });
        }
      })
      .catch((err) => {
        console.error(err);
        if (!this.buttonFactory) {
          this.buttonFactory = new ButtonFactory(
            colored(box(1, 1, 1), 0xff0000), {
              maxThrow: 0.1,
              minDeflection: 10,
              colorUnpressed: 0x7f0000,
              colorPressed: 0x007f00,
              toggle: true
            });
        }
      });

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
    this.registerPickableObject = this.pickableObjects.push.bind(this.pickableObjects);

    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "currentControl",
      type: "Primrose.Control.BaseControl",
      description: "The currently selected control, by a user-click or some other function."
    });
    this.currentControl = null;


    pliny.property({
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


    pliny.property({
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

    this.teleport = (pos, immediate) => this.transition(
      () => this.input.moveStage(pos),
      () => this.teleportAvailable && TELEPORT_DISPLACEMENT.copy(pos)
        .sub(this.input.head.position)
        .length() > 0.2,
      immediate);

    const POSITION = new Vector3(),
      START_POINT = new Vector3();

    this.selectControl = (evt) => {
      const hit = evt.hit,
        obj = hit && hit.object;

      if(this.ground && obj === this.ground) {
        if(evt.type === "exit"){
          evt.pointer.disk.visible = false;
        }
        else if(evt.type !== "exit") {
          POSITION.copy(evt.hit.point)
            .sub(this.input.head.position);

          var distSq = POSITION.x * POSITION.x + POSITION.z * POSITION.z;
          if (distSq > MAX_MOVE_DISTANCE_SQ) {
            var dist = Math.sqrt(distSq),
              factor = MAX_MOVE_DISTANCE / dist,
              y = POSITION.y;
            POSITION.y = 0;
            POSITION.multiplyScalar(factor);
            POSITION.y = y;
          }

          POSITION.add(this.input.head.position);

          if(evt.type === "enter") {
            evt.pointer.disk.visible = true;
          }
          else if(evt.type === "pointerstart" || evt.type === "gazestart") {
            START_POINT.copy(POSITION);
          }
          else if(evt.type === "pointermove" || evt.type === "gazemove"){
            evt.pointer.moveTeleportPad(POSITION);
          }
          else if(evt.type === "pointerend" || evt.type === "gazecomplete") {
            START_POINT.sub(POSITION);
            const len = START_POINT.lengthSq();
            if(len < 0.01){
              this.teleport(POSITION);
            }
          }
        }
      }

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

    this.options.scene = this.scene = this.options.scene || new Scene();
    if (this.options.useFog) {
      this.scene.fog = new FogExp2(this.options.backgroundColor, 1 / Math.sqrt(this.options.drawDistance));
    }

    this.camera = new PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);

    let skyReady = null;
    if (this.options.skyTexture !== null) {
      skyReady = new Promise((resolve, reject) => {
        const skyFunc = (typeof this.options.skyTexture === "number") ? colored : textured;

        let skyGeom = null;
        if(typeof this.options.skyTexture === "string"){
          skyGeom = sphere(this.options.drawDistance, 18, 9);
        }
        else {
          const skyDim = this.options.drawDistance / Math.sqrt(2);
          skyGeom = box(skyDim, skyDim, skyDim);
        }

        this.sky = skyFunc(skyGeom, this.options.skyTexture, {
          side: BackSide,
          fog: false,
          unshaded: true,
          transparent: true,
          opacity: 1,
          resolve: resolve,
          progress: this.options.progress
        });
      });
    }
    else {
      this.sky = hub();
      skyReady = Promise.resolve();
    }

    skyReady = skyReady.then(() => {
      this.sky.name = "Sky";
      this.scene.add(this.sky);


      if(!this.options.disableDefaultLighting) {
        this.ambient = new AmbientLight(0xffffff, 0.5);
        this.sky.add(this.ambient);

        this.sun = light(0xffffff, 1, 50);
        put(this.sun)
          .on(this.sky)
          .at(0, 10, 10);
      }
    });

    let groundReady = null;
    if (this.options.groundTexture !== null) {
      groundReady = new Promise((resolve, reject) => {
        const dim = 2 * this.options.drawDistance;
        this.ground = brick(this.options.groundTexture, dim * 5, 0.1, dim * 5, {
          txtRepeatS: dim * 5,
          txtRepeatT: dim * 5,
          anisotropy: 8,
          resolve: resolve,
          progress: this.options.progress
        });
        this.registerPickableObject(this.ground);
      });
    }
    else{
      this.ground = hub();
      groundReady = Promise.resolve();
    }

    groundReady = groundReady.then(() => {
      this.ground.name = "Ground";
      this.scene.add(this.ground);
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

    //
    // Manage full-screen state
    //
    this.goFullScreen = (index, evt) => {
      if (evt !== "Gaze") {
        const elem = !this.input.VR.isStereo || isMobile && !this.input.VR.isNativeMobileWebVR ?
              this.options.fullScreenElement :
              this.renderer.domElement;
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
        fog: false,
        transparent: true,
        unshaded: true,
        side: BackSide
      });
      this.fader.visible = false;
      this.input.head.root.add(this.fader);

      Pointer.EVENTS.forEach((evt) => this.input.addEventListener(evt, this.selectControl.bind(this), false));
      this.input.forward(this, Pointer.EVENTS);

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
            this.emit("keydown", evt);
          },

          keyUp = (evt) => {
            if(!this.lockMovement){
              this.input.Keyboard.dispatchEvent(evt);
            }
            else if(this.currentControl){
              this.currentControl.keyUp(evt);
            }
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

      return this.input.ready.then(() => {
        if(this.options.fullScreenButtonContainer){
          this.insertFullScreenButtons(this.options.fullScreenButtonContainer);
        }
      });
    });

    var allReady = Promise.all([
        skyReady,
        groundReady,
        modelsReady,
        documentReady
      ])
      .then(() => {
        this.renderer.domElement.style.cursor = "default";
        if(this.options.enableShadows && this.sun) {
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = PCFSoftShadowMap;
          this.sun.castShadow = true;
          this.sun.shadow.mapSize.width =
          this.sun.shadow.mapSize.height = this.options.shadowMapSize;
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
        this.input.VR.connect(0);
        this.emit("ready");
        window.dispatchEvent(new CustomEvent("vrbrowserenvironmentready", {
          detail: this
        }));
      });

    this.start = () => {
      allReady
        .then(() => {
          this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          RAF(animate);
        });
    };

    this.stop = () => {
      if (currentTimerObject) {
        currentTimerObject.cancelAnimationFrame(this.timer);
        this.audio.stop();
        this.timer = null;
      }
    };

    Object.defineProperties(this, {
      quality: {
        get: () => this.options.quality,
        set: (v) => {
          if (0 <= v && v < PIXEL_SCALES.length) {
            this.options.quality = v;
            resolutionScale = PIXEL_SCALES[v];
          }
          allReady.then(modifyScreen);
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
        return () => {
          if (this.input.VR.isPresenting) {
            newFunction();
          }
          else {
            oldFunction.apply(window, arguments);
          }
        };
      };

      window.alert = rerouteDialog(window.alert);
      window.confirm = rerouteDialog(window.confirm);
      window.prompt = rerouteDialog(window.prompt);
    }

    this.start();
  }

  get lockMovement(){
    return this.currentControl && this.currentControl.lockMovement;
  }

  connect(socket, userName) {
    if(!this.network){
      this.network = new NetworkManager(this.input, this.audio, this.factories, this.options);
      this.network.addEventListener("addavatar", this.addAvatar);
      this.network.addEventListener("removeavatar", this.removeAvatar);
    }
    return this.network && this.network.connect(socket, userName);
  }

  disconnect() {
    return this.network && this.network.disconnect();
  }

  get displays() {
    return this.input.VR.displays;
  }

  setAudioFromUser(userName, audioElement){
    this.audioQueue.push([userName, audioElement]);
    if(this.network){
      while(this.audioQueue.length > 0){
        this.network.setAudioFromUser.apply(this.network, this.audioQueue.shift());
      }
    }
  }

  insertFullScreenButtons(containerSpec){
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

    const buttons = this.displays.map((display, i) => {
      const enterVR = this.goFullScreen.bind(this, i),
        btn = newButton(display.displayName, display.displayName, enterVR),
        isStereo = VR.isStereoDisplay(display);
      btn.className = isStereo ? "stereo" : "mono";
      return btn;
    });

    buttons.push(newButton("Primrose", "Primrose", () => document.location = "https://www.primrosevr.com"));
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
  defaultFOV: 75,
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
  // I highly suggest you don't go down the road that requires setting this. I will not help you understand what it does, because I would rather you just not use it.
  nonstandardIPD: null,
  // This is an experimental feature for setting the height of a user's "neck" on orientation-only systems (such as Google Cardboard and Samsung Gear VR) to create a more realistic feel.
  nonstandardNeckLength: null,
  nonstandardNeckDepth: null,
  showHeadPointer: true
};