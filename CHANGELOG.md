## v0.31.1

This is the first release with significant contributions from folks new to Primrose!

It's been less than two weeks since <a href="https://twitter.com/Sean_McBeth/status/824301628446699521">I announced we were starting a mentoring program through Primrose</a>. The response has been amazing. Much more than I anticipated. I had *hopes* that one *one* person *might* join. And in that time, we've had seven people make significant contributions to the project.

This is super exciting. I've been writing pretty much non-stop, trying to get everything up to speed so folks aren't lost. We really want to make the Primrose project fit anyone, be it in training new developers in making VR experiences, in programming in general by working on the Primrose framework and associate tools themselves, or even anything else that isn't programming. The idea is to kind of make it a "practice company", in a way, as there is a lot more than just programming that goes into any project.

### The Future

If you have ideas of your own, or are looking for an established open source project to join, <a href="mailto:sean+primrose@notiontheory.com?Subject=Contributing to Primrose">please contact us at NotionTheory</a> and let's chat! We'd like to bring on anyone of any background or experience level, so long as you're willing to learn. The last two years have been a blast and we can't wait to bring more people on board.

Thankfully, there is still a lot of fun work left to do:
* If you're looking to break into the language translation industry, you could get a lot of experience in translating our documentation to your language.
* There is a lot of front-end design work to be done in making the official website look nice, respond well to different devices, and be accessible to differently-abled people.
* I'd love to get a monthly or bi-weekly event together online where we can all hack together. Managing those meetings and making fun SWAG materials to go along would be a great service. We have a small budget for t-shirts and pins and such. We'd like to have something to give everyone who contributes.
* Project management is up for grabs, as writing good issue tickets and organizing people is important, hard work.
* Even if you're not interested in front-end or VR programming, there are lots of back-end tasks to be done in managing the build system, building out a user showcase site, building multiplayer features that folks can easily import into their projects, integrating with other services, you name it.

### And now, the CHANGELOG

* BrowserEnvironment now defaults to using gaze cursors on mobile devices, rather than requiring apps to set that explicity, thanks to Atte Niemi (<a href="https://github.com/hurbraa" target="_blank">@hurbraa</a>).
* Cleaned up the FAQ a bit.
* The Preloader now has a method for shrinking the progress bar, rather than requiring user scripts manually edit the CSS. Eventually, we'll have a 3D object with an identical API to take over the progress indicator once the BrowserEnvironment is ready to execute, but still waiting on assets to load.
* Lots and of new documentation in the <a href="https://github.com/NotionTheory/Primrose/wiki" target="_blank">GitHub Wiki</a>.
* <a href="https://www.primrosevr.com/demos/shadows/">A new demo showing off shadows</a>.
* A fix for <a href="https://www.primrosevr.com/demos/editorVR/">the VR Live Programming Environment</a> to make sure the demo script always loads.
* The teleport feature now gets disabled if you've dragged the mouse very far, i.e. are probably just trying to rotate the view, thanks to Marko Papp (<a href="https://github.com/markopp" target="_blank">@markopp</a>).
* The README now tells you that you need to import your application script, clearing up confusion about why first-time setup wasn't working as expected, thanks to Atte Niemi (<a href="https://github.com/hurbraa" target="_blank">@hurbraa</a>).
* BrowserEnvironment no longer wastes cycles on checking if the Sky object exists, since it will always exist, thanks to Upo (<a href="https://github.com/upodroid" target="_blank">@upodroid</a>).
* The demos now have their asset files separate from the main documentation, to make sure they are easier to keep track of.
* The DEV server now starts as a part of running the default `gulp` task, clearing up a point of confusion for first-time setup.
* The music demo now uses the new, default gaze cursor setting of BrowserEnvironment, thanks to Corey Hobbs (<a href="https://github.com/chobberoni" target="_blank">@chobberoni</a>).
* The shadows demo doesn't bring mobile devices completely to their knees now, thanks to Toby Maritz (<a href="https://github.com/tmaritz" target="_blank">@tmaritz</a>).
* The demos now live in their own directory, instead of being hidden inside the doc directory, thanks to Marko Papp (<a href="https://github.com/markopp" target="_blank">@markopp</a>).
* The DEV server no longer requires root access to start properly on non-Windows systems, thanks to Kristian Bouw (<a href="https://github.com/kbouw" target="_blank">@kbouw</a>).
* The README now references the new setup guide, rather than duplicating information, thanks to Kristian Bouw (<a href="https://github.com/kbouw" target="_blank">@kbouw</a>).
* And the shadows from the default "Sun" are stable with respect to user position, thanks to Micah Bales (<a href="https://github.com/micahbales" target="_blank">@micahbales</a>).

