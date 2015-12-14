/* global Primrose, THREE */

Primrose.Projector = ( function () {
  function Projector () {
    this.transformCache = {};
    this.vertCache = {};
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.c = new THREE.Vector3();
    this.d = new THREE.Vector3();
    this.m = new THREE.Matrix4();
  }

  function transform ( obj, v ) {
    var p = v.clone();
    while(obj !== null){
      p.applyMatrix4(obj.matrix);
      obj = obj.parent;
    }
    return p;
  }

  // We have to transform the vertices of the geometry into world-space
  // coordinations, because the object they are on could be rotated or
  // positioned somewhere else.
  function getVerts ( obj ) {
    var key = obj.matrix.elements.join( "," );
    if ( key !== this.transformCache[obj.uuid] ) {
      var trans = [ ];
      this.vertCache[obj.uuid] = trans;
      var verts = obj.geometry.vertices;
      for ( var i = 0; i < verts.length; ++i ) {
        trans[i] = transform( obj, verts[i] );
      }
      this.transformCache[obj.uuid] = key;
      obj.geometry.computeBoundingSphere();
      var bounds = obj.geometry.boundingSphere;
      bounds.realCenter = transform( obj, bounds.center );
      bounds.radiusSq = bounds.radius * bounds.radius * 1.20;
    }
    return this.vertCache[obj.uuid];
  }

  Projector.prototype.projectPointer = function ( pointer, camera, objs ) {
    if ( !( objs instanceof Array ) ) {
      objs = [ objs ];
    }
    var p = transform(pointer.parent, pointer.position),
        from = transform(camera.parent, camera.position),
        // We set minAngle to a low value to require the pointer to get close to
        // the object before we project onto it.
        minAngle = Number.MAX_VALUE,
        // We set minDist to a high value to make sure we capture everything.
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
        angle = null;
    
    // Shoot this.a vector to the selector point
    this.d.subVectors( p, from );
    for ( var j = 0; j < objs.length; ++j ) {
      var obj = objs[j];
      if ( obj.visible && obj.geometry.vertices ) {
        faces = obj.geometry.faces;

        var verts = getVerts.call( this, obj ),
            // determine if we're even roughly pointing at an object
            bounds = obj.geometry.boundingSphere;
        this.a.subVectors( bounds.realCenter, p );

        if ( this.a.lengthSq() <= bounds.radiusSq ) {
          // Find the face that is closest to the pointer
          for ( var i = 0; i < faces.length; ++i ) {
            face = faces[i];
            odd = ( i % 2 ) === 1;
            v0 = verts[odd ? face.b : face.a];
            v1 = verts[odd ? face.c : face.b];
            v2 = verts[odd ? face.a : face.c];
            // Shoot a vector from the camera to each of the three corners 
            // of the mesh face
            this.a.subVectors( v0, from ).normalize();
            this.b.subVectors( v1, from ).normalize();
            this.c.subVectors( v2, from ).normalize();
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
            angle = Math.min(
                Math.acos( d1 ),
                Math.acos( d2 ),
                Math.acos( d3 ) );
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
      this.a.subVectors( v1, v0 ).normalize();
      this.b.subVectors( v2, v0 ).normalize();
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

        return {
          object: minObj,
          point: this.d,
          distance: dist,
          axis: this.c
        };
      }
    }
  };

  return Projector;
} )();