"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Primrose.IconManager = function () {

  pliny.class({
    parent: "Primrose",
    name: "IconManager",
    description: "Handles the loading and instantiation of icons in 3D space.",
    parameters: [{ name: "options", type: "Object", description: "Options for the model files and type constructors for each of the icon types." }, { name: "options", type: "Object", description: "Options for the model files and type constructors for each of the icon types." }]
  });

  var IconManager = function () {
    function IconManager(options) {
      var _this = this;

      _classCallCheck(this, IconManager);

      this.options = patch(options, IconManager.DEFAULTS);
      this.iconModels = {};
      this.ready = Primrose.ModelLoader.loadObjects({
        fullScreenIcon: this.options.fullScreenIcon,
        VRIcon: this.options.VRIcon,
        audioIcon: this.options.audioIcon
      }).then(function (models) {
        if (models.fullScreenIcon) {
          _this.iconModels["Standard Monitor"] = new Primrose.ModelLoader(models.fullScreenIcon);
        }

        if (models.VRIcon) {
          _this.iconModels["Google Cardboard"] = new Primrose.ModelLoader(models.VRIcon);
        } else {
          _this.iconModels["Google Cardboard"] = brick(0xffffff, 0.1, 0.1, 0.1);
        }

        if (models.audioIcon) {
          _this.iconModels["audioinput"] = new Primrose.ModelLoader(models.audioIcon);
        }

        _this.iconModels["Test Icon"] = _this.iconModels["Oculus Rift DK2, Oculus VR"] = _this.iconModels["Device Motion API"] = _this.iconModels["Google, Inc. Cardboard v1"] = _this.iconModels["Google Cardboard"];
      });
      this.icons = [];
    }

    _createClass(IconManager, [{
      key: "makeDisplayIcon",
      value: function makeDisplayIcon(display, i) {
        var isVR = !(display instanceof StandardMonitorPolyfill),
            icon = (this.iconModels[display.displayName] || this.iconModels["Google Cardboard"]).clone(),
            geom = icon.children[0] && icon.children[0].geometry || icon.geometry,
            titleText = textured(text3D(0.05, display.displayName), this.options.foregroundColor),
            funcText = textured(text3D(0.05, isVR ? "VR" : "Fullscreen"), this.options.foregroundColor);

        icon.name = (display.displayName + "Icon").replace(/ /g, "");

        geom.computeBoundingBox();

        put(funcText).on(icon).rot(0, 90 * Math.PI / 180, 0).at(0, geom.boundingBox.max.y + 0.01, funcText.geometry.boundingSphere.radius);

        put(titleText).on(icon).rot(0, 90 * Math.PI / 180, 0).at(0, geom.boundingBox.min.y - titleText.geometry.boundingBox.max.y - 0.01, titleText.geometry.boundingSphere.radius);

        icon.rotation.set(0, 270 * Math.PI / 180, 0);
        return icon;
      }
    }, {
      key: "makeIcon",
      value: function makeIcon(object, i) {
        var icon = this.makeDisplayIcon(object, i);
        this.icons.push(icon);
        return icon;
      }
    }, {
      key: "append",
      value: function append(objects) {
        return objects.map(this.makeIcon.bind(this));
      }
    }]);

    return IconManager;
  }();

  IconManager.DEFAULTS = {};

  return IconManager;
}();