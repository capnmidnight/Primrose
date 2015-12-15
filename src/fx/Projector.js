/* global Primrose, THREE */
Primrose.Projector = ( function () {
  function Projector ( isWorker ) {
    if ( isWorker ) {
      importScripts( "~/bin/three.min.js" );
    }
    this.objects = [ ];
    this.transformCache = { };
    this.boundsCache = { };
    this.vertCache = { };
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    this.d = new THREE.Vector3();
    this.m = new THREE.Matrix4();
    this.listeners = {
      hit: [ ]
    };
  }

  Projector.prototype.addObject = function ( obj ) {
    this.objects.push( obj );
  };

  Projector.prototype.fire = function () {
    var args = Array.prototype.slice.call( arguments ),
        evt = args.shift();
    this.listeners[evt].forEach( function ( t ) {
      t.apply( t.executionContext, args );
    } );
  };

  Projector.prototype.addEventListener = function ( evt, handler ) {
    if ( !this.listeners[evt] ) {
      this.listeners[evt] = [ ];
    }
    this.listeners[evt].push( handler );
  };

  Projector.prototype.transform = function ( obj, v ) {
    var p = v.clone();
    while ( obj !== null ) {
      p.applyMatrix4( obj.matrix );
      obj = obj.parent;
    }
    return p;
  };

  // We have to transform the vertices of the geometry into world-space
  // coordinations, because the object they are on could be rotated or
  // positioned somewhere else.
  Projector.prototype.getVerts = function ( obj ) {
    var key = obj.matrix.elements.join( "," );
    if ( key !== this.transformCache[obj.uuid] ) {
      var trans = [ ];
      this.vertCache[obj.uuid] = trans;
      var verts = obj.geometry.vertices;
      for ( var i = 0; i < verts.length; ++i ) {
        trans[i] = this.transform( obj, verts[i] );
      }
      this.transformCache[obj.uuid] = key;
      var bounds = [ ],
          faces = [ ],
          minX = Number.MAX_VALUE,
          minY = Number.MAX_VALUE,
          minZ = Number.MAX_VALUE,
          maxX = Number.MIN_VALUE,
          maxY = Number.MIN_VALUE,
          maxZ = Number.MIN_VALUE;

      this.boundsCache[obj.uuid] = faces;

      for ( i = 0; i < trans.length; ++i ) {
        var v = trans[i];
        minX = Math.min( minX, v.x );
        minY = Math.min( minY, v.y );
        minZ = Math.min( minZ, v.z );
        maxX = Math.max( maxX, v.x );
        maxY = Math.max( maxY, v.y );
        maxZ = Math.max( maxZ, v.z );
      }

      bounds[0] = new THREE.Vector3( minX, maxY, minZ );
      bounds[1] = new THREE.Vector3( maxX, maxY, minZ );
      bounds[2] = new THREE.Vector3( maxX, minY, minZ );
      bounds[3] = new THREE.Vector3( minX, minY, minZ );
      bounds[4] = new THREE.Vector3( minX, maxY, maxZ );
      bounds[5] = new THREE.Vector3( maxX, maxY, maxZ );
      bounds[6] = new THREE.Vector3( maxX, minY, maxZ );
      bounds[7] = new THREE.Vector3( minX, minY, maxZ );

      faces[0] = [ bounds[0], bounds[1], bounds[2], bounds[3] ];
      faces[1] = [ bounds[4], bounds[5], bounds[6], bounds[7] ];
      faces[2] = [ bounds[0], bounds[1], bounds[5], bounds[4] ];
      faces[3] = [ bounds[2], bounds[3], bounds[7], bounds[6] ];
      faces[4] = [ bounds[0], bounds[4], bounds[7], bounds[3] ];
      faces[5] = [ bounds[1], bounds[5], bounds[6], bounds[2] ];
    }
    return this.vertCache[obj.uuid];
  };

  Projector.prototype.projectPointer = function ( p, from ) {
    var // We set minDist to a high value to make sure we capture everything.
        minDist = Number.MAX_VALUE,
        minObj = null,
        // There is currently no selected face
        minFaceIndex = null,
        minVerts = null,
        faces = null,
        face = null,
        odd = null,
        v0 = null,
        v1 = null,
        v2 = null,
        dist = null,
        value = null,
        i,
        j,
        k;

    // Shoot this.a vector to the selector point
    this.d.subVectors( p, from );
    for ( j = 0; j < this.objects.length; ++j ) {
      var obj = this.objects[j];
      if ( obj.visible && obj.geometry.vertices ) {
        var verts = this.getVerts( obj ),
            // determine if we're even roughly pointing at an object
            pointingAtCube = false;

        faces = this.boundsCache[obj.uuid];

        for ( i = 0; i < faces.length && !pointingAtCube; ++i ) {
          var bounds = faces[i],
              insideFace = true;
          for ( k = 0; k < bounds.length && insideFace; ++k ) {
            this.a.subVectors( bounds[k], from );
            insideFace &= this.a.dot( this.d ) >= 0;
          }
          pointingAtCube |= insideFace;
        }

        if ( pointingAtCube ) {
          faces = obj.geometry.faces;
          // Find the face that is closest to the pointer
          for ( i = 0; i < faces.length; ++i ) {
            face = faces[i];
            odd = ( i % 2 ) === 1;
            v0 = verts[odd ? face.b : face.a];
            v1 = verts[odd ? face.c : face.b];
            v2 = verts[odd ? face.a : face.c];
            // Shoot a vector from the camera to each of the three corners
            // of the mesh face
            this.a.subVectors( v0, from )
                .normalize();
            this.b.subVectors( v1, from )
                .normalize();
            this.c.subVectors( v2, from )
                .normalize();
            // Find the distance to the closest point in the polygon
            dist = Math.min(
                p.distanceToSquared( v0 ),
                p.distanceToSquared( v1 ),
                p.distanceToSquared( v2 ) );
            // Find the minimal displacement angle between each of the
            // vectors to the corners and the vector to the pointer. Basically,
            // how "far" does the user have to look to get from the pointer
            // to each of the corners.
            var d1 = this.a.dot( this.d ),
                d2 = this.b.dot( this.d ),
                d3 = this.c.dot( this.d );
            if ( d1 > 0 && d2 > 0 && d3 > 0 && dist < minDist ) {
              minObj = obj;
              minDist = dist;
              minFaceIndex = i;
              minVerts = verts;
            }
          }
        }
      }
    }

    if ( minObj !== null && minFaceIndex !== null ) {
      faces = minObj.geometry.faces;
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
      this.a.subVectors( v1, v0 )
          .normalize();
      this.b.subVectors( v2, v0 )
          .normalize();
      // The cross product of two non-parallel vectors is a new vector that
      // is perpendicular to both of the original vectors, AKA the face
      // "normal" vector. It sticks straight up out of the face, pointing
      // roughly in the direction of our pointer ball.
      this.c.crossVectors( this.a, this.b );
      // This matrix is a succinct way to define our plane. We'll use it
      // later to figure out how to express the location of the pointer ball
      // in corrodinates local to the plane.
      this.m.set(
          this.a.x, this.b.x, this.c.x, 0,
          this.a.y, this.b.y, this.c.y, 0,
          this.a.z, this.b.z, this.c.z, 0,
          0, 0, 0, 1 );

      // A value of 0 will tell us that there is no solvable solution, so we
      // want to avoid that.
      if ( this.m.determinant() !== 0 ) {

        // translate the point of interest into the reference frame of the
        // plane. We don't have to do any rotations because we are treating this
        // object as an infinitely small point.
        this.d.subVectors( p, v0 );
        // determine how far away from the plane the point lies
        dist = this.c.dot( this.d );

        // inverting the plane matrix will then let us apply it to the vector in
        // question to figure out the coordinates the point has in that plane.
        this.m.getInverse( this.m );
        this.d.applyMatrix4( this.m );

        // Now, construct a new plane based on the UV coordinates for the face.
        // We want to figure out where in the texture lies a coordinate that is
        // similar to how the pointer currently relates to the face.
        var uvs = minObj.geometry.faceVertexUvs[0][minFaceIndex],
            uv0 = uvs[odd ? 1 : 0],
            uv1 = uvs[odd ? 2 : 1],
            uv2 = uvs[odd ? 0 : 2];

        // I'm reusing the this.a and this.b vectors here to save memory, these
        // are a wholey new set of axes defining a new plane.
        this.a.set( uv1.x - uv0.x, uv1.y - uv0.y, 0 );
        this.b.set( uv2.x - uv0.x, uv2.y - uv0.y, 0 );

        // The normal for the texture is always straight out in the Z axis, so
        // there is no need to do any sort of calculations.
        this.m.set(
            this.a.x, this.b.x, 0, 0,
            this.a.y, this.b.y, 0, 0,
            this.a.z, this.b.z, 1, 0,
            0, 0, 0, 1 );

        var dx = Math.max( Math.abs( this.a.x ), Math.abs( this.b.x ) ),
            dy = Math.max( Math.abs( this.a.y ), Math.abs( this.b.y ) );

        // This is it, we've got our point now!
        this.d.applyMatrix4( this.m );
        this.d.x /= dx;
        this.d.y /= dy;
        this.d.add( uv0 );

        value = {
          objectID: minObj.uuid,
          point: this.d,
          distance: dist
        };
      }
    }

    this.fire( "hit", value );
  };

  return Projector;
} )();