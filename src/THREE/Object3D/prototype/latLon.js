function latLon(lat, lon, r) {
  lat = -Math.PI * (lat || 0) / 180;
  lon = Math.PI * (lon || 0) / 180;
  r = r || 1.5;
  this.rotation.set(lon, lat, 0, "XYZ");
  this.position.set(0, 0, -r);
  this.position.applyQuaternion(this.quaternion);
  return this;
}