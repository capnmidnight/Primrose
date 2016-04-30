Primrose.X.SignupForm = (function () {
  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.X",
    name: "SignupForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });
  class SignupForm extends Primrose.Entity {
    constructor() {
      super(`Primrose.X.SignupForm[${COUNTER++}]`);

      this.listeners.login = [];
      this.listeners.signup = [];

      this.frame = new Primrose.Surface({
        id: this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 200)
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

      this.labelEmail = new Primrose.Controls.Label({
        id: this.id + "-labelEmail",
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Email:",
        textAlign: "center"
      });

      this.email = new Primrose.Text.Controls.TextInput({
        id: this.id + "-email",
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32
      });

      this.labelPassword = new Primrose.Controls.Label({
        id: this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "left"
      });

      this.password = new Primrose.Text.Controls.TextInput({
        id: this.id + "-password",
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        passwordCharacter: "*"
      });

      this.loginButton = new Primrose.Controls.Button2D({
        id: this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(0, 150, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      this.signupButton = new Primrose.Controls.Button2D({
        id: this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(256, 150, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", { target: this }), false);
      this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", { target: this }), false);

      this.mesh = textured(quad(1, 200/512), this.frame);
      this.mesh.name = "SignupForm";

      this.frame.appendChild(this.labelUserName);
      this.frame.appendChild(this.userName);
      this.frame.appendChild(this.labelEmail);
      this.frame.appendChild(this.email);
      this.frame.appendChild(this.labelPassword);
      this.frame.appendChild(this.password);
      this.frame.appendChild(this.loginButton);
      this.frame.appendChild(this.signupButton);
      this.appendChild(this.frame);
    }
  }

  return SignupForm;
})();