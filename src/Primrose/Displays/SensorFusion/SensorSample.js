/*
pliny.class({
  parent: "Primrose.Displays.SensorFusion",
  name: "SensorSample",
  description: "A combination of a sensor reading and a timestamp.",
  parameters: [{
    name: "sample",
    type: "Object",
    description: "The sensor reading we want to record. Can be any value, really, as it's just read back out again, correlated with a timestamp."
  },{
    name: "timestampS",
    type: "Number",
    description: "The time at which the sensor sample was recorded. It's important that all timestamps between values that are meant to be compared together be recorded from the source, as there are multiple sources of \"time\" in the browser, with subtly different meanings, precisions, and starting points."
  }]
});
*/

export default class SensorSample {
  constructor (sample, timestampS) {
    this.set(sample, timestampS);
  }

  set(sample, timestampS) {

    /*
    pliny.method({
      parent: "Primrose.Displays.SensorFusion.SensorSample",
      name: "set",
      description: "Mutably set the current state of the object.",
      parameters: [{
        name: "sample",
        type: "Object",
        description: "The sensor reading we want to record. Can be any value, really, as it's just read back out again, correlated with a timestamp."
      },{
        name: "timestampS",
        type: "Number",
        description: "The time at which the sensor sample was recorded. It's important that all timestamps between values that are meant to be compared together be recorded from the source, as there are multiple sources of \"time\" in the browser, with subtly different meanings, precisions, and starting points."
      }]
    });
    */

    this.sample = sample;
    this.timestampS = timestampS;
  }

  copy(sensorSample) {

    /*
    pliny.method({
      parent: "Primrose.Displays.SensorFusion.SensorSample",
      name: "copy",
      description: "Mutably copy the current state of the object from another `SensorSample` object.",
      parameters: [{
        name: "sensorSample",
        type: "Primrose.Displays.SensorFusion.SensorSample",
        description: "The object to copy."
      }]
    });
    */

    this.set(sensorSample.sample, sensorSample.timestampS);
  }
};
