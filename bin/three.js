// File:src/Three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var THREE = { REVISION: '72dev' };

// browserify support

if ( typeof module === 'object' ) {

	module.exports = THREE;

}

// polyfills

if ( Math.sign === undefined ) {

	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign

	Math.sign = function ( x ) {

		return ( x < 0 ) ? - 1 : ( x > 0 ) ? 1 : +x;

	};

}

// https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

// GL STATE CONSTANTS

THREE.CullFaceNone = 0;
THREE.CullFaceBack = 1;
THREE.CullFaceFront = 2;
THREE.CullFaceFrontBack = 3;

THREE.FrontFaceDirectionCW = 0;
THREE.FrontFaceDirectionCCW = 1;

// SHADOWING TYPES

THREE.BasicShadowMap = 0;
THREE.PCFShadowMap = 1;
THREE.PCFSoftShadowMap = 2;

// MATERIAL CONSTANTS

// side

THREE.FrontSide = 0;
THREE.BackSide = 1;
THREE.DoubleSide = 2;

// shading

THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;

// colors

THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;

// blending modes

THREE.NoBlending = 0;
THREE.NormalBlending = 1;
THREE.AdditiveBlending = 2;
THREE.SubtractiveBlending = 3;
THREE.MultiplyBlending = 4;
THREE.CustomBlending = 5;

// custom blending equations
// (numbers start from 100 not to clash with other
//  mappings to OpenGL constants defined in Texture.js)

THREE.AddEquation = 100;
THREE.SubtractEquation = 101;
THREE.ReverseSubtractEquation = 102;
THREE.MinEquation = 103;
THREE.MaxEquation = 104;

// custom blending destination factors

THREE.ZeroFactor = 200;
THREE.OneFactor = 201;
THREE.SrcColorFactor = 202;
THREE.OneMinusSrcColorFactor = 203;
THREE.SrcAlphaFactor = 204;
THREE.OneMinusSrcAlphaFactor = 205;
THREE.DstAlphaFactor = 206;
THREE.OneMinusDstAlphaFactor = 207;

// custom blending source factors

//THREE.ZeroFactor = 200;
//THREE.OneFactor = 201;
//THREE.SrcAlphaFactor = 204;
//THREE.OneMinusSrcAlphaFactor = 205;
//THREE.DstAlphaFactor = 206;
//THREE.OneMinusDstAlphaFactor = 207;
THREE.DstColorFactor = 208;
THREE.OneMinusDstColorFactor = 209;
THREE.SrcAlphaSaturateFactor = 210;

// depth modes

THREE.NeverDepth = 0;
THREE.AlwaysDepth = 1;
THREE.LessDepth = 2;
THREE.LessEqualDepth = 3;
THREE.EqualDepth = 4;
THREE.GreaterEqualDepth = 5;
THREE.GreaterDepth = 6;
THREE.NotEqualDepth = 7;


// TEXTURE CONSTANTS

THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;
THREE.AddOperation = 2;

// Mapping modes

THREE.UVMapping = 300;

THREE.CubeReflectionMapping = 301;
THREE.CubeRefractionMapping = 302;

THREE.EquirectangularReflectionMapping = 303;
THREE.EquirectangularRefractionMapping = 304;

THREE.SphericalReflectionMapping = 305;

// Wrapping modes

THREE.RepeatWrapping = 1000;
THREE.ClampToEdgeWrapping = 1001;
THREE.MirroredRepeatWrapping = 1002;

// Filters

THREE.NearestFilter = 1003;
THREE.NearestMipMapNearestFilter = 1004;
THREE.NearestMipMapLinearFilter = 1005;
THREE.LinearFilter = 1006;
THREE.LinearMipMapNearestFilter = 1007;
THREE.LinearMipMapLinearFilter = 1008;

// Data types

THREE.UnsignedByteType = 1009;
THREE.ByteType = 1010;
THREE.ShortType = 1011;
THREE.UnsignedShortType = 1012;
THREE.IntType = 1013;
THREE.UnsignedIntType = 1014;
THREE.FloatType = 1015;
THREE.HalfFloatType = 1025;

// Pixel types

//THREE.UnsignedByteType = 1009;
THREE.UnsignedShort4444Type = 1016;
THREE.UnsignedShort5551Type = 1017;
THREE.UnsignedShort565Type = 1018;

// Pixel formats

THREE.AlphaFormat = 1019;
THREE.RGBFormat = 1020;
THREE.RGBAFormat = 1021;
THREE.LuminanceFormat = 1022;
THREE.LuminanceAlphaFormat = 1023;
// THREE.RGBEFormat handled as THREE.RGBAFormat in shaders
THREE.RGBEFormat = THREE.RGBAFormat; //1024;

// DDS / ST3C Compressed texture formats

THREE.RGB_S3TC_DXT1_Format = 2001;
THREE.RGBA_S3TC_DXT1_Format = 2002;
THREE.RGBA_S3TC_DXT3_Format = 2003;
THREE.RGBA_S3TC_DXT5_Format = 2004;


// PVRTC compressed texture formats

THREE.RGB_PVRTC_4BPPV1_Format = 2100;
THREE.RGB_PVRTC_2BPPV1_Format = 2101;
THREE.RGBA_PVRTC_4BPPV1_Format = 2102;
THREE.RGBA_PVRTC_2BPPV1_Format = 2103;


// DEPRECATED

THREE.Projector = function () {

	console.error( 'THREE.Projector has been moved to /examples/js/renderers/Projector.js.' );

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

};

THREE.CanvasRenderer = function () {

	console.error( 'THREE.CanvasRenderer has been moved to /examples/js/renderers/CanvasRenderer.js' );

	this.domElement = document.createElement( 'canvas' );
	this.clear = function () {};
	this.render = function () {};
	this.setClearColor = function () {};
	this.setSize = function () {};

};

// File:src/math/Color.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Color = function ( color ) {

	if ( arguments.length === 3 ) {

		return this.setRGB( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );

	}

	return this.set( color )

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	set: function ( value ) {

		if ( value instanceof THREE.Color ) {

			this.copy( value );

		} else if ( typeof value === 'number' ) {

			this.setHex( value );

		} else if ( typeof value === 'string' ) {

			this.setStyle( value );

		}

		return this;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSL: function ( h, s, l ) {

		// h,s,l ranges are in 0.0 - 1.0

		if ( s === 0 ) {

			this.r = this.g = this.b = l;

		} else {

			var hue2rgb = function ( p, q, t ) {

				if ( t < 0 ) t += 1;
				if ( t > 1 ) t -= 1;
				if ( t < 1 / 6 ) return p + ( q - p ) * 6 * t;
				if ( t < 1 / 2 ) return q;
				if ( t < 2 / 3 ) return p + ( q - p ) * 6 * ( 2 / 3 - t );
				return p;

			};

			var p = l <= 0.5 ? l * ( 1 + s ) : l + s - ( l * s );
			var q = ( 2 * l ) - p;

			this.r = hue2rgb( q, p, h + 1 / 3 );
			this.g = hue2rgb( q, p, h );
			this.b = hue2rgb( q, p, h - 1 / 3 );

		}

		return this;

	},

	setStyle: function ( style ) {

		// rgb(255,0,0)

		if ( /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test( style ) ) {

			var color = /^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec( style );

			this.r = Math.min( 255, parseInt( color[ 1 ], 10 ) ) / 255;
			this.g = Math.min( 255, parseInt( color[ 2 ], 10 ) ) / 255;
			this.b = Math.min( 255, parseInt( color[ 3 ], 10 ) ) / 255;

			return this;

		}

		// rgb(100%,0%,0%)

		if ( /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test( style ) ) {

			var color = /^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec( style );

			this.r = Math.min( 100, parseInt( color[ 1 ], 10 ) ) / 100;
			this.g = Math.min( 100, parseInt( color[ 2 ], 10 ) ) / 100;
			this.b = Math.min( 100, parseInt( color[ 3 ], 10 ) ) / 100;

			return this;

		}

		// #ff0000

		if ( /^\#([0-9a-f]{6})$/i.test( style ) ) {

			var color = /^\#([0-9a-f]{6})$/i.exec( style );

			this.setHex( parseInt( color[ 1 ], 16 ) );

			return this;

		}

		// #f00

		if ( /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test( style ) ) {

			var color = /^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec( style );

			this.setHex( parseInt( color[ 1 ] + color[ 1 ] + color[ 2 ] + color[ 2 ] + color[ 3 ] + color[ 3 ], 16 ) );

			return this;

		}

		// red

		if ( /^(\w+)$/i.test( style ) ) {

			this.setHex( THREE.ColorKeywords[ style ] );

			return this;

		}


	},

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color, gammaFactor ) {

		if ( gammaFactor === undefined ) gammaFactor = 2.0;

		this.r = Math.pow( color.r, gammaFactor );
		this.g = Math.pow( color.g, gammaFactor );
		this.b = Math.pow( color.b, gammaFactor );

		return this;

	},

	copyLinearToGamma: function ( color, gammaFactor ) {

		if ( gammaFactor === undefined ) gammaFactor = 2.0;

		var safeInverse = ( gammaFactor > 0 ) ? ( 1.0 / gammaFactor ) : 1.0;

		this.r = Math.pow( color.r, safeInverse );
		this.g = Math.pow( color.g, safeInverse );
		this.b = Math.pow( color.b, safeInverse );

		return this;

	},

	convertGammaToLinear: function () {

		var r = this.r, g = this.g, b = this.b;

		this.r = r * r;
		this.g = g * g;
		this.b = b * b;

		return this;

	},

	convertLinearToGamma: function () {

		this.r = Math.sqrt( this.r );
		this.g = Math.sqrt( this.g );
		this.b = Math.sqrt( this.b );

		return this;

	},

	getHex: function () {

		return ( this.r * 255 ) << 16 ^ ( this.g * 255 ) << 8 ^ ( this.b * 255 ) << 0;

	},

	getHexString: function () {

		return ( '000000' + this.getHex().toString( 16 ) ).slice( - 6 );

	},

	getHSL: function ( optionalTarget ) {

		// h,s,l ranges are in 0.0 - 1.0

		var hsl = optionalTarget || { h: 0, s: 0, l: 0 };

		var r = this.r, g = this.g, b = this.b;

		var max = Math.max( r, g, b );
		var min = Math.min( r, g, b );

		var hue, saturation;
		var lightness = ( min + max ) / 2.0;

		if ( min === max ) {

			hue = 0;
			saturation = 0;

		} else {

			var delta = max - min;

			saturation = lightness <= 0.5 ? delta / ( max + min ) : delta / ( 2 - max - min );

			switch ( max ) {

				case r: hue = ( g - b ) / delta + ( g < b ? 6 : 0 ); break;
				case g: hue = ( b - r ) / delta + 2; break;
				case b: hue = ( r - g ) / delta + 4; break;

			}

			hue /= 6;

		}

		hsl.h = hue;
		hsl.s = saturation;
		hsl.l = lightness;

		return hsl;

	},

	getStyle: function () {

		return 'rgb(' + ( ( this.r * 255 ) | 0 ) + ',' + ( ( this.g * 255 ) | 0 ) + ',' + ( ( this.b * 255 ) | 0 ) + ')';

	},

	offsetHSL: function ( h, s, l ) {

		var hsl = this.getHSL();

		hsl.h += h; hsl.s += s; hsl.l += l;

		this.setHSL( hsl.h, hsl.s, hsl.l );

		return this;

	},

	add: function ( color ) {

		this.r += color.r;
		this.g += color.g;
		this.b += color.b;

		return this;

	},

	addColors: function ( color1, color2 ) {

		this.r = color1.r + color2.r;
		this.g = color1.g + color2.g;
		this.b = color1.b + color2.b;

		return this;

	},

	addScalar: function ( s ) {

		this.r += s;
		this.g += s;
		this.b += s;

		return this;

	},

	multiply: function ( color ) {

		this.r *= color.r;
		this.g *= color.g;
		this.b *= color.b;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.r *= s;
		this.g *= s;
		this.b *= s;

		return this;

	},

	lerp: function ( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	},

	equals: function ( c ) {

		return ( c.r === this.r ) && ( c.g === this.g ) && ( c.b === this.b );

	},

	fromArray: function ( array ) {

		this.r = array[ 0 ];
		this.g = array[ 1 ];
		this.b = array[ 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.r;
		array[ offset + 1 ] = this.g;
		array[ offset + 2 ] = this.b;

		return array;
	},

	clone: function () {

		return new THREE.Color().setRGB( this.r, this.g, this.b );

	}

};

THREE.ColorKeywords = { 'aliceblue': 0xF0F8FF, 'antiquewhite': 0xFAEBD7, 'aqua': 0x00FFFF, 'aquamarine': 0x7FFFD4, 'azure': 0xF0FFFF,
'beige': 0xF5F5DC, 'bisque': 0xFFE4C4, 'black': 0x000000, 'blanchedalmond': 0xFFEBCD, 'blue': 0x0000FF, 'blueviolet': 0x8A2BE2,
'brown': 0xA52A2A, 'burlywood': 0xDEB887, 'cadetblue': 0x5F9EA0, 'chartreuse': 0x7FFF00, 'chocolate': 0xD2691E, 'coral': 0xFF7F50,
'cornflowerblue': 0x6495ED, 'cornsilk': 0xFFF8DC, 'crimson': 0xDC143C, 'cyan': 0x00FFFF, 'darkblue': 0x00008B, 'darkcyan': 0x008B8B,
'darkgoldenrod': 0xB8860B, 'darkgray': 0xA9A9A9, 'darkgreen': 0x006400, 'darkgrey': 0xA9A9A9, 'darkkhaki': 0xBDB76B, 'darkmagenta': 0x8B008B,
'darkolivegreen': 0x556B2F, 'darkorange': 0xFF8C00, 'darkorchid': 0x9932CC, 'darkred': 0x8B0000, 'darksalmon': 0xE9967A, 'darkseagreen': 0x8FBC8F,
'darkslateblue': 0x483D8B, 'darkslategray': 0x2F4F4F, 'darkslategrey': 0x2F4F4F, 'darkturquoise': 0x00CED1, 'darkviolet': 0x9400D3,
'deeppink': 0xFF1493, 'deepskyblue': 0x00BFFF, 'dimgray': 0x696969, 'dimgrey': 0x696969, 'dodgerblue': 0x1E90FF, 'firebrick': 0xB22222,
'floralwhite': 0xFFFAF0, 'forestgreen': 0x228B22, 'fuchsia': 0xFF00FF, 'gainsboro': 0xDCDCDC, 'ghostwhite': 0xF8F8FF, 'gold': 0xFFD700,
'goldenrod': 0xDAA520, 'gray': 0x808080, 'green': 0x008000, 'greenyellow': 0xADFF2F, 'grey': 0x808080, 'honeydew': 0xF0FFF0, 'hotpink': 0xFF69B4,
'indianred': 0xCD5C5C, 'indigo': 0x4B0082, 'ivory': 0xFFFFF0, 'khaki': 0xF0E68C, 'lavender': 0xE6E6FA, 'lavenderblush': 0xFFF0F5, 'lawngreen': 0x7CFC00,
'lemonchiffon': 0xFFFACD, 'lightblue': 0xADD8E6, 'lightcoral': 0xF08080, 'lightcyan': 0xE0FFFF, 'lightgoldenrodyellow': 0xFAFAD2, 'lightgray': 0xD3D3D3,
'lightgreen': 0x90EE90, 'lightgrey': 0xD3D3D3, 'lightpink': 0xFFB6C1, 'lightsalmon': 0xFFA07A, 'lightseagreen': 0x20B2AA, 'lightskyblue': 0x87CEFA,
'lightslategray': 0x778899, 'lightslategrey': 0x778899, 'lightsteelblue': 0xB0C4DE, 'lightyellow': 0xFFFFE0, 'lime': 0x00FF00, 'limegreen': 0x32CD32,
'linen': 0xFAF0E6, 'magenta': 0xFF00FF, 'maroon': 0x800000, 'mediumaquamarine': 0x66CDAA, 'mediumblue': 0x0000CD, 'mediumorchid': 0xBA55D3,
'mediumpurple': 0x9370DB, 'mediumseagreen': 0x3CB371, 'mediumslateblue': 0x7B68EE, 'mediumspringgreen': 0x00FA9A, 'mediumturquoise': 0x48D1CC,
'mediumvioletred': 0xC71585, 'midnightblue': 0x191970, 'mintcream': 0xF5FFFA, 'mistyrose': 0xFFE4E1, 'moccasin': 0xFFE4B5, 'navajowhite': 0xFFDEAD,
'navy': 0x000080, 'oldlace': 0xFDF5E6, 'olive': 0x808000, 'olivedrab': 0x6B8E23, 'orange': 0xFFA500, 'orangered': 0xFF4500, 'orchid': 0xDA70D6,
'palegoldenrod': 0xEEE8AA, 'palegreen': 0x98FB98, 'paleturquoise': 0xAFEEEE, 'palevioletred': 0xDB7093, 'papayawhip': 0xFFEFD5, 'peachpuff': 0xFFDAB9,
'peru': 0xCD853F, 'pink': 0xFFC0CB, 'plum': 0xDDA0DD, 'powderblue': 0xB0E0E6, 'purple': 0x800080, 'red': 0xFF0000, 'rosybrown': 0xBC8F8F,
'royalblue': 0x4169E1, 'saddlebrown': 0x8B4513, 'salmon': 0xFA8072, 'sandybrown': 0xF4A460, 'seagreen': 0x2E8B57, 'seashell': 0xFFF5EE,
'sienna': 0xA0522D, 'silver': 0xC0C0C0, 'skyblue': 0x87CEEB, 'slateblue': 0x6A5ACD, 'slategray': 0x708090, 'slategrey': 0x708090, 'snow': 0xFFFAFA,
'springgreen': 0x00FF7F, 'steelblue': 0x4682B4, 'tan': 0xD2B48C, 'teal': 0x008080, 'thistle': 0xD8BFD8, 'tomato': 0xFF6347, 'turquoise': 0x40E0D0,
'violet': 0xEE82EE, 'wheat': 0xF5DEB3, 'white': 0xFFFFFF, 'whitesmoke': 0xF5F5F5, 'yellow': 0xFFFF00, 'yellowgreen': 0x9ACD32 };

// File:src/math/Quaternion.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Quaternion = function ( x, y, z, w ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	_x: 0,_y: 0, _z: 0, _w: 0,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get w () {

		return this._w;

	},

	set w ( value ) {

		this._w = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, w ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._w = w;

		this.onChangeCallback();

		return this;

	},

	copy: function ( quaternion ) {

		this._x = quaternion.x;
		this._y = quaternion.y;
		this._z = quaternion.z;
		this._w = quaternion.w;

		this.onChangeCallback();

		return this;

	},

	setFromEuler: function ( euler, update ) {

		if ( euler instanceof THREE.Euler === false ) {

			throw new Error( 'THREE.Quaternion: .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );
		}

		// http://www.mathworks.com/matlabcentral/fileexchange/
		// 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
		//	content/SpinCalc.m

		var c1 = Math.cos( euler._x / 2 );
		var c2 = Math.cos( euler._y / 2 );
		var c3 = Math.cos( euler._z / 2 );
		var s1 = Math.sin( euler._x / 2 );
		var s2 = Math.sin( euler._y / 2 );
		var s3 = Math.sin( euler._z / 2 );

		if ( euler.order === 'XYZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'YXZ' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'ZXY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'ZYX' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		} else if ( euler.order === 'YZX' ) {

			this._x = s1 * c2 * c3 + c1 * s2 * s3;
			this._y = c1 * s2 * c3 + s1 * c2 * s3;
			this._z = c1 * c2 * s3 - s1 * s2 * c3;
			this._w = c1 * c2 * c3 - s1 * s2 * s3;

		} else if ( euler.order === 'XZY' ) {

			this._x = s1 * c2 * c3 - c1 * s2 * s3;
			this._y = c1 * s2 * c3 - s1 * c2 * s3;
			this._z = c1 * c2 * s3 + s1 * s2 * c3;
			this._w = c1 * c2 * c3 + s1 * s2 * s3;

		}

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm

		// assumes axis is normalized

		var halfAngle = angle / 2, s = Math.sin( halfAngle );

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos( halfAngle );

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ],

			trace = m11 + m22 + m33,
			s;

		if ( trace > 0 ) {

			s = 0.5 / Math.sqrt( trace + 1.0 );

			this._w = 0.25 / s;
			this._x = ( m32 - m23 ) * s;
			this._y = ( m13 - m31 ) * s;
			this._z = ( m21 - m12 ) * s;

		} else if ( m11 > m22 && m11 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m11 - m22 - m33 );

			this._w = ( m32 - m23 ) / s;
			this._x = 0.25 * s;
			this._y = ( m12 + m21 ) / s;
			this._z = ( m13 + m31 ) / s;

		} else if ( m22 > m33 ) {

			s = 2.0 * Math.sqrt( 1.0 + m22 - m11 - m33 );

			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;

		} else {

			s = 2.0 * Math.sqrt( 1.0 + m33 - m11 - m22 );

			this._w = ( m21 - m12 ) / s;
			this._x = ( m13 + m31 ) / s;
			this._y = ( m23 + m32 ) / s;
			this._z = 0.25 * s;

		}

		this.onChangeCallback();

		return this;

	},

	setFromUnitVectors: function () {

		// http://lolengine.net/blog/2014/02/24/quaternion-from-two-vectors-final

		// assumes direction vectors vFrom and vTo are normalized

		var v1, r;

		var EPS = 0.000001;

		return function ( vFrom, vTo ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			r = vFrom.dot( vTo ) + 1;

			if ( r < EPS ) {

				r = 0;

				if ( Math.abs( vFrom.x ) > Math.abs( vFrom.z ) ) {

					v1.set( - vFrom.y, vFrom.x, 0 );

				} else {

					v1.set( 0, - vFrom.z, vFrom.y );

				}

			} else {

				v1.crossVectors( vFrom, vTo );

			}

			this._x = v1.x;
			this._y = v1.y;
			this._z = v1.z;
			this._w = r;

			this.normalize();

			return this;

		}

	}(),

	inverse: function () {

		this.conjugate().normalize();

		return this;

	},

	conjugate: function () {

		this._x *= - 1;
		this._y *= - 1;
		this._z *= - 1;

		this.onChangeCallback();

		return this;

	},

	dot: function ( v ) {

		return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;

	},

	lengthSq: function () {

		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;

	},

	length: function () {

		return Math.sqrt( this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w );

	},

	normalize: function () {

		var l = this.length();

		if ( l === 0 ) {

			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;

		} else {

			l = 1 / l;

			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;

		}

		this.onChangeCallback();

		return this;

	},

	multiply: function ( q, p ) {

		if ( p !== undefined ) {

			console.warn( 'THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.' );
			return this.multiplyQuaternions( q, p );

		}

		return this.multiplyQuaternions( this, q );

	},

	multiplyQuaternions: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		var qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
		var qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

		this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		this.onChangeCallback();

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Quaternion: .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.' );
		return vector.applyQuaternion( this );

	},

	slerp: function ( qb, t ) {

		if ( t === 0 ) return this;
		if ( t === 1 ) return this.copy( qb );

		var x = this._x, y = this._y, z = this._z, w = this._w;

		// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

		var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

		if ( cosHalfTheta < 0 ) {

			this._w = - qb._w;
			this._x = - qb._x;
			this._y = - qb._y;
			this._z = - qb._z;

			cosHalfTheta = - cosHalfTheta;

		} else {

			this.copy( qb );

		}

		if ( cosHalfTheta >= 1.0 ) {

			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;

		}

		var halfTheta = Math.acos( cosHalfTheta );
		var sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

		if ( Math.abs( sinHalfTheta ) < 0.001 ) {

			this._w = 0.5 * ( w + this._w );
			this._x = 0.5 * ( x + this._x );
			this._y = 0.5 * ( y + this._y );
			this._z = 0.5 * ( z + this._z );

			return this;

		}

		var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
		ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

		this._w = ( w * ratioA + this._w * ratioB );
		this._x = ( x * ratioA + this._x * ratioB );
		this._y = ( y * ratioA + this._y * ratioB );
		this._z = ( z * ratioA + this._z * ratioB );

		this.onChangeCallback();

		return this;

	},

	equals: function ( quaternion ) {

		return ( quaternion._x === this._x ) && ( quaternion._y === this._y ) && ( quaternion._z === this._z ) && ( quaternion._w === this._w );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this._x = array[ offset ];
		this._y = array[ offset + 1 ];
		this._z = array[ offset + 2 ];
		this._w = array[ offset + 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._w;

		return array;

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Quaternion( this._x, this._y, this._z, this._w );

	}

};

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	return qm.copy( qa ).slerp( qb, t );

};

// File:src/math/Vector2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiply: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;
	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector2();
				max = new THREE.Vector2();

			}

			min.set( minVal, minVal );
			max.set( maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];

		return this;

	},

	clone: function () {

		return new THREE.Vector2( this.x, this.y );

	}

};

// File:src/math/Vector3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};

THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},
	
	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;
		this.z -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	multiply: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors( v, w );

		}

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;

		return this;

	},

	multiplyVectors: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	applyEuler: function () {

		var quaternion;

		return function ( euler ) {

			if ( euler instanceof THREE.Euler === false ) {

				console.error( 'THREE.Vector3: .applyEuler() now expects a Euler rotation rather than a Vector3 and order.' );

			}

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromEuler( euler ) );

			return this;

		};

	}(),

	applyAxisAngle: function () {

		var quaternion;

		return function ( axis, angle ) {

			if ( quaternion === undefined ) quaternion = new THREE.Quaternion();

			this.applyQuaternion( quaternion.setFromAxisAngle( axis, angle ) );

			return this;

		};

	}(),

	applyMatrix3: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ] * z;
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ] * z;
		this.z = e[ 2 ] * x + e[ 5 ] * y + e[ 8 ] * z;

		return this;

	},

	applyMatrix4: function ( m ) {

		// input: THREE.Matrix4 affine matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ];
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ];
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ];

		return this;

	},

	applyProjection: function ( m ) {

		// input: THREE.Matrix4 projection matrix

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;
		var d = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] ); // perspective divide

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z + e[ 12 ] ) * d;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z + e[ 13 ] ) * d;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * d;

		return this;

	},

	applyQuaternion: function ( q ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;

		var qx = q.x;
		var qy = q.y;
		var qz = q.z;
		var qw = q.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y;
		var iy =  qw * y + qz * x - qx * z;
		var iz =  qw * z + qx * y - qy * x;
		var iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;

	},

	project: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.projectionMatrix, matrix.getInverse( camera.matrixWorld ) );
			return this.applyProjection( matrix );

		};

	}(),

	unproject: function () {

		var matrix;

		return function ( camera ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			matrix.multiplyMatrices( camera.matrixWorld, matrix.getInverse( camera.projectionMatrix ) );
			return this.applyProjection( matrix );

		};

	}(),

	transformDirection: function ( m ) {

		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		var x = this.x, y = this.y, z = this.z;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ]  * z;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ]  * z;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z;

		this.normalize();

		return this;

	},

	divide: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector3();
				max = new THREE.Vector3();

			}

			min.set( minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

	floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );

		return this;

	},

	ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );

		return this;

	},

	round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );

		return this;

	},

	roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );

		return this;

	},

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength  ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		return this;

	},

	cross: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );

		}

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	crossVectors: function ( a, b ) {

		var ax = a.x, ay = a.y, az = a.z;
		var bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;

	},

	projectOnVector: function () {

		var v1, dot;

		return function ( vector ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( vector ).normalize();

			dot = this.dot( v1 );

			return this.copy( v1 ).multiplyScalar( dot );

		};

	}(),

	projectOnPlane: function () {

		var v1;

		return function ( planeNormal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			v1.copy( this ).projectOnVector( planeNormal );

			return this.sub( v1 );

		}

	}(),

	reflect: function () {

		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length

		var v1;

		return function ( normal ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			return this.sub( v1.copy( normal ).multiplyScalar( 2 * this.dot( normal ) ) );

		}

	}(),

	angleTo: function ( v ) {

		var theta = this.dot( v ) / ( this.length() * v.length() );

		// clamp, to handle numerical problems

		return Math.acos( THREE.Math.clamp( theta, - 1, 1 ) );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x;
		var dy = this.y - v.y;
		var dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	},

	setEulerFromRotationMatrix: function ( m, order ) {

		console.error( 'THREE.Vector3: .setEulerFromRotationMatrix() has been removed. Use Euler.setFromRotationMatrix() instead.' );

	},

	setEulerFromQuaternion: function ( q, order ) {

		console.error( 'THREE.Vector3: .setEulerFromQuaternion() has been removed. Use Euler.setFromQuaternion() instead.' );

	},

	getPositionFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getPositionFromMatrix() has been renamed to .setFromMatrixPosition().' );

		return this.setFromMatrixPosition( m );

	},

	getScaleFromMatrix: function ( m ) {

		console.warn( 'THREE.Vector3: .getScaleFromMatrix() has been renamed to .setFromMatrixScale().' );

		return this.setFromMatrixScale( m );
	},

	getColumnFromMatrix: function ( index, matrix ) {

		console.warn( 'THREE.Vector3: .getColumnFromMatrix() has been renamed to .setFromMatrixColumn().' );

		return this.setFromMatrixColumn( index, matrix );

	},

	setFromMatrixPosition: function ( m ) {

		this.x = m.elements[ 12 ];
		this.y = m.elements[ 13 ];
		this.z = m.elements[ 14 ];

		return this;

	},

	setFromMatrixScale: function ( m ) {

		var sx = this.set( m.elements[ 0 ], m.elements[ 1 ], m.elements[  2 ] ).length();
		var sy = this.set( m.elements[ 4 ], m.elements[ 5 ], m.elements[  6 ] ).length();
		var sz = this.set( m.elements[ 8 ], m.elements[ 9 ], m.elements[ 10 ] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	},

	setFromMatrixColumn: function ( index, matrix ) {
		
		var offset = index * 4;

		var me = matrix.elements;

		this.x = me[ offset ];
		this.y = me[ offset + 1 ];
		this.z = me[ offset + 2 ];

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];
		this.z = attribute.array[ index + 2 ];

		return this;

	},

	clone: function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	}

};

// File:src/math/Vector4.js

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	setW: function ( w ) {

		this.w = w;

		return this;

	},

	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			case 3: this.w = value; break;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw new Error( 'index is out of range: ' + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;
		this.w += s;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'THREE.Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	subScalar: function ( s ) {

		this.x -= s;
		this.y -= s;
		this.z -= s;
		this.w -= s;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	multiplyScalar: function ( scalar ) {

		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		this.w *= scalar;

		return this;

	},

	applyMatrix4: function ( m ) {

		var x = this.x;
		var y = this.y;
		var z = this.z;
		var w = this.w;

		var e = m.elements;

		this.x = e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] * w;
		this.y = e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] * w;
		this.z = e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] * w;
		this.w = e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] * w;

		return this;

	},

	divideScalar: function ( scalar ) {

		if ( scalar !== 0 ) {

			var invScalar = 1 / scalar;

			this.x *= invScalar;
			this.y *= invScalar;
			this.z *= invScalar;
			this.w *= invScalar;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},

	setAxisAngleFromQuaternion: function ( q ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

		// q is assumed to be normalized

		this.w = 2 * Math.acos( q.w );

		var s = Math.sqrt( 1 - q.w * q.w );

		if ( s < 0.0001 ) {

			 this.x = 1;
			 this.y = 0;
			 this.z = 0;

		} else {

			 this.x = q.x / s;
			 this.y = q.y / s;
			 this.z = q.z / s;

		}

		return this;

	},

	setAxisAngleFromRotationMatrix: function ( m ) {

		// http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var angle, x, y, z,		// variables for result
			epsilon = 0.01,		// margin to allow for rounding errors
			epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

			te = m.elements,

			m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ],
			m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ],
			m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		if ( ( Math.abs( m12 - m21 ) < epsilon )
		   && ( Math.abs( m13 - m31 ) < epsilon )
		   && ( Math.abs( m23 - m32 ) < epsilon ) ) {

			// singularity found
			// first check for identity matrix which must have +1 for all terms
			// in leading diagonal and zero in other terms

			if ( ( Math.abs( m12 + m21 ) < epsilon2 )
			   && ( Math.abs( m13 + m31 ) < epsilon2 )
			   && ( Math.abs( m23 + m32 ) < epsilon2 )
			   && ( Math.abs( m11 + m22 + m33 - 3 ) < epsilon2 ) ) {

				// this singularity is identity matrix so angle = 0

				this.set( 1, 0, 0, 0 );

				return this; // zero angle, arbitrary axis

			}

			// otherwise this singularity is angle = 180

			angle = Math.PI;

			var xx = ( m11 + 1 ) / 2;
			var yy = ( m22 + 1 ) / 2;
			var zz = ( m33 + 1 ) / 2;
			var xy = ( m12 + m21 ) / 4;
			var xz = ( m13 + m31 ) / 4;
			var yz = ( m23 + m32 ) / 4;

			if ( ( xx > yy ) && ( xx > zz ) ) { // m11 is the largest diagonal term

				if ( xx < epsilon ) {

					x = 0;
					y = 0.707106781;
					z = 0.707106781;

				} else {

					x = Math.sqrt( xx );
					y = xy / x;
					z = xz / x;

				}

			} else if ( yy > zz ) { // m22 is the largest diagonal term

				if ( yy < epsilon ) {

					x = 0.707106781;
					y = 0;
					z = 0.707106781;

				} else {

					y = Math.sqrt( yy );
					x = xy / y;
					z = yz / y;

				}

			} else { // m33 is the largest diagonal term so base result on this

				if ( zz < epsilon ) {

					x = 0.707106781;
					y = 0.707106781;
					z = 0;

				} else {

					z = Math.sqrt( zz );
					x = xz / z;
					y = yz / z;

				}

			}

			this.set( x, y, z, angle );

			return this; // return 180 deg rotation

		}

		// as we have reached here there are no singularities so we can handle normally

		var s = Math.sqrt( ( m32 - m23 ) * ( m32 - m23 )
						  + ( m13 - m31 ) * ( m13 - m31 )
						  + ( m21 - m12 ) * ( m21 - m12 ) ); // used to normalize

		if ( Math.abs( s ) < 0.001 ) s = 1;

		// prevent divide by zero, should not happen if matrix is orthogonal and should be
		// caught by singularity test above, but I've left it in just in case

		this.x = ( m32 - m23 ) / s;
		this.y = ( m13 - m31 ) / s;
		this.z = ( m21 - m12 ) / s;
		this.w = Math.acos( ( m11 + m22 + m33 - 1 ) / 2 );

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		if ( this.z > v.z ) {

			this.z = v.z;

		}

		if ( this.w > v.w ) {

			this.w = v.w;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		if ( this.z < v.z ) {

			this.z = v.z;

		}

		if ( this.w < v.w ) {

			this.w = v.w;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		if ( this.z < min.z ) {

			this.z = min.z;

		} else if ( this.z > max.z ) {

			this.z = max.z;

		}

		if ( this.w < min.w ) {

			this.w = min.w;

		} else if ( this.w > max.w ) {

			this.w = max.w;

		}

		return this;

	},

	clampScalar: ( function () {

		var min, max;

		return function ( minVal, maxVal ) {

			if ( min === undefined ) {

				min = new THREE.Vector4();
				max = new THREE.Vector4();

			}

			min.set( minVal, minVal, minVal, minVal );
			max.set( maxVal, maxVal, maxVal, maxVal );

			return this.clamp( min, max );

		};

	} )(),

  floor: function () {

		this.x = Math.floor( this.x );
		this.y = Math.floor( this.y );
		this.z = Math.floor( this.z );
		this.w = Math.floor( this.w );

		return this;

  },

  ceil: function () {

		this.x = Math.ceil( this.x );
		this.y = Math.ceil( this.y );
		this.z = Math.ceil( this.z );
		this.w = Math.ceil( this.w );

		return this;

  },

  round: function () {

		this.x = Math.round( this.x );
		this.y = Math.round( this.y );
		this.z = Math.round( this.z );
		this.w = Math.round( this.w );

		return this;

  },

  roundToZero: function () {

		this.x = ( this.x < 0 ) ? Math.ceil( this.x ) : Math.floor( this.x );
		this.y = ( this.y < 0 ) ? Math.ceil( this.y ) : Math.floor( this.y );
		this.z = ( this.z < 0 ) ? Math.ceil( this.z ) : Math.floor( this.z );
		this.w = ( this.w < 0 ) ? Math.ceil( this.w ) : Math.floor( this.w );

		return this;

  },

	negate: function () {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		this.w = - this.w;

		return this;

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z ) + Math.abs( this.w );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );

		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	lerpVectors: function ( v1, v2, alpha ) {

		this.subVectors( v2, v1 ).multiplyScalar( alpha ).add( v1 );

		return this;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) && ( v.w === this.w ) );

	},

	fromArray: function ( array, offset ) {

		if ( offset === undefined ) offset = 0;

		this.x = array[ offset ];
		this.y = array[ offset + 1 ];
		this.z = array[ offset + 2 ];
		this.w = array[ offset + 3 ];

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;
		array[ offset + 3 ] = this.w;

		return array;

	},

	fromAttribute: function ( attribute, index, offset ) {

		if ( offset === undefined ) offset = 0;

		index = index * attribute.itemSize + offset;

		this.x = attribute.array[ index ];
		this.y = attribute.array[ index + 1 ];
		this.z = attribute.array[ index + 2 ];
		this.w = attribute.array[ index + 3 ];

		return this;

	},

	clone: function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	}

};

// File:src/math/Euler.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Euler = function ( x, y, z, order ) {

	this._x = x || 0;
	this._y = y || 0;
	this._z = z || 0;
	this._order = order || THREE.Euler.DefaultOrder;

};

THREE.Euler.RotationOrders = [ 'XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX' ];

THREE.Euler.DefaultOrder = 'XYZ';

THREE.Euler.prototype = {

	constructor: THREE.Euler,

	_x: 0, _y: 0, _z: 0, _order: THREE.Euler.DefaultOrder,

	get x () {

		return this._x;

	},

	set x ( value ) {

		this._x = value;
		this.onChangeCallback();

	},

	get y () {

		return this._y;

	},

	set y ( value ) {

		this._y = value;
		this.onChangeCallback();

	},

	get z () {

		return this._z;

	},

	set z ( value ) {

		this._z = value;
		this.onChangeCallback();

	},

	get order () {

		return this._order;

	},

	set order ( value ) {

		this._order = value;
		this.onChangeCallback();

	},

	set: function ( x, y, z, order ) {

		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order || this._order;

		this.onChangeCallback();

		return this;

	},

	copy: function ( euler ) {

		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;

		this.onChangeCallback();

		return this;

	},

	setFromRotationMatrix: function ( m, order, update ) {

		var clamp = THREE.Math.clamp;

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		var te = m.elements;
		var m11 = te[ 0 ], m12 = te[ 4 ], m13 = te[ 8 ];
		var m21 = te[ 1 ], m22 = te[ 5 ], m23 = te[ 9 ];
		var m31 = te[ 2 ], m32 = te[ 6 ], m33 = te[ 10 ];

		order = order || this._order;

		if ( order === 'XYZ' ) {

			this._y = Math.asin( clamp( m13, - 1, 1 ) );

			if ( Math.abs( m13 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m33 );
				this._z = Math.atan2( - m12, m11 );

			} else {

				this._x = Math.atan2( m32, m22 );
				this._z = 0;

			}

		} else if ( order === 'YXZ' ) {

			this._x = Math.asin( - clamp( m23, - 1, 1 ) );

			if ( Math.abs( m23 ) < 0.99999 ) {

				this._y = Math.atan2( m13, m33 );
				this._z = Math.atan2( m21, m22 );

			} else {

				this._y = Math.atan2( - m31, m11 );
				this._z = 0;

			}

		} else if ( order === 'ZXY' ) {

			this._x = Math.asin( clamp( m32, - 1, 1 ) );

			if ( Math.abs( m32 ) < 0.99999 ) {

				this._y = Math.atan2( - m31, m33 );
				this._z = Math.atan2( - m12, m22 );

			} else {

				this._y = 0;
				this._z = Math.atan2( m21, m11 );

			}

		} else if ( order === 'ZYX' ) {

			this._y = Math.asin( - clamp( m31, - 1, 1 ) );

			if ( Math.abs( m31 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m33 );
				this._z = Math.atan2( m21, m11 );

			} else {

				this._x = 0;
				this._z = Math.atan2( - m12, m22 );

			}

		} else if ( order === 'YZX' ) {

			this._z = Math.asin( clamp( m21, - 1, 1 ) );

			if ( Math.abs( m21 ) < 0.99999 ) {

				this._x = Math.atan2( - m23, m22 );
				this._y = Math.atan2( - m31, m11 );

			} else {

				this._x = 0;
				this._y = Math.atan2( m13, m33 );

			}

		} else if ( order === 'XZY' ) {

			this._z = Math.asin( - clamp( m12, - 1, 1 ) );

			if ( Math.abs( m12 ) < 0.99999 ) {

				this._x = Math.atan2( m32, m22 );
				this._y = Math.atan2( m13, m11 );

			} else {

				this._x = Math.atan2( - m23, m33 );
				this._y = 0;

			}

		} else {

			console.warn( 'THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order )

		}

		this._order = order;

		if ( update !== false ) this.onChangeCallback();

		return this;

	},

	setFromQuaternion: function () {

		var matrix;

		return function ( q, order, update ) {

			if ( matrix === undefined ) matrix = new THREE.Matrix4();
			matrix.makeRotationFromQuaternion( q );
			this.setFromRotationMatrix( matrix, order, update );

			return this;

		};

	}(),

	setFromVector3: function ( v, order ) {

		return this.set( v.x, v.y, v.z, order || this._order );

	},

	reorder: function () {

		// WARNING: this discards revolution information -bhouston

		var q = new THREE.Quaternion();

		return function ( newOrder ) {

			q.setFromEuler( this );
			this.setFromQuaternion( q, newOrder );

		};

	}(),

	equals: function ( euler ) {

		return ( euler._x === this._x ) && ( euler._y === this._y ) && ( euler._z === this._z ) && ( euler._order === this._order );

	},

	fromArray: function ( array ) {

		this._x = array[ 0 ];
		this._y = array[ 1 ];
		this._z = array[ 2 ];
		if ( array[ 3 ] !== undefined ) this._order = array[ 3 ];

		this.onChangeCallback();

		return this;

	},

	toArray: function ( array, offset ) {

		if ( array === undefined ) array = [];
		if ( offset === undefined ) offset = 0;

		array[ offset ] = this._x;
		array[ offset + 1 ] = this._y;
		array[ offset + 2 ] = this._z;
		array[ offset + 3 ] = this._order;

		return array;
	},

	toVector3: function ( optionalResult ) {

		if ( optionalResult ) {

			return optionalResult.set( this._x, this._y, this._z );

		} else {

			return new THREE.Vector3( this._x, this._y, this._z );

		}

	},

	onChange: function ( callback ) {

		this.onChangeCallback = callback;

		return this;

	},

	onChangeCallback: function () {},

	clone: function () {

		return new THREE.Euler( this._x, this._y, this._z, this._order );

	}

};

// File:src/math/Line3.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Line3 = function ( start, end ) {

	this.start = ( start !== undefined ) ? start : new THREE.Vector3();
	this.end = ( end !== undefined ) ? end : new THREE.Vector3();

};

THREE.Line3.prototype = {

	constructor: THREE.Line3,

	set: function ( start, end ) {

		this.start.copy( start );
		this.end.copy( end );

		return this;

	},

	copy: function ( line ) {

		this.start.copy( line.start );
		this.end.copy( line.end );

		return this;

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.start, this.end ).multiplyScalar( 0.5 );

	},

	delta: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.end, this.start );

	},

	distanceSq: function () {

		return this.start.distanceToSquared( this.end );

	},

	distance: function () {

		return this.start.distanceTo( this.end );

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	closestPointToPointParameter: function () {

		var startP = new THREE.Vector3();
		var startEnd = new THREE.Vector3();

		return function ( point, clampToLine ) {

			startP.subVectors( point, this.start );
			startEnd.subVectors( this.end, this.start );

			var startEnd2 = startEnd.dot( startEnd );
			var startEnd_startP = startEnd.dot( startP );

			var t = startEnd_startP / startEnd2;

			if ( clampToLine ) {

				t = THREE.Math.clamp( t, 0, 1 );

			}

			return t;

		};

	}(),

	closestPointToPoint: function ( point, clampToLine, optionalTarget ) {

		var t = this.closestPointToPointParameter( point, clampToLine );

		var result = optionalTarget || new THREE.Vector3();

		return this.delta( result ).multiplyScalar( t ).add( this.start );

	},

	applyMatrix4: function ( matrix ) {

		this.start.applyMatrix4( matrix );
		this.end.applyMatrix4( matrix );

		return this;

	},

	equals: function ( line ) {

		return line.start.equals( this.start ) && line.end.equals( this.end );

	},

	clone: function () {

		return new THREE.Line3().copy( this );

	}

};

// File:src/math/Box2.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Box2 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector2( Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector2( - Infinity, - Infinity );

};

THREE.Box2.prototype = {

	constructor: THREE.Box2,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] )

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector2();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );
			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = Infinity;
		this.max.x = this.max.y = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;
	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;
	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;
	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
		     ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector2();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector2();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector2();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box2().copy( this );

	}

};

// File:src/math/Box3.js

/**
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Box3 = function ( min, max ) {

	this.min = ( min !== undefined ) ? min : new THREE.Vector3( Infinity, Infinity, Infinity );
	this.max = ( max !== undefined ) ? max : new THREE.Vector3( - Infinity, - Infinity, - Infinity );

};

THREE.Box3.prototype = {

	constructor: THREE.Box3,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] );

		}

		return this;

	},

	setFromCenterAndSize: function () {

		var v1 = new THREE.Vector3();

		return function ( center, size ) {

			var halfSize = v1.copy( size ).multiplyScalar( 0.5 );

			this.min.copy( center ).sub( halfSize );
			this.max.copy( center ).add( halfSize );

			return this;

		};

	}(),

	setFromObject: function () {

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and childrens', world transforms

		var v1 = new THREE.Vector3();

		return function ( object ) {

			var scope = this;

			object.updateMatrixWorld( true );

			this.makeEmpty();

			object.traverse( function ( node ) {

				var geometry = node.geometry;

				if ( geometry !== undefined ) {

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;

						for ( var i = 0, il = vertices.length; i < il; i ++ ) {

							v1.copy( vertices[ i ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					} else if ( geometry instanceof THREE.BufferGeometry && geometry.attributes[ 'position' ] !== undefined ) {

						var positions = geometry.attributes[ 'position' ].array;

						for ( var i = 0, il = positions.length; i < il; i += 3 ) {

							v1.set( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

							v1.applyMatrix4( node.matrixWorld );

							scope.expandByPoint( v1 );

						}

					}

				}

			} );

			return this;

		};

	}(),

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = this.min.z = Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	},

	empty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	},

	center: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	size: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	containsPoint: function ( point ) {

		if ( point.x < this.min.x || point.x > this.max.x ||
		     point.y < this.min.y || point.y > this.max.y ||
		     point.z < this.min.z || point.z > this.max.z ) {

			return false;

		}

		return true;

	},

	containsBox: function ( box ) {

		if ( ( this.min.x <= box.min.x ) && ( box.max.x <= this.max.x ) &&
			 ( this.min.y <= box.min.y ) && ( box.max.y <= this.max.y ) &&
			 ( this.min.z <= box.min.z ) && ( box.max.z <= this.max.z ) ) {

			return true;

		}

		return false;

	},

	getParameter: function ( point, optionalTarget ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		var result = optionalTarget || new THREE.Vector3();

		return result.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y ),
			( point.z - this.min.z ) / ( this.max.z - this.min.z )
		);

	},

	isIntersectionBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.

		if ( box.max.x < this.min.x || box.min.x > this.max.x ||
		     box.max.y < this.min.y || box.min.y > this.max.y ||
		     box.max.z < this.min.z || box.min.z > this.max.z ) {

			return false;

		}

		return true;

	},

	clampPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var clampedPoint = v1.copy( point ).clamp( this.min, this.max );
			return clampedPoint.sub( point ).length();

		};

	}(),

	getBoundingSphere: function () {

		var v1 = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Sphere();

			result.center = this.center();
			result.radius = this.size( v1 ).length() * 0.5;

			return result;

		};

	}(),

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	applyMatrix4: function () {

		var points = [
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3(),
			new THREE.Vector3()
		];

		return function ( matrix ) {

			// NOTE: I am using a binary pattern to specify all 2^3 combinations below
			points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
			points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
			points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
			points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
			points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
			points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
			points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
			points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix );  // 111

			this.makeEmpty();
			this.setFromPoints( points );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	},

	clone: function () {

		return new THREE.Box3().copy( this );

	}

};

// File:src/math/Matrix3.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://exocortex.com
 */

THREE.Matrix3 = function () {

	this.elements = new Float32Array( [

		1, 0, 0,
		0, 1, 0,
		0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix3: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
		te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
		te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0,
			0, 1, 0,
			0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		var me = m.elements;

		this.set(

			me[ 0 ], me[ 3 ], me[ 6 ],
			me[ 1 ], me[ 4 ], me[ 7 ],
			me[ 2 ], me[ 5 ], me[ 8 ]

		);

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.' );
		return vector.applyMatrix3( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix3: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1;

		return function ( array, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

				v1.fromArray( array, j );
				v1.applyMatrix3( this );
				v1.toArray( array, j );

			}

			return array;

		};

	}(),

	applyToBuffer: function () {

		var v1;

		return function applyToBuffer( buffer, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = buffer.length / buffer.itemSize;

			for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

				v1.x = buffer.getX( j );
				v1.y = buffer.getY( j );
				v1.z = buffer.getZ( j );

				v1.applyMatrix3( this );

				buffer.setXYZ( v1.x, v1.y, v1.z );

			}

			return buffer;

		};

	}(),

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
		te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
		te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

		return this;

	},

	determinant: function () {

		var te = this.elements;

		var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
			d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
			g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

		return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

	},

	getInverse: function ( matrix, throwOnInvertible ) {

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var me = matrix.elements;
		var te = this.elements;

		te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
		te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
		te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
		te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
		te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
		te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
		te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
		te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
		te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

		var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

		// no inverse

		if ( det === 0 ) {

			var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;

		}

		this.multiplyScalar( 1.0 / det );

		return this;

	},

	transpose: function () {

		var tmp, m = this.elements;

		tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
		tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
		tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];

		array[ offset + 3 ] = te[ 3 ];
		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];

		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];
		array[ offset + 8 ]  = te[ 8 ];

		return array;

	},

	getNormalMatrix: function ( m ) {

		// input: THREE.Matrix4

		this.getInverse( m ).transpose();

		return this;

	},

	transposeIntoArray: function ( r ) {

		var m = this.elements;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ],
			te[ 3 ], te[ 4 ], te[ 5 ],
			te[ 6 ], te[ 7 ], te[ 8 ]
		];

	},

	clone: function () {

		return new THREE.Matrix3().fromArray( this.elements );

	}

};

// File:src/math/Matrix4.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 * @author bhouston / http://exocortex.com
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.Matrix4 = function () {

	this.elements = new Float32Array( [

		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1

	] );

	if ( arguments.length > 0 ) {

		console.error( 'THREE.Matrix4: the constructor no longer reads arguments. use .set() instead.' );

	}

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

		var te = this.elements;

		te[ 0 ] = n11; te[ 4 ] = n12; te[ 8 ] = n13; te[ 12 ] = n14;
		te[ 1 ] = n21; te[ 5 ] = n22; te[ 9 ] = n23; te[ 13 ] = n24;
		te[ 2 ] = n31; te[ 6 ] = n32; te[ 10 ] = n33; te[ 14 ] = n34;
		te[ 3 ] = n41; te[ 7 ] = n42; te[ 11 ] = n43; te[ 15 ] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {

		this.elements.set( m.elements );

		return this;

	},

	extractPosition: function ( m ) {

		console.warn( 'THREE.Matrix4: .extractPosition() has been renamed to .copyPosition().' );
		return this.copyPosition( m );

	},

	copyPosition: function ( m ) {

		var te = this.elements;
		var me = m.elements;

		te[ 12 ] = me[ 12 ];
		te[ 13 ] = me[ 13 ];
		te[ 14 ] = me[ 14 ];

		return this;

	},

	extractBasis: function ( xAxis, yAxis, zAxis ) {

		var te = this.elements;

		xAxis.set( te[ 0 ], te[ 1 ], te[ 2 ] );
		yAxis.set( te[ 4 ], te[ 5 ], te[ 6 ] );
		zAxis.set( te[ 8 ], te[ 9 ], te[ 10 ] );

		return this;

	},

	makeBasis: function ( xAxis, yAxis, zAxis ) {

		this.set(
			xAxis.x, yAxis.x, zAxis.x, 0,
			xAxis.y, yAxis.y, zAxis.y, 0,
			xAxis.z, yAxis.z, zAxis.z, 0,
			0,       0,       0,       1
		);

		return this;

	},

	extractRotation: function () {

		var v1;

		return function ( m ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();

			var te = this.elements;
			var me = m.elements;

			var scaleX = 1 / v1.set( me[ 0 ], me[ 1 ], me[ 2 ] ).length();
			var scaleY = 1 / v1.set( me[ 4 ], me[ 5 ], me[ 6 ] ).length();
			var scaleZ = 1 / v1.set( me[ 8 ], me[ 9 ], me[ 10 ] ).length();

			te[ 0 ] = me[ 0 ] * scaleX;
			te[ 1 ] = me[ 1 ] * scaleX;
			te[ 2 ] = me[ 2 ] * scaleX;

			te[ 4 ] = me[ 4 ] * scaleY;
			te[ 5 ] = me[ 5 ] * scaleY;
			te[ 6 ] = me[ 6 ] * scaleY;

			te[ 8 ] = me[ 8 ] * scaleZ;
			te[ 9 ] = me[ 9 ] * scaleZ;
			te[ 10 ] = me[ 10 ] * scaleZ;

			return this;

		};

	}(),

	makeRotationFromEuler: function ( euler ) {

		if ( euler instanceof THREE.Euler === false ) {

			console.error( 'THREE.Matrix: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.' );

		}

		var te = this.elements;

		var x = euler.x, y = euler.y, z = euler.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		if ( euler.order === 'XYZ' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = - c * f;
			te[ 8 ] = d;

			te[ 1 ] = af + be * d;
			te[ 5 ] = ae - bf * d;
			te[ 9 ] = - b * c;

			te[ 2 ] = bf - ae * d;
			te[ 6 ] = be + af * d;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YXZ' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce + df * b;
			te[ 4 ] = de * b - cf;
			te[ 8 ] = a * d;

			te[ 1 ] = a * f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b;

			te[ 2 ] = cf * b - de;
			te[ 6 ] = df + ce * b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZXY' ) {

			var ce = c * e, cf = c * f, de = d * e, df = d * f;

			te[ 0 ] = ce - df * b;
			te[ 4 ] = - a * f;
			te[ 8 ] = de + cf * b;

			te[ 1 ] = cf + de * b;
			te[ 5 ] = a * e;
			te[ 9 ] = df - ce * b;

			te[ 2 ] = - a * d;
			te[ 6 ] = b;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'ZYX' ) {

			var ae = a * e, af = a * f, be = b * e, bf = b * f;

			te[ 0 ] = c * e;
			te[ 4 ] = be * d - af;
			te[ 8 ] = ae * d + bf;

			te[ 1 ] = c * f;
			te[ 5 ] = bf * d + ae;
			te[ 9 ] = af * d - be;

			te[ 2 ] = - d;
			te[ 6 ] = b * c;
			te[ 10 ] = a * c;

		} else if ( euler.order === 'YZX' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = bd - ac * f;
			te[ 8 ] = bc * f + ad;

			te[ 1 ] = f;
			te[ 5 ] = a * e;
			te[ 9 ] = - b * e;

			te[ 2 ] = - d * e;
			te[ 6 ] = ad * f + bc;
			te[ 10 ] = ac - bd * f;

		} else if ( euler.order === 'XZY' ) {

			var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

			te[ 0 ] = c * e;
			te[ 4 ] = - f;
			te[ 8 ] = d * e;

			te[ 1 ] = ac * f + bd;
			te[ 5 ] = a * e;
			te[ 9 ] = ad * f - bc;

			te[ 2 ] = bc * f - ad;
			te[ 6 ] = b * e;
			te[ 10 ] = bd * f + ac;

		}

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	setRotationFromQuaternion: function ( q ) {

		console.warn( 'THREE.Matrix4: .setRotationFromQuaternion() has been renamed to .makeRotationFromQuaternion().' );

		return this.makeRotationFromQuaternion( q );

	},

	makeRotationFromQuaternion: function ( q ) {

		var te = this.elements;

		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[ 0 ] = 1 - ( yy + zz );
		te[ 4 ] = xy - wz;
		te[ 8 ] = xz + wy;

		te[ 1 ] = xy + wz;
		te[ 5 ] = 1 - ( xx + zz );
		te[ 9 ] = yz - wx;

		te[ 2 ] = xz - wy;
		te[ 6 ] = yz + wx;
		te[ 10 ] = 1 - ( xx + yy );

		// last column
		te[ 3 ] = 0;
		te[ 7 ] = 0;
		te[ 11 ] = 0;

		// bottom row
		te[ 12 ] = 0;
		te[ 13 ] = 0;
		te[ 14 ] = 0;
		te[ 15 ] = 1;

		return this;

	},

	lookAt: function () {

		var x, y, z;

		return function ( eye, target, up ) {

			if ( x === undefined ) x = new THREE.Vector3();
			if ( y === undefined ) y = new THREE.Vector3();
			if ( z === undefined ) z = new THREE.Vector3();

			var te = this.elements;

			z.subVectors( eye, target ).normalize();

			if ( z.length() === 0 ) {

				z.z = 1;

			}

			x.crossVectors( up, z ).normalize();

			if ( x.length() === 0 ) {

				z.x += 0.0001;
				x.crossVectors( up, z ).normalize();

			}

			y.crossVectors( z, x );


			te[ 0 ] = x.x; te[ 4 ] = y.x; te[ 8 ] = z.x;
			te[ 1 ] = x.y; te[ 5 ] = y.y; te[ 9 ] = z.y;
			te[ 2 ] = x.z; te[ 6 ] = y.z; te[ 10 ] = z.z;

			return this;

		};

	}(),

	multiply: function ( m, n ) {

		if ( n !== undefined ) {

			console.warn( 'THREE.Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.' );
			return this.multiplyMatrices( m, n );

		}

		return this.multiplyMatrices( this, m );

	},

	multiplyMatrices: function ( a, b ) {

		var ae = a.elements;
		var be = b.elements;
		var te = this.elements;

		var a11 = ae[ 0 ], a12 = ae[ 4 ], a13 = ae[ 8 ], a14 = ae[ 12 ];
		var a21 = ae[ 1 ], a22 = ae[ 5 ], a23 = ae[ 9 ], a24 = ae[ 13 ];
		var a31 = ae[ 2 ], a32 = ae[ 6 ], a33 = ae[ 10 ], a34 = ae[ 14 ];
		var a41 = ae[ 3 ], a42 = ae[ 7 ], a43 = ae[ 11 ], a44 = ae[ 15 ];

		var b11 = be[ 0 ], b12 = be[ 4 ], b13 = be[ 8 ], b14 = be[ 12 ];
		var b21 = be[ 1 ], b22 = be[ 5 ], b23 = be[ 9 ], b24 = be[ 13 ];
		var b31 = be[ 2 ], b32 = be[ 6 ], b33 = be[ 10 ], b34 = be[ 14 ];
		var b41 = be[ 3 ], b42 = be[ 7 ], b43 = be[ 11 ], b44 = be[ 15 ];

		te[ 0 ] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[ 4 ] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[ 8 ] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[ 12 ] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[ 1 ] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[ 5 ] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[ 9 ] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[ 13 ] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

		te[ 2 ] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[ 6 ] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[ 10 ] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[ 14 ] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[ 3 ] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[ 7 ] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[ 11 ] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[ 15 ] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplyToArray: function ( a, b, r ) {

		var te = this.elements;

		this.multiplyMatrices( a, b );

		r[ 0 ] = te[ 0 ]; r[ 1 ] = te[ 1 ]; r[ 2 ] = te[ 2 ]; r[ 3 ] = te[ 3 ];
		r[ 4 ] = te[ 4 ]; r[ 5 ] = te[ 5 ]; r[ 6 ] = te[ 6 ]; r[ 7 ] = te[ 7 ];
		r[ 8 ]  = te[ 8 ]; r[ 9 ]  = te[ 9 ]; r[ 10 ] = te[ 10 ]; r[ 11 ] = te[ 11 ];
		r[ 12 ] = te[ 12 ]; r[ 13 ] = te[ 13 ]; r[ 14 ] = te[ 14 ]; r[ 15 ] = te[ 15 ];

		return this;

	},

	multiplyScalar: function ( s ) {

		var te = this.elements;

		te[ 0 ] *= s; te[ 4 ] *= s; te[ 8 ] *= s; te[ 12 ] *= s;
		te[ 1 ] *= s; te[ 5 ] *= s; te[ 9 ] *= s; te[ 13 ] *= s;
		te[ 2 ] *= s; te[ 6 ] *= s; te[ 10 ] *= s; te[ 14 ] *= s;
		te[ 3 ] *= s; te[ 7 ] *= s; te[ 11 ] *= s; te[ 15 ] *= s;

		return this;

	},

	multiplyVector3: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.' );
		return vector.applyProjection( this );

	},

	multiplyVector4: function ( vector ) {

		console.warn( 'THREE.Matrix4: .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	multiplyVector3Array: function ( a ) {

		console.warn( 'THREE.Matrix4: .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.' );
		return this.applyToVector3Array( a );

	},

	applyToVector3Array: function () {

		var v1;

		return function ( array, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = array.length;

			for ( var i = 0, j = offset; i < length; i += 3, j += 3 ) {

				v1.fromArray( array, j );
				v1.applyMatrix4( this );
				v1.toArray( array, j );

			}

			return array;

		};

	}(),

	applyToBuffer: function () {

		var v1;

		return function applyToBuffer( buffer, offset, length ) {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			if ( offset === undefined ) offset = 0;
			if ( length === undefined ) length = buffer.length / buffer.itemSize;

			for ( var i = 0, j = offset; i < length; i ++, j ++ ) {

				v1.x = buffer.getX( j );
				v1.y = buffer.getY( j );
				v1.z = buffer.getZ( j );

				v1.applyMatrix4( this );

				buffer.setXYZ( v1.x, v1.y, v1.z );

			}

			return buffer;

		};

	}(),

	rotateAxis: function ( v ) {

		console.warn( 'THREE.Matrix4: .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.' );

		v.transformDirection( this );

	},

	crossVector: function ( vector ) {

		console.warn( 'THREE.Matrix4: .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.' );
		return vector.applyMatrix4( this );

	},

	determinant: function () {

		var te = this.elements;

		var n11 = te[ 0 ], n12 = te[ 4 ], n13 = te[ 8 ], n14 = te[ 12 ];
		var n21 = te[ 1 ], n22 = te[ 5 ], n23 = te[ 9 ], n24 = te[ 13 ];
		var n31 = te[ 2 ], n32 = te[ 6 ], n33 = te[ 10 ], n34 = te[ 14 ];
		var n41 = te[ 3 ], n42 = te[ 7 ], n43 = te[ 11 ], n44 = te[ 15 ];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n41 * (
				+ n14 * n23 * n32
				 - n13 * n24 * n32
				 - n14 * n22 * n33
				 + n12 * n24 * n33
				 + n13 * n22 * n34
				 - n12 * n23 * n34
			) +
			n42 * (
				+ n11 * n23 * n34
				 - n11 * n24 * n33
				 + n14 * n21 * n33
				 - n13 * n21 * n34
				 + n13 * n24 * n31
				 - n14 * n23 * n31
			) +
			n43 * (
				+ n11 * n24 * n32
				 - n11 * n22 * n34
				 - n14 * n21 * n32
				 + n12 * n21 * n34
				 + n14 * n22 * n31
				 - n12 * n24 * n31
			) +
			n44 * (
				- n13 * n22 * n31
				 - n11 * n23 * n32
				 + n11 * n22 * n33
				 + n13 * n21 * n32
				 - n12 * n21 * n33
				 + n12 * n23 * n31
			)

		);

	},

	transpose: function () {

		var te = this.elements;
		var tmp;

		tmp = te[ 1 ]; te[ 1 ] = te[ 4 ]; te[ 4 ] = tmp;
		tmp = te[ 2 ]; te[ 2 ] = te[ 8 ]; te[ 8 ] = tmp;
		tmp = te[ 6 ]; te[ 6 ] = te[ 9 ]; te[ 9 ] = tmp;

		tmp = te[ 3 ]; te[ 3 ] = te[ 12 ]; te[ 12 ] = tmp;
		tmp = te[ 7 ]; te[ 7 ] = te[ 13 ]; te[ 13 ] = tmp;
		tmp = te[ 11 ]; te[ 11 ] = te[ 14 ]; te[ 14 ] = tmp;

		return this;

	},

	flattenToArrayOffset: function ( array, offset ) {

		var te = this.elements;

		array[ offset     ] = te[ 0 ];
		array[ offset + 1 ] = te[ 1 ];
		array[ offset + 2 ] = te[ 2 ];
		array[ offset + 3 ] = te[ 3 ];

		array[ offset + 4 ] = te[ 4 ];
		array[ offset + 5 ] = te[ 5 ];
		array[ offset + 6 ] = te[ 6 ];
		array[ offset + 7 ] = te[ 7 ];

		array[ offset + 8 ]  = te[ 8 ];
		array[ offset + 9 ]  = te[ 9 ];
		array[ offset + 10 ] = te[ 10 ];
		array[ offset + 11 ] = te[ 11 ];

		array[ offset + 12 ] = te[ 12 ];
		array[ offset + 13 ] = te[ 13 ];
		array[ offset + 14 ] = te[ 14 ];
		array[ offset + 15 ] = te[ 15 ];

		return array;

	},

	getPosition: function () {

		var v1;

		return function () {

			if ( v1 === undefined ) v1 = new THREE.Vector3();
			console.warn( 'THREE.Matrix4: .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.' );

			var te = this.elements;
			return v1.set( te[ 12 ], te[ 13 ], te[ 14 ] );

		};

	}(),

	setPosition: function ( v ) {

		var te = this.elements;

		te[ 12 ] = v.x;
		te[ 13 ] = v.y;
		te[ 14 ] = v.z;

		return this;

	},

	getInverse: function ( m, throwOnInvertible ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
		var te = this.elements;
		var me = m.elements;

		var n11 = me[ 0 ], n12 = me[ 4 ], n13 = me[ 8 ], n14 = me[ 12 ];
		var n21 = me[ 1 ], n22 = me[ 5 ], n23 = me[ 9 ], n24 = me[ 13 ];
		var n31 = me[ 2 ], n32 = me[ 6 ], n33 = me[ 10 ], n34 = me[ 14 ];
		var n41 = me[ 3 ], n42 = me[ 7 ], n43 = me[ 11 ], n44 = me[ 15 ];

		te[ 0 ] = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
		te[ 4 ] = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
		te[ 8 ] = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
		te[ 12 ] = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
		te[ 1 ] = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
		te[ 5 ] = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
		te[ 9 ] = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
		te[ 13 ] = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
		te[ 2 ] = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
		te[ 6 ] = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
		te[ 10 ] = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
		te[ 14 ] = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
		te[ 3 ] = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
		te[ 7 ] = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
		te[ 11 ] = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
		te[ 15 ] = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;

		var det = n11 * te[ 0 ] + n21 * te[ 4 ] + n31 * te[ 8 ] + n41 * te[ 12 ];

		if ( det === 0 ) {

			var msg = "THREE.Matrix4.getInverse(): can't invert matrix, determinant is 0";

			if ( throwOnInvertible || false ) {

				throw new Error( msg );

			} else {

				console.warn( msg );

			}

			this.identity();

			return this;

		}

		this.multiplyScalar( 1 / det );

		return this;

	},

	translate: function ( v ) {

		console.error( 'THREE.Matrix4: .translate() has been removed.' );

	},

	rotateX: function ( angle ) {

		console.error( 'THREE.Matrix4: .rotateX() has been removed.' );

	},

	rotateY: function ( angle ) {

		console.error( 'THREE.Matrix4: .rotateY() has been removed.' );

	},

	rotateZ: function ( angle ) {

		console.error( 'THREE.Matrix4: .rotateZ() has been removed.' );

	},

	rotateByAxis: function ( axis, angle ) {

		console.error( 'THREE.Matrix4: .rotateByAxis() has been removed.' );

	},

	scale: function ( v ) {

		var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[ 0 ] *= x; te[ 4 ] *= y; te[ 8 ] *= z;
		te[ 1 ] *= x; te[ 5 ] *= y; te[ 9 ] *= z;
		te[ 2 ] *= x; te[ 6 ] *= y; te[ 10 ] *= z;
		te[ 3 ] *= x; te[ 7 ] *= y; te[ 11 ] *= z;

		return this;

	},

	getMaxScaleOnAxis: function () {

		var te = this.elements;

		var scaleXSq = te[ 0 ] * te[ 0 ] + te[ 1 ] * te[ 1 ] + te[ 2 ] * te[ 2 ];
		var scaleYSq = te[ 4 ] * te[ 4 ] + te[ 5 ] * te[ 5 ] + te[ 6 ] * te[ 6 ];
		var scaleZSq = te[ 8 ] * te[ 8 ] + te[ 9 ] * te[ 9 ] + te[ 10 ] * te[ 10 ];

		return Math.sqrt( Math.max( scaleXSq, Math.max( scaleYSq, scaleZSq ) ) );

	},

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, - s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			- s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, - s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

			tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	compose: function ( position, quaternion, scale ) {

		this.makeRotationFromQuaternion( quaternion );
		this.scale( scale );
		this.setPosition( position );

		return this;

	},

	decompose: function () {

		var vector, matrix;

		return function ( position, quaternion, scale ) {

			if ( vector === undefined ) vector = new THREE.Vector3();
			if ( matrix === undefined ) matrix = new THREE.Matrix4();

			var te = this.elements;

			var sx = vector.set( te[ 0 ], te[ 1 ], te[ 2 ] ).length();
			var sy = vector.set( te[ 4 ], te[ 5 ], te[ 6 ] ).length();
			var sz = vector.set( te[ 8 ], te[ 9 ], te[ 10 ] ).length();

			// if determine is negative, we need to invert one scale
			var det = this.determinant();
			if ( det < 0 ) {

				sx = - sx;

			}

			position.x = te[ 12 ];
			position.y = te[ 13 ];
			position.z = te[ 14 ];

			// scale the rotation part

			matrix.elements.set( this.elements ); // at this point matrix is incomplete so we can't use .copy()

			var invSX = 1 / sx;
			var invSY = 1 / sy;
			var invSZ = 1 / sz;

			matrix.elements[ 0 ] *= invSX;
			matrix.elements[ 1 ] *= invSX;
			matrix.elements[ 2 ] *= invSX;

			matrix.elements[ 4 ] *= invSY;
			matrix.elements[ 5 ] *= invSY;
			matrix.elements[ 6 ] *= invSY;

			matrix.elements[ 8 ] *= invSZ;
			matrix.elements[ 9 ] *= invSZ;
			matrix.elements[ 10 ] *= invSZ;

			quaternion.setFromRotationMatrix( matrix );

			scale.x = sx;
			scale.y = sy;
			scale.z = sz;

			return this;

		};

	}(),

	makeFrustum: function ( left, right, bottom, top, near, far ) {

		var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[ 0 ] = x;	te[ 4 ] = 0;	te[ 8 ] = a;	te[ 12 ] = 0;
		te[ 1 ] = 0;	te[ 5 ] = y;	te[ 9 ] = b;	te[ 13 ] = 0;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = c;	te[ 14 ] = d;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = - 1;	te[ 15 ] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( THREE.Math.degToRad( fov * 0.5 ) );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {

		var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[ 0 ] = 2 / w;	te[ 4 ] = 0;	te[ 8 ] = 0;	te[ 12 ] = - x;
		te[ 1 ] = 0;	te[ 5 ] = 2 / h;	te[ 9 ] = 0;	te[ 13 ] = - y;
		te[ 2 ] = 0;	te[ 6 ] = 0;	te[ 10 ] = - 2 / p;	te[ 14 ] = - z;
		te[ 3 ] = 0;	te[ 7 ] = 0;	te[ 11 ] = 0;	te[ 15 ] = 1;

		return this;

	},

	fromArray: function ( array ) {

		this.elements.set( array );

		return this;

	},

	toArray: function () {

		var te = this.elements;

		return [
			te[ 0 ], te[ 1 ], te[ 2 ], te[ 3 ],
			te[ 4 ], te[ 5 ], te[ 6 ], te[ 7 ],
			te[ 8 ], te[ 9 ], te[ 10 ], te[ 11 ],
			te[ 12 ], te[ 13 ], te[ 14 ], te[ 15 ]
		];

	},

	clone: function () {

		return new THREE.Matrix4().fromArray( this.elements );

	}

};

// File:src/math/Ray.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = ( origin !== undefined ) ? origin : new THREE.Vector3();
	this.direction = ( direction !== undefined ) ? direction : new THREE.Vector3();

};

THREE.Ray.prototype = {

	constructor: THREE.Ray,

	set: function ( origin, direction ) {

		this.origin.copy( origin );
		this.direction.copy( direction );

		return this;

	},

	copy: function ( ray ) {

		this.origin.copy( ray.origin );
		this.direction.copy( ray.direction );

		return this;

	},

	at: function ( t, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		return result.copy( this.direction ).multiplyScalar( t ).add( this.origin );

	},

	recast: function () {

		var v1 = new THREE.Vector3();

		return function ( t ) {

			this.origin.copy( this.at( t, v1 ) );

			return this;

		};

	}(),

	closestPointToPoint: function ( point, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		result.subVectors( point, this.origin );
		var directionDistance = result.dot( this.direction );

		if ( directionDistance < 0 ) {

			return result.copy( this.origin );

		}

		return result.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

	},

	distanceToPoint: function () {

		var v1 = new THREE.Vector3();

		return function ( point ) {

			var directionDistance = v1.subVectors( point, this.origin ).dot( this.direction );

			// point behind the ray

			if ( directionDistance < 0 ) {

				return this.origin.distanceTo( point );

			}

			v1.copy( this.direction ).multiplyScalar( directionDistance ).add( this.origin );

			return v1.distanceTo( point );

		};

	}(),

	distanceSqToSegment: function () {

		var segCenter = new THREE.Vector3();
		var segDir = new THREE.Vector3();
		var diff = new THREE.Vector3();

		return function ( v0, v1, optionalPointOnRay, optionalPointOnSegment ) {

			// from http://www.geometrictools.com/LibMathematics/Distance/Wm5DistRay3Segment3.cpp
			// It returns the min distance between the ray and the segment
			// defined by v0 and v1
			// It can also set two optional targets :
			// - The closest point on the ray
			// - The closest point on the segment

			segCenter.copy( v0 ).add( v1 ).multiplyScalar( 0.5 );
			segDir.copy( v1 ).sub( v0 ).normalize();
			diff.copy( this.origin ).sub( segCenter );

			var segExtent = v0.distanceTo( v1 ) * 0.5;
			var a01 = - this.direction.dot( segDir );
			var b0 = diff.dot( this.direction );
			var b1 = - diff.dot( segDir );
			var c = diff.lengthSq();
			var det = Math.abs( 1 - a01 * a01 );
			var s0, s1, sqrDist, extDet;

			if ( det > 0 ) {

				// The ray and segment are not parallel.

				s0 = a01 * b1 - b0;
				s1 = a01 * b0 - b1;
				extDet = segExtent * det;

				if ( s0 >= 0 ) {

					if ( s1 >= - extDet ) {

						if ( s1 <= extDet ) {

							// region 0
							// Minimum at interior points of ray and segment.

							var invDet = 1 / det;
							s0 *= invDet;
							s1 *= invDet;
							sqrDist = s0 * ( s0 + a01 * s1 + 2 * b0 ) + s1 * ( a01 * s0 + s1 + 2 * b1 ) + c;

						} else {

							// region 1

							s1 = segExtent;
							s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
							sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

						}

					} else {

						// region 5

						s1 = - segExtent;
						s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				} else {

					if ( s1 <= - extDet ) {

						// region 4

						s0 = Math.max( 0, - ( - a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? - segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					} else if ( s1 <= extDet ) {

						// region 3

						s0 = 0;
						s1 = Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = s1 * ( s1 + 2 * b1 ) + c;

					} else {

						// region 2

						s0 = Math.max( 0, - ( a01 * segExtent + b0 ) );
						s1 = ( s0 > 0 ) ? segExtent : Math.min( Math.max( - segExtent, - b1 ), segExtent );
						sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

					}

				}

			} else {

				// Ray and segment are parallel.

				s1 = ( a01 > 0 ) ? - segExtent : segExtent;
				s0 = Math.max( 0, - ( a01 * s1 + b0 ) );
				sqrDist = - s0 * s0 + s1 * ( s1 + 2 * b1 ) + c;

			}

			if ( optionalPointOnRay ) {

				optionalPointOnRay.copy( this.direction ).multiplyScalar( s0 ).add( this.origin );

			}

			if ( optionalPointOnSegment ) {

				optionalPointOnSegment.copy( segDir ).multiplyScalar( s1 ).add( segCenter );

			}

			return sqrDist;

		};

	}(),


	isIntersectionSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) <= sphere.radius;

	},

	intersectSphere: function () {

		// from http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-sphere-intersection/

		var v1 = new THREE.Vector3();

		return function ( sphere, optionalTarget ) {

			v1.subVectors( sphere.center, this.origin );

			var tca = v1.dot( this.direction );

			var d2 = v1.dot( v1 ) - tca * tca;

			var radius2 = sphere.radius * sphere.radius;

			if ( d2 > radius2 ) return null;

			var thc = Math.sqrt( radius2 - d2 );

			// t0 = first intersect point - entrance on front of sphere
			var t0 = tca - thc;

			// t1 = second intersect point - exit point on back of sphere
			var t1 = tca + thc;

			// test to see if both t0 and t1 are behind the ray - if so, return null
			if ( t0 < 0 && t1 < 0 ) return null;

			// test to see if t0 is behind the ray:
			// if it is, the ray is inside the sphere, so return the second exit point scaled by t1,
			// in order to always return an intersect point that is in front of the ray.
			if ( t0 < 0 ) return this.at( t1, optionalTarget );

			// else t0 is in front of the ray, so return the first collision point scaled by t0
			return this.at( t0, optionalTarget );

		}

	}(),

	isIntersectionPlane: function ( plane ) {

		// check if the ray lies on the plane first

		var distToPoint = plane.distanceToPoint( this.origin );

		if ( distToPoint === 0 ) {

			return true;

		}

		var denominator = plane.normal.dot( this.direction );

		if ( denominator * distToPoint < 0 ) {

			return true;

		}

		// ray origin is behind the plane (and is pointing behind it)

		return false;

	},

	distanceToPlane: function ( plane ) {

		var denominator = plane.normal.dot( this.direction );
		if ( denominator === 0 ) {

			// line is coplanar, return origin
			if ( plane.distanceToPoint( this.origin ) === 0 ) {

				return 0;

			}

			// Null is preferable to undefined since undefined means.... it is undefined

			return null;

		}

		var t = - ( this.origin.dot( plane.normal ) + plane.constant ) / denominator;

		// Return if the ray never intersects the plane

		return t >= 0 ? t :  null;

	},

	intersectPlane: function ( plane, optionalTarget ) {

		var t = this.distanceToPlane( plane );

		if ( t === null ) {

			return null;
		}

		return this.at( t, optionalTarget );

	},

	isIntersectionBox: function () {

		var v = new THREE.Vector3();

		return function ( box ) {

			return this.intersectBox( box, v ) !== null;

		};

	}(),

	intersectBox: function ( box, optionalTarget ) {

		// http://www.scratchapixel.com/lessons/3d-basic-lessons/lesson-7-intersecting-simple-shapes/ray-box-intersection/

		var tmin,tmax,tymin,tymax,tzmin,tzmax;

		var invdirx = 1 / this.direction.x,
			invdiry = 1 / this.direction.y,
			invdirz = 1 / this.direction.z;

		var origin = this.origin;

		if ( invdirx >= 0 ) {

			tmin = ( box.min.x - origin.x ) * invdirx;
			tmax = ( box.max.x - origin.x ) * invdirx;

		} else {

			tmin = ( box.max.x - origin.x ) * invdirx;
			tmax = ( box.min.x - origin.x ) * invdirx;
		}

		if ( invdiry >= 0 ) {

			tymin = ( box.min.y - origin.y ) * invdiry;
			tymax = ( box.max.y - origin.y ) * invdiry;

		} else {

			tymin = ( box.max.y - origin.y ) * invdiry;
			tymax = ( box.min.y - origin.y ) * invdiry;
		}

		if ( ( tmin > tymax ) || ( tymin > tmax ) ) return null;

		// These lines also handle the case where tmin or tmax is NaN
		// (result of 0 * Infinity). x !== x returns true if x is NaN

		if ( tymin > tmin || tmin !== tmin ) tmin = tymin;

		if ( tymax < tmax || tmax !== tmax ) tmax = tymax;

		if ( invdirz >= 0 ) {

			tzmin = ( box.min.z - origin.z ) * invdirz;
			tzmax = ( box.max.z - origin.z ) * invdirz;

		} else {

			tzmin = ( box.max.z - origin.z ) * invdirz;
			tzmax = ( box.min.z - origin.z ) * invdirz;
		}

		if ( ( tmin > tzmax ) || ( tzmin > tmax ) ) return null;

		if ( tzmin > tmin || tmin !== tmin ) tmin = tzmin;

		if ( tzmax < tmax || tmax !== tmax ) tmax = tzmax;

		//return point closest to the ray (positive side)

		if ( tmax < 0 ) return null;

		return this.at( tmin >= 0 ? tmin : tmax, optionalTarget );

	},

	intersectTriangle: function () {

		// Compute the offset origin, edges, and normal.
		var diff = new THREE.Vector3();
		var edge1 = new THREE.Vector3();
		var edge2 = new THREE.Vector3();
		var normal = new THREE.Vector3();

		return function ( a, b, c, backfaceCulling, optionalTarget ) {

			// from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, optionalTarget );

		};

	}(),

	applyMatrix4: function ( matrix4 ) {

		this.direction.add( this.origin ).applyMatrix4( matrix4 );
		this.origin.applyMatrix4( matrix4 );
		this.direction.sub( this.origin );
		this.direction.normalize();

		return this;
	},

	equals: function ( ray ) {

		return ray.origin.equals( this.origin ) && ray.direction.equals( this.direction );

	},

	clone: function () {

		return new THREE.Ray().copy( this );

	}

};

// File:src/math/Sphere.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Sphere = function ( center, radius ) {

	this.center = ( center !== undefined ) ? center : new THREE.Vector3();
	this.radius = ( radius !== undefined ) ? radius : 0;

};

THREE.Sphere.prototype = {

	constructor: THREE.Sphere,

	set: function ( center, radius ) {

		this.center.copy( center );
		this.radius = radius;

		return this;
	},

	setFromPoints: function () {

		var box = new THREE.Box3();

		return function ( points, optionalCenter ) {

			var center = this.center;

			if ( optionalCenter !== undefined ) {

				center.copy( optionalCenter );

			} else {

				box.setFromPoints( points ).center( center );

			}

			var maxRadiusSq = 0;

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( points[ i ] ) );

			}

			this.radius = Math.sqrt( maxRadiusSq );

			return this;

		};

	}(),

	copy: function ( sphere ) {

		this.center.copy( sphere.center );
		this.radius = sphere.radius;

		return this;

	},

	empty: function () {

		return ( this.radius <= 0 );

	},

	containsPoint: function ( point ) {

		return ( point.distanceToSquared( this.center ) <= ( this.radius * this.radius ) );

	},

	distanceToPoint: function ( point ) {

		return ( point.distanceTo( this.center ) - this.radius );

	},

	intersectsSphere: function ( sphere ) {

		var radiusSum = this.radius + sphere.radius;

		return sphere.center.distanceToSquared( this.center ) <= ( radiusSum * radiusSum );

	},

	clampPoint: function ( point, optionalTarget ) {

		var deltaLengthSq = this.center.distanceToSquared( point );

		var result = optionalTarget || new THREE.Vector3();
		result.copy( point );

		if ( deltaLengthSq > ( this.radius * this.radius ) ) {

			result.sub( this.center ).normalize();
			result.multiplyScalar( this.radius ).add( this.center );

		}

		return result;

	},

	getBoundingBox: function ( optionalTarget ) {

		var box = optionalTarget || new THREE.Box3();

		box.set( this.center, this.center );
		box.expandByScalar( this.radius );

		return box;

	},

	applyMatrix4: function ( matrix ) {

		this.center.applyMatrix4( matrix );
		this.radius = this.radius * matrix.getMaxScaleOnAxis();

		return this;

	},

	translate: function ( offset ) {

		this.center.add( offset );

		return this;

	},

	equals: function ( sphere ) {

		return sphere.center.equals( this.center ) && ( sphere.radius === this.radius );

	},

	clone: function () {

		return new THREE.Sphere().copy( this );

	}

};

// File:src/math/Frustum.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / http://exocortex.com
 */

THREE.Frustum = function ( p0, p1, p2, p3, p4, p5 ) {

	this.planes = [

		( p0 !== undefined ) ? p0 : new THREE.Plane(),
		( p1 !== undefined ) ? p1 : new THREE.Plane(),
		( p2 !== undefined ) ? p2 : new THREE.Plane(),
		( p3 !== undefined ) ? p3 : new THREE.Plane(),
		( p4 !== undefined ) ? p4 : new THREE.Plane(),
		( p5 !== undefined ) ? p5 : new THREE.Plane()

	];

};

THREE.Frustum.prototype = {

	constructor: THREE.Frustum,

	set: function ( p0, p1, p2, p3, p4, p5 ) {

		var planes = this.planes;

		planes[ 0 ].copy( p0 );
		planes[ 1 ].copy( p1 );
		planes[ 2 ].copy( p2 );
		planes[ 3 ].copy( p3 );
		planes[ 4 ].copy( p4 );
		planes[ 5 ].copy( p5 );

		return this;

	},

	copy: function ( frustum ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			planes[ i ].copy( frustum.planes[ i ] );

		}

		return this;

	},

	setFromMatrix: function ( m ) {

		var planes = this.planes;
		var me = m.elements;
		var me0 = me[ 0 ], me1 = me[ 1 ], me2 = me[ 2 ], me3 = me[ 3 ];
		var me4 = me[ 4 ], me5 = me[ 5 ], me6 = me[ 6 ], me7 = me[ 7 ];
		var me8 = me[ 8 ], me9 = me[ 9 ], me10 = me[ 10 ], me11 = me[ 11 ];
		var me12 = me[ 12 ], me13 = me[ 13 ], me14 = me[ 14 ], me15 = me[ 15 ];

		planes[ 0 ].setComponents( me3 - me0, me7 - me4, me11 - me8, me15 - me12 ).normalize();
		planes[ 1 ].setComponents( me3 + me0, me7 + me4, me11 + me8, me15 + me12 ).normalize();
		planes[ 2 ].setComponents( me3 + me1, me7 + me5, me11 + me9, me15 + me13 ).normalize();
		planes[ 3 ].setComponents( me3 - me1, me7 - me5, me11 - me9, me15 - me13 ).normalize();
		planes[ 4 ].setComponents( me3 - me2, me7 - me6, me11 - me10, me15 - me14 ).normalize();
		planes[ 5 ].setComponents( me3 + me2, me7 + me6, me11 + me10, me15 + me14 ).normalize();

		return this;

	},

	intersectsObject: function () {

		var sphere = new THREE.Sphere();

		return function ( object ) {

			var geometry = object.geometry;

			if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

			sphere.copy( geometry.boundingSphere );
			sphere.applyMatrix4( object.matrixWorld );

			return this.intersectsSphere( sphere );

		};

	}(),

	intersectsSphere: function ( sphere ) {

		var planes = this.planes;
		var center = sphere.center;
		var negRadius = - sphere.radius;

		for ( var i = 0; i < 6; i ++ ) {

			var distance = planes[ i ].distanceToPoint( center );

			if ( distance < negRadius ) {

				return false;

			}

		}

		return true;

	},

	intersectsBox: function () {

		var p1 = new THREE.Vector3(),
			p2 = new THREE.Vector3();

		return function ( box ) {

			var planes = this.planes;

			for ( var i = 0; i < 6 ; i ++ ) {

				var plane = planes[ i ];

				p1.x = plane.normal.x > 0 ? box.min.x : box.max.x;
				p2.x = plane.normal.x > 0 ? box.max.x : box.min.x;
				p1.y = plane.normal.y > 0 ? box.min.y : box.max.y;
				p2.y = plane.normal.y > 0 ? box.max.y : box.min.y;
				p1.z = plane.normal.z > 0 ? box.min.z : box.max.z;
				p2.z = plane.normal.z > 0 ? box.max.z : box.min.z;

				var d1 = plane.distanceToPoint( p1 );
				var d2 = plane.distanceToPoint( p2 );

				// if both outside plane, no intersection

				if ( d1 < 0 && d2 < 0 ) {

					return false;

				}
			}

			return true;
		};

	}(),


	containsPoint: function ( point ) {

		var planes = this.planes;

		for ( var i = 0; i < 6; i ++ ) {

			if ( planes[ i ].distanceToPoint( point ) < 0 ) {

				return false;

			}

		}

		return true;

	},

	clone: function () {

		return new THREE.Frustum().copy( this );

	}

};

// File:src/math/Plane.js

/**
 * @author bhouston / http://exocortex.com
 */

THREE.Plane = function ( normal, constant ) {

	this.normal = ( normal !== undefined ) ? normal : new THREE.Vector3( 1, 0, 0 );
	this.constant = ( constant !== undefined ) ? constant : 0;

};

THREE.Plane.prototype = {

	constructor: THREE.Plane,

	set: function ( normal, constant ) {

		this.normal.copy( normal );
		this.constant = constant;

		return this;

	},

	setComponents: function ( x, y, z, w ) {

		this.normal.set( x, y, z );
		this.constant = w;

		return this;

	},

	setFromNormalAndCoplanarPoint: function ( normal, point ) {

		this.normal.copy( normal );
		this.constant = - point.dot( this.normal );	// must be this.normal, not normal, as this.normal is normalized

		return this;

	},

	setFromCoplanarPoints: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();

		return function ( a, b, c ) {

			var normal = v1.subVectors( c, b ).cross( v2.subVectors( a, b ) ).normalize();

			// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

			this.setFromNormalAndCoplanarPoint( normal, a );

			return this;

		};

	}(),


	copy: function ( plane ) {

		this.normal.copy( plane.normal );
		this.constant = plane.constant;

		return this;

	},

	normalize: function () {

		// Note: will lead to a divide by zero if the plane is invalid.

		var inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar( inverseNormalLength );
		this.constant *= inverseNormalLength;

		return this;

	},

	negate: function () {

		this.constant *= - 1;
		this.normal.negate();

		return this;

	},

	distanceToPoint: function ( point ) {

		return this.normal.dot( point ) + this.constant;

	},

	distanceToSphere: function ( sphere ) {

		return this.distanceToPoint( sphere.center ) - sphere.radius;

	},

	projectPoint: function ( point, optionalTarget ) {

		return this.orthoPoint( point, optionalTarget ).sub( point ).negate();

	},

	orthoPoint: function ( point, optionalTarget ) {

		var perpendicularMagnitude = this.distanceToPoint( point );

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( perpendicularMagnitude );

	},

	isIntersectionLine: function ( line ) {

		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		var startSign = this.distanceToPoint( line.start );
		var endSign = this.distanceToPoint( line.end );

		return ( startSign < 0 && endSign > 0 ) || ( endSign < 0 && startSign > 0 );

	},

	intersectLine: function () {

		var v1 = new THREE.Vector3();

		return function ( line, optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			var direction = line.delta( v1 );

			var denominator = this.normal.dot( direction );

			if ( denominator === 0 ) {

				// line is coplanar, return origin
				if ( this.distanceToPoint( line.start ) === 0 ) {

					return result.copy( line.start );

				}

				// Unsure if this is the correct method to handle this case.
				return undefined;

			}

			var t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

			if ( t < 0 || t > 1 ) {

				return undefined;

			}

			return result.copy( direction ).multiplyScalar( t ).add( line.start );

		};

	}(),


	coplanarPoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.copy( this.normal ).multiplyScalar( - this.constant );

	},

	applyMatrix4: function () {

		var v1 = new THREE.Vector3();
		var v2 = new THREE.Vector3();
		var m1 = new THREE.Matrix3();

		return function ( matrix, optionalNormalMatrix ) {

			// compute new normal based on theory here:
			// http://www.songho.ca/opengl/gl_normaltransform.html
			var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix( matrix );
			var newNormal = v1.copy( this.normal ).applyMatrix3( normalMatrix );

			var newCoplanarPoint = this.coplanarPoint( v2 );
			newCoplanarPoint.applyMatrix4( matrix );

			this.setFromNormalAndCoplanarPoint( newNormal, newCoplanarPoint );

			return this;

		};

	}(),

	translate: function ( offset ) {

		this.constant = this.constant - offset.dot( this.normal );

		return this;

	},

	equals: function ( plane ) {

		return plane.normal.equals( this.normal ) && ( plane.constant === this.constant );

	},

	clone: function () {

		return new THREE.Plane().copy( this );

	}

};

// File:src/math/Math.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Math = {

	generateUUID: function () {

		// http://www.broofa.com/Tools/Math.uuid.htm

		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split( '' );
		var uuid = new Array( 36 );
		var rnd = 0, r;

		return function () {

			for ( var i = 0; i < 36; i ++ ) {

				if ( i === 8 || i === 13 || i === 18 || i === 23 ) {

					uuid[ i ] = '-';

				} else if ( i === 14 ) {

					uuid[ i ] = '4';

				} else {

					if ( rnd <= 0x02 ) rnd = 0x2000000 + ( Math.random() * 0x1000000 ) | 0;
					r = rnd & 0xf;
					rnd = rnd >> 4;
					uuid[ i ] = chars[ ( i === 19 ) ? ( r & 0x3 ) | 0x8 : r ];

				}
			}

			return uuid.join( '' );

		};

	}(),

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// http://en.wikipedia.org/wiki/Smoothstep

	smoothstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * ( 3 - 2 * x );

	},

	smootherstep: function ( x, min, max ) {

		if ( x <= min ) return 0;
		if ( x >= max ) return 1;

		x = ( x - min ) / ( max - min );

		return x * x * x * ( x * ( x * 6 - 15 ) + 10 );

	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function () {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return Math.floor( this.randFloat( low, high ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	degToRad: function () {

		var degreeToRadiansFactor = Math.PI / 180;

		return function ( degrees ) {

			return degrees * degreeToRadiansFactor;

		};

	}(),

	radToDeg: function () {

		var radianToDegreesFactor = 180 / Math.PI;

		return function ( radians ) {

			return radians * radianToDegreesFactor;

		};

	}(),

	isPowerOfTwo: function ( value ) {

		return ( value & ( value - 1 ) ) === 0 && value !== 0;

	},

	nextPowerOfTwo: function ( value ) {

		value --;
		value |= value >> 1;
		value |= value >> 2;
		value |= value >> 4;
		value |= value >> 8;
		value |= value >> 16;
		value ++;

		return value;

	}

};

// File:src/math/Spline.js

/**
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Spline = function ( points ) {

	this.points = points;

	var c = [], v3 = { x: 0, y: 0, z: 0 },
	point, intPoint, weight, w2, w3,
	pa, pb, pc, pd;

	this.initFromArray = function ( a ) {

		this.points = [];

		for ( var i = 0; i < a.length; i ++ ) {

			this.points[ i ] = { x: a[ i ][ 0 ], y: a[ i ][ 1 ], z: a[ i ][ 2 ] };

		}

	};

	this.getPoint = function ( k ) {

		point = ( this.points.length - 1 ) * k;
		intPoint = Math.floor( point );
		weight = point - intPoint;

		c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
		c[ 1 ] = intPoint;
		c[ 2 ] = intPoint  > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
		c[ 3 ] = intPoint  > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

		pa = this.points[ c[ 0 ] ];
		pb = this.points[ c[ 1 ] ];
		pc = this.points[ c[ 2 ] ];
		pd = this.points[ c[ 3 ] ];

		w2 = weight * weight;
		w3 = weight * w2;

		v3.x = interpolate( pa.x, pb.x, pc.x, pd.x, weight, w2, w3 );
		v3.y = interpolate( pa.y, pb.y, pc.y, pd.y, weight, w2, w3 );
		v3.z = interpolate( pa.z, pb.z, pc.z, pd.z, weight, w2, w3 );

		return v3;

	};

	this.getControlPointsArray = function () {

		var i, p, l = this.points.length,
			coords = [];

		for ( i = 0; i < l; i ++ ) {

			p = this.points[ i ];
			coords[ i ] = [ p.x, p.y, p.z ];

		}

		return coords;

	};

	// approximate length by summing linear segments

	this.getLength = function ( nSubDivisions ) {

		var i, index, nSamples, position,
			point = 0, intPoint = 0, oldIntPoint = 0,
			oldPosition = new THREE.Vector3(),
			tmpVec = new THREE.Vector3(),
			chunkLengths = [],
			totalLength = 0;

		// first point has 0 length

		chunkLengths[ 0 ] = 0;

		if ( ! nSubDivisions ) nSubDivisions = 100;

		nSamples = this.points.length * nSubDivisions;

		oldPosition.copy( this.points[ 0 ] );

		for ( i = 1; i < nSamples; i ++ ) {

			index = i / nSamples;

			position = this.getPoint( index );
			tmpVec.copy( position );

			totalLength += tmpVec.distanceTo( oldPosition );

			oldPosition.copy( position );

			point = ( this.points.length - 1 ) * index;
			intPoint = Math.floor( point );

			if ( intPoint !== oldIntPoint ) {

				chunkLengths[ intPoint ] = totalLength;
				oldIntPoint = intPoint;

			}

		}

		// last point ends with total length

		chunkLengths[ chunkLengths.length ] = totalLength;

		return { chunks: chunkLengths, total: totalLength };

	};

	this.reparametrizeByArcLength = function ( samplingCoef ) {

		var i, j,
			index, indexCurrent, indexNext,
			realDistance,
			sampling, position,
			newpoints = [],
			tmpVec = new THREE.Vector3(),
			sl = this.getLength();

		newpoints.push( tmpVec.copy( this.points[ 0 ] ).clone() );

		for ( i = 1; i < this.points.length; i ++ ) {

			//tmpVec.copy( this.points[ i - 1 ] );
			//linearDistance = tmpVec.distanceTo( this.points[ i ] );

			realDistance = sl.chunks[ i ] - sl.chunks[ i - 1 ];

			sampling = Math.ceil( samplingCoef * realDistance / sl.total );

			indexCurrent = ( i - 1 ) / ( this.points.length - 1 );
			indexNext = i / ( this.points.length - 1 );

			for ( j = 1; j < sampling - 1; j ++ ) {

				index = indexCurrent + j * ( 1 / sampling ) * ( indexNext - indexCurrent );

				position = this.getPoint( index );
				newpoints.push( tmpVec.copy( position ).clone() );

			}

			newpoints.push( tmpVec.copy( this.points[ i ] ).clone() );

		}

		this.points = newpoints;

	};

	// Catmull-Rom

	function interpolate( p0, p1, p2, p3, t, t2, t3 ) {

		var v0 = ( p2 - p0 ) * 0.5,
			v1 = ( p3 - p1 ) * 0.5;

		return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};

// File:src/math/Triangle.js

/**
 * @author bhouston / http://exocortex.com
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Triangle = function ( a, b, c ) {

	this.a = ( a !== undefined ) ? a : new THREE.Vector3();
	this.b = ( b !== undefined ) ? b : new THREE.Vector3();
	this.c = ( c !== undefined ) ? c : new THREE.Vector3();

};

THREE.Triangle.normal = function () {

	var v0 = new THREE.Vector3();

	return function ( a, b, c, optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		result.subVectors( c, b );
		v0.subVectors( a, b );
		result.cross( v0 );

		var resultLengthSq = result.lengthSq();
		if ( resultLengthSq > 0 ) {

			return result.multiplyScalar( 1 / Math.sqrt( resultLengthSq ) );

		}

		return result.set( 0, 0, 0 );

	};

}();

// static/instance method to calculate barycoordinates
// based on: http://www.blackpawn.com/texts/pointinpoly/default.html
THREE.Triangle.barycoordFromPoint = function () {

	var v0 = new THREE.Vector3();
	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( point, a, b, c, optionalTarget ) {

		v0.subVectors( c, a );
		v1.subVectors( b, a );
		v2.subVectors( point, a );

		var dot00 = v0.dot( v0 );
		var dot01 = v0.dot( v1 );
		var dot02 = v0.dot( v2 );
		var dot11 = v1.dot( v1 );
		var dot12 = v1.dot( v2 );

		var denom = ( dot00 * dot11 - dot01 * dot01 );

		var result = optionalTarget || new THREE.Vector3();

		// colinear or singular triangle
		if ( denom === 0 ) {
			// arbitrary location outside of triangle?
			// not sure if this is the best idea, maybe should be returning undefined
			return result.set( - 2, - 1, - 1 );
		}

		var invDenom = 1 / denom;
		var u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		var v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		// barycoordinates must always sum to 1
		return result.set( 1 - u - v, v, u );

	};

}();

THREE.Triangle.containsPoint = function () {

	var v1 = new THREE.Vector3();

	return function ( point, a, b, c ) {

		var result = THREE.Triangle.barycoordFromPoint( point, a, b, c, v1 );

		return ( result.x >= 0 ) && ( result.y >= 0 ) && ( ( result.x + result.y ) <= 1 );

	};

}();

THREE.Triangle.prototype = {

	constructor: THREE.Triangle,

	set: function ( a, b, c ) {

		this.a.copy( a );
		this.b.copy( b );
		this.c.copy( c );

		return this;

	},

	setFromPointsAndIndices: function ( points, i0, i1, i2 ) {

		this.a.copy( points[ i0 ] );
		this.b.copy( points[ i1 ] );
		this.c.copy( points[ i2 ] );

		return this;

	},

	copy: function ( triangle ) {

		this.a.copy( triangle.a );
		this.b.copy( triangle.b );
		this.c.copy( triangle.c );

		return this;

	},

	area: function () {

		var v0 = new THREE.Vector3();
		var v1 = new THREE.Vector3();

		return function () {

			v0.subVectors( this.c, this.b );
			v1.subVectors( this.a, this.b );

			return v0.cross( v1 ).length() * 0.5;

		};

	}(),

	midpoint: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();
		return result.addVectors( this.a, this.b ).add( this.c ).multiplyScalar( 1 / 3 );

	},

	normal: function ( optionalTarget ) {

		return THREE.Triangle.normal( this.a, this.b, this.c, optionalTarget );

	},

	plane: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Plane();

		return result.setFromCoplanarPoints( this.a, this.b, this.c );

	},

	barycoordFromPoint: function ( point, optionalTarget ) {

		return THREE.Triangle.barycoordFromPoint( point, this.a, this.b, this.c, optionalTarget );

	},

	containsPoint: function ( point ) {

		return THREE.Triangle.containsPoint( point, this.a, this.b, this.c );

	},

	equals: function ( triangle ) {

		return triangle.a.equals( this.a ) && triangle.b.equals( this.b ) && triangle.c.equals( this.c );

	},

	clone: function () {

		return new THREE.Triangle().copy( this );

	}

};

// File:src/core/Clock.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Clock = function ( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

};

THREE.Clock.prototype = {

	constructor: THREE.Clock,

	start: function () {

		this.startTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

		this.oldTime = this.startTime;
		this.running = true;
	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();

		}

		if ( this.running ) {

			var newTime = self.performance !== undefined && self.performance.now !== undefined
					 ? self.performance.now()
					 : Date.now();

			diff = 0.001 * ( newTime - this.oldTime );
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

};

// File:src/core/EventDispatcher.js

/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

THREE.EventDispatcher = function () {};

THREE.EventDispatcher.prototype = {

	constructor: THREE.EventDispatcher,

	apply: function ( object ) {

		object.addEventListener = THREE.EventDispatcher.prototype.addEventListener;
		object.hasEventListener = THREE.EventDispatcher.prototype.hasEventListener;
		object.removeEventListener = THREE.EventDispatcher.prototype.removeEventListener;
		object.dispatchEvent = THREE.EventDispatcher.prototype.dispatchEvent;

	},

	addEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {

			return true;

		}

		return false;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

};

// File:src/core/Raycaster.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://exocortex.com/
 * @author stephomi / http://stephaneginier.com/
 */

( function ( THREE ) {

	THREE.Raycaster = function ( origin, direction, near, far ) {

		this.ray = new THREE.Ray( origin, direction );
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near || 0;
		this.far = far || Infinity;

		this.params = {
			Sprite: {},
			Mesh: {},
			PointCloud: { threshold: 1 },
			LOD: {},
			Line: {}
		};

	};

	var descSort = function ( a, b ) {

		return a.distance - b.distance;

	};

	var intersectObject = function ( object, raycaster, intersects, recursive ) {

		object.raycast( raycaster, intersects );

		if ( recursive === true ) {

			var children = object.children;

			for ( var i = 0, l = children.length; i < l; i ++ ) {

				intersectObject( children[ i ], raycaster, intersects, true );

			}

		}

	};

	//

	THREE.Raycaster.prototype = {

		constructor: THREE.Raycaster,

		linePrecision: 1,

		set: function ( origin, direction ) {

			// direction is assumed to be normalized (for accurate distance calculations)

			this.ray.set( origin, direction );

		},

		setFromCamera: function ( coords, camera ) {

			if ( camera instanceof THREE.PerspectiveCamera ) {

				this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
				this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

			} else if ( camera instanceof THREE.OrthographicCamera ) {

				this.ray.origin.set( coords.x, coords.y, - 1 ).unproject( camera );
				this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

			} else {

				console.error( 'THREE.Raycaster: Unsupported camera type.' );

			}

		},

		intersectObject: function ( object, recursive ) {

			var intersects = [];

			intersectObject( object, this, intersects, recursive );

			intersects.sort( descSort );

			return intersects;

		},

		intersectObjects: function ( objects, recursive ) {

			var intersects = [];

			if ( Array.isArray( objects ) === false ) {

				console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
				return intersects;

			}

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				intersectObject( objects[ i ], this, intersects, recursive );

			}

			intersects.sort( descSort );

			return intersects;

		}

	};

}( THREE ) );

// File:src/core/Object3D.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */

THREE.Object3D = function () {

	Object.defineProperty( this, 'id', { value: THREE.Object3DIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Object3D';

	this.parent = undefined;
	this.children = [];

	this.up = THREE.Object3D.DefaultUp.clone();

	var position = new THREE.Vector3();
	var rotation = new THREE.Euler();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3( 1, 1, 1 );

	var onRotationChange = function () {
		quaternion.setFromEuler( rotation, false );
	};

	var onQuaternionChange = function () {
		rotation.setFromQuaternion( quaternion, undefined, false );
	};

	rotation.onChange( onRotationChange );
	quaternion.onChange( onQuaternionChange );

	Object.defineProperties( this, {
		position: {
			enumerable: true,
			value: position
		},
		rotation: {
			enumerable: true,
			value: rotation
		},
		quaternion: {
			enumerable: true,
			value: quaternion
		},
		scale: {
			enumerable: true,
			value: scale
		}
	} );

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = false;

	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;
	this.renderOrder = 0;

	this.userData = {};

};

THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 1, 0 );

THREE.Object3D.prototype = {

	constructor: THREE.Object3D,

	get eulerOrder () {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		return this.rotation.order;

	},

	set eulerOrder ( value ) {

		console.warn( 'THREE.Object3D: .eulerOrder has been moved to .rotation.order.' );

		this.rotation.order = value;

	},

	get useQuaternion () {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	set useQuaternion ( value ) {

		console.warn( 'THREE.Object3D: .useQuaternion has been removed. The library now uses quaternions by default.' );

	},

	applyMatrix: function ( matrix ) {

		this.matrix.multiplyMatrices( matrix, this.matrix );

		this.matrix.decompose( this.position, this.quaternion, this.scale );

	},

	setRotationFromAxisAngle: function ( axis, angle ) {

		// assumes axis is normalized

		this.quaternion.setFromAxisAngle( axis, angle );

	},

	setRotationFromEuler: function ( euler ) {

		this.quaternion.setFromEuler( euler, true );

	},

	setRotationFromMatrix: function ( m ) {

		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix( m );

	},

	setRotationFromQuaternion: function ( q ) {

		// assumes q is normalized

		this.quaternion.copy( q );

	},

	rotateOnAxis: function () {

		// rotate object on axis in object space
		// axis is assumed to be normalized

		var q1 = new THREE.Quaternion();

		return function ( axis, angle ) {

			q1.setFromAxisAngle( axis, angle );

			this.quaternion.multiply( q1 );

			return this;

		}

	}(),

	rotateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	rotateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( angle ) {

			return this.rotateOnAxis( v1, angle );

		};

	}(),

	translateOnAxis: function () {

		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		var v1 = new THREE.Vector3();

		return function ( axis, distance ) {

			v1.copy( axis ).applyQuaternion( this.quaternion );

			this.position.add( v1.multiplyScalar( distance ) );

			return this;

		}

	}(),

	translate: function ( distance, axis ) {

		console.warn( 'THREE.Object3D: .translate() has been removed. Use .translateOnAxis( axis, distance ) instead.' );
		return this.translateOnAxis( axis, distance );

	},

	translateX: function () {

		var v1 = new THREE.Vector3( 1, 0, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateY: function () {

		var v1 = new THREE.Vector3( 0, 1, 0 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	translateZ: function () {

		var v1 = new THREE.Vector3( 0, 0, 1 );

		return function ( distance ) {

			return this.translateOnAxis( v1, distance );

		};

	}(),

	localToWorld: function ( vector ) {

		return vector.applyMatrix4( this.matrixWorld );

	},

	worldToLocal: function () {

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			return vector.applyMatrix4( m1.getInverse( this.matrixWorld ) );

		};

	}(),

	lookAt: function () {

		// This routine does not support objects with rotated and/or translated parent(s)

		var m1 = new THREE.Matrix4();

		return function ( vector ) {

			m1.lookAt( vector, this.position, this.up );

			this.quaternion.setFromRotationMatrix( m1 );

		};

	}(),

	add: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i ++ ) {

				this.add( arguments[ i ] );

			}

			return this;

		}

		if ( object === this ) {

			console.error( "THREE.Object3D.add: object can't be added as a child of itself.", object );
			return this;

		}

		if ( object instanceof THREE.Object3D ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			object.dispatchEvent( { type: 'added' } );

			this.children.push( object );

		} else {

			console.error( "THREE.Object3D.add: object not an instance of THREE.Object3D.", object );

		}

		return this;

	},

	remove: function ( object ) {

		if ( arguments.length > 1 ) {

			for ( var i = 0; i < arguments.length; i ++ ) {

				this.remove( arguments[ i ] );

			}

		}

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;

			object.dispatchEvent( { type: 'removed' } );

			this.children.splice( index, 1 );

		}

	},

	getChildByName: function ( name ) {

		console.warn( 'THREE.Object3D: .getChildByName() has been renamed to .getObjectByName().' );
		return this.getObjectByName( name );

	},

	getObjectById: function ( id ) {

		return this.getObjectByProperty( 'id', id );

	},

	getObjectByName: function ( name ) {

		return this.getObjectByProperty( 'name', name );

	},

	getObjectByProperty: function ( name, value ) {

		if ( this[ name ] === value ) return this;

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			var child = this.children[ i ];
			var object = child.getObjectByProperty( name, value );

			if ( object !== undefined ) {

				return object;

			}

		}

		return undefined;

	},

	getWorldPosition: function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.updateMatrixWorld( true );

		return result.setFromMatrixPosition( this.matrixWorld );

	},

	getWorldQuaternion: function () {

		var position = new THREE.Vector3();
		var scale = new THREE.Vector3();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Quaternion();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, result, scale );

			return result;

		}

	}(),

	getWorldRotation: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Euler();

			this.getWorldQuaternion( quaternion );

			return result.setFromQuaternion( quaternion, this.rotation.order, false );

		}

	}(),

	getWorldScale: function () {

		var position = new THREE.Vector3();
		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.updateMatrixWorld( true );

			this.matrixWorld.decompose( position, quaternion, result );

			return result;

		}

	}(),

	getWorldDirection: function () {

		var quaternion = new THREE.Quaternion();

		return function ( optionalTarget ) {

			var result = optionalTarget || new THREE.Vector3();

			this.getWorldQuaternion( quaternion );

			return result.set( 0, 0, 1 ).applyQuaternion( quaternion );

		}

	}(),

	raycast: function () {},

	traverse: function ( callback ) {

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverse( callback );

		}

	},

	traverseVisible: function ( callback ) {

		if ( this.visible === false ) return;

		callback( this );

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].traverseVisible( callback );

		}

	},

	traverseAncestors: function ( callback ) {

		if ( this.parent ) {

			callback( this.parent );

			this.parent.traverseAncestors( callback );

		}

	},

	updateMatrix: function () {

		this.matrix.compose( this.position, this.quaternion, this.scale );

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		if ( this.matrixAutoUpdate === true ) this.updateMatrix();

		if ( this.matrixWorldNeedsUpdate === true || force === true ) {

			if ( this.parent === undefined ) {

				this.matrixWorld.copy( this.matrix );

			} else {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	},

	toJSON: function ( meta ) {

		var isRootObject = ( meta === undefined );

		var data = {};

		// meta is a hash used to collect geometries, materials.
		// not providing it implies that this is the root object
		// being serialized.
		if ( isRootObject ) {

			// initialize meta obj
			meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {}
			};

			data.metadata = {
				version: 4.4,
				type: 'Object',
				generator: 'Object3D.toJSON'
			};

		}

		// standard Object3D serialization

		data.uuid = this.uuid;
		data.type = this.type;

		if ( this.name !== '' ) data.name = this.name;
		if ( JSON.stringify( this.userData ) !== '{}' ) data.userData = this.userData;
		if ( this.visible !== true ) data.visible = this.visible;

		data.matrix = this.matrix.toArray();

		if ( this.children.length > 0 ) {

			data.children = [];

			for ( var i = 0; i < this.children.length; i ++ ) {

				data.children.push( this.children[ i ].toJSON( meta ).object );

			}

		}

		var output = {};

		if ( isRootObject ) {

			var geometries = extractFromCache( meta.geometries );
			var materials = extractFromCache( meta.materials );
			var textures = extractFromCache( meta.textures );
			var images = extractFromCache( meta.images );

			if ( geometries.length > 0 ) output.geometries = geometries;
			if ( materials.length > 0 ) output.materials = materials;
			if ( textures.length > 0 ) output.textures = textures;
			if ( images.length > 0 ) output.images = images;

		}

		output.object = data;

		return output;

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache ( cache ) {
			var values = [];
			for ( var key in cache ) {
				var data = cache[ key ];
				delete data.metadata;
				values.push( data );
			}
			return values;
		}

	},

	clone: function ( object, recursive ) {

		if ( object === undefined ) object = new THREE.Object3D();
		if ( recursive === undefined ) recursive = true;

		object.name = this.name;

		object.up.copy( this.up );

		object.position.copy( this.position );
		object.quaternion.copy( this.quaternion );
		object.scale.copy( this.scale );

		object.rotationAutoUpdate = this.rotationAutoUpdate;

		object.matrix.copy( this.matrix );
		object.matrixWorld.copy( this.matrixWorld );

		object.matrixAutoUpdate = this.matrixAutoUpdate;
		object.matrixWorldNeedsUpdate = this.matrixWorldNeedsUpdate;

		object.visible = this.visible;

		object.castShadow = this.castShadow;
		object.receiveShadow = this.receiveShadow;

		object.frustumCulled = this.frustumCulled;
		object.renderOrder = this.renderOrder;

		object.userData = JSON.parse( JSON.stringify( this.userData ) );

		if ( recursive === true ) {

			for ( var i = 0; i < this.children.length; i ++ ) {

				var child = this.children[ i ];
				object.add( child.clone() );

			}

		}

		return object;

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Object3D.prototype );

THREE.Object3DIdCount = 0;

// File:src/core/Face3.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = Array.isArray( normal ) ? normal : [];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = Array.isArray( color ) ? color : [];

	this.vertexTangents = [];

};

THREE.Face3.prototype = {

	constructor: THREE.Face3,

	clone: function () {

		var face = new THREE.Face3( this.a, this.b, this.c );

		face.normal.copy( this.normal );
		face.color.copy( this.color );

		for ( var i = 0, il = this.vertexNormals.length; i < il; i ++ ) {

			face.vertexNormals[ i ] = this.vertexNormals[ i ].clone();

		}

		for ( var i = 0, il = this.vertexColors.length; i < il; i ++ ) {

			face.vertexColors[ i ] = this.vertexColors[ i ].clone();

		}

		for ( var i = 0, il = this.vertexTangents.length; i < il; i ++ ) {

			face.vertexTangents[ i ] = this.vertexTangents[ i ].clone();

		}

		return face;

	}

};

// File:src/core/Face4.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materialIndex ) {

	console.warn( 'THREE.Face4 has been removed. A THREE.Face3 will be created instead.' );
	return new THREE.Face3( a, b, c, normal, color, materialIndex );

};

// File:src/core/BufferAttribute.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferAttribute = function ( array, itemSize ) {

	this.array = array;
	this.itemSize = itemSize;

	this.needsUpdate = false;

};

THREE.BufferAttribute.prototype = {

	constructor: THREE.BufferAttribute,

	get length () {

		console.warn( 'THREE.BufferAttribute: .length has been renamed to .count.' );
		return this.count;

	},

	get count() {

		return this.array.length / this.itemSize;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( var i = 0, l = this.itemSize; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	copyArray: function ( array ) {

		this.array.set( array );

		return this;

	},

	copyColorsArray: function ( colors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = colors.length; i < l; i ++ ) {

			var color = colors[ i ];

			if ( color === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
				color = new THREE.Color();

			}

			array[ offset ++ ] = color.r;
			array[ offset ++ ] = color.g;
			array[ offset ++ ] = color.b;

		}

		return this;

	},

	copyIndicesArray: function ( indices ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = indices.length; i < l; i ++ ) {

			var index = indices[ i ];

			array[ offset ++ ] = index.a;
			array[ offset ++ ] = index.b;
			array[ offset ++ ] = index.c;

		}

		return this;

	},

	copyVector2sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
				vector = new THREE.Vector2();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;

		}

		return this;

	},

	copyVector3sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
				vector = new THREE.Vector3();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;

		}

		return this;

	},

	copyVector4sArray: function ( vectors ) {

		var array = this.array, offset = 0;

		for ( var i = 0, l = vectors.length; i < l; i ++ ) {

			var vector = vectors[ i ];

			if ( vector === undefined ) {

				console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
				vector = new THREE.Vector4();

			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
			array[ offset ++ ] = vector.w;

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	getX: function ( index ) {

		return this.array[ index * this.itemSize ];

	},

	setX: function ( index, x ) {

		this.array[ index * this.itemSize ] = x;

		return this;

	},

	getY: function ( index ) {

		return this.array[ index * this.itemSize + 1 ];

	},

	setY: function ( index, y ) {

		this.array[ index * this.itemSize + 1 ] = y;

		return this;

	},

	getZ: function ( index ) {

		return this.array[ index * this.itemSize + 2 ];

	},

	setZ: function ( index, z ) {

		this.array[ index * this.itemSize + 2 ] = z;

		return this;

	},

	getW: function ( index ) {

		return this.array[ index * this.itemSize + 3 ];

	},

	setW: function ( index, w ) {

		this.array[ index * this.itemSize + 3 ] = w;

		return this;

	},

	setXY: function ( index, x, y ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;

	},

	clone: function () {

		return new THREE.BufferAttribute( new this.array.constructor( this.array ), this.itemSize );

	}

};

//

THREE.Int8Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int8Array( array ), itemSize );

};

THREE.Uint8Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint8Array( array ), itemSize );

};

THREE.Uint8ClampedAttribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint8ClampedArray( array ), itemSize );

};

THREE.Int16Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int16Array( array ), itemSize );

};

THREE.Uint16Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint16Array( array ), itemSize );

};

THREE.Int32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Int32Array( array ), itemSize );

};

THREE.Uint32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Uint32Array( array ), itemSize );

};

THREE.Float32Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Float32Array( array ), itemSize );

};

THREE.Float64Attribute = function ( array, itemSize ) {

	return new THREE.BufferAttribute( new Float64Array( array ), itemSize );

};

// File:src/core/DynamicBufferAttribute.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 * @author mrdoob / http://mrdoob.com/
 */

THREE.DynamicBufferAttribute = function ( array, itemSize ) {

	THREE.BufferAttribute.call( this, array, itemSize );

	this.updateRange = { offset: 0, count: -1 };

};

THREE.DynamicBufferAttribute.prototype = Object.create( THREE.BufferAttribute.prototype );
THREE.DynamicBufferAttribute.prototype.constructor = THREE.DynamicBufferAttribute;

THREE.DynamicBufferAttribute.prototype.clone = function () {

	return new THREE.DynamicBufferAttribute( new this.array.constructor( this.array ), this.itemSize );

};

// File:src/core/InstancedBufferAttribute.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedBufferAttribute = function (array, itemSize, meshPerAttribute, dynamic) {

	THREE.DynamicBufferAttribute.call( this, array, itemSize );

	this.dynamic = dynamic || false;
	this.meshPerAttribute = meshPerAttribute || 1;

};

THREE.InstancedBufferAttribute.prototype = Object.create( THREE.DynamicBufferAttribute.prototype );
THREE.InstancedBufferAttribute.prototype.constructor = THREE.InstancedBufferAttribute;

THREE.InstancedBufferAttribute.prototype.clone = function () {

	return new THREE.InstancedBufferAttribute( new this.array.constructor( this.array ), this.itemSize, this.meshPerAttribute, this.dynamic );

};

// File:src/core/InterleavedBuffer.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InterleavedBuffer = function ( array, stride, dynamic ) {

	this.array = array;
	this.stride = stride;

	this.needsUpdate = false;

	this.dynamic = dynamic || false;
	this.updateRange = { offset: 0, count: -1 };

};

THREE.InterleavedBuffer.prototype = {

	constructor: THREE.InterleavedBuffer,

	get length () {

		return this.array.length;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.stride;
		index2 *= attribute.stride;

		for ( var i = 0, l = this.stride; i < l; i++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	clone: function () {

		return new THREE.InterleavedBuffer( new this.array.constructor( this.array ), this.stride, this.dynamic );

	}

};

// File:src/core/InstancedInterleavedBuffer.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedInterleavedBuffer = function ( array, stride, dynamic, meshPerAttribute ) {

	THREE.InterleavedBuffer.call( this, array, stride, dynamic );

	this.meshPerAttribute = meshPerAttribute || 1;

};

THREE.InstancedInterleavedBuffer.prototype = Object.create( THREE.InterleavedBuffer.prototype );
THREE.InstancedInterleavedBuffer.prototype.constructor = THREE.InstancedInterleavedBuffer;

THREE.InstancedInterleavedBuffer.prototype.clone = function () {

	return new THREE.InstancedInterleavedBuffer( new this.array.constructor( this.array ), this.stride, this.dynamic, this.meshPerAttribute );

};

// File:src/core/InterleavedBufferAttribute.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InterleavedBufferAttribute = function ( interleavedBuffer, itemSize, offset ) {

	this.data = interleavedBuffer;
	this.itemSize = itemSize;
	this.offset = offset;

};


THREE.InterleavedBufferAttribute.prototype = {

	constructor: THREE.InterleavedBufferAttribute,

	get length() {

		console.warn( 'THREE.InterleavedBufferAttribute: .length has been renamed to .count.' );
		return this.count;

	},

	get count() {

		return this.data.array.length / this.data.stride;

	},

	setX: function ( index, x ) {

		this.data.array[ index * this.data.stride + this.offset ] = x;

		return this;

	},

	setY: function ( index, y ) {

		this.data.array[ index * this.data.stride + this.offset + 1 ] = y;

		return this;

	},

	setZ: function ( index, z ) {

		this.data.array[ index * this.data.stride + this.offset + 2 ] = z;

		return this;

	},

	setW: function ( index, w ) {

		this.data.array[ index * this.data.stride + this.offset + 3 ] = w;

		return this;

	},

	getX: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset ];

	},

	getY: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 1 ];

	},

	getZ: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 2 ];

	},

	getW: function ( index ) {

		return this.data.array[ index * this.data.stride + this.offset + 3 ];

	},

	setXY: function ( index, x, y ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;

		return this;

	},

	setXYZ: function ( index, x, y, z ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;

		return this;

	},

	setXYZW: function ( index, x, y, z, w ) {

		index = index * this.data.stride + this.offset;

		this.data.array[ index + 0 ] = x;
		this.data.array[ index + 1 ] = y;
		this.data.array[ index + 2 ] = z;
		this.data.array[ index + 3 ] = w;

		return this;

	}

};

// File:src/core/Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author bhouston / http://exocortex.com
 */

THREE.Geometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Geometry';

	this.vertices = [];
	this.colors = [];
	this.faces = [];
	this.faceVertexUvs = [ [] ];

	this.morphTargets = [];
	this.morphColors = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	this.hasTangents = false;

	// update flags

	this.verticesNeedUpdate = false;
	this.elementsNeedUpdate = false;
	this.uvsNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.tangentsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.lineDistancesNeedUpdate = false;

	this.groupsNeedUpdate = false;

};

THREE.Geometry.prototype = {

	constructor: THREE.Geometry,

	applyMatrix: function ( matrix ) {

		var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		for ( var i = 0, il = this.vertices.length; i < il; i ++ ) {

			var vertex = this.vertices[ i ];
			vertex.applyMatrix4( matrix );

		}

		for ( var i = 0, il = this.faces.length; i < il; i ++ ) {

			var face = this.faces[ i ];
			face.normal.applyMatrix3( normalMatrix ).normalize();

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				face.vertexNormals[ j ].applyMatrix3( normalMatrix ).normalize();

			}

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

		this.verticesNeedUpdate = true;
		this.normalsNeedUpdate = true;

	},

	fromBufferGeometry: function ( geometry ) {

		var scope = this;

		var attributes = geometry.attributes;

		var vertices = attributes.position.array;
		var indices = attributes.index !== undefined ? attributes.index.array : undefined;
		var normals = attributes.normal !== undefined ? attributes.normal.array : undefined;
		var colors = attributes.color !== undefined ? attributes.color.array : undefined;
		var uvs = attributes.uv !== undefined ? attributes.uv.array : undefined;

		var tempNormals = [];
		var tempUVs = [];

		for ( var i = 0, j = 0; i < vertices.length; i += 3, j += 2 ) {

			scope.vertices.push( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );

			if ( normals !== undefined ) {

				tempNormals.push( new THREE.Vector3( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] ) );

			}

			if ( colors !== undefined ) {

				scope.colors.push( new THREE.Color( colors[ i ], colors[ i + 1 ], colors[ i + 2 ] ) );

			}

			if ( uvs !== undefined ) {

				tempUVs.push( new THREE.Vector2( uvs[ j ], uvs[ j + 1 ] ) );

			}

		}

		var addFace = function ( a, b, c ) {

			var vertexNormals = normals !== undefined ? [ tempNormals[ a ].clone(), tempNormals[ b ].clone(), tempNormals[ c ].clone() ] : [];
			var vertexColors = colors !== undefined ? [ scope.colors[ a ].clone(), scope.colors[ b ].clone(), scope.colors[ c ].clone() ] : [];

			scope.faces.push( new THREE.Face3( a, b, c, vertexNormals, vertexColors ) );

			if ( uvs !== undefined ) {

				scope.faceVertexUvs[ 0 ].push( [ tempUVs[ a ].clone(), tempUVs[ b ].clone(), tempUVs[ c ].clone() ] );

			}

		};

		if ( indices !== undefined ) {

			var drawcalls = geometry.drawcalls;

			if ( drawcalls.length > 0 ) {

				for ( var i = 0; i < drawcalls.length; i ++ ) {

					var drawcall = drawcalls[ i ];

					var start = drawcall.start;
					var count = drawcall.count;
					var index = drawcall.index;

					for ( var j = start, jl = start + count; j < jl; j += 3 ) {

						addFace( index + indices[ j ], index + indices[ j + 1 ], index + indices[ j + 2 ] );

					}

				}

			} else {

				for ( var i = 0; i < indices.length; i += 3 ) {

					addFace( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

				}

			}

		} else {

			for ( var i = 0; i < vertices.length / 3; i += 3 ) {

				addFace( i, i + 1, i + 2 );

			}

		}

		this.computeFaceNormals();

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		var offset = this.boundingBox.center().negate();

		this.applyMatrix( new THREE.Matrix4().setPosition( offset ) );

		return offset;

	},

	normalize: function () {

		this.computeBoundingSphere();

		var center = this.boundingSphere.center;
		var radius = this.boundingSphere.radius;

		var s = radius === 0 ? 1 : 1.0 / radius;

		var matrix = new THREE.Matrix4();
		matrix.set(
			s, 0, 0, -s * center.x,
			0, s, 0, -s * center.y,
			0, 0, s, -s * center.z,
			0, 0, 0, 1
		);

		this.applyMatrix( matrix );

		return this;
	},

	computeFaceNormals: function () {

		var cb = new THREE.Vector3(), ab = new THREE.Vector3();

		for ( var f = 0, fl = this.faces.length; f < fl; f ++ ) {

			var face = this.faces[ f ];

			var vA = this.vertices[ face.a ];
			var vB = this.vertices[ face.b ];
			var vC = this.vertices[ face.c ];

			cb.subVectors( vC, vB );
			ab.subVectors( vA, vB );
			cb.cross( ab );

			cb.normalize();

			face.normal.copy( cb );

		}

	},

	computeVertexNormals: function ( areaWeighted ) {

		var v, vl, f, fl, face, vertices;

		vertices = new Array( this.vertices.length );

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ] = new THREE.Vector3();

		}

		if ( areaWeighted ) {

			// vertex normals weighted by triangle areas
			// http://www.iquilezles.org/www/articles/normals/normals.htm

			var vA, vB, vC;
			var cb = new THREE.Vector3(), ab = new THREE.Vector3();

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vA = this.vertices[ face.a ];
				vB = this.vertices[ face.b ];
				vC = this.vertices[ face.c ];

				cb.subVectors( vC, vB );
				ab.subVectors( vA, vB );
				cb.cross( ab );

				vertices[ face.a ].add( cb );
				vertices[ face.b ].add( cb );
				vertices[ face.c ].add( cb );

			}

		} else {

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				vertices[ face.a ].add( face.normal );
				vertices[ face.b ].add( face.normal );
				vertices[ face.c ].add( face.normal );

			}

		}

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			vertices[ v ].normalize();

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			var vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				vertexNormals[ 0 ].copy( vertices[ face.a ] );
				vertexNormals[ 1 ].copy( vertices[ face.b ] );
				vertexNormals[ 2 ].copy( vertices[ face.c ] );

			} else {

				vertexNormals[ 0 ] = vertices[ face.a ].clone();
				vertexNormals[ 1 ] = vertices[ face.b ].clone();
				vertexNormals[ 2 ] = vertices[ face.c ].clone();

			}

		}

	},

	computeMorphNormals: function () {

		var i, il, f, fl, face;

		// save original normals
		// - create temp variables on first access
		//   otherwise just copy (for faster repeated calls)

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			if ( ! face.__originalFaceNormal ) {

				face.__originalFaceNormal = face.normal.clone();

			} else {

				face.__originalFaceNormal.copy( face.normal );

			}

			if ( ! face.__originalVertexNormals ) face.__originalVertexNormals = [];

			for ( i = 0, il = face.vertexNormals.length; i < il; i ++ ) {

				if ( ! face.__originalVertexNormals[ i ] ) {

					face.__originalVertexNormals[ i ] = face.vertexNormals[ i ].clone();

				} else {

					face.__originalVertexNormals[ i ].copy( face.vertexNormals[ i ] );

				}

			}

		}

		// use temp geometry to compute face and vertex normals for each morph

		var tmpGeo = new THREE.Geometry();
		tmpGeo.faces = this.faces;

		for ( i = 0, il = this.morphTargets.length; i < il; i ++ ) {

			// create on first access

			if ( ! this.morphNormals[ i ] ) {

				this.morphNormals[ i ] = {};
				this.morphNormals[ i ].faceNormals = [];
				this.morphNormals[ i ].vertexNormals = [];

				var dstNormalsFace = this.morphNormals[ i ].faceNormals;
				var dstNormalsVertex = this.morphNormals[ i ].vertexNormals;

				var faceNormal, vertexNormals;

				for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

					faceNormal = new THREE.Vector3();
					vertexNormals = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3() };

					dstNormalsFace.push( faceNormal );
					dstNormalsVertex.push( vertexNormals );

				}

			}

			var morphNormals = this.morphNormals[ i ];

			// set vertices to morph target

			tmpGeo.vertices = this.morphTargets[ i ].vertices;

			// compute morph normals

			tmpGeo.computeFaceNormals();
			tmpGeo.computeVertexNormals();

			// store morph normals

			var faceNormal, vertexNormals;

			for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

				face = this.faces[ f ];

				faceNormal = morphNormals.faceNormals[ f ];
				vertexNormals = morphNormals.vertexNormals[ f ];

				faceNormal.copy( face.normal );

				vertexNormals.a.copy( face.vertexNormals[ 0 ] );
				vertexNormals.b.copy( face.vertexNormals[ 1 ] );
				vertexNormals.c.copy( face.vertexNormals[ 2 ] );

			}

		}

		// restore original normals

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			face.normal = face.__originalFaceNormal;
			face.vertexNormals = face.__originalVertexNormals;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// tangents go to vertices

		var f, fl, v, vl, i, vertexIndex,
			face, uv, vA, vB, vC, uvA, uvB, uvC,
			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r, t, test,
			tan1 = [], tan2 = [],
			sdir = new THREE.Vector3(), tdir = new THREE.Vector3(),
			tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(),
			n = new THREE.Vector3(), w;

		for ( v = 0, vl = this.vertices.length; v < vl; v ++ ) {

			tan1[ v ] = new THREE.Vector3();
			tan2[ v ] = new THREE.Vector3();

		}

		function handleTriangle( context, a, b, c, ua, ub, uc ) {

			vA = context.vertices[ a ];
			vB = context.vertices[ b ];
			vC = context.vertices[ c ];

			uvA = uv[ ua ];
			uvB = uv[ ub ];
			uvC = uv[ uc ];

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;
			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;
			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;
			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );
			sdir.set( ( t2 * x1 - t1 * x2 ) * r,
					  ( t2 * y1 - t1 * y2 ) * r,
					  ( t2 * z1 - t1 * z2 ) * r );
			tdir.set( ( s1 * x2 - s2 * x1 ) * r,
					  ( s1 * y2 - s2 * y1 ) * r,
					  ( s1 * z2 - s2 * z1 ) * r );

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];
			uv = this.faceVertexUvs[ 0 ][ f ]; // use UV layer 0 for tangents

			handleTriangle( this, face.a, face.b, face.c, 0, 1, 2 );

		}

		var faceIndex = [ 'a', 'b', 'c', 'd' ];

		for ( f = 0, fl = this.faces.length; f < fl; f ++ ) {

			face = this.faces[ f ];

			for ( i = 0; i < Math.min( face.vertexNormals.length, 3 ); i ++ ) {

				n.copy( face.vertexNormals[ i ] );

				vertexIndex = face[ faceIndex[ i ] ];

				t = tan1[ vertexIndex ];

				// Gram-Schmidt orthogonalize

				tmp.copy( t );
				tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

				// Calculate handedness

				tmp2.crossVectors( face.vertexNormals[ i ], t );
				test = tmp2.dot( tan2[ vertexIndex ] );
				w = ( test < 0.0 ) ? - 1.0 : 1.0;

				face.vertexTangents[ i ] = new THREE.Vector4( tmp.x, tmp.y, tmp.z, w );

			}

		}

		this.hasTangents = true;

	},

	computeLineDistances: function () {

		var d = 0;
		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			if ( i > 0 ) {

				d += vertices[ i ].distanceTo( vertices[ i - 1 ] );

			}

			this.lineDistances[ i ] = d;

		}

	},

	computeBoundingBox: function () {

		if ( this.boundingBox === null ) {

			this.boundingBox = new THREE.Box3();

		}

		this.boundingBox.setFromPoints( this.vertices );

	},

	computeBoundingSphere: function () {

		if ( this.boundingSphere === null ) {

			this.boundingSphere = new THREE.Sphere();

		}

		this.boundingSphere.setFromPoints( this.vertices );

	},

	merge: function ( geometry, matrix ) {

		if ( geometry instanceof THREE.Geometry === false ) {

			console.error( 'THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.', geometry );
			return;

		}

		var normalMatrix,
		vertexOffset = this.vertices.length,
		vertices1 = this.vertices,
		vertices2 = geometry.vertices,
		faces1 = this.faces,
		faces2 = geometry.faces,
		uvs1 = this.faceVertexUvs[ 0 ],
		uvs2 = geometry.faceVertexUvs[ 0 ];

		if ( matrix !== undefined ) {

			normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

		}

		// vertices

		for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

			var vertex = vertices2[ i ];

			var vertexCopy = vertex.clone();

			if ( matrix !== undefined ) vertexCopy.applyMatrix4( matrix );

			vertices1.push( vertexCopy );

		}

		// faces

		for ( i = 0, il = faces2.length; i < il; i ++ ) {

			var face = faces2[ i ], faceCopy, normal, color,
			faceVertexNormals = face.vertexNormals,
			faceVertexColors = face.vertexColors;

			faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );
			faceCopy.normal.copy( face.normal );

			if ( normalMatrix !== undefined ) {

				faceCopy.normal.applyMatrix3( normalMatrix ).normalize();

			}

			for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

				normal = faceVertexNormals[ j ].clone();

				if ( normalMatrix !== undefined ) {

					normal.applyMatrix3( normalMatrix ).normalize();

				}

				faceCopy.vertexNormals.push( normal );

			}

			faceCopy.color.copy( face.color );

			for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

				color = faceVertexColors[ j ];
				faceCopy.vertexColors.push( color.clone() );

			}

			faces1.push( faceCopy );

		}

		// uvs

		for ( i = 0, il = uvs2.length; i < il; i ++ ) {

			var uv = uvs2[ i ], uvCopy = [];

			if ( uv === undefined ) {

				continue;

			}

			for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

				uvCopy.push( uv[ j ].clone() );

			}

			uvs1.push( uvCopy );

		}

	},

	mergeMesh: function ( mesh ) {

		if ( mesh instanceof THREE.Mesh === false ) {

			console.error( 'THREE.Geometry.mergeMesh(): mesh not an instance of THREE.Mesh.', mesh );
			return;

		}

		mesh.matrixAutoUpdate && mesh.updateMatrix();

		this.merge( mesh.geometry, mesh.matrix );

	},

	/*
	 * Checks for duplicate vertices with hashmap.
	 * Duplicated vertices are removed
	 * and faces' vertices are updated.
	 */

	mergeVertices: function () {

		var verticesMap = {}; // Hashmap for looking up vertice by position coordinates (and making sure they are unique)
		var unique = [], changes = [];

		var v, key;
		var precisionPoints = 4; // number of decimal points, eg. 4 for epsilon of 0.0001
		var precision = Math.pow( 10, precisionPoints );
		var i, il, face;
		var indices, j, jl;

		for ( i = 0, il = this.vertices.length; i < il; i ++ ) {

			v = this.vertices[ i ];
			key = Math.round( v.x * precision ) + '_' + Math.round( v.y * precision ) + '_' + Math.round( v.z * precision );

			if ( verticesMap[ key ] === undefined ) {

				verticesMap[ key ] = i;
				unique.push( this.vertices[ i ] );
				changes[ i ] = unique.length - 1;

			} else {

				//console.log('Duplicate vertex found. ', i, ' could be using ', verticesMap[key]);
				changes[ i ] = changes[ verticesMap[ key ] ];

			}

		}


		// if faces are completely degenerate after merging vertices, we
		// have to remove them from the geometry.
		var faceIndicesToRemove = [];

		for ( i = 0, il = this.faces.length; i < il; i ++ ) {

			face = this.faces[ i ];

			face.a = changes[ face.a ];
			face.b = changes[ face.b ];
			face.c = changes[ face.c ];

			indices = [ face.a, face.b, face.c ];

			var dupIndex = - 1;

			// if any duplicate vertices are found in a Face3
			// we have to remove the face as nothing can be saved
			for ( var n = 0; n < 3; n ++ ) {
				if ( indices[ n ] === indices[ ( n + 1 ) % 3 ] ) {

					dupIndex = n;
					faceIndicesToRemove.push( i );
					break;

				}
			}

		}

		for ( i = faceIndicesToRemove.length - 1; i >= 0; i -- ) {
			var idx = faceIndicesToRemove[ i ];

			this.faces.splice( idx, 1 );

			for ( j = 0, jl = this.faceVertexUvs.length; j < jl; j ++ ) {

				this.faceVertexUvs[ j ].splice( idx, 1 );

			}

		}

		// Use unique set of vertices

		var diff = this.vertices.length - unique.length;
		this.vertices = unique;
		return diff;

	},

	toJSON: function () {

		var data = {
			metadata: {
				version: 4.4,
				type: 'Geometry',
				generator: 'Geometry.toJSON'
			}
		};

		// standard Geometry serialization

		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		var vertices = [];

		for ( var i = 0; i < this.vertices.length; i ++ ) {

			var vertex = this.vertices[ i ];
			vertices.push( vertex.x, vertex.y, vertex.z );

		}

		var faces = [];
		var normals = [];
		var normalsHash = {};
		var colors = [];
		var colorsHash = {};
		var uvs = [];
		var uvsHash = {};

		for ( var i = 0; i < this.faces.length; i ++ ) {

			var face = this.faces[ i ];

			var hasMaterial = false; // face.materialIndex !== undefined;
			var hasFaceUv = false; // deprecated
			var hasFaceVertexUv = this.faceVertexUvs[ 0 ][ i ] !== undefined;
			var hasFaceNormal = face.normal.length() > 0;
			var hasFaceVertexNormal = face.vertexNormals.length > 0;
			var hasFaceColor = face.color.r !== 1 || face.color.g !== 1 || face.color.b !== 1;
			var hasFaceVertexColor = face.vertexColors.length > 0;

			var faceType = 0;

			faceType = setBit( faceType, 0, 0 );
			faceType = setBit( faceType, 1, hasMaterial );
			faceType = setBit( faceType, 2, hasFaceUv );
			faceType = setBit( faceType, 3, hasFaceVertexUv );
			faceType = setBit( faceType, 4, hasFaceNormal );
			faceType = setBit( faceType, 5, hasFaceVertexNormal );
			faceType = setBit( faceType, 6, hasFaceColor );
			faceType = setBit( faceType, 7, hasFaceVertexColor );

			faces.push( faceType );
			faces.push( face.a, face.b, face.c );

			if ( hasFaceVertexUv ) {

				var faceVertexUvs = this.faceVertexUvs[ 0 ][ i ];

				faces.push(
					getUvIndex( faceVertexUvs[ 0 ] ),
					getUvIndex( faceVertexUvs[ 1 ] ),
					getUvIndex( faceVertexUvs[ 2 ] )
				);

			}

			if ( hasFaceNormal ) {

				faces.push( getNormalIndex( face.normal ) );

			}

			if ( hasFaceVertexNormal ) {

				var vertexNormals = face.vertexNormals;

				faces.push(
					getNormalIndex( vertexNormals[ 0 ] ),
					getNormalIndex( vertexNormals[ 1 ] ),
					getNormalIndex( vertexNormals[ 2 ] )
				);

			}

			if ( hasFaceColor ) {

				faces.push( getColorIndex( face.color ) );

			}

			if ( hasFaceVertexColor ) {

				var vertexColors = face.vertexColors;

				faces.push(
					getColorIndex( vertexColors[ 0 ] ),
					getColorIndex( vertexColors[ 1 ] ),
					getColorIndex( vertexColors[ 2 ] )
				);

			}

		}

		function setBit( value, position, enabled ) {

			return enabled ? value | ( 1 << position ) : value & ( ~ ( 1 << position) );

		}

		function getNormalIndex( normal ) {

			var hash = normal.x.toString() + normal.y.toString() + normal.z.toString();

			if ( normalsHash[ hash ] !== undefined ) {

				return normalsHash[ hash ];

			}

			normalsHash[ hash ] = normals.length / 3;
			normals.push( normal.x, normal.y, normal.z );

			return normalsHash[ hash ];

		}

		function getColorIndex( color ) {

			var hash = color.r.toString() + color.g.toString() + color.b.toString();

			if ( colorsHash[ hash ] !== undefined ) {

				return colorsHash[ hash ];

			}

			colorsHash[ hash ] = colors.length;
			colors.push( color.getHex() );

			return colorsHash[ hash ];

		}

		function getUvIndex( uv ) {

			var hash = uv.x.toString() + uv.y.toString();

			if ( uvsHash[ hash ] !== undefined ) {

				return uvsHash[ hash ];

			}

			uvsHash[ hash ] = uvs.length / 2;
			uvs.push( uv.x, uv.y );

			return uvsHash[ hash ];

		}

		data.data = {};

		data.data.vertices = vertices;
		data.data.normals = normals;
		if ( colors.length > 0 ) data.data.colors = colors;
		if ( uvs.length > 0 ) data.data.uvs = [ uvs ]; // temporal backward compatibility
		data.data.faces = faces;

		return data;

	},

	clone: function () {

		var geometry = new THREE.Geometry();

		var vertices = this.vertices;

		for ( var i = 0, il = vertices.length; i < il; i ++ ) {

			geometry.vertices.push( vertices[ i ].clone() );

		}

		var faces = this.faces;

		for ( var i = 0, il = faces.length; i < il; i ++ ) {

			geometry.faces.push( faces[ i ].clone() );

		}

		for ( var i = 0, il = this.faceVertexUvs.length; i < il; i ++ ) {

			var faceVertexUvs = this.faceVertexUvs[ i ];

			if ( geometry.faceVertexUvs[ i ] === undefined ) {

				geometry.faceVertexUvs[ i ] = [];

			}

			for ( var j = 0, jl = faceVertexUvs.length; j < jl; j ++ ) {

				var uvs = faceVertexUvs[ j ], uvsCopy = [];

				for ( var k = 0, kl = uvs.length; k < kl; k ++ ) {

					var uv = uvs[ k ];

					uvsCopy.push( uv.clone() );

				}

				geometry.faceVertexUvs[ i ].push( uvsCopy );

			}

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Geometry.prototype );

THREE.GeometryIdCount = 0;

// File:src/core/DirectGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.DirectGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'DirectGeometry';

	this.indices = [];
	this.vertices = [];
	this.colors = [];
	this.normals = [];
	this.colors = [];
	this.uvs = [];
	this.uvs2 = [];

	this.morphTargets = [];
	this.morphColors = [];
	this.morphNormals = [];

	this.skinWeights = [];
	this.skinIndices = [];

	// this.lineDistances = [];

	this.boundingBox = null;
	this.boundingSphere = null;

	// update flags

	this.verticesNeedUpdate = false;
	this.normalsNeedUpdate = false;
	this.colorsNeedUpdate = false;
	this.uvsNeedUpdate = false;

};

THREE.DirectGeometry.prototype = {

	constructor: THREE.DirectGeometry,

	computeBoundingBox: THREE.Geometry.prototype.computeBoundingBox,
	computeBoundingSphere: THREE.Geometry.prototype.computeBoundingSphere,

	computeFaceNormals: function () {

		console.warn( 'THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.' );
		return this;

	},

	computeVertexNormals: function () {

		console.warn( 'THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.' );
		return this;

	},

	fromGeometry: function ( geometry ) {

		var faces = geometry.faces;
		var vertices = geometry.vertices;
		var faceVertexUvs = geometry.faceVertexUvs;

		var hasFaceVertexUv = faceVertexUvs[ 0 ] && faceVertexUvs[ 0 ].length > 0;
		var hasFaceVertexUv2 = faceVertexUvs[ 1 ] && faceVertexUvs[ 1 ].length > 0;

		// morphs

		var morphTargets = geometry.morphTargets;
		var morphTargetsLength = morphTargets.length;

		for ( var i = 0; i < morphTargetsLength; i ++ ) {

			this.morphTargets[ i ] = [];

		}

		var morphNormals = geometry.morphNormals;
		var morphNormalsLength = morphNormals.length;

		for ( var i = 0; i < morphNormalsLength; i ++ ) {

			this.morphNormals[ i ] = [];

		}

		var morphColors = geometry.morphColors;
		var morphColorsLength = morphColors.length;

		for ( var i = 0; i < morphColorsLength; i ++ ) {

			this.morphColors[ i ] = [];

		}

		// skins

		var skinIndices = geometry.skinIndices;
		var skinWeights = geometry.skinWeights;

		var hasSkinIndices = skinIndices.length === vertices.length;
		var hasSkinWeights = skinWeights.length === vertices.length;

		//

		for ( var i = 0; i < faces.length; i ++ ) {

			var face = faces[ i ];

			this.vertices.push( vertices[ face.a ], vertices[ face.b ], vertices[ face.c ] );

			var vertexNormals = face.vertexNormals;

			if ( vertexNormals.length === 3 ) {

				this.normals.push( vertexNormals[ 0 ], vertexNormals[ 1 ], vertexNormals[ 2 ] );

			} else {

				var normal = face.normal;

				this.normals.push( normal, normal, normal );

			}

			var vertexColors = face.vertexColors;

			if ( vertexColors.length === 3 ) {

				this.colors.push( vertexColors[ 0 ], vertexColors[ 1 ], vertexColors[ 2 ] );

			} else {

				var color = face.color;

				this.colors.push( color, color, color );

			}

			if ( hasFaceVertexUv === true ) {

				var vertexUvs = faceVertexUvs[ 0 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.BufferGeometry.fromGeometry(): Undefined vertexUv', i );

					this.uvs.push( new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() );

				}

			}

			if ( hasFaceVertexUv2 === true ) {

				var vertexUvs = faceVertexUvs[ 1 ][ i ];

				if ( vertexUvs !== undefined ) {

					this.uvs2.push( vertexUvs[ 0 ], vertexUvs[ 1 ], vertexUvs[ 2 ] );

				} else {

					console.warn( 'THREE.BufferGeometry.fromGeometry(): Undefined vertexUv2', i );

					this.uvs2.push( new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() );

				}

			}

			// morphs

			for ( var j = 0; j < morphTargetsLength; j ++ ) {

				var morphTarget = morphTargets[ j ].vertices;

				this.morphTargets[ j ].push( morphTarget[ face.a ], morphTarget[ face.b ], morphTarget[ face.c ] );

			}
			/*
			for ( var j = 0; j < morphNormalsLength; j ++ ) {

				var morphNormal = morphNormals[ j ].vertexNormals[ i ];

				this.morphNormals[ j ].push( morphNormal.a, morphNormal.b, morphNormal.c );

			}

			for ( var j = 0; j < morphColorsLength; j ++ ) {

				var morphColor = morphColors[ j ].colors;

				this.morphColors[ j ].push( morphColor[ face.a ], morphColor[ face.b ], morphColor[ face.c ] );

			}
			*/

			// skins

			if ( hasSkinIndices ) {

				this.skinIndices.push( skinIndices[ face.a ], skinIndices[ face.b ], skinIndices[ face.c ] );

			}

			if ( hasSkinWeights ) {

				this.skinWeights.push( skinWeights[ face.a ], skinWeights[ face.b ], skinWeights[ face.c ] );

			}

		}

		this.verticesNeedUpdate = geometry.verticesNeedUpdate;
		this.normalsNeedUpdate = geometry.normalsNeedUpdate;
		this.colorsNeedUpdate = geometry.colorsNeedUpdate;
		this.uvsNeedUpdate = geometry.uvsNeedUpdate;

		return this;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.DirectGeometry.prototype );

// File:src/core/BufferGeometry.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometry = function () {

	Object.defineProperty( this, 'id', { value: THREE.GeometryIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'BufferGeometry';

	this.attributes = {};

	this.morphAttributes = [];

	this.drawcalls = [];
	this.offsets = this.drawcalls; // backwards compatibility

	this.boundingBox = null;
	this.boundingSphere = null;

};

THREE.BufferGeometry.prototype = {

	constructor: THREE.BufferGeometry,

	addAttribute: function ( name, attribute ) {

		if ( attribute instanceof THREE.BufferAttribute === false && attribute instanceof THREE.InterleavedBufferAttribute === false ) {

			console.warn( 'THREE.BufferGeometry: .addAttribute() now expects ( name, attribute ).' );

			this.attributes[ name ] = { array: arguments[ 1 ], itemSize: arguments[ 2 ] };

			return;

		}

		this.attributes[ name ] = attribute;

	},

	getAttribute: function ( name ) {

		return this.attributes[ name ];

	},

	addDrawCall: function ( start, count, indexOffset ) {

		this.drawcalls.push( {

			start: start,
			count: count,
			index: indexOffset !== undefined ? indexOffset : 0

		} );

	},

	applyMatrix: function ( matrix ) {

		var position = this.attributes.position;

		if ( position !== undefined ) {

			matrix.applyToVector3Array( position.array );
			position.needsUpdate = true;

		}

		var normal = this.attributes.normal;

		if ( normal !== undefined ) {

			var normalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );

			normalMatrix.applyToVector3Array( normal.array );
			normal.needsUpdate = true;

		}

		if ( this.boundingBox !== null ) {

			this.computeBoundingBox();

		}

		if ( this.boundingSphere !== null ) {

			this.computeBoundingSphere();

		}

	},

	copy: function ( geometry ) {

		var attributes = geometry.attributes;
		var offsets = geometry.offsets;

		for ( var name in attributes ) {

			var attribute = attributes[ name ];

			this.addAttribute( name, attribute.clone() );

		}

		for ( var i = 0, il = offsets.length; i < il; i ++ ) {

			var offset = offsets[ i ];

			this.offsets.push( {

				start: offset.start,
				index: offset.index,
				count: offset.count

			} );

		}

		return this;

	},

	center: function () {

		this.computeBoundingBox();

		var offset = this.boundingBox.center().negate();

		this.applyMatrix( new THREE.Matrix4().setPosition( offset ) );

		return offset;

	},

	setFromObject: function ( object ) {

		console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

		var geometry = object.geometry;
		var material = object.material;

		if ( object instanceof THREE.PointCloud || object instanceof THREE.Line ) {

			var positions = new THREE.Float32Attribute( geometry.vertices.length * 3, 3 );
			var colors = new THREE.Float32Attribute( geometry.colors.length * 3, 3 );

			this.addAttribute( 'position', positions.copyVector3sArray( geometry.vertices ) );
			this.addAttribute( 'color', colors.copyColorsArray( geometry.colors ) );

			if ( geometry.boundingSphere !== null ) {

				this.boundingSphere = geometry.boundingSphere.clone();

			}

			if ( geometry.boundingBox !== null ) {

				this.boundingBox = geometry.boundingBox.clone();

			}

		} else if ( object instanceof THREE.Mesh ) {

			if ( geometry instanceof THREE.Geometry ) {

				this.fromGeometry( geometry );

			}

		}

		return this;

	},

	updateFromObject: function ( object ) {

		var geometry = object.geometry;

		if ( object instanceof THREE.Mesh ) {

			var direct = geometry.__directGeometry;

			direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
			direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
			direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
			direct.uvsNeedUpdate = geometry.uvsNeedUpdate;

			geometry.verticesNeedUpdate = false;
			geometry.normalsNeedUpdate = false;
			geometry.colorsNeedUpdate = false;
			geometry.uvsNeedUpdate = false;

			geometry = direct;

		}

		if ( geometry.verticesNeedUpdate === true ) {

			var attribute = this.attributes.position;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.vertices );
				attribute.needsUpdate = true;

			}

			geometry.verticesNeedUpdate = false;

		}

		if ( geometry.normalsNeedUpdate === true ) {

			var attribute = this.attributes.normal;

			if ( attribute !== undefined ) {

				attribute.copyVector3sArray( geometry.normals );
				attribute.needsUpdate = true;

			}

			geometry.normalsNeedUpdate = false;

		}

		if ( geometry.colorsNeedUpdate === true ) {

			var attribute = this.attributes.color;

			if ( attribute !== undefined ) {

				attribute.copyColorsArray( geometry.colors );
				attribute.needsUpdate = true;

			}

			geometry.colorsNeedUpdate = false;

		}

		return this;

	},

	fromGeometry: function ( geometry ) {

		geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry( geometry );

		return this.fromDirectGeometry( geometry.__directGeometry );

	},

	fromDirectGeometry: function ( geometry ) {

		if ( geometry.indices.length > 0 ) {

			var indices = new Uint16Array( geometry.indices.length * 3 );
			this.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ).copyIndicesArray( geometry.indices ) );

		}

		if ( geometry.vertices.length > 0 ) {

			var positions = new Float32Array( geometry.vertices.length * 3 );
			this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).copyVector3sArray( geometry.vertices ) );

		}

		if ( geometry.normals.length > 0 ) {

			var normals = new Float32Array( geometry.normals.length * 3 );
			this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ).copyVector3sArray( geometry.normals ) );

		}

		if ( geometry.colors.length > 0 ) {

			var colors = new Float32Array( geometry.colors.length * 3 );
			this.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).copyColorsArray( geometry.colors ) );

		}

		if ( geometry.uvs.length > 0 ) {

			var uvs = new Float32Array( geometry.uvs.length * 2 );
			this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ).copyVector2sArray( geometry.uvs ) );

		}

		// morphs

		if ( geometry.morphTargets.length > 0 ) {

			var morphTargets = geometry.morphTargets;

			for ( var i = 0, l = morphTargets.length; i < l; i ++ ) {

				var morphTarget = morphTargets[ i ];

				var attribute = new THREE.Float32Attribute( morphTarget.length * 3, 3 );

				this.morphAttributes.push( attribute.copyVector3sArray( morphTarget ) );

			}

			// TODO normals, colors

		}

		// skinning

		if ( geometry.skinIndices.length > 0 ) {

			var skinIndices = new THREE.Float32Attribute( geometry.skinIndices.length * 4, 4 );
			this.addAttribute( 'skinIndex', skinIndices.copyVector4sArray( geometry.skinIndices ) );

		}

		if ( geometry.skinWeights.length > 0 ) {

			var skinWeights = new THREE.Float32Attribute( geometry.skinWeights.length * 4, 4 );
			this.addAttribute( 'skinWeight', skinWeights.copyVector4sArray( geometry.skinWeights ) );

		}

		//

		if ( geometry.boundingSphere !== null ) {

			this.boundingSphere = geometry.boundingSphere.clone();

		}

		if ( geometry.boundingBox !== null ) {

			this.boundingBox = geometry.boundingBox.clone();

		}

		return this;

	},

	computeBoundingBox: function () {

		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingBox === null ) {

				this.boundingBox = new THREE.Box3();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				var bb = this.boundingBox;
				bb.makeEmpty();

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.fromArray( positions, i );
					bb.expandByPoint( vector );

				}

			}

			if ( positions === undefined || positions.length === 0 ) {

				this.boundingBox.min.set( 0, 0, 0 );
				this.boundingBox.max.set( 0, 0, 0 );

			}

			if ( isNaN( this.boundingBox.min.x ) || isNaN( this.boundingBox.min.y ) || isNaN( this.boundingBox.min.z ) ) {

				console.error( 'THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this );

			}

		};

	}(),

	computeBoundingSphere: function () {

		var box = new THREE.Box3();
		var vector = new THREE.Vector3();

		return function () {

			if ( this.boundingSphere === null ) {

				this.boundingSphere = new THREE.Sphere();

			}

			var positions = this.attributes.position.array;

			if ( positions ) {

				box.makeEmpty();

				var center = this.boundingSphere.center;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.fromArray( positions, i );
					box.expandByPoint( vector );

				}

				box.center( center );

				// hoping to find a boundingSphere with a radius smaller than the
				// boundingSphere of the boundingBox: sqrt(3) smaller in the best case

				var maxRadiusSq = 0;

				for ( var i = 0, il = positions.length; i < il; i += 3 ) {

					vector.fromArray( positions, i );
					maxRadiusSq = Math.max( maxRadiusSq, center.distanceToSquared( vector ) );

				}

				this.boundingSphere.radius = Math.sqrt( maxRadiusSq );

				if ( isNaN( this.boundingSphere.radius ) ) {

					console.error( 'THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this );

				}

			}

		};

	}(),

	computeFaceNormals: function () {

		// backwards compatibility

	},

	computeVertexNormals: function () {

		var attributes = this.attributes;

		if ( attributes.position ) {

			var positions = attributes.position.array;

			if ( attributes.normal === undefined ) {

				this.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( positions.length ), 3 ) );

			} else {

				// reset existing normals to zero

				var normals = attributes.normal.array;

				for ( var i = 0, il = normals.length; i < il; i ++ ) {

					normals[ i ] = 0;

				}

			}

			var normals = attributes.normal.array;

			var vA, vB, vC,

			pA = new THREE.Vector3(),
			pB = new THREE.Vector3(),
			pC = new THREE.Vector3(),

			cb = new THREE.Vector3(),
			ab = new THREE.Vector3();

			// indexed elements

			if ( attributes.index ) {

				var indices = attributes.index.array;

				var offsets = ( this.offsets.length > 0 ? this.offsets : [ { start: 0, count: indices.length, index: 0 } ] );

				for ( var j = 0, jl = offsets.length; j < jl; ++ j ) {

					var start = offsets[ j ].start;
					var count = offsets[ j ].count;
					var index = offsets[ j ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						vA = ( index + indices[ i     ] ) * 3;
						vB = ( index + indices[ i + 1 ] ) * 3;
						vC = ( index + indices[ i + 2 ] ) * 3;

						pA.fromArray( positions, vA );
						pB.fromArray( positions, vB );
						pC.fromArray( positions, vC );

						cb.subVectors( pC, pB );
						ab.subVectors( pA, pB );
						cb.cross( ab );

						normals[ vA     ] += cb.x;
						normals[ vA + 1 ] += cb.y;
						normals[ vA + 2 ] += cb.z;

						normals[ vB     ] += cb.x;
						normals[ vB + 1 ] += cb.y;
						normals[ vB + 2 ] += cb.z;

						normals[ vC     ] += cb.x;
						normals[ vC + 1 ] += cb.y;
						normals[ vC + 2 ] += cb.z;

					}

				}

			} else {

				// non-indexed elements (unconnected triangle soup)

				for ( var i = 0, il = positions.length; i < il; i += 9 ) {

					pA.fromArray( positions, i );
					pB.fromArray( positions, i + 3 );
					pC.fromArray( positions, i + 6 );

					cb.subVectors( pC, pB );
					ab.subVectors( pA, pB );
					cb.cross( ab );

					normals[ i     ] = cb.x;
					normals[ i + 1 ] = cb.y;
					normals[ i + 2 ] = cb.z;

					normals[ i + 3 ] = cb.x;
					normals[ i + 4 ] = cb.y;
					normals[ i + 5 ] = cb.z;

					normals[ i + 6 ] = cb.x;
					normals[ i + 7 ] = cb.y;
					normals[ i + 8 ] = cb.z;

				}

			}

			this.normalizeNormals();

			attributes.normal.needsUpdate = true;

		}

	},

	computeTangents: function () {

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( this.attributes.index === undefined ||
			 this.attributes.position === undefined ||
			 this.attributes.normal === undefined ||
			 this.attributes.uv === undefined ) {

			console.warn( 'THREE.BufferGeometry: Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()' );
			return;

		}

		var indices = this.attributes.index.array;
		var positions = this.attributes.position.array;
		var normals = this.attributes.normal.array;
		var uvs = this.attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( this.attributes.tangent === undefined ) {

			this.addAttribute( 'tangent', new THREE.BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = this.attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var k = 0; k < nVertices; k ++ ) {

			tan1[ k ] = new THREE.Vector3();
			tan2[ k ] = new THREE.Vector3();

		}

		var vA = new THREE.Vector3(),
			vB = new THREE.Vector3(),
			vC = new THREE.Vector3(),

			uvA = new THREE.Vector2(),
			uvB = new THREE.Vector2(),
			uvC = new THREE.Vector2(),

			x1, x2, y1, y2, z1, z2,
			s1, s2, t1, t2, r;

		var sdir = new THREE.Vector3(), tdir = new THREE.Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			x1 = vB.x - vA.x;
			x2 = vC.x - vA.x;

			y1 = vB.y - vA.y;
			y2 = vC.y - vA.y;

			z1 = vB.z - vA.z;
			z2 = vC.z - vA.z;

			s1 = uvB.x - uvA.x;
			s2 = uvC.x - uvA.x;

			t1 = uvB.y - uvA.y;
			t2 = uvC.y - uvA.y;

			r = 1.0 / ( s1 * t2 - s2 * t1 );

			sdir.set(
				( t2 * x1 - t1 * x2 ) * r,
				( t2 * y1 - t1 * y2 ) * r,
				( t2 * z1 - t1 * z2 ) * r
			);

			tdir.set(
				( s1 * x2 - s2 * x1 ) * r,
				( s1 * y2 - s2 * y1 ) * r,
				( s1 * z2 - s2 * z1 ) * r
			);

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var i, il;
		var j, jl;
		var iA, iB, iC;

		if ( this.drawcalls.length === 0 ) {

			this.addDrawCall( 0, indices.length, 0 );

		}

		var drawcalls = this.drawcalls;

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleTriangle( iA, iB, iC );

			}

		}

		var tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
		var n = new THREE.Vector3(), n2 = new THREE.Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4     ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( j = 0, jl = drawcalls.length; j < jl; ++ j ) {

			var start = drawcalls[ j ].start;
			var count = drawcalls[ j ].count;
			var index = drawcalls[ j ].index;

			for ( i = start, il = start + count; i < il; i += 3 ) {

				iA = index + indices[ i ];
				iB = index + indices[ i + 1 ];
				iC = index + indices[ i + 2 ];

				handleVertex( iA );
				handleVertex( iB );
				handleVertex( iC );

			}

		}

	},

	/*
	Compute the draw offset for large models by chunking the index buffer into chunks of 65k addressable vertices.
	This method will effectively rewrite the index buffer and remap all attributes to match the new indices.
	WARNING: This method will also expand the vertex count to prevent sprawled triangles across draw offsets.
	size - Defaults to 65535 or 4294967296 if extension OES_element_index_uint supported, but allows for larger or smaller chunks.
	*/
	computeOffsets: function ( size ) {

		if ( size === undefined ) size = THREE.BufferGeometry.MaxIndex;

		var indices = this.attributes.index.array;
		var vertices = this.attributes.position.array;

		var facesCount = ( indices.length / 3 );

		var UintArray = ( ( vertices.length / 3 ) > 65535 && THREE.BufferGeometry.MaxIndex > 65535 ) ? Uint32Array : Uint16Array;

		/*
		console.log("Computing buffers in offsets of "+size+" -> indices:"+indices.length+" vertices:"+vertices.length);
		console.log("Faces to process: "+(indices.length/3));
		console.log("Reordering "+verticesCount+" vertices.");
		*/

		var sortedIndices = new UintArray( indices.length );

		var indexPtr = 0;
		var vertexPtr = 0;

		var offsets = [ { start:0, count:0, index:0 } ];
		var offset = offsets[ 0 ];

		var duplicatedVertices = 0;
		var newVerticeMaps = 0;
		var faceVertices = new Int32Array( 6 );
		var vertexMap = new Int32Array( vertices.length );
		var revVertexMap = new Int32Array( vertices.length );
		for ( var j = 0; j < vertices.length; j ++ ) { vertexMap[ j ] = - 1; revVertexMap[ j ] = - 1; }

		/*
			Traverse every face and reorder vertices in the proper offsets of 65k.
			We can have more than 'size' entries in the index buffer per offset, but only reference 'size' values.
		*/
		for ( var findex = 0; findex < facesCount; findex ++ ) {
			newVerticeMaps = 0;

			for ( var vo = 0; vo < 3; vo ++ ) {
				var vid = indices[ findex * 3 + vo ];
				if ( vertexMap[ vid ] === - 1 ) {
					//Unmapped vertice
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					newVerticeMaps ++;
				} else if ( vertexMap[ vid ] < offset.index ) {
					//Reused vertices from previous block (duplicate)
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = - 1;
					duplicatedVertices ++;
				} else {
					//Reused vertice in the current block
					faceVertices[ vo * 2 ] = vid;
					faceVertices[ vo * 2 + 1 ] = vertexMap[ vid ];
				}
			}

			var faceMax = vertexPtr + newVerticeMaps;
			if ( faceMax > ( offset.index + size ) ) {
				var new_offset = { start:indexPtr, count:0, index:vertexPtr };
				offsets.push( new_offset );
				offset = new_offset;

				//Re-evaluate reused vertices in light of new offset.
				for ( var v = 0; v < 6; v += 2 ) {
					var new_vid = faceVertices[ v + 1 ];
					if ( new_vid > - 1 && new_vid < offset.index )
						faceVertices[ v + 1 ] = - 1;
				}
			}

			//Reindex the face.
			for ( var v = 0; v < 6; v += 2 ) {
				var vid = faceVertices[ v ];
				var new_vid = faceVertices[ v + 1 ];

				if ( new_vid === - 1 )
					new_vid = vertexPtr ++;

				vertexMap[ vid ] = new_vid;
				revVertexMap[ new_vid ] = vid;
				sortedIndices[ indexPtr ++ ] = new_vid - offset.index; //XXX overflows at 16bit
				offset.count ++;
			}
		}

		/* Move all attribute values to map to the new computed indices , also expand the vertice stack to match our new vertexPtr. */
		this.reorderBuffers( sortedIndices, revVertexMap, vertexPtr );
		this.offsets = offsets; // TODO: Deprecate
		this.drawcalls = offsets;

		/*
		var orderTime = Date.now();
		console.log("Reorder time: "+(orderTime-s)+"ms");
		console.log("Duplicated "+duplicatedVertices+" vertices.");
		console.log("Compute Buffers time: "+(Date.now()-s)+"ms");
		console.log("Draw offsets: "+offsets.length);
		*/

		return offsets;

	},

	merge: function ( geometry, offset ) {

		if ( geometry instanceof THREE.BufferGeometry === false ) {

			console.error( 'THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry );
			return;

		}

		if ( offset === undefined ) offset = 0;

		var attributes = this.attributes;

		for ( var key in attributes ) {

			if ( geometry.attributes[ key ] === undefined ) continue;

			var attribute1 = attributes[ key ];
			var attributeArray1 = attribute1.array;

			var attribute2 = geometry.attributes[ key ];
			var attributeArray2 = attribute2.array;

			var attributeSize = attribute2.itemSize;

			for ( var i = 0, j = attributeSize * offset; i < attributeArray2.length; i ++, j ++ ) {

				attributeArray1[ j ] = attributeArray2[ i ];

			}

		}

		return this;

	},

	normalizeNormals: function () {

		var normals = this.attributes.normal.array;

		var x, y, z, n;

		for ( var i = 0, il = normals.length; i < il; i += 3 ) {

			x = normals[ i ];
			y = normals[ i + 1 ];
			z = normals[ i + 2 ];

			n = 1.0 / Math.sqrt( x * x + y * y + z * z );

			normals[ i     ] *= n;
			normals[ i + 1 ] *= n;
			normals[ i + 2 ] *= n;

		}

	},

	/*
		reoderBuffers:
		Reorder attributes based on a new indexBuffer and indexMap.
		indexBuffer - Uint16Array of the new ordered indices.
		indexMap - Int32Array where the position is the new vertex ID and the value the old vertex ID for each vertex.
		vertexCount - Amount of total vertices considered in this reordering (in case you want to grow the vertice stack).
	*/
	reorderBuffers: function ( indexBuffer, indexMap, vertexCount ) {

		/* Create a copy of all attributes for reordering. */
		var sortedAttributes = {};
		for ( var attr in this.attributes ) {
			if ( attr === 'index' )
				continue;
			var sourceArray = this.attributes[ attr ].array;
			sortedAttributes[ attr ] = new sourceArray.constructor( this.attributes[ attr ].itemSize * vertexCount );
		}

		/* Move attribute positions based on the new index map */
		for ( var new_vid = 0; new_vid < vertexCount; new_vid ++ ) {
			var vid = indexMap[ new_vid ];
			for ( var attr in this.attributes ) {
				if ( attr === 'index' )
					continue;
				var attrArray = this.attributes[ attr ].array;
				var attrSize = this.attributes[ attr ].itemSize;
				var sortedAttr = sortedAttributes[ attr ];
				for ( var k = 0; k < attrSize; k ++ )
					sortedAttr[ new_vid * attrSize + k ] = attrArray[ vid * attrSize + k ];
			}
		}

		/* Carry the new sorted buffers locally */
		this.attributes[ 'index' ].array = indexBuffer;
		for ( var attr in this.attributes ) {
			if ( attr === 'index' )
				continue;
			this.attributes[ attr ].array = sortedAttributes[ attr ];
			this.attributes[ attr ].numItems = this.attributes[ attr ].itemSize * vertexCount;
		}
	},

	toJSON: function () {

		var data = {
			metadata: {
				version: 4.4,
				type: 'BufferGeometry',
				generator: 'BufferGeometry.toJSON'
			}
		};

		// standard BufferGeometry serialization

		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.parameters !== undefined ) {

			var parameters = this.parameters;

			for ( var key in parameters ) {

				if ( parameters[ key ] !== undefined ) data[ key ] = parameters[ key ];

			}

			return data;

		}

		data.data = { attributes: {} };

		var attributes = this.attributes;
		var offsets = this.offsets;
		var boundingSphere = this.boundingSphere;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];

			var array = Array.prototype.slice.call( attribute.array );

			data.data.attributes[ key ] = {
				itemSize: attribute.itemSize,
				type: attribute.array.constructor.name,
				array: array
			}

		}

		if ( offsets.length > 0 ) {

			data.data.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		if ( boundingSphere !== null ) {

			data.data.boundingSphere = {
				center: boundingSphere.center.toArray(),
				radius: boundingSphere.radius
			}

		}

		return data;

	},

	clone: function () {

		var geometry = new THREE.BufferGeometry();

		for ( var attr in this.attributes ) {

			var sourceAttr = this.attributes[ attr ];
			geometry.addAttribute( attr, sourceAttr.clone() );

		}

		for ( var i = 0, il = this.offsets.length; i < il; i ++ ) {

			var offset = this.offsets[ i ];

			geometry.offsets.push( {

				start: offset.start,
				index: offset.index,
				count: offset.count

			} );

		}

		return geometry;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.BufferGeometry.prototype );

THREE.BufferGeometry.MaxIndex = 65535;

// File:src/core/InstancedBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.InstancedBufferGeometry = function () {

	THREE.BufferGeometry.call( this );

	this.type = 'InstancedBufferGeometry';
	this.maxInstancedCount = undefined;

};

THREE.InstancedBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.InstancedBufferGeometry.prototype.constructor = THREE.InstancedBufferGeometry;

THREE.InstancedBufferGeometry.prototype.addDrawCall = function ( start, count, indexOffset, instances ) {

	this.drawcalls.push( {

		start: start,
		count: count,
		index: indexOffset !== undefined ? indexOffset : 0,
		instances: instances

	} );

},

THREE.InstancedBufferGeometry.prototype.clone = function () {

	var geometry = new THREE.InstancedBufferGeometry();

	for ( var attr in this.attributes ) {

		var sourceAttr = this.attributes[attr];
		geometry.addAttribute( attr, sourceAttr.clone() );

	}

	for ( var i = 0, il = this.offsets.length; i < il; i++ ) {

		var offset = this.offsets[i];

		geometry.offsets.push( {

			start: offset.start,
			index: offset.index,
			count: offset.count,
			instances: offset.instances

		} );

	}

	return geometry;

};

THREE.EventDispatcher.prototype.apply( THREE.InstancedBufferGeometry.prototype );

// File:src/cameras/Camera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.Camera = function () {

	THREE.Object3D.call( this );

	this.type = 'Camera';

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix = new THREE.Matrix4();

};

THREE.Camera.prototype = Object.create( THREE.Object3D.prototype );
THREE.Camera.prototype.constructor = THREE.Camera;

THREE.Camera.prototype.getWorldDirection = function () {

	var quaternion = new THREE.Quaternion();

	return function ( optionalTarget ) {

		var result = optionalTarget || new THREE.Vector3();

		this.getWorldQuaternion( quaternion );

		return result.set( 0, 0, - 1 ).applyQuaternion( quaternion );

	};

}();

THREE.Camera.prototype.lookAt = function () {

	// This routine does not support cameras with rotated and/or translated parent(s)

	var m1 = new THREE.Matrix4();

	return function ( vector ) {

		m1.lookAt( this.position, vector, this.up );

		this.quaternion.setFromRotationMatrix( m1 );

	};

}();

THREE.Camera.prototype.clone = function ( camera ) {

	if ( camera === undefined ) camera = new THREE.Camera();

	THREE.Object3D.prototype.clone.call( this, camera );

	camera.matrixWorldInverse.copy( this.matrixWorldInverse );
	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

// File:src/cameras/CubeCamera.js

/**
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CubeCamera = function ( near, far, cubeResolution ) {

	THREE.Object3D.call( this );

	this.type = 'CubeCamera';

	var fov = 90, aspect = 1;

	var cameraPX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPX.up.set( 0, - 1, 0 );
	cameraPX.lookAt( new THREE.Vector3( 1, 0, 0 ) );
	this.add( cameraPX );

	var cameraNX = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNX.up.set( 0, - 1, 0 );
	cameraNX.lookAt( new THREE.Vector3( - 1, 0, 0 ) );
	this.add( cameraNX );

	var cameraPY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPY.up.set( 0, 0, 1 );
	cameraPY.lookAt( new THREE.Vector3( 0, 1, 0 ) );
	this.add( cameraPY );

	var cameraNY = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNY.up.set( 0, 0, - 1 );
	cameraNY.lookAt( new THREE.Vector3( 0, - 1, 0 ) );
	this.add( cameraNY );

	var cameraPZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraPZ.up.set( 0, - 1, 0 );
	cameraPZ.lookAt( new THREE.Vector3( 0, 0, 1 ) );
	this.add( cameraPZ );

	var cameraNZ = new THREE.PerspectiveCamera( fov, aspect, near, far );
	cameraNZ.up.set( 0, - 1, 0 );
	cameraNZ.lookAt( new THREE.Vector3( 0, 0, - 1 ) );
	this.add( cameraNZ );

	this.renderTarget = new THREE.WebGLRenderTargetCube( cubeResolution, cubeResolution, { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter } );

	this.updateCubeMap = function ( renderer, scene ) {

		if ( this.parent === undefined ) this.updateMatrixWorld();

		var renderTarget = this.renderTarget;
		var generateMipmaps = renderTarget.generateMipmaps;

		renderTarget.generateMipmaps = false;

		renderTarget.activeCubeFace = 0;
		renderer.render( scene, cameraPX, renderTarget );

		renderTarget.activeCubeFace = 1;
		renderer.render( scene, cameraNX, renderTarget );

		renderTarget.activeCubeFace = 2;
		renderer.render( scene, cameraPY, renderTarget );

		renderTarget.activeCubeFace = 3;
		renderer.render( scene, cameraNY, renderTarget );

		renderTarget.activeCubeFace = 4;
		renderer.render( scene, cameraPZ, renderTarget );

		renderTarget.generateMipmaps = generateMipmaps;

		renderTarget.activeCubeFace = 5;
		renderer.render( scene, cameraNZ, renderTarget );

		renderer.setRenderTarget( null );

	};

};

THREE.CubeCamera.prototype = Object.create( THREE.Object3D.prototype );
THREE.CubeCamera.prototype.constructor = THREE.CubeCamera;

// File:src/cameras/OrthographicCamera.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.type = 'OrthographicCamera';

	this.zoom = 1;

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = Object.create( THREE.Camera.prototype );
THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera;

THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

	var dx = ( this.right - this.left ) / ( 2 * this.zoom );
	var dy = ( this.top - this.bottom ) / ( 2 * this.zoom );
	var cx = ( this.right + this.left ) / 2;
	var cy = ( this.top + this.bottom ) / 2;

	this.projectionMatrix.makeOrthographic( cx - dx, cx + dx, cy + dy, cy - dy, this.near, this.far );

};

THREE.OrthographicCamera.prototype.clone = function () {

	var camera = new THREE.OrthographicCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.left = this.left;
	camera.right = this.right;
	camera.top = this.top;
	camera.bottom = this.bottom;

	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;
};

THREE.OrthographicCamera.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.left = this.left;
	data.object.right = this.right;
	data.object.top = this.top;
	data.object.bottom = this.bottom;
	data.object.near = this.near;
	data.object.far = this.far;

	return data;

};

// File:src/cameras/PerspectiveCamera.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.PerspectiveCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.type = 'PerspectiveCamera';

	this.zoom = 1;

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = Object.create( THREE.Camera.prototype );
THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;


/**
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	if ( frameHeight === undefined ) frameHeight = 24;

	this.fov = 2 * THREE.Math.radToDeg( Math.atan( frameHeight / ( focalLength * 2 ) ) );
	this.updateProjectionMatrix();

};


/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.PerspectiveCamera.prototype.setViewOffset = function ( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};


THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

	var fov = THREE.Math.radToDeg( 2 * Math.atan( Math.tan( THREE.Math.degToRad( this.fov ) * 0.5 ) / this.zoom ) );

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( THREE.Math.degToRad( fov * 0.5 ) ) * this.near;
		var bottom = - top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far
		);

	} else {

		this.projectionMatrix.makePerspective( fov, this.aspect, this.near, this.far );

	}

};

THREE.PerspectiveCamera.prototype.clone = function () {

	var camera = new THREE.PerspectiveCamera();

	THREE.Camera.prototype.clone.call( this, camera );

	camera.zoom = this.zoom;

	camera.fov = this.fov;
	camera.aspect = this.aspect;
	camera.near = this.near;
	camera.far = this.far;

	camera.projectionMatrix.copy( this.projectionMatrix );

	return camera;

};

THREE.PerspectiveCamera.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.fov = this.fov;
	data.object.aspect = this.aspect;
	data.object.near = this.near;
	data.object.far = this.far;

	return data;

};

// File:src/lights/Light.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Light = function ( color ) {

	THREE.Object3D.call( this );

	this.type = 'Light';
	
	this.color = new THREE.Color( color );

};

THREE.Light.prototype = Object.create( THREE.Object3D.prototype );
THREE.Light.prototype.constructor = THREE.Light;

THREE.Light.prototype.clone = function ( light ) {

	if ( light === undefined ) light = new THREE.Light();

	THREE.Object3D.prototype.clone.call( this, light );

	light.color.copy( this.color );

	return light;

};

// File:src/lights/AmbientLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AmbientLight = function ( color ) {

	THREE.Light.call( this, color );

	this.type = 'AmbientLight';

};

THREE.AmbientLight.prototype = Object.create( THREE.Light.prototype );
THREE.AmbientLight.prototype.constructor = THREE.AmbientLight;

THREE.AmbientLight.prototype.clone = function () {

	var light = new THREE.AmbientLight();

	THREE.Light.prototype.clone.call( this, light );

	return light;

};

THREE.AmbientLight.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.color = this.color.getHex();

	return data;

};

// File:src/lights/AreaLight.js

/**
 * @author MPanknin / http://www.redplant.de/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.AreaLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'AreaLight';

	this.normal = new THREE.Vector3( 0, - 1, 0 );
	this.right = new THREE.Vector3( 1, 0, 0 );

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.width = 1.0;
	this.height = 1.0;

	this.constantAttenuation = 1.5;
	this.linearAttenuation = 0.5;
	this.quadraticAttenuation = 0.1;

};

THREE.AreaLight.prototype = Object.create( THREE.Light.prototype );
THREE.AreaLight.prototype.constructor = THREE.AreaLight;


// File:src/lights/DirectionalLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DirectionalLight = function ( color, intensity ) {

	THREE.Light.call( this, color );

	this.type = 'DirectionalLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;

	this.shadowCameraLeft = - 500;
	this.shadowCameraRight = 500;
	this.shadowCameraTop = 500;
	this.shadowCameraBottom = - 500;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowCascade = false;

	this.shadowCascadeOffset = new THREE.Vector3( 0, 0, - 1000 );
	this.shadowCascadeCount = 2;

	this.shadowCascadeBias = [ 0, 0, 0 ];
	this.shadowCascadeWidth = [ 512, 512, 512 ];
	this.shadowCascadeHeight = [ 512, 512, 512 ];

	this.shadowCascadeNearZ = [ - 1.000, 0.990, 0.998 ];
	this.shadowCascadeFarZ = [ 0.990, 0.998, 1.000 ];

	this.shadowCascadeArray = [];

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.DirectionalLight.prototype = Object.create( THREE.Light.prototype );
THREE.DirectionalLight.prototype.constructor = THREE.DirectionalLight;

THREE.DirectionalLight.prototype.clone = function () {

	var light = new THREE.DirectionalLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;

	light.shadowCameraLeft = this.shadowCameraLeft;
	light.shadowCameraRight = this.shadowCameraRight;
	light.shadowCameraTop = this.shadowCameraTop;
	light.shadowCameraBottom = this.shadowCameraBottom;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	//

	light.shadowCascade = this.shadowCascade;

	light.shadowCascadeOffset.copy( this.shadowCascadeOffset );
	light.shadowCascadeCount = this.shadowCascadeCount;

	light.shadowCascadeBias = this.shadowCascadeBias.slice( 0 );
	light.shadowCascadeWidth = this.shadowCascadeWidth.slice( 0 );
	light.shadowCascadeHeight = this.shadowCascadeHeight.slice( 0 );

	light.shadowCascadeNearZ = this.shadowCascadeNearZ.slice( 0 );
	light.shadowCascadeFarZ = this.shadowCascadeFarZ.slice( 0 );

	return light;

};

THREE.DirectionalLight.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.color = this.color.getHex();
	data.object.intensity = this.intensity;

	return data;

};

// File:src/lights/HemisphereLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.HemisphereLight = function ( skyColor, groundColor, intensity ) {

	THREE.Light.call( this, skyColor );

	this.type = 'HemisphereLight';

	this.position.set( 0, 100, 0 );

	this.groundColor = new THREE.Color( groundColor );
	this.intensity = ( intensity !== undefined ) ? intensity : 1;

};

THREE.HemisphereLight.prototype = Object.create( THREE.Light.prototype );
THREE.HemisphereLight.prototype.constructor = THREE.HemisphereLight;

THREE.HemisphereLight.prototype.clone = function () {

	var light = new THREE.HemisphereLight();

	THREE.Light.prototype.clone.call( this, light );

	light.groundColor.copy( this.groundColor );
	light.intensity = this.intensity;

	return light;

};

THREE.HemisphereLight.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.color = this.color.getHex();
	data.object.groundColor = this.groundColor.getHex();

	return data;

};

// File:src/lights/PointLight.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointLight = function ( color, intensity, distance, decay ) {

	THREE.Light.call( this, color );

	this.type = 'PointLight';

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;
	this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

};

THREE.PointLight.prototype = Object.create( THREE.Light.prototype );
THREE.PointLight.prototype.constructor = THREE.PointLight;

THREE.PointLight.prototype.clone = function () {

	var light = new THREE.PointLight();

	THREE.Light.prototype.clone.call( this, light );

	light.intensity = this.intensity;
	light.distance = this.distance;
	light.decay = this.decay;

	return light;

};

THREE.PointLight.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.color = this.color.getHex();
	data.object.intensity = this.intensity;
	data.object.distance = this.distance;
	data.object.decay = this.decay;

	return data;

};

// File:src/lights/SpotLight.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpotLight = function ( color, intensity, distance, angle, exponent, decay ) {

	THREE.Light.call( this, color );

	this.type = 'SpotLight';

	this.position.set( 0, 1, 0 );
	this.target = new THREE.Object3D();

	this.intensity = ( intensity !== undefined ) ? intensity : 1;
	this.distance = ( distance !== undefined ) ? distance : 0;
	this.angle = ( angle !== undefined ) ? angle : Math.PI / 3;
	this.exponent = ( exponent !== undefined ) ? exponent : 10;
	this.decay = ( decay !== undefined ) ? decay : 1;	// for physically correct lights, should be 2.

	this.castShadow = false;
	this.onlyShadow = false;

	//

	this.shadowCameraNear = 50;
	this.shadowCameraFar = 5000;
	this.shadowCameraFov = 50;

	this.shadowCameraVisible = false;

	this.shadowBias = 0;
	this.shadowDarkness = 0.5;

	this.shadowMapWidth = 512;
	this.shadowMapHeight = 512;

	//

	this.shadowMap = null;
	this.shadowMapSize = null;
	this.shadowCamera = null;
	this.shadowMatrix = null;

};

THREE.SpotLight.prototype = Object.create( THREE.Light.prototype );
THREE.SpotLight.prototype.constructor = THREE.SpotLight;

THREE.SpotLight.prototype.clone = function () {

	var light = new THREE.SpotLight();

	THREE.Light.prototype.clone.call( this, light );

	light.target = this.target.clone();

	light.intensity = this.intensity;
	light.distance = this.distance;
	light.angle = this.angle;
	light.exponent = this.exponent;
	light.decay = this.decay;

	light.castShadow = this.castShadow;
	light.onlyShadow = this.onlyShadow;

	//

	light.shadowCameraNear = this.shadowCameraNear;
	light.shadowCameraFar = this.shadowCameraFar;
	light.shadowCameraFov = this.shadowCameraFov;

	light.shadowCameraVisible = this.shadowCameraVisible;

	light.shadowBias = this.shadowBias;
	light.shadowDarkness = this.shadowDarkness;

	light.shadowMapWidth = this.shadowMapWidth;
	light.shadowMapHeight = this.shadowMapHeight;

	return light;

};

THREE.SpotLight.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	data.object.color = this.color.getHex();
	data.object.intensity = this.intensity;
	data.object.distance = this.distance;
	data.object.angle = this.angle;
	data.object.exponent = this.exponent;
	data.object.decay = this.decay;

	return data;

};

// File:src/loaders/Cache.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Cache = {

	files: {},

	add: function ( key, file ) {

		// console.log( 'THREE.Cache', 'Adding key:', key );

		this.files[ key ] = file;

	},

	get: function ( key ) {

		// console.log( 'THREE.Cache', 'Checking key:', key );

		return this.files[ key ];

	},

	remove: function ( key ) {

		delete this.files[ key ];

	},

	clear: function () {

		this.files = {}

	}

};

// File:src/loaders/Loader.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function ( showStatus ) {

	this.showStatus = showStatus;
	this.statusDomElement = showStatus ? THREE.Loader.prototype.addStatusElement() : null;

	this.imageLoader = new THREE.ImageLoader();

	this.onLoadStart = function () {};
	this.onLoadProgress = function () {};
	this.onLoadComplete = function () {};

};

THREE.Loader.prototype = {

	constructor: THREE.Loader,

	crossOrigin: undefined,

	addStatusElement: function () {

		var e = document.createElement( 'div' );

		e.style.position = 'absolute';
		e.style.right = '0px';
		e.style.top = '0px';
		e.style.fontSize = '0.8em';
		e.style.textAlign = 'left';
		e.style.background = 'rgba(0,0,0,0.25)';
		e.style.color = '#fff';
		e.style.width = '120px';
		e.style.padding = '0.5em 0.5em 0.5em 0.5em';
		e.style.zIndex = 1000;

		e.innerHTML = 'Loading ...';

		return e;

	},

	updateProgress: function ( progress ) {

		var message = 'Loaded ';

		if ( progress.total ) {

			message += ( 100 * progress.loaded / progress.total ).toFixed( 0 ) + '%';


		} else {

			message += ( progress.loaded / 1024 ).toFixed( 2 ) + ' KB';

		}

		this.statusDomElement.innerHTML = message;

	},

	extractUrlBase: function ( url ) {

		var parts = url.split( '/' );

		if ( parts.length === 1 ) return './';

		parts.pop();

		return parts.join( '/' ) + '/';

	},

	initMaterials: function ( materials, texturePath ) {

		var array = [];

		for ( var i = 0; i < materials.length; ++ i ) {

			array[ i ] = this.createMaterial( materials[ i ], texturePath );

		}

		return array;

	},

	needsTangents: function ( materials ) {

		for ( var i = 0, il = materials.length; i < il; i ++ ) {

			var m = materials[ i ];

			if ( m instanceof THREE.ShaderMaterial ) return true;

		}

		return false;

	},

	createMaterial: function ( m, texturePath ) {

		var scope = this;

		function nearest_pow2( n ) {

			var l = Math.log( n ) / Math.LN2;
			return Math.pow( 2, Math.round(  l ) );

		}

		function create_texture( where, name, sourceFile, repeat, offset, wrap, anisotropy ) {

			var fullPath = texturePath + sourceFile;

			var texture;

			var loader = THREE.Loader.Handlers.get( fullPath );

			if ( loader !== null ) {

				texture = loader.load( fullPath );

			} else {

				texture = new THREE.Texture();

				loader = scope.imageLoader;
				loader.crossOrigin = scope.crossOrigin;
				loader.load( fullPath, function ( image ) {

					if ( THREE.Math.isPowerOfTwo( image.width ) === false ||
						 THREE.Math.isPowerOfTwo( image.height ) === false ) {

						var width = nearest_pow2( image.width );
						var height = nearest_pow2( image.height );

						var canvas = document.createElement( 'canvas' );
						canvas.width = width;
						canvas.height = height;

						var context = canvas.getContext( '2d' );
						context.drawImage( image, 0, 0, width, height );

						texture.image = canvas;

					} else {

						texture.image = image;

					}

					texture.needsUpdate = true;

				} );

			}

			texture.sourceFile = sourceFile;

			if ( repeat ) {

				texture.repeat.set( repeat[ 0 ], repeat[ 1 ] );

				if ( repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
				if ( repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

			}

			if ( offset ) {

				texture.offset.set( offset[ 0 ], offset[ 1 ] );

			}

			if ( wrap ) {

				var wrapMap = {
					'repeat': THREE.RepeatWrapping,
					'mirror': THREE.MirroredRepeatWrapping
				};

				if ( wrapMap[ wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ wrap[ 0 ] ];
				if ( wrapMap[ wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ wrap[ 1 ] ];

			}

			if ( anisotropy ) {

				texture.anisotropy = anisotropy;

			}

			where[ name ] = texture;

		}

		function rgb2hex( rgb ) {

			return ( rgb[ 0 ] * 255 << 16 ) + ( rgb[ 1 ] * 255 << 8 ) + rgb[ 2 ] * 255;

		}

		// defaults

		var mtype = 'MeshLambertMaterial';
		var mpars = { color: 0xeeeeee, opacity: 1.0, map: null, lightMap: null, normalMap: null, bumpMap: null, wireframe: false };

		// parameters from model file

		if ( m.shading ) {

			var shading = m.shading.toLowerCase();

			if ( shading === 'phong' ) mtype = 'MeshPhongMaterial';
			else if ( shading === 'basic' ) mtype = 'MeshBasicMaterial';

		}

		if ( m.blending !== undefined && THREE[ m.blending ] !== undefined ) {

			mpars.blending = THREE[ m.blending ];

		}

		if ( m.transparent !== undefined ) {

			mpars.transparent = m.transparent;

		}

		if ( m.opacity !== undefined && m.opacity < 1.0 ) {

			mpars.transparent = true;

		}

		if ( m.depthTest !== undefined ) {

			mpars.depthTest = m.depthTest;

		}

		if ( m.depthWrite !== undefined ) {

			mpars.depthWrite = m.depthWrite;

		}

		if ( m.visible !== undefined ) {

			mpars.visible = m.visible;

		}

		if ( m.flipSided !== undefined ) {

			mpars.side = THREE.BackSide;

		}

		if ( m.doubleSided !== undefined ) {

			mpars.side = THREE.DoubleSide;

		}

		if ( m.wireframe !== undefined ) {

			mpars.wireframe = m.wireframe;

		}

		if ( m.vertexColors !== undefined ) {

			if ( m.vertexColors === 'face' ) {

				mpars.vertexColors = THREE.FaceColors;

			} else if ( m.vertexColors ) {

				mpars.vertexColors = THREE.VertexColors;

			}

		}

		// colors

		if ( m.colorDiffuse ) {

			mpars.color = rgb2hex( m.colorDiffuse );

		} else if ( m.DbgColor ) {

			mpars.color = m.DbgColor;

		}

		if ( m.colorSpecular ) {

			mpars.specular = rgb2hex( m.colorSpecular );

		}

		if ( m.colorEmissive ) {

			mpars.emissive = rgb2hex( m.colorEmissive );

		}

		// modifiers

		if ( m.transparency !== undefined ) {

			console.warn( 'THREE.Loader: transparency has been renamed to opacity' );
			m.opacity = m.transparency;

		}

		if ( m.opacity !== undefined ) {

			mpars.opacity = m.opacity;

		}

		if ( m.specularCoef ) {

			mpars.shininess = m.specularCoef;

		}

		// textures

		if ( m.mapDiffuse && texturePath ) {

			create_texture( mpars, 'map', m.mapDiffuse, m.mapDiffuseRepeat, m.mapDiffuseOffset, m.mapDiffuseWrap, m.mapDiffuseAnisotropy );

		}

		if ( m.mapLight && texturePath ) {

			create_texture( mpars, 'lightMap', m.mapLight, m.mapLightRepeat, m.mapLightOffset, m.mapLightWrap, m.mapLightAnisotropy );

		}

		if ( m.mapAO && texturePath ) {

			create_texture( mpars, 'aoMap', m.mapAO, m.mapAORepeat, m.mapAOOffset, m.mapAOWrap, m.mapAOAnisotropy );

		}

		if ( m.mapBump && texturePath ) {

			create_texture( mpars, 'bumpMap', m.mapBump, m.mapBumpRepeat, m.mapBumpOffset, m.mapBumpWrap, m.mapBumpAnisotropy );

		}

		if ( m.mapNormal && texturePath ) {

			create_texture( mpars, 'normalMap', m.mapNormal, m.mapNormalRepeat, m.mapNormalOffset, m.mapNormalWrap, m.mapNormalAnisotropy );

		}

		if ( m.mapSpecular && texturePath ) {

			create_texture( mpars, 'specularMap', m.mapSpecular, m.mapSpecularRepeat, m.mapSpecularOffset, m.mapSpecularWrap, m.mapSpecularAnisotropy );

		}

		if ( m.mapAlpha && texturePath ) {

			create_texture( mpars, 'alphaMap', m.mapAlpha, m.mapAlphaRepeat, m.mapAlphaOffset, m.mapAlphaWrap, m.mapAlphaAnisotropy );

		}

		//

		if ( m.mapBumpScale ) {

			mpars.bumpScale = m.mapBumpScale;

		}

		if ( m.mapNormalFactor ) {

			mpars.normalScale = new THREE.Vector2( m.mapNormalFactor, m.mapNormalFactor );

		}

		var material = new THREE[ mtype ]( mpars );

		if ( m.DbgName !== undefined ) material.name = m.DbgName;

		return material;

	}

};

THREE.Loader.Handlers = {

	handlers: [],

	add: function ( regex, loader ) {

		this.handlers.push( regex, loader );

	},

	get: function ( file ) {

		for ( var i = 0, l = this.handlers.length; i < l; i += 2 ) {

			var regex = this.handlers[ i ];
			var loader  = this.handlers[ i + 1 ];

			if ( regex.test( file ) ) {

				return loader;

			}

		}

		return null;

	}

};

// File:src/loaders/XHRLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.XHRLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.XHRLoader.prototype = {

	constructor: THREE.XHRLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) onLoad( cached );
			return cached;

		}

		var request = new XMLHttpRequest();
		request.open( 'GET', url, true );

		request.addEventListener( 'load', function ( event ) {

			THREE.Cache.add( url, this.response );

			if ( onLoad ) onLoad( this.response );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			request.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			request.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) request.crossOrigin = this.crossOrigin;
		if ( this.responseType !== undefined ) request.responseType = this.responseType;

		request.send( null );

		scope.manager.itemStart( url );

		return request;

	},

	setResponseType: function ( value ) {

		this.responseType = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/ImageLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ImageLoader.prototype = {

	constructor: THREE.ImageLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var cached = THREE.Cache.get( url );

		if ( cached !== undefined ) {

			if ( onLoad ) onLoad( cached );
			return cached;

		}

		var image = document.createElement( 'img' );

		image.addEventListener( 'load', function ( event ) {

			THREE.Cache.add( url, this );

			if ( onLoad ) onLoad( this );

			scope.manager.itemEnd( url );

		}, false );

		if ( onProgress !== undefined ) {

			image.addEventListener( 'progress', function ( event ) {

				onProgress( event );

			}, false );

		}

		if ( onError !== undefined ) {

			image.addEventListener( 'error', function ( event ) {

				onError( event );

			}, false );

		}

		if ( this.crossOrigin !== undefined ) image.crossOrigin = this.crossOrigin;

		scope.manager.itemStart( url );

		image.src = url;

		return image;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/JSONLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.JSONLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

	this.withCredentials = false;

};

THREE.JSONLoader.prototype = Object.create( THREE.Loader.prototype );
THREE.JSONLoader.prototype.constructor = THREE.JSONLoader;

THREE.JSONLoader.prototype.load = function ( url, callback, texturePath ) {

	// todo: unify load API to for easier SceneLoader use

	texturePath = texturePath && ( typeof texturePath === 'string' ) ? texturePath : this.extractUrlBase( url );

	this.onLoadStart();
	this.loadAjaxJSON( this, url, callback, texturePath );

};

THREE.JSONLoader.prototype.loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress ) {

	var xhr = new XMLHttpRequest();

	var length = 0;

	xhr.onreadystatechange = function () {

		if ( xhr.readyState === xhr.DONE ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				if ( xhr.responseText ) {

					var json = JSON.parse( xhr.responseText );
					var metadata = json.metadata;

					if ( metadata !== undefined ) {

						if ( metadata.type === 'object' ) {

							console.error( 'THREE.JSONLoader: ' + url + ' should be loaded with THREE.ObjectLoader instead.' );
							return;

						}

						if ( metadata.type === 'scene' ) {

							console.error( 'THREE.JSONLoader: ' + url + ' seems to be a Scene. Use THREE.SceneLoader instead.' );
							return;

						}

					}

					var result = context.parse( json, texturePath );
					callback( result.geometry, result.materials );

				} else {

					console.error( 'THREE.JSONLoader: ' + url + ' seems to be unreachable or the file is empty.' );

				}

				// in context of more complex asset initialization
				// do not block on single failed file
				// maybe should go even one more level up

				context.onLoadComplete();

			} else {

				console.error( 'THREE.JSONLoader: Couldn\'t load ' + url + ' (' + xhr.status + ')' );

			}

		} else if ( xhr.readyState === xhr.LOADING ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( 'Content-Length' );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === xhr.HEADERS_RECEIVED ) {

			if ( callbackProgress !== undefined ) {

				length = xhr.getResponseHeader( 'Content-Length' );

			}

		}

	};

	xhr.open( 'GET', url, true );
	xhr.withCredentials = this.withCredentials;
	xhr.send( null );

};

THREE.JSONLoader.prototype.parse = function ( json, texturePath ) {

	var geometry = new THREE.Geometry(),
	scale = ( json.scale !== undefined ) ? 1.0 / json.scale : 1.0;

	parseModel( scale );

	parseSkin();
	parseMorphing( scale );

	geometry.computeFaceNormals();
	geometry.computeBoundingSphere();

	function parseModel( scale ) {

		function isBitSet( value, position ) {

			return value & ( 1 << position );

		}

		var i, j, fi,

		offset, zLength,

		colorIndex, normalIndex, uvIndex,

		type,
		isQuad,
		hasMaterial,
		hasFaceVertexUv,
		hasFaceNormal, hasFaceVertexNormal,
		hasFaceColor, hasFaceVertexColor,

		vertex, face, faceA, faceB, hex, normal,

		uvLayer, uv, u, v,

		faces = json.faces,
		vertices = json.vertices,
		normals = json.normals,
		colors = json.colors,

		nUvLayers = 0;

		if ( json.uvs !== undefined ) {

			// disregard empty arrays

			for ( i = 0; i < json.uvs.length; i ++ ) {

				if ( json.uvs[ i ].length ) nUvLayers ++;

			}

			for ( i = 0; i < nUvLayers; i ++ ) {

				geometry.faceVertexUvs[ i ] = [];

			}

		}

		offset = 0;
		zLength = vertices.length;

		while ( offset < zLength ) {

			vertex = new THREE.Vector3();

			vertex.x = vertices[ offset ++ ] * scale;
			vertex.y = vertices[ offset ++ ] * scale;
			vertex.z = vertices[ offset ++ ] * scale;

			geometry.vertices.push( vertex );

		}

		offset = 0;
		zLength = faces.length;

		while ( offset < zLength ) {

			type = faces[ offset ++ ];


			isQuad              = isBitSet( type, 0 );
			hasMaterial         = isBitSet( type, 1 );
			hasFaceVertexUv     = isBitSet( type, 3 );
			hasFaceNormal       = isBitSet( type, 4 );
			hasFaceVertexNormal = isBitSet( type, 5 );
			hasFaceColor	     = isBitSet( type, 6 );
			hasFaceVertexColor  = isBitSet( type, 7 );

			// console.log("type", type, "bits", isQuad, hasMaterial, hasFaceVertexUv, hasFaceNormal, hasFaceVertexNormal, hasFaceColor, hasFaceVertexColor);

			if ( isQuad ) {

				faceA = new THREE.Face3();
				faceA.a = faces[ offset ];
				faceA.b = faces[ offset + 1 ];
				faceA.c = faces[ offset + 3 ];

				faceB = new THREE.Face3();
				faceB.a = faces[ offset + 1 ];
				faceB.b = faces[ offset + 2 ];
				faceB.c = faces[ offset + 3 ];

				offset += 4;

				if ( hasMaterial ) {

					offset ++;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];
						geometry.faceVertexUvs[ i ][ fi + 1 ] = [];

						for ( j = 0; j < 4; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							if ( j !== 2 ) geometry.faceVertexUvs[ i ][ fi ].push( uv );
							if ( j !== 0 ) geometry.faceVertexUvs[ i ][ fi + 1 ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					faceA.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

					faceB.normal.copy( faceA.normal );

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 4; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);


						if ( i !== 2 ) faceA.vertexNormals.push( normal );
						if ( i !== 0 ) faceB.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					hex = colors[ colorIndex ];

					faceA.color.setHex( hex );
					faceB.color.setHex( hex );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 4; i ++ ) {

						colorIndex = faces[ offset ++ ];
						hex = colors[ colorIndex ];

						if ( i !== 2 ) faceA.vertexColors.push( new THREE.Color( hex ) );
						if ( i !== 0 ) faceB.vertexColors.push( new THREE.Color( hex ) );

					}

				}

				geometry.faces.push( faceA );
				geometry.faces.push( faceB );

			} else {

				face = new THREE.Face3();
				face.a = faces[ offset ++ ];
				face.b = faces[ offset ++ ];
				face.c = faces[ offset ++ ];

				if ( hasMaterial ) {

					offset ++;

				}

				// to get face <=> uv index correspondence

				fi = geometry.faces.length;

				if ( hasFaceVertexUv ) {

					for ( i = 0; i < nUvLayers; i ++ ) {

						uvLayer = json.uvs[ i ];

						geometry.faceVertexUvs[ i ][ fi ] = [];

						for ( j = 0; j < 3; j ++ ) {

							uvIndex = faces[ offset ++ ];

							u = uvLayer[ uvIndex * 2 ];
							v = uvLayer[ uvIndex * 2 + 1 ];

							uv = new THREE.Vector2( u, v );

							geometry.faceVertexUvs[ i ][ fi ].push( uv );

						}

					}

				}

				if ( hasFaceNormal ) {

					normalIndex = faces[ offset ++ ] * 3;

					face.normal.set(
						normals[ normalIndex ++ ],
						normals[ normalIndex ++ ],
						normals[ normalIndex ]
					);

				}

				if ( hasFaceVertexNormal ) {

					for ( i = 0; i < 3; i ++ ) {

						normalIndex = faces[ offset ++ ] * 3;

						normal = new THREE.Vector3(
							normals[ normalIndex ++ ],
							normals[ normalIndex ++ ],
							normals[ normalIndex ]
						);

						face.vertexNormals.push( normal );

					}

				}


				if ( hasFaceColor ) {

					colorIndex = faces[ offset ++ ];
					face.color.setHex( colors[ colorIndex ] );

				}


				if ( hasFaceVertexColor ) {

					for ( i = 0; i < 3; i ++ ) {

						colorIndex = faces[ offset ++ ];
						face.vertexColors.push( new THREE.Color( colors[ colorIndex ] ) );

					}

				}

				geometry.faces.push( face );

			}

		}

	}

	function parseSkin() {
		var influencesPerVertex = ( json.influencesPerVertex !== undefined ) ? json.influencesPerVertex : 2;

		if ( json.skinWeights ) {

			for ( var i = 0, l = json.skinWeights.length; i < l; i += influencesPerVertex ) {

				var x =                               json.skinWeights[ i     ];
				var y = ( influencesPerVertex > 1 ) ? json.skinWeights[ i + 1 ] : 0;
				var z = ( influencesPerVertex > 2 ) ? json.skinWeights[ i + 2 ] : 0;
				var w = ( influencesPerVertex > 3 ) ? json.skinWeights[ i + 3 ] : 0;

				geometry.skinWeights.push( new THREE.Vector4( x, y, z, w ) );

			}

		}

		if ( json.skinIndices ) {

			for ( var i = 0, l = json.skinIndices.length; i < l; i += influencesPerVertex ) {

				var a =                               json.skinIndices[ i     ];
				var b = ( influencesPerVertex > 1 ) ? json.skinIndices[ i + 1 ] : 0;
				var c = ( influencesPerVertex > 2 ) ? json.skinIndices[ i + 2 ] : 0;
				var d = ( influencesPerVertex > 3 ) ? json.skinIndices[ i + 3 ] : 0;

				geometry.skinIndices.push( new THREE.Vector4( a, b, c, d ) );

			}

		}

		geometry.bones = json.bones;

		if ( geometry.bones && geometry.bones.length > 0 && ( geometry.skinWeights.length !== geometry.skinIndices.length || geometry.skinIndices.length !== geometry.vertices.length ) ) {

			console.warn( 'THREE.JSONLoader: When skinning, number of vertices (' + geometry.vertices.length + '), skinIndices (' +
					geometry.skinIndices.length + '), and skinWeights (' + geometry.skinWeights.length + ') should match.' );

		}


		// could change this to json.animations[0] or remove completely

		geometry.animation = json.animation;
		geometry.animations = json.animations;

	}

	function parseMorphing( scale ) {

		if ( json.morphTargets !== undefined ) {

			var i, l, v, vl, dstVertices, srcVertices;

			for ( i = 0, l = json.morphTargets.length; i < l; i ++ ) {

				geometry.morphTargets[ i ] = {};
				geometry.morphTargets[ i ].name = json.morphTargets[ i ].name;
				geometry.morphTargets[ i ].vertices = [];

				dstVertices = geometry.morphTargets[ i ].vertices;
				srcVertices = json.morphTargets [ i ].vertices;

				for ( v = 0, vl = srcVertices.length; v < vl; v += 3 ) {

					var vertex = new THREE.Vector3();
					vertex.x = srcVertices[ v ] * scale;
					vertex.y = srcVertices[ v + 1 ] * scale;
					vertex.z = srcVertices[ v + 2 ] * scale;

					dstVertices.push( vertex );

				}

			}

		}

		if ( json.morphColors !== undefined ) {

			var i, l, c, cl, dstColors, srcColors, color;

			for ( i = 0, l = json.morphColors.length; i < l; i ++ ) {

				geometry.morphColors[ i ] = {};
				geometry.morphColors[ i ].name = json.morphColors[ i ].name;
				geometry.morphColors[ i ].colors = [];

				dstColors = geometry.morphColors[ i ].colors;
				srcColors = json.morphColors [ i ].colors;

				for ( c = 0, cl = srcColors.length; c < cl; c += 3 ) {

					color = new THREE.Color( 0xffaa00 );
					color.setRGB( srcColors[ c ], srcColors[ c + 1 ], srcColors[ c + 2 ] );
					dstColors.push( color );

				}

			}

		}

	}

	if ( json.materials === undefined || json.materials.length === 0 ) {

		return { geometry: geometry };

	} else {

		var materials = this.initMaterials( json.materials, texturePath );

		if ( this.needsTangents( materials ) ) {

			geometry.computeTangents();

		}

		return { geometry: geometry, materials: materials };

	}

};

// File:src/loaders/LoadingManager.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LoadingManager = function ( onLoad, onProgress, onError ) {

	var scope = this;

	var loaded = 0, total = 0;

	this.onLoad = onLoad;
	this.onProgress = onProgress;
	this.onError = onError;

	this.itemStart = function ( url ) {

		total ++;

	};

	this.itemEnd = function ( url ) {

		loaded ++;

		if ( scope.onProgress !== undefined ) {

			scope.onProgress( url, loaded, total );

		}

		if ( loaded === total && scope.onLoad !== undefined ) {

			scope.onLoad();

		}

	};

};

THREE.DefaultLoadingManager = new THREE.LoadingManager();

// File:src/loaders/BufferGeometryLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BufferGeometryLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.BufferGeometryLoader.prototype = {

	constructor: THREE.BufferGeometryLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var geometry = new THREE.BufferGeometry();

		var attributes = json.data.attributes;

		for ( var key in attributes ) {

			var attribute = attributes[ key ];
			var typedArray = new self[ attribute.type ]( attribute.array );

			geometry.addAttribute( key, new THREE.BufferAttribute( typedArray, attribute.itemSize ) );

		}

		var offsets = json.data.offsets;

		if ( offsets !== undefined ) {

			geometry.offsets = JSON.parse( JSON.stringify( offsets ) );

		}

		var boundingSphere = json.data.boundingSphere;

		if ( boundingSphere !== undefined ) {

			var center = new THREE.Vector3();

			if ( boundingSphere.center !== undefined ) {

				center.fromArray( boundingSphere.center );

			}

			geometry.boundingSphere = new THREE.Sphere( center, boundingSphere.radius );

		}

		return geometry;

	}

};

// File:src/loaders/MaterialLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var material = new THREE[ json.type ];

		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.uniforms !== undefined ) material.uniforms = json.uniforms;
		if ( json.attributes !== undefined ) material.attributes = json.attributes;
		if ( json.vertexShader !== undefined ) material.vertexShader = json.vertexShader;
		if ( json.fragmentShader !== undefined ) material.fragmentShader = json.fragmentShader;
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.shading !== undefined ) material.shading = json.shading;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.side !== undefined ) material.side = json.side;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;
		if ( json.alphaTest !== undefined ) material.alphaTest = json.alphaTest;

		// for PointCloudMaterial
		if ( json.size !== undefined ) material.size = json.size;
		if ( json.sizeAttenuation !== undefined ) material.sizeAttenuation = json.sizeAttenuation;

		if ( json.materials !== undefined ) {

			for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

				material.materials.push( this.parse( json.materials[ i ] ) );

			}

		}

		return material;

	}

};

// File:src/loaders/ObjectLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ObjectLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;
	this.texturePath = '';

};

THREE.ObjectLoader.prototype = {

	constructor: THREE.ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === '' ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json, onLoad ) {

		var geometries = this.parseGeometries( json.geometries );

		var images = this.parseImages( json.images, function () {

			if ( onLoad !== undefined ) onLoad( object );

		} );

		var textures  = this.parseTextures( json.textures, images );
		var materials = this.parseMaterials( json.materials, textures );
		var object = this.parseObject( json.object, geometries, materials );

		if ( json.images === undefined || json.images.length === 0 ) {

			if ( onLoad !== undefined ) onLoad( object );

		}

		return object;

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE.JSONLoader();
			var bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':
					case 'PlaneBufferGeometry':

						geometry = new THREE[ data.type ](
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new THREE.BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':

						geometry = new THREE.CircleGeometry(
							data.radius,
							data.segments
						);

						break;

					case 'CylinderGeometry':

						geometry = new THREE.CylinderGeometry(
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded
						);

						break;

					case 'SphereGeometry':

						geometry = new THREE.SphereGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new THREE.IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TorusGeometry':

						geometry = new THREE.TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new THREE.TorusKnotGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.p,
							data.q,
							data.heightScale
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data ).geometry;

						break;

					case 'TextGeometry':

						geometry = new THREE.TextGeometry(
							data.text,
							data.data
						);

						break;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json, textures ) {

		var materials = {};

		if ( json !== undefined ) {

			var getTexture = function ( name ) {

				if ( textures[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined texture', name );

				}

				return textures[ name ];

			};

			var loader = new THREE.MaterialLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];
				var material = loader.parse( data );

				material.uuid = data.uuid;

				if ( data.depthTest !== undefined ) material.depthTest = data.depthTest;
				if ( data.depthWrite !== undefined ) material.depthWrite = data.depthWrite;

				if ( data.name !== undefined ) material.name = data.name;

				if ( data.map !== undefined ) material.map = getTexture( data.map );

				if ( data.alphaMap !== undefined ) {

					material.alphaMap = getTexture( data.alphaMap );
					material.transparent = true;

				}

				if ( data.bumpMap !== undefined ) material.bumpMap = getTexture( data.bumpMap );
				if ( data.bumpScale !== undefined ) material.bumpScale = data.bumpScale;

				if ( data.normalMap !== undefined ) material.normalMap = getTexture( data.normalMap );
				if ( data.normalScale )	material.normalScale = new THREE.Vector2( data.normalScale, data.normalScale );

				if ( data.specularMap !== undefined ) material.specularMap = getTexture( data.specularMap );

				if ( data.envMap !== undefined ) {

					material.envMap = getTexture( data.envMap );
					material.combine = THREE.MultiplyOperation;

				}

				if ( data.reflectivity ) material.reflectivity = data.reflectivity;

				if ( data.lightMap !== undefined ) material.lightMap = getTexture( data.lightMap );
				if ( data.lightMapIntensity !== undefined ) material.lightMapIntensity = data.lightMapIntensity;

				if ( data.aoMap !== undefined ) material.aoMap = getTexture( data.aoMap );
				if ( data.aoMapIntensity !== undefined ) material.aoMapIntensity = data.aoMapIntensity;

				materials[ data.uuid ] = material;

			}

		}

		return materials;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		if ( json !== undefined && json.length > 0 ) {

			var manager = new THREE.LoadingManager( onLoad );

			var loader = new THREE.ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			var loadImage = function ( url ) {

				scope.manager.itemStart( url );

				return loader.load( url, function () {

					scope.manager.itemEnd( url );

				} );

			};

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var image = json[ i ];
				images[ image.uuid ] = loadImage( image.url );

			}

		}

		return images;

	},

	parseTextures: function ( json, images ) {

		function parseConstant( value ) {

			if ( typeof( value ) === 'number' ) return value;

			console.warn( 'THREE.ObjectLoader.parseTexture: Constant should be in numeric form.', value );

			return THREE[ value ];

		}

		var textures = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" speficied for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture = new THREE.Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;
				if ( data.mapping !== undefined ) texture.mapping = parseConstant( data.mapping );
				if ( data.repeat !== undefined ) texture.repeat = new THREE.Vector2( data.repeat[ 0 ], data.repeat[ 1 ] );
				if ( data.minFilter !== undefined ) texture.minFilter = parseConstant( data.minFilter );
				if ( data.magFilter !== undefined ) texture.magFilter = parseConstant( data.magFilter );
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;
				if ( Array.isArray( data.wrap ) ) {

					texture.wrapS = parseConstant( data.wrap[ 0 ] );
					texture.wrapT = parseConstant( data.wrap[ 1 ] );

				}

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	},

	parseObject: function () {

		var matrix = new THREE.Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			var getGeometry = function ( name ) {

				if ( geometries[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined geometry', name );

				}

				return geometries[ name ];

			};

			var getMaterial = function ( name ) {

				if ( materials[ name ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined material', name );

				}

				return materials[ name ];

			};

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent, data.decay );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					object = new THREE.Mesh( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Line':

					object = new THREE.Line( getGeometry( data.geometry ), getMaterial( data.material ), data.mode );

					break;

				case 'PointCloud':

					object = new THREE.PointCloud( getGeometry( data.geometry ), getMaterial( data.material ) );

					break;

				case 'Sprite':

					object = new THREE.Sprite( getMaterial( data.material ) );

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.castShadow !== undefined ) object.castShadow = data.castShadow;
			if ( data.receiveShadow !== undefined ) object.receiveShadow = data.receiveShadow;

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			return object;

		}

	}()

};

// File:src/loaders/TextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.TextureLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.TextureLoader.prototype = {

	constructor: THREE.TextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.ImageLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( image ) {

			var texture = new THREE.Texture( image );
			texture.needsUpdate = true;

			if ( onLoad !== undefined ) {

				onLoad( texture );

			}

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	}

};

// File:src/loaders/BinaryTextureLoader.js

/**
 * @author Nikos M. / https://github.com/foo123/
 *
 * Abstract Base class to load generic binary textures formats (rgbe, hdr, ...)
 */

THREE.DataTextureLoader = THREE.BinaryTextureLoader = function () {

	// override in sub classes
	this._parser = null;

};

THREE.BinaryTextureLoader.prototype = {

	constructor: THREE.BinaryTextureLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var texture = new THREE.DataTexture( );

		var loader = new THREE.XHRLoader();
		loader.setResponseType( 'arraybuffer' );

		loader.load( url, function ( buffer ) {

			var texData = scope._parser( buffer );

			if ( !texData ) return;

			if ( undefined !== texData.image ) {

				texture.image = texData.image;

			} else if ( undefined !== texData.data ) {

				texture.image.width = texData.width;
				texture.image.height = texData.height;
				texture.image.data = texData.data;

			}

			texture.wrapS = undefined !== texData.wrapS ? texData.wrapS : THREE.ClampToEdgeWrapping;
			texture.wrapT = undefined !== texData.wrapT ? texData.wrapT : THREE.ClampToEdgeWrapping;

			texture.magFilter = undefined !== texData.magFilter ? texData.magFilter : THREE.LinearFilter;
			texture.minFilter = undefined !== texData.minFilter ? texData.minFilter : THREE.LinearMipMapLinearFilter;

			texture.anisotropy = undefined !== texData.anisotropy ? texData.anisotropy : 1;

			if ( undefined !== texData.format ) {

				texture.format = texData.format;

			}
			if ( undefined !== texData.type ) {

				texture.type = texData.type;

			}

			if ( undefined !== texData.mipmaps ) {

				texture.mipmaps = texData.mipmaps;

			}

			if ( 1 === texData.mipmapCount ) {

				texture.minFilter = THREE.LinearFilter;

			}

			texture.needsUpdate = true;

			if ( onLoad ) onLoad( texture, texData );

		}, onProgress, onError );


		return texture;

	}

};

// File:src/loaders/CompressedTextureLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * Abstract Base class to block based textures loader (dds, pvr, ...)
 */

THREE.CompressedTextureLoader = function () {

	// override in sub classes
	this._parser = null;

};


THREE.CompressedTextureLoader.prototype = {

	constructor: THREE.CompressedTextureLoader,

	load: function ( url, onLoad, onError ) {

		var scope = this;

		var images = [];

		var texture = new THREE.CompressedTexture();
		texture.image = images;

		var loader = new THREE.XHRLoader();
		loader.setResponseType( 'arraybuffer' );

		if ( Array.isArray( url ) ) {

			var loaded = 0;

			var loadTexture = function ( i ) {

				loader.load( url[ i ], function ( buffer ) {

					var texDatas = scope._parser( buffer, true );

					images[ i ] = {
						width: texDatas.width,
						height: texDatas.height,
						format: texDatas.format,
						mipmaps: texDatas.mipmaps
					};

					loaded += 1;

					if ( loaded === 6 ) {

						if (texDatas.mipmapCount === 1)
 							texture.minFilter = THREE.LinearFilter;

						texture.format = texDatas.format;
						texture.needsUpdate = true;

						if ( onLoad ) onLoad( texture );

					}

				} );

			};

			for ( var i = 0, il = url.length; i < il; ++ i ) {

				loadTexture( i );

			}

		} else {

			// compressed cubemap texture stored in a single DDS file

			loader.load( url, function ( buffer ) {

				var texDatas = scope._parser( buffer, true );

				if ( texDatas.isCubemap ) {

					var faces = texDatas.mipmaps.length / texDatas.mipmapCount;

					for ( var f = 0; f < faces; f ++ ) {

						images[ f ] = { mipmaps : [] };

						for ( var i = 0; i < texDatas.mipmapCount; i ++ ) {

							images[ f ].mipmaps.push( texDatas.mipmaps[ f * texDatas.mipmapCount + i ] );
							images[ f ].format = texDatas.format;
							images[ f ].width = texDatas.width;
							images[ f ].height = texDatas.height;

						}

					}

				} else {

					texture.image.width = texDatas.width;
					texture.image.height = texDatas.height;
					texture.mipmaps = texDatas.mipmaps;

				}

				if ( texDatas.mipmapCount === 1 ) {

					texture.minFilter = THREE.LinearFilter;

				}

				texture.format = texDatas.format;
				texture.needsUpdate = true;

				if ( onLoad ) onLoad( texture );

			} );

		}

		return texture;

	}

};

// File:src/materials/Material.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function () {

	Object.defineProperty( this, 'id', { value: THREE.MaterialIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.type = 'Material';

	this.side = THREE.FrontSide;

	this.opacity = 1;
	this.transparent = false;

	this.blending = THREE.NormalBlending;

	this.blendSrc = THREE.SrcAlphaFactor;
	this.blendDst = THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = THREE.AddEquation;
	this.blendSrcAlpha = null;
	this.blendDstAlpha = null;
	this.blendEquationAlpha = null;

	this.depthFunc = THREE.LessEqualDepth;
	this.depthTest = true;
	this.depthWrite = true;

	this.colorWrite = true;

	this.polygonOffset = false;
	this.polygonOffsetFactor = 0;
	this.polygonOffsetUnits = 0;

	this.alphaTest = 0;

	this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

	this.visible = true;

	this._needsUpdate = true;

};

THREE.Material.prototype = {

	constructor: THREE.Material,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	setValues: function ( values ) {

		if ( values === undefined ) return;

		for ( var key in values ) {

			var newValue = values[ key ];

			if ( newValue === undefined ) {

				console.warn( "THREE.Material: '" + key + "' parameter is undefined." );
				continue;

			}

			if ( key in this ) {

				var currentValue = this[ key ];

				if ( currentValue instanceof THREE.Color ) {

					currentValue.set( newValue );

				} else if ( currentValue instanceof THREE.Vector3 && newValue instanceof THREE.Vector3 ) {

					currentValue.copy( newValue );

				} else if ( key === 'overdraw' ) {

					// ensure overdraw is backwards-compatable with legacy boolean type
					this[ key ] = Number( newValue );

				} else {

					this[ key ] = newValue;

				}

			}

		}

	},

	toJSON: function ( meta ) {

		var data = {
			metadata: {
				version: 4.4,
				type: 'Material',
				generator: 'Material.toJSON'
			}
		};

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;
		if ( this.name !== '' ) data.name = this.name;

		if ( this.color instanceof THREE.Color ) data.color = this.color.getHex();
		if ( this.emissive instanceof THREE.Color ) data.emissive = this.emissive.getHex();
		if ( this.specular instanceof THREE.Color ) data.specular = this.specular.getHex();
		if ( this.shininess !== undefined ) data.shininess = this.shininess;

		if ( this.map instanceof THREE.Texture ) data.map = this.map.toJSON( meta ).uuid;
		if ( this.alphaMap instanceof THREE.Texture ) data.alphaMap = this.alphaMap.toJSON( meta ).uuid;
		if ( this.lightMap instanceof THREE.Texture ) data.lightMap = this.lightMap.toJSON( meta ).uuid;
		if ( this.bumpMap instanceof THREE.Texture ) {
			data.bumpMap = this.bumpMap.toJSON( meta ).uuid;
			data.bumpScale = this.bumpScale;
		}
		if ( this.normalMap instanceof THREE.Texture ) {
			data.normalMap = this.normalMap.toJSON( meta ).uuid;
			data.normalScale = this.normalScale; // Removed for now, causes issue in editor ui.js
		}
		if ( this.specularMap instanceof THREE.Texture ) data.specularMap = this.specularMap.toJSON( meta ).uuid;
		if ( this.envMap instanceof THREE.Texture ) {
			data.envMap = this.envMap.toJSON( meta ).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap
		}

		if ( this.size !== undefined ) data.size = this.size;
		if ( this.sizeAttenuation !== undefined ) data.sizeAttenuation = this.sizeAttenuation;

		if ( this.vertexColors !== undefined && this.vertexColors !== THREE.NoColors ) data.vertexColors = this.vertexColors;
		if ( this.shading !== undefined && this.shading !== THREE.SmoothShading ) data.shading = this.shading;
		if ( this.blending !== undefined && this.blending !== THREE.NormalBlending ) data.blending = this.blending;
		if ( this.side !== undefined && this.side !== THREE.FrontSide ) data.side = this.side;

		if ( this.opacity < 1 ) data.opacity = this.opacity;
		if ( this.transparent === true ) data.transparent = this.transparent;
		if ( this.wireframe === true ) data.wireframe = this.wireframe;

		return data;

	},

	clone: function ( material ) {

		if ( material === undefined ) material = new THREE.Material();

		material.name = this.name;

		material.side = this.side;

		material.opacity = this.opacity;
		material.transparent = this.transparent;

		material.blending = this.blending;

		material.blendSrc = this.blendSrc;
		material.blendDst = this.blendDst;
		material.blendEquation = this.blendEquation;
		material.blendSrcAlpha = this.blendSrcAlpha;
		material.blendDstAlpha = this.blendDstAlpha;
		material.blendEquationAlpha = this.blendEquationAlpha;

		material.depthFunc = this.depthFunc;
		material.depthTest = this.depthTest;
		material.depthWrite = this.depthWrite;

		material.polygonOffset = this.polygonOffset;
		material.polygonOffsetFactor = this.polygonOffsetFactor;
		material.polygonOffsetUnits = this.polygonOffsetUnits;

		material.alphaTest = this.alphaTest;

		material.overdraw = this.overdraw;

		material.visible = this.visible;

		return material;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Material.prototype );

THREE.MaterialIdCount = 0;

// File:src/materials/LineBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round",
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineBasicMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;
	this.linecap = 'round';
	this.linejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineBasicMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;

THREE.LineBasicMaterial.prototype.clone = function () {

	var material = new THREE.LineBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;
	material.linecap = this.linecap;
	material.linejoin = this.linejoin;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/LineDashedMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>,
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineDashedMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'LineDashedMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.linewidth = 1;

	this.scale = 1;
	this.dashSize = 3;
	this.gapSize = 1;

	this.vertexColors = false;

	this.fog = true;

	this.setValues( parameters );

};

THREE.LineDashedMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.LineDashedMaterial.prototype.constructor = THREE.LineDashedMaterial;

THREE.LineDashedMaterial.prototype.clone = function () {

	var material = new THREE.LineDashedMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.linewidth = this.linewidth;

	material.scale = this.scale;
	material.dashSize = this.dashSize;
	material.gapSize = this.gapSize;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// File:src/materials/MeshBasicMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshBasicMaterial';

	this.color = new THREE.Color( 0xffffff ); // emissive

	this.map = null;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshBasicMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;

THREE.MeshBasicMaterial.prototype.clone = function () {

	var material = new THREE.MeshBasicMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.aoMap = this.aoMap;
	material.aoMapIntensity = this.aoMapIntensity;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;

	return material;

};

// File:src/materials/MeshLambertMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  emissive: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshLambertMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshLambertMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.emissive = new THREE.Color( 0x000000 );

	this.map = null;

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshLambertMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshLambertMaterial.prototype.constructor = THREE.MeshLambertMaterial;

THREE.MeshLambertMaterial.prototype.clone = function () {

	var material = new THREE.MeshLambertMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.emissive.copy( this.emissive );

	material.map = this.map;

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshPhongMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  emissive: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshPhongMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshPhongMaterial';

	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.emissive = new THREE.Color( 0x000000 );
	this.specular = new THREE.Color( 0x111111 );
	this.shininess = 30;

	this.metal = false;

	this.map = null;

	this.lightMap = null;
	this.lightMapIntensity = 1.0;

	this.aoMap = null;
	this.aoMapIntensity = 1.0;

	this.bumpMap = null;
	this.bumpScale = 1;

	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );

	this.specularMap = null;

	this.alphaMap = null;

	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;

	this.fog = true;

	this.shading = THREE.SmoothShading;

	this.wireframe = false;
	this.wireframeLinewidth = 1;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	this.vertexColors = THREE.NoColors;

	this.skinning = false;
	this.morphTargets = false;
	this.morphNormals = false;

	this.setValues( parameters );

};

THREE.MeshPhongMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshPhongMaterial.prototype.constructor = THREE.MeshPhongMaterial;

THREE.MeshPhongMaterial.prototype.clone = function () {

	var material = new THREE.MeshPhongMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.emissive.copy( this.emissive );
	material.specular.copy( this.specular );
	material.shininess = this.shininess;

	material.metal = this.metal;

	material.map = this.map;

	material.lightMap = this.lightMap;
	material.lightMapIntensity = this.lightMapIntensity;

	material.aoMap = this.aoMap;
	material.aoMapIntensity = this.aoMapIntensity;

	material.bumpMap = this.bumpMap;
	material.bumpScale = this.bumpScale;

	material.normalMap = this.normalMap;
	material.normalScale.copy( this.normalScale );

	material.specularMap = this.specularMap;

	material.alphaMap = this.alphaMap;

	material.envMap = this.envMap;
	material.combine = this.combine;
	material.reflectivity = this.reflectivity;
	material.refractionRatio = this.refractionRatio;

	material.fog = this.fog;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;
	material.wireframeLinecap = this.wireframeLinecap;
	material.wireframeLinejoin = this.wireframeLinejoin;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;
	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

// File:src/materials/MeshDepthMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshDepthMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'MeshDepthMaterial';

	this.morphTargets = false;
	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.setValues( parameters );

};

THREE.MeshDepthMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshDepthMaterial.prototype.constructor = THREE.MeshDepthMaterial;

THREE.MeshDepthMaterial.prototype.clone = function () {

	var material = new THREE.MeshDepthMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshNormalMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  shading: THREE.FlatShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

THREE.MeshNormalMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	this.type = 'MeshNormalMaterial';

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.morphTargets = false;

	this.setValues( parameters );

};

THREE.MeshNormalMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.MeshNormalMaterial.prototype.constructor = THREE.MeshNormalMaterial;

THREE.MeshNormalMaterial.prototype.clone = function () {

	var material = new THREE.MeshNormalMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	return material;

};

// File:src/materials/MeshFaceMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MeshFaceMaterial = function ( materials ) {

	console.error( 'THREE.MeshFaceMaterial has been removed.' );

	var material = Array.isArray( materials ) ? materials[ 0 ] : new THREE.MeshBasicMaterial();
	material.materials = []; // temporal workaround

	return material;

};

// File:src/materials/PointCloudMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  vertexColors: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.PointCloudMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'PointCloudMaterial';

	this.color = new THREE.Color( 0xffffff );

	this.map = null;

	this.size = 1;
	this.sizeAttenuation = true;

	this.vertexColors = THREE.NoColors;

	this.fog = true;

	this.setValues( parameters );

};

THREE.PointCloudMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.PointCloudMaterial.prototype.constructor = THREE.PointCloudMaterial;

THREE.PointCloudMaterial.prototype.clone = function () {

	var material = new THREE.PointCloudMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );

	material.map = this.map;

	material.size = this.size;
	material.sizeAttenuation = this.sizeAttenuation;

	material.vertexColors = this.vertexColors;

	material.fog = this.fog;

	return material;

};

// backwards compatibility

THREE.ParticleBasicMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleBasicMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

THREE.ParticleSystemMaterial = function ( parameters ) {

	console.warn( 'THREE.ParticleSystemMaterial has been renamed to THREE.PointCloudMaterial.' );
	return new THREE.PointCloudMaterial( parameters );

};

// File:src/materials/ShaderMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  defines: { "label" : "value" },
 *  uniforms: { "parameter1": { type: "f", value: 1.0 }, "parameter2": { type: "i" value2: 2 } },
 *
 *  fragmentShader: <string>,
 *  vertexShader: <string>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  lights: <bool>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.ShaderMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'ShaderMaterial';

	this.defines = {};
	this.uniforms = {};
	this.attributes = [];

	this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
	this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';

	this.shading = THREE.SmoothShading;

	this.linewidth = 1;

	this.wireframe = false;
	this.wireframeLinewidth = 1;

	this.fog = false; // set to use scene fog

	this.lights = false; // set to use scene lights

	this.vertexColors = THREE.NoColors; // set to use "color" attribute stream

	this.skinning = false; // set to use skinning attribute streams

	this.morphTargets = false; // set to use morph targets
	this.morphNormals = false; // set to use morph normals

	this.derivatives = false; // set to use derivatives

	// When rendered geometry doesn't include these attributes but the material does,
	// use these default values in WebGL. This avoids errors when buffer data is missing.
	this.defaultAttributeValues = {
		'color': [ 1, 1, 1 ],
		'uv': [ 0, 0 ],
		'uv2': [ 0, 0 ]
	};

	this.index0AttributeName = undefined;

	if ( parameters !== undefined ) {

		if ( parameters.attributes !== undefined && Array.isArray( parameters.attributes ) === false ) {

			console.warn( 'THREE.ShaderMaterial: attributes should now be an array of attribute names.' );
			parameters.attributes = Object.keys( parameters.attributes );

		}

		this.setValues( parameters );

	}

};

THREE.ShaderMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.ShaderMaterial.prototype.constructor = THREE.ShaderMaterial;

THREE.ShaderMaterial.prototype.clone = function ( material ) {

	if ( material === undefined ) material = new THREE.ShaderMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.fragmentShader = this.fragmentShader;
	material.vertexShader = this.vertexShader;

	material.uniforms = THREE.UniformsUtils.clone( this.uniforms );

	material.attributes = this.attributes;
	material.defines = this.defines;

	material.shading = this.shading;

	material.wireframe = this.wireframe;
	material.wireframeLinewidth = this.wireframeLinewidth;

	material.fog = this.fog;

	material.lights = this.lights;

	material.vertexColors = this.vertexColors;

	material.skinning = this.skinning;

	material.morphTargets = this.morphTargets;
	material.morphNormals = this.morphNormals;

	return material;

};

THREE.ShaderMaterial.prototype.toJSON = function ( meta ) {

	var data = THREE.Material.prototype.toJSON.call( this, meta );

	data.uniforms = this.uniforms;
	data.attributes = this.attributes;
	data.vertexShader = this.vertexShader;
	data.fragmentShader = this.fragmentShader;

	return data;

};

// File:src/materials/RawShaderMaterial.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.RawShaderMaterial = function ( parameters ) {

	THREE.ShaderMaterial.call( this, parameters );

	this.type = 'RawShaderMaterial';

};

THREE.RawShaderMaterial.prototype = Object.create( THREE.ShaderMaterial.prototype );
THREE.RawShaderMaterial.prototype.constructor = THREE.RawShaderMaterial;

THREE.RawShaderMaterial.prototype.clone = function () {

	var material = new THREE.RawShaderMaterial();

	THREE.ShaderMaterial.prototype.clone.call( this, material );

	return material;

};

// File:src/materials/SpriteMaterial.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2(),
 *
 *  fog: <bool>
 * }
 */

THREE.SpriteMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'SpriteMaterial';

	this.color = new THREE.Color( 0xffffff );
	this.map = null;

	this.rotation = 0;

	this.fog = false;

	// set parameters

	this.setValues( parameters );

};

THREE.SpriteMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.SpriteMaterial.prototype.constructor = THREE.SpriteMaterial;

THREE.SpriteMaterial.prototype.clone = function () {

	var material = new THREE.SpriteMaterial();

	THREE.Material.prototype.clone.call( this, material );

	material.color.copy( this.color );
	material.map = this.map;

	material.rotation = this.rotation;

	material.fog = this.fog;

	return material;

};

// File:src/textures/Texture.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	Object.defineProperty( this, 'id', { value: THREE.TextureIdCount ++ } );

	this.uuid = THREE.Math.generateUUID();

	this.name = '';
	this.sourceFile = '';

	this.image = image !== undefined ? image : THREE.Texture.DEFAULT_IMAGE;
	this.mipmaps = [];

	this.mapping = mapping !== undefined ? mapping : THREE.Texture.DEFAULT_MAPPING;

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = anisotropy !== undefined ? anisotropy : 1;

	this.format = format !== undefined ? format : THREE.RGBAFormat;
	this.type = type !== undefined ? type : THREE.UnsignedByteType;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.generateMipmaps = true;
	this.premultiplyAlpha = false;
	this.flipY = true;
	this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)

	this._needsUpdate = false;
	this.onUpdate = null;

};

THREE.Texture.DEFAULT_IMAGE = undefined;
THREE.Texture.DEFAULT_MAPPING = THREE.UVMapping;

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	get needsUpdate () {

		return this._needsUpdate;

	},

	set needsUpdate ( value ) {

		if ( value === true ) this.update();

		this._needsUpdate = value;

	},

	clone: function ( texture ) {

		if ( texture === undefined ) texture = new THREE.Texture();

		texture.image = this.image;
		texture.mipmaps = this.mipmaps.slice( 0 );

		texture.mapping = this.mapping;

		texture.wrapS = this.wrapS;
		texture.wrapT = this.wrapT;

		texture.magFilter = this.magFilter;
		texture.minFilter = this.minFilter;

		texture.anisotropy = this.anisotropy;

		texture.format = this.format;
		texture.type = this.type;

		texture.offset.copy( this.offset );
		texture.repeat.copy( this.repeat );

		texture.generateMipmaps = this.generateMipmaps;
		texture.premultiplyAlpha = this.premultiplyAlpha;
		texture.flipY = this.flipY;
		texture.unpackAlignment = this.unpackAlignment;

		return texture;

	},

	toJSON: function ( meta ) {

		if ( meta.textures[ this.uuid ] !== undefined ) {

			return meta.textures[ this.uuid ];

		}

		function getDataURL( image ) {

			var canvas;

			if ( image.toDataURL !== undefined ) {

				canvas = image;

			} else {

				canvas = document.createElement( 'canvas' );
				canvas.width = image.width;
				canvas.height = image.height;

				canvas.getContext( '2d' ).drawImage( image, 0, 0, image.width, image.height );

			}

			if ( canvas.width > 2048 || canvas.height > 2048 ) {

				return canvas.toDataURL( 'image/jpeg', 0.6 );

			} else {

				return canvas.toDataURL( 'image/png' );

			}

		}

		var output = {
			metadata: {
				version: 4.4,
				type: 'Texture',
				generator: 'Texture.toJSON'
			},

			uuid: this.uuid,
			name: this.name,

			mapping: this.mapping,

			repeat: [ this.repeat.x, this.repeat.y ],
			offset: [ this.offset.x, this.offset.y ],
			wrap: [ this.wrapS, this.wrapT ],

			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy
		};

		if ( this.image !== undefined ) {

			// TODO: Move to THREE.Image

			var image = this.image;

			if ( image.uuid === undefined ) {

				image.uuid = THREE.Math.generateUUID(); // UGH

			}

			if ( meta.images[ image.uuid ] === undefined ) {

				meta.images[ image.uuid ] = {
					uuid: image.uuid,
					url: getDataURL( image )
				};

			}

			output.image = image.uuid;

		}

		meta.textures[ this.uuid ] = output;

		return output;

	},

	update: function () {

		this.dispatchEvent( { type: 'update' } );

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.Texture.prototype );

THREE.TextureIdCount = 0;

// File:src/textures/CubeTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CubeTexture = function ( images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	mapping = mapping !== undefined ? mapping : THREE.CubeReflectionMapping;
	
	THREE.Texture.call( this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.images = images;

};

THREE.CubeTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.CubeTexture.prototype.constructor = THREE.CubeTexture;

THREE.CubeTexture.clone = function ( texture ) {

	if ( texture === undefined ) texture = new THREE.CubeTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	texture.images = this.images;

	return texture;

};

// File:src/textures/CompressedTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CompressedTexture = function ( mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { width: width, height: height };
	this.mipmaps = mipmaps;

	// no flipping for cube textures
	// (also flipping doesn't work for compressed textures )

	this.flipY = false;

	// can't generate mipmaps for compressed textures
	// mips must be embedded in DDS files

	this.generateMipmaps = false;

};

THREE.CompressedTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.CompressedTexture.prototype.constructor = THREE.CompressedTexture;

THREE.CompressedTexture.prototype.clone = function () {

	var texture = new THREE.CompressedTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/DataTexture.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.image = { data: data, width: width, height: height };

};

THREE.DataTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.DataTexture.prototype.constructor = THREE.DataTexture;

THREE.DataTexture.prototype.clone = function () {

	var texture = new THREE.DataTexture();

	THREE.Texture.prototype.clone.call( this, texture );

	return texture;

};

// File:src/textures/VideoTexture.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VideoTexture = function ( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy ) {

	THREE.Texture.call( this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

	this.generateMipmaps = false;

	var scope = this;

	var update = function () {

		requestAnimationFrame( update );

		if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

			scope.needsUpdate = true;

		}

	};

	update();

};

THREE.VideoTexture.prototype = Object.create( THREE.Texture.prototype );
THREE.VideoTexture.prototype.constructor = THREE.VideoTexture;

// File:src/objects/Group.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Group = function () {

	THREE.Object3D.call( this );

	this.type = 'Group';

};

THREE.Group.prototype = Object.create( THREE.Object3D.prototype );
THREE.Group.prototype.constructor = THREE.Group;

// File:src/objects/PointCloud.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PointCloud = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'PointCloud';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.PointCloudMaterial( { color: Math.random() * 0xffffff } );

};

THREE.PointCloud.prototype = Object.create( THREE.Object3D.prototype );
THREE.PointCloud.prototype.constructor = THREE.PointCloud;

THREE.PointCloud.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();

	return function ( raycaster, intersects ) {

		var object = this;
		var geometry = object.geometry;
		var threshold = raycaster.params.PointCloud.threshold;

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}

		var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		var position = new THREE.Vector3();

		var testPoint = function ( point, index ) {

			var rayPointDistance = ray.distanceToPoint( point );

			if ( rayPointDistance < localThreshold ) {

				var intersectPoint = ray.closestPointToPoint( point );
				intersectPoint.applyMatrix4( object.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectPoint );

				if ( distance < raycaster.near || distance > raycaster.far ) return;

				intersects.push( {

					distance: distance,
					distanceToRay: rayPointDistance,
					point: intersectPoint.clone(),
					index: index,
					face: null,
					object: object

				} );

			}

		};

		if ( geometry instanceof THREE.BufferGeometry ) {

			var attributes = geometry.attributes;
			var positions = attributes.position.array;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					var offset = {
						start: 0,
						count: indices.length,
						index: 0
					};

					offsets = [ offset ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++ oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i ++ ) {

						var a = index + indices[ i ];

						position.fromArray( positions, a * 3 );

						testPoint( position, a );

					}

				}

			} else {

				var pointCount = positions.length / 3;

				for ( var i = 0; i < pointCount; i ++ ) {

					position.set(
						positions[ 3 * i ],
						positions[ 3 * i + 1 ],
						positions[ 3 * i + 2 ]
					);

					testPoint( position, i );

				}

			}

		} else {

			var vertices = this.geometry.vertices;

			for ( var i = 0; i < vertices.length; i ++ ) {

				testPoint( vertices[ i ], i );

			}

		}

	};

}() );

THREE.PointCloud.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PointCloud( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

THREE.PointCloud.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	// only serialize if not in meta geometries cache
	if ( meta.geometries[ this.geometry.uuid ] === undefined ) {
		meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON();
	}

	// only serialize if not in meta materials cache
	if ( meta.materials[ this.material.uuid ] === undefined ) {
		meta.materials[ this.material.uuid ] = this.material.toJSON();
	}

	data.object.geometry = this.geometry.uuid;
	data.object.material = this.material.uuid;

	return data;

};

// Backwards compatibility

THREE.ParticleSystem = function ( geometry, material ) {

	console.warn( 'THREE.ParticleSystem has been renamed to THREE.PointCloud.' );
	return new THREE.PointCloud( geometry, material );

};

// File:src/objects/Line.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, mode ) {

	if ( mode === 1 ) {

		console.error( 'THREE.Line: THREE.LinePieces mode has been removed. Use THREE.LineSegments instead.' );

	}

	THREE.Object3D.call( this );

	this.type = 'Line';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );

};

THREE.Line.prototype = Object.create( THREE.Object3D.prototype );
THREE.Line.prototype.constructor = THREE.Line;

THREE.Line.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	return function ( raycaster, intersects ) {

		var precision = raycaster.linePrecision;
		var precisionSq = precision * precision;

		var geometry = this.geometry;

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		// Checking boundingSphere distance to ray

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		var vStart = new THREE.Vector3();
		var vEnd = new THREE.Vector3();
		var interSegment = new THREE.Vector3();
		var interRay = new THREE.Vector3();
		var step = this instanceof THREE.LineSegments ? 2 : 1;

		if ( geometry instanceof THREE.BufferGeometry ) {

			var attributes = geometry.attributes;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var positions = attributes.position.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					offsets = [ { start: 0, count: indices.length, index: 0 } ];

				}

				for ( var oi = 0; oi < offsets.length; oi ++) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start; i < start + count - 1; i += step ) {

						var a = index + indices[ i ];
						var b = index + indices[ i + 1 ];

						vStart.fromArray( positions, a * 3 );
						vEnd.fromArray( positions, b * 3 );

						var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

						if ( distSq > precisionSq ) continue;

						var distance = ray.origin.distanceTo( interRay );

						if ( distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							// What do we want? intersection point on the ray or on the segment??
							// point: raycaster.ray.at( distance ),
							point: interSegment.clone().applyMatrix4( this.matrixWorld ),
							index: i,
							offsetIndex: oi,
							face: null,
							faceIndex: null,
							object: this

						} );

					}

				}

			} else {

				var positions = attributes.position.array;

				for ( var i = 0; i < positions.length / 3 - 1; i += step ) {

					vStart.fromArray( positions, 3 * i );
					vEnd.fromArray( positions, 3 * i + 3 );

					var distSq = ray.distanceSqToSegment( vStart, vEnd, interRay, interSegment );

					if ( distSq > precisionSq ) continue;

					var distance = ray.origin.distanceTo( interRay );

					if ( distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4( this.matrixWorld ),
						index: i,
						face: null,
						faceIndex: null,
						object: this

					} );

				}

			}

		} else if ( geometry instanceof THREE.Geometry ) {

			var vertices = geometry.vertices;
			var nbVertices = vertices.length;

			for ( var i = 0; i < nbVertices - 1; i += step ) {

				var distSq = ray.distanceSqToSegment( vertices[ i ], vertices[ i + 1 ], interRay, interSegment );

				if ( distSq > precisionSq ) continue;

				var distance = ray.origin.distanceTo( interRay );

				if ( distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					// What do we want? intersection point on the ray or on the segment??
					// point: raycaster.ray.at( distance ),
					point: interSegment.clone().applyMatrix4( this.matrixWorld ),
					index: i,
					face: null,
					faceIndex: null,
					object: this

				} );

			}

		}

	};

}() );

THREE.Line.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE[ this.type ]( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

THREE.Line.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	// only serialize if not in meta geometries cache
	if ( meta.geometries[ this.geometry.uuid ] === undefined ) {
		meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON();
	}

	// only serialize if not in meta materials cache
	if ( meta.materials[ this.material.uuid ] === undefined ) {
		meta.materials[ this.material.uuid ] = this.material.toJSON();
	}

	data.object.geometry = this.geometry.uuid;
	data.object.material = this.material.uuid;

	return data;

};

// DEPRECATED

THREE.LineStrip = 0;
THREE.LinePieces = 1;

// File:src/objects/LineSegments.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LineSegments = function ( geometry, material ) {

	THREE.Line.call( this, geometry, material );

	this.type = 'LineSegments';

};

THREE.LineSegments.prototype = Object.create( THREE.Line.prototype );
THREE.LineSegments.prototype.constructor = THREE.LineSegments;

// File:src/objects/Mesh.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.type = 'Mesh';

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } );

	this.updateMorphTargets();

};

THREE.Mesh.prototype = Object.create( THREE.Object3D.prototype );
THREE.Mesh.prototype.constructor = THREE.Mesh;

THREE.Mesh.prototype.updateMorphTargets = function () {

	if ( this.geometry.morphTargets !== undefined && this.geometry.morphTargets.length > 0 ) {

		this.morphTargetBase = - 1;
		this.morphTargetForcedOrder = [];
		this.morphTargetInfluences = [];
		this.morphTargetDictionary = {};

		for ( var m = 0, ml = this.geometry.morphTargets.length; m < ml; m ++ ) {

			this.morphTargetInfluences.push( 0 );
			this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

		}

	}

};

THREE.Mesh.prototype.getMorphTargetIndexByName = function ( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {

		return this.morphTargetDictionary[ name ];

	}

	console.warn( 'THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.' );

	return 0;

};


THREE.Mesh.prototype.raycast = ( function () {

	var inverseMatrix = new THREE.Matrix4();
	var ray = new THREE.Ray();
	var sphere = new THREE.Sphere();

	var vA = new THREE.Vector3();
	var vB = new THREE.Vector3();
	var vC = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		var geometry = this.geometry;

		// Checking boundingSphere distance to ray

		if ( geometry.boundingSphere === null ) geometry.computeBoundingSphere();

		sphere.copy( geometry.boundingSphere );
		sphere.applyMatrix4( this.matrixWorld );

		if ( raycaster.ray.isIntersectionSphere( sphere ) === false ) {

			return;

		}

		// Check boundingBox before continuing

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {

			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}

		if ( geometry instanceof THREE.BufferGeometry ) {

			var material = this.material;

			if ( material === undefined ) return;

			var attributes = geometry.attributes;

			var a, b, c;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var positions = attributes.position.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					offsets = [ { start: 0, count: indices.length, index: 0 } ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++ oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i += 3 ) {

						a = index + indices[ i ];
						b = index + indices[ i + 1 ];
						c = index + indices[ i + 2 ];

						vA.fromArray( positions, a * 3 );
						vB.fromArray( positions, b * 3 );
						vC.fromArray( positions, c * 3 );

						if ( material.side === THREE.BackSide ) {

							var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

						} else {

							var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

						}

						if ( intersectionPoint === null ) continue;

						intersectionPoint.applyMatrix4( this.matrixWorld );

						var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

						if ( distance < raycaster.near || distance > raycaster.far ) continue;

						intersects.push( {

							distance: distance,
							point: intersectionPoint,
							face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
							faceIndex: null,
							object: this

						} );

					}

				}

			} else {

				var positions = attributes.position.array;

				for ( var i = 0, j = 0, il = positions.length; i < il; i += 3, j += 9 ) {

					a = i;
					b = i + 1;
					c = i + 2;

					vA.fromArray( positions, j );
					vB.fromArray( positions, j + 3 );
					vC.fromArray( positions, j + 6 );

					if ( material.side === THREE.BackSide ) {

						var intersectionPoint = ray.intersectTriangle( vC, vB, vA, true );

					} else {

						var intersectionPoint = ray.intersectTriangle( vA, vB, vC, material.side !== THREE.DoubleSide );

					}

					if ( intersectionPoint === null ) continue;

					intersectionPoint.applyMatrix4( this.matrixWorld );

					var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

					if ( distance < raycaster.near || distance > raycaster.far ) continue;

					intersects.push( {

						distance: distance,
						point: intersectionPoint,
						face: new THREE.Face3( a, b, c, THREE.Triangle.normal( vA, vB, vC ) ),
						faceIndex: null,
						object: this

					} );

				}

			}

		} else if ( geometry instanceof THREE.Geometry ) {

			var isFaceMaterial = this.material instanceof THREE.MeshFaceMaterial;
			var objectMaterials = isFaceMaterial === true ? this.material.materials : null;

			var a, b, c;

			var vertices = geometry.vertices;

			for ( var f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				var face = geometry.faces[ f ];

				var material = isFaceMaterial === true ? objectMaterials[ face.materialIndex ] : this.material;

				if ( material === undefined ) continue;

				a = vertices[ face.a ];
				b = vertices[ face.b ];
				c = vertices[ face.c ];

				if ( material.morphTargets === true ) {

					var morphTargets = geometry.morphTargets;
					var morphInfluences = this.morphTargetInfluences;

					vA.set( 0, 0, 0 );
					vB.set( 0, 0, 0 );
					vC.set( 0, 0, 0 );

					for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

						var influence = morphInfluences[ t ];

						if ( influence === 0 ) continue;

						var targets = morphTargets[ t ].vertices;

						vA.x += ( targets[ face.a ].x - a.x ) * influence;
						vA.y += ( targets[ face.a ].y - a.y ) * influence;
						vA.z += ( targets[ face.a ].z - a.z ) * influence;

						vB.x += ( targets[ face.b ].x - b.x ) * influence;
						vB.y += ( targets[ face.b ].y - b.y ) * influence;
						vB.z += ( targets[ face.b ].z - b.z ) * influence;

						vC.x += ( targets[ face.c ].x - c.x ) * influence;
						vC.y += ( targets[ face.c ].y - c.y ) * influence;
						vC.z += ( targets[ face.c ].z - c.z ) * influence;

					}

					vA.add( a );
					vB.add( b );
					vC.add( c );

					a = vA;
					b = vB;
					c = vC;

				}

				if ( material.side === THREE.BackSide ) {

					var intersectionPoint = ray.intersectTriangle( c, b, a, true );

				} else {

					var intersectionPoint = ray.intersectTriangle( a, b, c, material.side !== THREE.DoubleSide );

				}

				if ( intersectionPoint === null ) continue;

				intersectionPoint.applyMatrix4( this.matrixWorld );

				var distance = raycaster.ray.origin.distanceTo( intersectionPoint );

				if ( distance < raycaster.near || distance > raycaster.far ) continue;

				intersects.push( {

					distance: distance,
					point: intersectionPoint,
					face: face,
					faceIndex: f,
					object: this

				} );

			}

		}

	};

}() );

THREE.Mesh.prototype.clone = function ( object, recursive ) {

	if ( object === undefined ) object = new THREE.Mesh( this.geometry, this.material );

	THREE.Object3D.prototype.clone.call( this, object, recursive );

	return object;

};

THREE.Mesh.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	// only serialize if not in meta geometries cache
	if ( meta.geometries[ this.geometry.uuid ] === undefined ) {
		meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON( meta );
	}

	// only serialize if not in meta materials cache
	if ( meta.materials[ this.material.uuid ] === undefined ) {
		meta.materials[ this.material.uuid ] = this.material.toJSON( meta );
	}

	data.object.geometry = this.geometry.uuid;
	data.object.material = this.material.uuid;

	return data;

};

// File:src/objects/Bone.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.Bone = function ( skin ) {

	THREE.Object3D.call( this );

	this.type = 'Bone';

	this.skin = skin;

};

THREE.Bone.prototype = Object.create( THREE.Object3D.prototype );
THREE.Bone.prototype.constructor = THREE.Bone;

// File:src/objects/Skeleton.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */

THREE.Skeleton = function ( bones, boneInverses, useVertexTexture ) {

	this.useVertexTexture = useVertexTexture !== undefined ? useVertexTexture : true;

	this.identityMatrix = new THREE.Matrix4();

	// copy the bone array

	bones = bones || [];

	this.bones = bones.slice( 0 );

	// create a bone texture or an array of floats

	if ( this.useVertexTexture ) {

		// layout (1 matrix = 4 pixels)
		//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
		//  with  8x8  pixel texture max   16 bones  (8 * 8  / 4)
		//       16x16 pixel texture max   64 bones (16 * 16 / 4)
		//       32x32 pixel texture max  256 bones (32 * 32 / 4)
		//       64x64 pixel texture max 1024 bones (64 * 64 / 4)

		var size;

		if ( this.bones.length > 256 )
			size = 64;
		else if ( this.bones.length > 64 )
			size = 32;
		else if ( this.bones.length > 16 )
			size = 16;
		else
			size = 8;

		this.boneTextureWidth = size;
		this.boneTextureHeight = size;

		this.boneMatrices = new Float32Array( this.boneTextureWidth * this.boneTextureHeight * 4 ); // 4 floats per RGBA pixel
		this.boneTexture = new THREE.DataTexture( this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType );
		this.boneTexture.minFilter = THREE.NearestFilter;
		this.boneTexture.magFilter = THREE.NearestFilter;
		this.boneTexture.generateMipmaps = false;
		this.boneTexture.flipY = false;

	} else {

		this.boneMatrices = new Float32Array( 16 * this.bones.length );

	}

	// use the supplied bone inverses or calculate the inverses

	if ( boneInverses === undefined ) {

		this.calculateInverses();

	} else {

		if ( this.bones.length === boneInverses.length ) {

			this.boneInverses = boneInverses.slice( 0 );

		} else {

			console.warn( 'THREE.Skeleton bonInverses is the wrong length.' );

			this.boneInverses = [];

			for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

				this.boneInverses.push( new THREE.Matrix4() );

			}

		}

	}

};

THREE.Skeleton.prototype.calculateInverses = function () {

	this.boneInverses = [];

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		var inverse = new THREE.Matrix4();

		if ( this.bones[ b ] ) {

			inverse.getInverse( this.bones[ b ].matrixWorld );

		}

		this.boneInverses.push( inverse );

	}

};

THREE.Skeleton.prototype.pose = function () {

	var bone;

	// recover the bind-time world matrices

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			bone.matrixWorld.getInverse( this.boneInverses[ b ] );

		}

	}

	// compute the local matrices, positions, rotations and scales

	for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

		bone = this.bones[ b ];

		if ( bone ) {

			if ( bone.parent ) {

				bone.matrix.getInverse( bone.parent.matrixWorld );
				bone.matrix.multiply( bone.matrixWorld );

			} else {

				bone.matrix.copy( bone.matrixWorld );

			}

			bone.matrix.decompose( bone.position, bone.quaternion, bone.scale );

		}

	}

};

THREE.Skeleton.prototype.update = ( function () {

	var offsetMatrix = new THREE.Matrix4();
	
	return function () {

		// flatten bone matrices to array

		for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

			// compute the offset between the current and the original transform

			var matrix = this.bones[ b ] ? this.bones[ b ].matrixWorld : this.identityMatrix;

			offsetMatrix.multiplyMatrices( matrix, this.boneInverses[ b ] );
			offsetMatrix.flattenToArrayOffset( this.boneMatrices, b * 16 );

		}

		if ( this.useVertexTexture ) {

			this.boneTexture.needsUpdate = true;

		}
		
	};

} )();


// File:src/objects/SkinnedMesh.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

THREE.SkinnedMesh = function ( geometry, material, useVertexTexture ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'SkinnedMesh';

	this.bindMode = "attached";
	this.bindMatrix = new THREE.Matrix4();
	this.bindMatrixInverse = new THREE.Matrix4();

	// init bones

	// TODO: remove bone creation as there is no reason (other than
	// convenience) for THREE.SkinnedMesh to do this.

	var bones = [];

	if ( this.geometry && this.geometry.bones !== undefined ) {

		var bone, gbone, p, q, s;

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++ b ) {

			gbone = this.geometry.bones[ b ];

			p = gbone.pos;
			q = gbone.rotq;
			s = gbone.scl;

			bone = new THREE.Bone( this );
			bones.push( bone );

			bone.name = gbone.name;
			bone.position.set( p[ 0 ], p[ 1 ], p[ 2 ] );
			bone.quaternion.set( q[ 0 ], q[ 1 ], q[ 2 ], q[ 3 ] );

			if ( s !== undefined ) {

				bone.scale.set( s[ 0 ], s[ 1 ], s[ 2 ] );

			} else {

				bone.scale.set( 1, 1, 1 );

			}

		}

		for ( var b = 0, bl = this.geometry.bones.length; b < bl; ++ b ) {

			gbone = this.geometry.bones[ b ];

			if ( gbone.parent !== - 1 ) {

				bones[ gbone.parent ].add( bones[ b ] );

			} else {

				this.add( bones[ b ] );

			}

		}

	}

	this.normalizeSkinWeights();

	this.updateMatrixWorld( true );
	this.bind( new THREE.Skeleton( bones, undefined, useVertexTexture ) );

};


THREE.SkinnedMesh.prototype = Object.create( THREE.Mesh.prototype );
THREE.SkinnedMesh.prototype.constructor = THREE.SkinnedMesh;

THREE.SkinnedMesh.prototype.bind = function( skeleton, bindMatrix ) {

	this.skeleton = skeleton;

	if ( bindMatrix === undefined ) {

		this.updateMatrixWorld( true );

		bindMatrix = this.matrixWorld;

	}

	this.bindMatrix.copy( bindMatrix );
	this.bindMatrixInverse.getInverse( bindMatrix );

};

THREE.SkinnedMesh.prototype.pose = function () {

	this.skeleton.pose();

};

THREE.SkinnedMesh.prototype.normalizeSkinWeights = function () {

	if ( this.geometry instanceof THREE.Geometry ) {

		for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

			var sw = this.geometry.skinWeights[ i ];

			var scale = 1.0 / sw.lengthManhattan();

			if ( scale !== Infinity ) {

				sw.multiplyScalar( scale );

			} else {

				sw.set( 1 ); // this will be normalized by the shader anyway

			}

		}

	} else {

		// skinning weights assumed to be normalized for THREE.BufferGeometry

	}

};

THREE.SkinnedMesh.prototype.updateMatrixWorld = function( force ) {

	THREE.Mesh.prototype.updateMatrixWorld.call( this, true );

	if ( this.bindMode === "attached" ) {

		this.bindMatrixInverse.getInverse( this.matrixWorld );

	} else if ( this.bindMode === "detached" ) {

		this.bindMatrixInverse.getInverse( this.bindMatrix );

	} else {

		console.warn( 'THREE.SkinnedMesh unreckognized bindMode: ' + this.bindMode );

	}

};

THREE.SkinnedMesh.prototype.clone = function( object ) {

	if ( object === undefined ) {

		object = new THREE.SkinnedMesh( this.geometry, this.material, this.useVertexTexture );

	}

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};


// File:src/objects/MorphAnimMesh.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphAnimMesh = function ( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.type = 'MorphAnimMesh';

	// API

	this.duration = 1000; // milliseconds
	this.mirroredLoop = false;
	this.time = 0;

	// internals

	this.lastKeyframe = 0;
	this.currentKeyframe = 0;

	this.direction = 1;
	this.directionBackwards = false;

	this.setFrameRange( 0, this.geometry.morphTargets.length - 1 );

};

THREE.MorphAnimMesh.prototype = Object.create( THREE.Mesh.prototype );
THREE.MorphAnimMesh.prototype.constructor = THREE.MorphAnimMesh;

THREE.MorphAnimMesh.prototype.setFrameRange = function ( start, end ) {

	this.startKeyframe = start;
	this.endKeyframe = end;

	this.length = this.endKeyframe - this.startKeyframe + 1;

};

THREE.MorphAnimMesh.prototype.setDirectionForward = function () {

	this.direction = 1;
	this.directionBackwards = false;

};

THREE.MorphAnimMesh.prototype.setDirectionBackward = function () {

	this.direction = - 1;
	this.directionBackwards = true;

};

THREE.MorphAnimMesh.prototype.parseAnimations = function () {

	var geometry = this.geometry;

	if ( ! geometry.animations ) geometry.animations = {};

	var firstAnimation, animations = geometry.animations;

	var pattern = /([a-z]+)_?(\d+)/;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];
		var parts = morph.name.match( pattern );

		if ( parts && parts.length > 1 ) {

			var label = parts[ 1 ];

			if ( ! animations[ label ] ) animations[ label ] = { start: Infinity, end: - Infinity };

			var animation = animations[ label ];

			if ( i < animation.start ) animation.start = i;
			if ( i > animation.end ) animation.end = i;

			if ( ! firstAnimation ) firstAnimation = label;

		}

	}

	geometry.firstAnimation = firstAnimation;

};

THREE.MorphAnimMesh.prototype.setAnimationLabel = function ( label, start, end ) {

	if ( ! this.geometry.animations ) this.geometry.animations = {};

	this.geometry.animations[ label ] = { start: start, end: end };

};

THREE.MorphAnimMesh.prototype.playAnimation = function ( label, fps ) {

	var animation = this.geometry.animations[ label ];

	if ( animation ) {

		this.setFrameRange( animation.start, animation.end );
		this.duration = 1000 * ( ( animation.end - animation.start ) / fps );
		this.time = 0;

	} else {

		console.warn( 'THREE.MorphAnimMesh: animation[' + label + '] undefined in .playAnimation()' );

	}

};

THREE.MorphAnimMesh.prototype.updateAnimation = function ( delta ) {

	var frameTime = this.duration / this.length;

	this.time += this.direction * delta;

	if ( this.mirroredLoop ) {

		if ( this.time > this.duration || this.time < 0 ) {

			this.direction *= - 1;

			if ( this.time > this.duration ) {

				this.time = this.duration;
				this.directionBackwards = true;

			}

			if ( this.time < 0 ) {

				this.time = 0;
				this.directionBackwards = false;

			}

		}

	} else {

		this.time = this.time % this.duration;

		if ( this.time < 0 ) this.time += this.duration;

	}

	var keyframe = this.startKeyframe + THREE.Math.clamp( Math.floor( this.time / frameTime ), 0, this.length - 1 );

	if ( keyframe !== this.currentKeyframe ) {

		this.morphTargetInfluences[ this.lastKeyframe ] = 0;
		this.morphTargetInfluences[ this.currentKeyframe ] = 1;

		this.morphTargetInfluences[ keyframe ] = 0;

		this.lastKeyframe = this.currentKeyframe;
		this.currentKeyframe = keyframe;

	}

	var mix = ( this.time % frameTime ) / frameTime;

	if ( this.directionBackwards ) {

		mix = 1 - mix;

	}

	this.morphTargetInfluences[ this.currentKeyframe ] = mix;
	this.morphTargetInfluences[ this.lastKeyframe ] = 1 - mix;

};

THREE.MorphAnimMesh.prototype.interpolateTargets = function ( a, b, t ) {

	var influences = this.morphTargetInfluences;

	for ( var i = 0, l = influences.length; i < l; i ++ ) {

		influences[ i ] = 0;

	}

	if ( a > -1 ) influences[ a ] = 1 - t;
	if ( b > -1 ) influences[ b ] = t;

};

THREE.MorphAnimMesh.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.MorphAnimMesh( this.geometry, this.material );

	object.duration = this.duration;
	object.mirroredLoop = this.mirroredLoop;
	object.time = this.time;

	object.lastKeyframe = this.lastKeyframe;
	object.currentKeyframe = this.currentKeyframe;

	object.direction = this.direction;
	object.directionBackwards = this.directionBackwards;

	THREE.Mesh.prototype.clone.call( this, object );

	return object;

};

// File:src/objects/LOD.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.LOD = function () {

	THREE.Object3D.call( this );

	this.objects = [];

};


THREE.LOD.prototype = Object.create( THREE.Object3D.prototype );
THREE.LOD.prototype.constructor = THREE.LOD;

THREE.LOD.prototype.addLevel = function ( object, distance ) {

	if ( distance === undefined ) distance = 0;

	distance = Math.abs( distance );

	for ( var l = 0; l < this.objects.length; l ++ ) {

		if ( distance < this.objects[ l ].distance ) {

			break;

		}

	}

	this.objects.splice( l, 0, { distance: distance, object: object } );
	this.add( object );

};

THREE.LOD.prototype.getObjectForDistance = function ( distance ) {

	for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

		if ( distance < this.objects[ i ].distance ) {

			break;

		}

	}

	return this.objects[ i - 1 ].object;

};

THREE.LOD.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.origin.distanceTo( matrixPosition );

		this.getObjectForDistance( distance ).raycast( raycaster, intersects );

	};

}() );

THREE.LOD.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();

	return function ( camera ) {

		if ( this.objects.length > 1 ) {

			v1.setFromMatrixPosition( camera.matrixWorld );
			v2.setFromMatrixPosition( this.matrixWorld );

			var distance = v1.distanceTo( v2 );

			this.objects[ 0 ].object.visible = true;

			for ( var i = 1, l = this.objects.length; i < l; i ++ ) {

				if ( distance >= this.objects[ i ].distance ) {

					this.objects[ i - 1 ].object.visible = false;
					this.objects[ i     ].object.visible = true;

				} else {

					break;

				}

			}

			for ( ; i < l; i ++ ) {

				this.objects[ i ].object.visible = false;

			}

		}

	};

}();

THREE.LOD.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.LOD();

	THREE.Object3D.prototype.clone.call( this, object );

	for ( var i = 0, l = this.objects.length; i < l; i ++ ) {
		var x = this.objects[ i ].object.clone();
		x.visible = i === 0;
		object.addLevel( x, this.objects[ i ].distance );
	}

	return object;

};

// File:src/objects/Sprite.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Sprite = ( function () {

	var indices = new Uint16Array( [ 0, 1, 2,  0, 2, 3 ] );
	var vertices = new Float32Array( [ - 0.5, - 0.5, 0,   0.5, - 0.5, 0,   0.5, 0.5, 0,   - 0.5, 0.5, 0 ] );
	var uvs = new Float32Array( [ 0, 0,   1, 0,   1, 1,   0, 1 ] );

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	return function ( material ) {

		THREE.Object3D.call( this );

		this.type = 'Sprite';

		this.geometry = geometry;
		this.material = ( material !== undefined ) ? material : new THREE.SpriteMaterial();

	};

} )();

THREE.Sprite.prototype = Object.create( THREE.Object3D.prototype );
THREE.Sprite.prototype.constructor = THREE.Sprite;

THREE.Sprite.prototype.raycast = ( function () {

	var matrixPosition = new THREE.Vector3();

	return function ( raycaster, intersects ) {

		matrixPosition.setFromMatrixPosition( this.matrixWorld );

		var distance = raycaster.ray.distanceToPoint( matrixPosition );

		if ( distance > this.scale.x ) {

			return;

		}

		intersects.push( {

			distance: distance,
			point: this.position,
			face: null,
			object: this

		} );

	};

}() );

THREE.Sprite.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Sprite( this.material );

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

THREE.Sprite.prototype.toJSON = function ( meta ) {

	var data = THREE.Object3D.prototype.toJSON.call( this, meta );

	// only serialize if not in meta materials cache
	if ( meta.materials[ this.material.uuid ] === undefined ) {
		meta.materials[ this.material.uuid ] = this.material.toJSON();
	}

	data.object.material = this.material.uuid;

	return data;

};

// Backwards compatibility

THREE.Particle = THREE.Sprite;

// File:src/objects/LensFlare.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlare = function ( texture, size, distance, blending, color ) {

	THREE.Object3D.call( this );

	this.lensFlares = [];

	this.positionScreen = new THREE.Vector3();
	this.customUpdateCallback = undefined;

	if ( texture !== undefined ) {

		this.add( texture, size, distance, blending, color );

	}

};

THREE.LensFlare.prototype = Object.create( THREE.Object3D.prototype );
THREE.LensFlare.prototype.constructor = THREE.LensFlare;


/*
 * Add: adds another flare
 */

THREE.LensFlare.prototype.add = function ( texture, size, distance, blending, color, opacity ) {

	if ( size === undefined ) size = - 1;
	if ( distance === undefined ) distance = 0;
	if ( opacity === undefined ) opacity = 1;
	if ( color === undefined ) color = new THREE.Color( 0xffffff );
	if ( blending === undefined ) blending = THREE.NormalBlending;

	distance = Math.min( distance, Math.max( 0, distance ) );

	this.lensFlares.push( {
		texture: texture, 			// THREE.Texture
		size: size, 				// size in pixels (-1 = use texture.width)
		distance: distance, 		// distance (0-1) from light source (0=at light source)
		x: 0, y: 0, z: 0,			// screen position (-1 => 1) z = 0 is ontop z = 1 is back
		scale: 1, 					// scale
		rotation: 1, 				// rotation
		opacity: opacity,			// opacity
		color: color,				// color
		blending: blending			// blending
	} );

};

/*
 * Update lens flares update positions on all flares based on the screen position
 * Set myLensFlare.customUpdateCallback to alter the flares in your project specific way.
 */

THREE.LensFlare.prototype.updateLensFlares = function () {

	var f, fl = this.lensFlares.length;
	var flare;
	var vecX = - this.positionScreen.x * 2;
	var vecY = - this.positionScreen.y * 2;

	for ( f = 0; f < fl; f ++ ) {

		flare = this.lensFlares[ f ];

		flare.x = this.positionScreen.x + vecX * flare.distance;
		flare.y = this.positionScreen.y + vecY * flare.distance;

		flare.wantedRotation = flare.x * Math.PI * 0.25;
		flare.rotation += ( flare.wantedRotation - flare.rotation ) * 0.25;

	}

};


// File:src/scenes/Scene.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.type = 'Scene';

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

};

THREE.Scene.prototype = Object.create( THREE.Object3D.prototype );
THREE.Scene.prototype.constructor = THREE.Scene;

THREE.Scene.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Scene();

	THREE.Object3D.prototype.clone.call( this, object );

	if ( this.fog !== null ) object.fog = this.fog.clone();
	if ( this.overrideMaterial !== null ) object.overrideMaterial = this.overrideMaterial.clone();

	object.autoUpdate = this.autoUpdate;
	object.matrixAutoUpdate = this.matrixAutoUpdate;

	return object;

};

// File:src/scenes/Fog.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Fog = function ( color, near, far ) {

	this.name = '';

	this.color = new THREE.Color( color );

	this.near = ( near !== undefined ) ? near : 1;
	this.far = ( far !== undefined ) ? far : 1000;

};

THREE.Fog.prototype.clone = function () {

	return new THREE.Fog( this.color.getHex(), this.near, this.far );

};

// File:src/scenes/FogExp2.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.FogExp2 = function ( color, density ) {

	this.name = '';

	this.color = new THREE.Color( color );
	this.density = ( density !== undefined ) ? density : 0.00025;

};

THREE.FogExp2.prototype.clone = function () {

	return new THREE.FogExp2( this.color.getHex(), this.density );

};

// File:src/renderers/shaders/ShaderChunk.js

THREE.ShaderChunk = {};

// File:src/renderers/shaders/ShaderChunk/alphamap_fragment.glsl

THREE.ShaderChunk[ 'alphamap_fragment'] = "#ifdef USE_ALPHAMAP\n\n	diffuseColor.a *= texture2D( alphaMap, vUv ).g;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphamap_pars_fragment.glsl

THREE.ShaderChunk[ 'alphamap_pars_fragment'] = "#ifdef USE_ALPHAMAP\n\n	uniform sampler2D alphaMap;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/alphatest_fragment.glsl

THREE.ShaderChunk[ 'alphatest_fragment'] = "#ifdef ALPHATEST\n\n	if ( diffuseColor.a < ALPHATEST ) discard;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/aomap_fragment.glsl

THREE.ShaderChunk[ 'aomap_fragment'] = "#ifdef USE_AOMAP\n\n	totalAmbientLight *= ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/aomap_pars_fragment.glsl

THREE.ShaderChunk[ 'aomap_pars_fragment'] = "#ifdef USE_AOMAP\n\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/bumpmap_pars_fragment.glsl

THREE.ShaderChunk[ 'bumpmap_pars_fragment'] = "#ifdef USE_BUMPMAP\n\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n\n	// Derivative maps - bump mapping unparametrized surfaces by Morten Mikkelsen\n	// http://mmikkelsen3d.blogspot.sk/2011/07/derivative-maps.html\n\n	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n	vec2 dHdxy_fwd() {\n\n		vec2 dSTdx = dFdx( vUv );\n		vec2 dSTdy = dFdy( vUv );\n\n		float Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\n		return vec2( dBx, dBy );\n\n	}\n\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\n		vec3 vSigmaX = dFdx( surf_pos );\n		vec3 vSigmaY = dFdy( surf_pos );\n		vec3 vN = surf_norm;		// normalized\n\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n\n		float fDet = dot( vSigmaX, R1 );\n\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n\n	}\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_fragment.glsl

THREE.ShaderChunk[ 'color_fragment'] = "#ifdef USE_COLOR\n\n	diffuseColor.rgb *= vColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_pars_fragment.glsl

THREE.ShaderChunk[ 'color_pars_fragment'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/color_pars_vertex.glsl

THREE.ShaderChunk[ 'color_pars_vertex'] = "#ifdef USE_COLOR\n\n	varying vec3 vColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/color_vertex.glsl

THREE.ShaderChunk[ 'color_vertex'] = "#ifdef USE_COLOR\n\n	vColor.xyz = inputToLinear( color.xyz );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/common.glsl

THREE.ShaderChunk[ 'common'] = "#define PI 3.14159\n#define PI2 6.28318\n#define RECIPROCAL_PI2 0.15915494\n#define LOG2 1.442695\n#define EPSILON 1e-6\n\n#define saturate(a) clamp( a, 0.0, 1.0 )\n#define whiteCompliment(a) ( 1.0 - saturate( a ) )\n\nvec3 transformDirection( in vec3 normal, in mat4 matrix ) {\n\n	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );\n\n}\n\n// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations\nvec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {\n\n	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );\n\n}\n\nvec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	float distance = dot( planeNormal, point - pointOnPlane );\n\n	return - distance * planeNormal + point;\n\n}\n\nfloat sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	return sign( dot( point - pointOnPlane, planeNormal ) );\n\n}\n\nvec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {\n\n	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;\n\n}\n\nfloat calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {\n\n	if ( decayExponent > 0.0 ) {\n\n	  return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\n	}\n\n	return 1.0;\n\n}\n\nvec3 F_Schlick( in vec3 specularColor, in float dotLH ) {\n\n	return ( 1.0 - specularColor ) * pow( 1.0 - dotLH, 5.0 ) + specularColor;\n\n}\n\nfloat G_BlinnPhong_Implicit( /* in float dotNL, in float dotNV */ ) {\n\n	// geometry term is (n⋅l)(n⋅v) / 4(n⋅l)(n⋅v)\n\n	return 0.25;\n\n}\n\nfloat D_BlinnPhong( in float shininess, in float dotNH ) {\n\n	// factor of 1/PI in distribution term omitted\n\n	return ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n\n}\n\nvec3 BRDF_BlinnPhong( in vec3 specularColor, in float shininess, in vec3 normal, in vec3 lightDir, in vec3 viewDir ) {\n\n	vec3 halfDir = normalize( lightDir + viewDir );\n\n	//float dotNL = saturate( dot( normal, lightDir ) );\n	//float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotLH = saturate( dot( lightDir, halfDir ) );\n\n	vec3 F = F_Schlick( specularColor, dotLH );\n\n	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n	float D = D_BlinnPhong( shininess, dotNH );\n\n	return F * G * D;\n\n}\n\nvec3 inputToLinear( in vec3 a ) {\n\n	#ifdef GAMMA_INPUT\n\n		return pow( a, vec3( float( GAMMA_FACTOR ) ) );\n\n	#else\n\n		return a;\n\n	#endif\n\n}\n\nvec3 linearToOutput( in vec3 a ) {\n\n	#ifdef GAMMA_OUTPUT\n\n		return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );\n\n	#else\n\n		return a;\n\n	#endif\n\n}\n";

// File:src/renderers/shaders/ShaderChunk/default_vertex.glsl

THREE.ShaderChunk[ 'default_vertex'] = "#ifdef USE_SKINNING\n\n	vec4 mvPosition = modelViewMatrix * skinned;\n\n#elif defined( USE_MORPHTARGETS )\n\n	vec4 mvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n\n#else\n\n	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\n#endif\n\ngl_Position = projectionMatrix * mvPosition;\n";

// File:src/renderers/shaders/ShaderChunk/defaultnormal_vertex.glsl

THREE.ShaderChunk[ 'defaultnormal_vertex'] = "#ifdef USE_SKINNING\n\n	vec3 objectNormal = skinnedNormal.xyz;\n\n#elif defined( USE_MORPHNORMALS )\n\n	vec3 objectNormal = morphedNormal;\n\n#else\n\n	vec3 objectNormal = normal;\n\n#endif\n\n#ifdef FLIP_SIDED\n\n	objectNormal = -objectNormal;\n\n#endif\n\nvec3 transformedNormal = normalMatrix * objectNormal;\n";

// File:src/renderers/shaders/ShaderChunk/envmap_fragment.glsl

THREE.ShaderChunk[ 'envmap_fragment'] = "#ifdef USE_ENVMAP\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\n		// Transforming Normal Vectors with the Inverse Transformation\n		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n		#ifdef ENVMAP_MODE_REFLECTION\n\n			vec3 reflectVec = reflect( cameraToVertex, worldNormal );\n\n		#else\n\n			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\n		#endif\n\n	#else\n\n		vec3 reflectVec = vReflect;\n\n	#endif\n\n	#ifdef DOUBLE_SIDED\n		float flipNormal = ( float( gl_FrontFacing ) * 2.0 - 1.0 );\n	#else\n		float flipNormal = 1.0;\n	#endif\n\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n	#elif defined( ENVMAP_TYPE_EQUIREC )\n		vec2 sampleUV;\n		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );\n		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n		vec4 envColor = texture2D( envMap, sampleUV );\n\n	#elif defined( ENVMAP_TYPE_SPHERE )\n		vec3 reflectView = flipNormal * normalize((viewMatrix * vec4( reflectVec, 0.0 )).xyz + vec3(0.0,0.0,1.0));\n		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );\n	#endif\n\n	envColor.xyz = inputToLinear( envColor.xyz );\n\n	#ifdef ENVMAP_BLENDING_MULTIPLY\n\n		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_MIX )\n\n		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n	#elif defined( ENVMAP_BLENDING_ADD )\n\n		outgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_fragment.glsl

THREE.ShaderChunk[ 'envmap_pars_fragment'] = "#ifdef USE_ENVMAP\n\n	uniform float reflectivity;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n	uniform float flipEnvMap;\n\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\n		uniform float refractionRatio;\n\n	#else\n\n		varying vec3 vReflect;\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_pars_vertex.glsl

THREE.ShaderChunk[ 'envmap_pars_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	varying vec3 vReflect;\n\n	uniform float refractionRatio;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/envmap_vertex.glsl

THREE.ShaderChunk[ 'envmap_vertex'] = "#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP ) && ! defined( PHONG )\n\n	vec3 worldNormal = transformDirection( objectNormal, modelMatrix );\n\n	vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n	#ifdef ENVMAP_MODE_REFLECTION\n\n		vReflect = reflect( cameraToVertex, worldNormal );\n\n	#else\n\n		vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/fog_fragment.glsl

THREE.ShaderChunk[ 'fog_fragment'] = "#ifdef USE_FOG\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		float depth = gl_FragDepthEXT / gl_FragCoord.w;\n\n	#else\n\n		float depth = gl_FragCoord.z / gl_FragCoord.w;\n\n	#endif\n\n	#ifdef FOG_EXP2\n\n		float fogFactor = whiteCompliment( exp2( - fogDensity * fogDensity * depth * depth * LOG2 ) );\n\n	#else\n\n		float fogFactor = smoothstep( fogNear, fogFar, depth );\n\n	#endif\n	\n	outgoingLight = mix( outgoingLight, fogColor, fogFactor );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/fog_pars_fragment.glsl

THREE.ShaderChunk[ 'fog_pars_fragment'] = "#ifdef USE_FOG\n\n	uniform vec3 fogColor;\n\n	#ifdef FOG_EXP2\n\n		uniform float fogDensity;\n\n	#else\n\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lightmap_fragment.glsl

THREE.ShaderChunk[ 'lightmap_fragment'] = "#ifdef USE_LIGHTMAP\n\n	totalAmbientLight += texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lightmap_pars_fragment.glsl

THREE.ShaderChunk[ 'lightmap_pars_fragment'] = "#ifdef USE_LIGHTMAP\n\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_pars_vertex'] = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_lambert_vertex.glsl

THREE.ShaderChunk[ 'lights_lambert_vertex'] = "vLightFront = vec3( 0.0 );\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack = vec3( 0.0 );\n\n#endif\n\nvec3 normal = normalize( transformedNormal );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = pointLightColor[ i ];\n\n		vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		// attenuation\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lightDir );\n\n		vLightFront += lightColor * attenuation * saturate( dotProduct );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += lightColor * attenuation * saturate( - dotProduct );\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = spotLightColor[ i ];\n\n		vec3 lightPosition = spotLightPosition[ i ];\n		vec4 lPosition = viewMatrix * vec4( lightPosition, 1.0 );\n		vec3 lVector = lPosition.xyz - mvPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( lightPosition - worldPosition.xyz ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = saturate( pow( saturate( spotEffect ), spotLightExponent[ i ] ) );\n\n			// attenuation\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			attenuation *= spotEffect;\n\n			// diffuse\n\n			float dotProduct = dot( normal, lightDir );\n\n			vLightFront += lightColor * attenuation * saturate( dotProduct );\n\n			#ifdef DOUBLE_SIDED\n\n				vLightBack += lightColor * attenuation * saturate( - dotProduct );\n\n			#endif\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 lightColor = directionalLightColor[ i ];\n\n		vec3 lightDir = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lightDir );\n\n		vLightFront += lightColor * saturate( dotProduct );\n\n		#ifdef DOUBLE_SIDED\n\n			vLightBack += lightColor * saturate( - dotProduct );\n\n		#endif\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lightDir = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lightDir );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		#ifdef DOUBLE_SIDED\n\n			float hemiDiffuseWeightBack = - 0.5 * dotProduct + 0.5;\n\n			vLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\n		#endif\n\n	}\n\n#endif\n\nvLightFront += ambientLightColor;\n\n#ifdef DOUBLE_SIDED\n\n	vLightBack += ambientLightColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_fragment'] = "#ifndef FLAT_SHADED\n\n	vec3 normal = normalize( vNormal );\n\n	#ifdef DOUBLE_SIDED\n\n		normal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\n	#endif\n\n#else\n\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n\n#endif\n\n#ifdef USE_NORMALMAP\n\n	normal = perturbNormal2Arb( -vViewPosition, normal );\n\n#elif defined( USE_BUMPMAP )\n\n	normal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n\n#endif\n\nvec3 viewDir = normalize( vViewPosition );\n\nvec3 totalDiffuseLight = vec3( 0.0 );\nvec3 totalSpecularLight = vec3( 0.0 );\n\n#if MAX_POINT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = pointLightColor[ i ];\n\n		vec3 lightPosition = pointLightPosition[ i ];\n		vec4 lPosition = viewMatrix * vec4( lightPosition, 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		// attenuation\n\n		float attenuation = calcLightAttenuation( length( lVector ), pointLightDistance[ i ], pointLightDecay[ i ] );\n\n		// diffuse\n\n		float cosineTerm = saturate( dot( normal, lightDir ) );\n\n		totalDiffuseLight += lightColor * attenuation * cosineTerm;\n\n		// specular\n\n		vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n		totalSpecularLight += brdf * specularStrength * lightColor * attenuation * cosineTerm;\n\n\n	}\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\n		vec3 lightColor = spotLightColor[ i ];\n\n		vec3 lightPosition = spotLightPosition[ i ];\n		vec4 lPosition = viewMatrix * vec4( lightPosition, 1.0 );\n		vec3 lVector = lPosition.xyz + vViewPosition.xyz;\n		vec3 lightDir = normalize( lVector );\n\n		float spotEffect = dot( spotLightDirection[ i ], normalize( lightPosition - vWorldPosition ) );\n\n		if ( spotEffect > spotLightAngleCos[ i ] ) {\n\n			spotEffect = saturate( pow( saturate( spotEffect ), spotLightExponent[ i ] ) );\n\n			// attenuation\n\n			float attenuation = calcLightAttenuation( length( lVector ), spotLightDistance[ i ], spotLightDecay[ i ] );\n\n			attenuation *= spotEffect;\n\n			// diffuse\n\n			float cosineTerm = saturate( dot( normal, lightDir ) );\n\n			totalDiffuseLight += lightColor * attenuation * cosineTerm;\n\n			// specular\n\n			vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n			totalSpecularLight += brdf * specularStrength * lightColor * attenuation * cosineTerm;\n\n		}\n\n	}\n\n#endif\n\n#if MAX_DIR_LIGHTS > 0\n\n	for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\n		vec3 lightColor = directionalLightColor[ i ];\n\n		vec3 lightDir = transformDirection( directionalLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float cosineTerm = saturate( dot( normal, lightDir ) );\n\n		totalDiffuseLight += lightColor * cosineTerm;\n\n		// specular\n\n		vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n		totalSpecularLight += brdf * specularStrength * lightColor * cosineTerm;\n\n	}\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\n		vec3 lightDir = transformDirection( hemisphereLightDirection[ i ], viewMatrix );\n\n		// diffuse\n\n		float dotProduct = dot( normal, lightDir );\n\n		float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\n		vec3 lightColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\n		totalDiffuseLight += lightColor;\n\n		// specular (sky term only)\n\n		vec3 brdf = BRDF_BlinnPhong( specular, shininess, normal, lightDir, viewDir );\n\n		totalSpecularLight += brdf * specularStrength * lightColor * max( dotProduct, 0.0 );\n\n	}\n\n#endif\n\n#ifdef METAL\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) * specular + totalSpecularLight + emissive;\n\n#else\n\n	outgoingLight += diffuseColor.rgb * ( totalDiffuseLight + totalAmbientLight ) + totalSpecularLight + emissive;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_fragment.glsl

THREE.ShaderChunk[ 'lights_phong_pars_fragment'] = "uniform vec3 ambientLightColor;\n\n#if MAX_DIR_LIGHTS > 0\n\n	uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n	uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n\n#endif\n\n#if MAX_HEMI_LIGHTS > 0\n\n	uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n	uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n\n#endif\n\n#if MAX_POINT_LIGHTS > 0\n\n	uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\n	uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n	uniform float pointLightDecay[ MAX_POINT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0\n\n	uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n	uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n	uniform float spotLightDecay[ MAX_SPOT_LIGHTS ];\n\n#endif\n\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n\nvarying vec3 vViewPosition;\n\n#ifndef FLAT_SHADED\n\n	varying vec3 vNormal;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_pars_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_pars_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	varying vec3 vWorldPosition;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/lights_phong_vertex.glsl

THREE.ShaderChunk[ 'lights_phong_vertex'] = "#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\n	vWorldPosition = worldPosition.xyz;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/linear_to_gamma_fragment.glsl

THREE.ShaderChunk[ 'linear_to_gamma_fragment'] = "\n	outgoingLight = linearToOutput( outgoingLight );\n";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_fragment'] = "#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\n	gl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_fragment.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_fragment'] = "#ifdef USE_LOGDEPTHBUF\n\n	uniform float logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		#extension GL_EXT_frag_depth : enable\n		varying float vFragDepth;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_pars_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_pars_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		varying float vFragDepth;\n\n	#endif\n\n	uniform float logDepthBufFC;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/logdepthbuf_vertex.glsl

THREE.ShaderChunk[ 'logdepthbuf_vertex'] = "#ifdef USE_LOGDEPTHBUF\n\n	gl_Position.z = log2(max( EPSILON, gl_Position.w + 1.0 )) * logDepthBufFC;\n\n	#ifdef USE_LOGDEPTHBUF_EXT\n\n		vFragDepth = 1.0 + gl_Position.w;\n\n#else\n\n		gl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_fragment.glsl

THREE.ShaderChunk[ 'map_fragment'] = "#ifdef USE_MAP\n\n	vec4 texelColor = texture2D( map, vUv );\n\n	texelColor.xyz = inputToLinear( texelColor.xyz );\n\n	diffuseColor *= texelColor;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_pars_fragment.glsl

THREE.ShaderChunk[ 'map_pars_fragment'] = "#ifdef USE_MAP\n\n	uniform sampler2D map;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/map_particle_fragment.glsl

THREE.ShaderChunk[ 'map_particle_fragment'] = "#ifdef USE_MAP\n\n	diffuseColor *= texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) * offsetRepeat.zw + offsetRepeat.xy );\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/map_particle_pars_fragment.glsl

THREE.ShaderChunk[ 'map_particle_pars_fragment'] = "#ifdef USE_MAP\n\n	uniform vec4 offsetRepeat;\n	uniform sampler2D map;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/morphnormal_vertex.glsl

THREE.ShaderChunk[ 'morphnormal_vertex'] = "#ifdef USE_MORPHNORMALS\n\n	vec3 morphedNormal = vec3( 0.0 );\n\n	morphedNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n	morphedNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n	morphedNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n	morphedNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\n	morphedNormal += normal;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_pars_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_pars_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	#ifndef USE_MORPHNORMALS\n\n	uniform float morphTargetInfluences[ 8 ];\n\n	#else\n\n	uniform float morphTargetInfluences[ 4 ];\n\n	#endif\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/morphtarget_vertex.glsl

THREE.ShaderChunk[ 'morphtarget_vertex'] = "#ifdef USE_MORPHTARGETS\n\n	vec3 morphed = vec3( 0.0 );\n	morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n	morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n	morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n	morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\n	#ifndef USE_MORPHNORMALS\n\n	morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n	morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n	morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n	morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\n	#endif\n\n	morphed += position;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/normalmap_pars_fragment.glsl

THREE.ShaderChunk[ 'normalmap_pars_fragment'] = "#ifdef USE_NORMALMAP\n\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n\n	// Per-Pixel Tangent Space Normal Mapping\n	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html\n\n	vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( vUv.st );\n		vec2 st1 = dFdy( vUv.st );\n\n		vec3 S = normalize( q0 * st1.t - q1 * st0.t );\n		vec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n		vec3 N = normalize( surf_norm );\n\n		vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n		mapN.xy = normalScale * mapN.xy;\n		mat3 tsn = mat3( S, T, N );\n		return normalize( tsn * mapN );\n\n	}\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/shadowmap_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_fragment'] = "#ifdef USE_SHADOWMAP\n\n	#ifdef SHADOWMAP_DEBUG\n\n		vec3 frustumColors[3];\n		frustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n		frustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n		frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\n	#endif\n\n	#ifdef SHADOWMAP_CASCADE\n\n		int inFrustumCount = 0;\n\n	#endif\n\n	float fDepth;\n	vec3 shadowColor = vec3( 1.0 );\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\n				// if ( something && something ) breaks ATI OpenGL shader compiler\n				// if ( all( something, something ) ) using this instead\n\n		bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n		bool inFrustum = all( inFrustumVec );\n\n				// don't shadow pixels outside of light frustum\n				// use just first frustum (for cascades)\n				// don't shadow pixels behind far plane of light frustum\n\n		#ifdef SHADOWMAP_CASCADE\n\n			inFrustumCount += int( inFrustum );\n			bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\n		#else\n\n			bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\n		#endif\n\n		bool frustumTest = all( frustumTestVec );\n\n		if ( frustumTest ) {\n\n			shadowCoord.z += shadowBias[ i ];\n\n			#if defined( SHADOWMAP_TYPE_PCF )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n		/*\n						// nested loops breaks shader compiler / validator on some ATI cards when using OpenGL\n						// must enroll loop manually\n\n				for ( float y = -1.25; y <= 1.25; y += 1.25 )\n					for ( float x = -1.25; x <= 1.25; x += 1.25 ) {\n\n						vec4 rgbaDepth = texture2D( shadowMap[ i ], vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy );\n\n								// doesn't seem to produce any noticeable visual difference compared to simple texture2D lookup\n								//vec4 rgbaDepth = texture2DProj( shadowMap[ i ], vec4( vShadowCoord[ i ].w * ( vec2( x * xPixelOffset, y * yPixelOffset ) + shadowCoord.xy ), 0.05, vShadowCoord[ i ].w ) );\n\n						float fDepth = unpackDepth( rgbaDepth );\n\n						if ( fDepth < shadowCoord.z )\n							shadow += 1.0;\n\n				}\n\n				shadow /= 9.0;\n\n		*/\n\n				const float shadowDelta = 1.0 / 9.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.25 * xPixelOffset;\n				float dy0 = -1.25 * yPixelOffset;\n				float dx1 = 1.25 * xPixelOffset;\n				float dy1 = 1.25 * yPixelOffset;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n				if ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n						// Percentage-close filtering\n						// (9 pixel kernel)\n						// http://fabiensanglard.net/shadowmappingPCF/\n\n				float shadow = 0.0;\n\n				float xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n				float yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\n				float dx0 = -1.0 * xPixelOffset;\n				float dy0 = -1.0 * yPixelOffset;\n				float dx1 = 1.0 * xPixelOffset;\n				float dy1 = 1.0 * yPixelOffset;\n\n				mat3 shadowKernel;\n				mat3 depthKernel;\n\n				depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n				depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n				depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n				depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n				depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n				depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n				depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n				depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n				depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\n				vec3 shadowZ = vec3( shadowCoord.z );\n				shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n				shadowKernel[0] *= vec3(0.25);\n\n				shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n				shadowKernel[1] *= vec3(0.25);\n\n				shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n				shadowKernel[2] *= vec3(0.25);\n\n				vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\n				shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n				shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\n				vec4 shadowValues;\n				shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n				shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n				shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n				shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\n				shadow = dot( shadowValues, vec4( 1.0 ) );\n\n				shadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\n			#else\n\n				vec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n				float fDepth = unpackDepth( rgbaDepth );\n\n				if ( fDepth < shadowCoord.z )\n\n		// spot with multiple shadows is darker\n\n					shadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\n		// spot with multiple shadows has the same color as single shadow spot\n\n		// 					shadowColor = min( shadowColor, vec3( shadowDarkness[ i ] ) );\n\n			#endif\n\n		}\n\n\n		#ifdef SHADOWMAP_DEBUG\n\n			#ifdef SHADOWMAP_CASCADE\n\n				if ( inFrustum && inFrustumCount == 1 ) outgoingLight *= frustumColors[ i ];\n\n			#else\n\n				if ( inFrustum ) outgoingLight *= frustumColors[ i ];\n\n			#endif\n\n		#endif\n\n	}\n\n	// NOTE: I am unsure if this is correct in linear space.  -bhouston, Dec 29, 2014\n	shadowColor = inputToLinear( shadowColor );\n\n	outgoingLight = outgoingLight * shadowColor;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl

THREE.ShaderChunk[ 'shadowmap_pars_fragment'] = "#ifdef USE_SHADOWMAP\n\n	uniform sampler2D shadowMap[ MAX_SHADOWS ];\n	uniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\n	uniform float shadowDarkness[ MAX_SHADOWS ];\n	uniform float shadowBias[ MAX_SHADOWS ];\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n\n	float unpackDepth( const in vec4 rgba_depth ) {\n\n		const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n		float depth = dot( rgba_depth, bit_shift );\n		return depth;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_pars_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_pars_vertex'] = "#ifdef USE_SHADOWMAP\n\n	varying vec4 vShadowCoord[ MAX_SHADOWS ];\n	uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/shadowmap_vertex.glsl

THREE.ShaderChunk[ 'shadowmap_vertex'] = "#ifdef USE_SHADOWMAP\n\n	for( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\n		vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\n	}\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinbase_vertex.glsl

THREE.ShaderChunk[ 'skinbase_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/skinning_pars_vertex.glsl

THREE.ShaderChunk[ 'skinning_pars_vertex'] = "#ifdef USE_SKINNING\n\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n\n	#ifdef BONE_TEXTURE\n\n		uniform sampler2D boneTexture;\n		uniform int boneTextureWidth;\n		uniform int boneTextureHeight;\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			float j = i * 4.0;\n			float x = mod( j, float( boneTextureWidth ) );\n			float y = floor( j / float( boneTextureWidth ) );\n\n			float dx = 1.0 / float( boneTextureWidth );\n			float dy = 1.0 / float( boneTextureHeight );\n\n			y = dy * ( y + 0.5 );\n\n			vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n			vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n			vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n			vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n			mat4 bone = mat4( v1, v2, v3, v4 );\n\n			return bone;\n\n		}\n\n	#else\n\n		uniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\n		mat4 getBoneMatrix( const in float i ) {\n\n			mat4 bone = boneGlobalMatrices[ int(i) ];\n			return bone;\n\n		}\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/skinning_vertex.glsl

THREE.ShaderChunk[ 'skinning_vertex'] = "#ifdef USE_SKINNING\n\n	#ifdef USE_MORPHTARGETS\n\n	vec4 skinVertex = bindMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n	vec4 skinVertex = bindMatrix * vec4( position, 1.0 );\n\n	#endif\n\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	skinned  = bindMatrixInverse * skinned;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/skinnormal_vertex.glsl

THREE.ShaderChunk[ 'skinnormal_vertex'] = "#ifdef USE_SKINNING\n\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix  = bindMatrixInverse * skinMatrix * bindMatrix;\n\n	#ifdef USE_MORPHNORMALS\n\n	vec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\n	#else\n\n	vec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/specularmap_fragment.glsl

THREE.ShaderChunk[ 'specularmap_fragment'] = "float specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n	vec4 texelSpecular = texture2D( specularMap, vUv );\n	specularStrength = texelSpecular.r;\n\n#else\n\n	specularStrength = 1.0;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/specularmap_pars_fragment.glsl

THREE.ShaderChunk[ 'specularmap_pars_fragment'] = "#ifdef USE_SPECULARMAP\n\n	uniform sampler2D specularMap;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv2_pars_fragment.glsl

THREE.ShaderChunk[ 'uv2_pars_fragment'] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	varying vec2 vUv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv2_pars_vertex.glsl

THREE.ShaderChunk[ 'uv2_pars_vertex'] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	attribute vec2 uv2;\n	varying vec2 vUv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv2_vertex.glsl

THREE.ShaderChunk[ 'uv2_vertex'] = "#if defined( USE_LIGHTMAP ) || defined( USE_AOMAP )\n\n	vUv2 = uv2;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv_pars_fragment.glsl

THREE.ShaderChunk[ 'uv_pars_fragment'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/uv_pars_vertex.glsl

THREE.ShaderChunk[ 'uv_pars_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	varying vec2 vUv;\n	uniform vec4 offsetRepeat;\n\n#endif\n";

// File:src/renderers/shaders/ShaderChunk/uv_vertex.glsl

THREE.ShaderChunk[ 'uv_vertex'] = "#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP ) || defined( USE_ALPHAMAP )\n\n	vUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n\n#endif";

// File:src/renderers/shaders/ShaderChunk/worldpos_vertex.glsl

THREE.ShaderChunk[ 'worldpos_vertex'] = "#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\n	#ifdef USE_SKINNING\n\n		vec4 worldPosition = modelMatrix * skinned;\n\n	#elif defined( USE_MORPHTARGETS )\n\n		vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\n	#else\n\n		vec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\n	#endif\n\n#endif\n";

// File:src/renderers/shaders/UniformsUtils.js

/**
 * Uniform Utilities
 */

THREE.UniformsUtils = {

	merge: function ( uniforms ) {

		var merged = {};

		for ( var u = 0; u < uniforms.length; u ++ ) {

			var tmp = this.clone( uniforms[ u ] );

			for ( var p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	clone: function ( uniforms_src ) {

		var uniforms_dst = {};

		for ( var u in uniforms_src ) {

			uniforms_dst[ u ] = {};

			for ( var p in uniforms_src[ u ] ) {

				var parameter_src = uniforms_src[ u ][ p ];

				if ( parameter_src instanceof THREE.Color ||
					 parameter_src instanceof THREE.Vector2 ||
					 parameter_src instanceof THREE.Vector3 ||
					 parameter_src instanceof THREE.Vector4 ||
					 parameter_src instanceof THREE.Matrix3 ||
					 parameter_src instanceof THREE.Matrix4 ||
					 parameter_src instanceof THREE.Texture ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( Array.isArray( parameter_src ) ) {

					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};

// File:src/renderers/shaders/UniformsLib.js

/**
 * Uniforms library for shared webgl shaders
 */

THREE.UniformsLib = {

	common: {

		"diffuse" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },

		"map" : { type: "t", value: null },
		"offsetRepeat" : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"specularMap" : { type: "t", value: null },
		"alphaMap" : { type: "t", value: null },

		"envMap" : { type: "t", value: null },
		"flipEnvMap" : { type: "f", value: - 1 },
		"reflectivity" : { type: "f", value: 1.0 },
		"refractionRatio" : { type: "f", value: 0.98 }

	},

	aomap: {

		"aoMap" : { type: "t", value: null },
		"aoMapIntensity" : { type: "f", value: 1 },

	},

	lightmap: {

		"lightMap" : { type: "t", value: null },
		"lightMapIntensity" : { type: "f", value: 1 },

	},

	bump: {

		"bumpMap" : { type: "t", value: null },
		"bumpScale" : { type: "f", value: 1 }

	},

	normalmap: {

		"normalMap" : { type: "t", value: null },
		"normalScale" : { type: "v2", value: new THREE.Vector2( 1, 1 ) }
	},

	fog : {

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	lights: {

		"ambientLightColor" : { type: "fv", value: [] },

		"directionalLightDirection" : { type: "fv", value: [] },
		"directionalLightColor" : { type: "fv", value: [] },

		"hemisphereLightDirection" : { type: "fv", value: [] },
		"hemisphereLightSkyColor" : { type: "fv", value: [] },
		"hemisphereLightGroundColor" : { type: "fv", value: [] },

		"pointLightColor" : { type: "fv", value: [] },
		"pointLightPosition" : { type: "fv", value: [] },
		"pointLightDistance" : { type: "fv1", value: [] },
		"pointLightDecay" : { type: "fv1", value: [] },

		"spotLightColor" : { type: "fv", value: [] },
		"spotLightPosition" : { type: "fv", value: [] },
		"spotLightDirection" : { type: "fv", value: [] },
		"spotLightDistance" : { type: "fv1", value: [] },
		"spotLightAngleCos" : { type: "fv1", value: [] },
		"spotLightExponent" : { type: "fv1", value: [] },
		"spotLightDecay" : { type: "fv1", value: [] }

	},

	particle: {

		"psColor" : { type: "c", value: new THREE.Color( 0xeeeeee ) },
		"opacity" : { type: "f", value: 1.0 },
		"size" : { type: "f", value: 1.0 },
		"scale" : { type: "f", value: 1.0 },
		"map" : { type: "t", value: null },
		"offsetRepeat" : { type: "v4", value: new THREE.Vector4( 0, 0, 1, 1 ) },

		"fogDensity" : { type: "f", value: 0.00025 },
		"fogNear" : { type: "f", value: 1 },
		"fogFar" : { type: "f", value: 2000 },
		"fogColor" : { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	shadowmap: {

		"shadowMap": { type: "tv", value: [] },
		"shadowMapSize": { type: "v2v", value: [] },

		"shadowBias" : { type: "fv1", value: [] },
		"shadowDarkness": { type: "fv1", value: [] },

		"shadowMatrix" : { type: "m4v", value: [] }

	}

};

// File:src/renderers/shaders/ShaderLib.js

/**
 * Webgl Shader Library for three.js
 *
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */


THREE.ShaderLib = {

	'basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "aomap" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "uv_pars_vertex" ],
			THREE.ShaderChunk[ "uv2_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "uv_vertex" ],
				THREE.ShaderChunk[ "uv2_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],

			"	#ifdef USE_ENVMAP",

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"	#endif",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "uv_pars_fragment" ],
			THREE.ShaderChunk[ "uv2_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "aomap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	vec3 outgoingLight = vec3( 0.0 );",
			"	vec4 diffuseColor = vec4( diffuse, opacity );",
			"	vec3 totalAmbientLight = vec3( 1.0 );", // hardwired

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],
				THREE.ShaderChunk[ "aomap_fragment" ],

			"	outgoingLight = diffuseColor.rgb * totalAmbientLight;", // simple shader

				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],		// TODO: Shadows on an otherwise unlit surface doesn't make sense.

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'lambert': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) }
			}

		] ),

		vertexShader: [

			"#define LAMBERT",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "uv_pars_vertex" ],
			THREE.ShaderChunk[ "uv2_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_lambert_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "uv_vertex" ],
				THREE.ShaderChunk[ "uv2_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_lambert_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform vec3 emissive;",
			"uniform float opacity;",

			"varying vec3 vLightFront;",

			"#ifdef DOUBLE_SIDED",

			"	varying vec3 vLightBack;",

			"#endif",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "uv_pars_fragment" ],
			THREE.ShaderChunk[ "uv2_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
			"	vec4 diffuseColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],

			"	#ifdef DOUBLE_SIDED",

					//"float isFront = float( gl_FrontFacing );",
					//"gl_FragColor.xyz *= isFront * vLightFront + ( 1.0 - isFront ) * vLightBack;",

			"		if ( gl_FrontFacing )",
			"			outgoingLight += diffuseColor.rgb * vLightFront + emissive;",
			"		else",
			"			outgoingLight += diffuseColor.rgb * vLightBack + emissive;",

			"	#else",

			"		outgoingLight += diffuseColor.rgb * vLightFront + emissive;",

			"	#endif",

				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'phong': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "aomap" ],
			THREE.UniformsLib[ "lightmap" ],
			THREE.UniformsLib[ "bump" ],
			THREE.UniformsLib[ "normalmap" ],
			THREE.UniformsLib[ "fog" ],
			THREE.UniformsLib[ "lights" ],
			THREE.UniformsLib[ "shadowmap" ],

			{
				"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
				"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
				"shininess": { type: "f", value: 30 }
			}

		] ),

		vertexShader: [

			"#define PHONG",

			"varying vec3 vViewPosition;",

			"#ifndef FLAT_SHADED",

			"	varying vec3 vNormal;",

			"#endif",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "uv_pars_vertex" ],
			THREE.ShaderChunk[ "uv2_pars_vertex" ],
			THREE.ShaderChunk[ "envmap_pars_vertex" ],
			THREE.ShaderChunk[ "lights_phong_pars_vertex" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "uv_vertex" ],
				THREE.ShaderChunk[ "uv2_vertex" ],
				THREE.ShaderChunk[ "color_vertex" ],

				THREE.ShaderChunk[ "morphnormal_vertex" ],
				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "skinnormal_vertex" ],
				THREE.ShaderChunk[ "defaultnormal_vertex" ],

			"#ifndef FLAT_SHADED", // Normal computed with derivatives when FLAT_SHADED

			"	vNormal = normalize( transformedNormal );",

			"#endif",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"	vViewPosition = -mvPosition.xyz;",

				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "envmap_vertex" ],
				THREE.ShaderChunk[ "lights_phong_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"#define PHONG",

			"uniform vec3 diffuse;",
			"uniform vec3 emissive;",
			"uniform vec3 specular;",
			"uniform float shininess;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "uv_pars_fragment" ],
			THREE.ShaderChunk[ "uv2_pars_fragment" ],
			THREE.ShaderChunk[ "map_pars_fragment" ],
			THREE.ShaderChunk[ "alphamap_pars_fragment" ],
			THREE.ShaderChunk[ "aomap_pars_fragment" ],
			THREE.ShaderChunk[ "lightmap_pars_fragment" ],
			THREE.ShaderChunk[ "envmap_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "lights_phong_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "bumpmap_pars_fragment" ],
			THREE.ShaderChunk[ "normalmap_pars_fragment" ],
			THREE.ShaderChunk[ "specularmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
			"	vec4 diffuseColor = vec4( diffuse, opacity );",
			"	vec3 totalAmbientLight = ambientLightColor;",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "alphamap_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],
				THREE.ShaderChunk[ "specularmap_fragment" ],
				THREE.ShaderChunk[ "lightmap_fragment" ],
				THREE.ShaderChunk[ "aomap_fragment" ],

				THREE.ShaderChunk[ "lights_phong_fragment" ],

				THREE.ShaderChunk[ "envmap_fragment" ],
				THREE.ShaderChunk[ "shadowmap_fragment" ],

				THREE.ShaderChunk[ "linear_to_gamma_fragment" ],

				THREE.ShaderChunk[ "fog_fragment" ],

			"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'particle_basic': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "particle" ],
			THREE.UniformsLib[ "shadowmap" ]

		] ),

		vertexShader: [

			"uniform float size;",
			"uniform float scale;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

			"	#ifdef USE_SIZEATTENUATION",
			"		gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
			"	#else",
			"		gl_PointSize = size;",
			"	#endif",

			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],
				THREE.ShaderChunk[ "worldpos_vertex" ],
				THREE.ShaderChunk[ "shadowmap_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 psColor;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "map_particle_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
			"	vec4 diffuseColor = vec4( psColor, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "map_particle_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],
				THREE.ShaderChunk[ "alphatest_fragment" ],

			"	outgoingLight = diffuseColor.rgb;", // simple shader

				THREE.ShaderChunk[ "shadowmap_fragment" ],
				THREE.ShaderChunk[ "fog_fragment" ],

			"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'dashed': {

		uniforms: THREE.UniformsUtils.merge( [

			THREE.UniformsLib[ "common" ],
			THREE.UniformsLib[ "fog" ],

			{
				"scale"    : { type: "f", value: 1 },
				"dashSize" : { type: "f", value: 1 },
				"totalSize": { type: "f", value: 2 }
			}

		] ),

		vertexShader: [

			"uniform float scale;",
			"attribute float lineDistance;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "color_vertex" ],

			"	vLineDistance = scale * lineDistance;",

			"	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"	gl_Position = projectionMatrix * mvPosition;",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec3 diffuse;",
			"uniform float opacity;",

			"uniform float dashSize;",
			"uniform float totalSize;",

			"varying float vLineDistance;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "color_pars_fragment" ],
			THREE.ShaderChunk[ "fog_pars_fragment" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	if ( mod( vLineDistance, totalSize ) > dashSize ) {",

			"		discard;",

			"	}",

			"	vec3 outgoingLight = vec3( 0.0 );",	// outgoing light does not have an alpha, the surface does
			"	vec4 diffuseColor = vec4( diffuse, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],
				THREE.ShaderChunk[ "color_fragment" ],

			"	outgoingLight = diffuseColor.rgb;", // simple shader

				THREE.ShaderChunk[ "fog_fragment" ],

			"	gl_FragColor = vec4( outgoingLight, diffuseColor.a );",	// TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'depth': {

		uniforms: {

			"mNear": { type: "f", value: 1.0 },
			"mFar" : { type: "f", value: 2000.0 },
			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float mNear;",
			"uniform float mFar;",
			"uniform float opacity;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		float depth = gl_FragDepthEXT / gl_FragCoord.w;",

			"	#else",

			"		float depth = gl_FragCoord.z / gl_FragCoord.w;",

			"	#endif",

			"	float color = 1.0 - smoothstep( mNear, mFar, depth );",
			"	gl_FragColor = vec4( vec3( color ), opacity );",   // TODO, this should be pre-multiplied to allow for bright highlights on very transparent objects

			"}"

		].join("\n")

	},

	'normal': {

		uniforms: {

			"opacity" : { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vNormal = normalize( normalMatrix * normal );",

				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",
			"varying vec3 vNormal;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'cube': {

		uniforms: { "tCube": { type: "t", value: null },
					"tFlip": { type: "f", value: - 1 } },

		vertexShader: [

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vWorldPosition = transformDirection( position, modelMatrix );",

			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform samplerCube tCube;",
			"uniform float tFlip;",

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

			"	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Cube map shader
	 ------------------------------------------------------------------------- */

	'equirect': {

		uniforms: { "tEquirect": { type: "t", value: null },
					"tFlip": { type: "f", value: - 1 } },

		vertexShader: [

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

			"	vWorldPosition = transformDirection( position, modelMatrix );",

			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D tEquirect;",
			"uniform float tFlip;",

			"varying vec3 vWorldPosition;",

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"void main() {",

				// "	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",
				"vec3 direction = normalize( vWorldPosition );",
				"vec2 sampleUV;",
				"sampleUV.y = saturate( tFlip * direction.y * -0.5 + 0.5 );",
				"sampleUV.x = atan( direction.z, direction.x ) * RECIPROCAL_PI2 + 0.5;",
				"gl_FragColor = texture2D( tEquirect, sampleUV );",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"}"

		].join("\n")

	},

	/* Depth encoding into RGBA texture
	 *
	 * based on SpiderGL shadow map example
	 * http://spidergl.org/example.php?id=6
	 *
	 * originally from
	 * http://www.gamedev.net/topic/442138-packing-a-float-into-a-a8r8g8b8-texture-shader/page__whichpage__1%25EF%25BF%25BD
	 *
	 * see also
	 * http://aras-p.info/blog/2009/07/30/encoding-floats-to-rgba-the-final/
	 */

	'depthRGBA': {

		uniforms: {},

		vertexShader: [

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "morphtarget_pars_vertex" ],
			THREE.ShaderChunk[ "skinning_pars_vertex" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],

			"void main() {",

				THREE.ShaderChunk[ "skinbase_vertex" ],
				THREE.ShaderChunk[ "morphtarget_vertex" ],
				THREE.ShaderChunk[ "skinning_vertex" ],
				THREE.ShaderChunk[ "default_vertex" ],
				THREE.ShaderChunk[ "logdepthbuf_vertex" ],

			"}"

		].join("\n"),

		fragmentShader: [

			THREE.ShaderChunk[ "common" ],
			THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],

			"vec4 pack_depth( const in float depth ) {",

			"	const vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );",
			"	const vec4 bit_mask = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );",
			"	vec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );", // "	vec4 res = fract( depth * bit_shift );",
			"	res -= res.xxyz * bit_mask;",
			"	return res;",

			"}",

			"void main() {",

				THREE.ShaderChunk[ "logdepthbuf_fragment" ],

			"	#ifdef USE_LOGDEPTHBUF_EXT",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );",

			"	#else",

			"		gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );",

			"	#endif",

				//"gl_FragData[ 0 ] = pack_depth( gl_FragCoord.z / gl_FragCoord.w );",
				//"float z = ( ( gl_FragCoord.z / gl_FragCoord.w ) - 3.0 ) / ( 4000.0 - 3.0 );",
				//"gl_FragData[ 0 ] = pack_depth( z );",
				//"gl_FragData[ 0 ] = vec4( z, z, z, 1.0 );",

			"}"

		].join("\n")

	}

};

// File:src/renderers/WebGLRenderer.js

/* global THREE, Uint32Array */
/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 * @param parameters - named parameters object:
 *    canvas {HTMLCanvasElement} = new element,
 *    context {WebGLRenderingContext} = null,
 *    precision {String} = "highp",
 *    alpha {Boolean} = false,
 *    depth {Boolean} = true,
 *    stencil {Boolean} = true,
 *    antialias {Boolean} = false,
 *    premultipliedAlpha {Boolean} = true,
 *    preserveDrawingBuffer {Boolean} = false,
 *    logarithmicDepthBuffer {Boolean} = false
 */
THREE.WebGLRenderer = function ( parameters ) {

	console.log( 'THREE.WebGLRenderer', THREE.REVISION );

	parameters = parameters || {};

	var _canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' ),
	_context = parameters.context !== undefined ? parameters.context : null,

	_width = _canvas.width,
	_height = _canvas.height,

	pixelRatio = 1,

	_precision = parameters.precision !== undefined ? parameters.precision : 'highp',

	_alpha = parameters.alpha !== undefined ? parameters.alpha : false,
	_depth = parameters.depth !== undefined ? parameters.depth : true,
	_stencil = parameters.stencil !== undefined ? parameters.stencil : true,
	_antialias = parameters.antialias !== undefined ? parameters.antialias : false,
	_premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true,
	_preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false,
	_logarithmicDepthBuffer = parameters.logarithmicDepthBuffer !== undefined ? parameters.logarithmicDepthBuffer : false,

	_clearColor = new THREE.Color( 0x000000 ),
	_clearAlpha = 0;

	var lights = [];

	var opaqueObjects = [];
	var transparentObjects = [];

	var sprites = [];
	var lensFlares = [];

	// public properties

	this.domElement = _canvas;
	this.context = null;

	// clearing

	this.autoClear = true;
	this.autoClearColor = true;
	this.autoClearDepth = true;
	this.autoClearStencil = true;

	// scene graph

	this.sortObjects = true;

	// physically based shading

	this.gammaFactor = 2.0;	// for backwards compatibility
	this.gammaInput = false;
	this.gammaOutput = false;

	// morphs

	this.maxMorphTargets = 8;
	this.maxMorphNormals = 4;

	// flags

	this.autoScaleCubemaps = true;

	// info

	this.info = {

		memory: {

			programs: 0,
			geometries: 0,
			textures: 0

		},

		render: {

			calls: 0,
			vertices: 0,
			faces: 0,
			points: 0

		}

	};

	// internal properties

	var _this = this,

	_programs = [],

	// internal state cache

	_currentProgram = null,
	_currentFramebuffer = null,
	_currentMaterialId = - 1,
	_currentGeometryProgram = '',
	_currentCamera = null,

	_usedTextureUnits = 0,

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = _canvas.width,
	_viewportHeight = _canvas.height,
	_currentWidth = 0,
	_currentHeight = 0,

	// frustum

	_frustum = new THREE.Frustum(),

	 // camera matrices cache

	_projScreenMatrix = new THREE.Matrix4(),

	_vector3 = new THREE.Vector3(),

	// light arrays cache

	_direction = new THREE.Vector3(),

	_lightsNeedUpdate = true,

	_lights = {

		ambient: [ 0, 0, 0 ],
		directional: { length: 0, colors:[], positions: [] },
		point: { length: 0, colors: [], positions: [], distances: [], decays: [] },
		spot: { length: 0, colors: [], positions: [], distances: [], directions: [], anglesCos: [], exponents: [], decays: [] },
		hemi: { length: 0, skyColors: [], groundColors: [], positions: [] }

	};

	// initialize

	var _gl;

	try {

		var attributes = {
			alpha: _alpha,
			depth: _depth,
			stencil: _stencil,
			antialias: _antialias,
			premultipliedAlpha: _premultipliedAlpha,
			preserveDrawingBuffer: _preserveDrawingBuffer
		};

		_gl = _context || _canvas.getContext( 'webgl', attributes ) || _canvas.getContext( 'experimental-webgl', attributes );

		if ( _gl === null ) {

			if ( _canvas.getContext( 'webgl') !== null ) {

				throw 'Error creating WebGL context with your selected attributes.';

			} else {

				throw 'Error creating WebGL context.';

			}

		}

		_canvas.addEventListener( 'webglcontextlost', function ( event ) {

			event.preventDefault();

			resetGLState();
			setDefaultGLState();

			objects.objects = {};

		}, false);

	} catch ( error ) {

		console.error( 'THREE.WebGLRenderer: ' + error );

	}

	var state = new THREE.WebGLState( _gl, paramThreeToGL );

	if ( _gl.getShaderPrecisionFormat === undefined ) {

		_gl.getShaderPrecisionFormat = function () {

			return {
				'rangeMin': 1,
				'rangeMax': 1,
				'precision': 1
			};

		};

	}

	var extensions = new THREE.WebGLExtensions( _gl );
	var objects = new THREE.WebGLObjects( _gl, this.info );

	extensions.get( 'OES_texture_float' );
	extensions.get( 'OES_texture_float_linear' );
	extensions.get( 'OES_texture_half_float' );
	extensions.get( 'OES_texture_half_float_linear' );
	extensions.get( 'OES_standard_derivatives' );
	extensions.get( 'ANGLE_instanced_arrays' );

	if ( extensions.get( 'OES_element_index_uint' ) ) {

		THREE.BufferGeometry.MaxIndex = 4294967296;

	}

	if ( _logarithmicDepthBuffer ) {

		extensions.get( 'EXT_frag_depth' );

	}

	//

	var glClearColor = function ( r, g, b, a ) {

		if ( _premultipliedAlpha === true ) {

			r *= a; g *= a; b *= a;

		}

		_gl.clearColor( r, g, b, a );

	};

	var setDefaultGLState = function () {

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );
		_gl.clearStencil( 0 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	var resetGLState = function () {

		_currentProgram = null;
		_currentCamera = null;

		_currentGeometryProgram = '';
		_currentMaterialId = - 1;

		_lightsNeedUpdate = true;

		state.reset();

	};

	setDefaultGLState();

	this.context = _gl;
	this.extensions = extensions;
	this.state = state;

	// shadow map

	var shadowMap = new THREE.WebGLShadowMap( this, lights, objects );

	this.shadowMap = shadowMap;

	// GPU capabilities

	var _maxTextures = _gl.getParameter( _gl.MAX_TEXTURE_IMAGE_UNITS );
	var _maxVertexTextures = _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );
	var _maxTextureSize = _gl.getParameter( _gl.MAX_TEXTURE_SIZE );
	var _maxCubemapSize = _gl.getParameter( _gl.MAX_CUBE_MAP_TEXTURE_SIZE );

	var _supportsVertexTextures = _maxVertexTextures > 0;
	var _supportsBoneTextures = _supportsVertexTextures && extensions.get( 'OES_texture_float' );
	var _supportsInstancedArrays = extensions.get( 'ANGLE_instanced_arrays' );

	//

	var _vertexShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.HIGH_FLOAT );
	var _vertexShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.VERTEX_SHADER, _gl.MEDIUM_FLOAT );

	var _fragmentShaderPrecisionHighpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.HIGH_FLOAT );
	var _fragmentShaderPrecisionMediumpFloat = _gl.getShaderPrecisionFormat( _gl.FRAGMENT_SHADER, _gl.MEDIUM_FLOAT );

	var getCompressedTextureFormats = ( function () {

		var array;

		return function () {

			if ( array !== undefined ) {

				return array;

			}

			array = [];

			if ( extensions.get( 'WEBGL_compressed_texture_pvrtc' ) || extensions.get( 'WEBGL_compressed_texture_s3tc' ) ) {

				var formats = _gl.getParameter( _gl.COMPRESSED_TEXTURE_FORMATS );

				for ( var i = 0; i < formats.length; i ++ ) {

					array.push( formats[ i ] );

				}

			}

			return array;

		};

	} )();

	// clamp precision to maximum available

	var highpAvailable = _vertexShaderPrecisionHighpFloat.precision > 0 && _fragmentShaderPrecisionHighpFloat.precision > 0;
	var mediumpAvailable = _vertexShaderPrecisionMediumpFloat.precision > 0 && _fragmentShaderPrecisionMediumpFloat.precision > 0;

	if ( _precision === 'highp' && ! highpAvailable ) {

		if ( mediumpAvailable ) {

			_precision = 'mediump';
			console.warn( 'THREE.WebGLRenderer: highp not supported, using mediump.' );

		} else {

			_precision = 'lowp';
			console.warn( 'THREE.WebGLRenderer: highp and mediump not supported, using lowp.' );

		}

	}

	if ( _precision === 'mediump' && ! mediumpAvailable ) {

		_precision = 'lowp';
		console.warn( 'THREE.WebGLRenderer: mediump not supported, using lowp.' );

	}

	// Plugins

	var spritePlugin = new THREE.SpritePlugin( this, sprites );
	var lensFlarePlugin = new THREE.LensFlarePlugin( this, lensFlares );

	// API

	this.getContext = function () {

		return _gl;

	};

	this.forceContextLoss = function () {

		extensions.get( 'WEBGL_lose_context' ).loseContext();

	};

	this.supportsVertexTextures = function () {

		return _supportsVertexTextures;

	};

	this.supportsInstancedArrays = function () {

		return _supportsInstancedArrays;

	};

	this.supportsFloatTextures = function () {

		return extensions.get( 'OES_texture_float' );

	};

	this.supportsHalfFloatTextures = function () {

		return extensions.get( 'OES_texture_half_float' );

	};

	this.supportsStandardDerivatives = function () {

		return extensions.get( 'OES_standard_derivatives' );

	};

	this.supportsCompressedTextureS3TC = function () {

		return extensions.get( 'WEBGL_compressed_texture_s3tc' );

	};

	this.supportsCompressedTexturePVRTC = function () {

		return extensions.get( 'WEBGL_compressed_texture_pvrtc' );

	};

	this.supportsBlendMinMax = function () {

		return extensions.get( 'EXT_blend_minmax' );

	};

	this.getMaxAnisotropy = ( function () {

		var value;

		return function () {

			if ( value !== undefined ) return value;

			var extension = extensions.get( 'EXT_texture_filter_anisotropic' );

			if ( extension !== null ) {

				value = _gl.getParameter( extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT );

			} else {

				value = 0;

			}

			return value;

		};

	} )();

	this.getPrecision = function () {

		return _precision;

	};

	this.getPixelRatio = function () {

		return pixelRatio;

	};

	this.setPixelRatio = function ( value ) {

		if ( value !== undefined ) pixelRatio = value;

	};

	this.getSize = function () {

		return {
			width: _width,
			height: _height
		};

	};

	this.setSize = function ( width, height, updateStyle ) {

		_width = width;
		_height = height;

		_canvas.width = width * pixelRatio;
		_canvas.height = height * pixelRatio;

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		this.setViewport( 0, 0, width, height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x * pixelRatio;
		_viewportY = y * pixelRatio;

		_viewportWidth = width * pixelRatio;
		_viewportHeight = height * pixelRatio;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor(
			x * pixelRatio,
			y * pixelRatio,
			width * pixelRatio,
			height * pixelRatio
		);

	};

	this.enableScissorTest = function ( enable ) {

		enable ? _gl.enable( _gl.SCISSOR_TEST ) : _gl.disable( _gl.SCISSOR_TEST );

	};

	// Clearing

	this.getClearColor = function () {

		return _clearColor;

	};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );

		_clearAlpha = alpha !== undefined ? alpha : 1;

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.setClearAlpha = function ( alpha ) {

		_clearAlpha = alpha;

		glClearColor( _clearColor.r, _clearColor.g, _clearColor.b, _clearAlpha );

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= _gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= _gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= _gl.STENCIL_BUFFER_BIT;

		_gl.clear( bits );

	};

	this.clearColor = function () {

		_gl.clear( _gl.COLOR_BUFFER_BIT );

	};

	this.clearDepth = function () {

		_gl.clear( _gl.DEPTH_BUFFER_BIT );

	};

	this.clearStencil = function () {

		_gl.clear( _gl.STENCIL_BUFFER_BIT );

	};

	this.clearTarget = function ( renderTarget, color, depth, stencil ) {

		this.setRenderTarget( renderTarget );
		this.clear( color, depth, stencil );

	};

	// Reset

	this.resetGLState = resetGLState;

	// Events

	var onTextureDispose = function ( event ) {

		var texture = event.target;

		texture.removeEventListener( 'dispose', onTextureDispose );

		deallocateTexture( texture );

		_this.info.memory.textures --;


	};

	var onRenderTargetDispose = function ( event ) {

		var renderTarget = event.target;

		renderTarget.removeEventListener( 'dispose', onRenderTargetDispose );

		deallocateRenderTarget( renderTarget );

		_this.info.memory.textures --;

	};

	var onMaterialDispose = function ( event ) {

		var material = event.target;

		material.removeEventListener( 'dispose', onMaterialDispose );

		deallocateMaterial( material );

	};

	// Buffer deallocation

	var deallocateTexture = function ( texture ) {

		if ( texture.image && texture.image.__webglTextureCube ) {

			// cube texture

			_gl.deleteTexture( texture.image.__webglTextureCube );

			delete texture.image.__webglTextureCube;

		} else {

			// 2D texture

			if ( texture.__webglInit === undefined ) return;

			_gl.deleteTexture( texture.__webglTexture );

			delete texture.__webglTexture;
			delete texture.__webglInit;

		}

	};

	var deallocateRenderTarget = function ( renderTarget ) {

		if ( ! renderTarget || renderTarget.__webglTexture === undefined ) return;

		_gl.deleteTexture( renderTarget.__webglTexture );

		delete renderTarget.__webglTexture;

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			for ( var i = 0; i < 6; i ++ ) {

				_gl.deleteFramebuffer( renderTarget.__webglFramebuffer[ i ] );
				_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer[ i ] );

			}

		} else {

			_gl.deleteFramebuffer( renderTarget.__webglFramebuffer );
			_gl.deleteRenderbuffer( renderTarget.__webglRenderbuffer );

		}

		delete renderTarget.__webglFramebuffer;
		delete renderTarget.__webglRenderbuffer;

	};

	var deallocateMaterial = function ( material ) {

		var program = material.program.program;

		if ( program === undefined ) return;

		material.program = undefined;

		// only deallocate GL program if this was the last use of shared program
		// assumed there is only single copy of any program in the _programs list
		// (that's how it's constructed)

		var i, il, programInfo;
		var deleteProgram = false;

		for ( i = 0, il = _programs.length; i < il; i ++ ) {

			programInfo = _programs[ i ];

			if ( programInfo.program === program ) {

				programInfo.usedTimes --;

				if ( programInfo.usedTimes === 0 ) {

					deleteProgram = true;

				}

				break;

			}

		}

		if ( deleteProgram === true ) {

			// avoid using array.splice, this is costlier than creating new array from scratch

			var newPrograms = [];

			for ( i = 0, il = _programs.length; i < il; i ++ ) {

				programInfo = _programs[ i ];

				if ( programInfo.program !== program ) {

					newPrograms.push( programInfo );

				}

			}

			_programs = newPrograms;

			_gl.deleteProgram( program );

			_this.info.memory.programs --;

		}

	};

	// Buffer rendering

	this.renderBufferImmediate = function ( object, program, material ) {

		state.initAttributes();

		if ( object.hasPositions && ! object.__webglVertexBuffer ) object.__webglVertexBuffer = _gl.createBuffer();
		if ( object.hasNormals && ! object.__webglNormalBuffer ) object.__webglNormalBuffer = _gl.createBuffer();
		if ( object.hasUvs && ! object.__webglUvBuffer ) object.__webglUvBuffer = _gl.createBuffer();
		if ( object.hasColors && ! object.__webglColorBuffer ) object.__webglColorBuffer = _gl.createBuffer();

		var attributes = program.getAttributes();

		if ( object.hasPositions ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.position );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormals ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglNormalBuffer );

			if ( material instanceof THREE.MeshPhongMaterial === false && material.shading === THREE.FlatShading ) {

				var nx, ny, nz,
					nax, nbx, ncx, nay, nby, ncy, naz, nbz, ncz,
					normalArray,
					i, il = object.count * 3;

				for ( i = 0; i < il; i += 9 ) {

					normalArray = object.normalArray;

					nax = normalArray[ i ];
					nay = normalArray[ i + 1 ];
					naz = normalArray[ i + 2 ];

					nbx = normalArray[ i + 3 ];
					nby = normalArray[ i + 4 ];
					nbz = normalArray[ i + 5 ];

					ncx = normalArray[ i + 6 ];
					ncy = normalArray[ i + 7 ];
					ncz = normalArray[ i + 8 ];

					nx = ( nax + nbx + ncx ) / 3;
					ny = ( nay + nby + ncy ) / 3;
					nz = ( naz + nbz + ncz ) / 3;

					normalArray[ i     ] = nx;
					normalArray[ i + 1 ] = ny;
					normalArray[ i + 2 ] = nz;

					normalArray[ i + 3 ] = nx;
					normalArray[ i + 4 ] = ny;
					normalArray[ i + 5 ] = nz;

					normalArray[ i + 6 ] = nx;
					normalArray[ i + 7 ] = ny;
					normalArray[ i + 8 ] = nz;

				}

			}

			_gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.normal );

			_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasUvs && material.map ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglUvBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.uv );

			_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasColors && material.vertexColors !== THREE.NoColors ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW );

			state.enableAttribute( attributes.color );

			_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

		}

		state.disableUnusedAttributes();

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	function setupVertexAttributes( material, program, geometry, startIndex ) {

		var extension;

		if ( geometry instanceof THREE.InstancedBufferGeometry ) {

			extension = extensions.get( 'ANGLE_instanced_arrays' );

			if ( extension === null ) {

				console.error( 'THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
				return;

			}

		}

		var geometryAttributes = geometry.attributes;

		var programAttributes = program.getAttributes();

		var materialDefaultAttributeValues = material.defaultAttributeValues;

		for ( var name in programAttributes ) {

			var programAttribute = programAttributes[ name ];

			if ( programAttribute >= 0 ) {

				var geometryAttribute = geometryAttributes[ name ];

				if ( geometryAttribute !== undefined ) {

					var size = geometryAttribute.itemSize;
					state.enableAttribute( programAttribute );

					if ( geometryAttribute instanceof THREE.InterleavedBufferAttribute ) {

						var data = geometryAttribute.data;
						var stride = data.stride;
						var offset = geometryAttribute.offset;

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryAttribute.data.buffer );
						_gl.vertexAttribPointer( programAttribute, size, _gl.FLOAT, false, stride * data.array.BYTES_PER_ELEMENT, ( startIndex * stride + offset ) * data.array.BYTES_PER_ELEMENT );

						if ( data instanceof THREE.InstancedInterleavedBuffer ) {

							if ( extension === null ) {

								console.error( 'THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferAttribute but hardware does not support extension ANGLE_instanced_arrays.' );
								return;

							}

							extension.vertexAttribDivisorANGLE( programAttribute, data.meshPerAttribute );

							if ( geometry.maxInstancedCount === undefined ) {

								geometry.maxInstancedCount = data.meshPerAttribute * ( data.array.length / data.stride );

							}

						}

					} else {

						_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryAttribute.buffer );
						_gl.vertexAttribPointer( programAttribute, size, _gl.FLOAT, false, 0, startIndex * size * 4 ); // 4 bytes per Float32

						if ( geometryAttribute instanceof THREE.InstancedBufferAttribute ) {

							if ( extension === null ) {

								console.error( 'THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferAttribute but hardware does not support extension ANGLE_instanced_arrays.' );
								return;

							}

							extension.vertexAttribDivisorANGLE( programAttribute, geometryAttribute.meshPerAttribute );

							if ( geometry.maxInstancedCount === undefined ) {

								geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * ( geometryAttribute.array.length / geometryAttribute.itemSize );

							}

						}

					}

				} else if ( materialDefaultAttributeValues !== undefined ) {

					var value = materialDefaultAttributeValues[ name ];
					if ( value !== undefined ) {

						switch ( value.length ) {

							case 2:
								_gl.vertexAttrib2fv( programAttribute, value );
								break;

							case 3:
								_gl.vertexAttrib3fv( programAttribute, value );
								break;

							case 4:
								_gl.vertexAttrib4fv( programAttribute, value );
								break;

							default:
								_gl.vertexAttrib1fv( programAttribute, value );

						}

					}

				}

			}

		}

		state.disableUnusedAttributes();

	}

	this.renderBufferDirect = function ( camera, lights, fog, material, object ) {

		if ( material.visible === false ) return;

		var geometry = objects.geometries.get( object );
		var program = setProgram( camera, lights, fog, material, object );

		var updateBuffers = false,
			wireframeBit = material.wireframe ? 1 : 0,
			geometryProgram = geometry.id + '_' + program.id + '_' + wireframeBit;

		if ( geometryProgram !== _currentGeometryProgram ) {

			_currentGeometryProgram = geometryProgram;
			updateBuffers = true;

		}

		if ( updateBuffers ) {

			state.initAttributes();

		}

		if ( object instanceof THREE.Mesh ) {

			renderMesh( material, geometry, object, program, updateBuffers );

		} else if ( object instanceof THREE.Line ) {

			renderLine( material, geometry, object, program, updateBuffers );

		} else if ( object instanceof THREE.PointCloud ) {

			renderPointCloud( material, geometry, object, program, updateBuffers );

		}

	};

	function renderMesh( material, geometry, object, program, updateBuffers ) {

		var mode = material.wireframe === true ? _gl.LINES : _gl.TRIANGLES;

		var index = geometry.attributes.index;

		if ( index ) {

			// indexed triangles

			var type, size;

			if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

				type = _gl.UNSIGNED_INT;
				size = 4;

			} else {

				type = _gl.UNSIGNED_SHORT;
				size = 2;

			}

			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );
					_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

				}

				if ( geometry instanceof THREE.InstancedBufferGeometry && geometry.maxInstancedCount > 0 ) {

					var extension = extensions.get( 'ANGLE_instanced_arrays' );

					if ( extension === null ) {

						console.error( 'THREE.WebGLRenderer.renderMesh: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
						return;

					}

					extension.drawElementsInstancedANGLE( mode, index.array.length, type, 0, geometry.maxInstancedCount ); // Draw the instanced meshes

				} else {

					_gl.drawElements( mode, index.array.length, type, 0 );

				}
				_this.info.render.calls ++;
				_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared
				_this.info.render.faces += index.array.length / 3;

			} else {

				// if there is more than 1 chunk
				// must set attribute pointers to use new offsets for each chunk
				// even if geometry and materials didn't change

				updateBuffers = true;

				for ( var i = 0, il = offsets.length; i < il; i ++ ) {

					var startIndex = offsets[ i ].index;

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, startIndex );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					// render indexed triangles

					if ( geometry instanceof THREE.InstancedBufferGeometry && offsets[i].instances > 0 ) {

						var extension = extensions.get( 'ANGLE_instanced_arrays' );

						if ( extension === null ) {

							console.error( 'THREE.WebGLRenderer.renderMesh: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
							return;

						}

						extension.drawElementsInstancedANGLE( mode, offsets[i].count, type, offsets[i].start * size, offsets[i].count, type, offsets[i].instances ); // Draw the instanced meshes

					} else {

						_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size );

					}

					_this.info.render.calls ++;
					_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared
					_this.info.render.faces += offsets[ i ].count / 3;

				}

			}

		} else {

			// non-indexed triangles

			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				var position = geometry.attributes.position;

				// render non-indexed triangles

				if ( geometry instanceof THREE.InstancedBufferGeometry && geometry.maxInstancedCount > 0 ) {

					var extension = extensions.get( 'ANGLE_instanced_arrays' );

					if ( extension === null ) {

						console.error( 'THREE.WebGLRenderer.renderMesh: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.' );
						return;

					}

					if ( position instanceof THREE.InterleavedBufferAttribute ) {

						extension.drawArraysInstancedANGLE( mode, 0, position.data.array.length / position.data.stride, geometry.maxInstancedCount ); // Draw the instanced meshes

					} else {

						extension.drawArraysInstancedANGLE( mode, 0, position.array.length / position.itemSize, geometry.maxInstancedCount ); // Draw the instanced meshes

					}

				} else {

					if ( position instanceof THREE.InterleavedBufferAttribute ) {

						_gl.drawArrays( mode, 0, position.data.array.length / position.data.stride );

					} else {

						_gl.drawArrays( mode, 0, position.array.length / position.itemSize );

					}

				}

				_this.info.render.calls++;
				_this.info.render.vertices += position.array.length / position.itemSize;
				_this.info.render.faces += position.array.length / ( 3 * position.itemSize );

			} else {

				// if there is more than 1 chunk
				// must set attribute pointers to use new offsets for each chunk
				// even if geometry and materials didn't change

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );

				}

				for ( var i = 0, il = offsets.length; i < il; i++ ) {

					// render non-indexed triangles

					if ( geometry instanceof THREE.InstancedBufferGeometry ) {

						console.error( 'THREE.WebGLRenderer.renderMesh: cannot use drawCalls with THREE.InstancedBufferGeometry.' );
						return;

					} else {

						_gl.drawArrays( mode, offsets[ i ].start, offsets[ i ].count );

					}

					_this.info.render.calls++;
					_this.info.render.vertices += offsets[ i ].count;
					_this.info.render.faces += ( offsets[ i ].count  ) / 3;

				}
			}
		}

	}

	function renderLine( material, geometry, object, program, updateBuffers ) {

		var mode = object instanceof THREE.LineSegments ? _gl.LINES : _gl.LINE_STRIP;

		// In case user is not using Line*Material by mistake
		var lineWidth = material.linewidth !== undefined ? material.linewidth : 1;

		state.setLineWidth( lineWidth * pixelRatio );

		var index = geometry.attributes.index;

		if ( index ) {

			// indexed lines

			var type, size;

			if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

				type = _gl.UNSIGNED_INT;
				size = 4;

			} else {

				type = _gl.UNSIGNED_SHORT;
				size = 2;

			}

			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );
					_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

				}

				_gl.drawElements( mode, index.array.length, type, 0 ); // 2 bytes per Uint16Array

				_this.info.render.calls ++;
				_this.info.render.vertices += index.array.length; // not really true, here vertices can be shared

			} else {

				// if there is more than 1 chunk
				// must set attribute pointers to use new offsets for each chunk
				// even if geometry and materials didn't change

				if ( offsets.length > 1 ) updateBuffers = true;

				for ( var i = 0, il = offsets.length; i < il; i ++ ) {

					var startIndex = offsets[ i ].index;

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, startIndex );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					// render indexed lines

					_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size ); // 2 bytes per Uint16Array

					_this.info.render.calls ++;
					_this.info.render.vertices += offsets[ i ].count; // not really true, here vertices can be shared

				}

			}

		} else {

			// non-indexed lines

			if ( updateBuffers ) {

				setupVertexAttributes( material, program, geometry, 0 );

			}

			var position = geometry.attributes.position;
			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.vertices += position.array.length / 3;

			} else {

				for ( var i = 0, il = offsets.length; i < il; i ++ ) {

					_gl.drawArrays( mode, offsets[ i ].index, offsets[ i ].count );

					_this.info.render.calls ++;
					_this.info.render.vertices += offsets[ i ].count;

				}

			}

		}

	}

	function renderPointCloud( material, geometry, object, program, updateBuffers ) {

		var mode = _gl.POINTS;

		var index = geometry.attributes.index;

		if ( index ) {

			// indexed points

			var type, size;

			if ( index.array instanceof Uint32Array && extensions.get( 'OES_element_index_uint' ) ) {

				type = _gl.UNSIGNED_INT;
				size = 4;

			} else {

				type = _gl.UNSIGNED_SHORT;
				size = 2;

			}

			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				if ( updateBuffers ) {

					setupVertexAttributes( material, program, geometry, 0 );
					_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

				}

				_gl.drawElements( mode, index.array.length, type, 0);

				_this.info.render.calls ++;
				_this.info.render.points += index.array.length;

			} else {

				// if there is more than 1 chunk
				// must set attribute pointers to use new offsets for each chunk
				// even if geometry and materials didn't change

				if ( offsets.length > 1 ) updateBuffers = true;

				for ( var i = 0, il = offsets.length; i < il; i ++ ) {

					var startIndex = offsets[ i ].index;

					if ( updateBuffers ) {

						setupVertexAttributes( material, program, geometry, startIndex );
						_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, index.buffer );

					}

					// render indexed points

					_gl.drawElements( mode, offsets[ i ].count, type, offsets[ i ].start * size );

					_this.info.render.calls ++;
					_this.info.render.points += offsets[ i ].count;

				}

			}

		} else {

			// non-indexed points

			if ( updateBuffers ) {

				setupVertexAttributes( material, program, geometry, 0 );

			}

			var position = geometry.attributes.position;
			var offsets = geometry.offsets;

			if ( offsets.length === 0 ) {

				_gl.drawArrays( mode, 0, position.array.length / 3 );

				_this.info.render.calls ++;
				_this.info.render.points += position.array.length / 3;

			} else {

				for ( var i = 0, il = offsets.length; i < il; i ++ ) {

					_gl.drawArrays( mode, offsets[ i ].index, offsets[ i ].count );

					_this.info.render.calls ++;
					_this.info.render.points += offsets[ i ].count;

				}

			}

		}

	}

	// Sorting

	function painterSortStable ( a, b ) {

		if ( a.object.renderOrder !== b.object.renderOrder ) {

			return a.object.renderOrder - b.object.renderOrder;

		} else if ( a.object.material.id !== b.object.material.id ) {

			return a.object.material.id - b.object.material.id;

		} else if ( a.z !== b.z ) {

			return a.z - b.z;

		} else {

			return a.id - b.id;

		}

	}

	function reversePainterSortStable ( a, b ) {

		if ( a.object.renderOrder !== b.object.renderOrder ) {

			return a.object.renderOrder - b.object.renderOrder;

		} if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return a.id - b.id;

		}

	}

	// Rendering

	var _matrixWorldInverse = new THREE.Matrix4();
	
	this.renderStereo = function ( scene, camera, renderTarget, forceClear, stereoTransforms, stereoViewports, stereoProjections ) {

        if ( camera instanceof THREE.Camera === false ) {

			THREE.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

        updateEverything.call(this, scene, camera, renderTarget, forceClear );
        _matrixWorldInverse.copy(camera.matrixWorldInverse);

        this.enableScissorTest( true );
        for( var i = 0; i < stereoViewports.length; ++i){
            var m = stereoTransforms[i],
            	mInverse = stereoTransforms[1-i];
            var v = stereoViewports[i];
            
            this.setViewport( v.left, v.top, v.width, v.height );
            this.setScissor( v.left, v.top, v.width, v.height );

            camera.matrixWorld.multiply(m);
            camera.matrixWorldInverse.multiplyMatrices( mInverse, _matrixWorldInverse );

			camera.projectionMatrix = stereoProjections[i];
            _projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );
            
            renderEverything.call(this, scene, camera );
            camera.matrixWorld.multiply( mInverse );
        }
        this.enableScissorTest( false );

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		state.setDepthTest( true );
		state.setDepthWrite( true );
		state.setColorWrite( true );

		// _gl.finish();

	};

	this.render = function ( scene, camera, renderTarget, forceClear ) {

        if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

        updateEverything.call(this, scene, camera, renderTarget, forceClear );

        renderEverything.call(this, scene, camera );

		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.generateMipmaps && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		state.setDepthTest( true );
		state.setDepthWrite( true );
		state.setColorWrite( true );

		// _gl.finish();

	};

    function updateEverything( scene, camera, renderTarget, forceClear ){

		// reset caching for this frame

		_currentGeometryProgram = '';
		_currentMaterialId = - 1;
		_currentCamera = null;
		_lightsNeedUpdate = true;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices and frustum

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
		_frustum.setFromMatrix( _projScreenMatrix );

		lights.length = 0;
		opaqueObjects.length = 0;
		transparentObjects.length = 0;

		sprites.length = 0;
		lensFlares.length = 0;

		projectObject( scene );

		if ( _this.sortObjects === true ) {

			opaqueObjects.sort( painterSortStable );
			transparentObjects.sort( reversePainterSortStable );

		}

		objects.update( opaqueObjects );
		objects.update( transparentObjects );

		//

		shadowMap.render( scene, camera );

		//

		_this.info.render.calls = 0;
		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;
		_this.info.render.points = 0;

		this.setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear( this.autoClearColor, this.autoClearDepth, this.autoClearStencil );

		}

		// set matrices for immediate objects

		for ( var i = 0, il = objects.objectsImmediate.length; i < il; i ++ ) {

			var webglObject = objects.objectsImmediate[ i ];
			var object = webglObject.object;

			if ( object.visible === true ) {

				setupMatrices( object, camera );

				var material = object.material;

				if ( material.transparent ) {

					webglObject.transparent = material;
					webglObject.opaque = null;

				} else {

					webglObject.opaque = material;
					webglObject.transparent = null;

				}

			}

		}
    }

    function renderEverything( scene, camera ){

        var fog = scene.fog;

		if ( scene.overrideMaterial ) {

			var overrideMaterial = scene.overrideMaterial;

			setMaterial( overrideMaterial );

			renderObjects( opaqueObjects, camera, lights, fog, overrideMaterial );
			renderObjects( transparentObjects, camera, lights, fog, overrideMaterial );
			renderObjectsImmediate( objects.objectsImmediate, '', camera, lights, fog, overrideMaterial );

		} else {

			// opaque pass (front-to-back order)

			state.setBlending( THREE.NoBlending );

			renderObjects( opaqueObjects, camera, lights, fog, null );
			renderObjectsImmediate( objects.objectsImmediate, 'opaque', camera, lights, fog, null );

			// transparent pass (back-to-front order)

			renderObjects( transparentObjects, camera, lights, fog, null );
			renderObjectsImmediate( objects.objectsImmediate, 'transparent', camera, lights, fog, null );

		}

		// custom render plugins (post pass)

		spritePlugin.render( scene, camera );
		lensFlarePlugin.render( scene, camera, _currentWidth, _currentHeight );
    }


	function projectObject( object ) {

		if ( object.visible === true ) {

			if ( object instanceof THREE.Scene || object instanceof THREE.Group ) {

				// skip

			} else {

				// update Skeleton objects
				if ( object instanceof THREE.SkinnedMesh ) {

					object.skeleton.update();

				}

				objects.init( object );

				if ( object instanceof THREE.Light ) {

					lights.push( object );

				} else if ( object instanceof THREE.Sprite ) {

					sprites.push( object );

				} else if ( object instanceof THREE.LensFlare ) {

					lensFlares.push( object );

				} else {

					var webglObject = objects.objects[ object.id ];

					if ( webglObject && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

						var material = object.material;

						if ( material.transparent ) {

							transparentObjects.push( webglObject );

						} else {

							opaqueObjects.push( webglObject );

						}

						if ( _this.sortObjects === true ) {

							_vector3.setFromMatrixPosition( object.matrixWorld );
							_vector3.applyProjection( _projScreenMatrix );

							webglObject.z = _vector3.z;

						}

					}

				}

			}

			for ( var i = 0, l = object.children.length; i < l; i ++ ) {

				projectObject( object.children[ i ] );

			}

		}

	}

	function renderObjects( renderList, camera, lights, fog, overrideMaterial ) {

		var material;

		for ( var i = 0, l = renderList.length; i < l; i ++ ) {

			var webglObject = renderList[ i ];

			var object = webglObject.object;

			setupMatrices( object, camera );

			if ( overrideMaterial ) {

				material = overrideMaterial;

			} else {

				material = object.material;

				if ( ! material ) continue;

				setMaterial( material );

			}

			_this.setMaterialFaces( material );
			_this.renderBufferDirect( camera, lights, fog, material, object );

		}

	}

	function renderObjectsImmediate ( renderList, materialType, camera, lights, fog, overrideMaterial ) {

		var material;

		for ( var i = 0, l = renderList.length; i < l; i ++ ) {

			var webglObject = renderList[ i ];
			var object = webglObject.object;

			if ( object.visible === true ) {

				if ( overrideMaterial ) {

					material = overrideMaterial;

				} else {

					material = webglObject[ materialType ];

					if ( ! material ) continue;

					setMaterial( material );

				}

				_this.renderImmediateObject( camera, lights, fog, material, object );

			}

		}

	}

	this.renderImmediateObject = function ( camera, lights, fog, material, object ) {

		var program = setProgram( camera, lights, fog, material, object );

		_currentGeometryProgram = '';

		_this.setMaterialFaces( material );

		if ( object.immediateRenderCallback ) {

			object.immediateRenderCallback( program, _gl, _frustum );

		} else {

			object.render( function ( object ) { _this.renderBufferImmediate( object, program, material ); } );

		}

	};

	// Materials

	var shaderIDs = {
		MeshDepthMaterial: 'depth',
		MeshNormalMaterial: 'normal',
		MeshBasicMaterial: 'basic',
		MeshLambertMaterial: 'lambert',
		MeshPhongMaterial: 'phong',
		LineBasicMaterial: 'basic',
		LineDashedMaterial: 'dashed',
		PointCloudMaterial: 'particle_basic'
	};

	function initMaterial( material, lights, fog, object ) {

		var shaderID = shaderIDs[ material.type ];

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		var maxLightCount = allocateLights( lights );
		var maxShadows = allocateShadows( lights );
		var maxBones = allocateBones( object );

		var parameters = {

			precision: _precision,
			supportsVertexTextures: _supportsVertexTextures,

			map: !! material.map,
			envMap: !! material.envMap,
			envMapMode: material.envMap && material.envMap.mapping,
			lightMap: !! material.lightMap,
			aoMap: !! material.aoMap,
			bumpMap: !! material.bumpMap,
			normalMap: !! material.normalMap,
			specularMap: !! material.specularMap,
			alphaMap: !! material.alphaMap,

			combine: material.combine,

			vertexColors: material.vertexColors,

			fog: fog,
			useFog: material.fog,
			fogExp: fog instanceof THREE.FogExp2,

			flatShading: material.shading === THREE.FlatShading,

			sizeAttenuation: material.sizeAttenuation,
			logarithmicDepthBuffer: _logarithmicDepthBuffer,

			skinning: material.skinning,
			maxBones: maxBones,
			useVertexTexture: _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture,

			morphTargets: material.morphTargets,
			morphNormals: material.morphNormals,
			maxMorphTargets: _this.maxMorphTargets,
			maxMorphNormals: _this.maxMorphNormals,

			maxDirLights: maxLightCount.directional,
			maxPointLights: maxLightCount.point,
			maxSpotLights: maxLightCount.spot,
			maxHemiLights: maxLightCount.hemi,

			maxShadows: maxShadows,
			shadowMapEnabled: shadowMap.enabled && object.receiveShadow && maxShadows > 0,
			shadowMapType: shadowMap.type,
			shadowMapDebug: shadowMap.debug,
			shadowMapCascade: shadowMap.cascade,

			alphaTest: material.alphaTest,
			metal: material.metal,
			doubleSided: material.side === THREE.DoubleSide,
			flipSided: material.side === THREE.BackSide

		};

		// Generate code

		var chunks = [];

		if ( shaderID ) {

			chunks.push( shaderID );

		} else {

			chunks.push( material.fragmentShader );
			chunks.push( material.vertexShader );

		}

		if ( material.defines !== undefined ) {

			for ( var name in material.defines ) {

				chunks.push( name );
				chunks.push( material.defines[ name ] );

			}

		}

		for ( var name in parameters ) {

			chunks.push( name );
			chunks.push( parameters[ name ] );

		}

		var code = chunks.join();

		if ( !material.program ) {

			// new material
			material.addEventListener( 'dispose', onMaterialDispose );

		} else if ( material.program.code !== code ) {

			// changed glsl or parameters
			deallocateMaterial( material );

		} else if ( shaderID !== undefined ) {

			// same glsl
			return;

		} else if ( material.__webglShader.uniforms === material.uniforms ) {

			// same uniforms (container object)
			return;

		}

		if ( shaderID ) {

			var shader = THREE.ShaderLib[ shaderID ];

			material.__webglShader = {
				uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
				vertexShader: shader.vertexShader,
				fragmentShader: shader.fragmentShader
			};

		} else {

			material.__webglShader = {
				uniforms: material.uniforms,
				vertexShader: material.vertexShader,
				fragmentShader: material.fragmentShader
			};

		}

		var program;

		// Check if code has been already compiled

		for ( var p = 0, pl = _programs.length; p < pl; p ++ ) {

			var programInfo = _programs[ p ];

			if ( programInfo.code === code ) {

				program = programInfo;
				program.usedTimes ++;

				break;

			}

		}

		if ( program === undefined ) {

			program = new THREE.WebGLProgram( _this, code, material, parameters );
			_programs.push( program );

			_this.info.memory.programs = _programs.length;

		}

		material.program = program;

		var attributes = program.getAttributes();

		if ( material.morphTargets ) {

			material.numSupportedMorphTargets = 0;

			for ( var i = 0; i < _this.maxMorphTargets; i ++ ) {

				if ( attributes[ 'morphTarget' + i ] >= 0 ) {

					material.numSupportedMorphTargets ++;

				}

			}

		}

		if ( material.morphNormals ) {

			material.numSupportedMorphNormals = 0;

			for ( i = 0; i < _this.maxMorphNormals; i ++ ) {

				if ( attributes[ 'morphNormal' + i ] >= 0 ) {

					material.numSupportedMorphNormals ++;

				}

			}

		}

		material.uniformsList = [];

		var uniformLocations = material.program.getUniforms();
		for ( var u in material.__webglShader.uniforms ) {

			var location = uniformLocations[ u ];

			if ( location ) {
				material.uniformsList.push( [ material.__webglShader.uniforms[ u ], location ] );
			}

		}

	}

	function setMaterial( material ) {

		if ( material.transparent === true ) {

			state.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha );

		} else {

			state.setBlending( THREE.NoBlending );

		}

		state.setDepthFunc( material.depthFunc );
		state.setDepthTest( material.depthTest );
		state.setDepthWrite( material.depthWrite );
		state.setColorWrite( material.colorWrite );
		state.setPolygonOffset( material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits );

	}

	function setProgram( camera, lights, fog, material, object ) {

		_usedTextureUnits = 0;

		if ( material.needsUpdate ) {

			initMaterial( material, lights, fog, object );
			material.needsUpdate = false;

		}

		var refreshProgram = false;
		var refreshMaterial = false;
		var refreshLights = false;

		var program = material.program,
			p_uniforms = program.getUniforms(),
			m_uniforms = material.__webglShader.uniforms;

		if ( program.id !== _currentProgram ) {

			_gl.useProgram( program.program );
			_currentProgram = program.id;

			refreshProgram = true;
			refreshMaterial = true;
			refreshLights = true;

		}

		if ( material.id !== _currentMaterialId ) {

			if ( _currentMaterialId === -1 ) refreshLights = true;
			_currentMaterialId = material.id;

			refreshMaterial = true;

		}

		if ( refreshProgram || camera !== _currentCamera ) {

			_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

			if ( _logarithmicDepthBuffer ) {

				_gl.uniform1f( p_uniforms.logDepthBufFC, 2.0 / ( Math.log( camera.far + 1.0 ) / Math.LN2 ) );

			}


			if ( camera !== _currentCamera ) _currentCamera = camera;

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if ( material instanceof THREE.ShaderMaterial ||
				 material instanceof THREE.MeshPhongMaterial ||
				 material.envMap ) {

				if ( p_uniforms.cameraPosition !== null ) {

					_vector3.setFromMatrixPosition( camera.matrixWorld );
					_gl.uniform3f( p_uniforms.cameraPosition, _vector3.x, _vector3.y, _vector3.z );

				}

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.ShaderMaterial ||
				 material.skinning ) {

				if ( p_uniforms.viewMatrix !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, camera.matrixWorldInverse.elements );

				}

			}

		}

		// skinning uniforms must be set even if material didn't change
		// auto-setting of texture unit for bone texture must go before other textures
		// not sure why, but otherwise weird things happen

		if ( material.skinning ) {

			if ( object.bindMatrix && p_uniforms.bindMatrix !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrix, false, object.bindMatrix.elements );

			}

			if ( object.bindMatrixInverse && p_uniforms.bindMatrixInverse !== null ) {

				_gl.uniformMatrix4fv( p_uniforms.bindMatrixInverse, false, object.bindMatrixInverse.elements );

			}

			if ( _supportsBoneTextures && object.skeleton && object.skeleton.useVertexTexture ) {

				if ( p_uniforms.boneTexture !== null ) {

					var textureUnit = getTextureUnit();

					_gl.uniform1i( p_uniforms.boneTexture, textureUnit );
					_this.setTexture( object.skeleton.boneTexture, textureUnit );

				}

				if ( p_uniforms.boneTextureWidth !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureWidth, object.skeleton.boneTextureWidth );

				}

				if ( p_uniforms.boneTextureHeight !== null ) {

					_gl.uniform1i( p_uniforms.boneTextureHeight, object.skeleton.boneTextureHeight );

				}

			} else if ( object.skeleton && object.skeleton.boneMatrices ) {

				if ( p_uniforms.boneGlobalMatrices !== null ) {

					_gl.uniformMatrix4fv( p_uniforms.boneGlobalMatrices, false, object.skeleton.boneMatrices );

				}

			}

		}

		if ( refreshMaterial ) {

			// refresh uniforms common to several materials

			if ( fog && material.fog ) {

				refreshUniformsFog( m_uniforms, fog );

			}

			if ( material instanceof THREE.MeshPhongMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material.lights ) {

				if ( _lightsNeedUpdate ) {

					refreshLights = true;
					setupLights( lights );
					_lightsNeedUpdate = false;
				}

				if ( refreshLights ) {
					refreshUniformsLights( m_uniforms, _lights );
					markUniformsLightsNeedsUpdate( m_uniforms, true );
				} else {
					markUniformsLightsNeedsUpdate( m_uniforms, false );
				}

			}

			if ( material instanceof THREE.MeshBasicMaterial ||
				 material instanceof THREE.MeshLambertMaterial ||
				 material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsCommon( m_uniforms, material );

			}

			// refresh single material specific uniforms

			if ( material instanceof THREE.LineBasicMaterial ) {

				refreshUniformsLine( m_uniforms, material );

			} else if ( material instanceof THREE.LineDashedMaterial ) {

				refreshUniformsLine( m_uniforms, material );
				refreshUniformsDash( m_uniforms, material );

			} else if ( material instanceof THREE.PointCloudMaterial ) {

				refreshUniformsParticle( m_uniforms, material );

			} else if ( material instanceof THREE.MeshPhongMaterial ) {

				refreshUniformsPhong( m_uniforms, material );

			} else if ( material instanceof THREE.MeshLambertMaterial ) {

				refreshUniformsLambert( m_uniforms, material );

			} else if ( material instanceof THREE.MeshBasicMaterial ) {

				refreshUniformsBasic( m_uniforms, material );

			} else if ( material instanceof THREE.MeshDepthMaterial ) {

				m_uniforms.mNear.value = camera.near;
				m_uniforms.mFar.value = camera.far;
				m_uniforms.opacity.value = material.opacity;

			} else if ( material instanceof THREE.MeshNormalMaterial ) {

				m_uniforms.opacity.value = material.opacity;

			}

			if ( object.receiveShadow && ! material._shadowPass ) {

				refreshUniformsShadow( m_uniforms, lights );

			}

			// load common uniforms

			loadUniformsGeneric( material.uniformsList );

		}

		loadUniformsMatrices( p_uniforms, object );

		if ( p_uniforms.modelMatrix !== null ) {

			_gl.uniformMatrix4fv( p_uniforms.modelMatrix, false, object.matrixWorld.elements );

		}

		return program;

	}

	// Uniforms (refresh uniforms objects)

	function refreshUniformsCommon ( uniforms, material ) {

		uniforms.opacity.value = material.opacity;

		uniforms.diffuse.value = material.color;

		uniforms.map.value = material.map;
		uniforms.specularMap.value = material.specularMap;
		uniforms.alphaMap.value = material.alphaMap;

		if ( material.bumpMap ) {

			uniforms.bumpMap.value = material.bumpMap;
			uniforms.bumpScale.value = material.bumpScale;

		}

		if ( material.normalMap ) {

			uniforms.normalMap.value = material.normalMap;
			uniforms.normalScale.value.copy( material.normalScale );

		}

		// uv repeat and offset setting priorities
		// 1. color map
		// 2. specular map
		// 3. normal map
		// 4. bump map
		// 5. alpha map

		var uvScaleMap;

		if ( material.map ) {

			uvScaleMap = material.map;

		} else if ( material.specularMap ) {

			uvScaleMap = material.specularMap;

		} else if ( material.normalMap ) {

			uvScaleMap = material.normalMap;

		} else if ( material.bumpMap ) {

			uvScaleMap = material.bumpMap;

		} else if ( material.alphaMap ) {

			uvScaleMap = material.alphaMap;

		}

		if ( uvScaleMap !== undefined ) {

			var offset = uvScaleMap.offset;
			var repeat = uvScaleMap.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

		uniforms.envMap.value = material.envMap;
		uniforms.flipEnvMap.value = ( material.envMap instanceof THREE.WebGLRenderTargetCube ) ? 1 : - 1;

		uniforms.reflectivity.value = material.reflectivity;
		uniforms.refractionRatio.value = material.refractionRatio;

	}

	function refreshUniformsLine ( uniforms, material ) {

		uniforms.diffuse.value = material.color;
		uniforms.opacity.value = material.opacity;

	}

	function refreshUniformsDash ( uniforms, material ) {

		uniforms.dashSize.value = material.dashSize;
		uniforms.totalSize.value = material.dashSize + material.gapSize;
		uniforms.scale.value = material.scale;

	}

	function refreshUniformsParticle ( uniforms, material ) {

		uniforms.psColor.value = material.color;
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size;
		uniforms.scale.value = _canvas.height / 2.0; // TODO: Cache this.

		uniforms.map.value = material.map;

		if ( material.map !== null ) {

			var offset = material.map.offset;
			var repeat = material.map.repeat;

			uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

		}

	}

	function refreshUniformsFog ( uniforms, fog ) {

		uniforms.fogColor.value = fog.color;

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	}

	function refreshUniformsPhong ( uniforms, material ) {

		uniforms.shininess.value = material.shininess;

		uniforms.emissive.value = material.emissive;
		uniforms.specular.value = material.specular;

		uniforms.lightMap.value = material.lightMap;
		uniforms.lightMapIntensity.value = material.lightMapIntensity;

		uniforms.aoMap.value = material.aoMap;
		uniforms.aoMapIntensity.value = material.aoMapIntensity;

	}

	function refreshUniformsLambert ( uniforms, material ) {

		uniforms.emissive.value = material.emissive;

	}

	function refreshUniformsBasic ( uniforms, material ) {

		uniforms.aoMap.value = material.aoMap;
		uniforms.aoMapIntensity.value = material.aoMapIntensity;

	}

	function refreshUniformsLights ( uniforms, lights ) {

		uniforms.ambientLightColor.value = lights.ambient;

		uniforms.directionalLightColor.value = lights.directional.colors;
		uniforms.directionalLightDirection.value = lights.directional.positions;

		uniforms.pointLightColor.value = lights.point.colors;
		uniforms.pointLightPosition.value = lights.point.positions;
		uniforms.pointLightDistance.value = lights.point.distances;
		uniforms.pointLightDecay.value = lights.point.decays;

		uniforms.spotLightColor.value = lights.spot.colors;
		uniforms.spotLightPosition.value = lights.spot.positions;
		uniforms.spotLightDistance.value = lights.spot.distances;
		uniforms.spotLightDirection.value = lights.spot.directions;
		uniforms.spotLightAngleCos.value = lights.spot.anglesCos;
		uniforms.spotLightExponent.value = lights.spot.exponents;
		uniforms.spotLightDecay.value = lights.spot.decays;

		uniforms.hemisphereLightSkyColor.value = lights.hemi.skyColors;
		uniforms.hemisphereLightGroundColor.value = lights.hemi.groundColors;
		uniforms.hemisphereLightDirection.value = lights.hemi.positions;

	}

	// If uniforms are marked as clean, they don't need to be loaded to the GPU.

	function markUniformsLightsNeedsUpdate ( uniforms, value ) {

		uniforms.ambientLightColor.needsUpdate = value;

		uniforms.directionalLightColor.needsUpdate = value;
		uniforms.directionalLightDirection.needsUpdate = value;

		uniforms.pointLightColor.needsUpdate = value;
		uniforms.pointLightPosition.needsUpdate = value;
		uniforms.pointLightDistance.needsUpdate = value;
		uniforms.pointLightDecay.needsUpdate = value;

		uniforms.spotLightColor.needsUpdate = value;
		uniforms.spotLightPosition.needsUpdate = value;
		uniforms.spotLightDistance.needsUpdate = value;
		uniforms.spotLightDirection.needsUpdate = value;
		uniforms.spotLightAngleCos.needsUpdate = value;
		uniforms.spotLightExponent.needsUpdate = value;
		uniforms.spotLightDecay.needsUpdate = value;

		uniforms.hemisphereLightSkyColor.needsUpdate = value;
		uniforms.hemisphereLightGroundColor.needsUpdate = value;
		uniforms.hemisphereLightDirection.needsUpdate = value;

	}

	function refreshUniformsShadow ( uniforms, lights ) {

		if ( uniforms.shadowMatrix ) {

			var j = 0;

			for ( var i = 0, il = lights.length; i < il; i ++ ) {

				var light = lights[ i ];

				if ( ! light.castShadow ) continue;

				if ( light instanceof THREE.SpotLight || ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) ) {

					uniforms.shadowMap.value[ j ] = light.shadowMap;
					uniforms.shadowMapSize.value[ j ] = light.shadowMapSize;

					uniforms.shadowMatrix.value[ j ] = light.shadowMatrix;

					uniforms.shadowDarkness.value[ j ] = light.shadowDarkness;
					uniforms.shadowBias.value[ j ] = light.shadowBias;

					j ++;

				}

			}

		}

	}

	// Uniforms (load to GPU)

	function loadUniformsMatrices ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrix.elements );

		if ( uniforms.normalMatrix ) {

			_gl.uniformMatrix3fv( uniforms.normalMatrix, false, object._normalMatrix.elements );

		}

	}

	function getTextureUnit() {

		var textureUnit = _usedTextureUnits;

		if ( textureUnit >= _maxTextures ) {

			console.warn( 'WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + _maxTextures );

		}

		_usedTextureUnits += 1;

		return textureUnit;

	}

	function loadUniformsGeneric ( uniforms ) {

		var texture, textureUnit, offset;

		for ( var j = 0, jl = uniforms.length; j < jl; j ++ ) {

			var uniform = uniforms[ j ][ 0 ];

			// needsUpdate property is not added to all uniforms.
			if ( uniform.needsUpdate === false ) continue;

			var type = uniform.type;
			var value = uniform.value;
			var location = uniforms[ j ][ 1 ];

			switch ( type ) {

				case '1i':
					_gl.uniform1i( location, value );
					break;

				case '1f':
					_gl.uniform1f( location, value );
					break;

				case '2f':
					_gl.uniform2f( location, value[ 0 ], value[ 1 ] );
					break;

				case '3f':
					_gl.uniform3f( location, value[ 0 ], value[ 1 ], value[ 2 ] );
					break;

				case '4f':
					_gl.uniform4f( location, value[ 0 ], value[ 1 ], value[ 2 ], value[ 3 ] );
					break;

				case '1iv':
					_gl.uniform1iv( location, value );
					break;

				case '3iv':
					_gl.uniform3iv( location, value );
					break;

				case '1fv':
					_gl.uniform1fv( location, value );
					break;

				case '2fv':
					_gl.uniform2fv( location, value );
					break;

				case '3fv':
					_gl.uniform3fv( location, value );
					break;

				case '4fv':
					_gl.uniform4fv( location, value );
					break;

				case 'Matrix3fv':
					_gl.uniformMatrix3fv( location, false, value );
					break;

				case 'Matrix4fv':
					_gl.uniformMatrix4fv( location, false, value );
					break;

				//

				case 'i':

					// single integer
					_gl.uniform1i( location, value );

					break;

				case 'f':

					// single float
					_gl.uniform1f( location, value );

					break;

				case 'v2':

					// single THREE.Vector2
					_gl.uniform2f( location, value.x, value.y );

					break;

				case 'v3':

					// single THREE.Vector3
					_gl.uniform3f( location, value.x, value.y, value.z );

					break;

				case 'v4':

					// single THREE.Vector4
					_gl.uniform4f( location, value.x, value.y, value.z, value.w );

					break;

				case 'c':

					// single THREE.Color
					_gl.uniform3f( location, value.r, value.g, value.b );

					break;

				case 'iv1':

					// flat array of integers (JS or typed array)
					_gl.uniform1iv( location, value );

					break;

				case 'iv':

					// flat array of integers with 3 x N size (JS or typed array)
					_gl.uniform3iv( location, value );

					break;

				case 'fv1':

					// flat array of floats (JS or typed array)
					_gl.uniform1fv( location, value );

					break;

				case 'fv':

					// flat array of floats with 3 x N size (JS or typed array)
					_gl.uniform3fv( location, value );

					break;

				case 'v2v':

					// array of THREE.Vector2

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 2 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 2;

						uniform._array[ offset + 0 ] = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;

					}

					_gl.uniform2fv( location, uniform._array );

					break;

				case 'v3v':

					// array of THREE.Vector3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 3 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 3;

						uniform._array[ offset + 0 ] = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;

					}

					_gl.uniform3fv( location, uniform._array );

					break;

				case 'v4v':

					// array of THREE.Vector4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 4 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						offset = i * 4;

						uniform._array[ offset + 0 ] = value[ i ].x;
						uniform._array[ offset + 1 ] = value[ i ].y;
						uniform._array[ offset + 2 ] = value[ i ].z;
						uniform._array[ offset + 3 ] = value[ i ].w;

					}

					_gl.uniform4fv( location, uniform._array );

					break;

				case 'm3':

					// single THREE.Matrix3
					_gl.uniformMatrix3fv( location, false, value.elements );

					break;

				case 'm3v':

					// array of THREE.Matrix3

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 9 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 9 );

					}

					_gl.uniformMatrix3fv( location, false, uniform._array );

					break;

				case 'm4':

					// single THREE.Matrix4
					_gl.uniformMatrix4fv( location, false, value.elements );

					break;

				case 'm4v':

					// array of THREE.Matrix4

					if ( uniform._array === undefined ) {

						uniform._array = new Float32Array( 16 * value.length );

					}

					for ( var i = 0, il = value.length; i < il; i ++ ) {

						value[ i ].flattenToArrayOffset( uniform._array, i * 16 );

					}

					_gl.uniformMatrix4fv( location, false, uniform._array );

					break;

				case 't':

					// single THREE.Texture (2d or cube)

					texture = value;
					textureUnit = getTextureUnit();

					_gl.uniform1i( location, textureUnit );

					if ( ! texture ) continue;

					if ( texture instanceof THREE.CubeTexture ||
						 ( Array.isArray( texture.image ) && texture.image.length === 6 ) ) { // CompressedTexture can have Array in image :/

						setCubeTexture( texture, textureUnit );

					} else if ( texture instanceof THREE.WebGLRenderTargetCube ) {

						setCubeTextureDynamic( texture, textureUnit );

					} else {

						_this.setTexture( texture, textureUnit );

					}

					break;

				case 'tv':

					// array of THREE.Texture (2d)

					if ( uniform._array === undefined ) {

						uniform._array = [];

					}

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						uniform._array[ i ] = getTextureUnit();

					}

					_gl.uniform1iv( location, uniform._array );

					for ( var i = 0, il = uniform.value.length; i < il; i ++ ) {

						texture = uniform.value[ i ];
						textureUnit = uniform._array[ i ];

						if ( ! texture ) continue;

						_this.setTexture( texture, textureUnit );

					}

					break;

				default:

					console.warn( 'THREE.WebGLRenderer: Unknown uniform type: ' + type );

			}

		}

	}

	function setupMatrices ( object, camera ) {

		object._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );
		object._normalMatrix.getNormalMatrix( object._modelViewMatrix );

	}

	function setColorLinear( array, offset, color, intensity ) {

		array[ offset + 0 ] = color.r * intensity;
		array[ offset + 1 ] = color.g * intensity;
		array[ offset + 2 ] = color.b * intensity;

	}

	function setupLights ( lights ) {

		var l, ll, light,
		r = 0, g = 0, b = 0,
		color, skyColor, groundColor,
		intensity,
		distance,

		zlights = _lights,

		dirColors = zlights.directional.colors,
		dirPositions = zlights.directional.positions,

		pointColors = zlights.point.colors,
		pointPositions = zlights.point.positions,
		pointDistances = zlights.point.distances,
		pointDecays = zlights.point.decays,

		spotColors = zlights.spot.colors,
		spotPositions = zlights.spot.positions,
		spotDistances = zlights.spot.distances,
		spotDirections = zlights.spot.directions,
		spotAnglesCos = zlights.spot.anglesCos,
		spotExponents = zlights.spot.exponents,
		spotDecays = zlights.spot.decays,

		hemiSkyColors = zlights.hemi.skyColors,
		hemiGroundColors = zlights.hemi.groundColors,
		hemiPositions = zlights.hemi.positions,

		dirLength = 0,
		pointLength = 0,
		spotLength = 0,
		hemiLength = 0,

		dirCount = 0,
		pointCount = 0,
		spotCount = 0,
		hemiCount = 0,

		dirOffset = 0,
		pointOffset = 0,
		spotOffset = 0,
		hemiOffset = 0;

		for ( l = 0, ll = lights.length; l < ll; l ++ ) {

			light = lights[ l ];

			if ( light.onlyShadow ) continue;

			color = light.color;
			intensity = light.intensity;
			distance = light.distance;

			if ( light instanceof THREE.AmbientLight ) {

				if ( ! light.visible ) continue;

				r += color.r;
				g += color.g;
				b += color.b;

			} else if ( light instanceof THREE.DirectionalLight ) {

				dirCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				dirOffset = dirLength * 3;

				dirPositions[ dirOffset + 0 ] = _direction.x;
				dirPositions[ dirOffset + 1 ] = _direction.y;
				dirPositions[ dirOffset + 2 ] = _direction.z;

				setColorLinear( dirColors, dirOffset, color, intensity );

				dirLength += 1;

			} else if ( light instanceof THREE.PointLight ) {

				pointCount += 1;

				if ( ! light.visible ) continue;

				pointOffset = pointLength * 3;

				setColorLinear( pointColors, pointOffset, color, intensity );

				_vector3.setFromMatrixPosition( light.matrixWorld );

				pointPositions[ pointOffset + 0 ] = _vector3.x;
				pointPositions[ pointOffset + 1 ] = _vector3.y;
				pointPositions[ pointOffset + 2 ] = _vector3.z;

				// distance is 0 if decay is 0, because there is no attenuation at all.
				pointDistances[ pointLength ] = distance;
				pointDecays[ pointLength ] = ( light.distance === 0 ) ? 0.0 : light.decay;

				pointLength += 1;

			} else if ( light instanceof THREE.SpotLight ) {

				spotCount += 1;

				if ( ! light.visible ) continue;

				spotOffset = spotLength * 3;

				setColorLinear( spotColors, spotOffset, color, intensity );

				_direction.setFromMatrixPosition( light.matrixWorld );

				spotPositions[ spotOffset + 0 ] = _direction.x;
				spotPositions[ spotOffset + 1 ] = _direction.y;
				spotPositions[ spotOffset + 2 ] = _direction.z;

				spotDistances[ spotLength ] = distance;

				_vector3.setFromMatrixPosition( light.target.matrixWorld );
				_direction.sub( _vector3 );
				_direction.normalize();

				spotDirections[ spotOffset + 0 ] = _direction.x;
				spotDirections[ spotOffset + 1 ] = _direction.y;
				spotDirections[ spotOffset + 2 ] = _direction.z;

				spotAnglesCos[ spotLength ] = Math.cos( light.angle );
				spotExponents[ spotLength ] = light.exponent;
				spotDecays[ spotLength ] = ( light.distance === 0 ) ? 0.0 : light.decay;

				spotLength += 1;

			} else if ( light instanceof THREE.HemisphereLight ) {

				hemiCount += 1;

				if ( ! light.visible ) continue;

				_direction.setFromMatrixPosition( light.matrixWorld );
				_direction.normalize();

				hemiOffset = hemiLength * 3;

				hemiPositions[ hemiOffset + 0 ] = _direction.x;
				hemiPositions[ hemiOffset + 1 ] = _direction.y;
				hemiPositions[ hemiOffset + 2 ] = _direction.z;

				skyColor = light.color;
				groundColor = light.groundColor;

				setColorLinear( hemiSkyColors, hemiOffset, skyColor, intensity );
				setColorLinear( hemiGroundColors, hemiOffset, groundColor, intensity );

				hemiLength += 1;

			}

		}

		// null eventual remains from removed lights
		// (this is to avoid if in shader)

		for ( l = dirLength * 3, ll = Math.max( dirColors.length, dirCount * 3 ); l < ll; l ++ ) dirColors[ l ] = 0.0;
		for ( l = pointLength * 3, ll = Math.max( pointColors.length, pointCount * 3 ); l < ll; l ++ ) pointColors[ l ] = 0.0;
		for ( l = spotLength * 3, ll = Math.max( spotColors.length, spotCount * 3 ); l < ll; l ++ ) spotColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiSkyColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiSkyColors[ l ] = 0.0;
		for ( l = hemiLength * 3, ll = Math.max( hemiGroundColors.length, hemiCount * 3 ); l < ll; l ++ ) hemiGroundColors[ l ] = 0.0;

		zlights.directional.length = dirLength;
		zlights.point.length = pointLength;
		zlights.spot.length = spotLength;
		zlights.hemi.length = hemiLength;

		zlights.ambient[ 0 ] = r;
		zlights.ambient[ 1 ] = g;
		zlights.ambient[ 2 ] = b;

	}

	// GL state setting

	this.setFaceCulling = function ( cullFace, frontFaceDirection ) {

		if ( cullFace === THREE.CullFaceNone ) {

			_gl.disable( _gl.CULL_FACE );

		} else {

			if ( frontFaceDirection === THREE.FrontFaceDirectionCW ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			if ( cullFace === THREE.CullFaceBack ) {

				_gl.cullFace( _gl.BACK );

			} else if ( cullFace === THREE.CullFaceFront ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		}

	};

	this.setMaterialFaces = function ( material ) {

		state.setDoubleSided( material.side === THREE.DoubleSide );
		state.setFlipSided( material.side === THREE.BackSide );

	};

	// Textures

	function setTextureParameters ( textureType, texture, isImagePowerOfTwo ) {

		var extension;

		if ( isImagePowerOfTwo ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			if ( texture.wrapS !== THREE.ClampToEdgeWrapping || texture.wrapT !== THREE.ClampToEdgeWrapping ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping. ( ' + texture.sourceFile + ' )' );

			}

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

			if ( texture.minFilter !== THREE.NearestFilter && texture.minFilter !== THREE.LinearFilter ) {

				console.warn( 'THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter. ( ' + texture.sourceFile + ' )' );

			}

		}

		extension = extensions.get( 'EXT_texture_filter_anisotropic' );

		if ( extension && texture.type !== THREE.FloatType && texture.type !== THREE.HalfFloatType ) {

			if ( texture.anisotropy > 1 || texture.__currentAnisotropy ) {

				_gl.texParameterf( textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min( texture.anisotropy, _this.getMaxAnisotropy() ) );
				texture.__currentAnisotropy = texture.anisotropy;

			}

		}

	}

	this.uploadTexture = function ( texture, slot ) {

		if ( texture.__webglInit === undefined ) {

			texture.__webglInit = true;

			texture.addEventListener( 'dispose', onTextureDispose );

			texture.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
		_gl.pixelStorei( _gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, texture.unpackAlignment );

		texture.image = clampToMaxSize( texture.image, _maxTextureSize );

		var image = texture.image,
		isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
		glFormat = paramThreeToGL( texture.format ),
		glType = paramThreeToGL( texture.type );

		setTextureParameters( _gl.TEXTURE_2D, texture, isImagePowerOfTwo );

		var mipmap, mipmaps = texture.mipmaps;

		if ( texture instanceof THREE.DataTexture ) {

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

				texture.generateMipmaps = false;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, image.data );

			}

		} else if ( texture instanceof THREE.CompressedTexture ) {

			for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

				mipmap = mipmaps[ i ];

				if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

					if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

						state.compressedTexImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

					} else {

						console.warn( "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()" );

					}

				} else {

					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

				}

			}

		} else { // regular Texture (image, video, canvas)

			// use manually created mipmaps if available
			// if there are no manual mipmaps
			// set 0 level mipmap and then use GL to generate other mipmap levels

			if ( mipmaps.length > 0 && isImagePowerOfTwo ) {

				for ( var i = 0, il = mipmaps.length; i < il; i ++ ) {

					mipmap = mipmaps[ i ];
					state.texImage2D( _gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap );

				}

				texture.generateMipmaps = false;

			} else {

				state.texImage2D( _gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image );

			}

		}

		if ( texture.generateMipmaps && isImagePowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

		texture.needsUpdate = false;

		if ( texture.onUpdate ) texture.onUpdate( texture );

	};

	this.setTexture = function ( texture, slot ) {

		if ( texture.needsUpdate === true ) {

			var image = texture.image;

			if ( image === undefined ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is undefined', texture );
				return;

			}

			if ( image.complete === false ) {

				console.warn( 'THREE.WebGLRenderer: Texture marked for update but image is incomplete', texture );
				return;

			}

			_this.uploadTexture( texture, slot );
			return;

		}

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

	};

	function clampToMaxSize ( image, maxSize ) {

		if ( image.width > maxSize || image.height > maxSize ) {

			// Warning: Scaling through the canvas will only work with images that use
			// premultiplied alpha.

			var scale = maxSize / Math.max( image.width, image.height );

			var canvas = document.createElement( 'canvas' );
			canvas.width = Math.floor( image.width * scale );
			canvas.height = Math.floor( image.height * scale );

			var context = canvas.getContext( '2d' );
			context.drawImage( image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height );

			console.warn( 'THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image );

			return canvas;

		}

		return image;

	}

	function setCubeTexture ( texture, slot ) {

		if ( texture.image.length === 6 ) {

			if ( texture.needsUpdate ) {

				if ( ! texture.image.__webglTextureCube ) {

					texture.addEventListener( 'dispose', onTextureDispose );

					texture.image.__webglTextureCube = _gl.createTexture();

					_this.info.memory.textures ++;

				}

				state.activeTexture( _gl.TEXTURE0 + slot );
				state.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );

				var isCompressed = texture instanceof THREE.CompressedTexture;
				var isDataTexture = texture.image[ 0 ] instanceof THREE.DataTexture;

				var cubeImage = [];

				for ( var i = 0; i < 6; i ++ ) {

					if ( _this.autoScaleCubemaps && ! isCompressed && ! isDataTexture ) {

						cubeImage[ i ] = clampToMaxSize( texture.image[ i ], _maxCubemapSize );

					} else {

						cubeImage[ i ] = isDataTexture ? texture.image[ i ].image : texture.image[ i ];

					}

				}

				var image = cubeImage[ 0 ],
				isImagePowerOfTwo = THREE.Math.isPowerOfTwo( image.width ) && THREE.Math.isPowerOfTwo( image.height ),
				glFormat = paramThreeToGL( texture.format ),
				glType = paramThreeToGL( texture.type );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, isImagePowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					if ( ! isCompressed ) {

						if ( isDataTexture ) {

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[ i ].width, cubeImage[ i ].height, 0, glFormat, glType, cubeImage[ i ].data );

						} else {

							state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[ i ] );

						}

					} else {

						var mipmap, mipmaps = cubeImage[ i ].mipmaps;

						for ( var j = 0, jl = mipmaps.length; j < jl; j ++ ) {

							mipmap = mipmaps[ j ];

							if ( texture.format !== THREE.RGBAFormat && texture.format !== THREE.RGBFormat ) {

								if ( getCompressedTextureFormats().indexOf( glFormat ) > -1 ) {

									state.compressedTexImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data );

								} else {

									console.warn( "THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setCubeTexture()" );

								}

							} else {

								state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data );

							}

						}

					}

				}

				if ( texture.generateMipmaps && isImagePowerOfTwo ) {

					_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

				}

				texture.needsUpdate = false;

				if ( texture.onUpdate ) texture.onUpdate( texture );

			} else {

				state.activeTexture( _gl.TEXTURE0 + slot );
				state.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

			}

		}

	}

	function setCubeTextureDynamic ( texture, slot ) {

		state.activeTexture( _gl.TEXTURE0 + slot );
		state.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.__webglTexture );

	}

	// Render targets

	function setupFrameBuffer ( framebuffer, renderTarget, textureTarget ) {

		_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
		_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, textureTarget, renderTarget.__webglTexture, 0 );

	}

	function setupRenderBuffer ( renderbuffer, renderTarget ) {

		_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderbuffer );

		if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		/* For some reason this is not working. Defaulting to RGBA4.
		} else if ( ! renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.STENCIL_INDEX8, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );
		*/
		} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer );

		} else {

			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height );

		}

	}

	this.setRenderTarget = function ( renderTarget ) {

		var isCube = ( renderTarget instanceof THREE.WebGLRenderTargetCube );

		if ( renderTarget && renderTarget.__webglFramebuffer === undefined ) {

			if ( renderTarget.depthBuffer === undefined ) renderTarget.depthBuffer = true;
			if ( renderTarget.stencilBuffer === undefined ) renderTarget.stencilBuffer = true;

			renderTarget.addEventListener( 'dispose', onRenderTargetDispose );

			renderTarget.__webglTexture = _gl.createTexture();

			_this.info.memory.textures ++;

			// Setup texture, create render and frame buffers

			var isTargetPowerOfTwo = THREE.Math.isPowerOfTwo( renderTarget.width ) && THREE.Math.isPowerOfTwo( renderTarget.height ),
				glFormat = paramThreeToGL( renderTarget.format ),
				glType = paramThreeToGL( renderTarget.type );

			if ( isCube ) {

				renderTarget.__webglFramebuffer = [];
				renderTarget.__webglRenderbuffer = [];

				state.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, renderTarget, isTargetPowerOfTwo );

				for ( var i = 0; i < 6; i ++ ) {

					renderTarget.__webglFramebuffer[ i ] = _gl.createFramebuffer();
					renderTarget.__webglRenderbuffer[ i ] = _gl.createRenderbuffer();

					state.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

					setupFrameBuffer( renderTarget.__webglFramebuffer[ i ], renderTarget, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i );
					setupRenderBuffer( renderTarget.__webglRenderbuffer[ i ], renderTarget );

				}

				if ( renderTarget.generateMipmaps && isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );

			} else {

				renderTarget.__webglFramebuffer = _gl.createFramebuffer();

				if ( renderTarget.shareDepthFrom ) {

					renderTarget.__webglRenderbuffer = renderTarget.shareDepthFrom.__webglRenderbuffer;

				} else {

					renderTarget.__webglRenderbuffer = _gl.createRenderbuffer();

				}

				state.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
				setTextureParameters( _gl.TEXTURE_2D, renderTarget, isTargetPowerOfTwo );

				state.texImage2D( _gl.TEXTURE_2D, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null );

				setupFrameBuffer( renderTarget.__webglFramebuffer, renderTarget, _gl.TEXTURE_2D );

				if ( renderTarget.shareDepthFrom ) {

					if ( renderTarget.depthBuffer && ! renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					} else if ( renderTarget.depthBuffer && renderTarget.stencilBuffer ) {

						_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderTarget.__webglRenderbuffer );

					}

				} else {

					setupRenderBuffer( renderTarget.__webglRenderbuffer, renderTarget );

				}

				if ( renderTarget.generateMipmaps && isTargetPowerOfTwo ) _gl.generateMipmap( _gl.TEXTURE_2D );

			}

			// Release everything

			if ( isCube ) {

				state.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

			} else {

				state.bindTexture( _gl.TEXTURE_2D, null );

			}

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null );

		}

		var framebuffer, width, height, vx, vy;

		if ( renderTarget ) {

			if ( isCube ) {

				framebuffer = renderTarget.__webglFramebuffer[ renderTarget.activeCubeFace ];

			} else {

				framebuffer = renderTarget.__webglFramebuffer;

			}

			width = renderTarget.width;
			height = renderTarget.height;

			vx = 0;
			vy = 0;

		} else {

			framebuffer = null;

			width = _viewportWidth;
			height = _viewportHeight;

			vx = _viewportX;
			vy = _viewportY;

		}

		if ( framebuffer !== _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( vx, vy, width, height );

			_currentFramebuffer = framebuffer;

		}

		_currentWidth = width;
		_currentHeight = height;

	};

	this.readRenderTargetPixels = function( renderTarget, x, y, width, height, buffer ) {

		if ( ! ( renderTarget instanceof THREE.WebGLRenderTarget ) ) {

			console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.' );
			return;

		}

		if ( renderTarget.__webglFramebuffer ) {

			if ( renderTarget.format !== THREE.RGBAFormat ) {

				console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA format. readPixels can read only RGBA format.' );
				return;

			}

			var restore = false;

			if ( renderTarget.__webglFramebuffer !== _currentFramebuffer ) {

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTarget.__webglFramebuffer );

				restore = true;

			}

			if ( _gl.checkFramebufferStatus( _gl.FRAMEBUFFER ) === _gl.FRAMEBUFFER_COMPLETE ) {

				_gl.readPixels( x, y, width, height, _gl.RGBA, _gl.UNSIGNED_BYTE, buffer );

			} else {

				console.error( 'THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.' );

			}

			if ( restore ) {

				_gl.bindFramebuffer( _gl.FRAMEBUFFER, _currentFramebuffer );

			}

		}

	};

	function updateRenderTargetMipmap ( renderTarget ) {

		if ( renderTarget instanceof THREE.WebGLRenderTargetCube ) {

			state.bindTexture( _gl.TEXTURE_CUBE_MAP, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_CUBE_MAP );
			state.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

		} else {

			state.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
			_gl.generateMipmap( _gl.TEXTURE_2D );
			state.bindTexture( _gl.TEXTURE_2D, null );

		}

	}

	// Fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		if ( f === THREE.NearestFilter || f === THREE.NearestMipMapNearestFilter || f === THREE.NearestMipMapLinearFilter ) {

			return _gl.NEAREST;

		}

		return _gl.LINEAR;

	}

	// Map three.js constants to WebGL constants

	function paramThreeToGL ( p ) {

		var extension;

		if ( p === THREE.RepeatWrapping ) return _gl.REPEAT;
		if ( p === THREE.ClampToEdgeWrapping ) return _gl.CLAMP_TO_EDGE;
		if ( p === THREE.MirroredRepeatWrapping ) return _gl.MIRRORED_REPEAT;

		if ( p === THREE.NearestFilter ) return _gl.NEAREST;
		if ( p === THREE.NearestMipMapNearestFilter ) return _gl.NEAREST_MIPMAP_NEAREST;
		if ( p === THREE.NearestMipMapLinearFilter ) return _gl.NEAREST_MIPMAP_LINEAR;

		if ( p === THREE.LinearFilter ) return _gl.LINEAR;
		if ( p === THREE.LinearMipMapNearestFilter ) return _gl.LINEAR_MIPMAP_NEAREST;
		if ( p === THREE.LinearMipMapLinearFilter ) return _gl.LINEAR_MIPMAP_LINEAR;

		if ( p === THREE.UnsignedByteType ) return _gl.UNSIGNED_BYTE;
		if ( p === THREE.UnsignedShort4444Type ) return _gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === THREE.UnsignedShort5551Type ) return _gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === THREE.UnsignedShort565Type ) return _gl.UNSIGNED_SHORT_5_6_5;

		if ( p === THREE.ByteType ) return _gl.BYTE;
		if ( p === THREE.ShortType ) return _gl.SHORT;
		if ( p === THREE.UnsignedShortType ) return _gl.UNSIGNED_SHORT;
		if ( p === THREE.IntType ) return _gl.INT;
		if ( p === THREE.UnsignedIntType ) return _gl.UNSIGNED_INT;
		if ( p === THREE.FloatType ) return _gl.FLOAT;

		extension = extensions.get( 'OES_texture_half_float' );

		if ( extension !== null ) {

			if ( p === THREE.HalfFloatType ) return extension.HALF_FLOAT_OES;

		}

		if ( p === THREE.AlphaFormat ) return _gl.ALPHA;
		if ( p === THREE.RGBFormat ) return _gl.RGB;
		if ( p === THREE.RGBAFormat ) return _gl.RGBA;
		if ( p === THREE.LuminanceFormat ) return _gl.LUMINANCE;
		if ( p === THREE.LuminanceAlphaFormat ) return _gl.LUMINANCE_ALPHA;

		if ( p === THREE.AddEquation ) return _gl.FUNC_ADD;
		if ( p === THREE.SubtractEquation ) return _gl.FUNC_SUBTRACT;
		if ( p === THREE.ReverseSubtractEquation ) return _gl.FUNC_REVERSE_SUBTRACT;

		if ( p === THREE.ZeroFactor ) return _gl.ZERO;
		if ( p === THREE.OneFactor ) return _gl.ONE;
		if ( p === THREE.SrcColorFactor ) return _gl.SRC_COLOR;
		if ( p === THREE.OneMinusSrcColorFactor ) return _gl.ONE_MINUS_SRC_COLOR;
		if ( p === THREE.SrcAlphaFactor ) return _gl.SRC_ALPHA;
		if ( p === THREE.OneMinusSrcAlphaFactor ) return _gl.ONE_MINUS_SRC_ALPHA;
		if ( p === THREE.DstAlphaFactor ) return _gl.DST_ALPHA;
		if ( p === THREE.OneMinusDstAlphaFactor ) return _gl.ONE_MINUS_DST_ALPHA;

		if ( p === THREE.DstColorFactor ) return _gl.DST_COLOR;
		if ( p === THREE.OneMinusDstColorFactor ) return _gl.ONE_MINUS_DST_COLOR;
		if ( p === THREE.SrcAlphaSaturateFactor ) return _gl.SRC_ALPHA_SATURATE;

		extension = extensions.get( 'WEBGL_compressed_texture_s3tc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_S3TC_DXT1_Format ) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT1_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
			if ( p === THREE.RGBA_S3TC_DXT3_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
			if ( p === THREE.RGBA_S3TC_DXT5_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;

		}

		extension = extensions.get( 'WEBGL_compressed_texture_pvrtc' );

		if ( extension !== null ) {

			if ( p === THREE.RGB_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGB_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
			if ( p === THREE.RGBA_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;

		}

		extension = extensions.get( 'EXT_blend_minmax' );

		if ( extension !== null ) {

			if ( p === THREE.MinEquation ) return extension.MIN_EXT;
			if ( p === THREE.MaxEquation ) return extension.MAX_EXT;

		}

		return 0;

	}

	// Allocations

	function allocateBones ( object ) {

		if ( _supportsBoneTextures && object && object.skeleton && object.skeleton.useVertexTexture ) {

			return 1024;

		} else {

			// default for when object is not specified
			// ( for example when prebuilding shader to be used with multiple objects )
			//
			//  - leave some extra space for other uniforms
			//  - limit here is ANGLE's 254 max uniform vectors
			//    (up to 54 should be safe)

			var nVertexUniforms = _gl.getParameter( _gl.MAX_VERTEX_UNIFORM_VECTORS );
			var nVertexMatrices = Math.floor( ( nVertexUniforms - 20 ) / 4 );

			var maxBones = nVertexMatrices;

			if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

				maxBones = Math.min( object.skeleton.bones.length, maxBones );

				if ( maxBones < object.skeleton.bones.length ) {

					console.warn( 'WebGLRenderer: too many bones - ' + object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)' );

				}

			}

			return maxBones;

		}

	}

	function allocateLights( lights ) {

		var dirLights = 0;
		var pointLights = 0;
		var spotLights = 0;
		var hemiLights = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( light.onlyShadow || light.visible === false ) continue;

			if ( light instanceof THREE.DirectionalLight ) dirLights ++;
			if ( light instanceof THREE.PointLight ) pointLights ++;
			if ( light instanceof THREE.SpotLight ) spotLights ++;
			if ( light instanceof THREE.HemisphereLight ) hemiLights ++;

		}

		return { 'directional': dirLights, 'point': pointLights, 'spot': spotLights, 'hemi': hemiLights };

	}

	function allocateShadows( lights ) {

		var maxShadows = 0;

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];

			if ( ! light.castShadow ) continue;

			if ( light instanceof THREE.SpotLight ) maxShadows ++;
			if ( light instanceof THREE.DirectionalLight && ! light.shadowCascade ) maxShadows ++;

		}

		return maxShadows;

	}

	// DEPRECATED

	this.initMaterial = function () {

		console.warn( 'THREE.WebGLRenderer: .initMaterial() has been removed.' );

	};

	this.addPrePlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPrePlugin() has been removed.' );

	};

	this.addPostPlugin = function () {

		console.warn( 'THREE.WebGLRenderer: .addPostPlugin() has been removed.' );

	};

	this.updateShadowMap = function () {

		console.warn( 'THREE.WebGLRenderer: .updateShadowMap() has been removed.' );

	};

	Object.defineProperties( this, {
		shadowMapEnabled: {
			get: function () {
				return shadowMap.enabled;
			},
			set: function ( value ) {
				console.warn( 'THREE.WebGLRenderer: .shadowMapEnabled is now .shadowMap.enabled.' );
				shadowMap.enabled = value;
			}
		},
		shadowMapType: {
			get: function () {
				return shadowMap.type;
			},
			set: function ( value ) {
				console.warn( 'THREE.WebGLRenderer: .shadowMapType is now .shadowMap.type.' );
				shadowMap.type = value;
			}
		},
		shadowMapCullFace: {
			get: function () {
				return shadowMap.cullFace;
			},
			set: function ( value ) {
				console.warn( 'THREE.WebGLRenderer: .shadowMapCullFace is now .shadowMap.cullFace.' );
				shadowMap.cullFace = value;
			}
		},
		shadowMapDebug: {
			get: function () {
				return shadowMap.debug;
			},
			set: function ( value ) {
				console.warn( 'THREE.WebGLRenderer: .shadowMapDebug is now .shadowMap.debug.' );
				shadowMap.debug = value;
			}
		},
		shadowMapCascade: {
			get: function () {
				return shadowMap.cascade;
			},
			set: function ( value ) {
				console.warn( 'THREE.WebGLRenderer: .shadowMapCascade is now .shadowMap.cascade.' );
				shadowMap.cascade = value;
			}
		}
	} );

};

// File:src/renderers/WebGLRenderTarget.js

/**
 * @author szimek / https://github.com/szimek/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.WebGLRenderTarget = function ( width, height, options ) {

	this.width = width;
	this.height = height;

	options = options || {};

	this.wrapS = options.wrapS !== undefined ? options.wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = options.wrapT !== undefined ? options.wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = options.magFilter !== undefined ? options.magFilter : THREE.LinearFilter;
	this.minFilter = options.minFilter !== undefined ? options.minFilter : THREE.LinearMipMapLinearFilter;

	this.anisotropy = options.anisotropy !== undefined ? options.anisotropy : 1;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.format = options.format !== undefined ? options.format : THREE.RGBAFormat;
	this.type = options.type !== undefined ? options.type : THREE.UnsignedByteType;

	this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
	this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;

	this.generateMipmaps = true;

	this.shareDepthFrom = options.shareDepthFrom !== undefined ? options.shareDepthFrom : null;

};

THREE.WebGLRenderTarget.prototype = {

	constructor: THREE.WebGLRenderTarget,

	setSize: function ( width, height ) {

		if ( this.width !== width || this.height !== height ) {

			this.width = width;
			this.height = height;

			this.dispose();

		}
	},

	clone: function () {

		var tmp = new THREE.WebGLRenderTarget( this.width, this.height );

		tmp.wrapS = this.wrapS;
		tmp.wrapT = this.wrapT;

		tmp.magFilter = this.magFilter;
		tmp.minFilter = this.minFilter;

		tmp.anisotropy = this.anisotropy;

		tmp.offset.copy( this.offset );
		tmp.repeat.copy( this.repeat );

		tmp.format = this.format;
		tmp.type = this.type;

		tmp.depthBuffer = this.depthBuffer;
		tmp.stencilBuffer = this.stencilBuffer;

		tmp.generateMipmaps = this.generateMipmaps;

		tmp.shareDepthFrom = this.shareDepthFrom;

		return tmp;

	},

	dispose: function () {

		this.dispatchEvent( { type: 'dispose' } );

	}

};

THREE.EventDispatcher.prototype.apply( THREE.WebGLRenderTarget.prototype );

// File:src/renderers/WebGLRenderTargetCube.js

/**
 * @author alteredq / http://alteredqualia.com
 */

THREE.WebGLRenderTargetCube = function ( width, height, options ) {

	THREE.WebGLRenderTarget.call( this, width, height, options );

	this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5

};

THREE.WebGLRenderTargetCube.prototype = Object.create( THREE.WebGLRenderTarget.prototype );
THREE.WebGLRenderTargetCube.prototype.constructor = THREE.WebGLRenderTargetCube;

// File:src/renderers/webgl/WebGLExtensions.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLExtensions = function ( gl ) {

	var extensions = {};

	this.get = function ( name ) {

		if ( extensions[ name ] !== undefined ) {

			return extensions[ name ];

		}

		var extension;

		switch ( name ) {

			case 'EXT_texture_filter_anisotropic':
				extension = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
				break;

			case 'WEBGL_compressed_texture_s3tc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
				break;

			case 'WEBGL_compressed_texture_pvrtc':
				extension = gl.getExtension( 'WEBGL_compressed_texture_pvrtc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
				break;

			default:
				extension = gl.getExtension( name );

		}

		if ( extension === null ) {

			console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );

		}

		extensions[ name ] = extension;

		return extension;

	};

};

// File:src/renderers/webgl/WebGLGeometries.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLGeometries = function ( gl, info ) {

	var geometries = {};

	this.get = function ( object ) {

		var geometry = object.geometry;

		if ( geometries[ geometry.id ] !== undefined ) {

			return geometries[ geometry.id ];

		}

		geometry.addEventListener( 'dispose', onGeometryDispose );

		if ( geometry instanceof THREE.BufferGeometry ) {

			geometries[ geometry.id ] = geometry;

		} else {

			geometries[ geometry.id ] = new THREE.BufferGeometry().setFromObject( object );

		}

		info.memory.geometries ++;

		return geometries[ geometry.id ];

	};

	function onGeometryDispose( event ) {

		var geometry = event.target;

		geometry.removeEventListener( 'dispose', onGeometryDispose );

		geometry = geometries[ geometry.id ];

		for ( var name in geometry.attributes ) {

			var attribute = geometry.attributes[ name ];

			if ( attribute.buffer !== undefined ) {

				gl.deleteBuffer( attribute.buffer );

				delete attribute.buffer;

			}

		}

		info.memory.geometries --;

	}

};

// File:src/renderers/webgl/WebGLObjects.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLObjects = function ( gl, info ) {

	var objects = {};
	var objectsImmediate = [];

	var morphInfluences = new Float32Array( 8 );

	var geometries = new THREE.WebGLGeometries( gl, info );

	//

	function onObjectRemoved( event ) {

		var object = event.target;

		object.traverse( function ( child ) {

			child.removeEventListener( 'remove', onObjectRemoved );
			removeObject( child );

		} );

	}

	function removeObject( object ) {

		if ( object instanceof THREE.Mesh ||
			 object instanceof THREE.PointCloud ||
			 object instanceof THREE.Line ) {

			delete objects[ object.id ];

		} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

			removeInstances( objectsImmediate, object );

		}

		delete object.__webglInit;
		delete object._modelViewMatrix;
		delete object._normalMatrix;

		delete object.__webglActive;

	}

	function removeInstances( objlist, object ) {

		for ( var o = objlist.length - 1; o >= 0; o -- ) {

			if ( objlist[ o ].object === object ) {

				objlist.splice( o, 1 );

			}

		}

	}

	//

	this.objects = objects;
	this.objectsImmediate = objectsImmediate;

	this.geometries = geometries;

	this.init = function ( object ) {

		if ( object.__webglInit === undefined ) {

			object.__webglInit = true;
			object._modelViewMatrix = new THREE.Matrix4();
			object._normalMatrix = new THREE.Matrix3();

			object.addEventListener( 'removed', onObjectRemoved );

		}

		if ( object.__webglActive === undefined ) {

			object.__webglActive = true;

			if ( object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.PointCloud ) {

				objects[ object.id ] = {
					id: object.id,
					object: object,
					z: 0
				};

			} else if ( object instanceof THREE.ImmediateRenderObject || object.immediateRenderCallback ) {

				objectsImmediate.push( {
					id: null,
					object: object,
					opaque: null,
					transparent: null,
					z: 0
				} );

			}

		}

	};

	function numericalSort ( a, b ) {

		return b[ 0 ] - a[ 0 ];

	}

	function updateObject( object ) {

		var geometry = geometries.get( object );

		if ( object.geometry.dynamic === true ) {

			geometry.updateFromObject( object );

		}

		// morph targets

		if ( object.morphTargetInfluences !== undefined ) {

			var activeInfluences = [];
			var morphTargetInfluences = object.morphTargetInfluences;

			for ( var i = 0, l = morphTargetInfluences.length; i < l; i ++ ) {

				var influence = morphTargetInfluences[ i ];
				activeInfluences.push( [ influence, i ] );

			}

			activeInfluences.sort( numericalSort );

			if ( activeInfluences.length > 8 ) {

				activeInfluences.length = 8;

			}

			for ( var i = 0, l = activeInfluences.length; i < l; i ++ ) {

				morphInfluences[ i ] = activeInfluences[ i ][ 0 ];

				var attribute = geometry.morphAttributes[ activeInfluences[ i ][ 1 ] ];
				geometry.addAttribute( 'morphTarget' + i, attribute );

			}

			var material = object.material;

			if ( material.program !== undefined ) {

				var uniforms = material.program.getUniforms();

				if ( uniforms.morphTargetInfluences !== null ) {

					gl.uniform1fv( uniforms.morphTargetInfluences, morphInfluences );

				}

			} else {

				console.warn( 'TOFIX: material.program is undefined' );

			}

		}

		//

		var attributes = geometry.attributes;

		for ( var name in attributes ) {

			var attribute = attributes[ name ];

			var bufferType = ( name === 'index' ) ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;

			var data = ( attribute instanceof THREE.InterleavedBufferAttribute ) ? attribute.data : attribute;

			if ( data.buffer === undefined ) {

				data.buffer = gl.createBuffer();
				gl.bindBuffer( bufferType, data.buffer );

				var usage = gl.STATIC_DRAW;

				if ( data instanceof THREE.DynamicBufferAttribute
						 || ( data instanceof THREE.InstancedBufferAttribute && data.dynamic === true )
						 || ( data instanceof THREE.InterleavedBuffer && data.dynamic === true ) ) {

					usage = gl.DYNAMIC_DRAW;

				}

				gl.bufferData( bufferType, data.array, usage );

				data.needsUpdate = false;

			} else if ( data.needsUpdate === true ) {

				gl.bindBuffer( bufferType, data.buffer );

				if ( data.updateRange === undefined || data.updateRange.count === -1 ) { // Not using update ranges

					gl.bufferSubData( bufferType, 0, data.array );

				} else if ( data.updateRange.count === 0 ) {

					console.error( 'THREE.WebGLRenderer.updateObject: using updateRange for THREE.DynamicBufferAttribute and marked as needsUpdate but count is 0, ensure you are using set methods or updating manually.' );

				} else {

					gl.bufferSubData( bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT,
									 data.array.subarray( data.updateRange.offset, data.updateRange.offset + data.updateRange.count ) );

					data.updateRange.count = 0; // reset range

				}

				data.needsUpdate = false;

			}

		}

	};

	this.update = function ( renderList ) {

		for ( var i = 0, ul = renderList.length; i < ul; i++ ) {

			var object = renderList[i].object;

			if ( object.material.visible !== false ) {

				updateObject( object );

			}

		}

	};

};

// File:src/renderers/webgl/WebGLProgram.js

THREE.WebGLProgram = ( function () {

	var programIdCount = 0;

	function generateDefines( defines ) {

		var chunks = [];

		for ( var name in defines ) {

			var value = defines[ name ];

			if ( value === false ) continue;

			chunks.push( '#define ' + name + ' ' + value );

		}

		return chunks.join( '\n' );

	}

	function fetchUniformLocations( gl, program, identifiers ) {


		var uniforms = {};

		var n = gl.getProgramParameter( program, gl.ACTIVE_UNIFORMS );

		for ( var i = 0; i < n; i ++ ) {

			var info = gl.getActiveUniform( program , i );
			var name = info.name;
			var location = gl.getUniformLocation( program, name );

			//console.log("THREE.WebGLProgram: ACTIVE UNIFORM:", name);

			var suffixPos = name.lastIndexOf( '[0]' );
			if ( suffixPos !== -1 && suffixPos === name.length - 3 ) {

				uniforms[ name.substr( 0, suffixPos ) ] = location;

			}

			uniforms[ name ] = location;

		}

		return uniforms;

	}

	function fetchAttributeLocations( gl, program, identifiers ) {

		var attributes = {};

		var n = gl.getProgramParameter( program, gl.ACTIVE_ATTRIBUTES );

		for ( var i = 0; i < n; i ++ ) {

			var info = gl.getActiveAttrib( program , i );
			var name = info.name;

			//console.log("THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:", name);

			attributes[ name ] = gl.getAttribLocation( program, name );

		}

		return attributes;

	}

	function filterEmptyLine( string ) {

		return string !== '';

	}

	return function ( renderer, code, material, parameters ) {

		var gl = renderer.context;

		var defines = material.defines;
		var uniforms = material.__webglShader.uniforms;
		var attributes = material.attributes;

		var vertexShader = material.__webglShader.vertexShader;
		var fragmentShader = material.__webglShader.fragmentShader;

		var index0AttributeName = material.index0AttributeName;

		/*
		if ( index0AttributeName === undefined && parameters.morphTargets === true ) {

			// programs with morphTargets displace position out of attribute 0

			index0AttributeName = 'position';

		}
		*/

		var shadowMapTypeDefine = 'SHADOWMAP_TYPE_BASIC';

		if ( parameters.shadowMapType === THREE.PCFShadowMap ) {

			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF';

		} else if ( parameters.shadowMapType === THREE.PCFSoftShadowMap ) {

			shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF_SOFT';

		}

		var envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
		var envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
		var envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';

		if ( parameters.envMap ) {

			switch ( material.envMap.mapping ) {

				case THREE.CubeReflectionMapping:
				case THREE.CubeRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
					break;

				case THREE.EquirectangularReflectionMapping:
				case THREE.EquirectangularRefractionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
					break;

				case THREE.SphericalReflectionMapping:
					envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
					break;

			}

			switch ( material.envMap.mapping ) {

				case THREE.CubeRefractionMapping:
				case THREE.EquirectangularRefractionMapping:
					envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
					break;

			}

			switch ( material.combine ) {

				case THREE.MultiplyOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
					break;

				case THREE.MixOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
					break;

				case THREE.AddOperation:
					envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
					break;

			}

		}

		var gammaFactorDefine = ( renderer.gammaFactor > 0 ) ? renderer.gammaFactor : 1.0;

		// console.log( 'building new program ' );

		//

		var customDefines = generateDefines( defines );

		//

		var program = gl.createProgram();

		var prefixVertex, prefixFragment;

		if ( material instanceof THREE.RawShaderMaterial ) {

			prefixVertex = '';
			prefixFragment = '';

		} else {

			prefixVertex = [

				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',

				customDefines,

				parameters.supportsVertexTextures ? '#define VERTEX_TEXTURES' : '',

				renderer.gammaInput ? '#define GAMMA_INPUT' : '',
				renderer.gammaOutput ? '#define GAMMA_OUTPUT' : '',
				'#define GAMMA_FACTOR ' + gammaFactorDefine,

				'#define MAX_DIR_LIGHTS ' + parameters.maxDirLights,
				'#define MAX_POINT_LIGHTS ' + parameters.maxPointLights,
				'#define MAX_SPOT_LIGHTS ' + parameters.maxSpotLights,
				'#define MAX_HEMI_LIGHTS ' + parameters.maxHemiLights,

				'#define MAX_SHADOWS ' + parameters.maxShadows,

				'#define MAX_BONES ' + parameters.maxBones,

				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',

				parameters.flatShading ? '#define FLAT_SHADED': '',

				parameters.skinning ? '#define USE_SKINNING' : '',
				parameters.useVertexTexture ? '#define BONE_TEXTURE' : '',

				parameters.morphTargets ? '#define USE_MORPHTARGETS' : '',
				parameters.morphNormals ? '#define USE_MORPHNORMALS' : '',
				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',

				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
				parameters.shadowMapDebug ? '#define SHADOWMAP_DEBUG' : '',
				parameters.shadowMapCascade ? '#define SHADOWMAP_CASCADE' : '',

				parameters.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',

				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',


				'uniform mat4 modelMatrix;',
				'uniform mat4 modelViewMatrix;',
				'uniform mat4 projectionMatrix;',
				'uniform mat4 viewMatrix;',
				'uniform mat3 normalMatrix;',
				'uniform vec3 cameraPosition;',

				'attribute vec3 position;',
				'attribute vec3 normal;',
				'attribute vec2 uv;',

				'#ifdef USE_COLOR',

				'	attribute vec3 color;',

				'#endif',

				'#ifdef USE_MORPHTARGETS',

				'	attribute vec3 morphTarget0;',
				'	attribute vec3 morphTarget1;',
				'	attribute vec3 morphTarget2;',
				'	attribute vec3 morphTarget3;',

				'	#ifdef USE_MORPHNORMALS',

				'		attribute vec3 morphNormal0;',
				'		attribute vec3 morphNormal1;',
				'		attribute vec3 morphNormal2;',
				'		attribute vec3 morphNormal3;',

				'	#else',

				'		attribute vec3 morphTarget4;',
				'		attribute vec3 morphTarget5;',
				'		attribute vec3 morphTarget6;',
				'		attribute vec3 morphTarget7;',

				'	#endif',

				'#endif',

				'#ifdef USE_SKINNING',

				'	attribute vec4 skinIndex;',
				'	attribute vec4 skinWeight;',

				'#endif',

				'\n'

			].filter( filterEmptyLine ).join( '\n' );

			prefixFragment = [

				( parameters.bumpMap || parameters.normalMap || parameters.flatShading || material.derivatives ) ? '#extension GL_OES_standard_derivatives : enable' : '',

				'precision ' + parameters.precision + ' float;',
				'precision ' + parameters.precision + ' int;',

				customDefines,

				'#define MAX_DIR_LIGHTS ' + parameters.maxDirLights,
				'#define MAX_POINT_LIGHTS ' + parameters.maxPointLights,
				'#define MAX_SPOT_LIGHTS ' + parameters.maxSpotLights,
				'#define MAX_HEMI_LIGHTS ' + parameters.maxHemiLights,

				'#define MAX_SHADOWS ' + parameters.maxShadows,

				parameters.alphaTest ? '#define ALPHATEST ' + parameters.alphaTest : '',

				renderer.gammaInput ? '#define GAMMA_INPUT' : '',
				renderer.gammaOutput ? '#define GAMMA_OUTPUT' : '',
				'#define GAMMA_FACTOR ' + gammaFactorDefine,

				( parameters.useFog && parameters.fog ) ? '#define USE_FOG' : '',
				( parameters.useFog && parameters.fogExp ) ? '#define FOG_EXP2' : '',

				parameters.map ? '#define USE_MAP' : '',
				parameters.envMap ? '#define USE_ENVMAP' : '',
				parameters.envMap ? '#define ' + envMapTypeDefine : '',
				parameters.envMap ? '#define ' + envMapModeDefine : '',
				parameters.envMap ? '#define ' + envMapBlendingDefine : '',
				parameters.lightMap ? '#define USE_LIGHTMAP' : '',
				parameters.aoMap ? '#define USE_AOMAP' : '',
				parameters.bumpMap ? '#define USE_BUMPMAP' : '',
				parameters.normalMap ? '#define USE_NORMALMAP' : '',
				parameters.specularMap ? '#define USE_SPECULARMAP' : '',
				parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
				parameters.vertexColors ? '#define USE_COLOR' : '',

				parameters.flatShading ? '#define FLAT_SHADED': '',

				parameters.metal ? '#define METAL' : '',
				parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
				parameters.flipSided ? '#define FLIP_SIDED' : '',

				parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
				parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
				parameters.shadowMapDebug ? '#define SHADOWMAP_DEBUG' : '',
				parameters.shadowMapCascade ? '#define SHADOWMAP_CASCADE' : '',

				parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
				parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',

				'uniform mat4 viewMatrix;',
				'uniform vec3 cameraPosition;',

				'\n'

			].filter( filterEmptyLine ).join( '\n' );

		}

		var vertexGlsl = prefixVertex + vertexShader;
		var fragmentGlsl = prefixFragment + fragmentShader;

		var glVertexShader = new THREE.WebGLShader( gl, gl.VERTEX_SHADER, vertexGlsl );
		var glFragmentShader = new THREE.WebGLShader( gl, gl.FRAGMENT_SHADER, fragmentGlsl );

		gl.attachShader( program, glVertexShader );
		gl.attachShader( program, glFragmentShader );

		if ( index0AttributeName !== undefined ) {

			// Force a particular attribute to index 0.
			// because potentially expensive emulation is done by browser if attribute 0 is disabled.
			// And, color, for example is often automatically bound to index 0 so disabling it

			gl.bindAttribLocation( program, 0, index0AttributeName );

		}

		gl.linkProgram( program );

		var programLogInfo = gl.getProgramInfoLog( program );
		var vertexErrorLogInfo = gl.getShaderInfoLog( glVertexShader );
		var fragmentErrorLogInfo = gl.getShaderInfoLog( glFragmentShader );

		if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === false ) {

			console.error( 'THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter( program, gl.VALIDATE_STATUS ), 'gl.getProgramInfoLog', programLogInfo, vertexErrorLogInfo, fragmentErrorLogInfo );

		}

		if ( programLogInfo !== '' ) {

			console.warn( 'THREE.WebGLProgram: gl.getProgramInfoLog()', programLogInfo );

		}

		// clean up

		gl.deleteShader( glVertexShader );
		gl.deleteShader( glFragmentShader );

		// set up caching for uniform locations

		var getUniforms = function() { return this._cachedUniforms; };

		this.getUniforms = function() {

			// fetch, cache, and next time just use a dumb accessor
			var uniforms = fetchUniformLocations( gl, program );
			this._cachedUniforms = uniforms;
			this.getUniforms = getUniforms;
			return uniforms;

		};

		// set up caching for attribute locations

		var getAttributes = function() { return this._cachedAttributes; };

		this.getAttributes = function() {

			var attributes = fetchAttributeLocations( gl, program );
			this._cachedAttributes = attributes;
			this.getAttributes = getAttributes;
			return attributes;

		};

		// DEPRECATED

		Object.defineProperties( this, {

			uniforms: {
				get: function() {

					console.warn( 'THREE.WebGLProgram: .uniforms is now .getUniforms().' );
					return this.getUniforms();

				}
			},

			attributes: {
				get: function() {

					console.warn( 'THREE.WebGLProgram: .attributes is now .getAttributes().' );
					return this.getAttributes();

				}
			}

		});


		//

		this.id = programIdCount ++;
		this.code = code;
		this.usedTimes = 1;
		this.program = program;
		this.vertexShader = glVertexShader;
		this.fragmentShader = glFragmentShader;

		return this;

	};

} )();

// File:src/renderers/webgl/WebGLShader.js

THREE.WebGLShader = ( function () {

	var addLineNumbers = function ( string ) {

		var lines = string.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	};

	return function ( gl, type, string ) {

		var shader = gl.createShader( type ); 

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {

			console.error( 'THREE.WebGLShader: Shader couldn\'t compile.' );

		}

		if ( gl.getShaderInfoLog( shader ) !== '' ) {

			console.warn( 'THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog( shader ), addLineNumbers( string ) );

		}

		// --enable-privileged-webgl-extension
		// console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

		return shader;

	};

} )();

// File:src/renderers/webgl/WebGLShadowMap.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WebGLShadowMap = function ( _renderer, _lights, _objects ) {

	var _gl = _renderer.context,
	_frustum = new THREE.Frustum(),
	_projScreenMatrix = new THREE.Matrix4(),

	_min = new THREE.Vector3(),
	_max = new THREE.Vector3(),

	_webglObjects = _objects.objects,
	_webglObjectsImmediate = _objects.objectsImmediate,

	_matrixPosition = new THREE.Vector3(),

	_renderList = [];

	// init

	var depthShader = THREE.ShaderLib[ "depthRGBA" ];
	var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );

	var _depthMaterial = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader
	 } );

	var _depthMaterialMorph = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true
	} );

	var _depthMaterialSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		skinning: true
	} );

	var _depthMaterialMorphSkin = new THREE.ShaderMaterial( {
		uniforms: depthUniforms,
		vertexShader: depthShader.vertexShader,
		fragmentShader: depthShader.fragmentShader,
		morphTargets: true,
		skinning: true
	} );

	_depthMaterial._shadowPass = true;
	_depthMaterialMorph._shadowPass = true;
	_depthMaterialSkin._shadowPass = true;
	_depthMaterialMorphSkin._shadowPass = true;

	//

	var scope = this;

	this.enabled = false;
	this.type = THREE.PCFShadowMap;
	this.cullFace = THREE.CullFaceFront;
	this.debug = false;
	this.cascade = false;

	this.render = function ( scene, camera ) {

		if ( scope.enabled === false ) return;

		var i, il, j, jl, n,

		shadowMap, shadowMatrix, shadowCamera,
		webglObject, object, material, light,

		lights = [],
		k = 0,

		fog = null;

		// set GL state for depth map

		_gl.clearColor( 1, 1, 1, 1 );
		_gl.disable( _gl.BLEND );

		_gl.enable( _gl.CULL_FACE );
		_gl.frontFace( _gl.CCW );

		if ( scope.cullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.FRONT );

		} else {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.state.setDepthTest( true );

		// preprocess lights
		// 	- skip lights that are not casting shadows
		//	- create virtual lights for cascaded shadow maps

		for ( i = 0, il = _lights.length; i < il; i ++ ) {

			light = _lights[ i ];

			if ( ! light.castShadow ) continue;

			if ( ( light instanceof THREE.DirectionalLight ) && light.shadowCascade ) {

				for ( n = 0; n < light.shadowCascadeCount; n ++ ) {

					var virtualLight;

					if ( ! light.shadowCascadeArray[ n ] ) {

						virtualLight = createVirtualLight( light, n );
						virtualLight.originalCamera = camera;

						var gyro = new THREE.Gyroscope();
						gyro.position.copy( light.shadowCascadeOffset );

						gyro.add( virtualLight );
						gyro.add( virtualLight.target );

						camera.add( gyro );

						light.shadowCascadeArray[ n ] = virtualLight;

						//console.log( "Created virtualLight", virtualLight );

					} else {

						virtualLight = light.shadowCascadeArray[ n ];

					}

					updateVirtualLight( light, n );

					lights[ k ] = virtualLight;
					k ++;

				}

			} else {

				lights[ k ] = light;
				k ++;

			}

		}

		// render depth map

		for ( i = 0, il = lights.length; i < il; i ++ ) {

			light = lights[ i ];

			if ( ! light.shadowMap ) {

				var shadowFilter = THREE.LinearFilter;

				if ( scope.type === THREE.PCFSoftShadowMap ) {

					shadowFilter = THREE.NearestFilter;

				}

				var pars = { minFilter: shadowFilter, magFilter: shadowFilter, format: THREE.RGBAFormat };

				light.shadowMap = new THREE.WebGLRenderTarget( light.shadowMapWidth, light.shadowMapHeight, pars );
				light.shadowMapSize = new THREE.Vector2( light.shadowMapWidth, light.shadowMapHeight );

				light.shadowMatrix = new THREE.Matrix4();

			}

			if ( ! light.shadowCamera ) {

				if ( light instanceof THREE.SpotLight ) {

					light.shadowCamera = new THREE.PerspectiveCamera( light.shadowCameraFov, light.shadowMapWidth / light.shadowMapHeight, light.shadowCameraNear, light.shadowCameraFar );

				} else if ( light instanceof THREE.DirectionalLight ) {

					light.shadowCamera = new THREE.OrthographicCamera( light.shadowCameraLeft, light.shadowCameraRight, light.shadowCameraTop, light.shadowCameraBottom, light.shadowCameraNear, light.shadowCameraFar );

				} else {

					console.error( "THREE.ShadowMapPlugin: Unsupported light type for shadow", light );
					continue;

				}

				scene.add( light.shadowCamera );

				if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

			}

			if ( light.shadowCameraVisible && ! light.cameraHelper ) {

				light.cameraHelper = new THREE.CameraHelper( light.shadowCamera );
				scene.add( light.cameraHelper );

			}

			if ( light.isVirtual && virtualLight.originalCamera == camera ) {

				updateShadowCamera( camera, light );

			}

			shadowMap = light.shadowMap;
			shadowMatrix = light.shadowMatrix;
			shadowCamera = light.shadowCamera;

			//

			shadowCamera.position.setFromMatrixPosition( light.matrixWorld );
			_matrixPosition.setFromMatrixPosition( light.target.matrixWorld );
			shadowCamera.lookAt( _matrixPosition );
			shadowCamera.updateMatrixWorld();

			shadowCamera.matrixWorldInverse.getInverse( shadowCamera.matrixWorld );

			//

			if ( light.cameraHelper ) light.cameraHelper.visible = light.shadowCameraVisible;
			if ( light.shadowCameraVisible ) light.cameraHelper.update();

			// compute shadow matrix

			shadowMatrix.set(
				0.5, 0.0, 0.0, 0.5,
				0.0, 0.5, 0.0, 0.5,
				0.0, 0.0, 0.5, 0.5,
				0.0, 0.0, 0.0, 1.0
			);

			shadowMatrix.multiply( shadowCamera.projectionMatrix );
			shadowMatrix.multiply( shadowCamera.matrixWorldInverse );

			// update camera matrices and frustum

			_projScreenMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );
			_frustum.setFromMatrix( _projScreenMatrix );

			// render shadow map

			_renderer.setRenderTarget( shadowMap );
			_renderer.clear();

			// set object matrices & frustum culling

			_renderList.length = 0;

			projectObject( scene, shadowCamera );


			// render regular objects

			var objectMaterial, useMorphing, useSkinning;

			for ( j = 0, jl = _renderList.length; j < jl; j ++ ) {

				webglObject = _renderList[ j ];

				object = webglObject.object;

				// culling is overriden globally for all objects
				// while rendering depth map

				// need to deal with MeshFaceMaterial somehow
				// in that case just use the first of material.materials for now
				// (proper solution would require to break objects by materials
				//  similarly to regular rendering and then set corresponding
				//  depth materials per each chunk instead of just once per object)

				objectMaterial = getObjectMaterial( object );

				useMorphing = object.geometry.morphTargets !== undefined && object.geometry.morphTargets.length > 0 && objectMaterial.morphTargets;
				useSkinning = object instanceof THREE.SkinnedMesh && objectMaterial.skinning;

				if ( object.customDepthMaterial ) {

					material = object.customDepthMaterial;

				} else if ( useSkinning ) {

					material = useMorphing ? _depthMaterialMorphSkin : _depthMaterialSkin;

				} else if ( useMorphing ) {

					material = _depthMaterialMorph;

				} else {

					material = _depthMaterial;

				}

				_renderer.setMaterialFaces( objectMaterial );
				_renderer.renderBufferDirect( shadowCamera, _lights, fog, material, object );

			}

			// set matrices and render immediate objects

			for ( j = 0, jl = _webglObjectsImmediate.length; j < jl; j ++ ) {

				webglObject = _webglObjectsImmediate[ j ];
				object = webglObject.object;

				if ( object.visible && object.castShadow ) {

					object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );

					_renderer.renderImmediateObject( shadowCamera, _lights, fog, _depthMaterial, object );

				}

			}

		}

		// restore GL state

		var clearColor = _renderer.getClearColor(),
		clearAlpha = _renderer.getClearAlpha();

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );
		_gl.enable( _gl.BLEND );

		if ( scope.cullFace === THREE.CullFaceFront ) {

			_gl.cullFace( _gl.BACK );

		}

		_renderer.resetGLState();

	};

	function projectObject( object, shadowCamera ) {

		if ( object.visible === true ) {

			var webglObject = _objects.objects[ object.id ];

			if ( webglObject && object.castShadow && ( object.frustumCulled === false || _frustum.intersectsObject( object ) === true ) ) {

				object._modelViewMatrix.multiplyMatrices( shadowCamera.matrixWorldInverse, object.matrixWorld );
				_renderList.push( webglObject );

			}

			for ( var i = 0, l = object.children.length; i < l; i ++ ) {

				projectObject( object.children[ i ], shadowCamera );

			}

		}

	}

	function createVirtualLight( light, cascade ) {

		var virtualLight = new THREE.DirectionalLight();

		virtualLight.isVirtual = true;

		virtualLight.onlyShadow = true;
		virtualLight.castShadow = true;

		virtualLight.shadowCameraNear = light.shadowCameraNear;
		virtualLight.shadowCameraFar = light.shadowCameraFar;

		virtualLight.shadowCameraLeft = light.shadowCameraLeft;
		virtualLight.shadowCameraRight = light.shadowCameraRight;
		virtualLight.shadowCameraBottom = light.shadowCameraBottom;
		virtualLight.shadowCameraTop = light.shadowCameraTop;

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;

		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];
		virtualLight.shadowMapWidth = light.shadowCascadeWidth[ cascade ];
		virtualLight.shadowMapHeight = light.shadowCascadeHeight[ cascade ];

		virtualLight.pointsWorld = [];
		virtualLight.pointsFrustum = [];

		var pointsWorld = virtualLight.pointsWorld,
			pointsFrustum = virtualLight.pointsFrustum;

		for ( var i = 0; i < 8; i ++ ) {

			pointsWorld[ i ] = new THREE.Vector3();
			pointsFrustum[ i ] = new THREE.Vector3();

		}

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		pointsFrustum[ 0 ].set( - 1, - 1, nearZ );
		pointsFrustum[ 1 ].set(  1, - 1, nearZ );
		pointsFrustum[ 2 ].set( - 1,  1, nearZ );
		pointsFrustum[ 3 ].set(  1,  1, nearZ );

		pointsFrustum[ 4 ].set( - 1, - 1, farZ );
		pointsFrustum[ 5 ].set(  1, - 1, farZ );
		pointsFrustum[ 6 ].set( - 1,  1, farZ );
		pointsFrustum[ 7 ].set(  1,  1, farZ );

		return virtualLight;

	}

	// Synchronize virtual light with the original light

	function updateVirtualLight( light, cascade ) {

		var virtualLight = light.shadowCascadeArray[ cascade ];

		virtualLight.position.copy( light.position );
		virtualLight.target.position.copy( light.target.position );
		virtualLight.lookAt( virtualLight.target );

		virtualLight.shadowCameraVisible = light.shadowCameraVisible;
		virtualLight.shadowDarkness = light.shadowDarkness;

		virtualLight.shadowBias = light.shadowCascadeBias[ cascade ];

		var nearZ = light.shadowCascadeNearZ[ cascade ];
		var farZ = light.shadowCascadeFarZ[ cascade ];

		var pointsFrustum = virtualLight.pointsFrustum;

		pointsFrustum[ 0 ].z = nearZ;
		pointsFrustum[ 1 ].z = nearZ;
		pointsFrustum[ 2 ].z = nearZ;
		pointsFrustum[ 3 ].z = nearZ;

		pointsFrustum[ 4 ].z = farZ;
		pointsFrustum[ 5 ].z = farZ;
		pointsFrustum[ 6 ].z = farZ;
		pointsFrustum[ 7 ].z = farZ;

	}

	// Fit shadow camera's ortho frustum to camera frustum

	function updateShadowCamera( camera, light ) {

		var shadowCamera = light.shadowCamera,
			pointsFrustum = light.pointsFrustum,
			pointsWorld = light.pointsWorld;

		_min.set( Infinity, Infinity, Infinity );
		_max.set( - Infinity, - Infinity, - Infinity );

		for ( var i = 0; i < 8; i ++ ) {

			var p = pointsWorld[ i ];

			p.copy( pointsFrustum[ i ] );
			p.unproject( camera );

			p.applyMatrix4( shadowCamera.matrixWorldInverse );

			if ( p.x < _min.x ) _min.x = p.x;
			if ( p.x > _max.x ) _max.x = p.x;

			if ( p.y < _min.y ) _min.y = p.y;
			if ( p.y > _max.y ) _max.y = p.y;

			if ( p.z < _min.z ) _min.z = p.z;
			if ( p.z > _max.z ) _max.z = p.z;

		}

		shadowCamera.left = _min.x;
		shadowCamera.right = _max.x;
		shadowCamera.top = _max.y;
		shadowCamera.bottom = _min.y;

		// can't really fit near/far
		//shadowCamera.near = _min.z;
		//shadowCamera.far = _max.z;

		shadowCamera.updateProjectionMatrix();

	}

	// For the moment just ignore objects that have multiple materials with different animation methods
	// Only the first material will be taken into account for deciding which depth material to use for shadow maps

	function getObjectMaterial( object ) {

		return object.material instanceof THREE.MeshFaceMaterial
			? object.material.materials[ 0 ]
			: object.material;

	}

};

// File:src/renderers/webgl/WebGLState.js

/**
* @author mrdoob / http://mrdoob.com/
*/

THREE.WebGLState = function ( gl, paramThreeToGL ) {

	var _this = this;

	var newAttributes = new Uint8Array( 16 );
	var enabledAttributes = new Uint8Array( 16 );

	var currentBlending = null;
	var currentBlendEquation = null;
	var currentBlendSrc = null;
	var currentBlendDst = null;
	var currentBlendEquationAlpha = null;
	var currentBlendSrcAlpha = null;
	var currentBlendDstAlpha = null;

	var currentDepthFunc = null;
	var currentDepthTest = null;
	var currentDepthWrite = null;

	var currentColorWrite = null;

	var currentDoubleSided = null;
	var currentFlipSided = null;

	var currentLineWidth = null;

	var currentPolygonOffset = null;
	var currentPolygonOffsetFactor = null;
	var currentPolygonOffsetUnits = null;

	var maxTextures = gl.getParameter( gl.MAX_TEXTURE_IMAGE_UNITS );

	var currentTextureSlot = undefined;
	var currentBoundTextures = {};

	this.initAttributes = function () {

		for ( var i = 0, l = newAttributes.length; i < l; i ++ ) {

			newAttributes[ i ] = 0;

		}

	};

	this.enableAttribute = function ( attribute ) {

		newAttributes[ attribute ] = 1;

		if ( enabledAttributes[ attribute ] === 0 ) {

			gl.enableVertexAttribArray( attribute );
			enabledAttributes[ attribute ] = 1;

		}

	};

	this.disableUnusedAttributes = function () {

		for ( var i = 0, l = enabledAttributes.length; i < l; i ++ ) {

			if ( enabledAttributes[ i ] !== newAttributes[ i ] ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

	};

	this.setBlending = function ( blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha ) {

		if ( blending !== currentBlending ) {

			if ( blending === THREE.NoBlending ) {

				gl.disable( gl.BLEND );

			} else if ( blending === THREE.AdditiveBlending ) {

				gl.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.SRC_ALPHA, gl.ONE );

			} else if ( blending === THREE.SubtractiveBlending ) {

				// TODO: Find blendFuncSeparate() combination
				gl.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.ZERO, gl.ONE_MINUS_SRC_COLOR );

			} else if ( blending === THREE.MultiplyBlending ) {

				// TODO: Find blendFuncSeparate() combination
				gl.enable( gl.BLEND );
				gl.blendEquation( gl.FUNC_ADD );
				gl.blendFunc( gl.ZERO, gl.SRC_COLOR );

			} else if ( blending === THREE.CustomBlending ) {

				gl.enable( gl.BLEND );

			} else {

				gl.enable( gl.BLEND );
				gl.blendEquationSeparate( gl.FUNC_ADD, gl.FUNC_ADD );
				gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA );

			}

			currentBlending = blending;

		}

		if ( blending === THREE.CustomBlending ) {

			blendEquationAlpha = blendEquationAlpha || blendEquation;
			blendSrcAlpha = blendSrcAlpha || blendSrc;
			blendDstAlpha = blendDstAlpha || blendDst;

			if ( blendEquation !== currentBlendEquation || blendEquationAlpha !== currentBlendEquationAlpha ) {

				gl.blendEquationSeparate( paramThreeToGL( blendEquation ), paramThreeToGL( blendEquationAlpha ) );

				currentBlendEquation = blendEquation;
				currentBlendEquationAlpha = blendEquationAlpha;

			}

			if ( blendSrc !== currentBlendSrc || blendDst !== currentBlendDst || blendSrcAlpha !== currentBlendSrcAlpha || blendDstAlpha !== currentBlendDstAlpha ) {

				gl.blendFuncSeparate( paramThreeToGL( blendSrc ), paramThreeToGL( blendDst ), paramThreeToGL( blendSrcAlpha ), paramThreeToGL( blendDstAlpha ) );

				currentBlendSrc = blendSrc;
				currentBlendDst = blendDst;
				currentBlendSrcAlpha = blendSrcAlpha;
				currentBlendDstAlpha = blendDstAlpha;

			}

		} else {

			currentBlendEquation = null;
			currentBlendSrc = null;
			currentBlendDst = null;
			currentBlendEquationAlpha = null;
			currentBlendSrcAlpha = null;
			currentBlendDstAlpha = null;

		}

	};

	this.setDepthFunc = function ( depthFunc ) {

	    if ( currentDepthFunc !== depthFunc ) {

	        if ( depthFunc ) {

	            switch ( depthFunc ) {

	                case THREE.NeverDepth:

	                    gl.depthFunc( gl.NEVER );
	                    break;

	                case THREE.AlwaysDepth:

	                    gl.depthFunc( gl.ALWAYS );
	                    break;

	                case THREE.LessDepth:

	                    gl.depthFunc( gl.LESS );
	                    break;

	                case THREE.LessEqualDepth:

	                    gl.depthFunc( gl.LEQUAL );
	                    break;

	                case THREE.EqualDepth:

	                    gl.depthFunc( gl.EQUAL );
	                    break;

	                case THREE.GreaterEqualDepth:

	                    gl.depthFunc( gl.GEQUAL );
	                    break;

	                case THREE.GreaterDepth:

	                    gl.depthFunc( gl.GREATER );
	                    break;

	                case THREE.NotEqualDepth:

	                    gl.depthFunc( gl.NOTEQUAL );
	                    break;

	                default:

                        gl.depthFunc( gl.LEQUAL );
	            }

	        } else {

	            gl.depthFunc( gl.LEQUAL );

	        }

	        currentDepthFunc = depthFunc;

	    }

	};

	this.setDepthTest = function ( depthTest ) {

		if ( currentDepthTest !== depthTest ) {

			if ( depthTest ) {

				gl.enable( gl.DEPTH_TEST );

			} else {

				gl.disable( gl.DEPTH_TEST );

			}

			currentDepthTest = depthTest;

		}

	};

	this.setDepthWrite = function ( depthWrite ) {

		if ( currentDepthWrite !== depthWrite ) {

			gl.depthMask( depthWrite );
			currentDepthWrite = depthWrite;

		}

	};

	this.setColorWrite = function ( colorWrite ) {

		if ( currentColorWrite !== colorWrite ) {

			gl.colorMask( colorWrite, colorWrite, colorWrite, colorWrite );
			currentColorWrite = colorWrite;

		}

	};

	this.setDoubleSided = function ( doubleSided ) {

		if ( currentDoubleSided !== doubleSided ) {

			if ( doubleSided ) {

				gl.disable( gl.CULL_FACE );

			} else {

				gl.enable( gl.CULL_FACE );

			}

			currentDoubleSided = doubleSided;

		}

	};

	this.setFlipSided = function ( flipSided ) {

		if ( currentFlipSided !== flipSided ) {

			if ( flipSided ) {

				gl.frontFace( gl.CW );

			} else {

				gl.frontFace( gl.CCW );

			}

			currentFlipSided = flipSided;

		}

	};

	this.setLineWidth = function ( width ) {

		if ( width !== currentLineWidth ) {

			gl.lineWidth( width );

			currentLineWidth = width;

		}

	};

	this.setPolygonOffset = function ( polygonoffset, factor, units ) {

		if ( currentPolygonOffset !== polygonoffset ) {

			if ( polygonoffset ) {

				gl.enable( gl.POLYGON_OFFSET_FILL );

			} else {

				gl.disable( gl.POLYGON_OFFSET_FILL );

			}

			currentPolygonOffset = polygonoffset;

		}

		if ( polygonoffset && ( currentPolygonOffsetFactor !== factor || currentPolygonOffsetUnits !== units ) ) {

			gl.polygonOffset( factor, units );

			currentPolygonOffsetFactor = factor;
			currentPolygonOffsetUnits = units;

		}

	};

	// texture

	this.activeTexture = function ( webglSlot ) {

		if ( webglSlot === undefined ) webglSlot = gl.TEXTURE0 + maxTextures - 1;

		if ( currentTextureSlot !== webglSlot ) {

			gl.activeTexture( webglSlot );
			currentTextureSlot = webglSlot;

		}

	}

	this.bindTexture = function ( webglType, webglTexture ) {

		if ( currentTextureSlot === undefined ) {

			_this.activeTexture();

		}

		var boundTexture = currentBoundTextures[currentTextureSlot];

		if ( boundTexture === undefined ) {

			boundTexture = { type: undefined, texture: undefined };
			currentBoundTextures[currentTextureSlot] = boundTexture;

		}

		if ( boundTexture.type !== webglType || boundTexture.texture !== webglTexture ) {

			gl.bindTexture( webglType, webglTexture );

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;

		}

	};

	this.compressedTexImage2D = function () {

		try {

			gl.compressedTexImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	this.texImage2D = function () {

		try {

			gl.texImage2D.apply( gl, arguments );

		} catch ( error ) {

			console.error( error );

		}

	};

	//

	this.reset = function () {

		for ( var i = 0; i < enabledAttributes.length; i ++ ) {

			if ( enabledAttributes[ i ] === 1 ) {

				gl.disableVertexAttribArray( i );
				enabledAttributes[ i ] = 0;

			}

		}

		currentBlending = null;
		currentDepthTest = null;
		currentDepthWrite = null;
		currentColorWrite = null;
		currentDoubleSided = null;
		currentFlipSided = null;

	};

};

// File:src/renderers/webgl/plugins/LensFlarePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.LensFlarePlugin = function ( renderer, flares ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;
	var hasVertexTexture;

	var tempTexture, occlusionTexture;

	var init = function () {

		var vertices = new Float32Array( [
			-1, -1,  0, 0,
			 1, -1,  1, 0,
			 1,  1,  1, 1,
			-1,  1,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		// buffers

		vertexBuffer     = gl.createBuffer();
		elementBuffer    = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		// textures

		tempTexture      = gl.createTexture();
		occlusionTexture = gl.createTexture();

		renderer.state.bindTexture( gl.TEXTURE_2D, tempTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 16, 16, 0, gl.RGB, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		renderer.state.bindTexture( gl.TEXTURE_2D, occlusionTexture );
		gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, 16, 16, 0, gl.RGBA, gl.UNSIGNED_BYTE, null );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

		hasVertexTexture = gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) > 0;

		var shader;

		if ( hasVertexTexture ) {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"uniform sampler2D occlusionMap;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"vec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );",

							"vVisibility =        visibility.r / 9.0;",
							"vVisibility *= 1.0 - visibility.g / 9.0;",
							"vVisibility *=       visibility.b / 9.0;",
							"vVisibility *= 1.0 - visibility.a / 9.0;",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",
					"varying float vVisibility;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * vVisibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		} else {

			shader = {

				vertexShader: [

					"uniform lowp int renderType;",

					"uniform vec3 screenPosition;",
					"uniform vec2 scale;",
					"uniform float rotation;",

					"attribute vec2 position;",
					"attribute vec2 uv;",

					"varying vec2 vUV;",

					"void main() {",

						"vUV = uv;",

						"vec2 pos = position;",

						"if( renderType == 2 ) {",

							"pos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;",
							"pos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;",

						"}",

						"gl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );",

					"}"

				].join( "\n" ),

				fragmentShader: [

					"precision mediump float;",

					"uniform lowp int renderType;",

					"uniform sampler2D map;",
					"uniform sampler2D occlusionMap;",
					"uniform float opacity;",
					"uniform vec3 color;",

					"varying vec2 vUV;",

					"void main() {",

						// pink square

						"if( renderType == 0 ) {",

							"gl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );",

						// restore

						"} else if( renderType == 1 ) {",

							"gl_FragColor = texture2D( map, vUV );",

						// flare

						"} else {",

							"float visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;",
							"visibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;",
							"visibility = ( 1.0 - visibility / 4.0 );",

							"vec4 texture = texture2D( map, vUV );",
							"texture.a *= opacity * visibility;",
							"gl_FragColor = texture;",
							"gl_FragColor.rgb *= color;",

						"}",

					"}"

				].join( "\n" )

			};

		}

		program = createProgram( shader );

		attributes = {
			vertex: gl.getAttribLocation ( program, "position" ),
			uv:     gl.getAttribLocation ( program, "uv" )
		};

		uniforms = {
			renderType:     gl.getUniformLocation( program, "renderType" ),
			map:            gl.getUniformLocation( program, "map" ),
			occlusionMap:   gl.getUniformLocation( program, "occlusionMap" ),
			opacity:        gl.getUniformLocation( program, "opacity" ),
			color:          gl.getUniformLocation( program, "color" ),
			scale:          gl.getUniformLocation( program, "scale" ),
			rotation:       gl.getUniformLocation( program, "rotation" ),
			screenPosition: gl.getUniformLocation( program, "screenPosition" )
		};

	};

	/*
	 * Render lens flares
	 * Method: renders 16x16 0xff00ff-colored points scattered over the light source area,
	 *         reads these back and calculates occlusion.
	 */

	this.render = function ( scene, camera, viewportWidth, viewportHeight ) {

		if ( flares.length === 0 ) return;

		var tempPosition = new THREE.Vector3();

		var invAspect = viewportHeight / viewportWidth,
			halfViewportWidth = viewportWidth * 0.5,
			halfViewportHeight = viewportHeight * 0.5;

		var size = 16 / viewportHeight,
			scale = new THREE.Vector2( size * invAspect, size );

		var screenPosition = new THREE.Vector3( 1, 1, 0 ),
			screenPositionPixels = new THREE.Vector2( 1, 1 );

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		renderer.state.initAttributes();
		renderer.state.enableAttribute( attributes.vertex );
		renderer.state.enableAttribute( attributes.uv );
		renderer.state.disableUnusedAttributes();

		// loop through all lens flares to update their occlusion and positions
		// setup gl and common used attribs/unforms

		gl.uniform1i( uniforms.occlusionMap, 0 );
		gl.uniform1i( uniforms.map, 1 );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.vertex, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.disable( gl.CULL_FACE );
		gl.depthMask( false );

		for ( var i = 0, l = flares.length; i < l; i ++ ) {

			size = 16 / viewportHeight;
			scale.set( size * invAspect, size );

			// calc object screen position

			var flare = flares[ i ];

			tempPosition.set( flare.matrixWorld.elements[12], flare.matrixWorld.elements[13], flare.matrixWorld.elements[14] );

			tempPosition.applyMatrix4( camera.matrixWorldInverse );
			tempPosition.applyProjection( camera.projectionMatrix );

			// setup arrays for gl programs

			screenPosition.copy( tempPosition );

			screenPositionPixels.x = screenPosition.x * halfViewportWidth + halfViewportWidth;
			screenPositionPixels.y = screenPosition.y * halfViewportHeight + halfViewportHeight;

			// screen cull

			if ( hasVertexTexture || (
				screenPositionPixels.x > 0 &&
				screenPositionPixels.x < viewportWidth &&
				screenPositionPixels.y > 0 &&
				screenPositionPixels.y < viewportHeight ) ) {

				// save current RGB to temp texture

				renderer.state.activeTexture( gl.TEXTURE1 );
				renderer.state.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGB, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// render pink quad

				gl.uniform1i( uniforms.renderType, 0 );
				gl.uniform2f( uniforms.scale, scale.x, scale.y );
				gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );

				gl.disable( gl.BLEND );
				gl.enable( gl.DEPTH_TEST );

				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// copy result to occlusionMap

				renderer.state.activeTexture( gl.TEXTURE0 );
				renderer.state.bindTexture( gl.TEXTURE_2D, occlusionTexture );
				gl.copyTexImage2D( gl.TEXTURE_2D, 0, gl.RGBA, screenPositionPixels.x - 8, screenPositionPixels.y - 8, 16, 16, 0 );


				// restore graphics

				gl.uniform1i( uniforms.renderType, 1 );
				gl.disable( gl.DEPTH_TEST );

				renderer.state.activeTexture( gl.TEXTURE1 );
				renderer.state.bindTexture( gl.TEXTURE_2D, tempTexture );
				gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );


				// update object positions

				flare.positionScreen.copy( screenPosition );

				if ( flare.customUpdateCallback ) {

					flare.customUpdateCallback( flare );

				} else {

					flare.updateLensFlares();

				}

				// render flares

				gl.uniform1i( uniforms.renderType, 2 );
				gl.enable( gl.BLEND );

				for ( var j = 0, jl = flare.lensFlares.length; j < jl; j ++ ) {

					var sprite = flare.lensFlares[ j ];

					if ( sprite.opacity > 0.001 && sprite.scale > 0.001 ) {

						screenPosition.x = sprite.x;
						screenPosition.y = sprite.y;
						screenPosition.z = sprite.z;

						size = sprite.size * sprite.scale / viewportHeight;

						scale.x = size * invAspect;
						scale.y = size;

						gl.uniform3f( uniforms.screenPosition, screenPosition.x, screenPosition.y, screenPosition.z );
						gl.uniform2f( uniforms.scale, scale.x, scale.y );
						gl.uniform1f( uniforms.rotation, sprite.rotation );

						gl.uniform1f( uniforms.opacity, sprite.opacity );
						gl.uniform3f( uniforms.color, sprite.color.r, sprite.color.g, sprite.color.b );

						renderer.state.setBlending( sprite.blending, sprite.blendEquation, sprite.blendSrc, sprite.blendDst );
						renderer.setTexture( sprite.texture, 1 );

						gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

					}

				}

			}

		}

		// restore gl

		gl.enable( gl.CULL_FACE );
		gl.enable( gl.DEPTH_TEST );
		gl.depthMask( true );

		renderer.resetGLState();

	};

	function createProgram ( shader ) {

		var program = gl.createProgram();

		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );
		var vertexShader = gl.createShader( gl.VERTEX_SHADER );

		var prefix = "precision " + renderer.getPrecision() + " float;\n";

		gl.shaderSource( fragmentShader, prefix + shader.fragmentShader );
		gl.shaderSource( vertexShader, prefix + shader.vertexShader );

		gl.compileShader( fragmentShader );
		gl.compileShader( vertexShader );

		gl.attachShader( program, fragmentShader );
		gl.attachShader( program, vertexShader );

		gl.linkProgram( program );

		return program;

	}

};

// File:src/renderers/webgl/plugins/SpritePlugin.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SpritePlugin = function ( renderer, sprites ) {

	var gl = renderer.context;

	var vertexBuffer, elementBuffer;
	var program, attributes, uniforms;

	var texture;

	// decompose matrixWorld

	var spritePosition = new THREE.Vector3();
	var spriteRotation = new THREE.Quaternion();
	var spriteScale = new THREE.Vector3();

	var init = function () {

		var vertices = new Float32Array( [
			- 0.5, - 0.5,  0, 0,
			  0.5, - 0.5,  1, 0,
			  0.5,   0.5,  1, 1,
			- 0.5,   0.5,  0, 1
		] );

		var faces = new Uint16Array( [
			0, 1, 2,
			0, 2, 3
		] );

		vertexBuffer  = gl.createBuffer();
		elementBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, faces, gl.STATIC_DRAW );

		program = createProgram();

		attributes = {
			position:			gl.getAttribLocation ( program, 'position' ),
			uv:					gl.getAttribLocation ( program, 'uv' )
		};

		uniforms = {
			uvOffset:			gl.getUniformLocation( program, 'uvOffset' ),
			uvScale:			gl.getUniformLocation( program, 'uvScale' ),

			rotation:			gl.getUniformLocation( program, 'rotation' ),
			scale:				gl.getUniformLocation( program, 'scale' ),

			color:				gl.getUniformLocation( program, 'color' ),
			map:				gl.getUniformLocation( program, 'map' ),
			opacity:			gl.getUniformLocation( program, 'opacity' ),

			modelViewMatrix: 	gl.getUniformLocation( program, 'modelViewMatrix' ),
			projectionMatrix:	gl.getUniformLocation( program, 'projectionMatrix' ),

			fogType:			gl.getUniformLocation( program, 'fogType' ),
			fogDensity:			gl.getUniformLocation( program, 'fogDensity' ),
			fogNear:			gl.getUniformLocation( program, 'fogNear' ),
			fogFar:				gl.getUniformLocation( program, 'fogFar' ),
			fogColor:			gl.getUniformLocation( program, 'fogColor' ),

			alphaTest:			gl.getUniformLocation( program, 'alphaTest' )
		};

		var canvas = document.createElement( 'canvas' );
		canvas.width = 8;
		canvas.height = 8;

		var context = canvas.getContext( '2d' );
		context.fillStyle = 'white';
		context.fillRect( 0, 0, 8, 8 );

		texture = new THREE.Texture( canvas );
		texture.needsUpdate = true;

	};

	this.render = function ( scene, camera ) {

		if ( sprites.length === 0 ) return;

		// setup gl

		if ( program === undefined ) {

			init();

		}

		gl.useProgram( program );

		renderer.state.initAttributes();
		renderer.state.enableAttribute( attributes.position );
		renderer.state.enableAttribute( attributes.uv );
		renderer.state.disableUnusedAttributes();

		gl.disable( gl.CULL_FACE );
		gl.enable( gl.BLEND );

		gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		gl.vertexAttribPointer( attributes.position, 2, gl.FLOAT, false, 2 * 8, 0 );
		gl.vertexAttribPointer( attributes.uv, 2, gl.FLOAT, false, 2 * 8, 8 );

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elementBuffer );

		gl.uniformMatrix4fv( uniforms.projectionMatrix, false, camera.projectionMatrix.elements );

		renderer.state.activeTexture( gl.TEXTURE0 );
		gl.uniform1i( uniforms.map, 0 );

		var oldFogType = 0;
		var sceneFogType = 0;
		var fog = scene.fog;

		if ( fog ) {

			gl.uniform3f( uniforms.fogColor, fog.color.r, fog.color.g, fog.color.b );

			if ( fog instanceof THREE.Fog ) {

				gl.uniform1f( uniforms.fogNear, fog.near );
				gl.uniform1f( uniforms.fogFar, fog.far );

				gl.uniform1i( uniforms.fogType, 1 );
				oldFogType = 1;
				sceneFogType = 1;

			} else if ( fog instanceof THREE.FogExp2 ) {

				gl.uniform1f( uniforms.fogDensity, fog.density );

				gl.uniform1i( uniforms.fogType, 2 );
				oldFogType = 2;
				sceneFogType = 2;

			}

		} else {

			gl.uniform1i( uniforms.fogType, 0 );
			oldFogType = 0;
			sceneFogType = 0;

		}


		// update positions and sort

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];

			sprite._modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, sprite.matrixWorld );
			sprite.z = - sprite._modelViewMatrix.elements[ 14 ];

		}

		sprites.sort( painterSortStable );

		// render all sprites

		var scale = [];

		for ( var i = 0, l = sprites.length; i < l; i ++ ) {

			var sprite = sprites[ i ];
			var material = sprite.material;

			gl.uniform1f( uniforms.alphaTest, material.alphaTest );
			gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, sprite._modelViewMatrix.elements );

			sprite.matrixWorld.decompose( spritePosition, spriteRotation, spriteScale );

			scale[ 0 ] = spriteScale.x;
			scale[ 1 ] = spriteScale.y;

			var fogType = 0;

			if ( scene.fog && material.fog ) {

				fogType = sceneFogType;

			}

			if ( oldFogType !== fogType ) {

				gl.uniform1i( uniforms.fogType, fogType );
				oldFogType = fogType;

			}

			if ( material.map !== null ) {

				gl.uniform2f( uniforms.uvOffset, material.map.offset.x, material.map.offset.y );
				gl.uniform2f( uniforms.uvScale, material.map.repeat.x, material.map.repeat.y );

			} else {

				gl.uniform2f( uniforms.uvOffset, 0, 0 );
				gl.uniform2f( uniforms.uvScale, 1, 1 );

			}

			gl.uniform1f( uniforms.opacity, material.opacity );
			gl.uniform3f( uniforms.color, material.color.r, material.color.g, material.color.b );

			gl.uniform1f( uniforms.rotation, material.rotation );
			gl.uniform2fv( uniforms.scale, scale );

			renderer.state.setBlending( material.blending, material.blendEquation, material.blendSrc, material.blendDst );
			renderer.state.setDepthTest( material.depthTest );
			renderer.state.setDepthWrite( material.depthWrite );

			if ( material.map && material.map.image && material.map.image.width ) {

				renderer.setTexture( material.map, 0 );

			} else {

				renderer.setTexture( texture, 0 );

			}

			gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

		}

		// restore gl

		gl.enable( gl.CULL_FACE );

		renderer.resetGLState();

	};

	function createProgram () {

		var program = gl.createProgram();

		var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

		gl.shaderSource( vertexShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'uniform float rotation;',
			'uniform vec2 scale;',
			'uniform vec2 uvOffset;',
			'uniform vec2 uvScale;',

			'attribute vec2 position;',
			'attribute vec2 uv;',

			'varying vec2 vUV;',

			'void main() {',

				'vUV = uvOffset + uv * uvScale;',

				'vec2 alignedPosition = position * scale;',

				'vec2 rotatedPosition;',
				'rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;',
				'rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;',

				'vec4 finalPosition;',

				'finalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );',
				'finalPosition.xy += rotatedPosition;',
				'finalPosition = projectionMatrix * finalPosition;',

				'gl_Position = finalPosition;',

			'}'

		].join( '\n' ) );

		gl.shaderSource( fragmentShader, [

			'precision ' + renderer.getPrecision() + ' float;',

			'uniform vec3 color;',
			'uniform sampler2D map;',
			'uniform float opacity;',

			'uniform int fogType;',
			'uniform vec3 fogColor;',
			'uniform float fogDensity;',
			'uniform float fogNear;',
			'uniform float fogFar;',
			'uniform float alphaTest;',

			'varying vec2 vUV;',

			'void main() {',

				'vec4 texture = texture2D( map, vUV );',

				'if ( texture.a < alphaTest ) discard;',

				'gl_FragColor = vec4( color * texture.xyz, texture.a * opacity );',

				'if ( fogType > 0 ) {',

					'float depth = gl_FragCoord.z / gl_FragCoord.w;',
					'float fogFactor = 0.0;',

					'if ( fogType == 1 ) {',

						'fogFactor = smoothstep( fogNear, fogFar, depth );',

					'} else {',

						'const float LOG2 = 1.442695;',
						'fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );',
						'fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );',

					'}',

					'gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );',

				'}',

			'}'

		].join( '\n' ) );

		gl.compileShader( vertexShader );
		gl.compileShader( fragmentShader );

		gl.attachShader( program, vertexShader );
		gl.attachShader( program, fragmentShader );

		gl.linkProgram( program );

		return program;

	}

	function painterSortStable ( a, b ) {

		if ( a.z !== b.z ) {

			return b.z - a.z;

		} else {

			return b.id - a.id;

		}

	}

};

// File:src/extras/GeometryUtils.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.GeometryUtils = {

	merge: function ( geometry1, geometry2, materialIndexOffset ) {

		console.warn( 'THREE.GeometryUtils: .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.' );

		var matrix;

		if ( geometry2 instanceof THREE.Mesh ) {

			geometry2.matrixAutoUpdate && geometry2.updateMatrix();

			matrix = geometry2.matrix;
			geometry2 = geometry2.geometry;

		}

		geometry1.merge( geometry2, matrix, materialIndexOffset );

	},

	center: function ( geometry ) {

		console.warn( 'THREE.GeometryUtils: .center() has been moved to Geometry. Use geometry.center() instead.' );
		return geometry.center();

	}

};

// File:src/extras/ImageUtils.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author Daosheng Mu / https://github.com/DaoshengMu/
 */

THREE.ImageUtils = {

	crossOrigin: undefined,

	loadTexture: function ( url, mapping, onLoad, onError ) {

		var loader = new THREE.ImageLoader();
		loader.crossOrigin = this.crossOrigin;

		var texture = new THREE.Texture( undefined, mapping );

		loader.load( url, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

			if ( onLoad ) onLoad( texture );

		}, undefined, function ( event ) {

			if ( onError ) onError( event );

		} );

		texture.sourceFile = url;

		return texture;

	},

	loadTextureCube: function ( array, mapping, onLoad, onError ) {

		var images = [];

		var loader = new THREE.ImageLoader();
		loader.crossOrigin = this.crossOrigin;

		var texture = new THREE.CubeTexture( images, mapping );

		// no flipping needed for cube textures

		texture.flipY = false;

		var loaded = 0;

		var loadTexture = function ( i ) {

			loader.load( array[ i ], function ( image ) {

				texture.images[ i ] = image;

				loaded += 1;

				if ( loaded === 6 ) {

					texture.needsUpdate = true;

					if ( onLoad ) onLoad( texture );

				}

			}, undefined, onError );

		};

		for ( var i = 0, il = array.length; i < il; ++ i ) {

			loadTexture( i );

		}

		return texture;

	},

	loadCompressedTexture: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTexture has been removed. Use THREE.DDSLoader instead.' )

	},

	loadCompressedTextureCube: function () {

		console.error( 'THREE.ImageUtils.loadCompressedTextureCube has been removed. Use THREE.DDSLoader instead.' )

	},

	getNormalMap: function ( image, depth ) {

		// Adapted from http://www.paulbrunt.co.uk/lab/heightnormal/

		var cross = function ( a, b ) {

			return [ a[ 1 ] * b[ 2 ] - a[ 2 ] * b[ 1 ], a[ 2 ] * b[ 0 ] - a[ 0 ] * b[ 2 ], a[ 0 ] * b[ 1 ] - a[ 1 ] * b[ 0 ] ];

		};

		var subtract = function ( a, b ) {

			return [ a[ 0 ] - b[ 0 ], a[ 1 ] - b[ 1 ], a[ 2 ] - b[ 2 ] ];

		};

		var normalize = function ( a ) {

			var l = Math.sqrt( a[ 0 ] * a[ 0 ] + a[ 1 ] * a[ 1 ] + a[ 2 ] * a[ 2 ] );
			return [ a[ 0 ] / l, a[ 1 ] / l, a[ 2 ] / l ];

		};

		depth = depth | 1;

		var width = image.width;
		var height = image.height;

		var canvas = document.createElement( 'canvas' );
		canvas.width = width;
		canvas.height = height;

		var context = canvas.getContext( '2d' );
		context.drawImage( image, 0, 0 );

		var data = context.getImageData( 0, 0, width, height ).data;
		var imageData = context.createImageData( width, height );
		var output = imageData.data;

		for ( var x = 0; x < width; x ++ ) {

			for ( var y = 0; y < height; y ++ ) {

				var ly = y - 1 < 0 ? 0 : y - 1;
				var uy = y + 1 > height - 1 ? height - 1 : y + 1;
				var lx = x - 1 < 0 ? 0 : x - 1;
				var ux = x + 1 > width - 1 ? width - 1 : x + 1;

				var points = [];
				var origin = [ 0, 0, data[ ( y * width + x ) * 4 ] / 255 * depth ];
				points.push( [ - 1, 0, data[ ( y * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, - 1, data[ ( ly * width + lx ) * 4 ] / 255 * depth ] );
				points.push( [ 0, - 1, data[ ( ly * width + x ) * 4 ] / 255 * depth ] );
				points.push( [ 1, - 1, data[ ( ly * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 0, data[ ( y * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 1, 1, data[ ( uy * width + ux ) * 4 ] / 255 * depth ] );
				points.push( [ 0, 1, data[ ( uy * width + x ) * 4 ] / 255 * depth ] );
				points.push( [ - 1, 1, data[ ( uy * width + lx ) * 4 ] / 255 * depth ] );

				var normals = [];
				var num_points = points.length;

				for ( var i = 0; i < num_points; i ++ ) {

					var v1 = points[ i ];
					var v2 = points[ ( i + 1 ) % num_points ];
					v1 = subtract( v1, origin );
					v2 = subtract( v2, origin );
					normals.push( normalize( cross( v1, v2 ) ) );

				}

				var normal = [ 0, 0, 0 ];

				for ( var i = 0; i < normals.length; i ++ ) {

					normal[ 0 ] += normals[ i ][ 0 ];
					normal[ 1 ] += normals[ i ][ 1 ];
					normal[ 2 ] += normals[ i ][ 2 ];

				}

				normal[ 0 ] /= normals.length;
				normal[ 1 ] /= normals.length;
				normal[ 2 ] /= normals.length;

				var idx = ( y * width + x ) * 4;

				output[ idx ] = ( ( normal[ 0 ] + 1.0 ) / 2.0 * 255 ) | 0;
				output[ idx + 1 ] = ( ( normal[ 1 ] + 1.0 ) / 2.0 * 255 ) | 0;
				output[ idx + 2 ] = ( normal[ 2 ] * 255 ) | 0;
				output[ idx + 3 ] = 255;

			}

		}

		context.putImageData( imageData, 0, 0 );

		return canvas;

	},

	generateDataTexture: function ( width, height, color ) {

		var size = width * height;
		var data = new Uint8Array( 3 * size );

		var r = Math.floor( color.r * 255 );
		var g = Math.floor( color.g * 255 );
		var b = Math.floor( color.b * 255 );

		for ( var i = 0; i < size; i ++ ) {

			data[ i * 3 ] 	   = r;
			data[ i * 3 + 1 ] = g;
			data[ i * 3 + 2 ] = b;

		}

		var texture = new THREE.DataTexture( data, width, height, THREE.RGBFormat );
		texture.needsUpdate = true;

		return texture;

	}

};

// File:src/extras/SceneUtils.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneUtils = {

	createMultiMaterialObject: function ( geometry, materials ) {

		var group = new THREE.Object3D();

		for ( var i = 0, l = materials.length; i < l; i ++ ) {

			group.add( new THREE.Mesh( geometry, materials[ i ] ) );

		}

		return group;

	},

	detach: function ( child, parent, scene ) {

		child.applyMatrix( parent.matrixWorld );
		parent.remove( child );
		scene.add( child );

	},

	attach: function ( child, scene, parent ) {

		var matrixWorldInverse = new THREE.Matrix4();
		matrixWorldInverse.getInverse( parent.matrixWorld );
		child.applyMatrix( matrixWorldInverse );

		scene.remove( child );
		parent.add( child );

	}

};

// File:src/extras/FontUtils.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For Text operations in three.js (See TextGeometry)
 *
 * It uses techniques used in:
 *
 *	Triangulation ported from AS3
 *		Simple Polygon Triangulation
 *		http://actionsnippet.com/?p=1462
 *
 * 	A Method to triangulate shapes with holes
 *		http://www.sakri.net/blog/2009/06/12/an-approach-to-triangulating-polygons-with-holes/
 *
 */

THREE.FontUtils = {

	faces: {},

	// Just for now. face[weight][style]

	face: 'helvetiker',
	weight: 'normal',
	style: 'normal',
	size: 150,
	divisions: 10,

	getFace: function () {

		try {

			return this.faces[ this.face ][ this.weight ][ this.style ];

		} catch (e) {

			throw "The font " + this.face + " with " + this.weight + " weight and " + this.style + " style is missing."

		}

	},

	loadFace: function ( data ) {

		var family = data.familyName.toLowerCase();

		var ThreeFont = this;

		ThreeFont.faces[ family ] = ThreeFont.faces[ family ] || {};

		ThreeFont.faces[ family ][ data.cssFontWeight ] = ThreeFont.faces[ family ][ data.cssFontWeight ] || {};
		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		ThreeFont.faces[ family ][ data.cssFontWeight ][ data.cssFontStyle ] = data;

		return data;

	},

	drawText: function ( text ) {

		// RenderText

		var i,
			face = this.getFace(),
			scale = this.size / face.resolution,
			offset = 0,
			chars = String( text ).split( '' ),
			length = chars.length;

		var fontPaths = [];

		for ( i = 0; i < length; i ++ ) {

			var path = new THREE.Path();

			var ret = this.extractGlyphPoints( chars[ i ], face, scale, offset, path );
			offset += ret.offset;

			fontPaths.push( ret.path );

		}

		// get the width

		var width = offset / 2;
		//
		// for ( p = 0; p < allPts.length; p++ ) {
		//
		// 	allPts[ p ].x -= width;
		//
		// }

		//var extract = this.extractPoints( allPts, characterPts );
		//extract.contour = allPts;

		//extract.paths = fontPaths;
		//extract.offset = width;

		return { paths: fontPaths, offset: width };

	},




	extractGlyphPoints: function ( c, face, scale, offset, path ) {

		var pts = [];

		var i, i2, divisions,
			outline, action, length,
			scaleX, scaleY,
			x, y, cpx, cpy, cpx0, cpy0, cpx1, cpy1, cpx2, cpy2,
			laste,
			glyph = face.glyphs[ c ] || face.glyphs[ '?' ];

		if ( ! glyph ) return;

		if ( glyph.o ) {

			outline = glyph._cachedOutline || ( glyph._cachedOutline = glyph.o.split( ' ' ) );
			length = outline.length;

			scaleX = scale;
			scaleY = scale;

			for ( i = 0; i < length; ) {

				action = outline[ i ++ ];

				//console.log( action );

				switch ( action ) {

				case 'm':

					// Move To

					x = outline[ i ++ ] * scaleX + offset;
					y = outline[ i ++ ] * scaleY;

					path.moveTo( x, y );
					break;

				case 'l':

					// Line To

					x = outline[ i ++ ] * scaleX + offset;
					y = outline[ i ++ ] * scaleY;
					path.lineTo( x, y );
					break;

				case 'q':

					// QuadraticCurveTo

					cpx  = outline[ i ++ ] * scaleX + offset;
					cpy  = outline[ i ++ ] * scaleY;
					cpx1 = outline[ i ++ ] * scaleX + offset;
					cpy1 = outline[ i ++ ] * scaleY;

					path.quadraticCurveTo( cpx1, cpy1, cpx, cpy );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
							THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );
						}

					}

					break;

				case 'b':

					// Cubic Bezier Curve

					cpx  = outline[ i ++ ] *  scaleX + offset;
					cpy  = outline[ i ++ ] *  scaleY;
					cpx1 = outline[ i ++ ] *  scaleX + offset;
					cpy1 = outline[ i ++ ] *  scaleY;
					cpx2 = outline[ i ++ ] *  scaleX + offset;
					cpy2 = outline[ i ++ ] *  scaleY;

					path.bezierCurveTo( cpx1, cpy1, cpx2, cpy2, cpx, cpy );

					laste = pts[ pts.length - 1 ];

					if ( laste ) {

						cpx0 = laste.x;
						cpy0 = laste.y;

						for ( i2 = 1, divisions = this.divisions; i2 <= divisions; i2 ++ ) {

							var t = i2 / divisions;
							THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
							THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

						}

					}

					break;

				}

			}
		}



		return { offset: glyph.ha * scale, path:path };
	}

};


THREE.FontUtils.generateShapes = function ( text, parameters ) {

	// Parameters

	parameters = parameters || {};

	var size = parameters.size !== undefined ? parameters.size : 100;
	var curveSegments = parameters.curveSegments !== undefined ? parameters.curveSegments : 4;

	var font = parameters.font !== undefined ? parameters.font : 'helvetiker';
	var weight = parameters.weight !== undefined ? parameters.weight : 'normal';
	var style = parameters.style !== undefined ? parameters.style : 'normal';

	THREE.FontUtils.size = size;
	THREE.FontUtils.divisions = curveSegments;

	THREE.FontUtils.face = font;
	THREE.FontUtils.weight = weight;
	THREE.FontUtils.style = style;

	// Get a Font data json object

	var data = THREE.FontUtils.drawText( text );

	var paths = data.paths;
	var shapes = [];

	for ( var p = 0, pl = paths.length; p < pl; p ++ ) {

		Array.prototype.push.apply( shapes, paths[ p ].toShapes() );

	}

	return shapes;

};


/**
 * This code is a quick port of code written in C++ which was submitted to
 * flipcode.com by John W. Ratcliff  // July 22, 2000
 * See original code and more information here:
 * http://www.flipcode.com/archives/Efficient_Polygon_Triangulation.shtml
 *
 * ported to actionscript by Zevan Rosser
 * www.actionsnippet.com
 *
 * ported to javascript by Joshua Koo
 * http://www.lab4games.net/zz85/blog
 *
 */


( function ( namespace ) {

	var EPSILON = 0.0000000001;

	// takes in an contour array and returns

	var process = function ( contour, indices ) {

		var n = contour.length;

		if ( n < 3 ) return null;

		var result = [],
			verts = [],
			vertIndices = [];

		/* we want a counter-clockwise polygon in verts */

		var u, v, w;

		if ( area( contour ) > 0.0 ) {

			for ( v = 0; v < n; v ++ ) verts[ v ] = v;

		} else {

			for ( v = 0; v < n; v ++ ) verts[ v ] = ( n - 1 ) - v;

		}

		var nv = n;

		/*  remove nv - 2 vertices, creating 1 triangle every time */

		var count = 2 * nv;   /* error detection */

		for ( v = nv - 1; nv > 2; ) {

			/* if we loop, it is probably a non-simple polygon */

			if ( ( count -- ) <= 0 ) {

				//** Triangulate: ERROR - probable bad polygon!

				//throw ( "Warning, unable to triangulate polygon!" );
				//return null;
				// Sometimes warning is fine, especially polygons are triangulated in reverse.
				console.warn( 'THREE.FontUtils: Warning, unable to triangulate polygon! in Triangulate.process()' );

				if ( indices ) return vertIndices;
				return result;

			}

			/* three consecutive vertices in current polygon, <u,v,w> */

			u = v; 	 	if ( nv <= u ) u = 0;     /* previous */
			v = u + 1;  if ( nv <= v ) v = 0;     /* new v    */
			w = v + 1;  if ( nv <= w ) w = 0;     /* next     */

			if ( snip( contour, u, v, w, nv, verts ) ) {

				var a, b, c, s, t;

				/* true names of the vertices */

				a = verts[ u ];
				b = verts[ v ];
				c = verts[ w ];

				/* output Triangle */

				result.push( [ contour[ a ],
					contour[ b ],
					contour[ c ] ] );


				vertIndices.push( [ verts[ u ], verts[ v ], verts[ w ] ] );

				/* remove v from the remaining polygon */

				for ( s = v, t = v + 1; t < nv; s ++, t ++ ) {

					verts[ s ] = verts[ t ];

				}

				nv --;

				/* reset error detection counter */

				count = 2 * nv;

			}

		}

		if ( indices ) return vertIndices;
		return result;

	};

	// calculate area of the contour polygon

	var area = function ( contour ) {

		var n = contour.length;
		var a = 0.0;

		for ( var p = n - 1, q = 0; q < n; p = q ++ ) {

			a += contour[ p ].x * contour[ q ].y - contour[ q ].x * contour[ p ].y;

		}

		return a * 0.5;

	};

	var snip = function ( contour, u, v, w, n, verts ) {

		var p;
		var ax, ay, bx, by;
		var cx, cy, px, py;

		ax = contour[ verts[ u ] ].x;
		ay = contour[ verts[ u ] ].y;

		bx = contour[ verts[ v ] ].x;
		by = contour[ verts[ v ] ].y;

		cx = contour[ verts[ w ] ].x;
		cy = contour[ verts[ w ] ].y;

		if ( EPSILON > ( ( ( bx - ax ) * ( cy - ay ) ) - ( ( by - ay ) * ( cx - ax ) ) ) ) return false;

		var aX, aY, bX, bY, cX, cY;
		var apx, apy, bpx, bpy, cpx, cpy;
		var cCROSSap, bCROSScp, aCROSSbp;

		aX = cx - bx;  aY = cy - by;
		bX = ax - cx;  bY = ay - cy;
		cX = bx - ax;  cY = by - ay;

		for ( p = 0; p < n; p ++ ) {

			px = contour[ verts[ p ] ].x;
			py = contour[ verts[ p ] ].y;

			if ( ( ( px === ax ) && ( py === ay ) ) ||
				 ( ( px === bx ) && ( py === by ) ) ||
				 ( ( px === cx ) && ( py === cy ) ) )	continue;

			apx = px - ax;  apy = py - ay;
			bpx = px - bx;  bpy = py - by;
			cpx = px - cx;  cpy = py - cy;

			// see if p is inside triangle abc

			aCROSSbp = aX * bpy - aY * bpx;
			cCROSSap = cX * apy - cY * apx;
			bCROSScp = bX * cpy - bY * cpx;

			if ( ( aCROSSbp >= - EPSILON ) && ( bCROSScp >= - EPSILON ) && ( cCROSSap >= - EPSILON ) ) return false;

		}

		return true;

	};


	namespace.Triangulate = process;
	namespace.Triangulate.area = area;

	return namespace;

} )( THREE.FontUtils );

// To use the typeface.js face files, hook up the API

THREE.typeface_js = { faces: THREE.FontUtils.faces, loadFace: THREE.FontUtils.loadFace };
if ( typeof self !== 'undefined' ) self._typeface_js = THREE.typeface_js;

// File:src/extras/audio/Audio.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Audio = function ( listener ) {

	THREE.Object3D.call( this );

	this.type = 'Audio';

	this.context = listener.context;
	this.source = this.context.createBufferSource();
	this.source.onended = this.onEnded.bind(this);

	this.gain = this.context.createGain();
	this.gain.connect( this.context.destination );

	this.panner = this.context.createPanner();
	this.panner.connect( this.gain );

	this.autoplay = false;

	this.startTime = 0;
	this.isPlaying = false;

};

THREE.Audio.prototype = Object.create( THREE.Object3D.prototype );
THREE.Audio.prototype.constructor = THREE.Audio;

THREE.Audio.prototype.load = function ( file ) {

	var scope = this;

	var request = new XMLHttpRequest();
	request.open( 'GET', file, true );
	request.responseType = 'arraybuffer';
	request.onload = function ( e ) {

		scope.context.decodeAudioData( this.response, function ( buffer ) {

			scope.source.buffer = buffer;

			if( scope.autoplay ) scope.play();

		} );

	};
	request.send();

	return this;

};

THREE.Audio.prototype.play = function () {

	if ( this.isPlaying === true ) {

		console.warn( 'THREE.Audio: Audio is already playing.' );
		return;

	}

	var source = this.context.createBufferSource();

	source.buffer = this.source.buffer;
	source.loop = this.source.loop;
	source.onended = this.source.onended;
	source.connect( this.panner );
	source.start( 0, this.startTime );

	this.isPlaying = true;

	this.source = source;

};

THREE.Audio.prototype.pause = function () {

	this.source.stop();
	this.startTime = this.context.currentTime;

};

THREE.Audio.prototype.stop = function () {

	this.source.stop();
	this.startTime = 0;

};

THREE.Audio.prototype.onEnded = function() {

	this.isPlaying = false;

};

THREE.Audio.prototype.setLoop = function ( value ) {

	this.source.loop = value;

};

THREE.Audio.prototype.setRefDistance = function ( value ) {

	this.panner.refDistance = value;

};

THREE.Audio.prototype.setRolloffFactor = function ( value ) {

	this.panner.rolloffFactor = value;

};

THREE.Audio.prototype.setVolume = function ( value ) {

	this.gain.gain.value = value;

};

THREE.Audio.prototype.updateMatrixWorld = ( function () {

	var position = new THREE.Vector3();

	return function ( force ) {

		THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

		position.setFromMatrixPosition( this.matrixWorld );

		this.panner.setPosition( position.x, position.y, position.z );

	};

} )();

// File:src/extras/audio/AudioListener.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AudioListener = function () {

	THREE.Object3D.call( this );

	this.type = 'AudioListener';

	this.context = new ( window.AudioContext
        || window.webkitAudioContext
        || window.mozAudioContext )();

};

THREE.AudioListener.prototype = Object.create( THREE.Object3D.prototype );
THREE.AudioListener.prototype.constructor = THREE.AudioListener;

THREE.AudioListener.prototype.updateMatrixWorld = ( function () {

	var position = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var scale = new THREE.Vector3();

	var orientation = new THREE.Vector3();

	return function ( force ) {

		THREE.Object3D.prototype.updateMatrixWorld.call( this, force );

		var listener = this.context.listener;
		var up = this.up;

		this.matrixWorld.decompose( position, quaternion, scale );

		orientation.set( 0, 0, -1 ).applyQuaternion( quaternion );

		listener.setPosition( position.x, position.y, position.z );
		listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

	};

} )();

// File:src/extras/core/Curve.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Extensible curve object
 *
 * Some common of Curve methods
 * .getPoint(t), getTangent(t)
 * .getPointAt(u), getTagentAt(u)
 * .getPoints(), .getSpacedPoints()
 * .getLength()
 * .updateArcLengths()
 *
 * This following classes subclasses THREE.Curve:
 *
 * -- 2d classes --
 * THREE.LineCurve
 * THREE.QuadraticBezierCurve
 * THREE.CubicBezierCurve
 * THREE.SplineCurve
 * THREE.ArcCurve
 * THREE.EllipseCurve
 *
 * -- 3d classes --
 * THREE.LineCurve3
 * THREE.QuadraticBezierCurve3
 * THREE.CubicBezierCurve3
 * THREE.SplineCurve3
 * THREE.ClosedSplineCurve3
 *
 * A series of curves can be represented as a THREE.CurvePath
 *
 **/

/**************************************************************
 *	Abstract Curve base class
 **************************************************************/

THREE.Curve = function () {

};

// Virtual base class method to overwrite and implement in subclasses
//	- t [0 .. 1]

THREE.Curve.prototype.getPoint = function ( t ) {

	console.warn( "THREE.Curve: Warning, getPoint() not implemented!" );
	return null;

};

// Get point at relative position in curve according to arc length
// - u [0 .. 1]

THREE.Curve.prototype.getPointAt = function ( u ) {

	var t = this.getUtoTmapping( u );
	return this.getPoint( t );

};

// Get sequence of points using getPoint( t )

THREE.Curve.prototype.getPoints = function ( divisions ) {

	if ( ! divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPoint( d / divisions ) );

	}

	return pts;

};

// Get sequence of points using getPointAt( u )

THREE.Curve.prototype.getSpacedPoints = function ( divisions ) {

	if ( ! divisions ) divisions = 5;

	var d, pts = [];

	for ( d = 0; d <= divisions; d ++ ) {

		pts.push( this.getPointAt( d / divisions ) );

	}

	return pts;

};

// Get total curve arc length

THREE.Curve.prototype.getLength = function () {

	var lengths = this.getLengths();
	return lengths[ lengths.length - 1 ];

};

// Get list of cumulative segment lengths

THREE.Curve.prototype.getLengths = function ( divisions ) {

	if ( ! divisions ) divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;

	if ( this.cacheArcLengths
		&& ( this.cacheArcLengths.length === divisions + 1 )
		&& ! this.needsUpdate) {

		//console.log( "cached", this.cacheArcLengths );
		return this.cacheArcLengths;

	}

	this.needsUpdate = false;

	var cache = [];
	var current, last = this.getPoint( 0 );
	var p, sum = 0;

	cache.push( 0 );

	for ( p = 1; p <= divisions; p ++ ) {

		current = this.getPoint ( p / divisions );
		sum += current.distanceTo( last );
		cache.push( sum );
		last = current;

	}

	this.cacheArcLengths = cache;

	return cache; // { sums: cache, sum:sum }; Sum is in the last element.

};


THREE.Curve.prototype.updateArcLengths = function() {
	this.needsUpdate = true;
	this.getLengths();
};

// Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equi distance

THREE.Curve.prototype.getUtoTmapping = function ( u, distance ) {

	var arcLengths = this.getLengths();

	var i = 0, il = arcLengths.length;

	var targetArcLength; // The targeted u distance value to get

	if ( distance ) {

		targetArcLength = distance;

	} else {

		targetArcLength = u * arcLengths[ il - 1 ];

	}

	//var time = Date.now();

	// binary search for the index with largest value smaller than target u distance

	var low = 0, high = il - 1, comparison;

	while ( low <= high ) {

		i = Math.floor( low + ( high - low ) / 2 ); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

		comparison = arcLengths[ i ] - targetArcLength;

		if ( comparison < 0 ) {

			low = i + 1;

		} else if ( comparison > 0 ) {

			high = i - 1;

		} else {

			high = i;
			break;

			// DONE

		}

	}

	i = high;

	//console.log('b' , i, low, high, Date.now()- time);

	if ( arcLengths[ i ] === targetArcLength ) {

		var t = i / ( il - 1 );
		return t;

	}

	// we could get finer grain at lengths, or use simple interpolatation between two points

	var lengthBefore = arcLengths[ i ];
	var lengthAfter = arcLengths[ i + 1 ];

	var segmentLength = lengthAfter - lengthBefore;

    // determine where we are between the 'before' and 'after' points

	var segmentFraction = ( targetArcLength - lengthBefore ) / segmentLength;

    // add that fractional amount to t

	var t = ( i + segmentFraction ) / ( il - 1 );

	return t;

};

// Returns a unit vector tangent at t
// In case any sub curve does not implement its tangent derivation,
// 2 points a small delta apart will be used to find its gradient
// which seems to give a reasonable approximation

THREE.Curve.prototype.getTangent = function( t ) {

	var delta = 0.0001;
	var t1 = t - delta;
	var t2 = t + delta;

	// Capping in case of danger

	if ( t1 < 0 ) t1 = 0;
	if ( t2 > 1 ) t2 = 1;

	var pt1 = this.getPoint( t1 );
	var pt2 = this.getPoint( t2 );

	var vec = pt2.clone().sub(pt1);
	return vec.normalize();

};


THREE.Curve.prototype.getTangentAt = function ( u ) {

	var t = this.getUtoTmapping( u );
	return this.getTangent( t );

};





/**************************************************************
 *	Utils
 **************************************************************/

THREE.Curve.Utils = {

	tangentQuadraticBezier: function ( t, p0, p1, p2 ) {

		return 2 * ( 1 - t ) * ( p1 - p0 ) + 2 * t * ( p2 - p1 );

	},

	// Puay Bing, thanks for helping with this derivative!

	tangentCubicBezier: function (t, p0, p1, p2, p3 ) {

		return - 3 * p0 * (1 - t) * (1 - t)  +
			3 * p1 * (1 - t) * (1 - t) - 6 * t * p1 * (1 - t) +
			6 * t *  p2 * (1 - t) - 3 * t * t * p2 +
			3 * t * t * p3;

	},

	tangentSpline: function ( t, p0, p1, p2, p3 ) {

		// To check if my formulas are correct

		var h00 = 6 * t * t - 6 * t; 	// derived from 2t^3 − 3t^2 + 1
		var h10 = 3 * t * t - 4 * t + 1; // t^3 − 2t^2 + t
		var h01 = - 6 * t * t + 6 * t; 	// − 2t3 + 3t2
		var h11 = 3 * t * t - 2 * t;	// t3 − t2

		return h00 + h10 + h01 + h11;

	},

	// Catmull-Rom

	interpolate: function( p0, p1, p2, p3, t ) {

		var v0 = ( p2 - p0 ) * 0.5;
		var v1 = ( p3 - p1 ) * 0.5;
		var t2 = t * t;
		var t3 = t * t2;
		return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

	}

};


// TODO: Transformation for Curves?

/**************************************************************
 *	3D Curves
 **************************************************************/

// A Factory method for creating new curve subclasses

THREE.Curve.create = function ( constructor, getPointFunc ) {

	constructor.prototype = Object.create( THREE.Curve.prototype );
	constructor.prototype.constructor = constructor;
	constructor.prototype.getPoint = getPointFunc;

	return constructor;

};

// File:src/extras/core/CurvePath.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 **/

/**************************************************************
 *	Curved Path - a curve path is simply a array of connected
 *  curves, but retains the api of a curve
 **************************************************************/

THREE.CurvePath = function () {

	this.curves = [];
	this.bends = [];

	this.autoClose = false; // Automatically closes the path
};

THREE.CurvePath.prototype = Object.create( THREE.Curve.prototype );
THREE.CurvePath.prototype.constructor = THREE.CurvePath;

THREE.CurvePath.prototype.add = function ( curve ) {

	this.curves.push( curve );

};

THREE.CurvePath.prototype.checkConnection = function() {
	// TODO
	// If the ending of curve is not connected to the starting
	// or the next curve, then, this is not a real path
};

THREE.CurvePath.prototype.closePath = function() {
	// TODO Test
	// and verify for vector3 (needs to implement equals)
	// Add a line curve if start and end of lines are not connected
	var startPoint = this.curves[0].getPoint(0);
	var endPoint = this.curves[this.curves.length - 1].getPoint(1);

	if (! startPoint.equals(endPoint)) {
		this.curves.push( new THREE.LineCurve(endPoint, startPoint) );
	}

};

// To get accurate point with reference to
// entire path distance at time t,
// following has to be done:

// 1. Length of each sub path have to be known
// 2. Locate and identify type of curve
// 3. Get t for the curve
// 4. Return curve.getPointAt(t')

THREE.CurvePath.prototype.getPoint = function( t ) {

	var d = t * this.getLength();
	var curveLengths = this.getCurveLengths();
	var i = 0, diff, curve;

	// To think about boundaries points.

	while ( i < curveLengths.length ) {

		if ( curveLengths[ i ] >= d ) {

			diff = curveLengths[ i ] - d;
			curve = this.curves[ i ];

			var u = 1 - diff / curve.getLength();

			return curve.getPointAt( u );

		}

		i ++;

	}

	return null;

	// loop where sum != 0, sum > d , sum+1 <d

};

/*
THREE.CurvePath.prototype.getTangent = function( t ) {
};*/


// We cannot use the default THREE.Curve getPoint() with getLength() because in
// THREE.Curve, getLength() depends on getPoint() but in THREE.CurvePath
// getPoint() depends on getLength

THREE.CurvePath.prototype.getLength = function() {

	var lens = this.getCurveLengths();
	return lens[ lens.length - 1 ];

};

// Compute lengths and cache them
// We cannot overwrite getLengths() because UtoT mapping uses it.

THREE.CurvePath.prototype.getCurveLengths = function() {

	// We use cache values if curves and cache array are same length

	if ( this.cacheLengths && this.cacheLengths.length === this.curves.length ) {

		return this.cacheLengths;

	}

	// Get length of subsurve
	// Push sums into cached array

	var lengths = [], sums = 0;
	var i, il = this.curves.length;

	for ( i = 0; i < il; i ++ ) {

		sums += this.curves[ i ].getLength();
		lengths.push( sums );

	}

	this.cacheLengths = lengths;

	return lengths;

};



// Returns min and max coordinates

THREE.CurvePath.prototype.getBoundingBox = function () {

	var points = this.getPoints();

	var maxX, maxY, maxZ;
	var minX, minY, minZ;

	maxX = maxY = Number.NEGATIVE_INFINITY;
	minX = minY = Number.POSITIVE_INFINITY;

	var p, i, il, sum;

	var v3 = points[0] instanceof THREE.Vector3;

	sum = v3 ? new THREE.Vector3() : new THREE.Vector2();

	for ( i = 0, il = points.length; i < il; i ++ ) {

		p = points[ i ];

		if ( p.x > maxX ) maxX = p.x;
		else if ( p.x < minX ) minX = p.x;

		if ( p.y > maxY ) maxY = p.y;
		else if ( p.y < minY ) minY = p.y;

		if ( v3 ) {

			if ( p.z > maxZ ) maxZ = p.z;
			else if ( p.z < minZ ) minZ = p.z;

		}

		sum.add( p );

	}

	var ret = {

		minX: minX,
		minY: minY,
		maxX: maxX,
		maxY: maxY

	};

	if ( v3 ) {

		ret.maxZ = maxZ;
		ret.minZ = minZ;

	}

	return ret;

};

/**************************************************************
 *	Create Geometries Helpers
 **************************************************************/

/// Generate geometry from path points (for Line or Points objects)

THREE.CurvePath.prototype.createPointsGeometry = function( divisions ) {

	var pts = this.getPoints( divisions, true );
	return this.createGeometry( pts );

};

// Generate geometry from equidistance sampling along the path

THREE.CurvePath.prototype.createSpacedPointsGeometry = function( divisions ) {

	var pts = this.getSpacedPoints( divisions, true );
	return this.createGeometry( pts );

};

THREE.CurvePath.prototype.createGeometry = function( points ) {

	var geometry = new THREE.Geometry();

	for ( var i = 0; i < points.length; i ++ ) {

		geometry.vertices.push( new THREE.Vector3( points[ i ].x, points[ i ].y, points[ i ].z || 0) );

	}

	return geometry;

};


/**************************************************************
 *	Bend / Wrap Helper Methods
 **************************************************************/

// Wrap path / Bend modifiers?

THREE.CurvePath.prototype.addWrapPath = function ( bendpath ) {

	this.bends.push( bendpath );

};

THREE.CurvePath.prototype.getTransformedPoints = function( segments, bends ) {

	var oldPts = this.getPoints( segments ); // getPoints getSpacedPoints
	var i, il;

	if ( ! bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

THREE.CurvePath.prototype.getTransformedSpacedPoints = function( segments, bends ) {

	var oldPts = this.getSpacedPoints( segments );

	var i, il;

	if ( ! bends ) {

		bends = this.bends;

	}

	for ( i = 0, il = bends.length; i < il; i ++ ) {

		oldPts = this.getWrapPoints( oldPts, bends[ i ] );

	}

	return oldPts;

};

// This returns getPoints() bend/wrapped around the contour of a path.
// Read http://www.planetclegg.com/projects/WarpingTextToSplines.html

THREE.CurvePath.prototype.getWrapPoints = function ( oldPts, path ) {

	var bounds = this.getBoundingBox();

	var i, il, p, oldX, oldY, xNorm;

	for ( i = 0, il = oldPts.length; i < il; i ++ ) {

		p = oldPts[ i ];

		oldX = p.x;
		oldY = p.y;

		xNorm = oldX / bounds.maxX;

		// If using actual distance, for length > path, requires line extrusions
		//xNorm = path.getUtoTmapping(xNorm, oldX); // 3 styles. 1) wrap stretched. 2) wrap stretch by arc length 3) warp by actual distance

		xNorm = path.getUtoTmapping( xNorm, oldX );

		// check for out of bounds?

		var pathPt = path.getPoint( xNorm );
		var normal = path.getTangent( xNorm );
		normal.set( - normal.y, normal.x ).multiplyScalar( oldY );

		p.x = pathPt.x + normal.x;
		p.y = pathPt.y + normal.y;

	}

	return oldPts;

};

// File:src/extras/core/Gyroscope.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Gyroscope = function () {

	THREE.Object3D.call( this );

};

THREE.Gyroscope.prototype = Object.create( THREE.Object3D.prototype );
THREE.Gyroscope.prototype.constructor = THREE.Gyroscope;

THREE.Gyroscope.prototype.updateMatrixWorld = ( function () {

	var translationObject = new THREE.Vector3();
	var quaternionObject = new THREE.Quaternion();
	var scaleObject = new THREE.Vector3();

	var translationWorld = new THREE.Vector3();
	var quaternionWorld = new THREE.Quaternion();
	var scaleWorld = new THREE.Vector3();

	return function ( force ) {

		this.matrixAutoUpdate && this.updateMatrix();

		// update matrixWorld

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent ) {

				this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );

				this.matrixWorld.decompose( translationWorld, quaternionWorld, scaleWorld );
				this.matrix.decompose( translationObject, quaternionObject, scaleObject );

				this.matrixWorld.compose( translationWorld, quaternionObject, scaleWorld );


			} else {

				this.matrixWorld.copy( this.matrix );

			}


			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	};
	
}() );

// File:src/extras/core/Path.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 *
 **/

THREE.Path = function ( points ) {

	THREE.CurvePath.call(this);

	this.actions = [];

	if ( points ) {

		this.fromPoints( points );

	}

};

THREE.Path.prototype = Object.create( THREE.CurvePath.prototype );
THREE.Path.prototype.constructor = THREE.Path;

THREE.PathActions = {

	MOVE_TO: 'moveTo',
	LINE_TO: 'lineTo',
	QUADRATIC_CURVE_TO: 'quadraticCurveTo', // Bezier quadratic curve
	BEZIER_CURVE_TO: 'bezierCurveTo', 		// Bezier cubic curve
	CSPLINE_THRU: 'splineThru',				// Catmull-rom spline
	ARC: 'arc',								// Circle
	ELLIPSE: 'ellipse'
};

// TODO Clean up PATH API

// Create path using straight lines to connect all points
// - vectors: array of Vector2

THREE.Path.prototype.fromPoints = function ( vectors ) {

	this.moveTo( vectors[ 0 ].x, vectors[ 0 ].y );

	for ( var v = 1, vlen = vectors.length; v < vlen; v ++ ) {

		this.lineTo( vectors[ v ].x, vectors[ v ].y );

	}

};

// startPath() endPath()?

THREE.Path.prototype.moveTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );
	this.actions.push( { action: THREE.PathActions.MOVE_TO, args: args } );

};

THREE.Path.prototype.lineTo = function ( x, y ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.LineCurve( new THREE.Vector2( x0, y0 ), new THREE.Vector2( x, y ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.LINE_TO, args: args } );

};

THREE.Path.prototype.quadraticCurveTo = function( aCPx, aCPy, aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.QuadraticBezierCurve( new THREE.Vector2( x0, y0 ),
												new THREE.Vector2( aCPx, aCPy ),
												new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.QUADRATIC_CURVE_TO, args: args } );

};

THREE.Path.prototype.bezierCurveTo = function( aCP1x, aCP1y,
											   aCP2x, aCP2y,
											   aX, aY ) {

	var args = Array.prototype.slice.call( arguments );

	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	var curve = new THREE.CubicBezierCurve( new THREE.Vector2( x0, y0 ),
											new THREE.Vector2( aCP1x, aCP1y ),
											new THREE.Vector2( aCP2x, aCP2y ),
											new THREE.Vector2( aX, aY ) );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.BEZIER_CURVE_TO, args: args } );

};

THREE.Path.prototype.splineThru = function( pts /*Array of Vector*/ ) {

	var args = Array.prototype.slice.call( arguments );
	var lastargs = this.actions[ this.actions.length - 1 ].args;

	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];
//---
	var npts = [ new THREE.Vector2( x0, y0 ) ];
	Array.prototype.push.apply( npts, pts );

	var curve = new THREE.SplineCurve( npts );
	this.curves.push( curve );

	this.actions.push( { action: THREE.PathActions.CSPLINE_THRU, args: args } );

};

// FUTURE: Change the API or follow canvas API?

THREE.Path.prototype.arc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var lastargs = this.actions[ this.actions.length - 1].args;
	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	this.absarc(aX + x0, aY + y0, aRadius,
		aStartAngle, aEndAngle, aClockwise );

 };

 THREE.Path.prototype.absarc = function ( aX, aY, aRadius,
									  aStartAngle, aEndAngle, aClockwise ) {
	this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
 };

THREE.Path.prototype.ellipse = function ( aX, aY, xRadius, yRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var lastargs = this.actions[ this.actions.length - 1].args;
	var x0 = lastargs[ lastargs.length - 2 ];
	var y0 = lastargs[ lastargs.length - 1 ];

	this.absellipse(aX + x0, aY + y0, xRadius, yRadius,
		aStartAngle, aEndAngle, aClockwise );

 };


THREE.Path.prototype.absellipse = function ( aX, aY, xRadius, yRadius,
									  aStartAngle, aEndAngle, aClockwise ) {

	var args = Array.prototype.slice.call( arguments );
	var curve = new THREE.EllipseCurve( aX, aY, xRadius, yRadius,
									aStartAngle, aEndAngle, aClockwise );
	this.curves.push( curve );

	var lastPoint = curve.getPoint(1);
	args.push(lastPoint.x);
	args.push(lastPoint.y);

	this.actions.push( { action: THREE.PathActions.ELLIPSE, args: args } );

 };

THREE.Path.prototype.getSpacedPoints = function ( divisions, closedPath ) {

	if ( ! divisions ) divisions = 40;

	var points = [];

	for ( var i = 0; i < divisions; i ++ ) {

		points.push( this.getPoint( i / divisions ) );

		//if( !this.getPoint( i / divisions ) ) throw "DIE";

	}

	// if ( closedPath ) {
	//
	// 	points.push( points[ 0 ] );
	//
	// }

	return points;

};

/* Return an array of vectors based on contour of the path */

THREE.Path.prototype.getPoints = function( divisions, closedPath ) {

	if (this.useSpacedPoints) {
		console.log('tata');
		return this.getSpacedPoints( divisions, closedPath );
	}

	divisions = divisions || 12;

	var points = [];

	var i, il, item, action, args;
	var cpx, cpy, cpx2, cpy2, cpx1, cpy1, cpx0, cpy0,
		laste, j,
		t, tx, ty;

	for ( i = 0, il = this.actions.length; i < il; i ++ ) {

		item = this.actions[ i ];

		action = item.action;
		args = item.args;

		switch ( action ) {

		case THREE.PathActions.MOVE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.LINE_TO:

			points.push( new THREE.Vector2( args[ 0 ], args[ 1 ] ) );

			break;

		case THREE.PathActions.QUADRATIC_CURVE_TO:

			cpx  = args[ 2 ];
			cpy  = args[ 3 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}

			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b2( t, cpx0, cpx1, cpx );
				ty = THREE.Shape.Utils.b2( t, cpy0, cpy1, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.BEZIER_CURVE_TO:

			cpx  = args[ 4 ];
			cpy  = args[ 5 ];

			cpx1 = args[ 0 ];
			cpy1 = args[ 1 ];

			cpx2 = args[ 2 ];
			cpy2 = args[ 3 ];

			if ( points.length > 0 ) {

				laste = points[ points.length - 1 ];

				cpx0 = laste.x;
				cpy0 = laste.y;

			} else {

				laste = this.actions[ i - 1 ].args;

				cpx0 = laste[ laste.length - 2 ];
				cpy0 = laste[ laste.length - 1 ];

			}


			for ( j = 1; j <= divisions; j ++ ) {

				t = j / divisions;

				tx = THREE.Shape.Utils.b3( t, cpx0, cpx1, cpx2, cpx );
				ty = THREE.Shape.Utils.b3( t, cpy0, cpy1, cpy2, cpy );

				points.push( new THREE.Vector2( tx, ty ) );

			}

			break;

		case THREE.PathActions.CSPLINE_THRU:

			laste = this.actions[ i - 1 ].args;

			var last = new THREE.Vector2( laste[ laste.length - 2 ], laste[ laste.length - 1 ] );
			var spts = [ last ];

			var n = divisions * args[ 0 ].length;

			spts = spts.concat( args[ 0 ] );

			var spline = new THREE.SplineCurve( spts );

			for ( j = 1; j <= n; j ++ ) {

				points.push( spline.getPointAt( j / n ) ) ;

			}

			break;

		case THREE.PathActions.ARC:

			var aX = args[ 0 ], aY = args[ 1 ],
				aRadius = args[ 2 ],
				aStartAngle = args[ 3 ], aEndAngle = args[ 4 ],
				aClockwise = !! args[ 5 ];

			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( ! aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = aX + aRadius * Math.cos( angle );
				ty = aY + aRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

			break;

		case THREE.PathActions.ELLIPSE:

			var aX = args[ 0 ], aY = args[ 1 ],
				xRadius = args[ 2 ],
				yRadius = args[ 3 ],
				aStartAngle = args[ 4 ], aEndAngle = args[ 5 ],
				aClockwise = !! args[ 6 ];


			var deltaAngle = aEndAngle - aStartAngle;
			var angle;
			var tdivisions = divisions * 2;

			for ( j = 1; j <= tdivisions; j ++ ) {

				t = j / tdivisions;

				if ( ! aClockwise ) {

					t = 1 - t;

				}

				angle = aStartAngle + t * deltaAngle;

				tx = aX + xRadius * Math.cos( angle );
				ty = aY + yRadius * Math.sin( angle );

				//console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);

				points.push( new THREE.Vector2( tx, ty ) );

			}

			//console.log(points);

			break;

		} // end switch

	}



	// Normalize to remove the closing point by default.
	var lastPoint = points[ points.length - 1];
	var EPSILON = 0.0000000001;
	if ( Math.abs(lastPoint.x - points[ 0 ].x) < EPSILON &&
			 Math.abs(lastPoint.y - points[ 0 ].y) < EPSILON)
		points.splice( points.length - 1, 1);
	if ( closedPath ) {

		points.push( points[ 0 ] );

	}

	return points;

};

//
// Breaks path into shapes
//
//	Assumptions (if parameter isCCW==true the opposite holds):
//	- solid shapes are defined clockwise (CW)
//	- holes are defined counterclockwise (CCW)
//
//	If parameter noHoles==true:
//  - all subPaths are regarded as solid shapes
//  - definition order CW/CCW has no relevance
//

THREE.Path.prototype.toShapes = function( isCCW, noHoles ) {

	function extractSubpaths( inActions ) {

		var i, il, item, action, args;

		var subPaths = [], lastPath = new THREE.Path();

		for ( i = 0, il = inActions.length; i < il; i ++ ) {

			item = inActions[ i ];

			args = item.args;
			action = item.action;

			if ( action === THREE.PathActions.MOVE_TO ) {

				if ( lastPath.actions.length !== 0 ) {

					subPaths.push( lastPath );
					lastPath = new THREE.Path();

				}

			}

			lastPath[ action ].apply( lastPath, args );

		}

		if ( lastPath.actions.length !== 0 ) {

			subPaths.push( lastPath );

		}

		// console.log(subPaths);

		return	subPaths;
	}

	function toShapesNoHoles( inSubpaths ) {

		var shapes = [];

		for ( var i = 0, il = inSubpaths.length; i < il; i ++ ) {

			var tmpPath = inSubpaths[ i ];

			var tmpShape = new THREE.Shape();
			tmpShape.actions = tmpPath.actions;
			tmpShape.curves = tmpPath.curves;

			shapes.push( tmpShape );
		}

		//console.log("shape", shapes);

		return shapes;
	}

	function isPointInsidePolygon( inPt, inPolygon ) {
		var EPSILON = 0.0000000001;

		var polyLen = inPolygon.length;

		// inPt on polygon contour => immediate success    or
		// toggling of inside/outside at every single! intersection point of an edge
		//  with the horizontal line through inPt, left of inPt
		//  not counting lowerY endpoints of edges and whole edges on that line
		var inside = false;
		for ( var p = polyLen - 1, q = 0; q < polyLen; p = q ++ ) {
			var edgeLowPt  = inPolygon[ p ];
			var edgeHighPt = inPolygon[ q ];

			var edgeDx = edgeHighPt.x - edgeLowPt.x;
			var edgeDy = edgeHighPt.y - edgeLowPt.y;

			if ( Math.abs(edgeDy) > EPSILON ) {			// not parallel
				if ( edgeDy < 0 ) {
					edgeLowPt  = inPolygon[ q ]; edgeDx = - edgeDx;
					edgeHighPt = inPolygon[ p ]; edgeDy = - edgeDy;
				}
				if ( ( inPt.y < edgeLowPt.y ) || ( inPt.y > edgeHighPt.y ) ) 		continue;

				if ( inPt.y === edgeLowPt.y ) {
					if ( inPt.x === edgeLowPt.x )		return	true;		// inPt is on contour ?
					// continue;				// no intersection or edgeLowPt => doesn't count !!!
				} else {
					var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
					if ( perpEdge === 0 )				return	true;		// inPt is on contour ?
					if ( perpEdge < 0 ) 				continue;
					inside = ! inside;		// true intersection left of inPt
				}
			} else {		// parallel or colinear
				if ( inPt.y !== edgeLowPt.y ) 		continue;			// parallel
				// egde lies on the same horizontal line as inPt
				if ( ( ( edgeHighPt.x <= inPt.x ) && ( inPt.x <= edgeLowPt.x ) ) ||
					 ( ( edgeLowPt.x <= inPt.x ) && ( inPt.x <= edgeHighPt.x ) ) )		return	true;	// inPt: Point on contour !
				// continue;
			}
		}

		return	inside;
	}


	var subPaths = extractSubpaths( this.actions );
	if ( subPaths.length === 0 ) return [];

	if ( noHoles === true )	return	toShapesNoHoles( subPaths );


	var solid, tmpPath, tmpShape, shapes = [];

	if ( subPaths.length === 1) {

		tmpPath = subPaths[0];
		tmpShape = new THREE.Shape();
		tmpShape.actions = tmpPath.actions;
		tmpShape.curves = tmpPath.curves;
		shapes.push( tmpShape );
		return shapes;

	}

	var holesFirst = ! THREE.Shape.Utils.isClockWise( subPaths[ 0 ].getPoints() );
	holesFirst = isCCW ? ! holesFirst : holesFirst;

	// console.log("Holes first", holesFirst);

	var betterShapeHoles = [];
	var newShapes = [];
	var newShapeHoles = [];
	var mainIdx = 0;
	var tmpPoints;

	newShapes[mainIdx] = undefined;
	newShapeHoles[mainIdx] = [];

	var i, il;

	for ( i = 0, il = subPaths.length; i < il; i ++ ) {

		tmpPath = subPaths[ i ];
		tmpPoints = tmpPath.getPoints();
		solid = THREE.Shape.Utils.isClockWise( tmpPoints );
		solid = isCCW ? ! solid : solid;

		if ( solid ) {

			if ( (! holesFirst ) && ( newShapes[mainIdx] ) )	mainIdx ++;

			newShapes[mainIdx] = { s: new THREE.Shape(), p: tmpPoints };
			newShapes[mainIdx].s.actions = tmpPath.actions;
			newShapes[mainIdx].s.curves = tmpPath.curves;

			if ( holesFirst )	mainIdx ++;
			newShapeHoles[mainIdx] = [];

			//console.log('cw', i);

		} else {

			newShapeHoles[mainIdx].push( { h: tmpPath, p: tmpPoints[0] } );

			//console.log('ccw', i);

		}

	}

	// only Holes? -> probably all Shapes with wrong orientation
	if ( ! newShapes[0] )	return	toShapesNoHoles( subPaths );


	if ( newShapes.length > 1 ) {
		var ambigious = false;
		var toChange = [];

		for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {
			betterShapeHoles[sIdx] = [];
		}
		for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx ++ ) {
			var sho = newShapeHoles[sIdx];
			for (var hIdx = 0; hIdx < sho.length; hIdx ++ ) {
				var ho = sho[hIdx];
				var hole_unassigned = true;
				for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx ++ ) {
					if ( isPointInsidePolygon( ho.p, newShapes[s2Idx].p ) ) {
						if ( sIdx !== s2Idx )	toChange.push( { froms: sIdx, tos: s2Idx, hole: hIdx } );
						if ( hole_unassigned ) {
							hole_unassigned = false;
							betterShapeHoles[s2Idx].push( ho );
						} else {
							ambigious = true;
						}
					}
				}
				if ( hole_unassigned ) { betterShapeHoles[sIdx].push( ho ); }
			}
		}
		// console.log("ambigious: ", ambigious);
		if ( toChange.length > 0 ) {
			// console.log("to change: ", toChange);
			if (! ambigious)	newShapeHoles = betterShapeHoles;
		}
	}

	var tmpHoles, j, jl;
	for ( i = 0, il = newShapes.length; i < il; i ++ ) {
		tmpShape = newShapes[i].s;
		shapes.push( tmpShape );
		tmpHoles = newShapeHoles[i];
		for ( j = 0, jl = tmpHoles.length; j < jl; j ++ ) {
			tmpShape.holes.push( tmpHoles[j].h );
		}
	}

	//console.log("shape", shapes);

	return shapes;

};

// File:src/extras/core/Shape.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

THREE.Shape = function () {

	THREE.Path.apply( this, arguments );
	this.holes = [];

};

THREE.Shape.prototype = Object.create( THREE.Path.prototype );
THREE.Shape.prototype.constructor = THREE.Shape;

// Convenience method to return ExtrudeGeometry

THREE.Shape.prototype.extrude = function ( options ) {

	var extruded = new THREE.ExtrudeGeometry( this, options );
	return extruded;

};

// Convenience method to return ShapeGeometry

THREE.Shape.prototype.makeGeometry = function ( options ) {

	var geometry = new THREE.ShapeGeometry( this, options );
	return geometry;

};

// Get points of holes

THREE.Shape.prototype.getPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedPoints( divisions, this.bends );

	}

	return holesPts;

};

// Get points of holes (spaced by regular distance)

THREE.Shape.prototype.getSpacedPointsHoles = function ( divisions ) {

	var i, il = this.holes.length, holesPts = [];

	for ( i = 0; i < il; i ++ ) {

		holesPts[ i ] = this.holes[ i ].getTransformedSpacedPoints( divisions, this.bends );

	}

	return holesPts;

};


// Get points of shape and holes (keypoints based on segments parameter)

THREE.Shape.prototype.extractAllPoints = function ( divisions ) {

	return {

		shape: this.getTransformedPoints( divisions ),
		holes: this.getPointsHoles( divisions )

	};

};

THREE.Shape.prototype.extractPoints = function ( divisions ) {

	if (this.useSpacedPoints) {
		return this.extractAllSpacedPoints(divisions);
	}

	return this.extractAllPoints(divisions);

};

//
// THREE.Shape.prototype.extractAllPointsWithBend = function ( divisions, bend ) {
//
// 	return {
//
// 		shape: this.transform( bend, divisions ),
// 		holes: this.getPointsHoles( divisions, bend )
//
// 	};
//
// };

// Get points of shape and holes (spaced by regular distance)

THREE.Shape.prototype.extractAllSpacedPoints = function ( divisions ) {

	return {

		shape: this.getTransformedSpacedPoints( divisions ),
		holes: this.getSpacedPointsHoles( divisions )

	};

};

/**************************************************************
 *	Utils
 **************************************************************/

THREE.Shape.Utils = {

	triangulateShape: function ( contour, holes ) {

		function point_in_segment_2D_colin( inSegPt1, inSegPt2, inOtherPt ) {
			// inOtherPt needs to be colinear to the inSegment
			if ( inSegPt1.x !== inSegPt2.x ) {
				if ( inSegPt1.x < inSegPt2.x ) {
					return	( ( inSegPt1.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt2.x ) );
				} else {
					return	( ( inSegPt2.x <= inOtherPt.x ) && ( inOtherPt.x <= inSegPt1.x ) );
				}
			} else {
				if ( inSegPt1.y < inSegPt2.y ) {
					return	( ( inSegPt1.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt2.y ) );
				} else {
					return	( ( inSegPt2.y <= inOtherPt.y ) && ( inOtherPt.y <= inSegPt1.y ) );
				}
			}
		}

		function intersect_segments_2D( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs ) {
			var EPSILON = 0.0000000001;

			var seg1dx = inSeg1Pt2.x - inSeg1Pt1.x,   seg1dy = inSeg1Pt2.y - inSeg1Pt1.y;
			var seg2dx = inSeg2Pt2.x - inSeg2Pt1.x,   seg2dy = inSeg2Pt2.y - inSeg2Pt1.y;

			var seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x;
			var seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y;

			var limit		= seg1dy * seg2dx - seg1dx * seg2dy;
			var perpSeg1	= seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;

			if ( Math.abs(limit) > EPSILON ) {			// not parallel

				var perpSeg2;
				if ( limit > 0 ) {
					if ( ( perpSeg1 < 0 ) || ( perpSeg1 > limit ) ) 		return [];
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 < 0 ) || ( perpSeg2 > limit ) ) 		return [];
				} else {
					if ( ( perpSeg1 > 0 ) || ( perpSeg1 < limit ) ) 		return [];
					perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
					if ( ( perpSeg2 > 0 ) || ( perpSeg2 < limit ) ) 		return [];
				}

				// i.e. to reduce rounding errors
				// intersection at endpoint of segment#1?
				if ( perpSeg2 === 0 ) {
					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 === 0 ) || ( perpSeg1 === limit ) ) )		return [];
					return [ inSeg1Pt1 ];
				}
				if ( perpSeg2 === limit ) {
					if ( ( inExcludeAdjacentSegs ) &&
						 ( ( perpSeg1 === 0 ) || ( perpSeg1 === limit ) ) )		return [];
					return [ inSeg1Pt2 ];
				}
				// intersection at endpoint of segment#2?
				if ( perpSeg1 === 0 )		return [ inSeg2Pt1 ];
				if ( perpSeg1 === limit )	return [ inSeg2Pt2 ];

				// return real intersection point
				var factorSeg1 = perpSeg2 / limit;
				return	[ { x: inSeg1Pt1.x + factorSeg1 * seg1dx,
							y: inSeg1Pt1.y + factorSeg1 * seg1dy } ];

			} else {		// parallel or colinear
				if ( ( perpSeg1 !== 0 ) ||
					 ( seg2dy * seg1seg2dx !== seg2dx * seg1seg2dy ) ) 			return [];

				// they are collinear or degenerate
				var seg1Pt = ( (seg1dx === 0) && (seg1dy === 0) );	// segment1 ist just a point?
				var seg2Pt = ( (seg2dx === 0) && (seg2dy === 0) );	// segment2 ist just a point?
				// both segments are points
				if ( seg1Pt && seg2Pt ) {
					if ( (inSeg1Pt1.x !== inSeg2Pt1.x) ||
						 (inSeg1Pt1.y !== inSeg2Pt1.y) )		return [];	// they are distinct  points
					return [ inSeg1Pt1 ];                 						// they are the same point
				}
				// segment#1  is a single point
				if ( seg1Pt ) {
					if (! point_in_segment_2D_colin( inSeg2Pt1, inSeg2Pt2, inSeg1Pt1 ) )		return [];		// but not in segment#2
					return [ inSeg1Pt1 ];
				}
				// segment#2  is a single point
				if ( seg2Pt ) {
					if (! point_in_segment_2D_colin( inSeg1Pt1, inSeg1Pt2, inSeg2Pt1 ) )		return [];		// but not in segment#1
					return [ inSeg2Pt1 ];
				}

				// they are collinear segments, which might overlap
				var seg1min, seg1max, seg1minVal, seg1maxVal;
				var seg2min, seg2max, seg2minVal, seg2maxVal;
				if (seg1dx !== 0) {		// the segments are NOT on a vertical line
					if ( inSeg1Pt1.x < inSeg1Pt2.x ) {
						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.x;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.x;
					} else {
						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.x;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.x;
					}
					if ( inSeg2Pt1.x < inSeg2Pt2.x ) {
						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.x;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.x;
					} else {
						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.x;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.x;
					}
				} else {				// the segments are on a vertical line
					if ( inSeg1Pt1.y < inSeg1Pt2.y ) {
						seg1min = inSeg1Pt1; seg1minVal = inSeg1Pt1.y;
						seg1max = inSeg1Pt2; seg1maxVal = inSeg1Pt2.y;
					} else {
						seg1min = inSeg1Pt2; seg1minVal = inSeg1Pt2.y;
						seg1max = inSeg1Pt1; seg1maxVal = inSeg1Pt1.y;
					}
					if ( inSeg2Pt1.y < inSeg2Pt2.y ) {
						seg2min = inSeg2Pt1; seg2minVal = inSeg2Pt1.y;
						seg2max = inSeg2Pt2; seg2maxVal = inSeg2Pt2.y;
					} else {
						seg2min = inSeg2Pt2; seg2minVal = inSeg2Pt2.y;
						seg2max = inSeg2Pt1; seg2maxVal = inSeg2Pt1.y;
					}
				}
				if ( seg1minVal <= seg2minVal ) {
					if ( seg1maxVal <  seg2minVal )	return [];
					if ( seg1maxVal === seg2minVal )	{
						if ( inExcludeAdjacentSegs )		return [];
						return [ seg2min ];
					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg2min, seg1max ];
					return	[ seg2min, seg2max ];
				} else {
					if ( seg1minVal >  seg2maxVal )	return [];
					if ( seg1minVal === seg2maxVal )	{
						if ( inExcludeAdjacentSegs )		return [];
						return [ seg1min ];
					}
					if ( seg1maxVal <= seg2maxVal )	return [ seg1min, seg1max ];
					return	[ seg1min, seg2max ];
				}
			}
		}

		function isPointInsideAngle( inVertex, inLegFromPt, inLegToPt, inOtherPt ) {
			// The order of legs is important

			var EPSILON = 0.0000000001;

			// translation of all points, so that Vertex is at (0,0)
			var legFromPtX	= inLegFromPt.x - inVertex.x,  legFromPtY	= inLegFromPt.y - inVertex.y;
			var legToPtX	= inLegToPt.x	- inVertex.x,  legToPtY		= inLegToPt.y	- inVertex.y;
			var otherPtX	= inOtherPt.x	- inVertex.x,  otherPtY		= inOtherPt.y	- inVertex.y;

			// main angle >0: < 180 deg.; 0: 180 deg.; <0: > 180 deg.
			var from2toAngle	= legFromPtX * legToPtY - legFromPtY * legToPtX;
			var from2otherAngle	= legFromPtX * otherPtY - legFromPtY * otherPtX;

			if ( Math.abs(from2toAngle) > EPSILON ) {			// angle != 180 deg.

				var other2toAngle		= otherPtX * legToPtY - otherPtY * legToPtX;
				// console.log( "from2to: " + from2toAngle + ", from2other: " + from2otherAngle + ", other2to: " + other2toAngle );

				if ( from2toAngle > 0 ) {				// main angle < 180 deg.
					return	( ( from2otherAngle >= 0 ) && ( other2toAngle >= 0 ) );
				} else {								// main angle > 180 deg.
					return	( ( from2otherAngle >= 0 ) || ( other2toAngle >= 0 ) );
				}
			} else {										// angle == 180 deg.
				// console.log( "from2to: 180 deg., from2other: " + from2otherAngle  );
				return	( from2otherAngle > 0 );
			}
		}


		function removeHoles( contour, holes ) {

			var shape = contour.concat(); // work on this shape
			var hole;

			function isCutLineInsideAngles( inShapeIdx, inHoleIdx ) {
				// Check if hole point lies within angle around shape point
				var lastShapeIdx = shape.length - 1;

				var prevShapeIdx = inShapeIdx - 1;
				if ( prevShapeIdx < 0 )			prevShapeIdx = lastShapeIdx;

				var nextShapeIdx = inShapeIdx + 1;
				if ( nextShapeIdx > lastShapeIdx )	nextShapeIdx = 0;

				var insideAngle = isPointInsideAngle( shape[inShapeIdx], shape[ prevShapeIdx ], shape[ nextShapeIdx ], hole[inHoleIdx] );
				if (! insideAngle ) {
					// console.log( "Vertex (Shape): " + inShapeIdx + ", Point: " + hole[inHoleIdx].x + "/" + hole[inHoleIdx].y );
					return	false;
				}

				// Check if shape point lies within angle around hole point
				var lastHoleIdx = hole.length - 1;

				var prevHoleIdx = inHoleIdx - 1;
				if ( prevHoleIdx < 0 )			prevHoleIdx = lastHoleIdx;

				var nextHoleIdx = inHoleIdx + 1;
				if ( nextHoleIdx > lastHoleIdx )	nextHoleIdx = 0;

				insideAngle = isPointInsideAngle( hole[inHoleIdx], hole[ prevHoleIdx ], hole[ nextHoleIdx ], shape[inShapeIdx] );
				if (! insideAngle ) {
					// console.log( "Vertex (Hole): " + inHoleIdx + ", Point: " + shape[inShapeIdx].x + "/" + shape[inShapeIdx].y );
					return	false;
				}

				return	true;
			}

			function intersectsShapeEdge( inShapePt, inHolePt ) {
				// checks for intersections with shape edges
				var sIdx, nextIdx, intersection;
				for ( sIdx = 0; sIdx < shape.length; sIdx ++ ) {
					nextIdx = sIdx + 1; nextIdx %= shape.length;
					intersection = intersect_segments_2D( inShapePt, inHolePt, shape[sIdx], shape[nextIdx], true );
					if ( intersection.length > 0 )		return	true;
				}

				return	false;
			}

			var indepHoles = [];

			function intersectsHoleEdge( inShapePt, inHolePt ) {
				// checks for intersections with hole edges
				var ihIdx, chkHole,
					hIdx, nextIdx, intersection;
				for ( ihIdx = 0; ihIdx < indepHoles.length; ihIdx ++ ) {
					chkHole = holes[indepHoles[ihIdx]];
					for ( hIdx = 0; hIdx < chkHole.length; hIdx ++ ) {
						nextIdx = hIdx + 1; nextIdx %= chkHole.length;
						intersection = intersect_segments_2D( inShapePt, inHolePt, chkHole[hIdx], chkHole[nextIdx], true );
						if ( intersection.length > 0 )		return	true;
					}
				}
				return	false;
			}

			var holeIndex, shapeIndex,
				shapePt, holePt,
				holeIdx, cutKey, failedCuts = [],
				tmpShape1, tmpShape2,
				tmpHole1, tmpHole2;

			for ( var h = 0, hl = holes.length; h < hl; h ++ ) {

				indepHoles.push( h );

			}

			var minShapeIndex = 0;
			var counter = indepHoles.length * 2;
			while ( indepHoles.length > 0 ) {
				counter --;
				if ( counter < 0 ) {
					console.log( "Infinite Loop! Holes left:" + indepHoles.length + ", Probably Hole outside Shape!" );
					break;
				}

				// search for shape-vertex and hole-vertex,
				// which can be connected without intersections
				for ( shapeIndex = minShapeIndex; shapeIndex < shape.length; shapeIndex ++ ) {

					shapePt = shape[ shapeIndex ];
					holeIndex	= - 1;

					// search for hole which can be reached without intersections
					for ( var h = 0; h < indepHoles.length; h ++ ) {
						holeIdx = indepHoles[h];

						// prevent multiple checks
						cutKey = shapePt.x + ":" + shapePt.y + ":" + holeIdx;
						if ( failedCuts[cutKey] !== undefined )			continue;

						hole = holes[holeIdx];
						for ( var h2 = 0; h2 < hole.length; h2 ++ ) {
							holePt = hole[ h2 ];
							if (! isCutLineInsideAngles( shapeIndex, h2 ) )		continue;
							if ( intersectsShapeEdge( shapePt, holePt ) )		continue;
							if ( intersectsHoleEdge( shapePt, holePt ) )		continue;

							holeIndex = h2;
							indepHoles.splice(h, 1);

							tmpShape1 = shape.slice( 0, shapeIndex + 1 );
							tmpShape2 = shape.slice( shapeIndex );
							tmpHole1 = hole.slice( holeIndex );
							tmpHole2 = hole.slice( 0, holeIndex + 1 );

							shape = tmpShape1.concat( tmpHole1 ).concat( tmpHole2 ).concat( tmpShape2 );

							minShapeIndex = shapeIndex;

							// Debug only, to show the selected cuts
							// glob_CutLines.push( [ shapePt, holePt ] );

							break;
						}
						if ( holeIndex >= 0 )	break;		// hole-vertex found

						failedCuts[cutKey] = true;			// remember failure
					}
					if ( holeIndex >= 0 )	break;		// hole-vertex found
				}
			}

			return shape; 			/* shape with no holes */
		}


		var i, il, f, face,
			key, index,
			allPointsMap = {};

		// To maintain reference to old shape, one must match coordinates, or offset the indices from original arrays. It's probably easier to do the first.

		var allpoints = contour.concat();

		for ( var h = 0, hl = holes.length; h < hl; h ++ ) {

			Array.prototype.push.apply( allpoints, holes[h] );

		}

		//console.log( "allpoints",allpoints, allpoints.length );

		// prepare all points map

		for ( i = 0, il = allpoints.length; i < il; i ++ ) {

			key = allpoints[ i ].x + ":" + allpoints[ i ].y;

			if ( allPointsMap[ key ] !== undefined ) {

				console.warn( "THREE.Shape: Duplicate point", key );

			}

			allPointsMap[ key ] = i;

		}

		// remove holes by cutting paths to holes and adding them to the shape
		var shapeWithoutHoles = removeHoles( contour, holes );

		var triangles = THREE.FontUtils.Triangulate( shapeWithoutHoles, false ); // True returns indices for points of spooled shape
		//console.log( "triangles",triangles, triangles.length );

		// check all face vertices against all points map

		for ( i = 0, il = triangles.length; i < il; i ++ ) {

			face = triangles[ i ];

			for ( f = 0; f < 3; f ++ ) {

				key = face[ f ].x + ":" + face[ f ].y;

				index = allPointsMap[ key ];

				if ( index !== undefined ) {

					face[ f ] = index;

				}

			}

		}

		return triangles.concat();

	},

	isClockWise: function ( pts ) {

		return THREE.FontUtils.Triangulate.area( pts ) < 0;

	},

	// Bezier Curves formulas obtained from
	// http://en.wikipedia.org/wiki/B%C3%A9zier_curve

	// Quad Bezier Functions

	b2p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * p;

	},

	b2p1: function ( t, p ) {

		return 2 * ( 1 - t ) * t * p;

	},

	b2p2: function ( t, p ) {

		return t * t * p;

	},

	b2: function ( t, p0, p1, p2 ) {

		return this.b2p0( t, p0 ) + this.b2p1( t, p1 ) + this.b2p2( t, p2 );

	},

	// Cubic Bezier Functions

	b3p0: function ( t, p ) {

		var k = 1 - t;
		return k * k * k * p;

	},

	b3p1: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * k * t * p;

	},

	b3p2: function ( t, p ) {

		var k = 1 - t;
		return 3 * k * t * t * p;

	},

	b3p3: function ( t, p ) {

		return t * t * t * p;

	},

	b3: function ( t, p0, p1, p2, p3 ) {

		return this.b3p0( t, p0 ) + this.b3p1( t, p1 ) + this.b3p2( t, p2 ) +  this.b3p3( t, p3 );

	}

};

// File:src/extras/curves/LineCurve.js

/**************************************************************
 *	Line
 **************************************************************/

THREE.LineCurve = function ( v1, v2 ) {

	this.v1 = v1;
	this.v2 = v2;

};

THREE.LineCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.LineCurve.prototype.constructor = THREE.LineCurve;

THREE.LineCurve.prototype.getPoint = function ( t ) {

	var point = this.v2.clone().sub(this.v1);
	point.multiplyScalar( t ).add( this.v1 );

	return point;

};

// Line curve is linear, so we can overwrite default getPointAt

THREE.LineCurve.prototype.getPointAt = function ( u ) {

	return this.getPoint( u );

};

THREE.LineCurve.prototype.getTangent = function( t ) {

	var tangent = this.v2.clone().sub(this.v1);

	return tangent.normalize();

};

// File:src/extras/curves/QuadraticBezierCurve.js

/**************************************************************
 *	Quadratic Bezier curve
 **************************************************************/


THREE.QuadraticBezierCurve = function ( v0, v1, v2 ) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

};

THREE.QuadraticBezierCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.QuadraticBezierCurve.prototype.constructor = THREE.QuadraticBezierCurve;


THREE.QuadraticBezierCurve.prototype.getPoint = function ( t ) {

	var vector = new THREE.Vector2();

	vector.x = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
	vector.y = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );

	return vector;

};


THREE.QuadraticBezierCurve.prototype.getTangent = function( t ) {

	var vector = new THREE.Vector2();

	vector.x = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.x, this.v1.x, this.v2.x );
	vector.y = THREE.Curve.Utils.tangentQuadraticBezier( t, this.v0.y, this.v1.y, this.v2.y );

	// returns unit vector

	return vector.normalize();

};

// File:src/extras/curves/CubicBezierCurve.js

/**************************************************************
 *	Cubic Bezier curve
 **************************************************************/

THREE.CubicBezierCurve = function ( v0, v1, v2, v3 ) {

	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;
	this.v3 = v3;

};

THREE.CubicBezierCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.CubicBezierCurve.prototype.constructor = THREE.CubicBezierCurve;

THREE.CubicBezierCurve.prototype.getPoint = function ( t ) {

	var tx, ty;

	tx = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	return new THREE.Vector2( tx, ty );

};

THREE.CubicBezierCurve.prototype.getTangent = function( t ) {

	var tx, ty;

	tx = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
	ty = THREE.Curve.Utils.tangentCubicBezier( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );

	var tangent = new THREE.Vector2( tx, ty );
	tangent.normalize();

	return tangent;

};

// File:src/extras/curves/SplineCurve.js

/**************************************************************
 *	Spline curve
 **************************************************************/

THREE.SplineCurve = function ( points /* array of Vector2 */ ) {

	this.points = ( points == undefined ) ? [] : points;

};

THREE.SplineCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.SplineCurve.prototype.constructor = THREE.SplineCurve;

THREE.SplineCurve.prototype.getPoint = function ( t ) {

	var points = this.points;
	var point = ( points.length - 1 ) * t;

	var intPoint = Math.floor( point );
	var weight = point - intPoint;

	var point0 = points[ intPoint === 0 ? intPoint : intPoint - 1 ];
	var point1 = points[ intPoint ];
	var point2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
	var point3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

	var vector = new THREE.Vector2();

	vector.x = THREE.Curve.Utils.interpolate( point0.x, point1.x, point2.x, point3.x, weight );
	vector.y = THREE.Curve.Utils.interpolate( point0.y, point1.y, point2.y, point3.y, weight );

	return vector;

};

// File:src/extras/curves/EllipseCurve.js

/**************************************************************
 *	Ellipse curve
 **************************************************************/

THREE.EllipseCurve = function ( aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise ) {

	this.aX = aX;
	this.aY = aY;

	this.xRadius = xRadius;
	this.yRadius = yRadius;

	this.aStartAngle = aStartAngle;
	this.aEndAngle = aEndAngle;

	this.aClockwise = aClockwise;

};

THREE.EllipseCurve.prototype = Object.create( THREE.Curve.prototype );
THREE.EllipseCurve.prototype.constructor = THREE.EllipseCurve;

THREE.EllipseCurve.prototype.getPoint = function ( t ) {

	var deltaAngle = this.aEndAngle - this.aStartAngle;

	if ( deltaAngle < 0 ) deltaAngle += Math.PI * 2;
	if ( deltaAngle > Math.PI * 2 ) deltaAngle -= Math.PI * 2;

	var angle;

	if ( this.aClockwise === true ) {

		angle = this.aEndAngle + ( 1 - t ) * ( Math.PI * 2 - deltaAngle );

	} else {

		angle = this.aStartAngle + t * deltaAngle;

	}
	
	var vector = new THREE.Vector2();

	vector.x = this.aX + this.xRadius * Math.cos( angle );
	vector.y = this.aY + this.yRadius * Math.sin( angle );

	return vector;

};

// File:src/extras/curves/ArcCurve.js

/**************************************************************
 *	Arc curve
 **************************************************************/

THREE.ArcCurve = function ( aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise ) {

	THREE.EllipseCurve.call( this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise );
};

THREE.ArcCurve.prototype = Object.create( THREE.EllipseCurve.prototype );
THREE.ArcCurve.prototype.constructor = THREE.ArcCurve;

// File:src/extras/curves/LineCurve3.js

/**************************************************************
 *	Line3D
 **************************************************************/

THREE.LineCurve3 = THREE.Curve.create(

	function ( v1, v2 ) {

		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var vector = new THREE.Vector3();

		vector.subVectors( this.v2, this.v1 ); // diff
		vector.multiplyScalar( t );
		vector.add( this.v1 );

		return vector;

	}

);

// File:src/extras/curves/QuadraticBezierCurve3.js

/**************************************************************
 *	Quadratic Bezier 3D curve
 **************************************************************/

THREE.QuadraticBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;

	},

	function ( t ) {

		var vector = new THREE.Vector3();

		vector.x = THREE.Shape.Utils.b2( t, this.v0.x, this.v1.x, this.v2.x );
		vector.y = THREE.Shape.Utils.b2( t, this.v0.y, this.v1.y, this.v2.y );
		vector.z = THREE.Shape.Utils.b2( t, this.v0.z, this.v1.z, this.v2.z );

		return vector;

	}

);

// File:src/extras/curves/CubicBezierCurve3.js

/**************************************************************
 *	Cubic Bezier 3D curve
 **************************************************************/

THREE.CubicBezierCurve3 = THREE.Curve.create(

	function ( v0, v1, v2, v3 ) {

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;

	},

	function ( t ) {

		var vector = new THREE.Vector3();

		vector.x = THREE.Shape.Utils.b3( t, this.v0.x, this.v1.x, this.v2.x, this.v3.x );
		vector.y = THREE.Shape.Utils.b3( t, this.v0.y, this.v1.y, this.v2.y, this.v3.y );
		vector.z = THREE.Shape.Utils.b3( t, this.v0.z, this.v1.z, this.v2.z, this.v3.z );

		return vector;

	}

);

// File:src/extras/curves/SplineCurve3.js

/**************************************************************
 *	Spline 3D curve
 **************************************************************/


THREE.SplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {

		console.warn( 'THREE.SplineCurve3 will be deprecated. Please use THREE.CatmullRomCurve3' );
		this.points = ( points == undefined ) ? [] : points;

	},

	function ( t ) {

		var points = this.points;
		var point = ( points.length - 1 ) * t;

		var intPoint = Math.floor( point );
		var weight = point - intPoint;

		var point0 = points[ intPoint == 0 ? intPoint : intPoint - 1 ];
		var point1 = points[ intPoint ];
		var point2 = points[ intPoint > points.length - 2 ? points.length - 1 : intPoint + 1 ];
		var point3 = points[ intPoint > points.length - 3 ? points.length - 1 : intPoint + 2 ];

		var vector = new THREE.Vector3();

		vector.x = THREE.Curve.Utils.interpolate( point0.x, point1.x, point2.x, point3.x, weight );
		vector.y = THREE.Curve.Utils.interpolate( point0.y, point1.y, point2.y, point3.y, weight );
		vector.z = THREE.Curve.Utils.interpolate( point0.z, point1.z, point2.z, point3.z, weight );

		return vector;

	}

);

// File:src/extras/curves/CatmullRomCurve3.js

/**
 * @author zz85 https://github.com/zz85
 *
 * Centripetal CatmullRom Curve - which is useful for avoiding
 * cusps and self-intersections in non-uniform catmull rom curves.
 * http://www.cemyuksel.com/research/catmullrom_param/catmullrom.pdf
 *
 * curve.type accepts centripetal(default), chordal and catmullrom
 * curve.tension is used for catmullrom which defaults to 0.5
 */

THREE.CatmullRomCurve3 = ( function() {

	var
		tmp = new THREE.Vector3(),
		px = new CubicPoly(),
		py = new CubicPoly(),
		pz = new CubicPoly();

	/*
	Based on an optimized c++ solution in
	 - http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections/
	 - http://ideone.com/NoEbVM

	This CubicPoly class could be used for reusing some variables and calculations,
	but for three.js curve use, it could be possible inlined and flatten into a single function call
	which can be placed in CurveUtils.
	*/

	function CubicPoly() {

	}

	/*
	 * Compute coefficients for a cubic polynomial
	 *   p(s) = c0 + c1*s + c2*s^2 + c3*s^3
	 * such that
	 *   p(0) = x0, p(1) = x1
	 *  and
	 *   p'(0) = t0, p'(1) = t1.
	 */
	CubicPoly.prototype.init = function( x0, x1, t0, t1 ) {

		this.c0 = x0;
		this.c1 = t0;
		this.c2 = - 3 * x0 + 3 * x1 - 2 * t0 - t1;
		this.c3 = 2 * x0 - 2 * x1 + t0 + t1;

	};

	CubicPoly.prototype.initNonuniformCatmullRom = function( x0, x1, x2, x3, dt0, dt1, dt2 ) {

		// compute tangents when parameterized in [t1,t2]
		var t1 = ( x1 - x0 ) / dt0 - ( x2 - x0 ) / ( dt0 + dt1 ) + ( x2 - x1 ) / dt1;
		var t2 = ( x2 - x1 ) / dt1 - ( x3 - x1 ) / ( dt1 + dt2 ) + ( x3 - x2 ) / dt2;

		// rescale tangents for parametrization in [0,1]
		t1 *= dt1;
		t2 *= dt1;

		// initCubicPoly
		this.init( x1, x2, t1, t2 );

	};

	// standard Catmull-Rom spline: interpolate between x1 and x2 with previous/following points x1/x4
	CubicPoly.prototype.initCatmullRom = function( x0, x1, x2, x3, tension ) {

		this.init( x1, x2, tension * ( x2 - x0 ), tension * ( x3 - x1 ) );

	};

	CubicPoly.prototype.calc = function( t ) {

		var t2 = t * t;
		var t3 = t2 * t;
		return this.c0 + this.c1 * t + this.c2 * t2 + this.c3 * t3;

	};

	// Subclass Three.js curve
	return THREE.Curve.create(

		function ( p /* array of Vector3 */ ) {

			this.points = p || [];

		},

		function ( t ) {

			var points = this.points,
				point, intPoint, weight, l;

			l = points.length;

			if ( l < 2 ) console.log( 'duh, you need at least 2 points' );

			point = ( l - 1 ) * t;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			if ( weight === 0 && intPoint === l - 1 ) {

				intPoint = l - 2;
				weight = 1;

			}

			var p0, p1, p2, p3;

			if ( intPoint === 0 ) {

				// extrapolate first point
				tmp.subVectors( points[ 0 ], points[ 1 ] ).add( points[ 0 ] );
				p0 = tmp;

			} else {

				p0 = points[ intPoint - 1 ];

			}

			p1 = points[ intPoint ];
			p2 = points[ intPoint + 1 ];

			if ( intPoint + 2 < l ) {

				p3 = points[ intPoint + 2 ]

			} else {

				// extrapolate last point
				tmp.subVectors( points[ l - 1 ], points[ l - 2 ] ).add( points[ l - 2 ] );
				p3 = tmp;

			}

			if ( this.type === undefined || this.type === 'centripetal' || this.type === 'chordal' ) {

				// init Centripetal / Chordal Catmull-Rom
				var pow = this.type === 'chordal' ? 0.5 : 0.25;
				var dt0 = Math.pow( p0.distanceToSquared( p1 ), pow );
				var dt1 = Math.pow( p1.distanceToSquared( p2 ), pow );
				var dt2 = Math.pow( p2.distanceToSquared( p3 ), pow );

				// safety check for repeated points
				if ( dt1 < 1e-4 ) dt1 = 1.0;
				if ( dt0 < 1e-4 ) dt0 = dt1;
				if ( dt2 < 1e-4 ) dt2 = dt1;

				px.initNonuniformCatmullRom( p0.x, p1.x, p2.x, p3.x, dt0, dt1, dt2 );
				py.initNonuniformCatmullRom( p0.y, p1.y, p2.y, p3.y, dt0, dt1, dt2 );
				pz.initNonuniformCatmullRom( p0.z, p1.z, p2.z, p3.z, dt0, dt1, dt2 );

			} else if ( this.type === 'catmullrom' ) {

				var tension = this.tension !== undefined ? this.tension : 0.5;
				px.initCatmullRom( p0.x, p1.x, p2.x, p3.x, tension );
				py.initCatmullRom( p0.y, p1.y, p2.y, p3.y, tension );
				pz.initCatmullRom( p0.z, p1.z, p2.z, p3.z, tension );

			}

			var v = new THREE.Vector3(
				px.calc( weight ),
				py.calc( weight ),
				pz.calc( weight )
			);

			return v;

		}

	);

} )();

// File:src/extras/curves/ClosedSplineCurve3.js

/**************************************************************
 *	Closed Spline 3D curve
 **************************************************************/


THREE.ClosedSplineCurve3 = THREE.Curve.create(

	function ( points /* array of Vector3 */) {

		this.points = ( points == undefined ) ? [] : points;

	},

	function ( t ) {

		var points = this.points;
		var point = ( points.length - 0 ) * t; // This needs to be from 0-length +1

		var intPoint = Math.floor( point );
		var weight = point - intPoint;

		intPoint += intPoint > 0 ? 0 : ( Math.floor( Math.abs( intPoint ) / points.length ) + 1 ) * points.length;

		var point0 = points[ ( intPoint - 1 ) % points.length ];
		var point1 = points[ ( intPoint     ) % points.length ];
		var point2 = points[ ( intPoint + 1 ) % points.length ];
		var point3 = points[ ( intPoint + 2 ) % points.length ];

		var vector = new THREE.Vector3();

		vector.x = THREE.Curve.Utils.interpolate( point0.x, point1.x, point2.x, point3.x, weight );
		vector.y = THREE.Curve.Utils.interpolate( point0.y, point1.y, point2.y, point3.y, weight );
		vector.z = THREE.Curve.Utils.interpolate( point0.z, point1.z, point2.z, point3.z, weight );

		return vector;

	}

);

// File:src/extras/animation/AnimationHandler.js

/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.AnimationHandler = {

	LINEAR: 0,
	CATMULLROM: 1,
	CATMULLROM_FORWARD: 2,

	//

	add: function () { console.warn( 'THREE.AnimationHandler.add() has been deprecated.' ); },
	get: function () { console.warn( 'THREE.AnimationHandler.get() has been deprecated.' ); },
	remove: function () { console.warn( 'THREE.AnimationHandler.remove() has been deprecated.' ); },

	//

	animations: [],

	init: function ( data ) {

		if ( data.initialized === true ) return data;

		// loop through all keys

		for ( var h = 0; h < data.hierarchy.length; h ++ ) {

			for ( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				// remove minus times

				if ( data.hierarchy[ h ].keys[ k ].time < 0 ) {

					 data.hierarchy[ h ].keys[ k ].time = 0;

				}

				// create quaternions

				if ( data.hierarchy[ h ].keys[ k ].rot !== undefined &&
				  ! ( data.hierarchy[ h ].keys[ k ].rot instanceof THREE.Quaternion ) ) {

					var quat = data.hierarchy[ h ].keys[ k ].rot;
					data.hierarchy[ h ].keys[ k ].rot = new THREE.Quaternion().fromArray( quat );

				}

			}

			// prepare morph target keys

			if ( data.hierarchy[ h ].keys.length && data.hierarchy[ h ].keys[ 0 ].morphTargets !== undefined ) {

				// get all used

				var usedMorphTargets = {};

				for ( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					for ( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

						var morphTargetName = data.hierarchy[ h ].keys[ k ].morphTargets[ m ];
						usedMorphTargets[ morphTargetName ] = - 1;

					}

				}

				data.hierarchy[ h ].usedMorphTargets = usedMorphTargets;


				// set all used on all frames

				for ( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

					var influences = {};

					for ( var morphTargetName in usedMorphTargets ) {

						for ( var m = 0; m < data.hierarchy[ h ].keys[ k ].morphTargets.length; m ++ ) {

							if ( data.hierarchy[ h ].keys[ k ].morphTargets[ m ] === morphTargetName ) {

								influences[ morphTargetName ] = data.hierarchy[ h ].keys[ k ].morphTargetsInfluences[ m ];
								break;

							}

						}

						if ( m === data.hierarchy[ h ].keys[ k ].morphTargets.length ) {

							influences[ morphTargetName ] = 0;

						}

					}

					data.hierarchy[ h ].keys[ k ].morphTargetsInfluences = influences;

				}

			}


			// remove all keys that are on the same time

			for ( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				if ( data.hierarchy[ h ].keys[ k ].time === data.hierarchy[ h ].keys[ k - 1 ].time ) {

					data.hierarchy[ h ].keys.splice( k, 1 );
					k --;

				}

			}


			// set index

			for ( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				data.hierarchy[ h ].keys[ k ].index = k;

			}

		}

		data.initialized = true;

		return data;

	},

	parse: function ( root ) {

		var parseRecurseHierarchy = function ( root, hierarchy ) {

			hierarchy.push( root );

			for ( var c = 0; c < root.children.length; c ++ )
				parseRecurseHierarchy( root.children[ c ], hierarchy );

		};

		// setup hierarchy

		var hierarchy = [];

		if ( root instanceof THREE.SkinnedMesh ) {

			for ( var b = 0; b < root.skeleton.bones.length; b ++ ) {

				hierarchy.push( root.skeleton.bones[ b ] );

			}

		} else {

			parseRecurseHierarchy( root, hierarchy );

		}

		return hierarchy;

	},

	play: function ( animation ) {

		if ( this.animations.indexOf( animation ) === - 1 ) {

			this.animations.push( animation );

		}

	},

	stop: function ( animation ) {

		var index = this.animations.indexOf( animation );

		if ( index !== - 1 ) {

			this.animations.splice( index, 1 );

		}

	},

	update: function ( deltaTimeMS ) {

		for ( var i = 0; i < this.animations.length; i ++ ) {

			this.animations[ i ].resetBlendWeights( );

		}

		for ( var i = 0; i < this.animations.length; i ++ ) {

			this.animations[ i ].update( deltaTimeMS );

		}

	}

};

// File:src/extras/animation/Animation.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Animation = function ( root, data ) {

	this.root = root;
	this.data = THREE.AnimationHandler.init( data );
	this.hierarchy = THREE.AnimationHandler.parse( root );

	this.currentTime = 0;
	this.timeScale = 1;

	this.isPlaying = false;
	this.loop = true;
	this.weight = 0;

	this.interpolationType = THREE.AnimationHandler.LINEAR;

};

THREE.Animation.prototype = {

	constructor: THREE.Animation,

	keyTypes:  [ "pos", "rot", "scl" ],

	play: function ( startTime, weight ) {

		this.currentTime = startTime !== undefined ? startTime : 0;
		this.weight = weight !== undefined ? weight : 1;

		this.isPlaying = true;

		this.reset();

		THREE.AnimationHandler.play( this );

	},

	stop: function() {

		this.isPlaying = false;

		THREE.AnimationHandler.stop( this );

	},

	reset: function () {

		for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

			var object = this.hierarchy[ h ];

			if ( object.animationCache === undefined ) {

				object.animationCache = {
					animations: {},
					blending: {
						positionWeight: 0.0,
						quaternionWeight: 0.0,
						scaleWeight: 0.0
					}
				};
			}

			var name = this.data.name;
			var animations = object.animationCache.animations;
			var animationCache = animations[ name ];

			if ( animationCache === undefined ) {

				animationCache = {
					prevKey: { pos: 0, rot: 0, scl: 0 },
					nextKey: { pos: 0, rot: 0, scl: 0 },
					originalMatrix: object.matrix
				};

				animations[ name ] = animationCache;

			}

			// Get keys to match our current time

			for ( var t = 0; t < 3; t ++ ) {

				var type = this.keyTypes[ t ];

				var prevKey = this.data.hierarchy[ h ].keys[ 0 ];
				var nextKey = this.getNextKeyWith( type, h, 1 );

				while ( nextKey.time < this.currentTime && nextKey.index > prevKey.index ) {

					prevKey = nextKey;
					nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

				}

				animationCache.prevKey[ type ] = prevKey;
				animationCache.nextKey[ type ] = nextKey;

			}

		}

	},

	resetBlendWeights: function () {

		for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

			var object = this.hierarchy[ h ];
			var animationCache = object.animationCache;

			if ( animationCache !== undefined ) {

				var blending = animationCache.blending;

				blending.positionWeight = 0.0;
				blending.quaternionWeight = 0.0;
				blending.scaleWeight = 0.0;

			}

		}

	},

	update: ( function() {

		var points = [];
		var target = new THREE.Vector3();
		var newVector = new THREE.Vector3();
		var newQuat = new THREE.Quaternion();

		// Catmull-Rom spline

		var interpolateCatmullRom = function ( points, scale ) {

			var c = [], v3 = [],
			point, intPoint, weight, w2, w3,
			pa, pb, pc, pd;

			point = ( points.length - 1 ) * scale;
			intPoint = Math.floor( point );
			weight = point - intPoint;

			c[ 0 ] = intPoint === 0 ? intPoint : intPoint - 1;
			c[ 1 ] = intPoint;
			c[ 2 ] = intPoint > points.length - 2 ? intPoint : intPoint + 1;
			c[ 3 ] = intPoint > points.length - 3 ? intPoint : intPoint + 2;

			pa = points[ c[ 0 ] ];
			pb = points[ c[ 1 ] ];
			pc = points[ c[ 2 ] ];
			pd = points[ c[ 3 ] ];

			w2 = weight * weight;
			w3 = weight * w2;

			v3[ 0 ] = interpolate( pa[ 0 ], pb[ 0 ], pc[ 0 ], pd[ 0 ], weight, w2, w3 );
			v3[ 1 ] = interpolate( pa[ 1 ], pb[ 1 ], pc[ 1 ], pd[ 1 ], weight, w2, w3 );
			v3[ 2 ] = interpolate( pa[ 2 ], pb[ 2 ], pc[ 2 ], pd[ 2 ], weight, w2, w3 );

			return v3;

		};

		var interpolate = function ( p0, p1, p2, p3, t, t2, t3 ) {

			var v0 = ( p2 - p0 ) * 0.5,
				v1 = ( p3 - p1 ) * 0.5;

			return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		};

		return function ( delta ) {

			if ( this.isPlaying === false ) return;

			this.currentTime += delta * this.timeScale;

			if ( this.weight === 0 )
				return;

			//

			var duration = this.data.length;

			if ( this.currentTime > duration || this.currentTime < 0 ) {

				if ( this.loop ) {

					this.currentTime %= duration;

					if ( this.currentTime < 0 )
						this.currentTime += duration;

					this.reset();

				} else {

					this.stop();

				}

			}

			for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

				var object = this.hierarchy[ h ];
				var animationCache = object.animationCache.animations[this.data.name];
				var blending = object.animationCache.blending;

				// loop through pos/rot/scl

				for ( var t = 0; t < 3; t ++ ) {

					// get keys

					var type    = this.keyTypes[ t ];
					var prevKey = animationCache.prevKey[ type ];
					var nextKey = animationCache.nextKey[ type ];

					if ( ( this.timeScale > 0 && nextKey.time <= this.currentTime ) ||
						( this.timeScale < 0 && prevKey.time >= this.currentTime ) ) {

						prevKey = this.data.hierarchy[ h ].keys[ 0 ];
						nextKey = this.getNextKeyWith( type, h, 1 );

						while ( nextKey.time < this.currentTime && nextKey.index > prevKey.index ) {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						}

						animationCache.prevKey[ type ] = prevKey;
						animationCache.nextKey[ type ] = nextKey;

					}

					var scale = ( this.currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );

					var prevXYZ = prevKey[ type ];
					var nextXYZ = nextKey[ type ];

					if ( scale < 0 ) scale = 0;
					if ( scale > 1 ) scale = 1;

					// interpolate

					if ( type === "pos" ) {

						if ( this.interpolationType === THREE.AnimationHandler.LINEAR ) {

							newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
							newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
							newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

							// blend
							var proportionalWeight = this.weight / ( this.weight + blending.positionWeight );
							object.position.lerp( newVector, proportionalWeight );
							blending.positionWeight += this.weight;

						} else if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
									this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

							points[ 0 ] = this.getPrevKeyWith( "pos", h, prevKey.index - 1 )[ "pos" ];
							points[ 1 ] = prevXYZ;
							points[ 2 ] = nextXYZ;
							points[ 3 ] = this.getNextKeyWith( "pos", h, nextKey.index + 1 )[ "pos" ];

							scale = scale * 0.33 + 0.33;

							var currentPoint = interpolateCatmullRom( points, scale );
							var proportionalWeight = this.weight / ( this.weight + blending.positionWeight );
							blending.positionWeight += this.weight;

							// blend

							var vector = object.position;

							vector.x = vector.x + ( currentPoint[ 0 ] - vector.x ) * proportionalWeight;
							vector.y = vector.y + ( currentPoint[ 1 ] - vector.y ) * proportionalWeight;
							vector.z = vector.z + ( currentPoint[ 2 ] - vector.z ) * proportionalWeight;

							if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

								var forwardPoint = interpolateCatmullRom( points, scale * 1.01 );

								target.set( forwardPoint[ 0 ], forwardPoint[ 1 ], forwardPoint[ 2 ] );
								target.sub( vector );
								target.y = 0;
								target.normalize();

								var angle = Math.atan2( target.x, target.z );
								object.rotation.set( 0, angle, 0 );

							}

						}

					} else if ( type === "rot" ) {

						THREE.Quaternion.slerp( prevXYZ, nextXYZ, newQuat, scale );

						// Avoid paying the cost of an additional slerp if we don't have to
						if ( blending.quaternionWeight === 0 ) {

							object.quaternion.copy(newQuat);
							blending.quaternionWeight = this.weight;

						} else {

							var proportionalWeight = this.weight / ( this.weight + blending.quaternionWeight );
							THREE.Quaternion.slerp( object.quaternion, newQuat, object.quaternion, proportionalWeight );
							blending.quaternionWeight += this.weight;

						}

					} else if ( type === "scl" ) {

						newVector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
						newVector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
						newVector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

						var proportionalWeight = this.weight / ( this.weight + blending.scaleWeight );
						object.scale.lerp( newVector, proportionalWeight );
						blending.scaleWeight += this.weight;

					}

				}

			}

			return true;

		};

	} )(),

	getNextKeyWith: function ( type, h, key ) {

		var keys = this.data.hierarchy[ h ].keys;

		if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
			 this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

			key = key < keys.length - 1 ? key : keys.length - 1;

		} else {

			key = key % keys.length;

		}

		for ( ; key < keys.length; key ++ ) {

			if ( keys[ key ][ type ] !== undefined ) {

				return keys[ key ];

			}

		}

		return this.data.hierarchy[ h ].keys[ 0 ];

	},

	getPrevKeyWith: function ( type, h, key ) {

		var keys = this.data.hierarchy[ h ].keys;

		if ( this.interpolationType === THREE.AnimationHandler.CATMULLROM ||
			this.interpolationType === THREE.AnimationHandler.CATMULLROM_FORWARD ) {

			key = key > 0 ? key : 0;

		} else {

			key = key >= 0 ? key : key + keys.length;

		}


		for ( ; key >= 0; key -- ) {

			if ( keys[ key ][ type ] !== undefined ) {

				return keys[ key ];

			}

		}

		return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

	}

};

// File:src/extras/animation/KeyFrameAnimation.js

/**
 * @author mikael emtinger / http://gomo.se/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author khang duong
 * @author erik kitson
 */

THREE.KeyFrameAnimation = function ( data ) {

	this.root = data.node;
	this.data = THREE.AnimationHandler.init( data );
	this.hierarchy = THREE.AnimationHandler.parse( this.root );
	this.currentTime = 0;
	this.timeScale = 0.001;
	this.isPlaying = false;
	this.isPaused = true;
	this.loop = true;

	// initialize to first keyframes

	for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

		var keys = this.data.hierarchy[h].keys,
			sids = this.data.hierarchy[h].sids,
			obj = this.hierarchy[h];

		if ( keys.length && sids ) {

			for ( var s = 0; s < sids.length; s ++ ) {

				var sid = sids[ s ],
					next = this.getNextKeyWith( sid, h, 0 );

				if ( next ) {

					next.apply( sid );

				}

			}

			obj.matrixAutoUpdate = false;
			this.data.hierarchy[h].node.updateMatrix();
			obj.matrixWorldNeedsUpdate = true;

		}

	}

};

THREE.KeyFrameAnimation.prototype = {

	constructor: THREE.KeyFrameAnimation,

	play: function ( startTime ) {

		this.currentTime = startTime !== undefined ? startTime : 0;

		if ( this.isPlaying === false ) {

			this.isPlaying = true;

			// reset key cache

			var h, hl = this.hierarchy.length,
				object,
				node;

			for ( h = 0; h < hl; h ++ ) {

				object = this.hierarchy[ h ];
				node = this.data.hierarchy[ h ];

				if ( node.animationCache === undefined ) {

					node.animationCache = {};
					node.animationCache.prevKey = null;
					node.animationCache.nextKey = null;
					node.animationCache.originalMatrix = object.matrix;

				}

				var keys = this.data.hierarchy[h].keys;

				if (keys.length) {

					node.animationCache.prevKey = keys[ 0 ];
					node.animationCache.nextKey = keys[ 1 ];

					this.startTime = Math.min( keys[0].time, this.startTime );
					this.endTime = Math.max( keys[keys.length - 1].time, this.endTime );

				}

			}

			this.update( 0 );

		}

		this.isPaused = false;

		THREE.AnimationHandler.play( this );

	},

	stop: function () {

		this.isPlaying = false;
		this.isPaused  = false;

		THREE.AnimationHandler.stop( this );

		// reset JIT matrix and remove cache

		for ( var h = 0; h < this.data.hierarchy.length; h ++ ) {

			var obj = this.hierarchy[ h ];
			var node = this.data.hierarchy[ h ];

			if ( node.animationCache !== undefined ) {

				var original = node.animationCache.originalMatrix;

				original.copy( obj.matrix );
				obj.matrix = original;

				delete node.animationCache;

			}

		}

	},

	update: function ( delta ) {

		if ( this.isPlaying === false ) return;

		this.currentTime += delta * this.timeScale;

		//

		var duration = this.data.length;

		if ( this.loop === true && this.currentTime > duration ) {

			this.currentTime %= duration;

		}

		this.currentTime = Math.min( this.currentTime, duration );

		for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

			var object = this.hierarchy[ h ];
			var node = this.data.hierarchy[ h ];

			var keys = node.keys,
				animationCache = node.animationCache;


			if ( keys.length ) {

				var prevKey = animationCache.prevKey;
				var nextKey = animationCache.nextKey;

				if ( nextKey.time <= this.currentTime ) {

					while ( nextKey.time < this.currentTime && nextKey.index > prevKey.index ) {

						prevKey = nextKey;
						nextKey = keys[ prevKey.index + 1 ];

					}

					animationCache.prevKey = prevKey;
					animationCache.nextKey = nextKey;

				}

				if ( nextKey.time >= this.currentTime ) {

					prevKey.interpolate( nextKey, this.currentTime );

				} else {

					prevKey.interpolate( nextKey, nextKey.time );

				}

				this.data.hierarchy[ h ].node.updateMatrix();
				object.matrixWorldNeedsUpdate = true;

			}

		}

	},

	getNextKeyWith: function ( sid, h, key ) {

		var keys = this.data.hierarchy[ h ].keys;
		key = key % keys.length;

		for ( ; key < keys.length; key ++ ) {

			if ( keys[ key ].hasTarget( sid ) ) {

				return keys[ key ];

			}

		}

		return keys[ 0 ];

	},

	getPrevKeyWith: function ( sid, h, key ) {

		var keys = this.data.hierarchy[ h ].keys;
		key = key >= 0 ? key : key + keys.length;

		for ( ; key >= 0; key -- ) {

			if ( keys[ key ].hasTarget( sid ) ) {

				return keys[ key ];

			}

		}

		return keys[ keys.length - 1 ];

	}

};

// File:src/extras/animation/MorphAnimation.js

/**
 * @author mrdoob / http://mrdoob.com
 * @author willy-vvu / http://willy-vvu.github.io
 */

THREE.MorphAnimation = function ( mesh ) {

	this.mesh = mesh;
	this.frames = mesh.morphTargetInfluences.length;
	this.currentTime = 0;
	this.duration = 1000;
	this.loop = true;
	this.lastFrame = 0;
	this.currentFrame = 0;

	this.isPlaying = false;

};

THREE.MorphAnimation.prototype = {

	constructor: THREE.MorphAnimation,

	play: function () {

		this.isPlaying = true;

	},

	pause: function () {

		this.isPlaying = false;

	},

	update: function ( delta ) {

		if ( this.isPlaying === false ) return;

		this.currentTime += delta;

		if ( this.loop === true && this.currentTime > this.duration ) {

			this.currentTime %= this.duration;

		}

		this.currentTime = Math.min( this.currentTime, this.duration );

		var interpolation = this.duration / this.frames;
		var frame = Math.floor( this.currentTime / interpolation );

		var influences = this.mesh.morphTargetInfluences;

		if ( frame !== this.currentFrame ) {

			influences[ this.lastFrame ] = 0;
			influences[ this.currentFrame ] = 1;
			influences[ frame ] = 0;

			this.lastFrame = this.currentFrame;
			this.currentFrame = frame;

		}

		influences[ frame ] = ( this.currentTime % interpolation ) / interpolation;
		influences[ this.lastFrame ] = 1 - influences[ frame ];

	}

};

// File:src/extras/geometries/BoxGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Cube.as
 */

THREE.BoxGeometry = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	THREE.Geometry.call( this );

	this.type = 'BoxGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	this.widthSegments = widthSegments || 1;
	this.heightSegments = heightSegments || 1;
	this.depthSegments = depthSegments || 1;

	var scope = this;

	var width_half = width / 2;
	var height_half = height / 2;
	var depth_half = depth / 2;

	buildPlane( 'z', 'y', - 1, - 1, depth, height, width_half ); // px
	buildPlane( 'z', 'y',   1, - 1, depth, height, - width_half ); // nx
	buildPlane( 'x', 'z',   1,   1, width, depth, height_half ); // py
	buildPlane( 'x', 'z',   1, - 1, width, depth, - height_half ); // ny
	buildPlane( 'x', 'y',   1, - 1, width, height, depth_half ); // pz
	buildPlane( 'x', 'y', - 1, - 1, width, height, - depth_half ); // nz

	function buildPlane( u, v, udir, vdir, width, height, depth ) {

		var w, ix, iy,
		gridX = scope.widthSegments,
		gridY = scope.heightSegments,
		width_half = width / 2,
		height_half = height / 2,
		offset = scope.vertices.length;

		if ( ( u === 'x' && v === 'y' ) || ( u === 'y' && v === 'x' ) ) {

			w = 'z';

		} else if ( ( u === 'x' && v === 'z' ) || ( u === 'z' && v === 'x' ) ) {

			w = 'y';
			gridY = scope.depthSegments;

		} else if ( ( u === 'z' && v === 'y' ) || ( u === 'y' && v === 'z' ) ) {

			w = 'x';
			gridX = scope.depthSegments;

		}

		var gridX1 = gridX + 1,
		gridY1 = gridY + 1,
		segment_width = width / gridX,
		segment_height = height / gridY,
		normal = new THREE.Vector3();

		normal[ w ] = depth > 0 ? 1 : - 1;

		for ( iy = 0; iy < gridY1; iy ++ ) {

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var vector = new THREE.Vector3();
				vector[ u ] = ( ix * segment_width - width_half ) * udir;
				vector[ v ] = ( iy * segment_height - height_half ) * vdir;
				vector[ w ] = depth;

				scope.vertices.push( vector );

			}

		}

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				var a = ix + gridX1 * iy;
				var b = ix + gridX1 * ( iy + 1 );
				var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = ( ix + 1 ) + gridX1 * iy;

				var uva = new THREE.Vector2( ix / gridX, 1 - iy / gridY );
				var uvb = new THREE.Vector2( ix / gridX, 1 - ( iy + 1 ) / gridY );
				var uvc = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - ( iy + 1 ) / gridY );
				var uvd = new THREE.Vector2( ( ix + 1 ) / gridX, 1 - iy / gridY );

				var face = new THREE.Face3( a + offset, b + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

				face = new THREE.Face3( b + offset, c + offset, d + offset );
				face.normal.copy( normal );
				face.vertexNormals.push( normal.clone(), normal.clone(), normal.clone() );

				scope.faces.push( face );
				scope.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

			}

		}

	}

	this.mergeVertices();

};

THREE.BoxGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.BoxGeometry.prototype.constructor = THREE.BoxGeometry;

THREE.CubeGeometry = THREE.BoxGeometry; // backwards compatibility

// File:src/extras/geometries/CircleGeometry.js

/**
 * @author hughes
 */

THREE.CircleGeometry = function ( radius, segments, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'CircleGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;
	segments = segments !== undefined ? Math.max( 3, segments ) : 8;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	var i, uvs = [],
	center = new THREE.Vector3(), centerUV = new THREE.Vector2( 0.5, 0.5 );

	this.vertices.push(center);
	uvs.push( centerUV );

	for ( i = 0; i <= segments; i ++ ) {

		var vertex = new THREE.Vector3();
		var segment = thetaStart + i / segments * thetaLength;

		vertex.x = radius * Math.cos( segment );
		vertex.y = radius * Math.sin( segment );

		this.vertices.push( vertex );
		uvs.push( new THREE.Vector2( ( vertex.x / radius + 1 ) / 2, ( vertex.y / radius + 1 ) / 2 ) );

	}

	var n = new THREE.Vector3( 0, 0, 1 );

	for ( i = 1; i <= segments; i ++ ) {

		this.faces.push( new THREE.Face3( i, i + 1, 0, [ n.clone(), n.clone(), n.clone() ] ) );
		this.faceVertexUvs[ 0 ].push( [ uvs[ i ].clone(), uvs[ i + 1 ].clone(), centerUV.clone() ] );

	}

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.CircleGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.CircleGeometry.prototype.constructor = THREE.CircleGeometry;

// File:src/extras/geometries/CircleBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.CircleBufferGeometry = function ( radius, segments, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'CircleBufferGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;
	segments = segments !== undefined ? Math.max( 3, segments ) : 8;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	var vertices = segments + 2;

	var positions = new Float32Array( vertices * 3 );
	var normals = new Float32Array( vertices * 3 );
	var uvs = new Float32Array( vertices * 2 );

	// center data is already zero, but need to set a few extras
	normals[3] = 1.0;
	uvs[0] = 0.5;
	uvs[1] = 0.5;

	for ( var s = 0, i = 3, ii = 2 ; s <= segments; s++, i += 3, ii += 2 ) {

		var segment = thetaStart + s / segments * thetaLength;

		positions[i] = radius * Math.cos( segment );
		positions[i + 1] = radius * Math.sin( segment );

		normals[i + 2] = 1; // normal z

		uvs[ii] = ( positions[i] / radius + 1 ) / 2;
		uvs[ii + 1] = ( positions[i + 1] / radius + 1 ) / 2;

	}

	var indices = [];

	for ( var i = 1; i <= segments; i ++ ) {

		indices.push( i );
		indices.push( i + 1 );
		indices.push( 0 );

	}

	this.addAttribute( 'index', new THREE.BufferAttribute( new Uint16Array( indices ), 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.CircleBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.CircleBufferGeometry.prototype.constructor = THREE.CircleBufferGeometry;

// File:src/extras/geometries/CylinderGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'CylinderGeometry';

	this.parameters = {
		radiusTop: radiusTop,
		radiusBottom: radiusBottom,
		height: height,
		radialSegments: radialSegments,
		heightSegments: heightSegments,
		openEnded: openEnded,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radiusTop = radiusTop !== undefined ? radiusTop : 20;
	radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
	height = height !== undefined ? height : 100;

	radialSegments = radialSegments || 8;
	heightSegments = heightSegments || 1;

	openEnded = openEnded !== undefined ? openEnded : false;
	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : 2 * Math.PI;

	var heightHalf = height / 2;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		var v = y / heightSegments;
		var radius = v * ( radiusBottom - radiusTop ) + radiusTop;

		for ( x = 0; x <= radialSegments; x ++ ) {

			var u = x / radialSegments;

			var vertex = new THREE.Vector3();
			vertex.x = radius * Math.sin( u * thetaLength + thetaStart );
			vertex.y = - v * height + heightHalf;
			vertex.z = radius * Math.cos( u * thetaLength + thetaStart );

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	var tanTheta = ( radiusBottom - radiusTop ) / height;
	var na, nb;

	for ( x = 0; x < radialSegments; x ++ ) {

		if ( radiusTop !== 0 ) {

			na = this.vertices[ vertices[ 0 ][ x ] ].clone();
			nb = this.vertices[ vertices[ 0 ][ x + 1 ] ].clone();

		} else {

			na = this.vertices[ vertices[ 1 ][ x ] ].clone();
			nb = this.vertices[ vertices[ 1 ][ x + 1 ] ].clone();

		}

		na.setY( Math.sqrt( na.x * na.x + na.z * na.z ) * tanTheta ).normalize();
		nb.setY( Math.sqrt( nb.x * nb.x + nb.z * nb.z ) * tanTheta ).normalize();

		for ( y = 0; y < heightSegments; y ++ ) {

			var v1 = vertices[ y ][ x ];
			var v2 = vertices[ y + 1 ][ x ];
			var v3 = vertices[ y + 1 ][ x + 1 ];
			var v4 = vertices[ y ][ x + 1 ];

			var n1 = na.clone();
			var n2 = na.clone();
			var n3 = nb.clone();
			var n4 = nb.clone();

			var uv1 = uvs[ y ][ x ].clone();
			var uv2 = uvs[ y + 1 ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
			var uv4 = uvs[ y ][ x + 1 ].clone();

			this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

			this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

		}

	}

	// top cap

	if ( openEnded === false && radiusTop > 0 ) {

		this.vertices.push( new THREE.Vector3( 0, heightHalf, 0 ) );

		for ( x = 0; x < radialSegments; x ++ ) {

			var v1 = vertices[ 0 ][ x ];
			var v2 = vertices[ 0 ][ x + 1 ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, 1, 0 );
			var n2 = new THREE.Vector3( 0, 1, 0 );
			var n3 = new THREE.Vector3( 0, 1, 0 );

			var uv1 = uvs[ 0 ][ x ].clone();
			var uv2 = uvs[ 0 ][ x + 1 ].clone();
			var uv3 = new THREE.Vector2( uv2.x, 0 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	// bottom cap

	if ( openEnded === false && radiusBottom > 0 ) {

		this.vertices.push( new THREE.Vector3( 0, - heightHalf, 0 ) );

		for ( x = 0; x < radialSegments; x ++ ) {

			var v1 = vertices[ heightSegments ][ x + 1 ];
			var v2 = vertices[ heightSegments ][ x ];
			var v3 = this.vertices.length - 1;

			var n1 = new THREE.Vector3( 0, - 1, 0 );
			var n2 = new THREE.Vector3( 0, - 1, 0 );
			var n3 = new THREE.Vector3( 0, - 1, 0 );

			var uv1 = uvs[ heightSegments ][ x + 1 ].clone();
			var uv2 = uvs[ heightSegments ][ x ].clone();
			var uv3 = new THREE.Vector2( uv2.x, 1 );

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
			this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

		}

	}

	this.computeFaceNormals();

};

THREE.CylinderGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.CylinderGeometry.prototype.constructor = THREE.CylinderGeometry;

// File:src/extras/geometries/EdgesGeometry.js

/**
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.EdgesGeometry = function ( geometry, thresholdAngle ) {

	THREE.BufferGeometry.call( this );

	thresholdAngle = ( thresholdAngle !== undefined ) ? thresholdAngle : 1;

	var thresholdDot = Math.cos( THREE.Math.degToRad( thresholdAngle ) );

	var edge = [ 0, 0 ], hash = {};
	var sortFunction = function ( a, b ) { return a - b };

	var keys = [ 'a', 'b', 'c' ];

	var geometry2;

	if ( geometry instanceof THREE.BufferGeometry ) {

		geometry2 = new THREE.Geometry();
		geometry2.fromBufferGeometry( geometry );

	} else {

		geometry2 = geometry.clone();

	}

	geometry2.mergeVertices();
	geometry2.computeFaceNormals();

	var vertices = geometry2.vertices;
	var faces = geometry2.faces;

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0; j < 3; j ++ ) {

			edge[ 0 ] = face[ keys[ j ] ];
			edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
			edge.sort( sortFunction );

			var key = edge.toString();

			if ( hash[ key ] === undefined ) {

				hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };

			} else {

				hash[ key ].face2 = i;

			}

		}

	}

	var coords = [];

	for ( var key in hash ) {

		var h = hash[ key ];

		if ( h.face2 === undefined || faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

			var vertex = vertices[ h.vert1 ];
			coords.push( vertex.x );
			coords.push( vertex.y );
			coords.push( vertex.z );

			vertex = vertices[ h.vert2 ];
			coords.push( vertex.x );
			coords.push( vertex.y );
			coords.push( vertex.z );

		}

	}

	this.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( coords ), 3 ) );

};

THREE.EdgesGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.EdgesGeometry.prototype.constructor = THREE.EdgesGeometry;

// File:src/extras/geometries/ExtrudeGeometry.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segements of extrude spline too
 *  amount: <int>, // Depth to extrude the shape
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into the original shape bevel goes
 *  bevelSize: <float>, // how far from shape outline is bevel
 *  bevelSegments: <int>, // number of bevel layers
 *
 *  extrudePath: <THREE.CurvePath> // 3d spline path to extrude shape along. (creates Frames if .frames aren't defined)
 *  frames: <THREE.TubeGeometry.FrenetFrames> // containing arrays of tangents, normals, binormals
 *
 *  uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/

THREE.ExtrudeGeometry = function ( shapes, options ) {

	if ( typeof( shapes ) === "undefined" ) {
		shapes = [];
		return;
	}

	THREE.Geometry.call( this );

	this.type = 'ExtrudeGeometry';

	shapes = Array.isArray( shapes ) ? shapes : [ shapes ];

	this.addShapeList( shapes, options );

	this.computeFaceNormals();

	// can't really use automatic vertex normals
	// as then front and back sides get smoothed too
	// should do separate smoothing just for sides

	//this.computeVertexNormals();

	//console.log( "took", ( Date.now() - startTime ) );

};

THREE.ExtrudeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ExtrudeGeometry.prototype.constructor = THREE.ExtrudeGeometry;

THREE.ExtrudeGeometry.prototype.addShapeList = function ( shapes, options ) {
	var sl = shapes.length;

	for ( var s = 0; s < sl; s ++ ) {
		var shape = shapes[ s ];
		this.addShape( shape, options );
	}
};

THREE.ExtrudeGeometry.prototype.addShape = function ( shape, options ) {

	var amount = options.amount !== undefined ? options.amount : 100;

	var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
	var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
	var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;

	var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false

	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var steps = options.steps !== undefined ? options.steps : 1;

	var extrudePath = options.extrudePath;
	var extrudePts, extrudeByPath = false;

	// Use default WorldUVGenerator if no UV generators are specified.
	var uvgen = options.UVGenerator !== undefined ? options.UVGenerator : THREE.ExtrudeGeometry.WorldUVGenerator;

	var splineTube, binormal, normal, position2;
	if ( extrudePath ) {

		extrudePts = extrudePath.getSpacedPoints( steps );

		extrudeByPath = true;
		bevelEnabled = false; // bevels not supported for path extrusion

		// SETUP TNB variables

		// Reuse TNB from TubeGeomtry for now.
		// TODO1 - have a .isClosed in spline?

		splineTube = options.frames !== undefined ? options.frames : new THREE.TubeGeometry.FrenetFrames(extrudePath, steps, false);

		// console.log(splineTube, 'splineTube', splineTube.normals.length, 'steps', steps, 'extrudePts', extrudePts.length);

		binormal = new THREE.Vector3();
		normal = new THREE.Vector3();
		position2 = new THREE.Vector3();

	}

	// Safeguards if bevels are not enabled

	if ( ! bevelEnabled ) {

		bevelSegments = 0;
		bevelThickness = 0;
		bevelSize = 0;

	}

	// Variables initalization

	var ahole, h, hl; // looping of holes
	var scope = this;

	var shapesOffset = this.vertices.length;

	var shapePoints = shape.extractPoints( curveSegments );

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = ! THREE.Shape.Utils.isClockWise( vertices ) ;

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe ...

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];

			if ( THREE.Shape.Utils.isClockWise( ahole ) ) {

				holes[ h ] = ahole.reverse();

			}

		}

		reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!

	}


	var faces = THREE.Shape.Utils.triangulateShape ( vertices, holes );

	/* Vertices */

	var contour = vertices; // vertices has all points but contour has only points of circumference

	for ( h = 0, hl = holes.length; h < hl; h ++ ) {

		ahole = holes[ h ];

		vertices = vertices.concat( ahole );

	}


	function scalePt2 ( pt, vec, size ) {

		if ( ! vec ) console.error( "THREE.ExtrudeGeometry: vec does not exist" );

		return vec.clone().multiplyScalar( size ).add( pt );

	}

	var b, bs, t, z,
		vert, vlen = vertices.length,
		face, flen = faces.length;


	// Find directions for point movement


	function getBevelVec( inPt, inPrev, inNext ) {

		var EPSILON = 0.0000000001;

		// computes for inPt the corresponding point inPt' on a new contour
		//   shiftet by 1 unit (length of normalized vector) to the left
		// if we walk along contour clockwise, this new contour is outside the old one
		//
		// inPt' is the intersection of the two lines parallel to the two
		//  adjacent edges of inPt at a distance of 1 unit on the left side.

		var v_trans_x, v_trans_y, shrink_by = 1;		// resulting translation vector for inPt

		// good reading for geometry algorithms (here: line-line intersection)
		// http://geomalgorithms.com/a05-_intersect-1.html

		var v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y;
		var v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y;

		var v_prev_lensq = ( v_prev_x * v_prev_x + v_prev_y * v_prev_y );

		// check for colinear edges
		var colinear0 = ( v_prev_x * v_next_y - v_prev_y * v_next_x );

		if ( Math.abs( colinear0 ) > EPSILON ) {		// not colinear

			// length of vectors for normalizing

			var v_prev_len = Math.sqrt( v_prev_lensq );
			var v_next_len = Math.sqrt( v_next_x * v_next_x + v_next_y * v_next_y );

			// shift adjacent points by unit vectors to the left

			var ptPrevShift_x = ( inPrev.x - v_prev_y / v_prev_len );
			var ptPrevShift_y = ( inPrev.y + v_prev_x / v_prev_len );

			var ptNextShift_x = ( inNext.x - v_next_y / v_next_len );
			var ptNextShift_y = ( inNext.y + v_next_x / v_next_len );

			// scaling factor for v_prev to intersection point

			var sf = (  ( ptNextShift_x - ptPrevShift_x ) * v_next_y -
						( ptNextShift_y - ptPrevShift_y ) * v_next_x    ) /
					  ( v_prev_x * v_next_y - v_prev_y * v_next_x );

			// vector from inPt to intersection point

			v_trans_x = ( ptPrevShift_x + v_prev_x * sf - inPt.x );
			v_trans_y = ( ptPrevShift_y + v_prev_y * sf - inPt.y );

			// Don't normalize!, otherwise sharp corners become ugly
			//  but prevent crazy spikes
			var v_trans_lensq = ( v_trans_x * v_trans_x + v_trans_y * v_trans_y );
			if ( v_trans_lensq <= 2 ) {
				return	new THREE.Vector2( v_trans_x, v_trans_y );
			} else {
				shrink_by = Math.sqrt( v_trans_lensq / 2 );
			}

		} else {		// handle special case of colinear edges

			var direction_eq = false;		// assumes: opposite
			if ( v_prev_x > EPSILON ) {
				if ( v_next_x > EPSILON ) { direction_eq = true; }
			} else {
				if ( v_prev_x < - EPSILON ) {
					if ( v_next_x < - EPSILON ) { direction_eq = true; }
				} else {
					if ( Math.sign(v_prev_y) === Math.sign(v_next_y) ) { direction_eq = true; }
				}
			}

			if ( direction_eq ) {
				// console.log("Warning: lines are a straight sequence");
				v_trans_x = - v_prev_y;
				v_trans_y =  v_prev_x;
				shrink_by = Math.sqrt( v_prev_lensq );
			} else {
				// console.log("Warning: lines are a straight spike");
				v_trans_x = v_prev_x;
				v_trans_y = v_prev_y;
				shrink_by = Math.sqrt( v_prev_lensq / 2 );
			}

		}

		return	new THREE.Vector2( v_trans_x / shrink_by, v_trans_y / shrink_by );

	}


	var contourMovements = [];

	for ( var i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

		if ( j === il ) j = 0;
		if ( k === il ) k = 0;

		//  (j)---(i)---(k)
		// console.log('i,j,k', i, j , k)

		contourMovements[ i ] = getBevelVec( contour[ i ], contour[ j ], contour[ k ] );

	}

	var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();

	for ( h = 0, hl = holes.length; h < hl; h ++ ) {

		ahole = holes[ h ];

		oneHoleMovements = [];

		for ( i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++ ) {

			if ( j === il ) j = 0;
			if ( k === il ) k = 0;

			//  (j)---(i)---(k)
			oneHoleMovements[ i ] = getBevelVec( ahole[ i ], ahole[ j ], ahole[ k ] );

		}

		holesMovements.push( oneHoleMovements );
		verticesMovements = verticesMovements.concat( oneHoleMovements );

	}


	// Loop bevelSegments, 1 for the front, 1 for the back

	for ( b = 0; b < bevelSegments; b ++ ) {
	//for ( b = bevelSegments; b > 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );

		//z = bevelThickness * t;
		bs = bevelSize * ( Math.sin ( t * Math.PI / 2 ) ) ; // curved
		//bs = bevelSize * t ; // linear

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );

			v( vert.x, vert.y,  - z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				v( vert.x, vert.y,  - z );

			}

		}

	}

	bs = bevelSize;

	// Back facing vertices

	for ( i = 0; i < vlen; i ++ ) {

		vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

		if ( ! extrudeByPath ) {

			v( vert.x, vert.y, 0 );

		} else {

			// v( vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x );

			normal.copy( splineTube.normals[0] ).multiplyScalar(vert.x);
			binormal.copy( splineTube.binormals[0] ).multiplyScalar(vert.y);

			position2.copy( extrudePts[0] ).add(normal).add(binormal);

			v( position2.x, position2.y, position2.z );

		}

	}

	// Add stepped vertices...
	// Including front facing vertices

	var s;

	for ( s = 1; s <= steps; s ++ ) {

		for ( i = 0; i < vlen; i ++ ) {

			vert = bevelEnabled ? scalePt2( vertices[ i ], verticesMovements[ i ], bs ) : vertices[ i ];

			if ( ! extrudeByPath ) {

				v( vert.x, vert.y, amount / steps * s );

			} else {

				// v( vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x );

				normal.copy( splineTube.normals[s] ).multiplyScalar( vert.x );
				binormal.copy( splineTube.binormals[s] ).multiplyScalar( vert.y );

				position2.copy( extrudePts[s] ).add( normal ).add( binormal );

				v( position2.x, position2.y, position2.z );

			}

		}

	}


	// Add bevel segments planes

	//for ( b = 1; b <= bevelSegments; b ++ ) {
	for ( b = bevelSegments - 1; b >= 0; b -- ) {

		t = b / bevelSegments;
		z = bevelThickness * ( 1 - t );
		//bs = bevelSize * ( 1-Math.sin ( ( 1 - t ) * Math.PI/2 ) );
		bs = bevelSize * Math.sin ( t * Math.PI / 2 ) ;

		// contract shape

		for ( i = 0, il = contour.length; i < il; i ++ ) {

			vert = scalePt2( contour[ i ], contourMovements[ i ], bs );
			v( vert.x, vert.y,  amount + z );

		}

		// expand holes

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			oneHoleMovements = holesMovements[ h ];

			for ( i = 0, il = ahole.length; i < il; i ++ ) {

				vert = scalePt2( ahole[ i ], oneHoleMovements[ i ], bs );

				if ( ! extrudeByPath ) {

					v( vert.x, vert.y,  amount + z );

				} else {

					v( vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z );

				}

			}

		}

	}

	/* Faces */

	// Top and bottom faces

	buildLidFaces();

	// Sides faces

	buildSideFaces();


	/////  Internal functions

	function buildLidFaces() {

		if ( bevelEnabled ) {

			var layer = 0 ; // steps + 1
			var offset = vlen * layer;

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ] + offset, face[ 1 ] + offset, face[ 0 ] + offset );

			}

			layer = steps + bevelSegments * 2;
			offset = vlen * layer;

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset );

			}

		} else {

			// Bottom faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 2 ], face[ 1 ], face[ 0 ] );

			}

			// Top faces

			for ( i = 0; i < flen; i ++ ) {

				face = faces[ i ];
				f3( face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps );

			}
		}

	}

	// Create faces for the z-sides of the shape

	function buildSideFaces() {

		var layeroffset = 0;
		sidewalls( contour, layeroffset );
		layeroffset += contour.length;

		for ( h = 0, hl = holes.length; h < hl; h ++ ) {

			ahole = holes[ h ];
			sidewalls( ahole, layeroffset );

			//, true
			layeroffset += ahole.length;

		}

	}

	function sidewalls( contour, layeroffset ) {

		var j, k;
		i = contour.length;

		while ( -- i >= 0 ) {

			j = i;
			k = i - 1;
			if ( k < 0 ) k = contour.length - 1;

			//console.log('b', i,j, i-1, k,vertices.length);

			var s = 0, sl = steps  + bevelSegments * 2;

			for ( s = 0; s < sl; s ++ ) {

				var slen1 = vlen * s;
				var slen2 = vlen * ( s + 1 );

				var a = layeroffset + j + slen1,
					b = layeroffset + k + slen1,
					c = layeroffset + k + slen2,
					d = layeroffset + j + slen2;

				f4( a, b, c, d, contour, s, sl, j, k );

			}
		}

	}


	function v( x, y, z ) {

		scope.vertices.push( new THREE.Vector3( x, y, z ) );

	}

	function f3( a, b, c ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, c ) );

		var uvs = uvgen.generateTopUV( scope, a, b, c );

		scope.faceVertexUvs[ 0 ].push( uvs );

	}

	function f4( a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2 ) {

		a += shapesOffset;
		b += shapesOffset;
		c += shapesOffset;
		d += shapesOffset;

		scope.faces.push( new THREE.Face3( a, b, d ) );
		scope.faces.push( new THREE.Face3( b, c, d ) );

		var uvs = uvgen.generateSideWallUV( scope, a, b, c, d );

		scope.faceVertexUvs[ 0 ].push( [ uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] ] );
		scope.faceVertexUvs[ 0 ].push( [ uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] ] );

	}

};

THREE.ExtrudeGeometry.WorldUVGenerator = {

	generateTopUV: function ( geometry, indexA, indexB, indexC ) {

		var vertices = geometry.vertices;

		var a = vertices[ indexA ];
		var b = vertices[ indexB ];
		var c = vertices[ indexC ];

		return [
			new THREE.Vector2( a.x, a.y ),
			new THREE.Vector2( b.x, b.y ),
			new THREE.Vector2( c.x, c.y )
		];

	},

	generateSideWallUV: function ( geometry, indexA, indexB, indexC, indexD ) {

		var vertices = geometry.vertices;

		var a = vertices[ indexA ];
		var b = vertices[ indexB ];
		var c = vertices[ indexC ];
		var d = vertices[ indexD ];

		if ( Math.abs( a.y - b.y ) < 0.01 ) {
			return [
				new THREE.Vector2( a.x, 1 - a.z ),
				new THREE.Vector2( b.x, 1 - b.z ),
				new THREE.Vector2( c.x, 1 - c.z ),
				new THREE.Vector2( d.x, 1 - d.z )
			];
		} else {
			return [
				new THREE.Vector2( a.y, 1 - a.z ),
				new THREE.Vector2( b.y, 1 - b.z ),
				new THREE.Vector2( c.y, 1 - c.z ),
				new THREE.Vector2( d.y, 1 - d.z )
			];
		}
	}
};

// File:src/extras/geometries/ShapeGeometry.js

/**
 * @author jonobr1 / http://jonobr1.com
 *
 * Creates a one-sided polygonal geometry from a path shape. Similar to
 * ExtrudeGeometry.
 *
 * parameters = {
 *
 *	curveSegments: <int>, // number of points on the curves. NOT USED AT THE MOMENT.
 *
 *	material: <int> // material index for front and back faces
 *	uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/

THREE.ShapeGeometry = function ( shapes, options ) {

	THREE.Geometry.call( this );

	this.type = 'ShapeGeometry';

	if ( Array.isArray( shapes ) === false ) shapes = [ shapes ];

	this.addShapeList( shapes, options );

	this.computeFaceNormals();

};

THREE.ShapeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ShapeGeometry.prototype.constructor = THREE.ShapeGeometry;

/**
 * Add an array of shapes to THREE.ShapeGeometry.
 */
THREE.ShapeGeometry.prototype.addShapeList = function ( shapes, options ) {

	for ( var i = 0, l = shapes.length; i < l; i ++ ) {

		this.addShape( shapes[ i ], options );

	}

	return this;

};

/**
 * Adds a shape to THREE.ShapeGeometry, based on THREE.ExtrudeGeometry.
 */
THREE.ShapeGeometry.prototype.addShape = function ( shape, options ) {

	if ( options === undefined ) options = {};
	var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

	var material = options.material;
	var uvgen = options.UVGenerator === undefined ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator;

	//

	var i, l, hole;

	var shapesOffset = this.vertices.length;
	var shapePoints = shape.extractPoints( curveSegments );

	var vertices = shapePoints.shape;
	var holes = shapePoints.holes;

	var reverse = ! THREE.Shape.Utils.isClockWise( vertices );

	if ( reverse ) {

		vertices = vertices.reverse();

		// Maybe we should also check if holes are in the opposite direction, just to be safe...

		for ( i = 0, l = holes.length; i < l; i ++ ) {

			hole = holes[ i ];

			if ( THREE.Shape.Utils.isClockWise( hole ) ) {

				holes[ i ] = hole.reverse();

			}

		}

		reverse = false;

	}

	var faces = THREE.Shape.Utils.triangulateShape( vertices, holes );

	// Vertices

	var contour = vertices;

	for ( i = 0, l = holes.length; i < l; i ++ ) {

		hole = holes[ i ];
		vertices = vertices.concat( hole );

	}

	//

	var vert, vlen = vertices.length;
	var face, flen = faces.length;

	for ( i = 0; i < vlen; i ++ ) {

		vert = vertices[ i ];

		this.vertices.push( new THREE.Vector3( vert.x, vert.y, 0 ) );

	}

	for ( i = 0; i < flen; i ++ ) {

		face = faces[ i ];

		var a = face[ 0 ] + shapesOffset;
		var b = face[ 1 ] + shapesOffset;
		var c = face[ 2 ] + shapesOffset;

		this.faces.push( new THREE.Face3( a, b, c, null, null, material ) );
		this.faceVertexUvs[ 0 ].push( uvgen.generateTopUV( this, a, b, c ) );

	}

};

// File:src/extras/geometries/LatheGeometry.js

/**
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://exocortex.com
 */

// points - to create a closed torus, one must use a set of points 
//    like so: [ a, b, c, d, a ], see first is the same as last.
// segments - the number of circumference segments to create
// phiStart - the starting radian
// phiLength - the radian (0 to 2*PI) range of the lathed section
//    2*pi is a closed lathe, less than 2PI is a portion.

THREE.LatheGeometry = function ( points, segments, phiStart, phiLength ) {

	THREE.Geometry.call( this );

	this.type = 'LatheGeometry';

	this.parameters = {
		points: points,
		segments: segments,
		phiStart: phiStart,
		phiLength: phiLength
	};

	segments = segments || 12;
	phiStart = phiStart || 0;
	phiLength = phiLength || 2 * Math.PI;

	var inversePointLength = 1.0 / ( points.length - 1 );
	var inverseSegments = 1.0 / segments;

	for ( var i = 0, il = segments; i <= il; i ++ ) {

		var phi = phiStart + i * inverseSegments * phiLength;

		var c = Math.cos( phi ),
			s = Math.sin( phi );

		for ( var j = 0, jl = points.length; j < jl; j ++ ) {

			var pt = points[ j ];

			var vertex = new THREE.Vector3();

			vertex.x = c * pt.x - s * pt.y;
			vertex.y = s * pt.x + c * pt.y;
			vertex.z = pt.z;

			this.vertices.push( vertex );

		}

	}

	var np = points.length;

	for ( var i = 0, il = segments; i < il; i ++ ) {

		for ( var j = 0, jl = points.length - 1; j < jl; j ++ ) {

			var base = j + np * i;
			var a = base;
			var b = base + np;
			var c = base + 1 + np;
			var d = base + 1;

			var u0 = i * inverseSegments;
			var v0 = j * inversePointLength;
			var u1 = u0 + inverseSegments;
			var v1 = v0 + inversePointLength;

			this.faces.push( new THREE.Face3( a, b, d ) );

			this.faceVertexUvs[ 0 ].push( [

				new THREE.Vector2( u0, v0 ),
				new THREE.Vector2( u1, v0 ),
				new THREE.Vector2( u0, v1 )

			] );

			this.faces.push( new THREE.Face3( b, c, d ) );

			this.faceVertexUvs[ 0 ].push( [

				new THREE.Vector2( u1, v0 ),
				new THREE.Vector2( u1, v1 ),
				new THREE.Vector2( u0, v1 )

			] );


		}

	}

	this.mergeVertices();
	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.LatheGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.LatheGeometry.prototype.constructor = THREE.LatheGeometry;

// File:src/extras/geometries/PlaneGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneGeometry = function ( width, height, widthSegments, heightSegments ) {

	THREE.Geometry.call( this );

	this.type = 'PlaneGeometry';

	this.parameters = {
		width: width,
		height: height,
		widthSegments: widthSegments,
		heightSegments: heightSegments
	};

	this.fromBufferGeometry( new THREE.PlaneBufferGeometry( width, height, widthSegments, heightSegments ) );

};

THREE.PlaneGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.PlaneGeometry.prototype.constructor = THREE.PlaneGeometry;

// File:src/extras/geometries/PlaneBufferGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

THREE.PlaneBufferGeometry = function ( width, height, widthSegments, heightSegments ) {

	THREE.BufferGeometry.call( this );

	this.type = 'PlaneBufferGeometry';

	this.parameters = {
		width: width,
		height: height,
		widthSegments: widthSegments,
		heightSegments: heightSegments
	};

	var width_half = width / 2;
	var height_half = height / 2;

	var gridX = Math.floor( widthSegments ) || 1;
	var gridY = Math.floor( heightSegments ) || 1;

	var gridX1 = gridX + 1;
	var gridY1 = gridY + 1;

	var segment_width = width / gridX;
	var segment_height = height / gridY;

	var vertices = new Float32Array( gridX1 * gridY1 * 3 );
	var normals = new Float32Array( gridX1 * gridY1 * 3 );
	var uvs = new Float32Array( gridX1 * gridY1 * 2 );

	var offset = 0;
	var offset2 = 0;

	for ( var iy = 0; iy < gridY1; iy ++ ) {

		var y = iy * segment_height - height_half;

		for ( var ix = 0; ix < gridX1; ix ++ ) {

			var x = ix * segment_width - width_half;

			vertices[ offset     ] = x;
			vertices[ offset + 1 ] = - y;

			normals[ offset + 2 ] = 1;

			uvs[ offset2     ] = ix / gridX;
			uvs[ offset2 + 1 ] = 1 - ( iy / gridY );

			offset += 3;
			offset2 += 2;

		}

	}

	offset = 0;

	var indices = new ( ( vertices.length / 3 ) > 65535 ? Uint32Array : Uint16Array )( gridX * gridY * 6 );

	for ( var iy = 0; iy < gridY; iy ++ ) {

		for ( var ix = 0; ix < gridX; ix ++ ) {

			var a = ix + gridX1 * iy;
			var b = ix + gridX1 * ( iy + 1 );
			var c = ( ix + 1 ) + gridX1 * ( iy + 1 );
			var d = ( ix + 1 ) + gridX1 * iy;

			indices[ offset     ] = a;
			indices[ offset + 1 ] = b;
			indices[ offset + 2 ] = d;

			indices[ offset + 3 ] = b;
			indices[ offset + 4 ] = c;
			indices[ offset + 5 ] = d;

			offset += 6;

		}

	}

	this.addAttribute( 'index', new THREE.BufferAttribute( indices, 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

};

THREE.PlaneBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.PlaneBufferGeometry.prototype.constructor = THREE.PlaneBufferGeometry;

// File:src/extras/geometries/RingGeometry.js

/**
 * @author Kaleb Murphy
 */

THREE.RingGeometry = function ( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength ) {

	THREE.Geometry.call( this );

	this.type = 'RingGeometry';

	this.parameters = {
		innerRadius: innerRadius,
		outerRadius: outerRadius,
		thetaSegments: thetaSegments,
		phiSegments: phiSegments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	innerRadius = innerRadius || 0;
	outerRadius = outerRadius || 50;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	thetaSegments = thetaSegments !== undefined ? Math.max( 3, thetaSegments ) : 8;
	phiSegments = phiSegments !== undefined ? Math.max( 1, phiSegments ) : 8;

	var i, o, uvs = [], radius = innerRadius, radiusStep = ( ( outerRadius - innerRadius ) / phiSegments );

	for ( i = 0; i < phiSegments + 1; i ++ ) { // concentric circles inside ring

		for ( o = 0; o < thetaSegments + 1; o ++ ) { // number of segments per circle

			var vertex = new THREE.Vector3();
			var segment = thetaStart + o / thetaSegments * thetaLength;
			vertex.x = radius * Math.cos( segment );
			vertex.y = radius * Math.sin( segment );

			this.vertices.push( vertex );
			uvs.push( new THREE.Vector2( ( vertex.x / outerRadius + 1 ) / 2, ( vertex.y / outerRadius + 1 ) / 2 ) );
		}

		radius += radiusStep;

	}

	var n = new THREE.Vector3( 0, 0, 1 );

	for ( i = 0; i < phiSegments; i ++ ) { // concentric circles inside ring

		var thetaSegment = i * (thetaSegments + 1);

		for ( o = 0; o < thetaSegments ; o ++ ) { // number of segments per circle

			var segment = o + thetaSegment;

			var v1 = segment;
			var v2 = segment + thetaSegments + 1;
			var v3 = segment + thetaSegments + 2;

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
			this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ].clone(), uvs[ v2 ].clone(), uvs[ v3 ].clone() ]);

			v1 = segment;
			v2 = segment + thetaSegments + 2;
			v3 = segment + 1;

			this.faces.push( new THREE.Face3( v1, v2, v3, [ n.clone(), n.clone(), n.clone() ] ) );
			this.faceVertexUvs[ 0 ].push( [ uvs[ v1 ].clone(), uvs[ v2 ].clone(), uvs[ v3 ].clone() ]);

		}
	}

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.RingGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.RingGeometry.prototype.constructor = THREE.RingGeometry;


// File:src/extras/geometries/SphereGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.SphereGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	console.log( 'THREE.SphereGeometry: Consider using THREE.SphereBufferGeometry for lower memory footprint.' );

	THREE.Geometry.call( this );

	this.type = 'SphereGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;

	widthSegments = Math.max( 2, Math.floor( widthSegments ) || 8 );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= widthSegments; x ++ ) {

			var u = x / widthSegments;
			var v = y / heightSegments;

			var vertex = new THREE.Vector3();
			vertex.x = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			vertex.y = radius * Math.cos( thetaStart + v * thetaLength );
			vertex.z = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < heightSegments; y ++ ) {

		for ( x = 0; x < widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === radius ) {

				uv1.x = ( uv1.x + uv2.x ) / 2;
				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === radius ) {

				uv3.x = ( uv3.x + uv4.x ) / 2;
				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face3( v1, v2, v4, [ n1, n2, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv4 ] );

				this.faces.push( new THREE.Face3( v2, v3, v4, [ n2.clone(), n3, n4.clone() ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv2.clone(), uv3, uv4.clone() ] );

			}

		}

	}

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.SphereGeometry.prototype.constructor = THREE.SphereGeometry;

// File:src/extras/geometries/SphereBufferGeometry.js

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 * based on THREE.SphereGeometry
 */

THREE.SphereBufferGeometry = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'SphereBufferGeometry';

	this.parameters = {
		radius: radius,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		phiStart: phiStart,
		phiLength: phiLength,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;

	widthSegments = Math.max( 2, Math.floor( widthSegments ) || 8 );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var vertexCount = ( ( widthSegments + 1 ) * ( heightSegments + 1 ) );

	var positions = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3 );
	var normals = new THREE.BufferAttribute( new Float32Array( vertexCount * 3 ), 3);
	var uvs = new THREE.BufferAttribute( new Float32Array( vertexCount * 2 ), 2 );

	var index = 0, vertices = [], normal = new THREE.Vector3();

	for ( var y = 0; y <= heightSegments; y ++ ) {

		var verticesRow = [];

		var v = y / heightSegments;

		for ( var x = 0; x <= widthSegments; x ++ ) {

			var u = x / widthSegments;

			var px = - radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );
			var py = radius * Math.cos( thetaStart + v * thetaLength );
			var pz = radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength );

			normal.set( px, py, pz ).normalize();

			positions.setXYZ( index, px, py, pz );
			normals.setXYZ( index, normal.x, normal.y, normal.z );
			uvs.setXY( index, u, 1 - v );

			verticesRow.push( index );

			index++;

		}

		vertices.push( verticesRow );

	}

	var indices = [];

	for ( var y = 0; y < heightSegments; y ++ ) {

		for ( var x = 0; x < widthSegments; x ++ ) {

			var v1 = vertices[ y     ][ x + 1 ];
			var v2 = vertices[ y     ][ x     ];
			var v3 = vertices[ y + 1 ][ x     ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			if ( y !== 0 ) indices.push( v1, v2, v4 );
			if ( y !== heightSegments - 1 ) indices.push( v2, v3, v4 );

		}

	}

	this.addAttribute( 'index', new THREE.BufferAttribute( new Uint16Array( indices ), 1 ) );
	this.addAttribute( 'position', positions );
	this.addAttribute( 'normal', normals );
	this.addAttribute( 'uv', uvs );

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.SphereBufferGeometry.prototype.constructor = THREE.SphereBufferGeometry;

// File:src/extras/geometries/TextGeometry.js

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * For creating 3D text geometry in three.js
 *
 * Text = 3D Text
 *
 * parameters = {
 *  size: 			<float>, 	// size of the text
 *  height: 		<float>, 	// thickness to extrude text
 *  curveSegments: 	<int>,		// number of points on the curves
 *
 *  font: 			<string>,		// font name
 *  weight: 		<string>,		// font weight (normal, bold)
 *  style: 			<string>,		// font style  (normal, italics)
 *
 *  bevelEnabled:	<bool>,			// turn on bevel
 *  bevelThickness: <float>, 		// how deep into text bevel goes
 *  bevelSize:		<float>, 		// how far from text outline is bevel
 *  }
 *
 */

/*	Usage Examples

	// TextGeometry wrapper

	var text3d = new TextGeometry( text, options );

	// Complete manner

	var textShapes = THREE.FontUtils.generateShapes( text, options );
	var text3d = new ExtrudeGeometry( textShapes, options );

*/


THREE.TextGeometry = function ( text, parameters ) {

	parameters = parameters || {};

	var textShapes = THREE.FontUtils.generateShapes( text, parameters );

	// translate parameters to ExtrudeGeometry API

	parameters.amount = parameters.height !== undefined ? parameters.height : 50;

	// defaults

	if ( parameters.bevelThickness === undefined ) parameters.bevelThickness = 10;
	if ( parameters.bevelSize === undefined ) parameters.bevelSize = 8;
	if ( parameters.bevelEnabled === undefined ) parameters.bevelEnabled = false;

	THREE.ExtrudeGeometry.call( this, textShapes, parameters );

	this.type = 'TextGeometry';

};

THREE.TextGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );
THREE.TextGeometry.prototype.constructor = THREE.TextGeometry;

// File:src/extras/geometries/TorusGeometry.js

/**
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

THREE.TorusGeometry = function ( radius, tube, radialSegments, tubularSegments, arc ) {

	THREE.Geometry.call( this );

	this.type = 'TorusGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		arc: arc
	};

	radius = radius || 100;
	tube = tube || 40;
	radialSegments = radialSegments || 8;
	tubularSegments = tubularSegments || 6;
	arc = arc || Math.PI * 2;

	var center = new THREE.Vector3(), uvs = [], normals = [];

	for ( var j = 0; j <= radialSegments; j ++ ) {

		for ( var i = 0; i <= tubularSegments; i ++ ) {

			var u = i / tubularSegments * arc;
			var v = j / radialSegments * Math.PI * 2;

			center.x = radius * Math.cos( u );
			center.y = radius * Math.sin( u );

			var vertex = new THREE.Vector3();
			vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
			vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
			vertex.z = tube * Math.sin( v );

			this.vertices.push( vertex );

			uvs.push( new THREE.Vector2( i / tubularSegments, j / radialSegments ) );
			normals.push( vertex.clone().sub( center ).normalize() );

		}

	}

	for ( var j = 1; j <= radialSegments; j ++ ) {

		for ( var i = 1; i <= tubularSegments; i ++ ) {

			var a = ( tubularSegments + 1 ) * j + i - 1;
			var b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
			var c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
			var d = ( tubularSegments + 1 ) * j + i;

			var face = new THREE.Face3( a, b, d, [ normals[ a ].clone(), normals[ b ].clone(), normals[ d ].clone() ] );
			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uvs[ a ].clone(), uvs[ b ].clone(), uvs[ d ].clone() ] );

			face = new THREE.Face3( b, c, d, [ normals[ b ].clone(), normals[ c ].clone(), normals[ d ].clone() ] );
			this.faces.push( face );
			this.faceVertexUvs[ 0 ].push( [ uvs[ b ].clone(), uvs[ c ].clone(), uvs[ d ].clone() ] );

		}

	}

	this.computeFaceNormals();

};

THREE.TorusGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TorusGeometry.prototype.constructor = THREE.TorusGeometry;

// File:src/extras/geometries/TorusKnotGeometry.js

/**
 * @author oosmoxiecode
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3D/src/away3d/primitives/TorusKnot.as?spec=svn2473&r=2473
 */

THREE.TorusKnotGeometry = function ( radius, tube, radialSegments, tubularSegments, p, q, heightScale ) {

	THREE.Geometry.call( this );

	this.type = 'TorusKnotGeometry';

	this.parameters = {
		radius: radius,
		tube: tube,
		radialSegments: radialSegments,
		tubularSegments: tubularSegments,
		p: p,
		q: q,
		heightScale: heightScale
	};

	radius = radius || 100;
	tube = tube || 40;
	radialSegments = radialSegments || 64;
	tubularSegments = tubularSegments || 8;
	p = p || 2;
	q = q || 3;
	heightScale = heightScale || 1;
	
	var grid = new Array( radialSegments );
	var tang = new THREE.Vector3();
	var n = new THREE.Vector3();
	var bitan = new THREE.Vector3();

	for ( var i = 0; i < radialSegments; ++ i ) {

		grid[ i ] = new Array( tubularSegments );
		var u = i / radialSegments * 2 * p * Math.PI;
		var p1 = getPos( u, q, p, radius, heightScale );
		var p2 = getPos( u + 0.01, q, p, radius, heightScale );
		tang.subVectors( p2, p1 );
		n.addVectors( p2, p1 );

		bitan.crossVectors( tang, n );
		n.crossVectors( bitan, tang );
		bitan.normalize();
		n.normalize();

		for ( var j = 0; j < tubularSegments; ++ j ) {

			var v = j / tubularSegments * 2 * Math.PI;
			var cx = - tube * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			var cy = tube * Math.sin( v );

			var pos = new THREE.Vector3();
			pos.x = p1.x + cx * n.x + cy * bitan.x;
			pos.y = p1.y + cx * n.y + cy * bitan.y;
			pos.z = p1.z + cx * n.z + cy * bitan.z;

			grid[ i ][ j ] = this.vertices.push( pos ) - 1;

		}

	}

	for ( var i = 0; i < radialSegments; ++ i ) {

		for ( var j = 0; j < tubularSegments; ++ j ) {

			var ip = ( i + 1 ) % radialSegments;
			var jp = ( j + 1 ) % tubularSegments;

			var a = grid[ i ][ j ];
			var b = grid[ ip ][ j ];
			var c = grid[ ip ][ jp ];
			var d = grid[ i ][ jp ];

			var uva = new THREE.Vector2( i / radialSegments, j / tubularSegments );
			var uvb = new THREE.Vector2( ( i + 1 ) / radialSegments, j / tubularSegments );
			var uvc = new THREE.Vector2( ( i + 1 ) / radialSegments, ( j + 1 ) / tubularSegments );
			var uvd = new THREE.Vector2( i / radialSegments, ( j + 1 ) / tubularSegments );

			this.faces.push( new THREE.Face3( a, b, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

			this.faces.push( new THREE.Face3( b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

		}
	}

	this.computeFaceNormals();
	this.computeVertexNormals();

	function getPos( u, in_q, in_p, radius, heightScale ) {

		var cu = Math.cos( u );
		var su = Math.sin( u );
		var quOverP = in_q / in_p * u;
		var cs = Math.cos( quOverP );

		var tx = radius * ( 2 + cs ) * 0.5 * cu;
		var ty = radius * ( 2 + cs ) * su * 0.5;
		var tz = heightScale * radius * Math.sin( quOverP ) * 0.5;

		return new THREE.Vector3( tx, ty, tz );

	}

};

THREE.TorusKnotGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TorusKnotGeometry.prototype.constructor = THREE.TorusKnotGeometry;

// File:src/extras/geometries/TubeGeometry.js

/**
 * @author WestLangley / https://github.com/WestLangley
 * @author zz85 / https://github.com/zz85
 * @author miningold / https://github.com/miningold
 * @author jonobr1 / https://github.com/jonobr1
 *
 * Modified from the TorusKnotGeometry by @oosmoxiecode
 *
 * Creates a tube which extrudes along a 3d spline
 *
 * Uses parallel transport frames as described in
 * http://www.cs.indiana.edu/pub/techreports/TR425.pdf
 */

THREE.TubeGeometry = function ( path, segments, radius, radialSegments, closed, taper ) {

	THREE.Geometry.call( this );

	this.type = 'TubeGeometry';

	this.parameters = {
		path: path,
		segments: segments,
		radius: radius,
		radialSegments: radialSegments,
		closed: closed
	};

	segments = segments || 64;
	radius = radius || 1;
	radialSegments = radialSegments || 8;
	closed = closed || false;
	taper = taper || THREE.TubeGeometry.NoTaper;

	var grid = [];

	var scope = this,

		tangent,
		normal,
		binormal,

		numpoints = segments + 1,

		u, v, r,

		cx, cy,
		pos, pos2 = new THREE.Vector3(),
		i, j,
		ip, jp,
		a, b, c, d,
		uva, uvb, uvc, uvd;

	var frames = new THREE.TubeGeometry.FrenetFrames( path, segments, closed ),
		tangents = frames.tangents,
		normals = frames.normals,
		binormals = frames.binormals;

	// proxy internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;

	function vert( x, y, z ) {

		return scope.vertices.push( new THREE.Vector3( x, y, z ) ) - 1;

	}

	// consruct the grid

	for ( i = 0; i < numpoints; i ++ ) {

		grid[ i ] = [];

		u = i / ( numpoints - 1 );

		pos = path.getPointAt( u );

		tangent = tangents[ i ];
		normal = normals[ i ];
		binormal = binormals[ i ];

		r = radius * taper( u );

		for ( j = 0; j < radialSegments; j ++ ) {

			v = j / radialSegments * 2 * Math.PI;

			cx = - r * Math.cos( v ); // TODO: Hack: Negating it so it faces outside.
			cy = r * Math.sin( v );

			pos2.copy( pos );
			pos2.x += cx * normal.x + cy * binormal.x;
			pos2.y += cx * normal.y + cy * binormal.y;
			pos2.z += cx * normal.z + cy * binormal.z;

			grid[ i ][ j ] = vert( pos2.x, pos2.y, pos2.z );

		}
	}


	// construct the mesh

	for ( i = 0; i < segments; i ++ ) {

		for ( j = 0; j < radialSegments; j ++ ) {

			ip = ( closed ) ? (i + 1) % segments : i + 1;
			jp = (j + 1) % radialSegments;

			a = grid[ i ][ j ];		// *** NOT NECESSARILY PLANAR ! ***
			b = grid[ ip ][ j ];
			c = grid[ ip ][ jp ];
			d = grid[ i ][ jp ];

			uva = new THREE.Vector2( i / segments, j / radialSegments );
			uvb = new THREE.Vector2( ( i + 1 ) / segments, j / radialSegments );
			uvc = new THREE.Vector2( ( i + 1 ) / segments, ( j + 1 ) / radialSegments );
			uvd = new THREE.Vector2( i / segments, ( j + 1 ) / radialSegments );

			this.faces.push( new THREE.Face3( a, b, d ) );
			this.faceVertexUvs[ 0 ].push( [ uva, uvb, uvd ] );

			this.faces.push( new THREE.Face3( b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [ uvb.clone(), uvc, uvd.clone() ] );

		}
	}

	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.TubeGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TubeGeometry.prototype.constructor = THREE.TubeGeometry;

THREE.TubeGeometry.NoTaper = function ( u ) {

	return 1;

};

THREE.TubeGeometry.SinusoidalTaper = function ( u ) {

	return Math.sin( Math.PI * u );

};

// For computing of Frenet frames, exposing the tangents, normals and binormals the spline
THREE.TubeGeometry.FrenetFrames = function ( path, segments, closed ) {

	var	normal = new THREE.Vector3(),

		tangents = [],
		normals = [],
		binormals = [],

		vec = new THREE.Vector3(),
		mat = new THREE.Matrix4(),

		numpoints = segments + 1,
		theta,
		epsilon = 0.0001,
		smallest,

		tx, ty, tz,
		i, u;


	// expose internals
	this.tangents = tangents;
	this.normals = normals;
	this.binormals = binormals;

	// compute the tangent vectors for each segment on the path

	for ( i = 0; i < numpoints; i ++ ) {

		u = i / ( numpoints - 1 );

		tangents[ i ] = path.getTangentAt( u );
		tangents[ i ].normalize();

	}

	initialNormal3();

	/*
	function initialNormal1(lastBinormal) {
		// fixed start binormal. Has dangers of 0 vectors
		normals[ 0 ] = new THREE.Vector3();
		binormals[ 0 ] = new THREE.Vector3();
		if (lastBinormal===undefined) lastBinormal = new THREE.Vector3( 0, 0, 1 );
		normals[ 0 ].crossVectors( lastBinormal, tangents[ 0 ] ).normalize();
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();
	}

	function initialNormal2() {

		// This uses the Frenet-Serret formula for deriving binormal
		var t2 = path.getTangentAt( epsilon );

		normals[ 0 ] = new THREE.Vector3().subVectors( t2, tangents[ 0 ] ).normalize();
		binormals[ 0 ] = new THREE.Vector3().crossVectors( tangents[ 0 ], normals[ 0 ] );

		normals[ 0 ].crossVectors( binormals[ 0 ], tangents[ 0 ] ).normalize(); // last binormal x tangent
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] ).normalize();

	}
	*/

	function initialNormal3() {
		// select an initial normal vector perpenicular to the first tangent vector,
		// and in the direction of the smallest tangent xyz component

		normals[ 0 ] = new THREE.Vector3();
		binormals[ 0 ] = new THREE.Vector3();
		smallest = Number.MAX_VALUE;
		tx = Math.abs( tangents[ 0 ].x );
		ty = Math.abs( tangents[ 0 ].y );
		tz = Math.abs( tangents[ 0 ].z );

		if ( tx <= smallest ) {
			smallest = tx;
			normal.set( 1, 0, 0 );
		}

		if ( ty <= smallest ) {
			smallest = ty;
			normal.set( 0, 1, 0 );
		}

		if ( tz <= smallest ) {
			normal.set( 0, 0, 1 );
		}

		vec.crossVectors( tangents[ 0 ], normal ).normalize();

		normals[ 0 ].crossVectors( tangents[ 0 ], vec );
		binormals[ 0 ].crossVectors( tangents[ 0 ], normals[ 0 ] );
	}


	// compute the slowly-varying normal and binormal vectors for each segment on the path

	for ( i = 1; i < numpoints; i ++ ) {

		normals[ i ] = normals[ i - 1 ].clone();

		binormals[ i ] = binormals[ i - 1 ].clone();

		vec.crossVectors( tangents[ i - 1 ], tangents[ i ] );

		if ( vec.length() > epsilon ) {

			vec.normalize();

			theta = Math.acos( THREE.Math.clamp( tangents[ i - 1 ].dot( tangents[ i ] ), - 1, 1 ) ); // clamp for floating pt errors

			normals[ i ].applyMatrix4( mat.makeRotationAxis( vec, theta ) );

		}

		binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

	}


	// if the curve is closed, postprocess the vectors so the first and last normal vectors are the same

	if ( closed ) {

		theta = Math.acos( THREE.Math.clamp( normals[ 0 ].dot( normals[ numpoints - 1 ] ), - 1, 1 ) );
		theta /= ( numpoints - 1 );

		if ( tangents[ 0 ].dot( vec.crossVectors( normals[ 0 ], normals[ numpoints - 1 ] ) ) > 0 ) {

			theta = - theta;

		}

		for ( i = 1; i < numpoints; i ++ ) {

			// twist a little...
			normals[ i ].applyMatrix4( mat.makeRotationAxis( tangents[ i ], theta * i ) );
			binormals[ i ].crossVectors( tangents[ i ], normals[ i ] );

		}

	}
};

// File:src/extras/geometries/PolyhedronGeometry.js

/**
 * @author clockworkgeek / https://github.com/clockworkgeek
 * @author timothypratley / https://github.com/timothypratley
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.PolyhedronGeometry = function ( vertices, indices, radius, detail ) {

	THREE.Geometry.call( this );

	this.type = 'PolyhedronGeometry';

	this.parameters = {
		vertices: vertices,
		indices: indices,
		radius: radius,
		detail: detail
	};

	radius = radius || 1;
	detail = detail || 0;

	var that = this;

	for ( var i = 0, l = vertices.length; i < l; i += 3 ) {

		prepare( new THREE.Vector3( vertices[ i ], vertices[ i + 1 ], vertices[ i + 2 ] ) );

	}

	var p = this.vertices;

	var faces = [];

	for ( var i = 0, j = 0, l = indices.length; i < l; i += 3, j ++ ) {

		var v1 = p[ indices[ i     ] ];
		var v2 = p[ indices[ i + 1 ] ];
		var v3 = p[ indices[ i + 2 ] ];

		faces[ j ] = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ] );

	}

	var centroid = new THREE.Vector3();

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		subdivide( faces[ i ], detail );

	}


	// Handle case when face straddles the seam

	for ( var i = 0, l = this.faceVertexUvs[ 0 ].length; i < l; i ++ ) {

		var uvs = this.faceVertexUvs[ 0 ][ i ];

		var x0 = uvs[ 0 ].x;
		var x1 = uvs[ 1 ].x;
		var x2 = uvs[ 2 ].x;

		var max = Math.max( x0, Math.max( x1, x2 ) );
		var min = Math.min( x0, Math.min( x1, x2 ) );

		if ( max > 0.9 && min < 0.1 ) { // 0.9 is somewhat arbitrary

			if ( x0 < 0.2 ) uvs[ 0 ].x += 1;
			if ( x1 < 0.2 ) uvs[ 1 ].x += 1;
			if ( x2 < 0.2 ) uvs[ 2 ].x += 1;

		}

	}


	// Apply radius

	for ( var i = 0, l = this.vertices.length; i < l; i ++ ) {

		this.vertices[ i ].multiplyScalar( radius );

	}


	// Merge vertices

	this.mergeVertices();

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );


	// Project vector onto sphere's surface

	function prepare( vector ) {

		var vertex = vector.normalize().clone();
		vertex.index = that.vertices.push( vertex ) - 1;

		// Texture coords are equivalent to map coords, calculate angle and convert to fraction of a circle.

		var u = azimuth( vector ) / 2 / Math.PI + 0.5;
		var v = inclination( vector ) / Math.PI + 0.5;
		vertex.uv = new THREE.Vector2( u, 1 - v );

		return vertex;

	}


	// Approximate a curved face with recursively sub-divided triangles.

	function make( v1, v2, v3 ) {

		var face = new THREE.Face3( v1.index, v2.index, v3.index, [ v1.clone(), v2.clone(), v3.clone() ] );
		that.faces.push( face );

		centroid.copy( v1 ).add( v2 ).add( v3 ).divideScalar( 3 );

		var azi = azimuth( centroid );

		that.faceVertexUvs[ 0 ].push( [
			correctUV( v1.uv, v1, azi ),
			correctUV( v2.uv, v2, azi ),
			correctUV( v3.uv, v3, azi )
		] );

	}


	// Analytically subdivide a face to the required detail level.

	function subdivide( face, detail ) {

		var cols = Math.pow(2, detail);
		var a = prepare( that.vertices[ face.a ] );
		var b = prepare( that.vertices[ face.b ] );
		var c = prepare( that.vertices[ face.c ] );
		var v = [];

		// Construct all of the vertices for this subdivision.

		for ( var i = 0 ; i <= cols; i ++ ) {

			v[ i ] = [];

			var aj = prepare( a.clone().lerp( c, i / cols ) );
			var bj = prepare( b.clone().lerp( c, i / cols ) );
			var rows = cols - i;

			for ( var j = 0; j <= rows; j ++) {

				if ( j === 0 && i === cols ) {

					v[ i ][ j ] = aj;

				} else {

					v[ i ][ j ] = prepare( aj.clone().lerp( bj, j / rows ) );

				}

			}

		}

		// Construct all of the faces.

		for ( var i = 0; i < cols ; i ++ ) {

			for ( var j = 0; j < 2 * (cols - i) - 1; j ++ ) {

				var k = Math.floor( j / 2 );

				if ( j % 2 === 0 ) {

					make(
						v[ i ][ k + 1],
						v[ i + 1 ][ k ],
						v[ i ][ k ]
					);

				} else {

					make(
						v[ i ][ k + 1 ],
						v[ i + 1][ k + 1],
						v[ i + 1 ][ k ]
					);

				}

			}

		}

	}


	// Angle around the Y axis, counter-clockwise when looking from above.

	function azimuth( vector ) {

		return Math.atan2( vector.z, - vector.x );

	}


	// Angle above the XZ plane.

	function inclination( vector ) {

		return Math.atan2( - vector.y, Math.sqrt( ( vector.x * vector.x ) + ( vector.z * vector.z ) ) );

	}


	// Texture fixing helper. Spheres have some odd behaviours.

	function correctUV( uv, vector, azimuth ) {

		if ( ( azimuth < 0 ) && ( uv.x === 1 ) ) uv = new THREE.Vector2( uv.x - 1, uv.y );
		if ( ( vector.x === 0 ) && ( vector.z === 0 ) ) uv = new THREE.Vector2( azimuth / 2 / Math.PI + 0.5, uv.y );
		return uv.clone();

	}


};

THREE.PolyhedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.PolyhedronGeometry.prototype.constructor = THREE.PolyhedronGeometry;

// File:src/extras/geometries/DodecahedronGeometry.js

/**
 * @author Abe Pazos / https://hamoid.com
 */

THREE.DodecahedronGeometry = function ( radius, detail ) {

	this.parameters = {
		radius: radius,
		detail: detail
	};

	var t = ( 1 + Math.sqrt( 5 ) ) / 2;
	var r = 1 / t;

	var vertices = [

		// (±1, ±1, ±1)
		-1, -1, -1,    -1, -1,  1,
		-1,  1, -1,    -1,  1,  1,
		 1, -1, -1,     1, -1,  1,
		 1,  1, -1,     1,  1,  1,

		// (0, ±1/φ, ±φ)
		 0, -r, -t,     0, -r,  t,
		 0,  r, -t,     0,  r,  t,

		// (±1/φ, ±φ, 0)
		-r, -t,  0,    -r,  t,  0,
		 r, -t,  0,     r,  t,  0,

		// (±φ, 0, ±1/φ)
		-t,  0, -r,     t,  0, -r,
		-t,  0,  r,     t,  0,  r
	];

	var indices = [
		 3, 11,  7,      3,  7, 15,      3, 15, 13,
		 7, 19, 17,      7, 17,  6,      7,  6, 15,
		17,  4,  8,     17,  8, 10,     17, 10,  6,
		 8,  0, 16,      8, 16,  2,      8,  2, 10,
		 0, 12,  1,      0,  1, 18,      0, 18, 16,
		 6, 10,  2,      6,  2, 13,      6, 13, 15,
		 2, 16, 18,      2, 18,  3,      2,  3, 13,
		18,  1,  9,     18,  9, 11,     18, 11,  3,
		 4, 14, 12,      4, 12,  0,      4,  0,  8,
		11,  9,  5,     11,  5, 19,     11, 19,  7,
		19,  5, 14,     19, 14,  4,     19,  4, 17,
		 1, 12, 14,      1, 14,  5,      1,  5,  9
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

};

THREE.DodecahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.DodecahedronGeometry.prototype.constructor = THREE.DodecahedronGeometry;

// File:src/extras/geometries/IcosahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.IcosahedronGeometry = function ( radius, detail ) {

	var t = ( 1 + Math.sqrt( 5 ) ) / 2;

	var vertices = [
		- 1,  t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
		 0, - 1,  t,    0,  1,  t,    0, - 1, - t,    0,  1, - t,
		 t,  0, - 1,    t,  0,  1,   - t,  0, - 1,   - t,  0,  1
	];

	var indices = [
		 0, 11,  5,    0,  5,  1,    0,  1,  7,    0,  7, 10,    0, 10, 11,
		 1,  5,  9,    5, 11,  4,   11, 10,  2,   10,  7,  6,    7,  1,  8,
		 3,  9,  4,    3,  4,  2,    3,  2,  6,    3,  6,  8,    3,  8,  9,
		 4,  9,  5,    2,  4, 11,    6,  2, 10,    8,  6,  7,    9,  8,  1
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'IcosahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};
};

THREE.IcosahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.IcosahedronGeometry.prototype.constructor = THREE.IcosahedronGeometry;

// File:src/extras/geometries/OctahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.OctahedronGeometry = function ( radius, detail ) {

	this.parameters = {
		radius: radius,
		detail: detail
	};

	var vertices = [
		1, 0, 0,   - 1, 0, 0,    0, 1, 0,    0,- 1, 0,    0, 0, 1,    0, 0,- 1
	];

	var indices = [
		0, 2, 4,    0, 4, 3,    0, 3, 5,    0, 5, 2,    1, 2, 5,    1, 5, 3,    1, 3, 4,    1, 4, 2
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'OctahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};
};

THREE.OctahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.OctahedronGeometry.prototype.constructor = THREE.OctahedronGeometry;

// File:src/extras/geometries/TetrahedronGeometry.js

/**
 * @author timothypratley / https://github.com/timothypratley
 */

THREE.TetrahedronGeometry = function ( radius, detail ) {

	var vertices = [
		 1,  1,  1,   - 1, - 1,  1,   - 1,  1, - 1,    1, - 1, - 1
	];

	var indices = [
		 2,  1,  0,    0,  3,  2,    1,  3,  0,    2,  3,  1
	];

	THREE.PolyhedronGeometry.call( this, vertices, indices, radius, detail );

	this.type = 'TetrahedronGeometry';

	this.parameters = {
		radius: radius,
		detail: detail
	};

};

THREE.TetrahedronGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.TetrahedronGeometry.prototype.constructor = THREE.TetrahedronGeometry;

// File:src/extras/geometries/ParametricGeometry.js

/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new THREE.ParametricGeometry( parametricFunction, uSegments, ySegements );
 *
 */

THREE.ParametricGeometry = function ( func, slices, stacks ) {

	THREE.Geometry.call( this );

	this.type = 'ParametricGeometry';

	this.parameters = {
		func: func,
		slices: slices,
		stacks: stacks
	};

	var verts = this.vertices;
	var faces = this.faces;
	var uvs = this.faceVertexUvs[ 0 ];

	var i, j, p;
	var u, v;

	var sliceCount = slices + 1;

	for ( i = 0; i <= stacks; i ++ ) {

		v = i / stacks;

		for ( j = 0; j <= slices; j ++ ) {

			u = j / slices;

			p = func( u, v );
			verts.push( p );

		}
	}

	var a, b, c, d;
	var uva, uvb, uvc, uvd;

	for ( i = 0; i < stacks; i ++ ) {

		for ( j = 0; j < slices; j ++ ) {

			a = i * sliceCount + j;
			b = i * sliceCount + j + 1;
			c = (i + 1) * sliceCount + j + 1;
			d = (i + 1) * sliceCount + j;

			uva = new THREE.Vector2( j / slices, i / stacks );
			uvb = new THREE.Vector2( ( j + 1 ) / slices, i / stacks );
			uvc = new THREE.Vector2( ( j + 1 ) / slices, ( i + 1 ) / stacks );
			uvd = new THREE.Vector2( j / slices, ( i + 1 ) / stacks );

			faces.push( new THREE.Face3( a, b, d ) );
			uvs.push( [ uva, uvb, uvd ] );

			faces.push( new THREE.Face3( b, c, d ) );
			uvs.push( [ uvb.clone(), uvc, uvd.clone() ] );

		}

	}

	// console.log(this);

	// magic bullet
	// var diff = this.mergeVertices();
	// console.log('removed ', diff, ' vertices by merging');

	this.computeFaceNormals();
	this.computeVertexNormals();

};

THREE.ParametricGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.ParametricGeometry.prototype.constructor = THREE.ParametricGeometry;

// File:src/extras/geometries/WireframeGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WireframeGeometry = function ( geometry ) {

	THREE.BufferGeometry.call( this );

	var edge = [ 0, 0 ], hash = {};
	var sortFunction = function ( a, b ) { return a - b };

	var keys = [ 'a', 'b', 'c' ];

	if ( geometry instanceof THREE.Geometry ) {

		var vertices = geometry.vertices;
		var faces = geometry.faces;
		var numEdges = 0;

		// allocate maximal size
		var edges = new Uint32Array( 6 * faces.length );

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( var j = 0; j < 3; j ++ ) {

				edge[ 0 ] = face[ keys[ j ] ];
				edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
				edge.sort( sortFunction );

				var key = edge.toString();

				if ( hash[ key ] === undefined ) {

					edges[ 2 * numEdges ] = edge[ 0 ];
					edges[ 2 * numEdges + 1 ] = edge[ 1 ];
					hash[ key ] = true;
					numEdges ++;

				}

			}

		}

		var coords = new Float32Array( numEdges * 2 * 3 );

		for ( var i = 0, l = numEdges; i < l; i ++ ) {

			for ( var j = 0; j < 2; j ++ ) {

				var vertex = vertices[ edges [ 2 * i + j] ];

				var index = 6 * i + 3 * j;
				coords[ index + 0 ] = vertex.x;
				coords[ index + 1 ] = vertex.y;
				coords[ index + 2 ] = vertex.z;

			}

		}

		this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

	} else if ( geometry instanceof THREE.BufferGeometry ) {

		if ( geometry.attributes.index !== undefined ) { // Indexed BufferGeometry

			var vertices = geometry.attributes.position;
			var indices = geometry.attributes.index.array;
			var drawcalls = geometry.drawcalls;
			var numEdges = 0;

			if ( drawcalls.length === 0 ) {

				drawcalls = [ { count : indices.length, index : 0, start : 0 } ];

			}

			// allocate maximal size
			var edges = new Uint32Array( 2 * indices.length );

			for ( var o = 0, ol = drawcalls.length; o < ol; ++ o ) {

				var start = drawcalls[ o ].start;
				var count = drawcalls[ o ].count;
				var index = drawcalls[ o ].index;

				for ( var i = start, il = start + count; i < il; i += 3 ) {

					for ( var j = 0; j < 3; j ++ ) {

						edge[ 0 ] = index + indices[ i + j ];
						edge[ 1 ] = index + indices[ i + ( j + 1 ) % 3 ];
						edge.sort( sortFunction );

						var key = edge.toString();

						if ( hash[ key ] === undefined ) {

							edges[ 2 * numEdges ] = edge[ 0 ];
							edges[ 2 * numEdges + 1 ] = edge[ 1 ];
							hash[ key ] = true;
							numEdges ++;

						}

					}

				}

			}

			var coords = new Float32Array( numEdges * 2 * 3 );

			for ( var i = 0, l = numEdges; i < l; i ++ ) {

				for ( var j = 0; j < 2; j ++ ) {

					var index = 6 * i + 3 * j;
					var index2 = edges[2 * i + j];

					coords[ index + 0 ] = vertices.getX( index2 );
					coords[ index + 1 ] = vertices.getY( index2 );
					coords[ index + 2 ] = vertices.getZ( index2 );

				}

			}

			this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

		} else { // non-indexed BufferGeometry

			var vertices = geometry.attributes.position.array;
			var numEdges = vertices.length / 3;
			var numTris = numEdges / 3;

			var coords = new Float32Array( numEdges * 2 * 3 );

			for ( var i = 0, l = numTris; i < l; i ++ ) {

				for ( var j = 0; j < 3; j ++ ) {

					var index = 18 * i + 6 * j;

					var index1 = 9 * i + 3 * j;
					coords[ index + 0 ] = vertices[ index1 ];
					coords[ index + 1 ] = vertices[ index1 + 1 ];
					coords[ index + 2 ] = vertices[ index1 + 2 ];

					var index2 = 9 * i + 3 * ( ( j + 1 ) % 3 );
					coords[ index + 3 ] = vertices[ index2 ];
					coords[ index + 4 ] = vertices[ index2 + 1 ];
					coords[ index + 5 ] = vertices[ index2 + 2 ];

				}

			}

			this.addAttribute( 'position', new THREE.BufferAttribute( coords, 3 ) );

		}

	}

};

THREE.WireframeGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.WireframeGeometry.prototype.constructor = THREE.WireframeGeometry;

// File:src/extras/helpers/AxisHelper.js

/**
 * @author sroucheray / http://sroucheray.org/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AxisHelper = function ( size ) {

	size = size || 1;

	var vertices = new Float32Array( [
		0, 0, 0,  size, 0, 0,
		0, 0, 0,  0, size, 0,
		0, 0, 0,  0, 0, size
	] );

	var colors = new Float32Array( [
		1, 0, 0,  1, 0.6, 0,
		0, 1, 0,  0.6, 1, 0,
		0, 0, 1,  0, 0.6, 1
	] );

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	THREE.LineSegments.call( this, geometry, material );

};

THREE.AxisHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.AxisHelper.prototype.constructor = THREE.AxisHelper;

// File:src/extras/helpers/ArrowHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 * @author zz85 / http://github.com/zz85
 * @author bhouston / http://exocortex.com
 *
 * Creates an arrow for visualizing directions
 *
 * Parameters:
 *  dir - Vector3
 *  origin - Vector3
 *  length - Number
 *  color - color in hex value
 *  headLength - Number
 *  headWidth - Number
 */

THREE.ArrowHelper = ( function () {

	var lineGeometry = new THREE.Geometry();
	lineGeometry.vertices.push( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 1, 0 ) );

	var coneGeometry = new THREE.CylinderGeometry( 0, 0.5, 1, 5, 1 );
	coneGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, - 0.5, 0 ) );

	return function ( dir, origin, length, color, headLength, headWidth ) {

		// dir is assumed to be normalized

		THREE.Object3D.call( this );

		if ( color === undefined ) color = 0xffff00;
		if ( length === undefined ) length = 1;
		if ( headLength === undefined ) headLength = 0.2 * length;
		if ( headWidth === undefined ) headWidth = 0.2 * headLength;

		this.position.copy( origin );

		this.line = new THREE.Line( lineGeometry, new THREE.LineBasicMaterial( { color: color } ) );
		this.line.matrixAutoUpdate = false;
		this.add( this.line );

		this.cone = new THREE.Mesh( coneGeometry, new THREE.MeshBasicMaterial( { color: color } ) );
		this.cone.matrixAutoUpdate = false;
		this.add( this.cone );

		this.setDirection( dir );
		this.setLength( length, headLength, headWidth );

	}

}() );

THREE.ArrowHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.ArrowHelper.prototype.constructor = THREE.ArrowHelper;

THREE.ArrowHelper.prototype.setDirection = ( function () {

	var axis = new THREE.Vector3();
	var radians;

	return function ( dir ) {

		// dir is assumed to be normalized

		if ( dir.y > 0.99999 ) {

			this.quaternion.set( 0, 0, 0, 1 );

		} else if ( dir.y < - 0.99999 ) {

			this.quaternion.set( 1, 0, 0, 0 );

		} else {

			axis.set( dir.z, 0, - dir.x ).normalize();

			radians = Math.acos( dir.y );

			this.quaternion.setFromAxisAngle( axis, radians );

		}

	};

}() );

THREE.ArrowHelper.prototype.setLength = function ( length, headLength, headWidth ) {

	if ( headLength === undefined ) headLength = 0.2 * length;
	if ( headWidth === undefined ) headWidth = 0.2 * headLength;

	this.line.scale.set( 1, length - headLength, 1 );
	this.line.updateMatrix();

	this.cone.scale.set( headWidth, headLength, headWidth );
	this.cone.position.y = length;
	this.cone.updateMatrix();

};

THREE.ArrowHelper.prototype.setColor = function ( color ) {

	this.line.material.color.set( color );
	this.cone.material.color.set( color );

};

// File:src/extras/helpers/BoxHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BoxHelper = function ( object ) {

	var geometry = new THREE.BufferGeometry();
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 72 ), 3 ) );

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: 0xffff00 } ) );

	if ( object !== undefined ) {

		this.update( object );

	}

};

THREE.BoxHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.BoxHelper.prototype.constructor = THREE.BoxHelper;

THREE.BoxHelper.prototype.update = function ( object ) {

	var geometry = object.geometry;

	if ( geometry.boundingBox === null ) {

		geometry.computeBoundingBox();

	}

	var min = geometry.boundingBox.min;
	var max = geometry.boundingBox.max;

	/*
	  5____4
	1/___0/|
	| 6__|_7
	2/___3/

	0: max.x, max.y, max.z
	1: min.x, max.y, max.z
	2: min.x, min.y, max.z
	3: max.x, min.y, max.z
	4: max.x, max.y, min.z
	5: min.x, max.y, min.z
	6: min.x, min.y, min.z
	7: max.x, min.y, min.z
	*/

	var vertices = this.geometry.attributes.position.array;

	vertices[  0 ] = max.x; vertices[  1 ] = max.y; vertices[  2 ] = max.z;
	vertices[  3 ] = min.x; vertices[  4 ] = max.y; vertices[  5 ] = max.z;

	vertices[  6 ] = min.x; vertices[  7 ] = max.y; vertices[  8 ] = max.z;
	vertices[  9 ] = min.x; vertices[ 10 ] = min.y; vertices[ 11 ] = max.z;

	vertices[ 12 ] = min.x; vertices[ 13 ] = min.y; vertices[ 14 ] = max.z;
	vertices[ 15 ] = max.x; vertices[ 16 ] = min.y; vertices[ 17 ] = max.z;

	vertices[ 18 ] = max.x; vertices[ 19 ] = min.y; vertices[ 20 ] = max.z;
	vertices[ 21 ] = max.x; vertices[ 22 ] = max.y; vertices[ 23 ] = max.z;

	//

	vertices[ 24 ] = max.x; vertices[ 25 ] = max.y; vertices[ 26 ] = min.z;
	vertices[ 27 ] = min.x; vertices[ 28 ] = max.y; vertices[ 29 ] = min.z;

	vertices[ 30 ] = min.x; vertices[ 31 ] = max.y; vertices[ 32 ] = min.z;
	vertices[ 33 ] = min.x; vertices[ 34 ] = min.y; vertices[ 35 ] = min.z;

	vertices[ 36 ] = min.x; vertices[ 37 ] = min.y; vertices[ 38 ] = min.z;
	vertices[ 39 ] = max.x; vertices[ 40 ] = min.y; vertices[ 41 ] = min.z;

	vertices[ 42 ] = max.x; vertices[ 43 ] = min.y; vertices[ 44 ] = min.z;
	vertices[ 45 ] = max.x; vertices[ 46 ] = max.y; vertices[ 47 ] = min.z;

	//

	vertices[ 48 ] = max.x; vertices[ 49 ] = max.y; vertices[ 50 ] = max.z;
	vertices[ 51 ] = max.x; vertices[ 52 ] = max.y; vertices[ 53 ] = min.z;

	vertices[ 54 ] = min.x; vertices[ 55 ] = max.y; vertices[ 56 ] = max.z;
	vertices[ 57 ] = min.x; vertices[ 58 ] = max.y; vertices[ 59 ] = min.z;

	vertices[ 60 ] = min.x; vertices[ 61 ] = min.y; vertices[ 62 ] = max.z;
	vertices[ 63 ] = min.x; vertices[ 64 ] = min.y; vertices[ 65 ] = min.z;

	vertices[ 66 ] = max.x; vertices[ 67 ] = min.y; vertices[ 68 ] = max.z;
	vertices[ 69 ] = max.x; vertices[ 70 ] = min.y; vertices[ 71 ] = min.z;

	this.geometry.attributes.position.needsUpdate = true;

	this.geometry.computeBoundingSphere();

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

// File:src/extras/helpers/BoundingBoxHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 */

// a helper to show the world-axis-aligned bounding box for an object

THREE.BoundingBoxHelper = function ( object, hex ) {

	var color = ( hex !== undefined ) ? hex : 0x888888;

	this.object = object;

	this.box = new THREE.Box3();

	THREE.Mesh.call( this, new THREE.BoxGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );

};

THREE.BoundingBoxHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.BoundingBoxHelper.prototype.constructor = THREE.BoundingBoxHelper;

THREE.BoundingBoxHelper.prototype.update = function () {

	this.box.setFromObject( this.object );

	this.box.size( this.scale );

	this.box.center( this.position );

};

// File:src/extras/helpers/CameraHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 *
 *	- shows frustum, line of sight and up of the camera
 *	- suitable for fast updates
 * 	- based on frustum visualization in lightgl.js shadowmap example
 *		http://evanw.github.com/lightgl.js/tests/shadowmap.html
 */

THREE.CameraHelper = function ( camera ) {

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

	var pointMap = {};

	// colors

	var hexFrustum = 0xffaa00;
	var hexCone = 0xff0000;
	var hexUp = 0x00aaff;
	var hexTarget = 0xffffff;
	var hexCross = 0x333333;

	// near

	addLine( "n1", "n2", hexFrustum );
	addLine( "n2", "n4", hexFrustum );
	addLine( "n4", "n3", hexFrustum );
	addLine( "n3", "n1", hexFrustum );

	// far

	addLine( "f1", "f2", hexFrustum );
	addLine( "f2", "f4", hexFrustum );
	addLine( "f4", "f3", hexFrustum );
	addLine( "f3", "f1", hexFrustum );

	// sides

	addLine( "n1", "f1", hexFrustum );
	addLine( "n2", "f2", hexFrustum );
	addLine( "n3", "f3", hexFrustum );
	addLine( "n4", "f4", hexFrustum );

	// cone

	addLine( "p", "n1", hexCone );
	addLine( "p", "n2", hexCone );
	addLine( "p", "n3", hexCone );
	addLine( "p", "n4", hexCone );

	// up

	addLine( "u1", "u2", hexUp );
	addLine( "u2", "u3", hexUp );
	addLine( "u3", "u1", hexUp );

	// target

	addLine( "c", "t", hexTarget );
	addLine( "p", "c", hexCross );

	// cross

	addLine( "cn1", "cn2", hexCross );
	addLine( "cn3", "cn4", hexCross );

	addLine( "cf1", "cf2", hexCross );
	addLine( "cf3", "cf4", hexCross );

	function addLine( a, b, hex ) {

		addPoint( a, hex );
		addPoint( b, hex );

	}

	function addPoint( id, hex ) {

		geometry.vertices.push( new THREE.Vector3() );
		geometry.colors.push( new THREE.Color( hex ) );

		if ( pointMap[ id ] === undefined ) {

			pointMap[ id ] = [];

		}

		pointMap[ id ].push( geometry.vertices.length - 1 );

	}

	THREE.LineSegments.call( this, geometry, material );

	this.camera = camera;
	this.matrix = camera.matrixWorld;
	this.matrixAutoUpdate = false;

	this.pointMap = pointMap;

	this.update();

};

THREE.CameraHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.CameraHelper.prototype.constructor = THREE.CameraHelper;

THREE.CameraHelper.prototype.update = function () {

	var geometry, pointMap;

	var vector = new THREE.Vector3();
	var camera = new THREE.Camera();

	var setPoint = function ( point, x, y, z ) {

		vector.set( x, y, z ).unproject( camera );

		var points = pointMap[ point ];

		if ( points !== undefined ) {

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				geometry.vertices[ points[ i ] ].copy( vector );

			}

		}

	};

	return function () {

		geometry = this.geometry;
		pointMap = this.pointMap;

		var w = 1, h = 1;

		// we need just camera projection matrix
		// world matrix must be identity

		camera.projectionMatrix.copy( this.camera.projectionMatrix );

		// center / target

		setPoint( "c", 0, 0, - 1 );
		setPoint( "t", 0, 0,  1 );

		// near

		setPoint( "n1", - w, - h, - 1 );
		setPoint( "n2",   w, - h, - 1 );
		setPoint( "n3", - w,   h, - 1 );
		setPoint( "n4",   w,   h, - 1 );

		// far

		setPoint( "f1", - w, - h, 1 );
		setPoint( "f2",   w, - h, 1 );
		setPoint( "f3", - w,   h, 1 );
		setPoint( "f4",   w,   h, 1 );

		// up

		setPoint( "u1",   w * 0.7, h * 1.1, - 1 );
		setPoint( "u2", - w * 0.7, h * 1.1, - 1 );
		setPoint( "u3",         0, h * 2,   - 1 );

		// cross

		setPoint( "cf1", - w,   0, 1 );
		setPoint( "cf2",   w,   0, 1 );
		setPoint( "cf3",   0, - h, 1 );
		setPoint( "cf4",   0,   h, 1 );

		setPoint( "cn1", - w,   0, - 1 );
		setPoint( "cn2",   w,   0, - 1 );
		setPoint( "cn3",   0, - h, - 1 );
		setPoint( "cn4",   0,   h, - 1 );

		geometry.verticesNeedUpdate = true;

	};

}();

// File:src/extras/helpers/DirectionalLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.DirectionalLightHelper = function ( light, size ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	size = size || 1;

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( - size,   size, 0 ),
		new THREE.Vector3(   size,   size, 0 ),
		new THREE.Vector3(   size, - size, 0 ),
		new THREE.Vector3( - size, - size, 0 ),
		new THREE.Vector3( - size,   size, 0 )
	);

	var material = new THREE.LineBasicMaterial( { fog: false } );
	material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	this.lightPlane = new THREE.Line( geometry, material );
	this.add( this.lightPlane );

	geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3(),
		new THREE.Vector3()
	);

	material = new THREE.LineBasicMaterial( { fog: false } );
	material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	this.targetLine = new THREE.Line( geometry, material );
	this.add( this.targetLine );

	this.update();

};

THREE.DirectionalLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.DirectionalLightHelper.prototype.constructor = THREE.DirectionalLightHelper;

THREE.DirectionalLightHelper.prototype.dispose = function () {

	this.lightPlane.geometry.dispose();
	this.lightPlane.material.dispose();
	this.targetLine.geometry.dispose();
	this.targetLine.material.dispose();
};

THREE.DirectionalLightHelper.prototype.update = function () {

	var v1 = new THREE.Vector3();
	var v2 = new THREE.Vector3();
	var v3 = new THREE.Vector3();

	return function () {

		v1.setFromMatrixPosition( this.light.matrixWorld );
		v2.setFromMatrixPosition( this.light.target.matrixWorld );
		v3.subVectors( v2, v1 );

		this.lightPlane.lookAt( v3 );
		this.lightPlane.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

		this.targetLine.geometry.vertices[ 1 ].copy( v3 );
		this.targetLine.geometry.verticesNeedUpdate = true;
		this.targetLine.material.color.copy( this.lightPlane.material.color );

	};

}();

// File:src/extras/helpers/EdgesHelper.js

/**
 * @author WestLangley / http://github.com/WestLangley
 * @param object THREE.Mesh whose geometry will be used
 * @param hex line color
 * @param thresholdAngle the minimim angle (in degrees),
 * between the face normals of adjacent faces,
 * that is required to render an edge. A value of 10 means
 * an edge is only rendered if the angle is at least 10 degrees.
 */

THREE.EdgesHelper = function ( object, hex, thresholdAngle ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	THREE.LineSegments.call( this, new THREE.EdgesGeometry( object.geometry, thresholdAngle ), new THREE.LineBasicMaterial( { color: color } ) );

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

THREE.EdgesHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.EdgesHelper.prototype.constructor = THREE.EdgesHelper;

// File:src/extras/helpers/FaceNormalsHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.FaceNormalsHelper = function ( object, size, hex, linewidth ) {

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0xffff00;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	var geometry = new THREE.Geometry();

	var faces = this.object.geometry.faces;

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

	}

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: color, linewidth: width } ) );

	this.matrixAutoUpdate = false;

	this.normalMatrix = new THREE.Matrix3();

	this.update();

};

THREE.FaceNormalsHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.FaceNormalsHelper.prototype.constructor = THREE.FaceNormalsHelper;

THREE.FaceNormalsHelper.prototype.update = function () {

	var vertices = this.geometry.vertices;

	var object = this.object;
	var objectVertices = object.geometry.vertices;
	var objectFaces = object.geometry.faces;
	var objectWorldMatrix = object.matrixWorld;

	object.updateMatrixWorld( true );

	this.normalMatrix.getNormalMatrix( objectWorldMatrix );

	for ( var i = 0, i2 = 0, l = objectFaces.length; i < l; i ++, i2 += 2 ) {

		var face = objectFaces[ i ];

		vertices[ i2 ].copy( objectVertices[ face.a ] )
			.add( objectVertices[ face.b ] )
			.add( objectVertices[ face.c ] )
			.divideScalar( 3 )
			.applyMatrix4( objectWorldMatrix );

		vertices[ i2 + 1 ].copy( face.normal )
			.applyMatrix3( this.normalMatrix )
			.normalize()
			.multiplyScalar( this.size )
			.add( vertices[ i2 ] );

	}

	this.geometry.verticesNeedUpdate = true;

	return this;

};

// File:src/extras/helpers/GridHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.GridHelper = function ( size, step ) {

	var geometry = new THREE.Geometry();
	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );

	this.color1 = new THREE.Color( 0x444444 );
	this.color2 = new THREE.Color( 0x888888 );

	for ( var i = - size; i <= size; i += step ) {

		geometry.vertices.push(
			new THREE.Vector3( - size, 0, i ), new THREE.Vector3( size, 0, i ),
			new THREE.Vector3( i, 0, - size ), new THREE.Vector3( i, 0, size )
		);

		var color = i === 0 ? this.color1 : this.color2;

		geometry.colors.push( color, color, color, color );

	}

	THREE.LineSegments.call( this, geometry, material );

};

THREE.GridHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.GridHelper.prototype.constructor = THREE.GridHelper;

THREE.GridHelper.prototype.setColors = function( colorCenterLine, colorGrid ) {

	this.color1.set( colorCenterLine );
	this.color2.set( colorGrid );

	this.geometry.colorsNeedUpdate = true;

};

// File:src/extras/helpers/HemisphereLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.HemisphereLightHelper = function ( light, sphereSize ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	this.colors = [ new THREE.Color(), new THREE.Color() ];

	var geometry = new THREE.SphereGeometry( sphereSize, 4, 2 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	for ( var i = 0, il = 8; i < il; i ++ ) {

		geometry.faces[ i ].color = this.colors[ i < 4 ? 0 : 1 ];

	}

	var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, wireframe: true } );

	this.lightSphere = new THREE.Mesh( geometry, material );
	this.add( this.lightSphere );

	this.update();

};

THREE.HemisphereLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.HemisphereLightHelper.prototype.constructor = THREE.HemisphereLightHelper;

THREE.HemisphereLightHelper.prototype.dispose = function () {
	this.lightSphere.geometry.dispose();
	this.lightSphere.material.dispose();
};

THREE.HemisphereLightHelper.prototype.update = function () {

	var vector = new THREE.Vector3();

	return function () {

		this.colors[ 0 ].copy( this.light.color ).multiplyScalar( this.light.intensity );
		this.colors[ 1 ].copy( this.light.groundColor ).multiplyScalar( this.light.intensity );

		this.lightSphere.lookAt( vector.setFromMatrixPosition( this.light.matrixWorld ).negate() );
		this.lightSphere.geometry.colorsNeedUpdate = true;

	}

}();

// File:src/extras/helpers/PointLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointLightHelper = function ( light, sphereSize ) {

	this.light = light;
	this.light.updateMatrixWorld();

	var geometry = new THREE.SphereGeometry( sphereSize, 4, 2 );
	var material = new THREE.MeshBasicMaterial( { wireframe: true, fog: false } );
	material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	THREE.Mesh.call( this, geometry, material );

	this.matrix = this.light.matrixWorld;
	this.matrixAutoUpdate = false;

	/*
	var distanceGeometry = new THREE.IcosahedronGeometry( 1, 2 );
	var distanceMaterial = new THREE.MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );

	this.lightSphere = new THREE.Mesh( bulbGeometry, bulbMaterial );
	this.lightDistance = new THREE.Mesh( distanceGeometry, distanceMaterial );

	var d = light.distance;

	if ( d === 0.0 ) {

		this.lightDistance.visible = false;

	} else {

		this.lightDistance.scale.set( d, d, d );

	}

	this.add( this.lightDistance );
	*/

};

THREE.PointLightHelper.prototype = Object.create( THREE.Mesh.prototype );
THREE.PointLightHelper.prototype.constructor = THREE.PointLightHelper;

THREE.PointLightHelper.prototype.dispose = function () {

	this.geometry.dispose();
	this.material.dispose();
};

THREE.PointLightHelper.prototype.update = function () {

	this.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	/*
	var d = this.light.distance;

	if ( d === 0.0 ) {

		this.lightDistance.visible = false;

	} else {

		this.lightDistance.visible = true;
		this.lightDistance.scale.set( d, d, d );

	}
	*/

};

// File:src/extras/helpers/SkeletonHelper.js

/**
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 */

THREE.SkeletonHelper = function ( object ) {

	this.bones = this.getBoneList( object );

	var geometry = new THREE.Geometry();

	for ( var i = 0; i < this.bones.length; i ++ ) {

		var bone = this.bones[ i ];

		if ( bone.parent instanceof THREE.Bone ) {

			geometry.vertices.push( new THREE.Vector3() );
			geometry.vertices.push( new THREE.Vector3() );
			geometry.colors.push( new THREE.Color( 0, 0, 1 ) );
			geometry.colors.push( new THREE.Color( 0, 1, 0 ) );

		}

	}

	geometry.dynamic = true;

	var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, depthTest: false, depthWrite: false, transparent: true } );

	THREE.LineSegments.call( this, geometry, material );

	this.root = object;

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

	this.update();

};


THREE.SkeletonHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.SkeletonHelper.prototype.constructor = THREE.SkeletonHelper;

THREE.SkeletonHelper.prototype.getBoneList = function( object ) {

	var boneList = [];

	if ( object instanceof THREE.Bone ) {

		boneList.push( object );

	}

	for ( var i = 0; i < object.children.length; i ++ ) {

		boneList.push.apply( boneList, this.getBoneList( object.children[ i ] ) );

	}

	return boneList;

};

THREE.SkeletonHelper.prototype.update = function () {

	var geometry = this.geometry;

	var matrixWorldInv = new THREE.Matrix4().getInverse( this.root.matrixWorld );

	var boneMatrix = new THREE.Matrix4();

	var j = 0;

	for ( var i = 0; i < this.bones.length; i ++ ) {

		var bone = this.bones[ i ];

		if ( bone.parent instanceof THREE.Bone ) {

			boneMatrix.multiplyMatrices( matrixWorldInv, bone.matrixWorld );
			geometry.vertices[ j ].setFromMatrixPosition( boneMatrix );

			boneMatrix.multiplyMatrices( matrixWorldInv, bone.parent.matrixWorld );
			geometry.vertices[ j + 1 ].setFromMatrixPosition( boneMatrix );

			j += 2;

		}

	}

	geometry.verticesNeedUpdate = true;

	geometry.computeBoundingSphere();

};

// File:src/extras/helpers/SpotLightHelper.js

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.SpotLightHelper = function ( light ) {

	THREE.Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	var geometry = new THREE.CylinderGeometry( 0, 1, 1, 8, 1, true );

	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, - 0.5, 0 ) );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	var material = new THREE.MeshBasicMaterial( { wireframe: true, fog: false } );

	this.cone = new THREE.Mesh( geometry, material );
	this.add( this.cone );

	this.update();

};

THREE.SpotLightHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.SpotLightHelper.prototype.constructor = THREE.SpotLightHelper;

THREE.SpotLightHelper.prototype.dispose = function () {
	this.cone.geometry.dispose();
	this.cone.material.dispose();
};

THREE.SpotLightHelper.prototype.update = function () {

	var vector = new THREE.Vector3();
	var vector2 = new THREE.Vector3();

	return function () {

		var coneLength = this.light.distance ? this.light.distance : 10000;
		var coneWidth = coneLength * Math.tan( this.light.angle );

		this.cone.scale.set( coneWidth, coneWidth, coneLength );

		vector.setFromMatrixPosition( this.light.matrixWorld );
		vector2.setFromMatrixPosition( this.light.target.matrixWorld );

		this.cone.lookAt( vector2.sub( vector ) );

		this.cone.material.color.copy( this.light.color ).multiplyScalar( this.light.intensity );

	};

}();

// File:src/extras/helpers/VertexNormalsHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.VertexNormalsHelper = function ( object, size, hex, linewidth ) {

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0xff0000;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	var geometry = new THREE.Geometry();

	var faces = object.geometry.faces;

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

			geometry.vertices.push( new THREE.Vector3(), new THREE.Vector3() );

		}

	}

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: color, linewidth: width } ) );

	this.matrixAutoUpdate = false;

	this.normalMatrix = new THREE.Matrix3();

	this.update();

};

THREE.VertexNormalsHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.VertexNormalsHelper.prototype.constructor = THREE.VertexNormalsHelper;

THREE.VertexNormalsHelper.prototype.update = ( function ( object ) {

	var v1 = new THREE.Vector3();

	return function( object ) {

		var keys = [ 'a', 'b', 'c', 'd' ];

		this.object.updateMatrixWorld( true );

		this.normalMatrix.getNormalMatrix( this.object.matrixWorld );

		var vertices = this.geometry.vertices;

		var verts = this.object.geometry.vertices;

		var faces = this.object.geometry.faces;

		var worldMatrix = this.object.matrixWorld;

		var idx = 0;

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( var j = 0, jl = face.vertexNormals.length; j < jl; j ++ ) {

				var vertexId = face[ keys[ j ] ];
				var vertex = verts[ vertexId ];

				var normal = face.vertexNormals[ j ];

				vertices[ idx ].copy( vertex ).applyMatrix4( worldMatrix );

				v1.copy( normal ).applyMatrix3( this.normalMatrix ).normalize().multiplyScalar( this.size );

				v1.add( vertices[ idx ] );
				idx = idx + 1;

				vertices[ idx ].copy( v1 );
				idx = idx + 1;

			}

		}

		this.geometry.verticesNeedUpdate = true;

		return this;

	}

}());

// File:src/extras/helpers/VertexTangentsHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

THREE.VertexTangentsHelper = function ( object, size, hex, linewidth ) {

	this.object = object;

	this.size = ( size !== undefined ) ? size : 1;

	var color = ( hex !== undefined ) ? hex : 0x0000ff;

	var width = ( linewidth !== undefined ) ? linewidth : 1;

	var geometry = new THREE.Geometry();

	var faces = object.geometry.faces;

	for ( var i = 0, l = faces.length; i < l; i ++ ) {

		var face = faces[ i ];

		for ( var j = 0, jl = face.vertexTangents.length; j < jl; j ++ ) {

			geometry.vertices.push( new THREE.Vector3() );
			geometry.vertices.push( new THREE.Vector3() );

		}

	}

	THREE.LineSegments.call( this, geometry, new THREE.LineBasicMaterial( { color: color, linewidth: width } ) );

	this.matrixAutoUpdate = false;

	this.update();

};

THREE.VertexTangentsHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.VertexTangentsHelper.prototype.constructor = THREE.VertexTangentsHelper;

THREE.VertexTangentsHelper.prototype.update = ( function ( object ) {

	var v1 = new THREE.Vector3();

	return function( object ) {

		var keys = [ 'a', 'b', 'c', 'd' ];

		this.object.updateMatrixWorld( true );

		var vertices = this.geometry.vertices;

		var verts = this.object.geometry.vertices;

		var faces = this.object.geometry.faces;

		var worldMatrix = this.object.matrixWorld;

		var idx = 0;

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			for ( var j = 0, jl = face.vertexTangents.length; j < jl; j ++ ) {

				var vertexId = face[ keys[ j ] ];
				var vertex = verts[ vertexId ];

				var tangent = face.vertexTangents[ j ];

				vertices[ idx ].copy( vertex ).applyMatrix4( worldMatrix );

				v1.copy( tangent ).transformDirection( worldMatrix ).multiplyScalar( this.size );

				v1.add( vertices[ idx ] );
				idx = idx + 1;

				vertices[ idx ].copy( v1 );
				idx = idx + 1;

			}

		}

		this.geometry.verticesNeedUpdate = true;

		return this;

	}

}());

// File:src/extras/helpers/WireframeHelper.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.WireframeHelper = function ( object, hex ) {

	var color = ( hex !== undefined ) ? hex : 0xffffff;

	THREE.LineSegments.call( this, new THREE.WireframeGeometry( object.geometry ), new THREE.LineBasicMaterial( { color: color } ) );

	this.matrix = object.matrixWorld;
	this.matrixAutoUpdate = false;

};

THREE.WireframeHelper.prototype = Object.create( THREE.LineSegments.prototype );
THREE.WireframeHelper.prototype.constructor = THREE.WireframeHelper;

// File:src/extras/objects/ImmediateRenderObject.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ImmediateRenderObject = function () {

	THREE.Object3D.call( this );

	this.render = function ( renderCallback ) {};

};

THREE.ImmediateRenderObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.ImmediateRenderObject.prototype.constructor = THREE.ImmediateRenderObject;

// File:src/extras/objects/MorphBlendMesh.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MorphBlendMesh = function( geometry, material ) {

	THREE.Mesh.call( this, geometry, material );

	this.animationsMap = {};
	this.animationsList = [];

	// prepare default animation
	// (all frames played together in 1 second)

	var numFrames = this.geometry.morphTargets.length;

	var name = "__default";

	var startFrame = 0;
	var endFrame = numFrames - 1;

	var fps = numFrames / 1;

	this.createAnimation( name, startFrame, endFrame, fps );
	this.setAnimationWeight( name, 1 );

};

THREE.MorphBlendMesh.prototype = Object.create( THREE.Mesh.prototype );
THREE.MorphBlendMesh.prototype.constructor = THREE.MorphBlendMesh;

THREE.MorphBlendMesh.prototype.createAnimation = function ( name, start, end, fps ) {

	var animation = {

		startFrame: start,
		endFrame: end,

		length: end - start + 1,

		fps: fps,
		duration: ( end - start ) / fps,

		lastFrame: 0,
		currentFrame: 0,

		active: false,

		time: 0,
		direction: 1,
		weight: 1,

		directionBackwards: false,
		mirroredLoop: false

	};

	this.animationsMap[ name ] = animation;
	this.animationsList.push( animation );

};

THREE.MorphBlendMesh.prototype.autoCreateAnimations = function ( fps ) {

	var pattern = /([a-z]+)_?(\d+)/;

	var firstAnimation, frameRanges = {};

	var geometry = this.geometry;

	for ( var i = 0, il = geometry.morphTargets.length; i < il; i ++ ) {

		var morph = geometry.morphTargets[ i ];
		var chunks = morph.name.match( pattern );

		if ( chunks && chunks.length > 1 ) {

			var name = chunks[ 1 ];

			if ( ! frameRanges[ name ] ) frameRanges[ name ] = { start: Infinity, end: - Infinity };

			var range = frameRanges[ name ];

			if ( i < range.start ) range.start = i;
			if ( i > range.end ) range.end = i;

			if ( ! firstAnimation ) firstAnimation = name;

		}

	}

	for ( var name in frameRanges ) {

		var range = frameRanges[ name ];
		this.createAnimation( name, range.start, range.end, fps );

	}

	this.firstAnimation = firstAnimation;

};

THREE.MorphBlendMesh.prototype.setAnimationDirectionForward = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.direction = 1;
		animation.directionBackwards = false;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.direction = - 1;
		animation.directionBackwards = true;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationFPS = function ( name, fps ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.fps = fps;
		animation.duration = ( animation.end - animation.start ) / animation.fps;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationDuration = function ( name, duration ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.duration = duration;
		animation.fps = ( animation.end - animation.start ) / animation.duration;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationWeight = function ( name, weight ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.weight = weight;

	}

};

THREE.MorphBlendMesh.prototype.setAnimationTime = function ( name, time ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.time = time;

	}

};

THREE.MorphBlendMesh.prototype.getAnimationTime = function ( name ) {

	var time = 0;

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		time = animation.time;

	}

	return time;

};

THREE.MorphBlendMesh.prototype.getAnimationDuration = function ( name ) {

	var duration = - 1;

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		duration = animation.duration;

	}

	return duration;

};

THREE.MorphBlendMesh.prototype.playAnimation = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.time = 0;
		animation.active = true;

	} else {

		console.warn( "THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()" );

	}

};

THREE.MorphBlendMesh.prototype.stopAnimation = function ( name ) {

	var animation = this.animationsMap[ name ];

	if ( animation ) {

		animation.active = false;

	}

};

THREE.MorphBlendMesh.prototype.update = function ( delta ) {

	for ( var i = 0, il = this.animationsList.length; i < il; i ++ ) {

		var animation = this.animationsList[ i ];

		if ( ! animation.active ) continue;

		var frameTime = animation.duration / animation.length;

		animation.time += animation.direction * delta;

		if ( animation.mirroredLoop ) {

			if ( animation.time > animation.duration || animation.time < 0 ) {

				animation.direction *= - 1;

				if ( animation.time > animation.duration ) {

					animation.time = animation.duration;
					animation.directionBackwards = true;

				}

				if ( animation.time < 0 ) {

					animation.time = 0;
					animation.directionBackwards = false;

				}

			}

		} else {

			animation.time = animation.time % animation.duration;

			if ( animation.time < 0 ) animation.time += animation.duration;

		}

		var keyframe = animation.startFrame + THREE.Math.clamp( Math.floor( animation.time / frameTime ), 0, animation.length - 1 );
		var weight = animation.weight;

		if ( keyframe !== animation.currentFrame ) {

			this.morphTargetInfluences[ animation.lastFrame ] = 0;
			this.morphTargetInfluences[ animation.currentFrame ] = 1 * weight;

			this.morphTargetInfluences[ keyframe ] = 0;

			animation.lastFrame = animation.currentFrame;
			animation.currentFrame = keyframe;

		}

		var mix = ( animation.time % frameTime ) / frameTime;

		if ( animation.directionBackwards ) mix = 1 - mix;

		this.morphTargetInfluences[ animation.currentFrame ] = mix * weight;
		this.morphTargetInfluences[ animation.lastFrame ] = ( 1 - mix ) * weight;

	}

};

// File:examples/js/loaders/ColladaLoader.js

/* global THREE */
/**
* @author Tim Knip / http://www.floorplanner.com/ / tim at floorplanner.com
* @author Tony Parisi / http://www.tonyparisi.com/
*/

THREE.ColladaLoader = function () {

	var COLLADA = null;
	var scene = null;
	var visualScene;
	var kinematicsModel;

	var readyCallbackFunc = null;

	var sources = {};
	var images = {};
	var animations = {};
	var controllers = {};
	var geometries = {};
	var materials = {};
	var effects = {};
	var cameras = {};
	var lights = {};

	var animData;
	var kinematics;
	var visualScenes;
	var kinematicsModels;
	var baseUrl;
	var morphs;
	var skins;

	var flip_uv = true;
	var preferredShading = THREE.SmoothShading;

	var options = {
		// Force Geometry to always be centered at the local origin of the
		// containing Mesh.
		centerGeometry: false,

		// Axis conversion is done for geometries, animations, and controllers.
		// If we ever pull cameras or lights out of the COLLADA file, they'll
		// need extra work.
		convertUpAxis: false,

		subdivideFaces: true,

		upAxis: 'Y',

		// For reflective or refractive materials we'll use this cubemap
		defaultEnvMap: null

	};

	var colladaUnit = 1.0;
	var colladaUp = 'Y';
	var upConversion = null;

	function load ( url, readyCallback, progressCallback, failCallback ) {

		var length = 0;

		if ( document.implementation && document.implementation.createDocument ) {

			var request = new XMLHttpRequest();

			request.onreadystatechange = function() {

				if ( request.readyState === 4 ) {

					if ( request.status === 0 || request.status === 200 ) {


						if ( request.responseXML ) {

							readyCallbackFunc = readyCallback;
							parse( request.responseXML, undefined, url );

						} else if ( request.responseText ) {

							readyCallbackFunc = readyCallback;
							var xmlParser = new DOMParser();
							var responseXML = xmlParser.parseFromString( request.responseText, "application/xml" );
							parse( responseXML, undefined, url );

						} else {

							if ( failCallback ) {

								failCallback();

							} else {

								console.error( "ColladaLoader: Empty or non-existing file (" + url + ")" );

							}

						}

					}

				} else if ( request.readyState === 3 ) {

					if ( progressCallback ) {

						if ( length === 0 ) {

							length = request.getResponseHeader( "Content-Length" );

						}

						progressCallback( { total: length, loaded: request.responseText.length } );

					}

				}

			};

			request.open( "GET", url, true );
			request.send( null );

		} else {

			alert( "Don't know how to parse XML!" );

		}

	}

	function parse( doc, callBack, url ) {

		COLLADA = doc;
		callBack = callBack || readyCallbackFunc;

		if ( url !== undefined ) {

			var parts = url.split( '/' );
			parts.pop();
			baseUrl = ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';

		}

		parseAsset();
		setUpConversion();
		images = parseLib( "library_images image", _Image, "image" );
		materials = parseLib( "library_materials material", Material, "material" );
		effects = parseLib( "library_effects effect", Effect, "effect" );
		geometries = parseLib( "library_geometries geometry", Geometry, "geometry" );
		cameras = parseLib( "library_cameras camera", Camera, "camera" );
		lights = parseLib( "library_lights light", Light, "light" );
		controllers = parseLib( "library_controllers controller", Controller, "controller" );
		animations = parseLib( "library_animations animation", Animation, "animation" );
		visualScenes = parseLib( "library_visual_scenes visual_scene", VisualScene, "visual_scene" );
		kinematicsModels = parseLib( "library_kinematics_models kinematics_model", KinematicsModel, "kinematics_model" );

		morphs = [];
		skins = [];

		visualScene = parseScene();
		scene = new THREE.Group();

		for ( var i = 0; i < visualScene.nodes.length; i ++ ) {

			scene.add( createSceneGraph( visualScene.nodes[ i ] ) );

		}

		// unit conversion
		scene.scale.multiplyScalar( colladaUnit );

		createAnimations();

		kinematicsModel = parseKinematicsModel();
		createKinematics();

		var result = {

			scene: scene,
			morphs: morphs,
			skins: skins,
			animations: animData,
			kinematics: kinematics,
			dae: {
				images: images,
				materials: materials,
				cameras: cameras,
				lights: lights,
				effects: effects,
				geometries: geometries,
				controllers: controllers,
				animations: animations,
				visualScenes: visualScenes,
				visualScene: visualScene,
				scene: visualScene,
				kinematicsModels: kinematicsModels,
				kinematicsModel: kinematicsModel
			}

		};

		if ( callBack ) {

			callBack( result );

		}

		return result;

	}

	function setPreferredShading ( shading ) {

		preferredShading = shading;

	}

	function parseAsset () {

		var elements = COLLADA.querySelectorAll('asset');

		var element = elements[0];

		if ( element && element.childNodes ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'unit':

						var meter = child.getAttribute( 'meter' );

						if ( meter ) {

							colladaUnit = parseFloat( meter );

						}

						break;

					case 'up_axis':

						colladaUp = child.textContent.charAt(0);
						break;

				}

			}

		}

	}

	function parseLib ( q, classSpec, prefix ) {

		var elements = COLLADA.querySelectorAll(q);

		var lib = {};

		var i = 0;

		var elementsLength = elements.length;

		for ( var j = 0; j < elementsLength; j ++ ) {

			var element = elements[j];
			var daeElement = ( new classSpec() ).parse( element );

			if ( !daeElement.id || daeElement.id.length === 0 ) daeElement.id = prefix + ( i ++ );
			lib[ daeElement.id ] = daeElement;

		}

		return lib;

	}

	function parseScene() {

		var sceneElement = COLLADA.querySelectorAll('scene instance_visual_scene')[0];

		if ( sceneElement ) {

			var url = sceneElement.getAttribute( 'url' ).replace( /^#/, '' );
			return visualScenes[ url.length > 0 ? url : 'visual_scene0' ];

		} else {

			return null;

		}

	}

	function parseKinematicsModel() {

		var kinematicsModelElement = COLLADA.querySelectorAll('instance_kinematics_model')[0];

		if ( kinematicsModelElement ) {

			var url = kinematicsModelElement.getAttribute( 'url' ).replace(/^#/, '');
			return kinematicsModels[ url.length > 0 ? url : 'kinematics_model0' ];

		} else {

			return null;

		}

	}

	function createAnimations() {

		animData = [];

		// fill in the keys
		recurseHierarchy( scene );

	}

	function recurseHierarchy( node ) {

		var n = visualScene.getChildById( node.colladaId, true ),
			newData = null;

		if ( n && n.keys ) {

			newData = {
				fps: 60,
				hierarchy: [ {
					node: n,
					keys: n.keys,
					sids: n.sids
				} ],
				node: node,
				name: 'animation_' + node.name,
				length: 0
			};

			animData.push(newData);

			for ( var i = 0, il = n.keys.length; i < il; i ++ ) {

				newData.length = Math.max( newData.length, n.keys[i].time );

			}

		} else {

			newData = {
				hierarchy: [ {
					keys: [],
					sids: []
				} ]
			}

		}

		for ( var i = 0, il = node.children.length; i < il; i ++ ) {

			var d = recurseHierarchy( node.children[i] );

			for ( var j = 0, jl = d.hierarchy.length; j < jl; j ++ ) {

				newData.hierarchy.push( {
					keys: [],
					sids: []
				} );

			}

		}

		return newData;

	}

	function calcAnimationBounds () {

		var start = 1000000;
		var end = -start;
		var frames = 0;
		var ID;
		for ( var id in animations ) {

			var animation = animations[ id ];
			ID = ID || animation.id;
			for ( var i = 0; i < animation.sampler.length; i ++ ) {

				var sampler = animation.sampler[ i ];

				sampler.create();

				start = Math.min( start, sampler.startTime );
				end = Math.max( end, sampler.endTime );
				frames = Math.max( frames, sampler.input.length );

			}

		}

		return { start:start, end:end, frames:frames,ID:ID };

	}

	function createMorph ( geometry, ctrl ) {

		var morphCtrl = ctrl instanceof InstanceController ? controllers[ ctrl.url ] : ctrl;

		if ( !morphCtrl || !morphCtrl.morph ) {

			console.log("could not find morph controller!");
			return;

		}

		var morph = morphCtrl.morph;

		for ( var i = 0; i < morph.targets.length; i ++ ) {

			var target_id = morph.targets[ i ];
			var daeGeometry = geometries[ target_id ];

			if ( !daeGeometry.mesh ||
				 !daeGeometry.mesh.primitives ||
				 !daeGeometry.mesh.primitives.length ) {
				 continue;
			}

			var target = daeGeometry.mesh.primitives[ 0 ].geometry;

			if ( target.vertices.length === geometry.vertices.length ) {

				geometry.morphTargets.push( { name: "target_1", vertices: target.vertices } );

			}

		}

		geometry.morphTargets.push( { name: "target_Z", vertices: geometry.vertices } );

	}

	function createSkin ( geometry, ctrl, applyBindShape ) {

		var skinCtrl = controllers[ ctrl.url ];

		if ( !skinCtrl || !skinCtrl.skin ) {

			console.log( "could not find skin controller!" );
			return;

		}

		if ( !ctrl.skeleton || !ctrl.skeleton.length ) {

			console.log( "could not find the skeleton for the skin!" );
			return;

		}

		var skin = skinCtrl.skin;
		var skeleton = visualScene.getChildById( ctrl.skeleton[ 0 ] );
		var hierarchy = [];

		applyBindShape = applyBindShape !== undefined ? applyBindShape : true;

		var bones = [];
		geometry.skinWeights = [];
		geometry.skinIndices = [];

		//createBones( geometry.bones, skin, hierarchy, skeleton, null, -1 );
		//createWeights( skin, geometry.bones, geometry.skinIndices, geometry.skinWeights );

		/*
		geometry.animation = {
			name: 'take_001',
			fps: 30,
			length: 2,
			JIT: true,
			hierarchy: hierarchy
		};
		*/

		if ( applyBindShape ) {

			for ( var i = 0; i < geometry.vertices.length; i ++ ) {

				geometry.vertices[ i ].applyMatrix4( skin.bindShapeMatrix );

			}

		}

	}

	function setupSkeleton ( node, bones, frame, parent ) {

		node.world = node.world || new THREE.Matrix4();
		node.localworld = node.localworld || new THREE.Matrix4();
		node.world.copy( node.matrix );
		node.localworld.copy( node.matrix );

		if ( node.channels && node.channels.length ) {

			var channel = node.channels[ 0 ];
			var m = channel.sampler.output[ frame ];

			if ( m instanceof THREE.Matrix4 ) {

				node.world.copy( m );
				node.localworld.copy(m);
				if (frame === 0)
					node.matrix.copy(m);
			}

		}

		if ( parent ) {

			node.world.multiplyMatrices( parent, node.world );

		}

		bones.push( node );

		for ( var i = 0; i < node.nodes.length; i ++ ) {

			setupSkeleton( node.nodes[ i ], bones, frame, node.world );

		}

	}

	function setupSkinningMatrices ( bones, skin ) {

		// FIXME: this is dumb...

		for ( var i = 0; i < bones.length; i ++ ) {

			var bone = bones[ i ];
			var found = -1;

			if ( bone.type !== 'JOINT' ) continue;

			for ( var j = 0; j < skin.joints.length; j ++ ) {

				if ( bone.sid === skin.joints[ j ] ) {

					found = j;
					break;

				}

			}

			if ( found >= 0 ) {

				var inv = skin.invBindMatrices[ found ];

				bone.invBindMatrix = inv;
				bone.skinningMatrix = new THREE.Matrix4();
				bone.skinningMatrix.multiplyMatrices(bone.world, inv); // (IBMi * JMi)
				bone.animatrix = new THREE.Matrix4();

				bone.animatrix.copy(bone.localworld);
				bone.weights = [];

				for ( var j = 0; j < skin.weights.length; j ++ ) {

					for (var k = 0; k < skin.weights[ j ].length; k ++ ) {

						var w = skin.weights[ j ][ k ];

						if ( w.joint === found ) {

							bone.weights.push( w );

						}

					}

				}

			} else {

				console.warn( "ColladaLoader: Could not find joint '" + bone.sid + "'." );

				bone.skinningMatrix = new THREE.Matrix4();
				bone.weights = [];

			}
		}

	}

	//Walk the Collada tree and flatten the bones into a list, extract the position, quat and scale from the matrix
	function flattenSkeleton(skeleton) {

		var list = [];
		var walk = function(parentid, node, list) {

			var bone = {};
			bone.name = node.sid;
			bone.parent = parentid;
			bone.matrix = node.matrix;
			var data = [ new THREE.Vector3(),new THREE.Quaternion(),new THREE.Vector3() ];
			bone.matrix.decompose(data[0], data[1], data[2]);

			bone.pos = [ data[0].x,data[0].y,data[0].z ];

			bone.scl = [ data[2].x,data[2].y,data[2].z ];
			bone.rotq = [ data[1].x,data[1].y,data[1].z,data[1].w ];
			list.push(bone);

			for (var i in node.nodes) {

				walk(node.sid, node.nodes[i], list);

			}

		};

		walk(-1, skeleton, list);
		return list;

	}

	//Move the vertices into the pose that is proper for the start of the animation
	function skinToBindPose(geometry,skeleton,skinController) {

		var bones = [];
		setupSkeleton( skeleton, bones, -1 );
		setupSkinningMatrices( bones, skinController.skin );
		var v = new THREE.Vector3(), i, j, w, vidx, weight, o, s;
		var skinned = [];

		for ( i = 0; i < geometry.vertices.length; i ++) {

			skinned.push(new THREE.Vector3());

		}

		for ( i = 0; i < bones.length; i ++ ) {

			if ( bones[ i ].type !== 'JOINT' ) continue;

			for ( j = 0; j < bones[ i ].weights.length; j ++ ) {

				w = bones[ i ].weights[ j ];
				vidx = w.index;
				weight = w.weight;

				o = geometry.vertices[vidx];
				s = skinned[vidx];

				v.x = o.x;
				v.y = o.y;
				v.z = o.z;

				v.applyMatrix4( bones[i].skinningMatrix );

				s.x += (v.x * weight);
				s.y += (v.y * weight);
				s.z += (v.z * weight);
			}

		}

		for ( i = 0; i < geometry.vertices.length; i ++) {

			geometry.vertices[i] = skinned[i];

		}

	}

	function applySkin ( geometry, instanceCtrl, frame ) {

		var skinController = controllers[ instanceCtrl.url ];

		frame = frame !== undefined ? frame : 40;

		if ( !skinController || !skinController.skin ) {

			console.log( 'ColladaLoader: Could not find skin controller.' );
			return;

		}

		if ( !instanceCtrl.skeleton || !instanceCtrl.skeleton.length ) {

			console.log( 'ColladaLoader: Could not find the skeleton for the skin. ' );
			return;

		}

		var animationBounds = calcAnimationBounds();
		var skeleton = visualScene.getChildById( instanceCtrl.skeleton[0], true ) || visualScene.getChildBySid( instanceCtrl.skeleton[0], true );

		//flatten the skeleton into a list of bones
		var bonelist = flattenSkeleton(skeleton);
		var joints = skinController.skin.joints;

		//sort that list so that the order reflects the order in the joint list
		var sortedbones = [];
		for (var i = 0; i < joints.length; i ++) {

			for (var j = 0; j < bonelist.length; j ++) {

				if (bonelist[j].name === joints[i]) {

					sortedbones[i] = bonelist[j];

				}

			}

		}

		//hook up the parents by index instead of name
		for (var i = 0; i < sortedbones.length; i ++) {

			for (var j = 0; j < sortedbones.length; j ++) {

				if (sortedbones[i].parent === sortedbones[j].name) {

					sortedbones[i].parent = j;

				}

			}

		}


		var i, j, weight, indicies;

		// move vertices to bind shape
		for ( i = 0; i < geometry.vertices.length; i ++ ) {
			geometry.vertices[i].applyMatrix4( skinController.skin.bindShapeMatrix );
		}

		var skinIndices = [];
		var skinWeights = [];
		var weights = skinController.skin.weights;

		// hook up the skin weights
		// TODO - this might be a good place to choose greatest 4 weights
		for ( i = 0; i < weights.length; i ++ ) {

			indicies = new THREE.Vector4(weights[i][0] ? weights[i][0].joint : 0,weights[i][1] ? weights[i][1].joint : 0,weights[i][2] ? weights[i][2].joint : 0,weights[i][3] ? weights[i][3].joint : 0);
			weight = new THREE.Vector4(weights[i][0] ? weights[i][0].weight : 0,weights[i][1] ? weights[i][1].weight : 0,weights[i][2] ? weights[i][2].weight : 0,weights[i][3] ? weights[i][3].weight : 0);

			skinIndices.push(indicies);
			skinWeights.push(weight);

		}

		geometry.skinIndices = skinIndices;
		geometry.skinWeights = skinWeights;
		geometry.bones = sortedbones;
		// process animation, or simply pose the rig if no animation

		//create an animation for the animated bones
		//NOTE: this has no effect when using morphtargets
		var animationdata = { "name":animationBounds.ID,"fps":30,"length":animationBounds.frames / 30,"hierarchy":[] };

		for ( j = 0; j < sortedbones.length; j ++) {

			animationdata.hierarchy.push({ parent:sortedbones[j].parent, name:sortedbones[j].name, keys:[] });

		}

		console.log( 'ColladaLoader:', animationBounds.ID + ' has ' + sortedbones.length + ' bones.' );



		skinToBindPose(geometry, skeleton, skinController);


		for ( frame = 0; frame < animationBounds.frames; frame ++ ) {

			var bones = [];
			var skinned = [];
			// process the frame and setup the rig with a fresh
			// transform, possibly from the bone's animation channel(s)

			setupSkeleton( skeleton, bones, frame );
			setupSkinningMatrices( bones, skinController.skin );

			for ( i = 0; i < bones.length; i ++) {

				for ( j = 0; j < animationdata.hierarchy.length; j ++) {

					if (animationdata.hierarchy[j].name === bones[i].sid) {

						var key = {};
						key.time = (frame / 30);
						key.matrix = bones[i].animatrix;

						if (frame === 0)
							bones[i].matrix = key.matrix;

						var data = [ new THREE.Vector3(),new THREE.Quaternion(),new THREE.Vector3() ];
						key.matrix.decompose(data[0], data[1], data[2]);

						key.pos = [ data[0].x,data[0].y,data[0].z ];

						key.scl = [ data[2].x,data[2].y,data[2].z ];
						key.rot = data[1];

						animationdata.hierarchy[j].keys.push(key);

					}

				}

			}

			geometry.animation = animationdata;

		}

	}

	function createKinematics() {

		if ( kinematicsModel && kinematicsModel.joints.length === 0 ) {
			kinematics = undefined;
			return;
		}

		var jointMap = {};

		var _addToMap = function( jointIndex, parentVisualElement ) {

			var parentVisualElementId = parentVisualElement.getAttribute( 'id' );
			var colladaNode = visualScene.getChildById( parentVisualElementId, true );
			var joint = kinematicsModel.joints[ jointIndex ];

			scene.traverse(function( node ) {

				if ( node.colladaId === parentVisualElementId ) {

					jointMap[ jointIndex ] = {
						node: node,
						transforms: colladaNode.transforms,
						joint: joint,
						position: joint.zeroPosition
					};

				}

			});

		};

		kinematics = {

			joints: kinematicsModel && kinematicsModel.joints,

			getJointValue: function( jointIndex ) {

				var jointData = jointMap[ jointIndex ];

				if ( jointData ) {

					return jointData.position;

				} else {

					console.log( 'getJointValue: joint ' + jointIndex + ' doesn\'t exist' );

				}

			},

			setJointValue: function( jointIndex, value ) {

				var jointData = jointMap[ jointIndex ], m1;

				if ( jointData ) {

					var joint = jointData.joint;

					if ( value > joint.limits.max || value < joint.limits.min ) {

						console.log( 'setJointValue: joint ' + jointIndex + ' value ' + value + ' outside of limits (min: ' + joint.limits.min + ', max: ' + joint.limits.max + ')' );

					} else if ( joint.static ) {

						console.log( 'setJointValue: joint ' + jointIndex + ' is static' );

					} else {

						var threejsNode = jointData.node;
						var axis = joint.axis;
						var transforms = jointData.transforms;

						var matrix = new THREE.Matrix4();
                        m1 = new THREE.Matrix4();

						for (i = 0; i < transforms.length; i ++ ) {

							var transform = transforms[ i ];

							// kinda ghetto joint detection
							if ( transform.sid && transform.sid.indexOf( 'joint' + jointIndex ) !== -1 ) {

								// apply actual joint value here
								switch ( joint.type ) {

									case 'revolute':

										matrix.multiply( m1.makeRotationAxis( axis, THREE.Math.degToRad(value) ) );
										break;

									case 'prismatic':

										matrix.multiply( m1.makeTranslation(axis.x * value, axis.y * value, axis.z * value ) );
										break;

									default:

										console.warn( 'setJointValue: unknown joint type: ' + joint.type );
										break;

								}

							} else {

                                m1 = new THREE.Matrix4();

								switch ( transform.type ) {

									case 'matrix':

										matrix.multiply( transform.obj );

										break;

									case 'translate':

										matrix.multiply( m1.makeTranslation( transform.obj.x, transform.obj.y, transform.obj.z ) );

										break;

									case 'rotate':

										matrix.multiply( m1.makeRotationAxis( transform.obj, transform.angle ) );

										break;

								}
							}
						}

						// apply the matrix to the threejs node
						var elementsFloat32Arr = matrix.elements;
						var elements = Array.prototype.slice.call( elementsFloat32Arr );

						var elementsRowMajor = [
							elements[ 0 ],
							elements[ 4 ],
							elements[ 8 ],
							elements[ 12 ],
							elements[ 1 ],
							elements[ 5 ],
							elements[ 9 ],
							elements[ 13 ],
							elements[ 2 ],
							elements[ 6 ],
							elements[ 10 ],
							elements[ 14 ],
							elements[ 3 ],
							elements[ 7 ],
							elements[ 11 ],
							elements[ 15 ]
						];

						threejsNode.matrix.set.apply( threejsNode.matrix, elementsRowMajor );
						threejsNode.matrix.decompose( threejsNode.position, threejsNode.quaternion, threejsNode.scale );
					}

				} else {

					console.log( 'setJointValue: joint ' + jointIndex + ' doesn\'t exist' );

				}

			}

		};

		var element = COLLADA.querySelector('scene instance_kinematics_scene');

		if ( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeType !== 1 ) continue;

				switch ( child.nodeName ) {

					case 'bind_joint_axis':

						var visualTarget = child.getAttribute( 'target' ).split( '/' ).pop();
						var axis = child.querySelector('axis param').textContent;
						var jointIndex = parseInt( axis.split( 'joint' ).pop().split( '.' )[0] );
						var visualTargetElement = COLLADA.querySelector( '[sid="' + visualTarget + '"]' );

						if ( visualTargetElement ) {
							var parentVisualElement = visualTargetElement.parentElement;
							_addToMap(jointIndex, parentVisualElement);
						}

						break;

					default:

						break;

				}

			}
		}

	}

	function createSceneGraph ( node, parent ) {

		var obj = new THREE.Object3D();
		var skinned = false;
		var skinController;
		var morphController;
		var i, j;

		// FIXME: controllers

		for ( i = 0; i < node.controllers.length; i ++ ) {

			var controller = controllers[ node.controllers[ i ].url ];

			switch ( controller.type ) {

				case 'skin':

					if ( geometries[ controller.skin.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.skin.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						skinned = true;
						skinController = node.controllers[ i ];

					} else if ( controllers[ controller.skin.source ] ) {

						// urgh: controller can be chained
						// handle the most basic case...

						var second = controllers[ controller.skin.source ];
						morphController = second;
					//	skinController = node.controllers[i];

						if ( second.morph && geometries[ second.morph.source ] ) {

							var inst_geom = new InstanceGeometry();

							inst_geom.url = second.morph.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );

						}

					}

					break;

				case 'morph':

					if ( geometries[ controller.morph.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.morph.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						morphController = node.controllers[ i ];

					}

					console.log( 'ColladaLoader: Morph-controller partially supported.' );

				default:
					break;

			}

		}

		// geometries

		var double_sided_materials = {};

		for ( i = 0; i < node.geometries.length; i ++ ) {

			var instance_geometry = node.geometries[i];
			var instance_materials = instance_geometry.instance_material;
			var geometry = geometries[ instance_geometry.url ];
			var used_materials = {};
			var used_materials_array = [];
			var num_materials = 0;
			var first_material;

			if ( geometry ) {

				if ( !geometry.mesh || !geometry.mesh.primitives )
					continue;

				if ( obj.name.length === 0 ) {

					obj.name = geometry.id;

				}

				// collect used fx for this geometry-instance

				if ( instance_materials ) {

					for ( j = 0; j < instance_materials.length; j ++ ) {

						var instance_material = instance_materials[ j ];
						var mat = materials[ instance_material.target ];
						var effect_id = mat.instance_effect.url;
						var shader = effects[ effect_id ].shader;
						var material3js = shader.material;

						if ( geometry.doubleSided ) {

							if ( !( instance_material.symbol in double_sided_materials ) ) {

								var _copied_material = material3js.clone();
								_copied_material.side = THREE.DoubleSide;
								double_sided_materials[ instance_material.symbol ] = _copied_material;

							}

							material3js = double_sided_materials[ instance_material.symbol ];

						}

						material3js.opacity = !material3js.opacity ? 1 : material3js.opacity;
						used_materials[ instance_material.symbol ] = num_materials;
						used_materials_array.push( material3js );
						first_material = material3js;
						first_material.name = mat.name === null || mat.name === '' ? mat.id : mat.name;
						num_materials ++;

					}

				}

				var mesh;
				var material = first_material || new THREE.MeshLambertMaterial( { color: 0xdddddd, side: geometry.doubleSided ? THREE.DoubleSide : THREE.FrontSide } );
				var geom = geometry.mesh.geometry3js;

				if ( num_materials > 1 ) {

					material = new THREE.MeshFaceMaterial( used_materials_array );

				}

				if ( skinController !== undefined ) {


					applySkin( geom, skinController );

					if ( geom.morphTargets.length > 0 ) {

						material.morphTargets = true;
						material.skinning = false;

					} else {

						material.morphTargets = false;
						material.skinning = true;

					}


					mesh = new THREE.SkinnedMesh( geom, material, false );


					//mesh.skeleton = skinController.skeleton;
					//mesh.skinController = controllers[ skinController.url ];
					//mesh.skinInstanceController = skinController;
					mesh.name = 'skin_' + skins.length;



					//mesh.animationHandle.setKey(0);
					skins.push( mesh );

				} else if ( morphController !== undefined ) {

					createMorph( geom, morphController );

					material.morphTargets = true;

					mesh = new THREE.Mesh( geom, material );
					mesh.name = 'morph_' + morphs.length;

					morphs.push( mesh );

				} else {

					if ( geom.isLineStrip === true ) {

						mesh = new THREE.Line( geom );

					} else {

						mesh = new THREE.Mesh( geom, material );

					}

				}

				obj.add(mesh);

			}

		}

		for ( i = 0; i < node.cameras.length; i ++ ) {

			var instance_camera = node.cameras[i];
			var cparams = cameras[instance_camera.url];

			var cam = new THREE.PerspectiveCamera(cparams.yfov, parseFloat(cparams.aspect_ratio),
					parseFloat(cparams.znear), parseFloat(cparams.zfar));

			obj.add(cam);
		}

		for ( i = 0; i < node.lights.length; i ++ ) {

			var light = null;
			var instance_light = node.lights[i];
			var lparams = lights[instance_light.url];

			if ( lparams && lparams.technique ) {

				var color = lparams.color.getHex();
				var intensity = lparams.intensity;
				var distance = lparams.distance;
				var angle = lparams.falloff_angle;
				var exponent; // Intentionally undefined, don't know what this is yet

				switch ( lparams.technique ) {

					case 'directional':

						light = new THREE.DirectionalLight( color, intensity, distance );
						light.position.set(0, 0, 1);
						break;

					case 'point':

						light = new THREE.PointLight( color, intensity, distance );
						break;

					case 'spot':

						light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
						light.position.set(0, 0, 1);
						break;

					case 'ambient':

						light = new THREE.AmbientLight( color );
						break;

				}

			}

			if (light) {
				obj.add(light);
			}
		}

		obj.name = node.name || node.id || "";
		obj.colladaId = node.id || "";
		obj.layer = node.layer || "";
		obj.matrix = node.matrix;
		obj.matrix.decompose( obj.position, obj.quaternion, obj.scale );

		if ( options.centerGeometry && obj.geometry ) {

			var delta = obj.geometry.center();
			delta.multiply( obj.scale );
			delta.applyQuaternion( obj.quaternion );

			obj.position.sub( delta );

		}

		for ( i = 0; i < node.nodes.length; i ++ ) {

			obj.add( createSceneGraph( node.nodes[i], node ) );

		}

		return obj;

	}

	function getJointId( skin, id ) {

		for ( var i = 0; i < skin.joints.length; i ++ ) {

			if ( skin.joints[ i ] === id ) {

				return i;

			}

		}

	}

	function getLibraryNode( id ) {

		var nodes = COLLADA.querySelectorAll('library_nodes node');

		for ( var i = 0; i < nodes.length; i++ ) {

			var attObj = nodes[i].attributes.getNamedItem('id');

			if ( attObj && attObj.value === id ) {

				return nodes[i];

			}

		}

		return undefined;

	}

	function getChannelsForNode ( node ) {

		var channels = [];
		var startTime = 1000000;
		var endTime = -1000000;

		for ( var id in animations ) {

			var animation = animations[id];

			for ( var i = 0; i < animation.channel.length; i ++ ) {

				var channel = animation.channel[i];
				var sampler = animation.sampler[i];
				var id = channel.target.split('/')[0];

				if ( id === node.id ) {

					sampler.create();
					channel.sampler = sampler;
					startTime = Math.min(startTime, sampler.startTime);
					endTime = Math.max(endTime, sampler.endTime);
					channels.push(channel);

				}

			}

		}

		if ( channels.length ) {

			node.startTime = startTime;
			node.endTime = endTime;

		}

		return channels;

	}

	function calcFrameDuration( node ) {

		var minT = 10000000;

		for ( var i = 0; i < node.channels.length; i ++ ) {

			var sampler = node.channels[i].sampler;

			for ( var j = 0; j < sampler.input.length - 1; j ++ ) {

				var t0 = sampler.input[ j ];
				var t1 = sampler.input[ j + 1 ];
				minT = Math.min( minT, t1 - t0 );

			}
		}

		return minT;

	}

	function calcMatrixAt( node, t ) {

		var animated = {};

		var i, j;

		for ( i = 0; i < node.channels.length; i ++ ) {

			var channel = node.channels[ i ];
			animated[ channel.sid ] = channel;

		}

		var matrix = new THREE.Matrix4();

		for ( i = 0; i < node.transforms.length; i ++ ) {

			var transform = node.transforms[ i ];
			var channel = animated[ transform.sid ];

			if ( channel !== undefined ) {

				var sampler = channel.sampler;
				var value;

				for ( j = 0; j < sampler.input.length - 1; j ++ ) {

					if ( sampler.input[ j + 1 ] > t ) {

						value = sampler.output[ j ];
						//console.log(value.flatten)
						break;

					}

				}

				if ( value !== undefined ) {

					if ( value instanceof THREE.Matrix4 ) {

						matrix.multiplyMatrices( matrix, value );

					} else {

						// FIXME: handle other types

						matrix.multiplyMatrices( matrix, transform.matrix );

					}

				} else {

					matrix.multiplyMatrices( matrix, transform.matrix );

				}

			} else {

				matrix.multiplyMatrices( matrix, transform.matrix );

			}

		}

		return matrix;

	}

	function bakeAnimations ( node ) {

		if ( node.channels && node.channels.length ) {

			var keys = [],
				sids = [];

			for ( var i = 0, il = node.channels.length; i < il; i ++ ) {

				var channel = node.channels[i],
					fullSid = channel.fullSid,
					sampler = channel.sampler,
					input = sampler.input,
					transform = node.getTransformBySid( channel.sid ),
					member;

				if ( channel.arrIndices ) {

					member = [];

					for ( var j = 0, jl = channel.arrIndices.length; j < jl; j ++ ) {

						member[ j ] = getConvertedIndex( channel.arrIndices[ j ] );

					}

				} else {

					member = getConvertedMember( channel.member );

				}

				if ( transform ) {

					if ( sids.indexOf( fullSid ) === -1 ) {

						sids.push( fullSid );

					}

					for ( var j = 0, jl = input.length; j < jl; j ++ ) {

						var time = input[j],
							data = sampler.getData( transform.type, j, member ),
							key = findKey( keys, time );

						if ( !key ) {

							key = new Key( time );
							var timeNdx = findTimeNdx( keys, time );
							keys.splice( timeNdx === -1 ? keys.length : timeNdx, 0, key );

						}

						key.addTarget( fullSid, transform, member, data );

					}

				} else {

					console.log( 'Could not find transform "' + channel.sid + '" in node ' + node.id );

				}

			}

			// post process
			for ( var i = 0; i < sids.length; i ++ ) {

				var sid = sids[ i ];

				for ( var j = 0; j < keys.length; j ++ ) {

					var key = keys[ j ];

					if ( !key.hasTarget( sid ) ) {

						interpolateKeys( keys, key, j, sid );

					}

				}

			}

			node.keys = keys;
			node.sids = sids;

		}

	}

	function findKey ( keys, time) {

		var retVal = null;

		for ( var i = 0, il = keys.length; i < il && retVal === null; i ++ ) {

			var key = keys[i];

			if ( key.time === time ) {

				retVal = key;

			} else if ( key.time > time ) {

				break;

			}

		}

		return retVal;

	}

	function findTimeNdx ( keys, time) {

		var ndx = -1;

		for ( var i = 0, il = keys.length; i < il && ndx === -1; i ++ ) {

			var key = keys[i];

			if ( key.time >= time ) {

				ndx = i;

			}

		}

		return ndx;

	}

	function interpolateKeys ( keys, key, ndx, fullSid ) {

		var prevKey = getPrevKeyWith( keys, fullSid, ndx ? ndx - 1 : 0 ),
			nextKey = getNextKeyWith( keys, fullSid, ndx + 1 );

		if ( prevKey && nextKey ) {

			var scale = (key.time - prevKey.time) / (nextKey.time - prevKey.time),
				prevTarget = prevKey.getTarget( fullSid ),
				nextData = nextKey.getTarget( fullSid ).data,
				prevData = prevTarget.data,
				data;

			if ( prevTarget.type === 'matrix' ) {

				data = prevData;

			} else if ( prevData.length ) {

				data = [];

				for ( var i = 0; i < prevData.length; ++ i ) {

					data[ i ] = prevData[ i ] + ( nextData[ i ] - prevData[ i ] ) * scale;

				}

			} else {

				data = prevData + ( nextData - prevData ) * scale;

			}

			key.addTarget( fullSid, prevTarget.transform, prevTarget.member, data );

		}

	}

	// Get next key with given sid

	function getNextKeyWith( keys, fullSid, ndx ) {

		for ( ; ndx < keys.length; ndx ++ ) {

			var key = keys[ ndx ];

			if ( key.hasTarget( fullSid ) ) {

				return key;

			}

		}

		return null;

	}

	// Get previous key with given sid

	function getPrevKeyWith( keys, fullSid, ndx ) {

		ndx = ndx >= 0 ? ndx : ndx + keys.length;

		for ( ; ndx >= 0; ndx -- ) {

			var key = keys[ ndx ];

			if ( key.hasTarget( fullSid ) ) {

				return key;

			}

		}

		return null;

	}

	function _Image() {

		this.id = "";
		this.init_from = "";

	}

	_Image.prototype.parse = function(element) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName === 'init_from' ) {

				this.init_from = child.textContent;

			}

		}

		return this;

	};

	function Controller() {

		this.id = "";
		this.name = "";
		this.type = "";
		this.skin = null;
		this.morph = null;

	}

	Controller.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.type = "none";

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'skin':

					this.skin = (new Skin()).parse(child);
					this.type = child.nodeName;
					break;

				case 'morph':

					this.morph = (new Morph()).parse(child);
					this.type = child.nodeName;
					break;

				default:
					break;

			}
		}

		return this;

	};

	function Morph() {

		this.method = null;
		this.source = null;
		this.targets = null;
		this.weights = null;

	}

	Morph.prototype.parse = function( element ) {

		var sources = {};
		var inputs = [];
		var i;

		this.method = element.getAttribute( 'method' );
		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var source = ( new Source() ).parse( child );
					sources[ source.id ] = source;
					break;

				case 'targets':

					inputs = this.parseInputs( child );
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		for ( i = 0; i < inputs.length; i ++ ) {

			var input = inputs[ i ];
			var source = sources[ input.source ];

			switch ( input.semantic ) {

				case 'MORPH_TARGET':

					this.targets = source.read();
					break;

				case 'MORPH_WEIGHT':

					this.weights = source.read();
					break;

				default:
					break;

			}
		}

		return this;

	};

	Morph.prototype.parseInputs = function(element) {

		var inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( (new Input()).parse(child) );
					break;

				default:
					break;
			}
		}

		return inputs;

	};

	function Skin() {

		this.source = "";
		this.bindShapeMatrix = null;
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

	}

	Skin.prototype.parse = function( element ) {

		var sources = {};
		var joints, weights;

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'bind_shape_matrix':

					var f = _floats(child.textContent);
					this.bindShapeMatrix = getConvertedMat4( f );
					break;

				case 'source':

					var src = new Source().parse(child);
					sources[ src.id ] = src;
					break;

				case 'joints':

					joints = child;
					break;

				case 'vertex_weights':

					weights = child;
					break;

				default:

					console.log( child.nodeName );
					break;

			}
		}

		this.parseJoints( joints, sources );
		this.parseWeights( weights, sources );

		return this;

	};

	Skin.prototype.parseJoints = function ( element, sources ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					var input = ( new Input() ).parse( child );
					var source = sources[ input.source ];

					if ( input.semantic === 'JOINT' ) {

						this.joints = source.read();

					} else if ( input.semantic === 'INV_BIND_MATRIX' ) {

						this.invBindMatrices = source.read();

					}

					break;

				default:
					break;
			}

		}

	};

	Skin.prototype.parseWeights = function ( element, sources ) {

		var v, vcount, inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( ( new Input() ).parse( child ) );
					break;

				case 'v':

					v = _ints( child.textContent );
					break;

				case 'vcount':

					vcount = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		var index = 0;

		for ( var i = 0; i < vcount.length; i ++ ) {

			var numBones = vcount[i];
			var vertex_weights = [];

			for ( var j = 0; j < numBones; j ++ ) {

				var influence = {};

				for ( var k = 0; k < inputs.length; k ++ ) {

					var input = inputs[ k ];
					var value = v[ index + input.offset ];

					switch ( input.semantic ) {

						case 'JOINT':

							influence.joint = value;//this.joints[value];
							break;

						case 'WEIGHT':

							influence.weight = sources[ input.source ].data[ value ];
							break;

						default:
							break;

					}

				}

				vertex_weights.push( influence );
				index += inputs.length;
			}

			for ( var j = 0; j < vertex_weights.length; j ++ ) {

				vertex_weights[ j ].index = i;

			}

			this.weights.push( vertex_weights );

		}

	};

	function VisualScene () {

		this.id = "";
		this.name = "";
		this.nodes = [];
		this.scene = new THREE.Group();

	}

	VisualScene.prototype.getChildById = function( id, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildById( id, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.getChildBySid = function( sid, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildBySid( sid, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.parse = function( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.nodes = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Node() {

		this.id = "";
		this.name = "";
		this.sid = "";
		this.nodes = [];
		this.controllers = [];
		this.transforms = [];
		this.geometries = [];
		this.channels = [];
		this.matrix = new THREE.Matrix4();

	}

	Node.prototype.getChannelForTransform = function( transformSid ) {

		for ( var i = 0; i < this.channels.length; i ++ ) {

			var channel = this.channels[i];
			var parts = channel.target.split('/');
			var id = parts.shift();
			var sid = parts.shift();
			var dotSyntax = (sid.indexOf(".") >= 0);
			var arrSyntax = (sid.indexOf("(") >= 0);
			var arrIndices;
			var member;

			if ( dotSyntax ) {

				parts = sid.split(".");
				sid = parts.shift();
				member = parts.shift();

			} else if ( arrSyntax ) {

				arrIndices = sid.split("(");
				sid = arrIndices.shift();

				for ( var j = 0; j < arrIndices.length; j ++ ) {

					arrIndices[ j ] = parseInt( arrIndices[ j ].replace( /\)/, '' ) );

				}

			}

			if ( sid === transformSid ) {

				channel.info = { sid: sid, dotSyntax: dotSyntax, arrSyntax: arrSyntax, arrIndices: arrIndices };
				return channel;

			}

		}

		return null;

	};

	Node.prototype.getChildById = function ( id, recursive ) {

		if ( this.id === id ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildById( id, recursive );

				if ( n ) {

					return n;

				}

			}

		}

		return null;

	};

	Node.prototype.getChildBySid = function ( sid, recursive ) {

		if ( this.sid === sid ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildBySid( sid, recursive );

				if ( n ) {

					return n;

				}

			}
		}

		return null;

	};

	Node.prototype.getTransformBySid = function ( sid ) {

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			if ( this.transforms[ i ].sid === sid ) return this.transforms[ i ];

		}

		return null;

	};

	Node.prototype.parse = function( element ) {

		var url;

		this.id = element.getAttribute('id');
		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.type = element.getAttribute('type');
		this.layer = element.getAttribute('layer');

		this.type = this.type === 'JOINT' ? this.type : 'NODE';

		this.nodes = [];
		this.transforms = [];
		this.geometries = [];
		this.cameras = [];
		this.lights = [];
		this.controllers = [];
		this.matrix = new THREE.Matrix4();

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				case 'instance_camera':

					this.cameras.push( ( new InstanceCamera() ).parse( child ) );
					break;

				case 'instance_controller':

					this.controllers.push( ( new InstanceController() ).parse( child ) );
					break;

				case 'instance_geometry':

					this.geometries.push( ( new InstanceGeometry() ).parse( child ) );
					break;

				case 'instance_light':

					this.lights.push( ( new InstanceLight() ).parse( child ) );
					break;

				case 'instance_node':

					url = child.getAttribute( 'url' ).replace( /^#/, '' );
					var iNode = getLibraryNode( url );

					if ( iNode ) {

						this.nodes.push( ( new Node() ).parse( iNode )) ;

					}

					break;

				case 'rotate':
				case 'translate':
				case 'scale':
				case 'matrix':
				case 'lookat':
				case 'skew':

					this.transforms.push( ( new Transform() ).parse( child ) );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		this.channels = getChannelsForNode( this );
		bakeAnimations( this );

		this.updateMatrix();

		return this;

	};

	Node.prototype.updateMatrix = function () {

		this.matrix.identity();

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			this.transforms[ i ].apply( this.matrix );

		}

	};

	function Transform () {

		this.sid = "";
		this.type = "";
		this.data = [];
		this.obj = null;

	}

	Transform.prototype.parse = function ( element ) {

		this.sid = element.getAttribute( 'sid' );
		this.type = element.nodeName;
		this.data = _floats( element.textContent );
		this.convert();

		return this;

	};

	Transform.prototype.convert = function () {

		switch ( this.type ) {

			case 'matrix':

				this.obj = getConvertedMat4( this.data );
				break;

			case 'rotate':

				this.angle = THREE.Math.degToRad( this.data[3] );

			case 'translate':

				fixCoords( this.data, -1 );
				this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
				break;

			case 'scale':

				fixCoords( this.data, 1 );
				this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
				break;

			default:
				console.log( 'Can not convert Transform of type ' + this.type );
				break;

		}

	};

	Transform.prototype.apply = function () {

		var m1 = new THREE.Matrix4();

		return function ( matrix ) {

			switch ( this.type ) {

				case 'matrix':

					matrix.multiply( this.obj );

					break;

				case 'translate':

					matrix.multiply( m1.makeTranslation( this.obj.x, this.obj.y, this.obj.z ) );

					break;

				case 'rotate':

					matrix.multiply( m1.makeRotationAxis( this.obj, this.angle ) );

					break;

				case 'scale':

					matrix.scale( this.obj );

					break;

			}

		};

	}();

	Transform.prototype.update = function ( data, member ) {

		var members = [ 'X', 'Y', 'Z', 'ANGLE' ];

		switch ( this.type ) {

			case 'matrix':

				if ( ! member ) {

					this.obj.copy( data );

				} else if ( member.length === 1 ) {

					switch ( member[ 0 ] ) {

						case 0:

							this.obj.n11 = data[ 0 ];
							this.obj.n21 = data[ 1 ];
							this.obj.n31 = data[ 2 ];
							this.obj.n41 = data[ 3 ];

							break;

						case 1:

							this.obj.n12 = data[ 0 ];
							this.obj.n22 = data[ 1 ];
							this.obj.n32 = data[ 2 ];
							this.obj.n42 = data[ 3 ];

							break;

						case 2:

							this.obj.n13 = data[ 0 ];
							this.obj.n23 = data[ 1 ];
							this.obj.n33 = data[ 2 ];
							this.obj.n43 = data[ 3 ];

							break;

						case 3:

							this.obj.n14 = data[ 0 ];
							this.obj.n24 = data[ 1 ];
							this.obj.n34 = data[ 2 ];
							this.obj.n44 = data[ 3 ];

							break;

					}

				} else if ( member.length === 2 ) {

					var propName = 'n' + ( member[ 0 ] + 1 ) + ( member[ 1 ] + 1 );
					this.obj[ propName ] = data;

				} else {

					console.log('Incorrect addressing of matrix in transform.');

				}

				break;

			case 'translate':
			case 'scale':

				if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

					member = members[ member[ 0 ] ];

				}

				switch ( member ) {

					case 'X':

						this.obj.x = data;
						break;

					case 'Y':

						this.obj.y = data;
						break;

					case 'Z':

						this.obj.z = data;
						break;

					default:

						this.obj.x = data[ 0 ];
						this.obj.y = data[ 1 ];
						this.obj.z = data[ 2 ];
						break;

				}

				break;

			case 'rotate':

				if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

					member = members[ member[ 0 ] ];

				}

				switch ( member ) {

					case 'X':

						this.obj.x = data;
						break;

					case 'Y':

						this.obj.y = data;
						break;

					case 'Z':

						this.obj.z = data;
						break;

					case 'ANGLE':

						this.angle = THREE.Math.degToRad( data );
						break;

					default:

						this.obj.x = data[ 0 ];
						this.obj.y = data[ 1 ];
						this.obj.z = data[ 2 ];
						this.angle = THREE.Math.degToRad( data[ 3 ] );
						break;

				}
				break;

		}

	};

	function InstanceController() {

		this.url = "";
		this.skeleton = [];
		this.instance_material = [];

	}

	InstanceController.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.skeleton = [];
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'skeleton':

					this.skeleton.push( child.textContent.replace(/^#/, '') );
					break;

				case 'bind_material':

					var instances = child.querySelectorAll('instance_material');

					for ( var j = 0; j < instances.length; j ++ ) {

						var instance = instances[j];
						this.instance_material.push( (new InstanceMaterial()).parse(instance) );

					}


					break;

				case 'extra':
					break;

				default:
					break;

			}
		}

		return this;

	};

	function InstanceMaterial () {

		this.symbol = "";
		this.target = "";

	}

	InstanceMaterial.prototype.parse = function ( element ) {

		this.symbol = element.getAttribute('symbol');
		this.target = element.getAttribute('target').replace(/^#/, '');
		return this;

	};

	function InstanceGeometry() {

		this.url = "";
		this.instance_material = [];

	}

	InstanceGeometry.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1 ) continue;

			if ( child.nodeName === 'bind_material' ) {

				var instances = child.querySelectorAll('instance_material');

				for ( var j = 0; j < instances.length; j ++ ) {

					var instance = instances[j];
					this.instance_material.push( (new InstanceMaterial()).parse(instance) );

				}

				break;

			}

		}

		return this;

	};

	function Geometry() {

		this.id = "";
		this.mesh = null;

	}

	Geometry.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		extractDoubleSided( this, element );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'mesh':

					this.mesh = (new Mesh(this)).parse(child);
					break;

				case 'extra':

					// console.log( child );
					break;

				default:
					break;
			}
		}

		return this;

	};

	function Mesh( geometry ) {

		this.geometry = geometry.id;
		this.primitives = [];
		this.vertices = null;
		this.geometry3js = null;

	}

	Mesh.prototype.parse = function ( element ) {

		this.primitives = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'source':

					_source( child );
					break;

				case 'vertices':

					this.vertices = ( new Vertices() ).parse( child );
					break;

				case 'linestrips':

					this.primitives.push( ( new LineStrips().parse( child ) ) );
					break;

				case 'triangles':

					this.primitives.push( ( new Triangles().parse( child ) ) );
					break;

				case 'polygons':

					this.primitives.push( ( new Polygons().parse( child ) ) );
					break;

				case 'polylist':

					this.primitives.push( ( new Polylist().parse( child ) ) );
					break;

				default:
					break;

			}

		}

		this.geometry3js = new THREE.Geometry();

		if ( this.vertices === null ) {

			// TODO (mrdoob): Study case when this is null (carrier.dae)

			return this;

		}

		var vertexData = sources[ this.vertices.input['POSITION'].source ].data;

		for ( var i = 0; i < vertexData.length; i += 3 ) {

			this.geometry3js.vertices.push( getConvertedVec3( vertexData, i ).clone() );

		}

		for ( var i = 0; i < this.primitives.length; i ++ ) {

			var primitive = this.primitives[ i ];
			primitive.setVertices( this.vertices );
			this.handlePrimitive( primitive, this.geometry3js );

		}

		if ( this.geometry3js.calcNormals ) {

			this.geometry3js.computeVertexNormals();
			delete this.geometry3js.calcNormals;

		}

		return this;

	};

	Mesh.prototype.handlePrimitive = function ( primitive, geom ) {

		if ( primitive instanceof LineStrips ) {

			// TODO: Handle indices. Maybe easier with BufferGeometry?

			geom.isLineStrip = true;
			return;

		}

		var j, k, pList = primitive.p, inputs = primitive.inputs;
		var input, index, idx32;
		var source, numParams;
		var vcIndex = 0, vcount = 3, maxOffset = 0;
		var texture_sets = [];

		for ( j = 0; j < inputs.length; j ++ ) {

			input = inputs[ j ];

			var offset = input.offset + 1;
			maxOffset = (maxOffset < offset) ? offset : maxOffset;

			switch ( input.semantic ) {

				case 'TEXCOORD':
					texture_sets.push( input.set );
					break;

			}

		}

		for ( var pCount = 0; pCount < pList.length; ++ pCount ) {

			var p = pList[ pCount ], i = 0;

			while ( i < p.length ) {

				var vs = [];
				var ns = [];
				var ts = null;
				var cs = [];

				if ( primitive.vcount ) {

					vcount = primitive.vcount.length ? primitive.vcount[ vcIndex ++ ] : primitive.vcount;

				} else {

					vcount = p.length / maxOffset;

				}


				for ( j = 0; j < vcount; j ++ ) {

					for ( k = 0; k < inputs.length; k ++ ) {

						input = inputs[ k ];
						source = sources[ input.source ];

						index = p[ i + ( j * maxOffset ) + input.offset ];
						numParams = source.accessor.params.length;
						idx32 = index * numParams;

						switch ( input.semantic ) {

							case 'VERTEX':

								vs.push( index );

								break;

							case 'NORMAL':

								ns.push( getConvertedVec3( source.data, idx32 ) );

								break;

							case 'TEXCOORD':

								ts = ts || { };
								if ( ts[ input.set ] === undefined ) ts[ input.set ] = [];
								// invert the V
								ts[ input.set ].push( new THREE.Vector2( source.data[ idx32 ], source.data[ idx32 + 1 ] ) );

								break;

							case 'COLOR':

								cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

								break;

							default:

								break;

						}

					}

				}

				if ( ns.length === 0 ) {

					// check the vertices inputs
					input = this.vertices.input.NORMAL;

					if ( input ) {

						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							ns.push( getConvertedVec3( source.data, vs[ ndx ] * numParams ) );

						}

					} else {

						geom.calcNormals = true;

					}

				}

				if ( !ts ) {

					ts = { };
					// check the vertices inputs
					input = this.vertices.input.TEXCOORD;

					if ( input ) {

						texture_sets.push( input.set );
						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							idx32 = vs[ ndx ] * numParams;
							if ( ts[ input.set ] === undefined ) ts[ input.set ] = [ ];
							// invert the V
							ts[ input.set ].push( new THREE.Vector2( source.data[ idx32 ], 1.0 - source.data[ idx32 + 1 ] ) );

						}

					}

				}

				if ( cs.length === 0 ) {

					// check the vertices inputs
					input = this.vertices.input.COLOR;

					if ( input ) {

						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							idx32 = vs[ ndx ] * numParams;
							cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

						}

					}

				}

				var face = null, faces = [], uv, uvArr;

				if ( vcount === 3 ) {

					faces.push( new THREE.Face3( vs[0], vs[1], vs[2], ns, cs.length ? cs : new THREE.Color() ) );

				} else if ( vcount === 4 ) {

					faces.push( new THREE.Face3( vs[0], vs[1], vs[3], [ ns[0].clone(), ns[1].clone(), ns[3].clone() ], cs.length ? [ cs[0], cs[1], cs[3] ] : new THREE.Color() ) );

					faces.push( new THREE.Face3( vs[1], vs[2], vs[3], [ ns[1].clone(), ns[2].clone(), ns[3].clone() ], cs.length ? [ cs[1], cs[2], cs[3] ] : new THREE.Color() ) );

				} else if ( vcount > 4 && options.subdivideFaces ) {

					var clr = cs.length ? cs : new THREE.Color(),
						vec1, vec2, vec3, v1, v2, norm;

					// subdivide into multiple Face3s

					for ( k = 1; k < vcount - 1; ) {

						faces.push( new THREE.Face3( vs[0], vs[k], vs[k + 1], [ ns[0].clone(), ns[k ++].clone(), ns[k].clone() ], clr ) );

					}

				}

				if ( faces.length ) {

					for ( var ndx = 0, len = faces.length; ndx < len; ndx ++ ) {

						face = faces[ndx];
						face.daeMaterial = primitive.material;
						geom.faces.push( face );

						for ( k = 0; k < texture_sets.length; k ++ ) {

							uv = ts[ texture_sets[k] ];

							if ( vcount > 4 ) {

								// Grab the right UVs for the vertices in this face
								uvArr = [ uv[0], uv[ndx + 1], uv[ndx + 2] ];

							} else if ( vcount === 4 ) {

								if ( ndx === 0 ) {

									uvArr = [ uv[0], uv[1], uv[3] ];

								} else {

									uvArr = [ uv[1].clone(), uv[2], uv[3].clone() ];

								}

							} else {

								uvArr = [ uv[0], uv[1], uv[2] ];

							}

							if ( geom.faceVertexUvs[k] === undefined ) {

								geom.faceVertexUvs[k] = [];

							}

							geom.faceVertexUvs[k].push( uvArr );

						}

					}

				} else {

					console.log( 'dropped face with vcount ' + vcount + ' for geometry with id: ' + geom.id );

				}

				i += maxOffset * vcount;

			}

		}

	};

	function Polygons () {

		this.material = "";
		this.count = 0;
		this.inputs = [];
		this.vcount = null;
		this.p = [];
		this.geometry = new THREE.Geometry();

	}

	Polygons.prototype.setVertices = function ( vertices ) {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			if ( this.inputs[ i ].source === vertices.id ) {

				this.inputs[ i ].source = vertices.input[ 'POSITION' ].source;

			}

		}

	};

	Polygons.prototype.parse = function ( element ) {

		this.material = element.getAttribute( 'material' );
		this.count = _attr_as_int( element, 'count', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( ( new Input() ).parse( element.childNodes[ i ] ) );
					break;

				case 'vcount':

					this.vcount = _ints( child.textContent );
					break;

				case 'p':

					this.p.push( _ints( child.textContent ) );
					break;

				case 'ph':

					console.warn( 'polygon holes not yet supported!' );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Polylist () {

		Polygons.call( this );

		this.vcount = [];

	}

	Polylist.prototype = Object.create( Polygons.prototype );
	Polylist.prototype.constructor = Polylist;

	function LineStrips() {

		Polygons.call( this );

		this.vcount = 1;

	}

	LineStrips.prototype = Object.create( Polygons.prototype );
	LineStrips.prototype.constructor = LineStrips;

	function Triangles () {

		Polygons.call( this );

		this.vcount = 3;

	}

	Triangles.prototype = Object.create( Polygons.prototype );
	Triangles.prototype.constructor = Triangles;

	function Accessor() {

		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];

	}

	Accessor.prototype.parse = function ( element ) {

		this.params = [];
		this.source = element.getAttribute( 'source' );
		this.count = _attr_as_int( element, 'count', 0 );
		this.stride = _attr_as_int( element, 'stride', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName === 'param' ) {

				var param = {};
				param[ 'name' ] = child.getAttribute( 'name' );
				param[ 'type' ] = child.getAttribute( 'type' );
				this.params.push( param );

			}

		}

		return this;

	};

	function Vertices() {

		this.input = {};

	}

	Vertices.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[i].nodeName === 'input' ) {

				var input = ( new Input() ).parse( element.childNodes[ i ] );
				this.input[ input.semantic ] = input;

			}

		}

		return this;

	};

	function Input () {

		this.semantic = "";
		this.offset = 0;
		this.source = "";
		this.set = 0;

	}

	Input.prototype.parse = function ( element ) {

		this.semantic = element.getAttribute('semantic');
		this.source = element.getAttribute('source').replace(/^#/, '');
		this.set = _attr_as_int(element, 'set', -1);
		this.offset = _attr_as_int(element, 'offset', 0);

		if ( this.semantic === 'TEXCOORD' && this.set < 0 ) {

			this.set = 0;

		}

		return this;

	};

	function Source ( id ) {

		this.id = id;
		this.type = null;

	}

	Source.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'bool_array':

					this.data = _bools( child.textContent );
					this.type = child.nodeName;
					break;

				case 'float_array':

					this.data = _floats( child.textContent );
					this.type = child.nodeName;
					break;

				case 'int_array':

					this.data = _ints( child.textContent );
					this.type = child.nodeName;
					break;

				case 'IDREF_array':
				case 'Name_array':

					this.data = _strings( child.textContent );
					this.type = child.nodeName;
					break;

				case 'technique_common':

					for ( var j = 0; j < child.childNodes.length; j ++ ) {

						if ( child.childNodes[ j ].nodeName === 'accessor' ) {

							this.accessor = ( new Accessor() ).parse( child.childNodes[ j ] );
							break;

						}
					}
					break;

				default:
					// console.log(child.nodeName);
					break;

			}

		}

		return this;

	};

	Source.prototype.read = function () {

		var result = [];

		//for (var i = 0; i < this.accessor.params.length; i++) {

		var param = this.accessor.params[ 0 ];

			//console.log(param.name + " " + param.type);

		switch ( param.type ) {

			case 'IDREF':
			case 'Name': case 'name':
			case 'float':

				return this.data;

			case 'float4x4':

				for ( var j = 0; j < this.data.length; j += 16 ) {

					var s = this.data.slice( j, j + 16 );
					var m = getConvertedMat4( s );
					result.push( m );
				}

				break;

			default:

				console.log( 'ColladaLoader: Source: Read dont know how to read ' + param.type + '.' );
				break;

		}

		//}

		return result;

	};

	function Material () {

		this.id = "";
		this.name = "";
		this.instance_effect = null;

	}

	Material.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName === 'instance_effect' ) {

				this.instance_effect = ( new InstanceEffect() ).parse( element.childNodes[ i ] );
				break;

			}

		}

		return this;

	};

	function ColorOrTexture () {

		this.color = new THREE.Color();
		this.color.setRGB( Math.random(), Math.random(), Math.random() );
		this.color.a = 1.0;

		this.texture = null;
		this.texcoord = null;
		this.texOpts = null;

	}

	ColorOrTexture.prototype.isColor = function () {

		return ( this.texture === null );

	};

	ColorOrTexture.prototype.isTexture = function () {

		return ( this.texture !== null );

	};

	ColorOrTexture.prototype.parse = function ( element ) {

		if (element.nodeName === 'transparent') {

			this.opaque = element.getAttribute('opaque');

		}

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'color':

					var rgba = _floats( child.textContent );
					this.color = new THREE.Color();
					this.color.setRGB( rgba[0], rgba[1], rgba[2] );
					this.color.a = rgba[3];
					break;

				case 'texture':

					this.texture = child.getAttribute('texture');
					this.texcoord = child.getAttribute('texcoord');
					// Defaults from:
					// https://collada.org/mediawiki/index.php/Maya_texture_placement_MAYA_extension
					this.texOpts = {
						offsetU: 0,
						offsetV: 0,
						repeatU: 1,
						repeatV: 1,
						wrapU: 1,
						wrapV: 1
					};
					this.parseTexture( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	ColorOrTexture.prototype.parseTexture = function ( element ) {

		if ( ! element.childNodes ) return this;

		// This should be supported by Maya, 3dsMax, and MotionBuilder

		if ( element.childNodes[1] && element.childNodes[1].nodeName === 'extra' ) {

			element = element.childNodes[1];

			if ( element.childNodes[1] && element.childNodes[1].nodeName === 'technique' ) {

				element = element.childNodes[1];

			}

		}

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'offsetU':
				case 'offsetV':
				case 'repeatU':
				case 'repeatV':

					this.texOpts[ child.nodeName ] = parseFloat( child.textContent );

					break;

				case 'wrapU':
				case 'wrapV':

					// some dae have a value of true which becomes NaN via parseInt

					if ( child.textContent.toUpperCase() === 'TRUE' ) {

						this.texOpts[ child.nodeName ] = 1;

					} else {

						this.texOpts[ child.nodeName ] = parseInt( child.textContent );

					}
					break;

				default:

					this.texOpts[ child.nodeName ] = child.textContent;

					break;

			}

		}

		return this;

	};

	function Shader ( type, effect ) {

		this.type = type;
		this.effect = effect;
		this.material = null;

	}

	Shader.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'transparent':

					this[ child.nodeName ] = ( new ColorOrTexture() ).parse( child );
					break;

				case 'bump':

					// If 'bumptype' is 'heightfield', create a 'bump' property
					// Else if 'bumptype' is 'normalmap', create a 'normal' property
					// (Default to 'bump')
					var bumpType = child.getAttribute( 'bumptype' );
					if ( bumpType ) {
						if ( bumpType.toLowerCase() === "heightfield" ) {
							this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
						} else if ( bumpType.toLowerCase() === "normalmap" ) {
							this[ 'normal' ] = ( new ColorOrTexture() ).parse( child );
						} else {
							console.error( "Shader.prototype.parse: Invalid value for attribute 'bumptype' (" + bumpType + ") - valid bumptypes are 'HEIGHTFIELD' and 'NORMALMAP' - defaulting to 'HEIGHTFIELD'" );
							this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
						}
					} else {
						console.warn( "Shader.prototype.parse: Attribute 'bumptype' missing from bump node - defaulting to 'HEIGHTFIELD'" );
						this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
					}

					break;

				case 'shininess':
				case 'reflectivity':
				case 'index_of_refraction':
				case 'transparency':

					var f = child.querySelectorAll('float');

					if ( f.length > 0 )
						this[ child.nodeName ] = parseFloat( f[ 0 ].textContent );

					break;

				default:
					break;

			}

		}

		this.create();
		return this;

	};

	Shader.prototype.create = function() {

		var props = {};

		var transparent = false;

		if (this['transparency'] !== undefined && this['transparent'] !== undefined) {
			// convert transparent color RBG to average value
			var transparentColor = this['transparent'];
			var transparencyLevel = (this.transparent.color.r + this.transparent.color.g + this.transparent.color.b) / 3 * this.transparency;

			if (transparencyLevel > 0) {
				transparent = true;
				props[ 'transparent' ] = true;
				props[ 'opacity' ] = 1 - transparencyLevel;

			}

		}

		var keys = {
			'diffuse':'map',
			'ambient':'lightMap',
			'specular':'specularMap',
			'emission':'emissionMap',
			'bump':'bumpMap',
			'normal':'normalMap'
			};

		for ( var prop in this ) {

			switch ( prop ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'bump':
				case 'normal':

					var cot = this[ prop ];

					if ( cot instanceof ColorOrTexture ) {

						if ( cot.isTexture() ) {

							var samplerId = cot.texture;
							var surfaceId = this.effect.sampler[samplerId];

							if ( surfaceId !== undefined && surfaceId.source !== undefined ) {

								var surface = this.effect.surface[surfaceId.source];

								if ( surface !== undefined ) {

									var image = images[ surface.init_from ];

									if ( image ) {

										var url = baseUrl + image.init_from;

										var texture;
										var loader = THREE.Loader.Handlers.get( url );

										if ( loader !== null ) {

											texture = loader.load( url );

										} else {

											texture = new THREE.Texture();

											loadTextureImage( texture, url );

										}

										texture.wrapS = cot.texOpts.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
										texture.wrapT = cot.texOpts.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
										texture.offset.x = cot.texOpts.offsetU;
										texture.offset.y = cot.texOpts.offsetV;
										texture.repeat.x = cot.texOpts.repeatU;
										texture.repeat.y = cot.texOpts.repeatV;
										props[keys[prop]] = texture;

										// Texture with baked lighting?
										if (prop === 'emission') props['emissive'] = 0xffffff;

									}

								}

							}

						} else if ( prop === 'diffuse' || !transparent ) {

							if ( prop === 'emission' ) {

								props[ 'emissive' ] = cot.color.getHex();

							} else {

								props[ prop ] = cot.color.getHex();

							}

						}

					}

					break;

				case 'shininess':

					props[ prop ] = this[ prop ];
					break;

				case 'reflectivity':

					props[ prop ] = this[ prop ];
					if ( props[ prop ] > 0.0 ) props['envMap'] = options.defaultEnvMap;
					props['combine'] = THREE.MixOperation;	//mix regular shading with reflective component
					break;

				case 'index_of_refraction':

					props[ 'refractionRatio' ] = this[ prop ]; //TODO: "index_of_refraction" becomes "refractionRatio" in shader, but I'm not sure if the two are actually comparable
					if ( this[ prop ] !== 1.0 ) props['envMap'] = options.defaultEnvMap;
					break;

				case 'transparency':
					// gets figured out up top
					break;

				default:
					break;

			}

		}

		props[ 'shading' ] = preferredShading;
		props[ 'side' ] = this.effect.doubleSided ? THREE.DoubleSide : THREE.FrontSide;

		switch ( this.type ) {

			case 'constant':

				if (props.emissive !== undefined) props.color = props.emissive;
				this.material = new THREE.MeshBasicMaterial( props );
				break;

			case 'phong':
			case 'blinn':

				if (props.diffuse !== undefined) props.color = props.diffuse;
				this.material = new THREE.MeshPhongMaterial( props );
				break;

			case 'lambert':
			default:

				if (props.diffuse !== undefined) props.color = props.diffuse;
				this.material = new THREE.MeshLambertMaterial( props );
				break;

		}

		return this.material;

	};

	function Surface ( effect ) {

		this.effect = effect;
		this.init_from = null;
		this.format = null;

	}

	Surface.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'init_from':

					this.init_from = child.textContent;
					break;

				case 'format':

					this.format = child.textContent;
					break;

				default:

					console.log( "unhandled Surface prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Sampler2D ( effect ) {

		this.effect = effect;
		this.source = null;
		this.wrap_s = null;
		this.wrap_t = null;
		this.minfilter = null;
		this.magfilter = null;
		this.mipfilter = null;

	}

	Sampler2D.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					this.source = child.textContent;
					break;

				case 'minfilter':

					this.minfilter = child.textContent;
					break;

				case 'magfilter':

					this.magfilter = child.textContent;
					break;

				case 'mipfilter':

					this.mipfilter = child.textContent;
					break;

				case 'wrap_s':

					this.wrap_s = child.textContent;
					break;

				case 'wrap_t':

					this.wrap_t = child.textContent;
					break;

				default:

					console.log( "unhandled Sampler2D prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Effect () {

		this.id = "";
		this.name = "";
		this.shader = null;
		this.surface = {};
		this.sampler = {};

	}

	Effect.prototype.create = function () {

		if ( this.shader === null ) {

			return null;

		}

	};

	Effect.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		extractDoubleSided( this, element );

		this.shader = null;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseTechnique( this.parseProfileCOMMON( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Effect.prototype.parseNewparam = function ( element ) {

		var sid = element.getAttribute( 'sid' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'surface':

					this.surface[sid] = ( new Surface( this ) ).parse( child );
					break;

				case 'sampler2D':

					this.sampler[sid] = ( new Sampler2D( this ) ).parse( child );
					break;

				case 'extra':

					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

	};

	Effect.prototype.parseProfileCOMMON = function ( element ) {

		var technique;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseProfileCOMMON( child );
					break;

				case 'technique':

					technique = child;
					break;

				case 'newparam':

					this.parseNewparam( child );
					break;

				case 'image':

					var _image = ( new _Image() ).parse( child );
					images[ _image.id ] = _image;
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		return technique;

	};

	Effect.prototype.parseTechnique = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'constant':
				case 'lambert':
				case 'blinn':
				case 'phong':

					this.shader = ( new Shader( child.nodeName, this ) ).parse( child );
					break;
				case 'extra':
					this.parseExtra(child);
					break;
				default:
					break;

			}

		}

	};

	Effect.prototype.parseExtra = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique':
					this.parseExtraTechnique( child );
					break;
				default:
					break;

			}

		}

	};

	Effect.prototype.parseExtraTechnique = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'bump':
					this.shader.parse( element );
					break;
				default:
					break;

			}

		}

	};

	function InstanceEffect () {

		this.url = "";

	}

	InstanceEffect.prototype.parse = function ( element ) {

		this.url = element.getAttribute( 'url' ).replace( /^#/, '' );
		return this;

	};

	function Animation() {

		this.id = "";
		this.name = "";
		this.source = {};
		this.sampler = [];
		this.channel = [];

	}

	Animation.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.source = {};

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'animation':

					var anim = ( new Animation() ).parse( child );

					for ( var src in anim.source ) {

						this.source[ src ] = anim.source[ src ];

					}

					for ( var j = 0; j < anim.channel.length; j ++ ) {

						this.channel.push( anim.channel[ j ] );
						this.sampler.push( anim.sampler[ j ] );

					}

					break;

				case 'source':

					var src = ( new Source() ).parse( child );
					this.source[ src.id ] = src;
					break;

				case 'sampler':

					this.sampler.push( ( new Sampler( this ) ).parse( child ) );
					break;

				case 'channel':

					this.channel.push( ( new Channel( this ) ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Channel( animation ) {

		this.animation = animation;
		this.source = "";
		this.target = "";
		this.fullSid = null;
		this.sid = null;
		this.dotSyntax = null;
		this.arrSyntax = null;
		this.arrIndices = null;
		this.member = null;

	}

	Channel.prototype.parse = function ( element ) {
		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.target = element.getAttribute( 'target' );

		var parts = this.target.split( '/' );

		var id = parts.shift();
		var sid_ = parts.shift();

		var dotSyntax_ = ( sid_.indexOf(".") >= 0 );
		var arrSyntax_ = ( sid_.indexOf("(") >= 0 );

		if ( dotSyntax_ ) {

			parts = sid_.split(".");
			this.sid = parts.shift();
			this.member = parts.shift();

		} else if ( arrSyntax_ ) {

			var arrIndexes = sid_.split("(");
			this.sid = arrIndexes.shift();

			for (var j = 0; j < arrIndexes.length; j ++ ) {

				arrIndexes[j] = parseInt( arrIndexes[j].replace(/\)/, '') );

			}

			this.arrIndices = arrIndexes;

		} else {

			this.sid = sid_;

		}

		this.fullSid = sid_;
		this.dotSyntax = dotSyntax_;
		this.arrSyntax = arrSyntax_;

		return this;

	};

	function Sampler ( animation ) {

		this.id = "";
		this.animation = animation;
		this.inputs = [];
		this.input = null;
		this.output = null;
		this.strideOut = null;
		this.interpolation = null;
		this.startTime = null;
		this.endTime = null;
		this.duration = 0;

	}

	Sampler.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( (new Input()).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Sampler.prototype.create = function () {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			var input = this.inputs[ i ];
			var source = this.animation.source[ input.source ];

			switch ( input.semantic ) {

				case 'INPUT':

					this.input = source.read();
					break;

				case 'OUTPUT':

					this.output = source.read();
					this.strideOut = source.accessor.stride;
					break;

				case 'INTERPOLATION':

					this.interpolation = source.read();
					break;

				case 'IN_TANGENT':

					break;

				case 'OUT_TANGENT':

					break;

				default:

					console.log(input.semantic);
					break;

			}

		}

		this.startTime = 0;
		this.endTime = 0;
		this.duration = 0;

		if ( this.input.length ) {

			this.startTime = 100000000;
			this.endTime = -100000000;

			for ( var i = 0; i < this.input.length; i ++ ) {

				this.startTime = Math.min( this.startTime, this.input[ i ] );
				this.endTime = Math.max( this.endTime, this.input[ i ] );

			}

			this.duration = this.endTime - this.startTime;

		}

	};

	Sampler.prototype.getData = function ( type, ndx, member ) {

		var data;

		if ( type === 'matrix' && this.strideOut === 16 ) {

			data = this.output[ ndx ];

		} else if ( this.strideOut > 1 ) {

			data = [];
			ndx *= this.strideOut;

			for ( var i = 0; i < this.strideOut; ++ i ) {

				data[ i ] = this.output[ ndx + i ];

			}

			if ( this.strideOut === 3 ) {

				switch ( type ) {

					case 'rotate':
					case 'translate':

						fixCoords( data, -1 );
						break;

					case 'scale':

						fixCoords( data, 1 );
						break;

				}

			} else if ( this.strideOut === 4 && type === 'matrix' ) {

				fixCoords( data, -1 );

			}

		} else {

			data = this.output[ ndx ];

			if ( member && type === 'translate' ) {
				data = getConvertedTranslation( member, data );
			}

		}

		return data;

	};

	function Key ( time ) {

		this.targets = [];
		this.time = time;

	}

	Key.prototype.addTarget = function ( fullSid, transform, member, data ) {

		this.targets.push( {
			sid: fullSid,
			member: member,
			transform: transform,
			data: data
		} );

	};

	Key.prototype.apply = function ( opt_sid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			var target = this.targets[ i ];

			if ( !opt_sid || target.sid === opt_sid ) {

				target.transform.update( target.data, target.member );

			}

		}

	};

	Key.prototype.getTarget = function ( fullSid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			if ( this.targets[ i ].sid === fullSid ) {

				return this.targets[ i ];

			}

		}

		return null;

	};

	Key.prototype.hasTarget = function ( fullSid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			if ( this.targets[ i ].sid === fullSid ) {

				return true;

			}

		}

		return false;

	};

	// TODO: Currently only doing linear interpolation. Should support full COLLADA spec.
	Key.prototype.interpolate = function ( nextKey, time ) {

		for ( var i = 0, l = this.targets.length; i < l; i ++ ) {

			var target = this.targets[ i ],
				nextTarget = nextKey.getTarget( target.sid ),
				data;

			if ( target.transform.type !== 'matrix' && nextTarget ) {

				var scale = ( time - this.time ) / ( nextKey.time - this.time ),
					nextData = nextTarget.data,
					prevData = target.data;

				if ( scale < 0 ) scale = 0;
				if ( scale > 1 ) scale = 1;

				if ( prevData.length ) {

					data = [];

					for ( var j = 0; j < prevData.length; ++ j ) {

						data[ j ] = prevData[ j ] + ( nextData[ j ] - prevData[ j ] ) * scale;

					}

				} else {

					data = prevData + ( nextData - prevData ) * scale;

				}

			} else {

				data = target.data;

			}

			target.transform.update( data, target.member );

		}

	};

	// Camera
	function Camera() {

		this.id = "";
		this.name = "";
		this.technique = "";

	}

	Camera.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'optics':

					this.parseOptics( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Camera.prototype.parseOptics = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName === 'technique_common' ) {

				var technique = element.childNodes[ i ];

				for ( var j = 0; j < technique.childNodes.length; j ++ ) {

					this.technique = technique.childNodes[ j ].nodeName;

					if ( this.technique === 'perspective' ) {

						var perspective = technique.childNodes[ j ];

						for ( var k = 0; k < perspective.childNodes.length; k ++ ) {

							var param = perspective.childNodes[ k ];

							switch ( param.nodeName ) {

								case 'yfov':
									this.yfov = param.textContent;
									break;
								case 'xfov':
									this.xfov = param.textContent;
									break;
								case 'znear':
									this.znear = param.textContent;
									break;
								case 'zfar':
									this.zfar = param.textContent;
									break;
								case 'aspect_ratio':
									this.aspect_ratio = param.textContent;
									break;

							}

						}

					} else if ( this.technique === 'orthographic' ) {

						var orthographic = technique.childNodes[ j ];

						for ( var k = 0; k < orthographic.childNodes.length; k ++ ) {

							var param = orthographic.childNodes[ k ];

							switch ( param.nodeName ) {

								case 'xmag':
									this.xmag = param.textContent;
									break;
								case 'ymag':
									this.ymag = param.textContent;
									break;
								case 'znear':
									this.znear = param.textContent;
									break;
								case 'zfar':
									this.zfar = param.textContent;
									break;
								case 'aspect_ratio':
									this.aspect_ratio = param.textContent;
									break;

							}

						}

					}

				}

			}

		}

		return this;

	};

	function InstanceCamera() {

		this.url = "";

	}

	InstanceCamera.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');

		return this;

	};

	// Light

	function Light() {

		this.id = "";
		this.name = "";
		this.technique = "";

	}

	Light.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique_common':

					this.parseCommon( child );
					break;

				case 'technique':

					this.parseTechnique( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Light.prototype.parseCommon = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			switch ( element.childNodes[ i ].nodeName ) {

				case 'directional':
				case 'point':
				case 'spot':
				case 'ambient':

					this.technique = element.childNodes[ i ].nodeName;

					var light = element.childNodes[ i ];

					for ( var j = 0; j < light.childNodes.length; j ++ ) {

						var child = light.childNodes[j];

						switch ( child.nodeName ) {

							case 'color':

								var rgba = _floats( child.textContent );
								this.color = new THREE.Color(0);
								this.color.setRGB( rgba[0], rgba[1], rgba[2] );
								this.color.a = rgba[3];
								break;

							case 'falloff_angle':

								this.falloff_angle = parseFloat( child.textContent );
								break;

							case 'quadratic_attenuation':
								var f = parseFloat( child.textContent );
								this.distance = f ? Math.sqrt( 1 / f ) : 0;
						}

					}

			}

		}

		return this;

	};

	Light.prototype.parseTechnique = function ( element ) {

		this.profile = element.getAttribute( 'profile' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'intensity':

					this.intensity = parseFloat(child.textContent);
					break;

			}

		}

		return this;

	};

	function InstanceLight() {

		this.url = "";

	}

	InstanceLight.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');

		return this;

	};

	function KinematicsModel( ) {

		this.id = '';
		this.name = '';
		this.joints = [];
		this.links = [];

	}

	KinematicsModel.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.joints = [];
		this.links = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique_common':

					this.parseCommon(child);
					break;

				default:
					break;

			}

		}

		return this;

	};

	KinematicsModel.prototype.parseCommon = function( element ) {

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( element.childNodes[ i ].nodeName ) {

				case 'joint':
					this.joints.push( (new Joint()).parse(child) );
					break;

				case 'link':
					this.links.push( (new Link()).parse(child) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Joint( ) {

		this.sid = '';
		this.name = '';
		this.axis = new THREE.Vector3();
		this.limits = {
			min: 0,
			max: 0
		};
		this.type = '';
		this.static = false;
		this.zeroPosition = 0.0;
		this.middlePosition = 0.0;

	}

	Joint.prototype.parse = function( element ) {

		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.axis = new THREE.Vector3();
		this.limits = {
			min: 0,
			max: 0
		};
		this.type = '';
		this.static = false;
		this.zeroPosition = 0.0;
		this.middlePosition = 0.0;

		var axisElement = element.querySelector('axis');
		var _axis = _floats(axisElement.textContent);
		this.axis = getConvertedVec3(_axis, 0);

		var min = element.querySelector('limits min') ? parseFloat(element.querySelector('limits min').textContent) : -360;
		var max = element.querySelector('limits max') ? parseFloat(element.querySelector('limits max').textContent) : 360;

		this.limits = {
			min: min,
			max: max
		};

		var jointTypes = [ 'prismatic', 'revolute' ];
		for (var i = 0; i < jointTypes.length; i ++ ) {

			var type_ = jointTypes[ i ];

			var jointElement = element.querySelector(type_);

			if ( jointElement ) {

				this.type = type_;

			}

		}

		// if the min is equal to or somehow greater than the max, consider the joint static
		if ( this.limits.min >= this.limits.max ) {

			this.static = true;

		}

		this.middlePosition = (this.limits.min + this.limits.max) / 2.0;
		return this;

	};

	function Link( ) {

		this.sid = '';
		this.name = '';
		this.transforms = [];
		this.attachments = [];

	}

	Link.prototype.parse = function( element ) {

		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.transforms = [];
		this.attachments = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'attachment_full':
					this.attachments.push( (new Attachment()).parse(child) );
					break;

				case 'rotate':
				case 'translate':
				case 'matrix':

					this.transforms.push( (new Transform()).parse(child) );
					break;

				default:

					break;

			}

		}

		return this;

	};

	function Attachment( ) {

		this.joint = '';
		this.transforms = [];
		this.links = [];

	}

	Attachment.prototype.parse = function( element ) {

		this.joint = element.getAttribute('joint').split('/').pop();
		this.links = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'link':
					this.links.push( (new Link()).parse(child) );
					break;

				case 'rotate':
				case 'translate':
				case 'matrix':

					this.transforms.push( (new Transform()).parse(child) );
					break;

				default:

					break;

			}

		}

		return this;

	};

	function _source( element ) {

		var id = element.getAttribute( 'id' );

		if ( sources[ id ] !== undefined ) {

			return sources[ id ];

		}

		sources[ id ] = ( new Source(id )).parse( element );
		return sources[ id ];

	}

	function _nsResolver( nsPrefix ) {

		if ( nsPrefix === "dae" ) {

			return "http://www.collada.org/2005/11/COLLADASchema";

		}

		return null;

	}

	function _bools( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( (raw[i] === 'true' || raw[i] === '1') ? true : false );

		}

		return data;

	}

	function _floats( str ) {

		var raw = _strings(str);
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseFloat( raw[ i ] ) );

		}

		return data;

	}

	function _ints( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseInt( raw[ i ], 10 ) );

		}

		return data;

	}

	function _strings( str ) {

		return ( str.length > 0 ) ? _trimString( str ).split( /\s+/ ) : [];

	}

	function _trimString( str ) {

		return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );

	}

	function _attr_as_float( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseFloat( element.getAttribute( name ) );

		} else {

			return defaultValue;

		}

	}

	function _attr_as_int( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseInt( element.getAttribute( name ), 10) ;

		} else {

			return defaultValue;

		}

	}

	function _attr_as_string( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return element.getAttribute( name );

		} else {

			return defaultValue;

		}

	}

	function _format_float( f, num ) {

		if ( f === undefined ) {

			var s = '0.';

			while ( s.length < num + 2 ) {

				s += '0';

			}

			return s;

		}

		num = num || 2;

		var parts = f.toString().split( '.' );
		parts[ 1 ] = parts.length > 1 ? parts[ 1 ].substr( 0, num ) : "0";

		while ( parts[ 1 ].length < num ) {

			parts[ 1 ] += '0';

		}

		return parts.join( '.' );

	}

	function loadTextureImage ( texture, url ) {

		var loader = new THREE.ImageLoader();

		loader.load( url, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );

	}

	function extractDoubleSided( obj, element ) {

		obj.doubleSided = false;

		var node = element.querySelectorAll('extra double_sided')[0];

		if ( node ) {

			if ( node && parseInt( node.textContent, 10 ) === 1 ) {

				obj.doubleSided = true;

			}

		}

	}

	// Up axis conversion

	function setUpConversion() {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			upConversion = null;

		} else {

			switch ( colladaUp ) {

				case 'X':

					upConversion = options.upAxis === 'Y' ? 'XtoY' : 'XtoZ';
					break;

				case 'Y':

					upConversion = options.upAxis === 'X' ? 'YtoX' : 'YtoZ';
					break;

				case 'Z':

					upConversion = options.upAxis === 'X' ? 'ZtoX' : 'ZtoY';
					break;

			}

		}

	}

	function fixCoords( data, sign ) {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			return;

		}

		switch ( upConversion ) {

			case 'XtoY':

				var tmp = data[ 0 ];
				data[ 0 ] = sign * data[ 1 ];
				data[ 1 ] = tmp;
				break;

			case 'XtoZ':

				var tmp = data[ 2 ];
				data[ 2 ] = data[ 1 ];
				data[ 1 ] = data[ 0 ];
				data[ 0 ] = tmp;
				break;

			case 'YtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = sign * tmp;
				break;

			case 'YtoZ':

				var tmp = data[ 1 ];
				data[ 1 ] = sign * data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoY':

				var tmp = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = sign * tmp;
				break;

		}

	}

	function getConvertedTranslation( axis, data ) {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			return data;

		}

		switch ( axis ) {
			case 'X':
				data = upConversion === 'XtoY' ? data * -1 : data;
				break;
			case 'Y':
				data = upConversion === 'YtoZ' || upConversion === 'YtoX' ? data * -1 : data;
				break;
			case 'Z':
				data = upConversion === 'ZtoY' ? data * -1 : data ;
				break;
			default:
				break;
		}

		return data;
	}

	function getConvertedVec3( data, offset ) {

		var arr = [ data[ offset ], data[ offset + 1 ], data[ offset + 2 ] ];
		fixCoords( arr, -1 );
		return new THREE.Vector3( arr[ 0 ], arr[ 1 ], arr[ 2 ] );

	}

	function getConvertedMat4( data ) {

		if ( options.convertUpAxis ) {

			// First fix rotation and scale

			// Columns first
			var arr = [ data[ 0 ], data[ 4 ], data[ 8 ] ];
			fixCoords( arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 4 ] = arr[ 1 ];
			data[ 8 ] = arr[ 2 ];
			arr = [ data[ 1 ], data[ 5 ], data[ 9 ] ];
			fixCoords( arr, -1 );
			data[ 1 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 9 ] = arr[ 2 ];
			arr = [ data[ 2 ], data[ 6 ], data[ 10 ] ];
			fixCoords( arr, -1 );
			data[ 2 ] = arr[ 0 ];
			data[ 6 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];
			// Rows second
			arr = [ data[ 0 ], data[ 1 ], data[ 2 ] ];
			fixCoords( arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 1 ] = arr[ 1 ];
			data[ 2 ] = arr[ 2 ];
			arr = [ data[ 4 ], data[ 5 ], data[ 6 ] ];
			fixCoords( arr, -1 );
			data[ 4 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 6 ] = arr[ 2 ];
			arr = [ data[ 8 ], data[ 9 ], data[ 10 ] ];
			fixCoords( arr, -1 );
			data[ 8 ] = arr[ 0 ];
			data[ 9 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];

			// Now fix translation
			arr = [ data[ 3 ], data[ 7 ], data[ 11 ] ];
			fixCoords( arr, -1 );
			data[ 3 ] = arr[ 0 ];
			data[ 7 ] = arr[ 1 ];
			data[ 11 ] = arr[ 2 ];

		}

		return new THREE.Matrix4().set(
			data[0], data[1], data[2], data[3],
			data[4], data[5], data[6], data[7],
			data[8], data[9], data[10], data[11],
			data[12], data[13], data[14], data[15]
			);

	}

	function getConvertedIndex( index ) {

		if ( index > -1 && index < 3 ) {

			var members = [ 'X', 'Y', 'Z' ],
				indices = { X: 0, Y: 1, Z: 2 };

			index = getConvertedMember( members[ index ] );
			index = indices[ index ];

		}

		return index;

	}

	function getConvertedMember( member ) {

		if ( options.convertUpAxis ) {

			switch ( member ) {

				case 'X':

					switch ( upConversion ) {

						case 'XtoY':
						case 'XtoZ':
						case 'YtoX':

							member = 'Y';
							break;

						case 'ZtoX':

							member = 'Z';
							break;

					}

					break;

				case 'Y':

					switch ( upConversion ) {

						case 'XtoY':
						case 'YtoX':
						case 'ZtoX':

							member = 'X';
							break;

						case 'XtoZ':
						case 'YtoZ':
						case 'ZtoY':

							member = 'Z';
							break;

					}

					break;

				case 'Z':

					switch ( upConversion ) {

						case 'XtoZ':

							member = 'X';
							break;

						case 'YtoZ':
						case 'ZtoX':
						case 'ZtoY':

							member = 'Y';
							break;

					}

					break;

			}

		}

		return member;

	}

	return {

		load: load,
		parse: parse,
		setPreferredShading: setPreferredShading,
		applySkin: applySkin,
		geometries : geometries,
		options: options

	};

};

// File:examples/js/loaders/OBJLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( text ) {

		console.time( 'OBJLoader' );

		var object, objects = [];
		var geometry, material;

		function parseVertexIndex( value ) {

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;

		}

		function parseNormalIndex( value ) {

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;

		}

		function parseUVIndex( value ) {

			var index = parseInt( value );

			return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;

		}

		function addVertex( a, b, c ) {

			geometry.vertices.push(
				vertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],
				vertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],
				vertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]
			);

		}

		function addNormal( a, b, c ) {

			geometry.normals.push(
				normals[ a ], normals[ a + 1 ], normals[ a + 2 ],
				normals[ b ], normals[ b + 1 ], normals[ b + 2 ],
				normals[ c ], normals[ c + 1 ], normals[ c + 2 ]
			);

		}

		function addUV( a, b, c ) {

			geometry.uvs.push(
				uvs[ a ], uvs[ a + 1 ],
				uvs[ b ], uvs[ b + 1 ],
				uvs[ c ], uvs[ c + 1 ]
			);

		}

		function addFace( a, b, c, d,  ua, ub, uc, ud, na, nb, nc, nd ) {

			var ia = parseVertexIndex( a );
			var ib = parseVertexIndex( b );
			var ic = parseVertexIndex( c );
			var id;

			if ( d === undefined ) {

				addVertex( ia, ib, ic );

			} else {

				id = parseVertexIndex( d );

				addVertex( ia, ib, id );
				addVertex( ib, ic, id );

			}

			if ( ua !== undefined ) {

				ia = parseUVIndex( ua );
				ib = parseUVIndex( ub );
				ic = parseUVIndex( uc );

				if ( d === undefined ) {

					addUV( ia, ib, ic );

				} else {

					id = parseUVIndex( ud );

					addUV( ia, ib, id );
					addUV( ib, ic, id );

				}

			}

			if ( na !== undefined ) {

				ia = parseNormalIndex( na );
				ib = parseNormalIndex( nb );
				ic = parseNormalIndex( nc );

				if ( d === undefined ) {

					addNormal( ia, ib, ic );

				} else {

					id = parseNormalIndex( nd );

					addNormal( ia, ib, id );
					addNormal( ib, ic, id );

				}

			}

		}

		// create mesh if no objects in text

		if ( /^o /gm.test( text ) === false ) {

			geometry = {
				vertices: [],
				normals: [],
				uvs: []
			};

			material = {
				name: ''
			};

			object = {
				name: '',
				geometry: geometry,
				material: material
			};

			objects.push( object );

		}

		var vertices = [];
		var normals = [];
		var uvs = [];

		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/;

		// f vertex vertex vertex ...

		var face_pattern1 = /f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/;

		// f vertex/uv vertex/uv vertex/uv ...

		var face_pattern2 = /f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

		var face_pattern3 = /f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/;

		// f vertex//normal vertex//normal vertex//normal ...

		var face_pattern4 = /f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/;

		//

		var lines = text.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				vertices.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				);

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				);

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				uvs.push(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				);

			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

				// ["f 1 2 3", "1", "2", "3", undefined]

				addFace(
					result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
				);

			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

				addFace(
					result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
					result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
				);

			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

				addFace(
					result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
					result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
					result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
				);

			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

				addFace(
					result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
					undefined, undefined, undefined, undefined,
					result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
				);

			} else if ( /^o /.test( line ) ) {

				geometry = {
					vertices: [],
					normals: [],
					uvs: []
				};

				material = {
					name: ''
				};

				object = {
					name: line.substring( 2 ).trim(),
					geometry: geometry,
					material: material
				};

				objects.push( object )

			} else if ( /^g /.test( line ) ) {

				// group

			} else if ( /^usemtl /.test( line ) ) {

				// material

				material.name = line.substring( 7 ).trim();

			} else if ( /^mtllib /.test( line ) ) {

				// mtl file

			} else if ( /^s /.test( line ) ) {

				// smooth shading

			} else {

				// console.log( "THREE.OBJLoader: Unhandled line " + line );

			}

		}

		var container = new THREE.Object3D();

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			object = objects[ i ];
			geometry = object.geometry;

			var buffergeometry = new THREE.BufferGeometry();

			buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

			if ( geometry.normals.length > 0 ) {
				buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );
			}

			if ( geometry.uvs.length > 0 ) {
				buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );
			}

			material = new THREE.MeshLambertMaterial();
			material.name = object.material.name;

			var mesh = new THREE.Mesh( buffergeometry, material );
			mesh.name = object.name;

			container.add( mesh );

		}

		console.timeEnd( 'OBJLoader' );

		return container;

	}

};

// File:examples/js/loaders/STLLoader.js

/**
 * @author aleeper / http://adamleeper.com/
 * @author mrdoob / http://mrdoob.com/
 * @author gero3 / https://github.com/gero3
 *
 * Description: A THREE loader for STL ASCII files, as created by Solidworks and other CAD programs.
 *
 * Supports both binary and ASCII encoded files, with automatic detection of type.
 *
 * Limitations:
 *  Binary decoding supports "Magics" color format (http://en.wikipedia.org/wiki/STL_(file_format)#Color_in_binary_STL).
 *  There is perhaps some question as to how valid it is to always assume little-endian-ness.
 *  ASCII decoding assumes file is UTF-8. Seems to work for the examples...
 *
 * Usage:
 *  var loader = new THREE.STLLoader();
 *  loader.load( './models/stl/slotted_disk.stl', function ( geometry ) {
 *    scene.add( new THREE.Mesh( geometry ) );
 *  });
 *
 * For binary STLs geometry might contain colors for vertices. To use it:
 *  // use the same code to load STL as above
 *  if (geometry.hasColors) {
 *    material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
 *  } else { .... }
 *  var mesh = new THREE.Mesh( geometry, material );
 */


THREE.STLLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.STLLoader.prototype = {

	constructor: THREE.STLLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.setResponseType('arraybuffer');
		var request = loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

		return request;
	},

	parse: function ( data ) {

		var isBinary = function () {

			var expect, face_size, n_faces, reader;
			reader = new DataView( binData );
			face_size = (32 / 8 * 3) + ((32 / 8 * 3) * 3) + (16 / 8);
			n_faces = reader.getUint32(80, true);
			expect = 80 + (32 / 8) + (n_faces * face_size);

			if ( expect === reader.byteLength ) {

				return true;

			}

			// some binary files will have different size from expected,
			// checking characters higher than ASCII to confirm is binary
			var fileLength = reader.byteLength;
			for ( var index = 0; index < fileLength; index ++ ) {

				if ( reader.getUint8(index, false) > 127 ) {

					return true;

				}

			}

			return false;

		};

		var binData = this.ensureBinary( data );

		return isBinary()
			? this.parseBinary( binData )
			: this.parseASCII( this.ensureString( data ) );

	},

	parseBinary: function ( data ) {

		var reader = new DataView( data );
		var faces = reader.getUint32( 80, true );

		var r, g, b, hasColors = false, colors;
		var defaultR, defaultG, defaultB, alpha;

		// process STL header
		// check for default color in header ("COLOR=rgba" sequence).

		for ( var index = 0; index < 80 - 10; index ++ ) {

			if ((reader.getUint32(index, false) == 0x434F4C4F /*COLO*/) &&
				(reader.getUint8(index + 4) == 0x52 /*'R'*/) &&
				(reader.getUint8(index + 5) == 0x3D /*'='*/)) {

				hasColors = true;
				colors = new Float32Array( faces * 3 * 3);

				defaultR = reader.getUint8(index + 6) / 255;
				defaultG = reader.getUint8(index + 7) / 255;
				defaultB = reader.getUint8(index + 8) / 255;
				alpha = reader.getUint8(index + 9) / 255;
			}
		}

		var dataOffset = 84;
		var faceLength = 12 * 4 + 2;

		var offset = 0;

		var geometry = new THREE.BufferGeometry();

		var vertices = new Float32Array( faces * 3 * 3 );
		var normals = new Float32Array( faces * 3 * 3 );

		for ( var face = 0; face < faces; face ++ ) {

			var start = dataOffset + face * faceLength;
			var normalX = reader.getFloat32(start, true);
			var normalY = reader.getFloat32(start + 4, true);
			var normalZ = reader.getFloat32(start + 8, true);

			if (hasColors) {

				var packedColor = reader.getUint16(start + 48, true);

				if ((packedColor & 0x8000) === 0) { // facet has its own unique color

					r = (packedColor & 0x1F) / 31;
					g = ((packedColor >> 5) & 0x1F) / 31;
					b = ((packedColor >> 10) & 0x1F) / 31;
				} else {

					r = defaultR;
					g = defaultG;
					b = defaultB;
				}
			}

			for ( var i = 1; i <= 3; i ++ ) {

				var vertexstart = start + i * 12;

				vertices[ offset     ] = reader.getFloat32( vertexstart, true );
				vertices[ offset + 1 ] = reader.getFloat32( vertexstart + 4, true );
				vertices[ offset + 2 ] = reader.getFloat32( vertexstart + 8, true );

				normals[ offset     ] = normalX;
				normals[ offset + 1 ] = normalY;
				normals[ offset + 2 ] = normalZ;

				if (hasColors) {
					colors[ offset     ] = r;
					colors[ offset + 1 ] = g;
					colors[ offset + 2 ] = b;
				}

				offset += 3;

			}

		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		if (hasColors) {
			geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			geometry.hasColors = true;
			geometry.alpha = alpha;
		}

		return geometry;

	},

	parseASCII: function ( data ) {

		var geometry, length, normal, patternFace, patternNormal, patternVertex, result, text;
		geometry = new THREE.Geometry();
		patternFace = /facet([\s\S]*?)endfacet/g;

		while ( ( result = patternFace.exec( data ) ) !== null ) {

			text = result[0];
			patternNormal = /normal[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

			while ( ( result = patternNormal.exec( text ) ) !== null ) {

				normal = new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) );

			}

			patternVertex = /vertex[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

			while ( ( result = patternVertex.exec( text ) ) !== null ) {

				geometry.vertices.push( new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) ) );

			}

			length = geometry.vertices.length;

			geometry.faces.push( new THREE.Face3( length - 3, length - 2, length - 1, normal ) );

		}

		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		return geometry;

	},

	ensureString: function ( buf ) {

		if (typeof buf !== "string") {
			var array_buffer = new Uint8Array(buf);
			var str = '';
			for (var i = 0; i < buf.byteLength; i ++) {
				str += String.fromCharCode(array_buffer[i]); // implicitly assumes little-endian
			}
			return str;
		} else {
			return buf;
		}

	},

	ensureBinary: function ( buf ) {

		if (typeof buf === "string") {
			var array_buffer = new Uint8Array(buf.length);
			for (var i = 0; i < buf.length; i ++) {
				array_buffer[i] = buf.charCodeAt(i) & 0xff; // implicitly assumes little-endian
			}
			return array_buffer.buffer || array_buffer;
		} else {
			return buf;
		}

	}

};

if ( typeof DataView === 'undefined') {

	DataView = function(buffer, byteOffset, byteLength) {

		this.buffer = buffer;
		this.byteOffset = byteOffset || 0;
		this.byteLength = byteLength || buffer.byteLength || buffer.length;
		this._isString = typeof buffer === "string";

	};

	DataView.prototype = {

		_getCharCodes:function(buffer,start,length) {
			start = start || 0;
			length = length || buffer.length;
			var end = start + length;
			var codes = [];
			for (var i = start; i < end; i ++) {
				codes.push(buffer.charCodeAt(i) & 0xff);
			}
			return codes;
		},

		_getBytes: function (length, byteOffset, littleEndian) {

			var result;

			// Handle the lack of endianness
			if (littleEndian === undefined) {

				littleEndian = this._littleEndian;

			}

			// Handle the lack of byteOffset
			if (byteOffset === undefined) {

				byteOffset = this.byteOffset;

			} else {

				byteOffset = this.byteOffset + byteOffset;

			}

			if (length === undefined) {

				length = this.byteLength - byteOffset;

			}

			// Error Checking
			if (typeof byteOffset !== 'number') {

				throw new TypeError('DataView byteOffset is not a number');

			}

			if (length < 0 || byteOffset + length > this.byteLength) {

				throw new Error('DataView length or (byteOffset+length) value is out of bounds');

			}

			if (this.isString) {

				result = this._getCharCodes(this.buffer, byteOffset, byteOffset + length);

			} else {

				result = this.buffer.slice(byteOffset, byteOffset + length);

			}

			if (!littleEndian && length > 1) {

				if ( Array.isArray( result ) === false ) {

					result = Array.prototype.slice.call(result);

				}

				result.reverse();
			}

			return result;

		},

		// Compatibility functions on a String Buffer

		getFloat64: function (byteOffset, littleEndian) {

			var b = this._getBytes(8, byteOffset, littleEndian),

				sign = 1 - (2 * (b[7] >> 7)),
				exponent = ((((b[7] << 1) & 0xff) << 3) | (b[6] >> 4)) - ((1 << 10) - 1),

			// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
				mantissa = ((b[6] & 0x0f) * Math.pow(2, 48)) + (b[5] * Math.pow(2, 40)) + (b[4] * Math.pow(2, 32)) +
							(b[3] * Math.pow(2, 24)) + (b[2] * Math.pow(2, 16)) + (b[1] * Math.pow(2, 8)) + b[0];

			if (exponent === 1024) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -1023) { // Denormalized
				return sign * mantissa * Math.pow(2, -1022 - 52);
			}

			return sign * (1 + mantissa * Math.pow(2, -52)) * Math.pow(2, exponent);

		},

		getFloat32: function (byteOffset, littleEndian) {

			var b = this._getBytes(4, byteOffset, littleEndian),

				sign = 1 - (2 * (b[3] >> 7)),
				exponent = (((b[3] << 1) & 0xff) | (b[2] >> 7)) - 127,
				mantissa = ((b[2] & 0x7f) << 16) | (b[1] << 8) | b[0];

			if (exponent === 128) {
				if (mantissa !== 0) {
					return NaN;
				} else {
					return sign * Infinity;
				}
			}

			if (exponent === -127) { // Denormalized
				return sign * mantissa * Math.pow(2, -126 - 23);
			}

			return sign * (1 + mantissa * Math.pow(2, -23)) * Math.pow(2, exponent);
		},

		getInt32: function (byteOffset, littleEndian) {
			var b = this._getBytes(4, byteOffset, littleEndian);
			return (b[3] << 24) | (b[2] << 16) | (b[1] << 8) | b[0];
		},

		getUint32: function (byteOffset, littleEndian) {
			return this.getInt32(byteOffset, littleEndian) >>> 0;
		},

		getInt16: function (byteOffset, littleEndian) {
			return (this.getUint16(byteOffset, littleEndian) << 16) >> 16;
		},

		getUint16: function (byteOffset, littleEndian) {
			var b = this._getBytes(2, byteOffset, littleEndian);
			return (b[1] << 8) | b[0];
		},

		getInt8: function (byteOffset) {
			return (this.getUint8(byteOffset) << 24) >> 24;
		},

		getUint8: function (byteOffset) {
			return this._getBytes(1, byteOffset)[0];
		}

	 };

}

// File:examples/js/effects/AnaglyphEffect.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author marklundin / http://mark-lundin.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.AnaglyphEffect = function ( renderer, width, height ) {

	var eyeRight = new THREE.Matrix4();
	var eyeLeft = new THREE.Matrix4();
	var focalLength = 125;
	var _aspect, _near, _far, _fov;

	var _cameraL = new THREE.PerspectiveCamera();
	_cameraL.matrixAutoUpdate = false;

	var _cameraR = new THREE.PerspectiveCamera();
	_cameraR.matrixAutoUpdate = false;

	var _camera = new THREE.OrthographicCamera( -1, 1, 1, - 1, 0, 1 );

	var _scene = new THREE.Scene();

	var _params = { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat };

	if ( width === undefined ) width = 512;
	if ( height === undefined ) height = 512;

	var _renderTargetL = new THREE.WebGLRenderTarget( width, height, _params );
	var _renderTargetR = new THREE.WebGLRenderTarget( width, height, _params );

	var _material = new THREE.ShaderMaterial( {

		uniforms: {

			"mapLeft": { type: "t", value: _renderTargetL },
			"mapRight": { type: "t", value: _renderTargetR }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

			"	vUv = vec2( uv.x, uv.y );",
			"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform sampler2D mapLeft;",
			"uniform sampler2D mapRight;",
			"varying vec2 vUv;",

			"void main() {",

			"	vec4 colorL, colorR;",
			"	vec2 uv = vUv;",

			"	colorL = texture2D( mapLeft, uv );",
			"	colorR = texture2D( mapRight, uv );",

				// http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx

			"	gl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;",

			"}"

		].join("\n")

	} );

	var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), _material );
	_scene.add( mesh );

	this.setSize = function ( width, height ) {

		if ( _renderTargetL ) _renderTargetL.dispose();
		if ( _renderTargetR ) _renderTargetR.dispose();
		_renderTargetL = new THREE.WebGLRenderTarget( width, height, _params );
		_renderTargetR = new THREE.WebGLRenderTarget( width, height, _params );

		_material.uniforms[ "mapLeft" ].value = _renderTargetL;
		_material.uniforms[ "mapRight" ].value = _renderTargetR;

		renderer.setSize( width, height );

	};

	/*
	 * Renderer now uses an asymmetric perspective projection
	 * (http://paulbourke.net/miscellaneous/stereographics/stereorender/).
	 *
	 * Each camera is offset by the eye seperation and its projection matrix is
	 * also skewed asymetrically back to converge on the same projection plane.
	 * Added a focal length parameter to, this is where the parallax is equal to 0.
	 */

	this.render = function ( scene, camera ) {

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		var hasCameraChanged = ( _aspect !== camera.aspect ) || ( _near !== camera.near ) || ( _far !== camera.far ) || ( _fov !== camera.fov );

		if ( hasCameraChanged ) {

			_aspect = camera.aspect;
			_near = camera.near;
			_far = camera.far;
			_fov = camera.fov;

			var projectionMatrix = camera.projectionMatrix.clone();
			var eyeSep = focalLength / 30 * 0.5;
			var eyeSepOnProjection = eyeSep * _near / focalLength;
			var ymax = _near * Math.tan( THREE.Math.degToRad( _fov * 0.5 ) );
			var xmin, xmax;

			// translate xOffset

			eyeRight.elements[12] = eyeSep;
			eyeLeft.elements[12] = -eyeSep;

			// for left eye

			xmin = -ymax * _aspect + eyeSepOnProjection;
			xmax = ymax * _aspect + eyeSepOnProjection;

			projectionMatrix.elements[0] = 2 * _near / ( xmax - xmin );
			projectionMatrix.elements[8] = ( xmax + xmin ) / ( xmax - xmin );

			_cameraL.projectionMatrix.copy( projectionMatrix );

			// for right eye

			xmin = -ymax * _aspect - eyeSepOnProjection;
			xmax = ymax * _aspect - eyeSepOnProjection;

			projectionMatrix.elements[0] = 2 * _near / ( xmax - xmin );
			projectionMatrix.elements[8] = ( xmax + xmin ) / ( xmax - xmin );

			_cameraR.projectionMatrix.copy( projectionMatrix );

		}

		_cameraL.matrixWorld.copy( camera.matrixWorld ).multiply( eyeLeft );
		_cameraL.position.copy( camera.position );
		_cameraL.near = camera.near;
		_cameraL.far = camera.far;

		renderer.render( scene, _cameraL, _renderTargetL, true );

		_cameraR.matrixWorld.copy( camera.matrixWorld ).multiply( eyeRight );
		_cameraR.position.copy( camera.position );
		_cameraR.near = camera.near;
		_cameraR.far = camera.far;

		renderer.render( scene, _cameraR, _renderTargetR, true );

		renderer.render( _scene, _camera );

	};

	this.dispose = function() {
		if ( _renderTargetL ) _renderTargetL.dispose();
		if ( _renderTargetR ) _renderTargetR.dispose();
	}

};

