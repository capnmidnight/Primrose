"use strict";

/*
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
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

var setFalse = function setFalse(evt) {
  return evt.returnValue = false;
};

window.Primrose = function () {
  "use strict";

  pliny.namespace({
    name: "Primrose",
    description: "Primrose helps you make VR applications for web browsers as easy as making other types of interactive web pages.\n\nThis top-level namespace contains classes for manipulating and viewing 3D environments."
  });
  var Primrose = {};

  Primrose.Controls = {};

  pliny.namespace({
    parent: "Primrose",
    name: "DOM",
    description: "A few functions for manipulating DOM."
  });
  Primrose.DOM = {};

  pliny.namespace({
    parent: "Primrose",
    name: "HTTP",
    description: "A collection of basic XMLHttpRequest wrappers."
  });
  Primrose.HTTP = {};

  pliny.namespace({
    parent: "Primrose",
    name: "Input",
    description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."
  });
  Primrose.Input = {};

  pliny.namespace({
    parent: "Primrose",
    name: "Network",
    description: "The Network namespace contains classes for communicating events between entities in a graph relationship across different types of communication boundaries: in-thread, cross-thread, cross-WAN, and cross-LAN."
  });
  Primrose.Network = {};

  pliny.namespace({
    parent: "Primrose",
    name: "Output",
    description: "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)."
  });
  Primrose.Output = {};

  pliny.namespace({
    parent: "Primrose",
    name: "Random",
    description: "Functions for handling random numbers of different criteria, or selecting random elements of arrays."
  });
  Primrose.Random = {};

  pliny.namespace({
    parent: "Primrose",
    name: "Text",
    description: "The Text namespace contains classes everything regarding the Primrose source code editor."
  });
  Primrose.Text = {};

  pliny.namespace({
    parent: "Text",
    name: "CodePages",
    description: "The CodePages namespace contains international keyboard parameters."
  });
  Primrose.Text.CodePages = {};

  pliny.namespace({
    parent: "Text",
    name: "CommandPacks",
    description: "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls."
  });
  Primrose.Text.CommandPacks = {};

  pliny.namespace({
    parent: "Text",
    name: "Controls",
    description: "The Controls namespace contains different types of text-oriented controls."
  });
  Primrose.Text.Controls = {};

  pliny.namespace({
    parent: "Text",
    name: "Grammars",
    description: "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting."
  });
  Primrose.Text.Grammars = {};

  pliny.namespace({
    parent: "Text",
    name: "OperatingSystems",
    description: "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems."
  });
  Primrose.Text.OperatingSystems = {};

  pliny.namespace({
    parent: "Text",
    name: "Renderers",
    description: "The Renderers namespace contains different renderers for using the general Text Editor logic in different output systems. Current, Canvas2D is the only system that works. A system for DOM elements exists, but it is broken and not likely to be fixed any time soon."
  });
  Primrose.Text.Renderers = {};

  pliny.namespace({
    parent: "Text",
    name: "Themes",
    description: "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar."
  });
  Primrose.Text.Themes = {};

  pliny.namespace({
    parent: "Primrose",
    name: "X",
    description: "Extensions and components that combine other Primrose elements."
  });
  Primrose.X = {};

  pliny.value({
    parent: "Primrose",
    name: "SYS_FONTS",
    type: "String",
    description: "A selection of fonts that will match whatever the user's operating system normally uses."
  });
  Primrose.SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

  pliny.value({
    parent: "Primrose",
    name: "SKINS",
    type: "Array of String",
    description: "A selection of color values that closely match skin colors of people."
  });
  Primrose.SKINS = ["#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2", "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49", "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836", "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000", "#5B0001", "#302E2E"];

  pliny.value({
    parent: "Primrose",
    name: "SKIN_VALUES",
    type: "Array of Number",
    description: "A selection of color values that closely match skin colors of people."
  });
  Primrose.SKIN_VALUES = Primrose.SKINS.map(function (s) {
    return parseInt(s.substring(1), 16);
  });

  pliny.value({
    name: "isHomeScreen",
    type: "Boolean",
    description: "Flag indicating the script is currently running in an IFRAME or not."
  });
  window.isInIFrame = window.self !== window.top;

  pliny.value({
    name: "isMobile",
    type: "Boolean",
    description: "Flag indicating the current system is a recognized \"mobile\"\n\
device, usually possessing a motion sensor."
  });
  //window.isMobile

  pliny.value({
    name: "isGearVR",
    type: "Boolean",
    description: "Flag indicating the application is running on the Samsung Gear VR in the Samsung Internet app."
  });
  window.isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;

  pliny.value({
    name: "isiOS",
    type: "Boolean",
    description: "Flag indicating the current system is a device running the Apple\n\
iOS operating system: iPad, iPod Touch, iPhone. Useful for invoking optional code\n\
paths necessary to deal with deficiencies in Apple's implementation of web standards." });
  window.isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");

  pliny.value({
    name: "isOSX",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running the Apple\n\
OSX operating system. Useful for changing keyboard shortcuts to support Apple's\n\
idiosynchratic, concensus-defying keyboard shortcuts."
  });
  window.isOSX = /Macintosh/.test(navigator.userAgent || "");

  pliny.value({
    name: "isWindows",
    type: "Boolean",
    description: "Flag indicating the current system is a computer running one of\n\
the Microsoft Windows operating systems. We have not yet found a use for this flag."
  });
  window.isWindows = /Windows/.test(navigator.userAgent || "");

  pliny.value({
    name: "isOpera",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Opera.\n\
Opera is a substandard browser that lags adoption of cutting edge web technologies,\n\
so you are not likely to need this flag if you are using Primrose, other than to\n\
cajole users into downloading a more advanced browser such as Mozilla Firefox or\n\
Google Chrome."
  });
  window.isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  pliny.value({
    name: "isSafari",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Safari.\n\
Safari is an overly opinionated browser that thinks users should be protected from\n\
themselves in such a way as to prevent users from gaining access to the latest in\n\
cutting-edge web technologies. Essentially, it was replaced Microsoft Internet\n\
Explorer as the Internet Explorer of the web."
  });
  window.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;

  pliny.value({
    name: "isChrome",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Chrome\n\
or Chromium. Chromium was one of the first browsers to implement virtual reality\n\
features directly in the browser, thanks to the work of Brandon \"Toji\" Jones."
  });
  window.isChrome = !!window.chrome && !window.isOpera;

  pliny.value({
    name: "isFirefox",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Firefox.\n\
Firefox was one of the first browsers to implement virtual reality features directly\n\
in the browser, thanks to the work of the MozVR team."
  });
  window.isFirefox = typeof window.InstallTrigger !== 'undefined';

  pliny.value({
    name: "isWebKit",
    type: "Boolean",
    description: "Flag indicating the browser is one of Chrome, Safari, or Opera.\n\
WebKit browsers have certain issues in common that can be treated together, like\n\
a common basis for orientation events."
  });
  window.isWebKit = window.isiOS || window.isOpera || window.isChrome;

  pliny.value({
    name: "isIE",
    type: "Boolean",
    description: "Flag indicating the browser is currently calling itself Internet\n\
Explorer. Once the bane of every web developer's existence, it has since passed\n\
the torch on to Safari in all of its many useless incarnations."
  });
  window.isIE = /*@cc_on!@*/false || !!document.documentMode;

  pliny.value({
    parent: "Primrose",
    name: "RESOLUTION_SCALES",
    description: "Scaling factors for changing the resolution of the display when the render quality level changes."
  });
  Primrose.RESOLUTION_SCALES = [0.5, 0.25, 0.333333, 0.5, 1];
  if (!isMobile) {
    Primrose.RESOLUTION_SCALES.push(2);
  }

  pliny.enumeration({
    parent: "Primrose",
    name: "Quality",
    description: "Graphics quality settings."
  });
  Primrose.Quality = {
    NONE: 0,
    VERYLOW: 1,
    LOW: 2,
    MEDIUM: 3,
    HIGH: 4,
    MAXIMUM: Primrose.RESOLUTION_SCALES.length - 1
  };

  return Primrose;
}();