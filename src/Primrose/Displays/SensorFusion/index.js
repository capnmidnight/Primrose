/*
pliny.namespace({
  parent: "Primrose.Displays",
  name: "SensorFusion",
  description: "Kahlman filter-based means of getting good orientation values out of the crappy DeviceMotion API, courtesy of Google."
});
*/

import ComplementaryFilter from "./ComplementaryFilter";
import FusionPoseSensor from "./FusionPoseSensor";
import PosePredictor from "./PosePredictor";
import SensorSample from "./SensorSample";

export {
  ComplementaryFilter,
  FusionPoseSensor,
  PosePredictor,
  SensorSample,
};

export default {
  ComplementaryFilter,
  FusionPoseSensor,
  PosePredictor,
  SensorSample,
};
