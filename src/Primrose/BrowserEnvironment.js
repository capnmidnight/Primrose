/// NOTE: maybe BrowserEnvironment should be a subclass of THREE.Scene.


/*
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
*/

/*
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
    type: "Boolean",
    optional: true,
    description: "Set to true to enable the use of shadows on objects in the scene."
  }, {
    name: "shadowMapSize",
    type: "Number",
    optional: true,
    default: 1024,
    description: "The size to use for the width and height of the shadow map that will be generated."
  }, {
    name: "shadowRadius",
    type: "Number",
    optional: true,
    default: 1,
    description: "The number of pixels of blurring to perform at the edge of the shadows."
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
    name: "disableMotion",
    type: "Boolean",
    optional: true,
    description: "By default, mobile devices have a motion sensor that can be used to update the view. Set to true to disable motion tracking."
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
    name: "groundModel",
    type: "String",
    optional: true,
    description: "A model file to use for the ground."
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
  }]
});
*/

import { isCardboard, isiOS, isLandscape } from "../flags";

import { box, hub } from "../live-api";

import { FullScreen, PointerLock, identity, Angle } from "../util";

import Pointer from "./Pointer";
import Keys from "./Keys";

import Text2Speech from "./Audio/Speech";
import Audio3D from "./Audio/Audio3D";
import Music from "./Audio/Music";

import { updateAll, eyeBlankAll } from "./Controls/BaseTextured";
import Button3D from "./Controls/Button3D";
import ButtonFactory from "./Controls/ButtonFactory";
import { preStepAllEntities, postStepAllEntities, updateAllEntities } from "./Controls/Entity";
import Ground from "./Controls/Ground";
import Sky from "./Controls/Sky";
import Image from "./Controls/Image";

import StandardMonitorVRDisplay from "./Displays/StandardMonitorVRDisplay";

import cascadeElement from "./DOM/cascadeElement";
import makeHidingContainer from "./DOM/makeHidingContainer";

import ModelFactory from "./Graphics/ModelFactory";

import Keyboard from "./Input/Keyboard";
import Mouse from "./Input/Mouse";
import Gamepad from "./Input/Gamepad";
import GamepadManager from "./Input/GamepadManager";
import Touch from "./Input/Touch";
import VR from "./Input/VR";

import NetworkManager from "./Network/Manager";

import Teleporter from "./Tools/Teleporter";

import { Quality, PIXEL_SCALES } from "./constants";

import {
  EventDispatcher,
  BackSide,
  PCFSoftShadowMap,
  FogExp2,
  Scene,
  PerspectiveCamera,
  TextGeometry,
  Quaternion,
  Color,
  Euler,
  Vector3,
  Matrix4,
  WebGLRenderer
} from "three";

import CANNON from "cannon";


const MILLISECONDS_TO_SECONDS = 0.001,
  TELEPORT_DISPLACEMENT = new Vector3(),
  DISPLACEMENT = new Vector3(),
  EULER_TEMP = new Euler(),
  QUAT_TEMP = new Quaternion(),
  WEDGE = Math.PI / 3;

