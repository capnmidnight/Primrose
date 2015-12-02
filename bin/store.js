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

/* global isMobile, StripeCheckout, gotVRDevices, Primrose, jQuery */

window.fnames = [ 'EMAIL', 'FNAME', 'LNAME' ];
window.ftypes = [ 'email', 'text', 'text' ];

var ctrls,
    lastTab = "home";

function showSection ( id, skipPush ) {
  var tab;
  if ( id ) {
    tab = document.getElementById( id );
    if ( !tab ) {
      // in case someone tries to type in their own hash
      tab = document.getElementsByTagName( "article" )[0];
      id = tab.id;
    }
    tab.className = "selected";
    tab.scrollTop = 0;
  }

  if ( !isMobile || lastTab !== id ) {
    if ( lastTab ) {
      tab = document.getElementById( lastTab );
      tab.className = "";
    }
    lastTab = lastTab === id ? null : id;
    tabs = document.querySelectorAll( "#menu > ul > li > a" );
    var r = new RegExp( fmt( "^javascript:showSection\\('($1)?'\\);$",
        lastTab ) );
    for ( i = 0; i < tabs.length; ++i ) {
      t = tabs[i];
      if ( r.test( t.href ) ) {
        t.className = "primary selected button";
      }
      else {
        t.className = "primary button";
      }
    }
    
    var url = "#" + ( lastTab || "" );
    if ( !skipPush ) {
      history.pushState( null, "Primrose" + ( lastTab ? " > " + lastTab : "" ),
          url );
    }

    //ga( "send", "pageview", url );
  }
}

window.addEventListener( "popstate", function ( evt ) {
  var nextTab = location.hash;
  if ( nextTab.length > 0 ) {
    nextTab = nextTab.substring( 1 );
    showSection( nextTab, true );
  }
} );

function initStore ( ) {
  ctrls = findEverything();
  
  function byClass(c, t){
    Array.prototype.forEach.call(document.getElementsByClassName(c), t);
  }
  
  byClass( 
    "version-label",
    function(l){
      l.innerHTML = Primrose.VERSION;
    });
  var pre = "bin/Primrose-" + Primrose.VERSION.substring(1);
  byClass(
    "download-link",
    function(l){
      l.href = pre + ".js";
    });
  byClass(
    "download-minified-link",
    function(l){
      l.href = pre + ".min.js";
    });
  
  var hash = location.hash.substring( 1 );
  if ( hash.length > 0 && hash !== lastTab ) {
    showSection( hash, true );
  }
}
