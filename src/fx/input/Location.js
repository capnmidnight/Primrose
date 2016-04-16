/* global Primrose, pliny */

Primrose.Input.Location = ( function () {

  pliny.issue({
    parent: "Primrose.Input.Location",
    name: "document Location",
    type: "open",
    description: "Finish writing the documentation for the [Primrose.Input.Location](#Primrose_Input_Location) class in the input/ directory"
  } );
  
  pliny.class({
    parent: "Primrose.Input",
    name: "Location",
    description: "| [under construction]"
  });
  function LocationInput ( name, commands, socket, options ) {

    pliny.issue({
      parent: "Primrose.Input.Location",
      name: "document Location.options",
      type: "open",
      description: ""
    } );
    this.options = patch( options, LocationInput );
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, LocationInput.AXES );

    pliny.issue({
      parent: "Primrose.Input.Location",
      name: "document Location.available",
      type: "open",
      description: ""
    } );
    this.available = !!navigator.geolocation;
    if ( this.available ) {
      navigator.geolocation.watchPosition(
          this.setState.bind( this ),
          function () {
            this.available = false;
          }.bind( this ),
          this.options );
    }
  }

  pliny.issue({
    parent: "Primrose.Input.Location",
    name: "document Location.AXES",
    type: "open",
    description: ""
  } );
  LocationInput.AXES = [ "LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED" ];
  Primrose.Input.ButtonAndAxis.inherit( LocationInput );

  pliny.issue({
    parent: "Primrose.Input.Location",
    name: "document Location.DEFAULTS",
    type: "open",
    description: ""
  } );
  LocationInput.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  pliny.issue({
    parent: "Primrose.Input.Location",
    name: "document Location.setState",
    type: "open",
    description: ""
  } );
  LocationInput.prototype.setState = function ( location ) {
    for ( var p in location.coords ) {
      var k = p.toUpperCase();
      if ( LocationInput.AXES.indexOf( k ) > -1 ) {
        this.setAxis( k, location.coords[p] );
      }
    }
    this.update();
  };
  return LocationInput;
} )();