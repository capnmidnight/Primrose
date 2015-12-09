/* global THREE, Primrose */

var app, ed, pointer;
function StartDemo () {
  app = new Primrose.VRApplication(
      "Codevember", {
        disablePhysics: true,
        sceneModel: "../models/scene4.json"
      }
  );

  app.addEventListener( "ready", function () {
    app.scene.Light1.intensity *= 2;
    app.scene.Light1.distance *= 2;
    app.scene.Light2.intensity *= 2;
    app.scene.Light2.distance *= 2;
    app.scene.Light3.intensity *= 2;
    app.scene.Light3.distance *= 2;
    app.scene.Ground.material.shading = THREE.FlatShading;
    app.scene.Ground.material.needsUpdate = true;
    app.scene.Text.material.emissive.setRGB( 1, 1, 1 );

    ed = makeEditor(
        app.scene, null, "textEditor",
        1, 1,
        0, 0, 2.5,
        0, 0, 0, {
          tokenizer: Primrose.Text.Grammars.JavaScript,
          fontSize: 20
        } );
    ed.editor.value = StartDemo.toString();
    ed.editor.focus();

    pointer = textured( sphere( 0.02, 16, 8 ), 0xff6633 );
    pointer.material.emissive.setRGB( 0.25, 0, 0 );
    app.scene.add( pointer );

  } );

  var t = 0;
  app.addEventListener( "update", function ( dt ) {
    t += dt * 0.001;
    app.scene.Ground.rotation.x = t * 100;


    pointer.position
        .set( 0, 0, -1 )
        .applyQuaternion( app.camera.quaternion )
        .add( app.camera.position );
    if ( projectPointer( pointer.position, ed ) ) {
      pointer.material.color.setRGB( 0, 1, 0 );
      pointer.material.emissive.setRGB( 0, 0.25, 0 );
    }
    else {
      pointer.material.color.setRGB( 1, 0, 0 );
      pointer.material.emissive.setRGB( 0.25, 0, 0 );
    }
  } );


// this currently only works for objects that are roughly aligned to face down the Z axis.
  function projectPointer ( p, obj ) {
    var fs = obj.geometry.faces,
        // We have to transform the vertices of the geometry into world-space
        // coordinations, because the object they are on could be rotated or
        // positioned somewhere else.
        verts = obj.geometry.vertices.map( function ( v ) {
          return v.clone()
              .applyMatrix4( obj.matrix );
        } ),
        // There is currently no selected face
        faceIndex = null,
        // We set minAngle to a low value to require the pointer to get close to
        // the object before we project onto it.
        minAngle = 0.1;
    // Find the face that is closest to the pointer
    for ( var i = 0; i < fs.length; ++i ) {
      var f = fs[i],
          odd = ( i % 2 ) === 1,
          v0 = verts[odd ? f.b : f.a],
          a = new THREE.Vector3().subVectors( v0, app.camera.position ),
          b = new THREE.Vector3().subVectors( p, app.camera.position ),
          angle = Math.acos( a.dot( b ) / a.length() );
      if ( angle < minAngle ) {
        minAngle = angle;
        faceIndex = i;
      }
    }
    if ( faceIndex !== null ) {
      var f = fs[faceIndex],
          // We need to know the arity of the face because we will be building
          // a pair of axis vectors and we need to know which one is the "middle"
          // vertex.
          odd = ( faceIndex % 2 ) === 1,
          // I had to determine this order by trial and error, but now it looks
          // like it's a basic rotation, where the last two points of the previou
          // polygon are used as the first two points of the next polygon, what
          // is called a "Triangle Strip".
          v0 = verts[odd ? f.b : f.a],
          v1 = verts[odd ? f.c : f.b],
          v2 = verts[odd ? f.a : f.c],
          // Two vectors define the axes of a plane, i.e. our polygon face
          axis0 = new THREE.Vector3().subVectors( v1, v0 ).normalize(),
          axis1 = new THREE.Vector3().subVectors( v2, v0 ).normalize(),
          // The cross product of two non-parallel vectors is a new vector that
          // is perpendicular to both of the original vectors, AKA the face
          // "normal" vector. It sticks straight up out of the face, pointing 
          // roughly in the direction of our pointer ball.
          axis2 = new THREE.Vector3().crossVectors( axis0, axis1 ),
          // This matrix is a succinct way to define our plane. We'll use it
          // later to figure out how to express the location of the pointer ball
          // in corrodinates local to the plane.
          m = new THREE.Matrix4().set(
          axis0.x, axis1.x, axis2.x, 0,
          axis0.y, axis1.y, axis2.y, 0,
          axis0.z, axis1.z, axis2.z, 0,
          0, 0, 0, 1 );

      // A value of 0 will tell us that there is no solvable solution, so we
      // want to avoid that.
      if ( m.determinant() !== 0 ) {

        // translate the point of interest into the reference frame of the
        // plane. We don't have to do any rotations because we are treating this
        // object as an infinitely small point.
        var q = new THREE.Vector3().subVectors( p, v0 ),
            // determine how far away from the plane the point lies
            dist = axis2.dot( q );

        // move the demo pointer into place on the surface of the face
        p.sub( axis2.clone().multiplyScalar( dist ) )
            .add( axis2.multiplyScalar( 0.01 ) );

        // inverting the plane matrix will then let us apply it to the vector in
        // question to figure out the coordinates the point has in that plane.
        m.getInverse( m );
        q.applyMatrix4( m );

        // Now, construct a new plane based on the UV coordinates for the face.
        // We want to figure out where in the texture lies a coordinate that is
        // similar to how the pointer currently relates to the face.
        var uvs = obj.geometry.faceVertexUvs[0][faceIndex],
            uv0 = uvs[odd ? 1 : 0],
            uv1 = uvs[odd ? 2 : 1],
            uv2 = uvs[odd ? 0 : 2];

        // I'm reusing the axis0 and axis1 vectors here to save memory, these
        // are a wholey new set of axes defining a new plane.
        axis0.set( uv1.x - uv0.x, uv1.y - uv0.y, 0 );
        axis1.set( uv2.x - uv0.x, uv2.y - uv0.y, 0 );

        // The normal for the texture is always straight out in the Z axis, so
        // there is no need to do any sort of calculations.
        m.set(
            axis0.x, axis1.x, 0, 0,
            axis0.y, axis1.y, 0, 0,
            axis0.z, axis1.z, 1, 0,
            0, 0, 0, 1 );

        var dx = Math.max( Math.abs( axis0.x ), Math.abs( axis1.x ) ),
            dy = Math.max( Math.abs( axis0.y ), Math.abs( axis1.y ) );

        // This is it, we've got our point now! We're almost done.
        q.applyMatrix4( m );
        q.x /= dx;
        q.y /= dy;
        q.add( uv0 );

        if ( obj.editor ) {
          // At this point, the UV coord is scaled to a proporitional value, on
          // the range [0, 1] for the dimensions of the image used as the texture.
          // So we have to rescale it back out again. Also, the y coordinate is
          // flipped.
          var textureU = Math.floor( obj.material.map.image.width * q.x ),
              textureV = Math.floor( obj.material.map.image.height * ( 1 - q.y ) );
          obj.editor.startPointer( textureU, textureV );
          obj.editor.endPointer();
        }

        return true;
      }
    }
    return false;
  }

  app.start();
}