Primrose.X.LoginForm = (function () {
  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.X",
    name: "LoginForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });
  class LoginForm extends Primrose.Entity {

    static create(){
      return new LoginForm();
    }

    constructor() {
      super(`Primrose.X.LoginForm[${COUNTER++}]`);

      this.listeners.login = [];
      this.listeners.signup = [];

      const WIDTH = 512,
            HEIGHT = 150;

      this.frame = new Primrose.Surface({
        id: this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
      });

      this.labelUserName = new Primrose.Controls.Label({
        id: this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      this.userName = new Primrose.Text.Controls.TextInput({
        id: this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 3),
        fontSize: 32
      });

      this.labelPassword = new Primrose.Controls.Label({
        id: this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      this.password = new Primrose.Text.Controls.TextInput({
        id: this.id + "-password",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        passwordCharacter: "*"
      });

      this.signupButton = new Primrose.Controls.Button2D({
        id: this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(0, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Sign up"
      });

      this.loginButton = new Primrose.Controls.Button2D({
        id: this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Login"
      });

      this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", { target: this }), false);
      this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", { target: this }), false);

      this.mesh = textured(quad(1, HEIGHT / WIDTH), this.frame);
      this.mesh.name = "LoginForm";

      this.frame.appendChild(this.labelUserName);
      this.frame.appendChild(this.userName);
      this.frame.appendChild(this.labelPassword);
      this.frame.appendChild(this.password);
      this.frame.appendChild(this.signupButton);
      this.frame.appendChild(this.loginButton);
      this.appendChild(this.frame);
    }

    addToBrowserEnvironment(env, scene){
      scene.add(this.mesh);
      env.registerPickableObject(this.mesh);
      return this.mesh;
    }
  }

  return LoginForm;
})();