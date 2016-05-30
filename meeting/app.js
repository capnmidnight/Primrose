var idSpec = location.search.match(/id=(\w+)/),
meetingID = idSpec && idSpec[1] || "public",
env = new Primrose.BrowserEnvironment( "Meeting:" + meetingID, {
    skyTexture: "../doc/images/bg.jpg",
    groundTexture: "../doc/images/deck.png",
    fullScreenIcon: "../doc/models/monitor.obj",
    VRIcon: "../doc/models/cardboard.obj",
    font: "../doc/fonts/helvetiker_regular.typeface.js"
  }),
  login = new Primrose.X.LoginForm();

login.addEventListener( "login", function(socket){
  env.socket = socket;
});

login.addEventListener( "logout", function(){
  env.socket = null;
});

env.addEventListener( "ready", function (){
  login.mesh.position.set(-1, env.avatarHeight, -1.5);
  env.appendChild(login);
});

env.addEventListener( "gazecomplete", function(evt){

});

env.addEventListener( "pointerend", function(evt){

});

env.addEventListener( "update", function (dt){

});