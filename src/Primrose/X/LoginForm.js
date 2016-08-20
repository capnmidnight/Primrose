
"use strict";

var COUNTER = 0;

const WIDTH = 512,
  HEIGHT = 150;

pliny.class({
  parent: "Primrose.X",
    name: "LoginForm",
    baseClass: "Primrose.Controls.Form",
    description: "A basic authentication form."
});
class LoginForm extends Primrose.Controls.Form {

  static create() {
    return new LoginForm();
  }

  constructor() {
    super({
      id: `Primrose.X.LoginForm[${COUNTER++}]`,
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    });

    this.listeners.login = [];
    this.listeners.signup = [];

    this.labelUserName = new Primrose.Controls.AbstractLabel({
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

    this.labelPassword = new Primrose.Controls.AbstractLabel({
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

    this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", {
      target: this
    }), false);
    this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", {
      target: this
    }), false);

    this.appendChild(this.labelUserName);
    this.appendChild(this.userName);
    this.appendChild(this.labelPassword);
    this.appendChild(this.password);
    this.appendChild(this.signupButton);
    this.appendChild(this.loginButton);
  }
}