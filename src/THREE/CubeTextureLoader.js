import { CubeTextureLoader, CubeTexture, ImageLoader } from "three";

CubeTextureLoader.prototype.load = function( urls, onLoad, onProgress, onError ) {
  var texture = new CubeTexture();
  var loader = new ImageLoader( this.manager );
  loader.setCrossOrigin( this.crossOrigin );
  loader.setPath( this.path );
  var loaded = 0;
  function loadTexture( i ) {
    loader.load( urls[ i ], function ( image ) {
      texture.images[ i ] = image;
      ++loaded;
      if ( loaded === 6 ) {
        texture.needsUpdate = true;
        if ( onLoad ) onLoad( texture );
      }
    }, onProgress, onError );
  }

  for ( var i = 0; i < urls.length; ++ i ) {
    loadTexture( i );
  }

  return texture;
};