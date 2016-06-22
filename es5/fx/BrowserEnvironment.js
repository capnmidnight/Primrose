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
      var _this = this;

      _classCallCheck(this, BrowserEnvironment);

      this.options = patch(options, BrowserEnvironment.DEFAULTS);

      if (this.options.foregroundColor === undefined || this.options.foregroundColor === null) {
        this.options.foregroundColor = complementColor(new THREE.Color(this.options.backgroundColor)).getHex();
      }

      this.id = name;

      var fire = emit.bind(this);

      this.addEventListener = function (event, thunk, bubbles) {
        if (_this.listeners[event]) {
          _this.listeners[event].push(thunk);
        } else if (FORWARDED_EVENTS.indexOf(event) >= 0) {
          window.addEventListener(event, thunk, bubbles);
        }
      };

      var lockedToEditor = function lockedToEditor() {
        return _this.currentControl && _this.currentControl.lockMovement;
      };

      this.zero = function () {
        if (!lockedToEditor()) {
          _this.player.position.set(0, _this.avatarHeight, 0);
          _this.player.velocity.set(0, 0, 0);
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

      var update = function update(t) {
        var dt = t - lt,
            i,
            j;
        lt = t;

        movePlayer(dt);
        updateNetwork(dt);
        moveSky();
        moveGround();
        _this.pointer.move(lockedToEditor(), _this.inVR, qHeading, _this.camera, _this.player);
        resolvePicking();
        checkQuality();

        fire("update", dt);
      };

      var updateNetwork = function updateNetwork(dt) {
        if (socket && deviceIndex === 0) {
          lastNetworkUpdate += dt;
          if (lastNetworkUpdate >= Primrose.RemoteUser.NETWORK_DT) {
            lastNetworkUpdate -= Primrose.RemoteUser.NETWORK_DT;
            var newState = [_this.player.heading, _this.player.position.x, _this.player.position.y - _this.avatarHeight, _this.player.position.z, _this.player.qHead.x, _this.player.qHead.y, _this.player.qHead.z, _this.player.qHead.w, _this.input.VR.getValue("headX"), _this.input.VR.getValue("headY") + _this.avatarHeight, _this.input.VR.getValue("headZ")];
            for (var i = 0; i < newState.length; ++i) {
              if (oldState[i] !== newState[i]) {
                socket.emit("userState", newState);
                oldState = newState;
                break;
              }
            }
          }
        }
        for (var key in users) {
          var user = users[key];
          user.update(dt);
        }
      };

      var movePlayer = function movePlayer(dt) {

        _this.input.update();
        _this.player.heading = _this.input.getValue("heading");
        var pitch = _this.input.getValue("pitch"),
            strafe = _this.input.getValue("strafe"),
            drive = _this.input.getValue("drive"),
            boost = _this.input.getValue("boost");

        _this.input.VR.getOrientation(_this.player.qHead);

        qPitch.setFromAxisAngle(RIGHT, pitch);

        if (!lockedToEditor()) {
          if (_this.player.velocity.y === 0 && boost > 0) {
            _this.player.isOnGround = false;
          }

          _this.player.velocity.y += boost;
        }

        if (!_this.player.isOnGround) {
          _this.player.velocity.y -= _this.options.gravity * dt;
        } else if (!lockedToEditor()) {
          _this.player.velocity.set(strafe, 0, drive).normalize().multiplyScalar(_this.walkSpeed);

          qHeading.setFromAxisAngle(UP, currentHeading);
          _this.player.velocity.applyQuaternion(_this.player.qHead);
          _this.player.velocity.y = 0;
          _this.player.velocity.applyQuaternion(qHeading);
        }
        _this.player.position.add(vBody.copy(_this.player.velocity).multiplyScalar(dt));

        if (!_this.player.isOnGround && _this.player.position.y < _this.avatarHeight) {
          _this.player.isOnGround = true;
          _this.player.position.y = _this.avatarHeight;
          _this.player.velocity.y = 0;
        }

        if (_this.inVR) {
          var dHeading = _this.player.heading - currentHeading;
          if (!lockedToEditor() && Math.abs(dHeading) > Math.PI / 5) {
            var dh = Math.sign(dHeading) * Math.PI / 100;
            currentHeading += dh;
            _this.player.heading -= dh;
            dHeading = _this.player.heading - currentHeading;
          }
          _this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          qHeading.setFromAxisAngle(UP, dHeading).multiply(qPitch);
        } else {
          currentHeading = _this.player.heading;
          _this.player.quaternion.setFromAxisAngle(UP, currentHeading);
          _this.player.quaternion.multiply(qPitch);
        }
      };

      var moveSky = function moveSky() {
        if (_this.sky) {
          _this.sky.position.copy(_this.player.position);
        }
      };

      var moveGround = function moveGround() {
        if (_this.ground) {
          _this.ground.position.x = Math.floor(_this.player.position.x);
          _this.ground.position.z = Math.floor(_this.player.position.z);
          _this.ground.material.needsUpdate = true;
        }
      };

      var pointerStart = function pointerStart(name) {
        if (!(name === "keyboard" && lockedToEditor())) {
          if (currentHit) {
            var object = _this.pickableObjects[currentHit.objectID];
            if (object) {
              var control = object.button || object.surface;
              fire("pointerstart", currentHit);
              emit.call(object, "click");

              if (_this.currentControl && _this.currentControl !== control) {
                _this.currentControl.blur();
                _this.currentControl = null;
              }

              if (!_this.currentControl && control) {
                _this.currentControl = control;
                _this.currentControl.focus();
              } else if (object === _this.ground) {
                _this.player.position.copy(_this.pointer.groundMesh.position);
                _this.player.position.y = _this.avatarHeight;
                _this.player.isOnGround = false;
              }

              if (_this.currentControl) {
                _this.currentControl.startUV(currentHit.point);
              }
            }
          } else if (_this.currentControl) {
            _this.currentControl.blur();
            _this.currentControl = null;
          }
        }
      };

      var pointerEnd = function pointerEnd(name) {
        if (!(name === "keyboard" && lockedToEditor()) && currentHit) {
          var object = _this.pickableObjects[currentHit.objectID];
          if (object) {
            var control = object.button || object.surface;
            fire("pointerend", lastHit);

            if (_this.currentControl) {
              _this.currentControl.endPointer();
            }
          }
        }
      };

      var resolvePicking = function resolvePicking() {

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

          _this.projector.projectPointer([_this.pointer.position.toArray(), transformForPicking(_this.player)]);
        }

        var lastButtons = _this.input.getValue("dButtons");
        if (currentHit) {
          var object = _this.pickableObjects[currentHit.objectID];

          _this.pointer.registerHit(currentHit, _this.player, object === _this.ground);

          if (object) {
            var buttons = _this.input.getValue("buttons"),
                clickChanged = lastButtons !== 0,
                control = object.button || object.surface;

            if (!lockedToEditor()) {
              buttons |= _this.input.Keyboard.getValue("select");
              clickChanged = clickChanged || _this.input.Keyboard.getValue("dSelect") !== 0;
            }

            if (!clickChanged && buttons > 0) {
              if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
                fire("pointermove", currentHit);
              }
              if (_this.currentControl && currentHit.point) {
                _this.currentControl.moveUV(currentHit.point);
              }
            }
          }
        } else {
          _this.pointer.reset();
        }
      };

      var animate = function animate(t) {
        WebVRBootstrapper.dispalyPresentChangeCheck();
        RAF(animate);
        update(t * MILLISECONDS_TO_SECONDS);
        render();
      };

      var eyeCounter = 0,
          blankEye = false;
      var render = function render() {
        if (_this.inVR && _this.input.VR.currentPose) {
          _this.renderer.clear(true, true, true);
          var trans = _this.input.VR.transforms;
          for (var i = 0; trans && i < trans.length; ++i) {
            var st = trans[i],
                v = st.viewport,
                side = 2 * i - 1;
            Primrose.Entity.eyeBlankAll(i);
            _this.input.getVector3("headX", "headY", "headZ", _this.camera.position);
            _this.camera.projectionMatrix.copy(st.projection);
            vEye.set(0, 0, 0);
            vEye.applyMatrix4(st.translation);
            vEye.applyQuaternion(_this.player.qHead);
            _this.camera.position.add(vEye);
            _this.camera.quaternion.copy(_this.player.qHead);
            if (_this.options.useNose) {
              _this.nose.visible = true;
              _this.nose.position.set(side * -0.12, -0.12, -0.15);
              _this.nose.rotation.z = side * 0.7;
            }
            _this.renderer.setViewport(v.left * resolutionScale, v.top * resolutionScale, v.width * resolutionScale, v.height * resolutionScale);
            _this.renderer.render(_this.scene, _this.camera);
          }
          _this.input.VR.currentDisplay.submitFrame(_this.input.VR.currentPose);
        }

        _this.audio.setPlayer(_this.camera);

        if (!_this.inVR || _this.input.VR.currentDisplay.capabilities.hasExternalDisplay && !_this.options.disableMirroring) {
          if (blankEye) {
            eyeCounter = 1 - eyeCounter;
            Primrose.Entity.eyeBlankAll(eyeCounter);
          }
          _this.nose.visible = false;
          _this.camera.fov = _this.options.defaultFOV;
          _this.camera.aspect = _this.renderer.domElement.width / _this.renderer.domElement.height;
          _this.camera.updateProjectionMatrix();
          _this.camera.position.set(0, 0, 0);
          _this.camera.quaternion.copy(_this.player.qHead);
          _this.renderer.clear(true, true, true);
          _this.renderer.setViewport(0, 0, _this.renderer.domElement.width, _this.renderer.domElement.height);
          _this.renderer.render(_this.scene, _this.camera);
        }
      };

      var setOrientationLock = function setOrientationLock() {
        if (isFullScreenMode()) {
          var type = screen.orientation && screen.orientation.type || screen.mozOrientation || "";
          if (type.indexOf("landscape") === -1) {
            type = "landscape-primary";
          }
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock(type);
          } else if (screen.mozLockOrientation) {
            screen.mozLockOrientation(type);
          }
        } else {
          if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
          } else if (screen.mozUnlockOrientation) {
            screen.mozUnlockOrientation();
          }
        }
      };

      var modifyScreen = function modifyScreen() {
        _this.input.VR.resetTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);

        var p = _this.input.VR.transforms;
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
          lastHit = null,
          currentHit = null,
          currentHeading = 0,
          qPitch = new THREE.Quaternion(),
          qHeading = new THREE.Quaternion(),
          vEye = new THREE.Vector3(),
          vBody = new THREE.Vector3(),
          skin = Primrose.Random.item(Primrose.SKIN_VALUES),
          modelFiles = {
        scene: this.options.sceneModel,
        avatar: this.options.avatarModel,
        button: this.options.button && typeof this.options.button.model === "string" && this.options.button.model,
        font: this.options.font
      },
          iconManager = new Primrose.IconManager(this.options),
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
      },
          localAudio = Primrose.DOM.cascadeElement(this.options.audioElement, "audio", HTMLAudioElement),
          micReady = navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(Primrose.Output.Audio3D.setAudioStream.bind(null, localAudio)).catch(console.warn.bind(console, "Can't get audio")),
          users = {},
          socket,
          lastNetworkUpdate = 0,
          oldState = [],
          deviceIndex,
          listUserPromise = Promise.resolve();

      function listUsers(newUsers) {
        Object.keys(users).forEach(removeUser);
        while (newUsers.length > 0) {
          addUser(newUsers.shift());
        }
        fire("authorizationsucceeded");
      }

      var addUser = function addUser(state) {
        var toUserName = state[0],
            user = new Primrose.RemoteUser(toUserName, _this.factories.avatar, _this.options.foregroundColor);
        users[toUserName] = user;
        _this.scene.add(user.avatar);
        updateUser(state);
        listUserPromise = listUserPromise.then(function () {
          return user.peer(socket, micReady, userName, _this.audio);
        }).catch(function (exp) {
          return console.error("Couldn't load user: " + name);
        });
      };

      function receiveChat(evt) {
        console.log("chat", evt);
      }

      var updateUser = function updateUser(state) {
        var key = state[0];
        if (key !== userName) {
          var user = users[key];
          if (user) {
            user.state = state;
          } else {
            console.error("Unknown user", key);
          }
        } else if (deviceIndex > 0) {
          _this.player.heading = state[1];
          _this.player.position.x = state[2];
          _this.player.position.y = state[3] + _this.avatarHeight;
          _this.player.position.z = state[4];
          _this.player.qHead.x = state[5];
          _this.player.qHead.y = state[6];
          _this.player.qHead.z = state[7];
          _this.player.qHead.w = state[8];
        }
      };

      var removeUser = function removeUser(key) {
        console.log("User %s logging off.", key);
        var user = users[key];
        if (user) {
          user.unpeer();
          _this.scene.remove(user.avatar);
          delete users[key];
        }
      };

      function lostConnection() {
        deviceIndex = null;
      }

      function addDevice(index) {
        console.log("addDevice", index);
      }

      function setDeviceIndex(index) {
        deviceIndex = index;
      }

      function authFailed(verb) {
        return function (reason) {
          fire("authorizationfailed", {
            verb: verb,
            reason: reason
          });
        };
      }

      this.authenticate = function (verb, userName, password, email) {
        if (!socket) {
          var protocol = location.protocol.replace("http", "ws"),
              path = protocol + "//" + location.hostname;
          console.log("connecting to: %s", path);
          socket = io.connect(path);
          socket.on("signupFailed", authFailed("signup"));
          socket.on("loginFailed", authFailed("login"));
          socket.on("userList", listUsers);
          socket.on("userJoin", addUser);
          socket.on("deviceAdded", addDevice);
          socket.on("deviceIndex", setDeviceIndex);
          socket.on("chat", receiveChat);
          socket.on("userState", updateUser);
          socket.on("userLeft", removeUser);
          socket.on("logoutComplete", fire.bind(_this, "loggedout"));
          socket.on("connection_lost", lostConnection);
          socket.on("errorDetail", console.error.bind(console));
        }

        socket.once("salt", function (salt) {
          var hash = new Hashes.SHA256().hex(salt + password);
          socket.emit("hash", hash);
        });
        socket.emit(verb, {
          userName: userName,
          email: email,
          app: appKey
        });
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

      var putIconInScene = function putIconInScene(icon, i, arr) {
        var arm = hub();
        arm.add(icon);
        icon.position.z = -1;
        put(arm).on(_this.scene).at(0, _this.options.avatarHeight, 0);
        var wedge = 75 / arr.length;
        arm.rotation.set(0, Math.PI * wedge * ((arr.length - 1) * 0.5 - i) / 180, 0);
        _this.registerPickableObject(icon);
      };

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

      this.player = new THREE.Object3D();
      this.player.name = "Player";
      this.player.position.set(0, this.avatarHeight, 0);
      this.player.velocity = new THREE.Vector3();
      this.player.isOnGround = true;
      this.player.heading = 0;
      this.player.qHead = new THREE.Quaternion();

      this.nose = textured(sphere(0.05, 10, 10), skin);
      this.nose.name = "Nose";
      this.nose.scale.set(0.5, 1, 1);

      this.scene = this.options.scene || new THREE.Scene();
      if (this.options.useFog) {
        this.scene.fog = new THREE.FogExp2(this.options.backgroundColor, 2 / this.options.drawDistance);
      }

      this.pointer = new Primrose.Pointer(this.scene);

      this.camera = new THREE.PerspectiveCamera(75, 1, this.options.nearPlane, this.options.nearPlane + this.options.drawDistance);
      if (this.options.skyTexture !== undefined) {
        this.sky = textured(shell(this.options.drawDistance, 18, 9, Math.PI * 2, Math.PI), this.options.skyTexture, { unshaded: true });
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
      this.player.add(this.camera);
      this.scene.add(this.player);

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
      var RAF = function RAF(callback) {
        currentTimerObject = _this.input.VR.currentDisplay || window;
        _this.timer = currentTimerObject.requestAnimationFrame(callback);
      };

      var handleHit = function handleHit(h) {
        var dt;
        _this.projector.ready = true;
        lastHit = currentHit;
        currentHit = h;
        if (lastHit && currentHit && lastHit.objectID === currentHit.objectID) {
          currentHit.startTime = lastHit.startTime;
          currentHit.gazeFired = lastHit.gazeFired;
          dt = lt - currentHit.startTime;
          if (dt >= _this.options.gazeLength && !currentHit.gazeFired) {
            currentHit.gazeFired = true;
            fire("gazecomplete", currentHit);
          }
        } else {
          if (lastHit) {
            dt = lt - lastHit.startTime;
            if (dt < _this.options.gazeLength) {
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

      var keyDown = function keyDown(evt) {
        if (lockedToEditor()) {
          var elem = _this.currentControl.focusedElement;
          if (elem) {
            if (elem.execCommand) {
              var oldDeadKeyState = _this.operatingSystem._deadKeyState;
              if (elem.execCommand(_this._browser, _this.codePage, _this.operatingSystem.makeCommandName(evt, _this.codePage))) {
                evt.preventDefault();
              }
              if (_this.operatingSystem._deadKeyState === oldDeadKeyState) {
                _this.operatingSystem._deadKeyState = "";
              }
            } else {
              elem.keyDown(evt);
            }
          }
        }
      };

      var keyUp = function keyUp(evt) {
        if (_this.currentControl && _this.currentControl.keyUp) {
          _this.currentControl.keyUp(evt);
        } else if (!evt.shiftKey && !evt.ctrlKey && !evt.altKey && !evt.metaKey) {
          if (evt.keyCode === Primrose.Keys.E) {
            blankEye = false;
          }
        }
      };

      //
      // Manage full-screen state
      //
      this.goFullScreen = function (index) {
        if (index === undefined || typeof index !== "number") {
          index = _this.input.VR.currentDisplayIndex;
        }
        var promise = setPointerLock();
        if (index !== _this.input.VR.currentDisplayIndex || !isFullScreenMode()) {
          var promises = [promise];

          if (isFullScreenMode()) {
            promises.push(_this.input.VR.currentDisplay.exitPresent());
          }

          _this.input.VR.connect(index);

          promises.push(_this.input.VR.requestPresent([{ source: _this.renderer.domElement }]));
          promise = Promise.all(promises).then(function (elem) {
            if (WebVRBootstrapper.Version === 1 && isMobile) {
              var remover = function remover() {
                _this.input.VR.currentDisplay.exitPresent();
                window.removeEventListener("vrdisplaypresentchange", remover);
              };

              var adder = function adder() {
                window.addEventListener("vrdisplaypresentchange", remover, false);
                window.removeEventListener("vrdisplaypresentchange", adder);
              };

              window.addEventListener("vrdisplaypresentchange", adder, false);
            }

            _this.renderer.domElement.focus();
            return elem;
          });
        }

        return promise;
      };

      var showHideButtons = function showHideButtons() {
        var hide = isFullScreenMode();
        iconManager.icons.forEach(function (icon) {
          if (icon.name.indexOf("Display") === 0) {
            icon.visible = !hide;
            icon.disabled = hide;
          }
        });
        var elem = _this.renderer.domElement.nextElementSibling;
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

      if (isMobile) {
        if (WebVRBootstrapper.Version >= 1) {
          window.addEventListener("vrdisplaypresentchange", function (evt) {
            if (window.VRDisplay && _this.input.VR.currentDisplay instanceof VRDisplay) {
              setOrientationLock();
              showHideButtons();
            }
          }, false);
        }
        FullScreen.addChangeListener(function (evt) {
          if (!window.VRDisplay || !(_this.input.VR.currentDisplay instanceof VRDisplay)) {
            setOrientationLock();
            showHideButtons();
          }
        }, false);
      } else {
        window.addEventListener("vrdisplaypresentchange", showHideButtons, false);
      }

      window.addEventListener("vrdisplaypresentchange", modifyScreen, false);
      FullScreen.addChangeListener(modifyScreen, false);

      Primrose.Input.Mouse.Lock.addChangeListener(function (evt) {
        if (!Primrose.Input.Mouse.Lock.isActive) {
          _this.input.VR.currentDisplay.exitPresent();
        }
      }, false);

      var isFullScreenMode = function isFullScreenMode() {
        return FullScreen.isActive || _this.input.VR.currentDisplay.isPresenting;
      };

      var clipboardOperation = function clipboardOperation(name, evt) {
        if (_this.currentControl) {
          _this.currentControl[name + "SelectedText"](evt);
          if (!evt.returnValue) {
            evt.preventDefault();
          }
          _this._surrogate.style.display = "none";
          _this.currentControl.canvas.focus();
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

      this.operatingSystem = this.options.os;
      this.codePage = this.options.language;

      var focusClipboard = function focusClipboard(evt) {
        var cmdName = _this.operatingSystem.makeCommandName(evt, _this.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          _this._surrogate.style.display = "block";
          _this._surrogate.focus();
        }
      };

      var setPointerLock = function setPointerLock() {
        return Primrose.Input.Mouse.Lock.isActive || isMobile ? Promise.resolve() : Primrose.Input.Mouse.Lock.request(_this.renderer.domElement);
      };

      var withCurrentControl = function withCurrentControl(name) {
        return function (evt) {
          if (_this.currentControl) {
            if (_this.currentControl[name]) {
              _this.currentControl[name](evt);
            } else {
              console.warn("Couldn't find %s on %o", name, _this.currentControl);
            }
          }
        };
      };

      this._browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
      window.addEventListener("keydown", keyDown, false);
      window.addEventListener("keyup", keyUp, false);
      window.addEventListener("keydown", focusClipboard, true);
      window.addEventListener("beforepaste", setFalse, false);
      window.addEventListener("paste", withCurrentControl("readClipboard"), false);
      window.addEventListener("wheel", withCurrentControl("readWheel"), false);
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

        _this.input = new Primrose.Input.FPSInput(_this.renderer.domElement);
        _this.input.addEventListener("zero", _this.zero, false);
        _this.input.addEventListener("lockpointer", setPointerLock, false);
        _this.input.addEventListener("fullscreen", _this.goFullScreen.bind(_this), false);
        _this.input.addEventListener("pointerstart", pointerStart, false);
        _this.input.addEventListener("pointerend", pointerEnd, false);
        return _this.input.ready;
      });

      var quality = -1,
          frameCount = 0,
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

      var allReady = Promise.all([modelsReady, iconManager.ready, audioReady, documentReady]).then(function () {
        _this.renderer.domElement.style.cursor = "default";
        _this.input.VR.displays[0].DOMElement = _this.renderer.domElement;
        _this.input.VR.connect(0);
        iconManager.append(_this.input.VR && _this.input.VR.displays || [{ displayName: "Test Icon" }]).forEach(function (icon, i) {
          return icon.addEventListener("click", _this.goFullScreen.bind(_this, i), false);
        });
        //iconManager.append(this.input.Media && this.input.Media.devices ||
        //  [{ kind: "audioinput", deviceId: "4AEB1201-50CD-4A57-8F0D-420504A8822F", groupId: "{42E0225C-F020-4914-9933-604C44A2D86F" }])
        //  .forEach((icon, i) => { });
        iconManager.icons.forEach(putIconInScene);
        fire("ready");
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
        hasOrientation: {
          get: function get() {
            return _this.input.VR.currentDisplay && _this.input.VR.currentDisplay.hasOrientation;
          }
        },
        inVR: {
          get: function get() {
            return _this.input.VR.transforms && _this.input.VR.transforms.length > 1;
          }
        },
        displays: {
          get: function get() {
            return _this.input.VR.displays || [];
          }
        },
        quality: {
          get: function get() {
            return quality;
          },
          set: function set(v) {
            if (0 <= v && v < Primrose.RESOLUTION_SCALES.length) {
              quality = v;
              resolutionScale = Primrose.RESOLUTION_SCALES[v];
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
            if (isFullScreenMode()) {
              newFunction();
            } else {
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

    _createClass(BrowserEnvironment, [{
      key: "operatingSystem",
      get: function get() {
        return this._operatingSystem;
      },
      set: function set(os) {
        this._operatingSystem = os || (isOSX ? Primrose.Text.OperatingSystems.OSX : Primrose.Text.OperatingSystems.Windows);
      }
    }, {
      key: "codePage",
      get: function get() {
        return this._codePage;
      },
      set: function set(cp) {
        var key, code, char, name;
        this._codePage = cp;
        if (!this._codePage) {
          var lang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || navigator.browserLanguage;

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
    avatarHeight: 1.75,
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
    // HTML5 audio element, if one had already been created.
    audioElement: "localAudio",
    // THREE.js renderer, if one had already been created.
    renderer: null,
    // A WebGL context to use, if one had already been created.
    context: null,
    // THREE.js scene, if one had already been created.
    scene: null
  };

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
}();