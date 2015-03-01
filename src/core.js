/*
 https://www.github.com/capnmidnight/VR
 Copyright (c) 2014 - 2015 Sean T. McBeth <sean@seanmcbeth.com>
 All rights reserved.
 
 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// Pyschologist.js: so named because it keeps me from going crazy


function makeURL(url, queryMap) {
    var output = [];
    for (var key in queryMap) {
        if (queryMap.hasOwnProperty(key) && !(queryMap[key] instanceof Function)) {
            output.push(encodeURIComponent(key) + "=" + encodeURIComponent(queryMap[key]));
        }
    }
    return url + "?" + output.join("&");
}

function XHR(url, method, type, progress, error, success, data) {
    var xhr = new XMLHttpRequest();
    xhr.onerror = error;
    xhr.onabort = error;
    xhr.onprogress = progress;
    xhr.onload = function () {
        if (xhr.status < 400) {
            if (success) {
                success(xhr.response);
            }
        }
        else if (error) {
            error();
        }
    };

    xhr.open(method, url);
    if (type) {
        xhr.responseType = type;
    }
    if (data) {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(data));
    }
    else {
        xhr.send();
    }
}

function GET(url, type, progress, error, success) {
    type = type || "text";
    XHR(url, "GET", type, progress, error, success);
}


function POST(url, data, type, progress, error, success) {
    XHR(url, "POST", type, progress, error, success, data);
}

function getObject(url, progress, error, success) {
    var progressThunk = success && error && progress,
            errorThunk = (success && error) || (error && progress),
            successThunk = success || error || progress;
    GET(url, "json", progressThunk, errorThunk, successThunk);
}

function sendObject(url, data, progress, error, success) {
    POST(url, data, "json",
            success && error && progress,
            (success && error) || (error && progress),
            success || error || progress);
}

// Utility functions for testing out event handlers. Meant only for learning
// about new APIs.
function XXX(msg, v) {
    return new Error(fmt("$1. Was given $2$3$2", msg, v ? '"' : "", v));
}

function E(elem, evt, thunk) {
    if (!elem || !elem.addEventListener) {
        throw XXX("must supply an element with an addEventListener method", elem);
    }
    if (!evt || typeof (evt) !== "string") {
        throw XXX("must provide the name of an event", evt);
    }

    if (!thunk) {
        thunk = console.log.bind(console, fmt("$1.$2", elem.tagName, evt));
    }

    elem.addEventListener(evt, thunk);
}

// Applying Array's slice method to array-like objects. Called with
// no parameters, this function converts array-like objects into
// JavaScript Arrays.
function arr(arg, a, b) {
    return Array.prototype.slice.call(arg, a, b);
}

function map(arr, fun) {
    return Array.prototype.map.call(arr, fun);
}

function reduce(arr, fun, base) {
    return Array.prototype.reduce.call(arr, fun, base);
}

function filter(arr, fun) {
    return Array.prototype.filter.call(arr, fun);
}

function ofType(arr, t) {
    if (typeof (t) === "function") {
        return filter(arr, function (elem) {
            return elem instanceof t;
        });
    }
    else {
        return filter(arr, function (elem) {
            return typeof (elem) === t;
        });
    }
}

function agg(arr, get, red) {
    if (typeof (get) !== "function") {
        get = (function (key, obj) {
            return obj[key];
        }).bind(window, get);
    }
    return arr.map(get).reduce(red);
}

function add(a, b) {
    return a + b;
}

function sum(arr, get) {
    return agg(arr, get, add);
}

function group(arr, getKey, getValue) {
    var groups = [];
    // we don't want to modify the original array.
    var clone = arr.slice();

    // Sorting the array by the group key criteeria first 
    // simplifies the grouping step. With a sorted array
    // by the keys, grouping can be done in a single pass.
    clone.sort(function (a, b) {
        var ka = getKey ? getKey(a) : a;
        var kb = getKey ? getKey(b) : b;
        if (ka < kb) {
            return -1;
        }
        else if (ka > kb) {
            return 1;
        }
        return 0;
    });

    for (var i = 0; i < clone.length; ++i) {
        var obj = clone[i];
        var key = getKey ? getKey(obj) : obj;
        var val = getValue ? getValue(obj) : obj;
        if (groups.length === 0 || groups[groups.length - 1].key !== key) {
            groups.push({key: key, values: []});
        }
        groups[groups.length - 1].values.push(val);
    }
    return groups;
}

// unicode-aware string reverse
var reverse = function (str) {
    str = str.replace(reverse.combiningMarks, function (match, capture1, capture2) {
        return reverse(capture2) + capture1;
    })
            .replace(reverse.surrogatePair, "$2$1");
    var res = "";
    for (var i = str.length - 1; i >= 0; --i) {
        res += str[i];
    }
    return res;
};
reverse.combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g;
reverse.surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

// An object inspection function.
function help(obj) {
    var funcs = {};
    var props = {};
    var evnts = [];
    if (obj) {
        for (var field in obj) {
            if (field.indexOf("on") === 0 && (obj !== navigator || field !== "onLine")) {
                // `online` is a known element that is not an event, but looks like
                // an event to the most basic assumption.
                evnts.push(field.substring(2));
            }
            else if (typeof (obj[field]) === "function") {
                funcs[field] = obj[field];
            }
            else {
                props[field] = obj[field];
            }
        }

        var type = typeof (obj);
        if (type === "function") {
            type = obj.toString().match(/(function [^(]*)/)[1];
        }
        else if (type === "object") {
            type = null;
            if (obj.constructor && obj.constructor.name) {
                type = obj.constructor.name;
            }
            else {
                var q = [{prefix: "", obj: window}];
                var traversed = [];
                while (q.length > 0 && type === null) {
                    var parentObject = q.shift();
                    parentObject.___traversed___ = true;
                    traversed.push(parentObject);
                    for (field in parentObject.obj) {
                        var testObject = parentObject.obj[field];
                        if (testObject) {
                            if (typeof (testObject) === "function") {
                                if (testObject.prototype && obj instanceof testObject) {
                                    type = parentObject.prefix + field;
                                    break;
                                }
                            }
                            else if (!testObject.___tried___) {
                                q.push({prefix: parentObject.prefix + field + ".", obj: testObject});
                            }
                        }
                    }
                }
                traversed.forEach(function (o) {
                    delete o.___traversed___;
                });
            }
        }
        obj = {
            type: type,
            events: evnts,
            functions: funcs,
            properties: props
        };

        console.debug(obj);

        return obj;
    }
    else {
        console.warn("Object was falsey.");
    }
}

/*
 * 1) If id is a string, tries to find the DOM element that has said ID
 *      a) if it exists, and it matches the expected tag type, returns the
 *          element, or throws an error if validation fails.
 *      b) if it doesn't exist, creates it and sets its ID to the provided
 *          id, then returns the new DOM element, not yet placed in the
 *          document anywhere.
 * 2) If id is a DOM element, validates that it is of the expected type,
 *      a) returning the DOM element back if it's good,
 *      b) or throwing an error if it is not
 * 3) If id is null, creates the DOM element to match the expected type.
 * @param {string|DOM element|null} id
 * @param {string} tag name
 * @param {function} DOMclass
 * @returns DOM element
 */
