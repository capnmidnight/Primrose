(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("index", [], factory);
	else if(typeof exports === 'object')
		exports["index"] = factory();
	else
		root["index"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	
	'use strict';
	
	/**
	 * The &lt;details&gt; element specifies additional details that the user can view or hide on demand.
	 * The &lt;summary&gt; element defines a visible heading for the &lt;details&gt; element.
	 * The heading can be clicked to view/hide the details.
	 * The &lt;details&gt; element currently has very limited cross-browser support.
	 * This polyfill provides support for the &lt;detail&gt; element across all modern browsers,
	 *
	 * Code copied/modified/inspired from/by:
	 *   https://github.com/jordanaustin/Details-Expander
	 *   https://github.com/chemerisuk/better-details-polyfill
	 *   http://codepen.io/stevef/pen/jiCBE
	 *   http://blog.mxstbr.com/2015/06/html-details/
	 *   http://html5doctor.com/the-details-and-summary-elements/
	 *   http://zogovic.com/post/21784525226/simple-html5-details-polyfill
	 *   http://www.sitepoint.com/fixing-the-details-element/
	 *   https://www.smashingmagazine.com/2014/11/complete-polyfill-html5-details-element/
	 *   http://mathiasbynens.be/notes/html5-details-jquery
	 *   https://www.w3.org/TR/2011/WD-html5-author-20110705/the-details-element.html
	 *   https://www.w3.org/TR/html-aria/#index-aria-group
	 *   https://www.w3.org/WAI/GL/wiki/Using_aria-expanded_to_indicate_the_state_of_a_collapsible_element
	 *   https://www.w3.org/TR/wai-aria-practices-1.1/
	 *   https://www.w3.org/TR/html-aria/#index-aria-group
	 */
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.polyfillDetails = polyfillDetails;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var VK_ENTER = 13;
	var VK_SPACE = 32;
	var POLYFILL_CLASS = 'is-polyfilled';
	var POLYFILL_CLASS_NAME = '.' + POLYFILL_CLASS;
	
	// For a full featured detection support see Mathias Bynens implementation: http://mathiasbynens.be/notes/html5-details-jquery
	// No need to suppport Chrome-10, so this should be sufficient
	var hasNativeDetailsSupport = 'open' in document.createElement('details');
	
	function injectCSS() {
	
	  if (hasNativeDetailsSupport) {
	    return false;
	  }
	
	  /*
	   CSS Modified from: https://github.com/jordanaustin/Details-Expander/blob/master/src/css/main.css
	    NOTE:
	   These are defaults meant to mimic the default unstyled browser look.
	   I highly recommend you style your details tags but don't do it here.
	   Just overwrite the style. Almost everything can be fully customized.
	   Anything that shouldn't be overwritten has an !important on it.
	    Semantic (correct) markup example:
	    <details role="group" open>
	   <summary role="button">Show/Hide me</summary>
	   <p>Some content ..... etc.</p>
	   </details>
	     Note: There is no guarantee that the browser's implementation of the <details> element will
	   respect it's child elements layout when toggeling the details. To preserve the child elements layout,
	   always wrap the child elements inside a <div>.
	    <style>
	   .my-content { display : flex; }
	   </style
	   <details role="group">
	   <summary role="button">Show/Hide me</summary>
	   <div>
	   <div class="my-content">
	   <p>Some content ..... etc.</p>
	   </div>
	   </div>
	   </details>
	   */
	
	  var css = '\n    details, details>summary {\n      display: block;\n    }\n    details > summary {\n      min-height: 1.4em;\n      padding: 0.125em;\n    }\n    details > summary:before {\n      content:"\u25BA";\n      font-size: 1em;\n      position: relative;\n      display: inline-block;\n      width: 1em;\n      height: 1em;\n      margin-right: 0.3em;\n      -webkit-transform-origin: 0.4em 0.6em;\n         -moz-transform-origin: 0.4em 0.6em;\n          -ms-transform-origin: 0.4em 0.6em;\n              transform-origin: 0.4em 0.6em;\n    }\n    details[open] > summary:before {\n      content:"\u25BC"\n    }\n    details > *:not(summary) {\n      display: none;\n      opacity: 0;\n    }\n    details[open] > *:not(summary) {\n      display: block;\n      opacity: 1;\n\n      /* If you need to preserve the original display attribute then wrap detail child elements in a div-tag */\n      /* e.g. if you use an element with "display: inline", then wrap it inside a div */\n      /* Too much hassle to make JS preserve original attribute */\n    }\n\n    /* Use this to hide native indicator and use pseudoelement instead\n    summary::-webkit-details-marker {\n      display: none;\n    }\n    */';
	
	  if (document.querySelector('#details-polyfill-css') === null) {
	    var style = document.createElement('style');
	    style.id = 'details-polyfill-css';
	    style.textContent = css.replace(/(\/\*([^*]|(\*+[^*\/]))*\*+\/)/gm, '') // remove comments from CSS, see: http://www.sitepoint.com/3-neat-tricks-with-regular-expressions/
	    .replace(/\s/gm, ' '); // replaces consecutive spaces with a single space
	
	    // WebKit hack
	    style.appendChild(document.createTextNode(''));
	
	    // Must be the first stylesheet so it does not override user css
	    document.head.insertBefore(style, document.head.firstChild);
	    return true;
	  }
	  return false;
	}
	
	/**
	 * Polyfill for the <details> element
	 * @param fromEl where to start, default document node
	 * @returns {boolean} true i any details element has been polyfilled
	 */
	function polyfillDetails() {
	  var fromEl = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
	
	
	  if (hasNativeDetailsSupport) {
	    return false;
	  }
	
	  var result = false;
	
	  [].concat(_toConsumableArray(fromEl.querySelectorAll('details:not(' + POLYFILL_CLASS_NAME + ')'))).forEach(function (details) {
	
	    details.classList.add(POLYFILL_CLASS); // flag to prevent doing this more than once
	    var summary = [].concat(_toConsumableArray(details.childNodes)).find(function (n) {
	      return n.nodeName.toLowerCase() === 'summary';
	    });
	
	    // If there is no child summary element, this polyfill
	    // should provide its own legend; "Details"
	    if (!summary) {
	      summary = document.createElement('summary');
	      summary.textContent = 'Details';
	      details.insertBefore(summary, details.firstChild);
	    }
	
	    // <summary> must be the first child of <details>
	    if (details.firstChild !== summary) {
	      details.removeChild(summary);
	      details.insertBefore(summary, details.firstChild);
	    }
	
	    // Should be focusable
	    summary.tabIndex = 0;
	
	    // Events
	    summary.addEventListener('keydown', function (event) {
	      if (event.target === summary) {
	        if (event.keyCode === VK_ENTER || event.keyCode === VK_SPACE) {
	          event.preventDefault();
	          event.stopPropagation();
	
	          // Trigger mouse click event for any attached listeners.
	          var evt = new MouseEvent('click', {
	            bubbles: true,
	            cancelable: true,
	            view: window
	          });
	          summary.dispatchEvent(evt);
	        }
	      }
	    }, true);
	
	    summary.addEventListener('click', function (event) {
	      if (event.target === summary) {
	        if (details.hasAttribute('open')) {
	          details.removeAttribute('open');
	        } else {
	          details.setAttribute('open', 'open');
	        }
	      }
	    }, true);
	
	    result = true;
	  });
	
	  return result;
	}
	
	/*
	 document.addEventListener('DOMContentLoaded', () => {
	 injectCSS();
	 polyfillDetails(document);
	 });
	 */
	
	// MDL listens to this event, not DOMContentLoaded
	window.addEventListener('load', function () {
	  injectCSS();
	  polyfillDetails(document);
	});

/***/ }
/******/ ])
});
;
//# sourceMappingURL=index.js.map