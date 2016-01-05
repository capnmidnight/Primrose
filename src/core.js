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
console.clear();

if ( typeof window.pliny === "undefined" ) {
  // shim out the documentation generator so it doesn't contribute
  // to overhead in release build.
  var pliny = ( function () {
    var identity = function () {
    };
    var pliniuses = {
      younger: identity,
      elder: {
        namespace: identity,
        class: identity,
        function: identity,
        method: identity,
        note: identity
      }
    };
    pliniuses.younger.get = identity;
    return {the: pliniuses};
  } )();
}

pliny.the.elder.namespace( "Primrose", {description: "Primrose is a framework for making applications in WebVR."} );
pliny.the.elder.namespace( "Primrose.Input", {description: "The Input namespace contains classes that handle user input, for use in navigating the 3D environment."} );

var Primrose = {
  Input: {},
  Output: {},
  Text: {
    CodePages: {},
    CommandPacks: {},
    Controls: {},
    Grammars: {},
    OperatingSystems: {},
    Renderers: {},
    Themes: {}
  },
  SYS_FONTS: "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', " +
      "'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
  SKINS: [ "#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
    "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
    "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
    "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
    "#5B0001", "#302E2E" ]
};