Wow, that's a lot for less than two weeks. Thanks everyone!

## v0.31.0

Over the last year, a lot of work went into making the Primrose WebVR framework much more reliable, easier to use, and with more complete documentation. This is the first CHANGELOG we've written since May 2016, but that doesn't mean we haven't been working. Indeed, the lack of CHANGELOGs has specifically been because of how busy we've been in building Primrose.

The big highlights are:
* Primrose works on just about any platform you could want.
* We spent a lot of time getting Video to work on iOS. You can have one video element running at a time, if it's muted. It's better than nothing.
* We also have pretty good tracking and stereo rendering on iOS now. While iOS doesn't support the HTML5 Full Screen API, it's still pretty usable without it in most Google Cardboard scenarios.
* One of our clients was featured on <a href="https://www.bloomberg.com/news/articles/2016-12-06/goldman-sachs-alum-turns-to-virtual-reality-to-sell-57-million-mansion">Bloomberg.com</a> for the <a href="http://rex.legend3d.com">real-estate tour app</a> we built for them (hence the iOS focus for so long).
* It even works on MS Edge, in case you happen to find yourself there for some reason.
* Firefox is no longer a second-class citizen. If they get motion controller support anytime soon, it will even be the most stable platform for full VR.
* ES2016 modules, Rollup, and vertically integrating many of the project dependencies have given way to very small download payloads. Some of our demos have been as small as 650KB, with GZIPing getting it even further down to a slender 150KB (of course, your mileage will vary, depending on how many model, texture, and audio assets you load).
* The documentation is about 80% complete, making us one of the most completely documented WebVR frameworks available.

### The Future

If you have ideas of your own, or are looking for an established open source project to join, <a href="mailto:sean+primrose@notiontheory.com?Subject=Contributing to Primrose">please contact us at NotionTheory</a> and let's chat! We'd like to bring on anyone of any background or experience level, so long as you're willing to learn. The last two years have been a blast and we can't wait to bring more people on board.

Thankfully, there is still a lot of fun code left to be written.
* Updated Gear VR support and support for Oculus' Carmel browser are right around the corner.
* We'll be looking to integrate more features in support of Augmented Reality in the near future, both in the areas of GPS tracking and marker tracking. You could theoretically re-build Pokemon GO in Primrose already.
* We're experimenting with stereo 360 video support for a client right now.
* As soon as Microsoft releases WebVR for Edge on the Hololens (which everyone expects to be very soon, considering their work on <a href="https://github.com/Microsoft/HoloJS">HoloJS</a>), we'll be there to get your apps running in AR.
* With Vive announcing <a href="http://www.roadtovr.com/htc-vive-tracker-enables-a-bevy-of-bats-guns-gloves-and-other-tracked-accessories/">the generic tracking puck</a>, we've been <a href="https://www.youtube.com/watch?v=hi9FL66SAo4">experimenting with foot-based UIs</a> and will be incorporating support for using motion controllers on the feet directly.
* There's still no physics system, as we've not yet built anything that requires it, but it's certainly a desirable thing to have. That would be an excellent area for a new contributor to jump in.
* Performance is already pretty good just from not doing anything obviously wrong like `new`-ing objects in the render path, but no specific work has gone into optimization yet.
* The live-programming environment is still a big goal for us, with some exciting prospects for doing research into novel text input systems.
* The meeting room demo has languished under an expired TokBox account, so now that this big release push is done, we'll be getting back to live, face-to-face teleconferencing with collaborative editing tools.
* A number of social VR platforms like AltspaceVR and High-Fidelity have JavaScript APIs for building apps that run in-client. Primrose's architecture was designed from the beginning to eventually accommodate them, but we've just not yet done the work.
* There's a huge opportunity to use Primrose for infographics.
* We'd love to see some work in AI chatter-bots presented in WebVR.


### And now... the CHANGELOG
* Features
  * Upgrade to Three.js r84.
  * Drastically simplified process for making objects selectable. Just add them to the scene and add event listeners to them! No need to "registerPickableObject" anymore. In fact, it's now gone!
  * Report deltaTime directly from environment variable, rather than through the update function.
  * Shadows in the Jabber Yabs demo.
* Defect Fixes.
  * Prevent errors in user script from killing the Editor VR demo.
  * Fix text editors, which got broken in the v0.30 push for a client.
  * Preventing teleporting if the user waggles their input device too much, i.e. they were actually just dragging the mouse to move the view.
  * Prevent invisible controls from holding on to input focus.
* Admin
  * Fader is no longer using its own timer object, it now gets updated as part of the normal animation process.