function cascadeElement(id, tag, DOMClass) {
    var elem = null;
    if (id === null) {
        elem = document.createElement(tag);
        elem.id = id = "auto_" + tag + Date.now();
    }
    else if (DOMClass === undefined || id instanceof DOMClass) {
        elem = id;
    }
    else if (typeof (id) === "string") {
        elem = document.getElementById(id);
        if (elem === null) {
            elem = document.createElement(tag);
            elem.id = id;
        }
        else if (elem.tagName !== tag.toUpperCase()) {
            elem = null;
        }
    }

    if (elem === null) {
        throw new Error(id + " does not refer to a valid " + tag + " element.");
    }
    else {
        elem.innerHTML = "";
    }
    return elem;
}

/*
 Replace template place holders in a string with a positional value.
 Template place holders start with a dollar sign ($) and are followed
 by a digit that references the parameter position of the value to 
 use in the text replacement. Note that the first position, position 0,
 is the template itself. However, you cannot reference the first position,
 as zero digit characters are used to indicate the width of number to
 pad values out to.
 
 Numerical precision padding is indicated with a period and trailing
 zeros.
 
 examples:
 fmt("a: $1, b: $2", 123, "Sean") => "a: 123, b: Sean"
 fmt("$001, $002, $003", 1, 23, 456) => "001, 023, 456"
 fmt("$1.00 + $2.00 = $3.00", Math.sqrt(2), Math.PI, 9001) 
 => "1.41 + 3.14 = 9001.00"
 fmt("$001.000", Math.PI) => 003.142
 */
