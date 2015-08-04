var express = require( "express" ),
    router = express.Router(),
    prices = require( "../../data/config" ),
    config = require( "../config" ),
    stripe = require( "stripe" )( config.stripe_secret_key ),
    fs = require( "fs" ),
    crypto = require( "crypto" ),
    originTest = /^https?:\/\/(localhost|(www\.)?primroseeditor.com)(:\d+)?$/;

function accessControl ( req, res ) {
  var o = req.headers.origin;
  var t = originTest.test( o );
  if ( t ) {
    res.header( 'Access-Control-Allow-Origin', o );
    res.header( 'Access-Control-Allow-Methods', 'POST' );
    res.header( 'Access-Control-Allow-Headers', 'Content-Type' );
  }
}

router.options( "/", function ( req, res ) {
  accessControl( req, res );
  res.sendStatus( 200 );
} );

router.post( "/", function ( req, res ) {
  accessControl( req, res );
  var token = req.body;
  var price = prices[token.item];
  if ( price === undefined ) {
    res.send( JSON.stringify( {
      status: "error",
      error: "unknown_item"
    } ) );
  }
  else {
    token.amount = price;
    stripe.charges.create( {
      amount: token.amount,
      currency: "usd",
      card: token.id,
      description: token.email
    }, function ( err, charge ) {
      var response = {id: token.id};
      token.charge = charge;
      if ( err ) {
        response.status = token.status = "error";
        token.error = err;
        response.error = err.rawType;
      }
      else {
        var hash = crypto.createHash( "sha1" );
        hash.update( config.license_key_base );
        hash.update( token.id );
        response.license = token.status = hash.digest( "hex" );
        response.status = token.status = "ok";
      }
      fs.appendFileSync( "purchases", JSON.stringify( token ) + ",\n" );
      res.send( JSON.stringify( response ) );
    } );
  }
} );

module.exports = router;
