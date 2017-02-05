'use strict';
import 'babel-polyfill';
import requireUncached from 'require-uncached';
import jsdomify from 'jsdomify';
import { assert } from 'chai';
import sinon from 'sinon';
import { qs, qsa } from './helpers/domHelpers';

const VK_ENTER = 13;
const VK_SPACE = 32;

describe('details polyfill', () => {

  const fixture = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Details Fixture</title>
</head>
<body>
<div id='mount'>
  <details id="simple-details" role="group" open>
    <summary role="button">Summary</summary>
    <p>A paragraph</p>
  </details>

  <details id="make-summary-to-be-first-child" role="group">
    <p>A paragraph before summary</p>
    <summary role="button">Summary</summary>
  </details>

  <details id="it-has-nested-details" role="group">
    <summary role="button">Summary</summary>
    <p>A paragraph</p>

    <details role="group">
      <summary role="button">Nested details</summary>
      <div>A div</div>
    </details>
  </details>

  <details id="it-provides-a-summary-element">
   <p>A paragraph but no summary element</p>
  </details>

  <div id="hook">
  </div>
</div>
</body>
</html>`;

  const fragment = `
<details id="fragment" role="group">
  <summary role="button">Fragment</summary>
  <p>This details should be inserted and polyfilled</p>
</details>`;

  let Details;
  let nativeSupport;

  before ( () => {
    jsdomify.create(fixture);

    nativeSupport =  ('open' in document.createElement('details'));

    // Must load details polyfill after jsdom
    Details = requireUncached('../src/index');

    // Do I need this? "Waiting for content to be loaded in jsdom", see: https://gist.github.com/chad3814/5059671

  });

  after ( () => {
    jsdomify.destroy()
  });

  it('injects CSS', () => {
    if(!nativeSupport) {
      assert.isNotNull(qs('#details-polyfill-css'));
    }
  });

  it('is polyfilled', () => {
    if(!nativeSupport) {
      assert.isNotNull(qs('#details-polyfill-css'), 'Expected CSS for detials polyfill');

      [...qsa('details')].forEach(details => {
        assert.isTrue(details.classList.contains('is-polyfilled'), 'Expected details element to have class "is-polyfilled"' );
      });
    }
  });

  it('is focusable', () => {
    if(!nativeSupport) {
      assert.isAtLeast(qs('summary').tabIndex, 0);
    }
  });

  it('makes summary element to be first child', () => {
    if(!nativeSupport) {
      assert.equal(qs('#make-summary-to-be-first-child').firstElementChild.nodeName.toLowerCase(), 'summary');
    }
  });

  it('provides a summary element if none is present', () => {
    if(!nativeSupport) {
      assert.equal(qs('#it-provides-a-summary-element').firstElementChild.nodeName.toLowerCase(), 'summary');
    }
  });

  it('polyfills successfully when a new details tag is appended to the DOM', () => {
    if(!nativeSupport) {
      let hook = qs('#hook');
      hook.insertAdjacentHTML('beforeend', fragment);
      Details.polyfillDetails(hook);
      [...qsa('details', hook)].forEach(details => {
        assert.isTrue(details.classList.contains('is-polyfilled'), 'Expected details element to have class "is-polyfilled"');
      });
    }
  });

  it('should polyfill only once', () => {
    if(!nativeSupport) {
      Details.polyfillDetails();
      let isPolyfilled = Details.polyfillDetails();
      assert.isFalse(isPolyfilled, 'Expected tol polyfill only once');
    }
  });

  it('toggles open attribute when user clicks the summary tag', () => {
    if(!nativeSupport) {
      let details = qs('#simple-details');
      assert.isTrue(details.hasAttribute('open'));

      // Trigger mouse click event summary element.
      const evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      details.firstElementChild.dispatchEvent(evt);
      assert.isFalse(details.hasAttribute('open'));
    }
  });

  it('toggles open on enter key', () => {
    if(!nativeSupport) {
      let details = qs('#it-has-nested-details');
      let isOpen = details.hasAttribute('open');
      triggerKeyboardEvent(details.firstElementChild, VK_ENTER);
      assert.notEqual(isOpen, details.hasAttribute('open'));
    }
  });

  it('toggles open on space key', () => {
    if(!nativeSupport) {
      let details = qs('#it-has-nested-details');
      let isOpen = details.hasAttribute('open');
      triggerKeyboardEvent(details.firstElementChild, VK_SPACE);
      assert.notEqual(isOpen, details.hasAttribute('open'));
    }
  });

  it('emits a click event when toggled via keyboard or mouse', () => {
    let details = qs('#it-has-nested-details');
    let listener = sinon.spy();
    details.addEventListener('click', listener);
    triggerKeyboardEvent(details.firstElementChild, VK_ENTER);
    assert.isTrue(listener.calledOnce);
    details.removeEventListener('click', listener);
  });

  function triggerKeyboardEvent(target, keyCode) {
    var event = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode : keyCode
    });
    target.dispatchEvent(event);
  }
});
