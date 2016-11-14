pliny.function({
  name: "circle",
  description: "| [under construction]"
});

import cache from "./cache";
import { CircleBufferGeometry } from "three/src/geometries/CircleBufferGeometry";
export default function circle(r, sections, start, end) {
  r = r || 1;
  sections = sections || 18;
  return cache(
    `CircleBufferGeometry(${r}, ${sections}, ${start}, ${end})`,
    () => new CircleBufferGeometry(r, sections, start, end));
}