function fmt(template) {
    // - match a dollar sign ($) literally, 
    // - (optional) then zero or more zero digit (0) characters, greedily
    // - then one or more digits (the previous rule would necessitate that
    //      the first of these digits be at least one).
    // - (optional) then a period (.) literally
    // -            then one or more zero digit (0) characters
    var paramRegex = /\$(0*)(\d+)(?:\.(0+))?/g;
    var args = arguments;
    return template.replace(paramRegex, function (m, pad, index, precision) {
        index = parseInt(index, 10);
        if (0 <= index && index < args.length) {
            var val = args[index];
            if (val !== null && val !== undefined) {
                if (val instanceof Date && precision) {
                    switch (precision.length) {
                        case 1:
                            val = val.getYear();
                            break;
                        case 2:
                            val = (val.getMonth() + 1) + "/" + val.getYear();
                            break;
                        case 3:
                            val = val.toLocaleDateString();
                            break;
                        case 4:
                            val = fmt.addMillis(val, val.toLocaleTimeString());
                            break;
                        case 5:
                        case 6:
                            val = val.toLocaleString();
                            break;
                        default:
                            val = fmt.addMillis(val, val.toLocaleString());
                            break;
                    }
                    return val;
                }
                else {
                    if (precision && precision.length > 0) {
                        val = sigfig(val, precision.length);
                    }
                    else {
                        val = val.toString();
                    }
                    if (pad && pad.length > 0) {
                        var paddingRegex = new RegExp("^\\d{" + (pad.length + 1) + "}(\\.\\d+)?");
                        while (!paddingRegex.test(val)) {
                            val = "0" + val;
                        }
                    }
                    return val;
                }
            }
        }
        return undefined;
    });
}

fmt.addMillis = function (val, txt) {
    return txt.replace(/( AM| PM|$)/, function (match, g1) {
        return (val.getMilliseconds() / 1000).toString().substring(1) + g1;
    });
};

function sigfig(x, y) {
    var p = Math.pow(10, y);
    var v = (Math.round(x * p) / p).toString();
    if (y > 0) {
        var i = v.indexOf(".");
        if (i === -1) {
            v += ".";
            i = v.length - 1;
        }
        while (v.length - i - 1 < y)
            v += "0";
    }
    return v;
}

var px = fmt.bind(this, "$1px");
var pct = fmt.bind(this, "$1%");
var ems = fmt.bind(this, "$1em");

function findEverything(elem, obj) {
    elem = elem || document;
    obj = obj || {};
    var arr = elem.querySelectorAll("*");
    for (var i = 0; i < arr.length; ++i) {
        var e = arr[i];
        if (e.id && e.id.length > 0) {
            obj[e.id] = e;
            if (e.parentElement) {
                e.parentElement[e.id] = e;
            }
        }
    }
    return obj;
}

function inherit(classType, parentType) {
    classType.prototype = Object.create(parentType.prototype);
    classType.prototype.constructor = classType;
}

function getSetting(name, defValue) {
    if (window.localStorage) {
        var val = window.localStorage.getItem(name);
        if (val) {
            try {
                return JSON.parse(val);
            }
            catch (exp) {
                console.error("getSetting", name, val, typeof (val), exp);
            }
        }
    }
    return defValue;
}

function setSetting(name, val) {
    if (window.localStorage && val) {
        try {
            window.localStorage.setItem(name, JSON.stringify(val));
        }
        catch (exp) {
            console.error("setSetting", name, val, typeof (val), exp);
        }
    }
}

function deleteSetting(name) {
    if (window.localStorage) {
        window.localStorage.removeItem(name);
    }
}

function readForm(ctrls) {
    var state = {};
    if (ctrls) {
        for (var name in ctrls) {
            var c = ctrls[name];
            if ((c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
                if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
                    state[name] = c.value;
                }
                else if (c.type === "checkbox" || c.type === "radio") {
                    state[name] = c.checked;
                }
            }
        }
    }
    return state;
}

function writeForm(ctrls, state) {
    if (state) {
        for (var name in ctrls) {
            var c = ctrls[name];
            if (state[name] !== null && state[name] !== undefined && (c.tagName === "INPUT" || c.tagName === "SELECT") && (!c.dataset || !c.dataset.skipcache)) {
                if (c.type === "text" || c.type === "password" || c.tagName === "SELECT") {
                    c.value = state[name];
                }
                else if (c.type === "checkbox" || c.type === "radio") {
                    c.checked = state[name];
                }
            }
        }
    }
}

function reloadPage() {
    document.location = document.location.href;
}

