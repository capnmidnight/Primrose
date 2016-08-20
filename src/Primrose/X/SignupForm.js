"use strict";

const WIDTH = 512,
  HEIGHT = 200;

let COUNTER = 0;

pliny.class({
  parent: "Primrose.X",
    name: "SignupForm",
    baseClass: "Primrose.Controls.Form",
    description: "A basic registration form."
});
class SignupForm extends Primrose.Controls.Form {
  constructor() {

    super({
      id: `Primrose.X.SignupForm[${COUNTER++}]`,
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
    });

    this.listeners.login = [];
    this.listeners.signup = [];

    this.labelEmail = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelEmail",
      bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Email:",
      textAlign: "right"
    });

    this.email = new Primrose.Text.Controls.TextInput({
      id: this.id + "-email",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    this.labelUserName = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelUserName",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "User name:",
      textAlign: "right"
    });

    this.userName = new Primrose.Text.Controls.TextInput({
      id: this.id + "-userName",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32
    });

    this.labelPassword = new Primrose.Controls.AbstractLabel({
      id: this.id + "-labelPassword",
      bounds: new Primrose.Text.Rectangle(0, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Password:",
      textAlign: "right"
    });

    this.password = new Primrose.Text.Controls.TextInput({
      id: this.id + "-password",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      passwordCharacter: "*"
    });

    this.loginButton = new Primrose.Controls.Button2D({
      id: this.id + "-loginButton",
      bounds: new Primrose.Text.Rectangle(0, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Log in"
    });

    this.signupButton = new Primrose.Controls.Button2D({
      id: this.id + "-signupButton",
      bounds: new Primrose.Text.Rectangle(WIDTH / 2, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
      fontSize: 32,
      value: "Sign up"
    });

    this.loginButton.addEventListener("click", (evt) => emit.call(this, "login", {
      target: this
    }), false);
    this.signupButton.addEventListener("click", (evt) => emit.call(this, "signup", {
      target: this
    }), false);

    this.appendChild(this.labelUserName);
    this.appendChild(this.userName);
    this.appendChild(this.labelEmail);
    this.appendChild(this.email);
    this.appendChild(this.labelPassword);
    this.appendChild(this.password);
    this.appendChild(this.loginButton);
    this.appendChild(this.signupButton);
  }
}