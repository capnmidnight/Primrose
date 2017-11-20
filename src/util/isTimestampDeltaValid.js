/*
pliny.function({
  parent: "Util",
  name: "isTimestampDeltaValid",
  returns: "Boolean",
  description: "Helper method to validate the time steps of sensor timestamps.",
  parameters: [{
    name: "timestampDeltaS",
    type: "Number",
    description: "The timestamp to check."
  }]
});
*/
const MIN_TIMESTEP = 0.001,
  MAX_TIMESTEP = 1;

export default function isTimestampDeltaValid(timestampDeltaS) {
  return !isNaN(timestampDeltaS) &&
    MIN_TIMESTEP < timestampDeltaS &&
    timestampDeltaS <= MAX_TIMESTEP;
};
