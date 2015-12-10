/* global Primrose, THREE */

Primrose.Input.Mouse = ( function () {
  function MouseInput ( name, DOMElement, commands, socket, oscope ) {
    DOMElement = DOMElement || window;
    Primrose.Input.ButtonAndAxis.call( this, name, commands, socket,
        oscope, 1, MouseInput.AXES );

    this.setLocation = function ( x, y ) {
      this.setAxis( "X", x );
      this.setAxis( "Y", y );
    };

    this.setMovement = function ( dx, dy ) {
      this.setAxis( "X", dx + this.getAxis( "X" ) );
      this.setAxis( "Y", dy + this.getAxis( "Y" ) );
    };

    this.readEvent = function ( event ) {
      this.setAxis( "BUTTONS", event.buttons );
      if ( MouseInput.isPointerLocked() ) {
        var mx = event.movementX,
            my = event.movementY;

        if ( mx === undefined ) {
          mx = event.webkitMovementX || event.mozMovementX || 0;
          my = event.webkitMovementY || event.mozMovementY || 0;
        }
        this.setMovement( mx, my );
      }
      else {
        this.setLocation( event.clientX, event.clientY );
      }
    };

    DOMElement.addEventListener( "mousedown", function ( event ) {
      this.setButton( event.button, true );
      this.readEvent( event );
    }.bind( this ), false );

    DOMElement.addEventListener( "mouseup", function ( event ) {
      this.setButton( event.button, false );
      this.readEvent( event );
    }.bind( this ), false );

    DOMElement.addEventListener( "mousemove", this.readEvent.bind( this ), false );

    DOMElement.addEventListener( "mousewheel", function ( event ) {
      this.setAxis( "Z", this.getAxis( "Z" ) + event.wheelDelta );
      this.readEvent( event );
    }.bind( this ), false );

    this.addEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.addEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.addEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.addEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    this.removeEventListener = function ( event, handler, bubbles ) {
      if ( event === "pointerlockchange" ) {
        if ( document.exitPointerLock ) {
          document.removeEventListener(
              'pointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.mozExitPointerLock ) {
          document.removeEventListener(
              'mozpointerlockchange',
              handler,
              bubbles );
        }
        else if ( document.webkitExitPointerLock ) {
          document.removeEventListener(
              'webkitpointerlockchange',
              handler,
              bubbles );
        }
      }
    };

    DOMElement.requestPointerLock = DOMElement.requestPointerLock ||
        DOMElement.webkitRequestPointerLock ||
        DOMElement.mozRequestPointerLock ||
        function () {
        };

    this.requestPointerLock = function () {
      if ( !MouseInput.isPointerLocked() ) {
        DOMElement.requestPointerLock();
      }
    };

    this.exitPointerLock = ( document.webkitExitPointerLock ||
        document.mozExitPointerLock ||
        document.exitPointerLock ||
        function () {
        } ).bind( document );

    this.togglePointerLock = function () {
      if ( MouseInput.isPointerLocked() ) {
        this.exitPointerLock();
      }
      else {
        this.requestPointerLock();
      }
    };
  }

  MouseInput.isPointerLocked = function () {
    return !!( document.pointerLockElement ||
        document.webkitPointerLockElement ||
        document.mozPointerLockElement );
  };
  MouseInput.AXES = [ "X", "Y", "Z", "BUTTONS" ];
  Primrose.Input.ButtonAndAxis.inherit( MouseInput );

  function transform ( matrix, v ) {
    return v.clone()
        .applyMatrix4( matrix );
  }

  MouseInput.projectPointer = function ( p, from, objs ) {
    if ( !( objs instanceof Array ) ) {
      objs = [ objs ];
    }
    var // We set minAngle to a low value to require the pointer to get close to
        // the object before we project onto it.
        minAngle = Number.MAX_VALUE,
        // We set minDist to a high value to make sure we capture everything.
        minDist = Number.MAX_VALUE,
        minObj,
        // There is currently no selected face
        minFaceIndex,
        minVerts,
        faces,
        mesh,
        face,
        odd,
        v0,
        v1,
        v2,
        dist;
    for ( var j = 0; j < objs.length; ++j ) {
      var obj = objs[j];
      mesh = obj.mesh || obj;
      if ( mesh.visible && mesh.geometry.vertices ) {
        faces = mesh.geometry.faces;
        // We have to transform the vertices of the geometry into world-space
        // coordinations, because the object they are on could be rotated or
        // positioned somewhere else.
        // We should maybe cache this data at some point.
        var verts = mesh.geometry.vertices.map( transform.bind( this, mesh.matrix ) );

        // Find the face that is closest to the pointer
        for ( var i = 0; i < faces.length; ++i ) {
          face = faces[i];
          odd = ( i % 2 ) === 1;
          v0 = verts[odd ? face.b : face.a];
          v1 = verts[odd ? face.c : face.b];
          v2 = verts[odd ? face.a : face.c];
          // Shoot a vector from the camera to each of the three corners 
          // of the mesh face
          var a = new THREE.Vector3().subVectors( v0, from ).normalize(),
              b = new THREE.Vector3().subVectors( v1, from ).normalize(),
              c = new THREE.Vector3().subVectors( v2, from ).normalize(),
              // Shoot a vector to the selector point
              d = new THREE.Vector3().subVectors( p, from );
          // Find the distance to the closest point in the polygon
          dist = Math.min(
              p.distanceToSquared( v0 ),
              p.distanceToSquared( v1 ),
              p.distanceToSquared( v2 ) );
          // Find the minimal displacement angle between each of the
          // vectors to the corners and the vector to the pointer. Basically,
          // how "far" does the user have to look to get from the pointer
          // to each of the corners.
          var angle = Math.min(
              Math.acos( a.dot( d ) ),
              Math.acos( b.dot( d ) ),
              Math.acos( c.dot( d ) ) );
          if ( angle < minAngle && dist < minDist ) {
            minObj = obj;
            minDist = dist;
            minAngle = angle;
            minFaceIndex = i;
            minVerts = verts;
          }
        }
      }
    }

    if ( minObj !== null && minFaceIndex !== null ) {
      mesh = minObj.mesh || minObj;
      faces = mesh.geometry.faces;
      face = faces[minFaceIndex];
      // We need to know the arity of the face because we will be building
      // a pair of axis vectors and we need to know which one is the "middle"
      // vertex.
      odd = ( minFaceIndex % 2 ) === 1;
      // I had to determine this order by trial and error, but now it looks
      // like it's a basic rotation, where the last two points of the previou
      // polygon are used as the first two points of the next polygon, what
      // is called a "Triangle Strip".
      v0 = minVerts[odd ? face.b : face.a];
      v1 = minVerts[odd ? face.c : face.b];
      v2 = minVerts[odd ? face.a : face.c];
      // Two vectors define the axes of a plane, i.e. our polygon face
      var axis0 = new THREE.Vector3().subVectors( v1, v0 ).normalize(),
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
        var q = new THREE.Vector3().subVectors( p, v0 );
        // determine how far away from the plane the point lies
        dist = axis2.dot( q );

        // inverting the plane matrix will then let us apply it to the vector in
        // question to figure out the coordinates the point has in that plane.
        m.getInverse( m );
        q.applyMatrix4( m );

        // Now, construct a new plane based on the UV coordinates for the face.
        // We want to figure out where in the texture lies a coordinate that is
        // similar to how the pointer currently relates to the face.
        var uvs = mesh.geometry.faceVertexUvs[0][minFaceIndex],
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

        // This is it, we've got our point now!
        q.applyMatrix4( m );
        q.x /= dx;
        q.y /= dy;
        q.add( uv0 );

        return {
          object: minObj,
          point: q,
          distance: dist,
          axis: axis2
        };
      }
    }
  };


  return MouseInput;
} )();
