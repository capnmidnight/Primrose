# CHANGELOG

KEY:
* [**Chromium** - The WebVR-enabled builds of Chromium provided by Brandon Jones](https://webvr.info/get-chrome/).
* [**Chrome** - The latest release version of Google Chrome](https://www.google.com/chrome/)
* [**Nightly** - The nightly development builds of Mozilla Firefox](https://nightly.mozilla.org/)
* [**Firefox** - The latest release version of Mozilla Firefox](https://www.mozilla.org/en-US/firefox/products/)
* [**Gear VR** - The "Samsung Internet for Gear VR" app in the Samsung Store on the Gear VR](http://developer.samsung.com/technical-doc/view.do?v=T000000270L)
* **Windows** - Windows 8.1 and Windows 10.
* **Android** - Android 6.0.1 running on the Samsung Galaxy S7

## v0.23.3 - 2016/05/09

* Bugs
  * Fix for critical Firefox issue! Any DOM elements that are acquired before `document.readState === "complete"` will not be the same object references as those acquired after. It's like Firefox throws away the DOM and rebuilds it from scratch after the `DOMContentLoaded` event.
* Open issues
  * Windows
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - "NONE", in the sense that it works as expected. There is no HMD support, but that is to be expected before WebVR lands in the full release version of Chrome.
    * Nightly
      * The HMD tracks strangely.
      * Gamepad input slews to the right.
    * Firefox
      * No HMD support (WebVR not yet available in Firefox).
      * Gamepad input slews to the right.
  * Android
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - "NONE", in the sense that it works as expected. Device Orientation fallback has some problems with drift, but that is to be expected before WebVR lands in the full release version of Chrome.
    * Nightly
      * Low frame rate in fullscreen mode.
    * Firefox
      * Device Orientation fallback has some problems with drift.
      * Image inverts under certain tilt conditions.
      * Low frame rate in fullscreen mode.
    * Gear VR - Works as far as Primrose is concerned, but Samsung's browser for Gear VR currently has a number of defects:
      * Orientation tracking is pretty bad, making the overall experience very bad.
      * The touchpad doesn't work, so interactions are not working.
      * Attaching a Bluetooth keyboard seems to make the browser unable to enter fullscreen mode.
  * All platforms
    * Dynamic object allocation causing periodic garbage collections.
    * Use of expando-objects instead of HashMaps causing V8 deoptimization.
    * Leap Motion input disabled.
    * Multiplayer disabled.
    * Device fusion over WebRTC disabled.
    * Passthrough Cameras disabled.
    * No options UI for keyboard preferences.
    * No text-input for single-button, passive HMD devices.
    * No support for tabbing through text fields.
    * CSS text in documentation is not syntax highlighted.
    * HTML text in documentation is not syntax highlighted.
    * Documentation is only available in English.
    * Button model is too short for comfort.
    * Gaze action has no visual indicator of progress.
    * Gaze action does not trigger Surfaces.
    * No support for Unicode "Alt-codes".


## v0.23.2 - 2016/05/08

* Bugs
  * Fixed documentation TOC hider for Firefox.
  * Fixed transparency for the most part.
  * Fixed error that would occur in the "editorVR" demo when the user elected to not return an update function from their script.
  * Fixed "any key" behavior.
  * Fixed an issue where entering fullscreen on mobile would fail because requesting pointerlock would fail.
  * Added JSON MIME type for web server. I have no idea why my testing was working before.
  * Fixed an issue where stereo images did not render in mono-view.
  * Fixed an error when hiding the editor in the "editorVR" demo.
* Admin
  * Now showing menu on main page on mobile.
  * Turned fog off by default. It's still an option.
  * Removed the mailing list from the front page. It was breaking in some browsers and I don't have time to figure it out right now.
  * Documentation now gets carved out to a separate file when releases are built, to make for a smaller main script file if you don't want to also load the documentation.
  * Updated documentation for [`axis()`](index.html#axis).
  * Automatically hide TOC on mobile.
* Features
  * Made the editor in the "editorVR" demo follow the user, so it's easier to find.
  * Auto quality scaling: 
    * If the animation falls under 45FPS, the resolution of the rendering is automatically degraded. 
    * On desktop, if the animation hits 60+FPS, the resolution of the rendering is automatically upgraded. Mobile devices are too volatile to do this reliably.
    * In the "editorVR" demo, if you hit the minimum quality setting and the rendering is still slow
      * your live-coded script is canceled,
      * all of your objects removed from the scene,
      * and they don't return until you edit your script.
  * Multiple HMDs connected to the machine (for those rare people with both the Rift and the Vive) now each have their own "Go VR" button, listing which device they will connect to.
  * New [quickstart](/quickstart.zip) template package.
* Open issues
  * Windows
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - No HMD support (Of course, WebVR not yet available in Chrome).
    * Nightly
      * Only the "editorVR" demo currently works.
      * Text baseline in canvas is incorrect.
      * The image does not fill the HMD.
      * Gamepad input slews to the right.
    * Firefox
      * Only the "editorVR" demo currently works.
      * Text baseline in canvas is incorrect.
      * No HMD support (WebVR not yet available in Firefox).
      * Gamepad input slews to the right.
  * Android
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - Works, but Device Orientation fallback has some problems with drift.
    * Nightly
      * Only the "editorVR" demo currently works.
      * Low frame rate in fullscreen mode.
    * Firefox
      * Device Orientation fallback has some problems with drift.
      * Image inverts under certain tilt conditions.
      * Only the "editorVR" demo currently works.
      * Low frame rate in fullscreen mode.
    * Gear VR - Works as far as Primrose is concerned, but Samsung's browser for Gear VR currently has a number of defects:
      * Orientation tracking is pretty bad, making the overall experience very bad.
      * The touchpad doesn't work, so interactions are not working.
      * Attaching a Bluetooth keyboard seems to make the browser unable to enter fullscreen mode.
  * All platforms
    * Dynamic object allocation causing periodic garbage collections.
    * Use of expando-objects instead of HashMaps causing V8 deoptimization.
    * Leap Motion input disabled.
    * Multiplayer disabled.
    * Device fusion over WebRTC disabled.
    * Passthrough Cameras disabled.
    * No options UI for keyboard preferences.
    * No text-input for single-button, passive HMD devices.
    * No support for tabbing through text fields.
    * CSS text in documentation is not syntax highlighted.
    * HTML text in documentation is not syntax highlighted.
    * Documentation is only available in English.
    * Button model is too short for comfort.
    * Gaze action has no visual indicator of progress.
    * Gaze action does not trigger Surfaces.
    * No support for Unicode "Alt-codes".

## v0.23.1 - 2016/04/29

* Bugs
  * Fixed some broken links in the Documentation.
  * Fixed positioning of columns in "Temple" demo. They now reach all the way to the ground.
  * Converted to using HTML5 `<audio>` tags converted to media sources instead of loading buffers directly from Web Audio API, to gain the widest audio format support in stupid browsers that implement decoding for `<audio>` separately from Web Audio API.
  * Fixed issue where looping audio sources tried to reconnect to the audioContext at the end of the loop. This was causing an error because they were already connected.
  * Fixed the "Music" demo.
  * Fixed issue where dragging mouse over an object in the scene that did not have a mouse handler would cause an error.
  * Fixed issue where passwords were not being blanked out.
  * Fixed issue where textboxes were not getting refreshed reliably.
  * Made the 3D text labels above icons easier to read against the light background.
  * Fixed mousewheel scrolling and resizing.
  * Locking screen rotation on regular fullScreen, too, for "magic window" type devices.
  * Fixed Samsung Internet VR support for Gear VR compatability. It "works" in the sense that it runs without error. The browser has some issues with orientation tracking right now that make the experience pretty bad.
  * Fixed the layout of the main site header menu on the documentation site.
  * Added a `Promise` polyfill for IE/Edge support.
  * Fixed "undefined variable" error in `Primrose.Output.Music`.
* Admin
  * Moved to using Gulp instead of Grunt for task running. Runs significantly faster, and the build commands just look cleaner.
  * Removed `pliny.issue`. Sticking to using Trello to log issues.
  * Renamed `BrowserEnvironment.setSize()` to `modifyScreen()`, as it did more than just setting the size of canvas.
  * My favorite thing: deleted unused code.
  * Carved the "pliny" documentation library out to [https://www.github.com/capnmidnight/pliny](its own project).
  * Carved the "logger" console logging proxying library out to [https://www.github.com/capnmidnight/logger](its own project).
  * Moved demos to the documentation folder, and embeded them in the documentation template.
  * Rewrote how the site is generated.
* Features
  * Simplified the audio loading interface, so it can use the best file automatically.
  * Models may be embeded in HTML files now, using `<script>` tags.
  * Now activating the "wait" cursor when demos first start loading.
  * Changed "EditorVR" demo to use logging proxy to display console.log calls, rather than supplying its own log function.
  * If user touches a demo on a mobile device, it automatically jumps to fullscreen.
  * If user touches a demo on Gear VR, it automatically jumps to VR mode.
  * Muting audio when the tab loses focus. 
  * Upgraded to Three.js r76. Well, I didn't have to do anything other than bump the version number.
* Open issues
  * Windows
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome 
      * No HMD support (WebVR not yet available in Chrome).
    * Nightly
      * Only the "editorVR" demo currently works.
      * Text baseline in canvas is incorrect.
      * The image does not fill the HMD.
      * Gamepad input slews to the right.
    * Firefox
      * Only the "editorVR" demo currently works.
      * Text baseline in canvas is incorrect.
      * No HMD support (WebVR not yet available in Firefox).
      * Gamepad input slews to the right.
  * Android
    * Chromium
      * WebVR mode does not activate correctly. Only Fullscreen "Magic Window" mode currently works.
    * Chrome
      * Device Orientation fallback has some problems with drift.
    * Nightly
      * Only the "editorVR" demo currently works.
      * Low frame rate in fullscreen mode.
    * Firefox
      * Device Orientation fallback has some problems with drift.
      * Image inverts under certain tilt conditions.
      * Only the "editorVR" demo currently works.
      * Low frame rate in fullscreen mode.
    * Gear VR
      * Low frame rate in fullscreen mode.
      * Samsung's browser for Gear VR current has defective orientation tracking, making the overall experience very bad.
  * All platforms
    * Dynamic object allocation causing periodic garbage collections.
    * Use of expando-objects instead of HashMaps causing V8 deoptimization.
    * Leap Motion input disabled.
    * Multiplayer disabled.
    * Device fusion over WebRTC disabled.
    * Passthrough Cameras disabled.
    * No options UI for keyboard preferences.
    * No text-input for single-button, passive HMD devices.
    * No support for tabbing through text fields.
    * CSS text in documentation is not syntax highlighted.
    * HTML text in documentation is not syntax highlighted.
    * Documentation is only available in English.
    * Button model is too short for comfort.
    * Gaze action has no visual indicator of progress.
    * No support for Unicode "Alt-codes".



## v0.23.0 - 2016/04/21

### What happened to v0.22.0?

v0.22.0 got lost in the weeds. I bought a lawnmower to go find it, but that also got lost in the weeds.

Seriously though, I got really busy and just never got around to making a production deployment. Then I bumped the version number and made a commit, so I felt I was stuck with v0.23.0. Because v0.22.0 never got properly released, I'm including all of it's changelog in v0.23.0

### v0.23.0

* Features
  * New 2D GUI system, drawn to HTML Canvas elements and used as textures on 3D elements.
    * Surfaces can be sub-classed to more specific controls.
    * Surfaces can be children of other Surfaces, to render in subsections of the parent Surface.
    * [`Primrose.Entity`](#Primrose_Entity) is anything that can hold children.
    * [`Primrose.Surface`](#Primrose_Surface) is any Entity that has an HTML Canvas driving it.
    * [`Primrose.Controls.Label`](#Primrose_Controls_Label) is a 2D text label. Labels can align text left, center, or right.
    * [`Primrose.Controls.Button`](#Primrose_Controls_Button) is a 2D button. It's essentially a label with a border and a different appearance on-mouse-down, so it also supports text alignment.
    * [`Primrose.Controls.Image`](#Primrose_Controls_Image) is a 2D or stereoscopic image. When viewing a stereo image on a 2D monitor, hit the E key on your keyboard to manually cause an eye-blank event and swap the left/right images being displayed.
    * Converted [`Primrose.Text.Controls.TextBox`](#Primrose_Text_Controls_TextBox) to be a Surface.
    * [`Primrose.Text.Controls.TextInput`](#Primrose_Text_Controls_TextInput) is a single-line text input control. It's essentially a `Primrose.Text.Controls.TextBox` that is constrained to a single line and only PlainText grammar. It can optionally have a character set as a password-blanking character.
  * [`patch()`](#patch) function takes two objects-as-hashMaps. Any keys in the second hashMap that are missing in first will get added.
  * [`overwrite()`](#overwrite) function is similar to patch, except it overwrites keys that match between objects.
  * Textures, Materials, and Geometries now get cached to save a bunch of GPU memory.
  * Redesigned how [`textured()`](#textured) works. Optional parameters now go in an options object-nee-hashMap as the last parameter to the function.
  * Option for `textured()` to display objects as wireframes.
  * Only dirty parts of images render now (roughly speaking), saving some draw time.
  * Converted HTTP request handling and many other things over to using Promises instead of explicit callbacks.
  * For WebVR API 1.0 scenarios, now rendering a non-stereo view on the monitor outside of the HMD.
  * Documentation pages are now statically generated, for anything that is not based on the live documentation of the framework itself (e.g. tutorials).
  * Added values to [`Primrose.Keys`](#Primrose_Keys):
    * `ANY`, with value 0, a catch-all for any particular key on the keyboard (or button on the mouse, for that matter).
    * `VOLUME_DOWN`, with value 174, for keyboards with media controls. Useful with certain types of Bluetooth gamepads that emulate keyboards.
    * `VOLUME_UP`, with value 175, see above.
    * `TRACK_NEXT`, with value 176, see above.
    * `TRACK_PREVIOUS`, with value 177, see above.
  * Updated Editor3D demo to demonstrate 2D windowing.
  * Got the game server running on Azure. Someday soon, we'll have multiplayer again.
  * Updated to Three.js r75.
  * Enabled mouse pointer lock in windowed mode. Just click or hit a key on the keyboard.
  * Changed from THREE.MeshLambertMaterial to THREE.MeshBasicMaterial, which looks nicer, more modern.
  * Basic support for GearVR, though GearVR doesn't work well for any WebVR demos yet.
  * Made user input udpates from from their actual event handlers, so application code can do "user-interaction required" API calls like `requestFullscreen` or `requestPointerLock`.
  * Unified all selection-type events in [`Primrose.Input.FPSInput`](#Primrose_Input_FPSInput) so that `Primrose.BrowserEnvironment` could be simplified to use a pointer-events-like interface.
  * Automatically select the first available gamepad for use, rather than bugging the user with a `confirm()` dialog.
  * New monitor and Google Cardboard 3D icons for triggering fullscreen or presentation mode. Demos are now 100% 3D interface, no 2D interface left.
  * Added support for OBJ files (and their associated MTL files, just make sure they have the same base filename and live in the same path) in [`Primrose.ModelLoader`](#Primrose_ModelLoader).
  * Created option to disable clickable objects separately from making them invisible, to support being able to make invisible, but clickable objects.
  * Garbage collect pickable objects when they get removed from a scene.
  * Re-enabled ambient audio.
  * Added the stereo image demo to the main Editor3D demo.
* Admin
  * Simplified server startup.
  * Much more automated builds.
  * Beginning to convert code to ES6, thanks to Babel.
  * Split a bunch of utility functions into their own files.
  * Renamed `Primrose.VRApplication` to `Primrose.BrowserEnvironment`, to better reflect its purpose. You write the application as part of your script that uses `Primrose.BrowserEnvironment`. It's not an application on its own, and could be host to multiple applications (eventually).
  * Deleted a bunch of unused code.
  * CodePages now construct their own command names, which goes a long way towards decoupling commands from explicit keyhandling and from controls themselves.
  * OperatingSystem classes now don't specify commands, they just translate key events into command names and then leave it to the TextEditor command pack to figure out what to do with it.
  * Sorted the order of tutorial files so they follow a progression of difficulty.
  * Promisified VR headset setup.
  * Created a proxy for `console.log` and `console.error` to make debugging on GearVR easier.
  * Made builds run faster.
  * Removed "jump" command from demos. Might make some people sick, and ties up a key for no good use.
  * Finally updated the README beyond just talking about the text editor.
  * Cleaned up the Editor3D demo code so it's easier to read.
  * Concating all the Three.js and Primrose files into a single `package.js` for use on the website.
  * Updated the documentation for `Primrose.ModelLoader`.
* Bugs
  * Fixed styling issues with documentation pages.
  * Fix for Device Orientation API-based VR view on passive stereo viewers like Google Cardboard that are running in browsers that do not support WebVR. Now the scene doesn't skew when you tilt your head.
  * Made sure TextBoxes weren't running their own key event listeners, because it conflicts with the other events key events for navigation that BrowserEnvironment must control. This makes it more difficult to use the Primrose text editor in a 2D environment, but Primrose isn't really meant for that.
  * Fixed a bad stereo offset bug when rotating your head in VR. The image continued to split along the natural horizon, not your visual horizon.
  * Fixed an issue where hitting the back button on a smartphone while in fullscreen mode would not just leave fullscreen mode but also history.back() out of the page.
  * Fixed a bunch of issues where my janky code was making V8 deoptimize the JavaScript.
  * Reduced the polygon count of the ground geometry.
  * Fixed an issue where the WebGL canvas was not getting resized after entering presentation mode, so resolution was off in some browsers, or the stereo split was not in the right place.
  * Preventing multiple text areas on the screen adding their own surrogate HTML TextArea to the document. Only one surrogate to rule them all, and in the DOMness bind them.
  * No more platform-specific command handling in TextBox.
  * Fixed an issue where TextBoxes were getting resized on every render.
  * Fixed an issue where TextBoxes were not getting rerendered when they received focus (this is going to be a theme, this kind of bug fix, because the previous one hid a lot of issues).
  * Fixed bad aspect ratios when resizing the browser window in windowed mode.
  * Fixed an issue where TextBoxes were not getting rerendered when the theme was changed.
  * Fixed an issue where systems with more than one HMD defined (e.g. Firefox with emulated HMD data for debugging enabled) would not allow VR view.
  * Stopped using the deprecated fullscreen API calls when we don't have to.
  * Hack to keep Firefox for Android getting into an infinite loop on the Editor3D demo. It ultimately breaks the demo, as now it doesn't interpret the code in the editor, but it's better than the alternative.
  * Fixed an issue where WebVR API 1.0 mirrored view was attempting to be rendered on preview-WebVR, causing the image in the HMD to be majorly screwed up.
  * Fixed the workflow for entering and exiting fullscreen.
    * Hitting back on the smartphone exits both fullscreen and VR view, returning you to flat-view.
    * Other ways of exiting fullscreen view, such as task-switching out of the browser on Android, return to flat-view.
    * Screen orientation now gets locked when entering VR view, so extreme head tilts don't make the image rotate 90 degrees incorrectly.
    * Leaving VR view unlocks screen orientation again.
  * Fixed mouse pointer lock so it gets activated on fullscreen and deactivated when removing fullscreen.
  * Fixed an issue where exiting mouse pointer lock at the same time as exiting fullscreen caused fullscreen to retrigger.
  * Fixed issue where Chromium on Android reports it is using WebVR API 1, but expects a single `VRLayer` for `VRDisplay::requestPresent`, whereas Chromium for Windows expects a single-element array of such `VRLayer`s.
  * Fixed picking so objects that only use a subset of a full texture (i.e. the UV coordinates are not on the full [0, 1] range), aren't pickable beyond their visual boundaries.
  * Collapsing the world matrix for objects on the UI thread side to minimize the amount of data being sent to the worker thread.
  * Diffing pickable objects from their previous state to reduce the number of postMessage calls on the worker thread, thereby drastically improving overal performance.
  * Stopped using expando-objects for pickable object data so V8 stops deoptimizing the JavaScript.
  * "Fixed" the Commodore PET demo. It won't interpret the BASIC code, as my interpreter was causing big deoptimizations, but at least it's visible.
  * Fixed the Jabber Yabs demo.
  * Fixed an issue where XHRs were setting the Accept header incorrectly.
  * Fixed an issue where resuming from pause (e.g. the window losing focus) made a huge time-slice update.
  * Enabled MTL, OBJ, and OGG file formats on the server.

## v0.21.2 - 2016/03/11

* Bugs
  * Fixed having to make dev-to-production changes manually. Using full static site generation now.
  * Fixed lighting for Three.js r74.
  * Got off of DreamHost, finally. Now on Azure.
  * Don't move the camera view by orientation until the user hits the "go VR" button.
  * Fixed out-of-bounds array access in projector (though ultimately, seems I broke the projector for buffered geometry)
  * Fix for loading a texture more than once into multiple materials. Probably should cache the material, though.

## v0.21.1 - 2016/03/06

* Bugs
  * Fixes for WebVR API fallback on current Firefox Nightly
  * Fix for zeroing sensor on new WebVR API
  * Don't resize canvas to full screen dimensions on desktop. This is only necessary on mobile devices, to support scrolling to remove browser chrome.

## v0.21.0 - 2016/03/05

WebVR API 1.0 support!!! With backwards compatability to draft APIs.

## v0.20.6 - 2016/02/27

It's going to be nothing but documentation for a while.

* Bugs
  * Prevent `alert()`, `confirm()`, and `prompt()` while in full screen mode.
  * Fixed issue where multiple newline characters in a row were only incrementing the row display once, causing blank lines of text to get truncated.
* Features
  * Use `grammar("JavaScript");` at the top of your code blocks to indicate syntax highlighting preference. 
  * This CHANGELOG page.
  * More documentation

## v0.20.5 - 2016/02/15

It's going to be nothing but documentation for a while.

* Bugs
  * Fixed issue where using the "top" link at the bottom of a documentation page would cause the page to reset to the introduction.
* Features
  * Per-document table-of-contents in documentation page.
  * "Using the VR Development Environment" documentation.
  * Started CHANGELOG.

## v0.20.4 - 2016/02/12

It's going to be nothing but documentation for a while.

* Bugs
  * Don't attempt to support <kbd>CTRL+Up/Down Arrow</kbd> movement on OS X.
  * Fix issue where some links into internal documentation were opening in a new window.
* Features
  * "Using the VR Development Environment" documentation.

## v0.20.3 - 2016/02/11

It's going to be nothing but documentation for a while.

* Bugs
  * Creating a [`Primrose.BrowserEnvironment`](#Primrose_BrowserEnvironment) no longer spams the console with an inconsequential error (because the error is fixed!).
  * Code samples on documentation page now resize with the page.
  * Cleaner font rendering.
  * Fixed a typo where [`Primrose.SKIN_VALUES`](#Primrose_SKIN_VALUES) was called `Primrose.SKINS_VALUES`.
  * Long descriptions get shortened now, when displayed as part of a list of features on a parent object.
  * Better Markdown document parsing.
  * All functions and classes should now be included in documentation (though details not yet written).
* Features
  * Documentation page can now load Markdown documents.
  * [`Primrose.ModelLoader`](#Primrose_ModelLoader) documentation.
  * Auto-generate `target="_blank"` for links that go away from the documentation page.
  * Incomplete documents rendered with greyed-out links (though they are also viewable).
  * semi-repsonsive layout for documentation page.
  * Styling for KBD, CODE, and BLOCKQUOTE blocks.
  * ["Installation and Setup"](#InstallationandSetup) documentation.
  * ["Frequently Asked Question"](#FrequentlyAskedQuestions) documentation.

## v0.20.2 - 2016/02/01

* Bugs
  * Simplified [`pliny`](#WritingnewdocumentationwithPliny) interface.
  * Cleaned up dependencies.
  * Set NPM startup script.
  * Better use of screen width for documentation page.
* Features
  * [Getting Started](#) documentation.
  * [`Primrose.Text.Grammar`](#Primrose_Text_Grammar) documentation.
  * Issue traction in documentation.
  * Tons of new issue tickets.
  * [`fmt()`](#fmt) documentation.
  * [`px()`](#px) documentation.
  * [`pct()`](#pct) documentation.
  * [`ems()`](#ems) documentation.
  * New [`rems()`](#rems) function.
  * New [`vws()`](#vws) function.
  * [`hsl()`](#hsl) documentation.
  * [`rgb()`](#rgb) documentation.
  * [`rgba()`](#rgba) documentation.
  * [`hsl()`](#hsl) documentation.
  * [`hsla()`](#hsla) documentation.
  * Table styling for enumeration values.
  * [`Primrose.DOM`](#Primrose_DOM) documentation.
  * [`getSetting()`](#getSetting) documentation.
  * [`setSetting()`](#setSetting) documentation.
  * [`deleteSetting()`](#deleteSetting) documentation.
  * [`readForm()`](#readForm) documentation.
  * [`writeForm()`](#writeForm) documentation.
  * Hashed issue ID.
  * Issue count in issue header.


## Other

If you want to know more, check the [Git commit log](https://github.com/capnmidnight/Primrose/commits/dev). I'm not going to rewrite the entire thing here.