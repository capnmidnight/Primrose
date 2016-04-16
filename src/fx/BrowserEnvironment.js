/* global Primrose, THREE, io, CryptoJS, Notification, HMDVRDevice, devicePixelRatio
 * Function, emit, isMobile, isiOS, shell, quad, HTMLCanvasElement, pliny */

Primrose.BrowserEnvironment = (function () {
  "use strict";

  if (typeof THREE === "undefined") {
    return function () {
    };
  }
  /*
   Create a new VR Application!
   
   `name` - name the application, for use with saving settings separately from
   other applications on the same domain
   `options` - optional values to override defaults
   | `avatarHeight` - the offset from the ground at which to place the camera
   | `walkSpeed` - how quickly the avatar moves across the ground
   | `button`
   | `model` - the model to use to make buttons, in THREE JSON format
   | `options` - configuration parameters for buttons
   | `maxThrow` - the distance the button may move
   | `minDeflection` - the angle boundary in which to do hit tests on the button
   | `colorUnpressed` - the color of the button when it is not depressed
   | `colorPressed` - the color of the button when it is depressed
   | `gravity` - the acceleration applied to falling objects (default: 9.8)
   | `useLeap` - use the Leap Motion device
   | `backgroundColor` - the color that WebGL clears the background with before drawing (default: 0x000000)
   | `drawDistance` - the far plane of the camera (default: 500)
   | `chatTextSize` - the size of a single line of text, in world units (default: 0.25)
   | `dtNetworkUpdate` - the amount of time to allow to elapse between sending state to teh server (default: 0.125)
   */
  var RIGHT = new THREE.Vector3(1, 0, 0),
    UP = new THREE.Vector3(0, 1, 0),
    FORWARD = new THREE.Vector3(0, 0, -1),
    POINTER_RADIUS = 0.01,
    POINTER_RESCALE = 20,
    FORWARDED_EVENTS = [
      "keydown", "keyup", "keypress",
      "mousedown", "mouseup", "mousemove", "wheel",
      "touchstart", "touchend", "touchmove"],
    RESOLUTION_SCALE = 1;

  pliny.class({
    parent: "Primrose",
    name: "BrowserEnvironment",
    description: "Make a Virtual Reality app in your web browser!"
  });
  class BrowserEnvironment {
    constructor(name, options) {
      this.options = patch(options, BrowserEnvironment.DEFAULTS);

      var fire = emit.bind(this);

      this.addEventListener = (event, thunk, bubbles) => {
        if (this.listeners[event]) {
          this.listeners[event].push(thunk);
        }
        else if (FORWARDED_EVENTS.indexOf(event) >= 0) {
          window.addEventListener(event, thunk, bubbles);
        }
      };

      var lockedToEditor = () => {
        return this.currentControl && this.currentControl.lockMovement;
      };

      this.zero = () => {
        if (!lockedToEditor()) {
          this.player.position.set(0, this.avatarHeight, 0);
          this.player.velocity.set(0, 0, 0);
          this.input.zero();
        }
      };

      this.jump = () => {
        if (this.player.isOnGround && !lockedToEditor()) {
          this.player.velocity.y += this.options.jumpSpeed;
          this.player.isOnGround = false;
        }
      };

      this.registerPickableObject = (obj) => {
        if (obj.type === "Object3D") {
          obj.children[0].name = obj.children[0].name || obj.name;
          obj = obj.children[0];
        }
        if (obj) {
          var bag = createPickableObject(obj),
            verts, faces, uvs, i;
        
          // it would be nice to do this the other way around, to have everything
          // stored in ArrayBuffers, instead of regular arrays, to pass to the
          // Worker thread. Maybe later.
          if (obj.geometry instanceof THREE.BufferGeometry) {
            var attr = obj.geometry.attributes,
              pos = attr.position,
              uv = attr.uv,
              idx = attr.index;

            verts = [];
            faces = [];
            if (uv) {
              uvs = [];
            }
            for (i = 0; i < pos.count; ++i) {
              verts.push([pos.getX(i), pos.getY(i), pos.getZ(i)]);
              if (uv) {
                uvs.push([uv.getX(i), uv.getY(i)]);
              }
            }
            if (idx) {
              for (i = 0; i < idx.count - 2; ++i) {
                faces.push([idx.getX(i), idx.getX(i + 1), idx.getX(i + 2)]);
              }
            }
            else {
              for (i = 0; i < pos.count; i += 3) {
                faces.push([i, i + 1, i + 2]);
              }
            }
          }
          else {
            verts = obj.geometry.vertices.map((v) => v.toArray());
            faces = [];
            uvs = [];
            // IDK why, but non-buffered geometry has an additional array layer
            for (i = 0; i < obj.geometry.faces.length; ++i) {
              var f = obj.geometry.faces[i],
                faceUVs = obj.geometry.faceVertexUvs[0][i];
              faces.push([f.a, f.b, f.c]);
              uvs[f.a] = [faceUVs[0].x, faceUVs[0].y];
              uvs[f.b] = [faceUVs[1].x, faceUVs[1].y];
              uvs[f.c] = [faceUVs[2].x, faceUVs[2].y];
            }
          }

          bag.geometry = {
            vertices: verts,
            faces: faces,
            uvs: uvs
          };

          this.pickableObjects[obj.uuid] = obj;
          this.projector.setObject(bag);
        }
      };

      var wasFullscreen = false;
      var checkFullscreen = () => {
        if (Primrose.Input.VR.Version === 1 && isMobile) {
          if (wasFullscreen !== FullScreen.isActive) {
            window.dispatchEvent(new Event("vrdisplaypresentchange"));
            wasFullscreen = FullScreen.isActive;
          }
        }
      };

      var update = (t) => {
        t *= 0.001;
        var dt = t - lt,
          i, j;
        lt = t;

        checkFullscreen();

        movePlayer(dt);
        moveSky();
        moveGround();
        movePointer();
        resolvePicking();
        fire("update", dt);
      };

      var movePlayer = (dt) => {

        this.input.update();
        var heading = this.input.getValue("heading"),
          pitch = this.input.getValue("pitch"),
          strafe = this.input.getValue("strafe"),
          drive = this.input.getValue("drive");

        if (this.inVR || isMobile) {
          this.input.getQuaternion("headRX", "headRY", "headRZ", "headRW", qHead);
        }
        else {
          qHead.set(0, 0, 0, 1);
        }
        qPitch.setFromAxisAngle(RIGHT, pitch);
        if (!this.player.isOnGround) {
          this.player.velocity.y -= this.options.gravity * dt;
        }
        else if (!lockedToEditor()) {
          this.player.velocity.set(strafe, 0, drive)
            .normalize()
            .multiplyScalar(this.walkSpeed);

          qHeading.setFromAxisAngle(UP, currentHeading);
          this.player.velocity.applyQuaternion(qHead);
          this.player.velocity.y = 0;
          this.player.velocity.applyQuaternion(qHeading);
        }

        this.player.position.add(vBody.copy(this.player.velocity).multiplyScalar(dt));
        if (!this.player.isOnGround && this.player.position.y < this.avatarHeight) {
          this.player.isOnGround = true;
          this.player.position.y = this.avatarHeight;
          this.player.velocity.y = 0;
        }

        if (this.inVR) {
          var dHeading = heading - currentHeading;
          if (!lockedToEditor() && Math.abs(dHeading) > Math.PI / 5) {
            var dh = Math.sign(dHeading) * Math.PI / 100;
            currentHeading += dh;
            heading -= dh;
            dHeading = heading - currentHeading;
          }
          this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          qHeading.setFromAxisAngle(UP, dHeading).multiply(qPitch);
        }
        else {
          currentHeading = heading;
          this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          this.player.quaternion.multiply(qPitch);
        }
      };

      var moveSky = () => {
        if (this.sky) {
          this.sky.position.copy(this.player.position);
        }
      };

      var moveGround = () => {
        if (this.ground) {
          this.ground.position.set(
            Math.floor(this.player.position.x),
            0,
            Math.floor(this.player.position.z));
          this.ground.material.needsUpdate = true;
        }
      };

      var movePointer = () => {
        this.pointer.position.copy(FORWARD);
        if (this.inVR && !isMobile) {
          this.pointer.position.applyQuaternion(qHeading);
        }
        if (!lockedToEditor() || isMobile) {
          this.pointer.position.add(this.camera.position);
          this.pointer.position.applyQuaternion(this.camera.quaternion);
        }
        this.pointer.position.applyQuaternion(this.player.quaternion);
        this.pointer.position.add(this.player.position);
      };

      var resolvePicking = () => {

        if (this.projector.ready) {
          this.projector.ready = false;
          var arr = Object.keys(this.pickableObjects).map((id) => createPickableObject(this.pickableObjects[id]));
          this.projector.updateObjects(arr);
          this.projector.projectPointer([
            this.pointer.position.toArray(),
            transformForPicking(this.player)]);
        }

        var lastButtons = this.input.getValue("dButtons");
        if (currentHit) {
          var fp = currentHit.facePoint,
            fn = currentHit.faceNormal,
            object = this.pickableObjects[currentHit.objectID];
          this.pointer.position.set(
            fp[0] + fn[0] * POINTER_RADIUS,
            fp[1] + fn[1] * POINTER_RADIUS,
            fp[2] + fn[2] * POINTER_RADIUS);

          if (object === this.ground) {
            this.pointer.scale.set(POINTER_RESCALE, POINTER_RESCALE, POINTER_RESCALE);
          }
          else {
            this.pointer.scale.set(1, 1, 1);
          }
          this.pointer.material.color.setRGB(1, 1, 1);
          this.pointer.material.emissive.setRGB(0.25, 0.25, 0.25);
          if (object) {
            var buttons = this.input.getValue("buttons"),
              clickChanged = lastButtons !== 0,
              control = object.button || object.surface;

            if (!lockedToEditor()) {
              buttons |= this.input.keyboard.getValue("select");
              clickChanged = clickChanged || this.input.keyboard.getValue("dSelect") !== 0;
            }

            if (lastHit && currentHit && lastHit.objectID === currentHit.objectID && !clickChanged && buttons > 0) {
              fire("pointermove", currentHit);
            }
            else {
              if (lastHit && clickChanged && buttons === 0) {
                fire("pointerend", lastHit);
              }
              if (currentHit && clickChanged && buttons > 0) {
                fire("pointerstart", currentHit);
              }
            }

            if (clickChanged && buttons > 0) {
              if (this.currentControl && this.currentControl !== control) {
                this.currentControl.blur();
                this.currentControl = null;
              }

              if (!this.currentControl && control) {
                this.currentControl = control;
                this.currentControl.focus();
              }
              else if (object === this.ground) {
                this.player.position.copy(this.pointer.position);
                this.player.position.y = this.avatarHeight;
                this.player.isOnGround = false;
              }
            }

            if (this.currentControl) {
              if (clickChanged) {
                if (buttons > 0) {
                  this.currentControl.startUV(currentHit.point);
                }
                else {
                  this.currentControl.endPointer();
                }
              }
              else if (!clickChanged && buttons > 0) {
                this.currentControl.moveUV(currentHit.point);
              }
            }
          }
        }
        else {
          if (this.currentControl && lastButtons > 0) {
            this.currentControl.blur();
            this.currentControl = null;
          }
          this.pointer.material.color.setRGB(1, 0, 0);
          this.pointer.material.emissive.setRGB(0.25, 0, 0);
          this.pointer.scale.set(1, 1, 1);
        }
      };

      var animate = (t) => {
        RAF(animate);
        update(t);
        render();
      };


      var eyeCounter = 0, blankEye = false;
      var render = () => {
        if (this.inVR) {
          this.renderer.clear(true, true, true);
          var trans = this.input.vr.transforms;
          for (var i = 0; trans && i < trans.length; ++i) {
            var st = trans[i],
              v = st.viewport,
              side = (2 * i) - 1;
            Primrose.Entity.eyeBlankAll(i);
            this.input.getVector3("headX", "headY", "headZ", this.camera.position);
            this.camera.projectionMatrix.copy(st.projection);
            vEye.set(0, 0, 0);
            vEye.applyMatrix4(st.translation);
            vEye.applyQuaternion(qHead);
            this.camera.position.add(vEye);
            this.camera.quaternion.copy(qHead);
            if (this.options.useNose) {
              this.nose.visible = true;
              this.nose.position.set(side * -0.12, -0.12, -0.15);
              this.nose.rotation.z = side * 0.7;
            }
            this.renderer.setViewport(
              v.left * RESOLUTION_SCALE,
              v.top * RESOLUTION_SCALE,
              v.width * RESOLUTION_SCALE,
              v.height * RESOLUTION_SCALE);
            this.renderer.render(this.scene, this.camera);
          }
          this.input.vr.currentDisplay.submitFrame(this.input.vr.currentPose);
        }

        if (!this.inVR || (this.input.vr.currentDisplay.capabilities.hasExternalDisplay && !this.options.disableMirroring)) {
          if (blankEye) {
            Primrose.Entity.eyeBlankAll(eyeCounter = 1 - eyeCounter);
          }
          this.nose.visible = false;
          this.camera.fov = this.options.defaultFOV;
          this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
          this.camera.updateProjectionMatrix();
          this.camera.position.set(0, 0, 0);
          this.camera.quaternion.copy(qHead);
          this.renderer.clear(true, true, true);
          this.renderer.setViewport(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
          this.renderer.render(this.scene, this.camera);
        }
      };

      var setSize = (evt) => {
        var canvasWidth,
          canvasHeight,
          aspectWidth,
          bounds = this.renderer.domElement.getBoundingClientRect(),
          elementWidth = bounds.width,
          elementHeight = bounds.height;

        if (this.inVR) {

          this.input.vr.resetTransforms(
            this.options.nearPlane,
            this.options.nearPlane + this.options.drawDistance);

          var p = this.input.vr.transforms,
            l = p[0],
            r = p[1];
          canvasWidth = Math.floor((l.viewport.width + r.viewport.width) * RESOLUTION_SCALE);
          canvasHeight = Math.floor(Math.max(l.viewport.height, r.viewport.height) * RESOLUTION_SCALE);
          aspectWidth = canvasWidth / 2;
        }
        else {
          var pixelRatio = devicePixelRatio || 1;
          if (isiOS) {
            elementHeight = elementWidth * screen.width / screen.height;
          }
          canvasWidth = Math.floor(elementWidth * pixelRatio * RESOLUTION_SCALE);
          canvasHeight = Math.floor(elementHeight * pixelRatio * RESOLUTION_SCALE);
          aspectWidth = canvasWidth;
          if (isMobile) {
            document.body.style.height = Math.max(document.body.clientHeight, elementHeight) + "px";
            document.documentElement.style.height = Math.max(document.documentElement.clientHeight, elementHeight) + "px";
          }
        }

        this.renderer.domElement.width = canvasWidth;
        this.renderer.domElement.height = canvasHeight;
        if (!this.timer) {
          render();
        }
      };

      //
      // Initialize local variables
      //
      var lt = 0,
        lastHit = null,
        currentHit = null,
        currentHeading = 0,
        qPitch = new THREE.Quaternion(),
        qHeading = new THREE.Quaternion(),
        qHead = new THREE.Quaternion(),
        vEye = new THREE.Vector3(),
        vBody = new THREE.Vector3(),
        skin = Primrose.Random.item(Primrose.SKIN_VALUES),
        sceneLoaded = !this.options.sceneModel,
        buttonLoaded = !this.options.button,
        readyFired = false;
    
      //
      // Initialize public properties
      //
      this.currentControl = null;
      this.avatarHeight = this.options.avatarHeight;
      this.walkSpeed = this.options.walkSpeed;
      this.listeners = {
        ready: [],
        update: [],
        gazestart: [],
        gazecomplete: [],
        gazecancel: [],
        pointerstart: [],
        pointermove: [],
        pointerend: []
      };

      this.audio = new Primrose.Output.Audio3D();

      this.music = new Primrose.Output.Music(this.audio.context);

      this.pickableObjects = {};

      if (isGearVR) {
        this.projector = new Primrose.Projector();
      }
      else {
        this.projector = new Primrose.Workerize(Primrose.Projector);
      }

      this.player = new THREE.Object3D();
      this.player.velocity = new THREE.Vector3();
      this.player.position.set(0, this.avatarHeight, 0);
      this.player.isOnGround = true;

      this.pointer = textured(sphere(POINTER_RADIUS, 10, 10), 0xff0000);
      this.pointer.material.emissive.setRGB(0.25, 0, 0);
      this.pointer.material.opacity = 0.75;

      this.nose = textured(sphere(0.05, 10, 10), skin);
      this.nose.name = "Nose";
      this.nose.scale.set(0.5, 1, 1);

      this.renderer = new THREE.WebGLRenderer({
        canvas: Primrose.DOM.cascadeElement(this.options.canvasElement, "canvas", HTMLCanvasElement),
        antialias: !isMobile,
        alpha: true,
        logarithmicDepthBuffer: false
      });
      this.renderer.autoClear = false;
      this.renderer.autoSortObjects = true;
      this.renderer.setClearColor(this.options.backgroundColor);
      if (!this.renderer.domElement.parentElement) {
        document.body.appendChild(this.renderer.domElement);
      }

      this.input = new Primrose.Input.FPSInput(this.renderer.domElement);

      this.scene = new THREE.Scene();
      if (this.options.useFog) {
        this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
      }

      this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);

      if (this.options.skyTexture) {
        this.sky = textured(
          shell(
            this.options.drawDistance,
            18,
            9,
            Math.PI * 2,
            Math.PI),
          this.options.skyTexture,
          { unshaded: true });
        this.sky.name = "Sky";
        this.scene.add(this.sky);
      }

      if (this.options.groundTexture) {
        var dim = 10,
          gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
        this.ground = textured(gm, this.options.groundTexture, {
          txtRepeatS: dim * 5,
          txtRepeatT: dim * 5
        });
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.name = "Ground";
        this.scene.add(this.ground);
        this.registerPickableObject(this.ground);
      }

      this.camera.add(this.nose);
      this.camera.add(light(0xffffff, 1, 1));
      this.player.add(this.camera);
      this.scene.add(this.player);
      this.scene.add(this.pointer);

      if (this.passthrough) {
        this.camera.add(this.passthrough.mesh);
      }

      if (this.options.sceneModel) {
        Primrose.ModelLoader.loadScene(this.options.sceneModel, (sceneGraph) => {
          sceneLoaded = true;
          this.scene.add.apply(this.scene, sceneGraph.children);
          this.scene.traverse((obj) => {
            if (obj.name) {
              this.scene[obj.name] = obj;
            }
          });
          if (sceneGraph.Camera) {
            this.camera.position.copy(sceneGraph.Camera.position);
            this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
          }
        });
      }

      if (this.options.button) {
        this.buttonFactory = new Primrose.ButtonFactory(
          this.options.button.model,
          this.options.button.options,
          () => buttonLoaded = true);
      }
      else {
        this.buttonFactory = new Primrose.ButtonFactory(
          brick(0xff0000, 1, 1, 1), {
            maxThrow: 0.1,
            minDeflection: 10,
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00,
            toggle: true
          });
      }


      var waitForResources = (t) => {
        lt = t * 0.001;
        if (sceneLoaded && buttonLoaded) {
          if (!readyFired) {
            readyFired = true;
            setSize();
            try {
              fire("ready");
            }
            catch (exp) {
              console.error(exp);
              console.warn("There was an error during setup, but we're going to continue anyway.");
            }
          }
          RAF(animate);
        }
        else {
          RAF(waitForResources);
        }
      };

      var RAF = (callback) => {
        if (this.inVR) {
          this.timer = this.input.vr.currentDisplay.requestAnimationFrame(callback);
        }
        else {
          this.timer = requestAnimationFrame(callback);
        }
      };

      this.start = () => {
        if (!this.timer) {
          RAF(waitForResources);
        }
      };

      this.stop = () => {
        if (this.inVR) {
          this.input.vr.currentDisplay.cancelAnimationFrame(this.timer);
        }
        else {
          cancelAnimationFrame(this.timer);
        }
        this.timer = null;
      };

      var handleHit = (h) => {
        var dt;
        this.projector.ready = true;
        lastHit = currentHit;
        currentHit = h;
        if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
          currentHit.startTime = lastHit.startTime;
          currentHit.gazeFired = lastHit.gazeFired;
          dt = lt - currentHit.startTime;
          if (dt >= this.options.gazeLength && !currentHit.gazeFired) {
            currentHit.gazeFired = true;
            fire("gazecomplete", currentHit);
          }
        }
        else {
          if (lastHit) {
            dt = lt - lastHit.startTime;
            if (dt < this.options.gazeLength) {
              fire("gazecancel", lastHit);
            }
          }
          if (currentHit) {
            currentHit.startTime = lt;
            currentHit.gazeFired = false;
            fire("gazestart", currentHit);
          }
        }
      };

      var keyDown = (evt) => {
        if (!lockedToEditor() && !evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
          if (evt.keyCode === Primrose.Keys.E) {
            blankEye = true;
            evt.preventDefault();
          }
        }
        else if (this.currentControl) {
          var elem = this.currentControl.focusedElement;
          if (elem.execCommand) {
            var oldDeadKeyState = this.operatingSystem._deadKeyState;
            if (elem.execCommand(this._browser, this.codePage, this.operatingSystem.makeCommandName(evt, this.codePage))) {
              evt.preventDefault();
            }
            if (this.operatingSystem._deadKeyState === oldDeadKeyState) {
              this.operatingSystem._deadKeyState = "";
            }
          }
          else {
            elem.keyDown(evt);
          }
        }
      };

      var keyUp = (evt) => {
        if (this.currentControl) {
          this.currentControl.keyUp(evt);
        }
        else if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
          if (evt.keyCode === Primrose.Keys.E) {
            blankEye = false;
          }
        }
      };
    
      //
      // Manage full-screen state
      //
      this.goFullScreen = () => FullScreen.request(this.renderer.domElement);

      this.goVR = () => this.input.vr.requestPresent([{ source: this.renderer.domElement }])
        .then((elem) => {
          if (Primrose.Input.VR.Version === 1 && isMobile) {
            var remover = () => {
              this.input.vr.currentDisplay.exitPresent();
              window.removeEventListener("vrdisplaypresentchange", remover);
            };

            var adder = () => {
              window.addEventListener("vrdisplaypresentchange", remover, false);
              window.removeEventListener("vrdisplaypresentchange", adder);
            }

            window.addEventListener("vrdisplaypresentchange", adder, false);
          }

          return elem;
        });


      Primrose.Input.Mouse.Lock.addChangeListener((evt) => {
        if (!Primrose.Input.Mouse.Lock.isActive && this.inVR) {
          this.input.vr.currentDisplay.exitPresent();
        }
      }, false);

      window.addEventListener("vrdisplaypresentchange", () => setSize(), false);

      var isFullScreenMode = () => FullScreen.isActive || this.inVR;

      this.setFullScreenButton = (id, event, useVR) => {
        var elem = document.getElementById(id);
        if (elem) {
          var show = !useVR || Primrose.Input.VR.Version > 0;
          elem.style.display = show ? "block" : "none";
          elem.style.cursor = show ? "pointer" : "not-allowed";
          elem.title = show ? (useVR ? "Go Split-Screen" : "Go Fullscreen") : "VR is not available in your current browser.";
          elem.addEventListener(event, (useVR ? this.goVR : this.goFullScreen), false);
        }
      };

      BrowserEnvironment.createSurrogate.call(this);

      this.operatingSystem = this.options.os;
      this.codePage = this.options.language;


      var focusClipboard = (evt) => {
        var cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          this._surrogate.style.display = "block";
          this._surrogate.focus();
        }
      };

      var setPointerLock = () => Primrose.Input.Mouse.Lock.isActive || Primrose.Input.Mouse.Lock.request(this.renderer.domElement);
      var setFullscreen = () => {
        if (!isFullScreenMode()) {
          if (Primrose.Input.VR.Version > 0) {
            this.goVR();
          }
          else {
            this.goFullScreen();
          }
        }
      };
      var withCurrentControl = (name) => {
        return (evt) => {
          if (this.currentControl) {
            this.currentControl[name](evt);
          }
        };
      };

      window.addEventListener("resize", setSize, false);



      this._browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" : (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));
      window.addEventListener("keydown", keyDown, false);
      window.addEventListener("keyup", keyUp, false);
      window.addEventListener("keydown", focusClipboard, true);
      window.addEventListener("beforepaste", setFalse, false);
      window.addEventListener("paste", withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", withCurrentControl("readWheel"), false);
      window.addEventListener("blur", this.stop, false);
      window.addEventListener("focus", this.start, false);
      this.renderer.domElement.addEventListener('webglcontextlost', this.stop, false);
      this.renderer.domElement.addEventListener('webglcontextrestored', this.start, false);
      this.input.addEventListener("jump", this.jump.bind(this), false);
      this.input.addEventListener("zero", this.zero.bind(this), false);
      this.input.addEventListener("lockpointer", setPointerLock, false);
      this.input.addEventListener("fullscreen", setFullscreen, false);
      this.projector.addEventListener("hit", handleHit, false);

      Object.defineProperties(this, {
        inVR: {
          get: () => this.input.vr && this.input.vr.currentDisplay && this.input.vr.currentDisplay.isPresenting
        },
        logInVR: {
          get: () => {
            console.log(
              !!this.input.vr,
              this.input.vr && !!this.input.vr.currentDisplay,
              this.input.vr && this.input.vr.currentDisplay && this.input.vr.currentDisplay.isPresenting);
            return this.inVR;
          }
        }
      });

      if (window.alert.toString().indexOf("native code") > -1) {
        // overwrite the native alert functions so they can't be called while in
        // fullscreen VR mode.
      
        var rerouteDialog = (oldFunction, newFunction) => {
          if (!newFunction) {
            newFunction = function () {
            };
          }
          return function () {
            if (isFullScreenMode()) {
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

    get operatingSystem() {
      return this._operatingSystem;
    }

    set operatingSystem(os) {
      this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
    }

    get codePage() {
      return this._codePage;
    }

    set codePage(cp) {
      var key,
        code,
        char,
        name;
      this._codePage = cp;
      if (!this._codePage) {
        var lang = (navigator.languages && navigator.languages[0]) ||
          navigator.language ||
          navigator.userLanguage ||
          navigator.browserLanguage;

        if (!lang || lang === "en") {
          lang = "en-US";
        }

        for (key in Primrose.Text.CodePages) {
          cp = Primrose.Text.CodePages[key];
          if (cp.language === lang) {
            this._codePage = cp;
            break;
          }
        }

        if (!this._codePage) {
          this._codePage = Primrose.Text.CodePages.EN_US;
        }
      }
    }

    static createSurrogate() {

      var clipboardOperation = (name, evt) => {
        if (this.currentControl) {
          this.currentControl[name + "SelectedText"](evt);
          if (!evt.returnValue) {
            evt.preventDefault();
          }
          this._surrogate.style.display = "none";
          this.currentControl.canvas.focus();
        }
      };

      // the `surrogate` textarea makes clipboard events possible
      this._surrogate = Primrose.DOM.cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement);
      this._surrogateContainer = Primrose.DOM.makeHidingContainer("primrose-surrogate-textarea-container", this._surrogate);
      this._surrogateContainer.style.position = "absolute";
      this._surrogateContainer.style.overflow = "hidden";
      this._surrogateContainer.style.width = 0;
      this._surrogateContainer.style.height = 0;
      this._surrogate.addEventListener("beforecopy", setFalse, false);
      this._surrogate.addEventListener("copy", clipboardOperation.bind(this, "copy"), false);
      this._surrogate.addEventListener("beforecut", setFalse, false);
      this._surrogate.addEventListener("cut", clipboardOperation.bind(this, "cut"), false);
      document.body.insertBefore(this._surrogateContainer, document.body.children[0]);
    }
  }

  BrowserEnvironment.DEFAULT_USER_NAME = "CURRENT_USER_OFFLINE";

  BrowserEnvironment.DEFAULTS = {
    useNose: false,
    useLeap: false,
    useFog: true,
    avatarHeight: 1.75,
    walkSpeed: 2,
    // The acceleration applied to falling objects.
    gravity: 9.8,
    // The instantaneous speed to apply to the avatar when you jump. Set to 0 to disable jumping.
    jumpSpeed: 3.13,
    // The amount of time in seconds to require gazes on objects before triggering the gaze event.
    gazeLength: 1,
    // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
    disableMirroring: false,
    // The color that WebGL clears the background with before drawing.
    backgroundColor: 0xafbfff,
    // the near plane of the camera
    nearPlane: 0.01,
    // the far plane of the camera
    drawDistance: 100,
    // the field of view to use in non-VR settings
    defaultFOV: 75,
    // the amount of time to allow to elapse between sending state to the server
    dtNetworkUpdate: 0.125,
    canvasElement: "frontBuffer"
  };

  function createPickableObject(obj) {
    var bag = {
      uuid: obj.uuid,
      visible: obj.visible,
      name: obj.name
    };
    var originalBag = bag,
      head = obj;
    while (head !== null) {
      head.updateMatrix();
      bag.matrix = head.matrix.elements.subarray(0, head.matrix.elements.length);
      bag.parent = head.parent ? {} : null;
      bag = bag.parent;
      head = head.parent;
    }
    return originalBag;
  }

  function transformForPicking(obj) {
    var p = obj.position.clone();
    obj = obj.parent;
    while (obj !== null) {
      p.applyMatrix4(obj.matrix);
      obj = obj.parent;
    }
    return p.toArray();
  }

  return BrowserEnvironment;
})();

pliny.issue({
  parent: "Primrose.BrowserEnvironment",
  name: "document BrowserEnvironment",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.BrowserEnvironment](#Primrose_BrowserEnvironment) class in the  directory"
});

pliny.issue({
  parent: "Primrose.BrowserEnvironment",
  name: "scene FOV issues",
  type: "open",
  description: "Image appears \"zoomed in\" when in VR mode. See \n\
[VR mode seems \"zoomed in\" with DK2 · Issue #72 · capnmidnight/Primrose](https://github.com/capnmidnight/Primrose/issues/72) \n\
for more information."
});

pliny.issue({
  parent: "Primrose.BrowserEnvironment",
  name: "default light",
  type: "open",
  description: "When the user does not define a scene model file and opts to use the\n\
default scene, make sure a point light is added to the scene so the ground is visible."
});
