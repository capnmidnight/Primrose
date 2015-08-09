var express = require( "express" ),
    path = require( "path" ),
    favicon = require( "serve-favicon" ),
    logger = require( "morgan" ),
    cookieParser = require( "cookie-parser" ),
    bodyParser = require( "body-parser" ),
    fs = require( "fs" ),
    debug = require( "debug" )( "Primrose-Site:server" ),
    https = require( "https" ),
    start = require( "./starter" ),
    purchase = require( "./routes/purchase" ),
    app = express(),
    options = require( "./options" )
    .parse( process.argv, {
      port: 8082,
      dev: true
    } ),
    server,
    keys = {
      key: readFile( "../.ssl/key.pem" ),
      cert: readFile( "../.ssl/cert.pem" ),
      ca: [
        readFile( "../.ssl/ca1.pem" ),
        readFile( "../.ssl/ca2.pem" )
      ]
    };

options.port = parseInt( options.port, 10 );
console.log( "setting up to run on port", options.port );
options.dev = options.dev !== "false" || !keys.key;

// view engine setup
app.set( "view engine", "jade" );

// uncomment after placing your favicon in /public
app.use( logger( "dev" ) );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( {extended: false} ) );
app.use( cookieParser() );
app.use( "/purchase", purchase );

// catch 404 and forward to error handler
app.use( function ( req, res, next ) {
  var err = new Error( "Not Found" );
  err.status = 404;
  next( err );
} );

// error handlers

// development error handler
// will print stacktrace
if ( options.dev ) {
  app.use( function ( err, req, res, next ) {
    res.status( err.status || 500 );
    res.render( "error", {
      message: err.message,
      error: err
    } );
  } );
}

// production error handler
// no stacktraces leaked to user
app.use( function ( err, req, res, next ) {
  res.status( err.status || 500 );
  res.render( "error", {
    message: err.message,
    error: {}
  } );
} );

/**
 * Get port from environment and store in Express.
 */
app.set( "port", options.port );

function onError ( error ) {
  if ( error.syscall !== "listen" ) {
    throw error;
  }

  // handle specific listen errors with friendly messages
  switch ( error.code ) {
    case "EACCES":
      console.error( "Port " + options.port +
          " requires elevated privileges" );
      process.exit( 1 );
      break;
    case "EADDRINUSE":
      console.error( "Port " + options.port + " is already in use" );
      process.exit( 1 );
      break;
    default:
      throw error;
  }
}

function onListening () {
  debug( "Listening on port " + this.address().port );
}

function readFile ( file ) {
  if ( fs.existsSync( file ) ) {
    return fs.readFileSync( file );
  }
  return null;
}

if ( options.dev ) {
  server = require( "http" )
      .createServer( app );
}
else {
  server = require( "https" )
      .createServer( keys, app );
}

server.listen( options.port );
server.on( "error", onError );
server.on( "listening", onListening );
if ( options.dev ) {
  start( false, options.port );
}
