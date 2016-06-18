"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.X.SignupForm = function () {
  var WIDTH = 512,
      HEIGHT = 200;

  var COUNTER = 0;

  pliny.class({
    parent: "Primrose.X",
    name: "SignupForm",
    description: "A basic registration form.",
    baseClass: "Primrose.Controls.Form"
  });

  var SignupForm = function (_Primrose$Controls$Fo) {
    _inherits(SignupForm, _Primrose$Controls$Fo);

    function SignupForm() {
      _classCallCheck(this, SignupForm);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SignupForm).call(this, {
        id: "Primrose.X.SignupForm[" + COUNTER++ + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
      }));

      _this.listeners.login = [];
      _this.listeners.signup = [];

      _this.labelEmail = new Primrose.Controls.Label({
        id: _this.id + "-labelEmail",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        value: "Email:",
        textAlign: "right"
      });

      _this.email = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-email",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 4),
        fontSize: 32
      });

      _this.labelUserName = new Primrose.Controls.Label({
        id: _this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      _this.userName = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
        fontSize: 32
      });

      _this.labelPassword = new Primrose.Controls.Label({
        id: _this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      _this.password = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-password",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 2, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        passwordCharacter: "*"
      });

      _this.loginButton = new Primrose.Controls.Button2D({
        id: _this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(0, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        value: "Log in"
      });

      _this.signupButton = new Primrose.Controls.Button2D({
        id: _this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 3 * HEIGHT / 4, WIDTH / 2, HEIGHT / 4),
        fontSize: 32,
        value: "Sign up"
      });

      _this.loginButton.addEventListener("click", function (evt) {
        return emit.call(_this, "login", { target: _this });
      }, false);
      _this.signupButton.addEventListener("click", function (evt) {
        return emit.call(_this, "signup", { target: _this });
      }, false);

      _this.appendChild(_this.labelUserName);
      _this.appendChild(_this.userName);
      _this.appendChild(_this.labelEmail);
      _this.appendChild(_this.email);
      _this.appendChild(_this.labelPassword);
      _this.appendChild(_this.password);
      _this.appendChild(_this.loginButton);
      _this.appendChild(_this.signupButton);
      return _this;
    }

    return SignupForm;
  }(Primrose.Controls.Form);

  return SignupForm;
}();