export default class BrowserEnvironment extends EventDispatcher {
  constructor(options) {
    super();

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "options",
      type: "Object",
      description: "A manager for messages sent across the network."
    });
    */
    this.options = Object.assign({}, BrowserEnvironment.DEFAULTS, options);

    this.options.foregroundColor = this.options.foregroundColor || complementColor(new Color(this.options.backgroundColor))
      .getHex();

    this.deltaTime = 1;

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "network",
      type: "Primrose.Network.Manager",
      description: "A manager for messages sent across the network."
    });
    */
    this.network = null;

    if(this.options.nonstandardIPD !== null){
      this.options.nonstandardIPD *= 0.5;
    }

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "audioQueue",
      type: "Array",
      description: "Remote user Audio elements that joined as peers before the `BrowserEnvironment` could finish loading all of the assets."
    });
    */
    this.audioQueue = [];


    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "zero",
      description: "Zero and reset sensor data."
    });
    */
    this.zero = () => {
      if (!this.lockMovement) {
        for (let i = 0; i < this.managers.length; ++i) {
          this.managers[i].zero();
        }
        if (this.quality === Quality.NONE) {
          this.quality = Quality.HIGH;
        }
      }
    };

    let wasLandscape = isLandscape();
    function iOSOrientationHack() {
      if(isiOS) {
        const nowLandscape = isLandscape();
        if(nowLandscape != wasLandscape) {
          wasLandscape = nowLandscape;
          window.dispatchEvent(new Event("resize"));
        }
      }
    }

    let missedFrames = 0,
      accumTime = 0;

    const update = (dt) => {

      iOSOrientationHack();

      for(let i = 0; i < this.scene.children.length; ++i) {
        const child = this.scene.children[i];
        if(child.rigidBody && !child.rigidBody.world) {
          this.physics.addBody(child.rigidBody);
        }
      }

      dt = Math.min(1, dt * MILLISECONDS_TO_SECONDS);
      if(dt > 0) {
        accumTime += dt;
        const fps = Math.max(1, Math.round(1 / dt));
        this.deltaTime = Math.min(this.deltaTime, 1 / fps);


        // if we missed way too many frames in one go, just update once, otherwise we'll end up locking up the system.
        let numFrames = accumTime / this.deltaTime;
        missedFrames += numFrames - 1;
        if(numFrames > 10) {
          numFrames = 1;
          accumTime = this.deltaTime;
        }


        if(missedFrames > 0) {
          if(missedFrames >= 10 && dt < 1) {
            this.deltaTime = dt;
            missedFrames = 0;
          }
          if(numFrames === 1) {
            missedFrames -= 0.1;
          }
        }

        updateFade(dt);

        for(let frame = 0; frame < numFrames; ++frame) {

          accumTime -= this.deltaTime;

          const hadGamepad = this.hasGamepad;
          if(this.gamepadMgr) {
            this.gamepadMgr.poll();
          }

          for (let i = 0; i < this.managers.length; ++i) {
            this.managers[i].update(dt);
          }

          if (!hadGamepad && this.hasGamepad) {
            this.Mouse.inPhysicalUse = false;
          }

          this.head.showPointer = this.VR.hasOrientation && this.VR.isStereo && this.options.showHeadPointer;
          this.mousePointer.visible = (this.VR.isPresenting || !this.VR.isStereo) && !this.hasTouch;
          this.mousePointer.showPointer = !this.hasMotionControllers && !this.VR.isStereo;

          let heading = 0,
            pitch = 0,
            strafe = 0,
            drive = 0;
          for (let i = 0; i < this.managers.length; ++i) {
            const mgr = this.managers[i];
            if(mgr.enabled){
              if(mgr.name !== "Mouse"){
                heading += mgr.getValue("heading");
              }
              pitch += mgr.getValue("pitch");
              strafe += mgr.getValue("strafe");
              drive += mgr.getValue("drive");
            }
          }

          if(this.hasMouse) {
            let mouseHeading = null;
            if (this.VR.hasOrientation) {
              mouseHeading = this.mousePointer.rotation.y;
              const newMouseHeading = WEDGE * Math.floor((mouseHeading / WEDGE) + 0.5);
              let offset = this.Mouse.commands.U.offset;
              if(newMouseHeading !== 0){
                offset += 1 - this.Mouse.getValue("U");
                this.Mouse.setOffset(offset);
              }
              mouseHeading = newMouseHeading + offset * 2;
            }
            else{
              mouseHeading = this.Mouse.getValue("heading");
            }
            heading += mouseHeading;
          }

          if (this.VR.hasOrientation) {
            pitch = 0;
          }

          // move stage according to heading and thrust
          EULER_TEMP.set(pitch, heading, 0, "YXZ");
          this.stage.quaternion.setFromEuler(EULER_TEMP);

          // update the stage's velocity
          this.velocity.set(strafe, 0, drive);

          QUAT_TEMP.copy(this.head.quaternion);
          EULER_TEMP.setFromQuaternion(QUAT_TEMP);
          EULER_TEMP.x = 0;
          EULER_TEMP.z = 0;
          QUAT_TEMP.setFromEuler(EULER_TEMP);

          this.moveStage(DISPLACEMENT
            .copy(this.velocity)
            .multiplyScalar(dt)
            .applyQuaternion(QUAT_TEMP)
            .add(this.head.position));

          this.stage.position.y = this.ground.getHeightAt(this.stage.position) || 0;
          this.stage.position.y += this.options.avatarHeight;
          for (let i = 0; i < this.motionDevices.length; ++i) {
            this.motionDevices[i].posePosition.y -= this.options.avatarHeight;
          }

          // update the motionDevices
          this.stage.updateMatrix();
          this.matrix.multiplyMatrices(this.stage.matrix, this.VR.stage.matrix);
          for (let i = 0; i < this.motionDevices.length; ++i) {
            this.motionDevices[i].updateStage(this.matrix);
          }

          for (let i = 0; i < this.pointers.length; ++i) {
            this.pointers[i].update();
          }

          // record the position and orientation of the user
          this.newState = [];
          this.head.updateMatrix();
          this.stage.rotation.x = 0;
          this.stage.rotation.z = 0;
          this.stage.quaternion.setFromEuler(this.stage.rotation);
          this.stage.updateMatrix();
          this.head.position.toArray(this.newState, 0);
          this.head.quaternion.toArray(this.newState, 3);

          if(frame === 0) {
            updateAll();
            let userActionHandlers = null;
            for (let i = 0; i < this.pointers.length; ++i) {
              userActionHandlers = this.pointers[i].resolvePicking(this.scene);
            }
            for (let i = 0; i < this.managers.length; ++i) {
              this.managers[i].userActionHandlers = userActionHandlers;
            }
            this.ground.moveTo(this.head.position);
            this.sky.position.copy(this.head.position);
            moveUI();
          }

          /*
          pliny.event({
            parent: "Primrose.BrowserEnvironment",
            name: "update",
            description: "Fires after every animation update."
          });
          */
          try {
            this.emit("update");
          }
          catch(exp){
            // don't let user script kill the runtime
            console.error("User update errored", exp);
          }

          if(frame === 0 && this.network){
            this.network.update(dt);
          }
        }

        this.physics.step(this.deltaTime, dt);

        updateAllEntities();
      }
    };

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "turns",
      type: "Util.Angle",
      description: "A slewing angle that loosely follows the user around."
    });
    */
    this.turns = new Angle(0);
    const followEuler = new Euler(),
      maxX = -Math.PI / 4,
      maxY = Math.PI / 6;

    const moveUI = (dt) => {
      var y = this.vicinity.position.y,
        p = this.options.vicinityFollowRate,
        q = 1 - p;
      this.vicinity.position.lerp(this.head.position, p);
      this.vicinity.position.y = y;

      followEuler.setFromQuaternion(this.head.quaternion);
      this.turns.radians = followEuler.y;
      followEuler.set(maxX, this.turns.radians, 0, "YXZ");
      this.ui.quaternion.setFromEuler(followEuler)
      this.ui.position.y = this.ui.position.y * q + this.head.position.y * p;
    };

    var animate = (t) => {
      var dt = t - lt,
        i, j;
      lt = t;
      update(dt);
      this.audio.setPlayer(this.head.mesh);
      render();
    };

    var render = () => {
      this.camera.position.set(0, 0, 0);
      this.camera.quaternion.set(0, 0, 0, 1);
      this.renderer.clear(true, true, true);

      var trans = this.VR.getTransforms(
        this.options.nearPlane,
        this.options.nearPlane + this.options.drawDistance);
      for (var i = 0; trans && i < trans.length; ++i) {
        eyeBlankAll(i);

        var st = trans[i],
          v = st.viewport;

        this.renderer.setViewport(
          v.left * resolutionScale,
          0,
          v.width * resolutionScale,
          v.height * resolutionScale);

        this.camera.projectionMatrix.fromArray(st.projection);
        if (this.mousePointer.unproject) {
          this.mousePointer.unproject.getInverse(this.camera.projectionMatrix);
        }
        this.camera.matrixWorld.fromArray(st.view);
        this.renderer.render(this.scene, this.camera);
      }
      this.VR.submitFrame();
    };

    const modifyScreen = () => {
      var near = this.options.nearPlane,
        far = near + this.options.drawDistance,
        p = this.VR && this.VR.getTransforms(near, far);

      if (p) {
        var canvasWidth = 0,
          canvasHeight = 0;

        for (var i = 0; i < p.length; ++i) {
          canvasWidth += p[i].viewport.width;
          canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
        }

        this.mousePointer.setSize(canvasWidth, canvasHeight);

        const styleWidth = canvasWidth / devicePixelRatio,
          styleHeight = canvasHeight / devicePixelRatio;
        canvasWidth = Math.floor(canvasWidth * resolutionScale);
        canvasHeight = Math.floor(canvasHeight * resolutionScale);

        this.renderer.domElement.width = canvasWidth;
        this.renderer.domElement.height = canvasHeight;
        this.renderer.domElement.style.width = styleWidth + "px";
        this.renderer.domElement.style.height = styleHeight + "px";
        if (!this.VR.currentDevice.isAnimating) {
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

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "factories",
      type: "Object",
      description: "A database of object factories, generally used to create 3D models."
    });
    */
    this.factories = {
      avatar: null
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

    var modelsReady = ModelFactory.loadObjects(modelFiles, this.options.progress.thunk)
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

        /*
        pliny.property({
          parent: "Primrose.BrowserEnvironment",
          name: "buttonFactory",
          type: "Primrose.Controls.ButtonFactory",
          description: "A factory for creating the geometry for individual 3D buttons whenever they are needed."
        })
*/
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

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "speech",
      type: "Primrose.Audio.Speech",
      description: "A text-2-speech system."
    });
    */
    this.speech = new Text2Speech(this.options.speech);

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "audio",
      type: "Primrose.Audio.Audio3D",
      description: "An audio graph that keeps track of 3D information."
    });
    */
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

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "music",
      type: "Primrose.Audio.Music",
      description: "A primitive sort of synthesizer for making simple music."
    });
    */
    this.music = new Music(this.audio);

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "currentControl",
      type: "Primrose.Control.Entity",
      description: "The currently selected control, by a user-click or some other function."
    });
    */
    this.currentControl = null;


    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "fadeOut",
      returns: "Promise",
      description: "Causes the fully rendered view fade out to the color provided `options.backgroundColor`"
    });
    */
    let fadeOutPromise = null,
      fadeOutPromiseResolver = null,
      fadeInPromise = null,
      fadeInPromiseResolver = null;
    this.fadeOut = () => {
      if(fadeInPromise) {
        return Promise.reject("Currently fading in.");
      }
      if(!fadeOutPromise) {
        this.fader.visible = true;
        this.fader.material.opacity = 0;
        this.fader.material.needsUpdate = true;
        fadeOutPromise = new Promise((resolve, reject) =>
          fadeOutPromiseResolver = (obj) => {
            fadeOutPromise = null;
            fadeOutPromiseResolver = null;
            resolve(obj);
          });
      }
      return fadeOutPromise;
    };


    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "fadeIn",
      returns: "Promise",
      description: "Causes the faded out cube to disappear."
    });
    */
    this.fadeIn = () => {
      if(fadeOutPromise) {
        return Promise.reject("Currently fading out.");
      }
      if(!fadeInPromise){
        fadeInPromise = new Promise((resolve, reject) =>
          fadeInPromiseResolver = (obj) => {
            fadeInPromise = null;
            fadeInPromiseResolver = null;
            this.fader.visible = false;
            resolve(obj);
          });
      }
      return fadeInPromise;
    };

    const updateFade = (dt) => {
      if(fadeOutPromise || fadeInPromise) {
        const m = this.fader.material,
          f = this.options.fadeRate * dt;
        m.needsUpdate = true;
        if(fadeOutPromise) {
          m.opacity += f;
          if(1 <= m.opacity){
            m.opacity = 1;
            fadeOutPromiseResolver();
          }
        }
        else {
          m.opacity -= f;
          if(m.opacity <= 0){
            m.opacity = 0;
            fadeInPromiseResolver();
          }
        }
      }
    };

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "teleportAvailable",
      type: "Boolean",
      description: "Returns true when the system is not currently fading out or in.`"
    });
    */
    this.teleportAvailable = true;

    /*
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
    */
    this.transition = (thunk, check, immediate) => {
      if(immediate) {
        thunk();
        return Promise.resolve();
      }
      else if(!check || check()){
        return this.fadeOut()
          .then(thunk)
          .then(this.fadeIn)
          .catch(console.warn.bind(console, "Error transitioning"));
      }
    };


    /*
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
    */
    this.teleport = (pos, immediate) => this.transition(
      () => this.moveStage(pos),
      () => this.teleportAvailable && TELEPORT_DISPLACEMENT.copy(pos)
        .sub(this.head.position)
        .length() > 0.2,
      immediate);

    const delesectControl = () => {
      if(this.currentControl) {
        this.currentControl.removeEventListener("blur", delesectControl);
        this.Keyboard.enabled = true;
        this.Mouse.enable("pitch", !this.VR.isPresenting);
        this.Mouse.enable("headin", !this.VR.isPresenting);
        this.currentControl.blur();
        this.currentControl = null;
      }
    };

    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "consumeEvent",
      description: "Handles pointer interactions and differentiates between teleportation and selecting controls on the screen.",
      parameters: [{
        name: "evt",
        type: "Event",
        description: "A pointer click event that triggered."
      }]
    });
    */
    this.consumeEvent = (evt) => {
      const obj = evt.hit && evt.hit.object,
        cancel = evt.type === "exit" || evt.cmdName === "NORMAL_ESCAPE";

      if(evt.type === "select" || cancel) {

        if(obj !== this.currentControl || cancel){

          delesectControl();

          if(!cancel && obj.isSurface){
            this.currentControl = obj;
            this.currentControl.focus();
            this.currentControl.addEventListener("blur", delesectControl);
            if(this.currentControl.lockMovement) {
              this.Keyboard.enabled = false;
              this.Mouse.enable("pitch", this.VR.isPresenting);
              this.Mouse.enable("heading", this.VR.isPresenting);
            }
          }
        }
      }

      if(obj) {
        obj.dispatchEvent(evt);
      }
      else if(this.currentControl){
        this.currentControl.dispatchEvent(evt);
      }

      this.dispatchEvent(evt);
    };

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "physics",
      type: "CANNON.World",
      description: "The physics subsystem."
    });
    */
    this.physics = new CANNON.World();
    this.physics.gravity.set(0, this.options.gravity, 0);
    this.physics.broadphase = new CANNON.NaiveBroadphase();
    this.physics.solver.iterations = 10;
    this.physics.addEventListener("preStep", preStepAllEntities);
    this.physics.addEventListener("postStep", postStepAllEntities);


    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "scene",
      type: "THREE.Scene",
      description: "The 3D scene that gets displayed to the user."
    });
    */
    this.options.scene = this.scene = this.options.scene || new Scene();

    if (this.options.useFog) {
      this.scene.fog = new FogExp2(this.options.backgroundColor, 1 / Math.sqrt(this.options.drawDistance));
    }

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "camera",
      type: "THREE.PerspectiveCamera",
      description: "The camera used to render the view."
    });
    */
    this.camera = new PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "sky",
      type: "THREE.Object3D",
      description: "If a `skyTexture` option is provided, it will be a texture cube or photosphere. If no `skyTexture` option is provided, there will only be a THREE.Object3D, to create an anchor point on which implementing scripts can add objects that follow the user's position."
    });
    */
    this.sky = new Sky(this.options)
      .addTo(this.scene);


    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "ground",
      type: "THREE.Object3D",
      description: "If a `groundTexture` option is provided, it will be a flat plane extending to infinity. As the user moves, the ground will shift under them by whole texture repeats, making the ground look infinite."
    });
    */
    this.ground = new Ground(this.options)
      .addTo(this.scene);

    this.teleporter = new Teleporter(this);


    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "ui",
      type: "THREE.Object3D",
      description: "An anchor point on which objects can be added that follows the user around in both position and orientation. The orientation lags following the user, so if the UI is ever in the way, the user can turn slightly and it won't follow them."
    });
    */
    this.vicinity = hub().named("Vicinity").addTo(this.scene);
    this.ui = hub().named("UI").addTo(this.vicinity);

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
            obj.textured(obj.material.map, {
              unshaded: true
            });
          }
          else{
            obj.colored(obj.material.color.getHex(), {
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

    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "goFullScreen",
      returns: "Promise",
      description: "Enter full-screen mode on one of the available displays. NOTE: due to a defect in iOS, this feature is not available on iPhones or iPads."
    });
    */
    this.goFullScreen = (index, evt) => {
      if (evt !== "Gaze") {

        this.VR.connect(index);

        let elem = null;
        if(evt === "force" || this.VR.canMirror || !this.VR.isPolyfilled) {
          elem = this.renderer.domElement;
        }
        else{
          elem = this.options.fullScreenElement;
        }

        return this.VR.requestPresent([{
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
      if(PointerLock.isActive) {
        this.Mouse.removeButton("dx", 0);
        this.Mouse.removeButton("dy", 0);
      }
      else {
        this.Mouse.addButton("dx", 0);
        this.Mouse.addButton("dy", 0);
        if (this.VR.isPresenting) {
          this.cancelVR();
        }
      }
    });

    const fullScreenChange = (evt) => {
      const presenting = this.VR.isPresenting,
        lockMouse = !presenting || this.VR.isStereo,
        scale = presenting ? -1 : 1;
      this.Mouse.enable("U", lockMouse);
      this.Mouse.enable("V", lockMouse);
      this.Mouse.setScale("heading", scale);
      this.Mouse.setScale("pitch", scale);
      if (!presenting) {
        this.cancelVR();
      }
      modifyScreen();
    };



    let allowRestart = true;

    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "start",
      returns: "Promise",
      description: "Restart animation after it has been stopped."
    });
    */
    this.start = () => {
      if(allowRestart) {
        this.ready.then(() => {
          this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          this.VR.currentDevice.startAnimation(animate);
        });
      }
    };


    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "stop",
      description: "Pause animation.",
      parameters: [ {
        name: "evt",
        type: "Event",
        optional: true,
        default: null,
        description: "The event that triggered this function."
      }, {
        name: "restartAllowed",
        type: "Boolean",
        optional: true,
        default: false,
        description: "Whether or not calling `start()` again is allowed, or if this is a permanent stop."
      } ]
    });
    */
    this.stop = (evt, restartAllowed) => {
      if(allowRestart) {
        allowRestart = restartAllowed;
        if(!allowRestart) {
          console.log("stopped");
        }

        this.VR.currentDevice.stopAnimation();
        this.audio.stop();
      }
    };

    this.pause = (evt) => this.stop(evt, true);

    window.addEventListener("vrdisplaypresentchange", fullScreenChange, false);
    window.addEventListener("resize", modifyScreen, false);
    if(!options.disableAutoPause) {
      window.addEventListener("focus", this.start, false);
      window.addEventListener("blur", this.pause, false);
    }
    window.addEventListener("stop", this.stop, false);
    document.addEventListener("amazonPlatformReady", () => {
      document.addEventListener("pause", this.pause, false);
      document.addEventListener("resume", this.start, false);
    }, false);

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "renderer",
      type: "THREE.WebGLRenderer",
      description: "The Three.js renderer being used to draw the scene."
    });
    */
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

      this.options.fullScreenElement = cascadeElement(this.options.fullScreenElement) || this.renderer.domElement.parentElement;
      let maxTabIndex = 0;
      const elementsWithTabIndex = document.querySelectorAll("[tabIndex]");
      for(let i = 0; i < elementsWithTabIndex.length; ++i){
        maxTabIndex = Math.max(maxTabIndex, elementsWithTabIndex[i].tabIndex);
      }

      this.renderer.domElement.tabIndex = maxTabIndex + 1;
      this.renderer.domElement.addEventListener('webglcontextlost', this.pause, false);
      this.renderer.domElement.addEventListener('webglcontextrestored', this.start, false);

      this.managers = [];
      this.newState = [];
      this.pointers = [];
      this.motionDevices = [];
      this.velocity = new Vector3();
      this.matrix = new Matrix4();

      if(!this.options.disableKeyboard) {
        this.addInputManager(new Keyboard(this, {
          strafeLeft: {
            buttons: [
              -Keys.A,
              -Keys.LEFTARROW
            ]
          },
          strafeRight: {
            buttons: [
              Keys.D,
              Keys.RIGHTARROW
            ]
          },
          strafe: {
            commands: ["strafeLeft", "strafeRight"]
          },
          driveForward: {
            buttons: [
              -Keys.W,
              -Keys.UPARROW
            ]
          },
          driveBack: {
            buttons: [
              Keys.S,
              Keys.DOWNARROW
            ]
          },
          drive: {
            commands: ["driveForward", "driveBack"]
          },
          select: {
            buttons: [Keys.ENTER]
          },
          dSelect: {
            buttons: [Keys.ENTER],
            delta: true
          },
          zero: {
            buttons: [Keys.Z],
            metaKeys: [
              -Keys.CTRL,
              -Keys.ALT,
              -Keys.SHIFT,
              -Keys.META
            ],
            commandUp: this.emit.bind(this, "zero")
          }
        }));

        this.Keyboard.operatingSystem = this.options.os;
        this.Keyboard.codePage = this.options.language;
      }

      this.addInputManager(new Touch(this.renderer.domElement, {
        U: { axes: ["X0"], min: 0, max: 2, offset: 0 },
        V: { axes: ["Y0"], min: 0, max: 2 },
        buttons: {
          axes: ["FINGERS"]
        },
        dButtons: {
          axes: ["FINGERS"],
          delta: true
        },
        heading: {
          axes: ["DX0"],
          integrate: true
        },
        pitch: {
          axes: ["DY0"],
          integrate: true,
          min: -Math.PI * 0.5,
          max: Math.PI * 0.5
        }
      }));


      this.addInputManager(new Mouse(this.options.fullScreenElement, {
        U: { axes: ["X"], min: 0, max: 2, offset: 0 },
        V: { axes: ["Y"], min: 0, max: 2 },
        buttons: {
          axes: ["BUTTONS"]
        },
        dButtons: {
          axes: ["BUTTONS"],
          delta: true
        },
        _dx: {
          axes: ["X"],
          delta: true,
          scale: 0.25
        },
        dx: {
          buttons: [0],
          commands: ["_dx"]
        },
        heading: {
          commands: ["dx"],
          integrate: true
        },
        _dy: {
          axes: ["Y"],
          delta: true,
          scale: 0.25
        },
        dy: {
          buttons: [0],
          commands: ["_dy"]
        },
        pitch: {
          commands: ["dy"],
          integrate: true,
          min: -Math.PI * 0.5,
          max: Math.PI * 0.5
        }
      }));

      // toggle back and forth between touch and mouse
      this.Touch.addEventListener("activate", (evt) => this.Mouse.inPhysicalUse = false);
      this.Mouse.addEventListener("activate", (evt) => this.Touch.inPhysicalUse = false);

      this.addInputManager(new VR(this.options));

      this.motionDevices.push(this.VR);

      if(!this.options.disableGamepad && GamepadManager.isAvailable){
        this.gamepadMgr = new GamepadManager();
        this.gamepadMgr.addEventListener("gamepadconnected", (pad) => {
          const padID = Gamepad.ID(pad);
          let mgr = null;

          if (padID !== "Unknown" && padID !== "Rift") {
            if (Gamepad.isMotionController(pad)) {
              let controllerNumber = 0;
              for (let i = 0; i < this.managers.length; ++i) {
                mgr = this.managers[i];
                if (mgr.currentPad && mgr.currentPad.id === pad.id) {
                  ++controllerNumber;
                }
              }

              mgr = new Gamepad(this.gamepadMgr, pad, controllerNumber, {
                buttons: {
                  axes: ["BUTTONS"]
                },
                dButtons: {
                  axes: ["BUTTONS"],
                  delta: true
                },
                zero: {
                  buttons: [Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
                  commandUp: this.emit.bind(this, "zero")
                }
              });

              this.addInputManager(mgr);
              this.motionDevices.push(mgr);

              const shift = (this.motionDevices.length - 2) * 8,
                color = 0x0000ff << shift,
                highlight = 0xff0000 >> shift,
                ptr = new Pointer(padID + "Pointer", color, 1, highlight, [mgr], null, this.options);

              // a rough model to represent the motion controller
              box(0.1, 0.025, 0.2)
                .colored(color, { emissive: highlight })
                .addTo(ptr);

              ptr.route(Pointer.EVENTS, this.consumeEvent.bind(this));

              this.pointers.push(ptr);
              this.scene.add(ptr);

              this.emit("motioncontrollerfound", mgr);
            }
            else {
              mgr = new Gamepad(this.gamepadMgr, pad, 0, {
                buttons: {
                  axes: ["BUTTONS"]
                },
                dButtons: {
                  axes: ["BUTTONS"],
                  delta: true
                },
                strafe: {
                  axes: ["LSX"],
                  deadzone: 0.2
                },
                drive: {
                  axes: ["LSY"],
                  deadzone: 0.2
                },
                heading: {
                  axes: ["RSX"],
                  scale: -1,
                  deadzone: 0.2,
                  integrate: true
                },
                dHeading: {
                  commands: ["heading"],
                  delta: true
                },
                pitch: {
                  axes: ["RSY"],
                  scale: -1,
                  deadzone: 0.2,
                  integrate: true
                },
                zero: {
                  buttons: [Gamepad.XBOX_ONE_BUTTONS.BACK],
                  commandUp: this.emit.bind(this, "zero")
                }
              });
              this.addInputManager(mgr);
              this.mousePointer.addDevice(mgr, mgr);
            }
          }
        });

        this.gamepadMgr.addEventListener("gamepaddisconnected", this.removeInputManager.bind(this));
      }

      this.stage = hub();

      this.head = new Pointer("GazePointer", 0xffff00, 0x0000ff, 0.8, [
        this.VR
      ], [
        this.Mouse,
        this.Touch,
        this.Keyboard
      ], this.options)
        .addTo(this.scene);

      this.head.route(Pointer.EVENTS, this.consumeEvent.bind(this));

      this.head.rotation.order = "YXZ";
      this.head.useGaze = this.options.useGaze;
      this.pointers.push(this.head);

      this.mousePointer = new Pointer("MousePointer", 0xff0000, 0x00ff00, 1, [
        this.Mouse,
        this.Touch
      ], null, this.options);
      this.mousePointer.route(Pointer.EVENTS, this.consumeEvent.bind(this));
      this.mousePointer.unproject = new Matrix4();
      this.pointers.push(this.mousePointer);
      this.head.add(this.mousePointer);

      this.VR.ready.then((displays) => displays.forEach((display, i) => {
        window.addEventListener("vrdisplayactivate", (evt) => {
          if(evt.display === display) {
            const exitVR = () => {
              window.removeEventListener("vrdisplaydeactivate", exitVR);
              this.cancelVR();
            };
            window.addEventListener("vrdisplaydeactivate", exitVR, false);
            this.goFullScreen(i);
          }
        }, false);
      }));

      this.fader = box(1, 1, 1).colored(this.options.backgroundColor, {
        opacity: 0,
        useFog: false,
        transparent: true,
        unshaded: true,
        side: BackSide
      }).addTo(this.head);
      this.fader.visible = false;

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "select",
        description: "Fired when an object has been selected, either by a physical cursor or a gaze-based cursor. You will typically want to use this instead of pointerend or gazecomplete."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointerstart",
        description: "Fired when mouse, gamepad, or touch-based pointers have their trigger buttons depressed."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointerend",
        description: "Fired when mouse, gamepad, or touch-based pointers have their trigger buttons released."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "pointermove",
        description: "Fired when mouse, gamepad, or touch-based pointers are moved away from where they were last frame."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazestart",
        description: "Fired when a gaze-based cursor starts spinning on a selectable object."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazemove",
        description: "Fired when a gaze-based cursor moves across an object that it is attempting to select."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazecomplete",
        description: "Fired when a gaze-based cursor finishes spinning on a selectable object."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "gazecancel",
        description: "Fired when a gaze-based cursor is moved off of the object it is attempting to select before it can finish spinning."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "exit",
        description: "Fired when a pointer leaves an object."
      });
      */

      /*
      pliny.event({
        parent: "Primrose.BrowserEnvironment",
        name: "enter",
        description: "Fired when a pointer hovers over an object."
      });
      */


      if(!this.options.disableKeyboard) {
        const keyDown =  (evt) => {
            if (this.VR.isPresenting) {
              if (evt.keyCode === Keys.ESCAPE && !this.VR.isPolyfilled) {
                this.cancelVR();
              }
            }

            this.Keyboard.consumeEvent(evt);
            this.consumeEvent(evt);
          },

          keyUp = (evt) => {
            this.Keyboard.consumeEvent(evt);
            this.consumeEvent(evt);
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
            var cmdName = this.Keyboard.operatingSystem.makeCommandName(evt, this.Keyboard.codePage);
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

      this.head.add(this.camera);

      return Promise.all(this.managers
        .map((mgr) => mgr.ready)
        .filter(identity));;
    });

    this._readyParts = [
      this.sky.ready,
      this.ground.ready,
      modelsReady,
      documentReady
    ];
    this.ready = Promise.all(this._readyParts)
      .then(() => {

        if(this.ground.rigidBody) {
          this.physics.addBody(this.ground.rigidBody);
        }

        this.renderer.domElement.style.cursor = "none";
        if(this.options.enableShadows && this.sky.sun) {
          this.renderer.shadowMap.enabled = true;
          this.renderer.shadowMap.type = PCFSoftShadowMap;
        }

        this.VR.displays.forEach((display) => {
          if(display.DOMElement !== undefined) {
            display.DOMElement = this.renderer.domElement;
          }
        });

        if(this.options.fullScreenButtonContainer){
          this.insertFullScreenButtons(this.options.fullScreenButtonContainer);
        }

        this.VR.connect(0);
        this.options.progress.hide();

        /*
        pliny.event({
          parent: "Primrose.BrowserEnvironment",
          name: "ready",
          description: "Fires after the initial assets have been downloaded and the scene initialized, just before animation starts."
        });
        */
        this.emit("ready");
      });

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "quality",
      type: "Primrose.Constants.Quality",
      description: "The current render quality."
    });
    */
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
          if (this.VR && this.VR.isPresenting) {
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

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "lockMovement",
      type: "Boolean",
      description: "True if the user is focused on a text box control. If the user is focused on a text box control, keyboard commands should not move their position."
    });
    */

    return this.currentControl && this.currentControl.lockMovement;
  }

  connect(socket, userName) {

    /*
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
    */

    if(!this.network){
      this.network = new NetworkManager(this, this.audio, this.factories, this.options);
      this.network.addEventListener("addavatar", this.addAvatar);
      this.network.addEventListener("removeavatar", this.removeAvatar);
    }
    return this.network && this.network.connect(socket, userName);
  }

  disconnect() {

    /*
    pliny.method({
      parent: "Primrose.BrowserEnvironment",
      name: "disconnect",
      description: "Disconnect from the server."
    });
    */

    return this.network && this.network.disconnect();
  }

  get displays() {

    /*
    pliny.property({
      parent: "Primrose.BrowserEnvironment",
      name: "displays",
      type: "Array of BaseVRDisplay",
      description: "The VRDisplays available on the system."
    });
    */

    return this.VR.displays;
  }

  get currentTime() {
    return this.audio.context.currentTime;
  }

  addInputManager(mgr) {
    for (let i = this.managers.length - 1; i >= 0; --i) {
      if (this.managers[i].name === mgr.name) {
        this.managers.splice(i, 1);
      }
    }
    this.managers.push(mgr);
    this[mgr.name] = mgr;
  }

  removeInputManager(id) {
    const mgr = this[id],
      mgrIdx = this.managers.indexOf(mgr);
    if (mgrIdx > -1) {
      this.managers.splice(mgrIdx, 1);
      delete this[id];
    }
  }

  moveStage(position) {
    DISPLACEMENT.copy(position)
      .sub(this.head.position);

    this.stage.position.add(DISPLACEMENT);
  }

  cancelVR() {
    this.VR.cancel();
    this.Touch.setOffset("U", 0);
    this.Mouse.setOffset("U", 0);
  }

  get hasMotionControllers() {
    return !!(this.Vive_0 && this.Vive_0.enabled && this.Vive_0.inPhysicalUse ||
      this.Vive_1 && this.Vive_1.enabled && this.Vive_1.inPhysicalUse);
  }

  get hasGamepad() {
    return !!(this.Gamepad_0 && this.Gamepad_0.enabled && this.Gamepad_0.inPhysicalUse);
  }

  get hasMouse() {
    return !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
  }

  get hasTouch() {
    return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
  }

  setAudioFromUser(userName, audioElement){

    /*
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
    */

    this.audioQueue.push([userName, audioElement]);
    if(this.network){
      while(this.audioQueue.length > 0){
        this.network.setAudioFromUser.apply(this.network, this.audioQueue.shift());
      }
    }
  }

  insertFullScreenButtons(containerSpec){

    /*
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
    */

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
      .map((display, i) => {
        const enterVR = this.goFullScreen.bind(this, i),
          btn = newButton(display.displayName, display.displayName, enterVR);
        btn.className = "enterVRButton " + display.isStereo ? "stereo" : "mono";
        return btn;
      });

    if(!/(www\.)?primrosevr.com/.test(document.location.hostname) && !this.options.disableAdvertising) {
      const visitPrimroseButton = newButton("Primrose", "✿", () => open("https://www.primrosevr.com", "_blank"));
      visitPrimroseButton.className = "visitPrimroseButton";
      buttons.push(visitPrimroseButton);
    }

    const exitFullScreenButton = newButton("Exit Fullscreen", "🗙", () => {
      FullScreen.exit();
      PointerLock.exit();
    });

    exitFullScreenButton.className = "exitVRButton"
    exitFullScreenButton.style.display = "none";

    buttons.push(exitFullScreenButton);

    FullScreen.addChangeListener(() => {
      const enterVRStyle = FullScreen.isActive ? "none" : "",
        exitVRStyle = FullScreen.isActive ? "" : "none";

      buttons.forEach((btn) =>
        btn.style.display = enterVRStyle);

      exitFullScreenButton.style.display = exitVRStyle;
    });

    return buttons;
  }
}

BrowserEnvironment.DEFAULTS = {
  antialias: true,
  quality: Quality.MAXIMUM,
  useGaze: isCardboard,
  useFog: false,
  avatarHeight: 1.65,
  walkSpeed: 2,
  disableKeyboard: false,
  enableShadows: false,
  shadowMapSize: 2048,
  shadowCameraSize: 15,
  shadowRadius: 1,
  progress: window.Preloader || {
    thunk: function() {},
    hide: function() {},
    resize: function() {}
  },
  // The rate at which the view fades in and out.
  fadeRate: 5,
  // The rate at which the UI shell catches up with the user's movement.
  vicinityFollowRate: 0.02,
  // The acceleration applied to falling objects.
  gravity: -9.8,
  // The amount of time in seconds to require gazes on objects before triggering the gaze event.
  gazeLength: 1.5,
  // By default, the rendering will be paused when the browser window loses focus.
  disableAutoPause: false,
  // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
  disableMirroring: false,
  // By default, motion is enabled,
  disableMotion: false,
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
  defaultFOV: StandardMonitorVRDisplay.DEFAULT_FOV,
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
  nonstandardIPD: null,
  disableAdvertising: false
};
