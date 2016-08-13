Primrose.BrowserEnvironment = (function () {
  "use strict";

  if (typeof THREE === "undefined") {
    return function () {};
  }

  var MILLISECONDS_TO_SECONDS = 0.001;

  pliny.class({
    parent: "Primrose",
      name: "BrowserEnvironment",
      description: "Make a Virtual Reality app in your web browser!"
  });
  class BrowserEnvironment extends Primrose.AbstractEventEmitter {
    constructor(options) {
      super();
      this.options = patch(options, BrowserEnvironment.DEFAULTS);
      this.options.foregroundColor = this.options.foregroundColor || complementColor(new THREE.Color(this.options.backgroundColor))
        .getHex();

      this.zero = () => {
        if (!this.input.lockMovement) {
          this.input.zero();
          if (this.quality === Primrose.Quality.NONE) {
            this.quality = Primrose.Quality.HIGH;
          }
        }
      };


      var createPickableObject = (obj, includeGeometry) => {
        var geomObj = obj;
        if ((obj.type === "Object3D" || obj.type === "Group") && obj.children[0]) {
          geomObj = obj.children[0];
          geomObj.name = geomObj.name || obj.name;
        }
        var id = geomObj.uuid,
          mLeft = new THREE.Matrix4(),
          mRight = new THREE.Matrix4()
          .identity(),
          mSwap,
          inScene = false,
          lastBag = objectHistory[id],
          update = false,
          disabled = !!obj.disabled,
          bag = {
            uuid: id,
            name: null,
            inScene: null,
            visible: null,
            disabled: null,
            matrix: null,
            geometry: null
          },
          head = geomObj;

        while (head !== null) {
          head.updateMatrix();
          mLeft.copy(head.matrix);
          mLeft.multiply(mRight);
          mSwap = mLeft;
          mLeft = mRight;
          mRight = mSwap;
          head = head.parent;
          inScene = inScene || (head === this.scene);
        }

        if (!lastBag || lastBag.visible !== obj.visible) {
          update = true;
          bag.visible = obj.visible;
        }

        if (!lastBag || lastBag.disabled !== disabled) {
          update = true;
          bag.disabled = disabled;
        }

        var m = mRight.elements.subarray(0, mRight.elements.length),
          mStr = describeMatrix(m);
        if (!lastBag || !lastBag.matrix || describeMatrix(lastBag.matrix) !== mStr) {
          update = true;
          bag.matrix = m;
        }

        if (!lastBag || lastBag.inScene !== inScene) {
          update = true;
          bag.inScene = inScene;
        }

        if (includeGeometry === true) {
          update = true;
          bag.name = obj.name;
          bag.geometry = geomObj.geometry;
        }

        if (update) {
          if (!lastBag) {
            objectHistory[id] = bag;
          }
          else {
            for (var key in bag) {
              lastBag[key] = bag[key];
            }
          }
          return bag;
        }
      };

      function describeMatrix(m) {
        var output = "";
        for (var i = 0; i < m.length; ++i) {
          if (i > 0) {
            output += ",";
          }
          output += m[i];
        }
        return output;
      }


      var objectHistory = {};

      this.registerPickableObject = (obj) => {
        if (obj) {
          var bag = createPickableObject(obj, true),
            verts, faces, uvs, i,
            geometry = bag.geometry;
          // it would be nice to do this the other way around, to have everything
          // stored in ArrayBuffers, instead of regular arrays, to pass to the
          // Worker thread. Maybe later.
          if (geometry instanceof THREE.BufferGeometry) {
            var attr = geometry.attributes,
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
            verts = geometry.vertices.map((v) => v.toArray());
            faces = [];
            uvs = [];
            // IDK why, but non-buffered geometry has an additional array layer
            for (i = 0; i < geometry.faces.length; ++i) {
              var f = geometry.faces[i],
                faceUVs = geometry.faceVertexUvs[0][i];
              faces.push([f.a, f.b, f.c]);
              uvs[f.a] = [faceUVs[0].x, faceUVs[0].y];
              uvs[f.b] = [faceUVs[1].x, faceUVs[1].y];
              uvs[f.c] = [faceUVs[2].x, faceUVs[2].y];
            }
          }

          bag.geometry = {
            uuid: geometry.uuid,
            vertices: verts,
            faces: faces,
            uvs: uvs
          };

          this.pickableObjects[bag.uuid] = obj;
          this.projector.setObject(bag);
        }
      };

      var lastHits = null,
        currentHits = {},
        handleHit = (h) => {
          var dt;
          this.projector.ready = true;
          lastHits = currentHits;
          currentHits = h;
        };

      var update = (t) => {
        var dt = t - lt,
          i, j;
        lt = t;

        movePlayer(dt);
        this.input.resolvePicking(currentHits, lastHits, this.pickableObjects);
        moveSky();
        moveGround();
        this.network.update(dt);
        checkQuality();

        this.emit("update", dt);
      };

      var movePlayer = (dt) => {
        this.input.update(dt);

        if (this.projector.ready) {
          this.projector.ready = false;
          var arr = [],
            del = [];
          for (var key in this.pickableObjects) {
            var obj = this.pickableObjects[key],
              p = createPickableObject(obj);
            if (p) {
              arr.push(p);
              if (p.inScene === false) {
                del.push(key);
              }
            }
          }

          if (arr.length > 0) {
            this.projector.updateObjects(arr);
          }
          for (var i = 0; i < del.length; ++i) {
            delete this.pickableObjects[del[i]];
          }

          this.projector.projectPointers(this.input.segments);
        }
      };

      var moveSky = () => {
        if (this.sky) {
          this.sky.position.copy(this.input.head.position);
        }
      };

      var moveGround = () => {
        if (this.ground) {
          this.ground.position.set(
            Math.floor(this.input.head.position.x), -0.02,
            Math.floor(this.input.head.position.z));
          this.ground.material.needsUpdate = true;
        }
      };

      var animate = (t) => {
        update(t * MILLISECONDS_TO_SECONDS);
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
            Primrose.Entity.eyeBlankAll(i);
            this.camera.projectionMatrix.copy(st.projection);
            this.camera.translateOnAxis(st.translation, 1);
            if (this.options.useNose) {
              this.nose.visible = true;
              this.nose.position.set(side * -0.12, -0.12, -0.15);
              this.nose.rotation.z = side * 0.7;
            }
            this.renderer.setViewport(
              v.left * resolutionScale,
              v.top * resolutionScale,
              v.width * resolutionScale,
              v.height * resolutionScale);
            this.renderer.render(this.scene, this.camera);
            this.camera.translateOnAxis(st.translation, -1);
          }
          this.input.VR.currentDevice.submitFrame(this.input.VR.currentPose);
        }

        if (!this.input.VR.isPresenting || (this.input.VR.canMirror && !this.options.disableMirroring)) {
          this.nose.visible = false;
          this.camera.fov = this.options.defaultFOV;
          this.camera.aspect = this.renderer.domElement.width / this.renderer.domElement.height;
          this.camera.updateProjectionMatrix();
          this.renderer.clear(true, true, true);
          this.renderer.setViewport(0, 0, this.renderer.domElement.width, this.renderer.domElement.height);
          this.renderer.render(this.scene, this.camera);
        }
      };

      var modifyScreen = () => {
        var p = this.input.VR.getTransforms(
          this.options.nearPlane,
          this.options.nearPlane + this.options.drawDistance);

        if (p) {
          var canvasWidth = 0,
            canvasHeight = 0;

          for (var i = 0; i < p.length; ++i) {
            canvasWidth += p[i].viewport.width;
            canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
          }
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
        skin = Primrose.Random.item(Primrose.SKIN_VALUES),
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
          div: Primrose.Controls.HtmlDoc,
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
          this.registerPickableObject(elem);
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
              brick(0xff0000, 1, 1, 1), {
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
              brick(0xff0000, 1, 1, 1), {
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

      this.audio = new Primrose.Output.Audio3D();
      var audioReady = null,
        ocean = null;
      if (this.options.ambientSound && !isMobile) {
        audioReady = this.audio.load3DSound(this.options.ambientSound, true, -1, 1, -1)
          .then((aud) => {
            ocean = aud;
            if (!(ocean.source instanceof MediaElementAudioSourceNode)) {
              ocean.volume.gain.value = 0.1;
              console.log(ocean.source);
              ocean.source.start();
            }
          })
          .catch(console.error.bind(console, "Audio3D loadSource"));
      }
      else {
        audioReady = Promise.resolve();
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

      this.music = new Primrose.Output.Music(this.audio.context);

      this.pickableObjects = {};

      this.projector = new Primrose.Workerize(Primrose.Projector);

      this.nose = textured(sphere(0.05, 10, 10), skin);
      this.nose.name = "Nose";
      this.nose.scale.set(0.5, 1, 1);

      this.options.scene = this.scene = this.options.scene || new THREE.Scene();
      if (this.options.useFog) {
        this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
      }

      this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);
      if (this.options.skyTexture !== undefined) {
        this.sky = textured(
          shell(
            this.options.drawDistance,
            18,
            9,
            Math.PI * 2,
            Math.PI),
          this.options.skyTexture, {
            unshaded: true
          });
        this.sky.name = "Sky";
        this.scene.add(this.sky);
      }

      if (this.options.groundTexture !== undefined) {
        var dim = 10,
          gm = new THREE.PlaneGeometry(dim * 5, dim * 5, dim, dim);
        this.ground = textured(gm, this.options.groundTexture, {
          txtRepeatS: dim * 5,
          txtRepeatT: dim * 5
        });
        if (this.options.sceneModel !== undefined) {
          this.ground.position.y = -0.02;
        }
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.name = "Ground";
        this.scene.add(this.ground);
        this.registerPickableObject(this.ground);
      }

      this.camera.add(this.nose);

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

      put(light(0xffffff, 1.5, 50))
        .on(this.scene)
        .at(0, 10, 10);

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
          console.log("connecting", index)
          this.input.VR.connect(index);
          this.input.VR.requestPresent([{
              source: this.renderer.domElement
            }])
            .catch((exp) => console.error("whaaat", exp))
            .then(() => this.renderer.domElement.focus());
        }
      };

      var addAvatar = (user) => {
        this.scene.add(user.stage);
        this.scene.add(user.head);
      };

      var removeAvatar = (user) => {
        this.scene.remove(user.stage);
        this.scene.remove(user.head);
      };

      var showHideButtons = () => {
        var hide = this.input.VR.isPresenting,
          elem = this.renderer.domElement.nextElementSibling;
        while (elem) {
          if (hide) {
            elem.dataset.originaldisplay = elem.style.display;
            elem.style.display = "none";
          }
          else {
            elem.style.display = elem.dataset.originaldisplay;
          }
          elem = elem.nextElementSibling;
        }
      };

      var fixPointerLock = () => {
        if (this.input.VR.isPresenting && !PointerLock.isActive) {
          PointerLock.request(this.input.VR.currentCanvas);
        }
      }

      window.addEventListener("keydown", (evt) => {
        if (this.input.VR.isPresenting) {
          if (evt.keyCode === Primrose.Keys.ESCAPE && !this.input.VR.isPolyfilled) {
            this.input.VR.cancel();
          }
          else {
            fixPointerLock();
          }
        }
      });

      PointerLock.addChangeListener((evt) => {
        if (this.input.VR.isPresenting && !PointerLock.isActive) {
          this.input.VR.cancel();
        }
      });

      window.addEventListener("mousedown", fixPointerLock);


      window.addEventListener("vrdisplaypresentchange", (evt) => {
        if (!this.input.VR.isPresenting) {
          this.input.VR.cancel();
        }
        showHideButtons();
        modifyScreen();
      });
      window.addEventListener("resize", modifyScreen, false);
      window.addEventListener("blur", this.stop, false);
      window.addEventListener("focus", this.start, false);

      this.projector.addEventListener("hit", handleHit, false);

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

        this.renderer.domElement.addEventListener('webglcontextlost', this.stop, false);
        this.renderer.domElement.addEventListener('webglcontextrestored', this.start, false);

        this.input = new Primrose.Input.FPSInput(this.renderer.domElement, this.options);
        this.input.addEventListener("zero", this.zero, false);
        window.addEventListener("paste", this.input.Keyboard.withCurrentControl("readClipboard"), false);
        window.addEventListener("wheel", this.input.Keyboard.withCurrentControl("readWheel"), false);


        this.input.Keyboard.operatingSystem = this.options.os;
        this.input.Keyboard.codePage = this.options.language;

        this.input.head.add(this.camera);

        this.network = new Primrose.Network.Manager(this.input, this.audio, factories, this.options);
        this.network.addEventListener("addavatar", addAvatar);
        this.network.addEventListener("removeavatar", removeAvatar);

        return this.input.ready;
      });

      var frameCount = 0,
        frameTime = 0,
        NUM_FRAMES = 10,
        LEAD_TIME = 2000,
        lastQualityChange = 0,
        dq1 = 0,
        dq2 = 0;

      var checkQuality = () => {
        if (this.options.autoScaleQuality &&
          // don't check quality if we've already hit the bottom of the barrel.
          this.quality !== Primrose.Quality.NONE) {
          if (frameTime < lastQualityChange + LEAD_TIME) {
            // wait a few seconds before testing quality
            frameTime = performance.now();
          }
          else {
            ++frameCount;
            if (frameCount === NUM_FRAMES) {
              var now = performance.now(),
                dt = (now - frameTime) * 0.001,
                fps = Math.round(NUM_FRAMES / dt);
              frameTime = now;
              frameCount = 0;
              // save the last change
              dq2 = dq1;

              // if we drop low, decrease quality
              if (fps < 45) {
                dq1 = -1;
              }
              else if (
                // don't upgrade on mobile devices
                !isMobile &&
                // don't upgrade if the user says not to
                this.options.autoRescaleQuality &&
                //good speed
                fps >= 60 &&
                // still room to grow
                this.quality < Primrose.Quality.MAXIMUM &&
                // and the last change wasn't a downgrade
                dq2 !== -1) {
                dq1 = 1;
              }
              else {
                dq1 = 0;
              }
              if (dq1 !== 0) {
                this.quality += dq1;
              }
              lastQualityChange = now;
            }
          }
        }
      };

      var allReady = Promise.all([
          modelsReady,
          audioReady,
          documentReady
        ])
        .then(() => {
          this.renderer.domElement.style.cursor = "default";
          this.input.VR.displays[0].DOMElement = this.renderer.domElement;
          this.input.VR.connect(0);
          this.emit("ready");
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
            if (0 <= v && v < Primrose.RESOLUTION_SCALES.length) {
              this.options.quality = v;
              WebVRConfig.BUFFER_SCALE = resolutionScale = Primrose.RESOLUTION_SCALES[v];
            }
            allReady.then(modifyScreen);
          }
        }
      });

      this.quality = this.options.quality;

      if (window.alert.toString()
        .indexOf("native code") > -1) {
        // overwrite the native alert functions so they can't be called while in
        // fullscreen VR mode.

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

    connect(socket, userName) {
      return this.network && this.network.connect(socket, userName);
    }

    disconnect() {
      return this.network && this.network.disconnect();
    }

    get displays() {
      return this.input.VR.displays;
    }
  }

  BrowserEnvironment.DEFAULTS = {
    antialias: true,
    autoScaleQuality: true,
    autoRescaleQuality: false,
    quality: Primrose.Quality.MAXIMUM,
    useNose: false,
    useLeap: false,
    useFog: false,
    avatarHeight: 1.65,
    walkSpeed: 2,
    // The acceleration applied to falling objects.
    gravity: 9.8,
    // The amount of time in seconds to require gazes on objects before triggering the gaze event.
    gazeLength: 1,
    // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
    disableMirroring: false,
    // By default, a single light is added to the scene,
    disableDefaultLighting: false,
    // The color that WebGL clears the background with before drawing.
    backgroundColor: 0xafbfff,
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
    scene: null
  };

  return BrowserEnvironment;
})();