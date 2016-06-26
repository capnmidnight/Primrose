Primrose.Controls.Form = (function () {
  "use strict";

  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.Controls",
      name: "Form",
      baseClass: "Primrose.Entity",
      description: "A basic 2D form control, with its own mesh to use as a frame."
  });
  class Form extends Primrose.Surface {

    static create() {
      return new Form();
    }

    constructor(options) {
      super(patch(options, {
        id: `Primrose.Controls.Form[${COUNTER++}]`
      }));
      this._mesh = textured(quad(1, this.bounds.height / this.bounds.width), this);
      this._mesh.name = this.id + "-mesh";
      Object.defineProperties(this.style, {
        display: {
          get: () => this._mesh.visible ? "" : "none",
          set: (v) => {
            if (v === "none") {
              this.hide();
            }
            else {
              this.show();
            }
          }
        },
        visible: {
          get: () => this._mesh.visible ? "" : "hidden",
          set: (v) => this.visible = v !== "hidden"
        }
      });
    }

    addToBrowserEnvironment(env, scene) {
      scene.add(this._mesh);
      env.registerPickableObject(this._mesh);
      return this._mesh;
    }

    get position() {
      return this._mesh.position;
    }

    get visible() {
      return this._mesh.visible;
    }

    set visible(v) {
      this._mesh.visible = v;
    }

    get disabled() {
      return this._mesh.disabled;
    }

    set disabled(v) {
      this._mesh.disabled = v;
    }

    get enabled() {
      return !this.disabled;
    }

    set enabled(v) {
      this.disabled = !v;
    }

    hide() {
      this.visible = false;
      this.disabled = true;
    }

    show() {
      this.visible = true;
      this.disabled = false;
    }
  }

  return Form;
})();