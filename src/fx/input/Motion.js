/* global Primrose, THREE, isWebKit, isiOS, devicePixelRatio, pliny */

Primrose.Input.Motion = ( function ( ) {

  pliny.class("Primrose.Input", {
    name: "Motion",
    description: "| [under construction]"
  });
  function MotionInput ( name, commands, socket ) {
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket, MotionInput.AXES );
    var corrector = new MotionCorrector( ),
        a = new THREE.Quaternion( ),
        b = new THREE.Quaternion( ),
        RIGHT = new THREE.Vector3( 1, 0, 0 ),
        UP = new THREE.Vector3( 0, 1, 0 ),
        FORWARD = new THREE.Vector3( 0, 0, -1 );
    corrector.addEventListener( "deviceorientation", function ( evt ) {
      for ( var i = 0; i < MotionInput.AXES.length; ++i ) {
        var k = MotionInput.AXES[i];
        this.setAxis( k, evt[k] );
      }
      a.set( 0, 0, 0, 1 )
          .multiply( b.setFromAxisAngle( UP, evt.HEADING ) )
          .multiply( b.setFromAxisAngle( RIGHT, evt.PITCH ) )
          .multiply( b.setFromAxisAngle( FORWARD, evt.ROLL ) );
      this.headRX = a.x;
      this.headRY = a.y;
      this.headRZ = a.z;
      this.headRW = a.w;
    }.bind( this ) );
    this.zeroAxes = corrector.zeroAxes.bind( corrector );
  }

  MotionInput.AXES = [
    "HEADING", "PITCH", "ROLL",
    "D_HEADING", "D_PITCH", "D_ROLL",
    "headAX", "headAY", "headAZ",
    "headRX", "headRY", "headRZ", "headRW" ];
  Primrose.Input.ButtonAndAxis.inherit( MotionInput );

  function makeTransform ( s, eye ) {
    var sw = Math.max( screen.width, screen.height ),
        sh = Math.min( screen.width, screen.height ),
        w = Math.floor( sw * devicePixelRatio / 2 ),
        h = Math.floor( sh * devicePixelRatio ),
        i = ( eye + 1 ) / 2;

    if (window.THREE) {
      s.transform = new THREE.Matrix4().makeTranslation(eye * 0.034, 0, 0);
    }
    s.viewport = {
      x: i * w,
      y: 0,
      width: w,
      height: h,
      top: 0,
      right: ( i + 1 ) * w,
      bottom: h,
      left: i * w};
    s.fov = 75;
  }

  MotionInput.DEFAULT_TRANSFORMS = [ {}, {} ];
  makeTransform( MotionInput.DEFAULT_TRANSFORMS[0], -1 );
  makeTransform( MotionInput.DEFAULT_TRANSFORMS[1], 1 );

  MotionInput.prototype.getQuaternion = function ( x, y, z, w, value ) {
    value = value || new THREE.Quaternion();
    value.set( this.getValue( x ),
        this.getValue( y ),
        this.getValue( z ),
        this.getValue( w ) );
    return value;
  };
  return MotionInput;
} )( );

pliny.issue( "Primrose.Input.Motion", {
  name: "document Motion",
  type: "open",
  description: "Finish writing the documentation for the [Primrose.Input.Motion](#Primrose_Input_Motion) class in the input/ directory"
} );