## v0.30
* Features
  * Pass-through camera is back!
  * A ready-to-use preloader script.
  * A default web server for users importing from NPM.
  * Out-of-order eye rendering (for a client).
  * new Teleporter tool.
  * Configurable UI follow rate.
* Defect Fixes
  * Fix transparent object sorting, again.
  * Fixes for loading progress tracker.
  * Fixes for audio, VRDisplays, and video on iOS.
  * Fixes for orientation locking on Android.
  * Fixes for eye blanking.
* Admin
  * Fully integrated WebVR-Polyfill into project, discarding tons of unused code, simplifying build process, and decoupling full screen management.
  * Renamed ModelLoader class to ModelFactory.


## v0.29
* Features
  * Ability to use fog and sky maps together.
  * Anisotropic filtering for ground texture.
  * New demo page in documentation.
  * Syntax highlighting grammar for HTML.
  * Auto-added fullscreen buttons now include link back to Primrose homepage.
* Defect Fixes
  * More consistent audio timing.
  * Fix image sizing issues in vertical mode.
  * Fixed texture repeat on large objects.
  * Fixes for VR view on Google Cardboard.
  * Fixes for geometry of videos that don't get copied to Canvas before being used as a texture.
  * Fixes to support the latest API version with respect to Motion Controllers.
  * Make mouse movement independent of user's selected view zoom value.
* Admin
  * Overhaul of build process, yet again, this time with Rollup and ES2016 imports.
  * Removed the Commodore demo, as the model file no longer loads and I don't want to spend the time fixing it.
  * Gigantic documentation dump.
  * Single-rendering-path for all display types.


## v0.28
* Features
  * Option to disable peering.
  * Option to use TokBox for WebRTC.
  * Spatialized audio when using TokBox.
  * Using a fork of WebVR Polyfill to remove features we don't use and drastically reduce the download size.
  * Unified "select" event, that occurs alongside both pointerend and gazecomplete.
  * Automatically enter VR mode when the user puts on their headset.
  * "environment.ui" scene mounting point that follows the user around as they move.
  * Option to disable keyboard and gamepad input.
  * New, default ambient light.
  * Forked and added support to THREE.MTLLoader for OBJ's `illum` property.
  * Non-standard neck-model in setup options.
  * Calendar demo.
  * New music demo.
  * Shooter demo.
  * Sea demo.
  * Sundial demo.
  * Option to hide head pointer.
* Defect Fixes
  * Fixed avatars "bowing" at their feet when the user looks down.
  * Fixes for pointers, once again.
  * Prevent moving while dragging across text editor.
  * Fixed rendering flicker when transparent objects are in the scene.
  * Make iOS continue on without audio.
  * Fix bottom of page being truncated on iOS.
  * Fix audio orientation.
  * Fix video playing on iOS.
  * Fix touch panning on iOS.
  * Fix issue where missing input devices caused app to crash.
  * Better touch panning.
  * Only update video frames when the video has actually progressed.
  * Don't spin up gaze cursor on pickable elements that have no gaze events.
  * Fix being able to trigger 3D buttons with gaze.
  * Fixes for audio code when running in a CodePen session.
  * Wait until all displays are found before adding full screen buttons.
* Admin
  * Removed manifest feature in favor of using standard progress tracking events and automatically discovering the full download size.
  * Converted stylesheets to use Stylus.
  * Removed SSAO and FXAA for better rendering performance.
  * Removed html2canvas. The feature just didn't get used that much and it was kind of buggy.
  * Remove the Full Screen button from iOS devices, because they can't do a standard full screen view.
  * Automatic standard monitor setup, rather than deferring the decision to apps.
  * Removed automatic quality scaling completely. It was buggy and would cause GPU crashes on certain devices.
  * Removed the wakelock from WebVR-Polyfill.
  * Cleaned out unused dependencies.
  * Removed old, unused haptic glove code.
  * Network manager doesn't get created until it's needed, now.
  * Default to an empty object for ground and sky when no ground or sky description are provided, so that there is always a ground and sky object on which to add UI elements.


## v0.27
* Features
  * Smaller, further away gaze pointer.
  * Option on mobile devices to use elements other than the canvas as the fullscreen element.
  * Text-to-speech rendering.
  * Buttons can now be a criteria for input systems to read axes.
  * Add a basic "hand" model to the motion controllers.
  * Option to retrieve WebRTC ICE servers from a network resource.
* Defect Fixes
  * Prevent right-click menu from appearing when using the second mouse button.
  * Fixes to input zeroing.
  * Don't teleport if the user has been dragging the mouse.
  * Hide the in-scene pointer when the app is not in full-screen mode.
  * Fix a whole frame of latency in reading the headset pose.
  * Use left-click instead of right-click to rotate view.
  * Keep clients that fail to connect to the application from crashing the room and preventing other clients from connecting.
  * Fix mouse input for apps in fullscreen mode when they aren't use the canvas as the fullscreen element.
