Primrose.Input.Location = ( function () {

  pliny.class({
    parent: "Primrose.Input",
    name: "Location",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
  });
  class Location extends Primrose.InputProcessor{
    constructor(commands, socket, options) {
      super("Location", commands, socket);

      this.options = patch(options, Location.DEFAULTS);

      this.available = !!navigator.geolocation;
      if (this.available) {
        navigator.geolocation.watchPosition(
          this.setState.bind(this),
          function () {
            this.available = false;
          }.bind(this),
          this.options);
      }
    }

    setState (location) {
      for (var p in location.coords) {
        var k = p.toUpperCase();
        if (Location.AXES.indexOf(k) > -1) {
          this.setAxis(k, location.coords[p]);
        }
      }
      this.update();
    }
  }

  Primrose.InputProcessor.defineAxisProperties(Location, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

  Location.DEFAULTS = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 25000
  };

  return Location;
} )();