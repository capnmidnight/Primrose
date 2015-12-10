/* global THREE, Primrose, isOSX */

var app, ed, ed2, pointer;
function StartDemo () {
  app = new Primrose.VRApplication(
      "Codevember", {
        disablePhysics: true,
        sceneModel: "../models/scene4.json"
      }
  );

  var lastEditor = null;

  app.addEventListener( "ready", function () {
    if ( app.scene.Light1 ) {
      app.scene.Light1.intensity *= 2;
      app.scene.Light1.distance *= 2;
    }
    if ( app.scene.Light2 ) {
      app.scene.Light2.intensity *= 2;
      app.scene.Light2.distance *= 2;
    }
    if ( app.scene.Light3 ) {
      app.scene.Light3.intensity *= 2;
      app.scene.Light3.distance *= 2;
    }
    if ( app.scene.Ground ) {
      app.scene.Ground.material.shading = THREE.FlatShading;
      app.scene.Ground.material.needsUpdate = true;
    }
    if ( app.scene.Text ) {
      app.scene.Text.material.emissive.setRGB( 1, 1, 1 );
    }

    window.addEventListener( "mousedown", function ( evt ) {
      if ( lastEditor ) {
        lastEditor.blur();
      }
      lastEditor = null;
    }, false );

    ed = app.createElement( "textarea" );
    ed.value = StartDemo.toString();
    ed.mesh.position.z = 2.5;

    ed2 = app.createElement( "textarea" );
    ed2.value = StartDemo.toString();
    ed2.mesh.position.z = 3;
    ed2.mesh.rotation.y = Math.PI / 2;
  } );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt * 0.001;
    if ( app.scene.Ground ) {
      app.scene.Ground.rotation.x = t * 100;
    }
  } );

  app.start();
}