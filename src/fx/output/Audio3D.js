/* global Primrose, Window, pliny */

Primrose.Output.Audio3D = ( function () {

  // polyfill
  Window.prototype.AudioContext =
      Window.prototype.AudioContext ||
      Window.prototype.webkitAudioContext ||
      function () {
      };

  pliny.class( "Primrose.Output", {
    name: "Audio3D",
    description: "<under construction>"
  } );
  function Audio3D () {

    try {
      this.context = new AudioContext();
      this.sampleRate = this.context.sampleRate;
      this.mainVolume = this.context.createGain();
      this.mainVolume.connect( this.context.destination );

      this.setPosition = this.context.listener.setPosition.bind(
          this.context.listener );
      this.setVelocity = this.context.listener.setVelocity.bind(
          this.context.listener );
      this.setOrientation = this.context.listener.setOrientation.bind(
          this.context.listener );
      this.isAvailable = true;
    }
    catch ( exp ) {
      this.isAvailable = false;
      this.setPosition = function () {
      };
      this.setVelocity = function () {
      };
      this.setOrientation = function () {
      };
      this.error = exp;
      console.error( "AudioContext not available. Reason: ", exp.message );
    }
  }

  Audio3D.prototype.loadBuffer = function ( src, progress, success ) {
    if ( !success ) {
      throw new Error(
          "You need to provide a callback function for when the audio finishes loading" );
    }

    // just overlook the lack of progress indicator
    if ( !progress ) {
      progress = function () {
      };
    }

    var error = function () {
      progress( "error", src );
    };

    if ( this.isAvailable ) {
      progress( "loading", src );
      Primrose.HTTP.get( "arraybuffer", src, function ( evt ) {
        progress( "intermediate", src, evt.loaded );
      }, error, function ( data ) {
        progress( "success", src );
        this.context.decodeAudioData( data, success, error );
      } );
    }
    else {
      error();
    }
  };

  Audio3D.prototype.loadBufferCascadeSrcList = function ( srcs, progress,
      success, index ) {
    index = index || 0;
    if ( index === srcs.length ) {
      if ( progress ) {
        srcs.forEach( function ( s ) {
          progress( "error", s );
        } );
      }
    }
    else {
      var userSuccess = success,
          userProgress = progress;
      success = function ( buffer ) {
        if ( userProgress ) {
          for ( var i = index + 1; i < srcs.length; ++i ) {
            console.log( "Skipping loading alternate file [" + srcs[i] +
                "]. [" + srcs[index] + "] has already loaded." );
            userProgress( "skip", srcs[i], "[" + srcs[index] +
                "] has already loaded." );
          }
        }
        if ( userSuccess ) {
          userSuccess( buffer );
        }
      };
      progress = function ( type, file, data ) {
        if ( userProgress ) {
          userProgress( type, file, data );
        }
        if ( type === "error" ) {
          console.warn( "Failed to decode " + srcs[index] );
          setTimeout( this.loadBufferCascadeSrcList.bind( this, srcs,
              userProgress, userSuccess, index + 1 ), 0 );
        }
      };
      this.loadBuffer( srcs[index], progress, success );
    }
  };

  Audio3D.prototype.createRawSound = function ( pcmData, success ) {
    if ( pcmData.length !== 1 && pcmData.length !== 2 ) {
      throw new Error( "Incorrect number of channels. Expected 1 or 2, got " +
          pcmData.length );
    }

    var frameCount = pcmData[0].length;
    if ( pcmData.length > 1 && pcmData[1].length !== frameCount ) {
      throw new Error(
          "Second channel is not the same length as the first channel. Expected " +
          frameCount + ", but was " + pcmData[1].length );
    }

    var buffer = this.context.createBuffer( pcmData.length, frameCount, this.sampleRate );
    for ( var c = 0; c < pcmData.length; ++c ) {
      var channel = buffer.getChannelData( c );
      for ( var i = 0; i < frameCount; ++i ) {
        channel[i] = pcmData[c][i];
      }
    }
    success( buffer );
  };

  Audio3D.prototype.createSound = function ( loop, success, buffer ) {
    var snd = {
      volume: this.context.createGain(),
      source: this.context.createBufferSource()
    };
    snd.source.buffer = buffer;
    snd.source.loop = loop;
    snd.source.connect( snd.volume );
    success( snd );
  };

  Audio3D.prototype.create3DSound = function ( x, y, z, success, snd ) {
    snd.panner = this.context.createPanner();
    snd.panner.setPosition( x, y, z );
    snd.panner.connect( this.mainVolume );
    snd.volume.connect( snd.panner );
    success( snd );
  };

  Audio3D.prototype.createFixedSound = function ( success, snd ) {
    snd.volume.connect( this.mainVolume );
    success( snd );
  };

  Audio3D.prototype.loadSound = function ( src, loop, progress, success ) {
    this.loadBuffer( src, progress, this.createSound.bind( this, loop,
        success ) );
  };

  Audio3D.prototype.loadSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadBufferCascadeSrcList( srcs, progress, this.createSound.bind( this,
        loop, success ) );
  };

  Audio3D.prototype.load3DSound = function ( src, loop, x, y, z, progress, success ) {
    this.loadSound( src, loop, progress, this.create3DSound.bind( this, x, y,
        z, success ) );
  };

  Audio3D.prototype.load3DSoundCascadeSrcList = function ( srcs, loop, x, y, z, progress, success ) {
    this.loadSoundCascadeSrcList()( srcs, loop, progress,
        this.create3DSound.bind( this, x, y, z, success ) );
  };

  Audio3D.prototype.loadFixedSound = function ( src, loop, progress, success ) {
    this.loadSound( src, loop, progress, this.createFixedSound.bind( this,
        success ) );
  };

  Audio3D.prototype.loadFixedSoundCascadeSrcList = function ( srcs, loop, progress, success ) {
    this.loadSoundCascadeSrcList( srcs, loop, progress,
        this.createFixedSound.bind( this, success ) );
  };

  Audio3D.prototype.playBufferImmediate = function ( buffer, volume ) {
    this.createSound( false, this.createFixedSound.bind( this, function (
        snd ) {
      snd.volume.gain.value = volume;
      snd.source.addEventListener( "ended", function ( evt ) {
        snd.volume.disconnect( this.mainVolume );
      }.bind( this ) );
      snd.source.start( 0 );
    } ), buffer );
  };

  return Audio3D;
} )();

pliny.issue( "Primrose.Output.Audio3D", {
  name: "document Audio3D",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Output.Audio3D](#Primrose_Output_Audio3D) class in the output/ directory"
} );

