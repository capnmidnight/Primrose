/*
 * Copyright (C) 2014 - 2016 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import * as flags from "./flags";
import * as liveAPI from "./live-api";
import * as util from "./util";
Object.assign(window, flags, liveAPI, util);
// Do this just for side effects, we are monkey-patching Three.js classes with our own utilities.
import "./THREE";
import "promise-polyfill/promise";
export { default } from "./Primrose";