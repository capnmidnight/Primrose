Primrose.NetworkManager = (function(){
  pliny.class({
    parent: "Primrose",
    name: "NetworkManager",
    parameters: [
      { name: "serverAddress", type: "String", description: "The address of the WebSocket server that manages multiplayer and device fusion connections."}
    ]
  });
  class NetworkManager{
    constructor(serverAddress){

    }
  } 

  return NetworkManager; 
})();