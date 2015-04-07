/**
 * @author dmarcos / https://github.com/dmarcos
 *
 * It handles stereo rendering
 * If mozGetVRDevices and getVRDevices APIs are not available it gracefuly falls back to a
 * regular renderer
 *
 * The HMD supported is the Oculus DK1 and The Web API doesn't currently allow
 * to query for the display resolution (only the chrome API allows it).
 * The dimensions of the screen are temporarly hardcoded (1280 x 800).
 *
 * For VR mode to work it has to be used with the Oculus enabled builds of Firefox or Chrome:
 *
 * Firefox:
 *
 * OSX: http://people.mozilla.com/~vladimir/vr/firefox-33.0a1.en-US.mac.dmg
 * WIN: http://people.mozilla.com/~vladimir/vr/firefox-33.0a1.en-US.win64-x86_64.zip
 *
 * Chrome builds:
 *
 * https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ&usp=sharing#list
 *
 */
THREE.VREffect = function ( renderer, vrHMD ) {
  var cameraLeft = new THREE.PerspectiveCamera();
  var cameraRight = new THREE.PerspectiveCamera();

  this.setHMD = function ( vrHMD ) {
    this.leftRect = vrHMD.getRecommendedEyeRenderRect( "left" );
    this.rightRect = vrHMD.getRecommendedEyeRenderRect( "right" );
    this.leftEyeTranslation = vrHMD.getEyeTranslation( "left" );
    this.rightEyeTranslation = vrHMD.getEyeTranslation( "right" );
    this.leftEyeFOV = vrHMD.getRecommendedEyeFieldOfView( "left" );
    this.rightEyeFOV = vrHMD.getRecommendedEyeFieldOfView( "right" );
  };

  this.setHMD( vrHMD );

  this.render = function ( scene, camera, renderTarget, forceClear ) {
    if ( camera.parent === undefined ) {
      camera.updateMatrixWorld();
    }

    renderer.enableScissorTest( true );
    renderer.clear();

    // render left eye
    cameraLeft.projectionMatrix = this.FovToProjection( this.leftEyeFOV, true,
        camera.near, camera.far );
    camera.matrixWorld.decompose( cameraLeft.position, cameraLeft.quaternion,
        cameraLeft.scale );
    cameraLeft.translateX( this.leftEyeTranslation.x );
    renderer.setViewport( this.leftRect.x, this.leftRect.y,
        this.leftRect.width, this.leftRect.height );
    renderer.setScissor( this.leftRect.x, this.leftRect.y, this.leftRect.width,
        this.leftRect.height );
    renderer.render( scene, cameraLeft, renderTarget, forceClear );

    // render right eye
    cameraRight.projectionMatrix = this.FovToProjection( this.rightEyeFOV,
        true, camera.near, camera.far );
    camera.matrixWorld.decompose( cameraRight.position, cameraRight.quaternion,
        cameraRight.scale );
    cameraRight.translateX( this.rightEyeTranslation.x );
    renderer.setViewport( this.rightRect.x, this.rightRect.y,
        this.rightRect.width, this.rightRect.height );
    renderer.setScissor( this.rightRect.x, this.rightRect.y,
        this.rightRect.width, this.rightRect.height );
    renderer.render( scene, cameraRight, renderTarget, forceClear );

    renderer.enableScissorTest( false );
  };

  this.FovToNDCScaleOffset = function ( fov ) {
    var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
    var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
    var pyscale = 2.0 / ( fov.upTan + fov.downTan );
    var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
    return {scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ]};
  };

  this.FovPortToProjection = function ( fov, rightHanded /* = true */,
      zNear /* = 0.01 */, zFar /* = 10000.0 */ )
  {
    rightHanded = rightHanded === undefined ? true : rightHanded;
    zNear = zNear === undefined ? 0.01 : zNear;
    zFar = zFar === undefined ? 10000.0 : zFar;

    var handednessScale = rightHanded ? -1.0 : 1.0;


    // and with scale/offset info for normalized device coords
    var scaleAndOffset = this.FovToNDCScaleOffset( fov );

    // start with an identity matrix
    var mobj = new THREE.Matrix4().set(
        // X result, map clip edges to [-w,+w]
        scaleAndOffset.scale[0],
        0.0,
        scaleAndOffset.offset[0] * handednessScale,
        0.0,
        // Y result, map clip edges to [-w,+w]
        // Y offset is negated because this proj matrix transforms from world coords with Y=up,
        // but the NDC scaling has Y=down (thanks D3D?)
        0.0,
        scaleAndOffset.scale[1],
        -scaleAndOffset.offset[1] * handednessScale,
        0.0,
        // Z result (up to the app)
        0.0,
        0.0,
        zFar / ( zNear - zFar ) * -handednessScale,
        ( zFar * zNear ) / ( zNear - zFar ),
        // W result (= Z in)
        0.0,
        0.0,
        handednessScale,
        0.0
        );

    return mobj;
  };

  this.FovToProjection = function ( fov, rightHanded /* = true */,
      zNear /* = 0.01 */, zFar /* = 10000.0 */ )
  {
    var fovPort = {
      upTan: Math.tan( fov.upDegrees * Math.PI / 180.0 ),
      downTan: Math.tan( fov.downDegrees * Math.PI / 180.0 ),
      leftTan: Math.tan( fov.leftDegrees * Math.PI / 180.0 ),
      rightTan: Math.tan( fov.rightDegrees * Math.PI / 180.0 )
    };
    return this.FovPortToProjection( fovPort, rightHanded, zNear, zFar );
  };

};