function makeSelectorFromObj(id, obj, def, target, prop, lbl) {
    var elem = cascadeElement(id, "select", HTMLSelectElement);
    var items = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var opt = document.createElement("option");
            var val = obj[key].name || key;
            opt.innerHTML = val;
            items.push(obj[key]);
            if (val === def) {
                opt.selected = "selected";
            }
            elem.appendChild(opt);
        }
    }

    if (target[prop] instanceof Function) {
        E(elem, "change", function () {
            target[prop](items[elem.selectedIndex]);
        });
    }
    else {

        E(elem, "change", function () {
            target[prop] = items[elem.selectedIndex];
        });
    }

    var container = cascadeElement("container -" + id, "div", HTMLDivElement);
    var label = cascadeElement("label-" + id, "span", HTMLSpanElement);
    label.innerHTML = " - " + lbl;
    label.for = elem;
    elem.title = lbl;
    elem.alt = lbl;
    container.appendChild(elem);
    container.appendChild(label);
    return container;
}

function makeHidingContainer(id, obj) {
    var elem = cascadeElement(id, "div", HTMLDivElement);
    elem.style.position = "absolute";
    elem.style.left = 0;
    elem.style.top = 0;
    elem.style.width = 0;
    elem.style.height = 0;
    elem.style.overflow = "hidden";
    elem.appendChild(obj);
    return elem;
}

// snagged and adapted from http://detectmobilebrowsers.com/
var isMobile = (function (a) {
    return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera),
        isiOS = /Apple-iP(hone|od|ad)/.test(navigator.userAgent || ""),
        isOSX = /Macintosh/.test(navigator.userAgent || ""),
        isWindows = /Windows/.test(navigator.userAgent || ""),
        isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,
        isFirefox = typeof InstallTrigger !== 'undefined',
        isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
        isChrome = !!window.chrome && !isOpera,
        isIE = /*@cc_on!@*/false || !!document.documentMode;


navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.RTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.RTCSessionDescription;

// this doesn't seem to actually work
screen.lockOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || function () {
};

// full-screen-ism polyfill
if (!document.documentElement.requestFullscreen) {
    if (document.documentElement.msRequestFullscreen) {
        document.documentElement.requestFullscreen = document.documentElement.msRequestFullscreen;
        document.exitFullscreen = document.msExitFullscreen;
    }
    else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.requestFullscreen = document.documentElement.mozRequestFullScreen;
        document.exitFullscreen = document.mozCancelFullScreen;
    }
    else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.requestFullscreen = document.documentElement.webkitRequestFullscreen;
        document.exitFullscreen = document.webkitExitFullscreen;
    }
}

function isFullScreenMode() {
    return (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

function requestFullScreen(vrDisplay, success) {
    if (vrDisplay instanceof Function) {
        success = vrDisplay;
        vrDisplay = null;
    }
    if (!isFullScreenMode()) {
        if (vrDisplay) {
            document.documentElement.requestFullscreen({vrDisplay: vrDisplay});
        }
        else {
            document.documentElement.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
        var interval = setInterval(function () {
            if (isFullScreenMode()) {
                clearInterval(interval);
                screen.lockOrientation("landscape-primary");
                if (success) {
                    success();
                }
            }
        }, 1000);
    }
    else if (success) {
        success();
    }
}

function exitFullScreen() {
    if (isFullScreenMode()) {
        document.exitFullscreen();
    }
}

function toggleFullScreen() {
    if (document.documentElement.requestFullscreen) {
        if (isFullScreenMode()) {
            exitFullScreen();
        }
        else {
            requestFullScreen();
        }
    }
}

function addFullScreenShim() {
    var elems = arr(arguments);
    elems = elems.map(function (e) {
        return {
            elem: e,
            events: help(e).events
        };
    });

    function removeFullScreenShim() {
        elems.forEach(function (elem) {
            elem.events.forEach(function (e) {
                elem.elem.removeEventListener(e, fullScreenShim);
            });
        });
    }

    function fullScreenShim(evt) {
        requestFullScreen(removeFullScreenShim);
    }

    elems.forEach(function (elem) {
        elem.events.forEach(function (e) {
            if (e.indexOf("fullscreenerror") < 0) {
                elem.elem.addEventListener(e, fullScreenShim, false);
            }
        });
    });
}

var exitPointerLock = (document.exitPointerLock || document.webkitExitPointerLock || document.mozExitPointerLock || function () {
}).bind(document);
function isPointerLocked() {
    return !!(document.pointerLockElement || document.webkitPointerLockElement || document.mozPointerLockElement);
}
var requestPointerLock = (document.documentElement.requestPointerLock || document.documentElement.webkitRequestPointerLock || document.documentElement.mozRequestPointerLock || function () {
}).bind(document.documentElement);