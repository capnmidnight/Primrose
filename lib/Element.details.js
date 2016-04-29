// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @warning_level VERBOSE
// @jscomp_warning missingProperties
// @output_file_name Element.details.js
// @check_types
// ==/ClosureCompiler==

/*
HTMLElement.prototype.insertAdjacentHTML = https://gist.github.com/1276030
*/



;(function(global, support) {

	"use strict";

	if(!support) {
		var /** @type {Object} */
		    open_property
		    /** @type {Function} */
		  , event_DetailClick
		  	/** @type {Function} */
		  , detailsShim
		  	/** @type {Function} */
		  , init
		;

		//style
		document.head.insertAdjacentHTML("beforeend", "<br><style>" +//<br> need for all IE
			"details{display:block}" +
			"details>*{display:none}" +
			"details>summary,details>summary,details>.▼▼{display:block}" +
			"details .details-marker:before{content:'►'}" +
			"details.▼ .details-marker:before{content:'▼'}" +
			"details.▼>*{display:block}" +
		"</style>");

		// property 'open'
		open_property = {
			"get" : function() {
				if(!("nodeName" in this) || this.nodeName.toUpperCase() != "DETAILS")return void 0;
				
				return this.hasAttribute("open");
			},
			"set" : function(booleanValue) {
				if(!("nodeName" in this) || this.nodeName.toUpperCase() != "DETAILS")return void 0;
				
				detailsShim(this);
				
				this.classList[booleanValue ? "add" : "remove"]('▼');
				(this[booleanValue ? 'setAttribute' : 'removeAttribute'])("open", "open");
				
				return booleanValue;
			}
		};
	
		//event		
		event_DetailClick = function(e) {
			if(e.detail === 0)return;//Opera generate "click" event with `detail` == 0 together with "keyup" event
			
			// 32 - space. Need this ???
			// 13 - Enter.
			
			if(e.keyCode === 13 ||//e.type == "keyup"
			   e.type === "click")
				this.parentNode["open"] = !this.parentNode["open"];
		};

		//details shim
		detailsShim = function(details) {
			if(details._ && details._["__isShimmed"])return;
			
			if(!details._)details._ = {};
			
			var /** @type {Element} */
				summary,
				/** @type {number} */
				i = 0,
				child,
				j = -1;
						
			//Wrap text node's and found `summary`
			while(child = details.childNodes[++j]) {
				if(child.nodeType === 3 && /[^\t\n\r ]/.test(child.data)) {
					details.insertBefore(
						document.createElement("x-i")//Create a fake inline element
						, child).innerHTML = child.data;

					details.removeChild(child);
				}
				else if(child.nodeName.toUpperCase() == "SUMMARY")summary = child;
			}
			
			//Create a fake "summary" element
			if(!summary)
				(
					summary = document.createElement("x-s")
				).innerHTML = "Details",
				summary.className = "▼▼";//http://css-tricks.com/unicode-class-names/
				
			//Put summary as a first child
			details.insertBefore(summary, details.childNodes[0]);
			//Create `details-marker` and put it as a summary first child
			summary.insertBefore(document.createElement('x-i'), summary.childNodes[0])
				.className = "details-marker";
			
			//For access from keyboard
			summary.tabIndex = 0;
			
			//events
			summary.addEventListener("click", event_DetailClick, false);
			summary.addEventListener("keyup", event_DetailClick, false);
			
			//flag to avoid double shim
			details._["__isShimmed"] = 1;
		};
		
		//init
		init = function() {
			// property 'open'
			Object.defineProperty(global["Element"].prototype, "open", open_property);
			
			var detailses = document.getElementsByTagName("details"),
				details,
				i = -1;
			while(details = detailses[++i]) {
				//DOM API
				details["open"] = 
					details.hasAttribute("open");
			}
		};
		
		//auto init
		if(document.readyState != "complete")
			document.addEventListener("DOMContentLoaded", init, false);
		else init();
	}
	else {
		//TODO:: for animation and over stuffs we need to listen "open" property change and add "open" css class for <details> element
	}
})(
	window,//global
	
	'open' in document.createElement('details')// Chrome 10 will fail this detection, but Chrome 10 is no longer existing
);

