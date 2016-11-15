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
pliny.namespace({
  name: "Primrose",
  description: "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments."
});

import { default as Audio } from "./Audio";
import { default as Controls } from "./Controls";
import { default as DOM } from "./DOM";
import { default as Geometry } from "./Geometry";
import { default as Input } from "./Input";
import { default as Network } from "./Network";
import { default as Random } from "./Random";
import { default as Text } from "./Text";
import { default as AbstractEventEmitter } from "./AbstractEventEmitter";
import { default as Angle } from "./Angle";
import { default as BrowserEnvironment } from "./BrowserEnvironment";
import { default as constants } from "./constants";
import { default as HTTP } from "./HTTP";
import { default as Keys } from "./Keys";
import { default as Pointer } from "./Pointer";

import * as Primrose from ".";
export default Primrose;