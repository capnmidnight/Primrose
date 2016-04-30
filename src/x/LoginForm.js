Primrose.X.LoginForm = (function () {
  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.X",
    name: "LoginForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });
  class LoginForm extends Primrose.Entity {
    constructor() {
      super(`Primrose.X.LoginForm[${COUNTER++}]`);

      this.listeners.login = [];
      this.listeners.signup = [];

      this.frame = new Primrose.Surface({
        id: this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 150)
      });

      this.labelUserName = new Primrose.Controls.Label({
        id: this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, 256, 50),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      this.userName = new Primrose.Text.Controls.TextInput({
        id: this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(256, 0, 256, 50),
        fontSize: 32
      });

      this.labelPassword = new Primrose.Controls.Label({
        id: this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      this.password = new Primrose.Text.Controls.TextInput({
        id: this.id + "-password",
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32,
        passwordCharacter: "*"
      });

      this.signupButton = new Primrose.Controls.Button2D({
        id: this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      this.loginButton = new Primrose.Controls.Button2D({
        id: this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", { target: this }), false);
      this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", { target: this }), false);

      this.mesh = textured(quad(1, 150 / 512), this.frame);
      this.mesh.name = "LoginForm";

      this.frame.appendChild(this.labelUserName);
      this.frame.appendChild(this.userName);
      this.frame.appendChild(this.labelPassword);
      this.frame.appendChild(this.password);
      this.frame.appendChild(this.signupButton);
      this.frame.appendChild(this.loginButton);
      this.appendChild(this.frame);
    }
  }

  return LoginForm;
})();