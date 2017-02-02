# intervalometer

> Call a function at every frame or every X ms. With start/stop

[![gzipped size](https://badges.herokuapp.com/size/github/bfred-it/intervalometer/master/dist/intervalometer.browser.js?gzip=true&label=gzipped%20size)](#readme)
[![Travis build](https://api.travis-ci.org/bfred-it/intervalometer.svg)](https://travis-ci.org/bfred-it/intervalometer)
[![npm link](https://img.shields.io/npm/v/intervalometer.svg)](https://www.npmjs.com/package/intervalometer)

## Usage

There are two times of intervalometers: frame-based and time-based. Both return an object with `start` and `stop` functions. You can safely call `start` multiple times, the callback will only run once at every interval.

### `frameIntervalometer(cb)`

Uses `requestAnimationFrame` and therefore calls the provided callback at every frame. Ideal for animations

```js
const painter = frameIntervalometer(function (millisecondsSinceLastFrame) {
	// your logic to run at every frame
});

button.onclick = function () {
	painter.start();
};
```

### `timerIntervalometer(cb, ms)`

uses `setTimeout` and calls the callback every `ms` milliseconds

```js
const poller = timerIntervalometer(pollingFunction, 100); //runs every 100 ms

startButton.onclick = function () {
	poller.start();
};
stopButton.onclick = function () {
	poller.stop();
};
```

## Install

Pick your favorite:

```html
<script src="dist/intervalometer.browser.js"></script>
<!-- use as intervalometer.frameIntervalometer(cb) -->
<!--     or intervalometer.timerIntervalometer(cb, ms) -->
```

```sh
npm install --save intervalometer
```

```js
var i = require('intervalometer');
var frameIntervalometer = i.frameIntervalometer;
var timerIntervalometer = i.timerIntervalometer;
```

```js
import {frameIntervalometer, timerIntervalometer} from 'intervalometer';
```

## Dependencies

None! `frameIntervalometer` only works where `window.requestAnimationFrame` is available (yes in modern browsers; not in Node)

## Related

* [iphone-inline-video](https://github.com/bfred-it/iphone-inline-video/): `video[playsinline]` polyfill that uses this module.
* [animate-prop](https://github.com/bfred-it/animate-prop): Single low-level function to tween any property over time.

## License

MIT © [Federico Brigante](http://twitter.com/bfred_it)
