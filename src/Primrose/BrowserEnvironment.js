const MILLISECONDS_TO_SECONDS = 0.001,
  MAX_MOVE_DISTANCE = 5,
  MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE,
  TELEPORT_COOLDOWN = 250,
  TELEPORT_DISPLACEMENT = new THREE.Vector3(),
  GROUND_HEIGHT = -0.07;

pliny.class({
  parent: "Primrose",
    name: "BrowserEnvironment",
    description: "Make a Virtual Reality app in your web browser!"
});
class BrowserEnvironment extends Primrose.AbstractEventEmitter {
  constructor(options) {
    super();

    this.network = null;
    this.options = patch(options, BrowserEnvironment.DEFAULTS);
    this.options.foregroundColor = this.options.foregroundColor || complementColor(new THREE.Color(this.options.backgroundColor))
      .getHex();
    if(this.options.nonstandardIPD !== null){
      this.options.nonstandardIPD *= 0.5;
    }

    this.audioQueue = [];

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
      moveSky();
      moveGround();
      if(this.network){
        this.network.update(dt);
      }

      this.emit("update", dt);
    };

    const movePlayer = (dt) => {
      this.input.update(dt);
    };

    this.turns = 0;
    const followEuler = new THREE.Euler(),
      maxX = -Math.PI / 4,
      maxY = Math.PI / 6;

