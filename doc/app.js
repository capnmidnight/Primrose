/*global pliny, Primrose*/
var oldConsole = console.log;
console.log = function(output){
  document.body.innerHTML = "<pre>" + output + "</pre>";
};


Primrose.Button.help();


console.log = oldConsole;