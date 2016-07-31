"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.BrowserEnvironment = function () {
  "use strict";

  if (typeof THREE === "undefined") {
    return function () {};
  }

  var MILLISECONDS_TO_SECONDS = 0.001,
      RIGHT = new THREE.Vector3(1, 0, 0),
      UP = new THREE.Vector3(0, 1, 0),
      FORWARDED_EVENTS = ["keydown", "keyup", "keypress", "mousedown", "mouseup", "mousemove", "wheel", "touchstart", "touchend", "touchmove"];

  pliny.class({
    parent: "Primrose",
    name: "BrowserEnvironment",
    description: "Make a Virtual Reality app in your web browser!"
  });

  var BrowserEnvironment = function () {
    function BrowserEnvironment(name, options) {
      var _this = this,
          _arguments = arguments;

      _classCallCheck(this, BrowserEnvironment);

      this.id = name;

      this.options = patch(options, BrowserEnvironment.DEFAULTS);
      this.options.foregroundColor = this.options.foregroundColor || complementColor(new THREE.Color(this.options.backgroundColor)).getHex();

      this.addEventListener = function (event, thunk, bubbles) {
        if (_this.listeners[event]) {
          _this.listeners[event].push(thunk);
        } else if (FORWARDED_EVENTS.indexOf(event) >= 0) {
          window.addEventListener(event, thunk, bubbles);
        }
      };

      this.zero = function () {
        if (!_this.input.lockMovement) {
          _this.input.zero();
          if (_this.quality === Primrose.Quality.NONE) {
            _this.quality = Primrose.Quality.HIGH;
          }
        }
      };

      var createPickableObject = function createPickableObject(obj, includeGeometry) {
        var geomObj = obj;
        if ((obj.type === "Object3D" || obj.type === "Group") && obj.children[0]) {
          geomObj = obj.children[0];
          geomObj.name = geomObj.name || obj.name;
        }
        var id = geomObj.uuid,
            mLeft = new THREE.Matrix4(),
            mRight = new THREE.Matrix4().identity(),
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
          inScene = inScene || head === _this.scene;
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
          } else {
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

      this.registerPickableObject = function (obj) {
        if (obj) {
          var bag = createPickableObject(obj, true),
              verts,
              faces,
              uvs,
              i,
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
            } else {
              for (i = 0; i < pos.count; i += 3) {
                faces.push([i, i + 1, i + 2]);
              }
            }
          } else {
            verts = geometry.vertices.map(function (v) {
              return v.toArray();
            });
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

          _this.pickableObjects[bag.uuid] = obj;
          _this.projector.setObject(bag);
        }
      };

      var lastHits = null,
          currentHits = {},
          handleHit = function handleHit(h) {
        var dt;
        _this.projector.ready = true;
        lastHits = currentHits;
        currentHits = h;
      };

      var update = function update(t) {
        var dt = t - lt,
            i,
            j,
            avatarHeight = _this.options.avatarHeight;
        lt = t;

        if (_this.input.VR.stage) {
          _this.scene.applyMatrix(_this.input.VR.stage.matrix);
          avatarHeight = _this.scene.position.y;
          _this.scene.position.y = 0;
          _this.scene.updateMatrix();
        }

        movePlayer(dt, avatarHeight);
        _this.input.resolvePicking(currentHits, lastHits, _this.pickableObjects);
        moveSky();
        moveGround();
        _this.network.update(dt);
        checkQuality();

        emit.call(_this, "update", dt);
      };

      var movePlayer = function movePlayer(dt, avatarHeight) {
        _this.input.update(dt, avatarHeight);

        if (_this.projector.ready) {
          _this.projector.ready = false;
          var arr = [],
              del = [];
          for (var key in _this.pickableObjects) {
            var obj = _this.pickableObjects[key],
                p = createPickableObject(obj);
            if (p) {
              arr.push(p);
              if (p.inScene === false) {
                del.push(key);
              }
            }
          }

          if (arr.length > 0) {
            _this.projector.updateObjects(arr);
          }
          for (var i = 0; i < del.length; ++i) {
            delete _this.pickableObjects[del[i]];
          }

          _this.projector.projectPointers(_this.input.segments);
        }
      };

      var moveSky = function moveSky() {
        if (_this.sky) {
          _this.sky.position.copy(_this.input.head.position);
        }
      };

      var moveGround = function moveGround() {
        if (_this.ground) {
          _this.ground.position.set(Math.floor(_this.input.head.position.x), -0.02, Math.floor(_this.input.head.position.z));
          _this.ground.material.needsUpdate = true;
        }
      };

      var animate = function animate(t) {
        update(t * MILLISECONDS_TO_SECONDS);
        render();
        RAF(animate);
      };

      var render = function render() {
        _this.camera.position.set(0, 0, 0);
        _this.camera.quaternion.set(0, 0, 0, 1);
        _this.audio.setPlayer(_this.input.head.mesh);
        if (_this.input.VR.isPresenting) {
          _this.renderer.clear(true, true, true);

          var trans = _this.input.VR.getTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);
          for (var i = 0; trans && i < trans.length; ++i) {
            var st = trans[i],
                v = st.viewport,
                side = 2 * i - 1;
            Primrose.Entity.eyeBlankAll(i);
            _this.camera.projectionMatrix.copy(st.projection);
            _this.camera.translateOnAxis(st.translation, 1);
            if (_this.options.useNose) {
              _this.nose.visible = true;
              _this.nose.position.set(side * -0.12, -0.12, -0.15);
              _this.nose.rotation.z = side * 0.7;
            }
            _this.renderer.setViewport(v.left * resolutionScale, v.top * resolutionScale, v.width * resolutionScale, v.height * resolutionScale);
            _this.renderer.render(_this.scene, _this.camera);
            _this.camera.translateOnAxis(st.translation, -1);
          }
          _this.input.VR.currentDevice.submitFrame(_this.input.VR.currentPose);
        }

        if (!_this.input.VR.isPresenting || _this.input.VR.canMirror && !_this.options.disableMirroring) {
          _this.nose.visible = false;
          _this.camera.fov = _this.options.defaultFOV;
          _this.camera.aspect = _this.renderer.domElement.width / _this.renderer.domElement.height;
          _this.camera.updateProjectionMatrix();
          _this.renderer.clear(true, true, true);
          _this.renderer.setViewport(0, 0, _this.renderer.domElement.width, _this.renderer.domElement.height);
          _this.renderer.render(_this.scene, _this.camera);
        }
      };

      var modifyScreen = function modifyScreen() {
        var p = _this.input.VR.getTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);

        if (p) {
          var canvasWidth = 0,
              canvasHeight = 0;

          for (var i = 0; i < p.length; ++i) {
            canvasWidth += p[i].viewport.width;
            canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
          }
          canvasWidth = Math.floor(canvasWidth * resolutionScale);
          canvasHeight = Math.floor(canvasHeight * resolutionScale);

          _this.renderer.domElement.width = canvasWidth;
          _this.renderer.domElement.height = canvasHeight;
          if (!_this.timer) {
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
          create: function create() {
            return new Primrose.Text.Controls.TextBox({
              tokenizer: Primrose.Text.Grammars.PlainText,
              hideLineNumbers: true,
              readOnly: true
            });
          }
        }
      };

      this.factories = factories;

      this.createElement = function (type) {
        if (factories[type]) {
          return factories[type].create();
        }
      };

      this.appendChild = function (elem) {
        if (elem instanceof THREE.Mesh) {
          _this.scene.add(elem);
          _this.registerPickableObject(elem);
        } else {
          return elem.addToBrowserEnvironment(_this, _this.scene);
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
        while (hsl.h > 1) {
          hsl.h -= 1;
        }rgb.setHSL(hsl.h, hsl.s, hsl.l);
        return rgb;
      }

      var modelsReady = Primrose.ModelLoader.loadObjects(modelFiles).then(function (models) {
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
          _this.buttonFactory = new Primrose.ButtonFactory(models.button, _this.options.button.options);
        } else {
          _this.buttonFactory = new Primrose.ButtonFactory(brick(0xff0000, 1, 1, 1), {
            maxThrow: 0.1,
            minDeflection: 10,
            colorUnpressed: 0x7f0000,
            colorPressed: 0x007f00,
            toggle: true
          });
        }
      }).catch(function (err) {
        console.error(err);
        if (!_this.buttonFactory) {
          _this.buttonFactory = new Primrose.ButtonFactory(brick(0xff0000, 1, 1, 1), {
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
      this.listeners = {
        ready: [],
        update: [],
        gazestart: [],
        gazecomplete: [],
        gazecancel: [],
        pointerstart: [],
        pointermove: [],
        pointerend: [],
        authorizationfailed: [],
        authorizationsucceeded: [],
        loggedout: []
      };

      this.audio = new Primrose.Output.Audio3D();
      var audioReady = null,
          ocean = null;
      if (this.options.ambientSound && !isMobile) {
        audioReady = this.audio.load3DSound(this.options.ambientSound, true, -1, 1, -1).then(function (aud) {
          ocean = aud;
          if (!(ocean.source instanceof MediaElementAudioSourceNode)) {
            ocean.volume.gain.value = 0.1;
            console.log(ocean.source);
            ocean.source.start();
          }
        }).catch(console.error.bind(console, "Audio3D loadSource"));
      } else {
        audioReady = Promise.resolve();
      }

      var documentReady = null;
      if (document.readyState === "complete") {
        documentReady = Promise.resolve("already");
      } else {
        documentReady = new Promise(function (resolve, reject) {
          document.addEventListener("readystatechange", function (evt) {
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
        this.sky = textured(shell(this.options.drawDistance, 18, 9, Math.PI * 2, Math.PI), this.options.skyTexture, {
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

      var buildScene = function buildScene(sceneGraph) {
        sceneGraph.buttons = [];
        sceneGraph.traverse(function (child) {
          if (child.isButton) {
            sceneGraph.buttons.push(new Primrose.Controls.Button3D(child.parent, child.name));
          }
          if (child.name) {
            sceneGraph[child.name] = child;
          }
        });
        _this.scene.add.apply(_this.scene, sceneGraph.children);
        _this.scene.traverse(function (obj) {
          if (_this.options.disableDefaultLighting && obj.material && obj.material.map) {
            textured(obj, obj.material.map, {
              unshaded: true
            });
          }
          if (obj.name) {
            _this.scene[obj.name] = obj;
          }
        });
        if (sceneGraph.Camera) {
          _this.camera.position.copy(sceneGraph.Camera.position);
          _this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
        }
        return sceneGraph;
      };

      put(light(0xffffff, 1.5, 50)).on(this.scene).at(0, 10, 10);

      var currentTimerObject = null;
      this.timer = 0;
      var RAF = function RAF(callback) {
        currentTimerObject = _this.input.VR.currentDevice || window;
        if (_this.timer !== null) {
          _this.timer = currentTimerObject.requestAnimationFrame(callback);
        }
      };

      //
      // Manage full-screen state
      //
      this.goFullScreen = function (index, evt) {
        if (evt !== "Gaze") {
          console.log("connecting", index);
          _this.input.VR.connect(index);
          _this.input.VR.requestPresent([{
            source: _this.renderer.domElement
          }]).catch(function (exp) {
            return console.error("whaaat", exp);
          }).then(function () {
            return _this.renderer.domElement.focus();
          });
        }
      };

      var addAvatar = function addAvatar(user) {
        _this.scene.add(user.stage);
        _this.scene.add(user.head);
      };

      var removeAvatar = function removeAvatar(user) {
        _this.scene.remove(user.stage);
        _this.scene.remove(user.head);
      };

      var showHideButtons = function showHideButtons() {
        var hide = _this.input.VR.isPresenting,
            elem = _this.renderer.domElement.nextElementSibling;
        while (elem) {
          if (hide) {
            elem.dataset.originaldisplay = elem.style.display;
            elem.style.display = "none";
          } else {
            elem.style.display = elem.dataset.originaldisplay;
          }
          elem = elem.nextElementSibling;
        }
      };

      var fixPointerLock = function fixPointerLock() {
        if (_this.input.VR.isPresenting && !PointerLock.isActive) {
          PointerLock.request(_this.input.VR.currentCanvas);
        }
      };

      window.addEventListener("keydown", function (evt) {
        if (_this.input.VR.isPresenting) {
          if (evt.keyCode === Primrose.Keys.ESCAPE && !_this.input.VR.isPolyfilled) {
            _this.input.VR.cancel();
          } else {
            fixPointerLock();
          }
        }
      });

      PointerLock.addChangeListener(function (evt) {
        if (_this.input.VR.isPresenting && !PointerLock.isActive) {
          _this.input.VR.cancel();
        }
      });

      window.addEventListener("mousedown", fixPointerLock);

      window.addEventListener("vrdisplaypresentchange", function (evt) {
        if (!_this.input.VR.isPresenting) {
          _this.input.VR.cancel();
        }
        showHideButtons();
        modifyScreen();
      });
      window.addEventListener("resize", modifyScreen, false);
      window.addEventListener("blur", this.stop, false);
      window.addEventListener("focus", this.start, false);

      this.projector.addEventListener("hit", handleHit, false);

      documentReady = documentReady.then(function () {
        if (_this.options.renderer) {
          _this.renderer = _this.options.renderer;
        } else {
          _this.renderer = new THREE.WebGLRenderer({
            canvas: Primrose.DOM.cascadeElement(_this.options.canvasElement, "canvas", HTMLCanvasElement),
            context: _this.options.context,
            antialias: _this.options.antialias,
            alpha: true,
            logarithmicDepthBuffer: false
          });
          _this.renderer.autoClear = false;
          _this.renderer.autoSortObjects = true;
          _this.renderer.setClearColor(_this.options.backgroundColor);
          if (!_this.renderer.domElement.parentElement) {
            document.body.appendChild(_this.renderer.domElement);
          }
        }

        _this.renderer.domElement.addEventListener('webglcontextlost', _this.stop, false);
        _this.renderer.domElement.addEventListener('webglcontextrestored', _this.start, false);

        _this.input = new Primrose.Input.FPSInput(_this.renderer.domElement, _this.options);
        _this.input.addEventListener("zero", _this.zero, false);
        window.addEventListener("paste", _this.input.Keyboard.withCurrentControl("readClipboard"), false);
        window.addEventListener("wheel", _this.input.Keyboard.withCurrentControl("readWheel"), false);

        _this.input.Keyboard.operatingSystem = _this.options.os;
        _this.input.Keyboard.codePage = _this.options.language;

        _this.input.head.add(_this.camera);

        if (_this.options.serverPath === undefined) {
          var protocol = location.protocol.replace("http", "ws");
          _this.options.serverPath = protocol + "//" + location.hostname;
        }
        _this.network = new Primrose.Network.Manager(_this.options.serverPath, _this.input, _this.audio, factories, _this.options);
        _this.network.addEventListener("addavatar", addAvatar);
        _this.network.addEventListener("removeavatar", removeAvatar);
        _this.network.addEventListener("authorizationsucceeded", emit.bind(_this, "authorizationsucceeded"));
        _this.network.addEventListener("authorizationfailed", emit.bind(_this, "authorizationfailed"));

        _this.authenticate = _this.network.authenticate.bind(_this.network, _this.id);

        return _this.input.ready;
      });

      var frameCount = 0,
          frameTime = 0,
          NUM_FRAMES = 10,
          LEAD_TIME = 2000,
          lastQualityChange = 0,
          dq1 = 0,
          dq2 = 0;

      var checkQuality = function checkQuality() {
        if (_this.options.autoScaleQuality &&
        // don't check quality if we've already hit the bottom of the barrel.
        _this.quality !== Primrose.Quality.NONE) {
          if (frameTime < lastQualityChange + LEAD_TIME) {
            // wait a few seconds before testing quality
            frameTime = performance.now();
          } else {
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
              } else if (
              // don't upgrade on mobile devices
              !isMobile &&
              // don't upgrade if the user says not to
              _this.options.autoRescaleQuality &&
              //good speed
              fps >= 60 &&
              // still room to grow
              _this.quality < Primrose.Quality.MAXIMUM &&
              // and the last change wasn't a downgrade
              dq2 !== -1) {
                dq1 = 1;
              } else {
                dq1 = 0;
              }
              if (dq1 !== 0) {
                _this.quality += dq1;
              }
              lastQualityChange = now;
            }
          }
        }
      };

      var allReady = Promise.all([modelsReady, audioReady, documentReady]).then(function () {
        _this.renderer.domElement.style.cursor = "default";
        _this.input.VR.displays[0].DOMElement = _this.renderer.domElement;
        _this.input.VR.connect(0);
        emit.call(_this, "ready");
      });

      this.start = function () {
        allReady.then(function () {
          _this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          RAF(animate);
        });
      };

      this.stop = function () {
        if (currentTimerObject) {
          currentTimerObject.cancelAnimationFrame(_this.timer);
          _this.audio.stop();
          _this.timer = null;
        }
      };

      Object.defineProperties(this, {
        quality: {
          get: function get() {
            return _this.options.quality;
          },
          set: function set(v) {
            if (0 <= v && v < Primrose.RESOLUTION_SCALES.length) {
              _this.options.quality = v;
              WebVRConfig.BUFFER_SCALE = resolutionScale = Primrose.RESOLUTION_SCALES[v];
            }
            allReady.then(modifyScreen);
          }
        }
      });

      this.quality = this.options.quality;

      if (window.alert.toString().indexOf("native code") > -1) {
        // overwrite the native alert functions so they can't be called while in
        // fullscreen VR mode.

        var rerouteDialog = function rerouteDialog(oldFunction, newFunction) {
          if (!newFunction) {
            newFunction = function newFunction() {};
          }
          return function () {
            if (_this.input.VR.isPresenting) {
              newFunction();
            } else {
              oldFunction.apply(window, _arguments);
            }
          };
        };

        window.alert = rerouteDialog(window.alert);
        window.confirm = rerouteDialog(window.confirm);
        window.prompt = rerouteDialog(window.prompt);
      }

      this.start();
    }

    _createClass(BrowserEnvironment, [{
      key: "displays",
      get: function get() {
        return this.input.VR.displays;
      }
    }]);

    return BrowserEnvironment;
  }();

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
}();