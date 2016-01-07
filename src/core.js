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

if ( typeof window.pliny === "undefined" ) {
  // shim out the documentation generator so it doesn't contribute
  // to overhead in release build.
  var pliny = ( function () {
    var nil = function () {
    };
    var pliniuses = {
      theYounger: nil,
      theElder: {
        namespace: nil,
        event: nil,
        function: nil,
        value: nil,
        class: nil,
        method: nil,
        property: nil
      }
    };
    return pliniuses;
  } )();
}

pliny.theElder.namespace( "Primrose", "Primrose is a framework for making applications in WebVR. The top-level namespace contains classes for manipulating and viewing 3D environments.");
var Primrose = {};


pliny.theElder.namespace( "Primrose.Input", "The Input namespace contains classes that handle user input, for use in navigating the 3D environment." );
Primrose.Input = {};


pliny.theElder.namespace( "Primrose.Output", "The Output namespace contains classes that handle output to devices other than the screen (e.g. Audio, Music, etc.)." );
Primrose.Output = {};


pliny.theElder.namespace( "Primrose.Text", "The Text namespace contains classes everything regarding the Primrose source code editor." );
Primrose.Text = {};


pliny.theElder.namespace( "Primrose.Text.CodePages", "The CodePages namespace contains international keyboard parameters." );
Primrose.Text.CodePages = {};


pliny.theElder.namespace( "Primrose.Text.CommandPacks", "The CommandPacks namespace contains sets of keyboard shortcuts for different types of text-oriented controls." );
Primrose.Text.CommandPacks = {};


pliny.theElder.namespace( "Primrose.Text.Controls", "The Controls namespace contains different types of text-oriented controls." );
Primrose.Text.Controls = {};


pliny.theElder.namespace( "Primrose.Text.Grammars", "The Grammars namespace contains grammar parsers for different types of programming languages, to enable syntax highlighting." );
Primrose.Text.Grammars = {};


pliny.theElder.namespace( "Primrose.Text.OperatingSystems", "The OperatingSystems namespace contains sets of keyboard shortcuts for different operating systems." );
Primrose.Text.OperatingSystems = {};


pliny.theElder.namespace( "Primrose.Text.Renderers", "The Renderers namespace contains different renderers for using the general Text Editor logic in different output systems. Current, Canvas2D is the only system that works. A system for DOM elements exists, but it is broken and not likely to be fixed any time soon." );
Primrose.Text.Renderers = {};


pliny.theElder.namespace( "Primrose.Text.Themes", "The Themes namespace contains color themes for text-oriented controls, for use when coupled with a parsing grammar." );
Primrose.Text.Themes = {};


pliny.theElder.value( "Primrose", {
  name: "SYS_FONTS",
  type: "String",
  description: "A selection of fonts that will match whatever the user's operating system normally uses."
} );
Primrose.SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";


pliny.theElder.value( "Primrose", {
  name: "SKINS",
  type: "Array of String",
  description: "A selection of color values that closely match skin colors of people."
} );
Primrose.SKINS = [ "#FFDFC4", "#F0D5BE", "#EECEB3", "#E1B899", "#E5C298", "#FFDCB2",
  "#E5B887", "#E5A073", "#E79E6D", "#DB9065", "#CE967C", "#C67856", "#BA6C49",
  "#A57257", "#F0C8C9", "#DDA8A0", "#B97C6D", "#A8756C", "#AD6452", "#5C3836",
  "#CB8442", "#BD723C", "#704139", "#A3866A", "#870400", "#710101", "#430000",
  "#5B0001", "#302E2E" ];