    const moveUI = (dt) => {
      this.ui.position.copy(this.input.stage.position);
      followEuler.setFromQuaternion(this.input.head.quaternion);
      let turn = followEuler.y,
        deltaTurnA = turn - this.turns,
        deltaTurnB = deltaTurnA + Math.PI * 2,
        deltaTurnC = deltaTurnA - Math.PI * 2,
        deltaTurn;
      if(Math.abs(deltaTurnA) < Math.abs(deltaTurnB)) {
        if(Math.abs(deltaTurnA) < Math.abs(deltaTurnC)) {
          deltaTurn = deltaTurnA;
        }
        else {
          deltaTurn = deltaTurnC;
        }
      }
      else if(Math.abs(deltaTurnB) < Math.abs(deltaTurnC)) {
        deltaTurn = deltaTurnB;
      }
      else {
        deltaTurn = deltaTurnC;
      }

      if(Math.abs(deltaTurn) > maxY) {
        this.turns += deltaTurn * 0.02;
      }

      followEuler.set(maxX, this.turns, 0, "YXZ");
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

    const moveSky = () => {
      if(this.sky){
        this.sky.position.copy(this.input.head.position);
      }
    };

    const moveGround = () => {
      if (this.ground) {
        this.ground.position.set(
          Math.floor(this.input.head.position.x),
          GROUND_HEIGHT,
          Math.floor(this.input.head.position.z));
        this.ground.material.needsUpdate = true;
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
          Primrose.Entity.eyeBlankAll(i);
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
      qPitch = new THREE.Quaternion(),
      vEye = new THREE.Vector3(),
      vBody = new THREE.Vector3(),
      modelFiles = {
        scene: this.options.sceneModel,
        avatar: this.options.avatarModel,
        button: this.options.button && typeof this.options.button.model === "string" && this.options.button.model,
        font: this.options.font
      },
      resolutionScale = 1,
      factories = {
        button: Primrose.Controls.Button2D,
        img: Primrose.Controls.Image,
        section: Primrose.Surface,
        textarea: Primrose.Text.Controls.TextBox,
        avatar: null,
        pre: {
          create: () => new Primrose.Text.Controls.TextBox({
            tokenizer: Primrose.Text.Grammars.PlainText,
            hideLineNumbers: true,
            readOnly: true
          })
        }
      };

    this.factories = factories;

    this.createElement = (type) => {
      if (factories[type]) {
        return factories[type].create();
      }
    };

    this.appendChild = (elem) => {
      if (elem instanceof THREE.Mesh) {
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

    var modelsReady = Primrose.ModelLoader.loadObjects(modelFiles)
      .then((models) => {
        window.text3D = function (font, size, text) {
          var geom = new THREE.TextGeometry(text, {
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
          factories.avatar = new Primrose.ModelLoader(models.avatar);
        }

        if (models.button) {
          this.buttonFactory = new Primrose.ButtonFactory(
            models.button,
            this.options.button.options);
        }
        else {
          this.buttonFactory = new Primrose.ButtonFactory(
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
          this.buttonFactory = new Primrose.ButtonFactory(
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
    this.avatarHeight = this.options.avatarHeight;
    this.walkSpeed = this.options.walkSpeed;

    this.speech = new Primrose.Output.Speech(this.options.speech);
    this.audio = new Primrose.Output.Audio3D();
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

    this.music = new Primrose.Output.Music(this.audio);

    this.pickableObjects = [];
    this.registerPickableObject = this.pickableObjects.push.bind(this.pickableObjects);

    this.currentControl = null;

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

    const POSITION = new THREE.Vector3(),
      START_POINT = new THREE.Vector3();

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

    this.options.scene = this.scene = this.options.scene || new THREE.Scene();
    if (this.options.useFog) {
      this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
    }

    this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);

    if(!this.options.useFog){
      if (this.options.skyTexture === null) {
        this.options.skyTexture = this.options.backgroundColor;
      }
      const skyFunc = (typeof this.options.skyTexture === "number") ? colored : textured,
        skyDim = this.options.drawDistance * 0.9,
        onSkyDone = () => this.scene.add(this.sky);
      let skyGeom = null;
      if(typeof this.options.skyTexture === "string"){
        skyGeom = sphere(skyDim, 18, 9);
      }
      else {
        skyGeom = box(skyDim, skyDim, skyDim);
      }
      this.sky = skyFunc(skyGeom, this.options.skyTexture, {
        side: THREE.BackSide,
        unshaded: true,
        transparent: true,
        opacity: 1,
        resolve: onSkyDone,
        progress: this.options.progress
      });
      this.sky.name = "Sky";
    }
    else if(this.options.skyTexture){
      console.warn("You can't use sky textures and fog together. We're going to go with fog.");
    }

    if (this.options.groundTexture !== undefined) {
      const dim = this.options.drawDistance / Math.sqrt(2),
        gm = new THREE.BoxBufferGeometry(dim * 5, 0.1, dim * 5, dim, 1, dim),
        groundFunc = (typeof this.options.groundTexture === "number") ? colored : textured,
        onGroundDone = () => this.scene.add(this.ground);
      this.ground = groundFunc(gm, this.options.groundTexture, {
        txtRepeatS: dim * 5,
        txtRepeatT: dim * 5,
        transparent: true,
        opacity: 1,
        resolve: onGroundDone,
        progress: this.options.progress
      });
      this.ground.name = "Ground";
      this.registerPickableObject(this.ground);
    }

    this.ui = new THREE.Object3D();
    this.scene.add(this.ui);

    if (this.passthrough) {
      this.camera.add(this.passthrough.mesh);
    }

    var buildScene = (sceneGraph) => {
      sceneGraph.buttons = [];
      sceneGraph.traverse(function (child) {
        if (child.isButton) {
          sceneGraph.buttons.push(
            new Primrose.Controls.Button3D(child.parent, child.name));
        }
        if (child.name) {
          sceneGraph[child.name] = child;
        }
      });
      this.scene.add.apply(this.scene, sceneGraph.children);
      this.scene.traverse((obj) => {
        if (this.options.disableDefaultLighting && obj.material && obj.material.map) {
          textured(obj, obj.material.map, {
            unshaded: true
          });
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

    if(!this.options.disableDefaultLighting) {
      this.ambient = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(this.ambient);

      this.sun = light(0xffffff, 1, 50);
      put(this.sun)
        .on(this.scene)
        .at(0, 10, 10);
    }

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
        this.renderer = new THREE.WebGLRenderer({
          canvas: Primrose.DOM.cascadeElement(this.options.canvasElement, "canvas", HTMLCanvasElement),
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

      this.input = new Primrose.Input.FPSInput(this.options.fullScreenElement, this.options);
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

      this.fader = colored(box(1, 1, 1), 0x000000, {opacity: 0, transparent: true, unshaded: true, side: THREE.BackSide});
      this.fader.visible = false;
      this.input.head.root.add(this.fader);

      Primrose.Pointer.EVENTS.forEach((evt) => this.input.addEventListener(evt, this.selectControl.bind(this), false));
      this.input.forward(this, Primrose.Pointer.EVENTS);

      if(!this.options.disableKeyboard) {
        const keyDown =  (evt) => {
            if (this.input.VR.isPresenting) {
              if (evt.keyCode === Primrose.Keys.ESCAPE && !this.input.VR.isPolyfilled) {
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
        var surrogate = Primrose.DOM.cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
          surrogateContainer = Primrose.DOM.makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

        surrogateContainer.style.position = "absolute";
        surrogateContainer.style.overflow = "hidden";
        surrogateContainer.style.width = 0;
        surrogateContainer.style.height = 0;
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

    var allReady = Promise.all([
        modelsReady,
        documentReady
      ])
      .then(() => {
        this.renderer.domElement.style.cursor = "default";
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
      this.network = new Primrose.Network.Manager(this.input, this.audio, this.factories, this.options);
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
    return this.displays.map((display, i) => {
      const btn = document.createElement("button"),
        isStereo = Primrose.Input.VR.isStereoDisplay(display),
        enterVR = this.goFullScreen.bind(this, i);
      btn.type = "button";
      btn.className = isStereo ? "stereo" : "mono";
      btn.title = display.displayName;
      btn.appendChild(document.createTextNode(display.displayName));
      btn.addEventListener("click", enterVR, false);
      container.appendChild(btn);
      return btn;
    });
  }
}

BrowserEnvironment.DEFAULTS = {
  antialias: true,
  quality: Quality.MAXIMUM,
  useLeap: false,
  useGaze: false,
  useFog: false,
  avatarHeight: 1.65,
  walkSpeed: 2,
  disableKeyboard: false,
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
  // the texture to use for the sky
  skyTexture: null,
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
  // THREE.js renderer, if one had already been created.
  renderer: null,
  // A WebGL context to use, if one had already been created.
  context: null,
  // THREE.js scene, if one had already been created.
  scene: null,
  // I highly suggest you don't go down the road that requires setting this. I will not help you understand what it does, because I would rather you just not use it.
  nonstandardIPD: null,
  // This is an experimental feature for setting the height of a user's "neck" on orientation-only systems (such as Google Cardboard and Samsung Gear VR) to create a more realistic feel.
  nonstandardNeckLength: null,
  nonstandardNeckDepth: null,
  showHeadPointer: true
};