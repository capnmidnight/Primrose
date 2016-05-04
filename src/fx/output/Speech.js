Primrose.Output.Speech = ( function ( ) {
  function pickRandomOption ( options, key, min, max ) {
    if ( options[key] === undefined ) {
      options[key] = min + ( max - min ) * Math.random( );
    }
    else {
      options[key] = Math.min( max, Math.max( min, options[key] ) );
    }
    return options[key];
  }

  try {
    pliny.class({
      parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
    } );
    return function ( options ) {
      options = options || {};
      var voices = speechSynthesis.getVoices( )
          .filter( function ( v ) {
            return v.default || v.localService;
          }.bind( this ) );

      var voice = voices[
          Math.floor( pickRandomOption( options, "voice", 0, voices.length ) )];

      this.speak = function ( txt, callback ) {
        var msg = new SpeechSynthesisUtterance( );
        msg.voice = voice;
        msg.volume = pickRandomOption( options, "volume", 1, 1 );
        msg.rate = pickRandomOption( options, "rate", 0.1, 5 );
        msg.pitch = pickRandomOption( options, "pitch", 0, 2 );
        msg.text = txt;
        msg.onend = callback;
        speechSynthesis.speak( msg );
      };
    };
  }
  catch (exp) {
    console.error(exp);

    // in case of error, return a shim that lets us continue unabated
    pliny.class({
      parent: "Primrose.Output",
      name: "Speech",
      description: "| [under construction]"
    } );
    return function ( ) {
      this.speak = function ( ) {
      };
    };
  }
} )( );