* Admin
  * Polyfill WebRTC to its latest version.

## v0.26
* Features
  * Upgraded to Three.js r80.
  * Vive Motion Controller support.
  * Unified movement from gamepads and stage teleporting into one coherent system.
  * Unique colors per pointer.
  * Use a mouse button press to move the orientation on mobile devices that don't have Pointer Lock.
  * Gaze can now trigger 3D buttons.
  * Basic support for 2D video elements.
  * A 3D Progress meter control.
  * Image loading progress tracking.
  * Expose teleporting as a function a user script may call at any time.
  * Cubemaps as option for the sky.
  * Fade in/out on teleport.
  * FXAA and SSAO.
* Defect Fixes
  * Fixes for full-screen workflow on mobile Firefox.
  * Detect motion controllers by the presence of a pose property, not by explicit name.
  * Re-hide WebVR-Polyfill's "Mouse and Keyboard" display, because I can't seem to make changes stick.
  * Only teleport on left-mouse click, not any-button.
  * Detect Android tablets as "mobile" devices.
  * Hide WebVR-Polyfill's "Mouse and Keyboard" display, as it doesn't mesh with our input system.
  * Fix touch input triggering on mobile Firefox.
  * Make sure gaze pointer always shows in the headset.
  * Enforce a cool-down between teleports to prevent too fast of movement with rapid clicking.
  * Fixed many issues with pointers not reliably picking objects.
  * Fixed stereo eye offset.
  * Better locomotion on Google Cardboard.
  * Fixed assumptions about headset orientation that were wrong for the Vive.
  * A bunch of other stuff that probably nobody remembers.
  * Fix clipboard operations.
  * Fixes for stereo image rendering.
  * Fix archiving of build results.
  * Slow down quality detection so it doesn't kick in right away.
  * Fix issue where Vive controllers were crashing the app.
* Admin
  * New build script, and managing the deployment errors I made as a result.
  * Print version number in console and on website.
  * Update to latest WebVR-Standard-Monitor and WebVR-Bootstrapper.
  * Make apps hide their own fullscreen buttons.
  * Cleaned up VR position handling.
  * Moved network handling code into its own manager class.
  * Removed 3D icons, because they just didn't work in a generic way.
  * Cleaned up the documentation site quite a bit.
  * Running all dependencies through NPM now.

## v0.25

* Features
  * New `disableDefaultLighting` option for `BrowserEnvironment` to use in cases of models with baked-lighting in their textures.
  * Abstract `Form` control. Subclassed it to make `Login` and `Signup` forms.
  * `BrowserEnvironment` now keeps track of its name.
  * New `meeting` demo.
    * Basic support for log-in.
    * Peer-2-peer connection for audio.
    * Avatars.
    * Auto-room ID setup.
    * Still need to sink the functionality into `BrowserEnvironment`.
  * `textured()` function now provides `side` option for specifying polygon siding model. Use THREE.BackSide, THREE.FrontSide, or THREE.DoubleSide.
  * Added a small interpolation to head orientation on mobile devices to make them run a little smoother.
  * New `antialias` option for `BrowserEnvironment`.
  * New `Primrose.Random.color()` function.
* Defect fixes
  * Make `Surface`s usable as textures with the `textured()` function.
  * `ready` event now fires when `BrowserEnvironment` actually *is* done loading.
  * Made `Label`s render more reliably.
  * Got rid of super-sampling, because it screws up the HTC Vive.
  * Removed manual eye-blanking, because it was stupid.
