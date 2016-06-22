"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

Primrose.X.LoginForm = function () {
  "use strict";

  var COUNTER = 0;

  var WIDTH = 512,
      HEIGHT = 150;

  pliny.class({
    parent: "Primrose.X",
    name: "LoginForm",
    baseClass: "Primrose.Controls.Form",
    description: "A basic authentication form."
  });

  var LoginForm = function (_Primrose$Controls$Fo) {
    _inherits(LoginForm, _Primrose$Controls$Fo);

    _createClass(LoginForm, null, [{
      key: "create",
      value: function create() {
        return new LoginForm();
      }
    }]);

    function LoginForm() {
      _classCallCheck(this, LoginForm);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoginForm).call(this, {
        id: "Primrose.X.LoginForm[" + COUNTER++ + "]",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH, HEIGHT)
      }));

      _this.listeners.login = [];
      _this.listeners.signup = [];

      _this.labelUserName = new Primrose.Controls.Label({
        id: _this.id + "-labelUserName",
        bounds: new Primrose.Text.Rectangle(0, 0, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "User name:",
        textAlign: "right"
      });

      _this.userName = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-userName",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 0, WIDTH / 2, HEIGHT / 3),
        fontSize: 32
      });

      _this.labelPassword = new Primrose.Controls.Label({
        id: _this.id + "-labelPassword",
        bounds: new Primrose.Text.Rectangle(0, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Password:",
        textAlign: "right"
      });

      _this.password = new Primrose.Text.Controls.TextInput({
        id: _this.id + "-password",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        passwordCharacter: "*"
      });

      _this.signupButton = new Primrose.Controls.Button2D({
        id: _this.id + "-signupButton",
        bounds: new Primrose.Text.Rectangle(0, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Sign up"
      });

      _this.loginButton = new Primrose.Controls.Button2D({
        id: _this.id + "-loginButton",
        bounds: new Primrose.Text.Rectangle(WIDTH / 2, 2 * HEIGHT / 3, WIDTH / 2, HEIGHT / 3),
        fontSize: 32,
        value: "Login"
      });

      _this.loginButton.addEventListener("click", function (evt) {
        return emit.call(_this, "login", { target: _this });
      }, false);
      _this.signupButton.addEventListener("click", function (evt) {
        return emit.call(_this, "signup", { target: _this });
      }, false);

      _this.appendChild(_this.labelUserName);
      _this.appendChild(_this.userName);
      _this.appendChild(_this.labelPassword);
      _this.appendChild(_this.password);
      _this.appendChild(_this.signupButton);
      _this.appendChild(_this.loginButton);
      return _this;
    }

    return LoginForm;
  }(Primrose.Controls.Form);

  return LoginForm;
}();