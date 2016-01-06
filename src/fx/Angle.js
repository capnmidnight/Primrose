/* 
 * Copyright (C) 2015 Sean
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
/* global Primrose */
Primrose.Angle = ( function ( ) {
  pliny.theElder.class( "Primrose", {
    name: "Angle",
    author: "Sean T. McBeth",
    description: "The Angle class smooths out the jump from 360 to 0 degrees. It keeps track of the previous state of angle values and keeps the change between angle values to a maximum magnitude of 180 degrees, plus or minus. This allows for smoother opperation as rotating past 360 degrees will not reset to 0, but continue to 361 degrees and beyond, while rotating behind 0 degrees will not reset to 360 but continue to -1 and below.\n\nWhen instantiating, choose a value that is as close as you can guess will be your initial sensor readings.\n\nThis is particularly important for the 180 degrees, +- 10 degrees or so. If you expect values to run back and forth over 180 degrees, then initialAngleInDegrees should be set to 180. Otherwise, if your initial value is anything slightly larger than 180, the correction will rotate the angle into negative degrees, e.g.:\n\tinitialAngleInDegrees = 0\n\tfirst reading = 185\n\tupdated degrees value = -175\n\nIt also automatically performs degree-to-radian and radian-to-degree conversions.",
    parameters: [
      {name: "initialAngleInDegrees", type: "Number", description: "(Required) Specifies the initial context of the angle. Zero is not always the correct value."}
    ]
  } );
  function Angle ( v ) {
    if ( typeof ( v ) !== "number" ) {
      throw new Error(
          "Angle must be initialized with a number. Initial value was: " + v );
    }

    var value = v,
        delta = 0,
        d1,
        d2,
        d3,
        DEG2RAD = Math.PI / 180,
        RAD2DEG = 180 / Math.PI;
    
    pliny.theElder.property( {name: "degrees", type: "Number", description: "get/set the current value of the angle in degrees."} );
    Object.defineProperty( this, "degrees", {
      set: function ( newValue ) {
        do {
          // figure out if it is adding the raw value, or whole
          // rotations of the value, that results in a smaller
          // magnitude of change.
          d1 = newValue + delta - value;
          d2 = Math.abs( d1 + 360 );
          d3 = Math.abs( d1 - 360 );
          d1 = Math.abs( d1 );
          if ( d2 < d1 && d2 < d3 ) {
            delta += 360;
          }
          else if ( d3 < d1 ) {
            delta -= 360;
          }
        } while ( d1 > d2 || d1 > d3 );
        value = newValue + delta;
      },
      get: function ( ) {
        return value;
      }
    } );
      
    pliny.theElder.property( {name: "radians", type: "Number", description: "get/set the current value of the angle in radians."} );
    Object.defineProperty( this, "radians", {
      get: function ( ) {
        return this.degrees * DEG2RAD;
      },
      set: function ( val ) {
        this.degrees = val * RAD2DEG;
      }
    } );
  }

  return Angle;
} )( );