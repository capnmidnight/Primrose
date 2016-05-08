"use strict";

Primrose.Input.Camera = function () {

  /* polyfill */
  Navigator.prototype.getUserMedia = Navigator.prototype.getUserMedia || Navigator.prototype.webkitGetUserMedia || Navigator.prototype.mozGetUserMedia || Navigator.prototype.msGetUserMedia || Navigator.prototype.oGetUserMedia || function () {};

  pliny.class({
    parent: "Primrose.Input",
    name: "Camera",
    description: "| [under construction]"
  });
  function CameraInput(elem, id, size, x, y, z, options) {
    MediaStreamTrack.getSources(function (infos) {
      var option = document.createElement("option");
      option.value = "";
      option.innerHTML = "-- select camera --";
      elem.appendChild(option);
      for (var i = 0; i < infos.length; ++i) {
        if (infos[i].kind === "video") {
          option = document.createElement("option");
          option.value = infos[i].id;
          option.innerHTML = fmt("[Facing: $1] [ID: $2...]", infos[i].facing || "N/A", infos[i].id.substring(0, 8));
          option.selected = infos[i].id === id;
          elem.appendChild(option);
        }
      }
    });

    this.options = patch(options, CameraInput);

    this.videoElement = document.createElement("video");

    this.buffer = document.createElement("canvas");

    this.gfx = this.buffer.getContext("2d");

    this.texture = new THREE.Texture(this.buffer);
    var material = new THREE.MeshBasicMaterial({
      map: this.texture,
      useScreenCoordinates: false,
      color: 0xffffff,
      shading: THREE.FlatShading
    });

    this.gfx.width = 500;
    this.gfx.height = 500;
    this.gfx.fillStyle = "white";
    this.gfx.fillRect(0, 0, 500, 500);

    var geometry = new THREE.PlaneGeometry(size, size);
    geometry.computeBoundingBox();
    geometry.computeVertexNormals();

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, y, z);

    this.streaming = false;
    this.videoElement.autoplay = 1;
    var getUserMediaFallthrough = function (vidOpt, success, err) {
      navigator.getUserMedia({ video: vidOpt }, function (stream) {
        streamURL = window.URL.createObjectURL(stream);
        this.videoElement.src = streamURL;
        success();
      }.bind(this), err);
    }.bind(this);

    var tryModesFirstThen = function (source, err, i) {
      i = i || 0;
      if (this.options.videoModes && i < this.options.videoModes.length) {
        var mode = this.options.videoModes[i];
        var opt = { optional: [{ sourceId: source }] };
        if (mode !== "default") {
          opt.mandatory = {
            minWidth: mode.w,
            minHeight: mode.h
          };
          mode = fmt("[w:$1, h:$2]", mode.w, mode.h);
        }
        getUserMediaFallthrough(opt, function () {
          console.log(fmt("Connected to camera at mode $1.", mode));
        }, function (err) {
          console.error(fmt("Failed to connect at mode $1. Reason: $2", mode, err));
          tryModesFirstThen(source, err, i + 1);
        });
      } else {
        err("no video modes specified.");
      }
    }.bind(this);

    this.videoElement.addEventListener("canplay", function () {
      if (!this.streaming) {
        this.streaming = true;
      }
    }.bind(this), false);

    this.videoElement.addEventListener("playing", function () {
      this.videoElement.height = this.buffer.height = this.videoElement.videoHeight;
      this.videoElement.width = this.buffer.width = this.videoElement.videoWidth;
      var aspectRatio = this.videoElement.videoWidth / this.videoElement.videoHeight;
      this.mesh.scale.set(aspectRatio, 1, 1);
    }.bind(this), false);

    this.connect = function (source) {
      if (this.streaming) {
        try {
          if (window.stream) {
            window.stream.stop();
          }
          this.videoElement.src = null;
          this.streaming = false;
        } catch (exp) {
          console.error(exp);
          console.error("While stopping");
        }
      }

      tryModesFirstThen(source, function (err) {
        console.error(fmt("Couldn't connect at requested resolutions. Reason: $1", err));
        getUserMediaFallthrough(true, console.log.bind(console, "Connected to camera at default resolution"), console.error.bind(console, "Final connect attempt"));
      });
    }.bind(this);

    if (id) {
      this.connect(id);
    }
  }

  CameraInput.DEFAULTS = {
    videoModes: [{ w: 320, h: 240 }, { w: 640, h: 480 }, "default"]
  };

  CameraInput.prototype.update = function () {
    this.gfx.drawImage(this.videoElement, 0, 0);
    this.texture.needsUpdate = true;
  };
  return CameraInput;
}();