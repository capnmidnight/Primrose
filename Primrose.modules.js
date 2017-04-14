import { AmbientLight, AnimationClip, BackSide, BoxBufferGeometry, BufferAttribute, BufferGeometry, CircleBufferGeometry, Color, CubeTexture, CubeTextureLoader, CylinderBufferGeometry, DefaultLoadingManager, DirectionalLight, Euler, EventDispatcher, Face3, FileLoader, FlatShading, FogExp2, FontLoader, FrontSide, Geometry, Group, ImageLoader, LineBasicMaterial, LineSegments, LinearFilter, Loader, Math as Math$1, Matrix3, Matrix4, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, MultiMaterial, Object3D, ObjectLoader, PCFSoftShadowMap, PerspectiveCamera, PlaneBufferGeometry, PlaneGeometry, PointLight, Points, PointsMaterial, Quaternion, Raycaster, RepeatWrapping, RingBufferGeometry, Scene, SmoothShading, Sphere, SphereGeometry, TextGeometry, Texture, TextureLoader, Vector2, Vector3, Vector4, WebGLRenderer } from 'three';

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

var isChrome = !!window.chrome && !isOpera;

var isFirefox = typeof window.InstallTrigger !== "undefined";

var isGearVR = navigator.userAgent.indexOf("Mobile VR") > -1;

var isIE = /*@cc_on!@*/false || !!document.documentMode;

var isInIFrame = window.self !== window.top;

var isiOS = /iP(hone|od|ad)/.test(navigator.userAgent || "");

function isLandscape() {
  return Math.abs(window.orientation) === 90;
}

var isMacOS = /Macintosh/.test(navigator.userAgent || "");

function testUserAgent(a) {
  return (/(android|bb\d+|meego).+|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substring(0, 4))
  );
}

var isMobile = testUserAgent(navigator.userAgent || navigator.vendor || window.opera);

var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;

var isWebKit = isOpera || isChrome || isSafari;

var isWindows = /Windows/.test(navigator.userAgent || "");

var index$1 = {
  isChrome: isChrome,
  isFirefox: isFirefox,
  isGearVR: isGearVR,
  isIE: isIE,
  isInIFrame: isInIFrame,
  isiOS: isiOS,
  isLandscape: isLandscape,
  isMacOS: isMacOS,
  isMobile: isMobile,
  isOpera: isOpera,
  isSafari: isSafari,
  isWebKit: isWebKit,
  isWindows: isWindows
};

var flags = Object.freeze({
	isChrome: isChrome,
	isFirefox: isFirefox,
	isGearVR: isGearVR,
	isIE: isIE,
	isInIFrame: isInIFrame,
	isiOS: isiOS,
	isLandscape: isLandscape,
	isMacOS: isMacOS,
	isMobile: isMobile,
	isOpera: isOpera,
	isSafari: isSafari,
	isWebKit: isWebKit,
	isWindows: isWindows,
	default: index$1
});

function hub() {
  return new Object3D();
}

var _cache = {};
function cache(hash, makeObject, onCacheHit) {
  if (!_cache[hash]) {
    _cache[hash] = makeObject();
  } else if (onCacheHit) {
    onCacheHit(_cache[hash]);
  }
  return _cache[hash];
}

function material(textureDescription, options) {
  if (options === undefined && typeof textureDescription !== "string") {
    options = textureDescription;
    textureDescription = "none";
  }
  options = Object.assign({}, {
    opacity: 1,
    roughness: 0.5,
    metalness: 0,
    color: 0xffffff,
    useFog: true,
    unshaded: false,
    wireframe: false,
    side: FrontSide
  }, options);

  var materialDescription = "Primrose.material(" + textureDescription + ", " + options.color + ", " + options.unshaded + ", " + options.side + ", " + options.opacity + ", " + options.roughness + ", " + options.metalness + ", " + options.color + ", " + options.emissive + ", " + options.wireframe + ", " + options.useFog + ")";

  return cache(materialDescription, function () {
    var materialOptions = {
      fog: options.useFog,
      transparent: options.transparent || options.opacity !== undefined && options.opacity < 1,
      opacity: options.opacity,
      side: options.side || FrontSide
    },
        MaterialType = MeshStandardMaterial;

    if (options.unshaded) {
      materialOptions.shading = FlatShading;
      MaterialType = MeshBasicMaterial;
    } else {
      materialOptions.roughness = options.roughness;
      materialOptions.metalness = options.metalness;

      if (options.emissive !== undefined) {
        materialOptions.emissive = options.emissive;
      }
    }

    var mat = new MaterialType(materialOptions);
    if (typeof options.color === "number" || options.color instanceof Number) {
      mat.color.set(options.color);
    }
    mat.wireframe = options.wireframe;
    return mat;
  });
}

function loadTexture(id, url, progress) {
  var textureLoader = null;
  if (url instanceof Array && url.length === 6) {
    textureLoader = new CubeTextureLoader();
  } else {
    if (url instanceof HTMLImageElement) {
      url = url.src;
    }

    if (typeof url === "string") {
      textureLoader = new TextureLoader();
    }
  }

  if (textureLoader) {
    textureLoader.setCrossOrigin("anonymous");
  }

  return cache("Texture(" + id + ")", function () {
    return new Promise(function (resolve, reject) {
      if (textureLoader) {
        textureLoader.load(url, resolve, progress, reject);
      } else {
        resolve(new Texture(url));
      }
    });
  });
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var seenElements = new WeakMap();
var seenElementCount = 0;

function textured(geometry, txt, options) {
  if (!options) {
    options = {};
  }
  if (!options.txtRepeatX) {
    options.txtRepeatX = 1;
  }
  if (!options.txtRepeatY) {
    options.txtRepeatY = 1;
  }
  if (!options.anisotropy) {
    options.anisotropy = 1;
  }

  var txtType = typeof txt === "undefined" ? "undefined" : _typeof(txt),
      txtID = null;
  if (txtType === "object") {
    if (txt.id) {
      txtID = txt.id;
    } else {
      if (!seenElements.has(txt)) {
        seenElements.set(txt, "TextureAutoID" + seenElementCount);
        ++seenElementCount;
      }
      txtID = seenElements.get(txt);
    }
  } else if (txtType === "string") {
    txtID = txt;
  } else {
    var err = new Error("Couldn't figure out how to make a texture out of typeof '" + txtType + "', value " + txt + ".");
    if (options.reject) {
      options.reject(err);
    } else {
      throw err;
    }
  }

  var textureDescription = "Primrose.textured(" + txtID + ", " + options.txtRepeatX + ", " + options.txtRepeatY + ", " + options.anisotropy + ", " + options.scaleTextureWidth + ", " + options.scaleTextureHeight + ")";
  var texturePromise = cache(textureDescription, function () {
    if (typeof txt === "string" || txt instanceof Array || txt.length === 6) {
      return loadTexture(textureDescription, txt, options.progress);
    } else {
      var retValue = null;
      if (txt instanceof HTMLCanvasElement || txt instanceof HTMLVideoElement || txt instanceof HTMLImageElement) {
        retValue = new Texture(txt);
      } else if (txt.isTexture) {
        retValue = txt;
      } else {
        Promise.reject("Texture description couldn't be converted to a THREE.Texture object");
      }

      return Promise.resolve(retValue);
    }
  });

  var mat = material(textureDescription, options),
      obj = null;
  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new Mesh(geometry, mat);
  } else if (geometry.isMesh) {
    obj = geometry;
    obj.material = mat;
    geometry = obj.geometry;
  }

  if (options.shadow) {
    obj.receiveShadow = true;
    obj.castShadow = true;
  }

  if (options.scaleTextureWidth || options.scaleTextureHeight) {
    if (geometry.attributes && geometry.attributes.uv && geometry.attributes.uv.array) {
      var uv = geometry.attributes.uv,
          arr = uv.array,
          i;
      if (options.scaleTextureWidth) {
        for (i = 0; i < arr.length; i += uv.itemSize) {
          arr[i] *= options.scaleTextureWidth;
        }
      }
      if (options.scaleTextureHeight) {
        for (i = 1; i < arr.length; i += uv.itemSize) {
          arr[i] = 1 - (1 - arr[i]) * options.scaleTextureHeight;
        }
      }
    } else {
      console.trace(geometry, options);
    }
  }

  options.promise = texturePromise.then(function (texture) {
    if (options.txtRepeatX * options.txtRepeatY > 1) {
      texture.wrapS = texture.wrapT = RepeatWrapping;
      texture.repeat.set(options.txtRepeatX, options.txtRepeatY);
    }

    texture.anisotropy = options.anisotropy;

    if (texture.isCubeTexture) {
      mat.envMap = texture;
    } else if (texture.isTexture) {
      mat.map = texture;
    }

    mat.needsUpdate = true;
    texture.needsUpdate = true;
    return texture;
  });

  return obj;
}

function colored(geometry, color, options) {
  options = options || {};
  options.color = color;

  var mat = material("", options),
      obj = null;

  if (geometry.type.indexOf("Geometry") > -1) {
    obj = new Mesh(geometry, mat);
  } else if (geometry.isObject3D) {
    obj = geometry;
    obj.material = mat;
  }

  if (options.shadow) {
    obj.receiveShadow = true;
    obj.castShadow = true;
  }

  if (options.resolve) {
    options.resolve();
  }
  return obj;
}

function box(width, height, length, t, u, v) {
  if (height === undefined) {
    height = width;
  }
  if (length === undefined) {
    length = width;
  }
  return cache("BoxBufferGeometry(" + width + ", " + height + ", " + length + ", " + t + ", " + u + ", " + v + ")", function () {
    return new BoxBufferGeometry(width, height, length, t, u, v);
  });
}

function brick(txt, width, height, length, options) {
  width = width || 1;
  height = height || 1;
  length = length || 1;
  options = Object.assign({}, {
    txtRepeatX: width,
    txtRepeatY: length,
    anisotropy: 8,
    transparent: true,
    opacity: 1
  }, options);
  var m = typeof txt === "number" ? colored : textured,
      obj = m(box(width, height, length), txt, options);
  return obj;
}

function axis(length, width) {
  return hub().add(brick(0xff0000, length, width, width)).add(brick(0x00ff00, width, length, width)).add(brick(0x0000ff, width, width, length));
}

var index$3 = typeof Symbol === 'undefined' ? function (description) {
	return '@' + (description || '@') + Math.random();
} : Symbol;

/*! npm.im/intervalometer */
function intervalometer(cb, request, cancel, requestParameter) {
	var requestId;
	var previousLoopTime;
	function loop(now) {
		// must be requested before cb() because that might call .stop()
		requestId = request(loop, requestParameter);

		// called with "ms since last call". 0 on start()
		cb(now - (previousLoopTime || now));

		previousLoopTime = now;
	}
	return {
		start: function start() {
			if (!requestId) { // prevent double starts
				loop(0);
			}
		},
		stop: function stop() {
			cancel(requestId);
			requestId = null;
			previousLoopTime = 0;
		}
	};
}

function frameIntervalometer(cb) {
	return intervalometer(cb, requestAnimationFrame, cancelAnimationFrame);
}

/*! npm.im/iphone-inline-video */
function preventEvent(element, eventName, toggleProperty, preventWithProperty) {
	function handler(e) {
		if (Boolean(element[toggleProperty]) === Boolean(preventWithProperty)) {
			e.stopImmediatePropagation();
			// console.log(eventName, 'prevented on', element);
		}
		delete element[toggleProperty];
	}
	element.addEventListener(eventName, handler, false);

	// Return handler to allow to disable the prevention. Usage:
	// const preventionHandler = preventEvent(el, 'click');
	// el.removeEventHandler('click', preventionHandler);
	return handler;
}

function proxyProperty(object, propertyName, sourceObject, copyFirst) {
	function get() {
		return sourceObject[propertyName];
	}
	function set(value) {
		sourceObject[propertyName] = value;
	}

	if (copyFirst) {
		set(object[propertyName]);
	}

	Object.defineProperty(object, propertyName, {get: get, set: set});
}

function proxyEvent(object, eventName, sourceObject) {
	sourceObject.addEventListener(eventName, function () { return object.dispatchEvent(new Event(eventName)); });
}

function dispatchEventAsync(element, type) {
	Promise.resolve().then(function () {
		element.dispatchEvent(new Event(type));
	});
}

// iOS 10 adds support for native inline playback + silent autoplay
var isWhitelisted = 'object-fit' in document.head.style && /iPhone|iPod/i.test(navigator.userAgent) && !matchMedia('(-webkit-video-playable-inline)').matches;

var ಠ = index$3();
var ಠevent = index$3();
var ಠplay = index$3('nativeplay');
var ಠpause = index$3('nativepause');

/**
 * UTILS
 */

function getAudioFromVideo(video) {
	var audio = new Audio();
	proxyEvent(video, 'play', audio);
	proxyEvent(video, 'playing', audio);
	proxyEvent(video, 'pause', audio);
	audio.crossOrigin = video.crossOrigin;

	// 'data:' causes audio.networkState > 0
	// which then allows to keep <audio> in a resumable playing state
	// i.e. once you set a real src it will keep playing if it was if .play() was called
	audio.src = video.src || video.currentSrc || 'data:';

	// if (audio.src === 'data:') {
	//   TODO: wait for video to be selected
	// }
	return audio;
}

var lastRequests = [];
var requestIndex = 0;
var lastTimeupdateEvent;

function setTime(video, time, rememberOnly) {
	// allow one timeupdate event every 200+ ms
	if ((lastTimeupdateEvent || 0) + 200 < Date.now()) {
		video[ಠevent] = true;
		lastTimeupdateEvent = Date.now();
	}
	if (!rememberOnly) {
		video.currentTime = time;
	}
	lastRequests[++requestIndex % 3] = time * 100 | 0 / 100;
}

function isPlayerEnded(player) {
	return player.driver.currentTime >= player.video.duration;
}

function update(timeDiff) {
	var player = this;
	// console.log('update', player.video.readyState, player.video.networkState, player.driver.readyState, player.driver.networkState, player.driver.paused);
	if (player.video.readyState >= player.video.HAVE_FUTURE_DATA) {
		if (!player.hasAudio) {
			player.driver.currentTime = player.video.currentTime + ((timeDiff * player.video.playbackRate) / 1000);
			if (player.video.loop && isPlayerEnded(player)) {
				player.driver.currentTime = 0;
			}
		}
		setTime(player.video, player.driver.currentTime);
	} else if (player.video.networkState === player.video.NETWORK_IDLE && !player.video.buffered.length) {
		// this should happen when the source is available but:
		// - it's potentially playing (.paused === false)
		// - it's not ready to play
		// - it's not loading
		// If it hasAudio, that will be loaded in the 'emptied' handler below
		player.video.load();
		// console.log('Will load');
	}

	// console.assert(player.video.currentTime === player.driver.currentTime, 'Video not updating!');

	if (player.video.ended) {
		delete player.video[ಠevent]; // allow timeupdate event
		player.video.pause(true);
	}
}

/**
 * METHODS
 */

function play() {
	// console.log('play');
	var video = this;
	var player = video[ಠ];

	// if it's fullscreen, use the native player
	if (video.webkitDisplayingFullscreen) {
		video[ಠplay]();
		return;
	}

	if (player.driver.src !== 'data:' && player.driver.src !== video.src) {
		// console.log('src changed on play', video.src);
		setTime(video, 0, true);
		player.driver.src = video.src;
	}

	if (!video.paused) {
		return;
	}
	player.paused = false;

	if (!video.buffered.length) {
		// .load() causes the emptied event
		// the alternative is .play()+.pause() but that triggers play/pause events, even worse
		// possibly the alternative is preventing this event only once
		video.load();
	}

	player.driver.play();
	player.updater.start();

	if (!player.hasAudio) {
		dispatchEventAsync(video, 'play');
		if (player.video.readyState >= player.video.HAVE_ENOUGH_DATA) {
			// console.log('onplay');
			dispatchEventAsync(video, 'playing');
		}
	}
}
function pause(forceEvents) {
	// console.log('pause');
	var video = this;
	var player = video[ಠ];

	player.driver.pause();
	player.updater.stop();

	// if it's fullscreen, the developer the native player.pause()
	// This is at the end of pause() because it also
	// needs to make sure that the simulation is paused
	if (video.webkitDisplayingFullscreen) {
		video[ಠpause]();
	}

	if (player.paused && !forceEvents) {
		return;
	}

	player.paused = true;
	if (!player.hasAudio) {
		dispatchEventAsync(video, 'pause');
	}
	if (video.ended) {
		video[ಠevent] = true;
		dispatchEventAsync(video, 'ended');
	}
}

/**
 * SETUP
 */

function addPlayer(video, hasAudio) {
	var player = video[ಠ] = {};
	player.paused = true; // track whether 'pause' events have been fired
	player.hasAudio = hasAudio;
	player.video = video;
	player.updater = frameIntervalometer(update.bind(player));

	if (hasAudio) {
		player.driver = getAudioFromVideo(video);
	} else {
		video.addEventListener('canplay', function () {
			if (!video.paused) {
				// console.log('oncanplay');
				dispatchEventAsync(video, 'playing');
			}
		});
		player.driver = {
			src: video.src || video.currentSrc || 'data:',
			muted: true,
			paused: true,
			pause: function () {
				player.driver.paused = true;
			},
			play: function () {
				player.driver.paused = false;
				// media automatically goes to 0 if .play() is called when it's done
				if (isPlayerEnded(player)) {
					setTime(video, 0);
				}
			},
			get ended() {
				return isPlayerEnded(player);
			}
		};
	}

	// .load() causes the emptied event
	video.addEventListener('emptied', function () {
		// console.log('driver src is', player.driver.src);
		var wasEmpty = !player.driver.src || player.driver.src === 'data:';
		if (player.driver.src && player.driver.src !== video.src) {
			// console.log('src changed to', video.src);
			setTime(video, 0, true);
			player.driver.src = video.src;
			// playing videos will only keep playing if no src was present when .play()’ed
			if (wasEmpty) {
				player.driver.play();
			} else {
				player.updater.stop();
			}
		}
	}, false);

	// stop programmatic player when OS takes over
	video.addEventListener('webkitbeginfullscreen', function () {
		if (!video.paused) {
			// make sure that the <audio> and the syncer/updater are stopped
			video.pause();

			// play video natively
			video[ಠplay]();
		} else if (hasAudio && !player.driver.buffered.length) {
			// if the first play is native,
			// the <audio> needs to be buffered manually
			// so when the fullscreen ends, it can be set to the same current time
			player.driver.load();
		}
	});
	if (hasAudio) {
		video.addEventListener('webkitendfullscreen', function () {
			// sync audio to new video position
			player.driver.currentTime = video.currentTime;
			// console.assert(player.driver.currentTime === video.currentTime, 'Audio not synced');
		});

		// allow seeking
		video.addEventListener('seeking', function () {
			if (lastRequests.indexOf(video.currentTime * 100 | 0 / 100) < 0) {
				// console.log('User-requested seeking');
				player.driver.currentTime = video.currentTime;
			}
		});
	}
}

function overloadAPI(video) {
	var player = video[ಠ];
	video[ಠplay] = video.play;
	video[ಠpause] = video.pause;
	video.play = play;
	video.pause = pause;
	proxyProperty(video, 'paused', player.driver);
	proxyProperty(video, 'muted', player.driver, true);
	proxyProperty(video, 'playbackRate', player.driver, true);
	proxyProperty(video, 'ended', player.driver);
	proxyProperty(video, 'loop', player.driver, true);
	preventEvent(video, 'seeking');
	preventEvent(video, 'seeked');
	preventEvent(video, 'timeupdate', ಠevent, false);
	preventEvent(video, 'ended', ಠevent, false); // prevent occasional native ended events
}

function enableInlineVideo(video, hasAudio, onlyWhitelisted) {
	if ( hasAudio === void 0 ) hasAudio = true;
	if ( onlyWhitelisted === void 0 ) onlyWhitelisted = true;

	if ((onlyWhitelisted && !isWhitelisted) || video[ಠ]) {
		return;
	}
	addPlayer(video, hasAudio);
	overloadAPI(video);
	video.classList.add('IIV');
	if (!hasAudio && video.autoplay) {
		video.play();
	}
	if (!/iPhone|iPod|iPad/.test(navigator.platform)) {
		console.warn('iphone-inline-video is not guaranteed to work in emulated environments');
	}
}

enableInlineVideo.isWhitelisted = isWhitelisted;

var Entity = function (_Object3D) {
  inherits(Entity, _Object3D);

  function Entity(name, options) {
    classCallCheck(this, Entity);

    var _this = possibleConstructorReturn(this, (Entity.__proto__ || Object.getPrototypeOf(Entity)).call(this));

    _this.isEntity = true;
    _this.name = name;
    _this.options = options || {};
    _this.ready = _this._ready.then(function () {
      return _this;
    });
    _this.disabled = false;
    return _this;
  }

  createClass(Entity, [{
    key: "_ready",
    get: function get$$1() {
      return Promise.resolve();
    }
  }]);
  return Entity;
}(Object3D);

function fixGeometry(geometry, options) {
  options = options || {};
  var maxU = options.maxU || 1,
      maxV = options.maxV || 1,
      attrs = geometry.attributes || geometry._bufferGeometry && geometry._bufferGeometry.attributes;
  if (attrs && attrs.uv && attrs.uv.array) {
    var uv = attrs.uv,
        arr = uv.array;
    for (var j = 0; j < arr.length; j += uv.itemSize) {
      arr[j] *= maxU;
    }
    for (var _j = 1; _j < arr.length; _j += uv.itemSize) {
      arr[_j] = 1 - (1 - arr[_j]) * maxV;
    }
  } else if (geometry.faceVertexUvs) {
    var faces = geometry.faceVertexUvs;
    for (var i = 0; i < faces.length; ++i) {
      var face = faces[i];
      for (var _j2 = 0; _j2 < face.length; ++_j2) {
        var uvs = face[_j2];
        for (var k = 0; k < uvs.length; ++k) {
          var _uv = uvs[k];
          _uv.x *= maxU;
          _uv.y = 1 - (1 - _uv.y) * maxV;
        }
      }
    }
  }

  return geometry;
}

function quad(width, height, options) {

  if (width === undefined) {
    width = 1;
  }

  if (height === undefined) {
    height = width;
  }

  options = Object.assign({}, {
    s: 1,
    t: 1
  }, options);

  return cache("PlaneBufferGeometry(" + width + ", " + height + ", " + options.s + ", " + options.t + ", " + options.maxU + ", " + options.maxV + ")", function () {
    return fixGeometry(new PlaneBufferGeometry(width, height, options.s, options.t), options);
  });
}

var InsideSphereGeometry = function (_Geometry) {
  inherits(InsideSphereGeometry, _Geometry);

  function InsideSphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
    classCallCheck(this, InsideSphereGeometry);

    var _this = possibleConstructorReturn(this, (InsideSphereGeometry.__proto__ || Object.getPrototypeOf(InsideSphereGeometry)).call(this));

    _this.type = 'InsideSphereGeometry';

    _this.parameters = {
      radius: radius,
      widthSegments: widthSegments,
      heightSegments: heightSegments,
      phiStart: phiStart,
      phiLength: phiLength,
      thetaStart: thetaStart,
      thetaLength: thetaLength
    };

    radius = radius || 50;

    widthSegments = Math.max(3, Math.floor(widthSegments) || 8);
    heightSegments = Math.max(2, Math.floor(heightSegments) || 6);

    phiStart = phiStart !== undefined ? phiStart : 0;
    phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

    thetaStart = thetaStart !== undefined ? thetaStart : 0;
    thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

    var x,
        y,
        vertices = [],
        uvs = [];

    for (y = 0; y <= heightSegments; y++) {

      var verticesRow = [];
      var uvsRow = [];

      for (x = widthSegments; x >= 0; x--) {

        var u = x / widthSegments;

        var v = y / heightSegments;

        var vertex = new Vector3();
        vertex.x = -radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);
        vertex.y = radius * Math.cos(thetaStart + v * thetaLength);
        vertex.z = radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength);

        _this.vertices.push(vertex);

        verticesRow.push(_this.vertices.length - 1);
        uvsRow.push(new Vector2(1 - u, 1 - v));
      }

      vertices.push(verticesRow);
      uvs.push(uvsRow);
    }

    for (y = 0; y < heightSegments; y++) {

      for (x = 0; x < widthSegments; x++) {

        var v1 = vertices[y][x + 1];
        var v2 = vertices[y][x];
        var v3 = vertices[y + 1][x];
        var v4 = vertices[y + 1][x + 1];

        var n1 = _this.vertices[v1].clone().normalize();
        var n2 = _this.vertices[v2].clone().normalize();
        var n3 = _this.vertices[v3].clone().normalize();
        var n4 = _this.vertices[v4].clone().normalize();

        var uv1 = uvs[y][x + 1].clone();
        var uv2 = uvs[y][x].clone();
        var uv3 = uvs[y + 1][x].clone();
        var uv4 = uvs[y + 1][x + 1].clone();

        if (Math.abs(_this.vertices[v1].y) === radius) {

          uv1.x = (uv1.x + uv2.x) / 2;
          _this.faces.push(new Face3(v1, v3, v4, [n1, n3, n4]));
          _this.faceVertexUvs[0].push([uv1, uv3, uv4]);
        } else if (Math.abs(_this.vertices[v3].y) === radius) {

          uv3.x = (uv3.x + uv4.x) / 2;
          _this.faces.push(new Face3(v1, v2, v3, [n1, n2, n3]));
          _this.faceVertexUvs[0].push([uv1, uv2, uv3]);
        } else {

          _this.faces.push(new Face3(v1, v2, v4, [n1, n2, n4]));
          _this.faceVertexUvs[0].push([uv1, uv2, uv4]);

          _this.faces.push(new Face3(v2, v3, v4, [n2.clone(), n3, n4.clone()]));
          _this.faceVertexUvs[0].push([uv2.clone(), uv3, uv4.clone()]);
        }
      }
    }

    _this.computeFaceNormals();

    for (var i = 0; i < _this.faces.length; ++i) {
      var f = _this.faces[i];
      f.normal.multiplyScalar(-1);
      for (var j = 0; j < f.vertexNormals.length; ++j) {
        f.vertexNormals[j].multiplyScalar(-1);
      }
    }

    _this.boundingSphere = new Sphere(new Vector3(), radius);

    return _this;
  }

  return InsideSphereGeometry;
}(Geometry);

var SLICE = 0.45;
function shell(r, slices, rings, phi, theta, options) {
  if (phi === undefined) {
    phi = Math.PI * SLICE;
  }
  if (theta === undefined) {
    theta = Math.PI * SLICE * 0.6;
  }
  var phiStart = 1.5 * Math.PI - phi * 0.5,
      thetaStart = (Math.PI - theta) * 0.5;
  options = options || {};
  return cache("InsideSphereGeometry(" + r + ", " + slices + ", " + rings + ", " + phi + ", " + theta + ")", function () {
    return fixGeometry(new InsideSphereGeometry(r, slices, rings, phiStart, phi, thetaStart, theta, true), options);
  });
}

var entities = [];

function updateAll() {
  entities.forEach(function (entity) {
    entity.eyeBlank(0);
    entity.update();
  });
}

function eyeBlankAll(eye) {
  entities.forEach(function (entity) {
    return entity.eyeBlank(eye);
  });
}

var BaseTextured = function (_Entity) {
  inherits(BaseTextured, _Entity);

  function BaseTextured(files, options) {
    classCallCheck(this, BaseTextured);

    name = options && options.id || files.join();

    var _this = possibleConstructorReturn(this, (BaseTextured.__proto__ || Object.getPrototypeOf(BaseTextured)).call(this, name, options));

    entities.push(_this);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    _this._files = files;
    _this._meshes = [];
    _this._textures = [];
    _this._currentImageIndex = 0;

    if (_this.options.geometry) {
      _this._geometry = _this.options.geometry;
    } else if (_this.options.radius) {
      _this._geometry = shell(_this.options.radius, 72, 36, Math.PI * 2, Math.PI, options);
    } else {
      if (!_this.options.width) {
        _this.options.width = 0.5;
      }
      if (!_this.options.height) {
        _this.options.height = 0.5;
      }
      _this._geometry = quad(_this.options.width, _this.options.height, options);
    }
    return _this;
  }

  createClass(BaseTextured, [{
    key: "eyeBlank",
    value: function eyeBlank(eye) {
      if (this._meshes && this._meshes.length > 0) {
        this._currentImageIndex = eye % this._meshes.length;
        for (var i = 0; i < this._meshes.length; ++i) {
          this._meshes[i].visible = i === this._currentImageIndex;
        }
      }
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "_ready",
    get: function get$$1() {
      var _this2 = this;

      return get(BaseTextured.prototype.__proto__ || Object.getPrototypeOf(BaseTextured.prototype), "_ready", this).then(function () {
        return _this2._loadFiles(_this2._files, _this2.options.progress);
      }).then(function () {
        return _this2._meshes.forEach(function (mesh) {
          return _this2.add(mesh);
        });
      });
    }
  }, {
    key: "blending",
    get: function get$$1() {
      return this._meshes && this._meshes.length > 0 && this._meshes[0] && this._meshes[0].material.blending;
    },
    set: function set$$1(v) {
      this._meshes.forEach(function (mesh) {
        return mesh.material.blending = v;
      });
    }
  }]);
  return BaseTextured;
}(Entity);

var COUNTER = 0;

// Videos don't auto-play on mobile devices, so let's make them all play whenever we tap the screen.
var processedVideos = [];
function findAndFixVideo(evt) {
  var vids = document.querySelectorAll("video");
  for (var i = 0; i < vids.length; ++i) {
    fixVideo(vids[i]);
  }
  window.removeEventListener("touchend", findAndFixVideo);
  window.removeEventListener("mouseup", findAndFixVideo);
  window.removeEventListener("keyup", findAndFixVideo);
}

function fixVideo(vid) {
  if (isiOS && processedVideos.indexOf(vid) === -1) {
    processedVideos.push(vid);
    enableInlineVideo(vid, false);
  }
}

window.addEventListener("touchend", findAndFixVideo, false);
window.addEventListener("mouseup", findAndFixVideo, false);
window.addEventListener("keyup", findAndFixVideo, false);

var Video = function (_BaseTextured) {
  inherits(Video, _BaseTextured);

  function Video(videos, options) {
    classCallCheck(this, Video);

    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////
    if (!(videos instanceof Array)) {
      videos = [videos];
    }

    options = Object.assign({}, {
      id: "Primrose.Controls.Video[" + COUNTER++ + "]"
    }, options);

    return possibleConstructorReturn(this, (Video.__proto__ || Object.getPrototypeOf(Video)).call(this, videos, options));
  }

  createClass(Video, [{
    key: "_loadFiles",
    value: function _loadFiles(videos, progress) {
      var _this2 = this;

      this._elements = Array.prototype.map.call(videos, function (spec, i) {
        var video = null;
        if (typeof spec === "string") {
          video = document.querySelector("video[src='" + spec + "']");
          if (!video) {
            video = document.createElement("video");
            video.src = spec;
          }
        } else if (spec instanceof HTMLVideoElement) {
          video = spec;
        } else if (spec.toString() === "[object MediaStream]" || spec.toString() === "[object LocalMediaStream]") {
          video = document.createElement("video");
          video.srcObject = spec;
        }
        video.onprogress = progress;
        video.onloadedmetadata = progress;
        video.muted = true;
        video.loop = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        if (!isiOS) {
          video.preload = "auto";
        }

        var loadOptions = Object.assign({}, _this2.options);
        _this2._meshes[i] = textured(_this2._geometry, video, loadOptions);

        if (!video.parentElement) {
          document.body.insertBefore(video, document.body.children[0]);
          fixVideo(video);
        }

        loadOptions.promise.then(function (txt) {
          _this2._textures[i] = txt;
          console.log(txt);
          txt.minFilter = LinearFilter;
        });

        return video;
      });
      return Promise.resolve();
    }
  }, {
    key: "play",
    value: function play() {
      if (this._elements.length > 0) {
        this._elements[0].play();
      }
    }
  }, {
    key: "update",
    value: function update() {
      get(Video.prototype.__proto__ || Object.getPrototypeOf(Video.prototype), "update", this).call(this);
      for (var i = 0; i < this._textures.length; ++i) {
        if (this._textures[i]) {
          var elem = this._elements[i];
          if (elem.currentTime !== this._lastTime) {
            this._textures[i].needsUpdate = true;
            this._lastTime = elem.currentTime;
          }
        }
      }
    }
  }]);
  return Video;
}(BaseTextured);

function camera(index, options) {
  options = Object.assign({
    width: 1,
    height: 768 / 1280,
    unshaded: true,
    transparent: true,
    opacity: 0.5
  }, options);
  return navigator.mediaDevices.enumerateDevices().catch(console.error.bind(console, "ERR [enumerating devices]:>")).then(function (devices) {
    return devices.filter(function (d) {
      return d.kind === "videoinput";
    })[index];
  }).catch(console.error.bind(console, "ERR [filtering devices]:>")).then(function (device) {
    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: device.deviceId,
        width: { ideal: 1280 },
        height: { ideal: 768 }
      }
    });
  }).catch(console.error.bind(console, "ERR [getting media access]:>")).then(function (stream) {
    return new Video(stream, options).ready;
  }).catch(console.error.bind(console, "ERR [creating image]:>"));
}

function circle(r, sections, start, end) {
  r = r || 1;
  sections = sections || 18;
  return cache("CircleBufferGeometry(" + r + ", " + sections + ", " + start + ", " + end + ")", function () {
    return new CircleBufferGeometry(r, sections, start, end);
  });
}

function cloud(verts, c, s) {
  var geom = new Geometry();
  for (var i = 0; i < verts.length; ++i) {
    geom.vertices.push(verts[i]);
  }
  var mat = cache("PointsMaterial(" + c + ", " + s + ")", function () {
    return new PointsMaterial({
      color: c,
      size: s
    });
  });
  return new Points(geom, mat);
}

function cylinder(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd) {
  if (rT === undefined) {
    rT = 0.5;
  }
  if (rB === undefined) {
    rB = 0.5;
  }
  if (height === undefined) {
    height = 1;
  }
  return cache("CylinderBufferGeometry(" + rT + ", " + rB + ", " + height + ", " + rS + ", " + hS + ", " + openEnded + ", " + thetaStart + ", " + thetaEnd + ")", function () {
    return new CylinderBufferGeometry(rT, rB, height, rS, hS, openEnded, thetaStart, thetaEnd);
  });
}

function light(color, intensity, distance, decay) {
  return new PointLight(color, intensity, distance, decay);
}

function quat(x, y, z, w) {
  return new Quaternion(x, y, z, w);
}

function identity(obj) {
  return obj;
}

function range(n, m, s, t) {
  var n2 = s && n || 0,
      m2 = s && m || n,
      s2 = t && s || 1;
  var t2 = t || s || m,
      output = null;

  if (!(t2 instanceof Function)) {
    t2 = identity;
  }

  for (var i = n2; i < m2; i += s2) {
    var value = t2(i);
    if (output === null && value !== undefined) {
      output = [];
    }
    if (output !== null) {
      output.push(value);
    }
  }
  if (output !== null) {
    return output;
  }
}

function ring(rInner, rOuter, sectors, rings, start, end) {
  if (rInner === undefined) {
    rInner = 0.5;
  }
  sectors = sectors || 18;
  rings = rings || 1;
  rOuter = rOuter || 1;
  start = start || 0;
  end = end || 2 * Math.PI;
  return cache("RingBufferGeometry(" + rInner + ", " + rOuter + ", " + sectors + ", " + rings + ", " + start + ", " + end + ")", function () {
    return new RingBufferGeometry(rInner, rOuter, sectors, rings, start, end);
  });
}

function raycaster() {
  return new Raycaster();
}

function sphere(r, slices, rings) {
  return cache("SphereGeometry(" + r + ", " + slices + ", " + rings + ")", function () {
    return new SphereGeometry(r, slices, rings);
  });
}

function v2(x, y) {
  return new Vector2(x, y);
}

function v3(x, y, z) {
  return new Vector3(x, y, z);
}

function v4(x, y, z, w) {
  return new Vector4(x, y, z, w);
}

var index$2 = {
  axis: axis,
  box: box,
  brick: brick,
  camera: camera,
  circle: circle,
  cloud: cloud,
  colored: colored,
  cylinder: cylinder,
  hub: hub,
  light: light,
  material: material,
  quad: quad,
  quat: quat,
  range: range,
  ring: ring,
  shell: shell,
  raycaster: raycaster,
  sphere: sphere,
  textured: textured,
  v2: v2,
  v3: v3,
  v4: v4
};

var liveAPI = Object.freeze({
	axis: axis,
	box: box,
	brick: brick,
	camera: camera,
	circle: circle,
	cloud: cloud,
	colored: colored,
	cylinder: cylinder,
	hub: hub,
	light: light,
	material: material,
	quad: quad,
	quat: quat,
	range: range,
	ring: ring,
	shell: shell,
	raycaster: raycaster,
	sphere: sphere,
	textured: textured,
	v2: v2,
	v3: v3,
	v4: v4,
	default: index$2
});

function findProperty(elem, arr) {
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] in elem) {
      return arr[i];
    }
  }
}

var AsyncLockRequest = function () {
  function AsyncLockRequest(name, elementOpts, changeEventOpts, errorEventOpts, requestMethodOpts, exitMethodOpts) {
    classCallCheck(this, AsyncLockRequest);


    this.name = name;

    this._elementName = findProperty(document, elementOpts);
    this._requestMethodName = findProperty(document.documentElement, requestMethodOpts);
    this._exitMethodName = findProperty(document, exitMethodOpts);
    this._changeTimeout = null;

    this._changeEventName = findProperty(document, changeEventOpts);
    this._errorEventName = findProperty(document, errorEventOpts);
    this._changeEventName = this._changeEventName && this._changeEventName.substring(2);
    this._errorEventName = this._errorEventName && this._errorEventName.substring(2);

    this._events = {
      change: this._changeEventName,
      error: this._errorEventName
    };

    this.exit = this.exit.bind(this);
    this.request = this.request.bind(this);
  }

  createClass(AsyncLockRequest, [{
    key: "addEventListener",
    value: function addEventListener(name, thunk, bubbles) {
      if (this._events[name]) {
        document.addEventListener(this._events[name], thunk, bubbles);
      }
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(name, thunk) {
      if (this._events[name]) {
        document.removeEventListener(this._events[name], thunk);
      }
    }
  }, {
    key: "addChangeListener",
    value: function addChangeListener(thunk, bubbles) {
      this.addEventListener("change", thunk, bubbles);
    }
  }, {
    key: "removeChangeListener",
    value: function removeChangeListener(thunk) {
      this.removeEventListener("change", thunk);
    }
  }, {
    key: "addErrorListener",
    value: function addErrorListener(thunk, bubbles) {
      this.addEventListener("error", thunk, bubbles);
    }
  }, {
    key: "removeErrorListener",
    value: function removeErrorListener(thunk) {
      this.removeEventListener("error", thunk);
    }
  }, {
    key: "_withChange",
    value: function _withChange(act) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var onSuccess = function onSuccess() {
          setTimeout(tearDown);
          resolve(_this.element);
        },
            onError = function onError(evt) {
          setTimeout(tearDown);
          reject(evt);
        },
            stop = function stop() {
          if (_this._changeTimeout) {
            clearTimeout(_this._changeTimeout);
            _this._changeTimeout = null;
          }
        },
            tearDown = function tearDown() {
          stop();
          _this.removeChangeListener(onSuccess);
          _this.removeErrorListener(onError);
        };

        _this.addChangeListener(onSuccess, false);
        _this.addErrorListener(onError, false);

        if (act()) {
          // we've already gotten lock, so don't wait for it.
          onSuccess();
        } else {
          // Timeout waiting on the lock to happen, for systems like iOS that
          // don't properly support it, even though they say they do.
          stop();
          _this._changeTimeout = setTimeout(function () {
            return onError(name + " state did not change in allotted time");
          }, 1000);
        }
      });
    }
  }, {
    key: "request",
    value: function request(elem, extraParam) {
      var _this2 = this;

      return this._withChange(function () {
        if (!_this2._requestMethodName) {
          throw new Error("No " + _this2.name + " API support.");
        } else if (_this2.isActive) {
          return true;
        } else if (extraParam) {
          elem[_this2._requestMethodName](extraParam);
        } else {
          elem[_this2._requestMethodName]();
        }
      });
    }
  }, {
    key: "exit",
    value: function exit() {
      var _this3 = this;

      return this._withChange(function () {
        if (!_this3._exitMethodName) {
          throw new Error("No " + name + " API support.");
        } else if (!_this3.isActive) {
          return true;
        } else {
          document[_this3._exitMethodName]();
        }
      });
    }
  }, {
    key: "element",
    get: function get$$1() {
      return document[this._elementName];
    }
  }, {
    key: "isActive",
    get: function get$$1() {
      return !!this.element;
    }
  }]);
  return AsyncLockRequest;
}();

function deleteSetting(settingName) {
  if (window.localStorage) {
    window.localStorage.removeItem(settingName);
  }
}

var FullScreenLockRequest = function (_AsyncLockRequest) {
  inherits(FullScreenLockRequest, _AsyncLockRequest);

  function FullScreenLockRequest() {
    classCallCheck(this, FullScreenLockRequest);

    var _this = possibleConstructorReturn(this, (FullScreenLockRequest.__proto__ || Object.getPrototypeOf(FullScreenLockRequest)).call(this, "Fullscreen", ["fullscreenElement", "msFullscreenElement", "mozFullScreenElement", "webkitFullscreenElement"], ["onfullscreenchange", "onmsfullscreenchange", "onmozfullscreenchange", "onwebkitfullscreenchange"], ["onfullscreenerror", "onmsfullscreenerror", "onmozfullscreenerror", "onwebkitfullscreenerror"], ["requestFullscreen", "msRequestFullscreen", "mozRequestFullScreen", "webkitRequestFullscreen"], ["exitFullscreen", "msExitFullscreen", "mozExitFullScreen", "webkitExitFullscreen"]));
    // Notice the spelling difference for the Mozilla cases. They require a capital S for Screen.


    _this._fullScreenEnabledProperty = findProperty(document, ["fullscreenEnabled", "msFullscreenEnabled", "mozFullScreenEnabled", "webkitFullscreenEnabled"]);
    return _this;
  }

  createClass(FullScreenLockRequest, [{
    key: "available",
    get: function get$$1() {
      return !!(this._fullScreenEnabledProperty && document[this._fullScreenEnabledProperty]);
    }
  }]);
  return FullScreenLockRequest;
}(AsyncLockRequest);

var FullScreen = new FullScreenLockRequest();

function getSetting(settingName, defValue) {
  if (window.localStorage) {
    var val = window.localStorage.getItem(settingName);
    if (val) {
      try {
        return JSON.parse(val);
      } catch (exp) {
        console.error("getSetting", settingName, val, typeof val === "undefined" ? "undefined" : _typeof(val), exp);
        console.error(exp);
        console.error("getSetting", settingName, val, typeof val === "undefined" ? "undefined" : _typeof(val));
      }
    }
  }
  return defValue;
}

function immutable(value) {
  var getter = typeof value === "function" ? value : function () {
    return value;
  };
  return {
    enumerable: true,
    configurable: true,
    get: getter,
    set: function set() {
      throw new Error("This value is immutable and may only be read, not written.");
    }
  };
}

var MIN_TIMESTEP = 0.001;
var MAX_TIMESTEP = 1;

function isTimestampDeltaValid(timestampDeltaS) {
  return !isNaN(timestampDeltaS) && MIN_TIMESTEP < timestampDeltaS && timestampDeltaS <= MAX_TIMESTEP;
}

function mutable(value, type) {
  if (!type) {
    return {
      enumerable: true,
      configurable: true,
      get: function get$$1() {
        return value;
      },
      set: function set$$1(v) {
        value = v;
      }
    };
  } else if (typeof type === "function") {
    return {
      enumerable: true,
      configurable: true,
      get: function get$$1() {
        return value;
      },
      set: function set$$1(v) {
        if (v instanceof type) {
          throw new Error("Value must be a " + type + ": " + v);
        }
        value = v;
      }
    };
  } else {
    return {
      enumerable: true,
      configurable: true,
      get: function get$$1() {
        return value;
      },
      set: function set$$1(v) {
        var t = typeof v === "undefined" ? "undefined" : _typeof(v);
        if (t !== type) {
          throw new Error("Value must be a " + type + ". An " + t + " was provided instead: " + v);
        }
        value = v;
      }
    };
  }
}

function lock(element) {
  var type = screen.orientation && screen.orientation.type || screen.mozOrientation || "";
  if (type.indexOf("landscape") === -1) {
    type = "landscape-primary";
  }
  if (screen.orientation && screen.orientation.lock) {
    return screen.orientation.lock(type);
  } else if (screen.mozLockOrientation) {
    var locked = screen.mozLockOrientation(type);
    if (locked) {
      return Promise.resolve(element);
    }
  } else {
    return Promise.reject(new Error("Pointer lock not supported."));
  }
}

function unlock() {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  } else if (screen.mozUnlockOrientation) {
    screen.mozUnlockOrientation();
  }
}

var Orientation = {
  lock: lock,
  unlock: unlock
};

var PointerLock = new AsyncLockRequest("Pointer Lock", ["pointerLockElement", "mozPointerLockElement", "webkitPointerLockElement"], ["onpointerlockchange", "onmozpointerlockchange", "onwebkitpointerlockchange"], ["onpointerlockerror", "onmozpointerlockerror", "onwebkitpointerlockerror"], ["requestPointerLock", "mozRequestPointerLock", "webkitRequestPointerLock", "webkitRequestPointerLock"], ["exitPointerLock", "mozExitPointerLock", "webkitExitPointerLock", "webkitExitPointerLock"]);

function setSetting(settingName, val) {
  if (window.localStorage && val) {
    try {
      window.localStorage.setItem(settingName, JSON.stringify(val));
    } catch (exp) {
      console.error("setSetting", settingName, val, typeof val === "undefined" ? "undefined" : _typeof(val), exp);
    }
  }
}

function standardUnlockBehavior() {
  if (isMobile) {
    Orientation.unlock();
    return Promise.resolve();
  } else {
    return PointerLock.exit().catch(function (exp) {
      return console.warn("PointerLock exit failed", exp);
    });
  }
}

function standardExitFullScreenBehavior() {
  return standardUnlockBehavior().then(function () {
    return FullScreen.exit();
  }).catch(function (exp) {
    return console.warn("FullScreen failed", exp);
  });
}

function standardLockBehavior(elem) {
  if (isiOS) {
    return Promise.resolve(elem);
  } else if (isMobile) {
    return Orientation.lock(elem).catch(function (exp) {
      return console.warn("OrientationLock failed", exp);
    });
  } else {
    return PointerLock.request(elem).catch(function (exp) {
      return console.warn("PointerLock failed", exp);
    });
  }
}

function standardFullScreenBehavior(elem) {
  return FullScreen.request(elem).catch(function (exp) {
    return console.warn("FullScreen failed", exp);
  }).then(standardLockBehavior);
}

var Workerize = function (_EventDispatcher) {
  inherits(Workerize, _EventDispatcher);
  createClass(Workerize, null, [{
    key: "createWorker",
    value: function createWorker(script, stripFunc) {

      if (typeof script === "function") {
        script = script.toString();
      }

      if (stripFunc) {
        script = script.trim();
        var start = script.indexOf('{');
        script = script.substring(start + 1, script.length - 1);
      }

      var blob = new Blob([script], {
        type: "text/javascript"
      }),
          dataURI = URL.createObjectURL(blob);

      return new Worker(dataURI);
    }
  }]);

  function Workerize(func) {
    classCallCheck(this, Workerize);

    // First, rebuild the script that defines the class. Since we're dealing
    // with pre-ES6 browsers, we have to use ES5 syntax in the script, or invoke
    // a conversion at a point post-script reconstruction, pre-workerization.

    // start with the constructor function
    var _this = possibleConstructorReturn(this, (Workerize.__proto__ || Object.getPrototypeOf(Workerize)).call(this));

    var script = func.toString(),

    // strip out the name in a way that Internet Explorer also understands
    // (IE doesn't have the Function.name property supported by Chrome and
    // Firefox)
    matches = script.match(/function\s+(\w+)\s*\(/),
        name = matches[1],
        k;

    // then rebuild the member methods
    for (k in func.prototype) {
      // We preserve some formatting so it's easy to read the code in the debug
      // view. Yes, you'll be able to see the generated code in your browser's
      // debugger.
      script += "\n\n" + name + ".prototype." + k + " = " + func.prototype[k].toString() + ";";
    }

    // Automatically instantiate an object out of the class inside the worker,
    // in such a way that the user-defined function won't be able to get to it.
    script += "\n\n(function(){\n  var instance = new " + name + "(true);";

    // Create a mapper from the events that the class defines to the worker-side
    // postMessage method, to send message to the UI thread that one of the
    // events occured.
    script += "\n  if(instance.addEventListener){\n" + "    self.args = [null, null];\n" + "    for(var k in instance.listeners) {\n" + "      instance.addEventListener(k, function(eventName, args){\n" + "        self.args[0] = eventName;\n" + "        self.args[1] = args;\n" + "        postMessage(self.args);\n" + "      }.bind(this, k));\n" + "    }\n" + "  }";

    // Create a mapper from the worker-side onmessage event, to receive messages
    // from the UI thread that methods were called on the object.
    script += "\n\n  onmessage = function(evt){\n" + "    var f = evt.data[0],\n" + "        t = instance[f];\n" + "    if(t){\n" + "      t.call(instance, evt.data[1]);\n" + "    }\n" + "  };\n\n" + "})();";

    // The binary-large-object can be used to convert the script from text to a
    // data URI, because workers can only be created from same-origin URIs.
    _this.worker = Workerize.createWorker(script, false);

    _this.args = [null, null];

    _this.worker.onmessage = function (e) {
      return _this.emit(e.data[0], e.data[1]);
    };

    // create mappers from the UI-thread side method calls to the UI-thread side
    // postMessage method, to inform the worker thread that methods were called,
    // with parameters.
    for (k in func.prototype) {
      // we skip the addEventListener method because we override it in a
      // different way, to be able to pass messages across the thread boundary.
      if (k !== "addEventListener" && k[0] !== '_') {
        // make the name of the function the first argument, no matter what.
        _this[k] = _this.methodShim.bind(_this, k);
      }
    }

    _this.ready = true;
    return _this;
  }

  createClass(Workerize, [{
    key: "methodShim",
    value: function methodShim(eventName, args) {

      this.args[0] = eventName;
      this.args[1] = args;
      this.worker.postMessage(this.args);
    }
  }]);
  return Workerize;
}(EventDispatcher);

var index$4 = {
  AsyncLockRequest: AsyncLockRequest,
  cache: cache,
  deleteSetting: deleteSetting,
  findProperty: findProperty,
  FullScreen: FullScreen,
  getSetting: getSetting,
  identity: identity,
  immutable: immutable,
  isTimestampDeltaValid: isTimestampDeltaValid,
  mutable: mutable,
  Orientation: Orientation,
  PointerLock: PointerLock,
  setSetting: setSetting,
  standardExitFullScreenBehavior: standardExitFullScreenBehavior,
  standardFullScreenBehavior: standardFullScreenBehavior,
  standardLockBehavior: standardLockBehavior,
  standardUnlockBehavior: standardUnlockBehavior,
  Workerize: Workerize
};

var util = Object.freeze({
	AsyncLockRequest: AsyncLockRequest,
	cache: cache,
	deleteSetting: deleteSetting,
	findProperty: findProperty,
	FullScreen: FullScreen,
	getSetting: getSetting,
	identity: identity,
	immutable: immutable,
	isTimestampDeltaValid: isTimestampDeltaValid,
	mutable: mutable,
	Orientation: Orientation,
	PointerLock: PointerLock,
	setSetting: setSetting,
	standardExitFullScreenBehavior: standardExitFullScreenBehavior,
	standardFullScreenBehavior: standardFullScreenBehavior,
	standardLockBehavior: standardLockBehavior,
	standardUnlockBehavior: standardUnlockBehavior,
	Workerize: Workerize,
	default: index$4
});

BufferGeometry.prototype.center = Geometry.prototype.center = function () {
  this.computeBoundingBox();
  var b = this.boundingBox,
      dx = (b.max.x + b.min.x) / 2,
      dy = (b.max.y + b.min.y) / 2,
      dz = (b.max.z + b.min.z) / 2;
  return this.offset(-dx, -dy, -dz);
};

BufferGeometry.prototype.colored = Geometry.prototype.colored = Mesh.prototype.colored = function (color, options) {
  return colored(this, color, options);
};

CubeTextureLoader.prototype.load = function (urls, onLoad, onProgress, onError) {
  var texture = new CubeTexture();
  var loader = new ImageLoader(this.manager);
  loader.setCrossOrigin(this.crossOrigin);
  loader.setPath(this.path);
  var loaded = 0;

  for (var i = 0; i < urls.length; ++i) {
    loader.load(urls[i], function (image) {
      texture.images[i] = image;
      ++loaded;
      if (loaded === 6) {
        texture.needsUpdate = true;
        if (onLoad) onLoad(texture);
      }
    }.bind(null, i), onProgress, onError);
  }

  return texture;
};

Object3D.prototype.emit = EventDispatcher.prototype.emit = function (evt, obj) {
  if (!obj) {
    obj = {};
  }

  if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && !(obj instanceof Event)) {
    obj.type = evt;

    if (obj.defaultPrevented === undefined) {
      obj.defaultPrevented = false;
      obj.preventDefault = function () {
        return obj.defaultPrevented = true;
      };
    }
  }

  this.dispatchEvent(obj);
};

Object3D.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent = function (evt) {
  if (this._listeners === undefined) {
    return;
  }

  var listeners = this._listeners;
  var listenerArray = listeners[evt.type];

  if (listenerArray !== undefined) {

    if (!(evt instanceof Event)) {
      evt.target = this;
    }

    var array = [],
        i = 0;
    var length = listenerArray.length;

    for (i = 0; i < length; i++) {

      array[i] = listenerArray[i];
    }

    for (i = 0; i < length; i++) {

      array[i].call(this, evt);
    }
  }
};

Object3D.prototype.watch = EventDispatcher.prototype.watch = function (child, events) {
  var _this = this;

  if (!(events instanceof Array)) {
    events = [events];
  }
  events.forEach(function (event) {
    return child.addEventListener(event, _this.dispatchEvent.bind(_this));
  });
  return this;
};

Object3D.prototype.route = EventDispatcher.prototype.route = function (events, listener) {
  var _this2 = this;

  events.forEach(function (event) {
    return _this2.addEventListener(event, listener);
  });
  return this;
};

Object3D.prototype.on = EventDispatcher.prototype.on = function (event, listener) {
  this.addEventListener(event, listener);
  return this;
};

Matrix4.prototype.toString = function (digits) {
  if (digits === undefined) {
    digits = 10;
  }
  this.transpose();
  var parts = this.toArray();
  this.transpose();
  if (digits !== undefined) {
    for (var i = 0; i < parts.length; ++i) {}
  }
  var output = "";
  for (var _i = 0; _i < parts.length; ++_i) {
    if (_i % 4 === 0) {
      output += "| ";
    }
    if (Math.sign(parts[_i]) === -1) {
      output += "-";
    } else {
      output += " ";
    }

    if (parts[_i] !== null && parts[_i] !== undefined) {
      output += Math.abs(parts[_i]).toFixed(digits);
    } else {
      output += "undefined".substring(0, digits);
    }

    if (_i % 4 === 3) {
      output += " |\n";
    } else {
      output += ", ";
    }
  }
  return output;
};

/**
 * Loads a Wavefront .mtl file specifying materials
 *
 * @author angelxuanchang
 *
 * Converted to ES2015 by @capnmidnight
 *
 */
var MTLLoader = function (_EventDispatcher) {
  inherits(MTLLoader, _EventDispatcher);

  function MTLLoader(manager) {
    classCallCheck(this, MTLLoader);

    var _this = possibleConstructorReturn(this, (MTLLoader.__proto__ || Object.getPrototypeOf(MTLLoader)).call(this));

    _this.manager = manager !== undefined ? manager : DefaultLoadingManager;

    return _this;
  }

  /**
   * Loads and parses a MTL asset from a URL.
   *
   * @param {String} url - URL to the MTL file.
   * @param {Function} [onLoad] - Callback invoked with the loaded object.
   * @param {Function} [onProgress] - Callback for download progress.
   * @param {Function} [onError] - Callback for download errors.
   *
   * @see setPath setTexturePath
   *
   * @note In order for relative texture references to resolve correctly
   * you must call setPath and/or setTexturePath explicitly prior to load.
   */


  createClass(MTLLoader, [{
    key: 'load',
    value: function load(url, onLoad, onProgress, onError) {

      var scope = this;

      var loader = new FileLoader(this.manager);
      loader.setPath(this.path);
      loader.load(url, function (text) {

        onLoad(scope.parse(text));
      }, onProgress, onError);
    }

    /**
     * Set base path for resolving references.
     * If set this path will be prepended to each loaded and found reference.
     *
     * @see setTexturePath
     * @param {String} path
     *
     * @example
     *     mtlLoader.setPath( 'assets/obj/' );
     *     mtlLoader.load( 'my.mtl', ... );
     */

  }, {
    key: 'setPath',
    value: function setPath(path) {

      this.path = path;
    }

    /**
     * Set base path for resolving texture references.
     * If set this path will be prepended found texture reference.
     * If not set and setPath is, it will be used as texture base path.
     *
     * @see setPath
     * @param {String} path
     *
     * @example
     *     mtlLoader.setPath( 'assets/obj/' );
     *     mtlLoader.setTexturePath( 'assets/textures/' );
     *     mtlLoader.load( 'my.mtl', ... );
     */

  }, {
    key: 'setTexturePath',
    value: function setTexturePath(path) {

      this.texturePath = path;
    }
  }, {
    key: 'setBaseUrl',
    value: function setBaseUrl(path) {

      console.warn('MTLLoader: .setBaseUrl() is deprecated. Use .setTexturePath( path ) for texture path or .setPath( path ) for general base path instead.');

      this.setTexturePath(path);
    }
  }, {
    key: 'setCrossOrigin',
    value: function setCrossOrigin(value) {

      this.crossOrigin = value;
    }
  }, {
    key: 'setMaterialOptions',
    value: function setMaterialOptions(value) {

      this.materialOptions = value;
    }

    /**
     * Parses a MTL file.
     *
     * @param {String} text - Content of MTL file
     * @return {MTLLoader.MaterialCreator}
     *
     * @see setPath setTexturePath
     *
     * @note In order for relative texture references to resolve correctly
     * you must call setPath and/or setTexturePath explicitly prior to parse.
     */

  }, {
    key: 'parse',
    value: function parse(text) {

      var lines = text.split('\n');
      var info = {};
      var delimiter_pattern = /\s+/;
      var materialsInfo = {};

      for (var i = 0; i < lines.length; i++) {

        var line = lines[i];
        line = line.trim();

        if (line.length === 0 || line.charAt(0) === '#') {

          // Blank line or comment ignore
          continue;
        }

        var pos = line.indexOf(' ');

        var key = pos >= 0 ? line.substring(0, pos) : line;
        key = key.toLowerCase();

        var value = pos >= 0 ? line.substring(pos + 1) : '';
        value = value.trim();

        if (key === 'newmtl') {

          // New material

          info = { name: value };
          materialsInfo[value] = info;
        } else if (info) {

          if (key === 'ka' || key === 'kd' || key === 'ks') {

            var ss = value.split(delimiter_pattern, 3);
            info[key] = [parseFloat(ss[0]), parseFloat(ss[1]), parseFloat(ss[2])];
          } else {

            info[key] = value;
          }
        }
      }

      var materialCreator = new MaterialCreator(this.texturePath || this.path, this.materialOptions);
      materialCreator.setCrossOrigin(this.crossOrigin);
      materialCreator.setManager(this.manager);
      materialCreator.setMaterials(materialsInfo);
      return materialCreator;
    }
  }]);
  return MTLLoader;
}(EventDispatcher);

/**
 * Create a new MTLLoader.MaterialCreator
 * @param baseUrl - Url relative to which textures are loaded
 * @param options - Set of options on how to construct the materials
 *                  side: Which side to apply the material
 *                        THREE.FrontSide (default), THREE.BackSide, THREE.DoubleSide
 *                  wrap: What type of wrapping to apply for textures
 *                        THREE.RepeatWrapping (default), THREE.ClampToEdgeWrapping, THREE.MirroredRepeatWrapping
 *                  normalizeRGB: RGBs need to be normalized to 0-1 from 0-255
 *                                Default: false, assumed to be already normalized
 *                  ignoreZeroRGBs: Ignore values of RGBs (Ka,Kd,Ks) that are all 0's
 *                                  Default: false
 * @constructor
 */

var MaterialCreator = function () {
  function MaterialCreator(baseUrl, options) {
    classCallCheck(this, MaterialCreator);


    this.baseUrl = baseUrl || '';
    this.options = options;
    this.materialsInfo = {};
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};

    this.side = this.options && this.options.side ? this.options.side : FrontSide;
    this.wrap = this.options && this.options.wrap ? this.options.wrap : RepeatWrapping;
  }

  createClass(MaterialCreator, [{
    key: 'setCrossOrigin',
    value: function setCrossOrigin(value) {

      this.crossOrigin = value;
    }
  }, {
    key: 'setManager',
    value: function setManager(value) {

      this.manager = value;
    }
  }, {
    key: 'setMaterials',
    value: function setMaterials(materialsInfo) {

      this.materialsInfo = this.convert(materialsInfo);
      this.materials = {};
      this.materialsArray = [];
      this.nameLookup = {};
    }
  }, {
    key: 'convert',
    value: function convert(materialsInfo) {

      if (!this.options) return materialsInfo;

      var converted = {};

      for (var mn in materialsInfo) {

        // Convert materials info into normalized form based on options

        var mat = materialsInfo[mn];

        var covmat = {};

        converted[mn] = covmat;

        for (var prop in mat) {

          var save = true;
          var value = mat[prop];
          var lprop = prop.toLowerCase();

          switch (lprop) {

            case 'kd':
            case 'ka':
            case 'ks':

              // Diffuse color (color under white light) using RGB values

              if (this.options && this.options.normalizeRGB) {

                value = [value[0] / 255, value[1] / 255, value[2] / 255];
              }

              if (this.options && this.options.ignoreZeroRGBs) {

                if (value[0] === 0 && value[1] === 0 && value[2] === 0) {

                  // ignore

                  save = false;
                }
              }

              break;

            default:

              break;
          }

          if (save) {

            covmat[lprop] = value;
          }
        }
      }

      return converted;
    }
  }, {
    key: 'preload',
    value: function preload() {

      for (var mn in this.materialsInfo) {

        this.create(mn);
      }
    }
  }, {
    key: 'getIndex',
    value: function getIndex(materialName) {

      return this.nameLookup[materialName];
    }
  }, {
    key: 'getAsArray',
    value: function getAsArray() {

      var index = 0;

      for (var mn in this.materialsInfo) {

        this.materialsArray[index] = this.create(mn);
        this.nameLookup[mn] = index;
        index++;
      }

      return this.materialsArray;
    }
  }, {
    key: 'create',
    value: function create(materialName) {

      if (this.materials[materialName] === undefined) {

        this.createMaterial_(materialName);
      }

      return this.materials[materialName];
    }
  }, {
    key: 'createMaterial_',
    value: function createMaterial_(materialName) {

      // Create material

      var TMaterial = MeshPhongMaterial;
      var scope = this;
      var mat = this.materialsInfo[materialName];
      var params = {

        name: materialName,
        side: this.side

      };

      var resolveURL = function resolveURL(baseUrl, url) {

        if (typeof url !== 'string' || url === '') return '';

        // Absolute URL
        if (/^https?:\/\//i.test(url)) {
          return url;
        }

        return baseUrl + url;
      };

      function setMapForType(mapType, value) {

        if (params[mapType]) return; // Keep the first encountered texture

        var texParams = scope.getTextureParams(value, params);
        var map = scope.loadTexture(resolveURL(scope.baseUrl, texParams.url));

        map.repeat.copy(texParams.scale);
        map.offset.copy(texParams.offset);

        map.wrapS = scope.wrap;
        map.wrapT = scope.wrap;

        params[mapType] = map;
      }

      for (var prop in mat) {

        var value = mat[prop];

        if (value === '') continue;

        switch (prop.toLowerCase()) {

          // Ns is material specular exponent

          case 'kd':

            // Diffuse color (color under white light) using RGB values

            params.color = new Color().fromArray(value);

            break;

          case 'ks':

            // Specular color (color when light is reflected from shiny surface) using RGB values
            params.specular = new Color().fromArray(value);

            break;

          case 'map_kd':

            // Diffuse texture map

            setMapForType("map", value);

            break;

          case 'map_ks':

            // Specular map

            setMapForType("specularMap", value);

            break;

          case 'map_bump':
          case 'bump':

            // Bump texture map

            setMapForType("bumpMap", value);

            break;

          case 'ns':

            // The specular exponent (defines the focus of the specular highlight)
            // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

            params.shininess = parseFloat(value);

            break;

          case 'd':

            if (value < 1) {

              params.opacity = value;
              params.transparent = true;
            }

            break;

          case 'illum':

            value = parseFloat(value);

            if (value === MTLLoader.COLOR_ON_AND_AMBIENT_OFF) {

              TMaterial = MeshBasicMaterial;
            }

            break;

          case 'Tr':

            if (value > 0) {

              params.opacity = 1 - value;
              params.transparent = true;
            }

            break;

          default:
            break;

        }
      }

      if (TMaterial === MeshBasicMaterial) {

        ["shininess", "specular"].forEach(function (attribute) {

          if (attribute in params) {

            delete params[attribute];
          }
        });
      }

      this.materials[materialName] = new TMaterial(params);
      return this.materials[materialName];
    }
  }, {
    key: 'getTextureParams',
    value: function getTextureParams(value, matParams) {

      var texParams = {

        scale: new Vector2(1, 1),
        offset: new Vector2(0, 0)

      };

      var items = value.split(/\s+/);
      var pos;

      pos = items.indexOf('-bm');
      if (pos >= 0) {

        matParams.bumpScale = parseFloat(items[pos + 1]);
        items.splice(pos, 2);
      }

      pos = items.indexOf('-s');
      if (pos >= 0) {

        texParams.scale.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
        items.splice(pos, 4); // we expect 3 parameters here!
      }

      pos = items.indexOf('-o');
      if (pos >= 0) {

        texParams.offset.set(parseFloat(items[pos + 1]), parseFloat(items[pos + 2]));
        items.splice(pos, 4); // we expect 3 parameters here!
      }

      texParams.url = items.join(' ').trim();
      return texParams;
    }
  }, {
    key: 'loadTexture',
    value: function loadTexture(url, mapping, onLoad, onProgress, onError) {

      var texture;
      var loader = Loader.Handlers.get(url);
      var manager = this.manager !== undefined ? this.manager : DefaultLoadingManager;

      if (loader === null) {

        loader = new TextureLoader(manager);
      }

      if (loader.setCrossOrigin) loader.setCrossOrigin(this.crossOrigin);
      texture = loader.load(url, onLoad, onProgress, onError);

      if (mapping !== undefined) texture.mapping = mapping;

      return texture;
    }
  }]);
  return MaterialCreator;
}();



// http://paulbourke.net/dataformats/mtl/
Object.assign(MTLLoader, {
  COLOR_ON_AND_AMBIENT_OFF: 0,
  COLOR_ON_AND_AMBIENT_ON: 1,
  HIGHLIGHT_ON: 2,
  REFLECTION_ON_AND_RAY_TRACE_ON: 3,
  TRANSPARENCY_GLASS_ON_REFLECTION_RAY_TRACE_ON: 4,
  REFLECTION_FRESNEL_ON_AND_RAY_TRACE_ON: 5,
  TRANSPARENCY_REFRACTION_ON_REFLECTION_FRESNEL_OFF_AND_RAY_TRACE_ON: 6,
  TRANSPARENCY_REFRACTION_ON_REFLECTION_FRESNEL_ON_AND_RAY_TRACE_ON: 7,
  REFLECTION_ON_AND_RAY_TRACE_OFF: 8,
  TRANSPARENCY_GLASS_ON_REFLECTION_RAY_TRACE_OFF: 9,
  CASTS_SHADOWS_ONTO_INVISIBLE_SURFACES: 10
});

Object3D.prototype.appendChild = function (child) {
  return this.add(child);
};

Object.defineProperty(Object3D.prototype, "pickable", {
  get: function get() {
    return this._listeners && (this._listeners.enter && this._listeners.enter.length > 0 || this._listeners.exit && this._listeners.exit.length > 0 || this._listeners.select && this._listeners.select.length > 0 || this._listeners.useraction && this._listeners.useraction.length > 0 || this._listeners.pointerstart && this._listeners.pointerstart.length > 0 || this._listeners.pointerend && this._listeners.pointerend.length > 0 || this._listeners.pointermove && this._listeners.pointermove.length > 0 || this._listeners.gazestart && this._listeners.gazestart.length > 0 || this._listeners.gazecancel && this._listeners.gazecancel.length > 0 || this._listeners.gazemove && this._listeners.gazemove.length > 0 || this._listeners.gazecomplete && this._listeners.gazecomplete.length > 0);
  }
});

Object3D.prototype.latLng = function (lat, lon, r) {
  lat = -Math.PI * (lat || 0) / 180;
  lon = Math.PI * (lon || 0) / 180;
  r = r || 1.5;
  this.rotation.set(lat, lon, 0, "XYZ");
  this.position.set(0, 0, -r);
  this.position.applyQuaternion(this.quaternion);
  return this;
};

Object3D.prototype.named = function (name) {
  this.name = name;
  return this;
};

Object3D.prototype.addTo = function (obj) {
  obj.add(this);
  return this;
};

Object3D.prototype.at = function (x, y, z) {
  this.position.set(x, y, z);
  return this;
};

Object3D.prototype.rot = function (x, y, z) {
  this.rotation.set(x, y, z);
  return this;
};

Object3D.prototype.scl = function (x, y, z) {
  this.scale.set(x, y, z);
  return this;
};

Object.defineProperty(Object3D.prototype, "visible", {
  get: function get() {
    return this._visible;
  },
  set: function set(v) {
    var oldV = this._visible;
    this._visible = v;
    if (oldV !== v) {
      this.emit("visiblechanged");
    }
  }
});

/**
 * @author mrdoob / http://mrdoob.com/
 */

var OBJLoader = function () {
	function OBJLoader(manager) {
		classCallCheck(this, OBJLoader);


		this.manager = manager !== undefined ? manager : DefaultLoadingManager;

		this.materials = null;

		this.regexp = {
			// v float float float
			vertex_pattern: /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
			// vn float float float
			normal_pattern: /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
			// vt float float
			uv_pattern: /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
			// f vertex vertex vertex
			face_vertex: /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
			// f vertex/uv vertex/uv vertex/uv
			face_vertex_uv: /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
			// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
			face_vertex_uv_normal: /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
			// f vertex//normal vertex//normal vertex//normal
			face_vertex_normal: /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
			// o object_name | g group_name
			object_pattern: /^[og]\s*(.+)?/,
			// s boolean
			smoothing_pattern: /^s\s+(\d+|on|off)/,
			// mtllib file_reference
			material_library_pattern: /^mtllib /,
			// usemtl material_name
			material_use_pattern: /^usemtl /
		};
	}

	createClass(OBJLoader, [{
		key: 'load',
		value: function load(url, onLoad, onProgress, onError) {

			var scope = this;

			var loader = new FileLoader(scope.manager);
			loader.setPath(this.path);
			loader.load(url, function (text) {

				onLoad(scope.parse(text));
			}, onProgress, onError);
		}
	}, {
		key: 'setPath',
		value: function setPath(value) {

			this.path = value;
		}
	}, {
		key: 'setMaterials',
		value: function setMaterials(materials) {

			this.materials = materials;
		}
	}, {
		key: '_createParserState',
		value: function _createParserState() {

			var state = new OBJParserState();

			state.startObject('', false);

			return state;
		}
	}, {
		key: 'parse',
		value: function parse(text) {

			console.time('OBJLoader');

			var state = this._createParserState();

			if (text.indexOf('\r\n') !== -1) {

				// This is faster than String.split with regex that splits on both
				text = text.replace('\r\n', '\n');
			}

			var lines = text.split('\n');
			var line = '',
			    lineFirstChar = '',
			    lineSecondChar = '';
			var lineLength = 0;
			var result = [];

			// Faster to just trim left side of the line. Use if available.
			var trimLeft = typeof ''.trimLeft === 'function';

			for (var i = 0, l = lines.length; i < l; i++) {

				line = lines[i];

				line = trimLeft ? line.trimLeft() : line.trim();

				lineLength = line.length;

				if (lineLength === 0) continue;

				lineFirstChar = line.charAt(0);

				// @todo invoke passed in handler if any
				if (lineFirstChar === '#') continue;

				if (lineFirstChar === 'v') {

					lineSecondChar = line.charAt(1);

					if (lineSecondChar === ' ' && (result = this.regexp.vertex_pattern.exec(line)) !== null) {

						// 0                  1      2      3
						// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

						state.vertices.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
					} else if (lineSecondChar === 'n' && (result = this.regexp.normal_pattern.exec(line)) !== null) {

						// 0                   1      2      3
						// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

						state.normals.push(parseFloat(result[1]), parseFloat(result[2]), parseFloat(result[3]));
					} else if (lineSecondChar === 't' && (result = this.regexp.uv_pattern.exec(line)) !== null) {

						// 0               1      2
						// ["vt 0.1 0.2", "0.1", "0.2"]

						state.uvs.push(parseFloat(result[1]), parseFloat(result[2]));
					} else {

						throw new Error("Unexpected vertex/normal/uv line: '" + line + "'");
					}
				} else if (lineFirstChar === "f") {

					if ((result = this.regexp.face_vertex_uv_normal.exec(line)) !== null) {

						// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
						// 0                        1    2    3    4    5    6    7    8    9   10         11         12
						// ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

						state.addFace(result[1], result[4], result[7], result[10], result[2], result[5], result[8], result[11], result[3], result[6], result[9], result[12]);
					} else if ((result = this.regexp.face_vertex_uv.exec(line)) !== null) {

						// f vertex/uv vertex/uv vertex/uv
						// 0                  1    2    3    4    5    6   7          8
						// ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]

						state.addFace(result[1], result[3], result[5], result[7], result[2], result[4], result[6], result[8]);
					} else if ((result = this.regexp.face_vertex_normal.exec(line)) !== null) {

						// f vertex//normal vertex//normal vertex//normal
						// 0                     1    2    3    4    5    6   7          8
						// ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

						state.addFace(result[1], result[3], result[5], result[7], undefined, undefined, undefined, undefined, result[2], result[4], result[6], result[8]);
					} else if ((result = this.regexp.face_vertex.exec(line)) !== null) {

						// f vertex vertex vertex
						// 0            1    2    3   4
						// ["f 1 2 3", "1", "2", "3", undefined]

						state.addFace(result[1], result[2], result[3], result[4]);
					} else {

						throw new Error("Unexpected face line: '" + line + "'");
					}
				} else if (lineFirstChar === "l") {

					var lineParts = line.substring(1).trim().split(" ");
					var lineVertices = [],
					    lineUVs = [];

					if (line.indexOf("/") === -1) {

						lineVertices = lineParts;
					} else {

						for (var li = 0, llen = lineParts.length; li < llen; li++) {

							var parts = lineParts[li].split("/");

							if (parts[0] !== "") lineVertices.push(parts[0]);
							if (parts[1] !== "") lineUVs.push(parts[1]);
						}
					}
					state.addLineGeometry(lineVertices, lineUVs);
				} else if ((result = this.regexp.object_pattern.exec(line)) !== null) {

					// o object_name
					// or
					// g group_name

					var name = result[0].substr(1).trim();
					state.startObject(name);
				} else if (this.regexp.material_use_pattern.test(line)) {

					// material

					state.object.startMaterial(line.substring(7).trim(), state.materialLibraries);
				} else if (this.regexp.material_library_pattern.test(line)) {

					// mtl file

					state.materialLibraries.push(line.substring(7).trim());
				} else if ((result = this.regexp.smoothing_pattern.exec(line)) !== null) {

					// smooth shading

					// @todo Handle files that have varying smooth values for a set of faces inside one geometry,
					// but does not define a usemtl for each face set.
					// This should be detected and a dummy material created (later MultiMaterial and geometry groups).
					// This requires some care to not create extra material on each smooth value for "normal" obj files.
					// where explicit usemtl defines geometry groups.
					// Example asset: examples/models/obj/cerberus/Cerberus.obj

					var value = result[1].trim().toLowerCase();
					state.object.smooth = value === '1' || value === 'on';

					var material = state.object.currentMaterial();
					if (material) {

						material.smooth = state.object.smooth;
					}
				} else {

					// Handle null terminated files without exception
					if (line === '\0') continue;

					throw new Error("Unexpected line: '" + line + "'");
				}
			}

			state.finalize();

			var container = new Group();
			container.materialLibraries = [].concat(state.materialLibraries);

			for (var i = 0, l = state.objects.length; i < l; i++) {

				var object = state.objects[i];
				var geometry = object.geometry;
				var materials = object.materials;
				var isLine = geometry.type === 'Line';

				// Skip o/g line declarations that did not follow with any faces
				if (geometry.vertices.length === 0) continue;

				var buffergeometry = new BufferGeometry();

				buffergeometry.addAttribute('position', new BufferAttribute(new Float32Array(geometry.vertices), 3));

				if (geometry.normals.length > 0) {

					buffergeometry.addAttribute('normal', new BufferAttribute(new Float32Array(geometry.normals), 3));
				} else {

					buffergeometry.computeVertexNormals();
				}

				if (geometry.uvs.length > 0) {

					buffergeometry.addAttribute('uv', new BufferAttribute(new Float32Array(geometry.uvs), 2));
				}

				// Create materials

				var createdMaterials = [];

				for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

					var sourceMaterial = materials[mi];
					var material = undefined;

					if (this.materials !== null) {

						material = this.materials.create(sourceMaterial.name);

						// mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
						if (isLine && material && !material.isLineBasicMaterial) {

							var materialLine = new LineBasicMaterial();
							materialLine.copy(material);
							material = materialLine;
						}
					}

					if (!material) {

						material = !isLine ? new MeshPhongMaterial() : new LineBasicMaterial();
						material.name = sourceMaterial.name;
					}

					material.shading = sourceMaterial.smooth ? SmoothShading : FlatShading;

					createdMaterials.push(material);
				}

				// Create mesh

				var mesh;

				if (createdMaterials.length > 1) {

					for (var mi = 0, miLen = materials.length; mi < miLen; mi++) {

						var sourceMaterial = materials[mi];
						buffergeometry.addGroup(sourceMaterial.groupStart, sourceMaterial.groupCount, mi);
					}

					var multiMaterial = new MultiMaterial(createdMaterials);
					mesh = !isLine ? new Mesh(buffergeometry, multiMaterial) : new LineSegments(buffergeometry, multiMaterial);
				} else {

					mesh = !isLine ? new Mesh(buffergeometry, createdMaterials[0]) : new LineSegments(buffergeometry, createdMaterials[0]);
				}

				mesh.name = object.name;

				container.add(mesh);
			}

			console.timeEnd('OBJLoader');

			return container;
		}
	}]);
	return OBJLoader;
}();

var OBJParserState = function () {
	function OBJParserState() {
		classCallCheck(this, OBJParserState);

		this.objects = [];
		this.object = {};

		this.vertices = [];
		this.normals = [];
		this.uvs = [];

		this.materialLibraries = [];
	}

	createClass(OBJParserState, [{
		key: 'startObject',
		value: function startObject(name, fromDeclaration) {

			// If the current object (initial from reset) is not from a g/o declaration in the parsed
			// file. We need to use it for the first parsed g/o to keep things in sync.
			if (this.object && this.object.fromDeclaration === false) {

				this.object.name = name;
				this.object.fromDeclaration = fromDeclaration !== false;
				return;
			}

			if (this.object && typeof this.object._finalize === 'function') {

				this.object._finalize();
			}

			var previousMaterial = this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined;

			this.object = new OBJ(name, fromDeclaration);

			// Inherit previous objects material.
			// Spec tells us that a declared material must be set to all objects until a new material is declared.
			// If a usemtl declaration is encountered while this new object is being parsed, it will
			// overwrite the inherited material. Exception being that there was already face declarations
			// to the inherited material, then it will be preserved for proper MultiMaterial continuation.

			if (previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function") {

				var declared = previousMaterial.clone(0);
				declared.inherited = true;
				this.object.materials.push(declared);
			}

			this.objects.push(this.object);
		}
	}, {
		key: 'finalize',
		value: function finalize() {

			if (this.object && typeof this.object._finalize === 'function') {

				this.object._finalize();
			}
		}
	}, {
		key: 'parseVertexIndex',
		value: function parseVertexIndex(value, len) {

			var index = parseInt(value, 10);
			return (index >= 0 ? index - 1 : index + len / 3) * 3;
		}
	}, {
		key: 'parseNormalIndex',
		value: function parseNormalIndex(value, len) {

			var index = parseInt(value, 10);
			return (index >= 0 ? index - 1 : index + len / 3) * 3;
		}
	}, {
		key: 'parseUVIndex',
		value: function parseUVIndex(value, len) {

			var index = parseInt(value, 10);
			return (index >= 0 ? index - 1 : index + len / 2) * 2;
		}
	}, {
		key: 'addVertex',
		value: function addVertex(a, b, c) {

			var src = this.vertices;
			var dst = this.object.geometry.vertices;

			dst.push(src[a + 0]);
			dst.push(src[a + 1]);
			dst.push(src[a + 2]);
			dst.push(src[b + 0]);
			dst.push(src[b + 1]);
			dst.push(src[b + 2]);
			dst.push(src[c + 0]);
			dst.push(src[c + 1]);
			dst.push(src[c + 2]);
		}
	}, {
		key: 'addVertexLine',
		value: function addVertexLine(a) {

			var src = this.vertices;
			var dst = this.object.geometry.vertices;

			dst.push(src[a + 0]);
			dst.push(src[a + 1]);
			dst.push(src[a + 2]);
		}
	}, {
		key: 'addNormal',
		value: function addNormal(a, b, c) {

			var src = this.normals;
			var dst = this.object.geometry.normals;

			dst.push(src[a + 0]);
			dst.push(src[a + 1]);
			dst.push(src[a + 2]);
			dst.push(src[b + 0]);
			dst.push(src[b + 1]);
			dst.push(src[b + 2]);
			dst.push(src[c + 0]);
			dst.push(src[c + 1]);
			dst.push(src[c + 2]);
		}
	}, {
		key: 'addUV',
		value: function addUV(a, b, c) {

			var src = this.uvs;
			var dst = this.object.geometry.uvs;

			dst.push(src[a + 0]);
			dst.push(src[a + 1]);
			dst.push(src[b + 0]);
			dst.push(src[b + 1]);
			dst.push(src[c + 0]);
			dst.push(src[c + 1]);
		}
	}, {
		key: 'addUVLine',
		value: function addUVLine(a) {

			var src = this.uvs;
			var dst = this.object.geometry.uvs;

			dst.push(src[a + 0]);
			dst.push(src[a + 1]);
		}
	}, {
		key: 'addFace',
		value: function addFace(a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd) {

			var vLen = this.vertices.length;

			var ia = this.parseVertexIndex(a, vLen);
			var ib = this.parseVertexIndex(b, vLen);
			var ic = this.parseVertexIndex(c, vLen);
			var id;

			if (d === undefined) {

				this.addVertex(ia, ib, ic);
			} else {

				id = this.parseVertexIndex(d, vLen);

				this.addVertex(ia, ib, id);
				this.addVertex(ib, ic, id);
			}

			if (ua !== undefined) {

				var uvLen = this.uvs.length;

				ia = this.parseUVIndex(ua, uvLen);
				ib = this.parseUVIndex(ub, uvLen);
				ic = this.parseUVIndex(uc, uvLen);

				if (d === undefined) {

					this.addUV(ia, ib, ic);
				} else {

					id = this.parseUVIndex(ud, uvLen);

					this.addUV(ia, ib, id);
					this.addUV(ib, ic, id);
				}
			}

			if (na !== undefined) {

				// Normals are many times the same. If so, skip function call and parseInt.
				var nLen = this.normals.length;
				ia = this.parseNormalIndex(na, nLen);

				ib = na === nb ? ia : this.parseNormalIndex(nb, nLen);
				ic = na === nc ? ia : this.parseNormalIndex(nc, nLen);

				if (d === undefined) {

					this.addNormal(ia, ib, ic);
				} else {

					id = this.parseNormalIndex(nd, nLen);

					this.addNormal(ia, ib, id);
					this.addNormal(ib, ic, id);
				}
			}
		}
	}, {
		key: 'addLineGeometry',
		value: function addLineGeometry(vertices, uvs) {

			this.object.geometry.type = 'Line';

			var vLen = this.vertices.length;
			var uvLen = this.uvs.length;

			for (var vi = 0, l = vertices.length; vi < l; vi++) {

				this.addVertexLine(this.parseVertexIndex(vertices[vi], vLen));
			}

			for (var uvi = 0, l = uvs.length; uvi < l; uvi++) {

				this.addUVLine(this.parseUVIndex(uvs[uvi], uvLen));
			}
		}
	}]);
	return OBJParserState;
}();

var OBJ = function () {
	function OBJ(name, fromDeclaration) {
		classCallCheck(this, OBJ);


		this.name = name || '';
		this.fromDeclaration = fromDeclaration !== false;

		this.geometry = {
			vertices: [],
			normals: [],
			uvs: []
		};
		this.materials = [];
		this.smooth = true;
	}

	createClass(OBJ, [{
		key: 'startMaterial',
		value: function startMaterial(name, libraries) {

			var previous = this._finalize(false);

			// New usemtl declaration overwrites an inherited material, except if faces were declared
			// after the material, then it must be preserved for proper MultiMaterial continuation.
			if (previous && (previous.inherited || previous.groupCount <= 0)) {

				this.materials.splice(previous.index, 1);
			}

			var material = {
				index: this.materials.length,
				name: name || '',
				mtllib: Array.isArray(libraries) && libraries.length > 0 ? libraries[libraries.length - 1] : '',
				smooth: previous !== undefined ? previous.smooth : this.smooth,
				groupStart: previous !== undefined ? previous.groupEnd : 0,
				groupEnd: -1,
				groupCount: -1,
				inherited: false,

				clone: function clone(index) {
					return {
						index: typeof index === 'number' ? index : this.index,
						name: this.name,
						mtllib: this.mtllib,
						smooth: this.smooth,
						groupStart: this.groupEnd,
						groupEnd: -1,
						groupCount: -1,
						inherited: false
					};
				}
			};

			this.materials.push(material);

			return material;
		}
	}, {
		key: 'currentMaterial',
		value: function currentMaterial() {

			if (this.materials.length > 0) {
				return this.materials[this.materials.length - 1];
			}

			return undefined;
		}
	}, {
		key: '_finalize',
		value: function _finalize(end) {

			var lastMultiMaterial = this.currentMaterial();
			if (lastMultiMaterial && lastMultiMaterial.groupEnd === -1) {

				lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
				lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
				lastMultiMaterial.inherited = false;
			}

			// Guarantee at least one empty material, this makes the creation later more straight forward.
			if (end !== false && this.materials.length === 0) {
				this.materials.push({
					name: '',
					smooth: this.smooth
				});
			}

			return lastMultiMaterial;
		}
	}]);
	return OBJ;
}();

Geometry.prototype.offset = function (x, y, z) {
  var arr = this.vertices;
  for (var i = 0; i < arr.length; ++i) {
    var vert = arr[i];
    vert.x += x;
    vert.y += y;
    vert.z += z;
  }
  return this;
};

BufferGeometry.prototype.offset = function (x, y, z) {
  var arr = this.attributes.position.array,
      l = this.attributes.position.itemSize;
  for (var i = 0; i < arr.length; i += l) {
    arr[i] += x;
    arr[i + 1] += y;
    arr[i + 2] += z;
  }
  return this;
};

BufferGeometry.prototype.textured = Geometry.prototype.textured = Mesh.prototype.textured = function (texture, options) {
  return textured(this, texture, options);
};

Euler.prototype.toString = Quaternion.prototype.toString = Vector2.prototype.toString = Vector3.prototype.toString = Vector4.prototype.toString = function (digits) {
  var parts = this.toArray();
  if (digits !== undefined) {
    for (var i = 0; i < parts.length; ++i) {
      if (parts[i] !== null && parts[i] !== undefined) {
        parts[i] = parts[i].toFixed(digits);
      } else {
        parts[i] = "undefined";
      }
    }
  }
  return "<" + parts.join(", ") + ">";
};

var debugOutputCache = {};
Euler.prototype.debug = Quaternion.prototype.debug = Vector2.prototype.debug = Vector3.prototype.debug = Vector4.prototype.debug = Matrix3.prototype.debug = Matrix4.prototype.debug = function (label, digits) {
  var val = this.toString(digits);
  if (val !== debugOutputCache[label]) {
    debugOutputCache[label] = val;
    console.trace(label + "\n" + val);
  }
  return this;
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var promise = createCommonjsModule(function (module) {
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {
  }

  // Use polyfill for setImmediate for performance gains
  var asap = (typeof setImmediate === 'function' && setImmediate) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  var onUnhandledRejection = function onUnhandledRejection(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    asap(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      asap(function() {
        if (!self._handled) {
          onUnhandledRejection(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @private
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    asap = fn;
  };

  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    onUnhandledRejection = fn;
  };

  if ('object' !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(commonjsGlobal);
});

var DEG2RAD = Math$1.DEG2RAD;
var RAD2DEG = Math$1.RAD2DEG;

var Angle = function () {
  function Angle(v) {
    classCallCheck(this, Angle);

    if (typeof v !== "number") {
      throw new Error("Angle must be initialized with a number. Initial value was: " + v);
    }

    this._value = v;
    this._delta = 0;
    this._d1 = null;
    this._d2 = null;
    this._d3 = null;
  }

  createClass(Angle, [{
    key: "degrees",
    get: function get$$1() {
      return this._value;
    },
    set: function set$$1(newValue) {

      do {
        // figure out if it is adding the raw value, or whole
        // rotations of the value, that results in a smaller
        // magnitude of change.
        this._d1 = newValue + this._delta - this._value;
        this._d2 = Math.abs(this._d1 + 360);
        this._d3 = Math.abs(this._d1 - 360);
        this._d1 = Math.abs(this._d1);
        if (this._d2 < this._d1 && this._d2 < this._d3) {
          this._delta += 360;
        } else if (this._d3 < this._d1) {
          this._delta -= 360;
        }
      } while (this._d1 > this._d2 || this._d1 > this._d3);
      this._value = newValue + this._delta;
    }
  }, {
    key: "radians",
    get: function get$$1() {
      return this.degrees * DEG2RAD;
    },
    set: function set$$1(val) {

      this.degrees = val * RAD2DEG;
    }
  }]);
  return Angle;
}();

function XHR(method, type, url, options) {
  return new Promise(function (resolve, reject) {
    options = options || {};
    options.headers = options.headers || {};
    if (method === "POST") {
      options.headers["Content-Type"] = options.headers["Content-Type"] || type;
    }

    var req = new XMLHttpRequest();
    req.onerror = function (evt) {
      return reject(new Error("Request error: " + evt.message));
    };
    req.onabort = function (evt) {
      return reject(new Error("Request abort: " + evt.message));
    };
    req.onload = function () {
      // The other error events are client-errors. If there was a server error,
      // we'd find out about it during this event. We need to only respond to
      // successful requests, i.e. those with HTTP status code in the 200 or 300
      // range.
      if (req.status < 400) {
        resolve(req.response);
      } else {
        reject(req);
      }
    };

    // The order of these operations is very explicit. You have to call open
    // first. It seems counter intuitive, but think of it more like you're opening
    // an HTTP document to be able to write to it, and then you finish by sending
    // the document. The `open` method does not refer to a network connection.
    req.open(method, url);
    if (type) {
      req.responseType = type;
    }

    req.onprogress = options.progress;

    for (var key in options.headers) {
      req.setRequestHeader(key, options.headers[key]);
    }

    req.withCredentials = !!options.withCredentials;

    if (options.data) {
      req.send(JSON.stringify(options.data));
    } else {
      req.send();
    }
  });
}

function get$1(type, url, options) {
  return XHR("GET", type || "text", url, options);
}

function getBuffer(url, options) {
  return get$1("arraybuffer", url, options);
}

function cascadeElement(id, tag, DOMClass, add) {
  var elem = null;
  if (id === null) {
    elem = document.createElement(tag);
    elem.id = id = "auto_" + tag + Date.now();
  } else if (DOMClass === undefined || id instanceof DOMClass) {
    elem = id;
  } else if (typeof id === "string") {
    elem = document.getElementById(id);
    if (elem === null) {
      elem = document.createElement(tag);
      elem.id = id;
      if (add) {
        document.body.appendChild(elem);
      }
    } else if (elem.tagName !== tag.toUpperCase()) {
      elem = null;
    }
  }

  if (elem === null) {
    throw new Error(id + " does not refer to a valid " + tag + " element.");
  }
  return elem;
}

// polyfill
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var VECTOR = new Vector3();
var UP = new Vector3();
var TEMP = new Matrix4();

var Audio3D = function () {
  createClass(Audio3D, null, [{
    key: "setAudioStream",
    value: function setAudioStream(stream, id) {
      var audioElementCount = document.querySelectorAll("audio").length,
          element = cascadeElement(id || "audioStream" + audioElementCount, "audio", HTMLAudioElement, true);
      setAudioProperties(element);
      element.srcObject = stream;
      return element;
    }
  }, {
    key: "setAudioProperties",
    value: function setAudioProperties(element) {
      element.autoplay = true;
      element.controls = false;
      element.crossOrigin = "anonymous";
      element.muted = true;
      element.setAttribute("muted", "");
    }
  }]);

  function Audio3D() {
    var _this = this;

    classCallCheck(this, Audio3D);

    this.ready = new Promise(function (resolve, reject) {
      try {
        if (Audio3D.isAvailable) {
          var finishSetup = function finishSetup() {
            try {
              _this.sampleRate = _this.context.sampleRate;
              _this.mainVolume = _this.context.createGain();
              _this.start();
              resolve();
            } catch (exp) {
              reject(exp);
            }
          };

          if (!isiOS) {
            _this.context = new AudioContext();
            finishSetup();
          } else {
            var unlock = function unlock() {
              try {
                _this.context = _this.context || new AudioContext();
                var source = _this.context.createBufferSource();
                source.buffer = _this.createRawSound([[0]]);
                source.connect(_this.context.destination);
                source.start();
                setTimeout(function () {
                  if (source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE) {
                    window.removeEventListener("mouseup", unlock);
                    window.removeEventListener("touchend", unlock);
                    window.removeEventListener("keyup", unlock);
                    finishSetup();
                  }
                }, 0);
              } catch (exp) {
                reject(exp);
              }
            };

            window.addEventListener("mouseup", unlock, false);
            window.addEventListener("touchend", unlock, false);
            window.addEventListener("keyup", unlock, false);
          }
        }
      } catch (exp) {
        reject(exp);
      }
    });
  }

  createClass(Audio3D, [{
    key: "setVelocity",
    value: function setVelocity(x, y, z) {
      if (this.context) {
        this.context.listener.setVelocity(x, y, z);
      }
    }
  }, {
    key: "setPlayer",
    value: function setPlayer(obj) {
      if (this.context && this.context.listener) {
        obj.updateMatrixWorld();
        TEMP.copy(obj.matrixWorld);
        var mx = TEMP.elements[12],
            my = TEMP.elements[13],
            mz = TEMP.elements[14];

        this.context.listener.setPosition(mx, my, mz);

        VECTOR.set(0, 0, -1).applyMatrix4(TEMP).normalize();
        UP.set(0, 1, 0).applyMatrix4(TEMP).normalize();

        this.context.listener.setOrientation(VECTOR.x, VECTOR.y, VECTOR.z, UP.x, UP.y, UP.z);
      }
    }
  }, {
    key: "start",
    value: function start() {
      if (this.mainVolume) {
        this.mainVolume.connect(this.context.destination);
      }
      if (this.context.resume) {
        this.context.resume();
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.context.suspend) {
        this.context.suspend();
      }
      if (this.mainVolume) {
        this.mainVolume.disconnect();
      }
    }
  }, {
    key: "loadURL",
    value: function loadURL(src) {
      var _this2 = this;

      return this.ready.then(function () {
        console.log("Loading " + src + " from URL");
        getBuffer(src);
      }).then(function (data) {
        return new Promise(function (resolve, reject) {
          return _this2.context.decodeAudioData(data, resolve, reject);
        });
      }).then(function (dat) {
        console.log(src + " loaded");
        return dat;
      }).catch(function (err) {
        console.error("Couldn't load " + src + ". Reason: " + err);
      });
    }
  }, {
    key: "createRawSound",
    value: function createRawSound(pcmData) {
      if (pcmData.length !== 1 && pcmData.length !== 2) {
        throw new Error("Incorrect number of channels. Expected 1 or 2, got " + pcmData.length);
      }

      var frameCount = pcmData[0].length;
      if (pcmData.length > 1 && pcmData[1].length !== frameCount) {
        throw new Error("Second channel is not the same length as the first channel. Expected " + frameCount + ", but was " + pcmData[1].length);
      }

      var buffer = this.context.createBuffer(pcmData.length, frameCount, this.sampleRate || 22050);
      for (var c = 0; c < pcmData.length; ++c) {
        var channel = buffer.getChannelData(c);
        for (var i = 0; i < frameCount; ++i) {
          channel[i] = pcmData[c][i];
        }
      }
      return buffer;
    }
  }, {
    key: "create3DSound",
    value: function create3DSound(x, y, z, snd) {
      snd.panner = this.context.createPanner();
      snd.panner.setPosition(x, y, z);
      snd.panner.connect(this.mainVolume);
      snd.volume.connect(snd.panner);
      return snd;
    }
  }, {
    key: "createFixedSound",
    value: function createFixedSound(snd) {
      snd.volume.connect(this.mainVolume);
      return snd;
    }
  }, {
    key: "loadSource",
    value: function loadSource(sources, loop) {
      var _this3 = this;

      return this.ready.then(function () {
        return new Promise(function (resolve, reject) {
          console.log("Loading " + sources);
          if (!(sources instanceof Array)) {
            sources = [sources];
          }
          var audio = document.createElement("audio");
          audio.autoplay = true;
          audio.preload = "auto";
          audio["webkit-playsinline"] = true;
          audio.playsinline = true;
          audio.loop = loop;
          audio.crossOrigin = "anonymous";
          sources.map(function (src) {
            var source = document.createElement("source");
            source.src = src;
            return source;
          }).forEach(audio.appendChild.bind(audio));
          audio.onerror = reject;
          audio.oncanplay = function () {
            audio.oncanplay = null;
            var snd = {
              volume: _this3.context.createGain(),
              source: _this3.context.createMediaElementSource(audio)
            };
            snd.source.connect(snd.volume);
            resolve(snd);
          };
          audio.play();
          document.body.appendChild(audio);
        });
      }).then(function (dat) {
        console.log(sources + " loaded");
        return dat;
      }).catch(function (err) {
        console.error("Couldn't load " + sources + ". Reason: " + err);
      });
    }
  }, {
    key: "load3DSound",
    value: function load3DSound(src, loop, x, y, z) {
      return this.loadSource(src, loop).then(this.create3DSound.bind(this, x, y, z));
    }
  }, {
    key: "loadFixedSound",
    value: function loadFixedSound(src, loop) {
      return this.loadSource(src, loop).then(this.createFixedSound.bind(this));
    }
  }]);
  return Audio3D;
}();

Audio3D.isAvailable = !!window.AudioContext && !!AudioContext.prototype.createGain;

var PositionalSound = function () {
  function PositionalSound(ctx, mainVolume) {
    classCallCheck(this, PositionalSound);

    this.gn = ctx.createGain(), this.pnr = ctx.createPanner();
    this.gn.connect(this.pnr);
    this.pnr.connect(mainVolume);
    this.gn.gain.value = 0;
    this.ctx = ctx;
  }

  createClass(PositionalSound, [{
    key: "at",
    value: function at(x, y, z, dx, dy, dz) {
      x = x || 0;
      y = y || 0;
      z = z || 0;
      if (dx === undefined || dx === null) {
        dx = 0;
      }
      dy = dy || 0;
      dz = dz || 0;

      this.pnr.setPosition(x, y, z);
      this.pnr.setOrientation(dx, dy, dz);
      return this;
    }
  }]);
  return PositionalSound;
}();

var PIANO_BASE = Math.pow(2, 1 / 12);

var Note = function (_PositionalSound) {
  inherits(Note, _PositionalSound);
  createClass(Note, null, [{
    key: "piano",
    value: function piano(n) {
      return 440 * Math.pow(PIANO_BASE, n - 49);
    }
  }]);

  function Note(ctx, mainVolume, type) {
    classCallCheck(this, Note);

    var _this = possibleConstructorReturn(this, (Note.__proto__ || Object.getPrototypeOf(Note)).call(this, ctx, mainVolume));

    _this.osc = ctx.createOscillator(), _this.osc.type = type;
    _this.osc.frequency.value = 0;
    _this.osc.connect(_this.gn);
    _this.osc.start();
    return _this;
  }

  createClass(Note, [{
    key: "on",
    value: function on(i, volume, dt, ramp) {
      if (dt === undefined) {
        dt = 0;
      }
      var f = Note.piano(parseFloat(i) + 1),
          t = this.ctx.currentTime + dt;
      this.gn.gain.setValueAtTime(volume, t);
      if (ramp) {
        this.osc.frequency.exponentialRampToValueAtTime(f, t);
      } else {
        this.osc.frequency.setValueAtTime(f, t);
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(dt) {
      if (dt === undefined) {
        dt = 0;
      }
      var t = this.ctx.currentTime + dt;
      this.gn.gain.setValueAtTime(0, t);
      this.osc.frequency.setValueAtTime(0, t);
      return this;
    }
  }, {
    key: "ready",
    get: function get$$1() {
      return this.gn.gain.value === 0;
    }
  }]);
  return Note;
}(PositionalSound);

var MAX_NOTE_COUNT = (navigator.maxTouchPoints || 10) + 1;
var TYPES = ["sine", "square", "sawtooth", "triangle"];

var Music = function () {
  function Music(audio, numNotes) {
    var _this = this;

    classCallCheck(this, Music);

    if (numNotes === undefined) {
      numNotes = MAX_NOTE_COUNT;
    }

    this.oscillators = {};
    this.isAvailable = false;
    this.audio = audio;
    this.audio.ready.then(function () {
      var ctx = _this.audio.context;
      _this.mainVolume = ctx.createGain();
      _this.mainVolume.connect(_this.audio.mainVolume);
      _this.mainVolume.gain.value = 1;
      _this.numNotes = numNotes;
      TYPES.forEach(function (type) {
        var oscs = _this.oscillators[type] = [];
        _this[type] = _this.play.bind(_this, type);
        for (var i = 0; i < _this.numNotes; ++i) {
          oscs.push(new Note(ctx, _this.mainVolume, type));
        }
      });
      _this.isAvailable = true;
    });
  }

  createClass(Music, [{
    key: "getOsc",
    value: function getOsc(type) {
      var osc = this.oscillators[type];
      var n = void 0;
      for (n = 0; n < osc.length; ++n) {
        if (osc[n].ready) {
          break;
        }
      }

      return osc[n % this.numNotes];
    }
  }, {
    key: "play",
    value: function play(type, i, volume, duration, dt) {
      if (dt === undefined) {
        dt = 0;
      }
      var o = this.getOsc(type).on(i, volume, dt);
      dt += duration;
      o.off(dt);
      dt = this.audio.context.currentTime + dt - performance.now() / 1000;
      return o;
    }
  }, {
    key: "type",
    get: function get$$1() {
      return this._type;
    },
    set: function set$$1(v) {
      var _this2 = this;

      if (this.isAvailable) {
        this._type = v;
        this.oscillators.forEach(function (o) {
          return o.osc.type = _this2._type;
        });
      }
    }
  }]);
  return Music;
}();

Music.TYPES = TYPES;

var Sound = function (_PositionalSound) {
  inherits(Sound, _PositionalSound);

  function Sound(audio3D, sources, loop) {
    classCallCheck(this, Sound);

    var _this = possibleConstructorReturn(this, (Sound.__proto__ || Object.getPrototypeOf(Sound)).call(this, audio3D.context, audio3D.mainVolume));

    _this.audio = document.createElement("audio");
    _this.audio.autoplay = true;
    _this.audio.preload = "auto";
    _this.audio["webkit-playsinline"] = true;
    _this.audio.playsinline = true;
    _this.audio.loop = loop;
    _this.audio.crossOrigin = "anonymous";
    console.log("Loading " + sources);
    if (!(sources instanceof Array)) {
      sources = [sources];
    }
    sources.map(function (src) {
      var source = document.createElement("source");
      source.src = src;
      return source;
    }).forEach(_this.audio.appendChild.bind(_this.audio));
    _this.ready = new Promise(function (resolve, reject) {
      _this.audio.onerror = reject;
      _this.audio.oncanplay = function () {
        _this.audio.oncanplay = null;
        _this.node = _this.ctx.createMediaElementSource(_this.audio);
        _this.node.connect(_this.gn);
        _this.gn.gain.setValueAtTime(0, _this.ctx.currentTime);
        resolve(_this);
      };
      _this.audio.play();
    });

    document.body.appendChild(_this.audio);
    return _this;
  }

  createClass(Sound, [{
    key: "play",
    value: function play() {
      this.gn.gain.setValueAtTime(1, this.ctx.currentTime);
      this.audio.play();
      return this;
    }
  }]);
  return Sound;
}(PositionalSound);

var DEFAULT_SPEECH_SETTINGS = {
  remoteVoices: true,
  volume: 1,
  rate: 1,
  pitch: 1,
  voice: 0
};

var Speech = function () {
  function Speech(options) {
    var _this = this;

    classCallCheck(this, Speech);

    this.options = Object.assign({}, DEFAULT_SPEECH_SETTINGS, options);
    if (Speech.isAvailable) {
      var getVoices = function getVoices() {
        _this.voices = speechSynthesis.getVoices().filter(function (v) {
          return _this.options.remoteVoices || v.default || v.localService;
        });
        _this.voiceNames = _this.voices.map(function (voice) {
          return voice.name;
        });
      };

      getVoices();
      speechSynthesis.onvoiceschanged = getVoices;
    }
  }

  createClass(Speech, [{
    key: "speak",
    value: function speak(txt, opts) {
      var _this2 = this;

      if (Speech.isAvailable) {
        return new Promise(function (resolve, reject) {
          var msg = new SpeechSynthesisUtterance();
          msg.voice = _this2.voices[opts && opts.voice || _this2.options.voice];
          msg.volume = opts && opts.volume || _this2.options.volume;
          msg.rate = opts && opts.rate || _this2.options.rate;
          msg.pitch = opts && opts.pitch || _this2.options.pitch;
          msg.text = txt;
          msg.onend = resolve;
          msg.onerror = reject;
          speechSynthesis.speak(msg);
        });
      } else {
        return Promise.reject();
      }
    }
  }, {
    key: "speaking",
    get: function get$$1() {
      return Speech.isAvailable && speechSynthesis.speaking;
    }
  }], [{
    key: "isAvailable",
    get: function get$$1() {
      return !!window.speechSynthesis;
    }
  }]);
  return Speech;
}();

var Audio$1 = {
  Audio3D: Audio3D,
  Music: Music,
  Note: Note,
  PositionalSound: PositionalSound,
  Sound: Sound,
  Speech: Speech
};

var packageName = "PrimroseVR";

var version = "0.31.4";



var homepage = "https://www.primrosevr.com";

var FORWARD = new Vector3(0, 0, -1);
var LASER_WIDTH = 0.01;
var LASER_LENGTH = 3 * LASER_WIDTH;
var GAZE_RING_DISTANCE = -1.25;
var GAZE_RING_INNER = 0.015;
var GAZE_RING_OUTER = 0.03;
var VECTOR_TEMP = new Vector3();
var EULER_TEMP$1 = new Euler();
var QUAT_TEMP$1 = new Quaternion();

function hasGazeEvent(obj) {
  return obj && obj._listeners && (obj._listeners.gazecomplete && obj._listeners.gazecomplete.length > 0 || obj._listeners.select && obj._listeners.select.length > 0 || obj._listeners.click && obj._listeners.click.length > 0);
}

var Pointer = function (_Entity) {
  inherits(Pointer, _Entity);

  function Pointer(pointerName, color, highlight, s, devices, triggerDevices, options) {
    classCallCheck(this, Pointer);

    var _this = possibleConstructorReturn(this, (Pointer.__proto__ || Object.getPrototypeOf(Pointer)).call(this, pointerName, options));

    _this.isPointer = true;
    _this.devices = devices.filter(identity);
    _this.triggerDevices = triggerDevices && triggerDevices.filter(identity) || _this.devices.slice();
    _this.gazeTimeout = (_this.options.gazeLength || 1.5) * 1000;

    _this.unproject = null;

    _this.picker = new Raycaster();
    _this.showPointer = true;
    _this.color = color;
    _this.highlight = highlight;
    _this.velocity = new Vector3();

    _this.mesh = box(LASER_WIDTH / s, LASER_WIDTH / s, LASER_LENGTH * s).colored(_this.color, {
      unshaded: true
    }).named(pointerName + "-pointer").addTo(_this).at(0, 0, -1.5);

    _this.gazeInner = circle(GAZE_RING_INNER / 2, 10).colored(0xc0c0c0, {
      unshaded: true
    }).addTo(_this).at(0, 0, GAZE_RING_DISTANCE);

    _this.gazeReference = ring(GAZE_RING_INNER * 0.5, GAZE_RING_INNER * 0.75, 10, 36, 0, 2 * Math.PI).colored(0xffffff, {
      unshaded: true
    }).addTo(_this.gazeInner);

    _this.gazeOuter = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 10, 36, 0, 2 * Math.PI).colored(0xffffff, {
      unshaded: true
    }).addTo(_this.gazeInner);

    _this.gazeOuter.visible = false;

    _this.useGaze = _this.options.useGaze;
    _this.lastHit = null;
    return _this;
  }

  createClass(Pointer, [{
    key: "addDevice",
    value: function addDevice(orientation, trigger) {
      if (orientation) {
        this.devices.push(orientation);
      }

      if (trigger) {
        this.triggerDevices.push(trigger);
      }
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var w = devicePixelRatio * 2 / width,
          h = devicePixelRatio * 2 / height;
      for (var i = 0; i < this.devices.length; ++i) {
        var device = this.devices[i];
        device.commands.U.scale = w;
        device.commands.V.scale = h;
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.position.set(0, 0, 0);

      if (this.unproject) {
        QUAT_TEMP$1.set(0, 1, 0, 0);
        VECTOR_TEMP.set(0, 0, 0);
        for (var i = 0; i < this.devices.length; ++i) {
          var obj = this.devices[i];
          if (obj.enabled && obj.inPhysicalUse && !obj.commands.U.disabled && !obj.commands.V.disabled) {
            VECTOR_TEMP.x += obj.getValue("U") - 1;
            VECTOR_TEMP.y += obj.getValue("V") - 1;
          }
        }
        VECTOR_TEMP.applyMatrix4(this.unproject).applyQuaternion(QUAT_TEMP$1);
        this.lookAt(VECTOR_TEMP);
      } else {
        this.quaternion.set(0, 0, 0, 1);
        EULER_TEMP$1.set(0, 0, 0, "YXZ");
        for (var _i = 0; _i < this.devices.length; ++_i) {
          var _obj = this.devices[_i];
          if (_obj.enabled) {
            if (_obj.quaternion) {
              this.quaternion.multiply(_obj.quaternion);
            }
            if (_obj.position) {
              this.position.add(_obj.position);
            }
          }
        }

        QUAT_TEMP$1.setFromEuler(EULER_TEMP$1);
        this.quaternion.multiply(QUAT_TEMP$1);
      }
      this.updateMatrixWorld();
    }
  }, {
    key: "_check",
    value: function _check(curHit) {
      var curObj = curHit && curHit.object,
          lastHit = this.lastHit,
          lastObj = lastHit && lastHit.object;

      if (curObj || lastObj) {
        var moved = lastHit && curHit && (curHit.point.x !== lastHit.point.x || curHit.point.y !== lastHit.point.y || curHit.point.z !== lastHit.point.z),
            dt = lastHit && lastHit.time && performance.now() - lastHit.time,
            curID = curObj && curObj.id,
            lastID = lastObj && lastObj.id,
            changed = curID !== lastID,
            enterEvt = {
          pointer: this,
          buttons: 0,
          hit: curHit
        },
            leaveEvt = {
          pointer: this,
          buttons: 0,
          hit: lastHit
        };

        if (curHit) {
          this.gazeInner.position.z = 0.02 - curHit.distance;
          curHit.time = performance.now();

          this.mesh.material = material("", {
            color: this.highlight,
            unshaded: true
          });
        } else {
          this.gazeInner.position.z = GAZE_RING_DISTANCE;
        }

        this.mesh.position.z = this.gazeInner.position.z - 0.02;

        if (moved) {
          lastHit.point.copy(curHit.point);
        }

        var dButtons = 0;
        for (var i = 0; i < this.triggerDevices.length; ++i) {
          var obj = this.triggerDevices[i];
          if (obj.enabled) {
            enterEvt.buttons |= obj.getValue("buttons");
            dButtons |= obj.getValue("dButtons");
          }
        }

        leaveEvt.buttons = enterEvt.buttons;

        if (changed) {
          if (lastObj) {
            this.emit("exit", leaveEvt);
          }
          if (curObj) {
            this.emit("enter", enterEvt);
          }
        }

        var selected = false;
        if (dButtons) {
          if (enterEvt.buttons) {
            if (curObj) {
              this.emit("pointerstart", enterEvt);
            }
            if (lastHit) {
              lastHit.time = performance.now();
            }
          } else if (curObj) {
            selected = !!curHit;
            this.emit("pointerend", enterEvt);
          }
        } else if (moved && curObj) {
          this.emit("pointermove", enterEvt);
        }

        if (this.useGaze) {
          if (changed) {
            if (dt !== null && dt < this.gazeTimeout) {
              this.gazeOuter.visible = false;
              if (lastObj) {
                this.emit("gazecancel", leaveEvt);
              }
            }
            if (curHit) {
              this.gazeOuter.visible = true;
              if (curObj) {
                this.emit("gazestart", enterEvt);
              }
            }
          } else if (dt !== null) {
            if (dt >= this.gazeTimeout) {
              this.gazeOuter.visible = false;
              if (curObj) {
                selected = !!curHit;
                this.emit("gazecomplete", enterEvt);
              }
              lastHit.time = null;
            } else if (hasGazeEvent(curObj)) {
              var p = Math.round(36 * dt / this.gazeTimeout),
                  a = 2 * Math.PI * p / 36;
              this.gazeOuter.geometry = ring(GAZE_RING_INNER, GAZE_RING_OUTER, 36, p, 0, a);
              if (moved && curObj) {
                this.emit("gazemove", enterEvt);
              }
            } else {
              this.gazeOuter.visible = false;
            }
          }
        }

        if (selected) {
          this.emit("select", enterEvt);
        }

        if (!changed && curHit && lastHit) {
          curHit.time = lastHit.time;
        }
        return true;
      }

      return false;
    }
  }, {
    key: "resolvePicking",
    value: function resolvePicking(objects) {
      this.mesh.visible = false;
      this.gazeInner.visible = false;
      this.mesh.material = material("", {
        color: this.color,
        unshaded: true
      });

      if (this.showPointer) {
        VECTOR_TEMP.set(0, 0, 0).applyMatrix4(this.matrixWorld);
        FORWARD.set(0, 0, -1).applyMatrix4(this.matrixWorld).sub(VECTOR_TEMP);
        this.picker.set(VECTOR_TEMP, FORWARD);
        this.gazeInner.visible = this.useGaze;
        this.mesh.visible = !this.useGaze;

        // Fire phasers
        var hits = this.picker.intersectObject(objects, true);
        for (var i = 0; i < hits.length; ++i) {

          var hit = hits[i],
              origObj = hit.object;
          var obj = origObj;

          // Try to find a Primrose Entity
          while (obj && (!obj.isEntity || obj.isPointer)) {
            obj = obj.parent;
          }

          // If we didn't find a Primrose Entity, go back to using the Three.js mesh.
          if (!obj) {
            obj = origObj;
          }

          // Check to see if the object has any event handlers that we care about.
          if (obj && !obj.pickable) {
            obj = null;
          }

          // Save the setting, necessary for checking against the last value, to check for changes in which object was pointed at.
          hit.object = obj;

          if (obj && this._check(hit)) {
            this.lastHit = hit;
            return hit.object._listeners.useraction;
          }
        }

        // If we got this far, it means we didn't find any good objects, and the _check method never ran. So run the check again with no object and it will fire the necessary "end" event handlers.
        this._check();
        this.lastHit = null;
      }
    }
  }, {
    key: "pickable",
    get: function get$$1() {
      return false;
    }
  }, {
    key: "material",
    get: function get$$1() {
      return this.mesh.material;
    },
    set: function set$$1(v) {
      this.mesh.material = v;
      this.gazeInner.material = v;
      this.gazeOuter.material = v;
    }
  }]);
  return Pointer;
}(Entity);

Pointer.EVENTS = ["pointerstart", "pointerend", "pointermove", "gazestart", "gazemove", "gazecomplete", "gazecancel", "exit", "enter", "select", "useraction"];

var Keys = {
  ANY: Number.MAX_VALUE,
  ///////////////////////////////////////////////////////////////////////////
  // modifiers
  ///////////////////////////////////////////////////////////////////////////
  MODIFIER_KEYS: ["ctrl", "shift", "alt", "meta", "meta_l", "meta_r"],
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  META: 91,
  META_L: 91,
  META_R: 92,
  ///////////////////////////////////////////////////////////////////////////
  // whitespace
  ///////////////////////////////////////////////////////////////////////////
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  DELETE: 46,
  ///////////////////////////////////////////////////////////////////////////
  // lock keys
  ///////////////////////////////////////////////////////////////////////////
  PAUSEBREAK: 19,
  CAPSLOCK: 20,
  NUMLOCK: 144,
  SCROLLLOCK: 145,
  INSERT: 45,
  ///////////////////////////////////////////////////////////////////////////
  // navigation keys
  ///////////////////////////////////////////////////////////////////////////
  ESCAPE: 27,
  PAGEUP: 33,
  PAGEDOWN: 34,
  END: 35,
  HOME: 36,
  LEFTARROW: 37,
  UPARROW: 38,
  RIGHTARROW: 39,
  DOWNARROW: 40,
  SELECTKEY: 93,
  ///////////////////////////////////////////////////////////////////////////
  // numbers
  ///////////////////////////////////////////////////////////////////////////
  NUMBER0: 48,
  NUMBER1: 49,
  NUMBER2: 50,
  NUMBER3: 51,
  NUMBER4: 52,
  NUMBER5: 53,
  NUMBER6: 54,
  NUMBER7: 55,
  NUMBER8: 56,
  NUMBER9: 57,
  ///////////////////////////////////////////////////////////////////////////
  // letters
  ///////////////////////////////////////////////////////////////////////////
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  ///////////////////////////////////////////////////////////////////////////
  // numpad
  ///////////////////////////////////////////////////////////////////////////
  NUMPAD0: 96,
  NUMPAD1: 97,
  NUMPAD2: 98,
  NUMPAD3: 99,
  NUMPAD4: 100,
  NUMPAD5: 101,
  NUMPAD6: 102,
  NUMPAD7: 103,
  NUMPAD8: 104,
  NUMPAD9: 105,
  MULTIPLY: 106,
  ADD: 107,
  SUBTRACT: 109,
  DECIMALPOINT: 110,
  DIVIDE: 111,
  ///////////////////////////////////////////////////////////////////////////
  // function keys
  ///////////////////////////////////////////////////////////////////////////
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  ///////////////////////////////////////////////////////////////////////////
  // media keys
  ///////////////////////////////////////////////////////////////////////////
  VOLUME_DOWN: 174,
  VOLUME_UP: 175,
  TRACK_NEXT: 176,
  TRACK_PREVIOUS: 177
};

// create a reverse mapping from keyCode to name.
for (var key in Keys) {
  var val = Keys[key];
  if (Keys.hasOwnProperty(key) && typeof val === "number") {
    Keys[val] = key;
  }
}

var Point = function () {
  function Point(x, y) {
    classCallCheck(this, Point);

    this.set(x || 0, y || 0);
  }

  createClass(Point, [{
    key: "set",
    value: function set$$1(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "copy",
    value: function copy(p) {
      if (p) {
        this.x = p.x;
        this.y = p.y;
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Point(this.x, this.y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(x:" + this.x + ", y:" + this.y + ")";
    }
  }]);
  return Point;
}();

var Size = function () {
  function Size(width, height) {
    classCallCheck(this, Size);

    this.set(width || 0, height || 0);
  }

  createClass(Size, [{
    key: "set",
    value: function set$$1(width, height) {
      this.width = width;
      this.height = height;
    }
  }, {
    key: "copy",
    value: function copy(s) {
      if (s) {
        this.width = s.width;
        this.height = s.height;
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Size(this.width, this.height);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "<w:" + this.width + ", h:" + this.height + ">";
    }
  }]);
  return Size;
}();

var Rectangle = function () {
  function Rectangle(x, y, width, height) {
    classCallCheck(this, Rectangle);

    this.isRectangle = true;
    this.point = new Point(x, y);
    this.size = new Size(width, height);
  }

  createClass(Rectangle, [{
    key: "set",
    value: function set$$1(x, y, width, height) {
      this.point.set(x, y);
      this.size.set(width, height);
    }
  }, {
    key: "copy",
    value: function copy(r) {
      if (r) {
        this.point.copy(r.point);
        this.size.copy(r.size);
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Rectangle(this.point.x, this.point.y, this.size.width, this.size.height);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[" + this.point.toString() + " x " + this.size.toString() + "]";
    }
  }, {
    key: "overlap",
    value: function overlap(r) {
      var left = Math.max(this.left, r.left),
          top = Math.max(this.top, r.top),
          right = Math.min(this.right, r.right),
          bottom = Math.min(this.bottom, r.bottom);
      if (right > left && bottom > top) {
        return new Rectangle(left, top, right - left, bottom - top);
      }
    }
  }, {
    key: "x",
    get: function get$$1() {
      return this.point.x;
    },
    set: function set$$1(x) {
      this.point.x = x;
    }
  }, {
    key: "left",
    get: function get$$1() {
      return this.point.x;
    },
    set: function set$$1(x) {
      this.point.x = x;
    }
  }, {
    key: "width",
    get: function get$$1() {
      return this.size.width;
    },
    set: function set$$1(width) {
      this.size.width = width;
    }
  }, {
    key: "right",
    get: function get$$1() {
      return this.point.x + this.size.width;
    },
    set: function set$$1(right) {
      this.point.x = right - this.size.width;
    }
  }, {
    key: "y",
    get: function get$$1() {
      return this.point.y;
    },
    set: function set$$1(y) {
      this.point.y = y;
    }
  }, {
    key: "top",
    get: function get$$1() {
      return this.point.y;
    },
    set: function set$$1(y) {
      this.point.y = y;
    }
  }, {
    key: "height",
    get: function get$$1() {
      return this.size.height;
    },
    set: function set$$1(height) {
      this.size.height = height;
    }
  }, {
    key: "bottom",
    get: function get$$1() {
      return this.point.y + this.size.height;
    },
    set: function set$$1(bottom) {
      this.point.y = bottom - this.size.height;
    }
  }, {
    key: "area",
    get: function get$$1() {
      return this.width * this.height;
    }
  }]);
  return Rectangle;
}();

var COUNTER$4 = 0;

var Surface = function (_BaseTextured) {
  inherits(Surface, _BaseTextured);

  function Surface(options) {
    classCallCheck(this, Surface);

    options = Object.assign({}, {
      id: "Primrose.Controls.Surface[" + COUNTER$4++ + "]",
      bounds: new Rectangle()
    }, options);

    if (options.width) {
      options.bounds.width = options.width;
    }

    if (options.height) {
      options.bounds.height = options.height;
    }

    var canvas = null,
        context = null;

    if (options.id instanceof Surface) {
      throw new Error("Object is already a Surface. Please don't try to wrap them.");
    } else if (options.id instanceof CanvasRenderingContext2D) {
      context = options.id;
      canvas = context.canvas;
    } else if (options.id instanceof HTMLCanvasElement) {
      canvas = options.id;
    } else if (typeof options.id === "string" || options.id instanceof String) {
      canvas = document.getElementById(options.id);
      if (canvas === null) {
        canvas = document.createElement("canvas");
        canvas.id = options.id;
      } else if (canvas.tagName !== "CANVAS") {
        canvas = null;
      }
    }

    if (canvas === null) {
      console.error(_typeof(options.id));
      console.error(options.id);
      throw new Error(options.id + " does not refer to a valid canvas element.");
    }

    var _this = possibleConstructorReturn(this, (Surface.__proto__ || Object.getPrototypeOf(Surface)).call(this, [canvas], options));

    _this.isSurface = true;
    _this.bounds = _this.options.bounds;
    _this.canvas = canvas;
    _this.context = context || _this.canvas.getContext("2d");
    _this._opacity = 1;

    _this.focused = false;

    _this.focusable = true;

    _this.style = {};

    Object.defineProperties(_this.style, {
      width: {
        get: function get$$1() {
          return _this.bounds.width;
        },
        set: function set$$1(v) {
          _this.bounds.width = v;
          _this.resize();
        }
      },
      height: {
        get: function get$$1() {
          return _this.bounds.height;
        },
        set: function set$$1(v) {
          _this.bounds.height = v;
          _this.resize();
        }
      },
      left: {
        get: function get$$1() {
          return _this.bounds.left;
        },
        set: function set$$1(v) {
          _this.bounds.left = v;
        }
      },
      top: {
        get: function get$$1() {
          return _this.bounds.top;
        },
        set: function set$$1(v) {
          _this.bounds.top = v;
        }
      },
      opacity: {
        get: function get$$1() {
          return _this._opacity;
        },
        set: function set$$1(v) {
          _this._opacity = v;
        }
      },
      fontSize: {
        get: function get$$1() {
          return _this.fontSize;
        },
        set: function set$$1(v) {
          _this.fontSize = v;
        }
      },
      backgroundColor: {
        get: function get$$1() {
          return _this.backgroundColor;
        },
        set: function set$$1(v) {
          _this.backgroundColor = v;
        }
      },
      color: {
        get: function get$$1() {
          return _this.color;
        },
        set: function set$$1(v) {
          _this.color = v;
        }
      }
    });

    if (_this.bounds.width === 0) {
      _this.bounds.width = _this.imageWidth;
      _this.bounds.height = _this.imageHeight;
    }

    _this.imageWidth = _this.bounds.width;
    _this.imageHeight = _this.bounds.height;

    _this.canvas.style.imageRendering = isChrome ? "pixelated" : "optimizespeed";
    _this.context.imageSmoothingEnabled = false;
    _this.context.textBaseline = "top";

    _this.subSurfaces = [];

    _this.render = _this.render.bind(_this);

    _this.on("focus", _this.render).on("blur", _this.render).on("pointerstart", _this.startUV.bind(_this)).on("pointermove", _this.moveUV.bind(_this)).on("gazemove", _this.moveUV.bind(_this)).on("pointerend", _this.endPointer.bind(_this)).on("gazecomplete", function (evt) {
      _this.startUV(evt);
      setTimeout(function () {
        return _this.endPointer(evt);
      }, 100);
    }).on("keydown", _this.keyDown.bind(_this)).on("keyup", _this.keyUp.bind(_this));

    _this.render();
    return _this;
  }

  createClass(Surface, [{
    key: "_loadFiles",
    value: function _loadFiles(canvases, progress) {
      var _this2 = this;

      return Promise.all(canvases.map(function (canvas, i) {
        var loadOptions = Object.assign({}, _this2.options);
        _this2._meshes[i] = _this2._geometry.textured(canvas, loadOptions);
        return loadOptions.promise.then(function (txt) {
          return _this2._textures[i] = txt;
        });
      }));
    }
  }, {
    key: "invalidate",
    value: function invalidate(bounds) {
      var useDefault = !bounds;
      if (!bounds) {
        bounds = this.bounds.clone();
        bounds.left = 0;
        bounds.top = 0;
      } else if (bounds.isRectangle) {
        bounds = bounds.clone();
      }
      for (var i = 0; i < this.subSurfaces.length; ++i) {
        var subSurface = this.subSurfaces[i],
            overlap = bounds.overlap(subSurface.bounds);
        if (overlap) {
          var x = overlap.left - subSurface.bounds.left,
              y = overlap.top - subSurface.bounds.top;
          this.context.drawImage(subSurface.canvas, x, y, overlap.width, overlap.height, overlap.x, overlap.y, overlap.width, overlap.height);
        }
      }
      if (this._textures[0]) {
        this._textures[0].needsUpdate = true;
      }
      if (this._meshes[0]) {
        this._meshes[0].material.needsUpdate = true;
      }
      if (this.parent instanceof Surface) {
        bounds.left += this.bounds.left;
        bounds.top += this.bounds.top;
        this.parent.invalidate(bounds);
      }
    }
  }, {
    key: "render",
    value: function render() {
      this.invalidate();
    }
  }, {
    key: "resize",
    value: function resize() {
      this.setSize(this.surfaceWidth, this.surfaceHeight);
    }
  }, {
    key: "setSize",
    value: function setSize(width, height) {
      var oldTextBaseline = this.context.textBaseline,
          oldTextAlign = this.context.textAlign;
      this.imageWidth = width;
      this.imageHeight = height;

      this.context.textBaseline = oldTextBaseline;
      this.context.textAlign = oldTextAlign;
    }
  }, {
    key: "add",
    value: function add(child) {
      if (child.isSurface) {
        this.subSurfaces.push(child);
        this.invalidate();
      } else if (child.isObject3D) {
        get(Surface.prototype.__proto__ || Object.getPrototypeOf(Surface.prototype), "add", this).call(this, child);
      } else {
        throw new Error("Can only append other Surfaces to a Surface. You gave: " + child);
      }
    }
  }, {
    key: "mapUV",
    value: function mapUV(point) {
      if (point instanceof Array) {
        return {
          x: point[0] * this.imageWidth,
          y: (1 - point[1]) * this.imageHeight
        };
      } else if (point.isVector2) {
        return {
          x: point.x * this.imageWidth,
          y: (1 - point.y) * this.imageHeight
        };
      }
    }
  }, {
    key: "unmapUV",
    value: function unmapUV(point) {
      return [point.x / this.imageWidth, 1 - point.y / this.imageHeight];
    }
  }, {
    key: "_findSubSurface",
    value: function _findSubSurface(x, y, thunk) {
      var here = this.inBounds(x, y),
          found = null;
      for (var i = this.subSurfaces.length - 1; i >= 0; --i) {
        var subSurface = this.subSurfaces[i];
        if (!found && subSurface.inBounds(x - this.bounds.left, y - this.bounds.top)) {
          found = subSurface;
        } else if (subSurface.focused) {
          subSurface.blur();
        }
      }
      return found || here && this;
    }
  }, {
    key: "inBounds",
    value: function inBounds(x, y) {
      return this.bounds.left <= x && x < this.bounds.right && this.bounds.top <= y && y < this.bounds.bottom;
    }
  }, {
    key: "startPointer",
    value: function startPointer(x, y) {
      if (this.inBounds(x, y)) {
        var target = this._findSubSurface(x, y, function (subSurface, x2, y2) {
          return subSurface.startPointer(x2, y2);
        });
        if (target) {
          if (!this.focused) {
            this.focus();
          }
          this.emit("click", {
            target: target,
            x: x,
            y: y
          });
          if (target !== this) {
            target.startPointer(x - this.bounds.left, y - this.bounds.top);
          }
        } else if (this.focused) {
          this.blur();
        }
      }
    }
  }, {
    key: "movePointer",
    value: function movePointer(x, y) {
      var target = this._findSubSurface(x, y, function (subSurface, x2, y2) {
        return subSurface.startPointer(x2, y2);
      });
      if (target) {
        this.emit("move", {
          target: target,
          x: x,
          y: y
        });
        if (target !== this) {
          target.movePointer(x - this.bounds.left, y - this.bounds.top);
        }
      }
    }
  }, {
    key: "_forFocusedSubSurface",
    value: function _forFocusedSubSurface(name, evt) {
      var elem = this.focusedElement;
      if (elem && elem !== this) {
        elem[name](evt);
        return true;
      }
      return false;
    }
  }, {
    key: "startUV",
    value: function startUV(evt) {
      if (!this._forFocusedSubSurface("startUV", evt)) {
        var p = this.mapUV(evt.hit.uv);
        this.startPointer(p.x, p.y);
      }
    }
  }, {
    key: "moveUV",
    value: function moveUV(evt) {
      if (!this._forFocusedSubSurface("moveUV", evt)) {
        var p = this.mapUV(evt.hit.uv);
        this.movePointer(p.x, p.y);
      }
    }
  }, {
    key: "endPointer",
    value: function endPointer(evt) {
      this._forFocusedSubSurface("endPointer", evt);
    }
  }, {
    key: "focus",
    value: function focus() {
      if (this.focusable && !this.focused) {
        this.focused = true;
        this.emit("focus");
      }
    }
  }, {
    key: "blur",
    value: function blur() {
      if (this.focused) {
        this.focused = false;
        for (var i = 0; i < this.subSurfaces.length; ++i) {
          if (this.subSurfaces[i].focused) {
            this.subSurfaces[i].blur();
          }
        }
        this.emit("blur");
      }
    }
  }, {
    key: "keyDown",
    value: function keyDown(evt) {
      this._forFocusedSubSurface("keyDown", evt);
    }
  }, {
    key: "keyUp",
    value: function keyUp(evt) {
      this._forFocusedSubSurface("keyUp", evt);
    }
  }, {
    key: "readClipboard",
    value: function readClipboard(evt) {
      this._forFocusedSubSurface("readClipboard", evt);
    }
  }, {
    key: "copySelectedText",
    value: function copySelectedText(evt) {
      this._forFocusedSubSurface("copySelectedText", evt);
    }
  }, {
    key: "cutSelectedText",
    value: function cutSelectedText(evt) {
      this._forFocusedSubSurface("cutSelectedText", evt);
    }
  }, {
    key: "readWheel",
    value: function readWheel(evt) {
      this._forFocusedSubSurface("readWheel", evt);
    }
  }, {
    key: "pickable",
    get: function get$$1() {
      return true;
    }
  }, {
    key: "imageWidth",
    get: function get$$1() {
      return this.canvas.width;
    },
    set: function set$$1(v) {
      this.canvas.width = v;
      this.bounds.width = v;
    }
  }, {
    key: "imageHeight",
    get: function get$$1() {
      return this.canvas.height;
    },
    set: function set$$1(v) {
      this.canvas.height = v;
      this.bounds.height = v;
    }
  }, {
    key: "elementWidth",
    get: function get$$1() {
      return this.canvas.clientWidth * devicePixelRatio;
    },
    set: function set$$1(v) {
      this.canvas.style.width = v / devicePixelRatio + "px";
    }
  }, {
    key: "elementHeight",
    get: function get$$1() {
      return this.canvas.clientHeight * devicePixelRatio;
    },
    set: function set$$1(v) {
      this.canvas.style.height = v / devicePixelRatio + "px";
    }
  }, {
    key: "surfaceWidth",
    get: function get$$1() {
      return this.canvas.parentElement ? this.elementWidth : this.bounds.width;
    }
  }, {
    key: "surfaceHeight",
    get: function get$$1() {
      return this.canvas.parentElement ? this.elementHeight : this.bounds.height;
    }
  }, {
    key: "resized",
    get: function get$$1() {
      return this.imageWidth !== this.surfaceWidth || this.imageHeight !== this.surfaceHeight;
    }
  }, {
    key: "environment",
    get: function get$$1() {
      var head = this;
      while (head) {
        if (head._environment) {
          if (head !== this) {
            this._environment = head._environment;
          }
          return this._environment;
        }
        head = head.parent;
      }
    }
  }, {
    key: "theme",
    get: function get$$1() {
      return null;
    },
    set: function set$$1(v) {
      for (var i = 0; i < this.subSurfaces.length; ++i) {
        this.subSurfaces[i].theme = v;
      }
    }
  }, {
    key: "lockMovement",
    get: function get$$1() {
      var lock = false;
      for (var i = 0; i < this.subSurfaces.length && !lock; ++i) {
        lock = lock || this.subSurfaces[i].lockMovement;
      }
      return lock;
    }
  }, {
    key: "focusedElement",
    get: function get$$1() {
      var result = null,
          head = this;
      while (head && head.focused) {
        result = head;
        var subSurfaces = head.subSurfaces;
        head = null;
        for (var i = 0; i < subSurfaces.length; ++i) {
          var subSurface = subSurfaces[i];
          if (subSurface.focused) {
            head = subSurface;
          }
        }
      }
      return result;
    }
  }]);
  return Surface;
}(BaseTextured);

var Default = {
  name: "Light",
  fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
  cursorColor: "black",
  fontSize: 16,
  lineNumbers: {
    foreColor: "black"
  },
  regular: {
    backColor: "white",
    foreColor: "black",
    currentRowBackColor: "#f0f0f0",
    selectedBackColor: "#c0c0c0",
    unfocused: "rgba(0, 0, 255, 0.25)"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "grey",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "blue"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};

var COUNTER$3 = 0;

var Label = function (_Surface) {
  inherits(Label, _Surface);

  function Label(options) {
    classCallCheck(this, Label);

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////

    var _this = possibleConstructorReturn(this, (Label.__proto__ || Object.getPrototypeOf(Label)).call(this, Object.assign({}, {
      id: "Primrose.Controls.Label[" + COUNTER$3++ + "]"
    }, options)));
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////


    _this._lastFont = null;
    _this._lastText = null;
    _this._lastCharacterWidth = null;
    _this._lastCharacterHeight = null;
    _this._lastPadding = null;
    _this._lastWidth = -1;
    _this._lastHeight = -1;
    _this._lastTextAlign = null;

    _this.textAlign = _this.options.textAlign;
    _this.character = new Size();
    _this.theme = _this.options.theme;
    _this.fontSize = _this.options.fontSize || 16;
    _this.refreshCharacter();
    _this.backgroundColor = _this.options.backgroundColor || _this.theme.regular.backColor;
    _this.color = _this.options.color || _this.theme.regular.foreColor;
    _this.value = _this.options.value;
    return _this;
  }

  createClass(Label, [{
    key: "refreshCharacter",
    value: function refreshCharacter() {
      this.character.height = this.fontSize;
      this.context.font = this.character.height + "px " + this.theme.fontFamily;
      // measure 100 letter M's, then divide by 100, to get the width of an M
      // to two decimal places on systems that return integer values from
      // measureText.
      this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
    }
  }, {
    key: "_isChanged",
    value: function _isChanged() {
      var textChanged = this._lastText !== this.value,
          characterWidthChanged = this.character.width !== this._lastCharacterWidth,
          characterHeightChanged = this.character.height !== this._lastCharacterHeight,
          fontChanged = this.context.font !== this._lastFont,
          alignChanged = this.textAlign !== this._lastTextAlign,
          changed = this.resized || textChanged || characterWidthChanged || characterHeightChanged || this.resized || fontChanged || alignChanged;
      return changed;
    }
  }, {
    key: "render",
    value: function render() {
      if (this.resized) {
        this.resize();
      }

      if (this.theme && this._isChanged) {
        this._lastText = this.value;
        this._lastCharacterWidth = this.character.width;
        this._lastCharacterHeight = this.character.height;
        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;
        this._lastFont = this.context.font;
        this._lastTextAlign = this.textAlign;

        this.context.textAlign = this.textAlign || "left";

        var clearFunc = this.backgroundColor ? "fillRect" : "clearRect";
        if (this.theme.regular.backColor) {
          this.context.fillStyle = this.backgroundColor;
        }

        this.context[clearFunc](0, 0, this.imageWidth, this.imageHeight);

        if (this.value) {
          var lines = this.value.split("\n");
          for (var y = 0; y < lines.length; ++y) {
            var line = lines[y],
                textY = (this.imageHeight - lines.length * this.character.height) / 2 + y * this.character.height;

            var textX = null;
            switch (this.textAlign) {
              case "right":
                textX = this.imageWidth;
                break;
              case "center":
                textX = this.imageWidth / 2;
                break;
              default:
                textX = 0;
            }

            var font = (this.theme.regular.fontWeight || "") + " " + (this.theme.regular.fontStyle || "") + " " + this.character.height + "px " + this.theme.fontFamily;
            this.context.font = font.trim();
            this.context.fillStyle = this.color;
            this.context.fillText(line, textX, textY);
          }
        }

        this.renderCanvasTrim();

        this.invalidate();
      }
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {}
  }, {
    key: "textAlign",
    get: function get$$1() {
      return this.context.textAlign;
    },
    set: function set$$1(v) {
      this.context.textAlign = v;
      this.render();
    }
  }, {
    key: "value",
    get: function get$$1() {
      return this._value;
    },
    set: function set$$1(txt) {
      txt = txt || "";
      this._value = txt.replace(/\r\n/g, "\n");
      this.render();
    }
  }, {
    key: "theme",
    get: function get$$1() {
      return this._theme;
    },
    set: function set$$1(t) {
      this._theme = Object.assign({}, Default, t);
      this._theme.fontSize = this.fontSize;
      this.refreshCharacter();
      this.render();
    }
  }]);
  return Label;
}(Surface);

var COUNTER$2 = 0;

var Button2D = function (_Label) {
  inherits(Button2D, _Label);

  function Button2D(options) {
    classCallCheck(this, Button2D);

    var _this = possibleConstructorReturn(this, (Button2D.__proto__ || Object.getPrototypeOf(Button2D)).call(this, Object.assign({}, {
      id: "Primrose.Controls.Button2D[" + COUNTER$2++ + "]",
      textAlign: "center"
    }, options)));

    _this._lastActivated = null;
    return _this;
  }

  createClass(Button2D, [{
    key: "startPointer",
    value: function startPointer(x, y) {
      this.focus();
      this._activated = true;
      this.render();
    }
  }, {
    key: "endPointer",
    value: function endPointer() {
      if (this._activated) {
        this._activated = false;
        this.emit("click", {
          target: this
        });
        this.render();
      }
    }
  }, {
    key: "_isChanged",
    value: function _isChanged() {
      var activatedChanged = this._activated !== this._lastActivated,
          changed = get(Button2D.prototype.__proto__ || Object.getPrototypeOf(Button2D.prototype), "_isChanged", this) || activatedChanged;
      return changed;
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {
      this.context.lineWidth = this._activated ? 4 : 2;
      this.context.strokeStyle = this.theme.regular.foreColor || Primrose.Text.Themes.Default.regular.foreColor;
      this.context.strokeRect(0, 0, this.imageWidth, this.imageHeight);
    }
  }]);
  return Button2D;
}(Label);

var Button3D = function (_Entity) {
  inherits(Button3D, _Entity);

  function Button3D(model, buttonName, options) {
    classCallCheck(this, Button3D);

    var _this = possibleConstructorReturn(this, (Button3D.__proto__ || Object.getPrototypeOf(Button3D)).call(this, buttonName, Object.assign({}, Button3D.DEFAULTS, options)));

    _this.options.minDeflection = Math.cos(_this.options.minDeflection);
    _this.options.colorUnpressed = new Color(_this.options.colorUnpressed);
    _this.options.colorPressed = new Color(_this.options.colorPressed);

    _this.base = model.children[1];

    _this.cap = model.children[0];
    _this.cap.name = buttonName;
    _this.cap.material = _this.cap.material.clone();
    _this.cap.button = _this;
    _this.cap.base = _this.base;

    _this.add(_this.base);
    _this.add(_this.cap);

    _this.color = _this.cap.material.color;

    _this.name = buttonName;

    _this.element = null;
    return _this;
  }

  createClass(Button3D, [{
    key: "startUV",
    value: function startUV(point) {

      this.color.copy(this.options.colorPressed);
      if (this.element) {
        this.element.click();
      } else {
        this.emit("click", { source: this });
      }
    }
  }, {
    key: "endPointer",
    value: function endPointer(evt) {

      this.color.copy(this.options.colorUnpressed);
      this.emit("release", { source: this });
    }
  }, {
    key: "consumeEvent",
    value: function consumeEvent(evt) {
      var _this2 = this;

      switch (evt.type) {
        case "pointerstart":
          this.startUV();
          break;
        case "pointerend":
          this.endPointer(evt);
          break;
        case "gazecomplete":
          this.startUV();
          setTimeout(function () {
            return _this2.endPointer(evt);
          }, 100);
          break;
      }
    }
  }]);
  return Button3D;
}(Entity);

Button3D.DEFAULTS = {
  maxThrow: 0.1,
  minDeflection: 10,
  colorUnpressed: 0x7f0000,
  colorPressed: 0x007f00,
  toggle: true
};

var buttonCount = 0;

var ButtonFactory = function () {
  function ButtonFactory(templateFile, options) {
    classCallCheck(this, ButtonFactory);

    this.options = options;

    this.template = templateFile;
  }

  createClass(ButtonFactory, [{
    key: "create",
    value: function create(toggle) {
      var name = "button" + ++buttonCount;
      var obj = this.template.clone();
      var btn = new Button3D(obj, name, this.options, toggle);
      return btn;
    }
  }]);
  return ButtonFactory;
}();

ButtonFactory.DEFAULT = new ButtonFactory(colored(box(1, 1, 1), 0xff0000), {
  maxThrow: 0.1,
  minDeflection: 10,
  colorUnpressed: 0x7f0000,
  colorPressed: 0x007f00,
  toggle: true
});

var COUNTER$5 = 0;

var Image = function (_BaseTextured) {
  inherits(Image, _BaseTextured);

  function Image(images, options) {
    classCallCheck(this, Image);

    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////
    if (!(images instanceof Array)) {
      images = [images];
    }

    options = Object.assign({}, {
      id: "Primrose.Controls.Image[" + COUNTER$5++ + "]"
    }, options);

    return possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, images, options));
  }

  createClass(Image, [{
    key: "_loadFiles",
    value: function _loadFiles(images, progress) {
      var _this2 = this;

      return Promise.all(Array.prototype.map.call(images, function (src, i) {
        var loadOptions = Object.assign({}, _this2.options, {
          progress: progress
        });

        _this2._meshes[i] = _this2._geometry.textured(src, loadOptions).named(_this2.name + "-mesh-" + i);

        return loadOptions.promise.then(function (txt) {
          return _this2._textures[i] = txt;
        });
      }));
    }
  }]);
  return Image;
}(BaseTextured);

// The JSON format object loader is not always included in the Three.js distribution,
// so we have to first check for it.
var loaders = null;
var PATH_PATTERN = /((?:https?:\/\/)?(?:[^/]+\/)+)(\w+)(\.(?:\w+))$/;
var EXTENSION_PATTERN = /(\.(?:\w+))+$/;

function loader(map, key) {
  return function (obj) {
    return ModelFactory.loadObject(map[key]).then(function (model) {
      obj[key] = model;
      return obj;
    });
  };
}

// Sometimes, the properties that export out of Blender and into Three.js don't
// come out correctly, so we need to do a correction.
function fixJSONScene(json) {
  json.traverse(function (obj) {
    if (obj.geometry) {
      obj.geometry.computeBoundingSphere();
      obj.geometry.computeBoundingBox();
    }
  });
  return json;
}

function fixOBJScene(group) {
  if (group.type === "Group" && group.children.length === 1 && group.children[0].isMesh) {
    return group.children[0];
  }
  return group;
}

var propertyTests = {
  isButton: function isButton(obj) {
    return obj.material && obj.material.name.match(/^button\d+$/);
  },
  isSolid: function isSolid(obj) {
    return !obj.name.match(/^(water|sky)/);
  },
  isGround: function isGround(obj) {
    return obj.material && obj.material.name && obj.material.name.match(/\bground\b/);
  }
};

function setProperties(object) {
  object.traverse(function (obj) {
    if (obj.isMesh) {
      for (var prop in propertyTests) {
        obj[prop] = obj[prop] || propertyTests[prop](obj);
      }
    }
  });
  return object;
}

var ModelFactory = function () {
  createClass(ModelFactory, null, [{
    key: "loadModel",
    value: function loadModel(src, type, progress) {
      return ModelFactory.loadObject(src, type, progress).then(function (scene) {
        while (scene && scene.type === "Group") {
          scene = scene.children[0];
        }
        return new ModelFactory(scene);
      });
    }
  }, {
    key: "loadObject",
    value: function loadObject(src, type, progress) {

      var extMatch = src.match(EXTENSION_PATTERN),
          extension = type && "." + type || extMatch[0];
      if (!extension) {
        return Promise.reject("File path `" + src + "` does not have a file extension, and a type was not provided as a parameter, so we can't determine the type.");
      } else {
        extension = extension.toLowerCase();
        if (loaders === null) {
          loaders = {
            ".json": ObjectLoader,
            ".mtl": MTLLoader,
            ".obj": OBJLoader,
            ".typeface.json": FontLoader
          };
        }
        var LoaderType = loaders[extension];
        if (!LoaderType) {
          return Promise.reject("There is no loader type for the file extension: " + extension);
        } else {
          var loader = new LoaderType(),
              name = src.substring(0, extMatch.index),
              elemID = name + "_" + extension.toLowerCase(),
              elem = document.getElementById(elemID),
              promise = Promise.resolve();
          if (extension === ".obj") {
            var newPath = src.replace(EXTENSION_PATTERN, ".mtl");
            promise = promise.then(function () {
              return ModelFactory.loadObject(newPath, "mtl", progress);
            }).then(function (materials) {
              materials.preload();
              loader.setMaterials(materials);
            }).catch(console.error.bind(console, "Error loading MTL file: " + newPath));
          } else if (extension === ".mtl") {
            var match = src.match(PATH_PATTERN);
            if (match) {
              var dir = match[1];
              src = match[2] + match[3];
              loader.setTexturePath(dir);
              loader.setPath(dir);
            }
          }

          if (elem) {
            var elemSource = elem.innerHTML.split(/\r?\n/g).map(function (s) {
              return s.trim();
            }).join("\n");
            promise = promise.then(function () {
              return loader.parse(elemSource);
            });
          } else {
            if (loader.setCrossOrigin) {
              loader.setCrossOrigin("anonymous");
            }
            promise = promise.then(function () {
              return new Promise(function (resolve, reject) {
                return loader.load(src, resolve, progress, reject);
              });
            });
          }

          if (extension === ".obj") {
            promise = promise.then(fixOBJScene);
          }

          if (extension === ".json") {
            promise = promise.then(fixJSONScene);
          }

          if (extension !== ".mtl" && extension !== ".typeface.json") {
            promise = promise.then(setProperties);
          }
          promise = promise.catch(console.error.bind(console, "MODEL_ERR", src));
          return promise;
        }
      }
    }
  }, {
    key: "loadObjects",
    value: function loadObjects(map) {

      var output = {},
          promise = Promise.resolve(output);
      for (var key in map) {
        if (map[key]) {
          promise = promise.then(loader(map, key));
        }
      }
      return promise;
    }
  }]);

  function ModelFactory(template) {
    classCallCheck(this, ModelFactory);

    this.template = template;
  }

  createClass(ModelFactory, [{
    key: "clone",
    value: function clone() {
      var _this = this;

      var obj = this.template.clone();

      obj.traverse(function (child) {
        if (child.isSkinnedMesh) {
          obj.animation = new AnimationClip(child, child.geometry.animation);
          if (!_this.template.originalAnimationClipData && obj.animation.data) {
            _this.template.originalAnimationClipData = obj.animation.data;
          }
          if (!obj.animation.data) {
            obj.animation.data = _this.template.originalAnimationClipData;
          }
        }
      });

      setProperties(obj);
      return obj;
    }
  }]);
  return ModelFactory;
}();

var heightTester = new Raycaster();

heightTester.ray.direction.set(0, -1, 0);

var Ground = function (_Entity) {
  inherits(Ground, _Entity);

  function Ground(options) {
    classCallCheck(this, Ground);
    return possibleConstructorReturn(this, (Ground.__proto__ || Object.getPrototypeOf(Ground)).call(this, "Ground", {
      transparent: false,
      dim: options.drawDistance,
      texture: options.groundTexture,
      model: options.groundModel,
      shadow: options.enableShadows,
      progress: options.progress
    }));
  }

  createClass(Ground, [{
    key: "moveTo",
    value: function moveTo(pos) {
      if (this.isInfinite) {
        this.position.set(Math.floor(pos.x), 0, Math.floor(pos.z));
      }
    }
  }, {
    key: "getHeightAt",
    value: function getHeightAt(pos) {
      if (this.model) {
        heightTester.ray.origin.copy(pos);
        heightTester.ray.origin.y = 100;
        var hits = heightTester.intersectObject(this.model);
        if (hits.length > 0) {
          var hit = hits[0];
          return 100 - hit.distance;
        }
      }
    }
  }, {
    key: "_ready",
    get: function get$$1() {
      var _this2 = this;

      var dim = this.options.dim,
          type = _typeof(this.options.texture);

      var promise = null;

      this.model = null;
      this.isInfinite = null;

      if (this.options.model) {
        promise = ModelFactory.loadObject(this.options.model).then(function (model) {
          _this2.model = model;
          _this2.isInfinite = false;
        });
      } else {
        if (type === "number") {
          this.model = quad(dim, dim).colored(this.options.texture, this.options).rot(-Math.PI / 2, 0, 0);
          promise = Promise.resolve();
        } else if (type === "string") {
          this.model = new Image(this.options.texture, Object.assign({}, this.options, {
            width: dim,
            height: dim,
            txtRepeatX: dim,
            txtRepeatY: dim,
            anisotropy: 8
          })).rot(-Math.PI / 2, 0, 0);

          promise = this.model.ready;
        }

        if (promise) {
          this.isInfinite = true;
        } else {
          promise = Promise.reject("Couldn't figure out how to make the ground out of " + this.options.texture);
        }
      }

      promise = promise.then(function () {
        _this2.model.receiveShadow = _this2.options.shadow;
        _this2.model.named(_this2.name + "-" + (_this2.options.model || _this2.options.texture)).addTo(_this2);

        _this2.watch(_this2.model, Pointer.EVENTS);
      });

      return promise;
    }
  }]);
  return Ground;
}(Entity);

var Sky = function (_Entity) {
  inherits(Sky, _Entity);

  function Sky(options) {
    classCallCheck(this, Sky);

    var _this = possibleConstructorReturn(this, (Sky.__proto__ || Object.getPrototypeOf(Sky)).call(this, "Sky", {
      transparent: false,
      useFog: false,
      unshaded: true,
      skyRadius: options.drawDistance,
      texture: options.skyTexture,
      progress: options.progress,
      enableShadows: options.enableShadows,
      shadowMapSize: options.shadowMapSize,
      shadowCameraSize: options.shadowCameraSize,
      shadowRadius: options.shadowRadius
    }));

    _this._image = null;

    if (options.disableDefaultLighting) {
      _this.ambient = null;
      _this.sun = null;
    } else {

      _this.ambient = new AmbientLight(0xffffff, 0.5).addTo(_this);

      _this.sun = new DirectionalLight(0xffffff, 1).addTo(_this).at(0, 100, 100);

      _this.add(_this.sun.target);

      if (_this.options.enableShadows) {
        _this.sun.castShadow = true;
        _this.sun.shadow.mapSize.width = _this.sun.shadow.mapSize.height = _this.options.shadowMapSize;
        _this.sun.shadow.radius = _this.options.shadowRadius;
        _this.sun.shadow.camera.top = _this.sun.shadow.camera.right = _this.options.shadowCameraSize;
        _this.sun.shadow.camera.bottom = _this.sun.shadow.camera.left = -_this.options.shadowCameraSize;
        _this.sun.shadow.camera.updateProjectionMatrix();
      }
    }
    return _this;
  }

  createClass(Sky, [{
    key: "replace",
    value: function replace(files) {
      this.options.texture = files;
      this.children.splice(0);
      return this._ready;
    }
  }, {
    key: "_ready",
    get: function get$$1() {
      var type = _typeof(this.options.texture);
      if (type === "number") {
        var skyDim = this.options.skyRadius / Math.sqrt(2);
        this.options.side = BackSide;
        this.add(box(skyDim, skyDim, skyDim).colored(this.options.texture, this.options));
      } else if (type === "string" || this.options.texture instanceof Array && this.options.texture.length === 6 && typeof this.options.texture[0] === "string") {
        this._image = new Image(this.options.texture, this.options);
        this.add(this._image);
      }

      return this._image && this._image.ready || get(Sky.prototype.__proto__ || Object.getPrototypeOf(Sky.prototype), "_ready", this);
    }
  }]);
  return Sky;
}(Entity);

// unicode-aware string reverse
var reverse = function () {
  var combiningMarks = /(<%= allExceptCombiningMarks %>)(<%= combiningMarks %>+)/g,
      surrogatePair = /(<%= highSurrogates %>)(<%= lowSurrogates %>)/g;

  function reverse(str) {
    str = str.replace(combiningMarks, function (match, capture1, capture2) {
      return reverse(capture2) + capture1;
    }).replace(surrogatePair, "$2$1");
    var res = "";
    for (var i = str.length - 1; i >= 0; --i) {
      res += str[i];
    }
    return res;
  }
  return reverse;
}();

var Cursor = function () {
  createClass(Cursor, null, [{
    key: "min",
    value: function min(a, b) {
      if (a.i <= b.i) {
        return a;
      }
      return b;
    }
  }, {
    key: "max",
    value: function max(a, b) {
      if (a.i > b.i) {
        return a;
      }
      return b;
    }
  }]);

  function Cursor(i, x, y) {
    classCallCheck(this, Cursor);

    this.i = i || 0;
    this.x = x || 0;
    this.y = y || 0;
    this.moved = true;
  }

  createClass(Cursor, [{
    key: "clone",
    value: function clone() {
      return new Cursor(this.i, this.x, this.y);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[i:" + this.i + " x:" + this.x + " y:" + this.y + "]";
    }
  }, {
    key: "copy",
    value: function copy(cursor) {
      this.i = cursor.i;
      this.x = cursor.x;
      this.y = cursor.y;
      this.moved = false;
    }
  }, {
    key: "fullhome",
    value: function fullhome() {
      this.i = 0;
      this.x = 0;
      this.y = 0;
      this.moved = true;
    }
  }, {
    key: "fullend",
    value: function fullend(lines) {
      this.i = 0;
      var lastLength = 0;
      for (var y = 0; y < lines.length; ++y) {
        var line = lines[y];
        lastLength = line.length;
        this.i += lastLength;
      }
      this.y = lines.length - 1;
      this.x = lastLength;
      this.moved = true;
    }
  }, {
    key: "skipleft",
    value: function skipleft(lines) {
      if (this.x === 0) {
        this.left(lines);
      } else {
        var x = this.x - 1;
        var line = lines[this.y];
        var word = reverse(line.substring(0, x));
        var m = word.match(/(\s|\W)+/);
        var dx = m ? m.index + m[0].length + 1 : word.length;
        this.i -= dx;
        this.x -= dx;
      }
      this.moved = true;
    }
  }, {
    key: "left",
    value: function left(lines) {
      if (this.i > 0) {
        --this.i;
        --this.x;
        if (this.x < 0) {
          --this.y;
          var line = lines[this.y];
          this.x = line.length;
        }
        if (this.reverseFromNewline(lines)) {
          ++this.i;
        }
      }
      this.moved = true;
    }
  }, {
    key: "skipright",
    value: function skipright(lines) {
      var line = lines[this.y];
      if (this.x === line.length || line[this.x] === '\n') {
        this.right(lines);
      } else {
        var x = this.x + 1;
        line = line.substring(x);
        var m = line.match(/(\s|\W)+/);
        var dx = m ? m.index + m[0].length + 1 : line.length - this.x;
        this.i += dx;
        this.x += dx;
        this.reverseFromNewline(lines);
      }
      this.moved = true;
    }
  }, {
    key: "fixCursor",
    value: function fixCursor(lines) {
      this.x = this.i;
      this.y = 0;
      var total = 0;
      var line = lines[this.y];
      while (this.x > line.length) {
        this.x -= line.length;
        total += line.length;
        if (this.y >= lines.length - 1) {
          this.i = total;
          this.x = line.length;
          this.moved = true;
          break;
        }
        ++this.y;
        line = lines[this.y];
      }
      return this.moved;
    }
  }, {
    key: "right",
    value: function right(lines) {
      this.advanceN(lines, 1);
    }
  }, {
    key: "advanceN",
    value: function advanceN(lines, n) {
      var line = lines[this.y];
      if (this.y < lines.length - 1 || this.x < line.length) {
        this.i += n;
        this.fixCursor(lines);
        line = lines[this.y];
        if (this.x > 0 && line[this.x - 1] === '\n') {
          ++this.y;
          this.x = 0;
        }
      }
      this.moved = true;
    }
  }, {
    key: "home",
    value: function home() {
      this.i -= this.x;
      this.x = 0;
      this.moved = true;
    }
  }, {
    key: "end",
    value: function end(lines) {
      var line = lines[this.y];
      var dx = line.length - this.x;
      this.i += dx;
      this.x += dx;
      this.reverseFromNewline(lines);
      this.moved = true;
    }
  }, {
    key: "up",
    value: function up(lines) {
      if (this.y > 0) {
        --this.y;
        var line = lines[this.y];
        var dx = Math.min(0, line.length - this.x);
        this.x += dx;
        this.i -= line.length - dx;
        this.reverseFromNewline(lines);
      }
      this.moved = true;
    }
  }, {
    key: "down",
    value: function down(lines) {
      if (this.y < lines.length - 1) {
        ++this.y;
        var line = lines[this.y];
        var pLine = lines[this.y - 1];
        var dx = Math.min(0, line.length - this.x);
        this.x += dx;
        this.i += pLine.length + dx;
        this.reverseFromNewline(lines);
      }
      this.moved = true;
    }
  }, {
    key: "incY",
    value: function incY(dy, lines) {
      this.y = Math.max(0, Math.min(lines.length - 1, this.y + dy));
      var line = lines[this.y];
      this.x = Math.max(0, Math.min(line.length, this.x));
      this.i = this.x;
      for (var i = 0; i < this.y; ++i) {
        this.i += lines[i].length;
      }
      this.reverseFromNewline(lines);
      this.moved = true;
    }
  }, {
    key: "setXY",
    value: function setXY(x, y, lines) {
      this.y = Math.max(0, Math.min(lines.length - 1, y));
      var line = lines[this.y];
      this.x = Math.max(0, Math.min(line.length, x));
      this.i = this.x;
      for (var i = 0; i < this.y; ++i) {
        this.i += lines[i].length;
      }
      this.reverseFromNewline(lines);
      this.moved = true;
    }
  }, {
    key: "setI",
    value: function setI(i, lines) {
      this.i = i;
      this.fixCursor(lines);
      this.moved = true;
    }
  }, {
    key: "reverseFromNewline",
    value: function reverseFromNewline(lines) {
      var line = lines[this.y];
      if (this.x > 0 && line[this.x - 1] === '\n') {
        --this.x;
        --this.i;
        return true;
      }
      return false;
    }
  }]);
  return Cursor;
}();

var CommandPack = function CommandPack(commandPackName, commands) {
  classCallCheck(this, CommandPack);

  this.name = commandPackName;
  Object.assign(this, commands);
};

var BasicTextInput = function (_CommandPack) {
  inherits(BasicTextInput, _CommandPack);

  function BasicTextInput(additionalName, additionalCommands) {
    classCallCheck(this, BasicTextInput);

    var commands = {
      NORMAL_LEFTARROW: function NORMAL_LEFTARROW(prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPLEFT: function NORMAL_SKIPLEFT(prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.frontCursor);
      },
      NORMAL_RIGHTARROW: function NORMAL_RIGHTARROW(prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.frontCursor);
      },
      NORMAL_SKIPRIGHT: function NORMAL_SKIPRIGHT(prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.frontCursor);
      },
      NORMAL_HOME: function NORMAL_HOME(prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.frontCursor);
      },
      NORMAL_END: function NORMAL_END(prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.frontCursor);
      },
      NORMAL_BACKSPACE: function NORMAL_BACKSPACE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.left(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
        prim.emit("change", {
          target: prim
        });
      },
      NORMAL_DELETE: function NORMAL_DELETE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.backCursor.right(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      NORMAL_TAB: function NORMAL_TAB(prim, tokenRows) {
        prim.selectedText = prim.tabString;
      },

      SHIFT_LEFTARROW: function SHIFT_LEFTARROW(prim, tokenRows) {
        prim.cursorLeft(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPLEFT: function SHIFT_SKIPLEFT(prim, tokenRows) {
        prim.cursorSkipLeft(tokenRows, prim.backCursor);
      },
      SHIFT_RIGHTARROW: function SHIFT_RIGHTARROW(prim, tokenRows) {
        prim.cursorRight(tokenRows, prim.backCursor);
      },
      SHIFT_SKIPRIGHT: function SHIFT_SKIPRIGHT(prim, tokenRows) {
        prim.cursorSkipRight(tokenRows, prim.backCursor);
      },
      SHIFT_HOME: function SHIFT_HOME(prim, tokenRows) {
        prim.cursorHome(tokenRows, prim.backCursor);
      },
      SHIFT_END: function SHIFT_END(prim, tokenRows) {
        prim.cursorEnd(tokenRows, prim.backCursor);
      },
      SHIFT_DELETE: function SHIFT_DELETE(prim, tokenRows) {
        if (prim.frontCursor.i === prim.backCursor.i) {
          prim.frontCursor.home(tokenRows);
          prim.backCursor.end(tokenRows);
        }
        prim.selectedText = "";
        prim.scrollIntoView(prim.frontCursor);
      },
      CTRL_HOME: function CTRL_HOME(prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.frontCursor);
      },
      CTRL_END: function CTRL_END(prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.frontCursor);
      },

      CTRLSHIFT_HOME: function CTRLSHIFT_HOME(prim, tokenRows) {
        prim.cursorFullHome(tokenRows, prim.backCursor);
      },
      CTRLSHIFT_END: function CTRLSHIFT_END(prim, tokenRows) {
        prim.cursorFullEnd(tokenRows, prim.backCursor);
      },

      SELECT_ALL: function SELECT_ALL(prim, tokenRows) {
        prim.frontCursor.fullhome(tokenRows);
        prim.backCursor.fullend(tokenRows);
      },

      REDO: function REDO(prim, tokenRows) {
        prim.redo();
        prim.scrollIntoView(prim.frontCursor);
      },
      UNDO: function UNDO(prim, tokenRows) {
        prim.undo();
        prim.scrollIntoView(prim.frontCursor);
      }
    };

    if (additionalCommands) {
      for (var key in additionalCommands) {
        commands[key] = additionalCommands[key];
      }
    }

    return possibleConstructorReturn(this, (BasicTextInput.__proto__ || Object.getPrototypeOf(BasicTextInput)).call(this, additionalName || "Text editor commands", commands));
  }

  return BasicTextInput;
}(CommandPack);

var TextEditor = new BasicTextInput("Text Area input commands", {
  NORMAL_UPARROW: function NORMAL_UPARROW(prim, tokenRows) {
    prim.cursorUp(tokenRows, prim.frontCursor);
  },
  NORMAL_DOWNARROW: function NORMAL_DOWNARROW(prim, tokenRows) {
    prim.cursorDown(tokenRows, prim.frontCursor);
  },
  NORMAL_PAGEUP: function NORMAL_PAGEUP(prim, tokenRows) {
    prim.cursorPageUp(tokenRows, prim.frontCursor);
  },
  NORMAL_PAGEDOWN: function NORMAL_PAGEDOWN(prim, tokenRows) {
    prim.cursorPageDown(tokenRows, prim.frontCursor);
  },
  NORMAL_ENTER: function NORMAL_ENTER(prim, tokenRows, currentToken) {
    var indent = "";
    var tokenRow = tokenRows[prim.frontCursor.y];
    if (tokenRow.length > 0 && tokenRow[0].type === "whitespace") {
      indent = tokenRow[0].value;
    }
    prim.selectedText = "\n" + indent;
    prim.scrollIntoView(prim.frontCursor);
  },

  SHIFT_UPARROW: function SHIFT_UPARROW(prim, tokenRows) {
    prim.cursorUp(tokenRows, prim.backCursor);
  },
  SHIFT_DOWNARROW: function SHIFT_DOWNARROW(prim, tokenRows) {
    prim.cursorDown(tokenRows, prim.backCursor);
  },
  SHIFT_PAGEUP: function SHIFT_PAGEUP(prim, tokenRows) {
    prim.cursorPageUp(tokenRows, prim.backCursor);
  },
  SHIFT_PAGEDOWN: function SHIFT_PAGEDOWN(prim, tokenRows) {
    prim.cursorPageDown(tokenRows, prim.backCursor);
  },

  WINDOW_SCROLL_DOWN: function WINDOW_SCROLL_DOWN(prim, tokenRows) {
    if (prim.scroll.y < tokenRows.length) {
      ++prim.scroll.y;
    }
  },
  WINDOW_SCROLL_UP: function WINDOW_SCROLL_UP(prim, tokenRows) {
    if (prim.scroll.y > 0) {
      --prim.scroll.y;
    }
  }
});

var Rule = function () {
  function Rule(name, test) {
    classCallCheck(this, Rule);

    this.name = name;
    this.test = test;
  }

  createClass(Rule, [{
    key: "carveOutMatchedToken",
    value: function carveOutMatchedToken(tokens, j) {
      var token = tokens[j];
      if (token.type === "regular") {
        var res = this.test.exec(token.value);
        if (res) {
          // Only use the last group that matches the regex, to allow for more
          // complex regexes that can match in special contexts, but not make
          // the context part of the token.
          var midx = res[res.length - 1],
              start = res.input.indexOf(midx),
              end = start + midx.length;
          if (start === 0) {
            // the rule matches the start of the token
            token.type = this.name;
            if (end < token.value.length) {
              // but not the end
              var next = token.splitAt(end);
              next.type = "regular";
              tokens.splice(j + 1, 0, next);
            }
          } else {
            // the rule matches from the middle of the token
            var mid = token.splitAt(start);
            if (midx.length < mid.value.length) {
              // but not the end
              var right = mid.splitAt(midx.length);
              tokens.splice(j + 1, 0, right);
            }
            mid.type = this.name;
            tokens.splice(j + 1, 0, mid);
          }
        }
      }
    }
  }]);
  return Rule;
}();

var Token = function () {
  function Token(value, type, index, line) {
    classCallCheck(this, Token);

    this.value = value;
    this.type = type;
    this.index = index;
    this.line = line;
  }

  createClass(Token, [{
    key: "clone",
    value: function clone() {
      return new Token(this.value, this.type, this.index, this.line);
    }
  }, {
    key: "splitAt",
    value: function splitAt(i) {
      var next = this.value.substring(i);
      this.value = this.value.substring(0, i);
      return new Token(next, this.type, this.index + i, this.line);
    }
  }, {
    key: "toString",
    value: function toString() {
      return "[" + this.type + ": " + this.value + "]";
    }
  }]);
  return Token;
}();

var Grammar = function () {
  function Grammar(grammarName, rules) {
    classCallCheck(this, Grammar);

    this.name = grammarName;

    // clone the preprocessing grammar to start a new grammar
    this.grammar = rules.map(function (rule) {
      return new Rule(rule[0], rule[1]);
    });

    function crudeParsing(tokens) {
      var commentDelim = null,
          stringDelim = null,
          line = 0,
          i,
          t;
      for (i = 0; i < tokens.length; ++i) {
        t = tokens[i];
        t.line = line;
        if (t.type === "newlines") {
          ++line;
        }

        if (stringDelim) {
          if (t.type === "stringDelim" && t.value === stringDelim && (i === 0 || tokens[i - 1].value[tokens[i - 1].value.length - 1] !== "\\")) {
            stringDelim = null;
          }
          if (t.type !== "newlines") {
            t.type = "strings";
          }
        } else if (commentDelim) {
          if (commentDelim === "startBlockComments" && t.type === "endBlockComments" || commentDelim === "startLineComments" && t.type === "newlines") {
            commentDelim = null;
          }
          if (t.type !== "newlines") {
            t.type = "comments";
          }
        } else if (t.type === "stringDelim") {
          stringDelim = t.value;
          t.type = "strings";
        } else if (t.type === "startBlockComments" || t.type === "startLineComments") {
          commentDelim = t.type;
          t.type = "comments";
        }
      }

      // recombine like-tokens
      for (i = tokens.length - 1; i > 0; --i) {
        var p = tokens[i - 1];
        t = tokens[i];
        if (p.type === t.type && p.type !== "newlines") {
          p.value += t.value;
          tokens.splice(i, 1);
        }
      }
    }

    this.tokenize = function (text) {
      // all text starts off as regular text, then gets cut up into tokens of
      // more specific type
      var tokens = [new Token(text, "regular", 0)];
      for (var i = 0; i < this.grammar.length; ++i) {
        var rule = this.grammar[i];
        for (var j = 0; j < tokens.length; ++j) {
          rule.carveOutMatchedToken(tokens, j);
        }
      }

      crudeParsing(tokens);
      return tokens;
    };
  }

  createClass(Grammar, [{
    key: "toHTML",
    value: function toHTML(txt) {
      var theme = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Default;

      var tokenRows = this.tokenize(txt),
          temp = document.createElement("div");
      for (var y = 0; y < tokenRows.length; ++y) {
        // draw the tokens on this row
        var t = tokenRows[y];
        if (t.type === "newlines") {
          temp.appendChild(document.createElement("br"));
        } else {
          var style = theme[t.type] || {},
              elem = document.createElement("span");
          elem.style.fontWeight = style.fontWeight || theme.regular.fontWeight;
          elem.style.fontStyle = style.fontStyle || theme.regular.fontStyle || "";
          elem.style.color = style.foreColor || theme.regular.foreColor;
          elem.style.backgroundColor = style.backColor || theme.regular.backColor;
          elem.style.fontFamily = style.fontFamily || theme.fontFamily;
          elem.appendChild(document.createTextNode(t.value));
          temp.appendChild(elem);
        }
      }
      return temp.innerHTML;
    }
  }]);
  return Grammar;
}();

var JavaScript = new Grammar("JavaScript", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /\/\*/], ["endBlockComments", /\*\//], ["regexes", /(?:^|,|;|\(|\[|\{)(?:\s*)(\/(?:\\\/|[^\n\/])+\/)/], ["stringDelim", /("|')/], ["startLineComments", /\/\/.*$/m], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|finally|for|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with)\b/], ["functions", /(\w+)(?:\s*\()/], ["members", /(\w+)\./], ["members", /((\w+\.)+)(\w+)/]]);

var SCROLL_SCALE = isFirefox ? 3 : 100;
var COUNTER$6 = 0;
var OFFSET = 0;

var TextBox = function (_Surface) {
  inherits(TextBox, _Surface);

  function TextBox(options) {
    classCallCheck(this, TextBox);


    if (typeof options === "string") {
      options = {
        value: options
      };
    }

    var _this = possibleConstructorReturn(this, (TextBox.__proto__ || Object.getPrototypeOf(TextBox)).call(this, Object.assign({}, {
      id: "Primrose.Controls.TextBox[" + COUNTER$6++ + "]"
    }, options)));

    _this.isTextBox = true;
    ////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    ////////////////////////////////////////////////////////////////////////

    _this.useCaching = !isFirefox || !isMobile;

    var makeCursorCommand = function makeCursorCommand(name) {
      var method = name.toLowerCase();
      this["cursor" + name] = function (lines, cursor) {
        cursor[method](lines);
        this.scrollIntoView(cursor);
      };
    };

    ["Left", "Right", "SkipLeft", "SkipRight", "Up", "Down", "Home", "End", "FullHome", "FullEnd"].map(makeCursorCommand.bind(_this));

    ////////////////////////////////////////////////////////////////////////
    // initialization
    ///////////////////////////////////////////////////////////////////////
    _this.tokens = null;
    _this.lines = null;
    _this._commandPack = null;
    _this._tokenRows = null;
    _this._tokenHashes = null;
    _this._tabString = null;
    _this._currentTouchID = null;
    _this._lineCountWidth = null;

    _this._lastFont = null;
    _this._lastText = null;
    _this._lastCharacterWidth = null;
    _this._lastCharacterHeight = null;
    _this._lastGridBounds = null;
    _this._lastPadding = null;
    _this._lastFrontCursor = null;
    _this._lastBackCursor = null;
    _this._lastWidth = -1;
    _this._lastHeight = -1;
    _this._lastScrollX = -1;
    _this._lastScrollY = -1;
    _this._lastFocused = false;
    _this._lastThemeName = null;
    _this._lastPointer = new Point();

    // different browsers have different sets of keycodes for less-frequently
    // used keys like curly brackets.
    _this._browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
    _this._pointer = new Point();
    _this._history = [];
    _this._historyFrame = -1;
    _this._topLeftGutter = new Size();
    _this._bottomRightGutter = new Size();
    _this._dragging = false;
    _this._scrolling = false;
    _this._wheelScrollSpeed = 4;
    var subBounds = new Rectangle(0, 0, _this.bounds.width, _this.bounds.height);
    _this._fg = new Surface({
      id: _this.id + "-fore",
      bounds: subBounds
    });
    _this._fgCanvas = _this._fg.canvas;
    _this._fgfx = _this._fg.context;
    _this._bg = new Surface({
      id: _this.id + "-back",
      bounds: subBounds
    });
    _this._bgCanvas = _this._bg.canvas;
    _this._bgfx = _this._bg.context;
    _this._trim = new Surface({
      id: _this.id + "-trim",
      bounds: subBounds
    });
    _this._trimCanvas = _this._trim.canvas;
    _this._tgfx = _this._trim.context;
    _this._rowCache = {};
    _this._VSCROLL_WIDTH = 2;

    _this.tabWidth = _this.options.tabWidth;
    _this.showLineNumbers = !_this.options.hideLineNumbers;
    _this.showScrollBars = !_this.options.hideScrollBars;
    _this.wordWrap = !_this.options.disableWordWrap;
    _this.readOnly = !!_this.options.readOnly;
    _this.multiline = !_this.options.singleLine;
    _this.gridBounds = new Rectangle();
    _this.frontCursor = new Cursor();
    _this.backCursor = new Cursor();
    _this.scroll = new Point();
    _this.character = new Size();
    _this.theme = _this.options.theme;
    _this.fontSize = _this.options.fontSize;
    _this.tokenizer = _this.options.tokenizer;
    _this.commandPack = _this.options.commands || TextEditor;
    _this.value = _this.options.value;
    _this.padding = _this.options.padding || 1;

    _this.addEventListener("visiblechanged", _this.blur.bind(_this));
    return _this;
  }

  createClass(TextBox, [{
    key: "cursorPageUp",
    value: function cursorPageUp(lines, cursor) {
      cursor.incY(-this.gridBounds.height, lines);
      this.scrollIntoView(cursor);
    }
  }, {
    key: "cursorPageDown",
    value: function cursorPageDown(lines, cursor) {
      cursor.incY(this.gridBounds.height, lines);
      this.scrollIntoView(cursor);
    }
  }, {
    key: "pushUndo",
    value: function pushUndo(lines) {
      if (this._historyFrame < this._history.length - 1) {
        this._history.splice(this._historyFrame + 1);
      }
      this._history.push(lines);
      this._historyFrame = this._history.length - 1;
      this.refreshTokens();
      this.render();
    }
  }, {
    key: "redo",
    value: function redo() {
      if (this._historyFrame < this._history.length - 1) {
        ++this._historyFrame;
      }
      this.refreshTokens();
      this.fixCursor();
      this.render();
    }
  }, {
    key: "undo",
    value: function undo() {
      if (this._historyFrame > 0) {
        --this._historyFrame;
      }
      this.refreshTokens();
      this.fixCursor();
      this.render();
    }
  }, {
    key: "scrollIntoView",
    value: function scrollIntoView(currentCursor) {
      this.scroll.y += this.minDelta(currentCursor.y, this.scroll.y, this.scroll.y + this.gridBounds.height);
      if (!this.wordWrap) {
        this.scroll.x += this.minDelta(currentCursor.x, this.scroll.x, this.scroll.x + this.gridBounds.width);
      }
      this.clampScroll();
    }
  }, {
    key: "readWheel",
    value: function readWheel(evt) {
      if (this.focused) {
        if (evt.shiftKey || isChrome) {
          this.fontSize += -evt.deltaX / SCROLL_SCALE;
        }
        if (!evt.shiftKey || isChrome) {
          this.scroll.y += Math.floor(evt.deltaY * this._wheelScrollSpeed / SCROLL_SCALE);
        }
        this.clampScroll();
        this.render();
        evt.preventDefault();
      }
    }
  }, {
    key: "startPointer",
    value: function startPointer(x, y) {
      if (!get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "startPointer", this).call(this, x, y)) {
        this._dragging = true;
        this.setCursorXY(this.frontCursor, x, y);
      }
    }
  }, {
    key: "movePointer",
    value: function movePointer(x, y) {
      if (this._dragging) {
        this.setCursorXY(this.backCursor, x, y);
      }
    }
  }, {
    key: "endPointer",
    value: function endPointer() {
      get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "endPointer", this).call(this);
      this._dragging = false;
      this._scrolling = false;
    }
  }, {
    key: "copySelectedText",
    value: function copySelectedText(evt) {
      if (this.focused && this.frontCursor.i !== this.backCursor.i) {
        var clipboard = evt.clipboardData || window.clipboardData;
        clipboard.setData(window.clipboardData ? "Text" : "text/plain", this.selectedText);
        evt.returnValue = false;
      }
    }
  }, {
    key: "cutSelectedText",
    value: function cutSelectedText(evt) {
      if (this.focused) {
        this.copySelectedText(evt);
        if (!this.readOnly) {
          this.selectedText = "";
        }
      }
    }
  }, {
    key: "keyDown",
    value: function keyDown(evt) {
      if (this.focused && !this.readOnly) {
        var func = this.commandPack[evt.altCmdName] || this.commandPack[evt.cmdName] || evt.altCmdText || evt.cmdText;

        if (func instanceof String || typeof func === "string") {
          console.warn("This shouldn't have happened.");
          func = this.commandPack[func] || this.commandPack[func] || func;
        }

        if (func) {
          this.frontCursor.moved = false;
          this.backCursor.moved = false;
          if (func instanceof Function) {
            func(this, this.lines);
          } else if (func instanceof String || typeof func === "string") {
            console.log(func);
            this.selectedText = func;
          }
          evt.resetDeadKeyState();
          evt.preventDefault();

          if (this.frontCursor.moved && !this.backCursor.moved) {
            this.backCursor.copy(this.frontCursor);
          }
          this.clampScroll();
          this.render();
        }
      }
    }
  }, {
    key: "readClipboard",
    value: function readClipboard(evt) {
      if (this.focused && !this.readOnly) {
        evt.returnValue = false;
        var clipboard = evt.clipboardData || window.clipboardData,
            str = clipboard.getData(window.clipboardData ? "Text" : "text/plain");
        if (str) {
          this.selectedText = str;
        }
      }
    }
  }, {
    key: "resize",
    value: function resize() {
      get(TextBox.prototype.__proto__ || Object.getPrototypeOf(TextBox.prototype), "resize", this).call(this);
      this._bg.setSize(this.surfaceWidth, this.surfaceHeight);
      this._fg.setSize(this.surfaceWidth, this.surfaceHeight);
      this._trim.setSize(this.surfaceWidth, this.surfaceHeight);
      if (this.theme) {
        this.character.height = this.fontSize;
        this.context.font = this.character.height + "px " + this.theme.fontFamily;
        // measure 100 letter M's, then divide by 100, to get the width of an M
        // to two decimal places on systems that return integer values from
        // measureText.
        this.character.width = this.context.measureText("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM").width / 100;
      }
      this.render();
    }
  }, {
    key: "pixel2cell",
    value: function pixel2cell(point) {
      var x = point.x * this.imageWidth / this.surfaceWidth,
          y = point.y * this.imageHeight / this.surfaceHeight;
      point.set(Math.round(point.x / this.character.width) + this.scroll.x - this.gridBounds.x, Math.floor(point.y / this.character.height - 0.25) + this.scroll.y);
    }
  }, {
    key: "clampScroll",
    value: function clampScroll() {
      if (this.scroll.y < 0) {
        this.scroll.y = 0;
      } else {
        while (0 < this.scroll.y && this.scroll.y > this.lines.length - this.gridBounds.height) {
          --this.scroll.y;
        }
      }
    }
  }, {
    key: "refreshTokens",
    value: function refreshTokens() {
      this.tokens = this.tokenizer.tokenize(this.value);
    }
  }, {
    key: "fixCursor",
    value: function fixCursor() {
      var moved = this.frontCursor.fixCursor(this.lines) || this.backCursor.fixCursor(this.lines);
      if (moved) {
        this.render();
      }
    }
  }, {
    key: "setCursorXY",
    value: function setCursorXY(cursor, x, y) {
      x = Math.round(x);
      y = Math.round(y);
      this._pointer.set(x, y);
      this.pixel2cell(this._pointer, this.scroll, this.gridBounds);
      var gx = this._pointer.x - this.scroll.x,
          gy = this._pointer.y - this.scroll.y,
          onBottom = gy >= this.gridBounds.height,
          onLeft = gx < 0,
          onRight = this._pointer.x >= this.gridBounds.width;
      if (!this._scrolling && !onBottom && !onLeft && !onRight) {
        cursor.setXY(this._pointer.x, this._pointer.y, this.lines);
        this.backCursor.copy(cursor);
      } else if (this._scrolling || onRight && !onBottom) {
        this._scrolling = true;
        var scrollHeight = this.lines.length - this.gridBounds.height;
        if (gy >= 0 && scrollHeight >= 0) {
          var sy = gy * scrollHeight / this.gridBounds.height;
          this.scroll.y = Math.floor(sy);
        }
      } else if (onBottom && !onLeft) {
        var maxWidth = 0;
        for (var dy = 0; dy < this.lines.length; ++dy) {
          maxWidth = Math.max(maxWidth, this.lines[dy].length);
        }
        var scrollWidth = maxWidth - this.gridBounds.width;
        if (gx >= 0 && scrollWidth >= 0) {
          var sx = gx * scrollWidth / this.gridBounds.width;
          this.scroll.x = Math.floor(sx);
        }
      } else if (onLeft && !onBottom) {
        // clicked in number-line gutter
      } else {
          // clicked in the lower-left corner
        }
      this._lastPointer.copy(this._pointer);
      this.render();
    }
  }, {
    key: "setGutter",
    value: function setGutter() {
      if (this.showLineNumbers) {
        this._topLeftGutter.width = 1;
      } else {
        this._topLeftGutter.width = 0;
      }

      if (!this.showScrollBars) {
        this._bottomRightGutter.set(0, 0);
      } else if (this.wordWrap) {
        this._bottomRightGutter.set(this._VSCROLL_WIDTH, 0);
      } else {
        this._bottomRightGutter.set(this._VSCROLL_WIDTH, 1);
      }
    }
  }, {
    key: "refreshGridBounds",
    value: function refreshGridBounds() {
      this._lineCountWidth = 0;
      if (this.showLineNumbers) {
        this._lineCountWidth = Math.max(1, Math.ceil(Math.log(this._history[this._historyFrame].length) / Math.LN10));
      }

      var x = Math.floor(this._topLeftGutter.width + this._lineCountWidth + this.padding / this.character.width),
          y = Math.floor(this.padding / this.character.height),
          w = Math.floor((this.imageWidth - 2 * this.padding) / this.character.width) - x - this._bottomRightGutter.width,
          h = Math.floor((this.imageHeight - 2 * this.padding) / this.character.height) - y - this._bottomRightGutter.height;
      this.gridBounds.set(x, y, w, h);
    }
  }, {
    key: "performLayout",
    value: function performLayout() {

      // group the tokens into rows
      this._tokenRows = [[]];
      this._tokenHashes = [""];
      this.lines = [""];
      var currentRowWidth = 0;
      var tokenQueue = this.tokens.slice();
      for (var i = 0; i < tokenQueue.length; ++i) {
        var t = tokenQueue[i].clone();
        var widthLeft = this.gridBounds.width - currentRowWidth;
        var wrap = this.wordWrap && t.type !== "newlines" && t.value.length > widthLeft;
        var breakLine = t.type === "newlines" || wrap;
        if (wrap) {
          var split = t.value.length > this.gridBounds.width ? widthLeft : 0;
          tokenQueue.splice(i + 1, 0, t.splitAt(split));
        }

        if (t.value.length > 0) {
          this._tokenRows[this._tokenRows.length - 1].push(t);
          this._tokenHashes[this._tokenHashes.length - 1] += JSON.stringify(t);
          this.lines[this.lines.length - 1] += t.value;
          currentRowWidth += t.value.length;
        }

        if (breakLine) {
          this._tokenRows.push([]);
          this._tokenHashes.push("");
          this.lines.push("");
          currentRowWidth = 0;
        }
      }
    }
  }, {
    key: "minDelta",
    value: function minDelta(v, minV, maxV) {
      var dvMinV = v - minV,
          dvMaxV = v - maxV + 5,
          dv = 0;
      if (dvMinV < 0 || dvMaxV >= 0) {
        // compare the absolute values, so we get the smallest change
        // regardless of direction.
        dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
      }

      return dv;
    }
  }, {
    key: "fillRect",
    value: function fillRect(gfx, fill, x, y, w, h) {
      gfx.fillStyle = fill;
      gfx.fillRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
  }, {
    key: "strokeRect",
    value: function strokeRect(gfx, stroke, x, y, w, h) {
      gfx.strokeStyle = stroke;
      gfx.strokeRect(x * this.character.width, y * this.character.height, w * this.character.width + 1, h * this.character.height + 1);
    }
  }, {
    key: "renderCanvasBackground",
    value: function renderCanvasBackground() {
      var minCursor = Cursor.min(this.frontCursor, this.backCursor),
          maxCursor = Cursor.max(this.frontCursor, this.backCursor),
          tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          clearFunc = this.theme.regular.backColor ? "fillRect" : "clearRect",
          OFFSETY = OFFSET / this.character.height;

      if (this.theme.regular.backColor) {
        this._bgfx.fillStyle = this.theme.regular.backColor;
      }

      this._bgfx[clearFunc](0, 0, this.imageWidth, this.imageHeight);
      this._bgfx.save();
      this._bgfx.translate((this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, -this.scroll.y * this.character.height + this.padding);

      // draw the current row highlighter
      if (this.focused) {
        this.fillRect(this._bgfx, this.theme.regular.currentRowBackColor || Default.regular.currentRowBackColor, 0, minCursor.y + OFFSETY, this.gridBounds.width, maxCursor.y - minCursor.y + 1);
      }

      for (var y = 0; y < this._tokenRows.length; ++y) {
        // draw the tokens on this row
        var row = this._tokenRows[y];

        for (var i = 0; i < row.length; ++i) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height && this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x + this.gridBounds.width) {
            // draw the selection box
            var inSelection = minCursor.i <= tokenBack.i && tokenFront.i < maxCursor.i;
            if (inSelection) {
              var selectionFront = Cursor.max(minCursor, tokenFront);
              var selectionBack = Cursor.min(maxCursor, tokenBack);
              var cw = selectionBack.i - selectionFront.i;
              this.fillRect(this._bgfx, this.theme.regular.selectedBackColor || Default.regular.selectedBackColor, selectionFront.x, selectionFront.y + OFFSETY, cw, 1);
            }
          }

          tokenFront.copy(tokenBack);
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy(tokenFront);
      }

      // draw the cursor caret
      if (this.focused) {
        var cc = this.theme.cursorColor || "black";
        var w = 1 / this.character.width;
        this.fillRect(this._bgfx, cc, minCursor.x, minCursor.y + OFFSETY, w, 1);
        this.fillRect(this._bgfx, cc, maxCursor.x, maxCursor.y + OFFSETY, w, 1);
      }
      this._bgfx.restore();
    }
  }, {
    key: "renderCanvasForeground",
    value: function renderCanvasForeground() {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor();

      this._fgfx.clearRect(0, 0, this.imageWidth, this.imageHeight);
      this._fgfx.save();
      this._fgfx.translate((this.gridBounds.x - this.scroll.x) * this.character.width + this.padding, this.padding);
      for (var y = 0; y < this._tokenRows.length; ++y) {
        // draw the tokens on this row
        var line = this.lines[y] + this.padding,
            row = this._tokenRows[y],
            drawn = false,
            textY = (y - this.scroll.y) * this.character.height;

        for (var i = 0; i < row.length; ++i) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;

          // skip drawing tokens that aren't in view
          if (this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height && this.scroll.x <= tokenBack.x && tokenFront.x < this.scroll.x + this.gridBounds.width) {

            // draw the text
            if (this.useCaching && this._rowCache[line] !== undefined) {
              if (i === 0) {
                this._fgfx.putImageData(this._rowCache[line], this.padding, textY + this.padding + OFFSET);
              }
            } else {
              var style = this.theme[t.type] || {};
              var font = (style.fontWeight || this.theme.regular.fontWeight || "") + " " + (style.fontStyle || this.theme.regular.fontStyle || "") + " " + this.character.height + "px " + this.theme.fontFamily;
              this._fgfx.font = font.trim();
              this._fgfx.fillStyle = style.foreColor || this.theme.regular.foreColor;
              this.drawText(this._fgfx, t.value, tokenFront.x * this.character.width, textY);
              drawn = true;
            }
          }

          tokenFront.copy(tokenBack);
        }

        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy(tokenFront);
        if (this.useCaching && drawn && this._rowCache[line] === undefined) {
          this._rowCache[line] = this._fgfx.getImageData(this.padding, textY + this.padding + OFFSET, this.imageWidth - 2 * this.padding, this.character.height);
        }
      }

      this._fgfx.restore();
    }

    // provides a hook for TextInput to be able to override text drawing and spit out password blanking characters

  }, {
    key: "drawText",
    value: function drawText(ctx, txt, x, y) {
      ctx.fillText(txt, x, y);
    }
  }, {
    key: "renderCanvasTrim",
    value: function renderCanvasTrim() {
      var tokenFront = new Cursor(),
          tokenBack = new Cursor(),
          maxLineWidth = 0;

      this._tgfx.clearRect(0, 0, this.imageWidth, this.imageHeight);
      this._tgfx.save();
      this._tgfx.translate(this.padding, this.padding);
      this._tgfx.save();
      this._tgfx.lineWidth = 2;
      this._tgfx.translate(0, -this.scroll.y * this.character.height);
      for (var y = 0, lastLine = -1; y < this._tokenRows.length; ++y) {
        var row = this._tokenRows[y];

        for (var i = 0; i < row.length; ++i) {
          var t = row[i];
          tokenBack.x += t.value.length;
          tokenBack.i += t.value.length;
          tokenFront.copy(tokenBack);
        }

        maxLineWidth = Math.max(maxLineWidth, tokenBack.x);
        tokenFront.x = 0;
        ++tokenFront.y;
        tokenBack.copy(tokenFront);

        if (this.showLineNumbers && this.scroll.y <= y && y < this.scroll.y + this.gridBounds.height) {
          var currentLine = row.length > 0 ? row[0].line : lastLine + 1;
          // draw the left gutter
          var lineNumber = currentLine.toString();
          while (lineNumber.length < this._lineCountWidth) {
            lineNumber = " " + lineNumber;
          }
          this.fillRect(this._tgfx, this.theme.regular.selectedBackColor || Default.regular.selectedBackColor, 0, y, this.gridBounds.x, 1);
          this._tgfx.font = "bold " + this.character.height + "px " + this.theme.fontFamily;

          if (currentLine > lastLine) {
            this._tgfx.fillStyle = this.theme.regular.foreColor;
            this._tgfx.fillText(lineNumber, 0, y * this.character.height);
          }
          lastLine = currentLine;
        }
      }

      this._tgfx.restore();

      if (this.showLineNumbers) {
        this.strokeRect(this._tgfx, this.theme.regular.foreColor || Default.regular.foreColor, 0, 0, this.gridBounds.x, this.gridBounds.height);
      }

      // draw the scrollbars
      if (this.showScrollBars) {
        var drawWidth = this.gridBounds.width * this.character.width - this.padding,
            drawHeight = this.gridBounds.height * this.character.height,
            scrollX = this.scroll.x * drawWidth / maxLineWidth + this.gridBounds.x * this.character.width,
            scrollY = this.scroll.y * drawHeight / this._tokenRows.length;

        this._tgfx.fillStyle = this.theme.regular.selectedBackColor || Default.regular.selectedBackColor;
        // horizontal
        var bw;
        if (!this.wordWrap && maxLineWidth > this.gridBounds.width) {
          var scrollBarWidth = drawWidth * (this.gridBounds.width / maxLineWidth),
              by = this.gridBounds.height * this.character.height;
          bw = Math.max(this.character.width, scrollBarWidth);
          this._tgfx.fillRect(scrollX, by, bw, this.character.height);
          this._tgfx.strokeRect(scrollX, by, bw, this.character.height);
        }

        //vertical
        if (this._tokenRows.length > this.gridBounds.height) {
          var scrollBarHeight = drawHeight * (this.gridBounds.height / this._tokenRows.length),
              bx = this.image - this._VSCROLL_WIDTH * this.character.width - 2 * this.padding,
              bh = Math.max(this.character.height, scrollBarHeight);
          bw = this._VSCROLL_WIDTH * this.character.width;
          this._tgfx.fillRect(bx, scrollY, bw, bh);
          this._tgfx.strokeRect(bx, scrollY, bw, bh);
        }
      }

      this._tgfx.lineWidth = 2;
      this._tgfx.restore();
      this._tgfx.strokeRect(1, 1, this.imageWidth - 2, this.imageHeight - 2);
      if (!this.focused) {
        this._tgfx.fillStyle = this.theme.regular.unfocused || Default.regular.unfocused;
        this._tgfx.fillRect(0, 0, this.imageWidth, this.imageHeight);
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.tokens && this.theme) {
        this.refreshGridBounds();
        var boundsChanged = this.gridBounds.toString() !== this._lastGridBounds,
            textChanged = this._lastText !== this.value,
            characterWidthChanged = this.character.width !== this._lastCharacterWidth,
            characterHeightChanged = this.character.height !== this._lastCharacterHeight,
            paddingChanged = this.padding !== this._lastPadding,
            cursorChanged = !this._lastFrontCursor || !this._lastBackCursor || this.frontCursor.i !== this._lastFrontCursor.i || this._lastBackCursor.i !== this.backCursor.i,
            scrollChanged = this.scroll.x !== this._lastScrollX || this.scroll.y !== this._lastScrollY,
            fontChanged = this.context.font !== this._lastFont,
            themeChanged = this.theme.name !== this._lastThemeName,
            focusChanged = this.focused !== this._lastFocused,
            changeBounds = null,
            layoutChanged = this.resized || boundsChanged || textChanged || characterWidthChanged || characterHeightChanged || paddingChanged,
            backgroundChanged = layoutChanged || cursorChanged || scrollChanged || themeChanged,
            foregroundChanged = backgroundChanged || textChanged,
            trimChanged = backgroundChanged || focusChanged,
            imageChanged = foregroundChanged || backgroundChanged || trimChanged;

        if (layoutChanged) {
          this.performLayout(this.gridBounds);
          this._rowCache = {};
        }

        if (imageChanged) {
          if (cursorChanged && !(layoutChanged || scrollChanged || themeChanged || focusChanged)) {
            var top = Math.min(this.frontCursor.y, this._lastFrontCursor.y, this.backCursor.y, this._lastBackCursor.y) - this.scroll.y + this.gridBounds.y,
                bottom = Math.max(this.frontCursor.y, this._lastFrontCursor.y, this.backCursor.y, this._lastBackCursor.y) - this.scroll.y + 1;
            changeBounds = new Rectangle(0, top * this.character.height, this.bounds.width, (bottom - top) * this.character.height + 2);
          }

          if (backgroundChanged) {
            this.renderCanvasBackground();
          }
          if (foregroundChanged) {
            this.renderCanvasForeground();
          }
          if (trimChanged) {
            this.renderCanvasTrim();
          }

          this.context.clearRect(0, 0, this.imageWidth, this.imageHeight);
          this.context.drawImage(this._bgCanvas, 0, 0);
          this.context.drawImage(this._fgCanvas, 0, 0);
          this.context.drawImage(this._trimCanvas, 0, 0);
          this.invalidate(changeBounds);
        }

        this._lastGridBounds = this.gridBounds.toString();
        this._lastText = this.value;
        this._lastCharacterWidth = this.character.width;
        this._lastCharacterHeight = this.character.height;
        this._lastWidth = this.imageWidth;
        this._lastHeight = this.imageHeight;
        this._lastPadding = this.padding;
        this._lastFrontCursor = this.frontCursor.clone();
        this._lastBackCursor = this.backCursor.clone();
        this._lastFocused = this.focused;
        this._lastFont = this.context.font;
        this._lastThemeName = this.theme.name;
        this._lastScrollX = this.scroll.x;
        this._lastScrollY = this.scroll.y;
      }
    }
  }, {
    key: "value",
    get: function get$$1() {
      return this._history[this._historyFrame].join("\n");
    },
    set: function set$$1(txt) {
      txt = txt || "";
      txt = txt.replace(/\r\n/g, "\n");
      if (!this.multiline) {
        txt = txt.replace(/\n/g, "");
      }
      var lines = txt.split("\n");
      this.pushUndo(lines);
      this.render();
      this.emit("change", {
        target: this
      });
    }
  }, {
    key: "selectedText",
    get: function get$$1() {
      var minCursor = Cursor.min(this.frontCursor, this.backCursor),
          maxCursor = Cursor.max(this.frontCursor, this.backCursor);
      return this.value.substring(minCursor.i, maxCursor.i);
    },
    set: function set$$1(str) {
      str = str || "";
      str = str.replace(/\r\n/g, "\n");

      if (this.frontCursor.i !== this.backCursor.i || str.length > 0) {
        var minCursor = Cursor.min(this.frontCursor, this.backCursor),
            maxCursor = Cursor.max(this.frontCursor, this.backCursor),

        // TODO: don't recalc the string first.
        text = this.value,
            left = text.substring(0, minCursor.i),
            right = text.substring(maxCursor.i);

        var v = left + str + right;
        this.value = v;
        this.refreshGridBounds();
        this.performLayout();
        minCursor.advanceN(this.lines, Math.max(0, str.length));
        this.scrollIntoView(maxCursor);
        this.clampScroll();
        maxCursor.copy(minCursor);
        this.render();
      }
    }
  }, {
    key: "padding",
    get: function get$$1() {
      return this._padding;
    },
    set: function set$$1(v) {
      this._padding = v;
      this.render();
    }
  }, {
    key: "wordWrap",
    get: function get$$1() {
      return this._wordWrap;
    },
    set: function set$$1(v) {
      this._wordWrap = v || false;
      this.setGutter();
    }
  }, {
    key: "showLineNumbers",
    get: function get$$1() {
      return this._showLineNumbers;
    },
    set: function set$$1(v) {
      this._showLineNumbers = v;
      this.setGutter();
    }
  }, {
    key: "showScrollBars",
    get: function get$$1() {
      return this._showScrollBars;
    },
    set: function set$$1(v) {
      this._showScrollBars = v;
      this.setGutter();
    }
  }, {
    key: "theme",
    get: function get$$1() {
      return this._theme;
    },
    set: function set$$1(t) {
      this._theme = Object.assign({}, Default, t);
      this._theme.fontSize = this.fontSize;
      this._rowCache = {};
      this.render();
    }
  }, {
    key: "commandPack",
    get: function get$$1() {
      return this._commandPack;
    },
    set: function set$$1(v) {
      this._commandPack = v;
    }
  }, {
    key: "selectionStart",
    get: function get$$1() {
      return this.frontCursor.i;
    },
    set: function set$$1(i) {
      this.frontCursor.setI(i, this.lines);
    }
  }, {
    key: "selectionEnd",
    get: function get$$1() {
      return this.backCursor.i;
    },
    set: function set$$1(i) {
      this.backCursor.setI(i, this.lines);
    }
  }, {
    key: "selectionDirection",
    get: function get$$1() {
      return this.frontCursor.i <= this.backCursor.i ? "forward" : "backward";
    }
  }, {
    key: "tokenizer",
    get: function get$$1() {
      return this._tokenizer;
    },
    set: function set$$1(tk) {
      this._tokenizer = tk || JavaScript;
      if (this._history && this._history.length > 0) {
        this.refreshTokens();
        this.render();
      }
    }
  }, {
    key: "tabWidth",
    get: function get$$1() {
      return this._tabWidth;
    },
    set: function set$$1(tw) {
      this._tabWidth = tw || 2;
      this._tabString = "";
      for (var i = 0; i < this._tabWidth; ++i) {
        this._tabString += " ";
      }
    }
  }, {
    key: "tabString",
    get: function get$$1() {
      return this._tabString;
    }
  }, {
    key: "fontSize",
    get: function get$$1() {
      return this._fontSize || 16;
    },
    set: function set$$1(v) {
      v = v || 16;
      this._fontSize = v;
      if (this.theme) {
        this.theme.fontSize = this._fontSize;
        this.resize();
        this.render();
      }
    }
  }, {
    key: "lockMovement",
    get: function get$$1() {
      return this.focused && !this.readOnly;
    }
  }]);
  return TextBox;
}(Surface);

var piOver180 = Math.PI / 180.0;
var rad45 = Math.PI * 0.25;
var defaultOrientation = new Float32Array([0, 0, 0, 1]);
var defaultPosition = new Float32Array([0, 0, 0]);

// Borrowed from glMatrix.
function mat4_perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan(fov ? fov.upDegrees * piOver180 : rad45),
      downTan = Math.tan(fov ? fov.downDegrees * piOver180 : rad45),
      leftTan = Math.tan(fov ? fov.leftDegrees * piOver180 : rad45),
      rightTan = Math.tan(fov ? fov.rightDegrees * piOver180 : rad45),
      xScale = 2.0 / (leftTan + rightTan),
      yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = far * near / (near - far);
  out[15] = 0.0;
  return out;
}

function mat4_fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
      y = q[1],
      z = q[2],
      w = q[3],
      x2 = x + x,
      y2 = y + y,
      z2 = z + z,
      xx = x * x2,
      xy = x * y2,
      xz = x * z2,
      yy = y * y2,
      yz = y * z2,
      zz = z * z2,
      wx = w * x2,
      wy = w * y2,
      wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

function mat4_translate(out, a, v) {
  var x = v[0],
      y = v[1],
      z = v[2],
      a00,
      a01,
      a02,
      a03,
      a10,
      a11,
      a12,
      a13,
      a20,
      a21,
      a22,
      a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];a01 = a[1];a02 = a[2];a03 = a[3];
    a10 = a[4];a11 = a[5];a12 = a[6];a13 = a[7];
    a20 = a[8];a21 = a[9];a22 = a[10];a23 = a[11];

    out[0] = a00;out[1] = a01;out[2] = a02;out[3] = a03;
    out[4] = a10;out[5] = a11;out[6] = a12;out[7] = a13;
    out[8] = a20;out[9] = a21;out[10] = a22;out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

function mat4_invert(out, a) {
  var a00 = a[0],
      a01 = a[1],
      a02 = a[2],
      a03 = a[3],
      a10 = a[4],
      a11 = a[5],
      a12 = a[6],
      a13 = a[7],
      a20 = a[8],
      a21 = a[9],
      a22 = a[10],
      a23 = a[11],
      a30 = a[12],
      a31 = a[13],
      a32 = a[14],
      a33 = a[15],
      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,


  // Calculate the determinant
  det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

function updateEyeMatrices(projection, view, pose, parameters, vrDisplay) {
  mat4_perspectiveFromFieldOfView(projection, parameters ? parameters.fieldOfView : null, vrDisplay.depthNear, vrDisplay.depthFar);

  var orientation = pose.orientation || defaultOrientation;
  var position = pose.position || defaultPosition;

  mat4_fromRotationTranslation(view, orientation, position);
  if (parameters) mat4_translate(view, view, parameters.offset);
  mat4_invert(view, view);
}

function frameDataFromPose(frameData, pose, vrDisplay) {
  if (!frameData || !pose) return false;

  frameData.pose = pose;
  frameData.timestamp = pose.timestamp;

  updateEyeMatrices(frameData.leftProjectionMatrix, frameData.leftViewMatrix, pose, vrDisplay.getEyeParameters("left"), vrDisplay);
  updateEyeMatrices(frameData.rightProjectionMatrix, frameData.rightViewMatrix, pose, vrDisplay.getEyeParameters("right"), vrDisplay);

  return true;
}

var VRFrameData = function VRFrameData() {
  classCallCheck(this, VRFrameData);


  this.leftProjectionMatrix = new Float32Array(16);

  this.leftViewMatrix = new Float32Array(16);

  this.rightProjectionMatrix = new Float32Array(16);

  this.rightViewMatrix = new Float32Array(16);

  this.pose = null;
};

/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Start at a higher number to reduce chance of conflict.
var nextDisplayId = 1000;

var VRDisplay = function () {
  function VRDisplay(name) {
    classCallCheck(this, VRDisplay);

    this._currentLayers = [];

    Object.defineProperties(this, {
      capabilities: immutable(Object.defineProperties({}, {
        hasPosition: immutable(false),
        hasOrientation: immutable(isMobile),
        hasExternalDisplay: immutable(false),
        canPresent: immutable(true),
        maxLayers: immutable(1)
      })),
      displayId: immutable(nextDisplayId++),
      displayName: immutable(name),
      isConnected: immutable(true),
      stageParameters: immutable(null),
      isPresenting: immutable(function () {
        return FullScreen.isActive;
      }),

      depthNear: mutable(0.01, "number"),
      depthFar: mutable(10000.0, "number"),

      isPolyfilled: immutable(true)
    });

    this._frameData = null;
    this._poseData = null;
  }

  createClass(VRDisplay, [{
    key: "getFrameData",
    value: function getFrameData(frameData) {
      if (!this._frameData) {
        this._frameData = frameDataFromPose(frameData, this.getPose(), this);
      }
      return this._frameData;
    }
  }, {
    key: "getPose",
    value: function getPose() {
      if (!this._poseData) {
        this._poseData = this._getPose();
      }
      return this._poseData;
    }
  }, {
    key: "requestAnimationFrame",
    value: function requestAnimationFrame(callback) {
      return window.requestAnimationFrame(callback);
    }
  }, {
    key: "cancelAnimationFrame",
    value: function cancelAnimationFrame(id) {
      return window.cancelAnimationFrame(id);
    }
  }, {
    key: "requestPresent",
    value: function requestPresent(layers) {
      for (var i = 0; i < this.capabilities.maxLayers && i < layers.length; ++i) {
        this._currentLayers[i] = layers[i];
      }
      var elem = layers[0].source;
      return standardFullScreenBehavior(elem);
    }
  }, {
    key: "exitPresent",
    value: function exitPresent() {
      this._currentLayers.splice(0);
      return standardExitFullScreenBehavior();
    }
  }, {
    key: "getLayers",
    value: function getLayers() {
      return this._currentLayers.slice();
    }
  }, {
    key: "submitFrame",
    value: function submitFrame(pose) {
      this._frameData = null;
      this._poseData = null;
    }
  }]);
  return VRDisplay;
}();

var defaultFieldOfView = 100;

function defaultPose() {
  return {
    position: [0, 0, 0],
    orientation: [0, 0, 0, 1],
    linearVelocity: null,
    linearAcceleration: null,
    angularVelocity: null,
    angularAcceleration: null
  };
}

var StandardMonitorVRDisplay = function (_VRDisplay) {
  inherits(StandardMonitorVRDisplay, _VRDisplay);
  createClass(StandardMonitorVRDisplay, null, [{
    key: "DEFAULT_FOV",
    get: function get$$1() {
      return defaultFieldOfView;
    },
    set: function set$$1(v) {
      defaultFieldOfView = v;
    }
  }]);

  function StandardMonitorVRDisplay(display) {
    classCallCheck(this, StandardMonitorVRDisplay);

    var _this = possibleConstructorReturn(this, (StandardMonitorVRDisplay.__proto__ || Object.getPrototypeOf(StandardMonitorVRDisplay)).call(this, "Full Screen"));

    _this._display = display;
    return _this;
  }

  createClass(StandardMonitorVRDisplay, [{
    key: "submitFrame",
    value: function submitFrame(pose) {
      if (this._display && this._display.isPolyfilled) {
        this._display.submitFrame(pose);
      }
    }
  }, {
    key: "getPose",
    value: function getPose() {
      var display = isMobile && this._display;
      if (display) {
        return display.getPose();
      } else {
        return defaultPose();
      }
    }
  }, {
    key: "resetPose",
    value: function resetPose() {
      var display = isMobile && this._display;
      if (display) {
        return display.resetPose();
      }
    }
  }, {
    key: "getEyeParameters",
    value: function getEyeParameters(side) {
      if (side === "left") {
        var curLayer = this.getLayers()[0],
            elem = curLayer && curLayer.source || document.body,
            width = elem.clientWidth,
            height = elem.clientHeight;

        var vFOV = void 0,
            hFOV = void 0;
        if (height > width) {
          vFOV = defaultFieldOfView / 2, hFOV = calcFoV(vFOV, width, height);
        } else {
          hFOV = defaultFieldOfView / 2, vFOV = calcFoV(hFOV, height, width);
        }

        return {
          renderWidth: width * devicePixelRatio,
          renderHeight: height * devicePixelRatio,
          offset: new Float32Array([0, 0, 0]),
          fieldOfView: {
            upDegrees: vFOV,
            downDegrees: vFOV,
            leftDegrees: hFOV,
            rightDegrees: hFOV
          }
        };
      }
    }
  }]);
  return StandardMonitorVRDisplay;
}(VRDisplay);

function calcFoV(aFoV, aDim, bDim) {
  return 180 * Math.atan(Math.tan(aFoV * Math.PI / 180) * aDim / bDim) / Math.PI;
}

function makeHidingContainer(id, obj) {
  var elem = cascadeElement(id, "div", window.HTMLDivElement);
  elem.style.position = "absolute";
  elem.style.left = 0;
  elem.style.top = 0;
  elem.style.width = 0;
  elem.style.height = 0;
  elem.style.overflow = "hidden";
  elem.appendChild(obj);
  return elem;
}

function initState() {
  this.inputState = {
    buttons: [],
    axes: [],
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  };
  this.lastInputState = {
    buttons: [],
    axes: [],
    ctrl: false,
    alt: false,
    shift: false,
    meta: false
  };
}

function filterMetaKey(k) {
  for (var i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
    var m = Keys.MODIFIER_KEYS[i];
    if (Math.abs(k) === Keys[m.toLocaleUpperCase()]) {
      return Math.sign(k) * (i + 1);
    }
  }
}

function filterValue(elem) {
  var t = typeof elem === "undefined" ? "undefined" : _typeof(elem);
  var index = 0,
      toggle = false,
      sign = 1;

  if (t === "number") {
    index = Math.abs(elem) - 1;
    toggle = elem < 0;
    sign = elem < 0 ? -1 : 1;
  } else if (t === "string") {
    if (elem[0] === "-") {
      sign = -1;
      elem = elem.substring(1);
    }
    index = this.axisNames.indexOf(elem);
  } else {
    throw new Error("Cannot clone command spec. Element was type: " + t, elem);
  }

  return {
    index: index,
    toggle: toggle,
    sign: sign
  };
}

function swap(a, b) {
  for (var i = 0; i < this.inputState.buttons.length; ++i) {
    this[a].buttons[i] = this[b].buttons[i];
  }
  for (var _i = 0; _i < this.inputState.axes.length; ++_i) {
    this[a].axes[_i] = this[b].axes[_i];
  }
  for (var _i2 = 0; _i2 < Keys.MODIFIER_KEYS.length; ++_i2) {
    var m = Keys.MODIFIER_KEYS[_i2];
    this[a][m] = this[b][m];
  }
}

function resetInputState() {
  swap.call(this, "inputState", "lastInputState");
}

function recordLastState() {
  swap.call(this, "lastInputState", "inputState");
}

var CommandState = function CommandState() {
  classCallCheck(this, CommandState);

  this.value = null;
  this.pressed = false;
  this.wasPressed = false;
  this.fireAgain = false;
  this.lt = 0;
  this.ct = 0;
  this.repeatCount = 0;
};

var InputProcessor = function (_EventDispatcher) {
  inherits(InputProcessor, _EventDispatcher);

  function InputProcessor(name, commands, axisNames, userActionEvent) {
    classCallCheck(this, InputProcessor);

    var _this = possibleConstructorReturn(this, (InputProcessor.__proto__ || Object.getPrototypeOf(InputProcessor)).call(this));

    _this.name = name;
    _this.commands = {};
    _this.commandNames = [];
    _this.enabled = true;
    _this.paused = false;
    _this.ready = true;
    _this.inPhysicalUse = false;
    initState.call(_this);

    var readMetaKeys = function readMetaKeys(event) {
      for (var i = 0; i < Keys.MODIFIER_KEYS.length; ++i) {
        var m = Keys.MODIFIER_KEYS[i];
        _this.inputState[m] = event[m + "Key"];
      }
    };

    window.addEventListener("keydown", readMetaKeys, false);
    window.addEventListener("keyup", readMetaKeys, false);
    window.addEventListener("focus", readMetaKeys, false);

    _this.axisNames = axisNames || [];

    for (var i = 0; i < _this.axisNames.length; ++i) {
      _this.inputState.axes[i] = 0;
    }

    for (var cmdName in commands) {
      _this.addCommand(cmdName, commands[cmdName]);
    }

    for (var _i3 = 0; _i3 < Keys.MODIFIER_KEYS.length; ++_i3) {
      _this.inputState[Keys.MODIFIER_KEYS[_i3]] = false;
    }

    _this.userActionHandlers = null;
    if (userActionEvent) {
      window.addEventListener(userActionEvent, function (evt) {
        if (_this.userActionHandlers) {
          for (var _i4 = 0; _i4 < _this.userActionHandlers.length; ++_i4) {
            _this.userActionHandlers[_i4](evt);
          }
        }
      });
    }
    return _this;
  }

  createClass(InputProcessor, [{
    key: "addCommand",
    value: function addCommand(name, cmd) {
      cmd.name = name;
      cmd = this.cloneCommand(cmd);
      if (typeof cmd.repetitions === "undefined") {
        cmd.repetitions = 1;
      }
      cmd.state = new CommandState();
      this.commands[name] = cmd;
      this.commandNames.push(name);
    }
  }, {
    key: "cloneCommand",
    value: function cloneCommand(cmd) {
      return {
        name: cmd.name,
        disabled: !!cmd.disabled,
        dt: cmd.dt || 0,
        deadzone: cmd.deadzone || 0,
        threshold: cmd.threshold || 0,
        repetitions: cmd.repetitions,
        scale: cmd.scale,
        offset: cmd.offset,
        min: cmd.min,
        max: cmd.max,
        integrate: !!cmd.integrate,
        delta: !!cmd.delta,
        axes: this.maybeClone(cmd.axes),
        commands: cmd.commands && cmd.commands.slice() || [],
        buttons: this.maybeClone(cmd.buttons),
        metaKeys: this.maybeClone(cmd.metaKeys && cmd.metaKeys.map(filterMetaKey)),
        commandDown: cmd.commandDown,
        commandUp: cmd.commandUp
      };
    }
  }, {
    key: "maybeClone",
    value: function maybeClone(arr) {
      var output = [];
      if (arr) {
        for (var i = 0; i < arr.length; ++i) {
          output[i] = filterValue.call(this, arr[i]);
        }
      }
      return output;
    }
  }, {
    key: "update",
    value: function update(dt) {
      if (this.enabled && this.ready && this.inPhysicalUse && !this.paused && dt > 0) {

        this.inputState.buttons[Keys.ANY] = false;
        for (var n in this.inputState.buttons) {
          if (this.inputState.buttons[n]) {
            this.inputState.buttons[Keys.ANY] = true;
            break;
          }
        }

        var stateMod = recordLastState;
        for (var name in this.commands) {
          var cmd = this.commands[name];
          cmd.state.wasPressed = cmd.state.pressed;
          cmd.state.pressed = false;
          if (!cmd.disabled) {
            var pressed = true,
                value = 0;
            if (cmd.metaKeys) {
              for (var _n = 0; _n < cmd.metaKeys.length && pressed; ++_n) {
                var m = cmd.metaKeys[_n];
                pressed = pressed && (this.inputState[Keys.MODIFIER_KEYS[m.index]] && !m.toggle || !this.inputState[Keys.MODIFIER_KEYS[m.index]] && m.toggle);
              }
            }

            if (pressed) {
              if (cmd.buttons.length > 0) {
                for (var _n2 = 0; _n2 < cmd.buttons.length; ++_n2) {
                  var btn = cmd.buttons[_n2],
                      code = btn.index + 1,
                      p = !!this.inputState.buttons[code];

                  var temp = p ? btn.sign : 0;
                  pressed = pressed && (p && !btn.toggle || !p && btn.toggle);
                  if (Math.abs(temp) > Math.abs(value)) {
                    value = temp;
                  }
                }
              }

              if (cmd.buttons.length === 0 || value !== 0) {
                if (cmd.axes.length > 0) {
                  value = 0;
                  for (var _n3 = 0; _n3 < cmd.axes.length; ++_n3) {
                    var a = cmd.axes[_n3];
                    var _temp = a.sign * this.inputState.axes[a.index];
                    if (Math.abs(_temp) > Math.abs(value)) {
                      value = _temp;
                    }
                  }
                } else if (cmd.commands.length > 0) {
                  value = 0;
                  for (var _n4 = 0; _n4 < cmd.commands.length; ++_n4) {
                    var _temp2 = this.getValue(cmd.commands[_n4]);
                    if (Math.abs(_temp2) > Math.abs(value)) {
                      value = _temp2;
                    }
                  }
                }

                if (cmd.scale !== undefined) {
                  value *= cmd.scale;
                }

                if (cmd.offset !== undefined) {
                  value += cmd.offset;
                }

                if (cmd.deadzone && Math.abs(value) < cmd.deadzone) {
                  value = 0;
                }

                if (cmd.integrate) {
                  value = this.getValue(cmd.name) + value * dt;
                } else if (cmd.delta) {
                  var ov = value;
                  if (cmd.state.lv !== undefined) {
                    value = value - cmd.state.lv;
                  }
                  cmd.state.lv = ov;
                }

                if (cmd.min !== undefined && value < cmd.min) {
                  value = cmd.min;
                  stateMod = resetInputState;
                }

                if (cmd.max !== undefined && value > cmd.max) {
                  value = cmd.max;
                  stateMod = resetInputState;
                }

                if (cmd.threshold) {
                  pressed = pressed && value > cmd.threshold;
                }
              }
            }

            cmd.state.pressed = pressed;
            cmd.state.value = value;
            cmd.state.lt += dt;

            cmd.state.fireAgain = cmd.state.pressed && cmd.state.lt >= cmd.dt && (cmd.repetitions === -1 || cmd.state.repeatCount < cmd.repetitions);

            if (cmd.state.fireAgain) {
              cmd.state.lt = 0;
              ++cmd.state.repeatCount;
            } else if (!cmd.state.pressed) {
              cmd.state.repeatCount = 0;
            }
          }
        }
        stateMod.call(this);

        this.fireCommands();
      }
    }
  }, {
    key: "zero",
    value: function zero() {
      initState.call(this);
      for (var key in this.commands) {
        this.commands[key].state = new CommandState();
      }
    }
  }, {
    key: "fireCommands",
    value: function fireCommands() {
      if (this.ready && !this.paused) {
        for (var name in this.commands) {
          var cmd = this.commands[name];
          if (cmd.state.fireAgain && cmd.commandDown) {
            cmd.commandDown(this.name);
          }

          if (!cmd.state.pressed && cmd.state.wasPressed && cmd.commandUp) {
            cmd.commandUp(this.name);
          }
        }
      }
    }
  }, {
    key: "setProperty",
    value: function setProperty(key, name, value) {
      if (this.commands[name]) {
        this.commands[name][key] = value;
      }
    }
  }, {
    key: "setDeadzone",
    value: function setDeadzone(name, value) {
      this.setProperty("deadzone", name, value);
    }
  }, {
    key: "setScale",
    value: function setScale(name, value) {
      this.setProperty("scale", name, value);
    }
  }, {
    key: "setDT",
    value: function setDT(name, value) {
      this.setProperty("dt", name, value);
    }
  }, {
    key: "setMin",
    value: function setMin(name, value) {
      this.setProperty("min", name, value);
    }
  }, {
    key: "setMax",
    value: function setMax(name, value) {
      this.setProperty("max", name, value);
    }
  }, {
    key: "addMetaKey",
    value: function addMetaKey(name, value) {
      this.addToArray("metaKeys", name, filterMetaKey(value));
    }
  }, {
    key: "addAxis",
    value: function addAxis(name, value) {
      this.addToArray("axes", name, value);
    }
  }, {
    key: "addButton",
    value: function addButton(name, value) {
      this.addToArray("buttons", name, value);
    }
  }, {
    key: "removeMetaKey",
    value: function removeMetaKey(name, value) {
      this.removeFromArray("metaKeys", name, value);
    }
  }, {
    key: "removeAxis",
    value: function removeAxis(name, value) {
      this.removeFromArray("axes", name, value);
    }
  }, {
    key: "removeButton",
    value: function removeButton(name, value) {
      this.removeFromArray("buttons", name, value);
    }
  }, {
    key: "invertAxis",
    value: function invertAxis(name, value) {
      this.invertInArray("axes", name, value);
    }
  }, {
    key: "invertButton",
    value: function invertButton(name, value) {
      this.invertInArray("buttons", name, value);
    }
  }, {
    key: "invertMetaKey",
    value: function invertMetaKey(name, value) {
      this.invertInArray("metaKeys", name, value);
    }
  }, {
    key: "addToArray",
    value: function addToArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        this.commands[name][key].push(filterValue(value));
      }
    }
  }, {
    key: "removeFromArray",
    value: function removeFromArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        --value;
        var arr = this.commands[name][key];
        for (var i = 0; i < arr.length; ++i) {
          var elem = arr[i];
          if (elem.index === value) {
            return arr.splice(i, 1);
          }
        }
      }
    }
  }, {
    key: "invertInArray",
    value: function invertInArray(key, name, value) {
      if (this.commands[name] && this.commands[name][key]) {
        var arr = this.commands[name][key],
            n = arr.indexOf(value);
        for (var i = 0; i < arr.length; ++i) {
          var elem = arr[i];
          if (elem.index === value) {
            elem.sign *= -1;
            return;
          }
        }
      }
    }
  }, {
    key: "pause",
    value: function pause(v) {
      this.paused = v;
    }
  }, {
    key: "isPaused",
    value: function isPaused() {
      return this.paused;
    }
  }, {
    key: "enable",
    value: function enable(k, v) {
      if (v === undefined || v === null) {
        v = k;
        k = null;
      }

      if (k) {
        this.setProperty("disabled", k, !v);
      } else {
        this.enabled = v;
      }
    }
  }, {
    key: "isEnabled",
    value: function isEnabled(name) {
      return name && this.commands[name] && !this.commands[name].disabled;
    }
  }, {
    key: "getAxis",
    value: function getAxis(name) {
      var i = this.axisNames.indexOf(name);
      if (i > -1) {
        var value = this.inputState.axes[i] || 0;
        return value;
      }
      return null;
    }
  }, {
    key: "setAxis",
    value: function setAxis(name, value) {
      var i = this.axisNames.indexOf(name);
      if (i > -1 && (this.inPhysicalUse || value !== 0)) {
        this.inputState.axes[i] = value;
      }
    }
  }, {
    key: "setButton",
    value: function setButton(index, pressed) {
      if (this.inPhysicalUse || pressed) {
        this.inputState.buttons[index] = pressed;
      }
    }
  }, {
    key: "isDown",
    value: function isDown(name) {
      return this.enabled && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }, {
    key: "isUp",
    value: function isUp(name) {
      return this.enabled && this.isEnabled(name) && this.commands[name].state.pressed;
    }
  }, {
    key: "getValue",
    value: function getValue(name) {
      return this.enabled && this.isEnabled(name) && (this.commands[name].state.value || this.getAxis(name)) || 0;
    }
  }, {
    key: "setValue",
    value: function setValue(name, value) {
      var j = this.axisNames.indexOf(name);
      if (!this.commands[name] && j > -1) {
        this.setAxis(name, value);
      } else if (this.commands[name] && !this.commands[name].disabled) {
        this.commands[name].state.value = value;
      }
    }
  }, {
    key: "inPhysicalUse",
    get: function get$$1() {
      return this._inPhysicalUse;
    },
    set: function set$$1(v) {
      var wasInPhysicalUse = this._inPhysicalUse;
      this._inPhysicalUse = v;
      if (!wasInPhysicalUse && v) {
        this.emit("activate");
      }
    }
  }]);
  return InputProcessor;
}(EventDispatcher);

var OperatingSystem = function () {
  function OperatingSystem(osName, pre1, pre2, redo, pre3, home, end, pre5) {
    classCallCheck(this, OperatingSystem);

    this.name = osName;

    var pre4 = pre3;
    pre3 = pre3.length > 0 ? pre3 : "NORMAL";

    this[pre1 + "_a"] = "SELECT_ALL";
    this[pre1 + "_c"] = "COPY";
    this[pre1 + "_x"] = "CUT";
    this[pre1 + "_v"] = "PASTE";
    this[redo] = "REDO";
    this[pre1 + "_z"] = "UNDO";
    this[pre1 + "_DOWNARROW"] = "WINDOW_SCROLL_DOWN";
    this[pre1 + "_UPARROW"] = "WINDOW_SCROLL_UP";
    this[pre2 + "_LEFTARROW"] = "NORMAL_SKIPLEFT";
    this[pre2 + "SHIFT_LEFTARROW"] = "SHIFT_SKIPLEFT";
    this[pre2 + "_RIGHTARROW"] = "NORMAL_SKIPRIGHT";
    this[pre2 + "SHIFT_RIGHTARROW"] = "SHIFT_SKIPRIGHT";
    this[pre3 + "_HOME"] = "NORMAL_HOME";
    this[pre4 + "SHIFT_HOME"] = "SHIFT_HOME";
    this[pre3 + "_END"] = "NORMAL_END";
    this[pre4 + "SHIFT_END"] = "SHIFT_END";
    this[pre5 + "_HOME"] = "CTRL_HOME";
    this[pre5 + "SHIFT_HOME"] = "CTRLSHIFT_HOME";
    this[pre5 + "_END"] = "CTRL_END";
    this[pre5 + "SHIFT_END"] = "CTRLSHIFT_END";
  }

  createClass(OperatingSystem, [{
    key: "makeCommandName",
    value: function makeCommandName(evt, codePage) {
      var key = evt.keyCode;
      if (key !== Keys.CTRL && key !== Keys.ALT && key !== Keys.META_L && key !== Keys.META_R && key !== Keys.SHIFT) {

        var commandName = codePage.deadKeyState;

        if (evt.ctrlKey) {
          commandName += "CTRL";
        }
        if (evt.altKey) {
          commandName += "ALT";
        }
        if (evt.metaKey) {
          commandName += "META";
        }
        if (evt.shiftKey) {
          commandName += "SHIFT";
        }
        if (commandName === codePage.deadKeyState) {
          commandName += "NORMAL";
        }

        commandName += "_" + codePage.keyNames[key];

        return this[commandName] || commandName;
      }
    }
  }]);
  return OperatingSystem;
}();

var Windows = new OperatingSystem("Windows", "CTRL", "CTRL", "CTRL_y", "", "HOME", "END", "CTRL", "HOME", "END");

var macOS = new OperatingSystem("macOS", "META", "ALT", "METASHIFT_z", "META", "LEFTARROW", "RIGHTARROW", "META", "UPARROW", "DOWNARROW");

var CodePage = function () {
  function CodePage(codePageName, lang, options) {
    classCallCheck(this, CodePage);

    this.name = codePageName;
    this.language = lang;

    var commands = {
      NORMAL: {
        "65": "a",
        "66": "b",
        "67": "c",
        "68": "d",
        "69": "e",
        "70": "f",
        "71": "g",
        "72": "h",
        "73": "i",
        "74": "j",
        "75": "k",
        "76": "l",
        "77": "m",
        "78": "n",
        "79": "o",
        "80": "p",
        "81": "q",
        "82": "r",
        "83": "s",
        "84": "t",
        "85": "u",
        "86": "v",
        "87": "w",
        "88": "x",
        "89": "y",
        "90": "z"
      },
      SHIFT: {
        "65": "A",
        "66": "B",
        "67": "C",
        "68": "D",
        "69": "E",
        "70": "F",
        "71": "G",
        "72": "H",
        "73": "I",
        "74": "J",
        "75": "K",
        "76": "L",
        "77": "M",
        "78": "N",
        "79": "O",
        "80": "P",
        "81": "Q",
        "82": "R",
        "83": "S",
        "84": "T",
        "85": "U",
        "86": "V",
        "87": "W",
        "88": "X",
        "89": "Y",
        "90": "Z"
      }
    };

    for (var key in options) {
      commands[key] = Object.assign({}, commands[key], options[key]);
    }

    var char, code, cmdName;
    for (var i = 0; i <= 9; ++i) {
      code = Keys["NUMPAD" + i];
      commands.NORMAL[code] = i.toString();
    }

    commands.NORMAL[Keys.MULTIPLY] = "*";
    commands.NORMAL[Keys.ADD] = "+";
    commands.NORMAL[Keys.SUBTRACT] = "-";
    commands.NORMAL[Keys.DECIMALPOINT] = ".";
    commands.NORMAL[Keys.DIVIDE] = "/";

    this.keyNames = {};
    this.commandNames = [];
    for (char in Keys) {
      code = Keys[char];
      if (!isNaN(code)) {
        this.keyNames[code] = char;
      }
    }

    function overwriteText(txt, prim, lines) {
      prim.selectedText = txt;
    }

    for (var type in commands) {
      var codes = commands[type];
      if ((typeof codes === "undefined" ? "undefined" : _typeof(codes)) === "object") {
        for (code in codes) {
          if (code.indexOf("_") > -1) {
            var parts = code.split(' '),
                browser = parts[0];
            code = parts[1];
            char = commands.NORMAL[code];
            cmdName = browser + "_" + type + " " + char;
          } else {
            char = commands.NORMAL[code];
            cmdName = type + "_" + char;
          }
          this.commandNames.push(cmdName);
          this.keyNames[code] = char;
          var func = codes[code];
          if (typeof func !== "function") {
            func = overwriteText.bind(null, func);
          }
          this[cmdName] = func.bind(this);
        }
      }
    }

    this.lastDeadKeyState = this.deadKeyState = "";
  }

  createClass(CodePage, [{
    key: "resetDeadKeyState",
    value: function resetDeadKeyState() {
      if (this.deadKeyState === this.lastDeadKeyState) {
        this.deadKeyState = "";
      }
    }
  }]);
  return CodePage;
}();



CodePage.DEAD = function (key) {
  return function (prim) {
    this.lastDeadKeyState = this.deadKeyState;
    this.deadKeyState = "DEAD" + key;
  };
};

var DE_QWERTZ = new CodePage("Deutsch: QWERTZ", "de", {
  deadKeys: [220, 221, 160, 192],
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "60": "<",
    "63": "ß",
    "160": CodePage.DEAD(3),
    "163": "#",
    "171": "+",
    "173": "-",
    "186": "ü",
    "187": "+",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "#",
    "192": CodePage.DEAD(4),
    "219": "ß",
    "220": CodePage.DEAD(1),
    "221": CodePage.DEAD(2),
    "222": "ä",
    "226": "<"
  },
  DEAD1NORMAL: {
    "65": "â",
    "69": "ê",
    "73": "î",
    "79": "ô",
    "85": "û",
    "190": "."
  },
  DEAD2NORMAL: {
    "65": "á",
    "69": "é",
    "73": "í",
    "79": "ó",
    "83": "s",
    "85": "ú",
    "89": "ý"
  },
  SHIFT: {
    "32": " ",
    "48": "=",
    "49": "!",
    "50": "\"",
    "51": "§",
    "52": "$",
    "53": "%",
    "54": "&",
    "55": "/",
    "56": "(",
    "57": ")",
    "60": ">",
    "63": "?",
    "163": "'",
    "171": "*",
    "173": "_",
    "186": "Ü",
    "187": "*",
    "188": ";",
    "189": "_",
    "190": ":",
    "191": "'",
    "192": "Ö",
    "219": "?",
    "222": "Ä",
    "226": ">"
  },
  CTRLALT: {
    "48": "}",
    "50": "²",
    "51": "³",
    "55": "{",
    "56": "[",
    "57": "]",
    "60": "|",
    "63": "\\",
    "69": "€",
    "77": "µ",
    "81": "@",
    "171": "~",
    "187": "~",
    "219": "\\",
    "226": "|"
  },
  CTRLALTSHIFT: {
    "63": "ẞ",
    "219": "ẞ"
  },
  DEAD3NORMAL: {
    "65": "a",
    "69": "e",
    "73": "i",
    "79": "o",
    "85": "u",
    "190": "."
  },
  DEAD4NORMAL: {
    "65": "a",
    "69": "e",
    "73": "i",
    "79": "o",
    "83": "s",
    "85": "u",
    "89": "y"
  }
});

var EN_UKX = new CodePage("English: UK Extended", "en-GB", {
  CTRLALT: {
    "52": "€",
    "65": "á",
    "69": "é",
    "73": "í",
    "79": "ó",
    "85": "ú",
    "163": "\\",
    "192": "¦",
    "222": "\\",
    "223": "¦"
  },
  CTRLALTSHIFT: {
    "65": "Á",
    "69": "É",
    "73": "Í",
    "79": "Ó",
    "85": "Ú",
    "222": "|"
  },
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "59": ";",
    "61": "=",
    "163": "#",
    "173": "-",
    "186": ";",
    "187": "=",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "/",
    "192": "'",
    "219": "[",
    "220": "\\",
    "221": "]",
    "222": "#",
    "223": "`"
  },
  SHIFT: {
    "32": " ",
    "48": ")",
    "49": "!",
    "50": "\"",
    "51": "£",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "59": ":",
    "61": "+",
    "163": "~",
    "173": "_",
    "186": ":",
    "187": "+",
    "188": "<",
    "189": "_",
    "190": ">",
    "191": "?",
    "192": "@",
    "219": "{",
    "220": "|",
    "221": "}",
    "222": "~",
    "223": "¬"
  }
});

var EN_US = new CodePage("English: USA", "en-US", {
  NORMAL: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "59": ";",
    "61": "=",
    "173": "-",
    "186": ";",
    "187": "=",
    "188": ",",
    "189": "-",
    "190": ".",
    "191": "/",
    "219": "[",
    "220": "\\",
    "221": "]",
    "222": "'"
  },
  SHIFT: {
    "32": " ",
    "48": ")",
    "49": "!",
    "50": "@",
    "51": "#",
    "52": "$",
    "53": "%",
    "54": "^",
    "55": "&",
    "56": "*",
    "57": "(",
    "59": ":",
    "61": "+",
    "173": "_",
    "186": ":",
    "187": "+",
    "188": "<",
    "189": "_",
    "190": ">",
    "191": "?",
    "219": "{",
    "220": "|",
    "221": "}",
    "222": "\""
  }
});

var FR_AZERTY = new CodePage("Français: AZERTY", "fr", {
  deadKeys: [221, 50, 55],
  NORMAL: {
    "32": " ",
    "48": "à",
    "49": "&",
    "50": "é",
    "51": "\"",
    "52": "'",
    "53": "(",
    "54": "-",
    "55": "è",
    "56": "_",
    "57": "ç",
    "186": "$",
    "187": "=",
    "188": ",",
    "190": ";",
    "191": ":",
    "192": "ù",
    "219": ")",
    "220": "*",
    "221": CodePage.DEAD(1),
    "222": "²",
    "223": "!",
    "226": "<"
  },
  SHIFT: {
    "32": " ",
    "48": "0",
    "49": "1",
    "50": "2",
    "51": "3",
    "52": "4",
    "53": "5",
    "54": "6",
    "55": "7",
    "56": "8",
    "57": "9",
    "186": "£",
    "187": "+",
    "188": "?",
    "190": ".",
    "191": "/",
    "192": "%",
    "219": "°",
    "220": "µ",
    "223": "§",
    "226": ">"
  },
  CTRLALT: {
    "48": "@",
    "50": CodePage.DEAD(2),
    "51": "#",
    "52": "{",
    "53": "[",
    "54": "|",
    "55": CodePage.DEAD(3),
    "56": "\\",
    "57": "^",
    "69": "€",
    "186": "¤",
    "187": "}",
    "219": "]"
  },
  DEAD1NORMAL: {
    "65": "â",
    "69": "ê",
    "73": "î",
    "79": "ô",
    "85": "û"
  },
  DEAD2NORMAL: {
    "65": "ã",
    "78": "ñ",
    "79": "õ"
  },
  DEAD3NORMAL: {
    "48": "à",
    "50": "é",
    "55": "è",
    "65": "à",
    "69": "è",
    "73": "ì",
    "79": "ò",
    "85": "ù"
  }
});

var CodePages = {
  CodePage: CodePage,
  DE_QWERTZ: DE_QWERTZ,
  EN_UKX: EN_UKX,
  EN_US: EN_US,
  FR_AZERTY: FR_AZERTY
};

var Keyboard = function (_InputProcessor) {
  inherits(Keyboard, _InputProcessor);

  function Keyboard(input, commands) {
    classCallCheck(this, Keyboard);

    var _this = possibleConstructorReturn(this, (Keyboard.__proto__ || Object.getPrototypeOf(Keyboard)).call(this, "Keyboard", commands));

    _this._operatingSystem = null;
    _this.browser = isChrome ? "CHROMIUM" : isFirefox ? "FIREFOX" : isIE ? "IE" : isOpera ? "OPERA" : isSafari ? "SAFARI" : "UNKNOWN";
    _this._codePage = null;
    _this.resetDeadKeyState = function () {
      return _this.codePage.resetDeadKeyState();
    };
    return _this;
  }

  createClass(Keyboard, [{
    key: "consumeEvent",
    value: function consumeEvent(evt) {
      this.inPhysicalUse = true;
      var isKeyDown = evt.type === "keydown";
      this.setButton(evt.keyCode, isKeyDown);
      if (isKeyDown) {
        evt.cmdName = this.operatingSystem.makeCommandName(evt, this.codePage);
        evt.altCmdName = this.browser + "_" + evt.cmdName;
        evt.cmdText = this.codePage[evt.cmdName];
        evt.altCmdText = this.codePage[evt.altCmdName];
        evt.resetDeadKeyState = this.resetDeadKeyState;
      }
    }
  }, {
    key: "operatingSystem",
    get: function get$$1() {
      return this._operatingSystem;
    },
    set: function set$$1(os) {
      this._operatingSystem = os || (isMacOS ? macOS : Windows);
    }
  }, {
    key: "codePage",
    get: function get$$1() {
      return this._codePage;
    },
    set: function set$$1(cp) {
      var key, code, char, name;
      this._codePage = cp;
      if (!this._codePage) {
        var lang = navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage || navigator.browserLanguage;

        if (!lang || lang === "en") {
          lang = "en-US";
        }

        for (key in CodePages) {
          cp = CodePages[key];
          if (cp.language === lang) {
            this._codePage = cp;
            break;
          }
        }

        if (!this._codePage) {
          this._codePage = CodePages.EN_US;
        }
      }
    }
  }]);
  return Keyboard;
}(InputProcessor);

var Mouse = function (_InputProcessor) {
  inherits(Mouse, _InputProcessor);

  function Mouse(DOMElement, commands) {
    classCallCheck(this, Mouse);

    var _this = possibleConstructorReturn(this, (Mouse.__proto__ || Object.getPrototypeOf(Mouse)).call(this, "Mouse", commands, ["BUTTONS", "X", "Y", "Z", "W"], "mousedown"));

    _this.timer = null;

    var setState = function setState(stateChange, event) {
      _this.inPhysicalUse = true;
      var state = event.buttons;
      for (var button = 0; button < Mouse.NUM_BUTTONS; ++button) {
        var isDown = state & 0x1 !== 0;
        if (isDown && stateChange || !isDown && !stateChange) {
          _this.setButton(button, stateChange);
        }
        state >>= 1;
      }
      _this.setAxis("BUTTONS", event.buttons << 10);
      if (event.target === DOMElement) {
        event.preventDefault();
      }
    };

    DOMElement.addEventListener("mousedown", setState.bind(_this, true), false);
    DOMElement.addEventListener("mouseup", setState.bind(_this, false), false);
    DOMElement.addEventListener("contextmenu", function (event) {
      return !(event.ctrlKey && event.shiftKey) && event.preventDefault();
    }, false);
    DOMElement.addEventListener("mousemove", function (event) {
      setState(true, event);

      if (PointerLock.isActive) {
        var mx = event.movementX,
            my = event.movementY;

        if (mx === undefined) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        _this.setAxis("X", _this.getAxis("X") + mx);
        _this.setAxis("Y", _this.getAxis("Y") + my);
      } else {
        _this.setAxis("X", event.layerX);
        _this.setAxis("Y", event.layerY);
      }
    }, false);

    DOMElement.addEventListener("wheel", function (event) {
      if (isChrome) {
        _this.W += event.deltaX;
        _this.Z += event.deltaY;
      } else if (event.shiftKey) {
        _this.W += event.deltaY;
      } else {
        _this.Z += event.deltaY;
      }
      if (event.target === DOMElement) {
        event.preventDefault();
      }
    }, false);
    return _this;
  }

  return Mouse;
}(InputProcessor);



Mouse.NUM_BUTTONS = 3;

var DEFAULT_POSE = {
  position: [0, 0, 0],
  orientation: [0, 0, 0, 1]
};
var EMPTY_SCALE = new Vector3();
var IE_CORRECTION = new Quaternion(1, 0, 0, 0);

var PoseInputProcessor = function (_InputProcessor) {
  inherits(PoseInputProcessor, _InputProcessor);

  function PoseInputProcessor(name, commands, axisNames) {
    classCallCheck(this, PoseInputProcessor);

    var _this = possibleConstructorReturn(this, (PoseInputProcessor.__proto__ || Object.getPrototypeOf(PoseInputProcessor)).call(this, name, commands, axisNames));

    _this.currentDevice = null;
    _this.lastPose = null;
    _this.currentPose = null;
    _this.posePosition = new Vector3();
    _this.poseQuaternion = new Quaternion();
    _this.position = new Vector3();
    _this.quaternion = new Quaternion();
    _this.matrix = new Matrix4();
    return _this;
  }

  createClass(PoseInputProcessor, [{
    key: "update",
    value: function update(dt) {
      get(PoseInputProcessor.prototype.__proto__ || Object.getPrototypeOf(PoseInputProcessor.prototype), "update", this).call(this, dt);

      if (this.currentDevice) {
        var pose = this.currentPose || this.lastPose || DEFAULT_POSE;
        this.lastPose = pose;
        this.inPhysicalUse = this.hasOrientation || this.inPhysicalUse;
        var orient = this.currentPose && this.currentPose.orientation,
            pos = this.currentPose && this.currentPose.position;
        if (orient) {
          this.poseQuaternion.fromArray(orient);
          if (isMobile && isIE) {
            this.poseQuaternion.multiply(IE_CORRECTION);
          }
        } else {
          this.poseQuaternion.set(0, 0, 0, 1);
        }
        if (pos) {
          this.posePosition.fromArray(pos);
        } else {
          this.posePosition.set(0, 0, 0);
        }
      }
    }
  }, {
    key: "updateStage",
    value: function updateStage(stageMatrix) {
      this.matrix.makeRotationFromQuaternion(this.poseQuaternion);
      this.matrix.setPosition(this.posePosition);
      this.matrix.multiplyMatrices(stageMatrix, this.matrix);
      this.matrix.decompose(this.position, this.quaternion, EMPTY_SCALE);
    }
  }, {
    key: "hasPose",
    get: function get$$1() {
      return !!this.currentPose;
    }
  }]);
  return PoseInputProcessor;
}(InputProcessor);

function playPattern(devices, pattern, pause) {
  if (pattern.length > 0) {
    var length = pattern.shift();
    if (!pause) {
      for (var i = 0; i < devices.length; ++i) {
        devices[0].vibrate(1, length);
      }
    }
    setTimeout(playPattern, length, devices, pattern, !pause);
  }
}

var Gamepad = function (_PoseInputProcessor) {
  inherits(Gamepad, _PoseInputProcessor);
  createClass(Gamepad, null, [{
    key: "ID",
    value: function ID(pad) {
      var id = pad.id;
      if (id === "OpenVR Gamepad") {
        id = "Vive";
      } else if (id.indexOf("Rift") === 0) {
        id = "Rift";
      } else if (id.indexOf("Unknown") === 0) {
        id = "Unknown";
      } else {
        id = "Gamepad";
      }
      id = (id + "_" + (pad.index || 0)).replace(/\s+/g, "_");
      return id;
    }
  }, {
    key: "isMotionController",
    value: function isMotionController(pad) {
      if (pad) {
        var obj = pad.capabilities || pad.pose;
        return obj && obj.hasOrientation;
      }
      return false;
    }
  }]);

  function Gamepad(mgr, pad, axisOffset, commands) {
    classCallCheck(this, Gamepad);

    var padID = Gamepad.ID(pad);

    var _this = possibleConstructorReturn(this, (Gamepad.__proto__ || Object.getPrototypeOf(Gamepad)).call(this, padID, commands, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]));

    mgr.registerPad(padID, _this);

    _this.currentDevice = pad;
    _this.axisOffset = axisOffset;
    return _this;
  }

  createClass(Gamepad, [{
    key: "getPose",
    value: function getPose() {
      return this.currentPose;
    }
  }, {
    key: "checkDevice",
    value: function checkDevice(pad) {
      this.inPhysicalUse = true;
      var i,
          j,
          buttonMap = 0;
      this.currentDevice = pad;
      this.currentPose = this.hasOrientation && this.currentDevice.pose;
      for (i = 0, j = pad.buttons.length; i < pad.buttons.length; ++i, ++j) {
        var btn = pad.buttons[i];
        this.setButton(i, btn.pressed);
        if (btn.pressed) {
          buttonMap |= 0x1 << i;
        }

        this.setButton(j, btn.touched);
        if (btn.touched) {
          buttonMap |= 0x1 << j;
        }
      }
      this.setAxis("BUTTONS", buttonMap);
      for (i = 0; i < pad.axes.length; ++i) {
        var axisName = this.axisNames[this.axisOffset * pad.axes.length + i],
            axisValue = pad.axes[i];
        this.setAxis(axisName, axisValue);
      }
    }
  }, {
    key: "vibratePattern",
    value: function vibratePattern(pattern) {
      if (this.currentDevice) {
        if (this.currentDevice.vibrate) {
          this.currentDevice.vibrate(pattern);
        } else if (this.currentDevice.haptics && this.currentDevice.haptics.length > 0) {
          playPattern(this.currentDevice.haptics, pattern);
        }
      }
    }
  }, {
    key: "hasOrientation",
    get: function get$$1() {
      return Gamepad.isMotionController(this.currentDevice);
    }
  }, {
    key: "haptics",
    get: function get$$1() {
      return this.currentDevice && this.currentDevice.haptics;
    }
  }]);
  return Gamepad;
}(PoseInputProcessor);

Gamepad.XBOX_360_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

Gamepad.XBOX_ONE_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

Gamepad.VIVE_BUTTONS = {
  TOUCHPAD_PRESSED: 0,
  TRIGGER_PRESSED: 1,
  GRIP_PRESSED: 2,
  MENU_PRESSED: 3,

  TOUCHPAD_TOUCHED: 4,
  //TRIGGER_TOUCHED: 5, // doesn't ever actually trigger in the current version of Chromium - STM 6/22/2016
  GRIP_TOUCHED: 6,
  MENU_TOUCHED: 7
};

var blackList = ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2910.0 Safari/537.36"];

navigator.getGamepads = navigator.getGamepads || navigator.webkitGetGamepads;

var GamepadManager = function (_EventDispatcher) {
  inherits(GamepadManager, _EventDispatcher);
  createClass(GamepadManager, null, [{
    key: "isAvailable",
    get: function get$$1() {
      return blackList.indexOf(navigator.userAgent) === -1 && !!navigator.getGamepads;
    }
  }]);

  function GamepadManager() {
    classCallCheck(this, GamepadManager);

    var _this = possibleConstructorReturn(this, (GamepadManager.__proto__ || Object.getPrototypeOf(GamepadManager)).call(this));

    _this.currentDevices = [];
    _this.currentDeviceIDs = [];
    _this.currentManagers = {};
    return _this;
  }

  createClass(GamepadManager, [{
    key: "poll",
    value: function poll() {
      if (GamepadManager.isAvailable) {
        var maybePads = navigator.getGamepads(),
            pads = [],
            padIDs = [],
            newPads = [],
            oldPads = [],
            i,
            padID;

        if (maybePads) {
          for (i = 0; i < maybePads.length; ++i) {
            var maybePad = maybePads[i];
            if (maybePad) {
              padID = Gamepad.ID(maybePad);
              var padIdx = this.currentDeviceIDs.indexOf(padID);
              pads.push(maybePad);
              padIDs.push(padID);
              if (padIdx === -1) {
                newPads.push(maybePad);
                this.currentDeviceIDs.push(padID);
                this.currentDevices.push(maybePad);
                delete this.currentManagers[padID];
              } else {
                this.currentDevices[padIdx] = maybePad;
              }
            }
          }
        }

        for (i = this.currentDeviceIDs.length - 1; i >= 0; --i) {
          padID = this.currentDeviceIDs[i];
          var mgr = this.currentManagers[padID],
              pad = this.currentDevices[i];
          if (padIDs.indexOf(padID) === -1) {
            oldPads.push(padID);
            this.currentDevices.splice(i, 1);
            this.currentDeviceIDs.splice(i, 1);
          } else if (mgr) {
            mgr.checkDevice(pad);
          }
        }

        newPads.forEach(this.emit.bind(this, "gamepadconnected"));
        oldPads.forEach(this.emit.bind(this, "gamepaddisconnected"));
      }
    }
  }, {
    key: "registerPad",
    value: function registerPad(id, mgr) {
      this.currentManagers[id] = mgr;
    }
  }, {
    key: "pads",
    get: function get$$1() {
      return this.currentDevices;
    }
  }]);
  return GamepadManager;
}(EventDispatcher);

var TEMP$1 = new Vector2();

var Touch = function (_InputProcessor) {
  inherits(Touch, _InputProcessor);

  function Touch(DOMElement, commands) {
    classCallCheck(this, Touch);

    var axes = ["FINGERS"];
    for (var i = 0; i < 10; ++i) {
      axes.push("X" + i);
      axes.push("Y" + i);
      axes.push("LX" + i);
      axes.push("LY" + i);
      axes.push("DX" + i);
      axes.push("DY" + i);
    }

    var _this = possibleConstructorReturn(this, (Touch.__proto__ || Object.getPrototypeOf(Touch)).call(this, "Touch", commands, axes, "touchend"));

    var setState = function setState(stateChange, setAxis, event) {
      _this.inPhysicalUse = true;
      // We have to find the minimum identifier value because iOS uses a very
      // large number that changes after every gesture. Every other platform
      // just numbers them 0 through 9.
      var touches = event.changedTouches,
          minIdentifier = Number.MAX_VALUE;
      for (var _i = 0; _i < touches.length; ++_i) {
        minIdentifier = Math.min(minIdentifier, touches[_i].identifier);
      }

      for (var _i2 = 0; _i2 < touches.length; ++_i2) {
        var t = touches[_i2],
            id = t.identifier - minIdentifier,
            x = t.pageX,
            y = t.pageY;
        _this.setAxis("X" + id, x);
        _this.setAxis("Y" + id, y);
        _this.setButton("FINGER" + t.identifier, stateChange);

        if (setAxis) {
          var lx = _this.getAxis("LX" + id),
              ly = _this.getAxis("LY" + id);
          _this.setAxis("DX" + id, x - lx);
          _this.setAxis("DY" + id, y - ly);
        }

        _this.setAxis("LX" + id, x);
        _this.setAxis("LY" + id, y);
      }

      touches = event.touches;
      var fingerState = 0;
      for (var _i3 = 0; _i3 < touches.length; ++_i3) {
        var _t = touches[_i3];
        fingerState |= 1 << _t.identifier;
      }
      _this.setAxis("FINGERS", fingerState);

      if (event.target === DOMElement) {
        event.preventDefault();
      }
    };

    DOMElement.addEventListener("touchstart", setState.bind(_this, true, false), false);
    DOMElement.addEventListener("touchend", setState.bind(_this, false, true), false);
    DOMElement.addEventListener("touchmove", setState.bind(_this, true, true), false);
    return _this;
  }

  createClass(Touch, [{
    key: "update",
    value: function update(dt) {
      get(Touch.prototype.__proto__ || Object.getPrototypeOf(Touch.prototype), "update", this).call(this, dt);
      for (var id = 0; id < 10; ++id) {
        var x = this.getAxis("X" + id),
            y = this.getAxis("Y" + id),
            lx = this.getAxis("LX" + id),
            ly = this.getAxis("LY" + id);
        this.setAxis("DX" + id, x - lx);
        this.setAxis("DY" + id, y - ly);
        this.setAxis("LX" + id, x);
        this.setAxis("LY" + id, y);
      }
    }
  }]);
  return Touch;
}(InputProcessor);

var Speech$1 = function (_InputProcessor) {
  inherits(Speech, _InputProcessor);

  function Speech(commands) {
    classCallCheck(this, Speech);

    var _this = possibleConstructorReturn(this, (Speech.__proto__ || Object.getPrototypeOf(Speech)).call(this, "Speech", commands));

    var running = false,
        recognition = null,
        errorMessage = null;

    function warn() {
      var msg = "Failed to initialize speech engine. Reason: " + errorMessage.message;
      console.error(msg);
      return false;
    }

    function start() {
      if (!available) {
        return warn();
      } else if (!running) {
        running = true;
        recognition.start();
        return true;
      }
      return false;
    }

    function stop() {
      if (!available) {
        return warn();
      }
      if (running) {
        recognition.stop();
        return true;
      }
      return false;
    }

    _this.check = function () {
      if (this.enabled && !running) {
        start();
      } else if (!this.enabled && running) {
        stop();
      }
    };

    _this.getErrorMessage = function () {
      return errorMessage;
    };

    try {
      if (window.SpeechRecognition) {
        // just in case this ever gets standardized
        recognition = new SpeechRecognition();
      } else {
        // purposefully don't check the existance so it errors out and setup fails.
        recognition = new webkitSpeechRecognition();
      }
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      var restart = false;
      recognition.addEventListener("start", function () {
        console.log("speech started");
        command = "";
      }.bind(_this), true);

      recognition.addEventListener("error", function (evt) {
        restart = true;
        console.log("speech error", evt);
        running = false;
        command = "speech error";
      }.bind(_this), true);

      recognition.addEventListener("end", function (evt) {
        console.log("speech ended", evt);
        running = false;
        command = "speech ended";
        if (restart) {
          restart = false;
          this.enable(true);
        }
      }.bind(_this), true);

      recognition.addEventListener("result", function (evt) {
        var newCommand = [];
        var result = evt.results[evt.resultIndex];
        var max = 0;
        var maxI = -1;
        if (result && result.isFinal) {
          for (var i = 0; i < result.length; ++i) {
            var alt = result[i];
            if (alt.confidence > max) {
              max = alt.confidence;
              maxI = i;
            }
          }
        }

        if (max > 0.85) {
          newCommand.push(result[maxI].transcript.trim());
        }

        newCommand = newCommand.join(" ");

        if (newCommand !== this.inputState) {
          this.inputState.text = newCommand;
        }
        this.update();
      }.bind(_this), true);

      available = true;
    } catch (exp) {
      console.error(exp);
      errorMessage = exp;
      available = false;
    }
    return _this;
  }

  createClass(Speech, [{
    key: "cloneCommand",
    value: function cloneCommand(cmd) {
      return {
        name: cmd.name,
        preamble: cmd.preamble,
        keywords: Speech.maybeClone(cmd.keywords),
        commandUp: cmd.commandUp,
        disabled: cmd.disabled
      };
    }
  }, {
    key: "evalCommand",
    value: function evalCommand(cmd, cmdState, metaKeysSet, dt) {
      if (metaKeysSet && this.inputState.text) {
        for (var i = 0; i < cmd.keywords.length; ++i) {
          if (this.inputState.text.indexOf(cmd.keywords[i]) === 0 && (cmd.preamble || cmd.keywords[i].length === this.inputState.text.length)) {
            cmdState.pressed = true;
            cmdState.value = this.inputState.text.substring(cmd.keywords[i].length).trim();
            this.inputState.text = null;
          }
        }
      }
    }
  }, {
    key: "enable",
    value: function enable(k, v) {
      get(Speech.prototype.__proto__ || Object.getPrototypeOf(Speech.prototype), "enable", this).call(this, k, v);
      this.check();
    }
  }], [{
    key: "maybeClone",
    value: function maybeClone(arr) {
      return arr && arr.slice() || [];
    }
  }]);
  return Speech;
}(InputProcessor);

var SensorSample = function () {
  function SensorSample(sample, timestampS) {
    classCallCheck(this, SensorSample);

    this.set(sample, timestampS);
  }

  createClass(SensorSample, [{
    key: "set",
    value: function set$$1(sample, timestampS) {

      this.sample = sample;
      this.timestampS = timestampS;
    }
  }, {
    key: "copy",
    value: function copy(sensorSample) {

      this.set(sensorSample.sample, sensorSample.timestampS);
    }
  }]);
  return SensorSample;
}();

/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An implementation of a simple complementary filter, which fuses gyroscope and accelerometer data from the 'devicemotion' event.
 *
 * Accelerometer data is very noisy, but stable over the long term. Gyroscope data is smooth, but tends to drift over the long term.
 *
 * This fusion is relatively simple:
 * 1. Get orientation estimates from accelerometer by applying a low-pass filter on that data.
 * 2. Get orientation estimates from gyroscope by integrating over time.
 * 3. Combine the two estimates, weighing (1) in the long term, but (2) for the short term.
 */

var ComplementaryFilter = function () {
  function ComplementaryFilter(kFilter) {
    classCallCheck(this, ComplementaryFilter);

    this.kFilter = kFilter;

    // Raw sensor measurements.
    this.currentAccelMeasurement = new SensorSample();
    this.currentGyroMeasurement = new SensorSample();
    this.previousGyroMeasurement = new SensorSample();

    // Set default look direction to be in the correct direction.
    if (isiOS) {
      this.filterQ = new Quaternion(-1, 0, 0, 1);
    } else {
      this.filterQ = new Quaternion(1, 0, 0, 1);
    }
    this.previousFilterQ = new Quaternion();
    this.previousFilterQ.copy(this.filterQ);

    // Orientation based on the accelerometer.
    this.accelQ = new Quaternion();
    // Whether or not the orientation has been initialized.
    this.isOrientationInitialized = false;
    // Running estimate of gravity based on the current orientation.
    this.estimatedGravity = new Vector3();
    // Measured gravity based on accelerometer.
    this.measuredGravity = new Vector3();

    // Debug only quaternion of gyro-based orientation.
    this.gyroIntegralQ = new Quaternion();
  }

  createClass(ComplementaryFilter, [{
    key: "addAccelMeasurement",
    value: function addAccelMeasurement(vector, timestampS) {
      this.currentAccelMeasurement.set(vector, timestampS);
    }
  }, {
    key: "addGyroMeasurement",
    value: function addGyroMeasurement(vector, timestampS) {
      this.currentGyroMeasurement.set(vector, timestampS);

      var deltaT = timestampS - this.previousGyroMeasurement.timestampS;
      if (isTimestampDeltaValid(deltaT)) {
        this.run_();
      }

      this.previousGyroMeasurement.copy(this.currentGyroMeasurement);
    }
  }, {
    key: "run_",
    value: function run_() {

      if (!this.isOrientationInitialized) {
        this.accelQ = this.accelToQuaternion_(this.currentAccelMeasurement.sample);
        this.previousFilterQ.copy(this.accelQ);
        this.isOrientationInitialized = true;
        return;
      }

      var deltaT = this.currentGyroMeasurement.timestampS - this.previousGyroMeasurement.timestampS;

      // Convert gyro rotation vector to a quaternion delta.
      var gyroDeltaQ = this.gyroToQuaternionDelta_(this.currentGyroMeasurement.sample, deltaT);
      this.gyroIntegralQ.multiply(gyroDeltaQ);

      // filter_1 = K * (filter_0 + gyro * dT) + (1 - K) * accel.
      this.filterQ.copy(this.previousFilterQ);
      this.filterQ.multiply(gyroDeltaQ);

      // Calculate the delta between the current estimated gravity and the real
      // gravity vector from accelerometer.
      var invFilterQ = new Quaternion();
      invFilterQ.copy(this.filterQ);
      invFilterQ.inverse();

      this.estimatedGravity.set(0, 0, -1);
      this.estimatedGravity.applyQuaternion(invFilterQ);
      this.estimatedGravity.normalize();

      this.measuredGravity.copy(this.currentAccelMeasurement.sample);
      this.measuredGravity.normalize();

      // Compare estimated gravity with measured gravity, get the delta quaternion
      // between the two.
      var deltaQ = new Quaternion();
      deltaQ.setFromUnitVectors(this.estimatedGravity, this.measuredGravity);
      deltaQ.inverse();

      // Calculate the SLERP target: current orientation plus the measured-estimated
      // quaternion delta.
      var targetQ = new Quaternion();
      targetQ.copy(this.filterQ);
      targetQ.multiply(deltaQ);

      // SLERP factor: 0 is pure gyro, 1 is pure accel.
      this.filterQ.slerp(targetQ, 1 - this.kFilter);

      this.previousFilterQ.copy(this.filterQ);
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      return this.filterQ;
    }
  }, {
    key: "accelToQuaternion_",
    value: function accelToQuaternion_(accel) {
      var normAccel = new Vector3();
      normAccel.copy(accel);
      normAccel.normalize();
      var quat = new Quaternion();
      quat.setFromUnitVectors(new Vector3(0, 0, -1), normAccel);
      quat.inverse();
      return quat;
    }
  }, {
    key: "gyroToQuaternionDelta_",
    value: function gyroToQuaternionDelta_(gyro, dt) {
      // Extract axis and angle from the gyroscope data.
      var quat = new Quaternion();
      var axis = new Vector3();
      axis.copy(gyro);
      axis.normalize();
      quat.setFromAxisAngle(axis, gyro.length() * dt);
      return quat;
    }
  }]);
  return ComplementaryFilter;
}();

/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DEG2RAD$2 = Math$1.DEG2RAD;

var AXIS = new Vector3();

var PosePredictor = function () {
  function PosePredictor(predictionTimeS) {
    classCallCheck(this, PosePredictor);

    this.predictionTimeS = predictionTimeS;
    this.previousQ = new Quaternion();
    this.previousTimestampS = null;
    this.deltaQ = new Quaternion();
  }

  createClass(PosePredictor, [{
    key: "getPrediction",
    value: function getPrediction(currentQ, gyro, timestampS, outQ) {
      if (!this.previousTimestampS) {
        this.previousQ.copy(currentQ);
        this.previousTimestampS = timestampS;
        return currentQ;
      }

      // Calculate axis and angle based on gyroscope rotation rate data.
      AXIS.copy(gyro);
      AXIS.normalize();

      var angularSpeed = gyro.length();

      // If we're rotating slowly, don't do prediction.
      if (angularSpeed < DEG2RAD$2 * 20) {
        outQ.copy(currentQ);
        this.previousQ.copy(currentQ);
        return;
      }

      // Get the predicted angle based on the time delta and latency.
      var deltaT = timestampS - this.previousTimestampS;
      var predictAngle = angularSpeed * this.predictionTimeS;

      this.deltaQ.setFromAxisAngle(AXIS, predictAngle);
      outQ.copy(this.previousQ);
      outQ.multiply(this.deltaQ);

      this.previousQ.copy(currentQ);
      this.previousTimestampS = timestampS;
    }
  }]);
  return PosePredictor;
}();

/*
 * Copyright 2015 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var isFirefoxAndroid = isFirefox && isMobile;
var DEG2RAD$1 = Math$1.DEG2RAD;

/**
 * The pose sensor, implemented using DeviceMotion APIs.
 */

var FusionPoseSensor = function () {
  function FusionPoseSensor(options) {
    classCallCheck(this, FusionPoseSensor);

    options = Object.assign({
      // Complementary filter coefficient. 0 for accelerometer, 1 for gyro.
      K_FILTER: 0.98,

      // How far into the future to predict during fast motion (in seconds).
      PREDICTION_TIME_S: 0.040
    }, options);

    this.deviceId = 'webvr-polyfill:fused';
    this.deviceName = 'VR Position Device (webvr-polyfill:fused)';

    this.accelerometer = new Vector3();
    this.gyroscope = new Vector3();

    window.addEventListener('devicemotion', this.onDeviceMotionChange_.bind(this));
    window.addEventListener('orientationchange', this.onScreenOrientationChange_.bind(this));

    this.filter = new ComplementaryFilter(options.K_FILTER);
    this.posePredictor = new PosePredictor(options.PREDICTION_TIME_S);

    this.filterToWorldQ = new Quaternion();

    // Set the filter to world transform, depending on OS.
    if (isiOS) {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), Math.PI / 2);
    } else {
      this.filterToWorldQ.setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    }

    this.inverseWorldToScreenQ = new Quaternion();
    this.worldToScreenQ = new Quaternion();
    this.originalPoseAdjustQ = new Quaternion();
    this.originalPoseAdjustQ.setFromAxisAngle(new Vector3(0, 0, 1), -window.orientation * DEG2RAD$1);

    this.setScreenTransform_();
    // Adjust this filter for being in landscape mode.
    if (isLandscape()) {
      this.filterToWorldQ.multiply(this.inverseWorldToScreenQ);
    }

    // Keep track of a reset transform for resetSensor.
    this.resetQ = new Quaternion();

    this.orientationOut_ = new Float32Array(4);
    this.predictedQ = new Quaternion();
    this.previousTimestampS = null;
  }

  createClass(FusionPoseSensor, [{
    key: "getPosition",
    value: function getPosition() {
      // This PoseSensor doesn't support position
      return null;
    }
  }, {
    key: "getOrientation",
    value: function getOrientation() {
      // Convert from filter space to the the same system used by the deviceorientation event.
      var orientation = this.filter.getOrientation();

      // Predict orientation.
      this.posePredictor.getPrediction(orientation, this.gyroscope, this.previousTimestampS, this.predictedQ);

      // Convert to THREE coordinate system: -Z forward, Y up, X right.
      var out = new Quaternion();
      out.copy(this.filterToWorldQ);
      out.multiply(this.resetQ);
      out.multiply(this.predictedQ);
      out.multiply(this.worldToScreenQ);

      this.orientationOut_[0] = out.x;
      this.orientationOut_[1] = out.y;
      this.orientationOut_[2] = out.z;
      this.orientationOut_[3] = out.w;
      return this.orientationOut_;
    }
  }, {
    key: "getPose",
    value: function getPose() {
      return {
        position: this.getPosition(),
        orientation: this.getOrientation(),
        linearVelocity: null,
        linearAcceleration: null,
        angularVelocity: null,
        angularAcceleration: null
      };
    }
  }, {
    key: "resetPose",
    value: function resetPose() {
      // Reduce to inverted yaw-only.
      this.resetQ.copy(this.filter.getOrientation());
      this.resetQ.x = 0;
      this.resetQ.y = 0;
      this.resetQ.z *= -1;
      this.resetQ.normalize();

      // Take into account extra transformations in landscape mode.
      if (isLandscape()) {
        this.resetQ.multiply(this.inverseWorldToScreenQ);
      }

      // Take into account original pose.
      this.resetQ.multiply(this.originalPoseAdjustQ);
    }
  }, {
    key: "onDeviceMotionChange_",
    value: function onDeviceMotionChange_(deviceMotion) {
      var accGravity = deviceMotion.accelerationIncludingGravity,
          rotRate = deviceMotion.rotationRate;
      var timestampS = deviceMotion.timeStamp / 1000;

      // Firefox Android timeStamp returns one thousandth of a millisecond.
      if (isFirefoxAndroid) {
        timestampS /= 1000;
      }

      var deltaS = timestampS - this.previousTimestampS;
      if (isTimestampDeltaValid(deltaS)) {
        this.accelerometer.set(-accGravity.x, -accGravity.y, -accGravity.z);
        this.gyroscope.set(rotRate.alpha, rotRate.beta, rotRate.gamma);

        // With iOS and Firefox Android, rotationRate is reported in degrees, so we first convert to radians.
        if (isiOS || isFirefoxAndroid) {
          this.gyroscope.multiplyScalar(DEG2RAD$1);
        }

        this.filter.addAccelMeasurement(this.accelerometer, timestampS);
        this.filter.addGyroMeasurement(this.gyroscope, timestampS);
      } else if (this.previousTimestampS !== null) {
        console.warn("Invalid timestamps detected. Time step between successive gyroscope sensor samples is very small or not monotonic");
      }

      this.previousTimestampS = timestampS;
    }
  }, {
    key: "onScreenOrientationChange_",
    value: function onScreenOrientationChange_(screenOrientation) {
      this.setScreenTransform_();
    }
  }, {
    key: "setScreenTransform_",
    value: function setScreenTransform_() {
      this.worldToScreenQ.set(0, 0, 0, 1);
      switch (window.orientation) {
        case 0:
          break;
        case 90:
          this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2);
          break;
        case -90:
          this.worldToScreenQ.setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 2);
          break;
        case 180:
          // TODO.
          break;
      }
      this.inverseWorldToScreenQ.copy(this.worldToScreenQ);
      this.inverseWorldToScreenQ.inverse();
    }
  }]);
  return FusionPoseSensor;
}();

/*
 * Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Eye = {
  LEFT: "left",
  RIGHT: "right"
};
var ipd = 0.03;
var neckLength = 0;
var neckDepth = 0;

var CardboardVRDisplay = function (_VRDisplay) {
  inherits(CardboardVRDisplay, _VRDisplay);
  createClass(CardboardVRDisplay, null, [{
    key: "IPD",
    get: function get$$1() {
      return ipd;
    },
    set: function set$$1(v) {
      ipd = v;
    }
  }, {
    key: "NECK_LENGTH",
    get: function get$$1() {
      return neckLength;
    },
    set: function set$$1(v) {
      neckLength = v;
    }
  }, {
    key: "NECK_DEPTH",
    get: function get$$1() {
      return neckDepth;
    },
    set: function set$$1(v) {
      neckDepth = v;
    }
  }]);

  function CardboardVRDisplay(options) {
    classCallCheck(this, CardboardVRDisplay);

    var _this = possibleConstructorReturn(this, (CardboardVRDisplay.__proto__ || Object.getPrototypeOf(CardboardVRDisplay)).call(this, "Google Cardboard"));

    _this.DOMElement = null;

    // "Private" members.
    _this.poseSensor_ = options && options.overrideOrientation || new FusionPoseSensor(options);
    return _this;
  }

  createClass(CardboardVRDisplay, [{
    key: "_getPose",
    value: function _getPose() {
      return this.poseSensor_.getPose();
    }
  }, {
    key: "resetPose",
    value: function resetPose() {
      this.poseSensor_.resetPose();
    }
  }, {
    key: "getEyeParameters",
    value: function getEyeParameters(whichEye) {
      var offset = [ipd, neckLength, neckDepth];

      if (whichEye == Eye.LEFT) {
        offset[0] *= -1.0;
      }

      var width = screen.width,
          height = screen.height;

      if (this.DOMElement) {
        width = this.DOMElement.clientWidth;
        height = this.DOMElement.clientHeight;
      } else if (isiOS && isLandscape()) {
        var temp = width;
        width = height;
        height = temp;
      }

      width *= devicePixelRatio;
      height *= devicePixelRatio;

      return {
        fieldOfView: {
          upDegrees: 40,
          leftDegrees: 40,
          rightDegrees: 40,
          downDegrees: 40
        },
        offset: offset,
        renderWidth: 0.5 * width,
        renderHeight: height
      };
    }
  }]);
  return CardboardVRDisplay;
}(VRDisplay);

var Automator = function (_EventDispatcher) {
  inherits(Automator, _EventDispatcher);

  function Automator() {
    var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
    classCallCheck(this, Automator);

    var _this = possibleConstructorReturn(this, (Automator.__proto__ || Object.getPrototypeOf(Automator)).call(this));

    _this.root = root;
    _this.frames = [];
    _this.startT = null;
    return _this;
  }

  createClass(Automator, [{
    key: "update",
    value: function update(t) {
      if (this.startT === null) {
        this.startT = t;
      }
    }
  }, {
    key: "reset",
    value: function reset() {
      this.frames.splice(0);
      this.startT = null;
    }
  }, {
    key: "length",
    get: function get$$1() {
      return this.frames.length;
    }
  }]);
  return Automator;
}(EventDispatcher);

var Obj = function Obj(path) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
  classCallCheck(this, Obj);

  this.path = path;

  var parts = path.split("."),
      key = parts[parts.length - 1];

  var find = function find(fill) {
    var head = root;

    for (var i = 0; i < parts.length - 1; ++i) {
      var part = parts[i];
      if (head[part] === undefined || head[part] === null) {
        if (fill) {
          if (/^\d+$/.test(parts[i + 1])) {
            head[part] = [];
          } else {
            head[part] = {};
          }
        } else {
          head = null;
          break;
        }
      }
      head = head[part];
    }

    return head;
  };

  this.get = function () {
    var obj = find(false);
    return obj && obj[key];
  };

  this.set = function (v) {
    var obj = find(true);
    if (obj) {
      obj[key] = v;
    }
  };
};

var Record = function (_Obj) {
  inherits(Record, _Obj);

  function Record(path, value, root) {
    classCallCheck(this, Record);

    var _this = possibleConstructorReturn(this, (Record.__proto__ || Object.getPrototypeOf(Record)).call(this, path, root));

    _this.value = value;
    return _this;
  }

  createClass(Record, [{
    key: "write",
    value: function write() {
      if (this.value !== this.get()) {
        this.set(this.value);
      }
    }
  }]);
  return Record;
}(Obj);

/*
  A collection of all the recorded state values at a single point in time.
*/

var Frame = function () {
  createClass(Frame, null, [{
    key: "parse",
    value: function parse(timestamp, obj, root) {
      var stack = [{
        path: "",
        value: obj
      }],
          records = [];

      while (stack.length > 0) {
        var _stack$shift = stack.shift(),
            path = _stack$shift.path,
            value = _stack$shift.value;

        if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
          for (var key in value) {
            var newPath = path;
            if (path.length > 0) {
              newPath += ".";
            }
            newPath += key;
            stack.push({
              path: newPath,
              value: value[key]
            });
          }
        } else {
          records.push(new Record(path, value, root));
        }
      }

      return new Frame(timestamp, records);
    }
  }]);

  function Frame(timestamp, records) {
    classCallCheck(this, Frame);

    this.t = timestamp;
    this.records = records;
  }

  createClass(Frame, [{
    key: "write",
    value: function write() {
      for (var i = 0; i < this.records.length; ++i) {
        this.records[i].write();
      }
    }
  }]);
  return Frame;
}();

var Player = function (_Automator) {
  inherits(Player, _Automator);

  function Player(root) {
    classCallCheck(this, Player);

    var _this = possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, root));

    _this.frameIndex = -1;
    return _this;
  }

  createClass(Player, [{
    key: "parse",
    value: function parse(json) {
      this.load(JSON.parse(json));
    }
  }, {
    key: "load",
    value: function load(objs) {
      var frames = [];

      for (var t in objs) {
        frames.push(Frame.parse(t, objs[t], this.root));
      }

      this.append(frames);
    }
  }, {
    key: "reset",
    value: function reset() {
      get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "reset", this).call(this);
      this.frameIndex = -1;
    }
  }, {
    key: "update",
    value: function update(t) {
      get(Player.prototype.__proto__ || Object.getPrototypeOf(Player.prototype), "update", this).call(this, t);

      t += this.minT - this.startT;

      var oldFrameIndex = this.frameIndex;
      while (this.frameIndex < this.frames.length - 1 && t >= this.frames[this.frameIndex + 1].t) {
        ++this.frameIndex;
      }

      if (this.frameIndex !== oldFrameIndex && 0 <= this.frameIndex && this.frameIndex < this.frames.length) {
        var frame = this.frames[this.frameIndex];
        frame.write();
        this.emit("frame", frame);
      }
    }
  }, {
    key: "append",
    value: function append(frames) {
      if (frames) {
        this.frames.push.apply(this.frames, frames);
        this.minT = this.frames.map(function (f) {
          return f.t;
        }).reduce(function (a, b) {
          return Math.min(a, b);
        }, Number.MAX_VALUE);
      }
    }
  }, {
    key: "reverse",
    value: function reverse() {
      var maxT = this.frames.map(function (f) {
        return f.t;
      }).reduce(function (a, b) {
        return Math.max(a, b);
      }, Number.MIN_VALUE);
      this.frames.reverse();
      for (var i = 0; i < this.frames.length; ++i) {
        var frame = this.frames[i];
        frame.t = maxT - frame.t + this.minT;
      }
    }
  }, {
    key: "done",
    get: function get$$1() {
      return this.frameIndex >= this.frames.length - 1;
    }
  }]);
  return Player;
}(Automator);

var MockVRDisplay = function () {
  function MockVRDisplay(data) {
    classCallCheck(this, MockVRDisplay);


    var timestamp = null,
        displayName = null,
        startOn = null;

    Object.defineProperties(this, {
      displayName: {
        get: function get$$1() {
          return "Mock " + displayName;
        },
        set: function set$$1(v) {
          return displayName = v;
        }
      }
    });

    var dataPack = {
      currentDisplay: this,
      currentEyeParams: {
        left: {
          fieldOfView: {
            downDegrees: null,
            leftDegrees: null,
            rightDegrees: null,
            upDegrees: null
          },
          renderWidth: null,
          renderHeight: null,
          offset: null
        },
        right: {
          fieldOfView: {
            downDegrees: null,
            leftDegrees: null,
            rightDegrees: null,
            upDegrees: null
          },
          renderWidth: null,
          renderHeight: null,
          offset: null
        }
      },
      currentPose: {
        timestamp: null,
        orientation: null,
        position: null
      }
    };

    Object.defineProperties(dataPack.currentPose, {
      timestamp: {
        get: function get$$1() {
          return timestamp;
        },
        set: function set$$1(v) {
          return timestamp = v;
        }
      },
      timeStamp: {
        get: function get$$1() {
          return timestamp;
        },
        set: function set$$1(v) {
          return timestamp = v;
        }
      }
    });

    var player = new Player(dataPack);
    player.load(data);
    player.update(0);

    this.requestAnimationFrame = function (thunk) {
      return window.requestAnimationFrame(function (t) {
        if (startOn === null) {
          startOn = t;
        }
        player.update(t - startOn);
        thunk(t);
      });
    };

    this.getPose = function () {
      return dataPack.currentPose;
    };
    this.getEyeParameters = function (side) {
      return dataPack.currentEyeParams[side];
    };
    this.resetPose = function () {};
  }

  createClass(MockVRDisplay, [{
    key: "cancelAnimationFrame",
    value: function cancelAnimationFrame(handle) {
      window.cancelAnimationFrame(handle);
    }
  }]);
  return MockVRDisplay;
}();

function getObject(url, options) {
  return get$1("json", url, options);
}

var hasNativeWebVR = "getVRDisplays" in navigator;
var allDisplays = [];
var isCardboardCompatible = isMobile && !isGearVR;

var polyFillDevicesPopulated = false;
var standardMonitorPopulated = false;

function upgrade1_0_to_1_1() {
  // Put a shim in place to update the API to 1.1 if needed.
  if ("VRDisplay" in window && !("VRFrameData" in window)) {
    // Provide the VRFrameData object.
    window.VRFrameData = VRFrameData;

    // A lot of Chrome builds don't have depthNear and depthFar, even
    // though they're in the WebVR 1.0 spec. Patch them in if they're not present.
    if (!("depthNear" in window.VRDisplay.prototype)) {
      window.VRDisplay.prototype.depthNear = 0.01;
    }

    if (!("depthFar" in window.VRDisplay.prototype)) {
      window.VRDisplay.prototype.depthFar = 10000.0;
    }

    window.VRDisplay.prototype.getFrameData = function (frameData) {
      return frameDataFromPose(frameData, this.getPose(), this);
    };
  }
}

function getPolyfillDisplays(options) {
  if (!polyFillDevicesPopulated) {
    if (isCardboardCompatible || options.forceStereo) {
      FullScreen.addChangeListener(fireVRDisplayPresentChange);
      allDisplays.push(new CardboardVRDisplay(options));
    }

    polyFillDevicesPopulated = true;
  }

  return new Promise(function (resolve, reject) {
    try {
      resolve(allDisplays);
    } catch (e) {
      reject(e);
    }
  });
}

function fireVRDisplayPresentChange() {
  var event = new CustomEvent('vrdisplaypresentchange', { detail: { vrdisplay: this } });
  window.dispatchEvent(event);
}

function installPolyfill(options) {
  var oldGetVRDisplays = null;
  if (hasNativeWebVR) {
    oldGetVRDisplays = navigator.getVRDisplays;
  } else {
    oldGetVRDisplays = function oldGetVRDisplays() {
      return Promise.resolve([]);
    };
  }

  // Provide navigator.getVRDisplays.
  navigator.getVRDisplays = function () {
    return oldGetVRDisplays.call(navigator).then(function (displays) {
      if (displays.length === 0 || navigator.userAgent === "Mozilla/5.0 (Linux; Android 6.0.1; SM-G930V Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2664.0 Mobile Safari/537.36") {
        options.overrideOrientation = displays[0];
        return getPolyfillDisplays(options);
      } else {
        return displays;
      }
    });
  };

  // Provide the VRDisplay object.
  window.VRDisplay = window.VRDisplay || VRDisplay;

  // Provide navigator.vrEnabled.
  Object.defineProperty(navigator, "vrEnabled", {
    get: function get$$1() {
      return isCardboardCompatible && (FullScreen.available || isiOS); // just fake it for iOS
    }
  });
}

function installStandardMonitor(options) {
  if (!standardMonitorPopulated && !isGearVR) {
    var oldGetVRDisplays = navigator.getVRDisplays;
    navigator.getVRDisplays = function () {
      return oldGetVRDisplays.call(navigator).then(function (displays) {
        var created = false;
        for (var i = 0; i < displays.length && !created; ++i) {
          var dsp = displays[i];
          created = dsp instanceof StandardMonitorVRDisplay;
        }
        if (!created) {
          if (options && options.defaultFOV) {
            StandardMonitorVRDisplay.DEFAULT_FOV = options.defaultFOV;
          }
          displays.unshift(new StandardMonitorVRDisplay(displays[0]));
        }
        return displays;
      });
    };

    standardMonitorPopulated = true;
  }
}

function installMockDisplay(options) {
  var data = options && options.replayData;
  if (data) {
    var oldGetVRDisplays = navigator.getVRDisplays;
    navigator.getVRDisplays = function () {
      return oldGetVRDisplays.call(navigator).then(function (displays) {
        var mockDeviceExists = displays.map(function (d) {
          return d instanceof MockVRDisplay;
        }).reduce(function (a, b) {
          return a || b;
        }, false);

        if (mockDeviceExists) {
          return displays;
        } else {
          var done = function done(obj) {
            displays.push(new MockVRDisplay(obj));
            resolve(displays);
          };

          if ((typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
            return Promise.resolve(data);
          } else if (/\.json$/.test(data)) {
            return getObject(data);
          } else {
            return Promise.resolve(JSON.parse(data));
          }
        }
      });
    };
  }
}

function install(options) {
  options = Object.assign({
    // Forces availability of VR mode, even for non-mobile devices.
    FORCE_ENABLE_VR: false
  }, options);

  installPolyfill(options);
  installStandardMonitor(options);
  installMockDisplay(options);
  upgrade1_0_to_1_1();
}

var VR = function (_PoseInputProcessor) {
  inherits(VR, _PoseInputProcessor);
  createClass(VR, null, [{
    key: "isStereoDisplay",
    value: function isStereoDisplay(display) {
      var leftParams = display.getEyeParameters("left"),
          rightParams = display.getEyeParameters("right");
      return !!(leftParams && rightParams);
    }
  }]);

  function VR(options) {
    classCallCheck(this, VR);

    var _this = possibleConstructorReturn(this, (VR.__proto__ || Object.getPrototypeOf(VR)).call(this, "VR"));

    _this.options = options;
    _this.displays = [];
    _this._transformers = [];
    _this.lastLastTimerDevice = null;
    _this.lastTimerDevice = null;
    _this.timerDevice = null;
    _this.timer = null;
    _this.currentDeviceIndex = -1;
    _this.movePlayer = new Matrix4();
    _this.stage = null;
    _this.lastStageWidth = null;
    _this.lastStageDepth = null;
    _this.isStereo = false;
    install(options);

    if (_this.options.nonstandardIPD !== null) {
      CardboardVRDisplay.IPD = _this.options.nonstandardIPD;
    }
    if (_this.options.nonstandardNeckLength !== null) {
      CardboardVRDisplay.NECK_LENGTH = _this.options.nonstandardNeckLength;
    }
    if (_this.options.nonstandardNeckDepth !== null) {
      CardboardVRDisplay.NECK_DEPTH = _this.options.nonstandardNeckDepth;
    }

    _this.ready = navigator.getVRDisplays().then(function (displays) {
      _this.displays.push.apply(_this.displays, displays);
      _this.connect(0);
      return _this.displays;
    });
    return _this;
  }

  createClass(VR, [{
    key: "connect",
    value: function connect(selectedIndex) {
      this.currentDevice = null;
      this.currentDeviceIndex = selectedIndex;
      this.currentPose = null;
      if (0 <= selectedIndex && selectedIndex <= this.displays.length) {
        this.currentDevice = this.displays[selectedIndex];
        this.currentPose = this.currentDevice.getPose();
        this.isStereo = VR.isStereoDisplay(this.currentDevice);
      }
    }
  }, {
    key: "requestPresent",
    value: function requestPresent(opts) {
      if (!this.currentDevice) {
        return Promise.reject("No display");
      } else {
        var layers = opts,
            elem = opts[0].source;

        if (!(layers instanceof Array)) {
          layers = [layers];
        }

        // A hack to deal with a bug in the current build of Chromium
        if (this.isNativeMobileWebVR && this.isStereo) {
          layers = layers[0];
        }

        var promise = this.currentDevice.requestPresent(layers);
        if (isMobile || !isFirefox) {
          promise = promise.then(standardLockBehavior);
        }
        return promise;
      }
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var _this2 = this;

      var promise = null;
      if (this.isPresenting) {
        promise = this.currentDevice.exitPresent();
        this.currentDevice = null;
        this.currentDeviceIndex = -1;
        this.currentPose = null;
      } else {
        promise = Promise.resolve();
      }

      if (this.isNativeMobileWebVR) {
        promise = promise.then(Orientation.unlock);
      }

      return promise.then(PointerLock.exit).catch(function (exp) {
        return console.warn(exp);
      }).then(function () {
        return _this2.connect(0);
      });
    }
  }, {
    key: "zero",
    value: function zero() {
      get(VR.prototype.__proto__ || Object.getPrototypeOf(VR.prototype), "zero", this).call(this);
      if (this.currentDevice) {
        this.currentDevice.resetPose();
      }
    }
  }, {
    key: "update",
    value: function update(dt) {
      var x, z, stage;

      if (this.currentDevice) {
        this.currentPose = this.currentDevice.getPose();
        stage = this.currentDevice.stageParameters;
      } else {
        stage = null;
      }

      get(VR.prototype.__proto__ || Object.getPrototypeOf(VR.prototype), "update", this).call(this, dt);

      if (stage) {
        this.movePlayer.fromArray(stage.sittingToStandingTransform);
        x = stage.sizeX;
        z = stage.sizeZ;
      } else {
        this.movePlayer.makeTranslation(0, this.options.avatarHeight, 0);
        x = 0;
        z = 0;
      }

      var s = {
        matrix: this.movePlayer,
        sizeX: x,
        sizeZ: z
      };

      if (!this.stage || s.sizeX !== this.stage.sizeX || s.sizeZ !== this.stage.sizeZ) {
        this.stage = s;
      }
    }
  }, {
    key: "submitFrame",
    value: function submitFrame() {
      if (this.currentDevice) {
        this.currentDevice.submitFrame(this.currentPose);
      }
    }
  }, {
    key: "startAnimation",
    value: function startAnimation(callback) {
      if (this.currentDevice) {
        this.lastLastTimerDevice = this.lastTimerDevice;
        this.lastTimerDevice = this.timerDevice;
        this.timerDevice = this.currentDevice;
        this.timer = this.currentDevice.requestAnimationFrame(callback);
        return this.timer;
      }
    }
  }, {
    key: "cancelAnimation",
    value: function cancelAnimation() {
      if (this.timerDevice && this.timer) {
        this.timerDevice.cancelAnimationFrame(this.timer);
        this.timer = null;
      }
    }
  }, {
    key: "getTransforms",
    value: function getTransforms(near, far) {
      if (this.currentDevice) {
        if (!this._transformers[this.currentDeviceIndex]) {
          this._transformers[this.currentDeviceIndex] = new ViewCameraTransform(this.currentDevice);
        }
        this.currentDevice.depthNear = near;
        this.currentDevice.depthFar = far;
        return this._transformers[this.currentDeviceIndex].getTransforms(near, far);
      }
    }
  }, {
    key: "isNativeMobileWebVR",
    get: function get$$1() {
      return this.isNativeWebVR && isChrome && isMobile;
    }
  }, {
    key: "isNativeWebVR",
    get: function get$$1() {
      return this.currentDevice && !this.currentDevice.isPolyfilled;
    }
  }, {
    key: "hasStage",
    get: function get$$1() {
      return this.stage && this.stage.sizeX * this.stage.sizeZ > 0;
    }
  }, {
    key: "canMirror",
    get: function get$$1() {
      return this.currentDevice && this.currentDevice.capabilities.hasExternalDisplay;
    }
  }, {
    key: "isPolyfilled",
    get: function get$$1() {
      return this.currentDevice && this.currentDevice.isPolyfilled;
    }
  }, {
    key: "isPresenting",
    get: function get$$1() {
      return this.currentDevice && this.currentDevice.isPresenting;
    }
  }, {
    key: "hasOrientation",
    get: function get$$1() {
      return this.currentDevice && this.currentDevice.capabilities.hasOrientation;
    }
  }, {
    key: "currentCanvas",
    get: function get$$1() {
      if (this.isPresenting) {
        var layers = this.currentDevice.getLayers();
        if (layers.length > 0) {
          return layers[0].source;
        }
      }
      return null;
    }
  }]);
  return VR;
}(PoseInputProcessor);

var ViewCameraTransform = function () {
  createClass(ViewCameraTransform, null, [{
    key: "makeTransform",
    value: function makeTransform(eye, near, far) {
      return {
        translation: new Vector3().fromArray(eye.offset),
        projection: ViewCameraTransform.fieldOfViewToProjectionMatrix(eye.fieldOfView, near, far),
        viewport: {
          left: 0,
          top: 0,
          width: eye.renderWidth,
          height: eye.renderHeight
        }
      };
    }
  }, {
    key: "fieldOfViewToProjectionMatrix",
    value: function fieldOfViewToProjectionMatrix(fov, zNear, zFar) {
      var upTan = Math.tan(fov.upDegrees * Math.PI / 180.0),
          downTan = Math.tan(fov.downDegrees * Math.PI / 180.0),
          leftTan = Math.tan(fov.leftDegrees * Math.PI / 180.0),
          rightTan = Math.tan(fov.rightDegrees * Math.PI / 180.0),
          xScale = 2.0 / (leftTan + rightTan),
          yScale = 2.0 / (upTan + downTan),
          matrix = new Matrix4();

      matrix.elements[0] = xScale;
      matrix.elements[1] = 0.0;
      matrix.elements[2] = 0.0;
      matrix.elements[3] = 0.0;
      matrix.elements[4] = 0.0;
      matrix.elements[5] = yScale;
      matrix.elements[6] = 0.0;
      matrix.elements[7] = 0.0;
      matrix.elements[8] = -((leftTan - rightTan) * xScale * 0.5);
      matrix.elements[9] = (upTan - downTan) * yScale * 0.5;
      matrix.elements[10] = -(zNear + zFar) / (zFar - zNear);
      matrix.elements[11] = -1.0;
      matrix.elements[12] = 0.0;
      matrix.elements[13] = 0.0;
      matrix.elements[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
      matrix.elements[15] = 0.0;

      return matrix;
    }
  }]);

  function ViewCameraTransform(display) {
    classCallCheck(this, ViewCameraTransform);

    this.display = display;
  }

  createClass(ViewCameraTransform, [{
    key: "getTransforms",
    value: function getTransforms(near, far) {
      var l = this.display.getEyeParameters("left"),
          r = this.display.getEyeParameters("right"),
          params = [ViewCameraTransform.makeTransform(l, near, far)];
      if (r) {
        params.push(ViewCameraTransform.makeTransform(r, near, far));
      }
      for (var i = 1; i < params.length; ++i) {
        params[i].viewport.left = params[i - 1].viewport.left + params[i - 1].viewport.width;
      }
      return params;
    }
  }]);
  return ViewCameraTransform;
}();

function number(min, max, power) {
  power = power || 1;
  if (max === undefined) {
    max = min;
    min = 0;
  }
  var delta = max - min,
      n = Math.pow(Math.random(), power);
  return min + n * delta;
}

function int(min, max, power) {
  return Math.floor(number(min, max, power));
}

function color() {
  var r = int(0, 256),
      g = int(0, 256),
      b = int(0, 256);
  return r << 16 | g << 8 | b;
}

var RemoteUser = function (_EventDispatcher) {
  inherits(RemoteUser, _EventDispatcher);

  function RemoteUser(userName, modelFactory, nameMaterial, disableWebRTC, requestICEPath, microphone, localUserName, goSecond) {
    classCallCheck(this, RemoteUser);

    var _this = possibleConstructorReturn(this, (RemoteUser.__proto__ || Object.getPrototypeOf(RemoteUser)).call(this));

    _this.time = 0;

    _this.userName = userName;
    _this.peeringError = null;
    _this.peering = false;
    _this.peered = false;
    _this.stage = modelFactory.clone();
    _this.stage.traverse(function (obj) {
      if (obj.name === "AvatarBelt") {
        colored(obj, color());
      } else if (obj.name === "AvatarHead") {
        _this.head = obj;
      }
    });

    _this.nameObject = colored(text3D(0.1, userName), nameMaterial);
    var bounds = _this.nameObject.geometry.boundingBox.max;
    _this.nameObject.rotation.set(0, Math.PI, 0);
    _this.nameObject.position.set(bounds.x / 2, bounds.y, 0);
    _this.head.add(_this.nameObject);

    _this.dStageQuaternion = new Quaternion();
    _this.dHeadPosition = new Vector3();
    _this.dHeadQuaternion = new Quaternion();

    _this.lastStageQuaternion = new Quaternion();
    _this.lastHeadPosition = new Vector3();
    _this.lastHeadQuaternion = new Quaternion();

    _this.headPosition = {
      arr1: [],
      arr2: [],
      last: _this.lastHeadPosition,
      delta: _this.dHeadPosition,
      curr: _this.head.position
    };
    _this.headQuaternion = {
      arr1: [],
      arr2: [],
      last: _this.lastHeadQuaternion,
      delta: _this.dHeadQuaternion,
      curr: _this.head.quaternion
    };

    _this.audioChannel = null;
    _this.audioElement = null;
    _this.audioStream = null;
    _this.gain = null;
    _this.panner = null;
    _this.analyzer = null;
    return _this;
  }

  createClass(RemoteUser, [{
    key: "setAudio",
    value: function setAudio(audio, audioSource) {
      if (audioSource instanceof Element) {
        this.audioElement = audioSource;
        Audio3D.setAudioProperties(this.audioElement);
        this.audioStream = audio.context.createMediaElementSource(this.audioElement);
      } else {
        this.audioElement = Audio3D.setAudioStream(audioSource, "audio" + this.userName);
        this.audioStream = audio.context.createMediaStreamSource(audioSource);
      }
      this.gain = audio.context.createGain();
      this.panner = audio.context.createPanner();

      this.audioStream.connect(this.gain);
      this.gain.connect(this.panner);
      this.panner.connect(audio.mainVolume);
      this.panner.coneInnerAngle = 180;
      this.panner.coneOuterAngle = 360;
      this.panner.coneOuterGain = 0.1;
      this.panner.panningModel = "HRTF";
      this.panner.distanceModel = "exponential";
    }
  }, {
    key: "unpeer",
    value: function unpeer() {
      if (this.audioChannel) {
        this.audioChannel.close();
        if (this.audioElement) {
          document.body.removeChild(this.audioElement);
          if (this.panner) {
            this.panner.disconnect();
            this.gain.disconnect();
            this.audioStream.disconnect();
          }
        }
      }
    }
  }, {
    key: "_updateV",
    value: function _updateV(v, dt, fade) {
      v.curr.toArray(v.arr1);
      v.delta.toArray(v.arr2);
      for (var i = 0; i < v.arr1.length; ++i) {
        if (fade) {
          v.arr2[i] *= RemoteUser.FADE_FACTOR;
        }
        v.arr1[i] += v.arr2[i] * dt;
      }

      v.curr.fromArray(v.arr1);
      v.delta.fromArray(v.arr2);
    }
  }, {
    key: "_predict",
    value: function _predict(v, state, off) {
      v.delta.fromArray(state, off);
      v.delta.toArray(v.arr1);
      v.curr.toArray(v.arr2);
      for (var i = 0; i < v.arr1.length; ++i) {
        v.arr1[i] = (v.arr1[i] - v.arr2[i]) * RemoteUser.NETWORK_DT_INV;
      }
      v.delta.fromArray(v.arr1);
    }
  }, {
    key: "update",
    value: function update(dt) {
      this.time += dt;
      var fade = this.time >= RemoteUser.NETWORK_DT;
      this._updateV(this.headPosition, dt, fade);
      this._updateV(this.headQuaternion, dt, fade);
      this.stage.rotation.setFromQuaternion(this.headQuaternion.curr);
      this.stage.rotation.x = 0;
      this.stage.rotation.z = 0;
      this.stage.position.copy(this.headPosition.curr);
      this.stage.position.y = 0;
      if (this.panner) {
        this.panner.setPosition(this.stage.position.x, this.stage.position.y, this.stage.position.z);
        this.panner.setOrientation(Math.sin(this.stage.rotation.y), 0, Math.cos(this.stage.rotation.y));
      }
    }
  }, {
    key: "setState",
    value: function setState(v) {
      this.time = 0;
      this._predict(this.headPosition, v, 1);
      this._predict(this.headQuaternion, v, 4);
    }
  }, {
    key: "toString",
    value: function toString(digits) {
      return this.stage.position.curr.toString(digits) + " " + this.headPosition.curr.toString(digits);
    }
  }]);
  return RemoteUser;
}(EventDispatcher);

RemoteUser.FADE_FACTOR = 0.5;
RemoteUser.NETWORK_DT = 0.10;
RemoteUser.NETWORK_DT_INV = 1 / RemoteUser.NETWORK_DT;

var Manager = function (_EventDispatcher) {
  inherits(Manager, _EventDispatcher);

  function Manager(localUser, audio, factories, options) {
    classCallCheck(this, Manager);

    var _this = possibleConstructorReturn(this, (Manager.__proto__ || Object.getPrototypeOf(Manager)).call(this));

    _this.localUser = localUser;
    _this.audio = audio;
    _this.factories = factories;
    _this.options = options;
    _this.lastNetworkUpdate = 0;
    _this.oldState = [];
    _this.users = {};
    _this.waitForLastUser = Promise.resolve();
    _this._socket = null;
    _this.userName = null;
    _this.microphone = null;
    _this.audioHeap = {};
    return _this;
  }

  createClass(Manager, [{
    key: "update",
    value: function update(dt) {
      if (this._socket && this.deviceIndex === 0) {
        this.lastNetworkUpdate += dt;
        if (this.lastNetworkUpdate >= RemoteUser.NETWORK_DT) {
          this.lastNetworkUpdate -= RemoteUser.NETWORK_DT;
          for (var i = 0; i < this.localUser.newState.length; ++i) {
            if (this.oldState[i] !== this.localUser.newState[i]) {
              this._socket.emit("userState", this.localUser.newState);
              this.oldState = this.localUser.newState;
              break;
            }
          }
        }
      }
      for (var key in this.users) {
        var user = this.users[key];
        user.update(dt);
        if (this.audioHeap[key]) {
          user.setAudio(this.audio, this.audioHeap[key]);
          delete this.audioHeap[key];
        }
      }
    }
  }, {
    key: "updateUser",
    value: function updateUser(state) {
      var key = state[0];
      if (key !== this.userName) {
        var user = this.users[key];
        if (user) {
          user.setState(state);
        }
      } else if (this.deviceIndex > 0) {
        this.localUser.stage.position.fromArray(state, 1);
        this.localUser.stage.quaternion.fromArray(state, 4);
        this.localUser.head.position.fromArray(state, 8);
        this.localUser.head.quaternion.fromArray(state, 11);
      }
    }
  }, {
    key: "connect",
    value: function connect(socket, userName) {
      this.userName = userName.toLocaleUpperCase();
      if (!this.microphone) {
        this.microphone = navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false
        }).catch(console.warn.bind(console, "Can't get audio"));
      }
      if (!this._socket) {
        this._socket = socket;
        this._socket.on("userList", this.listUsers.bind(this));
        this._socket.on("userJoin", this.addUser.bind(this));
        this._socket.on("deviceAdded", this.addDevice.bind(this));
        this._socket.on("deviceIndex", this.setDeviceIndex.bind(this));
        this._socket.on("chat", this.receiveChat.bind(this));
        this._socket.on("userState", this.updateUser.bind(this));
        this._socket.on("userLeft", this.removeUser.bind(this));
        this._socket.on("connection_lost", this.lostConnection.bind(this));
        this._socket.emit("listUsers");
        this._socket.emit("getDeviceIndex");
      }
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      this.userName = null;
      this._socket.close();
      this._socket = null;
    }
  }, {
    key: "addUser",
    value: function addUser(state, goSecond) {
      console.log("User %s logging on.", state[0]);
      var toUserName = state[0],
          user = new RemoteUser(toUserName, this.factories.avatar, this.options.foregroundColor, this.options.disableWebRTC, this.options.webRTC, this.microphone, this.userName, goSecond);
      this.users[toUserName] = user;
      this.updateUser(state);
      this.emit("addavatar", user);
    }
  }, {
    key: "removeUser",
    value: function removeUser(key) {
      console.log("User %s logging off.", key);
      var user = this.users[key];
      if (user) {
        if (user.peered) {
          user.unpeer();
        }
        delete this.users[key];
        this.emit("removeavatar", user);
      }
    }
  }, {
    key: "listUsers",
    value: function listUsers(newUsers) {
      Object.keys(this.users).forEach(this.removeUser.bind(this));
      while (newUsers.length > 0) {
        this.addUser(newUsers.shift(), true);
      }
      this.emit("authorizationsucceeded");
    }
  }, {
    key: "receiveChat",
    value: function receiveChat(evt) {
      console.log("chat", evt);
    }
  }, {
    key: "lostConnection",
    value: function lostConnection() {
      this.deviceIndex = null;
    }
  }, {
    key: "addDevice",
    value: function addDevice(index) {
      console.log("addDevice", index);
    }
  }, {
    key: "setDeviceIndex",
    value: function setDeviceIndex(index) {
      this.deviceIndex = index;
    }
  }, {
    key: "setAudioFromUser",
    value: function setAudioFromUser(userName, audioElement) {
      this.audioHeap[userName] = audioElement;
    }
  }]);
  return Manager;
}(EventDispatcher);

var PlainText = new Grammar("PlainText", [["newlines", /(?:\r\n|\r|\n)/]]);

var DIFF = new Vector3();
var MAX_MOVE_DISTANCE = 5;
var MAX_MOVE_DISTANCE_SQ = MAX_MOVE_DISTANCE * MAX_MOVE_DISTANCE;
var MAX_TELEPORT_WAGGLE = 0.5;
var TELEPORT_PAD_RADIUS = 0.4;
var TELEPORT_COOLDOWN = 250;

var Teleporter = function () {
  function Teleporter(env) {
    var _this = this;

    classCallCheck(this, Teleporter);


    this.enabled = true;
    this._environment = env;

    this._startPoint = new Vector3();
    this._moveDistance = 0;

    this._start = this._start.bind(this);
    this._exit = this._exit.bind(this);
    this._move = this._move.bind(this);
    this._end = this._end.bind(this);

    env.ground.on("exit", this._exit).on("gazecancel", this._exit).on("gazecomplete", this._exit).on("pointerend", this._exit).on("pointerstart", this._start).on("gazestart", this._start).on("pointermove", this._move).on("gazemove", this._move).on("select", this._end);

    this.disk = sphere(TELEPORT_PAD_RADIUS, 128, 3).colored(0xff0000, {
      unshaded: true
    }).named("disk").addTo(env.scene);

    this.disk.geometry.computeBoundingBox();
    this.disk.geometry.vertices.forEach(function (v) {
      v.y = 0.1 * (v.y - _this.disk.geometry.boundingBox.min.y);
    });
    this.disk.geometry.computeBoundingBox();

    this.disk.visible = false;
  }

  createClass(Teleporter, [{
    key: "_exit",
    value: function _exit(evt) {
      this.disk.visible = false;
    }
  }, {
    key: "_start",
    value: function _start(evt) {
      if (this.enabled) {
        this._updatePosition(evt);
        this.disk.visible = true;
        this._moveDistance = 0;
      }
    }
  }, {
    key: "_move",
    value: function _move(evt) {
      if (this.enabled) {
        this._updatePosition(evt);
        this.disk.visible = this._moveDistance < MAX_TELEPORT_WAGGLE;
      }
    }
  }, {
    key: "_end",
    value: function _end(evt) {
      if (this.enabled) {
        this._updatePosition(evt);
        if (this._moveDistance < MAX_TELEPORT_WAGGLE) {
          this._environment.teleport(this.disk.position);
        }
      }
    }
  }, {
    key: "_updatePosition",
    value: function _updatePosition(evt) {
      this._startPoint.copy(this.disk.position);
      this.disk.position.copy(evt.hit.point).sub(this._environment.head.position);

      var distSq = this.disk.position.x * this.disk.position.x + this.disk.position.z * this.disk.position.z;
      if (distSq > MAX_MOVE_DISTANCE_SQ) {
        var dist = Math.sqrt(distSq),
            factor = MAX_MOVE_DISTANCE / dist,
            y = this.disk.position.y;
        this.disk.position.y = 0;
        this.disk.position.multiplyScalar(factor);
        this.disk.position.y = y;
      }

      this.disk.position.add(this._environment.head.position);

      var len = DIFF.copy(this.disk.position).sub(this._startPoint).length();
      this._moveDistance += len;
    }
  }]);
  return Teleporter;
}();

var PIXEL_SCALES = [0.5, 0.25, 0.333333, 0.5, 1];

var SKINS = [0xFFDFC4, 0xF0D5BE, 0xEECEB3, 0xE1B899, 0xE5C298, 0xFFDCB2, 0xE5B887, 0xE5A073, 0xE79E6D, 0xDB9065, 0xCE967C, 0xC67856, 0xBA6C49, 0xA57257, 0xF0C8C9, 0xDDA8A0, 0xB97C6D, 0xA8756C, 0xAD6452, 0x5C3836, 0xCB8442, 0xBD723C, 0x704139, 0xA3866A, 0x870400, 0x710101, 0x430000, 0x5B0001, 0x302E2E];

var SYS_FONTS = "-apple-system, '.SFNSText-Regular', 'San Francisco', 'Roboto', 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif";

var Quality = {
  NONE: 0,
  VERYLOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  MAXIMUM: PIXEL_SCALES.length - 1
};

var NAMES = ["Dahlia", "Zinnia", "Camellia", "Ren", "Lotus", "Azalea", "Kunal", "Saffron", "Jessamine", "Basil", "Indigo", "Violet", "Iris", "Holly", "Yarrow", "Hazel", "Cypress", "Amaranth", "Aster", "Emerald", "Ash", "Boxwood", "Birchwood", "Ebony", "Forsythia", "Hawthorn", "Hemlock", "Locust", "Juniper", "Linden", "Magnolia", "Laurel", "Oak", "Alder", "Sycamore", "Blackhaw"];

var Constants = {
  PIXEL_SCALES: PIXEL_SCALES,
  SKINS: SKINS,
  SYS_FONTS: SYS_FONTS,
  NAMES: NAMES,
  Quality: Quality
};

/// NOTE: maybe BrowserEnvironment should be a subclass of THREE.Scene.


console.info("[" + packageName + " v" + version + "]:> see " + homepage + " for more information.");

var MILLISECONDS_TO_SECONDS = 0.001;
var TELEPORT_DISPLACEMENT = new Vector3();
var DISPLACEMENT = new Vector3();
var EULER_TEMP = new Euler();
var QUAT_TEMP = new Quaternion();
var WEDGE = Math.PI / 3;

var BrowserEnvironment = function (_EventDispatcher) {
  inherits(BrowserEnvironment, _EventDispatcher);

  function BrowserEnvironment(options) {
    classCallCheck(this, BrowserEnvironment);

    var _this = possibleConstructorReturn(this, (BrowserEnvironment.__proto__ || Object.getPrototypeOf(BrowserEnvironment)).call(this));

    _this.options = Object.assign({}, BrowserEnvironment.DEFAULTS, options);

    _this.options.foregroundColor = _this.options.foregroundColor || complementColor(new Color(_this.options.backgroundColor)).getHex();

    _this.deltaTime = 1;

    _this.network = null;

    if (_this.options.nonstandardIPD !== null) {
      _this.options.nonstandardIPD *= 0.5;
    }

    _this.audioQueue = [];

    _this.zero = function () {
      if (!_this.lockMovement) {
        for (var i = 0; i < _this.managers.length; ++i) {
          _this.managers[i].zero();
        }
        if (_this.quality === Quality.NONE) {
          _this.quality = Quality.HIGH;
        }
      }
    };

    var missedFrames = 0;
    var update = function update(dt) {
      dt *= MILLISECONDS_TO_SECONDS;
      if (dt > 0) {
        var fps = Math.round(1 / dt);
        dt = 1 / fps;
        _this.deltaTime = Math.min(_this.deltaTime, dt);

        // if we missed way too many frames in one go, just update once, otherwise we'll end up locking up the system.
        var numFrames = dt / _this.deltaTime;
        if (numFrames > 1) {
          missedFrames += numFrames;
          if (numFrames > 10) {
            numFrames = 1;
          }
        } else if (missedFrames > 0) {
          missedFrames -= 0.1;
        }

        if (missedFrames >= 10) {
          _this.deltaTime = dt;
          missedFrames = 0;
        }

        updateFade(dt);

        for (var frame = 0; frame < numFrames; ++frame) {
          var hadGamepad = _this.hasGamepad;
          if (_this.gamepadMgr) {
            _this.gamepadMgr.poll();
          }
          for (var i = 0; i < _this.managers.length; ++i) {
            _this.managers[i].update(dt);
          }

          if (!hadGamepad && _this.hasGamepad) {
            _this.Mouse.inPhysicalUse = false;
          }

          _this.head.showPointer = _this.VR.hasOrientation && _this.options.showHeadPointer;
          _this.mousePointer.visible = _this.VR.isPresenting;
          _this.mousePointer.showPointer = !_this.hasMotionControllers;

          var heading = 0,
              pitch = 0,
              strafe = 0,
              drive = 0;
          for (var _i = 0; _i < _this.managers.length; ++_i) {
            var mgr = _this.managers[_i];
            if (mgr.enabled) {
              if (mgr.name !== "Mouse") {
                heading += mgr.getValue("heading");
              }
              pitch += mgr.getValue("pitch");
              strafe += mgr.getValue("strafe");
              drive += mgr.getValue("drive");
            }
          }

          if (_this.hasMouse || _this.hasTouch) {
            var mouseHeading = null;
            if (_this.VR.hasOrientation) {
              mouseHeading = _this.mousePointer.rotation.y;
              var newMouseHeading = WEDGE * Math.floor(mouseHeading / WEDGE + 0.5);
              if (newMouseHeading !== 0) {
                _this.Mouse.commands.U.offset -= _this.Mouse.getValue("U") - 1;
              }
              mouseHeading = newMouseHeading + _this.Mouse.commands.U.offset * 2;
            } else {
              mouseHeading = _this.Mouse.getValue("heading");
            }
            heading += mouseHeading;
          }
          if (_this.VR.hasOrientation) {
            pitch = 0;
          }

          // move stage according to heading and thrust
          EULER_TEMP.set(pitch, heading, 0, "YXZ");
          _this.stage.quaternion.setFromEuler(EULER_TEMP);

          // update the stage's velocity
          _this.velocity.set(strafe, 0, drive);

          QUAT_TEMP.copy(_this.head.quaternion);
          EULER_TEMP.setFromQuaternion(QUAT_TEMP);
          EULER_TEMP.x = 0;
          EULER_TEMP.z = 0;
          QUAT_TEMP.setFromEuler(EULER_TEMP);

          _this.moveStage(DISPLACEMENT.copy(_this.velocity).multiplyScalar(dt).applyQuaternion(QUAT_TEMP).add(_this.head.position));

          _this.stage.position.y = _this.ground.getHeightAt(_this.stage.position) || 0;
          _this.stage.position.y += _this.options.avatarHeight;
          for (var _i2 = 0; _i2 < _this.motionDevices.length; ++_i2) {
            _this.motionDevices[_i2].posePosition.y -= _this.options.avatarHeight;
          }

          // update the motionDevices
          _this.stage.updateMatrix();
          _this.matrix.multiplyMatrices(_this.stage.matrix, _this.VR.stage.matrix);
          for (var _i3 = 0; _i3 < _this.motionDevices.length; ++_i3) {
            _this.motionDevices[_i3].updateStage(_this.matrix);
          }

          for (var _i4 = 0; _i4 < _this.pointers.length; ++_i4) {
            _this.pointers[_i4].update();
          }

          // record the position and orientation of the user
          _this.newState = [];
          _this.head.updateMatrix();
          _this.stage.rotation.x = 0;
          _this.stage.rotation.z = 0;
          _this.stage.quaternion.setFromEuler(_this.stage.rotation);
          _this.stage.updateMatrix();
          _this.head.position.toArray(_this.newState, 0);
          _this.head.quaternion.toArray(_this.newState, 3);

          if (frame === 0) {
            updateAll();
            var userActionHandlers = null;
            for (var _i5 = 0; _i5 < _this.pointers.length; ++_i5) {
              userActionHandlers = _this.pointers[_i5].resolvePicking(_this.scene);
            }
            for (var _i6 = 0; _i6 < _this.managers.length; ++_i6) {
              _this.managers[_i6].userActionHandlers = userActionHandlers;
            }
            _this.ground.moveTo(_this.head.position);
            _this.sky.position.copy(_this.head.position);
            moveUI();
          }

          try {
            _this.emit("update");
          } catch (exp) {
            // don't let user script kill the runtime
            console.error("User update errored", exp);
          }

          if (frame === 0 && _this.network) {
            _this.network.update(dt);
          }
        }
      }
    };

    _this.turns = new Angle(0);
    var followEuler = new Euler(),
        maxX = -Math.PI / 4,
        maxY = Math.PI / 6;

    var moveUI = function moveUI(dt) {
      var y = _this.vicinity.position.y,
          p = _this.options.vicinityFollowRate,
          q = 1 - p;
      _this.vicinity.position.lerp(_this.head.position, p);
      _this.vicinity.position.y = y;

      followEuler.setFromQuaternion(_this.head.quaternion);
      _this.turns.radians = followEuler.y;
      followEuler.set(maxX, _this.turns.radians, 0, "YXZ");
      _this.ui.quaternion.setFromEuler(followEuler);
      _this.ui.position.y = _this.ui.position.y * q + _this.head.position.y * p;
    };

    var animate = function animate(t) {
      var dt = t - lt,
          i,
          j;
      lt = t;
      update(dt);
      render();
      RAF(animate);
    };

    var render = function render() {
      _this.camera.position.set(0, 0, 0);
      _this.camera.quaternion.set(0, 0, 0, 1);
      _this.audio.setPlayer(_this.head.mesh);
      _this.renderer.clear(true, true, true);

      var trans = _this.VR.getTransforms(_this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);
      for (var i = 0; trans && i < trans.length; ++i) {
        eyeBlankAll(i);

        var st = trans[i],
            v = st.viewport;

        _this.renderer.setViewport(v.left * resolutionScale, v.top * resolutionScale, v.width * resolutionScale, v.height * resolutionScale);

        _this.camera.projectionMatrix.copy(st.projection);
        if (_this.mousePointer.unproject) {
          _this.mousePointer.unproject.getInverse(st.projection);
        }
        _this.camera.translateOnAxis(st.translation, 1);
        _this.renderer.render(_this.scene, _this.camera);
        _this.camera.translateOnAxis(st.translation, -1);
      }
      _this.VR.submitFrame();
    };

    var modifyScreen = function modifyScreen() {
      var near = _this.options.nearPlane,
          far = near + _this.options.drawDistance,
          p = _this.VR && _this.VR.getTransforms(near, far);

      if (p) {
        var canvasWidth = 0,
            canvasHeight = 0;

        for (var i = 0; i < p.length; ++i) {
          canvasWidth += p[i].viewport.width;
          canvasHeight = Math.max(canvasHeight, p[i].viewport.height);
        }

        _this.mousePointer.setSize(canvasWidth, canvasHeight);

        canvasWidth = Math.floor(canvasWidth * resolutionScale);
        canvasHeight = Math.floor(canvasHeight * resolutionScale);

        _this.renderer.domElement.width = canvasWidth;
        _this.renderer.domElement.height = canvasHeight;
        if (!_this.timer) {
          render();
        }
      }
    };

    //
    // Initialize local variables
    //

    var lt = 0,
        currentHeading = 0,
        qPitch = new Quaternion(),
        vEye = new Vector3(),
        vBody = new Vector3(),
        modelFiles = {
      scene: _this.options.sceneModel,
      avatar: _this.options.avatarModel,
      button: _this.options.button && typeof _this.options.button.model === "string" && _this.options.button.model,
      font: _this.options.font
    },
        resolutionScale = 1;

    _this.factories = {
      avatar: null
    };

    function complementColor(color) {
      var rgb = color.clone();
      var hsl = rgb.getHSL();
      hsl.h = hsl.h + 0.5;
      hsl.l = 1 - hsl.l;
      while (hsl.h > 1) {
        hsl.h -= 1;
      }rgb.setHSL(hsl.h, hsl.s, hsl.l);
      return rgb;
    }

    var modelsReady = ModelFactory.loadObjects(modelFiles, _this.options.progress.thunk).then(function (models) {
      window.text3D = function (font, size, text) {
        var geom = new TextGeometry(text, {
          font: font,
          size: size,
          height: size / 5,
          curveSegments: 2
        });
        geom.computeBoundingSphere();
        geom.computeBoundingBox();
        return geom;
      }.bind(window, models.font);

      if (models.scene) {
        buildScene(models.scene);
      }

      if (models.avatar) {
        _this.factories.avatar = new ModelFactory(models.avatar);
      }

      if (models.button) {
        _this.buttonFactory = new ButtonFactory(models.button, _this.options.button.options);
      }
    }).catch(function (err) {
      return console.error(err);
    }).then(function () {
      return _this.buttonFactory = _this.buttonFactory || ButtonFactory.DEFAULT;
    });

    //
    // Initialize public properties
    //

    _this.speech = new Speech(_this.options.speech);

    _this.audio = new Audio3D();

    if (_this.options.ambientSound) {
      _this.audio.load3DSound(_this.options.ambientSound, true, -1, 1, -1).then(function (aud) {
        if (!(aud.source instanceof MediaElementAudioSourceNode)) {
          aud.volume.gain.value = 0.1;
          aud.source.start();
        }
      }).catch(console.error.bind(console, "Audio3D loadSource"));
    }

    var documentReady = null;
    if (document.readyState === "complete") {
      documentReady = Promise.resolve("already");
    } else {
      documentReady = new Promise(function (resolve, reject) {
        document.addEventListener("readystatechange", function (evt) {
          if (document.readyState === "complete") {
            resolve("had to wait for it");
          }
        }, false);
      });
    }

    _this.music = new Music(_this.audio);

    _this.currentControl = null;

    var fadeOutPromise = null,
        _fadeOutPromiseResolver = null,
        fadeInPromise = null,
        _fadeInPromiseResolver = null;
    _this.fadeOut = function () {
      if (fadeInPromise) {
        return Promise.reject("Currently fading in.");
      }
      if (!fadeOutPromise) {
        _this.fader.visible = true;
        _this.fader.material.opacity = 0;
        _this.fader.material.needsUpdate = true;
        fadeOutPromise = new Promise(function (resolve, reject) {
          return _fadeOutPromiseResolver = function fadeOutPromiseResolver(obj) {
            fadeOutPromise = null;
            _fadeOutPromiseResolver = null;
            resolve(obj);
          };
        });
      }
      return fadeOutPromise;
    };

    _this.fadeIn = function () {
      if (fadeOutPromise) {
        return Promise.reject("Currently fading out.");
      }
      if (!fadeInPromise) {
        fadeInPromise = new Promise(function (resolve, reject) {
          return _fadeInPromiseResolver = function fadeInPromiseResolver(obj) {
            fadeInPromise = null;
            _fadeInPromiseResolver = null;
            _this.fader.visible = false;
            resolve(obj);
          };
        });
      }
      return fadeInPromise;
    };

    var updateFade = function updateFade(dt) {
      if (fadeOutPromise || fadeInPromise) {
        var m = _this.fader.material,
            f = _this.options.fadeRate * dt;
        m.needsUpdate = true;
        if (fadeOutPromise) {
          m.opacity += f;
          if (1 <= m.opacity) {
            m.opacity = 1;
            _fadeOutPromiseResolver();
          }
        } else {
          m.opacity -= f;
          if (m.opacity <= 0) {
            m.opacity = 0;
            _fadeInPromiseResolver();
          }
        }
      }
    };

    _this.teleportAvailable = true;

    _this.transition = function (thunk, check, immediate) {
      if (immediate) {
        thunk();
        return Promise.resolve();
      } else if (!check || check()) {
        return _this.fadeOut().then(thunk).then(_this.fadeIn).catch(console.warn.bind(console, "Error transitioning"));
      }
    };

    _this.teleport = function (pos, immediate) {
      return _this.transition(function () {
        return _this.moveStage(pos);
      }, function () {
        return _this.teleportAvailable && TELEPORT_DISPLACEMENT.copy(pos).sub(_this.head.position).length() > 0.2;
      }, immediate);
    };

    var delesectControl = function delesectControl() {
      if (_this.currentControl) {
        _this.currentControl.removeEventListener("blur", delesectControl);
        _this.Keyboard.enabled = true;
        _this.Mouse.commands.pitch.disabled = _this.Mouse.commands.heading.disabled = _this.VR.isPresenting;
        _this.currentControl.blur();
        _this.currentControl = null;
      }
    };

    _this.consumeEvent = function (evt) {
      var obj = evt.hit && evt.hit.object,
          cancel = evt.type === "exit" || evt.cmdName === "NORMAL_ESCAPE";

      if (evt.type === "select" || cancel) {

        if (obj !== _this.currentControl || cancel) {

          delesectControl();

          if (!cancel && obj.isSurface) {
            _this.currentControl = obj;
            _this.currentControl.focus();
            _this.currentControl.addEventListener("blur", delesectControl);
            if (_this.currentControl.lockMovement) {
              _this.Keyboard.enabled = false;
              _this.Mouse.commands.pitch.disabled = _this.Mouse.commands.heading.disabled = !_this.VR.isPresenting;
            }
          }
        }
      }

      if (obj) {
        obj.dispatchEvent(evt);
      } else if (_this.currentControl) {
        _this.currentControl.dispatchEvent(evt);
      }

      _this.dispatchEvent(evt);
    };

    _this.options.scene = _this.scene = _this.options.scene || new Scene();

    if (_this.options.useFog) {
      _this.scene.fog = new FogExp2(_this.options.backgroundColor, 1 / Math.sqrt(_this.options.drawDistance));
    }

    _this.camera = new PerspectiveCamera(75, 1, _this.options.nearPlane, _this.options.nearPlane + _this.options.drawDistance);

    _this.sky = new Sky(_this.options).addTo(_this.scene);

    _this.ground = new Ground(_this.options).addTo(_this.scene);

    _this.teleporter = new Teleporter(_this);

    _this.vicinity = hub().named("Vicinity").addTo(_this.scene);
    _this.ui = hub().named("UI").addTo(_this.vicinity);

    var buildScene = function buildScene(sceneGraph) {
      sceneGraph.buttons = [];
      sceneGraph.traverse(function (child) {
        if (child.isButton) {
          sceneGraph.buttons.push(new Button3D(child.parent, child.name));
        }
        if (child.name) {
          sceneGraph[child.name] = child;
        }
      });
      _this.scene.add.apply(_this.scene, sceneGraph.children);
      _this.scene.traverse(function (obj) {
        if (_this.options.disableDefaultLighting && obj.material) {
          if (obj.material.map) {
            textured(obj, obj.material.map, {
              unshaded: true
            });
          } else {
            colored(obj, obj.material.color.getHex(), {
              unshaded: true
            });
          }
        }
        if (obj.name) {
          _this.scene[obj.name] = obj;
        }
      });
      if (sceneGraph.Camera) {
        _this.camera.position.copy(sceneGraph.Camera.position);
        _this.camera.quaternion.copy(sceneGraph.Camera.quaternion);
      }
      return sceneGraph;
    };

    var currentTimerObject = null;
    _this.timer = 0;
    var RAF = function RAF(callback) {
      currentTimerObject = _this.VR.currentDevice || window;
      if (_this.timer !== null) {
        _this.timer = currentTimerObject.requestAnimationFrame(callback);
      }
    };

    _this.goFullScreen = function (index, evt) {
      if (evt !== "Gaze") {
        var elem = null;
        if (evt === "force" || _this.VR.canMirror || _this.VR.isNativeWebVR) {
          elem = _this.renderer.domElement;
        } else {
          elem = _this.options.fullScreenElement;
        }
        _this.VR.connect(index);
        return _this.VR.requestPresent([{
          source: elem
        }]).catch(function (exp) {
          return console.error("whaaat", exp);
        }).then(function () {
          return elem.focus();
        });
      }
    };

    _this.addAvatar = function (user) {
      console.log(user);
      _this.scene.add(user.stage);
      _this.scene.add(user.head);
    };

    _this.removeAvatar = function (user) {
      _this.scene.remove(user.stage);
      _this.scene.remove(user.head);
    };

    PointerLock.addChangeListener(function (evt) {
      if (_this.VR.isPresenting && !PointerLock.isActive) {
        _this.cancelVR();
      }
    });

    var fullScreenChange = function fullScreenChange(evt) {
      var presenting = !!_this.VR.isPresenting,
          cmd = (presenting ? "remove" : "add") + "Button";
      _this.Mouse[cmd]("dx", 0);
      _this.Mouse[cmd]("dy", 0);
      _this.Mouse.commands.U.disabled = _this.Mouse.commands.V.disabled = presenting && !_this.VR.isStereo;
      _this.Mouse.commands.heading.scale = presenting ? -1 : 1;
      _this.Mouse.commands.pitch.scale = presenting ? -1 : 1;
      if (!presenting) {
        _this.cancelVR();
      }
      modifyScreen();
    };

    var allowRestart = true;
    _this.start = function () {
      if (allowRestart) {
        _this.ready.then(function () {
          _this.audio.start();
          lt = performance.now() * MILLISECONDS_TO_SECONDS;
          _this.VR.startAnimation(animate);
        });
      }
    };

    _this.stop = function (isPause) {
      if (_this.VR.timer) {
        allowRestart = allowRestart && isPause === true;
        _this.VR.stopAnimation();
        _this.audio.stop();
        if (!allowRestart) {
          console.log("stopped");
        }
      }
    };

    _this.pause = _this.stop.bind(_this, true);

    window.addEventListener("vrdisplaypresentchange", fullScreenChange, false);
    window.addEventListener("resize", modifyScreen, false);
    window.addEventListener("blur", _this.pause, false);
    window.addEventListener("stop", _this.stop, false);
    window.addEventListener("focus", _this.start, false);
    document.addEventListener("amazonPlatformReady", function () {
      document.addEventListener("pause", _this.pause, false);
      document.addEventListener("resume", _this.start, false);
    }, false);

    documentReady = documentReady.then(function () {
      if (_this.options.renderer) {
        _this.renderer = _this.options.renderer;
      } else {
        _this.renderer = new WebGLRenderer({
          canvas: cascadeElement(_this.options.canvasElement, "canvas", HTMLCanvasElement),
          context: _this.options.context,
          antialias: _this.options.antialias,
          alpha: true,
          logarithmicDepthBuffer: false
        });
        _this.renderer.autoClear = false;
        _this.renderer.sortObjects = true;
        _this.renderer.setClearColor(_this.options.backgroundColor);
        if (!_this.renderer.domElement.parentElement) {
          document.body.appendChild(_this.renderer.domElement);
        }
      }

      _this.options.fullScreenElement = document.querySelector(_this.options.fullScreenElement) || _this.renderer.domElement;
      var maxTabIndex = 0;
      var elementsWithTabIndex = document.querySelectorAll("[tabIndex]");
      for (var i = 0; i < elementsWithTabIndex.length; ++i) {
        maxTabIndex = Math.max(maxTabIndex, elementsWithTabIndex[i].tabIndex);
      }

      _this.renderer.domElement.tabIndex = maxTabIndex + 1;
      _this.renderer.domElement.addEventListener('webglcontextlost', _this.pause, false);
      _this.renderer.domElement.addEventListener('webglcontextrestored', _this.start, false);

      _this.managers = [];
      _this.newState = [];
      _this.pointers = [];
      _this.motionDevices = [];
      _this.velocity = new Vector3();
      _this.matrix = new Matrix4();

      if (!_this.options.disableKeyboard) {
        _this.addInputManager(new Keyboard(_this, {
          strafeLeft: {
            buttons: [-Keys.A, -Keys.LEFTARROW]
          },
          strafeRight: {
            buttons: [Keys.D, Keys.RIGHTARROW]
          },
          strafe: {
            commands: ["strafeLeft", "strafeRight"]
          },
          driveForward: {
            buttons: [-Keys.W, -Keys.UPARROW]
          },
          driveBack: {
            buttons: [Keys.S, Keys.DOWNARROW]
          },
          drive: {
            commands: ["driveForward", "driveBack"]
          },
          select: {
            buttons: [Keys.ENTER]
          },
          dSelect: {
            buttons: [Keys.ENTER],
            delta: true
          },
          zero: {
            buttons: [Keys.Z],
            metaKeys: [-Keys.CTRL, -Keys.ALT, -Keys.SHIFT, -Keys.META],
            commandUp: _this.emit.bind(_this, "zero")
          }
        }));

        _this.Keyboard.operatingSystem = _this.options.os;
        _this.Keyboard.codePage = _this.options.language;
      }

      _this.addInputManager(new Touch(_this.options.fullScreenElement, {
        U: { axes: ["X0"], min: 0, max: 2, offset: 0 },
        V: { axes: ["Y0"], min: 0, max: 2 },
        buttons: {
          axes: ["FINGERS"]
        },
        dButtons: {
          axes: ["FINGERS"],
          delta: true
        },
        heading: {
          axes: ["DX0"],
          integrate: true
        },
        pitch: {
          axes: ["DY0"],
          integrate: true,
          min: -Math.PI * 0.5,
          max: Math.PI * 0.5
        }
      }));

      _this.addInputManager(new Mouse(_this.options.fullScreenElement, {
        U: { axes: ["X"], min: 0, max: 2, offset: 0 },
        V: { axes: ["Y"], min: 0, max: 2 },
        buttons: {
          axes: ["BUTTONS"]
        },
        dButtons: {
          axes: ["BUTTONS"],
          delta: true
        },
        _dx: {
          axes: ["X"],
          delta: true,
          scale: 0.25
        },
        dx: {
          buttons: [0],
          commands: ["_dx"]
        },
        heading: {
          commands: ["dx"],
          integrate: true
        },
        _dy: {
          axes: ["Y"],
          delta: true,
          scale: 0.25
        },
        dy: {
          buttons: [0],
          commands: ["_dy"]
        },
        pitch: {
          commands: ["dy"],
          integrate: true,
          min: -Math.PI * 0.5,
          max: Math.PI * 0.5
        }
      }));

      // toggle back and forth between touch and mouse
      _this.Touch.addEventListener("activate", function (evt) {
        return _this.Mouse.inPhysicalUse = false;
      });
      _this.Mouse.addEventListener("activate", function (evt) {
        return _this.Touch.inPhysicalUse = false;
      });

      _this.addInputManager(new VR(_this.options));

      _this.motionDevices.push(_this.VR);

      if (!_this.options.disableGamepad && GamepadManager.isAvailable) {
        _this.gamepadMgr = new GamepadManager();
        _this.gamepadMgr.addEventListener("gamepadconnected", function (pad) {
          var padID = Gamepad.ID(pad);
          var mgr = null;

          if (padID !== "Unknown" && padID !== "Rift") {
            if (Gamepad.isMotionController(pad)) {
              var controllerNumber = 0;
              for (var _i7 = 0; _i7 < _this.managers.length; ++_i7) {
                mgr = _this.managers[_i7];
                if (mgr.currentPad && mgr.currentPad.id === pad.id) {
                  ++controllerNumber;
                }
              }

              mgr = new Gamepad(_this.gamepadMgr, pad, controllerNumber, {
                buttons: {
                  axes: ["BUTTONS"]
                },
                dButtons: {
                  axes: ["BUTTONS"],
                  delta: true
                },
                zero: {
                  buttons: [Gamepad.VIVE_BUTTONS.GRIP_PRESSED],
                  commandUp: _this.emit.bind(_this, "zero")
                }
              });

              _this.addInputManager(mgr);
              _this.motionDevices.push(mgr);

              var shift = (_this.motionDevices.length - 2) * 8,
                  color = 0x0000ff << shift,
                  highlight = 0xff0000 >> shift,
                  ptr = new Pointer(padID + "Pointer", color, 1, highlight, [mgr], null, _this.options);
              ptr.add(colored(box(0.1, 0.025, 0.2), color, {
                emissive: highlight
              }));

              ptr.route(Pointer.EVENTS, _this.consumeEvent.bind(_this));

              _this.pointers.push(ptr);
              _this.scene.add(ptr);

              _this.emit("motioncontrollerfound", mgr);
            } else {
              mgr = new Gamepad(_this.gamepadMgr, pad, 0, {
                buttons: {
                  axes: ["BUTTONS"]
                },
                dButtons: {
                  axes: ["BUTTONS"],
                  delta: true
                },
                strafe: {
                  axes: ["LSX"],
                  deadzone: 0.2
                },
                drive: {
                  axes: ["LSY"],
                  deadzone: 0.2
                },
                heading: {
                  axes: ["RSX"],
                  scale: -1,
                  deadzone: 0.2,
                  integrate: true
                },
                dHeading: {
                  commands: ["heading"],
                  delta: true
                },
                pitch: {
                  axes: ["RSY"],
                  scale: -1,
                  deadzone: 0.2,
                  integrate: true
                },
                zero: {
                  buttons: [Gamepad.XBOX_ONE_BUTTONS.BACK],
                  commandUp: _this.emit.bind(_this, "zero")
                }
              });
              _this.addInputManager(mgr);
              _this.mousePointer.addDevice(mgr, mgr);
            }
          }
        });

        _this.gamepadMgr.addEventListener("gamepaddisconnected", _this.removeInputManager.bind(_this));
      }

      _this.stage = hub();

      _this.head = new Pointer("GazePointer", 0xffff00, 0x0000ff, 0.8, [_this.VR], [_this.Mouse, _this.Touch, _this.Keyboard], _this.options).addTo(_this.scene);

      _this.head.route(Pointer.EVENTS, _this.consumeEvent.bind(_this));

      _this.head.rotation.order = "YXZ";
      _this.head.useGaze = _this.options.useGaze;
      _this.pointers.push(_this.head);

      _this.mousePointer = new Pointer("MousePointer", 0xff0000, 0x00ff00, 1, [_this.Mouse, _this.Touch], null, _this.options);
      _this.mousePointer.route(Pointer.EVENTS, _this.consumeEvent.bind(_this));
      _this.mousePointer.unproject = new Matrix4();
      _this.pointers.push(_this.mousePointer);
      _this.head.add(_this.mousePointer);

      _this.VR.ready.then(function (displays) {
        return displays.forEach(function (display, i) {
          window.addEventListener("vrdisplayactivate", function (evt) {
            if (evt.display === display) {
              var exitVR = function exitVR() {
                window.removeEventListener("vrdisplaydeactivate", exitVR);
                _this.cancelVR();
              };
              window.addEventListener("vrdisplaydeactivate", exitVR, false);
              _this.goFullScreen(i);
            }
          }, false);
        });
      });

      _this.fader = colored(box(1, 1, 1), _this.options.backgroundColor, {
        opacity: 0,
        useFog: false,
        transparent: true,
        unshaded: true,
        side: BackSide
      });
      _this.fader.visible = false;
      _this.head.add(_this.fader);

      if (!_this.options.disableKeyboard) {
        var setFalse = function setFalse(evt) {
          evt.returnValue = false;
        };

        var keyDown = function keyDown(evt) {
          if (_this.VR.isPresenting) {
            if (evt.keyCode === Keys.ESCAPE && !_this.VR.isPolyfilled) {
              _this.cancelVR();
            }
          }

          _this.Keyboard.consumeEvent(evt);
          _this.consumeEvent(evt);
        },
            keyUp = function keyUp(evt) {
          _this.Keyboard.consumeEvent(evt);
          _this.consumeEvent(evt);
        },
            withCurrentControl = function withCurrentControl(name$$1) {
          return function (evt) {
            if (_this.currentControl) {
              if (_this.currentControl[name$$1]) {
                _this.currentControl[name$$1](evt);
              } else {
                console.warn("Couldn't find %s on %o", name$$1, _this.currentControl);
              }
            }
          };
        };

        window.addEventListener("keydown", keyDown, false);

        window.addEventListener("keyup", keyUp, false);

        window.addEventListener("paste", withCurrentControl("readClipboard"), false);
        window.addEventListener("wheel", withCurrentControl("readWheel"), false);

        var focusClipboard = function focusClipboard(evt) {
          if (_this.lockMovement) {
            var cmdName = _this.Keyboard.operatingSystem.makeCommandName(evt, _this.Keyboard.codePage);
            if (cmdName === "CUT" || cmdName === "COPY") {
              surrogate.style.display = "block";
              surrogate.focus();
            }
          }
        };

        var clipboardOperation = function clipboardOperation(evt) {
          if (_this.currentControl) {
            _this.currentControl[evt.type + "SelectedText"](evt);
            if (!evt.returnValue) {
              evt.preventDefault();
            }
            surrogate.style.display = "none";
            _this.currentControl.focus();
          }
        };

        // the `surrogate` textarea makes clipboard events possible
        var surrogate = cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
            surrogateContainer = makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

        surrogateContainer.style.position = "absolute";
        surrogateContainer.style.overflow = "hidden";
        surrogateContainer.style.width = 0;
        surrogateContainer.style.height = 0;

        surrogate.addEventListener("beforecopy", setFalse, false);
        surrogate.addEventListener("copy", clipboardOperation, false);
        surrogate.addEventListener("beforecut", setFalse, false);
        surrogate.addEventListener("cut", clipboardOperation, false);
        document.body.insertBefore(surrogateContainer, document.body.children[0]);

        window.addEventListener("beforepaste", setFalse, false);
        window.addEventListener("keydown", focusClipboard, true);
      }

      _this.head.add(_this.camera);

      return Promise.all(_this.managers.map(function (mgr) {
        return mgr.ready;
      }).filter(identity));
    });

    _this._readyParts = [_this.sky.ready, _this.ground.ready, modelsReady, documentReady];
    _this.ready = Promise.all(_this._readyParts).then(function () {
      _this.renderer.domElement.style.cursor = "default";
      if (_this.options.enableShadows && _this.sky.sun) {
        _this.renderer.shadowMap.enabled = true;
        _this.renderer.shadowMap.type = PCFSoftShadowMap;
      }

      _this.VR.displays.forEach(function (display) {
        if (display.DOMElement !== undefined) {
          display.DOMElement = _this.renderer.domElement;
        }
      });

      if (_this.options.fullScreenButtonContainer) {
        _this.insertFullScreenButtons(_this.options.fullScreenButtonContainer);
      }

      _this.VR.connect(0);
      _this.options.progress.hide();

      _this.emit("ready");
    });

    _this.start = function () {
      _this.ready.then(function () {
        _this.audio.start();
        lt = performance.now() * MILLISECONDS_TO_SECONDS;
        RAF(animate);
      });
    };

    _this.stop = function () {
      if (currentTimerObject) {
        currentTimerObject.cancelAnimationFrame(_this.timer);
        _this.audio.stop();
        _this.timer = null;
      }
    };

    Object.defineProperties(_this, {
      quality: {
        get: function get$$1() {
          return _this.options.quality;
        },
        set: function set$$1(v) {
          if (0 <= v && v < PIXEL_SCALES.length) {
            _this.options.quality = v;
            resolutionScale = PIXEL_SCALES[v];
          }
          _this.ready.then(modifyScreen);
        }
      }
    });

    _this.quality = _this.options.quality;

    if (window.alert.toString().indexOf("native code") > -1) {
      // overwrite the native alert functions so they can't be called while in
      // full screen VR mode.

      var rerouteDialog = function rerouteDialog(oldFunction, newFunction) {
        if (!newFunction) {
          newFunction = function newFunction() {};
        }
        return function () {
          if (this.VR && this.VR.isPresenting) {
            newFunction();
          } else {
            oldFunction.apply(window, arguments);
          }
        }.bind(_this);
      };

      window.alert = rerouteDialog(window.alert);
      window.confirm = rerouteDialog(window.confirm);
      window.prompt = rerouteDialog(window.prompt);
    }

    _this.start();
    return _this;
  }

  createClass(BrowserEnvironment, [{
    key: "connect",
    value: function connect(socket, userName) {

      if (!this.network) {
        this.network = new Manager(this, this.audio, this.factories, this.options);
        this.network.addEventListener("addavatar", this.addAvatar);
        this.network.addEventListener("removeavatar", this.removeAvatar);
      }
      return this.network && this.network.connect(socket, userName);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {

      return this.network && this.network.disconnect();
    }
  }, {
    key: "addInputManager",
    value: function addInputManager(mgr) {
      for (var i = this.managers.length - 1; i >= 0; --i) {
        if (this.managers[i].name === mgr.name) {
          this.managers.splice(i, 1);
        }
      }
      this.managers.push(mgr);
      this[mgr.name] = mgr;
    }
  }, {
    key: "removeInputManager",
    value: function removeInputManager(id) {
      var mgr = this[id],
          mgrIdx = this.managers.indexOf(mgr);
      if (mgrIdx > -1) {
        this.managers.splice(mgrIdx, 1);
        delete this[id];
      }
      console.log("removed", mgr);
    }
  }, {
    key: "moveStage",
    value: function moveStage(position) {
      DISPLACEMENT.copy(position).sub(this.head.position);

      this.stage.position.add(DISPLACEMENT);
    }
  }, {
    key: "cancelVR",
    value: function cancelVR() {
      this.VR.cancel();
      this.Touch.commands.U.offset = this.Mouse.commands.U.offset = 0;
    }
  }, {
    key: "setAudioFromUser",
    value: function setAudioFromUser(userName, audioElement) {

      this.audioQueue.push([userName, audioElement]);
      if (this.network) {
        while (this.audioQueue.length > 0) {
          this.network.setAudioFromUser.apply(this.network, this.audioQueue.shift());
        }
      }
    }
  }, {
    key: "insertFullScreenButtons",
    value: function insertFullScreenButtons(containerSpec) {
      var _this2 = this;

      var container = document.querySelector(containerSpec);
      var newButton = function newButton(title, text, thunk) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.title = title;
        btn.appendChild(document.createTextNode(text));
        btn.addEventListener("click", thunk, false);
        container.appendChild(btn);
        return btn;
      };

      var buttons = this.displays
      // We skip the Standard Monitor and Magic Window on iOS because we can't go full screen on those systems.
      .map(function (display, i) {
        if (!isiOS || VR.isStereoDisplay(display)) {
          var enterVR = _this2.goFullScreen.bind(_this2, i),
              btn = newButton(display.displayName, display.displayName, enterVR),
              isStereo = VR.isStereoDisplay(display);
          btn.className = isStereo ? "stereo" : "mono";
          return btn;
        }
      }).filter(identity);

      if (!/(www\.)?primrosevr.com/.test(document.location.hostname) && !this.options.disableAdvertising) {
        buttons.push(newButton("Primrose", "✿", function () {
          return open("https://www.primrosevr.com", "_blank");
        }));
      }
      return buttons;
    }
  }, {
    key: "lockMovement",
    get: function get$$1() {

      return this.currentControl && this.currentControl.lockMovement;
    }
  }, {
    key: "displays",
    get: function get$$1() {

      return this.VR.displays;
    }
  }, {
    key: "fieldOfView",
    get: function get$$1() {
      var d = this.VR.currentDevice,
          eyes = [d && d.getEyeParameters("left"), d && d.getEyeParameters("right")].filter(identity);
      if (eyes.length > 0) {
        return eyes.reduce(function (fov, eye) {
          return Math.max(fov, eye.fieldOfView.upDegrees + eye.fieldOfView.downDegrees);
        }, 0);
      }
    },
    set: function set$$1(v) {
      this.options.defaultFOV = StandardMonitorVRDisplay.DEFAULT_FOV = v;
    }
  }, {
    key: "currentTime",
    get: function get$$1() {
      return this.audio.context.currentTime;
    }
  }, {
    key: "hasMotionControllers",
    get: function get$$1() {
      return !!(this.Vive_0 && this.Vive_0.enabled && this.Vive_0.inPhysicalUse || this.Vive_1 && this.Vive_1.enabled && this.Vive_1.inPhysicalUse);
    }
  }, {
    key: "hasGamepad",
    get: function get$$1() {
      return !!(this.Gamepad_0 && this.Gamepad_0.enabled && this.Gamepad_0.inPhysicalUse);
    }
  }, {
    key: "hasMouse",
    get: function get$$1() {
      return !!(this.Mouse && this.Mouse.enabled && this.Mouse.inPhysicalUse);
    }
  }, {
    key: "hasTouch",
    get: function get$$1() {
      return !!(this.Touch && this.Touch.enabled && this.Touch.inPhysicalUse);
    }
  }]);
  return BrowserEnvironment;
}(EventDispatcher);

BrowserEnvironment.DEFAULTS = {
  antialias: true,
  quality: Quality.MAXIMUM,
  useGaze: isMobile,
  useFog: false,
  avatarHeight: 1.65,
  walkSpeed: 2,
  disableKeyboard: false,
  enableShadows: false,
  shadowMapSize: 2048,
  shadowCameraSize: 15,
  shadowRadius: 1,
  progress: window.Preloader || {
    thunk: function thunk() {},
    hide: function hide() {},
    resize: function resize() {}
  },
  // The rate at which the view fades in and out.
  fadeRate: 5,
  // The rate at which the UI shell catches up with the user's movement.
  vicinityFollowRate: 0.02,
  // The acceleration applied to falling objects.
  gravity: 9.8,
  // The amount of time in seconds to require gazes on objects before triggering the gaze event.
  gazeLength: 1.5,
  // By default, what we see in the VR view will get mirrored to a regular view on the primary screen. Set to true to improve performance.
  disableMirroring: false,
  // By default, a single light is added to the scene,
  disableDefaultLighting: false,
  // The color that WebGL clears the background with before drawing.
  backgroundColor: 0xafbfff,
  // the textures to use for the sky and ground
  skyTexture: null,
  groundTexture: null,
  // the near plane of the camera.
  nearPlane: 0.01,
  // the far plane of the camera.
  drawDistance: 100,
  // the field of view to use in non-VR settings.
  defaultFOV: StandardMonitorVRDisplay.DEFAULT_FOV,
  // The sound to play on loop in the background.
  ambientSound: null,
  // HTML5 canvas element, if one had already been created.
  canvasElement: "frontBuffer",
  // Three.js renderer, if one had already been created.
  renderer: null,
  // A WebGL context to use, if one had already been created.
  context: null,
  // Three.js scene, if one had already been created.
  scene: null,
  // This is an experimental feature for setting the height of a user's "neck" on orientation-only systems (such as Google Cardboard and Samsung Gear VR) to create a more realistic feel.
  nonstandardNeckLength: null,
  nonstandardNeckDepth: null,
  showHeadPointer: true,
  // WARNING: I highly suggest you don't go down the road that requires the following settings this. I will not help you understand what they do, because I would rather you just not use them.
  nonstandardIPD: null,
  disableAdvertising: false
};

var COUNTER$7 = 0;

var Model = function (_Entity) {
  inherits(Model, _Entity);

  function Model(file, options) {
    classCallCheck(this, Model);

    name = options && options.id || "Primrose.Controls.Model[" + COUNTER$7++ + "]";

    var _this = possibleConstructorReturn(this, (Model.__proto__ || Object.getPrototypeOf(Model)).call(this, name, options));

    _this._file = file;
    _this._model = null;
    return _this;
  }

  createClass(Model, [{
    key: "_ready",
    get: function get$$1() {
      var _this2 = this;

      return get(Model.prototype.__proto__ || Object.getPrototypeOf(Model.prototype), "_ready", this).then(function () {
        return cache(_this2._file, function () {
          return ModelFactory.loadModel(_this2._file, _this2.options.type, _this2.options.progress);
        }).then(function (factory) {
          _this2._model = factory.clone();
          _this2.add(_this2._model);
          return _this2;
        });
      });
    }
  }]);
  return Model;
}(Entity);

var PlainText$1 = function PlainText(text, size, fgcolor, bgcolor, x, y, z) {
  var hAlign = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "center";
  classCallCheck(this, PlainText);

  text = text.replace(/\r\n/g, "\n");
  var lines = text.split("\n");
  var lineHeight = size * 1000;
  var boxHeight = lineHeight * lines.length;

  var textCanvas = document.createElement("canvas");
  var textContext = textCanvas.getContext("2d");
  textContext.font = lineHeight + "px Arial";
  var width = textContext.measureText(text).width;

  textCanvas.width = width;
  textCanvas.height = boxHeight;
  textContext.font = lineHeight * 0.8 + "px Arial";
  if (bgcolor !== "transparent") {
    textContext.fillStyle = bgcolor;
    textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);
  }
  textContext.fillStyle = fgcolor;

  for (var i = 0; i < lines.length; ++i) {
    textContext.fillText(lines[i], 0, i * lineHeight);
  }

  var texture = new Texture(textCanvas);
  texture.needsUpdate = true;

  var material = new MeshBasicMaterial({
    map: texture,
    transparent: bgcolor === "transparent",
    useScreenCoordinates: false,
    color: 0xffffff,
    shading: FlatShading
  });

  var textGeometry = new PlaneGeometry(size * width / lineHeight, size * lines.length);
  textGeometry.computeBoundingBox();
  textGeometry.computeVertexNormals();

  var textMesh = new Mesh(textGeometry, material);
  if (hAlign === "left") {
    x -= textGeometry.boundingBox.min.x;
  } else if (hAlign === "right") {
    x += textGeometry.boundingBox.min.x;
  }
  textMesh.position.set(x, y, z);
  return textMesh;
};

var SIZE = 1;
var INSET = 0.8;
var PROPORTION = 10;
var SIZE_SMALL = SIZE / PROPORTION;
var INSET_LARGE = 1 - (1 - INSET) / PROPORTION;

var Progress = function () {
  function Progress(majorColor, minorColor) {
    classCallCheck(this, Progress);

    majorColor = majorColor || 0xffffff;
    minorColor = minorColor || 0x000000;
    var geom = box(SIZE, SIZE_SMALL, SIZE_SMALL);

    this.totalBar = geom.colored(minorColor, {
      unshaded: true,
      side: BackSide
    });

    this.valueBar = geom.colored(majorColor, {
      unshaded: true
    }).scl(0, INSET, INSET).addTo(this.totalBar);

    this.fileState = null;
    this.reset();
  }

  createClass(Progress, [{
    key: "reset",
    value: function reset() {
      this.fileState = {};
      this.value = 0;
    }
  }, {
    key: "onProgress",
    value: function onProgress(evt) {
      var file = evt.target.responseURL || evt.target.currentSrc;
      if (file && evt.loaded !== undefined) {
        if (!this.fileState[file]) {
          this.fileState[file] = {};
        }
        var f = this.fileState[file];
        f.loaded = evt.loaded;
        f.total = evt.total;
      }

      var total = 0,
          loaded = 0;
      for (var key in this.fileState) {
        var _f = this.fileState[key];
        total += _f.total;
        loaded += _f.loaded;
      }

      if (total > 0) {
        this.value = loaded / total;
      } else {
        this.value = 0;
      }
    }
  }, {
    key: "visible",
    get: function get$$1() {
      return this.totalBar.visible;
    },
    set: function set$$1(v) {
      this.totalBar.visible = v;
    }
  }, {
    key: "position",
    get: function get$$1() {
      return this.totalBar.position;
    }
  }, {
    key: "quaternion",
    get: function get$$1() {
      return this.totalBar.quaternion;
    }
  }, {
    key: "value",
    get: function get$$1() {
      return this.valueBar.scale.x / INSET_LARGE;
    },
    set: function set$$1(v) {
      this.valueBar.scale.x = v * INSET_LARGE;
      this.valueBar.position.x = -SIZE * (1 - v) * INSET_LARGE / 2;
    }
  }]);
  return Progress;
}();

////
// For all of these commands, the "current" cursor is:
// If SHIFT is not held, then "front".
// If SHIFT is held, then "back"
//
var TextInput$2 = new BasicTextInput("Text Line input commands");

var COUNTER$8 = 0;

var TextInput = function (_TextBox) {
  inherits(TextInput, _TextBox);

  function TextInput(options) {
    classCallCheck(this, TextInput);

    var _this = possibleConstructorReturn(this, (TextInput.__proto__ || Object.getPrototypeOf(TextInput)).call(this, Object.assign({}, {
      id: "Primrose.Controls.TextInput[" + COUNTER$8++ + "]",
      padding: 5,
      singleLine: true,
      disableWordWrap: true,
      hideLineNumbers: true,
      hideScrollBars: true,
      tabWidth: 1,
      tokenizer: PlainText,
      commands: TextInput$2
    }), options));

    _this.passwordCharacter = _this.options.passwordCharacter;
    return _this;
  }

  createClass(TextInput, [{
    key: "drawText",
    value: function drawText(ctx, txt, x, y) {
      if (this.passwordCharacter) {
        var val = "";
        for (var i = 0; i < txt.length; ++i) {
          val += this.passwordCharacter;
        }
        txt = val;
      }
      get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "drawText", this).call(this, ctx, txt, x, y);
    }
  }, {
    key: "value",
    get: function get$$1() {
      return get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "value", this);
    },
    set: function set$$1(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      set(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "value", v, this);
    }
  }, {
    key: "selectedText",
    get: function get$$1() {
      return get(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "selectedText", this);
    },
    set: function set$$1(v) {
      v = v || "";
      v = v.replace(/\r?\n/g, "");
      set(TextInput.prototype.__proto__ || Object.getPrototypeOf(TextInput.prototype), "selectedText", v, this);
    }
  }]);
  return TextInput;
}(TextBox);

var Controls = {
  Button2D: Button2D,
  Button3D: Button3D,
  ButtonFactory: ButtonFactory,
  Entity: Entity,
  Ground: Ground,
  Image: Image,
  Label: Label,
  Model: Model,
  PlainText: PlainText$1,
  Progress: Progress,
  Sky: Sky,
  Surface: Surface,
  TextBox: TextBox,
  TextInput: TextInput,
  Video: Video
};

var Displays = {
  CardboardVRDisplay: CardboardVRDisplay,
  frameDataFromPose: frameDataFromPose,
  install: install,
  MockVRDisplay: MockVRDisplay,
  StandardMonitorVRDisplay: StandardMonitorVRDisplay,
  VRDisplay: VRDisplay,
  VRFrameData: VRFrameData
};

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

var DOM = {
  cascadeElement: cascadeElement,
  findEverything: findEverything,
  makeHidingContainer: makeHidingContainer
};

var Graphics = {
  fixGeometry: fixGeometry,
  InsideSphereGeometry: InsideSphereGeometry,
  loadTexture: loadTexture,
  ModelFactory: ModelFactory
};

function del(type, url, options) {
  return XHR("DELETE", type, url, options);
}

function delObject(url, options) {
  return del("json", url, options);
}

function getText(url, options) {
  return get$1("text", url, options);
}

function post(type, url, options) {
  return XHR("POST", type, url, options);
}

function postObject(url, options) {
  return post("json", url, options);
}

var HTTP = {
  del: del,
  delObject: delObject,
  get: get$1,
  getBuffer: getBuffer,
  getObject: getObject,
  getText: getText,
  post: post,
  postObject: postObject,
  XHR: XHR
};

var Location = function (_InputProcessor) {
  inherits(Location, _InputProcessor);

  function Location(commands, options) {
    classCallCheck(this, Location);

    var _this = possibleConstructorReturn(this, (Location.__proto__ || Object.getPrototypeOf(Location)).call(this, "Location", commands, ["LONGITUDE", "LATITUDE", "ALTITUDE", "HEADING", "SPEED"]));

    _this.options = Object.assign({}, Location.DEFAULTS, options);

    _this.available = !!navigator.geolocation;
    if (_this.available) {
      navigator.geolocation.watchPosition(_this.setState.bind(_this), function () {
        return _this.available = false;
      }, _this.options);
    }
    return _this;
  }

  createClass(Location, [{
    key: "setState",
    value: function setState(location) {
      this.inPhysicalUse = true;
      for (var p in location.coords) {
        var k = p.toUpperCase();
        if (this.axisNames.indexOf(k) > -1) {
          this.setAxis(k, location.coords[p]);
        }
      }
      this.update();
    }
  }]);
  return Location;
}(InputProcessor);



Location.DEFAULTS = {
  enableHighAccuracy: true,
  maximumAge: 30000,
  timeout: 25000
};

var Input = {
  Gamepad: Gamepad,
  InputProcessor: InputProcessor,
  Keyboard: Keyboard,
  Location: Location,
  Mouse: Mouse,
  PoseInputProcessor: PoseInputProcessor,
  Speech: Speech$1,
  Touch: Touch,
  VR: VR
};

var PEERING_TIMEOUT_LENGTH = 30000;

// some useful information:
// - https://www.webrtc-experiment.com/docs/STUN-or-TURN.html
// - http://www.html5rocks.com/en/tutorials/webrtc/infrastructure/#after-signaling-using-ice-to-cope-with-nats-and-firewalls
// - https://github.com/coturn/rfc5766-turn-server/
var ICE_SERVERS = [{
  urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302", "stun:stun3.l.google.com:19302", "stun:stun4.l.google.com:19302"]
}];

var INSTANCE_COUNT = 0;

var WebRTCSocket = function (_EventDispatcher) {
  inherits(WebRTCSocket, _EventDispatcher);

  // Be forewarned, the WebRTC lifecycle is very complex and editing this class is likely to break it.
  function WebRTCSocket(requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    classCallCheck(this, WebRTCSocket);

    // These logging constructs are basically off by default, but you will need them if you ever need to debug the WebRTC workflow.
    var _this = possibleConstructorReturn(this, (WebRTCSocket.__proto__ || Object.getPrototypeOf(WebRTCSocket)).call(this));

    var attemptCount = 0;
    var MAX_LOG_LEVEL = 5,
        instanceNumber = ++INSTANCE_COUNT,
        print = function print(name, level, format) {
      if (level < MAX_LOG_LEVEL) {
        var args = ["%s: " + format, level];
        for (var i = 3; i < arguments.length; ++i) {
          args.push(arguments[i]);
        }
        console[name].apply(console, args);
      }
      return arguments[3];
    };

    _this.myResult = null;
    _this.theirResult = null;
    _this._timeout = null;
    _this._log = print.bind(null, "log");
    _this._error = print.bind(null, "error", 0, "");
    _this.fromUserName = fromUserName;
    _this.fromUserIndex = fromUserIndex;
    _this.toUserName = toUserName;
    _this.toUserIndex = toUserIndex;
    _this.rtc = null;
    _this.goFirst = !goSecond;
    _this.progress = {
      offer: {
        created: false,
        received: false
      },
      answer: {
        created: false,
        received: false
      }
    };
    // If the user leaves the page, we want to at least fire off the close signal and perhaps
    // not completely surprise the remote user.
    window.addEventListener("unload", _this.close.bind(_this));

    var resolve = null,
        reject = null;

    var done = function done(isError) {
      _this._log(2, "Tearing down event handlers");
      _this.stopTimeout();
      _this.rtc.onsignalingstatechange = null;
      _this.rtc.oniceconnectionstatechange = null;
      _this.rtc.onnegotiationneeded = null;
      _this.rtc.onicecandidate = null;

      _this.teardown();
      if (isError) {
        _this.close();
      }
    };

    // A pass-through function to include in the promise stream to see if the channels have all been set up correctly and ready to go.
    var check = function check(obj) {
      if (_this.complete) {
        _this._log(1, "Timeout avoided.");
        done();
        resolve();
      }
      return obj;
    };

    // When an offer or an answer is received, it's pretty much the same exact processing. Either type of object gets checked to see if it was expected, then unwrapped.
    _this.peering_answer = function (description) {
      _this._log(1, "description", description);
      // Check to see if we expected this sort of message from this user.
      _this.recordProgress(description.item, "received");

      // The description we received is always the remote description, regardless of whether or not it's an offer or an answer.
      return _this.rtc.setRemoteDescription(new RTCSessionDescription(description.item))

      // check to see if we're done.
      .then(check)

      // and if there are any errors, bomb out and shut everything down.
      .catch(_this.peering_error);
    };

    // When an offer or an answer is created, it's pretty much the same exact processing. Either type of object gets wrapped with a context identifying which peer channel is being negotiated, and then transmitted through the negotiation server to the remote user.
    _this.descriptionCreated = function (description) {
      _this.recordProgress(description, "created");

      // The description we create is always the local description, regardless of whether or not it's an offer
      // or an answer.
      return _this.rtc.setLocalDescription(description)
      // Let the remote user know what happened.
      .then(function () {
        return _this.emit(description.type, description);
      })
      // check to see if we're done.
      .then(check)
      // and if there are any errors, bomb out and shut everything down.
      .catch(_this.peering_error);
    };

    // A catch-all error handler to shut down the world if an error we couldn't handle happens.
    _this.peering_error = function (exp) {
      _this._error(exp);
      _this.emit("cancel", exp);
      _this._log(1, "Timeout avoided, but only because of an error.");
      done(true);
      reject(exp);
    };

    // A catch-all error handler to shut down the world if an error we couldn't handle happens.
    _this.peering_cancel = function (exp) {
      _this._error(exp);
      _this._log(1, "Timeout avoided, but only because of an error.");
      done(true);
      reject(exp);
    };

    // When an offer is received, we need to create an answer in reply.
    _this.peering_offer = function (offer) {
      _this._log(1, "offer", offer);
      var promise = _this.peering_answer(offer);
      if (promise) {
        return promise.then(function () {
          return _this.rtc.createAnswer();
        }).then(_this.descriptionCreated);
      }
    };

    // ICE stands for Interactive Connectivity Establishment. It's basically a description of a local end-point,
    // with enough information for the remote user to be able to connect to it.
    _this.peering_ice = function (ice) {
      _this._log(1, "ice", ice);
      var candidate = new RTCIceCandidate(ice.item);
      return _this.rtc.addIceCandidate(candidate).catch(_this._error);
    };

    _this.peering_peer = function (evt) {
      _this._log(1, "peering", evt);
      _this.hasRTC.then(function () {
        return _this.issueRequest();
      });
    };

    // This is where things get gnarly
    _this.hasRTC = Primrose.HTTP.getObject(requestICEPath).then(function (config) {
      config.iceServers.push.apply(config.iceServers, ICE_SERVERS);
      for (var i = config.iceServers.length - 1; i >= 0; --i) {
        var server = config.iceServers[i];
        if (!server.urls || server.urls.length === 0) {
          config.iceServers.splice(i, 1);
        } else {
          if (server.url && !server.urls) {
            server.urls = [server.url];
            delete server.url;
          }
          if (server.username && server.credential) {
            server.credentialType = "token";
          }
        }
      }
      config.iceCandidatePoolSize = 100;
      _this._log(1, config);
      _this.rtc = new RTCPeerConnection(config);
      // This is just for debugging purposes.
      _this.rtc.onsignalingstatechange = function (evt) {
        return _this._log(1, "[%s] Signal State: %s", instanceNumber, _this.rtc.signalingState);
      };
      _this.rtc.oniceconnectionstatechange = function (evt) {
        return _this._log(1, "[%s] ICE Connection %s, Gathering %s", instanceNumber, _this.rtc.iceConnectionState, _this.rtc.iceGatheringState);
      };

      // All of the literature you'll read on WebRTC show creating an offer right after creating a data channel or adding a stream to the peer connection. This is wrong. The correct way is to wait for the API to tell you that negotiation is necessary, and only then create the offer. There is a race-condition between the signaling state of the WebRTCPeerConnection and creating an offer after creating a channel if we don't wait for the appropriate time.
      _this.rtc.onnegotiationneeded = function (evt) {
        return _this.createOffer().then(_this.descriptionCreated);
      };

      // The API is going to figure out end-point configurations for us by communicating with the STUN servers and seeing which end-points are visible and which require network address translation.
      _this.rtc.onicecandidate = function (evt) {
        // There is an error condition where sometimes the candidate returned in this event handler will be null.
        if (evt.candidate) {
          // Then let the remote user know of our folly.
          _this.emit("ice", evt.candidate);
        }
      };
    });

    _this.ready = _this.hasRTC.then(function () {
      return new Promise(function (resolver, rejecter) {
        resolve = resolver;
        reject = rejecter;
        _this.emit("peer");
      });
    });
    return _this;
  }

  createClass(WebRTCSocket, [{
    key: "emit",
    value: function emit(type, evt) {
      get(WebRTCSocket.prototype.__proto__ || Object.getPrototypeOf(WebRTCSocket.prototype), "emit", this).call(this, type, {
        fromUserName: this.fromUserName,
        fromUserIndex: this.fromUserIndex,
        toUserName: this.toUserName,
        toUserIndex: this.toUserIndex,
        item: evt
      });
    }
  }, {
    key: "startTimeout",
    value: function startTimeout() {
      if (this._timeout === null) {
        this._log(1, "Timing out in " + Math.floor(PEERING_TIMEOUT_LENGTH / 1000) + " seconds.");
        this._timeout = setTimeout(this.peering_error.bind(this, "Gave up waiting on the peering connection."), PEERING_TIMEOUT_LENGTH);
      }
    }
  }, {
    key: "stopTimeout",
    value: function stopTimeout() {
      if (this._timeout !== null) {
        clearTimeout(this._timeout);
        this._timeout = null;
      }
    }
  }, {
    key: "createOffer",
    value: function createOffer() {
      return this.rtc.createOffer(this.offerOptions);
    }
  }, {
    key: "recordProgress",
    value: function recordProgress(description, method) {
      this._log(2, "Logging progress [%s]: %s %s -> true", description.type, method, this.progress[description.type][method]);
      this.progress[description.type][method] = true;
    }
  }, {
    key: "close",
    value: function close() {
      if (this.rtc && this.rtc.signalingState !== "closed") {
        this.rtc.close();
        this.rtc = null;
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      throw new Error("Not implemented.");
    }
  }, {
    key: "issueRequest",
    value: function issueRequest() {
      throw new Error("Not implemented");
    }
  }, {
    key: "complete",
    get: function get$$1() {
      return !this.rtc || this.rtc.signalingState === "closed";
    }
  }]);
  return WebRTCSocket;
}(EventDispatcher);

WebRTCSocket.PEERING_EVENTS = ["peer", "cancel", "offer", "ice", "answer"];

var ENABLE_OPUS_HACK = true;

function preferOpus(description) {
  if (ENABLE_OPUS_HACK && description) {
    var sdp = description.sdp;
    var sdpLines = sdp.split('\r\n');
    var mLineIndex = null;
    // Search for m line.
    for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio') !== -1) {
        mLineIndex = i;
        break;
      }
    }
    if (mLineIndex === null) return sdp;

    // If Opus is available, set it as the default in m line.
    for (var j = 0; j < sdpLines.length; j++) {
      if (sdpLines[j].search('opus/48000') !== -1) {
        var opusPayload = extractSdp(sdpLines[j], /:(\d+) opus\/48000/i);
        if (opusPayload) sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
        break;
      }
    }

    // Remove CN in m line and sdp.
    sdpLines = removeCN(sdpLines, mLineIndex);

    description.sdp = sdpLines.join('\r\n');
  }
  return description;
}

function extractSdp(sdpLine, pattern) {
  var result = sdpLine.match(pattern);
  return result && result.length == 2 ? result[1] : null;
}

function setDefaultCodec(mLine, payload) {
  var elements = mLine.split(' ');
  var newLine = [];
  var index = 0;
  for (var i = 0; i < elements.length; i++) {
    if (index === 3) // Format of media starts from the fourth.
      newLine[index++] = payload; // Put target payload to the first.
    if (elements[i] !== payload) newLine[index++] = elements[i];
  }
  return newLine.join(' ');
}

function removeCN(sdpLines, mLineIndex) {
  var mLineElements = sdpLines[mLineIndex].split(' ');
  // Scan from end for the convenience of removing an item.
  for (var i = sdpLines.length - 1; i >= 0; i--) {
    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if (payload) {
      var cnPos = mLineElements.indexOf(payload);
      if (cnPos !== -1) {
        // Remove CN payload from m line.
        mLineElements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      sdpLines.splice(i, 1);
    }
  }

  sdpLines[mLineIndex] = mLineElements.join(' ');
  return sdpLines;
}

var AudioChannel = function (_WebRTCSocket) {
  inherits(AudioChannel, _WebRTCSocket);

  function AudioChannel(requestICEPath, fromUserName, toUserName, outAudio, goSecond) {
    classCallCheck(this, AudioChannel);

    console.log("attempting to peer audio from %s to %s. %s goes first.", fromUserName, toUserName, goSecond ? toUserName : fromUserName);

    var _this = possibleConstructorReturn(this, (AudioChannel.__proto__ || Object.getPrototypeOf(AudioChannel)).call(this, requestICEPath, fromUserName, 0, toUserName, 0, goSecond));

    _this.outAudio = outAudio;
    _this.inAudio = null;
    _this.startTimeout();
    return _this;
  }

  createClass(AudioChannel, [{
    key: "issueRequest",
    value: function issueRequest() {
      var _this2 = this;

      console.log("going first", this.goFirst);
      // Adding an audio stream to the peer connection is different between Firefox (which supports the latest
      //  version of the API) and Chrome.
      var addStream = function addStream() {
        _this2._log(0, "adding stream", _this2.outAudio, _this2.rtc.addTrack);

        // Make sure we actually have audio to send to the remote.
        _this2.outAudio.then(function (aud) {
          if (_this2.rtc.addTrack) {
            aud.getAudioTracks().forEach(function (track) {
              return _this2.rtc.addTrack(track, aud);
            });
          } else {
            _this2.rtc.addStream(aud);
          }

          if (isIE) {
            _this2.createOffer().then(_this2.descriptionCreated);
          }
        });
      };

      // Receiving an audio stream from the peer connection is just a
      var onStream = function onStream(stream) {
        _this2.inAudio = stream;
        if (!_this2.goFirst) {
          _this2._log(0, "Creating the second stream from %s to %s", _this2.fromUserName, _this2.toUserName);
          _this2.stopTimeout();
          _this2._log(1, "Restarting timeout.");
          _this2.startTimeout();
          addStream();
        }
      };

      // Wait to receive an audio track.
      if ("ontrack" in this.rtc) {
        this.rtc.ontrack = function (evt) {
          return onStream(evt.streams[0]);
        };
      } else {
        this.rtc.onaddstream = function (evt) {
          return onStream(evt.stream);
        };
      }

      // If we're the boss, tell people about it.
      if (this.goFirst) {
        this._log(0, "Creating the first stream from %s to %s", this.fromUserName, this.toUserName);
        addStream();
      }
    }

    // The peering process is complete when all offers are answered.

  }, {
    key: "teardown",
    value: function teardown() {
      if ("ontrack" in this.rtc) {
        this.rtc.ontrack = null;
      } else {
        this.rtc.onaddstream = null;
      }
    }
  }, {
    key: "createOffer",
    value: function createOffer() {
      return get(AudioChannel.prototype.__proto__ || Object.getPrototypeOf(AudioChannel.prototype), "createOffer", this).call(this).then(preferOpus);
    }
  }, {
    key: "complete",
    get: function get$$1() {
      if (this.goFirst) {
        this._log(1, "[First]: offer created: %s, answer recv: %s -> offer recv: %s -> answer created: %s.", this.progress.offer.created, this.progress.answer.received, this.progress.offer.received, this.progress.answer.created, this.rtc.signalingState);
      } else {
        this._log(1, "[Second]: offer recv: %s, answer created: %s -> offer created: %s -> answer recv: %s.", this.progress.offer.received, this.progress.answer.created, this.progress.offer.created, this.progress.answer.received, this.rtc.signalingState);
      }

      return get(AudioChannel.prototype.__proto__ || Object.getPrototypeOf(AudioChannel.prototype), "complete", this) || this.progress.offer.received && this.progress.offer.created && this.progress.answer.received && this.progress.answer.created;
    }
  }]);
  return AudioChannel;
}(WebRTCSocket);

var DataChannel = function (_WebRTCSocket) {
  inherits(DataChannel, _WebRTCSocket);

  function DataChannel(requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond) {
    classCallCheck(this, DataChannel);

    var _this = possibleConstructorReturn(this, (DataChannel.__proto__ || Object.getPrototypeOf(DataChannel)).call(this, requestICEPath, fromUserName, fromUserIndex, toUserName, toUserIndex, goSecond));

    _this.dataChannel = null;
    return _this;
  }

  createClass(DataChannel, [{
    key: "issueRequest",
    value: function issueRequest() {
      var _this2 = this;

      if (this.goFirst) {
        this._log(0, "Creating data channel");
        this.dataChannel = this.rtc.createDataChannel();
      } else {
        this.ondatachannel = function (evt) {
          _this2._log(0, "Receving data channel");
          _this2.dataChannel = evt.channel;
        };
      }
    }
  }, {
    key: "teardown",
    value: function teardown() {
      this.rtc.ondatachannel = null;
    }
  }, {
    key: "complete",
    get: function get$$1() {
      if (this.goFirst) {
        this._log(1, "[First]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
      } else {
        this._log(1, "[Second]: OC %s -> AR %s.", this.progress.offer.created, this.progress.answer.received);
      }
      return get(DataChannel.prototype.__proto__ || Object.getPrototypeOf(DataChannel.prototype), "complete", this) || this.goFirst && this.progress.offer.created && this.progress.answer.received || !this.goFirst && this.progress.offer.received && this.progress.answer.created;
    }
  }]);
  return DataChannel;
}(WebRTCSocket);

var Network = {
  AudioChannel: AudioChannel,
  DataChannel: DataChannel,
  Manager: Manager,
  RemoteUser: RemoteUser,
  WebRTCSocket: WebRTCSocket
};

function ID() {
  return (Math.random() * Math.log(Number.MAX_VALUE)).toString(36).replace(".", "");
}

function item(arr) {
  return arr[int(arr.length)];
}

function steps(min, max, steps) {
  return min + int(0, (1 + max - min) / steps) * steps;
}

function vector(min, max) {
  return new Vector3().set(number(min, max), number(min, max), number(min, max));
}

var Random = {
  color: color,
  ID: ID,
  int: int,
  item: item,
  number: number,
  steps: steps,
  vector: vector
};

var Watcher = function (_Obj) {
  inherits(Watcher, _Obj);

  function Watcher(path, root) {
    classCallCheck(this, Watcher);

    var _this = possibleConstructorReturn(this, (Watcher.__proto__ || Object.getPrototypeOf(Watcher)).call(this, path, root));

    var lastValue = null;
    _this.read = function () {
      var value = _this.get();
      if (value !== _this.lastValue) {
        _this.lastValue = value;
        return new Record(_this.path, value, root);
      } else {
        return null;
      }
    };
    return _this;
  }

  return Watcher;
}(Obj);

var Recorder = function (_Automator) {
  inherits(Recorder, _Automator);

  function Recorder(watchers, root) {
    classCallCheck(this, Recorder);

    var _this = possibleConstructorReturn(this, (Recorder.__proto__ || Object.getPrototypeOf(Recorder)).call(this, root));

    _this.watchers = watchers.map(function (path) {
      return new Watcher(path, _this.root);
    });
    return _this;
  }

  createClass(Recorder, [{
    key: "update",
    value: function update(t) {
      get(Recorder.prototype.__proto__ || Object.getPrototypeOf(Recorder.prototype), "update", this).call(this, t);
      var records = this.watchers.map(function (w) {
        return w.read();
      }).filter(function (r) {
        return r;
      });

      var frame = new Frame(t - this.startT, records);
      this.frames.push(frame);
      this.emit("frame", frame);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      var output = {};

      this.frames.forEach(function (frame) {
        output[frame.t] = {};
        for (var i = 0; i < frame.records.length; ++i) {
          var record = frame.records[i];
          if (record.value !== null) {
            var parts = record.path.split("."),
                key = parts[parts.length - 1];
            var head = output[frame.t];
            for (var j = 0; j < parts.length - 1; ++j) {
              var part = parts[j];
              if (head[part] === undefined || head[part] === null) {
                if (/^\d+$/.test(parts[j + 1])) {
                  head[part] = [];
                } else {
                  head[part] = {};
                }
              }
              head = head[part];
            }
            head[key] = record.value;
          }
        }
      });

      return JSON.stringify(output);
    }
  }]);
  return Recorder;
}(Automator);

var Replay = {
  Automator: Automator,
  Frame: Frame,
  Obj: Obj,
  Player: Player,
  Record: Record,
  Recorder: Recorder,
  Watcher: Watcher
};

var CommandPacks = {
  BasicTextInput: BasicTextInput,
  CommandPack: CommandPack,
  TextEditor: TextEditor,
  TextInput: TextInput$2
};

var eval2 = eval;

var Basic = new Grammar("BASIC",
// Grammar rules are applied in the order they are specified.
[
// Text needs at least the newlines token, or else every line will attempt to render as a single line and the line count won't work.
["newlines", /(?:\r\n|\r|\n)/],
// BASIC programs used to require the programmer type in her own line numbers. The start at the beginning of the line.
["lineNumbers", /^\d+\s+/],
// Comments were lines that started with the keyword "REM" (for REMARK) and ran to the end of the line. They did not have to be numbered, because they were not executable and were stripped out by the interpreter.
["startLineComments", /^REM\s/],
// Both double-quoted and single-quoted strings were not always supported, but in this case, I'm just demonstrating how it would be done for both.
["strings", /"(?:\\"|[^"])*"/], ["strings", /'(?:\\'|[^'])*'/],
// Numbers are an optional dash, followed by a optional digits, followed by optional period, followed by 1 or more required digits. This allows us to match both integers and decimal numbers, both positive and negative, with or without leading zeroes for decimal numbers between (-1, 1).
["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/],
// Keywords are really just a list of different words we want to match, surrounded by the "word boundary" selector "\b".
["keywords", /\b(?:RESTORE|REPEAT|RETURN|LOAD|LABEL|DATA|READ|THEN|ELSE|FOR|DIM|LET|IF|TO|STEP|NEXT|WHILE|WEND|UNTIL|GOTO|GOSUB|ON|TAB|AT|END|STOP|PRINT|INPUT|RND|INT|CLS|CLK|LEN)\b/],
// Sometimes things we want to treat as keywords have different meanings in different locations. We can specify rules for tokens more than once.
["keywords", /^DEF FN/],
// These are all treated as mathematical operations.
["operators", /(?:\+|;|,|-|\*\*|\*|\/|>=|<=|=|<>|<|>|OR|AND|NOT|MOD|\(|\)|\[|\])/],
// Once everything else has been matched, the left over blocks of words are treated as variable and function names.
["identifiers", /\w+\$?/]]);
var oldTokenize = Basic.tokenize;
Basic.tokenize = function (code) {
  return oldTokenize.call(this, code.toUpperCase());
};

Basic.interpret = function (sourceCode, input, output, errorOut, next, clearScreen, loadFile, done) {
  var tokens = this.tokenize(sourceCode),
      EQUAL_SIGN = new Token("=", "operators"),
      counter = 0,
      isDone = false,
      program = {},
      lineNumbers = [],
      currentLine = [],
      lines = [currentLine],
      data = [],
      returnStack = [],
      forLoopCounters = {},
      dataCounter = 0,
      state = {
    INT: function INT(v) {
      return v | 0;
    },
    RND: function RND() {
      return Math.random();
    },
    CLK: function CLK() {
      return Date.now() / 3600000;
    },
    LEN: function LEN(id) {
      return id.length;
    },
    LINE: function LINE() {
      return lineNumbers[counter];
    },
    TAB: function TAB(v) {
      var str = "";
      for (var i = 0; i < v; ++i) {
        str += " ";
      }
      return str;
    },
    POW: function POW(a, b) {
      return Math.pow(a, b);
    }
  };

  function toNum(ln) {
    return new Token(ln.toString(), "numbers");
  }

  function toStr(str) {
    return new Token("\"" + str.replace("\n", "\\n").replace("\"", "\\\"") + "\"", "strings");
  }

  var tokenMap = {
    "OR": "||",
    "AND": "&&",
    "NOT": "!",
    "MOD": "%",
    "<>": "!="
  };

  while (tokens.length > 0) {
    var token = tokens.shift();
    if (token.type === "newlines") {
      currentLine = [];
      lines.push(currentLine);
    } else if (token.type !== "regular" && token.type !== "comments") {
      token.value = tokenMap[token.value] || token.value;
      currentLine.push(token);
    }
  }

  for (var i = 0; i < lines.length; ++i) {
    var line = lines[i];
    if (line.length > 0) {
      var lastLine = lineNumbers[lineNumbers.length - 1];
      var lineNumber = line.shift();

      if (lineNumber.type !== "lineNumbers") {
        line.unshift(lineNumber);

        if (lastLine === undefined) {
          lastLine = -1;
        }

        lineNumber = toNum(lastLine + 1);
      }

      lineNumber = parseFloat(lineNumber.value);
      if (lastLine && lineNumber <= lastLine) {
        throw new Error("expected line number greater than " + lastLine + ", but received " + lineNumber + ".");
      } else if (line.length > 0) {
        lineNumbers.push(lineNumber);
        program[lineNumber] = line;
      }
    }
  }

  function process(line) {
    if (line && line.length > 0) {
      var op = line.shift();
      if (op) {
        if (commands.hasOwnProperty(op.value)) {
          return commands[op.value](line);
        } else if (!isNaN(op.value)) {
          return setProgramCounter([op]);
        } else if (state[op.value] || line.length > 0 && line[0].type === "operators" && line[0].value === "=") {
          line.unshift(op);
          return translate(line);
        } else {
          error("Unknown command. >>> " + op.value);
        }
      }
    }
    return pauseBeforeComplete();
  }

  function error(msg) {
    errorOut("At line " + lineNumbers[counter] + ": " + msg);
  }

  function getLine(i) {
    var lineNumber = lineNumbers[i];
    var line = program[lineNumber];
    return line && line.slice();
  }

  function evaluate(line) {
    var script = "";
    for (var i = 0; i < line.length; ++i) {
      var t = line[i];
      var nest = 0;
      if (t.type === "identifiers" && typeof state[t.value] !== "function" && i < line.length - 1 && line[i + 1].value === "(") {
        for (var j = i + 1; j < line.length; ++j) {
          var t2 = line[j];
          if (t2.value === "(") {
            if (nest === 0) {
              t2.value = "[";
            }
            ++nest;
          } else if (t2.value === ")") {
            --nest;
            if (nest === 0) {
              t2.value = "]";
            }
          } else if (t2.value === "," && nest === 1) {
            t2.value = "][";
          }

          if (nest === 0) {
            break;
          }
        }
      }
      script += t.value;
    }
    //with ( state ) { // jshint ignore:line
    try {
      return eval2(script); // jshint ignore:line
    } catch (exp) {
      console.error(exp);
      console.debug(line.join(", "));
      console.error(script);
      error(exp.message + ": " + script);
    }
    //}
  }

  function declareVariable(line) {
    var decl = [],
        decls = [decl],
        nest = 0,
        i;
    for (i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.value === "(") {
        ++nest;
      } else if (t.value === ")") {
        --nest;
      }
      if (nest === 0 && t.value === ",") {
        decl = [];
        decls.push(decl);
      } else {
        decl.push(t);
      }
    }
    for (i = 0; i < decls.length; ++i) {
      decl = decls[i];
      var id = decl.shift();
      if (id.type !== "identifiers") {
        error("Identifier expected: " + id.value);
      } else {
        var val = null,
            j;
        id = id.value;
        if (decl[0].value === "(" && decl[decl.length - 1].value === ")") {
          var sizes = [];
          for (j = 1; j < decl.length - 1; ++j) {
            if (decl[j].type === "numbers") {
              sizes.push(decl[j].value | 0);
            }
          }
          if (sizes.length === 0) {
            val = [];
          } else {
            val = new Array(sizes[0]);
            var queue = [val];
            for (j = 1; j < sizes.length; ++j) {
              var size = sizes[j];
              for (var k = 0, l = queue.length; k < l; ++k) {
                var arr = queue.shift();
                for (var m = 0; m < arr.length; ++m) {
                  arr[m] = new Array(size);
                  if (j < sizes.length - 1) {
                    queue.push(arr[m]);
                  }
                }
              }
            }
          }
        }
        state[id] = val;
        return true;
      }
    }
  }

  function print(line) {
    var endLine = "\n";
    var nest = 0;
    line = line.map(function (t, i) {
      t = t.clone();
      if (t.type === "operators") {
        if (t.value === ",") {
          if (nest === 0) {
            t.value = "+ \", \" + ";
          }
        } else if (t.value === ";") {
          t.value = "+ \" \"";
          if (i < line.length - 1) {
            t.value += " + ";
          } else {
            endLine = "";
          }
        } else if (t.value === "(") {
          ++nest;
        } else if (t.value === ")") {
          --nest;
        }
      }
      return t;
    });
    var txt = evaluate(line);
    if (txt === undefined) {
      txt = "";
    }
    output(txt + endLine);
    return true;
  }

  function setProgramCounter(line) {
    var lineNumber = parseFloat(evaluate(line));
    counter = -1;
    while (counter < lineNumbers.length - 1 && lineNumbers[counter + 1] < lineNumber) {
      ++counter;
    }

    return true;
  }

  function checkConditional(line) {
    var thenIndex = -1,
        elseIndex = -1,
        i;
    for (i = 0; i < line.length; ++i) {
      if (line[i].type === "keywords" && line[i].value === "THEN") {
        thenIndex = i;
      } else if (line[i].type === "keywords" && line[i].value === "ELSE") {
        elseIndex = i;
      }
    }
    if (thenIndex === -1) {
      error("Expected THEN clause.");
    } else {
      var condition = line.slice(0, thenIndex);
      for (i = 0; i < condition.length; ++i) {
        var t = condition[i];
        if (t.type === "operators" && t.value === "=") {
          t.value = "==";
        }
      }
      var thenClause, elseClause;
      if (elseIndex === -1) {
        thenClause = line.slice(thenIndex + 1);
      } else {
        thenClause = line.slice(thenIndex + 1, elseIndex);
        elseClause = line.slice(elseIndex + 1);
      }
      if (evaluate(condition)) {
        return process(thenClause);
      } else if (elseClause) {
        return process(elseClause);
      }
    }

    return true;
  }

  function pauseBeforeComplete() {
    output("PROGRAM COMPLETE - PRESS RETURN TO FINISH.");
    input(function () {
      isDone = true;
      if (done) {
        done();
      }
    });
    return false;
  }

  function labelLine(line) {
    line.push(EQUAL_SIGN);
    line.push(toNum(lineNumbers[counter]));
    return translate(line);
  }

  function waitForInput(line) {
    var toVar = line.pop();
    if (line.length > 0) {
      print(line);
    }
    input(function (str) {
      str = str.toUpperCase();
      var valueToken = null;
      if (!isNaN(str)) {
        valueToken = toNum(str);
      } else {
        valueToken = toStr(str);
      }
      evaluate([toVar, EQUAL_SIGN, valueToken]);
      if (next) {
        next();
      }
    });
    return false;
  }

  function onStatement(line) {
    var idxExpr = [],
        idx = null,
        targets = [];
    try {
      while (line.length > 0 && (line[0].type !== "keywords" || line[0].value !== "GOTO")) {
        idxExpr.push(line.shift());
      }

      if (line.length > 0) {
        line.shift(); // burn the goto;

        for (var i = 0; i < line.length; ++i) {
          var t = line[i];
          if (t.type !== "operators" || t.value !== ",") {
            targets.push(t);
          }
        }

        idx = evaluate(idxExpr) - 1;

        if (0 <= idx && idx < targets.length) {
          return setProgramCounter([targets[idx]]);
        }
      }
    } catch (exp) {
      console.error(exp);
    }
    return true;
  }

  function gotoSubroutine(line) {
    returnStack.push(toNum(lineNumbers[counter + 1]));
    return setProgramCounter(line);
  }

  function setRepeat() {
    returnStack.push(toNum(lineNumbers[counter]));
    return true;
  }

  function conditionalReturn(cond) {
    var ret = true;
    var val = returnStack.pop();
    if (val && cond) {
      ret = setProgramCounter([val]);
    }
    return ret;
  }

  function untilLoop(line) {
    var cond = !evaluate(line);
    return conditionalReturn(cond);
  }

  function findNext(str) {
    for (i = counter + 1; i < lineNumbers.length; ++i) {
      var l = getLine(i);
      if (l[0].value === str) {
        return i;
      }
    }
    return lineNumbers.length;
  }

  function whileLoop(line) {
    var cond = evaluate(line);
    if (!cond) {
      counter = findNext("WEND");
    } else {
      returnStack.push(toNum(lineNumbers[counter]));
    }
    return true;
  }

  var FOR_LOOP_DELIMS = ["=", "TO", "STEP"];

  function forLoop(line) {
    var n = lineNumbers[counter];
    var varExpr = [];
    var fromExpr = [];
    var toExpr = [];
    var skipExpr = [];
    var arrs = [varExpr, fromExpr, toExpr, skipExpr];
    var a = 0;
    var i = 0;
    for (i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.value === FOR_LOOP_DELIMS[a]) {
        if (a === 0) {
          varExpr.push(t);
        }
        ++a;
      } else {
        arrs[a].push(t);
      }
    }

    var skip = 1;
    if (skipExpr.length > 0) {
      skip = evaluate(skipExpr);
    }

    if (forLoopCounters[n] === undefined) {
      forLoopCounters[n] = evaluate(fromExpr);
    }

    var end = evaluate(toExpr);
    var cond = forLoopCounters[n] <= end;
    if (!cond) {
      delete forLoopCounters[n];
      counter = findNext("NEXT");
    } else {
      varExpr.push(toNum(forLoopCounters[n]));
      process(varExpr);
      forLoopCounters[n] += skip;
      returnStack.push(toNum(lineNumbers[counter]));
    }
    return true;
  }

  function stackReturn() {
    return conditionalReturn(true);
  }

  function loadCodeFile(line) {
    loadFile(evaluate(line)).then(next);
    return false;
  }

  function noop() {
    return true;
  }

  function loadData(line) {
    while (line.length > 0) {
      var t = line.shift();
      if (t.type !== "operators") {
        data.push(t.value);
      }
    }
    return true;
  }

  function readData(line) {
    if (data.length === 0) {
      var dataLine = findNext("DATA");
      process(getLine(dataLine));
    }
    var value = data[dataCounter];
    ++dataCounter;
    line.push(EQUAL_SIGN);
    line.push(toNum(value));
    return translate(line);
  }

  function restoreData() {
    dataCounter = 0;
    return true;
  }

  function defineFunction(line) {
    var name = line.shift().value;
    var signature = "";
    var body = "";
    var fillSig = true;
    for (var i = 0; i < line.length; ++i) {
      var t = line[i];
      if (t.type === "operators" && t.value === "=") {
        fillSig = false;
      } else if (fillSig) {
        signature += t.value;
      } else {
        body += t.value;
      }
    }
    name = "FN" + name;
    var script = "(function " + name + signature + "{ return " + body + "; })";
    state[name] = eval2(script); // jshint ignore:line
    return true;
  }

  function translate(line) {
    evaluate(line);
    return true;
  }

  var commands = {
    DIM: declareVariable,
    LET: translate,
    PRINT: print,
    GOTO: setProgramCounter,
    IF: checkConditional,
    INPUT: waitForInput,
    END: pauseBeforeComplete,
    STOP: pauseBeforeComplete,
    REM: noop,
    "'": noop,
    CLS: clearScreen,
    ON: onStatement,
    GOSUB: gotoSubroutine,
    RETURN: stackReturn,
    LOAD: loadCodeFile,
    DATA: loadData,
    READ: readData,
    RESTORE: restoreData,
    REPEAT: setRepeat,
    UNTIL: untilLoop,
    "DEF FN": defineFunction,
    WHILE: whileLoop,
    WEND: stackReturn,
    FOR: forLoop,
    NEXT: stackReturn,
    LABEL: labelLine
  };

  return function () {
    if (!isDone) {
      var goNext = true;
      while (goNext) {
        var line = getLine(counter);
        goNext = process(line);
        ++counter;
      }
    }
  };
};

var HTML = new Grammar("HTML", [["newlines", /(?:\r\n|\r|\n)/], ["startBlockComments", /(?:<|&lt;)!--/], ["endBlockComments", /--(?:>|&gt;)/], ["stringDelim", /("|')/], ["numbers", /-?(?:(?:\b\d*)?\.)?\b\d+\b/], ["keywords", /(?:<|&lt;)\/?(html|base|head|link|meta|style|title|address|article|aside|footer|header|h1|h2|h3|h4|h5|h6|hgroup|nav|section|dd|div|dl|dt|figcaption|figure|hr|li|main|ol|p|pre|ul|a|abbr|b|bdi|bdo|br|cite|code|data|dfn|em|i|kbd|mark|q|rp|rt|rtc|ruby|s|samp|small|span|strong|sub|sup|time|u|var|wbr|area|audio|img|map|track|video|embed|object|param|source|canvas|noscript|script|del|ins|caption|col|colgroup|table|tbody|td|tfoot|th|thead|tr|button|datalist|fieldset|form|input|label|legend|meter|optgroup|option|output|progress|select|textarea|details|dialog|menu|menuitem|summary|content|element|shadow|template|acronym|applet|basefont|big|blink|center|command|content|dir|font|frame|frameset|isindex|keygen|listing|marquee|multicol|nextid|noembed|plaintext|spacer|strike|tt|xmp)\b/], ["members", /(\w+)=/]]);

var TestResults = new Grammar("TestResults", [["newlines", /(?:\r\n|\r|\n)/, true], ["numbers", /(\[)(o+)/, true], ["numbers", /(\d+ succeeded), 0 failed/, true], ["numbers", /^    Successes:/, true], ["functions", /(x+)\]/, true], ["functions", /[1-9]\d* failed/, true], ["functions", /^    Failures:/, true], ["comments", /(\d+ms:)(.*)/, true], ["keywords", /(Test results for )(\w+):/, true], ["strings", /        \w+/, true]]);

var Grammars = {
  Basic: Basic,
  Grammar: Grammar,
  HTML: HTML,
  JavaScript: JavaScript,
  PlainText: PlainText,
  TestResults: TestResults
};

var OperatingSystems = {
  Linux: Windows,
  macOS: macOS,
  OperatingSystem: OperatingSystem,
  Windows: Windows
};

var Terminal = function Terminal(inputEditor, outputEditor) {
  classCallCheck(this, Terminal);

  outputEditor = outputEditor || inputEditor;

  var inputCallback = null,
      currentProgram = null,
      originalGrammar = null,
      currentEditIndex = 0,
      pageSize = 40,
      outputQueue = [],
      buffer = "",
      restoreInput = inputEditor === outputEditor,
      self = this;

  this.running = false;
  this.waitingForInput = false;

  function toEnd(editor) {
    editor.selectionStart = editor.selectionEnd = editor.value.length;
    editor.scrollIntoView(editor.frontCursor);
  }

  function done() {
    if (self.running) {
      flush();
      self.running = false;
      if (restoreInput) {
        inputEditor.tokenizer = originalGrammar;
        inputEditor.value = currentProgram;
      }
      toEnd(inputEditor);
    }
  }

  function clearScreen() {
    outputEditor.selectionStart = outputEditor.selectionEnd = 0;
    outputEditor.value = "";
    return true;
  }

  function flush() {
    if (buffer.length > 0) {
      var lines = buffer.split("\n");
      for (var i = 0; i < pageSize && lines.length > 0; ++i) {
        outputQueue.push(lines.shift());
      }
      if (lines.length > 0) {
        outputQueue.push(" ----- more -----");
      }
      buffer = lines.join("\n");
    }
  }

  function input(callback) {
    inputCallback = callback;
    self.waitingForInput = true;
    flush();
  }

  function stdout(str) {
    buffer += str;
  }

  this.sendInput = function (evt) {
    if (buffer.length > 0) {
      flush();
    } else {
      outputEditor.keyDown(evt);
      var str = outputEditor.value.substring(currentEditIndex);
      inputCallback(str.trim());
      inputCallback = null;
      this.waitingForInput = false;
    }
  };

  this.execute = function () {
    pageSize = 10;
    originalGrammar = inputEditor.tokenizer;
    if (originalGrammar && originalGrammar.interpret) {
      this.running = true;
      var looper,
          next = function next() {
        if (self.running) {
          setTimeout(looper, 1);
        }
      };

      currentProgram = inputEditor.value;
      looper = originalGrammar.interpret(currentProgram, input, stdout, stdout, next, clearScreen, this.loadFile.bind(this), done);
      outputEditor.tokenizer = PlainText;
      clearScreen();
      next();
    }
  };

  this.loadFile = function (fileName) {
    return getText(fileName.toLowerCase()).then(function (file) {
      if (isMacOS) {
        file = file.replace("CTRL+SHIFT+SPACE", "CMD+OPT+E");
      }
      inputEditor.value = currentProgram = file;
      return file;
    });
  };

  this.update = function () {
    if (outputQueue.length > 0) {
      outputEditor.value += outputQueue.shift() + "\n";
      toEnd(outputEditor);
      currentEditIndex = outputEditor.selectionStart;
    }
  };
};

var Dark = {
  name: "Dark",
  fontFamily: "'Droid Sans Mono', 'Consolas', 'Lucida Console', 'Courier New', 'Courier', monospace",
  cursorColor: "white",
  fontSize: 16,
  lineNumbers: {
    foreColor: "white"
  },
  regular: {
    backColor: "black",
    foreColor: "#c0c0c0",
    currentRowBackColor: "#202020",
    selectedBackColor: "#404040",
    unfocused: "rgba(0, 0, 255, 0.25)"
  },
  strings: {
    foreColor: "#aa9900",
    fontStyle: "italic"
  },
  regexes: {
    foreColor: "#aa0099",
    fontStyle: "italic"
  },
  numbers: {
    foreColor: "green"
  },
  comments: {
    foreColor: "yellow",
    fontStyle: "italic"
  },
  keywords: {
    foreColor: "cyan"
  },
  functions: {
    foreColor: "brown",
    fontWeight: "bold"
  },
  members: {
    foreColor: "green"
  },
  error: {
    foreColor: "red",
    fontStyle: "underline italic"
  }
};

var Themes = {
  Dark: Dark,
  Default: Default
};

var Text = {
  CodePages: CodePages,
  CommandPacks: CommandPacks,
  Cursor: Cursor,
  Grammars: Grammars,
  OperatingSystems: OperatingSystems,
  Point: Point,
  Rectangle: Rectangle,
  Rule: Rule,
  Size: Size,
  Terminal: Terminal,
  Themes: Themes,
  Token: Token
};

var Tools = {
  Teleporter: Teleporter
};

var index$5 = {
  Angle: Angle,
  Audio: Audio$1,
  BrowserEnvironment: BrowserEnvironment,
  Constants: Constants,
  Controls: Controls,
  Displays: Displays,
  DOM: DOM,
  Graphics: Graphics,
  HTTP: HTTP,
  Input: Input,
  Keys: Keys,
  Network: Network,
  Pointer: Pointer,
  Random: Random,
  Replay: Replay,
  Text: Text,
  Tools: Tools
};

/*
 * Copyright (C) 2014 - 2016 Sean T. McBeth <sean@notiontheory.com>
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
Object.assign(window, flags, liveAPI, util);
// Do this just for side effects, we are monkey-patching Three.js classes with our own utilities.

export default index$5;
//# sourceMappingURL=PrimroseWithDoc.modules.js.map
