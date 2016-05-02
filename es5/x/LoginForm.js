"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.X.LoginForm = function () {
  var COUNTER = 0;
  pliny.class({
    parent: "Primrose.X",
    name: "LoginForm",
    description: "| [Under Construction]",
    baseClass: "Primrose.Entity"
  });

  var LoginForm = function (_Primrose$Entity) {
    _inherits(LoginForm, _Primrose$Entity);

    function LoginForm() {
      _classCallCheck(this, LoginForm);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginForm).call(this, "Primrose.X.LoginForm[" + COUNTER++ + "]"));

      _this.listeners.login = [];
      _this.listeners.signup = [];

      _this.frame = new Primrose.Surface({
        id: _this.id + "-frame",
        bounds: new Primrose.Text.Rectangle(0, 0, 512, 150)
      });

      _this.labelUserName = new Primrose.Controls.Label({
        id: _this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, 256, 50),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      _this.userName = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(256, 0, 256, 50),
        fontSize: 32
      });

      _this.labelPassword = new Primrose.Controls.Label({
        id: _this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, 50, 256, 50),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      _this.password = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-password",
        bounds: new Primrose.Text.Rectangle(256, 50, 256, 50),
        fontSize: 32,
        passwordCharacter: "*"
      });

      _this.signupButton = new Primrose.Controls.Button2D({
        id: _this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(0, 100, 256, 50),
        fontSize: 32,
        value: "Sign up"
      });

      _this.loginButton = new Primrose.Controls.Button2D({
        id: _this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(256, 100, 256, 50),
        fontSize: 32,
        value: "Login"
      });

      _this.loginButton.addEventListener("click", function (evt) {
        return emit.call(_this, "login", { target: _this });
      }, false);
      _this.signupButton.addEventListener("click", function (evt) {
        return emit.call(_this, "signup", { target: _this });
      }, false);

      _this.mesh = textured(quad(1, 150 / 512), _this.frame);
      _this.mesh.name = "LoginForm";

      _this.frame.appendChild(_this.labelUserName);
      _this.frame.appendChild(_this.userName);
      _this.frame.appendChild(_this.labelPassword);
      _this.frame.appendChild(_this.password);
      _this.frame.appendChild(_this.signupButton);
      _this.frame.appendChild(_this.loginButton);
      _this.appendChild(_this.frame);
      return _this;
    }

    return LoginForm;
  }(Primrose.Entity);

  return LoginForm;
}();