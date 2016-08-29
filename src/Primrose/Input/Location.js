pliny.class({
  parent: "Primrose.Input",
    name: "Location",
    baseClass: "Primrose.InputProcessor",
    description: "| [under construction]"
});
class Location extends Primrose.InputProcessor {
  constructor(commands, options) {
    super("Location", commands, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]);

    this.options = patch(options, Location.DEFAULTS);

    this.available = !!navigator.geolocation;
    if (this.available) {
      navigator.geolocation.watchPosition(
        this.setState.bind(this),
        () => this.available = false,
        this.options);
    }
  }

  setState(location) {
    for (var p in location.coords) {
      var k = p.toUpperCase();
      if (this.axisNames.indexOf(k) > -1) {
        this.setAxis(k, location.coords[p]);
      }
    }
    this.update();
  }
}

Location.DEFAULTS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 25000
};