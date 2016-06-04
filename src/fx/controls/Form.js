Primrose.Controls.Form = (function () {
  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.Controls",
    name: "Form",
    description: "A basic 2D form control, with its own mesh to use as a frame.",
    baseClass: "Primrose.Entity"
  });
  class Form extends Primrose.Surface {

    static create(){
      return new Form();
    }

    constructor(options) {
      super(patch(options, {
        id: `Primrose.Controls.Form[${COUNTER++}]`
      }));
      
      this.mesh = textured(quad(1, this.bounds.height / this.bounds.width), this);
      this.mesh.name = this.id + "-mesh";
    }

    addToBrowserEnvironment(env, scene){
      scene.add(this.mesh);
      env.registerPickableObject(this.mesh);
      return this.mesh;
    }

    hide() {
      this.mesh.visible = false;
      this.mesh.disabled = true;
    }

    show() {
      this.mesh.visible = true;
      this.mesh.disabled = false;
    }
  }

  return Form;
})();