* Admin
  * Updated documentation for `Entity`.
  * `Form`s don't expose their underlying mesh directly now.
  * Fixed documentation of return types for the randomizer functions.
  * Spatialized audio in `meeting` demo.
  * HMD position is now visible in remote users, in addition to the previous orientation, for users that have the data available.
  * Better pointer graphics, indicating to the user better what is about to happen.
    * Ground pointer is now a flat disk, with the cursor ball above it.
    * Ground pointer is limited to a max distance away of 5 meters.
  * New [`Primrose.Random.ID()`](index.html#Primrose_Random_ID) function.
  * BrowserEnvironment can now manage the login process on its own. Client apps don't need to know how it works, they just pass on a user name and password.
* Defect Fixes
  * Fixed multiplayer server on primrosevr.com.
  * More than two users can be in the same room at one time.
  * Users can leave and return to a room without crashing the room.
  * When first logging in, if adding one of the remote users fails, it now doesn't prevent the other users from attempting to load.
  * The login form no longer shows before the 3D models have parsed. This was causing an issue where people logging in very quickly were receiving a list of users and attempting to create an avatar out of a model that didn't yet exist.
  * The "close" link on the login form no longer causes the page to reload.
  * Typing in 2D forms on top of the BrowserEnvironment canvas no longer causes pointerlock to trigger.
  * Fixed issue where display selector buttons weren't being hidden after entering VR mode.
  * Login form is no longer editable after "log in" or "sign up" have been clicked.
  * A wait cursor now appears during the authentication process.
* Admin
  * Better documentation for WebRTCSocket
  * Separate Audio and Data WebRTC handlers that use a base WebRTCSocket class
  * Moved IconManager to it's correct location
  * Got strict about "use strict".
  * Removed the 3D loggin form from the meeting demo, because it was kind of a pain in the ass.

## v0.24

* Features
  * <a href="pacman.html">"Pacman" demo</a>! Ready for <a href="http://www.meetup.com/Virtual-Reality-DCVR/events/230911574/">the DCVR class I'm teaching</a>.
  * New WebVR-Bootstrapper project, a very small library useful for polyfilling the WebVR 1.0 API and getting a page up and running quickly to load additional dependencies with a progress bar. Eventually, it will allow you to get on to the headset very quickly and display a 3D progress bar with head tracking.
  * Progress bar showing time to load dependencies for a demo.
  * Be able to use `BrowserEnvironment::appendChild()` with Three.js objects.
  * DOM-ified interface for adding elements to the scene and manipulating Primrose.Entity properties.
  * Made demos able to open in a new, larger window separate from the documentation site.
  * Exposing more WebGL elements as configuration options when initializing Three.js in `BrowserEnvironment`:
    * scene: a THREE.Scene, if the implementing developer already defined one.
    * renderer: a THREE.WebGLRenderer, if the implementing developer already defined one.
    * context: a WebGLRenderingContext, if the implementing developer already defined one.
  * New `Primrose.Controls.HtmlDoc` surface, using <a href="https://html2canvas.hertzen.com">html2canvas</a> to render HTML content. NOTE: html2canvas has some limitations on how it can be used. It's at least useful for displaying formatted documentation in-scene.
  * Scaling font size in "pacman" demo to account for rendering quality.
* Defect fixes
  * Fixed an issue where switching display types would cause an error for a single frame, and that error would cause the editor demo to bomb out of the user's live-coded script.
  * Mobile devices show they are head tracking right away again.
  * Fixed visual issue where the highlight of a row of text would overlap the line above it slightly.
  * Errors in the user's live-coded script now cause the script to stop running, rather than continuing to try to run and killing the framerate with thrown exceptions that get caught by the catch-all handler.
  * Fixed an issue where objects were getting removed from the projector, but were still active in the scene.
  * Prevent easily backspacing out of the demo while the user thinks they should be editing code.
  * Fixed an issue where the `ready` event was getting fired before the `BrowserEnvironment` was truly ready.
  * Inverted the direction of the mousewheel scroll-to-zoom, to match the browser's behavior. Wheel forward => bigger text.
  * Fixed styling of `blockquote` elements in statically gen'd documentation pages.
  * Fix for material for pointer taking over all red objects.
  * More specific caching for materials so they don't clobber each other on opacity and metalness changes.
  * Fixes for not properly using WeakMap for non-GC-preventing references to entities in the scene.
  * Fixed an issue where changing the ID of an element would break the projector.
  * Made demos easier to see on mobile devices.
  * Fixed gamepad slewing. There is a deadzone for gamepad input that needs to be configurable per user still.
  * Fixed an issue were attempting to load an unsupported audio format without providing a fallback would prevent demos from loading.
  * Fixes for Quick Start demo missing WebVR-Bootstrapper.
  * Fix for `put()` regression in v0.24.0 that made it impossible to use with THREE.js objects.
  * Fix for "EditorVR" demo causing an "undefined function" error
* Admin
  * WebVR-Bootstrapper also allows for single full-screen code path for all types of displays, both mono and stereo, minimizing some of the confusion in BrowserEnvironment.
  * documentation for `light()` function.
  * documentation for `findProperty()` function.
  * documentation for `emit()` function.
  * documentation for `copyObject()` function.
  * documentation for `cylinder()` function.
  * documentation for `box()` function.
  * documentation for `hub()` function.
  * documentation for `brick()` function.
  * documentation for `cloud()` function.
  * documentation for `cache()` function.
  * Better pointer size and colors.
  * Decreased the default tab width to 2, rather than 4.
  * Edits to setup and installation documentation.
  * Converted FullScreen to ES6 class syntax.
  * Renamed `BrowserEnvironment` instances from `app` to `env`, to be a little clearer as to purpose.
  * Renamed `Primrose.Controls.Button` to `Primrose.Controls.Button3D`.
  * Moved demos out to an IFRAME in the documentation pages, so they don't execute in the context of the documentation page.
  * All dependencies now come out of NPM, rather than files saved in the repository.
  * Better labels for Quick Start "StartHere" scripts to differentiate the platform-specific cases.
  * Dev build scripts now run off of direct file references, rather than piping everything through Git and NPM.
  * Documentation for `put()` function.
  * Documentation for `v3()` function.
* Open Issues
  * All systems
    * Entering, exiting, then entering Full Screen mode frequently causes an error.
    * 3D icons don't trigger full screen anymore (though they do trigger VR mode).
  * Windows
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - "NONE", in the sense that it works as expected. There is no HMD support, but that is to be expected before WebVR lands in the full release version of Chrome.
    * Nightly
      * HMD support is broken (Le sigh. I think I'm just going to wait for Mozilla to upgrade to WebVR 1.0)
    * Firefox - "NONE", in the sense that it works as expected. There is no HMD support, but that is to be expected before WebVR lands in the full release version of Chrome.
  * Android
    * Chromium - NONE! Full support, no extraneous issues.
    * Chrome - "NONE", in the sense that it works as expected. Device Orientation fallback has some problems with drift, but that is to be expected before WebVR lands in the full release version of Chrome.
    * Nightly
      * HMD support is broken (Le sigh. I think I'm just going to wait for Mozilla to upgrade to WebVR 1.0)
      * Low frame rate in fullscreen mode.
    * Firefox
      * Device Orientation fallback has some problems with drift.
      * Image inverts under certain tilt conditions.
      * Low frame rate in fullscreen mode.
    * Gear VR - Works as far as Primrose is concerned, but Samsung's browser for Gear VR currently has a number of defects:
      * Orientation tracking is pretty bad, making the overall experience very bad.
      * The touchpad doesn't work, so interactions are not working.
      * Attaching a Bluetooth keyboard seems to make the browser unable to enter fullscreen mode.


## v0.23

This was an intermediate release, specifically focused on carving the primrosevr.com website bits out of the Primrose VR Github repository.

* Features
  * Simplified the audio loading interface, so it can use the best file automatically.
  * Models may be embeded in HTML files now, using `<script>` tags.
  * Now activating the "wait" cursor when demos first start loading.
  * Changed "EditorVR" demo to use logging proxy to display console.log calls, rather than supplying its own log function.
  * If user touches a demo on a mobile device, it automatically jumps to fullscreen.
  * If user touches a demo on Gear VR, it automatically jumps to VR mode.
  * Muting audio when the tab loses focus.
  * Upgraded to Three.js r76. Well, I didn't have to do anything other than bump the version number.
  * Made the editor in the "editorVR" demo follow the user, so it's easier to find.
  * Auto quality scaling:
    * If the animation falls under 45FPS, the resolution of the rendering is automatically degraded.
    * On desktop, if the animation hits 60+FPS, the resolution of the rendering is automatically upgraded. Mobile devices are too volatile to do this reliably.
    * In the "editorVR" demo, if you hit the minimum quality setting and the rendering is still slow
      * your live-coded script is canceled,
      * all of your objects removed from the scene,
      * and they don't return until you edit your script.
  * Multiple HMDs connected to the machine (for those rare people with both the Rift and the Vive) now each have their own "Go VR" button, listing which device they will connect to.
  * New [quickstart](/PrimroseQuickstart.zip) template package.
* Defect fixes
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
  * Fixed documentation TOC hider for Firefox.
  * Fixed transparency for the most part.
  * Fixed error that would occur in the "editorVR" demo when the user elected to not return an update function from their script.
  * Fixed "any key" behavior.
  * Fixed an issue where entering fullscreen on mobile would fail because requesting pointerlock would fail.
  * Added JSON MIME type for web server. I have no idea why my testing was working before.
  * Fixed an issue where stereo images did not render in mono-view.
  * Fixed an error when hiding the editor in the "editorVR" demo.
  * Fix for critical Firefox issue! Any DOM elements that are acquired before `document.readState === "complete"` will not be the same object references as those acquired after. It's like Firefox throws away the DOM and rebuilds it from scratch after the `DOMContentLoaded` event.
  * Yet another fix to fullscreen workflow
* Admin
  * Moved to using Gulp instead of Grunt for task running. Runs significantly faster, and the build commands just look cleaner.
  * Removed `pliny.issue`. Sticking to using Trello to log issues.
  * Renamed `BrowserEnvironment.setSize()` to `modifyScreen()`, as it did more than just setting the size of canvas.
  * My favorite thing: deleted unused code.
  * Carved the "pliny" documentation library out to [https://www.github.com/capnmidnight/pliny](its own project).
  * Carved the "logger" console logging proxying library out to [https://www.github.com/capnmidnight/logger](its own project).
  * Moved demos to the documentation folder, and embeded them in the documentation template.
  * Rewrote how the site is generated.
  * Now showing menu on main page on mobile.
  * Turned fog off by default. It's still an option.
  * Removed the mailing list from the front page. It was breaking in some browsers and I don't have time to figure it out right now.
  * Documentation now gets carved out to a separate file when releases are built, to make for a smaller main script file if you don't want to also load the documentation.
  * Updated documentation for [`axis()`](index.html#axis).
  * Automatically hide TOC on mobile.
  * Abstracted commonalities between CardboardVRDisplay and LegacyVRDisplay to a common base class.
  * Removed all the stuff that was specific to the Primrose website and not the Primrose framework.

### What happened to v0.22.0?

v0.22.0 got lost in the weeds. I bought a lawnmower to go find it, but that also got lost in the weeds.

Seriously though, I got really busy and just never got around to making a production deployment. Then I bumped the version number and made a commit, so I felt I was stuck with v0.23.0. Because v0.22.0 never got properly released, I'm including all of it's changelog in v0.23.0

### v0.21

* Features
  * WebVR API 1.0 support!!! With backwards compatability to draft APIs.
  * New 2D GUI system, drawn to HTML Canvas elements and used as textures on 3D elements.
    * Surfaces can be sub-classed to more specific controls.
    * Surfaces can be children of other Surfaces, to render in subsections of the parent Surface.
    * [`Primrose.Entity`](index.html#Primrose_Entity) is anything that can hold children.
    * [`Primrose.Surface`](index.html#Primrose_Surface) is any Entity that has an HTML Canvas driving it.
    * [`Primrose.Controls.Label`](index.html#Primrose_Controls_Label) is a 2D text label. Labels can align text left, center, or right.
    * [`Primrose.Controls.Button2D`](index.html#Primrose_Controls_Button2D) is a 2D button. It's essentially a label with a border and a different appearance on-mouse-down, so it also supports text alignment.
    * [`Primrose.Controls.Image`](index.html#Primrose_Controls_Image) is a 2D or stereoscopic image. When viewing a stereo image on a 2D monitor, hit the E key on your keyboard to manually cause an eye-blank event and swap the left/right images being displayed.
    * Converted [`Primrose.Text.Controls.TextBox`](index.html#Primrose_Text_Controls_TextBox) to be a Surface.
    * [`Primrose.Text.Controls.TextInput`](index.html#Primrose_Text_Controls_TextInput) is a single-line text input control. It's essentially a `Primrose.Text.Controls.TextBox` that is constrained to a single line and only PlainText grammar. It can optionally have a character set as a password-blanking character.
  * [`patch()`](index.html#patch) function takes two objects-as-hashMaps. Any keys in the second hashMap that are missing in first will get added.
  * Textures, Materials, and Geometries now get cached to save a bunch of GPU memory.
  * Redesigned how [`textured()`](index.html#textured) works. Optional parameters now go in an options object-nee-hashMap as the last parameter to the function.
  * Option for `textured()` to display objects as wireframes.
  * Only dirty parts of images render now (roughly speaking), saving some draw time.
  * Converted HTTP request handling and many other things over to using Promises instead of explicit callbacks.
  * For WebVR API 1.0 scenarios, now rendering a non-stereo view on the monitor outside of the HMD.
  * Documentation pages are now statically generated, for anything that is not based on the live documentation of the framework itself (e.g. tutorials).
  * Added values to [`Primrose.Keys`](index.html#Primrose_Keys):
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
  * Unified all selection-type events in [`Primrose.Input.FPSInput`](index.html#Primrose_Input_FPSInput) so that `Primrose.BrowserEnvironment` could be simplified to use a pointer-events-like interface.
  * Automatically select the first available gamepad for use, rather than bugging the user with a `confirm()` dialog.
  * New monitor and Google Cardboard 3D icons for triggering fullscreen or presentation mode. Demos are now 100% 3D interface, no 2D interface left.
  * Added support for OBJ files (and their associated MTL files, just make sure they have the same base filename and live in the same path) in [`Primrose.ModelLoader`](index.html#Primrose_ModelLoader).
  * Created option to disable clickable objects separately from making them invisible, to support being able to make invisible, but clickable objects.
  * Garbage collect pickable objects when they get removed from a scene.
  * Re-enabled ambient audio.
  * Added the stereo image demo to the main Editor3D demo.
* Defect fixes
  * Fixes for WebVR API fallback on current Firefox Nightly
  * Fix for zeroing sensor on new WebVR API
  * Don't resize canvas to full screen dimensions on desktop. This is only necessary on mobile devices, to support scrolling to remove browser chrome.
  * Fixed having to make dev-to-production changes manually. Using full static site generation now.
  * Fixed lighting for Three.js r74.
  * Got off of DreamHost, finally. Now on Azure.
  * Don't move the camera view by orientation until the user hits the "go VR" button.
  * Fixed out-of-bounds array access in projector (though ultimately, seems I broke the projector for buffered geometry)
  * Fix for loading a texture more than once into multiple materials. Probably should cache the material, though.
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

## v0.20

It's going to be nothing but documentation for a while.

* Features
  * None
* Defect Fixes
  * Simplified [`pliny`](index.html#WritingnewdocumentationwithPliny) interface.
  * Cleaned up dependencies.
  * Set NPM startup script.
  * Better use of screen width for documentation page.
  * Creating a [`Primrose.BrowserEnvironment`](index.html#Primrose_BrowserEnvironment) no longer spams the console with an inconsequential error (because the error is fixed!).
  * Code samples on documentation page now resize with the page.
  * Cleaner font rendering.
  * Fixed a typo where [`Primrose.SKIN_VALUES`](index.html#Primrose_SKIN_VALUES) was called `Primrose.SKINS_VALUES`.
  * Long descriptions get shortened now, when displayed as part of a list of features on a parent object.
  * Better Markdown document parsing.
  * All functions and classes should now be included in documentation (though details not yet written).
  * Don't attempt to support <kbd>CTRL+Up/Down Arrow</kbd> movement on OS X.
  * Fix issue where some links into internal documentation were opening in a new window.
  * Fixed issue where using the "top" link at the bottom of a documentation page would cause the page to reset to the introduction.
  * Prevent `alert()`, `confirm()`, and `prompt()` while in full screen mode.
  * Fixed issue where multiple newline characters in a row were only incrementing the row display once, causing blank lines of text to get truncated.
* Admin
  * [Getting Started](index.html#) documentation.
  * [`Primrose.Text.Grammar`](index.html#Primrose_Text_Grammar) documentation.
  * Issue traction in documentation.
  * Tons of new issue tickets.
  * [`fmt()`](index.html#fmt) documentation.
  * [`px()`](index.html#px) documentation.
  * [`pct()`](index.html#pct) documentation.
  * [`ems()`](index.html#ems) documentation.
  * New [`rems()`](index.html#rems) function.
  * New [`vws()`](index.html#vws) function.
  * [`hsl()`](index.html#hsl) documentation.
  * [`rgb()`](index.html#rgb) documentation.
  * [`rgba()`](index.html#rgba) documentation.
  * [`hsl()`](index.html#hsl) documentation.
  * [`hsla()`](index.html#hsla) documentation.
  * Table styling for enumeration values.
  * [`Primrose.DOM`](index.html#Primrose_DOM) documentation.
  * [`getSetting()`](index.html#getSetting) documentation.
  * [`setSetting()`](index.html#setSetting) documentation.
  * [`deleteSetting()`](index.html#deleteSetting) documentation.
  * [`readForm()`](index.html#readForm) documentation.
  * [`writeForm()`](index.html#writeForm) documentation.
  * Hashed issue ID.
  * Issue count in issue header.
  * Documentation page can now load Markdown documents.
  * [`Primrose.ModelLoader`](index.html#Primrose_ModelLoader) documentation.
  * Auto-generate `target="_blank"` for links that go away from the documentation page.
  * Incomplete documents rendered with greyed-out links (though they are also viewable).
  * semi-repsonsive layout for documentation page.
  * Styling for KBD, CODE, and BLOCKQUOTE blocks.
  * ["Installation and Setup"](index.html#InstallationandSetup) documentation.
  * ["Frequently Asked Question"](index.html#FrequentlyAskedQuestions) documentation.
  * "Using the VR Development Environment" documentation.
  * Per-document table-of-contents in documentation page.
  * "Using the VR Development Environment" documentation.
  * Started CHANGELOG.
  * Use `grammar("JavaScript");` at the top of your code blocks to indicate syntax highlighting preference.
  * This CHANGELOG page.
  * More documentation.


## Other

If you want to know more, check the [Git commit log](https://github.com/NotionTheory/Primrose/commits/dev). I'm not going to rewrite the entire thing here.
