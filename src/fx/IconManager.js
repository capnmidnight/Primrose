Primrose.IconManager = (function () {
  "use strict";

  pliny.class({
    parent: "Primrose",
      name: "IconManager",
      description: "Handles the loading and instantiation of icons in 3D space.",
      parameters: [{
        name: "options",
        type: "Object",
        description: "Options for the model files and type constructors for each of the icon types."
      }, {
        name: "options",
        type: "Object",
        description: "Options for the model files and type constructors for each of the icon types."
      }, ]
  });
  class IconManager {
    constructor(options) {
      this.options = patch(options, IconManager.DEFAULTS);
      this.iconModels = {};
      this.ready = Primrose.ModelLoader.loadObjects({
          fullScreenIcon: this.options.fullScreenIcon,
          VRIcon: this.options.VRIcon,
          audioIcon: this.options.audioIcon
        })
        .then((models) => {
          if (models.fullScreenIcon) {
            this.iconModels["Standard Monitor"] = new Primrose.ModelLoader(models.fullScreenIcon);
          }

          if (models.VRIcon) {
            this.iconModels["Google Cardboard"] = new Primrose.ModelLoader(models.VRIcon);
          }
          else {
            this.iconModels["Google Cardboard"] = brick(0xffffff, 0.1, 0.1, 0.1);
          }

          if (models.audioIcon) {
            this.iconModels["audioinput"] = new Primrose.ModelLoader(models.audioIcon);
          }

          this.iconModels["Test Icon"] =
            this.iconModels["Oculus Rift DK2, Oculus VR"] =
            this.iconModels["Device Motion API"] =
            this.iconModels["Google, Inc. Cardboard v1"] = this.iconModels["Google Cardboard"];
        });
      this.icons = [];
    }

    makeDisplayIcon(display, i) {
      var isVR = !(display instanceof StandardMonitorPolyfill),
        icon = (this.iconModels[display.displayName] || this.iconModels["Google Cardboard"])
        .clone(),
        geom = icon.children[0] && icon.children[0].geometry || icon.geometry,
        titleText = textured(text3D(0.05, display.displayName), this.options.foregroundColor),
        funcText = textured(text3D(0.05, isVR ? "VR" : "Fullscreen"), this.options.foregroundColor);

      icon.name = ("Display" + display.displayName + "Icon")
        .replace(/ /g, "");

      geom.computeBoundingBox();

      put(funcText)
        .on(icon)
        .rot(0, 90 * Math.PI / 180, 0)
        .at(0, geom.boundingBox.max.y + 0.01, funcText.geometry.boundingSphere.radius);


      put(titleText)
        .on(icon)
        .rot(0, 90 * Math.PI / 180, 0)
        .at(0, geom.boundingBox.min.y - titleText.geometry.boundingBox.max.y - 0.01, titleText.geometry.boundingSphere.radius);

      icon.rotation.set(0, 270 * Math.PI / 180, 0);
      return icon;
    }

    makeIcon(object, i) {
      var icon = this.makeDisplayIcon(object, i);
      this.icons.push(icon);
      return icon;
    }

    append(objects) {
      return objects.map(this.makeIcon.bind(this));
    }
  }

  IconManager.DEFAULTS = {};

  return IconManager;
})();