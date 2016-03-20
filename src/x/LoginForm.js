Primrose.X.LoginForm = (function () {
  var COUNTER = 0;
  class LoginForm extends Primrose.Entity {
    constructor() {
      super(`Primrose.X.LoginForm[${COUNTER++}]`);

      this.listeners.login = [];
      this.listeners.signup = [];

      this.frame = new Primrose.Surface({
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 512)
      });

      this.labelUserName = new Primrose.Controls.Label({
        bounds: new Primrose.Text.Rectangle(0, 0, 256, 50),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      this.userName = new Primrose.Text.Controls.TextInput({
        bounds: new Primrose.Text.Rectangle(256, 0, 256, 50),
        fontSize: 32
      });

      this.labelPassword= new Primrose.Controls.Label({
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      this.password = new Primrose.Text.Controls.TextInput({
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32
      });

      this.signupButton = new Primrose.Controls.Button2D({
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      this.loginButton = new Primrose.Controls.Button2D({
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", { target: this }), false);
      this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", { target: this }), false);

      this.mesh = textured(quad(1, 150/512), this.frame, {
        scaleTextureHeight: 150/512
      });
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