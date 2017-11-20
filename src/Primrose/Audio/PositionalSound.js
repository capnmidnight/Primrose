/*
pliny.class({
  parent: "Primrose.Output",
    name: "PositionalSound",
    description: "| [under construction]"
});
*/

export default class PositionalSound {
  constructor(ctx, mainVolume){
    this.gn = ctx.createGain(),
    this.pnr = ctx.createPanner();
    this.gn.connect(this.pnr);
    this.pnr.connect(mainVolume);
    this.gn.gain.value = 0;
    this.ctx = ctx;
  }

  at(x, y, z, dx, dy, dz) {
    x = x || 0;
    y = y || 0;
    z = z || 0;
    if(dx === undefined || dx === null) {
      dx = 0;
    }
    dy = dy || 0;
    dz = dz || 0;

    this.pnr.setPosition(x, y, z);
    this.pnr.setOrientation(dx, dy, dz);
    return this;
  }
};
