Primrose.Output.Music = ( function () {

  /* polyfill */
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  var PIANO_BASE = Math.pow( 2, 1 / 12 ),
      MAX_NOTE_COUNT = ( navigator.maxTouchPoints || 10 ) + 1;

  function piano ( n ) {
    return 440 * Math.pow( PIANO_BASE, n - 49 );
  }

  pliny.class({
    parent: "Primrose.Output",
    name: "Music",
    description: "| [under construction]"
  } );
  function Music ( context, type, numNotes ) {
    this.audio = context || new AudioContext();
    if ( this.audio && this.audio.createGain ) {
      if ( numNotes === undefined ) {
        numNotes = MAX_NOTE_COUNT;
      }
      if ( type === undefined ) {
        type = "sawtooth";
      }
      this.available = true;
      this.mainVolume = this.audio.createGain();
      this.mainVolume.connect( this.audio.destination );
      this.numNotes = numNotes;
      this.oscillators = [ ];

      for ( var i = 0; i < this.numNotes; ++i ) {
        var o = this.audio.createOscillator(),
            g = this.audio.createGain();
        o.type = type;
        o.frequency.value = 0;
        o.connect( g );
        o.start();
        g.connect( this.mainVolume );
        this.oscillators.push( {
          osc: o,
          gn: g,
          timeout: null
        } );
      }
    } else {
      this.available = false;
    }
  }

  Music.prototype.noteOn = function ( volume, i, n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes],
          f = piano( parseFloat( i ) + 1 );
      o.gn.gain.value = volume;
      o.osc.frequency.setValueAtTime( f, 0 );
      return o;
    }
  };

  Music.prototype.noteOff = function ( n ) {
    if ( this.available ) {
      if ( n === undefined ) {
        n = 0;
      }
      var o = this.oscillators[n % this.numNotes];
      o.osc.frequency.setValueAtTime( 0, 0 );
    }
  };

  Music.prototype.play = function ( i, volume, duration, n ) {
    if ( this.available ) {
      if ( typeof n !== "number" ) {
        n = 0;
      }
      var o = this.noteOn( volume, i, n );
      if ( o.timeout ) {
        clearTimeout( o.timeout );
        o.timeout = null;
      }
      o.timeout = setTimeout( ( function ( n, o ) {
        this.noteOff( n );
        o.timeout = null;
      } ).bind( this, n, o ), duration * 1000 );
    }
  };

  return Music;
} )();

