import * as flags from "./flags";
import * as liveAPI from "./live-api";
import * as util from "./util";
Object.assign(window, flags, liveAPI, util);
// Do this just for side effects, we are monkey-patching Three.js classes with our own utilities.
import "./THREE";
import "promise-polyfill/promise";
export { default } from "./Primrose";