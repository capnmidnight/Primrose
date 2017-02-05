
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

const VK_ENTER = 13;
const VK_SPACE = 32;
const POLYFILL_CLASS = 'is-polyfilled';
const POLYFILL_CLASS_NAME = `.${POLYFILL_CLASS}`;

// For a full featured detection support see Mathias Bynens implementation: http://mathiasbynens.be/notes/html5-details-jquery
// No need to suppport Chrome-10, so this should be sufficient
const hasNativeDetailsSupport = ('open' in document.createElement('details'));

function injectCSS() {

  if(hasNativeDetailsSupport) {
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

  const css = `
    details, details>summary {
      display: block;
    }
    details > summary {
      min-height: 1.4em;
      padding: 0.125em;
    }
    details > summary:before {
      content:"►";
      font-size: 1em;
      position: relative;
      display: inline-block;
      width: 1em;
      height: 1em;
      margin-right: 0.3em;
      -webkit-transform-origin: 0.4em 0.6em;
         -moz-transform-origin: 0.4em 0.6em;
          -ms-transform-origin: 0.4em 0.6em;
              transform-origin: 0.4em 0.6em;
    }
    details[open] > summary:before {
      content:"▼"
    }
    details > *:not(summary) {
      display: none;
      opacity: 0;
    }
    details[open] > *:not(summary) {
      display: block;
      opacity: 1;

      /* If you need to preserve the original display attribute then wrap detail child elements in a div-tag */
      /* e.g. if you use an element with "display: inline", then wrap it inside a div */
      /* Too much hassle to make JS preserve original attribute */
    }

    /* Use this to hide native indicator and use pseudoelement instead
    summary::-webkit-details-marker {
      display: none;
    }
    */`;

  if(document.querySelector('#details-polyfill-css') === null) {
    const style = document.createElement('style');
    style.id = 'details-polyfill-css';
    style.textContent = css
      .replace(/(\/\*([^*]|(\*+[^*\/]))*\*+\/)/gm, '') // remove comments from CSS, see: http://www.sitepoint.com/3-neat-tricks-with-regular-expressions/
      .replace(/\s/gm, ' ');                           // replaces consecutive spaces with a single space

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
export function polyfillDetails(fromEl = document) {

  if(hasNativeDetailsSupport) {
    return false;
  }

  let result = false;

  [...fromEl.querySelectorAll(`details:not(${POLYFILL_CLASS_NAME})`)].forEach( details => {

    details.classList.add(POLYFILL_CLASS); // flag to prevent doing this more than once
    let summary = [...details.childNodes].find( n => n.nodeName.toLowerCase() === 'summary');

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
    summary.addEventListener('keydown', event => {
      if (event.target === summary) {
        if (event.keyCode === VK_ENTER || event.keyCode === VK_SPACE) {
          event.preventDefault();
          event.stopPropagation();

          // Trigger mouse click event for any attached listeners.
          const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          summary.dispatchEvent(evt);
        }
      }
    }, true);

    summary.addEventListener('click', event => {
      if (event.target === summary) {
        if (details.hasAttribute('open')) {
          details.removeAttribute('open');
        }
        else {
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
window.addEventListener('load', function() {
  injectCSS();
  polyfillDetails(document);
});

