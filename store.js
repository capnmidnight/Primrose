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

var modA = isOSX ? "metaKey" : "ctrlKey";
var modB = isOSX ? "altKey" : "shiftKey";
var cmdPre = isOSX ? "(CMD+OPT" : "(CTRL+SHIFT";
var vrDisplay, vrSensor, vrEffect, renderer;

function showSection(id) {
    var tabs = document.querySelectorAll(".tab"),
            i, t;
    for (i = 0; i < tabs.length; ++i) {
        t = tabs[i];
        t.style.display = t.id === id ? "block" : "none";
    }
    tabs = document.querySelectorAll(".menu > tbody > tr > td > a");
    var r = new RegExp(fmt("^javascript:showSection\\('($1)?'\\);$", id));
    for (i = 0; i < tabs.length; ++i) {
        t = tabs[i];
        t.className = r.test(t.href) ? "disabled button" : "secondary button";
    }
}

function showHide(id) {
    var a = document.getElementById("minifyButton");
    var b = document.getElementById(id);
    b.style.display = a.collapsed ? "block" : "none";
    a.innerHTML = (a.collapsed ? "hide " : "show ") + cmdPre + "+M)";
    a.collapsed = !a.collapsed;
    if (isPointerLocked() && !a.collapsed) {
        exitPointerLock();
    }
    else if (isFullScreenMode() && !isPointerLocked() && a.collapsed) {
        requestPointerLock();
    }
}


function goFullscreen() {
    showHide("windowInterior");
    requestPointerLock();
    if (vrDisplay) {
        if(!vrEffect){
            vrEffect = new THREE.VREffect(renderer, vrDisplay);
            document.body.style.backgroundImage = "url(img/bg3.jpg)";
        }
        if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen({vrDisplay: vrDisplay});
        }
        else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen({vrDisplay: vrDisplay});
        }
    }
    else {
        requestFullScreen();
    }
}

function gotVRDevices(devices) {
    for (var i = 0; i < devices.length; ++i) {
        var device = devices[i];
        if (device instanceof HMDVRDevice) {
            vrDisplay = device;
        }
        else if (device instanceof PositionSensorVRDevice) {
            vrSensor = device;
        }
        if (vrSensor && vrDisplay) {
            break;
        }
    }
}

function showMailingListSignup() {
    require(["mojo/signup-forms/Loader"], function (L) {
        L.start({
            "baseUrl": "mc.us8.list-manage.com",
            "uuid": "81af61e5ed1771efc26829263",
            "lid": "3b7687c834"
        });
    });
}

if (navigator.getVRDevices) {
    navigator.getVRDevices().then(gotVRDevices);
} else if (navigator.mozGetVRDevices) {
    navigator.mozGetVRDevices(gotVRDevices);
}