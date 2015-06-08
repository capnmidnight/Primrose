/* global Primrose, speechSynthesis */

Primrose.Audio.SpeechOutput = ( function ( ) {
  function pickRandomOption ( options, key, min, max ) {
    if ( !options[key] ) {
      options[key] = min + ( max - min ) * Math.random( );
    }
    else {
      options[key] = Math.min( max, Math.max( min, options[key] ) );
    }
    return options[key];
  }

  try {
    return {
      defaultLanguage: ( function ( ) {
        return speechSynthesis.getVoices( )
            .filter( function ( v ) {
              return v.default;
            } )
            .map(function(v){
              return v.lang.substring(0, 2);
            })[0];
      } )( ),
      Character: function ( options ) {
        if ( !Primrose.Audio.SpeechOutput.voices ||
            Primrose.Audio.SpeechOutput.voices.length === 0 ) {
          Primrose.Audio.SpeechOutput.voices = speechSynthesis.getVoices( )
              .filter( function ( v ) {
                return v.default ||
                    v.localService ||
                    v.lang === Primrose.Audio.SpeechOutput.defaultLanguage;
              }.bind( this ) );
        }

        var msg = new SpeechSynthesisUtterance( );
        options = options || { };
        this.voice = msg.voice = Primrose.Audio.SpeechOutput.voices[Math.floor(
            pickRandomOption( options, "voice", 0,
                Primrose.Audio.SpeechOutput.voices.length ) )];
        msg.volume = pickRandomOption( options, "volume", 0.5,
            1 );
        msg.rate = pickRandomOption( options, "rate", 0.1, 5 );
        msg.pitch = pickRandomOption( options, "pitch", 0, 2 );
        this.speak = function ( txt, callback ) {
          msg.text = txt;
          msg.onend = callback;
          speechSynthesis.speak( msg );
        };
      }
    };
  }
  catch ( exp ) {

// in case of error, return a shim that lets us continue unabated.
    return {
      Character: function ( ) {
        this.speak = function ( ) {
        };
      }
    };
  }
} )( );
