'use strict';

/**
 * Get element by CSS selector
 * Alias for (element||document).querySelector
 *
 * @see document.querySelector
 * @see https://github.com/kentcdodds/es6-todomvc/blob/master/js/helpers.js
 * @see http://stackoverflow.com/questions/34157329/queryselector-and-queryselectorall-alias
 * @param selector
 * @param element
 * @returns {Element}
 */
export function qs(selector, element = document) {
  return element.querySelector(selector);
}

/**
 * Get elements by CSS selector
 * Alias for (element||document).querySelectorAll
 * The returned NodeList is not iterable, e.g. with foreach).
 * Use a for loop or the spread operator to iterate
 *
 * @example
 * for (let el of document.qsa('h1')) {
 *   console.log(el);
 * }
 *
 * // ... or use the spread operator:
 * [... document.qsa('h1')].forEach(function (el) {
 *   console.log(el);
 * });
 *
 * @see document.querySelectorAll
 * @see https://github.com/kentcdodds/es6-todomvc/blob/master/js/helpers.js
 * @see http://stackoverflow.com/questions/34157329/queryselector-and-queryselectorall-alias
 * @param selector
 * @param element
 * @returns {NodeList}
 */
export function qsa(selector, element = document) {
  return element.querySelectorAll(selector);
}

/**
 * Find the element's parent with the given tag name:
 * parent(qs('a'), 'div');
 *
 * @param element
 * @param tagName
 * @returns {null|Node}
 */
export function parent(element, tagName) {
  if (!element.parentNode || element.parentNode.tagName === undefined) {
    return null;
  }
  if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
    return element.parentNode;
  }
  return parent(element.parentNode, tagName);
}

/**
 * Remove child element(s)
 * element.innerHTNL = '' has a performance penality!
 * @see http://jsperf.com/empty-an-element/16
 * @see http://jsperf.com/force-reflow
 * @param element
 * @param forceReflow
 * @returns {*}
 */
export function removeChilds(element, forceReflow = true) {

  // See: http://jsperf.com/empty-an-element/16
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
  if(forceReflow) {
    // See: http://jsperf.com/force-reflow
    const d = element.style.display;

    element.style.display = 'none';
    element.style.display = d;
  }
  return element;
}
