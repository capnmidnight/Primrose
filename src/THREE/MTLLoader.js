/**
 * Loads a Wavefront .mtl file specifying materials
 *
 * @author angelxuanchang
 *
 * Converted to ES2015 by @capnmidnight
 *
 */
import { EventDispatcher, DefaultLoadingManager, Loader, RepeatWrapping, FileLoader, TextureLoader, FrontSide, MeshPhongMaterial, MeshBasicMaterial, Color, Vector2 } from "three";

export class MTLLoader extends EventDispatcher {

  constructor ( manager ) {

    super();

    this.manager = ( manager !== undefined ) ? manager : DefaultLoadingManager;

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
  load ( url, onLoad, onProgress, onError ) {

    var scope = this;

    var loader = new FileLoader( this.manager );
    loader.setPath( this.path );
    loader.load( url, function ( text ) {

      onLoad( scope.parse( text ) );

    }, onProgress, onError );

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
  setPath ( path ) {

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
  setTexturePath ( path ) {

    this.texturePath = path;

  }

  setBaseUrl ( path ) {

    console.warn( 'MTLLoader: .setBaseUrl() is deprecated. Use .setTexturePath( path ) for texture path or .setPath( path ) for general base path instead.' );

    this.setTexturePath( path );

  }

  setCrossOrigin ( value ) {

    this.crossOrigin = value;

  }

  setMaterialOptions ( value ) {

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
  parse ( text ) {

    var lines = text.split( '\n' );
    var info = {};
    var delimiter_pattern = /\s+/;
    var materialsInfo = {};

    for ( var i = 0; i < lines.length; i ++ ) {

      var line = lines[ i ];
      line = line.trim();

      if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

        // Blank line or comment ignore
        continue;

      }

      var pos = line.indexOf( ' ' );

      var key = ( pos >= 0 ) ? line.substring( 0, pos ) : line;
      key = key.toLowerCase();

      var value = ( pos >= 0 ) ? line.substring( pos + 1 ) : '';
      value = value.trim();

      if ( key === 'newmtl' ) {

        // New material

        info = { name: value };
        materialsInfo[ value ] = info;

      } else if ( info ) {

        if ( key === 'ka' || key === 'kd' || key === 'ks' ) {

          var ss = value.split( delimiter_pattern, 3 );
          info[ key ] = [ parseFloat( ss[ 0 ] ), parseFloat( ss[ 1 ] ), parseFloat( ss[ 2 ] ) ];

        } else {

          info[ key ] = value;

        }

      }

    }

    var materialCreator = new MaterialCreator( this.texturePath || this.path, this.materialOptions );
    materialCreator.setCrossOrigin( this.crossOrigin );
    materialCreator.setManager( this.manager );
    materialCreator.setMaterials( materialsInfo );
    return materialCreator;

  }

};

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

class MaterialCreator {

  constructor ( baseUrl, options ) {

    this.baseUrl = baseUrl || '';
    this.options = options;
    this.materialsInfo = {};
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};

    this.side = ( this.options && this.options.side ) ? this.options.side : FrontSide;
    this.wrap = ( this.options && this.options.wrap ) ? this.options.wrap : RepeatWrapping;

  }

  setCrossOrigin ( value ) {

    this.crossOrigin = value;

  }

  setManager ( value ) {

    this.manager = value;

  }

  setMaterials ( materialsInfo ) {

    this.materialsInfo = this.convert( materialsInfo );
    this.materials = {};
    this.materialsArray = [];
    this.nameLookup = {};

  }

  convert ( materialsInfo ) {

    if ( ! this.options ) return materialsInfo;

    var converted = {};

    for ( var mn in materialsInfo ) {

      // Convert materials info into normalized form based on options

      var mat = materialsInfo[ mn ];

      var covmat = {};

      converted[ mn ] = covmat;

      for ( var prop in mat ) {

        var save = true;
        var value = mat[ prop ];
        var lprop = prop.toLowerCase();

        switch ( lprop ) {

          case 'kd':
          case 'ka':
          case 'ks':

            // Diffuse color (color under white light) using RGB values

            if ( this.options && this.options.normalizeRGB ) {

              value = [ value[ 0 ] / 255, value[ 1 ] / 255, value[ 2 ] / 255 ];

            }

            if ( this.options && this.options.ignoreZeroRGBs ) {

              if ( value[ 0 ] === 0 && value[ 1 ] === 0 && value[ 2 ] === 0 ) {

                // ignore

                save = false;

              }

            }

            break;

          default:

            break;
        }

        if ( save ) {

          covmat[ lprop ] = value;

        }

      }

    }

    return converted;

  }

  preload () {

    for ( var mn in this.materialsInfo ) {

      this.create( mn );

    }

  }

  getIndex ( materialName ) {

    return this.nameLookup[ materialName ];

  }

  getAsArray () {

    var index = 0;

    for ( var mn in this.materialsInfo ) {

      this.materialsArray[ index ] = this.create( mn );
      this.nameLookup[ mn ] = index;
      index ++;

    }

    return this.materialsArray;

  }

  create ( materialName ) {

    if ( this.materials[ materialName ] === undefined ) {

      this.createMaterial_( materialName );

    }

    return this.materials[ materialName ];

  }

  createMaterial_ ( materialName ) {

    // Create material

    var TMaterial = MeshPhongMaterial;
    var scope = this;
    var mat = this.materialsInfo[ materialName ];
    var params = {

      name: materialName,
      side: this.side

    };

    var resolveURL = function ( baseUrl, url ) {

      if ( typeof url !== 'string' || url === '' )
        return '';

      // Absolute URL
      if ( /^https?:\/\//i.test( url ) ) {
        return url;
      }

      return baseUrl + url;
    };

    function setMapForType ( mapType, value ) {

      if ( params[ mapType ] ) return; // Keep the first encountered texture

      var texParams = scope.getTextureParams( value, params );
      var map = scope.loadTexture( resolveURL( scope.baseUrl, texParams.url ) );

      map.repeat.copy( texParams.scale );
      map.offset.copy( texParams.offset );

      map.wrapS = scope.wrap;
      map.wrapT = scope.wrap;

      params[ mapType ] = map;
    }

    for ( var prop in mat ) {

      var value = mat[ prop ];

      if ( value === '' ) continue;

      switch ( prop.toLowerCase() ) {

        // Ns is material specular exponent

        case 'kd':

          // Diffuse color (color under white light) using RGB values

          params.color = new Color().fromArray( value );

          break;

        case 'ks':

          // Specular color (color when light is reflected from shiny surface) using RGB values
          params.specular = new Color().fromArray( value );

          break;

        case 'map_kd':

          // Diffuse texture map

          setMapForType( "map", value );

          break;

        case 'map_ks':

          // Specular map

          setMapForType( "specularMap", value );

          break;

        case 'map_bump':
        case 'bump':

          // Bump texture map

          setMapForType( "bumpMap", value );

          break;

        case 'ns':

          // The specular exponent (defines the focus of the specular highlight)
          // A high exponent results in a tight, concentrated highlight. Ns values normally range from 0 to 1000.

          params.shininess = parseFloat( value );

          break;

        case 'd':

          if ( value < 1 ) {

            params.opacity = value;
            params.transparent = true;

          }

          break;

        case 'illum':

          value = parseFloat(value);

          if ( value === MTLLoader.COLOR_ON_AND_AMBIENT_OFF ) {

            TMaterial = MeshBasicMaterial;

          }

          break;

        case 'Tr':

          if ( value > 0 ) {

            params.opacity = 1 - value;
            params.transparent = true;

          }

          break;

        default:
          break;

      }

    }

    if ( TMaterial === MeshBasicMaterial ) {

      [ "shininess", "specular" ].forEach( function ( attribute ) {

        if ( attribute in params ) {

          delete params[attribute];

        }

      } );

    }

    this.materials[ materialName ] = new TMaterial( params );
    return this.materials[ materialName ];
  }

  getTextureParams ( value, matParams ) {

    var texParams = {

      scale: new Vector2( 1, 1 ),
      offset: new Vector2( 0, 0 ),

     };

    var items = value.split(/\s+/);
    var pos;

    pos = items.indexOf('-bm');
    if (pos >= 0) {

      matParams.bumpScale = parseFloat( items[pos+1] );
      items.splice( pos, 2 );

    }

    pos = items.indexOf('-s');
    if (pos >= 0) {

      texParams.scale.set( parseFloat( items[pos+1] ), parseFloat( items[pos+2] ) );
      items.splice( pos, 4 ); // we expect 3 parameters here!

    }

    pos = items.indexOf('-o');
    if (pos >= 0) {

      texParams.offset.set( parseFloat( items[pos+1] ), parseFloat( items[pos+2] ) );
      items.splice( pos, 4 ); // we expect 3 parameters here!

    }

    texParams.url = items.join(' ').trim();
    return texParams;

  }

  loadTexture ( url, mapping, onLoad, onProgress, onError ) {

    var texture;
    var loader = Loader.Handlers.get( url );
    var manager = ( this.manager !== undefined ) ? this.manager : DefaultLoadingManager;

    if ( loader === null ) {

      loader = new TextureLoader( manager );

    }

    if ( loader.setCrossOrigin ) loader.setCrossOrigin( this.crossOrigin );
    texture = loader.load( url, onLoad, onProgress, onError );

    if ( mapping !== undefined ) texture.mapping = mapping;

    return texture;

  }

};

// http://paulbourke.net/dataformats/mtl/
Object.assign( MTLLoader, {
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
